import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components

// Component Name
const COMPONENT_NAME = 'wizard';

/**
 * Component Default Settings
 * @namespace
 * @property {jQuery[]} ticks  Defines the data to use, must be specified.
 */
const WIZARD_DEFAULTS = {
  ticks: null
};

/**
 * @class Wizard
 * @constructor
 * @param {jQuery[]|HTMLElement} element the Wizard container
 * @param {object} [settings] incoming settings
 */
function Wizard(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, WIZARD_DEFAULTS);

  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
Wizard.prototype = {

  /**
   * @private
   */
  init() {
    this
      .build()
      .handleEvents();
  },

  /**
   * @private
   * @returns {this} component instance
   */
  build() {
    this.header = this.element.find('.wizard-header');
    if (!this.header.length) {
      this.header = $('<div class="wizard-header"></div>').appendTo(this.element);
    }

    this.bar = this.element.find('.bar');
    if (!this.bar.length) {
      this.bar = $('<div class="bar"></div>').appendTo(this.header);
    }

    this.completedRange = this.element.find('.completed-range');
    if (!this.completedRange.length) {
      this.completedRange = $('<div class="completed-range"></div>').appendTo(this.bar);
    }

    this
      .buildTicks()
      .updateRange();

    return this;
  },

  /**
   * Builds the HTML Markup that draws out defined Wizard tick marks.
   * @returns {this} component instance
   */
  buildTicks() {
    const settingTicks = this.settings.ticks;
    const self = this;

    this.ticks = this.bar.children('.tick');

    if (!this.ticks.length && settingTicks) {
      for (let i = 0; i < settingTicks.length; i++) {
        const link = $(`<a ng-click="handleClick()" class="tick ${settingTicks[i].state ? settingTicks[i].state : ''}" href="${settingTicks[i].href ? settingTicks[i].href : '#'}"><span class="label">${settingTicks[i].label}</span></a>`);

        if (settingTicks[i].ngClick) {
          link.attr('ng-click', settingTicks[i].ngClick);
        }

        self.bar.append(link);
      }
      this.ticks = this.bar.children('.tick');
    }
    this.positionTicks();

    $('.tick', self.element).each(function () {
      const tick = $(this);
      if (tick.hasClass('is-disabled')) {
        tick.removeAttr('onclick ng-click');
      }
    });

    this.element.find('.wizard-header')[0].style.opacity = '1';
    return this;
  },

  positionTicks() {
    const l = this.ticks.length;
    const delta = 100 / (l - 1);
    const tickPos = [];

    function getPoint(i) {
      if (i === 0) {
        return 0;
      }
      if (i === l - 1) {
        return 100;
      }
      return delta * i;
    }

    for (let i = 0; i < l; i++) {
      tickPos.push(getPoint(i));
    }

    this.ticks.each(function (i) {
      const tick = $(this);
      const label = tick.children('.label');
      const left = Locale.isRTL() ? (100 - tickPos[i]) : tickPos[i];

      this.style.left = `${left}%`;

      for (let i2 = 0, l2 = label.length; i2 < l2; i2++) {
        label[i2].style.left = `-${label.outerWidth() / 2 - tick.outerWidth() / 2}px`;
      }

      if (tick.is('.is-disabled')) {
        tick.attr('tabindex', '-1');
      }
    });
  },

  /**
   * Re-renders the Wizard Range with updated ticks
   * @returns {this} component instance
   */
  updateRange() {
    const currentTick = this.ticks.filter('.current').last();
    let widthPercentage = 0;

    if (currentTick.length) {
      widthPercentage = (100 * parseFloat(window.getComputedStyle(currentTick[0]).left) /
        parseFloat(window.getComputedStyle(currentTick.parent()[0]).width));
      widthPercentage = Locale.isRTL() ? (100 - widthPercentage) : widthPercentage;
    }

    this.completedRange[0].style.width = `${widthPercentage}%`;
    return this;
  },

  /**
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    this
      .buildTicks()
      .updateRange();

    return this;
  },

  /**
   * @returns {this} component instance
   */
  teardown() {
    this.ticks.offTouchClick('wizard').off('click.wizard');
    this.element.off('updated.wizard');

    this.ticks.remove();
    return this;
  },

  /**
   * Deprecating the "select()" method in favor of "activate()" to match the API
   * of our other controls. Temporarily adding functionality that reroutes this
   * method to the new "activate" method.
   * @private
   * @deprecated as of v4.4.0
   * @param {jQuery.Event} e the activate event object
   * @param {jQuery[]|HTMLElement} tick the target tick to be activated
   * @returns {this} component instance
   */
  select(e, tick) {
    return this.activate(e, tick);
  },

  /**
   * Activates one of the Wizard's ticks.
   * Tick can either be a number (representing the tick's index) or a jQuery
   * element reference to a tick.
   * @param {jQuery.Event} e the activate event object
   * @param {jQuery[]|HTMLElement} tick the target tick to be activated
   * @returns {this} component instance
   */
  activate(e, tick) {
    if (e === undefined && !tick) {
      return this;
    }

    const self = this;

    function getTick() {
      let target;

      // Use the first variable as the tick definition or index if "e" is null,
      // undefined, or not an event object. This is for backwards compatibility with
      // this control's old select() method, which took an index as an argument.
      if (e !== undefined && (e === undefined || e === null || !e.type || !e.target) && !tick) {
        tick = e;
      }

      if (tick === undefined) {
        target = $(e.target);
        return target.is('.label') ? target.parent() : target;
      }

      if (typeof tick === 'number') {
        return self.ticks.eq(tick);
      }

      return tick;
    }

    tick = getTick();

    if (e && (tick.is('[disabled], .is-disabled') || !tick.is('a'))) {
      e.preventDefault();
      e.stopPropagation();
      return this;
    }

    // Cancel selection by returning a 'beforeactivate' handler as 'false'
    const canNav = this.element.triggerHandler('beforeactivate', [tick]);
    if (canNav === false) {
      return this;
    }

    const trueIndex = this.ticks.index(tick);
    this.ticks.removeClass('complete current')
      .eq(trueIndex).addClass('current')
      .prevAll('.tick')
      .addClass('complete');

    this.updateRange();
    this.element.trigger('activated', [tick]);

    // Timeout allows animation to finish
    setTimeout(() => {
      self.element.trigger('afteractivated', [tick]);
    }, 300);

    return this;
  },

  /**
   * Teardown - Remove added markup and events
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * This component listens to the following events:
   * @listens updated custom updated event
   * @listens click jQuery click event
   * @returns {this} component instance
   */
  handleEvents() {
    const self = this;

    this.element.on('updated', () => {
      self.updated();
    });

    this.ticks.onTouchClick('wizard').on('click.wizard', function (e) {
      self.activate(e, $(this));
    });

    return this;
  }
};

export { Wizard, COMPONENT_NAME };
