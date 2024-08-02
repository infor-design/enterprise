#!/usr/bin/env node
/* eslint-disable no-underscore-dangle */

/**
 * NOTE: All source code files generated by this script run from a `temp` folder placed
 * in the project root.  This script uses relative paths to link to files in the `src` folder.
 * The paths in these generated files may vary from the regular files used.
 *
 * Custom Build Steps:
 *
 * 1. Generate a list of component source code files based on what we've provided
 *    in args.  No args == all components.
 * 2. Sort requested components into a few logical groups (TBD) to be imported/exported
 *    in a specific order (which matters).
 * 3. Render both of the following:
 *    - an `index.js` file with ES6-based import/export statements
 *    - an `index.scss` file with SASS-based import statements
 * 4. Pass these files into Rollup/Sass config and run the normal builds.
 * 5. Add the results of these builds to the `/dist` folder as usual.
 *
 * Order of included libraries matters per group:
 * - Core (required, can’t be removed)
 * - Behaviors (not required but will be added if required by bundled components)
 * - Rules Libraries (Mask, Validation, Datagrid) (not required unless these components are used)
 * - Patterns
 * - Layouts
 * - Foundational Components
 * - Mid-Level Components (includes Charts)
 * - Complex Components
 */
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import { glob } from 'glob';
import logger from './logger.js';
import createDirs from './build/create-dirs.js';
import getFileContents from './build/get-file-contents.js';
import runBuildProcess from './build/run-build-process.js';
import writeFile from './build/write-file.js';
import createSvgHtml from './build/create-svg-html.js';

import createColorJson from './build/create-color-json.js';

import IdsMetadata from './helpers/ids-metadata.js';

import bannerText from './generate-bundle-banner.js';

const yargs = _yargs(hideBin(process.argv));

const argv = await yargs
  .option('verbose', {
    alias: 'v',
    describe: 'Include extraneous logging information',
    default: false
  })
  .option('dry-run', {
    alias: 'd',
    describe: 'Run the script, skipping creation of files',
    default: false
  })
  .option('test-mode', {
    alias: 'T',
    describe: 'Run the script with preset components',
    default: false
  })
  .option('coverage', {
    alias: 'g',
    describe: 'Run the script adding coverage',
    default: false
  })
  .option('disable-css', {
    alias: 'c',
    describe: 'Disables the build process for CSS'
  })
  .option('disable-js', {
    alias: 'j',
    describe: 'Disables the build process for JS'
  })
  .option('disable-copy', {
    alias: 'p',
    describe: 'Disables the copying of all pre-built assets to the `/dist` folder'
  })
  .option('types', {
    alias: 't',
    describe: 'Provides a mechanism for building one or more Rollup bundle types when building IDS Javascript',
    default: false,
  })
  .argv;

const IDS_THEMES = new IdsMetadata().getThemes();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '..', 'src');
const TEMP_DIR = path.join(__dirname, '..', 'temp');
const TEST_DIR = path.join(__dirname, '..', 'test');
const RELATIVE_SRC_DIR = path.join('..', 'src');

// CR-LF on Windows, LF on Linux/Mac
const NL = process.platform === 'win32' ? '\r\n' : '\n';

const filePaths = {
  src: {
    js: {
      behaviors: path.join(SRC_DIR, 'behaviors', 'behaviors.js'),
      components: path.join(SRC_DIR, 'components', 'components.js'),
      index: path.join(SRC_DIR, 'index.js'),
      initialize: path.join(SRC_DIR, 'behaviors', 'initialize', 'initialize.js'),
      patterns: path.join(SRC_DIR, 'patterns', 'patterns.js'),
    },
    jQuery: {
      behaviors: path.join(SRC_DIR, 'behaviors', 'behaviors.jquery.js'),
      components: path.join(SRC_DIR, 'components', 'components.jquery.js'),
      initialize: path.join(SRC_DIR, 'behaviors', 'initialize', 'initialize.jquery.js'),
      patterns: path.join(SRC_DIR, 'patterns', 'patterns.jquery.js'),
    },
    sass: {
      controls: path.join(SRC_DIR, 'core', '_controls.scss'),
      controlsNew: path.join(SRC_DIR, 'core', '_controls-new.scss'),
      themes: {}
    }
  },
  target: {
    js: {
      behaviors: path.join(TEMP_DIR, 'behaviors.js'),
      components: path.join(TEMP_DIR, 'components.js'),
      index: path.join(TEMP_DIR, 'index.js'),
      initialize: path.join(TEMP_DIR, 'initialize.js'),
      patterns: path.join(TEMP_DIR, 'patterns.js'),
      rules: path.join(TEMP_DIR, 'rules.js')
    },
    jQuery: {
      behaviors: path.join(TEMP_DIR, 'behaviors.jquery.js'),
      components: path.join(TEMP_DIR, 'components.jquery.js'),
      initialize: path.join(TEMP_DIR, 'initialize.jquery.js'),
      patterns: path.join(TEMP_DIR, 'patterns.jquery.js')
    },
    sass: {
      controls: path.join(TEMP_DIR, '_controls.scss'),
      controlsNew: path.join(TEMP_DIR, '_controls-new.scss'),
      banner: path.join(TEMP_DIR, '_banner.scss'),
      themes: {}
    },
    log: {
      components: path.join(TEMP_DIR, 'components.txt'),
      e2e: path.join(TEMP_DIR, 'tests-e2e.txt'),
      functional: path.join(TEMP_DIR, 'tests-functional.txt'),
      source: path.join(TEMP_DIR, 'source.txt')
    }
  }
};

