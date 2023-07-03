import * as debug from '../../utils/debug';
import { deprecateMethod } from '../../utils/deprecated';
import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { Environment as env } from '../../utils/environment';
import { Locale } from '../locale/locale';
import { ListFilter } from '../listfilter/listfilter';
import { TagList } from '../tag/tag.list';
import { xssUtils } from '../../utils/xss';
import { stringUtils } from '../../utils/string';
import { renderLoop, RenderLoopItem } from '../../utils/renderloop';
import { VirtualScroll } from '../virtual-scroll/virtual-scroll';

// jQuery Components
import '../icons/icons.jquery';
import '../../utils/lifecycle/lifecycle.jquery';
import '../place/place.jquery';
import '../tooltip/tooltip.jquery';

// Name of this component.
const COMPONENT_NAME = 'dropdown';

// Dropdown Settings and Options
const moveSelectedOpts = ['none', 'all', 'group'];
const reloadSourceStyles = ['none', 'open', 'typeahead'];

/**
* The Dropdown allows users to select from a list. Like an Html Select.
* @class Dropdown
* @param {object} element The component element.
* @param {object} [settings] The component settings.
* @param {boolean} [settings.closeOnSelect = true]  When an option is selected, the list will close if set to "true".  List stays open if "false".
* @param {string} [settings.cssClass = null]  Append an optional css class to dropdown-list
* @param {string} [settings.dropdownIcon = 'dropdown'] Change the icon used as the "dropdown" arrow.
* @param {boolean} [settings.extraListWrapper = false] If true, adds an extra wrapping element in the Dropdown List (used for styling/scrolling).
* @param {string} [settings.filterMode = 'contains']  Search mode to use between 'startsWith' and 'contains', false will not allow client side filter
* @param {boolean} [settings.virtualScroll = false] If true virtual scrolling will be used, this is good for larger lists but may not work with all other features.
* @param {boolean} [settings.noSearch = false]  If true, disables the ability of the user to enter text
* in the Search Input field in the open combo box
* @param {boolean} [settings.showEmptyGroupHeaders = false]  If true, displays optgroup headers in the list
* even if no selectable options are present underneath.
* @param {boolean} [settings.showSelectAll] if true, shows a `Select All` option at the top of a multiselect.
* @param {boolean} [settings.showTags] if true, replaces the text-based pseudo-element in the page with a dismissible, tag-based display.
* @param {boolean} [settings.showSearchUnderSelected=false] if true, moves the Searchfield in the Dropdown list from directly on top of the pseudo-element to underneath/above, providing visibility into the currently selected results.  When configured as a Multiselect with Tags, this is the default option.
* @param {boolean} [settings.source]  A function that can do an ajax call.
* @param {boolean} [settings.sourceArguments = {}]  If a source method is defined, this flexible object can be
* passed into the source method, and augmented with parameters specific to the implementation.
* @param {boolean|string} [settings.reload = 'none']  Determines how a Dropdown list will repopulate its contents, when operating via AJAX.
* @param {boolean} [settings.reloadSourceOnOpen = false]  If set to true, will always perform an ajax call
* whenever the list is opened.  If false, the first AJAX call's results are cached.
* @param {boolean} [settings.empty = false]  Initialize Empty Value
* @param {boolean} [settings.delay = 300]  Typing buffer delay in ms
* @param {number} [settings.maxWidth = null] If set the width of the dropdown is limited to this pixel width.
* Fx 300 for the 300 px size fields. Default is size of the largest data.
* @param {number} [settings.width = null] Sets the width of the open list, by default its the size of the field
* @param {object} [settings.placementOpts = null]  Gets passed to this control's Place behavior
* @param {function} [settings.onKeyDown = null]  Allows you to hook into the onKeyDown. If you do you can access the keydown event data. And optionally return false to cancel the keyDown action.
* @param {object} [settings.tagSettings] if defined, passes along 'clickHandler' and 'dismissHandler' functions to any Tags in the Taglist
* @param {number|undefined} [settings.tagListMaxHeight=120] if defined, sets a maximum height for a rendered tag list, and makes it scrollable.
* @param {string} [settings.allTextString]  Custom text string for `All` text header use in MultiSelect.
* @param {string} [settings.selectedTextString]  Custom text string for `Selected` text header use in MultiSelect.
* @param {boolean} [settings.selectAllFilterOnly = true] if true, when using the optional "Select All" checkbox, the Multiselect will only select items that are in the current filter.  If false, or if there is no filter present, all items will be selected.
* @param {string|array} [settings.attributes = null] Add extra attributes like id's to the chart elements. For example `attributes: { name: 'id', value: 'my-unique-id' }`
*/
const DROPDOWN_DEFAULTS = {
  closeOnSelect: true,
  cssClass: null,
  dropdownIcon: 'dropdown',
  extraListWrapper: false,
  filterMode: 'contains',
  virtualScroll: false,
  maxSelected: undefined, // (multiselect) sets a limit on the number of items that can be selected
  moveSelected: 'none',
  moveSelectedToTop: undefined,
  multiple: false, // Turns the dropdown into a multiple selection box
  noSearch: false,
  showEmptyGroupHeaders: false,
  showSelectAll: false,
  showTags: false,
  showSearchUnderSelected: false,
  source: undefined,
  sourceArguments: {},
  reload: reloadSourceStyles[0],
  empty: false,
  delay: 300,
  maxWidth: null,
  placementOpts: null,
  onKeyDown: null,
  tagSettings: {},
  tagListMaxHeight: 120,
  allTextString: null,
  selectedTextString: null,
  selectAllFilterOnly: true,
  appendTo: '[role="main"]',
  attributes: null,
  width: undefined,
  widthTarget: undefined
};

