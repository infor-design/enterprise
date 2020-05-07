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

const chalk = require('chalk');
const app = require('./app');

// With the express server and routes defined, we can start to listen for requests.
const port = 4000;
app.listen(port);

// Show Awesome Image Of Soho
/* eslint-disable no-console */
console.log(chalk.gray('         .        .            ') + chalk.blue('|') + chalk.gray('       .        .        . '));
console.log(chalk.gray('              *        .       ') + chalk.blue('|') + chalk.gray('   .        .              '));
console.log(chalk.gray('        .                     ') + chalk.blue('/-\\') + chalk.gray('     .           .   .    '));
console.log(chalk.gray(' .               .    .      ') + chalk.blue('|"""|') + chalk.gray('                  ') + chalk.blue(':') + chalk.gray('       . '));
console.log(chalk.gray('         .                  ') + chalk.blue('/"""""\\') + chalk.gray('  .      *       ') + chalk.blue('|>.') + chalk.gray('    '));
console.log(chalk.gray('                           ') + chalk.blue('|') + chalk.yellow(' # # # ') + chalk.blue('|') + chalk.gray('     .        ') + chalk.blue('/\\|  ___ '));
console.log(chalk.blue('    __     ___   ___') + chalk.gray('   .   ') + chalk.blue('|') + chalk.yellow('# # # #') + chalk.blue('| ___      ___/<>\\ |:::|'));
console.log(chalk.blue('  / ""|  __|~~| |""|       |') + chalk.yellow('# # # #') + chalk.blue('||"""|  __|"""|^^| |:::|'));
console.log(chalk.blue(' /""""| |::|""|~~~~||_____ |') + chalk.yellow('# # # #') + chalk.blue('||"""|-|::|"""|""|_|   |'));
console.log(chalk.blue(' |""""| |::|""|""""|:::::| |') + chalk.yellow('# # # #') + chalk.blue('||"""|t|::|"""|""|"""""|'));
console.log(chalk.blue(' |""""|_|  |""|""""|:::::| |') + chalk.yellow('# # # #') + chalk.blue('||"""|||::|"""|""""""""|'));
console.log(chalk.blue(' |""""|::::|""|""""|:::::| |') + chalk.yellow('# # # #') + chalk.blue('||"""|||::|"""|""""""""|'));

console.log('IDS server is running at http://localhost:%s/. Press Ctrl+C to stop.', port);
/* eslint-enable no-console */
