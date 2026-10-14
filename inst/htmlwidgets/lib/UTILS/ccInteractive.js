var ccInteractive = (function (exports, powerbi, rendering, frontends) {
    'use strict';

    function keysOf(column) {
        const values = frontends.asArray(column);
        const keys = new Array(values.length);
        for (let i = 0; i < values.length; i++) {
            keys[i] = String(values[i]);
        }
        return keys;
    }
    function makeFactory(chartType) {
        return (el, width, height) => {
            const filterHandle = new crosstalk.FilterHandle();
            const selectionHandle = new crosstalk.SelectionHandle();
            const viewport = { width, height };
            let x;
            let updateValues = { dataViews: [], crosstalk_identities: [] };
            let dataViews = [];
            const selectionManager = {
                registerOnSelectCallback: () => { },
                getSelectionIds: () => {
                    const selectedKeys = selectionHandle.value ?? [];
                    const selected = new Set(selectedKeys);
                    const groups = Object.values(updateValues.crosstalk_identities);
                    const identities = new Array(selectedKeys.length);
                    for (let i = 0; i < selectedKeys.length; i++) {
                        identities[i] = frontends.selectionId([selectedKeys[i]]);
                    }
                    for (let i = 0; i < groups.length; i++) {
                        const keys = keysOf(groups[i]);
                        for (let j = 0; j < keys.length; j++) {
                            if (selected.has(keys[j])) {
                                identities.push(frontends.selectionId(keys));
                                break;
                            }
                        }
                    }
                    return identities;
                },
                select: (identity, multiSelect) => {
                    const identities = Array.isArray(identity) ? identity : [identity];
                    const keys = [];
                    for (let i = 0; i < identities.length; i++) {
                        keys.push(...identities[i].keys);
                    }
                    if (multiSelect === true && selectionHandle.value !== null) {
                        keys.push(...selectionHandle.value);
                    }
                    selectionHandle.set(keys);
                    return Promise.resolve();
                },
                clear: () => {
                    selectionHandle.clear();
                    return Promise.resolve();
                },
                showContextMenu: () => Promise.resolve()
            };
            const visual = new (frontends.frontendChart(chartType).Visual)(frontends.constructorOptions(el, {
                selectionManager,
                tooltipService: {
                    show: options => {
                        if (x !== undefined && options.dataItems !== undefined) {
                            showTooltip(x.tooltip_settings, options.dataItems, options.coordinates);
                        }
                    },
                    hide: () => {
                        visual.svg.select(".chart-tooltip-group").selectChildren().remove();
                    }
                },
                rowKeys: (category, index) => {
                    const identities = updateValues.crosstalk_identities;
                    return keysOf(frontends.isArray(identities) ? identities[index] : identities[String(category.values[index])]);
                }
            }));
            const svg = visual.svg.node();
            if (svg === null) {
                throw new Error("The visual has no SVG.");
            }
            addExportControl(el, svg, chartType);
            const showTooltip = (settings, items, coordinates) => {
                const bounds = svg.getBoundingClientRect();
                const tooltipGroup = visual.svg.select(".chart-tooltip-group");
                tooltipGroup.raise();
                const rect = tooltipGroup.selectAll("rect").data([0]).join("rect");
                const texts = tooltipGroup.selectAll("text")
                    .data(items)
                    .join("text")
                    .attr("x", 5)
                    .attr("y", (_, i) => 15 + 15 * i)
                    .text(d => `${d.displayName}: ${d.value}`)
                    .style("text-anchor", "left")
                    .style("font-size", `${settings.ttip_font_size}px`)
                    .style("font-family", settings.ttip_font)
                    .style("fill", settings.ttip_font_color)
                    .nodes();
                let maxTextLength = 0;
                for (let i = 0; i < texts.length; i++) {
                    maxTextLength = Math.max(maxTextLength, texts[i].getComputedTextLength());
                }
                let left = coordinates[0];
                let top = coordinates[1];
                if (left + maxTextLength > bounds.width) {
                    left = left - maxTextLength - 10;
                }
                if (top + 15 * items.length > bounds.height) {
                    top = top - 15 * items.length - 5;
                }
                rect.attr("fill", settings.ttip_background_color)
                    .attr("stroke", settings.ttip_border_color)
                    .attr("stroke-width", settings.ttip_border_width)
                    .attr("opacity", settings.ttip_opacity)
                    .attr("rx", settings.ttip_border_radius)
                    .attr("ry", settings.ttip_border_radius)
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", maxTextLength + 10)
                    .attr("height", 15 * items.length + 5);
                tooltipGroup.attr("transform", `translate(${left}, ${top})`);
            };
            function updateVisual(type) {
                visual.update({ dataViews: frontends.toDataViews(dataViews), viewport, type });
                if (x !== undefined) {
                    frontends.updateChartTitle(visual.svg, x.title_settings);
                }
                visual.svg.selectAll(".chart-tooltip-group").data([null]).join("g").classed("chart-tooltip-group", true);
            }
            function aggregate(data, filters) {
                updateValues = data.is_crosstalk
                    ? frontends.makeUpdateValues(data.data_raw, data.input_settings, data.aggregations, filters)
                    : data.update_values;
                dataViews = frontends.paddedDataViews(chartType, updateValues.dataViews, data.title_settings, false);
            }
            selectionHandle.on("change", () => {
                visual.updateHighlighting();
            });
            filterHandle.on("change", event => {
                if (x?.is_crosstalk === true) {
                    aggregate(x, event.value ?? undefined);
                    updateVisual(powerbi.updateType.data);
                }
            });
            return {
                renderValue: value => {
                    x = value;
                    aggregate(value);
                    selectionHandle.setGroup(value.crosstalk_group);
                    filterHandle.setGroup(value.crosstalk_group);
                    updateVisual(powerbi.updateType.data);
                },
                resize: (newWidth, newHeight) => {
                    viewport.width = newWidth;
                    viewport.height = newHeight;
                    updateVisual(powerbi.updateType.resize);
                }
            };
        };
    }
    const exportedStyles = [
        "fill", "fill-opacity", "stroke", "stroke-width", "stroke-opacity", "stroke-dasharray",
        "font-family", "font-size", "font-weight", "font-style", "text-anchor",
        "dominant-baseline", "opacity", "visibility", "display"
    ];
    function inlineStyles(from, to) {
        const style = getComputedStyle(from);
        for (let i = 0; i < exportedStyles.length; i++) {
            to.style.setProperty(exportedStyles[i], style.getPropertyValue(exportedStyles[i]));
        }
    }
    function chartSvgBlob(svg) {
        const copy = document.importNode(svg, true);
        const width = svg.width.baseVal.value;
        const height = svg.height.baseVal.value;
        inlineStyles(svg, copy);
        const originals = svg.querySelectorAll("*");
        const copies = copy.querySelectorAll("*");
        for (let i = 0; i < originals.length; i++) {
            inlineStyles(originals[i], copies[i]);
        }
        const tooltips = copy.querySelectorAll(".chart-tooltip-group");
        for (let i = 0; i < tooltips.length; i++) {
            tooltips[i].remove();
        }
        copy.setAttribute("xmlns", rendering.SVG_NS);
        copy.setAttribute("width", String(width));
        copy.setAttribute("height", String(height));
        if (!copy.hasAttribute("viewBox")) {
            copy.setAttribute("viewBox", `0 0 ${width} ${height}`);
        }
        const backgroundColour = getComputedStyle(svg).backgroundColor;
        copy.prepend(svgElement("rect", {
            width: "100%",
            height: "100%",
            fill: backgroundColour === "rgba(0, 0, 0, 0)" ? "white" : backgroundColour
        }));
        return new Blob([new XMLSerializer().serializeToString(copy)], { type: "image/svg+xml;charset=utf-8" });
    }
    async function chartPngBlob(svgBlob, width, height) {
        const url = URL.createObjectURL(svgBlob);
        try {
            const image = new Image();
            image.src = url;
            await image.decode();
            const canvas = document.createElement("canvas");
            canvas.width = Math.ceil(width * 2);
            canvas.height = Math.ceil(height * 2);
            const context = canvas.getContext("2d");
            if (context === null) {
                throw new Error("PNG export failed");
            }
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            return await new Promise((resolve, reject) => {
                canvas.toBlob(blob => {
                    if (blob === null) {
                        reject(new Error("PNG export failed"));
                    }
                    else {
                        resolve(blob);
                    }
                }, "image/png");
            });
        }
        finally {
            URL.revokeObjectURL(url);
        }
    }
    function fileName(svg, chartType) {
        const title = svg.querySelector(".chart-title")?.textContent || chartType;
        const name = title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").trim().replace(/[. ]+$/, "");
        return name === "" ? chartType : name;
    }
    function svgElement(name, attributes) {
        const element = document.createElementNS(rendering.SVG_NS, name);
        const names = Object.keys(attributes);
        for (let i = 0; i < names.length; i++) {
            element.setAttribute(names[i], attributes[names[i]]);
        }
        return element;
    }
    function exportIcon() {
        const icon = svgElement("svg", {
            "width": "16",
            "height": "16",
            "viewBox": "0 0 24 24",
            "fill": "none",
            "stroke": "currentColor",
            "stroke-width": "1.6",
            "aria-hidden": "true"
        });
        icon.appendChild(svgElement("path", {
            "d": "M12 3v12m-4-4 4 4 4-4M5 16v5h14v-5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
        }));
        return icon;
    }
    function addExportControl(el, svg, chartType) {
        el.classList.add("controlcharts-widget");
        const control = document.createElement("details");
        control.className = "controlcharts-export";
        const summary = document.createElement("summary");
        summary.setAttribute("aria-label", "Export chart");
        summary.title = "Export chart";
        summary.appendChild(exportIcon());
        const options = document.createElement("div");
        options.className = "controlcharts-export-options";
        options.setAttribute("role", "group");
        options.setAttribute("aria-label", "Export image");
        const formats = ["svg", "png"];
        const buttons = new Array(formats.length);
        for (let i = 0; i < formats.length; i++) {
            buttons[i] = document.createElement("button");
            buttons[i].type = "button";
            buttons[i].dataset.format = formats[i];
            buttons[i].textContent = formats[i].toUpperCase();
        }
        const status = document.createElement("span");
        status.className = "controlcharts-export-status";
        status.setAttribute("role", "status");
        options.append(...buttons, status);
        control.append(summary, options);
        el.appendChild(control);
        function setBusy(busy) {
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].disabled = busy;
            }
            if (busy) {
                control.setAttribute("aria-busy", "true");
            }
            else {
                control.removeAttribute("aria-busy");
            }
        }
        async function exportChart(format) {
            status.textContent = "";
            setBusy(true);
            try {
                let blob = chartSvgBlob(svg);
                if (format === "png") {
                    blob = await chartPngBlob(blob, svg.width.baseVal.value, svg.height.baseVal.value);
                }
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${fileName(svg, chartType)}.${format}`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1000);
                control.open = false;
                summary.focus();
            }
            catch {
                status.textContent = "Could not export image. Please try again.";
            }
            finally {
                setBusy(false);
            }
        }
        control.addEventListener("click", event => {
            event.stopPropagation();
        });
        control.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                control.open = false;
                summary.focus();
                event.stopPropagation();
            }
        });
        control.addEventListener("focusout", event => {
            if (!(event.relatedTarget instanceof Node && control.contains(event.relatedTarget))) {
                control.open = false;
            }
        });
        for (let i = 0; i < buttons.length; i++) {
            const format = formats[i];
            buttons[i].addEventListener("click", () => {
                void exportChart(format);
            });
        }
    }

    exports.makeFactory = makeFactory;

    return exports;

})({}, ccCore, ccCore, ccCore);
