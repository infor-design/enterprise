import { Locale } from '../locale/locale';

// The validation rules object.
// This contains all base rules for validation that come bundled as part of Soho.
// These rules can be extended.
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

  this.ValidationTypes.success = {
    type: 'success',
    titleMessageID: 'Success',
    pagingMessageID: 'SuccessOnPage',
    errorsForm: false
  };

  // TODO: deprecate confirm in favor of success
  this.ValidationTypes.confirm = this.ValidationTypes.success;

  this.ValidationTypes.info = {
    type: 'info',
    titleMessageID: 'Info',
    pagingMessageID: 'InfoOnPage',
    errorsForm: false
  };
  this.ValidationTypes.icon = {
    type: 'icon',
    titleMessageID: 'Icon',
    pagingMessageID: 'IconOnPage',
    errorsForm: false,
    icon: 'user-profile'
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

        if ($.isArray(value)) {
          return value.length > 0;
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

        this.message = Locale.translate('Required');
        let valid = true;

        // Dont show message when opening dialog
        if ($(field).is('.datepicker') && $('#monthview-popup').is(':visible')) {
          return true;
        }

        valid = field.is(':radio') ? this.isRadioChecked(field) : this.isNotEmpty(value, field);
        return valid;
      },
      message: 'Required',
      type: 'error',
      id: 'required'
    },

    // date: Validate date, datetime (24hr or 12hr am/pm)
    date: {
      check(value, field, gridInfo) {
        this.message = Locale.translate('InvalidDate');

        if (value instanceof Date) {
          return value && value.getTime && !isNaN(value.getTime());
        }

        let dateFormat = (value.indexOf(':') > -1) ? Locale.calendar().dateFormat.datetime : Locale.calendar().dateFormat.short;

        let dtApi = null;
        if (field && field.data('datepicker')) {
          dtApi = field.data('datepicker');
          dateFormat = dtApi.pattern;
        }
        if (gridInfo && gridInfo.column) {
          const col = gridInfo.column;

          if (typeof col.sourceFormat === 'string') {
            dateFormat = gridInfo.column.sourceFormat;
          } else if (typeof col.dateFormat === 'string') {
            dateFormat = gridInfo.column.dateFormat;
          }
        }	

        const isStrict = !(
          dateFormat === 'MMMM' ||
          dateFormat === 'MMM' ||
          dateFormat === 'MM' ||
          dateFormat === 'MMMM d' ||
          dateFormat === 'd MMMM' ||
          dateFormat === 'yyyy'
        );
        if (dtApi) {
          dateFormat = {
            locale: dtApi.locale.name,
            pattern: dateFormat,
            calendarName: dtApi.currentCalendar.name
          };
        }
        const parsedDate = Locale.parseDate(value, dateFormat, isStrict);
        return !(((parsedDate === undefined) && value !== ''));
      },
      message: 'Invalid Date',
      type: 'error',
      id: 'date'
    },

    // Validate date, disable dates
    availableDate: {
      check(value, field, gridInfo) {
        this.message = Locale.translate('UnavailableDate');
        let check = true;

        if (value === '') {
          return check;
        }

        if (!self.rules.date.check(value, field)) {
          // not a validate date so that will fail instead
          check = false;
          this.message = '';
          return check;
        }

        const datepickerApi = field.data('datepicker');
        const options = datepickerApi ? datepickerApi.settings : gridInfo ? gridInfo.column.editorOptions ? 
          gridInfo.column.editorOptions : {} : {};
        const hasOptions = Object.keys(options).length > 0;
        let d;
        let i;
        let l;
        let min;
        let max;
        let dateObj = value;
        if (typeof dateObj === 'string') {
          let format = options.dateFormat !== 'locale' ?
            options.dateFormat : Locale.calendar().dateFormat.short;
          if (options.showTime) {
            const timeFormat = options.timeFormat || Locale.calendar().timeFormat;
            format += ` ${timeFormat}`;
          }
          if (datepickerApi && datepickerApi.isIslamic) {
            format = {
              pattern: datepickerApi.pattern,
              locale: datepickerApi.locale.name
            };
          }
          if (gridInfo && gridInfo.column) {
            const col = gridInfo.column;

            if (col.sourceFormat) {
              format = (typeof col.sourceFormat === 'string' ? { pattern: col.sourceFormat } : col.sourceFormat);
            } else if (col.dateFormat) {
              format = (typeof col.dateFormat === 'string' ? { pattern: col.dateFormat } : col.dateFormat);
            }
          }
          dateObj = Locale.parseDate(dateObj, format);
        }
        if (datepickerApi && datepickerApi.isIslamic && dateObj instanceof Date) {
          dateObj = Locale.umalquraToGregorian(
            dateObj.getFullYear(),
            dateObj.getMonth(),
            dateObj.getDate()
          );
        }
        let d2 = options.useUTC ? Locale.dateToUTC(dateObj) : dateObj;

        // Custom callback
        if (d2 && hasOptions && typeof options.disable.callback === 'function') {
          return !(options.disable.callback(d2.getFullYear(), d2.getMonth(), d2.getDate()));
        }

        // TODO: The developer will have to set disabled dates in arabic as arrays,
        // will come back to this for now its not supported in arabic.
        if (d2 instanceof Array) {
          return check;
        }

        if (d2 && hasOptions) {
          min = (options.useUTC ?
            Locale.dateToUTC(new Date(options.disable.minDate)).setHours(0, 0, 0, 0) :
            new Date(options.disable.minDate).setHours(0, 0, 0, 0));
          max = (options.useUTC ?
            Locale.dateToUTC(new Date(options.disable.maxDate)).setHours(0, 0, 0, 0) :
            new Date(options.disable.maxDate).setHours(0, 0, 0, 0));

          // dayOfWeek
          if (options.disable.dayOfWeek && options.disable.dayOfWeek.indexOf(d2.getDay()) !== -1) {
            check = false;
          }

          const thisYear = d2.getFullYear();

          d2 = d2.setHours(0, 0, 0, 0);

          // min and max
          if ((d2 <= min) || (d2 >= max)) {
            check = false;
          }

          // years
          if (/string|number/.test(typeof options.disable.years)) {
            options.disable.years = [options.disable.years];
          }
          if (options.disable.years) {
            for (let i2 = 0, l2 = options.disable.years.length; i2 < l2; i2++) {
              if (thisYear === Number(options.disable.years[i2])) {
                check = false;
                break;
              }
            }
          }

          // dates
          if (options.disable.dates) {
            if (options.disable.dates.length && typeof options.disable.dates === 'string') {
              options.disable.dates = [options.disable.dates];
            }
            for (i = 0, l = options.disable.dates.length; i < l; i++) {
              d = options.useUTC ? Locale.dateToUTC(options.disable.dates[i]) :
                new Date(options.disable.dates[i]);

              if (d2 === d.setHours(0, 0, 0, 0)) {
                check = false;
                break;
              }
            }
          }
        }
        if (hasOptions) {
          check = !!(((check && !options.disable.isEnable) ||
            (!check && options.disable.isEnable)));
        }

        return check;
      },
      message: 'Unavailable Date',
      type: 'error',
      id: 'availableDate'
    },

    // Range date
    rangeDate: {
      check(value, field) {
        this.message = Locale.translate('rangeDate');
        let check = true;
        const api = field.data('datepicker');
        if (api) {
          const s = api.settings;
          const parts = value.split(s.range.separator);
          const checkRule = (rule, newvalue) => {
            field.val(newvalue);
            this.message = `${self.rules[rule].message} (${newvalue})`;
            if (!self.rules[rule].check(newvalue, field)) {
              check = false;
            }
          };
          if (value.indexOf(api.pattern) > -1) {
            if (parts.length === 1) {
              checkRule('date', parts[0]);
            } else if (parts.length === 2) {
              const part = parts[0] === api.pattern ? 1 : 0;
              checkRule('date', parts[part]);
              if (check) {
                checkRule('availableDate', parts[part]);
              }
            }
          } else if (parts.length === 1) {
            checkRule('date', parts[0]);
            if (check) {
              checkRule('availableDate', parts[0]);
            }
          } else if (parts.length === 2) {
            checkRule('date', parts[0]);
            if (check) {
              checkRule('date', parts[1]);
            }
            if (check) {
              checkRule('availableDate', parts[0]);
            }
            if (check) {
              checkRule('availableDate', parts[1]);
            }
          }
        }
        field.val(value);
        return check;
      },
      message: 'Range Dates',
      type: 'error',
      id: 'rangeDate'
    },

    email: {
      check(value) {
        this.message = Locale.translate('EmailValidation');
        const regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,16}(?:\.[a-z]{2})?)$/i;

        return (value.length) ? regex.test(value) : true;
      },
      message: 'EmailValidation',
      type: 'error',
      id: 'email'
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
      type: 'error',
      id: 'enableSubmit'
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
      type: 'error',
      id: 'emailPositive'
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
      type: 'error',
      id: 'passwordReq'
    },

    passwordConfirm: {
      check(value, field) {
        this.message = Locale.translate('PasswordConfirmValidation');
        let passwordValue = $(`input[type="password"]:not(${field.attr('id')})`, field.closest('.signin')).eq(0).val(), // eslint-disable-line
          check = ((value === passwordValue) && (self.rules.passwordReq.check(passwordValue))); // eslint-disable-line
        return (value.length) ? check : true;
      },
      message: 'PasswordConfirmValidation',
      type: 'error',
      id: 'passwordConfirm'
    },

    time: {
      check(value, field) {
        value = value.replace(/ /g, '');
        this.message = Locale.translate('InvalidTime');
        const timepicker = field && field.data('timepicker');
        const timepickerSettings = timepicker ? field.data('timepicker').settings : {};
        let pattern = timepickerSettings && timepickerSettings.timeFormat ?
          timepickerSettings.timeFormat :
          Locale.calendar().timeFormat;

        if (field.attr('data-options') && (timepickerSettings && !timepickerSettings.timeFormat)) {
          const settings = JSON.parse(field.attr('data-options'));
          if (settings.patternOptions && settings.patternOptions.format) {
            pattern = settings.patternOptions.format;
          }
        }

        const is24Hour = (pattern.match('HH') || pattern.match('H') || []).length > 0;
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
      type: 'error',
      id: 'time'
    },

    // Test validation function which always returns false
    test: {
      check(value) {
        return value === '1';
      },
      message: 'Value is not valid (test).',
      type: 'error',
      id: 'test'
    }
  };
}

const Validation = new ValidationRules();

export { Validation };
