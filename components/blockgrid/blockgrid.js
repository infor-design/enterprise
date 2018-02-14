/* jshint esversion:6 */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

// Settings and Options
const COMPONENT_NAME = 'blockgrid';

const BLOCKGRID_DEFAULTS = {
  dataset: []
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

    $('.block').hover((e) => {
      const blockEl = $(e.currentTarget);
      blockEl.find('.checkbox-label').css('display', 'block');
    }, (e) => {
      const blockEl = $(e.currentTarget);
      const cboxVal = blockEl.find('.checkbox')[0].checked;
      if (!cboxVal) {
        blockEl.find('.checkbox-label').css('display', 'none');
      }
    }).on('click', (e) => {
      const blockEl = $(e.currentTarget);

      if (blockEl.hasClass('is-activated')) {
        blockEl.removeClass('is-activated');
      } else {
        blockEl.addClass('is-activated');
      }
    });

    $('.checkbox-label').on('click', (e) => {
      const blockEl = $(e.currentTarget.parentElement);
      const cboxVal = blockEl.find('.checkbox')[0].checked;

      if (!cboxVal) {
        blockEl.addClass('is-selected');
      } else {
        blockEl.removeClass('is-selected');
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
   */

  renderBlock() {
    let blockelements = '';
    const s = this.settings;
    const dslength = s.dataset.length;

    for (let i = 0; i < dslength; i++) {
      const data = s.dataset[i];
      blockelements += '<div class="block" tabindex="1">';
      blockelements += `<input type="checkbox" class="checkbox" id="checkbox${i}" idx="${i}">`;
      blockelements += `<label for="checkbox${i}" class="checkbox-label" style="display:none;" tabindex="1"><span class="audible">Checked</span></label>`;

      blockelements += `<img alt="Placeholder Image" src="${data.img}" class="image-round">`;
      blockelements += `<p> ${data.maintxt} <br> ${data.subtxt} </p></div>`;
    }

    this.element.append(blockelements);
  },

  iconMouseEnter(ev, icon) {
    icon.visible = true;
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
   * @private
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Blockgrid, COMPONENT_NAME };
