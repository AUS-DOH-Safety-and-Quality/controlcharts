var ccHeadless = (function (exports, util, powerbi, rendering, frontends) {
    'use strict';

    const visuals = {};
    const services = {
        selectionManager: frontends.noSelection,
        tooltipSettings: () => undefined,
        rowKeys: index => [String(index)],
        displayWarningIcon: () => { }
    };
    function initialiseHeadless(dom) {
        globalThis.document = dom.document;
        globalThis.window = dom.window;
        const names = frontends.chartNames();
        for (let i = 0; i < names.length; i++) {
            const name = util.at(names, i);
            const container = dom.document.createElement("div");
            container.classList.add(`${name}-container`);
            dom.document.body.appendChild(container);
            visuals[name] = frontends.createVisual(name, container, services);
        }
    }
    function updateOptions(dataViews, width, height) {
        return {
            dataViews: frontends.toDataViews(dataViews),
            viewport: { width, height },
            type: powerbi.updateType.data,
            headless: true,
            frontend: true
        };
    }
    function svgDocument(content, width, height) {
        const body = content
            .split('dominant-baseline="hanging"').join('dy="0.8em"')
            .split('dominant-baseline="middle"').join('dy="0.35em"');
        return `<svg viewBox="0 0 ${width} ${height}" width="${width}px" height="${height}px" xmlns="${rendering.SVG_NS}">`
            + '<rect x="0" y="0" width="100%" height="100%" fill="white"/>'
            + body
            + "</svg>";
    }
    function limitIndicatorColumns(chartType, names) {
        const columns = frontends.indicatorColumns(names, frontends.frontendChart(chartType).limitColumns);
        const renamed = [];
        for (let i = 0; i < names.length; i++) {
            if (columns[i] !== names[i]) {
                renamed.push(`${names[i]} to ${columns[i]}`);
            }
        }
        const warnings = renamed.length === 0
            ? []
            : [`Indicators renamed in the limits, as their names are limit columns: ${renamed.join(", ")}.`];
        return { columns, warnings };
    }
    function indicatorNames(dataViews) {
        const names = [];
        const categories = dataViews[0]?.categorical.categories ?? [];
        for (let i = 0; i < categories.length; i++) {
            const source = util.at(categories, i).source;
            if (source.roles?.indicator) {
                names.push(source.displayName);
            }
        }
        return names;
    }
    function updateHeadlessVisual(chartType, dataViews, titleSettings, width, height, staticPlot, limits) {
        const chart = frontends.frontendChart(chartType);
        const visual = visuals[chartType];
        if (visual === undefined) {
            throw new Error(`No visual initialised for ${chartType}.`);
        }
        visual.update(updateOptions([], width, height));
        let result = {};
        let status;
        if (staticPlot) {
            status = visual.update(updateOptions(frontends.paddedDataViews(chartType, dataViews, titleSettings, true), width, height));
            frontends.updateChartTitle(visual.svg, titleSettings);
            const errorMessage = visual.svg.select(".errormessage");
            if (errorMessage.size() > 0) {
                return { error: errorMessage.text() };
            }
            if (visual.showsTable) {
                return { error: "Static plots are not available for summary tables." };
            }
            const svg = visual.svg.node();
            if (svg === null) {
                throw new Error("The visual has no SVG.");
            }
            result.svg = svgDocument(svg.innerHTML, width, height);
        }
        else {
            status = visual.viewModel.update(updateOptions(dataViews, width, height), visual.host);
            if (!status.status) {
                return { error: status.error };
            }
        }
        const warnings = status.status && status.warning !== undefined ? [status.warning] : [];
        if (limits) {
            result = { ...result, ...chart.limits(visual) };
            warnings.push(...limitIndicatorColumns(chartType, indicatorNames(dataViews)).warnings);
        }
        return { ...result, warnings };
    }
    function headlessChart(chartType, rawData, inputSettings, aggregations, title, width, height, staticPlot, limits) {
        const settings = frontends.chartSettings(chartType, inputSettings, frontends.asArray(rawData.categories).length);
        if ("error" in settings) {
            return settings;
        }
        const chartAggs = frontends.chartAggregations(aggregations);
        if ("error" in chartAggs) {
            return chartAggs;
        }
        const titleSettings = frontends.chartTitle(title);
        if ("error" in titleSettings) {
            return titleSettings;
        }
        const updateValues = frontends.makeUpdateValues(rawData, settings.settings, chartAggs.aggregations);
        const result = updateHeadlessVisual(chartType, updateValues.dataViews, titleSettings.settings, width, height, staticPlot, limits);
        if (!limits || "error" in result) {
            return result;
        }
        return { ...result, source_rows: updateValues.source_rows };
    }

    exports.headlessChart = headlessChart;
    exports.initialiseHeadless = initialiseHeadless;
    exports.limitIndicatorColumns = limitIndicatorColumns;
    exports.updateHeadlessVisual = updateHeadlessVisual;
    exports.visuals = visuals;

    return exports;

})({}, ccCore, ccCore, ccCore, ccCore);
