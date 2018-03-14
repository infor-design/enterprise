import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

// jQuery components
import '../button/button.jquery';

// The name of this component.
const COMPONENT_NAME = 'modal';

/**
* @namespace
* @property {string} trigger The method of opening the dialog. Supports click, immediate.
* @property {array} buttons  A list of buttons that will sit in the toolbar's Buttonset area.
* @property {isAlert} isAlert Adds alertdialog role for message dialogs.
* @property {content} content Ability to pass in dialog html content.
* @property {string} cssClass Append a css class to top level.
* @property {boolean} autoFocus If true the first input will be focused.
* @property {string} id Optionally tag a dialog with an id.
* @property {number} frameHeight Optional extra height to add.
* @property {number} frameWidth Optional extra width to add.
* @property {boolean} beforeShow Optional callback for before show
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
  beforeShow: false
};

/**
* Responsive and Accessible Modal Control
* @class Modal
* @param {string} element The component element.
* @param {string} settings The component settings.
*/
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
  init() {
    const self = this;

    // Used for tracking events tied to the Window object
    this.id = (parseInt($('.modal').length, 10) + 1);
    this.trigger = $(`button[data-modal="${this.element.attr('id')}"]`); // Find the button with same dialog ID
    this.overlay = $('<div class="overlay"></div>');
    this.oldActive = this.trigger;

    if (this.settings.trigger === 'click') {
      this.trigger.on('click.modal', () => {
        self.open();
      });
    }

    if (this.settings.trigger === 'immediate') {
      setTimeout(() => {
        self.open();
      }, 1);
    }

    self.isCancelled = false;

    if (window.history && window.history.pushState) {
      $(window).off('popstate.modal');

      $(window).on('popstate.modal', () => {
        self.destroy();
      });
    }

    // ensure is appended to body for new dom tree
    if (this.settings.content) {
      this.settings.trigger = this.settings.content instanceof jQuery ? this.settings.trigger : 'immediate';
      this.appendContent();
      setTimeout(() => {
        self.open();
      }, 1);
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

    if (this.settings.id) {
      this.element.attr('id', this.settings.id);
    }

    if ($(this.settings.content).is('.modal')) {
      this.element = $(this.settings.content);
    } else if (this.settings.content && this.settings.content.length > 0) {
      if (this.settings.content instanceof jQuery && this.settings.content.parent().is('.modal-body')) {
        isAppended = true;
        this.element = this.settings.content.closest('.modal');
      } else {
        if (this.settings.beforeShow) {
          this.element.find('.modal-body').append($('<div class="field"><div id="modal-busyindicator" class="busy card"></div></div>'));
        }

        this.element.find('.modal-body').append(this.settings.content);
      }

      if (this.settings.content instanceof jQuery && !this.settings.beforeShow) {
        this.settings.content.removeClass('hidden is-hidden');
        this.settings.content.show();
      }
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

    if (this.settings.beforeShow) {
      const busyIndEl = $('#modal-busyindicator');
      busyIndEl.busyindicator({}).data('busyindicator');
      busyIndEl.trigger('start.busyindicator');
    }
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
   * @returns {void}
   */
  disableSubmit() {
    const body = this.element;
    const fields = body.find('[data-validate]:visible');
    const inlineBtns = body.find('.modal-buttonset button');
    const primaryButton = inlineBtns.filter('.btn-modal-primary').not('.no-validation');

    if (fields.length > 0) {
      primaryButton.removeAttr('disabled');

      let allValid = true;
      fields.each(function () {
        const field = $(this);
        if (field.closest('.datagrid-filter-wrapper').length > 0) {
          return;
        }

        const isVisible = field[0].offsetParent !== null;

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

    if (this.element.is('.contextual-action-panel')) {
      isPanel = true;
      // construct the toolbar markup if a toolbar isn't found
      buttonset = this.element.find('.buttonset');
      if (!buttonset.length) {
        const toolbar = this.element.find('.toolbar');
        if (!toolbar.length) {
          $('<div class="toolbar"></div>').appendTo(this.element.find('.modal-header'));
        }
        buttonset = $('<div class="buttonset"></div>').appendTo(this.element.find('.toolbar'));
      }
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
      let btn = $('<button type="button"></button>');
      btn.text(props.text);
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

        buttonset.append(label, input);
        return;
      }

      if (props.icon && props.icon.charAt(0) === '#') {
        btn.html(`<span>${btn.text()}</span>`);
        $.createIconElement({
          classes: [props.icon === '#icon-close' ? 'icon-close' : ''],
          icon: props.icon.substr('#icon-'.length)
        }).prependTo(btn);
      }

      btn.attr('id', props.id || $.fn.uniqueId('button', 'modal'));

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
      buttonset.append(btn);
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

  /**
  * Completes the busy indicator and removes it from body then shows content
  * @returns {void}
  */
  endLoading() {
    if (this.settings.beforeShow) {
      $('#modal-busyindicator').trigger('complete.busyindicator');

      $($('#modal-busyindicator')[0].parentElement).remove();

      if (this.settings.content instanceof jQuery) {
        this.settings.content.show();
      }
    }
  },

  /**
  * Open the modal via the api.
  * @returns {void}
  */
  open() {
    let messageArea = null;
    let elemCanOpen = true;

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

    elemCanOpen = this.element.triggerHandler('beforeopen', [this]);
    $('body').triggerHandler('beforeopen', [this]);
    this.isCancelled = false;

    if (elemCanOpen === false) {
      this.overlay.remove();
      this.root[0].style.display = 'none';
      return;
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
      this.element.attr('aria-labeledby', 'message-title');
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

      this.element.attr('aria-labeledby', id);

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
      this.root.attr('aria-hidden', 'false');
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

      if (target.is('.searchfield') || target.is('textarea') || target.is(':button') || target.is('.dropdown') || target.closest('.tab-list').length) {
        return;
      }

      if (e.which === 13 && this.isOnTop() &&
          !target.closest('form').find(':submit').length &&
          this.element.find('.btn-modal-primary:enabled').length) {
        e.stopPropagation();
        e.preventDefault();
        this.element.find('.btn-modal-primary:enabled').trigger('click');
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

    setTimeout(() => {
      this.element.trigger('afteropen');
    }, 300);
  },

  resize() {
    // 90% -(180 :extra elements-height)
    let calcHeight = ($(window).height() * 0.9) - this.settings.frameHeight;
    const calcWidth = ($(window).width() * 1) - this.settings.frameWidth;

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

  isOpen() {
    return this.element.is('.is-visible');
  },

  isOnTop() {
    let max = 0;
    const dialog = this.element;

    $('.modal.is-visible').each(function () {
      if (max < this.style.zIndex) {
        max = this.style.zIndex;
      }
    });

    return max === dialog[0].style.zIndex;
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
    $(document).on('keyup.modal', (e) => {
      const keyCode = e.which || e.keyCode;
      if (keyCode === 27) {
        const modals = $('.modal.is-visible');
        const doAction = function (api) {
          if (!api.element.data('listclosed')) {
            api.close();
          }
          setTimeout(() => {
            api.element.removeData('listclosed');
          }, 0);
        };

        if (modals.length > 1) {
          modals.not(':last').on('beforeclose.modal', () => false);
          modals.on('afterclose.modal', () => {
            modals.off('beforeclose.modal');
          });
          const apiModal = modals.last().data('modal');
          if (apiModal && apiModal.close) {
            doAction(apiModal);
          }
        } else {
          doAction(self);
        }
      }
    });

    $(self.element).on('keypress.modal keydown.modal', (e) => {
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
    if (!this.isOpen()) {
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

    if ($('.modal-page-container[aria-hidden="false"]').length < 1) {
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

  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    return this;
  },

  // NOTE: Destroy method needs to function as a callback to be cancellable
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

      if (self.settings.trigger === 'click') {
        self.trigger.off('click.modal');
      }

      self.element.closest('.modal-page-container').remove();
      $.removeData(self.element[0], 'modal');

      $(window).off('popstate.modal');
    }

    if (!this.isOpen()) {
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
