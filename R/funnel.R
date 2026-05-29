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

  return_objs <- unique(return_objs)
  invalid_objs <- return_objs[!(return_objs %in% c("html_plot", "static_plot", "limits"))]
  if (length(invalid_objs) > 0) {
    stop("Invalid arguments for 'return_obj': '", paste(invalid_objs, collapse = "', '"), "'. ")
  }

  is_crosstalk <- crosstalk::is.SharedData(data)
  if (is_crosstalk) {
    crosstalk_identities <- data$key()
    crosstalk_group <- data$groupName()
    input_data <- data$origData()
  } else {
    crosstalk_identities <-  as.character(seq_len(nrow(data)))
    crosstalk_group <- NULL
    input_data <- data
  }

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

  input_settings_processed <- validate_settings("funnel", input_settings,
                                                data_raw$crosstalk_identities,
                                                cat_order)
  input_settings <- input_settings_processed$input_settings
  has_conditional_formatting <- input_settings_processed$has_conditional_formatting
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
    data_raw$tooltips <- as.character(eval(substitute(tooltips), input_data, parent.frame()))[cat_order]
  }

  has_labels <- !missing(labels)
  if (has_labels) {
    data_raw$labels <- as.character(eval(substitute(labels), input_data, parent.frame()))[cat_order]
  }

  unique_categories <- unique(data_raw$categories)

  rtn_html <- "html_plot" %in% return_objs
  rtn_static <- "static_plot" %in% return_objs
  rtn_limits <- "limits" %in% return_objs
  rtn <- list()
  update_dataviews <- NULL

  if (rtn_html) {
    widget_data <- list(
      title_settings = title_settings,
      crosstalk_group = crosstalk_group,
      tooltip_settings = validate_tooltips(tooltip_settings),
      is_crosstalk = is_crosstalk
    )

    # Only store the raw data and aggregation settings for crosstalk inputs
    #  where aggregations will need to be dynamically recomputed. For all
    #  other inputs we just aggregate once and re-use
    if (is_crosstalk) {
      widget_data$data_raw <- data_raw
      widget_data$input_settings <- input_settings
      widget_data$aggregations <- aggregations
      widget_data$has_conditional_formatting <- has_conditional_formatting
      widget_data$unique_categories <- unique_categories
    } else {
      widget_data$update_values <- ctx$call("makeUpdateValues", data_raw, input_settings, aggregations,
                                            has_conditional_formatting, unique_categories)
      update_dataviews <- widget_data$update_values$dataViews
    }

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
    rtn$html_plot <- htmlwidgets::createWidget(
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
  }

  if (rtn_static || rtn_limits) {
    # Special characters to be escaped for headless use only,
    # as is automatically done by htmlwidgets
    input_settings <- escape_labels(input_settings)
    title_escaped <- FALSE
    if (!is.null(title_settings$text)) {
      title_clean <- htmltools::htmlEscape(title_settings$text)
      if (title_clean != title_settings$text) {
        title_escaped <- TRUE
        title_settings$text <- title_clean
      }
    }

    labels_escaped <- FALSE
    if (has_labels) {
      labels_clean <- sapply(data_raw$labels, htmltools::htmlEscape)
      if (any(labels_clean != data_raw$labels)) {
        labels_escaped <- TRUE
        data_raw$labels <- labels_clean
      }
    }

    # If the JS input arguments were already calculated for the HTML plot and there
    #   have been no changes to the inputs by escaping text, then skip re-calculating
    if (is.null(update_dataviews) || title_escaped || labels_escaped) {
      update_dataviews <- ctx$call("makeUpdateValues", data_raw, input_settings, aggregations,
                                    has_conditional_formatting, unique_categories)$dataViews
    }

    data_views <- update_static_padding("funnel", update_dataviews )

    static <- create_static(
      type = "funnel",
      data_views = data_views,
      title_settings = title_settings,
      input_settings = input_settings,
      width = width,
      height = height,
      rtn_static = rtn_static,
      rtn_limits = rtn_limits
    )
    rtn <- append(rtn, static)
  }

  rtn$save_plot <- create_save_function("funnel", rtn, data_views)

  structure(rtn, class = "controlchart")
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
