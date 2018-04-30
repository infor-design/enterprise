#!/usr/bin/env node

/* eslint-disable arrow-body-style, key-spacing, no-use-before-define, arrow-parens, no-console, import/no-dynamic-require, global-require, no-shadow, max-len, object-shorthand */
/**
 * @fileoverview This script does:
 * 1. Coverts components jsdoc comments into html
 * 2. Converts their self-named markdown files into html string
 * (both of these pieces of data are stored in an global object
 * for each component)
 * 3. Pending the "--site" flag specified, it writes each component in the object as:
 *   - HTML files in static/ for local serving (this is the default)
 *   or
 *   - JSON files in dist/, zips them, and POSTs them to the specified
 *     ids-website server
 *
 * @example `node ./build/deploy-documentation.js`
 *
 * Flags:
 * --dry-run       - Run the script, skipping POSTing to the api
 * --site=[server] - Deploy to specific server:
 *                   [local, local_debug, staging, prod]
 *                   Note: If there is no flag, it'll deploy to "static"
 *
 * --test-mode     - Run the script on a few components
 * --verbose       - Log all details
 *
 * NOTE: More than likely there is a command in the package.json
 * to run this script with NPM.
 */

// -------------------------------------
//   Node Modules/Options
// -------------------------------------
const archiver = require('archiver');
const argv = require('yargs').argv;
const chalk = require('chalk');
const del = require('del');
const documentation = require('documentation');
const frontMatter = require('front-matter');
const fs = require('fs');
const glob = require('glob');
const handlebars = require('handlebars');
const hbsRegistrar = require('handlebars-registrar');
const marked = require('marked');
const path = require('path');
const slash = require('slash');
const vinylToString = require('vinyl-contents-tostring');
const yaml = require('js-yaml');

// Set Marked options
marked.setOptions({
  gfm: true,
  highlight: (code, lang, callback) => {
    return require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, (err, result) => {
      callback(err, result.toString());
    });
  }
});

// -------------------------------------
//   Constants
// -------------------------------------
const rootPath = slash(process.cwd());
const idsWebsitePath = 'docs/ids-website';
const staticWebsitePath = 'docs/static-website';

const paths = {
  components: `${rootPath}/components`,
  docs:       `${rootPath}/docs`,
  templates: {
    root:  `${rootPath}/docs/templates`,
    hbs:   `${rootPath}/docs/templates/hbs`,
    docjs: `${rootPath}/docs/templates/documentationjs`
  },
  idsWebsite: {
    root:     `${rootPath}/${idsWebsitePath}`,
    dist:     `${rootPath}/${idsWebsitePath}/dist`,
    distDocs: `${rootPath}/${idsWebsitePath}/dist/docs`
  },
  static: {
    root: `${rootPath}/${staticWebsitePath}`,
    components: `${rootPath}/${staticWebsitePath}/components`
  }
};

const jsonTemplate = {
  title: '',
  description: '',
  body: '',
  api: ''
};

const serverURIs = {
  static: paths.static.root,
  local: 'http://localhost/api/docs/',
  localDebug: 'http://localhost:9002/api/docs/',
  staging: 'https://staging.design.infor.com/api/docs/',
  prod: 'https://design.infor.com/api/docs/'
};
const packageJson = require(`${rootPath}/publish/package.json`);
const testComponents = [
  'button',
  'datagrid'
];

// -------------------------------------
//   Variables
// -------------------------------------
const allDocsObjMap = {};
const componentStats = {
  numDocumented: 0,
  numConverted: 0,
  numWritten: 0,
  numSkipped: 0,
  total: 0,
};
const stopwatch = {};
let deployTo = 'static';
let numArchivesSent = 0;

hbsRegistrar(handlebars, {
  bustCache: true,
  partials: [
    `${paths.templates.hbs}/partials/*.hbs`
  ]
});

// -------------------------------------
//   Main
// -------------------------------------
logTaskStart('deploy');

if (argv.site && Object.keys(serverURIs).includes(argv.site)) {
  deployTo = argv.site;
}

const setupPromises = [
  cleanAll(),
  compileSupportingDocs(),
  compileComponents()
];

