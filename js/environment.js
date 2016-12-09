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
        html = $('html'); // User-agent string

      if (ua.indexOf('Safari')  !== -1 &&
          ua.indexOf('Chrome')  === -1 &&
          ua.indexOf('Android') === -1) {
        html.addClass('is-safari');
      }

      if (ua.indexOf('Mac OS X') !== -1) {
        html.addClass('is-mac');
      }

      if (ua.indexOf('Firefox') > 0) {
        html.addClass('is-firefox');
      }

      //Class-based detection for IE
      if (ua.match(/Edge\//)) {
        html.addClass('ie ie-edge');
      }
      if (ua.match(/Trident/)) {
        html.addClass('ie');
      }
      if (navigator.appVersion.indexOf('MSIE 8.0') > -1 ||
        ua.indexOf('MSIE 8.0') > -1 ||
        document.documentMode === 8) {
        html.addClass('ie8');
      }
      if (navigator.appVersion.indexOf('MSIE 9.0') > -1) {
        html.addClass('ie9');
      }
      if (navigator.appVersion.indexOf('MSIE 10.0') > -1) {
        html.addClass('ie10');
      } else {
        if (ua.match(/Trident\/7\./)) {
          html.addClass('ie11');
        }
      }

      // Class-based detection for iOS
      // /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/
      if ((/iPhone|iPod|iPad/).test(ua)) {
        html.addClass('ios');

        var iDevices = ['iPod', 'iPad', 'iPhone'];
        for (var i = 0; i < iDevices.length; i++) {
          if (new RegExp(iDevices[i]).test(ua)) {
            html.addClass(iDevices[i].toLowerCase());
          }
        }
      }

      if ((/Android/.test(ua))) {
        html.addClass('android');
      }

      return this;
    },

    makeSohoObject: function() {
      window.Soho = window.Soho || {};

      window.Soho.logTimeStart = function(label) {
        if (window.Soho.logTime) {
          console.time(label); // jshint ignore:line
        }
      };

      window.Soho.logTimeEnd = function(label) {
        if (window.Soho.logTime) {
          console.timeEnd(label); // jshint ignore:line
        }
      };

      window.Soho.theme = 'light';
      return this;
    }

  };

  environment.set();
  /* start-amd-strip-block */
}));
/* end-amd-strip-block */
