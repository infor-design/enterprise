/**
 * This script runs during Rollup's execution and determines which types of
 * Javascript bundles should be built based on incoming settings.
 */
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from '../logger.js';

const argv = _yargs(hideBin(process.argv)).argv;

// The possible types of ES Bundles
const possibleTypes = ['script', 'iife', 'es', 'esm'];

// run inside `<project_root>/rollup.config.js`
export default function getTargetBundleTypes(configs) {
  const exports = [];
  let builtEs = false;
  let builtIife = false;

  if (!argv.types) {
    logger('info', 'Building a standard IIFE bundle type only...');
    exports.push(configs.standard);
  } else {
    const typesArr = argv.types.split(',');
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
