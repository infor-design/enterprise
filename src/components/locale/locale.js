/* eslint-disable no-nested-ternary, no-useless-escape */
import { Environment as env } from '../../utils/environment';
import { numberUtils } from '../../utils/number';
import { stringUtils } from '../../utils/string';
import { utils } from '../../utils/utils';
import { ummalquraData } from './info/umalqura-data';

// If `SohoConfig` exists with a `culturesPath` property, use that path for retrieving
// culture files. This allows manually setting the directory for the culture files.
let existingCulturePath = '';
let minifyCultures = false;
if (typeof window.SohoConfig === 'object') {
  if (typeof window.SohoConfig.culturesPath === 'string') {
    existingCulturePath = window.SohoConfig.culturesPath;
  }
  if (typeof window.SohoConfig.minifyCultures === 'boolean') {
    minifyCultures = window.SohoConfig.minifyCultures;
  }
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
* @param {boolean} minify if true, adds a `.min.js` suffix to the culture's filename.
*/
const Locale = {  // eslint-disable-line

  currentLocale: { name: '', data: {} }, // default
  currentLanguage: { name: '' }, // default
  cultures: {},
  languages: {},
  dff: [],
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
    { lang: 'et', default: 'et-EE' },
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
    { lang: 'nb', default: 'no-NO' },
    { lang: 'nn', default: 'no-NO' },
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
    'en-AU', 'en-GB', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'es-AR', 'es-ES', 'es-419', 'es-MX',
    'es-US', 'et-EE', 'fi-FI', 'fr-CA', 'fr-FR', 'he-IL', 'hi-IN', 'hr-HR',
    'hu-HU', 'id-ID', 'it-IT', 'ja-JP', 'ko-KR', 'lt-LT', 'lv-LV', 'ms-bn', 'ms-my', 'nb-NO', 'nn-NO',
    'nl-NL', 'no-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ro-RO', 'ru-RU', 'sk-SK', 'sl-SI', 'sv-SE', 'th-TH', 'tr-TR',
    'uk-UA', 'vi-VN', 'zh-CN', 'zh-Hans', 'zh-Hant', 'zh-TW'],
  translatedLocales: ['fr-CA', 'fr-FR', 'pt-BR', 'pt-PT'],
  defaultLocale: 'en-US',
  minify: minifyCultures,

  /**
   * Sets the current lang tag in the Html element
   * @private
   * @param  {string} locale The locale, if just a two digit code is passed we use the default.
   */
  updateLanguageTag(locale) {
    const html = $('html');
    if (locale.length === 2) {
      locale = this.defaultLocales.filter(a => a.lang === locale);
    }

    html.attr('lang', locale);
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
      const partialPathRegexp = /sohoxi(.min){0,1}(.{0,1}[a-z0-9]*)\.js/;

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

        if (src.match(partialPathRegexp)) {
          this.culturesPath = `${src.replace(partialPathRegexp, '')}cultures/`;
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
   * Check if the language is supported, if not return 'en'
   * and fix a few inconsistencies.
   * @private
   * @param {string} lang The locale to check.
   * @returns {string} The actual lang to use.
   */
  correctLanguage(lang) {
    let correctLanguage = this.defaultLocales.filter(a => a.lang === lang);

    if (correctLanguage && correctLanguage[0]) {
      return this.remapLanguage(lang);
    }

    correctLanguage = this.remapLanguage(lang);
    return correctLanguage;
  },

  /**
   * Adjust some languages.
   * @private
   * @param  {[type]} lang The two digit language code.
   * @returns {string} Corrected language
   */
  remapLanguage(lang) {
    let correctLanguage = lang;

    // Map incorrect java locale to correct locale
    if (lang === 'in') {
      correctLanguage = 'id';
    }
    if (lang === 'iw') {
      correctLanguage = 'he';
    }
    // Another special case
    if (lang === 'nb' || lang === 'nn') {
      correctLanguage = 'no';
    }
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
    if (!this.languages[lang] && data.messages) {
      this.languages[lang] = {
        name: lang,
        direction: data.direction || (langData ? langData.direction : ''),
        nativeName: data.nativeName || (langData ? langData.nativeName : ''),
        messages: data.messages || (langData ? langData.messages : {})
      };
      this.languages[locale] = {
        name: locale,
        direction: data.direction || (langData ? langData.direction : ''),
        nativeName: data.nativeName || (langData ? langData.nativeName : ''),
        messages: data.messages || (langData ? langData.messages : {})
      };
    } else if (!this.languages[lang] && !data.messages) {
      const parentLocale = this.parentLocale(locale);
      if (parentLocale.default && parentLocale.default !== locale &&
        !this.cultures[parentLocale.default]) {
        this.appendLocaleScript(parentLocale.default);
      }
    }
  },

  /**
   * Find the parent locale (meaning shared translations), if it exists.
   * @private
   * @param {string} locale The locale we are checking.
   * @returns {string} The parent locale.
   */
  parentLocale(locale) {
    const lang = locale.substr(0, 2);
    const match = this.defaultLocales.filter(a => a.lang === lang);
    const parentLocale = match[0] || [{ default: 'en-US' }];

    // fr-FR and fr-CA are different / do not have a default
    if (this.translatedLocales.indexOf(locale) > -1) {
      return { lang: 'fr', default: 'fr-CA' };
    }
    return parentLocale;
  },

  appendedLocales: [],

  /**
   * Append the local script to the page.
   * @private
   * @param {string} locale The locale name to append.
   * @param {boolean} isCurrent If we should set this as the current locale
   * @param {string} parentLocale If we should resolve the promise base on locale
   * @param {string} filename Optional parameter to load locale with different filename
   * @returns {void}
   */
  appendLocaleScript(locale, isCurrent, parentLocale, filename) {
    const script = document.createElement('script');
    const min = this.minify ? '.min' : '';
    script.async = false;

    if (this.appendedLocales.indexOf(locale) > -1) {
      return;
    }
    this.appendedLocales.push(locale);

    if (!filename) {
      script.src = `${this.getCulturesPath() + locale}${min}.js`;
    } else {
      script.src = `${this.getCulturesPath() + filename}${min}.js`;
    }

    script.onload = () => {
      if (isCurrent && !parentLocale) {
        this.setCurrentLocale(locale, this.cultures[locale]);
        this.dff[locale].resolve(locale);
      }
      if (parentLocale && this.dff[parentLocale]) {
        this.setCurrentLocale(locale, this.cultures[locale]);
        this.setCurrentLocale(parentLocale, this.cultures[parentLocale]);
        this.dff[parentLocale].resolve(parentLocale);
      }
      if (parentLocale && this.dff[locale] && this.cultures[locale]) {
        this.setCurrentLocale(locale, this.cultures[locale]);
        this.dff[locale].resolve(locale);
      }
      if (!isCurrent && !parentLocale && this.dff[locale]) {
        this.dff[locale].resolve(locale);
      }
    };

    script.onerror = () => {
      if (this.dff[locale]) {
        this.dff[locale].reject();
      }
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
    locale = this.correctLocale(locale);
    this.dff[locale] = $.Deferred();

    if (locale === '') {
      self.dff.resolve();
      return this.dff.promise();
    }

    if (!this.cultures['en-US']) {
      this.appendLocaleScript('en-US', locale === 'en-US');
    }

    let hasParentLocale = false;
    const parentLocale = this.parentLocale(locale);
    if (parentLocale.default && parentLocale.default !== locale &&
      !this.cultures[parentLocale.default]) {
      hasParentLocale = true;
    }

    if (!hasParentLocale && locale && !this.cultures[locale] &&
      this.currentLocale.name !== locale && locale !== 'en-US') {
      this.setCurrentLocale(locale);
      // Fetch the local and cache it
      this.appendLocaleScript(locale, true);
    }

    // Also load the default locale for that locale
    if (hasParentLocale) {
      if (parentLocale.default !== 'en-US') {
        this.appendLocaleScript(parentLocale.default, false);
      }
      this.appendLocaleScript(locale, false, parentLocale.default);
    }

    if (locale && self.currentLocale.data && self.currentLocale.dataName === locale) {
      self.dff[locale].resolve(self.currentLocale.name);
    }

    self.setCurrentLocale(locale, self.cultures[locale]);

    if (self.cultures[locale] && this.cultureInHead()) {
      self.dff[locale].resolve(self.currentLocale.name);
    }

    return this.dff[locale].promise();
  },

  /**
   * Loads the locale without setting it.
   * @param {string} locale The locale to fetch and set.
   * @param {string} filename Optional Locale's filename if different from default.
   * @returns {jquery.deferred} which is resolved once the locale culture is retrieved and set
   */
  getLocale(locale, filename) {
    if (!locale) {
      return null;
    }

    locale = this.correctLocale(locale);
    this.dff[locale] = $.Deferred();

    if (locale === '') {
      const dff = $.Deferred();
      dff.resolve();
      return dff.promise();
    }

    if (locale && locale !== 'en-US' && !this.cultures['en-US']) {
      this.appendLocaleScript('en-US', false);
    }

    if (locale && !this.cultures[locale] && this.currentLocale.name !== locale && locale !== 'en-US') {
      this.appendLocaleScript(locale, false, false, filename);
    }

    if (locale && this.currentLocale.data && this.currentLocale.dataName === locale) {
      this.dff[locale].resolve(locale);
    }
    if (this.cultures[locale] && this.cultureInHead()) {
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

    const correctLocale = this.correctLocale(lang);
    if (this.languages[lang]) {
      this.currentLanguage = this.languages[lang];
      this.updateLanguageTag(lang);
      this.dff[correctLocale] = $.Deferred();
      return this.dff[correctLocale].resolve();
    }

    this.currentLanguage.name = lang;
    return this.dff[correctLocale];
  },

  /**
   * Chooses a stored locale dataset and sets it as "current"
   * @private
   * @param {string} name the 4-character Locale ID
   * @param {object} data translation data and locale-specific functions, such as calendars.
   * @returns {void}
   */
  setCurrentLocale(name, data) {
    const lang = this.remapLanguage(name.substr(0, 2));
    this.currentLocale.name = name;

    if (data) {
      this.currentLocale.data = data;
      this.currentLocale.dataName = name;
      this.currentLanguage = {};
      this.currentLanguage.name = lang;

      if (this.languages[lang]) {
        this.currentLanguage = this.languages[lang];
        this.updateLanguageTag(name);
      }

      if (this.translatedLocales.indexOf(name) > -1) {
        this.languages[lang].direction = data.direction;
        this.languages[lang].messages = data.messages;
        this.languages[lang].name = lang;
        this.languages[lang].nativeName = data.nativeName;

        this.languages[name] = {
          direction: data.direction,
          messages: data.messages,
          name,
          nativeName: data.nativeName
        };
      }
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
    if (typeof value === 'string' && /T|Z/g.test(value)) {
      value = this.newDateObj(value);
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

    if (typeof options === 'string' && options !== '') {
      pattern = options;
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

    if (options.fromGregorian || options.toUmalqura) {
      const islamicParts = this.gregorianToUmalqura(value);
      day = islamicParts[2];
      month = islamicParts[1];
      year = islamicParts[0];
    }
    if (options.toGregorian || options.fromUmalqura) {
      const gregorianDate = this.umalquraToGregorian(year, month, day);
      day = gregorianDate.getDate();
      month = gregorianDate.getMonth();
      year = gregorianDate.getFullYear();
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
    const showDayPeriods = ret.indexOf(' a') > -1 || ret.indexOf('a') === 0;

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
    ret = ret.replace('SSS', this.pad(millis, 3));

    // months
    ret = ret.replace('MMMM', cal ? cal.months.wide[month] : null); // full
    ret = ret.replace('MMM', cal ? cal.months.abbreviated[month] : null); // abreviation
    if (pattern.indexOf('MMM') === -1) {
      ret = ret.replace('MM', this.pad(month + 1, 2)); // number padded
      ret = ret.replace('M', month + 1); // number unpadded
    }

    // PM
    if (showDayPeriods && cal) {
      ret = ret.replace(' a', ` ${hours >= 12 ? cal.dayPeriods[1] : cal.dayPeriods[0]}`);
      if (ret.indexOf('a') === 0) {
        ret = ret.replace('a', ` ${hours >= 12 ? cal.dayPeriods[1] : cal.dayPeriods[0]}`);
      }
      ret = ret.replace('EEEE', cal.days.wide[dayOfWeek]); // Day of Week
    }

    // Day of Week
    if (cal) {
      ret = ret.replace('EEEE', cal.days.wide[dayOfWeek]); // Day of Week
    }
    if (cal) {
      ret = ret.replace('EEE', cal.days.abbreviated[dayOfWeek]); // Day of Week
    }
    if (cal) {
      ret = ret.replace('EE', cal.days.narrow[dayOfWeek]); // Day of Week
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
   * Get date object by given date string.
   * @private
   * @param {string} dateStr The date string
   * @returns {object} The date object.
   */
  newDateObj(dateStr) {
    let date = new Date(dateStr);
    // Safari was not render the right date/time with timezone string
    if (env.browser.name === 'safari' && typeof dateStr === 'string' && /T|Z/g.test(dateStr)) {
      let arr = dateStr.replace(/Z/, '').replace(/T|:/g, '-').split('-');
      arr = arr.map((x, i) => +(i === 1 ? x - 1 : x));
      date = new Date(...arr);
    }
    return date;
  },

  /**
  * Formats a number into the locales hour format.
  * @param {number} hour The hours to show in the current locale.
  * @param {object} options Additional date formatting settings.
  * @returns {string} the hours in either 24 h or 12 h format
  */
  formatHour(hour, options) {
    let timeSeparator = this.calendar().dateFormat.timeSeparator;
    let locale = this.currentLocale.name;
    if (typeof options === 'object') {
      locale = options.locale || locale;
      timeSeparator = options.timeSeparator || this.calendar(locale).dateFormat.timeSeparator;
    }
    if (typeof hour === 'string' && hour.indexOf(timeSeparator) === -1) {
      timeSeparator = ':';
    }

    const date = new Date();
    if (typeof hour === 'number') {
      const split = hour.toString().split('.');
      date.setHours(split[0]);
      date.setMinutes(split[1] ? (parseFloat(`0.${split[1]}`) * 60) : 0);
    } else {
      const parts = hour.split(timeSeparator);
      date.setHours(parts[0]);
      date.setMinutes(parts[1] || 0);
    }
    return this.formatDate(date, { date: 'hour' });
  },

  /**
  * Formats a number into the locales hour format.
  * @param {number} startHour The hours to show in the current locale.
  * @param {number} endHour The hours to show in the current locale.
  * @param {object} options Additional date formatting settings.
  * @returns {string} the hours in either 24 h or 12 h format
  */
  formatHourRange(startHour, endHour, options) {
    let locale = this.currentLocale.name;
    let dayPeriods = this.calendar(locale).dayPeriods;
    let removePeriod = false;
    if (typeof options === 'object') {
      locale = options.locale || locale;
      dayPeriods = this.calendar(locale).dayPeriods;
    }
    let range = `${Locale.formatHour(startHour, options)} - ${Locale.formatHour(endHour, options)}`;

    if (range.indexOf(':00 AM -') > -1 || range.indexOf(':00 PM -') > -1) {
      removePeriod = true;
    }

    if (stringUtils.count(range, dayPeriods[0]) > 1) {
      range = range.replace(dayPeriods[0], '');
    }

    if (stringUtils.count(range, dayPeriods[1]) > 1) {
      range = range.replace(` ${dayPeriods[1]}`, '');
    }

    range = range.replace('  ', ' ');
    if (removePeriod) {
      range = range.replace(':00 -', ' -');
    }
    return range;
  },

  /**
   * Get the timezone part of a date
   * @param  {date} date The date object to use.
   * @param  {string} timeZoneName Can be short or long.
   * @returns {string} The time zone as a string.
   */
  getTimeZone(date, timeZoneName) {
    const currentLocale = Locale.currentLocale.name || 'en-US';

    if (env.browser.name === 'ie' && env.browser.version === '11') {
      return (date).toTimeString().match(new RegExp('[A-Z](?!.*[\(])', 'g')).join('');
    }

    const short = date.toLocaleDateString(currentLocale);
    const full = date.toLocaleDateString(currentLocale, { timeZoneName: timeZoneName === 'long' ? 'long' : 'short' });

    // Trying to remove date from the string in a locale-agnostic way
    const shortIndex = full.indexOf(short);
    if (shortIndex >= 0) {
      const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);

      // by this time `trimmed` should be the timezone's name with some punctuation -
      // trim it from both sides
      return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
    }

    // in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
    return full;
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
  * @param {string} groupSeparator If provided will replace with browser default character
  * @returns {string} The converted number.
  */
  toLocaleString(number, locale, options, groupSeparator) {
    if (typeof number !== 'number') {
      return '';
    }
    const args = { locale: locale || Locale.currentLocale.name, options: options || undefined };
    let n = number.toLocaleString(args.locale, args.options);
    if (!(/undefined|null/.test(typeof groupSeparator))) {
      const gSeparator = this.getSeparator(args.locale, 'group');
      if (gSeparator !== '.') {
        n = n.replace(new RegExp(gSeparator, 'g'), groupSeparator.toString());
      }
    }
    return n;
  },

  /**
  * Find browser default separator for given locale
  * @private
  * @param {string} locale The locale
  * @param {string} separatorType The separator type be found `group`|`decimal`
  * @returns {string} The browser default separator character
  */
  getSeparator(locale, separatorType) {
    const number = 1000.1;
    return Intl.NumberFormat(locale)
      .formatToParts(number)
      .find(part => part.type === separatorType)
      .value;
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
    let thisLocaleCalendar = this.calendar();

    if (typeof options === 'object') {
      locale = options.locale || locale;
      dateFormat = options.dateFormat || this.calendar(locale).dateFormat[dateFormat.date];
    }

    if (typeof options === 'object' && options.pattern) {
      dateFormat = options.dateFormat || options.pattern;
    }

    if (typeof options === 'object' && options.calendarName && options.locale) {
      thisLocaleCalendar = this.calendar(options.locale, options.language, options.calendarName);
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
    const hasDot = (dateFormat.match(/M/g) || []).length === 3 && thisLocaleCalendar &&
      thisLocaleCalendar.months && thisLocaleCalendar.months.abbreviated &&
        thisLocaleCalendar.months.abbreviated.filter(v => /\./.test(v)).length;

    if (isDateTime) {
      // Remove Timezone
      const shortTimeZone = Locale.getTimeZone(new Date(), 'short');
      const longTimeZone = Locale.getTimeZone(new Date(), 'long');
      dateString = dateString.replace(` ${shortTimeZone}`, '');
      dateString = dateString.replace(` ${longTimeZone}`, '');
      dateFormat = dateFormat.replace(' zzzz', '').replace(' zz', '');

      // Replace [space & colon & dot] with "/"
      const regex = hasDot ? /[T\s:-]/g : /[T\s:.-]/g;
      dateFormat = dateFormat.replace(regex, '/').replace(/z/i, '');
      dateString = dateString.replace(regex, '/').replace(/z/i, '');
    }

    // Remove spanish de
    dateFormat = dateFormat.replace(' de ', ' ');
    dateString = dateString.replace(' de ', ' ');

    // Fix ah
    dateFormat = dateFormat.replace('/ah/', '/a/h/');
    dateString = dateString.replace('午', '午/');

    // Remove commas
    dateFormat = dateFormat.replace(',', '');
    dateString = dateString.replace(',', '');

    // Adjust short dates where no separators or special characters are present.
    const hasMdyyyy = dateFormat.indexOf('Mdyyyy');
    const hasdMyyyy = dateFormat.indexOf('dMyyyy');
    let startIndex = -1;
    let endIndex = -1;
    if (hasMdyyyy > -1 || hasdMyyyy > -1) {
      startIndex = hasMdyyyy > -1 ? hasMdyyyy : hasdMyyyy > -1 ? hasdMyyyy : 0;
      endIndex = startIndex + dateString.indexOf('/') > -1 ? dateString.indexOf('/') : dateString.length;
      dateString = `${dateString.substr(startIndex, endIndex - 4)}/${dateString.substr(endIndex - 4, dateString.length)}`;
      dateString = `${dateString.substr(startIndex, dateString.indexOf('/') / 2)}/${dateString.substr(dateString.indexOf('/') / 2, dateString.length)}`;
    }
    if (hasMdyyyy > -1) {
      dateFormat = dateFormat.replace('Mdyyyy', 'M/d/yyyy');
    }
    if (hasdMyyyy > -1) {
      dateFormat = dateFormat.replace('dMyyyy', 'd/M/yyyy');
    }

    if (dateFormat.indexOf(' ') !== -1) {
      const regex = hasDot ? /[\s:]/g : /[\s:.]/g;
      dateFormat = dateFormat.replace(regex, '/');
      dateString = dateString.replace(regex, '/');
    }

    // Extra Check in case month has spaces
    if (dateFormat.indexOf('MMMM') > -1 && Locale.isRTL() && dateFormat &&
      dateFormat !== 'MMMM/dd' && dateFormat !== 'dd/MMMM') {
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
    let hasAmFirst = false;
    const amSetting = thisLocaleCalendar.dayPeriods[0].replace(/\./g, '');
    const pmSetting = thisLocaleCalendar.dayPeriods[1].replace(/\./g, '');

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
          dateObj.h = hasAmFirst ? dateObj.h : value;
          break;
        case 'hh':
          if (numberValue < 0 || numberValue > 12) {
            return undefined;
          }
          dateObj.h = hasAmFirst ? dateObj.h : value.length === 1 ? `0${value}` : value;
          break;
        case 'H':
          if (numberValue < 0 || numberValue > 24) {
            return undefined;
          }
          dateObj.h = hasAmFirst ? dateObj.h : value;
          break;
        case 'HH':
          if (numberValue < 0 || numberValue > 24) {
            return undefined;
          }
          dateObj.h = hasAmFirst ? dateObj.h : value.length === 1 ? `0${value}` : value;
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
          if ((value.toLowerCase() === amSetting) ||
           (value.toUpperCase() === amSetting)) {
            dateObj.a = 'AM';

            if (!dateObj.h && formatParts[i + 1] && formatParts[i + 1].toLowerCase().substr(0, 1) === 'h') {
              // in a few cases am/pm is before hours
              dateObj.h = dateStringParts[i + 1];
              hasAmFirst = true;
            }
            if (dateObj.h) {
              if (dateObj.h === 12 || dateObj.h === '12') {
                dateObj.h = 0;
              }
            }
          }

          if ((value.toLowerCase() === pmSetting) ||
           (value.toUpperCase() === pmSetting)) {
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

    const isLeap = y => ((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0);
    const closestLeap = (y) => {
      let closestLeapYear = typeof y === 'number' && !isNaN(y) ? y : (new Date()).getFullYear();
      for (let i2 = 0; i2 < 4; i2++) {
        if (isLeap(closestLeapYear)) {
          break;
        }
        closestLeapYear--;
      }
      return closestLeapYear;
    };

    dateObj.return = undefined;
    dateObj.leapYear = isLeap(dateObj.year);

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
        const isFeb29 = parseInt(dateObj.day, 10) === 29 && parseInt(dateObj.month, 10) === 1;
        dateObj.year = isFeb29 ? closestLeap() : (new Date()).getFullYear();

        if (thisLocaleCalendar.name === 'islamic-umalqura') {
          const umDate = this.gregorianToUmalqura(new Date(dateObj.year, 0, 1));
          dateObj.year = umDate[0];
        }
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
        parseInt(dateObj.mm || 0, 10),
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
    if (options && options.language && this.languages[options.language]) {
      const newData = utils.extend(true, {}, this.currentLocale.data);
      if (newData.calendars) {
        newData.calendars[0] = this.calendar(
          options.locale || this.currentLocale.name,
          options.language
        );
        return newData;
      }
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
      languageData = this.languages[lang];
    }
    if (options && options.locale &&
      this.currentLanguage.name !== this.currentLocale.name.substr(0, 2) &&
      this.languages[this.currentLanguage.name]) {
      languageData = this.languages[this.currentLanguage.name];
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
      number = Locale.parseNumber(number);
    }

    if (number.toString().indexOf('e') > -1) {
      number = number.toFixed(maximumFractionDigits + 1);
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
   * @returns {string} The updated number as a string.
   */
  truncateDecimals(number, minDigits, maxDigits, round) {
    let processed = number;
    if (round) {
      processed = numberUtils.round(number, maxDigits);
    } else {
      processed = numberUtils.truncate(number, maxDigits);
    }

    // Add zeros
    const actualDecimals = numberUtils.decimalPlaces(processed);
    if (actualDecimals < minDigits) {
      processed = processed.toString() + new Array(minDigits - actualDecimals + 1).join('0');
    }
    return processed.toString();
  },

  /**
   * Takes a formatted number string and returns back real number object.
   * @param {string} input  The source number (as a string).
   * @param {object} options  Any special options to pass in such as the locale.
   * @returns {number} The number as an actual Number type unless the number is a big int (19 significant digits), in this case a string will be returned
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

    const exp = (group === ' ') ? new RegExp(/\s/g) : new RegExp(`\\${group}`, 'g');
    numString = numString.replace(exp, '');
    numString = numString.replace(decimal, '.');
    numString = numString.replace(percentSign, '');
    numString = numString.replace(currencySign, '');
    numString = numString.replace('$', '');
    numString = numString.replace(' ', '');

    return numString.length >= 19 ? numString : parseFloat(numString);
  },

  /**
   * Takes a translation key and returns the translation in the current locale.
   * @param {string} key  The key to search for on the string.
   * @param {object} [options] A list of options, supported are a non default locale and showAsUndefined and showBrackets which causes a translated phrase to be shown in square brackets
   * instead of defaulting to the default locale's version of the string.
   * @returns {string|undefined} a translated string, or nothing, depending on configuration
   */
  translate(key, options) {
    const languageData = this.useLanguage(options);
    let showAsUndefined = false;
    let showBrackets = true;
    if (key === '&nsbp;') {
      return '';
    }
    if (typeof options === 'boolean') {
      showAsUndefined = options;
    }
    if (typeof options === 'object' && options.showAsUndefined !== undefined) {
      showAsUndefined = options.showAsUndefined;
    }
    if (typeof options === 'object' && options.showBrackets !== undefined) {
      showBrackets = options.showBrackets;
    }

    if (languageData === undefined || languageData.messages === undefined) {
      return showAsUndefined ? undefined : `${showBrackets ? '[' : ''}${key}${showBrackets ? ']' : ''}`;
    }

    if (languageData.messages[key] === undefined) {
      const enLang = 'en';
      // Substitue English Expression if missing
      if (!this.languages || !this.languages[enLang] || !this.languages[enLang].messages ||
          this.languages[enLang].messages[key] === undefined) {
        return showAsUndefined ? undefined : `${showBrackets ? '[' : ''}${key}${showBrackets ? ']' : ''}`;
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
    this.languages[lang].messages = utils.extend(true, base, messages);
  },

  /**
   * Shortcut function to get 'first' calendar
   * @private
   * @param {string} locale The locale to use
   * @param {string} lang The translations of the calendar items
   * @param {string} name the name of the calendar (fx: "gregorian", "islamic-umalqura")
   * @returns {object} containing calendar data.
   */
  calendar(locale, lang, name) {
    let calendars = [];
    if (this.currentLocale.data.calendars && !locale) {
      calendars = this.currentLocale.data.calendars;
    }

    if (lang && lang.length > 2) {
      lang = lang.substr(0, 2);
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

    if (!calendars[0]) {
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
    }
    const calendar = utils.extend(true, {}, calendars[0]);

    if (lang && locale.substr(0, 2) !== lang) {
      const defaultLocale = this.defaultLocales.filter(a => a.lang === lang);

      if (defaultLocale[0]) {
        const culture = this.cultures[defaultLocale[0].default];
        calendar.days = culture.calendars[0].days;
        calendar.months = culture.calendars[0].months;
        calendar.dayPeriods = culture.calendars[0].dayPeriods;
      }
    }
    return calendar;
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
    return !this.currentLanguage ? false :
      this.currentLanguage.direction === 'right-to-left';
  },

  /**
   * Describes whether or not the default calendar is islamic.
   * @param {string} locale The locale to check if not the current.
   * @returns {boolean} whether or not this locale is "right-to-left".
   */
  isIslamic(locale) {
    return this.calendar(locale)?.name === 'islamic-umalqura';
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
   * Convert gregorian to umalqura date.
   * @param {object} date the date
   * @returns {array} year, month, day, hours, minutes, seconds, milliseconds
   */
  gregorianToUmalqura(date) {
    // fromGregorian
    // Modified version of Amro Osama's code. From at https://github.com/kbwood/calendars/blob/master/src/js/jquery.calendars.ummalqura.js
    if (typeof date.getMonth !== 'function') {
      return null;
    }

    const getJd = (year, month, day) => {
      if (year < 0) {
        year++;
      }
      if (month < 3) {
        month += 12;
        year--;
      }
      const a = Math.floor(year / 100);
      const b = 2 - a + Math.floor(a / 4);
      return Math.floor(365.25 * (year + 4716)) +
        Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
    };
    const jd = getJd(date.getFullYear(), date.getMonth() + 1, date.getDate());

    const julianToUmalqura = (julianDate) => {
      const mcjdn = julianDate - 2400000 + 0.5;
      let index = 0;
      for (let i = 0; i < ummalquraData.length; i++) {
        if (ummalquraData[i] > mcjdn) {
          break;
        }
        index++;
      }
      const lunation = index + 15292;
      const ii = Math.floor((lunation - 1) / 12);
      const year = ii + 1;
      const month = lunation - 12 * ii;
      const day = mcjdn - ummalquraData[index - 1] + 1;
      return { year, month: month - 1, day };
    };
    const umalquraDate = julianToUmalqura(jd);

    return [
      umalquraDate.year,
      umalquraDate.month,
      umalquraDate.day,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ];
  },

  /**
   * Convert umalqura to gregorian date.
   * @param {number|array} year the year
   * @param {number} month the month
   * @param {number} day the day
   * @param {number} hours the day
   * @param {number} mins the day
   * @param {number} secs the day
   * @param {number} mills the day
   * @returns {object} the date
   */
  umalquraToGregorian(year, month, day, hours = 0, mins = 0, secs = 0, mills = 0) {
    // Modified version of Amro Osama's code. From at https://github.com/kbwood/calendars/blob/master/src/js/jquery.calendars.ummalqura.js

    // Handle if an array is passed
    if (Array.isArray(year)) {
      month = year[1];
      day = year[2] || 0;
      hours = year[3] || 0;
      mins = year[4] || 0;
      secs = year[5] || 0;
      mills = year[6] || 0;
      year = year[0];
    }

    const isNumber = n => typeof n === 'number' && !isNaN(n);
    if (!isNumber(year) || !isNumber(month) || !isNumber(day)) {
      return null;
    }

    const getJd = (y, m, d) => {
      const index = (12 * (y - 1)) + m - 15292;
      const mcjdn = d + ummalquraData[index - 1] - 1;
      return mcjdn + 2400000 - 0.5;
    };
    const jd = getJd(year, month + 1, day);

    const julianToGregorian = (julianDate) => {
      const z = Math.floor(julianDate + 0.5);
      let a = Math.floor((z - 1867216.25) / 36524.25);
      a = z + 1 + a - Math.floor(a / 4);
      const b = a + 1524;
      const c = Math.floor((b - 122.1) / 365.25);
      const d = Math.floor(365.25 * c);
      const e = Math.floor((b - d) / 30.6001);
      const gday = b - d - Math.floor(e * 30.6001);
      const gmonth = e - (e > 13.5 ? 13 : 1);
      let gyear = c - (gmonth > 2.5 ? 4716 : 4715);
      // No zero year
      if (gyear <= 0) {
        gyear--;
      }
      return { year: gyear, month: gmonth - 1, day: gday };
    };
    const gregorianDateObj = julianToGregorian(jd);

    const gregorianDate = new Date(
      gregorianDateObj.year,
      gregorianDateObj.month,
      gregorianDateObj.day,
      hours,
      mins,
      secs,
      mills
    );
    return gregorianDate;
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

export { Locale };
