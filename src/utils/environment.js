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
  devicespecs: {},

  /**
   * @returns {boolean} true if the page locale is currently read Right-To-Left instead
   * of the default Left-to-Right.
   */
  get rtl() {
    return $('html').attr('dir') === 'rtl';
  },

  /**
   * Builds run-time environment settings
   */
  set() {
    $('html').attr('data-sohoxi-version', SOHO_XI_VERSION);

    // Set the viewport meta tag to limit scaling
    this.viewport = document.querySelector('meta[name=viewport]');
    if (this.viewport) {
      this.viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=0');
    }

    this.addBrowserClasses();
    this.addGlobalResize();
    this.addDeviceSpecs();
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

    this.browser.isWKWebView = function () {
      return false;
    };

    if (navigator.platform.substr(0, 2) === 'iP') {
      const lte9 = /constructor/i.test(window.HTMLElement);
      const idb = !!window.indexedDB;

      if ((window.webkit && window.webkit.messageHandlers) || !lte9 || idb) {
        // WKWebView
        this.browser.name = 'wkwebview';
        cssClasses += 'is-safari is-wkwebview ';
        this.browser.isWKWebView = function () {
          return true;
        };
      }
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
      this.browser.version = navigator.appVersion.indexOf('Edge/18') > -1 ? '18' : '17';
      cssClasses += `ie-edge${this.browser.version}`;
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

  addDeviceSpecs() {
    const unknown = '-';
    const nAppVer = navigator.appVersion;
    const nUAgent = navigator.userAgent;
    let browser = navigator.appName;
    let version = ` ${parseFloat(navigator.appVersion)}`;
    let majorVersion = parseInt(navigator.appVersion, 10);
    let nameOffset;
    let verOffset;
    let ix;
    let browserVersionName = '';

    if ((verOffset = nUAgent.indexOf('Opera')) !== -1) { //eslint-disable-line
      browser = 'Opera';
      version = nUAgent.substring(verOffset + 6);
      if ((verOffset = nUAgent.indexOf('Version')) !== -1) { //eslint-disable-line
        version = nUAgent.substring(verOffset + 8);
      }
    }
    if ((verOffset = nUAgent.indexOf('OPR')) !== -1) { //eslint-disable-line
      browser = 'Opera';
      version = nUAgent.substring(verOffset + 4);
    } else if ((verOffset = nUAgent.indexOf('Edge')) !== -1) { //eslint-disable-line
      browser = 'Microsoft Edge';
      version = nUAgent.substring(verOffset + 5);
    } else if ((verOffset = nUAgent.indexOf('MSIE')) !== -1) { //eslint-disable-line
      browser = 'Microsoft Internet Explorer';
      version = nUAgent.substring(verOffset + 5);
    } else if ((verOffset = nUAgent.indexOf('Chrome')) !== -1) { //eslint-disable-line
      browser = 'Chrome';
      version = nUAgent.substring(verOffset + 7);
      if (nUAgent.indexOf('Edg') > -1) {
        browserVersionName = 'Microsoft Edge';
      }
    } else if ((verOffset = nUAgent.indexOf('Safari')) !== -1) { //eslint-disable-line
      browser = 'Safari';
      version = nUAgent.substring(verOffset + 7);
      if ((verOffset = nUAgent.indexOf('Version')) !== -1) { //eslint-disable-line
        version = nUAgent.substring(verOffset + 8);
      }
    } else if (this.browser.isWKWebView()) { //eslint-disable-line
      browser = `WKWebView`; //eslint-disable-line
      version = '';
      majorVersion = '';
    } else if ((verOffset = nUAgent.indexOf('Firefox')) !== -1) { //eslint-disable-line
      browser = 'Firefox';
      version = nUAgent.substring(verOffset + 8);
    } else if (nUAgent.indexOf('Trident/') !== -1) { //eslint-disable-line
      browser = 'Microsoft Internet Explorer';
      version = nUAgent.substring(nUAgent.indexOf('rv:') + 3);
    } else if ((nameOffset = nUAgent.lastIndexOf(' ') + 1) < (verOffset = nUAgent.lastIndexOf('/'))) { //eslint-disable-line
      browser = nUAgent.substring(nameOffset, verOffset);
      version = nUAgent.substring(verOffset + 1);
      if (browser.toLowerCase() === browser.toUpperCase()) {
        browser = navigator.appName;
      }
    }
    // Trim the version string
    if ((ix = version.indexOf(';')) !== -1) version = version.substring(0, ix); //eslint-disable-line
    if ((ix = version.indexOf(' ')) !== -1) version = version.substring(0, ix); //eslint-disable-line
    if ((ix = version.indexOf(')')) !== -1) version = version.substring(0, ix); //eslint-disable-line

    majorVersion = ` ${parseInt(version, 10)}`;
    if (isNaN(majorVersion)) {
      version = ` ${parseFloat(navigator.appVersion)}`;
      majorVersion = parseInt(navigator.appVersion, 10);
    }

    // mobile version
    const mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nAppVer);

    let os = unknown;

    const clientStrings = [
      { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
      { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
      { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
      { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
      { s: 'Android', r: /Android/ },
      { s: 'Open BSD', r: /OpenBSD/ },
      { s: 'Sun OS', r: /SunOS/ },
      { s: 'Linux', r: /(Linux|X11)/ },
      { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
      { s: 'Mac OS X', r: /Mac OS X/ },
      { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
      { s: 'UNIX', r: /UNIX/ }
    ];

    for (const id in clientStrings) { //eslint-disable-line
      const cs = clientStrings[id];
      if (cs.r.test(nUAgent)) {
        os = cs.s;
        break;
      }
    }

    let osVersion = unknown;

    if (/Windows/.test(os)) {
      osVersion = /Windows (.*)/.exec(os)[1];
    }

    switch (os) { //eslint-disable-line
      case 'Mac OS X':
        osVersion = /Mac OS X ([1-9][0-9][\.\_\d]+)/.exec(nUAgent)[1].replace(/\_/g, '.'); //eslint-disable-line
        break;

      case 'Android':
        osVersion = /Android ([\.\_\d]+)/.exec(nUAgent)[1]; //eslint-disable-line
        break;

      case 'iOS':
        osVersion = /OS (\d+)_?(\d+)?/.exec(nUAgent); //eslint-disable-line
        osVersion = `${osVersion[1]}.${osVersion[2]}.${(osVersion[3] | 0)}`; //eslint-disable-line
        break;
    }

    this.devicespecs = {
      currentBrowser: browser,
      browserVersion: version.trim(),
      browserMajorVersion: majorVersion,
      isMobile: mobile,
      os,
      currentOSVersion: osVersion,
      browserVersionName
    };
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
 * @returns {boolean} whether or not the current browser is MS Edge
 */
Environment.browser.isEdge = function () {
  return Environment.browser.name === 'edge';
};

/**
 * @returns {boolean} whether or not the current browser is IE11
 */
Environment.browser.isIE11 = function () {
  return Environment.browser.name === 'ie' && Environment.browser.version === '11';
};

/**
 * @returns {boolean} whether or not the current browser is Safari and includes wkWebView as safari
 */
Environment.browser.isSafari = function () {
  return Environment.browser.name === 'safari' || Environment.browser.name === 'wkwebview';
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
