const extend = require('extend');
const fs = require('fs');
const path = require('path');
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

  // All patterns will use the "empty" layout
  if (url.match(/patterns\//)) {
    if (url.includes('tree-detail') || url.includes('master-detail')) {
      customOpts.layout = 'layout';
    } else if (!url.endsWith('/list')) {
      customOpts.layout = 'layout-empty';
    }
  }

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
    customOpts.layout = 'layout-nofrills';
    customOpts.subtitle = 'AMD Tests';
  }

  // Form Compact's List/Detail Example
  if (url.match(/components\/form-compact\/example-list-detail/)) {
    customOpts.layout = 'layout-empty';
  }

  // Icons
  if (url.match(/icons\/example-index/) || url.match(/icons\/example-extended/) || url.match(/icons\/example-empty/)) {
    customOpts.iconHtml = require('./routes/custom-icons')(url, res.opts.theme);
  }

  // Placement Logic
  if (url.match(/place\/test-container-is-body/)) {
    customOpts.layout = 'components/place/layout-body';
  }
  if (url.match(/place\/test-container-is-nested/)) {
    customOpts.layout = 'components/place/layout-nested';
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

  // Set `forceLayout` to true if there has been a layout defined.
  if (customOpts.layout) {
    customOpts.forceLayout = true;
  }

  return extend({}, res.opts, customOpts);
};
