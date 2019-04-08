/* eslint-disable no-nested-ternary, no-useless-escape */
import { Environment as env } from '../../utils/environment';

// If `SohoConfig` exists with a `culturesPath` property, use that path for retrieving
// culture files. This allows manually setting the directory for the culture files.
let existingCulturePath = '';
if (typeof window.SohoConfig === 'object' && typeof window.SohoConfig.culturesPath === 'string') {
  existingCulturePath = window.SohoConfig.culturesPath;
}

/**
* The Locale component handles i18n
* Data From: http://www.unicode.org/repos/cldr-aux/json/22.1/main/
* For Docs See: http://ibm.co/1nXyNxp
* @class Locale
* @constructor
*
* @param {string} currentLocale  The Currently Set Locale
* @param {object} cultures  Contains all currently-stored cultures.
* @param {string} culturesPath  the web-server's path to culture files.
*/
const Locale = {  // eslint-disable-line

  currentLocale: { name: '', data: {} }, // default
  currentLanguage: { name: '' }, // default
  cultures: {},
  languages: {},
  culturesPath: existingCulturePath,
  defaultLocales: [
    { lang: 'af', default: 'af-ZA' },
    { lang: 'ar', default: 'ar-EG' },
    { lang: 'bg', default: 'bg-BG' },
    { lang: 'cs', default: 'cs-CZ' },
    { lang: 'da', default: 'da-DK' },
    { lang: 'de', default: 'de-DE' },
    { lang: 'el', default: 'el-GR' },
    { lang: 'en', default: 'en-US' },
    { lang: 'es', default: 'es-ES' },
    { lang: 'et', default: 'et-ET' },
    { lang: 'fi', default: 'fi-FI' },
    { lang: 'fr', default: 'fr-FR' },
    { lang: 'he', default: 'he-IL' },
    { lang: 'hi', default: 'hi-IN' },
    { lang: 'hr', default: 'hr-HR' },
    { lang: 'hu', default: 'hu-HU' },
    { lang: 'id', default: 'id-ID' },
    { lang: 'it', default: 'it-IT' },
    { lang: 'iw', default: 'he-IL' },
    { lang: 'ja', default: 'ja-JP' },
    { lang: 'ko', default: 'ko-KR' },
    { lang: 'lt', default: 'lt-LT' },
    { lang: 'lv', default: 'lv-LV' },
    { lang: 'ms', default: 'ms-bn' },
    { lang: 'nb', default: 'nb-NO' },
    { lang: 'nl', default: 'nl-NL' },
    { lang: 'no', default: 'no-NO' },
    { lang: 'pl', default: 'pl-PL' },
    { lang: 'pt', default: 'pt-PT' },
    { lang: 'ro', default: 'ro-RO' },
    { lang: 'ru', default: 'ru-RU' },
    { lang: 'sk', default: 'sk-SK' },
    { lang: 'sl', default: 'sl-SI' },
    { lang: 'sv', default: 'sv-SE' },
    { lang: 'th', default: 'th-TH' },
    { lang: 'tr', default: 'tr-TR' },
    { lang: 'uk', default: 'uk-UA' },
    { lang: 'vi', default: 'vi-VN' },
    { lang: 'zh', default: 'zh-CN' }
  ],
  supportedLocales: ['af-ZA', 'ar-EG', 'ar-SA', 'bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR',
    'en-AU', 'en-GB', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'es-AR', 'es-ES', 'es-MX',
    'es-US', 'et-EE', 'fi-FI', 'fr-CA', 'fr-FR', 'he-IL', 'hi-IN', 'hr-HR',
    'hu-HU', 'id-ID', 'it-IT', 'ja-JP', 'ko-KR', 'lt-LT', 'lv-LV', 'ms-bn', 'ms-my', 'nb-NO',
    'nl-NL', 'no-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ro-RO', 'ru-RU', 'sk-SK', 'sl-SI', 'sv-SE', 'th-TH', 'tr-TR',
    'uk-UA', 'vi-VN', 'zh-CN', 'zh-Hans', 'zh-Hant', 'zh-TW'],
  defaultLocale: 'en-US',

  /**
   * Sets the current language in the Html Header
   * @private
   * @param  {string} lang The two digit language code.
   */
  updateLanguage(lang) {
    const html = $('html');

    html.attr('lang', lang);
    if (this.isRTL()) {
      html.attr('dir', 'rtl');
    } else {
      html.removeAttr('dir');
    }

    // ICONS: Right to Left Direction
    if (this.isRTL()) {
      Locale.flipIconsHorizontally();
    }
    $('body').removeClass('busy-loading-locale');
  },

  /**
   * Get the path to the directory with the cultures
   * @private
   * @returns {string} path containing culture files.
   */
  getCulturesPath() {
    if (!this.culturesPath) {
      const scripts = document.getElementsByTagName('script');
      const partialPathMin = 'sohoxi.min.js';
      const partialPath = 'sohoxi.js';

      for (let i = 0; i < scripts.length; i++) {
        let src = scripts[i].src;

        // remove from ? to end
        const idx = src.indexOf('?');
        if (src !== '' && idx > -1) {
          src = src.substr(0, idx);
        }

        if (scripts[i].id === 'sohoxi-script') {
          return `${src.substring(0, src.lastIndexOf('/'))}/`;
        }

        if (src.indexOf(partialPathMin) > -1) {
          this.culturesPath = `${src.replace(partialPathMin, '')}cultures/`;
        }
        if (src.indexOf(partialPath) > -1) {
          this.culturesPath = `${src.replace(partialPath, '')}cultures/`;
        }
      }
    }
    return this.culturesPath;
  },

  /**
   * Checks if the culture is set as an inline script in the head tag.
   * @private
   * @returns {boolean} whether or not a culture file exists in the document header.
   */
  cultureInHead() {
    let isThere = false;
    const scripts = document.getElementsByTagName('script');
    const partialPath = 'cultures';

    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src;

      if (src.indexOf(partialPath) > -1) {
        isThere = true;
      }
    }

    return isThere;
  },

  /**
   * Internally stores a new culture file for future use.
   * @private
   * @param {string} locale The locale to check.
   * @returns {string} The actual locale to use.
   */
  correctLocale(locale) {
    // Map incorrect java locale to correct locale
    if (locale === 'in-ID') {
      locale = 'id-ID';
    }
    if (locale.substr(0, 2) === 'iw') {
      locale = 'he-IL';
    }

    const lang = locale.split('-')[0];
    if (this.supportedLocales.indexOf(locale) === -1) {
      locale = this.defaultLocales.filter(a => a.lang === lang);

      if (locale && locale[0]) {
        return locale[0].default;
      }

      locale = this.defaultLocale;
    }

    return locale;
  },

  /**
   * Check if the language is supported, if not return 'en'.
   * @private
   * @param {string} lang The locale to check.
   * @returns {string} The actual lang to use.
   */
  correctLanguage(lang) {
    let correctLanguage = this.defaultLocales.filter(a => a.lang === lang);

    if (correctLanguage && correctLanguage[0]) {
      return lang;
    }

    // Map incorrect java locale to correct locale
    if (lang === 'in') {
      correctLanguage = 'id';
    }
    if (lang === 'iw') {
      correctLanguage = 'he';
    }

    correctLanguage = this.defaultLocale.substr(0, 2);
    return correctLanguage;
  },

  /**
   * Internally stores a new culture file for future use.
   * @private
   * @param {string} locale The 4-character Locale ID
   * @param {object} data Translation data and locale-specific functions, such as calendars.
   * @param {object} langData Translation data if deperated.
   * @returns {void}
   */
  addCulture(locale, data, langData) {
    const lang = locale.substr(0, 2);

    this.cultures[locale] = data;
    this.cultures[locale].name = locale;
    this.languages[lang] = {
      name: lang,
      direction: data.direction || (langData ? langData.direction : ''),
      nativeName: data.nativeName || (langData ? langData.nativeName : ''),
      messages: data.messages || (langData ? langData.messages : {})
    };
    if (!langData) {
      delete this.cultures[locale].messages;
    }
  },

  /**
   * Append the local script to the page.
   * @private
   * @param {string} locale The locale name to append.
   * @param {boolean} isCurrent If we should set this as the current locale
   * @param {boolean} useLocale If we should resolve the promise base on locale
   * @returns {void}
   */
  appendLocaleScript(locale, isCurrent, useLocale) {
    const script = document.createElement('script');
    script.src = `${this.getCulturesPath() + locale}.js`;

    script.onload = () => {
      if (isCurrent) {
        this.setCurrentLocale(locale, this.cultures[locale]);
        this.dff.resolve(locale);
      }
      if (useLocale) {
        this.dff[locale].resolve(locale);
      }
    };

    script.onerror = () => {
      this.dff.reject();
    };

    if (typeof window.SohoConfig === 'object' && typeof window.SohoConfig.nonce === 'string') {
      script.setAttribute('nonce', window.SohoConfig.nonce);
    }

    document.head.appendChild(script);
  },

  /**
   * Sets the current locale.
   * @param {string} locale The locale to fetch and set.
   * @returns {jquery.deferred} which is resolved once the locale culture is retrieved and set
   */
  set(locale) {
    const self = this;
    this.dff = $.Deferred();
    locale = this.correctLocale(locale);

    if (locale === '') {
      self.dff.resolve();
      return this.dff.promise();
    }

    if (locale && locale !== 'en-US' && !this.cultures['en-US']) {
      this.appendLocaleScript('en-US', false);
    }

    if (locale && !this.cultures[locale] && this.currentLocale.name !== locale) {
      this.setCurrentLocale(locale);
      // Fetch the local and cache it
      this.appendLocaleScript(locale, true);
    }

    if (locale && self.currentLocale.data && self.currentLocale.dataName === locale) {
      self.dff.resolve(self.currentLocale.name);
    }

    self.setCurrentLocale(locale, self.cultures[locale]);

    if (self.cultures[locale] && this.cultureInHead()) {
      self.dff.resolve(self.currentLocale.name);
    }

    return this.dff.promise();
  },

  /**
   * Loads the locale without setting it.
   * @param {string} locale The locale to fetch and set.
   * @returns {jquery.deferred} which is resolved once the locale culture is retrieved and set
   */
  getLocale(locale) {
    const self = this;
    this.dff[locale] = $.Deferred();
    locale = this.correctLocale(locale);

    if (locale === '') {
      const dff = $.Deferred();
      dff.resolve();
      return dff.promise();
    }

    if (locale && locale !== 'en-US' && !this.cultures['en-US']) {
      this.appendLocaleScript('en-US', false, true);
    }

    if (locale && !this.cultures[locale] && this.currentLocale.name !== locale) {
      this.appendLocaleScript(locale, false, true);
    }

    if (locale && self.currentLocale.data && self.currentLocale.dataName === locale) {
      this.dff[locale].resolve(locale);
    }
    if (self.cultures[locale] && this.cultureInHead()) {
      this.dff[locale].resolve(locale);
    }

    return this.dff[locale].promise();
  },

  /**
   * Sets the current language, this can be independent and different from the current locale.
   * @param {string} lang The two digit language code to use.
   * @returns {jquery.deferred} which is resolved once the locale culture is retrieved and set
   */
  setLanguage(lang) {
    // If not call set and load it and then set back the locale after.
    // Make a new object for currentLanguage independent of currentLocale
    // Change translate to use the right one
    const currentLocale = this.currentLocale.name;

    // Map incorrect java locale to correct locale
    lang = this.correctLanguage(lang);

    // Ensure the language / culture is loaded.
    if (!this.languages[lang]) {
      this.set(lang).done(() => {
        this.set(currentLocale);
        this.setLanguage(lang);
      });
    }

    if (this.languages[lang]) {
      this.currentLanguage = this.languages[lang];
      this.updateLanguage(lang);
    } else {
      this.currentLanguage.name = lang;
    }
    return this.dff;
  },

  /**
   * Chooses a stored locale dataset and sets it as "current"
   * @private
   * @param {string} name the 4-character Locale ID
   * @param {object} data translation data and locale-specific functions, such as calendars.
   * @returns {void}
   */
  setCurrentLocale(name, data) {
    const lang = name.substr(0, 2);
    this.currentLocale.name = name;

    if (data) {
      this.currentLocale.data = data;
      this.currentLocale.dataName = name;
      this.currentLanguage = this.languages[lang];
      this.updateLanguage(lang);
    }
  },

  /**
  * Formats a date object and returns it parsed back using the current locale or settings.
  * The symbols for date formatting use the CLDR at https://bit.ly/2Jg0a6m
  * @param {date} value The date to show in the current locale.
  * @param {object} options Additional date formatting settings.
  * @returns {string} the formatted date.
  */
  formatDate(value, options) {
    if (!options) {
      options = { date: 'short' }; // can be date, time, datetime or pattern
    }
    const localeData = this.useLocale(options);

    if (!value) {
      return undefined;
    }

    if (value === '0000' || value === '000000' || value === '00000000') {
      // Means no date in some applications
      return '';
    }

    // Convert if a timezone string.
    if (!(value instanceof Date) && typeof value === 'string' && value.indexOf('Z') > -1) {
      const tDate1 = new Date(value);
      value = tDate1;
    }

    if (!(value instanceof Date) && typeof value === 'string' && value.indexOf('T') > -1) {
      const tDate1 = new Date(value);
      value = tDate1;
    }

    // Convert if a string..
    if (!(value instanceof Date) && typeof value === 'string') {
      let tDate2 = Locale.parseDate(value, options);
      if (isNaN(tDate2) && options.date === 'datetime' &&
        value.substr(4, 1) === '-' &&
        value.substr(7, 1) === '-') {
        tDate2 = new Date(
          value.substr(0, 4),
          value.substr(5, 2) - 1,
          value.substr(8, 2),
          value.substr(11, 2),
          value.substr(14, 2),
          value.substr(17, 2)
        );
      }
      value = tDate2;
    }

    if (!(value instanceof Date) && typeof value === 'number') {
      const tDate3 = new Date(value);
      value = tDate3;
    }

    if (!value) {
      return undefined;
    }

    let pattern;
    let ret = '';
    const cal = (localeData.calendars ? localeData.calendars[0] : null);

    if (options.pattern) {
      pattern = options.pattern;
    }

    if (options.date) {
      pattern = cal.dateFormat[options.date];
    }

    if (!pattern) {
      pattern = cal.dateFormat.short;
    }

    let year = (value instanceof Array ? value[0] : value.getFullYear());
    let month = (value instanceof Array ? value[1] : value.getMonth());
    let day = (value instanceof Array ? value[2] : value.getDate());
    const dayOfWeek = (value.getDay ? value.getDay() : '');
    const hours = (value instanceof Array ? value[3] : value.getHours());
    const mins = (value instanceof Array ? value[4] : value.getMinutes());
    const seconds = (value instanceof Array ? value[5] : value.getSeconds());
    const millis = (value instanceof Array ? value[6] : value.getMilliseconds());

    if (cal && cal.conversions) {
      if (options.fromGregorian) {
        const islamicParts = cal.conversions.fromGregorian(value);
        day = islamicParts[2];
        month = islamicParts[1];
        year = islamicParts[0];
      } else if (options.toGregorian) {
        const gregorianDate = cal.conversions.toGregorian(year, month, day);
        day = gregorianDate.getDate();
        month = gregorianDate.getMonth();
        year = gregorianDate.getFullYear();
      }
    }

    // Special
    pattern = pattern.replace('de', 'nnnnn');
    pattern = pattern.replace('ngày', 'nnnn');
    pattern = pattern.replace('tháng', 't1áng');
    pattern = pattern.replace('den', 'nnn');

    // Day of Month
    ret = pattern.replace('dd', this.pad(day, 2));
    ret = ret.replace('d', day);

    // years
    ret = ret.replace('yyyy', year);
    ret = ret.replace('yy', year.toString().substr(2));
    ret = ret.replace('y', year);

    // Time
    const showDayPeriods = ret.indexOf(' a') > -1;

    if (showDayPeriods && hours === 0) {
      ret = ret.replace('hh', 12);
      ret = ret.replace('h', 12);
    }

    ret = ret.replace('hh', (hours > 12 ? this.pad(hours - 12, 2) : this.pad(hours, 2)));
    ret = ret.replace('h', (hours > 12 ? hours - 12 : hours));
    ret = ret.replace('HH', this.pad(hours, 2));
    ret = ret.replace('H', hours);
    ret = ret.replace('mm', this.pad(mins, 2));
    ret = ret.replace('ss', this.pad(seconds, 2));
    ret = ret.replace('SSS', this.pad(millis, 0));

    // months
    ret = ret.replace('MMMM', cal ? cal.months.wide[month] : null); // full
    ret = ret.replace('MMM', cal ? cal.months.abbreviated[month] : null); // abreviation
    if (pattern.indexOf('MMM') === -1) {
      ret = ret.replace('MM', this.pad(month + 1, 2)); // number padded
      ret = ret.replace('M', month + 1); // number unpadded
    }

    // PM
    if (cal) {
      ret = ret.replace(' a', ` ${hours >= 12 ? cal.dayPeriods[1] : cal.dayPeriods[0]}`);
      ret = ret.replace('EEEE', cal.days.wide[dayOfWeek]); // Day of Week
    }

    // Day of Week
    if (cal) {
      ret = ret.replace('EEEE', cal.days.wide[dayOfWeek]); // Day of Week
    }
    ret = ret.replace('nnnnn', 'de');
    ret = ret.replace('nnnn', 'ngày');
    ret = ret.replace('t1áng', 'tháng');
    ret = ret.replace('nnn', 'den');

    // Timezone
    if (ret.indexOf('zz') > -1) {
      const timezoneDate = new Date();
      const shortName = this.getTimeZone(timezoneDate, 'short');
      const longName = this.getTimeZone(timezoneDate, 'long');

      ret = ret.replace('zzzz', longName);
      ret = ret.replace('zz', shortName);
    }

    return ret.trim();
  },

  /**
   * Get the timezone part of a date
   * @param  {date} date The date object to use.
   * @param  {string} timeZoneName Can be short or long.
   * @returns {string} The time zone as a string.
   */
  getTimeZone(date, timeZoneName) {
    const currentLocale = Locale.currentLocale.name || 'en-US';
    const time = date.toLocaleTimeString(currentLocale);
    let name = '';

    if (env.browser.name === 'ie' && env.browser.version === '11') {
      return (date).toTimeString().match(new RegExp('[A-Z](?!.*[\(])', 'g')).join('');
    }

    if (timeZoneName === 'long') {
      name = date.toLocaleTimeString(
        currentLocale,
        { timeZoneName: 'long' }
      );
      return name.replace(`${time} `, '');
    }

    name = date.toLocaleTimeString(
      currentLocale,
      { timeZoneName: 'short' }
    );
    return name.replace(`${time} `, '');
  },

  /**
  * Takes a date object in the current locale and adjusts it for the given timezone.
  * @param {date} date The utc date to show in the desired timezone.
  * @param {string} timeZone The timezone name to show.
  * @param {string} timeZoneName How to display the time zone name. Defaults to none. But can be short or long.
  * @returns {date} the utc date
  */
  dateToTimeZone(date, timeZone, timeZoneName) {
    if (env.browser.name === 'ie' && env.browser.version === '11') {
      return `${(date).toLocaleString(Locale.currentLocale.name)} ${(date).toTimeString().match(new RegExp('[A-Z](?!.*[\(])', 'g')).join('')}`;
    }

    return (date).toLocaleString(Locale.currentLocale.name, { timeZone, timeZoneName });
  },

  /**
  * Formats a Date Object and return it in UTC format
  * @param {date} date The date to show in the current locale.
  * @returns {date} the utc date
  */
  dateToUTC(date) {
    return new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ));
  },

  /**
  * Formats a number into the current locale using toLocaleString
  * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#Using_locales
  * @param {number} number The number to convert
  * @param {string} locale The number to convert
  * @param {object} options The number to convert
  * @returns {string} The converted number.
  */
  toLocaleString(number, locale, options) {
    if (typeof number !== 'number') {
      return '';
    }
    return number.toLocaleString(locale || Locale.currentLocale.name, options || undefined);
  },

  /**
   * Convert a number in arabic/chinese or hindi numerals to an "english" number.
   * @param  {[type]} string The string number in arabic/chinese or hindi
   * @returns {number} The english number.
   */
  convertNumberToEnglish(string) {
    const arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const devanagari = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']; // Hindi
    const chineseFinancialTraditional = ['零', '壹', '貳', '叄', '肆', '伍', '陸', '柒', '捌', '玖'];
    const chineseFinancialSimplified = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const chinese = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

    for (let i = 0; i <= 9; i++) {
      string = string.replace(arabic[i], i);
      string = string.replace('٬', '');
      string = string.replace(',', '');
      string = string.replace(devanagari[i], i);
      string = string.replace(chineseFinancialTraditional[i], i);
      string = string.replace(chineseFinancialSimplified[i], i);
      string = string.replace(chinese[i], i);

      if (i === 0) { // Second option for zero in chinese
        string = string.replace('零', i);
      }
    }
    return parseFloat(string);
  },

  /**
   * Check if the date is valid using the current locale to do so.
   * @param {date} date  The date to show in the current locale.
   * @returns {boolean} whether or not the date is valid.
   */
  isValidDate(date) {
    if (Object.prototype.toString.call(date) === '[object Date]') {
      // it is a date
      if (isNaN(date.getTime())) { // d.valueOf() could also work
        return false;
      }
      return true;
    }
    return false;
  },

  /**
   * Takes a formatted date string and parses back it into a date object
   * @param {string} dateString  The string to parse in the current format
   * @param {string|object} options  The source format for example 'yyyy-MM-dd' or { dateFormat: 'yyyy-MM-dd', locale: 'nl-NL'}
   * @param {boolean} isStrict  If true missing date parts will be considered invalid. If false the current month/day.
   * @returns {date|array|undefined} A correct date object, if islamic calendar then an array is used or undefined if invalid.
   */
  parseDate(dateString, options, isStrict) {
    if (!dateString) {
      return undefined;
    }

    let dateFormat = options;
    let locale = this.currentLocale.name;
    const thisLocaleCalendar = this.calendar();
    if (typeof options === 'object') {
      locale = options.locale || locale;
      dateFormat = options.dateFormat || this.calendar(locale).dateFormat[dateFormat.date];
    }

    if (typeof options === 'object' && options.pattern) {
      dateFormat = options.dateFormat || options.pattern;
    }

    if (!dateFormat) {
      dateFormat = this.calendar(locale).dateFormat.short;
    }

    const orgDatestring = dateString;
    if (dateString === '0000' || dateString === '000000' || dateString === '00000000') {
      // Means no date in some applications
      return undefined;
    }

    if (dateFormat.pattern) {
      dateFormat = dateFormat.pattern;
    }

    let formatParts;
    let dateStringParts;
    const dateObj = {};
    const isDateTime = (dateFormat.toLowerCase().indexOf('h') > -1);
    const isUTC = (dateString.toLowerCase().indexOf('z') > -1);
    let i;
    let l;

    if (isDateTime) {
      // Remove Timezone
      const shortTimeZone = Locale.getTimeZone(new Date(), 'short');
      const longTimeZone = Locale.getTimeZone(new Date(), 'long');
      dateString = dateString.replace(` ${shortTimeZone}`, '');
      dateString = dateString.replace(` ${longTimeZone}`, '');
      dateFormat = dateFormat.replace(' zzzz', '').replace(' zz', '');

      // Replace [space & colon & dot] with "/"
      dateFormat = dateFormat.replace(/[T\s:.-]/g, '/').replace(/z/i, '');
      dateString = dateString.replace(/[T\s:.-]/g, '/').replace(/z/i, '');
    }

    // Remove spanish de
    dateFormat = dateFormat.replace(' de ', ' ');
    dateString = dateString.replace(' de ', ' ');

    if (dateFormat === 'Mdyyyy' || dateFormat === 'dMyyyy') {
      dateString = `${dateString.substr(0, dateString.length - 4)}/${dateString.substr(dateString.length - 4, dateString.length)}`;
      dateString = `${dateString.substr(0, dateString.indexOf('/') / 2)}/${dateString.substr(dateString.indexOf('/') / 2)}`;
    }

    if (dateFormat === 'Mdyyyy') {
      dateFormat = 'M/d/yyyy';
    }

    if (dateFormat === 'dMyyyy') {
      dateFormat = 'd/M/yyyy';
    }

    if (dateFormat.indexOf(' ') !== -1) {
      dateFormat = dateFormat.replace(/[\s:.]/g, '/');
      dateString = dateString.replace(/[\s:.]/g, '/');
    }

    // Extra Check incase month has spaces
    if (dateFormat.indexOf('MMMM') > -1 && Locale.isRTL() && dateFormat) {
      const lastIdx = dateString.lastIndexOf('/');
      dateString = dateString.substr(0, lastIdx - 1).replace('/', ' ') + dateString.substr(lastIdx);
    }

    if (dateFormat.indexOf(' ') === -1 && dateFormat.indexOf('.') === -1 && dateFormat.indexOf('/') === -1 && dateFormat.indexOf('-') === -1) {
      // Remove delimeter for the data string.
      if (dateString.indexOf(' ') !== -1) {
        dateString = dateString.split(' ').join('');
      } else if (dateString.indexOf('.') !== -1) {
        dateString = dateString.split('.').join('');
      } else if (dateString.indexOf('/') !== -1) {
        dateString = dateString.split('/').join('');
      } else if (dateString.indexOf('-') !== -1) {
        dateString = dateString.split('-').join('');
      }

      let lastChar = dateFormat[0];
      let newFormat = '';
      let newDateString = '';

      for (i = 0, l = dateFormat.length; i < l; i++) {
        newDateString += (dateFormat[i] !== lastChar ? `/${dateString[i]}` : dateString[i]);
        newFormat += (dateFormat[i] !== lastChar ? `/${dateFormat[i]}` : dateFormat[i]);

        if (i > 1) {
          lastChar = dateFormat[i];
        }
      }

      dateString = newDateString;
      dateFormat = newFormat;
    }

    formatParts = dateFormat.split('/');
    dateStringParts = dateString.split('/');

    if (formatParts.length === 1) {
      formatParts = dateFormat.split('.');
    }

    if (dateStringParts.length === 1) {
      dateStringParts = dateString.split('.');
    }

    if (formatParts.length === 1) {
      formatParts = dateFormat.split('-');
    }

    if (dateStringParts.length === 1) {
      dateStringParts = dateString.split('-');
    }

    if (formatParts.length === 1) {
      formatParts = dateFormat.split(' ');
    }

    if (dateStringParts.length === 1) {
      dateStringParts = dateString.split(' ');
    }

    // Check the incoming date string's parts to make sure the values are
    // valid against the localized Date pattern.
    const month = this.getDatePart(formatParts, dateStringParts, 'M', 'MM', 'MMM', 'MMMM');
    const year = this.getDatePart(formatParts, dateStringParts, 'yy', 'yyyy');
    let hasDays = false;

    for (i = 0, l = dateStringParts.length; i < l; i++) {
      const pattern = `${formatParts[i]}`;
      const value = dateStringParts[i];
      const numberValue = parseInt(value, 10);

      if (!hasDays) {
        hasDays = pattern.toLowerCase().indexOf('d') > -1;
      }

      let lastDay;
      let abrMonth;
      let textMonths;

      switch (pattern) {
        case 'd':
          lastDay = new Date(year, month, 0).getDate();

          if (numberValue < 1 || numberValue > 31 || numberValue > lastDay) {
            return undefined;
          }
          dateObj.day = value;
          break;
        case 'dd':
          if ((numberValue < 1 || numberValue > 31) || (numberValue < 10 && value.substr(0, 1) !== '0')) {
            return undefined;
          }
          dateObj.day = value;
          break;
        case 'M':
          if (numberValue < 1 || numberValue > 12) {
            return undefined;
          }
          dateObj.month = value - 1;
          break;
        case 'MM':
          if ((numberValue < 1 || numberValue > 12) || (numberValue < 10 && value.substr(0, 1) !== '0')) {
            return undefined;
          }
          dateObj.month = value - 1;
          break;
        case 'MMM':
          abrMonth = this.calendar(locale).months.abbreviated;

          for (let len = 0; len < abrMonth.length; len++) {
            if (orgDatestring.indexOf(abrMonth[len]) > -1) {
              dateObj.month = len;
            }
          }

          break;
        case 'MMMM':
          textMonths = this.calendar(locale).months.wide;

          for (let k = 0; k < textMonths.length; k++) {
            if (orgDatestring.indexOf(textMonths[k]) > -1) {
              dateObj.month = k;
            }
          }

          break;
        case 'yy':
          dateObj.year = this.twoToFourDigitYear(value);
          break;
        case 'yyyy':
          dateObj.year = (value.length === 2) ?
            this.twoToFourDigitYear(value) : value;
          break;
        case 'h':
          if (numberValue < 0 || numberValue > 12) {
            return undefined;
          }
          dateObj.h = value;
          break;
        case 'hh':
          if (numberValue < 0 || numberValue > 12) {
            return undefined;
          }
          dateObj.h = value.length === 1 ? `0${value}` : value;
          break;
        case 'H':
          if (numberValue < 0 || numberValue > 24) {
            return undefined;
          }
          dateObj.h = value;
          break;
        case 'HH':
          if (numberValue < 0 || numberValue > 24) {
            return undefined;
          }
          dateObj.h = value.length === 1 ? `0${value}` : value;
          break;

        case 'ss':
          if (numberValue < 0 || numberValue > 60) {
            dateObj.ss = 0;
            break;
          }
          dateObj.ss = value;
          break;

        case 'SSS':
          dateObj.ms = value;
          break;

        case 'mm':
          if (numberValue < 0 || numberValue > 60) {
            dateObj.mm = 0;
            break;
          }
          dateObj.mm = value;
          break;

        case 'a':
          if ((value.toLowerCase() === thisLocaleCalendar.dayPeriods[0]) ||
           (value.toUpperCase() === thisLocaleCalendar.dayPeriods[0])) {
            dateObj.a = 'AM';

            if (dateObj.h) {
              if (dateObj.h === 12 || dateObj.h === '12') {
                dateObj.h = 0;
              }
            }
          }

          if ((value.toLowerCase() === thisLocaleCalendar.dayPeriods[1]) ||
           (value.toUpperCase() === thisLocaleCalendar.dayPeriods[1])) {
            dateObj.a = 'PM';

            if (dateObj.h) {
              if (dateObj.h < 12) {
                dateObj.h = parseInt(dateObj.h, 10) + 12;
              }
            }
          }
          break;
        default:
          break;
      }
    }

    dateObj.return = undefined;
    dateObj.leapYear = ((dateObj.year % 4 === 0) &&
      (dateObj.year % 100 !== 0)) || (dateObj.year % 400 === 0);

    if ((isDateTime && !dateObj.h && !dateObj.mm)) {
      return undefined;
    }

    if (!dateObj.year && dateObj.year !== 0 && !isStrict) {
      dateObj.isUndefindedYear = true;
      for (i = 0, l = formatParts.length; i < l; i++) {
        if (formatParts[i].indexOf('y') > -1 && dateStringParts[i] !== undefined) {
          dateObj.isUndefindedYear = false;
          break;
        }
      }
      if (dateObj.isUndefindedYear) {
        dateObj.year = (new Date()).getFullYear();
      } else {
        delete dateObj.year;
      }
    }

    // Fix incomelete 2 and 3 digit years
    if (dateObj.year && dateObj.year.length === 2) {
      dateObj.year = `20${dateObj.year}`;
    }

    dateObj.year = $.trim(dateObj.year);
    dateObj.day = $.trim(dateObj.day);

    if (dateObj.year === '' || (dateObj.year && !((`${dateObj.year}`).length === 2 || (`${dateObj.year}`).length === 4))) {
      delete dateObj.year;
    }

    if (!dateObj.month && dateObj.month !== 0 && !isStrict) {
      dateObj.isUndefindedMonth = true;
      for (i = 0, l = formatParts.length; i < l; i++) {
        if (formatParts[i].indexOf('M') > -1 && dateStringParts[i] !== undefined) {
          dateObj.isUndefindedMonth = false;
          break;
        }
      }
      if (dateObj.isUndefindedMonth) {
        dateObj.month = (new Date()).getMonth();
      }
    }

    if (!dateObj.day && dateObj.day !== 0 && (!isStrict || !hasDays)) {
      dateObj.isUndefindedDay = true;
      for (i = 0, l = formatParts.length; i < l; i++) {
        if (formatParts[i].indexOf('d') > -1 && dateStringParts[i] !== undefined) {
          dateObj.isUndefindedDay = false;
          break;
        }
      }
      if (dateObj.isUndefindedDay) {
        dateObj.day = 1;
      } else {
        delete dateObj.day;
      }
    }

    if (isDateTime) {
      if (isUTC) {
        if (dateObj.h !== undefined) {
          dateObj.return = new Date(Date.UTC(dateObj.year, dateObj.month, dateObj.day, dateObj.h, dateObj.mm)); //eslint-disable-line
        }
        if (dateObj.ss !== undefined) {
          dateObj.return = new Date(Date.UTC(dateObj.year, dateObj.month, dateObj.day, dateObj.h, dateObj.mm, dateObj.ss)); //eslint-disable-line
        }
        if (dateObj.ms !== undefined) {
          dateObj.return = new Date(Date.UTC(dateObj.year, dateObj.month, dateObj.day, dateObj.h, dateObj.mm, dateObj.ss, dateObj.ms)); //eslint-disable-line
        }
      } else {
        if (dateObj.h !== undefined) {
          dateObj.return = new Date(dateObj.year, dateObj.month, dateObj.day, dateObj.h, dateObj.mm); //eslint-disable-line
        }
        if (dateObj.ss !== undefined) {
          dateObj.return = new Date(dateObj.year, dateObj.month, dateObj.day, dateObj.h, dateObj.mm, dateObj.ss); //eslint-disable-line
        }
        if (dateObj.ms !== undefined) {
          dateObj.return = new Date(dateObj.year, dateObj.month, dateObj.day, dateObj.h, dateObj.mm, dateObj.ss, dateObj.ms); //eslint-disable-line
        }
      }
    } else {
      dateObj.return = new Date(dateObj.year, dateObj.month, dateObj.day);
    }

    if (thisLocaleCalendar.name === 'islamic-umalqura') {
      return [
        parseInt(dateObj.year, 10),
        parseInt(dateObj.month, 10),
        parseInt(dateObj.day, 10),
        parseInt(dateObj.h || 0, 10),
        parseInt(dateObj.ss || 0, 10),
        parseInt(dateObj.ms || 0, 10)
      ];
    }

    return (this.isValidDate(dateObj.return) ? dateObj.return : undefined);
  },

  /**
   * Convert the two digit year year to the correct four digit year.
   * @private
   * @param  {number} twoDigitYear The two digit year.
   * @returns {number} Converted 3 digit year.
   */
  twoToFourDigitYear(twoDigitYear) {
    return parseInt((twoDigitYear > 39 ? '19' : '20') + twoDigitYear, 10);
  },

  /**
   * Format out the date into parts.
   * @private
   * @param  {array} formatParts An array of the format bits.
   * @param  {array} dateStringParts An array of the date parts.
   * @param  {string} filter1 The first option to filter.
   * @param  {string} filter2 The second option to filter.
   * @param  {string} filter3 The third option to filter.
   * @param  {string} filter4 The fourth option to filter.
   * @returns {string} The filtered out date part.
   */
  getDatePart(formatParts, dateStringParts, filter1, filter2, filter3, filter4) {
    let ret = 0;

    $.each(dateStringParts, (i) => {
      if (filter1 === formatParts[i] ||
        filter2 === formatParts[i] ||
        filter3 === formatParts[i] ||
        filter4 === formatParts[i]) {
        ret = dateStringParts[i];
      }
    });

    return ret;
  },

  /**
   * Use the current locale data or the one passed in.
   * @private
   * @param  {object} options The options to parse.
   * @returns {object} The locale data.
   */
  useLocale(options) {
    let localeData = this.currentLocale.data;
    if (options && options.locale && this.cultures[options.locale]) {
      localeData = this.cultures[options.locale];
    }
    if (!localeData.numbers) {
      localeData.numbers = this.numbers();
    }
    return localeData;
  },

  /**
   * Use the current language data or the one passed in.
   * @private
   * @param  {object} options The options to parse.
   * @returns {object} The language data.
   */
  useLanguage(options) {
    let languageData = this.currentLanguage;
    if (options && options.locale) {
      const lang = options.locale.split('-')[0];
      return this.languages[lang];
    }
    if (options && options.language && this.languages[options.language]) {
      languageData = this.languages[options.language];
    }
    return languageData;
  },

  /**
  * Formats a decimal with thousands and padding in the current locale or settings.
  * @param {number} number The source number.
  * @param {object} options additional options (see Number Format Patterns)
  * @returns {string} the formatted number.
  */
  formatNumber(number, options) {
    const localeData = this.useLocale(options);
    let formattedNum;
    let curFormat;
    let percentFormat;
    const decimal = options && options.decimal ? options.decimal : localeData.numbers.decimal;
    let minimumFractionDigits = options && options.minimumFractionDigits !== undefined ? options.minimumFractionDigits : (options && options.style && options.style === 'currency' ? 2 : (options && options.style && options.style === 'percent') ? 0 : 2);
    let maximumFractionDigits = options && options.maximumFractionDigits !== undefined ? options.maximumFractionDigits : (options && options.style && (options.style === 'currency' || options.style === 'percent') ? 2 : (options && options.minimumFractionDigits ? options.minimumFractionDigits : 3));

    if (number === undefined || number === null || number === '') {
      return undefined;
    }

    if (options && options.style === 'integer') {
      maximumFractionDigits = 0;
      minimumFractionDigits = 0;
    }

    if (options && options.style === 'currency') {
      const sign = options && options.currencySign ? options.currencySign : localeData.currencySign;
      let format = options && options.currencyFormat ? options.currencyFormat :
        localeData.currencyFormat;

      if (!format) {
        format = '¤#,##0.00'; // default to en-us
      }
      curFormat = format.replace('¤', sign);
    }

    if (options && options.style === 'percent') {
      const percentSign = !localeData.numbers ? '%' : localeData.numbers.percentSign;

      percentFormat = !localeData.numbers ? '### %' : localeData.numbers.percentFormat;
      percentFormat = percentFormat.replace('¤', percentSign);
    }

    if (typeof number === 'string') {
      if (decimal !== '.') {
        number = number.replace(decimal, '.');
      }
      number = Locale.parseNumber(number);
    }

    if (options && options.style === 'percent') {
      // the toFixed for maximumFractionDigits + 1 means we won't loose any precision
      number = (number * 100).toFixed(minimumFractionDigits);
    }

    const parts = this.truncateDecimals(number, minimumFractionDigits, maximumFractionDigits, options && options.round).split('.');
    let groupSizes = [3, 3]; // In case there is no data
    if (localeData && localeData.numbers && localeData.numbers.groupSizes) {
      groupSizes = localeData.numbers.groupSizes;
    }
    if (options && options.groupSizes) {
      groupSizes = options.groupSizes;
    }

    const sep = options && options.group !== undefined ? options.group : localeData.numbers.group;
    const expandedNum = this.expandNumber(parts[0], groupSizes, sep);
    parts[0] = expandedNum;
    formattedNum = parts.join(decimal);

    // Position the negative at the front - There is no CLDR info for this.
    const minusSign = (localeData && localeData.numbers &&
      localeData.numbers.minusSign) ? localeData.numbers.minusSign : '-';
    const isNegative = (formattedNum.indexOf(minusSign) > -1);
    formattedNum = formattedNum.replace(minusSign, '');

    const escape = str => str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    let expr = '';

    if (minimumFractionDigits === 0) { // Not default
      expr = new RegExp(`(${escape(decimal)}[0-9]*?)0+$`);
      formattedNum = formattedNum.replace(expr, '$1'); // remove trailing zeros
    }

    if (minimumFractionDigits > 0) {
      expr = new RegExp(`(${escape(decimal)}.{${minimumFractionDigits}}[0-9]*?)0+$`);
      formattedNum = formattedNum.replace(expr, '$1'); // remove trailing zeros
    }

    expr = new RegExp(`${escape(decimal)}$`);
    formattedNum = formattedNum.replace(expr, ''); // remove trailing decimal

    if (options && options.style === 'currency') {
      formattedNum = curFormat.replace('###', formattedNum);
    }

    if (options && options.style === 'percent') {
      formattedNum = percentFormat.replace('###', formattedNum);
    }

    if (isNegative) {
      formattedNum = minusSign + formattedNum;
    }
    return formattedNum;
  },

  /**
   * Return the number of decimal places in a number
   * @private
   * @param  {number} number The starting number.
   * @returns {number} The number of decimal places.
   */
  decimalPlaces(number) {
    if (Math.floor(number) === number) {
      return 0;
    }

    if (number.toString().indexOf('.') === -1) {
      return 0;
    }
    return number.toString().split('.')[1].length || 0;
  },

  /**
   * Expand the number to the groupsize.
   * @private
   * @param  {string} numberString The number to expand
   * @param  {array} groupSizes The groupSizes option.
   * @param  {string} sep The thousands seperator option.
   * @returns {string} The expanded number.
   */
  expandNumber(numberString, groupSizes, sep) {
    let len = numberString.length;
    let isNegative = false;

    if (numberString.substr(0, 1) === '-') {
      numberString = numberString.substr(1);
      len = numberString.length;
      isNegative = true;
    }

    if (len <= 3) {
      return (isNegative ? '-' : '') + numberString;
    }

    if (groupSizes[0] === 0) {
      return (isNegative ? '-' : '') + numberString;
    }

    const firstGroup = numberString.substr(numberString.length - groupSizes[0]);
    const nthGroup = numberString.substr(0, numberString.length - groupSizes[0]);
    if (groupSizes[1] === 0) {
      return (isNegative ? '-' : '') + nthGroup + (nthGroup === '' ? '' : sep) + firstGroup;
    }
    const reversed = nthGroup.split('').reverse().join('');
    const regex = new RegExp(`.{1,${groupSizes[1]}}`, 'g');
    const reversedSplit = reversed.match(regex).join(sep);
    return (isNegative ? '-' : '') + reversedSplit.split('').reverse().join('') + sep + firstGroup;
  },

  /**
   * Truncate a number to a specific min and max digits.
   * @private
   * @param  {number} number The starting number.
   * @param  {number} minDigits Minimum number of digits to show on the decimal portion.
   * @param  {number} maxDigits Maximum number of digits to show on the decimal portion.
   * @param  {boolean} round If true round, if false truncate.
   * @returns {number} The updated number.
   */
  truncateDecimals(number, minDigits, maxDigits, round) {
    let multiplier = Math.pow(10, maxDigits);
    let adjustedNum = number * multiplier;
    let truncatedNum;

    // Round Decimals
    const decimals = this.decimalPlaces(number);

    // Handle larger numbers
    if (number.toString().length - decimals - 1 >= 10 ||
      (decimals === minDigits && decimals === maxDigits) || (decimals < maxDigits)) {
      multiplier = Math.pow(100, maxDigits);
      adjustedNum = number * multiplier;
    }

    truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    if (round && decimals >= maxDigits && adjustedNum > 0) {
      truncatedNum = Math.round(adjustedNum);
    }

    if (round && decimals <= maxDigits && decimals > 0) {
      truncatedNum = Math.round(adjustedNum);
    }

    if (decimals < maxDigits && decimals > 0) {
      truncatedNum = Math.floor(adjustedNum);
      maxDigits = Math.max(decimals, minDigits);
    }

    return (truncatedNum / multiplier).toFixed(maxDigits);
  },

  /**
   * Takes a formatted number string and returns back real number object.
   * @param {string} input  The source number (as a string).
   * @param {object} options  Any special options to pass in such as the locale.
   * @returns {number} the number as an actual Number type.
   */
  parseNumber(input, options) {
    const localeData = this.useLocale(options);
    const numSettings = localeData.numbers;
    let numString;

    numString = input;

    if (!numString) {
      return NaN;
    }

    if (typeof input === 'number') {
      numString = numString.toString();
    }

    const group = numSettings ? numSettings.group : ',';
    const decimal = numSettings ? numSettings.decimal : '.';
    const percentSign = numSettings ? numSettings.percentSign : '%';
    const currencySign = localeData.currencySign || '$';

    numString = numString.replace(new RegExp(`\\${group}`, 'g'), '');
    numString = numString.replace(decimal, '.');
    numString = numString.replace(percentSign, '');
    numString = numString.replace(currencySign, '');
    numString = numString.replace('$', '');
    numString = numString.replace(' ', '');

    return parseFloat(numString);
  },

  /**
   * Takes a translation key and returns the translation in the current locale.
   * @param {string} key  The key to search for on the string.
   * @param {object} [options] A list of options, supported are a non default locale and showAsUndefined which causes a translated phrase to be shown in square brackets
   * instead of defaulting to the default locale's version of the string.
   * @returns {string|undefined} a translated string, or nothing, depending on configuration
   */
  translate(key, options) {
    const languageData = this.useLanguage(options);
    let showAsUndefined = false;
    if (typeof options === 'boolean') {
      showAsUndefined = options;
    }
    if (typeof options === 'object') {
      showAsUndefined = options.showAsUndefined;
    }

    if (languageData.messages === undefined) {
      return showAsUndefined ? undefined : `[${key}]`;
    }

    if (languageData.messages[key] === undefined) {
      const enLang = 'en';
      // Substitue English Expression if missing
      if (!this.languages || !this.languages[enLang] || !this.languages[enLang].messages
          || this.languages[enLang].messages[key] === undefined) {
        return showAsUndefined ? undefined : `[${key}]`;
      }
      return this.languages[enLang].messages[key].value;
    }

    return languageData.messages[key].value;
  },

  /**
   * Add an object full of translations to the given locale.
   * @param {string} lang The language to add them to.
   * @param  {object} messages Strings in the form of
   */
  extendTranslations(lang, messages) {
    if (!this.languages[lang]) {
      return;
    }
    const base = this.languages[lang].messages;
    this.languages[lang].messages = $.extend(false, base, messages);
  },

  /**
   * Shortcut function to get 'first' calendar
   * @private
   * @param {string} locale The locale to use
   * @param {string} name the name of the calendar (fx: "gregorian", "islamic-umalqura")
   * @returns {object} containing calendar data.
   */
  calendar(locale, name) {
    let calendars = [];
    if (this.currentLocale.data.calendars && !locale) {
      calendars = this.currentLocale.data.calendars;
    }

    if (locale && this.cultures[locale]) {
      calendars = this.cultures[locale].calendars;
    }

    if (name && calendars) {
      for (let i = 0; i < calendars.length; i++) {
        const cal = calendars[i];
        if (cal.name === name) {
          return cal;
        }
      }
    }

    if (calendars[0]) {
      return calendars[0];
    }

    // Defaults to en-US
    return {
      dateFormat: {
        separator: '/',
        timeSeparator: ':',
        short: 'M/d/yyyy',
        medium: 'MMM d, yyyy',
        long: 'MMMM d, yyyy',
        full: 'EEEE, MMMM d, y',
        month: 'MMMM d',
        year: 'MMMM yyyy',
        timestamp: 'h:mm:ss a',
        datetime: 'M/d/yyyy h:mm a'
      },
      timeFormat: 'HH:mm:ss',
      dayPeriods: ['AM', 'PM']
    };
  },

  /**
   * Shortcut function to get numbers
   * @private
   * @returns {object} containing information for formatting numbers
   */
  numbers() {
    return this.currentLocale.data.numbers ? this.currentLocale.data.numbers : {
      percentSign: '%',
      percentFormat: '### %',
      minusSign: '-',
      decimal: '.',
      group: ','
    };
  },

  /**
   * Padd a number to the given width and decimals
   * @private
   * @param {string} n the number
   * @param {number} width the decimal with
   * @param {string} z the padding character
   * @returns {string} the padded string
   */
  pad(n, width, z) {
    z = z || '0';
    n += '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  },

  /**
   * Describes whether or not this locale is one that is read in "right-to-left" fashion.
   * @returns {boolean} whether or not this locale is "right-to-left".
   */
  isRTL() {
    return this.currentLanguage.direction === 'right-to-left';
  },

  /**
   * Takes a string and converts its contents to upper case, taking into account
   * Locale-specific character conversions.  In most cases this method will simply
   * pipe the string to `String.prototype.toUpperCase()`.
   * @private
   * @param {string} str the incoming string
   * @returns {string} modified string
   */
  toUpperCase(str) {
    if (typeof this.currentLocale.data.toUpperCase === 'function') {
      return this.currentLocale.data.toUpperCase(str);
    }

    return str.toLocaleUpperCase();
  },

  /**
   * Takes a string and converts its contents to lower case, taking into account
   * Locale-specific character conversions. In most cases this method will simply
   * pipe the string to `String.prototype.toLowerCase()`
   * @private
   * @param {string} str - the incoming string
   * @returns {string} The localized string
   */
  toLowerCase(str) {
    if (typeof this.currentLocale.data.toLowerCase === 'function') {
      return this.currentLocale.data.toLowerCase(str);
    }

    return str.toString().toLocaleLowerCase();
  },

  /**
   * Takes a string and capitalizes the first letter, taking into account Locale-specific
   * character conversions. In most cases this method will simply use a simple algorithm
   * for captializing the first letter of the string.
   * @private
   * @param {string} str the incoming string
   * @returns {string} the modified string
   */
  capitalize(str) {
    return this.toUpperCase(str.charAt(0)) + str.slice(1);
  },

  /**
   * Takes a string and capitalizes the first letter of each word in a string, taking
   * into account Locale-specific character conversions. In most cases this method
   * will simply use a simple algorithm for captializing the first letter of the string.
   * @private
   * @param {string} str the incoming string
   * @returns {string} the modified string
   */
  capitalizeWords(str) {
    const words = str.split(' ');

    for (let i = 0; i < words.length; i++) {
      words[i] = this.capitalize(words[i]);
    }

    return words.join(' ');
  },

  /**
   * Modifies a specified list of icons by flipping them horizontally to make them
   * compatible for RTL-based locales.
   * @private
   * @returns {void}
   */
  flipIconsHorizontally() {
    const icons = [
      'attach',
      'bottom-aligned',
      'bullet-list',
      'cancel',
      'cart',
      'collapse-app-tray',
      'cut',
      'document',
      'drilldown',
      'duplicate',
      'expand-app-tray',
      'export',
      'first-page',
      'folder',
      'import',
      'last-page',
      'launch',
      'left-align',
      'left-text-align',
      'left-arrow',
      'new-document',
      'next-page',
      'number-list',
      'paste',
      'previous-page',
      'quote',
      'redo',
      'refresh',
      'right-align',
      'right-arrow',
      'right-text-align',
      'save',
      'search-folder',
      'search-list',
      'search',
      'send',
      'tack',
      'tree-collapse',
      'tree-expand',
      'undo',
      'unlocked',
      'add-grid-record',
      'add-grid-row',
      'additional-help',
      'bubble',
      'bullet-steps',
      'cascade',
      'change-font',
      'clear-screen',
      'script',
      'clockwise-90',
      'close-cancel',
      'close-save',
      'contacts',
      'copy-from',
      'copy-mail',
      'copy-url',
      'counter-clockwise-90',
      'create-report',
      'delete-grid-record',
      'delete-grid-row',
      'display',
      'employee-directory',
      'export-2',
      'export-to-pdf',
      'generate-key',
      'get-more-rows',
      'group-selection',
      'headphones',
      'help',
      'helper-list-select',
      'history',
      'invoice-released',
      'language',
      'logout',
      'key',
      'lasso',
      'line-bar-chart',
      'line-chart',
      'new-expense-report',
      'new-payment-request',
      'new-time-sheet',
      'new-travel-plan',
      'no-attachment',
      'no-comment',
      'no-filter',
      'overlay-line',
      'pdf-file',
      'phone',
      'payment-request',
      'pie-chart',
      'queries',
      'quick-access',
      'refresh-current',
      'restore-user',
      'run-quick-access',
      'save-close',
      'save-new',
      'search-results-history',
      'select',
      'send-submit',
      'show-last-x-days',
      'special-item',
      'stacked',
      'timesheet',
      'unsubscribe',
      'update-preview',
      'zoom-100',
      'zoom-in',
      'zoom-out',
      'caret-left',
      'caret-right'
    ];

    $('svg').each(function () {
      const iconName = $(this).getIconName();

      if (iconName && $.inArray(iconName, icons) !== -1 && $(this).closest('.monthview').length === 0) {
        $(this).addClass('icon-rtl-rotate');
      }
    });
  }

};

// Has to delay in order to check if no culture in head since scripts load async
$(() => {
  setTimeout(() => {
    if (Locale && !Locale.cultureInHead() && !Locale.currentLocale.name) {
      Locale.set('en-US');
    }
  }, 50);
});

export { Locale };
