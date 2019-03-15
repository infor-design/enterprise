#!/usr/bin/env node
/*
 * Detects established custom build test manifests, and provides the list of
 * required tests to another script.
 */

const fs = require('fs');
const path = require('path');
const logger = require('../../scripts/logger');

const types = ['functional', 'e2e'];
const EMPTY = [];

const DEFAULT_E2E_SPECS = {
  initial: [
    'behaviors/**/*.e2e-spec.js',
    'kitchen-sink.e2e-spec.js'
  ],
  components1: [
    'components/[a-m]*/*.e2e-spec.js',
  ],
  components2: [
    'components/[n-z]*/*.e2e-spec.js',
  ]
};

const DEFAULT_FUNC_SPECS = [
  'behaviors/**/*.func-spec.js',
  'components/**/*.func-spec.js'
];

/**
 * @param {string} type
 * @param {string} testSegment
 */
const useDefaults = (type, testSegment) => {
  if (type === 'e2e') {
    return DEFAULT_E2E_SPECS[testSegment];
  }
  return DEFAULT_FUNC_SPECS;
};

/**
 * @param {string} type
 * @param {string} testSegment
 */
function getCustomSpecs(type, testSegment) {
  const fileName = `tests-${type}.txt`;
  const filePath = path.resolve(__dirname, '..', '..', 'dist', 'log', fileName);
  let specs;

  // If there is no custom specs file
  try {
    specs = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    logger('warn', `Test manifest at "${filePath}" doesn't exist, using default ${type} specs blob...\n`);
  }

  if (!specs || !specs.length) {
    return useDefaults(type, testSegment);
  }

  return specs.split('\n').filter(el => el !== null && el !== '');
}

module.exports = function (testType, envSpecs, testSegment) {
  if (envSpecs) return envSpecs.split(',');
  if (!testSegment) testSegment = '';
  if (!testType || !types.includes(testType)) return EMPTY;
  return getCustomSpecs(testType, testSegment);
};
