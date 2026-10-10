#' Generate interactive SPC chart
#'
#' @param data A data frame containing the data for the chart.
#' @param keys A vector or column name representing the categories
#' (x-axis) of the chart.
#' @param numerators A numeric vector or column name representing the
#' numerators for each category.
#' @param denominators A numeric vector or column name representing the
#' denominators for each category.
#' @param groupings A vector or column name representing the grouping for
#' each category.
#' @param indicators A vector or list of vectors representing indicator
#' categories for the summary table.
#' @param xbar_sds A numeric vector or column name representing the x-bar
#' and standard deviation values for each category.
#' @param tooltips A vector or column name, or a list of them, representing
#' additional tooltips for each category. Each is labelled by its name in the
#' list, or else by the expression supplied.
#' @param labels A vector or column name representing the labels for each
#' category.
#' @param aggregations A list of aggregation function names for each field
#' if multiple values are provided for each key. Valid options are:
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
#' It can be a character string for the title text only, or a list with
#' the following options:
#' \itemize{
#'  \item \code{text}: Title text (default: NULL)
#'  \item \code{font_size}: Font size of the title (default: "16px")
#'  \item \code{font_weight}: Font weight of the title (default: "bold")
#'  \item \code{font_family}: Font family of the title
#' (default: "'Arial', sans-serif")
#'  \item \code{x}: Horizontal (x) position of the title
#' as a percentage (default: "50%")
#'  \item \code{y}: Vertical (y) position of the title in pixels (default: 5)
#'  \item \code{text_anchor}: Text anchor of the title (default: "middle")
#'  \item \code{dominant_baseline}: Dominant baseline of the
#' title (default: "hanging")
#'  \item \code{subtitle}: Subtitle text, drawn below the title (default: NULL)
#'  \item \code{subtitle_font_size}: Font size of the subtitle (default: "12px")
#'  \item \code{subtitle_font_weight}: Font weight of the subtitle
#' (default: "normal")
#' }
#' @param canvas_settings Optional list of settings for the canvas,
#' see \code{spc_default_settings('canvas')} for valid options.
#' @param spc_settings Optional list of settings for the SPC chart,
#' see \code{spc_default_settings('spc')} for valid options.
#' @param outlier_settings Optional list of settings for outliers,
#' see \code{spc_default_settings('outliers')} for valid options.
#' @param nhs_icon_settings Optional list of settings for NHS icons,
#' see \code{spc_default_settings('nhs_icons')} for valid options.
#' @param scatter_settings Optional list of settings for scatter points,
#' see \code{spc_default_settings('scatter')} for valid options.
#' @param line_settings Optional list of settings for lines,
#' see \code{spc_default_settings('lines')} for valid options.
#' @param x_axis_settings Optional list of settings for the x-axis,
#' see \code{spc_default_settings('x_axis')} for valid options.
#' @param y_axis_settings Optional list of settings for the y-axis,
#' see \code{spc_default_settings('y_axis')} for valid options.
#' @param date_settings Optional list of settings for dates,
#' see \code{spc_default_settings('dates')} for valid options.
#' @param label_settings Optional list of settings for labels,
#' see \code{spc_default_settings('labels')} for valid options.
#' @param tooltip_settings Optional list of settings for tooltips,
#' see \code{spc_default_settings('tooltips')} for valid options.
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
#' interactive plot, static plot, limits, and a function to save the plot.
#' When indicators are supplied, limits are a named nested list of data frames.
#'
#' @export
spc <- function(data,
                keys,
                numerators,
                denominators,
                groupings,
                indicators = NULL,
                xbar_sds,
                tooltips,
                labels,
                aggregations = list(
                  numerators = "sum",
                  denominators = "sum",
                  groupings = "first",
                  xbar_sds = "first",
                  tooltips = "first",
                  labels = "first"
                ),
                title = NULL,
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

  categories <- rlang::eval_tidy(rlang::enquo(keys), input_data)
  indicator_values <- NULL
  indicators_quo <- rlang::enquo(indicators)
  if (!rlang::quo_is_null(indicators_quo)) {
    indicator_values <- normalise_columns(indicators_quo, input_data, "indicators", "indicator")
  }

  ordering_values <- c(indicator_values, list(categories))
  row_order <- do.call(order, ordering_values)

  # Evaluated against the input order so vector settings align with the rows
  input_settings <- list(
    canvas = rlang::eval_tidy(rlang::enquo(canvas_settings), input_data),
    spc = rlang::eval_tidy(rlang::enquo(spc_settings), input_data),
    outliers = rlang::eval_tidy(rlang::enquo(outlier_settings), input_data),
    nhs_icons = rlang::eval_tidy(rlang::enquo(nhs_icon_settings), input_data),
    scatter = rlang::eval_tidy(rlang::enquo(scatter_settings), input_data),
    lines = rlang::eval_tidy(rlang::enquo(line_settings), input_data),
    x_axis = rlang::eval_tidy(rlang::enquo(x_axis_settings), input_data),
    y_axis = rlang::eval_tidy(rlang::enquo(y_axis_settings), input_data),
    dates = rlang::eval_tidy(rlang::enquo(date_settings), input_data),
    labels = rlang::eval_tidy(rlang::enquo(label_settings), input_data)
  )

  crosstalk_identities <- crosstalk_identities[row_order]
  input_data <- input_data[row_order, ]

  categories <- as.character(rlang::eval_tidy(rlang::enquo(keys), input_data))
  data_raw <- list(
    crosstalk_identities = crosstalk_identities,
    categories = categories,
    numerators = rlang::eval_tidy(rlang::enquo(numerators), input_data)
  )

  if (!is.null(indicator_values)) {
    data_raw$indicators <- lapply(indicator_values, function(x) x[row_order])
  }

  if (!missing(denominators)) {
    data_raw$denominators <- as.numeric(rlang::eval_tidy(rlang::enquo(denominators), input_data))
  }

  if (!missing(groupings)) {
    data_raw$groupings <- as.character(rlang::eval_tidy(rlang::enquo(groupings), input_data))
  }

  if (!missing(xbar_sds)) {
    data_raw$xbar_sds <- as.numeric(rlang::eval_tidy(rlang::enquo(xbar_sds), input_data))
  }

  if (!missing(tooltips)) {
    data_raw$tooltips <- normalise_columns(rlang::enquo(tooltips), input_data, "tooltips", "tooltip")
  }

  if (!missing(labels)) {
    data_raw$labels <- as.character(rlang::eval_tidy(rlang::enquo(labels), input_data))
  }

  create_controlchart("spc", data_raw, row_order, is_crosstalk, crosstalk_group,
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
#' @name spc-shiny
#' @return Interactive Shiny widget for SPC chart
#'
#' @export
spcOutput <- function(outputId, # nolint: object_name_linter.
                      width = "100%", height = "400px") {
  htmlwidgets::shinyWidgetOutput(outputId, "spc", width, height,
                                 package = "controlcharts")
}

#' @rdname spc-shiny
#' @return Interactive Shiny widget for funnel plot
#' @export
renderSpc <- function(expr, # nolint: object_name_linter.
                      env = parent.frame(), quoted = FALSE) {
  if (!quoted) {
    expr <- substitute(expr)
  } # force quoted
  htmlwidgets::shinyRenderWidget(expr, spcOutput, env, quoted = TRUE)
}
