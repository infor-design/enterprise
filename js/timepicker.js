/**
* Timepicker Control (TODO: bitly link to docs)
*/

(function(factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS - Not Tested TODO
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }
}(function($) {

  'use strict';

  $.fn.timepicker = function(options) {

    // Settings and Options
    var pluginName = 'timepicker',
        defaults = {
          mode: 'standard', // options: 'standard', 'range',
          forceHourMode: undefined // can be used to force timepicker to use only 12-hour or 24-hour display modes.  Defaults to whatever the current Globalize locale requires if left undefined.
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function TimePicker(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    TimePicker.prototype = {

      init: function() {
        this
          .setup()
          .build()
          .handleEvents();
      },

      // Configure any settings for the Timepicker
      setup: function() {
        // Figure out hour display settings
        this.timeFormat = this.element.attr('data-time-format') !== undefined ? this.element.attr('data-time-format') : Locale.calendar().timeFormat;
        this.show24Hours = (this.timeFormat.match('HH') || []).length > 0;
        if (settings.forceHourMode) {
          var mode = settings.forceHourMode;
          if (this.element.attr('data-time-format')) {
            this.origTimeFormat = this.timeFormat;
          }
          this.timeFormat = mode === '24' ? 'HH:mm' : 'h:mm a';
          this.element.attr('data-time-format', this.timeFormat);
          this.show24Hours = mode === '24';
        }

        return this;
      },

      //Add any markup
      build: function() {
        //Append a Button
        this.trigger = this.element.next('svg.icon');
        if (this.trigger.length === 0) {
          this.trigger = $('<svg class="icon">' +
                           '<use xlink:href="#icon-timepicker"/>' +
                           '</svg>').insertAfter(this.element);
        }

        // Add Aria
        this.element.attr('aria-haspopup', true);

        // Add Mask and Validation plugins for time
        this.mask();

        return this;
      },

      //Attach Events used by the Control
      handleEvents: function () {
        var self = this;
        this.trigger.on('click.timepicker', function () {
          self.openTimePopup();
          self.element.focus();
        });

        this.element.on('focus.timepicker', function () {
          self.mask();
        });

        this.handleKeys();

        return this;
      },

      handleKeys: function() {
        var self = this;

        this.element.on('keydown.timepicker', function (e) {
          var handled = false;

          // Esc closes an open popup with no action
          if (e.which === 27 && self.isOpen()) {
            handled = true;
            self.closeTimePopup();
          }

          //Arrow Down or Alt first opens the dialog
          if (e.which === 40 && !self.isOpen()) {
            handled = true;
            self.openTimePopup();
          }

          if (handled) {
            e.stopPropagation();
            e.preventDefault();
            return false;
          }
        });
      },

      // Add masking with the mask function
      mask: function () {
        if (this.element.data('mask') && typeof this.element.data('mask') === 'object') {
          this.element.data('mask').destroy();
        }
        this.element.data('mask', undefined);

        this.element
          .attr('data-mask', (this.show24Hours ? '##:##' : '##:## am'))
          .attr('data-mask-mode', 'time')
          .attr('data-validate', 'time')
          .mask()
          .validate()
          .trigger('updated');
      },

      // Return whether or not the calendar div is open.
      isOpen: function () {
        return (this.popup && this.popup.is(':visible') &&
          !this.popup.hasClass('is-hidden'));
      },

      openTimePopup: function() {
        var self = this;

        if (this.element.is(':disabled')) {
          return;
        }

        if (this.popup && !this.popup.hasClass('is-hidden')) {
          self.closeTimePopup();
        }

        // Build a different Time Popup based on settings
        switch(settings.mode) {
          case 'range':
            self.buildRangePopup();
            self.setupRangeEvents();
            break;
          default:
            self.buildStandardPopup();
            self.setupStandardEvents();
        }
      },

      buildStandardPopup: function() {
        var self = this,
          popupContent = $('<div class="timepicker-popup-content"></div>'),
          initValues = self.getTimeFromField(),
          hourSelect, minuteSelect, periodSelect,
          selected;

        var timeParts = $('<div class="time-parts"></div>').appendTo(popupContent);

        // Build the inner-picker HTML
        var hourCounter = this.show24Hours ? 0 : 1,
          maxHourCount = this.show24Hours ? 24 : 13;
        hourSelect = $('<select id="timepicker-hours" class="hours dropdown"></select>');

        while(hourCounter < maxHourCount) {
          selected = '';
          if (initValues.hours === hourCounter) {
            selected = ' selected';
          }
          hourSelect.append($('<option' + selected + '>' + hourCounter + '</option>'));
          hourCounter++;
        }
        timeParts.append($('<label for="timepicker-hours" class="audible">Hours</label>'));
        timeParts.append(hourSelect);
        timeParts.append($('<span class="label">&nbsp;:&nbsp;</span>'));

        var minuteCounter = 0;
        minuteSelect = $('<select id="timepicker-minutes" class="minutes dropdown"></select>');

        while(minuteCounter < 59) {
          var textValue = minuteCounter < 10 ? '0' + minuteCounter : minuteCounter;

          selected = '';
          if (initValues.minutes === minuteCounter) {
            selected = ' selected';
          }
          minuteSelect.append($('<option' + selected + '>' + textValue + '</option>'));
          minuteCounter = minuteCounter + 5;
        }
        timeParts.append($('<label for="timepicker-minutes" class="audible">Minutes</label>'));
        timeParts.append(minuteSelect);

        periodSelect = $('<select id="timepicker-period" class="period dropdown"></select>');
        if (!this.show24Hours) {
          timeParts.append($('<span class="label">&nbsp;&nbsp;&nbsp;</span>'));
          periodSelect.append($('<option value="am">am</option><option value="pm">pm</option>')); // TODO: Localize AM/PM With the Locale Plugin
          timeParts.append($('<label for="timepicker-period" class="audible">Period</label>'));
          timeParts.append(periodSelect);
        }

        popupContent.append('<div class="controls"><a href="#" class="set-time link">Set Time</a></div>'); // TODO: Localize

        this.trigger.popover({content: popupContent, trigger: 'immediate',
            placement: 'bottom', offset: {top: 27, left: 0}, width: '200',
            tooltipElement: '#timepicker-popup'});

        // Make adjustments to the popup HTML specific to the timepicker
        var tooltip = self.popup = this.trigger.data('tooltip').tooltip;
        tooltip.addClass('timepicker-popup');

        var ddOpts = {
          forceInputSizing: true
        };
        hourSelect.dropdown(ddOpts);
        minuteSelect.dropdown(ddOpts);
        if (!this.show24Hours) {
          periodSelect.dropdown(ddOpts);
        }

        // Set default values based on what's retrieved from the Timepicker's input field.
        hourSelect.val(initValues.hours);
        hourSelect.data('dropdown').input.val(initValues.hours);
        minuteSelect.val(initValues.minutes);
        minuteSelect.data('dropdown').input.val(initValues.minutes);
        if (!this.show24Hours) {
          periodSelect.val(initValues.period);
          periodSelect.data('dropdown').input.val(initValues.period);
        }

      },

      setupStandardEvents: function() {
        var self = this;

        self.popup.on('touchend.timepicker touchcancel.timepicker', '.set-time', function(e) {
          e.preventDefault();
          e.target.click();
        }).on('click.timepicker', '.set-time', function(e) {
          e.preventDefault();
          self.setTimeOnField();
          self.popup.hide();
        }).on('keydown.timepicker', 'input.dropdown', function(e) {
          var handled = false;

          // Pressing Esc when focused on a closed dropdown menu causes the entire popup to close.
          if (e.which === 27) {
            handled = true;
            self.popup.hide();
            self.element.focus();
          }

          if (handled) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        });

        // Listen to the popover/tooltip's "hide" event to properly close out the popover's inner controls.
        self.trigger.one('hide', function() {
          self.closeTimePopup();
        }).one('open', function() {
          self.popup.find('#timepicker-hours-shdo').focus();
        });
      },

      buildRangePopup: function() {
        // TODO: Build this
      },

      setupRangeEvents: function() {
        // TODO: Build this
      },

      getTimeFromField: function() {
        var val = this.element.val(),
          nums = val.split(':'),
          hours = 1,
          minutes = 0,
          period = 'am';

        nums[0] = parseInt(nums[0].replace(/ /g, ''), 10);
        if (isNaN(nums[0])) {
          nums[0] = '1';
        } else {
          nums[0] = '' + parseInt(nums[0], 10);
        }
        hours = nums[0];

        if (nums[1]) {
          // remove leading whitespace
          nums[1] = nums[1].replace(/^\s+|\s+$/g,'');
          if (!this.show24Hours) {
            nums[1] = nums[1].split(' ');
            minutes = parseInt(nums[1][0], 10);
            minutes = minutes < 10 ? '0' + minutes : '' + minutes;
            if (nums[1][1]) {
              period = '' + nums[1][1];
            }
          } else {
            minutes = parseInt(nums[1], 10);
            minutes = minutes < 10 ? '0' + minutes : '' + minutes;
          }
        } else {
          minutes = '00';
        }

        return {
          hours: hours,
          minutes: minutes,
          period: period
        };
      },

      setTimeOnField: function() {
        var hours = $('#timepicker-hours').val() || '',
          minutes = $('#timepicker-minutes').val() || '',
          period = $('#timepicker-period').val() || '',
          timeString = '' + hours + ':' + minutes + ' ' + period;

        this.element.val(timeString)
          .trigger('change')
          .trigger('updated')
          .focus()
          .validate();
      },

      closeTimePopup: function() {
        if (settings.mode === 'standard') {
          $('#timepicker-hours').data('dropdown').destroy();
          $('#timepicker-minutes').data('dropdown').destroy();
          if (!this.show24Hours) {
            $('#timepicker-period').data('dropdown').destroy();
          }
          this.popup.off('click.timepicker touchend.timepicker touchcancel.timepicker keydown.timepicker');
        }
      },

      enable: function() {
        this.element.prop('disabled', false);
      },

      disable: function() {
        this.element.prop('disabled', true);
      },

      isDisabled: function() {
        return this.element.prop('disabled');
      },

      // Teardown
      destroy: function() {
        this.trigger.off('keydown.timepicker');
        this.element.off('focus.timepicker keydown.timepicker');
        if (this.popup) {
          this.popup.hide(); // closes the timepicker popup
        }

        this.trigger.remove();
        this.element.data('mask').destroy();
        if (this.origTimeFormat) {
          this.element.attr('data-time-format', this.originalTimeFormat);
        }
        $.removeData(this.element[0], 'validate');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        settings = $.extend(instance.settings, settings, options);
        instance.setup().build();
      } else {
        instance = $.data(this, pluginName, new TimePicker(this, settings));
        instance.settings = settings;
      }
    });
  };
}));
