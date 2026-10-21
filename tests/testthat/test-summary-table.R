spc_rows <- function() {
  data.frame(month = as.Date("2024-01-01") + 0:7, numerator = c(5, 7, 6, 8, 5, 6, 7, 9),
             denominator = c(4, 5, 4, 5, 4, 5, 4, 5), sd = c(1, 1.2, 0.9, 1.1, 1, 1.3, 0.8, 1))
}

funnel_rows <- function() {
  data.frame(site = c("A", "B", "C", "D"), indicator = rep(c("Higher", "Lower"), each = 2),
             numerator = c(5, 6, 7, 8), denominator = c(50, 60, 40, 80))
}

test_that("a summary table has no static plot, which is omitted by default and refused when requested", {
  table <- list(show_table = TRUE)
  dat <- spc_rows()
  spc_chart <- spc(dat, keys = month, numerators = numerator, summary_table_settings = table)
  expect_setequal(names(spc_chart), c("html_plot", "limits", "save_plot"))
  expect_identical(spc_chart$limits, spc(dat, keys = month, numerators = numerator, return_objs = "limits")$limits)
  expect_error(spc(dat, keys = month, numerators = numerator, summary_table_settings = table, return_objs = "static_plot"),
               "Static plots are not available for summary tables.", fixed = TRUE)

  fun <- funnel_rows()
  funnel_chart <- funnel(fun, keys = site, numerators = numerator, denominators = denominator, summary_table_settings = table)
  expect_setequal(names(funnel_chart), c("html_plot", "limits", "save_plot"))
  expect_error(funnel(fun, keys = site, numerators = numerator, denominators = denominator,
                      summary_table_settings = table, return_objs = "static_plot"),
               "Static plots are not available for summary tables.", fixed = TRUE)
  expect_s3_class(spc(dat, keys = month, numerators = numerator, summary_table_settings = list(show_table = FALSE))$static_plot,
                  "static_plot")
})

test_that("indicators show the MISC chart over a requested funnel table, keeping its static plot", {
  chart <- funnel(funnel_rows(), keys = site, numerators = numerator, denominators = denominator, indicators = indicator,
                  summary_table_settings = list(show_table = TRUE))
  expect_s3_class(chart$static_plot, "static_plot")
  expect_true(grepl("misc-root", chart$static_plot$svg, fixed = TRUE))
})

test_that("summary table settings reach the interactive table and are validated", {
  chart <- spc(spc_rows(), keys = month, numerators = numerator, return_objs = "html_plot",
               summary_table_settings = list(show_table = TRUE, table_opacity_unselected = 0.4))
  objects <- chart$html_plot$x$update_values$dataViews[[1]]$categorical$categories[[1]]$objects[[1]]
  expect_identical(objects$summary_table, list(show_table = TRUE, table_opacity_unselected = 0.4))
  expect_error(spc(spc_rows(), keys = month, numerators = numerator, summary_table_settings = list(not_a_setting = 1)),
               "Invalid setting 'not_a_setting' in group 'summary_table'", fixed = TRUE)
})

test_that("xbar and s limits include each group's size as the denominator", {
  dat <- spc_rows()
  xbar <- spc(dat, keys = month, numerators = numerator, denominators = denominator, xbar_sds = sd,
              spc_settings = list(chart_type = "xbar"), return_objs = "limits")$limits
  s <- spc(dat, keys = month, numerators = sd, denominators = denominator,
           spc_settings = list(chart_type = "s"), return_objs = "limits")$limits
  expect_equal(xbar$denominator, dat$denominator)
  expect_equal(s$denominator, dat$denominator)
  expect_equal(xbar$value, dat$numerator)
  expect_equal(s$value, dat$sd)
})
