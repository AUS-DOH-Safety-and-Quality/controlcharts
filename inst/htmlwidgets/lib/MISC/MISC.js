var misc = (function () {
"use strict";

const defaultSettings = {
  canvas: {
    upper_padding: 80,
    right_padding: 20,
    lower_padding: 45,
    left_padding: 220,
    background_colour: "#FFFFFF",
    font_family: "Arial, sans-serif"
  },
  misc: {
    source: "",
    unfavourable_label: "Unfavourable",
    favourable_label: "Favourable",
    unfavourable_colour: "#E46C0A",
    favourable_colour: "#00B0F0",
    direction_font_size: 12
  },
  bars: {
    colour_deterioration: "#E46C0A",
    colour_none: "#A6A6A6",
    colour_improvement: "#00B0F0",
    height_ratio: 0.65,
    opacity: 1
  },
  lines: {
    colour: "#00667B",
    width: 1.5,
    show_95: true,
    show_99: true,
    show_zero: true,
    lower_95: -1.959963984540054,
    upper_95: 1.959963984540054,
    lower_99: -3.090232306167813,
    upper_99: 3.090232306167813,
    type_95: "2,2",
    type_99: "6,4"
  },
  x_axis: {
    xlimit_l: -5,
    xlimit_u: 5,
    xlimit_tick_interval: 1,
    xlimit_tick_size: 10,
    xlimit_tick_font: "Arial, sans-serif",
    xlimit_colour: "#000000",
    xlimit_grid_show: true,
    xlimit_grid_colour: "#E5E5E5",
    xlimit_label: ""
  },
  y_axis: {
    ylimit_tick_size: 11,
    ylimit_tick_font: "Arial, sans-serif",
    ylimit_colour: "#000000",
    group_tick_size: 11,
    group_font_weight: "bold"
  }
};

function valueColumn(view, role) {
  return (view.values || []).find(column => column.source.roles?.[role]);
}

function tooltipColumns(view) {
  return (view.values || []).filter(column => column.source.roles?.tooltips);
}

function columnValues(column) {
  if (!column) return [];
  return Array.isArray(column.values) ? column.values : [column.values];
}

function mergeSettings(objects) {
  const settings = {};
  Object.keys(defaultSettings).forEach(group => {
    settings[group] = Object.assign({}, defaultSettings[group], objects?.[group] || {});
  });
  return settings;
}

function formatNumber(value, digits) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "";
  }
  return Number(value).toFixed(digits);
}

function pointColour(point) {
  const bars = point.settings.bars;
  if (point.outlier === "improvement") return bars.colour_improvement;
  if (point.outlier === "deterioration") return bars.colour_deterioration;
  return bars.colour_none;
}

function makeTooltip(point, extras) {
  const value = value => `${formatNumber(value, point.sigFigs)}${point.suffix}`;
  const countDigits = point.suffix === "%" ? 0 : point.sigFigs;
  const items = [
    { displayName: "Indicator", value: point.indicator },
    { displayName: "Group", value: point.group },
    { displayName: "Z-score", value: formatNumber(point.score, 3) },
    { displayName: "Numerator", value: formatNumber(point.numerator, countDigits) },
    { displayName: "Denominator", value: formatNumber(point.denominator, countDigits) },
    { displayName: "Actual Value", value: value(point.value) },
    { displayName: "Upper 99.8% Limit", value: value(point.ul99) },
    { displayName: "Centerline", value: value(point.target) },
    { displayName: "Lower 99.8% Limit", value: value(point.ll99) }
  ];
  extras.forEach(extra => items.push(extra));
  return items;
}

class MiscViewModel {
  constructor() {
    this.plotPoints = [];
    this.svgWidth = 0;
    this.svgHeight = 0;
    this.settings = mergeSettings(null);
  }

