// grunt/config/watch.js

module.exports = {
  assemble: {
    files: ['src/views/**/*.hbs','src/views/_helpers/*.js','src/views/_data/*.json'],
    tasks: ['assemble:dev']
  },

  assets: {
    files: ['src/asset-files/**/*.*'],
    tasks: ['copy:dev']
  },

  js: {
    files: ['src/js/**/*.js', '!src/js/vendor/**/*.js'],
    tasks: ['browserify:dev']
    // tasks: ['eslint', 'browserify:dev']
  },

  // scsslint: {
  //   files: ['src/scss/**/*.scss', '!src/scss/vendor/**/*.scss'],
  //   tasks: ['scsslint']
  // },

  scss: {
    files: ['src/scss/**/*.scss'],
    tasks: ['sass:dev', 'postcss:dev']
  },

}
