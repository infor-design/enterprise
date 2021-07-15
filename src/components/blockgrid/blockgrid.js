import { breakpoints } from '../../utils/breakpoints';
import * as debug from '../../utils/debug';
import { deprecateMethod, warnAboutDeprecation } from '../../utils/deprecated';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// Settings and Options
const COMPONENT_NAME = 'blockgrid';

/**
 * The Blockgrid Component displays data as selectable blocks within a simple grid.
 * @class Blockgrid
 * @param {string} element The element for the constuctor
 * @param {string} [settings] Incoming Blockgrid settings
 * @param {array} [settings.dataset=[]] An array of data objects that will be represented as blocks.
 * @param {string} [settings.selectable=false] Controls the selection mode this can be: false, 'single' or 'multiple' or 'mixed'
 * @param {boolean} paging Enable paging mode
 * @param {object} [settings.pagerSettings={}] if paging is enabled, the settings inside this object will be passed to the pager for configuration.
 * @param {number} [settings.pagerSettings.pagesize=25] Number of rows per page
 * @param {array} [settings.pagerSettings.pagesizes=[]] Array of page sizes to show in the page size dropdown.
 * @param {string|array} [settings.attributes = null] Add extra attributes like id's to the chart elements. For example `attributes: { name: 'id', value: 'my-unique-id' }`
*/
const BLOCKGRID_DEFAULTS = {
  dataset: [],
  selectable: false, // false, 'single' or 'multiple' or mixed
  paging: false,
  withImage: true,
  pagerSettings: {
    pagesize: 25,
    pagesizes: [10, 25, 50, 75],
    showFirstButton: false,
    showLastButton: false
  },
  attributes: null
};

// Moves/Converts certain settings
function handleLegacySettings(storedSettings, incomingSettings) {
  if (!incomingSettings) {
    return storedSettings;
  }

  // Bypasses deep copy issues with `mergeSettings`
  if (incomingSettings.dataset) {
    storedSettings.dataset = incomingSettings.dataset;
  }
  if (incomingSettings.pagesize) {
    warnAboutDeprecation('`pagerSettings.pagesize` setting', '`pagesize` setting');
    storedSettings.pagerSettings.pagesize = incomingSettings.pagesize;
    delete storedSettings.pagesize;
  }
  if (incomingSettings.pagesizes) {
    warnAboutDeprecation('`pagerSettings.pagesizes` setting', '`pagesizes` setting');
    storedSettings.pagerSettings.pagesizes = incomingSettings.pagesizes;
    delete storedSettings.pagesizes;
  }

  return storedSettings;
}

