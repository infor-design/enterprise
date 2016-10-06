/**
* Timepicker Control (TODO: bitly link to docs)
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

  $.fn.timepicker = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'timepicker',
        defaults = {
          timeFormat: Locale.calendar().timeFormat || 'h:mm a', // The time format
          minuteInterval: 5, // Integer from 1 to 60.  Multiples of this value are displayed as options in the minutes dropdown.
          mode: 'standard', // options: 'standard', 'range',
          roundToInterval: false
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function TimePicker(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    TimePicker.prototype = {

      init: function() {
        this
          .setup()
          .build()
          .handleEvents()
          .roundMinutes();
      },

      // Configure any settings for the Timepicker
      setup: function() {

        function sanitizeMinuteInterval(value) {
          if (value === undefined || isNaN(value)) {
            return defaults.minuteInterval;
          }

          var intValue = parseInt(value, 10);
          return intValue > 0 && intValue < 60 ? intValue : defaults.minuteInterval;
        }

        function sanitizeTimeFormat(value) {
          if (!value || (!value.match('h') && !value.match('HH')) || !value.match('mm')) {
            return defaults.timeFormat;
          }

          return value;
        }

        function sanitizeRoundToInterval(value) {
          return value === true;
        }

        function sanitizeMode(value) {
          var modes = ['standard', 'range'];
          return $.inArray(value, modes) > -1 ? value : defaults.mode;
        }

        if (this.element.is('[data-round-to-interval]')) {
          this.settings.roundToInterval = this.getBoolean(this.element.attr('data-round-to-interval'));
        }
        if (this.element.is('[data-minute-interval]')) {
          this.settings.minuteInterval = parseInt(this.element.attr('data-minute-interval'), 10);
        }

        this.settings.timeFormat = sanitizeTimeFormat(parseInt(this.element.attr('data-force-hour-mode')) === 24 ? 'HH:mm' : this.settings.timeFormat);
        this.settings.minuteInterval = sanitizeMinuteInterval(this.settings.minuteInterval);
        this.settings.mode = sanitizeMode(this.settings.mode);
        this.settings.roundToInterval = sanitizeRoundToInterval(this.settings.roundToInterval);

        return this;
      },

      //Add any markup
      build: function() {
        //Append a Button
        this.trigger = this.element.next('svg.icon');
        if (this.trigger.length === 0) {
          this.trigger = $.createIconElement('clock').insertAfter(this.element);
        }

        this.addAria();

        // Add Mask and Validation plugins for time
        this.mask();

        return this;
      },

      addAria: function () {
        this.element.attr({
          'aria-expanded': 'false',
          'role': 'combobox'
        });

        //TODO: Confirm this with Accessibility Team
        this.label = $('label[for="'+ this.element.attr('id') + '"]');
        this.label.append('<span class="audible">' + Locale.translate('UseArrow') + '</span>');
      },

      //Attach Events used by the Control
      handleEvents: function () {
        var self = this;
        this.trigger.onTouchClick('timepicker').on('click.timepicker', function () {
          self.toggleTimePopup();
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

        this.element.on('blur.timepicker', function() {
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

      is24HourFormat: function(value) {
        if (!value) { value = this.settings.timeFormat; }
        return (value.match('HH') || []).length > 0;
      },

      getTimeSeparator: function() {
        return Locale.calendar().dateFormat.timeSeparator;
      },

      roundMinutes: function() {
        if (!this.getBoolean(this.settings.roundToInterval)) {
          return;
        }

        // separate out the minutes value from the rest of the value.
        var val = this.element.val(),
          timeSeparator = this.getTimeSeparator(),
          parts = val ? val.split(timeSeparator) : [],
          interval = this.settings.minuteInterval;

        if (!parts[1]) {
          return;
        }

        if (!this.is24HourFormat(this.settings.timeFormat)) {
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

        var newVal = parts[0] + timeSeparator + parts[1] + ' ' + (parts[2] ? parts[2] : '');
        this.element.val(newVal);
      },

      // Add masking with the mask function
      mask: function () {
        if (this.element.data('mask') && typeof this.element.data('mask') === 'object') {
          this.element.data('mask').destroy();
        }
        this.element.data('mask', undefined);

        var timeSeparator = this.getTimeSeparator(),
          mask = '##' + timeSeparator + '##' + (!this.is24HourFormat() ? ' am' : ''),
          maskMode = 'group',
          validation = 'time',
          events = {'time': 'blur'},
          customValidation = this.element.attr('data-validate'),
          customEvents = this.element.attr('data-validation-events');

        if (customValidation === 'required' && !customEvents) {
          validation = customValidation + ' ' + validation;
          $.extend(events, {'required': 'change blur'});
        }

        if (customEvents) {
          events = customEvents;
        }

        this.element
          .attr('data-validate', validation)
          .attr('data-validation-events', JSON.stringify(events))
          .mask({
            pattern: mask,
            mode: maskMode
          })
          .validate()
          .triggerHandler('updated');
      },

      buildStandardPopup: function() {
        var self = this,
          popupContent = $('<div class="timepicker-popup-content"></div>'),
          initValues = self.getTimeFromField(),
          timeSeparator = this.getTimeSeparator(),
          hourSelect, minuteSelect, periodSelect,
          selected;

        var timeParts = $('<div class="time-parts"></div>').appendTo(popupContent);

        // Build the inner-picker HTML
        var is24HourFormat = this.is24HourFormat(),
          hourCounter = is24HourFormat ? 0 : 1,
          maxHourCount = is24HourFormat ? 24 : 13;
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
        timeParts.append($('<span class="label colons">'+ timeSeparator +'</span>'));

        var minuteCounter = 0;
        minuteSelect = $('<select id="timepicker-minutes" class="minutes dropdown"></select>');

        while(minuteCounter <= 59) {
          var textValue = minuteCounter < 10 ? '0' + minuteCounter : minuteCounter;

          selected = '';
          if (initValues.minutes === minuteCounter) {
            selected = ' selected';
          }
          minuteSelect.append($('<option' + selected + '>' + textValue + '</option>'));
          minuteCounter = minuteCounter + self.settings.minuteInterval;
        }
        timeParts.append($('<label for="timepicker-minutes" class="audible">' + Locale.translate('TimeMinutes') + '</label>'));
        timeParts.append(minuteSelect);

        periodSelect = $('<select id="timepicker-period" class="period dropdown"></select>');
        if (!is24HourFormat) {
          timeParts.append($('<span class="label colons">&nbsp;</span>'));
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
          offset: {top: 27, left: -8},
          width: '200',
          tooltipElement: '#timepicker-popup'})
        .on('show.timepicker', function(e, ui) {
          ui.find('select').dropdown({
            //noSearch: true
          });
          ui.find('button').button();

          // reposition the popover
          self.trigger.data('tooltip').position();

          // Set default values based on what's retrieved from the Timepicker's input field.
          hourSelect.val(initValues.hours);
          hourSelect.data('dropdown').pseudoElem.find('span').text(initValues.hours);
          minuteSelect.val(initValues.minutes);
          minuteSelect.data('dropdown').pseudoElem.find('span').text(initValues.minutes);
          if (!self.is24HourFormat()) {
            periodSelect.val(initValues.period);
            periodSelect.data('dropdown').pseudoElem.find('span').text(initValues.period);
          }

          $(this).find('#timepicker-hours-shdo').focus();
        });

        popupContent.find('.set-time').off('click.timepicker').onTouchClick('timepicker').on('click.timepicker', function(e) {
          e.preventDefault();
          self.setTimeOnField();
          self.closeTimePopup();
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
        self.trigger.on('hide.timepicker', function() {
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
          timeSeparator = this.getTimeSeparator(),
          nums = val.split(timeSeparator),
          hours = 1,
          minutes = 0,
          period = Locale.translateDayPeriod('AM');

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
          if (!this.is24HourFormat()) {
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
          timeString = '' + hours + this.getTimeSeparator() + minutes;

        period = (!this.is24HourFormat() && period === '') ? $('#timepicker-period-shdo').val() : period;
        timeString += period ? ' ' + Locale.translateDayPeriod(period) : '';

        this.element.val(timeString)
          .trigger('change');

        this.element
          .focus();
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

        this.element.addClass('is-active');

        // Build a different Time Popup based on settings
        if (self.settings.mode === 'range') {
          self.buildRangePopup();
          self.setupRangeEvents();
        } else {
          self.buildStandardPopup();
          self.setupStandardEvents();
        }

        this.element.attr({'aria-expanded': 'true'});
      },

      // Triggers the "hide" method on the tooltip plugin.  The Timepicker officially "closes" after the popover's
      // hide event fully completes because certain events need to be turned off and certain markup needs to be
      // removed only AFTER the popover is hidden.
      closeTimePopup: function() {
        this.trigger.data('tooltip').hide();
      },

      // This gets fired on the popover's "hide" event
      onPopupHide: function() {
        if (this.settings.mode === 'standard') {
          $('#timepicker-hours').data('dropdown').destroy();
          $('#timepicker-minutes').data('dropdown').destroy();
          if (!this.is24HourFormat()) {
            $('#timepicker-period').data('dropdown').destroy();
          }
          this.popup.off('click.timepicker touchend.timepicker touchcancel.timepicker keydown.timepicker');
        }
        this.element.attr({'aria-expanded': 'false'});
        this.trigger.off('hide.timepicker show.timepicker');
        this.trigger.data('tooltip').destroy();
        this.trigger.data('tooltip', undefined);
        $('#timepicker-popup').remove();
        this.element.removeClass('is-active');
      },

      toggleTimePopup: function() {
        if (this.isOpen()) {
          this.closeTimePopup();
        } else {
          this.openTimePopup();
        }
      },

      // Getter for retrieving the value of the timefield
      // Optional parameter 'removePunctuation' that gets rid of all the value's punctatuion on return.
      value: function(removePunctuation) {
        var val = this.element.val();
        if (!removePunctuation || removePunctuation === false) {
          return val;
        }

        var timeSeparator = Locale.calendar().dateFormat.timeSeparator,
          sepRegex = new RegExp(timeSeparator, 'g');

        // Remove punctuation
        val = val.replace(sepRegex, '');

        // Add leading zero for times without a double digit hour
        var parts = val.split(' ');
        if (parts[0].length < 4) {
          val = '0' + parts[0] + (parts[1] ? parts[1] : '');
        }

        return val;
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

      // Convert a string to boolean
      getBoolean: function(val) {
        var num = +val;
        return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '');
      },

      updated: function() {
        return this
          .teardown()
          .init();
      },

      teardown: function() {
        this.trigger.off('keydown.timepicker');
        this.element.off('focus.timepicker blur.timepicker keydown.timepicker');
        if (this.popup) {
          this.closeTimePopup();
        }

        this.trigger.remove();

        var mask = this.element.data('mask');
        if (mask && typeof mask.destroy === 'function') {
          mask.destroy();
        }

        this.label.find('.audible').remove();

        return this;
      },

      // Teardown
      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], 'validate');
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
        instance = $.data(this, pluginName, new TimePicker(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
