import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';
import { Locale } from '../locale/locale';

// jQuery Components
import '../modal/modal';

// This component name
const COMPONENT_NAME = 'message';

/**
 * The Message Component is used to show warning / error messages.
 * @class Message
 * @param {object} element The component element.
 * @param {object} [settings] The component settings.
 * @param {string} [settings.title='Message Title']  Title text or content shown in the message. An HTML string containing the follow tags may also be used `<div><span><a><small><img><svg><i><b><use><br><strong><em>`.
 * @param {string} [settings.status='']  Pass a status to style icon and title color ('error', 'alert', 'success')
 * @param {string} [settings.message='Message Summary']  The message content or text
 * @param {number} [settings.width='auto']  Pass a specific with or defaults to auto
 * @param {object} [settings.buttons=null]  Array of buttons to add to the message (see modal examples as well)
 * @param {string} [settings.cssClass=null]  Extra Class to add to the dialog for customization.
 * @param {string} [settings.returnFocus=null]  JQuery Element selector to focus on return.
 * @param {string} [settings.allowedTags='<a><b><br><br/><del><em><i><ins><mark><small><strong><sub><sup>']  String of allowed HTML tags.
 * @param {string} [settings.audibleLabel='']  String to include in message title that is strictly audible.
 * @param {string} [settings.overlayOpacity=0.7] Adds the ability to control the opacity of the background overlay.
 * @param {string} [settings.attributes] Add extra attributes like id's to the toast element. For example `attributes: { name: 'id', value: 'my-unique-id' }`
 * @param {boolean} [settings.noRefocus=false] If true, causes the modal's trigger element not to become focused once the modal is closed.
*/
const MESSAGE_DEFAULTS = {
  title: 'Message Title',
  status: '',
  message: 'Message Summary',
  width: 'auto',
  maxWidth: null,
  buttons: null,
  cssClass: null,
  returnFocus: null,
  allowedTags: '<a><b><br><br/><del><em><i><ins><mark><small><strong><sub><sup>',
  audibleLabel: '',
  overlayOpacity: 0.7,
  hideUnderneath: false,
  attributes: null,
  noRefocus: false
};

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
    const tags = this.settings.allowedTags;
    let allowTags = true;

    // Check for any allowed tags in settings string
    if (!(this.settings.allowedTags.length > 0)) {
      allowTags = false;
    }

    // Create the Markup
    this.message = $('<div class="modal message"></div>');
    this.messageContent = $('<div class="modal-content"></div>');
    this.title = $(`<h1 class="modal-title" id="message-title">${allowTags ? xssUtils.stripTags(this.settings.title, tags) : xssUtils.stripHTML(this.settings.title)}</h1>`).appendTo(this.messageContent).wrap('<div class="modal-header"></div>');
    this.content = $(`<div class="modal-body"><div class="message" id="message-text">${allowTags ? xssUtils.stripTags(this.settings.message, tags) : xssUtils.stripHTML(this.settings.message)}</div></div>`).appendTo(this.messageContent);

    if (this.settings.audibleLabel !== '') {
      this.title.prepend(`<span class="audible">${Locale.translate(this.settings.audibleLabel)}</span>`);
    }

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
      isAlert: true,
      overlayOpacity: this.settings.overlayOpacity,
      hideUnderneath: this.settings.hideUnderneath,
      attributes: this.settings.attributes,
      noRefocus: this.settings.noRefocus
    });

    // Adjust Width if Set as a Setting
    if (this.settings.width !== 'auto') {
      this.content.closest('.modal')[0].style.maxWidth = 'none';
      this.content.closest('.modal')[0].style.width = this.settings.width + (/(px|%)/i.test(`${this.settings.width}`) ? '' : 'px');
      this.content.find('#message-text')[0].style.maxWidth = 'none';
    }

    // Adjust Max Width if Set as a Setting
    if (this.settings.maxWidth) {
      console.log(this.settings.maxWidth);
      this.content.find('.message')[0].style.maxWidth = this.settings.maxWidth;
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

    if (this.settings.status === 'error') {
      this.title.addClass('has-status is-error').prepend($.createIconElement('error'));
    } else if (this.settings.status === 'alert') {
      this.title.addClass('has-status is-alert').prepend($.createIconElement('alert'));
    } else if (this.settings.status === 'success') {
      this.title.addClass('has-status is-success').prepend($.createIconElement('success'));
    } else {
      this.title.removeClass('has-status is-error is-alert is-success').find('svg').remove();
    }
  },

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
