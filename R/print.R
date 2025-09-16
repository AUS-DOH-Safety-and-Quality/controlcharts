#' @exportS3Method
print.controlchart <- function(x, ...) {
  print(x$html_plot)
}

# Method to print a static plot to the R graphics device
# Uses the QuickJSR package for running the visual JS to create an SVG string
# of the plot, then the rsvg package to render that SVG to the graphics device
#' @exportS3Method
print.static_plot <- function(x, ...) {
  # Clear the current device before drawing
  grid::grid.newpage()
  viewer_dims <- grDevices::dev.size("px")

  # If the plot was created with a user-specified width and height, or the dimensions
  # of the viewport haven't changed, then use the existing raster object
  # Otherwise, generate a new SVG string & raster with the current dimensions
  # and store them in the static plot object
  if (!x$fixed_dimensions) {
    if (x$width != viewer_dims[1] || x$height != viewer_dims[2]) {
      x$width <- viewer_dims[1]
      x$height <- viewer_dims[2]
      x$svg <- ctx$call("updateHeadlessVisual", x$type, x$dataViews, x$width, x$height)$svg
      x$raster <- NULL  # Invalidate the raster so it will be regenerated
    }
  }

  if (is.null(x$raster)) {
    x$raster <- svg_raster(x$svg, x$width, x$height)
  }

  # Draw the raster image to the device
  grid::grid.raster(x$raster)
}

#' @exportS3Method knitr::knit_print
knit_print.controlchart <- function(x, ...) {
  # For knitr, print html for HTML output, and static plot for other formats
  if (knitr::is_html_output()) {
    knitr::knit_print(x$html_plot)
  } else {
    print.static_plot(x$static_plot)
  }
}
