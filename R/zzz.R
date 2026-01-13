ctx <- NULL

.load_js_file <- function(context, filename) {
  context$source(system.file(filename, package = "controlcharts",
                             mustWork = TRUE))
}

.onLoad <- function(libname, pkgname) {
  # Create a new Javascript context for calculating limits
  # and rendering static plots
  assign("ctx", QuickJSR::JSContext$new(), envir = topenv())

  # The visuals rely on DOM-manipulation (via d3) to
  # construct the SVGs, so we use a dummy-DOM implementation
  # for headless rendering
  .load_js_file(ctx, "js/minidom.js")
  .load_js_file(ctx, "htmlwidgets/lib/PBISPC/PBISPC.js")
  .load_js_file(ctx, "htmlwidgets/lib/PBIFUN/PBIFUN.js")
  .load_js_file(ctx, "htmlwidgets/lib/UTILS/commonUtils.js")
  .load_js_file(ctx, "htmlwidgets/lib/UTILS/headlessUtils.js")
  ctx$call("initialiseHeadless")

  # Extract default settings from each chart type and store in R
  for (type in c("spc", "funnel")) {
    assign(paste0(".", type, "_default_settings_internal"),
      lapply(ctx$get(paste0(type, ".defaultSettings")),
             function(settings_group) {
               lapply(settings_group, function(setting) setting$default)
             }),
      envir = topenv()
    )
  }
}
