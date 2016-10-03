#!/usr/bin/env node

var fs = require('fs'),
	filename = 'package.json',
	file = require('../' + filename),
	tag = process.env.bamboo_npm_tag || process.argv[2];

if (!file.version.includes(tag)) {
	file.version = file.version + '-' + tag;
}

fs.writeFile(filename, JSON.stringify(file, null, 2), function (err) {
	if (err) return console.log(err);
	console.log('[Info] Updated version to:' + file.version);
});
