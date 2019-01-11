import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// Settings and Options
const COMPONENT_NAME = 'blockgrid';

/**
 * Component Name - Does this and that.
 * @class Blockgrid
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 * @param {array} [settings.dataset=[]] An array of data objects
 * @param {string} [settings.selectable=false] Controls the selection mode this can be:
 * @param {boolean} paging Enable paging mode
 * @param {number} pagesize Number of rows per page
 * @param {array} pagesizes Array of page sizes to show in the page size dropdown.
 * false, 'single' or 'multiple' or 'mixed'
 */
const BLOCKGRID_DEFAULTS = {
  dataset: [],
  selectable: false, // false, 'single' or 'multiple' or mixed
  paging: false,
  pagesize: 25,
  pagesizes: [10, 25, 50, 75]
};

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
   * @returns {Pager|undefined} a pager API, if applicable
   */
  get pagerAPI() {
    return this.element.data('pager');
  },

  /**
   * Do initialization, build up and / or add events ect.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  init() {
    // Do initialization. Build or Events ect
    this.handlePaging();

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
    this.element.empty();

    this.render();
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

    if (this.pagerAPI) {
      this.element.on(`page.${COMPONENT_NAME}`, () => {
        this.build();
      }).on(`pagesizechange.${COMPONENT_NAME}`, () => {
        this.build();
      });
    }

    return this;
  },

  handlePaging() {
    if (!this.settings.paging) {
      return;
    }

    this.element.addClass('paginated');
    this.element.pager({
      componentAPI: this,
      dataset: this.settings.dataset,
      pagesize: this.settings.pagesize,
      pagesizes: this.settings.pagesizes
    });
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

      /**
      * Fires when a block is deactivated
      *
      * @event deactivated
      * @memberof Blockgrid
      * @property {object} event - The jquery event object
      * @property {object} ui - The dialog object
      */
      /**
      * Fires when a block is activated
      *
      * @event activated
      * @memberof Blockgrid
      * @property {object} event - The jquery event object
      * @property {object} ui - The dialog object
      */
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
    * @memberof Blockgrid
    * @property {object} event - The jquery event object
    * @property {object} ui - The dialog object
    */
    /**
    * Fires when a block is unselected
    *
    * @event deselected
    * @memberof Blockgrid
    * @property {object} event - The jquery event object
    * @property {object} ui - The dialog object
    */
    this.element.triggerHandler(isChecked ? 'deselected' : 'selected', [{ selectedRows: this.selectedRows, action }]);
  },

  /**
   * Renders the blockgrid page.
   * @returns {void}
   */
  render() {
    let blockelements = '';
    let displayedDataset = this.settings.dataset;
    const selectText = (Locale ? Locale.translate('Select') : 'Select');

    if (this.pagerAPI) {
      // If the paging information sets limits on the dataset, customize the
      // displayed dataset to fit the conditions.
      const pagerInfo = this.pagerAPI.state;
      if (pagerInfo.pages > 1) {
        const trueActivePage = pagerInfo.activePage > 0 ? pagerInfo.activePage - 1 : 0;
        const firstRecordIdx = pagerInfo.pagesize * trueActivePage;
        const lastRecordIdx = pagerInfo.pagesize * (trueActivePage + 1);
        displayedDataset = displayedDataset.slice(firstRecordIdx, lastRecordIdx);
      }
    }

    for (let i = 0; i < displayedDataset.length; i++) {
      const data = displayedDataset[i];
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
   * @deprecated as of v4.15.0
   * @private
   * Render an individual block element.
   * @returns {void}
   */
  renderBlock() {
    return this.render();
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

    this.teardown();
    this.init();
    return this;
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  teardown() {
    this.element.off(`updated.${COMPONENT_NAME}`);
    this.element.off(`click.${COMPONENT_NAME}`);

    this.element.empty();
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
