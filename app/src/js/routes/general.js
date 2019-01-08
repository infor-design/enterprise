// General Route
//= ====================================================
const path = require('path');
const utils = require('../utils');
const directoryListing = require('./directory-list');
const sendGeneratedDocPage = require('./docs');
const customRouteOptions = require('../custom-route-options');
const setLayout = require('../set-layout');
const express = require('express');

const router = express.Router();

// General Route Def
function generalRoute(req, res, next) {
  if (req.query.headerHamburger === 'true') {
    res.opts.headerHamburger = true;
  }
  if (req.query.appMenuOpen === 'true') {
    res.opts.appMenuOpen = true;
  }
  const viewsRoot = req.app.get('views');
  const directoryURL = utils.getDirectory(path.join(viewsRoot, req.originalUrl), viewsRoot);
  const filename = utils.getFileName(req.originalUrl);
  const directoryPath = path.join(viewsRoot, directoryURL);
  const fileOnPath = path.join(directoryPath, filename);

  // Return out on '/';
  if (utils.isRoot(req.originalUrl)) {
    res.render(path.join(viewsRoot, 'kitchen-sink.html'), res.opts);
    next();
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
    if (utils.hasFile(fileOnPath)) {
      res.render(utils.getTemplateUrl(fileOnPath.replace(viewsRoot, '')), res.opts);
      next();
      return;
    }

    next('file not found');
  }

  // Check a friendly URL for a matching `.html` file.
  const friendlyURLFilepath = path.resolve(`${viewsRoot}${utils.getPathWithoutQuery(req.originalUrl)}.html`);
  if (utils.hasFile(friendlyURLFilepath)) {
    res.render(utils.getTemplateUrl(friendlyURLFilepath.replace(viewsRoot, '')), res.opts);
    next();
    return;
  }

  // Render an index.html page if one exists.
  // Otherwise, render the directory listing.
  if (utils.hasIndexFile(directoryPath)) {
    res.render(utils.getTemplateUrl(path.join(directoryURL, 'example-index.html')), res.opts);
    next();
    return;
  }

  // Return the directory listing if we're looking at a directory
  if (utils.isType('directory', directoryPath)) {
    if (req.originalUrl.substring(req.originalUrl.length - 1) === '/') {
      res.redirect(req.originalUrl.substring(0, req.originalUrl.length - 1));
      return;
    }
    directoryListing(directoryPath, viewsRoot, req, res, next);
    return;
  }

  // Error out now if nothing matches
  res.opts.error = {
    code: 404,
    message: 'File not found'
  };
  setLayout(req, res, 'layout-nofrills.html');
  res.status(404).render(path.join(viewsRoot, 'error.html'), res.opts);
  next();
}

// Removes '/' from the front of the BaseUrl
function cleanBaseUrl(baseUrl) {
  return baseUrl.substring(1);
}

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

module.exports = router;
