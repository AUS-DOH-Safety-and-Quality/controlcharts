#' Generate a multi-indicator sigma chart
#'
#' Calculates a funnel plot independently for each indicator, then displays the
#' selected target's funnel z-score for every indicator. Positive values are in
#' the favourable direction.
#'
#' @param data A data frame containing the comparison population.
#' @param keys A vector or column name identifying the funnel groups.
#' @param numerators A numeric vector or column name containing numerators.
#' @param denominators A numeric vector or column name containing denominators.
#' @param indicators A vector or column name identifying indicators. A separate
#' funnel calculation is performed for each value.
#' @param target A single value from `keys` to display.
#' @param groupings Optional vector or column name used to group indicator labels.
#' @param tooltips An optional vector or column name, or a list of them, providing
#' additional tooltips. Each is labelled by its name in the list, or otherwise by
#' the supplied expression.
#' @param aggregations A list of aggregation function names passed to
#' [funnel()].
#' @param title Optional chart title. See [funnel()] for the supported format.
#' @param funnel_settings,outlier_settings Settings used for each indicator's
#' funnel calculation. `outlier_settings$improvement_direction` may be
#' conditionally formatted by indicator. Three-sigma detection is always enabled.
#' @param canvas_settings,misc_settings,bar_settings,line_settings,x_axis_settings,y_axis_settings
#' Optional chart settings. See `misc_default_settings()` for valid options.
#' @param tooltip_settings Optional tooltip settings.
#' @param width,height Optional chart dimensions in pixels.
#' @param elementId Optional HTML element ID for the chart.
#' @param return_objs Character vector containing any of `"html_plot"`,
#' `"static_plot"`, and `"limits"`.
#'
#' @return An object of class `controlchart`.
#' @examples
#' comparison <- data.frame(
#'   organisation = rep(LETTERS[1:4], 2),
#'   indicator = rep(c("Measure A", "Measure B"), each = 4),
#'   numerator = c(8, 5, 4, 6, 2, 4, 5, 3),
#'   denominator = 10
#' )
#' misc(
#'   comparison,
#'   keys = organisation,
#'   numerators = numerator,
#'   denominators = denominator,
#'   indicators = indicator,
#'   target = "A",
#'   return_objs = "limits"
#' )
#' @export
misc <- function(data,
                 keys,
                 numerators,
                 denominators,
                 indicators,
                 target,
                 groupings = NULL,
                 tooltips,
                 aggregations = list(
                   numerators = "sum",
                   denominators = "sum",
                   tooltips = "first",
                   labels = "first"
                 ),
                 title = NULL,
                 funnel_settings = NULL,
                 outlier_settings = NULL,
                 canvas_settings = NULL,
                 misc_settings = NULL,
                 bar_settings = NULL,
                 line_settings = NULL,
                 x_axis_settings = NULL,
                 y_axis_settings = NULL,
                 tooltip_settings = NULL,
                 width = NULL,
                 height = NULL,
                 elementId = NULL,
                 return_objs = c("html_plot", "static_plot", "limits")) {
  if (missing(data)) {
    stop("data is required", call. = FALSE)
  }
  if (missing(keys)) {
    stop("keys are required", call. = FALSE)
  }
  if (missing(numerators)) {
    stop("numerators are required", call. = FALSE)
  }
  if (missing(denominators)) {
    stop("denominators are required", call. = FALSE)
  }
  if (missing(indicators)) {
    stop("indicators are required", call. = FALSE)
  }
  if (missing(target) || length(target) != 1 || is.na(target)) {
    stop("target must be a single non-missing value", call. = FALSE)
  }
  if (crosstalk::is.SharedData(data)) {
    stop("misc() requires a data frame so its comparison population is fixed.",
         call. = FALSE)
  }

  input_data <- data
  n <- nrow(input_data)
  key_values <- as.character(rlang::eval_tidy(rlang::enquo(keys), input_data))
  numerator_values <- as.numeric(rlang::eval_tidy(rlang::enquo(numerators), input_data))
  denominator_values <- as.numeric(rlang::eval_tidy(rlang::enquo(denominators), input_data))
  indicator_values <- rlang::eval_tidy(rlang::enquo(indicators), input_data)
  if (is.list(indicator_values) || is.matrix(indicator_values) ||
      length(indicator_values) != n) {
    stop("indicators must be a vector with one value per observation.",
         call. = FALSE)
  }
  indicator_values <- as.character(indicator_values)

  groupings_quo <- rlang::enquo(groupings)
  grouping_values <- rep("", n)
  if (!rlang::quo_is_null(groupings_quo)) {
    grouping_values <- rlang::eval_tidy(groupings_quo, input_data)
    if (is.list(grouping_values) || is.matrix(grouping_values) ||
        length(grouping_values) != n) {
      stop("groupings must be a vector with one value per observation.",
           call. = FALSE)
    }
    grouping_values <- as.character(grouping_values)
  }

  tooltip_values <- NULL
  if (!missing(tooltips)) {
    tooltip_values <- normalise_columns(
      rlang::enquo(tooltips), input_data, "tooltips", "tooltip"
    )
  }

  funnel_settings <- normalise_misc_settings(
    rlang::eval_tidy(rlang::enquo(funnel_settings), input_data),
    n,
    "funnel_settings"
  )
  outlier_settings <- normalise_misc_settings(
    rlang::eval_tidy(rlang::enquo(outlier_settings), input_data),
    n,
    "outlier_settings"
  )
  improvement_direction <- setting_observations(
    outlier_settings$improvement_direction,
    n,
    funnel_default_settings("outliers")$improvement_direction
  )

  calculation_data <- data.frame(
    key = key_values,
    numerator = numerator_values,
    denominator = denominator_values,
    indicator = indicator_values,
    grouping = grouping_values,
    stringsAsFactors = FALSE
  )
  indicator_levels <- unique(indicator_values)
  calculated <- vector("list", length(indicator_levels))
  calculated_tooltips <- vector("list", length(indicator_levels))
  keep <- logical(length(indicator_levels))

  for (i in seq_along(indicator_levels)) {
    indicator <- indicator_levels[i]
    rows <- which(indicator_values == indicator)
    funnel_rows <- rows[order(key_values[rows])]
    directions <- unique(improvement_direction[rows])
    if (length(directions) != 1 ||
        !(directions %in% c("increase", "decrease"))) {
      stop(
        "Each indicator must have one improvement_direction: ",
        "'increase' or 'decrease'. Invalid indicator: '", indicator, "'.",
        call. = FALSE
      )
    }

    indicator_funnel_settings <- slice_misc_settings(funnel_settings, funnel_rows, n)
    indicator_outlier_settings <- slice_misc_settings(outlier_settings, funnel_rows, n)
    indicator_outlier_settings$improvement_direction <- directions
    indicator_outlier_settings$three_sigma <- TRUE
    funnel_args <- list(
      data = calculation_data[funnel_rows, , drop = FALSE],
      keys = calculation_data$key[funnel_rows],
      numerators = calculation_data$numerator[funnel_rows],
      denominators = calculation_data$denominator[funnel_rows],
      aggregations = aggregations,
      funnel_settings = indicator_funnel_settings,
      outlier_settings = indicator_outlier_settings,
      return_objs = "limits"
    )
    if (!is.null(tooltip_values)) {
      funnel_args$tooltips <- lapply(tooltip_values, function(x) x[funnel_rows])
      funnel_args$return_objs <- c("html_plot", "limits")
    }
    funnel_chart <- do.call(funnel, funnel_args)
    funnel_result <- funnel_chart$limits

    target_result <- funnel_result[funnel_result$group == as.character(target), , drop = FALSE]
    if (nrow(target_result) == 0) {
      next
    }
    target_result <- target_result[1, , drop = FALSE]
    target_rows <- rows[key_values[rows] == as.character(target)]
    target_row <- target_rows[1]
    sign <- if (directions == "decrease") -1 else 1

    calculated[[i]] <- data.frame(
      indicator = indicator,
      grouping = grouping_values[target_row],
      group = target_result$group,
      z = target_result$z,
      score = target_result$z * sign,
      outlier = target_result$three_sigma,
      numerator = target_result$numerator,
      denominator = target_result$denominator,
      value = target_result$value,
      ll99 = target_result$ll99,
      target = target_result$target,
      ul99 = target_result$ul99,
      suffix = misc_value_suffix(indicator_funnel_settings),
      sig_figs = misc_sig_figs(indicator_funnel_settings),
      stringsAsFactors = FALSE
    )
    if (!is.null(tooltip_values)) {
      categorical <- funnel_chart$html_plot$x$update_values$dataViews[[1]]$categorical
      target_index <- match(
        as.character(target),
        as.character(categorical$categories[[1]]$values)
      )
      tooltip_columns <- Filter(
        function(column) isTRUE(column$source$roles$tooltips),
        categorical$values
      )
      calculated_tooltips[[i]] <- lapply(tooltip_columns, function(column) {
        as.character(column$values[target_index])
      })
    }
    keep[i] <- TRUE
  }

  if (!any(keep)) {
    stop("target '", target, "' is not present in any indicator.", call. = FALSE)
  }

  misc_data <- do.call(rbind.data.frame, calculated[keep])
  rownames(misc_data) <- NULL
  misc_tooltips <- NULL
  if (!is.null(tooltip_values)) {
    kept_tooltips <- calculated_tooltips[keep]
    misc_tooltips <- lapply(seq_along(tooltip_values), function(j) {
      vapply(kept_tooltips, function(x) x[[j]], character(1))
    })
    names(misc_tooltips) <- names(tooltip_values)
  }

  data_raw <- list(
    crosstalk_identities = as.character(seq_len(nrow(misc_data))),
    categories = misc_data$indicator,
    groupings = misc_data$grouping,
    groups = misc_data$group,
    scores = misc_data$score,
    z_scores = misc_data$z,
    outliers = misc_data$outlier,
    numerators = misc_data$numerator,
    denominators = misc_data$denominator,
    values = misc_data$value,
    ll99 = misc_data$ll99,
    targets = misc_data$target,
    ul99 = misc_data$ul99,
    suffixes = misc_data$suffix,
    sig_figs = misc_data$sig_figs
  )
  if (!is.null(misc_tooltips)) {
    data_raw$tooltips <- misc_tooltips
  }

  input_settings <- list(
    canvas = rlang::eval_tidy(rlang::enquo(canvas_settings), misc_data),
    misc = rlang::eval_tidy(rlang::enquo(misc_settings), misc_data),
    bars = rlang::eval_tidy(rlang::enquo(bar_settings), misc_data),
    lines = rlang::eval_tidy(rlang::enquo(line_settings), misc_data),
    x_axis = rlang::eval_tidy(rlang::enquo(x_axis_settings), misc_data),
    y_axis = rlang::eval_tidy(rlang::enquo(y_axis_settings), misc_data)
  )

  chart <- create_controlchart(
    "misc",
    data_raw,
    seq_len(nrow(misc_data)),
    FALSE,
    NULL,
    input_settings,
    list(
      groupings = "first",
      groups = "first",
      scores = "first",
      z_scores = "first",
      outliers = "first",
      numerators = "first",
      denominators = "first",
      values = "first",
      ll99 = "first",
      targets = "first",
      ul99 = "first",
      suffixes = "first",
      sig_figs = "first",
      tooltips = "first"
    ),
    title,
    tooltip_settings,
    width,
    height,
    elementId,
    return_objs
  )
  attr(chart, "target") <- as.character(target)
  chart
}