// File Paths that are stripped/ignored.
// Generally these are copied with another task, such as `npm run build:copy`.
const ignoredFilePaths = [
  path.join('components', 'locale', 'cultures'),
  path.join('components', 'locale', 'info')
];

// These search terms are used when scanning existing index files to determine
// a component's placement in a generated file.
const searchTerms = {
  complex: '// Complex ====/',
  foundational: '// Foundational ====/',
  mid: '// Mid ====/'
};

// These are test arguments that can be used in place of command line arguments during debugging
const TEST_ARGS = [
  'builder',
  'button',
  'input',
  'mask',
  'listview',
  'list-detail',
  'longpress',
  'object-summary',
  'panes',
  'popupmenu',
  'tabs',
  'validation'
];

// Library types
const libTypes = ['components', 'behaviors', 'layouts', 'patterns', 'utils'];

// All incoming scanned source code is labeled as "components" by default.
// If the source code folder shows up as a property here, it will be moved to a different
// bucket.
const customLocations = {
  'datagrid.editors': 'rules',
  'datagrid.formatters': 'rules',
  'datagrid.groupby': 'rules',
  masks: 'rules',
  'mask-api': '',
  'mask-input': 'foundational',
  'modal.manager': '',
  _tabs: 'mid',
  '_tabs-horizontal': 'mid',
  '_tabs-vertical': 'mid',
  'tabs-multi': 'complex',
  '_multi-tabs': 'complex',
  '_tabs-module': 'complex',
  '_tabs-header': 'complex',
  'toolbar-flex.item': '',
  validation: 'rules',
  'validation.utils': '',
  validator: 'foundational'
};

// Map for converting certain filenames to a dash-based string
// TODO: actually rename these files and better organize the source code. (see #833)
const dashSeparatedFileNames = {
  applicationmenu: 'application-menu',
  busyindicator: 'busy-indicator',
  circlepager: 'circle-pager',
  colorpicker: 'color-picker',
  compositeform: 'composite-form',
  contextualactionpanel: 'contextual-action-panel',
  datepicker: 'date-picker',
  emptymessage: 'empty-message',
  expandablearea: 'expandable-area',
  fileupload: 'file-upload',
  fileuploadadvanced: 'file-upload-advanced',
  listbuilder: 'list-builder',
  listfilter: 'list-filter',
  listview: 'list-view',
  monthview: 'month-view',
  multiselect: 'multi-select',
  popupmenu: 'popup-menu',
  searchfield: 'search-field',
  signin: 'sign-in',
  stepchart: 'step-chart',
  swaplist: 'swap-list',
  multitabs: 'tabs-multi', // (change)
  timepicker: 'time-picker',
  toolbarsearchfield: '' // don't actually include this one, cancel it out
};

// Map for converting certain `export` statements where the object names don't conform
// to the expected standard of "export an object name that matches a camel-case version
// of the dash/dot separated file name."
const changedExportNames = {
  'datagrid.editors': 'Editors',
  'datagrid.formatters': 'Formatters',
  'datagrid.groupby': 'GroupBy'
};

const lowercaseConstructorNames = {
  charts: 'charts',
  masks: 'masks',
  longpress: 'longPress',
  renderloop: 'renderLoop'
};

// Storage buckets for relevant file paths.
// These get used for generating import/export statements
const buckets = {
  behaviors: [],
  rules: [],
  foundational: [],
  mid: [],
  complex: [],
  layouts: [],
  patterns: [],
  'test-e2e': [],
  'test-func': []
};

