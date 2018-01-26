import { Locale } from '../locale/locale';

/**
 * The validation rules object.
 * This contains all base rules for validation that come bundled as part of Soho.
 * These rules can be extended.
 */
function ValidationRules() {
  const self = this;

  // define standard validation types
  this.ValidationTypes = [];
  this.ValidationTypes.error = {
    type: 'error',
    titleMessageID: 'Error',
    pagingMessageID: 'ErrorOnPage',
    errorsForm: true
  };
  this.ValidationTypes.alert = {
    type: 'alert',
    titleMessageID: 'Alert',
    pagingMessageID: 'AlertOnPage',
    errorsForm: false
  };
  this.ValidationTypes.confirm = {
    type: 'confirm',
    titleMessageID: 'Confirm',
    pagingMessageID: 'ComfirmOnPage',
    errorsForm: false
  };
  this.ValidationTypes.info = {
    type: 'info',
    titleMessageID: 'Info',
    pagingMessageID: 'InfoOnPage',
    errorsForm: false
  };

  this.rules = {
    required: {
      isNotEmpty(value, field) {
        const supportsPlaceholder = !!('placeholder' in document.createElement('input'));

        if (!supportsPlaceholder && field &&
            (value === field.attr('placeholder') || value === Locale.translate('Required'))) {
          return false;
        }

        if (typeof value === 'string') {
          // strip out any HTML tags and focus only on text content.
          value = $.trim(value.replace(/<\/?[^>]*>/g, ''));
          if ($.trim(value).length === 0) {
            return false;
          }
          return true;
        }

        if (typeof value === 'number') {
          if (isNaN(value)) {
            return false;
          }
          return true;
        }

        return (!!value);
      },

      // Check if at least one radio button checked in group
      isRadioChecked(field) {
        const name = field.attr('name');
        return (name && name.length && $(`input[name="${name}"]:radio:checked`).length);
      },

      check(value, field) {
        let self = this; // eslint-disable-line

        // Check all required fields filled on modal

        let allFilled = true;
        field.closest('.modal').find('input.required, textarea.required, select.required').not(':hidden').each(function () {
          if (!self.isNotEmpty($(this).val())) {
            allFilled = false;
          }
        });

        if (allFilled) {
          field.closest('.modal').find('.btn-modal-primary').not('.no-validation').removeAttr('disabled');
        } else {
          field.closest('.modal').find('.btn-modal-primary').not('.no-validation').attr('disabled', 'disabled');
        }

        this.message = Locale.translate('Required');
        return field.is(':radio') ? this.isRadioChecked(field) : this.isNotEmpty(value, field);
      },
      message: 'Required',
      type: 'error'
    },

    // date: Validate date, datetime (24hr or 12hr am/pm)
    date: {
      check(value, field) {
        this.message = Locale.translate('InvalidDate');

        if (value instanceof Date) {
          return value && value.getTime && !isNaN(value.getTime());
        }

        let dateFormat = (value.indexOf(':') > -1) ? Locale.calendar().dateFormat.datetime : Locale.calendar().dateFormat.short;

        if (field && field.data('datepicker')) {
          dateFormat = field.data('datepicker').pattern;
        }

        const isStrict = !(dateFormat === 'MMMM d' || dateFormat === 'yyyy');
        const parsedDate = Locale.parseDate(value, dateFormat, isStrict);
        return !(((parsedDate === undefined) && value !== ''));
      },
      message: 'Invalid Date',
      type: 'error'
    },

    // Validate date, disable dates
    availableDate: {
      check(value, field) {
        this.message = Locale.translate('UnavailableDate');
        let check = true;

        // To avoid running into issues of Dates happening in different timezones,
        // create the date as UTC
        function createDateAsUTC(date) {
          return new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
          ));
        }

        if (value !== '') {
          if (self.rules.date.check(value, field)) { // if valid date
            let d;
            let i;
            let l;
            let min;
            let max;
            let d2 = createDateAsUTC(new Date(value));
            const options = field.data('datepicker').settings;

            if (options) {
              min = (createDateAsUTC(new Date(options.disable.minDate))).setHours(0, 0, 0, 0);
              max = (createDateAsUTC(new Date(options.disable.maxDate))).setHours(0, 0, 0, 0);

              // dayOfWeek
              if (options.disable.dayOfWeek.indexOf(d2.getDay()) !== -1) {
                check = false;
              }

              d2 = d2.setHours(0, 0, 0, 0);

              // min and max
              if ((d2 <= min) || (d2 >= max)) {
                check = false;
              }

              // dates
              if (options.disable.dates.length && typeof options.disable.dates === 'string') {
                options.disable.dates = [options.disable.dates];
              }
              for (i = 0, l = options.disable.dates.length; i < l; i++) {
                d = new Date(options.disable.dates[i]);
                if (d2 === d.setHours(0, 0, 0, 0)) {
                  check = false;
                  break;
                }
              }
            }
            check = !!(((check && !options.disable.isEnable) ||
              (!check && options.disable.isEnable)));
          } else { // Invalid date
            check = false;
            this.message = '';
          }
        }

        return check;
      },
      message: 'Unavailable Date',
      type: 'error'
    },

    email: {
      check(value) {
        this.message = Locale.translate('EmailValidation');
        const regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,16}(?:\.[a-z]{2})?)$/i;

        return (value.length) ? regex.test(value) : true;
      },
      message: 'EmailValidation'
    },

    enableSubmit: {
      check(value, field) {
        const submit = field.closest('.signin').find('button[type="submit"]');
        const ok = ((value.length) && (self.rules.email.check(value) ||
            self.rules.passwordConfirm.check(value, field)));

        if (ok) {
          submit.enable();
        } else {
          submit.disable();
        }
        return true;
      },
      message: '',
      type: 'error'
    },

    emailPositive: {
      check(value, field) {
        if ($.trim(value).length && !field.is('[readonly]')) {
          self.rules.emailPositive.positive = true;
          this.message = Locale.translate('EmailValidation');

          const isValid = self.rules.email.check(value, field);

          if (isValid) {
            this.message = '';
          }

          return isValid;
        }
        self.rules.emailPositive.positive = false;
        return true;
      },
      message: 'EmailValidation',
      type: 'error'
    },

    passwordReq: {
      check(value) {
        this.message = Locale.translate('PasswordValidation');
        /* Must be at least 10 characters which contain at least
        ** one lowercase letter,
        ** one uppercase letter,
        ** one numeric digit
        ** and one special character */
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{10,}$/;
        return (value.length) ? value.match(regex) : true;
      },
      message: 'PasswordValidation',
      type: 'error'
    },

    passwordConfirm: {
      check(value, field) {
        this.message = Locale.translate('PasswordConfirmValidation');
        let passwordValue = $(`input[type="password"]:not(${field.attr('id')})`, field.closest('.signin')).eq(0).val(), // eslint-disable-line
          check = ((value === passwordValue) && (self.rules.passwordReq.check(passwordValue))); // eslint-disable-line
        return (value.length) ? check : true;
      },
      message: 'PasswordConfirmValidation',
      type: 'error'
    },

    time: {
      check(value, field) {
        value = value.replace(/ /g, '');
        this.message = Locale.translate('InvalidTime');
        const timepicker = field && field.data('timepicker');
        const timepickerSettings = timepicker ? field.data('timepicker').settings : {};
        const pattern = timepickerSettings && timepickerSettings.timeFormat ?
          timepickerSettings.timeFormat :
          Locale.calendar().timeFormat;
        const is24Hour = (pattern.match('HH') || []).length > 0;
        const maxHours = is24Hour ? 24 : 12;
        const sep = value.indexOf(Locale.calendar().dateFormat.timeSeparator);
        let valueHours = 0;
        let valueMins = 0;
        let valueSecs = 0;
        let valueM;
        let timeparts;

        if (value === '') {
          return true;
        }

        valueHours = parseInt(value.substring(0, sep), 10);
        valueMins = parseInt(value.substring(sep + 1, sep + 3), 10);

        // getTimeFromField
        if (timepicker) {
          timeparts = timepicker.getTimeFromField();

          valueHours = timeparts.hours;
          valueMins = timeparts.minutes;

          if (timepicker.hasSeconds()) {
            valueSecs = timeparts.seconds;
          }
        }

        if (valueHours.toString().length < 1 || isNaN(valueHours) ||
          parseInt(valueHours, 10) < 0 || parseInt(valueHours, 10) > maxHours) {
          return false;
        }
        if (valueMins.toString().length < 1 || isNaN(valueMins) ||
          parseInt(valueMins, 10) < 0 || parseInt(valueMins, 10) > 59) {
          return false;
        }
        if (valueSecs.toString().length < 1 || isNaN(valueSecs) ||
          parseInt(valueSecs, 10) < 0 || parseInt(valueSecs, 10) > 59) {
          return false;
        }

        // AM/PM
        if (!is24Hour) {
          if (parseInt(valueHours, 10) < 1) {
            return false;
          }
          const period0 = new RegExp(Locale.calendar().dayPeriods[0], 'i');
          const period1 = new RegExp(Locale.calendar().dayPeriods[1], 'i');

          valueM = value.match(period0) || value.match(period1) || [];
          if (valueM.length === 0) {
            return false;
          }
        }

        return true;
      },
      message: 'Invalid Time',
      type: 'error'
    },

    // Test validation function, always returns false
    test: {

      check(value) {
        return value === '1';
      },

      message: 'Value is not valid (test).',
      type: 'error'
    }
  };
}

const Validation = new ValidationRules();

export { Validation };
