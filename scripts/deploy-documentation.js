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
 * @example `node ./scripts/deploy-documentation.js`
 */

// -------------------------------------
//   Node Modules/Options
// -------------------------------------
import archiver from 'archiver';
import { build, formats } from 'documentation';
import frontMatter from 'front-matter';
import * as fs from 'fs';
import glob from 'glob';
import handlebars from 'handlebars';
import hbsRegistrar from 'handlebars-wax';
import { marked, setOptions } from 'marked';
import * as path from 'path';
import slash from 'slash';
import yaml from 'js-yaml';
import hljs from 'highlight.js';
import FormData from 'form-data';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Local
import swlog from './helpers/stopwatch-log.js';
import getJSONFile from '../app/src/js/get-json-file.js';

const yargs = _yargs(hideBin(process.argv));

const argv = await yargs
  .usage('Usage $node ./scripts/deploy-documentation.js [-s] [-d] [-T]')
  .option('site', {
    alias: 's',
    describe: 'The site server to publish to (static, local, localDebug, staging, prod)',
    default: 'static'
  })
  .option('dry-run', {
    alias: 'd',
    describe: 'Run the script, skipping sending of files',
    default: false
  })
  .option('test-mode', {
    alias: 'T',
    describe: 'Run the script on a few preset components',
    default: false
  })
  .help('h')
  .alias('h', 'help')
  .argv;

// Set Marked options
setOptions({
  gfm: true,
  highlight: (code, lang, callback) => {
    const language = hljs.getLanguage(lang) ? lang : 'html';
    callback(null, hljs.highlight(code, { language }).value);
  }
});

// -------------------------------------
//   Constants
// -------------------------------------
const rootPath = slash(process.cwd());
const idsWebsitePath = 'docs/ids-website';
const staticWebsitePath = 'app/docs';

