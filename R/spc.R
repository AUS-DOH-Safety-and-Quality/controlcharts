#' @exportS3Method
print.static_plot <- function(x, ...) {
  grid::grid.raster(x)
}

#' @exportS3Method
print.controlchart <- function(x, ...) {
  print(x$html_plot)
}


#' Generate interactive SPC chart
#'
#'
#'
#' @import htmlwidgets
#' @import crosstalk
#' @importFrom stats aggregate
#' @importFrom rsvg rsvg_nativeraster
#' @importFrom grid grid.raster
#'
#' @export
spc <- function(keys,
                numerators,
                denominators,
                xbar_sds,
                data,
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

  if (!missing(xbar_sds)) {
    xbar_sds <- as.numeric(eval(substitute(xbar_sds), input_data, parent.frame()))
    xbar_sds <- aggregate(xbar_sds, by = list(keys), FUN = sum)$x
    spc_values <- append(spc_values, values_entry('xbar_sds', xbar_sds))
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
    sizingPolicy = htmlwidgets::sizingPolicy(
      defaultWidth = "100%"
    ),
    width = width,
    height = height,
    package = "controlcharts",
    elementId = elementId,
    dependencies = crosstalk::crosstalkLibs()
  )
  if (is.null(height)) {
    height <- 400
  }
  if (is.null(width)) {
    width <- 600
  }
  spc_settings$canvas$left_padding <- 50
  spc_settings$canvas$lower_padding <- 50
  spc_categories <- values_entry('key', unique(keys), lapply(unique(keys), \(x) spc_settings))
  raw_ret <- spc_ctx$call("update_visual", "spc", spc_categories, spc_values, width, height)
  svg <- paste('<svg viewBox="0 0', width, height, '" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100%" height="100%" fill="white"/>', raw_ret$svg, '</svg>')
  img <- rsvg::rsvg_nativeraster(charToRaw(svg), width=width*3, height=height*3)
  # Add print method to img for rendering via grid::grid.raster
  class(img) <- c("static_plot", class(img))
  
  limits <- raw_ret$plotPoints |>
    lapply(\(elem) elem$table_row) |>
    # Depending on the chart type, the 'numerators' and 'denominators' may be
    # empty, so we need to remove them from the list
    lapply(\(lim) data.frame(lim[!sapply(lim, is.null)]))
  limits <- do.call(rbind.data.frame, limits)
  limits$date <- trimws(limits$date)
  res <- list(
    limits = limits,
    html_plot = html_plt,
    static_plot = img,
    raw = raw_ret
  )
  class(res) <- "controlchart"
  res
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
