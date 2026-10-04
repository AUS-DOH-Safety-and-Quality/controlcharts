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
    groupings = grouping,
    outlier_settings = list(improvement_direction = direction),
    return_objs = "limits"
  )

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
    expect_equal(actual$outlier, expected$three_sigma)
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
  expect_equal(chart$limits$indicator, "Higher is better")
  expect_match(chart$static_plot$svg, "misc-bar", fixed = TRUE)

  outfile <- tempfile(fileext = ".svg")
  chart$save_plot(outfile, width = 720, height = 480)
  svg <- paste(readLines(outfile, warn = FALSE), collapse = "\n")
  expect_match(svg, "Single-indicator MISC", fixed = TRUE)
  expect_match(svg, "misc-limit-99", fixed = TRUE)
  expect_match(svg, "99.8% Control Limits", fixed = TRUE)
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
    "not present"
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
    "one improvement_direction"
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
  expect_equal(tooltip_columns[[1]]$values, "last target row")
})

test_that("MISC separates rate values from their suffix", {
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
    return_objs = "html_plot"
  )

  columns <- chart$html_plot$x$update_values$dataViews[[1]]$categorical$values
  suffix <- Filter(
    function(column) isTRUE(column$source$roles$suffixes),
    columns
  )
  expect_equal(suffix[[1]]$values, " per 1,000")
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
    return_objs = "html_plot"
  )

  columns <- chart$html_plot$x$update_values$dataViews[[1]]$categorical$values
  suffix <- Filter(
    function(column) isTRUE(column$source$roles$suffixes),
    columns
  )
  expect_equal(suffix[[1]]$values, "%")
})
