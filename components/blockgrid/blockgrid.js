import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

// Settings and Options
const COMPONENT_NAME = 'blockgrid';

/**
 * Blockgrid Default Settings
 * @namespace
 * @property {array} dataset An array of data objects
 * @property {string} selectable Controls the selection Mode this may be:
 * false, 'single' or 'multiple' or 'mixed'
 */
const BLOCKGRID_DEFAULTS = {
  dataset: [],
  selectable: false // false, 'single' or 'multiple' or mixed
};

/**
 * Component Name - Does this and that.
 * @class ComponentName
 * @param {string} element The plugin element for the constuctor
 * @param {string} settings The settings element.
 */
function Blockgrid(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(element, settings, BLOCKGRID_DEFAULTS);
  if (settings.dataset) {
    this.settings.dataset = settings.dataset;
  }
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
Blockgrid.prototype = {
  /**
   * Do initialization, build up and / or add events ect.
   * @returns {object} The Component prototype, useful for chaining.
   */
  init() {
    // Do initialization. Build or Events ect
    return this
      .build()
      .handleEvents();
  },

  /**
   * Add any needed markup to the component.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  build() {
    this.renderBlock();
    return this;
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  handleEvents() {
    const self = this;
    const s = self.settings;

    $('.block').hover((e) => {
      const blockEl = $(e.currentTarget);

      if (s.selectable === 'multiple' || s.selectable === 'mixed') {
        blockEl.find('.checkbox-label').css('display', 'block');
      }
    }, (e) => {
      const blockEl = $(e.currentTarget);
      const cboxVal = blockEl.find('.checkbox')[0].checked;
      const isActivated = blockEl.hasClass('is-activated');
      if (!cboxVal && !isActivated) {
        blockEl.find('.checkbox-label').css('display', 'none');
      }
    }).on('click', (e) => {
      const blockEl = $(e.currentTarget);

      if (s.selectable === 'single' || s.selectable === 'mixed') {
        $('.block').removeClass('is-activated');
        if (blockEl) {
          blockEl.addClass('is-activated');
        }
      }

      if (s.selectable === 'multiple') {
        if (blockEl.hasClass('is-activated')) {
          blockEl.removeClass('is-activated', 'is-selected');
          blockEl.find('.checkbox').attr('checked', false);
        } else {
          blockEl.addClass('is-activated', 'is-selected');
          blockEl.find('.checkbox').attr('checked', true);
        }
      }
    });

    $('.checkbox-label').on('click', (e) => {
      const blockEl = $(e.currentTarget.parentElement);
      const cboxVal = blockEl.find('.checkbox')[0].checked;

      if (!cboxVal) {
        blockEl.addClass('is-selected');
      } else {
        blockEl.removeClass('is-selected');
        if (s.selectable === 'multiple') {
          blockEl.removeClass('is-activated');
        }
      }
    });

    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      self.updated();
    });

    return this;
  },

  /**
   * Example Method.
   * @returns {void}
   * @private
   */
  renderBlock() {
    let blockelements = '';
    const s = this.settings;
    const dslength = s.dataset.length;

    for (let i = 0; i < dslength; i++) {
      const data = s.dataset[i];
      blockelements += `<div class="block selection" tabindex="1">
      <input type="checkbox" class="checkbox" id="checkbox${i}" idx="${i}">
      <label for="checkbox${i}" class="checkbox-label" style="display:none;" tabindex="1"><span class="audible">Checked</span></label>
      <img alt="Placeholder Image" src="${data.img}" class="image-round">
      <p> ${data.maintxt} <br> ${data.subtxt} </p></div>`;
    }

    this.element.append(blockelements);
  },

  /**
   * Handle updated settings and values.
   * @returns {[type]} [description]
   */
  updated() {
    return this
      .teardown()
      .init();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  teardown() {
    this.element.off(`updated.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Blockgrid, COMPONENT_NAME };
