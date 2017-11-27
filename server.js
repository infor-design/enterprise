/* jshint node:true */

var app = require('./app');
var chalk = require('chalk');

// With the express server and routes defined, we can start to listen for requests.
var port = process.env.PORT || 4000;
app.listen(port);

//Show Awesome Image Of Soho
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
