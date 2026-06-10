var funnel = (function () {
'use strict';


function isNullOrUndefined(value) {
    return value === null || value === undefined;
}

const FormattingComponent = {
    ColorPicker: "ColorPicker",
    Dropdown: "Dropdown",
    FontPicker: "FontPicker",
    NumUpDown: "NumUpDown",
    TextInput: "TextInput",
    ToggleSwitch: "ToggleSwitch",
};
const defaultColours = {
    improvement: "#00B0F0",
    deterioration: "#E46C0A",
    neutral_low: "#490092",
    neutral_high: "#490092",
    common_cause: "#A6A6A6",
    limits: "#6495ED",
    standard: "#000000",
    lightgray: "#D3D3D3",
    white: "#FFFFFF"
};
function numberOption(displayName, defaultValue, minMax) {
    const rtn = {
        displayName: displayName,
        type: FormattingComponent.NumUpDown,
        default: defaultValue
    };
    if (!isNullOrUndefined(minMax)) {
        rtn.options = {};
        if (!isNullOrUndefined(minMax.min)) {
            rtn.options.minValue = { value: minMax.min };
        }
        if (!isNullOrUndefined(minMax.max)) {
            rtn.options.maxValue = { value: minMax.max };
        }
    }
    return rtn;
}
function toggleOption(displayName, defaultValue) {
    return {
        displayName: displayName,
        type: FormattingComponent.ToggleSwitch,
        default: defaultValue
    };
}
function paddingOption(displayName) {
    return numberOption(displayName, 10);
}
function colourOption(displayName, type) {
    return {
        displayName: displayName,
        type: FormattingComponent.ColorPicker,
        default: defaultColours[type]
    };
}
function fontOption(displayName) {
    return {
        displayName: displayName,
        type: FormattingComponent.FontPicker,
        default: "'Arial', sans-serif",
        valid: [
            "'Arial', sans-serif",
            "Arial",
            "'Arial Black'",
            "'Arial Unicode MS'",
            "Calibri",
            "Cambria",
            "'Cambria Math'",
            "Candara",
            "'Comic Sans MS'",
            "Consolas",
            "Constantia",
            "Corbel",
            "'Courier New'",
            "wf_standard-font, helvetica, arial, sans-serif",
            "wf_standard-font_light, helvetica, arial, sans-serif",
            "Georgia",
            "'Lucida Sans Unicode'",
            "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif",
            "'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif",
            "'Segoe UI Semibold', wf_segoe-ui_semibold, helvetica, arial, sans-serif",
            "'Segoe UI Bold', wf_segoe-ui_bold, helvetica, arial, sans-serif",
            "Symbol",
            "Tahoma",
            "'Times New Roman'",
            "'Trebuchet MS'",
            "Verdana",
            "Wingdings"
        ]
    };
}
function fontSizeOption(displayName) {
    return numberOption(displayName, 10, { min: 0, max: 100 });
}
const valueTransforms = {
    none: (x) => x,
    sentence: (x) => x.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
};
function dropdownOption(displayName, defaultValue, validValues, displayTransform, displayNames) {
    const numValues = validValues.length;
    const rtn = {
        displayName: displayName,
        type: FormattingComponent.Dropdown,
        default: defaultValue,
        valid: validValues,
        items: new Array(numValues)
    };
    const transformFun = valueTransforms[(displayTransform ?? "none")];
    for (let i = 0; i < numValues; i++) {
        rtn.items[i] = {
            displayName: displayNames ? displayNames[i] : transformFun(validValues[i]),
            value: validValues[i]
        };
    }
    return rtn;
}
function lineTypeOption(displayName, defaultValue) {
    return dropdownOption(displayName, defaultValue, ["10 0", "10 10", "2 5"], "none", ["Solid", "Dashed", "Dotted"]);
}
function textOption(displayName, defaultValue) {
    return {
        displayName: displayName,
        type: FormattingComponent.TextInput,
        default: defaultValue
    };
}
function lineLabelPositionOption() {
    return dropdownOption("Position of Value on Line(s)", "beside", ["outside", "inside", "above", "below", "beside"], "sentence");
}
function addGetters(settingCategory) {
    let inputClone = JSON.parse(JSON.stringify(settingCategory));
    let settingNames = [];
    for (const group in inputClone.settingsGroups) {
        for (const setting in inputClone.settingsGroups[group]) {
            settingNames.push(setting);
            Object.defineProperty(inputClone, setting, {
                get: function () {
                    return inputClone.settingsGroups[group][setting];
                }
            });
        }
    }
    Object.defineProperty(inputClone, "settingNames", {
        get: function () {
            return settingNames;
        }
    });
    return inputClone;
}

const canvasSettings = {
    description: "Canvas Settings",
    displayName: "Canvas Settings",
    settingsGroups: {
        "all": {
            show_errors: toggleOption("Show Errors on Canvas", true),
            lower_padding: paddingOption("Padding Below Plot (pixels):"),
            upper_padding: paddingOption("Padding Above Plot (pixels):"),
            left_padding: paddingOption("Padding Left of Plot (pixels):"),
            right_padding: paddingOption("Padding Right of Plot (pixels):")
        }
    }
};

const funnelSettings = {
    description: "Funnel Settings",
    displayName: "Data Settings",
    settingsGroups: {
        "all": {
            chart_type: dropdownOption("Chart Type", "PR", ["SR", "PR", "RC"], "none", ["Indirectly Standardised (HSMR)", "Proportion", "Rate"]),
            od_adjust: dropdownOption("OD Adjustment", "no", ["auto", "yes", "no"], "sentence"),
            multiplier: numberOption("Multiplier", 1, { min: 0 }),
            sig_figs: numberOption("Decimals to Report:", 2, { min: 0, max: 20 }),
            perc_labels: dropdownOption("Report as percentage", "Automatic", ["Automatic", "Yes", "No"]),
            transformation: dropdownOption("Transformation", "none", ["none", "ln", "log10", "sqrt"], "none", ["None", "Natural Log (y+1)", "Log10 (y+1)", "Square-Root"]),
            ttip_show_group: toggleOption("Show Group in Tooltip", true),
            ttip_label_group: textOption("Group Tooltip Label", "Automatic"),
            ttip_show_numerator: toggleOption("Show Numerator in Tooltip", true),
            ttip_label_numerator: textOption("Numerator Tooltip Label", "Numerator"),
            ttip_show_denominator: toggleOption("Show Denominator in Tooltip", true),
            ttip_label_denominator: textOption("Denominator Tooltip Label", "Denominator"),
            ttip_show_value: toggleOption("Show Value in Tooltip", true),
            ttip_label_value: textOption("Value Tooltip Label", "Automatic"),
            ll_truncate: numberOption("Truncate Lower Limits at:", undefined),
            ul_truncate: numberOption("Truncate Upper Limits at:", undefined)
        }
    }
};

const outliersSettings = {
    description: "Outlier Settings",
    displayName: "Outlier Settings",
    settingsGroups: {
        "General": {
            process_flag_type: dropdownOption("Type of Change to Flag", "both", ["both", "improvement", "deterioration"], "sentence"),
            improvement_direction: dropdownOption("Improvement Direction", "increase", ["increase", "neutral", "decrease"], "sentence")
        },
        "Three Sigma Outliers": {
            three_sigma: toggleOption("Three Sigma Outliers", false),
            three_sigma_colour_improvement: colourOption("Imp. Three Sigma Colour", "improvement"),
            three_sigma_colour_deterioration: colourOption("Det. Three Sigma Colour", "deterioration"),
            three_sigma_colour_neutral_low: colourOption("Neutral (Low) Three Sigma Colour", "neutral_low"),
            three_sigma_colour_neutral_high: colourOption("Neutral (High) Three Sigma Colour", "neutral_high")
        },
        "Two Sigma Outliers": {
            two_sigma: toggleOption("Two Sigma Outliers", false),
            two_sigma_colour_improvement: colourOption("Imp. Two Sigma Colour", "improvement"),
            two_sigma_colour_deterioration: colourOption("Det. Two Sigma Colour", "deterioration"),
            two_sigma_colour_neutral_low: colourOption("Neutral (Low) Two Sigma Colour", "neutral_low"),
            two_sigma_colour_neutral_high: colourOption("Neutral (High) Two Sigma Colour", "neutral_high")
        }
    }
};

const scatterSettings = {
    description: "Scatter Settings",
    displayName: "Scatter Settings",
    settingsGroups: {
        "Dots": {
            shape: dropdownOption("Shape", "Circle", ["Circle", "Cross", "Diamond", "Square", "Star", "Triangle", "Wye"]),
            size: numberOption("Size", 2.5, { min: 0, max: 100 }),
            colour: colourOption("Colour", "common_cause"),
            colour_outline: colourOption("Outline Colour", "common_cause"),
            width_outline: numberOption("Outline Width", 1, { min: 0, max: 100 }),
            opacity: numberOption("Default Opacity", 1, { min: 0, max: 1 }),
            opacity_selected: numberOption("Opacity if Selected", 1, { min: 0, max: 1 }),
            opacity_unselected: numberOption("Opacity if Unselected", 0.2, { min: 0, max: 1 })
        },
        "Group Text": {
            use_group_text: toggleOption("Show Group Text", false),
            scatter_text_font: fontOption("Group Text Font"),
            scatter_text_size: fontSizeOption("Group Text Size"),
            scatter_text_colour: colourOption("Group Text Colour", "standard"),
            scatter_text_opacity: numberOption("Group Text Default Opacity", 1, { min: 0, max: 1 }),
            scatter_text_opacity_selected: numberOption("Group Text Opacity if Selected", 1, { min: 0, max: 1 }),
            scatter_text_opacity_unselected: numberOption("Group Text Opacity if Unselected", 0.2, { min: 0, max: 1 })
        }
    }
};

const linesSettings = {
    description: "Line Settings",
    displayName: "Line Settings",
    settingsGroups: {
        "Target": {
            show_target: toggleOption("Show Target", true),
            width_target: numberOption("Line Width", 1.5, { min: 0, max: 100 }),
            type_target: lineTypeOption("Line Type", "10 0"),
            colour_target: colourOption("Line Colour", "standard"),
            opacity_target: numberOption("Default Opacity", 1, { min: 0, max: 1 }),
            opacity_unselected_target: numberOption("Opacity if Any Selected", 0.2, { min: 0, max: 1 }),
            ttip_show_target: toggleOption("Show value in tooltip", true),
            ttip_label_target: textOption("Tooltip Label", "Centerline"),
            plot_label_show_target: toggleOption("Show Value on Plot", false),
            plot_label_position_target: lineLabelPositionOption(),
            plot_label_vpad_target: numberOption("Value Vertical Padding", 0),
            plot_label_hpad_target: numberOption("Value Horizontal Padding", 10),
            plot_label_font_target: fontOption("Value Font"),
            plot_label_size_target: fontSizeOption("Value Font Size"),
            plot_label_colour_target: colourOption("Value Colour", "standard"),
            plot_label_prefix_target: textOption("Value Prefix", "")
        },
        "Alt. Target": {
            show_alt_target: toggleOption("Show Alt. Target Line", false),
            alt_target: numberOption("Additional Target Value:", undefined),
            width_alt_target: numberOption("Line Width", 1.5, { min: 0, max: 100 }),
            type_alt_target: lineTypeOption("Line Type", "10 0"),
            colour_alt_target: colourOption("Line Colour", "standard"),
            opacity_alt_target: numberOption("Default Opacity", 1, { min: 0, max: 1 }),
            opacity_unselected_alt_target: numberOption("Opacity if Any Selected", 0.2, { min: 0, max: 1 }),
            join_rebaselines_alt_target: toggleOption("Connect Rebaselined Limits", false),
            ttip_show_alt_target: toggleOption("Show value in tooltip", true),
            ttip_label_alt_target: textOption("Tooltip Label", "Alt. Target"),
            plot_label_show_alt_target: toggleOption("Show Value on Plot", false),
            plot_label_position_alt_target: lineLabelPositionOption(),
            plot_label_vpad_alt_target: numberOption("Value Vertical Padding", 0),
            plot_label_hpad_alt_target: numberOption("Value Horizontal Padding", 10),
            plot_label_font_alt_target: fontOption("Value Font"),
            plot_label_size_alt_target: fontSizeOption("Value Font Size"),
            plot_label_colour_alt_target: colourOption("Value Colour", "standard"),
            plot_label_prefix_alt_target: textOption("Value Prefix", "")
        },
        "68% Limits": {
            show_68: toggleOption("Show 68% Lines", false),
            width_68: numberOption("Line Width", 2, { min: 0, max: 100 }),
            type_68: lineTypeOption("Line Type", "2 5"),
            colour_68: colourOption("Line Colour", "limits"),
            opacity_68: numberOption("Default Opacity", 1, { min: 0, max: 1 }),
            opacity_unselected_68: numberOption("Opacity if Any Selected", 0.2, { min: 0, max: 1 }),
            ttip_show_68: toggleOption("Show value in tooltip", true),
            ttip_label_68: textOption("Tooltip Label", "68% Limit"),
            plot_label_show_68: toggleOption("Show Value on Plot", false),
            plot_label_position_68: lineLabelPositionOption(),
            plot_label_vpad_68: numberOption("Value Vertical Padding", 0),
            plot_label_hpad_68: numberOption("Value Horizontal Padding", 10),
            plot_label_font_68: fontOption("Value Font"),
            plot_label_size_68: fontSizeOption("Value Font Size"),
            plot_label_colour_68: colourOption("Value Colour", "standard"),
            plot_label_prefix_68: textOption("Value Prefix", "")
        },
        "95% Limits": {
            show_95: toggleOption("Show 95% Lines", true),
            width_95: numberOption("Line Width", 2, { min: 0, max: 100 }),
            type_95: lineTypeOption("Line Type", "2 5"),
            colour_95: colourOption("Line Colour", "limits"),
            opacity_95: numberOption("Default Opacity", 1, { min: 0, max: 1 }),
            opacity_unselected_95: numberOption("Opacity if Any Selected", 0.2, { min: 0, max: 1 }),
            ttip_show_95: toggleOption("Show value in tooltip", true),
            ttip_label_95: textOption("Tooltip Label", "95% Limit"),
            plot_label_show_95: toggleOption("Show Value on Plot", false),
            plot_label_position_95: lineLabelPositionOption(),
            plot_label_vpad_95: numberOption("Value Vertical Padding", 0),
            plot_label_hpad_95: numberOption("Value Horizontal Padding", 10),
            plot_label_font_95: fontOption("Value Font"),
            plot_label_size_95: fontSizeOption("Value Font Size"),
            plot_label_colour_95: colourOption("Value Colour", "standard"),
            plot_label_prefix_95: textOption("Value Prefix", "")
        },
        "99% Limits": {
            show_99: toggleOption("Show 99% Lines", true),
            width_99: numberOption("Line Width", 2, { min: 0, max: 100 }),
            type_99: lineTypeOption("Line Type", "10 10"),
            colour_99: colourOption("Line Colour", "limits"),
            opacity_99: numberOption("Default Opacity", 1, { min: 0, max: 1 }),
            opacity_unselected_99: numberOption("Opacity if Any Selected", 0.2, { min: 0, max: 1 }),
            ttip_show_99: toggleOption("Show value in tooltip", true),
            ttip_label_99: textOption("Tooltip Label", "99% Limit"),
            plot_label_show_99: toggleOption("Show Value on Plot", false),
            plot_label_position_99: lineLabelPositionOption(),
            plot_label_vpad_99: numberOption("Value Vertical Padding", 0),
            plot_label_hpad_99: numberOption("Value Horizontal Padding", 10),
            plot_label_font_99: fontOption("Value Font"),
            plot_label_size_99: fontSizeOption("Value Font Size"),
            plot_label_colour_99: colourOption("Value Colour", "standard"),
            plot_label_prefix_99: textOption("Value Prefix", "")
        }
    }
};

const xAxisSettings = {
    description: "X Axis Settings",
    displayName: "X Axis Settings",
    settingsGroups: {
        "Axis": {
            xlimit_colour: colourOption("Axis Colour", "standard"),
            xlimit_l: numberOption("Lower Limit", undefined),
            xlimit_u: numberOption("Upper Limit", undefined)
        },
        "Ticks": {
            xlimit_ticks: toggleOption("Draw Ticks", true),
            xlimit_tick_count: numberOption("Maximum Ticks", 10, { min: 0, max: 100 }),
            xlimit_tick_font: fontOption("Tick Font"),
            xlimit_tick_size: fontSizeOption("Tick Font Size"),
            xlimit_tick_colour: colourOption("Tick Font Colour", "standard"),
            xlimit_tick_rotation: numberOption("Tick Rotation (Degrees)", 0, { min: -360, max: 360 })
        },
        "Label": {
            xlimit_label: textOption("Label", ""),
            xlimit_label_font: fontOption("Label Font"),
            xlimit_label_size: fontSizeOption("Label Font Size"),
            xlimit_label_colour: colourOption("Label Font Colour", "standard")
        }
    }
};

const yAxisSettings = {
    description: "Y Axis Settings",
    displayName: "Y Axis Settings",
    settingsGroups: {
        "Axis": {
            ylimit_colour: colourOption("Axis Colour", "standard"),
            ylimit_sig_figs: numberOption("Tick Decimal Places", undefined, { min: 0, max: 100 }),
            ylimit_l: numberOption("Lower Limit", undefined),
            ylimit_u: numberOption("Upper Limit", undefined)
        },
        "Ticks": {
            ylimit_ticks: toggleOption("Draw Ticks", true),
            ylimit_tick_count: numberOption("Maximum Ticks", 10, { min: 0, max: 100 }),
            ylimit_tick_font: fontOption("Tick Font"),
            ylimit_tick_size: fontSizeOption("Tick Font Size"),
            ylimit_tick_colour: colourOption("Tick Font Colour", "standard"),
            ylimit_tick_rotation: numberOption("Tick Rotation (Degrees)", 0, { min: -360, max: 360 })
        },
        "Label": {
            ylimit_label: textOption("Label", ""),
            ylimit_label_font: fontOption("Label Font"),
            ylimit_label_size: fontSizeOption("Label Font Size"),
            ylimit_label_colour: colourOption("Label Font Colour", "standard")
        }
    }
};

const labelsSettings = {
    description: "Labels Settings",
    displayName: "Labels Settings",
    settingsGroups: {
        "all": {
            show_labels: toggleOption("Show Value Labels", true),
            label_position: dropdownOption("Label Position", "top", ["top", "bottom"], "sentence"),
            label_y_offset: numberOption("Label Offset from Top/Bottom (px)", 20),
            label_line_offset: numberOption("Label Offset from Connecting Line (px)", 5),
            label_angle_offset: numberOption("Label Angle Offset (degrees)", 0, { min: -90, max: 90 }),
            label_font: fontOption("Label Font"),
            label_size: fontSizeOption("Label Font Size"),
            label_colour: colourOption("Label Font Colour", "standard"),
            label_line_colour: colourOption("Connecting Line Colour", "standard"),
            label_line_width: numberOption("Connecting Line Width", 1, { min: 0, max: 100 }),
            label_line_type: lineTypeOption("Connecting Line Type", "10 0"),
            label_line_max_length: numberOption("Max Connecting Line Length (px)", 1000, { min: 0, max: 10000 }),
            label_marker_show: toggleOption("Show Line Markers", true),
            label_marker_offset: numberOption("Marker Offset from Value (px)", 5),
            label_marker_size: numberOption("Marker Size", 3, { min: 0, max: 100 }),
            label_marker_colour: colourOption("Marker Fill Colour", "standard"),
            label_marker_outline_colour: colourOption("Marker Outline Colour", "standard")
        }
    }
};

const settingsModel = {
    canvas: addGetters(canvasSettings),
    funnel: addGetters(funnelSettings),
    outliers: addGetters(outliersSettings),
    scatter: addGetters(scatterSettings),
    lines: addGetters(linesSettings),
    x_axis: addGetters(xAxisSettings),
    y_axis: addGetters(yAxisSettings),
    labels: addGetters(labelsSettings),
    get defaultValues() {
        let ret = {};
        for (const key in this) {
            if (key === "defaultValues")
                continue;
            const currSettings = this[key];
            const currSettingNames = currSettings.settingNames;
            ret[key] = {};
            for (const setting of currSettingNames) {
                ret[key][setting] = currSettings[setting].default;
            }
        }
        return ret;
    }
};
const defaultSettings = settingsModel.defaultValues;

var d3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    axisBottom: ccD3.axisBottom,
    axisLeft: ccD3.axisLeft,
    line: ccD3.line,
    select: ccD3.select,
    selectAll: ccD3.selectAll,
    symbol: ccD3.symbol,
    symbolAsterisk: ccD3.symbolAsterisk,
    symbolCircle: ccD3.symbolCircle,
    symbolCross: ccD3.symbolCross,
    symbolDiamond: ccD3.symbolDiamond,
    symbolSquare: ccD3.symbolSquare,
    symbolStar: ccD3.symbolStar,
    symbolTriangle: ccD3.symbolTriangle,
    symbolWye: ccD3.symbolWye
});

