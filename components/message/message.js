import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

// jQuery Components
import '../modal/modal';

// This component name
const COMPONENT_NAME = 'message';

/**
* @namespace
* @property {string} title  Title text or content shown in the message
* @property {boolean} isError  If true, will show title styled as an error with an error icon
* @property {string} message  The message content or text
* @property {number} width  Pass a specific with or defaults to auto
* @property {object} buttons  Array of buttons to add to the message (see modal examples as well)
* @property {string} cssClass  Extra Class to add to the dialog for customization.
* @property {string} returnFocus  JQuery Element selector to focus on return
*/
const MESSAGE_DEFAULTS = {
  title: 'Message Title',
  isError: false,
  message: 'Message Summary',
  width: 'auto',
  buttons: null,
  cssClass: null,
  returnFocus: null
};

/**
 * The Message Component is used to show warning / error messages.
 * @class About
 * @param {object} element The component element.
 * @param {object} settings The component settings.
 */
function Message(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(element, settings, MESSAGE_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

Message.prototype = {

  init() {
    const self = this;
    let content;

    // Create the Markup
    this.message = $('<div class="modal message"></div>');
    this.messageContent = $('<div class="modal-content"></div>');
    this.title = $(`<h1 class="modal-title" id="message-title">${this.settings.title}</h1>`).appendTo(this.messageContent).wrap('<div class="modal-header"></div>');
    this.content = $(`<div class="modal-body"><p class="message" id="message-text">${this.settings.message}</p></div>`).appendTo(this.messageContent);

    // Append The Content if Passed in
    if (!this.element.is('body')) {
      content = this.element;
      this.content.empty().append(content.show());
    }

    this.message.append(this.messageContent).appendTo('body');
    this.message.modal({
      trigger: 'immediate',
      buttons: this.settings.buttons,
      resizable: this.settings.resizable,
      close: this.settings.close,
      isAlert: true
    });

    // Adjust Width if Set as a Setting
    if (this.settings.width !== 'auto') {
      this.content.closest('.modal')[0].style.maxWidth = 'none';
      this.content.closest('.modal')[0].style.width = this.settings.width + (/(px|%)/i.test(`${this.settings.width}`) ? '' : 'px');
    }

    if (this.settings.cssClass) {
      this.message.addClass(this.settings.cssClass);
    }

    // Setup the destroy event to fire on close.
    // Needs to fire after the "close" event on the modal.
    this.message.on('beforeclose.message', () => {
      const ok = self.element.triggerHandler('beforeclose');
      return ok;
    }).on('beforeopen.message', () => {
      const ok = self.element.triggerHandler('beforeopen');
      return ok;
    }).on('open.message', () => {
      self.element.trigger('open');
    }).on('afterclose.message', () => {
      self.destroy();
      if (self.settings.returnFocus) {
        self.settings.returnFocus.focus();
      }

      $(document).off('keypress.message keydown.message');
    });

    $(document).on('keypress.message keydown.message', (e) => {
      const keyCode = e.which || e.keyCode;

      if (keyCode === 27) {
        setTimeout(() => {
          const modalData = self.message.data('modal');
          if (modalData !== undefined) {
            modalData.close();
          }
        }, 0);
      }
    });

    if (this.settings.isError) {
      this.title.addClass('is-error').prepend($.createIconElement('error'));
    } else {
      this.title.removeClass('is-error').find('svg').remove();
    }
  },

  /**
  * Tear Down and destroy events. However the message will destroy itself on close.
  */
  destroy() {
    const modalData = this.message.data('modal');
    if (modalData !== undefined) {
      modalData.destroy();
    }

    this.message
      .off('beforeclose.message beforeopen.message open.message afterclose.message')
      .remove();
  }
};

export { Message, COMPONENT_NAME };
