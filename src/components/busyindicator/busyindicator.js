import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// The Name of this component.
const COMPONENT_NAME = 'busyindicator';

/**
 * A Busy Indicator notifies the user that the system is processing a request, and that they must
 * wait for that request to be processed before continuing with the current task.
 * @class BusyIndicator
 * @param {object} element The plugin starting element.
 * @param {object} [settings] The settings to use.
 * @param {string} [settings.blockUI=true] makes the element that Busy Indicator is invoked on unusable while it's displayed.
 * @param {string} [settings.text=null] Custom Text To Show or Will Show Localized Loading....
 * @param {string} [settings.displayDelay=1000] Number in miliseconds to pass before the markup is displayed. If 0, displays immediately.
 * @param {boolean} [settings.timeToComplete=0] fires the 'complete' trigger at a certain timing interval. If 0, goes indefinitely.
 * @param {string} [settings.transparentOverlay=false] If true, allows the "blockUI" setting to display
 * an overlay that prevents interaction, but appears transparent instead of gray.
 * @param {string} [settings.overlayOnly=false] If true, the busy indicator will only be the overlay.
 * @param {string} [settings.attributes=null] Add extra attributes like id's to the element. e.g. `attributes: { name: 'id', value: 'my-unique-id' }`
 */
const BUSYINDICATOR_DEFAULTS = {
  blockUI: true,
  text: null,
  displayDelay: 1000,
  timeToComplete: 0,
  transparentOverlay: false,
  overlayOnly: false,
  attributes: null
};

