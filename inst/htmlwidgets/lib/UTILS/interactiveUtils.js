/*
  Assumes that the following files have already been loaded by the `htmlwidgets` package:
    - ./commonUtils.js
    - ../PBISPC/PBISPC.js
    - ../PBIFUN/PBIFUN.js
*/

function makeFactory(chartType) {
  return function(el, width, height) {
    // Initialise crosstalk objects for interactivity (highlighting and filtering)
    var crosstalkFilterHandle = new crosstalk.FilterHandle();
    var crosstalkSelectionHandle = new crosstalk.SelectionHandle();

    // Initialise the chart object for calculating limits and rendering
    var visual = new window[chartType].Visual(makeConstructorArgs(el));

    // Initialise the arguments for the visual update function
    // so that they can be reused across rendering, resizing, and filtering
    var visualUpdateArgs = {
      dataViews: [],
      viewport: { width: width, height: height },
      // Change in data, so recalculate limits
      type: 2
    };

    // Replace PowerBI selection manager (interactivity) functions with crosstalk equivalents
    visual.selectionManager.getSelectionIds = () => crosstalkSelectionHandle.value ?? []
    visual.selectionManager.clear = () => crosstalkSelectionHandle.clear()
    visual.selectionManager.select = (currentIdentity, multiSelect) => {
      var newIdentities = currentIdentity;
      if (multiSelect && crosstalkSelectionHandle.value) {
        newIdentities = newIdentities.concat(crosstalkSelectionHandle.value)
      }
      crosstalkSelectionHandle.set(newIdentities)
      return { then: (f) => f() }
    }

    // Add a group for rendering tooltips in place of PowerBI tooltips
    visual.svg.append("g")
              .classed("chart-tooltip-group", true)
              .append("rect");

    return {
      renderValue: function(x) {
        // Aggregate the raw data into the format expected by the visual
        var updateValues = makeUpdateValues(x.data_raw, x.input_settings, x.aggregations);
        visualUpdateArgs.dataViews = updateValues.dataViews;

        // Initialise the dataset linkage for crosstalk highlighting and filtering
        crosstalkSelectionHandle.setGroup(x.crosstalkGroup);
        crosstalkFilterHandle.setGroup(x.crosstalkGroup);

        // Crosstalk highlighting callback - when a crosstalk highlighting event occurs,
        // use existing visual functions for handling selection and highlighting as the
        // selectionManager functions for mapping identities to selected points have
        // already been replaced with crosstalk equivalents
        crosstalkSelectionHandle.on("change", function(e) { visual.updateHighlighting() });

        // Crosstalk filtering callback - When a crosstalk filtering event occurs,
        // filter the original dataset before re-aggregating and re-rendering the visual
        // (see the `makeUpdateValues` function)
        crosstalkFilterHandle.on("change", function(e) {
          var filteredUpdateValues = makeUpdateValues(x.data_raw, x.input_settings, x.aggregations, e.value);
          visualUpdateArgs.dataViews = filteredUpdateValues.dataViews;
          visualUpdateArgs.type = 2; // Change in data, so recalculate limits

          visual.update(visualUpdateArgs);
        })

        // Replace PowerBI function for assigning selection identities to points,
        // so that the visual will automatically assign the correct crosstalk identities
        visual.host.createSelectionIdBuilder = () => ({
          withCategory: (allCategories, categoryIndex) => ({
            createSelectionId: () => updateValues.crosstalkIdentities[allCategories.values[categoryIndex]]
          })
        })

        // Trigger the calculation of limits and the rendering of the visual
        visual.update(visualUpdateArgs);
      },

      resize: function(width, height) {
        visualUpdateArgs.viewport.width = width;
        visualUpdateArgs.viewport.height = height;
        // Specify that the event is only a resize, so do not recalculate limits
        visualUpdateArgs.type = 4;
        visual.update(visualUpdateArgs);
      }
    };
  }
}
