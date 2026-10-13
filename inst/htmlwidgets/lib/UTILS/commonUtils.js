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

function isMissing(value) {
  return value == null || Number.isNaN(value);
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
    if (!isMissing(value)) {
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

const defaultAggregations = {
  numerators: "sum",
  denominators: "sum",
  groupings: "first",
  xbar_sds: "first",
  tooltips: "first",
  labels: "first"
};

const aggregationMethods = ["first", "last", "sum", "mean", "min", "max", "median", "count"];

function chartAggregations(aggregations) {
  const result = { ...defaultAggregations };
  const names = Object.keys(aggregations ?? {});
  for (let i = 0; i < names.length; i++) {
    const method = aggregations[names[i]];
    if (!Object.hasOwn(defaultAggregations, names[i])) {
      const options = Object.keys(defaultAggregations).join(", ");
      return { error: `'${names[i]}' is not a valid variable to aggregate. Valid options are: ${options}.` };
    }
    if (!aggregationMethods.includes(method)) {
      return { error: `'${method}' is not a valid aggregation. Valid options are: ${aggregationMethods.join(", ")}.` };
    }
    result[names[i]] = method;
  }
  return { aggregations: result };
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

// Missing values last, numbers by value, and text by code point so that order is locale-independent
function compareValues(a, b) {
  const aMissing = isMissing(a);
  const bMissing = isMissing(b);
  if (aMissing || bMissing) {
    return aMissing - bMissing;
  }
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  const aText = String(a);
  const bText = String(b);
  if (aText === bText) {
    return 0;
  }
  return aText < bText ? -1 : 1;
}

function makeUpdateValues(rawData, inputSettings, aggregations, crosstalkFilters) {
  const valueNames = [];
  const valueColumns = [];
  const rawNames = Object.keys(rawData);
  for (let i = 0; i < rawNames.length; i++) {
    if (!["categories", "category_levels", "crosstalk_identities", "indicators", "tooltips"].includes(rawNames[i])) {
      valueNames.push(rawNames[i]);
      valueColumns.push(asArray(rawData[rawNames[i]]));
    }
  }
  const indicatorNames = Object.keys(rawData.indicators ?? {});
  const indicatorColumns = new Array(indicatorNames.length);
  for (let i = 0; i < indicatorNames.length; i++) {
    indicatorColumns[i] = asArray(rawData.indicators[indicatorNames[i]]);
  }
  const hasIndicators = indicatorNames.length > 0;
  const tooltipNames = Object.keys(rawData.tooltips ?? {});
  const tooltipColumns = new Array(tooltipNames.length);
  for (let i = 0; i < tooltipNames.length; i++) {
    tooltipColumns[i] = asArray(rawData.tooltips[tooltipNames[i]]);
  }
  const categories = asArray(rawData.categories);
  const crosstalkIdentities = asArray(rawData.crosstalk_identities);
  // Categories with levels (e.g., R factors) are ordered by level rather than value
  let categoryOrder = categories;
  if (rawData.category_levels != null) {
    const levels = asArray(rawData.category_levels);
    const ranks = new Map();
    for (let i = 0; i < levels.length; i++) {
      ranks.set(levels[i], i);
    }
    categoryOrder = new Array(categories.length);
    for (let i = 0; i < categories.length; i++) {
      categoryOrder[i] = ranks.get(categories[i]);
    }
  }

  const order = new Array(categories.length);
  for (let i = 0; i < order.length; i++) {
    order[i] = i;
  }
  order.sort((a, b) => {
    for (let i = 0; i < indicatorColumns.length; i++) {
      const comparison = compareValues(indicatorColumns[i][a], indicatorColumns[i][b]);
      if (comparison !== 0) {
        return comparison;
      }
    }
    return compareValues(categoryOrder[a], categoryOrder[b]);
  });

  const dataGrouped = new Map();
  for (let i = 0; i < order.length; i++) {
    const row = order[i];
    if (crosstalkFilters && !crosstalkFilters.includes(crosstalkIdentities[row])) {
      continue;
    }
    const category = isMissing(categories[row]) ? null : String(categories[row]);
    const indicators = new Array(indicatorColumns.length);
    for (let j = 0; j < indicatorColumns.length; j++) {
      indicators[j] = indicatorColumns[j][row];
    }
    const groupKey = JSON.stringify([category, ...indicators]);
    let group = dataGrouped.get(groupKey);
    if (group === undefined) {
      group = {
        category,
        indicators,
        rows: []
      };
      dataGrouped.set(groupKey, group);
    }
    group.rows.push(row);
  }

  const args = {
    categories: [{
      source: { roles: {"key": true}, type: { temporal: { underlyingType: 519 } } },
      values: [],
      objects: []
    }],
    values: [],
    crosstalk_identities: hasIndicators ? [] : {}
  };
  for (let i = 0; i < indicatorNames.length; i++) {
    args.categories.push({
      source: { displayName: indicatorNames[i], roles: { indicator: true } },
      values: []
    });
  }
  for (let i = 0; i < valueNames.length; i++) {
    args.values.push({
      source: { roles: {[valueNames[i]]: true} },
      values: []
    });
  }
  // The visuals format tooltip values by type, and label them by name
  for (let i = 0; i < tooltipNames.length; i++) {
    args.values.push({
      source: { displayName: tooltipNames[i], roles: { tooltips: true }, type: { text: true } },
      values: []
    });
  }

  // Settings given per row arrive as objects keyed by crosstalk identity
  const settingGroupNames = [];
  const settingGroupEntries = [];
  let conditional = false;
  const inputGroupNames = Object.keys(inputSettings);
  for (let i = 0; i < inputGroupNames.length; i++) {
    const settingGroup = inputSettings[inputGroupNames[i]];
    if (settingGroup == null) {
      continue;
    }
    const entries = Object.entries(settingGroup);
    for (let j = 0; j < entries.length; j++) {
      conditional ||= isPlainObject(entries[j][1]);
    }
    settingGroupNames.push(inputGroupNames[i]);
    settingGroupEntries.push(entries);
  }

  for (const group of dataGrouped.values()) {
    args.categories[0].values.push(group.category);
    for (let i = 0; i < group.indicators.length; i++) {
      args.categories[i + 1].values.push(group.indicators[i]);
    }
    const groupIdentities = new Array(group.rows.length);
    for (let i = 0; i < group.rows.length; i++) {
      groupIdentities[i] = crosstalkIdentities[group.rows[i]];
    }
    if (hasIndicators) {
      args.crosstalk_identities.push(groupIdentities);
    } else {
      args.crosstalk_identities[group.category] = groupIdentities;
    }
    if (conditional) {
      const settingsClone = {};
      for (let i = 0; i < settingGroupEntries.length; i++) {
        const groupClone = {};
        for (let j = 0; j < settingGroupEntries[i].length; j++) {
          const settingValue = settingGroupEntries[i][j][1];
          groupClone[settingGroupEntries[i][j][0]] = isPlainObject(settingValue)
            ? settingValue[groupIdentities[0]]
            : settingValue;
        }
        settingsClone[settingGroupNames[i]] = groupClone;
      }
      args.categories[0].objects.push(settingsClone);
    } else {
      args.categories[0].objects.push(inputSettings);
    }

    const groupValues = new Array(group.rows.length);
    for (let i = 0; i < valueNames.length + tooltipNames.length; i++) {
      const isValue = i < valueNames.length;
      const column = isValue ? valueColumns[i] : tooltipColumns[i - valueNames.length];
      for (let j = 0; j < group.rows.length; j++) {
        groupValues[j] = column[group.rows[j]];
      }
      const aggregation = isValue ? aggregations[valueNames[i]] : aggregations.tooltips;
      args.values[i].values.push(aggregateColumn(groupValues, aggregation));
    }
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

const defaultTitleSettings = {
  text: null,
  font_size: "16px",
  font_weight: "bold",
  font_family: "'Arial', sans-serif",
  x: "50%",
  y: 5,
  text_anchor: "middle",
  dominant_baseline: "hanging",
  subtitle: null,
  subtitle_font_size: "12px",
  subtitle_font_weight: "normal"
};

function chartTitle(title) {
  const settings = { ...defaultTitleSettings };
  if (typeof title === "string") {
    settings.text = title;
    return { settings };
  }
  let valid = title == null || isPlainObject(title);
  const names = valid && title != null ? Object.keys(title) : [];
  for (let i = 0; i < names.length; i++) {
    if (!Object.hasOwn(defaultTitleSettings, names[i])) {
      valid = false;
    } else if (title[names[i]] != null) {
      settings[names[i]] = title[names[i]];
    }
  }
  if (!valid) {
    const options = Object.keys(defaultTitleSettings).join("', '");
    return { error: `The title must be a string, or named settings from: '${options}'.` };
  }
  return { settings };
}

// Reserves room for the title, and for axis labels in static plots, without modifying the input
function paddedDataViews(chartType, dataViews, titleSettings, staticPlot) {
  const defaults = globalThis[chartType].defaultSettings;
  let titlePadding = 0;
  if (titleSettings.text !== null) {
    titlePadding = parseFloat(titleSettings.font_size) + titleSettings.y;
    if (titleSettings.subtitle !== null) {
      titlePadding += parseFloat(titleSettings.subtitle_font_size);
    }
  }
  const categories = dataViews[0].categorical.categories.slice();
  const objects = new Array(categories[0].objects.length);
  for (let i = 0; i < objects.length; i++) {
    const settings = categories[0].objects[i];
    const canvas = { ...defaults.canvas, ...settings.canvas };
    canvas.upper_padding += titlePadding;
    if (staticPlot) {
      const xAxis = { ...defaults.x_axis, ...settings.x_axis };
      canvas.left_padding += 50;
      canvas.lower_padding += 10 + xAxis.xlimit_tick_size;
      // Rotated tick labels hang further below the axis
      if (xAxis.xlimit_tick_rotation !== 0) {
        canvas.lower_padding += 15;
      }
      // The funnel visual spaces its x-axis label 20px further from the axis than the SPC visual
      if (chartType === "spc" && xAxis.xlimit_label) {
        canvas.lower_padding += 20;
      }
    }
    objects[i] = { ...settings, canvas };
  }
  categories[0] = { ...categories[0], objects };
  return [{ ...dataViews[0], categorical: { ...dataViews[0].categorical, categories } }];
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
