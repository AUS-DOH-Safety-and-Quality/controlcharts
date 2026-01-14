if (!exists("cc_list_fixture_files")) {
  helper_path <- file.path(system.file("tinytest", package = "controlcharts"), "helper-controlcharts-fixtures.R")
  source(helper_path, local = TRUE)
}

files <- cc_list_fixture_files("spc_")

expect_true(
  length(files) > 0,
  info = "No SPC fixtures found under inst/tinytest/_fixtures"
)

for (path in files) {
  fx <- cc_read_fixture(path)

  info <- paste0("fixture=", basename(path))

  obj <- cc_call_spc(
    data = fx$input$data,
    keys = fx$input$controlcharts$keys,
    numerators = fx$input$controlcharts$numerators,
    denominators = fx$input$controlcharts$denominators,
    xbar_sds = fx$input$controlcharts$xbar_sds,
    spc_settings = fx$input$controlcharts$spc_settings
  )

  expected <- fx$expected
  actual <- cc_drop_spc_to_expected(obj$limits, names(expected))

  cc_expect_limits_equal(actual, expected, tol_abs = 1e-6, tol_rel = 1e-6, context = basename(path))
}
