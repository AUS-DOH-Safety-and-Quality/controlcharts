/*
  Assumes that the following files have already been loaded:
    - ./commonUtils.js
    - ../PBISPC/PBISPC.js
    - ../PBIFUN/PBIFUN.js
*/

function initialiseHeadless() {
  // Create a dummy DOM to build the SVGs in
  const {document, window} = minidom.dummyDOM();
  globalThis.document = document;
  globalThis.window = window;

  var spcDiv = spc.d3.select(document.body).append('div').classed('spc-container', true).node();
  globalThis.spcVisual = new spc.Visual(makeConstructorArgs(spcDiv));

  var funnelDiv = spc.d3.select(document.body).append('div').classed('funnel-container', true).node();
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
    rtn.plotPoints = chartType === "funnel" ? visual.viewModel.plotPoints : visual.viewModel.plotPoints[0];
    rtn.calculatedLimits = chartType === "funnel" ? visual.viewModel.calculatedLimits : undefined;
  }

  return rtn;
}
