testthat::test_that("Indicators are ordered by code point, independent of locale", {
  dat <- data.frame(
    key = rep(as.Date("2024-01-01") + 0:1, 4),
    numerator = 1:8,
    indicator = rep(c("beta", "Alpha", "alpha", "Beta"), each = 2)
  )
  limits <- spc(dat, keys = key, numerators = numerator, indicators = indicator,
                return_objs = "limits")$limits
  testthat::expect_identical(unique(limits$indicator), c("Alpha", "Beta", "alpha", "beta"))
})

testthat::test_that("Numeric keys are ordered by value", {
  dat <- data.frame(key = c(10, 2, 1, 100000), numerator = c(5, 6, 7, 9), denominator = 20)
  limits <- funnel(dat, keys = key, numerators = numerator, denominators = denominator,
                   return_objs = "limits")$limits
  testthat::expect_identical(limits$key, c(1, 2, 10, 100000))
  testthat::expect_identical(limits$numerator, c(7, 6, 5, 9))
})

testthat::test_that("Aggregations default when NULL and reject unknown names", {
  dat <- data.frame(key = rep(as.Date("2024-01-01") + 0:3, 2), numerator = 1:8)
  limits <- spc(dat, keys = key, numerators = numerator, aggregations = NULL,
                return_objs = "limits")$limits
  testthat::expect_identical(limits$value, c(6, 8, 10, 12))
  testthat::expect_error(
    spc(dat, keys = key, numerators = numerator, aggregations = list(constructor = "sum")),
    "'constructor' is not a valid variable to aggregate"
  )
  testthat::expect_error(
    spc(dat, keys = key, numerators = numerator, aggregations = list(numerators = "sd")),
    "'sd' is not a valid aggregation"
  )
})

testthat::test_that("Factor indicators are ordered by their levels, keeping per-row settings with their rows", {
  dat <- expand.grid(key = as.Date("2024-01-01") + 0:3, label = c("a", "b"),
                     theme = c("Safety", "HSPR", "Access"), stringsAsFactors = FALSE)
  dat$numerator <- (seq_len(nrow(dat)) * 7) %% 11 + 3
  dat$denominator <- 20
  dat$chart_type <- c(Safety = "i", HSPR = "p", Access = "u")[dat$theme]
  run <- function(data) {
    spc(data, keys = key, numerators = numerator, denominators = denominator,
        indicators = list(theme, label), spc_settings = list(chart_type = chart_type),
        return_objs = "limits")$limits
  }
  unlevelled <- run(dat)
  dat$theme <- factor(dat$theme, levels = c("Safety", "Access", "HSPR"))
  dat$label <- factor(dat$label, levels = c("b", "a"))
  levelled <- run(dat)

  testthat::expect_identical(unique(unlevelled$theme), c("Access", "HSPR", "Safety"))
  testthat::expect_identical(unique(levelled$theme), c("Safety", "Access", "HSPR"))
  testthat::expect_identical(levelled$label[levelled$theme == "Safety"], rep(c("b", "a"), each = 4))
  reordered <- levelled[order(levelled$theme, levelled$label, levelled$key), ]
  rownames(reordered) <- NULL
  testthat::expect_identical(reordered, unlevelled)
})

testthat::test_that("MISC rows, limits and limit lines follow factor indicator levels", {
  dat <- data.frame(
    organisation = rep(LETTERS[1:4], 3),
    indicator = factor(rep(c("Safety", "HSPR", "Access"), each = 4), levels = c("Safety", "Access", "HSPR")),
    numerator = c(20, 25, 30, 22, 40, 35, 45, 38, 10, 12, 8, 15),
    denominator = 100
  )
  chart <- misc(dat, keys = organisation, numerators = numerator, denominators = denominator,
                indicators = indicator, target = "A", return_objs = c("static_plot", "limits", "limit_lines"))
  rows <- xml2::xml_text(xml2::xml_find_all(xml2::read_xml(chart$static_plot$svg), "//*[@class='misc-y-tick']"))
  testthat::expect_identical(rows, c("Safety", "Access", "HSPR"))
  testthat::expect_identical(unique(chart$limits$indicator), c("Safety", "Access", "HSPR"))
  testthat::expect_identical(unique(chart$limit_lines$indicator), c("Safety", "Access", "HSPR"))

  single <- misc(dat[dat$indicator == "Safety", ], keys = organisation, numerators = numerator,
                 denominators = denominator, indicators = factor(indicator, levels = "Safety"),
                 target = "A", return_objs = "limits")$limits
  testthat::expect_identical(unique(single[[1]]), "Safety")
})