Promise.all(setupPromises)
  .catch(err => {
    console.error(chalk.red('Error!'), err);
  })
  .then(() => {
    logTaskStart('writing files');

    const pageTemplate = handlebars.compile(fs.readFileSync(`${paths.templates.hbs}/page.hbs`, 'utf-8'));

    const writePromises = [];
    if (deployTo === 'static') {
      writePromises.push(writeHtmlSitemap());
    } else {
      writePromises.push(writeJsonSitemap());
    }

    Object.keys(allDocsObjMap).forEach(compName => {
      if (deployTo === 'static') {
        writePromises.push(writeHtmlFile(pageTemplate, compName));
      } else {
        writePromises.push(writeJsonFile(compName));
      }
    });

    Promise.all(writePromises)
      .catch(err => {
        console.error(chalk.red('Error!'), err);
      })
      .then(() => {
        logTaskEnd('writing files');
        if (deployTo !== 'static') {
          zipAndDeploy();
        }
      });
  });

// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Compiled the component's MD and DocJS
 * @returns {Promise} - A promise
 */
function compileComponents() {
  return new Promise((resolve, reject) => {
    logTaskStart('component documentation');
    const compPromises = [];
    let compName = '';

    glob(`${paths.components}/*/`, (err, componentDirs) => {
      componentStats.total = componentDirs.length;

      componentDirs.forEach(compDir => {
        compName = deriveComponentName(compDir);
        console.log(compName);

        // For testing to only get one or two components
        if (argv.testMode && !testComponents.includes(compName)) return;

        if (!documentationExists(compName)) {
          logTaskAction('Skipping', compName, 'yellow');
          componentStats.numSkipped++;
          return;
        }

        allDocsObjMap[compName] = Object.assign({}, jsonTemplate, {
          title: compName,
          description: `All about ${compName}`,
          isComponent: true
        });

        // note: comp path includes an ending "/"
        compPromises.push(documentJsToHtml(compName));
        compPromises.push(markdownToHtml(`${compDir}${compName}.md`));
      });

      Promise.all(compPromises)
        .catch(err => {
          reject(err.message);
        })
        .then(() => {
          logTaskEnd('component documentation');
          resolve();
        });
    });
  });
}

/**
 * Compile all ids-website supporting MD files
 * and store the output string
 * @returns {Promise} - A promise
 */
function compileSupportingDocs() {
  return new Promise((resolve, reject) => {
    logTaskStart('markdown documentation');
    const promises = [];

    glob(`${paths.docs}/*.md`, (err, files) => {
      files.forEach(filePath => {
        const fileName = path.basename(filePath, '.md').toLowerCase();

        allDocsObjMap[fileName] = Object.assign({}, jsonTemplate, {
          title: fileName,
          description: `All about ${fileName}`,
        });

        promises.push(markdownToHtml(filePath));
      });

      Promise.all(promises)
        .catch(err => {
          reject(err);
        })
        .then(() => {
          logTaskEnd('markdown documentation');
          resolve();
        });
    });
  });
}

/**
 * Remove any "built" directories/files
 * @returns {Promise} - A promise
 */
function cleanAll() {
  const filesToDel = [];

  if (deployTo === 'static') {
    filesToDel.push(
      `${paths.static.root}/*.html`,
      `${paths.static.components}/*.html`
    );
  } else {
    filesToDel.push(
      paths.idsWebsite.dist,
      paths.idsWebsite.distDocs
    );
  }

  return del(filesToDel)
    .catch(err => {
      console.error(chalk.red('Error!'), err);
    })
    .then(() => {
      logTaskAction('Cleaned', paths.idsWebsite.dist.replace(rootPath, '.'));
      createDirs([
        paths.idsWebsite.root,
        paths.idsWebsite.dist,
        paths.idsWebsite.distDocs,
        paths.static.root,
        paths.static.components
      ]);
    });
}

/**
 * Convert markdown into html and parse any yaml frontMatter
 * and store the output html string in the component
 * object property
 * @param  {string} filePath - the full file path
 * @returns {Promise} - A promise
 */
function markdownToHtml(filePath) {
  const fileBasename = path.basename(filePath, '.md').toLowerCase();
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const fmData = frontMatter(data);
        if (fmData.attributes.title) allDocsObjMap[fileBasename].title = fmData.attributes.title;
        if (fmData.attributes.description) allDocsObjMap[fileBasename].description = fmData.attributes.description;
        if (fmData.attributes.demo) allDocsObjMap[fileBasename].demo = fmData.attributes.demo;
        if (fmData.attributes.system) allDocsObjMap[fileBasename].system = fmData.attributes.system;

        marked(fmData.body, (err, content) => {
          if (err) {
            reject(err);
          } else {
            componentStats.numConverted++;
            logTaskAction('Converting', `${fileBasename}.md`, true);
            resolve(allDocsObjMap[fileBasename].body = content);
          }
        });
      }
    });
  });
}

/**
 * Create directories if they exist
 * @param  {array} arrPaths - the directory path(s)
 */
