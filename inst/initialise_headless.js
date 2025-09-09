const {document, window} = spc.parseHTML('<html><head></head><body></body></html>');
var spcVisual = new spc.Visual(makeConstructorArgs("spc", document.body));
var funnelVisual = new funnel.Visual(makeConstructorArgs("funnel", document.body));
