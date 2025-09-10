#' Generate interactive Funnel chart
#'
#' @param keys A vector or column name representing the categories of the chart.
#' @param numerators A numeric vector or column name representing the numerators for each category.
#' @param denominators A numeric vector or column name representing the denominators for each category.
#' @param tooltips A vector or column name representing the tooltips for each category.
#' @param labels A vector or column name representing the labels for each category.
#' @param data A data frame containing the data for the chart.
#' @param canvas_settings Optional list of settings for the canvas, see \code{funnel_default_settings('canvas')} for valid options.
#' @param funnel_settings Optional list of settings for the Funnel chart, see \code{funnel_default_settings('funnel')} for valid options.
#' @param outlier_settings Optional list of settings for outliers, see \code{funnel_default_settings('outliers')} for valid options.
#' @param scatter_settings Optional list of settings for scatter points, see \code{funnel_default_settings('scatter')} for valid options.
#' @param line_settings Optional list of settings for lines, see \code{funnel_default_settings('lines')} for valid options.
#' @param x_axis_settings Optional list of settings for the x-axis, see \code{funnel_default_settings('x_axis')} for valid options.
#' @param y_axis_settings Optional list of settings for the y-axis, see \code{funnel_default_settings('y_axis')} for valid options.
#' @param label_settings Optional list of settings for labels, see \code{funnel_default_settings('labels')} for valid options.
#' @param width Optional width of the chart in pixels. If NULL (default), the chart will fill the width of its container.
#' @param height Optional height of the chart in pixels. If NULL (default), the chart will fill the height of its container.
#' @param elementId Optional HTML element ID for the chart.
#'
#' @return An object of class \code{controlchart} containing the interactive plot, static plot, limits data frame, raw data, and a function to save the plot.
#'
#' @export
funnel <- function(keys,
                numerators,
                denominators,
                tooltips,
                labels,
                data,
                canvas_settings = NULL,
                funnel_settings = NULL,
                outlier_settings = NULL,
                scatter_settings = NULL,
                line_settings = NULL,
                x_axis_settings = NULL,
                y_axis_settings = NULL,
                label_settings = NULL,
                width = NULL,
                height = NULL,
                elementId = NULL) {
  if (missing(keys)) {
    stop("keys are required", call. = FALSE)
  }
  if (missing(numerators)) {
    stop("numerators are required", call. = FALSE)
  }
  if (missing(denominators)) {
    stop("denominators are required", call. = FALSE)
  }
  if (missing(data)) {
    stop("data is required", call. = FALSE)
  }

  if (crosstalk::is.SharedData(data)) {
    crosstalkIdentities <- data$key()
    crosstalkGroup <- data$groupName()
    input_data <- data$origData()
  } else {
    crosstalkIdentities <-  as.character(seq_len(nrow(data)))
    crosstalkGroup <- NULL
    input_data <- data
  }

  input_settings <- list(
    canvas = canvas_settings,
    funnel = funnel_settings,
    outliers = outlier_settings,
    scatter = scatter_settings,
    lines = line_settings,
    x_axis = x_axis_settings,
    y_axis = y_axis_settings,
    labels = label_settings
  )
  input_settings <- validate_settings('spc', input_settings)

  data_raw <- list(
    crosstalkIdentities = crosstalkIdentities,
    categories = eval(substitute(keys), input_data, parent.frame()),
    numerators = eval(substitute(numerators), input_data, parent.frame()),
    denominators = eval(substitute(denominators), input_data, parent.frame())
  )

  if (!missing(tooltips)) {
    tooltips <- as.character(eval(substitute(tooltips), input_data, parent.frame()))
    data_raw <- append(data_raw, list(tooltips = tooltips))
  }

  if (!missing(labels)) {
    labels <- as.character(eval(substitute(labels), input_data, parent.frame()))
    data_raw <- append(data_raw, list(labels = labels))
  }

  data_df <- lapply(seq_len(length(data_raw$categories)), function(idx) {
    lapply(data_raw, function(elem){ elem[idx] })
  })

  # create widget
  html_plt <- htmlwidgets::createWidget(
    name = 'funnel',
    x = list(
      data_raw = data_df,
      input_settings = input_settings,
      crosstalkGroup = crosstalkGroup
    ),
    sizingPolicy = htmlwidgets::sizingPolicy(
      defaultWidth = "100%"
    ),
    width = width,
    height = height,
    package = "controlcharts",
    elementId = elementId,
    dependencies = crosstalk::crosstalkLibs()
  )

  dataViews <- update_static_padding(
    "funnel",
    ctx$call("makeUpdateValues", data_df, input_settings)$dataViews
  )

  static <- create_static(
    type = 'funnel',
    dataViews = dataViews,
    width = width,
    height = height
  )

  structure(
    list(
      html_plot = html_plt,
      static_plot = static$static_plot,
      limits = static$limits,
      raw = static$raw,
      save_plot = create_save_function('funnel', html_plt, dataViews)
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
#' @name funnel-shiny
#'
#' @export
funnelOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'funnel', width, height, package = 'controlcharts')
}

#' @rdname funnel-shiny
#' @export
renderfunnel <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, funnelOutput, env, quoted = TRUE)
}
