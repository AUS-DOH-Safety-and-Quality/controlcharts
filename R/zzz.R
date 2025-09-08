.onLoad <- function(libname, pkgname) {
  assign("ctx", QuickJSR::JSContext$new(), envir = topenv())
  ctx$source(system.file("intl_polyfill.js", package = "controlcharts", mustWork = TRUE))
  ctx$source(system.file("htmlwidgets/lib/PBISPC/PBISPC.js", package = "controlcharts", mustWork = TRUE))
  ctx$source(system.file("htmlwidgets/lib/PBIFUN/PBIFUN.js", package = "controlcharts", mustWork = TRUE))
  ctx$source(system.file("htmlwidgets/lib/UTILS/UTILS.js", package = "controlcharts", mustWork = TRUE))
  ctx$source(system.file("initialise_headless.js", package = "controlcharts", mustWork = TRUE))
  assign(".spc_default_settings_internal",
    lapply(ctx$get("spc.defaultSettings"), function(settings_group) {
      lapply(settings_group, function(setting) {
        setting$default
      })
    }),
    envir = topenv()
  )
  assign(".funnel_default_settings_internal",
    lapply(ctx$get("funnel.defaultSettings"), function(settings_group) {
      lapply(settings_group, function(setting) {
        setting$default
      })
    }),
    envir = topenv()
  )
}
