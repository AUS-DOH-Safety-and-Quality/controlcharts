HTMLWidgets.widget({

  name: 'spc',

  type: 'output',

  factory: function(el, width, height) {

    var options_constructor = {
      element: el,
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
  };

  var options_update = {
    dataViews: [
        {
            categorical: {
                categories: [{
                    source: { roles: {"key": true}},
                    values: ["A", "B", "C"]
                }],
                values: [
                    {
                        source: { roles: {"numerators": true}},
                        values: [1, 2, 3]
                    }
                ]
            }
        }
    ] ,
    viewport: {
        "width":width,
        "height":height
    },
    type: 2
};

var visual = new spc.Visual(options_constructor);
    return {

      renderValue: function(x) {
        var keys = x.keys;
        var numerators = x.numerators;
        options_update.dataViews[0].categorical.categories[0].values = keys;
        options_update.dataViews[0].categorical.values[0].values = numerators;

        visual.update(options_update);

      },

      resize: function(width, height) {

        options_update.viewport.width = width;
        options_update.viewport.height = height;
        visual.update(options_update);
      },

      visual: visual
    };
  }
});
