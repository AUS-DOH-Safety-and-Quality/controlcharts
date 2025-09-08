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


first <- function(x) {
  head(x, 1)
}

values_entry <- function(name, values, objects = NULL) {
  roles <- list(dummy = TRUE)
  names(roles) <- name
  type <- list()
  if (name == "key") {
    type <- list(temporal = list(underlyingType = 519))
  }
  list(
    list(
      source = list(
        roles = roles,
        type = type
      ),
      values = values,
      objects = objects
    )
  )
}

prep_settings <- function(type, input_settings) {
  default_settings <- switch(
    type,
    spc = spc_default_settings(),
    funnel = funnel_default_settings()
  )
  for (group in names(default_settings)) {
    if (!is.null(input_settings[[group]])) {
      default_settings[[group]] <- modifyList(default_settings[[group]], input_settings[[group]])
    }
  }
  default_settings
}

create_interactive <- function(type, categories, values, crosstalk_keys, crosstalk_group, width, height, elementId) {
  x <- list(
    categories = categories,
    values = values,
    settings = list(
      crosstalk_keys = crosstalk_keys,
      crosstalk_group = crosstalk_group
    )
  )

  htmlwidgets::createWidget(
    name = type,
    x,
    sizingPolicy = htmlwidgets::sizingPolicy(
      defaultWidth = "100%"
    ),
    width = width,
    height = height,
    package = "controlcharts",
    elementId = elementId,
    dependencies = crosstalk::crosstalkLibs()
  )
}

svg_string <- function(svg, width, height) {
  paste('<svg viewBox="0 0', width, height, '" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100%" height="100%" fill="white"/>', svg, '</svg>')
}

create_static <- function(type, categories, values, width, height) {
  categories[[1]]$objects <- lapply(categories[[1]]$objects, function(obj) {
    obj$canvas$left_padding <- obj$canvas$left_padding + 50
    obj$canvas$lower_padding <- obj$canvas$lower_padding + 50
    obj
  })
  raw_ret <- ctx$call("update_visual", type, categories, values, width, height)
  static_plot <- structure(
    list(
      type = type,
      categories = categories,
      values = values,
      width = width,
      height = height
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

create_save_fun <- function(type, html_plt, categories, values) {
  function(file, height = NULL, width = NULL) {
    file_ext <- tools::file_ext(file)
    valid_exts <- c("webp", "png", "pdf", "svg", "ps", "eps", "html")
    if (!(file_ext %in% valid_exts)) {
      stop("'", file_ext, "' is not a supported file type! Valid options are: ", paste0(valid_exts, collapse = ', '))
    }
    if (file_ext == "html") {
      htmlwidgets::saveWidget(html_plt, file, selfcontained = TRUE)
      return(invisible(NULL))
    }

    save_fun <- switch(
      file_ext,
      webp = rsvg::rsvg_webp,
      png = rsvg::rsvg_png,
      pdf = rsvg::rsvg_pdf,
      svg = rsvg::rsvg_svg,
      ps = rsvg::rsvg_ps,
      eps = rsvg::rsvg_eps
    )

    if (dev.cur() != 1) {
      viewer_dims <- grDevices::dev.size("px")
      width <- ifelse(is.null(width), viewer_dims[1], width)
      height <- ifelse(is.null(height), viewer_dims[2], height)
    } else {
      width <- ifelse(is.null(width), 640, width)
      height <- ifelse(is.null(height), 400, height)
    }

    svg <- ctx$call("update_visual", type, categories, values, width, height)$svg
    svg_resized <- svg_string(svg, width, height)
    save_fun(charToRaw(svg_resized), file, width = width * 3, height = height * 3)
    invisible(NULL)
  }
}

#' @exportS3Method
print.static_plot <- function(x, ...) {
  grid::grid.newpage()
  viewer_dims <- grDevices::dev.size("px")
  width <- ifelse(is.null(x$width), viewer_dims[1], x$width)
  height <- ifelse(is.null(x$height), viewer_dims[2], x$height)
  svg <- ctx$call("update_visual", x$type, x$categories, x$values, width, height)$svg
  svg_resized <- svg_string(svg, width, height)
  # Rasterize at 3x resolution for better quality
  svg <- rsvg::rsvg_nativeraster(charToRaw(svg_resized), width=width*3, height=height*3)
  grid::grid.raster(svg)
}

#' @exportS3Method
print.controlchart <- function(x, ...) {
  print(x$html_plot)
}