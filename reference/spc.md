# Generate interactive SPC chart

Generate interactive SPC chart

## Usage

``` r
spc(
  data,
  keys,
  numerators,
  denominators,
  groupings,
  xbar_sds,
  tooltips,
  labels,
  aggregations = list(numerators = "sum", denominators = "sum", groupings = "first",
    xbar_sds = "first", tooltips = "first", labels = "first"),
  title = NULL,
  canvas_settings = NULL,
  spc_settings = NULL,
  outlier_settings = NULL,
  nhs_icon_settings = NULL,
  scatter_settings = NULL,
  line_settings = NULL,
  x_axis_settings = NULL,
  y_axis_settings = NULL,
  date_settings = NULL,
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

  A vector or column name representing the categories (x-axis) of the
  chart.

- numerators:

  A numeric vector or column name representing the numerators for each
  category.

- denominators:

  A numeric vector or column name representing the denominators for each
  category.

- groupings:

  A vector or column name representing the grouping for each category.

- xbar_sds:

  A numeric vector or column name representing the x-bar and standard
  deviation values for each category.

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

- title:

  Optional title to be added to the top of the chart. It can be a
  character string for the title text only, or a list with the following
  options:

  - `text`: Title text (default: NULL)

  - `font_size`: Font size of the title (default: "16px")

  - `font_weight`: Font weight of the title (default: "bold")

  - `font_family`: Font family of the title (default: "'Arial',
    sans-serif")

  - `x`: Horizontal (x) position of the title as a percentage (default:
    "50%")

  - `y`: Vertical (y) position of the title in pixels (default: 5)

  - `text_anchor`: Text anchor of the title (default: "middle")

  - `dominant_baseline`: Dominant baseline of the title (default:
    "hanging")

- canvas_settings:

  Optional list of settings for the canvas, see
  `spc_default_settings('canvas')` for valid options.

- spc_settings:

  Optional list of settings for the SPC chart, see
  `spc_default_settings('spc')` for valid options.

- outlier_settings:

  Optional list of settings for outliers, see
  `spc_default_settings('outliers')` for valid options.

- nhs_icon_settings:

  Optional list of settings for NHS icons, see
  `spc_default_settings('nhs_icons')` for valid options.

- scatter_settings:

  Optional list of settings for scatter points, see
  `spc_default_settings('scatter')` for valid options.

- line_settings:

  Optional list of settings for lines, see
  `spc_default_settings('lines')` for valid options.

- x_axis_settings:

  Optional list of settings for the x-axis, see
  `spc_default_settings('x_axis')` for valid options.

- y_axis_settings:

  Optional list of settings for the y-axis, see
  `spc_default_settings('y_axis')` for valid options.

- date_settings:

  Optional list of settings for dates, see
  `spc_default_settings('dates')` for valid options.

- label_settings:

  Optional list of settings for labels, see
  `spc_default_settings('labels')` for valid options.

- tooltip_settings:

  Optional list of settings for tooltips, see
  `spc_default_settings('tooltips')` for valid options.

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
