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
  this.url = this.getCurrentURL();
  return this;
}

Base.prototype = {

  /**
   * @private
   * @returns {string} current page URL
   */
  getCurrentURL() {
    return window.location.href
      .replace(window.location.hash, '');
  },

  /**
   * Gets a copy of a URL prepended with the contents of the Base Tag's hash.
   * If there's no base tag present, this simply returns the hash provided.
   * @param {string} hash the URL to be checked.
   * @returns {string} the current URL prepended with the Base Tag's ref, if necessary
   */
  getBaseURL(hash) {
    // If no base tag exists, just return the hash provided.
    if (!this.element.length) {
      return hash;
    }

    if (hash) {
      // absolute links
      if (hash.indexOf('/') === 0) {
        return window.location.origin + hash;
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

/**
 * Detect the Base tag and install a global object, if necessary.
 * Does nothing right now.
 * @deprecated as of v4.4.0
 */
$.detectBaseTag = function () {};

export { base };
