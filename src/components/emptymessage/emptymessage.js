/* eslint-disable consistent-return */
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components
import '../modal/modal';

// The name of this component
const COMPONENT_NAME = 'emptymessage';

/**
* The Empty Message is a message with an icon that can be used when no data is present.
* @class EmptyMessage
* @param {object} element The component element.
* @param {object} [settings] The component settings.
* @param {string} [settings.title = null] The Main text to show.
* @param {string} [settings.info = null] Longer paragraph text to show
* @param {string} [settings.icon = null] The name of the icon to use. See {@link https://design.infor.com/code/ids-enterprise/latest/demo/icons/example-empty-widgets?font=source-sans} for options.
* @param {boolean} [settings.button = null] The botton text and click event to add.
* @param {string} [settings.color = 'graphite']  Defaults to 'graphite' but can also be azure. Later may be expanded to all personalization colors.
* @param {boolean} [settings.modalErrorMessage = false] If true, it will display the custom empty message in modal.
* @param {string} [settings.buttonStyle = 'secondary'] Control color button styles inside the modal [primary, secondary, tertiary].
* @param {strung} [settings.modalMessageClass = undefined] Add custom id in the modal container.
*/
const EMPTYMESSAGE_DEFAULTS = {
  title: null,
  info: null,
  icon: null,
  button: null,
  buttonStyle: 'secondary',
  modalErrorMessage: false,
  color: 'graphite', // or azure for now until personalization works
  modalMessageClass: undefined
};

function EmptyMessage(element, settings) {
  this.settings = utils.mergeSettings(element, settings, EMPTYMESSAGE_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Component Methods
EmptyMessage.prototype = {

  init() {
    this
      .setup()
      .build();
  },

  setup() {
    this.element.addClass('empty-message');
    return this;
  },

  build() {
    const opts = this.settings;

    if (opts.modalErrorMessage) {
      this.modalErrorMessage = $(`<div class="${opts.modalMessageClass} modal message empty-state-message"></div>`);
      this.modalErrorMessageContent = $('<div class="modal-content"></div>');
      this.modalErrorContentBody = $('<div class="modal-body"></div>').appendTo(this.modalErrorMessageContent);

      this.modalErrorMessage.append(this.modalErrorMessageContent).appendTo('body');

      this.modalErrorMessage.modal({
        trigger: 'immediate',
        close: this.settings.close,
        overlayOpacity: this.settings.overlayOpacity,
        overlayBackgroundColor: this.settings.overlayBackgroundColor
      });
    }

    if (opts.icon) {
      $(`<div class="empty-icon">
          <svg class="icon-empty-state is-${this.settings.color}" focusable="false" aria-hidden="true" role="presentation">
            <use href="#${opts.icon}"></use>
          </svg></div>`).appendTo(opts.modalErrorMessage ? this.modalErrorContentBody : this.element);
    }

    if (opts.title) {
      // Re-evaluate the text
      if (opts.title === '[NoData]') {
        opts.title = Locale ? Locale.translate('NoData') : 'No Data Available';
      }

      $(`<div class="empty-title">${opts.title}</div>`).appendTo(opts.modalErrorMessage ? this.modalErrorContentBody : this.element);
    }

    if (opts.info) {
      $(`<div class="empty-info">${opts.info}</div>`).appendTo(opts.modalErrorMessage ? this.modalErrorContentBody : this.element);
    }

    if (opts.button) {
      $(`${'<div class="empty-actions">' +
          '<button type="button" '}class="btn-${opts.buttonStyle} ${opts.button.cssClass} hide-focus" id="${opts.button.id}">` +
            `<span>${opts.button.text}</span>` +
          '</button>' +
        '</div>').appendTo(opts.modalErrorMessage ? this.modalErrorContentBody : this.element);

      if (opts.button.click) {
        this.element.on('click', 'button', opts.button.click);
      }
    }

    return this;
  },

  /**
   * Update the component and optionally apply new settings.
   *
   * @param  {object} settings the settings to update to.
   * @returns {void}
   */
  updated(settings) {
    this.settings = utils.mergeSettings(this.element, settings, this.settings);
    this.element.empty();
    this.build();
  },

  /**
   * Teardown - Remove added markup and events
   * @returns {void}
   */
  destroy() {
    $.removeData(this.element[0], COMPONENT_NAME);
    this.element.empty();
    this.element.removeClass('empty-message');
  }
};

export { EmptyMessage, COMPONENT_NAME };
