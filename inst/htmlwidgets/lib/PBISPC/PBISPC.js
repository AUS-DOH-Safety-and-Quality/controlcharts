var spc = (function (exports, settings, rendering, powerbi, math, data, spc) {
    'use strict';

    const spcSettings = {
        description: "SPC Settings",
        displayName: "Data Settings",
        settingsGroups: {
            "all": {
                chart_type: settings.dropdownOption("Chart Type", "Type of control chart; see Chart Types for the inputs each needs.", "i", ["run", "i", "i_m", "i_mm", "mr", "p", "pp", "u", "up", "c", "xbar", "s", "g", "t"], "none", [
                    "run - Run Chart",
                    "i - Individual Measurements",
                    "i_m - Individual Measurements: Median centerline",
                    "i_mm - Individual Measurements: Median centerline, Median MR Limits",
                    "mr - Moving Range of Individual Measurements",
                    "p - Proportions",
                    "p prime - Proportions: Large-Sample Corrected",
                    "u - Rates",
                    "u prime - Rates: Large-Sample Correction",
                    "c - Counts",
                    "xbar - Sample Means",
                    "s - Sample SDs",
                    "g - Number of Non-Events Between Events",
                    "t - Time Between Events"
                ]),
                outliers_in_limits: settings.toggleOption("Keep Outliers in Limit Calcs.", "Keeps unusually large moving ranges when calculating limits; off drops them first. "
                    + "Applies to i, i_m, i_mm, t, p prime and u prime charts.", false),
                ...settings.scalingOptions(),
                split_on_click: settings.toggleOption("Split Limits on Click", "Clicking a point ends a limit period there; clicking it again removes the split. "
                    + "Splits stay when this is turned off, and are ignored when Grouping (Summary Table) is used.", false),
                num_points_subset: settings.numberOption("Subset Number of Points for Limit Calculations", "Calculates the first period's limits from only this many points; blank or out of range uses them all.", undefined, { integer: true }),
                subset_points_from: settings.dropdownOption("Subset Points From", "Whether the subset is taken from the start or end of the period.", "Start", ["Start", "End"]),
                subset_rebaselines: settings.toggleOption("Subset Points After Each Re-Baseline", "Applies the subset to every rebaseline period, not only the first.", false),
                ttip_show_date: settings.toggleOption("Show Date in Tooltip", "Shows the date, or the point number for g and t charts, in the tooltip.", true),
                ttip_label_date: settings.textOption("Date Tooltip Label", "Name for the date in the tooltip; Automatic uses Date, or Event for g and t charts.", "Automatic"),
                ...settings.valueTooltipOptions(),
                ...settings.limitTruncationOptions()
            }
        }
    };

    const outliersSettings = {
        description: "Outlier Settings",
        displayName: "Outlier Settings",
        settingsGroups: {
            "General": settings.flagDirectionOptions(),
            "Astronomical Points": {
                astronomical: settings.toggleOption("Highlight Astronomical Points", "Flags points beyond the chosen limit.", false),
                astronomical_limit: settings.dropdownOption("Limit for Astronomical Points", "Limit a point must be beyond. Specification needs the specification lines shown.", "3 Sigma", ["1 Sigma", "2 Sigma", "3 Sigma", "Specification"]),
                ast_colour_improvement: settings.colourOption("Imp. Ast. Colour", "Colour for astronomical points that are an improvement.", "improvement"),
                ast_colour_deterioration: settings.colourOption("Det. Ast. Colour", "Colour for astronomical points that are a deterioration.", "deterioration"),
                ast_colour_neutral_low: settings.colourOption("Neutral (Low) Ast. Colour", "Colour for points beyond the lower limit when the improvement direction is neutral.", "neutral_low"),
                ast_colour_neutral_high: settings.colourOption("Neutral (High) Ast. Colour", "Colour for points beyond the upper limit when the improvement direction is neutral.", "neutral_high")
            },
            "Shifts": {
                shift: settings.toggleOption("Highlight Shifts", "Flags runs of points on one side of the centreline.", false),
                shift_n: settings.numberOption("Shift Points", "Points needed for a shift; points on the centreline neither count nor break it.", 7, { min: 1, integer: true }),
                shift_colour_improvement: settings.colourOption("Imp. Shift Colour", "Colour for shifts that are an improvement.", "improvement"),
                shift_colour_deterioration: settings.colourOption("Det. Shift Colour", "Colour for shifts that are a deterioration.", "deterioration"),
                shift_colour_neutral_low: settings.colourOption("Neutral (Low) Shift Colour", "Colour for shifts below the centreline when the improvement direction is neutral.", "neutral_low"),
                shift_colour_neutral_high: settings.colourOption("Neutral (High) Shift Colour", "Colour for shifts above the centreline when the improvement direction is neutral.", "neutral_high")
            },
            "Trends": {
                trend: settings.toggleOption("Highlight Trends", "Flags runs of steadily rising or falling points.", false),
                trend_n: settings.numberOption("Trend Points", "Points needed for a trend, including its first; repeated values count once.", 5, { min: 2, integer: true }),
                trend_colour_improvement: settings.colourOption("Imp. Trend Colour", "Colour for trends that are an improvement.", "improvement"),
                trend_colour_deterioration: settings.colourOption("Det. Trend Colour", "Colour for trends that are a deterioration.", "deterioration"),
                trend_colour_neutral_low: settings.colourOption("Neutral (Low) Trend Colour", "Colour for falling trends when the improvement direction is neutral.", "neutral_low"),
                trend_colour_neutral_high: settings.colourOption("Neutral (High) Trend Colour", "Colour for rising trends when the improvement direction is neutral.", "neutral_high")
            },
            "Two-In-Three": {
                two_in_three: settings.toggleOption("Highlight Two-in-Three", "Flags two of three consecutive points beyond the same warning limit.", false),
                two_in_three_highlight_series: settings.toggleOption("Highlight all in Pattern", "Also flags the third point in the window, unless it is beyond the opposite limit.", false),
                two_in_three_limit: settings.dropdownOption("Warning Limit for Two-in-Three", "Limit the points must be beyond. Specification needs the specification lines shown.", "2 Sigma", ["1 Sigma", "2 Sigma", "3 Sigma", "Specification"]),
                twointhree_colour_improvement: settings.colourOption("Imp. Two-in-Three Colour", "Colour for two-in-three points that are an improvement.", "improvement"),
                twointhree_colour_deterioration: settings.colourOption("Det. Two-in-Three Colour", "Colour for two-in-three points that are a deterioration.", "deterioration"),
                twointhree_colour_neutral_low: settings.colourOption("Neutral (Low) Two-in-Three Colour", "Colour for two-in-three patterns at the lower limit when the improvement direction is neutral.", "neutral_low"),
                twointhree_colour_neutral_high: settings.colourOption("Neutral (High) Two-in-Three Colour", "Colour for two-in-three patterns at the upper limit when the improvement direction is neutral.", "neutral_high")
            }
        }
    };

    const iconLocations = ["Top Right", "Bottom Right", "Top Left", "Bottom Left"];
    const nhsIconsSettings = {
        description: "NHS Icons Settings",
        displayName: "NHS Icons Settings",
        settingsGroups: {
            "all": {
                show_variation_icons: settings.toggleOption("Show Variation Icons", "Draws the NHS variation icons for the flagged points, or adds them as a summary table column.", false),
                flag_last_point: settings.toggleOption("Flag Only Last Point", "Bases the variation icons on the last point only; off uses every point.", true),
                variation_icons_locations: settings.dropdownOption("Variation Icon Locations", "Corner of the chart for the variation icons.", "Top Right", iconLocations),
                variation_icons_scaling: settings.numberOption("Scale Variation Icon Size", "Multiplies the size of the variation icons.", 1, { min: 0 }),
                show_assurance_icons: settings.toggleOption("Show Assurance Icons", "Draws the NHS assurance icon, comparing the alt. target with the last point's three-sigma limits. "
                    + "Needs the alt. target line and an increase or decrease improvement direction.", false),
                assurance_icons_locations: settings.dropdownOption("Assurance Icon Locations", "Corner of the chart for the assurance icon.", "Top Right", iconLocations),
                assurance_icons_scaling: settings.numberOption("Scale Assurance Icon Size", "Multiplies the size of the assurance icon.", 1, { min: 0 })
            }
        }
    };

    const scatterSettings = {
        description: "Scatter Settings",
        displayName: "Scatter Settings",
        settingsGroups: {
            "all": {
                show_dots: settings.toggleOption("Show Scatter", "Draws the points.", true),
                ...settings.dotOptions()
            }
        }
    };

    const linesSettings = {
        description: "Line Settings",
        displayName: "Line Settings",
        settingsGroups: {
            "Main": settings.createLineGroup("main", {
                showLabel: "Show Main Line",
                showDescription: "Draws the line joining the points.",
                showDefault: true,
                namePrefix: "Main ",
                width: 1,
                type: "10 0",
                colour: "common_cause",
                rebaselines: true
            }),
            "Target": settings.createLineGroup("target", {
                showLabel: "Show Target",
                showDescription: "Draws the centreline.",
                showDefault: true,
                width: 1.5,
                type: "10 0",
                colour: "standard",
                rebaselines: true,
                tooltipLabel: "Centerline"
            }),
            "Alt. Target": settings.createLineGroup("alt_target", {
                showLabel: "Show Alt. Target Line",
                showDescription: "Draws a line at the Additional Target Value; the assurance icon needs it.",
                showDefault: false,
                width: 1.5,
                type: "10 0",
                colour: "standard",
                rebaselines: true,
                tooltipLabel: "Alt. Target"
            }, {
                alt_target: settings.numberOption("Additional Target Value:", "Value of the target line, as a plotted value unless the multiplier is applied.", undefined),
                multiplier_alt_target: settings.toggleOption("Apply Multiplier to Alt. Target", "Multiplies the target by the Multiplier, for targets entered as raw proportions or rates.", false)
            }),
            "68% Limits": settings.createLineGroup("68", {
                showLabel: "Show 68% Lines",
                showDescription: "Draws the one-sigma lines.",
                showDefault: false,
                width: 2,
                type: "2 5",
                colour: "limits",
                rebaselines: true,
                tooltipLabel: "68% Limit",
                tooltipPrefixes: true
            }),
            "95% Limits": settings.createLineGroup("95", {
                showLabel: "Show 95% Lines",
                showDescription: "Draws the two-sigma lines.",
                showDefault: true,
                width: 2,
                type: "2 5",
                colour: "limits",
                rebaselines: true,
                tooltipLabel: "95% Limit",
                tooltipPrefixes: true
            }),
            "99% Limits": settings.createLineGroup("99", {
                showLabel: "Show 99% Lines",
                showDescription: "Draws the three-sigma control limits.",
                showDefault: true,
                width: 2,
                type: "10 10",
                colour: "limits",
                rebaselines: true,
                tooltipLabel: "99% Limit",
                tooltipPrefixes: true
            }),
            "Specification Limits": settings.createLineGroup("specification", {
                showLabel: "Show Specification Lines",
                showDescription: "Draws the specification limits, which patterns using the Specification limit need.",
                showDefault: false,
                width: 2,
                type: "10 10",
                colour: "limits",
                rebaselines: true,
                tooltipLabel: "Specification Limit",
                tooltipPrefixes: true
            }, {
                specification_upper: settings.numberOption("Upper Specification Limit:", "Upper specification limit, as a plotted value unless the multiplier is applied.", undefined),
                specification_lower: settings.numberOption("Lower Specification Limit:", "Lower specification limit, as a plotted value unless the multiplier is applied.", undefined),
                multiplier_specification: settings.toggleOption("Apply Multiplier to Specification Limits", "Multiplies the limits by the Multiplier, for limits entered as raw proportions or rates.", false)
            }),
            "Trend": settings.createLineGroup("trend", {
                showLabel: "Show Trend",
                showDescription: "Draws a least-squares trend line through each rebaseline period.",
                showDefault: false,
                width: 1.5,
                type: "10 0",
                colour: "common_cause",
                rebaselines: true,
                tooltipLabel: "Trend"
            })
        }
    };

    const datesSettings = {
        description: "Date Settings",
        displayName: "Date Settings",
        settingsGroups: {
            "all": {
                date_format_day: settings.dropdownOption("Day Format", "How the day appears in date labels; (blank) leaves it out.", "DD", ["DD", "Thurs DD", "Thursday DD", "(blank)"]),
                date_format_month: settings.dropdownOption("Month Format", "How the month appears in date labels; (blank) leaves it out.", "MM", ["MM", "Mon", "Month", "(blank)"]),
                date_format_year: settings.dropdownOption("Year Format", "How the year appears in date labels; (blank) leaves it out.", "YYYY", ["YYYY", "YY", "(blank)"]),
                date_format_delim: settings.dropdownOption("Delimiter", "Character between the parts of a date label.", "/", ["/", "-", " "]),
                date_format_locale: settings.dropdownOption("Locale", "Order of the parts: en-GB puts the day first, en-US the month.", "en-GB", ["en-GB", "en-US"])
            }
        }
    };

    function textAlignOption(displayName, description) {
        return settings.dropdownOption(displayName, description, "auto", ["auto", "left", "center", "right"], "sentence");
    }
    const summaryTableSettings = {
        description: "Summary Table Settings",
        displayName: "Summary Table Settings",
        settingsGroups: {
            "General": {
                show_table: settings.toggleOption("Show Summary Table", "Shows the points as a table instead of a chart. Data with more than one summary table group "
                    + "is always shown as a table.", false),
                table_variation_filter: settings.dropdownOption("Filter by Variation Type", "Shows only the groups whose variation icon matches.", "all", ["all", "common", "special", "improvement", "deterioration", "neutral"], "none", [
                    "All", "Common Cause", "Special Cause - Any", "Special Cause - Improvement",
                    "Special Cause - Deterioration", "Special Cause - Neutral"
                ]),
                table_assurance_filter: settings.dropdownOption("Filter by Assurance Type", "Shows only the groups whose assurance icon matches.", "all", ["all", "any", "pass", "fail", "inconsistent"], "none", ["All", "Consistent - Any", "Consistent Pass", "Consistent Fail", "Inconsistent"]),
                table_text_overflow: settings.dropdownOption("Text Overflow Handling", "Text too long for its column: ellipsis or clip cuts it short, none lets it wrap.", "none", ["ellipsis", "clip", "none"], "sentence"),
                table_opacity: settings.numberOption("Default Opacity", "Row opacity while nothing is selected.", 1, { min: 0, max: 1 }),
                table_opacity_selected: settings.numberOption("Opacity if Selected", "Opacity of selected rows while a selection is active.", 1, { min: 0, max: 1 }),
                table_opacity_unselected: settings.numberOption("Opacity if Unselected", "Opacity of the other rows while a selection is active.", 0.2, { min: 0, max: 1 }),
                table_outer_border_style: settings.borderStyleOption("Outer Border Style", "Line style of the border around the table.", "none"),
                table_outer_border_width: settings.borderWidthOption("Outer Border Width", "Width of the border around the table, in pixels."),
                table_outer_border_colour: settings.colourOption("Outer Border Colour", "Colour of the border around the table.", "standard"),
                table_outer_border_top: settings.toggleOption("Outer Border Top", "Draws the top of the border around the table.", true),
                table_outer_border_bottom: settings.toggleOption("Outer Border Bottom", "Draws the bottom of the border around the table.", true),
                table_outer_border_left: settings.toggleOption("Outer Border Left", "Draws the left side of the border around the table.", true),
                table_outer_border_right: settings.toggleOption("Outer Border Right", "Draws the right side of the border around the table.", true)
            },
            "Header": {
                table_header_font: settings.fontOption("Header Font", "Font of the column headers."),
                table_header_size: settings.fontSizeOption("Header Font Size", "Font size of the column headers, in pixels."),
                table_header_text_align: textAlignOption("Text Alignment", "Alignment of the headers; auto puts numbers right, text left and icons in the centre."),
                table_header_font_weight: settings.fontWeightOption("Header Font Weight", "Font weight of the column headers.", "bold"),
                table_header_text_transform: settings.textTransformOption("Header Text Transform", "Changes the case of the column headers."),
                table_header_text_padding: settings.numberOption("Padding Around Text", "Space around each header, in pixels.", 3, { min: 0, max: 100 }),
                table_header_colour: settings.colourOption("Header Font Colour", "Colour of the column headers.", "standard"),
                table_header_bg_colour: settings.colourOption("Header Background Colour", "Background colour of the header row.", "white"),
                table_header_border_style: settings.borderStyleOption("Header Border Style", "Line style of the header borders."),
                table_header_border_width: settings.borderWidthOption("Header Border Width", "Width of the header borders, in pixels."),
                table_header_border_colour: settings.colourOption("Header Border Colour", "Colour of the header borders.", "standard"),
                table_header_border_bottom: settings.toggleOption("Bottom Border", "Draws a border under the header row.", true),
                table_header_border_inner: settings.toggleOption("Inner Borders", "Draws borders between the headers.", false)
            },
            "Body": {
                table_body_font: settings.fontOption("Body Font", "Font of the table cells."),
                table_body_size: settings.fontSizeOption("Body Font Size", "Font size of the table cells, in pixels."),
                table_body_text_align: textAlignOption("Text Alignment", "Alignment of the cells; auto puts numbers right, text left and icons in the centre."),
                table_body_font_weight: settings.fontWeightOption("Font Weight", "Font weight of the table cells."),
                table_body_text_transform: settings.textTransformOption("Text Transform", "Changes the case of the table cells."),
                table_body_text_padding: settings.numberOption("Padding Around Text", "Space around each cell's text, in pixels.", 3, { min: 0, max: 100 }),
                table_body_colour: settings.colourOption("Body Font Colour", "Colour of the cell text.", "standard"),
                table_body_bg_colour: settings.colourOption("Body Background Colour", "Background colour of the rows.", "white"),
                table_body_border_style: settings.borderStyleOption("Body Border Style", "Line style of the cell borders."),
                table_body_border_width: settings.borderWidthOption("Body Border Width", "Width of the cell borders, in pixels."),
                table_body_border_colour: settings.colourOption("Body Border Colour", "Colour of the cell borders.", "lightgray"),
                table_body_border_top_bottom: settings.toggleOption("Top/Bottom Borders", "Draws borders between rows.", true),
                table_body_border_left_right: settings.toggleOption("Left/Right Borders", "Draws borders between columns.", false)
            }
        }
    };

    const settingsModel = {
        canvas: settings.createCanvasCard(),
        spc: settings.defineCard(spcSettings),
        outliers: settings.defineCard(outliersSettings),
        nhs_icons: settings.defineCard(nhsIconsSettings),
        scatter: settings.defineCard(scatterSettings),
        lines: settings.defineCard(linesSettings),
        x_axis: settings.createAxisCard("x", { tickRotation: -35, limitUnits: "a point number counted from 0" }),
        y_axis: settings.createAxisCard("y", { tickRotation: 0, limitUnits: "a plotted value" }, {
            limit_multiplier: settings.numberOption("Axis Scaling Factor", "Extends the y-axis past the centreline by this multiple of the distance to the furthest point, limit or target.", 1.5, { min: 0 })
        }),
        dates: settings.defineCard(datesSettings),
        summary_table: settings.defineCard(summaryTableSettings),
        download_options: settings.createDownloadCard(),
        labels: settings.createLabelsCard()
    };
    const defaultSettings = settings.createDefaultValues(settingsModel);

    function commonCause(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M106.903 196.084 144.607 228.433 138.766 235.241 101.062 202.892Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M146.159 218.909 179.921 159.846 187.708 164.298 153.946 223.361Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M198.708 154.94 239.365 214.134 231.971 219.212 191.314 160.019Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M238.825 216.117 285.383 198.784 288.512 207.19 241.954 224.523Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M76.5001 195C76.5001 183.678 85.6782 174.5 97.0001 174.5 108.322 174.5 117.5 183.678 117.5 195 117.5 206.322 108.322 215.5 97.0001 215.5 85.6782 215.5 76.5001 206.322 76.5001 195Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M123.5 233C123.5 221.678 132.678 212.5 144 212.5 155.322 212.5 164.5 221.678 164.5 233 164.5 244.322 155.322 253.5 144 253.5 132.678 253.5 123.5 244.322 123.5 233Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M170.5 153.5C170.5 141.902 179.902 132.5 191.5 132.5 203.098 132.5 212.5 141.902 212.5 153.5 212.5 165.098 203.098 174.5 191.5 174.5 179.902 174.5 170.5 165.098 170.5 153.5Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M217.5 221.5C217.5 209.902 226.902 200.5 238.5 200.5 250.098 200.5 259.5 209.902 259.5 221.5 259.5 233.098 250.098 242.5 238.5 242.5 226.902 242.5 217.5 233.098 217.5 221.5Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M265.5 206.5C265.5 194.902 274.678 185.5 286 185.5 297.322 185.5 306.5 194.902 306.5 206.5 306.5 218.098 297.322 227.5 286 227.5 274.678 227.5 265.5 218.098 265.5 206.5Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
    }

    function concernHigh(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M0 155.53C-1.9801e-14 69.6331 69.6331-1.9801e-14 155.53-3.96021e-14 241.427-7.92042e-14 311.06 69.6331 311.06 155.53 311.06 241.427 241.427 311.06 155.53 311.06 69.6331 311.06-9.90052e-14 241.427 0 155.53Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 17.47 328.36)");
        selection.append("path")
            .attr("d", "M0 151C-1.92243e-14 67.605 67.605-1.92243e-14 151-3.84486e-14 234.395-7.68973e-14 302 67.605 302 151 302 234.395 234.395 302 151 302 67.605 302-9.61216e-14 234.395 0 151Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 38 340)");
        selection.append("text")
            .attr("fill", "#E46C0A")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(106.228 172) scale(10, 10)")
            .text("H");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.919094 0.394039 0.394039 -0.919094 95.4025 215.096)");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.880045 -0.47489 -0.47489 -0.880045 149.897 232.457)");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.715824 -0.698281 -0.698281 -0.715824 199.882 206.276)");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.937161 0.348898 0.348898 -0.937161 238.113 168.387)");
        selection.append("path")
            .attr("d", "M0 21C-2.60992e-15 9.40202 9.17816-2.67358e-15 20.5-5.34716e-15 31.8218-1.06943e-14 41 9.40202 41 21 41 32.598 31.8218 42 20.5 42 9.17816 42-1.30496e-14 32.598 0 21Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 76.5001 231.5)");
        selection.append("path")
            .attr("d", "M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 123.5 249.5)");
        selection.append("path")
            .attr("d", "M0 21C-2.67358e-15 9.40202 9.40202-2.67358e-15 21-5.34716e-15 32.598-1.06943e-14 42 9.40202 42 21 42 32.598 32.598 42 21 42 9.40202 42-1.33679e-14 32.598 0 21Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 170.5 231.5)");
        selection.append("path")
            .attr("d", "M0 20.5C-2.67358e-15 9.17816 9.40202-2.60992e-15 21-5.21985e-15 32.598-1.04397e-14 42 9.17816 42 20.5 42 31.8218 32.598 41 21 41 9.40202 41-1.33679e-14 31.8218 0 20.5Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#E46C0A")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 217.5 185.5)");
        selection.append("path")
            .attr("d", "M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#E46C0A")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 265.5 200.5)");
    }

    function concernLow(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("text")
            .attr("fill", "#E46C0A")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(106.228 292) scale(10, 10)")
            .text("L");
        selection.append("path")
            .attr("d", "M95.4025 162.857 141.063 143.281 144.597 151.525 98.9371 171.101Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M149.897 145.496 193.618 169.089 189.358 176.983 145.638 153.39Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M199.882 171.677 235.443 206.367 229.18 212.788 193.618 178.098Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M238.113 209.566 284.671 192.233 287.8 200.639 241.243 217.972Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M76.5001 168.5C76.5001 156.902 85.6782 147.5 97.0001 147.5 108.322 147.5 117.5 156.902 117.5 168.5 117.5 180.098 108.322 189.5 97.0001 189.5 85.6782 189.5 76.5001 180.098 76.5001 168.5Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M123.5 150C123.5 138.678 132.678 129.5 144 129.5 155.322 129.5 164.5 138.678 164.5 150 164.5 161.322 155.322 170.5 144 170.5 132.678 170.5 123.5 161.322 123.5 150Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M170.5 168.5C170.5 156.902 179.902 147.5 191.5 147.5 203.098 147.5 212.5 156.902 212.5 168.5 212.5 180.098 203.098 189.5 191.5 189.5 179.902 189.5 170.5 180.098 170.5 168.5Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M217.5 214C217.5 202.678 226.902 193.5 238.5 193.5 250.098 193.5 259.5 202.678 259.5 214 259.5 225.322 250.098 234.5 238.5 234.5 226.902 234.5 217.5 225.322 217.5 214Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#E46C0A")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M265.5 199C265.5 187.678 274.678 178.5 286 178.5 297.322 178.5 306.5 187.678 306.5 199 306.5 210.322 297.322 219.5 286 219.5 274.678 219.5 265.5 210.322 265.5 199Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#E46C0A")
            .attr("fill-rule", "evenodd");
    }

    function improvementHigh(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M0 155.53C-1.9801e-14 69.6331 69.6331-1.9801e-14 155.53-3.96021e-14 241.427-7.92042e-14 311.06 69.6331 311.06 155.53 311.06 241.427 241.427 311.06 155.53 311.06 69.6331 311.06-9.90052e-14 241.427 0 155.53Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 17.47 328.36)");
        selection.append("path")
            .attr("d", "M0 151C-1.92243e-14 67.605 67.605-1.92243e-14 151-3.84486e-14 234.395-7.68973e-14 302 67.605 302 151 302 234.395 234.395 302 151 302 67.605 302-9.61216e-14 234.395 0 151Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 38 340)");
        selection.append("text")
            .attr("fill", "#00B0F0")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(106.228 172) scale(10, 10)")
            .text("H");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.919094 0.394039 0.394039 -0.919094 95.4025 215.096)");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.880045 -0.47489 -0.47489 -0.880045 149.897 232.457)");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.715824 -0.698281 -0.698281 -0.715824 199.882 206.276)");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.937161 0.348898 0.348898 -0.937161 238.113 168.387)");
        selection.append("path")
            .attr("d", "M0 21C-2.60992e-15 9.40202 9.17816-2.67358e-15 20.5-5.34716e-15 31.8218-1.06943e-14 41 9.40202 41 21 41 32.598 31.8218 42 20.5 42 9.17816 42-1.30496e-14 32.598 0 21Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 76.5001 231.5)");
        selection.append("path")
            .attr("d", "M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 123.5 249.5)");
        selection.append("path")
            .attr("d", "M0 21C-2.67358e-15 9.40202 9.40202-2.67358e-15 21-5.34716e-15 32.598-1.06943e-14 42 9.40202 42 21 42 32.598 32.598 42 21 42 9.40202 42-1.33679e-14 32.598 0 21Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 170.5 231.5)");
        selection.append("path")
            .attr("d", "M0 20.5C-2.67358e-15 9.17816 9.40202-2.60992e-15 21-5.21985e-15 32.598-1.04397e-14 42 9.17816 42 20.5 42 31.8218 32.598 41 21 41 9.40202 41-1.33679e-14 31.8218 0 20.5Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#00B0F0")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 217.5 185.5)");
        selection.append("path")
            .attr("d", "M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#00B0F0")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 265.5 200.5)");
    }

    function improvementLow(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("text")
            .attr("fill", "#00B0F0")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(106.228 292) scale(10, 10)")
            .text("L");
        selection.append("path")
            .attr("d", "M95.4025 162.857 141.063 143.281 144.597 151.525 98.9371 171.101Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M149.897 145.496 193.618 169.089 189.358 176.983 145.638 153.39Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M199.882 171.677 235.443 206.367 229.18 212.788 193.618 178.098Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M238.113 209.566 284.671 192.233 287.8 200.639 241.243 217.972Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M76.5001 168.5C76.5001 156.902 85.6782 147.5 97.0001 147.5 108.322 147.5 117.5 156.902 117.5 168.5 117.5 180.098 108.322 189.5 97.0001 189.5 85.6782 189.5 76.5001 180.098 76.5001 168.5Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M123.5 150C123.5 138.678 132.678 129.5 144 129.5 155.322 129.5 164.5 138.678 164.5 150 164.5 161.322 155.322 170.5 144 170.5 132.678 170.5 123.5 161.322 123.5 150Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M170.5 168.5C170.5 156.902 179.902 147.5 191.5 147.5 203.098 147.5 212.5 156.902 212.5 168.5 212.5 180.098 203.098 189.5 191.5 189.5 179.902 189.5 170.5 180.098 170.5 168.5Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M217.5 214C217.5 202.678 226.902 193.5 238.5 193.5 250.098 193.5 259.5 202.678 259.5 214 259.5 225.322 250.098 234.5 238.5 234.5 226.902 234.5 217.5 225.322 217.5 214Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#00B0F0")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M265.5 199C265.5 187.678 274.678 178.5 286 178.5 297.322 178.5 306.5 187.678 306.5 199 306.5 210.322 297.322 219.5 286 219.5 274.678 219.5 265.5 210.322 265.5 199Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#00B0F0")
            .attr("fill-rule", "evenodd");
    }

    function neutralHigh(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#490092")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#490092")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M103.652 242.245 180.02 165.878 151.735 137.593 258.273 119.68 240.359 226.217 212.075 197.933 135.708 274.3Z")
            .attr("fill", "#490092")
            .attr("fill-rule", "evenodd");
    }

    function neutralLow(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#490092")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#490092")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M135.708 103.652 212.075 180.02 240.359 151.735 258.273 258.273 151.735 240.359 180.02 212.075 103.652 135.708Z")
            .attr("fill", "#490092")
            .attr("fill-rule", "evenodd");
    }

    function consistentFail(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("text")
            .attr("fill", "#E46C0A")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(155.851 158) scale(10, 10)")
            .text("F");
        selection.append("path")
            .attr("d", "M38.5001 185.5 340.862 185.5")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "8.66667")
            .attr("stroke-miterlimit", "8")
            .attr("stroke-dasharray", "26 8.66667")
            .attr("fill", "none")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M72.5001 238.762C89.0456 218.168 107.725 200.801 129.638 200.507 152.134 201.459 176.57 238.689 192.563 241.313 206.31 244.118 205.897 217.733 212.814 216.659 217.563 215.414 220.151 238.182 233.066 240.463 248.557 243.786 291.62 234.385 302.5 236.212")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "10.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "none")
            .attr("fill-rule", "evenodd");
    }

    function consistentPass(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("text")
            .attr("fill", "#00B0F0")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(155.851 158) scale(10, 10)")
            .text("P");
        selection.append("path")
            .attr("d", "M55.5001 257.5 323.847 257.5")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "8.66667")
            .attr("stroke-miterlimit", "8")
            .attr("stroke-dasharray", "26 8.66667")
            .attr("fill", "none")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M72.5001 238.762C89.0456 218.168 107.725 200.801 129.638 200.507 152.134 201.459 176.57 238.689 192.563 241.313 206.31 244.118 205.897 217.733 212.814 216.659 217.563 215.414 220.151 238.182 233.066 240.463 248.557 243.786 291.62 234.385 302.5 236.212")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "10.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "none")
            .attr("fill-rule", "evenodd");
    }

    function inconsistent(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 173.345C17.47 87.1637 87.1031 17.3 173 17.3 258.897 17.3 328.53 87.1637 328.53 173.345 328.53 259.526 258.897 329.39 173 329.39 87.1031 329.39 17.47 259.526 17.47 173.345Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189.5C38 105.829 105.605 38 189 38 272.395 38 340 105.829 340 189.5 340 273.171 272.395 341 189 341 105.605 341 38 273.171 38 189.5Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("text")
            .attr("fill", "#7F7F7F")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(155.851 158) scale(10, 10)")
            .text("?");
        selection.append("path")
            .attr("d", "M38.5001 222.5 340.862 222.5")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "8.66667")
            .attr("stroke-miterlimit", "8")
            .attr("stroke-dasharray", "26 8.66667")
            .attr("fill", "none")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M72.5001 239.762C89.0456 219.168 107.725 201.801 129.638 201.507 152.134 202.459 176.57 239.689 192.563 242.313 206.31 245.118 205.897 218.733 212.814 217.659 217.563 216.414 220.151 239.182 233.066 241.463 248.557 244.786 291.62 235.385 302.5 237.212")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "10.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "none")
            .attr("fill-rule", "evenodd");
    }

    const nhsIcons = {
        commonCause,
        concernHigh,
        concernLow,
        improvementHigh,
        improvementLow,
        neutralHigh,
        neutralLow,
        consistentFail,
        consistentPass,
        inconsistent
    };

    function iconTransformSpec(svg_width, svg_height, location, scaling, count) {
        const scaling_factor = (0.08 * (svg_height / 378)) * scaling;
        const icon_x = location.includes("Right")
            ? (svg_width / scaling_factor) - (378 + (count * 378))
            : location.includes("Centre") ? (svg_width / scaling_factor) / 2 - 189
                : (count * 378);
        const icon_y = location.includes("Bottom")
            ? (svg_height / scaling_factor) - 378
            : location.includes("Centre") ? (svg_height / scaling_factor) / 2 - 189
                : 0;
        return `scale(${scaling_factor}) translate(${icon_x}, ${icon_y})`;
    }
    function initialiseIconSVG(selection, icon_name, transform_spec) {
        const icon_group = selection.append('g')
            .classed("icongroup", true);
        if (transform_spec) {
            icon_group.attr("transform", transform_spec);
        }
        const icon_defs = icon_group.append("defs");
        const icon_defs_filter = icon_defs.append("filter")
            .attr("id", "fx0")
            .attr("x", "-10%")
            .attr("y", "-10%")
            .attr("width", "120%")
            .attr("height", "120%")
            .attr("filterUnits", "userSpaceOnUse")
            .attr("userSpaceOnUse", "userSpaceOnUse");
        const icon_comptrans = icon_defs_filter.append("feComponentTransfer")
            .attr("color-interpolation-filters", "sRGB");
        icon_comptrans.append("feFuncR")
            .attr("type", "discrete")
            .attr("tableValues", "0 0");
        icon_comptrans.append("feFuncG")
            .attr("type", "discrete")
            .attr("tableValues", "0 0");
        icon_comptrans.append("feFuncB")
            .attr("type", "discrete")
            .attr("tableValues", "0 0");
        icon_comptrans.append("feFuncA")
            .attr("type", "linear")
            .attr("slope", "0.4")
            .attr("intercept", "0");
        icon_defs_filter.append("feGaussianBlur")
            .attr("stdDeviation", "1.77778 1.77778");
        icon_defs.append("clipPath")
            .attr("id", "clip1")
            .append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "378")
            .attr("height", "378");
        icon_defs.append("clipPath")
            .attr("id", "clip2")
            .append("path")
            .attr("d", "M189 38C105.605 38 38 105.605 38 189 38 272.395 105.605 340 189 340 272.395 340 340 272.395 340 189 340 105.605 272.395 38 189 38ZM5.63264e-06 5.63264e-06 378 5.63264e-06 378 378 5.63264e-06 378Z")
            .attr("fill-rule", "evenodd")
            .attr("clip-rule", "evenodd");
        icon_defs.append("clipPath")
            .attr("id", "clip3")
            .append("rect")
            .attr("x", "-2")
            .attr("y", "-2")
            .attr("width", "346")
            .attr("height", "346");
        icon_group.append("g")
            .classed(icon_name, true)
            .attr("clip-path", "url(#clip1)")
            .append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "378")
            .attr("height", "378")
            .attr("fill", "#FFFFFF");
    }

    function assuranceIconToDraw(controlLimits, inputSettings, derivedSettings) {
        if (!(derivedSettings.chart_type_props.has_control_limits)) {
            return "none";
        }
        const imp_direction = inputSettings.outliers.improvement_direction;
        const ll99 = controlLimits.ll99;
        const ul99 = controlLimits.ul99;
        if (!inputSettings.lines.show_alt_target || imp_direction === "neutral") {
            return "none";
        }
        const N = ll99.length - 1;
        const alt_target = controlLimits.alt_target[N];
        const upper = ul99[N];
        const lower = ll99[N];
        const impDirectionIncrease = imp_direction === "increase";
        if (alt_target !== undefined && upper !== undefined && alt_target > upper) {
            return impDirectionIncrease ? "consistentFail" : "consistentPass";
        }
        else if (alt_target !== undefined && lower !== undefined && alt_target < lower) {
            return impDirectionIncrease ? "consistentPass" : "consistentFail";
        }
        else {
            return "inconsistent";
        }
    }

    function variationIconsToDraw(outliers, inputSettings) {
        const direction_icons = {
            increase: { improvement: "improvementHigh", deterioration: "concernLow" },
            decrease: { improvement: "improvementLow", deterioration: "concernHigh" }
        };
        const imp_direction = inputSettings.outliers.improvement_direction;
        const icons = imp_direction === "neutral" ? undefined : direction_icons[imp_direction];
        const flag_last = inputSettings.nhs_icons.flag_last_point;
        const startIndex = flag_last ? outliers.astpoint.length - 1 : 0;
        let improvementPresent = false;
        let deteriorationPresent = false;
        let neutralLowPresent = false;
        let neutralHighPresent = false;
        for (let i = startIndex; i < outliers.astpoint.length; i++) {
            const flagsToCheck = [outliers.astpoint[i], outliers.shift[i], outliers.trend[i], outliers.two_in_three[i]];
            improvementPresent = improvementPresent || flagsToCheck.includes("improvement");
            deteriorationPresent = deteriorationPresent || flagsToCheck.includes("deterioration");
            neutralLowPresent = neutralLowPresent || flagsToCheck.includes("neutral_low");
            neutralHighPresent = neutralHighPresent || flagsToCheck.includes("neutral_high");
            if (improvementPresent && deteriorationPresent && neutralLowPresent && neutralHighPresent) {
                break;
            }
        }
        const iconsPresent = [];
        if (improvementPresent && icons !== undefined) {
            iconsPresent.push(icons.improvement);
        }
        if (deteriorationPresent && icons !== undefined) {
            iconsPresent.push(icons.deterioration);
        }
        if (neutralLowPresent) {
            iconsPresent.push("neutralLow");
        }
        if (neutralHighPresent) {
            iconsPresent.push("neutralHigh");
        }
        if (iconsPresent.length === 0) {
            iconsPresent.push("commonCause");
        }
        return iconsPresent;
    }

    function drawIcons(selection, visualObj) {
        selection.selectAll(".icongroup").remove();
        if (!(visualObj.plotProperties.displayPlot)) {
            return;
        }
        const nhsIconSettings = visualObj.viewModel.inputSettings.settings[0].nhs_icons;
        const draw_variation = nhsIconSettings.show_variation_icons;
        const variation_location = nhsIconSettings.variation_icons_locations;
        const svg_width = visualObj.viewModel.svgWidth;
        const svg_height = visualObj.viewModel.svgHeight;
        let numVariationIcons = 0;
        if (draw_variation) {
            const variation_scaling = nhsIconSettings.variation_icons_scaling;
            const variationIconsPresent = variationIconsToDraw(visualObj.viewModel.outliers[0], visualObj.viewModel.inputSettings.settings[0]);
            for (let idx = 0; idx < variationIconsPresent.length; idx++) {
                const icon = variationIconsPresent[idx];
                selection
                    .call(initialiseIconSVG, icon, iconTransformSpec(svg_width, svg_height, variation_location, variation_scaling, idx))
                    .selectAll(`.${icon}`)
                    .call(nhsIcons[icon]);
            }
            numVariationIcons = variationIconsPresent.length;
        }
        const draw_assurance = nhsIconSettings.show_assurance_icons;
        if (draw_assurance) {
            const assurance_location = nhsIconSettings.assurance_icons_locations;
            const assurance_scaling = nhsIconSettings.assurance_icons_scaling;
            const settings = visualObj.viewModel.inputSettings.settings[0];
            const derivedSettings = visualObj.viewModel.inputSettings.derivedSettings[0];
            const assuranceIconPresent = assuranceIconToDraw(visualObj.viewModel.controlLimits[0], settings, derivedSettings);
            if (assuranceIconPresent === "none") {
                return;
            }
            const currIconCount = (numVariationIcons > 0 && variation_location === assurance_location)
                ? numVariationIcons
                : 0;
            selection
                .call(initialiseIconSVG, assuranceIconPresent, iconTransformSpec(svg_width, svg_height, assurance_location, assurance_scaling, currIconCount))
                .selectAll(`.${assuranceIconPresent}`)
                .call(nhsIcons[assuranceIconPresent]);
        }
    }

    const integerFormattedColumns = new Set(["numerator", "denominator"]);
    const numericColumns = new Set([
        "value", "numerator", "denominator", "target", "alt_target", "trend_line", "speclimits_lower", "speclimits_upper",
        "ll99", "ll95", "ll68", "ul68", "ul95", "ul99"
    ]);
    const dateColumns = new Set(["date", "latest_date"]);
    const flagColumns = new Set(["astpoint", "trend", "shift", "two_in_three"]);
    const flagLabels = {
        none: "",
        improvement: "Improvement",
        deterioration: "Deterioration",
        neutral_low: "Neutral (Low)",
        neutral_high: "Neutral (High)"
    };
    function drawsIcons(inputSettings, showGrouped) {
        return showGrouped && (inputSettings.nhs_icons.show_variation_icons || inputSettings.nhs_icons.show_assurance_icons);
    }
    function isIconColumn(column) {
        return column === "variation" || column === "assurance";
    }
    function columnAlignment(setting, column, drawIcons) {
        if (setting !== "auto") {
            return setting;
        }
        if (drawIcons && isIconColumn(column)) {
            return "center";
        }
        return numericColumns.has(column) ? "right" : "left";
    }
    function rowTableSettings(row, tableSettings) {
        return ("table_body_bg_colour" in row.aesthetics) ? row.aesthetics : tableSettings;
    }
    function drawTableHeaders(selection, cols, tableSettings, drawIcons) {
        const tableHeaders = selection.select(".table-header")
            .selectAll("th")
            .data(cols)
            .join("th");
        tableHeaders.selectAll("text")
            .data(d => [d.label])
            .join("text")
            .text(d => d);
        tableHeaders.style("font-size", `${tableSettings.table_header_size}px`)
            .style("font-family", tableSettings.table_header_font)
            .style("color", tableSettings.table_header_colour)
            .style("padding", `${tableSettings.table_header_text_padding}px`)
            .style("background-color", tableSettings.table_header_bg_colour)
            .style("font-weight", tableSettings.table_header_font_weight)
            .style("text-transform", tableSettings.table_header_text_transform)
            .style("text-align", d => columnAlignment(tableSettings.table_header_text_align, d.name, drawIcons))
            .style("border-width", `${tableSettings.table_header_border_width}px`)
            .style("border-style", tableSettings.table_header_border_style)
            .style("border-color", tableSettings.table_header_border_colour)
            .style("border-top", "none")
            .style("border-left", "none")
            .style("position", "sticky")
            .style("top", "0")
            .style("z-index", "1");
        if (!tableSettings.table_header_border_bottom) {
            tableHeaders.style("border-bottom", "none");
        }
        if (!tableSettings.table_header_border_inner) {
            tableHeaders.style("border-right", "none");
        }
    }
    function drawTableRows(selection, visualObj, plotPoints, tableSettings) {
        selection.select(".table-body")
            .selectAll('tr')
            .data(plotPoints)
            .join('tr')
            .on("click", (event, d) => {
            if (visualObj.host.hostCapabilities.allowInteractions) {
                const alreadySel = powerbi.identitySelected(d.identity, powerbi.selectionState(visualObj.selectionManager, false).selected);
                visualObj.selectionManager
                    .select(d.identity, alreadySel || event.ctrlKey || event.metaKey)
                    .then(() => visualObj.updateHighlighting());
                event.stopPropagation();
            }
        })
            .on("mouseenter", function () {
            rendering.select(this).selectAll("td").style("background-color", "whitesmoke");
        })
            .on("mouseleave", function (_event, d) {
            rendering.select(this).selectAll("td").style("background-color", rowTableSettings(d, tableSettings).table_body_bg_colour);
        });
    }
    function drawTextOverflow(selection, tableSettings, maxWidth) {
        const cells = selection.selectAll("th, td");
        if (tableSettings.table_text_overflow !== "none") {
            cells.style("overflow", "hidden")
                .style("max-width", `${maxWidth}px`)
                .style("text-overflow", tableSettings.table_text_overflow);
        }
        else {
            cells.style("overflow", "auto")
                .style("max-width", "none");
        }
    }
    function drawOuterBorder(selection, tableSettings) {
        selection.select(".table-group")
            .style("border-width", `${tableSettings.table_outer_border_width}px`)
            .style("border-style", tableSettings.table_outer_border_style)
            .style("border-color", tableSettings.table_outer_border_colour);
        const sides = ["top", "right", "bottom", "left"];
        for (let i = 0; i < sides.length; i++) {
            if (!tableSettings[`table_outer_border_${sides[i]}`]) {
                selection.select(".table-group").style(`border-${sides[i]}`, "none");
            }
        }
        selection.selectAll("th:last-child")
            .style("border-right", "inherit");
        selection.selectAll("td:last-child")
            .style("border-right", "inherit");
        selection.selectAll("tr:last-child")
            .selectAll("td")
            .style("border-bottom", "inherit");
    }
    function drawTableCells(selection, cols, inputSettings, drawIcons, formatValues) {
        const tableCells = selection.select(".table-body")
            .selectAll('tr')
            .selectAll('td')
            .data(d => {
            const row = d.table_row;
            const cells = new Array(cols.length);
            for (let i = 0; i < cols.length; i++) {
                cells[i] = { column: cols[i].name, value: row[cols[i].name] };
            }
            return cells;
        })
            .join('td');
        tableCells.each(function (d) {
            const currNode = rendering.select(this);
            const rowData = rendering.select(this.parentElement).datum();
            const iconCell = drawIcons && isIconColumn(d.column);
            if (!iconCell) {
                let value = "";
                if (typeof d.value === "number") {
                    value = formatValues(d.value, integerFormattedColumns.has(d.column) ? "integer" : "value");
                }
                else if (d.value !== undefined) {
                    value = flagColumns.has(d.column) ? flagLabels[d.value] : d.value;
                }
                currNode.text(value).classed("cell-text", true);
            }
            const tableAesthetics = rowTableSettings(rowData, inputSettings.summary_table);
            currNode.style("background-color", tableAesthetics.table_body_bg_colour)
                .style("font-weight", tableAesthetics.table_body_font_weight)
                .style("text-transform", tableAesthetics.table_body_text_transform)
                .style("text-align", columnAlignment(tableAesthetics.table_body_text_align, d.column, drawIcons))
                .style("font-size", `${tableAesthetics.table_body_size}px`)
                .style("font-family", tableAesthetics.table_body_font)
                .style("color", tableAesthetics.table_body_colour)
                .style("border-width", `${tableAesthetics.table_body_border_width}px`)
                .style("border-style", tableAesthetics.table_body_border_style)
                .style("border-color", tableAesthetics.table_body_border_colour)
                .style("border-top", "none")
                .style("border-left", "none")
                .style("padding", `${tableAesthetics.table_body_text_padding}px`)
                .style("opacity", "inherit")
                .style("white-space", (iconCell || dateColumns.has(d.column)) ? "nowrap" : "normal");
            if (!tableAesthetics.table_body_border_left_right) {
                currNode.style("border-right", "none");
            }
            if (!tableAesthetics.table_body_border_top_bottom) {
                currNode.style("border-bottom", "none");
            }
        });
    }
    function drawIconCells(selection, nhsIconSettings) {
        const iconCells = selection.select(".table-body")
            .selectAll("tr")
            .selectAll("td")
            .filter(d => isIconColumn(d.column));
        const cells = iconCells.nodes();
        const data = iconCells.data();
        const icons = new Array(cells.length);
        let rowHeight = Number.POSITIVE_INFINITY;
        const columnWidths = { variation: 0, assurance: 0 };
        const maxIcons = { variation: 0, assurance: 0 };
        for (let i = 0; i < cells.length; i++) {
            const column = data[i].column;
            const row = rendering.select(cells[i].parentElement).datum();
            const assurance = row.table_row.assurance;
            icons[i] = column === "variation" ? row.variation_icons : (assurance === "none" ? [] : [assurance]);
            maxIcons[column] = Math.max(maxIcons[column], icons[i].length);
            const style = getComputedStyle(cells[i]);
            const rect = cells[i].getBoundingClientRect();
            rowHeight = Math.min(rowHeight, rect.height
                - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
                - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth));
            columnWidths[column] = rect.width
                - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
                - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
        }
        const widthCap = (columnWidths.variation + columnWidths.assurance)
            / Math.max(1, maxIcons.variation + maxIcons.assurance);
        const baseSize = Math.min(rowHeight, widthCap);
        for (let i = 0; i < cells.length; i++) {
            const variation = data[i].column === "variation";
            const scaling = variation ? nhsIconSettings.variation_icons_scaling : nhsIconSettings.assurance_icons_scaling;
            const size = baseSize * scaling;
            const cell = rendering.select(cells[i]);
            for (let j = 0; j < icons[i].length; j++) {
                const icon = icons[i][j];
                cell.append("svg")
                    .attr("width", `${size}px`)
                    .attr("height", `${size}px`)
                    .attr("viewBox", "0 0 378 378")
                    .style("vertical-align", "top")
                    .classed("rowsvg", true)
                    .call(initialiseIconSVG, icon)
                    .selectAll(".icongroup")
                    .selectAll(`.${icon}`)
                    .call(nhsIcons[icon]);
            }
        }
    }
    function drawSummaryTable(selection, visualObj) {
        selection.selectAll(".rowsvg").remove();
        selection.selectAll(".cell-text").remove();
        const viewModel = visualObj.viewModel;
        const plotPoints = viewModel.showGrouped ? viewModel.groupedRows : viewModel.plotPoints;
        const cols = viewModel.tableColumns[0];
        const maxWidth = visualObj.viewModel.svgWidth / cols.length;
        const inputSettings = visualObj.viewModel.inputSettings.settings[0];
        const tableSettings = inputSettings.summary_table;
        const draw_icons = drawsIcons(inputSettings, viewModel.showGrouped);
        selection.call(drawTableHeaders, cols, tableSettings, draw_icons)
            .call(drawTableRows, visualObj, plotPoints, tableSettings);
        if (plotPoints.length > 0) {
            const formatValues = visualObj.viewModel.inputSettings.derivedSettings[0].formatValue;
            selection.call(drawTableCells, cols, inputSettings, draw_icons, formatValues);
        }
        selection.call(drawTextOverflow, tableSettings, maxWidth)
            .call(drawOuterBorder, tableSettings);
        if (plotPoints.length > 0 && draw_icons) {
            drawIconCells(selection, inputSettings.nhs_icons);
        }
        selection.on('click', () => {
            visualObj.selectionManager.clear();
            visualObj.updateHighlighting();
        });
    }

    function cLimits(args) {
        const n_sub = args.subset_points.length;
        const numerators = args.numerators;
        const subset_points = args.subset_points;
        let cl = 0;
        for (let i = 0; i < n_sub; i++) {
            cl += numerators[subset_points[i]];
        }
        cl = cl / n_sub;
        const sigma = Math.sqrt(cl);
        const n = args.keys.length;
        const rtn = {
            keys: args.keys,
            values: args.numerators,
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        const twoSigma = 2 * sigma;
        const threeSigma = 3 * sigma;
        const ll99 = Math.max(0, cl - threeSigma);
        const ll95 = Math.max(0, cl - twoSigma);
        const ll68 = Math.max(0, cl - sigma);
        const ul68 = cl + sigma;
        const ul95 = cl + twoSigma;
        const ul99 = cl + threeSigma;
        for (let i = 0; i < n; i++) {
            rtn.target[i] = cl;
            rtn.ll99[i] = ll99;
            rtn.ll95[i] = ll95;
            rtn.ll68[i] = ll68;
            rtn.ul68[i] = ul68;
            rtn.ul95[i] = ul95;
            rtn.ul99[i] = ul99;
        }
        return rtn;
    }

    function gLimits(args) {
        const numerators = args.numerators;
        const subset_points = args.subset_points;
        const n_sub = subset_points.length;
        let numerator_subset = new Array(n_sub);
        let cl = 0;
        for (let i = 0; i < n_sub; i++) {
            const curr_numerator = numerators[subset_points[i]];
            numerator_subset[i] = curr_numerator;
            cl += curr_numerator;
        }
        cl /= n_sub;
        const median_val = math.median(numerator_subset);
        const sigma = Math.sqrt(cl * (cl + 1));
        const n = args.keys.length;
        const rtn = {
            keys: args.keys,
            values: args.numerators,
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        const ul68 = cl + sigma;
        const ul95 = cl + 2 * sigma;
        const ul99 = cl + 3 * sigma;
        for (let i = 0; i < n; i++) {
            rtn.target[i] = median_val;
            rtn.ll68[i] = 0;
            rtn.ll95[i] = 0;
            rtn.ll99[i] = 0;
            rtn.ul68[i] = ul68;
            rtn.ul95[i] = ul95;
            rtn.ul99[i] = ul99;
        }
        return rtn;
    }

    function averageMovingRange(consec_diff, outliers_in_limits) {
        let amr = 0;
        for (let i = 0; i < consec_diff.length; i++) {
            amr += consec_diff[i];
        }
        amr /= consec_diff.length;
        if (!outliers_in_limits && amr > 0) {
            const consec_diff_ulim = amr * 3.267;
            let screened_amr = 0;
            let screened_count = 0;
            for (let i = 0; i < consec_diff.length; i++) {
                if (consec_diff[i] < consec_diff_ulim) {
                    screened_amr += consec_diff[i];
                    screened_count += 1;
                }
            }
            amr = screened_amr / screened_count;
        }
        return amr;
    }

    function plottedValues(args) {
        const numerators = args.numerators;
        const denominators = args.denominators;
        if (denominators === undefined) {
            return { values: numerators.slice() };
        }
        const values = new Array(numerators.length);
        for (let i = 0; i < values.length; i++) {
            values[i] = numerators[i] / denominators[i];
        }
        return { values, numerators, denominators };
    }

    function iLimits(args) {
        const plotted = plottedValues(args);
        const values = plotted.values;
        const n_sub = args.subset_points.length;
        const subset_points = args.subset_points;
        let prevVal = values[subset_points[0]];
        let cl = prevVal;
        let consec_diff = new Array(n_sub - 1);
        for (let i = 1; i < n_sub; i++) {
            let currVal = values[subset_points[i]];
            consec_diff[i - 1] = Math.abs(currVal - prevVal);
            cl += currVal;
            prevVal = currVal;
        }
        cl /= n_sub;
        const sigma = averageMovingRange(consec_diff, args.outliers_in_limits) / 1.128;
        const n = args.keys.length;
        const rtn = {
            keys: args.keys,
            values,
            numerators: plotted.numerators,
            denominators: plotted.denominators,
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        const twoSigma = 2 * sigma;
        const threeSigma = 3 * sigma;
        const ll99 = cl - threeSigma;
        const ll95 = cl - twoSigma;
        const ll68 = cl - sigma;
        const ul68 = cl + sigma;
        const ul95 = cl + twoSigma;
        const ul99 = cl + threeSigma;
        for (let i = 0; i < n; i++) {
            rtn.target[i] = cl;
            rtn.ll99[i] = ll99;
            rtn.ll95[i] = ll95;
            rtn.ll68[i] = ll68;
            rtn.ul68[i] = ul68;
            rtn.ul95[i] = ul95;
            rtn.ul99[i] = ul99;
        }
        return rtn;
    }

    function imLimits(args) {
        const plotted = plottedValues(args);
        const n_sub = args.subset_points.length;
        const subset_points = args.subset_points;
        let ratio_subset = new Array(n_sub);
        for (let i = 0; i < n_sub; i++) {
            ratio_subset[i] = plotted.values[subset_points[i]];
        }
        const cl = math.median(ratio_subset);
        let consec_diff = new Array(n_sub - 1);
        for (let i = 1; i < n_sub; i++) {
            consec_diff[i - 1] = Math.abs(ratio_subset[i] - ratio_subset[i - 1]);
        }
        const sigma = averageMovingRange(consec_diff, args.outliers_in_limits) / 1.128;
        const n = args.keys.length;
        const rtn = {
            keys: args.keys,
            values: plotted.values,
            numerators: plotted.numerators,
            denominators: plotted.denominators,
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        const twoSigma = 2 * sigma;
        const threeSigma = 3 * sigma;
        const ll99 = cl - threeSigma;
        const ll95 = cl - twoSigma;
        const ll68 = cl - sigma;
        const ul68 = cl + sigma;
        const ul95 = cl + twoSigma;
        const ul99 = cl + threeSigma;
        for (let i = 0; i < n; i++) {
            rtn.target[i] = cl;
            rtn.ll99[i] = ll99;
            rtn.ll95[i] = ll95;
            rtn.ll68[i] = ll68;
            rtn.ul68[i] = ul68;
            rtn.ul95[i] = ul95;
            rtn.ul99[i] = ul99;
        }
        return rtn;
    }

    function immLimits(args) {
        const plotted = plottedValues(args);
        const n_sub = args.subset_points.length;
        const subset_points = args.subset_points;
        let ratio_subset = new Array(n_sub);
        for (let i = 0; i < n_sub; i++) {
            ratio_subset[i] = plotted.values[subset_points[i]];
        }
        const cl = math.median(ratio_subset);
        let consec_diff = new Array(n_sub - 1);
        for (let i = 1; i < n_sub; i++) {
            consec_diff[i - 1] = Math.abs(ratio_subset[i] - ratio_subset[i - 1]);
        }
        let mmr = math.median(consec_diff);
        if (!args.outliers_in_limits) {
            const consec_diff_ulim = mmr * 3.865;
            let valid_diffs = [];
            for (let i = 0; i < consec_diff.length; i++) {
                if (consec_diff[i] < consec_diff_ulim) {
                    valid_diffs.push(consec_diff[i]);
                }
            }
            if (valid_diffs.length > 0) {
                mmr = math.median(valid_diffs);
            }
        }
        const sigma = mmr / 0.954;
        const n = args.keys.length;
        const rtn = {
            keys: args.keys,
            values: plotted.values,
            numerators: plotted.numerators,
            denominators: plotted.denominators,
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        const twoSigma = 2 * sigma;
        const threeSigma = 3 * sigma;
        const ll99 = cl - threeSigma;
        const ll95 = cl - twoSigma;
        const ll68 = cl - sigma;
        const ul68 = cl + sigma;
        const ul95 = cl + twoSigma;
        const ul99 = cl + threeSigma;
        for (let i = 0; i < n; i++) {
            rtn.target[i] = cl;
            rtn.ll99[i] = ll99;
            rtn.ll95[i] = ll95;
            rtn.ll68[i] = ll68;
            rtn.ul68[i] = ul68;
            rtn.ul95[i] = ul95;
            rtn.ul99[i] = ul99;
        }
        return rtn;
    }

    function mrLimits(args) {
        const plotted = plottedValues(args);
        const values = plotted.values;
        const n_sub = args.subset_points.length;
        const n = args.keys.length;
        const subset_points = args.subset_points;
        let cl = 0;
        for (let i = 1; i < n_sub; i++) {
            cl += Math.abs(values[subset_points[i]] - values[subset_points[i - 1]]);
        }
        cl /= (n_sub - 1);
        const n_mr = n - 1;
        const rtn = {
            keys: args.keys.slice(1),
            values: new Array(n_mr),
            numerators: plotted.numerators?.slice(1),
            denominators: plotted.denominators?.slice(1),
            target: new Array(n_mr),
            ll99: new Array(n_mr),
            ll95: new Array(n_mr),
            ll68: new Array(n_mr),
            ul68: new Array(n_mr),
            ul95: new Array(n_mr),
            ul99: new Array(n_mr)
        };
        const sigma = 3.267 / 3;
        const twoSigma = 2 * sigma;
        const threeSigma = 3 * sigma;
        const ul68 = cl * sigma;
        const ul95 = cl * twoSigma;
        const ul99 = cl * threeSigma;
        for (let i = 0; i < n_mr; i++) {
            rtn.values[i] = Math.abs(values[i + 1] - values[i]);
            rtn.target[i] = cl;
            rtn.ll99[i] = 0;
            rtn.ll95[i] = 0;
            rtn.ll68[i] = 0;
            rtn.ul68[i] = ul68;
            rtn.ul95[i] = ul95;
            rtn.ul99[i] = ul99;
        }
        return rtn;
    }

    function pLimits(args) {
        const numerators = args.numerators;
        const denominators = args.denominators;
        const subset_points = args.subset_points;
        const n_sub = subset_points.length;
        let sum_num = 0;
        let sum_den = 0;
        for (let i = 0; i < n_sub; i++) {
            sum_num += numerators[subset_points[i]];
            sum_den += denominators[subset_points[i]];
        }
        const cl = sum_num / sum_den;
        const cl_mult = cl * (1 - cl);
        const n = args.keys.length;
        const rtn = {
            keys: args.keys,
            values: new Array(n),
            numerators: args.numerators,
            denominators: args.denominators,
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        for (let i = 0; i < n; i++) {
            const sigma = Math.sqrt(cl_mult / denominators[i]);
            const twoSigma = 2 * sigma;
            const threeSigma = 3 * sigma;
            rtn.values[i] = numerators[i] / denominators[i];
            rtn.target[i] = cl;
            rtn.ll99[i] = Math.max(0, cl - threeSigma);
            rtn.ll95[i] = Math.max(0, cl - twoSigma);
            rtn.ll68[i] = Math.max(0, cl - sigma);
            rtn.ul68[i] = Math.min(1, cl + sigma);
            rtn.ul95[i] = Math.min(1, cl + twoSigma);
            rtn.ul99[i] = Math.min(1, cl + threeSigma);
        }
        return rtn;
    }

    function pprimeLimits(args) {
        const n = args.keys.length;
        const numerators = args.numerators;
        const denominators = args.denominators;
        const subset_points = args.subset_points;
        const n_sub = subset_points.length;
        let sum_numerators = 0;
        let sum_denominators = 0;
        for (let i = 0; i < n_sub; i++) {
            let idx = subset_points[i];
            sum_numerators += numerators[idx];
            sum_denominators += denominators[idx];
        }
        const cl = sum_numerators / sum_denominators;
        if (cl === 0 || cl === 1) {
            const rtn = {
                keys: args.keys,
                values: new Array(n),
                numerators: args.numerators,
                denominators: args.denominators,
                target: new Array(n),
                ll99: new Array(n),
                ll95: new Array(n),
                ll68: new Array(n),
                ul68: new Array(n),
                ul95: new Array(n),
                ul99: new Array(n)
            };
            for (let i = 0; i < n; i++) {
                rtn.values[i] = numerators[i] / denominators[i];
                rtn.target[i] = cl;
                rtn.ll99[i] = cl;
                rtn.ll95[i] = cl;
                rtn.ll68[i] = cl;
                rtn.ul68[i] = cl;
                rtn.ul95[i] = cl;
                rtn.ul99[i] = cl;
            }
            return rtn;
        }
        const cl_mult = cl * (1 - cl);
        let val = new Array(n);
        let sd = new Array(n);
        for (let i = 0; i < n; i++) {
            val[i] = numerators[i] / denominators[i];
            sd[i] = Math.sqrt(cl_mult / denominators[i]);
        }
        let consec_diff = new Array(n_sub - 1);
        let prevZ = (val[subset_points[0]] - cl) / sd[subset_points[0]];
        for (let i = 1; i < n_sub; i++) {
            let currZ = (val[subset_points[i]] - cl) / sd[subset_points[i]];
            consec_diff[i - 1] = Math.abs(currZ - prevZ);
            prevZ = currZ;
        }
        const sigma_multiplier = averageMovingRange(consec_diff, args.outliers_in_limits) / 1.128;
        const rtn = {
            keys: args.keys,
            values: val,
            numerators: args.numerators,
            denominators: args.denominators,
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        for (let i = 0; i < n; i++) {
            const sigma = sd[i] * sigma_multiplier;
            const twoSigma = 2 * sigma;
            const threeSigma = 3 * sigma;
            rtn.target[i] = cl;
            rtn.ll99[i] = Math.max(0, cl - threeSigma);
            rtn.ll95[i] = Math.max(0, cl - twoSigma);
            rtn.ll68[i] = Math.max(0, cl - sigma);
            rtn.ul68[i] = Math.min(1, cl + sigma);
            rtn.ul95[i] = Math.min(1, cl + twoSigma);
            rtn.ul99[i] = Math.min(1, cl + threeSigma);
        }
        return rtn;
    }

    function runLimits(args) {
        const plotted = plottedValues(args);
        const n_sub = args.subset_points.length;
        const subset_points = args.subset_points;
        let ratio_subset = new Array(n_sub);
        for (let i = 0; i < n_sub; i++) {
            ratio_subset[i] = plotted.values[subset_points[i]];
        }
        const cl = math.median(ratio_subset);
        const n = args.keys.length;
        const rtn = {
            keys: args.keys,
            values: plotted.values,
            numerators: plotted.numerators,
            denominators: plotted.denominators,
            target: new Array(n)
        };
        for (let i = 0; i < n; i++) {
            rtn.target[i] = cl;
        }
        return rtn;
    }

    function withinGroupSd(group_sd, count_per_group, subset_points) {
        let varying = false;
        for (let i = 1; i < count_per_group.length; i++) {
            if (count_per_group[i] !== count_per_group[0]) {
                varying = true;
                break;
            }
        }
        const n_sub = subset_points.length;
        let sd_sum = 0;
        let weight_sum = 0;
        for (let i = 0; i < n_sub; i++) {
            const curr_sd = group_sd[subset_points[i]];
            if (varying) {
                const Nm1 = count_per_group[subset_points[i]] - 1;
                sd_sum += Nm1 * curr_sd * curr_sd;
                weight_sum += Nm1;
            }
            else {
                sd_sum += curr_sd;
                weight_sum += 1;
            }
        }
        return varying ? Math.sqrt(sd_sum / weight_sum) : sd_sum / weight_sum;
    }

    function sLimits(args) {
        const group_sd = args.numerators;
        const count_per_group = args.denominators;
        const cl = withinGroupSd(group_sd, count_per_group, args.subset_points);
        const n = args.keys.length;
        const rtn = {
            keys: args.keys,
            values: args.numerators,
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        for (let i = 0; i < n; i++) {
            const c5c4 = (math.c5(count_per_group[i]) / math.c4(count_per_group[i]));
            const sigma = cl * c5c4;
            const twoSigma = 2 * sigma;
            const threeSigma = 3 * sigma;
            rtn.target[i] = cl;
            rtn.ll99[i] = Math.max(0, cl - threeSigma);
            rtn.ll95[i] = Math.max(0, cl - twoSigma);
            rtn.ll68[i] = Math.max(0, cl - sigma);
            rtn.ul68[i] = cl + sigma;
            rtn.ul95[i] = cl + twoSigma;
            rtn.ul99[i] = cl + threeSigma;
        }
        return rtn;
    }

    function tLimits(args) {
        const n = args.keys.length;
        let val = new Array(n);
        for (let i = 0; i < n; i++) {
            val[i] = Math.pow(args.numerators[i], 1 / 3.6);
        }
        const inputArgsCopy = {
            numerators: val,
            keys: args.keys,
            subset_points: args.subset_points,
            outliers_in_limits: args.outliers_in_limits
        };
        const limits = iLimits(inputArgsCopy);
        const cl = Math.pow(limits.target[0], 3.6);
        const ll99 = limits.ll99[0] < 0 ? 0 : Math.pow(limits.ll99[0], 3.6);
        const ll95 = limits.ll95[0] < 0 ? 0 : Math.pow(limits.ll95[0], 3.6);
        const ll68 = limits.ll68[0] < 0 ? 0 : Math.pow(limits.ll68[0], 3.6);
        const ul68 = Math.pow(limits.ul68[0], 3.6);
        const ul95 = Math.pow(limits.ul95[0], 3.6);
        const ul99 = Math.pow(limits.ul99[0], 3.6);
        const rtn = {
            keys: args.keys,
            values: args.numerators,
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        for (let i = 0; i < n; i++) {
            rtn.target[i] = cl;
            rtn.ll99[i] = ll99;
            rtn.ll95[i] = ll95;
            rtn.ll68[i] = ll68;
            rtn.ul68[i] = ul68;
            rtn.ul95[i] = ul95;
            rtn.ul99[i] = ul99;
        }
        return rtn;
    }

    function uLimits(args) {
        const n = args.keys.length;
        const numerators = args.numerators;
        const denominators = args.denominators;
        const subset_points = args.subset_points;
        let sum_numerators = 0;
        let sum_denominators = 0;
        for (let i = 0; i < subset_points.length; i++) {
            let idx = subset_points[i];
            sum_numerators += numerators[idx];
            sum_denominators += denominators[idx];
        }
        const cl = sum_numerators / sum_denominators;
        const rtn = {
            keys: args.keys,
            values: new Array(n),
            numerators: args.numerators,
            denominators: args.denominators,
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        for (let i = 0; i < n; i++) {
            rtn.values[i] = numerators[i] / denominators[i];
            const sigma = Math.sqrt(cl / denominators[i]);
            const twoSigma = 2 * sigma;
            const threeSigma = 3 * sigma;
            rtn.target[i] = cl;
            rtn.ll99[i] = Math.max(0, cl - threeSigma);
            rtn.ll95[i] = Math.max(0, cl - twoSigma);
            rtn.ll68[i] = Math.max(0, cl - sigma);
            rtn.ul68[i] = cl + sigma;
            rtn.ul95[i] = cl + twoSigma;
            rtn.ul99[i] = cl + threeSigma;
        }
        return rtn;
    }

    function uprimeLimits(args) {
        const n = args.keys.length;
        const numerators = args.numerators;
        const denominators = args.denominators;
        const subset_points = args.subset_points;
        const n_sub = subset_points.length;
        let sum_numerators = 0;
        let sum_denominators = 0;
        for (let i = 0; i < n_sub; i++) {
            let idx = subset_points[i];
            sum_numerators += numerators[idx];
            sum_denominators += denominators[idx];
        }
        const cl = sum_numerators / sum_denominators;
        if (cl === 0) {
            const rtn = {
                keys: args.keys,
                values: new Array(n),
                numerators: args.numerators,
                denominators: args.denominators,
                target: new Array(n),
                ll99: new Array(n),
                ll95: new Array(n),
                ll68: new Array(n),
                ul68: new Array(n),
                ul95: new Array(n),
                ul99: new Array(n)
            };
            for (let i = 0; i < n; i++) {
                rtn.values[i] = numerators[i] / denominators[i];
                rtn.target[i] = cl;
                rtn.ll99[i] = cl;
                rtn.ll95[i] = cl;
                rtn.ll68[i] = cl;
                rtn.ul68[i] = cl;
                rtn.ul95[i] = cl;
                rtn.ul99[i] = cl;
            }
            return rtn;
        }
        let sd = new Array(n);
        let val = new Array(n);
        for (let i = 0; i < n; i++) {
            val[i] = numerators[i] / denominators[i];
            sd[i] = Math.sqrt(cl / denominators[i]);
        }
        let consec_diff = new Array(n_sub - 1);
        let prevZ = (val[subset_points[0]] - cl) / sd[subset_points[0]];
        for (let i = 1; i < n_sub; i++) {
            let currZ = (val[subset_points[i]] - cl) / sd[subset_points[i]];
            consec_diff[i - 1] = Math.abs(currZ - prevZ);
            prevZ = currZ;
        }
        const sigma_multiplier = averageMovingRange(consec_diff, args.outliers_in_limits) / 1.128;
        const rtn = {
            keys: args.keys,
            values: val,
            numerators: args.numerators,
            denominators: args.denominators,
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        for (let i = 0; i < n; i++) {
            const sigma = sd[i] * sigma_multiplier;
            const twoSigma = 2 * sigma;
            const threeSigma = 3 * sigma;
            rtn.target[i] = cl;
            rtn.ll99[i] = Math.max(0, cl - threeSigma);
            rtn.ll95[i] = Math.max(0, cl - twoSigma);
            rtn.ll68[i] = Math.max(0, cl - sigma);
            rtn.ul68[i] = cl + sigma;
            rtn.ul95[i] = cl + twoSigma;
            rtn.ul99[i] = cl + threeSigma;
        }
        return rtn;
    }

    function xbarLimits(args) {
        const count_per_group = args.denominators;
        const group_means = args.numerators;
        const group_sd = args.xbar_sds;
        const n_sub = args.subset_points.length;
        const subset_points = args.subset_points;
        let weighted_mean_sum = 0;
        let total_count = 0;
        for (let i = 0; i < n_sub; i++) {
            const curr_count = count_per_group[subset_points[i]];
            weighted_mean_sum += curr_count * group_means[subset_points[i]];
            total_count += curr_count;
        }
        const sd = withinGroupSd(group_sd, count_per_group, subset_points);
        const cl = weighted_mean_sum / total_count;
        const n = args.keys.length;
        const rtn = {
            keys: args.keys,
            values: args.numerators,
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n),
            count: args.denominators
        };
        for (let i = 0; i < n; i++) {
            const sigma = (math.a3(count_per_group[i]) * sd) / 3;
            const twoSigma = sigma * 2;
            const threeSigma = sigma * 3;
            rtn.target[i] = cl;
            rtn.ll99[i] = cl - threeSigma;
            rtn.ll95[i] = cl - twoSigma;
            rtn.ll68[i] = cl - sigma;
            rtn.ul68[i] = cl + sigma;
            rtn.ul95[i] = cl + twoSigma;
            rtn.ul99[i] = cl + threeSigma;
        }
        return rtn;
    }

    var limitFunctions = /*#__PURE__*/Object.freeze({
        __proto__: null,
        c: cLimits,
        g: gLimits,
        i: iLimits,
        i_m: imLimits,
        i_mm: immLimits,
        mr: mrLimits,
        p: pLimits,
        pp: pprimeLimits,
        r: runLimits,
        run: runLimits,
        s: sLimits,
        t: tLimits,
        u: uLimits,
        up: uprimeLimits,
        xbar: xbarLimits
    });

    const valueNames = {
        "i": "Observation",
        "i_m": "Observation",
        "i_mm": "Observation",
        "c": "Count",
        "t": "Time",
        "xbar": "Group Mean",
        "s": "Group SD",
        "g": "Non-Events",
        "run": "Observation",
        "mr": "Moving Range",
        "p": "Proportion",
        "pp": "Proportion",
        "u": "Rate",
        "up": "Rate"
    };
    class derivedSettingsClass {
        constructor(inputSettingsSpc) {
            const chartType = inputSettingsSpc.chart_type;
            this.chart_type_props = {
                name: chartType,
                needs_denominator: ["p", "pp", "u", "up", "xbar", "s"].includes(chartType),
                denominator_optional: ["i", "i_m", "i_mm", "run", "mr"].includes(chartType),
                numerator_non_negative: ["p", "pp", "u", "up", "s", "c", "g", "t"].includes(chartType),
                numerator_leq_denominator: ["p", "pp"].includes(chartType),
                has_control_limits: !(["run"].includes(chartType)),
                needs_sd: ["xbar"].includes(chartType),
                integer_num_den: ["c", "p", "pp"].includes(chartType),
                value_name: valueNames[chartType],
                x_axis_use_date: !(["g", "t"].includes(chartType)),
                date_name: !(["g", "t"].includes(chartType)) ? "Date" : "Event",
                denominator_gt_one: ["xbar", "s"].includes(chartType)
            };
            const scaling = data.deriveScaling(inputSettingsSpc, {
                proportion: this.chart_type_props.numerator_leq_denominator,
                wholeCounts: this.chart_type_props.integer_num_den,
                percentAllowed: true
            });
            this.multiplier = scaling.multiplier;
            this.percentLabels = scaling.percentLabels;
            this.formatValue = scaling.formatValue;
        }
    }

    const rules = [
        settings => {
            const patterns = settings.outliers;
            if (settings.nhs_icons.show_variation_icons && !patterns.astronomical && !patterns.shift && !patterns.trend && !patterns.two_in_three) {
                return "Variation icons require at least one outlier pattern to be selected";
            }
            return undefined;
        },
        settings => {
            const outliers = settings.outliers;
            const flagsOnSpecification = (outliers.astronomical && outliers.astronomical_limit === "Specification")
                || (outliers.two_in_three && outliers.two_in_three_limit === "Specification");
            if (flagsOnSpecification && !settings.lines.show_specification) {
                return "Flagging against specification limits requires the specification lines to be shown";
            }
            return undefined;
        },
        settings$1 => settings.orderedBoundsError(settings$1, settings$1.spc)
    ];
    class settingsClass {
        update(category, groupIdxs) {
            const result = powerbi.readSettingsGroups(settingsModel, category, groupIdxs, rules);
            this.settings = result.values;
            this.validationStatus = result.validation;
            this.messagePositionByRowIndex = result.messagePositionByRowIndex;
            this.derivedSettings = new Array(this.settings.length);
            for (let i = 0; i < this.settings.length; i++) {
                this.derivedSettings[i] = new derivedSettingsClass(this.settings[i].spc);
            }
        }
        getFormattingModel() {
            return powerbi.buildFormattingModel(settingsModel, this.settings[0]);
        }
        constructor() {
            this.messagePositionByRowIndex = new Map();
            this.validationStatus = { status: 0, messages: [] };
            this.settings = [settings.createDefaultValues(settingsModel)];
            this.derivedSettings = [new derivedSettingsClass(this.settings[0].spc)];
        }
    }

    function buildTooltip(table_row, inputTooltips, inputSettings, derivedSettings) {
        const ast_limit = inputSettings.outliers.astronomical_limit;
        const two_in_three_limit = inputSettings.outliers.two_in_three_limit;
        const formatValues = derivedSettings.formatValue;
        const tooltip = new Array();
        if (inputSettings.spc.ttip_show_date) {
            const ttip_label_date = inputSettings.spc.ttip_label_date;
            tooltip.push({
                displayName: ttip_label_date === "Automatic" ? derivedSettings.chart_type_props.date_name : ttip_label_date,
                value: table_row.date
            });
        }
        tooltip.push(...powerbi.valueTooltips(inputSettings.spc, table_row, derivedSettings.chart_type_props.value_name, formatValues));
        if (inputSettings.lines.ttip_show_trend && inputSettings.lines.show_trend) {
            tooltip.push({
                displayName: inputSettings.lines.ttip_label_trend,
                value: formatValues(table_row.trend_line, "value")
            });
        }
        if (inputSettings.lines.show_specification && inputSettings.lines.ttip_show_specification) {
            if (!data.isNullOrUndefined(table_row.speclimits_upper)) {
                tooltip.push({
                    displayName: `${inputSettings.lines.ttip_label_specification_prefix_upper}${inputSettings.lines.ttip_label_specification}`,
                    value: formatValues(table_row.speclimits_upper, "value")
                });
            }
            if (!data.isNullOrUndefined(table_row.speclimits_lower)) {
                tooltip.push({
                    displayName: `${inputSettings.lines.ttip_label_specification_prefix_lower}${inputSettings.lines.ttip_label_specification}`,
                    value: formatValues(table_row.speclimits_lower, "value")
                });
            }
        }
        tooltip.push(...powerbi.limitTooltips(inputSettings.lines, table_row, formatValues, derivedSettings.chart_type_props.has_control_limits));
        const patterns = new Array();
        if (table_row.astpoint !== "none") {
            let flag_text = "Astronomical Point";
            if (ast_limit !== "3 Sigma") {
                flag_text = `${flag_text} (${ast_limit})`;
            }
            patterns.push(flag_text);
        }
        if (table_row.trend !== "none") {
            patterns.push("Trend");
        }
        if (table_row.shift !== "none") {
            patterns.push("Shift");
        }
        if (table_row.two_in_three !== "none") {
            let flag_text = "Two-in-Three";
            if (two_in_three_limit !== "2 Sigma") {
                flag_text = `${flag_text} (${two_in_three_limit})`;
            }
            patterns.push(flag_text);
        }
        powerbi.appendPatternTooltips(tooltip, patterns, inputTooltips);
        return tooltip;
    }

    const weekdayDateMap = {
        "DD": null,
        "Thurs DD": "short",
        "Thursday DD": "long",
        "(blank)": null
    };
    const monthDateMap = {
        "MM": "2-digit",
        "Mon": "short",
        "Month": "long",
        "(blank)": null
    };
    const yearDateMap = {
        "YYYY": "numeric",
        "YY": "2-digit",
        "(blank)": null
    };
    const dayDateMap = {
        "DD": "2-digit",
        "Thurs DD": "2-digit",
        "Thursday DD": "2-digit",
        "(blank)": null
    };
    const dateOptionsLookup = {
        "weekday": weekdayDateMap,
        "day": dayDateMap,
        "month": monthDateMap,
        "year": yearDateMap
    };
    function dateSettingsToFormatOptions(date_settings) {
        const formatOpts = new Array();
        const keys = Object.keys(date_settings);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key !== "date_format_locale" && key !== "date_format_delim") {
                const formattedKey = key.replace("date_format_", "");
                const lookup = dateOptionsLookup[formattedKey];
                const dateSettingValue = date_settings[key];
                const val = lookup[dateSettingValue];
                if (!data.isNullOrUndefined(val)) {
                    formatOpts.push([formattedKey, val]);
                    if (formattedKey === "day" && dateSettingValue !== "DD" && !data.isNullOrUndefined(weekdayDateMap[dateSettingValue])) {
                        formatOpts.push(["weekday", weekdayDateMap[dateSettingValue]]);
                    }
                }
            }
        }
        return Object.fromEntries(formatOpts);
    }

    const monthNameToNumber = {
        "January": 0,
        "February": 1,
        "March": 2,
        "April": 3,
        "May": 4,
        "June": 5,
        "July": 6,
        "August": 7,
        "September": 8,
        "October": 9,
        "November": 10,
        "December": 11
    };
    function temporalTypeToKey(inputType, inputValue) {
        if (!inputType.temporal) {
            return [];
        }
        if (inputType.category === "DayOfMonth") {
            return ["day", (inputValue)];
        }
        else if (inputType.category === "Months") {
            return ["month", monthNameToNumber[(inputValue)]];
        }
        else if (inputType.category === "Quarters") {
            return ["quarter", inputValue];
        }
        else if (inputType.category === "Years") {
            return ["year", (inputValue)];
        }
        else {
            return [];
        }
    }
    function parseInputDates(inputs, idxs) {
        const n_keys = idxs.length;
        let inputDates = [];
        const inputQuarters = [];
        if (inputs.length > 1) {
            for (let i = 0; i < n_keys; i++) {
                const datePartsArray = [];
                for (let j = 0; j < inputs.length; j++) {
                    datePartsArray.push(temporalTypeToKey(inputs[j].source.type, inputs[j].values[idxs[i]]));
                }
                const datePartsObj = Object.fromEntries(datePartsArray);
                if (datePartsObj.quarter) {
                    inputQuarters.push(datePartsObj.quarter);
                }
                inputDates[i] = new Date(datePartsObj.year ?? 1970, datePartsObj.month ?? 0, datePartsObj.day ?? 1);
            }
        }
        else {
            for (let i = 0; i < n_keys; i++) {
                const value = inputs[0].values[idxs[i]];
                inputDates[i] = data.isNullOrUndefined(value) ? undefined : new Date(value);
            }
        }
        return { dates: inputDates, quarters: inputQuarters };
    }

    const weekdayShort = {
        "en-GB": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "en-US": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    };
    const weekdayLong = {
        "en-GB": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "en-US": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    };
    const monthShort = {
        "en-GB": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        "en-US": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    };
    const monthLong = {
        "en-GB": ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"],
        "en-US": ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"]
    };
    function formatDateParts(date, locale, options) {
        const result = {
            weekday: "",
            day: "",
            month: "",
            year: ""
        };
        if (options.weekday === "short") {
            result.weekday = weekdayShort[locale][date.getDay()];
        }
        else if (options.weekday === "long") {
            result.weekday = weekdayLong[locale][date.getDay()];
        }
        if (options.day === "2-digit") {
            result.day = String(date.getDate()).padStart(2, "0");
        }
        if (options.month === "2-digit") {
            result.month = String(date.getMonth() + 1).padStart(2, "0");
        }
        else if (options.month === "short") {
            result.month = monthShort[locale][date.getMonth()];
        }
        else if (options.month === "long") {
            result.month = monthLong[locale][date.getMonth()];
        }
        if (options.year === "numeric") {
            result.year = String(date.getFullYear());
        }
        else if (options.year === "2-digit") {
            result.year = String(date.getFullYear()).slice(-2);
        }
        return result;
    }

    function formatKeys(col, inputSettings, idxs) {
        const n_keys = idxs.length;
        let ret = new Array(n_keys);
        if (col.length === 1 && !(col[0].source.type?.temporal)) {
            for (let i = 0; i < n_keys; i++) {
                ret[i] = powerbi.formatPrimitiveValue(col[0].values[idxs[i]]);
            }
            return ret;
        }
        const delim = inputSettings.dates.date_format_delim;
        let allTemporal = true;
        for (let i = 0; i < col.length; i++) {
            if (!col[i].source.type?.temporal) {
                allTemporal = false;
            }
        }
        if (!allTemporal) {
            const blankKey = delim.repeat(col.length - 1);
            for (let i = 0; i < n_keys; i++) {
                let key = "";
                for (let j = 0; j < col.length; j++) {
                    if (j > 0) {
                        key += delim;
                    }
                    key += powerbi.formatPrimitiveValue(col[j].values[idxs[i]]) ?? "";
                }
                ret[i] = key === blankKey ? undefined : key;
            }
            return ret;
        }
        const inputDates = parseInputDates(col, idxs);
        const formatOptions = dateSettingsToFormatOptions(inputSettings.dates);
        const locale = inputSettings.dates.date_format_locale;
        const day_elem = locale === "en-GB" ? "day" : "month";
        const month_elem = locale === "en-GB" ? "month" : "day";
        for (let i = 0; i < n_keys; i++) {
            const date = inputDates.dates[i];
            if (data.isNullOrUndefined(date)) {
                ret[i] = undefined;
            }
            else {
                const datePartsRecord = formatDateParts(date, locale, formatOptions);
                const datePartStrings = [(datePartsRecord.weekday + " " + datePartsRecord[day_elem]).trim(),
                    datePartsRecord[month_elem],
                    inputDates.quarters[i] ?? "",
                    datePartsRecord.year];
                let key = "";
                let partCount = 0;
                for (let j = 0; j < datePartStrings.length; j++) {
                    if (!datePartStrings[j].trim()) {
                        continue;
                    }
                    if (partCount++ > 0) {
                        key += delim;
                    }
                    key += datePartStrings[j];
                }
                ret[i] = key;
            }
        }
        return ret;
    }
    function extractKeys(col, inputSettings, idxs) {
        const groupedCols = Object.create(null);
        for (let i = 0; i < col.length; i++) {
            let queryName = col[i].source.queryName ?? "";
            if (queryName.includes("Date Hierarchy")) {
                const lastDot = queryName.lastIndexOf(".");
                if (lastDot !== -1) {
                    queryName = queryName.substring(0, lastDot);
                }
            }
            (groupedCols[queryName] ?? (groupedCols[queryName] = [])).push(col[i]);
        }
        const queryNames = Object.keys(groupedCols);
        const combinedKeys = new Array(idxs.length);
        for (let i = 0; i < queryNames.length; i++) {
            const groupKeys = formatKeys(groupedCols[queryNames[i]], inputSettings, idxs);
            for (let j = 0; j < idxs.length; j++) {
                const key = groupKeys[j];
                if (i === 0 || combinedKeys[j] === undefined) {
                    combinedKeys[j] = key;
                }
                else if (key !== undefined) {
                    combinedKeys[j] += ` ${key}`;
                }
            }
        }
        return combinedKeys;
    }

    function validateInputData(keys, numerators, denominators, xbar_sds, chart_type_props) {
        const check_denom = chart_type_props.needs_denominator
            || (chart_type_props.denominator_optional && denominators !== undefined && denominators.length > 0);
        const at = (values, i) => values?.[i] ?? NaN;
        const rules = [];
        if (chart_type_props.needs_sd) {
            rules.push({
                fails: i => data.isNullOrUndefined(xbar_sds?.[i]),
                message: "SD missing",
                all: "All SDs missing or null!"
            }, {
                fails: i => Number.isNaN(at(xbar_sds, i)) && !data.isNullOrUndefined(numerators[i]),
                message: "SD is not a number",
                all: "All SDs are not numbers!"
            }, {
                fails: i => at(xbar_sds, i) < 0,
                message: "SD negative",
                all: "All SDs are negative!"
            });
        }
        if (check_denom) {
            rules.push({
                fails: i => data.isNullOrUndefined(denominators?.[i]),
                message: "Denominator missing",
                all: "All denominators missing or null!"
            }, {
                fails: i => Number.isNaN(at(denominators, i)),
                message: "Denominator is not a number",
                all: "All denominators are not numbers!"
            }, {
                fails: i => at(denominators, i) < 0,
                message: "Denominator negative",
                all: "All denominators are negative!"
            }, {
                fails: i => chart_type_props.numerator_leq_denominator && !data.isNullOrUndefined(numerators[i]) && at(denominators, i) < at(numerators, i),
                message: "Denominator < numerator",
                all: "All denominators are smaller than numerators!"
            }, {
                fails: i => chart_type_props.denominator_gt_one && at(denominators, i) <= 1,
                message: "Denominator <= 1",
                all: "All denominators are less than or equal to one!"
            });
        }
        rules.push({
            fails: i => data.isNullOrUndefined(numerators[i]),
            message: "Numerator missing",
            all: "All numerators are missing or null!"
        }, {
            fails: i => Number.isNaN(at(numerators, i)),
            message: "Numerator is not a number",
            all: "All numerators are not numbers!"
        }, {
            fails: i => chart_type_props.numerator_non_negative && at(numerators, i) < 0,
            message: "Numerator negative",
            all: "All numerators are negative!"
        }, {
            fails: i => data.isNullOrUndefined(keys[i]),
            message: "Date missing",
            all: "All dates/IDs are missing or null!"
        });
        return data.validateRows(keys.length, rules);
    }

    function extractInputData(view, inputSettings, derivedSettings, validationMessages, idxs, messagePositionByRowIndex) {
        const categories = view.category;
        const denominatorColumn = view.values.denominators?.[0];
        const sdColumn = view.values.xbar_sds?.[0];
        const chart = derivedSettings.chart_type_props;
        const useDenominators = chart.needs_denominator || (chart.denominator_optional && denominatorColumn !== undefined);
        const keys = extractKeys(view.categories.key, inputSettings, idxs);
        const numerators = powerbi.readNumbers(view.values.numerators[0], idxs);
        const denominators = useDenominators && denominatorColumn !== undefined ? powerbi.readNumbers(denominatorColumn, idxs) : undefined;
        const xbar_sds = chart.needs_sd && sdColumn !== undefined ? powerbi.readNumbers(sdColumn, idxs) : undefined;
        const validation = validateInputData(keys, numerators, denominators, xbar_sds, chart);
        if (validation.status !== 0) {
            return { status: "invalid", error: validation.error };
        }
        const kept = data.keptPositions(validation.messages);
        const groupings = view.values.groupings?.[0];
        const lines = powerbi.readSettingsRows(settingsModel.lines, "lines", defaultSettings.lines, categories, idxs).values;
        const spcSettings = powerbi.readSettingsRows(settingsModel.spc, "spc", defaultSettings.spc, categories, [idxs[0]]).values[0];
        const keptKeys = data.keptValues(keys, kept);
        const limitInputArgs = {
            keys: new Array(kept.length),
            numerators: data.keptValues(numerators, kept),
            denominators: denominators === undefined ? undefined : data.keptValues(denominators, kept),
            xbar_sds: xbar_sds === undefined ? undefined : data.keptValues(xbar_sds, kept),
            outliers_in_limits: spcSettings.outliers_in_limits
        };
        const showAltTarget = inputSettings.lines.show_alt_target;
        const showSpecification = inputSettings.lines.show_specification;
        const line_formatting = new Array(kept.length);
        const alt_target = new Array(kept.length);
        const speclimits_lower = new Array(kept.length);
        const speclimits_upper = new Array(kept.length);
        const groupingIndexes = [];
        let currentGrouping;
        for (let x = 0; x < kept.length; x++) {
            const i = kept[x];
            const row = idxs[i];
            limitInputArgs.keys[x] = { x, id: row, label: chart.x_axis_use_date ? keptKeys[x] : String(x) };
            line_formatting[x] = lines[i];
            alt_target[x] = showAltTarget ? lines[i].alt_target : undefined;
            speclimits_lower[x] = showSpecification ? lines[i].specification_lower : undefined;
            speclimits_upper[x] = showSpecification ? lines[i].specification_upper : undefined;
            if (groupings !== undefined) {
                const grouping = powerbi.formatPrimitiveValue(groupings.values[row]);
                if (x > 0 && grouping !== currentGrouping) {
                    groupingIndexes.push(x - 1);
                }
                currentGrouping = grouping;
            }
        }
        const groupName = categories.source.displayName;
        const removalMessages = powerbi.rowWarnings(groupName, idxs, keys, validation.messages, {
            messages: validationMessages,
            messagePositionByRowIndex
        });
        if (inputSettings.nhs_icons.show_assurance_icons) {
            if (showAltTarget && alt_target.length > 0 && alt_target[alt_target.length - 1] === undefined) {
                removalMessages.push("NHS Assurance icon requires a valid alt. target at last observation.");
            }
            if (!chart.has_control_limits) {
                removalMessages.push("NHS Assurance icon requires chart with control limits.");
            }
        }
        const annotations = powerbi.readRowAnnotations({
            categorical: view.categorical,
            values: view.values,
            categories,
            cards: { scatter: settingsModel.scatter, labels: settingsModel.labels },
            defaults: { scatter: defaultSettings.scatter, labels: defaultSettings.labels }
        }, idxs, kept);
        return {
            status: "valid",
            data: {
                ...annotations,
                limitInputArgs,
                spcSettings,
                categories,
                groupingIndexes,
                line_formatting,
                alt_target,
                speclimits_lower,
                speclimits_upper,
                warningMessage: removalMessages.join("\n"),
                validationStatus: validation
            }
        };
    }

    function validateDataViewColumns(inputSettingsClass, valueColumns) {
        for (let i = 0; i < inputSettingsClass.derivedSettings.length; i++) {
            const props = inputSettingsClass.derivedSettings[i].chart_type_props;
            if (props.needs_denominator && valueColumns.denominators === undefined) {
                return `Chart type '${props.name}' requires denominators!`;
            }
            if (props.needs_sd && valueColumns.xbar_sds === undefined) {
                return `Chart type '${props.name}' requires SDs!`;
            }
        }
        return "valid";
    }

    function finiteMin(current, value) {
        return data.isValidNumber(value) ? Math.min(current, value) : current;
    }
    function finiteMax(current, value) {
        return data.isValidNumber(value) ? Math.max(current, value) : current;
    }
    function axisRanges(viewModel) {
        const controlLimits = viewModel.controlLimits[0];
        const inputSettings = viewModel.inputSettings.settings[0];
        const derivedSettings = viewModel.inputSettings.derivedSettings[0];
        const limitMultiplier = inputSettings.y_axis.limit_multiplier;
        let maxValue = Number.NEGATIVE_INFINITY;
        let minValue = Number.POSITIVE_INFINITY;
        let maxValueOrLimit = Number.NEGATIVE_INFINITY;
        let minValueOrLimit = Number.POSITIVE_INFINITY;
        let maxTarget = Number.NEGATIVE_INFINITY;
        let minTarget = Number.POSITIVE_INFINITY;
        let minKey = Number.POSITIVE_INFINITY;
        let maxKey = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < controlLimits.keys.length; i++) {
            const value = controlLimits.values[i];
            const altTarget = controlLimits.alt_target[i];
            const target = controlLimits.target[i];
            maxValue = finiteMax(maxValue, value);
            minValue = finiteMin(minValue, value);
            maxValueOrLimit = finiteMax(maxValueOrLimit, value);
            maxValueOrLimit = finiteMax(maxValueOrLimit, controlLimits.ul99[i]);
            maxValueOrLimit = finiteMax(maxValueOrLimit, controlLimits.speclimits_upper[i]);
            maxValueOrLimit = finiteMax(maxValueOrLimit, altTarget);
            minValueOrLimit = finiteMin(minValueOrLimit, value);
            minValueOrLimit = finiteMin(minValueOrLimit, controlLimits.ll99[i]);
            minValueOrLimit = finiteMin(minValueOrLimit, controlLimits.speclimits_lower[i]);
            minValueOrLimit = finiteMin(minValueOrLimit, altTarget);
            maxTarget = finiteMax(maxTarget, target);
            minTarget = finiteMin(minTarget, target);
            minKey = Math.min(minKey, controlLimits.keys[i].x);
            maxKey = Math.max(maxKey, controlLimits.keys[i].x);
        }
        if (!data.isValidNumber(maxTarget)) {
            maxTarget = (maxValueOrLimit - minValueOrLimit) / 2 + minValueOrLimit;
        }
        if (!data.isValidNumber(minTarget)) {
            minTarget = (maxValueOrLimit - minValueOrLimit) / 2 + minValueOrLimit;
        }
        const upperLimitRaw = maxTarget + (maxValueOrLimit - maxTarget) * limitMultiplier;
        const lowerLimitRaw = minTarget - (minTarget - minValueOrLimit) * limitMultiplier;
        const multiplier = derivedSettings.multiplier;
        const yUpperLimit = inputSettings.y_axis.ylimit_u
            ?? ((derivedSettings.percentLabels && !(maxValue > (1 * multiplier))) ? Math.min(upperLimitRaw, 1 * multiplier) : upperLimitRaw);
        const yLowerLimit = inputSettings.y_axis.ylimit_l
            ?? ((derivedSettings.percentLabels && !(minValue < 0)) ? Math.max(lowerLimitRaw, 0) : lowerLimitRaw);
        return {
            x: {
                lower: inputSettings.x_axis.xlimit_l ?? minKey,
                upper: inputSettings.x_axis.xlimit_u ?? maxKey
            },
            y: { lower: yLowerLimit, upper: yUpperLimit }
        };
    }

    const lineKeys = {
        ...settings.standardLineKeys,
        values: "main",
        speclimits_lower: "specification",
        speclimits_upper: "specification",
        trend_line: "trend"
    };

    const limitSeries = Object.keys({
        numerators: true,
        denominators: true,
        target: true,
        ll99: true,
        ll95: true,
        ll68: true,
        ul68: true,
        ul95: true,
        ul99: true,
        count: true,
        alt_target: true,
        speclimits_lower: true,
        speclimits_upper: true,
        trend_line: true
    });
    function copyInto(target, source, offset) {
        for (let i = 0; i < source.length; i++) {
            target[offset + i] = source[i];
        }
    }
    function anyIcon(icons, names) {
        for (let i = 0; i < icons.length; i++) {
            if (names.includes(icons[i])) {
                return true;
            }
        }
        return false;
    }
    function lineColumns(settings, hasDenominators, hasControlLimits) {
        const lines = settings.lines;
        const columns = new Array();
        if (lines.show_main) {
            columns.push({ name: "value", label: "Value" });
        }
        if (hasDenominators && settings.spc.ttip_show_numerator) {
            columns.push({ name: "numerator", label: "Numerator" });
        }
        if (hasDenominators && settings.spc.ttip_show_denominator) {
            columns.push({ name: "denominator", label: "Denominator" });
        }
        if (lines.show_trend) {
            columns.push({ name: "trend_line", label: lines.ttip_label_trend });
        }
        if (lines.show_specification) {
            columns.push({
                name: "speclimits_upper",
                label: `${lines.ttip_label_specification_prefix_upper}${lines.ttip_label_specification}`
            }, {
                name: "speclimits_lower",
                label: `${lines.ttip_label_specification_prefix_lower}${lines.ttip_label_specification}`
            });
        }
        const levels = ["99", "95", "68"];
        for (let l = 0; l < levels.length; l++) {
            const level = levels[l];
            if (hasControlLimits && lines[`show_${level}`]) {
                columns.push({ name: `ul${level}`, label: `${lines[`ttip_label_${level}_prefix_upper`]}${lines[`ttip_label_${level}`]}` });
            }
        }
        if (lines.show_target) {
            columns.push({ name: "target", label: lines.ttip_label_target });
        }
        if (lines.show_alt_target) {
            columns.push({ name: "alt_target", label: lines.ttip_label_alt_target });
        }
        for (let l = levels.length - 1; l >= 0; l--) {
            const level = levels[l];
            if (hasControlLimits && lines[`show_${level}`]) {
                columns.push({ name: `ll${level}`, label: `${lines[`ttip_label_${level}_prefix_lower`]}${lines[`ttip_label_${level}`]}` });
            }
        }
        return columns;
    }
    class viewModelClass {
        get showGrouped() {
            return this.inputData && this.inputData.length > 1;
        }
        constructor() {
            this.inputData = new Array();
            this.inputSettings = new settingsClass();
            this.controlLimits = new Array();
            this.outliers = new Array();
            this.plotPoints = [];
            this.groupedRows = [];
            this.groupedLines = [];
            this.rebaselineEnds = [];
            this.firstRun = true;
            this.splitIndexes = new Array();
            this.groupStartEndIndexes = new Array();
            this.identities = new Array();
            this.tableColumns = new Array();
            this.colourPalette = {};
            this.headless = false;
            this.frontend = false;
            this.tickLabels = [];
            this.svgWidth = 0;
            this.svgHeight = 0;
            this.indicatorVarNames = [];
            this.groupNames = [];
        }
        update(options, host) {
            this.colourPalette = powerbi.readColourPalette(host);
            const checkView = powerbi.validateDataView(options.dataViews, ["numerators"]);
            if (checkView.status !== "valid") {
                return { status: false, error: checkView.error };
            }
            const view = checkView.view;
            this.svgWidth = options.viewport.width;
            this.svgHeight = options.viewport.height;
            this.headless = options.headless ?? false;
            this.frontend = options.frontend ?? false;
            const indicator_cols = view.categories.indicator ?? [];
            this.indicatorVarNames = new Array(indicator_cols.length);
            for (let i = 0; i < indicator_cols.length; i++) {
                this.indicatorVarNames[i] = indicator_cols[i].source.displayName;
            }
            const indicatorGroups = powerbi.groupCategoryRows(indicator_cols, view.rowCount);
            const idx_per_indicator = indicatorGroups.rows;
            this.groupNames = indicatorGroups.names;
            const dataChanged = (options.type & (2 | 16)) !== 0 || this.firstRun;
            if (dataChanged) {
                this.inputSettings.update(view.category, idx_per_indicator);
            }
            const settingsValidation = this.inputSettings.validationStatus;
            if (settingsValidation.status !== 0) {
                return { status: false, error: settingsValidation.error, type: "settings" };
            }
            const checkDV = validateDataViewColumns(this.inputSettings, view.values);
            if (checkDV !== "valid") {
                return { status: false, error: checkDV };
            }
            const inputErrors = [];
            if (dataChanged) {
                const hasIndicator = indicator_cols.length > 0;
                const split_indexes_str = (view.dataView.metadata.objects?.split_indexes_storage?.split_indexes) ?? "[]";
                const split_indexes = JSON.parse(split_indexes_str);
                this.splitIndexes = hasIndicator ? [] : split_indexes;
                this.inputData = new Array();
                this.groupStartEndIndexes = new Array();
                this.controlLimits = new Array();
                this.outliers = new Array();
                this.identities = new Array();
                this.tableColumns = new Array();
                const messagePositionByRowIndex = this.inputSettings.messagePositionByRowIndex;
                for (let idx = 0; idx < idx_per_indicator.length; idx++) {
                    const group_idxs = idx_per_indicator[idx];
                    const settings = this.inputSettings.settings[idx];
                    const derivedSettings = this.inputSettings.derivedSettings[idx];
                    const extraction = extractInputData(view, settings, derivedSettings, this.inputSettings.validationStatus.messages, group_idxs, messagePositionByRowIndex);
                    if (extraction.status !== "valid") {
                        inputErrors.push(extraction.error);
                        continue;
                    }
                    const inpData = extraction.data;
                    this.inputData.push(inpData);
                    const inputGroupStartEnd = this.getGroupingIndexes(inpData, idx === 0 ? this.splitIndexes : undefined);
                    const limits = this.calculateLimits(inpData, inputGroupStartEnd, settings);
                    const groupStartEnd = this.getResultGroupIndexes(limits.keys, inputGroupStartEnd);
                    this.scaleLimits(limits, settings, derivedSettings);
                    this.truncateLimits(limits, settings);
                    const outliers = this.flagOutliers(limits, groupStartEnd, settings, derivedSettings);
                    const keys = inpData.limitInputArgs.keys;
                    const identities = new Array(keys.length);
                    for (let i = 0; i < keys.length; i++) {
                        identities[i] = host.createSelectionIdBuilder().withCategory(inpData.categories, keys[i].id).createSelectionId();
                    }
                    this.groupStartEndIndexes.push(groupStartEnd);
                    this.controlLimits.push(limits);
                    this.outliers.push(outliers);
                    this.identities.push(identities);
                }
                if (inputErrors.length === 0) {
                    if (this.showGrouped) {
                        this.initialisePlotDataGrouped();
                    }
                    else {
                        this.initialisePlotData(host);
                        this.initialiseGroupedLines();
                    }
                }
            }
            if (inputErrors.length > 0) {
                this.inputData = [];
                this.controlLimits = [];
                this.groupStartEndIndexes = [];
                this.outliers = [];
                this.identities = [];
                this.plotPoints = [];
                this.groupedRows = [];
                this.groupedLines = [];
                this.tickLabels = [];
                this.firstRun = true;
                return { status: false, error: inputErrors.join("\n") };
            }
            this.firstRun = false;
            const warnings = [];
            for (let i = 0; i < this.inputData.length; i++) {
                if (this.inputData[i].warningMessage !== "") {
                    warnings.push(this.inputData[i].warningMessage);
                }
            }
            if (!this.showGrouped) {
                const rangeError = rendering.axisRangeError(axisRanges(this));
                if (rangeError !== undefined) {
                    return { status: false, type: "settings", error: rangeError };
                }
            }
            return { status: true, warning: warnings.length > 0 ? warnings.join("\n") : undefined };
        }
        getGroupingIndexes(inputData, splitIndexes) {
            const candidateIndexes = (splitIndexes ?? [])
                .concat([-1])
                .concat(inputData.groupingIndexes)
                .concat([inputData.limitInputArgs.keys.length - 1]);
            const allIndexes = [];
            for (let i = 0; i < candidateIndexes.length; i++) {
                if (candidateIndexes.indexOf(candidateIndexes[i]) === i) {
                    allIndexes.push(candidateIndexes[i]);
                }
            }
            allIndexes.sort((a, b) => a - b);
            const groupStartEndIndexes = new Array();
            for (let i = 0; i < allIndexes.length - 1; i++) {
                groupStartEndIndexes.push([allIndexes[i] + 1, allIndexes[i + 1] + 1]);
            }
            return groupStartEndIndexes;
        }
        getResultGroupIndexes(keys, inputGroupStartEnd) {
            const result = new Array(inputGroupStartEnd.length);
            let position = 0;
            for (let i = 0; i < inputGroupStartEnd.length; i++) {
                const start = position;
                while (position < keys.length && keys[position].x < inputGroupStartEnd[i][1]) {
                    position++;
                }
                result[i] = [start, position];
            }
            return result;
        }
        calculateLimits(inputData, groupStartEndIndexes, inputSettings) {
            const limitFunction = limitFunctions[inputSettings.spc.chart_type];
            const num_points_subset = inputSettings.spc.num_points_subset;
            const subset_points_from = inputSettings.spc.subset_points_from;
            const subset_rebaselines = inputSettings.spc.subset_rebaselines;
            const args = inputData.limitInputArgs;
            const controlLimits = {
                keys: [],
                values: [],
                numerators: [],
                denominators: [],
                target: [],
                ll99: [],
                ll95: [],
                ll68: [],
                ul68: [],
                ul95: [],
                ul99: [],
                count: [],
                alt_target: [],
                speclimits_lower: [],
                speclimits_upper: [],
                trend_line: []
            };
            for (let g = 0; g < groupStartEndIndexes.length; g++) {
                const start = groupStartEndIndexes[g][0];
                const end = groupStartEndIndexes[g][1];
                const n = end - start;
                const applySubset = g === 0 || subset_rebaselines;
                const subsetCount = applySubset && !data.isNullOrUndefined(num_points_subset) && math.between(num_points_subset, 1, n)
                    ? num_points_subset : n;
                const subsetStart = subset_points_from === "Start" ? 0 : n - subsetCount;
                const group = limitFunction({
                    keys: args.keys.slice(start, end),
                    numerators: args.numerators.slice(start, end),
                    denominators: args.denominators?.slice(start, end),
                    xbar_sds: args.xbar_sds?.slice(start, end),
                    outliers_in_limits: inputSettings.spc.outliers_in_limits,
                    subset_points: math.sequence(subsetStart, subsetCount, 1)
                });
                group.trend_line = math.calculateTrendLine(group.values);
                controlLimits.keys = controlLimits.keys.concat(group.keys);
                controlLimits.values = controlLimits.values.concat(group.values);
                for (let s = 0; s < limitSeries.length; s++) {
                    const name = limitSeries[s];
                    controlLimits[name] = controlLimits[name].concat(group[name] ?? math.rep(undefined, group.keys.length));
                }
            }
            const positions = new Array(controlLimits.keys.length);
            for (let i = 0; i < positions.length; i++) {
                positions[i] = controlLimits.keys[i].x;
            }
            controlLimits.alt_target = data.pickRows(inputData.alt_target, positions);
            controlLimits.speclimits_lower = data.pickRows(inputData.speclimits_lower, positions);
            controlLimits.speclimits_upper = data.pickRows(inputData.speclimits_upper, positions);
            for (let s = 0; s < limitSeries.length; s++) {
                const series = controlLimits[limitSeries[s]];
                for (let i = 0; i < series.length; i++) {
                    if (!data.isValidNumber(series[i])) {
                        series[i] = undefined;
                    }
                }
            }
            return controlLimits;
        }
        initialisePlotDataGrouped() {
            this.plotPoints = [];
            this.groupedRows = [];
            this.tableColumns = new Array();
            const tableColumnsDef = new Array();
            for (let i = 0; i < this.indicatorVarNames.length; i++) {
                tableColumnsDef.push({ name: this.indicatorVarNames[i], label: this.indicatorVarNames[i] });
            }
            tableColumnsDef.push({ name: "latest_date", label: "Latest Date" });
            let anyDenominators = false;
            let anyControlLimits = false;
            for (let i = 0; i < this.inputData.length; i++) {
                anyDenominators = anyDenominators || this.inputData[i].limitInputArgs.denominators !== undefined;
                anyControlLimits = anyControlLimits || this.inputSettings.derivedSettings[i].chart_type_props.has_control_limits;
            }
            tableColumnsDef.push(...lineColumns(this.inputSettings.settings[0], anyDenominators, anyControlLimits));
            const nhsIconSettings = this.inputSettings.settings[0].nhs_icons;
            if (nhsIconSettings.show_variation_icons) {
                tableColumnsDef.push({ name: "variation", label: "Variation" });
            }
            if (nhsIconSettings.show_assurance_icons) {
                tableColumnsDef.push({ name: "assurance", label: "Assurance" });
            }
            let anyTooltips = false;
            for (let i = 0; i < this.inputData.length && !anyTooltips; i++) {
                const rowTooltips = this.inputData[i].tooltips;
                for (let j = 0; j < rowTooltips.length && !anyTooltips; j++) {
                    anyTooltips = rowTooltips[j].length > 0;
                }
            }
            if (anyTooltips) {
                const firstTooltips = this.inputData[0].tooltips[0];
                for (let i = 0; i < firstTooltips.length; i++) {
                    tableColumnsDef.push({ name: firstTooltips[i].displayName, label: firstTooltips[i].displayName });
                }
            }
            this.tableColumns[0] = tableColumnsDef;
            for (let i = 0; i < this.groupNames.length; i++) {
                const formatValues = this.inputSettings.derivedSettings[i].formatValue;
                const varIconFilter = this.inputSettings.settings[i].summary_table.table_variation_filter;
                const assIconFilter = this.inputSettings.settings[i].summary_table.table_assurance_filter;
                const limits = this.controlLimits[i];
                const outliers = this.outliers[i];
                const lastIndex = limits.keys.length - 1;
                const varIcons = variationIconsToDraw(outliers, this.inputSettings.settings[i]);
                if (varIconFilter !== "all") {
                    if (varIconFilter === "improvement" && !anyIcon(varIcons, ["improvementHigh", "improvementLow"])) {
                        continue;
                    }
                    if (varIconFilter === "deterioration" && !anyIcon(varIcons, ["concernHigh", "concernLow"])) {
                        continue;
                    }
                    if (varIconFilter === "neutral" && !anyIcon(varIcons, ["neutralHigh", "neutralLow"])) {
                        continue;
                    }
                    if (varIconFilter === "common" && varIcons[0] !== "commonCause") {
                        continue;
                    }
                    if (varIconFilter === "special" && varIcons[0] === "commonCause") {
                        continue;
                    }
                }
                const assIcon = assuranceIconToDraw(limits, this.inputSettings.settings[i], this.inputSettings.derivedSettings[i]);
                if (assIconFilter !== "all") {
                    if (assIconFilter === "any" && assIcon === "inconsistent") {
                        continue;
                    }
                    if (assIconFilter === "pass" && assIcon !== "consistentPass") {
                        continue;
                    }
                    if (assIconFilter === "fail" && assIcon !== "consistentFail") {
                        continue;
                    }
                    if (assIconFilter === "inconsistent" && assIcon !== "inconsistent") {
                        continue;
                    }
                }
                const indicatorColumns = {};
                for (let idx = 0; idx < this.indicatorVarNames.length; idx++) {
                    indicatorColumns[this.indicatorVarNames[idx]] = this.groupNames[i][idx];
                }
                const tooltipColumns = {};
                if (anyTooltips) {
                    const rowTooltips = this.inputData[i].tooltips[lastIndex];
                    for (let t = 0; t < rowTooltips.length; t++) {
                        tooltipColumns[rowTooltips[t].displayName] = rowTooltips[t].value;
                    }
                }
                const table_row = {
                    ...indicatorColumns,
                    latest_date: limits.keys[lastIndex].label,
                    value: formatValues(limits.values[lastIndex], "value"),
                    numerator: formatValues(limits.numerators[lastIndex], "integer"),
                    denominator: formatValues(limits.denominators[lastIndex], "integer"),
                    target: formatValues(limits.target[lastIndex], "value"),
                    alt_target: formatValues(limits.alt_target[lastIndex], "value"),
                    ul99: formatValues(limits.ul99[lastIndex], "value"),
                    ul95: formatValues(limits.ul95[lastIndex], "value"),
                    ul68: formatValues(limits.ul68[lastIndex], "value"),
                    ll68: formatValues(limits.ll68[lastIndex], "value"),
                    ll95: formatValues(limits.ll95[lastIndex], "value"),
                    ll99: formatValues(limits.ll99[lastIndex], "value"),
                    speclimits_lower: formatValues(limits.speclimits_lower[lastIndex], "value"),
                    speclimits_upper: formatValues(limits.speclimits_upper[lastIndex], "value"),
                    trend_line: formatValues(limits.trend_line[lastIndex], "value"),
                    assurance: assIcon,
                    ...tooltipColumns
                };
                this.groupedRows.push({
                    table_row,
                    variation_icons: varIcons,
                    identity: this.identities[i],
                    aesthetics: this.inputSettings.settings[i].summary_table,
                    highlighted: this.inputData[i].anyHighlights
                });
            }
        }
        initialisePlotData(host) {
            const inputData = this.inputData[0];
            const controlLimits = this.controlLimits[0];
            const outliers = this.outliers[0];
            const settings = this.inputSettings.settings[0];
            const derivedSettings = this.inputSettings.derivedSettings[0];
            this.plotPoints = [];
            this.groupedRows = [];
            this.tickLabels = new Array();
            this.tableColumns[0] = new Array();
            this.tableColumns[0].push({ name: "date", label: "Date" });
            this.tableColumns[0].push(...lineColumns(settings, inputData.limitInputArgs.denominators !== undefined, derivedSettings.chart_type_props.has_control_limits));
            if (settings.outliers.astronomical) {
                this.tableColumns[0].push({ name: "astpoint", label: "Ast. Point" });
            }
            if (settings.outliers.trend) {
                this.tableColumns[0].push({ name: "trend", label: "Trend" });
            }
            if (settings.outliers.shift) {
                this.tableColumns[0].push({ name: "shift", label: "Shift" });
            }
            if (settings.outliers.two_in_three) {
                this.tableColumns[0].push({ name: "two_in_three", label: "Two-in-Three" });
            }
            for (let i = 0; i < controlLimits.keys.length; i++) {
                const index = controlLimits.keys[i].x;
                const aesthetics = inputData.scatter_formatting[index];
                if (this.colourPalette.isHighContrast) {
                    aesthetics.colour = this.colourPalette.foregroundColour;
                }
                data.applyFlagColours(aesthetics, settings.outliers, [
                    [outliers.shift[i], "shift_colour"], [outliers.trend[i], "trend_colour"],
                    [outliers.two_in_three[i], "twointhree_colour"], [outliers.astpoint[i], "ast_colour"]
                ]);
                const table_row = {
                    date: controlLimits.keys[i].label,
                    numerator: controlLimits.numerators[i],
                    denominator: controlLimits.denominators[i],
                    value: controlLimits.values[i],
                    target: controlLimits.target[i],
                    alt_target: controlLimits.alt_target[i],
                    ll99: controlLimits.ll99[i],
                    ll95: controlLimits.ll95[i],
                    ll68: controlLimits.ll68[i],
                    ul68: controlLimits.ul68[i],
                    ul95: controlLimits.ul95[i],
                    ul99: controlLimits.ul99[i],
                    speclimits_lower: controlLimits.speclimits_lower[i],
                    speclimits_upper: controlLimits.speclimits_upper[i],
                    trend_line: controlLimits.trend_line[i],
                    astpoint: outliers.astpoint[i],
                    trend: outliers.trend[i],
                    shift: outliers.shift[i],
                    two_in_three: outliers.two_in_three[i]
                };
                this.plotPoints.push({
                    x: index,
                    value: controlLimits.values[i],
                    aesthetics: aesthetics,
                    table_row: table_row,
                    identity: host.createSelectionIdBuilder()
                        .withCategory(inputData.categories, controlLimits.keys[i].id)
                        .createSelectionId(),
                    highlighted: inputData.highlights[index] !== undefined,
                    tooltip: buildTooltip(table_row, inputData.tooltips[index], settings, derivedSettings),
                    label: {
                        text_value: inputData.labels[index],
                        aesthetics: inputData.label_formatting[index],
                        angle: undefined,
                        distance: undefined
                    }
                });
                this.tickLabels.push({ x: index, label: controlLimits.keys[i].label });
            }
        }
        initialiseGroupedLines() {
            const settings = this.inputSettings.settings[0];
            const derivedSettings = this.inputSettings.derivedSettings[0];
            const controlLimits = this.controlLimits[0];
            const inputData = this.inputData[0];
            const labels = [];
            if (settings.lines.show_main) {
                labels.push("values");
            }
            if (settings.lines.show_target) {
                labels.push("target");
            }
            if (settings.lines.show_alt_target) {
                labels.push("alt_target");
            }
            if (settings.lines.show_specification) {
                labels.push("speclimits_lower", "speclimits_upper");
            }
            if (settings.lines.show_trend) {
                labels.push("trend_line");
            }
            if (derivedSettings.chart_type_props.has_control_limits) {
                if (settings.lines.show_99) {
                    labels.push("ll99", "ul99");
                }
                if (settings.lines.show_95) {
                    labels.push("ll95", "ul95");
                }
                if (settings.lines.show_68) {
                    labels.push("ll68", "ul68");
                }
            }
            const formattedLines = new Array();
            const nLimits = controlLimits.keys.length;
            const groups = this.groupStartEndIndexes[0];
            const isGroupStart = new Array(nLimits).fill(false);
            for (let i = 1; i < groups.length; i++) {
                isGroupStart[groups[i][0]] = true;
            }
            this.rebaselineEnds = [];
            let position = 0;
            for (let i = 0; i < nLimits; i++) {
                const isRebaselinePoint = isGroupStart[i];
                let isNewAltTarget = false;
                if (i > 0 && settings.lines.show_alt_target) {
                    isNewAltTarget = controlLimits.alt_target[i] !== controlLimits.alt_target[i - 1];
                }
                if (isRebaselinePoint) {
                    this.rebaselineEnds.push(position - 1);
                }
                position += (isRebaselinePoint || isNewAltTarget) ? 2 : 1;
                for (let l = 0; l < labels.length; l++) {
                    const label = labels[l];
                    const join_rebaselines = settings.lines[`join_rebaselines_${lineKeys[label]}`];
                    if (isRebaselinePoint || isNewAltTarget) {
                        const is_alt_target = label === "alt_target" && isNewAltTarget;
                        const is_rebaseline = label !== "alt_target" && isRebaselinePoint;
                        formattedLines.push({
                            x: controlLimits.keys[i].x,
                            line_value: (!join_rebaselines && (is_alt_target || is_rebaseline)) ? undefined : controlLimits[label][i],
                            group: label,
                            aesthetics: inputData.line_formatting[controlLimits.keys[i].x]
                        });
                    }
                    formattedLines.push({
                        x: controlLimits.keys[i].x,
                        line_value: controlLimits[label][i],
                        group: label,
                        aesthetics: inputData.line_formatting[controlLimits.keys[i].x]
                    });
                }
            }
            this.rebaselineEnds.push(position - 1);
            this.groupedLines = data.groupBy(formattedLines, "group");
        }
        scaleLimits(controlLimits, inputSettings, derivedSettings) {
            const multiplier = derivedSettings.multiplier;
            let lines_to_scale = ["values", "target", "trend_line"];
            if (derivedSettings.chart_type_props.has_control_limits) {
                lines_to_scale = lines_to_scale.concat(settings.limitLineNames);
            }
            if (inputSettings.lines.show_alt_target && inputSettings.lines.multiplier_alt_target) {
                lines_to_scale = lines_to_scale.concat(["alt_target"]);
            }
            if (inputSettings.lines.show_specification && inputSettings.lines.multiplier_specification) {
                lines_to_scale = lines_to_scale.concat(["speclimits_lower", "speclimits_upper"]);
            }
            for (let l = 0; l < lines_to_scale.length; l++) {
                const series = controlLimits[lines_to_scale[l]];
                for (let i = 0; i < series.length; i++) {
                    const value = series[i];
                    if (value !== undefined) {
                        series[i] = value * multiplier;
                    }
                }
            }
        }
        truncateLimits(controlLimits, inputSettings) {
            const ll_truncate = inputSettings.spc.ll_truncate;
            const ul_truncate = inputSettings.spc.ul_truncate;
            for (let l = 0; l < settings.limitLineNames.length; l++) {
                const series = controlLimits[settings.limitLineNames[l]];
                for (let i = 0; i < series.length; i++) {
                    const value = series[i];
                    if (value !== undefined) {
                        series[i] = math.clamp(value, ll_truncate, ul_truncate);
                    }
                }
            }
        }
        flagOutliers(controlLimits, groupStartEndIndexes, inputSettings, derivedSettings) {
            const process_flag_type = inputSettings.outliers.process_flag_type;
            const improvement_direction = inputSettings.outliers.improvement_direction;
            const trend_n = inputSettings.outliers.trend_n;
            const shift_n = inputSettings.outliers.shift_n;
            const ast_specification = inputSettings.outliers.astronomical_limit === "Specification";
            const two_in_three_specification = inputSettings.outliers.two_in_three_limit === "Specification";
            const outliers = {
                astpoint: math.rep("none", controlLimits.values.length),
                two_in_three: math.rep("none", controlLimits.values.length),
                trend: math.rep("none", controlLimits.values.length),
                shift: math.rep("none", controlLimits.values.length)
            };
            for (let i = 0; i < groupStartEndIndexes.length; i++) {
                const start = groupStartEndIndexes[i][0];
                const end = groupStartEndIndexes[i][1];
                const group_values = controlLimits.values.slice(start, end);
                const group_targets = controlLimits.target.slice(start, end);
                if (derivedSettings.chart_type_props.has_control_limits || ast_specification || two_in_three_specification) {
                    const limitKeys = {
                        "1 Sigma": ["ll68", "ul68"],
                        "2 Sigma": ["ll95", "ul95"],
                        "3 Sigma": ["ll99", "ul99"],
                        "Specification": ["speclimits_lower", "speclimits_upper"]
                    };
                    if (inputSettings.outliers.astronomical) {
                        const astKeys = limitKeys[inputSettings.outliers.astronomical_limit];
                        const lower_limits = controlLimits[astKeys[0]].slice(start, end);
                        const upper_limits = controlLimits[astKeys[1]].slice(start, end);
                        copyInto(outliers.astpoint, spc.astronomical(group_values, lower_limits, upper_limits), start);
                    }
                    if (inputSettings.outliers.two_in_three) {
                        const highlight_series = inputSettings.outliers.two_in_three_highlight_series;
                        const warnKeys = limitKeys[inputSettings.outliers.two_in_three_limit];
                        const lower_warn_limits = controlLimits[warnKeys[0]].slice(start, end);
                        const upper_warn_limits = controlLimits[warnKeys[1]].slice(start, end);
                        copyInto(outliers.two_in_three, spc.twoInThree(group_values, lower_warn_limits, upper_warn_limits, highlight_series), start);
                    }
                }
                if (inputSettings.outliers.trend) {
                    copyInto(outliers.trend, spc.trend(group_values, trend_n), start);
                }
                if (inputSettings.outliers.shift) {
                    copyInto(outliers.shift, spc.shift(group_values, group_targets, shift_n), start);
                }
            }
            const flagSettings = { process_flag_type, improvement_direction };
            const flag = (raw) => {
                const flagged = new Array(raw.length);
                for (let i = 0; i < raw.length; i++) {
                    flagged[i] = data.checkFlagDirection(raw[i], flagSettings);
                }
                return flagged;
            };
            return {
                astpoint: flag(outliers.astpoint),
                two_in_three: flag(outliers.two_in_three),
                trend: flag(outliers.trend),
                shift: flag(outliers.shift)
            };
        }
    }

    class Visual extends rendering.PlotVisual {
        constructor(options) {
            super(options, () => new viewModelClass());
            this.lineKeys = lineKeys;
            this.tableDiv = rendering.select(this.element).insert("div", "svg")
                .style("overflow", "auto");
            const table = this.tableDiv.append("table")
                .classed("table-group", true)
                .style("border-collapse", "separate")
                .style("border-spacing", "0")
                .style("width", "100%");
            table.append("thead").append("tr").classed("table-header", true);
            table.append('tbody').classed("table-body", true);
        }
        get settings() {
            return this.viewModel.inputSettings.settings[0];
        }
        axisRanges() {
            return axisRanges(this.viewModel);
        }
        drawAlternate() {
            if (!(this.viewModel.showGrouped || this.settings.summary_table.show_table)) {
                return false;
            }
            this.resizeCanvas(0, 0);
            this.tableDiv.call(drawSummaryTable, this);
            this.addContextMenu(this.tableDiv.node(), true);
            return true;
        }
        drawVisual() {
            const svg = this.svg.node();
            if (svg === null) {
                return;
            }
            const viewModel = this.viewModel;
            const settings$1 = this.settings;
            const context = this.plotContext();
            const tickLabels = viewModel.tickLabels;
            rendering.drawPlotAxes(svg, context, {
                x: value => {
                    for (let i = 0; i < tickLabels.length; i++) {
                        if (tickLabels[i].x === value) {
                            return tickLabels[i].label;
                        }
                    }
                    return "";
                },
                y: rendering.valueTickFormat(settings$1.y_axis.ylimit_sig_figs ?? settings$1.spc.sig_figs, viewModel.inputSettings.derivedSettings[0].percentLabels)
            });
            rendering.drawPlotTooltips(svg, context, false);
            rendering.drawPlotLines(svg, context, viewModel.groupedLines, (name, points, index) => settings.lineStyle(points[index].aesthetics, lineKeys[name]));
            rendering.drawPlotLineLabels(svg, context, {
                lines: viewModel.groupedLines,
                settings: settings$1.lines,
                keys: lineKeys,
                lower: name => settings.lowerLimitLines.has(name) || name === "speclimits_lower",
                format: viewModel.inputSettings.derivedSettings[0].formatValue,
                periodEnds: viewModel.rebaselineEnds
            });
            rendering.drawPlotDots(svg, context, {
                show: settings$1.scatter.show_dots,
                text: undefined,
                onClick: settings$1.spc.split_on_click ? point => this.toggleSplit(point) : undefined
            });
            this.svg.call(drawIcons, this);
            this.addContextMenu(svg);
            rendering.drawPlotDownload(svg, context, () => {
                const points = context.points;
                const rows = new Array(points.length);
                for (let i = 0; i < points.length; i++) {
                    rows[i] = points[i].table_row;
                }
                return rows;
            });
            rendering.drawPlotValueLabels(svg, context, viewModel.inputData[0].anyLabels);
        }
        toggleSplit(point) {
            const splitIndexes = this.viewModel.splitIndexes;
            const xIndex = splitIndexes.indexOf(point.x);
            if (xIndex > -1) {
                splitIndexes.splice(xIndex, 1);
            }
            else {
                splitIndexes.push(point.x);
            }
            this.host.persistProperties({
                replace: [{
                        objectName: "split_indexes_storage",
                        selector: {},
                        properties: { split_indexes: JSON.stringify(splitIndexes) }
                    }]
            });
        }
        resizeCanvas(width, height) {
            super.resizeCanvas(width, height);
            if (width === 0 && height === 0) {
                this.tableDiv.style("width", "100%").style("height", "100%");
            }
            else {
                this.tableDiv.style("width", "0%").style("height", "0%");
            }
        }
        updateHighlighting() {
            const viewModel = this.viewModel;
            let anyHighlights = false;
            for (let i = 0; i < viewModel.inputData.length && !anyHighlights; i++) {
                anyHighlights = viewModel.inputData[i].anyHighlights;
            }
            const state = powerbi.selectionState(this.selectionManager, anyHighlights);
            this.highlightPlotPoints(state, point => point.aesthetics);
            const tableSelection = this.tableDiv.selectAll(".table-body").selectChildren();
            tableSelection.style("opacity", (d) => rendering.highlightOpacity({
                opacity: d.aesthetics.table_opacity,
                opacity_selected: d.aesthetics.table_opacity_selected,
                opacity_unselected: d.aesthetics.table_opacity_unselected
            }, state.active, powerbi.identitySelected(d.identity, state.selected) || d.highlighted));
        }
    }

    exports.Visual = Visual;
    exports.defaultSettings = defaultSettings;

    return exports;

})({}, ccCore, ccCore, ccCore, ccCore, ccCore, ccCore);
