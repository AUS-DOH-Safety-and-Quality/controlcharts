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

function updateHeadlessVisual(chartType, dataViews, title_settings, width, height) {
  var updateArgs = {
    dataViews: dataViews,
    viewport: { width: width, height: height },
    type: 2,
    headless: true,
    frontend: true
  };

  var visual = globalThis[chartType + "Visual"];
  visual.update(updateArgs);

  // Remove any existing titles
  visual.svg.selectAll(".chart-title").remove();
  // Add chart title if provided
  if (title_settings.text !== null) {
    // Append the title to the SVG
    visual.svg.append("text")
              .classed("chart-title", true)
              .attr("x", "50%")
              .attr("y", 5)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "hanging")
              .attr("font-size", title_settings.font_size)
              .attr("font-weight", title_settings.font_weight)
              .attr("font-family", title_settings.font_family)
              .text(title_settings.text);
  };

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
