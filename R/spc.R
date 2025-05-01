#' Generate interactive SPC chart
#'
#'
#'
#' @import htmlwidgets
#' @import crosstalk
#'
#' @export
spc <- function(keys, numerators, denominators, data,
                canvas_settings = spc_canvas_settings(),
                spc_settings = spc_data_settings(),
                outlier_settings = spc_outlier_settings(),
                nhs_icon_settings = spc_nhs_icon_settings(),
                scatter_settings = spc_scatter_settings(),
                line_settings = spc_line_settings(),
                width = NULL, height = NULL, elementId = NULL) {
  if (crosstalk::is.SharedData(data)) {
    crosstalk_keys <- data$key()
    crosstalk_group <- data$groupName()
    input_data <- data$origData()
  } else {
    crosstalk_keys <- NULL
    crosstalk_group <- NULL
    input_data <- data
  }

  spc_settings <- list(
    canvas = canvas_settings,
    spc = spc_settings,
    outliers = outlier_settings,
    nhs_icons = nhs_icon_settings,
    scatter = scatter_settings,
    lines = line_settings
  )

  keys <- eval(substitute(keys), input_data, parent.frame())
  spc_categories <- values_entry('key', unique(keys), lapply(unique(keys), \(x) spc_settings))

  if (!is.null(crosstalk_keys)) {
    crosstalk_keys <- split(crosstalk_keys, keys)
  }

  spc_values <- list()
  if (!missing(numerators)) {
    numerators <- as.numeric(eval(substitute(numerators), input_data, parent.frame()))
    numerators <- aggregate(numerators, by = list(keys), FUN = sum)$x
    spc_values <- append(spc_values, values_entry('numerators', numerators))
  }

  if (!missing(denominators)) {
    denominators <- as.numeric(eval(substitute(denominators), input_data, parent.frame()))
    denominators <- aggregate(denominators, by = list(keys), FUN = sum)$x
    spc_values <- append(spc_values, values_entry('denominators', denominators))
  }

  # forward options using x
  x <- list(
    categories = spc_categories,
    values = spc_values,
    settings = list(
      crosstalk_keys = crosstalk_keys,
      crosstalk_group = crosstalk_group
    )
  )

  # create widget
  html_plt <- htmlwidgets::createWidget(
    name = "spc",
    x,
    width = width,
    height = height,
    package = "controlcharts",
    elementId = elementId,
    dependencies = crosstalk::crosstalkLibs()
  )
  raw_ret <- spc_ctx$call("update_visual", spc_categories, spc_values, TRUE)
  limits <- raw_ret$plotPoints |>
    lapply(\(elem) elem$table_row) |>
    # Depending on the chart type, the 'numerators' and 'denominators' may be
    # empty, so we need to remove them from the list
    lapply(\(lim) data.frame(lim[!sapply(lim, is.null)]))
  limits <- do.call(rbind.data.frame, limits)
  limits$date <- trimws(limits$date)
  gg_plt <- draw_plot(limits, raw_ret$plotPoints, raw_ret$xAxis, raw_ret$yAxis, spc_settings)

  list(
    limits = limits,
    html_plot = html_plt,
    static_plot = gg_plt,
    raw = raw_ret
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

#' @import ggplot2
draw_plot <- function(limits, plotPoints, xAxis, yAxis, settings) {
  lines <- settings$lines

  ltype <- list(
    "10 0" = "solid",
    "10 10" = "dashed",
    "2 5" = "dotted"
  )

  lwidth <- function(px) { px * 0.5 }

  # Set as factor with ordering to avoid axis being re-ordered
  limits$date <- factor(limits$date, levels = limits$date)
  plt_base <- ggplot(limits, aes(x = date))

  if (lines$show_target) {
    plt_base <- plt_base +
      geom_line(
        aes(y=target),
        colour = lines$colour_target,
        linewidth = lwidth(lines$width_target),
        linetype = ltype[[lines$type_target]],
        group = 1
      )
  }

  if (lines$show_main) {
    plt_base <- plt_base +
      geom_line(
        aes(y=value),
        colour = lines$colour_main,
        linewidth = lwidth(lines$width_main),
        linetype = ltype[[lines$type_main]],
        group = 1
      )
  }

  if (lines$show_99) {
    plt_base <- plt_base +
      geom_line(aes(y=ll99),
                colour = lines$colour_99,
                linewidth = lwidth(lines$width_99),
                linetype = ltype[[lines$type_99]],
                group = 1) +
      geom_line(aes(y=ul99),
                colour = lines$colour_99,
                linewidth = lwidth(lines$width_99),
                linetype = ltype[[lines$type_99]],
                group = 1)
  }

  if (lines$show_95) {
    plt_base <- plt_base +
      geom_line(aes(y=ll95),
                colour = lines$colour_95,
                linewidth = lwidth(lines$width_95),
                linetype = ltype[[lines$type_95]],
                group = 1) +
      geom_line(aes(y=ul95),
                colour = lines$colour_95,
                linewidth = lwidth(lines$width_95),
                linetype = ltype[[lines$type_95]],
                group = 1)
  }

  plt_base <- plt_base +
    geom_point(aes(y = value, colour = date),
               size = plotPoints[[1]]$aesthetics$size) +
    scale_colour_manual(values = sapply(plotPoints, \(point){ point$aesthetics$colour })) +
    scale_y_continuous(
      limits = c(yAxis$lower, yAxis$upper),
      name = yAxis$label
    ) +
    scale_x_discrete(
      breaks = limits$date[iddxs],
      name = xAxis$label
    ) +
    theme(
      panel.background = element_blank(),
      axis.line.y = element_line(
        colour = yAxis$colour
      ),
      axis.line.x = element_line(
        colour = xAxis$colour
      ),
      axis.text.x = element_text(
        angle = abs(xAxis$tick_rotation),
        hjust = 1
      ),
      legend.position = "none"
    )
}