function addContextMenu(selection, visualObj) {
    if (!(visualObj.plotProperties.displayPlot)) {
        selection.on("contextmenu", () => { return; });
        return;
    }
    selection.on('contextmenu', (event) => {
        const eventTarget = event.target;
        const dataPoint = (ccD3.select(eventTarget).datum());
        visualObj.selectionManager.showContextMenu(dataPoint ? dataPoint.identity : {}, {
            x: event.clientX,
            y: event.clientY
        });
        event.preventDefault();
    });
}

function between(x, lower, upper) {
    let is_between = true;
    if (!isNullOrUndefined(lower)) {
        is_between = is_between && (x >= lower);
    }
    if (!isNullOrUndefined(upper)) {
        is_between = is_between && (x <= upper);
    }
    return is_between;
}

function broadcast_binary(fun) {
    return function (x, y) {
        if (Array.isArray(x) && Array.isArray(y)) {
            return x.map((d, idx) => fun(d, y[idx]));
        }
        else if (Array.isArray(x) && !Array.isArray(y)) {
            return x.map(d => fun(d, y));
        }
        else if (!Array.isArray(x) && Array.isArray(y)) {
            return y.map(d => fun(x, d));
        }
        else {
            return fun(x, y);
        }
    };
}
const add = broadcast_binary((x, y) => x + y);
const subtract = broadcast_binary((x, y) => x - y);
const divide = broadcast_binary((x, y) => x / y);
const multiply = broadcast_binary((x, y) => x * y);

function getTransformation(setting_name) {
    if (setting_name == "none") {
        return function (x) { return x; };
    }
    else if (setting_name == "ln") {
        return function (x) { return Math.log(x + 1); };
    }
    else if (setting_name == "log10") {
        return function (x) { return Math.log10(x + 1); };
    }
    else if (setting_name == "sqrt") {
        return Math.sqrt;
    }
    else {
        return function (x) { return x; };
    }
}

function buildTooltip(index, calculatedLimits, outliers, inputData, inputSettings, derivedSettings) {
    const data_type = inputSettings.funnel.chart_type;
    const multiplier = derivedSettings.multiplier;
    const transform_text = inputSettings.funnel.transformation;
    const transform = getTransformation(transform_text);
    const group = inputData.keys[index].label;
    const numerator = inputData.numerators[index];
    const denominator = inputData.denominators[index];
    const limits = calculatedLimits.filter(d => d.denominators === denominator && d.ll99 !== null && d.ul99 !== null)[0];
    const ratio = transform((numerator / denominator) * multiplier);
    const suffix = derivedSettings.percentLabels ? "%" : "";
    const prop_labels = derivedSettings.percentLabels;
    const sig_figs = inputSettings.funnel.sig_figs;
    const valueLabel = {
        "PR": "Proportion",
        "SR": "Standardised Ratio",
        "RC": "Rate"
    };
    const tooltip = new Array();
    if (inputSettings.funnel.ttip_show_group) {
        tooltip.push({
            displayName: inputSettings.funnel.ttip_label_group,
            value: group
        });
    }
    if (inputSettings.funnel.ttip_show_value) {
        const ttip_label_value = inputSettings.funnel.ttip_label_value;
        tooltip.push({
            displayName: ttip_label_value === "Automatic" ? valueLabel[data_type] : ttip_label_value,
            value: ratio.toFixed(sig_figs) + suffix
        });
    }
    if (inputSettings.funnel.ttip_show_numerator && !(numerator === null || numerator === undefined)) {
        tooltip.push({
            displayName: inputSettings.funnel.ttip_label_numerator,
            value: (numerator).toFixed(prop_labels ? 0 : sig_figs)
        });
    }
    if (inputSettings.funnel.ttip_show_denominator && !(denominator === null || denominator === undefined)) {
        tooltip.push({
            displayName: inputSettings.funnel.ttip_label_denominator,
            value: (denominator).toFixed(prop_labels ? 0 : sig_figs)
        });
    }
    ["68", "95", "99"].forEach(limit => {
        if (inputSettings.lines[`ttip_show_${limit}`] && inputSettings.lines[`show_${limit}`]) {
            tooltip.push({
                displayName: `Upper ${inputSettings.lines[`ttip_label_${limit}`]}`,
                value: (limits[`ul${limit}`]).toFixed(sig_figs) + suffix
            });
        }
    });
    if (inputSettings.lines.show_target && inputSettings.lines.ttip_show_target) {
        tooltip.push({
            displayName: inputSettings.lines.ttip_label_target,
            value: (limits.target).toFixed(sig_figs) + suffix
        });
    }
    if (inputSettings.lines.show_alt_target && inputSettings.lines.ttip_show_alt_target && !(limits.alt_target === null || limits.alt_target === undefined)) {
        tooltip.push({
            displayName: inputSettings.lines.ttip_label_alt_target,
            value: (limits.alt_target).toFixed(sig_figs) + suffix
        });
    }
    ["68", "95", "99"].forEach(limit => {
        if (inputSettings.lines[`ttip_show_${limit}`] && inputSettings.lines[`show_${limit}`]) {
            tooltip.push({
                displayName: `Lower ${inputSettings.lines[`ttip_label_${limit}`]}`,
                value: (limits[`ll${limit}`]).toFixed(sig_figs) + suffix
            });
        }
    });
    if (transform_text !== "none") {
        tooltip.push({
            displayName: "Plot Scaling",
            value: transform_text
        });
    }
    if (outliers.two_sigma || outliers.three_sigma) {
        const patterns = new Array();
        if (outliers.three_sigma) {
            patterns.push("Three Sigma Outlier");
        }
        if (outliers.two_sigma) {
            patterns.push("Two Sigma Outlier");
        }
        tooltip.push({
            displayName: "Pattern(s)",
            value: patterns.join("\n")
        });
    }
    if (inputData.tooltips.length > 0) {
        inputData.tooltips[index].forEach(customTooltip => tooltip.push(customTooltip));
    }
    return tooltip;
}

function rep(x, n) {
    let result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = x;
    }
    return result;
}

function getSettingValue(settingObject, settingGroup, settingName, defaultValue) {
    const propertyValue = settingObject?.[settingGroup]?.[settingName];
    if (isNullOrUndefined(propertyValue)) {
        return defaultValue;
    }
    return propertyValue?.solid ? propertyValue.solid.color
        : propertyValue;
}
function extractConditionalFormatting(categoricalView, settingGroupName, inputSettings) {
    if (isNullOrUndefined(categoricalView)) {
        return { values: null, validation: { status: 0, messages: rep(new Array(), 1) } };
    }
    if (isNullOrUndefined(categoricalView?.categories)) {
        return { values: null, validation: { status: 0, messages: rep(new Array(), 1) } };
    }
    const inputCategories = categoricalView.categories[0];
    const settingNames = Object.keys(inputSettings[settingGroupName]);
    const validationRtn = JSON.parse(JSON.stringify({ status: 0, messages: rep([], inputCategories.values.length) }));
    const rtn = inputCategories.values.map((_, idx) => {
        const inpObjects = (inputCategories.objects ? inputCategories.objects[idx] : null);
        return Object.fromEntries(settingNames.map(settingName => {
            const defaultSetting = defaultSettings[settingGroupName][settingName];
            let extractedSetting = getSettingValue(inpObjects, settingGroupName, settingName, defaultSetting);
            extractedSetting = extractedSetting === "" ? defaultSetting : extractedSetting;
            const valid = defaultSettings[settingGroupName][settingName]?.["valid"] ?? defaultSettings[settingGroupName][settingName]?.["options"];
            const isNumericRange = !isNullOrUndefined(valid?.minValue) || !isNullOrUndefined(valid?.maxValue);
            const defaultIsUndefined = isNullOrUndefined(defaultSetting);
            if (valid && !defaultIsUndefined) {
                let message = "";
                if (valid instanceof Array && !valid.includes(extractedSetting)) {
                    message = `${extractedSetting} is not a valid value for ${settingName}. Valid values are: ${valid.join(", ")}`;
                }
                else if (isNumericRange && !between(extractedSetting, valid?.minValue?.value, valid?.maxValue?.value)) {
                    message = `${extractedSetting} is not a valid value for ${settingName}. Valid values are between ${valid?.minValue?.value} and ${valid?.maxValue?.value}`;
                }
                if (message !== "") {
                    extractedSetting = defaultSettings[settingGroupName][settingName];
                    validationRtn.messages[idx].push(message);
                }
            }
            return [settingName, extractedSetting];
        }));
    });
    const validationMessages = validationRtn.messages.filter(d => d.length > 0);
    if (!validationRtn.messages.some(d => d.length === 0)) {
        validationRtn.status = 1;
        validationRtn.error = `${validationMessages[0][0]}`;
    }
    return { values: rtn, validation: validationRtn };
}

const formatPrimitiveValue = broadcast_binary((rawValue, valueType) => {
    if (rawValue === null || rawValue === undefined) {
        return null;
    }
    if (valueType.numeric) {
        return rawValue.toString();
    }
    else {
        return rawValue;
    }
});

function extractKeys(inputView) {
    const primitiveKeyColumns = inputView.categories.filter(viewColumn => viewColumn.source?.roles?.["key"]);
    const primitiveKeyValues = primitiveKeyColumns?.[0]?.values;
    const primitiveKeyTypes = primitiveKeyColumns?.[0]?.source?.type;
    return formatPrimitiveValue(primitiveKeyValues, primitiveKeyTypes);
}
function extractTooltips(inputView) {
    const tooltipColumns = inputView.values.filter(viewColumn => viewColumn.source.roles.tooltips);
    return tooltipColumns?.[0]?.values?.map((_, idx) => {
        return tooltipColumns.map(viewColumn => {
            const tooltipValueFormatted = formatPrimitiveValue(viewColumn?.values?.[idx], viewColumn.source.type);
            return {
                displayName: viewColumn.source.displayName,
                value: tooltipValueFormatted
            };
        });
    });
}
function extractDataColumn(inputView, name) {
    const columnRaw = inputView.values.filter(viewColumn => viewColumn?.source?.roles?.[name]);
    if (name === "key") {
        return extractKeys(inputView);
    }
    else if (name === "tooltips") {
        return extractTooltips(inputView);
    }
    else if (name === "labels") {
        return columnRaw?.[0]?.values?.map(d => isNullOrUndefined(d) ? null : String(d));
    }
    else {
        return columnRaw?.[0]?.values?.map(d => isNullOrUndefined(d) ? null : Number(d));
    }
}

function extractInputData(inputView, inputSettingsClass) {
    const inputSettings = inputSettingsClass.settings;
    const numerators = extractDataColumn(inputView, "numerators");
    const denominators = extractDataColumn(inputView, "denominators");
    const keys = extractDataColumn(inputView, "key");
    const labels = extractDataColumn(inputView, "labels");
    let scatter_cond = extractConditionalFormatting(inputView, "scatter", inputSettings)?.values;
    scatter_cond = scatter_cond === null ? rep(inputSettings.scatter, numerators.length) : scatter_cond;
    let labels_cond = extractConditionalFormatting(inputView, "labels", inputSettings)?.values;
    labels_cond = labels_cond === null ? rep(inputSettings.labels, numerators.length) : labels_cond;
    const tooltips = extractDataColumn(inputView, "tooltips");
    const highlights = inputView.values[0].highlights;
    const inputValidStatus = validateInputData(keys, numerators, denominators, inputSettings.funnel.chart_type);
    if (inputValidStatus.status !== 0) {
        return {
            keys: null,
            id: null,
            numerators: null,
            denominators: null,
            highlights: null,
            anyHighlights: null,
            categories: null,
            scatter_formatting: null,
            label_formatting: null,
            tooltips: null,
            labels: null,
            anyLabels: false,
            warningMessage: inputValidStatus.error,
            validationStatus: inputValidStatus
        };
    }
    const valid_ids = new Array();
    const valid_keys = new Array();
    const removalMessages = new Array();
    const groupVarName = inputView.categories[0].source.displayName;
    const settingsMessages = inputSettingsClass.validationStatus.messages;
    let valid_x = 0;
    for (let i = 0; i < numerators.length; i++) {
        if (inputValidStatus.messages[i] === "") {
            valid_ids.push(i);
            valid_keys.push({ x: valid_x, id: i, label: keys[i] });
            valid_x += 1;
            if (settingsMessages[i].length > 0) {
                settingsMessages[i].forEach(setting_removal_message => {
                    removalMessages.push(`Conditional formatting for ${groupVarName} ${keys[i]} ignored due to: ${setting_removal_message}.`);
                });
            }
        }
        else {
            removalMessages.push(`${groupVarName} ${keys[i]} removed due to: ${inputValidStatus.messages[i]}.`);
        }
    }
    const valid_labels = extractValues(labels, valid_ids);
    return {
        keys: valid_keys,
        id: valid_ids,
        numerators: extractValues(numerators, valid_ids),
        denominators: extractValues(denominators, valid_ids),
        tooltips: extractValues(tooltips, valid_ids),
        labels: valid_labels,
        anyLabels: valid_labels.filter(d => !isNullOrUndefined(d) && d !== "").length > 0,
        highlights: extractValues(highlights, valid_ids),
        anyHighlights: highlights != null,
        categories: inputView.categories[0],
        scatter_formatting: extractValues(scatter_cond, valid_ids),
        label_formatting: extractValues(labels_cond, valid_ids),
        warningMessage: removalMessages.length > 0 ? removalMessages.join("\n") : "",
        validationStatus: inputValidStatus
    };
}

function extractValues(valuesArray, indexArray) {
    if (valuesArray) {
        const n = indexArray.length;
        let result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = valuesArray[indexArray[i]];
        }
        return result;
    }
    else {
        return [];
    }
}

const lineNameMap = {
    "ll99": "99",
    "ll95": "95",
    "ll68": "68",
    "ul68": "68",
    "ul95": "95",
    "ul99": "99",
    "target": "target",
    "alt_target": "alt_target"
};
function getAesthetic(type, group, aesthetic, inputSettings) {
    const mapName = group.includes("line") ? lineNameMap[type] : type;
    const settingName = aesthetic + "_" + mapName;
    return inputSettings[group][settingName];
}

function seq(from, to, by) {
    const n_iter = Math.floor((to - from) / by);
    const res = new Array(n_iter);
    res[0] = from;
    for (let i = 1; i < n_iter; i++) {
        res[i] = res[i - 1] + by;
    }
    return res;
}

function broadcast_unary(fun) {
    return function (y) {
        if (Array.isArray(y)) {
            return y.map((d) => fun(d));
        }
        else {
            return fun(y);
        }
    };
}
const sqrt = broadcast_unary(Math.sqrt);
const exp = broadcast_unary(Math.exp);
const log = broadcast_unary(Math.log);
const asin = broadcast_unary(Math.asin);
const square = broadcast_unary((x) => Math.pow(x, 2));
const inv = broadcast_unary((x) => 1.0 / x);

function winsorise(val, limits) {
    let rtn = val;
    if (limits.lower) {
        if (Array.isArray(rtn)) {
            rtn = rtn.map(d => d < limits.lower ? limits.lower : d);
        }
        else if (typeof rtn === "number") {
            rtn = rtn < limits.lower ? limits.lower : rtn;
        }
    }
    if (limits.upper) {
        if (Array.isArray(rtn)) {
            rtn = rtn.map(d => d > limits.upper ? limits.upper : d);
        }
        else if (typeof rtn === "number") {
            rtn = rtn > limits.upper ? limits.upper : rtn;
        }
    }
    return rtn;
}

function validateDataView(inputDV) {
    if (!(inputDV?.[0])) {
        return "No data present";
    }
    if (!(inputDV[0]?.categorical?.categories)) {
        return "No grouping/ID variable passed!";
    }
    const numeratorsPresent = inputDV[0].categorical
        ?.values
        ?.some(d => d.source?.roles?.numerators);
    if (!numeratorsPresent) {
        return "No Numerators passed!";
    }
    const denominatorsPresent = inputDV[0].categorical
        ?.values
        ?.some(d => d.source?.roles?.denominators);
    if (!denominatorsPresent) {
        return "No denominators passed!";
    }
    return "valid";
}

function validateInputData(keys, numerators, denominators, data_type) {
    const validationRtn = { status: 0, messages: rep("", keys.length) };
    keys.forEach((d, idx) => {
        validationRtn.messages[idx] = validationRtn.messages[idx] === ""
            ? ((d != null) ? "" : "Group missing")
            : validationRtn.messages[idx];
    });
    if (!validationRtn.messages.some(d => d == "")) {
        validationRtn.status = 1;
        validationRtn.error = "All Groups/IDs are missing or null!";
        return validationRtn;
    }
    numerators.forEach((d, idx) => {
        validationRtn.messages[idx] = validationRtn.messages[idx] === ""
            ? ((d != null) ? "" : "Numerator missing")
            : validationRtn.messages[idx];
    });
    if (!validationRtn.messages.some(d => d == "")) {
        validationRtn.status = 1;
        validationRtn.error = "All numerators are missing or null!";
        return validationRtn;
    }
    numerators.forEach((d, idx) => {
        validationRtn.messages[idx] = validationRtn.messages[idx] === ""
            ? (!isNaN(d) ? "" : "Numerator is not a number")
            : validationRtn.messages[idx];
    });
    if (!validationRtn.messages.some(d => d == "")) {
        validationRtn.status = 1;
        validationRtn.error = "All numerators are not numbers!";
        return validationRtn;
    }
    numerators.forEach((d, idx) => {
        validationRtn.messages[idx] = validationRtn.messages[idx] === ""
            ? ((d >= 0) ? "" : "Numerator negative")
            : validationRtn.messages[idx];
    });
    if (!validationRtn.messages.some(d => d == "")) {
        validationRtn.status = 1;
        validationRtn.error = "All numerators are negative!";
        return validationRtn;
    }
    denominators.forEach((d, idx) => {
        validationRtn.messages[idx] = validationRtn.messages[idx] === ""
            ? ((d != null) ? "" : "Denominator missing")
            : validationRtn.messages[idx];
    });
    if (!validationRtn.messages.some(d => d == "")) {
        validationRtn.status = 1;
        validationRtn.error = "All denominators missing or null!";
        return validationRtn;
    }
    denominators.forEach((d, idx) => {
        validationRtn.messages[idx] = validationRtn.messages[idx] === ""
            ? (!isNaN(d) ? "" : "Denominator is not a number")
            : validationRtn.messages[idx];
    });
    if (!validationRtn.messages.some(d => d == "")) {
        validationRtn.status = 1;
        validationRtn.error = "All denominators are not numbers!";
        return validationRtn;
    }
    denominators.forEach((d, idx) => {
        validationRtn.messages[idx] = validationRtn.messages[idx] === ""
            ? ((d >= 0) ? "" : "Denominator negative")
            : validationRtn.messages[idx];
    });
    if (!validationRtn.messages.some(d => d == "")) {
        validationRtn.status = 1;
        validationRtn.error = "All denominators are negative!";
        return validationRtn;
    }
    if (data_type === "PR") {
        denominators.forEach((d, idx) => {
            validationRtn.messages[idx] = validationRtn.messages[idx] === ""
                ? ((d >= numerators[idx]) ? "" : "Denominator < numerator")
                : validationRtn.messages[idx];
        });
        if (!validationRtn.messages.some(d => d == "")) {
            validationRtn.status = 1;
            validationRtn.error = "All denominators are smaller than numerators!";
            return validationRtn;
        }
    }
    return validationRtn;
}

function checkFlagDirection(outlierStatus, flagSettings) {
    if (outlierStatus === "none") {
        return outlierStatus;
    }
    const increaseDirectionMap = {
        "upper": "improvement",
        "lower": "deterioration"
    };
    const decreaseDirectionMap = {
        "lower": "improvement",
        "upper": "deterioration"
    };
    const neutralDirectionMap = {
        "lower": "neutral_low",
        "upper": "neutral_high"
    };
    const flagDirectionMap = {
        "increase": increaseDirectionMap[outlierStatus],
        "decrease": decreaseDirectionMap[outlierStatus],
        "neutral": neutralDirectionMap[outlierStatus]
    };
    const mappedFlag = flagDirectionMap[flagSettings.improvement_direction];
    if (flagSettings.process_flag_type !== "both") {
        return mappedFlag === flagSettings.process_flag_type ? mappedFlag : "none";
    }
    else {
        return mappedFlag;
    }
}

const truncate = broadcast_binary((val, limits) => {
    let rtn = val;
    if (limits.lower || limits.lower == 0) {
        rtn = (rtn < limits.lower ? limits.lower : rtn);
    }
    if (limits.upper) {
        rtn = (rtn > limits.upper ? limits.upper : rtn);
    }
    return rtn;
});

function identitySelected(identity, selectionManager) {
    const allSelectedIdentities = selectionManager.getSelectionIds();
    var identity_selected = false;
    for (const selected of allSelectedIdentities) {
        if (Array.isArray(identity)) {
            for (const d of identity) {
                if (selected === d) {
                    identity_selected = true;
                    break;
                }
            }
        }
        else {
            if (selected === identity) {
                identity_selected = true;
                break;
            }
        }
    }
    return identity_selected;
}

