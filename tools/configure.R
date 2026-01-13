# Minify files if jsutils is available
if (requireNamespace("jsutils", quietly = TRUE)) {
  # Find all JavaScript files in inst/ directory
  js_files <- list.files(
    path = "inst",
    pattern = "\\.js$",
    recursive = TRUE,
    full.names = TRUE
  )

  # Filter out already minified files
  js_files <- js_files[!grepl("\\.min\\.js$", js_files)]

  # Terser options
  terser_options <- list(
    compress = list(dead_code = TRUE, drop_console = FALSE, passes = 2),
    mangle = TRUE,
    format = list(comments = FALSE)
  )

  # Minify each file
  for (js_file in js_files) {
    minified_file <- sub("\\.js$", ".min.js", js_file)
    tryCatch({
      result <- jsutils::terser(js_file, terser_options)
      if (!is.null(result$code)) {
        writeLines(result$code, minified_file)
      }
    }, error = function(e) {
      warning(sprintf("Failed to minify %s: %s", js_file, e$message))
    })
  }
}
