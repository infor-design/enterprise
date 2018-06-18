#!/usr/bin/env node

/* eslint-disable arrow-body-style, key-spacing, no-use-before-define, arrow-parens, no-console, import/no-dynamic-require, global-require, no-shadow, max-len, object-shorthand */
/**
 * @fileoverview This script will do a dated dev publish (aka nightly build) to NPM.
 *
 * It will automatically appended as today's date as YYYYMMDD
 * @example `node ./scripts/publish-nightly-manual.js
 *
 * You can specify a date to achieve a build like "4.8.0-dev.20180604"
 * @example `node ./scripts/publish-nightly-manual.js --increment=20180604
 *
 * When specifying the date and using NPM, make sure to add " -- " to pass the cli args through
 * @example npm run release:dev -- --increment=20180617
 */

// -------------------------------------
//   Node Modules/Options
// -------------------------------------
const argv = require('yargs').argv;
const releaseIt = require('release-it');
const slash = require('slash');
const { exec } = require('child_process');

// -------------------------------------
//   Constants
// -------------------------------------
const rootPath = slash(process.cwd());
const packageJson = require(`${rootPath}/package.json`);

const formatDate = (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('');
};

const todaysDate = formatDate(new Date());

const releaseOpts = {
  "dry-run": false,
  "requireCleanWorkingDir": true,
  "increment": `${packageJson.version}.${todaysDate}`,
  "non-interactive": false,
  "verbose": false,
  "pkgFiles": ["package.json"],
  "buildCommand": "npm run build",
  "src": {
    "beforeStartCommand": "npm run eslint:error-only",
    "afterReleaseCommand": "",
    "commit": false,
    "tag": false,
    "push": false
  },
  "npm": {
    "publish": true,
    "tag": "dev"
  },
  "github": {
    "release": false,
  }
}

if (argv.increment) {
  releaseOpts.increment = `${packageJson.version}.${argv.increment}`;
}

releaseIt(releaseOpts).then(output => {
  // output = { version, latestVersion, changelog }
  console.log(`Published nightly build to NPM as ${output.version}.`);

  exec('git checkout origin/master package.json', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log('Please manually reset your package.json file version');
      return;
    }
  });
});

