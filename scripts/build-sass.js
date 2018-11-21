// Requirements
const sass = require('node-sass');
const getDirName = require('path').dirname;

const logger = require('./logger');
const createDirs = require('./build/create-dirs');
const writeFile = require('./build/write-file');

function compileSass(options = {}) {
  // set default options
  options = Object.assign({
    style: 'expanded'
  }, options);

  // render the result
  const result = sass.renderSync({
    file: options.src,
    outputStyle: options.style
  });

  // Build directories
  createDirs(getDirName(options.dest));

  // Write the result to file
  writeFile(options.dest, result.css).then((err) => {
    if (err) {
      logger('error', `Error: ${err}`);
    }
    logger('success', `${options.dest} built.`);
  });
}

// Expanded
compileSass({
  src: 'assets/scss/example.scss',
  dest: 'dist/css/example.css'
});

// Minified
compileSass({
  src: 'assets/scss/example.scss',
  dest: 'dist/css/example.min.css',
  style: 'compressed'
});
