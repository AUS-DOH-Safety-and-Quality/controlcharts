minify_deps <- function(script) {
  src_folder <- dirname(script)
  src_file <- basename(script)
  new_file <- gsub(".js", ".min.js", src_file, fixed = TRUE)
  output_file <- file.path(src_folder, new_file)
  if (!getOption("controlcharts.debug", FALSE)) {
    terser_options <- list(
      compress = list(dead_code = TRUE, drop_console = FALSE, passes = 2),
      mangle = TRUE,
      format = list(comments = FALSE)
    )
    minified <- jsutils::terser(script, terser_options)$code
    writeLines(minified, output_file)
  } else {
    file.copy(script, output_file, overwrite = TRUE)
  }
}

# Minify the JS dependencies during installation
minify_deps(system.file("js", "minidom.js", package = "controlcharts"))
minify_deps(system.file("htmlwidgets", "lib", "PBIFUN", "PBIFUN.js",
                        package = "controlcharts"))
minify_deps(system.file("htmlwidgets", "lib", "PBISPC", "PBISPC.js",
                        package = "controlcharts"))
minify_deps(system.file("htmlwidgets", "lib", "UTILS", "commonUtils.js",
                        package = "controlcharts"))
minify_deps(system.file("htmlwidgets", "lib", "UTILS", "headlessUtils.js",
                        package = "controlcharts"))
minify_deps(system.file("htmlwidgets", "lib", "UTILS", "interactiveUtils.js",
                        package = "controlcharts"))
