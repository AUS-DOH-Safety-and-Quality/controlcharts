/*
  Assumes that the following files have already been loaded by the `htmlwidgets` package:
    - ./commonUtils.js
    - ../PBISPC/PBISPC.js
    - ../PBIFUN/PBIFUN.js
*/

function makeFactory(chartType) {
  return function(el, width, height) {
    // Initialise crosstalk objects for interactivity (highlighting and filtering)
    var crosstalkFilterHandle = new crosstalk.FilterHandle();
    var crosstalkSelectionHandle = new crosstalk.SelectionHandle();

    // Initialise the chart object for calculating limits and rendering
    var visual = new window[chartType].Visual(makeConstructorArgs(el));

    // Initialise the arguments for the visual update function
    // so that they can be reused across rendering, resizing, and filtering
    var visualUpdateArgs = {
      dataViews: [],
      viewport: { width: width, height: height },
      // Change in data, so recalculate limits
      type: 2
    };

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
        var updateValues = makeUpdateValues(x.data_raw, x.input_settings, x.aggregations, x.has_conditional_formatting, x.unique_categories);
        visualUpdateArgs.dataViews = updateValues.dataViews;

        // Initialise the dataset linkage for crosstalk highlighting and filtering
        crosstalkSelectionHandle.setGroup(x.crosstalkGroup);
        crosstalkFilterHandle.setGroup(x.crosstalkGroup);

        // Crosstalk highlighting callback - when a crosstalk highlighting event occurs,
        // use existing visual functions for handling selection and highlighting as the
        // selectionManager functions for mapping identities to selected points have
        // already been replaced with crosstalk equivalents
        crosstalkSelectionHandle.on("change", function(e) { visual.updateHighlighting() });

        // Crosstalk filtering callback - When a crosstalk filtering event occurs,
        // filter the original dataset before re-aggregating and re-rendering the visual
        // (see the `makeUpdateValues` function)
        crosstalkFilterHandle.on("change", function(e) {
          var filteredUpdateValues = makeUpdateValues(x.data_raw, x.input_settings, x.aggregations, x.has_conditional_formatting, x.unique_categories, e.value);
          visualUpdateArgs.dataViews = filteredUpdateValues.dataViews;
          visualUpdateArgs.type = 2; // Change in data, so recalculate limits
          visualUpdateArgs.frontend = true; // Enable additional compatibility for non-PBI rendering

          visual.update(visualUpdateArgs);
        })

        // Replace PowerBI function for assigning selection identities to points,
        // so that the visual will automatically assign the correct crosstalk identities
        visual.host.createSelectionIdBuilder = () => ({
          withCategory: (allCategories, categoryIndex) => ({
            createSelectionId: () => updateValues.crosstalkIdentities[allCategories.values[categoryIndex]]
          })
        })

        visual.host.tooltipService.show = (tooltipArgs) => {
          var boundRect = visual.svg.node().getBoundingClientRect();
          var tooltipGroup = visual.svg.select(".chart-tooltip-group");
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
