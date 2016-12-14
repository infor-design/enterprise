module.exports = function(grunt) {
  grunt.file.defaultEncoding = 'utf-8';
  grunt.file.preserveBOM = true;
  let controls = grunt.option('controls'),
    excludeControls = grunt.option('excludeControls');

  const mapperPath = grunt.option('mapperPath'),
    configPath = grunt.option('configPath'),
    config = grunt.option('config'),

    checkGruntControlOptions = function(controls) {
      if (!Array.isArray(controls) && controls) {
        return controls.split();
      }
    },

    extractNameFromPath = function(path) {
      const matches = path.match(/.*(\/.*)(\.js)/),
        name = matches[1].replace('/', '');
      return name;
    },

    setUniqueDependencies = function(arr) {
      const set = new Set(arr),
        arrSet = [...set];
      return arrSet;
    },

    setHashMapUniqueDependencies = function(arr) {
      let uniqDependencies = [];
      if (Array.isArray(arr)) {
        for (let obj of arr) {
          uniqDependencies.push(extractNameFromPath(obj.fileFound));
        }
        return setUniqueDependencies(uniqDependencies);
      }
    },

    basePusher = function(arrHashMap, arrBases) {
      for (let i of arrHashMap) {
        if(!arrBases.includes(i)) {
          arrBases.push(i);
        }
      }
      return arrBases;
    },

    setTraverse = function(hashMap, collection) {
      for (let name of collection) {
        if (hashMap[name]) {
          let arrHashMap = setHashMapUniqueDependencies(hashMap[name]);
          collection = basePusher(arrHashMap, collection);
        }
      }
      return collection;
    },

    orderedDist = function(dist) {
      if (!dist) { return; }

      //Reorder paths correctly
      let orderedDeps = [
        'personalize',
        'initialize',
        'base',
        'utils',
        'animations',
        'locale',
        'listfilter'
      ];

      let orderedDepsIndex = [],
        foundOrderedDeps   = [],
        combinedDist       = [];

      for (let i in orderedDeps) {
        orderedDepsIndex.push(dist.indexOf(orderedDeps[i]));
      }

      for (let i in orderedDepsIndex) {
        if (orderedDepsIndex[i] > -1) {
          foundOrderedDeps.push(orderedDeps[i]);
        }
      }

      for (let i in foundOrderedDeps) {
        dist = dist.filter((err) => {
          return err !== foundOrderedDeps[i];
        });
      }

      combinedDist = foundOrderedDeps.concat(dist);

      //Modify array based on options, include, exclude options
      if (excludeControls) {
        for (let i in excludeControls) {
          combinedDist = combinedDist.filter((err) => {
            return err !== excludeControls[i];
          });
        }
      }

      const paths = combinedDist.map((path) => { return `temp/amd/${path}.js`; }),
        logOptions = { separator: '\n' };

      grunt.log.writeln('List of included controls in sohoxi.*.js'.green);
      grunt.log.write(grunt.log.wordlist(paths, logOptions));

      return paths;
    },

    dependencyBuilder = function(mapperPath, configPath) {
      let dist,
        deps = [];

      if (configPath) {
        let path = grunt.file.readJSON(configPath);
        dist = path.js;
      }

      if (mapperPath && controls && !configPath) {
        const hashMap = grunt.file.readJSON(mapperPath);

        for (let i in controls) {
          let highLevelDependencies = controls[i],
            lowLevelDependencies = hashMap[highLevelDependencies],
            uniqs = setHashMapUniqueDependencies(lowLevelDependencies),
            setTraverseDeps = setTraverse(hashMap, uniqs);

          for (let j in setTraverseDeps) {
            deps.push(setTraverseDeps[j]);
          }
        }

        let combinedDeps = deps.concat(controls);
        dist = setUniqueDependencies(combinedDeps);

      }

      return orderedDist(dist) || false;

  };

  checkGruntControlOptions(controls);
  checkGruntControlOptions(excludeControls);

  const arrControls = dependencyBuilder(mapperPath, configPath) ||
    [
      'temp/amd/personalize.js',
      'temp/amd/initialize.js',
      'temp/amd/base.js',
      'temp/amd/utils.js',
      'temp/amd/animations.js',
      'temp/amd/locale.js',
      'temp/amd/listfilter.js',
      'temp/amd/about.js',
      'temp/amd/accordion.js',
      'temp/amd/applicationmenu.js',
      'temp/amd/autocomplete.js',
      'temp/amd/busyindicator.js',
      'temp/amd/button.js',
      'temp/amd/chart.js',
      'temp/amd/colorpicker.js',
      'temp/amd/contextualactionpanel.js',
      'temp/amd/datepicker.js',
      'temp/amd/datagrid.js',
      'temp/amd/dropdown.js',
      'temp/amd/drag.js',
      'temp/amd/editor.js',
      'temp/amd/environment.js',
      'temp/amd/expandablearea.js',
      'temp/amd/flyingfocus.js',
      'temp/amd/form.js',
      'temp/amd/fileupload.js',
      'temp/amd/fileuploadadvanced.js',
      'temp/amd/header.js',
      'temp/amd/hierarchy.js',
      'temp/amd/highlight.js',
      'temp/amd/homepage.js',
      'temp/amd/icon.js',
      'temp/amd/lookup.js',
      'temp/amd/lifecycle.js',
      'temp/amd/lightbox.js',
      'temp/amd/listview.js',
      'temp/amd/listbuilder.js',
      'temp/amd/circlepager.js',
      'temp/amd/pager.js',
      'temp/amd/place.js',
      'temp/amd/popdown.js',
      'temp/amd/popupmenu.js',
      'temp/amd/progress.js',
      'temp/amd/mask.js',
      'temp/amd/multiselect.js',
      'temp/amd/message.js',
      'temp/amd/modal.js',
      'temp/amd/modalsearch.js',
      'temp/amd/rating.js',
      'temp/amd/resize.js',
      'temp/amd/searchfield.js',
      'temp/amd/sidebar.js',
      'temp/amd/shell.js',
      'temp/amd/signin.js',
      'temp/amd/slider.js',
      'temp/amd/arrange.js',
      'temp/amd/scrollaction.js',
      'temp/amd/spinbox.js',
      'temp/amd/splitter.js',
      'temp/amd/steppedprocess.js',
      'temp/amd/swaplist.js',
      'temp/amd/toast.js',
      'temp/amd/tabs.js',
      'temp/amd/tag.js',
      'temp/amd/textarea.js',
      'temp/amd/timepicker.js',
      'temp/amd/tmpl.js',
      'temp/amd/toolbar.js',
      'temp/amd/toolbarsearchfield.js',
      'temp/amd/tooltip.js',
      'temp/amd/tree.js',
      'temp/amd/validation.js',
      'temp/amd/wizard.js',
      'temp/amd/zoom.js'
    ];

  let strBanner = '/**\n* Soho XI Controls v<%= pkg.version %> \n* Date: <%= grunt.template.today("dd/mm/yyyy h:MM:ss TT") %> \n* Revision: <%= meta.revision %> \n */ \n';

  if(mapperPath || config || configPath) {
    let paths = arrControls.map((path) => { return extractNameFromPath(path); }),
    configObj,
    strControls;

    if (config) {
      configObj = { js : paths };
      grunt.file.write('config.json', JSON.stringify(configObj, null, 2));
      grunt.log.writeln();
      grunt.log.writeln('\u2714'.green, ' File', 'config.json'.magenta, 'created.');
      grunt.log.write(JSON.stringify(configObj, null, 2).cyan);
      grunt.log.writeln();
    }

    strControls = paths.join(', ');
    strBanner = `/**\n* Soho XI Controls v<%= pkg.version %> \n* ${strControls} \n* Date: <%= grunt.template.today("dd/mm/yyyy h:MM:ss TT") %> \n* Revision: <%= meta.revision %> \n */ \n`;
  }

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: strBanner,
    amdHeader: '(function(factory) {\n\n  if (typeof define === \'function\' && define.amd) {\n    // AMD. Register as an anonymous module\n    define([\'jquery\'], factory);\n  } else if (typeof exports === \'object\') {\n    // Node/CommonJS\n    module.exports = factory(require(\'jquery\'));\n} else {\n    // Browser globals \n    factory(jQuery);\n  }\n\n}(function($) {\n\n',

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/css/demo.css'                : 'sass/demo.scss',
          'dist/css/light-theme.css'         : 'sass/light-theme.scss',
          'dist/css/dark-theme.css'          : 'sass/dark-theme.scss',
          'dist/css/high-contrast-theme.css' : 'sass/high-contrast-theme.scss',
          'dist/css/css-only.css'            : 'sass/css-only.scss',
          'dist/css/site.css'                : 'sass/site.scss'
        }
      }
    },

    watch: {
      source: {
        files: ['sass/**/*.scss', 'svg/*.svg', 'views/docs/**.html', 'views/**.html', 'views/includes/**.html', 'views/controls/**.html', 'js/*/*.js', 'js/*.js', 'js/cultures/*.*'],
        tasks: ['sohoxi-watch'],
        options: {
          livereload: true
        }
      }
    },

    jshint: {
      files: ['gruntfile.js', 'app.js', 'js/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    concat: {
      options: {
        separator: '',
        banner: '<%= banner %>'+'<%= amdHeader %>',
        footer: '\n}));\n//# sourceURL=<%= pkg.shortName %>.js'
      },
      basic: {
        files: {
          'dist/js/<%= pkg.shortName %>.js': arrControls
        }
      }
    },

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
    },

    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['dist/js/sohoxi.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['dist/js/sohoxi.min.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/sohoxi-angular.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/sohoxi-angular.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/sohoxi-knockout.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/sohoxi-knockout.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/*.js'], dest: 'dist/js/all/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['dist/css/*'], dest: 'public/stylesheets/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/demo/*.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-3*.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-3*.min.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-3*.map'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-3*.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-3*.min.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-3*.map'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/d3.*'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-2*.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-2*.min.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-2*.map'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/d3.*'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/cultures/*.*'], dest: 'public/js/cultures/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/cultures/*.*'], dest: 'dist/js/cultures/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['views/controls/svg*.html'], dest: 'dist/svg/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['views/controls/svg*.html'], dest: 'public/svg/', filter: 'isFile'}
        ]
      },
      amd: {
        files: [
          {expand: true, flatten: true, src: ['js/*.*'], dest: 'temp/amd/', filter: 'isFile'}
        ]
      }
    },

    // Minify css
    cssmin: {
      options: {
        roundingPrecision: -1
      },
      dist: {
        files: {
          'dist/css/high-contrast-theme.min.css': ['dist/css/high-contrast-theme.css'],
          'dist/css/dark-theme.min.css': ['dist/css/dark-theme.css'],
          'dist/css/light-theme.min.css': ['dist/css/light-theme.css'],
          'dist/css/css-only.min.css': ['dist/css/css-only.css'],
        }
      }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>',
          linebreak: true
        },

        files: {
          src: [
            'dist/css/508-theme.css',
            'dist/css/508-theme.min.css',
            'dist/css/dark-theme.css',
            'dist/css/dark-theme.min.css',
            'dist/css/light-theme.css',
            'dist/css/light-theme.min.css',
            'dist/css/css-only.css',
            'dist/css/css-only.min.css',
            'dist/js/all/*.js'
          ]
        }
      }
    },

    // Git Revision
    revision: {
      options: {
        property: 'meta.revision',
        ref: 'HEAD',
        short: false
      }
    },

    meta: {
      revision: undefined
    },

    strip_code: { // jshint ignore:line
      options: {
        start_comment: 'start-amd-strip-block', // jshint ignore:line
        end_comment: 'end-amd-strip-block' // jshint ignore:line
      },
      src: {
        src: 'temp/amd/*.js'
      }
    },

    clean: {
      amd: ['temp'],
      dist: ['dist/js/*', 'dist/svg/*', 'dist/css/*'],
      public: ['public/js/*','public/svg/*','public/stylesheets/*']
    },

    compress: {
      main: {
        options: {
          archive: 'dist/all.zip'
        },

        files: [
          {src: ['dist/**'], dest: 'dist/'}
        ]
      }
    },

    md2html: {
      changelog: {
        options: {
          // Task-specific options go here.
        },
        files: [{
          src: ['CHANGELOG.md'],
          dest: 'views/docs/changelog-contents.html'
        }]
      }
    }

  });

  // load all grunt tasks from 'node_modules' matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'clean:dist',
    'clean:public',
    'revision',
    'jshint',
    'sass',
    'copy:amd',
    'strip_code',
    'concat',
    'clean:amd',
    'uglify',
    'cssmin',
    'copy:main',
    'usebanner',
    'compress',
    'md2html'
  ]);

  // Don't do any uglify/minify/jshint while the Dev Watch is running.
  grunt.registerTask('sohoxi-watch', [
    'revision', 'sass', 'copy:amd', 'strip_code','concat', 'clean:amd', 'copy:main', 'usebanner'
  ]);

};
