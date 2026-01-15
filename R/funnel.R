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
                   elementId = NULL) { # nolint: object_name_linter.
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
    crosstalk_identities <- data$key()
    crosstalk_group <- data$groupName()
    input_data <- data$origData()
  } else {
    crosstalk_identities <-  as.character(seq_len(nrow(data)))
    crosstalk_group <- NULL
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

  data_raw <- list(
    crosstalk_identities = crosstalk_identities,
    categories = eval(substitute(keys), input_data, parent.frame()),
    numerators = eval(substitute(numerators), input_data, parent.frame()),
    denominators = eval(substitute(denominators), input_data, parent.frame())
  )

  input_settings_processed <- validate_settings("funnel", input_settings,
                                                data_raw$categories)
  input_settings <- input_settings_processed$input_settings
  has_conditional_formatting <-
    input_settings_processed$has_conditional_formatting
  aggregations <- validate_aggregations(aggregations)
  title_settings <- validate_chart_title(title)

  # If rendering a title, adjust the upper padding so that title
  # does not overlap the chart
  if (!is.null(title_settings$text)) {
    if (is.null(input_settings$canvas$upper_padding)) {
      input_settings$canvas$upper_padding =
        funnel_default_settings("canvas")$upper_padding
    }
    input_settings$canvas$upper_padding =
      input_settings$canvas$upper_padding + title_padding(title_settings)
  }


  if (!missing(tooltips)) {
    tooltips <-
      as.character(eval(substitute(tooltips), input_data, parent.frame()))
    data_raw <- append(data_raw, list(tooltips = tooltips))
  }

  has_labels <- !missing(labels)
  if (has_labels) {
    labels <- as.character(eval(substitute(labels), input_data, parent.frame()))
    data_raw <- append(data_raw, list(labels = labels))
  }

  data_raw <- as.data.frame(data_raw)[order(data_raw$categories), ]
  data_raw <- data_raw[!is.na(data_raw$categories), ]
  data_df <- lapply(seq_along(data_raw$categories), function(idx) {
    lapply(data_raw, function(elem) elem[idx])
  })

  unique_categories <- unique(data_raw$categories)

  widget_data <- list(
    data_raw = data_df,
    title_settings = title_settings,
    input_settings = input_settings,
    crosstalk_group = crosstalk_group,
    aggregations = aggregations,
    has_conditional_formatting = has_conditional_formatting,
    unique_categories = unique_categories,
    tooltip_settings = validate_tooltips(tooltip_settings)
  )

  compressed <- FALSE
  if (getOption("controlcharts.compress_data", FALSE)) {
    if (!requireNamespace("zlib", quietly = TRUE)) {
      stop("The 'zlib' package is required for compressing stored data.",
           call. = FALSE)
    }
    compressed <- TRUE
    widget_data <- zlib::compress(serialize(widget_data, NULL))
  }

  # create widget
  html_plt <- htmlwidgets::createWidget(
    name = "funnel",
    # Store compressed data to reduce size
    x = widget_data,
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
      if (compressed) {
        instance$x <- unserialize(zlib::decompress(instance$x))
      }
      instance
    }
  )

  # Special characters to be escaped for headless use only,
  # as is automatically done by htmlwidgets
  input_settings <- escape_labels(input_settings)
  if (!is.null(title_settings$text)) {
    title_settings$text <- htmltools::htmlEscape(title_settings$text)
  }

  if (has_labels) {
    data_df <- lapply(data_df, function(valrow) {
      valrow$labels <- htmltools::htmlEscape(valrow$labels)
      valrow
    })
  }

  data_views <- update_static_padding(
    "funnel",
    ctx$call("makeUpdateValues", data_df, input_settings,
             aggregations, has_conditional_formatting,
             unique_categories)$dataViews
  )

  static <- create_static(
    type = "funnel",
    data_views = data_views,
    title_settings = title_settings,
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
      save_plot = create_save_function("funnel", html_plt, data_views,
                                       width, height)
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
