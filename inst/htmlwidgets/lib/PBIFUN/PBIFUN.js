var funnel = (function (exports, settings, rendering, math, powerbi, data, spc) {
    'use strict';

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
                group: { ...settings.textOption("Group", "Group the multi-indicator chart shows, with a bar per indicator.", ""), type: settings.FormattingComponent.Dropdown, constant: true,
                    items: [] },
                lower: settings.numberOption("Lower Sigma Bound", "Left end of the z-score axis; must be below 0.", -5),
                upper: settings.numberOption("Upper Sigma Bound", "Right end of the z-score axis; must be above 0.", 5),
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
        download_options: settings.createDownloadCard(),
        labels: settings.createLabelsCard()
    };
    const defaultSettings = settings.createDefaultValues(settingsModel);

    function drawMisc(svg, visual) {
        svg.selectChildren().remove();
        const model = visual.viewModel;
        const settings = model.inputSettings.settings;
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
            { value: -3.090232306167813, level: "99" }, { value: 3.090232306167813, level: "99" },
            { value: -1.959963984540054, level: "95" }, { value: 1.959963984540054, level: "95" },
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
        const z_sorted = [...z].sort(function (a, b) { return a - b; });
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
        if (N * phi < N - 1) {
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

    class chartClass {
        getPlottingDenominators() {
            const plotDenomLower = 1;
            const plotDenomUpper = Math.max(math.max(this.inputData.denominators) * 1.1, this.inputSettings.settings.x_axis.xlimit_u ?? -Infinity);
            const plotDenomSteps = 110;
            const candidates = this.inputData.denominators.slice();
            if (plotDenomUpper > plotDenomLower) {
                const plotDenomStep = (plotDenomUpper - plotDenomLower) / plotDenomSteps;
                for (let i = 0; i < plotDenomSteps; i++) {
                    candidates.push(plotDenomLower + i * plotDenomStep);
                }
                candidates.push(plotDenomUpper);
            }
            const unique = [];
            for (let i = 0; i < candidates.length; i++) {
                if (candidates.indexOf(candidates[i]) === i) {
                    unique.push(candidates[i]);
                }
            }
            return unique.sort((a, b) => a - b);
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
            const N = this.variance.zScores.length;
            switch (this.inputSettings.settings.funnel.od_adjust) {
                case "yes":
                    return this.variance.tau2 > 0;
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
            const qs = [
                -3.090232306167813,
                -1.9599639845400538,
                -0.9944578832097528,
                0.99445788320975281316,
                1.95996398454005360534,
                3.09023230616781319213
            ];
            const result = new Array(qs.length);
            for (let i = 0; i < qs.length; i++) {
                result[i] = { prob: probs[i], quantile: qs[i], label: settings.limitLineNames[i] };
            }
            return result;
        }
        getLimits() {
            const tau2 = this.getTau2();
            this.odAdjust = this.getODAdjust();
            const curr_tau2 = this.odAdjust ? tau2 : 0;
            const target = this.getTarget({ transformed: false });
            const alt_target = this.inputSettings.settings.lines.alt_target;
            const target_transformed = this.getTarget({ transformed: true });
            const intervals = this.getIntervals();
            const plottingDenominators = this.getPlottingDenominators();
            const plottingSE = this.getSE({
                odAdjust: this.odAdjust,
                plottingDenominators: plottingDenominators
            });
            const calcLimits = new Array(plottingDenominators.length);
            for (let idx = 0; idx < plottingDenominators.length; idx++) {
                const denom = plottingDenominators[idx];
                const row = { denominators: denom, target, alt_target,
                    ll99: undefined, ll95: undefined, ll68: undefined, ul68: undefined, ul95: undefined, ul99: undefined };
                for (let i = 0; i < intervals.length; i++) {
                    const interval = intervals[i];
                    const functionArgs = {
                        p: interval.prob,
                        q: interval.quantile,
                        target_transformed: target_transformed,
                        SE: plottingSE[idx],
                        tau2: curr_tau2,
                        denominators: denom
                    };
                    const limit = this.getSingleLimit({
                        odAdjust: this.odAdjust,
                        inputArgs: functionArgs
                    });
                    row[interval.label] = limit;
                }
                calcLimits[idx] = row;
            }
            const levels = ["99", "95", "68"];
            for (let idx = 0; idx < calcLimits.length - 1; idx++) {
                const inner = calcLimits[idx];
                const next = calcLimits[idx + 1];
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
            return calcLimits;
        }
        constructor(args) {
            this.seFunction = args.seFunction;
            this.seFunctionOD = args.seFunctionOD;
            this.targetFunction = args.targetFunction;
            this.targetFunctionTransformed = args.targetFunctionTransformed;
            this.yFunction = args.yFunction;
            this.zFunction = args.zFunction;
            this.zFunctionOD = args.zFunctionOD;
            this.limitFunction = args.limitFunction;
            this.limitFunctionOD = args.limitFunctionOD;
            this.inputData = args.inputData;
            this.inputSettings = args.inputSettings;
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

    function derive(settings) {
        const funnel = settings.funnel;
        return data.deriveScaling(funnel, {
            proportion: funnel.chart_type === "PR",
            wholeCounts: funnel.chart_type !== "SR",
            percentAllowed: funnel.transformation === "none"
        });
    }
    class settingsClass {
        update(view, groups) {
            const result = powerbi.readSettingsGroups(settingsModel, view.category, groups, [settings$1 => settings.orderedBoundsError(settings$1, settings$1.funnel)]);
            this.groupSettings = result.values;
            this.settings = result.values[0];
            this.validationStatus = result.validation;
            this.messagePositionByRowIndex = result.messagePositionByRowIndex;
            const selectedGroup = view.dataView.metadata.objects?.misc?.group;
            this.settings.misc.group = typeof selectedGroup === "string" ? selectedGroup : "";
            this.derivedSettings = derive(this.settings);
        }
        forGroup(index) {
            const result = new settingsClass(this.groupSettings[index]);
            result.validationStatus = this.validationStatus;
            result.messagePositionByRowIndex = this.messagePositionByRowIndex;
            return result;
        }
        getFormattingModel() {
            const { misc, ...funnelModel } = settingsModel;
            if (!this.showMisc) {
                return powerbi.buildFormattingModel(funnelModel, this.settings);
            }
            return powerbi.buildFormattingModel(miscFormattingSchema(this.miscGroups), this.settings);
        }
        constructor(settings$1 = settings.createDefaultValues(settingsModel)) {
            this.groupSettings = [];
            this.messagePositionByRowIndex = new Map();
            this.miscGroups = [];
            this.showMisc = false;
            this.validationStatus = { status: 0, messages: [] };
            this.settings = settings$1;
            this.derivedSettings = derive(settings$1);
        }
    }

    function validateInputData(keys, numerators, denominators, data_type) {
        const at = (values, i) => values[i] ?? NaN;
        const rules = [
            { fails: i => keys[i] === undefined, message: "Group missing", all: "All Groups/IDs are missing or null!" },
            { fails: i => numerators[i] === undefined, message: "Numerator missing", all: "All numerators are missing or null!" },
            { fails: i => Number.isNaN(at(numerators, i)), message: "Numerator is not a number", all: "All numerators are not numbers!" },
            { fails: i => at(numerators, i) < 0, message: "Numerator negative", all: "All numerators are negative!" },
            { fails: i => denominators[i] === undefined, message: "Denominator missing", all: "All denominators missing or null!" },
            { fails: i => Number.isNaN(at(denominators, i)), message: "Denominator is not a number", all: "All denominators are not numbers!" },
            { fails: i => !Number.isFinite(denominators[i]), message: "Denominator is not finite", all: "All denominators are not finite!" },
            { fails: i => at(denominators, i) < 0, message: "Denominator negative", all: "All denominators are negative!" },
            { fails: i => denominators[i] === 0, message: "Denominator is zero", all: "All denominators are zero!" }
        ];
        if (data_type === "PR") {
            rules.push({
                fails: i => !(at(denominators, i) >= at(numerators, i)),
                message: "Denominator < numerator", all: "All denominators are smaller than numerators!"
            });
        }
        return data.validateRows(keys.length, rules);
    }

    function extractInputData(view, inputSettingsClass, rows) {
        const keyColumn = view.categories.key[0];
        const numeratorColumn = view.values.numerators[0];
        const denominatorColumn = view.values.denominators[0];
        const categories = view.category;
        const keys = new Array(rows.length);
        for (let i = 0; i < rows.length; i++) {
            keys[i] = powerbi.formatPrimitiveValue(keyColumn.values[rows[i]]);
        }
        const numerators = powerbi.readNumbers(numeratorColumn, rows);
        const denominators = powerbi.readNumbers(denominatorColumn, rows);
        const validation = validateInputData(keys, numerators, denominators, inputSettingsClass.settings.funnel.chart_type);
        if (validation.status !== 0) {
            return { status: "invalid", error: validation.error };
        }
        const kept = data.keptPositions(validation.messages);
        const id = data.keptValues(rows, kept);
        const labels = data.keptValues(keys, kept);
        const keyRows = new Array(kept.length);
        for (let x = 0; x < kept.length; x++) {
            keyRows[x] = { x, id: id[x], label: labels[x] };
        }
        const annotations = powerbi.readRowAnnotations({
            categorical: view.categorical, values: view.values, categories,
            cards: { scatter: settingsModel.scatter, labels: settingsModel.labels },
            defaults: { scatter: defaultSettings.scatter, labels: defaultSettings.labels }
        }, rows, kept);
        const warnings = powerbi.rowWarnings(categories.source.displayName, rows, keys, validation.messages, { messages: inputSettingsClass.validationStatus.messages, messagePositionByRowIndex: inputSettingsClass.messagePositionByRowIndex });
        return { status: "valid", data: {
                ...annotations, keys: keyRows, id, numerators: data.keptValues(numerators, kept), denominators: data.keptValues(denominators, kept), categories,
                warningMessage: warnings.join("\n"), validationStatus: validation
            } };
    }

    function axisRanges(viewModel) {
        const inputData = viewModel.inputData;
        if (inputData === undefined) {
            throw new Error("Axis ranges require validated data.");
        }
        const settings = viewModel.inputSettings.settings;
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

    const smrSE = function () {
        return [];
    };
    const smrSEOD = function (inputData, plottingDenominators) {
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
                seFunctionOD: smrSEOD,
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
                seFunctionOD: prSE,
                targetFunction: prTarget,
                targetFunctionTransformed: prTargetTransformed,
                yFunction: prY,
                zFunction: prZ,
                zFunctionOD: adjustZScores,
                limitFunction: prLimit,
                limitFunctionOD: prLimit,
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
                seFunctionOD: rcSE,
                targetFunction: rcTarget,
                targetFunctionTransformed: rcTargetTransformed,
                yFunction: rcY,
                zFunction: rcZ,
                zFunctionOD: rcZ,
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

    class viewModelClass {
        constructor(host) {
            this.svgWidth = 0;
            this.svgHeight = 0;
            this.frontend = false;
            this.miscPoints = [];
            this.miscAnyHighlights = false;
            this.inputData = undefined;
            this.inputSettings = new settingsClass();
            this.chartBase = undefined;
            this.calculatedLimits = [];
            this.plotPoints = new Array();
            this.groupedLines = new Array();
            this.firstRun = true;
            this.colourPalette = powerbi.readColourPalette(host);
            this.headless = false;
        }
        update(options, host) {
            this.colourPalette = powerbi.readColourPalette(host);
            const checkDV = powerbi.validateDataView(options.dataViews, ["numerators", "denominators"]);
            if (checkDV.status !== "valid") {
                return this.invalidate(checkDV.error);
            }
            const view = checkDV.view;
            const dataChanged = (options.type & (2 | 16)) !== 0 || this.firstRun;
            const indicators = view.categories.indicator ?? [];
            const indicatorGroups = powerbi.groupCategoryRows(indicators, view.rowCount);
            if (dataChanged) {
                this.inputSettings.showMisc = indicators.length > 0;
                this.inputSettings.miscGroups = [];
                this.inputSettings.update(view, indicatorGroups.rows);
            }
            const settingsValidation = this.inputSettings.validationStatus;
            if (settingsValidation.status !== 0) {
                return this.invalidate(settingsValidation.error, "settings");
            }
            this.svgWidth = options.viewport.width;
            this.svgHeight = options.viewport.height;
            this.headless = options.headless ?? false;
            this.frontend = options.frontend ?? false;
            if (dataChanged) {
                this.miscPoints = [];
                this.miscAnyHighlights = false;
                if (this.inputSettings.showMisc) {
                    return this.initialiseMisc(view, host, indicatorGroups, indicators);
                }
                const result = extractInputData(view, this.inputSettings, indicatorGroups.rows[0]);
                if (result.status === "invalid") {
                    return this.invalidate(result.error);
                }
                this.inputData = result.data;
                this.chartBase = new chartObjects[this.inputSettings.settings.funnel.chart_type](result.data, this.inputSettings);
                this.calculatedLimits = this.chartBase.getLimits();
                this.scaleAndTruncateLimits();
                this.initialisePlotData(host, result.data, this.chartBase);
                this.initialiseGroupedLines();
                this.firstRun = false;
            }
            if (this.inputData === undefined) {
                return this.invalidate("No validated data present");
            }
            if (!this.inputSettings.showMisc) {
                const rangeError = rendering.axisRangeError(axisRanges(this));
                if (rangeError !== undefined) {
                    return this.invalidate(rangeError, "settings");
                }
            }
            return { status: true, data: this.inputData, warning: this.inputData.warningMessage || undefined };
        }
        invalidate(error, type) {
            this.inputData = undefined;
            this.chartBase = undefined;
            this.calculatedLimits = [];
            this.plotPoints = [];
            this.groupedLines = [];
            this.miscPoints = [];
            this.miscAnyHighlights = false;
            this.firstRun = true;
            return { status: false, error, type };
        }
        initialiseMisc(view, host, indicators, indicatorColumns) {
            const keyColumn = view.categories.key[0];
            const groups = powerbi.groupCategoryRows([keyColumn], keyColumn.values.length);
            const items = this.inputSettings.miscGroups;
            const rowsByGroup = new Map();
            for (let i = 0; i < groups.rows.length; i++) {
                if (keyColumn.values[groups.rows[i][0]] == null) {
                    continue;
                }
                items.push({ displayName: groups.names[i][0], value: groups.keys[i] });
                rowsByGroup.set(groups.keys[i], groups.rows[i]);
            }
            const misc = this.inputSettings.settings.misc;
            if (misc.group === "" && items.length > 0) {
                misc.group = items[0].value;
            }
            const targetRows = rowsByGroup.get(misc.group);
            if (targetRows === undefined) {
                return this.invalidate("Select a MISC group present in the data.");
            }
            if (!(misc.lower < 0 && misc.upper > 0)) {
                return this.invalidate("MISC sigma bounds must span zero.");
            }
            const selectedRows = new Set(targetRows);
            const warnings = [];
            this.inputData = undefined;
            for (let i = 0; i < indicators.rows.length; i++) {
                const rows = indicators.rows[i];
                const settings = this.inputSettings.forGroup(i);
                const indicator = indicators.names[i].join(" / ");
                const directions = powerbi.readSettingsRows(settingsModel.outliers, "outliers", defaultSettings.outliers, view.category, rows).values;
                const direction = directions[0].improvement_direction;
                for (let j = 0; j < directions.length; j++) {
                    if (direction === "neutral" || directions[j].improvement_direction !== direction) {
                        return this.invalidate(`Each MISC indicator must have one improvement direction: increase or decrease. Invalid indicator: ${indicator}.`);
                    }
                }
                settings.settings.outliers = { ...settings.settings.outliers, three_sigma: true, two_sigma: false };
                const result = extractInputData(view, settings, rows);
                if (result.status === "invalid") {
                    return this.invalidate(`${indicator}: ${result.error}`);
                }
                const data = result.data;
                this.inputData ?? (this.inputData = data);
                if (data.warningMessage !== "") {
                    warnings.push(`${indicator}: ${data.warningMessage}`);
                }
                this.miscAnyHighlights || (this.miscAnyHighlights = data.anyHighlights);
                const chart = new chartObjects[settings.settings.funnel.chart_type](data, settings);
                this.calculatedLimits = chart.getLimits();
                this.scaleAndTruncateLimits(settings);
                this.initialisePlotData(host, data, chart, settings);
                for (let j = 0; j < data.id.length; j++) {
                    const row = data.id[j];
                    if (!selectedRows.has(row)) {
                        continue;
                    }
                    const point = this.plotPoints[j];
                    const score = point.z * (direction === "decrease" ? -1 : 1);
                    const identity = host.createSelectionIdBuilder().withCategory(keyColumn, row);
                    for (let k = 0; k < indicatorColumns.length; k++) {
                        identity.withCategory(indicatorColumns[k], row);
                    }
                    this.miscPoints.push({
                        ...point,
                        indicator,
                        score,
                        identity: identity.createSelectionId(),
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
            if (this.inputData === undefined || this.miscPoints.length === 0) {
                return this.invalidate("The selected MISC group has no valid indicator results.");
            }
            this.inputData.warningMessage = warnings.join("\n");
            this.firstRun = false;
            return { status: true, data: this.inputData, warning: this.inputData.warningMessage || undefined };
        }
        initialisePlotData(host, inputData, chart, inputSettings = this.inputSettings) {
            this.plotPoints = new Array();
            const transform = getTransformation(inputSettings.settings.funnel.transformation);
            const multiplier = inputSettings.derivedSettings.multiplier;
            const flag_two_sigma = inputSettings.settings.outliers.two_sigma;
            const flag_three_sigma = inputSettings.settings.outliers.three_sigma;
            const zScores = chart.getZ();
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
                const aesthetics = inputData.scatter_formatting[i];
                if (this.colourPalette.isHighContrast) {
                    aesthetics.colour = this.colourPalette.foregroundColour;
                }
                const flagSettings = {
                    process_flag_type: inputSettings.settings.outliers.process_flag_type,
                    improvement_direction: inputSettings.settings.outliers.improvement_direction
                };
                const two_sigma_outlier = data.checkFlagDirection(flag_two_sigma ? spc.limitStatus(value, limits.ll95, limits.ul95) : "none", flagSettings);
                const three_sigma_outlier = data.checkFlagDirection(flag_three_sigma ? spc.limitStatus(value, limits.ll99, limits.ul99) : "none", flagSettings);
                const category = inputData.keys[i].label;
                data.applyFlagColours(aesthetics, inputSettings.settings.outliers, [
                    [two_sigma_outlier, "two_sigma_colour"], [three_sigma_outlier, "three_sigma_colour"]
                ]);
                this.plotPoints.push({
                    x: denominator,
                    numerator: numerator,
                    value: value,
                    z: zScores[i],
                    group_text: category,
                    limits,
                    aesthetics: aesthetics,
                    identity: host.createSelectionIdBuilder()
                        .withCategory(inputData.categories, original_index)
                        .createSelectionId(),
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
            for (let i = 0; i < this.calculatedLimits.length; i++) {
                const limits = this.calculatedLimits[i];
                for (let j = 0; j < labels.length; j++) {
                    const label = labels[j];
                    formattedLines.push({ x: limits.denominators, line_value: limits[label], group: label });
                }
            }
            this.groupedLines = data.groupBy(formattedLines, "group");
        }
        scaleAndTruncateLimits(inputSettings = this.inputSettings) {
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

    function downloadRows(viewModel) {
        const points = viewModel.plotPoints;
        const rows = new Array(points.length);
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const limit = point.limits;
            rows[i] = {
                group: point.group_text, numerator: point.numerator, denominator: point.x, value: point.value,
                target: limit.target, alt_target: limit.alt_target,
                ll99: limit.ll99, ll95: limit.ll95, ll68: limit.ll68, ul68: limit.ul68, ul95: limit.ul95, ul99: limit.ul99,
                two_sigma: point.two_sigma, three_sigma: point.three_sigma
            };
        }
        return rows;
    }

    class Visual extends rendering.PlotVisual {
        constructor(options) {
            super(options, host => new viewModelClass(host));
            this.lineKeys = settings.standardLineKeys;
        }
        get settings() {
            return this.viewModel.inputSettings.settings;
        }
        axisRanges() {
            return axisRanges(this.viewModel);
        }
        drawAlternate() {
            if (this.viewModel.inputSettings.showMisc) {
                this.svg.call(drawMisc, this);
                return true;
            }
            const svg = this.svg.node();
            if (svg !== null && !this.svg.select(".misc-root").empty()) {
                rendering.initialiseSvg(svg, true);
            }
            return false;
        }
        updateHighlighting() {
            const viewModel = this.viewModel;
            if (viewModel.inputSettings.showMisc) {
                const state = powerbi.selectionState(this.selectionManager, viewModel.miscAnyHighlights);
                this.svg.selectAll(".misc-bar").attr("opacity", point => rendering.highlightOpacity(point.aesthetics, state.active, powerbi.identitySelected(point.identity, state.selected) || point.highlighted));
                return;
            }
            const state = powerbi.selectionState(this.selectionManager, viewModel.inputData ? viewModel.inputData.anyHighlights : false);
            const settings = this.settings;
            this.highlightPlotPoints(state, point => settings.scatter.use_group_text
                ? {
                    opacity: point.aesthetics.scatter_text_opacity,
                    opacity_selected: point.aesthetics.scatter_text_opacity_selected,
                    opacity_unselected: point.aesthetics.scatter_text_opacity_unselected
                }
                : point.aesthetics);
        }
        drawVisual() {
            const svg = this.svg.node();
            if (svg === null) {
                return;
            }
            const viewModel = this.viewModel;
            const settings$1 = this.settings;
            const context = this.plotContext();
            rendering.drawPlotAxes(svg, context, {
                x: undefined,
                y: rendering.valueTickFormat(settings$1.y_axis.ylimit_sig_figs ?? settings$1.funnel.sig_figs, viewModel.inputSettings.derivedSettings.percentLabels)
            });
            rendering.drawPlotTooltips(svg, context, true);
            rendering.drawPlotLines(svg, context, viewModel.groupedLines, name => settings.lineStyle(settings$1.lines, settings.standardLineKeys[name]));
            rendering.drawPlotLineLabels(svg, context, {
                lines: viewModel.groupedLines,
                settings: settings$1.lines,
                keys: settings.standardLineKeys,
                lower: name => settings.lowerLimitLines.has(name),
                format: viewModel.inputSettings.derivedSettings.formatValue,
                periodEnds: [viewModel.calculatedLimits.length - 1]
            });
            rendering.drawPlotDots(svg, context, {
                show: true,
                text: settings$1.scatter.use_group_text
                    ? point => ({
                        text: point.group_text, size: point.aesthetics.scatter_text_size,
                        font: point.aesthetics.scatter_text_font, colour: point.aesthetics.scatter_text_colour
                    })
                    : undefined,
                onClick: undefined
            });
            this.addContextMenu(svg);
            rendering.drawPlotDownload(svg, context, () => downloadRows(viewModel));
            rendering.drawPlotValueLabels(svg, context, viewModel.inputData?.anyLabels ?? false);
        }
    }

    exports.Visual = Visual;
    exports.defaultSettings = defaultSettings;

    return exports;

})({}, ccCore, ccCore, ccCore, ccCore, ccCore, ccCore);
