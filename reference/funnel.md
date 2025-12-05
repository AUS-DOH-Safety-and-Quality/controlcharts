# Generate interactive Funnel chart

Generate interactive Funnel chart

## Usage

``` r
funnel(
  data,
  keys,
  numerators,
  denominators,
  tooltips,
  labels,
  aggregations = list(numerators = "sum", denominators = "sum", tooltips = "first",
    labels = "first"),
  canvas_settings = NULL,
  funnel_settings = NULL,
  outlier_settings = NULL,
  scatter_settings = NULL,
  line_settings = NULL,
  x_axis_settings = NULL,
  y_axis_settings = NULL,
  label_settings = NULL,
  tooltip_settings = NULL,
  width = NULL,
  height = NULL,
  elementId = NULL
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

- tooltips:

  A vector or column name representing the tooltips for each category.

- labels:

  A vector or column name representing the labels for each category.

- aggregations:

  A list of aggregation function names for each field if multiple values
  are provided for each key. Valid options are:

  - `"first"`: returns the first value

  - `"last"`: returns the last value

  - `"sum"`: returns the sum of values

  - `"mean"`: returns the mean of values

  - `"min"`: returns the minimum value

  - `"max"`: returns the maximum value

  - `"median"`: returns the median value

  - `"count"`: returns the count of values

- canvas_settings:

  Optional list of settings for the canvas, see
  `funnel_default_settings('canvas')` for valid options.

- funnel_settings:

  Optional list of settings for the Funnel chart, see
  `funnel_default_settings('funnel')` for valid options.

- outlier_settings:

  Optional list of settings for outliers, see
  `funnel_default_settings('outliers')` for valid options.

- scatter_settings:

  Optional list of settings for scatter points, see
  `funnel_default_settings('scatter')` for valid options.

- line_settings:

  Optional list of settings for lines, see
  `funnel_default_settings('lines')` for valid options.

- x_axis_settings:

  Optional list of settings for the x-axis, see
  `funnel_default_settings('x_axis')` for valid options.

- y_axis_settings:

  Optional list of settings for the y-axis, see
  `funnel_default_settings('y_axis')` for valid options.

- label_settings:

  Optional list of settings for labels, see
  `funnel_default_settings('labels')` for valid options.

- tooltip_settings:

  Optional list of settings for tooltips, see
  `funnel_default_settings('tooltips')` for valid options.

- width:

  Optional width of the chart in pixels. If NULL (default), the chart
  will fill the width of its container.

- height:

  Optional height of the chart in pixels. If NULL (default), the chart
  will fill the height of its container.

- elementId:

  Optional HTML element ID for the chart.

## Value

An object of class `controlchart` containing the interactive plot,
static plot, limits data frame, raw data, and a function to save the
plot.
