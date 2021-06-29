import { utils } from '../../utils/utils';

// Component Name
const COMPONENT_NAME = 'swipe-container';
const SWIPE_CONTAINER_DEFAULTS = {
  swipeType: 'reveal'
};

function SwipeAction(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, SWIPE_CONTAINER_DEFAULTS);

  return this.init();
}

SwipeAction.prototype = {
  init() {
    this.render();
    this.handleEvents();
  },

  /**
   * Renders the component
   * @private
   * @returns {void}
   */
  render() {
    this.container = this.element[0].querySelector('.swipe-container');
    this.swipeType = this.settings.swipeType;
    const leftButton = this.element[0].querySelector('.btn-swipe-action-left');
    const rightButton = this.element[0].querySelector('.btn-swipe-action-right');

    if (leftButton && this.swipeType === 'reveal') {
      leftButton.setAttribute('tabindex', '-1');
      leftButton.setAttribute('aria-hidden', 'true');
    }
    if (rightButton && this.swipeType === 'reveal') {
      rightButton.setAttribute('tabindex', '-1');
      rightButton.setAttribute('aria-hidden', 'true');
    }

    if (leftButton && this.swipeType === 'reveal') {
      this.container.scrollLeft = 85;
    }
  },

  /**
   * Sets up component event listeners
   * @private
   * @returns {void}
   */
  handleEvents() {
    let touchstartX = 0;
    let touchendX = 0;
    let lastPercentage = 0;

    // Close on click
    if (this.swipeType === 'reveal') {
      this.element.find('button').on('click', () => {
        this.container.scrollLeft = 85;
      });
      return;
    }

    // For continuous swipe type setup a "swipe" event with touch start and end
    this.element.on('touchstart.swipe', (e) => {
      touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.element.on('touchend.swipe', (e) => {
      touchendX = e.changedTouches[0].screenX;
      let direction = '';

      if (touchendX < touchstartX) {
        direction = 'left';
      }
      if (touchendX > touchstartX) {
        direction = 'right';
      }
      if (!direction) {
        return;
      }

      this.element.find(`.swipe-action-${direction === 'left' ? 'right' : 'left'} button`).click();
    }, { passive: true });

    // Treat scroll like swipe as it works on chrome with the magic mouse
    $(this.container).on('scroll', (e) => {
      const eventTarget = e.target;
      const scrollPercentage = 100 * (eventTarget.scrollLeft / (eventTarget.scrollWidth - eventTarget.clientWidth));

      if (Math.abs(lastPercentage - scrollPercentage) < 1) {
        return;
      }
      lastPercentage = scrollPercentage;

      let direction = '';
      if (scrollPercentage === 0) {
        direction = 'right';
      }

      if (scrollPercentage > 98) {
        direction = 'left';
      }
      if (!direction) {
        return;
      }

      this.element.find(`.swipe-action-${direction === 'left' ? 'right' : 'left'} button`).click();
    });
  },

  /**
   * Set the swipe interaction method between continuous and reveal (default)
   * @param {string | null} value The swipe interation type
   */
  set swipeType(value) {
    if (value === 'continuous') {
      this.settings.swipeType = value;
      this.container.classList.add('continuous');
      return;
    }

    this.settings.swipeType = 'reveal';
    this.container.classList.remove('continuous');
  },

  get swipeType() { return this.settings.swipeType; },

  /**
   * Triggers a UI Resync.
   * @param {object} [settings] incoming settings
   * @returns {void}
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
    this.teardown();
    this.init();
  },

  /**
   * @private
   * @returns {void}
   */
  teardown() {
    this.element.off('swipe.trigger');
  },

  /**
  * Tears down and removes any added markup and events.
  * @returns {void}
  */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], 'swipeaction');
  },
};

export { SwipeAction, COMPONENT_NAME };