normalise_misc_settings <- function(settings, n, arg) {
  if (is.null(settings)) {
    return(list())
  }
  if (!is.list(settings)) {
    stop(arg, " must be a list.", call. = FALSE)
  }
  invalid <- vapply(settings, function(x) !(length(x) %in% c(0, 1, n)), logical(1))
  if (any(invalid)) {
    stop(
      arg, " values must have length one or one value per observation: ",
      paste(names(settings)[invalid], collapse = ", "), ".",
      call. = FALSE
    )
  }
  settings
}

setting_observations <- function(value, n, default) {
  if (is.null(value) || length(value) == 0) {
    return(rep(default, n))
  }
  if (length(value) == 1) {
    return(rep(value, n))
  }
  value
}

slice_misc_settings <- function(settings, rows, n) {
  lapply(settings, function(x) {
    if (length(x) == n) x[rows] else x
  })
}

misc_value_suffix <- function(funnel_settings) {
  defaults <- funnel_default_settings("funnel")
  chart_type <- funnel_settings$chart_type
  if (is.null(chart_type)) {
    chart_type <- defaults$chart_type
  }
  multiplier <- funnel_settings$multiplier
  if (is.null(multiplier)) {
    multiplier <- defaults$multiplier
  }
  percent_labels <- funnel_settings$perc_labels
  if (is.null(percent_labels)) {
    percent_labels <- defaults$perc_labels
  }
  percent_labels <- tolower(percent_labels[1])
  automatic_percent <- identical(percent_labels, "automatic") &&
    identical(chart_type[1], "PR") && multiplier[1] %in% c(1, 100)
  if (identical(percent_labels, "yes") || automatic_percent) {
    return("%")
  }

  if (identical(chart_type[1], "PR") && multiplier[1] != 1) {
    return(paste0(" per ", formatC(multiplier[1], digits = 0, format = "f", big.mark = ",")))
  }
  ""
}

misc_sig_figs <- function(funnel_settings) {
  sig_figs <- funnel_settings$sig_figs
  if (is.null(sig_figs)) {
    sig_figs <- funnel_default_settings("funnel")$sig_figs
  }
  sig_figs[1]
}

#' Shiny bindings for multi-indicator sigma charts
#'
#' @param outputId Output variable to read from.
#' @param width,height Valid CSS dimensions.
#' @param expr An expression that generates a MISC chart.
#' @param env Environment in which to evaluate `expr`.
#' @param quoted Whether `expr` is quoted.
#' @name misc-shiny
#' @return An interactive Shiny widget.
#' @export
miscOutput <- function(outputId, width = "100%", height = "400px") { # nolint: object_name_linter.
  htmlwidgets::shinyWidgetOutput(outputId, "misc", width, height,
                                 package = "controlcharts")
}

#' @rdname misc-shiny
#' @export
renderMisc <- function(expr, env = parent.frame(), quoted = FALSE) { # nolint: object_name_linter.
  if (!quoted) {
    expr <- substitute(expr)
  }
  htmlwidgets::shinyRenderWidget(expr, miscOutput, env, quoted = TRUE)
}
