#!/usr/bin/env node

var fs = require('fs'),
	filename = 'package.json',
	file = require('../' + filename),
	version = process.env.bamboo_version || process.env.bamboo_jira_version;

if (!version) {
	console.log('[Error] Either bamboo_version or bamboo_jira_version ENV must be set.');
	process.exit(1);
} else if (version === file.version) {
  console.log('[Error] New version cannot match current version.');
	process.exit(1);
} else {
  file.version = version;
}

fs.writeFile(filename, JSON.stringify(file, null, 2), function () {
  console.log('[Info] Updated version to:' + file.version);
});
