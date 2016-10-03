#!/usr/bin/env node

var fs = require('fs'),
	filename = 'package.json',
	file = require('../' + filename),
	version = process.env.bamboo_jira_version || process.env.bamboo_version;

if (!version) {
	console.log('[Error] Either bamboo_jira_version or bamboo_version ENV var must be set.');
	process.exit(1);
} else {
  file.version = version;
}

fs.writeFile(filename, JSON.stringify(file, null, 2), function (err) {
	if (err) return console.log(err);
	console.log('[Info] Updated version to: ' + file.version);
});
