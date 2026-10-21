#' Generate interactive Funnel chart
#'
#' @param data A data frame containing the data for the chart.
#' @param keys A vector or column name representing the categories of the chart.
#' @param numerators A numeric vector or column name representing the numerators
#' for each category.
#' @param denominators A numeric vector or column name representing the
#' denominators for each category.
#' @param indicators Optional vector or list of vectors identifying indicators.
#' Supplying indicators displays a multi-indicator sigma chart using the native
#' Funnel visual. Each indicator is calculated against its comparison population.
#' @param tooltips A vector or column name, or a list of them, representing
#' additional tooltips for each category. Each is labelled by its name in the
#' list, or else by the expression supplied. `NULL` for none.
#' Limits include them with their R types, reduced within each key by `aggregations$tooltips`.
#' @param labels A vector or column name representing the labels
#' for each category. `NULL` for none.
#' @param aggregations A list of aggregation function names
#' for each field if multiple values are provided for each key.
#' Valid options are:
#'   \itemize{
#'     \item \code{"first"}: returns the first non-missing value
#'     \item \code{"last"}: returns the last non-missing value
#'     \item \code{"sum"}: returns the sum of values
#'     \item \code{"mean"}: returns the mean of values
#'     \item \code{"min"}: returns the minimum value
#'     \item \code{"max"}: returns the maximum value
#'     \item \code{"median"}: returns the median value
#'     \item \code{"count"}: returns the count of non-missing values
#'   }
#' Defaults to \code{"sum"} for numerators and denominators, and
#' \code{"first"} otherwise.
#' Every aggregation ignores missing values; an all-missing group has a count of 0 and is otherwise missing.
#' Numerators and denominators are aggregated independently.
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
#'  \item \code{subtitle}: Subtitle text, drawn below the title (default: NULL)
#'  \item \code{subtitle_font_size}: Font size of the subtitle (default: "12px")
#'  \item \code{subtitle_font_weight}: Font weight of the subtitle
#' (default: "normal")
#' }
#' @param canvas_settings Optional list of settings for the canvas,
#' see \code{funnel_default_settings('canvas')} for valid options.
#' @param funnel_settings Optional list of settings for the Funnel chart,
#' see \code{funnel_default_settings("funnel")} for valid options.
#' @param misc_settings Optional native MISC settings. `group` selects a value
#' from `keys`; if omitted, the first group is shown. See
#' \code{funnel_default_settings("misc")} for valid options.
#' @param outlier_settings Optional list of settings for outliers,
#' see \code{funnel_default_settings('outliers')} for valid options.
#' Detection switches use the first valid outlier settings after sorting and
#' aggregating keys for the whole chart, for both plots and limits.
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
#' @param summary_table_settings Optional list of settings for the summary table,
#' see \code{funnel_default_settings('summary_table')} for valid options.
#' A table shown by `show_table` has no static plot. Indicators show the MISC
#' chart instead of the table.
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
#'  \item \code{"limit_lines"}: Control limits across the full range of
#'  denominators, for drawing the limit lines (not returned by default)
#' }
#' When `summary_table_settings` sets `show_table` without `indicators`,
#' `"static_plot"` is omitted by default.
#'
#' @return An object of class \code{controlchart} containing the
#' interactive plot, static plot, limits data frame, and a function to save the plot.
#' Limits and limit lines include every group, with supplied indicator columns
#' included by name. Multi-indicator limits also include direction-adjusted scores.
#' Limits include the typed key, named after the `keys` expression and duplicated as `key`,
#' and tooltip columns by name.
#' Limit lines describe denominator curves and have no observation keys or tooltips.
#' Empty input returns empty limits and limit lines, without plots.
#'
#' @export
funnel <- function(data,
                   keys,
                   numerators,
                   denominators,
                   indicators = NULL,
                   tooltips = NULL,
                   labels = NULL,
                   aggregations = NULL,
                   title = NULL,
                   canvas_settings = NULL,
                   funnel_settings = NULL,
                   misc_settings = NULL,
                   outlier_settings = NULL,
                   scatter_settings = NULL,
                   line_settings = NULL,
                   x_axis_settings = NULL,
                   y_axis_settings = NULL,
                   label_settings = NULL,
                   summary_table_settings = NULL,
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
    crosstalk_identities <- NULL
    crosstalk_group <- NULL
    input_data <- data
  }

  # Numeric keys stay numeric, and factor keys send their levels, so the engine can order them
  keys_quo <- rlang::enquo(keys)
  key_values <- rlang::eval_tidy(keys_quo, input_data)
  key_name <- paste(deparse(rlang::quo_get_expr(keys_quo)), collapse = "")
  categories <- key_values
  category_levels <- levels(categories)
  if (!is.numeric(categories)) {
    categories <- as.character(categories)
  }
  data_raw <- list(
    categories = categories,
    category_name = key_name,
    numerators = rlang::eval_tidy(rlang::enquo(numerators), input_data),
    denominators = rlang::eval_tidy(rlang::enquo(denominators), input_data)
  )
  data_raw$category_levels <- category_levels
  data_raw$crosstalk_identities <- crosstalk_identities
  result_data <- list(
    key = key_values,
    key_name = key_name,
    key_label = "group"
  )

  indicators_quo <- rlang::enquo(indicators)
  if (!rlang::quo_is_null(indicators_quo)) {
    data_raw$indicators <- normalise_columns(indicators_quo, input_data, "indicators", "indicator")
  }

  input_settings <- list(
    canvas = rlang::eval_tidy(rlang::enquo(canvas_settings), input_data),
    funnel = rlang::eval_tidy(rlang::enquo(funnel_settings), input_data),
    misc = rlang::eval_tidy(rlang::enquo(misc_settings), input_data),
    outliers = rlang::eval_tidy(rlang::enquo(outlier_settings), input_data),
    scatter = rlang::eval_tidy(rlang::enquo(scatter_settings), input_data),
    lines = rlang::eval_tidy(rlang::enquo(line_settings), input_data),
    x_axis = rlang::eval_tidy(rlang::enquo(x_axis_settings), input_data),
    y_axis = rlang::eval_tidy(rlang::enquo(y_axis_settings), input_data),
    labels = rlang::eval_tidy(rlang::enquo(label_settings), input_data),
    summary_table = rlang::eval_tidy(rlang::enquo(summary_table_settings), input_data)
  )
  if (missing(return_objs) && is.null(data_raw$indicators) && isTRUE(input_settings$summary_table$show_table)) {
    return_objs <- setdiff(return_objs, "static_plot")
  }

  tooltips <- normalise_columns(rlang::enquo(tooltips), input_data, "tooltips", "tooltip", as_character = FALSE)
  result_data$tooltips <- tooltips
  if (!is.null(tooltips)) {
    data_raw$tooltips <- lapply(tooltips, as.character)
  }
  labels <- rlang::eval_tidy(rlang::enquo(labels), input_data)
  if (!is.null(labels)) {
    if (length(labels) != nrow(input_data)) {
      stop("labels must have one value per observation.", call. = FALSE)
    }
    data_raw$labels <- as.character(labels)
  }

  create_controlchart("funnel", data_raw, is_crosstalk, crosstalk_group,
                      input_settings, aggregations, title, tooltip_settings,
                      width, height, elementId, return_objs, result_data)
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
#' @return Interactive Shiny widget for funnel plot
#'
#' @export
funnelOutput <- function(outputId, # nolint: object_name_linter.
                         width = "100%", height = "400px") {
  htmlwidgets::shinyWidgetOutput(outputId, "funnel", width, height,
                                 package = "controlcharts")
}

#' @rdname funnel-shiny
#' @return Interactive Shiny widget for funnel plot
#' @export
renderfunnel <- function(expr, # nolint: object_name_linter.
                         env = parent.frame(), quoted = FALSE) {
  if (!quoted) {
    expr <- substitute(expr)
  } # force quoted
  htmlwidgets::shinyRenderWidget(expr, funnelOutput, env, quoted = TRUE)
}
