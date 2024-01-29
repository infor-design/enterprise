import * as fs from 'fs';
import * as path from 'path';
import URL, { fileURLToPath } from 'url';
import logger from '../logger.js';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

// Option Handling - Custom Middleware
// Writes a set of default options the 'req' object.  These options are always eventually passed to the HTML template.
// In some cases, these options can be modified based on query parameters.  Check the default route for these options.
export default function (app) {
  return function optionHandler(req, res, next) {
    /**
     * Set the theme, theme variant, icons, and colorScheme
     * Examples:
     * http://localhost:4000/controls/modal?theme=classic&mode=dark
     * ====================================================================================
     * Note: We have a prop called "isSohoUseLegacyNaming" because we can't rename the
     * original soho css files and our templating system (hogan/mustache) doesn't do logic.
    */

    // set theme defaults
    const iconsPath = path.resolve(__dirname, '..', '..', '..', '..', 'src', 'components', 'icons');
    const iconsEmptyPath = path.resolve(__dirname, '..', '..', '..', '..', 'src', 'components', 'emptymessage');
    res.opts.theme = {
      name: 'new',
      mode: 'light',
      icons: '',
    };

    // Set the theme name (soho, uplift, new, classic...)
    if (req.query.theme && req.query.theme.length > 0) {
      // The legacy possible "theme" values
      const regex = /(light|dark|high-contrast)/gi;

      if (regex.test(req.query.theme)) {
        // If the legacy values are applied to "theme"
        // redirect to the properly named ones
        const q = {
          ...req.query,
          ...{
            theme: 'new',
            mode: req.query.mode
          }
        };

        // Translate legacy "high-contrast" into "contrast"
        if (q.variant && q.variant.toString().indexOf('high-') !== -1) {
          q.mode = q.variant.toString().replace('high-', '');
          delete q.variant;
        }
        if (q.mode && q.mode.toString().indexOf('high-') !== -1) {
          q.mode = q.mode.toString().replace('high-', '');
        }

        const theUrl = URL.format({ query: q });
        logger('info', `Redirecting legacy query string params to "${theUrl}"`);
        res.redirect(theUrl);
        return;
      }

      // Set the theme
      let themeName = req.query.theme.toLowerCase();
      themeName = themeName.replace('soho', 'classic').replace('uplift', 'new');
      res.opts.theme.name = themeName;
    }

    // Set the theme variant (light, dark...)
    if (req.query.variant && req.query.variant.length > 0) {
      res.opts.theme.mode = req.query.variant.toString().toLowerCase();
      delete req.query.variant;
    }
    if (req.query.mode && req.query.mode.length > 0) {
      res.opts.theme.mode = req.query.mode.toString().toLowerCase();
    }
    logger('info', `Setting theme to "theme-${res.opts.theme.name}-${res.opts.theme.mode || req.query.variant}"`);

    let svgHtmlPartial = '';
    let svgEmptyHtmlPartial = '';

    if (res.opts.theme.name === 'new') {
      svgHtmlPartial = fs.readFileSync(`${iconsPath}/theme-new-default-svg.html`).toString();
      svgEmptyHtmlPartial = fs.readFileSync(`${iconsEmptyPath}/theme-new-svg-empty.html`).toString();
    } else {
      svgHtmlPartial = fs.readFileSync(`${iconsPath}/theme-classic-svg.html`).toString();
      svgEmptyHtmlPartial = fs.readFileSync(`${iconsEmptyPath}/theme-classic-svg-empty.html`).toString();
    }

    // Set icons to the partials
    app.locals.partials = {
      svgIcons: svgHtmlPartial,
      svgEmptyIcons: svgEmptyHtmlPartial
    };
    logger('info', `Setting icons to "theme-${res.opts.theme.name}-svg.html"`);

    next();
  };
}
