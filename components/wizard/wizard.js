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

    /**
    * The Autocomplete control provides an easier means of searching through a large amount of data by filtering down the results based on keyboard input from the user.
    *
    * @class Wizard
    *
    * @param {jQuery[]} ticks  &nbsp;-&nbsp; Defines the data to use, must be specified.
    *
    */

    // Settings and Options
    var pluginName = 'wizard',
        defaults = {
          ticks: null
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function Wizard(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Wizard.prototype = {

      /**
       * @private
       * @returns {this}
       */
      init: function() {
        this
          .build()
          .handleEvents();
      },

      /**
       * @private
       * @returns {this}
       */
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

        $('.tick', self.element).each(function() {
          var tick = $(this);
          if (tick.hasClass('is-disabled')) {
            tick.removeAttr('onclick ng-click');
          }
        });

        this.element.find('.wizard-header')[0].style.opacity = '1';
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
            label = tick.children('.label'),
            left = Locale.isRTL() ? (100-tickPos[i]) : tickPos[i];

          this.style.left = left + '%';

          for (var i2 = 0, l2 = label.length; i2 < l2; i2++) {
            label[i2].style.left = '-' + (label.outerWidth()/2 - tick.outerWidth()/2) + 'px';
          }

          if (tick.is('.is-disabled')) {
            tick.attr('tabindex', '-1');
          }
        });
      },

      updateRange: function() {
        var currentTick = this.ticks.filter('.current').last(),
          widthPercentage = 0;

        if (currentTick.length) {
          widthPercentage = (100 * parseFloat(window.getComputedStyle(currentTick[0]).left) / parseFloat(window.getComputedStyle(currentTick.parent()[0]).width));
          widthPercentage = Locale.isRTL() ? (100-widthPercentage) : widthPercentage;
        }

        this.completedRange[0].style.width = widthPercentage + '%';
        return this;
      },

      updated: function() {
        this
          .buildTicks()
          .updateRange();

        return this;
      },

      teardown: function() {
        this.ticks.offTouchClick('wizard').off('click.wizard');
        this.element.off('updated.wizard');

        this.ticks.remove();
        return this;
      },

      // Deprecating the "select()" method in favor of "activate()" to match the API of our other controls
      // Temporarily adding functionality that reroutes this method to the new "activate" method.
      select: function(e, tick) {
        return this.activate(e, tick);
      },

      // Activates one of the Wizard's ticks.
      // Tick can either be a number (representing the tick's index) or a jQuery element reference to a tick
      activate: function(e, tick) {
        if (e === undefined && !tick) {
          return this;
        }

        var self = this;

        function getTick() {
          var target;

          // Use the first variable as the tick definition or index if "e" is null, undefined, or not an event object.
          // This is for backwards compatibility with this control's old select() method, which took an index as an argument.
          if (e !== undefined && (e === undefined || e === null || !e.type || !e.target) && !tick) {
            tick = e;
          }

          if (tick === undefined) {
            target = $(e.target);
            return target.is('.label') ? target.parent() : target;
          }

          if (typeof tick === 'number') {
            return self.ticks.eq(tick);
          }

          return tick;
        }

        tick = getTick();

        if (e && (tick.is('[disabled], .is-disabled') || !tick.is('a'))) {
          e.preventDefault();
          e.stopPropagation();
          return this;
        }

        // Cancel selection by returning a 'beforeactivate' handler as 'false'
        var canNav = this.element.triggerHandler('beforeactivate', [tick]);
        if (canNav === false) {
          return this;
        }

        var trueIndex = this.ticks.index(tick);
        this.ticks.removeClass('complete current')
          .eq(trueIndex).addClass('current')
          .prevAll('.tick').addClass('complete');

        this.updateRange();
        this.element.trigger('activated', [tick]);

        // Timeout allows animation to finish
        setTimeout(function () {
          self.element.trigger('afteractivated', [tick]);
        }, 300);

        return this;
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
      },

      /**
       * This component listens to the following events:
       * @listens module:Wizard~event:updated
       * @listens module:Wizard~event:click
       */
      handleEvents: function() {
        var self = this;

        this.element.on('updated', function() {
          self.updated();
        });

        this.ticks.onTouchClick('wizard').on('click.wizard', function(e) {
          self.activate(e, $(this));
        });

        return this;
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
