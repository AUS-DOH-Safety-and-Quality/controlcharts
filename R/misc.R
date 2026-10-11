#' Generate a multi-indicator sigma chart
#'
#' Delegates to [funnel()] with indicator columns and a selected group.
#' Calculations, rendering, settings, and interactivity use the native Funnel visual.
#'
#' @inheritParams funnel
#' @param indicators A vector or list of vectors identifying indicators.
#' @param target A single value from `keys` to display.
#' @param ... Additional arguments passed to [funnel()].
#' @param misc_settings Native MISC settings, with `group` supplied by `target`.
#' See `funnel_default_settings("misc")` for valid options.
#' @return An object of class `controlchart`, as returned by [funnel()].
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
misc <- function(data, keys, numerators, denominators, indicators, target,
                 ..., misc_settings = NULL) {
  if (missing(indicators)) {
    stop("indicators are required", call. = FALSE)
  }
  if (missing(target) || length(target) != 1 || is.na(target)) {
    stop("target must be a single non-missing value", call. = FALSE)
  }
  funnel(
    data, keys = {{ keys }}, numerators = {{ numerators }},
    denominators = {{ denominators }}, indicators = {{ indicators }},
    misc_settings = utils::modifyList(as.list({{ misc_settings }}), list(group = as.character(target))),
    ...
  )
}

#' Shiny bindings for multi-indicator sigma charts
#'
#' @param outputId Output variable to read from.
#' @param width,height Valid CSS dimensions.
#' @param expr An expression that generates a MISC chart.
#' @param env Environment in which to evaluate `expr`.
#' @param quoted Whether `expr` is quoted.
#' @name misc-shiny
#' @return An interactive Funnel widget displaying a MISC chart.
#' @export
miscOutput <- function(outputId, width = "100%", height = "400px") { # nolint: object_name_linter.
  funnelOutput(outputId, width, height)
}

#' @rdname misc-shiny
#' @export
renderMisc <- function(expr, env = parent.frame(), quoted = FALSE) { # nolint: object_name_linter.
  if (!quoted) {
    expr <- substitute(expr)
  }
  renderfunnel(expr, env, quoted = TRUE)
}