const formatValues = function (value, name, inputSettings, derivedSettings) {
    const suffix = derivedSettings.percentLabels ? "%" : "";
    const sig_figs = inputSettings.funnel.sig_figs;
    if (isNullOrUndefined(value)) {
        return "";
    }
    switch (name) {
        case "date":
            return value;
        case "integer": {
            return value.toFixed(0);
        }
        default:
            return value.toFixed(sig_figs) + suffix;
    }
};
function valueFormatter(inputSettings, derivedSettings) {
    const formatValuesImpl = function (value, name) {
        return formatValues(value, name, inputSettings, derivedSettings);
    };
    return formatValuesImpl;
}

function isValidNumber(value) {
    return !isNullOrUndefined(value) && !Number.isNaN(value) && Number.isFinite(value);
}

function groupBy(data, key) {
    const groupedData = new Map();
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const keyValue = item[key];
        if (!groupedData.has(keyValue)) {
            groupedData.set(keyValue, []);
        }
        groupedData.get(keyValue)?.push(item);
    }
    return Array.from(groupedData);
}

function drawDots(selection, visualObj) {
    const use_group_text = visualObj.viewModel.inputSettings.settings.scatter.use_group_text;
    selection
        .selectAll(".dotsgroup")
        .selectAll(".dotsgroup-child")
        .data(visualObj.viewModel.plotPoints)
        .join((enter) => {
        const dataPoint = enter.append("g").classed("dotsgroup-child", true);
        if (use_group_text) {
            dataPoint.append("text").call(text_attributes, visualObj);
        }
        else {
            dataPoint.append("path").call(dot_attributes, visualObj);
        }
        dataPoint.call(dot_tooltips, visualObj);
        return dataPoint;
    }, (update) => {
        let current_text = update.select("text");
        let current_circle = update.select("path");
        if (use_group_text) {
            current_circle.remove();
            if (!(current_text.node())) {
                current_text = update.append("text");
            }
            current_text.call(text_attributes, visualObj);
        }
        else {
            current_text.remove();
            if (!(current_circle.node())) {
                current_circle = update.append("path");
            }
            current_circle.call(dot_attributes, visualObj);
        }
        return update;
    });
    selection.on('click', () => {
        visualObj.selectionManager.clear();
        visualObj.updateHighlighting();
    });
}
function dot_tooltips(selection, visualObj) {
    selection
        .on("click", (event, d) => {
        visualObj
            .selectionManager
            .select(d.identity, (event.ctrlKey || event.metaKey))
            .then(() => visualObj.updateHighlighting());
        event.stopPropagation();
    })
        .on("mouseover", (event, d) => {
        const x = event.pageX;
        const y = event.pageY;
        visualObj.host.tooltipService.show({
            dataItems: d.tooltip,
            identities: [d.identity],
            coordinates: [x, y],
            isTouchEvent: false
        });
    })
        .on("mouseout", () => {
        visualObj.host.tooltipService.hide({
            immediately: true,
            isTouchEvent: false
        });
    });
}
function dot_attributes(selection, visualObj) {
    const ylower = visualObj.plotProperties.yAxis.lower;
    const yupper = visualObj.plotProperties.yAxis.upper;
    const xlower = visualObj.plotProperties.xAxis.lower;
    const xupper = visualObj.plotProperties.xAxis.upper;
    selection
        .attr("d", (d) => {
        const shape = d.aesthetics.shape;
        const size = d.aesthetics.size;
        return ccD3.symbol().type(d3[`symbol${shape}`]).size((size * size) * Math.PI)();
    })
        .attr("transform", (d) => {
        if (!between(d.value, ylower, yupper) || !between(d.x, xlower, xupper)) {
            return "translate(0, 0) scale(0, 0)";
        }
        return `translate(${visualObj.plotProperties.xScale(d.x)}, ${visualObj.plotProperties.yScale(d.value)})`;
    })
        .style("fill", (d) => {
        return d.aesthetics.colour;
    })
        .style("stroke", (d) => {
        return d.aesthetics.colour_outline;
    })
        .style("stroke-width", (d) => d.aesthetics.width_outline);
}
function text_attributes(selection, visualObj) {
    const ylower = visualObj.plotProperties.yAxis.lower;
    const yupper = visualObj.plotProperties.yAxis.upper;
    const xlower = visualObj.plotProperties.xAxis.lower;
    const xupper = visualObj.plotProperties.xAxis.upper;
    selection
        .attr("transform", (d) => {
        if (!between(d.value, ylower, yupper) || !between(d.x, xlower, xupper)) {
            return "translate(0, 0) scale(0, 0)";
        }
        return `translate(${visualObj.plotProperties.xScale(d.x)}, ${visualObj.plotProperties.yScale(d.value)})`;
    })
        .attr("dy", "0.35em")
        .text((d) => d.group_text)
        .style("text-anchor", "middle")
        .style("font-size", (d) => `${d.aesthetics.scatter_text_size}px`)
        .style("font-family", (d) => d.aesthetics.scatter_text_font)
        .style("fill", (d) => d.aesthetics.scatter_text_colour);
}

function drawLines(selection, visualObj) {
    selection
        .select(".linesgroup")
        .selectAll("path")
        .data(visualObj.viewModel.groupedLines)
        .join("path")
        .attr("d", d => {
        const ylower = visualObj.plotProperties.yAxis.lower;
        const yupper = visualObj.plotProperties.yAxis.upper;
        const xlower = visualObj.plotProperties.xAxis.lower;
        const xupper = visualObj.plotProperties.xAxis.upper;
        return ccD3.line()
            .x(d => visualObj.plotProperties.xScale(d.x))
            .y(d => visualObj.plotProperties.yScale(d.line_value))
            .defined(d => {
            return d.line_value !== null
                && between(d.line_value, ylower, yupper)
                && between(d.x, xlower, xupper);
        })(d[1]);
    })
        .attr("fill", "none")
        .attr("stroke", d => {
        if (visualObj.viewModel.colourPalette.isHighContrast) {
            return visualObj.viewModel.colourPalette.foregroundColour;
        }
        return getAesthetic(d[0], "lines", "colour", visualObj.viewModel.inputSettings.settings);
    })
        .attr("stroke-width", d => getAesthetic(d[0], "lines", "width", visualObj.viewModel.inputSettings.settings))
        .attr("stroke-dasharray", d => getAesthetic(d[0], "lines", "type", visualObj.viewModel.inputSettings.settings));
}

function drawTooltipLine(selection, visualObj) {
    const plotProperties = visualObj.plotProperties;
    const colour = visualObj.viewModel.colourPalette.isHighContrast
        ? visualObj.viewModel.colourPalette.foregroundColour
        : "black";
    const xAxisLine = selection
        .select(".ttip-line-x")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", plotProperties.yAxis.end_padding)
        .attr("y2", plotProperties.height - plotProperties.yAxis.start_padding)
        .attr("stroke-width", "1px")
        .attr("stroke", colour)
        .style("stroke-opacity", 0);
    const yAxisLine = selection
        .select(".ttip-line-y")
        .attr("x1", plotProperties.xAxis.start_padding)
        .attr("x2", plotProperties.width - plotProperties.xAxis.end_padding)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke-width", "1px")
        .attr("stroke", colour)
        .style("stroke-opacity", 0);
    selection.on("mousemove", (event) => {
        if (!plotProperties.displayPlot) {
            return;
        }
        const plotPoints = visualObj.viewModel.plotPoints;
        const boundRect = visualObj.svg.node().getBoundingClientRect();
        const xValue = (event.pageX - boundRect.left);
        const yValue = (event.pageY - boundRect.top);
        let indexNearestValue;
        let nearestDistance = Infinity;
        let x_coord;
        let y_coord;
        for (let i = 0; i < plotPoints.length; i++) {
            const curr_x = plotProperties.xScale(plotPoints[i].x);
            const curr_y = plotProperties.yScale(plotPoints[i].value);
            const curr_diff = Math.abs(curr_x - xValue) + Math.abs(curr_y - yValue);
            if (curr_diff < nearestDistance) {
                nearestDistance = curr_diff;
                indexNearestValue = i;
                x_coord = curr_x;
                y_coord = curr_y;
            }
        }
        visualObj.host.tooltipService.show({
            dataItems: plotPoints[indexNearestValue].tooltip,
            identities: [plotPoints[indexNearestValue].identity],
            coordinates: [x_coord, y_coord],
            isTouchEvent: false
        });
        xAxisLine.style("stroke-opacity", 0.4)
            .attr("x1", x_coord)
            .attr("x2", x_coord);
        yAxisLine.style("stroke-opacity", 0.4)
            .attr("y1", y_coord)
            .attr("y2", y_coord);
    })
        .on("mouseleave", () => {
        if (!plotProperties.displayPlot) {
            return;
        }
        visualObj.host.tooltipService.hide({ immediately: true, isTouchEvent: false });
        xAxisLine.style("stroke-opacity", 0);
        yAxisLine.style("stroke-opacity", 0);
    });
}

function drawXAxis(selection, visualObj, refresh) {
    const xAxisProperties = visualObj.plotProperties.xAxis;
    const xAxis = ccD3.axisBottom(visualObj.plotProperties.xScale);
    if (xAxisProperties.ticks) {
        if (xAxisProperties.tick_count) {
            xAxis.ticks(xAxisProperties.tick_count);
        }
    }
    else {
        xAxis.tickValues([]);
    }
    const plotHeight = visualObj.viewModel.svgHeight;
    const xAxisHeight = plotHeight - visualObj.plotProperties.yAxis.start_padding;
    const displayPlot = visualObj.plotProperties.displayPlot;
    const xAxisGroup = selection.select(".xaxisgroup");
    xAxisGroup
        .call(xAxis)
        .attr("color", displayPlot ? xAxisProperties.colour : "#FFFFFF")
        .attr("transform", `translate(0, ${xAxisHeight})`);
    const tickGroup = xAxisGroup
        .selectAll(".tick text")
        .attr("transform", "rotate(" + xAxisProperties.tick_rotation + ")")
        .attr("text-anchor", "middle")
        .attr("dx", null)
        .style("font-size", xAxisProperties.tick_size)
        .style("font-family", xAxisProperties.tick_font)
        .style("fill", displayPlot ? xAxisProperties.tick_colour : "#FFFFFF");
    if (xAxisProperties.tick_rotation != 0) {
        const textAnchor = xAxisProperties.tick_rotation < 0.0 ? "end" : "start";
        const dx = xAxisProperties.tick_rotation < 0.0 ? "-.8em" : ".8em";
        tickGroup.attr("text-anchor", textAnchor)
            .attr("dx", dx);
    }
    const xAxisNode = selection.selectAll(".xaxisgroup").node();
    if (!xAxisNode) {
        selection.select(".xaxislabel")
            .style("fill", displayPlot ? xAxisProperties.label_colour : "#FFFFFF");
        return;
    }
    const textX = visualObj.viewModel.svgWidth / 2;
    const textY = visualObj.plotProperties.yAxis.start_padding - visualObj.viewModel.inputSettings.settings.x_axis.xlimit_label_size * 0.5;
    xAxisGroup.select(".xaxislabel")
        .selectAll("text")
        .data([xAxisProperties.label])
        .join("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform", `translate(${textX}, ${textY})`)
        .style("text-anchor", "middle")
        .text(d => d)
        .style("font-size", xAxisProperties.label_size)
        .style("font-family", xAxisProperties.label_font)
        .style("fill", displayPlot ? xAxisProperties.label_colour : "#FFFFFF");
}

function drawYAxis(selection, visualObj, refresh) {
    const yAxisProperties = visualObj.plotProperties.yAxis;
    const yAxis = ccD3.axisLeft(visualObj.plotProperties.yScale);
    const yaxis_sig_figs = visualObj.viewModel.inputSettings.settings.y_axis.ylimit_sig_figs;
    const sig_figs = yaxis_sig_figs === null ? visualObj.viewModel.inputSettings.settings.funnel.sig_figs : yaxis_sig_figs;
    const displayPlot = visualObj.plotProperties.displayPlot;
    if (yAxisProperties.ticks) {
        if (yAxisProperties.tick_count) {
            yAxis.ticks(yAxisProperties.tick_count);
        }
        if (visualObj.viewModel.inputData) {
            yAxis.tickFormat((d) => {
                return visualObj.viewModel.inputSettings.derivedSettings.percentLabels
                    ? d.toFixed(sig_figs) + "%"
                    : d.toFixed(sig_figs);
            });
        }
    }
    else {
        yAxis.tickValues([]);
    }
    const yAxisGroup = selection.select(".yaxisgroup");
    yAxisGroup
        .call(yAxis)
        .attr("color", displayPlot ? yAxisProperties.colour : "#FFFFFF")
        .attr("transform", `translate(${visualObj.plotProperties.xAxis.start_padding}, 0)`)
        .selectAll(".tick text")
        .style("text-anchor", "right")
        .attr("transform", `rotate(${yAxisProperties.tick_rotation})`)
        .style("font-size", yAxisProperties.tick_size)
        .style("font-family", yAxisProperties.tick_font)
        .style("fill", displayPlot ? yAxisProperties.tick_colour : "#FFFFFF");
    const textX = -(visualObj.plotProperties.xAxis.start_padding - visualObj.viewModel.inputSettings.settings.y_axis.ylimit_label_size * 1.5);
    const textY = visualObj.viewModel.svgHeight / 2;
    yAxisGroup.select(".yaxislabel")
        .selectAll("text")
        .data([visualObj.viewModel.inputSettings.settings.y_axis.ylimit_label])
        .join("text")
        .attr("x", textX)
        .attr("y", textY)
        .attr("transform", `rotate(-90, ${textX}, ${textY})`)
        .style("text-anchor", "middle")
        .text(d => d)
        .style("font-size", yAxisProperties.label_size)
        .style("font-family", yAxisProperties.label_font)
        .style("fill", yAxisProperties.label_colour);
}

function initialiseSVG(selection, removeAll = false) {
    if (removeAll) {
        selection.selectChildren().remove();
    }
    selection.append('line').classed("ttip-line-x", true);
    selection.append('line').classed("ttip-line-y", true);
    selection.append('g').classed("xaxisgroup", true).append('g').classed('xaxislabel', true);
    selection.append('g').classed("yaxisgroup", true).append('g').classed('yaxislabel', true);
    selection.append('g').classed("linesgroup", true);
    selection.append('g').classed("dotsgroup", true);
    selection.append('g').classed("text-labels", true);
}

function drawErrors(selection, options, message, type = null) {
    selection.call(initialiseSVG, true);
    const errMessageSVG = selection.append("g").classed("errormessage", true);
    if (type) {
        const preamble = {
            "internal": "Internal Error! Please file a bug report with the following text:",
            "settings": "Invalid settings provided for all observations! First error:"
        };
        errMessageSVG.append('text')
            .attr("x", options.viewport.width / 2)
            .attr("y", options.viewport.height / 3)
            .style("text-anchor", "middle")
            .text(preamble[type])
            .style("font-size", "10px");
    }
    errMessageSVG.append('text')
        .attr("x", options.viewport.width / 2)
        .attr("y", options.viewport.height / 2)
        .style("text-anchor", "middle")
        .text(message)
        .style("font-size", "10px");
}

function getLabelAttributes(d, visualObj) {
    const label_direction_mult = d.label.aesthetics.label_position === "top" ? -1 : 1;
    const plotHeight = visualObj.viewModel.svgHeight;
    const xAxisHeight = plotHeight - visualObj.plotProperties.yAxis.start_padding;
    const label_position = d.label.aesthetics.label_position;
    let y_offset = d.label.aesthetics.label_y_offset;
    const label_initial = label_position === "top" ? (0 + y_offset) : (xAxisHeight - y_offset);
    const y = visualObj.plotProperties.yScale(d.value);
    let side_length = label_position === "top" ? (y - label_initial) : (label_initial - y);
    const x_val = visualObj.plotProperties.xScale(d.x);
    const y_val = visualObj.plotProperties.yScale(d.value);
    const theta = d.label.angle ?? (d.label.aesthetics.label_angle_offset + label_direction_mult * 90);
    side_length = d.label.distance ?? (Math.min(side_length, d.label.aesthetics.label_line_max_length));
    let line_offset = d.label.aesthetics.label_line_offset;
    line_offset = label_position === "top" ? line_offset : -(line_offset + d.label.aesthetics.label_size / 2);
    let marker_offset = d.label.aesthetics.label_marker_offset + d.label.aesthetics.label_size / 2;
    marker_offset = label_position === "top" ? -marker_offset : marker_offset;
    const newX = x_val + side_length * Math.cos(theta * Math.PI / 180);
    const newY = y_val + side_length * Math.sin(theta * Math.PI / 180);
    if (!isValidNumber(newX) || !isValidNumber(newY)) {
        return {
            x: 0,
            y: 0,
            theta: 0,
            line_offset: 0,
            marker_offset: 0
        };
    }
    return { x: newX,
        y: newY,
        theta: theta,
        line_offset: line_offset,
        marker_offset: marker_offset
    };
}
function drawLabels(selection, visualObj) {
    if (!visualObj.viewModel.inputSettings.settings.labels.show_labels
        || !visualObj.viewModel.inputData?.anyLabels) {
        selection.select(".text-labels").remove();
        return;
    }
    if (selection.select(".text-labels").empty()) {
        selection.append("g").classed("text-labels", true);
    }
    function screenToSvg(clientX, clientY, svg) {
        const point = svg.createSVGPoint();
        point.x = clientX;
        point.y = clientY;
        const ctm = svg.getScreenCTM();
        if (!ctm)
            return { x: 0, y: 0 };
        const inv = ctm.inverse();
        const transformed = point.matrixTransform(inv);
        return { x: transformed.x, y: transformed.y };
    }
    selection.select(".text-labels")
        .selectAll(".text-group-inner")
        .data(visualObj.viewModel.plotPoints)
        .join("g")
        .classed("text-group-inner", true)
        .each(function (d) {
        const textGroup = ccD3.select(this);
        if ((d.label.text_value ?? "") === "") {
            textGroup.remove();
            return;
        }
        textGroup.selectAll("*").remove();
        const textElement = textGroup.append("text");
        const lineElement = textGroup.append("line");
        const pathElement = textGroup.append("path");
        const { x, y, line_offset, marker_offset, theta } = getLabelAttributes(d, visualObj);
        const invalidXY = x === 0 && y === 0;
        if (invalidXY) {
            textGroup.remove();
            return;
        }
        const angle = theta - (d.label.aesthetics.label_position === "top" ? 180 : 0);
        const angleToRadians = angle * Math.PI / 180;
        textElement
            .attr("x", x)
            .attr("y", y)
            .text(d.label.text_value ?? "")
            .style("text-anchor", "middle")
            .style("font-size", `${d.label.aesthetics.label_size}px`)
            .style("font-family", d.label.aesthetics.label_font)
            .style("fill", d.label.aesthetics.label_colour);
        const markerSize = Math.pow(d.label.aesthetics.label_marker_size, 2);
        const markerX = visualObj.plotProperties.xScale(d.x) + marker_offset * Math.cos(angleToRadians);
        const markerY = visualObj.plotProperties.yScale(d.value) + marker_offset * Math.sin(angleToRadians);
        lineElement
            .attr("x1", x)
            .attr("y1", y + line_offset)
            .attr("x2", markerX)
            .attr("y2", markerY)
            .style("stroke", visualObj.viewModel.inputSettings.settings.labels.label_line_colour)
            .style("stroke-width", visualObj.viewModel.inputSettings.settings.labels.label_line_width)
            .style("stroke-dasharray", visualObj.viewModel.inputSettings.settings.labels.label_line_type);
        const markerRotation = angle + (d.label.aesthetics.label_position === "top" ? 90 : 270);
        pathElement
            .attr("d", ccD3.symbol().type(ccD3.symbolTriangle).size(markerSize)())
            .attr("transform", `translate(${markerX}, ${markerY}) rotate(${markerRotation})`)
            .style("fill", d.label.aesthetics.label_marker_colour)
            .style("stroke", d.label.aesthetics.label_marker_outline_colour);
        if (!visualObj.viewModel.headless) {
            const x_val = visualObj.plotProperties.xScale(d.x);
            const y_val = visualObj.plotProperties.yScale(d.value);
            const marker_offset = 10;
            const svgEl = visualObj.svg.node();
            textGroup
                .style("touch-action", "none")
                .on("pointerdown", function (event) {
                const g = this;
                g.setPointerCapture(event.pointerId);
                const onMove = (e) => {
                    const { x, y } = screenToSvg(e.clientX, e.clientY, svgEl);
                    const angle = Math.atan2(y - y_val, x - x_val) * 180 / Math.PI;
                    const distance = Math.sqrt(Math.pow(y - y_val, 2) + Math.pow(x - x_val, 2));
                    d.label.angle = angle;
                    d.label.distance = distance;
                    const x_offset = marker_offset * Math.cos(angle * Math.PI / 180);
                    const y_offset = marker_offset * Math.sin(angle * Math.PI / 180);
                    let line_offset = d.label.aesthetics.label_line_offset;
                    line_offset = d.label.aesthetics.label_position === "top"
                        ? line_offset
                        : -(line_offset + d.label.aesthetics.label_size / 2);
                    textGroup
                        .select("text")
                        .attr("x", x)
                        .attr("y", y);
                    textGroup
                        .select("line")
                        .attr("x1", x)
                        .attr("y1", y + line_offset)
                        .attr("x2", x_val + x_offset)
                        .attr("y2", y_val + y_offset);
                    textGroup
                        .select("path")
                        .attr("transform", `translate(${x_val + x_offset}, ${y_val + y_offset}) rotate(${angle - 90})`);
                };
                const onUp = (e) => {
                    const g2 = this;
                    g2.releasePointerCapture(e.pointerId);
                    g2.removeEventListener("pointermove", onMove);
                    g2.removeEventListener("pointerup", onUp);
                    g2.removeEventListener("pointercancel", onUp);
                };
                this.addEventListener("pointermove", onMove);
                this.addEventListener("pointerup", onUp);
                this.addEventListener("pointercancel", onUp);
            });
        }
    });
}

