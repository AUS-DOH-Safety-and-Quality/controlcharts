skip_on_cran()

source("helpers.R")
init_chromote()

test_that("all widgets export the displayed chart as standalone SVG and PNG", {
  work <- tempfile("chart-export-")
  dir.create(work)
  on.exit(unlink(work, recursive = TRUE), add = TRUE)
  data <- data.frame(key = 1:12, numerator = c(5, 7, 8, 4, 6, 9, 3, 8, 6, 4, 7, 5), denominator = 20)
  shared <- crosstalk::SharedData$new(data, key = ~as.character(key), group = "export-test")
  charts <- list(
    spc = spc(shared, keys = key, numerators = numerator, title = "SPC / export", return_objs = "html_plot"),
    funnel = funnel(data, keys = key, numerators = numerator, denominators = denominator,
                    title = "Funnel export", return_objs = "html_plot"),
    misc = misc(transform(data, indicator = "Measure"), keys = key, numerators = numerator,
                denominators = denominator, indicators = indicator, target = "1",
                title = "MISC export", return_objs = "html_plot")
  )
  widgets <- lapply(names(charts), function(type) {
    widget <- charts[[type]]$html_plot
    widget$elementId <- paste0(type, "-export-test")
    widget$width <- 640
    widget$height <- 400
    widget
  })
  htmltools::save_html(
    htmltools::tagList(htmltools::tags$style(htmltools::HTML(paste(
      ".spc .chart-title { fill: rgb(31, 87, 123) !important; }",
      ".spc > svg { background: #f5faff !important; }"
    ))), widgets),
    file.path(work, "charts.html"), libdir = file.path(work, "lib")
  )
  browser <- chromote::ChromoteSession$new()
  on.exit(browser$close(), add = TRUE)
  browser$Browser$setDownloadBehavior(behavior = "allow", downloadPath = normalizePath(work))
  browser$go_to(paste0("file://", normalizePath(file.path(work, "charts.html"))))
  evaluate <- function(code) {
    result <- browser$Runtime$evaluate(code, returnByValue = TRUE, awaitPromise = TRUE)
    expect_null(result$exceptionDetails)
    result$result$value
  }
  expect_equal(evaluate("document.querySelectorAll('.controlcharts-export').length"), 3)
  expect_equal(evaluate("document.querySelectorAll('.controlcharts-export[open]').length"), 0)

  evaluate(paste(
    "window.exportFilter = new crosstalk.FilterHandle('export-test');",
    "exportFilter.set(['1', '2', '3', '4', '5', '6']);",
    "const widget = document.getElementById('spc-export-test');",
    "widget.style.width = '720px'; widget.style.height = '360px';",
    "HTMLWidgets.find('#spc-export-test').resize(720, 360);"
  ))
  filenames <- c(spc = "SPC - export", funnel = "Funnel export", misc = "MISC export")
  for (type in names(charts)) {
    dimensions <- evaluate(sprintf(paste(
      "(() => { const svg = document.querySelector('#%s-export-test > svg');",
      "const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');",
      "text.textContent = 'Transient tooltip'; svg.querySelector('.chart-tooltip-group').appendChild(text);",
      "return [svg.width.baseVal.value, svg.height.baseVal.value]; })()"
    ), type))
    for (format in c("svg", "png")) {
      evaluate(sprintf(paste(
        "(() => { const control = document.querySelector('#%s-export-test .controlcharts-export');",
        "control.querySelector('summary').click();",
        "control.querySelector('[data-format=\"%s\"]').click(); })()"
      ), type, format))
      file <- file.path(work, paste0(filenames[[type]], ".", format))
      for (attempt in seq_len(100)) {
        if (file.exists(file)) break
        Sys.sleep(0.05)
      }
      expect_true(file.exists(file), info = basename(file))
      if (!file.exists(file)) next
      if (format == "svg") {
        svg <- xml2::xml_ns_strip(xml2::read_xml(file))
        expect_equal(as.numeric(xml2::xml_attr(svg, "width")), dimensions[[1]])
        expect_equal(as.numeric(xml2::xml_attr(svg, "height")), dimensions[[2]])
        expect_equal(xml2::xml_attr(svg, "viewBox"), paste("0 0", dimensions[[1]], dimensions[[2]]))
        expect_length(xml2::xml_find_all(svg, './/*[@class="chart-tooltip-group"]'), 0)
        expect_false(grepl("controlcharts-export", as.character(svg), fixed = TRUE))
        expect_match(xml2::xml_text(svg), if (type == "spc") "SPC / export" else filenames[[type]], fixed = TRUE)
        if (type == "spc") {
          expect_length(xml2::xml_find_all(svg, './/*[@class="dotsgroup"]/*'), 6)
          expect_match(xml2::xml_attr(xml2::xml_find_first(svg, './/*[@class="chart-title"]'), "style"),
                       "rgb(31, 87, 123)", fixed = TRUE)
          expect_equal(xml2::xml_attr(xml2::xml_child(svg), "fill"), "rgb(245, 250, 255)")
        } else if (type == "funnel") {
          expect_equal(xml2::xml_attr(xml2::xml_child(svg), "fill"), "white")
        }
      } else {
        bytes <- readBin(file, "raw", n = 24)
        expect_equal(bytes[1:8], as.raw(c(137, 80, 78, 71, 13, 10, 26, 10)))
        size <- readBin(bytes[17:24], "integer", n = 2, size = 4, endian = "big")
        expect_equal(size, 2 * unlist(dimensions, use.names = FALSE))
      }
    }
  }
  expect_equal(evaluate("document.querySelectorAll('.controlcharts-export').length"), 3)
  expect_equal(evaluate("document.querySelectorAll('.controlcharts-export[open]').length"), 0)
  expect_true(evaluate(paste(
    "(() => { const control = document.querySelector('.controlcharts-export');",
    "const summary = control.querySelector('summary'); summary.focus(); summary.click();",
    "summary.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));",
    "return !control.open && document.activeElement === summary; })()"
  )))
  expect_true(evaluate(paste(
    "(async () => { const control = document.querySelector('.controlcharts-export');",
    "const original = HTMLCanvasElement.prototype.toBlob;",
    "HTMLCanvasElement.prototype.toBlob = callback => callback(null);",
    "try { control.open = true; const button = control.querySelector('[data-format=png]');",
    "button.focus(); button.click();",
    "while (control.hasAttribute('aria-busy')) await new Promise(resolve => setTimeout(resolve, 10));",
    "return control.open && !button.disabled && control.querySelector('[role=status]').textContent.length > 0;",
    "} finally { HTMLCanvasElement.prototype.toBlob = original; } })()"
  )))
  browser$Emulation$setEmulatedMedia(media = "print")
  expect_equal(evaluate("getComputedStyle(document.querySelector('.controlcharts-export')).display"), "none")
})
