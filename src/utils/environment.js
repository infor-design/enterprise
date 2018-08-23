import { version as SOHO_XI_VERSION } from '../../package.json';
import { breakpoints } from './breakpoints';

// jQuery Components
import './debounced-resize.jquery';

// Utility Name
const UTIL_NAME = 'environment';

/**
 * @class {Environment}
 */
const Environment = {

  browser: {},

  features: {
    touch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
  },

  os: {},

  rtl: $('html').attr('dir') === 'rtl',

  /**
   * Builds run-time environment settings
   */
  set() {
    $('html').attr('data-sohoxi-version', SOHO_XI_VERSION);
    this.addBrowserClasses();
    this.addGlobalResize();
    this.addGlobalEvents();
  },

  /**
   * Global Classes for browser, version and device as needed.
   */
  addBrowserClasses() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const platform = navigator.platform;
    const html = $('html');
    let cssClasses = ''; // User-agent string

    if (ua.indexOf('Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Android') === -1) {
      cssClasses += 'is-safari ';
      this.browser.name = 'safari';
    }

    if (ua.indexOf('Chrome') !== -1) {
      cssClasses += 'is-chrome ';
      this.browser.name = 'chrome';
    }

    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    if (macosPlatforms.indexOf(platform) > -1 && !/Linux/.test(platform)) {
      cssClasses += 'is-mac ';
      this.os.name = 'Mac OS X';
    }

    if (ua.indexOf('Firefox') > 0) {
      cssClasses += 'is-firefox ';
      this.browser.name = 'firefox';
    }

    // Class-based detection for IE
    if (ua.match(/Edge\//)) {
      cssClasses += 'ie ie-edge ';
      this.browser.name = 'edge';
    }
    if (ua.match(/Trident/)) {
      cssClasses += 'ie ';
      this.browser.name = 'ie';
    }
    if (navigator.appVersion.indexOf('MSIE 8.0') > -1 ||
      ua.indexOf('MSIE 8.0') > -1 ||
      document.documentMode === 8) {
      cssClasses += 'ie8 ';
      this.browser.version = '8';
    }
    if (navigator.appVersion.indexOf('MSIE 9.0') > -1) {
      cssClasses += 'ie9 ';
      this.browser.version = '9';
    }
    if (navigator.appVersion.indexOf('MSIE 10.0') > -1) {
      cssClasses += 'ie10 ';
      this.browser.version = '10';
    } else if (ua.match(/Trident\/7\./)) {
      cssClasses += 'ie11 ';
      this.browser.version = '11';
    }

    // Class-based detection for iOS
    // /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/
    if ((/iPhone|iPod|iPad/).test(ua)) {
      cssClasses += 'ios ';
      this.os.name = 'ios';

      const iDevices = ['iPod', 'iPad', 'iPhone'];
      for (let i = 0; i < iDevices.length; i++) {
        if (new RegExp(iDevices[i]).test(ua)) {
          cssClasses += `${iDevices[i].toLowerCase()} `;
          this.device = iDevices[i];
        }
      }
    }

    if ((/Android/.test(ua))) {
      cssClasses += 'android ';
      this.os.name = 'android';
    }

    if (!this.os.name && /Linux/.test(platform)) {
      this.os.name = 'linux';
    }

    html.addClass(cssClasses);
  },

  /**
   * Setup a global resize event trigger for controls to listen to
   */
  addGlobalResize() {
    // Global resize event
    $(window).debouncedResize(() => {
      $('body').triggerHandler('resize', [window]);
      breakpoints.compare();
    });

    // Also detect whenenver a load or orientation change occurs
    $(window).on('orientationchange load', () => breakpoints.compare());
  },

  /**
   * Sets up global UI-specific event handlers
   * @returns {void}
   */
  addGlobalEvents() {
    const self = this;

    this.globalMouseActive = 0;
    this.globalTouchActive = 0;

    // Detect mouse/touch events on the body to help scrolling detection along
    $('body')
      .on(`mousedown.${UTIL_NAME}`, () => {
        ++this.globalMouseActive;
      })
      .on(`mouseup.${UTIL_NAME}`, () => {
        --this.globalMouseActive;
      })
      .on(`touchstart.${UTIL_NAME}`, () => {
        ++this.globalTouchActive;
      })
      .on(`touchend.${UTIL_NAME}`, () => {
        --this.globalTouchActive;
      });

    // On iOS, it's possible to scroll the body tag even if there's a `no-scroll` class attached
    // This listener persists and will prevent scrolling on the body tag in the event of a `no-scroll`
    // class, only in iOS environments
    $(window).on(`scroll.${UTIL_NAME}`, (e) => {
      if (self.os.name !== 'ios' || document.body.className.indexOf('no-scroll') === -1) {
        return true;
      }

      // If a mouse button or touch is still active, continue as normal
      if (this.globalTouchActive || this.globalMouseActive) {
        return true;
      }

      e.preventDefault();
      if (document.body.scrollTop > 0) {
        document.body.scrollTop = 0;
      }
      return false;
    });

    // Prevent zooming on inputs/textareas' `focusin`/`focusout` events.
    // Some components like Dropdown have this feature built in on their specified elements.
    // This particular setup prevents zooming on input fields not tied to a component wrapper.
    $('body').on(`focusin.${UTIL_NAME}`, 'input, textarea', (e) => {
      const target = e.target;
      if (target.className.indexOf('dropdown-search') > -1) {
        return;
      }

      if (self.os.name === 'ios') {
        $('head').triggerHandler('disable-zoom');
      }
    }).on(`focusout.${UTIL_NAME}`, 'input, textarea', (e) => {
      const target = e.target;
      if (target.className.indexOf('dropdown-search') > -1) {
        return;
      }

      if (self.os.name === 'ios') {
        $('head').triggerHandler('enable-zoom');
      }
    });
  },

  /**
   * Tears down global UI-specific event handlers
   * @returns {void}
   */
  removeGlobalEvents() {
    $(window).off(`scroll.${UTIL_NAME}`);

    $('body').off([
      `focusin.${UTIL_NAME}`,
      `focusout.${UTIL_NAME}`
    ].join(' '));
  }
};

/**
 * @returns {boolean} whether or not the current browser is IE11
 */
Environment.browser.isIE11 = function () {
  return Environment.browser.name === 'ie' && Environment.browser.version === '11';
};

/**
 * @returns {boolean} whether or not the current browser is IE10
 */
Environment.browser.isIE10 = function () {
  return Environment.browser.name === 'ie' && Environment.browser.version === '10';
};

/**
 * Automatically set up the environment by virtue of including this script
 */
Environment.set();

export { Environment };