const positionOffsetMap = {
    "above": -1,
    "below": 1,
    "beside": -1
};
const outsideMap = {
    "ll99": "below",
    "ll95": "below",
    "ll68": "below",
    "ul68": "above",
    "ul95": "above",
    "ul99": "above"
};
const insideMap = {
    "ll99": "above",
    "ll95": "above",
    "ll68": "above",
    "ul68": "below",
    "ul95": "below",
    "ul99": "below"
};
function drawLineLabels(selection, visualObj) {
    const lineSettings = visualObj.viewModel.inputSettings.settings.lines;
    const rebaselinePoints = new Array();
    visualObj.viewModel.groupedLines[0][1].forEach((d, idx) => {
        if (d.line_value === null) {
            rebaselinePoints.push(idx - 1);
        }
        if (idx === visualObj.viewModel.groupedLines[0][1].length - 1) {
            rebaselinePoints.push(idx);
        }
    });
    const limits = visualObj.viewModel.groupedLines.map(d => d[0]);
    const labelsToPlot = new Array();
    rebaselinePoints.forEach((d, rb_idx) => {
        limits.forEach((limit, idx) => {
            const lastIndex = rebaselinePoints[rebaselinePoints.length - 1];
            const showN = rebaselinePoints.length - Math.min(rebaselinePoints.length, lineSettings[`plot_label_show_n_${lineNameMap[limit]}`]);
            const showLabel = lineSettings[`plot_label_show_all_${lineNameMap[limit]}`]
                || (d == lastIndex);
            if (rb_idx >= showN) {
                labelsToPlot.push({ index: d, limit: idx });
            }
            else if (showLabel) {
                labelsToPlot.push({ index: d, limit: idx });
            }
        });
    });
    const formatValue = valueFormatter(visualObj.viewModel.inputSettings.settings, visualObj.viewModel.inputSettings.derivedSettings);
    selection
        .select(".linesgroup")
        .selectAll("text")
        .data(labelsToPlot)
        .join("text")
        .text((d) => {
        const lineGroup = visualObj.viewModel.groupedLines[d.limit];
        return lineSettings[`plot_label_show_${lineNameMap[lineGroup[0]]}`]
            ? lineSettings[`plot_label_prefix_${lineNameMap[lineGroup[0]]}`] + formatValue(lineGroup[1][d.index].line_value, "value")
            : "";
    })
        .attr("x", (d) => {
        const lineGroup = visualObj.viewModel.groupedLines[d.limit];
        return visualObj.plotProperties.xScale(lineGroup[1][d.index].x);
    })
        .attr("y", (d) => {
        const lineGroup = visualObj.viewModel.groupedLines[d.limit];
        return visualObj.plotProperties.yScale(lineGroup[1][d.index].line_value);
    })
        .attr("fill", (d) => {
        const lineGroup = visualObj.viewModel.groupedLines[d.limit];
        return lineSettings[`plot_label_colour_${lineNameMap[lineGroup[0]]}`];
    })
        .attr("font-size", (d) => {
        const lineGroup = visualObj.viewModel.groupedLines[d.limit];
        return `${lineSettings[`plot_label_size_${lineNameMap[lineGroup[0]]}`]}px`;
    })
        .attr("font-family", (d) => {
        const lineGroup = visualObj.viewModel.groupedLines[d.limit];
        return lineSettings[`plot_label_font_${lineNameMap[lineGroup[0]]}`];
    })
        .attr("text-anchor", (d) => {
        const lineGroup = visualObj.viewModel.groupedLines[d.limit];
        return lineSettings[`plot_label_position_${lineNameMap[lineGroup[0]]}`] === "beside" ? "start" : "end";
    })
        .attr("dx", (d) => {
        const lineGroup = visualObj.viewModel.groupedLines[d.limit];
        const offset = (lineSettings[`plot_label_position_${lineNameMap[lineGroup[0]]}`] === "beside" ? 1 : -1) * lineSettings[`plot_label_hpad_${lineNameMap[lineGroup[0]]}`];
        return `${offset}px`;
    })
        .attr("dy", function (d) {
        const lineGroup = visualObj.viewModel.groupedLines[d.limit];
        const bounds = ccD3.select(this).node().getBoundingClientRect();
        let position = lineSettings[`plot_label_position_${lineNameMap[lineGroup[0]]}`];
        let vpadding = lineSettings[`plot_label_vpad_${lineNameMap[lineGroup[0]]}`];
        if (["outside", "inside"].includes(position)) {
            position = position === "outside" ? outsideMap[lineGroup[0]] : insideMap[lineGroup[0]];
        }
        const heightMap = {
            "above": -lineSettings[`width_${lineNameMap[lineGroup[0]]}`],
            "below": lineSettings[`plot_label_size_${lineNameMap[lineGroup[0]]}`],
            "beside": bounds.height / 4
        };
        return `${positionOffsetMap[position] * vpadding + heightMap[position]}px`;
    });
}

function max(values) {
    return Math.max(...values);
}

function getZScores(y, SE, target) {
    return divide(subtract(y, target), SE);
}

function quantile(values, q) {
    if (values.length === 0)
        return undefined;
    const sorted = [...values].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    else {
        return sorted[base];
    }
}

function winsoriseZScores(z) {
    const z_sorted = [...z].sort(function (a, b) { return a - b; });
    const lower_z = quantile(z_sorted, 0.1);
    const upper_z = quantile(z_sorted, 0.9);
    return winsorise(z, { lower: lower_z, upper: upper_z });
}

function sum(values) {
    let total = 0;
    for (let i = 0; i < values.length; i++) {
        total += values[i];
    }
    return total;
}

function getPhi(z_adj) {
    return sum(square(z_adj)) / z_adj.length;
}

function getTau2(phi, SE) {
    const N = SE.length;
    if (N * phi < N - 1) {
        return 0.0;
    }
    const w = inv(square(SE));
    const w_sq = square(w);
    const w_sum = sum(w);
    const w_sq_sum = sum(w_sq);
    const tau_num = (N * phi) - (N - 1.0);
    const tau_denom = w_sum - (w_sq_sum / w_sum);
    return tau_num / tau_denom;
}

class chartClass {
    getPlottingDenominators() {
        const maxDenominator = max(this.inputData.denominators);
        const plotDenomLower = 1;
        const plotDenomUpper = maxDenominator + maxDenominator * 0.1;
        const plotDenomStep = maxDenominator * 0.01;
        return seq(plotDenomLower, plotDenomUpper, plotDenomStep)
            .concat(this.inputData.denominators)
            .filter((d, i, arr) => arr.indexOf(d) === i)
            .sort((a, b) => a - b);
    }
    getTarget(par) {
        const targetFun = par.transformed ? this.targetFunctionTransformed : this.targetFunction;
        return targetFun(this.inputData);
    }
    getSE(par) {
        const seFun = par.odAdjust ? this.seFunctionOD : this.seFunction;
        if (par.plottingDenominators) {
            const dummyArray = JSON.parse(JSON.stringify(this.inputData));
            dummyArray.numerators = null;
            dummyArray.denominators = par.plottingDenominators;
            return seFun(dummyArray);
        }
        else {
            return seFun(this.inputData);
        }
    }
    getY() {
        return this.yFunction(this.inputData);
    }
    getZ() {
        return this.zFunction(this.inputData, this.zScores, this.seOD, this.odAdjust, this.tau2);
    }
    getTau2() {
        const targetOD = this.getTarget({ transformed: true });
        this.seOD = this.getSE({ odAdjust: true });
        const yTransformed = this.getY();
        this.zScores = getZScores(yTransformed, this.seOD, targetOD);
        const zScoresWinsorized = winsoriseZScores(this.zScores);
        const phi = getPhi(zScoresWinsorized);
        return getTau2(phi, this.seOD);
    }
    getTau2Bool() {
        const tauReturn = {
            "yes": true,
            "no": false,
            "auto": true
        };
        return tauReturn[this.inputSettings.settings.funnel.od_adjust];
    }
    getSingleLimit(par) {
        const limitFun = par.odAdjust ? this.limitFunctionOD : this.limitFunction;
        return limitFun(par.inputArgs);
    }
    getIntervals() {
        const probs = [0.001, 0.025, 0.16, 0.84, 0.975, 0.999];
        const qs = [
            -3.090232306167813,
            -1.9599639845400538,
            -0.9944578832097528,
            0.99445788320975281316,
            1.95996398454005360534,
            3.09023230616781319213
        ];
        const q_labels = ["ll99", "ll95", "ll68", "ul68", "ul95", "ul99"];
        return qs.map((d, idx) => {
            return {
                prob: probs[idx],
                quantile: d,
                label: q_labels[idx]
            };
        });
    }
    getLimits() {
        const calculateTau2 = this.getTau2Bool();
        this.tau2 = this.getTau2();
        let curr_tau2;
        if (calculateTau2) {
            curr_tau2 = this.tau2;
            this.odAdjust = this.tau2 > 0;
        }
        else {
            curr_tau2 = 0;
            this.odAdjust = false;
        }
        const target = this.getTarget({ transformed: false });
        const alt_target = this.inputSettings.settings.lines.alt_target;
        const target_transformed = this.getTarget({ transformed: true });
        const intervals = this.getIntervals();
        const plottingDenominators = this.getPlottingDenominators();
        const plottingSE = this.getSE({
            odAdjust: this.odAdjust,
            plottingDenominators: plottingDenominators
        });
        const calcLimits = plottingDenominators.map((denom, idx) => {
            const calcLimitEntries = new Array();
            calcLimitEntries.push(["denominators", denom]);
            intervals.forEach(interval => {
                const functionArgs = {
                    p: interval.prob,
                    q: interval.quantile,
                    target: target,
                    target_transformed: target_transformed,
                    SE: plottingSE[idx],
                    tau2: curr_tau2,
                    denominators: denom
                };
                const limit = this.getSingleLimit({
                    odAdjust: this.odAdjust,
                    inputArgs: functionArgs
                });
                calcLimitEntries.push([interval.label, limit]);
            });
            calcLimitEntries.push(["target", target]);
            calcLimitEntries.push(["alt_target", alt_target]);
            return Object.fromEntries(calcLimitEntries);
        });
        return calcLimits.map((d, idx) => {
            const inner = d;
            if (idx < (calcLimits.length - 1)) {
                ["99", "95", "68"].forEach(type => {
                    const lower = `ll${type}`;
                    const upper = `ul${type}`;
                    if (inner[lower] > calcLimits[idx + 1][lower]) {
                        inner[lower] = undefined;
                    }
                    if (inner[upper] < calcLimits[idx + 1][upper]) {
                        inner[upper] = undefined;
                    }
                    if (inner[lower] >= inner[upper]) {
                        inner[lower] = undefined;
                        inner[upper] = undefined;
                    }
                });
            }
            return inner;
        });
    }
    constructor(args) {
        this.seFunction = args.seFunction;
        this.seFunctionOD = args.seFunctionOD;
        this.targetFunction = args.targetFunction;
        this.targetFunctionTransformed = args.targetFunctionTransformed;
        this.yFunction = args.yFunction;
        this.zFunction = args.zFunction;
        this.limitFunction = args.limitFunction;
        this.limitFunctionOD = args.limitFunctionOD;
        this.inputData = args.inputData;
        this.inputSettings = args.inputSettings;
    }
}

function tickSpec(start, stop, count) {
    const step = (stop - start) / count;
    const power = Math.floor(Math.log10(step));
    const error = step / Math.pow(10, power);
    const factor = error >= 7.07 ? 10 : error >= 3.16 ? 5 : error >= 1.41 ? 2 : 1;
    let i1;
    let i2;
    let inc;
    if (power < 0) {
        inc = Math.pow(10, -power) / factor;
        i1 = Math.round(start * inc);
        i2 = Math.round(stop * inc);
        if (i1 / inc < start)
            ++i1;
        if (i2 / inc > stop)
            --i2;
        inc = -inc;
    }
    else {
        inc = Math.pow(10, power) * factor;
        i1 = Math.round(start / inc);
        i2 = Math.round(stop / inc);
        if (i1 * inc < start)
            ++i1;
        if (i2 * inc > stop)
            --i2;
    }
    if (i2 < i1 && 0.5 <= count && count < 2) {
        return tickSpec(start, stop, count * 2);
    }
    if (inc < 0) {
        inc = 1 / (-inc);
    }
    return [i1, i2, inc];
}
function scaleLinear() {
    let domain = [0, 1];
    let range = [0, 1];
    function scale(x) {
        const [d0, d1] = domain;
        const [r0, r1] = range;
        return r0 + (r1 - r0) * ((x - d0) / (d1 - d0));
    }
    scale.domain = function (newDomain) {
        if (!newDomain) {
            return domain.slice();
        }
        domain = newDomain;
        return scale;
    };
    scale.range = function (newRange) {
        if (!newRange) {
            return range.slice();
        }
        range = newRange;
        return scale;
    };
    scale.invert = function (y) {
        const [d0, d1] = domain;
        const [r0, r1] = range;
        return d0 + (d1 - d0) * ((y - r0) / (r1 - r0));
    };
    scale.copy = function () {
        const newScale = scaleLinear();
        newScale.domain(domain);
        newScale.range(range);
        return newScale;
    };
    scale.ticks = function (count) {
        const [d0, d1] = domain;
        count ?? (count = 10);
        if (count <= 0) {
            return [];
        }
        if (d0 === d1) {
            return [d0];
        }
        const [i1, i2, inc] = tickSpec(d0, d1, count);
        if (!(i2 >= i1))
            return [];
        const n = i2 - i1 + 1;
        const ticks = new Array(n);
        for (let i = 0; i < n; ++i) {
            ticks[i] = (i1 + i) * inc;
        }
        return ticks;
    };
    return scale;
}

class plotPropertiesClass {
    initialiseScale(svgWidth, svgHeight) {
        this.xScale = scaleLinear()
            .domain([this.xAxis.lower, this.xAxis.upper])
            .range([this.xAxis.start_padding,
            svgWidth - this.xAxis.end_padding]);
        this.yScale = scaleLinear()
            .domain([this.yAxis.lower, this.yAxis.upper])
            .range([svgHeight - this.yAxis.start_padding,
            this.yAxis.end_padding]);
    }
    update(options, viewModel) {
        const plotPoints = viewModel.plotPoints;
        const inputData = viewModel.inputData;
        const inputSettings = viewModel.inputSettings.settings;
        const derivedSettings = viewModel.inputSettings.derivedSettings;
        const colorPalette = viewModel.colourPalette;
        this.width = options.viewport.width;
        this.height = options.viewport.height;
        this.displayPlot = plotPoints
            ? plotPoints.length > 1
            : null;
        const xTickSize = inputSettings.x_axis.xlimit_tick_size;
        const yTickSize = inputSettings.y_axis.ylimit_tick_size;
        const xTicksCount = inputSettings.x_axis.xlimit_tick_count;
        const yTicksCount = inputSettings.y_axis.ylimit_tick_count;
        const xLowerLimit = inputSettings.x_axis.xlimit_l;
        let xUpperLimit = inputSettings.x_axis.xlimit_u;
        if (!isNullOrUndefined(inputData?.denominators)) {
            xUpperLimit = xUpperLimit ? xUpperLimit : max(inputData.denominators) * 1.1;
        }
        const leftLabelPadding = inputSettings.y_axis.ylimit_label
            ? inputSettings.y_axis.ylimit_label_size
            : 0;
        const lowerLabelPadding = inputSettings.x_axis.xlimit_label
            ? inputSettings.x_axis.xlimit_label_size + 20
            : 0;
        this.xAxis = {
            lower: xLowerLimit ?? 0,
            upper: xUpperLimit,
            start_padding: inputSettings.canvas.left_padding + leftLabelPadding,
            end_padding: inputSettings.canvas.right_padding,
            colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.x_axis.xlimit_colour,
            ticks: (xTicksCount !== null) ? (xTicksCount > 0) : inputSettings.x_axis.xlimit_ticks,
            tick_size: `${xTickSize}px`,
            tick_font: inputSettings.x_axis.xlimit_tick_font,
            tick_colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.x_axis.xlimit_tick_colour,
            tick_rotation: inputSettings.x_axis.xlimit_tick_rotation,
            tick_count: inputSettings.x_axis.xlimit_tick_count,
            label: inputSettings.x_axis.xlimit_label,
            label_size: `${inputSettings.x_axis.xlimit_label_size}px`,
            label_font: inputSettings.x_axis.xlimit_label_font,
            label_colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.x_axis.xlimit_label_colour
        };
        const yLowerLimit = inputSettings.y_axis.ylimit_l;
        let yUpperLimit = inputSettings.y_axis.ylimit_u;
        if (!isNullOrUndefined(inputData?.numerators) && !isNullOrUndefined(inputData?.denominators)) {
            const maxRatio = max(divide(inputData.numerators, inputData.denominators));
            yUpperLimit ?? (yUpperLimit = maxRatio * derivedSettings.multiplier);
        }
        this.yAxis = {
            lower: yLowerLimit ?? 0,
            upper: yUpperLimit,
            start_padding: inputSettings.canvas.lower_padding + lowerLabelPadding,
            end_padding: inputSettings.canvas.upper_padding,
            colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.y_axis.ylimit_colour,
            ticks: (yTicksCount !== null) ? (yTicksCount > 0) : inputSettings.y_axis.ylimit_ticks,
            tick_size: `${yTickSize}px`,
            tick_font: inputSettings.y_axis.ylimit_tick_font,
            tick_colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.y_axis.ylimit_tick_colour,
            tick_rotation: inputSettings.y_axis.ylimit_tick_rotation,
            tick_count: inputSettings.y_axis.ylimit_tick_count,
            label: inputSettings.y_axis.ylimit_label,
            label_size: `${inputSettings.y_axis.ylimit_label_size}px`,
            label_font: inputSettings.y_axis.ylimit_label_font,
            label_colour: colorPalette.isHighContrast ? colorPalette.foregroundColour : inputSettings.y_axis.ylimit_label_colour
        };
        this.initialiseScale(options.viewport.width, options.viewport.height);
    }
}

class derivedSettingsClass {
    update(inputSettings) {
        const chartType = inputSettings.funnel.chart_type;
        const pChartType = ["PR"].includes(chartType);
        const percentSettingString = inputSettings.funnel.perc_labels;
        let multiplier = inputSettings.funnel.multiplier;
        let percentLabels;
        if (percentSettingString === "Yes") {
            multiplier = 100;
        }
        if (pChartType) {
            multiplier = multiplier === 1 ? 100 : multiplier;
        }
        if (percentSettingString === "Automatic") {
            percentLabels = pChartType && multiplier === 100;
        }
        else {
            percentLabels = percentSettingString === "Yes";
        }
        this.multiplier = multiplier;
        this.percentLabels = percentLabels;
    }
}

