# Get default settings for Funnel charts Retrieve the default settings for Funnel charts or a specific settings group.

Get default settings for Funnel charts Retrieve the default settings for
Funnel charts or a specific settings group.

## Usage

``` r
funnel_default_settings(group = NULL)
```

## Arguments

- group:

  Optional. A specific settings group to retrieve. If NULL, all settings
  groups are returned.

## Value

A list of default settings for Funnel charts or the specified settings
group.

## Examples

``` r
#' # Get all default settings for Funnel charts
funnel_default_settings()
#> $canvas
#> $canvas$show_errors
#> [1] TRUE
#> 
#> $canvas$lower_padding
#> [1] 10
#> 
#> $canvas$upper_padding
#> [1] 10
#> 
#> $canvas$left_padding
#> [1] 10
#> 
#> $canvas$right_padding
#> [1] 10
#> 
#> 
#> $funnel
#> $funnel$chart_type
#> [1] "PR"
#> 
#> $funnel$od_adjust
#> [1] "no"
#> 
#> $funnel$multiplier
#> [1] 1
#> 
#> $funnel$sig_figs
#> [1] 2
#> 
#> $funnel$perc_labels
#> [1] "Automatic"
#> 
#> $funnel$transformation
#> [1] "none"
#> 
#> $funnel$ttip_show_group
#> [1] TRUE
#> 
#> $funnel$ttip_label_group
#> [1] "Group"
#> 
#> $funnel$ttip_show_numerator
#> [1] TRUE
#> 
#> $funnel$ttip_label_numerator
#> [1] "Numerator"
#> 
#> $funnel$ttip_show_denominator
#> [1] TRUE
#> 
#> $funnel$ttip_label_denominator
#> [1] "Denominator"
#> 
#> $funnel$ttip_show_value
#> [1] TRUE
#> 
#> $funnel$ttip_label_value
#> [1] "Automatic"
#> 
#> $funnel$ll_truncate
#> NULL
#> 
#> $funnel$ul_truncate
#> NULL
#> 
#> 
#> $outliers
#> $outliers$process_flag_type
#> [1] "both"
#> 
#> $outliers$improvement_direction
#> [1] "increase"
#> 
#> $outliers$three_sigma
#> [1] FALSE
#> 
#> $outliers$three_sigma_colour_improvement
#> [1] "#00B0F0"
#> 
#> $outliers$three_sigma_colour_deterioration
#> [1] "#E46C0A"
#> 
#> $outliers$three_sigma_colour_neutral_low
#> [1] "#490092"
#> 
#> $outliers$three_sigma_colour_neutral_high
#> [1] "#490092"
#> 
#> $outliers$two_sigma
#> [1] FALSE
#> 
#> $outliers$two_sigma_colour_improvement
#> [1] "#00B0F0"
#> 
#> $outliers$two_sigma_colour_deterioration
#> [1] "#E46C0A"
#> 
#> $outliers$two_sigma_colour_neutral_low
#> [1] "#490092"
#> 
#> $outliers$two_sigma_colour_neutral_high
#> [1] "#490092"
#> 
#> 
#> $scatter
#> $scatter$shape
#> [1] "Circle"
#> 
#> $scatter$size
#> [1] 2.5
#> 
#> $scatter$colour
#> [1] "#A6A6A6"
#> 
#> $scatter$colour_outline
#> [1] "#A6A6A6"
#> 
#> $scatter$width_outline
#> [1] 1
#> 
#> $scatter$opacity
#> [1] 1
#> 
#> $scatter$opacity_selected
#> [1] 1
#> 
#> $scatter$opacity_unselected
#> [1] 0.2
#> 
#> $scatter$use_group_text
#> [1] FALSE
#> 
#> $scatter$scatter_text_font
#> [1] "'Arial', sans-serif"
#> 
#> $scatter$scatter_text_size
#> [1] 10
#> 
#> $scatter$scatter_text_colour
#> [1] "#000000"
#> 
#> $scatter$scatter_text_opacity
#> [1] 1
#> 
#> $scatter$scatter_text_opacity_selected
#> [1] 1
#> 
#> $scatter$scatter_text_opacity_unselected
#> [1] 0.2
#> 
#> 
#> $lines
#> $lines$show_target
#> [1] TRUE
#> 
#> $lines$width_target
#> [1] 1.5
#> 
#> $lines$type_target
#> [1] "10 0"
#> 
#> $lines$colour_target
#> [1] "#000000"
#> 
#> $lines$opacity_target
#> [1] 1
#> 
#> $lines$opacity_unselected_target
#> [1] 0.2
#> 
#> $lines$ttip_show_target
#> [1] TRUE
#> 
#> $lines$ttip_label_target
#> [1] "Centerline"
#> 
#> $lines$plot_label_show_target
#> [1] FALSE
#> 
#> $lines$plot_label_position_target
#> [1] "beside"
#> 
#> $lines$plot_label_vpad_target
#> [1] 0
#> 
#> $lines$plot_label_hpad_target
#> [1] 10
#> 
#> $lines$plot_label_font_target
#> [1] "'Arial', sans-serif"
#> 
#> $lines$plot_label_size_target
#> [1] 10
#> 
#> $lines$plot_label_colour_target
#> [1] "#000000"
#> 
#> $lines$plot_label_prefix_target
#> [1] ""
#> 
#> $lines$show_alt_target
#> [1] FALSE
#> 
#> $lines$alt_target
#> NULL
#> 
#> $lines$width_alt_target
#> [1] 1.5
#> 
#> $lines$type_alt_target
#> [1] "10 0"
#> 
#> $lines$colour_alt_target
#> [1] "#000000"
#> 
#> $lines$opacity_alt_target
#> [1] 1
#> 
#> $lines$opacity_unselected_alt_target
#> [1] 0.2
#> 
#> $lines$join_rebaselines_alt_target
#> [1] FALSE
#> 
#> $lines$ttip_show_alt_target
#> [1] TRUE
#> 
#> $lines$ttip_label_alt_target
#> [1] "Alt. Target"
#> 
#> $lines$plot_label_show_alt_target
#> [1] FALSE
#> 
#> $lines$plot_label_position_alt_target
#> [1] "beside"
#> 
#> $lines$plot_label_vpad_alt_target
#> [1] 0
#> 
#> $lines$plot_label_hpad_alt_target
#> [1] 10
#> 
#> $lines$plot_label_font_alt_target
#> [1] "'Arial', sans-serif"
#> 
#> $lines$plot_label_size_alt_target
#> [1] 10
#> 
#> $lines$plot_label_colour_alt_target
#> [1] "#000000"
#> 
#> $lines$plot_label_prefix_alt_target
#> [1] ""
#> 
#> $lines$show_68
#> [1] FALSE
#> 
#> $lines$width_68
#> [1] 2
#> 
#> $lines$type_68
#> [1] "2 5"
#> 
#> $lines$colour_68
#> [1] "#6495ED"
#> 
#> $lines$opacity_68
#> [1] 1
#> 
#> $lines$opacity_unselected_68
#> [1] 0.2
#> 
#> $lines$ttip_show_68
#> [1] TRUE
#> 
#> $lines$ttip_label_68
#> [1] "68% Limit"
#> 
#> $lines$plot_label_show_68
#> [1] FALSE
#> 
#> $lines$plot_label_position_68
#> [1] "beside"
#> 
#> $lines$plot_label_vpad_68
#> [1] 0
#> 
#> $lines$plot_label_hpad_68
#> [1] 10
#> 
#> $lines$plot_label_font_68
#> [1] "'Arial', sans-serif"
#> 
#> $lines$plot_label_size_68
#> [1] 10
#> 
#> $lines$plot_label_colour_68
#> [1] "#000000"
#> 
#> $lines$plot_label_prefix_68
#> [1] ""
#> 
#> $lines$show_95
#> [1] TRUE
#> 
#> $lines$width_95
#> [1] 2
#> 
#> $lines$type_95
#> [1] "2 5"
#> 
#> $lines$colour_95
#> [1] "#6495ED"
#> 
#> $lines$opacity_95
#> [1] 1
#> 
#> $lines$opacity_unselected_95
#> [1] 0.2
#> 
#> $lines$ttip_show_95
#> [1] TRUE
#> 
#> $lines$ttip_label_95
#> [1] "95% Limit"
#> 
#> $lines$plot_label_show_95
#> [1] FALSE
#> 
#> $lines$plot_label_position_95
#> [1] "beside"
#> 
#> $lines$plot_label_vpad_95
#> [1] 0
#> 
#> $lines$plot_label_hpad_95
#> [1] 10
#> 
#> $lines$plot_label_font_95
#> [1] "'Arial', sans-serif"
#> 
#> $lines$plot_label_size_95
#> [1] 10
#> 
#> $lines$plot_label_colour_95
#> [1] "#000000"
#> 
#> $lines$plot_label_prefix_95
#> [1] ""
#> 
#> $lines$show_99
#> [1] TRUE
#> 
#> $lines$width_99
#> [1] 2
#> 
#> $lines$type_99
#> [1] "10 10"
#> 
#> $lines$colour_99
#> [1] "#6495ED"
#> 
#> $lines$opacity_99
#> [1] 1
#> 
#> $lines$opacity_unselected_99
#> [1] 0.2
#> 
#> $lines$ttip_show_99
#> [1] TRUE
#> 
#> $lines$ttip_label_99
#> [1] "99% Limit"
#> 
#> $lines$plot_label_show_99
#> [1] FALSE
#> 
#> $lines$plot_label_position_99
#> [1] "beside"
#> 
#> $lines$plot_label_vpad_99
#> [1] 0
#> 
#> $lines$plot_label_hpad_99
#> [1] 10
#> 
#> $lines$plot_label_font_99
#> [1] "'Arial', sans-serif"
#> 
#> $lines$plot_label_size_99
#> [1] 10
#> 
#> $lines$plot_label_colour_99
#> [1] "#000000"
#> 
#> $lines$plot_label_prefix_99
#> [1] ""
#> 
#> 
#> $x_axis
#> $x_axis$xlimit_colour
#> [1] "#000000"
#> 
#> $x_axis$xlimit_l
#> NULL
#> 
#> $x_axis$xlimit_u
#> NULL
#> 
#> $x_axis$xlimit_ticks
#> [1] TRUE
#> 
#> $x_axis$xlimit_tick_count
#> [1] 10
#> 
#> $x_axis$xlimit_tick_font
#> [1] "'Arial', sans-serif"
#> 
#> $x_axis$xlimit_tick_size
#> [1] 10
#> 
#> $x_axis$xlimit_tick_colour
#> [1] "#000000"
#> 
#> $x_axis$xlimit_tick_rotation
#> [1] 0
#> 
#> $x_axis$xlimit_label
#> NULL
#> 
#> $x_axis$xlimit_label_font
#> [1] "'Arial', sans-serif"
#> 
#> $x_axis$xlimit_label_size
#> [1] 10
#> 
#> $x_axis$xlimit_label_colour
#> [1] "#000000"
#> 
#> 
#> $y_axis
#> $y_axis$ylimit_colour
#> [1] "#000000"
#> 
#> $y_axis$ylimit_sig_figs
#> NULL
#> 
#> $y_axis$ylimit_l
#> NULL
#> 
#> $y_axis$ylimit_u
#> NULL
#> 
#> $y_axis$ylimit_ticks
#> [1] TRUE
#> 
#> $y_axis$ylimit_tick_count
#> [1] 10
#> 
#> $y_axis$ylimit_tick_font
#> [1] "'Arial', sans-serif"
#> 
#> $y_axis$ylimit_tick_size
#> [1] 10
#> 
#> $y_axis$ylimit_tick_colour
#> [1] "#000000"
#> 
#> $y_axis$ylimit_tick_rotation
#> [1] 0
#> 
#> $y_axis$ylimit_label
#> NULL
#> 
#> $y_axis$ylimit_label_font
#> [1] "'Arial', sans-serif"
#> 
#> $y_axis$ylimit_label_size
#> [1] 10
#> 
#> $y_axis$ylimit_label_colour
#> [1] "#000000"
#> 
#> 
#> $labels
#> $labels$show_labels
#> [1] TRUE
#> 
#> $labels$label_position
#> [1] "top"
#> 
#> $labels$label_y_offset
#> [1] 20
#> 
#> $labels$label_line_offset
#> [1] 5
#> 
#> $labels$label_angle_offset
#> [1] 0
#> 
#> $labels$label_font
#> [1] "'Arial', sans-serif"
#> 
#> $labels$label_size
#> [1] 10
#> 
#> $labels$label_colour
#> [1] "#000000"
#> 
#> $labels$label_line_colour
#> [1] "#000000"
#> 
#> $labels$label_line_width
#> [1] 1
#> 
#> $labels$label_line_type
#> [1] "10 0"
#> 
#> $labels$label_line_max_length
#> [1] 1000
#> 
#> $labels$label_marker_show
#> [1] TRUE
#> 
#> $labels$label_marker_offset
#> [1] 5
#> 
#> $labels$label_marker_size
#> [1] 3
#> 
#> $labels$label_marker_colour
#> [1] "#000000"
#> 
#> $labels$label_marker_outline_colour
#> [1] "#000000"
#> 
#> 
# # Get default settings for a specific group
funnel_default_settings("x_axis")
#> $xlimit_colour
#> [1] "#000000"
#> 
#> $xlimit_l
#> NULL
#> 
#> $xlimit_u
#> NULL
#> 
#> $xlimit_ticks
#> [1] TRUE
#> 
#> $xlimit_tick_count
#> [1] 10
#> 
#> $xlimit_tick_font
#> [1] "'Arial', sans-serif"
#> 
#> $xlimit_tick_size
#> [1] 10
#> 
#> $xlimit_tick_colour
#> [1] "#000000"
#> 
#> $xlimit_tick_rotation
#> [1] 0
#> 
#> $xlimit_label
#> NULL
#> 
#> $xlimit_label_font
#> [1] "'Arial', sans-serif"
#> 
#> $xlimit_label_size
#> [1] 10
#> 
#> $xlimit_label_colour
#> [1] "#000000"
#> 
```
