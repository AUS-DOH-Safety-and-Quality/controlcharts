skip_on_cran()

source("helpers.R")
init_chromote()

test_that("Example HTML plot rendered with defaults", {
  dat <- data.frame(
    month = seq(as.Date('2024-01-01'), length.out = 24, by = "month"),
    y = rnorm(24)
  )
  spc_chart <- spc(data = dat, numerators = y, keys = month)
  outfile <- tempfile(fileext = ".html")
  spc_chart$save_plot(outfile)

  b <- chromote::ChromoteSession$new()
  b$go_to(paste0("file://", outfile))
  svg_res <- b$Runtime$evaluate('document.querySelector(".spc svg").outerHTML')
  expect_equal(svg_res$result$type, "string")

  svg_str <- svg_res$result$value
  xml_res <- xml2::xml_ns_strip(xml2::read_xml(svg_str))

  test_linegroup(xml_res, "main")
  test_linegroup(xml_res, "target")
  test_linegroup(xml_res, "ul99")
  test_linegroup(xml_res, "ul95")
  test_linegroup(xml_res, "ll95")
  test_linegroup(xml_res, "ll99")

  dots <- parse_dots(xml_res)
  expect_equal(nrow(dots), nrow(dat))
  dots_defaults <- spc_default_settings("scatter")
  expect_all_equal(dots$fill, dots_defaults$colour)
  expect_all_equal(dots$stroke, dots_defaults$colour_outline)
  expect_all_equal(dots$`stroke.width`, dots_defaults$width_outline)
})
