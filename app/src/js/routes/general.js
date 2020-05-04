// General Route
//= ====================================================
const path = require('path');
const express = require('express');

const utils = require('../utils');
const directoryListing = require('./directory-list');
const sendGeneratedDocPage = require('./docs');
const customRouteOptions = require('../custom-route-options');
const setLayout = require('../set-layout');

const router = express.Router();

// =====================================
// General Route Middleware
// =====================================
function generalRoute(req, res, next) {
  const viewsRoot = req.app.get('views');
  const originalUrl = utils.getPathWithoutQuery(req.originalUrl);
  const directoryURL = utils.getDirectory(path.join(viewsRoot, originalUrl), viewsRoot);
  const filename = utils.getFileName(originalUrl);
  const directoryPath = path.join(viewsRoot, directoryURL);
  const fileOnPath = path.join(directoryPath, filename);
  const isDirectory = utils.isType('directory', fileOnPath);

  // Return out on '/';
  if (utils.isRoot(originalUrl)) {
    res.render(path.join(viewsRoot, 'kitchen-sink.html'), res.opts);
    return;
  }

  // In some rare cases, customize view options depending on the route
  res.opts = customRouteOptions(req, res);

  // Only change the layout if it hasn't been previously set by an option
  // in another piece of middleware.  Generally, this will attempt to use the `layout.html` in
  // the target view's directory, or the closest parent directory's `layout.html`.
  if (utils.canChangeLayout(req, res)) {
    setLayout(req, res, utils.getClosestLayoutFile(directoryURL, viewsRoot));
  }

  // If a filename was part of the path, attempt to render it.
  // Otherwise, try to render in a directory listing or default file.
  if (filename && filename.length) {
    if (filename === 'list' || directoryPath.endsWith(filename)) {
      directoryListing(directoryPath, viewsRoot, req, res, next);
      return;
    }

    if (utils.hasFile(fileOnPath)) {
      res.render(utils.getTemplateUrl(fileOnPath.replace(viewsRoot, '')), res.opts);
      return;
    }

    // If given a friendly URL, check for a matching `.html` file.
    if (filename.indexOf('.') === -1) {
      const friendlyURLFilepath = path.resolve(`${viewsRoot}${originalUrl}.html`);
      if (utils.hasFile(friendlyURLFilepath)) {
        res.render(utils.getTemplateUrl(friendlyURLFilepath.replace(viewsRoot, '')), res.opts);
        return;
      }
    }
  }

  // Render an `index.html` page if one exists (Generated Docs page).
  if (utils.hasIndexFile(directoryPath)) {
    res.render(utils.getTemplateUrl(path.join(directoryURL, 'index.html')), res.opts);
    return;
  }

  // Return the directory listing if we're looking at a directory
  if (isDirectory) {
    if (originalUrl.substring(originalUrl.length - 1) === '/') {
      res.redirect(originalUrl.substring(0, originalUrl.length - 1));
      return;
    }
    directoryListing(directoryPath, viewsRoot, req, res, next);
    return;
  }

  // Error out now if nothing matches
  res.status(404);
  next(`File "${fileOnPath}" was not found`);
}

// Removes '/' from the front of the BaseUrl
function cleanBaseUrl(baseUrl) {
  return baseUrl.substring(1);
}

// ==============================================
// General Routes
// ==============================================
router.get('/:item/:example', (req, res, next) => {
  if (req.params.example === 'list') {
    next();
    return;
  }
  generalRoute(req, res, next);
});

router.get('/:item/list', (req, res, next) => {
  generalRoute(req, res, next);
});

router.get('/:item', (req, res, next) => {
  const type = cleanBaseUrl(req.baseUrl);
  const item = req.params.item;

  if (item === 'list') {
    next();
    return;
  }

  const opts = {
    path: path.resolve('app', 'docs', type, `${item}.html`)
  };

  if (type === 'components' && utils.hasFile(opts.path)) {
    sendGeneratedDocPage(opts, req, res, next);
    return;
  }

  generalRoute(req, res, next);
});

router.get('/list', (req, res, next) => {
  generalRoute(req, res, next);
});

router.get('/', (req, res, next) => {
  const type = cleanBaseUrl(req.baseUrl);
  const opts = {
    path: path.resolve('app', 'docs', type, 'index.html')
  };

  if (type === 'components' && utils.hasFile(opts.path)) {
    sendGeneratedDocPage(opts, req, res, next);
    return;
  }

  res.redirect(`${res.opts.basepath}${type}/list`);
});

// Catch-all route for bad URLs.
router.get('*', (req, res, next) => {
  res.status(404);
  next(`File "${req.originalUrl}" was not found`);
});

module.exports = router;
