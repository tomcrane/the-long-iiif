module.exports.register = function (Handlebars, opts, params)  { 
  Handlebars.registerHelper('json', function(obj) {
    return JSON.stringify(obj);
  });

  Handlebars.registerHelper('retinaImage', function(src) {
    var re = /([a-zA-Z0-9\/\-_~:#]*)\.([a-zA-Z0-9]*)/; 
    var m = re.exec(src);
    return m.length > 1 ? m[1] + '@2x' + '.' + m[2] : null;
  });
};
