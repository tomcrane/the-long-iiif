// grunt/config/browserify.js

module.exports = {
  dev: {
    options: {
       browserifyOptions: {
        debug: true
       },
       transform: [
         ['babelify', {
           presets: ['es2015', 'react'],
           plugins: ['transform-object-assign']
         }]
       ]
    },
    src: ['src/js/script.js'],
    dest: 'assets/build/js/script.js'
  }
}
