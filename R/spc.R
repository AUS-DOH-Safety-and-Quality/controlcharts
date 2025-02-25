#' Generate interactive SPC chart
#'
#'
#'
#' @import htmlwidgets
#' @import crosstalk
#'
#' @export
spc <- function(keys, numerators, denominators, data, width = NULL, height = NULL, elementId = NULL) {
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
  spc_categories <- values_entry('key', keys)

  spc_values <- list()
  if (!missing(numerators)) {
    numerators <- eval(substitute(numerators), input_data, parent.frame())
    spc_values <- append(spc_values, values_entry('numerators', numerators))
  }

  if (!missing(denominators)) {
    denominators <- eval(substitute(denominators), input_data, parent.frame())
    spc_values <- append(spc_values, values_entry('denominators', denominators))
  }

  # forward options using x
  x = list(
    categories = spc_categories,
    values = spc_values,
    settings = list(
      crosstalk_keys = crosstalk_keys,
      crosstalk_group = crosstalk_group
    )
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'spc',
    x,
    width = width,
    height = height,
    package = 'controlcharts',
    elementId = elementId,
    dependencies = crosstalk::crosstalkLibs()
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

#' Calculate control limits
#'
#' @name spc-limits
#' @export
spc_limits <- function(keys = NULL, numerators = NULL, denominators = NULL, rebaseline_groupings = NULL, xbar_sds = NULL, width = NULL, height = NULL) {
  spc_categories <- list(values_entry('key', keys))
  spc_values <- list(values_entry('numerators', numerators),
                      values_entry('denominators', denominators))

  spc_ctx$call("update_visual", spc_categories, spc_values, width, height, TRUE)
  spc_ctx$get('visual.viewModel.controlLimits')
}

spc_default_settings <- function() {
  # Defaults loaded from JS as part of .onLoad in zzz.R
  .spc_default_limits_internal
}
