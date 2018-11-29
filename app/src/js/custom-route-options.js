const extend = require('extend');
const utils = require('./utils');

// Object with settings that gets stringify
const SohoConfig = {};

// Augments the current set of options for a specific route's needs
module.exports = function customRouteOptions(req, res) {
  if (!utils.canChangeLayout(req, res)) {
    return res.opts;
  }

  const customOpts = {};
  const url = req.originalUrl;

  // Application Menu
  if (url.match(/components\/applicationmenu/)) {
    if (url.indexOf('/list') === -1) {
      customOpts.headerHamburger = true;
    }
  }

  // Base Tag
  if (url.match(/components\/base-tag/)) {
    customOpts.usebasehref = true;
  }

  // Contextual Action Panel
  if (url.match(/components\/contextualactionpanel/)) {
    if (url.match(/partial-/)) {
      customOpts.layout = 'layout-nofrills'; // No layout for this one on purpose.
    }
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

  // RenderLoop
  if (url.indexOf('renderloop/example-delayed-start') > -1) {
    SohoConfig.renderLoop = {};
    SohoConfig.renderLoop.noAutoStart = true;
  }

  // Searchfield in Headers (needs to load the Header layout)
  if (url.match(/searchfield\/example-header/)) {
    customOpts.layout = 'components/header/layout';
  }

  // Sign-in Dialog
  if (url.match(/tests\/signin/)) {
    customOpts.layout = 'tests/layout-noheader';
  }

  // If there have been properties added to SohoConfig,
  // stringify and pass it to the view options
  if (Object.keys(SohoConfig).length) {
    customOpts.SohoConfig = JSON.stringify(SohoConfig);
  }

  return extend({}, res.opts, customOpts);
};
