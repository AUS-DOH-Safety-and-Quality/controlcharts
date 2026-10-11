skip_on_cran()

source("helpers.R")
init_chromote()

test_that("MISC HTML tooltips render above bars with funnel formatting", {
  dat <- data.frame(
    organisation = LETTERS[1:4],
    indicator = "Percentage measure",
    numerator = c(8, 5, 4, 6),
    denominator = 10,
    note = c("Target", "B", "C", "D")
  )
  chart <- misc(
    dat,
    keys = organisation,
    numerators = numerator,
    denominators = denominator,
    indicators = indicator,
    target = "A",
    title = "Native MISC",
    tooltips = list(Note = note),
    return_objs = "html_plot"
  )
  outfile <- tempfile(fileext = ".html")
  chart$save_plot(outfile)

  browser <- chromote::ChromoteSession$new()
  on.exit(browser$close(), add = TRUE)
  browser$go_to(paste0("file://", outfile))
  browser$Runtime$evaluate("HTMLWidgets.find('.funnel').resize(720, 480)")
  expect_equal(browser$Runtime$evaluate(
    "document.querySelector('.funnel .chart-title').textContent"
  )$result$value, "Native MISC")
  tooltip <- browser$Runtime$evaluate(
    paste(
      "const bar = document.querySelector('.funnel .misc-bar');",
      "bar.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));",
      "const group = document.querySelector('.funnel .chart-tooltip-group');",
      "({",
      "  lines: Array.from(group.querySelectorAll('text'), node => node.textContent),",
      "  raised: group === group.parentElement.lastElementChild",
      "})"
    ),
    returnByValue = TRUE
  )$result$value
  lines <- unlist(tooltip$lines, use.names = FALSE)

  expect_true(tooltip$raised)
  expect_true(any(grepl("^Z-score: -?[0-9]+\\.[0-9]{3}$", lines)))
  expect_contains(lines, "Numerator: 8")
  expect_contains(lines, "Denominator: 10")
  expect_contains(lines, "Proportion: 80.00%")
  settings <- funnel_default_settings("lines")
  expect_true(any(grepl(paste0(settings$ttip_label_99_prefix_upper, settings$ttip_label_99, ": "),
                        lines, fixed = TRUE)))
  expect_true(any(grepl(paste0(settings$ttip_label_99_prefix_lower, settings$ttip_label_99, ": "),
                        lines, fixed = TRUE)))
  expect_contains(lines, "Note: Target")
})
