/**
 * Page Bootstrapper
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

  var environment = {

    // Setup a global resize event trigger for controls to listen to
    addGlobalResize: function() {
      $(window).on('resize', function() {
        $('body').triggerHandler('resize', [window]);
      });

      return this;
    },

    set: function () {
      this
        .makeSohoObject()
        .addBrowserClasses()
        .addGlobalResize();
    },

    // Global Classes for browser, version and device as needed.
    addBrowserClasses: function() {
      var ua = navigator.userAgent || navigator.vendor || window.opera,
        html = $('html'),
        cssClasses = ''; // User-agent string

      if (ua.indexOf('Safari')  !== -1 &&
          ua.indexOf('Chrome')  === -1 &&
          ua.indexOf('Android') === -1) {
        cssClasses += 'is-safari ';
        Soho.env.browser.name = 'safari';
      }

      if (ua.indexOf('Mac OS X') !== -1) {
        cssClasses += 'is-mac ';
        Soho.env.os.name = 'Mac OS X';
      }

      if (ua.indexOf('Firefox') > 0) {
        cssClasses += 'is-firefox ';
        Soho.env.browser.name = 'firefox';
      }

      //Class-based detection for IE
      if (ua.match(/Edge\//)) {
        cssClasses += 'ie ie-edge ';
        Soho.env.browser.name = 'edge';
      }
      if (ua.match(/Trident/)) {
        cssClasses += 'ie ';
        Soho.env.browser.name = 'ie';
      }
      if (navigator.appVersion.indexOf('MSIE 8.0') > -1 ||
        ua.indexOf('MSIE 8.0') > -1 ||
        document.documentMode === 8) {
        cssClasses += 'ie8 ';
        Soho.env.browser.version = '8';
      }
      if (navigator.appVersion.indexOf('MSIE 9.0') > -1) {
        cssClasses += 'ie9 ';
        Soho.env.browser.version = '9';
      }
      if (navigator.appVersion.indexOf('MSIE 10.0') > -1) {
        cssClasses += 'ie10 ';
        Soho.env.browser.version = '10';
      } else {
        if (ua.match(/Trident\/7\./)) {
          cssClasses += 'ie11 ';
          Soho.env.browser.version = '11';
        }
      }

      // Class-based detection for iOS
      // /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/
      if ((/iPhone|iPod|iPad/).test(ua)) {
        cssClasses += 'ios ';
        Soho.env.os.name = 'ios';

        var iDevices = ['iPod', 'iPad', 'iPhone'];
        for (var i = 0; i < iDevices.length; i++) {
          if (new RegExp(iDevices[i]).test(ua)) {
            cssClasses += iDevices[i].toLowerCase() + ' ';
            Soho.env.device = iDevices[i];
          }
        }
      }

      if ((/Android/.test(ua))) {
        cssClasses += 'android ';
        Soho.env.os.name = 'android';
      }

      html.addClass(cssClasses);

      return this;
    },

    makeSohoObject: function() {
      window.Soho = window.Soho || {};

      window.Soho.logTimeStart = function(label) { // jshint ignore:line
        if (window.Soho.logTime) {
          console.time(label); // jshint ignore:line
        }
      };

      window.Soho.logTimeEnd = function(label) { // jshint ignore:line
        if (window.Soho.logTime) {
          console.timeEnd(label); // jshint ignore:line
        }
      };

      // Environment object provides JS-friendly way to figure out our browser support
      window.Soho.env = {
        browser: {},
        os: {}
      };

      // Get the name of the paste event.  Could be "paste" or "input" based on the browser.
      window.Soho.env.pasteEvent = (function getPasteEvent() {
        var el = document.createElement('input'),
            name = 'onpaste';
        el.setAttribute(name, '');
        return ((typeof el[name] === 'function') ? 'paste' : 'input');
      })();

      window.Soho.theme = 'light';
      return this;
    }

  };

  environment.set();
  /* start-amd-strip-block */
}));
/* end-amd-strip-block */