class settingsClass {
    update(inputView) {
        this.validationStatus
            = JSON.parse(JSON.stringify({ status: 0, messages: new Array(), error: "" }));
        const allSettingGroups = Object.keys(this.settings);
        allSettingGroups.forEach((settingGroup) => {
            const condFormatting = extractConditionalFormatting(inputView?.categorical, settingGroup, this.settings);
            if (condFormatting.validation.status !== 0) {
                this.validationStatus.status = condFormatting.validation.status;
                this.validationStatus.error = condFormatting.validation.error;
            }
            if (this.validationStatus.messages.length === 0) {
                this.validationStatus.messages = condFormatting.validation.messages;
            }
            else if (!condFormatting.validation.messages.every(d => d.length === 0)) {
                condFormatting.validation.messages.forEach((message, idx) => {
                    if (message.length > 0) {
                        this.validationStatus.messages[idx] = this.validationStatus.messages[idx].concat(message);
                    }
                });
            }
            const settingNames = Object.keys(this.settings[settingGroup]);
            settingNames.forEach((settingName) => {
                this.settings[settingGroup][settingName]
                    = condFormatting?.values
                        ? condFormatting?.values[0][settingName]
                        : defaultSettings[settingGroup][settingName];
            });
        });
        this.derivedSettings.update(this.settings);
    }
    getFormattingModel() {
        const formattingModel = {
            cards: []
        };
        for (const curr_card_name in settingsModel) {
            let curr_card = {
                description: settingsModel[curr_card_name].description,
                displayName: settingsModel[curr_card_name].displayName,
                uid: curr_card_name + "_card_uid",
                groups: [],
                revertToDefaultDescriptors: []
            };
            for (const card_group in settingsModel[curr_card_name].settingsGroups) {
                let curr_group = {
                    displayName: card_group === "all" ? settingsModel[curr_card_name].displayName : card_group,
                    uid: curr_card_name + "_" + card_group + "_uid",
                    slices: []
                };
                for (const setting in settingsModel[curr_card_name].settingsGroups[card_group]) {
                    curr_card.revertToDefaultDescriptors.push({
                        objectName: curr_card_name,
                        propertyName: setting
                    });
                    let curr_slice = {
                        uid: curr_card_name + "_" + card_group + "_" + setting + "_slice_uid",
                        displayName: settingsModel[curr_card_name].settingsGroups[card_group][setting].displayName,
                        control: {
                            type: settingsModel[curr_card_name].settingsGroups[card_group][setting].type,
                            properties: {
                                descriptor: {
                                    objectName: curr_card_name,
                                    propertyName: setting,
                                    selector: { data: [{ dataViewWildcard: { matchingOption: 0 } }] },
                                    instanceKind: (typeof this.settings[curr_card_name][setting]) != "boolean"
                                        ? 3
                                        : null
                                },
                                value: this.valueLookup(curr_card_name, card_group, setting),
                                items: settingsModel[curr_card_name].settingsGroups[card_group][setting]?.items,
                                options: settingsModel[curr_card_name].settingsGroups[card_group][setting]?.options
                            }
                        }
                    };
                    curr_group.slices.push(curr_slice);
                }
                curr_card.groups.push(curr_group);
            }
            formattingModel.cards.push(curr_card);
        }
        return formattingModel;
    }
    valueLookup(settingCardName, settingGroupName, settingName) {
        if (settingName.includes("colour")) {
            return { value: this.settings[settingCardName][settingName] };
        }
        if (!isNullOrUndefined(settingsModel[settingCardName].settingsGroups[settingGroupName][settingName]?.items)) {
            const allItems = settingsModel[settingCardName].settingsGroups[settingGroupName][settingName].items;
            const currValue = this.settings[settingCardName][settingName];
            return allItems.find(item => item.value === currValue);
        }
        return this.settings[settingCardName][settingName];
    }
    constructor() {
        this.validationStatus = { status: 0, messages: new Array(), error: "" };
        this.settings = settingsModel.defaultValues;
        this.derivedSettings = new derivedSettingsClass();
    }
}

function chebyshevPolynomial(x, a, n) {
    if (x < -1.1 || x > 1.1) {
        throw new Error("chebyshevPolynomial: x must be in [-1,1]");
    }
    if (n < 1 || n > 1000) {
        throw new Error("chebyshevPolynomial: n must be in [1,1000]");
    }
    const twox = x * 2;
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 1; i <= n; i++) {
        b2 = b1;
        b1 = b0;
        b0 = twox * b1 - b2 + a[n - i];
    }
    return (b0 - b2) * 0.5;
}

function sinpi(x) {
    if (Number.isNaN(x) || !Number.isFinite(x)) {
        return Number.NaN;
    }
    let r = x % 2;
    if (r <= -1) {
        r += 2;
    }
    else if (r > 1) {
        r -= 2;
    }
    if (r === 0 || r === 1) {
        return 0;
    }
    if (r === 0.5) {
        return 1;
    }
    if (r === -0.5) {
        return -1;
    }
    return Math.sin(Math.PI * r);
}

function lgammaCorrection(x) {
    const algmcs = [
        .1666389480451863247205729650822e+0,
        -1384948176067564e-20,
        .9810825646924729426157171547487e-8,
        -1809129475572494e-26,
        .6221098041892605227126015543416e-13,
        -3399615005417722e-31,
        .2683181998482698748957538846666e-17,
        -2868042435334643e-35,
        .3962837061046434803679306666666e-21,
        -6831888753985767e-39,
        .1429227355942498147573333333333e-24,
        -35475981581010704e-43,
        .1025680058010470912000000000000e-27,
        -3401102254316749e-45,
        .1276642195630062933333333333333e-30
    ];
    if (x < 10) {
        throw new Error("lgammaCorrection: x must be >= 10");
    }
    else if (x < 94906265.62425156) {
        const tmp = 10 / x;
        return chebyshevPolynomial(tmp * tmp * 2 - 1, algmcs, 5) / x;
    }
    else {
        return 1 / (x * 12);
    }
}

function ldexp(x, exp) {
    return x * Math.pow(2, exp);
}

const LOG_TWO_PI = 1.837877066409345483560659472811;
const LOG_SQRT_TWO_PI = 0.918938533204672741780329736406;
const LOG_SQRT_PI_DIV_2 = 0.225791352644727432363097614947;
const EULER = 0.5772156649015328606065120900824024;
const SQRT_TWO_PI = 2.50662827463100050241576528481104525301;
const TWO_PI = 6.283185307179586476925286766559;
const SQRT_THIRTY_TWO = 5.656854249492380195206754896838;
const ONE_DIV_SQRT_TWO_PI = 0.398942280401432677939946059934;

function stirlingError(n) {
    const s_coeffs = [
        0.083333333333333333333,
        0.00277777777777777777778,
        0.00079365079365079365079365,
        0.000595238095238095238095238,
        0.0008417508417508417508417508,
        0.0019175269175269175269175262,
        0.0064102564102564102564102561,
        0.029550653594771241830065352,
        0.17964437236883057316493850,
        1.3924322169059011164274315,
        13.402864044168391994478957,
        156.84828462600201730636509,
        2193.1033333333333333333333,
        36108.771253724989357173269,
        691472.26885131306710839498,
        15238221.539407416192283370,
        382900751.39141414141414141
    ];
    const sferr_halves = [
        0.0,
        0.1534264097200273452913848,
        0.0810614667953272582196702,
        0.0548141210519176538961390,
        0.0413406959554092940938221,
        0.03316287351993628748511048,
        0.02767792568499833914878929,
        0.02374616365629749597132920,
        0.02079067210376509311152277,
        0.01848845053267318523077934,
        0.01664469118982119216319487,
        0.01513497322191737887351255,
        0.01387612882307074799874573,
        0.01281046524292022692424986,
        0.01189670994589177009505572,
        0.01110455975820691732662991,
        0.010411265261972096497478567,
        0.009799416126158803298389475,
        0.009255462182712732917728637,
        0.008768700134139385462952823,
        0.008330563433362871256469318,
        0.007934114564314020547248100,
        0.007573675487951840794972024,
        0.007244554301320383179543912,
        0.006942840107209529865664152,
        0.006665247032707682442354394,
        0.006408994188004207068439631,
        0.006171712263039457647532867,
        0.005951370112758847735624416,
        0.005746216513010115682023589,
        0.005554733551962801371038690
    ];
    let nn = n + n;
    if (n <= 15 && nn === Math.trunc(nn)) {
        return sferr_halves[nn];
    }
    if (n <= 5.25) {
        if (n >= 1) {
            const l_n = Math.log(n);
            return lgamma(n) + n * (1 - l_n) + ldexp(l_n - LOG_TWO_PI, -1);
        }
        else {
            return lgamma1p(n) - (n + 0.5) * Math.log(n) + n - LOG_SQRT_TWO_PI;
        }
    }
    let start_coeff;
    if (n > 15.7e6) {
        start_coeff = 0;
    }
    else if (n > 6180) {
        start_coeff = 1;
    }
    else if (n > 205) {
        start_coeff = 2;
    }
    else if (n > 86) {
        start_coeff = 3;
    }
    else if (n > 27) {
        start_coeff = 4;
    }
    else if (n > 23.5) {
        start_coeff = 5;
    }
    else if (n > 12.8) {
        start_coeff = 6;
    }
    else if (n > 12.3) {
        start_coeff = 7;
    }
    else if (n > 8.9) {
        start_coeff = 8;
    }
    else if (n > 7.3) {
        start_coeff = 10;
    }
    else if (n > 6.6) {
        start_coeff = 12;
    }
    else if (n > 6.1) {
        start_coeff = 14;
    }
    else {
        start_coeff = 16;
    }
    nn = n * n;
    let sum = s_coeffs[start_coeff];
    for (let i = start_coeff - 1; i >= 0; i--) {
        sum = s_coeffs[i] - sum / nn;
    }
    return sum / n;
}

function gamma(x) {
    const gamcs = [
        .8571195590989331421920062399942e-2,
        .4415381324841006757191315771652e-2,
        .5685043681599363378632664588789e-1,
        -0.00421983539641856,
        .1326808181212460220584006796352e-2,
        -18930245297988805e-20,
        .3606925327441245256578082217225e-4,
        -6056761904460864e-21,
        .1055829546302283344731823509093e-5,
        -1.811967365542384e-7,
        .3117724964715322277790254593169e-7,
        -5.354219639019687e-9,
        .9193275519859588946887786825940e-9,
        -15779412802883398e-26,
        .2707980622934954543266540433089e-10,
        -464681865382573e-26,
        .7973350192007419656460767175359e-12,
        -1368078209830916e-28,
        .2347319486563800657233471771688e-13,
        -4027432614949067e-30,
        .6910051747372100912138336975257e-15,
        -1185584500221993e-31,
        .2034148542496373955201026051932e-16,
        -3490054341717406e-33,
        .5987993856485305567135051066026e-18,
        -1027378057872228e-34,
        .1762702816060529824942759660748e-19,
        -3024320653735306e-36,
        .5188914660218397839717833550506e-21,
        -8902770842456576e-38,
        .1527474068493342602274596891306e-22,
        -2620731256187363e-39,
        .4496464047830538670331046570666e-24,
        -7714712731336878e-41,
        .1323635453126044036486572714666e-25,
        -22709994129429287e-43,
        .3896418998003991449320816639999e-27,
        -6685198115125953e-44,
        .1146998663140024384347613866666e-28,
        -19679385863451348e-46,
        .3376448816585338090334890666666e-30,
        -5793070335782136e-47
    ];
    const dxrel = 1.490116119384765696e-8;
    if (Number.isNaN(x)) {
        return Number.NaN;
    }
    if (x == 0 || (x < 0 && x === Math.trunc(x))) {
        return Number.NaN;
    }
    let y = Math.abs(x);
    let value;
    if (y <= 10) {
        let n = Math.trunc(x);
        if (x < 0) {
            n--;
        }
        y = x - n;
        n--;
        value = chebyshevPolynomial(y * 2 - 1, gamcs, 22) + .9375;
        if (n == 0) {
            return value;
        }
        if (n < 0) {
            if (x < -0.5 && Math.abs(x - Math.trunc(x - 0.5) / x) < dxrel) {
                return Number.NaN;
            }
            if (y < 2.2474362225598545e-308) {
                return x < 0 ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
            }
            n *= -1;
            for (let i = 0; i < n; i++) {
                value /= (x + i);
            }
            return value;
        }
        else {
            for (let i = 1; i <= n; i++) {
                value *= (y + i);
            }
            return value;
        }
    }
    else {
        if (x > 171.61447887182298) {
            return Number.POSITIVE_INFINITY;
        }
        if (x < -170.5674972726612) {
            return 0;
        }
        if (y <= 50 && y == Math.trunc(y)) {
            value = 1;
            for (let i = 2; i < y; i++) {
                value *= i;
            }
        }
        else {
            const two_y = 2 * y;
            value = Math.exp((y - 0.5) * Math.log(y) - y + LOG_SQRT_TWO_PI
                + ((two_y == Math.trunc(two_y)) ? stirlingError(y) : lgammaCorrection(y)));
        }
        if (x > 0) {
            return value;
        }
        const sinpiy = sinpi(y);
        return (sinpiy === 0) ? Number.POSITIVE_INFINITY : -Math.PI / (y * sinpiy * value);
    }
}

function lgamma(x) {
    if (Number.isNaN(x)) {
        return Number.NaN;
    }
    if (x <= 0 && x === Math.trunc(x)) {
        return Number.POSITIVE_INFINITY;
    }
    const y = Math.abs(x);
    if (y < 1e-306) {
        return -Math.log(y);
    }
    if (y <= 10) {
        return Math.log(Math.abs(gamma(x)));
    }
    if (y > Number.MAX_VALUE) {
        return Number.POSITIVE_INFINITY;
    }
    if (x > 0) {
        if (x > 1e17) {
            return x * (Math.log(x) - 1);
        }
        else {
            return LOG_SQRT_TWO_PI + (x - 0.5) * Math.log(x) - x
                + ((x > 4934720) ? 0 : lgammaCorrection(x));
        }
    }
    return LOG_SQRT_PI_DIV_2 + (x - 0.5) * Math.log(y)
        - x - Math.log(Math.abs(sinpi(y))) - lgammaCorrection(y);
}

function logcf(x, i, d, eps) {
    let c1 = 2 * d;
    let c2 = i + d;
    let c4 = c2 + d;
    let a1 = c2;
    let b1 = i * (c2 - i * x);
    let b2 = d * d * x;
    let a2 = c4 * c2 - b2;
    const scalefactor = 1.157921e+77;
    b2 = c4 * b1 - i * b2;
    while (Math.abs(a2 * b1 - a1 * b2) > Math.abs(eps * b1 * b2)) {
        let c3 = c2 * c2 * x;
        c2 += d;
        c4 += d;
        a1 = c4 * a2 - c3 * a1;
        b1 = c4 * b2 - c3 * b1;
        c3 = c1 * c1 * x;
        c1 += d;
        c4 += d;
        a2 = c4 * a1 - c3 * a2;
        b2 = c4 * b1 - c3 * b2;
        if (Math.abs(b2) > scalefactor) {
            a1 /= scalefactor;
            b1 /= scalefactor;
            a2 /= scalefactor;
            b2 /= scalefactor;
        }
        else if (Math.abs(b2) < 1 / scalefactor) {
            a1 *= scalefactor;
            b1 *= scalefactor;
            a2 *= scalefactor;
            b2 *= scalefactor;
        }
    }
    return a2 / b2;
}

function log1pmx(x) {
    if (x > 1 || x < -0.79149064) {
        return Math.log1p(x) - x;
    }
    else {
        const r = x / (2 + x);
        const y = r * r;
        if (Math.abs(x) < 1e-2) {
            const coefs = [2 / 3, 2 / 5, 2 / 7, 2 / 9];
            let result = 0;
            for (let i = 0; i < coefs.length; i++) {
                result = (result + coefs[i]) * y;
            }
            return r * (result - x);
        }
        else {
            return r * (2 * y * logcf(y, 3, 2, 1e-14) - x);
        }
    }
}

function lgamma1p(a) {
    if (Math.abs(a) >= 0.5) {
        return lgamma(a + 1);
    }
    const coeffs = [
        0.3224670334241132182362075833230126e-0,
        0.6735230105319809513324605383715000e-1,
        0.2058080842778454787900092413529198e-1,
        0.7385551028673985266273097291406834e-2,
        0.2890510330741523285752988298486755e-2,
        0.1192753911703260977113935692828109e-2,
        0.5096695247430424223356548135815582e-3,
        0.2231547584535793797614188036013401e-3,
        0.9945751278180853371459589003190170e-4,
        0.4492623673813314170020750240635786e-4,
        0.2050721277567069155316650397830591e-4,
        0.9439488275268395903987425104415055e-5,
        0.4374866789907487804181793223952411e-5,
        0.2039215753801366236781900709670839e-5,
        0.9551412130407419832857179772951265e-6,
        0.4492469198764566043294290331193655e-6,
        0.2120718480555466586923135901077628e-6,
        0.1004322482396809960872083050053344e-6,
        0.4769810169363980565760193417246730e-7,
        0.2271109460894316491031998116062124e-7,
        0.1083865921489695409107491757968159e-7,
        0.5183475041970046655121248647057669e-8,
        0.2483674543802478317185008663991718e-8,
        0.1192140140586091207442548202774640e-8,
        0.5731367241678862013330194857961011e-9,
        0.2759522885124233145178149692816341e-9,
        0.1330476437424448948149715720858008e-9,
        0.6422964563838100022082448087644648e-10,
        0.3104424774732227276239215783404066e-10,
        0.1502138408075414217093301048780668e-10,
        0.7275974480239079662504549924814047e-11,
        0.3527742476575915083615072228655483e-11,
        0.1711991790559617908601084114443031e-11,
        0.8315385841420284819798357793954418e-12,
        0.4042200525289440065536008957032895e-12,
        0.1966475631096616490411045679010286e-12,
        0.9573630387838555763782200936508615e-13,
        0.4664076026428374224576492565974577e-13,
        0.2273736960065972320633279596737272e-13,
        0.1109139947083452201658320007192334e-13
    ];
    const N = coeffs.length;
    const c = 0.2273736845824652515226821577978691e-12;
    let lgam = c * logcf(-a / 2, N + 2, 1, 1e-14);
    for (let i = N - 1; i >= 0; i--) {
        lgam = coeffs[i] - a * lgam;
    }
    return (a * lgam - EULER) * a - log1pmx(a);
}

function frexp(value) {
    if (value === 0) {
        return { mantissa: 0, exponent: 0 };
    }
    const data = new DataView(new ArrayBuffer(8));
    data.setFloat64(0, value);
    let bits = (data.getUint32(0) >>> 20) & 0x7FF;
    if (bits === 0) {
        data.setFloat64(0, value * Math.pow(2, 64));
        bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64;
    }
    const exponent = bits - 1022;
    const mantissa = value / Math.pow(2, exponent);
    return { mantissa: mantissa, exponent: exponent };
}

