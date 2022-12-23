// Simple plugin for rollup that detects the existence of JSDoc @deprecated comments
// and pumps them into the console during the build process.
import chalk from 'chalk';
import { build } from 'documentation';
import * as path from 'path';
import logger from '../logger.js';

const projectRoot = process.cwd();

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
  const formattedName = chalk.white.bold(`${componentName}.${methodName}()`);
  const msgStr = `${parseChildren(deprecatedObj)}` || '';

  logger('alert', `${formattedName} is deprecated ${msgStr}`);
};

// Connect to Rollup.js's `transform` hook to get access to an individual ES Module.
// This doesn't actually "transform" the code, but will pass its contents into
// Documentation.js for detection of a `@deprecated` tag.
const transform = function (code, filePath) {
  const ret = null;

  if (!filePath || !filePath.includes(path.join(projectRoot, 'src'))) {
    return ret;
  }

  build([filePath], { extension: 'js', shallow: true })
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

  return ret;
};

// The actual Rollup.js plugin wrapper
export default function (opts = {}) {
  const pluginContents = {
    name: 'deprecation-notice'
  };

  // Only do the processing if `process` is set to `true`.
  // This gets passed in from `rollup.config.js`
  if (opts && !opts.process) {
    return pluginContents;
  }

  pluginContents.transform = transform;
  return pluginContents;
}
