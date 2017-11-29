/**
 * @class Base
 *
 * Provides a global object that detects the existence of a Base Tag,
 * and provides some methods that can be used to get an accurate relative
 * URL using the base tag.
 *
 * @constructor
 * @param {HTMLElement} element
 * @returns {Base}
 */
function Base(element) {
  this.element = $(element);
  this.url = this.getCurrentURL();

  if (!window.Soho.base) {
    $.detectBaseTag();
  }

  return this;
}


Base.prototype = {
  getCurrentURL: function() {
    return window.location.href
      .replace(window.location.hash, '');
  },

  getBaseURL: function(hash) {
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

// Setup a default function that just returns the contents of the hash,
// if no base tag is present.
$.getBaseURL = function(hash) {
  return hash;
};

// Detect the Base tag and install a global object, if necessary
$.detectBaseTag = function detectBaseTag() {
  var base = $('base[href]');
  if (base.length) {
    window.Soho.base = new Base(base);

    // override the "getBaseURL"
    $.getBaseURL = window.Soho.base.getBaseURL.bind(window.Soho.base);
  }
};

export { Base };
