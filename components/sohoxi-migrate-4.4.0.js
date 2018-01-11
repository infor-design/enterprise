/**
 * Migration Code for Soho 4.3.x to 4.4.x (or 5.x?)
 * =================================================
 * Include this file after your `sohoxi.js` and before your application code.
 * NOTE:  Usage of this file should be considered a temporary stop-gap solution.
 * This file can be Used as an instruction manual for bringing your application code up-to-date.
 * Your codebase should be updated to work against current versions of Soho, and you should
 * remove the redirects provided by this file from your application as quickly as possible.
 */

/**
 * The Locale object has moved beneath the Soho object.
 * This simply puts a reference to the internal `Soho.Locale` object directly beneath the window.
 * TO FIX: Change any references in your code from 'Locale' to 'Soho.Locale',
 * or import the Locale system directly.
 * See: SOHO-6796
 */
window.Locale = Soho.Locale;

/**
 * Templating System
 */
window.Tmpl = Soho.Tmpl;

/**
 * TODO: Are people using ListFilter externally?  If so, create a redirect of `Soho.ListFilter` to
 * `window.Listfilter`
 */
window.ListFilter = Soho.ListFilter;

/**
 * Relocation of Datagrid Editors/Formatters?
 */
window.Formatters = Soho.Formatters;
window.Editors = Soho.Editors;
