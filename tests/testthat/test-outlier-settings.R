testthat::test_that("scalar and vector switches match the first chart row", {
  data <- data.frame(
    key = as.Date("2024-01-01") + 0:11,
    n = c(rep(10, 11), 100),
    d = 100:111
  )
  patterns <- list(
    spc = c("astronomical", "shift", "trend", "two_in_three"),
    funnel = c("two_sigma", "three_sigma")
  )
  for (chart_type in names(patterns)) {
    constructor <- getExportedValue("controlcharts", chart_type)
    for (flag in patterns[[chart_type]]) {
      column <- flag
      if (flag == "astronomical") {
        column <- "astpoint"
      }
      for (enabled in c(FALSE, TRUE)) {
        expected <- constructor(
          data, keys = key, numerators = n, denominators = d,
          outlier_settings = stats::setNames(list(enabled), flag),
          return_objs = c("limits", "static_plot")
        )
        testthat::expect_identical(column %in% names(expected$limits), enabled)
        for (value in list(list(enabled), rep(enabled, 12), c(enabled, rep(!enabled, 11)))) {
          settings <- stats::setNames(list(value), flag)
          actual <- constructor(
            data, keys = key, numerators = n, denominators = d,
            outlier_settings = settings, return_objs = c("limits", "static_plot")
          )
          testthat::expect_equal(actual$limits, expected$limits)
          testthat::expect_identical(actual$static_plot$svg, expected$static_plot$svg)
          limits_only <- constructor(
            data, keys = key, numerators = n, denominators = d,
            outlier_settings = settings, return_objs = "limits"
          )
          testthat::expect_equal(limits_only$limits, expected$limits)
        }
      }
    }
  }
})

testthat::test_that("switches follow sorted and aggregated keys", {
  data <- data.frame(
    key = as.Date(c("2024-03-01", "2024-01-01", "2024-01-01", "2024-02-01")),
    n = c(90, 5, 5, 10),
    d = c(120, 50, 50, 110)
  )
  patterns <- c(spc = "astronomical", funnel = "three_sigma")
  for (chart_type in names(patterns)) {
    constructor <- getExportedValue("controlcharts", chart_type)
    flag <- patterns[[chart_type]]
    for (enabled in c(FALSE, TRUE)) {
      expected <- constructor(
        data, keys = key, numerators = n, denominators = d,
        outlier_settings = stats::setNames(list(enabled), flag),
        return_objs = c("limits", "static_plot")
      )
      actual <- constructor(
        data, keys = key, numerators = n, denominators = d,
        outlier_settings = stats::setNames(list(c(!enabled, enabled, !enabled, !enabled)), flag),
        return_objs = c("limits", "static_plot")
      )
      testthat::expect_equal(actual$limits, expected$limits)
      testthat::expect_identical(actual$static_plot$svg, expected$static_plot$svg)
    }
  }
})

testthat::test_that("SPC indicators have independent outlier columns", {
  data <- data.frame(
    key = as.Date(c("2024-02-01", "2024-01-01", "2024-01-01", "2024-02-01")),
    indicator = c("B", "A", "B", "A"),
    n = c(90, 10, 10, 90)
  )
  chart <- controlcharts::spc(
    data, keys = key, numerators = n, indicators = indicator, return_objs = "limits",
    outlier_settings = list(
      astronomical = c(FALSE, FALSE, TRUE, TRUE),
      shift = c(TRUE, TRUE, FALSE, FALSE)
    )
  )
  for (indicator in c("A", "B")) {
    enabled <- indicator == "B"
    expected <- controlcharts::spc(
      data[data$indicator == indicator, ], keys = key, numerators = n,
      outlier_settings = list(astronomical = enabled, shift = !enabled),
      return_objs = "limits"
    )
    testthat::expect_equal(chart$limits[[indicator]], expected$limits)
  }
})
