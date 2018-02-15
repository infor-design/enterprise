#!/usr/bin/env node
/* jshint node:true */
/* eslint-disable import/no-extraneous-dependencies, function-paren-newline,
  no-console, no-restricted-syntax, no-continue, no-loop-func, prefer-template */

const singleComponent = process.argv[2];
const glob = require('glob');
const fs = require('fs');
const c = require('child_process');
const nodePandoc = require('node-pandoc');

// Generate a Doc file with buffered content
function runPandoc(data, apiHtml, componentPath) {
  // Note that im using gfm vs markdown for h level support
  nodePandoc(data, ['-f', 'markdown', '-t', 'html5', '-o', componentPath + 'index.html'], (error, stdout, stderr) => {
    if (error) {
      console.log(error);
    }

    if (stderr) {
      console.log(stderr);
    }

    if (stdout && apiHtml) {
      fs.readFile(componentPath + 'index.html', 'utf8', (readError, htmlData) => {
        if (readError) {
          throw readError;
        }

        const newData = htmlData.replace('<p>{{api-details}}</p>', apiHtml);
        fs.writeFile(componentPath + 'index.html', newData, (err) => {
          if (err) {
            throw err;
          }
        });
      });
    }
  });
}

// Expect a folder to have an .md file and an optional .js file.
glob('components/*/', (err, components) => {
  for (const componentPath of components) {
    const componentName = componentPath.replace('components/', '').replace('/', '').toLowerCase();

    if (singleComponent && singleComponent.toLowerCase() !== componentName) {
      continue;
    }

    console.log('Generating Docs for :', componentName);

    // Read the md file and Generate the Pandoc / Html file for it
    if (fs.existsSync(`${componentPath + componentName}.md`)) {
      const mdData = fs.readFileSync(`${componentPath + componentName}.md`, 'utf8');

      if (fs.existsSync(`${componentPath + componentName}.js`)) {
        // Write the file out
        const cmdHTML = `documentation build ${componentPath}${componentName}.js --format html --theme docs/theme --o ${componentPath}${componentName}-api.html --shallow`;
        const cmdMarkdown = `documentation build ${componentPath}${componentName}.js --format md --o ${componentPath}${componentName}-api.md --shallow`;
        c.exec(cmdHTML, (error, stdout, stderr) => {
          if (error) {
            throw error;
          }

          if (stderr) {
            throw stderr;
          }

          fs.readFile(`${componentPath + componentName}-api.html`, 'utf8', (readError, apiData) => {
            if (readError) {
              throw readError;
            }

            runPandoc(mdData, apiData, componentPath);
          });
        });

        c.exec(cmdMarkdown, (error, stdout, stderr) => {
          if (error) {
            throw error;
          }

          if (stderr) {
            throw stderr;
          }
        });
      } else {
        runPandoc(mdData, null, componentPath);
      }
    }
  }
});
