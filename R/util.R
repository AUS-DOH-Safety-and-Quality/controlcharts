.default_settings_impl <- function(type, group = NULL) {
  settings <- switch(
    type,
    spc = .spc_default_settings_internal,
    funnel = .funnel_default_settings_internal
  )
  if (is.null(group)) {
    return(settings)
  }
  if (!(group %in% names(settings))) {
    stop("'", group, "' is not a valid settings group! Valid options are: ", paste0(names(settings), collapse = ', '))
  }
  settings[[group]]
}

#' Get default settings for SPC charts
#'
#' Retrieve the default settings for SPC charts or a specific settings group.
#' @param group Optional. A specific settings group to retrieve. If NULL, all settings groups are returned.
#' @return A list of default settings for SPC charts or the specified settings group.
#' @examples
#' #' # Get all default settings for SPC charts
#' spc_default_settings()
#' # # Get default settings for a specific group
#' spc_default_settings("x_axis")
#' @export
spc_default_settings <- function(group = NULL) {
  .default_settings_impl("spc", group)
}

#' Get default settings for Funnel charts
#' Retrieve the default settings for Funnel charts or a specific settings group.
#' @param group Optional. A specific settings group to retrieve. If NULL, all settings groups are returned.
#' @return A list of default settings for Funnel charts or the specified settings group.
#' @examples
#' #' # Get all default settings for Funnel charts
#' funnel_default_settings()
#' # # Get default settings for a specific group
#' funnel_default_settings("x_axis")
#' @export
funnel_default_settings <- function(group = NULL) {
  .default_settings_impl("funnel", group)
}

validate_settings <- function(type, input_settings) {
  default_settings <- switch(
    type,
    spc = spc_default_settings(),
    funnel = funnel_default_settings()
  )
  for (group in names(default_settings)) {
    if (!is.null(input_settings[[group]])) {
      valid_settings <- names(default_settings[[group]])
      invalid_settings <- setdiff(names(input_settings[[group]]), valid_settings)
      if (length(invalid_settings) > 0) {
        stop("Invalid settings in group '", group, "': ", paste0("'", invalid_settings, "'", collapse = ', '), ".\nValid settings are: ", paste0("'", valid_settings, "'", collapse = ', '), ".")
      }
    }
  }
  input_settings
}

validate_aggregations <- function(aggregations) {
  if (is.null(aggregations)) {
    return(NULL)
  }
  if (!is.list(aggregations)) {
    stop("Aggregations must be a list.", call. = FALSE)
  }

  all_defaults <- list(
    numerators = "sum",
    denominators = "sum",
    groupings = "first",
    xbar_sds = "first",
    tooltips = "first",
    labels = "first"
  )
  valid_aggregations <- c("first", "last", "sum", "mean", "min", "max", "median", "count")
  for (new_agg in names(aggregations)) {
    if (!(new_agg %in% names(all_defaults))) {
      stop("'", new_agg, "' is not a valid variable to aggregate! Valid options are: ", paste0(names(all_defaults), collapse = ', '), ".", call. = FALSE)
    }
    if (!(aggregations[[new_agg]] %in% valid_aggregations)) {
      stop("'", aggregations[[new_agg]], "' is not a valid aggregation! Valid options are: ", paste0(valid_aggregations, collapse = ', '), ".", call. = FALSE)
    }
    all_defaults[[new_agg]] <- aggregations[[new_agg]]
  }
  all_defaults
}

svg_string <- function(svg, width, height) {
  paste0('<svg viewBox="0 0 ', width, ' ', height, '" width="', width, 'px" height="', height, 'px" xmlns="http://www.w3.org/2000/svg">',
        '<rect x="0" y="0" width="100%" height="100%" fill="white"/>',
        svg,
        '</svg>')
}

