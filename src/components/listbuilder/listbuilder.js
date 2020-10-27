import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';
import { Locale } from '../locale/locale';

// jQuery Components
import '../listview/listview.jquery';
import '../arrange/arrange.jquery';

// Component Name
const COMPONENT_NAME = 'listbuilder';

/**
 * A list of items with add/remove/delete and sort functionality.
 * @class ListBuilder
 * @constructor
 * @param {jQuery[]|HTMLElement} element The base element.
 * @param {object} [settings] incoming settings.
 *
 * @param {array} [settings.dataset]  Array of data
 * @param {string} [settings.handle]  The CSS Class of the handle element
 * @param {string|jQuery[]} [settings.btnAdd]  "Add" action button (takes a string representing a
 *  "data-action" attribute, or a jQuery-wrapped element reference).
 * @param {string|jQuery[]} [settings.btnEdit]  "Edit" action button (takes a string representing a
 *  "data-action" attribute, or a jQuery-wrapped element reference).
 * @param {string|jQuery[]} [settings.btnDelete]  "Delete" action button (takes a string representing a
 *  "data-action" attribute, or a jQuery-wrapped element reference).
 * @param {string|jQuery[]} [settings.btnGoUp]  "GoUp" action button (takes a string representing a
 *  "data-action" attribute, or a jQuery-wrapped element reference).
 * @param {string|jQuery[]} [settings.btnGoDown]  "GoDown" action button (takes a string representing a
 *  "data-action" attribute, or a jQuery-wrapped element reference).
 * @param {string|array} [settings.attributes = null] Add extra attributes like id's to the chart elements. For example `attributes: { name: 'id', value: 'my-unique-id' }`
 * @param {string} [settings.template]  representing HTML content that builds a list
 * @param {string} [settings.templateNewItem]  representing HTML content that builds a single list item
 * @param {string} [settings.templateItemContent]  representing HTML content that replaces the inner content
 *  section of each item.
 */

const LISTBUILDER_DEFAULTS = {
  dataset: [],
  handle: '.handle',
  btnAdd: 'add',
  btnEdit: 'edit',
  btnDelete: 'delete',
  btnGoUp: 'goup',
  btnGoDown: 'godown',
  attributes: null,
  template: '' +
    '<ul data-handle=".handle">' +
      '{{#dataset}}' +
        '{{#text}}' +
          '<li' +
            '{{#value}} data-value="{{value}}"{{/value}}' +
            '{{#selected}} selected="selected"{{/selected}}' +
            '{{#disabled}} class="is-disabled"{{/disabled}}' +
          '>' +
            '<span class="handle" focusable="false" aria-hidden="true" role="presentation">&#8286;</span>' +
            '<div class="item-content"><p>{{text}}</p></div>' +
          '</li>' +
        '{{/text}}' +
      '{{/dataset}}' +
    '</ul>',
  templateNewItem: '' +
    '<li data-value="{{text}}" role="option">' +
      '<span class="handle" focusable="false" aria-hidden="true" role="presentation">&#8286;</span>' +
      '<div class="item-content"><p>{{text}}</p></div>' +
    '</li>',
  templateItemContent: '<p>{{text}}</p>'
};

