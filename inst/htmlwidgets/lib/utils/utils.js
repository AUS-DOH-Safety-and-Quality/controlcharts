const make_constructor = function(element) {
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
        spc.d3.select(".tooltip")
              .selectAll(".tooltip-group-inner")
              .data([,])
              .join(
                (enter) => {
                  let grp =  enter.append("g")
                                  .classed("tooltip-group-inner", true);


                  grp.append("rect")
                      .attr("fill", "#ffffff")
                      .attr("width", 50)
                      .attr("height", 50);

                  grp.selectAll("text")
                      .data(x.dataItems)
                      .join("text")
                      .attr("fill", "black")
                      .style("text-anchor", "left")
                      .attr("x", 5)
                      .attr("y", (_, i) => 0 + 15*i)
                      .text(d => `${d.displayName}: ${d.value}`);


                  grp.attr("transform", `translate(${x.coordinates[0]}, ${x.coordinates[1]})`);
                  return grp;
                },
                (update) => {
                    update.selectAll("text")
                          .data(x.dataItems)
                          .join("text")
                          .attr("fill", "black")
                          .style("text-anchor", "left")
                          .attr("x", 5)
                          .attr("y", (_, i) => 0 + 15*i)
                          .text(d => `${d.displayName}: ${d.value}`);
                  update.attr("transform", `translate(${x.coordinates[0]}, ${x.coordinates[1]})`);
                  return update;
                }
              )

      },
      hide: () => {
        spc.d3.select(".tooltip").selectAll("rect").remove();
        spc.d3.select(".tooltip").selectAll("text").remove();
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

function update_visual(spc_categories, spc_values, is_headless) {
  var options_update = {
    dataViews: [
      {
        categorical: {
          categories: spc_categories,
          values: spc_values
        }
      }
    ],
    viewport: {
      "width": null,
      "height": null
    },
    type: 2,
    headless: is_headless
  };
  visual.update(options_update);
  return visual.viewModel.plotPoints.map(d => d.table_row)
}
