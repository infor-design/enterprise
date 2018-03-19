#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies, function-paren-newline,
  no-console, no-restricted-syntax, no-continue, no-loop-func, prefer-template */

const COMPONENT_FROM_PROCESS = process.argv[2];
const glob = require('glob');
const fs = require('fs');
const c = require('child_process');
const chalk = require('chalk');
const nodePandoc = require('node-pandoc');

const logger = require('./logger');

// Special Cases
// Some folders contain split source files.  This object defines the files that
// need documenting.
const SPECIAL_CASES = {
  mask: [
    'masks',
    'mask-api',
    'mask-input'
  ],
  'tabs-multi': [
    'multi-tabs'
  ]
};

// Checks if there are specific cases where we should be getting alternate files for documentation.
function isSpecialCase(componentName) {
  if (typeof componentName !== 'string' && componentName.toString !== undefined) {
    componentName = componentName.toString();
  }
  return SPECIAL_CASES[componentName] !== undefined;
}

// Generate a Doc file with buffered content
function runPandoc(componentName, data, apiHtml, componentPath) {
  logger('padded', `Generating human-friendly docs with Pandoc for ${chalk.yellow(componentName)}`);

  // Note that im using gfm vs markdown for h level support
  nodePandoc(data, ['-f', 'markdown', '-t', 'html5', '-o', componentPath + 'index.html'], (error, stdout, stderr) => {
    if (error) {
      logger('error', error);
      return;
    }

    if (stderr) {
      logger('error', stderr);
    }

    if (!stdout) {
      logger('info', `Pandoc ran successfully on ${chalk.yellow(componentName)} with no output.`);
      return;
    }

    let pandocOutput = stdout;
    if (apiHtml) {
      logger('padded', `Attempting to inline API Details for ${chalk.yellow(componentName)}`);
      pandocOutput = fs.readFileSync(`${componentPath}index.html`, 'utf8');
      pandocOutput = pandocOutput.replace('<p>{{api-details}}</p>', apiHtml);
    }

    fs.writeFile(`${componentPath}index.html`, pandocOutput, (err) => {
      if (err) {
        throw err;
      }
      logger('success', `Index file for ${chalk.yellow(componentName)} saved successfully!`);
    });
  });
}

// Actually Generate the Documentation
function generateDocs(componentPath, componentName) {
  logger('padded', `Looking for ${chalk.yellow(componentName + '.md')}...`);

  // Don't continue if we can't find the ".md" path.
  if (!fs.existsSync(`${componentPath + componentName}.md`)) {
    logger('padded', `Skipping ${chalk.yellow(componentName + '.md')} because it doesn't exist.`);
    return;
  }

  // Read the md file and Generate the Pandoc / Html file for it
  const mdData = fs.readFileSync(`${componentPath + componentName}.md`, 'utf8');

  // If there's no {componentName.js} in the path, just return the MD documentation as is.
  if (!fs.existsSync(`${componentPath + componentName}.js`)) {
    runPandoc(componentName, mdData, null, componentPath);
    return;
  }

  // Inlines a component's API details into its handwritten documentation file.
  function mdFileCallback() {
    fs.readFile(`${componentPath + componentName}-api.html`, 'utf8', (readError, apiData) => {
      if (readError) {
        throw readError;
      }
      runPandoc(componentName, mdData, apiData, componentPath);
    });
  }

  // Documentation commands (handles HTML and MD)
  const COMMANDS = [
    { cmd: `documentation build ${componentPath}${componentName}.js --format html --theme docs/theme --o ${componentPath}${componentName}-api.html --shallow` },
    { cmd: `documentation build ${componentPath}${componentName}.js --format md --o ${componentPath}${componentName}-api.md --shallow`, callback: mdFileCallback }
  ];
  COMMANDS.forEach((command) => {
    c.exec(command.cmd, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }

      if (stderr) {
        throw stderr;
      }

      if (command.callback === undefined) {
        return;
      }

      command.callback();
    });
  });
  logger('success', `Documentation.js completed for ${chalk.yellow(componentName)}`);
}

// Expect a folder to have an .md file and an optional .js file.
glob('components/*/', (err, components) => {
  for (const componentPath of components) {
    let componentName = componentPath.replace('components/', '').replace('/', '').toLowerCase();

    // If the command line argument defines a component to document, check it against
    // the component name and if they don't match, don't generate docs.
    if (COMPONENT_FROM_PROCESS && COMPONENT_FROM_PROCESS.toLowerCase() !== componentName) {
      continue;
    }

    // Some component folders have "special cases" where the source code isn't contained
    // by a single file, matching the directory name. Instead, a special case can be defined
    // that will process the source code as multiple files.
    if (isSpecialCase(componentName)) {
      componentName = SPECIAL_CASES[componentName];
    }

    // Handle Components split into multiple files.
    if (Array.isArray(componentName)) {
      componentName.forEach((component) => {
        generateDocs(componentPath, component);
      });
      continue;
    }

    // Handle a single matching component file.
    generateDocs(componentPath, componentName);
  }
});
