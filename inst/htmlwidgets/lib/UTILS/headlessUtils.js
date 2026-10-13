function initialiseHeadless() {
  // Create a dummy DOM to build the SVGs in
  const {document, window} = minidom.dummyDOM();
  globalThis.document = document;
  globalThis.window = window;

  var spcDiv = ccCore.select(document.body).append('div').classed('spc-container', true).node();
  globalThis.spcVisual = new spc.Visual(makeConstructorArgs(spcDiv));

  var funnelDiv = ccCore.select(document.body).append('div').classed('funnel-container', true).node();
  globalThis.funnelVisual = new funnel.Visual(makeConstructorArgs(funnelDiv));
}

function updateHeadlessVisual(chartType, dataViews, titleSettings, width, height,
                              rtn_static, rtn_limits) {
  // Clear visual state
  var visual = globalThis[chartType + "Visual"];
  visual.update({
    dataViews: [],
    viewport: { width: width, height: height },
    type: 2,
    headless: true,
    frontend: true
  });

  var updateArgs = {
    dataViews: dataViews,
    viewport: { width: width, height: height },
    type: 2,
    headless: true,
    frontend: true
  };

  var rtn = {};
  if (rtn_static === true) {
    updateArgs.dataViews = paddedDataViews(chartType, dataViews, titleSettings, true);
    visual.update(updateArgs);
    updateChartTitle(visual.svg, titleSettings);

    // Check for presence of 'errormessage' class and return error text if it exists
    if (visual.svg.select('.errormessage').size() > 0) {
      return { error: visual.svg.select('.errormessage').text() };
    }
    // Grouped SPC charts draw an HTML summary table, which is not part of the SVG
    if (chartType === "spc" && visual.viewModel.showGrouped) {
      return { error: "Static plots are not available for SPC charts with multiple indicator groups." };
    }
    rtn.svg = svgDocument(visual.svg.node().innerHTML, width, height);
  } else {
    const updateStatus = visual.viewModel.update(updateArgs, visual.host);
    if (!updateStatus.status) {
      return { error: updateStatus.error };
    }
  }

  if (rtn_limits === true) {
    const viewModel = visual.viewModel;
    if (chartType === "spc") {
      rtn.limits = spcLimits(viewModel);
      rtn.indicatorNames = viewModel.indicatorVarNames;
    } else if (viewModel.inputSettings.showMisc) {
      rtn.limits = miscLimits(viewModel.miscPoints);
    } else {
      const settings = viewModel.inputSettings.settings;
      const showAltTarget = settings.lines.alt_target != null;
      rtn.limits = funnelLimits(viewModel.plotPoints, settings.outliers, showAltTarget);
      rtn.limitLines = new Array(viewModel.calculatedLimits.length);
      for (let i = 0; i < rtn.limitLines.length; i++) {
        const limits = viewModel.calculatedLimits[i];
        rtn.limitLines[i] = limitRow({ denominator: limits.denominators }, limits, showAltTarget);
      }
    }
  }

  return rtn;
}

// Word's SVG renderer ignores dominant-baseline, so position text with dy instead
function svgDocument(content, width, height) {
  const body = content
    .replaceAll('dominant-baseline="hanging"', 'dy="0.8em"')
    .replaceAll('dominant-baseline="middle"', 'dy="0.35em"');
  return `<svg viewBox="0 0 ${width} ${height}" width="${width}px" height="${height}px" xmlns="http://www.w3.org/2000/svg">`
    + '<rect x="0" y="0" width="100%" height="100%" fill="white"/>'
    + body
    + "</svg>";
}

// Outlier setting that enables each SPC flag column
const spcFlagSettings = {
  astpoint: "astronomical",
  trend: "trend",
  shift: "shift",
  two_in_three: "two_in_three"
};

function limitValue(value) {
  return value === undefined || Number.isNaN(value) ? null : value;
}

