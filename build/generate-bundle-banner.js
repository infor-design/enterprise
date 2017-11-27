const fs = require('fs');
const git = require('git-rev-sync');
const path = require('path');
const moment = require('moment');
const license = fs.readFileSync(path.join( __dirname, '..', 'LICENSE.md'), ['utf-8']);

let version = 'Soho XI Controls v' + git.tag([true]);
let date = 'Date: ' + moment().format('DD/MM/YYYY, h:mm:ss a');
let revision = 'Revision: ' + git.long();

module.exports = version + '\n' +
  date + '\n' +
  revision + '\n' +
  '\n' +
  license + '\n';
