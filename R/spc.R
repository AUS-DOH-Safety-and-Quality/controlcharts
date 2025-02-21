#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
spc <- function(keys, numerators, width = NULL, height = NULL, elementId = NULL) {

  inputs <- data.frame(keys = keys, numerators = numerators)
  inputs_agg <- aggregate(numerators ~ keys, inputs, sum)

  # forward options using x
  x = list(
    keys = inputs_agg$keys,
    numerators = inputs_agg$numerators
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'spc',
    x,
    width = width,
    height = height,
    package = 'controlcharts',
    elementId = elementId
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
