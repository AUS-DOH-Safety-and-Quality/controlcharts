const makeConstructorArgs = function(element) {
  var d3 = (globalThis?.spc?.d3 ?? globalThis?.funnel?.d3);
  return {
    element: element,
    host: {
      createSelectionManager: () => ({
        registerOnSelectCallback: () => {},
        getSelectionIds: () => [],
        showContextMenu: () => {},
        clear: () => {}
      }),
      createSelectionIdBuilder: () => ({
        withCategory: () => ({ createSelectionId: () => {} })
      }),
      tooltipService: {
        show: (x) => {
          var tooltipGroup = d3.select(element).select(".chart-tooltip-group");
          tooltipGroup.selectAll("rect")
                    .data([0])
                    .join("rect")
                    .attr("fill", "#ffffff")
                    .attr("width", 50)
                    .attr("height", 50);

          tooltipGroup.selectAll("text")
                      .data(x.dataItems)
                      .join("text")
                      .attr("fill", "black")
                      .style("text-anchor", "left")
                      .attr("x", 5)
                      .attr("y", (_, i) => 0 + 15*i)
                      .text(d => `${d.displayName}: ${d.value}`);
          tooltipGroup.attr("transform", `translate(${x.coordinates[0]}, ${x.coordinates[1]})`);
        },
        hide: () => {
          d3.select(element)
            .select(".chart-tooltip-group")
            .selectChildren()
            .remove();
        }
      },
      eventService: {
        renderingStarted: () => {},
        renderingFailed: () => {},
        renderingFinished: () => {}
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
      }
    }
  }
}

function makeUpdateValues(rawData, inputSettings, crosstalkFilters) {
  if (crosstalkFilters) {
    rawData = rawData.filter(d => crosstalkFilters.includes(d.crosstalkIdentities));
  }
  var dataGrouped = Object.groupBy(rawData, d => d.categories);
  Object.freeze(dataGrouped);
  var identitiesGrouped = [];
  for (group in dataGrouped) {
    identitiesGrouped.push([group, dataGrouped[group].map(d => d.crosstalkIdentities)]);
  }

  var args = {
    categories: [{
      source: { roles: {"key": true}, type: { temporal: { underlyingType: 519 } } },
      values: [],
      objects: []
    }],
    values: [],
    crosstalkIdentities: Object.fromEntries(identitiesGrouped)
  };

  var valueNames = Object.keys(rawData[0]).filter(k => !["categories", "crosstalkIdentities"].includes(k));

  args.values = valueNames.map(name => ({
    source: { roles: {[name]: true} },
    values: []
  }));

  for (var category in dataGrouped) {
    args.categories[0].values.push(category);
    args.categories[0].objects.push(inputSettings);

    for (var i = 0; i < valueNames.length; i++) {
      var name = valueNames[i];
      var aggregatedValue = dataGrouped[category].map(dataRow => dataRow[name])
                                                 .reduce((acc, val) => acc + val, 0)
      args.values[i].values.push(aggregatedValue);
    }
  }

  return {
    dataViews: [{
      categorical: {
        categories: args.categories,
        values: args.values
      }
    }],
    crosstalkIdentities: args.crosstalkIdentities
  };
}
