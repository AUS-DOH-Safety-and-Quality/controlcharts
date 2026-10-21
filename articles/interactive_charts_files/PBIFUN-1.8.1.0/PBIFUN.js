var funnel = (function (exports, frontends, data, spc, rendering, math, settings, powerbi) {
    'use strict';

    function drawMisc(svg, visual) {
        svg.selectChildren().remove();
        const model = visual.viewModel;
        const settings = model.inputSettings.settings[0];
        const canvas = settings.canvas;
        const misc = settings.misc;
        const xAxis = settings.x_axis;
        const yAxis = settings.y_axis;
        const lines = settings.lines;
        const palette = model.colourPalette;
        const colour = (value) => palette.isHighContrast ? palette.foregroundColour : value;
        svg.style("background", () => palette.isHighContrast ? palette.backgroundColour : null);
        const root = svg.append("g").classed("misc-root", true);
        const top = canvas.upper_padding + 55;
        const bottom = Math.max(top, model.svgHeight - canvas.lower_padding - 35);
        const rowHeight = (bottom - top) / model.miscPoints.length;
        const labels = root.selectAll(".misc-y-tick").data(model.miscPoints).join("text")
            .classed("misc-y-tick", true).attr("text-anchor", "end").attr("dominant-baseline", "middle")
            .attr("y", (_, i) => top + (i + 0.5) * rowHeight)
            .style("font-family", yAxis.ylimit_tick_font).style("font-size", `${yAxis.ylimit_tick_size}px`)
            .attr("fill", colour(yAxis.ylimit_tick_colour)).text(point => point.indicator);
        let labelWidth = 0;
        if (!model.headless) {
            const nodes = labels.nodes();
            for (let i = 0; i < nodes.length; i++) {
                labelWidth = Math.max(labelWidth, nodes[i].getBBox().width);
            }
        }
        const left = canvas.left_padding + labelWidth + 10;
        const right = Math.max(left, model.svgWidth - canvas.right_padding);
        labels.attr("x", left - 8);
        const scale = math.scaleLinear().domain([misc.lower, misc.upper]).range([left, right]);
        const zero = scale(0);
        const limits = [
            { value: math.normalQuantile(0.001, 0, 1, true, false), level: "99" }, { value: math.normalQuantile(0.999, 0, 1, true, false), level: "99" },
            { value: math.normalQuantile(0.025, 0, 1, true, false), level: "95" }, { value: math.normalQuantile(0.975, 0, 1, true, false), level: "95" },
            { value: 0, level: "target" }
        ];
        const drawn = { "99": false, "95": false, target: false };
        for (let i = 0; i < limits.length; i++) {
            const value = limits[i].value;
            const level = limits[i].level;
            if (!lines[`show_${level}`] || value < misc.lower || value > misc.upper) {
                continue;
            }
            drawn[level] = true;
            root.append("line").attr("class", level === "target" ? "misc-zero-line" : `misc-limit-${level}`)
                .attr("x1", scale(value)).attr("x2", scale(value)).attr("y1", top).attr("y2", bottom)
                .attr("stroke", colour(lines[`colour_${level}`])).attr("stroke-width", lines[`width_${level}`])
                .attr("stroke-dasharray", lines[`type_${level}`]).attr("opacity", lines[`opacity_${level}`]);
        }
        root.append("line").classed("misc-axis", true).attr("x1", left).attr("x2", right)
            .attr("y1", bottom).attr("y2", bottom).attr("stroke", colour(xAxis.xlimit_colour));
        if (xAxis.xlimit_ticks) {
            const ticks = scale.ticks(xAxis.xlimit_tick_count);
            for (let i = 0; i < ticks.length; i++) {
                const tick = ticks[i];
                root.append("text").classed("misc-x-tick", true).attr("x", scale(tick)).attr("y", bottom + xAxis.xlimit_tick_size + 5)
                    .attr("text-anchor", "middle").style("font-family", xAxis.xlimit_tick_font)
                    .style("font-size", `${xAxis.xlimit_tick_size}px`).attr("fill", colour(xAxis.xlimit_tick_colour))
                    .text(Number(tick.toFixed(2)));
            }
        }
        const title = rendering.axisLabelPlacement(xAxis.xlimit_label_align, left, right);
        root.append("text").attr("x", title.position).attr("y", model.svgHeight - canvas.lower_padding)
            .attr("text-anchor", title.anchor).style("font-family", xAxis.xlimit_label_font)
            .style("font-size", `${xAxis.xlimit_label_size}px`).style("font-style", xAxis.xlimit_label_style)
            .attr("fill", colour(xAxis.xlimit_label_colour)).text(xAxis.xlimit_label);
        const directions = [
            { text: misc.unfavourable_label, x: (left + zero) / 2, colour: settings.outliers.three_sigma_colour_deterioration },
            { text: misc.favourable_label, x: (zero + right) / 2, colour: settings.outliers.three_sigma_colour_improvement }
        ];
        for (let i = 0; i < directions.length; i++) {
            const direction = directions[i];
            root.append("text").classed("misc-direction", true).attr("x", direction.x).attr("y", top - 10)
                .attr("text-anchor", "middle").style("font-family", xAxis.xlimit_tick_font).style("font-size", "12px")
                .style("font-weight", "bold").attr("fill", colour(direction.colour)).text(direction.text);
        }
        const legends = [{ level: "95", text: "95% Control Limits" }, { level: "99", text: "99% Control Limits" }];
        for (let i = 0; i < legends.length; i++) {
            const level = legends[i].level;
            const text = legends[i].text;
            if (!drawn[level]) {
                continue;
            }
            const x = left + (right - left) * i / 2;
            root.append("line").attr("x1", x).attr("x2", x + 20).attr("y1", top - 35).attr("y2", top - 35)
                .attr("stroke", colour(lines[`colour_${level}`])).attr("stroke-width", lines[`width_${level}`])
                .attr("stroke-dasharray", lines[`type_${level}`]).attr("opacity", lines[`opacity_${level}`]);
            root.append("text").attr("x", x + 24).attr("y", top - 35).attr("dominant-baseline", "middle")
                .style("font-family", xAxis.xlimit_tick_font).style("font-size", "10px")
                .attr("fill", colour(xAxis.xlimit_tick_colour)).text(text);
        }
        root.selectAll(".misc-bar").data(model.miscPoints).join("rect")
            .classed("misc-bar", true).attr("x", point => scale(Math.min(0, math.clamp(point.score, misc.lower, misc.upper))))
            .attr("y", (_, i) => top + (i + (1 - misc.bar_height) / 2) * rowHeight)
            .attr("width", point => Math.abs(scale(math.clamp(point.score, misc.lower, misc.upper)) - zero))
            .attr("height", rowHeight * misc.bar_height).attr("fill", point => colour(point.aesthetics.colour))
            .on("click", (event, point) => {
            if (!visual.host.hostCapabilities.allowInteractions) {
                return;
            }
            visual.selectionManager.select(point.identity, event.ctrlKey || event.metaKey).then(() => visual.updateHighlighting());
            event.stopPropagation();
        })
            .on("mouseover", (event, point) => visual.host.tooltipService.show({
            dataItems: point.tooltip,
            identities: [point.identity],
            coordinates: [event.clientX, event.clientY],
            isTouchEvent: false
        }))
            .on("mouseout", () => visual.host.tooltipService.hide({ immediately: true, isTouchEvent: false }));
        svg.on("click.plot", () => {
            if (!visual.host.hostCapabilities.allowInteractions) {
                return;
            }
            visual.selectionManager.clear().then(() => visual.updateHighlighting());
        });
        visual.addContextMenu(svg.node(), visual.host.hostCapabilities.allowInteractions === true);
    }

    function getZScores(y, SE, target) {
        const n = y.length;
        const result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = (y[i] - target) / SE[i];
        }
        return result;
    }

    function winsoriseZScores(z) {
        const z_sorted = [...z].sort((a, b) => a - b);
        const lower_z = math.quantile(z_sorted, 0.1);
        const upper_z = math.quantile(z_sorted, 0.9);
        const n = z.length;
        const result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = math.clamp(z[i], lower_z, upper_z);
        }
        return result;
    }

    function getPhi(z_adj) {
        let total = 0;
        for (let i = 0; i < z_adj.length; i++) {
            total += Math.pow(z_adj[i], 2);
        }
        return total / z_adj.length;
    }

    function getTau2(phi, SE) {
        const N = SE.length;
        if (N < 2 || N * phi < N - 1) {
            return 0.0;
        }
        let w_sum = 0;
        let w_sq_sum = 0;
        for (let i = 0; i < N; i++) {
            const w = 1.0 / Math.pow(SE[i], 2);
            w_sum += w;
            w_sq_sum += Math.pow(w, 2);
        }
        const tau_num = (N * phi) - (N - 1.0);
        const tau_denom = w_sum - (w_sq_sum / w_sum);
        return tau_num / tau_denom;
    }

    const levels = ["99", "95", "68"];
    function pruneCrossing(inner, next) {
        for (let i = 0; i < levels.length; i++) {
            const lower = `ll${levels[i]}`;
            const upper = `ul${levels[i]}`;
            const nextLower = next[lower];
            const nextUpper = next[upper];
            let low = inner[lower];
            let high = inner[upper];
            if (low !== undefined && nextLower !== undefined && low > nextLower) {
                low = undefined;
            }
            if (high !== undefined && nextUpper !== undefined && high < nextUpper) {
                high = undefined;
            }
            if (low !== undefined && high !== undefined && low >= high) {
                low = undefined;
                high = undefined;
            }
            inner[lower] = low;
            inner[upper] = high;
        }
    }
    class chartClass {
        getPlottingDenominators() {
            const plotDenomLower = 1;
            const plotDenomUpper = Math.max(math.max(this.inputData.denominators) * 1.1, this.inputSettings.settings.x_axis.xlimit_u ?? -Infinity);
            const plotDenomSteps = 110;
            const candidates = new Set(this.inputData.denominators);
            if (plotDenomUpper > plotDenomLower) {
                const plotDenomStep = (plotDenomUpper - plotDenomLower) / plotDenomSteps;
                for (let i = 0; i < plotDenomSteps; i++) {
                    candidates.add(plotDenomLower + i * plotDenomStep);
                }
                candidates.add(plotDenomUpper);
            }
            return Array.from(candidates).sort((a, b) => a - b);
        }
        getTarget(par) {
            const targetFun = par.transformed ? this.targetFunctionTransformed : this.targetFunction;
            return targetFun(this.inputData);
        }
        getSE(par) {
            const seFun = par.odAdjust ? this.seFunctionOD : this.seFunction;
            return seFun(this.inputData, par.plottingDenominators);
        }
        getY() {
            return this.yFunction(this.inputData);
        }
        getZ() {
            if (this.variance === undefined || this.odAdjust === undefined) {
                throw new Error("Calculate limits before requesting z-scores.");
            }
            const zFun = this.odAdjust ? this.zFunctionOD : this.zFunction;
            return zFun(this.inputData, {
                zScores: this.variance.zScores,
                SE: this.variance.seOD,
                tau2: this.odAdjust ? this.variance.tau2 : 0
            });
        }
        getTau2() {
            const targetOD = this.getTarget({ transformed: true });
            const seOD = this.getSE({ odAdjust: true });
            const yTransformed = this.getY();
            const zScores = getZScores(yTransformed, seOD, targetOD);
            const zScoresWinsorized = winsoriseZScores(zScores);
            const phi = getPhi(zScoresWinsorized);
            const tau2 = getTau2(phi, seOD);
            this.variance = { tau2, phi, seOD, zScores };
            return tau2;
        }
        getODAdjust() {
            if (this.variance === undefined) {
                throw new Error("Estimate tau2 before choosing whether to adjust for it.");
            }
            if (this.variance.tau2 === 0) {
                return false;
            }
            const N = this.variance.zScores.length;
            switch (this.inputSettings.settings.funnel.od_adjust) {
                case "yes":
                    return true;
                case "auto":
                    return N * this.variance.phi > math.chisqQuantile(0.95, N - 1);
                case "no":
                    return false;
            }
        }
        getSingleLimit(par) {
            const limitFun = par.odAdjust ? this.limitFunctionOD : this.limitFunction;
            return limitFun(par.inputArgs);
        }
        getIntervals() {
            const probs = [0.001, 0.025, 0.16, 0.84, 0.975, 0.999];
            const result = new Array(probs.length);
            for (let i = 0; i < probs.length; i++) {
                result[i] = { prob: probs[i], quantile: math.normalQuantile(probs[i], 0, 1, true, false), label: settings.limitLineNames[i] };
            }
            return result;
        }
        getLimits() {
            const tau2 = this.getTau2();
            const odAdjust = this.getODAdjust();
            this.odAdjust = odAdjust;
            const curr_tau2 = odAdjust ? tau2 : 0;
            const target = this.getTarget({ transformed: false });
            const alt_target = this.inputSettings.settings.lines.alt_target;
            const target_transformed = this.getTarget({ transformed: true });
            const intervals = this.getIntervals();
            const plottingDenominators = this.getPlottingDenominators();
            const nextDenominators = new Array(plottingDenominators.length);
            for (let idx = 0; idx < plottingDenominators.length; idx++) {
                nextDenominators[idx] = plottingDenominators[idx] * (1 + 1e-3);
            }
            const plottingSE = this.getSE({
                odAdjust: odAdjust,
                plottingDenominators: plottingDenominators
            });
            const nextSE = this.getSE({
                odAdjust: odAdjust,
                plottingDenominators: nextDenominators
            });
            const limitRow = (denom, SE) => {
                const row = { denominators: denom, target, alt_target,
                    ll99: undefined, ll95: undefined, ll68: undefined, ul68: undefined, ul95: undefined, ul99: undefined };
                for (let i = 0; i < intervals.length; i++) {
                    const interval = intervals[i];
                    const functionArgs = {
                        p: interval.prob,
                        q: interval.quantile,
                        target_transformed: target_transformed,
                        SE: SE,
                        tau2: curr_tau2,
                        denominators: denom
                    };
                    const limit = this.getSingleLimit({
                        odAdjust: odAdjust,
                        inputArgs: functionArgs
                    });
                    row[interval.label] = limit;
                }
                return row;
            };
            const calcLimits = new Array(plottingDenominators.length);
            for (let idx = 0; idx < plottingDenominators.length; idx++) {
                const row = limitRow(plottingDenominators[idx], plottingSE[idx]);
                pruneCrossing(row, limitRow(nextDenominators[idx], nextSE[idx]));
                calcLimits[idx] = row;
            }
            return calcLimits;
        }
        constructor(args) {
            this.seFunction = args.seFunction;
            this.seFunctionOD = args.seFunctionOD ?? args.seFunction;
            this.targetFunction = args.targetFunction;
            this.targetFunctionTransformed = args.targetFunctionTransformed;
            this.yFunction = args.yFunction;
            this.zFunction = args.zFunction;
            this.zFunctionOD = args.zFunctionOD ?? args.zFunction;
            this.limitFunction = args.limitFunction;
            this.limitFunctionOD = args.limitFunctionOD ?? args.limitFunction;
            this.inputData = args.inputData;
            this.inputSettings = args.inputSettings;
        }
    }

    const funnelSettings = {
        description: "Funnel Settings",
        displayName: "Data Settings",
        settingsGroups: {
            "all": {
                chart_type: settings.dropdownOption("Chart Type", "Type of funnel plot: an indirectly standardised ratio of observed to expected, a proportion or a rate.", "PR", ["SR", "PR", "RC"], "none", ["Indirectly Standardised (HSMR)", "Proportion", "Rate"]),
                od_adjust: settings.dropdownOption("OD Adjustment", "Widens the limits for overdispersion. Yes adjusts for any estimated overdispersion; "
                    + "Auto only when a chi-squared test detects it.", "no", ["auto", "yes", "no"], "sentence"),
                ...settings.scalingOptions(),
                transformation: settings.dropdownOption("Transformation", "Scale for the plotted values and limits; any transformation turns off % labels.", "none", ["none", "ln", "log10", "sqrt"], "none", ["None", "Natural Log (y+1)", "Log10 (y+1)", "Square-Root"]),
                ttip_show_group: settings.toggleOption("Show Group in Tooltip", "Shows the group name in the tooltip.", true),
                ttip_label_group: settings.textOption("Group Tooltip Label", "Name for the group in the tooltip.", "Group"),
                ...settings.valueTooltipOptions(),
                ...settings.limitTruncationOptions()
            }
        }
    };

    const miscSettings = {
        displayName: "MISC Settings",
        description: "Multi-indicator sigma chart",
        settingsGroups: {
            all: {
                group: { ...settings.textOption("Group", "Group the multi-indicator chart shows, with a bar per indicator; blank shows the first. "
                        + "Conditional formatting gives the group's name, and must give the same one for every row.", ""),
                    type: settings.FormattingComponent.Dropdown, items: [] },
                lower: settings.numberOption("Lower Sigma Bound", "Left end of the z-score axis; must be below 0.", -5, { below: 0 }),
                upper: settings.numberOption("Upper Sigma Bound", "Right end of the z-score axis; must be above 0.", 5, { above: 0 }),
                bar_height: settings.numberOption("Bar Height Ratio", "Share of each row's height the bar fills.", 0.65, { min: 0, max: 1 }),
                unfavourable_label: settings.textOption("Unfavourable Label", "Caption over the unfavourable (left) side.", "Unfavourable"),
                favourable_label: settings.textOption("Favourable Label", "Caption over the favourable (right) side.", "Favourable")
            }
        }
    };

    const outliersSettings = {
        description: "Outlier Settings",
        displayName: "Outlier Settings",
        settingsGroups: {
            "General": settings.flagDirectionOptions(),
            "Three Sigma Outliers": {
                three_sigma: settings.toggleOption("Three Sigma Outliers", "Flags points beyond the 99.8% limits.", false),
                three_sigma_colour_improvement: settings.colourOption("Imp. Three Sigma Colour", "Colour for three-sigma outliers that are an improvement.", "improvement"),
                three_sigma_colour_deterioration: settings.colourOption("Det. Three Sigma Colour", "Colour for three-sigma outliers that are a deterioration.", "deterioration"),
                three_sigma_colour_neutral_low: settings.colourOption("Neutral (Low) Three Sigma Colour", "Colour for points below the lower 99.8% limit when the improvement direction is neutral.", "neutral_low"),
                three_sigma_colour_neutral_high: settings.colourOption("Neutral (High) Three Sigma Colour", "Colour for points above the upper 99.8% limit when the improvement direction is neutral.", "neutral_high")
            },
            "Two Sigma Outliers": {
                two_sigma: settings.toggleOption("Two Sigma Outliers", "Flags points beyond the 95% limits.", false),
                two_sigma_colour_improvement: settings.colourOption("Imp. Two Sigma Colour", "Colour for two-sigma outliers that are an improvement.", "improvement"),
                two_sigma_colour_deterioration: settings.colourOption("Det. Two Sigma Colour", "Colour for two-sigma outliers that are a deterioration.", "deterioration"),
                two_sigma_colour_neutral_low: settings.colourOption("Neutral (Low) Two Sigma Colour", "Colour for points below the lower 95% limit when the improvement direction is neutral.", "neutral_low"),
                two_sigma_colour_neutral_high: settings.colourOption("Neutral (High) Two Sigma Colour", "Colour for points above the upper 95% limit when the improvement direction is neutral.", "neutral_high")
            }
        }
    };

    const scatterSettings = {
        description: "Scatter Settings",
        displayName: "Scatter Settings",
        settingsGroups: {
            "Dots": settings.dotOptions(),
            "Group Text": {
                use_group_text: settings.toggleOption("Show Group Text", "Writes each group's name in place of its point.", false),
                scatter_text_font: settings.fontOption("Group Text Font", "Font of the group names."),
                scatter_text_size: settings.fontSizeOption("Group Text Size", "Font size of the group names, in pixels."),
                scatter_text_colour: settings.colourOption("Group Text Colour", "Colour of the group names.", "standard"),
                scatter_text_opacity: settings.numberOption("Group Text Default Opacity", "Opacity of the group names while nothing is selected.", 1, { min: 0, max: 1 }),
                scatter_text_opacity_selected: settings.numberOption("Group Text Opacity if Selected", "Opacity of selected group names while a selection is active.", 1, { min: 0, max: 1 }),
                scatter_text_opacity_unselected: settings.numberOption("Group Text Opacity if Unselected", "Opacity of the other group names while a selection is active.", 0.2, { min: 0, max: 1 })
            }
        }
    };

    const linesSettings = {
        description: "Line Settings",
        displayName: "Line Settings",
        settingsGroups: {
            "Target": settings.createLineGroup("target", {
                showLabel: "Show Target", showDescription: "Draws the centreline.", showDefault: true,
                width: 1.5, type: "10 0", colour: "standard", rebaselines: false, tooltipLabel: "Centerline"
            }),
            "Alt. Target": settings.createLineGroup("alt_target", {
                showLabel: "Show Alt. Target Line", showDescription: "Draws a line at the Additional Target Value.", showDefault: false,
                width: 1.5, type: "10 0", colour: "standard", rebaselines: false, tooltipLabel: "Alt. Target"
            }, {
                alt_target: settings.numberOption("Additional Target Value:", "Value of the target line, as a plotted value; the transformation applies but not the multiplier.", undefined)
            }),
            "68% Limits": settings.createLineGroup("68", {
                showLabel: "Show 68% Lines", showDescription: "Draws the 68% limits.", showDefault: false,
                width: 2, type: "2 5", colour: "limits", rebaselines: false, tooltipLabel: "68% Limit", tooltipPrefixes: true
            }),
            "95% Limits": settings.createLineGroup("95", {
                showLabel: "Show 95% Lines", showDescription: "Draws the 95% limits.", showDefault: true,
                width: 2, type: "2 5", colour: "limits", rebaselines: false, tooltipLabel: "95% Limit", tooltipPrefixes: true
            }),
            "99% Limits": settings.createLineGroup("99", {
                showLabel: "Show 99% Lines", showDescription: "Draws the 99.8% limits.", showDefault: true,
                width: 2, type: "10 10", colour: "limits", rebaselines: false, tooltipLabel: "99% Limit", tooltipPrefixes: true
            })
        }
    };

    const settingsModel = {
        canvas: settings.createCanvasCard(),
        funnel: settings.defineCard(funnelSettings),
        misc: settings.defineCard(miscSettings),
        outliers: settings.defineCard(outliersSettings),
        scatter: settings.defineCard(scatterSettings),
        lines: settings.defineCard(linesSettings),
        x_axis: settings.createAxisCard("x", { tickRotation: 0, limitUnits: "a denominator" }),
        y_axis: settings.createAxisCard("y", { tickRotation: 0, limitUnits: "a plotted value" }),
        summary_table: settings.createSummaryTableCard({ showDescription: "Shows the groups as a table instead of a chart." }),
        download_options: settings.createDownloadCard(),
        labels: settings.createLabelsCard()
    };
    const defaultSettings = settings.createDefaultValues(settingsModel);

    function derive(settings) {
        const funnel = settings.funnel;
        return data.deriveScaling(funnel, {
            proportion: funnel.chart_type === "PR",
            percentAllowed: funnel.transformation === "none"
        });
    }
    class settingsClass extends powerbi.SettingsStore {
        constructor() {
            super(settingsModel, derive, [settings$1 => settings.orderedBoundsError(settings$1, settings$1.funnel)]);
        }
    }

    function miscFormattingSchema(items) {
        const misc = settingsModel.misc;
        const outliers = settingsModel.outliers;
        const scatter = settingsModel.scatter;
        const lines = settingsModel.lines;
        const x_axis = settingsModel.x_axis;
        const y_axis = settingsModel.y_axis;
        const lineSettings = {};
        const levels = ["target", "95", "99"];
        const properties = ["show", "width", "type", "colour", "opacity", "ttip_show", "ttip_label"];
        for (let i = 0; i < levels.length; i++) {
            for (let j = 0; j < properties.length; j++) {
                const name = `${properties[j]}_${levels[i]}`;
                lineSettings[name] = lines[name];
            }
        }
        return {
            canvas: settingsModel.canvas,
            funnel: settingsModel.funnel,
            misc: { ...misc, settingsGroups: { all: { ...misc.settingsGroups.all, group: { ...misc.group, items } } } },
            outliers: { ...outliers, settingsGroups: { all: {
                        improvement_direction: outliers.improvement_direction, process_flag_type: outliers.process_flag_type,
                        three_sigma_colour_improvement: outliers.three_sigma_colour_improvement,
                        three_sigma_colour_deterioration: outliers.three_sigma_colour_deterioration
                    } } },
            scatter: { ...scatter, displayName: "Bars", settingsGroups: { all: {
                        colour: scatter.colour, opacity: scatter.opacity, opacity_selected: scatter.opacity_selected,
                        opacity_unselected: scatter.opacity_unselected
                    } } },
            lines: { ...lines, settingsGroups: { all: lineSettings } },
            x_axis: { ...x_axis, settingsGroups: {
                    Axis: { xlimit_colour: x_axis.xlimit_colour },
                    Ticks: {
                        xlimit_ticks: x_axis.xlimit_ticks, xlimit_tick_count: x_axis.xlimit_tick_count,
                        xlimit_tick_font: x_axis.xlimit_tick_font, xlimit_tick_size: x_axis.xlimit_tick_size,
                        xlimit_tick_colour: x_axis.xlimit_tick_colour
                    },
                    Label: x_axis.settingsGroups.Label
                } },
            y_axis: { ...y_axis, displayName: "Indicator Labels", settingsGroups: { all: {
                        ylimit_tick_font: y_axis.ylimit_tick_font, ylimit_tick_size: y_axis.ylimit_tick_size,
                        ylimit_tick_colour: y_axis.ylimit_tick_colour
                    } } }
        };
    }

    function validateInputData(keys, numerators, denominators, data_type) {
        const rules = [
            data.missingRule(keys, { name: "Group", plural: "Groups/IDs" }),
            data.missingRule(numerators, data.quantity.numerator),
            data.nanRule(numerators, data.quantity.numerator),
            data.negativeRule(numerators, data.quantity.numerator),
            data.missingRule(denominators, data.quantity.denominator),
            data.nanRule(denominators, data.quantity.denominator),
            { fails: i => !Number.isFinite(denominators[i]), message: "Denominator is not finite", all: "All denominators are not finite!" },
            data.negativeRule(denominators, data.quantity.denominator),
            { fails: i => denominators[i] === 0, message: "Denominator is zero", all: "All denominators are zero!" }
        ];
        if (data_type === "PR") {
            rules.push(data.ratioRule(numerators, denominators));
        }
        return data.validateRows(keys.length, rules);
    }

    function extractInputData(view, inputSettingsClass, rows, group = 0) {
        const keyColumn = view.categories.key[0];
        const keys = new Array(rows.length);
        for (let i = 0; i < rows.length; i++) {
            keys[i] = powerbi.formatPrimitiveValue(keyColumn.values[rows[i]]);
        }
        const numerators = powerbi.readNumbers(view.values.numerators[0], rows);
        const denominators = powerbi.readNumbers(view.values.denominators[0], rows);
        const extracted = powerbi.extractRows(view, rows, {
            keys,
            validation: validateInputData(keys, numerators, denominators, inputSettingsClass.settings[group].funnel.chart_type),
            rowSettings: inputSettingsClass.rowSettings[group],
            settings: { messages: inputSettingsClass.validationStatus.messages, messagePositionByRowIndex: inputSettingsClass.messagePositionByRowIndex }
        });
        if (extracted.status === "invalid") {
            return extracted;
        }
        const { kept, warnings, ...annotations } = extracted.data;
        const id = new Array(kept.length);
        const keyRows = new Array(kept.length);
        const keptNumerators = new Array(kept.length);
        const keptDenominators = new Array(kept.length);
        for (let x = 0; x < kept.length; x++) {
            const i = kept[x];
            id[x] = rows[i];
            keyRows[x] = { x, id: rows[i], label: data.keptValue(keys, i) };
            keptNumerators[x] = data.keptValue(numerators, i);
            keptDenominators[x] = data.keptValue(denominators, i);
        }
        return { status: "valid", data: {
                ...annotations, keys: keyRows, id, numerators: keptNumerators, denominators: keptDenominators,
                warningMessage: warnings.join("\n")
            } };
    }
    function lacksCount(data, chartType) {
        if (chartType !== "RC") {
            return false;
        }
        for (let i = 0; i < data.numerators.length; i++) {
            if (data.numerators[i] > 0) {
                return false;
            }
        }
        return true;
    }

    function axisRanges(viewModel) {
        const inputData = viewModel.inputData;
        if (inputData === undefined) {
            throw new Error("Axis ranges require validated data.");
        }
        const settings = viewModel.inputSettings.settings[0];
        let yUpperLimit = settings.y_axis.ylimit_u;
        if (yUpperLimit === undefined) {
            yUpperLimit = -Infinity;
            for (let i = 0; i < viewModel.plotPoints.length; i++) {
                yUpperLimit = Math.max(yUpperLimit, viewModel.plotPoints[i].value);
            }
        }
        return {
            x: { lower: settings.x_axis.xlimit_l ?? 0, upper: settings.x_axis.xlimit_u ?? math.max(inputData.denominators) * 1.1 },
            y: { lower: settings.y_axis.ylimit_l ?? 0, upper: yUpperLimit }
        };
    }

    const transformations = {
        none: function (x) { return x; },
        ln: function (x) { return Math.log(x + 1); },
        log10: function (x) { return Math.log10(x + 1); },
        sqrt: Math.sqrt
    };
    function getTransformation(setting_name) {
        return transformations[setting_name];
    }

    const valueLabel = {
        "PR": "Proportion",
        "SR": "Standardised Ratio",
        "RC": "Rate"
    };
    function buildTooltip(index, limits, outliers, inputData, inputSettings, derivedSettings) {
        const data_type = inputSettings.funnel.chart_type;
        const multiplier = derivedSettings.multiplier;
        const transform_text = inputSettings.funnel.transformation;
        const transform = getTransformation(transform_text);
        const group = inputData.keys[index].label;
        const numerator = inputData.numerators[index];
        const denominator = inputData.denominators[index];
        const ratio = transform((numerator / denominator) * multiplier);
        const formatValues = derivedSettings.formatValue;
        const tooltip = new Array();
        if (inputSettings.funnel.ttip_show_group) {
            tooltip.push({
                displayName: inputSettings.funnel.ttip_label_group,
                value: group
            });
        }
        tooltip.push(...powerbi.valueTooltips(inputSettings.funnel, { value: ratio, numerator, denominator }, valueLabel[data_type], formatValues));
        tooltip.push(...powerbi.limitTooltips(inputSettings.lines, limits, formatValues, true));
        if (transform_text !== "none") {
            const transformations = settingsModel.funnel.settingsGroups.all.transformation.items;
            for (let i = 0; i < transformations.length; i++) {
                if (transformations[i].value === transform_text) {
                    tooltip.push({
                        displayName: "Plot Scaling",
                        value: transformations[i].displayName
                    });
                }
            }
        }
        const patterns = new Array();
        if (outliers.three_sigma) {
            patterns.push("Three Sigma Outlier");
        }
        if (outliers.two_sigma) {
            patterns.push("Two Sigma Outlier");
        }
        powerbi.appendPatternTooltips(tooltip, patterns, inputData.tooltips[index]);
        return tooltip;
    }

    function adjustZScores(_inputData, args) {
        const zScores = args.zScores;
        const SE = args.SE;
        const result = new Array(zScores.length);
        for (let i = 0; i < zScores.length; i++) {
            result[i] = (zScores[i] * SE[i]) / Math.sqrt(Math.pow(SE[i], 2) + args.tau2);
        }
        return result;
    }

    const smrSE = function (inputData, plottingDenominators) {
        const denominators = plottingDenominators ?? inputData.denominators;
        const n = denominators.length;
        const result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = 1.0 / (2 * Math.sqrt(denominators[i]));
        }
        return result;
    };
    const smrTarget = function () {
        return 1;
    };
    const smrY = function (inputData) {
        const numerators = inputData.numerators;
        const denominators = inputData.denominators;
        const n = numerators.length;
        const result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = Math.sqrt(numerators[i] / denominators[i]);
        }
        return result;
    };
    const smrZ = function (inputData) {
        const numerators = inputData.numerators;
        const denominators = inputData.denominators;
        const n = numerators.length;
        const rtn = new Array(n);
        for (let i = 0; i < n; i++) {
            const ratio = numerators[i] / denominators[i];
            const offset = ratio > 1 ? 1 : 0;
            const log_p = math.chisqCDF(ratio * 2 * denominators[i], 2 * (denominators[i] + offset), true, true);
            rtn[i] = math.normalQuantile(log_p, 0, 1, true, true);
        }
        return rtn;
    };
    const smrLimitOD = function (args) {
        const target = args.target_transformed;
        const q = args.q;
        const SE = args.SE;
        const tau2 = args.tau2;
        const limit_transformed = target + q * Math.sqrt(Math.pow(SE, 2) + tau2);
        return Math.pow(math.clamp(limit_transformed, 0, undefined), 2);
    };
    const smrLimit = function (args) {
        const denominators = args.denominators;
        const p = args.p;
        const is_upper = p > 0.5;
        const offset = is_upper ? 1 : 0;
        const limit = (math.chisqQuantile(p, 2 * (denominators + offset)) / 2.0)
            / denominators;
        return math.clamp(limit, 0, undefined);
    };
    class smrFunnelClass extends chartClass {
        constructor(inputData, inputSettings) {
            super({
                seFunction: smrSE,
                targetFunction: smrTarget,
                targetFunctionTransformed: smrTarget,
                yFunction: smrY,
                zFunction: smrZ,
                zFunctionOD: adjustZScores,
                limitFunction: smrLimit,
                limitFunctionOD: smrLimitOD,
                inputData: inputData,
                inputSettings: inputSettings
            });
        }
    }

    const prSE = function (inputData, plottingDenominators) {
        const denominators = plottingDenominators ?? inputData.denominators;
        const n = denominators.length;
        const result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = 1.0 / (2 * Math.sqrt(denominators[i]));
        }
        return result;
    };
    const prTarget = function (inputData) {
        const numerators = inputData.numerators;
        const denominators = inputData.denominators;
        return math.sum(numerators) / math.sum(denominators);
    };
    const prTargetTransformed = function (inputData) {
        return Math.asin(Math.sqrt(prTarget(inputData)));
    };
    const prY = function (inputData) {
        const numerators = inputData.numerators;
        const denominators = inputData.denominators;
        const n = numerators.length;
        const result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = Math.asin(Math.sqrt(numerators[i] / denominators[i]));
        }
        return result;
    };
    const prZ = function (_inputData, args) {
        return args.zScores;
    };
    const prLimit = function (args) {
        const target = args.target_transformed;
        const q = args.q;
        const SE = args.SE;
        const tau2 = args.tau2;
        const limit_transformed = target + q * Math.sqrt(Math.pow(SE, 2) + tau2);
        return Math.pow(Math.sin(math.clamp(limit_transformed, 0, Math.PI / 2)), 2);
    };
    class prFunnelClass extends chartClass {
        constructor(inputData, inputSettings) {
            super({
                seFunction: prSE,
                targetFunction: prTarget,
                targetFunctionTransformed: prTargetTransformed,
                yFunction: prY,
                zFunction: prZ,
                zFunctionOD: adjustZScores,
                limitFunction: prLimit,
                inputData: inputData,
                inputSettings: inputSettings
            });
        }
    }

    const rcSE = function (inputData, plottingDenominators) {
        const numerators = inputData.numerators;
        const denominators = plottingDenominators ?? inputData.denominators;
        const target = plottingDenominators === undefined ? undefined : rcTarget(inputData);
        const result = new Array(denominators.length);
        for (let i = 0; i < denominators.length; i++) {
            const denominator = denominators[i];
            const numerator = target === undefined ? numerators[i] : target * denominator;
            result[i] = Math.sqrt(numerator / Math.pow(numerator + 0.5, 2) + denominator / Math.pow(denominator + 0.5, 2));
        }
        return result;
    };
    const rcTarget = function (inputData) {
        const numerators = inputData.numerators;
        const denominators = inputData.denominators;
        return math.sum(numerators) / math.sum(denominators);
    };
    const rcTargetTransformed = function (inputData) {
        const numerators = inputData.numerators;
        const denominators = inputData.denominators;
        return Math.log(math.sum(numerators)) - Math.log(math.sum(denominators));
    };
    const rcY = function (inputData) {
        const numerators = inputData.numerators;
        const denominators = inputData.denominators;
        const n = numerators.length;
        const result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = Math.log((numerators[i] + 0.5) / (denominators[i] + 0.5));
        }
        return result;
    };
    const rcZ = function (inputData, args) {
        const numerators = inputData.numerators;
        const denominators = inputData.denominators;
        const target = rcTargetTransformed(inputData);
        const SE = rcSE(inputData, denominators);
        const result = new Array(numerators.length);
        for (let i = 0; i < numerators.length; i++) {
            result[i] = (Math.log(numerators[i] / denominators[i]) - target) / Math.sqrt(Math.pow(SE[i], 2) + args.tau2);
        }
        return result;
    };
    const rcLimit = function (args) {
        const target = args.target_transformed;
        const q = args.q;
        const SE = args.SE;
        const tau2 = args.tau2;
        const limit_transformed = target + q * Math.sqrt(Math.pow(SE, 2) + tau2);
        const limit = Math.exp(limit_transformed);
        return math.clamp(limit, 0, undefined);
    };
    class rcFunnelClass extends chartClass {
        constructor(inputData, inputSettings) {
            super({
                seFunction: rcSE,
                targetFunction: rcTarget,
                targetFunctionTransformed: rcTargetTransformed,
                yFunction: rcY,
                zFunction: rcZ,
                limitFunction: rcLimit,
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

    function tableColumns(settings$1) {
        const columns = [{ name: "group", label: settings$1.funnel.ttip_label_group }, { name: "value", label: "Value" }];
        if (settings$1.funnel.ttip_show_numerator) {
            columns.push({ name: "numerator", label: "Numerator" });
        }
        if (settings$1.funnel.ttip_show_denominator) {
            columns.push({ name: "denominator", label: "Denominator" });
        }
        columns.push(...settings.limitColumns(settings$1.lines, true));
        if (settings$1.outliers.three_sigma) {
            columns.push({ name: "three_sigma", label: "Three Sigma" });
        }
        if (settings$1.outliers.two_sigma) {
            columns.push({ name: "two_sigma", label: "Two Sigma" });
        }
        return columns;
    }
    class viewModelClass extends rendering.PlotViewModelBase {
        constructor(host) {
            super(host, new settingsClass(), ["numerators", "denominators"]);
            this.inputData = undefined;
            this.chartBase = undefined;
            this.calculatedLimits = [];
            this.plotPoints = [];
            this.tableColumns = [];
            this.groupedLines = [];
            this.funnelResults = [];
            this.showMisc = false;
            this.miscGroups = [];
            this.miscGroup = "";
            this.miscPoints = [];
            this.miscAnyHighlights = false;
        }
        get periodEnds() {
            return [this.calculatedLimits.length - 1];
        }
        get anyLabels() {
            return this.inputData?.anyLabels ?? false;
        }
        getFormattingModel() {
            const settings = this.inputSettings.settings[0];
            if (this.showMisc) {
                return powerbi.buildFormattingModel(miscFormattingSchema(this.miscGroups), { ...settings, misc: { ...settings.misc, group: this.miscGroup } });
            }
            const { misc, ...funnelModel } = settingsModel;
            return powerbi.buildFormattingModel(funnelModel, settings);
        }
        get hasAxes() {
            return !this.showMisc;
        }
        axisRanges() {
            return axisRanges(this);
        }
        reset() {
            this.inputData = undefined;
            this.chartBase = undefined;
            this.calculatedLimits = [];
            this.plotPoints = [];
            this.groupedLines = [];
            this.funnelResults = [];
            this.miscPoints = [];
            this.miscAnyHighlights = false;
        }
        updateData(view, indicatorGroups, host) {
            this.showMisc = (view.categories.indicator ?? []).length > 0;
            this.funnelResults = [];
            this.miscGroups = [];
            this.miscPoints = [];
            this.miscAnyHighlights = false;
            if (this.showMisc) {
                return this.initialiseMisc(view, host, indicatorGroups);
            }
            const result = extractInputData(view, this.inputSettings, indicatorGroups.rows[0]);
            if (result.status === "invalid") {
                return { errors: [result.error], warnings: [] };
            }
            const group = this.inputSettings.group(0);
            if (lacksCount(result.data, group.settings.funnel.chart_type)) {
                return { errors: ["All numerators are zero, so RC limits cannot be calculated."], warnings: [] };
            }
            this.inputData = result.data;
            this.chartBase = new chartObjects[group.settings.funnel.chart_type](result.data, group);
            this.calculatedLimits = this.chartBase.getLimits();
            this.scaleAndTruncateLimits();
            this.initialisePlotData(host, result.data, this.chartBase);
            this.funnelResults.push({ indicators: {}, points: this.plotPoints, limits: this.calculatedLimits, settings: group.settings });
            this.initialiseGroupedLines();
            return { errors: [], warnings: result.data.warningMessage === "" ? [] : [result.data.warningMessage] };
        }
        initialiseMisc(view, host, indicators) {
            const keyColumn = view.categories.key[0];
            const groups = powerbi.groupCategoryRows([keyColumn], keyColumn.values.length);
            const items = this.miscGroups;
            const rowsByGroup = new Map();
            for (let i = 0; i < groups.rows.length; i++) {
                if (keyColumn.values[groups.rows[i][0]] == null) {
                    continue;
                }
                items.push({ displayName: groups.names[i][0], value: groups.keys[i] });
                rowsByGroup.set(groups.keys[i], groups.rows[i]);
            }
            const requested = this.inputSettings.settings[0].misc.group;
            for (let i = 0; i < this.inputSettings.rowSettings.length; i++) {
                const rows = this.inputSettings.rowSettings[i];
                for (let j = 0; j < rows.length; j++) {
                    if (rows[j].misc.group !== requested) {
                        return { errors: ["The MISC group must be the same for every row."], warnings: [] };
                    }
                }
            }
            this.miscGroup = requested === "" && items.length > 0 ? items[0].value : requested;
            for (let i = 0; i < items.length; i++) {
                if (items[i].value === requested || items[i].displayName === requested) {
                    this.miscGroup = items[i].value;
                    break;
                }
            }
            const targetRows = rowsByGroup.get(this.miscGroup);
            if (targetRows === undefined) {
                return { errors: ["Select a MISC group present in the data."], warnings: [] };
            }
            const selectedRows = new Set(targetRows);
            const errors = [];
            const warnings = [];
            this.inputData = undefined;
            for (let i = 0; i < indicators.rows.length; i++) {
                const rows = indicators.rows[i];
                const group = this.inputSettings.group(i);
                const indicator = indicators.labels[i];
                const rowSettings = this.inputSettings.rowSettings[i];
                const direction = rowSettings[0].outliers.improvement_direction;
                let oneDirection = direction !== "neutral";
                for (let j = 1; oneDirection && j < rowSettings.length; j++) {
                    oneDirection = rowSettings[j].outliers.improvement_direction === direction;
                }
                if (!oneDirection) {
                    errors.push(powerbi.labelledMessage(indicator, "Each MISC indicator must have one improvement direction: increase or decrease."));
                    continue;
                }
                const result = extractInputData(view, this.inputSettings, rows, i);
                if (result.status === "invalid") {
                    errors.push(powerbi.labelledMessage(indicator, result.error));
                    continue;
                }
                const data = result.data;
                if (lacksCount(data, group.settings.funnel.chart_type)) {
                    warnings.push(powerbi.labelledMessage(indicator, "All numerators are zero, so RC limits cannot be calculated and the indicator is not shown."));
                    continue;
                }
                this.inputData ?? (this.inputData = data);
                if (data.warningMessage !== "") {
                    warnings.push(powerbi.labelledMessage(indicator, data.warningMessage));
                }
                this.miscAnyHighlights || (this.miscAnyHighlights = data.anyHighlights);
                const chart = new chartObjects[group.settings.funnel.chart_type](data, group);
                this.calculatedLimits = chart.getLimits();
                this.scaleAndTruncateLimits(group);
                this.initialisePlotData(host, data, chart, group, { two_sigma: false, three_sigma: true });
                const indicatorValues = {};
                const indicatorColumns = view.categories.indicator ?? [];
                for (let j = 0; j < indicatorColumns.length; j++) {
                    const column = indicatorColumns[j];
                    indicatorValues[column.source.displayName] = powerbi.formatPrimitiveValue(column.values[rows[0]]);
                }
                this.funnelResults.push({
                    indicators: indicatorValues, points: this.plotPoints, limits: this.calculatedLimits, settings: group.settings
                });
                for (let j = 0; j < data.id.length; j++) {
                    const row = data.id[j];
                    if (!selectedRows.has(row)) {
                        continue;
                    }
                    const point = this.plotPoints[j];
                    const score = point.z * (direction === "decrease" ? -1 : 1);
                    this.miscPoints.push({
                        ...point,
                        indicator,
                        score,
                        tooltip: [
                            { displayName: "Indicator", value: indicator },
                            { displayName: "Z-score", value: score.toFixed(3) },
                            ...point.tooltip
                        ]
                    });
                }
            }
            this.chartBase = undefined;
            this.calculatedLimits = [];
            this.plotPoints = [];
            this.groupedLines = [];
            if (errors.length === 0 && (this.inputData === undefined || this.miscPoints.length === 0)) {
                errors.push("The selected MISC group has no valid indicator results.");
            }
            return { errors, warnings };
        }
        initialisePlotData(host, inputData, chart, inputSettings = this.inputSettings.group(0), flags = inputSettings.settings.outliers) {
            this.plotPoints = new Array();
            this.tableColumns = tableColumns(inputSettings.settings);
            const transform = getTransformation(inputSettings.settings.funnel.transformation);
            const multiplier = inputSettings.derivedSettings.multiplier;
            const flag_two_sigma = flags.two_sigma;
            const flag_three_sigma = flags.three_sigma;
            const zScores = chart.getZ();
            const flagSettings = {
                process_flag_type: inputSettings.settings.outliers.process_flag_type,
                improvement_direction: inputSettings.settings.outliers.improvement_direction
            };
            const limitsByDenominator = new Map();
            for (let i = 0; i < this.calculatedLimits.length; i++) {
                limitsByDenominator.set(this.calculatedLimits[i].denominators, this.calculatedLimits[i]);
            }
            for (let i = 0; i < inputData.id.length; i++) {
                const original_index = inputData.id[i];
                const numerator = inputData.numerators[i];
                const denominator = inputData.denominators[i];
                const value = transform((numerator / denominator) * multiplier);
                const limits = limitsByDenominator.get(denominator);
                if (limits === undefined) {
                    throw new Error("Missing limits for an observed denominator.");
                }
                const aesthetics = { ...inputData.scatter_formatting[i] };
                if (this.colourPalette.isHighContrast) {
                    aesthetics.colour = this.colourPalette.foregroundColour;
                }
                const two_sigma_outlier = data.checkFlagDirection(flag_two_sigma ? spc.limitStatus(value, limits.ll95, limits.ul95) : "none", flagSettings);
                const three_sigma_outlier = data.checkFlagDirection(flag_three_sigma ? spc.limitStatus(value, limits.ll99, limits.ul99) : "none", flagSettings);
                const category = inputData.keys[i].label;
                data.applyFlagColours(aesthetics, inputSettings.settings.outliers, [
                    [two_sigma_outlier, "two_sigma_colour"], [three_sigma_outlier, "three_sigma_colour"]
                ]);
                this.plotPoints.push({
                    id: original_index,
                    x: denominator,
                    numerator: numerator,
                    value: value,
                    z: zScores[i],
                    group_text: category,
                    limits,
                    table_row: {
                        group: category, numerator, denominator, value,
                        target: limits.target, alt_target: limits.alt_target,
                        ll99: limits.ll99, ll95: limits.ll95, ll68: limits.ll68, ul68: limits.ul68, ul95: limits.ul95, ul99: limits.ul99,
                        two_sigma: two_sigma_outlier, three_sigma: three_sigma_outlier
                    },
                    aesthetics: aesthetics,
                    identity: powerbi.rowIdentity(host, inputData.identityColumns, original_index),
                    highlighted: inputData.highlights[i] !== undefined,
                    tooltip: buildTooltip(i, limits, { two_sigma: two_sigma_outlier !== "none", three_sigma: three_sigma_outlier !== "none" }, inputData, inputSettings.settings, inputSettings.derivedSettings),
                    label: {
                        text_value: inputData.labels[i],
                        aesthetics: inputData.label_formatting[i],
                        angle: undefined,
                        distance: undefined
                    },
                    two_sigma: two_sigma_outlier,
                    three_sigma: three_sigma_outlier
                });
            }
        }
        initialiseGroupedLines() {
            const labels = [];
            if (this.inputSettings.settings[0].lines.show_target) {
                labels.push("target");
            }
            if (this.inputSettings.settings[0].lines.show_alt_target) {
                labels.push("alt_target");
            }
            if (this.inputSettings.settings[0].lines.show_99) {
                labels.push("ll99", "ul99");
            }
            if (this.inputSettings.settings[0].lines.show_95) {
                labels.push("ll95", "ul95");
            }
            if (this.inputSettings.settings[0].lines.show_68) {
                labels.push("ll68", "ul68");
            }
            const lines = new Array(labels.length);
            for (let j = 0; j < labels.length; j++) {
                lines[j] = [labels[j], []];
            }
            for (let i = 0; i < this.calculatedLimits.length; i++) {
                const limits = this.calculatedLimits[i];
                for (let j = 0; j < labels.length; j++) {
                    const label = labels[j];
                    lines[j][1].push({ x: limits.denominators, line_value: limits[label], group: label });
                }
            }
            this.groupedLines = lines;
        }
        scaleAndTruncateLimits(inputSettings = this.inputSettings.group(0)) {
            const multiplier = inputSettings.derivedSettings.multiplier;
            const transform = getTransformation(inputSettings.settings.funnel.transformation);
            const lower = inputSettings.settings.funnel.ll_truncate;
            const upper = inputSettings.settings.funnel.ul_truncate;
            for (let i = 0; i < this.calculatedLimits.length; i++) {
                const limit = this.calculatedLimits[i];
                limit.target = transform(limit.target * multiplier);
                for (let j = 0; j < settings.limitLineNames.length; j++) {
                    const name = settings.limitLineNames[j];
                    const value = limit[name];
                    if (value !== undefined) {
                        limit[name] = math.clamp(transform(value * multiplier), lower, upper);
                    }
                }
                if (limit.alt_target !== undefined) {
                    limit.alt_target = transform(limit.alt_target);
                }
            }
        }
    }

    const columnKinds = {
        value: "number", target: "number", alt_target: "number",
        ll99: "number", ll95: "number", ll68: "number", ul68: "number", ul95: "number", ul99: "number",
        numerator: "input", denominator: "input",
        two_sigma: "flag", three_sigma: "flag"
    };
    class Visual extends rendering.PlotVisual {
        constructor(options) {
            super(options, host => new viewModelClass(host));
            this.lineKeys = settings.standardLineKeys;
            this.tableDiv = rendering.createTableContainer(this.element);
        }
        resizeCanvas(width, height) {
            super.resizeCanvas(width, height);
            rendering.showTable(this.tableDiv, width === 0 && height === 0);
        }
        get settings() {
            return this.viewModel.inputSettings.settings[0];
        }
        drawAlternate() {
            const viewModel = this.viewModel;
            if (viewModel.showMisc) {
                this.svg.call(drawMisc, this);
                return "svg";
            }
            const svg = this.svg.node();
            if (svg !== null && !this.svg.select(".misc-root").empty()) {
                rendering.initialiseSvg(svg, true);
            }
            if (!this.settings.summary_table.show_table) {
                return undefined;
            }
            this.resizeCanvas(0, 0);
            rendering.drawSummaryTable(this.tableDiv, {
                columns: viewModel.tableColumns,
                rows: viewModel.plotPoints,
                kinds: columnKinds,
                settings: this.settings.summary_table,
                formatValue: viewModel.inputSettings.derivedSettings[0].formatValue,
                width: viewModel.svgWidth,
                host: this.host,
                selectionManager: this.selectionManager,
                onSelectionChange: () => this.updateHighlighting()
            });
            this.addContextMenu(this.tableDiv.node(), true);
            return "table";
        }
        updateHighlighting() {
            const viewModel = this.viewModel;
            if (viewModel.showMisc) {
                const state = powerbi.selectionState(this.selectionManager, viewModel.miscAnyHighlights);
                this.svg.selectAll(".misc-bar").attr("opacity", point => rendering.highlightOpacity(point.aesthetics, state.active, powerbi.identitySelected(point.identity, state.selected) || point.highlighted));
                return;
            }
            const state = powerbi.selectionState(this.selectionManager, viewModel.inputData ? viewModel.inputData.anyHighlights : false);
            const settings = this.settings;
            const table = settings.summary_table;
            rendering.highlightTable(this.tableDiv, state, () => ({
                opacity: table.table_opacity, opacity_selected: table.table_opacity_selected, opacity_unselected: table.table_opacity_unselected
            }));
            this.highlightPlotPoints(state, point => settings.scatter.use_group_text
                ? {
                    opacity: point.aesthetics.scatter_text_opacity,
                    opacity_selected: point.aesthetics.scatter_text_opacity_selected,
                    opacity_unselected: point.aesthetics.scatter_text_opacity_unselected
                }
                : point.aesthetics);
        }
        plotOptions() {
            const settings$1 = this.settings;
            return {
                tickFormats: {
                    x: undefined,
                    y: rendering.valueTickFormat(settings$1.y_axis.ylimit_sig_figs ?? settings$1.funnel.sig_figs, this.viewModel.inputSettings.derivedSettings[0].percentLabels)
                },
                verticalCrosshair: true,
                lineSettings: () => settings$1.lines,
                lowerLines: settings.lowerLimitLines,
                dots: {
                    show: true,
                    text: settings$1.scatter.use_group_text
                        ? point => ({
                            text: point.group_text, size: point.aesthetics.scatter_text_size,
                            font: point.aesthetics.scatter_text_font, colour: point.aesthetics.scatter_text_colour
                        })
                        : undefined,
                    onClick: undefined
                }
            };
        }
    }

    const limitColumns = [
        "denominator", "group", "numerator", "value", "z", "score", "two_sigma", "three_sigma",
        "target", "alt_target", "ll99", "ll95", "ll68", "ul68", "ul95", "ul99"
    ];
    function limitRow(fields, limits, includeAltTarget) {
        const row = {};
        const fieldNames = Object.keys(fields);
        for (let i = 0; i < fieldNames.length; i++) {
            row[fieldNames[i]] = frontends.limitValue(fields[fieldNames[i]]);
        }
        const limitValues = limits;
        const limitNames = Object.keys(limitValues);
        for (let i = 0; i < limitNames.length; i++) {
            const name = limitNames[i];
            if (name !== "denominators" && (includeAltTarget || name !== "alt_target")) {
                row[name] = frontends.limitValue(limitValues[name]);
            }
        }
        return row;
    }
    function appendResults(rows, rowIds, limitLines, result, showScore) {
        const settings = result.settings;
        const showAltTarget = settings.lines.alt_target != null;
        const points = result.points.slice().sort((a, b) => a.x - b.x);
        const indicators = frontends.indicatorFields(result.indicators, limitColumns);
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const fields = {
                ...indicators,
                denominator: point.x,
                group: point.group_text,
                numerator: point.numerator,
                value: point.value,
                z: point.z
            };
            if (showScore) {
                fields.score = point.z * (settings.outliers.improvement_direction === "decrease" ? -1 : 1);
            }
            if (settings.outliers.two_sigma) {
                fields.two_sigma = showScore
                    ? data.checkFlagDirection(spc.limitStatus(point.value, point.limits.ll95, point.limits.ul95), settings.outliers)
                    : point.two_sigma;
            }
            if (settings.outliers.three_sigma || showScore) {
                fields.three_sigma = point.three_sigma;
            }
            rows.push(limitRow(fields, point.limits, showAltTarget));
            rowIds.push(point.id);
        }
        for (let i = 0; i < result.limits.length; i++) {
            const limits = result.limits[i];
            limitLines.push(limitRow({ ...indicators, denominator: limits.denominators }, limits, showAltTarget));
        }
    }
    const frontend = {
        Visual,
        settingsModel,
        limitColumns,
        limits: visual => {
            const viewModel = visual.viewModel;
            const limits = [];
            const rowIds = [];
            const limitLines = [];
            for (let i = 0; i < viewModel.funnelResults.length; i++) {
                appendResults(limits, rowIds, limitLines, viewModel.funnelResults[i], viewModel.showMisc);
            }
            return { limits, rowIds, limitLines };
        }
    };

    frontends.registerChart('funnel', frontend);

    exports.Visual = Visual;
    exports.defaultSettings = defaultSettings;

    return exports;

})({}, ccCore, ccCore, ccCore, ccCore, ccCore, ccCore, ccCore);
