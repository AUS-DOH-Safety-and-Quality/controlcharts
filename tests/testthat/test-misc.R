misc_data <- function() {
  totals <- data.frame(
    organisation = rep(LETTERS[1:4], 2),
    indicator = rep(c("Higher is better", "Lower is better"), each = 4),
    numerator = c(80, 20, 24, 30, 4, 20, 24, 30),
    denominator = 100,
    direction = rep(c("increase", "decrease"), each = 4),
    grouping = rep(c("Effectiveness", "Safety"), each = 4)
  )
  rows <- rep(seq_len(nrow(totals)), each = 2)
  transform(
    totals[rows, ],
    numerator = numerator / 2,
    denominator = denominator / 2
  )
}

test_that("MISC delegates raw indicator data to funnel calculations", {
  dat <- misc_data()
  chart <- misc(
    dat,
    keys = organisation,
    numerators = numerator,
    denominators = denominator,
    indicators = indicator,
    target = "A",
    outlier_settings = list(improvement_direction = direction),
    return_objs = "limits"
  )
  expect_identical(names(chart$limits), c(
    "indicator", "group", "z", "score", "three_sigma", "numerator", "denominator",
    "value", "target", "ll99", "ll95", "ll68", "ul68", "ul95", "ul99"
  ))

  for (indicator_name in unique(dat$indicator)) {
    rows <- dat$indicator == indicator_name
    direction <- unique(dat$direction[rows])
    funnel_limits <- funnel(
      dat[rows, ],
      keys = organisation,
      numerators = numerator,
      denominators = denominator,
      outlier_settings = list(
        improvement_direction = direction,
        three_sigma = TRUE
      ),
      return_objs = "limits"
    )$limits
    expected <- funnel_limits[funnel_limits$group == "A", ]
    actual <- chart$limits[chart$limits$indicator == indicator_name, ]

    expect_equal(actual$numerator, expected$numerator)
    expect_equal(actual$denominator, expected$denominator)
    expect_equal(actual$z, expected$z)
    expect_equal(
      actual$score,
      expected$z * ifelse(direction == "decrease", -1, 1)
    )
    expect_equal(actual$three_sigma, expected$three_sigma)
  }
})

test_that("MISC renders and saves a single indicator", {
  dat <- subset(misc_data(), indicator == "Higher is better")
  chart <- misc(
    dat,
    keys = organisation,
    numerators = numerator,
    denominators = denominator,
    indicators = indicator,
    target = "A",
    title = "Single-indicator MISC"
  )

  expect_s3_class(chart, "controlchart")
  expect_s3_class(chart$html_plot, "funnel")
  expect_equal(chart$limits$indicator, "Higher is better")
  expect_match(chart$static_plot$svg, "misc-bar", fixed = TRUE)

  outfile <- tempfile(fileext = ".svg")
  chart$save_plot(outfile, width = 720, height = 480)
  svg <- paste(readLines(outfile, warn = FALSE), collapse = "\n")
  expect_match(svg, "Single-indicator MISC", fixed = TRUE)
  expect_match(svg, "misc-limit-99", fixed = TRUE)
})

testthat::test_that("MISC renders are independent across charts and export sizes", {
  dat <- misc_data()
  chart <- misc(
    dat, keys = organisation, numerators = numerator, denominators = denominator,
    indicators = indicator, target = "A",
    title = list(text = "First chart", subtitle = "First subtitle"),
    return_objs = "static_plot"
  )
  misc(
    dat, keys = organisation, numerators = numerator, denominators = denominator,
    indicators = indicator, target = "B", title = "Second chart",
    return_objs = "static_plot"
  )
  repeated <- misc(
    dat, keys = organisation, numerators = numerator, denominators = denominator,
    indicators = indicator, target = "A",
    title = list(text = "First chart", subtitle = "First subtitle"),
    return_objs = "static_plot"
  )
  testthat::expect_identical(repeated$static_plot$svg, chart$static_plot$svg)
  output <- tempfile(fileext = ".svg")
  on.exit(unlink(output), add = TRUE)
  chart$save_plot(output, width = 720, height = 480)
  resized <- misc(
    dat, keys = organisation, numerators = numerator, denominators = denominator,
    indicators = indicator, target = "A",
    title = list(text = "First chart", subtitle = "First subtitle"),
    width = 720, height = 480, return_objs = "static_plot"
  )
  testthat::expect_identical(
    paste(readLines(output), collapse = "\n"),
    resized$static_plot$svg
  )
})

