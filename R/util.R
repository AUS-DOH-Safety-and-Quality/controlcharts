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

validate_settings <- function(type, input_settings, crosstalk_identities, cat_order) {
  default_settings <- switch(
    type,
    spc = spc_default_settings(),
    funnel = funnel_default_settings()
  )
  has_conditional_formatting <- FALSE
  for (group in names(default_settings)) {
    if (!is.null(input_settings[[group]])) {
      valid_settings <- names(default_settings[[group]])
      invalid_settings <- setdiff(names(input_settings[[group]]),
                                  valid_settings)
      if (length(invalid_settings) > 0) {
        stop(
          "Invalid settings in group '", group, "': ",
          paste0("'", invalid_settings, "'", collapse = ", "),
          ".\nValid settings are: ",
          paste0("'", valid_settings, "'", collapse = ", "), "."
        )
      }

      # Check that length of vector settings matches number of categories
      for (setting_name in names(input_settings[[group]])) {
        setting_value <- input_settings[[group]][[setting_name]]
        if (length(setting_value) > 1) {
          if (length(setting_value) != length(crosstalk_identities)) {
            stop(
              "Setting '", setting_name, "' in group '", group,
              "' has length ", length(setting_value),
              " but there are ", length(crosstalk_identities), " observations. ",
              "Either provide a single value or a vector of ",
              "length equal to the number of observations."
            )
          }
          has_conditional_formatting <- TRUE
          # Re-format to list of lists, so is passed to JS as an object
          # which can be indexed by the group name
          input_settings[[group]][[setting_name]] <- lapply(input_settings[[group]][[setting_name]][cat_order], function(x) x)
          names(input_settings[[group]][[setting_name]]) <- crosstalk_identities[cat_order]
        }
      }
    }
  }
  list(
    input_settings = input_settings,
    has_conditional_formatting = has_conditional_formatting
  )
}

# Escape special characters in labels (e.g., '>' -> '&lt;')
escape_labels <- function(input_settings, type) {
  for (group in names(input_settings)) {
    if (!is.null(input_settings[[group]])) {
      for (setting in names(input_settings[[group]])) {
        if (grepl("_label$", setting)
            && !is.null(input_settings[[group]][[setting]])) {
          input_settings[[group]][[setting]] <-
            htmltools::htmlEscape(input_settings[[group]][[setting]])
        }
      }
    }
  }
  input_settings
}

validate_aggregations <- function(aggregations) {
  if (is.null(aggregations)) {
    return(NULL)
  }
  if (!is.list(aggregations)) {
    stop("Aggregations must be a list.", call. = FALSE)
  }

  all_defaults <- list(
    numerators = "sum",
    denominators = "sum",
    groupings = "first",
    xbar_sds = "first",
    tooltips = "first",
    labels = "first"
  )
  valid_aggregations <- c("first", "last", "sum", "mean",
                          "min", "max", "median", "count")
  for (new_agg in names(aggregations)) {
    if (!(new_agg %in% names(all_defaults))) {
      stop("'", new_agg, "' is not a valid variable to aggregate! ",
           "Valid options are: ", paste0(names(all_defaults), collapse = ", "),
           ".", call. = FALSE)
    }
    if (!(aggregations[[new_agg]] %in% valid_aggregations)) {
      stop("'", aggregations[[new_agg]], "' is not a valid aggregation! ",
           "Valid options are: ", paste0(valid_aggregations, collapse = ", "),
           ".", call. = FALSE)
    }
    all_defaults[[new_agg]] <- aggregations[[new_agg]]
  }
  all_defaults
}

title_padding <- function(title) {
  if (is.null(title$text)) {
    return(0)
  }
  title_size <- title$font_size

  # If the size is provided as `{}px`, extract the numeric values
  if (is.character(title_size) && grepl("px$", title_size)) {
    title_size <- as.numeric(gsub("(^\\d+)px", "\\1", title_size))
  }
  # Return total padding as font size (as rough proxy for text height) and
  #  y render value
  title_size + title$y
}

validate_chart_title <- function(title) {
  # Default chart title settings
  title_settings <- list(
    text = NULL,
    font_size = "16px",
    font_weight = "bold",
    font_family = "'Arial', sans-serif",
    x = "50%",
    y = 5,
    text_anchor = "middle",
    dominant_baseline = "hanging"
  )
  if (is.null(title)) {
    return(title_settings)
  } else if (is.character(title) && length(title) == 1) {
    title_settings$text <- title
  } else if (is.list(title) && any(names(title_settings) %in% names(title))) {
    for (x in names(title_settings)) {
      if (!is.null(title[[x]])) {
        title_settings[[x]] <- title[[x]]
      }
    }
  } else {
    stop("Invalid title format. It should be either a character string or a ",
         "list with at least one of the following valid options: ",
         paste0("'", names(title_settings), "'", collapse = ", "), ".",
         call. = FALSE)
  }
  title_settings
}

svg_string <- function(svg, width, height) {
  paste0('<svg viewBox="0 0 ', width, " ", height,
         '" width="', width, 'px" height="', height,
         'px" xmlns="http://www.w3.org/2000/svg">',
         '<rect x="0" y="0" width="100%" height="100%" fill="white"/>',
         svg,
         "</svg>")
}

