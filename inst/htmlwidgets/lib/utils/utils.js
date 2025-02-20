const make_constructor = function(element) {
  return {
  element: element,
  host: {
    createSelectionManager: () => ({
      registerOnSelectCallback: () => {},
      getSelectionIds: () => []
    }),
    createSelectionIdBuilder: () => ({
      withCategory: () => ({ createSelectionId: () => {} })
    }),
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
    }
  }
  }
}

function update_visual(spc_categories, spc_values, width, height, is_headless) {
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
      "width": width,
      "height": height
    },
    type: 2,
    headless: is_headless
  };
  visual.update(options_update);
  return 1
}
