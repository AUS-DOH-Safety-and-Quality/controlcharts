var ccCore = (function (exports) {
    'use strict';

    function formatNumber(value, decimalPlaces, suffix) {
        if (value === undefined || Number.isNaN(value)) {
            return undefined;
        }
        const text = value.toFixed(decimalPlaces);
        return (Number(text) === 0 ? text.replace("-", "") : text) + suffix;
    }

    function isNullOrUndefined(value) {
        return value === null || value === undefined;
    }

    function isValidNumber(value) {
        return typeof value === "number" && Number.isFinite(value);
    }

    function groupBy(rows, key) {
        const groups = new Map();
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const keyValue = row[key];
            const group = groups.get(keyValue);
            if (group === undefined) {
                groups.set(keyValue, [row]);
            }
            else {
                group.push(row);
            }
        }
        return Array.from(groups);
    }

    const directionMaps = {
        increase: { upper: "improvement", lower: "deterioration" },
        decrease: { lower: "improvement", upper: "deterioration" },
        neutral: { lower: "neutral_low", upper: "neutral_high" }
    };
    function checkFlagDirection(outlierStatus, flagSettings) {
        if (outlierStatus === "none") {
            return "none";
        }
        const mappedFlag = directionMaps[flagSettings.improvement_direction][outlierStatus];
        if (flagSettings.improvement_direction !== "neutral" && flagSettings.process_flag_type !== "both"
            && mappedFlag !== flagSettings.process_flag_type) {
            return "none";
        }
        return mappedFlag;
    }

    function applyFlagColours(aesthetics, colours, flags) {
        let colour;
        for (let i = 0; i < flags.length; i++) {
            const status = flags[i][0];
            if (status !== "none") {
                colour = colours[`${flags[i][1]}_${status}`];
            }
        }
        if (colour === undefined) {
            return;
        }
        aesthetics.colour = colour;
        aesthetics.colour_outline = colour;
        if (aesthetics.scatter_text_colour !== undefined) {
            aesthetics.scatter_text_colour = colour;
        }
    }

    function createValueFormatter(decimalPlaces, suffix) {
        return (value, name) => {
            if (name === "value") {
                return formatNumber(value, decimalPlaces, suffix) ?? "";
            }
            return formatNumber(value, Number.isInteger(value) ? 0 : decimalPlaces, "") ?? "";
        };
    }

    function resolvePercentScaling(isProportion, percentSetting, multiplier) {
        if (percentSetting === "Yes") {
            multiplier = 100;
        }
        if (isProportion && percentSetting !== "No" && multiplier === 1) {
            multiplier = 100;
        }
        const percentLabels = percentSetting === "Automatic" ? isProportion && multiplier === 100 : percentSetting === "Yes";
        return { multiplier, percentLabels };
    }

    function csvField(value) {
        const raw = String(value ?? "");
        const text = typeof value === "string" && /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
        if (!/[",\r\n]/.test(text)) {
            return text;
        }
        return `"${text.replace(/"/g, "\"\"")}"`;
    }
    function toCsv(rows) {
        if (rows.length === 0) {
            return "";
        }
        const columns = Object.keys(rows[0]);
        const lines = new Array(rows.length + 1);
        const header = new Array(columns.length);
        for (let j = 0; j < columns.length; j++) {
            header[j] = csvField(columns[j]);
        }
        lines[0] = header.join(",");
        for (let i = 0; i < rows.length; i++) {
            const values = new Array(columns.length);
            for (let j = 0; j < columns.length; j++) {
                values[j] = csvField(rows[i][columns[j]]);
            }
            lines[i + 1] = values.join(",");
        }
        return lines.join("\n");
    }

    function validateRows(count, rules) {
        const messages = new Array(count);
        const kept = [];
        let sameRule = true;
        let firstRule = -1;
        for (let i = 0; i < count; i++) {
            let failed = -1;
            for (let j = 0; j < rules.length; j++) {
                if (rules[j].fails(i)) {
                    failed = j;
                    break;
                }
            }
            messages[i] = failed === -1 ? "" : rules[failed].message;
            if (failed === -1) {
                kept.push(i);
            }
            if (i === 0) {
                firstRule = failed;
            }
            else if (failed !== firstRule) {
                sameRule = false;
            }
        }
        if (kept.length > 0) {
            return { status: 0, messages, kept };
        }
        return { status: 1, messages, error: sameRule && count > 0 ? rules[firstRule].all : "No valid data found!" };
    }

    function keptValue(values, position) {
        const value = values?.[position];
        if (value === undefined) {
            throw new Error("Validated row contains a missing value.");
        }
        return value;
    }

    const quantity = {
        numerator: { name: "Numerator", plural: "numerators" },
        denominator: { name: "Denominator", plural: "denominators" }
    };
    function valueAt(values, index) {
        return values?.[index] ?? NaN;
    }
    function missingRule(values, named) {
        return {
            fails: i => isNullOrUndefined(values?.[i]),
            message: `${named.name} missing`,
            all: `All ${named.plural} are missing or null!`
        };
    }
    function nanRule(values, named) {
        return {
            fails: i => Number.isNaN(valueAt(values, i)),
            message: `${named.name} is not a number`,
            all: `All ${named.plural} are not numbers!`
        };
    }
    function negativeRule(values, named) {
        return {
            fails: i => valueAt(values, i) < 0,
            message: `${named.name} negative`,
            all: `All ${named.plural} are negative!`
        };
    }
    function ratioRule(numerators, denominators) {
        return {
            fails: i => valueAt(denominators, i) < valueAt(numerators, i),
            message: "Denominator < numerator",
            all: "All denominators are smaller than numerators!"
        };
    }

    function deriveScaling(settings, options) {
        const scaling = resolvePercentScaling(options.proportion, settings.perc_labels, settings.multiplier);
        const percentLabels = scaling.percentLabels && options.percentAllowed;
        return {
            multiplier: scaling.multiplier,
            percentLabels,
            formatValue: createValueFormatter(settings.sig_figs, percentLabels ? "%" : "")
        };
    }

    const FormattingComponent = {
        AlignmentGroup: "AlignmentGroup",
        ColorPicker: "ColorPicker",
        Dropdown: "Dropdown",
        FontPicker: "FontPicker",
        NumUpDown: "NumUpDown",
        TextInput: "TextInput",
        ToggleSwitch: "ToggleSwitch"
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
    function numberOption(displayName, description, defaultValue, minMax) {
        const result = {
            displayName,
            description,
            type: FormattingComponent.NumUpDown,
            default: defaultValue
        };
        if (minMax !== undefined) {
            const min = minMax.min ?? minMax.above;
            const max = minMax.max ?? minMax.below;
            if (min !== undefined || max !== undefined) {
                result.options = {};
                if (min !== undefined) {
                    result.options.minValue = { value: min };
                }
                if (max !== undefined) {
                    result.options.maxValue = { value: max };
                }
            }
            if (minMax.above !== undefined) {
                result.exclusiveMin = true;
            }
            if (minMax.below !== undefined) {
                result.exclusiveMax = true;
            }
            if (minMax.integer) {
                result.integer = true;
            }
        }
        return result;
    }
    function describeRange(setting, kind) {
        const min = setting.options?.minValue?.value;
        const max = setting.options?.maxValue?.value;
        if (min !== undefined && max !== undefined && !setting.exclusiveMin && !setting.exclusiveMax) {
            return `${kind} from ${min} to ${max}`;
        }
        const bounds = [];
        if (min !== undefined) {
            bounds.push(`${setting.exclusiveMin ? "above" : "at least"} ${min}`);
        }
        if (max !== undefined) {
            bounds.push(`${setting.exclusiveMax ? "below" : "at most"} ${max}`);
        }
        return bounds.length === 0 ? kind : `${kind}, ${bounds.join(" and ")}`;
    }
    function toggleOption(displayName, description, defaultValue) {
        return {
            displayName: displayName,
            description,
            type: FormattingComponent.ToggleSwitch,
            default: defaultValue
        };
    }
    function paddingOption(displayName, description) {
        return numberOption(displayName, description, 10);
    }
    function colourOption(displayName, description, type) {
        return {
            displayName: displayName,
            description,
            type: FormattingComponent.ColorPicker,
            default: defaultColours[type]
        };
    }
    function fontOption(displayName, description) {
        return {
            displayName: displayName,
            description,
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
    function fontSizeOption(displayName, description) {
        return numberOption(displayName, description, 10, { min: 0, max: 100 });
    }
    const valueTransforms = {
        none: (value) => value,
        sentence: (value) => value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
    };
    function dropdownOption(displayName, description, defaultValue, validValues, displayTransform = "none", displayNames) {
        const valid = new Array(validValues.length);
        const items = new Array(validValues.length);
        const transform = valueTransforms[displayTransform];
        for (let i = 0; i < validValues.length; i++) {
            const value = validValues[i];
            valid[i] = value;
            items[i] = { displayName: displayNames === undefined ? transform(value) : displayNames[i], value };
        }
        return {
            displayName,
            description,
            type: FormattingComponent.Dropdown,
            default: defaultValue,
            valid,
            items
        };
    }
    function lineTypeOption(displayName, description, defaultValue) {
        return dropdownOption(displayName, description, defaultValue, ["10 0", "10 10", "2 5"], "none", ["Solid", "Dashed", "Dotted"]);
    }
    function textOption(displayName, description, defaultValue) {
        return {
            displayName: displayName,
            description,
            type: FormattingComponent.TextInput,
            default: defaultValue
        };
    }
    function lineLabelPositionOption() {
        return dropdownOption("Position of Value on Line(s)", "Where the value sits at the line's end. Outside is below lower limits and above other lines; inside is the reverse.", "beside", ["outside", "inside", "above", "below", "beside"], "sentence");
    }
    const borderStyles = ["solid", "dotted", "dashed", "double", "groove", "ridge", "inset", "outset", "none"];
    function borderStyleOption(displayName, description, defaultValue = "solid") {
        return dropdownOption(displayName, description, defaultValue, borderStyles, "sentence");
    }
    function borderWidthOption(displayName, description) {
        return numberOption(displayName, description, 1, { min: 0, max: 100 });
    }
    function alignmentOption(displayName, description) {
        return {
            displayName: displayName,
            description,
            type: FormattingComponent.AlignmentGroup,
            default: "center",
            valid: ["center", "left", "right"]
        };
    }
    const fontWeights = ["normal", "bold", "bolder", "lighter"];
    function fontWeightOption(displayName, description, defaultValue = "normal") {
        return dropdownOption(displayName, description, defaultValue, fontWeights, "sentence");
    }
    function fontStyleOption(displayName, description) {
        return dropdownOption(displayName, description, "normal", ["normal", "italic"], "sentence");
    }
    function textTransformOption(displayName, description) {
        return dropdownOption(displayName, description, "none", ["uppercase", "lowercase", "capitalize", "none"], "sentence");
    }
    function defineCard(definition) {
        const card = { ...definition };
        const groups = Object.keys(card.settingsGroups);
        for (let i = 0; i < groups.length; i++) {
            const group = card.settingsGroups[groups[i]];
            const names = Object.keys(group);
            for (let j = 0; j < names.length; j++) {
                const name = names[j];
                Object.defineProperty(card, name, { get: () => group[name] });
            }
        }
        return card;
    }
    function groupDisplayName(card, groupName) {
        return groupName === "all" ? card.displayName : groupName;
    }
    function createDefaultValues(schema) {
        const values = {};
        const cards = Object.keys(schema);
        for (let i = 0; i < cards.length; i++) {
            const name = cards[i];
            const groups = schema[name].settingsGroups;
            const groupNames = Object.keys(groups);
            const defaults = {};
            for (let j = 0; j < groupNames.length; j++) {
                const definitions = groups[groupNames[j]];
                const names = Object.keys(definitions);
                for (let k = 0; k < names.length; k++) {
                    const setting = names[k];
                    defaults[setting] = definitions[setting].default;
                }
            }
            values[name] = defaults;
        }
        return values;
    }

    const charts = new Map();
    function registerChart(name, chart) {
        charts.set(name, { ...chart, defaultSettings: createDefaultValues(chart.settingsModel) });
    }
    function frontendChart(name) {
        const chart = charts.get(name);
        if (chart === undefined) {
            throw new Error(`Unknown chart type '${name}'.`);
        }
        return chart;
    }
    function chartNames() {
        return Array.from(charts.keys());
    }

    function selectionId(keys) {
        return { keys, getKey: () => JSON.stringify(keys) };
    }
    function ignore() { }
    function constructorOptions(element, services) {
        const host = {
            createSelectionManager: () => services.selectionManager,
            createSelectionIdBuilder: () => {
                let keys = [];
                const builder = {
                    withCategory: (_category, index) => {
                        keys = services.rowKeys(index);
                        return builder;
                    },
                    createSelectionId: () => selectionId(keys)
                };
                return builder;
            },
            tooltipService: services.tooltipService,
            eventService: {
                renderingStarted: ignore,
                renderingFailed: ignore,
                renderingFinished: ignore
            },
            colorPalette: {
                isHighContrast: false,
                foreground: { value: "black" },
                background: { value: "white" },
                foregroundSelected: { value: "black" },
                hyperlink: { value: "blue" }
            },
            hostCapabilities: {
                allowInteractions: true
            },
            displayWarningIcon: services.displayWarningIcon
        };
        return { element, host: host };
    }

    function isArray(value) {
        return Array.isArray(value);
    }
    function asArray(value) {
        return isArray(value) ? value : [value];
    }
    function isMissing(value) {
        return value == null || Number.isNaN(value);
    }
    function isPlainObject(value) {
        return Object.prototype.toString.call(value) === "[object Object]";
    }
    function hasOwn(object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
    }
    function limitValue(value) {
        return value === undefined || Number.isNaN(value) ? null : value;
    }

    function indicatorColumns(names, limitColumns) {
        const reserved = new Set(limitColumns);
        const taken = new Set(limitColumns);
        for (let i = 0; i < names.length; i++) {
            taken.add(names[i]);
        }
        const columns = new Array(names.length);
        for (let i = 0; i < names.length; i++) {
            let column = names[i];
            if (reserved.has(column)) {
                do {
                    column += "_";
                } while (taken.has(column));
                taken.add(column);
            }
            columns[i] = column;
        }
        return columns;
    }
    function indicatorFields(indicators, limitColumns) {
        const names = Object.keys(indicators);
        const columns = indicatorColumns(names, limitColumns);
        const fields = {};
        for (let i = 0; i < names.length; i++) {
            fields[columns[i]] = indicators[names[i]];
        }
        return fields;
    }

    const aggregationMethods = ["first", "last", "sum", "mean", "min", "max", "median", "count"];
    const valueRoles = ["numerators", "denominators", "groupings", "xbar_sds", "labels"];
    const defaultAggregations = {
        numerators: "sum",
        denominators: "sum",
        groupings: "first",
        xbar_sds: "first",
        tooltips: "first",
        labels: "first"
    };
    function isAggregationMethod(value) {
        for (let i = 0; i < aggregationMethods.length; i++) {
            if (aggregationMethods[i] === value) {
                return true;
            }
        }
        return false;
    }
    function isAggregatedRole(name) {
        return hasOwn(defaultAggregations, name);
    }
    function aggregateColumn(column, aggregation) {
        let first = null;
        let last = null;
        const values = [];
        let sum = 0;
        for (let i = 0; i < column.length; i++) {
            const value = column[i];
            if (!isMissing(value)) {
                first ?? (first = value);
                last = value;
                values.push(Number(value));
                sum += Number(value);
            }
        }
        if (aggregation === "first") {
            return first;
        }
        if (aggregation === "last") {
            return last;
        }
        if (aggregation === "count") {
            return values.length;
        }
        if (values.length === 0) {
            return null;
        }
        switch (aggregation) {
            case "sum":
                return sum;
            case "mean":
                return sum / values.length;
            case "min":
                return Math.min(...values);
            case "max":
                return Math.max(...values);
            case "median": {
                values.sort((a, b) => a - b);
                const mid = Math.floor(values.length / 2);
                return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
            }
        }
    }
    function chartAggregations(aggregations) {
        if (aggregations != null && !isPlainObject(aggregations)) {
            return { error: "Aggregations must be named." };
        }
        const result = { ...defaultAggregations };
        const names = Object.keys(aggregations ?? {});
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const method = aggregations?.[name];
            if (!isAggregatedRole(name)) {
                const options = Object.keys(defaultAggregations).join(", ");
                return { error: `'${name}' is not a valid variable to aggregate. Valid options are: ${options}.` };
            }
            if (!isAggregationMethod(method)) {
                return { error: `'${String(method)}' is not a valid aggregation. Valid options are: ${aggregationMethods.join(", ")}.` };
            }
            result[name] = method;
        }
        return { aggregations: result };
    }

    function asText(value) {
        if (typeof value === "number") {
            return String(value);
        }
        if (!isArray(value)) {
            return value;
        }
        const values = new Array(value.length);
        for (let i = 0; i < value.length; i++) {
            values[i] = typeof value[i] === "number" ? String(value[i]) : value[i];
        }
        return values;
    }
    function chartSettings(chartType, inputSettings, rowCount) {
        const chart = frontendChart(chartType);
        const defaults = chart.defaultSettings;
        const settings = {};
        const groupNames = Object.keys(inputSettings);
        for (let i = 0; i < groupNames.length; i++) {
            const groupName = groupNames[i];
            const group = inputSettings[groupName];
            if (group == null) {
                continue;
            }
            if (!hasOwn(defaults, groupName)) {
                return { error: `'${groupName}' is not a valid settings group. Valid options are: ${Object.keys(defaults).join(", ")}.` };
            }
            if (!isPlainObject(group)) {
                return { error: `Settings in group '${groupName}' must be named.` };
            }
            const groupDefaults = defaults[groupName];
            const groupSettings = {};
            const names = Object.keys(group);
            for (let j = 0; j < names.length; j++) {
                if (!hasOwn(groupDefaults, names[j])) {
                    const options = Object.keys(groupDefaults).join("', '");
                    return { error: `Invalid setting '${names[j]}' in group '${groupName}'. Valid settings are: '${options}'.` };
                }
                let value = group[names[j]];
                if (isArray(value) && value.length === 1) {
                    value = value[0];
                }
                if (isPlainObject(value) || (isArray(value) && value.length !== rowCount)) {
                    return { error: `Setting '${names[j]}' in group '${groupName}' must have one value or ${rowCount} values.` };
                }
                groupSettings[names[j]] = typeof groupDefaults[names[j]] === "string" ? asText(value) : value;
            }
            settings[groupName] = groupSettings;
        }
        return { settings };
    }

    const defaultTitleSettings = {
        text: null,
        font_size: "16px",
        font_weight: "bold",
        font_family: "'Arial', sans-serif",
        x: "50%",
        y: 5,
        text_anchor: "middle",
        dominant_baseline: "hanging",
        subtitle: null,
        subtitle_font_size: "12px",
        subtitle_font_weight: "normal"
    };
    function isTitleName(name) {
        return hasOwn(defaultTitleSettings, name);
    }
    function chartTitle(title) {
        const settings = { ...defaultTitleSettings };
        if (typeof title === "string") {
            settings.text = title;
            return { settings };
        }
        let valid = title == null || isPlainObject(title);
        const named = isPlainObject(title) ? title : {};
        const names = Object.keys(named);
        for (let i = 0; i < names.length && valid; i++) {
            const name = names[i];
            const value = named[name];
            if (!isTitleName(name) || (value != null && typeof value !== "string" && typeof value !== "number")) {
                valid = false;
            }
            else if (value != null) {
                settings[name] = value;
            }
        }
        if (!valid) {
            const options = Object.keys(defaultTitleSettings).join("', '");
            return { error: `The title must be a string, or named settings from: '${options}'.` };
        }
        return { settings };
    }
    function titleHeight(settings) {
        if (settings.text === null) {
            return 0;
        }
        let height = parseFloat(String(settings.font_size)) + Number(settings.y);
        if (settings.subtitle !== null) {
            height += parseFloat(String(settings.subtitle_font_size));
        }
        return height;
    }
    function updateChartTitle(svg, settings) {
        svg.selectAll(".chart-title, .chart-subtitle").remove();
        if (settings.text === null) {
            return;
        }
        svg.append("text")
            .classed("chart-title", true)
            .attr("x", settings.x)
            .attr("y", settings.y)
            .attr("text-anchor", settings.text_anchor)
            .attr("dominant-baseline", settings.dominant_baseline)
            .attr("font-size", settings.font_size)
            .attr("font-weight", settings.font_weight)
            .attr("font-family", settings.font_family)
            .text(settings.text);
        if (settings.subtitle !== null) {
            svg.append("text")
                .classed("chart-subtitle", true)
                .attr("x", settings.x)
                .attr("y", Number(settings.y) + parseFloat(String(settings.font_size)))
                .attr("text-anchor", settings.text_anchor)
                .attr("dominant-baseline", settings.dominant_baseline)
                .attr("font-size", settings.subtitle_font_size)
                .attr("font-weight", settings.subtitle_font_weight)
                .attr("font-family", settings.font_family)
                .text(settings.subtitle);
        }
    }

    function toDataViews(dataViews) {
        return dataViews;
    }
    function compareValues(a, b) {
        const aMissing = isMissing(a);
        const bMissing = isMissing(b);
        if (aMissing || bMissing) {
            return Number(aMissing) - Number(bMissing);
        }
        if (typeof a === "number" && typeof b === "number") {
            return a - b;
        }
        const aText = String(a);
        const bText = String(b);
        if (aText === bText) {
            return 0;
        }
        return aText < bText ? -1 : 1;
    }
    function namedColumns(columns) {
        const names = Object.keys(columns ?? {});
        const values = new Array(names.length);
        for (let i = 0; i < names.length; i++) {
            values[i] = asArray(columns?.[names[i]] ?? null);
        }
        return { names, columns: values };
    }
    function hasDateCategories(categories) {
        let hasDate = false;
        for (let i = 0; i < categories.length; i++) {
            const value = categories[i];
            if (isMissing(value)) {
                continue;
            }
            if (typeof value !== "string"
                || !/^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)?$/.test(value)
                || Number.isNaN(Date.parse(value))) {
                return false;
            }
            const datePart = value.slice(0, 10);
            if (new Date(datePart).toISOString().slice(0, 10) !== datePart) {
                return false;
            }
            hasDate = true;
        }
        return hasDate;
    }
    function groupRows(categories, categoryOrder, indicatorColumns, crosstalkIdentities, crosstalkFilters) {
        const filters = crosstalkFilters === undefined ? undefined : new Set(crosstalkFilters);
        const order = new Array(categories.length);
        for (let i = 0; i < order.length; i++) {
            order[i] = i;
        }
        order.sort((a, b) => {
            for (let i = 0; i < indicatorColumns.length; i++) {
                const comparison = compareValues(indicatorColumns[i][a], indicatorColumns[i][b]);
                if (comparison !== 0) {
                    return comparison;
                }
            }
            return compareValues(categoryOrder[a], categoryOrder[b]);
        });
        const groups = new Map();
        for (let i = 0; i < order.length; i++) {
            const row = order[i];
            if (filters !== undefined && !filters.has(String(crosstalkIdentities[row]))) {
                continue;
            }
            const category = isMissing(categories[row]) ? null : String(categories[row]);
            const indicators = new Array(indicatorColumns.length);
            for (let j = 0; j < indicatorColumns.length; j++) {
                indicators[j] = indicatorColumns[j][row];
            }
            const groupKey = JSON.stringify([category, ...indicators]);
            let group = groups.get(groupKey);
            if (group === undefined) {
                group = { category, indicators, rows: [] };
                groups.set(groupKey, group);
            }
            group.rows.push(row);
        }
        return Array.from(groups.values());
    }
    function groupSettings(inputSettings) {
        const groupNames = Object.keys(inputSettings);
        let conditional = false;
        for (let i = 0; i < groupNames.length && !conditional; i++) {
            const group = inputSettings[groupNames[i]];
            const names = Object.keys(group);
            for (let j = 0; j < names.length && !conditional; j++) {
                conditional = isArray(group[names[j]]);
            }
        }
        if (!conditional) {
            return () => inputSettings;
        }
        return row => {
            const settings = {};
            for (let i = 0; i < groupNames.length; i++) {
                const group = inputSettings[groupNames[i]];
                const rowGroup = {};
                const names = Object.keys(group);
                for (let j = 0; j < names.length; j++) {
                    const value = group[names[j]];
                    rowGroup[names[j]] = isArray(value) ? value[row] : value;
                }
                settings[groupNames[i]] = rowGroup;
            }
            return settings;
        };
    }
    function makeUpdateValues(rawData, inputSettings, aggregations, crosstalkFilters) {
        const valueNames = [];
        const valueColumns = [];
        for (let i = 0; i < valueRoles.length; i++) {
            const column = rawData[valueRoles[i]];
            if (column != null) {
                valueNames.push(valueRoles[i]);
                valueColumns.push(asArray(column));
            }
        }
        const indicators = namedColumns(rawData.indicators);
        const tooltips = namedColumns(rawData.tooltips);
        const categories = asArray(rawData.categories);
        let crosstalkIdentities;
        if (rawData.crosstalk_identities == null) {
            const positions = new Array(categories.length);
            for (let i = 0; i < categories.length; i++) {
                positions[i] = String(i + 1);
            }
            crosstalkIdentities = positions;
        }
        else {
            crosstalkIdentities = asArray(rawData.crosstalk_identities);
        }
        let categoryOrder = categories;
        if (rawData.category_levels != null) {
            const levels = asArray(rawData.category_levels);
            const ranks = new Map();
            for (let i = 0; i < levels.length; i++) {
                ranks.set(levels[i], i);
            }
            const ranked = new Array(categories.length);
            for (let i = 0; i < categories.length; i++) {
                ranked[i] = ranks.get(categories[i]);
            }
            categoryOrder = ranked;
        }
        const groups = groupRows(categories, categoryOrder, indicators.columns, crosstalkIdentities, crosstalkFilters);
        const key = {
            source: { displayName: rawData.category_name, roles: { key: true }, type: hasDateCategories(categories) ? { temporal: {} } : { text: true } },
            values: [],
            objects: []
        };
        const categoryColumns = [key];
        for (let i = 0; i < indicators.names.length; i++) {
            categoryColumns.push({ source: { displayName: indicators.names[i], roles: { indicator: true } }, values: [] });
        }
        const columns = new Array(valueNames.length + tooltips.names.length);
        for (let i = 0; i < valueNames.length; i++) {
            columns[i] = { source: { displayName: valueNames[i], roles: { [valueNames[i]]: true } }, values: [] };
        }
        for (let i = 0; i < tooltips.names.length; i++) {
            columns[valueNames.length + i] = {
                source: { displayName: tooltips.names[i], roles: { tooltips: true }, type: { text: true } },
                values: []
            };
        }
        const rowSettings = groupSettings(inputSettings);
        const identities = new Array(groups.length);
        const sourceRows = {};
        for (let g = 0; g < groups.length; g++) {
            const group = groups[g];
            sourceRows[String(g)] = group.rows;
            key.values.push(group.category);
            for (let i = 0; i < group.indicators.length; i++) {
                categoryColumns[i + 1].values.push(group.indicators[i]);
            }
            const groupIdentities = new Array(group.rows.length);
            for (let i = 0; i < group.rows.length; i++) {
                groupIdentities[i] = String(crosstalkIdentities[group.rows[i]]);
            }
            identities[g] = groupIdentities;
            key.objects.push(rowSettings(group.rows[0]));
            const groupValues = new Array(group.rows.length);
            for (let i = 0; i < columns.length; i++) {
                const isValue = i < valueNames.length;
                const column = isValue ? valueColumns[i] : tooltips.columns[i - valueNames.length];
                for (let j = 0; j < group.rows.length; j++) {
                    groupValues[j] = column[group.rows[j]];
                }
                columns[i].values.push(aggregateColumn(groupValues, isValue ? aggregations[valueNames[i]] : aggregations.tooltips));
            }
        }
        const sources = new Array(categoryColumns.length + columns.length);
        for (let i = 0; i < sources.length; i++) {
            sources[i] = i < categoryColumns.length ? categoryColumns[i].source : columns[i - categoryColumns.length].source;
        }
        const dataView = {
            categorical: { categories: categoryColumns, values: columns },
            metadata: { columns: sources }
        };
        return { dataViews: [dataView], crosstalk_identities: identities, source_rows: sourceRows };
    }

    function paddedDataViews(chartType, dataViews, titleSettings, staticPlot) {
        const defaults = frontendChart(chartType).defaultSettings;
        const titlePadding = titleHeight(titleSettings);
        const dataView = dataViews[0];
        const [key, ...indicators] = dataView.categorical.categories;
        const objects = new Array(key.objects.length);
        for (let i = 0; i < objects.length; i++) {
            const settings = key.objects[i];
            const canvas = { ...defaults.canvas, ...settings.canvas };
            canvas.upper_padding = Number(canvas.upper_padding) + titlePadding;
            if (staticPlot) {
                const xAxis = { ...defaults.x_axis, ...settings.x_axis };
                const tickSize = Number(xAxis.xlimit_tick_size);
                const rotation = Number(xAxis.xlimit_tick_rotation);
                const radians = rotation * Math.PI / 180;
                canvas.left_padding = Number(canvas.left_padding) + 50;
                const lowerPadding = rotation === 0
                    ? 10 + tickSize
                    : 5.8 * tickSize * Math.abs(Math.sin(radians)) + (9 + 0.4 * tickSize) * Math.abs(Math.cos(radians));
                canvas.lower_padding = Number(canvas.lower_padding) + lowerPadding;
                if (rotation >= 0) {
                    canvas.right_padding = Number(canvas.right_padding) + (rotation > 0 ? 4 : 2) * tickSize;
                }
            }
            objects[i] = { ...settings, canvas };
        }
        return [{ ...dataView, categorical: { ...dataView.categorical, categories: [{ ...key, objects }, ...indicators] } }];
    }

    function sum(values) {
        let total = 0;
        for (let i = 0; i < values.length; i++) {
            total += values[i];
        }
        return total;
    }

    function median(values) {
        const n = values.length;
        if (n === 0) {
            return Number.NaN;
        }
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(n / 2);
        if (n % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        }
        return sorted[mid];
    }

    function max(values) {
        let result = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < values.length; i++) {
            if (values[i] > result) {
                result = values[i];
            }
        }
        return result;
    }

    function rep(x, n) {
        const result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = x;
        }
        return result;
    }

    function between(x, lower, upper) {
        return lower <= x && x <= upper;
    }

    function clamp(value, lower, upper) {
        let result = value;
        if (lower !== undefined && result < lower) {
            result = lower;
        }
        if (upper !== undefined && result > upper) {
            result = upper;
        }
        return result;
    }

    function sequence(start, count, step) {
        const result = new Array(count);
        if (count > 0) {
            result[0] = start;
        }
        for (let i = 1; i < count; i++) {
            result[i] = result[i - 1] + step;
        }
        return result;
    }

    function tickSpec(start, stop, count) {
        const step = (stop - start) / count;
        const power = Math.floor(Math.log10(step));
        const error = step / Math.pow(10, power);
        const factor = error >= Math.sqrt(50) ? 10 : error >= Math.sqrt(10) ? 5 : error >= Math.sqrt(2) ? 2 : 1;
        let i1;
        let i2;
        let inc;
        if (power < 0) {
            inc = Math.pow(10, -power) / factor;
            i1 = Math.round(start * inc);
            i2 = Math.round(stop * inc);
            if (i1 / inc < start) {
                ++i1;
            }
            if (i2 / inc > stop) {
                --i2;
            }
            inc = -inc;
        }
        else {
            inc = Math.pow(10, power) * factor;
            i1 = Math.round(start / inc);
            i2 = Math.round(stop / inc);
            if (i1 * inc < start) {
                ++i1;
            }
            if (i2 * inc > stop) {
                --i2;
            }
        }
        if (i2 < i1 && 0.5 <= count && count < 2) {
            return tickSpec(start, stop, count * 2);
        }
        return [i1, i2, inc];
    }
    function scaleLinear() {
        let domain = [0, 1];
        let range = [0, 1];
        function scale(x) {
            const d0 = domain[0];
            const d1 = domain[1];
            const r0 = range[0];
            const r1 = range[1];
            return r0 + (r1 - r0) * (d0 === d1 ? 0.5 : (x - d0) / (d1 - d0));
        }
        function setDomain(newDomain) {
            if (newDomain === undefined) {
                return domain.slice();
            }
            domain = newDomain;
            return scale;
        }
        scale.domain = setDomain;
        function setRange(newRange) {
            if (newRange === undefined) {
                return range.slice();
            }
            range = newRange;
            return scale;
        }
        scale.range = setRange;
        scale.invert = function (y) {
            const d0 = domain[0];
            const d1 = domain[1];
            const r0 = range[0];
            const r1 = range[1];
            return d0 + (d1 - d0) * ((y - r0) / (r1 - r0));
        };
        scale.copy = function () {
            return scaleLinear().domain(domain).range(range);
        };
        scale.ticks = function (count = 10) {
            const d0 = domain[0];
            const d1 = domain[1];
            if (count <= 0) {
                return [];
            }
            if (d0 === d1) {
                return [d0];
            }
            const reverse = d1 < d0;
            const spec = reverse ? tickSpec(d1, d0, count) : tickSpec(d0, d1, count);
            const i1 = spec[0];
            const i2 = spec[1];
            const inc = spec[2];
            if (!(i2 >= i1)) {
                return [];
            }
            const n = i2 - i1 + 1;
            const ticks = new Array(n);
            for (let i = 0; i < n; ++i) {
                const index = reverse ? i2 - i : i1 + i;
                ticks[i] = inc < 0 ? index / -inc : index * inc;
            }
            return ticks;
        };
        return scale;
    }

    function chebyshevPolynomial(x, a, n) {
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
        if (r > 0.5) {
            r = 1 - r;
        }
        else if (r < -0.5) {
            r = -1 - r;
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
        if (x < 94906265.62425156) {
            const tmp = 10 / x;
            return chebyshevPolynomial(tmp * tmp * 2 - 1, algmcs, 5) / x;
        }
        return 1 / (x * 12);
    }

    const LOG_TWO_PI = 1.837877066409345483560659472811;
    const LOG_SQRT_TWO_PI = 0.918938533204672741780329736406;
    const LOG_SQRT_PI_DIV_2 = 0.225791352644727432363097614947;
    const EULER = 0.5772156649015328606065120900824024;
    const DBL_MIN = 2.2250738585072014e-308;
    const SQRT_TWO_PI = 2.50662827463100050241576528481104525301;
    const TWO_PI = 6.283185307179586476925286766559;
    const SQRT_THIRTY_TWO = 5.656854249492380195206754896838;
    const ONE_DIV_SQRT_TWO_PI = 0.398942280401432677939946059934;

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
        if (y > 2.5327372760800758e305) {
            return Number.POSITIVE_INFINITY;
        }
        if (x > 0) {
            if (x > 1e17) {
                return x * (Math.log(x) - 1);
            }
            return LOG_SQRT_TWO_PI + (x - 0.5) * Math.log(x) - x
                + ((x > 4934720) ? 0 : lgammaCorrection(x));
        }
        return LOG_SQRT_PI_DIV_2 + (x - 0.5) * Math.log(y)
            - x - Math.log(Math.abs(sinpi(y))) - lgammaCorrection(y);
    }

    function ldexp(x, exp) {
        return x * Math.pow(2, exp);
    }

    function logcf(x, i, d, eps) {
        let c1 = 2 * d;
        let c2 = i + d;
        let c4 = c2 + d;
        let a1 = c2;
        let b1 = i * (c2 - i * x);
        let b2 = d * d * x;
        let a2 = c4 * c2 - b2;
        const scalefactor = 2 ** 256;
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
        const minLog1Value = -0.79149064;
        if (x > 1 || x < minLog1Value) {
            return Math.log1p(x) - x;
        }
        const r = x / (2 + x);
        const y = r * r;
        if (Math.abs(x) < 1e-2) {
            return r * ((((2 / 9 * y + 2 / 7) * y + 2 / 5) * y + 2 / 3) * y - x);
        }
        const tol_logcf = 1e-14;
        return r * (2 * y * logcf(y, 3, 2, tol_logcf) - x);
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
            return lgamma1p(n) - (n + 0.5) * Math.log(n) + n - LOG_SQRT_TWO_PI;
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
        let total = s_coeffs[start_coeff];
        for (let i = start_coeff - 1; i >= 0; i--) {
            total = s_coeffs[i] - total / nn;
        }
        return total / n;
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
        if (Number.isNaN(x)) {
            return Number.NaN;
        }
        if (x === 0 || (x < 0 && x === Math.trunc(x))) {
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
            if (n === 0) {
                return value;
            }
            if (n < 0) {
                if (y < 2.2474362225598545e-308) {
                    return x < 0 ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
                }
                n *= -1;
                for (let i = 0; i < n; i++) {
                    value /= (x + i);
                }
                return value;
            }
            for (let i = 1; i <= n; i++) {
                value *= (y + i);
            }
            return value;
        }
        if (x > 171.61447887182298) {
            return Number.POSITIVE_INFINITY;
        }
        if (x < -170.5674972726612) {
            return 0;
        }
        if (y <= 50 && y === Math.trunc(y)) {
            value = 1;
            for (let i = 2; i < y; i++) {
                value *= i;
            }
        }
        else {
            const two_y = 2 * y;
            value = Math.exp((y - 0.5) * Math.log(y) - y + LOG_SQRT_TWO_PI
                + ((two_y === Math.trunc(two_y)) ? stirlingError(y) : lgammaCorrection(y)));
        }
        if (x > 0) {
            return value;
        }
        const sinpiy = sinpi(y);
        return (sinpiy === 0) ? Number.POSITIVE_INFINITY : -Math.PI / (y * sinpiy * value);
    }

    function calculateTrendLine(values) {
        const n = values.length;
        if (n < 2) {
            return values.slice();
        }
        let sumY = 0;
        let sumX = 0;
        let sumXY = 0;
        let sumX2 = 0;
        for (let i = 0; i < n; i++) {
            const x = i + 1;
            const y = values[i];
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        }
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        const trendLine = new Array(n);
        for (let i = 0; i < n; i++) {
            trendLine[i] = slope * (i + 1) + intercept;
        }
        return trendLine;
    }

    function logC4(sampleSize) {
        const a = (sampleSize - 1) / 2;
        if (a < 10) {
            return lgamma(a + 0.5) - lgamma(a) - 0.5 * Math.log(a);
        }
        return a * log1pmx(0.5 / a) + lgammaCorrection(a + 0.5) - lgammaCorrection(a);
    }
    function c4(sampleSize) {
        return Math.exp(logC4(sampleSize));
    }
    function c5(sampleSize) {
        return Math.sqrt(-Math.expm1(2 * logC4(sampleSize)));
    }
    function a3(sampleSize) {
        return 3.0 / (c4(sampleSize) * Math.sqrt(sampleSize));
    }

    function normalCDFImpl(x, lower_tail, log_p) {
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
        let xden;
        let xnum;
        let temp;
        let del;
        let xsq;
        let i;
        const eps = Number.EPSILON * 0.5;
        const lower = lower_tail;
        const upper = !lower_tail;
        let cum = 0;
        let ccum = 0;
        const y = Math.abs(x);
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
            return Number.NaN;
        }
        if (!Number.isFinite(x) && mu === x) {
            return Number.NaN;
        }
        const zeroBoundLower = (lower_tail ? (log_p ? Number.NEGATIVE_INFINITY : 0) : (log_p ? 0 : 1));
        const zeroBoundUpper = (lower_tail ? (log_p ? 0 : 1) : (log_p ? Number.NEGATIVE_INFINITY : 0));
        if (sigma < 0) {
            return Number.NaN;
        }
        if (sigma === 0) {
            return (x < mu) ? zeroBoundLower : zeroBoundUpper;
        }
        const p = (x - mu) / sigma;
        if (!Number.isFinite(p)) {
            return (x < mu) ? zeroBoundLower : zeroBoundUpper;
        }
        return normalCDFImpl(p, lower_tail, log_p);
    }

    function normalDensity(x, mu, sigma, log_p = false) {
        if (Number.isNaN(x) || Number.isNaN(mu) || Number.isNaN(sigma) || sigma < 0) {
            return Number.NaN;
        }
        const zeroBound = log_p ? Number.NEGATIVE_INFINITY : 0;
        if (!Number.isFinite(sigma)) {
            return zeroBound;
        }
        if (!Number.isFinite(x) && mu === x) {
            return Number.NaN;
        }
        if (sigma === 0) {
            return (x === mu) ? Number.POSITIVE_INFINITY : zeroBound;
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
        const x1 = ldexp(Math.trunc(ldexp(absZ, 16)), -16);
        const x2 = absZ - x1;
        return ONE_DIV_SQRT_TWO_PI / sigma
            * (Math.exp(-0.5 * x1 * x1) * Math.exp((-0.5 * x2 - x1) * x2));
    }

    function quantileBoundary(p, lower_tail, log_p, atZero, atOne) {
        if (log_p) {
            if (p > 0) {
                return Number.NaN;
            }
            if (p === 0) {
                return lower_tail ? atOne : atZero;
            }
            if (p === Number.NEGATIVE_INFINITY) {
                return lower_tail ? atZero : atOne;
            }
            return undefined;
        }
        if (p < 0 || p > 1) {
            return Number.NaN;
        }
        if (p === 0) {
            return lower_tail ? atZero : atOne;
        }
        if (p === 1) {
            return lower_tail ? atOne : atZero;
        }
        return undefined;
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
        let r;
        let val;
        if (Number.isNaN(p) || Number.isNaN(mu) || Number.isNaN(sigma)) {
            return Number.NaN;
        }
        const boundary = quantileBoundary(p, lower_tail, log_p, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        if (boundary !== undefined) {
            return boundary;
        }
        if (sigma < 0) {
            return Number.NaN;
        }
        if (sigma === 0) {
            return mu;
        }
        const p_ = log_p ? (lower_tail ? Math.exp(p) : -Math.expm1(p))
            : (lower_tail ? p : (0.5 - p + 0.5));
        const q = p_ - 0.5;
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

    function frexp(value) {
        const data = new DataView(new ArrayBuffer(8));
        data.setFloat64(0, value);
        let bits = (data.getUint32(0) >>> 20) & 0x7FF;
        let adjust = 0;
        if (bits === 0) {
            data.setFloat64(0, value * Math.pow(2, 64));
            bits = (data.getUint32(0) >>> 20) & 0x7FF;
            adjust = 64;
        }
        const exponent = bits - 1022 - adjust;
        data.setUint32(0, (data.getUint32(0) & 0x800FFFFF) | (1022 << 20));
        return { mantissa: data.getFloat64(0), exponent: exponent };
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
    function addHighLow(acc, d) {
        const d1 = Math.floor(d + 0.5);
        acc.yh += d1;
        acc.yl += d - d1;
    }
    function binomialDeviance(x, M) {
        const Sb = 10;
        const S = 1 << Sb;
        const N = 128;
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
        const reduced = frexp(M / x);
        const r = reduced.mantissa;
        const e = reduced.exponent;
        if (Math.LN2 * -e > 1 + Number.MAX_VALUE / x) {
            return { yh: Number.POSITIVE_INFINITY, yl: 0 };
        }
        const i = Math.floor((r - 0.5) * (2 * N) + 0.5);
        const f = Math.floor(S / (0.5 + i / (2.0 * N)) + 0.5);
        const fg = ldexp(f, -(e + Sb));
        if (fg === Number.POSITIVE_INFINITY) {
            return { yh: Number.POSITIVE_INFINITY, yl: 0 };
        }
        const dev = { yh: 0, yl: 0 };
        addHighLow(dev, -x * log1pmx((M * fg - x) / x));
        if (fg === 1) {
            return dev;
        }
        for (let j = 0; j < 4; j++) {
            addHighLow(dev, x * bd0_scale[i][j]);
            addHighLow(dev, -x * bd0_scale[0][j] * e);
            if (!Number.isFinite(dev.yh)) {
                return { yh: Number.POSITIVE_INFINITY, yl: 0 };
            }
        }
        addHighLow(dev, M);
        addHighLow(dev, -M * fg);
        return dev;
    }

    function poissonDensity(x, lambda, log_p) {
        const zeroBound = log_p ? Number.NEGATIVE_INFINITY : 0;
        if (lambda === 0) {
            return (x === 0) ? (log_p ? 0 : 1) : zeroBound;
        }
        if (!Number.isFinite(lambda) || x < 0) {
            return zeroBound;
        }
        if (x <= lambda * DBL_MIN) {
            return log_p ? -lambda : Math.exp(-lambda);
        }
        if (lambda < x * DBL_MIN) {
            if (!Number.isFinite(x)) {
                return zeroBound;
            }
            const rtn = -lambda + x * Math.log(lambda) - lgamma1p(x);
            return log_p ? rtn : Math.exp(rtn);
        }
        const dev = binomialDeviance(x, lambda);
        const yh = dev.yh;
        const yl = dev.yl + stirlingError(x);
        const Lrg_x = (x >= 2.86111748575702815380240589208115399625e307);
        const r = Lrg_x ? SQRT_TWO_PI * Math.sqrt(x)
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
        const M_cutoff = 3.196577161300664E18;
        if (lambda > Math.abs(x_plus_1 - 1) * M_cutoff) {
            const rtn = -lambda - lgamma(x_plus_1);
            return log_p ? rtn : Math.exp(rtn);
        }
        const d = poissonDensity(x_plus_1, lambda, log_p);
        return log_p ? d + Math.log(x_plus_1 / lambda) : d * (x_plus_1 / lambda);
    }

    function gammaContFrac(y, d) {
        if (y === 0) {
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
        const scalefactor = 2 ** 256;
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
        let elfb;
        let elfb_term;
        let res12;
        let res1_term;
        let res1_ig;
        let res2_term;
        let res2_ig;
        let s2pt;
        let i;
        const dfm = lambda - x;
        const pt_ = -log1pmx(dfm / x);
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
        const f = res12 / elfb;
        const np = normalCDF(s2pt, 0, 1, !lower_tail, log_p);
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
                const x2 = s2pt * s2pt;
                let i = 1;
                while (Math.abs(term) > Number.EPSILON * sum) {
                    term *= -i / x2;
                    sum += term;
                    i += 2;
                }
                n_d_over_p = 1 / sum;
            }
            else {
                const d = normalDensity(s2pt, 0, 1, false);
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
            let sum = 0;
            let c = alph;
            let n = 0;
            let term = 1;
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
                    const f1m1 = sum;
                    const f2m1 = Math.expm1(lf2);
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
                if (y !== Math.floor(y)) {
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
        if (!log_p && res < DBL_MIN / Number.EPSILON) {
            return Math.exp(gammaCDFImpl(x, alph, lower_tail, true));
        }
        return res;
    }

    function gammaCDF(x, alpha, scale, lower_tail = true, log_p = false) {
        if (Number.isNaN(x) || Number.isNaN(alpha) || Number.isNaN(scale) || alpha < 0 || scale <= 0) {
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

    function gammaDensity(x, shape, scale, log_p) {
        if (Number.isNaN(x) || Number.isNaN(shape) || Number.isNaN(scale) || shape < 0 || scale <= 0) {
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
        }
        let p_;
        if (x === 0) {
            const _1_p = 1. + 1e-7;
            const _1_m = 1. - 1e-7;
            x = DBL_MIN;
            p_ = gammaCDF(x, alpha, scale, lower_tail, true);
            if ((lower_tail && p_ > p * _1_p) || (!lower_tail && p_ < p * _1_m)) {
                return 0;
            }
        }
        else {
            p_ = gammaCDF(x, alpha, scale, lower_tail, true);
        }
        if (p_ === Number.NEGATIVE_INFINITY) {
            return 0;
        }
        for (let i = 1; i <= max_it_Newton; i++) {
            const p1 = p_ - p;
            if (Math.abs(p1) < Math.abs(EPS_N * p)) {
                break;
            }
            const g = gammaDensity(x, alpha, scale, true);
            if (g === Number.NEGATIVE_INFINITY) {
                break;
            }
            let t = p1 * Math.exp(p_ - g);
            t = lower_tail ? x - t : x + t;
            p_ = gammaCDF(t, alpha, scale, lower_tail, true);
            const absDiff = Math.abs(p_ - p);
            const absP1 = Math.abs(p1);
            if (absDiff > absP1 || (i > 1 && absDiff === absP1)) {
                break;
            }
            x = t;
        }
        return x;
    }

    function logP(p, lower_tail, log_p) {
        if (lower_tail) {
            return log_p ? p : Math.log(p);
        }
        return log_p ? log1mExp(p) : Math.log1p(-p);
    }

    function chisqQuantileApprox(p, nu, g, lower_tail = true, log_p = false, tol) {
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
        let p2;
        let q = 0;
        let t;
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
            return Number.NaN;
        }
        const boundary = quantileBoundary(p, lower_tail, log_p, 0, Number.POSITIVE_INFINITY);
        if (boundary !== undefined) {
            return boundary;
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

    function chisqCDF(x, df, lower_tail = true, log_p = false) {
        return gammaCDF(x, 0.5 * df, 2.0, lower_tail, log_p);
    }

    function chisqQuantile(p, df, lower_tail = true, log_p = false) {
        return gammaQuantile(p, 0.5 * df, 2.0, lower_tail, log_p);
    }

    function quantile(sorted, q) {
        if (sorted.length === 0 || !(q >= 0 && q <= 1)) {
            return NaN;
        }
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

    function buildFormattingModel(schema, values) {
        const settingsValues = values;
        const cards = [];
        const names = Object.keys(schema);
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const definition = schema[name];
            const groups = [];
            const descriptors = [];
            const groupNames = Object.keys(definition.settingsGroups);
            const values = settingsValues[name];
            for (let j = 0; j < groupNames.length; j++) {
                const groupName = groupNames[j];
                const definitions = definition.settingsGroups[groupName];
                const settingNames = Object.keys(definitions);
                const slices = [];
                for (let k = 0; k < settingNames.length; k++) {
                    const settingName = settingNames[k];
                    const setting = definitions[settingName];
                    descriptors.push({ objectName: name, propertyName: settingName });
                    const descriptor = { objectName: name, propertyName: settingName };
                    descriptor.selector = { data: [{ dataViewWildcard: { matchingOption: 0 } }] };
                    if (setting.type !== FormattingComponent.ToggleSwitch) {
                        descriptor.instanceKind = 3;
                    }
                    const value = values[settingName];
                    const control = { type: setting.type, properties: { descriptor, value } };
                    if (setting.type === FormattingComponent.ColorPicker) {
                        if (typeof value !== "string") {
                            throw new Error(`Missing colour for ${name}.${settingName}`);
                        }
                        control.properties.value = { value };
                    }
                    else if (setting.type === FormattingComponent.Dropdown && setting.items !== undefined) {
                        control.properties.items = setting.items;
                        control.properties.value = undefined;
                        for (let l = 0; l < setting.items.length; l++) {
                            if (setting.items[l].value === value) {
                                control.properties.value = setting.items[l];
                                break;
                            }
                        }
                    }
                    if (setting.options !== undefined) {
                        control.properties.options = setting.options;
                    }
                    slices.push({
                        uid: name + "_" + groupName + "_" + settingName + "_slice_uid",
                        displayName: setting.displayName,
                        infoIconText: setting.description,
                        control
                    });
                }
                groups.push({
                    displayName: groupDisplayName(definition, groupName),
                    uid: name + "_" + groupName + "_uid",
                    slices
                });
            }
            cards.push({
                description: definition.description,
                displayName: definition.displayName,
                uid: name + "_card_uid",
                groups,
                revertToDefaultDescriptors: descriptors
            });
        }
        return { cards };
    }

    function readValue(raw, defaultValue, type) {
        if (raw == null || (raw === "" && type !== FormattingComponent.TextInput)) {
            return defaultValue;
        }
        if (typeof raw === "object" && "solid" in raw) {
            const solid = raw.solid;
            return typeof solid === "object" && solid !== null && "color" in solid ? solid.color : undefined;
        }
        return raw;
    }
    function validationMessage(value, definition, name) {
        if (value === undefined && definition.default === undefined) {
            return "";
        }
        const expected = definition.type === FormattingComponent.NumUpDown ? "number"
            : definition.type === FormattingComponent.ToggleSwitch ? "boolean" : "string";
        if (typeof value !== expected) {
            return `${String(value)} is not a valid ${expected} for ${name}`;
        }
        if (definition.valid !== undefined) {
            let valid = false;
            for (let i = 0; i < definition.valid.length; i++) {
                if (definition.valid[i] === value) {
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                return `${String(value)} is not a valid value for ${name}. Valid values are: ${definition.valid.join(", ")}`;
            }
        }
        if (typeof value === "number") {
            const min = definition.options?.minValue?.value;
            const max = definition.options?.maxValue?.value;
            const belowMin = min !== undefined && (definition.exclusiveMin ? value <= min : value < min);
            const aboveMax = max !== undefined && (definition.exclusiveMax ? value >= max : value > max);
            if (!Number.isFinite(value) || belowMin || aboveMax || (definition.integer && !Number.isInteger(value))) {
                return `${value} is not a valid value for ${name}. Valid values are ${describeRange(definition, definition.integer ? "whole numbers" : "numbers")}`;
            }
        }
        return "";
    }
    function readSettingsRows(cardSchema, cardName, defaults, category, rawRowIndices) {
        const defaultValues = defaults;
        const groups = Object.keys(cardSchema.settingsGroups);
        const entries = [];
        for (let i = 0; i < groups.length; i++) {
            const definitions = cardSchema.settingsGroups[groups[i]];
            const names = Object.keys(definitions);
            for (let j = 0; j < names.length; j++) {
                const name = names[j];
                entries.push({ name, definition: definitions[name], defaultValue: defaultValues[name] });
            }
        }
        const values = new Array(rawRowIndices.length);
        const messages = new Array(rawRowIndices.length);
        let anyValid = false;
        let firstMessage;
        let defaultRow;
        for (let i = 0; i < rawRowIndices.length; i++) {
            const objects = category.objects?.[rawRowIndices[i]]?.[cardName];
            if (objects == null && defaultRow !== undefined) {
                values[i] = defaultRow.values;
                messages[i] = defaultRow.messages;
                anyValid || (anyValid = defaultRow.messages.length === 0);
                continue;
            }
            const row = {};
            const rowMessages = [];
            for (let j = 0; j < entries.length; j++) {
                const name = entries[j].name;
                const definition = entries[j].definition;
                const defaultValue = entries[j].defaultValue;
                let value = readValue(objects?.[name], defaultValue, definition.type);
                const message = validationMessage(value, definition, name);
                if (message !== "") {
                    rowMessages.push(message);
                    firstMessage ?? (firstMessage = message);
                    value = defaultValue;
                }
                row[name] = value;
            }
            values[i] = row;
            messages[i] = rowMessages;
            anyValid || (anyValid = rowMessages.length === 0);
            if (objects == null) {
                defaultRow = { values: values[i], messages: rowMessages };
            }
        }
        return { values, validation: !anyValid && firstMessage !== undefined
                ? { status: 1, messages, error: firstMessage } : { status: 0, messages } };
    }

    function readSettingsGroups(schema, category, groups, rules = []) {
        const rawRows = [];
        const firstPositions = new Array(groups.length);
        const messagePositionByRowIndex = new Map();
        for (let i = 0; i < groups.length; i++) {
            const rows = groups[i];
            firstPositions[i] = rawRows.length;
            for (let j = 0; j < rows.length; j++) {
                messagePositionByRowIndex.set(rows[j], rawRows.length);
                rawRows.push(rows[j]);
            }
        }
        const defaults = createDefaultValues(schema);
        const cards = Object.keys(schema);
        const perCard = new Array(cards.length);
        const noMessages = [];
        const messages = new Array(rawRows.length).fill(noMessages);
        let error;
        for (let i = 0; i < cards.length; i++) {
            const result = readSettingsRows(schema[cards[i]], cards[i], defaults[cards[i]], category, rawRows);
            perCard[i] = result;
            for (let j = 0; j < rawRows.length; j++) {
                const row = result.validation.messages[j];
                if (row.length === 0) {
                    continue;
                }
                if (messages[j] === noMessages) {
                    messages[j] = [];
                }
                for (let k = 0; k < row.length; k++) {
                    messages[j].push(row[k]);
                }
            }
            if (result.validation.status !== 0) {
                error = result.validation.error;
            }
        }
        const values = new Array(groups.length);
        const rowValues = new Array(groups.length);
        for (let i = 0; i < groups.length; i++) {
            const position = firstPositions[i];
            const count = groups[i].length;
            const group = {};
            rowValues[i] = new Array(count);
            for (let k = 0; k < count; k++) {
                const row = {};
                for (let c = 0; c < cards.length; c++) {
                    row[cards[c]] = perCard[c].values[position + k];
                }
                rowValues[i][k] = row;
            }
            for (let c = 0; c < cards.length; c++) {
                let chosen = position;
                for (let k = position; k < position + count; k++) {
                    if (perCard[c].validation.messages[k].length === 0) {
                        chosen = k;
                        break;
                    }
                }
                group[cards[c]] = perCard[c].values[chosen];
            }
            values[i] = group;
        }
        let validation = error === undefined ? { status: 0, messages } : { status: 1, messages, error };
        for (let i = 0; validation.status === 0 && i < groups.length; i++) {
            for (let r = 0; validation.status === 0 && r < rules.length; r++) {
                const ruleError = rules[r](values[i], i);
                if (ruleError !== undefined) {
                    validation = { status: 1, messages, error: ruleError };
                }
            }
        }
        return { values, rowValues, validation, messagePositionByRowIndex };
    }

    class SettingsStore {
        constructor(schema, derive, rules = []) {
            this.rowSettings = [];
            this.validationStatus = { status: 0, messages: [] };
            this.messagePositionByRowIndex = new Map();
            this.schema = schema;
            this.derive = derive;
            this.rules = rules;
            this.settings = [createDefaultValues(schema)];
            this.derivedSettings = [derive(this.settings[0])];
        }
        update(category, groups) {
            const result = readSettingsGroups(this.schema, category, groups, this.rules);
            this.settings = result.values;
            this.rowSettings = result.rowValues;
            this.validationStatus = result.validation;
            this.messagePositionByRowIndex = result.messagePositionByRowIndex;
            this.derivedSettings = new Array(result.values.length);
            for (let i = 0; i < result.values.length; i++) {
                this.derivedSettings[i] = this.derive(result.values[i]);
            }
        }
        group(index) {
            return { settings: this.settings[index], derivedSettings: this.derivedSettings[index] };
        }
        getFormattingModel() {
            return buildFormattingModel(this.schema, this.settings[0]);
        }
    }

    function indexColumnsByRole(columns) {
        const result = Object.create(null);
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const roles = column.source.roles;
            if (roles === undefined) {
                continue;
            }
            const names = Object.keys(roles);
            for (let j = 0; j < names.length; j++) {
                const name = names[j];
                if (!roles[name]) {
                    continue;
                }
                (result[name] ?? (result[name] = [])).push(column);
            }
        }
        return result;
    }
    function formatPrimitiveValue(value) {
        return value == null ? undefined : String(value);
    }
    function readNumbers(column, rows) {
        const numbers = new Array(rows.length);
        for (let i = 0; i < rows.length; i++) {
            const value = column.values[rows[i]];
            numbers[i] = value == null || value === "" ? undefined : Number(value);
        }
        return numbers;
    }

    function pad(value) {
        return String(value).padStart(2, "0");
    }
    function dateName(date) {
        const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
            return day;
        }
        return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
    function groupCategoryRows(columns, rowCount) {
        if (columns.length === 0) {
            const rows = new Array(rowCount);
            for (let i = 0; i < rowCount; i++) {
                rows[i] = i;
            }
            return { rows: [rows], names: [[]], keys: ["[]"], labels: [""] };
        }
        const groups = { rows: [], names: [], keys: [], labels: [] };
        const indexes = new Map();
        for (let i = 0; i < rowCount; i++) {
            const parts = new Array(columns.length);
            const names = new Array(columns.length);
            for (let j = 0; j < columns.length; j++) {
                const value = columns[j].values[i];
                names[j] = value instanceof Date ? dateName(value) : formatPrimitiveValue(value) ?? "";
                parts[j] = value == null ? ["undefined", ""]
                    : value instanceof Date ? ["date", String(value.getTime())] : [typeof value, String(value)];
            }
            const key = JSON.stringify(parts);
            let index = indexes.get(key);
            if (index === undefined) {
                index = groups.rows.length;
                indexes.set(key, index);
                groups.rows.push([]);
                groups.names.push(names);
                groups.keys.push(key);
                groups.labels.push(names.join(" / "));
            }
            groups.rows[index].push(i);
        }
        return groups;
    }

    const updateType = {
        data: 2,
        resize: 4,
        viewMode: 8,
        style: 16,
        resizeEnd: 32,
        all: 62
    };
    function combineUpdateTypes(types) {
        let combined = 0;
        for (let i = 0; i < types.length; i++) {
            combined |= types[i];
        }
        return combined;
    }

    function selectedKeys(selected) {
        const keys = new Set();
        for (let i = 0; i < selected.length; i++) {
            keys.add(selected[i].getKey());
        }
        return keys;
    }
    function identitySelected(identity, selected) {
        if ("getKey" in identity) {
            return selected.has(identity.getKey());
        }
        for (let i = 0; i < identity.length; i++) {
            if (selected.has(identity[i].getKey())) {
                return true;
            }
        }
        return false;
    }
    function rowIdentity(host, columns, row) {
        const builder = host.createSelectionIdBuilder();
        for (let i = 0; i < columns.length; i++) {
            builder.withCategory(columns[i], row);
        }
        return builder.createSelectionId();
    }
    function selectionState(manager, anyHighlights) {
        const ids = manager.getSelectionIds();
        return { active: anyHighlights || ids.length > 0, selected: selectedKeys(ids) };
    }

    function readColourPalette(host) {
        const palette = host.colorPalette;
        return {
            isHighContrast: palette.isHighContrast,
            foregroundColour: palette.foreground.value,
            backgroundColour: palette.background.value,
            foregroundSelectedColour: palette.foregroundSelected.value,
            hyperlinkColour: palette.hyperlink.value
        };
    }

    function validateDataView(dataViews, requiredValueRoles) {
        const dataView = dataViews[0];
        if (dataView === undefined) {
            return { status: "empty", error: "No data present" };
        }
        const categorical = dataView.categorical;
        const category = categorical?.categories?.[0];
        if (categorical === undefined || category === undefined) {
            return { status: "invalid", error: "No grouping/ID variable passed!" };
        }
        const categories = indexColumnsByRole(categorical.categories ?? []);
        const key = categories.key;
        if (key === undefined) {
            return { status: "invalid", error: "No grouping/ID variable passed!" };
        }
        const rowCount = key[0].values.length;
        if (rowCount === 0) {
            return { status: "empty", error: "No data present" };
        }
        const values = indexColumnsByRole(categorical.values ?? []);
        for (let i = 0; i < requiredValueRoles.length; i++) {
            if (values[requiredValueRoles[i]] === undefined) {
                return { status: "invalid", error: `No ${requiredValueRoles[i]} passed!` };
            }
        }
        return {
            status: "valid",
            view: {
                dataView,
                categorical,
                category,
                rowCount,
                categories: { ...categories, key },
                values: values
            }
        };
    }

    function readRowAnnotations(sources, rows, kept) {
        const labels = sources.values.labels?.[0];
        const tooltips = sources.values.tooltips ?? [];
        const highlights = sources.categorical.values?.[0]?.highlights;
        const rowSettings = sources.rowSettings;
        const result = {
            labels: new Array(kept.length),
            anyLabels: false,
            highlights: new Array(kept.length),
            anyHighlights: false,
            tooltips: new Array(kept.length),
            scatter_formatting: new Array(kept.length),
            label_formatting: new Array(kept.length)
        };
        for (let k = 0; k < kept.length; k++) {
            const position = kept[k];
            const row = rows[position];
            result.scatter_formatting[k] = rowSettings[position].scatter;
            result.label_formatting[k] = rowSettings[position].labels;
            const label = labels === undefined ? undefined : formatPrimitiveValue(labels.values[row]);
            result.labels[k] = label;
            result.anyLabels || (result.anyLabels = label !== undefined && label !== "");
            const highlight = highlights === undefined ? undefined : highlights[row] ?? undefined;
            result.highlights[k] = highlight;
            result.anyHighlights || (result.anyHighlights = highlight !== undefined);
            const rowTooltips = new Array(tooltips.length);
            for (let j = 0; j < tooltips.length; j++) {
                rowTooltips[j] = {
                    displayName: tooltips[j].source.displayName,
                    value: formatPrimitiveValue(tooltips[j].values[row]) ?? ""
                };
            }
            result.tooltips[k] = rowTooltips;
        }
        return result;
    }
    function rowWarnings(groupName, rows, keys, rowMessages, settings) {
        const warnings = [];
        for (let i = 0; i < rows.length; i++) {
            const key = keys[i] ?? "(Blank)";
            if (rowMessages[i] !== "") {
                warnings.push(`${groupName} ${key} removed due to: ${rowMessages[i]}.`);
                continue;
            }
            const position = settings.messagePositionByRowIndex.get(rows[i]);
            const messages = position === undefined ? [] : settings.messages[position];
            for (let j = 0; j < messages.length; j++) {
                warnings.push(`Conditional formatting for ${groupName} ${key} ignored due to: ${messages[j]}.`);
            }
        }
        return warnings;
    }
    function labelledMessage(label, message) {
        if (label === "") {
            return message;
        }
        const lines = message.split("\n");
        for (let i = 0; i < lines.length; i++) {
            lines[i] = `${label}: ${lines[i]}`;
        }
        return lines.join("\n");
    }

    function extractRows(view, rows, options) {
        const validation = options.validation;
        if (validation.status !== 0) {
            return { status: "invalid", error: validation.error };
        }
        const kept = validation.kept;
        const annotations = readRowAnnotations({ categorical: view.categorical, values: view.values, rowSettings: options.rowSettings }, rows, kept);
        return {
            status: "valid",
            data: {
                ...annotations,
                identityColumns: [...view.categories.key, ...(view.categories.indicator ?? [])],
                validationStatus: validation,
                kept,
                warnings: rowWarnings(view.category.source.displayName, rows, options.keys, validation.messages, options.settings)
            }
        };
    }

    function valueTooltips(settings, row, automaticLabel, format) {
        const tooltip = [];
        if (settings.ttip_show_value) {
            tooltip.push({
                displayName: settings.ttip_label_value === "Automatic" ? automaticLabel : settings.ttip_label_value,
                value: format(row.value, "value")
            });
        }
        if (settings.ttip_show_numerator && !isNullOrUndefined(row.numerator)) {
            tooltip.push({ displayName: settings.ttip_label_numerator, value: format(row.numerator, "input") });
        }
        if (settings.ttip_show_denominator && !isNullOrUndefined(row.denominator)) {
            tooltip.push({ displayName: settings.ttip_label_denominator, value: format(row.denominator, "input") });
        }
        return tooltip;
    }
    function limitTooltips(settings, row, format, controlLimits) {
        const tooltip = [];
        const levels = ["99", "95", "68"];
        const limit = (level, side) => {
            if (controlLimits && settings[`ttip_show_${level}`] && settings[`show_${level}`]) {
                const name = `${side === "upper" ? "ul" : "ll"}${level}`;
                tooltip.push({
                    displayName: `${settings[`ttip_label_${level}_prefix_${side}`]}${settings[`ttip_label_${level}`]}`,
                    value: format(row[name], "value")
                });
            }
        };
        for (let i = 0; i < levels.length; i++) {
            limit(levels[i], "upper");
        }
        if (settings.show_target && settings.ttip_show_target) {
            tooltip.push({ displayName: settings.ttip_label_target, value: format(row.target, "value") });
        }
        if (settings.show_alt_target && settings.ttip_show_alt_target && !isNullOrUndefined(row.alt_target)) {
            tooltip.push({ displayName: settings.ttip_label_alt_target, value: format(row.alt_target, "value") });
        }
        for (let i = levels.length - 1; i >= 0; i--) {
            limit(levels[i], "lower");
        }
        return tooltip;
    }
    function appendPatternTooltips(tooltip, patterns, custom) {
        if (patterns.length > 0) {
            tooltip.push({ displayName: "Pattern(s)", value: patterns.join("\n") });
        }
        for (let i = 0; i < custom.length; i++) {
            tooltip.push(custom[i]);
        }
    }

    function labelGeometry(label, pointX, pointY, plotHeight, bottomPadding) {
        const aesthetics = label.aesthetics;
        const top = aesthetics.label_position === "top";
        const label_direction_mult = top ? -1 : 1;
        const xAxisHeight = plotHeight - bottomPadding;
        const y_offset = aesthetics.label_y_offset;
        const label_initial = top ? (0 + y_offset) : (xAxisHeight - y_offset);
        let side_length = top ? (pointY - label_initial) : (label_initial - pointY);
        const theta = label.angle ?? (aesthetics.label_angle_offset + label_direction_mult * 90);
        side_length = label.distance ?? (Math.min(side_length, aesthetics.label_line_max_length));
        let line_offset = aesthetics.label_line_offset;
        line_offset = top ? line_offset : -(line_offset + aesthetics.label_size / 2);
        let marker_offset = aesthetics.label_marker_offset + aesthetics.label_size / 2;
        marker_offset = top ? -marker_offset : marker_offset;
        const x = pointX + side_length * Math.cos(theta * Math.PI / 180);
        const y = pointY + side_length * Math.sin(theta * Math.PI / 180);
        return {
            x,
            y,
            theta,
            line_offset,
            marker_offset
        };
    }

    const SQRT3 = Math.sqrt(3);
    const TAU = 2 * Math.PI;
    const STAR_KA = 0.8908130915292852;
    const STAR_KR = Math.sin(Math.PI / 10) / Math.sin(7 * Math.PI / 10);
    const STAR_KX = Math.sin(TAU / 10) * STAR_KR;
    const STAR_KY = -Math.cos(TAU / 10) * STAR_KR;
    const WYE_K = 1 / Math.sqrt(12);
    const WYE_A = (WYE_K / 2 + 1) * 3;
    const WYE_C = -0.5;
    const WYE_S = SQRT3 / 2;
    const DIAMOND_TAN30 = Math.sqrt(1 / 3);
    function round3(value) {
        return Math.round(value * 1000) / 1000;
    }
    function polygon(vertices) {
        let path = `M${round3(vertices[0])},${round3(vertices[1])}`;
        for (let i = 2; i < vertices.length; i += 2) {
            path += `L${round3(vertices[i])},${round3(vertices[i + 1])}`;
        }
        return path + "Z";
    }
    function circlePath(size) {
        const r = Math.sqrt(size / Math.PI);
        if (r === 0) {
            return "M0,0";
        }
        return `M${round3(r)},0A${round3(r)},${round3(r)},0,1,1,${round3(-r)},0A${round3(r)},${round3(r)},0,1,1,${round3(r)},0`;
    }
    function crossPath(size) {
        const r = Math.sqrt(size / 5) / 2;
        return polygon([-3 * r, -r, -r, -r, -r, -3 * r, r, -3 * r, r, -r, 3 * r, -r, 3 * r, r, r, r, r, 3 * r, -r, 3 * r, -r, r, -3 * r, r]);
    }
    function diamondPath(size) {
        const y = Math.sqrt(size / (DIAMOND_TAN30 * 2));
        const x = y * DIAMOND_TAN30;
        return polygon([0, -y, x, 0, 0, y, -x, 0]);
    }
    function squarePath(size) {
        const w = Math.sqrt(size);
        const x = -w / 2;
        return `M${round3(x)},${round3(x)}h${round3(w)}v${round3(w)}h${round3(-w)}Z`;
    }
    function starPath(size) {
        const r = Math.sqrt(size * STAR_KA);
        const x = STAR_KX * r;
        const y = STAR_KY * r;
        const vertices = [0, -r, x, y];
        for (let i = 1; i < 5; i++) {
            const a = TAU * i / 5;
            const c = Math.cos(a);
            const s = Math.sin(a);
            vertices.push(s * r, -c * r, c * x - s * y, s * x + c * y);
        }
        return polygon(vertices);
    }
    function trianglePath(size) {
        const y = -Math.sqrt(size / (SQRT3 * 3));
        return polygon([0, y * 2, -SQRT3 * y, -y, SQRT3 * y, -y]);
    }
    function wyePath(size) {
        const r = Math.sqrt(size / WYE_A);
        const x0 = r / 2;
        const y0 = r * WYE_K;
        const x1 = x0;
        const y1 = r * WYE_K + r;
        const x2 = -x1;
        const y2 = y1;
        return polygon([
            x0, y0,
            x1, y1,
            x2, y2,
            WYE_C * x0 - WYE_S * y0, WYE_S * x0 + WYE_C * y0,
            WYE_C * x1 - WYE_S * y1, WYE_S * x1 + WYE_C * y1,
            WYE_C * x2 - WYE_S * y2, WYE_S * x2 + WYE_C * y2,
            WYE_C * x0 + WYE_S * y0, WYE_C * y0 - WYE_S * x0,
            WYE_C * x1 + WYE_S * y1, WYE_C * y1 - WYE_S * x1,
            WYE_C * x2 + WYE_S * y2, WYE_C * y2 - WYE_S * x2
        ]);
    }
    const SYMBOLS = {
        Circle: circlePath,
        Cross: crossPath,
        Diamond: diamondPath,
        Square: squarePath,
        Star: starPath,
        Triangle: trianglePath,
        Wye: wyePath
    };
    function symbolPath(shape, size) {
        return SYMBOLS[shape](size);
    }

    function screenToSvg(svg, clientX, clientY) {
        const point = svg.createSVGPoint();
        point.x = clientX;
        point.y = clientY;
        const ctm = svg.getScreenCTM();
        if (ctm === null) {
            return { x: 0, y: 0 };
        }
        const transformed = point.matrixTransform(ctm.inverse());
        return { x: transformed.x, y: transformed.y };
    }

    const SVG_NS = "http://www.w3.org/2000/svg";

    function append(parent, tag) {
        const element = parent.ownerDocument.createElementNS(SVG_NS, tag);
        parent.appendChild(element);
        return element;
    }
    function drawValueLabels(svg, options) {
        let container = svg.querySelector(".text-labels");
        if (!options.visible) {
            container?.remove();
            return;
        }
        if (container === null) {
            container = append(svg, "g");
            container.classList.add("text-labels");
        }
        container.replaceChildren();
        const points = options.points;
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const text = point.label.text_value ?? "";
            if (text === "") {
                continue;
            }
            const pointX = options.xScale(point.x);
            const pointY = options.yScale(point.value);
            const geometry = labelGeometry(point.label, pointX, pointY, options.plotHeight, options.bottomPadding);
            const aesthetics = point.label.aesthetics;
            const top = aesthetics.label_position === "top";
            const angle = geometry.theta - (top ? 180 : 0);
            const radians = angle * Math.PI / 180;
            const group = append(container, "g");
            group.classList.add("text-group-inner");
            const textElement = append(group, "text");
            const lineElement = append(group, "line");
            const pathElement = aesthetics.label_marker_show ? append(group, "path") : undefined;
            textElement.setAttribute("x", String(geometry.x));
            textElement.setAttribute("y", String(geometry.y));
            textElement.textContent = text;
            textElement.style.setProperty("text-anchor", "middle");
            textElement.style.setProperty("font-size", `${aesthetics.label_size}px`);
            textElement.style.setProperty("font-family", aesthetics.label_font);
            textElement.style.setProperty("fill", aesthetics.label_colour);
            const markerSize = Math.pow(aesthetics.label_marker_size, 2);
            const markerX = pointX + geometry.marker_offset * Math.cos(radians);
            const markerY = pointY + geometry.marker_offset * Math.sin(radians);
            lineElement.setAttribute("x1", String(geometry.x));
            lineElement.setAttribute("y1", String(geometry.y + geometry.line_offset));
            lineElement.setAttribute("x2", String(markerX));
            lineElement.setAttribute("y2", String(markerY));
            lineElement.style.setProperty("stroke", options.line.colour);
            lineElement.style.setProperty("stroke-width", String(options.line.width));
            lineElement.style.setProperty("stroke-dasharray", options.line.type);
            if (pathElement !== undefined) {
                pathElement.setAttribute("d", trianglePath(markerSize));
                pathElement.setAttribute("transform", `translate(${markerX}, ${markerY}) rotate(${angle + (top ? 90 : 270)})`);
                pathElement.style.setProperty("fill", aesthetics.label_marker_colour);
                pathElement.style.setProperty("stroke", aesthetics.label_marker_outline_colour);
            }
            if (!options.interactive) {
                continue;
            }
            const dragMarkerOffset = aesthetics.label_marker_offset + aesthetics.label_size / 2;
            group.style.setProperty("touch-action", "none");
            let dragged = false;
            group.addEventListener("click", (event) => {
                if (dragged) {
                    event.stopPropagation();
                }
            });
            group.addEventListener("pointerdown", (event) => {
                group.setPointerCapture(event.pointerId);
                dragged = false;
                const onMove = (move) => {
                    dragged = true;
                    const pointer = screenToSvg(svg, move.clientX, move.clientY);
                    const x = pointer.x;
                    const y = pointer.y;
                    const dragAngle = Math.atan2(y - pointY, x - pointX) * 180 / Math.PI;
                    point.label.angle = dragAngle;
                    point.label.distance = Math.sqrt(Math.pow(y - pointY, 2) + Math.pow(x - pointX, 2));
                    const dragRadians = dragAngle * Math.PI / 180;
                    const dragMarkerX = pointX + dragMarkerOffset * Math.cos(dragRadians);
                    const dragMarkerY = pointY + dragMarkerOffset * Math.sin(dragRadians);
                    textElement.setAttribute("x", String(x));
                    textElement.setAttribute("y", String(y));
                    lineElement.setAttribute("x1", String(x));
                    lineElement.setAttribute("y1", String(y + geometry.line_offset));
                    lineElement.setAttribute("x2", String(dragMarkerX));
                    lineElement.setAttribute("y2", String(dragMarkerY));
                    pathElement?.setAttribute("transform", `translate(${dragMarkerX}, ${dragMarkerY}) rotate(${dragAngle - 90})`);
                };
                const onUp = (up) => {
                    group.releasePointerCapture(up.pointerId);
                    group.removeEventListener("pointermove", onMove);
                    group.removeEventListener("pointerup", onUp);
                    group.removeEventListener("pointercancel", onUp);
                };
                group.addEventListener("pointermove", onMove);
                group.addEventListener("pointerup", onUp);
                group.addEventListener("pointercancel", onUp);
            });
        }
    }

    const listeners = new WeakMap();
    function bindContextMenu(root, options) {
        const previous = listeners.get(root);
        if (previous !== undefined) {
            root.removeEventListener("contextmenu", previous);
            listeners.delete(root);
        }
        if (!options.enabled) {
            return;
        }
        const listener = (event) => {
            options.show(options.identity(event.target), { x: event.clientX, y: event.clientY });
            event.preventDefault();
        };
        root.addEventListener("contextmenu", listener);
        listeners.set(root, listener);
    }

    function lineLabelGeometry(label, textHeight) {
        let position = label.position;
        if (position === "outside") {
            position = label.lower ? "below" : "above";
        }
        else if (position === "inside") {
            position = label.lower ? "above" : "below";
        }
        const beside = position === "beside";
        let dy;
        if (position === "above") {
            dy = -1 * label.vpad + -label.lineWidth;
        }
        else if (position === "below") {
            dy = label.vpad + label.size;
        }
        else {
            dy = -1 * label.vpad + textHeight / 4;
        }
        return { anchor: beside ? "start" : "end", dx: (beside ? 1 : -1) * label.hpad, dy };
    }
    function drawLineLabels(group, labels, headless) {
        const children = group.children;
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].tagName === "text") {
                children[i].remove();
            }
        }
        for (let i = 0; i < labels.length; i++) {
            const label = labels[i];
            const text = group.ownerDocument.createElementNS(SVG_NS, "text");
            group.appendChild(text);
            text.textContent = label.text;
            text.setAttribute("x", String(label.x));
            text.setAttribute("y", String(label.y));
            text.setAttribute("fill", label.colour);
            text.setAttribute("font-size", `${label.size}px`);
            text.setAttribute("font-family", label.font);
            const geometry = lineLabelGeometry(label, headless ? label.size : text.getBoundingClientRect().height);
            text.setAttribute("text-anchor", geometry.anchor);
            text.setAttribute("dx", `${geometry.dx}px`);
            text.setAttribute("dy", `${geometry.dy}px`);
        }
    }

    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: xhtml,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace(name) {
      var prefix = name += "", i = prefix.indexOf(":");
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
    }

    function creatorInherit(name) {
      return function() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri === xhtml && document.documentElement.namespaceURI === xhtml
            ? document.createElement(name)
            : document.createElementNS(uri, name);
      };
    }

    function creatorFixed(fullname) {
      return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
      };
    }

    function creator(name) {
      var fullname = namespace(name);
      return (fullname.local
          ? creatorFixed
          : creatorInherit)(fullname);
    }

    function none() {}

    function selector(selector) {
      return selector == null ? none : function() {
        return this.querySelector(selector);
      };
    }

    function selection_select(select) {
      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    // Given something array like (or null), returns something that is strictly an
    // array. This is used to ensure that array-like objects passed to d3.selectAll
    // or selection.selectAll are converted into proper arrays when creating a
    // selection; we don’t ever want to create a selection backed by a live
    // HTMLCollection or NodeList. However, note that selection.selectAll will use a
    // static NodeList as a group, since it safely derived from querySelectorAll.
    function array(x) {
      return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
    }

    function empty() {
      return [];
    }

    function selectorAll(selector) {
      return selector == null ? empty : function() {
        return this.querySelectorAll(selector);
      };
    }

    function arrayAll(select) {
      return function() {
        return array(select.apply(this, arguments));
      };
    }

    function selection_selectAll(select) {
      if (typeof select === "function") select = arrayAll(select);
      else select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
          }
        }
      }

      return new Selection(subgroups, parents);
    }

    function matcher(selector) {
      return function() {
        return this.matches(selector);
      };
    }

    function childMatcher(selector) {
      return function(node) {
        return node.matches(selector);
      };
    }

    var find = Array.prototype.find;

    function childFind(match) {
      return function() {
        return find.call(this.children, match);
      };
    }

    function childFirst() {
      return this.firstElementChild;
    }

    function selection_selectChild(match) {
      return this.select(match == null ? childFirst
          : childFind(typeof match === "function" ? match : childMatcher(match)));
    }

    var filter = Array.prototype.filter;

    function children() {
      return Array.from(this.children);
    }

    function childrenFilter(match) {
      return function() {
        return filter.call(this.children, match);
      };
    }

    function selection_selectChildren(match) {
      return this.selectAll(match == null ? children
          : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
    }

    function selection_filter(match) {
      if (typeof match !== "function") match = matcher(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function sparse(update) {
      return new Array(update.length);
    }

    function selection_enter() {
      return new Selection(this._enter || this._groups.map(sparse), this._parents);
    }

    function EnterNode(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode.prototype = {
      constructor: EnterNode,
      appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
      insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
      querySelector: function(selector) { return this._parent.querySelector(selector); },
      querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
    };

    function constant(x) {
      return function() {
        return x;
      };
    }

    function bindIndex(parent, group, enter, update, exit, data) {
      var i = 0,
          node,
          groupLength = group.length,
          dataLength = data.length;

      // Put any non-null nodes that fit into update.
      // Put any null nodes into enter.
      // Put any remaining data into enter.
      for (; i < dataLength; ++i) {
        if (node = group[i]) {
          node.__data__ = data[i];
          update[i] = node;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Put any non-null nodes that don’t fit into exit.
      for (; i < groupLength; ++i) {
        if (node = group[i]) {
          exit[i] = node;
        }
      }
    }

    function bindKey(parent, group, enter, update, exit, data, key) {
      var i,
          node,
          nodeByKeyValue = new Map,
          groupLength = group.length,
          dataLength = data.length,
          keyValues = new Array(groupLength),
          keyValue;

      // Compute the key for each node.
      // If multiple nodes have the same key, the duplicates are added to exit.
      for (i = 0; i < groupLength; ++i) {
        if (node = group[i]) {
          keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
          if (nodeByKeyValue.has(keyValue)) {
            exit[i] = node;
          } else {
            nodeByKeyValue.set(keyValue, node);
          }
        }
      }

      // Compute the key for each datum.
      // If there a node associated with this key, join and add it to update.
      // If there is not (or the key is a duplicate), add it to enter.
      for (i = 0; i < dataLength; ++i) {
        keyValue = key.call(parent, data[i], i, data) + "";
        if (node = nodeByKeyValue.get(keyValue)) {
          update[i] = node;
          node.__data__ = data[i];
          nodeByKeyValue.delete(keyValue);
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Add any remaining nodes that were not bound to data to exit.
      for (i = 0; i < groupLength; ++i) {
        if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
          exit[i] = node;
        }
      }
    }

    function datum(node) {
      return node.__data__;
    }

    function selection_data(value, key) {
      if (!arguments.length) return Array.from(this, datum);

      var bind = key ? bindKey : bindIndex,
          parents = this._parents,
          groups = this._groups;

      if (typeof value !== "function") value = constant(value);

      for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
        var parent = parents[j],
            group = groups[j],
            groupLength = group.length,
            data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
            dataLength = data.length,
            enterGroup = enter[j] = new Array(dataLength),
            updateGroup = update[j] = new Array(dataLength),
            exitGroup = exit[j] = new Array(groupLength);

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
          if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while (!(next = updateGroup[i1]) && ++i1 < dataLength);
            previous._next = next || null;
          }
        }
      }

      update = new Selection(update, parents);
      update._enter = enter;
      update._exit = exit;
      return update;
    }

    // Given some data, this returns an array-like view of it: an object that
    // exposes a length property and allows numeric indexing. Note that unlike
    // selectAll, this isn’t worried about “live” collections because the resulting
    // array will only be used briefly while data is being bound. (It is possible to
    // cause the data to change while iterating by using a key function, but please
    // don’t; we’d rather avoid a gratuitous copy.)
    function arraylike(data) {
      return typeof data === "object" && "length" in data
        ? data // Array, TypedArray, NodeList, array-like
        : Array.from(data); // Map, Set, iterable, string, or anything else
    }

    function selection_exit() {
      return new Selection(this._exit || this._groups.map(sparse), this._parents);
    }

    function selection_join(onenter, onupdate, onexit) {
      var enter = this.enter(), update = this, exit = this.exit();
      if (typeof onenter === "function") {
        enter = onenter(enter);
        if (enter) enter = enter.selection();
      } else {
        enter = enter.append(onenter + "");
      }
      if (onupdate != null) {
        update = onupdate(update);
        if (update) update = update.selection();
      }
      if (onexit == null) exit.remove(); else onexit(exit);
      return enter && update ? enter.merge(update).order() : update;
    }

    function selection_merge(context) {
      var selection = context.selection ? context.selection() : context;

      for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Selection(merges, this._parents);
    }

    function selection_order() {

      for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
        for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
          if (node = group[i]) {
            if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }

      return this;
    }

    function selection_sort(compare) {
      if (!compare) compare = ascending;

      function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
      }

      for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            sortgroup[i] = node;
          }
        }
        sortgroup.sort(compareNode);
      }

      return new Selection(sortgroups, this._parents).order();
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call() {
      var callback = arguments[0];
      arguments[0] = this;
      callback.apply(null, arguments);
      return this;
    }

    function selection_nodes() {
      return Array.from(this);
    }

    function selection_node() {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
          var node = group[i];
          if (node) return node;
        }
      }

      return null;
    }

    function selection_size() {
      let size = 0;
      for (const node of this) ++size; // eslint-disable-line no-unused-vars
      return size;
    }

    function selection_empty() {
      return !this.node();
    }

    function selection_each(callback) {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
      }

      return this;
    }

    function attrRemove(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant(name, value) {
      return function() {
        this.setAttribute(name, value);
      };
    }

    function attrConstantNS(fullname, value) {
      return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
      };
    }

    function attrFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
      };
    }

    function attrFunctionNS(fullname, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
      };
    }

    function selection_attr(name, value) {
      var fullname = namespace(name);

      if (arguments.length < 2) {
        var node = this.node();
        return fullname.local
            ? node.getAttributeNS(fullname.space, fullname.local)
            : node.getAttribute(fullname);
      }

      return this.each((value == null
          ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
          ? (fullname.local ? attrFunctionNS : attrFunction)
          : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
    }

    function defaultView(node) {
      return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
          || (node.document && node) // node is a Window
          || node.defaultView; // node is a Document
    }

    function styleRemove(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant(name, value, priority) {
      return function() {
        this.style.setProperty(name, value, priority);
      };
    }

    function styleFunction(name, value, priority) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
      };
    }

    function selection_style(name, value, priority) {
      return arguments.length > 1
          ? this.each((value == null
                ? styleRemove : typeof value === "function"
                ? styleFunction
                : styleConstant)(name, value, priority == null ? "" : priority))
          : styleValue(this.node(), name);
    }

    function styleValue(node, name) {
      return node.style.getPropertyValue(name)
          || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
    }

    function propertyRemove(name) {
      return function() {
        delete this[name];
      };
    }

    function propertyConstant(name, value) {
      return function() {
        this[name] = value;
      };
    }

    function propertyFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
      };
    }

    function selection_property(name, value) {
      return arguments.length > 1
          ? this.each((value == null
              ? propertyRemove : typeof value === "function"
              ? propertyFunction
              : propertyConstant)(name, value))
          : this.node()[name];
    }

    function classArray(string) {
      return string.trim().split(/^|\s+/);
    }

    function classList(node) {
      return node.classList || new ClassList(node);
    }

    function ClassList(node) {
      this._node = node;
      this._names = classArray(node.getAttribute("class") || "");
    }

    ClassList.prototype = {
      add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
          this._names.push(name);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
          this._names.splice(i, 1);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      contains: function(name) {
        return this._names.indexOf(name) >= 0;
      }
    };

    function classedAdd(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.add(names[i]);
    }

    function classedRemove(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.remove(names[i]);
    }

    function classedTrue(names) {
      return function() {
        classedAdd(this, names);
      };
    }

    function classedFalse(names) {
      return function() {
        classedRemove(this, names);
      };
    }

    function classedFunction(names, value) {
      return function() {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
      };
    }

    function selection_classed(name, value) {
      var names = classArray(name + "");

      if (arguments.length < 2) {
        var list = classList(this.node()), i = -1, n = names.length;
        while (++i < n) if (!list.contains(names[i])) return false;
        return true;
      }

      return this.each((typeof value === "function"
          ? classedFunction : value
          ? classedTrue
          : classedFalse)(names, value));
    }

    function textRemove() {
      this.textContent = "";
    }

    function textConstant(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      };
    }

    function selection_text(value) {
      return arguments.length
          ? this.each(value == null
              ? textRemove : (typeof value === "function"
              ? textFunction
              : textConstant)(value))
          : this.node().textContent;
    }

    function htmlRemove() {
      this.innerHTML = "";
    }

    function htmlConstant(value) {
      return function() {
        this.innerHTML = value;
      };
    }

    function htmlFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      };
    }

    function selection_html(value) {
      return arguments.length
          ? this.each(value == null
              ? htmlRemove : (typeof value === "function"
              ? htmlFunction
              : htmlConstant)(value))
          : this.node().innerHTML;
    }

    function raise() {
      if (this.nextSibling) this.parentNode.appendChild(this);
    }

    function selection_raise() {
      return this.each(raise);
    }

    function lower() {
      if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower() {
      return this.each(lower);
    }

    function selection_append(name) {
      var create = typeof name === "function" ? name : creator(name);
      return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
      });
    }

    function constantNull() {
      return null;
    }

    function selection_insert(name, before) {
      var create = typeof name === "function" ? name : creator(name),
          select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
      return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
      });
    }

    function remove() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    }

    function selection_remove() {
      return this.each(remove);
    }

    function selection_cloneShallow() {
      var clone = this.cloneNode(false), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_cloneDeep() {
      var clone = this.cloneNode(true), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_clone(deep) {
      return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
    }

    function selection_datum(value) {
      return arguments.length
          ? this.property("__data__", value)
          : this.node().__data__;
    }

    function contextListener(listener) {
      return function(event) {
        listener.call(this, event, this.__data__);
      };
    }

    function parseTypenames(typenames) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {type: t, name: name};
      });
    }

    function onRemove(typename) {
      return function() {
        var on = this.__on;
        if (!on) return;
        for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
          if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.options);
          } else {
            on[++i] = o;
          }
        }
        if (++i) on.length = i;
        else delete this.__on;
      };
    }

    function onAdd(typename, value, options) {
      return function() {
        var on = this.__on, o, listener = contextListener(value);
        if (on) for (var j = 0, m = on.length; j < m; ++j) {
          if ((o = on[j]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.options);
            this.addEventListener(o.type, o.listener = listener, o.options = options);
            o.value = value;
            return;
          }
        }
        this.addEventListener(typename.type, listener, options);
        o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
        if (!on) this.__on = [o];
        else on.push(o);
      };
    }

    function selection_on(typename, value, options) {
      var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

      if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
          for (i = 0, o = on[j]; i < n; ++i) {
            if ((t = typenames[i]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
        return;
      }

      on = value ? onAdd : onRemove;
      for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
      return this;
    }

    function dispatchEvent(node, type, params) {
      var window = defaultView(node),
          event = window.CustomEvent;

      if (typeof event === "function") {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    function dispatchConstant(type, params) {
      return function() {
        return dispatchEvent(this, type, params);
      };
    }

    function dispatchFunction(type, params) {
      return function() {
        return dispatchEvent(this, type, params.apply(this, arguments));
      };
    }

    function selection_dispatch(type, params) {
      return this.each((typeof params === "function"
          ? dispatchFunction
          : dispatchConstant)(type, params));
    }

    function* selection_iterator() {
      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) yield node;
        }
      }
    }

    var root = [null];

    function Selection(groups, parents) {
      this._groups = groups;
      this._parents = parents;
    }

    function selection_selection() {
      return this;
    }

    Selection.prototype = {
      constructor: Selection,
      select: selection_select,
      selectAll: selection_selectAll,
      selectChild: selection_selectChild,
      selectChildren: selection_selectChildren,
      filter: selection_filter,
      data: selection_data,
      enter: selection_enter,
      exit: selection_exit,
      join: selection_join,
      merge: selection_merge,
      selection: selection_selection,
      order: selection_order,
      sort: selection_sort,
      call: selection_call,
      nodes: selection_nodes,
      node: selection_node,
      size: selection_size,
      empty: selection_empty,
      each: selection_each,
      attr: selection_attr,
      style: selection_style,
      property: selection_property,
      classed: selection_classed,
      text: selection_text,
      html: selection_html,
      raise: selection_raise,
      lower: selection_lower,
      append: selection_append,
      insert: selection_insert,
      remove: selection_remove,
      clone: selection_clone,
      datum: selection_datum,
      on: selection_on,
      dispatch: selection_dispatch,
      [Symbol.iterator]: selection_iterator
    };

    function select(selector) {
      return typeof selector === "string"
          ? new Selection([[document.querySelector(selector)]], [document.documentElement])
          : new Selection([[selector]], root);
    }

    function selectAll(selector) {
      return typeof selector === "string"
          ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
          : new Selection([array(selector)], root);
    }

    function initialiseSvg(svg, removeAll = false) {
        const selection = select(svg);
        if (removeAll) {
            selection.selectChildren().remove();
            selection.on(".plot", null);
        }
        selection.append("line").classed("ttip-line-x", true);
        selection.append("line").classed("ttip-line-y", true);
        selection.append("g").classed("gridgroup", true);
        selection.append("g").classed("xaxisgroup", true);
        selection.append("text").classed("xaxislabel", true);
        selection.append("g").classed("yaxisgroup", true);
        selection.append("text").classed("yaxislabel", true);
        selection.append("g").classed("linesgroup", true);
        selection.append("g").classed("dotsgroup", true);
        selection.append("g").classed("marksgroup", true);
    }

    const preambles = {
        internal: "Internal Error! Please file a bug report with the following text:",
        settings: "Invalid settings provided for all observations! First error:"
    };
    function addText(group, x, y, text, colour) {
        const element = group.ownerDocument.createElementNS(SVG_NS, "text");
        group.appendChild(element);
        element.setAttribute("x", String(x));
        element.setAttribute("y", String(y));
        element.style.setProperty("text-anchor", "middle");
        element.textContent = text;
        element.style.setProperty("font-size", "10px");
        element.style.setProperty("fill", colour);
    }
    function drawErrorMessage(svg, options) {
        initialiseSvg(svg, true);
        if (!options.show) {
            return;
        }
        const group = svg.ownerDocument.createElementNS(SVG_NS, "g");
        svg.appendChild(group);
        group.classList.add("errormessage");
        const x = options.width / 2;
        const preamble = options.kind === undefined ? undefined : preambles[options.kind];
        if (preamble !== undefined) {
            addText(group, x, options.height / 3, preamble, options.colour);
        }
        addText(group, x, options.height / 2, options.message, options.colour);
    }

    function setLine(line, x1, x2, y1, y2, colour) {
        line.setAttribute("x1", String(x1));
        line.setAttribute("x2", String(x2));
        line.setAttribute("y1", String(y1));
        line.setAttribute("y2", String(y2));
        line.setAttribute("stroke-width", "1px");
        line.setAttribute("stroke", colour);
        line.style.setProperty("stroke-opacity", "0");
    }
    function drawCrosshairs(options) {
        const vertical = options.vertical;
        const horizontal = options.horizontal;
        setLine(vertical, 0, 0, options.top, options.bottom, options.colour);
        setLine(horizontal, options.left, options.right, 0, 0, options.colour);
        return {
            show: (x, y) => {
                vertical.style.setProperty("stroke-opacity", "0.4");
                vertical.setAttribute("x1", String(x));
                vertical.setAttribute("x2", String(x));
                horizontal.style.setProperty("stroke-opacity", "0.4");
                horizontal.setAttribute("y1", String(y));
                horizontal.setAttribute("y2", String(y));
            },
            hide: () => {
                vertical.style.setProperty("stroke-opacity", "0");
                horizontal.style.setProperty("stroke-opacity", "0");
            }
        };
    }

    function axisLabelPlacement(align, start, end) {
        if (align === "left" || align === "bottom") {
            return { position: start, anchor: "start" };
        }
        if (align === "right" || align === "top") {
            return { position: end, anchor: "end" };
        }
        return { position: (start + end) / 2, anchor: "middle" };
    }
    function xTickLabelOffsets(rotation) {
        if (rotation < 0) {
            return { anchor: "end", dx: "-.8em", dy: "-.15em" };
        }
        if (rotation > 0) {
            return { anchor: "start", dx: ".8em", dy: ".15em" };
        }
        return { anchor: "middle", dx: "0em", dy: ".71em" };
    }
    function axisTitleOffset(side, canvasExtent, labelSize, measurement) {
        if (measurement === undefined) {
            return side === "bottom" ? canvasExtent - labelSize / 2 : labelSize * 1.5;
        }
        const gap = labelSize / 2;
        if (side === "bottom") {
            return measurement.axisEdge + gap - measurement.top;
        }
        return measurement.axisEdge - gap - measurement.height - measurement.top;
    }
    function measureAxisEdge(axis, offset, side) {
        const box = axis.getBBox();
        return side === "bottom" ? offset + box.y + box.height : offset + box.x;
    }
    function drawAxisTicks(group, options) {
        const bottom = options.side === "bottom";
        const k = bottom ? 1 : -1;
        const offset = window.devicePixelRatio > 1 ? 0 : 0.5;
        const range0 = options.range[0] + offset;
        const range1 = options.range[options.range.length - 1] + offset;
        const outer = k * options.tickSizeOuter;
        const document = group.ownerDocument;
        group.replaceChildren();
        const domain = document.createElementNS(SVG_NS, "path");
        domain.setAttribute("class", "domain");
        domain.setAttribute("stroke", "currentColor");
        if (bottom) {
            domain.setAttribute("d", outer !== 0 ? `M${range0},${outer}V${offset}H${range1}V${outer}` : `M${range0},${offset}H${range1}`);
        }
        else {
            domain.setAttribute("d", outer !== 0 ? `M${outer},${range0}H${offset}V${range1}H${outer}` : `M${offset},${range0}V${range1}`);
        }
        group.appendChild(domain);
        for (let i = 0; i < options.values.length; i++) {
            const value = options.values[i];
            const tick = document.createElementNS(SVG_NS, "g");
            tick.setAttribute("class", "tick");
            tick.setAttribute("opacity", "1");
            const position = options.position(value) + offset;
            tick.setAttribute("transform", bottom ? `translate(${position},0)` : `translate(0,${position})`);
            const line = document.createElementNS(SVG_NS, "line");
            line.setAttribute("stroke", "currentColor");
            line.setAttribute(bottom ? "y2" : "x2", String(k * 6));
            const text = document.createElementNS(SVG_NS, "text");
            text.setAttribute("fill", "currentColor");
            text.setAttribute(bottom ? "y" : "x", String(k * 9));
            text.setAttribute("dy", bottom ? "0.71em" : "0.32em");
            text.textContent = options.format(value);
            tick.appendChild(line);
            tick.appendChild(text);
            group.appendChild(tick);
        }
        group.setAttribute("fill", "none");
        group.setAttribute("font-size", "10");
        group.setAttribute("font-family", "sans-serif");
        group.setAttribute("text-anchor", bottom ? "middle" : "end");
    }
    function drawGridlines(options) {
        const container = options.container;
        const className = options.className;
        const existing = container.querySelectorAll(`.${className}`);
        for (let i = 0; i < existing.length; i++) {
            existing[i].remove();
        }
        const vertical = options.orientation === "vertical";
        for (let i = 0; i < options.values.length; i++) {
            const line = container.ownerDocument.createElementNS(SVG_NS, "line");
            line.classList.add(className);
            const position = String(options.scale(options.values[i]));
            line.setAttribute(vertical ? "x1" : "y1", position);
            line.setAttribute(vertical ? "x2" : "y2", position);
            line.setAttribute(vertical ? "y1" : "x1", String(options.from));
            line.setAttribute(vertical ? "y2" : "x2", String(options.to));
            line.style.setProperty("stroke", options.colour);
            line.style.setProperty("stroke-width", String(options.width));
            container.appendChild(line);
        }
    }

    function axisPropertiesFromSettings(axis, settings, palette, range) {
        const values = settings;
        const value = (name) => values[`${axis}limit_${name}`];
        const colour = (name) => palette.isHighContrast ? palette.foregroundColour : value(name);
        return {
            lower: range.lower,
            upper: range.upper,
            start_padding: range.start_padding,
            end_padding: range.end_padding,
            colour: colour("colour"),
            ticks: value("ticks") && value("tick_count") !== 0,
            tick_marks: value("tick_marks"),
            tick_size: `${value("tick_size")}px`,
            tick_font: value("tick_font"),
            tick_colour: colour("tick_colour"),
            tick_rotation: value("tick_rotation"),
            tick_count: value("tick_count"),
            label: value("label"),
            label_size: `${value("label_size")}px`,
            label_font: value("label_font"),
            label_colour: colour("label_colour"),
            label_style: value("label_style"),
            label_align: value("label_align"),
            grid_show: value("grid_show"),
            grid_colour: colour("grid_colour"),
            grid_width: value("grid_width")
        };
    }

    function scaledFrame(width, height, xAxis, yAxis, displayPlot) {
        return {
            width,
            height,
            xAxis,
            yAxis,
            displayPlot,
            xScale: scaleLinear().domain([xAxis.lower, xAxis.upper]).range([xAxis.start_padding, width - xAxis.end_padding]),
            yScale: scaleLinear().domain([yAxis.lower, yAxis.upper]).range([height - yAxis.start_padding, yAxis.end_padding])
        };
    }
    function createPlotFrame(options) {
        const settings = options.settings;
        const palette = options.palette;
        const leftLabel = settings.y_axis.ylimit_label ? settings.y_axis.ylimit_label_size : 0;
        const lowerLabel = settings.x_axis.xlimit_label ? settings.x_axis.xlimit_label_size : 0;
        const xAxis = axisPropertiesFromSettings("x", settings.x_axis, palette, {
            lower: options.x.lower,
            upper: options.x.upper,
            start_padding: settings.canvas.left_padding + leftLabel,
            end_padding: settings.canvas.right_padding
        });
        const yAxis = axisPropertiesFromSettings("y", settings.y_axis, palette, {
            lower: options.y.lower,
            upper: options.y.upper,
            start_padding: settings.canvas.lower_padding + lowerLabel,
            end_padding: settings.canvas.upper_padding
        });
        return scaledFrame(options.width, options.height, xAxis, yAxis, options.displayPlot);
    }
    function rescalePlotFrame(frame, padding) {
        const xAxis = { ...frame.xAxis, start_padding: padding.left, end_padding: padding.right };
        const yAxis = { ...frame.yAxis, start_padding: padding.bottom, end_padding: padding.top };
        return scaledFrame(frame.width, frame.height, xAxis, yAxis, frame.displayPlot);
    }
    function axisRangeError(ranges) {
        if (ranges.x.lower > ranges.x.upper) {
            return `The x-axis lower limit (${ranges.x.lower}) is above the upper limit (${ranges.x.upper})`;
        }
        if (ranges.y.lower > ranges.y.upper) {
            return `The y-axis lower limit (${ranges.y.lower}) is above the upper limit (${ranges.y.upper})`;
        }
        return undefined;
    }
    function inPlot(frame, x, value) {
        return !isNullOrUndefined(value)
            && between(value, frame.yAxis.lower, frame.yAxis.upper)
            && between(x, frame.xAxis.lower, frame.xAxis.upper);
    }

    function adjustPaddingForOverflow(bbox, width, height, padding) {
        const left = Math.abs(Math.min(0, bbox.x));
        const right = Math.max(0, bbox.width + bbox.x - width);
        const top = Math.abs(Math.min(0, bbox.y));
        const bottom = Math.max(0, bbox.height + bbox.y - height);
        if (left === 0 && right === 0 && top === 0 && bottom === 0) {
            return undefined;
        }
        return {
            left: padding.left + left,
            right: padding.right + right,
            top: padding.top + top,
            bottom: padding.bottom + bottom
        };
    }
    function fitPlotToOverflow(svg, frame) {
        const padding = adjustPaddingForOverflow(svg.getBBox(), frame.width, frame.height, {
            left: frame.xAxis.start_padding,
            right: frame.xAxis.end_padding,
            top: frame.yAxis.end_padding,
            bottom: frame.yAxis.start_padding
        });
        return padding === undefined ? undefined : rescalePlotFrame(frame, padding);
    }

    function highlightOpacity(opacities, active, emphasised) {
        if (!active) {
            return opacities.opacity;
        }
        return emphasised ? opacities.opacity_selected : opacities.opacity_unselected;
    }
    function highlightPlot(svg, options) {
        const root = select(svg);
        root.selectAll(".linesgroup").selectChildren("g").style("stroke-opacity", options.lineOpacity);
        const dotOpacity = (point) => highlightOpacity(options.dotOpacities(point), options.active, identitySelected(point.identity, options.selected) || point.highlighted);
        root.selectAll(".dotsgroup").selectChildren()
            .style("fill-opacity", dotOpacity)
            .style("stroke-opacity", dotOpacity);
    }

    function drawDownloadButton(svg, options) {
        let button = svg.querySelector(".download-btn-group");
        if (!options.visible) {
            button?.remove();
            return;
        }
        if (button === null) {
            button = svg.ownerDocument.createElementNS(SVG_NS, "text");
            button.classList.add("download-btn-group");
            svg.appendChild(button);
        }
        button.setAttribute("x", String(options.x));
        button.setAttribute("y", String(options.y));
        button.textContent = "Download";
        button.style.setProperty("font-size", "10px");
        button.style.setProperty("text-decoration", "underline");
        button.onclick = () => options.onClick();
    }

    function nearestPoint(count, position, targetX, targetY, includeVertical) {
        let nearest;
        let nearestDistance = Infinity;
        for (let i = 0; i < count; i++) {
            const point = position(i);
            const distance = Math.abs(point.x - targetX) + (includeVertical ? Math.abs(point.y - targetY) : 0);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = { index: i, x: point.x, y: point.y };
            }
        }
        return nearest;
    }

    function drawAxis(svg, options) {
        const axis = options.axis;
        const frame = options.frame;
        const selection = select(svg);
        const existingGroup = selection.select(`.${axis}axisgroup`);
        const existingLabel = selection.select(`.${axis}axislabel`);
        if (!options.show) {
            existingGroup.remove();
            existingLabel.remove();
            selection.selectAll(`.${axis}gridline`).remove();
            return;
        }
        const group = existingGroup.empty()
            ? selection.insert("g", ".linesgroup").classed(`${axis}axisgroup`, true)
            : existingGroup;
        const label = existingLabel.empty()
            ? selection.insert("text", ".linesgroup").classed(`${axis}axislabel`, true)
            : existingLabel;
        const isX = axis === "x";
        const properties = isX ? frame.xAxis : frame.yAxis;
        const scale = isX ? frame.xScale : frame.yScale;
        let values = [];
        if (properties.ticks) {
            values = scale.ticks(properties.tick_count);
            if (options.integer) {
                const integers = [];
                for (let i = 0; i < values.length; i++) {
                    if (Number.isInteger(values[i])) {
                        integers.push(values[i]);
                    }
                }
                values = integers;
            }
        }
        const groupNode = group.node();
        if (groupNode !== null) {
            drawAxisTicks(groupNode, {
                side: isX ? "bottom" : "left",
                range: scale.range(),
                position: scale,
                values,
                format: options.tickFormat ?? String,
                tickSizeOuter: properties.tick_marks ? 6 : 0
            });
        }
        const visibility = frame.displayPlot ? null : "hidden";
        const edge = isX ? frame.height - frame.yAxis.start_padding : frame.xAxis.start_padding;
        const tickText = group
            .attr("color", properties.colour)
            .attr("visibility", visibility)
            .attr("transform", isX ? `translate(0, ${edge})` : `translate(${edge}, 0)`)
            .selectAll(".tick text")
            .attr("transform", `rotate(${properties.tick_rotation})`)
            .style("font-size", properties.tick_size)
            .style("font-family", properties.tick_font)
            .style("fill", properties.tick_colour);
        if (isX) {
            const offset = xTickLabelOffsets(properties.tick_rotation);
            tickText.style("text-anchor", offset.anchor).attr("dx", offset.dx).attr("dy", offset.dy);
        }
        group.selectAll(".tick line").style("stroke", properties.tick_marks ? "currentColor" : "none");
        const gridGroup = svg.querySelector(".gridgroup");
        if (gridGroup !== null) {
            drawGridlines({
                container: gridGroup,
                className: `${axis}gridline`,
                orientation: isX ? "vertical" : "horizontal",
                values: properties.grid_show && frame.displayPlot ? values : [],
                scale,
                from: isX ? edge : frame.xAxis.start_padding,
                to: isX ? frame.yAxis.end_padding : frame.width - frame.xAxis.end_padding,
                colour: properties.grid_colour,
                width: properties.grid_width
            });
        }
        const placement = isX
            ? axisLabelPlacement(properties.label_align, frame.xAxis.start_padding, frame.width - frame.xAxis.end_padding)
            : axisLabelPlacement(properties.label_align, frame.height - frame.yAxis.start_padding, frame.yAxis.end_padding);
        const side = isX ? "bottom" : "left";
        const extent = isX ? frame.height : frame.width;
        const position = (offset) => label
            .attr("x", isX ? placement.position : offset)
            .attr("y", isX ? offset : placement.position)
            .attr("transform", isX ? null : `rotate(-90, ${offset}, ${placement.position})`);
        position(axisTitleOffset(side, extent, options.labelSize, undefined))
            .text(properties.label)
            .style("text-anchor", placement.anchor)
            .style("font-size", properties.label_size)
            .style("font-style", properties.label_style)
            .style("font-family", properties.label_font)
            .style("fill", properties.label_colour)
            .attr("visibility", visibility);
        const labelNode = label.node();
        if (options.measure && groupNode !== null && labelNode !== null && svg.getClientRects().length > 0) {
            label.attr("x", 0).attr("y", 0).attr("transform", null);
            const box = labelNode.getBBox();
            const measurement = { axisEdge: measureAxisEdge(groupNode, edge, side), top: box.y, height: box.height };
            position(axisTitleOffset(side, extent, options.labelSize, measurement));
        }
    }

    function sameStyle(a, b) {
        return a.colour === b.colour && a.width === b.width && a.type === b.type;
    }
    function linePath(x, y, valid) {
        let path = "";
        let run = 0;
        for (let i = 0; i <= x.length; i++) {
            if (i < x.length && valid[i]) {
                path += `${run === 0 ? "M" : "L"}${round3(x[i])},${round3(y[i])}`;
                run++;
            }
            else {
                if (run === 1) {
                    path += "Z";
                }
                run = 0;
            }
        }
        return path;
    }
    function drawLines(group, options) {
        const frame = options.frame;
        const palette = options.palette;
        select(group)
            .selectChildren("g")
            .data(options.lines)
            .join("g")
            .attr("class", line => `${line.name}-linegroup`)
            .each(function (line) {
            const n = line.points.length;
            const x = new Array(n);
            const y = new Array(n);
            const valid = new Array(n);
            const styles = new Array(n);
            const along = new Array(n).fill(0);
            const segments = [];
            let anyValid = false;
            let uniform = true;
            for (let i = 0; i < n; i++) {
                const point = line.points[i];
                x[i] = frame.xScale(point.x);
                y[i] = frame.yScale(point.line_value ?? NaN);
                valid[i] = inPlot(frame, point.x, point.line_value);
                anyValid = anyValid || valid[i];
                const style = line.style(i);
                styles[i] = palette.isHighContrast ? { ...style, colour: palette.foregroundColour } : style;
                if (i > 0) {
                    uniform = uniform && sameStyle(styles[i], styles[i - 1]);
                    along[i] = along[i - 1] + (valid[i - 1] && valid[i] ? Math.hypot(x[i] - x[i - 1], y[i] - y[i - 1]) : 0);
                    if (valid[i - 1] || valid[i]) {
                        segments.push(i - 1);
                    }
                }
            }
            const container = select(this);
            if (!anyValid) {
                container.selectAll("line, path").remove();
                return;
            }
            if (uniform) {
                container.selectAll("line").remove();
                container
                    .selectAll("path")
                    .data([line.points])
                    .join("path")
                    .attr("d", linePath(x, y, valid))
                    .attr("fill", "none")
                    .attr("stroke", styles[0].colour)
                    .attr("stroke-width", styles[0].width)
                    .attr("stroke-dasharray", styles[0].type);
                return;
            }
            container.selectAll("path").remove();
            container
                .selectAll("line")
                .data(segments)
                .join("line")
                .attr("x1", i => valid[i] ? x[i] : x[i + 1])
                .attr("y1", i => valid[i] ? y[i] : y[i + 1])
                .attr("x2", i => valid[i + 1] ? x[i + 1] : x[i])
                .attr("y2", i => valid[i + 1] ? y[i + 1] : y[i])
                .attr("fill", "none")
                .attr("stroke", i => styles[i].colour)
                .attr("stroke-width", i => styles[i].width)
                .attr("stroke-dasharray", i => styles[i].type)
                .attr("stroke-dashoffset", i => along[i]);
        });
    }

    function drawDots(svg, options) {
        const frame = options.frame;
        const host = options.host;
        const text = options.text;
        const group = select(svg).select(".dotsgroup");
        const textMode = text !== undefined;
        group.selectAll(textMode ? "path" : "text").remove();
        const marks = group
            .selectAll(textMode ? "text" : "path")
            .data(options.show && frame.displayPlot ? options.points : [])
            .join(textMode ? "text" : "path")
            .attr("transform", point => inPlot(frame, point.x, point.value)
            ? `translate(${frame.xScale(point.x)}, ${frame.yScale(point.value)})`
            : "translate(0, 0) scale(0)");
        if (text !== undefined) {
            marks.each(function (point) {
                const label = text(point);
                select(this)
                    .attr("dy", "0.35em")
                    .text(label.text)
                    .style("text-anchor", "middle")
                    .style("font-size", `${label.size}px`)
                    .style("font-family", label.font)
                    .style("fill", label.colour);
            });
        }
        else {
            marks
                .attr("d", point => symbolPath(point.aesthetics.shape, point.aesthetics.size ** 2 * Math.PI))
                .style("fill", point => point.aesthetics.colour)
                .style("stroke", point => point.aesthetics.colour_outline)
                .style("stroke-width", point => point.aesthetics.width_outline);
        }
        marks
            .on("click", (event, point) => {
            if (!host.hostCapabilities.allowInteractions) {
                return;
            }
            if (options.onClick !== undefined) {
                options.onClick(point);
            }
            else {
                options.selectionManager.select(point.identity, event.ctrlKey || event.metaKey).then(options.onSelectionChange);
            }
            event.stopPropagation();
        })
            .on("mouseover", (event, point) => {
            const pointer = screenToSvg(svg, event.clientX, event.clientY);
            host.tooltipService.show({
                dataItems: point.tooltip,
                identities: [point.identity],
                coordinates: [pointer.x, pointer.y],
                isTouchEvent: false
            });
        })
            .on("mouseout", () => {
            host.tooltipService.hide({ immediately: true, isTouchEvent: false });
        });
        select(svg).on("click.plot", () => {
            if (!host.hostCapabilities.allowInteractions) {
                return;
            }
            options.selectionManager.clear();
            options.onSelectionChange();
        });
    }

    const limitLineNames = ["ll99", "ll95", "ll68", "ul68", "ul95", "ul99"];
    function limitColumns(lines, controlLimits) {
        const columns = [];
        const levels = ["99", "95", "68"];
        const limit = (level, side) => {
            if (controlLimits && lines[`show_${level}`]) {
                columns.push({
                    name: `${side === "upper" ? "ul" : "ll"}${level}`,
                    label: `${lines[`ttip_label_${level}_prefix_${side}`]}${lines[`ttip_label_${level}`]}`
                });
            }
        };
        for (let i = 0; i < levels.length; i++) {
            limit(levels[i], "upper");
        }
        if (lines.show_target) {
            columns.push({ name: "target", label: lines.ttip_label_target });
        }
        if (lines.show_alt_target) {
            columns.push({ name: "alt_target", label: lines.ttip_label_alt_target });
        }
        for (let i = levels.length - 1; i >= 0; i--) {
            limit(levels[i], "lower");
        }
        return columns;
    }
    const lowerLimitLines = new Set(["ll99", "ll95", "ll68"]);
    const standardLineKeys = {
        ll99: "99",
        ll95: "95",
        ll68: "68",
        ul68: "68",
        ul95: "95",
        ul99: "99",
        target: "target",
        alt_target: "alt_target"
    };
    function lineSetting(lines, setting, key) {
        return lines[`${setting}_${key}`];
    }
    function lineStyle(lines, key) {
        return {
            colour: lineSetting(lines, "colour", key),
            width: lineSetting(lines, "width", key),
            type: lineSetting(lines, "type", key)
        };
    }
    function lineOpacity(lines, key, active) {
        return lineSetting(lines, active ? "opacity_unselected" : "opacity", key);
    }
    function lineLabel(lines, key, point, lower, format) {
        return {
            text: lineSetting(lines, "plot_label_prefix", key) + format(point.value, "value"),
            x: point.x,
            y: point.y,
            position: lineSetting(lines, "plot_label_position", key),
            lower,
            hpad: lineSetting(lines, "plot_label_hpad", key),
            vpad: lineSetting(lines, "plot_label_vpad", key),
            lineWidth: lineSetting(lines, "width", key),
            size: lineSetting(lines, "plot_label_size", key),
            font: lineSetting(lines, "plot_label_font", key),
            colour: lineSetting(lines, "plot_label_colour", key)
        };
    }

    function visiblePoints(frame, points) {
        const visible = [];
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            if (inPlot(frame, point.x, point.value)) {
                visible.push(point);
            }
        }
        return visible;
    }
    function valueTickFormat(decimals, percent) {
        return value => percent ? `${value.toFixed(decimals)}%` : value.toFixed(decimals);
    }
    function drawPlotAxes(svg, context, formats) {
        const frame = context.frame;
        const settings = context.settings;
        const measure = !context.frontend;
        drawAxis(svg, {
            axis: "x",
            frame,
            show: settings.x_axis.xlimit_show,
            labelSize: settings.x_axis.xlimit_label_size,
            measure,
            tickFormat: formats.x,
            integer: false
        });
        drawAxis(svg, {
            axis: "y",
            frame,
            show: settings.y_axis.ylimit_show,
            labelSize: settings.y_axis.ylimit_label_size,
            measure,
            tickFormat: formats.y,
            integer: formats.yInteger ?? false
        });
    }
    function drawPlotTooltips(svg, context, includeVertical) {
        const frame = context.frame;
        const points = context.visible;
        const host = context.host;
        const palette = context.palette;
        const vertical = svg.querySelector(".ttip-line-x");
        const horizontal = svg.querySelector(".ttip-line-y");
        if (vertical === null || horizontal === null) {
            return;
        }
        const crosshairs = drawCrosshairs({
            vertical,
            horizontal,
            left: frame.xAxis.start_padding,
            right: frame.width - frame.xAxis.end_padding,
            top: frame.yAxis.end_padding,
            bottom: frame.height - frame.yAxis.start_padding,
            colour: palette.isHighContrast ? palette.foregroundColour : "black"
        });
        select(svg)
            .on("mousemove.plot", (event) => {
            if (!frame.displayPlot) {
                return;
            }
            const pointer = screenToSvg(svg, event.clientX, event.clientY);
            const nearest = nearestPoint(points.length, i => ({ x: frame.xScale(points[i].x), y: frame.yScale(points[i].value) }), pointer.x, pointer.y, includeVertical);
            if (nearest === undefined) {
                return;
            }
            const point = points[nearest.index];
            host.tooltipService.show({
                dataItems: point.tooltip,
                identities: [point.identity],
                coordinates: [nearest.x, nearest.y],
                isTouchEvent: false
            });
            crosshairs.show(nearest.x, nearest.y);
        })
            .on("mouseleave.plot", () => {
            if (!frame.displayPlot) {
                return;
            }
            host.tooltipService.hide({ immediately: true, isTouchEvent: false });
            crosshairs.hide();
        });
    }
    function drawPlotLines(svg, context, grouped, style) {
        const group = svg.querySelector(".linesgroup");
        if (group === null) {
            return;
        }
        const lines = new Array(grouped.length);
        for (let i = 0; i < grouped.length; i++) {
            const name = grouped[i][0];
            const points = grouped[i][1];
            lines[i] = { name, points, style: index => style(name, points, index) };
        }
        drawLines(group, { frame: context.frame, lines, palette: context.palette });
    }
    function drawPlotLineLabels(svg, context, options) {
        const group = svg.querySelector(".linesgroup");
        if (group === null) {
            return;
        }
        const frame = context.frame;
        const lines = options.lines;
        const settings = options.settings;
        const periodEnds = options.periodEnds;
        const lastPeriod = periodEnds.length - 1;
        const labels = [];
        for (let r = 0; r < periodEnds.length; r++) {
            const index = periodEnds[r];
            const start = r === 0 ? 0 : periodEnds[r - 1] + 1;
            for (let l = 0; l < lines.length; l++) {
                const name = lines[l][0];
                const points = lines[l][1];
                const key = options.keys[name];
                if (!lineSetting(settings, "plot_label_show", key)) {
                    continue;
                }
                if (r !== lastPeriod) {
                    const showN = periodEnds.length - Math.min(periodEnds.length, lineSetting(settings, "plot_label_show_n", key));
                    if (r < showN && !lineSetting(settings, "plot_label_show_all", key)) {
                        continue;
                    }
                }
                for (let i = index; i >= start; i--) {
                    const value = points[i].line_value;
                    if (value !== undefined && inPlot(frame, points[i].x, value)) {
                        labels.push(lineLabel(settings, key, { x: frame.xScale(points[i].x), y: frame.yScale(value), value }, options.lower(name), options.format));
                        break;
                    }
                }
            }
        }
        drawLineLabels(group, labels, context.headless);
    }
    function drawPlotValueLabels(svg, context, anyLabels) {
        const frame = context.frame;
        const settings = context.settings;
        drawValueLabels(svg, {
            visible: settings.labels.show_labels && anyLabels,
            points: context.visible,
            xScale: frame.xScale,
            yScale: frame.yScale,
            plotHeight: frame.height,
            bottomPadding: frame.yAxis.start_padding,
            line: {
                colour: settings.labels.label_line_colour,
                width: settings.labels.label_line_width,
                type: settings.labels.label_line_type
            },
            interactive: !context.headless
        });
    }
    function drawPlotDots(svg, context, options) {
        drawDots(svg, {
            frame: context.frame,
            points: context.points,
            show: options.show,
            text: options.text,
            host: context.host,
            selectionManager: context.selectionManager,
            onSelectionChange: context.onSelectionChange,
            onClick: options.onClick
        });
    }
    function drawPlotDownload(svg, context, rows) {
        drawDownloadButton(svg, {
            visible: context.settings.download_options.show_button,
            x: context.frame.width - 50,
            y: context.frame.height - 5,
            onClick: () => {
                void context.host.downloadService.exportVisualsContent(toCsv(rows()), "chartdata.csv", "csv", "csv file");
            }
        });
    }

    const flagLabels = {
        none: "",
        improvement: "Improvement",
        deterioration: "Deterioration",
        neutral_low: "Neutral (Low)",
        neutral_high: "Neutral (High)"
    };
    function createTableContainer(element) {
        const div = select(element).insert("div", "svg").style("overflow", "auto");
        const table = div.append("table")
            .classed("table-group", true)
            .style("border-collapse", "separate")
            .style("border-spacing", "0")
            .style("width", "100%");
        table.append("thead").append("tr").classed("table-header", true);
        table.append("tbody").classed("table-body", true);
        return div;
    }
    function showTable(div, visible) {
        const size = visible ? "100%" : "0%";
        div.style("width", size).style("height", size);
    }
    function columnAlignment(setting, kind) {
        if (setting !== "auto") {
            return setting;
        }
        if (kind === "icon") {
            return "center";
        }
        return kind === "number" || kind === "input" ? "right" : "left";
    }
    function drawTableHeaders(div, options) {
        const tableSettings = options.settings;
        const tableHeaders = div.select(".table-header")
            .selectAll("th")
            .data(options.columns)
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
            .style("text-align", d => columnAlignment(tableSettings.table_header_text_align, options.kinds[d.name]))
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
    function drawTableRows(div, options, rowSettings) {
        div.select(".table-body")
            .selectAll("tr")
            .data(options.rows)
            .join("tr")
            .on("click", (event, d) => {
            if (options.host.hostCapabilities.allowInteractions) {
                const alreadySelected = identitySelected(d.identity, selectionState(options.selectionManager, false).selected);
                options.selectionManager
                    .select(d.identity, alreadySelected || event.ctrlKey || event.metaKey)
                    .then(() => options.onSelectionChange());
                event.stopPropagation();
            }
        })
            .on("mouseenter", function () {
            select(this).selectAll("td").style("background-color", "whitesmoke");
        })
            .on("mouseleave", function (_event, d) {
            select(this).selectAll("td").style("background-color", rowSettings(d).table_body_bg_colour);
        });
    }
    function drawTextOverflow(div, tableSettings, maxWidth) {
        const cells = div.selectAll("th, td");
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
    function drawOuterBorder(div, tableSettings) {
        const table = div.select(".table-group");
        table.style("border-width", `${tableSettings.table_outer_border_width}px`)
            .style("border-style", tableSettings.table_outer_border_style)
            .style("border-color", tableSettings.table_outer_border_colour);
        const sides = ["top", "right", "bottom", "left"];
        for (let i = 0; i < sides.length; i++) {
            if (!tableSettings[`table_outer_border_${sides[i]}`]) {
                table.style(`border-${sides[i]}`, "none");
            }
        }
        div.selectAll("th:last-child").style("border-right", "inherit");
        div.selectAll("td:last-child").style("border-right", "inherit");
        div.selectAll("tr:last-child").selectAll("td").style("border-bottom", "inherit");
    }
    function cellText(cell, kind, formatValue) {
        if (typeof cell.value === "number") {
            return formatValue(cell.value, kind === "input" ? "input" : "value");
        }
        if (cell.value === undefined) {
            return "";
        }
        return kind === "flag" ? flagLabels[cell.value] : cell.value;
    }
    function drawTableCells(div, options, rowSettings) {
        const columns = options.columns;
        const kinds = options.kinds;
        const tableCells = div.select(".table-body")
            .selectAll("tr")
            .selectAll("td")
            .data(d => {
            const settings = rowSettings(d);
            const cells = new Array(columns.length);
            for (let i = 0; i < columns.length; i++) {
                cells[i] = { column: columns[i].name, value: d.table_row[columns[i].name], settings };
            }
            return cells;
        })
            .join("td");
        tableCells.each(function (d) {
            const cell = select(this);
            const kind = kinds[d.column];
            cell.text(kind === "icon" ? "" : cellText(d, kind, options.formatValue));
            const tableSettings = d.settings;
            cell.style("background-color", tableSettings.table_body_bg_colour)
                .style("font-weight", tableSettings.table_body_font_weight)
                .style("text-transform", tableSettings.table_body_text_transform)
                .style("text-align", columnAlignment(tableSettings.table_body_text_align, kind))
                .style("font-size", `${tableSettings.table_body_size}px`)
                .style("font-family", tableSettings.table_body_font)
                .style("color", tableSettings.table_body_colour)
                .style("border-width", `${tableSettings.table_body_border_width}px`)
                .style("border-style", tableSettings.table_body_border_style)
                .style("border-color", tableSettings.table_body_border_colour)
                .style("border-top", "none")
                .style("border-left", "none")
                .style("padding", `${tableSettings.table_body_text_padding}px`)
                .style("opacity", "inherit")
                .style("white-space", (kind === "icon" || kind === "date") ? "nowrap" : "normal");
            if (!tableSettings.table_body_border_left_right) {
                cell.style("border-right", "none");
            }
            if (!tableSettings.table_body_border_top_bottom) {
                cell.style("border-bottom", "none");
            }
        });
    }
    function drawSummaryTable(div, options) {
        const rowSettings = options.rowSettings ?? (() => options.settings);
        drawTableHeaders(div, options);
        drawTableRows(div, options, rowSettings);
        if (options.rows.length > 0) {
            drawTableCells(div, options, rowSettings);
        }
        drawTextOverflow(div, options.settings, options.width / options.columns.length);
        drawOuterBorder(div, options.settings);
        div.on("click", () => {
            options.selectionManager.clear();
            options.onSelectionChange();
        });
    }
    function highlightTable(div, state, opacities) {
        div.selectAll(".table-body").selectChildren().style("opacity", d => highlightOpacity(opacities(d), state.active, identitySelected(d.identity, state.selected) || d.highlighted));
    }

    class PlotVisual {
        get plotProperties() {
            if (this.currentPlotProperties === undefined) {
                throw new Error("Plot properties require validated data.");
            }
            return this.currentPlotProperties;
        }
        get showsTable() {
            return this.tableShown;
        }
        constructor(options, createViewModel) {
            this.tableShown = false;
            if (options === undefined) {
                throw new Error("Visual constructor options are required.");
            }
            this.element = options.element;
            this.svg = select(options.element).append("svg");
            this.host = options.host;
            this.viewModel = createViewModel(this.host);
            this.selectionManager = this.host.createSelectionManager();
            this.selectionManager.registerOnSelectCallback(() => this.updateHighlighting());
            const svg = this.svg.node();
            if (svg !== null) {
                initialiseSvg(svg);
            }
        }
        drawAlternate() {
            return undefined;
        }
        drawMarks(_marks) { }
        drawVisual() {
            const svg = this.svg.node();
            if (svg === null) {
                return;
            }
            const viewModel = this.viewModel;
            const context = this.plotContext();
            const options = this.plotOptions();
            const lines = viewModel.groupedLines;
            drawPlotAxes(svg, context, options.tickFormats);
            drawPlotTooltips(svg, context, options.verticalCrosshair);
            drawPlotLines(svg, context, lines, (name, points, index) => lineStyle(options.lineSettings(points, index), this.lineKeys[name]));
            drawPlotLineLabels(svg, context, {
                lines,
                settings: this.settings.lines,
                keys: this.lineKeys,
                lower: name => options.lowerLines.has(name),
                format: viewModel.inputSettings.derivedSettings[0].formatValue,
                periodEnds: viewModel.periodEnds
            });
            drawPlotDots(svg, context, options.dots);
            this.drawMarks(select(svg).select(".marksgroup"));
            this.addContextMenu(svg);
            drawPlotDownload(svg, context, () => {
                const points = context.points;
                const rows = new Array(points.length);
                for (let i = 0; i < points.length; i++) {
                    rows[i] = points[i].table_row;
                }
                return rows;
            });
            drawPlotValueLabels(svg, context, viewModel.anyLabels);
        }
        update(options) {
            try {
                this.host.eventService.renderingStarted(options);
                this.svg.select(".errormessage").remove();
                this.tableShown = false;
                const status = this.viewModel.update(options, this.host);
                if (!status.status) {
                    this.currentPlotProperties = undefined;
                    this.resizeCanvas(options.viewport.width, options.viewport.height);
                    const empty = status.type === "empty";
                    this.drawErrors(options, status.error, status.type, this.settings.canvas.show_errors && !empty);
                    if (empty) {
                        this.host.eventService.renderingFinished(options);
                    }
                    else {
                        this.host.eventService.renderingFailed(options);
                    }
                    return status;
                }
                if (status.warning) {
                    this.host.displayWarningIcon("Invalid inputs or settings ignored.\n", status.warning);
                }
                this.resizeCanvas(options.viewport.width, options.viewport.height);
                this.svg.on(".plot", null);
                const alternate = this.drawAlternate();
                if (alternate !== undefined) {
                    this.tableShown = alternate === "table";
                    this.currentPlotProperties = undefined;
                    this.updateHighlighting();
                    this.host.eventService.renderingFinished(options);
                    return status;
                }
                const viewModel = this.viewModel;
                this.currentPlotProperties = createPlotFrame({
                    width: options.viewport.width,
                    height: options.viewport.height,
                    displayPlot: viewModel.plotPoints.length > 0,
                    ...viewModel.axisRanges(),
                    settings: this.settings,
                    palette: viewModel.colourPalette
                });
                this.drawVisual();
                this.adjustPaddingForOverflow();
                this.updateHighlighting();
                this.host.eventService.renderingFinished(options);
                return status;
            }
            catch (caught_error) {
                this.currentPlotProperties = undefined;
                this.resizeCanvas(options.viewport.width, options.viewport.height);
                this.drawErrors(options, caught_error instanceof Error ? caught_error.message : String(caught_error), "internal", true);
                console.error(caught_error);
                this.host.eventService.renderingFailed(options);
                return { status: false, error: String(caught_error), type: "internal" };
            }
        }
        resizeCanvas(width, height) {
            this.svg.attr("width", width).attr("height", height);
        }
        drawErrors(options, message, kind, show) {
            const svg = this.svg.node();
            if (svg === null) {
                return;
            }
            drawErrorMessage(svg, {
                width: options.viewport.width,
                height: options.viewport.height,
                message,
                kind,
                show,
                colour: this.viewModel.colourPalette.foregroundColour
            });
        }
        plotContext() {
            const viewModel = this.viewModel;
            const frame = this.plotProperties;
            return {
                frame,
                points: viewModel.plotPoints,
                visible: visiblePoints(frame, viewModel.plotPoints),
                palette: viewModel.colourPalette,
                settings: this.settings,
                host: this.host,
                selectionManager: this.selectionManager,
                onSelectionChange: () => this.updateHighlighting(),
                headless: viewModel.headless,
                frontend: viewModel.frontend
            };
        }
        highlightPlotPoints(state, dotOpacities) {
            const svg = this.svg.node();
            if (svg === null) {
                return;
            }
            highlightPlot(svg, {
                active: state.active,
                selected: state.selected,
                lineOpacity: line => lineOpacity(this.settings.lines, this.lineKeys[line.name], state.active),
                dotOpacities
            });
        }
        addContextMenu(root, enabled = this.plotProperties.displayPlot) {
            if (root === null) {
                return;
            }
            bindContextMenu(root, {
                enabled,
                identity: target => {
                    for (let node = target instanceof Element ? target : null; node !== null && node !== root; node = node.parentElement) {
                        const datum = select(node).datum();
                        if (datum?.identity !== undefined) {
                            return Array.isArray(datum.identity) ? datum.identity[0] : datum.identity;
                        }
                    }
                    return {};
                },
                show: (identity, position) => {
                    void this.selectionManager.showContextMenu(identity, position);
                }
            });
        }
        adjustPaddingForOverflow() {
            if (this.viewModel.headless) {
                return;
            }
            const svg = this.svg.node();
            if (svg === null) {
                return;
            }
            const fitted = fitPlotToOverflow(svg, this.plotProperties);
            if (fitted === undefined) {
                return;
            }
            this.currentPlotProperties = fitted;
            this.drawVisual();
        }
        getFormattingModel() {
            return this.viewModel.getFormattingModel();
        }
    }

    class PlotViewModelBase {
        constructor(host, inputSettings, valueRoles) {
            this.svgWidth = 0;
            this.svgHeight = 0;
            this.headless = false;
            this.frontend = false;
            this.firstRun = true;
            this.inputSettings = inputSettings;
            this.valueRoles = valueRoles;
            this.colourPalette = readColourPalette(host);
        }
        getFormattingModel() {
            return this.inputSettings.getFormattingModel();
        }
        update(options, host) {
            this.colourPalette = readColourPalette(host);
            const checkView = validateDataView(options.dataViews, this.valueRoles);
            if (checkView.status !== "valid") {
                return this.invalidate(checkView.error, checkView.status === "empty" ? "empty" : undefined);
            }
            const view = checkView.view;
            this.svgWidth = options.viewport.width;
            this.svgHeight = options.viewport.height;
            this.headless = options.headless ?? false;
            this.frontend = options.frontend ?? false;
            const groups = groupCategoryRows(view.categories.indicator ?? [], view.rowCount);
            const dataChanged = (options.type & (updateType.data | updateType.style)) !== 0 || this.firstRun;
            if (dataChanged) {
                this.inputSettings.update(view.category, groups.rows);
            }
            const settingsValidation = this.inputSettings.validationStatus;
            if (settingsValidation.status !== 0) {
                return this.invalidate(settingsValidation.error, "settings");
            }
            if (dataChanged) {
                const results = this.updateData(view, groups, host);
                if (results.errors.length > 0) {
                    return this.invalidate(results.errors.join("\n"));
                }
                this.warning = results.warnings.length > 0 ? results.warnings.join("\n") : undefined;
                this.firstRun = false;
            }
            if (this.hasAxes) {
                const rangeError = axisRangeError(this.axisRanges());
                if (rangeError !== undefined) {
                    return this.invalidate(rangeError, "settings");
                }
            }
            return { status: true, warning: this.warning };
        }
        invalidate(error, type) {
            this.reset();
            this.warning = undefined;
            this.firstRun = true;
            return { status: false, error, type };
        }
    }

    function code(value) {
        return "`" + value + "`";
    }
    function formatDefault(setting) {
        const value = setting.default;
        if (value === undefined || value === "") {
            return "(blank)";
        }
        if (typeof value === "boolean") {
            return value ? "On" : "Off";
        }
        if (typeof value === "number") {
            return String(value);
        }
        if (setting.items !== undefined) {
            for (let i = 0; i < setting.items.length; i++) {
                if (setting.items[i].value === value) {
                    return setting.items[i].displayName;
                }
            }
        }
        return code(value);
    }
    function formatValues(setting) {
        switch (setting.type) {
            case FormattingComponent.Dropdown: {
                const items = setting.items ?? [];
                const values = new Array(items.length);
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    values[i] = "• " + (item.displayName === item.value ? code(item.value) : item.displayName + " (" + code(item.value) + ")");
                }
                return values.join("<br>");
            }
            case FormattingComponent.AlignmentGroup: {
                const valid = setting.valid ?? [];
                const values = new Array(valid.length);
                for (let i = 0; i < valid.length; i++) {
                    values[i] = "• " + code(valid[i]);
                }
                return values.join("<br>");
            }
            case FormattingComponent.NumUpDown:
                return describeRange(setting, setting.integer ? "Whole number" : "Number");
            case FormattingComponent.ColorPicker:
                return "Colour";
            case FormattingComponent.FontPicker:
                return "Font family";
            case FormattingComponent.TextInput:
                return "Text";
            case FormattingComponent.ToggleSwitch:
                return "On or Off";
        }
    }
    function settingsReference(schema) {
        const pages = {};
        const cards = Object.keys(schema);
        for (let i = 0; i < cards.length; i++) {
            const card = schema[cards[i]];
            const groups = Object.keys(card.settingsGroups);
            let markdown = "<!-- Generated from the settings model; edit the setting definitions, not this file. -->\n";
            for (let j = 0; j < groups.length; j++) {
                const settings = card.settingsGroups[groups[j]];
                const names = Object.keys(settings);
                markdown += "\n### " + groupDisplayName(card, groups[j]) + "\n\n"
                    + "| Setting | Description | Default | Values |\n"
                    + "| --- | --- | --- | --- |\n";
                for (let k = 0; k < names.length; k++) {
                    const setting = settings[names[k]];
                    markdown += "| " + setting.displayName + " | " + setting.description + " | " + formatDefault(setting)
                        + " | " + formatValues(setting) + " |\n";
                }
            }
            pages[cards[i]] = markdown;
        }
        return pages;
    }

    function createCanvasCard() {
        return defineCard({
            description: "Canvas Settings",
            displayName: "Canvas Settings",
            settingsGroups: {
                "all": {
                    show_errors: toggleOption("Show Errors on Canvas", "Writes data and settings errors on the visual; off leaves it blank.", true),
                    lower_padding: paddingOption("Padding Below Plot (pixels):", "Space below the plot area, in addition to the x-axis title."),
                    upper_padding: paddingOption("Padding Above Plot (pixels):", "Space above the plot area."),
                    left_padding: paddingOption("Padding Left of Plot (pixels):", "Space left of the plot area, in addition to the y-axis title."),
                    right_padding: paddingOption("Padding Right of Plot (pixels):", "Space right of the plot area.")
                }
            }
        });
    }

    function createLabelsCard() {
        return defineCard({
            description: "Labels Settings",
            displayName: "Labels Settings",
            settingsGroups: {
                "all": {
                    show_labels: toggleOption("Show Value Labels", "Draws the Value Labels field's text, joined to its point by a line.", true),
                    label_position: dropdownOption("Label Position", "Whether labels sit above or below their points.", "top", ["top", "bottom"], "sentence"),
                    label_y_offset: numberOption("Label Offset from Top/Bottom (px)", "Distance of the labels from the top of the plot, or from the x-axis when below.", 20),
                    label_line_offset: numberOption("Label Offset from Connecting Line (px)", "Gap between the label text and its line.", 5),
                    label_angle_offset: numberOption("Label Angle Offset (degrees)", "Tilts the connecting line away from vertical.", 0, { min: -90, max: 90 }),
                    label_font: fontOption("Label Font", "Font of the labels."),
                    label_size: fontSizeOption("Label Font Size", "Font size of the labels, in pixels."),
                    label_colour: colourOption("Label Font Colour", "Colour of the labels.", "standard"),
                    label_line_colour: colourOption("Connecting Line Colour", "Colour of the line from label to point.", "standard"),
                    label_line_width: numberOption("Connecting Line Width", "Width of the line from label to point, in pixels.", 1, { min: 0, max: 100 }),
                    label_line_type: lineTypeOption("Connecting Line Type", "Dash pattern of the line from label to point.", "10 0"),
                    label_line_max_length: numberOption("Max Connecting Line Length (px)", "Longest the line from label to point can be.", 1000, { min: 0, max: 10000 }),
                    label_marker_show: toggleOption("Show Line Markers", "Draws a triangle where the line meets the point.", true),
                    label_marker_offset: numberOption("Marker Offset from Value (px)", "Gap between the point and the triangle.", 5),
                    label_marker_size: numberOption("Marker Size", "Size of the triangle.", 3, { min: 0, max: 100 }),
                    label_marker_colour: colourOption("Marker Fill Colour", "Fill colour of the triangle.", "standard"),
                    label_marker_outline_colour: colourOption("Marker Outline Colour", "Outline colour of the triangle.", "standard")
                }
            }
        });
    }

    function showDefinition$2(options) {
        return { show: toggleOption(options.showLabel, options.showDescription, options.showDefault) };
    }
    function styleDefinitions(options) {
        const prefix = options.namePrefix ?? "";
        return {
            width: numberOption(`${prefix}Line Width`, "Line width, in pixels.", options.width, { min: 0, max: 100 }),
            type: lineTypeOption(`${prefix}Line Type`, "Dash pattern of the line.", options.type),
            colour: colourOption(`${prefix}Line Colour`, "Line colour.", options.colour),
            opacity: numberOption("Default Opacity", "Line opacity while nothing is selected.", 1, { min: 0, max: 1 }),
            opacity_unselected: numberOption("Opacity if Any Selected", "Line opacity while any point is selected.", 0.2, { min: 0, max: 1 })
        };
    }
    function joinDefinition() {
        return { join_rebaselines: toggleOption("Connect Rebaselined Limits", "Joins the line across a rebaseline; off leaves a gap.", false) };
    }
    function tooltipDefinitions(label) {
        return {
            ttip_show: toggleOption("Show value in tooltip", "Shows this line's value in the tooltip while the line is shown.", true),
            ttip_label: textOption("Tooltip Label", "Names this line in tooltips and any summary table.", label)
        };
    }
    function plotLabelShowDefinition() {
        return { plot_label_show: toggleOption("Show Value on Plot", "Writes the line's value at its right-hand end.", false) };
    }
    function plotLabelRebaselineDefinitions() {
        return {
            plot_label_show_all: toggleOption("Show Value at all Re-Baselines", "Writes the value in every rebaseline period.", false),
            plot_label_show_n: numberOption("Show Value at Last N Re-Baselines", "Writes the value in this many of the latest rebaseline periods.", 1, { min: 1, integer: true })
        };
    }
    function plotLabelDefinitions() {
        return {
            plot_label_position: lineLabelPositionOption(),
            plot_label_vpad: numberOption("Value Vertical Padding", "Vertical offset of the value from the line, in pixels.", 0),
            plot_label_hpad: numberOption("Value Horizontal Padding", "Horizontal gap between the value and the line's end, in pixels.", 10),
            plot_label_font: fontOption("Value Font", "Font of the value."),
            plot_label_size: fontSizeOption("Value Font Size", "Font size of the value, in pixels."),
            plot_label_colour: colourOption("Value Colour", "Colour of the value.", "standard"),
            plot_label_prefix: textOption("Value Prefix", "Text written before the value.", "")
        };
    }
    function addSuffixed(group, key, definitions) {
        const names = Object.keys(definitions);
        for (let i = 0; i < names.length; i++) {
            group[`${names[i]}_${key}`] = definitions[names[i]];
        }
    }
    function createLineGroup(key, options, extras) {
        const group = {};
        addSuffixed(group, key, showDefinition$2(options));
        if (extras !== undefined) {
            const names = Object.keys(extras);
            for (let i = 0; i < names.length; i++) {
                group[names[i]] = extras[names[i]];
            }
        }
        addSuffixed(group, key, styleDefinitions(options));
        if (options.rebaselines) {
            addSuffixed(group, key, joinDefinition());
        }
        if (options.tooltipLabel !== undefined) {
            addSuffixed(group, key, tooltipDefinitions(options.tooltipLabel));
            if (options.tooltipPrefixes) {
                group[`ttip_label_${key}_prefix_lower`] = textOption("Tooltip Label - Lower Prefix", "Text before the tooltip label for the lower line.", "Lower ");
                group[`ttip_label_${key}_prefix_upper`] = textOption("Tooltip Label - Upper Prefix", "Text before the tooltip label for the upper line.", "Upper ");
            }
        }
        addSuffixed(group, key, plotLabelShowDefinition());
        if (options.rebaselines) {
            addSuffixed(group, key, plotLabelRebaselineDefinitions());
        }
        addSuffixed(group, key, plotLabelDefinitions());
        return group;
    }

    function showDefinition$1(axis) {
        return { show: toggleOption(`Show ${axis.toUpperCase()} Axis`, "Draws the axis with its ticks, title and gridlines.", true) };
    }
    function colourDefinition() {
        return { colour: colourOption("Axis Colour", "Colour of the axis line and tick marks.", "standard") };
    }
    function sigFigsDefinition() {
        return {
            sig_figs: numberOption("Tick Decimal Places", "Decimal places for the tick values; blank uses Decimals to Report.", undefined, { min: 0, max: 20, integer: true })
        };
    }
    function limitDefinitions(units) {
        return {
            l: numberOption("Lower Limit", `Lower end of the axis, as ${units}; blank sets it automatically.`, undefined),
            u: numberOption("Upper Limit", `Upper end of the axis, as ${units}; blank sets it automatically.`, undefined)
        };
    }
    function tickDefinitions(rotation) {
        return {
            ticks: toggleOption("Draw Ticks", "Draws ticks and their values.", true),
            tick_marks: toggleOption("Draw Tick Marks", "Draws the short tick lines beside the values.", true),
            tick_count: numberOption("Approximate Tick Count", "Rough number of ticks; nearby round values are chosen. 0 draws none.", 10, { min: 0, max: 100, integer: true }),
            tick_font: fontOption("Tick Font", "Font of the tick values."),
            tick_size: fontSizeOption("Tick Font Size", "Font size of the tick values, in pixels."),
            tick_colour: colourOption("Tick Font Colour", "Colour of the tick values.", "standard"),
            tick_rotation: numberOption("Tick Rotation (Degrees)", "Rotation of the tick values, in degrees.", rotation, { min: -360, max: 360 })
        };
    }
    function labelDefinitions() {
        return {
            label: textOption("Label", "Axis title.", ""),
            label_font: fontOption("Label Font", "Font of the axis title."),
            label_size: fontSizeOption("Label Font Size", "Font size of the axis title, in pixels."),
            label_colour: colourOption("Label Font Colour", "Colour of the axis title.", "standard"),
            label_style: fontStyleOption("Label Font Style", "Font style of the axis title.")
        };
    }
    function xLabelAlign() {
        return { label_align: dropdownOption("Label Alignment", "Where the title sits along the axis.", "center", ["left", "center", "right"], "sentence") };
    }
    function yLabelAlign() {
        return { label_align: dropdownOption("Label Alignment", "Where the title sits along the axis.", "center", ["bottom", "center", "top"], "sentence") };
    }
    function gridDefinitions() {
        return {
            grid_show: toggleOption("Show Gridlines", "Draws a gridline at each tick.", false),
            grid_colour: colourOption("Gridline Colour", "Gridline colour.", "lightgray"),
            grid_width: numberOption("Gridline Width", "Gridline width, in pixels.", 1, { min: 0, max: 100 })
        };
    }
    function addPrefixed(group, axis, definitions) {
        const names = Object.keys(definitions);
        for (let i = 0; i < names.length; i++) {
            group[`${axis}limit_${names[i]}`] = definitions[names[i]];
        }
    }
    function createAxisCard(axis, options, extras) {
        const axisGroup = {};
        addPrefixed(axisGroup, axis, showDefinition$1(axis));
        addPrefixed(axisGroup, axis, colourDefinition());
        if (extras !== undefined) {
            const names = Object.keys(extras);
            for (let i = 0; i < names.length; i++) {
                axisGroup[names[i]] = extras[names[i]];
            }
        }
        if (axis === "y") {
            addPrefixed(axisGroup, axis, sigFigsDefinition());
        }
        addPrefixed(axisGroup, axis, limitDefinitions(options.limitUnits));
        const ticks = {};
        addPrefixed(ticks, axis, tickDefinitions(options.tickRotation));
        const label = {};
        addPrefixed(label, axis, labelDefinitions());
        addPrefixed(label, axis, axis === "x" ? xLabelAlign() : yLabelAlign());
        const grid = {};
        addPrefixed(grid, axis, gridDefinitions());
        const name = `${axis.toUpperCase()} Axis Settings`;
        const card = defineCard({
            displayName: name,
            description: name,
            settingsGroups: {
                Axis: axisGroup,
                Ticks: ticks,
                Label: label,
                Gridlines: grid
            }
        });
        return card;
    }

    function createDownloadCard() {
        return defineCard({
            description: "Download Options",
            displayName: "Download Options",
            settingsGroups: {
                "all": {
                    show_button: toggleOption("Show Download Button", "Shows a button that exports the plotted data as chartdata.csv.", false)
                }
            }
        });
    }

    function textAlignOption(displayName, description) {
        return dropdownOption(displayName, description, "auto", ["auto", "left", "center", "right"], "sentence");
    }
    function showDefinition(options) {
        return { show_table: toggleOption("Show Summary Table", options.showDescription, false) };
    }
    function generalDefinitions() {
        return {
            table_text_overflow: dropdownOption("Text Overflow Handling", "Text too long for its column: ellipsis or clip cuts it short, none lets it wrap.", "none", ["ellipsis", "clip", "none"], "sentence"),
            table_opacity: numberOption("Default Opacity", "Row opacity while nothing is selected.", 1, { min: 0, max: 1 }),
            table_opacity_selected: numberOption("Opacity if Selected", "Opacity of selected rows while a selection is active.", 1, { min: 0, max: 1 }),
            table_opacity_unselected: numberOption("Opacity if Unselected", "Opacity of the other rows while a selection is active.", 0.2, { min: 0, max: 1 }),
            table_outer_border_style: borderStyleOption("Outer Border Style", "Line style of the border around the table.", "none"),
            table_outer_border_width: borderWidthOption("Outer Border Width", "Width of the border around the table, in pixels."),
            table_outer_border_colour: colourOption("Outer Border Colour", "Colour of the border around the table.", "standard"),
            table_outer_border_top: toggleOption("Outer Border Top", "Draws the top of the border around the table.", true),
            table_outer_border_bottom: toggleOption("Outer Border Bottom", "Draws the bottom of the border around the table.", true),
            table_outer_border_left: toggleOption("Outer Border Left", "Draws the left side of the border around the table.", true),
            table_outer_border_right: toggleOption("Outer Border Right", "Draws the right side of the border around the table.", true)
        };
    }
    function headerDefinitions() {
        return {
            table_header_font: fontOption("Header Font", "Font of the column headers."),
            table_header_size: fontSizeOption("Header Font Size", "Font size of the column headers, in pixels."),
            table_header_text_align: textAlignOption("Text Alignment", "Alignment of the headers; auto puts numbers right, text left and icons in the centre."),
            table_header_font_weight: fontWeightOption("Header Font Weight", "Font weight of the column headers.", "bold"),
            table_header_text_transform: textTransformOption("Header Text Transform", "Changes the case of the column headers."),
            table_header_text_padding: numberOption("Padding Around Text", "Space around each header, in pixels.", 3, { min: 0, max: 100 }),
            table_header_colour: colourOption("Header Font Colour", "Colour of the column headers.", "standard"),
            table_header_bg_colour: colourOption("Header Background Colour", "Background colour of the header row.", "white"),
            table_header_border_style: borderStyleOption("Header Border Style", "Line style of the header borders."),
            table_header_border_width: borderWidthOption("Header Border Width", "Width of the header borders, in pixels."),
            table_header_border_colour: colourOption("Header Border Colour", "Colour of the header borders.", "standard"),
            table_header_border_bottom: toggleOption("Bottom Border", "Draws a border under the header row.", true),
            table_header_border_inner: toggleOption("Inner Borders", "Draws borders between the headers.", false)
        };
    }
    function bodyDefinitions() {
        return {
            table_body_font: fontOption("Body Font", "Font of the table cells."),
            table_body_size: fontSizeOption("Body Font Size", "Font size of the table cells, in pixels."),
            table_body_text_align: textAlignOption("Text Alignment", "Alignment of the cells; auto puts numbers right, text left and icons in the centre."),
            table_body_font_weight: fontWeightOption("Font Weight", "Font weight of the table cells."),
            table_body_text_transform: textTransformOption("Text Transform", "Changes the case of the table cells."),
            table_body_text_padding: numberOption("Padding Around Text", "Space around each cell's text, in pixels.", 3, { min: 0, max: 100 }),
            table_body_colour: colourOption("Body Font Colour", "Colour of the cell text.", "standard"),
            table_body_bg_colour: colourOption("Body Background Colour", "Background colour of the rows.", "white"),
            table_body_border_style: borderStyleOption("Body Border Style", "Line style of the cell borders."),
            table_body_border_width: borderWidthOption("Body Border Width", "Width of the cell borders, in pixels."),
            table_body_border_colour: colourOption("Body Border Colour", "Colour of the cell borders.", "lightgray"),
            table_body_border_top_bottom: toggleOption("Top/Bottom Borders", "Draws borders between rows.", true),
            table_body_border_left_right: toggleOption("Left/Right Borders", "Draws borders between columns.", false)
        };
    }
    function createSummaryTableCard(options, extras) {
        const card = defineCard({
            description: "Summary Table Settings",
            displayName: "Summary Table Settings",
            settingsGroups: {
                General: { ...showDefinition(options), ...extras, ...generalDefinitions() },
                Header: headerDefinitions(),
                Body: bodyDefinitions()
            }
        });
        return card;
    }

    function dotOptions() {
        return {
            shape: dropdownOption("Shape", "Marker shape for each point.", "Circle", ["Circle", "Cross", "Diamond", "Square", "Star", "Triangle", "Wye"]),
            size: numberOption("Size", "Size of each point; a circle's radius in pixels.", 2.5, { min: 0, max: 100 }),
            colour: colourOption("Colour", "Fill colour of each point.", "common_cause"),
            colour_outline: colourOption("Outline Colour", "Outline colour of each point.", "common_cause"),
            width_outline: numberOption("Outline Width", "Outline width of each point, in pixels.", 1, { min: 0, max: 100 }),
            opacity: numberOption("Default Opacity", "Point opacity while nothing is selected.", 1, { min: 0, max: 1 }),
            opacity_selected: numberOption("Opacity if Selected", "Opacity of selected or highlighted points while a selection is active.", 1, { min: 0, max: 1 }),
            opacity_unselected: numberOption("Opacity if Unselected", "Opacity of the other points while a selection is active.", 0.2, { min: 0, max: 1 })
        };
    }
    function flagDirectionOptions() {
        return {
            process_flag_type: dropdownOption("Type of Change to Flag", "Which changes are flagged. Ignored when the improvement direction is neutral.", "both", ["both", "improvement", "deterioration"], "sentence"),
            improvement_direction: dropdownOption("Improvement Direction", "Whether higher or lower values are better. Neutral flags both sides in the neutral colours.", "increase", ["increase", "neutral", "decrease"], "sentence")
        };
    }
    function scalingOptions() {
        return {
            multiplier: numberOption("Multiplier", "Multiplies plotted values and limits, e.g. 1000 for a rate per 1,000.", 1, { above: 0 }),
            sig_figs: numberOption("Decimals to Report:", "Decimal places for values in tooltips, line labels and the y-axis, unless the y-axis sets its own.", 2, { min: 0, max: 20, integer: true }),
            perc_labels: dropdownOption("Report as percentage", "Yes multiplies by 100 and adds a % sign, replacing the multiplier. Automatic does this for "
                + "proportion charts with a multiplier of 1 or 100. No never adds a % sign.", "Automatic", ["Automatic", "Yes", "No"])
        };
    }
    function valueTooltipOptions() {
        return {
            ttip_show_numerator: toggleOption("Show Numerator in Tooltip", "Shows the numerator in the tooltip, when one is supplied.", true),
            ttip_label_numerator: textOption("Numerator Tooltip Label", "Name for the numerator in the tooltip.", "Numerator"),
            ttip_show_denominator: toggleOption("Show Denominator in Tooltip", "Shows the denominator in the tooltip, when one is supplied.", true),
            ttip_label_denominator: textOption("Denominator Tooltip Label", "Name for the denominator in the tooltip.", "Denominator"),
            ttip_show_value: toggleOption("Show Value in Tooltip", "Shows the plotted value in the tooltip.", true),
            ttip_label_value: textOption("Value Tooltip Label", "Name for the plotted value in the tooltip; Automatic names it after the chart type.", "Automatic")
        };
    }
    function limitTruncationOptions() {
        return {
            ll_truncate: numberOption("Truncate Lower Limits at:", "Limits below this plotted value are drawn at it, and points are flagged against them.", undefined),
            ul_truncate: numberOption("Truncate Upper Limits at:", "Limits above this plotted value are drawn at it, and points are flagged against them.", undefined)
        };
    }

    function orderedPairError(lowerName, lower, upperName, upper) {
        if (lower !== undefined && upper !== undefined && lower >= upper) {
            return `${lowerName} (${lower}) must be below ${upperName} (${upper})`;
        }
        return undefined;
    }
    function orderedBoundsError(settings, truncation) {
        return orderedPairError("ll_truncate", truncation.ll_truncate, "ul_truncate", truncation.ul_truncate)
            ?? orderedPairError("xlimit_l", settings.x_axis.xlimit_l, "xlimit_u", settings.x_axis.xlimit_u)
            ?? orderedPairError("ylimit_l", settings.y_axis.ylimit_l, "ylimit_u", settings.y_axis.ylimit_u);
    }

    function limitStatus(value, lower, upper) {
        if (upper !== undefined && value > upper) {
            return "upper";
        }
        if (lower !== undefined && value < lower) {
            return "lower";
        }
        return "none";
    }

    function astronomical(val, ll99, ul99) {
        const rtn = new Array(val.length);
        for (let i = 0; i < val.length; i++) {
            rtn[i] = limitStatus(val[i], ll99[i], ul99[i]);
        }
        return rtn;
    }

    function shift(val, targets, n) {
        const length = val.length;
        const shift_detected = new Array(length);
        let side = 0;
        let count = 0;
        let unflagged = 0;
        for (let i = 0; i < length; i++) {
            shift_detected[i] = "none";
            const target = targets[i];
            const sign = target === undefined ? NaN : Math.sign(val[i] - target);
            if (Number.isNaN(sign)) {
                side = 0;
                continue;
            }
            if (sign === 0) {
                continue;
            }
            if (sign === side) {
                count++;
            }
            else {
                side = sign;
                count = 1;
                unflagged = i;
            }
            if (count >= n) {
                for (let j = unflagged; j <= i; j++) {
                    shift_detected[j] = side > 0 ? "upper" : "lower";
                }
                unflagged = i + 1;
            }
        }
        return shift_detected;
    }

    function sigmaLimits(n, centre, options) {
        const sigma = options.sigma;
        const floor = options.floor ?? -Infinity;
        const ceiling = options.ceiling ?? Infinity;
        const target = options.target ?? centre;
        const limits = {
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        for (let i = 0; i < n; i++) {
            const s = typeof sigma === "number" ? sigma : sigma(i);
            limits.target[i] = target;
            limits.ll99[i] = Math.max(floor, centre - 3 * s);
            limits.ll95[i] = Math.max(floor, centre - 2 * s);
            limits.ll68[i] = Math.max(floor, centre - s);
            limits.ul68[i] = Math.min(ceiling, centre + s);
            limits.ul95[i] = Math.min(ceiling, centre + 2 * s);
            limits.ul99[i] = Math.min(ceiling, centre + 3 * s);
        }
        return limits;
    }

    function trend(val, n) {
        const length = val.length;
        const trend_detected = new Array(length);
        let direction = 0;
        let count = 0;
        let unflagged = 0;
        for (let i = 0; i < length; i++) {
            trend_detected[i] = "none";
            const change = i === 0 ? NaN : Math.sign(val[i] - val[i - 1]);
            if (Number.isNaN(change)) {
                direction = 0;
                continue;
            }
            if (change === 0) {
                continue;
            }
            if (change === direction) {
                count++;
            }
            else {
                direction = change;
                count = 2;
                unflagged = i - 1;
            }
            if (count >= n) {
                for (let j = unflagged; j <= i; j++) {
                    if (trend_detected[j] === "none") {
                        trend_detected[j] = direction > 0 ? "upper" : "lower";
                    }
                }
                unflagged = i + 1;
            }
        }
        return trend_detected;
    }

    function twoInThree(val, ll95, ul95, highlight_series) {
        const length = val.length;
        const outside95 = new Array(length);
        const two_in_three_detected = new Array(length);
        for (let i = 0; i < length; i++) {
            const status = limitStatus(val[i], ll95[i], ul95[i]);
            outside95[i] = status === "upper" ? 1 : (status === "lower" ? -1 : 0);
            two_in_three_detected[i] = "none";
            const start = Math.max(0, i - 2);
            let above = 0;
            let below = 0;
            for (let j = start; j <= i; j++) {
                if (outside95[j] === 1) {
                    above++;
                }
                else if (outside95[j] === -1) {
                    below++;
                }
            }
            const side = above >= 2 ? 1 : (below >= 2 ? -1 : 0);
            if (side === 0) {
                continue;
            }
            for (let j = start; j <= i; j++) {
                if (outside95[j] === side || (highlight_series && outside95[j] !== -side)) {
                    two_in_three_detected[j] = side === 1 ? "upper" : "lower";
                }
            }
        }
        return two_in_three_detected;
    }

    exports.DBL_MIN = DBL_MIN;
    exports.EULER = EULER;
    exports.FormattingComponent = FormattingComponent;
    exports.LOG_SQRT_PI_DIV_2 = LOG_SQRT_PI_DIV_2;
    exports.LOG_SQRT_TWO_PI = LOG_SQRT_TWO_PI;
    exports.LOG_TWO_PI = LOG_TWO_PI;
    exports.ONE_DIV_SQRT_TWO_PI = ONE_DIV_SQRT_TWO_PI;
    exports.PlotViewModelBase = PlotViewModelBase;
    exports.PlotVisual = PlotVisual;
    exports.SQRT_THIRTY_TWO = SQRT_THIRTY_TWO;
    exports.SQRT_TWO_PI = SQRT_TWO_PI;
    exports.SVG_NS = SVG_NS;
    exports.SettingsStore = SettingsStore;
    exports.TWO_PI = TWO_PI;
    exports.a3 = a3;
    exports.adjustPaddingForOverflow = adjustPaddingForOverflow;
    exports.alignmentOption = alignmentOption;
    exports.appendPatternTooltips = appendPatternTooltips;
    exports.applyFlagColours = applyFlagColours;
    exports.asArray = asArray;
    exports.astronomical = astronomical;
    exports.axisLabelPlacement = axisLabelPlacement;
    exports.axisPropertiesFromSettings = axisPropertiesFromSettings;
    exports.axisRangeError = axisRangeError;
    exports.axisTitleOffset = axisTitleOffset;
    exports.between = between;
    exports.bindContextMenu = bindContextMenu;
    exports.binomialDeviance = binomialDeviance;
    exports.borderStyleOption = borderStyleOption;
    exports.borderWidthOption = borderWidthOption;
    exports.buildFormattingModel = buildFormattingModel;
    exports.c4 = c4;
    exports.c5 = c5;
    exports.calculateTrendLine = calculateTrendLine;
    exports.chartAggregations = chartAggregations;
    exports.chartNames = chartNames;
    exports.chartSettings = chartSettings;
    exports.chartTitle = chartTitle;
    exports.chebyshevPolynomial = chebyshevPolynomial;
    exports.checkFlagDirection = checkFlagDirection;
    exports.chisqCDF = chisqCDF;
    exports.chisqQuantile = chisqQuantile;
    exports.chisqQuantileApprox = chisqQuantileApprox;
    exports.clamp = clamp;
    exports.colourOption = colourOption;
    exports.combineUpdateTypes = combineUpdateTypes;
    exports.constructorOptions = constructorOptions;
    exports.createAxisCard = createAxisCard;
    exports.createCanvasCard = createCanvasCard;
    exports.createDefaultValues = createDefaultValues;
    exports.createDownloadCard = createDownloadCard;
    exports.createLabelsCard = createLabelsCard;
    exports.createLineGroup = createLineGroup;
    exports.createPlotFrame = createPlotFrame;
    exports.createSummaryTableCard = createSummaryTableCard;
    exports.createTableContainer = createTableContainer;
    exports.createValueFormatter = createValueFormatter;
    exports.defineCard = defineCard;
    exports.deriveScaling = deriveScaling;
    exports.dotOptions = dotOptions;
    exports.drawAxis = drawAxis;
    exports.drawCrosshairs = drawCrosshairs;
    exports.drawDots = drawDots;
    exports.drawDownloadButton = drawDownloadButton;
    exports.drawErrorMessage = drawErrorMessage;
    exports.drawGridlines = drawGridlines;
    exports.drawLineLabels = drawLineLabels;
    exports.drawLines = drawLines;
    exports.drawPlotAxes = drawPlotAxes;
    exports.drawPlotDots = drawPlotDots;
    exports.drawPlotDownload = drawPlotDownload;
    exports.drawPlotLineLabels = drawPlotLineLabels;
    exports.drawPlotLines = drawPlotLines;
    exports.drawPlotTooltips = drawPlotTooltips;
    exports.drawPlotValueLabels = drawPlotValueLabels;
    exports.drawSummaryTable = drawSummaryTable;
    exports.drawValueLabels = drawValueLabels;
    exports.dropdownOption = dropdownOption;
    exports.extractRows = extractRows;
    exports.fitPlotToOverflow = fitPlotToOverflow;
    exports.flagDirectionOptions = flagDirectionOptions;
    exports.fontOption = fontOption;
    exports.fontSizeOption = fontSizeOption;
    exports.fontStyleOption = fontStyleOption;
    exports.fontWeightOption = fontWeightOption;
    exports.formatNumber = formatNumber;
    exports.formatPrimitiveValue = formatPrimitiveValue;
    exports.frexp = frexp;
    exports.frontendChart = frontendChart;
    exports.gamma = gamma;
    exports.gammaCDF = gammaCDF;
    exports.gammaDensity = gammaDensity;
    exports.gammaQuantile = gammaQuantile;
    exports.groupBy = groupBy;
    exports.groupCategoryRows = groupCategoryRows;
    exports.highlightOpacity = highlightOpacity;
    exports.highlightPlot = highlightPlot;
    exports.highlightTable = highlightTable;
    exports.identitySelected = identitySelected;
    exports.inPlot = inPlot;
    exports.indexColumnsByRole = indexColumnsByRole;
    exports.indicatorColumns = indicatorColumns;
    exports.indicatorFields = indicatorFields;
    exports.initialiseSvg = initialiseSvg;
    exports.isArray = isArray;
    exports.isNullOrUndefined = isNullOrUndefined;
    exports.isValidNumber = isValidNumber;
    exports.keptValue = keptValue;
    exports.labelGeometry = labelGeometry;
    exports.labelledMessage = labelledMessage;
    exports.ldexp = ldexp;
    exports.lgamma = lgamma;
    exports.lgamma1p = lgamma1p;
    exports.lgammaCorrection = lgammaCorrection;
    exports.limitColumns = limitColumns;
    exports.limitLineNames = limitLineNames;
    exports.limitStatus = limitStatus;
    exports.limitTooltips = limitTooltips;
    exports.limitTruncationOptions = limitTruncationOptions;
    exports.limitValue = limitValue;
    exports.lineLabel = lineLabel;
    exports.lineLabelGeometry = lineLabelGeometry;
    exports.lineLabelPositionOption = lineLabelPositionOption;
    exports.lineOpacity = lineOpacity;
    exports.lineSetting = lineSetting;
    exports.lineStyle = lineStyle;
    exports.lineTypeOption = lineTypeOption;
    exports.log1mExp = log1mExp;
    exports.log1pmx = log1pmx;
    exports.logP = logP;
    exports.logcf = logcf;
    exports.lowerLimitLines = lowerLimitLines;
    exports.makeUpdateValues = makeUpdateValues;
    exports.max = max;
    exports.measureAxisEdge = measureAxisEdge;
    exports.median = median;
    exports.missingRule = missingRule;
    exports.nanRule = nanRule;
    exports.nearestPoint = nearestPoint;
    exports.negativeRule = negativeRule;
    exports.normalCDF = normalCDF;
    exports.normalDensity = normalDensity;
    exports.normalQuantile = normalQuantile;
    exports.numberOption = numberOption;
    exports.orderedBoundsError = orderedBoundsError;
    exports.orderedPairError = orderedPairError;
    exports.paddedDataViews = paddedDataViews;
    exports.paddingOption = paddingOption;
    exports.poissonDensity = poissonDensity;
    exports.quantile = quantile;
    exports.quantity = quantity;
    exports.ratioRule = ratioRule;
    exports.readColourPalette = readColourPalette;
    exports.readNumbers = readNumbers;
    exports.readRowAnnotations = readRowAnnotations;
    exports.readSettingsGroups = readSettingsGroups;
    exports.readSettingsRows = readSettingsRows;
    exports.registerChart = registerChart;
    exports.rep = rep;
    exports.rescalePlotFrame = rescalePlotFrame;
    exports.resolvePercentScaling = resolvePercentScaling;
    exports.rowIdentity = rowIdentity;
    exports.rowWarnings = rowWarnings;
    exports.scaleLinear = scaleLinear;
    exports.scalingOptions = scalingOptions;
    exports.screenToSvg = screenToSvg;
    exports.select = select;
    exports.selectAll = selectAll;
    exports.selectedKeys = selectedKeys;
    exports.selectionId = selectionId;
    exports.selectionState = selectionState;
    exports.sequence = sequence;
    exports.settingsReference = settingsReference;
    exports.shift = shift;
    exports.showTable = showTable;
    exports.sigmaLimits = sigmaLimits;
    exports.sinpi = sinpi;
    exports.standardLineKeys = standardLineKeys;
    exports.stirlingError = stirlingError;
    exports.sum = sum;
    exports.textOption = textOption;
    exports.textTransformOption = textTransformOption;
    exports.toCsv = toCsv;
    exports.toDataViews = toDataViews;
    exports.toggleOption = toggleOption;
    exports.trend = trend;
    exports.trianglePath = trianglePath;
    exports.twoInThree = twoInThree;
    exports.updateChartTitle = updateChartTitle;
    exports.updateType = updateType;
    exports.validateDataView = validateDataView;
    exports.validateRows = validateRows;
    exports.valueAt = valueAt;
    exports.valueTickFormat = valueTickFormat;
    exports.valueTooltipOptions = valueTooltipOptions;
    exports.valueTooltips = valueTooltips;
    exports.visiblePoints = visiblePoints;
    exports.xTickLabelOffsets = xTickLabelOffsets;

    return exports;

})({});