const bd0_scale = [
    [0.69314718246459961, -1.9046542121259336e-9, -878318373858934e-31, 3.0618407385293692e-24],
    [0.68530404567718506, -4.2578264469739224e-8, -11723105396588968e-31, 6.2033926372016101e-23],
    [0.67739880084991455, 2.2741890148836319e-08, 1.4411920431605914e-15, 7.0463845466501636e-23],
    [0.66993057727813721, -4.8293856025338755e-8, -8664795531738382e-31, 7.0495576607553246e-24],
    [0.66240608692169189, -4.791602492559832e-8, -2161508226230938e-30, 7.0929683608252748e-23],
    [0.65482449531555176, 6.2377152332260266e-09, 1.1806699607549086e-16, 6.6603235335351226e-25],
    [0.64718508720397949, -4.220866856030625e-8, -13817589176253094e-31, -11159932395766606e-39],
    [0.64000189304351807, -4.979170142860312e-8, 4.8870137639076255e-16, 1.6847465694533583e-23],
    [0.6327667236328125, -5.406177194799966e-8, -27224545250006775e-31, -29070780223955397e-39],
    [0.62495613098144531, 3.285935434860221e-08, 1.2016729367754671e-16, -8668233185091897e-39],
    [0.61813735961914062, -6406189467789147e-26, 3.5505809623358779e-18, -3623679406748965e-40],
    [0.61074161529541016, 4.2298538005525188e-08, 1.5481432935203661e-15, -5446353118719766e-38],
    [0.60329079627990723, 5.5158174916414282e-08, 2.1193636784238266e-15, 1.2471098264106631e-22],
    [0.59632217884063721, 3.2813538553000399e-09, -14033469816541837e-32, 5.5440619826430738e-24],
    [0.58930456638336182, 4.3079985800886789e-08, -32446651600595306e-31, -2569782398567476e-38],
    [0.58223748207092285, -3.983067387025585e-8, 2.9387905513776885e-15, 1.6124430498687833e-22],
    [0.57511997222900391, 2.2423840562169062e-09, -2204516403537114e-32, 4.0785437537513542e-25],
    [0.5685046911239624, 4.4228706030935427e-08, 2.7879957109977287e-16, -9741708794029408e-39],
    [0.56184542179107666, 2.1471613820267521e-08, 1.3374919170106156e-15, -2326922260336506e-38],
    [0.55458080768585205, 4.5778349999636703e-09, 2.6331459121410258e-16, 2.0709959033879981e-23],
    [0.54782783985137939, -7.667999568639061e-9, 6.1990953277753225e-16, 6.3419790110560228e-24],
    [0.54102897644042969, -3.7302321231891256e-8, -33801781496424835e-31, 1.4469198371142414e-22],
    [0.53475570678710938, 4.3828919160660007e-08, -8601820749692393e-31, -8775950563978016e-39],
    [0.52786707878112793, 1.0839714903454478e-08, -4480281248130319e-31, 3.8840996084516777e-23],
    [0.52151048183441162, 4.2031594205127476e-08, 1.211009992711288e-15, -23206744819671555e-39],
    [0.51452970504760742, -1.2322940889930578e-8, 2.8200844954132738e-16, 1.880026562185923e-23],
    [0.50808751583099365, -1.2297126872340414e-8, -4295835588700959e-31, -18036626177499945e-39],
    [0.50160348415374756, 5.9145378372704727e-08, 1.2728561033550608e-15, -5824094430019416e-38],
    [0.49507725238800049, 1.4409851090135817e-08, -6381910184083422e-32, -3500509376717118e-40],
    [0.48910707235336304, 2.7457986107037868e-08, -14470418644525664e-31, 4.2118668969499388e-23],
    [0.48249846696853638, 1.7622454606680549e-08, 4.128675224747099e-16, 2.6082691866392177e-23],
    [0.4764525294303894, -1.2470243504481004e-8, -9162193924794196e-32, 3.7657825422403758e-24],
    [0.46975946426391602, -5.450353945946063e-9, -4304846960468561e-31, 2.0747103437070831e-25],
    [0.46363574266433716, -1.7013046527125653e-9, 7.6016227388785886e-18, -20415879231895994e-41],
    [0.45747429132461548, 6.9436845162584859e-10, -25461310777374286e-33, 5.5412533419976475e-25],
    [0.45127463340759277, 1.0731865174307131e-08, 6.374000219845047e-16, 3.9015473184089939e-23],
    [0.44503629207611084, 2.8650656958006948e-08, -9155352545558342e-31, -47365878254772817e-39],
    [0.43938833475112915, 2.6186132373595683e-08, 1.3619601577579505e-15, -52672794844240613e-39],
    [0.4330751895904541, 1.9065733880552216e-08, 1.0143192014799461e-15, 1.0145670737413337e-22],
    [0.42735910415649414, -1.141359362577532e-8, 1.3242044582274781e-16, -10240055893684678e-39],
    [0.42096930742263794, -1.2778508917676845e-8, 6.1435257312707041e-16, 1.419242178938019e-23],
    [0.41518336534500122, -7.767916088141646e-9, 5.9554431241240708e-16, 2.732668133771502e-23],
    [0.40936374664306641, 1.8807551072086426e-09, 1.9153331349462894e-16, -56208063158075e-37],
    [0.40351009368896484, -2.0416603518924603e-8, -293405013148838e-30, 1.8943469119705811e-24],
    [0.39762192964553833, 1.0016001361634608e-09, 2.2863242352463633e-17, 9.4581336117707638e-25],
    [0.39169889688491821, 1.5459097113534881e-08, 1.0962823446210085e-15, 3.1083022398211258e-23],
    [0.38640439510345459, -2.076412375373593e-9, 1.5073464810114547e-16, 7.4124494543750944e-24],
    [0.38041436672210693, -8.244395388601333e-9, 1.4866224964678982e-16, -3927292740683968e-39],
    [0.37438821792602539, 9.1585299344387749e-09, 5.6569190673585014e-16, 3.4213474905617904e-23],
    [0.36900103092193604, -2.2253590969967263e-8, 6.2314053995483377e-16, -21564751355837555e-39],
    [0.36358463764190674, -2.6778728567933285e-8, -9943908455716573e-31, -4704929732945495e-39],
    [0.35745590925216675, -2.033036139437172e-8, -15794492077344114e-31, 6.3186780320680572e-23],
    [0.35197639465332031, 2.8503858828798911e-08, -9566434575519799e-31, -6409595040255684e-39],
    [0.3464667797088623, -1.236265312343221e-8, -6003368248279719e-31, -2860901497105794e-39],
    [0.34092658758163452, -6110413286464222e-25, 1.7467136243918857e-17, 1.9962587429804357e-25],
    [0.33535552024841309, 2.167272583619706e-08, -10918773497788125e-31, -3047574780704126e-38],
    [0.33045530319213867, -1.608884048209802e-8, -3833435008838916e-31, -7683741875124221e-39],
    [0.32482540607452393, 2.8016703623734429e-08, -20725720961098414e-32, 1.3160777896524739e-23],
    [0.31916368007659912, 2.6222629401218001e-08, -13995222573204161e-31, 8.5998839096808329e-23],
    [0.31418323516845703, 2.6826626253750874e-08, -9792556373536439e-31, 2.2954960929108544e-23],
    [0.3084607720375061, 1.3683509436646091e-08, 5.5919950507426434e-16, -11938701403427125e-39],
    [0.30342662334442139, -8.629042369534545e-9, -5222554219259392e-31, 3.228770766379237e-23],
    [0.2983669638633728, 8.6884242023188563e-09, 2.7641167934234459e-16, -10171858868428321e-39],
    [0.29255300760269165, -4.91631446664087e-9, 2.5622847239605072e-16, -26341575505102177e-39],
    [0.28743791580200195, -1.3782395669181824e-8, 7.2903935187764498e-16, -4431977943282236e-39],
    [0.28229647874832153, 2.3770866164340987e-08, 6.4492283922642536e-16, 3.4175369768452108e-23],
    [0.27712851762771606, 1.4733029018998423e-08, 6.793364114448283e-16, 3.5938980340322221e-24],
    [0.27193373441696167, -1.8933320689029642e-8, 7.7793941095558299e-16, 2.5919724247426189e-23],
    [0.2667117714881897, 1.4300387263244119e-11, -7458876800955772e-34, 4.247418782257993e-26],
    [0.26221400499343872, 7.8022193150673047e-09, 5.0224310387675386e-16, -24063174816868367e-39],
    [0.25694090127944946, 2.9618050234603288e-08, 7.2795282036455453e-16, 2.638556081145549e-23],
    [0.25163990259170532, -6.44787778725231e-9, 4.1220281336935209e-16, 7.4275592961536977e-24],
    [0.24707368016242981, -1.9981829524340355e-9, -10909757890855787e-32, 6.2365520898082133e-24],
    [0.24171993136405945, 5.5230859885568862e-09, -2686547633696265e-31, -2764495989170092e-39],
    [0.23710808157920837, 1.0085374313462125e-08, -4775626813761317e-31, 2.3306205980323631e-23],
    [0.231700599193573, -1.3946383603524737e-8, 1.0970921279709183e-17, 3.229909378627549e-25],
    [0.22704219818115234, -6.451284839670279e-9, -42529947798112047e-32, -10260254677162862e-39],
    [0.2223619818687439, 1.4110645096820917e-08, 6.0255689818272543e-16, 1.9385180739531644e-23],
    [0.21765980124473572, -8.286782815503102e-9, 5.2323639195797807e-16, 5.0784435386540659e-23],
    [0.21214580535888672, -8.254218641923217e-9, 3.2555531333217742e-16, 1.5714300136341619e-23],
    [0.20739519596099854, -1.6149279691290985e-9, 2.1131592679643073e-17, 1.4275617427027514e-24],
    [0.20262190699577332, 8.5976399333276277e-09, -33804619056798137e-32, 2.5623235609364303e-24],
    [0.19782572984695435, 1.348296585490516e-08, -32024568730231384e-32, -25712252251631252e-39],
    [0.19300645589828491, 9.9568597811128257e-10, 9.0016745638446061e-17, -3754797654135173e-39],
    [0.18897256255149841, 4.2415360113068346e-09, 3.8086815297465933e-16, -21147402916208568e-39],
    [0.18411031365394592, 6.9310548411749551e-09, -34784858522920016e-32, 2.4665943434547742e-23],
    [0.17922431230545044, 5.0739235035734964e-09, 3.2221329189922637e-16, -10379009008973928e-39],
    [0.17431432008743286, 3.7943852504440656e-09, 3.1900668985871761e-16, 2.0292714723890484e-23],
    [0.17020416259765625, 3.4223344158590407e-09, -18846416901959178e-32, 1.1415315069779235e-23],
    [0.16524958610534668, -1.3210039284672348e-8, -23213954359040806e-32, 3.0430542132867571e-24],
    [0.16027030348777771, 6.0079221597675314e-09, -7521047737154288e-32, -12649106048711768e-41],
    [0.15610191226005554, -1.2301535790015805e-8, 3.0175617567361414e-16, -8633806506327147e-39],
    [0.15191605687141418, -1.4845571882915465e-8, -3265830289949929e-31, -15268151962784823e-39],
    [0.14686977863311768, -4.6748995785605985e-9, -4294291341758996e-31, 1.328295982896899e-23],
    [0.14264500141143799, 9.1864720275225409e-09, -8049373155998929e-31, 1.437998766909278e-23],
    [0.1384023129940033, 9.8651167235175308e-09, -8837306496940929e-31, 7.2953249091942152e-24],
    [0.1332872211933136, 9.9903507688736681e-10, 3.3169466107343579e-17, 2.7351440526086287e-24],
    [0.12900456786155701, -7.46120853989396e-9, -6212113165383437e-31, 1.8551872649897312e-24],
    [0.12470348179340363, -3.2924463155836747e-9, -7404120132741752e-32, 1.3246955625609024e-24],
    [0.12038381397724152, 3.3791991427278845e-09, 1.6214981996371606e-16, -600070673940474e-38],
    [0.11604541540145874, 3.5638392237302696e-10, -7354219635108878e-33, 7.794312440645008e-26],
    [0.11168810725212097, 3.1367659580894269e-09, -8994406293238225e-34, -7920937558182207e-41],
    [0.10731174051761627, -4.728527791542092e-9, -42976339455270984e-32, 5.3511432872581071e-24],
    [0.10291612148284912, 2.8332007850906393e-09, 4.9257427572340523e-17, 2.794436810397303e-24],
    [0.098501101136207581, 4.9707251648101192e-09, 4.1305127568470488e-16, 6.3134495605958654e-25],
    [0.094066515564918518, -6.525850970717784e-9, -13492816627243298e-32, -9079650179574527e-39],
    [0.08961215615272522, 2.5369617517867482e-09, 1.6110664594961319e-16, -5189504504486964e-39],
    [0.086034342646598816, -5.304795713811927e-9, 5.127575488441481e-17, 1.4636155456921331e-24],
    [0.081543982028961182, 2.0112156384755053e-09, 8.0657693315776084e-17, -30150319017810437e-40],
    [0.077033370733261108, 5.7495661565098999e-09, -2503851097302985e-31, -1846143093040508e-38],
    [0.07250232994556427, 1.177662634077592e-09, -3525476857925506e-32, 1.3164077898906505e-24],
    [0.068862661719322205, -7.043545302565235e-9, 2.4971240675150099e-16, 1.0686882487619963e-23],
    [0.064294353127479553, -2.422082090447475e-9, -20555896149129847e-32, 8.602907613530545e-24],
    [0.0606246218085289, 7.9059432611661151e-12, -8270443345471096e-34, -23533820836754142e-42],
    [0.056018441915512085, -5139745296034448e-25, -3811651571366802e-32, 1.9072195442219776e-24],
    [0.052318163216114044, -3.5574325707443677e-9, 9.1911558341453931e-17, -5321463973420977e-39],
    [0.04767347127199173, -1.8026349302147082e-9, 1.0329634289704177e-16, -22283569301283993e-40],
    [0.043942123651504517, -1.795005699634089e-9, -53817402974104447e-33, -13996196977941442e-40],
    [0.040196798741817474, 3.8451930528538014e-10, -24485452721520977e-33, -7386769024377949e-41],
    [0.0354953333735466, -35901653872016936e-26, -2073207767866976e-32, -2412097216555168e-41],
    [0.0317181795835495, 6.8723504664802704e-10, -6430478093749473e-33, 1.3508692031871337e-25],
    [0.027926705777645111, 7.5687733858131878e-10, -422031585165944e-31, 2.5347605636927818e-24],
    [0.02412080392241478, -1.1255707477175747e-9, 4.89700584100947e-17, 1.4172214525647275e-24],
    [0.019342962652444839, 1.9068610579431322e-10, -10635946218849709e-33, -5300489542457734e-40],
    [0.015504186972975731, -43701048335620385e-26, 6.6110615476371497e-18, 2.5398086818405174e-25],
    [0.011650616303086281, 9.1688900916153671e-10, -15848697818454755e-33, -1350491609984469e-39],
    [0.0077821407467126846, -3046577434773212e-25, 7.7934359967622851e-18, 4.6601001482083692e-25],
    [0.0038986406289041042, -21324678134426733e-26, 1.2541658163801307e-19, 8.7450354317401229e-27],
    [0, 0, 0, 0]
];
function addHighLow(d, yh, yl) {
    const d1 = Math.floor(d + 0.5);
    const d2 = d - d1;
    return { yh: yh + d1, yl: yl + d2 };
}
function binomialDeviance(x, M) {
    const Sb = 10;
    const S = 1 << Sb;
    const N = 128;
    let yh = 0, yl = 0;
    if (x === M) {
        return { yh: 0, yl: 0 };
    }
    if (x === 0) {
        return { yh: M, yl: 0 };
    }
    if (M === 0) {
        return { yh: Number.POSITIVE_INFINITY, yl: 0 };
    }
    if (M / x === Number.POSITIVE_INFINITY) {
        return { yh: M, yl: 0 };
    }
    let { mantissa: r, exponent: e } = frexp(M / x);
    if (Math.LN2 * -e > 1 + Number.MAX_VALUE / x) {
        return { yh: Number.POSITIVE_INFINITY, yl: 0 };
    }
    const i = Math.floor((r - 0.5) * (2 * N) + 0.5);
    const f = Math.floor(S / (0.5 + i / (2.0 * N)) + 0.5);
    const fg = ldexp(f, -(e + Sb));
    if (fg === Number.POSITIVE_INFINITY) {
        return { yh: Number.POSITIVE_INFINITY, yl: 0 };
    }
    ({ yh, yl } = addHighLow(-x * log1pmx((M * fg - x) / x), yh, yl));
    if (fg === 1) {
        return { yh: yh, yl: yl };
    }
    for (let j = 0; j < 4; j++) {
        ({ yh, yl } = addHighLow(x * bd0_scale[i][j], yh, yl));
        ({ yh, yl } = addHighLow(-x * bd0_scale[0][j] * e, yh, yl));
        if (!Number.isFinite(yh)) {
            return { yh: Number.POSITIVE_INFINITY, yl: 0 };
        }
    }
    ({ yh, yl } = addHighLow(M, yh, yl));
    ({ yh, yl } = addHighLow(-M * fg, yh, yl));
    return { yh: yh, yl: yl };
}

function poissonDensity(x, lambda, log_p) {
    const zeroBound = log_p ? Number.NEGATIVE_INFINITY : 0;
    if (lambda === 0) {
        return (x === 0) ? (log_p ? 0 : 1) : zeroBound;
    }
    if (!Number.isFinite(lambda) || x < 0) {
        return zeroBound;
    }
    if (x <= lambda * Number.MIN_VALUE) {
        return log_p ? -lambda : Math.exp(-lambda);
    }
    if (lambda < x * Number.MIN_VALUE) {
        if (!Number.isFinite(x)) {
            return zeroBound;
        }
        const rtn = -lambda + x * Math.log(lambda) - lgamma1p(x);
        return log_p ? rtn : Math.exp(rtn);
    }
    let { yh, yl } = binomialDeviance(x, lambda);
    yl += stirlingError(x);
    let Lrg_x = (x >= Number.MAX_VALUE);
    let r = Lrg_x ? SQRT_TWO_PI * Math.sqrt(x)
        : TWO_PI * x;
    return log_p ? -yl - yh - (Lrg_x ? Math.log(r) : 0.5 * Math.log(r))
        : Math.exp(-yl) * Math.exp(-yh) / (Lrg_x ? r : Math.sqrt(r));
}

function poissonDensityPrev(x_plus_1, lambda, log_p) {
    if (!Number.isFinite(lambda)) {
        return log_p ? Number.NEGATIVE_INFINITY : 0;
    }
    if (x_plus_1 > 1) {
        return poissonDensity(x_plus_1 - 1, lambda, log_p);
    }
    let rtn;
    const M_cutoff = 3.196577161300664E18;
    if (lambda > Math.abs(x_plus_1 - 1) * M_cutoff) {
        rtn = -lambda - lgamma(x_plus_1);
    }
    else {
        const d = poissonDensity(x_plus_1, lambda, true);
        rtn = d + Math.log(x_plus_1) - Math.log(lambda);
    }
    return log_p ? rtn : Math.exp(rtn);
}

function gammaContFrac(y, d) {
    if (y == 0) {
        return 0;
    }
    let f0 = y / d;
    if (Math.abs(y - 1) < Math.abs(d) * Number.EPSILON) {
        return f0;
    }
    if (f0 > 1) {
        f0 = 1;
    }
    let c3;
    let c2 = y;
    let c4 = d;
    let a1 = 0;
    let b1 = 1;
    let a2 = y;
    let b2 = d;
    const scalefactor = 1.157921e+77;
    while (b2 > scalefactor) {
        a1 /= scalefactor;
        b1 /= scalefactor;
        a2 /= scalefactor;
        b2 /= scalefactor;
    }
    let i = 0;
    let of = -1;
    let f = 0.0;
    while (i < 200000) {
        i++;
        c2--;
        c3 = i * c2;
        c4 += 2;
        a1 = c4 * a2 + c3 * a1;
        b1 = c4 * b2 + c3 * b1;
        i++;
        c2--;
        c3 = i * c2;
        c4 += 2;
        a2 = c4 * a1 + c3 * a2;
        b2 = c4 * b1 + c3 * b2;
        if (b2 > scalefactor) {
            a1 /= scalefactor;
            b1 /= scalefactor;
            a2 /= scalefactor;
            b2 /= scalefactor;
        }
        if (b2 !== 0) {
            f = a2 / b2;
            if (Math.abs(f - of) <= Number.EPSILON * Math.max(f0, Math.abs(f))) {
                return f;
            }
            of = f;
        }
    }
    return f;
}

function normalCDFImpl(x, lower_tail, log_p) {
    let i_tail = lower_tail ? 0 : 1;
    const a = [
        2.2352520354606839287,
        161.02823106855587881,
        1067.6894854603709582,
        18154.981253343561249,
        0.065682337918207449113
    ];
    const b = [
        47.20258190468824187,
        976.09855173777669322,
        10260.932208618978205,
        45507.789335026729956
    ];
    const c = [
        0.39894151208813466764,
        8.8831497943883759412,
        93.506656132177855979,
        597.27027639480026226,
        2494.5375852903726711,
        6848.1904505362823326,
        11602.651437647350124,
        9842.7148383839780218,
        1.0765576773720192317e-8
    ];
    const d = [
        22.266688044328115691,
        235.38790178262499861,
        1519.377599407554805,
        6485.558298266760755,
        18615.571640885098091,
        34900.952721145977266,
        38912.003286093271411,
        19685.429676859990727
    ];
    const p = [
        0.21589853405795699,
        0.1274011611602473639,
        0.022235277870649807,
        0.001421619193227893466,
        2.9112874951168792e-5,
        0.02307344176494017303
    ];
    const q = [
        1.28426009614491121,
        0.468238212480865118,
        0.0659881378689285515,
        0.00378239633202758244,
        7.29751555083966205e-5
    ];
    let xden, xnum, temp, del, eps, xsq, y;
    let i, lower, upper;
    if (Number.isNaN(x)) {
        return Number.NaN;
    }
    eps = Number.EPSILON * 0.5;
    lower = i_tail != 1;
    upper = i_tail != 0;
    let cum = 0;
    let ccum = 0;
    y = Math.abs(x);
    if (y <= 0.67448975) {
        if (y > eps) {
            xsq = x * x;
            xnum = a[4] * xsq;
            xden = xsq;
            for (i = 0; i < 3; ++i) {
                xnum = (xnum + a[i]) * xsq;
                xden = (xden + b[i]) * xsq;
            }
        }
        else {
            xnum = xden = 0.0;
        }
        temp = x * (xnum + a[3]) / (xden + b[3]);
        if (lower) {
            cum = 0.5 + temp;
        }
        if (upper) {
            ccum = 0.5 - temp;
        }
        if (log_p) {
            if (lower) {
                cum = Math.log(cum);
            }
            if (upper) {
                ccum = Math.log(ccum);
            }
        }
    }
    else if (y <= SQRT_THIRTY_TWO) {
        xnum = c[8] * y;
        xden = y;
        for (i = 0; i < 7; ++i) {
            xnum = (xnum + c[i]) * y;
            xden = (xden + d[i]) * y;
        }
        temp = (xnum + c[7]) / (xden + d[7]);
        xsq = ldexp(Math.trunc(ldexp(y, 4)), -4);
        del = (y - xsq) * (y + xsq);
        if (log_p) {
            cum = (-xsq * ldexp(xsq, -1)) - ldexp(del, -1) + Math.log(temp);
            if ((lower && x > 0.) || (upper && x <= 0.)) {
                ccum = Math.log1p(-Math.exp(-xsq * ldexp(xsq, -1)) * Math.exp(-ldexp(del, -1)) * temp);
            }
        }
        else {
            cum = Math.exp(-xsq * ldexp(xsq, -1)) * Math.exp(-ldexp(del, -1)) * temp;
            ccum = 1.0 - cum;
        }
        if (x > 0.) {
            temp = cum;
            if (lower) {
                cum = ccum;
            }
            ccum = temp;
        }
    }
    else if ((log_p && y < 1e170) || (lower && -38.4674 < x && x < 8.2924) || (upper && -8.2924 < x && x < 38.4674)) {
        xsq = 1.0 / (x * x);
        xnum = p[5] * xsq;
        xden = xsq;
        for (i = 0; i < 4; ++i) {
            xnum = (xnum + p[i]) * xsq;
            xden = (xden + q[i]) * xsq;
        }
        temp = xsq * (xnum + p[4]) / (xden + q[4]);
        temp = (ONE_DIV_SQRT_TWO_PI - temp) / y;
        xsq = ldexp(Math.trunc(ldexp(x, 4)), -4);
        del = (x - xsq) * (x + xsq);
        if (log_p) {
            cum = (-xsq * ldexp(xsq, -1)) - ldexp(del, -1) + Math.log(temp);
            if ((lower && x > 0) || (upper && x <= 0)) {
                ccum = Math.log1p(-Math.exp(-xsq * ldexp(xsq, -1)) * Math.exp(-ldexp(del, -1)) * temp);
            }
        }
        else {
            cum = Math.exp(-xsq * ldexp(xsq, -1)) * Math.exp(-ldexp(del, -1)) * temp;
            ccum = 1.0 - cum;
        }
        if (x > 0) {
            temp = cum;
            if (lower) {
                cum = ccum;
            }
            ccum = temp;
        }
    }
    else {
        if (x > 0) {
            cum = (log_p ? 0 : 1);
            ccum = (log_p ? Number.NEGATIVE_INFINITY : 0);
        }
        else {
            cum = (log_p ? Number.NEGATIVE_INFINITY : 0);
            ccum = (log_p ? 0 : 1);
        }
    }
    return lower_tail ? cum : ccum;
}

