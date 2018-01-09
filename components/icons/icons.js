import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

/**
 *
 */
let COMPONENT_NAME = 'icon';


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
 * @param {object} element
 */
function Icon(element, settings) {
  this.settings = utils.mergeSettings(element, settings, ICON_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
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

    this.element.on('updated.' + COMPONENT_NAME, function() {
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
    this.element.off('updated.' + COMPONENT_NAME);
    return this;
  },

  // Teardown - Remove added markup and events
  destroy: function() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};


export { Icon, COMPONENT_NAME };
