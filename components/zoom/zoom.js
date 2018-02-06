import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Environment as env } from '../utils/environment';

// Name of this component
const COMPONENT_NAME = 'zoom';

/**
* The Zoom Component is used to manage zoom on mobile devices.
* @class Accordion
* @param {object} element The component element.
* @param {object} settings The component settings.
*/
function Zoom(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(element, settings);

  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

Zoom.prototype = {
  init() {
    return this
      .build()
      .handleEvents();
  },

  /**
  * Add markup to the control
  * @private
  * @returns {object} The api prototype for chaining.
  */
  build() {
    // get references to elements
    this.viewport = this.element.find('meta[name=viewport]');
    this.body = $('body');

    return this;
  },

  /**
  * Sets up event handlers for this control and its sub-elements
  * @private
  * @returns {object} The api prototype for chaining.
  */
  handleEvents() {
    const self = this;

    // Allow the head to listen to events to globally deal with the zoom problem on
    // a per-control basis (for example, Dropdown/Multiselect need to handle this issue manually).
    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      self.updated();
    }).on('enable-zoom', () => {
      self.enableZoom();
    }).on('disable-zoom', () => {
      self.disableZoom();
    });

    // Don't continue setting this up on each element if
    if (env.os.name !== 'ios') {
      return this;
    }

    // Setup conditional events for all elements that need it.
    this.body.on('touchstart.zoomdisabler', 'input, label', () => {
      if (self.noZoomTimeout) {
        return;
      }

      self.disableZoom();
    }).on('touchend.zoomdisabler', 'input, label', () => {
      if (self.noZoomTimeout) {
        clearTimeout(self.noZoomTimeout);
        self.noZoomTimeout = null;
      }
      self.noZoomTimeout = setTimeout(() => {
        self.noZoomTimeout = null;
        self.enableZoom();
      }, 600);
    });

    return this;
  },

  /**
  * Enable zoom by un-setting the meta tag.
  * @returns {void}
  */
  enableZoom() {
    // TODO: Test to see if prepending this meta tag conflicts with Base Tag implementation
    this.viewport[0].setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=1');
  },

  /**
  * Disable zoom by setting the meta tag.
  * @returns {void}
  */
  disableZoom() {
    // TODO: Test to see if prepending this meta tag conflicts with Base Tag implementation
    this.viewport[0].setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=0');
  },

  /**
  * Handle Updating Settings
  * @param {object} settings The settings to update to.
  * @returns {this} component instance
  */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    return this
      .teardown()
      .init();
  },

  /**
  * Simple Teardown - remove events & rebuildable markup.
  * @private
  * @returns {object} component instance
  */
  teardown() {
    this.element.off(`updated.${COMPONENT_NAME} enable-zoom disable-zoom`);
    this.body.off('touchstart.zoomdisabler touchend.zoomdisabler');
    return this;
  },

  /**
  * Teardown - Remove added markup and events
  */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Zoom, COMPONENT_NAME };
