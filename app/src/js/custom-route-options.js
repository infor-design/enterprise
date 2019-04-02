const extend = require('extend');
const utils = require('./utils');

// Object with settings that gets stringify
const SohoConfig = {};

// Augments the current set of options for a specific route's needs
module.exports = function customRouteOptions(req, res) {
  const customOpts = {};
  const url = req.originalUrl;

  /**
   * Set the layout if permissions allow
   * @param {string} layoutName - The string name of the layout
   */
  const setCustomLayout = function(layoutName) {
    if (utils.canChangeLayout(req, res)) {
      customOpts.layout = layoutName;
      customOpts.forceLayout = true;
    }
  }

  // All patterns will use the "empty" layout
  if (url.match(/patterns\//)) {
    if (url.includes('tree-detail') || url.includes('master-detail')) {
      setCustomLayout('layout');
    } else if (!url.endsWith('/list')) {
      setCustomLayout('layout-empty');
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
      setCustomLayout('layout-nofrills'); // No layout for this one on purpose).
    }
  }

  // Datagrid
  if (url.match(/datagrid-fixed-header/)) {
    setCustomLayout('tests/layout-noscroll');
  }

  // Distribution (AMD)
  if (url.match(/tests\/distribution/)) {
    customOpts.amd = true;
    setCustomLayout('layout-nofrills');
    customOpts.subtitle = 'AMD Tests';
  }

  // Form Compact's List/Detail Example
  if (url.match(/components\/form-compact\/example-list-detail/)) {
    setCustomLayout('layout-empty');
  }

  // Icons
  if (url.match(/icons\/example-index/) || url.match(/icons\/example-extended/) || url.match(/icons\/example-empty/)) {
    customOpts.iconHtml = require('./routes/custom-icons')(url, res.opts.theme);
  }

  // Placement Logic
  if (url.match(/place\/test-container-is-body/)) {
    setCustomLayout('components/place/layout-body');
  }
  if (url.match(/place\/test-container-is-nested/)) {
    setCustomLayout('components/place/layout-nested');
  }

  // RenderLoop
  if (url.indexOf('renderloop/example-delayed-start') > -1) {
    SohoConfig.renderLoop = {};
    SohoConfig.renderLoop.noAutoStart = true;
  }

  // Searchfield in Headers (needs to load the Header layout)
  if (url.match(/searchfield\/example-header/)) {
    setCustomLayout('components/header/layout');
  }

  // Sign-in Dialog
  if (url.match(/tests\/signin/)) {
    setCustomLayout('tests/layout-noheader');
  }

  // If there have been properties added to SohoConfig,
  // stringify and pass it to the view options
  if (Object.keys(SohoConfig).length) {
    customOpts.SohoConfig = JSON.stringify(SohoConfig);
  }

  return extend({}, res.opts, customOpts);
};
