// grunt/config/copy.js

module.exports = {
  dev: {
    files: [
      {
        expand: true,
        cwd: 'src/asset-files',
        src: ['**'],
        dest: 'assets/build'
      },
      {
        expand: true,
        cwd: 'src/js/vendor',
        src: ['**'],
        dest: 'assets/build/js/vendor'
      }
    ]
  }
};
