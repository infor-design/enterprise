/**
 * This script runs during Rollup's execution and determines which types of
 * Javascript bundles should be built based on incoming settings.
 */
const commandLineArgs = require('yargs').argv;
const logger = require('../logger');

// The possible types of ES Bundles
const possibleTypes = ['script', 'iife', 'es', 'esm'];

// run inside `<project_root>/rollup.config.js`
function getTargetBundleTypes(configs) {
  const exports = [];
  let builtEs = false;
  let builtIife = false;

  if (!commandLineArgs.types) {
    logger('info', 'Building a standard IIFE bundle type only...');
    exports.push(configs.standard);
  } else {
    const typesArr = commandLineArgs.types.split(',');
    typesArr.forEach((type) => {
      if (possibleTypes.indexOf(type) === -1) {
        return;
      }
      switch (type) {
        case 'es':
        case 'esm':
          if (builtEs) { // don't build twice
            break;
          }
          logger('info', 'Adding ES Module bundle type to the queue...');
          exports.push(configs.esm);
          builtEs = true;
          break;
        case 'script':
        default: // iife
          if (builtIife) { // don't build twice
            break;
          }
          logger('info', 'Adding IIFE bundle type to the queue...');
          exports.push(configs.standard);
          builtIife = true;
          break;
      }
    });
  }

  return exports;
}

module.exports = getTargetBundleTypes;
