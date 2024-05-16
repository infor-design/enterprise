import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';
import { Environment as env } from '../../utils/environment';

const COMPONENT_NAME = 'about';

/**
 * The About Dialog Component is displays information regarding the application.
 * @class About
 * @param {object} element The component element.
 * @param {object} [settings] The component settings.
 * @param {string} [settings.appName='Infor Application Name'] The Main Application Name to display in the header.
 * @param {string} [settings.content] Additional text content to display at the top.
 * @param {string} [settings.copyrightYear=new Date().getFullYear()] The year displayed in the copyright, defaults to current year.
 * @param {boolean} [settings.deviceSpecs=true] Determines whether or not to display device information.
 * This information includes Browser, Platform, Locale and if Cookies are Enabled.
 * @param {string} [settings.productName] Additional product name information to display.
 * @param {boolean} [settings.useDefaultCopyright=true] Add the Legal Approved Infor Copyright Text.
 * @param {string} [settings.version] Semantic Version Number for example (4.0.0).
 * @param {array|object} [settings.attributes=null] Add extra attributes like id's to the toast element. For example `attributes: { name: 'id', value: 'my-unique-id' }`
 * @param {array|object} [settings.showCopyButton=true] Show copy to clipboard button
*/
const ABOUT_DEFAULTS = {
  appName: 'Infor Application Name',
  content: undefined,
  copyrightYear: new Date().getFullYear(),
  deviceSpecs: true,
  productName: undefined,
  useDefaultCopyright: true,
  version: undefined,
  showCopyButton: true
};

