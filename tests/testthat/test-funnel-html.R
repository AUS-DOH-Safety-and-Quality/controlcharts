skip_on_cran()

source("helpers.R")
init_chromote()

test_that("Example Funnel HTML plot rendered with defaults", {
  denoms <- sample(100:200, 10)
  funnel_data <- data.frame(
    organisation = letters[1:10],
    numerators = rbinom(10, size = denoms, prob = 0.2),
    denominators = denoms
  )
  funnel_chart <- funnel(data = funnel_data,
                          numerators = numerators,
                          denominators = denominators,
                          keys = organisation)
  outfile <- tempfile(fileext = ".html")
  funnel_chart$save_plot(outfile)

  b <- chromote::ChromoteSession$new()
  b$go_to(paste0("file://", outfile))
  svg_res <- b$Runtime$evaluate('document.querySelector(".funnel svg").outerHTML')
  expect_equal(svg_res$result$type, "string")

  svg_str <- svg_res$result$value
  xml_res <- xml2::xml_ns_strip(xml2::read_xml(svg_str))

  xaxis <- parse_axis("x", xml_res)
  xaxis_defaults <- funnel_default_settings("x_axis")
  expect_equal(xaxis$fill[1], xaxis_defaults$xlimit_colour)
  expect_equal(xaxis$`font.family`[1], gsub("'", "", xaxis_defaults$xlimit_tick_font))
  expect_equal(xaxis$`font.size`[1], paste0(xaxis_defaults$xlimit_tick_count, "px"))

  yaxis <- parse_axis("y", xml_res)
  yaxis_defaults <- funnel_default_settings("y_axis")
  expect_equal(yaxis$fill[1], yaxis_defaults$ylimit_colour)
  expect_equal(yaxis$`font.family`[1], gsub("'", "", yaxis_defaults$ylimit_tick_font))
  expect_equal(yaxis$`font.size`[1], paste0(yaxis_defaults$ylimit_tick_count, "px"))
})

test_that("Funnel Y-Axis Limit Conditional Formatting works with crosstalk", {
  ind_1 <- data.frame(
    hosp = 1:10,
    num = c(5,10,11,15,17,70,100,120,150,170),
    den = c(6,12,15,17,19,70,105,125,160,180),
    ylimit_l = 45,
    indicator = "ind_1")
  ind_2 <- data.frame(
    hosp = 1:10,
    num = c(5,10,11,15,17,55,77,101,110,110),
    den = c(60,120,150,170,19,70,105,125,160,180),
    ylimit_l = 10,
    indicator = "ind_2")
  funnel_data <- rbind(ind_1,ind_2)

  cross_funnel <- crosstalk::SharedData$new(funnel_data)

  funnel_widget <- funnel(
    data = cross_funnel,
    keys = hosp,
    numerators = num,
    denominators = den,
    y_axis_settings = list(ylimit_l = ylimit_l)
  )$html_plot

  filter_widget <- crosstalk::filter_select(
    id = "indicatorFilter",
    label = "Indicator",
    sharedData = cross_funnel,
    group = ~indicator,
    multiple = FALSE
  )

  outfile <- tempfile(fileext = ".html")
  htmltools::save_html(
    crosstalk::bscols(funnel_widget, filter_widget),
    outfile
  )

  b <- chromote::ChromoteSession$new()
  b$go_to(paste0("file://", outfile))

  trigger_ind_1 <- b$Runtime$evaluate('document.getElementById("indicatorFilter").getElementsByClassName("selectized")[0].selectize.setValue("ind_1", false)')
  fun_res1 <- b$Runtime$evaluate('document.querySelector(".funnel svg").outerHTML')
  xml_res1 <- xml2::xml_ns_strip(xml2::read_xml(fun_res1$result$value))
  yaxis1 <- parse_axis("y", xml_res1)
  yaxis1_mintickval <- min(as.numeric(gsub("%", "", yaxis1$value, fixed = TRUE)))
  expect_gte(yaxis1_mintickval, 45)

  trigger_ind_2 <- b$Runtime$evaluate('document.getElementById("indicatorFilter").getElementsByClassName("selectized")[0].selectize.setValue("ind_2", false)')
  fun_res2 <- b$Runtime$evaluate('document.querySelector(".funnel svg").outerHTML')
  xml_res2 <- xml2::xml_ns_strip(xml2::read_xml(fun_res2$result$value))
  yaxis2 <- parse_axis("y", xml_res2)
  yaxis2_mintickval <- min(as.numeric(gsub("%", "", yaxis2$value, fixed = TRUE)))
  expect_gte(yaxis2_mintickval, 10)
})
