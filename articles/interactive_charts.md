# Portable Interactive Control Charts

## Introduction

A key limitation for interactive plots/charts in R is the need for a
Shiny server in order to handle the data processing and statistical
calculations. The `controlcharts` package overcomes this by performing
all calculations in JavaScript, allowing the charts to be fully portable
and interactive without the need for a server. By constructing charts
using `crosstalk` data objects, multiple charts can also be linked
together to allow for interactive filtering and highlighting in a fully
portable format.

The `controlcharts` package also performs all necessary data
aggregations and pre-processing in JavaScript. This means that users do
not need to pre-aggregate or manipulate their data before creating
charts, simplifying the workflow and making it easier to create
interactive visualisations directly from raw data. This also allows for
dynamic data exploration, as users can filter and interact with the
charts without needing to re-run R code.

## Generate Data

Consider a dataset containing monthly numerators and denominators for 10
different organisations over a 2-year period:

``` r
library(controlcharts)

set.seed(12324)

dat <- do.call(
  rbind.data.frame,
  lapply(toupper(letters[1:10]), function(grp) {
    denom <- sample(0:100, 24)
    data.frame(
      country = sample(c("C1", "C2", "C3"), 1, replace = TRUE),
      organisation = grp,
      month_start = seq(as.Date("2024-01-01"), length.out = 24, by = "month"),
      numerators = rbinom(n = 24, size = denom, prob = 0.3),
      denominators = denom
    )
  })
)
DT::datatable(dat)
```

## Basic Interactivity

SPC charts and funnel plots can be constructed from this data directly,
with the resulting HTML plots supporting mouseover tooltips:

``` r
spc_plt <- controlcharts::spc(data = dat,
                              keys = month_start,
                              numerators = numerators,
                              denominators = denominators,
                              spc_setting = list(chart_type = "p"),
                              outlier_settings = list(astronomical = TRUE,
                                                      shift = TRUE,
                                                      two_in_three = TRUE),
                              nhs_icon_settings =
                                list(show_variation_icons = TRUE))

fun_plt <- controlcharts::funnel(data = dat,
                                 keys = organisation,
                                 numerators = numerators,
                                 denominators = denominators)


spc_plt$html_plot
```

``` r
fun_plt$html_plot
```

### Cross-plot Reactivity and Dynamic Calculations: Crosstalk

By converting the data to a
[`crosstalk::SharedData`](https://rdrr.io/pkg/crosstalk/man/SharedData.html)
object, multiple charts can be linked together to allow for interactive
filtering and highlighting. As the aggregations, filtering, and
statistical calculations are performed dynamically in JavaScript, these
charts remain fully portable and interactive without the need for a
Shiny server.

``` r
# Convert data to crosstalk SharedData object
crosstalk_dat <- crosstalk::SharedData$new(dat)

# Create charts using crosstalk data
spc_plt <- controlcharts::spc(data = crosstalk_dat,
                              keys = month_start,
                              numerators = numerators,
                              denominators = denominators,
                              spc_setting = list(chart_type = "p"),
                              outlier_settings = list(astronomical = TRUE,
                                                      shift = TRUE,
                                                      two_in_three = TRUE),
                              nhs_icon_settings =
                                list(show_variation_icons = TRUE))

fun_plt <- controlcharts::funnel(data = crosstalk_dat,
                                 keys = organisation,
                                 numerators = numerators,
                                 denominators = denominators)
```

We can then use `crosstalk` filters to allow users to dynamically filter
the data displayed in both charts. As the filters are adjusted, the data
aggregations and statistical calculations are updated in real-time
within the charts:

``` r
country_filter <- crosstalk::filter_select("countryFilter", "Country",
                                           crosstalk_dat, ~country)
org_filter <- crosstalk::filter_select("orgFilter", "Organisation",
                                       crosstalk_dat, ~organisation)
date_filter <- crosstalk::filter_slider("monthFilter", "Date",
                                        crosstalk_dat, ~month_start)
crosstalk::bscols(
  date_filter,
  org_filter,
  country_filter
)
crosstalk::bscols(
  fun_plt$html_plot,
  spc_plt$html_plot
)
```

Date

Country

Organisation
