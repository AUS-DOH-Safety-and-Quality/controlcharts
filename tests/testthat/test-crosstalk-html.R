skip_on_cran()

source("helpers.R")
init_chromote()

test_that("core identities link aggregated points and grouped rows through Crosstalk", {
  dat <- data.frame(
    key = rep(rep(1:3, each = 2), 2), indicator = rep(c("A", "B"), each = 6),
    numerator = c(2, 3, 4, 3, 5, 4, 3, 2, 3, 4, 4, 5), denominator = 20
  )
  shared <- crosstalk::SharedData$new(dat, key = paste0("r", seq_len(nrow(dat))),
                                     group = "core-selection")
  scatter <- list(opacity = 1, opacity_selected = 1, opacity_unselected = 0.25)
  spc_plot <- spc(shared, keys = key, numerators = numerator,
                  scatter_settings = scatter, return_objs = "html_plot")$html_plot
  funnel_plot <- funnel(shared, keys = key, numerators = numerator,
                        denominators = denominator, scatter_settings = scatter,
                        return_objs = "html_plot")$html_plot
  grouped <- spc(shared, keys = key, numerators = numerator, indicators = indicator,
                  return_objs = "html_plot")$html_plot
  misc_plot <- misc(shared, keys = key, numerators = numerator, denominators = denominator,
                    indicators = indicator, target = 2, scatter_settings = scatter,
                    title = "Native MISC", return_objs = "html_plot")$html_plot
  outfile <- tempfile(fileext = ".html")
  htmltools::save_html(crosstalk::bscols(
    htmltools::div(id = "spc-chart", spc_plot),
    htmltools::div(id = "funnel-chart", funnel_plot),
    htmltools::div(id = "grouped-chart", grouped),
    htmltools::div(id = "misc-chart", misc_plot)
  ), outfile)
  browser <- chromote::ChromoteSession$new()
  on.exit(browser$close(), add = TRUE)
  browser$go_to(paste0("file://", outfile))
  evaluate <- function(code) {
    browser$Runtime$evaluate(code, returnByValue = TRUE)$result$value
  }
  evaluate(r"(
    var selection = new crosstalk.SelectionHandle('core-selection');
    var filter = new crosstalk.FilterHandle('core-selection');
    function opacities(selector, property) {
      const nodes = document.querySelectorAll(selector);
      const values = [];
      for (let i = 0; i < nodes.length; i++) {
        values.push(Number(getComputedStyle(nodes[i]).getPropertyValue(property)));
      }
      return values;
    }
    function chartState() {
      return {
        spc: opacities('#spc-chart .dotsgroup > *', 'fill-opacity'),
        funnel: opacities('#funnel-chart .dotsgroup > *', 'fill-opacity'),
        grouped: opacities('#grouped-chart .table-body > tr', 'opacity'),
        misc: opacities('#misc-chart .misc-bar', 'opacity')
      };
    }
    selection.set(['r2']);
  )")
  state <- evaluate("chartState()")
  expect_equal(unlist(state$spc), c(1, 0.25, 0.25))
  expect_equal(unlist(state$funnel), c(1, 0.25, 0.25))
  expect_equal(unlist(state$grouped), c(1, spc_default_settings("summary_table")$table_opacity_unselected))
  expect_equal(unlist(state$misc), c(0.25, 0.25))

  evaluate(r"(
    document.querySelectorAll('#funnel-chart .dotsgroup > *')[1]
      .dispatchEvent(new MouseEvent('click', {bubbles: true}));
  )")
  expect_setequal(unlist(evaluate("selection.value")), c("r3", "r4", "r9", "r10"))
  expect_equal(unlist(evaluate("chartState().spc")), c(0.25, 1, 0.25))
  expect_equal(unlist(evaluate("chartState().misc")), c(1, 1))

  ctrl_click_funnel_dot <- r"(
    document.querySelectorAll('#funnel-chart .dotsgroup > *')[1]
      .dispatchEvent(new MouseEvent('click', {bubbles: true, ctrlKey: true}));
  )"
  evaluate(ctrl_click_funnel_dot)
  expect_null(evaluate("selection.value"))
  expect_equal(unlist(evaluate("chartState().spc")), rep(1, 3))
  evaluate(ctrl_click_funnel_dot)
  expect_setequal(unlist(evaluate("selection.value")), c("r3", "r4", "r9", "r10"))

  evaluate("filter.set(['r1', 'r2', 'r3', 'r4', 'r5', 'r6']);")
  expect_equal(unlist(evaluate("chartState().spc")), c(0.25, 1, 0.25))
  expect_equal(unlist(evaluate("chartState().misc")), 1)
  expect_equal(evaluate("document.querySelector('#misc-chart .chart-title').textContent"), "Native MISC")
  # A re-render, as Shiny does, keeps the active filter
  evaluate(r"(
    var miscWidget = document.querySelector('#misc-chart .html-widget');
    var miscData = JSON.parse(document.querySelector('script[data-for="' + miscWidget.id + '"]').textContent).x;
    HTMLWidgets.getInstance(miscWidget).renderValue(miscData);
  )")
  expect_equal(unlist(evaluate("chartState().misc")), 1)
  evaluate(r"(
    document.querySelector('#misc-chart .misc-bar')
      .dispatchEvent(new MouseEvent('click', {bubbles: true}));
  )")
  expect_setequal(unlist(evaluate("selection.value")), c("r3", "r4"))
  evaluate(r"(
    selection.clear();
    document.querySelector('#grouped-chart .table-body > tr')
      .dispatchEvent(new MouseEvent('click', {bubbles: true}));
  )")
  expect_setequal(unlist(evaluate("selection.value")), paste0("r", 1:6))
  expect_equal(unlist(evaluate("chartState().funnel")), rep(1, 3))
  expect_equal(evaluate("document.querySelectorAll('.errormessage').length"), 0)
})

test_that("Crosstalk MISC rows follow factor indicator levels", {
  dat <- data.frame(
    organisation = rep(LETTERS[1:4], 3),
    indicator = factor(rep(c("Safety", "HSPR", "Access"), each = 4), levels = c("Safety", "Access", "HSPR")),
    numerator = c(20, 25, 30, 22, 40, 35, 45, 38, 10, 12, 8, 15),
    denominator = 100
  )
  shared <- crosstalk::SharedData$new(dat, key = paste0("r", seq_len(nrow(dat))), group = "misc-levels")
  misc_plot <- misc(shared, keys = organisation, numerators = numerator, denominators = denominator,
                    indicators = indicator, target = "A", return_objs = "html_plot")$html_plot
  outfile <- tempfile(fileext = ".html")
  htmltools::save_html(htmltools::div(id = "misc-chart", misc_plot), outfile)
  browser <- chromote::ChromoteSession$new()
  on.exit(browser$close(), add = TRUE)
  browser$go_to(paste0("file://", outfile))
  rows <- browser$Runtime$evaluate(
    "Array.from(document.querySelectorAll('#misc-chart .misc-y-tick'), node => node.textContent)",
    returnByValue = TRUE
  )$result$value
  expect_identical(unlist(rows), c("Safety", "Access", "HSPR"))
})
