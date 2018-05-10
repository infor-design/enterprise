// General Route
//= ====================================================
const path = require('path');
const utils = require('../utils');
const directoryListing = require('./directory-list');
const customRouteOptions = require('../custom-route-options');

module.exports = function generalRoute(req, res, next) {
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

  // Only change the layout if it hasn't been previously set by an option
  // in another piece of middleware.  Generally, this will attempt to use the `layout.html` in
  // the target view's directory, or the closest parent directory's `layout.html`.
  if (utils.canChangeLayout(req, res)) {
    const layoutFilename = utils.getLayout(directoryPath, viewsRoot);
    res.opts.layout = layoutFilename || res.opts.layout;
    req.app.set('layout', res.opts.layout);
  }

  // In some rare cases, customize view options depending on the route
  res.opts = customRouteOptions(req, res);

  // If a filename was part of the path, attempt to render it.
  // Otherwise, try to render in a directory listing or default file.
  if (filename && filename.length) {
    if (utils.hasFile(fileOnPath)) {
      res.render(utils.getTemplateUrl(fileOnPath.replace(viewsRoot, '')), res.opts);
      next();
      return;
    }

    res.opts.error = {
      code: 404,
      message: 'File not found'
    };
    res.status(404).render(path.join(viewsRoot, 'error.html'), res.opts);
    return;
  }

  // Check a friendly URL for a matching `.html` file.
  const friendlyURLFilepath = `${viewsRoot}${utils.getPathWithoutQuery(req.originalUrl)}.html`;
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
    directoryListing(directoryPath, viewsRoot, req, res, next);
    return;
  }

  // Error out now if nothing matches
  res.opts.error = {
    code: 404,
    message: 'File not found'
  };
  res.status(404).render(path.join(viewsRoot, 'error.html'), res.opts);
  next();
};