// Component List file output
let componentList = '';

// Source code matches
const jsMatches = [];
const jQueryMatches = [];
const sassMatches = [];

// -------------------------------------
// Functions
// -------------------------------------

/**
 * Returns a string with a capitalized first letter
 * @param {string} str incoming string
 * @returns {string} the capitalized string
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Dynamically create the CSS paths for the supported themes
 */
function addDynamicCssThemePaths() {
  const tryAddPath = (themeName, themeMode) => {
    const fileName = `theme-${themeName}-${themeMode}`;
    const srcPath = path.join(SRC_DIR, 'themes', `${fileName}.scss`);
    const targetPath = path.join(TEMP_DIR, `${fileName}.scss`);

    if (fs.existsSync(srcPath)) {
      filePaths.src.sass.themes[fileName] = srcPath;
      filePaths.target.sass.themes[fileName] = targetPath;
    }
  };

  IDS_THEMES.forEach((theme) => {
    tryAddPath(theme.name, theme.base.name);

    theme.modes.forEach((modes) => {
      tryAddPath(theme.name, modes.name);
    });
  });
}

/**
 * Converts a library file's name to a matching string that will be
 * used to target an imported/exported library constructor.  This happens by replacing
 * filenames that use dashes followed by lowercase letters, to uppercase letters.
 * @param {string} str incoming string representing a filename
 * @returns {string} containing a matching constructor
 */
function replaceDashesWithCaptials(str) {
  str = capitalize(str);

  const matches = str.match(/([-|\.]\w)+/g);
  if (!matches) {
    return str;
  }

  matches.forEach((match) => {
    str = str.replace(match, capitalize(match.replace(/[-|\.]/, '')));
  });
  return str;
}

/**
 * @param {string} str incoming string containing a file path
 * @returns {string} a string containing just a filename
 */
function getFileName(str) {
  const lastSlash = str.lastIndexOf(path.sep);
  if (lastSlash === -1 || lastSlash === (str.length - 1)) {
    return str;
  }
  return str.slice(lastSlash + 1);
}

/**
 * @param {string} str containing a file name
 * @returns {string} the library name
 */
function getLibFromFileName(str) {
  const dot = str.lastIndexOf('.');
  return str.substring(0, dot);
}

/**
 * @param {string} str containing a file name
 * @returns {string} the library path without the filename
 */
function getPath(str) {
  const lastSlash = str.lastIndexOf(path.sep);
  if (lastSlash === -1 || lastSlash === (str.length - 1)) {
    return str;
  }
  return str.substring(0, lastSlash + 1);
}

/**
 * Returns a string representing a valid Javascript ES6 `import` statement
 * @param {string} libFile the target library file
 * @param {string} libFolder the target library folder
 * @returns {string} a valid ES6 `import` statement
 */
function sanitizeLibFile(libFile, libFolder) {
  libFile = libFile.toLowerCase();
  if (!libFolder) {
    libFolder = libFile;
  } else {
    libFolder = libFolder.toLowerCase();
  }
  return libFile;
}

/**
 * When writing CSS/JS files to the temp directory, this replaces
 * all instances of forward/backward slash to a forward slash.  It's possible
 * for both to exist in a path on Windows machines.
 * @param {string} str the string to fix
 * @returns {string} the correctly formatted string
 */
function transformSlashesForFile(str) {
  const backslashRegex = /\\/g;
  return str.replace(backslashRegex, '/');
}

/**
 * Returns a string representing a valid Javascript ES6 `import` statement
 * @param {string} libFile the target library file
 * @param {string} libPath the target library folder
 * @param {boolean} isExport if true, export statement is used instead.
 * @param {boolean} noConstructor if true, don't import a constructor and import all file contents
 * @returns {string} a valid ES6 `import` statement
 */
function writeJSImportStatement(libFile, libPath, isExport, noConstructor) {
  libFile = sanitizeLibFile(libFile, libPath);
  const importPath = transformSlashesForFile(`${RELATIVE_SRC_DIR}/${libPath}${libFile}`);
  const command = isExport ? 'export' : 'import';

  if (noConstructor) {
    return `${command} '${importPath}';`;
  }

  // (Temporarily) replace the filename with one that dash-separates the words
  // until we fix this later (see #833):
  let constructorName;
  if (dashSeparatedFileNames[libFile]) {
    constructorName = dashSeparatedFileNames[libFile];
    constructorName = replaceDashesWithCaptials(constructorName);
  } else if (lowercaseConstructorNames[libFile]) {
    constructorName = lowercaseConstructorNames[libFile];
  } else if (changedExportNames[libFile]) {
    constructorName = changedExportNames[libFile];
  } else {
    constructorName = replaceDashesWithCaptials(libFile);
  }

  return `${command} { ${constructorName} } from '${importPath}';`;
}

