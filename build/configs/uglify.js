module.exports = {

  uglify: {
    dist: {
      options: {
        banner: '<%= banner %>',
        sourceMap: true,
        sourceMapName: 'dist/js/sohoxi.map',
        separator: ';'
      },
      files: {
        'dist/js/sohoxi.min.js': ['dist/js/sohoxi.js']
      }
    }
  }

};
