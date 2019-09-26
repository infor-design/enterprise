import * as debug from '../../utils/debug';
import { deprecateMethod } from '../../utils/deprecated';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components

// Component Name
const COMPONENT_NAME = 'wizard';

// Component Default Settings
const WIZARD_DEFAULTS = {
  ticks: null,
  ticksTemplate: '<a class="tick {{state}}" href="{{href}}"><span class="label" data-shortlabel="{{shortLabel}}">{{label}}</span></a>'
};

/**
 * A horizontal form based wizard component.
 * @class Wizard
 * @param {jQuery[]|HTMLElement} element the Wizard container
 * @param {object} [settings] incoming settings
 * @param {jQuery[]} [settings.ticks]  Defines the data to use, must be specified.
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
    this.namespace = utils.uniqueId({ classList: [COMPONENT_NAME] });
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
   * @private
   * @returns {this} component instance
   */
  buildTicks() {
    const s = this.settings;
    this.ticks = this.bar.children('.tick');

    if (!this.ticks.length && s.ticks) {
      const replaceMatch = (str, c) => str.replace(/{{(\w+)}}/g, (m, p) => c[p]);
      const defaultTick = { state: '', href: '#', label: '' };
      for (let i = 0; i < s.ticks.length; i++) {
        let linkStr = replaceMatch(s.ticksTemplate, $.extend({}, defaultTick, s.ticks[i]));
        linkStr = linkStr.replace(/(\s(\w|-)+=("|')?)?undefined("|')?/gim, '');
        const link = $(linkStr);

        if (s.ticks[i].ngClick) {
          link.attr('ng-click', s.ticks[i].ngClick);
        }

        this.bar.append(link);
      }
      this.ticks = this.bar.children('.tick');
    }
    this.positionTicks();
    this.setLabelsData();
    this.adjustLabels();

    this.ticks.toArray().forEach((tick) => {
      if (tick.classList.contains('is-disabled')) {
        ['onclick', 'ng-click'].forEach(attr => tick.removeAttribute(attr));
      }
    });

    this.header[0].style.opacity = '1';
    return this;
  },

  /**
   * Set the labels data to keep control in case overlapping.
   * @private
   * @returns {this} component instance
   */
  setLabelsData() {
    const labels = [].slice.call(this.bar[0].querySelectorAll('.label'));
    this.labels = [];

    labels.forEach((node) => {
      const label = node.textContent;
      let shortLabel = node.getAttribute('data-shortlabel');
      if (!shortLabel) {
        shortLabel = node.getAttribute('shortlabel');
      }
      const data = { label, shortLabel, node, jqEl: $(node) };

      if (!shortLabel || shortLabel === 'undefined') {
        node.removeAttribute('data-shortlabel');
        node.removeAttribute('shortlabel');
        delete data.shortLabel;
      }

      this.labels.push(data);
    });
    return this;
  },

  /**
   * Adjust the labels if overlapping.
   * @private
   * @returns {this} component instance
   */
  adjustLabels() {
    const headerRect = this.header[0].getBoundingClientRect();
    const barWidth = parseFloat(window.getComputedStyle(this.bar[0]).width);
    const availWidth = ((100 / (this.labels.length - 1) / 100) * barWidth) - 15;
    const usingShortLabel = [];
    let labelsToFix = [];

    // Reset given label
    const resetLabel = (label) => {
      delete label.isEllipsis;
      label.node.classList.remove('is-ellipsis');
      label.node.style.width = '';
      this.removeTooltip(label);
    };

    // Add the fix to overlaping labels
    const adjustLabel = (idx) => {
      const label = this.labels[idx].node;
      if (usingShortLabel.indexOf(idx) === -1) {
        const shortLabel = this.labels[idx].shortLabel;
        if (shortLabel) {
          // Use short labels
          label.textContent = shortLabel;
          usingShortLabel.push(idx);
          resetLabel(this.labels[idx]);
        } else {
          // Add ellipsis
          label.classList.add('is-ellipsis');
          label.style.width = `${availWidth}px`;
          this.setTooltip(this.labels[idx]);
          this.labels[idx].isEllipsis = true;
        }
      }
      label.style.left = `-${(label.offsetWidth - label.parentNode.offsetWidth) / 2}px`;
    };

    // Add the fix to first and last labels
    const adjustFirstAndLastLabels = () => {
      const fixLabel = (label, diff, isLast) => {
        if (label.isEllipsis) {
          const width = parseFloat(label.node.style.width) - diff;
          label.node.style.width = `${width}px`;
          label.node.style.left = `-${(width - label.node.parentNode.offsetWidth) / 2}px`;
        } else {
          const left = parseFloat(label.node.style.left) + (diff * (isLast ? -1 : 1));
          label.node.style.left = `${left}px`;
        }
      };
      // First
      let label = this.labels[0];
      let labelRect = label.node.rect || label.node.getBoundingClientRect();
      if (headerRect.left > labelRect.left) {
        fixLabel(label, (headerRect.left - labelRect.left));
      }
      // Last
      label = this.labels[this.labels.length - 1];
      labelRect = label.node.rect || label.node.getBoundingClientRect();
      if (headerRect.right < labelRect.right) {
        fixLabel(label, (labelRect.right - headerRect.right), true);
      }
    };

    // Reset all the labels to start from default
    this.labels.forEach((label) => {
      const node = label.node;
      node.textContent = label.label;
      node.style.left = `-${(node.offsetWidth - node.parentNode.offsetWidth) / 2}px`;
      resetLabel(label);
    });
    adjustFirstAndLastLabels();

    // Check for overlap
    const overlap = (r1, r2) => !(r1.right < r2.left ||
        r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);

    // Set the overlaping labels which need to fix
    const setLabelsToFix = () => {
      this.labels.forEach((label) => {
        label.rect = label.node.getBoundingClientRect();
      });
      labelsToFix = [];
      for (let i = 0, l = this.labels.length; i < l; i++) {
        if (i < (l - 1)) {
          const i2 = i + 1;
          if (overlap(this.labels[i].rect, this.labels[i2].rect)) {
            labelsToFix.push([i, i2]);
          }
        }
      }
    };

    // Extra check to not loop more then max times
    let max = 50;

    // Start to add fix if needed, will execute at least once
    do {
      setLabelsToFix();
      labelsToFix.forEach((arr) => {
        const label1 = this.labels[arr[0]].node;
        const label2 = this.labels[arr[1]].node;
        const idx = label1.offsetWidth > label2.offsetWidth ? 0 : 1;
        const i = arr[idx];
        const i2 = idx ? arr[0] : arr[1];
        adjustLabel(i);
        if (overlap(this.labels[i].rect, this.labels[i2].rect)) {
          adjustLabel(i2);
        }
      });
      adjustFirstAndLastLabels();
      setLabelsToFix();
      max--;
    } while (labelsToFix.length && max > 0);

    // Check and fix first and last
    adjustFirstAndLastLabels();

    // Clear the cached bounding rect
    this.labels.forEach((label) => {
      delete label.isEllipsis;
      delete label.rect;
    });
    return this;
  },

  /**
   * Triggers tooltip
   * @private
   * @param  {object} label The label.
   * @returns {void}
   */
  setTooltip(label) {
    label.jqEl
      .tooltip({ content: label.label, placement: 'bottom' })
      .on(`blur.${COMPONENT_NAME}`, () => this.removeTooltip(label));
  },

  /**
   * Removes tooltip
   * @private
   * @param  {object} label The label.
   * @returns {void}
   */
  removeTooltip(label) {
    const tooltipApi = label.jqEl.data('tooltip');
    if (tooltipApi) {
      tooltipApi.element.off(`blur.${COMPONENT_NAME}`);
      tooltipApi.destroy();
    }
  },

  /**
   * Position the ticks
   * @private
   * @returns {void}
   */
  positionTicks() {
    const len = this.ticks.length;
    const delta = 100 / (len - 1);
    const getPoint = i => ((i === len - 1) ? 100 : (delta * i));

    this.ticks.toArray().forEach((tick, i) => {
      const pos = getPoint(i);
      const left = (Locale ? Locale.isRTL() : false) ? (100 - pos) : pos;

      tick.style.left = `${left}%`;
      if (tick.classList.contains('is-disabled')) {
        tick.setAttribute('tabindex', '-1');
      }
    });
  },

  /**
   * Re-renders the Wizard Range with updated ticks
   * @private
   * @returns {this} component instance
   */
  updateRange() {
    const getStyle = (el, prop) => parseFloat(window.getComputedStyle(el)[prop]);
    const tick = this.ticks.filter('.current').last();
    let w = 0;

    if (tick.length) {
      w = (100 * getStyle(tick[0], 'left') / getStyle(tick.parent()[0], 'width'));
      w = (Locale ? Locale.isRTL() : false) ? (100 - w) : w;
    }

    this.completedRange[0].style.width = `${w}%`;
    return this;
  },

  /**
   * Update the wizard component with new settings.
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
   * @private
   * @returns {this} component instance
   */
  teardown() {
    this.labels.forEach((label) => {
      this.removeTooltip(label);
      label.jqEl.off().removeData();
    });
    delete this.labels;

    this.ticks.off(`click.${COMPONENT_NAME}`);
    this.element.off(`updated.${COMPONENT_NAME}`);
    $('body').off(`resize.${this.namespace}`);

    this.ticks.remove();
    return this;
  },

  /**
   * Activates one of the Wizard's ticks.
   * This method is slated to be removed in a future v4.10.0 or v5.0.0.
   * @deprecated as of v4.4.0.  Please use `activate()` instead.
   * @param {jQuery.Event} e the activate event object
   * @param {jQuery[]|HTMLElement} tick the target tick to be activated
   * @returns {this} component instance
   */
  select(e, tick) {
    return deprecateMethod(this.activate, this.select).apply(this, [e, tick]);
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

    /**
     * Fires before a step is activated/pressed. You can cancel selection by returning a 'beforeactivate'
     * handler as 'false'
     * @event beforeactivate
     * @memberof Wizard
     * @property {object} event - The jquery event object
     * @property {HTMLElement} tick - The tick (link) that was activated.
     */
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

    /**
     * Fires while a step is activated/pressed.
     * handler as 'false'
     * @event activated
     * @memberof Wizard
     * @property {object} event - The jquery event object
     * @property {HTMLElement} tick - The tick (link) that was activated.
     */
    this.element.trigger('activated', [tick]);

    /**
     * Fires after a step is activated/pressed. And the new Dom is loaded.
     * handler as 'false'
     * @event afteractivated
     * @memberof Wizard
     * @property {object} event - The jquery event object
     * @property {HTMLElement} tick - The tick (link) that was activated.
     */
    setTimeout(() => {
      self.element.trigger('afteractivated', [tick]);
    }, 300);

    return this;
  },

  /**
   * Destroy and remove added markup and events
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * This component listens to the following events:
   * @private
   * @listens updated custom updated event
   * @listens click jQuery click event
   * @returns {this} component instance
   */
  handleEvents() {
    const self = this;

    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      self.updated();
    });

    this.ticks.on(`click.${COMPONENT_NAME}`, function (e) {
      self.activate(e, $(this));
    });

    $('body').on(`resize.${this.namespace}`, () => {
      this.adjustLabels();
    });

    return this;
  }
};

export { Wizard, COMPONENT_NAME };
