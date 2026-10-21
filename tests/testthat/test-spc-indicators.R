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

test_that("SPC indicator limits are flat with separate indicator columns", {
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

  expect_s3_class(chart$limits, "data.frame")
  expect_identical(names(chart$limits)[1:2], c("region", "organisation"))
  expect_equal(chart$limits$region, rep(c("North", "South"), each = 4))
  expect_equal(chart$limits$organisation, rep(c("A", "B"), each = 2, times = 2))
  expect_equal(nrow(chart$limits), 8)
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

  for (organisation_name in unique(dat$organisation)) {
    standalone_limits <- spc(
      data = dat[dat$organisation == organisation_name, ],
      keys = month,
      numerators = numerator,
      denominators = denominator,
      spc_settings = settings,
      return_objs = "limits"
    )$limits

    actual <- grouped_limits[grouped_limits$organisation == organisation_name, names(standalone_limits)]
    rownames(actual) <- NULL
    expect_equal(actual, standalone_limits)
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
    "ccCore.makeUpdateValues",
    chart$html_plot$x$data_raw,
    chart$html_plot$x$input_settings,
    chart$html_plot$x$aggregations
  )
  filtered_values <- controlcharts:::ctx$call(
    "ccCore.makeUpdateValues",
    chart$html_plot$x$data_raw,
    chart$html_plot$x$input_settings,
    chart$html_plot$x$aggregations,
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

test_that("Grouped SPC charts reject static plots", {
  dat <- data.frame(
    month = rep(as.Date(c("2024-01-01", "2024-02-01")), 2),
    organisation = rep(c("A", "B"), each = 2),
    numerator = seq_len(4)
  )

  expect_error(
    spc(dat, keys = month, numerators = numerator, indicators = organisation,
        return_objs = c("static_plot", "limits")),
    "Static plots are not available for summary tables.",
    fixed = TRUE
  )
})

test_that("SPC charts with indicators omit static plots by default", {
  dat <- data.frame(
    month = rep(as.Date(c("2024-01-01", "2024-02-01")), 2),
    organisation = rep(c("A", "B"), each = 2),
    numerator = seq_len(4)
  )

  chart <- spc(dat, keys = month, numerators = numerator, indicators = organisation)
  expect_identical(names(chart), c("html_plot", "limits", "save_plot"))
})

test_that("indicators named like limit columns are renamed with a warning", {
  dat <- data.frame(
    month = as.Date(c("2024-01-01", "2024-02-01", "2024-03-01")),
    region = "North",
    site = "A",
    numerator = c(3, 5, 4)
  )

  expect_warning(
    chart <- spc(dat, keys = month, numerators = numerator,
                 indicators = list(value = region, target = site), return_objs = "limits"),
    "value to value_, target to target_.", fixed = TRUE
  )
  expect_equal(chart$limits$value_, rep("North", 3))
  expect_equal(chart$limits$value, c(3, 5, 4))
  expect_equal(chart$limits$target_, rep("A", 3))

  expect_warning(
    empty <- spc(dat[0, ], keys = month, numerators = numerator,
                 indicators = list(value = region), return_objs = "limits"),
    "value to value_.", fixed = TRUE
  )
  expect_identical(empty$limits$value_, character())
  expect_identical(empty$limits$value, numeric())
  expect_no_warning(
    spc(dat[0, ], keys = month, numerators = numerator, indicators = list(value = region), return_objs = "html_plot")
  )

  expect_warning(
    misc <- funnel(dat, keys = site, numerators = numerator, denominators = numerator + 10,
                   indicators = list(group = region), return_objs = "limits"),
    "group to group_.", fixed = TRUE
  )
  expect_equal(unique(misc$limits$group_), "North")

  expect_no_warning(
    spc(dat, keys = month, numerators = numerator, indicators = list(Region = region), return_objs = "limits")
  )
})

test_that("an indicator without denominators plots its numerators beside ratio indicators", {
  dat <- data.frame(
    month = rep(as.Date("2024-01-01") + 0:7, 2),
    indicator = rep(c("Ratio", "Count"), each = 8),
    numerator = c(5, 7, 6, 8, 5, 6, 7, 9, 3, 4, 3, 5, 4, 3, 4, 5),
    denominator = c(rep(10, 8), rep(NA, 8))
  )
  grouped <- spc(dat, keys = month, numerators = numerator, denominators = denominator,
                 indicators = indicator, return_objs = "limits")$limits
  ratio <- spc(dat[1:8, ], keys = month, numerators = numerator, denominators = denominator,
               return_objs = "limits")$limits
  count <- spc(dat[9:16, ], keys = month, numerators = numerator, return_objs = "limits")$limits
  ratio_rows <- grouped$indicator == "Ratio"
  expect_equal(grouped$value[ratio_rows], dat$numerator[1:8] / 10)
  expect_equal(grouped$value[!ratio_rows], dat$numerator[9:16])
  for (column in c("value", "target", "ll99", "ul99", "trend_line")) {
    expect_equal(grouped[[column]][ratio_rows], ratio[[column]])
    expect_equal(grouped[[column]][!ratio_rows], count[[column]])
  }
  expect_equal(grouped$denominator[!ratio_rows], rep(NA_real_, 8))
})
