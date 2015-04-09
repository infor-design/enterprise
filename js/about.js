/**
* About Control (TODO: bitly link to soho xi docs)
*/

(function(factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS - Not Tested TODO
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }
}(function($) {

  'use strict';

  $.fn.about = function(options) {

    // Settings and Options
    var pluginName = 'about',
        defaults = {
          appName: 'Infor Application Name',
          content: undefined,
          copyrightYear: new Date().getFullYear(),
          deviceSpecs: true,
          productName: undefined,
          useDefaultCopyright: true,
          version: undefined
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function About(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    About.prototype = {

      init: function() {
        return this
          .setup()
          .build()
          .handleEvents();
      },

      setup: function() {
        var appName = this.element.attr('data-appname');
        this.settings.appName = appName !== undefined ? appName.toString() : this.settings.appName;

        var content = this.element.attr('data-about-content');
        this.settings.content = content !== undefined ? content.toString() : this.settings.content;

        var copyrightYear = this.element.attr('data-copyright-year');
        this.settings.copyrightYear = copyrightYear !== undefined ? copyrightYear.toString() : this.settings.copyrightYear;

        var deviceSpecs = this.element.attr('data-device-specs');
        if (deviceSpecs) {
          this.settings.deviceSpecs = deviceSpecs === 'true';
        }

        var productName = this.element.attr('data-product-name');
        this.settings.productName = productName !== undefined ? productName.toString() : this.settings.productName;

        var useDefaultCopyright = this.element.attr('data-use-default');
        if (useDefaultCopyright !== undefined) {
          this.settings.useDefaultCopyright = useDefaultCopyright === 'true';
        }

        var version = this.element.attr('data-version');
        this.settings.version = version !== undefined ? version.toString() : this.settings.version;

        // Get the default copyright text and cut in the current year
        this.defaultCopyright = Locale.translate('AboutText') + ' <a href="http://www.infor.com" target="_blank">www.infor.com</a>.';
        this.defaultCopyright = this.defaultCopyright.replace('{0}', this.settings.copyrightYear);

        return this;
      },

      build: function() {
        this.modal = $('<div class="modal about" id="about-modal"></div>');
        $('<div class="modal-content"></div>').appendTo(this.modal);
        var header = $('<div class="modal-header"></div>').appendTo(this.modal.find('.modal-content'));
        $('<div class="close-container"><button name="close" class="btn-icon has-text"><svg class="icon icon-close"><use xlink:href="#icon-close"></use></svg><span>'+Locale.translate('Close')+'</span></button></div>').appendTo(header);
        $('<svg class="about-logo" viewBox="0 0 44 44"><use xlink:href="#icon-logo-trademark"></use></svg>').appendTo(header);
        this.title = $('<h1 class="title"></h1>').text(this.settings.appName).appendTo(this.modal.find('.modal-header'));

        var body = $('<div class="modal-body"></div>').appendTo(this.modal.find('.modal-content'));

        if (this.settings.version || this.settings.productName) {
          var productAndVersion = '' + (this.settings.productName ? this.settings.productName + ' ' : '') +
            (this.settings.version ? this.settings.version : '');
          $('<p></p>').html(productAndVersion).appendTo(body);
        }

        if (this.settings.content) {
          $('<div class="additional-content"></div>').html(this.settings.content).appendTo(body);
        }

        if (this.settings.useDefaultCopyright || !this.settings.content) {
          $('<p></p>').html(this.defaultCopyright).appendTo(body);
        }

        if (this.settings.deviceSpecs) {
          var specs = this.getDeviceSpecs(),
            text = '<span class="browser">Browser: ' + specs.browser + '</span><br>' +
              '<span class="platform">Platform: ' + specs.os + '</span><br>' +
              '<span class="locale">Locale: ' + specs.locale + '</span><br>' +
              '<span class="cookiesEnabled">Cookies Enabled: ' + specs.cookiesEnabled + '</span><br>';
          $('<p></p>').html(text).appendTo(body);
        }

        $('<div class="modal-buttonset"><button type="button" name="done" class="btn-modal">Done</button></div>').appendTo(this.modal.find('.modal-content'));
        this.buttons = this.modal.find('button');

        this.element.attr('data-modal','about-modal');

        this.modal.appendTo('body');
        this.modal.modal();
        return this;
      },

      handleEvents: function() {
        var self = this;

        this.element.on('open.about', function(e) {
          e.stopPropagation();
          self.element.trigger('click');
        });

        this.buttons.filter('[name="done"], [name="close"]').on('click.about', function() {
          self.close();
        });

        this.modal.data('modal').element.on('beforeOpen.about', function() {
          self.modal.find('.modal-body').scrollTop(0);
        });

        $(document).on('keydown.about', function(e) {
          // Close on Escape.
          if (e.which === 0 || e.which === 27) {
            self.close();
          }
        });

        return this;
      },

      getDeviceSpecs: function() {
        var locale = navigator.appName === 'Microsoft Internet Explorer' ? navigator.userLanguage : navigator.language,
          browser = (function(){
            var ua= navigator.userAgent, tem,
            M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])){
              tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
              return 'IE '+(tem[1] || '');
            }
            if (M[1]=== 'Chrome'){
              tem= ua.match(/\bOPR\/(\d+)/);
              if (tem !== null) {
                return 'Opera '+tem[1];
              }
            }
            M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem= ua.match(/version\/(\d+)/i)) !== null) {
              M.splice(1, 1, tem[1]);
            }
            return M.join(' ');
          })();

        return {
          browser: browser,
          os: navigator.platform,
          cookiesEnabled: navigator.cookieEnabled,
          locale: locale
        };
      },

      close: function() {
        this.modal.data('modal').close();
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        var modal = this.modal.data('modal');
        modal.element.off('beforeOpen.about');
        modal.destroy();
        this.buttons.off();
        this.element.off('open.about');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new About(this, settings));
      }
    });
  };
}));
