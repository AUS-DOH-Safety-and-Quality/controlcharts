#' @exportS3Method
print.static_plot <- function(x, ...) {
  grid::grid.newpage()
  viewer_dims <- grDevices::dev.size("px")
  width <- viewer_dims[1]
  height <- viewer_dims[2]
  message("Rendering static plot at ", width, "x", height, " pixels")
  svg <- spc_ctx$call("update_visual", x$type, x$categories, x$values, width, height)$svg
  svg_resized <- svg_string(svg, width, height)
  # Rasterize at 3x resolution for better quality
  svg <- rsvg::rsvg_nativeraster(charToRaw(svg_resized), width=width*3, height=height*3)
  grid::grid.raster(svg)
}

#' @exportS3Method
print.controlchart <- function(x, ...) {
  print(x$html_plot)
}


#' Generate interactive SPC chart
#'
#'
#'
#' @import htmlwidgets
#' @import crosstalk
#' @importFrom stats aggregate
#' @importFrom rsvg rsvg_nativeraster
#' @importFrom grid grid.raster
#'
#' @export
spc <- function(keys,
                numerators,
                denominators,
                groupings,
                xbar_sds,
                tooltips,
                labels,
                data,
                canvas_settings = NULL,
                spc_settings = NULL,
                outlier_settings = NULL,
                nhs_icon_settings = NULL,
                scatter_settings = NULL,
                line_settings = NULL,
                x_axis_settings = NULL,
                y_axis_settings = NULL,
                date_settings = NULL,
                label_settings = NULL,
                width = NULL,
                height = NULL,
                elementId = NULL) {
  if (crosstalk::is.SharedData(data)) {
    crosstalk_keys <- data$key()
    crosstalk_group <- data$groupName()
    input_data <- data$origData()
  } else {
    crosstalk_keys <- NULL
    crosstalk_group <- NULL
    input_data <- data
  }

  chart_settings <- prep_settings('spc', list(
    canvas = canvas_settings,
    spc = spc_settings,
    outliers = outlier_settings,
    nhs_icons = nhs_icon_settings,
    scatter = scatter_settings,
    lines = line_settings,
    x_axis = x_axis_settings,
    y_axis = y_axis_settings,
    dates = date_settings,
    labels = label_settings
  ))

  keys <- eval(substitute(keys), input_data, parent.frame())
  spc_categories <- values_entry('key', unique(keys), lapply(unique(keys), \(x) chart_settings))


  if (!is.null(crosstalk_keys)) {
    crosstalk_keys <- split(crosstalk_keys, keys)
  }

  spc_values <- list()
  if (!missing(numerators)) {
    numerators <- as.numeric(eval(substitute(numerators), input_data, parent.frame()))
    numerators <- aggregate(numerators, by = list(keys), FUN = sum)$x
    spc_values <- append(spc_values, values_entry('numerators', numerators))
  }

  if (!missing(denominators)) {
    denominators <- as.numeric(eval(substitute(denominators), input_data, parent.frame()))
    denominators <- aggregate(denominators, by = list(keys), FUN = sum)$x
    spc_values <- append(spc_values, values_entry('denominators', denominators))
  }

  if (!missing(groupings)) {
    groupings <- as.character(eval(substitute(groupings), input_data, parent.frame()))
    groupings <- aggregate(groupings, by = list(keys), FUN = first)$x
    spc_values <- append(spc_values, values_entry('groupings', groupings))
  }

  if (!missing(xbar_sds)) {
    xbar_sds <- as.numeric(eval(substitute(xbar_sds), input_data, parent.frame()))
    xbar_sds <- aggregate(xbar_sds, by = list(keys), FUN = sum)$x
    spc_values <- append(spc_values, values_entry('xbar_sds', xbar_sds))
  }

  if (!missing(tooltips)) {
    tooltips <- as.character(eval(substitute(tooltips), input_data, parent.frame()))
    tooltips <- aggregate(tooltips, by = list(keys), FUN = first)$x
    spc_values <- append(spc_values, values_entry('tooltips', tooltips))
  }

  if (!missing(labels)) {
    labels <- as.character(eval(substitute(labels), input_data, parent.frame()))
    labels <- aggregate(labels, by = list(keys), FUN = first)$x
    spc_values <- append(spc_values, values_entry('labels', labels))
  }

  # create widget
  html_plt <- create_interactive(
    type = 'spc',
    categories = spc_categories,
    values = spc_values,
    crosstalk_keys = crosstalk_keys,
    crosstalk_group = crosstalk_group,
    width = width,
    height = height,
    elementId = elementId
  )

  static <- create_static(
    type = 'spc',
    categories = spc_categories,
    values = spc_values,
    width = width,
    height = height
  )

  structure(
    list(
      html_plot = html_plt,
      static_plot = static$static_plot,
      limits = static$limits,
      raw = static$raw,
      save_plot = create_save_fun('spc', html_plt, spc_categories, spc_values)
    ),
    class = "controlchart"
  )
}

#' Shiny bindings for wrapper
#'
#' Output and render functions for using wrapper within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a wrapper
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name spc-shiny
#'
#' @export
spcOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'spc', width, height, package = 'controlcharts')
}

#' @rdname spc-shiny
#' @export
renderSpc <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, spcOutput, env, quoted = TRUE)
}
