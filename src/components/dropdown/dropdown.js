import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { Environment as env } from '../../utils/environment';
import { Locale } from '../locale/locale';
import { ListFilter } from '../listfilter/listfilter';
import { xssUtils } from '../../utils/xss';

// jQuery Components
import '../icons/icons.jquery';
import '../../utils/lifecycle';
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
* @param {string} [settings.filterMode = 'contains']  Search mode to use between 'startsWith' and 'contains', false will not allow client side filter
* @param {boolean} [settings.noSearch = false]  If true, disables the ability of the user to enter text
* in the Search Input field in the open combo box
* @param {boolean} [settings.showEmptyGroupHeaders = false]  If true, displays optgroup headers in the list
* even if no selectable options are present underneath.
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
* @param {object} [settings.placementOpts = null]  Gets passed to this control's Place behavior
* @param {function} [settings.onKeyDown = null]  Allows you to hook into the onKeyDown. If you do you can access the keydown event data. And optionally return false to cancel the keyDown action.
*/
const DROPDOWN_DEFAULTS = {
  closeOnSelect: true,
  cssClass: null,
  filterMode: 'contains',
  maxSelected: undefined, // (multiselect) sets a limit on the number of items that can be selected
  moveSelected: 'none',
  moveSelectedToTop: undefined,
  multiple: false, // Turns the dropdown into a multiple selection box
  noSearch: false,
  showEmptyGroupHeaders: false,
  showSelectAll: false, // (Multiselect) shows an item the top of the list labeled "select all".
  source: undefined,
  sourceArguments: {},
  reload: reloadSourceStyles[0],
  empty: false,
  delay: 300,
  maxWidth: null,
  placementOpts: null,
  onKeyDown: null
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

    if (!orgId) {
      orgId = utils.uniqueId(this.element, 'dropdown');
      DOM.setAttribute(this.element[0], 'id', orgId);
      DOM.setAttribute(this.element.parent().find('label').first()[0], 'for', orgId);
    }

    if (env.os.name === 'ios' || env.os.name === 'android') {
      this.settings.noSearch = true;
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
    const baseElement = this.isInlineLabel ? this.inlineLabel : this.element;
    this.wrapper = baseElement.next('.dropdown-wrapper');
    this.isWrapped = this.wrapper.length > 0;

    if (!this.isWrapped) {
      this.wrapper = $('<div class="dropdown-wrapper"></div>').insertAfter(baseElement);
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
    this.label = $(`label[for="${orgId}"]`);

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
        'aria-autocomplete': 'list',
        'aria-controls': 'dropdown-list',
        'aria-readonly': 'true',
        'aria-expanded': 'false',
        'aria-label': this.label.text()
      });

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
      this.icon = $.createIconElement('dropdown');
      this.wrapper.append(this.icon);
    }

    // Setup the incoming options that can be set as properties/attributes
    if (this.element.prop('multiple') && !this.settings.multiple) {
      this.settings.multiple = true;
    }
    if (this.settings.multiple && !this.element.prop('multiple')) {
      this.element.prop('multiple', true);
    }

    // Add the internal hash for typeahead filtering, if applicable
    if (this.settings.reload === 'typeahead') {
      this.selectedValues = [];
    } else {
      delete this.selectedValues;
    }

    const dataSource = this.element.attr('data-source');
    if (dataSource && dataSource !== 'source') {
      this.settings.source = dataSource;
    }
    const dataMaxselected = this.element.attr('data-maxselected');
    if (dataMaxselected && !isNaN(dataMaxselected)) { //eslint-disable-line
      this.settings.maxSelected = parseInt(dataMaxselected, 10);
    }

    // TODO: deprecate "moveSelectedToTop" in favor of "moveSelected"
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

    this.tooltipApi = null;
    if (this.pseudoElem.find('span').width() >= this.pseudoElem.width()) {
      this.setTooltip();
    }

    this.element.triggerHandler('rendered');

    return this.handleEvents();
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
    }, 100);

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
   * Triggers tooltip in multiselect
   */
  setTooltip() {
    const opts = this.element.find('option:selected');
    const optText = this.getOptionText(opts);
    this.tooltipApi = this.pseudoElem.find('span').tooltip({
      content: optText,
      trigger: 'hover',
    });
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

    if (this.element[0].classList.contains('text-align-reverse')) {
      reverseText = ' text-align-reverse';
    } else if (this.element[0].classList.contains('text-align-center')) {
      reverseText = ' text-align-center';
    }

    if (!listExists) {
      listContents = `<div class="dropdown-list${reverseText
      }${isMobile ? ' mobile' : ''
      }${this.settings.multiple ? ' multiple' : ''}" id="dropdown-list" role="application" ${this.settings.multiple ? 'aria-multiselectable="true"' : ''}>` +
        `<label for="dropdown-search" class="audible">${Locale.translate('Search')}</label>` +
        `<input type="text" class="dropdown-search${reverseText
        }" role="combobox" aria-expanded="true" id="dropdown-search" aria-autocomplete="list">` +
        `<span class="trigger">${
          isMobile ? $.createIcon({ icon: 'close', classes: ['close'] }) : $.createIcon('dropdown')
        }<span class="audible">${isMobile ? Locale.translate('Close') : Locale.translate('Collapse')}</span>` +
        '</span>' +
        '<ul role="listbox">';
    }

    // Get a current list of <option> elements
    // If none are available, simply return out
    let opts = this.element.find('option');
    let groups = this.element.find('optgroup');
    let selectedFilterMethod = ':selected';
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

    function buildLiHeader(textContent) {
      return `<li role="presentation" class="group-label" focusable="false">
        ${textContent}
      </li>`;
    }

    function buildLiOption(option, index) {
      let liMarkup = '';
      let text = option.innerHTML;
      const attributes = DOM.getAttributes(option);
      const value = attributes.getNamedItem('value');
      const title = attributes.getNamedItem('title');
      const hasTitle = title ? `" title="${title.value}"` : '';
      const badge = attributes.getNamedItem('data-badge');
      const badgeColor = attributes.getNamedItem('data-badge-color');
      let badgeHtml = '';
      const isSelected = option.selected ? ' is-selected' : '';
      const isDisabled = option.disabled ? ' is-disabled' : '';
      const liCssClasses = option.className ? ` ${option.className.value}` : '';
      const aCssClasses = liCssClasses.indexOf('clear') > -1 ? ' class="clear-selection"' : '';
      const tabIndex = ` tabIndex="${index && index === 0 ? 0 : -1}"`;
      const toExclude = ['data-badge', 'data-badge-color', 'data-val', 'data-icon'];
      const copiedDataAttrs = ` ${self.getDataAttributes(attributes, toExclude).str}`;
      const trueValue = (value && 'value' in value ? value.value : text).replace(/"/g, '/quot/');
      let iconHtml = '';

      if (self.listIcon.hasIcons && self.listIcon.items[index]) {
        iconHtml = self.listIcon.items[index].html;
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
        text = text.replace(exp, '<i>$1</i>').trim();
      }

      liMarkup += `<li class="dropdown-option${isSelected}${isDisabled}${liCssClasses}" data-val="${trueValue}" ${copiedDataAttrs}${tabIndex}${hasTitle} role="presentation">
        <a id="list-option-${index}" href="#" ${aCssClasses} role="option">${iconHtml}${text}${badgeHtml}</a></li>`;

      return liMarkup;
    }

    // In multiselect scenarios, shows an option at the top of the list that will
    // select all available options if checked.
    if (isMultiselect && showSelectAll) {
      const allSelected = opts.not('[disabled], .hidden').length === selectedOpts.not('[disabled], .hidden').length;

      ulContents += `<li role="presentation" class="dropdown-select-all-list-item${allSelected ? ' is-selected' : ''}">` +
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
        ulContents += buildLiHeader(`${Locale.translate('Selected')} ${self.isInlineLabel ? self.inlineLabelText.text() : this.label.text()}`);
      }

      selectedOpts.each(function (i) {
        ulContents += buildLiOption(this, i);
        upTopOpts++;
      });

      // Only show the "all" header beneath the selected options if there
      // are no other optgroups present
      if (!hasOptGroups && opts.length > 0) {
        ulContents += buildLiHeader(`${Locale.translate('All')} ${self.isInlineLabel ? self.inlineLabelText.text() : this.label.text()}`);
      }
    }

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
          ulContents += buildLiHeader(`${parent.attr('label')}`);

          // Add all selected items for this group
          if (moveSelected === 'group') {
            groupsSelectedOpts[optgroupIndex].each(function (j) {
              ulContents += buildLiOption(this, j);
              upTopOpts++;
            });
          }
        }
      }

      if (moveSelected !== 'none' && option.is(':selected')) {
        return;
      }

      ulContents += buildLiOption(this, count);
    });

    // Render the new list contents to the page.
    // Build the entire thing and set references if this is the first opening.
    // Otherwise, simply replace the elements inside the <ul>.
    if (!listExists) {
      listContents += `${ulContents}</ul>` +
        '</div>';

      // Append markup to the DOM
      this.list = $(listContents);

      // Get references
      this.listUl = this.list.find('ul');
      this.searchInput = this.list.find('#dropdown-search');
    } else {
      this.listUl.html(ulContents);
    }

    if (this.listIcon.hasIcons) {
      this.list.addClass('has-icons');
      this.listIcon.pseudoElemIcon.clone().appendTo(this.list);
    }

    if (hasOptGroups) {
      this.listUl.addClass('has-groups');
    }

    if ($.fn.tooltip) {
      this.listUl.find('[title]').addClass('has-tooltip').tooltip();
    }

    this.position();

    if (this.isOpen()) {
      this.highlightOption(this.listUl.find('li:visible:not(.separator):not(.group-label):not(.is-disabled)').first());
    }
  },

  /**
   * Sets the displayed value of the Pseudo-Element based on currently-selected options.
   * @private
   */
  setDisplayedValues() {
    const opts = this.element.find('option:selected');
    let text = this.getOptionText(opts);

    if (opts.hasClass('clear')) {
      text = '';
    }

    if (this.settings.empty && opts.length === 0) {
      this.pseudoElem.find('span').text('');
      return;
    }

    // Displays the text on the pseudo-element
    const maxlength = this.element.attr('maxlength');
    if (maxlength) {
      text = text.substr(0, maxlength);
    }
    text = text.trim();
    this.pseudoElem.find('span').text(text);

    // Set the "previousActiveDescendant" to the first of the items
    this.previousActiveDescendant = opts.first().val();

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

    // set placeholder text on pseudoElem span element
    if (this.element.attr('placeholder')) {
      this.pseudoElem.find('span').attr('data-placeholder-text', this.element.attr('placeholder'));
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
    if (e.altKey && (charCode === 38 || charCode === 40)) {
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
    if (this.settings.noSearch) {
      this.searchInput.prop('readonly', true);
    }

    // Used to determine how spacebar should function.
    // False means space will select/deselect.  True means
    // Space will add a space inside the search input.
    if (!this.filterTerm) {
      this.searchKeyMode = false;
    }

    this.searchInput
      .on(`keydown.${COMPONENT_NAME}`, (e) => {
        const searchInput = $(this);
        if (!this.ignoreKeys(searchInput, e)) {
          return false;
        }

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
    const list = $('.dropdown-option', this.listUl);
    const headers = $('.group-label', this.listUl);
    let hasIcons = false;
    let results;

    if (!list.length || !this.list || this.list && !this.list.length) {
      return;
    }

    if (!term) {
      term = '';
    }

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
    list.filter(results).each(function (i) {
      const li = $(this);
      li.attr('tabindex', i === 0 ? '0' : '-1');

      if (!selected) {
        self.highlightOption(li);
        selected = true;
      }

      // Highlight Term
      const exp = self.getSearchRegex(term);
      const text = li.text().replace(exp, '<i>$1</i>').trim();
      const icon = li.children('a').find('svg').length !== 0 ? new XMLSerializer().serializeToString(li.children('a').find('svg')[0]) : '';

      if (icon) {
        hasIcons = true;
      }

      li.children('a').html(icon + text);
    });

    headers.each(function () {
      const children = $(this).nextUntil('.group-label, .selector').not('.hidden');
      if (self.settings.showEmptyGroupHeaders || children.length) {
        $(this).removeClass('hidden');
      }
    });

    term = '';
    this.position();

    if (hasIcons && this.list.find('svg').length > 2) {
      this.list.find('svg').last().changeIcon('icon-empty-circle');
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
    let hasIcons = false;
    lis.removeAttr('style').each(function () {
      const a = $(this).children('a');
      const li = $(this);

      const text = a.text();
      const icon = li.children('a').find('svg').length !== 0 ? new XMLSerializer().serializeToString(li.children('a').find('svg')[0]) : '';

      if (icon) {
        hasIcons = true;
      }

      a.html(icon + text);
    });

    // Adjust height / top position
    if (this.list.hasClass('is-ontop')) {
      this.list[0].style.top = `${this.pseudoElem.offset().top - this.list.height() + this.pseudoElem.outerHeight() - 2}px`;
    }

    if (this.settings.multiple) {
      this.updateList();
    }

    lis.removeClass('hidden');
    this.position();

    if (hasIcons && this.list.find('svg').length > 2) {
      this.list.find('svg').last().changeIcon('icon-empty-circle');
    }

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

    // TODO: Refactor this in v4.9.0 to call `selectOption` instead.  Can't currently
    // do that because `selectOption` depends on the list being open.
    blank[0].selected = true;
    blank[0].setAttribute('selected', true);
    this.element.triggerHandler('updated');
    this.element.triggerHandler('change');
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

    if (this.isLoading()) {
      return;
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
      options = this.listUl.find(excludes);
      selectedIndex = -1;
      $(options).each(function (index) {
        if ($(this).is('.is-focused')) {
          selectedIndex = index;
        }
      });
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
          self.closeList('tab');
          this.activate();
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
            self.selectOption($(options[selectedIndex])); // store the current selection
          }

          if (self.settings.closeOnSelect) {
            self.closeList('select'); // Close the option list
            self.activate();
          }
        }
        e.stopPropagation();
        return false;  //eslint-disable-line
      }
      case 38: { // up
        if (e.shiftKey) {
          return;
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

        e.stopPropagation();
        e.preventDefault();
        return false;  //eslint-disable-line
      }
      case 40: { // down
        if (e.shiftKey) {
          return;
        }
        this.searchKeyMode = false;

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

    if (!self.isOpen() && !self.isControl(key) &&
      !this.settings.source && !this.settings.noSearch) {
      // Make this into Auto Complete
      self.isFiltering = true;
      self.filterTerm = $.actualChar(e);

      if (self.searchInput && self.searchInput.length) {
        self.searchInput.val($.actualChar(e));
      }
      self.toggleList();
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

    // Down arrow opens the list.
    // Down/Up are for IE/Edge.
    // ArrowDown/ArrowUp are for all others.
    const openKeys = ['ArrowDown', 'ArrowUp', 'Down', 'Up', 'Enter', 'Spacebar', ' '];
    if (openKeys.indexOf(key) > -1) {
      if (!this.isOpen()) {
        this.open();
      }

      // TODO: refactor this out so that `handleKeyDown` is no longer necessary.
      // This is necessary here because in `noSearch` mode, there is no actionable searchInput.
      if (this.settings.noSearch && !e.ctrlKey) {
        this.handleKeyDown(target, e);
      }

      return false;
    }

    // Mac OSX: "backspace" delete key
    // Everything else: DEL key (numpad, control keys)
    const isOSX = env.os.name === 'Mac OS X';
    if ((!isOSX && key === 'Delete') || (isOSX && key === 'Backspace')) {
      this.selectBlank();

      // Stop the backspace key from navigating back a page
      if (key === 'Backspace') {
        e.stopPropagation();
        e.preventDefault();
      }
      return true;
    }

    // In nosearch mode, bypass the typeahead autocomplete and pass keydown events
    // along to the list elements
    if (this.settings.noSearch && isEscapeKey) {
      if (this.isOpen()) {
        return this.handleKeyDown(target, e);
      }
    }

    // Allow some keys to pass through with no changes in functionality
    if (isEscapeKey || key === 'Tab') {
      return true;
    }

    // handle `onKeyDown` callback
    if (this.settings.onKeyDown) {
      const ret = this.settings.onKeyDown(e);
      if (ret === false) {
        e.stopPropagation();
        e.preventDefault();
        return false; //eslint-disable-line
      }
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
      this.filterTerm = this.searchInput.val();
    } else {
      this.filterTerm += $.actualChar(e);
      if (e.key !== this.filterTerm && e.key.toLowerCase() === this.filterTerm) {
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
      if (self.settings.noSearch) {
        self.selectStartsWith(self.filterTerm);
        return;
      }

      this.searchKeyMode = true;
      if (!self.isOpen()) {
        self.open(filter);
        return;
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
   * @param {boolean} [noFocus] if true, does not attempt to focus the input
   * @returns {void}
   */
  activate(useSearchInput) {
    const self = this;
    let input = this.pseudoElem;

    if (useSearchInput || self.isMobile()) {
      input = this.searchInput;
    }

    if (useSearchInput && (input.hasClass('is-readonly') || input.prop('readonly') === true)) {
      return;
    }

    function selectText() {
      if (self.isMobile() || self.filterTerm) {
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
    if (env.browser.isIE10() || env.browser.isIE11()) {
      setTimeout(() => {
        input[0].focus();
      }, 0);
    } else {
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
      regex = new RegExp(`(${term})`, 'i');
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
        text += ', ';
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
    const current = this.previousActiveDescendant ?
      this.list.find(`.dropdown-option[data-val="${this.previousActiveDescendant.replace(/"/g, '/quot/')}"]`) :
      this.list.find('.is-selected');
    const self = this;
    const threshold = 10;
    let isEmpty = true;
    let pos;

    this.touchPrevented = false;

    if (current.length > 0) {
      isEmpty = true;
    }

    if (env.os.name === 'ios') {
      $('head').triggerHandler('disable-zoom');
    }

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

    // Persist the "short" input field
    const isShort = (this.element.closest('.field-short').length === 1);

    this.list.addClass(isShort ? 'dropdown-short' : '');

    this.pseudoElem
      .attr('aria-expanded', 'true')
      .addClass('is-open');

    this.pseudoElem.attr('aria-label', this.label.text());
    this.searchInput.attr('aria-activedescendant', current.children('a').attr('id'));

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

    // Limit the width
    if (this.settings.maxWidth) {
      this.list.css('max-width', `${this.settings.maxWidth}px`);
    }

    // Set the contents of the search input.
    // If we've got a stored typeahead
    if (this.filterTerm) {
      this.searchInput.val(this.filterTerm);
    } else {
      this.searchInput.val(this.pseudoElem.find('span').text().trim());
    }

    const noScroll = this.settings.multiple;
    this.highlightOption(current, noScroll);
    if (this.settings.multiple && this.listUl.find('.is-selected').length > 0) {
      this.highlightOption(this.listUl.find('.dropdown-option').eq(0));
      setTimeout(() => {
        self.listUl.scrollTop(0);
      }, 0);
    }

    if (!this.settings.multiple && !isEmpty) {
      this.searchInput.val(current.find('a').text());
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
        self.highlightOption($(this), true);
      });

    // Some list-closing events are on a timer to prevent immediate list close
    // There would be several things to check with a setTimeout, so this is done with a CSS
    // class to keep things a bit cleaner
    setTimeout(() => {
      self.list.addClass('is-closable');
    }, 100);

    // Is the jQuery Element a component of the current Dropdown list?
    function isDropdownElement(target) {
      return target.closest('.dropdown, .multiselect').length > 0 ||
        target.closest('.dropdown-list').length > 0 ||
        self.touchmove === true;
    }

    // Triggered when the user scrolls the page.
    // Ignores Scrolling on Mobile, and will not close the list if accessing an item within the list
    function scrollDocument(e) {
      const focus = $('*:focus'); // dont close on timepicker arrow down and up
      if (self.touchPrevented || isDropdownElement($(e.target)) || focus.is('.timepicker')) {
        return;
      }
      self.closeList('cancel');
    }

    // Triggered when the user clicks anywhere in the document
    // Will not close the list if the clicked target is anywhere inside the dropdown list.

    function clickDocument(e) {
      const target = $(e.target);
      if (self.touchPrevented || (isDropdownElement(target) && !target.is('.icon'))) {
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

    const modalScroll = $('.modal.is-visible .modal-body-wrapper');
    let parentScroll = self.element.closest('.scrollable').length ? self.element.closest('.scrollable') : $(document);
    parentScroll = self.element.closest('.scrollable-y').length ? self.element.closest('.scrollable-y') : parentScroll;
    parentScroll = modalScroll.length ? modalScroll : parentScroll;
    parentScroll.on('scroll.dropdown', scrollDocument);

    $('body').on('resize.dropdown', () => {
      self.position();

      // in desktop environments, close the list on viewport resize
      if (window.orientation === undefined) {
        self.closeList('cancel');
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

    if (env.os.name === 'ios') {
      $('head').triggerHandler('enable-zoom');
    }
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
      if (placementObj.wasFlipped === true) {
        self.list.addClass('is-ontop');
        self.listUl.prependTo(self.list);
      }

      // Set the <UL> height to 100% of the `.dropdown-list` minus the size of the search input
      const ulHeight = parseInt(self.listUl[0].offsetHeight, 10);
      const listHeight = parseInt(self.list[0].offsetHeight, 10);
      const searchInputHeight = $(this).hasClass('dropdown-short') ? 24 : 34;

      if (ulHeight + searchInputHeight >= listHeight) {
        self.listUl[0].style.height = `${listHeight - (searchInputHeight * 2)}px`;
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
    const useParentWidth = listDefaultWidth <= parentElementWidth;
    this.searchInput[0].style.width = '';

    // Add parent info to positionOpts
    positionOpts.parent = parentElement;
    positionOpts.useParentWidth = useParentWidth;

    // use negative height of the pseudoElem to get the Dropdown list to overlap the input.
    const isRetina = window.devicePixelRatio > 1;
    const isChrome = env.browser.name === 'chrome';

    positionOpts.y = -(parseInt(parentElement[0].clientHeight, 10) +
      parseInt(parentElementStyle.borderTopWidth, 10) +
      parseInt(parentElementStyle.borderBottomWidth, 10) - (!isChrome && isRetina ? 1 : 0));
    positionOpts.x = 0;
    if (self.settings.placementOpts && self.settings.placementOpts.x) {
      positionOpts.x = self.settings.placementOpts.x;
    }

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

    // If this is the Select All option, select/deselect all.
    if (this.settings.multiple && target[0].classList.contains('dropdown-select-all-list-item')) {
      const doSelectAll = !(target[0].classList.contains('is-selected'));
      target[0].classList[doSelectAll ? 'add' : 'remove']('is-selected');
      this.selectAll(doSelectAll);
      return true;  //eslint-disable-line
    }

    const val = target.attr('data-val').replace(/"/g, '/quot/');
    let cur = this.element.find(`option[value="${val}"]`);
    // Try matching the option's text if 'cur' comes back empty or overpopulated.
    // Supports options that don't have a 'value' attribute
    // And also some special &quote handling
    if (cur.length === 0 || cur.length > 1) {
      cur = this.element.find('option').filter(function () {
        const elem = $(this);
        const attr = elem.attr('value');
        return elem.text() === val || (attr && attr.replace(/"/g, '/quot/') === val);
      });
    }

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
    if (this.settings.showSelectAll) {
      const opts = this.element.find('option');
      const selectedOpts = opts.filter(':selected');

      if (opts.length > selectedOpts.length) {
        this.list.find('.dropdown-select-all-list-item').removeClass('is-selected');
      } else {
        this.list.find('.dropdown-select-all-list-item').addClass('is-selected');
      }
    }

    return true;  //eslint-disable-line
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

    this.searchInput.off([
      `input.${COMPONENT_NAME}`,
      `keydown.${COMPONENT_NAME}`,
    ].join(' '));

    // Destroy any tooltip items
    this.listUl.find('.has-tooltip').each(function () {
      const api = $(this).data('tooltip');
      if (api) {
        api.destroy();
      }
    });

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
        `touchmove.${COMPONENT_NAME}`,
        `touchend.${COMPONENT_NAME}`,
        `touchcancel.${COMPONENT_NAME}`].join(' '));

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
    this.activate();
    this.list = null;
    this.searchInput = null;
    this.listUl = null;
  },

  /**
  * Scroll to a particular option and make it in view.
  * @private
  * @param  {object} current The option element to scroll to.
  * @returns {void}
  */
  scrollToOption(current) {
    const self = this;
    if (!current) {
      return;
    }
    if (current.length === 0) {
      return;
    }
    // scroll to the currently selected option
    self.listUl.scrollTop(0);
    self.listUl.scrollTop(current.offset().top - self.listUl.offset().top -
      self.listUl.scrollTop() - 40);
  },

  /**
  * Blur and Close List
  * @private
  * @returns {void}
  */
  handleBlur() {
    const self = this;

    /*
    if (this.isOpen()) {
      this.timer = setTimeout(() => {
        self.closeList('cancel');
      }, 40);
    }
    */

    self.closeList('cancel');

    return true;
  },

  /*
  * Function that is used to chekc if the field is loading from an ajax call.
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
    this.toggleList();
  },

  /**
   * Toggle the current state of the list between open and closed.
   * @deprecated
   * @private
   */
  toggleList() {
    if (this.isOpen() || this.isLoading()) {
      this.closeList('cancel');
      return;
    }
    this.open();
  },

  /**
   * Highlight the option that is being typed.
   * @private
   * @param {object} listOption The option element
   * @param {boolean} noScroll If true will scroll to the option
   */
  highlightOption(listOption, noScroll) { //eslint-disable-line
    if (!listOption) {
      return;
    }

    if (listOption.length === 0) {
      listOption = this.list.find('.dropdown-option').eq(0);
    }

    if (listOption.is('.separator, .group-label')) {
      return;
    }

    // Get corresponding option from the list
    const option = this.element.find(`option[value="${listOption.attr('data-val')}"]`);

    if (option.hasClass('.is-disabled') || option.is(':disabled')) {
      return; //eslint-disable-line
    }

    if (!this.isOpen()) {
      return;
    }

    this.setItemIconOverColor();
    this.list.find('.is-focused').removeClass('is-focused').attr({ tabindex: '-1' });
    if (!option.hasClass('clear')) {
      this.setItemIconOverColor(listOption);
      listOption.addClass('is-focused').attr({ tabindex: '0' });
    }

    // Set activedescendent for new option
    // this.pseudoElem.attr('aria-activedescendant', listOption.attr('id'));
    this.searchInput.attr('aria-activedescendant', listOption.children('a').attr('id'));

    if (!noScroll || noScroll === false || noScroll === undefined) {
      this.scrollToOption(listOption);
    }
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
    listOptions.removeClass('is-focused').attr({ tabindex: '-1' });

    this.searchInput.removeAttr('aria-activedescendant');

    if (!noScroll || noScroll === false || noScroll === undefined) {
      this.scrollToOption(listOptions.first());
    }
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
    const options = [].slice.call(this.element[0].querySelectorAll(selector.options));
    const items = [].slice.call(this.listUl[0].querySelectorAll(selector.items));
    const last = options[options.length - 1];
    let text = '';

    if (doSelectAll) {
      // Select all
      items.forEach(node => node.classList.add('is-selected'));
      options.forEach((node) => {
        node.selected = true;
        node.setAttribute('selected', true);
      });

      text = this.getOptionText($(options));
      const maxlength = this.element[0].getAttribute('maxlength');
      if (maxlength) {
        text = text.substr(0, maxlength);
      }
    } else {
      // Clear all
      items.forEach(node => node.classList.remove('is-selected'));
      options.forEach((node) => {
        node.selected = false;
        node.setAttribute('selected', true);
      });
    }
    this.previousActiveDescendant = last.value || '';

    this.pseudoElem[0].querySelector('span').textContent = text;
    this.searchInput[0].value = text;
    this.updateItemIcon(last);

    if (this.list[0].classList.contains('search-mode')) {
      this.resetList();
    }
    this.activate(true);
    this.setBadge(last);

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
   * fire on the list item.
   */
  selectOption(option, noTrigger) {
    if (!option || !option.length) {
      return;
    }
    let li;

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
    }

    let value = option.val();
    if (!option) {
      return;
    }

    if (!li && typeof value === 'string') {
      value = value.replace(/"/g, '/quot/');
      li = this.listUl.find(`li[data-val="${value}"]`);
    }

    if (option.hasClass('is-disabled') || option.is(':disabled')) {
      return;
    }

    const optionVal = option.val();
    let val = this.element.val();
    let text = '';
    let trimmed = '';
    let clearSelection = false;

    if (this.settings.reload === 'typeahead') {
      val = this.selectedValues || [];
    }

    // Sets to false if the option is being removed from a multi-select instead of added
    let isAdded = true;

    if (option.hasClass('clear') || !li) {
      clearSelection = true;
    }

    if (this.settings.multiple) {
      // Working with a select multiple allows for the "de-selection" of items in the list
      if (!val) {
        val = [];
      }
      if ($.inArray(optionVal, val) !== -1) {
        val = $.grep(val, optionValue => optionValue !== optionVal);
        li.removeClass('is-selected');
        this.previousActiveDescendant = undefined;
        isAdded = false;
      } else {
        if (!isNaN(this.settings.maxSelected) &&  //eslint-disable-line
          this.element.find('option:selected').length >= this.settings.maxSelected) {
          return;
        }

        val = typeof val === 'string' ? [val] : val;
        val.push(optionVal);
        li.addClass('is-selected');
        this.previousActiveDescendant = option.val();
      }

      const newOptions = this.element.find('option').filter(function () {
        return $.inArray($(this)[0].value, val) !== -1;
      });
      text = this.getOptionText(newOptions);
    } else {
      // Working with a single select
      val = optionVal;
      this.listUl.find('li.is-selected').removeClass('is-selected');
      if (!clearSelection) {
        li.addClass('is-selected');
      }
      this.previousActiveDescendant = option.val();
      text = option.text();
    }

    if (!clearSelection) {
      this.element.find('option').each(function () {  //eslint-disable-line
        if (this.value === optionVal) {
          $(this).prop('selected', true);
          return false;
        }
      });
    }

    // Change the values of both inputs and swap out the active descendant
    if (!clearSelection) {
      this.pseudoElem.find('span').text(text);
      this.searchInput.val(text);
    } else {
      this.pseudoElem.find('span').text('');
      this.searchInput.val('');
    }

    if (this.element.attr('maxlength')) {
      trimmed = text.substr(0, this.element.attr('maxlength'));
      this.pseudoElem.find('span').text(trimmed);
      this.searchInput.val(trimmed);
    }

    // Set the new value on the <select>
    this.selectedValues = val;
    this.element.val(val);
    this.updateItemIcon(option);

    /**
    * Fires after the value in the input is changed by any means.
    * @event change
    * @memberof Dropdown
    * @property {object} event The jquery event object
    */
    if (!noTrigger) {
      // Fire the change event with the new value if the noTrigger flag isn't set
      this.element.trigger('change').triggerHandler('selected', [option, isAdded]);

      if (this.pseudoElem.find('span').width() >= this.pseudoElem.width()) {
        this.setTooltip();
      } else if (this.tooltipApi) {
        this.tooltipApi.destroy();
      }
    }

    /**
    * Fires after the value in the input is changed by user interaction.
    * @event input
    * @memberof Dropdown
    * @property {object} event The jquery event object
    */

    // If multiselect, reset the menu to the unfiltered mode
    if (this.settings.multiple) {
      if (this.list.hasClass('search-mode')) {
        this.resetList();
      }
      this.activate(true);
    }

    this.setBadge(option);
  },

  /**
   * Select an option by the value.
   * @param {string} value - A string containing the value to look for. (Case insensitive)
   */
  selectValue(value) {
    if (typeof value !== 'string') {
      return;
    }

    const option = this.element.find(`option[value="${value}"]`);
    if (!option || !option.length) {
      return;
    }

    this.element.find('option:selected').prop('selected', false);
    option.prop('selected', true);
    this.updated();
  },

  /**
   * Select the next item that starts with a given character (text of the option).
   * @param {string} char - The starting letter to match for. (Case insensitive)
   */
  selectStartsWith(char) {
    if (typeof char !== 'string') {
      return;
    }

    const elem = this.element[0];
    this.filterTerm = '';

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

    elem.selectedIndex = newIdx;
    this.updated();
    this.element.trigger('change');
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

        if (isString) {
          option = {
            value: stringContent
          };
        }

        if (option.value !== undefined) {
          option.value = replaceDoubleQuotes(option.value);
          textContent = option.label;
        }

        if (option.id !== undefined) {
          if (!isNaN(option.id)) {  //eslint-disable-line
            option.id = `${option.id}`;
          }
          option.id = replaceDoubleQuotes(option.id);
          id = ` id="${option.id}"`;
        }

        if (option.label !== undefined) {
          option.label = replaceDoubleQuotes(option.label);
          textContent = option.label;
        }

        const selectedValues = (self.selectedValues && self.selectedValues.indexOf(val) > -1);
        if (option.value === val || selectedValues) {
          option.selected = true;
          selected = ' selected';
        }

        // Render the option element
        list += `<option${id} value="${option.value}"${selected}>
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
        self.updateList(searchTerm);
      }

      self.element.triggerHandler('complete'); // For Busy Indicator
      self.element.trigger('requestend', [searchTerm, data]);

      if (typeof callback !== 'function') {
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
    } else if (typeof attr === 'string') {
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
   * External Facing function to set value by code - Depricated set on select and trigger updated.
   * @private
   * @deprecated
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
   * Disable the input element.
   */
  disable() {
    this.element
      .prop('disabled', true)
      .prop('readonly', false);

    if (this.pseudoElem.is($(document.activeElement))) {
      this.pseudoElem.blur();
    }

    this.pseudoElem
      .addClass('is-disabled')
      .removeClass('is-readonly')
      .attr('tabindex', '-1')
      .prop('readonly', false)
      .prop('disabled', true);
    this.closeList('cancel');
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
      .removeClass('is-readonly');
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
      .attr('tabindex', '0')
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
    }

    // update "disabled" prop
    this.pseudoElem[this.element.prop('disabled') ? 'addClass' : 'removeClass']('is-disabled');

    // update the list and set a new value, if applicable
    this.updateList();
    this.setDisplayedValues();

    this.element.trigger('has-updated');

    return this;
  },

  /**
   * Tear down events and restore to original state.
   */
  destroy() {
    if (this.selectedValues) {
      delete this.selectedValues;
    }

    $.removeData(this.element[0], COMPONENT_NAME);
    this.closeList('cancel');
    this.label.remove();
    this.pseudoElem.off().remove();
    this.icon.remove();
    this.wrapper.remove();
    this.listfilter.destroy();
    this.element.removeAttr('style');

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

    this.pseudoElem
      .on('keydown.dropdown', e => this.handlePseudoElemKeydown(e))
      .on('click.dropdown', (e) => {
        // landmark would like the click event to bubble up if ctrl and shift are pressed
        if (!(e.originalEvent.ctrlKey && e.originalEvent.shiftKey)) {
          e.stopPropagation();
        }
      }).on('mouseup.dropdown', (e) => {
        if (e.button === 2) {
          return;
        }
        self.toggleList();
      })
      .on('touchend.dropdown touchcancel.dropdown', (e) => {
        e.stopPropagation();
        self.toggleList();
        e.preventDefault();
      });

    self.element.on('activated.dropdown', () => {
      self.label.trigger('click');
    }).on('updated.dropdown', (e) => {
      e.stopPropagation();
      self.updated();
    }).on('openlist.dropdown', () => {
      self.toggleList();
    });

    // for form resets.
    self.element.closest('form').on('reset.dropdown', () => {
      setTimeout(() => {
        self.element.triggerHandler('updated');
      }, 1);
    });

    // Handle Label click
    this.label.on('click', () => {
      self.pseudoElem.focus();
    });
  }
};

export { Dropdown, COMPONENT_NAME };
