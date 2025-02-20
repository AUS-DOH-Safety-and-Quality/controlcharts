const {document, window} = spc.parseHTML('<html><head></head><body></body></html>');
var options_constructor = make_constructor(document.body);
var visual = new spc.Visual(options_constructor);