function About(element, settings) {
  this.settings = utils.mergeSettings(element, settings, ABOUT_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

About.prototype = {

  init() {
    return this
      .setup()
      .build()
      .handleEvents();
  },

  setup() {
    const appName = this.element.attr('data-appname');

    this.isBody = $(this.element).is('body');
    this.settings.appName = appName !== undefined ? appName.toString() : this.settings.appName;

    const content = this.element.attr('data-about-content');
    this.settings.content = content !== undefined ? content.toString() : this.settings.content;

    const copyrightYear = this.element.attr('data-copyright-year');
    this.settings.copyrightYear = copyrightYear !== undefined ?
      copyrightYear.toString() : this.settings.copyrightYear;

    const deviceSpecs = this.element.attr('data-device-specs');
    if (deviceSpecs) {
      this.settings.deviceSpecs = deviceSpecs === 'true';
    }

    const productName = this.element.attr('data-product-name');
    this.settings.productName = productName !== undefined ?
      productName.toString() : this.settings.productName;

    const useDefaultCopyright = this.element.attr('data-use-default');
    if (useDefaultCopyright !== undefined) {
      this.settings.useDefaultCopyright = useDefaultCopyright === 'true';
    }

    const version = this.element.attr('data-version');
    this.settings.version = version !== undefined ?
      version.toString() : this.settings.version;

    // Get the default copyright text and cut in the current year
    this.defaultCopyright = `${Locale.translate('AboutText')} <a class="hyperlink" href="http://www.infor.com" target="_blank">www.infor.com</a>.`;
    this.defaultCopyright = this.defaultCopyright.replace('{0}', this.settings.copyrightYear);

    return this;
  },

  build() {
    this.modal = $('<div class="modal about" id="about-modal"></div>');
    $('<div class="modal-content"></div>').appendTo(this.modal);

    const header = $('<div class="modal-header"></div>').appendTo(this.modal.find('.modal-content'));
    $('<div class="close-container"></div>')
      .append($('<button name="close" type="button" class="btn-icon btn-close hide-focus"></button>')
        .append($.createIconElement({ icon: 'close', classes: 'icon-close' }))
        .append(`<span>${Locale.translate('Close')}'</span>`))
      .appendTo(header);

    $.createIconElement({ icon: 'logo', classes: ['icon', 'about-logo'] }).attr({ viewBox: '0 0 44 44' }).appendTo(header);
    this.title = $('<h1 class="title"></h1>').text(this.settings.appName).appendTo(this.modal.find('.modal-header'));

    const body = $('<div class="modal-body"></div>').appendTo(this.modal.find('.modal-content'));

    if (this.settings.version || this.settings.productName) {
      const productAndVersion = this.settings.productName ? `${this.settings.productName} ${this.settings.version}` :
        `${this.settings.version}`;

      $('<p></p>').text(productAndVersion).appendTo(body);
    }

    if (this.settings.content) {
      $('<div class="additional-content"></div>').html(this.settings.content).appendTo(body);
    }

    if (this.settings.useDefaultCopyright || !this.settings.content) {
      $('<p></p>').html(this.defaultCopyright).appendTo(body);
    }

    if (this.settings.deviceSpecs) {
      const frLocales = Locale.currentLocale.name === 'fr-FR' || Locale.currentLocale.name === 'fr-CA';
      const localeColon = frLocales ? ' :' : ':';
      const specs = this.getDeviceSpecs();
      const text = `<span class="platform">${Locale.translate('Platform')}${localeColon} ${specs.os}</span><br>
        <span class="locale">${Locale.translate('Locale')}${localeColon} ${Locale.currentLocale.name}</span><br>
        <span class="locale">${Locale.translate('Language')}${localeColon} ${Locale.currentLanguage.name}</span><br>
        <span class="browser">${Locale.translate('Browser')}${localeColon}${` ${env.devicespecs.browserVersionName}`} ${env.devicespecs.currentBrowser} (${env.devicespecs.browserVersion})</span><br>
        <span class="locale">${Locale.translate('BrowserLanguage')}${localeColon} ${specs.locale}</span><br>
        <span class="cookiesEnabled">${Locale.translate('CookiesEnabled')}${localeColon} ${specs.cookiesEnabled}</span><br>
        <span class="version">${Locale.translate('Version')}${localeColon} ${$('html').attr('data-sohoxi-version')}</span><br>`;

      $(`<p${Locale.isRTL() ? ' dir="rtl"' : ''}></p>`).html(text).appendTo(body);
    }

    this.buttons = this.modal.find('button');

    this.modal.find('.hide-focus').one('blur', function () {
      $(this).removeClass('hide-focus');
    });

    this.element.attr('data-modal', 'about-modal');

    $('.modal-body', this.modal)[0].tabIndex = 0;

    this.modal.appendTo('body');

    this.modal.modal({
      trigger: this.isBody ? 'immediate' : 'click',
      attributes: this.settings.attributes
    });

    if (this.settings.showCopyButton) {
      $(`<button type="button" class="btn-icon" id="copy-to-clipboard" title="${Locale.translate('CopyToClipboard')}">
          <span>${Locale.translate('CopyToClipboard')}</span>
          <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
            <use href="#icon-copy"></use>
          </svg>
        </button>`).prependTo(this.modal.find('.modal-body-wrapper')).on('click', () => {
        this.copyToClipBoard();
      }).tooltip();
    }

    // Link the About API to the Modal API
    const modalAPI = this.modal.data('modal');
    modalAPI.aboutAPI = this;

    return this;
  },

  /**
   * Copy inner text to clipboard
   */
  copyToClipBoard() {
    const container = document.createElement('div');
    container.innerHTML = this.modal.find('.modal-body').html();
    container.style.position = 'fixed';
    container.style.pointerEvents = 'none';
    container.style.opacity = 0;
    document.body.appendChild(container);
    window.getSelection().removeAllRanges();
    const range = document.createRange();
    range.selectNode(container);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    document.body.removeChild(container);
  },

  /**
   * Return the browser specs. Currently returns browse, os, cookiesEnabled and locale
   * @returns {string} The specs of the browser.
   */
  getDeviceSpecs() {
    // eslint-disable-next-line compat/compat
    const locale = navigator.appName === 'Microsoft Internet Explorer' ? navigator.userLanguage : navigator.language;
    const browser = (function () {
      const ua = navigator.userAgent;
      let result = [];
      let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

      if (/trident/i.test(M[1])) {
        result = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return `IE '${result[1]}`;
      }

      if (M[1] === 'Chrome') {
        result = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (result != null) {
          return result.slice(1).join(' ').replace('OPR', 'Opera');
        }
      }

      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      result = ua.match(/version\/(\d+)/i);
      if (result !== null) {
        M.splice(1, 1, result[1]);
      }

      return M.join(' ');
    }());

    return {
      browser,
      os: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      locale,
    };
  },

  /**
   * Update the component and optionally apply new settings.
   *
   * @param  {object} settings the settings to update to.
   * @returns {object} The plugin api for chaining.
   */
  updated(settings) {
    this.settings = utils.mergeSettings(this.element, settings, this.settings);
    return this;
  },

  /**
   * Progamatically close the About dialog.
   * @returns {void}
   */
  close() {
    if (this.isBody) {
      this.destroy();
      return;
    }

    /**
     * Fires when the dialog is closing.
     * @event close
     * @memberof About
     * @property {object} event - The jquery event object
     * @property {object} ui - The dialog object
     */
    this.element.trigger('close.about');
    const modalApi = this.modal.data('modal');
    if (modalApi) {
      modalApi.close();
    }

    /**
     * Fires after the dialog is done closing and removed.
     * @event afterclose
     * @memberof About
     * @property {object} event - The jquery event object
     * @property {object} ui - The dialog object
     */
    this.element.trigger('afterclose.about');
  },

  /**
   * Teardown and remove any added markup and events.
   * @param {boolean} [noModalDestroy=false] if true, skips the routine for destroying the modal (presumably because this is called from another method that destroys the modal manually)
   * @returns {void}
   */
  destroy(noModalDestroy) {
    this.buttons.off();
    this.element.off('open.about');

    if (noModalDestroy !== true) {
      const modalApi = this.modal.data('modal');
      if (modalApi) {
        modalApi.element.off('beforeopen.about');
        modalApi.aboutAPI = null;
        modalApi.destroy();
      }
    }

    if (this.element.length > 0) {
      $.removeData(this.element[0], COMPONENT_NAME);
    }
  },

  /**
   * Add component event handlers.
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.element.on('open.about', (e) => {
      e.stopPropagation();
      this.element.trigger('click');
    });

    this.buttons.filter('[name="done"], [name="close"]').on('click.about', () => {
      this.close();
    });

    /**
    * Fires when the about dialog is opening, allowing you to veto by returning false.
    *
    * @event beforeopen
    * @memberof About
    * @property {object} event The jquery event object.
    * @property {object} ui The dialog object
    */
    this.element.trigger('beforeopen.about');
    this.modal.data('modal').element.on('beforeopen.about', () => {
      this.modal.find('.modal-body').scrollTop(0);
    });

    return this;
  }
};

export { About, COMPONENT_NAME };