update_static_padding <- function(type, data_views) {
  data_views[[1]]$categorical$categories[[1]]$objects <- lapply(
    data_views[[1]]$categorical$categories[[1]]$objects,
    function(settings) {
      if (is.null(settings$canvas)) {
        settings$canvas <- .default_settings_impl(type, "canvas")
      } else if (is.null(settings$canvas$left_padding)) {
        settings$canvas <- modifyList(.default_settings_impl(type, "canvas"),
                                      settings$canvas)
      }
      settings$canvas$left_padding <- settings$canvas$left_padding + 50
      need_padding <- is.null(settings$x_axis) ||
        is.null(settings$x_axis$xlimit_tick_size)
      # SPC Charts need more padding at the bottom for the x-axis dates
      x_tick_size <- ifelse(need_padding, 10, settings$x_axis$xlimit_tick_size)
      pad <- ifelse(type == "spc", 50, 10 + x_tick_size)
      settings$canvas$lower_padding <- settings$canvas$lower_padding + pad
      settings
    }
  )
  data_views
}

create_static <- function(type, data_views, title_settings,
                          input_settings, width, height,
                          rtn_static = TRUE, rtn_limits = TRUE
                         ) {
  width <- ifelse(is.null(width), 640, width)
  height <- ifelse(is.null(height), 400, height)
  raw_ret <- ctx$call("updateHeadlessVisual", type, data_views,
                      title_settings, width, height,
                      rtn_static, rtn_limits)

  if ("error" %in% names(raw_ret)) {
    stop(raw_ret$error, call. = FALSE)
  }

  rtn <- list()
  if (rtn_static) {
    rtn$static_plot = structure(
      list(
        type = type,
        dataViews = data_views,
        svg = raw_ret$svg,
        # Set to non-null values, will be updated when printed
        width = width,
        height = height
      ),
      class = "static_plot"
    )
  }

  if (!rtn_limits) {
    return(rtn)
  }

  limits <- NULL
  if (type == "spc") {
    limits <- lapply(raw_ret$plotPoints, function(elem) elem$table_row)
    # Depending on the chart type, the 'numerators' and 'denominators' may be
    # empty, so we need to remove them from the list
    limits <- lapply(limits, function(lim) {
      data.frame(lim[!sapply(lim, is.null)])
    })
    limits <- do.call(rbind.data.frame, limits)
    limits$date <- trimws(limits$date)

    # Remove columns for any outlier patterns that were not used
    outlier_cols <- c("astronomical", "shift", "trend", "two_in_three")
    if (!is.null(input_settings$outliers)) {
      for (pattern in names(input_settings$outliers)) {
        if ((pattern %in% outlier_cols) && input_settings$outliers[[pattern]]) {
          outlier_cols <- setdiff(outlier_cols, pattern)
        }
      }
    }
    # Return table uses 'astpoint' while input settings use 'astronomical'
    outlier_cols[outlier_cols == "astronomical"] <- "astpoint"
    # Remove any outlier columns that were not used
    limits <- limits[, !(names(limits) %in% outlier_cols), drop = FALSE]
  } else if (type == "funnel") {
    values <- lapply(raw_ret$plotPoints, function(obs) {
      data.frame(
        group = obs$group_text,
        numerator = obs$numerator,
        denominator = obs$x,
        value = obs$value,
        z = obs$z,
        two_sigma = obs$two_sigma,
        three_sigma = obs$three_sigma
      )
    })
    values <- do.call(rbind.data.frame, values)

    limits <-
      lapply(raw_ret$calculatedLimits, function(limit_grp) {
        limit_grp <- lapply(limit_grp, function(x) {
          ifelse(is.null(x) || is.nan(x), NA, x)
        })
        data.frame(limit_grp)
      })
    limits <- do.call(rbind.data.frame, limits)
    limits <- merge(values, limits, by.x = "denominator", by.y = "denominators")

    #  Remove columns for any outlier patterns that were not used
    drop_cols <- c("two_sigma", "three_sigma")
    if (!is.null(input_settings$outliers)) {
      for (pattern in names(input_settings$outliers)) {
        if ((pattern %in% drop_cols) && input_settings$outliers[[pattern]]) {
          drop_cols <- setdiff(drop_cols, pattern)
        }
      }
    }
    # Remove alt-target column if not used
    if (is.null(input_settings$lines) ||
          is.null(input_settings$lines$alt_target)) {
      drop_cols <- c(drop_cols, "alt_target")
    }
    limits <- limits[, !(names(limits) %in% drop_cols), drop = FALSE]
  }

  rtn$limits <- limits
  rtn
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
      writeLines(svg_string(static_plot$svg, static_plot$width,
                            static_plot$height),
                 con = file)
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

    svg <- ctx$call("updateHeadlessVisual", type, data_views, width, height)$svg
    svg_resized <- svg_string(svg, width, height)

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

create_controlchart <- function(type, data_raw, cat_order, is_crosstalk, crosstalk_group,
                                input_settings, aggregations, title, tooltip_settings,
                                width, height, elementId, return_objs) {
  return_objs <- unique(return_objs)
  invalid_objs <- return_objs[!(return_objs %in% c("html_plot", "static_plot", "limits"))]
  if (length(invalid_objs) > 0) {
    stop("Invalid arguments for 'return_obj': '", paste(invalid_objs, collapse = "', '"), "'. ")
  }

  input_settings_processed <- validate_settings(type, input_settings,
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
      input_settings$canvas$upper_padding <- .default_settings_impl(type, "canvas")$upper_padding
    }
    input_settings$canvas$upper_padding <- input_settings$canvas$upper_padding + title_padding(title_settings)
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
      if (!("zlib" %in% utils::installed.packages()[,"Package"])) {
        stop("The 'zlib' package is required for compressing stored data.",
            call. = FALSE)
      }
      compressed <- TRUE
      widget_data <- zlib::compress(serialize(widget_data, NULL))
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
    if ("labels" %in% names(data_raw)) {
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

    data_views <- update_static_padding(type, update_dataviews)

    static <- create_static(
      type = type,
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

  rtn$save_plot <- create_save_function(type, rtn, data_views)

  structure(rtn, class = "controlchart")
}
