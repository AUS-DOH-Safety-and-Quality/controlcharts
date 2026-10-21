tooltip_fixture <- function() {
  data.frame(
    key = as.Date(c("2024-02-09", "2024-01-31", "2024-01-16", "2024-01-31", "2024-02-09", "2024-01-16")),
    numerator = c(6, 2, 1, 3, 4, 4),
    denominator = 50,
    start = as.Date(c("2024-02-07", "2024-01-30", "2024-01-12", "2024-01-28", "2024-02-08", "2024-01-14")),
    eligible = c(TRUE, FALSE, FALSE, FALSE, FALSE, TRUE)
  )
}

test_that("typed keys and tooltips follow aggregation independently of the engine's labels", {
  dat <- tooltip_fixture()
  dat$min <- 0
  dat$any <- FALSE
  chart <- spc(
    dat, keys = key, numerators = numerator, denominators = denominator,
    spc_settings = list(chart_type = "p"),
    tooltips = list(Start = start, Eligible = eligible),
    date_settings = list(date_format_day = "(blank)", date_format_month = "Mon", date_format_delim = " ", date_format_year = "YY"),
    return_objs = c("html_plot", "limits")
  )
  expect_identical(chart$limits$key, as.Date(c("2024-01-16", "2024-01-31", "2024-02-09")))
  expect_identical(chart$limits$Start, as.Date(c("2024-01-12", "2024-01-30", "2024-02-07")))
  expect_identical(chart$limits$Eligible, c(FALSE, FALSE, TRUE))
  expect_equal(chart$limits$numerator, c(5, 5, 10))
  expect_false("source_rows" %in% names(chart$html_plot$x$update_values))
})

test_that("tooltips in the limits use the tooltip aggregation", {
  dat <- tooltip_fixture()
  dat$score <- c(NA, 2, NA, 5, 1, NA)
  chart <- spc(
    dat, keys = key, numerators = numerator,
    tooltips = list(Start = start, score), aggregations = list(tooltips = "min"),
    return_objs = c("html_plot", "limits")
  )
  expect_identical(chart$limits$Start, as.Date(c("2024-01-12", "2024-01-28", "2024-02-07")))
  expect_identical(chart$limits$score, c(NA, 2, 1))
  plotted <- chart$html_plot$x$update_values$dataViews[[1]]$categorical$values
  expect_equal(unlist(lapply(plotted[[length(plotted)]]$values, function(value) {
    ifelse(is.null(value), NA, value)
  })), c(NA, 2, 1))
})

test_that("typed keys and tooltips omit rejected observations", {
  dat <- data.frame(
    key = c(30L, 10L, 20L, 40L), numerator = c(5, 6, 7, NA),
    denominator = c(100, 0, 100, 100),
    start = as.Date("2024-01-01") + c(3, 1, 2, 4)
  )
  for (constructor in list(spc, funnel)) {
    expect_warning(
      chart <- constructor(
        dat, keys = key, numerators = numerator, denominators = denominator,
        tooltips = list(Start = start), return_objs = "limits"
      ),
      "^key 10 removed due to: Denominator is zero\\.\nkey 40 removed due to: Numerator missing\\.$"
    )
    expect_identical(chart$limits$key, c(20L, 30L))
    expect_identical(chart$limits$Start, dat$start[c(3, 1)])
  }
})

test_that("moving-range keys and tooltips follow the retained endpoint in each phase", {
  dat <- data.frame(
    key = as.Date("2024-01-01") + c(5, 1, 0, 4, 3, 2),
    numerator = c(11, 4, 1, 9, 7, 6), observation = seq_len(6)
  )
  dat$phase <- factor(ifelse(dat$key < as.Date("2024-01-04"), "Before", "After"))
  chart <- spc(
    dat, keys = key, numerators = numerator, groupings = phase,
    spc_settings = list(chart_type = "mr"),
    tooltips = list(Observation = observation, Phase = phase),
    return_objs = "limits"
  )
  expect_identical(chart$limits$key, as.Date("2024-01-01") + c(1, 2, 4, 5))
  expect_identical(chart$limits$Observation, dat$observation[c(2, 6, 4, 1)])
  expect_identical(chart$limits$Phase, dat$phase[c(2, 6, 4, 1)])
  expect_equal(chart$limits$value, c(3, 2, 2, 2))
})

