import extend from 'extend';
import utils from './utils.js';
import customIconsRoute from './routes/custom-icons.js';

// Object with settings that gets stringify
const SohoConfig = {};

class CustomOptions {
  constructor(req, res) {
    const canChangeLayout = utils.canChangeLayout(req, res);
    const customOpts = {};

    this.setOption = function (optionName, value) {
      if (optionName === 'layout' && canChangeLayout) {
        customOpts.layout = value;
        customOpts.forceLayout = true;
      } else if (optionName !== 'layout') {
        customOpts[optionName] = value;
      }
    };

    this.getOptions = function () {
      return customOpts;
    };
  }
}

// Augments the current set of options for a specific route's needs
export default function customRouteOptions(req, res) {
  const customOpts = new CustomOptions(req, res);
  const url = req.originalUrl;

  // All routes will require a minified `sohoxi.js` and locale cultures,
  // if the query param was previously set.
  if (res.opts.minify) {
    SohoConfig.minifyCultures = true;
  }

  // Application Menu
  if (url.match(/components\/applicationmenu/)) {
    if (url.indexOf('/list') === -1 && url !== '/components/applicationmenu') {
      customOpts.setOption('headerHamburger', true);
    }
  }

  // Base Tag
  if (url.match(/components\/base-tag/)) {
    customOpts.setOption('usebasehref', true);
  }

  // Contextual Action Panel
  if (url.match(/components\/contextualactionpanel/)) {
    if (url.match(/partial-/)) {
      customOpts.setOption('layout', 'layout-nofrills'); // No layout for this one on purpose).
    }
  }

  // Datagrid
  if (url.match(/datagrid-fixed-header/)) {
    customOpts.setOption('layout', 'tests/layout-noscroll');
  }

  // Distribution (AMD)
  if (url.match(/tests\/distribution/)) {
    customOpts.setOption('amd', true);
    customOpts.setOption('layout', 'layout-nofrills');
    customOpts.setOption('subtitle', 'AMD Tests');
  }

  // Form Compact's List/Detail Example
  if (url.match(/components\/form-compact\/example-list-detail/)) {
    customOpts.setOption('layout', 'layout-empty');
  }

  // Icons
  if (url.match(/icons\/example-index/) || url.match(/icons\/example-extended/) || url.match(/icons\/example-empty/)) {
    const html = customIconsRoute(url, res.opts.theme.name);
    customOpts.setOption('iconHtml', html);
  }

  // Modal's `iframe` Example
  if (url.match(/modal\/test-iframe/)) {
    customOpts.setOption('layout', 'components/modal/layout-iframe');
  }

  // Placement Logic
  if (url.match(/place\/test-container-is-body/)) {
    customOpts.setOption('layout', 'components/place/layout-body');
  }
  if (url.match(/place\/test-container-is-nested/)) {
    customOpts.setOption('layout', 'components/place/layout-nested');
  }

  // RenderLoop
  if (url.indexOf('renderloop/example-delayed-start') > -1) {
    SohoConfig.renderLoop = {};
    SohoConfig.renderLoop.noAutoStart = true;
  }

  // Searchfield in Headers (needs to load the Header layout)
  if (url.match(/searchfield\/example-header/)) {
    customOpts.setOption('layout', 'components/header/layout');
  }

  // Busyindicator on body tag (needs to load busyindicator on the body tag)
  if (url.match(/busyindicator\/test-busyindicator-on-body/)) {
    customOpts.setOption('layout', 'layout-empty');
  }

  // Busyindicator on maincontent container
  if (url.match(/busyindicator\/test-on-maincontent/)) {
    customOpts.setOption('layout', 'layout-empty');
  }

  // Sign-in Dialog
  if (url.match(/tests\/signin/)) {
    customOpts.setOption('layout', 'tests/layout-noheader');
  }

  // If there have been properties added to SohoConfig,
  // stringify and pass it to the view options
  if (Object.keys(SohoConfig).length) {
    customOpts.setOption('SohoConfig', JSON.stringify(SohoConfig));
  }

  return extend({}, res.opts, customOpts.getOptions());
}
