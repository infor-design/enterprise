import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../../../src/components/locale/locale';

// jQuery components
import '../button/button.jquery';

// The name of this component.
const COMPONENT_NAME = 'modal';

/**
* Responsive and Accessible Modal Control
* @class Modal
* @param {string} element The component element.
* @param {string} settings The component settings.
*
* @param {string} [settings.trigger='click'] The method of opening the dialog. Supports click, immediate.
* @param {array} [settings.buttons=null]  A list of buttons that will sit in the toolbar's Buttonset area.
* @param {isAlert} [settings.isAlert=false] Adds alertdialog role for message dialogs.
* @param {content} [settings.content=null] Ability to pass in dialog html content.
* @param {string} [settings.cssClass=null] Append a css class to top level.
* @param {boolean} [settings.autoFocus=true] If true the first input will be focused.
* @param {string} [settings.id=null] Optionally tag a dialog with an id.
* @param {number} [settings.frameHeight=180] Optional extra height to add.
* @param {number} [settings.frameWidth=46] Optional extra width to add.
* @param {function} [settings.beforeShow=null] A call back function that can be used to return data for the modal.
* @param {boolean} [settings.useFlexToolbar] If true the new flex toolbar will be used (For CAP)
* @param {boolean} [settings.showCloseBtn] If true, show a close icon button on the top right of the modal.
* return the markup in the response and this will be shown in the modal. The busy indicator will be shown while waiting for a response.
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
  frameWidth: 46,
  beforeShow: null,
  useFlexToolbar: false,
  showCloseBtn: false
};

function Modal(element, settings) {
  this.settings = utils.mergeSettings(element, settings, MODAL_DEFAULTS);
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
    } else if (this.mainContent.is('body')) {
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
   * @private
   */
  init() {
    const self = this;

    // Used for tracking events tied to the Window object
    this.id = this.element.attr('id') || (parseInt($('.modal').length, 10) + 1);

    // Find the button or anchor with same dialog ID
    this.trigger = $(`[data-modal="${this.element.attr('id')}"]`);
    if (this.element.is('body')) {
      this.trigger = this.element;
    }

    this.overlay = $('<div class="overlay"></div>');
    this.oldActive = this.trigger;

    if (this.settings.trigger === 'click' && !this.isAttachedToBody) {
      this.trigger.on('click.modal', (e) => {
        if (!$(e.currentTarget).is(self.trigger)) {
          return;
        }
        self.open();
      });
    }

    if (this.settings.trigger === 'immediate') {
      setTimeout(() => {
        self.open();
      }, 1);
    }

    self.isCancelled = false;

    // ensure is appended to body for new dom tree
    if (this.settings.content) {
      this.settings.trigger = this.settings.content instanceof jQuery ? this.settings.trigger : 'immediate';
      this.appendContent();
      setTimeout(() => {
        self.open();
      }, 1);
      return;
    }

    if (this.settings.beforeShow) {
      this.settings.trigger = this.settings.content instanceof jQuery ? this.settings.trigger : 'immediate';
      this.appendContent();
      this.callSource();
      return;
    }

    self.addButtons(this.settings.buttons);
    this.element.appendTo('body');
    this.element[0].style.display = 'none';
  },

  appendContent() {
    let isAppended = false;

    this.element = $(`${'<div class="modal">' +
        '<div class="modal-content">' +
          '<div class="modal-header"><h1 class="modal-title">'}${this.settings.title}</h1></div>` +
          '<div class="modal-body-wrapper">' +
            '<div class="modal-body"></div>' +
          '</div>' +
        '</div>' +
      '</div>');

    if (this.settings.showCloseBtn) {
      const closeBtn = $(`
        <button type="button" class="btn-icon btn-close" title="${Locale.translate('Close')}" aria-hidden="true">
          ${$.createIcon('close')}
          <span class="audible">${Locale.translate('Close')}</span>
        </button>
      `);
      this.element.find('.modal-content').append(closeBtn);
      closeBtn.on('click.modal', () => this.close()).tooltip();
    }

    if (this.settings.id) {
      this.element.attr('id', this.settings.id);
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
      this.element.find('.modal-title').text(this.settings.title);
    }

    if (!isAppended) {
      this.addButtons(this.settings.buttons);
    }

    utils.fixSVGIcons(this.element);
  },

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
      inlineBtns.not('[data-ng-click], [ng-click], [onclick], :submit').on('click.modal', (e) => {
        if ($(e.target).is('.btn-cancel')) {
          self.isCancelled = true;
        }
        self.close();
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

      if (props.audible) {
        span.addClass('audible');
      }

      if (props.validate !== undefined && !props.validate) {
        btn.addClass('no-validation');
      }

      const attrs = {};
      const attrTypes = ['id', 'name', 'text'];

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

      btn.on('click.modal', (e) => {
        if (func) {
          func.apply(self.element[0], [e, self]);
          return;
        }
        self.close();
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

    if (!this.trigger || this.trigger.length === 0) {
      this.oldActive = $(':focus'); // Save and restore focus for A11Y
    }

    this.element.after(this.overlay);
    if (this.element && !this.element.parent().hasClass('modal-wrapper')) {
      this.element.wrap('<div class="modal-page-container"><div class="modal-wrapper"></div>');
    }
    this.root = this.element.closest('.modal-page-container');

    messageArea = this.element.find('.detailed-message');
    if (messageArea.length === 1) {
      $('body').on(`resize.modal-${this.id}`, () => {
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
    $('body').triggerHandler('beforeopen', [this]);
    this.isCancelled = false;

    if (elemCanOpen === false) {
      this.overlay.remove();
      this.root[0].style.display = 'none';
      return;
    }

    if (!ajaxReturn) {
      this.callSource();

      if (this.settings.beforeShow) {
        return;
      }
    }

    // Look for other nested dialogs and adjust the zindex.
    $('.modal').each(function (i) {
      const modal = $(this);
      this.style.zIndex = (1020 + (i + 1)).toString();

      if (modal.data('modal') && modal.data('modal').overlay) {
        modal.data('modal').overlay[0].style.zIndex = (1020 + i).toString();
      }

      if (!modal.data('modal')) {
        const overlay = modal.closest('.modal-page-container').next('.overlay');
        if (overlay && overlay[0]) {
          overlay[0].style.zIndex = (1020 + i).toString();
        }
      }
    });

    $('body > *').not(this.element).not('.modal, .overlay, .modal-page-container').attr('aria-hidden', 'true');

    // Ensure aria-labelled by points to the id
    if (this.settings.isAlert) {
      this.element.attr('aria-labelledby', 'message-title');
      this.element.attr('aria-describedby', 'message-text');
    } else {
      const h1 = this.element.find('h1:first');
      let id = h1.attr('id');

      if (!id) {
        id = `${this.element.attr('id') ? this.element.attr('id') : 'h1'}-title`;
        h1.attr('id', id);
      }

      const body = this.element.find('.modal-body');
      const descById = `${this.element.attr('id') ? this.element.attr('id') : 'message'}-text`;

      this.element.attr('aria-labelledby', id);

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

    $('body').on(`resize.modal-${this.id}`, () => {
      this.resize();
    });

    // Center
    this.root[0].style.display = '';
    this.element[0].style.display = '';

    setTimeout(() => {
      this.resize();
      this.element.addClass('is-visible').attr('role', (this.settings.isAlert ? 'alertdialog' : 'dialog'));
      this.root.removeAttr('aria-hidden');
      this.overlay.attr('aria-hidden', 'true');
      this.element.attr('aria-modal', 'true'); // This is a forward thinking approach, since aria-modal isn't actually supported by browsers or ATs yet
    }, 1);

    // Add the 'modal-engaged' class after all the HTML markup and CSS classes have a
    // chance to be established
    // (Fixes an issue in non-V8 browsers (FF, IE) where animation doesn't work correctly).
    // http://stackoverflow.com/questions/12088819/css-transitions-on-new-elements
    $('body').addClass('modal-engaged');

    // Handle Default button.
    $(this.element).on('keypress.modal', (e) => {
      const target = $(e.target);

      if (target.is('.editor, .searchfield, textarea, :button') || target.closest('.tab-list').length || $('#dropdown-list').length) {
        return;
      }

      if (e.which === 13 && this.isOnTop &&
          !target.closest('form').find(':submit').length &&
          this.element.find('.btn-modal-primary:enabled').length) {
        e.stopPropagation();
        e.preventDefault();

        if ((!target.hasClass('fileupload') && !$(target).is(':input')) || target.hasClass('colorpicker')) {
          this.element.find('.btn-modal-primary:enabled').trigger('click');
        }
      }
    });

    // Override this page's skip-link default functionality to instead focus the top
    // of this element if it's clicked.
    $('.skip-link').on('focus.modal', (e) => {
      e.preventDefault();
      this.getTabbableElements().first.focus();
    });

    function focusElement(self) {
      let focusElem = self.element.find(':focusable').not('.modal-header .searchfield').first();
      self.keepFocus();

      /**
      * Fires when the modal opens.
      * @event open
      * @memberof Modal
      * @property {object} event - The jquery event object
      * @property {object} ui - The dialog object
      */
      self.element.trigger('open', [self]);

      if (focusElem.length === 0) {
        focusElem = self.element.find('.btn-modal-primary');
      }

      if (focusElem.length === 1 && focusElem.is('.btn-modal')) {
        focusElem = self.element.find('.btn-modal-primary');
      }

      if (focusElem.length === 1 && focusElem.is('button') && !focusElem.is(':disabled')) {
        focusElem.addClass('hide-focus');
      }

      if (!self.settings.autoFocus) {
        return;
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

      // Otherwise, just focus
      focusElem.focus();
    }

    const pagerElem = this.element.find('.paginated');
    pagerElem.on('afterpaging', () => {
      this.resize();
    });

    setTimeout(() => {
      this.disableSubmit();
    }, 10);

    const fields = this.element.find('[data-validate]');
    fields.removeClass('disable-validation');

    setTimeout(() => {
      focusElement(this);
    }, 200);

    /**
    * Fires after the modal has opened.
    * @event afteropen
    * @memberof Modal
    * @property {object} event - The jquery event object
    * @property {object} ui - The dialog object
    */
    setTimeout(() => {
      this.element.trigger('afteropen');
    }, 300);
  },

  resize() {
    // 90% -(180 :extra elements-height)
    let calcHeight = ($(window).height() * 0.9) - this.settings.frameHeight;
    const calcWidth = ($(window).width() * 1.05) - this.settings.frameWidth;

    const wrapper = this.element.find('.modal-body-wrapper');

    // Remove width for backwards compat
    this.element.find('.modal-contents').css('width', '');

    if (wrapper.length) {
      wrapper[0].style.maxHeight = `${calcHeight}px`;
      wrapper[0].style.maxWidth = `${calcWidth}px`;
    }

    if (this.element.hasClass('lookup-modal')) {
      const table = this.element.find('.datagrid-body');
      const hasPager = this.element.find('.pager-toolbar');
      const container = table.closest('.datagrid-container');

      calcHeight = calcHeight - (container.prev().is('.toolbar') ? 130 : 60) - (container.next().is('.pager-toolbar') ? 35 : 0);
      table[0].style.maxHeight = `${calcHeight + (hasPager.length ? -15 : 0)}px`;
      table[0].style.maxWidth = `${calcWidth}px`;
    }

    const toolbars = this.element.find('.toolbar');
    if (toolbars.length) {
      toolbars.triggerHandler('recalculate-buttons');
    }
  },

  /**
   * @deprecated as of v4.14.x
   * @returns {boolean} The current state open (true) or closed (false).
   */
  isOpen() {
    return this.visible;
  },

  getTabbableElements() {
    const allTabbableElements = $(this.element).find('a[href], area[href], input:not([disabled]),' +
      'select:not([disabled]), textarea:not([disabled]),' +
      'button:not([disabled]), iframe, object, embed, *[tabindex],' +
      '*[contenteditable]').filter(':visible');
    return {
      first: allTabbableElements[0],
      last: allTabbableElements[allTabbableElements.length - 1]
    };
  },

  keepFocus() {
    const self = this;
    let tabbableElements;

    // Escape key
    $(document)
      .off(`keydown.modal-${this.id}`)
      .on(`keydown.modal-${this.id}`, (e) => {
        const keyCode = e.which || e.keyCode;
        if (keyCode === 27) {
          const modals = $('.modal.is-visible');

          self.isCancelled = true;

          if (modals.length > 1) {
            modals.not(':last').on('beforeclose.modal', () => false);
            modals.on('afterclose.modal', () => {
              modals.off('beforeclose.modal');
            });
            const apiModal = modals.last().data('modal');
            if (apiModal && apiModal.close) {
              apiModal.close();
            }
          } else {
            self.close();
          }
        }
      });

    $(self.element)
      .off('keypress.modal keydown.modal')
      .on('keypress.modal keydown.modal', (e) => {
        const keyCode = e.which || e.keyCode;

        if (keyCode === 9) {
          tabbableElements = self.getTabbableElements();

          // Move focus to first element that can be tabbed if Shift isn't used
          if (e.target === tabbableElements.last && !e.shiftKey) {
            e.preventDefault();
            tabbableElements.first.focus();
          } else if (e.target === tabbableElements.first && e.shiftKey) {
            e.preventDefault();
            tabbableElements.last.focus();
          }

          self.element.find('#message-title').removeAttr('tabindex');
        }
      });
  },

  /**
   * Close the modal.
   * @param  {boolean} destroy Call the destroy method.
   * @returns {boolean} If the dialog was open returns false. If the dialog was closed is true.
   */
  close(destroy) {
    if (!this.visible) {
      return true;
    }

    const elemCanClose = this.element.triggerHandler('beforeclose');
    const self = this;
    const fields = this.element.find('[data-validate]');

    this.root = this.element.closest('.modal-page-container');
    fields.addClass('disable-validation');

    if (elemCanClose === false) {
      return false;
    }

    if (this.mainContent && this.removeNoScroll) {
      this.mainContent.removeClass('no-scroll');
    }
    $('body').off(`resize.modal-${this.id}`);

    this.element.off('keypress.modal keydown.modal');
    this.element.removeClass('is-visible');

    this.overlay.attr('aria-hidden', 'true');
    if (this.root) {
      this.root.attr('aria-hidden', 'true');
    }

    if ($('.modal-page-container').length <= 1) {
      $('body').removeClass('modal-engaged');
      $('body > *').not(this.element.closest('.modal-page-container')).removeAttr('aria-hidden');
      $('.overlay').remove();
    }

    // Fire Events
    self.element.trigger('close', self.isCancelled);

    // Restore focus
    if (this.oldActive && $(this.oldActive).is('a:visible, button:visible, input:visible, textarea:visible')) {
      this.oldActive.focus();
      this.oldActive = null;
    } else if (this.trigger.parents('.toolbar, .formatter-toolbar').length < 1) {
      this.trigger.focus();
    }

    // close tooltips
    $('#validation-errors, #tooltip, #validation-tooltip').addClass('is-hidden');

    // remove the event that changed this page's skip-link functionality in the open event.
    $('.skip-link').off('focus.modal');

    setTimeout(() => {
      self.overlay.remove();
      self.root[0].style.display = 'none';
      self.element.trigger('afterclose');

      if (self.settings.trigger === 'immediate' || destroy) {
        self.destroy();
      }
    }, 300); // should match the length of time needed for the overlay to fade out

    return false;
  },

  /**
   * Update the modal
   * @param {settings} settings The settings to update on the modal
   * @returns {object} The modal object for chaining.
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    if (this.settings.trigger === 'immediate') {
      this.open();
    }

    return this;
  },

  /**
   * Destroy the modal.
   */
  destroy() {
    const self = this;
    const canDestroy = this.element.trigger('beforedestroy');

    if (!canDestroy) {
      return;
    }

    function destroyCallback() {
      if (self.modalButtons) {
        self.element.find('button').off('click.modal');
      }

      if (self.element.find('.detailed-message').length === 1) {
        $('body').off(`resize.modal-${this.id}`);
      }

      // Properly teardown contexual action panels
      if (self.isCAP && self.capAPI) {
        self.capAPI.teardown();
      }

      self.trigger.off('click.modal');

      if (self.root && self.root.length) {
        self.root.remove();
      } else {
        self.element.closest('.modal-page-container').remove();
      }
      self.element[0].removeAttribute('data-modal');

      $.removeData(self.element[0], 'modal');
      if (self.isCAP && self.capAPI) {
        self.capAPI.destroy();
      }
    }

    if (!this.visible) {
      destroyCallback();
      return;
    }

    this.element.one('afterclose.modal', () => {
      destroyCallback();
    });

    this.close(true);
  }
};

export { Modal, COMPONENT_NAME };
