import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

/**
 * Component name as referenced by jQuery/event namespace/etc
 */
let PLUGIN_NAME = 'button';

/**
 * Component Defaults
 */
let BUTTON_DEFAULTS = {
  toggleOnIcon: null,
  toggleOffIcon: null,
  replaceText: false
};


/**
 * Soho Button Element
 *
 * @class Button
 *
 * @param {String} toggleOnIcon  &nbsp;-&nbsp; The icon to use for on state on toggle buttons
 * @param {String} toggleOffIcon  &nbsp;-&nbsp; The icon to use for off state on toggle buttons
 * @param {String} replaceText  &nbsp;-&nbsp; If true the selection will be used to replace the content in the button.
 */
function Button(element, options) {
  this.element = $(element);
  this.settings = utils.extend({}, BUTTON_DEFAULTS, options, utils.parseOptions(element));
  debug.logTimeStart(PLUGIN_NAME);
  this.init();
  debug.logTimeEnd(PLUGIN_NAME);
}


// Plugin Methods
Button.prototype = {
  init: function() {
    var self = this;

    this.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isSafari = $('html').is('.is-safari');
    this.isFirefox = $('html').is('.is-firefox');

    if (this.element.hasClass('no-ripple')) {
      return;
    }

    if (this.element.hasClass('btn-menu') && !this.element.hasClass('btn-icon') && !this.element.hasClass('btn-actions')) {
      var ddIcon = this.element.children('svg.icon'),
          use = ddIcon.find('use'), hasIcon = false;

      if (ddIcon.length > 0 && use.length === 1) {
        hasIcon = use.attr('xlink:href').indexOf('#icon-dropdown') > -1;
      }

      if (!hasIcon) {
        ddIcon = $.createIconElement({ icon: 'dropdown', classes: ['icon-dropdown']});
        this.element.append(ddIcon);
      }

      if (!ddIcon.hasClass('icon-dropdown')) {
        ddIcon.addClass('icon-dropdown');
      }

      if (this.settings.replaceText) {
        this.element.on('selected.content', function (e, a) {
          $(this).find('span').text(a.text());
        });
      }
    }

    if (this.element.hasClass('btn-toggle') || this.element.hasClass('icon-favorite')) {
      this.element.on('click.favorite', function() {
        var elem = $(this),
          svg = elem.find('svg:not(.ripple-effect)'),
          isPressed = elem.attr('aria-pressed') === 'true';

        elem.attr('aria-pressed', isPressed ? 'false' : 'true');
        if (self.settings.toggleOffIcon && self.settings.toggleOnIcon) {
          svg.changeIcon(isPressed ? self.settings.toggleOffIcon : self.settings.toggleOnIcon);
        } else {
          elem.toggleClass('is-pressed');
        }

        if (elem.hasClass('icon-favorite') && !elem.hasClass('btn-toggle') && svg.find('use').attr('xlink:href') === '#icon-star-filled') {
          svg.changeIcon('star-outlined');
        } else if (elem.hasClass('icon-favorite') && !elem.hasClass('btn-toggle')) {
          svg.changeIcon('star-filled');
        }

      });

      if (!this.element.attr('aria-pressed')) {
        this.element.attr('aria-pressed', 'false');
      }

    }

    if (!this.element.parent().is('.field') && this.element.hasClass('btn-actions') && !this.element.data('tooltip')) {
      this.element.attr('title', Locale.translate('More')).tooltip({
        content: Locale.translate('More')
      });
    }

    this.element.hideFocus();

    this.element
    .on('touchstart.button click.button', function (e) {

      if ((self.element.attr('disabled')) || self.element.is('.is-disabled') || (!self.isTouch && e.which !== 1) ||
          ($('.ripple-effect', this).length) || (self.isTouch && e.type !== 'touchstart')) {
        return;
      }

      var element = $(this),
        btnOffset = element.offset(),
        xPos = e.pageX - btnOffset.left,
        yPos = e.pageY - btnOffset.top,
        ripple = $('<svg class="ripple-effect" focusable="false" aria-hidden="true" role="presentation"><circle r="0" class="ripple-circle"></circle></svg>');


      if (self.isTouch) {
        // Make sure the user is using only one finger and then get the touch position relative to the ripple wrapper
        e = e.originalEvent;
        if (e && e.touches && e.touches.length === 1) {
          xPos = e.touches[0].pageX - btnOffset.left;
          yPos = e.touches[0].pageY - btnOffset.top;
        }
      }

      // Using keyboard to click
      xPos = (xPos < 0) ? self.element.outerWidth()/2 : xPos;
      yPos = (yPos < 0) ? self.element.outerHeight()/2 : yPos;

      $('svg.ripple-effect', element).remove();
      ripple[0].style.left = xPos + 'px';
      ripple[0].style.top = yPos + 'px';
      element.prepend(ripple);

      // Start the JS Animation Loop if IE9
      // Or Safari/Firefox has bug with combination like: animation, overflow, position, border-radius etc.)
      if (!$.fn.cssPropSupport('animation') || self.isSafari || self.isFirefox) {
        ripple.removeClass('is-animation');
        self.animateWithJS(ripple);
      } else {
        var elem = $('svg.ripple-effect', element);
        elem.addClass('is-animation');
      }

      setTimeout(function() {
        ripple.remove();
      }, 1000);

    });
  },

  // Browsers that don't support CSS-based animation can still show the animation
  animateWithJS: function(el) {
    var scale = 200,
    elStyle = el[0].style,
    xPos = (parseFloat(elStyle.left) - (scale / 2)) + 'px',
    yPos = (parseFloat(elStyle.top)  - (scale / 2)) + 'px';

    el[0].style.opacity = '0.4';
    el.animate({
      opacity: 0,
      left: xPos,
      top: yPos,
      width: scale,
      height: scale
    }, 1000);
  },


  /**
   *
   */
  updated: function(settings) {
    if (settings) {
      this.settings = utils.extend({}, this.settings, settings);
    }
    return this;
  },


  /**
  * Teardown and remove any added markup and events.
  */
  destroy: function() {
    this.element.off('click.button touchstart.button focusin.hide-focus focusout.hide-focus mousedown.hide-focus touchstart.hide-focus');

    var moreTooltip = this.element.data('tooltip');
    if (this.element.hasClass('btn-actions') && moreTooltip) {
      moreTooltip.destroy();
    }

    $.removeData(this.element[0], PLUGIN_NAME);
  },

  /**
   *  This component fires the following events.
   *
   * @fires Autocomplete#events
   * @param {Object} click  &nbsp;-&nbsp; Fires when the button is clicked (if enabled).
   * @param {Object} focus  &nbsp;-&nbsp; Fires when the menu is focused.
   */
  handleEvents: function () {

  }
};


/**
 * jQuery Component Wrapper for the Soho Button Element
 */
$.fn.button = function(options) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (!instance) {
      instance = $.data(this, PLUGIN_NAME, new Button(this, options));
    } else {
      instance.updated(options);
    }
  });
};


export { Button };
