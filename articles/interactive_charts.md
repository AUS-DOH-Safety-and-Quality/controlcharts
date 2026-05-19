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
knitr::kable(dat)
```

| country | organisation | month_start | numerators | denominators |
|:--------|:-------------|:------------|-----------:|-------------:|
| C2      | A            | 2024-01-01  |         26 |           94 |
| C2      | A            | 2024-02-01  |         27 |           97 |
| C2      | A            | 2024-03-01  |          8 |           47 |
| C2      | A            | 2024-04-01  |         12 |           33 |
| C2      | A            | 2024-05-01  |         17 |           69 |
| C2      | A            | 2024-06-01  |          7 |           22 |
| C2      | A            | 2024-07-01  |          6 |           24 |
| C2      | A            | 2024-08-01  |         20 |           80 |
| C2      | A            | 2024-09-01  |         29 |           93 |
| C2      | A            | 2024-10-01  |         17 |           77 |
| C2      | A            | 2024-11-01  |         14 |           41 |
| C2      | A            | 2024-12-01  |         19 |           57 |
| C2      | A            | 2025-01-01  |          9 |           23 |
| C2      | A            | 2025-02-01  |         25 |           49 |
| C2      | A            | 2025-03-01  |          4 |           21 |
| C2      | A            | 2025-04-01  |         26 |           90 |
| C2      | A            | 2025-05-01  |         20 |           74 |
| C2      | A            | 2025-06-01  |         29 |           84 |
| C2      | A            | 2025-07-01  |          5 |           14 |
| C2      | A            | 2025-08-01  |          2 |            7 |
| C2      | A            | 2025-09-01  |         25 |           54 |
| C2      | A            | 2025-10-01  |         26 |           88 |
| C2      | A            | 2025-11-01  |         25 |           92 |
| C2      | A            | 2025-12-01  |         25 |           83 |
| C3      | B            | 2024-01-01  |         24 |           90 |
| C3      | B            | 2024-02-01  |          6 |           21 |
| C3      | B            | 2024-03-01  |         14 |           37 |
| C3      | B            | 2024-04-01  |         29 |           84 |
| C3      | B            | 2024-05-01  |          4 |           16 |
| C3      | B            | 2024-06-01  |         20 |           71 |
| C3      | B            | 2024-07-01  |         12 |           39 |
| C3      | B            | 2024-08-01  |          4 |           18 |
| C3      | B            | 2024-09-01  |          0 |            0 |
| C3      | B            | 2024-10-01  |         34 |           88 |
| C3      | B            | 2024-11-01  |          8 |           30 |
| C3      | B            | 2024-12-01  |          8 |           12 |
| C3      | B            | 2025-01-01  |          3 |            8 |
| C3      | B            | 2025-02-01  |         10 |           28 |
| C3      | B            | 2025-03-01  |          1 |            6 |
| C3      | B            | 2025-04-01  |          6 |           19 |
| C3      | B            | 2025-05-01  |         15 |           54 |
| C3      | B            | 2025-06-01  |         20 |           62 |
| C3      | B            | 2025-07-01  |         21 |           50 |
| C3      | B            | 2025-08-01  |          6 |           15 |
| C3      | B            | 2025-09-01  |         11 |           46 |
| C3      | B            | 2025-10-01  |         18 |           72 |
| C3      | B            | 2025-11-01  |          6 |           22 |
| C3      | B            | 2025-12-01  |         27 |           98 |
| C1      | C            | 2024-01-01  |         28 |           90 |
| C1      | C            | 2024-02-01  |          7 |           15 |
| C1      | C            | 2024-03-01  |          3 |            9 |
| C1      | C            | 2024-04-01  |         22 |           74 |
| C1      | C            | 2024-05-01  |         30 |           98 |
| C1      | C            | 2024-06-01  |          1 |            6 |
| C1      | C            | 2024-07-01  |          0 |            2 |
| C1      | C            | 2024-08-01  |         21 |           65 |
| C1      | C            | 2024-09-01  |          2 |            4 |
| C1      | C            | 2024-10-01  |          2 |            5 |
| C1      | C            | 2024-11-01  |          8 |           31 |
| C1      | C            | 2024-12-01  |         21 |           89 |
| C1      | C            | 2025-01-01  |          5 |           21 |
| C1      | C            | 2025-02-01  |         23 |           83 |
| C1      | C            | 2025-03-01  |         26 |           69 |
| C1      | C            | 2025-04-01  |         10 |           32 |
| C1      | C            | 2025-05-01  |          7 |           27 |
| C1      | C            | 2025-06-01  |         11 |           35 |
| C1      | C            | 2025-07-01  |         33 |          100 |
| C1      | C            | 2025-08-01  |          4 |           13 |
| C1      | C            | 2025-09-01  |         30 |           97 |
| C1      | C            | 2025-10-01  |          0 |            1 |
| C1      | C            | 2025-11-01  |         26 |           82 |
| C1      | C            | 2025-12-01  |         25 |           95 |
| C3      | D            | 2024-01-01  |          3 |            7 |
| C3      | D            | 2024-02-01  |         19 |           70 |
| C3      | D            | 2024-03-01  |         17 |           72 |
| C3      | D            | 2024-04-01  |          7 |           25 |
| C3      | D            | 2024-05-01  |         22 |           71 |
| C3      | D            | 2024-06-01  |         13 |           53 |
| C3      | D            | 2024-07-01  |         30 |          100 |
| C3      | D            | 2024-08-01  |          9 |           18 |
| C3      | D            | 2024-09-01  |         44 |           95 |
| C3      | D            | 2024-10-01  |         12 |           36 |
| C3      | D            | 2024-11-01  |          3 |            8 |
| C3      | D            | 2024-12-01  |          2 |            2 |
| C3      | D            | 2025-01-01  |         14 |           59 |
| C3      | D            | 2025-02-01  |         18 |           90 |
| C3      | D            | 2025-03-01  |          0 |            3 |
| C3      | D            | 2025-04-01  |         21 |           63 |
| C3      | D            | 2025-05-01  |         15 |           39 |
| C3      | D            | 2025-06-01  |         30 |           94 |
| C3      | D            | 2025-07-01  |         25 |           96 |
| C3      | D            | 2025-08-01  |          3 |           12 |
| C3      | D            | 2025-09-01  |         13 |           27 |
| C3      | D            | 2025-10-01  |         28 |           98 |
| C3      | D            | 2025-11-01  |         26 |           87 |
| C3      | D            | 2025-12-01  |          7 |           34 |
| C1      | E            | 2024-01-01  |         21 |           78 |
| C1      | E            | 2024-02-01  |         10 |           40 |
| C1      | E            | 2024-03-01  |         21 |           79 |
| C1      | E            | 2024-04-01  |         18 |           94 |
| C1      | E            | 2024-05-01  |         16 |           61 |
| C1      | E            | 2024-06-01  |         15 |           58 |
| C1      | E            | 2024-07-01  |          1 |            3 |
| C1      | E            | 2024-08-01  |         17 |           43 |
| C1      | E            | 2024-09-01  |         20 |           74 |
| C1      | E            | 2024-10-01  |         18 |           57 |
| C1      | E            | 2024-11-01  |         16 |           60 |
| C1      | E            | 2024-12-01  |          5 |           18 |
| C1      | E            | 2025-01-01  |          6 |           17 |
| C1      | E            | 2025-02-01  |         34 |          100 |
| C1      | E            | 2025-03-01  |          9 |           44 |
| C1      | E            | 2025-04-01  |          7 |           22 |
| C1      | E            | 2025-05-01  |         25 |           89 |
| C1      | E            | 2025-06-01  |         32 |           91 |
| C1      | E            | 2025-07-01  |         29 |           86 |
| C1      | E            | 2025-08-01  |         23 |           71 |
| C1      | E            | 2025-09-01  |         20 |           69 |
| C1      | E            | 2025-10-01  |          5 |           20 |
| C1      | E            | 2025-11-01  |         24 |           73 |
| C1      | E            | 2025-12-01  |         11 |           35 |
| C2      | F            | 2024-01-01  |          5 |            8 |
| C2      | F            | 2024-02-01  |          0 |            2 |
| C2      | F            | 2024-03-01  |          7 |           15 |
| C2      | F            | 2024-04-01  |          9 |           30 |
| C2      | F            | 2024-05-01  |          3 |            3 |
| C2      | F            | 2024-06-01  |         17 |           64 |
| C2      | F            | 2024-07-01  |         27 |           84 |
| C2      | F            | 2024-08-01  |         28 |           88 |
| C2      | F            | 2024-09-01  |         19 |           52 |
| C2      | F            | 2024-10-01  |         12 |           44 |
| C2      | F            | 2024-11-01  |         12 |           32 |
| C2      | F            | 2024-12-01  |         31 |           97 |
| C2      | F            | 2025-01-01  |         16 |           40 |
| C2      | F            | 2025-02-01  |         10 |           55 |
| C2      | F            | 2025-03-01  |         14 |           57 |
| C2      | F            | 2025-04-01  |         27 |           87 |
| C2      | F            | 2025-05-01  |         23 |           67 |
| C2      | F            | 2025-06-01  |         18 |           65 |
| C2      | F            | 2025-07-01  |         26 |           96 |
| C2      | F            | 2025-08-01  |          6 |           22 |
| C2      | F            | 2025-09-01  |         26 |           99 |
| C2      | F            | 2025-10-01  |         24 |           77 |
| C2      | F            | 2025-11-01  |         21 |           82 |
| C2      | F            | 2025-12-01  |         28 |           92 |
| C3      | G            | 2024-01-01  |          9 |           33 |
| C3      | G            | 2024-02-01  |         18 |           50 |
| C3      | G            | 2024-03-01  |         13 |           61 |
| C3      | G            | 2024-04-01  |         35 |           93 |
| C3      | G            | 2024-05-01  |         27 |           79 |
| C3      | G            | 2024-06-01  |          4 |           12 |
| C3      | G            | 2024-07-01  |         31 |           87 |
| C3      | G            | 2024-08-01  |          9 |           24 |
| C3      | G            | 2024-09-01  |          6 |           14 |
| C3      | G            | 2024-10-01  |         27 |           94 |
| C3      | G            | 2024-11-01  |         17 |           62 |
| C3      | G            | 2024-12-01  |          4 |            8 |
| C3      | G            | 2025-01-01  |         32 |          100 |
| C3      | G            | 2025-02-01  |         21 |           59 |
| C3      | G            | 2025-03-01  |          1 |            5 |
| C3      | G            | 2025-04-01  |          2 |            4 |
| C3      | G            | 2025-05-01  |         15 |           55 |
| C3      | G            | 2025-06-01  |         14 |           37 |
| C3      | G            | 2025-07-01  |         11 |           20 |
| C3      | G            | 2025-08-01  |          5 |           16 |
| C3      | G            | 2025-09-01  |         14 |           53 |
| C3      | G            | 2025-10-01  |         28 |           85 |
| C3      | G            | 2025-11-01  |          5 |           31 |
| C3      | G            | 2025-12-01  |          8 |           27 |
| C3      | H            | 2024-01-01  |         16 |           87 |
| C3      | H            | 2024-02-01  |          7 |           25 |
| C3      | H            | 2024-03-01  |          3 |           14 |
| C3      | H            | 2024-04-01  |         17 |           64 |
| C3      | H            | 2024-05-01  |         21 |           84 |
| C3      | H            | 2024-06-01  |         14 |           47 |
| C3      | H            | 2024-07-01  |         10 |           35 |
| C3      | H            | 2024-08-01  |         18 |           38 |
| C3      | H            | 2024-09-01  |          4 |           20 |
| C3      | H            | 2024-10-01  |         32 |           91 |
| C3      | H            | 2024-11-01  |         16 |           58 |
| C3      | H            | 2024-12-01  |         17 |           55 |
| C3      | H            | 2025-01-01  |         23 |           78 |
| C3      | H            | 2025-02-01  |         18 |           49 |
| C3      | H            | 2025-03-01  |          1 |            4 |
| C3      | H            | 2025-04-01  |          0 |            0 |
| C3      | H            | 2025-05-01  |         27 |           80 |
| C3      | H            | 2025-06-01  |         16 |           56 |
| C3      | H            | 2025-07-01  |         15 |           53 |
| C3      | H            | 2025-08-01  |          4 |           10 |
| C3      | H            | 2025-09-01  |          1 |            8 |
| C3      | H            | 2025-10-01  |         25 |           61 |
| C3      | H            | 2025-11-01  |         10 |           59 |
| C3      | H            | 2025-12-01  |          6 |           18 |
| C2      | I            | 2024-01-01  |          5 |           23 |
| C2      | I            | 2024-02-01  |         23 |           85 |
| C2      | I            | 2024-03-01  |         27 |           87 |
| C2      | I            | 2024-04-01  |         14 |           48 |
| C2      | I            | 2024-05-01  |         19 |           69 |
| C2      | I            | 2024-06-01  |          8 |           16 |
| C2      | I            | 2024-07-01  |         37 |           90 |
| C2      | I            | 2024-08-01  |         14 |           61 |
| C2      | I            | 2024-09-01  |          5 |           13 |
| C2      | I            | 2024-10-01  |          6 |           22 |
| C2      | I            | 2024-11-01  |          9 |           37 |
| C2      | I            | 2024-12-01  |         22 |           66 |
| C2      | I            | 2025-01-01  |         14 |           40 |
| C2      | I            | 2025-02-01  |         16 |           41 |
| C2      | I            | 2025-03-01  |          6 |           28 |
| C2      | I            | 2025-04-01  |          5 |           34 |
| C2      | I            | 2025-05-01  |          2 |            3 |
| C2      | I            | 2025-06-01  |          7 |           35 |
| C2      | I            | 2025-07-01  |         12 |           27 |
| C2      | I            | 2025-08-01  |         31 |           93 |
| C2      | I            | 2025-09-01  |          0 |            2 |
| C2      | I            | 2025-10-01  |          2 |            5 |
| C2      | I            | 2025-11-01  |         12 |           36 |
| C2      | I            | 2025-12-01  |         21 |           78 |
| C2      | J            | 2024-01-01  |         15 |           35 |
| C2      | J            | 2024-02-01  |         25 |           97 |
| C2      | J            | 2024-03-01  |          0 |            2 |
| C2      | J            | 2024-04-01  |         21 |           83 |
| C2      | J            | 2024-05-01  |          3 |            6 |
| C2      | J            | 2024-06-01  |         16 |           90 |
| C2      | J            | 2024-07-01  |         28 |           74 |
| C2      | J            | 2024-08-01  |         24 |           87 |
| C2      | J            | 2024-09-01  |          6 |           10 |
| C2      | J            | 2024-10-01  |         16 |           52 |
| C2      | J            | 2024-11-01  |         20 |           60 |
| C2      | J            | 2024-12-01  |         14 |           44 |
| C2      | J            | 2025-01-01  |          6 |           21 |
| C2      | J            | 2025-02-01  |         19 |           70 |
| C2      | J            | 2025-03-01  |          7 |           30 |
| C2      | J            | 2025-04-01  |          4 |            9 |
| C2      | J            | 2025-05-01  |         22 |           66 |
| C2      | J            | 2025-06-01  |         25 |           76 |
| C2      | J            | 2025-07-01  |         26 |           92 |
| C2      | J            | 2025-08-01  |         18 |           62 |
| C2      | J            | 2025-09-01  |         27 |           95 |
| C2      | J            | 2025-10-01  |         20 |           49 |
| C2      | J            | 2025-11-01  |         23 |           72 |
| C2      | J            | 2025-12-01  |         30 |           86 |

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
