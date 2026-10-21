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
  dat$chart_type <- ifelse(dat$indicator == "Higher is better", "PR", "RC")
  dat$multiplier <- ifelse(dat$indicator == "Higher is better", 1, 1000)
  chart <- misc(
    dat,
    keys = organisation,
    numerators = numerator,
    denominators = denominator,
    indicators = indicator,
    target = "A",
    funnel_settings = list(chart_type = chart_type, multiplier = multiplier),
    outlier_settings = list(improvement_direction = direction, two_sigma = TRUE),
    return_objs = c("limits", "limit_lines")
  )
  expect_identical(names(chart$limits), c(
    "indicator", "denominator", "organisation", "numerator", "value", "z", "score", "two_sigma", "three_sigma",
    "target", "ll99", "ll95", "ll68", "ul68", "ul95", "ul99", "key"
  ))
  expect_equal(nrow(chart$limits), 8)

  for (indicator_name in unique(dat$indicator)) {
    rows <- dat$indicator == indicator_name
    direction <- unique(dat$direction[rows])
    standalone <- funnel(
      dat[rows, ],
      keys = organisation,
      numerators = numerator,
      denominators = denominator,
      funnel_settings = list(chart_type = chart_type, multiplier = multiplier),
      outlier_settings = list(
        improvement_direction = direction,
        two_sigma = TRUE,
        three_sigma = TRUE
      ),
      return_objs = c("limits", "limit_lines")
    )
    expected <- standalone$limits
    actual <- chart$limits[chart$limits$indicator == indicator_name, ]
    actual_limits <- actual[names(expected)]
    rownames(actual_limits) <- NULL
    expect_equal(actual_limits, expected)
    expect_equal(
      actual$score,
      expected$z * ifelse(direction == "decrease", -1, 1)
    )
    actual_lines <- chart$limit_lines[chart$limit_lines$indicator == indicator_name, names(standalone$limit_lines)]
    rownames(actual_lines) <- NULL
    expect_equal(actual_lines, standalone$limit_lines)
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
  expect_equal(unique(chart$limits$indicator), "Higher is better")
  expect_equal(nrow(chart$limits), 4)
  expect_match(chart$static_plot$svg, "misc-bar", fixed = TRUE)
  bars <- xml2::xml_find_all(xml2::read_xml(chart$static_plot$svg), "//*[local-name()='rect' and @class='misc-bar']")
  expect_length(bars, 1)

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

  tooltips <- controlcharts:::ctx$get("ccHeadless.visuals.funnel.viewModel.miscPoints")[[1]]$tooltip
  funnel(
    dat, keys = organisation, numerators = numerator, denominators = denominator,
    funnel_settings = list(chart_type = "PR", multiplier = 1000, perc_labels = "No"),
    return_objs = "limits"
  )
  expected <- controlcharts:::ctx$get("ccHeadless.visuals.funnel.viewModel.plotPoints")[[1]]$tooltip
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

  tooltips <- controlcharts:::ctx$get("ccHeadless.visuals.funnel.viewModel.miscPoints")[[1]]$tooltip
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
  expect_equal(wrapped$limits$organisation, rep(LETTERS[1:4], 2))
  expect_equal(wrapped$limits$grouping, rep(c("Effectiveness", "Safety"), each = 4))
  expect_equal(wrapped$limits$indicator, rep(c("Higher is better", "Lower is better"), each = 4))
  expect_identical(misc_default_settings(), funnel_default_settings())
  expect_identical(as.character(miscOutput("chart")), as.character(funnelOutput("chart")))
})

test_that("RC indicators without counts are left out with a warning", {
  dat <- data.frame(
    site = rep(c("A", "B", "C"), 2),
    indicator = rep(c("Higher", "Lower"), each = 3),
    numerator = c(3, 5, 4, 0, 0, 0),
    denominator = 10
  )
  expect_warning(
    chart <- funnel(dat, keys = site, numerators = numerator, denominators = denominator,
                    indicators = indicator, funnel_settings = list(chart_type = "RC"), return_objs = "limits"),
    "Lower: All numerators are zero, so RC limits cannot be calculated and the indicator is not shown.", fixed = TRUE
  )
  expect_equal(unique(chart$limits$indicator), "Higher")
})

test_that("chart warnings are raised once, whatever is returned", {
  dat <- data.frame(site = c("A", "B", "C", "D"), numerator = c(3, 5, -4, 2), denominator = 10)
  for (return_objs in list("limits", "static_plot", c("static_plot", "limits"))) {
    messages <- character()
    output <- capture.output(withCallingHandlers(
      invisible(funnel(dat, keys = site, numerators = numerator, denominators = denominator, return_objs = return_objs)),
      warning = function(w) {
        messages <<- c(messages, conditionMessage(w))
        invokeRestart("muffleWarning")
      }
    ))
    expect_identical(messages, "site C removed due to: Numerator negative.")
    expect_length(output, 0)
  }
})

test_that("the default empty MISC group shows the first group", {
  dat <- data.frame(site = rep(c("A", "B", "C"), 2), indicator = rep(c("Higher", "Lower"), each = 3),
                    numerator = c(3, 5, 4, 6, 2, 7), denominator = 10)
  defaults <- funnel(dat, keys = site, numerators = numerator, denominators = denominator, indicators = indicator,
                     misc_settings = funnel_default_settings("misc"), return_objs = "limits")
  first <- misc(dat, keys = site, numerators = numerator, denominators = denominator, indicators = indicator,
                target = "A", return_objs = "limits")
  expect_identical(defaults$limits, first$limits)
})

test_that("numeric MISC targets select numeric keys by value", {
  dat <- data.frame(site = rep(c(2, 100000, 0.1 + 0.2), 2), indicator = rep(c("Higher", "Lower"), each = 3),
                    numerator = c(3, 5, 4, 6, 2, 7), denominator = 10)
  svg <- function(target) {
    misc(dat, keys = site, numerators = numerator, denominators = denominator, indicators = indicator,
         target = target, return_objs = "static_plot")$static_plot$svg
  }
  expect_identical(svg(100000), svg("100000"))
  expect_false(identical(svg(100000), svg(2)))
  expect_false(identical(svg(0.1 + 0.2), svg(2)))
  expect_identical(svg(2L), svg(2))
})

test_that("a MISC group given per row must name one group", {
  dat <- data.frame(site = rep(c("A", "B", "C"), 2), indicator = rep(c("Higher", "Lower"), each = 3),
                    numerator = c(3, 5, 4, 6, 2, 7), denominator = 10)
  expect_error(
    funnel(dat, keys = site, numerators = numerator, denominators = denominator, indicators = indicator,
           misc_settings = list(group = site), return_objs = "limits"),
    "The MISC group must be the same for every row.", fixed = TRUE
  )
  same <- funnel(dat, keys = site, numerators = numerator, denominators = denominator, indicators = indicator,
                 misc_settings = list(group = rep("B", 6)), return_objs = "static_plot")
  chosen <- misc(dat, keys = site, numerators = numerator, denominators = denominator, indicators = indicator,
                 target = "B", return_objs = "static_plot")
  expect_identical(same$static_plot$svg, chosen$static_plot$svg)
})
