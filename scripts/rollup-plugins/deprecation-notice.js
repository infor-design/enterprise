// Simple plugin for rollup that detects the existence of JSDoc @deprecated comments
// and pumps them into the console during the build process.
const chalk = require('chalk');
const documentation = require('documentation');
const logger = require('../logger');

let deprecationCount = 0;
const EMPTY_MAP = {
  mappings: ''
};

// Method for parsing the `children` of a deprecated comment node, which can
// include paragraphs, spans, and other text-containing nodes.
const parseChildren = function (obj) {
  let str = '';
  if (obj) {
    if (obj.value) {
      str += `${obj.value}`;
    } else if (obj.children) {
      obj.children.forEach((child) => {
        str += parseChildren(child);
      });
    }
  }
  return str;
};

// Logs the deprecation notice in the terminal
const logDeprecation = function (componentName, methodName, deprecatedObj) {
  const formattedMethodName = chalk.white.bold(`${methodName}()`);
  const msgStr = `: ${parseChildren(deprecatedObj)}` || '';

  // If this is the first one, add a header to separate it
  if (deprecationCount === 0) {
    logger(chalk.yellow.bold('IDS Deprecation Warnings:'));
  }
  deprecationCount++;

  logger('alert', `${componentName}.${formattedMethodName}${msgStr}`);
};

// Connect to Rollup.js's `transform` hook to get access to an individual ES Module.
// This doesn't actually "transform" the code, but will pass its contents into
// Documentation.js for detection of a `@deprecated` tag.
const transform = function (code, filePath) {
  documentation
    .build([filePath], { extension: 'js', shallow: true })
    .then((docs) => {
      if (!docs || !docs.length) {
        return;
      }

      docs.forEach((doc) => {
        if (!doc.members || !doc.members.instance || !doc.members.instance.length) {
          return;
        }

        const methods = doc.members.instance;
        methods.forEach((method) => {
          if (method.deprecated) {
            logDeprecation(doc.name, method.name, method.deprecated);
          }
        });
      });
    })
    .catch((err) => {
      logger('error', `${err}`);
    });

  return {
    code,
    map: EMPTY_MAP
  };
};

// The actual Rollup.js plugin wrapper
const plugin = function () {
  debugger;

  return {
    name: 'deprecation-notice',
    transform
  };
};

module.exports = plugin;