/**
 * Returns a string representing a valid SASS `@import` statement
 * @param {string} libFile the target library file
 * @param {string} libPath the target libary folder
 * @returns {string} a valid SASS `@import` statement
 */
function writeSassImportStatement(libFile, libPath) {
  libFile = sanitizeLibFile(libFile, libPath);
  const importPath = transformSlashesForFile(`${RELATIVE_SRC_DIR}/${libPath}${libFile}`);
  return `@import '${importPath}';`;
}

/**
 * "cleans" all the folders used by this script
 * @param {boolean} buildTempDir if true, re-builds the `temp/` directory
 * @returns {Promise} that resolves when the `del` library completes its task
 */
function cleanAll(buildTempDir) {
  const filesToDel = [
    `${TEMP_DIR}/*.js`,
    `${TEMP_DIR}/*.scss`
  ];

  // eslint-disable-next-line no-restricted-syntax
  for (const file of filesToDel) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }

  const promise = new Promise((resolve) => {
    resolve();
  });

  return promise.then(() => {
    if (argv.verbose) {
      logger('success', `Cleaned directory "${TEMP_DIR}"`);
    }
    if (!buildTempDir) {
      return;
    }
    createDirs([TEMP_DIR]);
  });
}

/**
 * Wraps `fs.readdir` and does a recursive file search
 * @param {string} root ?
 * @param {function} filter ?
 * @param {array} files ?
 * @param {string} prefix ?
 * @returns {array} of found files
 */
function read(root, filter, files, prefix) {
  prefix = prefix || '';
  files = files || [];
  filter = filter || function (x) {
    return x[0] !== '.' && !x.endsWith('.md');
  };

  const dir = path.join(root, prefix);
  if (!fs.existsSync(dir)) {
    return files;
  }

  if (fs.statSync(dir).isDirectory()) {
    fs.readdirSync(dir)
      .filter((name, index) => filter(name, index, dir))
      .forEach((name) => {
        read(root, filter, files, path.join(prefix, name));
      });
  } else {
    files.push(prefix);
  }

  return files;
}

/**
 * @param {array} files incoming file list
 * @param {string} term used for filtering the file list
 * @returns {array} a filtered version of the incoming array
 */
function searchFileNames(files, term) {
  const results = [];
  if (!Array.isArray(files) || !files.length || !term) {
    return results;
  }

  files.forEach((file) => {
    const wordBoundaryRegex = new RegExp(`\\b[_.]?${term}\\b`, 'gi');
    if (!file.match(wordBoundaryRegex)) {
      return;
    }

    results.push(file);
  });

  return results;
}

/**
 * Prunes the test results list in specific, tough cases
 * @private
 * @param {string} file path to a functional or e2e test
 * @param {array} components array of requested bundle items
 * @returns {boolean} whether or not the test should be pruned
 */
function pruneTest(file, components) {
  // If validation component is included but datagrid is not, remove datagrid validation test
  const datagridValidationTest = path.join('components', 'datagrid', 'datagrid-validation.func-spec.js');
  if (file === datagridValidationTest && components.indexOf('datagrid') === -1) {
    return true;
  }

  return false;
}

/**
 * @param {string} str the string to search
 * @param {string} term the term to find
 * @returns {number} the location index of the search term, plus the term's length
 */
function getFurthestIndexOf(str, term) {
  return str.indexOf(term) + term.length;
}

/**
 * Sort Locations
 * @param {array} files incoming list of file paths
 * @param {string} srcFilePath path of the original component index file to use for sorting
 */
