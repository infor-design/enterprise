/**
* Wizard Control (TODO: bitly link to soho xi docs)
*/

// NOTE:  There are AMD Blocks available

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

  //NOTE: Just this part will show up in SoHo Xi Builds.

  $.fn.wizard = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'wizard',
        defaults = {
          ticks: null
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Wizard(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Wizard.prototype = {

      init: function() {
        this
          .build()
          .handleEvents();
      },

      build: function() {
        this.header = this.element.find('.wizard-header');
        if (!this.header.length) {
          this.header = $('<div class="wizard-header"></div>').appendTo(this.element);
        }

        this.bar = this.element.find('.bar');
        if (!this.bar.length) {
          this.bar = $('<div class="bar"></div>').appendTo(this.header);
        }

        this.completedRange = this.element.find('.completed-range');
        if (!this.completedRange.length) {
          this.completedRange = $('<div class="completed-range"></div>').appendTo(this.bar);
        }

        this
          .buildTicks()
          .updateRange();

        return this;
      },

      handleEvents: function() {
        var self = this;

        this.element.on('updated', function() {
          self.updated();
        });

        this.ticks.onTouchClick('wizard').on('click.wizard', function(e) {
          self.handleTickClick(e);
        });

        return this;
      },

      buildTicks: function() {
        var settingTicks = this.settings.ticks,
          self = this;

        this.ticks = this.bar.children('.tick');
        if (!this.ticks.length && settingTicks) {

          for (var i = 0; i < settingTicks.length; i++) {
            var link = $('<a ng-click="handleClick()" class="tick ' + (settingTicks[i].state ? settingTicks[i].state : '') + '" href="'+ (settingTicks[i].href ? settingTicks[i].href : '#') +'"><span class="label">' + settingTicks[i].label + '</span></a>');

            if (settingTicks[i].ngClick) {
              link.attr('ng-click', settingTicks[i].ngClick);
            }

            self.bar.append(link);
          }
          this.ticks = this.bar.children('.tick');
        }
        this.positionTicks();

        return this;
      },

      positionTicks: function() {
        var l = this.ticks.length,
          delta = 100 / (l - 1),
          tickPos = [];

        function getPoint(i) {
          if (i === 0) {
            return 0;
          }
          if (i === l - 1) {
            return 100;
          } else {
            return delta * i;
          }
        }

        for (var i = 0; i < l; i++) {
          tickPos.push(getPoint(i));
        }

        this.ticks.each(function(i) {
          var tick = $(this),
            label = tick.children('.label');

          tick.css('left', tickPos[i] + '%');

          if (label.length) {
            label.css('left', '-' + (label.outerWidth()/2 - tick.outerWidth()/2) + 'px');
          }
        });
      },

      handleTickClick: function(e) {
        e.preventDefault();

        var active = $(e.target),
          activeSet = false;

        if (active.is('.label')) {
          active = active.parent();
        }

        this.ticks
          .removeClass('current')
          .removeClass('complete')
          .each(function() {
            if (active[0] === this) {
              activeSet = true;
              $(this).addClass('current');
              return;
            }

            $(this).addClass(!activeSet ? 'complete' : '');
          });

        this.updateRange();
        this.element.triggerHandler('stepchange', [active]);
      },

      updateRange: function() {
        var currentTick = this.ticks.filter('.current').last(),
          widthPercentage = (100 * parseFloat(currentTick.css('left')) / parseFloat(currentTick.parent().css('width'))) + '%';

        this.completedRange.css('width', widthPercentage);
        return this;
      },

      updated: function() {
        this
          .buildTicks()
          .updateRange();

        return this;
      },

      unbind: function() {
        this.ticks.offTouchClick('wizard').off('click.wizard');
        this.element.off('updated.wizard');

        this.ticks.remove();
        return this;
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.unbind();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Wizard(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
