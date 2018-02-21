const app = require('./app');
/* eslint-disable import/no-extraneous-dependencies */
const chalk = require('chalk');
/* eslint-enable import/no-extraneous-dependencies */

// With the express server and routes defined, we can start to listen for requests.
const port = process.env.PORT || 4000;
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

console.log('Soho server is running at http://localhost:%s/. Press Ctrl+C to stop.', port);
/* eslint-enable no-console */