function BusyIndicator(element, settings) {
  this.settings = utils.mergeSettings(element, settings, BUSYINDICATOR_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
BusyIndicator.prototype = {

  init() {
    this.inlineLabel = this.element.closest('label');
    this.inlineLabelText = this.inlineLabel.find('.label-text');
    this.isInlineLabel = this.element.parent().is('.inline');

    this
      .setup()
      .handleEvents();
  },

  // Sanitize incoming option values
  setup() {
    const blockUI = this.element.attr('data-block-ui');
    const delay = this.element.attr('data-display-delay');
    const completionTime = this.element.attr('data-completion-time');

    this.blockUI = blockUI !== undefined ? blockUI : this.settings.blockUI;
    if (!this.settings.overlayOnly) {
      this.loadingText = this.settings.text ? this.settings.text : Locale.translate('Loading');

      // Support updating the label while open
      if (this.label) {
        this.label.text(this.loadingText);
      }
    }

    const isDelayDefined = delay !== undefined && !isNaN(delay) && parseInt(delay, 10) > 20;
    const displayDelay = (!isNaN(this.settings.displayDelay) &&
        this.settings.displayDelay >= 20) ? this.settings.displayDelay : 20;

    this.delay = isDelayDefined ? delay : displayDelay;
    this.completionTime = completionTime !== undefined && !isNaN(completionTime) ?
      parseInt(completionTime, 10) : this.settings.timeToComplete;

    return this;
  },

  /**
  * Builds and starts the indicator
  * @private
  * @returns {void}
  */
  activate() {
    const self = this;

    if (self.isActive()) {
      return; // safety, don't activate this code if already active
    }

    // If the markup already exists don't do anything but clear
    if (this.container) {
      if (self.closeTimeout) {
        clearTimeout(self.closeTimeout);
      }
      this.label.remove();
      if (!this.settings.overlayOnly) {
        this.label = $(`<span>${this.loadingText}</span>`).appendTo(this.container);

        if (this.element.is('input, .dropdown, .multiselect, .busy-xs, .busy-sm')) {
          this.label.addClass('audible');
        }
      }

      this.container
        .removeClass('is-hidden')
        .trigger('afterstart');

      return;
    }

    // Build all the markup
    this.container = $('<div class="busy-indicator-container is-hidden"></div>').attr({
      'aria-live': 'polite',
      role: 'status'
    });
    this.loader = $('<div class="busy-indicator active"></div>').appendTo(this.container);

    if (!this.settings.overlayOnly) {
      $('<div class="bar one"></div>' +
        '<div class="bar two"></div>' +
        '<div class="bar three"></div>' +
        '<div class="bar four"></div>' +
        '<div class="bar five"></div>').appendTo(this.loader);

      this.label = $(`<span>${this.loadingText}</span>`).appendTo(this.container);
    }

    let transparency = '';

    if (this.blockUI) {
      if (this.settings.transparentOverlay) {
        transparency = ' transparent';
      }

      this.originalPositionProp = this.element[0].style.position;
      this.element[0].style.position = 'relative';
      this.overlay = $(`<div class="overlay busy is-hidden${transparency}"></div>`).appendTo(this.element);
      this.container.addClass('blocked-ui');
    }

    if (this.label && this.element.is('.busy-xs, .busy-sm')) {
      this.label.addClass('audible');
    }

    // Append the markup to the page
    // Use special positioning logic for compatibility with certain controls
    if (this.element.is('input, .dropdown, .multiselect')) {
      this.element.addClass('is-loading');
      if (this.blockUI) {
        this.element.addClass('is-blocked');
      }
      if (this.label) {
        this.label.addClass('audible');
      }

      let target;

      if (this.element.is('input')) {
        target = this.element;
        this.container.insertAfter(this.isInlineLabel ? this.inlineLabel : this.element);
      } else {
        const dd = this.element.data('dropdown');
        target = dd.pseudoElem;
        this.container.appendTo(target.parent());
      }

      if (this.overlay) {
        this.overlay.insertAfter(this.container);
      }

      const rect = target.position();
      const h = target.outerHeight();
      const w = target.outerWidth();
      const elements = this.container.add(this.overlay);
      const setCssStyle = function (el, key, value) {
        el.style[key] = `${value}px`;
      };

      for (let i = 0, l = elements.length; i < l; i++) {
        setCssStyle(elements[i], 'left', rect.left);
        setCssStyle(elements[i], 'top', rect.top);
        setCssStyle(elements[i], 'bottom', rect.bottom);
        setCssStyle(elements[i], 'right', rect.right);
        setCssStyle(elements[i], 'height', h);
        setCssStyle(elements[i], 'width', w);
      }
    } else {
      // Normal Operations
      this.container.appendTo(this.element);
    }

    // Fade in shortly after adding the markup to the page
    // (prevents the indicator from abruptly showing)
    setTimeout(() => {
      if (self.container) {
        self.container.removeClass('is-hidden');
      }
      if (self.overlay) {
        self.overlay.removeClass('is-hidden');
      }

      // Add in view from scroll parent.
      if (self.blockUI) {
        self.addScrollParent();
      }
    }, self.delay);

    // Lets external code know that we've successully kicked off.
    this.element.trigger('afterstart');

    // Start the JS Animation Loop if IE9
    if (!$.fn.cssPropSupport('animation')) {
      self.isAnimating = true;
      self.animateWithJS();
    }

    // Triggers complete if the "timeToComplete" option is set.
    if (this.completionTime > 0) {
      setTimeout(() => {
        self.element.trigger('complete');
      }, self.completionTime);
    }

    utils.addAttributes(this.container, this, this.settings.attributes);
    utils.addAttributes(this.container.find('.busy-indicator.active'), this, this.settings.attributes, 'busyindicator');
    utils.addAttributes(this.container.find('span'), this, this.settings.attributes, 'text');
    utils.addAttributes(this.overlay, this, this.settings.attributes, 'overlay');
  },

  /**
   * Removes the appended markup and hides any trace of the indicator.
   * @param {boolean} fromEvent Designates the close is coming from an event (internal)
   * @returns {void}
   */
  close(fromEvent) {
    const self = this;

    if (!self.isActive()) {
      return; // safety, don't try and close this if not already active
    }

    this.removeScrollParent();

    // If closed from an event, fire the necessary event triggers
    // and removes the 'is-loading' CSS class.
    if (fromEvent) {
      this.element.removeClass('is-loading');
      this.element.removeClass('is-blocked');
    }

    if (this.container) {
      this.container.addClass('is-hidden');
    }

    if (this.overlay) {
      this.overlay.addClass('is-hidden');
    }

    // Give the indicator time to fade out before removing all of its components from view
    self.closeTimeout = setTimeout(() => {
      clearTimeout(self.closeTimeout);
      if (self.container) {
        self.container.remove();
      }

      self.container = undefined;
      self.loader = undefined;
      self.label = undefined;

      if (self.overlay) {
        self.overlay.remove();
        self.element[0].style.position = self.originalPositionProp;
        self.originalPositionProp = undefined;
      }
      self.overlay = undefined;
      self.element.trigger('aftercomplete.busyindicator');
      self.element.off('complete.busyindicator');
    }, 600);
  },

  /**
   * Browsers that don't support CSS-based animation can still show the animating Busy Indicator.
   * @private
   */
  animateWithJS() {
    const self = this;
    const bar1 = this.container.find('.bar.one');
    const bar2 = this.container.find('.bar.two');
    const bar3 = this.container.find('.bar.three');
    const bar4 = this.container.find('.bar.four');
    const bar5 = this.container.find('.bar.five');
    let t = 0;
    const interval = null;

    // Animation Loop
    function animate() {
      if (!self.isAnimating) {
        clearInterval(interval);
        return;
      }

      t += 1;

      if (t === 1) {
        bar1.addClass('half');
      }
      if (t === 13) {
        bar1.removeClass('half').addClass('full');
        bar2.addClass('half');
      }
      if (t === 26) {
        bar1.removeClass('full').addClass('half');
        bar2.removeClass('half').addClass('full');
        bar3.addClass('half');
      }
      if (t === 39) {
        bar1.removeClass('half');
        bar2.removeClass('full').addClass('half');
        bar3.removeClass('half').addClass('full');
        bar4.addClass('half');
      }
      if (t === 51) {
        bar2.removeClass('half');
        bar3.removeClass('full').addClass('half');
        bar4.removeClass('half').addClass('full');
        bar5.addClass('half');
      }
      if (t === 64) {
        bar3.removeClass('half');
        bar4.removeClass('full').addClass('half');
        bar5.removeClass('half').addClass('full');
      }
      if (t === 77) {
        bar4.removeClass('half');
        bar5.removeClass('full').addClass('half');
      }
      if (t === 90) {
        bar5.removeClass('half');
      }

      if (t === 103) {
        t = 0;
      }
    }

    setInterval(animate, 10);
  },

  /**
   * Adjust top position, if any of the parents is scrollable
   * @private
   * @returns {void}
   */
  addScrollParent() {
    if (this.blockUI) {
      this.scrollParent = $(this.getScrollParent(this.element[0]));
      const h = this.scrollParent[0] ? this.scrollParent[0].offsetHeight : 0;
      if (h && this.container && (h < this.element[0].offsetHeight)) {
        const loc = ((h / 2) - 58);
        const setTop = () => (this.container.css({ top: loc + this.scrollParent[0].scrollTop }));
        setTop();

        this.scrollParent
          .off('scroll.parent.busyindicator')
          .on('scroll.parent.busyindicator', () => {
            if (this.container) {
              setTop();
            }
          });
      }
    }
  },

  /**
   * Remove scroll parent.
   * @private
   * @returns {void}
   */
  removeScrollParent() {
    if (this.scrollParent) {
      this.scrollParent.off('scroll.parent.busyindicator');
      delete this.scrollParent;
    }
  },

  /**
   * Get if any of the parents is scrollable.
   * @private
   * @param {object} elem to get scroll parent.
   * @returns {object} the scroll parent.
   */
  getScrollParent(elem) {
    const properties = ['overflow', 'overflow-x', 'overflow-y'];
    const style = (el, prop) => getComputedStyle(el, null).getPropertyValue(prop);
    const styleMerged = el => properties.reduce((a, b) => a + style(el, b), 0);
    const regex = /(auto|scroll)/;
    const isScroll = el => regex.test(styleMerged(el));
    const scrollParent = (el) => {
      let found = false;
      let parent = el.parentNode;
      while (!found && parent && parent.tagName && parent.tagName.toLowerCase() !== 'body') {
        if (isScroll(parent)) {
          found = true;
          break;
        }
        parent = parent.parentNode;
      }
      return found ? parent : null;
    };
    return scrollParent(elem);
  },

  /**
   * Update the component and apply current settings.
   * @param {object} settings the settings to update to.
   * @returns {this} component instance.
   */
  updated(settings) {
    this.settings = utils.mergeSettings(this.element, settings, this.settings);
    return this.setup();
  },

  /**
   * Returns if the indicator is active or not.
   * @returns {boolean} If the busy indicator is active.
   */
  isActive() {
    if (this.container) {
      return this.container.children('.busy-indicator').is('.active');
    }
    return false;
  },

  /**
   * Teardown and remove any added markup and events.
   * @returns {void}
   */
  destroy() {
    this.removeScrollParent();
    this.close(true);
    this.element.off('start.busyindicator complete.busyindicator afterstart.busyindicator aftercomplete.busyindicator updated.busyindicator');
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  handleEvents() {
    const self = this;

    /**
    *  Fires when the indicator starts / shows.
    *
    * @event start
    * @memberof BusyIndicator
    * @param {object} event - The jquery event object.
    */
    self.element.on('start.busyindicator', (e) => {
      e.stopPropagation();
      this.activate();
    })
      .on('afterstart.busyindicator', () => {
        /**
         * Fires when the indicator is "started"
         *
         * @event complete
         * @memberof BusyIndicator
         * @param {object} event - The jquery event object.
         * @param {object} ui - The dialog object
         */
        this.element.on('complete.busyindicator', (e) => {
          e.stopPropagation();
          this.close(true);
        });
      })
      /**
      * Sync the UI/Settings. Fx chnaging the text in the DOM.
      * @event updated
      * @memberof BusyIndicator
      * @param {object} event - The jquery event object.
      */
      .on('updated.busyindicator', () => {
        this.close(true);
        this.updated();
      });

    return this;
  },

};

export { BusyIndicator, COMPONENT_NAME };
