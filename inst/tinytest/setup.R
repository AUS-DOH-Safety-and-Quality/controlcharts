# tinytest setup file (sourced before test-*.R)

helper_path <- file.path(system.file("tinytest", package = "controlcharts"), "helper-controlcharts-fixtures.R")
if (!file.exists(helper_path)) {
  stop("Missing tinytest helper: ", helper_path, call. = FALSE)
}
source(helper_path, local = TRUE)
