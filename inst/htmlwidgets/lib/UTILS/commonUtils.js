const makeConstructorArgs = function(element) {
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
        show: () => {},
        hide: () => {}
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
      },
      displayWarningIcon: console.log
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

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function makeUpdateValues(rawData, inputSettings, aggregations, has_conditional_formatting, unique_categories, crosstalkFilters) {
  var indicatorColumns = Object.entries(rawData.indicators ?? {});
  var hasIndicators = indicatorColumns.length > 0;
  var valueNames = Object.keys(rawData).filter(k => ![
    "categories", "crosstalk_identities", "indicators"
  ].includes(k));
  var dataGrouped = new Map();
  rawData.categories.forEach((cat, idx) => {
    if (crosstalkFilters && !(crosstalkFilters.includes(rawData.crosstalk_identities[idx]))) {
      return;
    }
    var indicators = indicatorColumns.map(([, values]) => values[idx]);
    var groupKey = JSON.stringify([cat, ...indicators]);
    if (!dataGrouped.has(groupKey)) {
      dataGrouped.set(groupKey, {
        category: cat,
        indicators: indicators,
        rows: []
      });
    }
    dataGrouped.get(groupKey).rows.push({
      crosstalk_identity: rawData.crosstalk_identities[idx],
      values: Object.fromEntries(valueNames.map(name => [name, rawData[name][idx]]))
    });
  });

  var args = {
    categories: [{
      source: { roles: {"key": true}, type: { temporal: { underlyingType: 519 } } },
      values: [],
      objects: []
    }],
    values: [],
    crosstalk_identities: hasIndicators ? [] : {}
  };

  indicatorColumns.forEach(([name]) => {
    args.categories.push({
      source: { displayName: name, roles: { indicator: true } },
      values: []
    });
  });

  args.values = valueNames.map(name => ({
    source: { roles: {[name]: true} },
    values: []
  }));

  for (var group of dataGrouped.values()) {
    args.categories[0].values.push(group.category);
    group.indicators.forEach((indicator, index) => {
      args.categories[index + 1].values.push(indicator);
    });
    var groupIdentities = group.rows.map(row => row.crosstalk_identity);
    if (hasIndicators) {
      args.crosstalk_identities.push(groupIdentities);
    } else {
      args.crosstalk_identities[group.category] = groupIdentities;
    }
    if (has_conditional_formatting) {
      var firstIdentity = groupIdentities[0];
      var settingsClone = JSON.parse(JSON.stringify(inputSettings));
      for (var settingGroup in settingsClone) {
        if (settingsClone[settingGroup] == null) {
          continue;
        }
        for (var setting in settingsClone[settingGroup]) {
          if (isPlainObject(settingsClone[settingGroup][setting])) {
            settingsClone[settingGroup][setting] = settingsClone[settingGroup][setting][firstIdentity];
          }
        }
      }
      args.categories[0].objects.push(settingsClone);
    } else {
      args.categories[0].objects.push(inputSettings);
    }

    for (var i = 0; i < valueNames.length; i++) {
      var name = valueNames[i];
      var aggregatedValue = aggregateColumn(group.rows.map(row => row.values[name]), aggregations[name]);
      args.values[i].values.push(aggregatedValue);
    }
  }

  return {
    dataViews: [{
      categorical: {
        categories: args.categories,
        values: args.values
      },
      metadata: {
        columns: hasIndicators
          ? args.categories.map(column => column.source)
              .concat(args.values.map(column => column.source))
          : [
              { roles: { key: true }},
              { roles: { numerators: true }}
            ]
      }
    }],
    crosstalk_identities: args.crosstalk_identities
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
