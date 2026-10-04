/*
  Assumes that the following files have already been loaded by the `htmlwidgets` package:
    - ./commonUtils.js
    - ../PBISPC/PBISPC.js
    - ../PBIFUN/PBIFUN.js
    - ../MISC/MISC.js
*/

function makeFactory(chartType) {
  return function(el, width, height) {
    // Initialise crosstalk objects for interactivity (highlighting and filtering)
    var crosstalkFilterHandle = new crosstalk.FilterHandle();
    var crosstalkSelectionHandle = new crosstalk.SelectionHandle();

    // Initialise the chart object for calculating limits and rendering
    var visual = new window[chartType].Visual(makeConstructorArgs(el));
    addExportControl(el, visual.svg.node(), chartType);

    // Initialise the arguments for the visual update function
    // so that they can be reused across rendering, resizing, and filtering
    var visualUpdateArgs = {
      dataViews: [],
      viewport: { width: width, height: height },
      // Change in data, so recalculate limits
      type: 2
    };
    var updateValues;

    // Replace PowerBI selection manager (interactivity) functions with crosstalk equivalents
    visual.selectionManager.getSelectionIds = () => crosstalkSelectionHandle.value ?? []
    visual.selectionManager.clear = () => crosstalkSelectionHandle.clear()
    visual.selectionManager.select = (currentIdentity, multiSelect) => {
      var newIdentities = currentIdentity;
      if (multiSelect && crosstalkSelectionHandle.value) {
        newIdentities = newIdentities.concat(crosstalkSelectionHandle.value)
      }
      crosstalkSelectionHandle.set(newIdentities)
      return { then: (f) => f() }
    }

    // Add a group for rendering tooltips in place of PowerBI tooltips
    visual.svg.append("g")
              .classed("chart-tooltip-group", true);

    return {
      renderValue: function(x) {
        // Add title to the visual
        updateChartTitle(visual.svg, x.title_settings);

        // Aggregate the raw data into the format expected by the visual
        updateValues = x.is_crosstalk
          ? makeUpdateValues(x.data_raw, x.input_settings, x.aggregations, x.has_conditional_formatting, x.unique_categories)
          : x.update_values;
        visualUpdateArgs.dataViews = updateValues.dataViews;

        // Initialise the dataset linkage for crosstalk highlighting and filtering
        crosstalkSelectionHandle.setGroup(x.crosstalk_group);
        crosstalkFilterHandle.setGroup(x.crosstalk_group);

        // Crosstalk highlighting callback - when a crosstalk highlighting event occurs,
        // use existing visual functions for handling selection and highlighting as the
        // selectionManager functions for mapping identities to selected points have
        // already been replaced with crosstalk equivalents
        crosstalkSelectionHandle.on("change", function(e) { visual.updateHighlighting() });

        // Crosstalk filtering callback - When a crosstalk filtering event occurs,
        // filter the original dataset before re-aggregating and re-rendering the visual
        // (see the `makeUpdateValues` function)
        crosstalkFilterHandle.on("change", function(e) {
          updateValues = makeUpdateValues(x.data_raw, x.input_settings, x.aggregations, x.has_conditional_formatting, x.unique_categories, e.value);
          visualUpdateArgs.dataViews = updateValues.dataViews;
          visualUpdateArgs.type = 2; // Change in data, so recalculate limits
          visualUpdateArgs.frontend = true; // Enable additional compatibility for non-PBI rendering

          visual.update(visualUpdateArgs);
        })

        // Replace PowerBI function for assigning selection identities to points,
        // so that the visual will automatically assign the correct crosstalk identities
        visual.host.createSelectionIdBuilder = () => ({
          withCategory: (allCategories, categoryIndex) => ({
            createSelectionId: () => Array.isArray(updateValues.crosstalk_identities)
              ? updateValues.crosstalk_identities[categoryIndex]
              : updateValues.crosstalk_identities[allCategories.values[categoryIndex]]
          })
        })

        visual.host.tooltipService.show = (tooltipArgs) => {
          var boundRect = visual.svg.node().getBoundingClientRect();
          var tooltipGroup = visual.svg.select(".chart-tooltip-group");
          tooltipGroup.raise();
          var maxTextLength = 0;

          var rectGroup = tooltipGroup.selectAll("rect")
                                      .data([0])
                                      .join("rect");

          var ttip_size = x.tooltip_settings.ttip_font_size;
          var ttip_font = x.tooltip_settings.ttip_font;
          var ttip_colour = x.tooltip_settings.ttip_font_color;

          tooltipGroup.selectAll("text")
                      .data(tooltipArgs.dataItems)
                      .join("text")
                      .attr("x", 5)
                      .attr("y", (_, i) => 15 + 15*i)
                      .text(d => `${d.displayName}: ${d.value}`)
                      .style("text-anchor", "left")
                      .style("font-size", `${ttip_size}px`)
                      .style("font-family", ttip_font)
                      .style("fill", ttip_colour)
                      .each(function() {
                        var textLength = this.getComputedTextLength();
                        maxTextLength = Math.max(maxTextLength, textLength);
                      });
          var coordinates = tooltipArgs.coordinates;
          if (coordinates[0] + maxTextLength > boundRect.width) {
            // If the tooltip would overflow the right edge of the viewport, adjust its position
            coordinates[0] = coordinates[0] - maxTextLength - 10;
          }
          if (coordinates[1] + 15 * tooltipArgs.dataItems.length > boundRect.height) {
            // If the tooltip would overflow the bottom edge of the viewport, adjust its position
            coordinates[1] = coordinates[1] - 15 * tooltipArgs.dataItems.length - 5;
          }

          // Add a rectangle behind the text for better visibility
          rectGroup.attr("fill", x.tooltip_settings.ttip_background_color)
                    .attr("stroke", x.tooltip_settings.ttip_border_color)
                    .attr("stroke-width", x.tooltip_settings.ttip_border_width)
                    .attr("opacity", x.tooltip_settings.ttip_opacity)
                    .attr("rx", x.tooltip_settings.ttip_border_radius) // Rounded corners
                    .attr("ry", x.tooltip_settings.ttip_border_radius) // Rounded corners
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", maxTextLength + 10) // Add some padding
                    .attr("height", 15 * tooltipArgs.dataItems.length + 5); // Add some padding

          // Set the position of the tooltip group
          tooltipGroup.attr("transform", `translate(${coordinates[0]}, ${coordinates[1]})`);
        };

        visual.host.tooltipService.hide = () => {
          visual.svg
                .select(".chart-tooltip-group")
                .selectChildren()
                .remove();
        }

        // Trigger the calculation of limits and the rendering of the visual
        visual.update(visualUpdateArgs);
      },

      resize: function(width, height) {
        visualUpdateArgs.viewport.width = width;
        visualUpdateArgs.viewport.height = height;
        // Specify that the event is only a resize, so do not recalculate limits
        visualUpdateArgs.type = 4;
        visual.update(visualUpdateArgs);
      }
    };
  }
}

