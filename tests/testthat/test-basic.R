dat <- data.frame(
  month = seq(as.Date('2024-01-01'), length.out = 24, by = "month"),
  y = rnorm(24)
)
spc_chart <- spc(data = dat, numerators = y, keys = month)

test_that("Example HTML plot works", {
  skip_on_cran()

  outfile <- tempfile(fileext = ".html")
  spc_chart$save_plot(outfile)

  b <- chromote::ChromoteSession$new()
  b$go_to(paste0("file://", outfile))

  svg_res <- b$Runtime$evaluate('document.querySelector(".spc svg").outerHTML')
  expect_equal(svg_res$result$type, "string")
})
