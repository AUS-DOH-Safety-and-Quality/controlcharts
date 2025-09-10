function sum(arr) {
  return arr.reduce((acc, val) => acc + val, 0);
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

  var valueNames = Object.keys(rawData[0]).filter(k => ["categories", "crosstalkIdentities"].includes(k) === false);

  args.values = valueNames.map(name => ({
    source: { roles: {[name]: true} },
    values: []
  }));

  for (var category in dataGrouped) {
    args.categories[0].values.push(category);
    args.categories[0].objects.push(inputSettings);

    var categoryData = dataGrouped[category];

    for (var i = 0; i < valueNames.length; i++) {
      var name = valueNames[i];
      args.values[i].values.push(sum(categoryData.map(d => d[name])));
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

const makeConstructorArgs = function(type, element) {
  var d3 = type === "spc" ? spc.d3 : funnel.d3;
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
          var tooltipGroup = d3.select(element).select(".spc-ttip-group");
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
          var tooltipGroup = d3.select(element).select(".spc-ttip-group");
          tooltipGroup.selectAll("rect").remove();
          tooltipGroup.selectAll("text").remove();
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

function updateVisual(type, categories, values, width, height) {
  var updateArgs = {
    dataViews: [
      {
        categorical: {
          categories: categories,
          values: values
        }
      }
    ],
    viewport: {
      width: width,
      height: height
    },
    type: 2,
    headless: true
  };

  if (type === "spc") {
    spcVisual.update(updateArgs);
    return {
      plotPoints: spcVisual.viewModel.plotPoints,
      svg: spcVisual.svg.node().innerHTML
    };
  } else if (type === "funnel") {
    funnelVisual.update(updateArgs);
    return {
      plotPoints: funnelVisual.viewModel.plotPoints,
      calculatedLimits: funnelVisual.viewModel.calculatedLimits,
      svg: funnelVisual.svg.node().innerHTML
    };
  }
}

function makeFactory(type) {
  return function(el, width, height) {
    var constructorArgs = makeConstructorArgs(type, el);
    var visual = type === "spc" ? new spc.Visual(constructorArgs) : new funnel.Visual(constructorArgs);

    var crosstalkSelectionHandle = new crosstalk.SelectionHandle();
    visual.selectionManager.getSelectionIds = () => crosstalkSelectionHandle.value ?? []
    visual.selectionManager.clear = () => crosstalkSelectionHandle.clear()
    crosstalkSelectionHandle.on("change", function(e) { visual.updateHighlighting() });

    var crosstalkFilterHandle = new crosstalk.FilterHandle();

    visual.svg.append("g").classed("spc-ttip-group", true).append("rect");

    var updateArgs = {
      dataViews: [{
        categorical: {
          categories: [{
            source: { roles: {"key": true} },
            values: ["A", "B", "C"]
          }],
          values: [{
            source: { roles: {"numerators": true} },
            values: [1, 2, 3]
          }]
        }
      }],
      viewport: {
        width: width,
        height: height
      },
      type: 2
    };

    return {
      renderValue: function(x) {
        crosstalkSelectionHandle.setGroup(x.settings.crosstalkGroup);
        crosstalkFilterHandle.setGroup(x.settings.crosstalkGroup);

        crosstalkFilterHandle.on("change", function(e) {
          var filteredUpdateValues = makeUpdateValues(x.data_raw, x.input_settings, e.value);
          updateArgs.dataViews = filteredUpdateValues.dataViews;

          visual.update(updateArgs);
        })

        var updateValues = makeUpdateValues(x.data_raw, x.input_settings);
        visual.host.createSelectionIdBuilder = () => ({
          withCategory: (cat, idx) => ({
            createSelectionId: () => updateValues.crosstalkIdentities?.[cat.values[idx]]
          })
        })

        visual.selectionManager.select = (currentIdentity, multiSelect) => {
          var newIdentities = currentIdentity;
          if (multiSelect && crosstalkSelectionHandle.value) {
            newIdentities = newIdentities.concat(crosstalkSelectionHandle.value)
          }
          crosstalkSelectionHandle.set(newIdentities)
          return { then: (f) => f() }
        }

        updateArgs.dataViews = updateValues.dataViews;
        visual.update(updateArgs);
      },

      resize: function(width, height) {
        updateArgs.viewport.width = width;
        updateArgs.viewport.height = height;
        visual.update(updateArgs);
      }
    };
  }
}