function chartSvgBlob(svg) {
  const copy = svg.cloneNode(true);
  const width = svg.width.baseVal.value;
  const height = svg.height.baseVal.value;
  const properties = [
    "fill", "fill-opacity", "stroke", "stroke-width", "stroke-opacity", "stroke-dasharray",
    "font-family", "font-size", "font-weight", "font-style", "text-anchor",
    "dominant-baseline", "opacity", "visibility", "display"
  ];
  const originals = [svg, ...svg.querySelectorAll("*")];
  const copies = [copy, ...copy.querySelectorAll("*")];
  originals.forEach((node, index) => {
    const style = getComputedStyle(node);
    properties.forEach(property => copies[index].style.setProperty(property, style.getPropertyValue(property)));
  });
  copy.querySelectorAll(".chart-tooltip-group").forEach(node => node.remove());
  copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  copy.setAttribute("width", width);
  copy.setAttribute("height", height);
  if (!copy.hasAttribute("viewBox")) copy.setAttribute("viewBox", `0 0 ${width} ${height}`);

  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  const backgroundColour = getComputedStyle(svg).backgroundColor;
  background.setAttribute("width", "100%");
  background.setAttribute("height", "100%");
  background.setAttribute("fill", backgroundColour === "rgba(0, 0, 0, 0)" ? "white" : backgroundColour);
  copy.prepend(background);
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
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("PNG export failed")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function addExportControl(el, svg, chartType) {
  el.classList.add("controlcharts-widget");
  const control = document.createElement("details");
  control.className = "controlcharts-export";
  control.innerHTML = `
    <summary aria-label="Export chart" title="Export chart">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="M12 3v12m-4-4 4 4 4-4M5 16v5h14v-5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </summary>
    <div class="controlcharts-export-options" role="group" aria-label="Export image">
      <button type="button" data-format="svg">SVG</button>
      <button type="button" data-format="png">PNG</button>
      <span class="controlcharts-export-status" role="status"></span>
    </div>`;
  el.appendChild(control);
  const summary = control.querySelector("summary");
  const buttons = control.querySelectorAll("button");
  const status = control.querySelector(".controlcharts-export-status");
  control.addEventListener("click", event => event.stopPropagation());
  control.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      control.open = false;
      summary.focus();
      event.stopPropagation();
    }
  });
  control.addEventListener("focusout", event => {
    if (!control.contains(event.relatedTarget)) control.open = false;
  });
  buttons.forEach(button => button.addEventListener("click", async () => {
    const format = button.dataset.format;
    const title = svg.querySelector(".chart-title")?.textContent || chartType;
    const filename = title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").trim().replace(/[. ]+$/, "") || chartType;
    status.textContent = "";
    buttons.forEach(item => item.disabled = true);
    control.setAttribute("aria-busy", "true");
    try {
      let blob = chartSvgBlob(svg);
      if (format === "png") blob = await chartPngBlob(blob, svg.width.baseVal.value, svg.height.baseVal.value);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      control.open = false;
      summary.focus();
    } catch (error) {
      status.textContent = "Could not export image. Please try again.";
    } finally {
      buttons.forEach(item => item.disabled = false);
      control.removeAttribute("aria-busy");
    }
  }));
}
