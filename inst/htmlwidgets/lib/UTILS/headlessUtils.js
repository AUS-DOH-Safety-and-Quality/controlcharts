/*
  Assumes that the following files have already been loaded:
    - ./ccDeps.js
    - ./ccD3.js
    - ./commonUtils.js
    - ../PBISPC/PBISPC.js
    - ../PBIFUN/PBIFUN.js
*/

function initialiseHeadless() {
  // Create a dummy DOM to build the SVGs in
  const {document, window} = minidom.dummyDOM();
  globalThis.document = document;
  globalThis.window = window;

  var spcDiv = ccD3.select(document.body).append('div').classed('spc-container', true).node();
  globalThis.spcVisual = new spc.Visual(makeConstructorArgs(spcDiv));

  var funnelDiv = ccD3.select(document.body).append('div').classed('funnel-container', true).node();
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
    visual.update(updateArgs);
    updateChartTitle(visual.svg, titleSettings);

    // Check for presence of 'errormessage' class and return error text if it exists
    if (visual.svg.select('.errormessage').size() > 0) {
      return { error: visual.svg.select('.errormessage').text() };
    }
    rtn.svg = visual.svg.node().innerHTML;
  } else {
    const updateStatus = visual.viewModel.update(updateArgs, visual.host);
    if (!updateStatus) {
      return { error: updateStatus.error };
    }
  }

  if (rtn_limits === true) {
    if (chartType === "funnel") {
      rtn.plotPoints = visual.viewModel.plotPoints;
      rtn.calculatedLimits = visual.viewModel.calculatedLimits;
    } else {
      rtn.plotPoints = visual.viewModel.plotPoints[0];
      rtn.spcLimitRows = visual.viewModel.controlLimits.map((limits, index) => {
        var outliers = visual.viewModel.outliers[index];
        return limits.keys.map((key, rowIndex) => ({
          date: key.label,
          numerator: limits.numerators?.[rowIndex],
          denominator: limits.denominators?.[rowIndex],
          value: limits.values[rowIndex],
          target: limits.targets[rowIndex],
          alt_target: limits.alt_targets?.[rowIndex],
          ll99: limits.ll99?.[rowIndex],
          ll95: limits.ll95?.[rowIndex],
          ll68: limits.ll68?.[rowIndex],
          ul68: limits.ul68?.[rowIndex],
          ul95: limits.ul95?.[rowIndex],
          ul99: limits.ul99?.[rowIndex],
          speclimits_lower: limits.speclimits_lower?.[rowIndex],
          speclimits_upper: limits.speclimits_upper?.[rowIndex],
          trend_line: limits.trend_line?.[rowIndex],
          astpoint: outliers.astpoint[rowIndex],
          trend: outliers.trend[rowIndex],
          shift: outliers.shift[rowIndex],
          two_in_three: outliers.two_in_three[rowIndex]
        }));
      });
      rtn.groupNames = visual.viewModel.groupNames;
      rtn.indicatorVarNames = visual.viewModel.indicatorVarNames;
    }
  }

  return rtn;
}
