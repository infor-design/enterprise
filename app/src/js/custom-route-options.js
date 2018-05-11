const extend = require('extend');
const utils = require('./utils');

// Augments the current set of options for a specific route's needs
module.exports = function customRouteOptions(req, res) {
  if (!utils.canChangeLayout(req, res)) {
    return res.opts;
  }

  const customOpts = {};
  const url = req.originalUrl;

  // Base Tag
  if (url.match(/components\/base-tag/)) {
    customOpts.usebasehref = true;
  }

  // Datagrid
  if (url.match(/datagrid-fixed-header/)) {
    customOpts.layout = 'tests/layout-noscroll';
  }

  // Distribution (AMD)
  if (url.match(/tests\/distribution/)) {
    customOpts.amd = true;
    customOpts.layout = null; // No layout for this one on purpose.
    customOpts.subtitle = 'AMD Tests';
  }

  // Header
  if (url.match(/header\/layout-header-gauntlet/)) {
    customOpts.layout = 'components/header/layout-header-gauntlet';
  }

  // Placement Logic
  if (url.match(/place\/scrolling\/container-is-body/)) {
    customOpts.layout = 'components/place/scrolling/layout-body';
  }
  if (url.match(/place\/scrolling\/container-is-nested/)) {
    customOpts.layout = 'components/place/scrolling/layout-nested';
  }

  // Sign-in Dialog
  if (url.match(/tests\/signin/)) {
    customOpts.layout = 'tests/layout-noheader';
  }

  return extend({}, res.opts, customOpts);
};
