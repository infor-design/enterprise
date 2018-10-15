#!/usr/bin/env node
/*
 * Detects established custom build test manifests, and provides the list of
 * required tests to another script.
 */

const fs = require('fs');
const path = require('path');

const types = ['functional', 'e2e'];
const EMPTY = [];

function getCustomSpecs(type) {
  let fileName = 'tests-functional.txt';
  if (type === 'e2e') {
    fileName = 'tests-e2e.txt';
  }

  const filePath = path.resolve(__dirname, '..', '..', 'dist', 'tests', fileName);

  const specs = fs.readFileSync(filePath, 'utf8');
  if (!specs || !specs.length) {
    return EMPTY;
  }
  return specs.split('\n');
}

module.exports = function (testType) {
  if (!testType || types.indexOf(testType) === -1) {
    return EMPTY;
  }

  return getCustomSpecs(testType);
};
