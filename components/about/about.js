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

    /**
    * The About Dialog Component is displays information regarding the application.
    *
    * @class About
    * @param {String} appName  &nbsp;-&nbsp; The Main Application Name to display in the heading
    * @param {String} content  &nbsp;-&nbsp; Additional Text content to display at the top.
    * @param {String} copyrightYear  &nbsp;-&nbsp; The year displayed in the copyright, defaults to current year.
    * @param {Boolean} deviceSpecs  &nbsp;-&nbsp; Determines whether or not to display device information (Browser, Platform, Locale, Cookies Enabled)
    * @param {String} productName  &nbsp;-&nbsp; Additional product name information to display
    * @param {Boolean} useDefaultCopyright  &nbsp;-&nbsp; Add the Legal Approved Infor Copy Right Text
    * @param {String} version  &nbsp;-&nbsp; Semantic Version Number for example (4.0.0)
    *
    */
    function About(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
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
        this.isBody = $(this.element).is('body');
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
        this.defaultCopyright = Locale.translate('AboutText') + ' <a class="hyperlink" href="http://www.infor.com" target="_blank">www.infor.com</a>.';
        this.defaultCopyright = this.defaultCopyright.replace('{0}', this.settings.copyrightYear);

        return this;
      },

      build: function() {
        this.modal = $('<div class="modal about" id="about-modal"></div>');
        $('<div class="modal-content"></div>').appendTo(this.modal);
        var header = $('<div class="modal-header"></div>').appendTo(this.modal.find('.modal-content'));
        $('<div class="close-container"></div>')
          .append($('<button name="close" type="button" class="btn-icon hide-focus"></button>')
            .append($.createIconElement({ icon: 'close', classes: 'icon-close' }))
            .append('<span>' + Locale.translate('Close') + '</span>'))
          .appendTo(header);
        $.createIconElement({ icon: 'logo-trademark', classes: ['icon', 'about-logo'] }).attr({ viewBox: '0 0 44 44' }).appendTo(header);
        this.title = $('<h1 class="title"></h1>').text(this.settings.appName).appendTo(this.modal.find('.modal-header'));

        var body = $('<div class="modal-body"></div>').appendTo(this.modal.find('.modal-content'));

        if (this.settings.version || this.settings.productName) {
          var productAndVersion = '' + (this.settings.productName ? this.settings.productName + ' ' : '') +
            (this.settings.version ? this.settings.version : '');
          $('<p></p>').text(productAndVersion).appendTo(body);
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

        //$('<div class="modal-buttonset"><button type="button" name="done" class="btn-modal">Done</button></div>').appendTo(this.modal.find('.modal-content'));
        this.buttons = this.modal.find('button');

        this.modal.find('.hide-focus').one('blur', function () {
          $(this).removeClass('hide-focus');
        });

        this.element.attr('data-modal','about-modal');

        $('.modal-body', this.modal)[0].tabIndex = 0;

        this.modal.appendTo('body');
        this.modal.modal({trigger: this.isBody ? 'immediate' : 'click'});
        return this;
      },

      /**
      * Return the browser specs. Currently returns browse, os, cookiesEnabled and locale
      * @returns {String}
      */
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
              tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
              if (tem!= null) {
                return tem.slice(1).join(' ').replace('OPR', 'Opera');
              }
            }

            M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if ((tem= ua.match(/version\/(\d+)/i))!= null) {
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

      /**
      * Progamatically Close the About Dialog.
      */
      close: function() {
        var modalApi = this.modal.data('modal');

        if (modalApi) {
          modalApi.close();
        }

        if (this.isBody) {
          this.destroy();
        }
      },

      /**
      * Teardown and remove any added markup and events.
      */
      destroy: function() {
        var modalApi = this.modal.data('modal');

        if (modalApi) {
          modalApi.element.off('beforeopen.about');
          modalApi.destroy();
        }

        this.buttons.off();
        this.element.off('open.about');
        $.removeData(this.element[0], pluginName);
      },

      /**
       *  This component fires the following events.
       *
       * @fires About#events
       * @param {Object} beforeclose  &nbsp;-&nbsp; Fires before the dialog is closing. You can return false asyncronously to delay closing.
       * @param {Object} close  &nbsp;-&nbsp; Fires as the dialog is closing
       * @param {Object} afterclose  &nbsp;-&nbsp; Fires after the dialog has closed in the DOM entirely
       *
       */
      handleEvents: function() {
        var self = this;

        this.element.on('open.about', function(e) {
          e.stopPropagation();
          self.element.trigger('click');
        });

        this.buttons.filter('[name="done"], [name="close"]').on('click.about', function() {
          self.close();
        });

        this.modal.data('modal').element.on('beforeopen.about', function() {
          self.modal.find('.modal-body').scrollTop(0);
        });

        $(document).on('keydown.about', function(e) {
          // Close on Escape.
          if (e.which === 0 || e.which === 27) {
            self.close();
          }
        });

        return this;
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

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