function Dropdown(element, settings) {
  this.settings = utils.mergeSettings(element, settings, DROPDOWN_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Actual DropDown Code
Dropdown.prototype = {

  /**
   * @returns {array|string} currently-selected options
   */
  get value() {
    const reload = this.settings.reload;
    const multiple = this.settings.multiple;

    if (reload === 'typeahead') {
      if (multiple) {
        return this.selectedValues;
      }
      return this.element.val();
    }

    const result = [];
    const options = this.element[0].options;
    let opt;

    for (let i = 0; i < options.length; i++) {
      opt = options[i];
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }

    if (!multiple && result.length === 1) {
      return result[0];
    }
    return result;
  },

  /**
   * @returns {boolean} whether or not the text inside the in-page pseudo element too big to fit
   */
  get overflowed() {
    if (!this.isMobile() || (this.isMobile() && !this.isOpen())) {
      const span = this.pseudoElem.find('span').css('max-width', '');
      if (Math.round(span.width()) > Math.round(this.pseudoElem.width())) {
        span.css('max-width', '100%');
        return true;
      }
    }
    return false;
  },

  /**
   * @returns {boolean} whether or not the pseudo-element, or one of elements inside the Dropdown List has focus.
   */
  get isFocused() {
    const active = document.activeElement;
    const pseudoIsActive = this.pseudoElem.length && this.pseudoElem.is($(active));
    const listContainsActive = this.list && this.list.length && this.list[0].contains(active);
    const tagActive = this.tagListAPI && this.tagListAPI.element.contains(active);

    if (pseudoIsActive || listContainsActive || tagActive) {
      return true;
    }
    return false;
  },

  /**
   * @returns {boolean} whether or not this Dropdown component is a "short" field.
   */
  get isShortField() {
    return this.element.closest('.field-short').length > 0 ||
      this.element.closest('.form-layout-compact').length > 0;
  },

  /**
   * @returns {array} a list of currently selected options' values.
   */
  get selectedValues() {
    return this.selectedOptions.map(opt => opt.value);
  },

  /**
   * @returns {array} a list of selected options from inside this component's base element.
   */
  get selectedOptions() {
    return utils.getArrayFromList(this.element[0].querySelectorAll('option')).filter(opt => opt.selected);
  },

  /**
   * Initialize the dropdown.
   * @private
   * @returns {object} The api for chaining
   */
  init() {
    let orgId = this.element.attr('id');
    orgId = orgId ? xssUtils.stripTags(orgId) : '';

    this.inlineLabel = this.element.closest('label');
    this.inlineLabelText = this.inlineLabel.find('.label-text');
    this.isInlineLabel = this.element.parent().is('.inline');

    this.timer = null;
    this.filterTerm = '';
    this.keydownFlag = false;

    if (!orgId) {
      orgId = utils.uniqueId(this.element, 'dropdown');
      DOM.setAttribute(this.element[0], 'id', orgId);
      DOM.setAttribute(this.element.parent().find('label').first()[0], 'for', orgId);
    }

    if (env.os.name === 'ios' || env.os.name === 'android') {
      this.settings.noSearch = true;
    }

    // Add "is-disabled" class to greyed-out the field
    if (this.element.is(':disabled')) {
      this.element.closest('.field').addClass('is-disabled');
    }

    // convert <select> tag's size css classes for the pseudo element
    const elemClassList = this.element[0].classList;
    if (elemClassList.length === 0) {
      this.element[0].classList = 'dropdown';
    }
    let pseudoClassString = elemClassList.contains('dropdown-xs') ? 'dropdown input-xs' : //eslint-disable-line
      elemClassList.contains('dropdown-sm') ? 'dropdown input-sm' : //eslint-disable-line
        elemClassList.contains('dropdown-lg') ? 'dropdown input-lg' : 'dropdown'; //eslint-disable-line

    // Detect Inline Styles
    const style = this.element.attr('style');
    this.isHidden = style && style.indexOf('display: none') >= 0;

    // Build the wrapper if it doesn't exist
    let baseElement;
    if (this.isInlineLabel) {
      baseElement = this.inlineLabel.next('.dropdown-wrapper');
    } else {
      baseElement = this.element.parent('.dropdown-wrapper');
      if (!baseElement.length) {
        baseElement = this.element.next('.dropdown-wrapper');
      }
    }
    this.wrapper = baseElement;
    this.isWrapped = this.wrapper.length > 0;

    if (!this.isWrapped) {
      this.wrapper = $('<div class="dropdown-wrapper"></div>').insertAfter(this.element);
    }

    if (this.isWrapped) {
      this.pseudoElem = this.wrapper.find(`.${pseudoClassString}`);
      this.trigger = this.wrapper.find('.trigger');
    } else {
      this.pseudoElem = $(`div#${orgId}-shdo`);
    }

    if (elemClassList.contains('text-align-reverse')) {
      pseudoClassString += ' text-align-reverse';
    } else if (elemClassList.contains('text-align-center')) {
      pseudoClassString += ' text-align-center';
    }

    // Build sub-elements if they don't exist
    this.label = $(`label[for="${xssUtils.stripTags(orgId)}"]`);

    if (!this.pseudoElem.length) {
      this.pseudoElem = $(`<div class="${pseudoClassString}">`);
    } else {
      this.pseudoElem[0].setAttribute('class', pseudoClassString);
    }

    if (!this.isWrapped) {
      this.pseudoElem.append($('<span></span>'));
    }
    const toExclude = ['data-validate'];
    const attributes = DOM.getAttributes(this.element[0]);
    const attributesToCopy = this.getDataAttributes(attributes, toExclude);

    this.pseudoElem
      .attr(attributesToCopy.obj)
      .attr({
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-autocomplete': 'list',
        'aria-expanded': 'false'
      });
    this.renderPseudoElemLabel();

    if (this.settings.attributes) {
      utils.addAttributes(this.pseudoElem, this, this.settings.attributes, 'dropdown', true);
    }

    // Pass disabled/readonly from the original element, if applicable
    // "disabled" is a stronger setting than "readonly" - should take precedent.
    function handleStates(self) {
      const disabled = self.element.prop('disabled');
      const readonly = self.element.prop('readonly');

      if (disabled) {
        return self.disable();
      }

      if (readonly) {
        return self.readonly();
      }

      return self.enable();
    }
    handleStates(this);

    if (!this.isWrapped) {
      this.wrapper.append(this.pseudoElem, this.trigger);
    }

    // Check for and add the icon
    this.icon = this.wrapper.find('.icon');
    if (!this.icon.length) {
      this.icon = $.createIconElement(this.settings.dropdownIcon || 'dropdown');
      this.wrapper.append(this.icon);
    }

    // Setup the incoming options that can be set as properties/attributes
    if (this.element.prop('multiple') && !this.settings.multiple) {
      this.settings.multiple = true;
    }
    if (this.settings.multiple && !this.element.prop('multiple')) {
      this.element.prop('multiple', true);
    }

    // Create a taglist, if applicable
    if (this.settings.showTags) {
      // Force searchfield to be beneath/above the pseudo element
      // to prevent conflicts with the Tag List.
      this.settings.showSearchUnderSelected = true;
      this.pseudoElem[0].classList.add('has-tags');
      this.renderTagList();
    }

    const dataSource = this.element.attr('data-source');
    if (dataSource && dataSource !== 'source') {
      this.settings.source = dataSource;
    }
    const dataMaxselected = this.element.attr('data-maxselected');
    if (dataMaxselected && !isNaN(dataMaxselected)) { //eslint-disable-line
      this.settings.maxSelected = parseInt(dataMaxselected, 10);
    }

    // Maybe deprecate "moveSelectedToTop" in favor of "moveSelected"
    // _getMoveSelectedSetting()_ converts the old setting to the new text type.
    function getMoveSelectedSetting(incomingSetting, useText) {
      switch (incomingSetting) {
        case (useText ? 'true' : true):
          return 'all';
        case (useText ? 'false' : false):
          return 'none';
        default:
          if (moveSelectedOpts.indexOf(incomingSetting) > -1) {
            return incomingSetting;
          }
          return 'none';
      }
    }

    // Backwards compatibility for deprecated "moveSelectedToTop" setting.
    if (this.settings.moveSelectedToTop !== undefined) {
      this.settings.moveSelected = this.settings.moveSelectedToTop;
    }

    const dataMoveSelected = this.element.attr('data-move-selected');
    if (dataMoveSelected) {
      this.settings.moveSelected = getMoveSelectedSetting(dataMoveSelected, true);
    } else {
      this.settings.moveSelected = getMoveSelectedSetting(this.settings.moveSelected);
    }

    // Backwards compatibility with `settings.reloadSourceOnOpen`
    if (this.settings.reloadSourceOnOpen) {
      this.settings.reload = 'open';
      delete this.settings.reloadSourceOnOpen;
    }

    const dataCloseOnSelect = this.element.attr('data-close-on-select');
    if (dataCloseOnSelect && !this.settings.closeOnSelect) {
      this.settings.closeOnSelect = dataCloseOnSelect === 'true';
    }
    const dataNoSearch = this.element.attr('data-no-search');
    if (dataNoSearch && !this.settings.noSearch) {
      this.settings.noSearch = dataNoSearch === 'true';
    }

    // Persist sizing defintions
    const sizingStrings = ['-xs', '-sm', '-mm', '-md', '-lg'];
    const classString = this.element.attr('class');
    let s = null;

    for (let i = 0; i < sizingStrings.length; i++) {
      s = sizingStrings[i];
      if (classString.match(s)) {
        this.pseudoElem.addClass(`dropdown${s}`);
      }
    }

    // Cached dataset (from AJAX, if applicable)
    this.dataset = [];

    this.listfilter = new ListFilter({
      filterMode: this.settings.filterMode
    });

    this.setListIcon();
    this.setDisplayedValues();
    this.setInitial();
    this.setWidth();

    setTimeout(() => {
      this.toggleTooltip();
    }, 0);

    this.element.triggerHandler('rendered');

    return this.handleEvents();
  },

  /**
   * Updates/Renders the TagList
   * @private
   * @returns {void}
   */
  renderTagList() {
    const self = this;
    function dismissHandler(tag) {
      // Run a dismissHandler, if defined
      if (self.settings.dismissHandler) {
        self.settings.dismissHandler(tag);
      }

      const targets = self.selectedOptions.filter((el) => {
        const optionValue = xssUtils.stripHTML(el.value);
        return optionValue === tag.settings.value;
      });
      if (targets.length) {
        self.deselect(targets[0]);
      }
      self.tagListAPI.element.classList[self.selectedOptions.length ? 'remove' : 'add']('empty');
      if (self.isOpen()) {
        self.updateList();
      }
    }

    const tags = this.toTagData();
    tags.forEach((tag) => {
      tag.dismissHandler = dismissHandler;
      if (self.settings.clickHandler) {
        tag.clickHandler = self.settings.clickHandler;
      }
      if (self.isDisabled()) {
        tag.disabled = true;
      }
    });

    const span = this.pseudoElem.children('span')[0];
    if (!this.tagListAPI) {
      this.tagListAPI = new TagList(span, {
        tags
      });
      span.classList.add('tag-list');
    } else {
      this.tagListAPI.updated({
        tags
      });
    }

    this.tagListAPI.element.classList[this.selectedOptions.length ? 'remove' : 'add']('empty');
    if (!isNaN(this.settings.tagListMaxHeight)) {
      span.classList.add('scrollable');
      span.style.maxHeight = tags.length ? `${this.settings.tagListMaxHeight}px` : '';
    }

    // Detect scrollbar, if applicable, to push the dropdown icon away from the scrollbar.
    const hasScrollbar = span.scrollHeight > span.clientHeight;
    this.pseudoElem[0].classList[hasScrollbar ? 'add' : 'remove']('has-scrollbar');

    if (this.isOpen()) {
      this.position();
    }
  },

  /**
   * @private
   * @returns {void}
   */
  renderPseudoElemLabel() {
    // NOTE: this doesn't use the ID to get the label due to
    // potentially not being placed in the page yet (in jQuery cache).
    const label = this.element.prev();
    const errorMessage = this.element.parent().find('.error-message .message-text');
    const hasErrorMessage = this.pseudoElem?.hasClass('error');
    const errorMessageText = errorMessage.text();

    let labelText = '';
    this.selectedOptions.forEach((option) => {
      if (labelText.length) {
        labelText += ', ';
      }
      labelText += $(option).text().trim();
    });

    this.pseudoElem.attr({
      'aria-label': `${label.text()}, ${hasErrorMessage ? errorMessageText : labelText}`
    });
  },

  /**
   * Used for preventing menus from popping open/closed when they shouldn't.
   * Gets around the need for timeouts everywhere
   * @private
   * @returns {boolean} If the timeout should be cancelled.
    */
  inputTimer() {
    if (this.inputTimeout) {
      return false;
    }

    const self = this;

    this.inputTimeout = setTimeout(() => {
      clearTimeout(self.inputTimeout);
      self.inputTimeout = null;
    }, 200);

    return true;
  },

  /**
   * Set Width on the field
   * @private
   */
  setWidth() {
    const style = this.element[0].style;

    if (style.width) {
      this.pseudoElem[0].style.width = style.width;
    }
    if (style.position === 'absolute') {
      this.pseudoElem[0].style.position = 'absolute';
      this.pseudoElem[0].style.left = style.left;
      this.pseudoElem[0].style.top = style.top;
      this.pseudoElem[0].style.bottom = style.bottom;
      this.pseudoElem[0].style.right = style.right;
    }
  },

  /**
   * Set list item icon
   * @private
   * @param  {object} listIconItem The icon info to use on the list.
   */
  setItemIcon(listIconItem) {
    const self = this;
    let specColor = null;

    if (!listIconItem.icon) {
      listIconItem.isIcon = false;
      listIconItem.html = '';
      self.listIcon.items.push(listIconItem);
      return;
    }

    // Set icon properties
    if (typeof listIconItem.icon === 'object') {
      listIconItem.obj = listIconItem.icon;
      listIconItem.icon = listIconItem.icon.icon;

      // Color
      if (listIconItem.obj.color) {
        specColor = listIconItem.obj.color.indexOf('#') === 0;
        if (specColor) {
          listIconItem.specColor = listIconItem.obj.color;
        } else {
          listIconItem.classList = ` ${listIconItem.obj.color}`;
        }
      } else if (listIconItem.obj.class) {
        specColor = listIconItem.obj.class.indexOf('#') === 0;
        if (specColor) {
          listIconItem.specColor = listIconItem.obj.class;
        } else {
          listIconItem.classList = ` ${listIconItem.obj.class}`;
        }
      }

      // Color Over
      if (listIconItem.obj.colorOver) {
        specColor = listIconItem.obj.colorOver.indexOf('#') === 0;
        if (specColor) {
          listIconItem.specColorOver = listIconItem.obj.colorOver;
        } else {
          listIconItem.classListOver = ` ${listIconItem.obj.colorOver}`;
        }
      } else if (listIconItem.obj.classOver) {
        specColor = listIconItem.obj.classOver.indexOf('#') === 0;
        if (specColor) {
          listIconItem.specColorOver = listIconItem.obj.classOver;
        } else {
          listIconItem.classListOver = ` ${listIconItem.obj.classOver}`;
        }
      }
    }

    // Set flags
    listIconItem.isIcon = (listIconItem.icon && listIconItem.icon.length);

    if (listIconItem.classList && listIconItem.classList.length) {
      listIconItem.isClassList = true;
    }
    if (listIconItem.classListOver && listIconItem.classListOver.length) {
      listIconItem.isClassListOver = true;
    }

    // Build icon
    listIconItem.html = $.createIcon({
      icon: listIconItem.isIcon ? listIconItem.icon : '',
      class: `listoption-icon${listIconItem.isClassList ? ` ${listIconItem.classList}` : ''}`
    });

    if (listIconItem.icon === 'swatch') {
      listIconItem.isSwatch = true;
      listIconItem.html = `<span class="swatch ${listIconItem.isClassList ? listIconItem.classList : ''}"></span>`;
    }

    self.listIcon.items.push(listIconItem);
  },

  /**
   * Set all icons on the list.
   * @private
   */
  setListIcon() {
    const self = this;
    let hasIcons = self.settings.multiple ? false : self.element.find('[data-icon]').length > 0;
    const opts = hasIcons ? this.element.find('option') : [];

    self.listIcon = { hasIcons, items: [] };

    if (hasIcons) {
      let count = 0;

      opts.each(function (i) {
        const iconAttr = $(this).attr('data-icon');
        let icon = null;

        if (typeof iconAttr !== 'string' || !iconAttr.length) {
          return;
        }

        if (iconAttr.indexOf('{') !== 0) {
          icon = iconAttr;
        } else {
          icon = $.fn.parseOptions(this, 'data-icon');
        }
        self.setItemIcon({ html: '', icon });

        if (self.listIcon.items[i] && self.listIcon.items[i].isIcon) {
          count++;
        }
      });

      hasIcons = count > 0;
    }

    if (hasIcons) {
      self.pseudoElem.prepend($.createIcon({ icon: '', class: 'listoption-icon' }));
      self.listIcon.pseudoElemIcon = self.pseudoElem.find('> .listoption-icon');
      self.listIcon.idx = -1;
    }

    self.listIcon.hasIcons = hasIcons;
  },

  /**
   * Toggle toooltip (add if text over flowed)
   * @private
   * @returns {void}
   */
  toggleTooltip() {
    if (this.overflowed) {
      this.setTooltip();
    } else if (this.tooltipApi) {
      this.removeTooltip();
    }
  },

  /**
   * Triggers tooltip in multiselect
   * @returns {void}
   */
  setTooltip() {
    const opts = $(this.element[0].selectedOptions);
    const optText = this.getOptionText(opts);
    this.tooltipApi = this.pseudoElem.find('span')
      .tooltip({
        content: xssUtils.escapeHTML(optText),
        trigger: this.isMobile() ? 'immediate' : 'hover',
      })
      .on('blur.dropdowntooltip', () => {
        this.removeTooltip();
      })
      .data('tooltip');
  },

  /**
   * Removes a tooltip
   * @returns {void}
   */
  removeTooltip() {
    if (this.tooltipApi) {
      this.tooltipApi.element.off('blur.dropdowntooltip');
      this.tooltipApi.destroy();
      this.tooltipApi = null;
    }
  },

  /**
   * Set over color for list item icon,
   * if run without pram {target}, it will make on only
   * @private
   * @param  {object} target The dom target.
   */
  setItemIconOverColor(target) {
    const self = this;
    if (self.listIcon.hasIcons) {
      const targetIcon = target ? target.find('.listoption-icon') : null;
      self.list.find('li').each(function (i) {
        const li = $(this);
        const icon = li.find('.listoption-icon');
        const iconRef = self.listIcon.items[i];

        if (!iconRef) {
          return;
        }

        // make it on
        if (li.is('.is-focused')) {
          if (iconRef.isClassListOver) {
            icon.removeClass(iconRef.classListOver)
              .addClass(iconRef.classList);
          }
        }
        // make it over
        if (targetIcon && li.is(target)) {
          if (iconRef.isClassListOver) {
            targetIcon.removeClass(iconRef.classList);
            targetIcon.addClass(iconRef.classListOver);
          }
        }
      });
    }
  },

  /**
   * Update the icon.
   * @private
   * @param {object} opt The dom target.
   */
  updateItemIcon(opt) {
    const self = this;
    if (self.listIcon.hasIcons) {
      const target = self.listIcon.pseudoElemIcon;
      const i = opt.index();
      const idx = self.listIcon.idx;
      const iconRef = self.listIcon.items[i];
      const icon = iconRef && iconRef.isIcon ? iconRef.icon : '';

      // Return out if this item has no icon
      if (!iconRef) {
        return;
      }

      // Reset class and color
      if (idx > -1) {
        const iconAtIndex = self.listIcon.items[idx];
        if (iconAtIndex) {
          target.removeClass(`${iconAtIndex.classList} ${iconAtIndex.classListOver}`);
          target[0].style.fill = '';
        }
      }

      // Update new stuff
      self.listIcon.idx = i;
      target.changeIcon(icon);
      if (iconRef.isClassList) {
        target.addClass(iconRef.classList);
      }
    }
  },

  /**
   * Update the visible list object.
   * @param {string} [term = undefined] an optional search term that will cause highlighting of text
   * @private
   */
  updateList(term) {
    const self = this;
    const s = this.settings;
    const isMobile = self.isMobile();
    const listExists = self.list !== undefined && self.list !== null && self.list.length > 0;
    let listContents = '';
    let ulContents = '';
    let upTopOpts = 0;
    const hasOptGroups = this.element.find('optgroup').length;
    let reverseText = '';
    const isMultiselect = this.settings.multiple === true;
    let moveSelected = `${this.settings.moveSelected}`;
    const showSelectAll = this.settings.showSelectAll === true;
    const headerText = {
      all: Locale.translate('All'),
      selected: Locale.translate('Selection'),
      labelText: self.isInlineLabel ? self.inlineLabelText.text() : this.label.text()
    };
    headerText.all = (typeof s.allTextString === 'string' && s.allTextString !== '') ?
      self.settings.allTextString : `${headerText.all}`;
    headerText.selected = (typeof s.selectedTextString === 'string' && s.selectedTextString !== '') ?
      self.settings.selectedTextString : `${headerText.selected}`;
    const wrapperStart = this.settings.extraListWrapper ? '<div class="dropdown-list-wrapper">' : '';
    const wrapperEnd = this.settings.extraListWrapper ? '</div>' : '';

    // Find custom ID attributes
    const baseIdAttr = utils.getAttribute(this, 'id', this.settings.attributes);
    const listId = `${baseIdAttr ? `${baseIdAttr}-` : ''}dropdown-list`;
    const listUlId = `${baseIdAttr ? `${baseIdAttr}-` : ''}listbox`;
    const listAria = ' role="listbox"';

    if (this.element[0].classList.contains('text-align-reverse')) {
      reverseText = ' text-align-reverse';
    } else if (this.element[0].classList.contains('text-align-center')) {
      reverseText = ' text-align-center';
    }

    if (!listExists) {
      listContents = `<div class="dropdown-list${reverseText}${isMobile ? ' mobile' : ''}${this.settings.multiple ? ' multiple' : ''}" id="${listId}" ${this.settings.multiple ? 'aria-multiselectable="true"' : ''}>
        <label for="dropdown-search" class="audible">${this.settings.noSearch ? Locale.translate('PressDown') : Locale.translate('TypeToFilter')}</label>
        <input type="text" class="dropdown-search${reverseText}" ${this.settings.noSearch ? 'aria-readonly="true"' : ''} id="dropdown-search" autocomplete="off" />
        <span class="trigger">${isMobile ? $.createIcon({ icon: 'close', classes: ['close'] }) : $.createIcon(this.settings.dropdownIcon || 'dropdown')}</span>`;

      if (this.settings.virtualScroll) {
        listContents += `<div class="virtual-scroll-container">
            <div class="ids-virtual-scroll">
              <div class="ids-virtual-scroll-viewport">
                <ul id="${listUlId}"${listAria} class="contents" aria-label="${Locale.translate('Dropdown')}"></ul>
              </div>
            </div>
          </div>`;
      } else {
        listContents += `${wrapperStart}<ul id="${listUlId}"${listAria} aria-label="${Locale.translate('Dropdown')}">`;
      }
    } else {
      this.list.attr('id', listId);
      this.listUl.attr('id', `${listUlId}`);
    }

    // Get a current list of <option> elements
    // If none are available, simply return out
    let opts = this.element.find('option');
    let groups = this.element.find('optgroup');
    let selectedFilterMethod = function (i, opt) {
      return opt.selected;
    };
    const groupsSelectedOpts = [];

    // For typeahead reloading, the <option> tags are not used for determining what's already
    // selected.  Use the internal storage of selected values instead.
    if (this.settings.reload === 'typeahead') {
      selectedFilterMethod = function (i, opt) {
        if (!self.selectedValues) {
          return false;
        }
        return self.selectedValues.indexOf(opt.value) > -1;
      };
    }

    const selectedOpts = opts.filter(selectedFilterMethod);

    // Re-inforce typeahead-reloaded options' `selected` properties
    if (this.settings.reload === 'typeahead') {
      selectedOpts.prop('selected', true);
    }

    // In multiselect scenarios, shows an option at the top of the list that will
    // select all available options if checked.
    if (isMultiselect && showSelectAll && opts.length) {
      const allSelected = opts.not('[disabled], .hidden').length === selectedOpts.not('[disabled], .hidden').length;

      ulContents += `<li role="none" class="dropdown-select-all-list-item${allSelected ? ' is-selected' : ''}">` +
        `<a role="option" href="#" id="dropdown-select-all-anchor" class="dropdown-select-all-anchor">${
          Locale.translate('SelectAll')
        }</a>` +
      '</li>';
    }

    // Move selected options in each group to just underneath their corresponding group headers.
    if (moveSelected === 'group') {
      // If no optgroups exist, change to "all" and skip this part.
      if (!groups || !groups.length) {
        moveSelected = 'all';
      } else {
        // Break apart selectedOpts into groups.
        // These selected items are applied when the header is generated.
        groups.each((i, g) => {
          const els = selectedOpts.filter(function () {
            return $.contains(g, this);
          });
          groupsSelectedOpts.push(els);
        });
      }
    }

    // Move all selected options to the top of the list if the setting is true.
    // Also adds a group heading if other option groups are found in the <select> element.
    if (moveSelected === 'all') {
      opts = opts.not(selectedOpts);

      // Show a "selected" header if there are selected options
      if (selectedOpts.length > 0) {
        ulContents += self.buildLiHeader(headerText.selected);
      }

      selectedOpts.each(function (i) {
        ulContents += self.buildLiOption(this, i, term);
        upTopOpts++;
      });

      // Only show the "all" header beneath the selected options if there
      // are no other optgroups present
      if (!hasOptGroups && opts.length > 0) {
        ulContents += self.buildLiHeader(headerText.all);
      }
    }

    if (this.settings.virtualScroll) {
      ulContents = '';
    } else {
      opts.each(function (i) {
        const count = i + upTopOpts;
        const option = $(this);
        const parent = option.parent();
        let optgroupIsNotDrawn;
        let optgroupIndex;

        // Add Group Header if this is an <optgroup>
        // Remove the group header from the queue.
        if (parent.is('optgroup') && groups.length) {
          optgroupIndex = parent.index();
          optgroupIsNotDrawn = groups.index(parent) > -1;

          if (optgroupIsNotDrawn) {
            groups = groups.not(parent);
            ulContents += self.buildLiHeader(`${parent.attr('label')}`);

            // Add all selected items for this group
            if (moveSelected === 'group') {
              groupsSelectedOpts[optgroupIndex].each(function (j) {
                ulContents += self.buildLiOption(this, j, term);
                upTopOpts++;
              });
            }
          }
        }

        if (moveSelected !== 'none' && option.is(':selected')) {
          return;
        }

        ulContents += self.buildLiOption(this, count, term);
      });
    }

    // Render the new list contents to the page.
    // Build the entire thing and set references if this is the first opening.
    // Otherwise, simply replace the elements inside the <ul>.
    if (!listExists) {
      listContents += this.settings.virtualScroll ? `${ulContents}</div>` : `${ulContents}</ul>${wrapperEnd}</div>`;

      // Append markup to the DOM
      this.list = $(listContents);

      // Get references
      this.listUl = this.list.find('ul');
      this.searchInput = this.list.find('#dropdown-search');
    } else {
      this.listUl.html(ulContents);

      if (self.settings.attributes) {
        const options = this.listUl.find('.dropdown-option a');

        options.each(function (i) {
          const opt = $(this);
          utils.addAttributes(opt, self, self.settings.attributes, `option-${i}`, true);
        });
      }
    }

    if (env.os.name === 'ios' || env.os.name === 'android') {
      this.searchInput.attr('readonly', 'readonly');
    }

    this.virtualScrollElem = this.listUl.closest('.virtual-scroll-container');
    this.opts = opts;

    if (this.listIcon.hasIcons) {
      this.list.addClass('has-icons');
      this.listIcon.pseudoElemIcon.clone().appendTo(this.list);
    }

    if (hasOptGroups) {
      this.listUl.addClass('has-groups');
    }

    this.hasTooltips = this.listUl.find('[title]').length > 0 ||
      this.element.find('[title]').length > 0;

    if (this.isOpen()) {
      this.position();
      this.highlightOption(this.listUl.find('li:visible:not(.separator):not(.group-label):not(.is-disabled)').first());
    }
  },

  buildLiHeader(textContent) {
    return `<li role="none" class="group-label" focusable="false">
      ${textContent}
    </li>`;
  },

  buildLiOption(option, index, term) {
    const self = this;
    let liMarkup = '';
    let text = option.innerHTML;
    const attributes = DOM.getAttributes(option);
    const value = attributes.getNamedItem('value');
    const title = attributes.getNamedItem('title');
    const hasTitle = title ? ` title="${title.value}"` : '';
    const badge = attributes.getNamedItem('data-badge');
    const badgeColor = attributes.getNamedItem('data-badge-color');
    let badgeHtml = '';
    const isSelected = option.selected ? ' is-selected' : '';
    const isDisabled = option.disabled ? ' is-disabled' : '';
    let liCssClasses = option.className ? ` ${option.className.value}` : '';
    const aCssClasses = liCssClasses.indexOf('clear') > -1 ? ' class="clear-selection"' : '';
    const tabIndex = ` tabIndex="${index && index === 0 ? 0 : -1}"`;
    const toExclude = ['data-badge', 'data-badge-color', 'data-val', 'data-icon'];
    let copiedDataAttrs = ` ${self.getDataAttributes(attributes, toExclude).str}`;
    const trueValue = (value && 'value' in value ? value.value : text).replace(/"/g, '/quot/');
    let iconHtml = '';

    if (self.listIcon.hasIcons && self.listIcon.items[index]) {
      iconHtml = self.listIcon.items[index].html;
    }

    if (copiedDataAttrs === ' ') {
      copiedDataAttrs = '';
    }

    if (badge) {
      badgeHtml = `<span class="badge ${badgeColor ? badgeColor.value : 'azure07'}">${badge.value}</span>`;
    }

    if (liCssClasses.indexOf('clear') > -1 && text === '') {
      text = Locale.translate('ClearSelection');
    }

    // Highlight search term
    if (term && term.length > 0) {
      const exp = self.getSearchRegex(term);
      text = text.replace(exp, '<span class="dropdown-highlight">$1</span>').trim();
    }

    if (self.listIcon.hasIcons &&
      self.listIcon.items[index] &&
      self.listIcon.items[index].isSwatch) {
      liCssClasses += ' is-swatch';
    }

    liMarkup += `<li class="dropdown-option${isSelected}${isDisabled}${liCssClasses}" data-val="${trueValue}" ${copiedDataAttrs}${hasTitle} role="none">
      <a id="list-option-${index}" href="#" ${aCssClasses} role="option" ${isSelected ? 'aria-selected="true"' : 'aria-selected="false"'}${tabIndex}>${iconHtml}${text}${badgeHtml}</a></li>`;

    return liMarkup;
  },

  /**
   * Sets the displayed value of the Pseudo-Element based on currently-selected options.
   * @private
   */
  setDisplayedValues() {
    const opts = $(this.element[0].selectedOptions);
    let text = this.getOptionText(opts);

    // Clear Text
    if (opts.hasClass('clear')) {
      text = '';
    }

    // Displays the tags/text on the pseudo-element
    if (this.settings.showTags && this.tagListAPI) {
      // Render tags
      this.renderTagList();
    } else {
      // If empty, render an accessibility message
      if (this.settings.empty && opts.length === 0) {
        let span = this.pseudoElem.find('span').first();
        DOM.html(span, `<span class="audible">${this.label.text()} </span>`, '<div><p><span><ul><li><a><abbr><b><i><kbd><small><strong><sub><svg><use><br>');
        span = $(`#${this.element.attr('id')}`).next().find('span').first();
        DOM.html(span, `<span class="audible">${this.label.text()} </span>`, '<div><p><span><ul><li><a><abbr><b><i><kbd><small><strong><sub><svg><use><br>');
        this.setPlaceholder(text);
        this.scrollRelease(this.listUl);
        return;
      }

      // Render text
      const maxlength = this.element.attr('maxlength');
      if (maxlength) {
        text = text.substr(0, maxlength);
      }
      text = text.trim();
      const span = this.pseudoElem.find('span');
      if (span.length > 0) {
        span[0].innerHTML = `<span class="audible">${this.label.text()} </span>${xssUtils.escapeHTML(text)}`;
      }

      if (!this.settings.showSearchUnderSelected) {
        this.setPlaceholder(text);
      }
    }

    // Set the "previousActiveDescendant" to the first of the items
    this.previousActiveDescendant = opts.first().val();
    this.renderPseudoElemLabel();
    this.updateItemIcon(opts);
    this.setBadge(opts);
  },

  /**
   * Copy classes from the two objects
   * @private
   * @param  {object} from The from element
   * @param  {object} to  The to element
   * @param  {string} prop The property to set
   */
  copyClass(from, to, prop) {
    if (from.hasClass(prop)) {
      to.addClass(prop);
    }
  },

  /**
   * Copy initial stuff from the drop down to the pseudo element.
   * @private
   */
  setInitial() {
    if (this.element.is(':disabled')) {
      this.disable();
    }
    if (this.element.is('[readonly]')) {
      this.readonly();
    }
    if (this.isHidden) {
      this.pseudoElem.hide().prev('label').hide();
      this.pseudoElem.next('svg').hide();
    }
  },

  /**
   * Set placeholder text, if value empty
   * @private
   * @param  {string} text The selected text value.
   * @returns {void}
   */
  setPlaceholder(text) {
    this.placeholder = this.placeholder || { text: this.element.attr('placeholder') };
    if (this.placeholder.text) {
      const isEmpty = (typeof text !== 'string' || (typeof text === 'string' && text === ''));
      this.placeholder.elem = this.placeholder.elem || this.pseudoElem.find('span:not(.audible)');
      this.placeholder.elem.attr('data-placeholder-text', isEmpty ? this.placeholder.text : '');
    } else {
      delete this.placeholder;
    }
  },

  /**
   * Figure out which keys to ignore on typehead.
   * @private
   * @param  {element} input The input element.
   * @param  {object} e  The event.
   * @returns {boolean} False if the key should be ignored.
   */
  ignoreKeys(input, e) {
    const charCode = e.which;

    // Needed for browsers that use keypress events to manipulate the window.
    if (e.altKey && (charCode === 38) || charCode > 111 && charCode < 124 && !this.settings.onKeyDown) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }

    if (input.is(':disabled') || input.hasClass('is-readonly')) {
      return; // eslint-disable-line
    }

    if (e.ctrlKey) {
      if (this.settings.onKeyDown) {
        const ret = this.settings.onKeyDown(e);
        if (ret === false) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
      }
    }

    return true;
  },

  /**
   * Handle events while search is focus'd
   * @private
   * @returns {void}
   */
  handleSearchEvents() {
    // Used to determine how spacebar should function.
    // False means space will select/deselect.  True means
    // Space will add a space inside the search input.
    if (!this.filterTerm) {
      this.searchKeyMode = false;
    }

    const searchInputVal = this.searchInput[0].value;
    const isIE11 = env.browser.name === 'ie' && env.browser.version === '11';
    let rectStr;
    if (!isIE11) {
      rectStr = String.fromCodePoint(8);
    }
    if (searchInputVal === '.' || searchInputVal === rectStr) {
      this.searchInput[0].value = '';
    }

    this.searchInput
      .on(`keydown.${COMPONENT_NAME}`, (e) => {
        const searchInput = $(this);
        return this.handleKeyDown(searchInput, e);
      })
      .on(`input.${COMPONENT_NAME}`, (e) => {
        this.isFiltering = true;
        this.handleAutoComplete(e);
      });
  },

  /**
   * Filter the list elements by term.
   * @private
   * @param  {string} term The search term
   */
  filterList(term) {
    let typeahead = false;
    // 'typeahead' reloading skips client-side filtering in favor of server-side
    if (this.settings.source && this.settings.reload === 'typeahead') {
      typeahead = true;
      this.callSource();
    }

    const self = this;
    let selected = false;
    let list = $('.dropdown-option', this.listUl);
    const headers = $('.group-label', this.listUl);
    let results;

    if (!list.length || !this.list || this.list && !this.list.length) {
      return;
    }

    if (!term) {
      term = '';
    }

    const completeFilter = () => {
      if (!typeahead && term && term.length) {
        results = this.listfilter.filter(list, term);
      } else {
        results = list;
      }

      this.list.addClass('search-mode');
      this.list.find('.trigger').find('.icon').attr('class', 'icon search').changeIcon('search');
      this.searchInput.removeAttr('aria-activedescendant');

      this.unhighlightOptions();

      if (!results || !results.length && !term) {
        this.resetList();
        return;
      }

      results.removeClass('hidden');
      list.not(results).add(headers).addClass('hidden');

      this.filteredItems = list.filter(results);
      this.filteredItems.each(function (i) {
        const li = $(this);
        li.children('a').attr('tabindex', i === 0 ? '0' : '-1');

        if (!selected) {
          self.highlightOption(li);
          selected = true;
        }

        self.highlightSearchTerm(li, term);
      });

      headers.each(function () {
        const children = $(this).nextUntil('.group-label, .selector').not('.hidden');
        if (self.settings.showEmptyGroupHeaders || children.length) {
          $(this).removeClass('hidden');
        }
      });

      term = '';

      // Checking the position of the dropdown element
      // If near at the bottom of the page, will not be flowing up
      // and stay still to its position.
      const totalPageHeight = document.body.scrollHeight;
      const scrollPoint = window.scrollY + window.innerHeight;
      const isNearBottom = scrollPoint >= totalPageHeight;

      if (isNearBottom) {
        self.position();
      } else {
        self.shrinkTop(self);
      }
    };

    if (this.settings.virtualScroll) {
      $(this.virtualScroller.element).one('afterrendered', () => {
        list = $('.dropdown-option', this.listUl);
        completeFilter();
      });
      this.virtualScroller.data = this.listfilter.filter(this.opts, term);
      list = $('.dropdown-option', this.listUl);
      return;
    }

    completeFilter();
  },

  /**
   * Shrink if the element is flowing up
   * @private
   * @param {Object} self The api object
   */
  shrinkTop(self) {
    // Minimal shrink when on top on
    if (self.list && self.list[0].classList.contains('is-ontop')) {
      const listHeight = parseInt(self.list[0].offsetHeight, 10);
      const searchInputHeight = parseInt(self.searchInput[0].offsetHeight, 10);
      self.list[0].style.top = `${self.wrapper[0].offsetParent.offsetTop + (listHeight - searchInputHeight) + 4}px`;
    }
  },

  /**
   * Removes filtering from an open Dropdown list and turns off "search mode"
   * @private
   */
  resetList() {
    // 'typeahead' reloading skips client-side filtering in favor of server-side
    if (this.settings.source && this.settings.reload === 'typeahead') {
      this.filterTerm = '';
      this.searchKeyMode = false;
      this.callSource(null, true);
      return;
    }

    if (!this.list || this.list && !this.list.length) {
      return;
    }

    this.list.removeClass('search-mode');
    const lis = this.listUl.find('li');

    lis.removeAttr('style').each(function () {
      const a = $(this).children('a');
      const li = $(this);

      const text = xssUtils.escapeHTML(a.text());
      const icon = li.children('a').find('svg').length !== 0 ? new XMLSerializer().serializeToString(li.children('a').find('svg')[0]) : '';
      const swatch = li.children('a').find('.swatch');
      const swatchHtml = swatch.length !== 0 ? swatch[0].outerHTML : '';

      if (a[0]) {
        a[0].innerHTML = swatchHtml + icon + text;
      }
    });

    // Adjust height / top position
    if (this.list.hasClass('is-ontop')) {
      this.list[0].style.top = `${this.pseudoElem.offset().top - this.list.height() + this.pseudoElem.outerHeight() - 2}px`;
    } else {
      this.list[0].style.top = '';
    }
    delete this.filteredItems;

    if (this.settings.multiple) {
      this.updateList();
    }

    if (this.settings.virtualScroll) {
      this.virtualScroller.data = this.opts;
    }

    lis.removeClass('hidden');
    this.position();

    if (this.list.find('svg').length === 2) {
      this.list.find('svg').last().remove();
    }
  },

  /**
   * Select the blank item (if present)
   * @private
   */
  selectBlank() {
    const blank = this.element.find('option').filter(function () {
      return !this.value || $.trim(this.value).length === 0;
    });

    if (!blank.length) {
      return;
    }

    blank[0].selected = true;
    blank[0].setAttribute('selected', true);
    this.element.triggerHandler('updated');
    this.element.trigger('change').triggerHandler('selected');
  },

  /**
   * Handle the key down event actions.
   * @private
   * @param  {object} input The dom element.
   * @param  {object} e The event element.
   * @returns {boolean} Returns the event in some situations.
   */
  handleKeyDown(input, e) {
    let selectedIndex = this.element[0].selectedIndex || -1;
    let options = this.element[0].options;
    const key = e.which;
    const self = this;
    const excludes = 'li:visible:not(.separator):not(.group-label):not(.is-disabled)';
    let next;

    if (!this.ignoreKeys(input, e)) {
      return false;
    }

    if (this.isLoading()) {
      return true;
    }

    if (self.settings.onKeyDown) {
      const ret = self.settings.onKeyDown(e);
      if (ret === false) {
        e.stopPropagation();
        e.preventDefault();
        return false; //eslint-disable-line
      }
    }

    if (self.isOpen()) {
      options = self.settings.virtualScroll ? this.opts : this.listUl.find(excludes);
      selectedIndex = -1;
      $(options).each(function (index) {
        if ($(this).is('.is-focused') || (self.settings.virtualScroll && $(this).is(':selected'))) {
          selectedIndex = index;
        }
      });

      // Mac OSX: "backspace" delete key
      // Everything else: DEL key (numpad, control keys)
      const isOSX = env.os.name === 'mac';
      if (((!isOSX && e.key === 'Delete') || (isOSX && e.key === 'Backspace') || e.key === 'Backspace') && this.settings.noSearch) {
        const first = $(options[0]);
        this.highlightOption(first);

        // Stop the backspace key from navigating back a page
        if (e.key === 'Backspace') {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    }

    switch (key) {  //eslint-disable-line
      case 37: // backspace
      case 8: // del & backspace
      case 46: { // del
        if (!self.isOpen()) {
          self.selectBlank();
          // Prevent Backspace from returning to the previous page.
          e.stopPropagation();
          e.preventDefault();
          return false;  //eslint-disable-line
        }
        break;
      }
      case 9: { // tab - save the current selection
        // If "search mode" is currently off, Tab should turn this mode on and place focus back
        // into the SearchInput.
        // If search mode is on, Tab should 'select' the currently highlighted
        // option in the list, update the SearchInput and close the list.
        if (self.isOpen()) {
          if (self.filterTerm.length === 1) {
            self.selectStartsWith(self.filterTerm);
          } else if (!this.settings.multiple && options.length && selectedIndex > -1) {
            // store the current selection
            // selectValue
            self.selectOption(this.correctValue($(options[selectedIndex])));
          }

          self.closeList('tab');
          this.activate();
        } else if (self.filterTerm.length === 1) {
          self.selectStartsWith(self.filterTerm);
        }
        // allow tab to propagate otherwise
        return true;   //eslint-disable-line
      }
      case 27: { // Esc - Close the Combo and Do not change value
        if (self.isOpen()) {
          // Close the option list
          self.element.closest('.modal.is-visible').data('listclosed', true);
          const tdContainer = self.pseudoElem ? self.pseudoElem.parents('td') : null;
          self.closeList('cancel');
          self.activate();

          if (tdContainer) {
            tdContainer.focus();
          }

          e.stopPropagation();
          return false;  //eslint-disable-line
        }
        // Allow Esc to propagate if the menu was closed, since some other Controls
        // that rely on dropdown may need to trigger routines when the Esc key is pressed.
        break;
      }
      case 32: // Spacebar
      case 13: { // enter
        if (self.isOpen()) {
          if (key === 32 && self.searchKeyMode === true) {
            break;
          }

          e.preventDefault();

          if (options.length && selectedIndex > -1) {
            // store the current selection
            const li = $(options[selectedIndex]);
            self.selectListItem(li);
          }
        }
        e.stopPropagation();
        return false;  //eslint-disable-line
      }
      case 38: { // up
        if (e.shiftKey) {
          return true;
        }
        this.searchKeyMode = false;

        if (selectedIndex > 0) {
          next = $(options[selectedIndex - 1]);
          this.highlightOption(next);
          self.setItemIconOverColor(next);
          // NOTE: Do not also remove the ".is-selected" class here!
          // It's not the same as ".is-focused"!
          // Talk to ed coyle if you need to know why.
          next.parent().find('.is-focused').removeClass('is-focused');
          next.addClass('is-focused');
        }

        if (this.settings.virtualScroll) {
          $(this.virtualScroller.element).one('afterrendered', () => {
            this.highlightOption(next);
          });
        }

        e.stopPropagation();
        e.preventDefault();
        return false;  //eslint-disable-line
      }
      case 40: { // down
        if (e.shiftKey) {
          return true;
        }
        this.searchKeyMode = false;
        this.keydownFlag = true;

        if (selectedIndex < options.length - 1) {
          next = $(options[selectedIndex + 1]);

          this.highlightOption(next);
          self.setItemIconOverColor(next);
          // NOTE: Do not also remove the ".is-selected" class here!
          //  It's not the same as ".is-focused"!
          // Talk to ed coyle if you need to know why.
          next.parent().find('.is-focused').removeClass('is-focused');
          next.addClass('is-focused');
        }

        if (this.settings.virtualScroll) {
          $(this.virtualScroller.element).one('afterrendered', () => {
            this.highlightOption(next);
          });
        }
        e.stopPropagation();
        e.preventDefault();
        return false;  //eslint-disable-line
      }
      case 35: { // end
        this.searchKeyMode = false;

        const last = $(options[options.length - 1]);
        this.highlightOption(last);

        e.stopPropagation();
        return false;  //eslint-disable-line
      }
      case 36: { // home
        this.searchKeyMode = false;

        const first = $(options[0]);
        this.highlightOption(first);

        e.stopPropagation();
        return false;  //eslint-disable-line
      }
    }

    if (!self.isOpen()) {
      if (!self.isControl(key) && !this.settings.source && !this.settings.noSearch) {
        // Make this into Auto Complete
        self.isFiltering = true;
        self.filterTerm = $.actualChar(e);

        if (self.searchInput && self.searchInput.length) {
          self.searchInput.val($.actualChar(e));
        }
        self.toggle();
      }
    } else if (this.settings.noSearch === true && !self.isControl(key)) {
      // In `noSearch` mode, this enables typeahead while the list is opened
      this.handleAutoComplete(e);
    }

    this.searchKeyMode = true;
    if (self.searchInput) {
      self.searchInput.attr('aria-activedescendant', '');
    }
    return true;  // eslint-disable-line
  },

  /**
   * @private
   * @param {jQuery.Event} e incoming keydown event
   * @returns {boolean} whether or not the keydown event is allowed to continue
   */
  handlePseudoElemKeydown(e) {
    const target = $(e.target);
    const key = e.key;

    // No need to execute if readonly
    if (target.is('.is-readonly')) {
      return true;
    }

    // "Esc" is used by IE11
    const isEscapeKey = key === 'Esc' || key === 'Escape';

    // Control Keydowns are ignored
    const controlKeys = ['Alt', 'Shift', 'Control', 'Meta'];
    if (controlKeys.indexOf(key) > -1) {
      return false;
    }

    if (!this.ignoreKeys(target, e)) {
      return false;
    }

    if (this.settings.onKeyDown) {
      const ret = this.settings.onKeyDown(e);
      if (ret === false) {
        e.stopPropagation();
        e.preventDefault();
        return false; //eslint-disable-line
      }
    }

    // Down arrow opens the list.
    // Down/Up are for IE/Edge.
    // ArrowDown/ArrowUp are for all others.
    const openKeys = ['ArrowDown', 'ArrowUp', 'Down', 'Up', 'Enter', 'Spacebar', ' '];
    if (openKeys.indexOf(key) > -1) {
      if (!this.isOpen()) {
        this.open();
      }

      // Maybe refactor this out so that `handleKeyDown` is no longer necessary.
      // This is necessary here because in `noSearch` mode, there is no actionable searchInput.
      if (this.settings.noSearch && !e.ctrlKey) {
        this.handleKeyDown(target, e);
      }

      return false;
    }

    // Mac OSX: "backspace" delete key
    // Everything else: DEL key (numpad, control keys)
    const isOSX = env.os.name === 'mac';
    if ((!isOSX && key === 'Delete') || (isOSX && key === 'Backspace') || key === 'Backspace' && this.settings.noSearch) {
      this.selectBlank();

      // Stop the backspace key from navigating back a page
      if (key === 'Backspace') {
        e.stopPropagation();
        e.preventDefault();
      }
      return true;
    }

    if (isEscapeKey || key === 'Tab') {
      // In nosearch mode, bypass the typeahead autocomplete and pass keydown events
      // along to the list elements
      if (this.filterTerm.length === 1 || (this.settings.noSearch && this.isOpen())) {
        return this.handleKeyDown(target, e);
      }

      // Allow some keys to pass through with no changes in functionality
      return true;
    }

    this.handleAutoComplete(e);
    return true;
  },

  /**
   * Handle the typeahead.
   * @private
   * @param {object} e The event object
   */
  handleAutoComplete(e) {
    if (this.isLoading()) {
      return;
    }

    const self = this;
    if (this.timer) {
      clearTimeout(this.timer);
    }

    if (e.type === 'input') {
      this.filterTerm = self.settings.noSearch ? this.searchInput.val().toLowerCase() : this.searchInput.val();
    } else {
      this.filterTerm += $.actualChar(e).toLowerCase();

      if (this.filterTerm === '') {
        return;
      }

      if (e.key !== this.filterTerm && e.key.toLowerCase() === this.filterTerm &&
          !self.settings.noSearch) {
        this.filterTerm = e.key;
      }
    }

    // if called by `open()`, runs in the context of this Dropdown's API
    function filter() {
      if (self.filterTerm === '') {
        self.resetList();
      } else {
        self.filterList(self.filterTerm.toLowerCase());
      }
    }

    this.timer = setTimeout(() => {
      if (self.settings.noSearch && self.filterTerm !== '') {
        if (self.isOpen()) {
          self.highlightStartsWith(self.filterTerm);
        } else {
          self.selectStartsWith(self.filterTerm);
        }
        self.filterTerm = '';
        return;
      }

      self.searchKeyMode = true;
      if (!self.isOpen() && self.filterTerm !== '') {
        self.open(filter);
        return;
      }

      if (this.list?.find('ul li.hidden').length === 0) {
        this.list?.find(' > svg.listoption-icon:not(.swatch)').changeIcon('icon-empty-circle');
      }

      filter();
    }, self.settings.delay);
  },

  /**
   * Determine if the key is a control key
   * @private
   * @param  {number} keycode The keycode to check.
   * @returns {boolean} true if the key is a control key.
   */
  isControl(keycode) {
    const valid =
      (keycode > 7 && keycode < 48) || // control chars
      (keycode > 90 && keycode < 94) || // windows keys
      (keycode > 111 && keycode < 146); // function keys

    return valid;
  },

  /**
   * Focus the input element. Since the select is hidden this is needed over normal focus()
   * @private
   * @param  {boolean} [useSearchInput] If true the search is used.
   * @returns {void}
   */
  activate(useSearchInput) {
    const self = this;
    let input = this.pseudoElem;

    if (useSearchInput || self.isMobile()) {
      input = this.searchInput;
    }

    if (this.currentlyScrolledPos) {
      this.listUl.scrollTop(this.currentlyScrolledPos);
      delete this.currentlyScrolledPos;
    }

    if (useSearchInput && (input && (input.hasClass('is-readonly') || input.prop('readonly') === true))) {
      return;
    }

    function selectText() {
      if (self.isMobile() || self.filterTerm || !input) {
        return;
      }

      if (input[0].setSelectionRange) {
        input[0].setSelectionRange(0, input[0].value.length); // scroll to left
      } else if (input[0].tagName === 'INPUT') { // using Search Input instead of Pseudo Div
        input[0].select();
      }
    }

    selectText();

    // Set focus back to the element
    if (input && document.activeElement.tagName !== 'INPUT') {
      input[0].focus();
    }
  },

  /**
   * @private
   * @param {string} term incoming search term
   * @returns {RegExp} a valid regex object used to filter search results
   */
  getSearchRegex(term) {
    let regex;

    try {
      regex = new RegExp(`(${stringUtils.escapeRegExp(term)})`, 'i');
    } catch (e) {
      // create a "matches all" regex if we can't create a regex from the search term
      regex = /[\s\S]*/i;
    }

    return regex;
  },

  /**
   * Retrieves a string containing all text for currently selected options.
   * @private
   * @param  {array} opts The current option elements.
   * @returns {string} The selection options in a string  delimited by commas.
   */
  getOptionText(opts) {
    let text = '';

    if (!opts) {
      opts = this.element.find('option:selected');
    }

    opts.each(function () {
      if (text.length > 0) {
        text += `${Locale.currentLocale.data.punctuation.comma} `;
      }
      text += $(this).text().trim();
    });

    return text;
  },

  /**
   * Open the dropdown list of options
   * @param {function} callback additional items that can be run after the opening process completes
   * @returns {void}
   */
  open(callback) {
    const self = this;

    if (!this.inputTimer()) {
      return;
    }

    if (this.element.is(':disabled') || this.pseudoElem.hasClass('is-disabled') || this.pseudoElem.hasClass('is-readonly')) {
      return;
    }

    function completeOpen() {
      if (self.isMobile()) {
        $('.tooltip:not(.is-hidden)').hide();
      }

      self.updateList();
      self.openList();

      if (callback && typeof callback === 'function') {
        callback.call(this);
      }
    }

    if (!self.callSource(completeOpen)) {
      completeOpen();
    }
  },

  /**
   * Popup the list of options for selection.
   * @private
   */
  openList() {
    let current = this.previousActiveDescendant ?
      this.list.find(`.dropdown-option[data-val="${this.previousActiveDescendant.replace(/"/g, '/quot/')}"]`) :
      this.list.find('.is-selected');
    const self = this;
    const threshold = 10;
    let pos;

    this.touchPrevented = false;
    this.scrollLock(this.listUl);

    // Close any other drop downs.
    $('select').each(function () {
      const data = $(this).data();
      if (data.dropdown) {
        data.dropdown.closeList('cancel');
      }
    });

    // Close any open popup menus
    const otherMenus = $('.popupmenu.is-open').filter(function () {
      return $(this).parents('.popupmenu').length === 0;
    }); // close others.

    otherMenus.each(function () {
      const trigger = $(this).data('trigger');
      if (!trigger || !trigger.length) {
        return;
      }

      const api = $(this).data('trigger').data('popupmenu');
      if (api && typeof api.close === 'function') {
        api.close();
      }
    });

    if (!this.isOpen()) {
      this.list.appendTo('body');
    }
    this.list.show();
    this.list.attr('data-element-id', this.element.attr('id'));

    // Persist the "short" input field
    if (this.isShortField) {
      this.list[0].classList.add('dropdown-short');
    }

    if (self.settings.attributes) {
      // Add test automation ids
      utils.addAttributes(this.list.find('input'), this, this.settings.attributes, 'search', true);
      this.list.find('label').attr('for', this.list.find('input').attr('id'));
      utils.addAttributes(this.list.find('label'), this, this.settings.attributes, 'search-label');

      utils.addAttributes(this.list.find('.trigger svg'), this, this.settings.attributes, 'trigger', true);
      utils.addAttributes(this.listUl, this, this.settings.attributes, 'listbox', true);
      utils.addAttributes(this.list, this, this.settings.attributes, 'list');

      const options = this.list.find('.dropdown-option a');

      options.each(function (i) {
        const opt = $(this);
        utils.addAttributes(opt, self, self.settings.attributes, `option-${i}`, true);
      });

      const customId = utils.getAttribute(this, 'id', this.settings.attributes);
      this.pseudoElem.attr('aria-controls', customId ? `${customId}-listbox` : 'dropdown-list');
      this.pseudoElem.attr('aria-expanded');
    }

    this.pseudoElem
      .attr('aria-expanded', 'true')
      .addClass('is-open');

    this.searchInput.attr('aria-activedescendant', current.children('a').attr('id'));
    this.searchInput.prop('readonly', this.settings.noSearch);
    if (this.settings.showSearchUnderSelected) {
      this.list.find('.trigger').find('.icon').attr('class', 'icon search').changeIcon('search');
    }

    // In a grid cell
    this.isInGrid = this.pseudoElem.closest('.datagrid-row').length === 1;
    if (this.pseudoElem.parent().hasClass('is-inline')) {
      this.isInGrid = false;
    }

    if (this.isInGrid) {
      const rowHeight = this.pseudoElem.closest('.datagrid').attr('class').replace('datagrid', '');
      this.list.addClass(`datagrid-dropdown-list ${rowHeight}`);
    }

    if (this.pseudoElem.closest('.datagrid-filter-wrapper').length === 1) {
      this.list.addClass('datagrid-filter-dropdown');
    }

    const cssClass = this.settings.cssClass;
    if (cssClass && typeof cssClass === 'string') {
      this.list.addClass(cssClass);
    }

    this.position();

    // It adjust the position of datagrid filter dropdown
    // if the element goes out of the datagrid's container
    if (this.list.hasClass('datagrid-filter-dropdown') && document.querySelector('.datagrid-container') !== null) {
      const gridContainerPos = this.dropdownParent.closest('.datagrid-container').getBoundingClientRect();
      const gridFilterDropdownPos = document.querySelector('.datagrid-filter-dropdown').getBoundingClientRect();
      const pageContainerPos = document.querySelector(this.settings.appendTo).getBoundingClientRect().right;
      const adjustedPosition = pageContainerPos - gridContainerPos.right;
      const elementDropdown = document.querySelector('.datagrid-filter-dropdown').getBoundingClientRect();
      let shouldAdjust = false;

      // Check Left in RTL
      if (Locale.isRTL() && elementDropdown.left + 20 < 0) {
        shouldAdjust = true;
      }

      // Check Right
      if (elementDropdown.right + 20 > (window.innerWidth || document.documentElement.clientWidth)) {
        shouldAdjust = true;
      }

      if (gridContainerPos.right < gridFilterDropdownPos.right && shouldAdjust) {
        this.list[0].style.right = `${adjustedPosition}px`;
        this.list[0].style.left = '';
      }

      if (Locale.isRTL() && gridFilterDropdownPos.left < 0) {
        this.list[0].style.left = `${gridContainerPos.left}px`;
      }
    }

    if (this.settings.virtualScroll) {
      let selectedIndex = -1;
      let selectedElem = null;
      this.opts.toArray().filter((opt, i) => {
        if (opt.selected) {
          selectedIndex = i;
          selectedElem = opt;
          return opt;
        }
        return null;
      });

      this.virtualScroller = new VirtualScroll(this.virtualScrollElem, {
        height: 304,
        itemHeight: 32,
        itemTemplate: function(item, elem) { //eslint-disable-line
          let li = self.buildLiOption(elem, item);
          if (elem.selected) {
            selectedElem = elem;
            current = $(selectedElem);
          }
          li = self.highlightSearchTerm($(li), self.filterTerm);
          return li;
        },
        data: this.opts
      });

      setTimeout(() => {
        $(this.virtualScroller.element).on('afterrendered', () => {
          this.highlightOption($(selectedElem));
        });
        this.virtualScroller.scrollTo(selectedIndex);
      });
    }

    this.setListWidth();

    // Set the contents of the search input.
    // If we've got a stored typeahead
    if (typeof this.filterTerm === 'string' && this.filterTerm.length > 0) {
      this.searchInput.val(this.filterTerm);
    } else if (!this.settings.showSearchUnderSelected) {
      const selectedOpts = $(this.selectedOptions);
      const text = this.getOptionText(selectedOpts);
      this.searchInput.val(text);
    }

    const noScroll = this.settings.multiple;
    this.highlightOption(current, noScroll);

    if (this.settings.multiple && this.listUl.find('.is-selected').length > 0) {
      this.highlightOption(this.listUl.find('.dropdown-option').eq(0));
      setTimeout(() => {
        self.listUl.scrollTop(0);
      }, 0);
    }

    this.handleSearchEvents();
    this.activate(true); // Focus the Search Input

    /**
    *  Fires as the dropdown list is opened.
    *
    * @event listopened
    * @memberof Dropdown
    * @property {object} event - The jquery event object
    * @property {object} ui - The dialog object
    */
    this.element.trigger('listopened');

    if (this.isMobile()) {
      // iOS-specific keypress event that listens for when you click the "done" button
      self.searchInput.on('keypress.dropdown', (e) => {
        if (e.which === 13) {
          self.closeList('select');
        }
      });
    }

    self.list
      .removeClass('dropdown-tall')
      .on('touchend.list click.list', 'li', function (e) {
        if (self.touchPrevented) {
          return;
        }

        const itemSelected = self.selectListItem($(this));
        e.preventDefault();
        if (!itemSelected) {
          return;
        }
        e.stopPropagation();
      })
      .on('mouseenter.list', 'li', function () {
        // Prevents from triggering with keydown simulatenously which causes jump issues
        if (self.keydownFlag) {
          self.keydownFlag = false;
          return;
        }
        self.highlightOption($(this), true);
      });

      

    if (this.hasTooltips) {
      function clearTimer() { //eslint-disable-line
        if (self.timer && self.timer.destroy) {
          self.timer.destroy(true);
        }
      }

      function showTooltip(target, title) {  //eslint-disable-line
        $(target).tooltip({
          trigger: 'immediate',
          content: title
        });
        $(target).focus();
      }

      function hideTooltip(target) { //eslint-disable-line
        $('#tooltip').hide();
        $('#tooltip').data('tooltip')?.destroy();
      }

      function showOnTimer(target) {  //eslint-disable-line
        clearTimer();
        self.timer = new RenderLoopItem({
          duration: (500 / 10),
          timeoutCallback() {
            let title = target.getAttribute('title');
            if (!title) {
              title = target.getAttribute('data-title');
              showTooltip(target, title);
              return;
            }
            target.setAttribute('data-title', title);
            target.removeAttribute('title');
            showTooltip(target, title);
          }
        });
        renderLoop.register(self.timer);
      }

      function hideImmediately(target) {  //eslint-disable-line
        clearTimer();
        hideTooltip(target);
      }

      self.list.on('mouseover.tooltip', 'li[title], li[data-title]', (e) => {
        showOnTimer(e.currentTarget);
      })
        .on('mouseleave.tooltip, mousewheel.tooltip, click.tooltip', 'li[title], li[data-title]', (e) => {
          hideImmediately(e.currentTarget);
        });
    }
    this.scrollRelease(this.listUl);

    // Some list-closing events are on a timer to prevent immediate list close
    // There would be several things to check with a setTimeout, so this is done with a CSS
    // class to keep things a bit cleaner
    setTimeout(() => {
      self.list.addClass('is-closable');
    }, 100);

    // Triggered when the user clicks anywhere in the document
    // Will not close the list if the clicked target is anywhere inside the dropdown list.

    function clickDocument(e) {
      const target = $(e.target);
      if (self.touchPrevented || (self.isDropdownElement(target) && !target.is('.icon'))) {
        e.preventDefault();

        self.touchPrevented = false;
        return;
      }

      self.closeList('cancel');
    }

    function touchStartCallback(e) {
      self.touchPrevented = false;

      pos = {
        x: e.originalEvent.touches[0].pageX,
        y: e.originalEvent.touches[0].pageY
      };

      $(document).on('touchmove.dropdown', (evt) => {
        const newPos = {
          x: evt.originalEvent.touches[0].pageX,
          y: evt.originalEvent.touches[0].pageY
        };

        if ((newPos.x >= pos.x + threshold) || (newPos.x <= pos.x - threshold) ||
            (newPos.y >= pos.y + threshold) || (newPos.y <= pos.y - threshold)) {
          self.touchPrevented = true;
        }
      });
    }

    function touchEndCallback(e) {  //eslint-disable-line
      $(document).off('touchmove.dropdown');
      e.preventDefault();

      if (self.touchPrevented) {
        e.stopPropagation();
        return false;
      }

      clickDocument(e);
    }

    // Need to detect whether or not scrolling is happening on a touch-capable device
    // The dropdown list should not close on mobile if scrolling is occuring, but should close
    // if the user is simply tapping outside the list.
    $(document)
      .on('touchstart.dropdown', touchStartCallback)
      .on('touchend.dropdown touchcancel.dropdown', touchEndCallback)
      .on('click.dropdown', clickDocument);

    // When the Dropdown is located within a scrollable section,
    // the dropdown must close if that section is scrolled.
    let parentScrollableArea = $('.modal.is-visible .modal-body-wrapper');
    const subScrollableSection = self.element.parents('.scrollable, .scrollable-x, .scrollable-y, .card-content');
    if (subScrollableSection.length) {
      parentScrollableArea = subScrollableSection;
    }
    if (parentScrollableArea.length) {
      this.parentScrollableArea = parentScrollableArea;
      this.parentScrollableArea.on('scroll.dropdown', (e) => {
        this.scrollDocument(e);
      });
    }

    $('body').on('resize.dropdown', () => {
      self.position();

      // in desktop environments, close the list on viewport resize
      if (window.orientation === undefined) {
        self.closeList('cancel');
      }
    }).on('keydown.dropdown', (e) => {
      const target = $(e.target);
      if (this.isOpen() && !(target.hasClass('dropdown-search') || target.hasClass('dropdown'))) {
        this.handleKeyDown(target, e);
      }
    });

    // In mobile environments, close the list on an orientation change.
    // Don't do this on mobile against a resize because of the software keyboard's potential
    // to cause a "resize" event to fire.
    if (window.orientation !== undefined) {
      $(window).on('orientationchange.dropdown', () => {
        self.closeList('cancel');
      });
    }
  },

  /**
   * Is the jQuery Element a component of the current Dropdown list?
   * @param {HTMLElement} target The element to check
   * @private
   * @returns {HTMLElement} whether or not the item was successfully selected.
   */
  isDropdownElement(target) {
    return target.closest('.dropdown, .multiselect').length > 0 ||
        target.closest('.dropdown-list').length > 0 ||
        self.touchmove === true;
  },

  /**
   * Ignores Scrolling on Mobile, and will not close the list if accessing an item within the list
   * @param {Event} e Triggered when the user scrolls the page.
   * @private
   */
  scrollDocument(e) {
    const self = this;
    const focus = $('*:focus'); // dont close on timepicker arrow down and up

    if (self.touchPrevented || self.isDropdownElement($(e.target)) || focus.is('.timepicker')) {
      self.touchPrevented = false;
      return;
    }
    self.closeList('cancel');
  },

  /**
   * Set size and positioning of the list
   * @private
   */
  position() {
    const self = this;
    const positionOpts = {
      parentXAlignment: 'left',
      placement: 'bottom',
      strategies: ['flip', 'shrink-y']
    };

    function dropdownAfterPlaceCallback(e, placementObj) {
      // Turn upside-down if flipped to the top of the pseudoElem
      self.list[placementObj.wasFlipped === true ? 'addClass' : 'removeClass']('is-ontop');
      if (!self.settings.virtualScroll) {
        self.listUl[placementObj.wasFlipped === true ? 'prependTo' : 'appendTo'](self.settings.extraListWrapper ? self.list.find('.dropdown-list-wrapper') : self.list);
      }
      const listStyle = window.getComputedStyle(self.list[0]);
      const listStyleTop = listStyle.top ? parseInt(listStyle.top, 10) : 0;
      const isChrome = $('html').hasClass('is-chrome');

      // Firefox has different alignments without an adjustment:
      let browserOffset = 0;
      if (env.browser.name === 'firefox') {
        browserOffset = 4;
      }

      // Set the <UL> height to 100% of the `.dropdown-list` minus the size of the search input
      const ulHeight = parseInt(self.listUl[0].offsetHeight, 10);
      const listHeight = parseInt(self.list[0].offsetHeight, 10) + 5;
      const searchInputHeight = parseInt(self.searchInput[0].offsetHeight, 10);
      const isToBottom = parseInt(self.list[0].offsetTop, 10) +
        parseInt(self.list[0].offsetHeight, 10) >= window.innerHeight;
      const isSmaller = (searchInputHeight < listHeight - (searchInputHeight * 2)) &&
        (ulHeight + searchInputHeight >= listHeight);

      let adjustedUlHeight;
      if (isSmaller) {
        adjustedUlHeight = `${listHeight - searchInputHeight - 5}px`;
        if (isToBottom) {
          self.list[0].style.maxHeight = `${parseInt(listHeight, 10) - 5}px`;
        }
      }

      if (placementObj.wasFlipped) {
        adjustedUlHeight = `${listHeight - searchInputHeight - browserOffset - 5}px`;

        if (!self.isShortField) {
          self.list[0].style.top = `${listStyleTop}px`;
        }
      }

      if (adjustedUlHeight && !self.settings.virtualScroll) {
        self.listUl[0].style.maxHeight = adjustedUlHeight;
      }

      if (adjustedUlHeight === undefined && self.list[0].classList.contains('is-ontop')) {
        adjustedUlHeight = `${listHeight - searchInputHeight - browserOffset - 7}`;
        self.list[0].style.top = `${listStyleTop - adjustedUlHeight}px`;
      }

      if (!isChrome && placementObj.placement === 'bottom') {
        self.list[0].style.top = `${listStyleTop - 1}px`;
      }

      return placementObj;
    }

    // Reset styles that may have been appended to the list
    this.list[0].removeAttribute('style');
    this.listUl[0].removeAttribute('style');

    let parentElement = this.pseudoElem;
    if (this.isInGrid) {
      parentElement = this.element.closest('.datagrid-cell-wrapper');
    }
    if (this.widthTargetEnabled) {
      parentElement = $(this.settings.widthTarget);
    }

    // If the list would end up being wider parent,
    // use the list's width instead of the parent's width
    const parentElementStyle = window.getComputedStyle(parentElement[0]);
    const parentElementBorderWidth = parseInt(parentElementStyle.borderLeftWidth, 10) * 2;
    const parentElementWidth = Math.round(parseInt(parentElement[0].clientWidth, 10) +
      parentElementBorderWidth);

    // Temporarily shrink the value of the search input, and compare the size of the list to
    // the parent element.
    this.searchInput[0].style.cssText = `width: ${parentElementWidth}px !important`;
    const listDefaultWidth = Math.round(this.list.width());
    const useParentWidth = this.widthTargetEnabled || listDefaultWidth <= parentElementWidth;
    this.searchInput[0].style.width = '';

    // Add parent info to positionOpts
    positionOpts.parent = parentElement;
    positionOpts.useParentWidth = useParentWidth;

    // Use negative height of the pseudoElem to get the Dropdown list to overlap the input.
    // This is used when rendering a tag list, or if the Dropdown is explicitly configured for placing the Search outside the pseudo-element.
    // Otherwise, always position below/above the field.
    if (!this.settings.showSearchUnderSelected) {
      const isRetina = window.devicePixelRatio > 1;
      const isChrome = env.browser.name === 'chrome';
      positionOpts.y = -(parseInt(parentElement[0].clientHeight, 10) +
        parseInt(parentElementStyle.borderTopWidth, 10) +
        parseInt(parentElementStyle.borderBottomWidth, 10) - (!isChrome && isRetina ? 1 : 0));
      positionOpts.x = 0;
    }

    if (self.settings.placementOpts && self.settings.placementOpts.x) {
      positionOpts.x = self.settings.placementOpts.x;
    }

    this.setListWidth();

    this.list.one('afterplace.dropdown', dropdownAfterPlaceCallback).place(positionOpts);

    this.list.data('place').place(positionOpts);
  },

  /**
   * @param {jQuery[]} target a jQuery-wrapped <option> or <li> tag representing an option.
   * @returns {boolean} whether or not the item was successfully selected.
   */
  selectListItem(target) {
    const ddOption = target.closest('li');

    if (ddOption.length) {
      target = ddOption;
    }

    if (target.is('.separator, .group-label')) {
      return false;
    }

    if (target.is('.dropdown-select-all-anchor')) {
      target = target.parent();
    }

    const a = target[0].querySelector('a');

    // If this is the Select All option, select/deselect all.
    if (this.settings.multiple && target[0].classList.contains('dropdown-select-all-list-item')) {
      const doSelectAll = !(target[0].classList.contains('is-selected'));
      target[0].classList[doSelectAll ? 'add' : 'remove']('is-selected');
      if (doSelectAll) {
        a.setAttribute('aria-selected', 'true');
      } else {
        a.setAttribute('aria-selected', 'false');
      }
      this.selectAll(doSelectAll);
      return true;  //eslint-disable-line
    }

    const cur = this.correctValue(target);

    if (cur.is(':disabled')) {
      return false; //eslint-disable-line
    }

    this.selectOption(cur);

    if (this.settings.closeOnSelect) {
      this.closeList('select');
    }

    if (this.isMobile()) {
      return true;  //eslint-disable-line
    }

    this.activate(!this.settings.closeOnSelect);

    // Check/uncheck select all depending on no. of selected items
    if (this.settings.showSelectAll && this.list) {
      const opts = this.element.find('option');
      const selectedOpts = opts.filter(':selected');

      if (opts.length > selectedOpts.length) {
        this.list.find('.dropdown-select-all-list-item').removeClass('is-selected').attr('aria-selected', 'false');
      } else {
        this.list.find('.dropdown-select-all-list-item').addClass('is-selected').attr('aria-selected', 'true');
      }
    }

    return true;  //eslint-disable-line
  },

  /**
   * Try matching the option's text if 'cur' comes back empty or overpopulated.
   * Supports options that don't have a 'value' attribute, And also some special &quote handling.
   * @private
   * @param  {object} option The object to correct.
   * @returns {object} The corrected object
   */
  correctValue(option) {
    let val = option.attr('data-val') || option.attr('value');
    if (!val) { // Blank option
      return option;
    }
    val = val.replace(/"/g, '/quot/');

    let cur = this.element.find(`option[value="${val}"]`);
    if (cur.length === 0 || cur.length > 1) {
      cur = this.element.find('option').filter(function () {
        const elem = $(this);
        const attr = elem.attr('value');
        return elem.text() === val || (attr && attr.replace(/"/g, '/quot/') === val);
      });
    }
    return cur;
  },

  /**
  * Close the list of options if open.
  * @returns {void}
  */
  close() {
    return this.closeList('cancel'); // See "js/lifecycle.js"
  },

  /**
   * Close the list of options if open.
   * @private
   * @param  {string} [action] The action that trigger the closing (cancel fx) this
   * is passed to the events.
   * @returns {void}
   */
  closeList(action) {
    //  Also see "js/lifecycle.js" alias that works with the global "closeChildren" method.
    if (!this.list || !this.list.is(':visible') || !this.isListClosable()) {
      return;
    }

    if (!this.inputTimer()) {
      return;
    }

    if (this.touchmove) {
      this.touchmove = false;
    }

    // Rendering-related resets
    this.filterTerm = '';
    this.searchKeyMode = false;
    this.setDisplayedValues();
    delete this.filteredItems;

    // Scroll TagList to the top
    if (this.tagListAPI) {
      this.scrollTagList();
    }

    this.searchInput.off([
      `input.${COMPONENT_NAME}`,
      `keydown.${COMPONENT_NAME}`,
    ].join(' '));

    this.list
      .off([
        `click.${COMPONENT_NAME}`,
        `touchmove.${COMPONENT_NAME}`,
        `touchend.${COMPONENT_NAME}`,
        `touchcancel.${COMPONENT_NAME}`,
        `mousewheel.${COMPONENT_NAME}`,
        `mouseenter.${COMPONENT_NAME}`].join(' '))
      .remove();

    this.pseudoElem
      .removeClass('is-open')
      .attr('aria-expanded', 'false');

    this.searchInput
      .removeAttr('aria-activedescendant');

    $(document)
      .off([
        `click.${COMPONENT_NAME}`,
        `scroll.${COMPONENT_NAME}`,
        `touchstart.${COMPONENT_NAME}`,
        `touchmove.${COMPONENT_NAME}`,
        `touchend.${COMPONENT_NAME}`,
        `touchcancel.${COMPONENT_NAME}`].join(' '));

    if (this.parentScrollableArea) {
      this.parentScrollableArea.off('scroll.dropdown');
      delete this.parentScrollableArea;
    }

    $('body').off('resize.dropdown');
    $(window).off('orientationchange.dropdown');

    /**
    * Fires as the dropdown list is closed
    *
    * @event listclosed
    * @memberof Dropdown
    * @property {object} event - The jquery event object
    * @property {object} ui - The dialog object
    */
    this.element.trigger('listclosed', action);
    if (action !== 'click') {
      this.activate();
    }
    this.toggleTooltip();
    this.list = null;
    this.searchInput = null;
    this.listUl = null;
  },

  /**
   * @readonly
   * @returns {boolean} true if usage of `widthTarget` is enabled
   */
  get widthTargetEnabled() {
    return this.settings.width === 'parent' && typeof this.settings.widthTarget === 'string';
  },

  /**
   * @private
   */
  setListWidth() {
    // Limit the maxWidth
    if (this.settings.maxWidth) {
      const maxWidthAttr = typeof this.settings.maxWidth === 'number' ? `${this.settings.maxWidth}px` : 'auto';
      this.list.css('max-width', maxWidthAttr);
    }

    // Limit the dropdown list width
    if (this.settings.width) {
      let widthAttr = typeof this.settings.width === 'number' ? `${this.settings.width}px` : 'auto';
      if (this.widthTargetEnabled) {
        const el = document.querySelector(this.settings.widthTarget);
        if (el) widthAttr = `${el.clientWidth}px`;
      }
      this.list.css('width', widthAttr);
    }
  },

  /**
  * Scroll to a particular option and make it in view.
  * @private
  * @param  {object} current The option element to scroll to.
  * @returns {void}
  */
  scrollToOption(current) {
    if (!current) {
      return;
    }
    if (current.length === 0) {
      return;
    }

    // scroll to the currently selected option
    this.scrollLock(this.listUl);

    if (!this.settings.virtualScroll) {
      current[0].parentNode.scrollTop = current[0].offsetTop - current[0].parentNode.offsetTop;
    } else {
      current[0].closest('.ids-virtual-scroll').scrollTop = current[0].offsetTop - current[0].closest('.ids-virtual-scroll').offsetTop;
      current[0].scrollIntoView({ block: 'center' });
    }

    current.focus();
    this.searchInput.focus();
    this.scrollRelease(this.listUl);
  },

  /**
   * Isolate scrolling to a parent
   * @private
   */
  scrollLock() {
    this.parentScrollableArea?.off('scroll.dropdown');
  },

  /**
   * Restore the scroll behavior
   * @private
   */
  scrollRelease() {
    setTimeout(() => {
      this.parentScrollableArea?.off('scroll.dropdown').on('scroll.dropdown', (e) => {
        this.scrollDocument(e);
      });
    }, env.os.name === 'ios' ? 800 : 400);
  },

  /**
   * Scrolls an overflowed Tag List
   * @private
   * @returns {void}
   */
  scrollTagList() {
    if (!this.tagListAPI) {
      return;
    }

    setTimeout(() => {
      if (!this.isFocused) {
        this.tagListAPI.element.scrollTop = 0;
      }
    }, 5);
  },

  /**
  * Blur and Close List
  * @private
  * @returns {void}
  */
  handleBlur() {
    const self = this;
    self.closeList('cancel');

    return true;
  },

  /**
   * Function that is used to check if the field is loading from an ajax call.
   * @returns {void} Returns true if the field is attempting to load via AJAX.
   */
  isLoading() {
    return this.element.is('.is-loading') && this.element.is('.is-blocked');
  },

  /**
   * Return true/false depending on if the list is open.
   * @returns {boolean} The current state (open = true).
   */
  isOpen() {
    return !!(this.pseudoElem.hasClass('is-open'));
  },

  /**
   * Toggle the current state of the list between open and closed.
   * @private
   */
  toggle() {
    if (this.isOpen() || this.isLoading()) {
      this.closeList('cancel');
      return;
    }
    this.open();
  },

  /**
   * Toggle the current state of the list between open and closed.
   * This method is slated to be removed in a future v4.10.0 or v5.0.0.
   * @deprecated as of v4.4.0.  Please use `toggle()` instead.
   * @private
   * @returns {void}
   */
  toggleList() {
    return deprecateMethod(this.toggle, this.toggleList).apply(this);
  },

  /**
   * Highlights a Dropdown list option if it's present inside the list.
   * @private
   * @param {object} listOption The option element
   * @param {boolean} noScroll If true will scroll to the option
   * @returns {void}
   */
  highlightOption(listOption, noScroll) {
    if (!this.isOpen()) {
      return;
    }

    if (!listOption) {
      return;
    }

    if (listOption.length === 0) {
      listOption = this.list.find('.dropdown-option').eq(0);
    }

    if (listOption.is('.separator, .group-label')) {
      return;
    }

    // Get the corresponding option from the list,
    // or use an `<option>` element directly.
    let option;
    if (listOption.is('option')) {
      option = listOption;
      listOption = this.listUl.find(`li[data-val="${option.val()}"]`);
    } else {
      option = this.element.find('option').filter((i, item) => item.value === listOption.attr('data-val'));
    }

    // Unset previous highlight
    this.setItemIconOverColor();
    this.list.find('.is-focused')
      .removeClass('is-focused')
      .children('a').attr({ tabindex: '-1' });

    // Don't continue if a match hasn't been found, or the match is disabled.
    if (
      !listOption.length ||
      !option.length ||
      option.hasClass('.is-disabled') ||
      option.is(':disabled')
    ) {
      return;
    }

    // Set activedescendent for new option
    this.searchInput.attr('aria-activedescendant', listOption.children('a').attr('id'));

    this.setItemIconOverColor(listOption);
    listOption.addClass('is-focused')
      .children('a').attr({ tabindex: '0' });

    if (!noScroll || noScroll === false || noScroll === undefined) {
      this.scrollToOption(listOption);
    }
  },

  /**
   * Highlight Term and replace it in the DOM element
   * @param  {HTMLElement} li  The list item to replace
   * @param  {string} term  The search term
   * @returns {string} the markup of the li
   */
  highlightSearchTerm(li, term) {
    if (!li) {
      return '';
    }

    if (!term) {
      return li[0].outerHTML;
    }

    const a = li.children('a');
    const exp = this.getSearchRegex(term);
    let text = li.text();
    text = xssUtils.escapeHTML(text);
    text = text.replace(/&lt;/g, '&#16;');
    text = text.replace(/&gt;/g, '&#17;');
    text = text.replace(/&apos;/g, '&#18;');
    text = text.replace(/&quot;/g, '&#19;');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(exp, '<span class="dropdown-highlight">$1</span>').trim();
    text = text.replace(/&#16;/g, '&lt;');
    text = text.replace(/&#17;/g, '&gt;');
    text = text.replace(/&#18;/g, '&apos;');
    text = text.replace(/&#19;/g, '&quot;');

    const icon = li.children('a').find('svg').length !== 0 ? new XMLSerializer().serializeToString(li.children('a').find('svg')[0]) : '';
    const swatch = li.children('a').find('.swatch');
    const swatchHtml = swatch.length !== 0 ? swatch[0].outerHTML : '';

    if (a[0]) {
      a[0].innerHTML = swatchHtml + icon + text;
    }

    return li[0].outerHTML;
  },

  /**
   * Un Highlight the option that is being typed.
   * @private
   * @param  {object} listOptions The option element
   * @param  {boolean} noScroll If true will scroll to the option
   */
  unhighlightOptions(listOptions, noScroll) {
    if (!listOptions || !listOptions.length) {
      listOptions = this.list.find('.is-selected');
    }
    this.setItemIconOverColor();
    listOptions.removeClass('is-focused')
      .children('a').attr({ tabindex: '-1' });

    this.searchInput.removeAttr('aria-activedescendant');

    if (!noScroll || noScroll === false || noScroll === undefined) {
      this.scrollToOption(listOptions.first());
    }
  },

  /**
   * Renders a Dropdown/Multiselect item based on its corresponding <option> element's state
   * @private
   * @param {HTMLOptionElement} optionEl the option element
   * @returns {void}
   */
  renderListItem(optionEl) {
    const optionVal = optionEl.value;
    const selected = optionEl.selected;
    const li = this.listUl.find(`li[data-val="${optionVal}"]`);
    const a = li.children('a');

    if (!li) {
      return;
    }

    if (selected) {
      li[0].classList.add('is-selected');
      a[0].setAttribute('aria-selected', 'true');
      return;
    }

    li[0].classList.remove('is-selected');
    a[0].setAttribute('aria-selected', 'false');
  },

  /**
   * Toggle all selection for items.
   * @private
   * @param {boolean} doSelectAll true to select and false will clear selection for all items.
   * @returns {void}
   */
  selectAll(doSelectAll) {
    const selector = {
      options: 'option:not(.is-disabled):not(:disabled)',
      items: 'li.dropdown-option:not(.separator):not(.group-label):not(.is-disabled)'
    };
    let options = utils.getArrayFromList(this.element[0].querySelectorAll(selector.options));
    let items = utils.getArrayFromList(this.listUl[0].querySelectorAll(selector.items));
    const last = options[options.length - 1];

    // If the Multiselect should only select from filtered items,
    // filter the full result sets down to the ones that aren't hidden.
    if (this.settings.selectAllFilterOnly && this.filteredItems) {
      options = [];
      items = $.makeArray(this.filteredItems);
      items.forEach((item) => {
        const val = item.getAttribute('data-val');
        if (!val) {
          return;
        }
        const opt = this.element[0].querySelector(`option[value="${val}"]`);
        if (opt) {
          options.push(opt);
        }
      });
    }

    if (doSelectAll) {
      // Select all
      items.forEach((node) => {
        node.classList.add('is-selected');
        node.querySelector('a').setAttribute('aria-selected', 'true');
      });
      options.forEach((node) => {
        node.selected = true;
        node.setAttribute('selected', true);
      });
    } else {
      // Clear all
      items.forEach((node) => {
        node.classList.remove('is-selected');
        node.querySelector('a').setAttribute('aria-selected', 'false');
      });
      options.forEach((node) => {
        // Fix for ie-edge
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12087679/
        node.selected = false;
        node.setAttribute('selected', false);
        node.removeAttribute('selected');
      });
    }
    this.previousActiveDescendant = last.value || '';

    this.setDisplayedValues();
    this.updateItemIcon(last);

    if (!this.settings.selectAllFilterOnly && this.list[0].classList.contains('search-mode')) {
      this.resetList();
    }

    this.activate(true);
    this.setBadge(last);
    this.toggleTooltip();

    this.element.trigger('change').triggerHandler('selected');
  },

  /**
   * Convenience method for running _selectOption()_ on a set of list options.
   * Accepts an array or jQuery selector containing valid list options and selects/deselects them.
   * @private
   * @param {object} options incoming options
   * @param {boolean} noTrigger if true, causes the 'selected' and 'change' events
   * not to fire on each list item.
   */
  selectOptions(options, noTrigger) {
    // Use a jQuery selector if the incoming options are inside an array
    if (Array.isArray(options)) {
      options = $(options);
    }

    const self = this;
    options.each(function () {
      self.selectOption($(this), noTrigger);
    });

    self.element.trigger('change').triggerHandler('selected');
  },

  /**
   * Select an option and conditionally trigger events.
   * Accepts an array or jQuery selector containing valid list options and selects/deselects them.
   * @private
   * @param {object} option - the incoming li option
   * @param {boolean} noTrigger - if true, causes the 'selected' and 'change' events not to
   * @returns {void}
   * fire on the list item.
   */
  selectOption(option, noTrigger) {
    if (!option || !option.length) {
      return;
    }
    let li;
    this.scrollLock(this.listUl);

    // Discovers a `<option>` incoming item from its corresponding Dropdown List item's `data-val` attribute.
    if (option.is('li')) {
      li = option;
      option = this.element.find(`option[value="${option.attr('data-val')}"]`);

      // Try matching the option's text if 'cur' comes back empty.
      // Supports options that don't have a 'value' attribute.
      if (option.length === 0) {
        option = this.element.find('option').filter(function () {
          return $(this).text() === li.attr('data-val');
        });
      }

      if (option.prop('disabled')) {
        this.scrollRelease(this.listUl);
        return;
      }
    }

    let optionVal = option.val();

    if (typeof option === 'string') {
      li = this.listUl.find(`li[data-val="${option}"]`);
      optionVal = option;
      option = this.element.find(`option[value="${optionVal}"]`);
    } else if (typeof optionVal === 'string') {
      optionVal = optionVal.replace(/"/g, '/quot/');
      li = this.listUl.find(`li[data-val="${optionVal}"]`);
    }

    const isFirstItemSelected = this.listUl.find('li').first().hasClass('is-selected');
    let isAdded = true;
    let doAnnounce = true;
    let currentValue = this.selectedValues;
    let clearSelection = false;

    if (option.hasClass('clear') || !li) {
      clearSelection = true;
    }

    // If in single-select mode, or forcing a clear, unset all selections.
    if (clearSelection) {
      this.deselectAll();
    }

    // In a multi-select setting, it's possible for deselection to happen instead of selection.
    if (!Array.isArray(currentValue)) {
      currentValue = [currentValue];
    }

    const isSameValue = currentValue.indexOf(optionVal) > -1;
    if (this.settings.multiple) {
      if (isSameValue) {
        isAdded = false;
      }
    }

    if (isAdded) {
      if (isSameValue && !isFirstItemSelected) {
        doAnnounce = false;
      } else {
        this.select(option[0]);
        this.previousActiveDescendant = optionVal;

        if (this.settings.noSearch && this.searchMatches) {
          delete this.searchMatches;
        }
      }
    } else {
      this.deselect(option[0]);
      this.previousActiveDescendant = undefined;
    }

    const listScrollTop = this.listUl[0].scrollTop;
    if (listScrollTop > 0) {
      this.currentlyScrolledPos = listScrollTop;
    }

    this.renderListItem(option[0]);
    this.setDisplayedValues();
    this.updateItemIcon(option);

    /**
    * Fires after the value in the input is changed by any means.
    * @event change
    * @memberof Dropdown
    * @property {object} event The jquery event object
    */
    if (!noTrigger && doAnnounce) {
      // Fire the change event with the new value if the noTrigger flag isn't set
      this.element.trigger('change').triggerHandler('selected', [option, isAdded]);
      this.toggleTooltip();
    }

    // If multiselect, reset the menu to the unfiltered mode
    if (this.settings.multiple) {
      this.activate(true);
    }

    this.setBadge(option);

    const id = this.element.attr('id');
    if (env.browser.isIE11() && id) {
      const ieHtml = $(`#${id}`).html();
      const ieVal = $(`#${id}`).val();
      if (ieHtml) {
        this.element.html(ieHtml);
      }
      if (ieVal) {
        this.element.val(ieVal);
      }
    }

    $('.tooltip:not(.is-hidden)').hide();
    this.scrollRelease(this.listUl);
  },

  /**
   * Selects an option element directly.
   * @param {HTMLOptionElement} optionEl the option to be deselected
   * @returns {void}
   */
  select(optionEl) {
    if (!optionEl || !(optionEl instanceof HTMLOptionElement)) {
      return;
    }

    // If this is a multselect, never allow more items to be selected than
    // defined by settings.
    if (this.settings.multiple) {
      if (this.selectedValues.length >= this.settings.maxSelected) {
        return;
      }
    }

    optionEl.selected = true;
  },

  /**
   * Select an option by its value.
   * @param {string} value - A string containing the value to look for. (Case insensitive)
   * @returns {void}
   */
  selectValue(value) {
    if (typeof value !== 'string') {
      return;
    }

    const option = this.element.find(`option[value="${value}"]`);
    if (!option || !option.length) {
      return;
    }

    this.select(option[0]);
    this.updated();
  },

  /**
   * Deselects an option element directly.
   * @param {HTMLOptionElement} optionEl the option to be deselected
   * @returns {void}
   */
  deselect(optionEl) {
    if (!optionEl || !(optionEl instanceof HTMLOptionElement)) {
      return;
    }

    optionEl.selected = false;
    this.element.trigger('change');
  },

  /**
   * Deselect an option by its value.
   * @param {string} value - A string containing the value to look for. (Case insensitive)
   * @returns {void}
   */
  deselectValue(value) {
    if (typeof value !== 'string') {
      return;
    }

    const option = this.element.find(`option[value="${value}"]`);
    if (!option || !option.length) {
      return;
    }

    this.deselect(option[0]);
    this.updated();
  },

  /**
   * Deselects all <select> options.
   * @returns {void}
   */
  deselectAll() {
    const allOptions = this.element.find('option');
    allOptions.each((i, option) => {
      $(option).prop('selected', false);
      this.deselectValue(option);
    });
  },

  /**
   * Finds the first HTMLOptionElement inside the select that matches a given search term
   * @param {string} char a single character or filter term that will be matched.
   * @returns {HTMLOptionElement|undefined} representing the first option that matches the filter term. Returns nothing if there's no match.
   */
  firstOptionStartingWith(char) {
    if (typeof char !== 'string') {
      return;
    }

    const elem = this.element[0];

    let newIdx = -1;
    let totalMatches = 0;

    // Log search matches
    if (!this.searchMatches || !this.searchMatches[char]) {
      this.searchMatches = {};
      this.searchMatches[char] = [];
    }

    for (let i = 0; i < elem.options.length; i++) {
      const option = elem.options[i];
      // Check if its a match (Case insensitive)
      const isMatch = option.innerText.toLowerCase().indexOf(char) === 0;

      if (isMatch) {
        if (this.searchMatches[char].indexOf(i) === -1) {
          this.searchMatches[char].push(i);
          newIdx = i;
          break;
        }
        totalMatches++;
        continue;
      }
    }

    if (newIdx === -1) {
      if (!this.searchMatches[char].length) {
        return;
      }

      if (totalMatches === this.searchMatches[char].length) {
        newIdx = this.searchMatches[char][0];
        this.searchMatches[char].length = 1; // reset
      }
    }

    return elem.options[newIdx]; //eslint-disable-line
  },

  /**
   * Select the next item that starts with a given string (text of the option).
   * @param {string} char - The starting letter to match for. (Case insensitive)
   * @returns {void}
   */
  selectStartsWith(char) {
    this.filterTerm = '';
    const newOption = this.firstOptionStartingWith(char);

    this.select(newOption);
    this.updated();
    this.element.trigger('change');
  },

  /**
   * Highlights the next item that starts with a given string (text of the option).
   * @param {string} char - The starting letter to match for. (Case insensitive)
   * @returns {void}
   */
  highlightStartsWith(char) {
    if (!this.isOpen()) {
      return;
    }

    const newOption = this.firstOptionStartingWith(char);
    this.highlightOption($(newOption));
  },

  /**
   * Set the bade on the option from the config.
   * @private
   * @param {string} option - A string containing the value to look for. (Case insensitive)
   */
  setBadge(option) {
    // Badge Support
    if (this.badges) {
      let badge = this.element.parent().find('.badge');

      if (badge.length === 0) {
        this.element.parent().find('.dropdown-wrapper').append('<span class="badge">1</span>');
        badge = this.element.parent().find('.badge');
      }

      badge.attr('class', `badge ${option.attr('data-badge-color') ? option.attr('data-badge-color') : 'azure07'}`)
        .text(option.attr('data-badge'));
    }
  },

  /**
   * Execute the source ajax option
   * @private
   * @param {function} callback  The function call back.
   * @param {boolean} doReset  if defined, acts as a "reset" source call, where the search term will be ignored.
   * @returns {function} The callback for execution.
   */
  callSource(callback, doReset) {
    const self = this;
    let searchTerm = '';

    if (!doReset && this.isOpen() && !this.element.hasClass('search-mode')) {
      searchTerm = this.searchInput.val();
    }

    // Return false and let the normal display codepath run.
    if (!this.settings.source) {
      return false;
    }

    this.isFiltering = false;

    const sourceType = typeof this.settings.source;
    const response = function (data, isManagedByTemplate) {
      // to do - no results back do not open.
      let list = '';
      const val = self.element.val();

      function replaceDoubleQuotes(content) {
        return content.replace(/"/g, '\'');
      }

      function buildOption(option) {
        if (option === null || option === undefined) {
          return;
        }

        const isString = typeof option === 'string';
        const stringContent = option;
        let id = '';
        let selected = '';
        let textContent = '';
        let disabled = '';

        if (isString) {
          option = {
            value: stringContent
          };
        }

        if (option.value !== undefined) {
          option.value = replaceDoubleQuotes(option.value);
        }

        if (option.id !== undefined) {
          if (!isNaN(option.id)) {  //eslint-disable-line
            option.id = `${option.id}`;
          }
          option.id = replaceDoubleQuotes(option.id);
          id = ` id="${option.id}"`;
        }

        if (option.label !== undefined && option.label.length) {
          option.label = replaceDoubleQuotes(option.label);
          textContent = option.label;
        }

        // Detect whether or not the `<option>` should be selected
        const selectedValues = self.selectedValues;
        const hasSelectedValues = selectedValues.indexOf(val) > -1;
        if (self.settings.multiple) {
          val.forEach((value) => {
            if (value === option.value) {
              option.selected = true;
            }
          });
        } else if (option.value === val || hasSelectedValues) {
          option.selected = true;
        }
        if (option.selected) {
          selected = ' selected';
        }
        if (option.disabled) {
          disabled = ' disabled';
        }

        // Make sure that text content is populated.
        // If all else fails, just use the value.
        if (!textContent.length && textContent !== option.value) {
          textContent += option.value;
        }

        // Render the option element
        list += `<option${id} value="${option.value}"${selected}${disabled}>
          ${textContent}
        </option>`;
      }

      // If the incoming dataset is different than the one we started with,
      // replace the contents of the list, and rerender it.
      if (!self.isFiltering && !utils.equals(data, self.dataset)) {
        self.dataset = data;

        if (!isManagedByTemplate) {
          self.element.empty();
          for (let i = 0; i < data.length; i++) {
            let opts;

            if (data[i].group) {
              opts = data[i].options;
              list += `<optgroup label="${data[i].group}">`;
              for (let ii = 0; ii < opts.length; ii++) {
                buildOption(opts[ii]);
              }
              list += '</optgroup>';
            } else {
              buildOption(data[i]);
            }
          }

          self.element.append(list);
        }
      }

      self.element.triggerHandler('complete'); // For Busy Indicator
      self.element.trigger('requestend', [searchTerm, data]);

      if (typeof callback !== 'function') {
        self.updateList(searchTerm);
        return;
      }
      callback();
    };

    self.element.triggerHandler('start'); // For Busy Indicator
    self.element.trigger('requeststart');

    if (sourceType === 'function') {
      // Call the 'source' setting as a function with the done callback.
      this.settings.source(response, searchTerm, this.settings.sourceArguments);
    } else if (sourceType === 'object') {
      // Use the 'source' setting as pre-existing data.
      // Sanitize accordingly.
      const sourceData = $.isArray(this.settings.source) ? this.settings.source :
        [this.settings.source];
      response(sourceData);
    } else {
      // Attempt to resolve source as a URL string.  Do an AJAX get with the URL
      const sourceURL = this.settings.source.toString();
      const request = $.getJSON(sourceURL);

      request.done((data) => {
        response(data);
      }).fail(() => {
        response([]);
      });
    }

    return true;
  },

  /**
   * Get data attributes from passed list of attributes
   * @private
   * @param {array} attr - List of all attributes.
   * @param {array} attrToExclude - List of attributes to be excluded from passed list.
   * @returns {object} It will return an object containing two keys
   * str - string of attributes
   * obj - object of attributes
   */
  getDataAttributes(attr, attrToExclude) {
    if (!attr) {
      return;
    }
    if (typeof attr === 'string') {
      attr = [attr];
    }

    let toExclude = attrToExclude || [];
    if (typeof toExclude === 'string') {
      toExclude = [toExclude];
    }
    const attrToCopy = {
      obj: {},
      str: '',
      isExclude(attrib) {
        return $.inArray(attrib, toExclude) > -1;
      }
    };
    for (const key in attr) { //eslint-disable-line
      if (!attr.hasOwnProperty(key)) {  //eslint-disable-line
        continue; //eslint-disable-line
      }
      attrToCopy.name = `${attr[key].name}`;
      attrToCopy.isData = attrToCopy.name.substr(0, 5) === 'data-';
      if (attrToCopy.isData && !attrToCopy.isExclude(attrToCopy.name)) {
        attrToCopy.obj[attrToCopy.name] = attr[key].value;
        attrToCopy.str += ` ${
          attrToCopy.name}="${attr[key].value}"`;
      }
    }
    return { str: attrToCopy.str, obj: attrToCopy.obj };  //eslint-disable-line
  },

  /**
   * Public API for setting the `<select>`'s value.
   * @private
   * @param {string} code - The value to match and set on the value element.
   */
  setCode(code) {
    const self = this;
    const doSetting = function () {
      self.element.val(code);
      self.updated();
    };

    if (!self.callSource(doSetting)) {
      doSetting();
    }
  },

  /**
   * Returns true if the object is a mobile element.
   * @private
   * @returns {boolean} code - True if this is a mobile device
   */
  isMobile() {
    return ['ios', 'android'].indexOf(env.os.name) > -1;
  },

  /**
   * Returns true if the element already has the closable class.
   * @private
   * @returns {object} The list
   */
  isListClosable() {
    return this.list.hasClass('is-closable');
  },

  /**
   * Gets a data-representation of the currently-selected Multiselect items in a format
   * compatible with the TagList component.
   * @returns {array} containing JSON-compatible data representing a collection of tags
   */
  toTagData() {
    const tagData = [];
    let componentID = this.element[0].id;
    if (!componentID) {
      componentID = utils.uniqueId(this.element[0], this.element[0].className);
    }

    this.selectedOptions.forEach((opt) => {
      tagData.push({
        content: opt.innerText.trim(),
        dismissible: true,
        href: '#',
        id: `${componentID}-tag-${opt.value}`,
        style: 'secondary',
        value: opt.value
      });
    });
    return tagData;
  },

  /**
   * Disable the input element.
   */
  disable() {
    this.element
      .prop('disabled', true)
      .prop('readonly', false);

    this.pseudoElem.addClass('is-disabled');

    if (this.pseudoElem.is($(document.activeElement))) {
      this.pseudoElem.blur();
    }

    this.pseudoElem
      .addClass('is-disabled')
      .removeClass('is-readonly')
      .removeAttr('aria-readonly')
      .attr('tabindex', '-1')
      .prop('readonly', false)
      .prop('disabled', true);
    this.closeList('cancel');

    if (this.settings.showTags) {
      this.pseudoElem.find('.tag').addClass('is-disabled');
    }
  },

  /**
  * Returns true if the dropdown is disabled.
  * @returns {boolean} True if the element is disabled.
  */
  isDisabled() {
    return this.element.prop('disabled');
  },

  /**
   * Enable the input element.
   */
  enable() {
    this.element
      .prop('disabled', false)
      .prop('readonly', false);
    this.pseudoElem
      .prop('disabled', false)
      .prop('readonly', false)
      .attr('tabindex', '0')
      .removeClass('is-disabled')
      .removeClass('is-readonly')
      .removeAttr('aria-readonly');

    if (this.settings.showTags) {
      this.pseudoElem.find('.tag').removeClass('is-disabled');
    }
  },

  /**
   * Make the input element readonly.
   */
  readonly() {
    this.element
      .prop('disabled', false)
      .prop('readonly', true);
    this.pseudoElem
      .removeClass('is-disabled')
      .addClass('is-readonly')
      .attr('aria-readonly', 'true')
      .attr('tabindex', this.element.attr('tabindex') || '0')
      .prop('disabled', false)
      .prop('readonly', true);
    this.closeList('cancel');
  },

  /**
   * Tear down events and restore to original state.
   * @param  {object} settings The settings object to use.
   * @returns {void}
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    this.closeList('cancel');

    if (this.pseudoElem && this.pseudoElem.hasClass('is-open')) {
      this.pseudoElem
        .removeClass('is-open')
        .removeAttr('aria-expanded');
    }

    // Update the 'multiple' property
    if (this.settings.multiple && this.settings.multiple === true) {
      this.element.prop('multiple', true);
    } else {
      this.element.prop('multiple', false);
    }

    // update "readonly" prop
    if (this.element.prop('readonly') === true) {
      this.readonly();
    } else {
      this.pseudoElem.removeClass('is-readonly');
      this.pseudoElem.removeAttr('aria-readonly');
    }

    // update "disabled" prop
    this.pseudoElem[this.element.prop('disabled') ? 'addClass' : 'removeClass']('is-disabled');

    // update the list and set a new value, if applicable
    this.updateList();
    this.setDisplayedValues();
    this.toggleTooltip();

    this.element.trigger('has-updated');

    return this;
  },

  /**
   * Tear down events and restore to original state.
   */
  destroy() {
    if (this.placeholder) {
      delete this.placeholder;
    }

    if (this.currentlyScrolledPos) {
      delete this.currentlyScrolledPos;
    }

    $.removeData(this.element[0], COMPONENT_NAME);
    this.closeList('cancel');
    this.pseudoElem.off().remove();
    this.icon.remove();
    this.wrapper.remove();
    this.listfilter.destroy();
    this.element.removeAttr('style');
    this.element.closest('form').off('reset.dropdown');
    this.element.off();
    this.label.off();

    const list = document.body.querySelector('#dropdown-list');
    if (list && this.isOpen()) {
      list.parentNode.removeChild(list);
    }
  },

  /**
   * Setup the internal event handlers.
   * @private
   */
  handleEvents() {
    const self = this;

    function isTagEl(e) {
      // If the element clicked is a tag, ignore and let the tag handle it.
      const containedByTag = $(e.target).parents('.tag').length > 0;
      let isTag = false;
      if (e.target instanceof HTMLElement && typeof e.target.className === 'string') {
        isTag = e.target.classList.contains('tag');
      }

      if (isTag || containedByTag) {
        return true;
      }

      return false;
    }

    let isTag = false;
    this.pseudoElem
      .on('keydown.dropdown', e => this.handlePseudoElemKeydown(e))
      .on('click.dropdown touchstart.dropdown', (e) => {
        // Would like the click event to bubble up if ctrl and shift are pressed
        if (!(e.originalEvent.ctrlKey && e.originalEvent.shiftKey)) {
          e.stopPropagation();
        }
        if (isTag) {
          return;
        }
        self.dropdownParent = e.currentTarget;
        self.toggle();
      }).on('mouseup.dropdown touchend.dropdown', (e) => {
        if (e.button === 2) {
          e.stopPropagation();
        }
      }).on('mousedown.dropdown touchstart.dropdown', (e) => {
        isTag = isTagEl(e);
      })
      .on('touchcancel.dropdown', (e) => {
        if (isTagEl(e)) {
          return;
        }
        e.stopPropagation();
        self.toggle();
        e.preventDefault();
      });

    // If the Dropdown/Multiselect loses focus while tags are showing,
    // the tag list will scroll itself to the top.
    if (this.tagListAPI) {
      this.pseudoElem.on('focusout.dropdown', () => {
        this.scrollTagList();
      });
    }

    self.element.on('activated.dropdown', () => {
      self.label.trigger('click');
    }).on('updated.dropdown', (e) => {
      e.stopPropagation();
      self.updated();
    }).on('openlist.dropdown', () => {
      self.toggle();
    });

    // for form resets.
    self.element.closest('form').on('reset.dropdown', () => {
      setTimeout(() => {
        self.element.triggerHandler('updated');
      }, 1);
    });

    // Handle Label click
    this.label.on('click', () => {
      if (self.isDisabled()) {
        return;
      }

      self.pseudoElem.focus();
    });
  }
};

export { Dropdown, COMPONENT_NAME };
