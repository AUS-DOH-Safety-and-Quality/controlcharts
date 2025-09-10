#' @exportS3Method
print.controlchart <- function(x, ...) {
  print(x$html_plot)
}

#' Method to print a static plot to the R graphics device
#' Uses the QuickJSR package for running the visual JS to create an SVG string
#' of the plot, then the rsvg package to render that SVG to the graphics device
#' @exportS3Method
print.static_plot <- function(x, ...) {
  # Clear the current device before drawing
  grid::grid.newpage()

  # If a width/height wasn't specified when the plot was created,
  # use the current device dimensions
  viewer_dims <- grDevices::dev.size("px")
  width <- ifelse(is.null(x$width), viewer_dims[1], x$width)
  height <- ifelse(is.null(x$height), viewer_dims[2], x$height)

  # Generate the SVG string for the current dimensions
  svg <- ctx$call("updateHeadlessVisual", x$type, x$dataViews, width, height)$svg

  # Use the rsvg package to convert the SVG string to a raster image compatible
  # with the R graphics device
  svg_raster <- rsvg::rsvg_nativeraster(
    charToRaw(svg_string(svg, width, height)),
    # Rasterize at 3x resolution for better quality
    width=width*3,
    height=height*3
  )

  # Draw the raster image to the device
  grid::grid.raster(svg_raster)
}
