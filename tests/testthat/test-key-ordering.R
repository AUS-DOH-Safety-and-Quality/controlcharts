test_that("Chart keys use their native ordering and keep rows aligned", {
  key_vectors <- list(
    c(10, 1, 2),
    factor(c("last", "first", "middle"),
           levels = c("first", "middle", "last")),
    as.Date(c("2024-10-01", "2024-01-01", "2024-02-01")),
    as.POSIXct(c("2024-01-01 10:00:00", "2024-01-01 01:00:00",
                 "2024-01-01 02:00:00"), tz = "UTC")
  )

  for (keys in key_vectors) {
    dat <- data.frame(key = keys, numerator = c(30, 10, 20), denominator = 100,
                      label = c("last", "first", "middle"),
                      colour = c("#333333", "#111111", "#222222"))
    expected_keys <- as.character(keys[c(2, 3, 1)])

    for (chart_fun in list(spc, funnel)) {
      chart <- chart_fun(
        dat, keys = key, numerators = numerator, denominators = denominator,
        labels = label, tooltips = label,
        scatter_settings = list(colour = colour), return_objs = "html_plot"
      )
      values <- chart$html_plot$x$update_values
      categorical <- values$dataViews[[1]]$categorical

      expect_equal(categorical$categories[[1]]$values, expected_keys)
      expect_equal(categorical$values[[1]]$values, c(10, 20, 30))
      expect_equal(categorical$values[[3]]$values, c("first", "middle", "last"))
      expect_equal(categorical$values[[4]]$values, c("first", "middle", "last"))
      expect_equal(
        vapply(categorical$categories[[1]]$objects,
               function(x) x$scatter$colour, character(1)),
        c("#111111", "#222222", "#333333")
      )
      expect_equal(unname(unlist(values$crosstalk_identities[expected_keys])),
                   c("2", "3", "1"))
    }
  }
})

test_that("Crosstalk raw data follows numeric key ordering", {
  dat <- data.frame(key = c(10, 1, 2), numerator = c(30, 10, 20),
                    denominator = 100, identity = c("last", "first", "middle"))
  shared <- crosstalk::SharedData$new(dat, key = ~identity)

  for (chart_fun in list(spc, funnel)) {
    chart <- chart_fun(shared, keys = key, numerators = numerator,
                       denominators = denominator, return_objs = "html_plot")
    raw <- chart$html_plot$x$data_raw

    expect_equal(raw$categories, c("1", "2", "10"))
    expect_equal(raw$numerators, c(10, 20, 30))
    expect_equal(raw$crosstalk_identities, c("first", "middle", "last"))
  }
})

test_that("SPC numeric keys are ordered within each indicator", {
  dat <- data.frame(key = c(10, 2, 1, 10, 1, 2),
                    indicator = c("B", "A", "B", "A", "A", "B"),
                    numerator = c(60, 20, 40, 30, 10, 50))
  chart <- spc(dat, keys = key, numerators = numerator, indicators = indicator,
                return_objs = "html_plot")
  categorical <- chart$html_plot$x$update_values$dataViews[[1]]$categorical

  expect_equal(categorical$categories[[1]]$values, rep(c("1", "2", "10"), 2))
  expect_equal(categorical$categories[[2]]$values, rep(c("A", "B"), each = 3))
  expect_equal(categorical$values[[1]]$values, c(10, 20, 30, 40, 50, 60))
})

test_that("Per-observation settings given as vectors follow the input rows", {
  dat <- data.frame(key = as.Date(c("2024-03-01", "2024-01-01", "2024-02-01")),
                    numerator = c(30, 10, 20), denominator = 100)
  colours <- c("#333333", "#111111", "#222222")

  for (chart_fun in list(spc, funnel)) {
    chart <- chart_fun(dat, keys = key, numerators = numerator,
                       denominators = denominator,
                       scatter_settings = list(colour = colours),
                       return_objs = "static_plot")
    objects <- chart$static_plot$dataViews[[1]]$categorical$categories[[1]]$objects
    expect_equal(vapply(objects, function(x) x$scatter$colour, character(1)),
                 c("#111111", "#222222", "#333333"))
  }
})
