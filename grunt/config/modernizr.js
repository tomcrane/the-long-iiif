module.exports = {
  dev: {
    'crawl': false,
    'customTests': [],
    'dest': 'assets/build/js/vendor/modernizr-output.js',
    'enableJSClass': true,
    'tests': ['flexbox', 'js', 'cssfilters', 'inlinesvg', 'svgfilters', 'cssanimations'],
    'options': [
      'setClasses'
    ],
    'uglify': true
  }
}
