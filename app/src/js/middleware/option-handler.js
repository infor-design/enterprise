const extend = require('extend');
const logger = require('../logger');
const path = require('path');

// Option Handling - Custom Middleware
// Writes a set of default options the 'req' object.  These options are always eventually passed to the HTML template.
// In some cases, these options can be modified based on query parameters.  Check the default route for these options.
module.exports = function (app, defaults) {
  return function optionHandler(req, res, next) {
    res.opts = extend({}, defaults);

    // Change Locale (which also changes right-to-left text setting)
    if (req.query.locale && req.query.locale.length > 0) {
      res.opts.locale = req.query.locale;
      logger('info', `Changing Route Parameter "locale" to be "${res.opts.locale}".`);
    }

    // Normally we will use an external file for loading SVG Icons and Patterns.
    // Setting 'inlineSVG' to true will use the deprecated method of using SVG icons, which was to bake them into the HTML markup.
    res.opts.inlineSVG = true;

    // Global settings for forcing a 'no frills' layout for test pages.
    // This means no header with page title, hamburger, theme swap settings, etc.
    if (req.query.nofrills && req.query.nofrills.length > 0) {
      res.opts.nofrillslayout = true;
      res.opts.layout = path.join(req.app.get('views'), 'layout-nofrills.html');
      logger('info', '"No-frills" layout active.');
    }

    // Set the theme and colorScheme
    // Fx: http://localhost:4000/controls/modal?colors=9279a6,ffffff&theme=dark
    if (req.query.theme && req.query.theme.length > 0) {
      res.opts.theme = req.query.theme;
      logger('info', `Setting Theme to ${res.opts.theme}`);
    } else {
      res.opts.theme = 'light';
    }

    if (req.query.colors && req.query.colors.length > 0) {
      res.opts.colors = req.query.colors;
      logger('info', `Setting Colors to ${res.opts.colors}`);
    }

    // Sets a simulated response delay for API Calls
    if (req.query.delay && !isNaN(req.query.delay) && req.query.delay.length > 0) {
      res.opts.delay = req.query.delay;
    }

    // Uses the minified version of the Soho library instead of the uncompressed version
    if (req.query.minify && req.query.minify.length > 0) {
      res.opts.minify = true;
      logger('info', 'Using the minified version of "sohoxi.js"');
    }

    if ((req.query.font && req.query.font.length > 0) || res.opts.theme === 'uplift-alpha') {
      res.opts.font = req.query.font;
      logger('info', `Using the ${req.query.font} font`);
    }

    if (res.opts.theme === 'uplift-alpha') {
      res.opts.font = true;
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
