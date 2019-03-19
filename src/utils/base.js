import { warnAboutDeprecation } from './deprecated';

/**
 * Provides a global object that detects the existence of a Base Tag,
 * and provides some methods that can be used to get an accurate relative
 * URL using the base tag.
 * @class Base
 * @constructor
 * @param {HTMLElement} element the Base Tag Element
 * @returns {Base} component instance
 */
function Base(element) {
  this.element = $(element);
  return this;
}

Base.prototype = {

  /**
   * @private
   * @returns {string} current page URL
   */
  get url() {
    return window.location.href
      .replace(window.location.hash, '');
  },

  /**
   * @private
   * @returns {string} the base tag's `href` attribute
   */
  get href() {
    return this.element[0].getAttribute('href');
  },

  /**
   * This method is slated to be removed in a future v4.18.0 or v5.0.0.
   * @deprecated as of v4.12.0. Please use the `url` property instead.
   * @returns {string} current page URL
   */
  getCurrentURL() {
    warnAboutDeprecation('url', 'getCurrentURL');
    return this.url;
  },

  /**
   * Gets a copy of a URL prepended with the contents of the Base Tag's hash.
   * If there's no base tag present, this simply returns the hash provided.
   * @param {string} hash the URL to be checked.
   * @returns {string} the current URL prepended with the Base Tag's ref, if necessary
   */
  getBaseURL(hash) {
    // If no valid base tag exists, just return the hash provided.
    if (!this.element.length || (!this.href || this.href === '/')) {
      if (!hash) {
        return '';
      }
      return hash;
    }

    if (hash) {
      if (hash.indexOf('/') === 0) {
        return hash;
      }

      hash = (hash.indexOf('#') === -1 ? '#' : '') + hash;
      return this.url + hash;
    }

    return this.url;
  }
};

// Setup a Base Tag Component instance
const base = new Base($('base[href]'));

/**
 * Setup a default function that just returns the contents of the hash,
 * if no base tag is present.
 * @param {string} hash the URL to be checked.
 * @returns {string} the current URL prepended with the Base Tag's ref, if necessary
 */
$.getBaseURL = function (hash) {
  return base.getBaseURL(hash);
};

export { base };
