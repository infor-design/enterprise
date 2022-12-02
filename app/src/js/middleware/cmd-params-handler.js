import extend from 'extend';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import logger from '../logger.js';
import setLayout from '../set-layout.js';
import setImportStyle from '../set-import-style.js';

const argv = _yargs(hideBin(process.argv)).argv;

// Command Line/Terminal Paramter Handling - Custom Middleware
// This module checks possible terminal flags and sets some response options in those cases.
export default function (app, defaults) {
  return function cmdParamsHandler(req, res, next) {
    res.opts = extend({}, defaults);

    // Change Locale (which also changes right-to-left text setting)
    if (argv.locale && argv.locale.length > 0) {
      res.opts.locale = argv.locale;
      logger('info', `Using cmd flags to set locale to "${res.opts.locale}".`);
    }

    // Global settings to change the layout.
    if (argv.layout && argv.layout.length > 0) {
      setLayout(req, res, `layout-${argv.layout}.html`);
      logger('info', `Using cmd flags to set the page layout to "layout-${argv.layout}.html".`);
    }

    // Set the colorScheme
    // Fx: http://localhost:4000/controls/modal?colors=9279a6,ffffff
    if (argv.colors && argv.colors.length > 0) {
      res.opts.colors = argv.colors;
      logger('info', `Using cmd flags to set custom color scheme to ${res.opts.colors}`);
    }

    // Sets a simulated response delay for API Calls
    if (argv.delay && !isNaN(argv.delay) && argv.delay.length > 0) { //eslint-disable-line
      res.opts.delay = argv.delay;
    }

    // Uses the minified version of the Soho library instead of the uncompressed version
    // NOTE: see the `app/src/js/custom-route-options.js` middleware for where this
    // setting is translated into `window.SohoConfig`.
    if (argv.minify) {
      setImportStyle(req, res, 'minify');
      res.opts.minify = true;
      logger('info', 'Using the minified version of "sohoxi.js" and culture files');
    }

    // Uses Flex Toolbars in headers
    if ((argv.flextoolbar && argv.flextoolbar.length > 0) ||
      (argv.toolbarflex && argv.toolbarflex.length > 0)) {
      argv.useFlexToolbar = true;
      logger('info', 'Using Flex Toolbars inside of page headers');
    }

    // Loads the page without loading the D3 Library
    // See infor-design/enterprise#4668
    if (argv.noD3) {
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
    if (argv.hostname === '10.0.2.2' && useLiveReload) {
      res.opts.enableLiveReloadVM = true;
      res.opts.enableLiveReload = false;
    }

    if (!useLiveReload) {
      res.opts.enableLiveReloadVM = false;
      res.opts.enableLiveReload = false;
    }

    next();
  };
}
