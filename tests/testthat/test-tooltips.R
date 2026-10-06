tooltip_columns <- function(chart) {
  values <- chart$html_plot$x$update_values$dataViews[[1]]$categorical$values
  Filter(function(column) isTRUE(column$source$roles$tooltips), values)
}

dat <- data.frame(
  organisation = c("A", "B", "C", "D"),
  month = as.Date(c("2024-01-01", "2024-02-01", "2024-03-01", "2024-04-01")),
  region = c("North", "North", "South", "South"),
  site_type = c("Metro", "Rural", "Metro", "Rural"),
  numerator = c(10, 12, 9, 15),
  denominator = c(100, 110, 95, 120)
)

test_that("A single tooltip column is labelled by its expression", {
  chart <- funnel(dat, keys = organisation, numerators = numerator,
                  denominators = denominator, tooltips = region,
                  return_objs = c("html_plot", "limits"))
  columns <- tooltip_columns(chart)

  expect_length(columns, 1)
  expect_equal(columns[[1]]$source$displayName, "region")
  expect_true(columns[[1]]$source$type$text)
  expect_equal(columns[[1]]$values, dat$region)
})

test_that("A list of tooltips creates one column each, named or by expression", {
  chart <- funnel(dat, keys = organisation, numerators = numerator,
                  denominators = denominator,
                  tooltips = list(Region = region, site_type, toupper(organisation)),
                  return_objs = c("html_plot", "limits"))
  columns <- tooltip_columns(chart)

  expect_equal(sapply(columns, function(column) column$source$displayName),
               c("Region", "site_type", "toupper(organisation)"))
  expect_equal(columns[[2]]$values, dat$site_type)
  expect_equal(columns[[3]]$values, c("A", "B", "C", "D"))
})

test_that("Funnel tooltips follow the ordering of the keys", {
  chart <- funnel(dat[4:1, ], keys = organisation, numerators = numerator,
                  denominators = denominator, tooltips = list(region, site_type),
                  return_objs = "html_plot")
  columns <- tooltip_columns(chart)

  expect_equal(columns[[1]]$values, dat$region)
  expect_equal(columns[[2]]$values, dat$site_type)
})

test_that("SPC charts accept a list of tooltips", {
  chart <- spc(dat, keys = month, numerators = numerator,
               denominators = denominator,
               tooltips = list(Region = region, site_type),
               return_objs = c("html_plot", "limits", "static_plot"))
  columns <- tooltip_columns(chart)

  expect_equal(sapply(columns, function(column) column$source$displayName),
               c("Region", "site_type"))
  expect_equal(columns[[1]]$values, dat$region)
  expect_equal(nrow(chart$limits), 4)
})

test_that("Tooltips are aggregated within each key", {
  chart <- funnel(rbind(dat, dat), keys = organisation, numerators = numerator,
                  denominators = denominator, tooltips = list(region, site_type),
                  return_objs = "html_plot")
  columns <- tooltip_columns(chart)

  expect_equal(columns[[1]]$values, dat$region)
  expect_equal(columns[[2]]$values, dat$site_type)
})

test_that("Tooltips must have one value per observation", {
  expect_error(
    funnel(dat, keys = organisation, numerators = numerator,
           denominators = denominator, tooltips = list(region, "North")),
    "Each tooltip"
  )
})
