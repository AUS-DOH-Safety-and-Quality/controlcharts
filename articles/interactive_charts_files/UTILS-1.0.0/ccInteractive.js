var ccInteractive = (function (exports, util, powerbi, rendering, frontends) {
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
            let titleText;
            let updateValues = { dataViews: [], crosstalk_identities: [] };
            let dataViews = [];
            const selectionManager = {
                registerOnSelectCallback: () => { },
                getSelectionIds: () => {
                    const selectedKeys = selectionHandle.value ?? [];
                    const selected = new Set(selectedKeys);
                    const groups = updateValues.crosstalk_identities;
                    const identities = new Array(selectedKeys.length);
                    for (let i = 0; i < selectedKeys.length; i++) {
                        identities[i] = frontends.selectionId([util.at(selectedKeys, i)]);
                    }
                    for (let i = 0; i < groups.length; i++) {
                        const keys = keysOf(util.at(groups, i));
                        for (let j = 0; j < keys.length; j++) {
                            if (selected.has(util.at(keys, j))) {
                                identities.push(frontends.selectionId(keys));
                                break;
                            }
                        }
                    }
                    return identities;
                },
                select: (identity, multiSelect) => {
                    const identities = Array.isArray(identity) ? identity : [identity];
                    const selected = new Set(multiSelect === true ? selectionHandle.value ?? [] : []);
                    for (let i = 0; i < identities.length; i++) {
                        const keys = util.at(identities, i).keys;
                        let anySelected = false;
                        for (let j = 0; j < keys.length && !anySelected; j++) {
                            anySelected = selected.has(util.at(keys, j));
                        }
                        for (let j = 0; j < keys.length; j++) {
                            const key = util.at(keys, j);
                            if (anySelected) {
                                selected.delete(key);
                            }
                            else {
                                selected.add(key);
                            }
                        }
                    }
                    if (selected.size === 0) {
                        selectionHandle.clear();
                    }
                    else {
                        selectionHandle.set(Array.from(selected));
                    }
                    return Promise.resolve();
                },
                clear: () => {
                    selectionHandle.clear();
                    return Promise.resolve();
                },
                showContextMenu: () => Promise.resolve()
            };
            const visual = frontends.createVisual(chartType, el, {
                selectionManager,
                tooltipSettings: () => x?.tooltip_settings,
                rowKeys: index => keysOf(util.at(updateValues.crosstalk_identities, index)),
                displayWarningIcon: (hoverText, detailedText) => {
                    console.warn(hoverText, detailedText);
                }
            });
            const svg = visual.svg.node();
            if (svg === null) {
                throw new Error("The visual has no SVG.");
            }
            addExportControl(el, svg, chartType);
            function titleSettings(data) {
                return titleText === undefined ? data.title_settings : { ...data.title_settings, text: titleText };
            }
            function updateVisual(type) {
                visual.update({ dataViews: frontends.toDataViews(dataViews), viewport, type });
                if (x !== undefined) {
                    frontends.updateChartTitle(visual.svg, titleSettings(x));
                }
            }
            function redraw(data) {
                updateValues = data.is_crosstalk
                    ? frontends.makeUpdateValues(data.data_raw, data.input_settings, data.aggregations, filterHandle.filteredKeys ?? undefined)
                    : data.update_values;
                dataViews = frontends.paddedDataViews(chartType, updateValues.dataViews, titleSettings(data), false);
                updateVisual(powerbi.updateType.data);
            }
            selectionHandle.on("change", () => {
                visual.updateHighlighting();
            });
            filterHandle.on("change", () => {
                if (x?.is_crosstalk === true) {
                    redraw(x);
                }
            });
            return {
                renderValue: value => {
                    x = value;
                    selectionHandle.setGroup(value.crosstalk_group);
                    filterHandle.setGroup(value.crosstalk_group);
                    redraw(value);
                },
                resize: (newWidth, newHeight) => {
                    viewport.width = newWidth;
                    viewport.height = newHeight;
                    updateVisual(powerbi.updateType.resize);
                },
                setTitle: text => {
                    titleText = text;
                    if (x !== undefined) {
                        redraw(x);
                    }
                }
            };
        };
    }
    function fileName(svg, chartType) {
        const title = svg.querySelector(".chart-title")?.textContent || chartType;
        const name = title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").trim().replace(/[. ]+$/, "");
        return name === "" ? chartType : name;
    }
    function svgElement(name, attributes) {
        const element = document.createElementNS(rendering.SVG_NS, name);
        const entries = Object.entries(attributes);
        for (let i = 0; i < entries.length; i++) {
            const [name, value] = util.at(entries, i);
            element.setAttribute(name, value);
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
            const format = util.at(formats, i);
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.format = format;
            button.textContent = format.toUpperCase();
            buttons[i] = button;
        }
        const status = document.createElement("span");
        status.className = "controlcharts-export-status";
        status.setAttribute("role", "status");
        options.append(...buttons, status);
        control.append(summary, options);
        el.appendChild(control);
        function setBusy(busy) {
            for (let i = 0; i < buttons.length; i++) {
                util.at(buttons, i).disabled = busy;
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
                const blob = format === "png" ? await frontends.chartPngBlob(svg) : frontends.chartSvgBlob(svg);
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
            const format = util.at(formats, i);
            util.at(buttons, i).addEventListener("click", () => {
                void exportChart(format);
            });
        }
    }

    exports.makeFactory = makeFactory;

    return exports;

})({}, ccCore, ccCore, ccCore, ccCore);
