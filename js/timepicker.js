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
          minuteInterval: 5, // Integer from 1 to 60.  Multiples of this value are displayed as options in the minutes dropdown.
          mode: 'standard', // options: 'standard', 'range',
          roundToInterval: false, // If a non-matching minutes value is entered, rounds the minutes value to the nearest interval when the field is blurred.
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
        this.show24Hours = this.element.attr('data-force-hour-mode') === '24' ? true :
          settings.forceHourMode === '24' ? true :
          (this.timeFormat.match('HH') || []).length > 0;

        this.origTimeFormat = this.timeFormat;
        this.timeFormat = this.show24Hours ? 'HH:mm' : 'h:mm a';
        this.element.attr('data-time-format', this.timeFormat);

        // Figure out minute intervals to display
        var minInt = this.element.attr('data-minute-interval');
        this.minuteInterval = minInt !== undefined && !isNaN(minInt) ? parseInt(minInt, 10) :
          !isNaN(settings.minuteInterval) ? parseInt(settings.minuteInterval, 10) : 5;

        var roundToInterval = this.element.attr('data-round-to-interval');
        this.roundToInterval = roundToInterval !== undefined ? (roundToInterval === 'true') :
          settings.roundToInterval ? settings.roundToInterval : false;

        var modes = ['standard', 'range'],
          mode = this.element.attr('data-time-mode');
        this.mode = mode in modes ? mode : settings.mode in modes ? settings.mode : 'standard';

        return this;
      },

      //Add any markup
      build: function() {
        //Append a Button
        this.trigger = this.element.next('svg.icon');
        if (this.trigger.length === 0) {
          this.trigger = $('<svg class="icon" focusable="false" aria-hidden="true">' +
                           '<use xlink:href="#icon-timepicker"/>' +
                           '</svg>').insertAfter(this.element);
        }

        this.addAria();

        // Add Mask and Validation plugins for time
        this.mask();

        return this;
      },

      addAria: function () {
        this.element.attr('aria-haspopup', true);

        //TODO: Confirm this with Accessibility Team
        this.label = $('label[for="'+ this.element.attr('id') + '"]');
        this.label.append('<span class="audible">' + Locale.translate('UseArrow') + '</span>');
      },

      //Attach Events used by the Control
      handleEvents: function () {
        var self = this;
        this.trigger.on('click.timepicker', function () {
          self.toggleTimePopup();
        });

        this.element.on('focus.timepicker', function () {
          self.mask();
        });

        this.handleKeys();

        this.handleBlur();

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

      handleBlur: function() {
        var self = this;

        self.element.on('blur.timepicker', function() {
          self.roundMinutes();

          // The action of closing the popup menu is set on a timer because technically there are no fields focused
          // on frame 0 of the popup menu's existence, which would cause it to close immediately on open.
          setTimeout(function() {
            if (self.isOpen() && self.popup.find(':focus').length === 0) {
              self.closeTimePopup();
            }
          }, 20);
        });
      },

      roundMinutes: function() {
        if (!this.roundToInterval) {
          return;
        }

        // separate out the minutes value from the rest of the value.
        var val = this.element.val(),
          parts = val ? val.split(':') : [],
          interval = this.minuteInterval;

        if (!parts[1]) {
          return;
        }

        if (!this.show24Hours) {
          var periodParts = parts[1].split(' ');
          parts[1] = periodParts[0];
          if (periodParts[1]) {
            parts.push(periodParts[1]);
          }
        }

        parts[1] = parseInt(parts[1], 10);
        if (parts[1] % interval === 0) {
          return;
        }

        parts[1] = Math.round(parts[1] / interval) * interval;

        parts[1] = parts[1].toString();
        parts[1] = (parts[1].length < 2 ? '0' : '') + parts[1];

        if (parts[1] === '60') {
          parts[1] = '00';
          parts[0] = (parseInt(parts[0]) + 1).toString();
        }

        var newVal = parts[0] + ':' + parts[1] + ' ' + (parts[2] ? parts[2] : '');
        this.element.val(newVal);
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
        timeParts.append($('<label for="timepicker-hours" class="audible">' + Locale.translate('TimeHours') + '</label>'));
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
          minuteCounter = minuteCounter + self.minuteInterval;
        }
        timeParts.append($('<label for="timepicker-minutes" class="audible">' + Locale.translate('TimeMinutes') + '</label>'));
        timeParts.append(minuteSelect);

        periodSelect = $('<select id="timepicker-period" class="period dropdown"></select>');
        if (!this.show24Hours) {
          timeParts.append($('<span class="label">&nbsp;&nbsp;&nbsp;</span>'));
          var localeDays = Locale.calendar().dayPeriods,
            localeCount = 0,
            regexDay = new RegExp(initValues.period, 'i'),
            realDayValue = 'AM'; // AM

          while(localeCount < 2) {
            realDayValue = localeCount === 0 ? 'AM' : 'PM';  // ? AM : PM
            selected = '';
            if (localeDays[localeCount].match(regexDay)) {
              selected = ' selected';
            }
            periodSelect.append($('<option value="' + realDayValue + '">' + localeDays[localeCount] + '</option>'));

            localeCount++;
          }
          timeParts.append($('<label for="timepicker-period" class="audible">' + Locale.translate('TimePeriod') + '</label>'));
          timeParts.append(periodSelect);
        }

        popupContent.append('<div class="modal-buttonset"><button type="button" class="btn-modal-primary set-time">' + Locale.translate('SetTime') + '</button></div>');

        this.trigger.popover({
          content: popupContent,
          trigger: 'immediate',
          placement: 'bottom',
          offset: {top: 27, left: 0},
          width: '200',
          tooltipElement: '#timepicker-popup'})
        .on('open', function(e, ui) {
          ui.find('select').dropdown();
          ui.find('button').button();

          // reposition the popover
          self.trigger.data('tooltip').position();

          // Set default values based on what's retrieved from the Timepicker's input field.
          hourSelect.val(initValues.hours);
          hourSelect.data('dropdown').input.val(initValues.hours);
          minuteSelect.val(initValues.minutes);
          minuteSelect.data('dropdown').input.val(initValues.minutes);
          if (!self.show24Hours) {
            periodSelect.val(initValues.period);
            periodSelect.data('dropdown').input.val(initValues.period);
          }

          tooltip.find('#timepicker-hours-shdo').focus();
        });

        // Make adjustments to the popup HTML specific to the timepicker
        var tooltip = self.popup = this.trigger.data('tooltip').tooltip;
        tooltip.addClass('timepicker-popup');
      },

      setupStandardEvents: function() {
        var self = this;

        self.popup.on('touchend.timepicker touchcancel.timepicker', '.set-time', function(e) {
          e.preventDefault();
          e.target.click();
        }).one('click.timepicker', '.set-time', function(e) {
          e.preventDefault();
          self.setTimeOnField();
          self.closeTimePopup();
        }).on('keydown.timepicker', 'input.dropdown', function(e) {
          var handled = false;

          // Pressing Esc when focused on a closed dropdown menu causes the entire popup to close.
          if (e.which === 27) {
            handled = true;
            self.closeTimePopup();
            self.element.focus();
          }

          // Pressing Spacebar while the popup is open submits with the new time value.
          if (e.which === 32) {
            handled = true;
            self.popup.find('.set-time').click();
          }

          // Left & Right Arrows will switch between the available dropdowns
          if (e.which === 37 || e.which === 39) {
            handled = true;
            var inputs = self.popup.find('input[id$="-shdo"]');

            if (e.which === 37) {
              var prev = inputs.eq(inputs.index(this) - 1);
              if (!prev || prev.length === 0) {
                prev = inputs.eq(inputs.length);
              }
              prev.focus();
            }

            if (e.which === 39) {
              var next = inputs.eq(inputs.index(this) + 1);
              if (!next || next.length === 0) {
                next = inputs.eq(0);
              }
              next.focus();
            }
          }

          if (handled) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        });

        // Listen to the popover/tooltip's "hide" event to properly close out the popover's inner controls.
        self.trigger.on('hide', function() {
          self.onPopupHide();
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
          period = 'AM';

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
          period = ($('#timepicker-period').val() || '').toUpperCase(),
          timeString = '' + hours + ':' + minutes + ' ' + period;

        this.element.val(timeString)
          .trigger('change')
          .trigger('updated')
          .focus()
          .validate();
      },

      // Return whether or not the calendar div is open.
      isOpen: function () {
        return (this.popup && !this.popup.hasClass('is-hidden'));
      },

      openTimePopup: function() {
        var self = this;

        // Get all current settings.
        self.setup();

        if (this.element.is(':disabled')) {
          return;
        }

        if (this.popup && !this.popup.hasClass('is-hidden')) {
          self.closeTimePopup();
        }

        // Build a different Time Popup based on settings
        if (self.mode === 'range') {
          self.buildRangePopup();
          self.setupRangeEvents();
        } else {
          self.buildStandardPopup();
          self.setupStandardEvents();
        }
      },

      // Triggers the "hide" method on the tooltip plugin.  The Timepicker officially "closes" after the popover's
      // hide event fully completes because certain events need to be turned off and certain markup needs to be
      // removed only AFTER the popover is hidden.
      closeTimePopup: function() {
        this.trigger.data('tooltip').hide();
      },

      // This gets fired on the popover's "hide" event
      onPopupHide: function() {
        if (settings.mode === 'standard') {
          $('#timepicker-hours').data('dropdown').destroy();
          $('#timepicker-minutes').data('dropdown').destroy();
          if (!this.show24Hours) {
            $('#timepicker-period').data('dropdown').destroy();
          }
          this.popup.off('click.timepicker touchend.timepicker touchcancel.timepicker keydown.timepicker');
        }
        this.trigger.off('hide open');
        this.trigger.data('tooltip').destroy();
        this.trigger.data('tooltip', undefined);
        $('#timepicker-popup').remove();
      },

      toggleTimePopup: function() {
        if (this.isOpen()) {
          this.closeTimePopup();
        } else {
          this.openTimePopup();
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
        this.element.off('focus.timepicker blur.timepicker keydown.timepicker');
        if (this.popup) {
          this.closeTimePopup();
        }

        this.trigger.remove();
        this.element.data('mask').destroy();
        this.label.find('.audible').remove();
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
