function makeSelectionId(keys) {
  return { keys, getKey: () => JSON.stringify(keys) };
}

function makeSelectionIdBuilder(resolveKeys) {
  let keys;
  const builder = {
    withCategory: (category, index) => {
      keys = resolveKeys(category, index);
      return builder;
    },
    createSelectionId: () => makeSelectionId(keys)
  };
  return builder;
}

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
      createSelectionIdBuilder: () => makeSelectionIdBuilder((_, index) => [String(index)]),
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
  if (aggregation === "first") {
    return column[0];
  }
  if (aggregation === "last") {
    return column[column.length - 1];
  }
  const values = [];
  let sum = 0;
  for (let i = 0; i < column.length; i++) {
    const value = column[i];
    if (value != null && !Number.isNaN(value)) {
      values.push(value);
      sum += value;
    }
  }
  if (values.length === 0) {
    return null;
  }
  switch(aggregation) {
    case "sum":
      return sum;
    case "mean":
      return sum / values.length;
    case "sd": {
      const mean = sum / values.length;
      let squaredDeviations = 0;
      for (let i = 0; i < values.length; i++) {
        squaredDeviations += Math.pow(values[i] - mean, 2);
      }
      return Math.sqrt(squaredDeviations / (values.length - 1));
    }
    case "count":
      return values.length;
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
    case "median": {
      values.sort((a, b) => a - b);
      const mid = Math.floor(values.length / 2);
      return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
    }
    default:
      throw new Error(`Unsupported aggregation: ${aggregation}`);
  }
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

function makeUpdateValues(rawData, inputSettings, aggregations, has_conditional_formatting, unique_categories, crosstalkFilters) {
  var indicatorColumns = Object.entries(rawData.indicators ?? {})
    .map(([name, values]) => [name, asArray(values)]);
  var hasIndicators = indicatorColumns.length > 0;
  var tooltipColumns = Object.entries(rawData.tooltips ?? {})
    .map(([name, values]) => [name, asArray(values)]);
  var valueNames = Object.keys(rawData).filter(k => ![
    "categories", "crosstalk_identities", "indicators", "tooltips"
  ].includes(k));
  var categories = asArray(rawData.categories);
  var crosstalkIdentities = asArray(rawData.crosstalk_identities);
  var valueColumns = Object.fromEntries(
    valueNames.map(name => [name, asArray(rawData[name])])
  );
  var dataGrouped = new Map();
  categories.forEach((cat, idx) => {
    if (crosstalkFilters && !(crosstalkFilters.includes(crosstalkIdentities[idx]))) {
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
      crosstalk_identity: crosstalkIdentities[idx],
      values: Object.fromEntries(valueNames.map(name => [name, valueColumns[name][idx]])),
      tooltips: tooltipColumns.map(([, values]) => values[idx])
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

  // The visuals format tooltip values by type, and label them by name
  tooltipColumns.forEach(([name]) => {
    args.values.push({
      source: { displayName: name, roles: { tooltips: true }, type: { text: true } },
      values: []
    });
  });

  // Settings layout is the same for every group, so resolve it once up-front
  var settingGroupEntries = has_conditional_formatting
    ? Object.keys(inputSettings)
        .filter(settingGroup => inputSettings[settingGroup] != null)
        .map(settingGroup => [settingGroup, Object.entries(inputSettings[settingGroup])])
    : [];

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
      // Conditionally-formatted settings arrive as objects keyed by identity,
      // so pick out this group's value rather than copying every group's value
      var firstIdentity = groupIdentities[0];
      var settingsClone = {};
      for (var gi = 0; gi < settingGroupEntries.length; gi++) {
        var settingGroupName = settingGroupEntries[gi][0];
        var settingEntries = settingGroupEntries[gi][1];
        var groupClone = {};
        for (var si = 0; si < settingEntries.length; si++) {
          var settingValue = settingEntries[si][1];
          groupClone[settingEntries[si][0]] = isPlainObject(settingValue)
            ? settingValue[firstIdentity]
            : settingValue;
        }
        settingsClone[settingGroupName] = groupClone;
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
    tooltipColumns.forEach((_, index) => {
      var aggregatedTooltip = aggregateColumn(group.rows.map(row => row.tooltips[index]), aggregations.tooltips);
      args.values[valueNames.length + index].values.push(aggregatedTooltip);
    });
  }

  const columns = new Array(args.categories.length + args.values.length);
  for (let i = 0; i < columns.length; i++) {
    columns[i] = i < args.categories.length
      ? args.categories[i].source
      : args.values[i - args.categories.length].source;
  }
  const metadata = { columns };
  if (hasIndicators && inputSettings.misc?.group !== undefined) {
    const group = ccCore.groupCategoryRows([{ values: [String(inputSettings.misc.group)] }], 1);
    metadata.objects = { misc: { group: group.keys[0] } };
  }

  return {
    dataViews: [{
      categorical: {
        categories: args.categories,
        values: args.values
      },
      metadata
    }],
    crosstalk_identities: args.crosstalk_identities
  };
}

function updateChartTitle(svg, title_settings) {
  // Remove any existing titles
  svg.selectAll(".chart-title, .chart-subtitle").remove();
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
    // Add subtitle below the title if provided
    if (title_settings.subtitle !== null && title_settings.subtitle !== undefined) {
      svg.append("text")
        .classed("chart-subtitle", true)
        .attr("x", title_settings.x)
        .attr("y", title_settings.y + parseFloat(title_settings.font_size))
        .attr("text-anchor", title_settings.text_anchor)
        .attr("dominant-baseline", title_settings.dominant_baseline)
        .attr("font-size", title_settings.subtitle_font_size)
        .attr("font-weight", title_settings.subtitle_font_weight)
        .attr("font-family", title_settings.font_family)
        .text(title_settings.subtitle);
    }
  }
  return svg;
}
