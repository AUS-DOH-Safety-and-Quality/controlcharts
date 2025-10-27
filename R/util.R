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

validate_settings <- function(type, input_settings, categories) {
  default_settings <- switch(
    type,
    spc = spc_default_settings(),
    funnel = funnel_default_settings()
  )
  has_conditional_formatting <- FALSE
  for (group in names(default_settings)) {
    if (!is.null(input_settings[[group]])) {
      valid_settings <- names(default_settings[[group]])
      invalid_settings <- setdiff(names(input_settings[[group]]), valid_settings)
      if (length(invalid_settings) > 0) {
        stop(
          "Invalid settings in group '", group, "': ", paste0("'", invalid_settings, "'", collapse = ', '),
          ".\nValid settings are: ", paste0("'", valid_settings, "'", collapse = ', '), "."
        )
      }

      # Check that length of vector settings matches number of categories
      for (setting_name in names(input_settings[[group]])) {
        setting_value <- input_settings[[group]][[setting_name]]
        if (length(setting_value) > 1) {
          if (length(setting_value) != length(categories)) {
            stop(
              "Setting '", setting_name, "' in group '", group, "' has length ", length(setting_value),
              " but there are ", length(categories), " observations. ",
              "Either provide a single value or a vector of length equal to the number of observations."
            )
          }
          has_conditional_formatting <- TRUE
          # Only use the first value per unique category
          input_settings[[group]][[setting_name]] <- aggregate(setting_value,
            by = list(categories),
            FUN = function(x) x[1]
          )[, 2]
        }
      }
    }
  }
  list(
    input_settings = input_settings,
    has_conditional_formatting = has_conditional_formatting
  )
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
      # SPC Charts need more padding at the bottom for the x-axis dates
      x_tick_size <- ifelse(is.null(settings$x_axis) || is.null(settings$x_axis$xlimit_tick_size), 10, settings$x_axis$xlimit_tick_size)
      settings$canvas$lower_padding <- settings$canvas$lower_padding + ifelse(type == "spc", 50, 10 + x_tick_size)
      settings
    }
  )
  dataViews
}

create_static <- function(type, dataViews, input_settings, width, height) {
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

    # Remove columns for any outlier patterns that were not used
    outlier_cols <- c("astronomical", "shift", "trend", "two_in_three")
    if (!is.null(input_settings$outliers)) {
      for (pattern in names(input_settings$outliers)) {
        if ((pattern %in% outlier_cols) && input_settings$outliers[[pattern]]) {
          outlier_cols <- setdiff(outlier_cols, pattern)
        }
      }
    }
    # Return table uses 'astpoint' while input settings use 'astronomical'
    outlier_cols[outlier_cols == "astronomical"] <- "astpoint"
    # Remove any outlier columns that were not used
    limits <- limits[, !(names(limits) %in% outlier_cols), drop = FALSE]
  } else if (type == "funnel") {
    values <- lapply(raw_ret$plotPoints, function(obs) {
      data.frame(
        group = obs$group_text,
        numerator = obs$numerator,
        denominator = obs$x,
        value = obs$value,
        two_sigma = obs$two_sigma,
        three_sigma = obs$three_sigma
      )
    })
    values <- do.call(rbind.data.frame, values)

    limits <-
      lapply(raw_ret$calculatedLimits, function(limit_grp) {
        limit_grp <- lapply(limit_grp, function(x) ifelse(is.null(x) || is.nan(x), NA, x))
        data.frame(limit_grp)
      })
    limits <- do.call(rbind.data.frame, limits)
    limits <- merge(values, limits, by.x = "denominator", by.y = "denominators")

    #  Remove columns for any outlier patterns that were not used
    drop_cols <- c("two_sigma", "three_sigma")
    if (!is.null(input_settings$outliers)) {
      for (pattern in names(input_settings$outliers)) {
        if ((pattern %in% drop_cols) && input_settings$outliers[[pattern]]) {
          drop_cols <- setdiff(drop_cols, pattern)
        }
      }
    }
    # Remove alt-target column if not used
    if (is.null(input_settings$lines) || is.null(input_settings$lines$alt_target)) {
      drop_cols <- c(drop_cols, "alt_target")
    }
    limits <- limits[, !(names(limits) %in% drop_cols), drop = FALSE]
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
