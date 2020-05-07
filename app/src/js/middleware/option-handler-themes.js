const fs = require('fs');
const path = require('path');
const URL = require('url');
const logger = require('../logger');

// Option Handling - Custom Middleware
// Writes a set of default options the 'req' object.  These options are always eventually passed to the HTML template.
// In some cases, these options can be modified based on query parameters.  Check the default route for these options.
module.exports = function (app) {
  return function optionHandler(req, res, next) {
    /**
     * Set the theme, theme variant, icons, and colorScheme
     * Example: http://localhost:4000/controls/modal?theme=soho&variant=dark
     * ====================================================================================
     * Note: We have a prop called "isSohoUseLegacyNaming" because we can't rename the
     * original soho css files and our templating system (hogan/mustache) doesn't do logic.
    */

    // set theme defaults
    const iconsPath = path.resolve(__dirname, '..', '..', '..', '..', 'src', 'components', 'icons');
    const iconsEmptyPath = path.resolve(__dirname, '..', '..', '..', '..', 'src', 'components', 'emptymessage');
    res.opts.theme = {
      name: 'soho',
      variant: 'light',
      icons: '',
    };

    // Set the theme name (soho, uplift...)
    if (req.query.theme && req.query.theme.length > 0) {
      // The legacy possible "theme" values
      const regex = /(light|dark|high-contrast)/gi;

      if (regex.test(req.query.theme)) {
        // If the legacy values are applied to "theme"
        // redirect to the properly named ones
        const q = {
          ...req.query,
          ...{
            theme: 'soho',
            variant: req.query.theme
          }
        };

        // Translate legacy "high-contrast" into "contrast"
        if (q.variant.indexOf('high-') !== -1) {
          q.variant = q.variant.replace('high-', '');
        }

        const theUrl = URL.format({ query: q });
        logger('info', `Redirecting legacy query string params to "${theUrl}"`);
        res.redirect(theUrl);
        return;
      }

      // Set the theme
      res.opts.theme.name = req.query.theme.toLowerCase();
    }

    // Set the theme variant (light, dark...)
    if (req.query.variant && req.query.variant.length > 0) {
      res.opts.theme.variant = req.query.variant.toLowerCase();
    }
    logger('info', `Setting theme to "theme-${res.opts.theme.name}-${res.opts.theme.variant}"`);
    const svgHtmlPartial = fs.readFileSync(`${iconsPath}/theme-${res.opts.theme.name}-svg.html`).toString();
    const svgEmptyHtmlPartial = fs.readFileSync(`${iconsEmptyPath}/theme-${res.opts.theme.name}-svg-empty.html`).toString();

    // Set icons to the partials
    app.locals.partials = {
      svgIcons: svgHtmlPartial,
      svgEmptyIcons: svgEmptyHtmlPartial
    };
    logger('info', `Setting icons to "theme-${res.opts.theme.name}-svg.html"`);

    next();
  };
};
