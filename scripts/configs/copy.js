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
            'node_modules/jquery/dist/jquery.min.map',
            'node_modules/promise-polyfill/dist/polyfill.js',
            'node_modules/promise-polyfill/dist/polyfill.min.js'
          ],
          dest: 'dist/js/',
          filter: 'isFile',
          rename(dest, src) {
            return dest + src.replace('jquery.', 'jquery-3.5.1.')
              .replace('polyfill.', 'promise-polyfill.');
          }
        },
        {
          expand: true,
          flatten: true,
          src: [
            'node_modules/d3/dist/d3.js',
            'node_modules/d3/dist/d3.min.js'
          ],
          dest: 'dist/js/',
          filter: 'isFile',
          rename(dest, src) {
            return dest + src.replace('d3.', 'd3.v5.');
          }
        },
        { expand: true, flatten: true, src: ['src/components/locale/cultures/*.*'], dest: 'dist/js/cultures/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['src/components/emptymessage/*svg-empty.html'], dest: 'dist/svg/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['src/components/charts/svg-patterns.html'], dest: 'dist/svg/', filter: 'isFile' },
        { expand: true, flatten: true, src: ['src/components/icons/*svg.html'], dest: 'dist/svg/', filter: 'isFile' },
        { expand: true, flatten: false, src: ['src/**/*.scss'], dest: 'dist/sass/', filter: 'isFile' }
      ]
    },

    'custom-test': {
      files: [
        {
          expand: true,
          flatten: true,
          src: [
            'temp/components.txt',
            'temp/source.txt',
            'temp/tests-functional.txt',
            'temp/tests-e2e.txt'
          ],
          dest: 'dist/log/',
          filter: 'isFile'
        }
      ]
    }
  }

};
