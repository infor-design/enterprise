import * as debug from '../../utils/debug';
import { warnAboutDeprecation } from '../../utils/deprecated';
import { breakpoints } from '../../utils/breakpoints';
import { DOM } from '../../utils/dom';
import { findComponentsOnElements } from '../../utils/lifecycle/lifecycle';
import { modalManager } from './modal.manager';
import { Environment as env } from '../../utils/environment';
import { renderLoop, RenderLoopItem } from '../../utils/renderloop';
import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';
import { Locale } from '../locale/locale';

// jQuery components
import '../button/button.jquery';
import '../button/button.set.jquery';
import '../icons/icons.jquery';

// The name of this component.
const COMPONENT_NAME = 'modal';

// Possible values for the `trigger` setting
const MODAL_TRIGGER_SETTINGS = ['click', 'immediate'];

// Possible values for the `fullsize` setting
const MODAL_FULLSIZE_SETTINGS = [false, 'responsive', 'always'];

/**
* Responsive and Accessible Modal Control
* @class Modal
* @param {string} element The component element.
* @param {string} settings The component settings.
*
* @param {string} [settings.title='Message Title']  Title text or content shown in the modal. An HTML string containing the follow tags may also be used `<div><span><a><small><img><svg><i><b><use><br><strong><em>`.
* @param {string} [settings.trigger='click'] The method of opening the dialog. Supports click, immediate.
* @param {array} [settings.buttons=null]  A list of buttons that will sit in the toolbar's Buttonset area.
* @param {isAlert} [settings.isAlert=false] Adds alertdialog role for message dialogs.
* @param {content} [settings.content=null] Ability to pass in dialog html content.
* @param {string} [settings.cssClass=null] Append a css class to top level.
* @param {boolean} [settings.autoFocus=true] If true, when the modal is opened, the first available input/button in its content area will be focused.
* @param {string} [settings.id=null] Optionally tag a dialog with an id.
* @param {number} [settings.frameHeight=180] Optional extra height to add.
* @param {number} [settings.frameWidth=0] Optional extra width to add.
* @param {function} [settings.beforeShow=null] A call back function that can be used to return data for the modal.
* @param {boolean} [settings.useFlexToolbar] If true the new flex toolbar will be used (For CAP)
* @param {boolean} [settings.showCloseBtn] If true, show a close icon button on the top right of the modal.
* @param {array} [settings.closeBtnOptions.attributes] Adds attributes on the close button.
* @param {string} [settings.closeBtnOptions.closeBtnTooltip='Close'] Adds the ability to change the tooltip for Close button. Default is Close.
* @param {number} [settings.maxWidth=null] Optional max width to add in pixels.
* @param {number|string} [settings.buttonsetTextWidth=null] Optional width to set the text of the buttonset.
* @param {boolean} [settings.fullsize=false] If true, ignore any sizing algorithms and
* return the markup in the response and this will be shown in the modal. The busy indicator will be shown while waiting for a response.
* @param {string} [settings.breakpoint='phone-to-tablet'] The breakpoint to use for a responsive change to "fullsize" mode. See `utils.breakpoints` to view the available sizes.
* @param {string} [settings.overlayOpacity=0.7] Adds the ability to control the opacity of the background overlay.
* @param {boolean} [settings.noRefocus=false] If true, causes the modal's trigger element not to become focused once the modal is closed.
* @param {htmlObject|jqueryObject|string} [settings.triggerButton=null] The modal's trigger element to keep refocused once the modal is closed. This can be html or jquery object or query selector as string
* @param {boolean} [settings.hideUnderneath=false] if true, causes this modal instance to become hidden when another modal is displayed over top.
* @param {boolean} [settings.suppressEnterKey=false] if true, causes the modal to not exit when the enter key is pressed.
* @param {array|object} [settings.attributes=null] Add extra attributes like id's to the toast element. For example `attributes: { name: 'id', value: 'my-unique-id' }`
* @param {function} [settings.onFocusChange] an optional callback that runs whenever the Modal API attempts to change the focused element inside of its boundaries
* @param {string} [settings.icon] Ability to add icon in the title.
* @param {boolean} [settings.draggable=false] if true, allows user to drag/drop the modal container.
* @param {object} [settings.draggableOffset={left: 0, top: 0}] Allowable offset outisde of the document.
* @param {sring} [settings.iconClass] Ability to add class in the icon setting.
*/
const MODAL_DEFAULTS = {
  trigger: 'click',
  buttons: null,
  isAlert: false,
  content: null,
  cssClass: null,
  autoFocus: true,
  id: null,
  frameHeight: 180,
  frameWidth: 0,
  beforeShow: null,
  useFlexToolbar: false,
  showCloseBtn: false,
  closeBtnOptions: {
    attributes: [],
    closeBtnTooltip: 'Close'
  },
  maxWidth: null,
  fullsize: MODAL_FULLSIZE_SETTINGS[0],
  breakpoint: 'phone-to-tablet',
  overlayOpacity: 0.7,
  noRefocus: false,
  triggerButton: null,
  hideUnderneath: false,
  suppressEnterKey: false,
  draggable: false,
  draggableOffset: { left: 0, top: 0 },
  propagateStyle: false,
  compactPanel: false,
  icon: null,
  iconClass: null,
  buttonsetTextWidth: null
};

// Resets some string-based Modal settings to their defaults
// if the provided values are not possible or valid.
function handleModalDefaults(settings) {
  if (settings.trigger && MODAL_TRIGGER_SETTINGS.indexOf(settings.trigger) === -1) {
    settings.trigger = MODAL_DEFAULTS.trigger;
  }

  // Reset fullsize setting to default if it's not available
  if (settings.fullsize && MODAL_FULLSIZE_SETTINGS.indexOf(settings.fullsize) === -1) {
    settings.fullsize = MODAL_DEFAULTS.fullsize;
  }

  // Reset breakpoint setting to default if it's not a valid breakpoint.
  if (settings.breakpoint && breakpoints.available.indexOf(settings.breakpoint) === -1) {
    settings.breakpoint = MODAL_DEFAULTS.breakpoint;
  }

  return settings;
}

function Modal(element, settings) {
  this.settings = utils.mergeSettings(element, settings, MODAL_DEFAULTS);
  this.settings = handleModalDefaults(this.settings);
  this.originalElement = $(element);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
  this.reStructure();
}

