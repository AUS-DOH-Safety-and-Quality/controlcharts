HTMLWidgets.widget({
  name: 'spc',
  type: 'output',
  factory: function(el, width, height) {
    var ct_sel = new crosstalk.SelectionHandle();
    var options_constructor = make_constructor(el);
    var visual = new spc.Visual(options_constructor);

    visual.selectionManager.getSelectionIds = () => ct_sel.value ?? []
    visual.selectionManager.clear = () => ct_sel.clear()
    ct_sel.on("change", function(e) { visual.updateHighlighting() });

    visual.svg.append("g").classed("tooltip", true);

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
        console.log(x)
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
});
