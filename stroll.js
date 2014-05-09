var app = require('./app');

// With the express server and routes defined, we can start to listen for requests.
var port = process.env.PORT || 4000;
app.locals.enableLiveReload = true;
app.listen(port);

//Show Ascii Art....
console.log('                ,@@@@@@@                '.green);
console.log('       %o%o   ,@@@@@@@@@@    88888    '.green);
console.log('    ,%o%o%o%o%@@@@@@@@@@@@ 88888888  '.green);
console.log('   ,%o%o%o%o%%@@@@@@@@@@@88888888888  '.green);
console.log('   %o%o%o%o%o%o%@@@@@@ @@@@88888888888  '.green);
console.log('   %o%o%o%o%o% @@@ V @@@   8888 8888     '.green);
console.log('    `%o% o%o%     | |        o| |o      '.green);
console.log('       |o|        | |         | |       '.green);
console.log('       |.|        | |         | |       '.green);
console.log('      """"""     """"""      """"""     '.green);
console.log('');
console.log('Gramercy Park server is now listening on port %s', port);
