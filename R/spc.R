#' Generate interactive SPC chart
#'
#' @param keys A vector or column name representing the categories (x-axis) of the chart.
#' @param numerators A numeric vector or column name representing the numerators for each category.
#' @param denominators A numeric vector or column name representing the denominators for each category.
#' @param groupings A vector or column name representing the grouping for each category.
#' @param xbar_sds A numeric vector or column name representing the x-bar and standard deviation values for each category.
#' @param tooltips A vector or column name representing the tooltips for each category.
#' @param labels A vector or column name representing the labels for each category.
#' @param data A data frame containing the data for the chart.
#' @param canvas_settings Optional list of settings for the canvas, see \code{spc_default_settings('canvas')} for valid options.
#' @param spc_settings Optional list of settings for the SPC chart, see \code{spc_default_settings('spc')} for valid options.
#' @param outlier_settings Optional list of settings for outliers, see \code{spc_default_settings('outliers')} for valid options.
#' @param nhs_icon_settings Optional list of settings for NHS icons, see \code{spc_default_settings('nhs_icons')} for valid options.
#' @param scatter_settings Optional list of settings for scatter points, see \code{spc_default_settings('scatter')} for valid options.
#' @param line_settings Optional list of settings for lines, see \code{spc_default_settings('lines')} for valid options.
#' @param x_axis_settings Optional list of settings for the x-axis, see \code{spc_default_settings('x_axis')} for valid options.
#' @param y_axis_settings Optional list of settings for the y-axis, see \code{spc_default_settings('y_axis')} for valid options.
#' @param date_settings Optional list of settings for dates, see \code{spc_default_settings('dates')} for valid options.
#' @param label_settings Optional list of settings for labels, see \code{spc_default_settings('labels')} for valid options.
#' @param width Optional width of the chart in pixels. If NULL (default), the chart will fill the width of its container.
#' @param height Optional height of the chart in pixels. If NULL (default), the chart will fill the height of its container.
#' @param elementId Optional HTML element ID for the chart.
#'
#' @return An object of class \code{controlchart} containing the interactive plot, static plot, limits data frame, raw data, and a function to save the plot.
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
  spc_categories <- values_entry('key', unique(keys), lapply(unique(keys), function(x) chart_settings))


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