test_that("MISC retains typed keys and tooltips for every indicator and group", {
  dat <- data.frame(
    hospital = rep(c("B", "A", "A", "B", "C", "C"), 2),
    indicator = rep(c("X", "Y"), each = 6), numerator = seq_len(12), denominator = 50,
    start = rep(as.Date("2024-01-01") + 0:5, 2),
    eligible = rep(c(FALSE, FALSE, TRUE, TRUE, FALSE, FALSE), 2)
  )
  chart <- misc(
    dat, keys = hospital, numerators = numerator, denominators = denominator,
    indicators = list(Measure = indicator), target = "B",
    tooltips = list(Start = start, Eligible = eligible), aggregations = list(tooltips = "last"),
    return_objs = c("limits", "limit_lines")
  )
  expect_identical(chart$limits$Measure, rep(c("X", "Y"), each = 3))
  expect_identical(chart$limits$hospital, rep(c("A", "B", "C"), 2))
  expect_identical(chart$limits$Start, rep(as.Date("2024-01-01") + c(2, 3, 5), 2))
  expect_identical(chart$limits$Eligible, rep(c(TRUE, TRUE, FALSE), 2))
  expect_false(any(c("hospital", "Start", "Eligible") %in% names(chart$limit_lines)))
})

test_that("Crosstalk filtering retains only the contributing raw tooltip rows", {
  dat <- tooltip_fixture()
  shared <- crosstalk::SharedData$new(dat, key = paste0("r", seq_len(nrow(dat))))
  tooltips <- list(Start = dat$start, Eligible = dat$eligible)
  chart <- spc(
    shared, keys = key, numerators = numerator, denominators = denominator,
    spc_settings = list(chart_type = "p"), tooltips = tooltips,
    return_objs = c("html_plot", "limits")
  )
  x <- chart$html_plot$x
  filtered <- controlcharts:::ctx$call(
    "ccCore.makeUpdateValues", x$data_raw, x$input_settings, x$aggregations, c("r1", "r3", "r4")
  )
  result <- controlcharts:::create_static(
    "spc", filtered$dataViews, filtered$source_rows,
    list(key = dat$key, key_name = "key", key_label = "date", tooltips = tooltips, tooltip_aggregation = "first"),
    list(text = NULL), NULL, NULL, rtn_static = FALSE
  )$limits
  expect_identical(result$key, dat$key[c(3, 4, 1)])
  expect_identical(result$Start, dat$start[c(3, 4, 1)])
  expect_identical(result$Eligible, dat$eligible[c(3, 4, 1)])
  expect_equal(result$numerator, c(1, 3, 6))
})

test_that("the typed key replaces its label column, named after the keys expression and kept as key", {
  dat <- tooltip_fixture()
  spc_limits <- spc(dat, keys = key, numerators = numerator, return_objs = "limits")$limits
  expect_identical(names(spc_limits)[1], "key")
  expect_false("date" %in% names(spc_limits))
  sites <- data.frame(site = c("A", "B", "C"), numerator = 1:3, denominator = 10)
  funnel_limits <- funnel(sites, keys = tolower(site), numerators = numerator, denominators = denominator,
                          return_objs = "limits")$limits
  expect_identical(funnel_limits$`tolower(site)`, c("a", "b", "c"))
  expect_identical(funnel_limits$key, funnel_limits$`tolower(site)`)
  expect_false("group" %in% names(funnel_limits))
})

test_that("tooltips cannot overwrite result columns", {
  dat <- tooltip_fixture()
  for (keys in list(quote(key), quote(start))) {
    expect_error(
      spc(dat, keys = !!keys, numerators = numerator, tooltips = list(key = start), return_objs = "limits"),
      "Result column names conflict: key.", fixed = TRUE
    )
  }
  expect_error(
    spc(dat, keys = key, numerators = numerator, tooltips = list(value = start), return_objs = "limits"),
    "Result column names conflict: value.", fixed = TRUE
  )
})

test_that("large row indexes retain their decimal identity across the JavaScript bridge", {
  result <- controlcharts:::result_frame(
    data.frame(date = "Jan 24", value = 5), 1000000,
    list("1000000" = c(0, 1)),
    list(key = as.Date(c("2024-01-31", "2024-01-31")), key_name = "key", key_label = "date",
         tooltips = list(Eligible = c(FALSE, TRUE)), tooltip_aggregation = "last")
  )
  expect_identical(result$key, as.Date("2024-01-31"))
  expect_identical(result$Eligible, TRUE)
})
