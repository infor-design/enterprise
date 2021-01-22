/* eslint-disable no-underscore-dangle */
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';
import { Environment as env } from '../../utils/environment';

// jQuery Components
import '../listview/listview.jquery';

// The name of this component
const COMPONENT_NAME = 'swaplist';

// The Component Defaults
const SWAPLIST_DEFAULTS = {
  // Searchable
  searchable: false,

  // Datasets
  available: null,
  selected: null,
  additional: null,

  // Main containers
  availableClass: '.available',
  selectedClass: '.selected',
  additionalClass: '.full-access',

  // Action buttons
  availableBtn: '.btn-moveto-selected',
  selectedBtnLeft: '.btn-moveto-left',
  selectedBtnRight: '.btn-moveto-right',
  additionalBtn: '.btn-moveto-selected',

  draggable: {
    available: true,
    selected: true,
    additional: true
  },

  attributes: null,
  attributesOverride: true,

  // Template HTML
  template: '' +
    '<ul data-swap-handle=".handle">' +
      '{{#dataset}}' +
        '{{#text}}' +
          '<li data-id="{{id}}"' +
            '{{#value}} data-value="{{value}}"{{/value}}' +
            '{{#selected}} selected="selected"{{/selected}}' +
            '{{#disabled}} class="is-disabled"{{/disabled}}' +
          '>' +
            '<span class="handle" focusable="false" aria-hidden="true" role="presentation">&#8286;</span>' +
            '<div class="swaplist-item-content"><p>{{text}}</p></div>' +
          '</li>' +
        '{{/text}}' +
      '{{/dataset}}' +
    '</ul>'
};

