const extend = require('extend');
const fs = require('fs');
const logger = require('../logger');
const path = require('path');
const URL = require('URL');

// Option Handling - Custom Middleware
// Writes a set of default options the 'req' object.  These options are always eventually passed to the HTML template.
// In some cases, these options can be modified based on query parameters.  Check the default route for these options.
module.exports = function (app, defaults) {
  return function optionHandler(req, res, next) {
    res.opts = extend({}, defaults);

    if (!req.url.includes('api/')) {

      /**
       * Set the theme, theme variant, icons, and colorScheme
       * Example: http://localhost:4000/controls/modal?theme=soho&variant=dark

      * Note: We have a prop called "isSohoUseLegacyNaming" becasue we can't rename the
      * original soho css files and our templating system (hogan/mustache) doesn't do logic.
      */

      // set theme defaults
      const iconsPath = path.resolve(__dirname, '..', '..', '..', '..', 'src', 'components', 'icons');
      res.opts.theme = {
        name: 'soho',
        variant: 'light',
        icons: fs.readFileSync(`${iconsPath}/svg.html`).toString(),
        isSohoUseLegacyNaming: true
      };

      // Set the theme name (soho, uplift...)
      if (req.query.theme && req.query.theme.length > 0) {

        // The legacy possible "theme" values
        const regex = /(light|dark|high-contrast)/gi;

        if (regex.test(req.query.theme)) {
          // If the legacy values are applied to "theme"
          // redirect to the properly named ones
          const q = {...req.query, ...{
            theme: 'soho',
            themeVariant: req.query.theme
          }};
          const theUrl = URL.format({ query: q });
          logger('info', `Redirecting legacy query string params to "${theUrl}"`);
          return res.redirect(theUrl);

        } else {
          // Set the theme
          res.opts.theme.name = req.query.theme.toLowerCase();
        }
      }

      // Set the theme variant (light, dark...)
      if (req.query.themeVariant && req.query.themeVariant.length > 0) {
        res.opts.theme.variant = req.query.themeVariant.toLowerCase();
      }

      // Adapt soho theme icons for backwards compatibility
      let svgHtmlPartial = '';
      if (res.opts.theme.name === 'soho') {
        svgHtmlPartial = fs.readFileSync(`${iconsPath}/svg.html`).toString();
        res.opts.theme.isSohoUseLegacyNaming = true;
      } else {
        svgHtmlPartial = fs.readFileSync(`${iconsPath}/theme-${res.opts.theme.name}-svg.html`).toString();
        res.opts.theme.isSohoUseLegacyNaming = false;
      }
      // Set icons to the partials in hopes its cached
      app.locals.partials = { svgIcons: svgHtmlPartial };

      logger('info', `Setting theme to "${res.opts.theme.name}-${res.opts.theme.variant}"`);
    }

    next();
  };
};
