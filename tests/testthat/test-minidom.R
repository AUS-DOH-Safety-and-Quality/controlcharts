testthat::test_that("chart text survives static rendering and resized export", {
  text <- 'A & B < C > D "quoted" &amp;'
  dat <- data.frame(
    organisation = LETTERS[1:4], indicator = text, grouping = text,
    numerator = c(8, 5, 4, 6), denominator = 10
  )
  for (objects in list("static_plot", c("html_plot", "static_plot"))) {
    chart <- misc(
      dat, keys = organisation, numerators = numerator, denominators = denominator,
      indicators = indicator, target = "A",
      title = list(text = text, subtitle = text),
      misc_settings = list(favourable_label = text),
      x_axis_settings = list(xlimit_label = text), return_objs = objects
    )
    xml <- xml2::xml_ns_strip(xml2::read_xml(chart$static_plot$svg))
    for (class in c("misc-y-tick", "chart-title", "chart-subtitle")) {
      node <- xml2::xml_find_first(xml, paste0('.//*[@class="', class, '"]'))
      testthat::expect_identical(xml2::xml_text(node), text, info = class)
    }
    labels <- xml2::xml_find_all(xml, './/*[@class="misc-root"]/text')
    testthat::expect_equal(sum(xml2::xml_text(labels) == text), 3)
    output <- tempfile(fileext = ".svg")
    chart$save_plot(output, width = 720, height = 480)
    saved <- xml2::xml_ns_strip(xml2::read_xml(output))
    unlink(output)
    testthat::expect_identical(
      xml2::xml_text(xml2::xml_find_first(saved, './/*[@class="chart-title"]')), text
    )

    points <- data.frame(key = 1:3, value = c(10, 12, 11), label = c(NA, text, NA))
    chart <- spc(
      points, keys = key, numerators = value, labels = label,
      title = list(text = text, subtitle = text),
      spc_settings = list(chart_type = "i"), return_objs = objects
    )
    xml <- xml2::xml_ns_strip(xml2::read_xml(chart$static_plot$svg))
    testthat::expect_identical(
      xml2::xml_text(xml2::xml_find_first(xml, './/*[@class="text-labels"]//text')), text
    )
    testthat::expect_identical(
      xml2::xml_text(xml2::xml_find_first(xml, './/*[@class="chart-title"]')), text
    )
  }
})

testthat::test_that("SPC and funnel line labels scale with their font size", {
  dat <- data.frame(key = 1:4, numerator = c(10, 12, 11, 14), denominator = 100)
  for (chart_function in list(spc, funnel)) {
    for (size in c(10, 20)) {
      chart <- chart_function(
        dat, keys = key, numerators = numerator, denominators = denominator,
        line_settings = list(plot_label_show_target = TRUE, plot_label_size_target = size),
        return_objs = "static_plot"
      )
      xml <- xml2::xml_ns_strip(xml2::read_xml(chart$static_plot$svg))
      labels <- xml2::xml_find_all(xml, './/*[@class="linesgroup"]/text[text()]')
      testthat::expect_gt(length(labels), 0)
      testthat::expect_true(all(xml2::xml_attr(labels, "dy") == paste0(size / 4, "px")))
    }
  }
})
