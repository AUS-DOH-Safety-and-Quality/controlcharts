#' Generate interactive SPC chart
#'
#' @param data A data frame containing the data for the chart.
#' @param keys A vector or column name representing the categories (x-axis) of the chart.
#' @param numerators A numeric vector or column name representing the numerators for each category.
#' @param denominators A numeric vector or column name representing the denominators for each category.
#' @param groupings A vector or column name representing the grouping for each category.
#' @param xbar_sds A numeric vector or column name representing the x-bar and standard deviation values for each category.
#' @param tooltips A vector or column name representing the tooltips for each category.
#' @param labels A vector or column name representing the labels for each category.
#' @param aggregations A list of aggregation function names for each field if multiple values are provided for each key. Valid options are:
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
#' @param tooltip_settings Optional list of settings for tooltips, see \code{spc_default_settings('tooltips')} for valid options.
#' @param width Optional width of the chart in pixels. If NULL (default), the chart will fill the width of its container.
#' @param height Optional height of the chart in pixels. If NULL (default), the chart will fill the height of its container.
#' @param elementId Optional HTML element ID for the chart.
#'
#' @return An object of class \code{controlchart} containing the interactive plot, static plot, limits data frame, raw data, and a function to save the plot.
#'
#' @export
spc <- function(data,
                keys,
                numerators,
                denominators,
                groupings,
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
                elementId = NULL) {
  if (missing(keys)) {
    stop("keys are required", call. = FALSE)
  }
  if (missing(numerators)) {
    stop("numerators are required", call. = FALSE)
  }
  if (missing(data)) {
    stop("data is required", call. = FALSE)
  }

  if (crosstalk::is.SharedData(data)) {
    crosstalkIdentities <- data$key()
    crosstalkGroup <- data$groupName()
    input_data <- data$origData()
  } else {
    crosstalkIdentities <- as.character(seq_len(nrow(data)))
    crosstalkGroup <- NULL
    input_data <- data
  }

  input_settings <- list(
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
  )

  data_raw <- list(
    crosstalkIdentities = crosstalkIdentities,
    categories = eval(substitute(keys), input_data, parent.frame()),
    numerators = eval(substitute(numerators), input_data, parent.frame())
  )

  input_settings_processed <- validate_settings('spc', input_settings, data_raw$categories)
  input_settings <- input_settings_processed$input_settings
  has_conditional_formatting <- input_settings_processed$has_conditional_formatting
  aggregations <- validate_aggregations(aggregations)

  if (!missing(denominators)) {
    denominators <- as.numeric(eval(substitute(denominators), input_data, parent.frame()))
    data_raw <- append(data_raw, list(denominators = denominators))
  }

  if (!missing(groupings)) {
    groupings <- as.character(eval(substitute(groupings), input_data, parent.frame()))
    data_raw <- append(data_raw, list(groupings = groupings))
  }

  if (!missing(xbar_sds)) {
    xbar_sds <- as.numeric(eval(substitute(xbar_sds), input_data, parent.frame()))
    data_raw <- append(data_raw, list(xbar_sds = xbar_sds))
  }

  if (!missing(tooltips)) {
    tooltips <- as.character(eval(substitute(tooltips), input_data, parent.frame()))
    data_raw <- append(data_raw, list(tooltips = tooltips))
  }

  if (!missing(labels)) {
    labels <- as.character(eval(substitute(labels), input_data, parent.frame()))
    data_raw <- append(data_raw, list(labels = labels))
  }

  data_raw <- as.data.frame(data_raw)[order(data_raw$categories), ]
  data_raw <- data_raw[!is.na(data_raw$categories), ]
  data_df <- lapply(seq_len(nrow(data_raw)), function(idx) {
    lapply(data_raw, function(elem){ elem[idx] })
  })

  unique_categories <- unique(data_raw$categories)

  widget_data <- list(
    data_raw = data_df,
    input_settings = input_settings,
    crosstalkGroup = crosstalkGroup,
    aggregations = aggregations,
    has_conditional_formatting = has_conditional_formatting,
    unique_categories = unique_categories,
    tooltip_settings = validate_tooltips(tooltip_settings)
  )

  # Create interactive plot
  html_plt <- htmlwidgets::createWidget(
    name = 'spc',
    # Store compressed data to reduce size
    x = zlib::compress(serialize(widget_data, NULL)),
    sizingPolicy = htmlwidgets::sizingPolicy(
      defaultWidth = "100%"
    ),
    width = width,
    height = height,
    package = "controlcharts",
    elementId = elementId,
    dependencies = crosstalk::crosstalkLibs(),
    # preRenderHook to decompress data before rendering
    preRenderHook = function(instance) {
      instance$x <- unserialize(zlib::decompress(instance$x))
      instance
    }
  )

  dataViews <- update_static_padding(
    "spc",
    ctx$call("makeUpdateValues", data_df, input_settings, aggregations, has_conditional_formatting, unique_categories)$dataViews
  )

  static <- create_static(
    type = 'spc',
    dataViews = dataViews,
    input_settings = input_settings,
    width = width,
    height = height
  )

  structure(
    list(
      html_plot = html_plt,
      static_plot = static$static_plot,
      limits = static$limits,
      raw = static$raw,
      save_plot = create_save_function('spc', html_plt, dataViews, width, height)
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
