# @import QuickJSR
.onLoad <- function(libname, pkgname) {
  assign("spc_ctx", QuickJSR::JSContext$new(), envir = topenv())
  spc_ctx$source(system.file("intl_polyfill.js", package = "controlcharts", mustWork = TRUE))
  spc_ctx$source(system.file("htmlwidgets/lib/PBISPC/PBISPC.js", package = "controlcharts", mustWork = TRUE))
  spc_ctx$source(system.file("htmlwidgets/lib/PBIFUN-1.5.3.4/PBIFUN-1.5.3.4.js", package = "controlcharts", mustWork = TRUE))
  spc_ctx$source(system.file("htmlwidgets/lib/UTILS/UTILS.js", package = "controlcharts", mustWork = TRUE))
  spc_ctx$source(system.file("initialise_headless.js", package = "controlcharts", mustWork = TRUE))
  assign(".spc_default_settings_internal",
    lapply(spc_ctx$get("spc.defaultSettings"), \(settings_group) {
      lapply(settings_group, \(setting) {
        setting$default
      })
    }),
    envir = topenv()
  )
  assign(".funnel_default_settings_internal",
    lapply(spc_ctx$get("funnel.defaultSettings"), \(settings_group) {
      lapply(settings_group, \(setting) {
        setting$default
      })
    }),
    envir = topenv()
  )
}
