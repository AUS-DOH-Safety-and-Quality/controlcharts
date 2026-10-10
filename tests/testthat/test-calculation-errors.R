test_that("Funnel calculation errors do not return previous limits", {
  dat <- data.frame(key = LETTERS[1:3], numerator = c(10, 12, 9),
                    denominator = 100)
  calculate <- function(data) {
    funnel(data, keys = key, numerators = numerator,
           denominators = denominator, return_objs = "limits")$limits
  }
  expected <- calculate(dat)
  invalid <- dat
  invalid$numerator <- -1

  expect_error(calculate(invalid), "All numerators are negative!", fixed = TRUE)
  expect_equal(calculate(dat), expected)

  result <- controlcharts:::ctx$call(
    "updateHeadlessVisual", "funnel", list(), list(text = NULL),
    640, 400, FALSE, TRUE
  )
  expect_identical(result, list(error = "No data present"))
})

test_that("SPC calculation errors do not return previous limits", {
  dat <- data.frame(key = 1:3, numerator = c(10, 12, 9), denominator = 100)
  expected <- spc(dat, keys = key, numerators = numerator,
                  denominators = denominator,
                  spc_settings = list(chart_type = "p"),
                  return_objs = "limits")$limits

  expect_error(
    spc(dat, keys = key, numerators = numerator,
        spc_settings = list(chart_type = "p"), return_objs = "limits"),
    "Chart type 'p' requires denominators!", fixed = TRUE
  )
  actual <- spc(dat, keys = key, numerators = numerator,
                denominators = denominator,
                spc_settings = list(chart_type = "p"),
                return_objs = "limits")$limits
  expect_equal(actual, expected)
})
