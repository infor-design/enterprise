#!/usr/bin/env node

/**
 * IDS Enterprise Build Verification
 * When a build is finished, this script double-checks the output in the `/dist`
 * folder to ensure that all expected files are present.
 */
import * as fs from 'fs';
import glob from 'glob';
import * as path from 'path';
import slash from 'slash';
import { hideBin } from 'yargs/helpers';
import _yargs from 'yargs';

// Locals
import createDirs from './build/create-dirs.js';
import logger from './logger.js';
import writeFile from './build/write-file.js';

const yargs = _yargs(hideBin(process.argv));

const argv = await yargs
  .usage('Usage: $node ./scripts/verify.js [-v] [-r]')
  .option('verbose', {
    alias: 'v',
    describe: 'Adds additional logging for more information',
    default: false
  })
  .option('rebuild', {
    alias: 'r',
    describe: 'Rebuilds the file list against a changed `/dist` folder',
    default: false
  })
  .help('h')
  .alias('h', 'help')
  .argv;

// Lists
const rootPath = slash(process.cwd());
const paths = {
  dist: `${rootPath}/dist`
};
const globOptions = {
  ignore: `${paths.dist}/tmp/**/*`
};

const foundFiles = [];
const foundFolders = [];

// -------------------------------------
// Functions
// -------------------------------------
function isDirectory(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.isDirectory();
  } catch (err) {
    logger('error', err);
    return false;
  }
}

// -------------------------------------
// Main
// -------------------------------------

if (argv.rebuild) {
  logger('info', `Creating a new ${'expected-files.json'} list...`);
} else {
  logger('info', 'Verifying the last build...');
}

// Load expected files list.
// If the file doesn't exist, this script can't continue.
const expectedFilesListPath = path.join(process.cwd(), 'scripts', 'data', 'expected-files.json');
let expectedFiles;
try {
  expectedFiles = JSON.parse(fs.readFileSync(expectedFilesListPath, 'utf8'));
} catch (err) {
  if (!argv.rebuild) {
    logger('error', `No files list available at "${expectedFilesListPath}".`);
    logger('padded', 'Please re-run this script with the "--rebuild" flag to generate agaist the current distributable.');
    process.exit(1);
  }

  logger('alert', `No files list available at "${expectedFilesListPath}".`);
}

// Do a file glob against `/dist`.
glob(`${paths.dist}/**/*`, globOptions, (err, files) => {
  if (err) {
    logger('error', err);
    return;
  }

  // Sort results into files vs. folders
  files.forEach((file) => {
    const relativePath = slash(file).replace(rootPath, '');
    if (isDirectory(file)) {
      foundFolders.push(relativePath);
    } else {
      foundFiles.push(relativePath);
    }
  });

  // Log Folders
  logger('padded', `${`folders: ${foundFolders.length}`}`);

  // Log Files
  logger('padded', `${`files: ${foundFiles.length}`}`);
  if (argv.verbose) {
    foundFiles.forEach((file) => {
      logger('padded', `${file}`);
    });
  }

  // Save a new list, if applicable
  if (argv.rebuild) {
    // Write all files to a... file...
    const filesListTxt = JSON.stringify(foundFiles, null, '\t');

    // Create Dirs
    const outputPath = path.join(process.cwd(), 'scripts', 'data', 'expected-files.json');
    createDirs([
      path.join(process.cwd(), 'dist'),
      path.join(process.cwd(), 'dist', 'tmp')
    ]);

    // Save new file
    writeFile(outputPath, filesListTxt).then(() => {
      logger('beer', `New file list saved to "${outputPath}"`);
      process.exit(0);
    });
    return;
  }

  // Get the difference between the expected list and the found list
  const missingFiles = expectedFiles.filter(x => !foundFiles.includes(x));

  // If files are missing, print each of them and exit.
  if (missingFiles.length) {
    logger('error', `${`(${missingFiles.length})`} expected files are missing from the last build:`);
    missingFiles.forEach((file) => {
      logger('padded', `${file}`);
    });
    process.exit(1);
  }

  logger('beer', `All ${`(${expectedFiles.length})`} expected files have been found!`);
  process.exit(0);
});
