.default_tooltip_settings <- list(
  ttip_font_size = 12,
  ttip_font = "Arial, sans-serif",
  ttip_font_color = "#000000",
  ttip_background_color = "#E0E0E0",
  ttip_opacity = 1,
  ttip_border_radius = 5,
  ttip_border_color = "#000000",
  ttip_border_width = 1
)

validate_tooltips <- function(tooltip_settings) {
  if (is.null(tooltip_settings)) {
    return(.default_tooltip_settings)
  }
  for (setting in names(tooltip_settings)) {
    if (!(setting %in% names(.default_tooltip_settings))) {
      stop("'", setting, "' is not a valid tooltip setting! Valid options are:",
           paste0(names(.default_tooltip_settings), collapse = ", "), ".",
           call. = FALSE)
    }
  }
  tooltip_settings <- modifyList(.default_tooltip_settings, tooltip_settings)
}

.default_settings_impl <- function(type, group = NULL) {
  settings <- switch(
    type,
    spc = append(.spc_default_settings_internal,
                 list(tooltips = .default_tooltip_settings)),
    funnel = append(.funnel_default_settings_internal,
                    list(tooltips = .default_tooltip_settings))
  )
  if (is.null(group)) {
    return(settings)
  }
  if (!(group %in% names(settings))) {
    stop("'", group, "' is not a valid settings group! Valid options are: ",
         paste0(names(settings), collapse = ", "))
  }
  settings[[group]]
}

#' Get default settings for SPC charts
#'
#' Retrieve the default settings for SPC charts or a specific settings group.
#' @param group Optional. A specific settings group to retrieve.
#' If NULL, all settings groups are returned.
#' @return A list of default settings for SPC charts or the specified
#' settings group.
#' @examples
#' #' # Get all default settings for SPC charts
#' spc_default_settings()
#' # # Get default settings for a specific group
#' spc_default_settings("x_axis")
#' @export
spc_default_settings <- function(group = NULL) {
  .default_settings_impl("spc", group)
}

#' Get default settings for Funnel charts
#' Retrieve the default settings for Funnel charts or a specific settings group.
#' @param group Optional. A specific settings group to retrieve.
#' If NULL, all settings groups are returned.
#' @return A list of default settings for Funnel charts or the
#' specified settings group.
#' @examples
#' #' # Get all default settings for Funnel charts
#' funnel_default_settings()
#' # # Get default settings for a specific group
#' funnel_default_settings("x_axis")
#' @export
funnel_default_settings <- function(group = NULL) {
  .default_settings_impl("funnel", group)
}

#' Get default settings for multi-indicator sigma charts
#'
#' @param group Optional settings group. If `NULL`, all groups are returned.
#' @return Native Funnel settings used by [misc()].
#' @export
misc_default_settings <- function(group = NULL) {
  funnel_default_settings(group)
}

# Calls a JS function that reports invalid input as an error object
call_js <- function(name, ...) {
  result <- ctx$call(name, ...)
  if (!is.null(result$error)) {
    stop(result$error, call. = FALSE)
  }
  result
}

# Vectors named by their list names or the expressions supplied.
normalise_columns <- function(columns_quo, input_data, arg, item, as_character = TRUE) {
  column_values <- rlang::eval_tidy(columns_quo, input_data)
  if (is.null(column_values)) {
    return(NULL)
  }
  columns_expr <- rlang::quo_get_expr(columns_quo)
  if (is.data.frame(column_values)) {
    stop(arg, " must be a vector or list of vectors.", call. = FALSE)
  }
  if (!is.list(column_values)) {
    column_values <- list(column_values)
  }
  if (length(column_values) == 0) {
    stop(arg, " must contain at least one vector.", call. = FALSE)
  }

  expression_values <- list(columns_expr)
  if (is.call(columns_expr) && identical(columns_expr[[1]], quote(list))) {
    expression_values <- as.list(columns_expr)[-1]
  }

  column_names <- names(column_values)
  if (is.null(column_names)) {
    column_names <- rep("", length(column_values))
  }
  for (i in seq_along(column_values)) {
    if (is.list(column_values[[i]]) || is.matrix(column_values[[i]]) ||
        length(column_values[[i]]) != nrow(input_data)) {
      stop("Each ", item, " must be a vector with one value per observation.",
           call. = FALSE)
    }
    if (column_names[i] == "") {
      if (length(expression_values) >= i) {
        column_names[i] <- paste(deparse(expression_values[[i]]),
                                 collapse = "")
      } else {
        column_names[i] <- paste0(tools::toTitleCase(item), " ", i)
      }
    }
    if (as_character) {
      column_values[[i]] <- as.character(column_values[[i]])
    }
  }
  names(column_values) <- make.unique(column_names)
  column_values
}

