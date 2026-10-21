skip_on_cran()

source("helpers.R")
init_chromote()

test_that("single-row SPC and funnel widgets render their observations", {
  dat <- data.frame(key = "2024-01-31", numerator = 5, denominator = 100)
  spc_plot <- spc(
    dat, keys = key, numerators = numerator, denominators = denominator,
    spc_settings = list(chart_type = "p"), return_objs = "html_plot"
  )$html_plot
  funnel_plot <- funnel(
    dat, keys = key, numerators = numerator, denominators = denominator,
    return_objs = "html_plot"
  )$html_plot
  output <- tempfile(fileext = ".html")
  htmltools::save_html(htmltools::tagList(spc_plot, funnel_plot), output)
  browser <- chromote::ChromoteSession$new()
  on.exit(browser$close(), add = TRUE)
  browser$go_to(paste0("file://", output))
  state <- browser$Runtime$evaluate(r"(
    ({
      errors: document.querySelectorAll('.errormessage').length,
      spc: document.querySelectorAll('.spc .dotsgroup > *').length,
      funnel: document.querySelectorAll('.funnel .dotsgroup > *').length
    })
  )", returnByValue = TRUE)$result$value
  expect_equal(state$errors, 0)
  expect_equal(state$spc, 1)
  expect_equal(state$funnel, 1)
})
