import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// Settings and Options
const COMPONENT_NAME = 'blockgrid';

/**
 * Blockgrid Default Settings
 * @namespace
 * @property {array} dataset An array of data objects
 * @property {string} selectable Controls the selection mode this can be:
 * false, 'single' or 'multiple' or 'mixed'
 */
const BLOCKGRID_DEFAULTS = {
  dataset: [],
  selectable: false // false, 'single' or 'multiple' or mixed
};

/**
 * Component Name - Does this and that.
 * @class Blockgrid
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
   * @private
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
    this.selectedRows = [];
    return this;
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  handleEvents() {
    const self = this;

    this.element.on(`click.${COMPONENT_NAME}`, '.block', (e) => {
      const activeBlock = $(e.currentTarget);
      const target = $(e.target);
      const isCheckbox = target.is('.checkbox-label') || target.is('.checkbox');

      setTimeout(() => {
        self.selectBlock(activeBlock, isCheckbox);
      }, 0);

      e.stopPropagation();
      e.preventDefault();
    });

    this.element.on(`focus.${COMPONENT_NAME}`, '.checkbox', (e) => {
      const block = $(e.currentTarget).parent();
      block.addClass('has-focus');
    });

    this.element.on(`blur.${COMPONENT_NAME}`, '.checkbox', (e) => {
      const block = $(e.currentTarget).parent();
      block.removeClass('has-focus');
    });

    this.element.on(`keypress.${COMPONENT_NAME}`, '.block', (e) => {
      if (e.which !== 32) {
        return;
      }

      const activeBlock = $(e.target);
      self.selectBlock(activeBlock, false);
    });

    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      self.updated();
    });

    return this;
  },

  /**
   * Run selection over a block item
   * @param {element} activeBlock Dom element to use
   * @param {boolean} isCheckbox True if a checkbox, used for mixed mode.
  */
  selectBlock(activeBlock, isCheckbox) {
    const allBlocks = this.element.find('.block');
    const allChecks = this.element.find('.checkbox');
    const activeCheckbox = activeBlock.find('.checkbox');
    const isChecked = activeCheckbox.is(':checked');
    let action = '';
    const idx = activeBlock.index();

    if (this.settings.selectable === 'single') {
      this.selectedRows = [];
      allBlocks.removeClass('is-selected').removeAttr('aria-selected');
      allChecks.prop('checked', false);
    }

    if ((this.settings.selectable === 'multiple' && isChecked) ||
      (this.settings.selectable === 'mixed' && isCheckbox && isChecked)) {
      activeBlock.removeClass('is-selected').removeAttr('aria-selected');
      activeCheckbox.prop('checked', false);

      for (let i = 0; i < this.selectedRows.length; i++) {
        if (idx === this.selectedRows[i].idx) {
          this.selectedRows.splice(i, 1);
        }
      }

      this.element.triggerHandler('deselected', [{ selectedRows: this.selectedRows, action: 'deselect' }]);
      return;
    }

    if (this.settings.selectable !== false && !(this.settings.selectable === 'mixed' && !isCheckbox)) {
      if (!isChecked) {
        activeBlock.addClass('is-selected').attr('aria-selected', 'true');
        activeCheckbox.prop('checked', true);
      }

      this.selectedRows.push({ idx, data: this.settings.dataset[idx], elem: activeBlock });
      action = isChecked ? 'deselected' : 'selected';
    }

    if (this.settings.selectable === 'mixed' && !isCheckbox) {
      const isActivated = activeBlock.hasClass('is-activated');
      allBlocks.removeClass('is-activated');

      if (isActivated) {
        activeBlock.removeClass('is-activated');
        this.element.triggerHandler('deactivated', [{ row: idx, item: this.settings.dataset[idx] }]);
      } else {
        activeBlock.addClass('is-activated');
        this.element.triggerHandler('activated', [{ row: idx, item: this.settings.dataset[idx] }]);
      }
      return;
    }

    /**
    * Fires when a block is selected
    *
    * @event selected
    * @property {object} event - The jquery event object
    * @property {object} ui - The dialog object
    */
    /**
    * Fires when a block is unselected
    *
    * @event unselected
    * @property {object} event - The jquery event object
    * @property {object} ui - The dialog object
    */
    this.element.triggerHandler(isChecked ? 'deselected' : 'selected', [{ selectedRows: this.selectedRows, action }]);
  },

  /**
   * Render an individual block element.
   * @returns {void}
   * @private
   */
  renderBlock() {
    let blockelements = '';
    const s = this.settings;
    const dslength = s.dataset.length;
    const selectText = (Locale ? Locale.translate('Select') : 'Select');

    for (let i = 0; i < dslength; i++) {
      const data = s.dataset[i];
      const tabindex = this.settings.selectable === 'mixed' ? '0' : '-1';

      blockelements += `<div class="block is-selectable" role="listitem" tabindex="0">
      <input type="checkbox" aria-hidden="true" role="presentation" class="checkbox" id="checkbox${i}" tabindex="${tabindex}" idx="${i}">
      <label for="checkbox${i}" class="checkbox-label"><span class="audible">${selectText}</span></label>
      <img alt="Placeholder Image" src="${data.img || data.image}" class="image-round">
      <p> ${data.maintxt || data.title} <br> ${data.subtxt || data.subtitle} </p></div>`;
    }

    this.element.attr('role', 'list').append(blockelements);
  },

  /**
   * Handle updated settings and values.
   * @param  {settings} settings The new settings to use.
   * @returns {void}
   */
  updated(settings) {
    this.settings = utils.mergeSettings(this.element, settings, this.settings);

    if (settings && settings.dataset) {
      this.settings.dataset = settings.dataset;
    }

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
    this.element.off(`click.${COMPONENT_NAME}`);
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
