#!/usr/bin/env node
/**
 * @fileoverview This script does:
 * 1. starts the IDS Enterprise Components Development Server
 *
 * @example `node ./server.js`
 * @example `node ./server.js --verbose`
 *
 * Flags:
 * --verbose       - Log all details
 * --livereload    - Enable livereload
 *
 * NOTE: More than likely there is a command in the package.json
 * to run this script with NPM.
 */

import app from './app.js';

// With the express server and routes defined, we can start to listen for requests.
const port = process.env.PORT || 4000;
app.listen(port);

/* eslint-disable no-console */
console.log('         .        .            |       .        .        . ');
console.log('              *        .       |   .        .              ');
console.log('        .                     /-\\     .           .   .    ');
console.log(' .               .    .      |"""|                  :       . ');
console.log('         .                  /"""""\\  .      *       |>.    ');
console.log('                           | # # # |     .        /\\|  ___ ');
console.log('    __     ___   ___   .   |# # # #| ___      ___/<>\\ |:::|');
console.log('  / ""|  __|~~| |""|       |# # # #||"""|  __|"""|^^| |:::|');
console.log(' /""""| |::|""|~~~~||_____ |# # # #||"""|-|::|"""|""|_|   |');
console.log(' |""""| |::|""|""""|:::::| |# # # #||"""|t|::|"""|""|"""""|');
console.log(' |""""|_|  |""|""""|:::::| |# # # #||"""|||::|"""|""""""""|');
console.log(' |""""|::::|""|""""|:::::| |# # # #||"""|||::|"""|""""""""|');

console.log('IDS server is running at http://localhost:%s/. Press Ctrl+C to stop.', port);
/* eslint-enable no-console */