# Factor indicators send their levels, so the engine orders them by level rather than value
indicator_data <- function(indicators_quo, input_data) {
  indicators <- normalise_columns(indicators_quo, input_data, "indicators", "indicator", as_character = FALSE)
  indicator_levels <- Filter(Negate(is.null), lapply(indicators, levels))
  if (length(indicator_levels) == 0) {
    indicator_levels <- NULL
  }
  list(values = lapply(indicators, as.character), levels = indicator_levels)
}

warn_all <- function(messages) {
  for (message in messages) {
    warning(message, call. = FALSE)
  }
}

# Mirrors the engine's tooltip aggregation, keeping R types.
reduce_tooltip <- function(values, aggregation) {
  values <- values[!is.na(values)]
  if (aggregation == "count") {
    return(length(values))
  }
  if (length(values) == 0) {
    return(values[NA_integer_])
  }
  switch(
    aggregation,
    first = values[1],
    last = values[length(values)],
    sum = sum(values),
    mean = mean(values),
    min = min(values),
    max = max(values),
    median = stats::median(values)
  )
}

# The typed key replaces the engine's string label for it, named after the `keys` expression.
# It is also kept as `key` for compatibility.
result_frame <- function(frame, row_ids, source_rows, result_data) {
  tooltips <- result_data$tooltips
  key_name <- result_data$key_name
  frame_names <- setdiff(names(frame), result_data$key_label)
  conflicting <- unique(c(
    intersect(c(key_name, "key"), frame_names),
    intersect(names(tooltips), c(key_name, "key", frame_names))
  ))
  if (length(conflicting) > 0) {
    stop("Result column names conflict: ", paste(conflicting, collapse = ", "), ".", call. = FALSE)
  }
  rows <- unname(source_rows[sprintf("%.0f", row_ids)])
  first_rows <- vapply(rows, function(indices) indices[1] + 1L, numeric(1))
  frame[[result_data$key_label]] <- result_data$key[first_rows]
  names(frame)[names(frame) == result_data$key_label] <- key_name
  frame$key <- frame[[key_name]]
  for (name in names(tooltips)) {
    values <- tooltips[[name]]
    if (length(rows) == 0) {
      frame[[name]] <- values[0]
      next
    }
    reduced <- lapply(rows, function(indices) {
      reduce_tooltip(values[indices + 1L], result_data$tooltip_aggregation)
    })
    frame[[name]] <- do.call(c, reduced)
  }
  frame
}

# QuickJS and htmlwidgets otherwise unbox single-value columns.
js_data_views <- function(data_views) {
  for (i in seq_along(data_views)) {
    for (role in c("categories", "values")) {
      columns <- data_views[[i]]$categorical[[role]]
      for (j in seq_along(columns)) {
        if (length(columns[[j]]$values) <= 1) {
          columns[[j]]$values <- I(columns[[j]]$values)
        }
      }
      data_views[[i]]$categorical[[role]] <- columns
    }
  }
  data_views
}

