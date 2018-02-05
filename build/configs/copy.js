module.exports = {

  copy: {
    main: {
      files: [
        { expand: true, flatten: true, src: ['components/angular/sohoxi-angular.js'], dest: 'dist/js/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['components/sohoxi-migrate-4.4.0.js'], dest: 'dist/js/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['js/*.js'], dest: 'dist/js/all/', filter: 'isFile' },
        {
          expand: true,
          flatten: true,
          src: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/jquery/dist/jquery.min.map'
          ],
          dest: 'dist/js/',
          filter: 'isFile'
        },
        {
          expand: true,
          flatten: true,
          src: [
            'node_modules/d3/build/d3.js',
            'node_modules/d3/build/d3.min.js'
          ],
          dest: 'dist/js/',
          filter: 'isFile'
        },
        { expand: true, flatten: true, src: ['components/locale/cultures/*.*'], dest: 'dist/js/cultures/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['components/empty-widgets/svg-empty.html'], dest: 'dist/svg/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['components/charts/svg-patterns.html'], dest: 'dist/svg/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['components/icons/svg*.html'], dest: 'dist/svg/', filter: 'isFile' },
      ]
    },

    amd: {
      files: [
        { expand: true, flatten: true, src: ['js/*.*'], dest: 'temp/amd/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['components/**/*.js'], dest: 'temp/amd/', filter: 'isFile' }
      ]
    },

    publish: {
      files: [
        { expand: true, flatten: true, src: ['dist/svg/*.*'], dest: 'publish/dist/svg/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['dist/css/*theme*.*'], dest: 'publish/dist/css/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['sass/**/*.scss', 'components/**/*.scss'], dest: 'publish/sass/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['LICENSE.MD'], dest: 'publish', filter: 'isFile' }
      ]
    }
  }

};
