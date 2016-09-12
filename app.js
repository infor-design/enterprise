/* jshint node:true */

// set variables for environment
var express = require('express'),
  extend = require('extend'), // equivalent of $.extend()
  app = express(),
  path = require('path'),
  mmm = require('mmm'),
  fs = require('fs'),
  http = require('http'),
  colors = require('colors'); // jshint ignore:line

  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, 'views'));
  mmm.setEngine('hogan.js');
  app.engine('html', mmm.__express);

  // Because you're the type of developer who cares about this sort of thing!
  app.enable('strict routing');

  // instruct express to server up static assets
  app.use(express.static('public'));

  // Create the express router with the same settings as the app.
  var router = express.Router({
    'strict': true
  });

  // ===========================================
  // Default Options / Custom Middleware
  // ===========================================
  var defaults = {
    enableLiveReload: true,
    layout: 'layout',
    locale: 'en-US',
    title: 'SoHo XI',
  };

  // Option Handling - Custom Middleware
  // Writes a set of default options the "req" object.  These options are always eventually passed to the HTML template.
  // In some cases, these options can be modified based on query parameters.  Check the default route for these options.
  var optionHandler = function(req, res, next) {
    res.opts = extend({}, defaults);

    // Change Locale (which also changes right-to-left text setting)
    if (req.query.locale && req.query.locale.length > 0) {
      res.opts.locale = req.query.locale;
      console.log('Changing Route Parameter "locale" to be "' + res.opts.locale + '".');
    }

    // Normally we will use an external file for loading SVG Icons and Patterns.
    // Setting "inlineSVG" to true will use the deprecated method of using SVG icons, which was to bake them into the HTML markup.
    if (req.query.inlineSVG && req.query.inlineSVG.length > 0) {
      res.opts.inlineSVG = true;
      console.log('Inlining SVG Elements...');
    }

    // Set the theme and colorScheme
    //Fx: http://localhost:4000/controls/modal?colorScheme=123456,123456,827272&themeName=dark
    if (req.query.themeName && req.query.themeName.length  > 0) {
      res.opts.themeName = req.query.themeName;
      console.log('Setting Theme to ' + res.opts.themeName);
    }

    if (req.query.colorScheme && req.query.colorScheme.length > 0) {
      res.opts.colorScheme = req.query.colorScheme;
      console.log('Setting Colors to ' + res.opts.colorScheme);
    }

    next();
  };

  // Simple Middleware for logging some meta-data about the request to the console
  var timestampLogger = function(req, res, next) {
    console.log(Date.now() + ' - ' + req.method + ': ' + req.url);
    next();
  };

  // Simple Middleware for handling errors
  var errorHandler = function(err, req, res, next) {
    if (!err) {
      return next();
    }

    console.error(err.stack);

    if (res.headersSent) {
      return next(err);
    }

    res.status(500).send('<h2>Internal Server Error</h2><p>' + err.stack +'</p>');
  };

  // place optionHandler() first to augment all "res" objects with an "opts" object
  app.use(optionHandler);
  app.use(router);
  app.use(timestampLogger);
  app.use(errorHandler);

  // Strips the ".html" from a file path and returns the target route name without it
  function stripHtml(routeParam) {
    var noHtml = routeParam.replace(/\.html/, '');
    return noHtml;
  }

  // Checks the target file path for its type (is it a file, a directory, etc)
  // http://stackoverflow.com/questions/15630770/node-js-check-if-path-is-file-or-directory
  function is(type, filePath) {
    var types = ['file', 'folder'],
      defaultType = types[0],
      mappings = {
        file: { methodName: 'isFile' },
        directory: { methodName: 'isDirectory' }
        // TODO: Add More (symbolic link, etc)
      };

    if (!type) {
      console.warn('No type defined. Using the default type of "' + defaultType + '".');
      type = defaultType;
    }

    if (!mappings[type]) {
      console.error('Provided type "' + type + '" is not in the list of valid types.');
      return false;
    }

    var targetPath = './views/' + filePath,
      methodName = mappings[type].methodName;

    try {
      return fs.statSync(targetPath)[methodName]();
    }
    catch (e) {
      console.info('File Path "' + targetPath + '" is not a ' + type + '.');
      return false;
    }
  }

  function hasTrailingSlash(path) {
    if (!path || typeof path !== 'string') {
      return false;
    }

    return path.substr(path.length - 1) === '/';
  }

  // Returns a directory listing as page content with working links
  function getDirectoryListing(directory, req, res, next) {
    fs.readdir('./views/' + directory, function(err, paths) {
      if (err) {
        console.log(err);
        res.render(err);
        return next();
      }

      var realPaths = [];
      // TODO: var dirs = [];  Separate paths from directories and place an icon next to them

      // Strip out paths that aren't going to ever work
      paths.forEach(function pathIterator(val) {
        var excludes = [
          /layout\.html/,
          /footer\.html/,
          /layout-noheader\.html/,
          /\.DS_Store/
        ],
        match = false;

        excludes.forEach(function(exclude) {
          if (val.match(exclude)) {
            match = true;
            return;
          }
        });

        if (match) {
          return;
        }

        realPaths.push(val);
      });

      // Map with links, add to
      function pathMapper(link) {
        var href = path.join('/', directory, link),
          icon;

        if (is('directory', href)) {
          icon = '#icon-folder';
        }

        return {
          icon: icon,
          href: href.replace(/\\/g,'/'),
          text: link
        };
      }

      var opts = extend({}, res.opts, {
        subtitle: 'Listing for ' + directory,
        paths: realPaths.map(pathMapper)
      });

      res.render('listing', opts);
      next();
    });
  }

  // ======================================
  //  Main Routing and Param Handling
  // ======================================

  router.get('/', function(req, res, next) {
    res.render('index', res.opts);
    next();
  });

  router.get('/partials*', function(req, res) {
    var end = req.url.replace('/partials/',''),
      partialsOpts = {
        enableLiveReload: false,
        layout: '',
        locale: 'en-US',
        title: '',
      };

    res.render('partials/' + end, partialsOpts);
  });


  // ======================================
  //  Controls Section
  // ======================================

  var controlOpts = {
    'layout': 'controls/layout',
    'subtitle': 'Style',
  };

  function defaultControlsRoute(req, res, next) {
    var opts = extend({}, res.opts, controlOpts);
    opts.subtitle = 'Full Index';

    res.render('controls/index', opts);
    next();
  }

  router.get('/controls/:control', function(req, res, next) {
    var controlName = '',
      opts = extend({}, res.opts, controlOpts);

    if (!req.params.control) {
      return defaultControlsRoute(req, res, next);
    }

    controlName = stripHtml(req.params.control);
    opts.subtitle = controlName.charAt(0).toUpperCase() + controlName.slice(1).replace('-',' ');

    // Specific Changes for certain controls
    opts.subtitle = opts.subtitle.replace('Contextualactionpanel', 'Contextual Action Panel');
    if (controlName.indexOf('masthead') !== -1) {
      opts.layout = 'controls/masthead-layout';
    }

    res.render('controls/' + controlName, opts);
    next();
  });

  router.get('/controls/', defaultControlsRoute);
  router.get('/controls', defaultControlsRoute);

  // ======================================
  //  Patterns Section
  // ======================================

  router.get('/patterns*', function(req, res, next) {
    var opts = extend({}, res.opts, {
      layout: 'patterns/layout',
      subtitle: 'Patterns'
    }),
      end = req.url.replace(/\/patterns(\/)?/g, '');

    // Don't capture any query params for the View Render
    end = end.replace(/\?(.*)/, '');

    if (!end || !end.length || end === '/') {
      getDirectoryListing('patterns/', req, res, next);
      return;
    }

    res.render('patterns/' + end, opts);
    next();
  });

  // =========================================
  // Test Pages
  // =========================================

  var testOpts = {
    subtitle: 'Tests',
    layout: 'tests/layout'
  };

  // Custom Application Menu Layout files.  Since the markup for the Application Menu lives higher up than the
  // content filter lives on most templates, we have a special layout-changing system for Application Menu Tests.
  function getApplicationMenuTestLayout(path) {
    var base = 'tests/applicationmenu/';

    if (path.match(/\/site/)) {
      return base + 'site/layout';
    } else if (path.match(/\/container/)) {
      return base + 'container/layout';
    } else if (path.match(/\/different-header-types/)) {
      return base + 'different-header-types/layout';
    } else if (path.match(/\/lms/)) {
      return base + 'lms/layout';
    } else if (path.match(/\/six-levels-with-icons/)) {
      return base + 'six-levels-with-icons/layout';
    }
    return base + 'six-levels/layout';
  }

  function testsRouteHandler(req, res, next) {
    var opts = extend({}, res.opts, testOpts),
      end = req.url.replace(/\/tests(\/)?/, '');

    // remove query params for our checking
    end = end.replace(/\?(.*)/, '');

    if (!end || !end.length || end === '/') {
      getDirectoryListing('tests/', req, res, next);
      return;
    }

    var directory = 'tests/' + end;
    if (hasTrailingSlash(directory)) {
      if (is('directory', directory) ) {
        getDirectoryListing(directory, req, res, next);
        return;
      }

      directory = directory.substr(0, directory.length - 1);
    }

    // Custom configurations for some test folders
    if (directory.match(/tests\/applicationmenu/)) {
      opts.layout = getApplicationMenuTestLayout(directory);
    }
    if (directory.match(/tests\/base-tag/)) {
      opts.usebasehref = true;
    }
    if (directory.match(/tests\/distribution/)) {
      opts.amd = true;
      opts.layout = null; // No layout for this one on purpose.
      opts.subtitle = 'AMD Tests';
    }
    if (directory.match(/tests\/header/)) {
      opts.layout = 'tests/header/layout';
    }
    if (directory.match(/tests\/signin/)) {
      opts.layout = 'tests/layout-noheader';
    }
    if (directory.match(/tests\/tabs-module/)) {
      opts.layout = 'tests/tabs-module/layout';
    }
    if (directory.match(/tests\/tabs-header/)) {
      opts.layout = 'tests/tabs-header/layout';
    }
    if (directory.match(/tests\/tabs-vertical/)) {
      opts.layout = 'tests/tabs-vertical/layout';
    }

    // No trailing slash.  Check for an index file.  If no index file, do directory listing
    if (is('directory', directory)) {
      if (is('file', directory + '/index')) {
        res.render(directory + '/index', opts);
        return next();
      }

      getDirectoryListing(directory, req, res, next);
      return;
    }

    res.render(directory, opts);
    next();
  }

  //Tests Index Page and controls sub pages
  router.get('/tests*', testsRouteHandler);
  router.get('/tests', testsRouteHandler);

  // =========================================
  // Docs Pages
  // =========================================

  var layoutOpts = {
    subtitle: 'Docs',
    layout: 'docs/layout'
  };

  function defaultDocsRouteHandler(req, res, next) {
    var opts = extend({}, res.opts, layoutOpts);
    res.render('docs/index', opts);
    next();
  }

  function docsRouteHandler(req, res, next) {
    var opts = extend({}, res.opts, layoutOpts),
      docs = req.params.docs;

    if (!docs || !docs.length) {
      return defaultDocsRouteHandler(req, res, next);
    }

    res.render('docs/' + docs, opts);
    next();
  }

  router.get('/docs/:docs', docsRouteHandler);
  router.get('/docs/', defaultDocsRouteHandler);
  router.get('/docs', defaultDocsRouteHandler);


  // =========================================
  // Layouts Pages
  // =========================================

  var layoutOpts = {
    subtitle: 'Layouts',
    layout: 'layouts/layout'
  };

  function defaultLayoutRouteHandler(req, res, next) {
    var opts = extend({}, res.opts, layoutOpts);
    res.render('layouts/index', opts);
    next();
  }

  function layoutRouteHandler(req, res, next) {
    var opts = extend({}, res.opts, layoutOpts),
      layout = req.params.layout;

    if (!layout || !layout.length) {
      return defaultLayoutRouteHandler(req, res, next);
    }

    res.render('layouts/' + layout, opts);
    next();
  }

  router.get('/layouts/:layout', layoutRouteHandler);
  router.get('/layouts/', defaultLayoutRouteHandler);
  router.get('/layouts', defaultLayoutRouteHandler);

  // =========================================
  // Examples Pages
  // =========================================

  var exampleOpts = {
    subtitle: 'Examples',
    layout: 'examples/layout'
  };

  function exampleRouteHandler(req, res, next) {
    var opts = extend({}, res.opts, exampleOpts),
      folder = req.params.folder,
      example = req.params.example,
      path = req.url;

    // A missing category means both no category and no test page.  Simply show the directory listing.
    if (!folder || !folder.length) {
      getDirectoryListing('examples/', req, res, next);
      return;
    }

    // A missing testpage with a category defined will either:
    // - Show a directory listing if there is no test page associated with the current path
    // - Show a test page
    if (!example || !example.length) {
      if (hasTrailingSlash(path)) {

        if (is('directory', 'examples/' + folder + '/')) {
          getDirectoryListing('examples/' + folder + '/', req, res, next);
          return;
        }

      }

      res.render('examples/' + folder, opts);
      next();
      return;
    }

    // if testpage and category are both defined, should be able to show a valid testpage
    res.render('examples/' + folder + '/' + example, opts);
    next();
  }

  router.get('/examples/:folder/:example', exampleRouteHandler);
  router.get('/examples/:folder/', exampleRouteHandler);
  router.get('/examples/:folder', exampleRouteHandler);
  router.get('/examples/', exampleRouteHandler);
  router.get('/examples', exampleRouteHandler);

  // =========================================
  // Angular Support Test Pages
  // =========================================

  var angularOpts = {
    subtitle: 'Angular',
    layout: 'angular/layout'
  };

  router.get('/angular*', function(req, res, next) {
    var opts = extend({}, res.opts, angularOpts),
      end = req.url.replace(/\/angular(\/)?/, '');

    if (!end || !end.length || end === '/') {
      getDirectoryListing('angular/', req, res, next);
      return;
    }

    res.render('angular/' + end, opts);
    next();
  });

  // React Support
  var reactOpts = {
    subtitle: 'React',
    layout: 'react/layout'
  };

  router.get('/react*', function(req, res, next) {
    var opts = extend({}, res.opts, reactOpts),
      end = req.url.replace(/\/react(\/)?/, '');

    if (!end || !end.length || end === '/') {
      getDirectoryListing('react/', req, res, next);
      return;
    }

    res.render('react/' + end, opts);
    next();
  });

  // =========================================
  // Knockout Support Test Pages
  // =========================================

  var knockoutOpts = {
    subtitle: 'Knockout',
    layout: 'knockout/layout'
  };

  router.get('/knockout*', function(req, res, next) {
    var opts = extend({}, res.opts, knockoutOpts),
      end = req.url.replace(/\/knockout(\/)?/g, '');

    if (!end || !end.length || end === '/') {
      getDirectoryListing('knockout/', req, res, next);
      return;
    }

    res.render('knockout/' + end, opts);
    next();
  });

  // =========================================
  // Fake "API" Calls for use with AJAX-ready Controls
  // =========================================

  //Sample Json call that returns States
  //Example Call: http://localhost:4000/api/states?term=al
  router.get('/api/states', function(req, res, next) {
    var states = [],
      allStates = [
      {value:'AL', label:'Alabama'},
      {value:'AK', label:'Alaska'},
      {value:'AS', label:'American Samoa'},
      {value:'AZ', label:'Arizona'},
      {value:'AR', label:'Arkansas'},
      {value:'CA', label:'California'},
      {value:'CO', label:'Colorado'},
      {value:'CT', label:'Connecticut'},
      {value:'DE', label:'Delaware'},
      {value:'DC', label:'District Of Columbia'},
      {value:'FM', label:'Federated States Of Micronesia'},
      {value:'FL', label:'Florida'},
      {value:'GA', label:'Georgia'},
      {value:'GU', label:'Guam'},
      {value:'HI', label:'Hawaii'},
      {value:'ID', label:'Idaho'},
      {value:'IL', label:'Illinois'},
      {value:'IN', label:'Indiana'},
      {value:'IA', label:'Iowa'},
      {value:'KS', label:'Kansas'},
      {value:'KY', label:'Kentucky'},
      {value:'LA', label:'Louisiana'},
      {value:'ME', label:'Maine'},
      {value:'MH', label:'Marshall Island Teritory'},
      {value:'MD', label:'Maryland'},
      {value:'MA', label:'Massachusetts'},
      {value:'MI', label:'Michigan'},
      {value:'MN', label:'Minnesota'},
      {value:'MS', label:'Mississippi'},
      {value:'MO', label:'Missouri'},
      {value:'MT', label:'Montana'},
      {value:'NE', label:'Nebraska'},
      {value:'NV', label:'Nevada'},
      {value:'NH', label:'New Hampshire'},
      {value:'NJ', label:'New Jersey'},
      {value:'NM', label:'New Mexico'},
      {value:'NY', label:'New York'},
      {value:'NC', label:'North Carolina'},
      {value:'ND', label:'North Dakota'},
      {value:'MP', label:'Northern Mariana Island Teritory'},
      {value:'OH', label:'Ohio'},
      {value:'OK', label:'Oklahoma'},
      {value:'OR', label:'Oregon'},
      {value:'PW', label:'Palau'},
      {value:'PA', label:'Pennsylvania'},
      {value:'PR', label:'Puerto Rico'},
      {value:'RI', label:'Rhode Island Teritory'},
      {value:'SC', label:'South Carolina'},
      {value:'SD', label:'South Dakota'},
      {value:'TN', label:'Tennessee'},
      {value:'TX', label:'Texas'},
      {value:'UT', label:'Utah'},
      {value:'VT', label:'Vermont'},
      {value:'VI', label:'Virgin Island Teritory'},
      {value:'VA', label:'Virginia'},
      {value:'WA', label:'Washington'},
      {value:'WV', label:'West Virginia'},
      {value:'WI', label:'Wisconsin'},
      {value:'WY', label:'Wyoming'}
      ];

    function done() {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(states));
      next();
    }

    if (!req || !req.query || !req.query.term) {
      states = allStates;
      return done();
    }

    for (var i = 0; i < allStates.length; i++) {
      if (allStates[i].label.toLowerCase().indexOf(req.query.term.toLowerCase()) > -1) {
        states.push(allStates[i]);
      }
    }

    done();
  });

  // Sample People
  router.get('/api/people', function(req, res, next) {
    var people = [{ id: 1, rowHeight: 50, lastName:  'Asper', firstName:  'David',  title:  'Engineer', img: 'https://randomuser.me/api/portraits/med/men/10.jpg', status: 'Full time employee' , anniversary: '06/02/2012', score: 3, payRate: 90000, budgeted: 1200, budgetedHourly: 0.25, reccomended: '0-0%', percent: '0%', accepted: true, icon: 'pending'},
        { id: 2, lastName:  'Baxter', firstName:  'Michael',  title:  'System Architect', img: 'https://randomuser.me/api/portraits/med/men/11.jpg', status: 'Freelance, 3-6 months', anniversary: '06/02/2012', score: 2, payRate: 50000, budgeted: 1300, budgetedHourly: 0.25, reccomended: '10-20%', percent: '4.16%', accepted: false, icon: 'alert'},
        { id: 3, rowHeight: 100, lastName:  'Baxter', firstName:  'Steven',  title:  'Some Very Very Very Long Title That is too long but still should show.', img: 'https://randomuser.me/api/portraits/med/men/12.jpg', status: 'Full time employee', anniversary: '06/02/2012', score: 0, payRate: 60000, budgeted: 1100, budgetedHourly: 0.65, reccomended: '30-40%', percent: '10%', accepted: true, icon: 'info'},
        { id: 4, lastName:  'Baxter', firstName:  'Samual',  title:  'System Architect', img: 'https://randomuser.me/api/portraits/med/men/13.jpg', status: 'Full time employee', anniversary: '06/02/2012', score: 5, payRate: 80000, budgeted: 1200, budgetedHourly: 0.15, reccomended: '60-70%', percent: '20%', accepted: false},
        { id: 5, lastName:  'Bronte', firstName:  'Emily',  title:  'Engineer', img: 'https://randomuser.me/api/portraits/med/women/14.jpg', status: 'Full time employee', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%', accepted: false, icon: 'error'},
        { id: 6, lastName:  'Davendar', firstName:  'Konda',  title:  'Engineer', img: 'https://randomuser.me/api/portraits/med/women/15.jpg', status: 'Full time employee', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%'},
        { id: 7, lastName:  'Little', firstName:  'Jeremy',  title:  'Engineer', img: 'https://randomuser.me/api/portraits/med/men/16.jpg', status: 'Full time employee', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%', accepted: false},
        { id: 8, lastName:  'Ayers', firstName:  'Julie',  title:  'Architect', img: 'https://randomuser.me/api/portraits/med/women/17.jpg', status: 'Freelance, 3-6 months', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%'},
        { id: 9, lastName:  'Ortega', firstName:  'Hector',  title:  'Senior Architect', img: 'https://randomuser.me/api/portraits/med/men/18.jpg', status: 'Freelance, 3-6 months', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%', accepted: false},
        { id: 10, lastName:  'McConnel', firstName:  'Mary',  title:  'Engineer', img: 'https://randomuser.me/api/portraits/med/women/19.jpg', status: 'Freelance, 3-6 months', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%'},
        { id: 11, lastName:  'Smith', firstName:  'John',  title:  'Developer', img: 'https://randomuser.me/api/portraits/med/men/20.jpg', status: 'Freelance, 3-6 months', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%', accepted: true},
        { id: 12, lastName:  'Horrocks', firstName:  'Donna',  title:  'Associate Developer', img: 'https://randomuser.me/api/portraits/med/women/21.jpg', status: 'Freelance, 3-6 months', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%', accepted: true},
        { id: 13, lastName:  'Land', firstName:  'Danielle',  title:  'Developer', img: 'https://randomuser.me/api/portraits/med/women/22.jpg', status: 'Full time employee', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%', accepted: true}];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(people));
    next();
  });

  // Sample Product
  router.get('/api/product', function(req, res, next) {
    var products = [
    { id: 1, productId: 200129, productName: 'A Miscellaneous Gravel, Colored Ston...', inStock:  '22,000',  units: '300 lb.', unitPrice:  '18.00', thumb: '/images/multi.png', 'action': 'secondary' },
    { id: 2, productId: 300123, productName: 'B Gravel, Natural Stone', inStock:  '20,000',  units: '300 lb.',  unitPrice:  '10.00', thumb: '/images/natural.png', 'action': 'secondary' },
    { id: 3, productId: 200123, productName: 'C Gravel, Polished Stone', inStock:  '12,050',  units: '300 lb.',  unitPrice:  '12.50', thumb: '/images/polished.png', 'action': 'primary' },
    { id: 4, productId: 200153, productName: 'D Miscellaneous Polished Gravel, Colored Ston...', inStock:  '22,000',  units: '300 lb.',  unitPrice:  '10.22', thumb: '/images/polished.png', 'action': 'secondary' },
    { id: 5, productId: 200123, productName: 'E White Pebbles, Colored Ston...', inStock:  '22,000',  units: '300 lb.',  unitPrice:  '15.80', thumb: '/images/white.png', 'action': 'secondary' },
    { id: 6, productId: 201123, productName: 'F Gravel, River Stone', inStock:  '9,500', units: '300 lb.',  unitPrice:  '21.00', thumb: '/images/river.png', 'action': 'secondary' },
    { id: 7, productId: 100123, productName: 'G Miscellaneous Gravel, Colored Ston...', inStock:  '22,000',  units: '300 lb.',  unitPrice:  '19.10', thumb: '/images/multi.png', 'action': 'secondary' },
    { id: 8, productId: 260123, productName: 'H Gravel, Natural Stone', inStock:  '18,000',  units: '300 lb.',  unitPrice:  '16.30', thumb: '/images/natural.png', 'action': 'secondary' },
    { id: 9, productId: 202123, productName: 'I Gravel, Natural Stone', inStock:  '42,201',  units: '300 lb.',  unitPrice:  '10.00', thumb: '/images/polished2.png', 'action': 'secondary' },
    { id: 10, productId: 200120, productName: 'J Miscellaneous Gravel, Colored Ston...', inStock:  '22,100',  units: '300 lb.',  unitPrice:  '11.00', thumb: '/images/multi.png', 'action': 'secondary' },
    { id: 11, productId: 408123, productName: 'K Miscellaneous Gravel, Colored Ston...', inStock:  '21,150',  units: '300 lb.',  unitPrice:  '15.06', thumb: '/images/natural.png', 'action': 'secondary' },
    { id: 12, productId: 200123, productName: 'K Gravel, White Stone', inStock:  '14,000',  units: '300 lb.',  unitPrice:  '15.90', thumb: '/images/white.png', 'action': 'secondary' }];

    if (req.query.limit) {
      products = products.slice(0,req.query.limit);
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(products));
    next();
  });

  // Sample Supplies
  router.get('/api/supplies', function(req, res, next) {
    var supplies = [
    { id: 1, count: 48, item: 'Acme Medical Supplies', owner:  'Elizebath L. Smith', role: 'Sales'},
    { id: 2, count: 73, item: 'Office Supplies, North Tower, 4th Floor', owner:  'Jason S. Montoya', role: 'Director'},
    { id: 3, count: 218, item: 'Service & Maintance', owner:  'Jennifer Lawson', role: 'Sales Associate'},
    { id: 4, count: 48, item: 'Surgical Supplies', owner:  'Mallory Smith', role: 'Director'},
    { id: 5, count: 39, item: 'Cleaning Supplies', owner:  'Tim Williams', role: 'Manager'},
    { id: 6, count: 72, item: 'Machine Support & Tech', owner:  'Nick Bates', role: 'Manager'},
    { id: 7, count: 9, item: 'IT Department', owner:  'Robert M. Mitchells', role: 'Sales'},
    { id: 8, count: 13, item: 'Janitorial Supplies', owner:  'Meridith S. Connors', role: 'Manager' },
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(supplies));
    next();
  });

  // Sample Towns
  router.get('/api/towns', function(req, res, next) {
    var towns = [
      {
        group: 'Burlington County',
        options: [
          { value: 'Bass River Township' }, { value: 'Beverly' }, { value: 'Bordentown' }, { value: 'Bordentown City' }, { value: 'Browns Mills' },
          { value: 'Burlington City' }, { value: 'Burlington Township' }, { value: 'Chesterfield' }, { value: 'Cinnaminson' }, { value: 'Columbus' },
          { value: 'Delanco' }, { value: 'Delran' }, { value: 'Eastampton' }, { value: 'Edgewater Park' }, { value: 'Evesham' }, { value: 'Fieldsboro' },
          { value: 'Florence' }, { value: 'Fort Dix' }, { value: 'Hainesport' }, { value: 'Lumberton' }, { value: 'Mansfield' }, { value: 'Maple Shade' },
          { value: 'Marlton' }, { value: 'Medford' }, { value: 'Medford Lakes' }, { value: 'Moorestown' }, { value: 'Mount Holly' }, { value: 'Mount Laurel' },
          { value: 'New Hanover' }, { value: 'North Hanover' }, { value: 'Palmyra' }, { value: 'Pemberton' }, { value: 'Roebling' }, { value: 'Riverside' },
          { value: 'Riverton' }, { value: 'Shamong' }, { value: 'Southampton' }, { value: 'Springfield' }, { value: 'Tabernacle' },
          { value: 'Washington Township' }, { value: 'Westampton' }, { value: 'Willingboro' }, { value: 'Woodland' }, { value: 'Wrightstown' }
        ]
      },
      {
        group: 'Camden County',
        options: [
          { value: 'Audubon' }, { value: 'Audubon Park' }, { value: 'Barrington' }, { value: 'Bellmawr' }, { value: 'Berlin Boro' },
          { value: 'Berlin Township' }, { value: 'Brooklawn' }, { value: 'Camden' }, { value: 'Cherry Hill' }, { value: 'Chesilhurst' },
          { value: 'Clementon' }, { value: 'Collingswood' }, { value: 'Erial' }, { value: 'Gibbsboro' }, { value: 'Gloucester City' }, { value: 'Gloucester Township' },
          { value: 'Haddon Heights' }, { value: 'Haddon Township' }, { value: 'Haddonfield' }, { value: 'Hi-Nella' }, { value: 'Laurel Springs' },
          { value: 'Lawnside' }, { value: 'Lindenwold' }, { value: 'Magnolia' }, { value: 'Merchantville' }, { value: 'Mount Ephraim' }, { value: 'Oaklyn' },
          { value: 'Pennsauken' }, { value: 'Pine Hill' }, { value: 'Pine Valley' }, { value: 'Runnemede' }, { value: 'Sicklerville' }, { value: 'Somerdale' },
          { value: 'Stratford' }, { value: 'Tavistock' }, { value: 'Voorhees' }, { value: 'Waterford' }, { value: 'Winslow' }, { value: 'Woodlynne' }
        ]
      },
      {
        group: 'Gloucester County',
        options: [
          { value: 'Bridgeport' }, { value: 'Clayton' }, { value: 'Cross Keys' }, { value: 'Deptford' }, { value: 'East Greenwich' },
          { value: 'Elk Township' }, { value: 'Franklin Township' }, { value: 'Franklinville' }, { value: 'Gibbstown' }, { value: 'Glassboro' },
          { value: 'Greenwich Township' }, { value: 'Harrison' }, { value: 'Malaga' }, { value: 'Mullica Hill' }, { value: 'Logan' }, { value: 'Mantua' },
          { value: 'Monroe' }, { value: 'National Park' }, { value: 'New Brooklyn' }, { value: 'Newfield' }, { value: 'Paulsboro' }, { value: 'Pitman' },
          { value: 'South Harrison' }, { value: 'Swedesboro' }, { value: 'Turnersville' }, { value: 'Washington Township' }, { value: 'Wenonah' },
          { value: 'West Deptford Township' }, { value: 'Westville' }, { value: 'Williamstown' }, { value: 'Woodbury' }, { value: 'Woodbury Heights' }, { value: 'Woolwich' }
        ]
      }
    ];

    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(towns));
    next();
  });

  // Sample Tasks
  router.get('/api/tasks', function(req, res, next) {
    var tasks = [{ id: 1, escalated: 2, taskName: 'Follow up action with HMM Global', desc: 'Contact sales representative with the updated purchase order.', comments: 21, time: '7:04 AM'},
      { id: 2, escalated: 1, taskName: 'Quotes due to expire', desc: 'Update pending quotes and send out again to customers.', comments: 3, time: '12/13/14 7:04 AM'},
      { id: 3, escalated: 0, taskName: 'Follow up action with Universal Shipping Logistics Customers', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '12/14/14'},
      { id: 4, escalated: 0, taskName: 'Follow up action with Acme Trucking', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '12/14/14'},
      { id: 5, escalated: 0, taskName: 'Follow up action with Residental Housing', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '12/14/14'},
      { id: 6, escalated: 0, taskName: 'Follow up action with HMM Global', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '12/15/14'},
      { id: 7, escalated: 0, taskName: 'Follow up action with Residental Housing', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '12/15/14'},
      { id: 8, escalated: 0, taskName: 'Follow up action with Universal HMM Logistics', desc: 'Contact sales representative.', comments: 2, time: '12/16/14'},
      { id: 9, escalated: 0, taskName: 'Follow up action with Acme Shipping', desc: 'Contact sales representative.', comments: 2, time: '12/16/14'},
      { id: 10, escalated: 0, taskName: 'Follow up action with Residental Shipping Logistics ', desc: 'Contact sales representative.', comments: 2, time: '12/16/14'},
      { id: 11, escalated: 0, taskName: 'Follow up action with Universal Shipping Logistics Customers', desc: 'Contact sales representative.', comments: 2, time: '12/18/14'},
      { id: 12, escalated: 0, taskName: 'Follow up action with Acme Universal Logistics Customers', desc: 'Contact sales representative.', comments: 2, time: '12/18/14'},
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
    next();
  });

  //Sample Periods
  router.get('/api/periods', function(req, res, next) {
    var tasks = [{ id: 1, city: 'London', location: 'Corporate FY15', alert: true, alertClass: 'error', daysLeft: '3', hoursLeft: '23'},
     { id: 1, city: 'New York', location: 'Corporate FY15', alert: true, alertClass: 'alert', daysLeft: '25', hoursLeft: '11'},
     { id: 1, city: 'Vancouver', location: 'Corporate FY15', alert: false, alertClass: '', daysLeft: '30', hoursLeft: '23'},
     { id: 1, city: 'Tokyo', location: 'Corporate FY15', alert: false, alertClass: '', daysLeft: '35', hoursLeft: '13'}
   ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
    next();
  });

  //Sample Hierarchical Data
  // Sample Tasks
  router.get('/api/tree-tasks', function(req, res, next) {
    var tasks = [
      { id: 1, escalated: 2, depth: 1, expanded: false, taskName: 'Follow up action with HMM Global', desc: '', comments: null, time: '', children: [
        { id: 2, escalated: 1, depth: 2, taskName: 'Quotes due to expire', desc: 'Update pending quotes and send out again to customers.', comments: 3, time: '7:10 AM'},
        { id: 3, escalated: 0, depth: 2, taskName: 'Follow up action with Universal Shipping Logistics Customers', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '9:10 AM'},
        { id: 4, escalated: 0, depth: 2, taskName: 'Follow up action with Acme Trucking', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '14:10 PM'},
      ]},
      { id: 5, escalated: 0, depth: 1, taskName: 'Follow up action with Residental Housing', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '18:10 PM'},
      { id: 6, escalated: 0, depth: 1, taskName: 'Follow up action with HMM Global', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '20:10 PM'},
      { id: 7, escalated: 0, depth: 1, expanded: true, taskName: 'Follow up action with Residental Housing', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '22:10 PM', children: [
        { id: 8, escalated: 0, depth: 2, taskName: 'Follow up action with Universal HMM Logistics', desc: 'Contact sales representative.', comments: 2, time: '22:10 PM'},
        { id: 9, escalated: 0, depth: 2, taskName: 'Follow up action with Acme Shipping', desc: 'Contact sales representative.', comments: 2, time: '22:10 PM'},
        { id: 10, escalated: 0, depth: 2, expanded: true, taskName: 'Follow up action with Residental Shipping Logistics ', desc: 'Contact sales representative.', comments: 2, time: '7:04 AM', children: [
          { id: 11, escalated: 0, depth: 3, taskName: 'Follow up action with Universal Shipping Logistics Customers', desc: 'Contact sales representative.', comments: 2, time: '14:10 PM'},
          { id: 12, escalated: 0, depth: 3, expanded: true,  taskName: 'Follow up action with Acme Universal Logistics Customers', desc: 'Contact sales representative.', comments: 2, time: '7:04 AM', children: [
            { id: 13, escalated: 0, depth: 4, taskName: 'More Contact', desc: 'Contact sales representative.', comments: 2, time: '14:10 PM'},
            { id: 14, escalated: 0, depth: 4, taskName: 'More Follow up', desc: 'Contact sales representative.', comments: 2, time: '7:04 AM'},
          ]},
        ]}
      ]}
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
    next();
  });

  //Ajax Accordion Contents
  router.get('/api/nav-items', function(req, res, next) {
    res.render('tests/accordion/_ajax-results.html');
    next();
  });

  // TODO: Make this work with XSS to return a copy of the SoHo Site Search Results for testing the Modal Search plugin.
  // Calls out to Craft CMS's search results page.
  // NOTE: Doesn't actually get rendered, just passed along.
  router.post('/api/site-search', function(req, res) {
    var opts = {
      host: 'usmvvwdev53',
      port: '80',
      path: '/search/results', // ?q=[SEARCH TERM GOES HERE]
      method: 'POST',
      headers: req.headers
    },
    creq = http.request(opts, function(cres) {
      // set encoding
      cres.setEncoding('utf8');

      // wait
      cres.on('data', function(chunk){
        res.write(chunk);
      });

      cres.on('close', function(){
        // closed, let's end client request as well
        res.writeHead(cres.statusCode);
        res.end();
      });

      cres.on('end', function(){
        // finished, let's finish client request as well
        res.writeHead(cres.statusCode);
        res.end();
      });

    }).on('error', function() {
      // we got an error, return 500 error to client and log error
      res.writeHead(500);
      res.end();
    });

    creq.end();
  });

  //Data Grid Paging Example
  // Example Call: http://localhost:4000/api/compressors?pageNum=1&sort=productId&pageSize=100
  router.get('/api/compressors', function(req, res, next) {

    var products = [], productsAll = [],
      start = (req.query.pageNum -1) * req.query.pageSize,
      end = req.query.pageNum * req.query.pageSize,
      total = 1000, i = 0, j = 0, filteredTotal = 0, seed = 1,
      statuses = ['OK', 'On Hold', 'Inactive', 'Active', 'Late' ,'Complete'];

    //TODO: if (req.query.filter) {
    for (j = 0; j < total; j++) {
      var filteredOut = false;

      //Just filter first two cols
      if (req.query.filter) {
        var term = req.query.filter.replace('\'','');
        filteredOut = true;

        if ((214220+j).toString().indexOf(term) > -1) {
          filteredOut = false;
        }

        if ('Compressor'.toString().toLowerCase().indexOf(term) > -1) {
          filteredOut = false;
         }

        if ('Assemble Paint'.toString().toLowerCase().indexOf(term) > -1) {
          filteredOut = false;
        }

        if ((1+(j/2)).toString().indexOf(term) > -1) {
          filteredOut = false;
        }
      }

      var status = Math.floor(statuses.length / (start + seed)) + 1;

      if (!filteredOut) {
        filteredTotal++;
        productsAll.push({ id: j, productId: 214220+j, productName: 'Compressor ' + (seed + start), activity:  'Assemble Paint', quantity: 1+(j/2), price: 210.99-j, status: statuses[status], orderDate: new Date(2014, 12, seed), action: 'Action'});
      }
      seed ++;
      if (seed > 10) {
        seed = 1;
      }
    }

    var sortBy = function(field, reverse, primer){
       var key = function (x) {return primer ? primer(x[field]) : x[field];};

       return function (a,b) {
        var A = key(a), B = key(b);
        return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];
       };
    };

    if (req.query.sortId) {
      productsAll.sort(sortBy(req.query.sortId, (req.query.sortAsc ==='true' ? true : false), function(a){return a.toString().toUpperCase();}));
    }

    for (i = start; i < end && i < total; i++) {
      products.push(productsAll[i]);
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({total: filteredTotal, data: products}));
    next();
  });

  router.get('/api/lookupInfo', function(req, res, next) {
    var columns = [],
      data = [];

    // Some Sample Data
    data.push({ id: 1, productId: 2142201, productName: 'Compressor', activity:  'Assemble Paint', quantity: 1, price: 210.99, status: 'OK', orderDate: new Date(2014, 12, 8), action: 'Action'});
    data.push({ id: 2, productId: 2241202, productName: 'Different Compressor', activity:  'Inspect and Repair', quantity: 2, price: 210.99, status: '', orderDate: new Date(2015, 7, 3), action: 'On Hold'});
    data.push({ id: 3, productId: 2342203, productName: 'Compressor', activity:  'Inspect and Repair', quantity: 1, price: 120.99, status: null, orderDate: new Date(2014, 6, 3), action: 'Action'});
    data.push({ id: 4, productId: 2445204, productName: 'Another Compressor', activity:  'Assemble Paint', quantity: 3, price: 210.99, status: 'OK', orderDate: new Date(2015, 3, 3), action: 'Action'});
    data.push({ id: 5, productId: 2542205, productName: 'I Love Compressors', activity:  'Inspect and Repair', quantity: 4, price: 210.99, status: 'OK', orderDate: new Date(2015, 5, 5), action: 'On Hold'});
    data.push({ id: 5, productId: 2642205, productName: 'Air Compressors', activity:  'Inspect and Repair', quantity: 41, price: 120.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'On Hold'});
    data.push({ id: 6, productId: 2642206, productName: 'Some Compressor', activity:  'inspect and Repair', quantity: 41, price: 123.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'On Hold'});

    //Define Columns for the Grid.
    columns.push({ id: 'selectionCheckbox', sortable: false, resizable: false, width: 50, formatter: 'SelectionCheckbox', align: 'center'});
    columns.push({ id: 'productId', name: 'Product Id', field: 'productId', width: 140, formatter: 'Readonly'});
    columns.push({ id: 'productName', name: 'Product Name', sortable: false, field: 'productName', width: 250, formatter: 'Hyperlink'});
    columns.push({ id: 'activity', hidden: true, name: 'Activity', field: 'activity', width: 125});
    columns.push({ id: 'quantity', name: 'Quantity', field: 'quantity', width: 125});
    columns.push({ id: 'price', name: 'Price', field: 'price', width: 125, formatter: 'Decimal'});
    columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', formatter: 'Date', dateFormat: 'M/d/yyyy'});

    var lookupInfo = [{ columns: columns, dataset: data}];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(lookupInfo));
    next();
  });

  // Used for Builder Pattern Example
  router.get('/api/construction-orders', function(req, res, next) {
    var companies = [
      { id: 1, orderId: '4231212-3', items: 0, companyName: 'John Smith Construction', total: '$0.00' },
      { id: 2, orderId: '1092212-3', items: 4, companyName: 'Top Grade Construction', total: '$10,000.00' },
      { id: 3, orderId: '6721212-3', items: 0, companyName: 'Riverhead Building Supply', total: '$0.00' },
      { id: 4, orderId: '6731212-3', items: 37, companyName: 'United Starwars Construction', total: '$22,509.99' },
      { id: 5, orderId: '5343890-3', items: 8, companyName: 'United Construction', total: '$1,550.00' },
      { id: 6, orderId: '4989943-3', items: 156, companyName: 'Top Grade-A Construction', total: '$800.00' },
      { id: 7, orderId: '8972384-3', items: 10, companyName: 'Top Grade Construction', total: '$1,300.00' },
      { id: 8, orderId: '2903866-3', items: 96, companyName: 'Top Grade-A Construction', total: '$1,900.00' }
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(companies));
    next();
  });

  router.get('/api/construction-cart-items', function(req, res, next) {
    var cartItems = [
      { id: 1, itemId: '#PMS0510', itemName: 'Masonry Bricks, Red Solid 6" Brick', itemPrice: '$12.00', quantifier: 'bag', quantity: '1,000', totalPrice: '$1,700.00' },
      { id: 2, itemId: '#PMS0640', itemName: 'Gravel, Gray Natural Stone', itemPrice: '$86.00', quantifier: 'stone', quantity: '19', totalPrice: '$1,634.00' },
      { id: 3, itemId: '#PMS0510', itemName: 'Masonry Bricks, Red Solid 6" Brick', itemPrice: '$12.00', quantifier: 'bag', quantity: '1,000', totalPrice: '$1,700.00' },
      { id: 4, itemId: '#PMS0640', itemName: 'Gravel, Gray Natural Stone', itemPrice: '$86.00', quantifier: 'stone', quantity: '19', totalPrice: '$1,634.00' },
      { id: 5, itemId: '#PMS0510', itemName: 'Masonry Bricks, Red Solid 6" Brick', itemPrice: '$12.00', quantifier: 'bag', quantity: '1,000', totalPrice: '$1,700.00' },
      { id: 6, itemId: '#PMS0640', itemName: 'Gravel, Gray Natural Stone', itemPrice: '$86.00', quantifier: 'stone', quantity: '19', totalPrice: '$1,634.00' },
      { id: 7, itemId: '#PMS0510', itemName: 'Masonry Bricks, Red Solid 6" Brick', itemPrice: '$12.00', quantifier: 'bag', quantity: '1,000', totalPrice: '$1,700.00' },
      { id: 8, itemId: '#PMS0640', itemName: 'Gravel, Gray Natural Stone', itemPrice: '$86.00', quantifier: 'stone', quantity: '19', totalPrice: '$1,634.00' }
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cartItems));
    next();
  });

  router.get('/api/orgstructure', function(req, res, next) {
    var
      menPath = 'https://randomuser.me/api/portraits/med/men/',
      womenPath = 'https://randomuser.me/api/portraits/med/women/' ,
      orgdata =   [{
      id: '1', Name: 'Jonathan Cargill', Position: 'Director', EmploymentType: 'FT', Picture: menPath +'2.jpg',
      children:[
        { id: '1_1', Name: 'Partricia Clark', Position: 'Administration',     EmploymentType: 'FT', Picture: womenPath +'4.jpg', isLeaf:true},
        { id: '1_2', Name: 'Drew Buchanan',   Position: 'Assistant Director', EmploymentType: 'FT', Picture: menPath + '5.jpg', isLeaf:true},
        { id: '1_3', Name: 'Kaylee Edwards',  Position: 'Records Manager',    EmploymentType: 'FT', Picture: womenPath +'11.jpg',
          children:[
            { id: '1_3_1', Name: 'Tony Cleveland',    Position: 'Records Clerk', EmploymentType: 'C',  Picture: menPath + '6.jpg', isLeaf:true},
            { id: '1_3_2', Name: 'Julie Dawes',       Position: 'Records Clerk', EmploymentType: 'PT', Picture: womenPath +'5.jpg', isLeaf:true},
            { id: '1_3_3', Name: 'Richard Fairbanks', Position: 'Records Clerk', EmploymentType: 'FT', Picture: menPath + '7.jpg', isLeaf:true}
          ]
        },
        { id: '1_4', Name: 'Jason Ayers', Position: 'HR Manager', EmploymentType: 'FT', Picture: menPath + '12.jpg',
          children:[
            { id: '1_4_1', Name: 'William Moore',    Position: 'Benefits Specialist',   EmploymentType: 'FT', Picture: menPath + '8.jpg', isLeaf:true},
            { id: '1_4_2', Name: 'Rachel Smith',     Position: 'Compliance Specialist', EmploymentType: 'FT', Picture: womenPath +'6.jpg', isLeaf:true},
            { id: '1_4_3', Name: 'Jessica Peterson', Position: 'Employment Specialist', EmploymentType: 'FT', Picture: womenPath +'7.jpg', isLeaf:true},
            { id: '1_4_4', Name: 'Sarah Lee',        Position: 'HR Specialist',         EmploymentType: 'FT', Picture: womenPath +'8.jpg', isLeaf:true},
            { id: '1_4_5', Name: 'Jacob Williams',   Position: 'HR Specialist',         EmploymentType: 'FT', Picture: menPath + '9.jpg', isLeaf:true}
          ]
        },
        { id: '1_5', Name: 'Daniel Calhoun',  Position: 'Manager', EmploymentType: 'FT', Picture: menPath + '4.jpg',
          children:[
            { id: '1_5_1', Name: 'Michael Bolton', Position: 'Software Engineer',           EmploymentType: 'C',  Picture: menPath + '3.jpg',  isLeaf:true},
            { id: '1_5_2', Name: 'Emily Johnson',  Position: 'Senior Software Engineer',    EmploymentType: 'FT', Picture: womenPath +'9.jpg',  isLeaf:true},
            { id: '1_5_3', Name: 'Kari Anderson',  Position: 'Principle Software Engineer', EmploymentType: 'FT', Picture: womenPath +'10.jpg', isLeaf:true},
            { id: '1_5_4', Name: 'Michelle Bell',  Position: 'Software Engineer',           EmploymentType: 'PT', Picture: womenPath +'11.jpg', isLeaf:true},
            { id: '1_5_5', Name: 'Dave Davidson',  Position: 'Software Engineer',           EmploymentType: 'FT', Picture: menPath + '10.jpg', isLeaf:true}
          ]
        },
        { id: '1_6', Name: 'Amber Carter', Position: 'Library Manager', EmploymentType: 'FT', Picture: womenPath +'2.jpg',
          children:[
            { id: '1_6_1', Name: 'Hank Cruise', Position: 'Law Librarian', EmploymentType: 'C',  Picture: menPath + '11.jpg', isLeaf:true},
            { id: '1_6_2', Name: 'Peter Craig', Position: 'Law Librarian', EmploymentType: 'FT', Picture: menPath + '12.jpg', isLeaf:true}
          ]
        },
        { id: '1_7', Name: 'Mary Butler',  Position: 'Workers’ Compensation Manager', EmploymentType: 'FT', Picture: womenPath +'3.jpg',
          children:[
            { id: '1_7_1', Name: 'Katie Olland',  Position: 'Workers’ Compensation Specialist', EmploymentType: 'FT', Picture: womenPath +'12.jpg', isLeaf:true},
            { id: '1_7_2', Name: 'Tanya Wright',  Position: 'Workers’ Compensation Specialist', EmploymentType: 'FT', Picture: womenPath +'13.jpg', isLeaf:true},
            { id: '1_7_3', Name: 'OPEN', Position: 'Workers’ Compensation Specialist', EmploymentType: 'O', isLeaf:true}
          ]
        }
      ]
    }];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(orgdata));
    next();
  });

  router.get('/api/servicerequests', function(req, res, next) {
    var cartItems = [
      { id: 1, type: 'Data Refresh', favorite: true, datetime: new Date(2014, 12, 8), requestor: 'Grant Lindsey', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'},
      { id: 2, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Wilson Shelton', deployment: 'AutoSuite-OD', scheduled: null, status: 'Success'},
      { id: 3, type: 'Data Refresh', favorite: true, datetime: new Date(2015, 12, 8), requestor: 'Nicholas Wade', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'},
      { id: 4, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Lila Huff', deployment: 'AutoSuite-OD', scheduled: new Date(2015, 12, 10), status: 'Queued'},
      { id: 5, type: 'Data Refresh', datetime: new Date(2015, 12, 8), requestor: 'Ann Matthews', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'},
      { id: 6, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Lucia Nelson', deployment: 'AutoSuite-OD', scheduled: null, status: 'Success'},
      { id: 7, type: 'Data Refresh', datetime: new Date(2014, 12, 8), requestor: 'Vera Cunningham', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'},
      { id: 8, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Dale Newman', deployment: 'AutoSuite-OD', scheduled: new Date(2015, 12, 10), status: 'Queued'},
      { id: 9, type: 'Data Refresh', datetime: new Date(2015, 12, 8), requestor: 'Jessica Cain', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'},
      { id: 10, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Jennie Kennedy', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'},
      { id: 11, type: 'Data Refresh', datetime: new Date(2015, 12, 8), requestor: 'Jason Adams', deployment: 'AutoSuite-OD', scheduled: null, status: 'Success'}
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cartItems));
    next();
  });

  router.get('/api/garbage', function(req, res, next) {
    var amount = 25,
      text = '',
      garbageWords = ['garbage', 'junk', 'nonsense', 'trash', 'rubbish', 'debris', 'detritus', 'filth', 'waste', 'scrap', 'sewage', 'slop', 'sweepings', 'bits and pieces', 'odds and ends', 'rubble', 'clippings', 'muck'];

    function done(content) {
      res.setHeader('Content-Type', 'text/plain');
      res.end(JSON.stringify(content));
      next();
    }

    if (req && req.query && req.query.size) {
      amount = req.query.size;
    }

    // Get a random word from the GarbageWords array
    var word = '';
    for (var i = 0; i < amount; i++) {
      word = garbageWords[Math.floor(Math.random() * garbageWords.length)];

      if (!text.length) {
        word = word.charAt(0).toUpperCase() + word.substr(1);
      } else {
        text += ' ';
      }
      text += word;
    }

    done(text);
  });

  router.get('/api/deployments', function(req, res, next) {
    var cartItems = [
      { id: 1, success: true, name: 'AutoSuite - PRD', date: '01-13-2015'},
      { id: 2, success: true, name: 'AutoSuite - TEST', date: '01-13-2015'},
      { id: 3, success: true, name: 'Deployment 3', date: '01-13-2015'},
      { id: 4, success: false, name: 'Deployment 4', date: '01-13-2015'},
      { id: 5, success: true, name: 'Deployment 5', date: '01-13-2015'}
     ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cartItems));
    next();
  });

  router.get('/api/general/status-codes', function(req, res, next) {
    var statusCodes = [
      { id: 0, name: 'Archived', color: 'graphite03' },
      { id: 1, name: 'Inactive', color: 'graphite03' },
      { id: 2, name: 'Active', color: 'info' },
      { id: 3, name: 'Late', color: 'error' },
      { id: 4, name: 'On Hold', color: 'alert' },
      { id: 5, name: 'Complete', color: 'good' }
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(statusCodes));
    next();
  });

  router.get('/api/my-projects', function(req, res, next) {
    var data = [
      { id: 0, name: '8 Mile Resurfacing', client: 'City of Detroit', status: 4, totalBudget: 300000, spentBudget: 125000 },
      { id: 1, name: 'Bishop Park', client: 'City of Detroit', status: 5, totalBudget: 250000, spentBudget: 249000 },
      { id: 2, name: 'Fort Woods Swimming Pool', client: 'City of Dearborn', status: 3, totalBudget: 500000, spentBudget: 13000 },
      { id: 3, name: 'Maplewood St. Resurfacing', client: 'Garden City', status: 2, totalBudget: 400000, spentBudget: 200000 },
      { id: 4, name: 'Middle School Parking Lot', client: 'Cinnaminson Township', status: 0, totalBudget: 240000, spentBudget: 0 },
      { id: 5, name: 'Wood Park Tennis Court', client: 'Cinnaminson Township', status: 2, totalBudget: 30000, spentBudget: 4000 },
      { id: 6, name: 'Beechtree Dr. Resurfacing', client: 'Cinnaminson Township', status: 1, totalBudget: 40000, spentBudget: 12000 },
      { id: 7, name: 'Track Resurfacing', client: 'Maple Shade Boro', status: 5, totalBudget: 10000, spentBudget: 10000 },
      { id: 8, name: '8 Mile Resurfacing', client: 'City of Detroit', status: 4, totalBudget: 300000, spentBudget: 125000 },
      { id: 9, name: 'Bishop Park', client: 'City of Detroit', status: 5, totalBudget: 250000, spentBudget: 249000 },
      { id: 10, name: 'Fort Woods Swimming Pool', client: 'City of Dearborn', status: 3, totalBudget: 500000, spentBudget: 13000 },
      { id: 11, name: 'Maplewood St. Resurfacing', client: 'Garden City', status: 2, totalBudget: 400000, spentBudget: 200000 },
      { id: 12, name: 'Middle School Parking Lot', client: 'Cinnaminson Township', status: 0, totalBudget: 240000, spentBudget: 0 },
      { id: 13, name: 'Wood Park Tennis Court', client: 'Cinnaminson Township', status: 2, totalBudget: 30000, spentBudget: 4000 },
      { id: 14, name: 'Beechtree Dr. Resurfacing', client: 'Cinnaminson Township', status: 1, totalBudget: 40000, spentBudget: 12000 },
      { id: 15, name: 'Track Resurfacing', client: 'Maple Shade Boro', status: 5, totalBudget: 10000, spentBudget: 10000 },
      { id: 16, name: '8 Mile Resurfacing', client: 'City of Detroit', status: 4, totalBudget: 300000, spentBudget: 125000 },
      { id: 17, name: 'Bishop Park', client: 'City of Detroit', status: 5, totalBudget: 250000, spentBudget: 249000 },
      { id: 18, name: 'Fort Woods Swimming Pool', client: 'City of Dearborn', status: 3, totalBudget: 500000, spentBudget: 13000 },
      { id: 19, name: 'Maplewood St. Resurfacing', client: 'Garden City', status: 2, totalBudget: 400000, spentBudget: 200000 },
      { id: 20, name: 'Middle School Parking Lot', client: 'Cinnaminson Township', status: 0, totalBudget: 240000, spentBudget: 0 },
      { id: 21, name: 'Wood Park Tennis Court', client: 'Cinnaminson Township', status: 2, totalBudget: 30000, spentBudget: 4000 },
      { id: 22, name: 'Beechtree Dr. Resurfacing', client: 'Cinnaminson Township', status: 1, totalBudget: 40000, spentBudget: 12000 },
      { id: 23, name: 'Track Resurfacing', client: 'Maple Shade Boro', status: 5, totalBudget: 10000, spentBudget: 10000 }
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    next();
  });

  router.get('/api/companies', function(req, res, next) {
    var companies = [
      { id: 1, companyName: 'Alexandar Gravel & Stone', phone: '414-821-0697', location: 'Terrencefort, TX', contact: 'Lida Snyder', customerSince: '04/25/2016', favorite: true },
      { id: 2, companyName: 'Briar Valley Gravel', phone: '702-389-9973', location: 'Davontemouth, UT', contact: 'Bull Cunningham', customerSince: '05/02/2016'  },
      { id: 3, companyName: 'Riverhead Building Supply', phone: '929-769-3984', location: 'Hermistonhaven, AZ', contact: 'Johnny Fields', customerSince: '08/28/2016', favorite: true  },
      { id: 4, companyName: 'Gravel Corp', phone: '299-166-7016', location: 'North Beau, NV', contact: 'Nina Mendez', customerSince: '01/25/2015'  },
      { id: 5, companyName: 'United Construction', phone: '299-166-7016', location: 'New Abdul, TX', contact: 'Paul Strayer', customerSince: '04/21/2016' },
      { id: 6, companyName: 'Gravel, Gravel, Gravel', phone: '299-166-7067', location: 'Smithsville, UT', contact: 'John Nasmith', customerSince: '06/25/2016'  },
      { id: 7, companyName: 'Stone Gravel Supply Company', phone: '202-504-5299', location: 'Ryesmith, AK', contact: 'Spring Adams', customerSince: '07/25/2015' },
   ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(companies));
    next();
  });

  router.get('/api/accounts', function(req, res, next) {
    var companies = [
      { id: 1, name: 'Abbott Ltd.', type: 'Hardware Customer', location: 'CA, USA', firstname: 'Jonathon', lastname: 'Hardy', phone: '(312) 555-7854'},
      { id: 2, name: 'Access GMBH', type: 'Hardware Customer', location: 'Germany', firstname: 'Coyle', lastname: 'Rita', phone: '+49 (897) 104-6155'},
      { id: 3, name: 'Ad Foods', type: 'Service Customer', location: 'OR, USA', firstname: 'Mike', lastname: 'Warneke', phone: '(503) 555-1358'},
      { id: 4, name: 'Adams Waste Systems', type: 'Hardware Prospect', location: 'FL, USA', firstname: 'Marc', lastname: 'Bianco', phone: '(924) 555-8609'},
      { id: 5, name: 'Advanced Billing Inc.', type: 'Service Customer', location: 'On, Canada', firstname: 'Bill', lastname: 'Elliot', phone: '(905) 555-8992'},
      { id: 6, name: 'Affiliated', type: 'Hardware Customer', location: 'Australia', firstname: 'Kelly', lastname: 'Sheri', phone: '+61 (029) 377-7044'},
      { id: 7, name: 'Akorn Lines', type: 'Service Customer', location: 'AZ, USA', firstname: 'Bill', lastname: 'Yolierie', phone: '(602) 922-2828'},
      { id: 8, name: 'Alexander Kan Ltd.', type: 'Service Customer', location: 'Germany', firstname: 'Neil', lastname: 'Amalfitano', phone: '+49 (894) 580-8913'},
      { id: 9, name: 'Alfa Quality', type: 'Service Customer', location: 'Spain', firstname: 'Teran', lastname: 'Sampson', phone: '+34 (932) 227-1103'},
      { id: 10, name: 'ALMI Electronic Associates', type: 'OEM Partner', location: 'Australia', firstname: 'Emily', lastname: 'Hali', phone: '+61 (293) 777-7030'},
      { id: 11, name: 'Alpert Fan Inc.', type: 'Service Prospect', location: 'IL, USA', firstname: 'Peter', lastname: 'Bates', phone: '(312) 555-8762)'},
      { id: 12, name: 'Alpha Data', type: 'Software Prospect', location: 'London, UK', firstname: 'Jim', lastname: 'Marzullo', phone: '+44(208) 708-4202'},
      { id: 13, name: 'Alphabet Data', type: 'Service Prospect', location: 'MD, USA', firstname: 'Greg', lastname: 'Winslow', phone: '828 308-4202'},
      { id: 14, name: 'Altus Outfitters LTD', type: 'Software Customer', location: 'Australia', firstname: 'Will', lastname: 'McCoy', phone: '+61(392) 747-2202'},
      { id: 15, name: 'Amalfitano B Inc', type: 'Hardware Prospect', location: 'Spain', firstname: 'Craig', lastname: 'Anderson', phone: '+34(233) 828-2202'},
      { id: 16, name: 'American Audio Inc.', type: 'Software Prospect', location: 'Mo, USA', firstname: 'Don', lastname: 'Shroeder', phone: '(252) 262-2821'},
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(companies));
    next();
  });

module.exports = app;