empty_results <- function(type, data_raw, result_data, return_objs) {
  limits <- as.list(data_raw$indicators)
  if (length(limits) > 0 && any(c("limits", "limit_lines") %in% return_objs)) {
    indicator_columns <- ctx$call("ccHeadless.limitIndicatorColumns", type, I(names(limits)))
    names(limits) <- indicator_columns$columns
    warn_all(indicator_columns$warnings)
  }
  limit_lines <- limits
  numeric_columns <- c("numerator", "denominator", "value", "target", "ll99", "ll95", "ll68", "ul68", "ul95", "ul99")
  if (type == "spc") {
    limits$date <- character()
    numeric_columns <- c(numeric_columns, "trend_line")
    flag_columns <- c("astpoint", "trend", "shift", "two_in_three")
  } else {
    limits$group <- character()
    numeric_columns <- c(numeric_columns, "z")
    if (length(data_raw$indicators) > 0) {
      numeric_columns <- c(numeric_columns, "score")
    }
    flag_columns <- c("two_sigma", "three_sigma")
  }
  for (name in numeric_columns) {
    limits[[name]] <- numeric()
  }
  for (name in flag_columns) {
    limits[[name]] <- character()
  }
  rtn <- list()
  if ("limits" %in% return_objs) {
    rtn$limits <- result_frame(list2DF(limits), numeric(), list(), result_data)
  }
  if ("limit_lines" %in% return_objs) {
    for (name in c("denominator", "target", "ll99", "ll95", "ll68", "ul68", "ul95", "ul99")) {
      limit_lines[[name]] <- numeric()
    }
    rtn$limit_lines <- list2DF(limit_lines)
  }
  rtn
}

create_static <- function(type, data_views, source_rows, result_data, title_settings, width, height,
                          rtn_static = TRUE, rtn_limits = TRUE,
                          rtn_limit_lines = FALSE
                         ) {
  width <- ifelse(is.null(width), 640, width)
  height <- ifelse(is.null(height), 400, height)
  raw_ret <- call_js("ccHeadless.updateHeadlessVisual", type, js_data_views(data_views),
                     title_settings, width, height,
                     rtn_static, rtn_limits || rtn_limit_lines)
  warn_all(raw_ret$warnings)

  rtn <- list()
  if (rtn_static) {
    rtn$static_plot = structure(
      list(
        type = type,
        dataViews = data_views,
        svg = raw_ret$svg,
        title_settings = title_settings,
        # Set to non-null values, will be updated when printed
        width = width,
        height = height
      ),
      class = "static_plot"
    )
  }

  if (rtn_limit_lines) {
    rtn$limit_lines <- limits_frame(raw_ret$limitLines)
  }
  if (rtn_limits) {
    rtn$limits <- result_frame(limits_frame(raw_ret$limits), raw_ret$rowIds, source_rows, result_data)
  }
  rtn
}

# Indicator groups can return different enabled flag and limit columns.
limits_frame <- function(limits) {
  columns <- unique(unlist(lapply(limits, names), use.names = FALSE))
  cols <- lapply(columns, function(name) {
    unlist(lapply(limits, function(row) {
      value <- row[[name]]
      if (is.null(value)) {
        return(NA)
      }
      value
    }), use.names = FALSE)
  })
  names(cols) <- columns
  list2DF(cols)
}

create_save_function <- function(type, rtn, data_views) {
  has_html <- "html_plot" %in% names(rtn)
  has_static <- "static_plot" %in% names(rtn)
  html_plot <- NULL
  static_plot <- NULL

  if (has_html) {
    html_plot <- rtn$html_plot
  }
  if (has_static) {
    static_plot <- rtn$static_plot
  }

  function(file, width = NULL, height = NULL) {
    if (!(has_html || has_static)) {
      stop("This object has no plots! Rerun the `", type, "()` function and ",
           "pass 'html_plot' and/or 'static_plot' to the 'return_objs' argument")
    }
    file_ext <- tools::file_ext(file)
    if (file_ext == "html") {
      if (!has_html) {
        stop("This object has no html plot! Rerun the `", type, "()` function and ",
            "pass 'html_plot' to the 'return_objs' argument")
      }
      htmlwidgets::saveWidget(html_plot, file, selfcontained = TRUE)
      return(invisible(NULL))
    }
    if (!has_static) {
      stop("This object has no static plot! Rerun the `", type, "()` function and ",
          "pass 'static_plot' to the 'return_objs' argument")
    }
    valid_exts <- c("webp", "png", "pdf", "svg", "ps", "eps", "html")
    if (!(file_ext %in% valid_exts)) {
      stop("'", file_ext, "' is not a supported file type! Valid options are: ",
           paste0(valid_exts, collapse = ", "))
    }
    # No change to size, save existing SVG as-is
    if (file_ext == "svg" && (is.null(width) && is.null(height))) {
      writeLines(static_plot$svg, con = file)
      return(invisible(NULL))
    }
    if (!(file_ext %in% c("html", "svg"))) {
      if (!("rsvg" %in% utils::installed.packages()[,"Package"])) {
        stop("The 'rsvg' package is required for saving plots in ",
             "formats other than SVG or HTML but is not installed.",
             call. = FALSE)
      }
    }

    # If either width or height not provided by user, use existing
    width <- ifelse(is.null(width), static_plot$width, width)
    height <- ifelse(is.null(height), static_plot$height, height)

    svg_resized <- ctx$call(
      "ccHeadless.updateHeadlessVisual",
      type,
      js_data_views(data_views),
      static_plot$title_settings,
      width,
      height,
      TRUE,
      FALSE
    )$svg

    if (file_ext == "svg") {
      writeLines(svg_resized, file)
      return(invisible(NULL))
    }

    save_fun <- switch(
      file_ext,
      webp = rsvg::rsvg_webp,
      png = rsvg::rsvg_png,
      pdf = rsvg::rsvg_pdf,
      ps = rsvg::rsvg_ps,
      eps = rsvg::rsvg_eps
    )

    save_fun(charToRaw(svg_resized), file,
             width = width * 3, height = height * 3)
    invisible(NULL)
  }
}

