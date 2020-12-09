const logger = require('../logger');
const setLayout = require('../set-layout');
const setImportStyle = require('../set-import-style');

// Option Handling - Custom Middleware
// Writes a set of default options the 'req' object.  These options are always eventually passed to the HTML template.
// In some cases, these options can be modified based on query parameters.  Check the default route for these options.
module.exports = function () {
  return function optionHandler(req, res, next) {
    // Change Locale (which also changes right-to-left text setting)
    if (req.query.locale && req.query.locale.length > 0) {
      res.opts.locale = req.query.locale;
      logger('info', `Changing Route Parameter "locale" to be "${res.opts.locale}".`);
    }

    // Global settings to change the layout.
    if (req.query.layout && req.query.layout.length > 0) {
      setLayout(req, res, `layout-${req.query.layout}.html`);
    }

    // Set the colorScheme
    // Fx: http://localhost:4000/controls/modal?colors=9279a6,ffffff
    if (req.query.colors && req.query.colors.length > 0) {
      res.opts.colors = req.query.colors;
      logger('info', `Setting Colors to ${res.opts.colors}`);
    }

    // Sets a simulated response delay for API Calls
    if (req.query.delay && !isNaN(req.query.delay) && req.query.delay.length > 0) { //eslint-disable-line
      res.opts.delay = req.query.delay;
    }

    // Uses the minified version of the Soho library instead of the uncompressed version
    // NOTE: see the `app/src/js/custom-route-options.js` middleware for where this
    // setting is translated into `window.SohoConfig`.
    if (req.query.minify && req.query.minify.length > 0) {
      setImportStyle(req, res, 'minify');
      res.opts.minify = true;
      logger('info', 'Using the minified version of "sohoxi.js" and culture files');
    }

    // Uses Flex Toolbars in headers
    if ((req.query.flextoolbar && req.query.flextoolbar.length > 0) ||
      (req.query.toolbarflex && req.query.toolbarflex.length > 0)) {
      res.opts.useFlexToolbar = true;
      logger('info', 'Using Flex Toolbars inside of page headers');
    }

    // Display the Header Hamburger (controls the App Menu).
    // This is not used by default due to deployment on `design.infor.com`, but may be
    // useful during development/testing.
    if (req.query.headerHamburger === 'true') {
      res.opts.headerHamburger = true;
    }

    // Loads the page without loading the D3 Library
    // See infor-design/enterprise#4668
    if (req.query.noD3 === 'true') {
      res.opts.noD3 = true;
      logger('info', 'Loading the page without the D3 graphics library');
    }

    // Opens the requested page with the App Menu drawer expanded.
    if (req.query.appMenuOpen === 'true') {
      res.opts.appMenuOpen = true;
    }

    let useLiveReload = false;
    process.argv.forEach((val) => {
      if (val === '--livereload') {
        useLiveReload = true;
      }
    });

    // Disable live reload for IE
    if (req.hostname === '10.0.2.2' && useLiveReload) {
      res.opts.enableLiveReloadVM = true;
      res.opts.enableLiveReload = false;
    }

    if (!useLiveReload) {
      res.opts.enableLiveReloadVM = false;
      res.opts.enableLiveReload = false;
    }

    next();
  };
};
