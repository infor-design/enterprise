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
        selectable: 'single' //false, 'single' or 'multiple' //TODO: Own Plugin?
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
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

        //TODO - Maybe Remove this, confirm with design
        self.actionButton = card.find('.btn-actions');

        if (self.actionButton.length > 0) {
          // Action Buttons may already be invoked via initialize.js.
          if (!(self.actionButton.data('popupmenu'))) {
            self.actionButton.popupmenu();
          }
        }

        //Setup Keyboard Support and Aria
        this.id = (this.element.attr('id') ? this.element.attr('id') : 'listview-'+ ($ ('.listview').index() + 1));
        this.element.attr({'tabindex': 0,
          'role' : 'listbox',
          'aria-label' : (settings.description ? settings.description : this.element.closest('.card').find('.card-title').text()),
          'aria-activedescendant': 'item'+ this.id + '-0'});

        this.element.parent('.card-content').css('overflow', 'hidden');
      },

      render: function(dataset) {
        var self = this;

        // Render "mustache" Template
        if (Tmpl && dataset && settings.template) {
          var compiledTmpl = Tmpl.compile(settings.template),
            renderedTmpl = compiledTmpl.render({dataset: dataset});

          this.element.html(renderedTmpl);
        }

        // Add an Id
        if (this.element.find('li, tr').first().attr('id')) {
          return;
        }

        this.element.find('li, tr').each(function (i) {
          var row = $(this).attr('role', 'option');
          if (!row.attr('id')) {
            row.attr('id', self.id + '-' + i);
          }
        });
      },

      // Get the Data Source. Can be an array, Object or Url
      refresh: function () {
        var ds = settings.dataset,
          self = this;

        if (ds.indexOf('http') === 0) {
          $.getJSON(ds, function(data) {
            self.render(data);
          });
          return;
        }
        this.render(ds);
      },

      // Handle Keyboard / Navigation Ect
      handleEvents: function () {
        var self = this;


        // Key Board
        this.element.on('focus.listview', function () {
         console.log('this');
        });

        // Selection View Click/Touch
        if (settings.selectable) {
          this.element.addClass('is-selectable');

          this.element.on('click.listview', 'li, tr', function () {
            self.select($(this));
          });
        }
      },

      select: function (li) {
        var self = this;

        self.selectedItems = [];
        if (settings.selectable === 'multiple') {
          li.parent().find('.is-selected').each(function (i) {
            self.selectedItems[i] = $(this);
          });
        } else {
          li.parent().find('.is-selected').removeClass('is-selected');
          self.selectedItems[0] = $(this);
        }

        if (li.hasClass('is-selected')) {
          li.removeClass('is-selected').attr('aria-selected', false);
        } else {
          li.addClass('is-selected').attr('aria-selected', true);
        }

        this.element.trigger('selectionchange', [this.selectedItems]);
      },

      destroy: function() {
        if (this.actionButton) {
          this.actionButton.off('beforeOpen close').data('popupmenu').destroy();
        }
        this.element.removeData(pluginName);
        this.element.empty();
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