const paths = {
  components: `${rootPath}/src/components`,
  docs: `${rootPath}/docs`,
  templates: {
    root: `${rootPath}/docs/templates`,
    hbs: `${rootPath}/docs/templates/hbs`,
    docjs: `${rootPath}/docs/templates/documentationjs`
  },
  idsWebsite: {
    root: `${rootPath}/${idsWebsitePath}`,
    dist: `${rootPath}/${idsWebsitePath}/dist`,
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
  prod: 'https://old.design.infor.com/api/docs/'
};

const packageJson = getJSONFile('../../../package.json');
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
const opStart = swlog.logTaskStart(`deploying ${packageJson.version}`);

if (argv.testMode) {
  console.log('\n!! TEST MODE !!');
}

if (argv.site && Object.keys(serverURIs).includes(argv.site)) {
  deployTo = argv.site;
}

// Failsafe to prevent accidentally uploading dev/beta/rc documentation to
// production as those semver's will have a dash in them (-dev, -beta, -rc)
if (packageJson.version.includes('-') && deployTo === 'prod') {
  console.error('Error', 'You can NOT deploy documentation for a non-final version to "prod".');
  process.exit(0);
}

cleanAll()
  .then(copyTokenFiles)
  .then(compileSupportingDocs)
  .then(compileComponents)
  .then(() => {
    const writeStart = swlog.logTaskStart('writing files');
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

    return Promise.all(writePromises).then(() => {
      swlog.logTaskEnd(writeStart);
      if (deployTo !== 'static') {
        zipAndDeploy();
      }
    });
  })
  .catch(swlog.error);

// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Compiled the component's MD and DocJS
 * @returns {Promise} - A promise
 */
function compileComponents() {
  return new Promise((resolve, reject) => {
    const docStart = swlog.logTaskStart('component documentation');
    const compPromises = [];
    let compName = '';

    glob(`${paths.components}/*/`, (err, componentDirs) => {
      if (err) {
        swlog.error(err);
      }

      componentStats.total += componentDirs.length;

      componentDirs.forEach(compDir => {
        compName = deriveComponentName(compDir);

        // For testing to only get one or two components
        if (argv.testMode && !testComponents.includes(compName)) {
          componentStats.numSkipped++;
          return;
        }

        if (!documentationExists(compName)) {
          swlog.logTaskAction('Skipping', compName);
          componentStats.numSkipped++;
          return;
        }

        allDocsObjMap[compName] = {
          ...jsonTemplate,
          title: compName,
          description: '',
          isComponent: true
        };

        // note: comp path includes an ending "/"
        compPromises.push(documentJsToHtml(compName));
        compPromises.push(markdownToHtml(`${compDir}readme.md`, compName));
      });

      Promise.all(compPromises)
        .catch(err => {
          reject(err.message);
        })
        .then(() => {
          swlog.logTaskEnd(docStart);
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
    const mdStart = swlog.logTaskStart('markdown documentation');
    const promises = [];

    glob(`${paths.docs}/*.md`, (err, files) => {
      componentStats.total += files.length;

      files.forEach((filePath, i) => {
        // For testing to only get one or two components
        if (argv.testMode && i > 2) {
          componentStats.numSkipped++;
          return;
        }

        const fileName = path.basename(filePath, '.md').toLowerCase();

        allDocsObjMap[fileName] = { ...jsonTemplate, title: fileName };

        promises.push(markdownToHtml(filePath, fileName));
      });

      Promise.all(promises)
        .catch(err => {
          reject(err);
        })
        .then(() => {
          swlog.logTaskEnd(mdStart);
          resolve();
        });
    });
  });
}

/**
 * Publish token data too
 */
function copyTokenFiles() {
  return new Promise((resolve, reject) => {
    const cpStart = swlog.logTaskStart('Copy token files');
    const dist = `${paths.idsWebsite.dist}/ids-identity`;
    const files = glob.sync('./node_modules/ids-identity/dist/tokens/**/tokens/web/theme-*.json');

    const promises = files.map(file => {
      return new Promise((resolve) => {
        const fileName = path.parse(file).name;
        const obj = JSON.parse(fs.readFileSync(file, 'utf8'));
        createDirs([dist]);
        fs.writeFile(`${dist}/${fileName}.json`, JSON.stringify(obj, null, 4), () => {
          swlog.logTaskAction('Copied', `${fileName}.json`);
          resolve();
        });
      });
    });

    Promise.all(promises)
      .catch(err => {
        reject(err);
      })
      .then(() => {
        swlog.logTaskEnd(cpStart);
        resolve();
      });
  });
}

/**
 * Remove any "built" directories/files
 * @async
 * @returns {Promise} - A promise
 */
async function cleanAll() {
  const cleanStart = swlog.logTaskStart('cleaning dist');

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

  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const file of filesToDel) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
    await createDirs([
      paths.idsWebsite.root,
      paths.idsWebsite.dist,
      paths.idsWebsite.distDocs,
      paths.static.root,
      paths.static.components
    ]);
    swlog.logTaskEnd(cleanStart);
  } catch (err) {
    console.error('Error', err);
  }
}

/**
 * Convert markdown into html and parse any yaml frontMatter
 * and store the output html string in the component
 * object property
 * @param  {string} filePath - the full file path
 * @param  {string} fileName - the name of the file
 * @returns {Promise} - A promise
 */
function markdownToHtml(filePath, fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const fmData = frontMatter(data);
        if (fmData.attributes.title) allDocsObjMap[fileName].title = fmData.attributes.title;
        if (fmData.attributes.description) allDocsObjMap[fileName].description = fmData.attributes.description;
        if (fmData.attributes.demo) allDocsObjMap[fileName].demo = fmData.attributes.demo;
        if (fmData.attributes.system) allDocsObjMap[fileName].system = fmData.attributes.system;

        marked(fmData.body, (err, content) => {
          if (err) {
            reject(err);
          } else {
            componentStats.numConverted++;
            swlog.logTaskAction('Readme processed', `${filePath.replace(process.cwd(), '')}`);
            resolve(allDocsObjMap[fileName].body = content);
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
  return fs.existsSync(`${paths.components}/${componentName}/readme.md`);
}

/**
 * Run documentationJs on a file with JSON output
 * and save that in the components object property
 * @param  {string} componentName - the name of the component
 * @returns {Promise} - A promise
 */
function documentJsToHtml(componentName) {
  const compFilePath = `${paths.components}/${componentName}/${componentName}.js`;
  const themeName = 'theme-ids-website';

  return build([compFilePath], { extension: 'js', shallow: true })
    .then(comments => {
      return formats.html(comments, { theme: `${paths.templates.docjs}/${themeName}/index.js` });
    })
    .then(res => {
      res.map(async file => {
        componentStats.numDocumented++;
        swlog.logTaskAction('API processed', `${componentName}.js`);
        allDocsObjMap[componentName].api = file.contents.toString().trim();
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
 * Deploy the zipped bundle using a POST request
 */
function postZippedBundle() {
  const publishStart = swlog.logTaskStart(`attempt publish to server "${deployTo}"`);

  const form = new FormData();
  form.append('file', fs.createReadStream(`${paths.idsWebsite.dist}.zip`));
  form.append('root_path', `ids-enterprise/${packageJson.version}`);
  form.append('post_auth_key', process.env.DOCS_API_KEY ? process.env.DOCS_API_KEY : '');
  form.submit(serverURIs[deployTo], (err, res) => {
    swlog.logTaskEnd(publishStart);
    if (err) {
      console.error(err);
      swlog.logTaskAction('Failed!', `Status ${err}`);
    } else {
      if (res.statusCode === 200) {
        swlog.logTaskAction('Success', `to "${serverURIs[deployTo]}"`);
      } else {
        swlog.logTaskAction('Failed!', `Status ${res.statusCode}: ${res.statusMessage}`);
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
  sitemap = yaml.load(fs.readFileSync(`${paths.docs}/sitemap.yml`, 'utf8'));
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
  swlog.logTaskEnd(opStart);
  // did not use multiline string for formatting reasons
  let str = '';
  str += `\nComponents ${'converted'}:  ${componentStats.numConverted}/${componentStats.total}`;
  str += `\nComponents ${'documented'}: ${componentStats.numDocumented}/${componentStats.total}`;
  str += `\nComponents ${'skipped'}:    ${componentStats.numSkipped}/${componentStats.total}`;
  str += `\nComponents ${'written'}:    ${componentStats.numWritten}/${componentStats.total}`;
  if (numArchivesSent === 0) {
    str += `\n\nBundles ${'deployed'}: ${numArchivesSent}/1`;
  } else {
    str += `\n\nBundles ${'deployed'}: ${numArchivesSent}/1`;
  }
  str += '\n';
  console.log(str);
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
        swlog.logTaskAction('Created', `${dest.replace(process.cwd())}`);
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
    const dest = `${paths.idsWebsite.distDocs}/${thisName}.json`;

    fs.writeFile(dest, JSON.stringify(allDocsObjMap[thisName]), 'utf8', err => {
      if (err) {
        reject(err);
      } else {
        componentStats.numWritten++;
        swlog.logTaskAction('Created', dest.replace(process.cwd()));
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
        swlog.logTaskAction('Created', 'sitemap.json');
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
        swlog.logTaskAction('Created', 'sitemap.html');
        resolve();
      }
    });
  });
}

/**
 * Zip the documentation files and call the method to POST
 */
function zipAndDeploy() {
  const zipStart = swlog.logTaskStart('zip json files');

  // create a file to stream archive data to.
  const output = fs.createWriteStream(`${paths.idsWebsite.dist}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on('close', () => {
    swlog.logTaskAction('Zipped', `${archive.pointer()} total bytes`);
    swlog.logTaskEnd(zipStart);

    if (argv.dryRun) {
      console.log('\n!! NO PUBLISH - DRY RUN !!\n');
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