// Actual Plugin Code
Modal.prototype = {

  /**
   * @private
   * @returns {boolean} whether or not the Modal is a Contextual Action Panel (CAP)
   */
  get isCAP() {
    return this.element.is('.contextual-action-panel');
  },

  /**
   * @private
   * @returns {ContextualActionPanel|undefined} a reference to a Contextual Action Panel
   * API associated with this modal, if one exists.
   */
  get capAPI() {
    let api;
    if (this.trigger && this.trigger.length) {
      api = this.trigger.data('contextualactionpanel');
    } else if (this.mainContent && this.mainContent.length && this.mainContent.is('body')) {
      api = this.mainContent.data('contextualactionpanel');
    }
    return api;
  },

  /**
   * @returns {boolean} whether or not the body tag is this Modal's trigger element
   */
  get isAttachedToBody() {
    return (this.trigger.length && this.trigger.is('body'));
  },

  /**
   * @returns {boolean} whether or not this Modal is currently being displayed
   */
  get visible() {
    return this.element.is('.is-visible');
  },

  /**
   * @param {boolean} val whether or not this modal is the active one within the
   * global Modal stack.
   */
  set visible(val) {
    this.element[0].classList[val === true ? 'add' : 'remove']('is-visible');
  },

  /**
   * @param {boolean} val whether or not this modal is the active one within the
   * global Modal stack.
   */
  set active(val) {
    this.element[0].classList[val === true ? 'add' : 'remove']('is-active');
  },

  /**
   * @returns {boolean} whether or not this Modal is currently active
   */
  get active() {
    return this.element[0].classList.contains('is-active');
  },

  /**
   * @returns {boolean} whether or not this Modal instance is the top-level one
   */
  get isOnTop() {
    let max = 0;
    const dialog = this.element;

    $('.modal.is-visible').each(function () {
      if (max < this.style.zIndex) {
        max = this.style.zIndex;
      }
    });

    return max === dialog[0].style.zIndex;
  },

  /**
   * @returns {boolean} whether or not this Modal instance should currently display in
   * full size mode (uses the settings, but determined at runtime)
   */
  get currentlyNeedsFullsize() {
    return (this.settings.fullsize === 'always' ||
      (this.settings.fullsize === 'responsive' && breakpoints.isBelow(this.settings.breakpoint)) ||
      (this.settings.fullsize === 'responsive' && this.isAndroid() && this.settings.breakpoint === 'phone-to-tablet'));
  },

  /**
   * @returns {HTMLElement} type of things.
   */
  get closeBtn() {
    let closeBtn;
    const capAPI = this.capAPI;
    if (capAPI && capAPI.element instanceof $) {
      closeBtn = capAPI.closeButton[0];
    } else {
      closeBtn = this.element[0].querySelector('.modal-content > button.btn-close');
    }
    return closeBtn;
  },

  /**
   * @private
   */
  init() {
    const self = this;

    // Used for tracking events tied to the Window object
    this.id = this.element.attr('id') || (parseInt($('.modal').length, 10) + 1);
    this.namespace = `${COMPONENT_NAME}-${this.id}`;

    // Find the button or anchor with same dialog ID
    this.trigger = $(`[data-modal="${this.element.attr('id')}"]`);
    if (this.element.is('body')) {
      this.trigger = this.element;
    }

    this.oldActive = this.settings.triggerButton ?
      this.useJqEl(this.settings.triggerButton) : this.trigger;

    if (this.settings.trigger === 'click' && !this.isAttachedToBody) {
      this.trigger.on(`click.${self.namespace}`, (e) => {
        if (!$(e.currentTarget).is(self.trigger)) {
          return;
        }
        self.open();
      });
    }

    if (this.settings.trigger === 'immediate') {
      const triggerImmediateTimer = new RenderLoopItem({
        duration: 1,
        timeoutCallback() {
          self.open();
        }
      });
      renderLoop.register(triggerImmediateTimer);
    }

    self.isCancelled = false;

    // ensure is appended to body for new dom tree
    if (this.settings.content) {
      this.settings.trigger = this.settings.content instanceof jQuery ? this.settings.trigger : 'immediate';
      this.appendContent();

      const renderFromContentTimer = new RenderLoopItem({
        duration: 1,
        timeoutCallback() {
          self.open();
        }
      });
      renderLoop.register(renderFromContentTimer);
      return;
    }

    if (this.settings.beforeShow) {
      this.settings.trigger = this.settings.content instanceof jQuery ? this.settings.trigger : 'immediate';
      this.appendContent();
      this.callSource();
      return;
    }

    if (this.isCAP) {
      this.addButtons(this.settings.buttons);
    } else {
      // Adds the modal buttonset, if applicable
      this.renderButtonset();
    }

    // Decide whether or not this Modal instance should hide when displayed
    // beneath another modal in the stack
    this.element[0].classList[this.settings.hideUnderneath ? 'add' : 'remove']('hide-underneath');

    if (this.settings.propagateStyle) {
      this.element.find('.modal-body').addClass('propagate-style');
    }

    if (this.settings.compactPanel) {
      this.element.find('.modal-body').addClass('compact');
    }

    this.registerModal();

    this.element.appendTo('body');
    this.element[0].style.display = 'none';
  },

  createDraggable() {
    if (!this.settings.draggable) {
      return;
    }

    const self = this;
    const isTouch = env.features.touch;
    const container = this.element;
    const dropContainer = this.element.parent();
    const modalHeader = container.find('.modal-header');
    const modalContent = container.find('.modal-content');
    const containerHeight = modalContent.height() + parseInt(modalContent.css('margin-top').slice(0, -2), 10) + parseInt(modalContent.css('margin-bottom').slice(0, -2), 10);
    const topPosition = (window.innerHeight / 2) - (containerHeight / 2);

    const rules = { position: 'fixed', top: `${topPosition}px`, height: `${containerHeight}px` };
    container.css(rules);
    container.addClass('is-draggable');

    modalHeader
      .off('mousedown.modal touchstart.modal')
      .on('mousedown.modal touchstart.modal', (e) => {
        if (!isTouch) {
          e.preventDefault();
        }

        // Initialize drag
        container
          .drag({ containment: 'partial', containmentOffset: self.settings.draggableOffset })

          // Start drag
          .off('dragstart.modal')
          .on('dragstart.modal', () => {
            e.stopImmediatePropagation();
            container.attr('aria-grabbed', 'true');
            dropContainer.attr('aria-dropeffect', 'move');
          })

          // End drag
          .off('dragend.modal')
          .on('dragend.modal', () => {
            container.removeAttr('aria-grabbed');
            dropContainer.removeAttr('aria-dropeffect');
            const dragApi = container.data('drag');
            if (dragApi && typeof dragApi.destroy === 'function') {
              dragApi.destroy();
            }
          });
      });
  },

  appendContent() {
    let isAppended = false;
    const maxWidth = this.settings.maxWidth ? ` style="max-width: ${this.settings.maxWidth}px;"` : '';
    const isSplitter = $(this.settings.content).hasClass('splitter-container');

    this.element = $(`
      <div class="modal">
        <div class="modal-content"${maxWidth}>
          <div class="modal-header ${isSplitter ? 'splitter-header' : ''}"><h1 class="modal-title"></h1></div>
          <div class="modal-body-wrapper ${isSplitter ? 'splitter-wrapper' : ''}">
            <div class="modal-body${this.settings.forceOverflow ? ' overflow' : ''} ${this.settings.propagateStyle ? ' propagate-style' : ''} ${this.settings.compactPanel ? ' compact' : ''}"></div>
          </div>
        </div>
      </div>
    `);

    // Only draw the close button if we're not in a CAP.
    // CAP has its own rendering process for buttons, which are inside a toolbar and not
    // part of the Modal Buttonset
    if (this.settings.showCloseBtn && !this.isCAP) {
      const closeBtn = $(`
        <button type="button" class="btn-icon btn-close" title="${Locale.translate(this.settings.closeBtnOptions.closeBtnTooltip, { showAsUndefined: false, showBrackets: false })}" aria-hidden="true">
          ${$.createIcon('close')}
          <span class="audible">${Locale.translate('Close')}</span>
        </button>
      `);

      if ($(window).width() >= 400) {
        this.element.addClass('has-close-btn');
      }

      this.element.find('.modal-content').append(closeBtn);
      closeBtn.on(`click.${this.namespace}`, () => {
        this.close();
      }).tooltip();

      if (this.settings.closeBtnOptions.attributes) {
        utils.addAttributes(closeBtn, this, this.settings.closeBtnOptions.attributes, '', true);
      }
    }

    if (this.settings.id) {
      this.element.attr('id', this.settings.id);
      utils.addAttributes(this.element, this, this.settings.attributes, '', true);
    }

    if ($(this.settings.content).is('.modal')) {
      this.element = $(this.settings.content);
      isAppended = this.element.parent().hasClass('modal-wrapper');
    } else if (this.settings.content && this.settings.content.length > 0) {
      if (this.settings.content instanceof jQuery && this.settings.content.parent().is('.modal-body')) {
        isAppended = true;
        this.element = this.settings.content.closest('.modal');
      } else {
        this.element.find('.modal-body').append(this.settings.content);
      }

      if (this.settings.content instanceof jQuery && !this.settings.beforeShow) {
        this.settings.content.removeClass('hidden is-hidden');
        this.settings.content.show();
      }
    }

    if (this.settings.beforeShow) {
      this.busyIndicator = $('<div class="overlay busy"></div>' +
        '<div class="busy-indicator-container blocked-ui" aria-live="polite" role="status">' +
          '<div class="busy-indicator active">' +
            '<div class="bar one"></div>' +
            '<div class="bar two"></div>' +
            '<div class="bar three"></div>' +
            '<div class="bar four"></div>' +
            '<div class="bar five"></div>' +
          '</div>' +
          '<span>Loading...</span>' +
        '</div>');
      $('body').append(this.busyIndicator);
    }

    if (!isAppended) {
      this.element.appendTo('body');
    }

    if (this.settings.cssClass) {
      this.element.addClass(this.settings.cssClass);
    }

    if (this.settings.title) {
      // Prevent Css on the title
      this.element.find('.modal-title')[0].innerHTML = xssUtils.stripTags(this.settings.title, '<div><span><a><small><img><svg><i><b><use><br><strong><em>');
    }

    if (!isAppended) {
      if (this.isCAP) {
        this.addButtons(this.settings.buttons);
      } else {
        // Adds the modal buttonset, if applicable
        this.renderButtonset();
      }
    }

    this.registerModal();

    if (this.settings.icon) {
      const hasIconClass = this.settings.iconClass ? ` icon-${this.settings.iconClass}` : '';
      const svgIcon = $(`<svg class="icon${hasIconClass}"
        focusable="false" aria-hidden="true" role="presentation">
        <use href="#icon-${this.settings.icon}"></use>
      </svg>`);
      const hasIcon = this.element.find('.modal-title svg.icon').length > 0;

      if (!hasIcon) {
        this.element.find('.modal-title').prepend(svgIcon);
      }
    }

    utils.fixSVGIcons(this.element);
  },

  /**
   * Registers this modal component with the global Modal Manager, while setting up other links.
   * @private
   * @returns {void}
   */
  registerModal() {
    // If the current `element` is not the original one the component was invoked against,
    // add a second reference to this component API to the new element.
    if (!this.originalElement.is(this.element)) {
      this.originalElement.data('modalElementLink', this.element[0]);
      this.element.data('modal', this);
    }

    // Register the modal into the global Modal manager
    modalManager.register(this);
  },

  /**
   * Moves around the basic structure of a Modal's HTML Markup for some legacy cases.
   * @private
   * @returns {void}
   */
  reStructure() {
    const body = $('.modal-body', this.element);
    const hr = $('hr:first-child', body);
    const buttonset = $('.modal-buttonset', this.element);

    if (body && body.length && !body.parent().hasClass('modal-body-wrapper')) {
      body.wrap('<div class="modal-body-wrapper"></div>');
    }
    if (hr && hr.length && !hr.parent().hasClass('modal-content')) {
      hr.insertAfter(this.element.find('.modal-header'));
    }
    if (buttonset && buttonset.length && !buttonset.parent().hasClass('modal-content')) {
      buttonset.insertAfter(this.element.find('.modal-body-wrapper'));
    }
  },

  /**
   * Check if the submit button should be disabled based on validation status.
   * @private
   * @returns {void}
   */
  disableSubmit() {
    const body = this.element;
    const inlineBtns = body.find('.modal-buttonset button');
    const primaryButton = inlineBtns.filter('.btn-modal-primary').not('.no-validation');
    const dropdowns = body.find('select.dropdown[data-validate]');
    let fields = body.find('[data-validate]:visible');

    dropdowns.each(function () {
      const dropdown = $(this);
      if (dropdown.next('.dropdown-wrapper').is(':visible')) {
        fields = fields.add(this);
      }
    });

    if (fields.length > 0) {
      primaryButton.removeAttr('disabled');

      let allValid = true;
      fields.each(function () {
        const field = $(this);
        if (field.closest('.datagrid-filter-wrapper').length > 0) {
          return;
        }

        const isVisible = field.is('.dropdown') && field.next('.dropdown-wrapper').is(':visible') || field[0].offsetParent !== null;

        if (field.is('.required')) {
          if (isVisible && !field.val()) {
            allValid = false;
          }
        } else {
          field.validateField();
          if (isVisible && !field.isValid()) {
            allValid = false;
          }
        }

        if (isVisible && field.is('.error')) {
          allValid = false;
        }

        if (allValid) {
          primaryButton.removeAttr('disabled');
        }
      });

      if (!allValid && !primaryButton.is(':disabled')) {
        primaryButton.attr('disabled', 'true');
      }
    }
  },

  /**
   * Responsible for rendering a Modal Buttonset component
   * @private
   * @returns {void}
   */
  renderButtonset() {
    let buttons = this.settings.buttons;
    const style = 'modal';
    const targetSettings = { style };
    const self = this;

    if (!this.buttonsetElem) {
      let buttonsetElem = this.element.find('.modal-buttonset');

      // If the ButtonSet Element doesn't exist (and it should), create it.
      if (!buttonsetElem || !buttonsetElem.length) {
        if (!Array.isArray(buttons) || !buttons.length) {
          return;
        }

        const body = this.element.find('.modal-body');
        const bodywrapper = body.parent();
        const flexText = this.settings.useFlexToolbar ? 'toolbar-section ' : '';
        const buttonsetTmpl = `<div class="${flexText}modal-buttonset"></div>`;

        buttonsetElem = $(buttonsetTmpl);
        buttonsetElem.insertAfter(bodywrapper);

        targetSettings.buttons = buttons;
      } else {
        targetSettings.detectHTMLButtons = true;
      }

      // Render the Buttonset Component
      this.buttonsetElem = buttonsetElem;
      buttonsetElem.buttonset(targetSettings);
      this.buttonsetAPI = buttonsetElem.data('buttonset');

      // Change the buttons JSON used
      buttons = this.buttonsetAPI.toData().buttons;
    }

    const buttonAPIs = this.buttonsetAPI.buttons;
    const $buttons = $();
    const btnPercentWidth = 100 / buttonAPIs.length;

    // Make modifications to each button
    buttonAPIs.forEach((btn, i) => {
      // Handle additional settings provided outside the
      // button API for modals, if applicable.
      const settingsJSON = Array.isArray(buttons) && buttons.length ? buttons[i] : undefined;
      let triggeredFunc = false;
      if (settingsJSON) {
        // Set a unique ID attribute if one wasn't predefined.
        btn.element[0].setAttribute('id', buttons[i].id || utils.uniqueId(btn.element, 'button', 'modal'));

        if (buttons[i].tabindex) {
          btn.element[0].setAttribute('tabindex', buttons[i].tabindex);
        }

        // Setup a user-defined click handler, if one was provided.
        // Do not attach this handler in some scenarios.
        $(btn.element).on(`click.${self.namespace}`, (e) => {
          const func = settingsJSON.click;
          if (func) {
            func.apply(self.element[0], [e, self]);
            triggeredFunc = true;
          }
        });

        // Setup a click handler for specific types of buttons that are valid for
        // closing this modal instance.
        const $validCloseBtns = $(btn.element).not([
          '[data-ng-click]',
          '[ng-click]',
          '[onclick]',
          ':submit',
          '.btn-menu',
          '.btn-actions',
          '.colorpicker',
          '.fontpicker'
        ].join(', '));
        $validCloseBtns.on(`click.${self.namespace}`, (e) => {
          if (triggeredFunc) {
            return;
          }
          if ($(e.target).is('.btn-cancel')) {
            self.isCancelled = true;
          }

          if (this.openSubComponents.length === 0) {
            self.close();
          }
        });

        // Handle Validation
        if (settingsJSON.validate) {
          btn.element[0].classList.add('no-validation');
        }

        if (settingsJSON.attributes) {
          // If Buttons have its own attribute settings
          utils.addAttributes(btn.element, this, settingsJSON.attributes, '', this);
        } else if (btn.element.is('[class*=primary]')) {
          // Buttons tag as btn-primary will be tag as save
          utils.addAttributes(btn.element, this, self.settings.attributes, 'primary', true);
        } else if (btn.element.is('[class*=cancel]') || btn.element.text() === Locale.translate('Cancel')) {
          // Buttons tag as btn-cancel will be tag as cancel, although not all cancel buttons has a class of btn-cancel
          utils.addAttributes(btn.element, this, self.settings.attributes, 'cancel', true);
        } else {
          // Other Buttons will generate its attributes by using its element id generated by utils.uniqueId
          utils.addAttributes(btn.element, this, self.settings.attributes, btn.element?.prop('id'), true);
        }
      }

      // In standard Modal mode, size the buttons to fit after rendering.
      btn.element[0].style.width = `${btnPercentWidth}%`;

      // Check if buttonsetTextWidth is defined in the settings
      if (self.settings.buttonsetTextWidth) {
        // Get the span element inside the button
        const buttonSpan = btn.element[0].querySelector('span');
        // Set the width of the button based on buttonsetTextWidth value
        const buttonWidth = typeof self.settings.buttonsetTextWidth === 'string' ? self.settings.buttonsetTextWidth : `${self.settings.buttonsetTextWidth}px`;
        buttonSpan.style.width = buttonWidth;
      }

      $buttons.add(btn);
    });

    setTimeout(() => {
      this.addTooltipToButtons();
    }, 100);
  },

  /**
   * Add tooltips to buttons whose text overflows their width.
   * @private
   */
  addTooltipToButtons() {
    // Check if buttons and buttonsetAPI exist
    if (this.settings.buttons && this.buttonsetAPI) {
      // Get all the buttons in the modal buttonset
      const buttons = this.settings.buttons;
      // Iterate through each button
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i].buttonsetAPI.buttons;

        for (let j = 0; j < button.length; j++) {
          const btn = button[j];

          // Get the width of the button
          const buttonWidth = btn.element[0]?.offsetWidth;
          // Get the width of the button's text
          const textWidth = btn.element[0].querySelector('span')?.scrollWidth;

          // Check if the button's width is less than the text's width
          if (buttonWidth < textWidth) {
            $(btn.element).tooltip({
              content: btn.element[0].querySelector('span').textContent,
              placement: 'top',
              trigger: 'hover'
            });
          }
        }
      }
    }
  },

  /**
   * Adds buttons to a standard/flex Toolbar component (used in Contextual Action Panels)
   * @private
   * @param {array<object>} buttons an incoming array of button definitions.
   * @returns {void}
   */
  addButtons(buttons) {
    const self = this;
    const body = this.element.find('.modal-body');
    const bodywrapper = body.parent();
    const flexToolbar = this.element.find('.flex-toolbar');
    let btnWidth = 100;
    let isPanel = false;
    let buttonset;

    this.modalButtons = buttons;

    if (!buttons) {
      const inlineBtns = this.element.find('.modal-buttonset button');

      // Buttons in markup
      btnWidth = 100 / inlineBtns.length;
      for (let i = 0, l = inlineBtns.length; i < l; i++) {
        inlineBtns[i].style.width = `${btnWidth}%`;
      }
      inlineBtns.button();
      inlineBtns
        .not('[data-ng-click], [ng-click], [onclick], :submit')
        .on(`click.${self.namespace}`, (e) => {
          if ($(e.target).is('.btn-cancel')) {
            self.isCancelled = true;
          }

          if (this.openSubComponents.length === 0) {
            self.close();
          }
        });
      return;
    }

    if (this.isCAP) {
      // CAP is responsible for rendering this part, and will have done so by the
      // time this code runs
      isPanel = true;
      buttonset = this.element.find('.buttonset');
    } else {
      buttonset = this.element.find('.modal-buttonset');
      if (!buttonset.length) {
        buttonset = $('<div class="modal-buttonset"></div>').insertAfter(bodywrapper);
      }
    }

    btnWidth = 100 / buttons.length;

    if (buttons) {
      buttonset.empty();
    }

    const decorateButtons = function (props, cnt) {
      let btn = $(`<button type="button">
        <span></span>
      </button>`);
      const span = btn.find('span');

      span.text(props.text);
      btn.attr('type', props.type || 'button');

      if (props.cssClass === 'separator') {
        btn = $('<div class="separator"></div>');
      }

      if (props.cssClass) {
        btn.attr('class', props.cssClass);
      } else if (props.isDefault) {
        btn.addClass('btn-modal-primary');
      } else {
        btn.addClass('btn-modal');
      }

      if (props.disabled) {
        btn[0].disabled = props.disabled === true;
      }

      if (props.audible) {
        span.addClass('audible');
      }

      if (props.validate !== undefined && !props.validate) {
        btn.addClass('no-validation');
      }

      utils.addAttributes(btn, self, props.attributes, '', true);

      const attrs = {};
      const attrTypes = ['id', 'name', 'text', 'tabindex'];

      for (let k = 0; k < attrTypes.length; k++) {
        if (props[attrTypes[k]]) {
          attrs[attrTypes[k]] = props[attrTypes[k]];
        }
      }

      if (props.type === 'input') {
        const label = $(`<label class="audible" for="filter">${props.text}</label>`);
        const input = $('<input class="searchfield">').attr(attrs);

        if (flexToolbar.length) {
          flexToolbar.find('.toolbar-section.search').append(label, input);
        } else {
          buttonset.append(label, input);
        }
        input.searchfield(props.searchfieldSettings);
        return;
      }

      if (props.icon && props.icon.charAt(0) === '#') {
        $.createIconElement({
          classes: [props.icon === '#icon-close' ? 'icon-close' : ''],
          icon: props.icon.substr('#icon-'.length)
        }).prependTo(btn);
      }

      btn[0].setAttribute('id', props.id || utils.uniqueId(self.element, 'button', 'modal'));

      const func = buttons[cnt].click;

      btn.on(`click.${self.namespace}`, (e) => {
        if (func) {
          func.apply(self.element[0], [e, self]);
          return;
        }

        if (this.openSubComponents.length === 0) {
          self.close();
        }
      });

      if (!isPanel) {
        btn[0].style.width = `${btnWidth}%`;
      }

      btn.button();

      if ((self.settings.useFlexToolbar || self.settings.centerTitle) && props.align) {
        if (props.align === 'left') {
          flexToolbar.find('.toolbar-section').eq(0).append(btn);
        }

        if (props.align === 'center') {
          flexToolbar.find('.toolbar-section').eq(1).find('h2').append(btn);
        }

        if (props.align === 'right') {
          flexToolbar.find('.toolbar-section').eq(2).append(btn);
        }
      } else {
        buttonset.append(btn);
      }
    };

    for (let cnt = 0; cnt < buttons.length; cnt++) {
      decorateButtons(buttons[cnt], cnt);
    }
  },

  /**
   * Check if the device is Android.
   * @private
   * @returns {boolean} whether or not the device is android
   */
  isAndroid() {
    const os = env && env.os && env.os.name ? env.os.name : '';
    return os === 'android';
  },

  /**
  * Size the inner content on resize.
  * @private
  * @returns {void}
  */
  sizeInner() {
    const messageArea = this.element.find('.detailed-message');
    // Set a max width
    const h = $(window).height() - messageArea.offset().top - 150;
    messageArea[0].style.maxHeight = `${h}px`;
    messageArea[0].style.overflow = 'auto';
    messageArea[0].style.width = `${messageArea.width()}px`;
  },

  callSource() {
    if (typeof this.settings.beforeShow !== 'function') {
      return;
    }

    const self = this;
    const response = function (content) {
      if (content === false) {
        return false;
      }

      $('#modal-busyindicator').trigger('complete.busyindicator');

      // Returning `true` from the response will cause a modal area to render to the page,
      // but remain hidden.  In this scenario it will be up to the app developer to reveal
      // the modal when needed.
      if (content === true) {
        if (self.busyIndicator) {
          self.busyIndicator.remove();
          delete self.busyIndicator;
        }

        return true;
      }

      if (!(content instanceof jQuery)) {
        content = $(content);
      }

      self.open(true);

      self.element.find('.modal-body').empty();
      self.element.find('.modal-body').append(content);

      content.show();

      return true;
    };

    const callBackOpts = {};
    this.settings.beforeShow(response, callBackOpts);
  },

  /**
   * Open the modal via the api.
   * @param {boolean} ajaxReturn Flag used internally to denote its an ajax result return.
   */
  open(ajaxReturn) {
    let messageArea = null;
    let elemCanOpen = true;
    // close any active tooltips
    $('#validation-errors, #tooltip, #validation-tooltip').addClass('is-hidden');

    if (this.busyIndicator) {
      this.busyIndicator.remove();
      delete this.busyIndicator;
    }

    if (this.settings.triggerButton) {
      this.oldActive = this.useJqEl(this.settings.triggerButton);
    } else if (!this.trigger || this.trigger.length === 0 || this.trigger.is('body')) {
      this.oldActive = $(':focus'); // Save and restore focus for A11Y
    }

    // Setup links to Modal Manager elements.
    if (!this.overlay) {
      this.overlay = $(modalManager.overlayElem);
    }
    if (!this.root) {
      this.root = $(modalManager.rootElem);
    }

    // Check for wrapping markup first.
    let $wrapperElem = this.element.parent();
    if (!$wrapperElem.is('.modal-wrapper')) {
      this.element.wrap('<div class="modal-wrapper"></div>');
      $wrapperElem = this.element.parent();
    }

    // If the parent element of the wrapper is not the `.modal-page-container`,
    // move the wrapper to the correct place.
    if (!$wrapperElem.parent().is(this.root)) {
      $wrapperElem.insertAfter(this.overlay);
    }

    messageArea = this.element.find('.detailed-message');
    if (messageArea.length === 1) {
      $('body').on(`resize.${this.namespace}`, () => {
        this.sizeInner();
      });
      this.sizeInner();
    }

    /**
    * Fires when the modal is about to open. You can return false to abort opening.
    * @event beforeopen
    * @memberof Modal
    * @property {object} event - The jquery event object
    * @property {object} ui - The dialog object
    */
    elemCanOpen = this.element.triggerHandler('beforeopen', [this]);

    // Only trigger on non message modals
    if (!this.settings.isAlert) {
      $('body').triggerHandler('beforeopen', [this]);
    }

    this.isCancelled = false;

    if (elemCanOpen === false) {
      return;
    }

    if (!ajaxReturn) {
      this.callSource();

      if (this.settings.beforeShow) {
        return;
      }
    }

    // check if page has an application menu in resizable mode
    const resizeContainer = $('.resize-app-menu-container');

    if (resizeContainer.length > 0) {
      resizeContainer.append(this.root);
    }

    // Tell the modal manager that this instance is active
    modalManager.currentlyActive = this;

    // Ensure aria-labelled by points to the id
    if (this.settings.isAlert) {
      const title = this.element.find('#message-title');
      utils.addAttributes(title, this, this.settings.attributes, 'title', true);

      const messageText = this.element.find('#message-text');
      utils.addAttributes(messageText, this, this.settings.attributes, 'message', true);
      utils.addAttributes(this.element, this, this.settings.attributes, 'modal', true);

      this.element.attr('aria-labelledby', title.attr('id'));
      this.element.attr('aria-describedby', messageText.attr('id'));
    } else {
      const h1 = this.element.find('h1:first');
      utils.addAttributes(h1, this, this.settings.attributes, 'title', true);
      utils.addAttributes(this.element.find('.btn-close'), this, this.settings.attributes, 'btn-close', true);

      let id = h1.attr('id');

      if (!id) {
        id = `${this.element.attr('id') ? this.element.attr('id') : 'h1'}-title`;
        h1.attr('id', id);
      }

      const body = this.element.find('.modal-body');
      const descById = `${this.element.attr('id') ? this.element.attr('id') : 'message'}-text`;

      this.element.attr('aria-labelledby', id);
      utils.addAttributes(this.element, this, this.settings.attributes, '', true);

      // Contextual Action Panel Case - Has a toolbar
      if (this.element.find('.toolbar .title').length) {
        this.element.find('.toolbar .title').attr('id', descById);
        this.element.attr('aria-describedby', descById);
      } else {
        body.attr('id', descById);
        this.element.attr('aria-describedby', descById);
      }
    }
    this.mainContent = $('body').children('.scrollable-container');
    if (!this.mainContent.length) {
      this.mainContent = $('body');
    }

    this.removeNoScroll = !this.mainContent.hasClass('no-scroll');
    this.mainContent.addClass('no-scroll');

    $('body').on(`resize.${this.namespace}`, () => {
      this.resize();
    });

    // Center
    this.element[0].style.display = '';

    // Stagger the rest of the Modal "show" process in several renderLoop ticks
    const self = this;
    const resizeTimer = new RenderLoopItem({
      duration: 1,
      timeoutCallback() {
        self.resize();
        self.element.attr('role', (self.settings.isAlert ? 'alertdialog' : 'dialog'));
        self.element.attr('aria-modal', 'true'); // This is a forward thinking approach, since aria-modal isn't actually supported by browsers or ATs yet
      }
    });
    const displayTimer = new RenderLoopItem({
      duration: modalManager.modalFadeDuration,
      timeoutCallback() {
        self.visible = true;
      }
    });
    renderLoop.register(resizeTimer);
    renderLoop.register(displayTimer);

    // Handle Default button.
    $(this.element)
      .off(`keypress.${this.namespace}`)
      .on(`keypress.${this.namespace}`, (e) => {
        const target = $(e.target);

        if (target.is('.editor, .searchfield, textarea, :button') || target.closest('.tab-list').length || $('#dropdown-list').length) {
          return;
        }

        if (e.which === 13 && this.isOnTop &&
          !target.closest('form').find(':submit').length &&
          this.element.find('.btn-modal-primary:enabled').length) {
          e.stopPropagation();
          e.preventDefault();

          if (!self.settings.suppressEnterKey && (!target.hasClass('fileupload') || target.hasClass('colorpicker'))) {
            this.element.find('.btn-modal-primary:enabled').trigger('click');
          }
        }
      });

    // Override this page's skip-link default functionality to instead focus the top
    // of this element if it's clicked.
    $('.skip-link').on(`focus.${this.namespace}`, (e) => {
      e.preventDefault();

      const targetElem = this.element.find(':focusable').first();
      targetElem.focus();

      // Trigger an optional callback that can further modify changes on focus
      if (typeof self.settings.onFocusChange === 'function') {
        self.settings.onFocusChange(self, targetElem[0]);
      }
    });

    function callOpenEvent(thisElem) {
      /**
      * Fires when the modal opens.
      * @event open
      * @memberof Modal
      * @property {object} event - The jquery event object
      * @property {object} ui - The dialog object
      */
      self.element.trigger('open', [thisElem]);
    }

    function focusElement(thisElem) {
      if (!self.settings.autoFocus) {
        return;
      }

      // When changes happen within the subtree on the Modal, rebuilds the internal hash of
      // tabbable elements used for retaining focus.
      // eslint-disable-next-line compat/compat
      self.changeObserver = new MutationObserver(() => {
        self.setFocusableElems();
      });
      self.changeObserver.observe(self.element[0], {
        childList: true,
        subtree: true,
      });
      self.setFocusableElems();

      let focusElem = $(self.focusableElems).not(':hidden').first();
      if (focusElem.length === 0) {
        focusElem = thisElem.element.find('.btn-modal-primary');
      }
      if (focusElem.length === 1 && focusElem.is('.btn-modal')) {
        focusElem = thisElem.element.find('.btn-modal-primary');
      }

      // Making default focus when there's no default button set
      // for non contextual action panel.
      if (self.buttonsetAPI) {
        if (thisElem.buttonsetElem.find('.btn-modal-primary').length === 0) {
          const firstBtn = $('.modal-buttonset button')[0];
          focusElem = thisElem.buttonsetElem.find(firstBtn);
        }
      }

      // If the selected element is anchor, it should focus the element.
      if (focusElem.is('.modal-wrapper a')) {
        focusElem = thisElem.element.find('.modal-content .message a').removeClass('hide-focus');
      }

      // If the selected element is a tab, actually make sure it's the "selected" tab.
      let selected;
      let tabParent;

      if (focusElem.is('.tab:not(.is-selected) a')) {
        tabParent = focusElem.closest('.tab-container');
        selected = tabParent.find('.is-selected');
        if (selected.length) {
          focusElem = selected;
          tabParent.data('tabs').select(selected.children('a').attr('href'));
          return;
        }
      }

      if (!(focusElem.is('input') && focusElem.closest('.modal-header').length > 0)) {
        // Otherwise, just focus
        focusElem.focus();
      }

      // Trigger an optional callback that can further modify changes on focus
      if (typeof self.settings.onFocusChange === 'function') {
        self.settings.onFocusChange(self, focusElem[0]);
      }
    }

    const pagerElem = this.element.find('.paginated');
    pagerElem.on(`afterpaging.${this.namespace}`, () => {
      this.resize();
    });

    const disableSubmitTimer = new RenderLoopItem({
      duration: 5,
      timeoutCallback() {
        self.disableSubmit();
      }
    });
    renderLoop.register(disableSubmitTimer);

    const fields = this.element.find('[data-validate]');
    fields.removeClass('disable-validation');

    const focusElementTimer = new RenderLoopItem({
      duration: 20,
      timeoutCallback() {
        callOpenEvent(self);
        focusElement(self);
      }
    });
    renderLoop.register(focusElementTimer);

    /**
    * Fires after the modal has opened.
    * @event afteropen
    * @memberof Modal
    * @property {object} event - The jquery event object
    * @property {object} ui - The dialog object
    */
    const afterOpenTimer = new RenderLoopItem({
      duration: 30,
      timeoutCallback() {
        self.element.trigger('afteropen');
      }
    });
    renderLoop.register(afterOpenTimer);
  },

  resize() {
    let calcHeight;
    let calcWidth;
    const currentlyNeedsFullsize = this.currentlyNeedsFullsize;

    // Set the height of the inner frame to fit and accommodate headers/button rows.
    // If `fullsize` is not false, stretch the calculated size accordingly
    if (currentlyNeedsFullsize) {
      this.element[0].classList.add('display-fullsize');
    } else {
      this.element[0].classList.remove('display-fullsize');
      calcHeight = ($(window).height() * 0.9) - this.settings.frameHeight;
      calcWidth = ($(window).width() * 1) - this.settings.frameWidth;
    }

    const wrapper = this.element.find('.modal-body-wrapper');

    if (wrapper.length) {
      if (currentlyNeedsFullsize) {
        wrapper[0].style.maxHeight = '';
        wrapper[0].style.maxWidth = '';
      } else {
        wrapper[0].style.maxHeight = `${calcHeight}px`;
        wrapper[0].style.maxWidth = `${calcWidth}px`;
      }
    }

    if (this.element.hasClass('lookup-modal')) {
      const table = this.element.find('.datagrid-wrapper');
      const hasPager = this.element.find('.pager-toolbar');
      const container = table.closest('.datagrid-container');

      calcHeight = calcHeight -
        (container.prev().is('.toolbar') ? 130 : 67) -
        (container.next().is('.pager-toolbar') ? 35 : 0) +
        (hasPager.length ? -15 : 0);

      // It will ensure that the style properties are only set
      // if calcHeight and calcWidth are defined and have a value.
      // This can prevent errors that might occur
      // if one or both of these variables are undefined or have an unexpected value.
      if (table[0] !== undefined) {
        if (currentlyNeedsFullsize) {
          table[0].style.maxHeight = '';
          table[0].style.maxWidth = '';
        } else if (typeof calcHeight !== 'undefined' && typeof calcWidth !== 'undefined') {
          table[0].style.maxHeight = `${calcHeight}px`;
          table[0].style.maxWidth = `${calcWidth}px`;
        }
      }
    }

    if (this.element.hasClass('datagrid-columns-dialog')) {
      wrapper[0].style.overflow = 'hidden';
      if (calcHeight > 220) {
        this.element.find('.modal-body')[0].style.height = '';
        this.element.find('.listview.alternate-bg')[0].style.maxHeight = '';
        this.element.find('.listview.alternate-bg')[0].style.height = '';
        this.element.find('.listview.alternate-bg')[0].style.minHeight = '';
      } else {
        this.element.find('.modal-body')[0].style.height = `${calcHeight}px`;
        this.element.find('.listview.alternate-bg')[0].style.maxHeight = `${calcHeight - 41}px`;
        this.element.find('.listview.alternate-bg')[0].style.height = `${calcHeight - 41}px`;
        this.element.find('.listview.alternate-bg')[0].style.minHeight = 0;
      }
    }

    if (this.settings.showCloseBtn && !this.isCAP) {
      if ($(window).width() < 400 && this.element.hasClass('has-close-btn')) {
        this.element.removeClass('has-close-btn');
      } else if ($(window).width() >= 400 && !this.element.hasClass('has-close-btn')) {
        this.element.addClass('has-close-btn');
      }
    }

    const toolbars = this.element.find('.toolbar');
    if (toolbars.length) {
      toolbars.triggerHandler('recalculate-buttons');
    }

    this.createDraggable();
  },

  /**
   * This method is slated to be removed in a future v4.20.0 or v5.0.0.
   * @deprecated as of v4.14.0. Please use the `visible` property instead.
   * @returns {boolean} The current state open (true) or closed (false).
   */
  isOpen() {
    warnAboutDeprecation('visible', 'isOpen');
    return this.visible;
  },

  /**
   * Reports to a consumer a list of IDS components contained by this Modal, that are also currently
   * reporting as "open".  This is used to determine if it's OK to close the Modal or not.
   * @returns {array} containing references to IDS subcomponent APIs inside this modal that
   * are currently reporting as "open"
   */
  get openSubComponents() {
    const elems = this.element.find('*');
    const subComponentTypes = [
      'datepicker',
      'dropdown',
      'popupmenu',
      'timepicker',
      'tooltip',
    ];
    const targetProps = ['isOpen', 'visible'];
    const matchedSubComponentAPIs = findComponentsOnElements(elems, targetProps, subComponentTypes);
    const openSubComponents = [];

    matchedSubComponentAPIs.forEach((matchObj) => {
      const componentAPI = matchObj.control;

      // Conditions below prevent the Modal from closing:
      const isPopover = typeof componentAPI.isPopover === 'boolean' && componentAPI.isPopover === true;
      const isOpenByFunction = typeof componentAPI.isOpen === 'function' && componentAPI.isOpen();
      const isOpenViaProperty = typeof componentAPI.isOpen === 'boolean' && componentAPI.isOpen === true;
      const isVisibleViaProperty = (!isPopover ? false : typeof componentAPI.visible === 'boolean' && componentAPI.visible === true);

      if (isOpenByFunction || isOpenViaProperty || isVisibleViaProperty) {
        openSubComponents.push(componentAPI);
      }
    });

    return openSubComponents;
  },

  /**
   * @returns {boolean} whether or not the Modal itself, or a component inside the Modal, currently has focus.
   * In some cases, this needs to get access to child components to determine focus state.
   */
  get isFocused() {
    let componentHasFocus = false;
    const activeElem = document.activeElement;

    if (!this.focusableElems) {
      this.setFocusableElems();
    }

    // Check each match for IDS components that may have a more complex focus routine
    // NOTE: Some elements that come through may be SVGs, careful which methods are used.
    this.focusableElems.forEach((elem) => {
      if (componentHasFocus) {
        return;
      }

      // Check the base element
      const $elem = $(elem);
      if ($elem.is($(activeElem)) || (typeof elem.contains === 'function' && elem.contains(activeElem))) {
        componentHasFocus = true;
      }

      // Dropdown/Multiselect
      if ($elem.is('div.dropdown, div.multiselect')) {
        componentHasFocus = $elem.parent().prev('select').data('dropdown')?.isFocused;
      }

      // Lookup
      if ($elem.is('.lookup')) {
        componentHasFocus = $elem.data('lookup')?.isFocused;
      }

      // Popupmenu
      if ($elem.is('.btn-menu, .btn-actions')) {
        componentHasFocus = $elem.data('popupmenu')?.isFocused;
      }

      // Searchfield
      if ($elem.is('.searchfield')) {
        componentHasFocus = $elem.data('searchfield')?.isFocused;
      }
    });

    // Check to see if a Popover/Tooltip has focus, and if that component's parent
    // element is inside the Modal
    const tooltipParents = $(activeElem).parents('.tooltip, .popover');
    if (tooltipParents.length) {
      tooltipParents.each((i, elem) => {
        const componentName = elem.className.contains('popover') ? 'popover' : 'tooltip';
        const api = $(elem).data(componentName);
        if (api && api.isFocused) {
          componentHasFocus = true;
        }
      });
    }

    return componentHasFocus;
  },

  /**
   * Creates an internal reference for all tabbable elements present within the Modal.
   * @private
   * @returns {void}
   */
  setFocusableElems() {
    const extraSelectors = [];
    const ignoredSelectors = [
      'option'
    ];

    const elems = DOM.focusableElems(this.element[0], extraSelectors, ignoredSelectors);
    this.focusableElems = elems;
    this.focusableElems.first = elems[0];
    this.focusableElems.last = elems[elems.length - 1];
  },

  /**
   * Focuses special elements within the modal.
   * @param {string} place the location to set the Modal's current focus
   */
  setFocus(place) {
    const places = ['last', 'first'];
    if (places.indexOf(place) === -1) {
      return;
    }

    if (!this.focusableElems) {
      this.setFocusableElems();
    }

    let target;
    switch (place) {
      case 'last':
        target = this.focusableElems.last;
        break;
      case 'first':
        target = this.focusableElems.first;
        break;
      default:
        break;
    }

    if (target) {
      target.focus();
      target.classList.remove('hide-focus');

      // Trigger an optional callback that can further modify changes on focus
      if (typeof this.settings.onFocusChange === 'function') {
        this.settings.onFocusChange(this, target);
      }
    }
  },

  /**
   * Close the modal.
   * @param {boolean} destroy Call the destroy method.
   * @param {boolean} [noRefresh=false] if true, prevents the ModalManager from refreshing state when the close is complete.
   * @param {boolean} [force = false] if true, forces the modal closed and ignores open subcomponents/visibility.
   * @param {string} customId ID of element
   * @returns {boolean} If the dialog was open returns false. If the dialog was closed is true.
   */
  // eslint-disable-next-line default-param-last
  async close(destroy, noRefresh, force = false, customId) {
    if (!force && !this.visible) {
      return true;
    }

    const beforeClose = this.element.triggerHandler(`beforeclose${customId ? `.${customId}` : ''}`);
    let elemCanClose = beforeClose;

    if (beforeClose && beforeClose.then && typeof beforeClose.then === 'function') {
      await beforeClose.then((res) => {
        elemCanClose = res;
      });
    }

    if (elemCanClose === false) {
      return false;
    }

    const self = this;
    const fields = this.element.find('[data-validate]');
    fields.addClass('disable-validation');

    if (this.changeObserver) {
      this.changeObserver.disconnect();
      delete this.changeObserver;
    }

    if (this.isCAP) {
      this.element.addClass('is-animating');
    }

    if (this.mainContent && this.removeNoScroll) {
      this.mainContent.removeClass('no-scroll');
    }
    $('body').off(`resize.${this.namespace} focusin.${self.namespace}`);

    this.element.off(`keypress.${this.namespace} keydown.${this.namespace}`);

    // Closing other sub components popover (timepicker, colorpicker, etc.)
    if (this.openSubComponents.length > 0 && !force) {
      const openComponent = this.openSubComponents[0];

      if (openComponent.element.hasClass('colorpicker')) {
        openComponent.close();
      } else {
        const popoverData = openComponent?.popup?.data('popover');
        if (popoverData) {
          popoverData.hide();
        }
      }
    } else {
      this.visible = false;
      this.active = false;
    }

    delete this.dontCheckFocus;

    // Fire Events
    if (customId) {
      self.element.trigger(`close.${customId}`, self.isCancelled);
    } else {
      self.element.trigger('close', self.isCancelled);
    }

    if (!this.settings.noRefocus && this.isFocused) {
      document.activeElement.blur();
    }

    // close tooltips
    $('#validation-errors, #tooltip, #validation-tooltip').addClass('is-hidden');

    const closeBtn = $(this.closeBtn);
    const closeBtnTooltipAPI = closeBtn.data('tooltip');
    if (closeBtnTooltipAPI) {
      closeBtnTooltipAPI.hide();
      closeBtnTooltipAPI.reopenDelay = true;
    }

    // remove the event that changed this page's skip-link functionality in the open event.
    $('.skip-link').off(`focus.${this.namespace}`);

    const afterCloseTimer = new RenderLoopItem({
      duration: modalManager.modalFadeDuration,
      timeoutCallback() {
        if (customId) {
          self.element.trigger(`afterclose.${customId}`, self.isCancelled);
        } else {
          self.element.trigger('afterclose');
        }

        if (closeBtnTooltipAPI) {
          delete closeBtnTooltipAPI.reopenDelay;
        }

        if (self.settings.trigger === 'immediate' || destroy) {
          if (!self.isCAP || (self.isCAP && !self.capAPI)) {
            self.destroy(customId);
          }
        }

        if (!noRefresh) {
          modalManager.refresh();
        }

        // Restore focus to the correct element.
        if (!self.settings.noRefocus) {
          if (!self.oldActive && self.settings.triggerButton) {
            self.oldActive = self.useJqEl(self.settings.triggerButton);
          }
          if (self.oldActive && $(self.oldActive).is('a:visible, button:visible, input:visible, textarea:visible')) {
            self.oldActive.focus();
          } else if (self.trigger.parents('.toolbar, .formatter-toolbar').length < 1) {
            self.trigger.focus();
          }
        }
      }
    });
    renderLoop.register(afterCloseTimer);

    return false;
  },

  /**
   * Use input as jquery element
   * @param {htmlObject|jqueryObject|srting} option This option can be html or jquery object or query selector as string
   * @returns {object} The jquery element.
   */
  useJqEl(option) {
    return option instanceof jQuery ? option : $(option);
  },

  /**
   * Update the modal
   * @param {settings} settings The settings to update on the modal
   * @returns {object} The modal object for chaining.
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
      this.settings = handleModalDefaults(this.settings);
    }

    if (this.settings.trigger === 'immediate') {
      this.open();
    }

    return this;
  },

  /**
   * Destroy the modal.
   * @param {string} customId ID of element
   */
  destroy(customId) {
    const self = this;
    const canDestroy = this.element.trigger(`beforedestroy${customId ? `.${customId}` : ''}`);
    if (!canDestroy) {
      return;
    }

    function destroyCallback() {
      self.trigger.off(`click.${self.namespace}`);
      self.element.off(`keypress.${self.namespace} keydown.${self.namespace} beforeclose.${self.namespace} afterclose.${self.namespace}`);
      self.element.find('button, .btn-close').off(`click.${self.namespace}`);
      self.element.find('.paginated').off(`afterpaging.${self.namespace}`);

      $('.skip-link').off(`focus.${self.namespace}`);
      $('body').off(`resize.${self.namespace}`);
      $(self.element).off(`keydown.${self.namespace}`);

      if (self.element.find('.detailed-message').length === 1) {
        $('body').off(`resize.${self.namespace}`);
      }

      // Properly teardown contexual action panels
      if (self.isCAP && self.capAPI) {
        self.capAPI.destroy();
      }
      if (self.aboutAPI) {
        self.aboutAPI.destroy(true);
      }

      // If a buttonset exists, remove events and destroy completely.
      if (self.buttonsetAPI) {
        self.buttonsetAPI.buttons.forEach((button) => {
          $(button.element).off(`click.${self.namespace}`);
        });

        self.buttonsetAPI.destroy();
        self.buttonsetElem.remove();
        delete self.buttonsetAPI;
        delete self.buttonsetElem;
      }
      delete self.focusableElems;

      self.trigger.off(`click.${self.namespace}`);

      self.element[0].removeAttribute('data-modal');

      const $wrapperElem = self.element.parent('.modal-wrapper');
      if ($wrapperElem.length) {
        $wrapperElem.remove();
      }

      const destroyTimer = new RenderLoopItem({
        duration: 21, // should match the length of time needed for the overlay to fade out
        timeoutCallback() {
          let elem = null;
          let modalApi = self.element ? self.element.data(COMPONENT_NAME) : null;
          if (modalApi) {
            elem = self.element[0];
          } else {
            modalApi = self.trigger ? self.trigger.data(COMPONENT_NAME) : null;
            if (modalApi) {
              elem = self.trigger[0];
            }
          }
          if (elem && modalApi && modalApi.overlay) {
            $.removeData(elem, COMPONENT_NAME);
          }
        }
      });
      renderLoop.register(destroyTimer);

      // Remove this modal instance from the global Modal manager.
      modalManager.unregister(self);

      // If the current `element` is not the original one the component was invoked against,
      // remove the second reference to this component API on the new element.
      if (self.originalElement instanceof $) {
        $.removeData(self.originalElement[0], 'modalElementLink');
      }

      $.removeData(self.element[0], COMPONENT_NAME);
    }

    if (!this.visible) {
      destroyCallback();
      return;
    }

    this.element.on(`afterclose.${self.namespace}`, () => {
      destroyCallback();
    });

    this.close(true);
  }
};

export { Modal, COMPONENT_NAME };
