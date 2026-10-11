# Generate a multi-indicator sigma chart

Delegates to
[`funnel()`](https://aus-doh-safety-and-quality.github.io/controlcharts/reference/funnel.md)
with indicator columns and a selected group. Calculations, rendering,
settings, and interactivity use the native Funnel visual.

## Usage

``` r
misc(
  data,
  keys,
  numerators,
  denominators,
  indicators,
  target,
  ...,
  misc_settings = NULL
)
```

## Arguments

- data:

  A data frame containing the data for the chart.

- keys:

  A vector or column name representing the categories of the chart.

- numerators:

  A numeric vector or column name representing the numerators for each
  category.

- denominators:

  A numeric vector or column name representing the denominators for each
  category.

- indicators:

  A vector or list of vectors identifying indicators.

- target:

  A single value from `keys` to display.

- ...:

  Additional arguments passed to
  [`funnel()`](https://aus-doh-safety-and-quality.github.io/controlcharts/reference/funnel.md).

- misc_settings:

  Native MISC settings, with `group` supplied by `target`. See
  `funnel_default_settings("misc")` for valid options.

## Value

An object of class `controlchart`, as returned by
[`funnel()`](https://aus-doh-safety-and-quality.github.io/controlcharts/reference/funnel.md).

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
#>   indicator group         z     score three_sigma numerator denominator value
#> 1 Measure A     A  1.558790  1.558790        none         8          10    80
#> 2 Measure B     A -1.071406 -1.071406        none         2          10    20
#>   target alt_target      ll99     ll95     ll68     ul68     ul95     ul99
#> 1   57.5         NA 13.216714 27.39016 41.84130 72.42308 84.81980 95.17326
#> 2   35.0         NA  2.071914 10.08438 20.98212 50.48912 65.49569 81.14814
```
