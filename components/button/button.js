import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// jQuery components
import '../icons/icons.jquery';

// The name of this component.
const COMPONENT_NAME = 'button';

/**
 * Soho Button Element
 * @class Button
 * @param {string} element The component element.
 * @param {string} [settings] The component settings.
 * @param {string} [settings.toggleOnIcon=null]  The icon to use for on state on toggle buttons
 * @param {string} [settings.toggleOffIcon=null]  The icon to use for off state on toggle buttons
 * @param {string} [settings.replaceText=false]  If true the selection will be used to replace the content
 */
const BUTTON_DEFAULTS = {
  toggleOnIcon: null,
  toggleOffIcon: null,
  replaceText: false
};

function Button(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(element, settings, BUTTON_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
Button.prototype = {
  init() {
    const self = this;

    this.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isSafari = $('html').is('.is-safari');
    this.isFirefox = $('html').is('.is-firefox');

    if (this.element.hasClass('no-ripple')) {
      return;
    }

    if (this.element.hasClass('btn-menu') && !this.element.hasClass('btn-icon') && !this.element.hasClass('btn-actions')) {
      let ddIcon = this.element.children('svg.icon');
      const use = ddIcon.find('use');
      let hasIcon = false;

      if (ddIcon.length > 0 && use.length === 1) {
        hasIcon = use.attr('xlink:href').indexOf('#icon-dropdown') > -1;
      }

      if (!hasIcon) {
        ddIcon = $.createIconElement({ icon: 'dropdown', classes: ['icon-dropdown'] });
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
      this.element.on('click.favorite', function () {
        const elem = $(this);
        const svg = elem.find('svg:not(.ripple-effect)');
        const isPressed = elem.attr('aria-pressed') === 'true';

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

        const element = $(this);
        const btnOffset = element.offset();
        let xPos = e.pageX - btnOffset.left;
        let yPos = e.pageY - btnOffset.top;
        const ripple = $('<svg class="ripple-effect" focusable="false" aria-hidden="true" role="presentation"><circle r="0" class="ripple-circle"></circle></svg>');

        if (self.isTouch) {
          // Make sure the user is using only one finger and then get the touch position relative
          // to the ripple wrapper
          e = e.originalEvent;
          if (e && e.touches && e.touches.length === 1) {
            xPos = e.touches[0].pageX - btnOffset.left;
            yPos = e.touches[0].pageY - btnOffset.top;
          }
        }

        // Using keyboard to click
        xPos = (xPos < 0) ? self.element.outerWidth() / 2 : xPos;
        yPos = (yPos < 0) ? self.element.outerHeight() / 2 : yPos;

        $('svg.ripple-effect', element).remove();
        ripple[0].style.left = `${xPos}px`;
        ripple[0].style.top = `${yPos}px`;
        element.prepend(ripple);

        // Start the JS Animation Loop if IE9
        // Or Safari/Firefox has bug with combination like: animation, overflow, position,
        // border-radius etc.)
        if (!$.fn.cssPropSupport('animation') || self.isSafari || self.isFirefox) {
          ripple.removeClass('is-animation');
          self.animateWithJS(ripple);
        } else {
          const elem = $('svg.ripple-effect', element);
          elem.addClass('is-animation');
        }

        setTimeout(() => {
          ripple.remove();
        }, 1000);
      });
  },

  // Browsers that don't support CSS-based animation can still show the animation
  animateWithJS(el) {
    const scale = 200;
    const elStyle = el[0].style;
    const xPos = `${parseFloat(elStyle.left) - (scale / 2)}px`;
    const yPos = `${parseFloat(elStyle.top) - (scale / 2)}px`;

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
   * Update the component with new settings.
   * @param  {[type]} settings The settings you would like to modify.
   * @returns {object} The api.
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.extend({}, this.settings, settings);
    }
    return this;
  },

  /**
  * Teardown and remove any added markup and events.
  * @returns {void}
  */
  destroy() {
    this.element.off('click.button touchstart.button focusin.hide-focus focusout.hide-focus mousedown.hide-focus touchstart.hide-focus');

    const moreTooltip = this.element.data('tooltip');
    if (this.element.hasClass('btn-actions') && moreTooltip) {
      moreTooltip.destroy();
    }

    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
  *  Fires when the button is clicked (if enabled).
  *
  * @event click
  * @memberof Button
  * @param {object} event - The jquery event object
  */
  /**
  * Fires when the button is focused.
  *
  * @event focus
  * @memberof Button
  * @param {object} event - The jquery event object
  */
};

export { Button, COMPONENT_NAME };
