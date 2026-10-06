# Shiny bindings for multi-indicator sigma charts

Shiny bindings for multi-indicator sigma charts

## Usage

``` r
miscOutput(outputId, width = "100%", height = "400px")

renderMisc(expr, env = parent.frame(), quoted = FALSE)
```

## Arguments

- outputId:

  Output variable to read from.

- width, height:

  Valid CSS dimensions.

- expr:

  An expression that generates a MISC chart.

- env:

  Environment in which to evaluate `expr`.

- quoted:

  Whether `expr` is quoted.

## Value

An interactive Shiny widget.