function ListBuilder(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, LISTBUILDER_DEFAULTS);
  if (settings && settings.dataset) {
    this.settings.dataset = settings.dataset;
  }
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// ListBuilder Methods
ListBuilder.prototype = {

  /**
   * @private
   * @returns {void}
   */
  init() {
    this
      .loadListview()
      .initDataset()
      .setElements()
      .handleEvents();

    setTimeout(() => {
      this.setSelected();
    }, 0);
  },

  /**
   * Load listview
   * @private
   * @returns {this} component instance
   */
  loadListview() {
    const s = this.settings;
    const lv = $('.listview', this.element);
    let attributes;
    if (s.attributes) {
      attributes = this.getLvAutomationAttributes('-listbuilder');
    }

    if (!s.dataset.length && lv.length && $('li', lv).length) {
      this.listApi = lv.listview({ selectable: 'single', attributes }).data('listview');
    } else if (lv.length) {
      this.listApi = lv.listview({ dataset: s.dataset, template: s.template, selectable: 'single', attributes }).data('listview');
    }
    return this;
  },

  /**
   * Get list view settings for automation attributes
   * @private
   * @param {string} suffix for listbuilder
   * @returns {object|array} attributes with suffix
   */
  getLvAutomationAttributes(suffix) {
    const s = this.settings;
    let attributes;
    if (s.attributes && typeof suffix === 'string' && suffix !== '') {
      if (Array.isArray(s.attributes)) {
        attributes = [];
        s.attributes.forEach((item) => {
          const value = typeof item.value === 'function' ? item.value(this) : item.value;
          attributes.push({ name: item.name, value: (value + suffix) });
        });
      } else {
        const value = typeof s.attributes.value === 'function' ? s.attributes.value(this) : s.attributes.value;
        attributes = { name: s.attributes.name, value: (value + suffix) };
      }
    }
    return attributes;
  },

  /**
   * Update the automation attributes for given list item
   * @private
   * @param {jQuery} li The list item
   * @returns {void}
   */
  updateLvAutomationAttributes(li) {
    const s = this.settings;
    if (s.attributes && li) {
      let lastIdx = this.dataset.length - 1;
      let found = true;
      let max = 1000; // max-limit
      let attributes;
      while (found && max > 0) {
        const suffix = `-listbuilder-listview-item-${lastIdx}`;
        attributes = this.getLvAutomationAttributes(suffix);
        found = this.findAutomationAttributesItem(attributes);
        lastIdx++;
        max--;
      }
      utils.addAttributes(li, this, attributes);
    }
  },

  /**
   * Initialize dataset
   * @private
   * @param {string|array} attributes The list of attributes key/value
   * @returns {boolean} True, if found item
   */
  findAutomationAttributesItem(attributes) {
    const s = this.settings;
    let r = false;
    if (s.attributes && attributes) {
      if (Array.isArray(attributes)) {
        for (let i = 0, l = attributes.length; i < l; i++) {
          const attr = attributes[i];
          const el = this.listApi.element.find(`[${attr.name}="${attr.value}"]`);
          if (el.length) {
            r = true;
            break;
          }
        }
      }
    }
    return r;
  },

  /**
   * Initialize dataset
   * @private
   * @returns {this} component instance
   */
  initDataset() {
    const s = this.settings;
    const nodes = $('.listview li', this.element);

    this.dataset = [];
    for (let i = 0, l = nodes.length; i < l; i++) {
      let data;
      const li = $(nodes[i]);
      if (s.dataset) {
        // Make sure it's not reference pointer to data object, make copy of data
        data = JSON.parse(JSON.stringify(s.dataset[i]));
        data.node = li;
      } else {
        data = this.extractNodeData(li);
      }
      this.dataset.push(data);
    }
    return this;
  },

  /**
   * Extract node data
   * @private
   * @param {jQuery[]} node element to be checked for data
   * @returns {object} data from the node.
   */
  extractNodeData(node) {
    const data = { node, text: $.trim($('.item-content', node).text()) };
    const value = node.attr('data-value');
    if (typeof value !== 'undefined') {
      data.value = value;
    }
    return data;
  },

  /**
   * Set elements
   * @private
   * @returns {this} component instance
   */
  setElements() {
    const s = this.settings;

    // Action buttons
    const setAction = (selector) => {
      if (this.isjQuery(selector)) {
        return selector;
      }
      if (typeof selector === 'string') {
        return $(`[data-action="${selector}"]`, this.element);
      }
      return null;
    };
    s.btnAdd = setAction(s.btnAdd);
    s.btnGoUp = setAction(s.btnGoUp);
    s.btnGoDown = setAction(s.btnGoDown);
    s.btnEdit = setAction(s.btnEdit);
    s.btnDelete = setAction(s.btnDelete);

    // Add automation attributes
    const suffix = 'listbuilder-btn';
    utils.addAttributes(s.btnAdd, this, s.attributes, `${suffix}-add`);
    utils.addAttributes(s.btnGoUp, this, s.attributes, `${suffix}-goup`);
    utils.addAttributes(s.btnGoDown, this, s.attributes, `${suffix}-godown`);
    utils.addAttributes(s.btnEdit, this, s.attributes, `${suffix}-edit`);
    utils.addAttributes(s.btnDelete, this, s.attributes, `${suffix}-delete`);

    // Init tooltips
    this.topButtons = s.btnAdd.add(s.btnGoUp).add(s.btnGoDown).add(s.btnEdit).add(s.btnDelete);
    this.topButtons.tooltip();

    // Make Draggable
    this.ul = $('.listview ul', this.element);
    this.arrangeApi = this.ul.arrange({
      handle: s.handle,
      placeholder: s.templateNewItem
    }).data('arrange');

    return this;
  },

  /**
   * Attach Events used by the Control
   * @private
   * @returns {void}
   */
  handleEvents() {
    let data;
    const self = this;
    const s = self.settings;

    // TOP BUTTONS =============================================================
    const topButtonsClick = (btn, method) => {
      btn.off('click.listbuilder')
        .on('click.listbuilder', () => {
          self[method]();
        });
    };
    topButtonsClick(s.btnAdd, 'addItem');
    topButtonsClick(s.btnGoUp, 'moveItemUp');
    topButtonsClick(s.btnGoDown, 'moveItemDown');
    topButtonsClick(s.btnEdit, 'editItem');
    topButtonsClick(s.btnDelete, 'deleteItem');

    // DRAGGABLE ===============================================================
    this.arrangeApi.element
      .on('beforearrange.listbuilder', (e, status) => {
        const d = this.getDataByNode(status.start);
        const str = s.templateItemContent.replace(/{{text}}/g, d.data.text);

        this.arrangeApi.placeholders.attr('data-value', d.data.text)
          .find('.item-content').html(str);
      })
      .on('arrangeupdate.listbuilder', (e, status) => {
        this.updateAttributes();
        this.arrayIndexMove(this.dataset, status.startIndex, status.endIndex);
        data = this.getDataByNode(status.end);
        data.indexBeforeMove = status.startIndex;
        this.element.triggerHandler('arrangeupdate', [data]);
      });

    $(`li:not(.is-disabled) ${this.arrangeApi.handle}`, this.ul)
      .on('mousedown.listbuilder touchstart.listbuilder', function () {
        const li = $(this);
        if (!li.is('.is-selected')) {
          li.trigger('click');
        }
      });

    $('.listview', this.element)
      .off('selected.listbuilder')
      .on('selected.listbuilder', (e, args) => {
        data = this.getDataByNode(args.elem[0]);

        /**
         * Fires when a item is selected.
         * @event selected
         * @memberof ListBuilder
         * @type {object}
         * @property {object} event - The jquery event object
         * @property {object} data - Data for this selected item
         */
        this.element.triggerHandler('selected', [data]);
      });

    this.updatedEventsStr = 'arrangeupdate.listbuilder aftergoup.listbuilder aftergodown.listbuilder exiteditmode.listbuilder';
    this.element
      .off(this.updatedEventsStr)
      .on(this.updatedEventsStr, (e, updatedData) => {
        /**
         * Fires when a item is updated.
         * @event updated
         * @memberof ListBuilder
         * @type {object}
         * @property {object} event - The jquery event object
         * @property {object} data - Data for this item
         */
        this.element.triggerHandler('updated', [updatedData]);
      });

    return this;
  }, // END: Handle Events -----------------------------------------------------

  /**
   * Add an item into edit mode.
   * @private
   * @returns {void}
   */
  addItem() {
    const self = this;
    const s = this.settings;

    /**
     * Fires before add new item.
     *
     * @event beforeadd
     * @memberof ListBuilder
     * @type {object}
     * @property {object} event - The jquery event object
     */
    $.when(this.element.triggerHandler('beforeadd')).done(() => {
      let li;
      let data;
      let index = 0;

      const node = self.listApi.selectedItems[0];
      const str = s.templateNewItem.replace(/{{text}}/g, Locale.translate('NewItem'));

      if (node && node.length > 0) {
        data = self.getDataByNode(node);
        index = data.index + 1;
        $(str).insertAfter(node);
        li = $('li', self.ul).eq(index);
      } else {
        self.ul.prepend(str);
        li = $('li:first-child', self.ul);
      }

      self.dataset.push(self.extractNodeData(li));
      self.arrayIndexMove(self.dataset, self.dataset.length - 1, index);
      self.updateAttributes();
      self.updateLvAutomationAttributes(li);
      li.trigger('click');
      self.arrangeApi.updated();
      self.editItem(true);

      data = { index, data: self.dataset[index] };

      /**
       * Fires after add new item.
       * @event afteradd
       * @memberof ListBuilder
       * @type {object}
       * @property {object} event - The jquery event object
       * @property {object} data - Data for this new item
       */
      self.element.triggerHandler('afteradd', [data]);
    });
  },

  /**
   * Move the currently selected item up.
   * @private
   * @returns {void}
   */
  moveItemUp() {
    const self = this;
    const node = self.listApi.selectedItems[0];

    if (node && node.length > 0) {
      const data = self.getDataByNode(node);
      if (typeof data.index !== 'undefined' && data.index > 0) {
        /**
         * Fires before move up item.
         * @event beforegoup
         * @memberof ListBuilder
         * @type {object}
         * @property {object} event - The jquery event object
         * @property {object} data - Data for this item
         */
        $.when(self.element.triggerHandler('beforegoup', [data])).done(() => {
          const prev = node.prev();
          node.insertBefore(prev);
          self.updateAttributes();
          self.arrayIndexMove(self.dataset, data.index, data.index - 1);
          data.indexBeforeMove = data.index;
          data.index--;

          /**
           * Fires after move up item.
           * @event aftergoup
           * @memberof ListBuilder
           * @type {object}
           * @property {object} event - The jquery event object
           * @property {object} data - Data for this item
           */
          self.element.triggerHandler('aftergoup', [data]);
        });
      }
    }
  },

  /**
   * Move the currently selected item down.
   * @private
   * @returns {void}
   */
  moveItemDown() {
    const self = this;
    const node = self.listApi.selectedItems[0];
    if (node && node.length > 0) {
      const data = self.getDataByNode(node);
      if (typeof data.index !== 'undefined' && data.index < self.dataset.length - 1) {
        /**
         * Fires before move down item.
         * @event beforegodown
         * @memberof ListBuilder
         * @type {object}
         * @property {object} event - The jquery event object
         * @property {object} data - Data for this item
         */
        $.when(self.element.triggerHandler('beforegodown', [data])).done(() => {
          const next = node.next();
          node.insertAfter(next);
          self.updateAttributes();
          self.arrayIndexMove(self.dataset, data.index, data.index + 1);
          data.indexBeforeMove = data.index;
          data.index++;

          /**
           * Fires after move down item.
           * @event aftergodown
           * @memberof ListBuilder
           * @type {object}
           * @property {object} event - The jquery event object
           * @property {object} data - Data for this item
           */
          self.element.triggerHandler('aftergodown', [data]);
        });
      }
    }
  },

  /**
   * Edit the selected item
   * @private
   * @param {boolean} isNewItem  Is it a newly added item?
   * @returns {void}
   */
  editItem(isNewItem) {
    const node = this.listApi.selectedItems[0];
    if (node && node.length > 0) {
      if (node.is('.is-editing')) {
        this.commitEdit(node, isNewItem);
      } else {
        this.makeEditable(node, isNewItem);
      }
    }
  },

  /**
   * Make the node editable
   * @private
   * @param {object} node  The HTML element to edit
   * @param {boolean} isNewItem  Is it a newly added item?
   * @returns {void}
   */
  makeEditable(node, isNewItem) {
    const self = this;
    const data = self.getDataByNode(node);
    const container = $('.item-content', node);

    if (typeof data.index !== 'undefined' && data.index < self.dataset.length) {
      /**
       * Fires before edit item.
       * @event beforeedit
       * @memberof ListBuilder
       * @type {object}
       * @property {object} event - The jquery event object
       * @property {object} data - Data for this item
       */
      $.when(self.element.triggerHandler('beforeedit', [data])).done(() => {
        const origValue = xssUtils.escapeHTML((container.text().trim() || '').toString());
        const editInput = $(`<input name="edit-input" class="edit-input" type="text" value="${origValue}" />`);

        node.addClass('is-editing');
        container.html(editInput);
        setTimeout(() => {
          editInput.focus().select();
        }, 0);

        editInput
          .on('click.listbuilder', () => false)
          .on('blur.listbuilder', () => self.commitEdit(node, isNewItem))
          .on('keypress.listbuilder', (e) => {
            const key = e.keyCode || e.charCode || 0;
            if (key === 13) {
              self.commitEdit(node, isNewItem);
              node.focus();
            }
          });

        /**
         * Fires when enter to edit mode.
         * @event entereditmode
         * @memberof ListBuilder
         * @type {object}
         * @property {object} event - The jquery event object
         * @property {object} data - Data for this item
         */
        self.element.triggerHandler('entereditmode', [data]);
      });
    }
  },

  /**
   * Commit the changes to item.
   * @private
   * @param {object} node  The HTML element to commit changes
   * @param {boolean} isNewItem  Is it a newly added item?
   * @returns {void}
   */
  commitEdit(node, isNewItem) {
    const s = this.settings;
    const data = this.getDataByNode(node);
    const container = $('.item-content', node);
    const editInput = $('.edit-input', container);

    editInput.val(xssUtils.escapeHTML((editInput.val() || '').toString()));

    if (isNewItem) {
      data.data.value = editInput.val();
    }
    data.data.text = editInput.val();
    editInput.off('click.listbuilder blur.listbuilder keypress.listbuilder');
    container.html(s.templateItemContent.replace(/{{text}}/g, editInput.val()));
    node.removeClass('is-editing');

    /**
     * Fires when exited to edit mode.
     * @event exiteditmode
     * @memberof ListBuilder
     * @type {object}
     * @property {object} event - The jquery event object
     * @property {object} data - Data for this item
     */
    this.element.triggerHandler('exiteditmode', [data]);
  },

  /**
   * Delete the selected item.
   * @private
   * @returns {void}
   */
  deleteItem() {
    const self = this;
    const node = self.listApi.selectedItems[0];
    if (node && node.length > 0) {
      const data = self.getDataByNode(node);
      if (typeof data.index !== 'undefined') {
        /**
         * Fires before delete item.
         * @event beforedelete
         * @memberof ListBuilder
         * @type {object}
         * @property {object} event - The jquery event object
         * @property {object} data - Data for this item
         */
        $.when(self.element.triggerHandler('beforedelete', [data])).done(() => {
          self.listApi.removeAllSelected();
          self.updateAttributes();
          self.dataset.splice(data.index, 1);

          /**
           * Fires after delete item.
           * @event afterdelete
           * @memberof ListBuilder
           * @type {object}
           * @property {object} event - The jquery event object
           * @property {object} data - Data for this item
           */
          self.element.triggerHandler('afterdelete', [data]);
        });
      }
    }
  },

  /**
   * Get data from dataset by node
   * @param {jQuery[]} node  The HTML element to get data
   * @returns {object} node data
   */
  getDataByNode(node) {
    let data = {};
    for (let i = 0, l = this.dataset.length; i < l; i++) {
      const d = this.dataset[i];
      if ($(d.node).is(node)) {
        data = { index: i, data: d };
        break;
      }
    }
    return data;
  },

  /**
   * Move an array element position
   * @private
   * @param {array} arr .
   * @param {number} from .
   * @param {number} to .
   * @returns {void}
   */
  arrayIndexMove(arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
  },

  /**
   * Check if given object is a jQuery object
   * @private
   * @param {object} obj .
   * @returns {boolean} true if jQuery
   */
  isjQuery(obj) {
    return (obj && (obj instanceof jQuery || obj.constructor.prototype.jquery));
  },

  /**
   * Move cursor to end
   * http://stackoverflow.com/a/26900921
   * @private
   * @param {object} el as element.
   * @returns {void}
   */
  moveCursorToEnd(el) {
    setTimeout(() => {
      if (typeof el.selectionStart === 'number') {
        el.selectionEnd = el.value.length;
        el.selectionStart = el.value.length;
      } else if (typeof el.createTextRange !== 'undefined') {
        const range = el.createTextRange();
        range.collapse(false);
        range.select();
      }
    }, 100);
  },

  /**
   * Update attributes
   * @private
   * @returns {void}
   */
  updateAttributes() {
    const nodes = $('li', this.ul);

    for (let i = 0, l = nodes.length; i < l; i++) {
      $(nodes[i]).attr({ 'aria-posinset': i + 1, 'aria-setsize': l });
    }
  },

  /**
   * Update dataset
   * @private
   * @param {object} ds as dataset.
   * @returns {void}
   */
  updateDataset(ds) {
    const nodes = $('li', this.ul);
    const lv = $('.listview', this.element).data('listview');

    lv.deselectItemsBetweenIndexes([0, nodes.length - 1]);
    this.settings.dataset = ds;
    lv.loadData(this.settings.dataset);

    this
      .initDataset()
      .setElements()
      .handleEvents();

    setTimeout(() => {
      this.setSelected();
    }, 0);
  },

  /**
   * Set pre selected items
   * @private
   * @returns {object} this api
   */
  setSelected() {
    const nodes = $('li[selected]', this.ul);
    for (let i = 0, l = nodes.length; i < l; i++) {
      const li = $(nodes[i]);
      li.removeAttr('selected');
      if (!li.is('.is-selected')) {
        li.trigger('click');
      }
    }
    return this;
  },

  /**
   * Make selected
   * @private
   * @param {object} selector .
   * @returns {void}
   */
  select(selector) {
    const li = this.getListItem(selector);

    if (li && !li.is('.is-selected')) {
      li.trigger('click');
    }
  },

  /**
   * Make unselected
   * @private
   * @param {object} selector .
   * @returns {void}
   */
  unselect(selector) {
    const li = this.getListItem(selector);

    if (li && li.is('.is-selected')) {
      li.trigger('click');
    }
  },

  /**
   * Get an item from list, selector: can be
   * jQuery, DOM element, zero based index or 'first'|'last' as string
   * @private
   * @param {object} selector .
   * @returns {object} item node
   */
  getListItem(selector) {
    let li = $();
    if (this.isElement(selector) && $.contains(this.ul, selector)) {
      li = this.isjQuery(selector) ? selector : $(selector);
    } else {
      const idx = parseInt(selector, 10);
      const items = $('li', this.ul);
      if (!isNaN(idx) && (idx > -1 && idx < items.length)) {
        li = items.eq(idx); // zero based index
      } else if ((`${selector}`).toLowerCase() === 'first') {
        li = items.first(); // first
      } else if ((`${selector}`).toLowerCase() === 'last') {
        li = items.last(); // last
      }
    }
    // Make sure to return only one item -or- null
    if (li.length < 1) {
      return null;
    }
    if (li.length > 1) {
      return li.eq(0);
    }
    return li;
  },

  /**
   * Check if given object is a DOM object
   * @private
   * @param {object} obj .
   * @returns {object} item node
   */
  isElement(obj) {
    return (this.isjQuery(obj) && obj.get(0) instanceof Element) || obj instanceof Element;
  },

  /**
   * Make enable.
   * @returns {void}
   */
  enable() {
    this.element.removeClass('is-disabled')
      .find('.toolbar .buttonset button').removeAttr('disabled').end()
      .find('.toolbar .buttonset button[data-original-disabled]')
      .attr('disabled', 'disabled')
      .removeAttr('data-original-disabled');

    this.ul
      .find('li').removeClass('is-disabled').end()
      .find('li[data-original-disabled]')
      .addClass('is-disabled')
      .removeAttr('data-original-disabled');
  },

  /**
   * Make disable.
   * @returns {void}
   */
  disable() {
    this.element.addClass('is-disabled')
      .find('.toolbar .buttonset button[disabled]').attr('data-original-disabled', 'disabled').end()
      .find('.toolbar .buttonset button')
      .attr('disabled', 'disabled');

    this.ul
      .find('li.is-disabled').attr('data-original-disabled', 'is-disabled').end()
      .find('li')
      .addClass('is-disabled');
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {this} component instance
   */
  unbind() {
    this.element.off(this.updatedEventsStr);
    $('.listview', this.element).off('selected.listbuilder');

    $(`li ${this.arrangeApi.handle}`, this.ul)
      .off('mousedown.listbuilder touchstart.listbuilder');

    this.arrangeApi.element
      .off('beforearrange.listbuilder arrangeupdate.listbuilder').destroy();

    this.topButtons.off('click.listbuilder');
    if (this.topButtons) {
      for (let i = 0, l = this.topButtons.length; i < l; i++) {
        const tooltipApi = $(this.topButtons[i]).data('tooltip');
        if (tooltipApi && typeof tooltipApi.destroy === 'function') {
          tooltipApi.destroy();
        }
      }
    }

    if (this.listApi && typeof this.listApi.destroy === 'function') {
      this.listApi.destroy();
    }

    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} [settings] incoming settings.
   * @returns {this} component instance
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, LISTBUILDER_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
   * Teardown process for this plugin
   * @returns {void}
   */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { ListBuilder, COMPONENT_NAME };
