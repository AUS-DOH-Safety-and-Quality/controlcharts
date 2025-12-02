# Get default settings for SPC charts

Retrieve the default settings for SPC charts or a specific settings
group.

## Usage

``` r
spc_default_settings(group = NULL)
```

## Arguments

- group:

  Optional. A specific settings group to retrieve. If NULL, all settings
  groups are returned.

## Value

A list of default settings for SPC charts or the specified settings
group.

## Examples

``` r
#' # Get all default settings for SPC charts
spc_default_settings()
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
#> $spc
#> $spc$chart_type
#> [1] "i"
#> 
#> $spc$outliers_in_limits
#> [1] FALSE
#> 
#> $spc$multiplier
#> [1] 1
#> 
#> $spc$sig_figs
#> [1] 2
#> 
#> $spc$perc_labels
#> [1] "Automatic"
#> 
#> $spc$split_on_click
#> [1] FALSE
#> 
#> $spc$num_points_subset
#> NULL
#> 
#> $spc$subset_points_from
#> [1] "Start"
#> 
#> $spc$ttip_show_date
#> [1] TRUE
#> 
#> $spc$ttip_label_date
#> [1] "Automatic"
#> 
#> $spc$ttip_show_numerator
#> [1] TRUE
#> 
#> $spc$ttip_label_numerator
#> [1] "Numerator"
#> 
#> $spc$ttip_show_denominator
#> [1] TRUE
#> 
#> $spc$ttip_label_denominator
#> [1] "Denominator"
#> 
#> $spc$ttip_show_value
#> [1] TRUE
#> 
#> $spc$ttip_label_value
#> [1] "Automatic"
#> 
#> $spc$ll_truncate
#> NULL
#> 
#> $spc$ul_truncate
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
#> $outliers$astronomical
#> [1] FALSE
#> 
#> $outliers$astronomical_limit
#> [1] "3 Sigma"
#> 
#> $outliers$ast_colour_improvement
#> [1] "#00B0F0"
#> 
#> $outliers$ast_colour_deterioration
#> [1] "#E46C0A"
#> 
#> $outliers$ast_colour_neutral_low
#> [1] "#490092"
#> 
#> $outliers$ast_colour_neutral_high
#> [1] "#490092"
#> 
#> $outliers$shift
#> [1] FALSE
#> 
#> $outliers$shift_n
#> [1] 7
#> 
#> $outliers$shift_colour_improvement
#> [1] "#00B0F0"
#> 
#> $outliers$shift_colour_deterioration
#> [1] "#E46C0A"
#> 
#> $outliers$shift_colour_neutral_low
#> [1] "#490092"
#> 
#> $outliers$shift_colour_neutral_high
#> [1] "#490092"
#> 
#> $outliers$trend
#> [1] FALSE
#> 
#> $outliers$trend_n
#> [1] 5
#> 
#> $outliers$trend_colour_improvement
#> [1] "#00B0F0"
#> 
#> $outliers$trend_colour_deterioration
#> [1] "#E46C0A"
#> 
#> $outliers$trend_colour_neutral_low
#> [1] "#490092"
#> 
#> $outliers$trend_colour_neutral_high
#> [1] "#490092"
#> 
#> $outliers$two_in_three
#> [1] FALSE
#> 
#> $outliers$two_in_three_highlight_series
#> [1] FALSE
#> 
#> $outliers$two_in_three_limit
#> [1] "2 Sigma"
#> 
#> $outliers$twointhree_colour_improvement
#> [1] "#00B0F0"
#> 
#> $outliers$twointhree_colour_deterioration
#> [1] "#E46C0A"
#> 
#> $outliers$twointhree_colour_neutral_low
#> [1] "#490092"
#> 
#> $outliers$twointhree_colour_neutral_high
#> [1] "#490092"
#> 
#> 
#> $nhs_icons
#> $nhs_icons$show_variation_icons
#> [1] FALSE
#> 
#> $nhs_icons$flag_last_point
#> [1] TRUE
#> 
#> $nhs_icons$variation_icons_locations
#> [1] "Top Right"
#> 
#> $nhs_icons$variation_icons_scaling
#> [1] 1
#> 
#> $nhs_icons$show_assurance_icons
#> [1] FALSE
#> 
#> $nhs_icons$assurance_icons_locations
#> [1] "Top Right"
#> 
#> $nhs_icons$assurance_icons_scaling
#> [1] 1
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
#> 
#> $lines
#> $lines$show_main
#> [1] TRUE
#> 
#> $lines$width_main
#> [1] 1
#> 
#> $lines$type_main
#> [1] "10 0"
#> 
#> $lines$colour_main
#> [1] "#A6A6A6"
#> 
#> $lines$opacity_main
#> [1] 1
#> 
#> $lines$opacity_unselected_main
#> [1] 0.2
#> 
#> $lines$join_rebaselines_main
#> [1] FALSE
#> 
#> $lines$plot_label_show_main
#> [1] FALSE
#> 
#> $lines$plot_label_show_all_main
#> [1] FALSE
#> 
#> $lines$plot_label_show_n_main
#> [1] 1
#> 
#> $lines$plot_label_position_main
#> [1] "beside"
#> 
#> $lines$plot_label_vpad_main
#> [1] 0
#> 
#> $lines$plot_label_hpad_main
#> [1] 10
#> 
#> $lines$plot_label_font_main
#> [1] "'Arial', sans-serif"
#> 
#> $lines$plot_label_size_main
#> [1] 10
#> 
#> $lines$plot_label_colour_main
#> [1] "#000000"
#> 
#> $lines$plot_label_prefix_main
#> [1] ""
#> 
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
#> $lines$join_rebaselines_target
#> [1] FALSE
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
#> $lines$plot_label_show_all_target
#> [1] FALSE
#> 
#> $lines$plot_label_show_n_target
#> [1] 1
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
#> $lines$multiplier_alt_target
#> [1] FALSE
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
#> $lines$plot_label_show_all_alt_target
#> [1] FALSE
#> 
#> $lines$plot_label_show_n_alt_target
#> [1] 1
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
#> $lines$join_rebaselines_68
#> [1] FALSE
#> 
#> $lines$ttip_show_68
#> [1] TRUE
#> 
#> $lines$ttip_label_68
#> [1] "68% Limit"
#> 
#> $lines$ttip_label_68_prefix_lower
#> [1] "Lower "
#> 
#> $lines$ttip_label_68_prefix_upper
#> [1] "Upper "
#> 
#> $lines$plot_label_show_68
#> [1] FALSE
#> 
#> $lines$plot_label_show_all_68
#> [1] FALSE
#> 
#> $lines$plot_label_show_n_68
#> [1] 1
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
#> $lines$join_rebaselines_95
#> [1] FALSE
#> 
#> $lines$ttip_show_95
#> [1] TRUE
#> 
#> $lines$ttip_label_95
#> [1] "95% Limit"
#> 
#> $lines$ttip_label_95_prefix_lower
#> [1] "Lower "
#> 
#> $lines$ttip_label_95_prefix_upper
#> [1] "Upper "
#> 
#> $lines$plot_label_show_95
#> [1] FALSE
#> 
#> $lines$plot_label_show_all_95
#> [1] FALSE
#> 
#> $lines$plot_label_show_n_95
#> [1] 1
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
#> $lines$join_rebaselines_99
#> [1] FALSE
#> 
#> $lines$ttip_show_99
#> [1] TRUE
#> 
#> $lines$ttip_label_99
#> [1] "99% Limit"
#> 
#> $lines$ttip_label_99_prefix_lower
#> [1] "Lower "
#> 
#> $lines$ttip_label_99_prefix_upper
#> [1] "Upper "
#> 
#> $lines$plot_label_show_99
#> [1] FALSE
#> 
#> $lines$plot_label_show_all_99
#> [1] FALSE
#> 
#> $lines$plot_label_show_n_99
#> [1] 1
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
#> $lines$show_specification
#> [1] FALSE
#> 
#> $lines$specification_upper
#> NULL
#> 
#> $lines$specification_lower
#> NULL
#> 
#> $lines$multiplier_specification
#> [1] FALSE
#> 
#> $lines$width_specification
#> [1] 2
#> 
#> $lines$type_specification
#> [1] "10 10"
#> 
#> $lines$colour_specification
#> [1] "#6495ED"
#> 
#> $lines$opacity_specification
#> [1] 1
#> 
#> $lines$opacity_unselected_specification
#> [1] 0.2
#> 
#> $lines$join_rebaselines_specification
#> [1] FALSE
#> 
#> $lines$ttip_show_specification
#> [1] TRUE
#> 
#> $lines$ttip_label_specification
#> [1] "specification Limit"
#> 
#> $lines$ttip_label_specification_prefix_lower
#> [1] "Lower "
#> 
#> $lines$ttip_label_specification_prefix_upper
#> [1] "Upper "
#> 
#> $lines$plot_label_show_specification
#> [1] FALSE
#> 
#> $lines$plot_label_show_all_specification
#> [1] FALSE
#> 
#> $lines$plot_label_show_n_specification
#> [1] 1
#> 
#> $lines$plot_label_position_specification
#> [1] "beside"
#> 
#> $lines$plot_label_vpad_specification
#> [1] 0
#> 
#> $lines$plot_label_hpad_specification
#> [1] 10
#> 
#> $lines$plot_label_font_specification
#> [1] "'Arial', sans-serif"
#> 
#> $lines$plot_label_size_specification
#> [1] 10
#> 
#> $lines$plot_label_colour_specification
#> [1] "#000000"
#> 
#> $lines$plot_label_prefix_specification
#> [1] ""
#> 
#> $lines$show_trend
#> [1] FALSE
#> 
#> $lines$width_trend
#> [1] 1.5
#> 
#> $lines$type_trend
#> [1] "10 0"
#> 
#> $lines$colour_trend
#> [1] "#A6A6A6"
#> 
#> $lines$opacity_trend
#> [1] 1
#> 
#> $lines$opacity_unselected_trend
#> [1] 0.2
#> 
#> $lines$join_rebaselines_trend
#> [1] FALSE
#> 
#> $lines$ttip_show_trend
#> [1] TRUE
#> 
#> $lines$ttip_label_trend
#> [1] "Centerline"
#> 
#> $lines$plot_label_show_trend
#> [1] FALSE
#> 
#> $lines$plot_label_show_all_trend
#> [1] FALSE
#> 
#> $lines$plot_label_show_n_trend
#> [1] 1
#> 
#> $lines$plot_label_position_trend
#> [1] "beside"
#> 
#> $lines$plot_label_vpad_trend
#> [1] 0
#> 
#> $lines$plot_label_hpad_trend
#> [1] 10
#> 
#> $lines$plot_label_font_trend
#> [1] "'Arial', sans-serif"
#> 
#> $lines$plot_label_size_trend
#> [1] 10
#> 
#> $lines$plot_label_colour_trend
#> [1] "#000000"
#> 
#> $lines$plot_label_prefix_trend
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
#> [1] -35
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
#> $y_axis$limit_multiplier
#> [1] 1.5
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
#> $dates
#> $dates$date_format_day
#> [1] "DD"
#> 
#> $dates$date_format_month
#> [1] "MM"
#> 
#> $dates$date_format_year
#> [1] "YYYY"
#> 
#> $dates$date_format_delim
#> [1] "/"
#> 
#> $dates$date_format_locale
#> [1] "en-GB"
#> 
#> 
#> $summary_table
#> $summary_table$show_table
#> [1] FALSE
#> 
#> $summary_table$table_variation_filter
#> [1] "all"
#> 
#> $summary_table$table_assurance_filter
#> [1] "all"
#> 
#> $summary_table$table_text_overflow
#> [1] "ellipsis"
#> 
#> $summary_table$table_opacity
#> [1] 1
#> 
#> $summary_table$table_opacity_selected
#> [1] 1
#> 
#> $summary_table$table_opacity_unselected
#> [1] 0.2
#> 
#> $summary_table$table_outer_border_style
#> [1] "solid"
#> 
#> $summary_table$table_outer_border_width
#> [1] 1
#> 
#> $summary_table$table_outer_border_colour
#> [1] "#000000"
#> 
#> $summary_table$table_outer_border_top
#> [1] TRUE
#> 
#> $summary_table$table_outer_border_bottom
#> [1] TRUE
#> 
#> $summary_table$table_outer_border_left
#> [1] TRUE
#> 
#> $summary_table$table_outer_border_right
#> [1] TRUE
#> 
#> $summary_table$table_header_font
#> [1] "'Arial', sans-serif"
#> 
#> $summary_table$table_header_size
#> [1] 10
#> 
#> $summary_table$table_header_text_align
#> [1] "center"
#> 
#> $summary_table$table_header_font_weight
#> [1] "normal"
#> 
#> $summary_table$table_header_text_transform
#> [1] "uppercase"
#> 
#> $summary_table$table_header_text_padding
#> [1] 1
#> 
#> $summary_table$table_header_colour
#> [1] "#000000"
#> 
#> $summary_table$table_header_bg_colour
#> [1] "#D3D3D3"
#> 
#> $summary_table$table_header_border_style
#> [1] "solid"
#> 
#> $summary_table$table_header_border_width
#> [1] 1
#> 
#> $summary_table$table_header_border_colour
#> [1] "#000000"
#> 
#> $summary_table$table_header_border_bottom
#> [1] TRUE
#> 
#> $summary_table$table_header_border_inner
#> [1] TRUE
#> 
#> $summary_table$table_body_font
#> [1] "'Arial', sans-serif"
#> 
#> $summary_table$table_body_size
#> [1] 10
#> 
#> $summary_table$table_body_text_align
#> [1] "center"
#> 
#> $summary_table$table_body_font_weight
#> [1] "normal"
#> 
#> $summary_table$table_body_text_transform
#> [1] "uppercase"
#> 
#> $summary_table$table_body_text_padding
#> [1] 1
#> 
#> $summary_table$table_body_colour
#> [1] "#000000"
#> 
#> $summary_table$table_body_bg_colour
#> [1] "#FFFFFF"
#> 
#> $summary_table$table_body_border_style
#> [1] "solid"
#> 
#> $summary_table$table_body_border_width
#> [1] 1
#> 
#> $summary_table$table_body_border_colour
#> [1] "#000000"
#> 
#> $summary_table$table_body_border_top_bottom
#> [1] TRUE
#> 
#> $summary_table$table_body_border_left_right
#> [1] TRUE
#> 
#> 
#> $download_options
#> $download_options$show_button
#> [1] FALSE
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
spc_default_settings("x_axis")
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
#> [1] -35
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
