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

  A vector or list of vectors identifying indicators. Factor indicators
  are ordered by their levels, and others by value.

- target:

  A single value from `keys` to display. Numeric targets match numeric
  keys by value.

- ...:

  Additional arguments passed to
  [`funnel()`](https://aus-doh-safety-and-quality.github.io/controlcharts/reference/funnel.md).

- misc_settings:

  Native MISC settings, with `group` supplied by `target`. See
  `funnel_default_settings("misc")` for valid options.

## Value

An object of class `controlchart`, as returned by
[`funnel()`](https://aus-doh-safety-and-quality.github.io/controlcharts/reference/funnel.md).
The plot displays `target`; limits include every group and separate
indicator columns. Request `"limit_lines"` in `return_objs` for each
indicator's curves.

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
#>   indicator denominator organisation numerator value          z      score
#> 1 Measure A          10            A         8    80  1.5587905  1.5587905
#> 2 Measure A          10            B         5    50 -0.4761387 -0.4761387
#> 3 Measure A          10            C         4    40 -1.1128883 -1.1128883
#> 4 Measure A          10            D         6    60  0.1606110  0.1606110
#> 5 Measure B          10            A         2    20 -1.0714064 -1.0714064
#> 6 Measure B          10            B         4    40  0.3267731  0.3267731
#> 7 Measure B          10            C         5    50  0.9635228  0.9635228
#> 8 Measure B          10            D         3    30 -0.3378078 -0.3378078
#>   three_sigma target      ll99     ll95     ll68     ul68     ul95     ul99 key
#> 1        none   57.5 13.216714 27.39016 41.84130 72.42308 84.81980 95.17326   A
#> 2        none   57.5 13.216714 27.39016 41.84130 72.42308 84.81980 95.17326   B
#> 3        none   57.5 13.216714 27.39016 41.84130 72.42308 84.81980 95.17326   C
#> 4        none   57.5 13.216714 27.39016 41.84130 72.42308 84.81980 95.17326   D
#> 5        none   35.0  2.071914 10.08438 20.98212 50.48912 65.49569 81.14814   A
#> 6        none   35.0  2.071914 10.08438 20.98212 50.48912 65.49569 81.14814   B
#> 7        none   35.0  2.071914 10.08438 20.98212 50.48912 65.49569 81.14814   C
#> 8        none   35.0  2.071914 10.08438 20.98212 50.48912 65.49569 81.14814   D
```
