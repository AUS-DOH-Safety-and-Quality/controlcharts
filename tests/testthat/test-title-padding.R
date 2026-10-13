title_data <- function() {
  data.frame(key = as.Date("2024-01-01") + 0:7, n = c(8, 11, 10, 12, 9, 13, 8, 10))
}

testthat::test_that("Partial canvas settings keep the default padding", {
  data <- title_data()
  partial <- spc(data, keys = key, numerators = n,
                 canvas_settings = list(left_padding = 20), return_objs = "static_plot")
  explicit <- spc(data, keys = key, numerators = n,
                  canvas_settings = list(left_padding = 20, lower_padding = 10),
                  return_objs = "static_plot")
  testthat::expect_identical(partial$static_plot$svg, explicit$static_plot$svg)
})

testthat::test_that("Titles pad each row's upper padding", {
  data <- title_data()
  scalar <- spc(data, keys = key, numerators = n, title = "Title",
                canvas_settings = list(upper_padding = 10), return_objs = "static_plot")
  vector <- spc(data, keys = key, numerators = n, title = "Title",
                canvas_settings = list(upper_padding = rep(10, 8)), return_objs = "static_plot")
  testthat::expect_identical(vector$static_plot$svg, scalar$static_plot$svg)
})

testthat::test_that("Fractional title font sizes are used for padding", {
  data <- title_data()
  testthat::expect_no_warning(
    fractional <- spc(data, keys = key, numerators = n,
                      title = list(text = "Title", font_size = "16.5px"),
                      return_objs = "static_plot")
  )
  whole <- spc(data, keys = key, numerators = n,
               title = list(text = "Title", font_size = "16px"),
               return_objs = "static_plot")
  testthat::expect_false(identical(fractional$static_plot$svg, whole$static_plot$svg))
})

testthat::test_that("Unknown title settings are rejected", {
  testthat::expect_error(
    spc(title_data(), keys = key, numerators = n, title = list(text = "Title", colour = "red")),
    "The title must be a string, or named settings from: 'text'"
  )
  testthat::expect_error(
    spc(title_data(), keys = key, numerators = n, title = list(text = "Title", constructor = "x")),
    "The title must be a string, or named settings from: 'text'"
  )
})

testthat::test_that("Static plots are complete SVG documents", {
  chart <- spc(title_data(), keys = key, numerators = n, width = 720.5, height = 480,
               return_objs = "static_plot")
  testthat::expect_match(
    chart$static_plot$svg,
    '^<svg viewBox="0 0 720.5 480" width="720.5px" height="480px" xmlns="http://www.w3.org/2000/svg">'
  )
  testthat::expect_no_match(chart$static_plot$svg, "dominant-baseline")
})
