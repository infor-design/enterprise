module.exports = {

  copy: {
    main: {
      files: [
        { expand: true, flatten: true, src: ['src/components/angular/sohoxi-angular.js'], dest: 'dist/js/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['lib/sohoxi-migrate-4.4.0.js'], dest: 'dist/js/', filter: 'isFile' },
        {
          expand: true,
          flatten: true,
          src: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/jquery/dist/jquery.min.map'
          ],
          dest: 'dist/js/',
          filter: 'isFile',
          rename(dest, src) {
            return dest + src.replace('jquery.', 'jquery-3.3.1.');
          }
        },
        {
          expand: true,
          flatten: true,
          src: [
            'node_modules/d3/build/d3.js',
            'node_modules/d3/build/d3.min.js'
          ],
          dest: 'dist/js/',
          filter: 'isFile',
          rename(dest, src) {
            return dest + src.replace('d3.', 'd3.v4.');
          }
        },
        { expand: true, flatten: true, src: ['src/components/locale/cultures/*.*'], dest: 'dist/js/cultures/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['src/components/emptymessage/svg-empty.html'], dest: 'dist/svg/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['src/components/charts/svg-patterns.html'], dest: 'dist/svg/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['src/components/icons/svg*.html'], dest: 'dist/svg/', filter: 'isFile' },
      ]
    },

    amd: {
      files: [
        { expand: true, flatten: true, src: ['js/*.*'], dest: 'temp/amd/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['src/components/**/*.js'], dest: 'temp/amd/', filter: 'isFile' }
      ]
    },

    publish: {
      files: [
        { expand: true, flatten: true, src: ['dist/js/sohoxi*.*'], dest: 'ids-enterprise/dist/js/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['lib/sohoxi-migrate-4.4.0.js'], dest: 'ids-enterprise/dist/js/', filter: 'isFile' },
        {
          expand: true,
          flatten: true,
          src: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/jquery/dist/jquery.min.map'
          ],
          dest: 'ids-enterprise/dist/js/',
          filter: 'isFile',
          rename(dest, src) {
            return dest + src.replace('jquery.', 'jquery-3.3.1.');
          }
        },
        {
          expand: true,
          flatten: true,
          src: [
            'node_modules/d3/build/d3.js',
            'node_modules/d3/build/d3.min.js'
          ],
          dest: 'ids-enterprise/dist/js/',
          filter: 'isFile',
          rename(dest, src) {
            return dest + src.replace('d3.', 'd3.v4.');
          }
        },
        { expand: true, flatten: true, src: ['src/components/locale/cultures/*.*'], dest: 'ids-enterprise/dist/js/cultures/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['dist/svg/*.*'], dest: 'ids-enterprise/dist/svg/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['dist/css/*theme*.*'], dest: 'ids-enterprise/dist/css/', filter: 'isFile' },
        { expand: true, flatten: false, src: ['src/**/*.scss'], dest: 'ids-enterprise/sass/', filter: 'isFile' }
      ]
    }
  }

};
