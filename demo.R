set.seed(12324)

# SPC

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

# Funnel

denom <- sample(100:1000, 10)

dat_funnel <- data.frame(
  grps = letters[1:10],
  nums = rbinom(n = 10, size = denom, prob = 0.6),
  dens = denom
)
res_fun <- funnel(keys = grps, numerators = nums, denominators = dens, data = dat_funnel)