function normalCDF(x, mu, sigma, lower_tail = true, log_p = false) {
    if (Number.isNaN(x) || Number.isNaN(mu) || Number.isNaN(sigma)) {
        return x + mu + sigma;
    }
    if (!Number.isFinite(x) && mu == x) {
        return Number.NaN;
    }
    const zeroBoundLower = (lower_tail ? (log_p ? Number.NEGATIVE_INFINITY : 0) : (log_p ? 0 : 1));
    const zeroBoundUpper = (lower_tail ? (log_p ? 0 : 1) : (log_p ? Number.NEGATIVE_INFINITY : 0));
    let p = (x - mu) / sigma;
    if (!Number.isFinite(p)) {
        return (x < mu) ? zeroBoundLower : zeroBoundUpper;
    }
    return normalCDFImpl(p, lower_tail, log_p);
}

function normalDensity(x, mu, sigma, log_p = false) {
    if (Number.isNaN(x) || Number.isNaN(mu) || Number.isNaN(sigma)) {
        return x + mu + sigma;
    }
    const zeroBound = log_p ? Number.NEGATIVE_INFINITY : 0;
    if (!Number.isFinite(sigma)) {
        return zeroBound;
    }
    if (!Number.isFinite(x) && mu == x) {
        return Number.NaN;
    }
    const z = (x - mu) / sigma;
    if (!Number.isFinite(z)) {
        return zeroBound;
    }
    const absZ = Math.abs(z);
    if (absZ >= 2 * Math.sqrt(Number.MAX_VALUE)) {
        return zeroBound;
    }
    if (log_p) {
        return -(LOG_SQRT_TWO_PI + 0.5 * absZ * absZ + Math.log(sigma));
    }
    if (absZ < 5) {
        return ONE_DIV_SQRT_TWO_PI * Math.exp(-0.5 * absZ * absZ) / sigma;
    }
    if (absZ > 38.56804181549334) {
        return 0;
    }
    let x1 = ldexp(Math.trunc(ldexp(absZ, 16)), -16);
    let x2 = absZ - x1;
    return ONE_DIV_SQRT_TWO_PI / sigma
        * (Math.exp(-0.5 * x1 * x1) * Math.exp((-0.5 * x2 - x1) * x2));
}

function poissonCDFAsymp(x, lambda, lower_tail, log_p) {
    const coefs_a = [
        -1e99,
        2 / 3.,
        -4 / 135.,
        8 / 2835.,
        16 / 8505.,
        -8992 / 12629925.,
        -334144 / 492567075.,
        698752 / 1477701225.
    ];
    const coefs_b = [
        -1e99,
        1 / 12.,
        1 / 288.,
        -139 / 51840.,
        -571 / 2488320.,
        163879 / 209018880.,
        5246819 / 75246796800.,
        -534703531 / 902961561600.
    ];
    let elfb, elfb_term;
    let res12, res1_term, res1_ig, res2_term, res2_ig;
    let dfm, pt_, s2pt, f, np;
    let i;
    dfm = lambda - x;
    pt_ = -log1pmx(dfm / x);
    s2pt = Math.sqrt(2 * x * pt_);
    if (dfm < 0) {
        s2pt = -s2pt;
    }
    res12 = 0;
    res1_ig = res1_term = Math.sqrt(x);
    res2_ig = res2_term = s2pt;
    for (i = 1; i < 8; i++) {
        res12 += res1_ig * coefs_a[i];
        res12 += res2_ig * coefs_b[i];
        res1_term *= pt_ / i;
        res2_term *= 2 * pt_ / (2 * i + 1);
        res1_ig = res1_ig / x + res1_term;
        res2_ig = res2_ig / x + res2_term;
    }
    elfb = x;
    elfb_term = 1;
    for (i = 1; i < 8; i++) {
        elfb += elfb_term * coefs_b[i];
        elfb_term /= x;
    }
    if (!lower_tail) {
        elfb = -elfb;
    }
    f = res12 / elfb;
    np = normalCDF(s2pt, 0, 1, !lower_tail, log_p);
    if (log_p) {
        let i_tail = !lower_tail;
        let n_d_over_p;
        if (s2pt < 0) {
            s2pt = -s2pt;
            i_tail = !i_tail;
        }
        if (s2pt > 10 && !i_tail) {
            let term = 1 / s2pt;
            let sum = term;
            let x2 = s2pt * s2pt;
            let i = 1;
            while (Math.abs(term) > Number.EPSILON * sum) {
                term *= -i / x2;
                sum += term;
                i += 2;
            }
            n_d_over_p = 1 / sum;
        }
        else {
            let d = normalDensity(s2pt, 0, 1, false);
            n_d_over_p = d / Math.exp(np);
        }
        return np + Math.log1p(f * n_d_over_p);
    }
    else {
        return np + f * normalDensity(s2pt, 0, 1, log_p);
    }
}

function log1mExp(x) {
    return (x > -Math.LN2) ? Math.log(-Math.expm1(x)) : Math.log1p(-Math.exp(x));
}

function gammaCDFImpl(x, alph, lower_tail = true, log_p = false) {
    let res;
    const zeroBoundLower = log_p ? Number.NEGATIVE_INFINITY : 0;
    const zeroBoundUpper = log_p ? 0 : 1;
    if (x <= 0) {
        return lower_tail ? zeroBoundLower : zeroBoundUpper;
    }
    if (x >= Number.POSITIVE_INFINITY) {
        return lower_tail ? zeroBoundUpper : zeroBoundLower;
    }
    if (x < 1) {
        let sum = 0, c = alph, n = 0, term = 1;
        while (Math.abs(term) > Number.EPSILON * Math.abs(sum)) {
            n++;
            c *= -x / n;
            term = c / (alph + n);
            sum += term;
        }
        if (lower_tail) {
            const f1 = log_p ? Math.log1p(sum) : 1 + sum;
            let f2;
            if (alph > 1) {
                f2 = poissonDensity(alph, x, log_p);
                f2 = log_p ? f2 + x : f2 * Math.exp(x);
            }
            else if (log_p) {
                f2 = alph * Math.log(x) - lgamma1p(alph);
            }
            else {
                f2 = Math.pow(x, alph) / Math.exp(lgamma1p(alph));
            }
            res = log_p ? f1 + f2 : f1 * f2;
        }
        else {
            const lf2 = alph * Math.log(x) - lgamma1p(alph);
            if (log_p) {
                res = log1mExp(Math.log1p(sum) + lf2);
            }
            else {
                let f1m1 = sum;
                let f2m1 = Math.expm1(lf2);
                res = -(f1m1 + f2m1 + f1m1 * f2m1);
            }
        }
    }
    else if (x <= alph - 1 && x < 0.8 * (alph + 50)) {
        let y = alph;
        let term = x / y;
        let sum = term;
        while (term > Number.EPSILON * sum) {
            y++;
            term *= x / y;
            sum += term;
        }
        sum = log_p ? Math.log(sum) : sum;
        const d = poissonDensityPrev(alph, x, log_p);
        if (!lower_tail) {
            res = log_p ? log1mExp(d + sum) : 1 - d * sum;
        }
        else {
            res = log_p ? sum + d : sum * d;
        }
    }
    else if (alph - 1 < x && alph < 0.8 * (x + 50)) {
        let sum = 0;
        const d = poissonDensityPrev(alph, x, log_p);
        if (alph < 1) {
            if (x * Number.EPSILON > 1 - alph) {
                sum = log_p ? 0 : 1;
            }
            else {
                const f = gammaContFrac(alph, x - (alph - 1)) * x / alph;
                sum = log_p ? Math.log(f) : f;
            }
        }
        else {
            let term = 1;
            let y = alph - 1;
            while (y >= 1 && term > sum * Number.EPSILON) {
                term *= y / x;
                sum += term;
                y--;
            }
            if (y != Math.floor(y)) {
                sum += term * gammaContFrac(y, x + 1 - y);
            }
            sum = log_p ? Math.log1p(sum) : 1 + sum;
        }
        if (!lower_tail) {
            res = log_p ? sum + d : sum * d;
        }
        else {
            res = log_p ? log1mExp(d + sum) : 1 - d * sum;
        }
    }
    else {
        res = poissonCDFAsymp(alph - 1, x, !lower_tail, log_p);
    }
    if (!log_p && res < Number.MIN_VALUE / Number.EPSILON) {
        return Math.exp(gammaCDFImpl(x, alph, lower_tail, true));
    }
    return res;
}

function gammaCDF(x, alpha, scale, lower_tail = true, log_p = false) {
    if (Number.isNaN(x) || Number.isNaN(alpha) || Number.isNaN(scale)) {
        return x + alpha + scale;
    }
    if (alpha < 0 || scale <= 0) {
        return Number.NaN;
    }
    x /= scale;
    if (Number.isNaN(x)) {
        return x;
    }
    if (alpha === 0) {
        const zeroBoundLower = log_p ? Number.NEGATIVE_INFINITY : 0;
        const zeroBoundUpper = log_p ? 0 : 1;
        return (x <= 0) ? (lower_tail ? zeroBoundLower : zeroBoundUpper)
            : (lower_tail ? zeroBoundUpper : zeroBoundLower);
    }
    return gammaCDFImpl(x, alpha, lower_tail, log_p);
}

function chisqCDF(x, df, lower_tail = true, log_p = false) {
    return gammaCDF(x, 0.5 * df, 2.0, lower_tail, log_p);
}

function gammaDensity(x, shape, scale, log_p) {
    if (Number.isNaN(x) || Number.isNaN(shape) || Number.isNaN(scale)) {
        return x + shape + scale;
    }
    if (shape < 0 || scale <= 0) {
        return Number.NaN;
    }
    const zeroBound = log_p ? Number.NEGATIVE_INFINITY : 0;
    if (x < 0) {
        return zeroBound;
    }
    if (shape === 0) {
        return (x === 0) ? Number.POSITIVE_INFINITY : zeroBound;
    }
    if (x === 0) {
        if (shape < 1) {
            return Number.POSITIVE_INFINITY;
        }
        if (shape > 1) {
            return zeroBound;
        }
        return log_p ? -Math.log(scale) : 1 / scale;
    }
    let pr;
    if (shape < 1) {
        pr = poissonDensity(shape, x / scale, log_p);
        if (log_p) {
            const shapeDivX = shape / x;
            const offset = Number.isFinite(shapeDivX)
                ? Math.log(shapeDivX)
                : Math.log(shape) - Math.log(x);
            return pr + offset;
        }
        else {
            return pr * shape / x;
        }
    }
    pr = poissonDensity(shape - 1, x / scale, log_p);
    return log_p ? pr - Math.log(scale) : pr / scale;
}

function gammaNewtonIter(ch, p, alpha, scale, lower_tail, log_p, max_it_Newton, EPS_N) {
    let x = 0.5 * scale * ch;
    if (max_it_Newton === 0) {
        return x;
    }
    if (!log_p) {
        p = Math.log(p);
        log_p = true;
    }
    let p_;
    if (x === 0) {
        const _1_p = 1. + 1e-7;
        const _1_m = 1. - 1e-7;
        x = Number.MIN_VALUE;
        p_ = gammaCDF(x, alpha, scale, lower_tail, log_p);
        if ((lower_tail && p_ > p * _1_p) || (!lower_tail && p_ < p * _1_m)) {
            return 0;
        }
    }
    else {
        p_ = gammaCDF(x, alpha, scale, lower_tail, log_p);
    }
    if (p_ === Number.NEGATIVE_INFINITY) {
        return 0;
    }
    const zeroBound = log_p ? Number.NEGATIVE_INFINITY : 0;
    for (let i = 1; i <= max_it_Newton; i++) {
        const p1 = p_ - p;
        if (Math.abs(p1) < Math.abs(EPS_N * p)) {
            break;
        }
        const g = gammaDensity(x, alpha, scale, log_p);
        if (g === zeroBound) {
            break;
        }
        let t = log_p ? p1 * Math.exp(p_ - g) : p1 / g;
        t = lower_tail ? x - t : x + t;
        p_ = gammaCDF(t, alpha, scale, lower_tail, log_p);
        const absDiff = Math.abs(p_ - p);
        const absP1 = Math.abs(p1);
        if (absDiff > absP1 || (i > 1 && absDiff === absP1)) {
            break;
        }
        x = t;
    }
    return x;
}

function polyEval(x, q, num_coeffs, den_coeffs) {
    let numerator = num_coeffs[0];
    let denominator = den_coeffs[0];
    for (let i = 1; i < num_coeffs.length; i++) {
        numerator = numerator * x + num_coeffs[i];
        denominator = denominator * x + den_coeffs[i];
    }
    return q * numerator / denominator;
}
function normalQuantile(p, mu, sigma, lower_tail, log_p) {
    let p_, q, r, val;
    if (Number.isNaN(p) || Number.isNaN(mu) || Number.isNaN(sigma)) {
        return p + mu + sigma;
    }
    if (log_p) {
        if (p > 0) {
            return Number.NaN;
        }
        if (p == 0) {
            return lower_tail ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
        }
        if (p == Number.NEGATIVE_INFINITY) {
            return lower_tail ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
        }
    }
    else {
        if (p < 0 || p > 1) {
            return Number.NaN;
        }
        if (p == 0) {
            return lower_tail ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
        }
        if (p == 1) {
            return lower_tail ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        }
    }
    p_ = log_p ? (lower_tail ? Math.exp(p) : -Math.expm1(p))
        : (lower_tail ? p : (0.5 - p + 0.5));
    q = p_ - 0.5;
    const coeffs_a = [
        2509.0809287301226727,
        33430.575583588128105,
        67265.770927008700853,
        45921.953931549871457,
        13731.693765509461125,
        1971.5909503065514427,
        133.14166789178437745,
        3.387132872796366608
    ];
    const coeffs_b = [
        5226.495278852854561,
        28729.085735721942674,
        39307.89580009271061,
        21213.794301586595867,
        5394.1960214247511077,
        687.1870074920579083,
        42.313330701600911252,
        1
    ];
    const coeffs_c = [
        7.7454501427834140764e-4,
        0.0227238449892691845833,
        0.24178072517745061177,
        1.27045825245236838258,
        3.64784832476320460504,
        5.7694972214606914055,
        4.6303378461565452959,
        1.42343711074968357734
    ];
    const coeffs_d = [
        1.05075007164441684324e-9,
        5.475938084995344946e-4,
        0.0151986665636164571966,
        0.14810397642748007459,
        0.68976733498510000455,
        1.6763848301838038494,
        2.05319162663775882187,
        1
    ];
    const coeffs_e = [
        2.01033439929228813265e-7,
        2.71155556874348757815e-5,
        0.0012426609473880784386,
        0.026532189526576123093,
        0.29656057182850489123,
        1.7848265399172913358,
        5.4637849111641143699,
        6.6579046435011037772
    ];
    const coeffs_f = [
        2.04426310338993978564e-15,
        1.4215117583164458887e-7,
        1.8463183175100546818e-5,
        7.868691311456132591e-4,
        0.0148753612908506148525,
        0.13692988092273580531,
        0.59983220655588793769,
        1
    ];
    if (Math.abs(q) <= 0.425) {
        r = 0.180625 - q * q;
        val = polyEval(r, q, coeffs_a, coeffs_b);
    }
    else {
        let lp;
        if (log_p && ((lower_tail && q <= 0) || (!lower_tail && q > 0))) {
            lp = p;
        }
        else {
            if (q > 0) {
                lp = log_p ? (lower_tail ? -Math.expm1(p) : Math.exp(p))
                    : (lower_tail ? (0.5 - p + 0.5) : p);
            }
            else {
                lp = p_;
            }
            lp = Math.log(lp);
        }
        r = Math.sqrt(-lp);
        if (r <= 5) {
            val = polyEval(r - 1.6, 1, coeffs_c, coeffs_d);
        }
        else if (r <= 27) {
            val = polyEval(r - 5, 1, coeffs_e, coeffs_f);
        }
        else {
            if (r >= 6.4e8) {
                val = r * Math.SQRT2;
            }
            else {
                const s2 = -ldexp(lp, 1);
                let x2 = s2 - (Math.log(s2) + LOG_TWO_PI);
                if (r < 36000) {
                    x2 = s2 - (LOG_TWO_PI + Math.log(x2)) - 2 / (2 + x2);
                    if (r < 840) {
                        x2 = s2 - (LOG_TWO_PI + Math.log(x2))
                            + 2 * Math.log1p(-(1 - 1 / (4 + x2)) / (2 + x2));
                        if (r < 109) {
                            x2 = s2 - (LOG_TWO_PI + Math.log(x2))
                                + 2 * Math.log1p(-(1 - (1 - 5 / (6 + x2)) / (4 + x2)) / (2 + x2));
                            if (r < 55) {
                                x2 = s2 - (LOG_TWO_PI + Math.log(x2))
                                    + 2 * Math.log1p(-(1 - (1 - (5 - 9 / (8 + x2)) / (6 + x2)) / (4 + x2)) / (2 + x2));
                            }
                        }
                    }
                }
                val = Math.sqrt(x2);
            }
        }
        if (q < 0.0) {
            val = -val;
        }
    }
    return mu + sigma * val;
}

function logP(p, lower_tail, log_p) {
    if (lower_tail) {
        return log_p ? p : Math.log(p);
    }
    return log_p ? log1mExp(p) : Math.log1p(-p);
}

function chisqQuantileApprox(p, nu, g, lower_tail = true, log_p = false, tol) {
    if (Number.isNaN(p) || Number.isNaN(nu)) {
        return p + nu;
    }
    if ((log_p && p > 0) || (!log_p && (p < 0 || p > 1)) || nu <= 0) {
        return Number.NaN;
    }
    const alpha = 0.5 * nu;
    let p1 = logP(p, lower_tail, log_p);
    if (nu < -1.24 * p1) {
        const lgam1pa = (alpha < 0.5) ? lgamma1p(alpha)
            : ((Math.log(nu) - Math.LN2) + g);
        return Math.exp((lgam1pa + p1) / alpha + Math.LN2);
    }
    const c = alpha - 1;
    if (nu > 0.32) {
        const x = normalQuantile(p, 0, 1, lower_tail, log_p);
        p1 = 2 / (9 * nu);
        const ch = nu * Math.pow(x * Math.sqrt(p1) + 1 - p1, 3);
        return (ch > 2.2 * nu + 6)
            ? -2 * (logP(p, !lower_tail, log_p) - c * (Math.log(ch) - Math.LN2) + g)
            : ch;
    }
    const C7 = 4.67;
    const C8 = 6.66;
    const C9 = 6.73;
    const C10 = 13.32;
    let ch = 0.4;
    let p2 = 0;
    let q = 0;
    let t = 0;
    const a = logP(p, !lower_tail, log_p) + g + c * Math.LN2;
    while (Math.abs(q - ch) > tol * Math.abs(ch)) {
        q = ch;
        p1 = 1 / (1 + ch * (C7 + ch));
        p2 = ch * (C9 + ch * (C8 + ch));
        t = -0.5 + (C7 + 2 * ch) * p1 - (C9 + ch * (C10 + 3 * ch)) / p2;
        ch -= (1 - Math.exp(a + 0.5 * ch) * p2 * p1) / t;
    }
    return ch;
}

