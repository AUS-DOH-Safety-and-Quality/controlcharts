small_input_data <- function() {
  data.frame(
    key = rep(as.Date("2024-01-31"), 3),
    indicator = "Measure",
    numerator = c(5, 7, 8),
    denominator = c(100, 250, 150),
    start = as.Date("2024-01-01") + c(2, 0, 1),
    eligible = c(FALSE, TRUE, FALSE)
  )
}

test_that("single-row SPC and funnel calculations retain counts, keys and tooltips", {
  dat <- small_input_data()
  for (type in c("spc", "funnel")) {
    calculate <- function(data, ...) {
      if (type == "spc") {
        return(spc(
          data, keys = key, numerators = numerator, denominators = denominator,
          spc_settings = list(chart_type = "p", perc_labels = "No"), ...
        ))
      }
      funnel(
        data, keys = key, numerators = numerator, denominators = denominator,
        funnel_settings = list(chart_type = "PR", perc_labels = "No"), ...
      )
    }
    for (rows in list(1L, seq_len(nrow(dat)))) {
      input <- dat[rows, ]
      chart <- calculate(
        input, tooltips = list(Start = start, Eligible = eligible),
        return_objs = c("html_plot", "static_plot", "limits")
      )
      expect_equal(nrow(chart$limits), 1)
      expect_equal(chart$limits$numerator, sum(input$numerator))
      expect_equal(chart$limits$denominator, sum(input$denominator))
      expect_equal(chart$limits$value, sum(input$numerator) / sum(input$denominator))
      expect_identical(chart$limits$key, input$key[1])
      expect_identical(chart$limits$Start, input$start[1])
      expect_identical(chart$limits$Eligible, input$eligible[1])
      expect_s3_class(chart$html_plot, "htmlwidget")
      svg <- xml2::read_xml(chart$static_plot$svg)
      expect_length(xml2::xml_find_all(svg, '//*[@class="dotsgroup"]/*'), 1)
      output <- tempfile(fileext = ".svg")
      chart$save_plot(output, width = 720, height = 480)
      resized <- calculate(input, width = 720, height = 480, return_objs = "static_plot")
      expect_identical(paste(readLines(output), collapse = "\n"), resized$static_plot$svg)
      unlink(output)
    }
  }
})

test_that("a single-period p chart uses its binomial limits", {
  dat <- small_input_data()
  limits <- spc(
    dat, keys = key, numerators = numerator, denominators = denominator,
    spc_settings = list(chart_type = "p", perc_labels = "No"), return_objs = "limits"
  )$limits
  rate <- sum(dat$numerator) / sum(dat$denominator)
  sigma <- sqrt(rate * (1 - rate) / sum(dat$denominator))
  expect_equal(limits$target, rate)
  expect_equal(limits$ll99, max(0, rate - 3 * sigma))
  expect_equal(limits$ul99, rate + 3 * sigma)
})

test_that("singleton indicators match standalone SPC and funnel results", {
  dat <- small_input_data()
  dat <- rbind(dat[1, ], transform(dat, indicator = "Other", key = key + seq_len(nrow(dat))))
  for (constructor in list(spc, funnel)) {
    batched <- constructor(
      dat, keys = key, numerators = numerator, denominators = denominator,
      indicators = indicator, return_objs = "limits"
    )$limits
    for (name in unique(dat$indicator)) {
      input <- dat[dat$indicator == name, ]
      expected <- constructor(
        input, keys = key, numerators = numerator, denominators = denominator,
        return_objs = "limits"
      )$limits
      actual <- batched[batched$indicator == name, names(expected)]
      rownames(actual) <- NULL
      expect_equal(actual, expected)
    }
  }
})

test_that("MISC calculates limits and curves for a single group and indicator", {
  dat <- small_input_data()
  chart <- misc(
    dat, keys = key, numerators = numerator, denominators = denominator,
    indicators = indicator, target = dat$key[1],
    return_objs = c("limits", "limit_lines", "static_plot")
  )
  expected <- funnel(
    dat, keys = key, numerators = numerator, denominators = denominator,
    return_objs = c("limits", "limit_lines")
  )
  expect_equal(chart$limits[names(expected$limits)], expected$limits)
  expect_equal(chart$limits$score, 0)
  expect_identical(chart$limits$three_sigma, "none")
  expect_equal(chart$limit_lines[names(expected$limit_lines)], expected$limit_lines)
  expect_match(chart$static_plot$svg, "misc-bar", fixed = TRUE)
})

test_that("moving-range requirements are enforced by the chart engine", {
  dat <- small_input_data()
  expect_error(
    spc(dat, keys = key, numerators = numerator,
        spc_settings = list(chart_type = "mr"), return_objs = "limits"),
    "Moving range charts need at least two valid observations!", fixed = TRUE
  )
})

test_that("empty inputs return typed limits and curves without plots", {
  dat <- small_input_data()[0, ]
  for (type in c("spc", "funnel")) {
    return_objs <- c("html_plot", "static_plot", "limits")
    if (type == "funnel") {
      return_objs <- c(return_objs, "limit_lines")
    }
    chart <- get(type)(
      dat, keys = key, numerators = numerator, denominators = denominator,
      indicators = indicator, tooltips = list(Start = start, Eligible = eligible), return_objs = return_objs
    )
    expect_s3_class(chart, "controlchart")
    expect_equal(nrow(chart$limits), 0)
    expect_identical(chart$limits$key, as.Date(character()))
    expect_identical(chart$limits$indicator, character())
    expect_identical(chart$limits$Start, as.Date(character()))
    expect_identical(chart$limits$Eligible, logical())
    expect_null(chart$html_plot)
    expect_null(chart$static_plot)
    if (type == "funnel") {
      expect_equal(nrow(chart$limit_lines), 0)
      expect_identical(chart$limit_lines$indicator, character())
      expect_identical(chart$limit_lines$denominator, numeric())
    }
  }
})
