/**
* List View Control
*/

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

  $.fn.listview = function(options) {
    // TODOs: edit and/or alt template
    // navigatable
    // template (as id or string)
    // Methods: add, remove (X), clear (X), destroy, refresh (rebind) (X), select (get or set) (X)
    // Events: rendered, add, select

    // Settings and Options
    var pluginName = 'listview',
      defaults = {
        dataset: null,  //Object or Array or url
        template: null,  //Html Template String
        description: null,  //Audible Label (or use parent title)
        selectable: 'single', //false, 'single' or 'multiple'
        selectOnFocus: true //true or false
     },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function ListView(element) {
      this.element = $(element);
      this.settings = settings;
      this.init();
      this.handleEvents();
    }

    // Plugin Object
    ListView.prototype = {
      init: function() {
        this.setup();
        this.refresh();
        this.selectedItems = [];
      },

      setup: function() {
        var self = this,
          card = this.element.closest('.card, .widget'),
          selectable = this.element.attr('data-selectable'),
          selectOnFocus = this.element.attr('data-select-onfocus');

        if (selectable && selectable.length) {
          this.settings.selectable = selectable;
        }

        if (selectOnFocus && selectOnFocus.length) {
          this.settings.selectOnFocus = JSON.parse(selectOnFocus);

        }

        self.actionButton = card.find('.btn-actions');

        if (self.actionButton.length > 0) {
          // Action Buttons may already be invoked via initialize.js.
          if (!(self.actionButton.data('popupmenu'))) {
            self.actionButton.popupmenu();
          }
        }

        //Setup Keyboard Support and Aria
        this.id = this.element.attr('id');
        if (!this.id) {
          this.id = 'listview-'+ ($('.listview').index(this.element) + 1);
          this.element.attr('id', self.id);
        }

        this.element.attr({'tabindex': '-1'});
        this.element.parent('.card-content, .widget-content').css('overflow', 'hidden');

         // Add Aria Roles
        this.element.attr({'role' : 'listbox',
          'aria-label' : (this.settings.description ? this.settings.description : this.element.closest('.card, .widget').find('.card-title, .widget-title').text()),
          'aria-activedescendant': self.id + '-item-0'});

      },

      render: function(dataset) {
        var self = this;

        // Render "mustache" Template
        if (Tmpl && dataset && this.settings.template) {
          var compiledTmpl = Tmpl.compile(this.settings.template),
            renderedTmpl = compiledTmpl.render({dataset: dataset});

          this.element.html(renderedTmpl);
        }

        // Add an Id or Checkboxes
        var first = this.element.find('li, tbody > tr').first(),
          addId = (first.attr('id') === undefined),
          items = this.element.find('li, tr'),
          isMultiselect = (this.settings.selectable === 'multiple');

        //Set Initial Tab Index
        first.attr('tabindex', 0);

        items.each(function (i) {
          var row = $(this);

          row.attr('role', 'option');

          if (addId && !row.attr('id')) {
            row.attr('id', self.id + '-item-' + i);
          }

          if (isMultiselect) {
            // Add Selection Checkboxes
            self.element.addClass('is-muliselect');

            // Create a Toolbar for the "Selected Items" area
            var selectedToolbar = self.element.prevAll('.toolbar');
            if (selectedToolbar.length && selectedToolbar.data('toolbar')) {
              selectedToolbar.data('toolbar').toggleMoreMenu();
            }
          }

          // Add Aria
          row.attr({'aria-posinset': i+1, 'aria-setsize': items.length});

          // Add Aria disabled
          if (row.hasClass('is-disabled')) {
            row.attr('aria-disabled','true');
          }


        });

       this.element.initialize();
       this.element.trigger('rendered', [dataset]);
      },

      // Get the Data Source. Can be an array, Object or Url
      refresh: function () {
        var ds = this.settings.dataset,
          self = this;

        if (!ds) {
          return;
        }

        if (ds.indexOf('http') === 0 || ds.indexOf('/') === 0) {
          $.getJSON(ds, function(data) {
            self.render(data);
          });
          return;
        }
        this.render(ds);
      },

      // Handle Keyboard / Navigation Ect
      handleEvents: function () {
        var self = this,
          isSelect = false, isFocused = false;

        this.element.on('focus.listview', 'li, tbody tr', function () {
          var item = $(this);

          // First element if disabled
          if ((item.attr('id') === item.parent().children().first().attr('id')) &&
             (item.hasClass('is-disabled'))) {

            var e = $.Event('keydown.listview');
              e.keyCode= 40; // move down
            isSelect = true;
            item.trigger(e);
          }

          if ((!isSelect) &&
              (!item.hasClass('is-disabled')) &&
              (self.settings.selectOnFocus) &&
              (self.settings.selectable !== 'multiple')) {

            self.select(item);
            isSelect = true;
            isFocused = true;
          }
        });

        // Key Board
        this.element.on('keydown.listview', 'li, tr', function (e) {
          var item = $(this),
            list = item.parent(),
            key = e.keyCode || e.charCode || 0,
            metaKey = e.metaKey;

           if (item.index() === 0 && e.keyCode === 38) {
             return;
          }

          if ((key === 40 || key === 38) && !metaKey) {// move down or up
            var newItem = list.children().eq(item.index() + (e.keyCode === 40 ? 1 : -1));

            if ($(e.target).is(item) || e.shiftKey) {
              if (newItem.hasClass('is-disabled')) {
                self.focus((e.keyCode === 40 ? newItem.next() : newItem.prev()));
              } else {
                self.focus(newItem);
              }
            }

            e.preventDefault();
          }

          if (key === 35 || (key === 40 && metaKey)) { //end
            var last = list.children().last();
            self.focus(last);
            e.stopPropagation();
            return false;
          }

          if (key === 36 || (key === 38 && metaKey)) {  //home
            var first = list.children().first();
            self.focus(first);
            e.stopPropagation();
            return false;
          }

          if (key === 32) { // Space to toggle selection
            if ($(e.target).is(item)) {
              self.select(item);
              e.preventDefault();
            }
          }
        });

        // Selection View Click/Touch
        if (this.settings.selectable) {
          this.element.addClass('is-selectable');
          var trigger = $('.application-menu-trigger').find('.app-header'),
            pattern = $(this.element).closest('.list-detail, .builder');

          trigger.parent().onTouchClick('listview').on('click.listview', function (e) {
            if (trigger.hasClass('go-back')) {
              trigger.removeClass('go-back');
              pattern.removeClass('show-detail');
            }
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
          });

          this.element.onTouchClick('listview', 'li, tr').on('click.listview', 'li, tr', function () {
            var item = $(this);

            if (!isFocused && !item.hasClass('is-disabled')) {
              isSelect = true;
              self.select(item);
              item.focus();
            }

            if (pattern.length > 0 && $(window).outerWidth() < 767 && !item.hasClass('is-disabled')) {
              pattern.toggleClass('show-detail');
              trigger.toggleClass('go-back');
            }

            isFocused = false;
          });
        }

        if (this.settings.selectable === 'multiple') {
          this.element.on('change.selectable-listview', '.listview-checkbox input', function (e) {
           $(this).parent().trigger('click');
           e.stopPropagation();
          });
        }
      },

      focus: function (item) {
        item.removeAttr('tabindex');
        item.attr('tabindex', 0).focus();

        if (this.settings.selectOnFocus && (this.settings.selectable !== 'multiple')) {
          this.select(item);
        }
      },

      // Remove Either the list element or index
      remove: function (li) {
        if (typeof li === 'number') {
           li = $(this.element.children()[0]).children().eq(li);
        }
        li.remove();
      },

      // Remove All
      clear: function () {
        var root = $(this.element.children()[0]);
        root.empty();
      },

      // Handle Selecting the List Element
      select: function (li) {
        var self = this,
          isChecked = false;

        self.selectedItems = [];
        isChecked = li.hasClass('is-selected');

        if (this.settings.selectable !== 'multiple') {
          li.parent().children().removeAttr('aria-selected');
          li.parent().find('.is-selected').removeClass('is-selected');
          self.selectedItems[0] = $(this);
        }

        if (isChecked) {
          self.selectedItems = [];
          li.removeClass('is-selected');
        } else {
          if (this.settings.selectable) {
            li.addClass('is-selected');
          }
        }

        if (this.settings.selectable === 'multiple') {
          li.parent().find('.is-selected').each(function (i) {
            self.selectedItems[i] = $(this);
          });
        }

        li.parent().children().removeAttr('tabindex');
        li.attr('tabindex', 0);

        li.attr('aria-selected', !isChecked);
        this.element.trigger('selected', [this.selectedItems]);

        var toolbar = this.element.closest('.card, .widget').find('.listview-toolbar'),
          toolbarControl = toolbar.data('toolbar');

        if (self.selectedItems.length > 0) {
          if (toolbarControl) {
            toolbarControl.toggleMoreMenu();
          }
          // Order of operations: set up event, change display prop, animate, toggle menu.
          // Menu toggle takes place after the animation starts
          toolbar.one('animateOpenComplete', function() {
            self.element.addClass('is-toolbar-open');
            toolbar.removeClass('is-hidden');
          }).css('display', 'block');
          toolbar.animateOpen();

          var count = toolbar.find('.listview-selection-count'),
            countSpan;
          if (count.length === 0) {
            countSpan = $('<span class="listview-selection-count"></span>');
            toolbar.prepend(countSpan);
          } else {
            countSpan = toolbar.find('.listview-selection-count');
          }

          countSpan.text(self.selectedItems.length + ' ' + Locale.translate('Selected'));
        } else {
          toolbar.addClass('is-hidden').one('animateClosedComplete', function(e) {
            e.stopPropagation();
            $(this).css('display', 'none');
          }).animateClosed();

        }
      },

      destroy: function() {
        this.element.removeData(pluginName);
        this.element.off('focus.listview click.listview touchend.listview keydown.listview change.selectable-listview').empty();
      }
    };

    // Initializing the Control Once or Call Methods.
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new ListView(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