function Blockgrid(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(element, settings, BLOCKGRID_DEFAULTS);
  this.settings = handleLegacySettings(this.settings, settings);
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
   * @returns {Blockgrid} The Component prototype, useful for chaining.
   */
  init() {
    this.selectedRows = [];
    this.handlePaging();

    return this
      .build()
      .handleEvents();
  },

  /**
   * Add any needed markup to the component.
   * @returns {Blockgrid} The Component prototype, useful for chaining.
   * @private
   */
  build() {
    if (this.settings.paging) {
      this.element.empty();
    }

    this.render();
    return this;
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @returns {Blockgrid} The Component prototype, useful for chaining.
   * @private
   */
  handleEvents() {
    const self = this;

    this.element.on(`click.${COMPONENT_NAME}`, '.block', (e) => {
      const activeBlock = $(e.currentTarget);
      const target = $(e.target);
      const isCheckbox = target.is('.checkbox-label') || target.is('.checkbox');

      setTimeout(() => {
        self.select(activeBlock, isCheckbox);
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
      self.select(activeBlock, false);
    });

    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      self.updated();
    });

    if (this.pagerAPI) {
      this.element.on(`page.${COMPONENT_NAME}`, () => {
        this.previousFocusedElement = true;
        this.build();
      }).on(`pagesizechange.${COMPONENT_NAME}`, () => {
        this.previousFocusedElement = true;
        this.build();
      });
    }

    return this;
  },

  /**
   * @private
   * @returns {void}
   */
  handlePaging() {
    if (!this.settings.paging) {
      return;
    }

    const pagerSettings = utils.extend({}, this.settings.pagerSettings, {
      componentAPI: this,
      dataset: this.settings.dataset
    });

    this.element.addClass('paginated');
    this.element.pager(pagerSettings);
  },

  /**
   * Run selection over a block item.
   * This method is slated to be removed in a future v4.21.0 or v5.0.0.
   * @deprecated as of v4.15.0. Please use `select()` instead.
   * @param {jQuery[]} activeBlock the jQuery-wrapped DOM element that will be selected.
   * @param {boolean} isCheckbox True if a checkbox, used for mixed mode.
   * @returns {void}
   */
  selectBlock(activeBlock, isCheckbox) {
    return deprecateMethod(this.select, this.selectBlock).apply(this, [activeBlock, isCheckbox]);
  },

  /**
   * Run selection over a block item
   * @param {jQuery[]} activeBlock the jQuery-wrapped DOM element that will be selected.
   * @param {boolean} isCheckbox True if a checkbox, used for mixed mode.
   */
  select(activeBlock, isCheckbox) {
    const allBlocks = this.element.find('.block');
    const allChecks = this.element.find('.checkbox');
    const activeCheckbox = activeBlock.find('.checkbox');
    const isChecked = activeCheckbox.is(':checked');
    let action = '';
    const idx = Number(activeCheckbox.data('idx'));

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
    const s = this.settings;
    const selectText = (Locale ? Locale.translate('Select') : 'Select');
    let blockelements = '';
    let displayedDataset = s.dataset;

    if (this.pagerAPI) {
      // If the paging information sets limits on the dataset, customize the
      // displayed dataset to fit the conditions.
      const pagerInfo = this.pagerAPI.state;
      if (pagerInfo.pages > 1) {
        const trueActivePage = pagerInfo.activePage > 0 ? pagerInfo.activePage - 1 : 0;
        const firstRecordIdx = pagerInfo.pagesize * trueActivePage;
        const lastRecordIdx = pagerInfo.pagesize * (trueActivePage + 1);
        displayedDataset = displayedDataset.slice(firstRecordIdx, lastRecordIdx);

        // If the dataset doesn't actually have IDs, set temporary ones for
        // tracking selected/deselected
        if (displayedDataset.length !== s.dataset.length) {
          for (let j = 0; j < displayedDataset.length; j++) {
            if (displayedDataset[j].id) {
              break;
            }
            displayedDataset[j].id = firstRecordIdx + j;
          }
        }
      }
    }

    const checkedIdxs = [];
    this.selectedRows.forEach((row) => {
      checkedIdxs.push(row.idx);
    });

    for (let i = 0; i < displayedDataset.length; i++) {
      const data = displayedDataset[i];
      const tabindex = s.selectable === 'mixed' ? '0' : '-1';
      let selected = '';
      let checked = '';

      if (checkedIdxs.indexOf(data.id) > -1) {
        selected = ' is-selected';
        checked = ' checked';
      }

      let blockElement;
      if (s.withImage) {
        // Set image alt text
        const imageAlt = data.imgAlt || data.imageAlt || `${data.maintxt || data.title} ${Locale.translate('Image')}`;

        blockElement = `<div class="block is-selectable${selected}" role="listitem" tabindex="0">
          <input type="checkbox" aria-hidden="true" role="presentation" class="checkbox" id="checkbox${i}" tabindex="${tabindex}" data-idx="${data.id || i}"${checked}>
          <label for="checkbox${i}" class="checkbox-label">
            <span class="audible">${selectText}</span>
          </label>
          <img alt="${imageAlt}" src="${data.img || data.image}" class="image-round">
          <p> ${data.maintxt || data.title} <br> ${data.subtxt || data.subtitle} </p>
        </div>`;
      } else {
        let text = '';

        if (data.content) {
          data.content.forEach((content) => {
            text += `<br>${content}`;
          });
        }

        blockElement = `<div class="block text-block is-selectable${selected}" role="listitem" tabindex="0">
        <input type="checkbox" aria-hidden="true" role="presentation" class="checkbox" id="checkbox${i}" tabindex="${tabindex}" data-idx="${data.id || i}"${checked}>
        <label for="checkbox${i}" class="checkbox-label text-block">
          <span class="audible">${selectText}</span>
        </label>
        <p><b>${data.title}</b>${text}</p>
        </div>`;
      }

      blockelements += blockElement;
    }

    this.element.attr('role', 'list').append(blockelements);

    // Add automation attributes
    if (s.attributes) {
      for (let i = 0; i < displayedDataset.length; i++) {
        const checkbox = this.element.find(`#checkbox${i}`);
        const label = this.element.find(`.checkbox-label[for="checkbox${i}"]`);

        utils.addAttributes(checkbox, this, s.attributes, `blockgrid-checkbox${i}`);
        utils.addAttributes(label, this, s.attributes, `blockgrid-checkbox-label${i}`);
      }
    }

    // If a Blockgrid element had focus before rendering, restore focus to the first new block
    if (this.previousFocusedElement) {
      setTimeout(() => {
        this.element.find('.block').first().focus();
        delete this.previousFocusedElement;
      }, 0);
    }
  },

  /**
   * Render an individual block element.
   * This method is slated to be removed in a future v4.21.0 or v5.0.0.
   * @deprecated as of v4.15.0. Please use `render()` instead.
   * @returns {void}
   */
  renderBlock() {
    return deprecateMethod(this.render, this.renderBlock).apply(this);
  },

  /**
   * Handle updated settings and values.
   * @param  {settings} settings The new settings to use.
   * @returns {void}
   */
  updated(settings) {
    this.settings = utils.mergeSettings(this.element, settings, this.settings);
    this.settings = handleLegacySettings(this.settings, settings);

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
    this.selectedRows = [];
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