  update(options, host) {
    this.svgWidth = options.viewport.width;
    this.svgHeight = options.viewport.height;
    this.plotPoints = [];
    const view = options.dataViews?.[0]?.categorical;
    if (!view || !view.categories?.[0]) {
      return { status: true };
    }

    const category = view.categories[0];
    const columns = {
      groupings: valueColumn(view, "groupings"),
      groups: valueColumn(view, "groups"),
      scores: valueColumn(view, "scores"),
      zScores: valueColumn(view, "z_scores"),
      outliers: valueColumn(view, "outliers"),
      numerators: valueColumn(view, "numerators"),
      denominators: valueColumn(view, "denominators"),
      values: valueColumn(view, "values"),
      ll99: valueColumn(view, "ll99"),
      targets: valueColumn(view, "targets"),
      ul99: valueColumn(view, "ul99"),
      suffixes: valueColumn(view, "suffixes"),
      sigFigs: valueColumn(view, "sig_figs")
    };
    if (!columns.scores) {
      return { status: false, error: "MISC scores are required." };
    }

    const extras = tooltipColumns(view);
    const categoryValues = columnValues(category);
    const values = Object.fromEntries(
      Object.entries(columns).map(([name, column]) => [name, columnValues(column)])
    );
    const extraValues = extras.map(columnValues);
    for (let i = 0; i < categoryValues.length; i++) {
      const settings = mergeSettings(category.objects?.[i]);
      const extraItems = extras.map((column, j) => ({
        displayName: column.source.displayName,
        value: extraValues[j][i]
      }));
      const point = {
        indicator: categoryValues[i],
        grouping: values.groupings[i] ?? "",
        group: values.groups[i] ?? "",
        score: Number(values.scores[i]),
        z: Number(values.zScores[i]),
        outlier: values.outliers[i] ?? "none",
        numerator: values.numerators[i],
        denominator: values.denominators[i],
        value: values.values[i],
        ll99: values.ll99[i],
        target: values.targets[i],
        ul99: values.ul99[i],
        suffix: values.suffixes[i] ?? "",
        sigFigs: Number(values.sigFigs[i] ?? 2),
        settings: settings,
        identity: host.createSelectionIdBuilder()
          .withCategory(category, i)
          .createSelectionId()
      };
      point.tooltip = makeTooltip(point, extraItems);
      this.plotPoints.push(point);
    }
    this.settings = this.plotPoints[0]?.settings ?? mergeSettings(null);
    return { status: true };
  }
}

class Visual {
  constructor(options) {
    this.host = options.host;
    this.selectionManager = options.host.createSelectionManager();
    this.svg = ccD3.select(options.element).append("svg");
    this.viewModel = new MiscViewModel();
  }

  update(options) {
    const status = this.viewModel.update(options, this.host);
    this.svg
      .attr("width", options.viewport.width)
      .attr("height", options.viewport.height)
      .style("background", this.viewModel.settings.canvas.background_colour);
    this.svg.selectAll(".misc-root, .errormessage").remove();
    if (!status.status) {
      this.svg.append("text")
        .classed("errormessage", true)
        .attr("x", 10)
        .attr("y", 20)
        .text(status.error);
      return status;
    }
    if (this.viewModel.plotPoints.length === 0) return status;
    this.draw();
    return status;
  }

  draw() {
    const points = this.viewModel.plotPoints;
    const settings = this.viewModel.settings;
    const canvas = settings.canvas;
    const axis = settings.x_axis;
    const width = this.viewModel.svgWidth;
    const height = this.viewModel.svgHeight;
    const left = canvas.left_padding;
    const right = width - canvas.right_padding;
    const top = canvas.upper_padding;
    const bottom = height - canvas.lower_padding;
    const plotWidth = Math.max(1, right - left);
    const plotHeight = Math.max(1, bottom - top);
    // Each group heading occupies its own row above its indicators
    const rowIndex = new Array(points.length);
    let rows = 0;
    for (let i = 0; i < points.length; i++) {
      if (points[i].grouping && points[i].grouping !== points[i - 1]?.grouping) rows++;
      rowIndex[i] = rows++;
    }
    const rowHeight = plotHeight / rows;
    const lower = axis.xlimit_l;
    const upper = axis.xlimit_u;
    const scale = value => left + ((value - lower) / (upper - lower)) * plotWidth;
    const root = this.svg.append("g").classed("misc-root", true);

    if (axis.xlimit_grid_show) {
      for (let tick = lower; tick <= upper; tick += axis.xlimit_tick_interval) {
        root.append("line")
          .classed("misc-grid-line", true)
          .attr("x1", scale(tick)).attr("x2", scale(tick))
          .attr("y1", top).attr("y2", bottom)
          .attr("stroke", axis.xlimit_grid_colour);
      }
    }

    this.drawControlLines(root, scale, top, bottom, settings.lines);
    root.append("line")
      .classed("misc-axis", true)
      .attr("x1", left).attr("x2", right)
      .attr("y1", bottom).attr("y2", bottom)
      .attr("stroke", axis.xlimit_colour);

    for (let tick = lower; tick <= upper; tick += axis.xlimit_tick_interval) {
      root.append("text")
        .classed("misc-x-tick", true)
        .attr("x", scale(tick)).attr("y", bottom + axis.xlimit_tick_size + 5)
        .attr("text-anchor", "middle")
        .style("font-family", axis.xlimit_tick_font)
        .style("font-size", `${axis.xlimit_tick_size}px`)
        .style("fill", axis.xlimit_colour)
        .text(tick);
    }

    const zero = scale(0);
    const bars = root.selectAll(".misc-bar")
      .data(points)
      .join("rect")
      .classed("misc-bar", true)
      .attr("x", point => scale(Math.min(0, Math.max(lower, Math.min(upper, point.score)))))
      .attr("y", (_, i) => top + rowIndex[i] * rowHeight + rowHeight * (1 - settings.bars.height_ratio) / 2)
      .attr("width", point => Math.abs(scale(Math.max(lower, Math.min(upper, point.score))) - zero))
      .attr("height", rowHeight * settings.bars.height_ratio)
      .attr("fill", pointColour)
      .attr("opacity", point => point.settings.bars.opacity);

    bars.on("mouseover", (event, point) => {
      this.host.tooltipService.show({
        coordinates: [event.offsetX ?? 0, event.offsetY ?? 0],
        dataItems: point.tooltip,
        identities: [point.identity]
      });
    }).on("mouseout", () => this.host.tooltipService.hide());

    points.forEach((point, i) => {
      const y = top + (rowIndex[i] + 0.5) * rowHeight;
      root.append("text")
        .classed("misc-y-tick", true)
        .attr("x", left - 8).attr("y", y)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .style("font-family", settings.y_axis.ylimit_tick_font)
        .style("font-size", `${settings.y_axis.ylimit_tick_size}px`)
        .style("fill", settings.y_axis.ylimit_colour)
        .text(point.indicator);
      if (point.grouping && point.grouping !== points[i - 1]?.grouping) {
        root.append("text")
          .classed("misc-group-label", true)
          .attr("x", 5).attr("y", y - rowHeight)
          .attr("dominant-baseline", "middle")
          .style("font-family", settings.y_axis.ylimit_tick_font)
          .style("font-size", `${settings.y_axis.group_tick_size}px`)
          .style("font-weight", settings.y_axis.group_font_weight)
          .style("fill", settings.y_axis.ylimit_colour)
          .text(point.grouping);
      }
    });

    this.drawHeader(root, scale, top, settings);
    if (axis.xlimit_label) {
      root.append("text")
        .classed("misc-x-label", true)
        .attr("x", left).attr("y", height - 5)
        .style("font-family", canvas.font_family)
        .style("font-size", "10px")
        .text(axis.xlimit_label);
    }
    if (settings.misc.source) {
      root.append("text")
        .classed("misc-source", true)
        .attr("x", right).attr("y", height - 5)
        .attr("text-anchor", "end")
        .style("font-family", canvas.font_family)
        .style("font-size", "10px")
        .style("font-style", "italic")
        .text(settings.misc.source);
    }
  }

