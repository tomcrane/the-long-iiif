// grunt/config/postcss.js

module.exports = {
  options: {
    processors: [
      require('pixrem')({atrules: true}), // add fallbacks for rem units
      require('autoprefixer')({browsers: ['last 2 versions', 'ie 9', 'ie 10', 'ie 11', 'iOS 7', 'iOS 8']}), // add vendor prefixes
      require('cssnano')() // minify the result
    ]
  },
  dev: {
    options: {
      map: true
    },
    src: 'assets/build/css/*.css'
  },
}
