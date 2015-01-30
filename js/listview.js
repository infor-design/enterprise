/**
* List View Control
*/

//TODO:
// API - Selection,
// edit template
// navigatable
// seletable (single or multiple)
// template (as id or string)
// alt template
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
        rowHeight: 'medium' //Short, Medium or Tall or a number
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Object
    Plugin.prototype = {
      init: function() {
        this.setup();
        this.refresh();
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

          self.actionButton.on('beforeOpen', function() {
            card.addClass('menu-engaged');
          }).on('close', function() {
            card.removeClass('menu-engaged');
          });
        }
      },

      render: function(dataset) {
        // Set Row Height
        if (typeof settings.rowHeight === 'string') {
          this.element.addClass(settings.rowHeight);
        } else {
           this.element.css('line-height', settings.rowHeight);
        }

        // Render Template
        if (Tmpl && dataset && settings.template) {
          var compiledTmpl = Tmpl.compile(settings.template),
            renderedTmpl = compiledTmpl.render({dataset: dataset});

          this.element.html(renderedTmpl);
        }
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

      destroy: function() {
        if (this.actionButton) {
          this.element.parent().removeClass('menu-engaged');
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
