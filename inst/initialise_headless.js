const {document, window} = spc.parseHTML('<html><head></head><body></body></html>');
var visual_spc = new spc.Visual(make_constructor_spc(document.body));
var visual_funnel = new funnel.Visual(make_constructor_funnel(document.body));
