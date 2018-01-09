import { Icon, COMPONENT_NAME } from './icons';


/**
 * jQuery component wrappers
 */
$.fn.icon = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, COMPONENT_NAME, new Icon(this, settings));
    } else {
      instance.updated(settings);
    }
  });
};


/**
 * Factory Function for instantly building icons.
 * Use this for building icons that don't exist yet.
 * Scoped Privately on purpose...
 */
(function (){
  'use strict';

  function normalizeIconOptions(options) {
    var defaults = {
      icon: 'user-profile', // omit the "icon-" if you want; this code strips it out.
      classes: ['icon']
    };
    options = options || $.extend({}, defaults);

    if (typeof options === 'string') {
      options = $.extend({}, defaults, {
        icon: options.replace('icon-', '')
      });
    }

    // reroute "options.class" if that exists
    if (!options.classes && options.class) {
      options.classes = options.class;
      delete options.class;
    }

    if (!options.classes) {
      options.classes = [].concat(defaults.classes);
    }

    if (typeof options.classes === 'string') {
      options.classes = options.classes.split(' ');
    }

    if (options.classes.indexOf('icon') === -1) {
      options.classes.push('icon');
    }

    return options;
  }

  // Returns the RAW HTML for creating a new icon in string form
  $.createIcon = function createIcon(options) {
    options = normalizeIconOptions(options);

    return [
      '<svg class="' + options.classes.join(' ') + '" focusable="false" aria-hidden="true" role="presentation">' +
        '<use xlink:href="#icon-' + options.icon + '"></use>' +
      '</svg>'
    ].join('');
  };

  // Returns a jQuery-wrapped element containing a new icon
  $.createIconElement = function createIconElement(options) {
    return $($.createIcon(options));
  };

  // Returns just the path part
  $.createIconPath = function createIconElement(options) {
    options = normalizeIconOptions(options);
    return $.getBaseURL('#icon-' + options.icon.replace('icon-',''));
  };

  //Toggle the use or entire svg icon in the case of the polyfill
  $.fn.changeIcon = function(icon) {
    $(this).find('use').attr('xlink:href', $.createIconPath({icon: icon}));
  };

  $.fn.getIconName = function() {
    var svg = $(this),
        use = svg.find('use');

    if (use.length === 1) {
      return use.attr('xlink:href').substr(use.attr('xlink:href').indexOf('#icon-')+6);
    } else {
      return svg.attr('data-icon');
    }

  };

})();
