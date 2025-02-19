const {document, window} = spc.parseHTML('<html><head></head><body></body></html>');

var options_constructor = {
    element: spc.d3.select('body').node(),
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

var visual = new spc.Visual(options_constructor);
