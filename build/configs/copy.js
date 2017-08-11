module.exports = {

  copy: {
    main: {
      files: [
        {expand: true, flatten: true, src: ['dist/js/sohoxi.js'], dest: 'public/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['dist/js/sohoxi.min.js'], dest: 'public/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/angular/sohoxi-angular.js'], dest: 'public/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/angular/sohoxi-angular.js'], dest: 'dist/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['js/*.js'], dest: 'dist/js/all/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['dist/css/*'], dest: 'public/stylesheets/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/vendor/jquery-3*.js'], dest: 'public/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/vendor/jquery-3*.min.js'], dest: 'public/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/vendor/jquery-3*.map'], dest: 'public/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/vendor/jquery-3*.js'], dest: 'dist/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/vendor/jquery-3*.min.js'], dest: 'dist/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/vendor/jquery-3*.map'], dest: 'dist/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/vendor/d3.*'], dest: 'public/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/vendor/d3.*'], dest: 'dist/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/locale/cultures/*.*'], dest: 'public/js/cultures/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/locale/cultures/*.*'], dest: 'dist/js/cultures/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['views/controls/svg*.html'], dest: 'dist/svg/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['views/controls/svg*.html'], dest: 'public/svg/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/icons/svg*.html'], dest: 'dist/svg/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/icons/svg*.html'], dest: 'public/svg/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['demoapp/js/*site.js'], dest: 'public/js/', filter: 'isFile'}
      ]
    },

    amd: {
      files: [
        {expand: true, flatten: true, src: ['js/*.*'], dest: 'temp/amd/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['components/**/*.js'], dest: 'temp/amd/', filter: 'isFile'}
      ]
    },

    publish: {
      files: [
        {expand: true, flatten: true, src: ['dist/svg/*.*'], dest: 'publish/dist/svg/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['dist/css/*theme*.*'], dest: 'publish/dist/css/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['dist/js/*.*'], dest: 'publish/dist/js/', filter: 'isFile'},
        {expand: true, flatten: true, src: ['dist/js/all/*.*'], dest: 'publish/dist/js/all', filter: 'isFile'},
        {expand: true, flatten: true, src: ['dist/js/cultures/*.*'], dest: 'publish/dist/js/cultures', filter: 'isFile'},
        {expand: true, flatten: true, src: ['sass/**/*.scss', 'components/**/*.scss'], dest: 'publish/sass/', filter: 'isFile'}
      ]
    }
  }

};
