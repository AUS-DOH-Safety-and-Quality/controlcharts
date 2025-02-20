# @import QuickJSR
.onLoad <- function(libname, pkgname) {
  assign("spc_ctx", QuickJSR::JSContext$new(), envir = topenv())
  spc_ctx$source(system.file("htmlwidgets/lib/PBISPC-1.4.4.21/PBISPC-1.4.4.21.js", package = "controlcharts", mustWork = TRUE))
  spc_ctx$source(system.file("htmlwidgets/lib/utils/utils.js", package = "controlcharts", mustWork = TRUE))
  spc_ctx$source(system.file("initialise_headless.js", package = "controlcharts", mustWork = TRUE))
}
