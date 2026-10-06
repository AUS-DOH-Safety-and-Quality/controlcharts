# Generate a multi-indicator sigma chart

Calculates a funnel plot independently for each indicator, then displays
the selected target's funnel z-score for every indicator. Positive
values are in the favourable direction.

## Usage

``` r
misc(
  data,
  keys,
  numerators,
  denominators,
  indicators,
  target,
  groupings = NULL,
  tooltips,
  aggregations = list(numerators = "sum", denominators = "sum", tooltips = "first",
    labels = "first"),
  title = NULL,
  funnel_settings = NULL,
  outlier_settings = NULL,
  canvas_settings = NULL,
  misc_settings = NULL,
  bar_settings = NULL,
  line_settings = NULL,
  x_axis_settings = NULL,
  y_axis_settings = NULL,
  tooltip_settings = NULL,
  width = NULL,
  height = NULL,
  elementId = NULL,
  return_objs = c("html_plot", "static_plot", "limits")
)
```

## Arguments

- data:

  A data frame containing the comparison population.

- keys:

  A vector or column name identifying the funnel groups.

- numerators:

  A numeric vector or column name containing numerators.

- denominators:

  A numeric vector or column name containing denominators.

- indicators:

  A vector or column name identifying indicators. A separate funnel
  calculation is performed for each value.

- target:

  A single value from `keys` to display.

- groupings:

  Optional vector or column name used to group indicator labels.

- tooltips:

  An optional vector or column name, or a list of them, providing
  additional tooltips. Each is labelled by its name in the list, or
  otherwise by the supplied expression.

- aggregations:

  A list of aggregation function names passed to
  [`funnel()`](https://aus-doh-safety-and-quality.github.io/controlcharts/reference/funnel.md).

- title:

  Optional chart title. See
  [`funnel()`](https://aus-doh-safety-and-quality.github.io/controlcharts/reference/funnel.md)
  for the supported format.

- funnel_settings, outlier_settings:

  Settings used for each indicator's funnel calculation.
  `outlier_settings$improvement_direction` may be conditionally
  formatted by indicator. Three-sigma detection is always enabled.

- canvas_settings, misc_settings, bar_settings, line_settings,
  x_axis_settings, y_axis_settings:

  Optional chart settings. See
  [`misc_default_settings()`](https://aus-doh-safety-and-quality.github.io/controlcharts/reference/misc_default_settings.md)
  for valid options.

- tooltip_settings:

  Optional tooltip settings.

- width, height:

  Optional chart dimensions in pixels.

- elementId:

  Optional HTML element ID for the chart.

- return_objs:

  Character vector containing any of `"html_plot"`, `"static_plot"`, and
  `"limits"`.

## Value

An object of class `controlchart`.

## Examples

``` r
comparison <- data.frame(
  organisation = rep(LETTERS[1:4], 2),
  indicator = rep(c("Measure A", "Measure B"), each = 4),
  numerator = c(8, 5, 4, 6, 2, 4, 5, 3),
  denominator = 10
)
misc(
  comparison,
  keys = organisation,
  numerators = numerator,
  denominators = denominator,
  indicators = indicator,
  target = "A",
  return_objs = "limits"
)
#>   indicator grouping group         z     score outlier numerator denominator
#> 1 Measure A              A  1.558790  1.558790    none         8          10
#> 2 Measure B              A -1.071406 -1.071406    none         2          10
#>   value      ll99 target     ul99
#> 1    80 13.216714   57.5 95.17326
#> 2    20  2.071914   35.0 81.14814
```
