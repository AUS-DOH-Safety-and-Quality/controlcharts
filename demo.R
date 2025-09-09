set.seed(12324)

dat <- do.call(
  rbind.data.frame,
  lapply(toupper(letters[1:10]), function(grp) {
    denom <- sample(0:100, 24)
    data.frame(
      estab = grp,
      month_start = seq(as.Date('2024-01-01'), length.out=24, by="month"),
      numerators = rbinom(n = 24, size = denom, prob = 0.3),
      denominators = denom
    )
  })
)

crosstalk_dat <- crosstalk::SharedData$new(dat)

spc_plt <- controlcharts::spc(keys = month_start,
                              numerators = numerators,
                              denominators = denominators,
                              data = crosstalk_dat,
                              scatter_settings = list(size = 4),
                              outlier_settings = list(astronomical = TRUE,
                                                      shift = TRUE,
                                                      shift_n = 4,
                                                      two_in_three = TRUE),
                              nhs_icon_settings = list(show_variation_icons = TRUE))
fun_plt <- controlcharts::funnel(keys = estab,
                                 numerators = numerators,
                                 denominators=denominators,
                                 data = crosstalk_dat,
                                 scatter_settings = list(size = 4),
                                 y_axis_settings = list(ylimit_u = 100))

crosstalk::bscols(list(crosstalk::filter_checkbox("estab", "Establishment", crosstalk_dat, ~estab)), spc_plt$html_plot)
