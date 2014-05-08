/*!
 Gramercy Controls v4.0.0 
 Date: 08-05-2014 11:12:52 
 Revision: undefined 
 */ 
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

  $.fn.select = function(options) {
    //TODO: Tests
    //   a) An empty list doesnt error
    //
    // Select Settings and Options
    var pluginName = 'select',
        defaults = {
          editable: 'false' //TODO
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    // Actual Select Code
    Plugin.prototype = {
      init: function() {
        var label = this.element.hide().prev('.label'),
            id = this.element.attr('id')+'-shdo'; //The Shadow Input Element. We use the select to serialize.

        this.label = $('<label class="label"></label>').attr('for', id).text(label.text());
        this.input = $('<input type="text" readonly class="select" tabindex="0"/>').attr({'role': 'combobox', 'aria-labelledby': 'cidX'})
                        .attr({'aria-autocomplete': 'list', 'aria-owns': 'select-list'})
                        .attr({'aria-readonly': 'true', 'aria-activedescendant': 'select-opt16'})
                        .attr('id', id);

        this.element.after(this.label, this.input, this.trigger);
        label.hide();
        this.updateList();
        this.setValue();
        this.setWidth();
        this._bindEvents();
      },
      setWidth: function() {
        if (this.element[0].style.width) {
          this.input.width(this.element[0].style.width);
        }
      },
      updateList: function() {
        var self = this;
        //Keep a list generated and append it when we need to.
        self.list = $('<ul id="select-list" class="select-list" tabindex="-1" aria-expanded="true"></ul>');

        self.element.find('option').each(function(i) {
          var option = $(this),
              listOption = $('<li id="list-option'+ i +'" role="option" class="select-option" role="listitem" tabindex="-1">'+ option.text() + '</li>');
          self.list.append(listOption);
          if (option.is(':selected')) {
            listOption.addClass('is-selected');
          }
        });

        //TODO : Call source - Ajax.
      },

      setValue: function() {
        //Set initial value for the edit box
       this.input.val(this.element.find('option:selected').text());
      },

      _bindEvents: function() {
        var self = this;

        //Bind mouse and key events
        this.input.on('keydown.select', function(e) {
          self.handleKeyDown($(this), e);
        }).on('keypress.select', function(e) {
          //Needed for browsers that use keypress events to manipulate the window.
          if (e.altKey && (e.keyCode === 38 || e.keyCode === 40)) {
            e.stopPropagation();
            return false;
          }

          switch(e.keyCode) {
            case 27:
            case 13: {

              e.stopPropagation();
              return false;
            }
          }

          return true;
        }).on('mouseup.select', function() {
          self.openList();
        });

      },

      openList: function() {
        var current = this.list.find('.is-selected'),
            self =  this,
            isFixed = false;

        this.list.appendTo('body').show().attr('aria-expanded', 'true');
        this.list.css({'top': this.input.position().top , 'left': this.input.position().left});

        this.input.parentsUntil('body').each(function () {
          if ($(this).css('position') === 'fixed') {
            isFixed = true;
            return;
          }
        });

        if (isFixed) {
          this.list.css('position', 'fixed');
        }

        //let grow or to field size.
        if (this.list.width() > this.input.outerWidth()) {
           this.list.css({'width': this.list.width() + 15});
        } else {
           this.list.width(this.input.outerWidth());
        }

        this.scrollToOption(current);
        this.input.addClass('is-open');

        self.list.on('click.list', 'li', function () {
          var idx = $(this).index(),
              cur = $(self.element[0].options[idx]);

          // select the clicked item
          self.selectOption(cur);
          self.input.focus();
          self.closeList();
        });

        $(document).on('click.select', function(e) {
          var target = $(e.target);
          if (target.is('.select-option') || target.is('.select')) {
            return;
          }
          self.closeList();
        }).on('resize.select', function() {
          self.closeList();
        }).on('scroll.select', function() {
          self.closeList();
        });
      },

      closeList: function() {
        this.list.hide().attr('aria-expanded', 'false').remove();
        this.list.off('click.list').off('mousewheel.list');
        this.input.removeClass('is-open');
        $(document).off('click.select resize.select scroll.select');
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
            selectedText = this.element.val(),
            options = this.element[0].options,
            self = this;

        if (e.altKey && (e.keyCode === 38 || e.keyCode === 40)) {
          self.toggleList(true);
          e.stopPropagation();
          return false;
        }

        switch (e.keyCode) {
          case 8:    //backspace
          case 46: { //del
            // prevent the edit box from being changed
            this.input.val(selectedText);
            e.stopPropagation();
            return false;
          }
          case 9: {  //tab - save the current selection

            this.selectOption($(options[selectedIndex]));

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
              self.selectOption($(options[selectedIndex])); // store the current selection
              self.closeList(false);  // Close the option list
            } else {
              self.openList(false);
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
          this.openList();
        }
      },
      selectOption: function(option) {
        var code = option.val();

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

        if (this.element.find('[value="' + code + '"]').length > 0) {
          this.element.find('[value="' + code + '"]')[0].selected = true;
        }
        this.element.val(code).trigger('change');
      },
      destroy: function() {
        $.removeData(this.obj, pluginName);
        this.input.off().remove();
        $(document).off('click.select');
      }
    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
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

  $.fn.tabs = function(options) {

    // Tab Settings and Options
    var pluginName = 'tabs',
        defaults = {
          propertyName: 'value'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {
      init: function(){
        var self = this,
              header = null;

          self.container = $(this.element);

          //For each tab panel set the aria roles and hide it
          self.panels = self.container.children('div')
              .attr({'class': 'tab-panel', 'role': 'tabpanel',
                      'aria-hidden': 'true'}).hide();

          self.panels.find('h2:first').attr('tabindex', '0');

          //Attach Tablist role and class to the tab headers container
          header = self.container.find('ul:first')
                      .attr({'class': 'tab-list', 'role': 'tablist',
                              'aria-multiselectable': 'false'});

          //for each item in the tabsList...
          self.anchors = header.find('li > a');
          self.anchors.each(function () {
            var a = $(this);

            a.attr({'role': 'tab', 'aria-selected': 'false', 'tabindex': '-1'})
             .parent().attr('role', 'presentation').addClass('tab');

            //Attach click events to tab and anchor
            a.parent().on('click.tabs', function () {
              self.activate($(this).index());
            });

            a.on('click.tabs', function (e) {
              e.preventDefault();
              e.stopPropagation();
              $(this).parent().trigger('click');
            }).on('keydown.tabs', function (e) {
              var li = $(this).parent();

              switch (e.which) {
                case 37: case 38:
                  if (li.prev().length !== 0) {
                    li.prev().find('>a').click();
                  } else {
                    self.container.find('li:last>a').click();
                  }
                  e.preventDefault();
                  break;
                case 39: case 40:
                  if (li.next().length !== 0) {
                    li.next().find('>a').click();
                  } else {
                    self.container.find('li:first>a').click();
                  }
                  e.preventDefault();
                  break;
              }
            });
          });

          self.activate(0);
      },

      activate: function(index){
        var self = this,
          a = self.anchors.eq(index),
          ui = {newTab: a.parent(),
                oldTab: self.anchors.parents().find('.is-selected'),
                panels: self.panels.eq(a.parent().index()),
                oldPanel: self.panels.filter(':visible')};

        var isCancelled = self.element.trigger('beforeActivate', null, ui);
        if (!isCancelled) {
          return;
        }

        //hide old tabs
        self.anchors.attr({'aria-selected': 'false', 'tabindex': '-1'})
            .parent().removeClass('is-selected');

        self.panels.hide();

        //show current tab
        a.attr({'aria-selected': 'true', 'tabindex': '0'})
          .parent().addClass('is-selected');

        ui.panels.attr('aria-hidden', 'false').stop().fadeIn(function() {
          self.element.trigger('activate', null, ui);
        });

        //Init Label Widths..
        ui.panels.find('.autoLabelWidth').each(function() {
          var container = $(this),
            labels = container.find('.inforLabel');

          if (labels.autoWidth) {
            labels.autoWidth();
          }
        });

        ui.panels.find(':first-child').filter('h3').attr('tabindex', '0');
        a.focus();
        self._setOveflow();
      },

      _setOveflow: function () {
        //TODO - Implement Overflow/Responsive
      },

      destroy: function(){
          $.removeData(this.obj, pluginName);
      }
    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