function gammaQuantile(p, alpha, scale, lower_tail = true, log_p = false) {
    if (Number.isNaN(p) || Number.isNaN(alpha) || Number.isNaN(scale)) {
        return p + alpha + scale;
    }
    if (log_p) {
        if (p > 0) {
            return Number.NaN;
        }
        if (p === 0) {
            return lower_tail ? Number.POSITIVE_INFINITY : 0;
        }
        if (p === Number.NEGATIVE_INFINITY) {
            return lower_tail ? 0 : Number.POSITIVE_INFINITY;
        }
    }
    else {
        if (p < 0 || p > 1) {
            return Number.NaN;
        }
        if (p === 0) {
            return lower_tail ? 0 : Number.POSITIVE_INFINITY;
        }
        if (p === 1) {
            return lower_tail ? Number.POSITIVE_INFINITY : 0;
        }
    }
    if (alpha < 0 || scale <= 0) {
        return Number.NaN;
    }
    if (alpha === 0) {
        return 0;
    }
    let max_it_Newton = 1;
    if (alpha < 1e-10) {
        max_it_Newton = 7;
    }
    const g = lgamma(alpha);
    let ch = chisqQuantileApprox(p, 2 * alpha, g, lower_tail, log_p, 1e-2);
    if (!Number.isFinite(ch)) {
        return gammaNewtonIter(ch, p, alpha, scale, lower_tail, log_p, 0, 1e-15);
    }
    const p_ = log_p ? (lower_tail ? Math.exp(p) : -Math.expm1(p))
        : (lower_tail ? p : (0.5 - p + 0.5));
    if (ch < 5e-7 || p_ > (1 - 1e-14) || p_ < 1e-100) {
        return gammaNewtonIter(ch, p, alpha, scale, lower_tail, log_p, 20, 1e-15);
    }
    const i420 = 1 / 420;
    const i2520 = 1 / 2520;
    const i5040 = 1 / 5040;
    const c = alpha - 1;
    const s6 = (120 + c * (346 + 127 * c)) * i5040;
    const ch0 = ch;
    for (let i = 1; i <= 1000; i++) {
        const q = ch;
        const p1 = 0.5 * ch;
        const p2 = p_ - gammaCDFImpl(p1, alpha);
        if (!Number.isFinite(p2) || ch <= 0) {
            return gammaNewtonIter(ch0, p, alpha, scale, lower_tail, log_p, 27, 1e-15);
        }
        const t = p2 * Math.exp(alpha * Math.LN2 + g + p1 - c * Math.log(ch));
        const b = t / ch;
        const a = 0.5 * t - b * c;
        const s1 = (210 + a * (140 + a * (105 + a * (84 + a * (70 + 60 * a))))) * i420;
        const s2 = (420 + a * (735 + a * (966 + a * (1141 + 1278 * a)))) * i2520;
        const s3 = (210 + a * (462 + a * (707 + 932 * a))) * i2520;
        const s4 = (252 + a * (672 + 1182 * a) + c * (294 + a * (889 + 1740 * a))) * i5040;
        const s5 = (84 + 2264 * a + c * (1175 + 606 * a)) * i2520;
        ch += t * (1 + 0.5 * t * s1 - b * c * (s1 - b * (s2 - b * (s3 - b * (s4 - b * (s5 - b * s6))))));
        if (Math.abs(q - ch) < (5e-7) * ch) {
            return gammaNewtonIter(ch, p, alpha, scale, lower_tail, log_p, max_it_Newton, 1e-15);
        }
        if (Math.abs(q - ch) > 0.1 * ch) {
            ch = q * (ch < q ? 0.9 : 1.1);
        }
    }
    return gammaNewtonIter(ch, p, alpha, scale, lower_tail, log_p, max_it_Newton, 1e-15);
}

function chisqQuantile(p, df, lower_tail = true, log_p = false) {
    return gammaQuantile(p, 0.5 * df, 2.0, lower_tail, log_p);
}

const smrSE = function (inputData) {
    return [];
};
const smrSEOD = function (inputData) {
    const denominators = inputData.denominators;
    return inv(multiply(2, sqrt(denominators)));
};
const smrTarget = function (inputData) {
    return 1;
};
const smrY = function (inputData) {
    const numerators = inputData.numerators;
    const denominators = inputData.denominators;
    return sqrt(divide(numerators, denominators));
};
const smrZ = function (inputData, zScores, seOD, odAdjust, tau2) {
    if (odAdjust) {
        const n = zScores.length;
        let rtn = new Array(n);
        for (let i = 0; i < n; i++) {
            rtn[i] = (zScores[i] * seOD[i]) / Math.sqrt(Math.pow(seOD[i], 2) + tau2);
        }
        return rtn;
    }
    else {
        const numerators = inputData.numerators;
        const denominators = inputData.denominators;
        const n = numerators.length;
        let rtn = new Array(n);
        for (let i = 0; i < n; i++) {
            const ratio = numerators[i] / denominators[i];
            const offset = ratio > 1 ? 1 : 0;
            const log_p = chisqCDF(ratio * 2 * denominators[i], 2 * (denominators[i] + offset), true, true);
            rtn[i] = normalQuantile(log_p, 0, 1, true, true);
        }
        return rtn;
    }
};
const smrLimitOD = function (args) {
    const target = args.target_transformed;
    const q = args.q;
    const SE = args.SE;
    const tau2 = args.tau2;
    const limit_transformed = target + q * sqrt(square(SE) + tau2);
    const limit = square(limit_transformed);
    return winsorise(limit, { lower: 0 });
};
const smrLimit = function (args) {
    const denominators = args.denominators;
    const p = args.p;
    const is_upper = p > 0.5;
    const offset = is_upper ? 1 : 0;
    const limit = (chisqQuantile(p, 2 * (denominators + offset)) / 2.0)
        / denominators;
    return winsorise(limit, { lower: 0 });
};
class smrFunnelClass extends chartClass {
    constructor(inputData, inputSettings) {
        super({
            seFunction: smrSE,
            seFunctionOD: smrSEOD,
            targetFunction: smrTarget,
            targetFunctionTransformed: smrTarget,
            yFunction: smrY,
            zFunction: smrZ,
            limitFunction: smrLimit,
            limitFunctionOD: smrLimitOD,
            inputData: inputData,
            inputSettings: inputSettings
        });
    }
}

const prSE = function (inputData) {
    const denominators = inputData.denominators;
    return inv(multiply(2, sqrt(denominators)));
};
const prTarget = function (inputData) {
    const numerators = inputData.numerators;
    const denominators = inputData.denominators;
    return sum(numerators) / sum(denominators);
};
const prTargetTransformed = function (inputData) {
    return Math.asin(Math.sqrt(prTarget(inputData)));
};
const prY = function (inputData) {
    const numerators = inputData.numerators;
    const denominators = inputData.denominators;
    return asin(sqrt(divide(numerators, denominators)));
};
const prZ = function (inputData, zScores, seOD, odAdjust, tau2) {
    if (odAdjust) {
        const n = zScores.length;
        let rtn = new Array(n);
        for (let i = 0; i < n; i++) {
            rtn[i] = (zScores[i] * seOD[i]) / Math.sqrt(Math.pow(seOD[i], 2) + tau2);
        }
        return rtn;
    }
    else {
        return zScores;
    }
};
const prLimit = function (args) {
    const target = args.target_transformed;
    const q = args.q;
    const SE = args.SE;
    const tau2 = args.tau2;
    const limit_transformed = target + q * sqrt(square(SE) + tau2);
    const limit = square(Math.sin(limit_transformed));
    return winsorise(limit, { lower: 0, upper: 1 });
};
class prFunnelClass extends chartClass {
    constructor(inputData, inputSettings) {
        super({
            seFunction: prSE,
            seFunctionOD: prSE,
            targetFunction: prTarget,
            targetFunctionTransformed: prTargetTransformed,
            yFunction: prY,
            zFunction: prZ,
            limitFunction: prLimit,
            limitFunctionOD: prLimit,
            inputData: inputData,
            inputSettings: inputSettings
        });
    }
}

const rcSE = function (inputData) {
    const numerators = inputData.numerators ? inputData.numerators : inputData.denominators;
    const denominators = inputData.denominators;
    return sqrt(add(divide(numerators, square(add(numerators, 0.5))), divide(denominators, square(add(denominators, 0.5)))));
};
const rcTarget = function (inputData) {
    const numerators = inputData.numerators;
    const denominators = inputData.denominators;
    return sum(numerators) / sum(denominators);
};
const rcTargetTransformed = function (inputData) {
    const numerators = inputData.numerators;
    const denominators = inputData.denominators;
    return log(sum(numerators)) - log(sum(denominators));
};
const rcY = function (inputData) {
    const numerators = inputData.numerators;
    const denominators = inputData.denominators;
    return log(divide(add(numerators, 0.5), add(denominators, 0.5)));
};
const rcZ = function (inputData, zScores, seOD, odAdjust, tau2) {
    if (odAdjust) {
        const n = zScores.length;
        let rtn = new Array(n);
        for (let i = 0; i < n; i++) {
            rtn[i] = (zScores[i] * seOD[i]) / Math.sqrt(Math.pow(seOD[i], 2) + tau2);
        }
        return rtn;
    }
    else {
        return zScores;
    }
};
const rcLimit = function (args) {
    const target = args.target_transformed;
    const q = args.q;
    const SE = args.SE;
    const tau2 = args.tau2;
    const limit_transformed = target + q * sqrt(square(SE) + tau2);
    const limit = exp(limit_transformed);
    return winsorise(limit, { lower: 0 });
};
class rcFunnelClass extends chartClass {
    constructor(inputData, inputSettings) {
        super({
            seFunction: rcSE,
            seFunctionOD: rcSE,
            targetFunction: rcTarget,
            targetFunctionTransformed: rcTargetTransformed,
            yFunction: rcY,
            zFunction: rcZ,
            limitFunction: rcLimit,
            limitFunctionOD: rcLimit,
            inputData: inputData,
            inputSettings: inputSettings
        });
    }
}

var chartObjects = /*#__PURE__*/Object.freeze({
    __proto__: null,
    PR: prFunnelClass,
    RC: rcFunnelClass,
    SR: smrFunnelClass
});

function two_sigma(value, limits) {
    if ((limits.ll95 !== null) && (value < limits.ll95)) {
        return "lower";
    }
    else if ((limits.ul95 !== null) && (value > limits.ul95)) {
        return "upper";
    }
    else {
        return "none";
    }
}

function three_sigma(value, limits) {
    if ((limits.ll99 !== null) && (value < limits.ll99)) {
        return "lower";
    }
    else if ((limits.ul99 !== null) && (value > limits.ul99)) {
        return "upper";
    }
    else {
        return "none";
    }
}

class viewModelClass {
    constructor() {
        this.inputData = null;
        this.inputSettings = new settingsClass();
        this.chartBase = null;
        this.calculatedLimits = null;
        this.plotPoints = new Array();
        this.groupedLines = new Array();
        this.firstRun = true;
        this.colourPalette = null;
        this.headless = false;
    }
    update(options, host) {
        const res = { status: true };
        if (options.type === 2 || this.firstRun) {
            this.inputSettings.update(options.dataViews[0]);
        }
        if (this.inputSettings.validationStatus.error !== "") {
            res.status = false;
            res.error = this.inputSettings.validationStatus.error;
            res.type = "settings";
            return res;
        }
        const checkDV = validateDataView(options.dataViews);
        if (checkDV !== "valid") {
            res.status = false;
            res.error = checkDV;
            return res;
        }
        if (isNullOrUndefined(this.colourPalette)) {
            this.colourPalette = {
                isHighContrast: host.colorPalette.isHighContrast,
                foregroundColour: host.colorPalette.foreground.value,
                backgroundColour: host.colorPalette.background.value,
                foregroundSelectedColour: host.colorPalette.foregroundSelected.value,
                hyperlinkColour: host.colorPalette.hyperlink.value
            };
        }
        this.svgWidth = options.viewport.width;
        this.svgHeight = options.viewport.height;
        this.headless = options?.["headless"] ?? false;
        if (options.type === 2 || this.firstRun) {
            const chart_type = this.inputSettings.settings.funnel.chart_type;
            this.inputData = extractInputData(options.dataViews[0].categorical, this.inputSettings);
            if (this.inputData.validationStatus.status === 0) {
                this.chartBase = new chartObjects[chart_type](this.inputData, this.inputSettings);
                this.calculatedLimits = this.chartBase.getLimits();
                this.scaleAndTruncateLimits();
                this.initialisePlotData(host);
                this.initialiseGroupedLines();
            }
        }
        this.firstRun = false;
        if (this.inputData.validationStatus.status !== 0) {
            res.status = false;
            res.error = this.inputData.validationStatus.error;
            return res;
        }
        if (this.inputData.warningMessage !== "") {
            res.warning = this.inputData.warningMessage;
        }
        return res;
    }
    initialisePlotData(host) {
        this.plotPoints = new Array();
        const transform_text = this.inputSettings.settings.funnel.transformation;
        const transform = getTransformation(transform_text);
        const multiplier = this.inputSettings.derivedSettings.multiplier;
        const flag_two_sigma = this.inputSettings.settings.outliers.two_sigma;
        const flag_three_sigma = this.inputSettings.settings.outliers.three_sigma;
        const zScores = this.chartBase.getZ();
        for (let i = 0; i < this.inputData.id.length; i++) {
            const original_index = this.inputData.id[i];
            const numerator = this.inputData.numerators[i];
            const denominator = this.inputData.denominators[i];
            const value = transform((numerator / denominator) * multiplier);
            const limits = this.calculatedLimits.filter(d => d.denominators === denominator && d.ll99 !== null && d.ul99 !== null)[0];
            const aesthetics = this.inputData.scatter_formatting[i];
            if (this.colourPalette.isHighContrast) {
                aesthetics.colour = this.colourPalette.foregroundColour;
            }
            const flagSettings = {
                process_flag_type: this.inputSettings.settings.outliers.process_flag_type,
                improvement_direction: this.inputSettings.settings.outliers.improvement_direction
            };
            const two_sigma_outlier = checkFlagDirection(flag_two_sigma ? two_sigma(value, limits) : "none", flagSettings);
            const three_sigma_outlier = checkFlagDirection(flag_three_sigma ? three_sigma(value, limits) : "none", flagSettings);
            const category = (typeof this.inputData.categories.values[original_index] === "number") ?
                (this.inputData.categories.values[original_index]).toString() :
                (this.inputData.categories.values[original_index]);
            if (two_sigma_outlier !== "none") {
                aesthetics.colour = this.inputSettings.settings.outliers["two_sigma_colour_" + two_sigma_outlier];
                aesthetics.colour_outline = this.inputSettings.settings.outliers["two_sigma_colour_" + two_sigma_outlier];
                aesthetics.scatter_text_colour = aesthetics.colour;
            }
            if (three_sigma_outlier !== "none") {
                aesthetics.colour = this.inputSettings.settings.outliers["three_sigma_colour_" + three_sigma_outlier];
                aesthetics.colour_outline = this.inputSettings.settings.outliers["three_sigma_colour_" + three_sigma_outlier];
                aesthetics.scatter_text_colour = aesthetics.colour;
            }
            this.plotPoints.push({
                x: denominator,
                numerator: numerator,
                value: value,
                z: zScores[i],
                group_text: category,
                aesthetics: aesthetics,
                identity: host.createSelectionIdBuilder()
                    .withCategory(this.inputData.categories, original_index)
                    .createSelectionId(),
                highlighted: this.inputData.highlights?.[i] != null,
                tooltip: buildTooltip(i, this.calculatedLimits, { two_sigma: two_sigma_outlier !== "none", three_sigma: three_sigma_outlier !== "none" }, this.inputData, this.inputSettings.settings, this.inputSettings.derivedSettings),
                label: {
                    text_value: this.inputData.labels?.[i],
                    aesthetics: this.inputData.label_formatting[i],
                    angle: null,
                    distance: null,
                    line_offset: null,
                    marker_offset: null
                },
                two_sigma: two_sigma_outlier,
                three_sigma: three_sigma_outlier
            });
        }
    }
    initialiseGroupedLines() {
        const labels = new Array();
        if (this.inputSettings.settings.lines.show_target) {
            labels.push("target");
        }
        if (this.inputSettings.settings.lines.show_alt_target) {
            labels.push("alt_target");
        }
        if (this.inputSettings.settings.lines.show_99) {
            labels.push("ll99", "ul99");
        }
        if (this.inputSettings.settings.lines.show_95) {
            labels.push("ll95", "ul95");
        }
        if (this.inputSettings.settings.lines.show_68) {
            labels.push("ll68", "ul68");
        }
        const formattedLines = new Array();
        this.calculatedLimits.forEach(limits => {
            labels.forEach(label => {
                formattedLines.push({
                    x: limits.denominators,
                    line_value: limits?.[label],
                    group: label
                });
            });
        });
        this.groupedLines = groupBy(formattedLines, "group");
    }
    scaleAndTruncateLimits() {
        const multiplier = this.inputSettings.derivedSettings.multiplier;
        const transform = getTransformation(this.inputSettings.settings.funnel.transformation);
        const limits = {
            lower: this.inputSettings.settings.funnel.ll_truncate,
            upper: this.inputSettings.settings.funnel.ul_truncate
        };
        this.calculatedLimits.forEach(limit => {
            ["target", "ll99", "ll95", "ll68", "ul68", "ul95", "ul99"].forEach(type => {
                limit[type] = truncate(transform(multiply(limit[type], multiplier)), limits);
            });
        });
    }
}

class Visual {
    constructor(options) {
        this.svg = ccD3.select(options.element).append("svg");
        this.host = options.host;
        this.viewModel = new viewModelClass();
        this.plotProperties = new plotPropertiesClass();
        this.selectionManager = this.host.createSelectionManager();
        this.selectionManager.registerOnSelectCallback(() => this.updateHighlighting());
        this.svg.call(initialiseSVG);
    }
    update(options) {
        try {
            this.host.eventService.renderingStarted(options);
            this.svg.select(".errormessage").remove();
            const update_status = this.viewModel.update(options, this.host);
            if (!update_status.status) {
                this.resizeCanvas(options.viewport.width, options.viewport.height);
                if (this.viewModel?.inputSettings?.settings?.canvas?.show_errors ?? true) {
                    this.svg.call(drawErrors, options, update_status?.error, update_status?.type);
                }
                else {
                    this.svg.call(initialiseSVG, true);
                }
                this.host.eventService.renderingFailed(options);
                return;
            }
            this.plotProperties.update(options, this.viewModel);
            if (update_status.warning) {
                this.host.displayWarningIcon("Invalid inputs or settings ignored.\n", update_status.warning);
            }
            this.resizeCanvas(options.viewport.width, options.viewport.height);
            this.drawVisual();
            this.adjustPaddingForOverflow();
            this.updateHighlighting();
            this.host.eventService.renderingFinished(options);
        }
        catch (caught_error) {
            this.svg.call(drawErrors, options, caught_error.message, "internal");
            console.error(caught_error);
            this.host.eventService.renderingFailed(options);
        }
    }
    resizeCanvas(width, height) {
        this.svg.attr("width", width).attr("height", height);
    }
    updateHighlighting() {
        const anyHighlights = this.viewModel.inputData ? this.viewModel.inputData.anyHighlights : false;
        const allSelectionIDs = this.selectionManager.getSelectionIds();
        const dotsSelection = this.svg.selectAll(".dotsgroup").selectChildren();
        const linesSelection = this.svg.selectAll(".linesgroup").selectChildren();
        linesSelection.style("stroke-opacity", (d) => {
            return getAesthetic(d[0], "lines", "opacity", this.viewModel.inputSettings.settings);
        });
        dotsSelection.style("fill-opacity", (d) => d.aesthetics.opacity);
        dotsSelection.style("stroke-opacity", (d) => d.aesthetics.opacity);
        if (anyHighlights || (allSelectionIDs.length > 0)) {
            linesSelection.style("stroke-opacity", (d) => {
                return getAesthetic(d[0], "lines", "opacity_unselected", this.viewModel.inputSettings.settings);
            });
            dotsSelection.nodes().forEach(currentDotNode => {
                const dot = ccD3.select(currentDotNode).datum();
                const currentPointSelected = identitySelected(dot.identity, this.selectionManager);
                const currentPointHighlighted = dot.highlighted;
                const newDotOpacity = (currentPointSelected || currentPointHighlighted) ? dot.aesthetics.opacity_selected : dot.aesthetics.opacity_unselected;
                ccD3.select(currentDotNode).style("fill-opacity", newDotOpacity);
                ccD3.select(currentDotNode).style("stroke-opacity", newDotOpacity);
            });
        }
    }
    drawVisual() {
        this.svg.call(drawXAxis, this)
            .call(drawYAxis, this)
            .call(drawTooltipLine, this)
            .call(drawLines, this)
            .call(drawLineLabels, this)
            .call(drawDots, this)
            .call(addContextMenu, this)
            .call(drawLabels, this);
    }
    adjustPaddingForOverflow() {
        if (this.viewModel.headless) {
            return;
        }
        const svgWidth = this.viewModel.svgWidth;
        const svgHeight = this.viewModel.svgHeight;
        const svgBBox = this.svg.node().getBBox();
        const overflowLeft = Math.abs(Math.min(0, svgBBox.x));
        const overflowRight = Math.max(0, svgBBox.width + svgBBox.x - svgWidth);
        const overflowTop = Math.abs(Math.min(0, svgBBox.y));
        const overflowBottom = Math.max(0, svgBBox.height + svgBBox.y - svgHeight);
        if (overflowLeft > 0) {
            this.plotProperties.xAxis.start_padding += overflowLeft + this.plotProperties.xAxis.start_padding;
        }
        if (overflowRight > 0) {
            this.plotProperties.xAxis.end_padding += overflowRight + this.plotProperties.xAxis.end_padding;
        }
        if (overflowTop > 0) {
            this.plotProperties.yAxis.end_padding += overflowTop + this.plotProperties.yAxis.end_padding;
        }
        if (overflowBottom > 0) {
            this.plotProperties.yAxis.start_padding += overflowBottom + this.plotProperties.yAxis.start_padding;
        }
        if (overflowLeft > 0 || overflowRight > 0 || overflowTop > 0 || overflowBottom > 0) {
            this.plotProperties.initialiseScale(svgWidth, svgHeight);
            this.drawVisual();
        }
    }
    getFormattingModel() {
        return this.viewModel.inputSettings.getFormattingModel();
    }
}


return {
  Visual: Visual,
  defaultSettings: defaultSettings
};
})();
