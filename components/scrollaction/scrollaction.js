import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

// Component Name
const COMPONENT_NAME = 'scrollaction';

// Default ScrollAction Options
const SCROLLACTION_DEFAULTS = {
  scrollActionTarget: '.js-scroll-target', // The element to add a class to based on scrolling logic
  classToAdd: 'scrolled-down' // The class added to the target element
};

/**
* A component that applies a class based on scroll direction
* @class ScrollAction
* @param {string} element The component element.
* @param {object} [settings] The component settings.
* @param {string} [scrollActionTarget='.js-scroll-target'] The selector of the element to add the class to.
* @param {string} [classToAdd ='scrolled-down'] The class name to use when toggling.
*/
function ScrollAction(element, settings) {
  this.settings = utils.mergeSettings(element, settings, SCROLLACTION_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// ScrollAction Methods
ScrollAction.prototype = {

  init() {
    this.handleEvents();
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {object} The api
   */
  unbind() {
    const s = this.settings;
    this.element.off('scroll.scrollaction');
    if (s) {
      $(s.scrollActionTarget).removeClass(s.classToAdd);
    }
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, SCROLLACTION_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
   * Destroy this component instance and remove the link from its base element.
   * @returns {void}
   */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * Attach Events used by the Control
   * @private
   * @returns {void}
   */
  handleEvents() {
    const s = this.settings;
    this.lastScrollTop = 0;

    this.element.on('scroll.scrollaction', () => {
      const scrollTop = this.element.scrollTop();

      if (scrollTop > this.lastScrollTop) {
        $(s.scrollActionTarget).addClass(s.classToAdd);
      } else {
        $(s.scrollActionTarget).removeClass(s.classToAdd);
      }

      this.lastScrollTop = scrollTop;
    });
  }
};

export { ScrollAction, COMPONENT_NAME };
