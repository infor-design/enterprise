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
