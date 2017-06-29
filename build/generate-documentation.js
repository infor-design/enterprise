#!/usr/bin/env node
/* jshint node:true */

const glob = require('glob'),
  fs = require('fs'),
  c = require('child_process'),
  nodePandoc = require('node-pandoc'),
  singleComponent = process.argv[2];

//Generate a Doc file with buffered contrnt
function runPandoc(data, componentPath) {
  // Note that im using markdown_github vs markdown for h level support
  nodePandoc(data, ['-f','markdown_github','-t','html5','-o', componentPath + 'index.html'], function (err) {
      if (err) {
        console.error('Oh No: ',err);
      }
      // Without the -o arg, the converted value will be returned.
      //return console.log(result), result;
    });
}


// Expect a folder to have an .md file and an optional .js file.
glob('components/*/', function(err, components) {
  for (let componentPath of components) {
    let componentName = componentPath.replace('components/', '').replace('/', '').toLowerCase();

    if (singleComponent && singleComponent.toLowerCase() !==componentName) {
      continue;
    }

    console.log('Generating Docs for :', componentName);

    // Read the md file and Generate the Pandoc / Html file for it
    fs.readFile(componentPath + componentName + '.md', 'utf8' ,function (err, mdData) {

        if (fs.existsSync(componentPath + componentName + '.js')) {
          //Write the file out
          c.execSync('documentation build '+ componentPath + componentName + '.js' +' -f md -o ' + componentPath + componentName + '-api.md');

          //Read it back in
          fs.readFile(componentPath + componentName + '-api.md', 'utf8' ,function (err, apiData) {

            //Some Scrubbing that document.js cant handle
            apiData = apiData.substr(0, apiData.indexOf('### Table')) + apiData.substr(apiData.indexOf('**Parameters**'));
            apiData = apiData.replace(/### /g, '#### ');

            // Add Section Titles
            apiData = apiData.substr(0, apiData.indexOf('####')) + '\n### Functions \n' + apiData.substr(apiData.indexOf('####'));
            apiData = apiData.replace('**Parameters**', '## Api Details \n### Settings');
            apiData = apiData.replace('#### handleEvents', '### Events');
            apiData = apiData.replace('### handleEvents', '### Events');

            // More Fixes
            apiData = apiData.replace('-   `element`', '');

            var fullData = mdData.replace('{{api-details}}', '\r\n'+apiData+'\r\n');
            runPandoc(fullData, componentPath);

            return;
          });

          return;
        }

        runPandoc(mdData, componentPath);
    });
  }
});
