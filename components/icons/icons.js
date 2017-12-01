import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

/**
 *
 */
let PLUGIN_NAME = 'icon';


/**
 * Default Options
 */
let ICON_DEFAULTS = {
  use: 'user-profile', // Match this to one of the SoHo Xi icons, prefixed with an ID of '#icon-'
  focusable: false
};


/**
 * Icon Control
 * Wraps SVG Icons with a Javascript control that can change the icon type, reference
 * relative or absolute URLs, and clean up after itself.  Works with the Base tag.
 * @constructor
 * @param {Object} element
 */
function Icon(element, settings) {
  this.settings = utils.mergeSettings(element, settings, ICON_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(PLUGIN_NAME);
  this.init();
  debug.logTimeEnd(PLUGIN_NAME);
}

// Plugin Methods
Icon.prototype = {
  init: function() {
    this.getExistingUseTag();

    //Do other init (change/normalize settings, load externals, etc)
    return this
      .render()
      .handleEvents();
  },

  // Add markup to the control
  render: function() {
    var self = this;
    this.element.addClass('icon');

    if (!this.element.is('svg')) {
      // TODO: Possibly work with span-based icons here?
      return this;
    }

    // Get a "base-tag-proof" version of the Use tag's definition.
    // jQuery can't work with SVG elements, so we just modify it with regular DOM APIs
    var use = this.element[0].getElementsByTagName('use')[0];
    if (!use) {
      return this;
    }

    if (use.getAttribute('xlink:href') !== self.getBasedUseTag()) {
      setTimeout(function () {
        use.setAttribute('xlink:href', self.getBasedUseTag());
      }, 0);
    }

    return this;
  },

  getBasedUseTag: function() {
    return $.getBaseURL('#icon-' + this.settings.use);
  },

  // In the event that a <use> tag exists on an icon, we want to retain it
  // and replace the settings.
  getExistingUseTag: function() {
    if (!this.element.is('svg')) {
      return;
    }

    var useTag = this.element.children('use');
    if (!useTag.length) {
      return this;
    }

    var xlinkHref = useTag.attr('xlink:href');
    this.settings.use = xlinkHref.replace('#icon-', '');

    return this;
  },

  // Sets up event handlers for this control and its sub-elements
  handleEvents: function() {
    var self = this;

    this.element.on('updated.' + PLUGIN_NAME, function() {
      self.updated();
    });

    return this;
  },

  // Handle Updating Settings
  updated: function(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    return this
      .teardown()
      .init();
  },

  // Simple Teardown - remove events & rebuildable markup.
  teardown: function() {
    this.element.off('updated.' + PLUGIN_NAME);
    return this;
  },

  // Teardown - Remove added markup and events
  destroy: function() {
    this.teardown();
    $.removeData(this.element[0], PLUGIN_NAME);
  }
};


/**
 * jQuery component wrappers
 */
$.fn.icon = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (!instance) {
      instance = $.data(this, PLUGIN_NAME, new Icon(this, settings));
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


export { Icon };
