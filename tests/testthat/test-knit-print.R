test_that("static charts embed PDF graphics for LaTeX and SVG for Word", {
  skip_if_not_installed("knitr")
  skip_if_not_installed("rsvg")
  chart <- structure(list(static_plot = structure(list(
    svg = '<circle cx="50" cy="50" r="20" fill="blue"/>',
    width = 100, height = 100
  ), class = "static_plot")), class = "controlchart")

  check_format <- function(format, extension) {
    opts <- knitr::opts_knit$get()
    chunks <- knitr::opts_current$get()
    on.exit(knitr::opts_knit$restore(opts), add = TRUE)
    on.exit(knitr::opts_current$restore(chunks), add = TRUE)
    work <- tempfile("knit-print-")
    on.exit(unlink(work, recursive = TRUE), add = TRUE)
    knitr::opts_knit$set(rmarkdown.pandoc.to = format)
    knitr::opts_current$set(fig.path = paste0(work, "/"))
    output <- knitr::knit_print(chart)
    expect_s3_class(output, "knit_image_paths")
    expect_equal(tools::file_ext(output), extension)
    expect_true(file.exists(output))
    signature <- rawToChar(readBin(output, "raw", n = 4))
    expect_equal(signature, if (extension == "pdf") "%PDF" else "<svg")
  }

  for (format in c("latex", "beamer", "pdf")) check_format(format, "pdf")
  check_format("docx", "svg")
})

test_that("static charts treat missing labels as unlabelled points", {
  data <- data.frame(key = 1:3, numerator = c(10, 12, 11), label = c(NA, "Marked & reviewed", NA))
  chart <- spc(data, keys = key, numerators = numerator, labels = label,
               spc_settings = list(chart_type = "i"), return_objs = "static_plot")
  expect_s3_class(chart$static_plot, "static_plot")
  expect_match(chart$static_plot$svg, "Marked &amp; reviewed", fixed = TRUE)
  expect_false(grepl(">NA<", chart$static_plot$svg, fixed = TRUE))
  blank <- spc(transform(data, label = NA_character_), keys = key, numerators = numerator,
               labels = label, spc_settings = list(chart_type = "i"), return_objs = "static_plot")
  expect_s3_class(blank$static_plot, "static_plot")
  expect_false(grepl(">NA<", blank$static_plot$svg, fixed = TRUE))
})
