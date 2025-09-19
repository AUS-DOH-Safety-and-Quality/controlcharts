#' @exportS3Method
print.controlchart <- function(x, ...) {
  print(x$html_plot)
}

# Method to print a static plot to the R graphics device
# Uses the QuickJSR package for running the visual JS to create an SVG string
# of the plot, then the rsvg package to render that SVG to the graphics device
#' @exportS3Method
print.static_plot <- function(x, ...) {
  viewer = getOption('viewer')
  tmp <- tempfile(fileext = ".svg")
  cat(svg_string(x$svg, x$width, x$height), file = tmp)
  # If the viewer is set, display the SVG in it
  if (!is.null(viewer) && is.function(viewer)) {
    viewer(tmp)
  } else {
    # Otherwise, use the default viewer
    utils::browseURL(tmp)
  }
}

#' @exportS3Method knitr::knit_print
knit_print.static_plot <- function(x, ...) {
  # Adapted from magick::knit_print.magick-image
  plot_counter <- utils::getFromNamespace('plot_counter', 'knitr')
  in_base_dir <- utils::getFromNamespace('in_base_dir', 'knitr')
  tmp <- knitr::fig_path(ifelse(knitr::pandoc_to("pdf"), "pdf", "svg"),
                         number = plot_counter())
  in_base_dir({
    dir.create(dirname(tmp), showWarnings = FALSE, recursive = TRUE)
    if (knitr::pandoc_to("pdf")) {
      rsvg::rsvg_pdf(
        charToRaw(svg_string(x$svg, x$width, x$height)),
        file = tmp,
        width = x$width * 3,
        height = x$height * 3
      )
    } else {
      cat(svg_string(x$svg, x$width, x$height), file=tmp)
    }
  })
  knitr::include_graphics(tmp)
}

#' @exportS3Method knitr::knit_print
knit_print.controlchart <- function(x, ...) {
  # For knitr, print html for HTML output, and static plot for other formats
  if (knitr::is_html_output()) {
    knitr::knit_print(x$html_plot)
  } else {
    knit_print.static_plot(x$static_plot)
  }
}
