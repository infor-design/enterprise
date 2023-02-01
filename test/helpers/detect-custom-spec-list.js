#!/usr/bin/env node
/* eslint-disable no-underscore-dangle */
/*
 * Detects established custom build test manifests, and provides the list of
 * required tests to another script.
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import logger from '../../scripts/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const types = ['functional', 'e2e'];
const EMPTY = [];

const DEFAULT_E2E_SPECS = {};
DEFAULT_E2E_SPECS.all = [
  'behaviors/**/*.e2e-spec.js',
  'components/**/*.e2e-spec.js',
  'kitchen-sink.e2e-spec.js'
];

DEFAULT_E2E_SPECS.group0 = [
  'components/datagrid/*.e2e-spec.js',
];

DEFAULT_E2E_SPECS.group1 = [
  'components/datepicker/*.e2e-spec.js',
  'components/donut/*.e2e-spec.js',
  'components/drag/*.e2e-spec.js',
  'components/dropdown/*.e2e-spec.js',
];

DEFAULT_E2E_SPECS.group2 = [
  'behaviors/**/*.e2e-spec.js',
  'components/[abcefghijkl]*/*.e2e-spec.js',
  'kitchen-sink.e2e-spec.js'
];

DEFAULT_E2E_SPECS.group3 = [
  'components/[mnopqrstuvwxyz]*/*.e2e-spec.js',
];

const DEFAULT_FUNC_SPECS = [
  'behaviors/**/*.func-spec.js',
  'components/**/*.func-spec.js'
];

function getCustomSpecs(type, group) {
  let fileName = 'tests-functional.txt';
  if (type === 'e2e') {
    fileName = 'tests-e2e.txt';
  }

  const filePath = path.resolve(__dirname, '..', '..', 'dist', 'log', fileName);

  function defaults() {
    if (type === 'e2e') {
      return DEFAULT_E2E_SPECS[group || 'all'];
    }
    return DEFAULT_FUNC_SPECS;
  }

  // If there is no custom specs file,
  let specs;
  try {
    specs = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    logger('warn', `Test manifest at "${filePath}" doesn't exist, using default ${type} specs blob...\n`);
    return defaults();
  }

  if (!specs || !specs.length) {
    return defaults();
  }

  return specs.split('\n').filter(el => el !== null && el !== '');
}

export default function (testType, envSpecs, group) {
  if (envSpecs) {
    return envSpecs.split(',');
  }

  if (!testType || types.indexOf(testType) === -1) {
    return EMPTY;
  }

  return getCustomSpecs(testType, group);
}
