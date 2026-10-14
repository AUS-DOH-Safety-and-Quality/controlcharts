var ccHeadless = (function (exports, powerbi, rendering, frontends) {
    'use strict';

    const visuals = {};
    const services = {
        selectionManager: {
            registerOnSelectCallback: () => { },
            getSelectionIds: () => [],
            select: () => Promise.resolve(),
            clear: () => Promise.resolve(),
            showContextMenu: () => Promise.resolve()
        },
        tooltipService: {
            show: () => { },
            hide: () => { }
        },
        rowKeys: (_category, index) => [String(index)]
    };
    function initialiseHeadless(dom) {
        globalThis.document = dom.document;
        globalThis.window = dom.window;
        const names = frontends.chartNames();
        for (let i = 0; i < names.length; i++) {
            const container = dom.document.createElement("div");
            container.classList.add(`${names[i]}-container`);
            dom.document.body.appendChild(container);
            visuals[names[i]] = new (frontends.frontendChart(names[i]).Visual)(frontends.constructorOptions(container, services));
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
    function updateHeadlessVisual(chartType, dataViews, titleSettings, width, height, staticPlot, limits) {
        const chart = frontends.frontendChart(chartType);
        const visual = visuals[chartType];
        visual.update(updateOptions([], width, height));
        let result = {};
        if (staticPlot) {
            visual.update(updateOptions(frontends.paddedDataViews(chartType, dataViews, titleSettings, true), width, height));
            frontends.updateChartTitle(visual.svg, titleSettings);
            const errorMessage = visual.svg.select(".errormessage");
            if (errorMessage.size() > 0) {
                return { error: errorMessage.text() };
            }
            const staticError = chart.staticError?.(visual);
            if (staticError !== undefined) {
                return { error: staticError };
            }
            const svg = visual.svg.node();
            if (svg === null) {
                throw new Error("The visual has no SVG.");
            }
            result.svg = svgDocument(svg.innerHTML, width, height);
        }
        else {
            const status = visual.viewModel.update(updateOptions(dataViews, width, height), visual.host);
            if (!status.status) {
                return { error: status.error };
            }
        }
        if (limits) {
            result = { ...result, ...chart.limits(visual) };
        }
        return result;
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
        const dataViews = frontends.makeUpdateValues(rawData, settings.settings, chartAggs.aggregations).dataViews;
        return updateHeadlessVisual(chartType, dataViews, titleSettings.settings, width, height, staticPlot, limits);
    }

    exports.headlessChart = headlessChart;
    exports.initialiseHeadless = initialiseHeadless;
    exports.updateHeadlessVisual = updateHeadlessVisual;
    exports.visuals = visuals;

    return exports;

})({}, ccCore, ccCore, ccCore);
