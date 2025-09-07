#' Generate interactive funnel chart
#'
#'
#'
#' @import htmlwidgets
#' @import crosstalk
#'
#' @export
funnel <- function(keys, numerators, denominators, data,
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

  keys <- eval(substitute(keys), input_data, parent.frame())
  funnel_categories <- values_entry('key', unique(keys))

  if (!is.null(crosstalk_keys)) {
    crosstalk_keys <- split(crosstalk_keys, keys)
  }

  funnel_values <- list()
  if (!missing(numerators)) {
    numerators <- as.numeric(eval(substitute(numerators), input_data, parent.frame()))
    numerators <- aggregate(numerators, by = list(keys), FUN = sum)$x
    funnel_values <- append(funnel_values, values_entry('numerators', numerators))
  }

  if (!missing(denominators)) {
    denominators <- as.numeric(eval(substitute(denominators), input_data, parent.frame()))
    denominators <- aggregate(denominators, by = list(keys), FUN = sum)$x
    funnel_values <- append(funnel_values, values_entry('denominators', denominators))
  }

  # forward options using x
  x <- list(
    categories = funnel_categories,
    values = funnel_values,
    settings = list(
      crosstalk_keys = crosstalk_keys,
      crosstalk_group = crosstalk_group
    )
  )

  # create widget
  html_plt <- htmlwidgets::createWidget(
    name = "funnel",
    x,
    width = width,
    height = height,
    package = "controlcharts",
    elementId = elementId,
    dependencies = crosstalk::crosstalkLibs()
  )
  raw_ret <- spc_ctx$call("update_visual", "funnel", funnel_categories, funnel_values, TRUE)
  values <- lapply(raw_ret$plotPoints, function(obs) { data.frame(group = obs$group_text, denominator = obs$x, value = obs$value)  })
  values <- do.call(rbind.data.frame, values)
  limits <-
    lapply(raw_ret$calculatedLimits, function(limit_grp) {
        limit_grp <- lapply(limit_grp, function(x) ifelse(is.null(x) || is.nan(x), NA, x))
        data.frame(limit_grp)
    })
  limits <- do.call(rbind.data.frame, limits)
  values <- merge(values, limits, by.x = "denominator", by.y = "denominators")

  list(
    values = values,
    limits = limits,
    html_plot = html_plt,
    #static_plot = gg_plt,
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
#' @name funnel-shiny
#'
#' @export
funnelOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'funnel', width, height, package = 'controlcharts')
}

#' @rdname funnel-shiny
#' @export
renderfunnel <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, funnelOutput, env, quoted = TRUE)
}
