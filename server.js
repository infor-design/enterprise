var app = require('./app');
// With the express server and routes defined, we can start to listen for requests.
var port = process.env.PORT || 4000;
app.listen(port);

//Show Awesome Image Of Soho
console.log('         .        .            |       .        .        . '.green);
console.log('              *        .       |   .        .              '.green);
console.log('        .                     /-\\     .           .   .    '.green);
console.log(' .               .    .      |"""|              :        . '.green);
console.log('         .                  /"""""\\  .      *       |>.    '.green);
console.log('                           | # # # |     .        /\\|  ___ '.green);
console.log('    __     ___   ___   .   |# # # #| ___      ___/<>\\ |:::|'.green);
console.log('  / ""|  __|~~| |""|       |# # # #||"""|  __|"""|^^| |:::|'.green);
console.log(' /""""| |::|""|~~~~||_____ |# # # #||"""|-|::|"""|""|_|   |'.green);
console.log(' |""""| |::|""|""""|:::::| |# # # #||"""|t|::|"""|""|"""""|'.green);
console.log(' |""""|_|  |""|""""|:::::| |# # # #||"""|||::|"""|""""""""|'.green);
console.log(' |""""|::::|""|""""|:::::| |# # # #||"""|||::|"""|""""""""|'.green);

console.log('Soho server is running at http://localhost:%s/. Press Ctrl+C to stop.', port);
