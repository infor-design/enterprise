/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  $.fn.dropdown = function(options) {

    'use strict';

    // Dropdown Settings and Options
    var pluginName = 'dropdown',
        defaults = {
          closeOnSelect: true, // When an option is selected, the list will close if set to "true".  List stays open if "false".
          cssClass: null,  //Append a css class to dropdown-list
          filterMode: 'contains',  // startsWith and contains Supported - false will not client side filter
          maxSelected: undefined, //If in multiple mode, sets a limit on the number of items that can be selected
          moveSelectedToTop: false, //When the menu is opened, displays all selected options at the top of the list
          multiple: false, //Turns the dropdown into a multiple selection box
          noSearch: false, //If true, disables the ability of the user to enter text in the Search Input field in the open combo box
          source: undefined, //A function that can do an ajax call.
          sourceArguments: {}, // If a source method is defined, this flexible object can be passed into the source method, and augmented with parameters specific to the implementation.
          reloadSourceOnOpen: false, // If set to true, will always perform an ajax call whenever the list is opened.  If false, the first AJAX call's results are cached.
          empty: false, //Initialize Empty Value
          delay: 300 //Typing Buffer Delay
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function Dropdown(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Actual DropDown Code
    Dropdown.prototype = {
      init: function() {
        var orgId = this.element.attr('id');

        this.isIe10 = (Soho.env.browser.name === 'ie' && Soho.env.browser.version === '10');
        this.isIe11 = (Soho.env.browser.name === 'ie' && Soho.env.browser.version === '11');

        this.inlineLabel = this.element.closest('label');
        this.inlineLabelText = this.inlineLabel.find('.label-text');
        this.isInlineLabel = this.element.parent().is('.inline');

        if (orgId === undefined) {
          orgId = this.element.uniqueId('dropdown');
          this.element.attr('id', orgId);
          this.element.parent().find('label').first().attr('for', orgId);
        }

        // convert <select> tag's size css classes for the pseudo element
        var elemClassList = this.element[0].classList;
        var pseudoClassString = elemClassList.contains('dropdown-xs') ? 'dropdown input-xs' :
            elemClassList.contains('dropdown-sm') ? 'dropdown input-sm' :
            elemClassList.contains('dropdown-lg') ? 'dropdown input-lg' : 'dropdown';

        //Detect Inline Styles
        var style = this.element.attr('style');
        this.isHidden = style && style.indexOf('display: none') > 0;

        // Build the wrapper if it doesn't exist
        var baseElement = this.isInlineLabel ? this.inlineLabel : this.element;
        this.wrapper = baseElement.next('.dropdown-wrapper');
        if (!this.wrapper.length) {
          this.wrapper = $('<div class="dropdown-wrapper"></div>').insertAfter(baseElement);
        }

        // Build sub-elements if they don't exist
        this.label = $('label[for="'+ orgId +'"]');

        this.pseudoElem = $('div#'+ orgId + '-shdo');
        if (!this.pseudoElem.length) {
          this.pseudoElem = $('<div class="'+ pseudoClassString + '"' +
            ' role="combobox"' +
            ' aria-autocomplete="list"' +
            ' aria-controls="dropdown-list"' +
            ' aria-readonly="true"' +
            ' aria-expanded="false"' +
            ' aria-label="'+ this.label.text() + '"' +
          '>');
        } else {
          this.pseudoElem[0].setAttribute('class', pseudoClassString);
        }

        this.pseudoElem.append($('<span></span>'));

        // Pass disabled/readonly from the original element, if applicable
        // "disabled" is a stronger setting than "readonly" - should take precedent.
        function handleStates(self) {
          var disabled = self.element.prop('disabled'),
            readonly = self.element.prop('readonly');

          if (disabled) {
            return self.disable();
          }

          if (readonly) {
            return self.readonly();
          }

          return self.enable();
        }
        handleStates(this);

        this.wrapper.append(this.pseudoElem, this.trigger);

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
        var dataSource = this.element.attr('data-source');
        if (dataSource && dataSource !== 'source') {
          this.settings.source = dataSource;
        }
        var dataMaxselected = this.element.attr('data-maxselected');
        if (dataMaxselected && !isNaN(dataMaxselected)) {
          this.settings.maxSelected = parseInt(dataMaxselected, 10);
        }
        var dataMoveSelected = this.element.attr('data-move-selected');
        if (dataMoveSelected && !this.settings.moveSelectedToTop) {
          this.settings.moveSelectedToTop = dataMoveSelected === 'true';
        }
        var dataCloseOnSelect = this.element.attr('data-close-on-select');
        if (dataCloseOnSelect && !this.settings.closeOnSelect) {
          this.settings.closeOnSelect = dataCloseOnSelect === 'true';
        }
        var dataNoSearch = this.element.attr('data-no-search');
        if (dataNoSearch && !this.settings.noSearch) {
          this.settings.noSearch = dataNoSearch === 'true';
        }

        // Persist sizing defintions
        var sizingStrings = ['-xs', '-sm', '-md', '-lg'],
          classString = this.element.attr('class'),
          s;

        for (var i = 0; i < sizingStrings.length; i++) {
          s = sizingStrings[i];
          if (classString.match(s)) {
            this.pseudoElem.addClass('dropdown' + s);
          }
        }

        // Cached dataset (from AJAX, if applicable)
        this.dataset = [];

        this.listfilter = new ListFilter({
          filterMode: this.settings.filterMode
        });

        this.setValue();
        this.setInitial();
        this.setWidth();

        this.element.triggerHandler('rendered');

        return this.handleEvents();
      },

      // Used for preventing menus from popping open/closed when they shouldn't.
      // Gets around the need for timeouts everywhere
      inputTimer: function() {
        if (this.inputTimeout) {
          return false;
        }

        var self = this;

        this.inputTimeout = setTimeout(function inputTimeout(){
          clearTimeout(self.inputTimeout);
          self.inputTimeout = null;
        }, 100);

        return true;
      },

      // Set Field Width
      setWidth: function() {
        var style = this.element[0].style;

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

      // Keep a generated list of items and update as needed
      updateList: function() {
        var self = this,
          isMobile = self.isMobile(),
          listExists = self.list !== undefined && self.list !== null && self.list.length > 0,
          listContents = '',
          ulContents = '',
          upTopOpts = 0,
          hasOptGroups = this.element.find('optgroup').length;

        if (!listExists) {
          listContents = '<div class="dropdown-list' +
            (isMobile ? ' mobile' : '') +
            (this.settings.multiple ? ' multiple' : '') + '" id="dropdown-list" role="application" ' + (this.settings.multiple ? 'aria-multiselectable="true"' : '') + '>' +
            '<label for="dropdown-search" class="audible">' + Locale.translate('Search') + '</label>' +
            '<input type="text" class="dropdown-search" role="combobox" aria-expanded="true" id="dropdown-search" aria-autocomplete="list">' +
            '<span class="trigger">' +
              (isMobile ? $.createIcon({ icon: 'close', classes: ['close'] }) : $.createIcon('dropdown')) +
              '<span class="audible">' + (isMobile ? Locale.translate('Close') : Locale.translate('Collapse')) + '</span>' +
            '</span>' +
            '<ul role="listbox">';
        }

        // Get a current list of <option> elements
        // If none are available, simply return out
        var opts = this.element.find('option');
        var groups = this.element.find('optgroup');
        var selectedOpts = opts.filter(':selected');

        function buildLiHeader(textContent) {
          return '<li role="presentation" class="group-label" focusable="false">' +
              textContent +
            '</li>';
        }

        function buildLiOption(option, index) {
          var liMarkup = '',
            attributes = Soho.DOM.getAttributes(option),
            text = option.innerHTML,
            value = attributes.getNamedItem('value'),
            title = attributes.getNamedItem('title'),
            badge = attributes.getNamedItem('data-badge'),
            badgeColor = attributes.getNamedItem('data-badge-color'),
            isSelected = option.selected,
            isDisabled = option.disabled,
            cssClasses = option.className;

          var trueValue = value && value.value ? value.value : text;
          if (trueValue === 'clear_selection') {
            if (text === '') {
              text = Locale.translate('ClearSelection');
            }
          }
          liMarkup += '<li role="presentation" class="dropdown-option'+ (isSelected ? ' is-selected' : '') +
                        (isDisabled ? ' is-disabled' : '') +
                        (cssClasses ? ' ' + cssClasses.value : '' ) + '"' +
                        ' data-val="' + trueValue.replace('"', '/quot/') + '"' +
                        ' tabindex="' + (index && index === 0 ? 0 : -1) + '">' +
                        (title ? '" title="' + title.value + '"' : '') +
                        '<a role="option" href="#" class="' +
                        (trueValue === 'clear_selection' ? ' clear-selection' : '' ) + '"' +
                        'id="list-option'+ index +'">' +
                          text +
                        '</a>' +
                        (badge ? '<span class="badge "' + (badgeColor ? badgeColor.value : 'azure07') + '"> '+ badge.value + '</span>' : '') +
                      '</li>';

          return liMarkup;
        }



        // Move all selected options to the top of the list if the setting is true.
        // Also adds a group heading if other option groups are found in the <select> element.
        if (self.settings.moveSelectedToTop) {
          opts = opts.not(selectedOpts);

          // Show a "selected" header if there are selected options
          if (selectedOpts.length > 0) {
            ulContents += buildLiHeader(Locale.translate('Selected') + ' ' + (self.isInlineLabel ? self.inlineLabelText.text() : this.label.text()));
          }

          selectedOpts.each(function(i) {
            ulContents += buildLiOption(this, i);
            upTopOpts++;
          });

          // Only show the "all" header beneath the selected options if there are no other optgroups present
          if (!hasOptGroups) {
            ulContents += buildLiHeader('All ' + (self.isInlineLabel ? self.inlineLabelText.text() : this.label.text()));
          }
        }

        opts.each(function(i) {
          var count = i + upTopOpts,
            option = $(this),
            parent = option.parent();

          // Add Group Header if this is an <optgroup>
          // Remove the group header from the queue.
          if (parent.is('optgroup') && groups.index(parent) > -1) {
            groups = groups.not(parent);
            ulContents += buildLiHeader('' + parent.attr('label'));
          }

          if (self.settings.moveSelectedToTop && option.is(':selected')) {
            return;
          }

          ulContents += buildLiOption(this, count);
        });

        // Render the new list contents to the page.
        // Build the entire thing and set references if this is the first opening.
        // Otherwise, simply replace the elements inside the <ul>.
        if (!listExists) {
          listContents += ulContents + '</ul>' +
            '</div>';

          // Append markup to the DOM
          this.list = $(listContents);

          // Get references
          this.listUl = this.list.find('ul');
          this.searchInput = this.list.find('#dropdown-search');
        } else {
          this.listUl.html(ulContents);
        }
      },

      // Set the value based on selected options
      setValue: function () {
        var opts = this.element.find('option:selected'),
          text = this.getOptionText(opts);
          if (opts.attr('value') === 'clear_selection') {
            text = '';
          }
        if (this.settings.empty && opts.length === 0) {
          this.pseudoElem.find('span').text('');
          return;
        }

        //Set initial values for the edit box
        this.setPseudoElemDisplayText(text);
        if (this.element.attr('maxlength')) {
           this.setPseudoElemDisplayText(text.substr(0, this.element.attr('maxlength')));
        }

        //Set the "previousActiveDescendant" to the first of the items
        this.previousActiveDescendant = opts.first().val();

        this.setBadge(opts);
      },

      // Sets only the display text of the Dropdown/Mutliselect
      // Can be used for setting a pre-populated value when working with an AJAX call.
      setPseudoElemDisplayText: function(text) {
        this.pseudoElem.find('span').text(text);
      },

      copyClass: function(from, to, prop) {
        if (from.hasClass(prop)) {
          to.addClass(prop);
        }
      },

      // Copy initial stuff from the drop down.
      setInitial: function() {

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

        //TODO: Empty Selection
        if (this.element.attr('placeholder')) {
          this.pseudoElem.attr('placeholder', this.element.attr('placeholder'));
          this.element.removeAttr('placeholder');
        }
      },

      //Bind mouse and key events
      handleEvents: function() {
        var self = this;

        this.pseudoElem.on('keydown.dropdown', function(e) {
          self.ignoreKeys($(this), e);
          self.handleKeyDown($(this), e);
        }).on('keypress.dropdown', function(e) {
          self.ignoreKeys($(this), e);
          self.toggleList();
          self.handleAutoComplete(e);
        }).on('click.dropdown', function(e) {
          e.stopPropagation();
        }).on('mouseup.dropdown', function(e) {
          if (e.button === 2) {
            return;
          }

          self.toggleList();
        }).on('touchend.dropdown touchcancel.dropdown', function(e) {
          e.stopPropagation();
          self.toggleList();
          e.preventDefault();
        });

        self.element.on('activated.dropdown', function () {
          self.label.trigger('click');
        }).on('updated.dropdown', function (e) {
          e.stopPropagation();
          self.updated();
        }).on('openlist.dropdown', function() {
          self.toggleList();
        });

        //for form resets.
        self.element.closest('form').on('reset.dropdown', function() {
          setTimeout(function () {
            self.element.triggerHandler('updated');
          }, 1);
        });

        //Handle Label click
        this.label.onTouchClick().on('click', function () {
          self.pseudoElem.focus();
        });

      },

      ignoreKeys: function (input, e) {
        var charCode = e.which;

        //Needed for browsers that use keypress events to manipulate the window.
        if (e.altKey && (charCode === 38 || charCode === 40)) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }

        if (charCode === 8 && input.hasClass('dropdown')) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }

        if (input.is(':disabled') || input.hasClass('is-readonly')) {
          return;
        }

        return true;
      },

      //handle events while search is focus'd
      handleSearchEvents: function () {
        var self = this, timer;

        if (this.settings.noSearch) {
          this.searchInput.prop('readonly', true);
        }

        // Used to determine how spacebar should function.  False means space will select/deselect.  True means
        // Space will add a space inside the search input.
        this.searchKeyMode = false;

        this.searchInput.on('keydown.dropdown', function(e) {
          var searchInput = $(this);

          if (!self.ignoreKeys(searchInput, e)) {
            return;
          }

          if (!self.handleKeyDown(searchInput, e)) {
            return;
          }

          if (self.settings.noSearch === false && !self.settings.source) {
            clearTimeout(timer);
            timer = setTimeout(function () {
              if (searchInput.val() === '') {
                self.resetList();
              } else {
                self.filterList(searchInput.val().toLowerCase());
              }
            }, 100);
          }
        }).on('keypress.dropdown', function (e) {
          self.isFiltering = true;
          self.handleAutoComplete(e);
        });

      },

      filterList: function(term) {
        var self = this,
          selected = false,
          list = $('li.dropdown-option', this.listUl),
          results;

        if (!list.length || !this.list || this.list && !this.list.length) {
          return;
        }

        if (!term) {
          term = '';
        }

        if (term && term.length) {
          results = this.listfilter.filter(list, term);
        }

        this.list.addClass('search-mode');
        this.list.find('.icon').attr('class', 'icon search').changeIcon('search');
        this.searchInput.removeAttr('aria-activedescendant');

        this.unhighlightOptions();

        if (!results || !results.length && !term) {
          this.resetList();
          return;
        }

        list.not(results).addClass('hidden');
        list.filter(results).each(function(i) {
          var li = $(this);
          li.attr('tabindex', i === 0 ? '0' : '-1');

          if (!selected) {
            self.highlightOption(li);
            selected = true;
          }

          //Highlight Term
          var exp = new RegExp('(' + term + ')', 'i');
          var text = li.text().replace(exp, '<i>$1</i>');
          li.removeClass('hidden').children('a').html(text);
        });

        term = '';
        this.position();
      },

      // Removes filtering from an open Dropdown list and turns off "search mode"
      resetList: function() {
        if (!this.list || this.list && !this.list.length) {
          return;
        }
        var isMobile = this.isMobile(),
          cssClass = 'icon' + (isMobile ? ' close' : ''),
          icon = $.getBaseURL(isMobile ? 'close' : 'dropdown');

        this.list.removeClass('search-mode');
        this.list.find('.icon').attr('class', cssClass) // needs to be 'attr' here because .addClass() doesn't work with SVG
          .changeIcon(icon);

        function stripHtml(obj) {
          if (!obj[0]) {
            return '';
          }

          return obj[0].textContent || obj[0].innerText;
        }

        var lis = this.listUl.find('li');
        lis.removeAttr('style').each(function() {
          var a = $(this).children('a');
          a.text(stripHtml(a));
        });

        //Adjust height / top position
        if (this.list.hasClass('is-ontop')) {
          this.list[0].style.top = (this.pseudoElem.offset().top - this.list.height() + this.pseudoElem.outerHeight() - 2) +'px';
        }

        if (this.settings.multiple) {
          this.updateList();
        }
      },

      selectBlank: function() {
        var blank = this.element.find('option').filter(function() {
          return !this.value || $.trim(this.value).length === 0;
        });

        if (blank.length > 0) {
          blank[0].selected = true;
          this.element.triggerHandler('updated').triggerHandler('change');
        }

      },

      handleKeyDown: function(input, e) {
        var selectedIndex = this.element[0].selectedIndex,
            options = this.element[0].options,
            key = e.which,
            self = this,
            excludes = 'li:visible:not(.separator):not(.group-label):not(.is-disabled)',
            next;

        if (this.isLoading()) {
          return;
        }

        //Down arrow, Up arrow, or Spacebar to open
        if (!self.isOpen() && (key === 38 || key === 40 || key === 32)) {
          self.toggleList();
          return;
        }

        if (self.isOpen()) {
          options = this.listUl.find(excludes);
          selectedIndex = -1;
          $(options).each(function(index) {
            if ($(this).is('.is-focused')) {
              selectedIndex = index;
            }
          });
        }

        switch (key) {
          case 37: //backspace
          case 8: //del & backspace
          case 46: { //del

            if (!self.isOpen()) {
              self.selectBlank();
              // Prevent Backspace from returning to the previous page.
              e.stopPropagation();
              e.preventDefault();
              return false;
            }
            break;
          }
          case 9: {  //tab - save the current selection
            // If "search mode" is currently off, Tab should turn this mode on and place focus back
            // into the SearchInput.  If search mode is on, Tab should 'select' the currently highlighted
            // option in the list, update the SearchInput and close the list.
            if (self.isOpen()) {
              self.selectOption($(options[selectedIndex])); // store the current selection
              self.closeList('tab');
              this.activate();
            }
            // allow tab to propagate otherwise
            return true;
          }
          case 27: { //Esc - Close the Combo and Do not change value
            if (self.isOpen()) {
              // Close the option list
              self.closeList('cancel');
              self.activate();
              e.stopPropagation();
              return false;
            }
            // Allow Esc to propagate if the menu was closed, since some other Controls
            // that rely on dropdown may need to trigger routines when the Esc key is pressed.
            break;
          }
          case 32: // spacebar // TODO: Figure Out what to do about using Spacebar.
          case 13: { //enter
            if (self.isOpen()) {
              if (key === 32 && self.searchKeyMode === true) {
                break;
              }

              e.preventDefault();
              self.selectOption($(options[selectedIndex])); // store the current selection
              if (self.settings.closeOnSelect) {
                self.closeList('select');  // Close the option list
                self.activate();
              }
            }
            e.stopPropagation();
            return false;
          }
          case 38: {  //up
            if (e.shiftKey) {
              return;
            }
            this.searchKeyMode = false;

            if (selectedIndex > 0) {
              next = $(options[selectedIndex - 1]);
              this.highlightOption(next);
              // NOTE: Do not also remove the ".is-selected" class here!  It's not the same as ".is-focused"!
              // Talk to ed.coyle@infor.com if you need to know why.
              next.parent().find
              ('.is-focused').removeClass('is-focused');
              next.addClass('is-focused');
            }

            e.stopPropagation();
            e.preventDefault();
            return false;
          }
          case 40: {  //down
            if (e.shiftKey) {
              return;
            }
            this.searchKeyMode = false;

            if (selectedIndex < options.length - 1) {
              next = $(options[selectedIndex + 1]);
              this.highlightOption(next);
              // NOTE: Do not also remove the ".is-selected" class here!  It's not the same as ".is-focused"!
              // Talk to ed.coyle@infor.com if you need to know why.
              next.parent().find('.is-focused').removeClass('is-focused');
              next.addClass('is-focused');
            }

            e.stopPropagation();
            e.preventDefault();
            return false;
          }
          case 35: { //end
            this.searchKeyMode = false;

            var last = $(options[options.length - 1]);
            this.highlightOption(last);

            e.stopPropagation();
            return false;
          }
          case 36: {  //home
            this.searchKeyMode = false;

            var first = $(options[0]);
            this.highlightOption(first);

            e.stopPropagation();
            return false;
          }
        }

        if (self.isOpen() && self.isControl(key) && key !== 8) {
          return false;
        }

        var isSearchInput = self.searchInput && self.searchInput.length;

        self.initialFilter = false;

        if (!self.isOpen() && !self.isControl(key) && !this.settings.source) {
          //Make this into Auto Complete
          self.initialFilter = true;
          self.isFiltering = true;
          self.filterTerm = $.actualChar(e);
          if (isSearchInput) {
            self.searchInput.val($.actualChar(e));
          }
          self.toggleList();
        }

        this.searchKeyMode = true;
        if (self.searchInput) {
          self.searchInput.attr('aria-activedescendant', '');
        }
        return true;
      },

      timer: null,
      filterTerm: '',

      handleAutoComplete: function(e) {
        if (this.isLoading()) {
          return;
        }

        var self = this;
        clearTimeout(this.timer);

        if (!self.settings.source) {
          return;
        }

        self.initialFilter = true;
        self.filterTerm += $.actualChar(e);

        this.timer = setTimeout(function () {
          if (!self.isOpen()) {
            self.searchInput.val(self.filterTerm);
            self.toggleList();
          } else {
            self.filterList(self.searchInput.val().toLowerCase());
          }
        }, self.settings.delay);
      },

      isControl: function(keycode) {
        var valid =
          (keycode > 7 && keycode < 48)   || // control chars
          (keycode > 90 && keycode < 94)   || // windows keys
          (keycode > 111 && keycode < 146);  // function keys

          return valid;
      },

      // Focus the Element
      activate: function (useSearchInput) {
        var self = this,
          input = this.pseudoElem;

        if (useSearchInput || self.isMobile()) {
          input = this.searchInput;
        }

        if (useSearchInput && (input.hasClass('is-readonly') || input.prop('readonly') === true)) {
          return;
        }

        function selectText() {
          if (self.isMobile()) {
            return;
          }

          if (input[0].setSelectionRange) {
            input[0].setSelectionRange(0, input[0].value.length);  //scroll to left
          } else {
            if (input[0].tagName === 'INPUT') { // using Search Input instead of Pseudo Div
              input[0].select();
            }
          }
        }

        selectText();

        if (document.activeElement !== input[0] &&
          $(document.activeElement).is('body, .dropdown.is-open')) {
          input[0].focus();
        }

        if ((self.isIe10 || self.isIe11) && input.closest('.time-parts').length) {
          setTimeout(function() {
            input[0].focus();
          }, 0);
        }
      },

      // Retrieves a string containing all text for currently selected options delimited by commas
      getOptionText: function(opts) {
        var text = '';

        if (!opts) {
          opts = this.element.find('option:selected');
        }

        opts.each(function() {
          if (text.length > 0) {
            text += ', ';
          }
          text += $(this).text();
        });

        return text;
      },

      // Prep for opening list,make ajax call ect...
      open: function() {
        var self = this;

        if (!this.inputTimer()) {
          return;
        }

        if (this.element.is(':disabled') || this.pseudoElem.hasClass('is-disabled') || this.pseudoElem.hasClass('is-readonly')) {
          return;
        }

        if (!self.callSource(function () {
          self.updateList();
          self.openList();
        })) {
          self.updateList();
          this.openList();
        }
      },

      // Actually Show The List
      openList: function () {
        var current = this.previousActiveDescendant ? this.list.find('.dropdown-option[data-val="'+ this.previousActiveDescendant.replace('"', '/quot/') +'"]') : this.list.find('.is-selected'),
          self =  this,
          touchPrevented = false,
          threshold = 10,
          isEmpty = true,
          pos;

        if (current.length > 0) {
          isEmpty = true;
        }

        if (Soho.env.os.name === 'ios') {
          $('head').triggerHandler('disable-zoom');
        }

        // Persist the "short" input field
        var isShort = (this.element.closest('.field-short').length === 1);

        this.pseudoElem
          .attr('aria-expanded', 'true')
          .addClass('is-open');

        this.pseudoElem.attr('aria-label', this.label.text());
        this.searchInput.attr('aria-activedescendant', current.children('a').attr('id'));

        //Close any other drop downs.
        $('select').each(function () {
          var data = $(this).data();
          if (data.dropdown) {
            data.dropdown.closeList('cancel');
          }
        });

        this.list.appendTo('body').show();

        //In a grid cell
        this.isInGrid = this.pseudoElem.closest('.datagrid-row').length === 1;

        if (this.isInGrid) {
          var rowHeight = this.pseudoElem.closest('.datagrid').attr('class').replace('datagrid', '');
          this.list.addClass('datagrid-dropdown-list ' + rowHeight);
        }

        if (this.pseudoElem.closest('.datagrid-filter-wrapper').length === 1) {
          this.list.addClass('datagrid-filter-dropdown');
        }

        var cssClass = this.settings.cssClass;
        if (cssClass && typeof cssClass === 'string') {
          this.list.addClass(cssClass);
        }

        this.position();

        if (!this.settings.multiple && this.initialFilter) {
          setTimeout(function () {
            self.searchInput.val(self.filterTerm);
            self.filterList(self.searchInput.val());
          }, 0);
          this.initialFilter = false;
        } else {
          // Change the values of both inputs and swap out the active descendant
          this.searchInput.val(this.pseudoElem.text());
        }

        var noScroll = this.settings.multiple;
        this.highlightOption(current, noScroll);
        if (this.settings.multiple && this.listUl.find('.is-selected').length > 0) {
          this.highlightOption(this.listUl.find('.dropdown-option').eq(0));
          setTimeout(function() {
            self.listUl.scrollTop(0);
          }, 0);
        }

        if (!this.settings.multiple && !isEmpty) {
          this.searchInput.val(current.find('a').text());
        }

        this.handleSearchEvents();
        this.activate(true); // Focus the Search Input
        this.element.trigger('listopened');

        if (this.isMobile()) {
          // iOS-specific keypress event that listens for when you click the "done" button
          self.searchInput.on('keypress.dropdown', function(e) {
            if (e.which === 13) {
              self.closeList('select');
            }
          });
        }

        function listItemClickHandler(e) {
          var target = $(e.target),
            ddOption = target.closest('li');

          if (ddOption.length) {
            if (ddOption.is('.separator, .group-label')) {
              return;
            }

            target = ddOption;
          }

          e.preventDefault();
          e.stopPropagation();

          var val = target.attr('data-val').replace('"','/quot/'),
            cur = self.element.find('option[value="'+ val +'"]');
          //Try matching the option's text if 'cur' comes back empty or overpopulated.
          //Supports options that don't have a 'value' attribute
          //And also some special &quote handling
          if (cur.length === 0 || cur.length > 1) {
            cur = self.element.find('option').filter(function() {
              var elem = $(this),
                attr = elem.attr('value');
              return elem.text() === val || (attr && attr.replace('"','/quot/') === val);
            });
          }

          //Select the clicked item
          if (cur.is(':disabled')) {
            return false;
          }

          self.selectOption(cur);

          if (self.settings.closeOnSelect) {
            self.closeList('select');
          }

          if (self.isMobile()) {
            return true;
          }

          self.activate(!self.settings.closeOnSelect);
          return true;
        }

        self.list
          .removeClass('dropdown-tall')
          .addClass(isShort ? 'dropdown-short' : '')
          .onTouchClick('list', 'li')
          .on('click.list', 'li', listItemClickHandler)
          .on('mouseenter.list', 'li', function() {
            var target = $(this);

            if (target.is('.separator, .group-label')) {
              return;
            }
          });

        // Some list-closing events are on a timer to prevent immediate list close
        // There would be several things to check with a setTimeout, so this is done with a CSS
        // class to keep things a bit cleaner
        setTimeout(function delayedListCloseEvents() {
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
          if (touchPrevented || isDropdownElement($(e.target))) {
            return;
          }
          self.closeList('cancel');
        }

        // Triggered when the user clicks anywhere in the document
        // Will not close the list if the clicked target is anywhere inside the dropdown list.

        function clickDocument(e) {
          var target = $(e.target);
          if (touchPrevented || (isDropdownElement(target) && !target.is('.icon'))) {
            e.preventDefault();

            touchPrevented = false;
            return;
          }

          self.closeList('cancel');
        }

        function touchStartCallback(e) {
          touchPrevented = false;

          pos = {
            x: e.originalEvent.touches[0].pageX,
            y: e.originalEvent.touches[0].pageY
          };

          $(document).on('touchmove.dropdown', function touchMoveCallback(e) {
            var newPos = {
              x: e.originalEvent.touches[0].pageX,
              y: e.originalEvent.touches[0].pageY
            };

            if ((newPos.x >= pos.x + threshold) || (newPos.x <= pos.x - threshold) ||
                (newPos.y >= pos.y + threshold) || (newPos.y <= pos.y - threshold)) {
              touchPrevented = true;
            }
          });
        }

        function touchEndCallback(e) {
          $(document).off('touchmove.dropdown');
          e.preventDefault();

          if (touchPrevented) {
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

        var parentScroll = self.element.closest('.scrollable').length ? self.element.closest('.scrollable') : $(document);
        parentScroll = self.element.closest('.scrollable-y').length ? self.element.closest('.scrollable-y') : parentScroll;
        parentScroll.on('scroll.dropdown', scrollDocument);

        $('body').on('resize.dropdown', function() {
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
          $(window).on('orientationchange.dropdown', function() {
            self.closeList('cancel');
          });
        }

        if (Soho.env.os.name === 'ios') {
          $('head').triggerHandler('enable-zoom');
        }
      },

      /**
       * Set size and positioning of the list
       * @returns {undefined}
       */
      position: function() {
        var self = this,
          positionOpts = {
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
          var ulHeight = parseInt(window.getComputedStyle(self.listUl[0]).height),
            listHeight = parseInt(window.getComputedStyle(self.list[0]).height),
            searchInputHeight = 34;
          if (ulHeight + searchInputHeight > listHeight) {
            self.listUl[0].style.height = (listHeight - searchInputHeight) + 'px';
          }

          return placementObj;
        }

        // Reset styles that may have been appended to the list
        this.list[0].removeAttribute('style');
        this.listUl[0].removeAttribute('style');

        var parentElement = this.pseudoElem;
        if (this.isInGrid) {
          parentElement = this.element.closest('.datagrid-cell-wrapper');
        }

        // If the list would end up being wider parent,
        // use the list's width instead of the parent's width
        var listDefaultWidth, useParentWidth,
          parentElementStyle = window.getComputedStyle(parentElement[0]),
          parentElementWidth = parseInt(parentElementStyle.width + parentElementStyle.borderLeftWidth + parentElementStyle.borderRightWidth);

        this.searchInput[0].style.cssText = 'width:'+ parentElementWidth +'px !important';
        listDefaultWidth = this.list.width();
        useParentWidth = listDefaultWidth <= parentElementWidth;
        this.searchInput[0].style.width = '';

        // Add parent info to positionOpts
        positionOpts.parent = parentElement;
        positionOpts.useParentWidth = useParentWidth;

        // use negative height of the pseudoElem to get the Dropdown list to overlap the input.
        positionOpts.y = parseInt(parentElementStyle.height + parentElementStyle.borderTopWidth + parentElementStyle.borderBottomWidth) * -1;

        this.list.one('afterplace.dropdown', dropdownAfterPlaceCallback).place(positionOpts);
        this.list.data('place').place(positionOpts);
      },

      // Alias that works with the global "closeChildren" method.  See "js/lifecycle.js"
      close: function() {
        return this.closeList('cancel');
      },

      //Close list and detach events
      closeList: function(action) {
        if (!this.list || !this.list.is(':visible') || !this.isListClosable()) {
          return;
        }

        if (!this.inputTimer()) {
          return;
        }

        if (this.touchmove) {
          this.touchmove = false;
        }

        this.filterTerm = '';
        this.searchInput.off('keydown.dropdown keypress.dropdown keypress.dropdown');

        this.list
          .off('click.list touchmove.list touchend.list touchcancel.list mousewheel.list mouseenter.list')
          .remove();

        this.pseudoElem
          .removeClass('is-open')
          .attr('aria-expanded', 'false');

        this.searchInput
          .removeAttr('aria-activedescendant');

        $(document)
          .off('click.dropdown scroll.dropdown touchmove.dropdown touchend.dropdown touchcancel.dropdown');

        $('body').off('resize.dropdown');
        $(window).off('orientationchange.dropdown');
        this.element.trigger('listclosed', action);
        this.activate();
        this.list = null;
        this.searchInput = null;
        this.listUl = null;
      },

      //Set option into view
      scrollToOption: function(current) {
        var self = this;
        if (!current) {
          return;
        }
        if (current.length === 0) {
          return;
        }
        // scroll to the currently selected option
        self.listUl.scrollTop(0);
        self.listUl.scrollTop(current.offset().top - self.listUl.offset().top - self.listUl.scrollTop() - 40);
      },

      //Blur and Close List
      handleBlur: function() {
        var self = this;

        if (this.isOpen()) {
          this.timer = setTimeout(function() {
            self.closeList('cancel');
          }, 40);
        }

        return true;
      },

      // returns true if the field is attempting to load via AJAX.
      isLoading: function() {
        return this.element.is('.is-loading') &&  this.element.is('.is-blocked') ;
      },

      // Return true/false if the list is open
      isOpen: function() {
        return (this.list && this.list.is(':visible')) ? true : false;
      },

      // Hide or Show list
      toggleList: function() {
        if (this.isOpen() || this.isLoading()) {
          this.closeList('cancel');
          return;
        }
        this.open();
      },

      highlightOption: function(listOption, noScroll) {
        if (!listOption) {
          return listOption;
        }

        if (listOption.length === 0) {
          listOption = this.list.find('.dropdown-option').eq(0);
        }

        // Get corresponding option from the list
        var option = this.element.find('option[value="' + listOption.attr('data-val') + '"]');

        if (option.hasClass('.is-disabled') || option.is(':disabled')) {
          return;
        }

        if (this.isOpen()) {
          this.list.find('.is-focused').removeClass('is-focused').attr({'tabindex':'-1'});
          if (option.val() !== 'clear_selection') {
            listOption.addClass('is-focused').attr({'tabindex': '0'});
          }

          // Set activedescendent for new option
          //this.pseudoElem.attr('aria-activedescendant', listOption.attr('id'));
          this.searchInput.attr('aria-activedescendant', listOption.children('a').attr('id'));

          if (!noScroll || noScroll === false || noScroll === undefined) {
            this.scrollToOption(listOption);
          }
        }

        return;
      },

      unhighlightOptions: function(listOptions, noScroll) {
        if (!listOptions || !listOptions.length) {
          listOptions = this.list.find('.is-selected');
        }

        listOptions.removeClass('is-focused').attr({'tabindex': '-1'});

        this.searchInput.removeAttr('aria-activedescendant');

        if (!noScroll || noScroll === false || noScroll === undefined) {
          this.scrollToOption(listOptions.first());
        }
      },

      //Select an option and optionally trigger events
      selectOption: function(option, noTrigger) {
        if (!option) {
          return option;
        }
        var li;
        if (option.is('li')) {
          li = option;
          option = this.element.find('option[value="' + option.attr('data-val') + '"]');

          //Try matching the option's text if 'cur' comes back empty.
          //Supports options that don't have a 'value' attribute.
          if (option.length === 0) {
            option = this.element.find('option').filter(function() {
              return $(this).text() === li.attr('data-val');
            });
          }
        }
        if (!li) {
          li = this.listUl.find('li[data-val="'+ option.val().replace('"', '/quot/') +'"]');
        }

        if (option.hasClass('is-disabled') || option.is(':disabled')) {
          return;
        }

        var code = option.val(),
          val = this.element.val(),
          oldText = this.pseudoElem.text(),
          text = '',
          trimmed = '',
          clearSelection = false,
          isAdded = true; // Sets to false if the option is being removed from a multi-select instead of added
        if (option.val() === 'clear_selection') {
          clearSelection = true;
        }

        if (this.settings.multiple) {
          // Working with a select multiple allows for the "de-selection" of items in the list
          if (!val) {
            val = [];
          }
          if ($.inArray(code, val) !== -1) {
            val = $.grep(val, function(optionValue) {
              return optionValue !== code;
            });
            li.removeClass('is-selected');
            this.previousActiveDescendant = undefined;
            isAdded = false;
          } else {
            if (!isNaN(this.settings.maxSelected) && this.element.find('option:selected').length >= this.settings.maxSelected) {
              return;
            }

            val = typeof val === 'string' ? [val] : val;
            val.push(code);
            li.addClass('is-selected');
            this.previousActiveDescendant = option.val();
          }

          var newOptions = this.element.find('option').filter(function() {
            return $.inArray($(this)[0].value, val) !== -1;
          });
          text = this.getOptionText(newOptions);
        } else {
          // Working with a single select
          val = code;
          this.listUl.find('li.is-selected').removeClass('is-selected');
          if (!clearSelection) {
            li.addClass('is-selected');
          }
          this.previousActiveDescendant = option.val();
          text = option.text();
        }
        if (!clearSelection) {
          this.element.find('option').each(function () {
            if (this.value === code) {
              this.selected = true;
              return false;
            }
          });
        }
        // If we're working with a single select and the value hasn't changed, just return without
        // firing a change event
        if (text === oldText) {
          return;
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

        // Fire the change event with the new value if the noTrigger flag isn't set
        if (!noTrigger) {
          this.element.val(val).trigger('change').triggerHandler('selected', [option, isAdded]);
        }

        // If multiselect, reset the menu to the unfiltered mode
        if (this.settings.multiple) {
          if (this.list.hasClass('search-mode')) {
            this.resetList();
          }
          this.activate(true);
        }

        this.setBadge(option);
      },

      setBadge: function (option) {
        //Badge Support
        if (this.badges) {
          var badge = this.element.parent().find('.badge');

          if (badge.length === 0) {
            this.element.parent().find('.dropdown-wrapper').append('<span class="badge">1</span>');
            badge = this.element.parent().find('.badge');
          }

          badge.attr('class', 'badge ' + (option.attr('data-badge-color') ? option.attr('data-badge-color') : 'azure07'))
            .text(option.attr('data-badge'));
        }
      },

      // Execute the source ajax option
      callSource: function(callback) {
        var self = this, searchTerm = '';

        if (this.settings.source) {
          this.isFiltering = false;

          var sourceType = typeof this.settings.source,
            response = function (data) {
            //to do - no results back do not open.
            var list = '',
              val = self.element.val();

            function replaceDoubleQuotes(content) {
              return content.replace('"', '\'');
            }

            function buildOption(option) {
              if (option === null || option === undefined) {
                return;
              }

              var isString = typeof option === 'string',
                stringContent = option;

              if (isString) {
                option = {
                  value: stringContent
                };
              }
              option.value = replaceDoubleQuotes(option.value);

              if (option.id !== undefined) {
                if (!isNaN(option.id)) {
                  option.id = '' + option.id;
                }
                option.id = replaceDoubleQuotes(option.id);
              }

              if (option.label !== undefined) {
                option.label = replaceDoubleQuotes(option.label);
              }

              if (!option.selected && option.value === val) {
                option.selected = true;
              }

              list += '<option' + (option.id === undefined ? '' : ' id="' + option.id + '"') +
                        ' value="' + option.value + '"' +
                        (option.selected ? ' selected ' : '') +
                      '>'+ (option.label !== undefined ? option.label : option.value !== undefined ? option.value : '') + '</option>';
            }

            // If the incoming dataset is different than the one we started with,
            // replace the contents of the list, and rerender it.
            if (!self.isFiltering && !Soho.utils.equals(data, self.dataset)) {
              self.dataset = data;

              self.element.empty();
              for (var i=0; i < data.length; i++) {
                var opts;

                if (data[i].group) {
                  opts = data[i].options;
                  list += '<optgroup label="' + data[i].group + '">';
                  for (var ii = 0; ii < opts.length; ii++) {
                    buildOption(opts[ii]);
                  }
                  list += '</optgroup>';
                } else {
                  buildOption(data[i]);
                }
              }

              self.element.append(list);
              self.updateList();
            }

            self.element.triggerHandler('complete'); // For Busy Indicator
            self.element.trigger('requestend', [searchTerm, data]);
            callback();
            return;
          };

          self.element.triggerHandler('start'); // For Busy Indicator
          self.element.trigger('requeststart');

          if (sourceType === 'function') {
            // Call the 'source' setting as a function with the done callback.
            this.settings.source(response, searchTerm, this.settings.sourceArguments);
          } else if (sourceType === 'object') {
            // Use the 'source' setting as pre-existing data.
            // Sanitize accordingly.
            var sourceData = $.isArray(this.settings.source) ? this.settings.source : [this.settings.source];
            response(sourceData);
          } else {
            // Attempt to resolve source as a URL string.  Do an AJAX get with the URL
            var sourceURL = this.settings.source.toString(),
              request = $.getJSON(sourceURL);

            request.done(function(data) {
              response(data);
            }).fail(function() {
              response([]);
            });
          }

          return true;
        }
        return false;
      },

      // External Facing function to set value by code - Depricated set on select and trigger updated
      setCode: function(code) {
        var self = this,
          doSetting = function ()  {
            var option = null;

            self.element.find('option').each(function () {
              if (this.value === code) {
                option = $(this);
              }
            });

            self.selectOption(option, true);
          };

        if (!self.callSource(doSetting)) {
          doSetting();
        }
      },

      isMobile: function() {
        return ['ios', 'android'].indexOf(Soho.env.os.name) > -1;
      },

      isListClosable: function() {
        return this.list.hasClass('is-closable');
      },

      disable: function() {
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

      enable: function() {
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

      readonly: function() {
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

      // Triggered whenever the plugin's settings are changed
      updated: function() {
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
        this.pseudoElem[ this.element.prop('disabled') ? 'addClass' : 'removeClass' ]('is-disabled');

        // update the list and set a new value, if applicable
        this.updateList();
        this.setValue();

        this.element.trigger('has-updated');

        return this;
      },

      destroy: function() {
        $.removeData(this.element[0], pluginName);
        this.closeList('cancel');
        this.label.remove();
        this.pseudoElem.off().remove();
        this.icon.remove();
        this.wrapper.remove();
        this.listfilter.destroy();
        this.element.removeAttr('style');
      }

    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);

      if (instance) {
        instance.settings = $.extend({}, settings, instance.settings);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Dropdown(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