function sortFilesIntoBuckets(files, srcFilePath) {
  const matchStr = libTypes.slice(1).join('|');
  const matchRegex = new RegExp(matchStr, 'g');
  const locationKeys = Object.keys(customLocations);

  const componentsJSFile = getFileContents(srcFilePath);
  const startOfMid = getFurthestIndexOf(componentsJSFile, searchTerms.mid);
  const startOfComplex = getFurthestIndexOf(componentsJSFile, searchTerms.complex);

  files.forEach((file) => {
    let match = file.match(matchRegex);
    // No match === 'component' type.  In this case, further sort the sub-component type
    if (!match) {
      const fileName = getFileName(file);
      const lib = getLibFromFileName(fileName);

      // If the `lib` is defined with a custom location in this script,
      // prefer the bucket associated with it.
      if (locationKeys.indexOf(lib) !== -1) {
        const bucketKey = customLocations[lib];
        const bucket = buckets[bucketKey];
        if (Array.isArray(bucket)) {
          bucket.push(file);
        }
        return;
      }

      // Scan the `components.js` file for the location of this lib's name,
      // and determine its bucket placement based on its index,
      // compared to the headers' index in that file.
      const indexInJSFile = componentsJSFile.indexOf(lib);
      let targetBucket = buckets.foundational;
      if (indexInJSFile > startOfComplex) {
        targetBucket = buckets.complex;
      } else if (indexInJSFile > startOfMid) {
        targetBucket = buckets.mid;
      }

      const lastItemIndex = targetBucket.length - 1;
      const lastItem = targetBucket[lastItemIndex];
      if (lastItem && (lastItem.indexOf('-uplift') > -1 || lastItem.indexOf('-new') > -1)) {
        targetBucket = targetBucket.splice(lastItemIndex, 0, file);
      } else {
        targetBucket.push(file);
      }

      return;
    }

    // Use first result
    match = match[0];

    // Ignore `utils` type for components
    if (match === 'utils') {
      return;
    }

    try {
      buckets[match].push(file);
    } catch (e) {
      throw new Error(`Sort Error: ${e}`);
    }
  });
}

/**
 * Writes the contents of a single file bucket to a string, for being appended to a file
 * @param {string} key the target file bucket
 * @param {string} type determines the type of file to include (see the types array inside)
 * @param {boolean} disallowNew determines if we are including imports for the new-specific styles for IDS inside this index file
 * @returns {string} formatted, multi-line, containing all relevant ES6-based import/export statements
 */
function renderImportsToString(key, type, disallowNew) {
  let fileContents = '';
  const bucket = buckets[key];
  if (!Array.isArray(bucket)) {
    throw new Error(`No bucket with name "${key}" exists.`);
  }

  const types = ['js', 'jquery', 'scss'];
  if (!type || types.indexOf(type) < 0) {
    type = types[0];
  }

  bucket.forEach((srcFilePath) => {
    const fileName = getFileName(srcFilePath);
    const filePath = getPath(srcFilePath);

    let ext = `.${type}`;
    if (type === 'jquery') {
      ext = `.${type}.js`;
    }

    // Don't write import/export statements for files that don't match
    // the type of index file we're creating.
    if (!fileName.endsWith(ext)) {
      return;
    }
    if (type === 'js' && fileName.indexOf('jquery') > -1) {
      return;
    }

    const lib = getLibFromFileName(fileName);
    const libIsAllowed = !disallowNew || (disallowNew && (lib.indexOf('-uplift') === -1 || lib.indexOf('-new') === -1));

    let statement = '';
    if (type === 'scss') {
      if (libIsAllowed) {
        statement = `${writeSassImportStatement(lib, filePath, true)}${NL}`;
      }
    } else if (type === 'jquery') {
      statement = `${writeJSImportStatement(lib, filePath, false, true)}${NL}`;
    } else {
      statement = `${writeJSImportStatement(lib, filePath, true)}${NL}`;
    }
    fileContents += statement;
  });

  return fileContents;
}

/**
 * Writes a JS file containing regular ES6 Imports (not jQuery)
 * @private
 * @param {string} key the file path bucket to use
 * @param {string} targetFilePath the path of the file that will be written
 * @returns {Promise} containing the results of the file write
 */
