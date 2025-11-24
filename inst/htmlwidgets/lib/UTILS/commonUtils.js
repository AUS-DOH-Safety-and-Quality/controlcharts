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

const aggregateColumn = function(column, aggregation) {
  switch(aggregation) {
    case "sum":
      return column.reduce((acc, val) => acc + val, 0);
    case "mean":
      return column.reduce((acc, val) => acc + val, 0) / column.length;
    case "sd":
      var mean = column.reduce((acc, val) => acc + val, 0) / column.length;
      return Math.sqrt(column.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (column.length - 1));
    case "count":
      return column.length;
    case "min":
      return Math.min(...column);
    case "max":
      return Math.max(...column);
    case "median":
      var sorted = [...column].sort((a, b) => a - b);
      var mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    case "first":
      return column[0];
    case "last":
      return column[column.length - 1];
    default:
      throw new Error(`Unsupported aggregation: ${aggregation}`);
  }
}

function makeUpdateValues(rawData, inputSettings, aggregations, has_conditional_formatting, unique_categories, crosstalkFilters) {
  if (crosstalkFilters) {
    rawData = rawData.filter(d => crosstalkFilters.includes(d.crosstalkIdentities));
  }
  var dataGrouped = Object.groupBy(rawData, d => d.categories);
  Object.freeze(dataGrouped);
  var identitiesGrouped = [];
  for (group in dataGrouped) {
    // Group crosstalk identities for each category group
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

  // Convert unique_categories to strings for comparison
  //   against string keys in dataGrouped
  unique_categories = unique_categories.map(d => d.toString());

  for (var category in dataGrouped) {
    args.categories[0].values.push(category);
    if (has_conditional_formatting) {
      // If multiple values are passed for a given setting, extract the one for the current category
      // Deep-clone the input settings to avoid modifying the original object
      var settingsClone = JSON.parse(JSON.stringify(inputSettings));
      for (var settingGroup in settingsClone) {
        for (var setting in settingsClone[settingGroup]) {
          if (Array.isArray(settingsClone[settingGroup][setting])) {
            var index = unique_categories.indexOf(category);
            settingsClone[settingGroup][setting] = settingsClone[settingGroup][setting][index];
          }
        }
      }
      args.categories[0].objects.push(settingsClone);
    } else {
      args.categories[0].objects.push(inputSettings);
    }

    for (var i = 0; i < valueNames.length; i++) {
      var name = valueNames[i];
      var aggregatedValue = aggregateColumn(dataGrouped[category].map(dataRow => dataRow[name]), aggregations[name]);
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

function updateChartTitle(svg, title_settings) {
  // Remove any existing titles
  svg.selectAll(".chart-title").remove();
  // Add chart title if provided
  if (title_settings.text !== null) {
    // Append the title to the SVG
    svg.append("text")
      .classed("chart-title", true)
      .attr("x", title_settings.x)
      .attr("y", title_settings.y)
      .attr("text-anchor", title_settings.text_anchor)
      .attr("dominant-baseline", title_settings.dominant_baseline)
      .attr("font-size", title_settings.font_size)
      .attr("font-weight", title_settings.font_weight)
      .attr("font-family", title_settings.font_family)
      .text(title_settings.text);
  }
  return svg;
}