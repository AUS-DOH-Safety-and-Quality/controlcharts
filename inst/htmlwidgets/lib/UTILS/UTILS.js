const make_constructor = function(type, element) {
  var d3 = type === "spc" ? spc.d3 : funnel.d3;
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
          var ttip_group = d3.select(element).select(".spc-ttip-group");
          ttip_group.selectAll("rect")
                    .data([0])
                    .join("rect")
                    .attr("fill", "#ffffff")
                    .attr("width", 50)
                    .attr("height", 50);
                  
          ttip_group.selectAll("text")
                      .data(x.dataItems)
                      .join("text")
                      .attr("fill", "black")
                      .style("text-anchor", "left")
                      .attr("x", 5)
                      .attr("y", (_, i) => 0 + 15*i)
                      .text(d => `${d.displayName}: ${d.value}`);
          ttip_group.attr("transform", `translate(${x.coordinates[0]}, ${x.coordinates[1]})`);
        },
        hide: () => {
          var ttip_group = d3.select(element).select(".spc-ttip-group");
          ttip_group.selectAll("rect").remove();
          ttip_group.selectAll("text").remove();
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

function update_visual(type, categories, values, width, height) {
  var options_update = {
    dataViews: [
      {
        categorical: {
          categories: categories,
          values: values
        }
      }
    ],
    viewport: {
      width: width,
      height: height
    },
    type: 2,
    headless: true
  };

  if (type === "spc") {
    visual_spc.update(options_update);
    return {
      plotPoints: visual_spc.viewModel.plotPoints,
      svg: visual_spc.svg.node().innerHTML
    };
  } else if (type === "funnel") {
    visual_funnel.update(options_update);
    return {
      plotPoints: visual_funnel.viewModel.plotPoints,
      calculatedLimits: visual_funnel.viewModel.calculatedLimits,
      svg: visual_funnel.svg.node().innerHTML
    };
  }
}

function make_factory(type) {
  return function(el, width, height) {
    var ct_sel = new crosstalk.SelectionHandle();
    var options_constructor = make_constructor(type, el);
    var visual = type === "spc" ? new spc.Visual(options_constructor) : new funnel.Visual(options_constructor);

    visual.selectionManager.getSelectionIds = () => ct_sel.value ?? []
    visual.selectionManager.clear = () => ct_sel.clear()
    ct_sel.on("change", function(e) { visual.updateHighlighting() });

    var ttip_group = visual.svg.append("g").classed("spc-ttip-group", true);
    ttip_group.append("rect");

    var options_update = {
      dataViews: [{
        categorical: {
          categories: [{
            source: { roles: {"key": true}},
            values: ["A", "B", "C"]
          }],
          values: [{
            source: { roles: {"numerators": true}},
            values: [1, 2, 3]
          }]
        }
      }],
      viewport: {
        width: width,
        height: height
      },
      type: 2
    };

    return {
      renderValue: function(x) {
        var crosstalk_keys = x.settings.crosstalk_keys ? Object.values(x.settings.crosstalk_keys) : null;
        ct_sel.setGroup(x.settings.crosstalk_group);
        visual.host.createSelectionIdBuilder = () => ({
          withCategory: (cat, idx) => ({
            createSelectionId: () => crosstalk_keys?.[cat.values[idx]] ?? [idx]
          })
        })
        visual.selectionManager.select = (identity, multi_select) => {
          var new_idents = identity;
          if (multi_select && ct_sel.value) {
            new_idents = new_idents.concat(ct_sel.value)
          }
          ct_sel.set(new_idents)
          return { then: (f) => f() }
        }

        options_update.dataViews = [{
          categorical: {
            categories: x.categories,
            values: x.values
          }
        }]

        visual.update(options_update);
      },

      resize: function(width, height) {
        options_update.viewport.width = width;
        options_update.viewport.height = height;
        visual.update(options_update);
      }
    };
  }
}