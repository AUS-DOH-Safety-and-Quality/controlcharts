#' Generate interactive Funnel chart
#'
#' @param data A data frame containing the data for the chart.
#' @param keys A vector or column name representing the categories of the chart.
#' @param numerators A numeric vector or column name representing the numerators
#' for each category.
#' @param denominators A numeric vector or column name representing the
#' denominators for each category.
#' @param tooltips A vector or column name representing the tooltips
#' for each category.
#' @param labels A vector or column name representing the labels
#' for each category.
#' @param aggregations A list of aggregation function names
#' for each field if multiple values are provided for each key.
#' Valid options are:
#'   \itemize{
#'     \item \code{"first"}: returns the first value
#'     \item \code{"last"}: returns the last value
#'     \item \code{"sum"}: returns the sum of values
#'     \item \code{"mean"}: returns the mean of values
#'     \item \code{"min"}: returns the minimum value
#'     \item \code{"max"}: returns the maximum value
#'     \item \code{"median"}: returns the median value
#'     \item \code{"count"}: returns the count of values
#'   }
#' @param title Optional title to be added to the top of the chart.
#' It can be a character string for the title text only,
#' or a list with the following options:
#' \itemize{
#'  \item \code{text}: Title text (default: NULL)
#'  \item \code{font_size}: Font size of the title (default: "16px")
#'  \item \code{font_weight}: Font weight of the title
#' (default: "bold")
#'  \item \code{font_family}: Font family of the title
#' (default: "'Arial', sans-serif")
#'  \item \code{x}: Horizontal (x) position of the title as a percentage
#' (default: "50%")
#'  \item \code{y}: Vertical (y) position of the title in pixels (default: 5)
#'  \item \code{text_anchor}: Text anchor of the title (default: "middle")
#'  \item \code{dominant_baseline}: Dominant baseline of the title
#' (default: "hanging")
#' }
#' @param canvas_settings Optional list of settings for the canvas,
#' see \code{funnel_default_settings('canvas')} for valid options.
#' @param funnel_settings Optional list of settings for the Funnel chart,
#' see \code{funnel_default_settings("funnel")} for valid options.
#' @param outlier_settings Optional list of settings for outliers,
#' see \code{funnel_default_settings('outliers')} for valid options.
#' @param scatter_settings Optional list of settings for scatter points,
#' see \code{funnel_default_settings('scatter')} for valid options.
#' @param line_settings Optional list of settings for lines,
#' see \code{funnel_default_settings('lines')} for valid options.
#' @param x_axis_settings Optional list of settings for the x-axis,
#' see \code{funnel_default_settings('x_axis')} for valid options.
#' @param y_axis_settings Optional list of settings for the y-axis,
#' see \code{funnel_default_settings('y_axis')} for valid options.
#' @param label_settings Optional list of settings for labels,
#' see \code{funnel_default_settings('labels')} for valid options.
#' @param tooltip_settings Optional list of settings for tooltips,
#' see \code{funnel_default_settings('tooltips')} for valid options.
#' @param width Optional width of the chart in pixels. If NULL (default),
#' the chart will fill the width of its container.
#' @param height Optional height of the chart in pixels. If NULL (default),
#' the chart will fill the height of its container.
#' @param elementId Optional HTML element ID for the chart.
#' @param return_objs Character vector of object types to return.
#' Valid values are:
#' \itemize{
#'  \item \code{"html_plot"}: Interactive `htmlwidgets` plot
#'  \item \code{"static_plot"}: Non-interactive SVG plot
#'  \item \code{"limits"}: Calculated control limits
#' }
#'
#' @return An object of class \code{controlchart} containing the
#' interactive plot, static plot, limits data frame, raw data,
#' and a function to save the plot.
#'
#' @export
funnel <- function(data,
                   keys,
                   numerators,
                   denominators,
                   tooltips,
                   labels,
                   aggregations = list(
                     numerators = "sum",
                     denominators = "sum",
                     tooltips = "first",
                     labels = "first"
                   ),
                   title = NULL,
                   canvas_settings = NULL,
                   funnel_settings = NULL,
                   outlier_settings = NULL,
                   scatter_settings = NULL,
                   line_settings = NULL,
                   x_axis_settings = NULL,
                   y_axis_settings = NULL,
                   label_settings = NULL,
                   tooltip_settings = NULL,
                   width = NULL,
                   height = NULL,
                   elementId = NULL,
                   return_objs = c("html_plot", "static_plot", "limits")
                  ) {
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

  is_crosstalk <- crosstalk::is.SharedData(data)
  if (is_crosstalk) {
    crosstalk_identities <- data$key()
    crosstalk_group <- data$groupName()
    input_data <- data$origData()
  } else {
    crosstalk_identities <- as.character(seq_len(nrow(data)))
    crosstalk_group <- NULL
    input_data <- data
  }

  categories <- as.character(eval(substitute(keys), input_data, parent.frame()))
  cat_order <- order(categories)
  crosstalk_identities <- crosstalk_identities[cat_order]
  input_data <- input_data[cat_order,]

  input_settings <- list(
    canvas = eval(substitute(canvas_settings), input_data, parent.frame()),
    funnel = eval(substitute(funnel_settings), input_data, parent.frame()),
    outliers = eval(substitute(outlier_settings), input_data, parent.frame()),
    scatter = eval(substitute(scatter_settings), input_data, parent.frame()),
    lines = eval(substitute(line_settings), input_data, parent.frame()),
    x_axis = eval(substitute(x_axis_settings), input_data, parent.frame()),
    y_axis = eval(substitute(y_axis_settings), input_data, parent.frame()),
    labels = eval(substitute(label_settings), input_data, parent.frame())
  )

  categories <- as.character(eval(substitute(keys), input_data, parent.frame()))
  cat_order <- order(categories)

  data_raw <- list(
    crosstalk_identities = crosstalk_identities[cat_order],
    categories = categories[cat_order],
    numerators = eval(substitute(numerators), input_data, parent.frame())[cat_order],
    denominators = eval(substitute(denominators), input_data, parent.frame())[cat_order]
  )

  if (!missing(tooltips)) {
    data_raw$tooltips <- as.character(eval(substitute(tooltips), input_data, parent.frame()))[cat_order]
  }

  if (!missing(labels)) {
    data_raw$labels <- as.character(eval(substitute(labels), input_data, parent.frame()))[cat_order]
  }

  create_controlchart("funnel", data_raw, cat_order, is_crosstalk, crosstalk_group,
                      input_settings, aggregations, title, tooltip_settings,
                      width, height, elementId, return_objs)
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
funnelOutput <- function(outputId, # nolint: object_name_linter.
                         width = "100%", height = "400px") {
  htmlwidgets::shinyWidgetOutput(outputId, "funnel", width, height,
                                 package = "controlcharts")
}

#' @rdname funnel-shiny
#' @export
renderfunnel <- function(expr, # nolint: object_name_linter.
                         env = parent.frame(), quoted = FALSE) {
  if (!quoted) {
    expr <- substitute(expr)
  } # force quoted
  htmlwidgets::shinyRenderWidget(expr, funnelOutput, env, quoted = TRUE)
}
