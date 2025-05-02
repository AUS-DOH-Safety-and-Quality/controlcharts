set.seed(12324)

dat <- data.frame(
  y = rnorm(24),
  x = seq(as.Date('2024-01-01'), length.out=24, by="month")
)

res <- spc(keys = x,
           numerators = y,
           data = dat,
           scatter_settings = spc_scatter_settings(size = 4),
           outlier_settings = spc_outlier_settings(astronomical = TRUE,
                                                   shift = TRUE,
                                                   shift_n = 4,
                                                   two_in_three = TRUE),
           nhs_icon_settings = spc_nhs_icon_settings(show_variation_icons = TRUE))
View(res$limits)
res$html_plot
res$static_plot