test_that("MISC validates target and per-indicator direction", {
  dat <- misc_data()
  expect_error(
    misc(
      dat,
      keys = organisation,
      numerators = numerator,
      denominators = denominator,
      indicators = indicator,
      target = "missing",
      return_objs = "limits"
    ),
    "Select a MISC group present in the data.", fixed = TRUE
  )

  dat$direction[1] <- "decrease"
  expect_error(
    misc(
      dat,
      keys = organisation,
      numerators = numerator,
      denominators = denominator,
      indicators = indicator,
      target = "A",
      outlier_settings = list(improvement_direction = direction),
      return_objs = "limits"
    ),
    "one improvement direction", fixed = TRUE
  )
})

test_that("MISC aggregates custom tooltips with the funnel population", {
  dat <- data.frame(
    organisation = c("A", "A", "B", "C", "D"),
    indicator = "Measure",
    numerator = c(3, 5, 2, 4, 6),
    denominator = c(5, 5, 10, 10, 10),
    note = c("first target row", "last target row", "B", "C", "D")
  )
  chart <- misc(
    dat,
    keys = organisation,
    numerators = numerator,
    denominators = denominator,
    indicators = indicator,
    target = "A",
    tooltips = list(Note = note),
    aggregations = list(
      numerators = "sum",
      denominators = "sum",
      tooltips = "last",
      labels = "first"
    ),
    return_objs = "html_plot"
  )

  columns <- chart$html_plot$x$update_values$dataViews[[1]]$categorical$values
  tooltip_columns <- Filter(
    function(column) isTRUE(column$source$roles$tooltips),
    columns
  )
  expect_equal(tooltip_columns[[1]]$values, c("last target row", "B", "C", "D"))
})

test_that("MISC uses native Funnel rate tooltip formatting", {
  dat <- data.frame(
    organisation = LETTERS[1:4],
    indicator = "Rate measure",
    numerator = c(8, 5, 4, 6),
    denominator = 1000
  )
  chart <- misc(
    dat,
    keys = organisation,
    numerators = numerator,
    denominators = denominator,
    indicators = indicator,
    target = "A",
    funnel_settings = list(
      chart_type = "PR",
      multiplier = 1000,
      perc_labels = "No"
    ),
    return_objs = "limits"
  )

  tooltips <- controlcharts:::ctx$get("funnelVisual.viewModel.miscPoints")[[1]]$tooltip
  funnel(
    dat, keys = organisation, numerators = numerator, denominators = denominator,
    funnel_settings = list(chart_type = "PR", multiplier = 1000, perc_labels = "No"),
    return_objs = "limits"
  )
  expected <- controlcharts:::ctx$get("funnelVisual.viewModel.plotPoints")[[1]]$tooltip
  expect_equal(tooltips[-c(1, 2)], expected)
})

test_that("MISC applies funnel's automatic percentage rule", {
  dat <- data.frame(
    organisation = LETTERS[1:4],
    indicator = "Percentage measure",
    numerator = c(8, 5, 4, 6),
    denominator = 10
  )
  chart <- misc(
    dat,
    keys = organisation,
    numerators = numerator,
    denominators = denominator,
    indicators = indicator,
    target = "A",
    return_objs = "limits"
  )

  tooltips <- controlcharts:::ctx$get("funnelVisual.viewModel.miscPoints")[[1]]$tooltip
  values <- vapply(tooltips, function(item) item$value, character(1))
  expect_contains(values, "80.00%")
})

test_that("MISC forwards multiple indicator columns and native settings to Funnel", {
  dat <- misc_data()
  wrapped <- misc(
    dat, keys = organisation, numerators = numerator, denominators = denominator,
    indicators = list(grouping, indicator), target = "B",
    misc_settings = list(lower = -4, upper = 4),
    outlier_settings = list(improvement_direction = direction),
    return_objs = c("html_plot", "limits")
  )
  native <- funnel(
    dat, keys = organisation, numerators = numerator, denominators = denominator,
    indicators = list(grouping, indicator),
    misc_settings = list(lower = -4, upper = 4, group = "B"),
    outlier_settings = list(improvement_direction = direction),
    return_objs = c("html_plot", "limits")
  )
  expect_equal(wrapped$limits, native$limits)
  expect_equal(wrapped$html_plot$x, native$html_plot$x)
  expect_equal(wrapped$limits$group, c("B", "B"))
  expect_equal(wrapped$limits$indicator,
               c("Effectiveness / Higher is better", "Safety / Lower is better"))
  expect_identical(misc_default_settings(), funnel_default_settings())
  expect_identical(as.character(miscOutput("chart")), as.character(funnelOutput("chart")))
})
