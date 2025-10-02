/*
  Assumes that the following files have already been loaded:
    - ./commonUtils.js
    - ../PBISPC/PBISPC.js
    - ../PBIFUN/PBIFUN.js
*/

function initialiseHeadless() {
  // Create a dummy DOM to build the SVGs in
  const {document, window} = spc.parseHTML('<html><head></head><body></body></html>');
  globalThis.document = document;
  globalThis.window = window;

  var spcDiv = spc.d3.select(document.body).append('div').classed('spc-container', true).node();
  globalThis.spcVisual = new spc.Visual(makeConstructorArgs(spcDiv));

  var funnelDiv = spc.d3.select(document.body).append('div').classed('funnel-container', true).node();
  globalThis.funnelVisual = new funnel.Visual(makeConstructorArgs(funnelDiv));
}

function updateHeadlessVisual(chartType, dataViews, width, height) {
  var updateArgs = {
    dataViews: dataViews,
    viewport: { width: width, height: height },
    type: 2,
    headless: true,
    frontend: true
  };

  var visual = globalThis[chartType + "Visual"];
  visual.update(updateArgs);
  // Check for presence of 'errormessage' class and return error text if it exists
  if (visual.svg.select('.errormessage').size() > 0) {
    return { error: visual.svg.select('.errormessage').text() };
  }
  return {
    plotPoints: visual.viewModel.plotPoints,
    svg: visual.svg.node().innerHTML,
    calculatedLimits: chartType === "funnel" ? visual.viewModel.calculatedLimits : undefined
  }
}
