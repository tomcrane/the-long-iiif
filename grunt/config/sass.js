// grunt/config/sass.js

module.exports = {
  
  dev: {
    options: {
      outputStyle: 'expanded',
      sourceMap: false,
      require: 'susy'
    },
    files: {
      'assets/build/css/styles.css': 'src/scss/styles.scss'
    }
  },


};