function createDirs(arrPaths) {
  arrPaths.forEach(path => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
      logTaskAction('Created', path.replace(rootPath, '.'));
    }
  });
}

/**
 * Check if the component (directory) has a
 * self-named documentation mardkdown file
 * @param  {string} componentName - the name of the component
 * @returns {boolean} - if the documentation markdown file exists
 */
function documentationExists(componentName) {
  return fs.existsSync(`${paths.components}/${componentName}/${componentName}.md`);
}

/**
 * Run documentationJs on a file with JSON output
 * and save that in the components object property
 * @param  {string} componentName - the name of the component
 * @returns {Promise} - A promise
 */
function documentJsToHtml(componentName) {
  const compFilePath = `${paths.components}/${componentName}/${componentName}.js`;

  // const themeName = (deployTo === 'static') ? 'theme-single-page' : 'theme-ids-website';
  const themeName = 'theme-ids-website';

  return documentation.build([compFilePath], { extension: 'js', shallow: true })
    .then(comments => {
      documentation.formats.html(comments, { theme: `${paths.templates.docjs}/${themeName}` })
        .then(output => {
          return output.map((file) => {
            return vinylToString(file, 'utf8').then(contents => {
              componentStats.numDocumented++;
              logTaskAction('Documented', `${componentName}.js`, true);
              allDocsObjMap[componentName].api = contents;
            });
          });
        }, err => {
          console.error(chalk.red('Error!'), err);
        });
    });
}

/**
 * Derive the component name from its folder path
 * @param {string} dirPath - the component's directory path
 * @returns {string} - the component's name
 */
function deriveComponentName(dirPath) {
  dirPath = removeTrailingSlash(dirPath);
  const arr = dirPath.split('/');
  return arr[arr.length - 1];
}

/**
 * Console.log a staring action and track its start time
 * @param {string} taskName - the unique name of the task
 */
function logTaskStart(taskName) {
  stopwatch[taskName] = Date.now();
  console.log('Starting', chalk.cyan(taskName), '...');
}

/**
 * Console.log a finished action and display its run time
 * @param {string} taskName - the name of the task that matches its start time
 */
function logTaskEnd(taskName) {
  console.log('Finished', chalk.cyan(taskName), `after ${chalk.magenta(timeElapsed(stopwatch[taskName]))}`);
}

/**
 * Log an individual task's action
 * @param {string} action - the action
 * @param {string} desc - a brief description or more details
 * @param {boolean} [onlyVerbose] - console log only with verbose flag
 * @param {string} [color] - one of the chalk module's color aliases
 *
 */
function logTaskAction(action, desc, onlyVerbose = false, color = 'green') {
  if (!onlyVerbose || (onlyVerbose && argv.verbose)) {
    console.log('-', action, chalk[color](desc));
  }
}

/**
 * Deploy the zipped bundle using a POST request
 */
function postZippedBundle() {
  const FormData = require('form-data');

  logTaskStart(`attempt publish to server "${deployTo}"`);

  const form = new FormData();
  form.append('file', fs.createReadStream(`${paths.idsWebsite.dist}.zip`));
  form.append('root_path', `ids-enterprise/${packageJson.version}`);
  form.append('post_auth_key', process.env.DOCS_API_KEY ? process.env.DOCS_API_KEY : '');
  form.submit(serverURIs[deployTo], (err, res) => {
    logTaskEnd(`attempt publish to server "${deployTo}"`);
    if (err) {
      console.error(err);
      logTaskAction('Failed!', `Status ${err}`, false, 'red');
    } else {
      if (res.statusCode === 200) {
        logTaskAction('Success', `to "${serverURIs[deployTo]}"`);
      } else {
        logTaskAction('Failed!', `Status ${res.statusCode}: ${res.statusMessage}`, false, 'red');
      }
      res.resume();
      numArchivesSent++;
      statsConclusion();
    }
  });
}

/**
 * Get the sitemap contents as a json object
 * @returns {String} - sitemap contents
 */
function readSitemapYaml() {
  let sitemap = {};
  try {
    sitemap = yaml.safeLoad(fs.readFileSync(`${paths.docs}/sitemap.yml`, 'utf8'));
  } catch (e) {
    throw e;
  }
  return sitemap;
}

/**
 * Remove trialing slash
 * @param {string} uri - a uri/path
 * @returns {string} - the path with a trailing slash
 */
function removeTrailingSlash(uri) {
  return uri.replace(/\/$/, '');
}

/**
 * Console.log statistics from the build
 */
