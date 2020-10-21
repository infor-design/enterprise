/* eslint-disable consistent-return */
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

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
* @param {boolean} [settings.button = null] The button settings to use (click, isPrimary, cssClass ect)
* @param {string} [settings.height = null]  The container height. If set to 'small' will show only title and all other will not be render (like: icon, button, info)
* @param {string} [settings.color = 'slate']  Defaults to 'slate' but can also be azure. Later may be expanded to all personalization colors.
* @param {string} [settings.attributes = null] Add extra attributes like id's to the element. e.g. `attributes: { name: 'id', value: 'my-unique-id' }`
*/
const EMPTYMESSAGE_DEFAULTS = {
  title: null,
  info: null,
  icon: null,
  button: null,
  height: null, // null|'small'
  color: 'slate', // or azure for now until personalization works
  attributes: null
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
    const isHeightSmall = opts.height === 'small';

    if (opts?.button?.isPrimary) {
      this.settings.color = 'azure';
    }

    if (opts.icon && !isHeightSmall) {
      $(`<div class="empty-icon">
          <svg class="icon-empty-state is-${this.settings.color}" focusable="false" aria-hidden="true" role="presentation">
            <use href="#${opts.icon}"></use>
          </svg></div>`).appendTo(this.element);
    }

    if (opts.title) {
      // Re-evaluate the text
      if (opts.title === '[NoData]') {
        opts.title = Locale ? Locale.translate('NoData') : 'No Data Available';
      }

      $(`<div class="empty-title">${opts.title}</div>`).appendTo(this.element);
    }

    if (opts.info && !isHeightSmall) {
      $(`<div class="empty-info">${opts.info}</div>`).appendTo(this.element);
    }

    if (opts.button && !isHeightSmall) {
      const buttonMarkup = `<div class="empty-actions">
          <button type="button" class="${opts.button.isPrimary ? 'btn-primary' : 'btn-secondary'} ${opts.button.cssClass} hide-focus" id="${opts.button.id}">
            <span>${opts.button.text}</span>
          </button>
        </div>`;
      $(buttonMarkup).appendTo(this.element);

      if (opts.button.click) {
        this.element.on('click', 'button', opts.button.click);
      }
    }

    utils.addAttributes(this.element, this, opts.attributes);
    utils.addAttributes(this.element.find('.empty-actions button'), this, opts.attributes, 'btn');

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
