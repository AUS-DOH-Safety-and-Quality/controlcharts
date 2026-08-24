test_that("SPC indicators create separate Power BI categories and aggregates", {
  dat <- data.frame(
    month = rep(as.Date("2024-01-01"), 4),
    organisation = c("A", "A", "B", "B"),
    numerator = c(1, 2, 3, 4)
  )

  chart <- spc(
    data = dat,
    keys = month,
    numerators = numerator,
    indicators = organisation,
    return_objs = "html_plot"
  )
  data_view <- chart$html_plot$x$update_values$dataViews[[1]]

  expect_equal(data_view$categorical$categories[[2]]$source$displayName,
               "organisation")
  expect_true(data_view$categorical$categories[[2]]$source$roles$indicator)
  expect_equal(data_view$categorical$categories[[2]]$values, c("A", "B"))
  expect_equal(data_view$categorical$values[[1]]$values, c(3, 7))
})

test_that("SPC indicator limits are nested by indicator values", {
  dat <- data.frame(
    month = rep(as.Date(c("2024-01-01", "2024-02-01")), 4),
    region = rep(c("North", "North", "South", "South"), each = 2),
    organisation = rep(c("A", "B", "A", "B"), each = 2),
    numerator = seq_len(8)
  )

  chart <- spc(
    data = dat,
    keys = month,
    numerators = numerator,
    indicators = list(region, organisation),
    return_objs = "limits"
  )

  expect_equal(names(chart$limits), c("North", "South"))
  expect_equal(names(chart$limits$North), c("A", "B"))
  expect_s3_class(chart$limits$South$B, "data.frame")
  expect_equal(nrow(chart$limits$South$B), 2)
  expect_equal(attr(chart$limits, "indicator_names"),
               c("region", "organisation"))
})

test_that("SPC indicator limits match standalone calculations", {
  dat <- data.frame(
    month = rep(seq(as.Date("2024-01-01"), by = "month", length.out = 6), 2),
    organisation = rep(c("A", "B"), each = 6),
    numerator = c(8, 11, 10, 12, 9, 13, 15, 12, 16, 14, 17, 13),
    denominator = c(80, 95, 90, 105, 85, 110, 120, 100, 125, 115, 130, 105)
  )
  settings <- list(chart_type = "p")

  grouped_limits <- spc(
    data = dat,
    keys = month,
    numerators = numerator,
    denominators = denominator,
    indicators = organisation,
    spc_settings = settings,
    return_objs = "limits"
  )$limits

  for (organisation_name in names(grouped_limits)) {
    standalone_limits <- spc(
      data = dat[dat$organisation == organisation_name, ],
      keys = month,
      numerators = numerator,
      denominators = denominator,
      spc_settings = settings,
      return_objs = "limits"
    )$limits

    expect_equal(grouped_limits[[organisation_name]], standalone_limits)
  }
})

test_that("SPC indicator formatting uses the first raw row in each group", {
  dat <- data.frame(
    month = rep(as.Date("2024-01-01"), 4),
    organisation = c("A", "A", "B", "B"),
    numerator = c(1, 2, 3, 4),
    colour = c("#111111", "#222222", "#333333", "#444444")
  )

  chart <- spc(
    data = dat,
    keys = month,
    numerators = numerator,
    indicators = organisation,
    scatter_settings = list(colour = colour),
    return_objs = "html_plot"
  )
  objects <- chart$html_plot$x$update_values$dataViews[[1]]$categorical$categories[[1]]$objects

  expect_equal(objects[[1]]$scatter$colour, "#111111")
  expect_equal(objects[[2]]$scatter$colour, "#333333")
})

test_that("SPC indicators retain grouped Crosstalk identities", {
  dat <- data.frame(
    month = rep(as.Date("2024-01-01"), 4),
    organisation = c("A", "A", "B", "B"),
    numerator = c(1, 2, 3, 4)
  )
  shared <- crosstalk::SharedData$new(dat, key = ~paste0("row", seq_len(nrow(dat))))

  chart <- spc(
    data = shared,
    keys = month,
    numerators = numerator,
    indicators = organisation,
    return_objs = "html_plot"
  )
  values <- controlcharts:::ctx$call(
    "makeUpdateValues",
    chart$html_plot$x$data_raw,
    chart$html_plot$x$input_settings,
    chart$html_plot$x$aggregations,
    chart$html_plot$x$has_conditional_formatting,
    chart$html_plot$x$unique_categories
  )
  filtered_values <- controlcharts:::ctx$call(
    "makeUpdateValues",
    chart$html_plot$x$data_raw,
    chart$html_plot$x$input_settings,
    chart$html_plot$x$aggregations,
    chart$html_plot$x$has_conditional_formatting,
    chart$html_plot$x$unique_categories,
    c("row1", "row2")
  )

  expect_equal(values$crosstalk_identities,
               list(c("row1", "row2"), c("row3", "row4")))
  expect_equal(filtered_values$crosstalk_identities, list(c("row1", "row2")))
})

test_that("SPC indicators must be row-aligned vectors", {
  dat <- data.frame(
    month = as.Date(c("2024-01-01", "2024-02-01")),
    numerator = c(1, 2)
  )

  expect_error(
    spc(dat, keys = month, numerators = numerator, indicators = c("A")),
    "Each indicator"
  )
})
