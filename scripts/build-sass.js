// -------------------------------------
// Requirements
// -------------------------------------
const path = require('path');
const sass = require('node-sass');
const getDirName = require('path').dirname;

const config = require('./configs/sass').sass;
const logger = require('./logger');
const createDirs = require('./build/create-dirs');
const writeFile = require('./build/write-file');

// -------------------------------------
// Functions
// -------------------------------------
function compileSass(options = {}) {
  // set default options
  options = Object.assign({
    style: 'expanded'
  }, options);

  // Render the CSS/Map result
  const result = sass.renderSync(options);
  const fileWritePromises = [];

  // Build directories
  createDirs([getDirName(options.outFile)]);

  // Write the result to file
  fileWritePromises.push(writeFile(options.outFile, result.css).then((err) => {
    if (err) {
      logger('error', `Error: ${err}`);
    }
    logger('success', `${options.outFile} built.`);
  }));

  // Write a sourcemap file, if applicable
  if (result.map) {
    const sourcemapFileName = `${options.outFile}.map`;
    fileWritePromises.push(writeFile(sourcemapFileName, result.map).then((err) => {
      if (err) {
        logger('error', `Error: ${err}`);
      }
      logger('success', `${sourcemapFileName} built.`);
    }));
  }

  return fileWritePromises;
}

// -------------------------------------
// Main
// -------------------------------------

const targetTask = config.dist;
const files = Object.keys(targetTask.files);

const renderPromises = [];

files.forEach((file) => {
  let options = {
    file: path.resolve(targetTask.files[file]),
    outFile: path.resolve(file)
  };

  if (targetTask.options) {
    options = Object.assign(targetTask.options, options);
  }

  renderPromises.push(compileSass(options));
});

/*
compileSass({
  src: 'assets/scss/example.scss',
  dest: 'dist/css/example.min.css',
  style: 'compressed'
});
*/
