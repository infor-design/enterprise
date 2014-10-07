/**
* Responsive Tab Control
* @name Tabs
* @param {string} propertyName - The Name of the Property
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

  $.fn.dropdown = function(options, args) {

    // Dropdown Settings and Options
    var pluginName = 'dropdown',
        defaults = {
          editable: 'false',
          source: null  //A function that can do an ajax call.
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Actual DropDown Code
    Plugin.prototype = {
      init: function() {

        var id = this.element.attr('id')+'-shdo'; //The Shadow Input Element. We use the dropdown to serialize.
        this.isHidden = this.element.css('display') === 'none';
        this.element.hide();
        this.orgLabel = $('label[for="' + this.element.attr('id') + '"]');

        this.label = $('<label class="label"></label>').attr('for', id).html(this.orgLabel.html());
        this.input = $('<input type="text" readonly class="dropdown" tabindex="0"/>').attr({'role': 'combobox'})
                        .attr({'aria-autocomplete': 'none', 'aria-owns': 'dropdown-list'})
                        .attr({'aria-readonly': 'true', 'aria-activedescendant': 'dropdown-opt16'})
                        .attr('id', id);

        var icon = $('<svg class="icon" viewBox="0 0 32 32"><use xlink:href="#icon-dropdown-arrow"/></svg>');

        if (this.orgLabel.length === 1 && this.orgLabel.closest('table').length ===1) {
          this.element.after(this.input, this.trigger);
          this.orgLabel.after(this.label);
        } else if (this.orgLabel.length === 1) {
          this.element.after(this.label, this.input, this.trigger, icon);
        } else {
          this.element.after(this.input, this.trigger, icon);
        }
        this.updateList();
        this.setValue();
        this.setInitial();
        this.setWidth();
        this.orgLabel.hide();
        this.bindEvents();
      },
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
      updateList: function() {
        var self = this;
        //Keep a list generated and append it when we need to.
        self.list = $('<ul id="dropdown-list" class="dropdown-list" tabindex="-1" aria-expanded="true"></ul>');

        self.element.find('option').each(function(i) {
          var option = $(this),
              listOption = $('<li id="list-option'+ i +'" role="option" class="dropdown-option" role="listitem" tabindex="-1">'+ option.html() + '</li>');

          self.list.append(listOption);
          if (option.is(':selected')) {
            listOption.addClass('is-selected');
          }

          //Image Support
          if (option.attr('class')) {
            listOption.addClass(option.attr('class'));
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
      },
      setValue: function () {
        var text = this.element.find('option:selected').text();
        //Set initial values for the edit box
        this.input.val(text);
        if (this.element.attr('maxlength')) {
           this.input.val(text.substr(0, this.element.attr('maxlength')));
        }
      },
      setInitial: function() {

       if (this.element.hasClass('backgroundColor')) {
        this.input.addClass('backgroundColor');
       }
       if (this.orgLabel.hasClass('noColon')) {
        this.label.addClass('noColon');
       }
       if (this.orgLabel.hasClass('scr-only')) {
        this.label.addClass('scr-only');
       }
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
      },
      bindEvents: function() {
        var self = this,
          timer, buffer = '';

        //Bind mouse and key events
        this.input.on('keydown.dropdown', function(e) {
          if (self.element.is(':disabled') || self.input.hasClass('is-readonly')) {
            return;
          }

          self.handleKeyDown($(this), e);
        }).on('keypress.dropdown', function(e) {
          var charCode = e.charCode || e.keyCode;
          //Needed for browsers that use keypress events to manipulate the window.
          if (e.altKey && (charCode === 38 || charCode === 40)) {
            e.stopPropagation();
            return false;
          }

          if (self.element.is(':disabled') || self.input.hasClass('is-readonly')) {
            return;
          }

          //Printable Chars Jump to first high level node with it...
          if (e.which !== 0) {
            var term = String.fromCharCode(e.which);

            buffer += term.toLowerCase();
            clearTimeout(timer);
            timer = setTimeout(function () {
              $.each(self.element[0].options, function () {
               var opt = $(this);
               if (buffer !== '' && opt.text().substr(0, buffer.length).toLowerCase() === buffer) {
                 buffer = '';
                 self.selectOption(opt);
                 return false;
               }
              });
              buffer = '';
            }, 200);
          }
          return true;
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
      activate: function () {
        this.input.focus();
        if (this.input[0].setSelectionRange) {
          this.input[0].setSelectionRange(0, 0);  //scroll to left
        }
      },
      open: function() {
        //Prep for opening list,make ajax call ect...
        var self = this;

        if (this.element.is(':disabled') || this.input.hasClass('is-readonly')) {
          return;
        }

        if (!self.callSource(function () {
          self.updateList();
          self.openList();
        })) {
          this.openList();
        }
      },
      openList: function () {
        //Actually Open The List
        var current = this.list.find('.is-selected'),
            self =  this;

        $('#dropdown-list').remove(); //remove old ones
        this.list.appendTo('body').show().attr('aria-expanded', 'true');
        this.position();
        this.scrollToOption(current);
        this.input.addClass('is-open');

        self.list.on('click.list', 'li', function () {
          var idx = $(this).index(),
              cur = $(self.element[0].options[idx]);

          //Select the clicked item
          self.selectOption(cur);
          self.activate();
          self.closeList();
        });

        $(document).on('click.dropdown', function(e) {
          var target = $(e.target);
          if (target.is('.dropdown-option') || target.is('.dropdown')) {
            return;
          }
          self.closeList();
        }).on('resize.dropdown', function() {
          self.closeList();
        }).on('scroll.dropdown', function() {
          self.closeList();
        });
      },
      position: function() {
        var isFixed = false, isAbs = false,
          top = this.input.offset().top + this.input.outerHeight() + 1;

       this.list.css({'top': top, 'left': this.input.offset().left});

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

        //Flow up if not enough room on bottom
        //TODO Test $(window).height() vs $(document).height());
        if (top - $(window).scrollTop() + this.list.outerHeight() > $(window).height()) {
          this.list.css({'top': top - this.list.outerHeight() - this.input.outerHeight()});
        }

        //let grow or to field size.
        if (this.list.width() > this.input.outerWidth()) {
           this.list.css('width', '');
           this.list.css({'width': this.list.outerWidth() + 10});
        } else {
           this.list.width(this.input.outerWidth());
        }
      },
      closeList: function() {
        this.list.hide().attr('aria-expanded', 'false').remove();
        this.list.off('click.list').off('mousewheel.list');
        this.input.removeClass('is-open');
        $(document).off('click.dropdown resize.dropdown scroll.dropdown');
      },
      scrollToOption: function(current) {
        var self = this;
        if (!current) {
          return;
        }
        if (current.length === 0) {
          return;
        }
        // scroll to the currently selected option
        self.list.scrollTop(0);
        self.list.scrollTop(current.offset().top - self.list.offset().top - self.list.scrollTop());
      },
      handleBlur: function() {
        var self = this;

        if (this.isOpen()) {
          this.timer = setTimeout(function() {
            self.closeList();
          }, 40);
        }

        return true;
      },
      handleKeyDown: function(input, e) {
        var selectedIndex = this.element[0].selectedIndex,
            options = this.element[0].options,
            self = this;

        if (e.altKey && (e.keyCode === 38 || e.keyCode === 40)) {
          self.toggleList();
          e.stopPropagation();
          return false;
        }
        switch (e.keyCode) {
          case 8:    //backspace could clear
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
            }

            e.stopPropagation();
            return false;
          }
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
              var prev = $(options[selectedIndex - 1]);
              this.selectOption(prev);
            }

            e.stopPropagation();
            e.preventDefault();
            return false;
          }
          case 40: {  //down

            if (selectedIndex < options.length - 1) {
              var next = $(options[selectedIndex + 1]);
              this.selectOption(next);
            }

            e.stopPropagation();
            e.preventDefault();
            return false;
          }
          case 35: { //end
            var last = $(options[options.length - 1]);
            this.selectOption(last);

            e.stopPropagation();
            return false;
          }
          case 36: {  //home
            var first = $(options[0]);
            this.selectOption(first);

            e.stopPropagation();
            return false;
          }
        }

        return true;
      },
      isOpen: function() {
        return this.list.is(':visible');
      },
      toggleList: function() {
        if (this.isOpen()) {
          this.closeList();
        } else {
          this.open();
        }
      },
      selectOption: function(option, noTrigger) {
        if (!option) {
          return option;
        }

        var code = option.val(),
          oldVal = this.input.val();

        if (option.index() === this.element[0].selectedIndex) {
          return;
        }

        if (this.isOpen()) {
          // remove the selected class from the current selection
          this.list.find('.is-selected').removeClass('is-selected');
          var listOption = this.list.find('#list-option'+option.index());
          listOption.addClass('is-selected');

          // Set activedescendent for new option
          this.input.attr('aria-activedescendant', listOption.attr('id'));
          this.scrollToOption(listOption);
        }
        this.input.val(option.text()); //set value and active descendent

        if (this.element.attr('maxlength')) {
          this.input.val(option.text().substr(0, this.element.attr('maxlength')));
        }
        this.element.find('option').each(function () {
          if (this.value === code) {
            this.selected = true;
            return false;
          }
        });

        if (oldVal !== option.text() && !noTrigger) {
          this.element.val(code).trigger('change');
        }

      },
      callSource: function(callback) {
        var self = this;
        if (settings.source) {
          var response = function (data) {
            //to do - no results back do not open.
            var list = '',
              val = self.element.val();

            //populate
            self.element.empty();
            for (var i=0; i < data.length; i++) {
              list += '<option' + (data[i].id === undefined ? '' : ' id="' + data[i].id.replace('"', '\'') + '"')
                      + (data[i].value === undefined ? '' : ' value="' + data[i].value.replace('"', '\'') + '"')
                      + (data[i].value === val ? ' selected ' : '')
                      + '>'+ data[i].label + '</option>';
            }
            self.element.append(list);
            self.input.removeClass('is-busy');
            callback();
            return;
          };

          //show indicator
          self.input.addClass('is-busy');
          //make ajax call
          settings.source(self.input.val(), response);
          return true;
        }
        return false;
      },

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
        this.input.prev('label').remove();
        this.input.off().remove();
        this.element.show().prev('label').show();
      }
    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        if (typeof instance[options] === 'function') {
          instance[options](args);
        }
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
