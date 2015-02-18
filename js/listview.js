/**
* List View Control
*/

//TODO:
// TODOs: edit and/or alt template
// navigatable
// template (as id or string)
// Methods: add, remove, clear, destroy, refresh (rebind), select (get or set)
// Events: rendered, remove, add, select
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(window.jQuery || window.Zepto);
  }
}(function ($) {

  $.fn.listview = function(options) {

    // Settings and Options
    var pluginName = 'listview',
      defaults = {
        dataset: null,  //Object or Arrray or url
        template: null,  //Html Template String
        description: null,  //Audible Label (or use parent title)
        selectable: 'single', //false, 'single' or 'multiple' //TODO: Own Plugin?
        toolbar: true
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.settings = settings;
      this.init();
      this.handleEvents();
    }

    // Plugin Object
    Plugin.prototype = {
      init: function() {
        this.setup();
        this.refresh();
        this.selectedItems = [];
      },

      setup: function() {
        var self = this,
          card = this.element.closest('.card');

        if (this.element.attr('data-selectable')) {
          this.settings.selectable = this.element.attr('data-selectable');
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
        this.element.parent('.card-content').css('overflow', 'hidden');

         // Add Aria Roles
        this.element.attr({'role' : 'listbox',
          'aria-label' : (this.settings.description ? this.settings.description : this.element.closest('.card').find('.card-title').text()),
          'aria-activedescendant': self.id + '-item-0'});

        //Add / Link toolbar
        if (this.settings.toolbar) {
          //TODO: Append a Blank Selection Toolbar
        }
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
        var first = this.element.find('li, tr').first(),
          addId = (first.attr('id') === undefined),
          items = this.element.find('li, tr'),
          addCheckboxes = (this.settings.selectable === 'multiple');

        //Set Initial Tab Index
        first.attr('tabindex', 0);

        items.each(function (i) {
          var row = $(this);

          row.attr('role', 'option');

          if (addId && !row.attr('id')) {
            row.attr('id', self.id + '-item-' + i);
          }

          // Add Selection Checkboxes
          if (addCheckboxes) {
            self.element.addClass('is-muliselect');
          }

          // Add Aria
          row.attr({'aria-posinset': i+1, 'aria-setsize': items.length});

        });

       this.element.trigger('rendered', [dataset]);
      },

      // Get the Data Source. Can be an array, Object or Url
      refresh: function () {
        var ds = this.settings.dataset,
          self = this;

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
          isSelect = false;

        this.element.on('focus.listview', 'li, tr', function () {
          if (!isSelect) {
            self.select($(this));
            isSelect = false;
          }
        });

        // Key Board
        this.element.on('keydown.listview', 'li, tr', function (e) {
          var item = $(this),
            list = item.parent(),
            key = e.keyCode || e.charCode || 0,
            metaKey = e.metaKey;

          if (item.hasClass('is-disabled')) {
            return;
          }

           if (item.index() === 0 && e.keyCode === 38) {
             e.preventDefault();
             return;
          }

          if ((key === 40 || key === 38) && !metaKey) {// move down or up
            var newItem = list.children().eq(item.index() + (e.keyCode === 40 ? 1 : -1));
            self.focus(newItem);
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

        });

        // Selection View Click/Touch
        if (this.settings.selectable) {
          this.element.addClass('is-selectable');

          this.element.on('click.listview', 'li, tr', function () {
           var item = $(this);
           isSelect = true;
           self.select(item);
           item.focus();
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
        this.select(item);
      },

      // Handle Selecting the List Element
      select: function (li) {
        var self = this,
          isChecked = false;

        self.selectedItems = [];

        if (this.settings.selectable !== 'multiple') {
          li.parent().find('.is-selected').removeClass('is-selected');
          self.selectedItems[0] = $(this);
        }

        isChecked = li.hasClass('is-selected');

        if (isChecked) {
          li.removeClass('is-selected');
        } else {
          li.addClass('is-selected');
        }

        if (this.settings.selectable === 'multiple') {
          li.parent().find('.is-selected').each(function (i) {
            self.selectedItems[i] = $(this);
          });
        }

        li.parent().children().removeAttr('tabindex');
        li.attr('tabindex', 0);

        li.attr('aria-selected', !isChecked);
        li.find('input:checkbox:first').prop('checked', !isChecked);
        this.element.trigger('selectionchange', [this.selectedItems]);

        var toolbar = this.element.closest('.card').find('.listview-toolbar');
        if (self.selectedItems.length > 0) {
          toolbar.show();
          setTimeout(function () {
            toolbar.addClass('is-visible');
          }, 0);

          var count = toolbar.find('.listview-selection-count'),
            countSpan;
          if (count.length === 0) {
            countSpan = $('<span class="listview-selection-count"></span>');
            toolbar.prepend(countSpan);
          } else {
            countSpan = toolbar.find('.listview-selection-count');
          }

          //TODO - Localize
          countSpan.text(self.selectedItems.length + ' selected');
        } else {
          toolbar.removeClass('is-visible');
          setTimeout(function () {
            toolbar.hide();
          }, 750);
        }
      },

      destroy: function() {
        this.element.removeData(pluginName);
        this.element.off('click.listview focus.listview').empty();
      }
    };

    // Initializing the Control Once or Call Methods.
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
