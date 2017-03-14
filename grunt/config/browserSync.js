// grunt/config/browsersync.js

module.exports = {
  dev: {
    bsFiles: {
      src : ['assets/build/css/*.css', 'assets/build/js/*.js', 'assets/build/*.html']
    },
    options: {
      directory: true,
      watchTask: true,
      server: './'
    }
  }
}
