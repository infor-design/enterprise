/**
 * SVG icons with xlink:href playing nice with <base href=""> tag.
 * For more details see - http://jira.infor.com/browse/SOHO-3847
*/

/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  // private scope
  (function (){
    'use strict';

    // Current URL, without the hash
    var baseUrl = window.location.href
      .replace(window.location.hash, '');

    var defaults = {
      cls: '',
      classes: ['icon']
    };

    function normalizeOptions(options) {
      if (typeof options === 'string') {
        return $.extend({}, defaults, {
          icon: options
        });
      } else {
        return $.extend({}, defaults, options);
      }
    }

    var hasBase = function () {
      var has; // cached value to avoid asking DOM all the time (assuming it is never changed)
      return function() {
        if (typeof has === 'undefined') {
          has = !!document.querySelectorAll('base[href]').length;
        }

        return has;
      };
    }();

    // Public functions
    $.getSvgIconLink = function (link) {
      if (hasBase() && link.charAt(0) === '#') {
        return baseUrl + link;
      }

      return link;
    };

    /**
     * Creates SVG icon as string.
     * @param options
     * @returns {string}
     */
    $.svgIconRaw = function (options) {
      var opts = normalizeOptions(options);
      var classes = opts.classes || [];

      if (opts.cls) {
        classes = classes.concat(opts.cls);
      }

      return [
        '<svg class="' + classes.join(' ') + '" focusable="false" aria-hidden="true" role="presentation">',
          '<use xlink:href="' + $.getSvgIconLink('#icon-' + opts.icon) + '"/>',
        '</svg>'
      ].join('');
    };

    /**
     * Creates SVG icon as jQuery element
     * @param options
     * @returns {jQuery}
     */
    $.svgIcon = function (options) {
      return $($.svgIconRaw(options));
    };

    // jQuery plugin
    $.fn.appendSvgIcon = function(options) {
      if (this.length !== 1) {
        throw 'Icon can be appended to exactly one jQuery element';
      }

      return this.each(function() {
        var icon = $.svgIcon(options),
          parent = $(this);

        icon.appendTo(parent);
      });
    };
  })();

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
