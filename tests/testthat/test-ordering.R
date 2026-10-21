testthat::test_that("Indicators are ordered by code point, independent of locale", {
  dat <- data.frame(
    key = rep(as.Date("2024-01-01") + 0:1, 4),
    numerator = 1:8,
    indicator = rep(c("beta", "Alpha", "alpha", "Beta"), each = 2)
  )
  limits <- spc(dat, keys = key, numerators = numerator, indicators = indicator,
                return_objs = "limits")$limits
  testthat::expect_identical(unique(limits$indicator), c("Alpha", "Beta", "alpha", "beta"))
})

testthat::test_that("Numeric keys are ordered by value", {
  dat <- data.frame(key = c(10, 2, 1, 100000), numerator = c(5, 6, 7, 9), denominator = 20)
  limits <- funnel(dat, keys = key, numerators = numerator, denominators = denominator,
                   return_objs = "limits")$limits
  testthat::expect_identical(limits$key, c(1, 2, 10, 100000))
  testthat::expect_identical(limits$numerator, c(7, 6, 5, 9))
})

testthat::test_that("Aggregations default when NULL and reject unknown names", {
  dat <- data.frame(key = rep(as.Date("2024-01-01") + 0:3, 2), numerator = 1:8)
  limits <- spc(dat, keys = key, numerators = numerator, aggregations = NULL,
                return_objs = "limits")$limits
  testthat::expect_identical(limits$value, c(6, 8, 10, 12))
  testthat::expect_error(
    spc(dat, keys = key, numerators = numerator, aggregations = list(constructor = "sum")),
    "'constructor' is not a valid variable to aggregate"
  )
  testthat::expect_error(
    spc(dat, keys = key, numerators = numerator, aggregations = list(numerators = "sd")),
    "'sd' is not a valid aggregation"
  )
})