  drawControlLines(root, scale, top, bottom, lines) {
    const draw = (value, cssClass, dash) => root.append("line")
      .classed(cssClass, true)
      .attr("x1", scale(value)).attr("x2", scale(value))
      .attr("y1", top).attr("y2", bottom)
      .attr("stroke", lines.colour)
      .attr("stroke-width", lines.width)
      .attr("stroke-dasharray", dash);
    if (lines.show_99) {
      draw(lines.lower_99, "misc-limit-99", lines.type_99);
      draw(lines.upper_99, "misc-limit-99", lines.type_99);
    }
    if (lines.show_95) {
      draw(lines.lower_95, "misc-limit-95", lines.type_95);
      draw(lines.upper_95, "misc-limit-95", lines.type_95);
    }
    if (lines.show_zero) draw(0, "misc-zero-line", null);
  }

  drawHeader(root, scale, top, settings) {
    const miscSettings = settings.misc;
    const lines = settings.lines;
    root.append("text")
      .classed("misc-direction-unfavourable", true)
      .attr("x", scale(-4)).attr("y", top - 10)
      .attr("text-anchor", "middle")
      .style("font-family", settings.canvas.font_family)
      .style("font-size", `${miscSettings.direction_font_size}px`)
      .style("font-weight", "bold")
      .style("font-style", "italic")
      .style("fill", miscSettings.unfavourable_colour)
      .text(miscSettings.unfavourable_label);
    root.append("text")
      .classed("misc-direction-favourable", true)
      .attr("x", scale(4)).attr("y", top - 10)
      .attr("text-anchor", "middle")
      .style("font-family", settings.canvas.font_family)
      .style("font-size", `${miscSettings.direction_font_size}px`)
      .style("font-weight", "bold")
      .style("font-style", "italic")
      .style("fill", miscSettings.favourable_colour)
      .text(miscSettings.favourable_label);

    const legendY = top - 35;
    const entries = [
      { show: lines.show_95, label: "95% Control Limits", dash: lines.type_95 },
      { show: lines.show_99, label: "99.8% Control Limits", dash: lines.type_99 }
    ].filter(entry => entry.show);
    entries.forEach((entry, i) => {
      const x = scale(-1.2 + i * 2.2);
      root.append("line")
        .attr("x1", x).attr("x2", x + 20)
        .attr("y1", legendY).attr("y2", legendY)
        .attr("stroke", lines.colour)
        .attr("stroke-width", lines.width)
        .attr("stroke-dasharray", entry.dash);
      root.append("text")
        .attr("x", x + 24).attr("y", legendY)
        .attr("dominant-baseline", "middle")
        .style("font-family", settings.canvas.font_family)
        .style("font-size", "10px")
        .text(entry.label);
    });
  }

  updateHighlighting() {}
}

return {
  Visual: Visual,
  defaultSettings: defaultSettings
};
})();
