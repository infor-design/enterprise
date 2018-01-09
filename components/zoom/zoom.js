import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

// jQuery components


/**
 * Component Name
 */
let COMPONENT_NAME = 'zoom';


/**
 * @constructor
 * @param {object} element
 * @param {object} settings
 */
function Zoom(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(element, settings);

  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

Zoom.prototype = {
  init: function() {
    return this
      .build()
      .handleEvents();
  },

  // Add markup to the control
  build: function() {
    // get references to elements
    this.viewport = this.element.find('meta[name=viewport]');
    this.body = $('body');

    return this;
  },

  // Sets up event handlers for this control and its sub-elements
  handleEvents: function() {
    var self = this;

    // Allow the head to listen to events to globally deal with the zoom problem on
    // a per-control basis (for example, Dropdown/Multiselect need to handle this issue manually).
    this.element.on('updated.' + COMPONENT_NAME, function() {
      self.updated();
    }).on('enable-zoom', function() {
      self.enableZoom();
    }).on('disable-zoom', function() {
      self.disableZoom();
    });

    // Don't continue setting this up on each element if
    if (Soho.env.os.name !== 'ios') {
      return this;
    }

    // Setup conditional events for all elements that need it.
    this.body.on('touchstart.zoomdisabler', 'input, label', function() {
      if (self.noZoomTimeout) {
        return;
      }

      self.disableZoom();
    }).on('touchend.zoomdisabler', 'input, label', function() {
      if (self.noZoomTimeout) {
        clearTimeout(self.noZoomTimeout);
        self.noZoomTimeout = null;
      }
      self.noZoomTimeout = setTimeout(function() {
        self.noZoomTimeout = null;
        self.enableZoom();
      }, 600);
    });

    return this;
  },

  // TODO: Test to see if prepending this meta tag conflicts with Base Tag implementation
  enableZoom: function() {
    this.viewport[0].setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=1');
  },

  // TODO: Test to see if prepending this meta tag conflicts with Base Tag implementation
  disableZoom: function() {
    this.viewport[0].setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=0');
  },

  /**
   * Handle Updating Settings
   * @param {object} settings
   */
  updated: function(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    return this
      .teardown()
      .init();
  },

  // Simple Teardown - remove events & rebuildable markup.
  teardown: function() {
    this.element.off('updated.' + COMPONENT_NAME + ' enable-zoom disable-zoom');
    this.body.off('touchstart.zoomdisabler touchend.zoomdisabler');
    return this;
  },

  // Teardown - Remove added markup and events
  destroy: function() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};


export { Zoom, COMPONENT_NAME };
