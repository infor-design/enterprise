const extend = require('extend');

const commandLineArgs = require('yargs').argv;

const logger = require('../logger');
const setLayout = require('../set-layout');
const setImportStyle = require('../set-import-style');

// Command Line/Terminal Paramter Handling - Custom Middleware
// This module checks possible terminal flags and sets some response options in those cases.
module.exports = function (app, defaults) {
  return function cmdParamsHandler(req, res, next) {
    res.opts = extend({}, defaults);

    // Change Locale (which also changes right-to-left text setting)
    if (commandLineArgs.locale && commandLineArgs.locale.length > 0) {
      res.opts.locale = commandLineArgs.locale;
      logger('info', `Using cmd flags to set locale to "${res.opts.locale}".`);
    }

    // Global settings to change the layout.
    if (commandLineArgs.layout && commandLineArgs.layout.length > 0) {
      setLayout(req, res, `layout-${commandLineArgs.layout}.html`);
      logger('info', `Using cmd flags to set the page layout to "layout-${commandLineArgs.layout}.html".`);
    }

    // Set the colorScheme
    // Fx: http://localhost:4000/controls/modal?colors=9279a6,ffffff
    if (commandLineArgs.colors && commandLineArgs.colors.length > 0) {
      res.opts.colors = commandLineArgs.colors;
      logger('info', `Using cmd flags to set custom color scheme to ${res.opts.colors}`);
    }

    // Sets a simulated response delay for API Calls
    if (commandLineArgs.delay && !isNaN(commandLineArgs.delay) && commandLineArgs.delay.length > 0) { //eslint-disable-line
      res.opts.delay = commandLineArgs.delay;
    }

    // Uses the minified version of the Soho library instead of the uncompressed version
    // NOTE: see the `app/src/js/custom-route-options.js` middleware for where this
    // setting is translated into `window.SohoConfig`.
    if (commandLineArgs.minify) {
      setImportStyle(req, res, 'minify');
      res.opts.minify = true;
      logger('info', 'Using the minified version of "sohoxi.js" and culture files');
    }

    // Uses Flex Toolbars in headers
    if ((commandLineArgs.flextoolbar && commandLineArgs.flextoolbar.length > 0) ||
      (commandLineArgs.toolbarflex && commandLineArgs.toolbarflex.length > 0)) {
      commandLineArgs.useFlexToolbar = true;
      logger('info', 'Using Flex Toolbars inside of page headers');
    }

    // Loads the page without loading the D3 Library
    // See infor-design/enterprise#4668
    if (commandLineArgs.noD3) {
      res.opts.noD3 = true;
      logger('info', 'Loading the page without the D3 graphics library');
    }

    let useLiveReload = false;
    process.argv.forEach((val) => {
      if (val === '--livereload') {
        useLiveReload = true;
      }
    });

    // Disable live reload for IE
    if (commandLineArgs.hostname === '10.0.2.2' && useLiveReload) {
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
