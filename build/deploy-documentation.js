#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies, function-paren-newline,
  no-console, no-restricted-syntax, no-continue, no-loop-func, prefer-template */


/**
 * @fileoverview This script documents components with documentationjs,
 * converts their self-named markdown files into html, writes the
 * data as json files, zips it, and POSTs it to the website api.
 *
 * @example `node ./build/deploy-documentation.js`
 *
 * Flags:
 * --dry-run       - Run the script, skipping POSTing to the api
 * --site=[server] - Deploy to specific server (defaults to "local"):
 *                   [local, local_debug, staging, prod]
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
const marked = require('marked');
const path = require('path');
const yaml = require('js-yaml');

// Set Marked options
marked.setOptions({
  gfm: true,
  highlight: function (code, lang, callback) {
    return require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, (err, result) => {
      callback(err, result.toString());
    });
  }
});

// -------------------------------------
//   Constants
// -------------------------------------
const websiteDirName = 'design.infor.com';
const rootPath = process.cwd();
const paths = {
  components:  `${rootPath}/components`,
  src:         `${rootPath}/${websiteDirName}`,
  dist:        `${rootPath}/${websiteDirName}/dist`,
  distDocs:    `${rootPath}/${websiteDirName}/dist/docs`
};
const jsonTemplate = {
  title: '',
  description: '',
  body: '',
  api: ''
};
const packageJson = require(`${rootPath}/publish/package.json`);
const testComponents = [
  'button',
  'datagrid'
];

// -------------------------------------
//   Variables
// -------------------------------------
let componentStats = {
  numDocumented: 0,
  numConverted: 0,
  numWritten: 0,
  numSkipped: 0,
  total: 0,
};
const allDocsObj = {};
let numArchivesSent = 0;
let stopwatch = {};

// -------------------------------------
//   Main
// -------------------------------------
logTaskStart('deploy');

const setupPromises = [
  cleanDist(),
  compileSupportingDocs(),
  compileComponents()
];

Promise.all(setupPromises)
  .catch(err => {
    console.error(chalk.red('Error!'), err);
  })
  .then(values => {
    logTaskStart('writing files');

    let writePromises = [writeSitemap()];
    for (docName in allDocsObj) {
      writePromises.push(writeJsonFile(docName));
    }

    Promise.all(writePromises)
      .catch(function(err) {
        console.error(chalk.red('Error!'), err);
      })
      .then(values => {
        logTaskEnd('writing files');
        zipAndDeploy();
      });
  });


// -------------------------------------
//   Functions
// -------------------------------------
function compileComponents() {
  return new Promise((resolve, reject) => {

    logTaskStart('component documentation');
    let compPromises = [];
    let compName = '';

    glob(`${paths.components}/*/`, (err, components) => {
      componentStats.total = components.length;

      for (compPath of components) {
        compName = deriveComponentName(compPath);

        // For testing to only get one or two components
        if (argv.testMode && !testComponents.includes(compName)) continue;

        if (!documentationExists(compName, compPath)) {
          logTaskAction('Skipping', compName, 'yellow');
          componentStats.numSkipped++;
          continue;
        }

        allDocsObj[compName] = Object.assign({}, jsonTemplate, {
          title: compName,
          description: 'All about ' + compName,
        });

        // note: comp path includes an ending "/"
        compPromises.push(documentJsAsJson(compName, `${compPath}${compName}.js`));
        compPromises.push(markdownToHtml(compName, `${compPath}${compName}.md`));
      }

      Promise.all(compPromises)
        .catch(err => {
          reject(err.message)
        })
        .then(values => {
          logTaskEnd('component documentation');
          resolve();
        });
    });
  })
}

function compileSupportingDocs() {
  return new Promise((resolve, reject) => {

    logTaskStart('markdown documentation');
    let promises = [];
    let compName = '';

    glob(`${paths.src}/*.md`, (err, files) => {
      for (filePath of files) {
        fileName = path.basename(filePath, '.md');

        allDocsObj[fileName] = Object.assign({}, jsonTemplate, {
          title: fileName,
          description: 'All about ' + fileName,
        });

        promises.push(markdownToHtml(fileName, filePath));
      }

      Promise.all(promises)
        .catch(err => {
          reject(err)
        })
        .then(values => {
          logTaskEnd('markdown documentation');
          resolve();
        });
    });
  })
}

function cleanDist() {
  return del([paths.dist])
    .then(res => {
      logTaskAction('Clean', paths.dist);
      createDir(paths.dist);
      createDir(paths.distDocs);
    }
  );
}

function writeSitemap() {
  return new Promise((resolve, reject) => {
    let doc = '';
    try {
      doc = yaml.safeLoad(fs.readFileSync(`${paths.src}/sitemap.yml`, 'utf8'));
    } catch (e) {
      reject(e);
    }

    fs.writeFile(`${paths.dist}/sitemap.json`, JSON.stringify(doc), 'utf8', err => {
      if (err) {
        reject(err);
      } else {
        logTaskAction('Created', 'sitemap.json');
        resolve();
      }
    });
  });
}

function markdownToHtml(name, path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const fmData = frontMatter(data);
        if (fmData.attributes.title) allDocsObj[name].title = fmData.attributes.title;
        if (fmData.attributes.description) allDocsObj[name].description = fmData.attributes.description;

        marked(fmData.body, (err, content) => {
          if (err) {
            reject(err);
          } else {
            componentStats.numConverted++;
            logTaskAction('Converting', name + '.md')
            resolve(allDocsObj[name].body = content);
          }
        });
      }
    })
  });
}

function createDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    logTaskAction('Created', path);
  }
}

function documentationExists(name, path) {
  return fs.existsSync(`${path}/${name}.md`);
}

function documentJsAsJson(name, path) {
  return documentation.build([path], { extension: 'js', shallow: true })
    .then(documentation.formats.json)
    .then(output => {
      componentStats.numDocumented++;
      logTaskAction('Documented', name + '.js')
      allDocsObj[name].api = JSON.parse(output);
    });
}

function deriveComponentName(path) {
  return path
    .replace(`${paths.components}/`, '')
    .slice(0, -1);
}

function logTaskStart(taskName) {
  stopwatch[taskName] = Date.now();
  console.log('Starting', chalk.cyan(taskName), '...');
}

function logTaskEnd(taskName) {
  console.log('Finished', chalk.cyan(taskName), `after ${chalk.magenta(timeElapsed(stopwatch[taskName]))}`);
}

function logTaskAction(action, desc, color = 'green') {
  if (argv.verbose) {
    console.log('-', action, chalk[color](desc));
  }
}

function postZippedBundle() {
  const formData = require('form-data');
  const urls = {
    local: 'http://localhost/api/docs/',
    localDebug: 'http://localhost:9002/api/docs/',
    staging: 'http://staging.design.infor.com/api/docs/',
    prod: 'https://design.infor.com/api/docs/'
  };

  let envAlias = 'local';
  if (argv.site) {
    if (Object.keys(urls).includes(argv.site)) {
      envAlias = argv.site;
    } else {
      console.log(chalk.red(`Site "${argv.site}" not found!`), '\n"--site" options are', Object.keys(urls).join(', '));
      console.log(`Defaulting to "${envAlias}" api`)
    }
  }

  logTaskStart(`publish to server "${envAlias}"`);

  let form = new formData();
  form.append('file', fs.createReadStream(`${paths.dist}.zip`));
  form.append('root_path', `ids-jquery/${packageJson.version}`);
  form.submit(urls[envAlias], (err, res) => {
    if (err) {
      console.error(err);
    } else {
      if (res.statusCode == 200) {
        logTaskAction('Success', `to "${urls[envAlias]}"`)
      } else {
        logTaskAction('Failed!', `Status ${res.statusCode}`, 'red');
      }
      res.resume();
      logTaskEnd(`publish to server "${envAlias}"`);
      numArchivesSent++;
      statsConclusion();
    }
  });
}

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

function timeElapsed(t) {
  const elapsed = ((Date.now() - t)/1000).toFixed(1);
  return elapsed + 's';
}

function writeJsonFile(fileName) {
  return new Promise((resolve, reject) => {
    const name = docName;
    fs.writeFile(`${paths.distDocs}/${docName}.json`, JSON.stringify(allDocsObj[name]), 'utf8', err => {
      if (err) {
        reject(err);
      } else {
        componentStats.numWritten++;
        logTaskAction('Created', name + '.json');
        resolve();
      }
    });
  });
}

function zipAndDeploy() {
  logTaskStart('zip json files');

  // create a file to stream archive data to.
  var output = fs.createWriteStream(paths.dist + '.zip');
  var archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on('close', () => {
    logTaskAction('Zipped', archive.pointer() + ' total bytes')
    logTaskEnd('zip json files');

    if (argv.dryRun) {
      console.log(chalk.bgRed.bold('!! DRY RUN !!'));
      statsConclusion()
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

  archive.directory(paths.dist, false);
  archive.finalize();
}
