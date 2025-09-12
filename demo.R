set.seed(12324)

dat <- do.call(
  rbind.data.frame,
  lapply(toupper(letters[1:10]), function(grp) {
    denom <- sample(0:100, 24)
    data.frame(
      country = sample(c("C1", "C2", "C3"), 1, replace = TRUE),
      organisation = grp,
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
fun_plt <- controlcharts::funnel(keys = organisation,
                                 numerators = numerators,
                                 denominators=denominators,
                                 data = crosstalk_dat,
                                 scatter_settings = list(size = 4),
                                 y_axis_settings = list(ylimit_u = 100))

set.seed(12324)

dat <- do.call(
  rbind.data.frame,
  lapply(toupper(letters[1:10]), function(grp) {
    denom <- sample(0:100, 24)
    data.frame(
      country = sample(c("C1", "C2", "C3"), 1, replace = TRUE),
      organisation = grp,
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
fun_plt <- controlcharts::funnel(keys = organisation,
                                 numerators = numerators,
                                 denominators=denominators,
                                 data = crosstalk_dat,
                                 scatter_settings = list(size = 4),
                                 y_axis_settings = list(ylimit_u = 100))

crosstalk::bscols(list(
                      crosstalk::filter_slider("dateFilter", "Date", crosstalk_dat, ~month_start, width = "100%"),
                       crosstalk::filter_checkbox("countryFilter", "Country", crosstalk_dat, ~country, inline = TRUE),
                       crosstalk::filter_checkbox("orgFilter", "Organisation", crosstalk_dat, ~organisation)
                  ),
                  fun_plt$html_plot,
                  spc_plt$html_plot)
spc_plt
