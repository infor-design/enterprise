/**
* Card List Control
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(window.jQuery || window.Zepto);
  }
}(function ($) {

  $.fn.cardlist = function(options) {

    // Settings and Options
    var pluginName = 'cardlist',
      defaults = {
        dataset: null,
        template: null  //Html Template String
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
        this.render();
      },

      setup: function() {
        var self = this;
        self.actionButton = this.element.parent().find('.btn-actions');

        if (self.actionButton.length > 0) {
          // Action Buttons may already be invoked via initialize.js.
          if (!(self.actionButton.data('popupmenu'))) {
            self.actionButton.popupmenu();
          }

          self.actionButton.on('beforeOpen', function() {
            self.element.parent().addClass('menu-engaged');
          }).on('close', function() {
            self.element.parent().removeClass('menu-engaged');
          });
        }
      },

      render: function() {
        if (Tmpl && settings.dataset && settings.template) {
          var compiledTmpl = Tmpl.compile(settings.template),
            renderedTmpl = compiledTmpl.render({demoTasks: settings.dataset});

          this.element.html(renderedTmpl);
        }
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
