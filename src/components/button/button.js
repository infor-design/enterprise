import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Environment as env } from '../../utils/environment';
import { Locale } from '../locale/locale';
import { xssUtils } from '../../utils/xss';

// jQuery components
import '../icons/icons.jquery';
import '../tooltip/tooltip.jquery';
import '../notification-badge/notification-badge.jquery';

// The name of this component.
const COMPONENT_NAME = 'button';

// Styles of Buttons
const buttonStyles = [
  'default',
  'btn',
  'btn-primary',
  'btn-secondary',
  'btn-tertiary',
  'btn-destructive'
];

// Types of Buttons
const buttonTypes = [
  'default',
  'btn-icon',
  'btn-menu',
  'btn-actions',
  'btn-toggle',
  'icon-favorite',
  'btn-editor',
  'input'
];

// Pressable Button Types (has on/off state)
const pressableTypes = ['icon-favorite', 'btn-toggle'];

/**
 * IDS Button Component
 * @class Button
 * @param {string} element The component element.
 * @param {string} [settings] The component settings.
 * @param {string} [settings.toggleOnIcon=null] The icon to use for on state on toggle buttons
 * @param {string} [settings.toggleOffIcon=null] The icon to use for off state on toggle buttons
 * @param {string} [settings.replaceText=false] If true the selection will be used to replace the content
 * @param {string} [settings.hideMenuArrow=false] If true and the button is a menu button, the popup arrow will be hidden.
 * @param {boolean} [settings.hitbox=false] If true, it will add an invisible and clickable area around the button
 */
