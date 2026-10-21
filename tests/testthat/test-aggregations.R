testthat::test_that("numeric aggregations ignore missing values and keep zero", {
  expected <- list(sum = c(30, 0), mean = c(15, 0), min = c(10, 0),
                   max = c(20, 0), median = c(15, 0), count = c(2, 1, 0))
  for (missing in c(NA_real_, NaN)) {
    data <- data.frame(
      key = rep(as.Date(c("2024-01-01", "2024-02-01", "2024-03-01")), each = 3),
      n = c(10, missing, 20, missing, 0, missing, missing, missing, missing),
      d = 100
    )
    for (method in names(expected)) {
      # An all-missing key counts 0 and is kept; other methods leave it missing
      expect_dropped <- function(expr, key) {
        if (method == "count") {
          testthat::expect_no_warning(expr)
        } else {
          testthat::expect_warning(expr, paste0("^key ", key, " removed due to: Numerator missing\\.$"))
        }
      }
      expect_dropped(
        spc_chart <- controlcharts::spc(
          data, keys = key, numerators = n,
          aggregations = list(numerators = method), return_objs = "limits"
        ),
        "01/03/2024"
      )
      expect_dropped(
        funnel_chart <- controlcharts::funnel(
          data, keys = key, numerators = n, denominators = d,
          aggregations = list(numerators = method), return_objs = "limits"
        ),
        "2024-03-01"
      )
      testthat::expect_equal(spc_chart$limits$value, expected[[method]], info = method)
      testthat::expect_equal(funnel_chart$limits$numerator, expected[[method]], info = method)
    }
  }
})

testthat::test_that("extrema ignore blanks between negative values", {
  data <- data.frame(
    key = rep(as.Date(c("2024-01-01", "2024-02-01")), each = 3),
    n = c(-10, NA, -20, -30, NA, -40)
  )
  expected <- list(min = c(-20, -40), max = c(-10, -30))
  for (method in names(expected)) {
    chart <- controlcharts::spc(
      data, keys = key, numerators = n,
      aggregations = list(numerators = method), return_objs = "limits"
    )
    testthat::expect_equal(chart$limits$value, expected[[method]], info = method)
  }
})

testthat::test_that("numerators and denominators aggregate independently", {
  data <- data.frame(
    key = rep(c("A", "B", "C"), each = 3),
    n = c(10, NA, 20, NA, 40, NA, 10, 20, 30),
    d = c(100, 200, NA, 100, NA, 300, NA, NA, NA)
  )
  expected <- controlcharts::funnel(
    data.frame(key = c("A", "B"), n = c(30, 40), d = c(300, 400)),
    keys = key, numerators = n, denominators = d, return_objs = "limits"
  )
  testthat::expect_warning(
    actual <- controlcharts::funnel(
      data, keys = key, numerators = n, denominators = d, return_objs = "limits"
    ),
    "^key C removed due to: Denominator missing\\.$"
  )
  testthat::expect_equal(actual$limits, expected$limits)
})

testthat::test_that("first and last skip missing values and tooltips", {
  data <- data.frame(
    key = rep(c("A", "B"), each = 3),
    n = c(NA, 10, 20, 30, NA, NA),
    note = c(NA, "a1", "a2", "b1", NA, NA)
  )
  expected <- list(first = list(n = c(10, 30), note = c("a1", "b1")),
                   last = list(n = c(20, 30), note = c("a2", "b1")))
  for (method in names(expected)) {
    chart <- controlcharts::spc(
      data, keys = key, numerators = n, tooltips = list(Note = note),
      aggregations = list(numerators = method, tooltips = method), return_objs = "limits"
    )
    testthat::expect_equal(chart$limits$value, expected[[method]]$n, info = method)
    testthat::expect_equal(chart$limits$Note, expected[[method]]$note, info = method)
  }
  counted <- controlcharts::spc(
    data, keys = key, numerators = n, tooltips = list(Note = note),
    aggregations = list(numerators = "count", tooltips = "count"), return_objs = "limits"
  )
  testthat::expect_equal(counted$limits$Note, c(2L, 1L))
  missing_notes <- controlcharts::spc(
    data.frame(key = c("A", "A"), n = c(1, 2), note = c(NA, NA)),
    keys = key, numerators = n, tooltips = list(Note = note),
    aggregations = list(tooltips = "count"), return_objs = "limits"
  )
  testthat::expect_equal(missing_notes$limits$Note, 0L)
})