function renderTargetJSFile(key, targetFilePath) {
  let targetFile = '';
  const type = 'js';

  if (key === 'index') {
    // Pull in the standard `index.js` file and create a custom version that links
    // out to other JS files that will import slimmed-down lists of components.
    // Saves to the `temp/` folder.
    targetFile = getFileContents(filePaths.src.js.index);
    targetFile = targetFile
      .replace(/('\.\/)/g, '\'../src/')
      .replace('../src/behaviors/behaviors', './behaviors')
      .replace('../src/core/rules', './rules')
      .replace('../src/components/components', './components')
      .replace('../src/behaviors/initialize/initialize.jquery', './initialize.jquery');
  } else if (key === 'initialize') {
    targetFile = getFileContents(filePaths.src.js.initialize);
    targetFile = targetFile
      .replace(/('\.\.\/)((?!\.))/g, '\'./')
      .replace(/('\.\.\/\.\.\/)/g, '\'../src/')
      .replace('../src/components/components.jquery', './components.jquery');
  } else if (key === 'components') {
    // 'component' source code files are comprised of three buckets that need to
    // be written to the target file in a specific order.
    const componentBuckets = ['foundational', 'mid', 'complex'];
    componentBuckets.forEach((thisBucket) => {
      targetFile += `// ${capitalize(thisBucket)} ====/${NL}`;
      targetFile += renderImportsToString(thisBucket, type);
      targetFile += NL;
    });
  } else {
    // All other buckets simply get rendered directly
    targetFile += renderImportsToString(key, type);
  }

  return writeFile(targetFilePath, targetFile);
}

/**
 * Writes a JS file containing regular jQuery-based `import` statements
 * @private
 * @param {string} key the file path bucket to use
 * @param {string} targetFilePath the path of the file that will be written
 * @returns {Promise} containing the results of the file write
 */
function renderTargetJQueryFile(key, targetFilePath) {
  let targetFile = '';
  const type = 'jquery';

  if (key === 'components') {
    // 'component' source code files are comprised of three buckets that need to
    // be written to the target file in a specific order.
    const componentBuckets = ['foundational', 'mid', 'complex'];
    componentBuckets.forEach((thisBucket) => {
      targetFile += `// ${capitalize(thisBucket)} ====/${NL}`;
      targetFile += renderImportsToString(thisBucket, type);
      targetFile += NL;
    });
  } else if (key === 'initialize') {
    targetFile = getFileContents(filePaths.src.jQuery.initialize);
  } else {
    // All other buckets simply get rendered directly
    targetFile += renderImportsToString(key, type);
  }

  return writeFile(targetFilePath, targetFile);
}

/**
 * Writes a SASS file containing `import` statements for other components
 * @private
 * @param {string} key the file path bucket to use
 * @param {string} targetFilePath the path of the file that will be written
 * @param {boolean} isNormalBuild whether or not the build is normal (true) or custom (false)
 * @returns {Promise} containing the results of the file write
 */
function renderTargetSassFile(key, targetFilePath, isNormalBuild) {
  let targetFile = '';
  const type = 'scss';

  if (key === 'components' || key === 'components-new') {
    const isNew = key === 'components-new';
    targetFile = `// Required ====/${NL}@import '../src/core/required';${NL}${NL}`;

    // 'component' source code files are comprised of three buckets that need to
    // be written to the target file in a specific order.
    const componentBuckets = ['foundational', 'mid', 'complex', 'patterns', 'layouts'];
    componentBuckets.forEach((thisBucket) => {
      targetFile += `// ${capitalize(thisBucket)} ====/${NL}`;
      targetFile += renderImportsToString(thisBucket, type, !isNew);
      targetFile += NL;
    });
    targetFile += `// These controls must come last${NL}@import '../src/components/colors/colors';${NL}`;
  } else if (key === 'banner') {
    targetFile += bannerText;
  } else {
    // All other keys are "theme" entry points that just need their linked paths corrected.
    const themePath = transformSlashesForFile(path.join(SRC_DIR, 'themes', `${key}.scss`));
    const themeFile = getFileContents(themePath);

    // Inline the copyright banner
    targetFile += `@import './banner';${NL}`;

    // Add the theme contents
    targetFile += themeFile
      .replace(/('\.\.\/)((?!\.))/g, '\'../src/') // replaces anything pointing to a source code file
      .replace(/(\.\.\/)\1/g, '../'); // fixes the node_modules link to IDS Identity

    if (!isNormalBuild) {
      targetFile = targetFile.replace('../src/core/controls', './controls');
    }
  }

  return writeFile(targetFilePath, targetFile);
}

/**
 * @private
 * @param {string} type functional, e2e
 * @returns {Promise} representing the written test manifest file
 */
function renderTestManifest(type) {
  let targetFile = '';
  let bucket = 'test-func';
  if (type === 'e2e') {
    bucket = 'test-e2e';
  }

  buckets[bucket].forEach((test) => {
    targetFile += `${test}${NL}`;
  });

  return writeFile(filePaths.target.log[type], targetFile);
}

/**
 * Renders a list of components that were requested
 * @private
 * @returns {Promise} representing the written components list
 */
function renderComponentList() {
  return writeFile(filePaths.target.log.components, componentList);
}

/**
 * Renders a list of source code matched
 * @private
 * @returns {Promise} representing the source code list
 */
function renderSourceCodeList() {
  let targetFile = '';

  function logEmpty() {
    targetFile += NL;
    if (argv.verbose) {
      process.stdout.write(NL);
    }
  }

  function logHeaderToBoth(str) {
    targetFile += `${str}${NL}`;
    if (argv.verbose) {
      logger(`${str}`);
    }
  }

  function logItemToBoth(item) {
    targetFile += `- ${item}${NL}`;
    if (argv.verbose) {
      logger('bullet', `${item}`);
    }
  }

  logHeaderToBoth('JS Source Code:');
  jsMatches.forEach(item => logItemToBoth(item));
  logEmpty();

  logHeaderToBoth('jQuery Source Code:');
  jQueryMatches.forEach(item => logItemToBoth(item));
  logEmpty();

  logHeaderToBoth('Sass Source Code:');
  sassMatches.forEach(item => logItemToBoth(item));
  logEmpty();

  return writeFile(filePaths.target.log.source, targetFile);
}

/**
 * Renders all available target files.
 * @param {boolean} isNormalBuild returns an empty promise chain if this is a normal build
 * @returns {Promise} containing all file writes.
 */
function renderTargetFiles(isNormalBuild) {
  const renderPromises = [];

  const jsEntryPoints = Object.keys(filePaths.target.js);
  const jQueryEntryPoints = Object.keys(filePaths.target.jQuery);
  const sassThemes = Object.keys(filePaths.target.sass.themes);

  function runSassBuilds() {
    sassThemes.forEach((filePathKey) => {
      const theme = filePaths.target.sass.themes[filePathKey];
      const promise = renderTargetSassFile(filePathKey, theme, isNormalBuild);
      renderPromises.push(promise);
    });
    renderPromises.push(renderTargetSassFile('banner', filePaths.target.sass.banner, isNormalBuild));
    renderPromises.push(renderTargetSassFile('components', filePaths.target.sass.controls));
    renderPromises.push(renderTargetSassFile('components-new', filePaths.target.sass.controlsNew));
  }

  // On normal builds, still generate the banner and inline it into each theme file.
  if (isNormalBuild) {
    runSassBuilds();
    return Promise.all(renderPromises);
  }

  jsEntryPoints.forEach((filePathKey) => {
    renderPromises.push(renderTargetJSFile(filePathKey, filePaths.target.js[filePathKey]));
  });

  jQueryEntryPoints.forEach((filePathKey) => {
    const p = renderTargetJQueryFile(filePathKey, filePaths.target.jQuery[filePathKey]);
    renderPromises.push(p);
  });

  runSassBuilds();

  renderPromises.push(renderComponentList(), renderSourceCodeList());
  renderPromises.push(renderTestManifest('functional'));
  renderPromises.push(renderTestManifest('e2e'));

  return Promise.all(renderPromises);
}

/**
 * Runs all relevant build processes
 * @private
 * @param {array} requested the search terms that were requested
 * @returns {Promise} containing results of all build processes
 */
function runBuildProcesses(requested) {
  const buildPromises = [];
  let isCustom = false;
  let hasCustom = '';
  let targetSassConfig = 'dist';
  let rollupArgs = '-c';

  // Add Rollup Args, if applicable
  if (argv.verbose) {
    rollupArgs += ' --verbose';
  }
  if (argv.types) {
    rollupArgs += ` --types=${argv.types}`;
  }
  if (argv.coverage) {
    rollupArgs += ' --coverage=true';
  }

  // if Requested
  if (Array.isArray(requested) && requested.length) {
    isCustom = true;
    targetSassConfig = 'custom';
    const componentsArg = ` --components=${requested.join(',')}`;
    hasCustom = ' with custom entry points';
    rollupArgs += componentsArg;
  }

  logger(`${NL}Running build processes${hasCustom}...${NL}`);

  // Copy vendor libs/dependencies
  if (argv.disableCopy) {
    logger('alert', 'Ignoring build process for copied dependencies');
  } else {
    buildPromises.push(runBuildProcess('npm run build:copy'));
  }

  // Build JS
  if (argv.disableJs) {
    logger('alert', 'Ignoring build process for JS');
  } else if (!isCustom || (jsMatches.length || jQueryMatches.length)) {
    buildPromises.push(runBuildProcess(`npx rollup ${rollupArgs}`));
  }

  // Build CSS
  if (argv.disableCss) {
    logger('alert', 'Ignoring build process for CSS');
  } else if (!isCustom || sassMatches.length) {
    buildPromises.push(runBuildProcess(`node ${path.join('.', 'scripts', 'build-sass.js')} --type=${targetSassConfig}`));
  }

  buildPromises.push(createSvgHtml(argv.verbose));
  buildPromises.push(createColorJson(argv.verbose));

  return Promise.all(buildPromises);
}

/**
 * Handles a successful build
 * @returns {Promise} resulting in a successful process exit
 */
function buildSuccess() {
  return cleanAll().then(() => {
    logger('success', `IDS Build was successfully created in "${'dist/'}"`);
    process.exit(0);
  });
}

/**
 * Handles a failed build
 * @param {string} reason the reason the buold failed
 * @returns {void}
 */
function buildFailure(reason) {
  logger('error', `${reason}`);
  process.exit(1);
}

// -------------------------------------
// Main
// -------------------------------------

logger(`${NL}${'=========   IDS Enterprise Builder   ========='}${NL}`);

let requestedComponents = [];
let normalBuild = false;

if (!argv.components) {
  if (argv.testMode) {
    // "Test mode" uses presets for included components
    requestedComponents = TEST_ARGS;
  } else {
    normalBuild = true;
    logger('alert', 'No component arguments were provided.  A full component bundle will be created.');
  }
} else {
  requestedComponents = argv.components.split(',');
}

// Add all existing CSS theme paths dynamically.
addDynamicCssThemePaths(`${SRC_DIR}/themes`, true);

cleanAll(true).then(() => {
  if (!normalBuild) {
    // Display a list of requested components to the console
    let loggedComponentList = `${(argv.verbose ? `${NL}` : '')}${'Searching files in `src/` for the following terms:'}${NL}`;
    requestedComponents.forEach((comp) => {
      componentList += `${comp}${NL}`;
      loggedComponentList += `- ${comp}${NL}`;
    });
    logger(loggedComponentList);

    // Scan source code directories
    const items = read(SRC_DIR);
    const tests = read(TEST_DIR);

    // Search the stored list of source files for each term
    requestedComponents.forEach((arg) => {
      const results = searchFileNames(items, arg);
      results.forEach((result) => {
        let renderTarget = jsMatches;
        if (result.indexOf('.jquery') > -1) {
          renderTarget = jQueryMatches;
        }
        if (result.endsWith('.scss')) {
          renderTarget = sassMatches;
        }
        // Don't bundle culture files, which are copied separately.
        let hasIgnoredFilePath = false;
        ignoredFilePaths.forEach((thisPath) => {
          if (result.indexOf(thisPath) > -1) {
            hasIgnoredFilePath = true;
          }
        });
        if (hasIgnoredFilePath || renderTarget.indexOf(result) > -1) {
          return;
        }
        renderTarget.push(result);
      });

      // Scan for relevant tests
      const testResults = searchFileNames(tests, arg);
      testResults.forEach((result) => {
        if (pruneTest(result, requestedComponents)) {
          return;
        }

        if (result.indexOf('func-spec.js') > -1) {
          buckets['test-func'].push(result);
        }
        if (result.indexOf('e2e-spec.js') > -1) {
          buckets['test-e2e'].push(result);
        }
      });
    });

    // Only log the results if we're not in verbose mode.
    if (!argv.verbose) {
      logger(`${'JS Source Code:'} ${jsMatches.length} files`);
      logger(`${'jQuery Source Code:'} ${jQueryMatches.length} files`);
      logger(`${'Sass Source Code:'} ${sassMatches.length} files`);
    }

    // Create customized lists of JS components for this bundle
    sortFilesIntoBuckets(jsMatches, filePaths.src.js.components);
    sortFilesIntoBuckets(jQueryMatches, filePaths.src.jQuery.components);
    sortFilesIntoBuckets(sassMatches, filePaths.src.sass.controls);
  }

  renderTargetFiles(normalBuild).then(() => {
    if (argv.dryRun) {
      process.stdout.write(`${NL}`);
      logger('success', `Completed dry run!  Generated files are available in the "${'temp/'}" folder.`);
      process.exit(0);
    }

    runBuildProcesses(requestedComponents, jsMatches, jQueryMatches, sassMatches)
      .then(() => {
        // Copy renamed soho theme files to their deprecated names for backwards compatibility
        const cssPath = path.join(__dirname, '..', 'dist', 'css');
        const cssFiles = glob.sync(`${cssPath}/**/theme-*.css*`);

        const proms = cssFiles.map(file => new Promise((resolve, reject) => {
          const copyName = file.replace('classic', 'soho').replace('new', 'uplift');

          // eslint-disable-next-line no-promise-executor-return
          return fs.copyFile(file, copyName, (err) => {
            if (err) reject(err);
            // logger('alert', `Backwards compatibility ${file} copied to ${copyName}`);
            resolve();
          });
        }));
        return Promise.all(proms);
      })
      .catch(buildFailure)
      .then(buildSuccess);
  });
});