function statsConclusion() {
  logTaskEnd('deploy');
  // did not use multiline string for formatting reasons
  let str = '';
  str += `\nComponents ${chalk.green('converted')}:  ${componentStats.numConverted}/${componentStats.total}`;
  str += `\nComponents ${chalk.green('documented')}: ${componentStats.numDocumented}/${componentStats.total}`;
  str += `\nComponents ${chalk.yellow('skipped')}:    ${componentStats.numSkipped}/${componentStats.total}`;
  str += `\nComponents ${chalk.green('written')}:    ${componentStats.numWritten}/${componentStats.total}`;
  if (numArchivesSent === 0) {
    str += `\n\nBundles ${chalk.red('deployed')}: ${numArchivesSent}/1`;
  } else {
    str += `\n\nBundles ${chalk.green('deployed')}: ${numArchivesSent}/1`;
  }
  str += '\n';
  console.log(str);
}

/**
 * Calculate the difference in seconds
 * @param {number} t - a time in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
 * @returns {string} - the time elapsed in seconds
 */
function timeElapsed(t) {
  const elapsed = ((Date.now() - t) / 1000).toFixed(1);
  return `${elapsed}s`;
}

/**
 * Write a html file for specified component
 *
 * @param {function} hbsTemplate - the hbs page template function
 * @param {string} componentName - the name of the component
 * @returns {Promise} - A promise
 */
function writeHtmlFile(hbsTemplate, componentName) {
  return new Promise((resolve, reject) => {
    const data = {
      version: packageJson.version,
      component: allDocsObjMap[componentName]
    };
    data.component.slug = componentName;
    const html = hbsTemplate(data);

    // Regular docs go in root, components go in "components/"
    let dest = `${paths.static.root}/${componentName}.html`;
    if (data.component.isComponent) {
      dest = `${paths.static.components}/${componentName}.html`;
    }

    fs.writeFile(dest, html, 'utf8', err => {
      if (err) {
        reject(err);
      } else {
        logTaskAction('Created', `${componentName}.html`, true);
        resolve();
      }
    });
  });
}

/**
 * Write a json file for specified component
 * @param {string} componentName - the name of the component
 * @returns {Promise} - A promise
 */
function writeJsonFile(componentName) {
  return new Promise((resolve, reject) => {
    const thisName = componentName;
    fs.writeFile(`${paths.idsWebsite.distDocs}/${thisName}.json`, JSON.stringify(allDocsObjMap[thisName]), 'utf8', err => {
      if (err) {
        reject(err);
      } else {
        componentStats.numWritten++;
        logTaskAction('Created', `${thisName}.json`, true);
        resolve();
      }
    });
  });
}

/**
 * Convert/write the sitemap.yml to sitemap.json into dist
 * @returns {Promise} - A promise
 */
function writeJsonSitemap() {
  return new Promise((resolve, reject) => {
    const sitemapObj = readSitemapYaml();
    fs.writeFile(`${paths.idsWebsite.dist}/sitemap.json`, JSON.stringify(sitemapObj), 'utf8', err => {
      if (err) {
        reject(err);
      } else {
        logTaskAction('Created', 'sitemap.json');
        resolve();
      }
    });
  });
}

/**
 * Convert/write the sitemap.yml as "components/index" for static docs
 * @returns {Promise} - A promise
 */
function writeHtmlSitemap() {
  return new Promise((resolve, reject) => {
    const tocTemplate = handlebars.compile(fs.readFileSync(`${paths.templates.hbs}/toc.hbs`, 'utf-8'));
    const sitemapObj = readSitemapYaml();
    const sitemapHtml = tocTemplate(sitemapObj);

    fs.writeFile(`${paths.static.components}/index.html`, sitemapHtml, 'utf8', err => {
      if (err) {
        reject(err);
      } else {
        logTaskAction('Created', 'sitemap.html');
        resolve();
      }
    });
  });
}

/**
 * Zip the documentation files and call the method to POST
 */
function zipAndDeploy() {
  logTaskStart('zip json files');

  // create a file to stream archive data to.
  const output = fs.createWriteStream(`${paths.idsWebsite.dist}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on('close', () => {
    logTaskAction(`Zipped ${archive.pointer()} total bytes`);
    logTaskEnd('zip json files');

    if (argv.dryRun) {
      console.log(chalk.bgRed.bold('!! DRY RUN !!'));
      statsConclusion();
    } else {
      postZippedBundle();
    }
  });

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on('end', () => {
    console.log('Data has been drained');
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', err => {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  // good practice to catch this error explicitly
  archive.on('error', err => {
    throw err;
  });

  // pipe archive data to the file
  archive.pipe(output);

  archive.directory(paths.idsWebsite.dist, false);
  archive.finalize();
}