create_controlchart <- function(type, data_raw, is_crosstalk, crosstalk_group,
                                input_settings, aggregations, title, tooltip_settings,
                                width, height, elementId, return_objs, result_data) {
  return_objs <- unique(return_objs)
  valid_objs <- c("html_plot", "static_plot", "limits")
  if (type == "funnel") {
    valid_objs <- c(valid_objs, "limit_lines")
  }
  invalid_objs <- return_objs[!(return_objs %in% valid_objs)]
  if (length(invalid_objs) > 0) {
    stop("Invalid arguments for 'return_obj': '", paste(invalid_objs, collapse = "', '"), "'. ")
  }

  if (length(data_raw$categories) == 0) {
    rtn <- empty_results(type, data_raw, result_data, return_objs)
    rtn$save_plot <- create_save_function(type, rtn, NULL)
    return(structure(rtn, class = "controlchart"))
  }

  input_settings <- call_js("ccCore.chartSettings", type, input_settings,
                            length(data_raw$categories))$settings
  aggregations <- call_js("ccCore.chartAggregations", aggregations)$aggregations
  result_data$tooltip_aggregation <- aggregations$tooltips
  title_settings <- call_js("ccCore.chartTitle", title)$settings

  rtn_html <- "html_plot" %in% return_objs
  rtn_static <- "static_plot" %in% return_objs
  rtn_limits <- "limits" %in% return_objs
  rtn_limit_lines <- "limit_lines" %in% return_objs
  rtn <- list()
  data_views <- NULL
  source_rows <- NULL

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
    } else {
      widget_data$update_values <- ctx$call("ccCore.makeUpdateValues", data_raw, input_settings, aggregations)
      widget_data$update_values$dataViews <- js_data_views(widget_data$update_values$dataViews)
      data_views <- widget_data$update_values$dataViews
      source_rows <- widget_data$update_values$source_rows
      widget_data$update_values$source_rows <- NULL
    }

    # Create interactive plot
    rtn$html_plot <- htmlwidgets::createWidget(
      name = type,
      # Store compressed data to reduce size
      x = widget_data,
      sizingPolicy = htmlwidgets::sizingPolicy(
        defaultWidth = "100%"
      ),
      width = width,
      height = height,
      package = "controlcharts",
      elementId = elementId,
      dependencies = crosstalk::crosstalkLibs()
    )
  }

  if (rtn_static || rtn_limits || rtn_limit_lines) {
    if (is.null(data_views)) {
      update_values <- ctx$call("ccCore.makeUpdateValues", data_raw, input_settings, aggregations)
      data_views <- update_values$dataViews
      source_rows <- update_values$source_rows
    }

    static <- create_static(
      type = type,
      data_views = data_views,
      source_rows = source_rows,
      result_data = result_data,
      title_settings = title_settings,
      width = width,
      height = height,
      rtn_static = rtn_static,
      rtn_limits = rtn_limits,
      rtn_limit_lines = rtn_limit_lines
    )
    rtn <- append(rtn, static)
  }

  rtn$save_plot <- create_save_function(type, rtn, data_views)

  structure(rtn, class = "controlchart")
}