/**
* The SwapList Component creates a list of options that can be picked and organized.
* @class SwapList
* @param {object} element The component element.
* @param {object} [settings] The component settings.
* @param {boolean} [settings.searchable = false] If true, associates itself with a Searchfield/Autocomplete
*  and allows itself to be filtered
* @param {array} [settings.available] An array containing items for the available bucket.
* @param {array} [settings.selected] An array containing items for the selected bucket.
* @param {array} [settings.additional] An array containing items for the additional bucket.
* @param {string} [settings.availableClass = '.available'] A class name linking the available root element.
* @param {string} [settings.selectedClass = '.selected'] A class name linking the selected root element.
* @param {string} [settings.additionalClass = '.full-access'] A class name linking the additional root element.
* @param {string} [settings.availableBtn = '.btn-moveto-selected'] A class name linking the available button element.
* @param {string} [settings.selectedBtnLeft = '.btn-moveto-left'] A class name linking the move left button element.
* @param {string} [settings.selectedBtnRight = '.btn-moveto-right'] A class name linking the move right button element.
* @param {string} [settings.additionalBtn = '.btn-moveto-selected'] A class name linking the additional button element.
* @param {string|array} [settings.attributes = null] Add extra attributes like id's to the chart elements. For example `attributes: { name: 'id', value: 'my-unique-id' }`
* @param {boolean} [settings.attributesOverride=true] if true, will override existing the attributes key/value.
* @param {string} [settings.template] An Html String with the mustache template for the view.
* @param {object} [settings.draggable] An object containing boolean key/value to make container/s
*  disable for dragging and moving items. Supported keys with draggable are "available",
*  "selected", "additional".
*/
function SwapList(element, settings) {
  this.settings = utils.mergeSettings(element, settings, SWAPLIST_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// SwapList Methods
SwapList.prototype = {

  init() {
    const s = this.settings;
    s.draggable = $.extend(true, SWAPLIST_DEFAULTS.draggable, s.draggable);
    this.isTouch = env.features.touch;
    this.isAdditional = $(`${s.additionalClass} .listview`, this.element).length > 0;

    if (this.isTouch) {
      this.element.addClass('is-touch');
    }
    this.loadListview();
    this.initDataset();
    this.setElements();
    this.isMultiSelectClass();

    setTimeout(() => { // Wait for Listview availability
      this.makeDraggable();
      this.handleEvents();
      this.initSelected(s.availableClass);
      this.initSelected(s.additionalClass);
    }, 0);
  },

  /**
   * Load listview
   * @private
   */
  loadListview() {
    const s = this.settings;
    const containers = [
      { dataset: s.available, class: s.availableClass, draggable: s.draggable.available },
      { dataset: s.selected, class: s.selectedClass, draggable: s.draggable.selected },
      { dataset: s.additional, class: s.additionalClass, draggable: s.draggable.additional }
    ];

    for (let i = 0, l = containers.length; i < l; i++) {
      const c = containers[i];
      const lv = $(`${c.class} .listview`, this.element);
      const list = lv.data('listview');
      const options = { dataset: c.dataset || [], selectable: 'multiple', showCheckboxes: false };
      const isSearchable = ((s.searchable === true || s.searchable === 'true') && ($(`${c.class} .searchfield`, this.element).length > 0));

      if (isSearchable) {
        options.searchable = true;
      }

      // Initialize listview
      if (!c.dataset && lv.length && $('li', lv).length) {
        lv.listview(options);
      } else if (lv.length) {
        // Remove any previous listview instance
        if (list) {
          list.destroy();
        }

        // Force to have id attribute
        if (s.template.indexOf('data-id="{{id}}"') === -1) {
          s.template = s.template.replace('<li', '<li data-id="{{id}}"');
        }

        options.template = s.template;
        options.dataset = c.dataset || [];

        // Generate unique id
        options.dataset.forEach((node) => {
          if (!(/string|number/.test(typeof node.id)) || node.id === '') {
            node.id = `sw${(Date.now().toString(36) + Math.round((Math.random() * 36 ** 12)).toString(36).substr(2, 5)).toLowerCase()}`;
          }
        });

        if (options.dataset.length === 0) {
          options.forceToRenderOnEmptyDs = true;
        }
        options.attributesOverride = s.attributesOverride;
        options.attributes = this.getLvAutomationAttributes(c.class);
        lv.listview(options);
      }

      // Add css class('is-not-droppable') to ul in this container
      if (!c.draggable) {
        $('ul', lv).addClass('is-not-droppable');
      }
    }
  },

  /**
   * Get list view settings for automation attributes
   * @private
   * @param {string} cssClass class name
   * @returns {object|array} attributes with suffix
   */
  getLvAutomationAttributes(cssClass) {
    const s = this.settings;
    let attributes;
    if (s.attributes && typeof cssClass === 'string' && cssClass.length > 1) {
      const suffix = `-swaplist-${cssClass.substring(1)}`; // remove first dot
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
   * Set elements
   * @private
   */
  setElements() {
    const s = this.settings;
    let disabledBtnStr = '';

    this.offset = null;

    this.containers = $(`${s.availableClass},${
      s.selectedClass},${
      s.additionalClass}`, this.element);

    this.actionButtons = $(`${s.availableBtn},${
      s.additionalBtn},${
      s.selectedBtnLeft},${
      s.selectedBtnRight}`, this.element);

    this.selectedButtons = $(`${s.selectedBtnLeft},${
      s.selectedBtnRight}`, this.element);

    this.tabButtonsStr = `${
      s.availableBtn}, ${
      s.additionalBtn}, ${
      this.selectedButtons.length > 1 ?
        s.selectedBtnRight : s.selectedBtnLeft}`;

    this.dragElements = 'ul:not(.is-not-droppable), ul:not(.is-not-droppable) li:not(.is-disabled)';
    this.dragStart = 'dragstart.swaplist touchstart.swaplist gesturestart.swaplist';
    this.dragEnterWhileDragging = 'dragenter.swaplist';
    this.dragOverWhileDragging = 'dragover.swaplist touchmove.swaplist gesturechange.swaplist';
    this.dragEnd = 'dragend.swaplist touchend.swaplist touchcancel.swaplist gestureend.swaplist';

    this.selections = {
      items: [],
      owner: null,
      related: null,
      droptarget: null,
      isInSelection: null,
      isHandle: null,
      placeholder: null,
      placeholderTouch: null,
      dragged: null,
      draggedIndex: null
    };

    // Dragging time placeholder
    s.numOfSelectionsClass = 'num-of-selections';
    s.itemContentClass = 'swaplist-item-content';
    s.itemContentTempl = $(`<div><p><span class="${s.numOfSelectionsClass}">###</span>
      <span class="${s.numOfSelectionsClass}-text">&nbsp;</span></p><div/>`);

    // Add automation attributes to header buttons and root element
    if (s.attributes) {
      const autoAttr = [{
        btn: $(`${s.availableClass} ${s.availableBtn}`, this.element),
        suffix: (s.availableClass || '').substring(1)// available
      }, {
        btn: $(`${s.selectedClass} ${s.selectedBtnLeft}`, this.element),
        suffix: `${(s.selectedClass || '').substring(1)}-left`// selected-left
      }, {
        btn: $(`${s.selectedClass} ${s.selectedBtnRight}`, this.element),
        suffix: `${(s.selectedClass || '').substring(1)}-right`// selected right
      }, {
        btn: $(`${s.additionalClass} ${s.additionalBtn}`, this.element),
        suffix: (s.additionalClass || '').substring(1)// additional
      }];
      autoAttr.forEach((x) => {
        x.suffix = `swaplist-btn-${x.suffix}`;
      });
      autoAttr.forEach(x => utils.addAttributes(x.btn, this, s.attributes, x.suffix, s.attributesOverride));
      utils.addAttributes(this.element, this, s.attributes, 'swaplist', s.attributesOverride);
    }

    // Make top buttons disabled if not draggable
    if (!s.draggable.available) {
      disabledBtnStr = `${s.availableClass} ${s.availableBtn},${s.selectedBtnLeft}`;
      $(disabledBtnStr, this.element).prop('disabled', true);
    }
    if (!s.draggable.selected) {
      disabledBtnStr = `${s.selectedBtnLeft},${s.selectedBtnRight}`;
      if (!s.draggable.available) {
        disabledBtnStr += `,${s.additionalClass} ${s.additionalBtn}`;
      }
      if (!this.isAdditional || !s.draggable.additional) {
        disabledBtnStr += `,${s.availableClass} ${s.availableBtn}`;
      }
      $(disabledBtnStr, this.element).prop('disabled', true);
      $(`${s.additionalClass} ${s.additionalBtn}`, this.element).addClass('is-rotate');
    }
    if (!s.draggable.additional) {
      $(`${s.additionalClass} ${s.additionalBtn},${
        s.selectedBtnRight}`, this.element).prop('disabled', true);
    }
  },

  /**
   * When list is Empty force to add css class "is-multiselect"
   * @private
   */
  isMultiSelectClass() {
    const s = this.settings;
    const containers = [s.availableClass, s.selectedClass, s.additionalClass];

    for (let i = 0, l = containers.length; i < l; i++) {
      const lv = $(`${containers[i]} .listview`, this.element);
      if (!$('li', lv).length) {
        lv.addClass('is-multiselect');
      }
    }
  },

  /**
   * Initialize pre selected items
   * @private
   * @param {jQuery|HTMLElement} container container element
   * @returns {void}
   */
  initSelected(container) {
    container = this.isjQuery(container) ? container : $(container, this.element);
    if (container.length) {
      const list = $('.listview', container).data('listview');
      const selected = $('li[selected]', container);

      for (let i = 0, l = selected.length; i < l; i++) {
        const li = $(selected[i]);
        li.removeAttr('selected');
        list.select(li);// Select this item
      }
      this.moveElements(container, this.settings.selectedClass);
    }
  },

  /**
   * Move Elements
   * @private
   * @param {jQuery[]|HTMLElement} from beginning container
   * @param {jQuery[]|HTMLElement} to ending contaner
   * @returns {void}
   */
  moveElements(from, to) {
    if (to === null) {
      return;
    }

    from = (typeof from !== 'string') ? from : $(from, this.element);
    to = (typeof to !== 'string') ? to : $(to, this.element);
    const list = $('.listview', from).data('listview');

    this.clearSelections();
    this.selections.owner = from;
    this.selections.droptarget = to;

    if (this.isTouch) {
      if (list.selectedItems) {
        for (let i = 0, l = list.selectedItems.length; i < l; i++) {
          this.selections.items[i] = list.selectedItems[i].closest('li');
        }
      }
    } else {
      this.selections.items = list.selectedItems;
    }

    this.setSelectionsItems(this.selections.owner);
    this.unselectElements(list);

    if (this.selections.items.length) {
      this.selections.move = {
        items: this.selections.itemsData,
        from: this.getContainer(this.selections.itemsData)
      };
      const result = this.element.triggerHandler('beforeswap', [this.selections.move]);
      if ((typeof result === 'boolean' && !result) || (typeof result === 'string' && result.toLowerCase() === 'false')) {
        return;
      }

      const ul = $('ul', to);
      const currentSize = $('li', ul).length;
      const size = this.selections.items.length + currentSize;

      if (this.selections.items) {
        for (let i = 0, l = this.selections.items.length; i < l; i++) {
          const val = $(this.selections.items[i]);
          val.attr({ 'aria-posinset': currentSize + i + 1, 'aria-setsize': size }).find('mark.highlight').contents().unwrap();
          ul.append(val);
        }
      }

      this.afterUpdate($('.listview', to).data('listview'));
    }
  },

  /**
   * Get container info from given list items
   * @private
   * @param {Array} items to get container info.
   * @returns {Object} container info (jQuery container element, css-class)
   */
  getContainer(items) {
    const s = this.settings;

    if (typeof items[0] === 'object' && items[0].node) {
      const container = items[0].node.closest('.card');
      let cssClass = '';

      if (container.is(s.availableClass)) {
        cssClass = s.availableClass;
      } else if (container.is(s.selectedClass)) {
        cssClass = s.selectedClass;
      } else if (container.is(s.additionalClass)) {
        cssClass = s.additionalClass;
      }
      return { container, class: cssClass };
    }
    return null;
  },

  /**
   * Un-select Elements
   * @private
   * @param {jQuery|HTMLElement} list the list
   */
  unselectElements(list) {
    if (list.selectedItems) {
      for (let i = 0, l = list.selectedItems.length; i < l; i++) {
        list.select($(list.selectedItems[i]));
      }
    }
    if (list && list.element) {
      list.element.find('li').attr('aria-selected', false).removeClass('is-selected');
    }
  },

  /**
   * Detect browser support for drag-n-drop
   * @private
   * @returns {boolean} whether or not drag-n-drop is supported
   */
  isDragAndDropSupports() {
    const div = document.createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
  },

  /**
   * Detect browser support for match-media
   * @private
   * @returns {boolean} whether or not matchMedia is supported in this browser
   */
  isMatchMediaSupports() {
    return (typeof window.matchMedia !== 'undefined' || typeof window.msMatchMedia !== 'undefined');
  },

  /**
   * Detect browser viewport
   * @private
   * @returns {object} contains width and height
   */
  viewport() {
    let e = window;
    let a = 'inner';
    if (!('innerWidth' in window)) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    return { width: e[`${a}Width`], height: e[`${a}Height`] };
  },

  /**
   * Check given [max-width] is true/false
   * @private
   * @param {number} w the current page width
   * @returns {boolean} whether or not the max-width has been matched
   */
  isMaxWidth(w) {
    return ((this.isMatchMediaSupports() && window.matchMedia(`(max-width: ${w}px)`).matches) || this.viewport().width <= w);
  },

  /**
   * Make Draggable
   * @private
   */
  makeDraggable() {
    const self = this;
    const ul = $('ul', this.element);

    if (this.isDragAndDropSupports) {
      // Use Handle if available
      this.handle = ul.first().attr('data-swap-handle');
      this.handle = (!this.isTouch && $(this.handle, ul).length > 0) ? this.handle : null;
      $(this.handle, ul).addClass('draggable')
        .off('mousedown.swaplist touchstart.swaplist')
        .on('mousedown.swaplist touchstart.swaplist', () => {
          this.selections.isHandle = true;
        })
        .off('mouseup.swaplist touchend.swaplist')
        .on('mouseup.swaplist touchend.swaplist', () => {
          this.selections.isHandle = false;
        });

      this.targets = ul.attr({ 'aria-dropeffect': 'none' });

      this.items = $('li:not(.is-disabled)', this.element)
        .not('a[href], img')
        .off('selectstart.swaplist')
        .on('selectstart.swaplist', function () {
          if (this.dragDrop) { this.dragDrop(); } // ie9
          return false;
        })
        .end()
        .attr({ draggable: true })
        .addClass(self.handle ? '' : 'draggable');
    }
  },

  /**
   * Get Element By Touch In List
   * @private
   * @param {jQuery|HTMLElement} list the list element
   * @param {number} x touch event's x coordinate
   * @param {number} y touch event's y coordinate
   * @returns {jQuery[]} component that was tapped
   */
  getElementByTouchInList(list, x, y) {
    let returns = false;
    const listJq = $(list);

    for (let i = 0, l = listJq.length; i < l; i++) {
      const item = $(listJq[i]);
      const offset = item.offset();

      if (!(x <= offset.left || x >= offset.left + item.outerWidth() ||
            y <= offset.top || y >= offset.top + item.outerHeight())) {
        returns = item;
      }
    }
    return returns;
  },

  /**
   * Drag touch element
   * @private
   * @param {jQuery.Event} e jquery-wrapped `touch` event
   * @param {jQuery[]} elm the element being dragged
   */
  draggTouchElement(e, elm) {
    const orig = e.originalEvent.changedTouches[0];
    elm[0].style.top = `${orig.pageY - this.offset.y}px`;
    elm[0].style.left = `${orig.pageX - this.offset.x}px`;
  },

  /**
   * Shorctut for testing whether a modifier key is pressed
   * @private
   * @param {jQuery.Event} e the keypress event
   * @returns {boolean} whether or not a modifier key is pressed
   */
  hasModifier(e) {
    return (e.ctrlKey || e.metaKey || e.shiftKey);
  },

  /**
   * Applying dropeffect to the target containers
   * @private
   */
  addDropeffects() {
    if (this.targets) {
      for (let i = 0, l = this.targets.length; i < l; i++) {
        $(this.targets[i]).attr({ 'aria-dropeffect': 'move', tabindex: 0 });
      }
    }
    if (this.selections && this.selections.items) {
      for (let i = 0, l = this.selections.items.length; i < l; i++) {
        $(this.selections.items[i]).attr({ 'aria-grabbed': true, tabindex: 0 });
      }
    }
  },

  /**
   * Removing dropeffect from the target containers
   * @private
   */
  clearDropeffects() {
    this.targets.attr({ 'aria-dropeffect': 'none' }).removeAttr('tabindex');
    if (this.selections && this.selections.items) {
      for (let i = 0, l = this.selections.items.length; i < l; i++) {
        const val = $(this.selections.items[i]);
        val.removeAttr(`aria-grabbed${!val.is(':focus') ? ' tabindex' : ''}`);
      }
    }
  },

  /**
   * Clear selections
   * @private
   */
  clearSelections() {
    this.selections.items = [];
    this.selections.itemsData = [];
    this.selections.owner = null;
    this.selections.related = null;
    this.selections.droptarget = null;
    this.selections.isInSelection = null;
    this.selections.dragged = null;
    this.selections.placeholder = null;
    this.selections.placeholderTouch = null;
    $('ul, li', this.element).removeClass('over');
    $('#sl-placeholder-container, #sl-placeholder-touch, #sl-placeholder-touch2, #sl-placeholder').remove();
  },

  /**
   * Set selections items
   * @private
   * @param {jQuery[]|HTMLElement} container the container element
   */
  setSelectionsItems(container) {
    container = this.isjQuery(container) ? container : $(container, this.element);
    const nodes = $('.listview li', container);
    const containerAPI = container.find('.listview').data('listview');
    let dataList = this.getDataList(container);
    let isFiltered = false;

    if (containerAPI && containerAPI.filteredDataset) {
      dataList = [...containerAPI.filteredDataset];
      isFiltered = true;
    }

    for (let i = 0, l = nodes.length; i < l; i++) {
      const li = $(nodes[i]);
      const itemData = dataList[i];
      if (isFiltered) {
        itemData.node = li;
        delete itemData._isFilteredOut;
      }
      if (li.is('.is-selected')) {
        this.selections.itemsData.push(itemData);
      }
    }
  },

  /**
   * Init dataset
   * @private
   */
  initDataset() {
    const s = this.settings;
    const containers = [
      { type: 'available', dataset: s.available, class: s.availableClass },
      { type: 'selected', dataset: s.selected, class: s.selectedClass },
      { type: 'additional', dataset: s.additional, class: s.additionalClass }
    ];

    this.dataset = { available: [], selected: [] };
    if (this.isAdditional) {
      this.dataset.additional = [];
    }

    for (let i = 0, l = containers.length; i < l; i++) {
      const c = containers[i];
      const nodes = $(`${c.class} .listview li`, this.element);

      for (let nodeIndex = 0, l2 = nodes.length; nodeIndex < l2; nodeIndex++) {
        let data;
        let value;
        const li = $(nodes[nodeIndex]);
        if (c.dataset) {
          // Make sure it's not reference pointer to data object, make copy of data
          data = JSON.parse(JSON.stringify(c.dataset[nodeIndex]));
          delete data.selected;
        } else {
          data = { text: $.trim($('.swaplist-item-content', li).text()) };
          value = li.attr('data-value');
          if (value) {
            data.value = value;
          }
        }
        if (this.dataset[c.type]) {
          data.node = li;
          this.dataset[c.type].push(data);
        }
      }
    }
  },

  /**
   * Get data list
   * @private
   * @param {jQuery[]|HTMLElement} container the container element
   * @returns {object|array} the subset of the dataset desired
   */
  getDataList(container) {
    const s = this.settings;
    const d = this.dataset;
    container = this.isjQuery(container) ? container : $(container, this.element);

    if (container.is(s.additionalClass)) {
      return d.additional;
    }
    if (container.is(s.selectedClass)) {
      return d.selected;
    }
    if (container.is(s.availableClass)) {
      return d.available;
    }
    return [];
  },

  /**
   * Move an array element position
   * @private
   * @param {array} arr target array to manipulate
   * @param {number} from index to pull from
   * @param {number} to index to move to
   */
  arrayIndexMove(arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
  },

  /**
   * Sync dataset
   * @private
   * @param {jQuery[]} owner element that currently contains the dataset
   * @param {jQuery[]} droptarget element that will receive the dataset
   */
  syncDataset(owner, droptarget) {
    const droptargetNodes = $('.listview li', droptarget);
    const ownerAPI = owner.find('.listview').data('listview');
    const dropTargetAPI = droptarget.find('.listview').data('listview');
    const ownerDataList = this.getDataList(owner);
    const dtDataList = this.getDataList(droptarget);
    const isMoved = (mOwner, mItem) => {
      if (mOwner && mItem) {
        const id = { owner: mOwner.getAttribute('data-id'), item: mItem.getAttribute('data-id') };
        return ((typeof id.owner !== 'undefined') && (typeof id.item !== 'undefined') && (id.owner === id.item));
      }
      return false;
    };

    if (owner.is(droptarget)) {
      const syncedList = [];
      for (let i = 0, l = droptargetNodes.length; i < l; i++) {
        const item = droptargetNodes[i];
        for (let ownerIndex = 0, l2 = ownerDataList.length; ownerIndex < l2; ownerIndex++) {
          const ownerItem = ownerDataList[ownerIndex];
          if (isMoved(ownerItem.node[0], item)) {
            syncedList.push(ownerItem);
            break;
          }
        }
      }
      ownerDataList.splice(0, ownerDataList.length);
      for (let i = 0, l = syncedList.length; i < l; i++) {
        ownerDataList.push(syncedList[i]);
      }
    } else {
      for (let i = 0, l = this.selections.items.length; i < l; i++) {
        const item = this.selections.items[i];
        let canLoop = true;
        for (let dtIndex = 0, l2 = droptargetNodes.length; dtIndex < l2 && canLoop; dtIndex++) {
          if ($(droptargetNodes[dtIndex]).is(item)) {
            for (let ownerIndex = 0, l3 = ownerDataList.length; ownerIndex < l3; ownerIndex++) {
              const ownerItem = ownerDataList[ownerIndex];
              if (isMoved(ownerItem.node[0], item[0])) {
                dtDataList.push(ownerItem);
                ownerDataList.splice(ownerIndex, 1);
                this.arrayIndexMove(dtDataList, dtDataList.length - 1, dtIndex);
                canLoop = false;
                break;
              }
            }
          }
        }
      }
    }

    ownerAPI.updated({ dataset: ownerDataList });
    dropTargetAPI.updated({ dataset: dtDataList });
    this.makeDraggable();
  },

  /**
   * Check if a object is jQuery object
   * @private
   * @param {object} obj the object being checked
   * @returns {boolean} whether or not the object is a jQuery selector
   */
  isjQuery(obj) {
    return (obj && (obj instanceof jQuery || obj.constructor.prototype.jquery));
  },

  /**
   * Update attributes
   * @private
   * @param {jQuery[]} list the target element to update
   */
  updateAttributes(list) {
    const items = $('li', list);

    for (let i = 0, l = items.length; i < l; i++) {
      $(items[i]).attr({ 'aria-posinset': i + 1, 'aria-setsize': l });
    }
  },

  /**
   * After update
   * @private
   * @param {jQuery[]} list the target element to change after an update
   */
  afterUpdate(list) {
    const focusIdx = this.selections.droptarget.find('li:focus').index();
    const focusClass = `.card.${this.selections.droptarget[0].classList[1]} li`;

    if (list) {
      if (this.selections.placeholder) {
        list.select(this.selections.placeholder);
        this.selections.placeholder.focus();
      }
      this.unselectElements(list);
      this.syncDataset(this.selections.owner, this.selections.droptarget);
      this.updateAttributes($('.listview', this.selections.owner));
      this.updateAttributes($('.listview', this.selections.droptarget));
      if (this.selections.items.length) {
        this.selections.move = $.extend(true, this.selections.move, {
          to: this.getContainer([{ node: this.selections.droptarget.find('li:first') }])
        });
        /**
        * Fires when any bucket has its content changed.
        * @event swapupdate
        * @memberof SwapList
        * @type {object}
        * @property {object} event - The jquery event object
        * @property {array} items - List of items data
        */
        this.element.triggerHandler('swapupdate', [this.selections.move]);
      }
    }

    this.selections.items.forEach((elem) => {
      elem.show();
    });

    this.clearDropeffects();
    this.clearSelections();
    this.items.removeClass('is-dragging is-dragging-touch');

    if (focusIdx >= 0) {
      this.element.find(focusClass).eq(focusIdx).focus();
    }
  },

  /**
   * Get items from provided container
   * @private
   * @param {jQuery[]|HTMLElement} container the container being checked
   * @returns {object|array} dataset
   */
  getItems(container) {
    container = this.isjQuery(container) ? container : $(container, this.element);
    return this.getDataList(container);
  },

  /**
   * Get the current representative dataset with only the available elements in it.
   * @returns {object|array} dataset
   */
  getAvailable() {
    return this.getDataList(this.settings.availableClass);
  },

  /**
   * Get the current representative dataset with only the selected elements in it.
   * @returns {object|array} dataset
   */
  getSelected() {
    return this.getDataList(this.settings.selectedClass);
  },

  /**
   * Get the current representative dataset with only the additional elements in it.
   * @returns {object|array} dataset
   */
  getAdditional() {
    return this.getDataList(this.settings.additionalClass);
  },

  /**
   * Make selected if dragged element was not selected
   * @private
   * @param {object} list the list to manipulate
   * @param {jQuery[]} target the target to give a "selected" state
   * @returns {boolean} whether or not an item was made selected
   */
  draggedMakeSelected(list, target) {
    let isInSelection = false;
    if (!this.selections.isInSelection) {
      // Check if dragged element was selected or not
      if (list.selectedItems) {
        for (let i = 0, l = list.selectedItems.length; i < l; i++) {
          if (target.is(list.selectedItems[i])) {
            isInSelection = true;
            return false;
          }
        }
      }
      if (!isInSelection) {
        list.select(target); // Make selected
        this.selections.isInSelection = true;
      }
    }
    return true;
  },

  /**
   * Updates the internal datasets and refresh the ui.
   * @param {object} ds The updated dataset(s) of the form.
   *  `{available: [], selected: [], additional: []}`
   * @returns {void}
   */
  updateDataset(ds) {
    const s = this.settings;
    const containers = [
      { type: 'available', dataset: ds.available, class: s.availableClass },
      { type: 'selected', dataset: ds.selected, class: s.selectedClass },
      { type: 'additional', dataset: ds.additional, class: s.additionalClass }
    ];

    for (let i = 0, l = containers.length; i < l; i++) {
      const c = containers[i];
      const lv = $(`${c.class} .listview`, this.element);
      const api = lv.data('listview');

      if (api) {
        api.deselectItemsBetweenIndexes([0, $('li', lv).length - 1]);
        s[c.type] = c.dataset || [];
        api.loadData(s[c.type]);
      }
    }

    this.initDataset();
    this.makeDraggable();
    this.initSelected(s.availableClass);
    this.initSelected(s.additionalClass);
  },

  /**
   * Removes event bindings from the swaplist instance.
   * @private
   * @returns {this} component instance
   */
  unbind() {
    this.actionButtons.off('click.swaplist');
    this.containers.off('keydown.swaplist', '.listview');
    this.selectedButtons.off('keydown.swaplist');
    this.element.off('keydown.swaplist', this.tabButtonsStr);
    this.element.off(`${this.dragStart} ${this.dragEnterWhileDragging} ${this.dragOverWhileDragging} ${this.dragEnd}`, this.dragElements);

    $('#sl-placeholder-container, #sl-placeholder-touch, #sl-placeholder-touch2, #sl-placeholder').remove();
    return this;
  },

  /**
   * Updates this instance of the swaplist component with new settings.
   * @private
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, SWAPLIST_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
   * Destroys this instance of the swaplist component and removes its link to its base element.
   * @returns {void}
   */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  // Handle Events
  handleEvents() {
    const self = this;
    const settings = self.settings;
    const selections = self.selections;

    // TOP BUTTONS =============================================================================
    self.actionButtons.off('click.swaplist').on('click.swaplist', function () {
      const actionButton = $(this);
      const container = actionButton.closest('.card'); // Current list clicked from

      let moveTo = null;

      if (container.is(settings.availableClass)) { // Move from Available to Selected or Additional
        if (settings.draggable.selected) {
          moveTo = settings.selectedClass;
        } else {
          moveTo = self.isAdditional && settings.draggable.additional ?
            settings.additionalClass : null;
        }
        self.moveElements(settings.availableClass, moveTo);
      } else if (container.is(settings.additionalClass)) {
        // Move from Additional to Selected or Available
        if (settings.draggable.selected) {
          moveTo = settings.selectedClass;
        } else {
          moveTo = settings.draggable.available ? settings.availableClass : null;
        }
        self.moveElements(settings.additionalClass, moveTo);
      } else if (container.is(settings.selectedClass)) {
        // Move from Selected
        if (actionButton.is(settings.selectedBtnLeft)) { // to Available
          self.moveElements(settings.selectedClass, settings.availableClass);
        } else if (actionButton.is(settings.selectedBtnRight)) { // to Additional
          self.moveElements(settings.selectedClass, settings.additionalClass);
        }
      }
    });

    // KEYSTROKE ===============================================================================
    // Keydown event to implement selections
    self.containers.on('keydown.swaplist', '.listview', function (e) {
      const container = $(this).closest(self.containers);
      e = e || window.event;
      if (e.keyCode === 77 && self.hasModifier(e)) { // Modifier + M
        if (!container.is(settings.selectedClass) ||
          (container.is(settings.selectedClass) && self.selectedButtons.length === 1)) {
          container.find(self.actionButtons).trigger('click.swaplist');
        } else {
          self.selectedButtons.first().focus();
        }
        e.preventDefault();
      }
    });

    // Keydown event to handle selected container
    self.selectedButtons.on('keydown.swaplist', function (e) {
      const btn = $(this);
      let index;
      let move;
      e = e || window.event;
      if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
        btn.trigger('click.swaplist');
        e.preventDefault();
      }
      // Left or Right arrow
      if ((e.keyCode === 37 || e.keyCode === 39) && self.selectedButtons.length > 1) {
        index = self.selectedButtons.index(this);
        if (e.keyCode === 37) {
          move = index > 0 ? index - 1 : self.selectedButtons.length - 1;
        } else {
          move = index < self.selectedButtons.length - 1 ? index + 1 : 0;
        }
        self.selectedButtons[move].focus();
      }
    });

    self.element.on('keydown.swaplist', self.tabButtonsStr, function (e) {
      const btn = $(this);
      const keyCode = e.keyCode || e.which;

      if (keyCode === 9 && !e.shiftKey) { // Tab key
        const card = btn.closest('.card')[0];
        const items = [].slice.call(card.querySelectorAll('li[tabindex]'));
        const itemsLen = items.length;
        let found = false;
        if (itemsLen) {
          items.forEach((item) => {
            const tabindex = parseInt(item.getAttribute('tabindex'), 10);
            if (tabindex !== -1) {
              found = true;
            }
          });
        }
        if (!found) {
          const item = card.querySelector('li');
          if (item) {
            item.setAttribute('tabindex', 0);
          }
        }
      }
    });

    // SEARCHFIELD =============================================================================
    self.containers.on('filtered.swaplist', '.listview', () => {
      self.makeDraggable();
    });

    // DRAGGABLE ===============================================================================
    self.element
      .on('mousedown.swaplist', self.dragElements, (e) => {
        if (self.handle) {
          const target = $(e.target).closest('li');
          target.attr({ draggable: $(e.target).is('.draggable') });
        }
        e.stopPropagation();
      })
      // Dragstart - initiate dragging
      .on(self.dragStart, self.dragElements, (e) => {
        e.stopImmediatePropagation();
        if (self.handle && !selections.isHandle) {
          e.stopPropagation();
          return;
        }
        let rect;
        let touch;
        let placeholderContainer;
        const target = $(e.target).closest('li');
        const list = $('.listview', target.closest('.card')).data('listview');

        // Not in draging area
        if (!list) {
          return;
        }

        if (!self.isTouch) {
          self.draggedMakeSelected(list, target);
        }

        self.clearSelections(); // Clear selection before fill

        selections.owner = target.closest('.card');
        selections.dragged = target;
        selections.draggedIndex = target.index();
        selections.placeholder = target.clone(true);
        selections.placeholder.attr('id', 'sl-placeholder');

        self.setSelectionsItems(selections.owner);

        selections.items = list.selectedItems;

        self.selections.move = {
          items: self.selections.itemsData,
          from: self.getContainer(self.selections.itemsData)
        };

        /**
          * Fires before moving an element allowing you to access the draggable item.
          * @event beforeswap
          * @memberof SwapList
          * @type {object}
          * @property {object} event - The jquery event object
          * @property {array} items - List of selected items data
          */
        const result = self.element.triggerHandler('beforeswap', [self.selections.move]);
        if ((typeof result === 'boolean' && !result) || (typeof result === 'string' && result.toLowerCase() === 'false')) {
          selections.dragged = null;
          return;
        }

        $(`.${settings.numOfSelectionsClass}`, settings.itemContentTempl).html(selections.items.length);
        $(`.${settings.numOfSelectionsClass}-text`, settings.itemContentTempl).text(Locale.translate('ItemsSelected'));
        self.addDropeffects();

        if (!self.isTouch) {
          selections.dragged.addClass('is-dragging');
          e.originalEvent.dataTransfer.setData('text', '');

          if (selections.items.length > 1) {
            $(`.${settings.itemContentClass}`, selections.dragged).html(settings.itemContentTempl.html());
          }
        } else {
          rect = target[0].getBoundingClientRect();
          touch = e.originalEvent.changedTouches[0];

          // Save offset
          self.offset = {
            x: touch.pageX - rect.left,
            y: touch.pageY - rect.top
          };

          for (let i = 0, l = self.containers.length; i < l; i++) {
            self.containers[i].style.zIndex = '1';
          }
          selections.placeholderTouch = selections.dragged.clone(true);

          if (selections.items.length > 1 && !$('#sl-placeholder-touch2').length) {
            selections.dragged.clone()
              .addClass('is-dragging-touch').attr('id', 'sl-placeholder-touch2')
              .insertBefore(selections.dragged)
              .hide();
          }
          selections.placeholderTouch.attr('id', 'sl-placeholder-touch').removeClass('is-selected').hide();

          // Mobile view with three container(available, selected, additional) prepend to parent
          placeholderContainer = (self.element.is('.one-third') && self.isMaxWidth(766)) ? self.element.parent() : self.element;
          placeholderContainer.prepend('<ul id="sl-placeholder-container"></ul>');

          $('#sl-placeholder-container').append(selections.placeholderTouch);
          $('#sl-placeholder-container')[0].style.width = `${selections.owner.width()}px`;
          $('#sl-placeholder-touch')[0].style.width = `${selections.owner.width()}px`;

          self.draggTouchElement(e, selections.placeholderTouch);
        }
        e.stopPropagation();
      })

    // Dragenter - set that related/droptarget
      .on(self.dragEnterWhileDragging, self.dragElements, (e) => {
        if (!selections.dragged) {
          return;
        }
        self.element.triggerHandler('draggingswap', [selections.move]);
        selections.related = e.target;
        $('ul, li', self.element).removeClass('over');
        $(e.target).closest('ul, li').addClass('over');
        selections.droptarget = $(selections.related).closest('.card');
        $('[aria-grabbed="true"]', self.element).not(selections.dragged).slideUp();
        e.stopPropagation();
      })

    // Dragover - allow the drag by preventing default, for touch set related/droptarget
      .on(self.dragOverWhileDragging, self.dragElements, function (e) {
        if (!selections.dragged) {
          return;
        }
        let touch;
        let overItem = $(this);
        const list = $('.listview', selections.dragged.closest('.card')).data('listview');

        if (self.isTouch) {
          if (!!self.handle && !selections.isHandle) {
            return;
          }

          if (!selections.isInSelection) {
            self.draggedMakeSelected(list, selections.dragged);
            selections.items = list.selectedItems;
            $(`.${settings.numOfSelectionsClass}`, settings.itemContentTempl).html(selections.items.length);
          }

          touch = e.originalEvent.touches[0];
          overItem = self.getElementByTouchInList($('ul, li', self.element), touch.pageX, touch.pageY) || overItem;

          selections.dragged.addClass('is-dragging');
          selections.placeholderTouch.addClass('is-dragging is-dragging-touch');
          selections.placeholderTouch.show();

          $('[aria-grabbed="true"]', self.element)
            .not(selections.dragged)
            .not(selections.placeholderTouch)
            .not('#sl-placeholder-touch2')
            .slideUp();

          if (selections.items.length > 1) {
            $(`.${settings.itemContentClass}`, (selections.placeholderTouch.add('#sl-placeholder-touch2')))
              .html(settings.itemContentTempl.html());

            $('#sl-placeholder-touch2').show();
            selections.dragged.hide();
          }
          self.draggTouchElement(e, selections.placeholderTouch);

          self.element.triggerHandler('draggingswap', [selections.move]);
          selections.related = overItem;
          $('ul, li', this.element).removeClass('over');
          overItem.closest('ul, li').addClass('over');
          selections.droptarget = selections.related.closest('.card');
        }
        e.preventDefault();
        e.stopPropagation();
      })

    // Dragend - implement items being validly dropped into targets
      .on(self.dragEnd, self.dragElements, (e) => {
        if (!selections.dragged || !selections.droptarget) {
          return;
        }
        const related = $(selections.related).closest('li');
        const ul = $('ul', selections.droptarget);
        const currentSize = $('li', ul).length;
        const size = selections.items.length + currentSize;

        self.unselectElements($('.listview', selections.owner).data('listview'));

        $.each(selections.items, (index, val) => {
          val = $(val);
          val.find('mark.highlight').contents().unwrap();
          if (currentSize && !$(selections.related).is('ul')) {
            const isLess = (related.index() < selections.draggedIndex) &&
              (selections.owner.is(selections.droptarget));
            const el = isLess ? val : $(selections.items[(selections.items.length - 1) - index]);
            const posinset = related.index() + (isLess ? index + 1 : index + 2);

            val.attr({ 'aria-posinset': posinset, 'aria-setsize': size });
            related[isLess ? 'before' : 'after'](el);
          } else {
            val.attr({ 'aria-posinset': currentSize + index + 1, 'aria-setsize': size });
            ul.append(val);
          }
          val.focus();
        });

        if (selections.items.length > 1) {
          $(`.${settings.itemContentClass}`, selections.dragged).html($(`.${settings.itemContentClass}`, selections.placeholder).html());
          if (self.isTouch) {
            selections.dragged.show();
          }
        }

        if (self.isTouch) {
          for (let i = 0, l = self.containers.length; i < l; i++) {
            self.containers[i].style.zIndex = '';
          }
        }

        self.makeDraggable();

        selections.isHandle = null;
        $('[aria-grabbed="true"]', self.element).show();
        self.afterUpdate($('.listview', selections.droptarget).data('listview'));
        e.preventDefault();
        e.stopPropagation();
      });
  } // END: Handle Events ---------------------------------------------------------------------

};

export { SwapList, COMPONENT_NAME };