const BUTTON_DEFAULTS = {
  style: buttonStyles[0],
  type: buttonTypes[0],
  toggleOnIcon: null,
  toggleOffIcon: null,
  hideMenuArrow: null,
  replaceText: false,
  ripple: true,
  hitbox: false,
  validate: false,
  notificationBadge: false,
  notificationBadgeOptions: {
    position: 'upper-right',
    color: 'alert'
  },
  attributes: null
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

  /**
   * @returns {Tooltip} component instance, if applicable
   */
  get tooltipAPI() {
    return this.element.data('tooltip');
  },

  /**
   * @returns {HTMLElement} a reference to this button's icon element
   */
  get icon() {
    return this.element[0].querySelector('svg:not(.ripple-effect):not(.icon-dropdown)');
  },

  /**
   * @returns {boolean} whether or not this component is currently disabled
   */
  get disabled() {
    if (this.element.parent().is('.spinbox-wrapper')) {
      return this.isDisabled(this.element.parent().find('input'));
    }
    return this.isDisabled(this.element);
  },

  /**
   * @param {boolean} val the value
   * @returns {void}
   */
  set disabled(val) {
    const isTrue = (val === true);
    this.element[0].disabled = isTrue;
  },

  /**
   * Initializes the Button Component
   * @returns {void}
   */
  init() {
    if (this.settings.buttonsetAPI !== undefined &&
      typeof this.settings.buttonsetAPI.render === 'function') {
      this.buttonsetAPI = this.settings.buttonsetAPI;
      delete this.settings.buttonsetAPI;
    }

    this.getSettingsFromElement();
    this.render();
  },

  /**
    * Builds notification badge for button
    * @returns {void}
    */
  createNotificationBadge() {
    if (!this.settings.notificationBadge || this.element.find('.notification-badge-container').length > 0) {
      return;
    }

    this.element.notificationbadge({
      position: this.settings.notificationBadgeOptions.position,
      color: this.settings.notificationBadgeOptions.color
    });
  },

  /**
   * Animates the button's ripple effects directly with Javascript,
   * for browsers that don't support CSS-based animation.
   * @private
   * @param {jQuery[]} el the ripple-effect element
   * @returns {void}
   */
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
   * @param {jQuery.Event} [e] incoming event object used for positioning.  If not provided,
   * the coordinates for the placement of the ripple will be at the center of the element.
   * @returns {void}
   */
  createRipple(e) {
    if (this.disabled) {
      return;
    }

    if (e) {
      // (!env.features.touch && e && e.which && e.which !== 1)
      // (env.features.touch && e.type !== 'touchstart')
      if ((e.which !== undefined && e.which !== 1) || ['click', 'touchstart'].indexOf(e.type) === -1) {
        return;
      }
    }

    // Remove any previously-added ripple animations
    $('svg.ripple-effect', this.element).remove();

    const btnOffset = this.element.offset();
    let xPos;
    let yPos;

    // Derive X/Y coordinates from input events
    if (e) {
      if (e.originalEvent instanceof MouseEvent) {
        // Standard Mouse Click
        xPos = e.pageX - btnOffset.left;
        yPos = e.pageY - btnOffset.top;
      } else {
        // Use the `touchstart` event. Make sure the user is using only one finger and then get the touch position relative
        // to the ripple wrapper
        e = e.originalEvent;
        if (e && e.touches && e.touches.length === 1) {
          xPos = e.touches[0].pageX - btnOffset.left;
          yPos = e.touches[0].pageY - btnOffset.top;
        }
      }
    }

    // If values have not been defined, simply set them to the center of the element.
    if (!xPos) { xPos = this.element.outerWidth() / 2; }
    if (!yPos) { yPos = this.element.outerHeight() / 2; }

    // Create/place the ripple effect
    const ripple = $(`<svg class="ripple-effect" focusable="false" aria-hidden="true" role="presentation">
      <circle r="0" class="ripple-circle"></circle>
    </svg>`);
    ripple[0].style.left = `${xPos}px`;
    ripple[0].style.top = `${yPos}px`;

    if (this.settings.hitbox) {
      $(this.hitboxArea).prepend(ripple);
    } else {
      this.element.prepend(ripple);
    }

    // Start the JS Animation Loop if IE9
    // Or Safari/Firefox has bug with combination like: animation, overflow, position,
    // border-radius etc.)
    if (!$.fn.cssPropSupport('animation') || env.browser.isSafari && !env.features.touch || env.browser.name === 'firefox') {
      ripple.removeClass('is-animation');
      this.animateWithJS(ripple);
    } else {
      const elem = $('svg.ripple-effect', this.element);
      elem.addClass('is-animation');
    }

    setTimeout(() => {
      ripple.remove();
    }, 1000);
  },

  /**
   * Renders the contents of the button
   * @returns {void}
   */
  render() {
    this.renderAttributes();
    this.createNotificationBadge();

    const isDisabled = this.element.prop('disabled');
    this.tertiaryGenerativeIcon = `
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="icon tertiary">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6 2H4.5V6.25C4.5 6.80228 4.05228 7.25 3.5 7.25H2V8.75H3.5C4.05228 8.75 4.5 9.19772 4.5 9.75V14H6V9.75C6 9.19772 6.44772 8.75 7 8.75H8.5V7.25H7C6.44772 7.25 6 6.80228 6 6.25V2ZM15 3H13.5V4.25C13.5 4.80228 13.0523 5.25 12.5 5.25H11.5V6.75H12.5C13.0523 6.75 13.5 7.19772 13.5 7.75V9H15V7.75C15 7.19772 15.4477 6.75 16 6.75H17V5.25H16C15.4477 5.25 15 4.80228 15 4.25V3ZM10.5 11H12V11.75C12 12.3023 12.4477 12.75 13 12.75H13.5V14.25H13C12.4477 14.25 12 14.6977 12 15.25V16H10.5V15.25C10.5 14.6977 10.0523 14.25 9.5 14.25H9V12.75H9.5C10.0523 12.75 10.5 12.3023 10.5 11.75V11Z" fill="${isDisabled ? 'url(#paint-linear-disabled)' : 'url(#paint-linear)'}"></path>
        <defs>
          <linearGradient id="${isDisabled ? 'paint-linear-disabled' : 'paint-linear'}" x1="14.6681" y1="-32.5625" x2="31.7256" y2="-26.8896" gradientUnits="userSpaceOnUse">
          <stop offset="0.117757" stop-color="#254A92"></stop>
          <stop offset="0.927091" stop-color="#10B7A6"></stop>
          </linearGradient>
        </defs>
      </svg>
    `;

    const elemClasses = this.element[0].classList;
    // Style = "primary/secondary/tertiary" hierarchy/context
    if (buttonStyles.indexOf(this.settings.style) > 0) {
      elemClasses.add(this.settings.style);
    }
    // Type = "function"
    if (buttonTypes.indexOf(this.settings.type) > 0) {
      elemClasses.add(this.settings.type);
    }

    // If this is a modal button, normalize CSS classes that are specific
    // to modal buttons.
    const buttonsetAPI = this.buttonsetAPI;
    let switchModalClasses = false;
    if (buttonsetAPI) {
      if (buttonsetAPI.settings.style === 'modal') {
        switchModalClasses = true;
      }

      // btn
      const btnClasses = ['default', 'btn', 'btn-modal'];
      if (btnClasses.indexOf(this.settings.style) > -1) {
        elemClasses[!switchModalClasses ? 'add' : 'remove']('btn');
        elemClasses[switchModalClasses ? 'add' : 'remove']('btn-modal');
      }

      // btn-primary
      const btnPrimaryClasses = ['btn-primary', 'btn-modal-primary'];
      if (btnPrimaryClasses.indexOf(this.settings.style) > -1) {
        elemClasses[!switchModalClasses ? 'add' : 'remove']('btn-primary');
        elemClasses[switchModalClasses ? 'add' : 'remove']('btn-modal-primary');
      }

      // btn-secondary
      const btnSecondaryClasses = ['btn-secondary', 'btn-modal-secondary'];
      if (btnSecondaryClasses.indexOf(this.settings.style) > -1) {
        elemClasses[!switchModalClasses ? 'add' : 'remove']('btn-secondary');
        elemClasses[switchModalClasses ? 'add' : 'remove']('btn-modal-secondary');
      }
    }

    // Backwards-compatibility with a legacy Modal setting.
    // `isDefault` is equivalent to setting a `btn-modal-primary` class.
    if (this.settings.isDefault) {
      this.settings.style = 'btn-primary';
      elemClasses.remove('btn-primary');
      elemClasses.add('btn-modal-primary');
      delete this.settings.isDefault;
    }

    // Add extra, user-defined CSS classes, if applicable
    if (typeof this.settings.cssClass === 'string') {
      this.element[0].className += xssUtils.stripHTML(` ${this.settings.cssClass}`);
    }

    // Add hitbox area element.
    // The ripple effect also goes inside of here so it will not scatter outside
    // of this element if button's overflow is set to visible.
    if (this.settings.hitbox) {
      this.element.addClass('hitbox');
      this.hitboxArea = document.createElement('span');
      this.hitboxArea.classList.add('hitbox-area');
      this.element.prepend(this.hitboxArea);
    }

    // Handling force disabling buttons since disabled setting is used also in button().data('button').disabled = 'true' and updated(settings)
    if (this.settings.forceDisable) {
      this.disabled = this.settings.disabled;
      delete this.settings.disabled;
      delete this.settings.forceDisable;
    }

    if (this.element.hasClass('btn-tertiary') && this.element.hasClass('btn-generative')) {
      this.element.find('span').after(this.tertiaryGenerativeIcon);
    }

    // // Handle a one-time `disabled` setting, if defined.
    if (this.settings.disabled) {
      this.disabled = this.settings.disabled === true;
      delete this.settings.disabled;
    }

    const audibleTextBtnTypes = ['btn-icon', 'btn-actions'];

    // Handle the rendering of the text span.
    // Some buttons are "simpler" and directly inline the text inside the button tag.
    // Others wrap the text in a span, usually when there are multiple elements inside the button.
    if (this.settings.text) {
      let textSpan = this.element[0].querySelector('span');
      const hasPrexistingSpan = textSpan instanceof HTMLElement;
      if (!hasPrexistingSpan) {
        textSpan = this.element;
      }

      let currentTextContent = this.settings.text || $(textSpan).text().trim();
      currentTextContent = xssUtils.stripHTML(currentTextContent);

      if (!hasPrexistingSpan) {
        this.element[0].innerText = '';
        textSpan = document.createElement('span');
        this.element.append($(textSpan));

        if (this.settings.audible || audibleTextBtnTypes.indexOf(this.settings.type) > -1) {
          textSpan.classList.add('audible');
        }
      }
      textSpan.innerText = currentTextContent;
    }

    // Setup Icons, if applicable
    let iconElem = this.icon;
    let targetIcon;
    if (this.settings.icon) {
      targetIcon = this.settings.icon;
    } else if (this.settings.type === 'btn-toggle') {
      if (this.pressed) {
        targetIcon = this.settings.toggleOnIcon;
      } else {
        targetIcon = this.settings.toggleOffIcon;
      }
    } else if (this.settings.type === 'icon-favorite') {
      if (this.pressed) {
        targetIcon = 'icon-star-filled';
      } else {
        targetIcon = 'icon-star-outlined';
      }
    } else if (this.settings.type === 'btn-actions') {
      targetIcon = 'icon-more';
    }

    const isCard = this.element.closest('.card').length !== 0;
    const isWidget = this.element.closest('.widget').length !== 0;

    if (targetIcon) {
      targetIcon = xssUtils.stripHTML(targetIcon);
      if (!(iconElem instanceof SVGElement) && !(iconElem instanceof HTMLElement)) {
        iconElem = $.createIconElement({ icon: targetIcon.replace('icon-', '') });
        this.element.prepend($(iconElem));
      } else if ((isCard) || (isWidget)) {
        this.element.prepend($(iconElem));
      } else {
        iconElem.querySelector('use').setAttribute('href', `#${targetIcon}`);
      }
    }

    // Add the Dropdown Arrow Icon to the button for Menu Buttons,
    // excluding icon menu buttons and action buttons
    if (this.element.hasClass('btn-menu') && !this.element.hasClass('btn-icon') && !this.element.hasClass('btn-actions')) {
      let ddIcon = this.element.children('svg.icon');
      const use = ddIcon.find('use');
      let hasIcon = false;

      if (ddIcon.length > 0 && use.length >= 1) {
        let hrefValue = use.last().attr('href');
        if (!hrefValue && use.last().attr('xlink:href')) {
          hrefValue = use.last().attr('xlink:href');
        }
        hasIcon = hrefValue.indexOf('#icon-dropdown') > -1;
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

      if (this.settings.hideMenuArrow) {
        ddIcon.remove();
      }
    }

    // Sets up click-to-toggle events on pressable button types (favorite, toggle)
    if (pressableTypes.indexOf(this.settings.type) > -1) {
      this.element.on('click.favorite', () => {
        this.toggle();
      });

      // Casuses the `set pressed()` property to rerender the button state
      // eslint-disable-next-line
      this.pressed = this.pressed;
    }

    // Standalone action buttons need a "More Actions" tooltip.
    // This is handled internally on most components that implement an action button.
    if (this.element.hasClass('btn-actions')) {
      if ((!this.element.parents('.field').length && !this.element.parents('.toolbar').length)) {
        if (!this.tooltipAPI) {
          if (!this.element.attr('title')) {
            const moreText = Locale.translate('More');
            this.element.attr('title', moreText).tooltip({
              content: moreText
            });

            return;
          }
          if (!this.settings.title || this.element.attr('title') === '') {
            this.tooltipAPI.destroy();
          }
        }
      }
    }

    // Hide/Show Ripple Effect
    elemClasses[this.settings.ripple ? 'remove' : 'add']('no-ripple');
    if (this.settings.ripple) {
      this.element.on('touchstart.button click.button', (e) => {
        this.createRipple(e);
      });
    }

    // Hide Focus API
    if (!this.element.data('hidefocus')) {
      this.element.hideFocus();
    }
  },

  /**
   * Handle attributes from settings, if applicable
   * @returns {void}
   */
  renderAttributes() {
    if (Array.isArray(this.settings.attributes)) {
      utils.addAttributes(this.element, this, this.settings.attributes);
    }
  },

  /**
   * Backwards compatability method for buttons that were previously defined by markup.
   * This will take an existing DOM element representing a button, and rectify internal settings
   * to match the element's state.
   * NOTE: When actually storing settings, the lifecycle of the Button component is specifically designed
   * for this method to run ONE time, at the beginning of its creation.  It should not run every time `updated()` occurs.
   * To detect current settings without overwriting them, use a true `dontStoreSettings` argument.
   * @param {boolean} [dontStoreSettings=false] if true, will not store the current settings internally while running.
   * @returns {object} containing a JSON-friendly representation of this element's current state
   */
  getSettingsFromElement(dontStoreSettings = false) {
    const elementSettings = {};

    // Setup link between this button instance and a parent buttonset component, if applicable.
    // NOTE this is not done with a getter because of the need to access it during the render step.
    const container = this.element.parents('.buttonset, .modal-buttonset');
    let buttonsetAPI;
    if (container.length) {
      buttonsetAPI = container.data('buttonset');
      if (buttonsetAPI) {
        this.buttonsetAPI = buttonsetAPI;
      }
    }

    // Button Style
    const elemClasses = this.element[0].classList || '';
    buttonStyles.forEach((style) => {
      if (style !== 'default' && elemClasses.contains(style)) {
        elementSettings.style = style;
      }
    });

    // In the case of Modal buttons, account for differences in naming convention on buttons
    if (this.buttonsetAPI && this.buttonsetAPI.settings.style === 'modal') {
      const modalBtnMappings = {
        'btn-modal': 'btn',
        'btn-modal-primary': 'btn-primary',
        'btn-modal-secondary': 'btn-secondary'
      };
      Object.keys(modalBtnMappings).forEach((modalBtnStyle) => {
        if (elemClasses.contains(modalBtnStyle)) {
          elementSettings.style = modalBtnMappings[modalBtnStyle];
        }
      });
    }

    // Button Type
    buttonTypes.forEach((type) => {
      if (type !== 'default' && elemClasses.contains(type)) { // ignore the `default` type classname
        elementSettings.type = type;
      }
    });

    // Disabled State (only if it hasn't been pre-set via JS settings)
    if (!this.settings.disabled) {
      elementSettings.disabled = this.disabled;
    }

    // If the button type is pressable, get current state and the icons
    const ariaPressedAttr = this.element[0].getAttribute('aria-pressed');
    if (ariaPressedAttr !== undefined) {
      elementSettings.pressed = ariaPressedAttr === true;
      if (elementSettings.type === 'icon-favorite') {
        elementSettings.toggleOnIcon = 'icon-star-filled';
        elementSettings.toggleOffIcon = 'icon-star-outlined';
      }
    }

    // ID Attribute
    const idAttr = this.element[0].id;
    if (typeof idAttr === 'string' && idAttr.length) {
      elementSettings.id = idAttr;
    }

    // Title Attribute
    const titleAttr = this.element[0].title;
    if (typeof titleAttr === 'string' && titleAttr.length) {
      elementSettings.title = titleAttr;
    }

    // Ripple Effect
    if (elemClasses.contains('no-ripple')) {
      elementSettings.ripple = false;
    }

    // Audible Text Content
    const audibleTextElem = this.element[0].querySelector('span.audible');
    if (audibleTextElem) {
      elementSettings.audible = true;
    }

    // Pass all settings onto the `settings` object
    if (!dontStoreSettings) {
      Object.keys(elementSettings).forEach((setting) => {
        this.settings[setting] = elementSettings[setting];
      });
    }

    return elementSettings;
  },

  /**
   * Performs a generative action by replacing the content of a button with a loading indicator,
   * then replacing it with generated AI content after a specified delay.
   *
   * @param {number} delay - The delay (in milliseconds) before replacing the loading indicator.
   * @returns {void}
   */
  performGenerativeAction(delay) {
    /**
     * The element representing the button.
     * @type {jQuery}
     */
    const $elem = this.element;

    /**
     * The SVG element within the button.
     * @type {jQuery}
     */
    const $svg = $elem.find('svg');

    // Define HTML markup for the loading indicator
    const loader = `
      <div class="dot-flashing-container">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    `;

    // Define HTML markup for the generated AI content
    const generativeIcon = `
      <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
        <use href="#icon-insights-smart-panel"></use>
      </svg>
    `;

    // Replace the content of the button with the loading indicator
    $svg.replaceWith(loader);

    $elem.addClass('loading');

    // Disable user interactions with the button during the loading process
    $elem.css('pointer-events', 'none');

    setTimeout(() => {
      // Replace the loading indicator with the generated AI content
      if ($elem.hasClass('btn-tertiary') && $elem.hasClass('btn-generative')) {
        $elem.find('.dot-flashing-container').replaceWith(this.tertiaryGenerativeIcon);
      } else {
        $elem.find('.dot-flashing-container').replaceWith(generativeIcon);
      }

      $elem.removeClass('loading');

      // Enable user interactions with the button after the loading process is complete
      $elem.css('pointer-events', '');
    }, delay);
  },

  /**
   * Provides a JSON-compatible data representation of this button component for use with
   * higher-level components.
   * @param {boolean} addContextElement if true, adds a reference to this button element to the return data (NOT JSON-compatible).
   * @returns {object} JSON-compatible representation of this button's configuration.
   */
  toData(addContextElement) {
    const ret = {};

    Object.keys(this.settings).forEach((setting) => {
      ret[setting] = this.settings[setting];
    });

    ret.pressed = this.pressed;

    if (addContextElement) {
      ret.element = this.element[0];
    }

    return ret;
  },

  /**
   * @returns {boolean} whether or not this is a valid toggle button in a pressed state.
   */
  get pressed() {
    if (pressableTypes.indexOf(this.settings.type) === -1) {
      return false;
    }
    return this.element[0].getAttribute('aria-pressed') === 'true';
  },

  /**
   * On a Toggle or Favorite button, sets the current pressed state.
   * @param {boolean} val whether or not to set a "pressed" state on this valid toggle button.
   * @returns {void}
   */
  set pressed(val) {
    const trueVal = (val === true);
    const hasPressedIcons = (this.settings.toggleOffIcon && this.settings.toggleOnIcon);
    const iconElem = $(this.icon);

    this.element[0].setAttributeNS(null, 'aria-pressed', 'x');
    this.element[0].setAttributeNS(null, 'aria-pressed', trueVal);
    this.element[0].classList[trueVal ? 'add' : 'remove']('is-pressed');

    // Change the icon
    let icon;
    switch (this.settings.type) {
      case 'icon-favorite':
        icon = trueVal ? 'icon-star-filled' : 'icon-star-outlined';
        break;
      case 'btn-toggle':
        if (hasPressedIcons) {
          icon = trueVal ? this.settings.toggleOnIcon : this.settings.toggleOffIcon;
        }
        break;
      default:
        break;
    }

    if (iconElem.length === 0 || typeof icon !== 'string') {
      return;
    }

    iconElem.changeIcon(icon);
    utils.fixSVGIcons(iconElem);
  },

  /**
   * Toggles the current state of an icon button.
   * @returns {void}
   */
  toggle() {
    this.pressed = !this.pressed;
  },

  /**
   * Check if given element is disabled or not.
   * https://stackoverflow.com/a/41736179
   * $('elem')[0].disabled will only work on 'form elements' and will
   * return undefined for all others elements, so use $('elem').is('[disabled]') instead.
   * @private
   * @param {jQuery[]|HTMLElement} el element to check
   * @returns {boolean} True if disabled.
   */
  isDisabled(el) {
    el = el instanceof jQuery ? el : $(el);
    return el.is('[disabled]') && !el.is('[disabled="false"]');
  },

  /**
   * Removes bound events and generated markup from this component
   * @private
   * @returns {Button} This component's API.
   */
  teardown() {
    this.element.off([
      `click.${COMPONENT_NAME}`,
      `touchstart.${COMPONENT_NAME}`
    ].join(' '));

    const tooltipApi = this.tooltipAPI;
    if (this.element.hasClass('btn-actions') && tooltipApi) {
      tooltipApi.destroy();
    }

    const hidefocusApi = this.element.data('hidefocus');
    if (hidefocusApi) {
      hidefocusApi.destroy();
    }

    const badgeApi = this.element.data('notificationbadge');
    if (badgeApi) {
      badgeApi.destroy();
    }

    return this;
  },

  /**
   * Update the component with new settings.
   * @param {object} settings The settings you would like to modify.
   * @returns {Button} This component's API.
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    this.teardown();
    this.render();
    return this;
  },

  /**
  * Teardown and remove any added markup and events.
  * @returns {void}
  */
  destroy() {
    this.teardown();

    // Delete the link to a parent buttonset
    const buttonsetAPI = this.buttonsetAPI;
    if (buttonsetAPI) {
      delete this.buttonsetAPI;
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

export { Button, BUTTON_DEFAULTS, COMPONENT_NAME };