// Copies fields, then the limits other than the denominators they were calculated for
function limitRow(fields, limits, includeAltTarget) {
  const row = {};
  for (const name in fields) {
    row[name] = limitValue(fields[name]);
  }
  for (const name in limits) {
    if (name !== "denominators" && (includeAltTarget || name !== "alt_target")) {
      row[name] = limitValue(limits[name]);
    }
  }
  return row;
}

function hasValues(column) {
  if (column === undefined) {
    return false;
  }
  for (let i = 0; i < column.length; i++) {
    if (limitValue(column[i]) !== null) {
      return true;
    }
  }
  return false;
}

function spcLimitRows(limits, outliers, outlierSettings) {
  const dates = new Array(limits.keys.length);
  for (let i = 0; i < dates.length; i++) {
    dates[i] = limits.keys[i].label.trim();
  }
  const columns = {
    date: dates,
    numerator: limits.numerators,
    denominator: limits.denominators,
    value: limits.values,
    target: limits.target,
    alt_target: limits.alt_target,
    ll99: limits.ll99,
    ll95: limits.ll95,
    ll68: limits.ll68,
    ul68: limits.ul68,
    ul95: limits.ul95,
    ul99: limits.ul99,
    speclimits_lower: limits.speclimits_lower,
    speclimits_upper: limits.speclimits_upper,
    trend_line: limits.trend_line,
    astpoint: outliers.astpoint,
    trend: outliers.trend,
    shift: outliers.shift,
    two_in_three: outliers.two_in_three
  };
  const names = [];
  for (const name in columns) {
    const flagSetting = spcFlagSettings[name];
    if ((flagSetting === undefined || outlierSettings[flagSetting]) && hasValues(columns[name])) {
      names.push(name);
    }
  }
  const rows = new Array(dates.length);
  for (let i = 0; i < rows.length; i++) {
    const row = {};
    for (let j = 0; j < names.length; j++) {
      row[names[j]] = limitValue(columns[names[j]][i]);
    }
    rows[i] = row;
  }
  return rows;
}

// Ungrouped charts return rows; grouped charts nest rows by each indicator's group name
function spcLimits(viewModel) {
  if (viewModel.indicatorVarNames.length === 0) {
    return spcLimitRows(viewModel.controlLimits[0], viewModel.outliers[0],
                        viewModel.inputSettings.settings[0].outliers);
  }
  const result = {};
  for (let i = 0; i < viewModel.controlLimits.length; i++) {
    const groups = viewModel.groupNames[i];
    let branch = result;
    for (let j = 0; j < groups.length; j++) {
      const name = groups[j] == null || groups[j] === "" ? "<blank>" : String(groups[j]);
      if (j === groups.length - 1) {
        branch[name] = spcLimitRows(viewModel.controlLimits[i], viewModel.outliers[i],
                                    viewModel.inputSettings.settings[i].outliers);
      } else {
        branch[name] ??= {};
        branch = branch[name];
      }
    }
  }
  return result;
}

function funnelLimits(plotPoints, outlierSettings, showAltTarget) {
  const points = plotPoints.slice().sort((a, b) => a.x - b.x);
  const rows = new Array(points.length);
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const fields = {
      denominator: point.x,
      group: point.group_text,
      numerator: point.numerator,
      value: point.value,
      z: point.z
    };
    if (outlierSettings.two_sigma) {
      fields.two_sigma = point.two_sigma;
    }
    if (outlierSettings.three_sigma) {
      fields.three_sigma = point.three_sigma;
    }
    rows[i] = limitRow(fields, point.limits, showAltTarget);
  }
  return rows;
}

function miscLimits(miscPoints) {
  const rows = new Array(miscPoints.length);
  for (let i = 0; i < miscPoints.length; i++) {
    const point = miscPoints[i];
    rows[i] = limitRow({
      indicator: point.indicator,
      group: point.group_text,
      z: point.z,
      score: point.score,
      three_sigma: point.three_sigma,
      numerator: point.numerator,
      denominator: point.x,
      value: point.value
    }, point.limits, false);
  }
  return rows;
}
