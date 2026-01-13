#' @exportS3Method
print.controlchart <- function(x, ...) {
  print(x$html_plot)
}

# Method to print a static plot to the R graphics device
# Simply writes the SVG string to a temporary file and opens it in the viewer
#' @exportS3Method
print.static_plot <- function(x, ...) {
  viewer <- getOption("viewer")
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

# Knit print method for static_plot objects
# This method is used by knitr to render static plots in knitted documents.
# If the output format is PDF, it uses the rsvg package to convert
# the SVG to PDF,
# otherwise it writes the SVG directly to a file.
#' @exportS3Method knitr::knit_print
knit_print.static_plot <- function(x, ...) {
  # Adapted from magick::knit_print.magick-image
  plot_counter <- utils::getFromNamespace("plot_counter", "knitr")
  in_base_dir <- utils::getFromNamespace("in_base_dir", "knitr")
  tmp <- knitr::fig_path(ifelse(knitr::pandoc_to("pdf"), "pdf", "svg"),
                         number = plot_counter())
  in_base_dir({
    dir.create(dirname(tmp), showWarnings = FALSE, recursive = TRUE)
    if (knitr::pandoc_to("pdf")) {
      if (!requireNamespace("rsvg", quietly = TRUE)) {
        stop("The 'rsvg' package is required for knitting to PDF.",
             call. = FALSE)
      }
      rsvg::rsvg_pdf(
        charToRaw(svg_string(x$svg, x$width, x$height)),
        file = tmp,
        # Scale up the SVG for better resolution in PDF
        width = x$width * 3,
        height = x$height * 3
      )
    } else {
      cat(svg_string(x$svg, x$width, x$height), file = tmp)
    }
  })
  knitr::include_graphics(tmp)
}

# Knit print method for controlchart objects
# This method is used by knitr to render control charts in knitted documents. It
# allows for the rendering process to detect whether an interactive or static
# plot should be used based on the output format.
# If the output format is HTML, it delegates to the knit_print method
# for html_plot (htmlwidgets).
# If the output format is PDF or other static formats, it uses the above
# knit_print method for static_plot.
#' @exportS3Method knitr::knit_print
knit_print.controlchart <- function(x, ...) {
  # For knitr, print html for HTML output, and static plot for other formats
  if (knitr::is_html_output()) {
    knitr::knit_print(x$html_plot, ...)
  } else {
    knit_print.static_plot(x$static_plot, ...)
  }
}