update_static_padding <- function(type, dataViews) {
  dataViews[[1]]$categorical$categories[[1]]$objects <- lapply(
    dataViews[[1]]$categorical$categories[[1]]$objects,
    function(settings) {
      if (is.null(settings$canvas)) {
        settings$canvas <- .default_settings_impl(type, "canvas")
      } else if (is.null(settings$canvas$left_padding)) {
        settings$canvas <- modifyList(.default_settings_impl(type, "canvas"), settings$canvas)
      }
      settings$canvas$left_padding <- settings$canvas$left_padding + 50
      settings$canvas$lower_padding <- settings$canvas$lower_padding + 50
      settings
    }
  )
  dataViews
}

create_static <- function(type, dataViews, width, height) {
  fixed_dimensions <- !is.null(width) && !is.null(height)
  width <- ifelse(is.null(width), 640, width)
  height <- ifelse(is.null(height), 400, height)
  raw_ret <- ctx$call("updateHeadlessVisual", type, dataViews, width, height)
  if ("error" %in% names(raw_ret)) {
    stop(raw_ret$error, call. = FALSE)
  }
  static_plot <- structure(
    list(
      type = type,
      dataViews = dataViews,
      svg = raw_ret$svg,
      # Don't process and rasterise the SVG until requested
      raster = NULL,
      # Set to non-null values, will be updated when printed
      width = width,
      height = height,
      fixed_dimensions = fixed_dimensions
    ),
    class = "static_plot"
  )
  limits <- NULL
  if (type == "spc") {
    limits <- lapply(raw_ret$plotPoints, function(elem) elem$table_row)
      # Depending on the chart type, the 'numerators' and 'denominators' may be
      # empty, so we need to remove them from the list
    limits <- lapply(limits, function(lim) data.frame(lim[!sapply(lim, is.null)]))
    limits <- do.call(rbind.data.frame, limits)
    limits$date <- trimws(limits$date)
  } else if (type == "funnel") {
    values <- lapply(raw_ret$plotPoints, function(obs) { data.frame(group = obs$group_text, denominator = obs$x, value = obs$value)  })
    values <- do.call(rbind.data.frame, values)
    limits <-
      lapply(raw_ret$calculatedLimits, function(limit_grp) {
        limit_grp <- lapply(limit_grp, function(x) ifelse(is.null(x) || is.nan(x), NA, x))
        data.frame(limit_grp)
      })
    limits <- do.call(rbind.data.frame, limits)
    limits <- merge(values, limits, by.x = "denominator", by.y = "denominators")
  }
  list(
    limits = limits,
    static_plot = static_plot,
    raw = raw_ret
  )
}

create_save_function <- function(type, html_plt, dataViews, orig_width = NULL, orig_height = NULL) {
  function(file, width = NULL, height = NULL) {
    file_ext <- tools::file_ext(file)
    valid_exts <- c("webp", "png", "pdf", "svg", "ps", "eps", "html")
    if (!(file_ext %in% valid_exts)) {
      stop("'", file_ext, "' is not a supported file type! Valid options are: ", paste0(valid_exts, collapse = ', '))
    }
    if (file_ext == "html") {
      htmlwidgets::saveWidget(html_plt, file, selfcontained = TRUE)
      return(invisible(NULL))
    }
    if (!(file_ext %in% c("html", "svg"))) {
      if (!requireNamespace("rsvg", quietly = TRUE)) {
        stop("The 'rsvg' package is required for saving plots in formats other than SVG or HTML but is not installed.", call. = FALSE)
      }
    }

    width <- ifelse(is.null(width), ifelse(is.null(orig_width), 640, orig_width), width)
    height <- ifelse(is.null(height), ifelse(is.null(orig_height), 480, orig_height), height)

    svg <- ctx$call("updateHeadlessVisual", type, dataViews, width, height)$svg
    svg_resized <- svg_string(svg, width, height)

    if (file_ext == "svg") {
      writeLines(svg_resized, file)
      return(invisible(NULL))
    }

    save_fun <- switch(
      file_ext,
      webp = rsvg::rsvg_webp,
      png = rsvg::rsvg_png,
      pdf = rsvg::rsvg_pdf,
      ps = rsvg::rsvg_ps,
      eps = rsvg::rsvg_eps
    )

    save_fun(charToRaw(svg_resized), file, width = width * 3, height = height * 3)
    invisible(NULL)
  }
}
