/* eslint-disable */
// =========================================
// Fake 'API' Calls for use with AJAX-ready Controls
// =========================================

// Sample Json call that returns States
// Example Call: http://localhost:4000/api/states?term=al

const path = require('path');
const getJSONFile = require('../get-json-file');
const utils = require('../utils');
const express = require('express');
const generalRoute = require('./general');

const router = express.Router();

const JS_REGEX = /\.js$/i;
const JSON_REGEX = /\.json$/i;

// Handles the sending of an incoming JSON file
function sendJSONFile(filepath, req, res, next) {
  const data = getJSONFile(`${filepath}.json`);
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/json'
  });
  res.json(data);
  next();
}

// Gets an internally-corrected path to a specified file.
function getDataFilePath(filename) {
  return path.resolve(__dirname, '..', '..', '..', 'data', filename);
}

// Calls out to an external piece of middleware that will pass JS data.
function handleJSFile(jsFilename, req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  });

  const middleware = require(jsFilename);
  return middleware(req, res, next);
}

// ========================================
// API Routes
// ========================================
router.get('/', (req, res, next) => {
  generalRoute(req, res, next);
});

router.get('/:fileName', (req, res, next) => {
  const filename = req.params.fileName;
  let filepath = getDataFilePath(filename);
  let isJSONFile = filename.match(JSON_REGEX);
  let isJSFile = filename.match(JS_REGEX);

  if (isJSONFile) {
    if (utils.hasFile(filepath)) {
      sendJSONFile(filepath.replace(JSON_REGEX, ''), req, res, next);
      return;
    }
    res.status(404);
    next(`No .JSON file named "${filename}" found`);
    return;
  }

  if (isJSFile) {
    if (utils.hasFile(filepath)) {
      handleJSFile(filepath);
      return;
    }
    res.status(404);
    next(`No .JSON file named "${filename}" found`);
    return;
  }

  // Check for JSON file
  const jsonFilename = `${filename}.json`;
  filepath = getDataFilePath(jsonFilename);
  if (utils.hasFile(filepath)) {
    sendJSONFile(filepath.replace(JSON_REGEX, ''), req, res, next);
    return;
  }

  // Check for JS file
  const jsFilename = `${filename}.js`;
  filepath = getDataFilePath(jsFilename);
  if (utils.hasFile(filepath)) {
    handleJSFile(filepath, req, res, next);
    return;
  }

  res.status(500);
  next(`Can\'t do anything with file "${filepath}"`);
});

module.exports = router;
