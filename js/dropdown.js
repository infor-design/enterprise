/**
* Drop Down Control
*/

(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

  $.fn.dropdown = function(options) {

    // Dropdown Settings and Options
    var pluginName = 'dropdown',
        defaults = {
          editable: 'false',
          multiple: false,
          source: null,  //A function that can do an ajax call.
          empty: false //Initialize Empty Value
        },
        settings = $.extend({}, defaults, options);

    // Test the current browser for a mobile UA string.
    function isMobile() {
      // Adapted from http://www.detectmobilebrowsers.com
      var ua = navigator.userAgent || navigator.vendor || window.opera;

      // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
      // /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/
      return (/iPhone|iPod|iPad/).test(ua);
    }

    // Need to specifically test for Android to keep the Menu open and allow for touch scrolling
    function isAndroid() {
      var ua = navigator.userAgent || navigator.vendor || window.opera;
      return (/Android/).test(ua);
    }

    // Plugin Constructor
    function Dropdown(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Check if an object is an array
    function isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }

    // Actual DropDown Code
    Dropdown.prototype = {
      init: function() {
        var id = this.element.attr('id')+'-shdo'; //The Shadow Input Element. We use the dropdown to serialize.
        this.isHidden = this.element.css('display') === 'none';
        this.element.hide();
        this.orgLabel = $('label[for="' + this.element.attr('id') + '"]');

        this.label = $('<label class="label"></label>').attr('for', id).html(this.orgLabel.html());
        this.input = $('<input type="text" readonly class="dropdown" tabindex="0"/>').attr({'role': 'combobox'})
                        .attr({'aria-autocomplete': 'list', 'aria-owns': 'dropdown-list'})
                        .attr({'aria-readonly': 'true', 'aria-expanded': 'false'})
                        .attr({'aria-describedby' : id + '-instructions', 'id': id});

        var icon = $('<svg class="icon" focusable="false" aria-hidden="true"><use xlink:href="#icon-dropdown"/></svg>');

        if (this.orgLabel.length === 1 && this.orgLabel.closest('table').length ===1) {
          this.element.after(this.input, this.trigger);
          this.orgLabel.after(this.label);
        } else if (this.orgLabel.length === 1) {
          this.element.after(this.label, this.input, this.trigger, icon);
        } else {
          this.element.after(this.input, this.trigger, icon);
        }

        this.instructions = $('<span id="' + id + '-instructions" class="audible"></span>')
          .text('. Press the Down Arrow to browse available options.') // TODO: Localize
          .insertAfter(this.label);

        // Setup the incoming options that can be set as properties/attributes
        if (this.element.prop('multiple') && !this.settings.multiple) {
          this.settings.multiple = true;
        }
        if (this.element.attr('data-source') && this.element.attr('data-source') !== 'source') {
          this.settings.source = this.element.attr('data-source');
        }

        this.updateList();
        this.setValue();
        this.setInitial();
        this.setWidth();
        this.orgLabel.hide();
        this.handleEvents();
      },

      // Set Field Width
      setWidth: function() {
        var style = this.element[0].style,
          labelStyle = (this.orgLabel[0] === undefined ? null : this.orgLabel[0].style);

        if (style.width) {
          this.input.width(style.width);
        }
        if (style.position === 'absolute') {
          this.input.css({position: 'absolute', left: style.left, top: style.top, bottom: style.bottom, right: style.right});
        }
        if (labelStyle && labelStyle.position === 'absolute') {
          this.label.css({position: 'absolute', left: labelStyle.left, top: labelStyle.top, bottom: labelStyle.bottom, right: labelStyle.right});
        }
      },

      // Update List Values
      updateList: function() {
        var self = this;
        //Keep a list generated and append as needed
        self.list = $('<div class="dropdown-list" id="dropdown-list">');
        self.listUl = $('<ul tabindex="-1" role="listbox"></ul>').appendTo(self.list);
        self.list.prepend('<svg class="icon" focusable="false" aria-hidden="true"><use xlink:href="#icon-dropdown"></svg>');

        self.element.find('option').each(function(i) {
          var option = $(this),
              listOption = $('<li id="list-option'+ i +'" role="option" class="dropdown-option" role="listitem" tabindex="-1">'+ option.html() + '</li>');

          self.listUl.append(listOption);
          listOption.attr({'aria-selected':'false'});
          if (option.is(':selected')) {
            listOption.addClass('selected').attr({'aria-selected':'true', 'tabindex': '0'});
          }

          //Image Support
          if (option.attr('class')) {
            listOption.addClass(option.attr('class'));
          }
          //Disabled Support
          if (option.attr('disabled')) {
            listOption.addClass('is-disabled');
          }
          //Special Data Attribute
          if (option.attr('data-attr')) {
            listOption.attr('data-attr', option.attr('data-attr'));
          }
          //Tooltip Support
          if (option.attr('title') && $.fn.tooltip) {
            listOption.attr('title', option.attr('title')).tooltip();
          }
        });

        //Add Input Element and
        this.searchInput = $('<input type="text" class="dropdown-search" id="dropdown-search">');
        this.list.prepend(this.searchInput);
        this.searchInput.before('<label for="dropdown-search" class="audible">Search</label>');
      },

      // Set the value based on selected options
      setValue: function () {
        var opts = this.element.find('option:selected'),
          text = this.getOptionText(opts);

        if (this.settings.empty && opts.length === 0) {
          //initially empty
          return;
        }

        //Set initial values for the edit box
        this.input.val(text);
        if (this.element.attr('maxlength')) {
           this.input.val(text.substr(0, this.element.attr('maxlength')));
        }
      },

      copyClass: function(from, to, prop) {
        if (from.hasClass(prop)) {
          to.addClass(prop);
        }
      },

      // Copy initial stuff from the drop down.
      setInitial: function() {
        this.copyClass(this.orgLabel, this.label, 'sr-only');
        this.copyClass(this.orgLabel, this.label, 'audible');

        if (this.orgLabel.attr('style')) {
          this.label.attr('style', this.orgLabel.attr('style'));
        }
        if (this.element.is(':disabled')) {
          this.input.attr('disabled','');
        }
        if (this.element.is('[readonly]')) {
          this.input.addClass('is-readonly');
        }
        if (this.isHidden) {
          this.input.hide().prev('label').hide();
          this.input.next('svg').hide();
        }

        //TODO: Empty Selection
        if (this.element.attr('placeholder')) {
          this.input.attr('placeholder', this.element.attr('placeholder'));
          this.element.removeAttr('placeholder');
        }
      },

      //Bind mouse and key events
      handleEvents: function() {
        var self = this;

        this.input.on('keydown.dropdown', function(e) {
          self.handleKeyDown($(this), e);
        }).on('keypress.dropdown', function(e) {
          self.ignoreKeys($(this), e);
        }).on('mouseup.dropdown', function(e) {
          if (e.button === 2) {
            return;
          }
          self.toggleList();
        });

        self.element.on('activate', function () {
          self.activate();
        }).on('updated', function () {
          self.closeList();
          self.updateList();
          self.setValue();
        });

        //for form resets.
        self.element.closest('form').on('reset.dropdown', function() {
          setTimeout(function () {
            self.element.trigger('updated');
          }, 1);
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

        // Prevent Backspace from returning to the previous page.
        if (charCode === 8 && input.hasClass('.dropdown')) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }

        if (input.is(':disabled') || input.hasClass('is-readonly')) {
          return;
        }
      },

      //handle events while search is focus'd
      handleSearchEvents: function () {
        var self = this,
          timer, term = '';

        this.searchInput.on('keydown.dropdown', function(e) {
          self.handleKeyDown($(this), e);
        }).on('keypress.dropdown', function(e) {
          var searchInput = $(this),
            selected = false;

          self.ignoreKeys(searchInput, e);

          //Open List and Filter results
          if (self.searchInput.val() === self.getOptionText()) {
            self.searchInput.val('');
          }

          clearTimeout(timer);
          timer = setTimeout(function () {
            term = searchInput.val().toLowerCase();
            self.listUl.find('li').hide();

            $.each(self.element[0].options, function (index) {
              //Filter List
              var opt = $(this),
                listOpt = self.listUl.find('#list-option'+ index);

              //Find List Item - Starts With
              if (opt.text().toLowerCase().indexOf(term) > -1) {
                if (!selected) {
                  self.highlightOption(opt);
                  selected = true;
                  self.searchInput.val(term);
                }

                //Highlight Term
                var exp = new RegExp('(' + term + ')', 'gi'),
                text = listOpt.text().replace(exp, '<b>$1</b>');
                listOpt.show().html(text);
              }
            });

            // Set ARIA-activedescendant to the first search term
            var topItem = self.listUl.find('.dropdown-option').not(':hidden');
            self.highlightOption(topItem);
            self.input.attr('aria-activedescendant', topItem.attr('id'));
            self.searchInput.attr('aria-activedescendant', topItem.attr('id'));

            term = '';

            //Adjust height / top position
            if (self.list.hasClass('is-ontop')) {
              self.list.css({'top': self.input.offset().top - self.list.height() + self.input.outerHeight() - 2});
            }
          }, 100);

        });

      },

      handleKeyDown: function(input, e) {
        var selectedIndex = this.element[0].selectedIndex,
            options = this.element[0].options,
            self = this, next;

        //Down and Up arrow to open
        if (!self.isOpen() && (e.keyCode === 38 || e.keyCode === 40)) {
          self.toggleList();
        }

        if (self.isOpen()) {
          options = this.listUl.find('li:visible').not(':disabled').not('.is-disabled');
          selectedIndex = -1;
          $(options).each(function(index) {
            if ($(this).is('.is-focused')) {
              selectedIndex = index;
            }
          });
        }

        switch (e.keyCode) {
          case 46: { //del
            e.stopPropagation();
            return false;
          }
          case 9: {  //tab - save the current selection

            this.selectOption($(options[selectedIndex]));
            this.activate();
            if (self.isOpen()) {  // Close the option list
              self.closeList(false);
            }

            // allow tab to propagate
            return true;
          }
          case 27: { //Esc - Close the Combo and Do not change value
            if (self.isOpen()) {
              // Close the option list
              self.closeList(true);
              self.input.focus();
              e.stopPropagation();
              return false;
            }
            // Allow Esc to propagate if the menu was closed, since some other Controls
            // that rely on dropdown may need to trigger routines when the Esc key is pressed.
            break;
          }
          case 32: //spacebar
          case 13: {  //enter

            if (self.isOpen()) {
              e.preventDefault();
              self.selectOption($(options[selectedIndex])); // store the current selection
              self.closeList(false);  // Close the option list
              self.activate();
            }

            e.stopPropagation();
            return false;
          }
          case 38: {  //up

            if (selectedIndex > 0) {
              next = $(options[selectedIndex - 1]);
              this.highlightOption(next);
              next.parent().find('li').removeClass('hover');
              next.addClass('hover');
            }

            e.stopPropagation();
            e.preventDefault();
            return false;
          }
          case 40: {  //down
            if (selectedIndex < options.length - 1) {
              next = $(options[selectedIndex + 1]);
              this.highlightOption(next);
              next.parent().find('li').removeClass('hover');
              next.addClass('hover');
            }

            e.stopPropagation();
            e.preventDefault();
            return false;
          }
          case 35: { //end
            var last = $(options[options.length - 1]);
            this.highlightOption(last);

            e.stopPropagation();
            return false;
          }
          case 36: {  //home
            var first = $(options[0]);
            this.highlightOption(first);

            e.stopPropagation();
            return false;
          }
        }

        if (!self.isOpen() && !self.isControl(e.keyCode)) {
          self.toggleList();
          self.searchInput.val('');
        }
        return true;
      },

      isControl: function(keycode) {
        var valid =
          (keycode > 7 && keycode < 48)   || // control chars
          (keycode > 90 && keycode < 94)   || // windows keys
          (keycode > 111 && keycode < 146);  // function keys

          return valid;
      },

      // Focus the Element
      activate: function () {
        this.input.focus();
        if (this.input[0].setSelectionRange&& !this.input[0].readOnly) {
          this.input[0].setSelectionRange(0, 0);  //scroll to left
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

        if (this.element.is(':disabled') || this.input.hasClass('is-readonly')) {
          return;
        }

        if (self.element.find('option').length === 0) {
          if (!self.callSource(function () {
            self.updateList();
            self.openList();
          })) {
            self.updateList();
            this.openList();
          }
        } else {
          self.updateList();
          this.openList();
        }
      },

      // Actually Show The List
      openList: function () {
        var current = this.previousActiveDescendant ? this.list.find('#' + this.previousActiveDescendant) : this.list.find('.selected'),
            self =  this;

        if (current.length > 0) {
          current = current.eq(0);
        }

        this.input.attr('aria-expanded', 'true');
        this.input.attr('aria-activedescendant', current.attr('id'));

        $('#dropdown-list').remove(); //remove old ones

        // On mobile devices, don't use the HTML5 dropdown and trigger
        // the native one instead.
        if (isMobile()) {
          self.element.css({
            'position':'absolute',
            'left': '-999px'
          }).show().focus().click();

          self.element.off('change.dropdown').one('change.dropdown', function() {
            var idx = self.element.find('option:selected').index(),
              cur = $(self.element[0].options[idx]);

            //Select the clicked item
            self.selectOption(cur);

            self.element.hide().css({'position': '', 'left': ''});
            setTimeout(function() {
              self.input.focus();
            });
          });
          return;
        }

        this.list.appendTo('body').show();
        this.position();
        this.highlightOption(current, true);
        this.searchInput.val(current.text()).focus();
        this.handleSearchEvents();

        self.list.on('touchend.list touchcancel.list', function(e) {
          e.preventDefault();
          e.target.click();
        }).on('click.list', 'li', function () {
          var idx = $(this).index(),
              cur = $(self.element[0].options[idx]);

          //Select the clicked item
          if (cur.is(':disabled')) {
            return;
          }
          self.selectOption(cur);
          self.activate();
          self.closeList();
        });

        $(document).on('touchend.dropdown touchcancel.dropdown', function(e) {
          e.preventDefault();
          e.target.click();
        }).on('click.dropdown', function(e) {
          var target = $(e.target);
          if (target.is('.dropdown-option') || target.is('.dropdown')) {
            return;
          }
          self.closeList();
        }).on('scroll.dropdown', function() {
          if (!isAndroid()) {
            self.closeList();
          }
        });

        $(window).on('resize.dropdown', function() {
          self.closeList();
        });
      },

      // Set size and positioning of the list
      position: function() {
        var isFixed = false, isAbs = false,
          top = (this.input.offset().top);// + $(window).scrollTop());

        this.list.css({'top': top, 'left': this.input.offset().left - $(window).scrollLeft()});

        //Fixed and Absolute Positioning use cases
        this.input.parentsUntil('body').each(function () {
          if ($(this).css('position') === 'fixed') {
            isFixed = true;
            return;
          }
        });

        if (isFixed) {
          this.list.css('position', 'fixed');
        }

        if (this.input.parent('.field').css('position') === 'absolute') {
          isAbs = true;
          this.list.css({'top': this.input.parent('.field').offset().top + this.input.prev('label').height() , 'left': this.input.parent('.field').offset().left});
        }

        this.list.removeClass('is-ontop');

        //Flow up if not enough room on bottom
        var roomTop = top,
          roomBottom = $(window).height() - top - this.input.outerHeight();

        if (roomTop > roomBottom && top - $(window).scrollTop() + this.list.outerHeight() > $(window).height()) {
          this.list.css({'top': top - this.list.outerHeight() + this.input.outerHeight()});
          this.list.addClass('is-ontop');
          this.listUl.prependTo(this.list);
        }

        // If the menu is off the top of the screen, cut down the size of the menu to make it fit.
        if (this.list.offset().top < 0 ) {
          var listHeight = this.list.outerHeight(),
            diff = this.list.offset().top * -1;
          this.list.css('top', 0);
          this.list.height(listHeight - diff - 5);
        }

        // If the menu is off the bottom of the screen, cut up the size
        if (this.list.offset().top - $(window).scrollTop() + this.list.outerHeight() >  $(window).height()) {
          var newHeight = $(window).height() - this.list.offset().top - 5;
          this.list.height(newHeight);
        }

        //let grow or to field size.
        this.list.find('input').outerWidth(this.input.outerWidth()-2);
        if (this.list.width() > this.input.outerWidth()) {
           this.list.css('width', '');
           this.list.css({'width': this.list.outerWidth() + 35});
           this.list.find('input').css({'width': this.list.outerWidth() + 35});

           //But not off the left side
           var maxWidth = $(window).width() - parseInt(this.list.css('left'), 10);
           if (this.list.width() > maxWidth) {
            this.list.width(maxWidth - 20);
           }
        } else {
           this.list.width(this.input.outerWidth()-2);
        }
      },

      //Close list and detch events
      closeList: function() {
        this.list.hide().remove();
        this.list.off('click.list touchend.list touchcancel.list').off('mousewheel.list');
        this.listUl.find('li').show();
        this.input.removeClass('is-open').attr('aria-expanded', 'false').removeAttr('aria-activedescendant');
        $(document).off('click.dropdown scroll.dropdown touchend.dropdown touchcancel.dropdown');
        $(window).off('resize.dropdown');
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
            self.closeList();
          }, 40);
        }

        return true;
      },

      // Return true/false if the list is open
      isOpen: function() {
        return this.list.is(':visible');
      },

      // Hide or Show list
      toggleList: function() {
        if (this.isOpen()) {
          if (!isAndroid()) {
            this.closeList();
          }
        } else {
          this.open();
        }
      },

      highlightOption: function(option) {
        if (!option) {
          return option;
        }

        if (option.is('li')) {
          option = this.element.find('option').eq(option.attr('id').replace('list-option',''));
        }

        if (option.hasClass('.is-disabled') || option.is(':disabled')) {
          return;
        }

        if (this.isOpen()) {
          // remove the selected class from the current selection
          this.list.find('.is-focused').removeClass('is-focused').attr({'tabindex':'-1'});
          var listOption = this.list.find('#list-option'+option.index());
          listOption.addClass('is-focused').attr({'tabindex':'0'});

          // Set activedescendent for new option
          this.input.attr('aria-activedescendant', listOption.attr('id'));
          this.searchInput.attr('aria-activedescendant', listOption.attr('id'));

          this.scrollToOption(listOption);
          return;
        }

        return;
      },

      //Select an option and optionally trigger events
      selectOption: function(option, noTrigger) {
        if (!option) {
          return option;
        }

        if (option.is('li')) {
          option = this.element.find('option').eq(option.attr('id').replace('list-option',''));
        }

        if (option.hasClass('.is-disabled') || option.is(':disabled')) {
          return;
        }

        if (!isMobile() && !this.settings.multiple && option.index() === this.element[0].selectedIndex) {
          return;
        }

        var code = option.val(),
          val = this.element.val(),
          oldText = this.input.val(),
          text = '',
          trimmed = '';

        this.element.find('option').each(function () {
          if (this.value === code) {
            this.selected = true;
            return false;
          }
        });

        if (this.settings.multiple) {
          // Working with a select multiple allows for the "de-selection" of items in the list
          if (!val) {
            val = [];
          }
          if ($.inArray(code, val) !== -1) {
            val = $.grep(val, function(optionValue) {
              return optionValue !== code;
            });
            this.previousActiveDescendant = undefined;
          } else {
            val = typeof val === 'string' ? [val] : val;
            val.push(code);
            this.previousActiveDescendant = 'list-option' + option.index();
          }

          var newOptions = this.element.find('option').filter(function() {
            return $.inArray($(this)[0].value, val) !== -1;
          });
          text = this.getOptionText(newOptions);
        } else {
          // Working with a single select
          val = code;
          this.previousActiveDescendant = 'list-option' + option.index();
          text = option.text();
        }

        // If we're working with a single select and the value hasn't changed, just return without
        // firing a change event
        if (text === oldText) {
          return;
        }

        // Change the values of both inputs and swap out the active descendant
        this.input.val(text);
        this.searchInput.val(text);

        if (this.element.attr('maxlength')) {
          trimmed = text.substr(0, this.element.attr('maxlength'));
          this.input.val(trimmed);
          this.searchInput.val(trimmed);
        }

        // Fire the change event with the new value if the noTrigger flag isn't set
        if (!noTrigger) {
          this.element.val(val).trigger('change');
        }
      },

      // Execute the source ajax option
      callSource: function(callback) {
        var self = this;

        if (this.settings.source) {
          var searchTerm = self.input.val(),
            sourceType = typeof this.settings.source,
            response = function (data) {
            //to do - no results back do not open.
            var list = '',
              val = self.element.val();

            function buildOption(option) {
              var isString = typeof option === 'string';

              if (option !== null && option !== undefined) {
                list += '<option' + (option.id === undefined ? '' : ' id="' + option.id.replace('"', '\'') + '"') +
                        (option.value !== undefined ? ' value="' + option.value.replace('"', '\'') + '"' : isString ? ' value="' + option.replace('"', '\'') + '"' : '') +
                        (option.value === val ? ' selected ' : '') +
                        '>'+ (option.label !== undefined ? option.label : option.value !== undefined ? option.value : isString ? option : '') + '</option>';
              }
            }

            //populate
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
            self.input.removeClass('is-busy');
            self.element.trigger('requestend', [searchTerm, data]);
            callback();
            return;
          };

          //TODO: show indicator when we have it
          self.input.addClass('is-busy');
          self.element
              .trigger('requeststart');

            if (sourceType === 'function') {
              // Call the 'source' setting as a function with the done callback.
              this.settings.source(response);
            } else if (sourceType === 'object') {
              // Use the 'source' setting as pre-existing data.
              // Sanitize accordingly.
              var sourceData = isArray(this.settings.source) ? this.settings.source : [this.settings.source];
              response(sourceData);
            } else {
              // Attempt to resolve source as a URL string.  Do an AJAX get with the URL
              var sourceURL = this.settings.source.toString(),
                request = $.getJSON(sourceURL);

              request.done(function(data) {
                response(data);
              }).fail(function() {
                console.warn('Request to ' + sourceURL + ' could not be processed...');
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

      destroy: function() {
        $.removeData(this.element[0], pluginName);
        this.closeList();
        this.instructions.remove();
        this.input.prev('label').remove();
        this.input.off().remove();
        this.element.show().prev('label').show();
      },

      disable: function() {
        this.element.prop('disabled', true);
        this.input.prop('disabled', true);
      },

      enable: function() {
        this.element.prop('disabled', false);
        this.input.prop('disabled', false);
      },

      // Triggered whenever the plugin's settings are changed
      update: function() {
        // Update the 'multiple' property
        if (this.settings.multiple && this.settings.multiple === true) {
          this.element.prop('multiple', true);
        } else {
          this.element.prop('multiple', false);
        }
      }

    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.update();
      } else {
        instance = $.data(this, pluginName, new Dropdown(this, settings));
      }
    });
  };
}));
