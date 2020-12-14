import { Environment as env } from '../../utils/environment';
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// Component Name
const COMPONENT_NAME = 'trackdirty';

// Default Trackdirty Options
const TRACKDIRTY_DEFAULTS = {
};

/**
* Track changes on the inputs passed in the jQuery selector and show a dirty indicator
* @class Trackdirty
* @param {string} element The component element.
* @param {string} [settings] The component settings.
*/
function Trackdirty(element, settings) {
  this.settings = utils.mergeSettings(element, settings, TRACKDIRTY_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Trackdirty Methods
Trackdirty.prototype = {

  init() {
    this.isIe = env.browser.name === 'ie';
    this.isIeEdge = env.browser.name === 'edge';

    this.handleEvents();
  },

  /**
   * Get the value or checked if checkbox or radio
   * @private
   * @param {object} element .
   * @param {boolean} isOriginal .
   * @returns {string} element value
   */
  valMethod(element, isOriginal) {
    switch (element.attr('type')) {
      case 'checkbox':
      case 'radio':
        return element.prop('checked');
      case 'file': {
        if (typeof isOriginal === 'boolean' && isOriginal) {
          const original = element.attr('original');
          return (original !== undefined) ? original : '';
        }

        const el = element.parent().find('[type="text"]');
        return el.val();
      }
      default: {
        if (element.is('textarea') && element.closest('.editor-source').length === 1) {
          const value = element.is(':visible') ? element.val() : element.text();
          return this.trimEditorText(value);
        }
        return element.val();
      }
    }
  },

  /**
   * Trim out the editor spaces for comparison.
   * @private
   * @param  {string} text The starting text.
   * @returns {string} The trimmed text.
   */
  trimEditorText(text) {
    return text.trim()
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .replace(' has-tooltip', '')
      .replace(/<br(\s+)?\/?>/g, '<br>\n')
      .replace(/<\/p>(\s+)/g, '</p>\n\n')
      .replace(/<\/blockquote>(\s+)?/g, '</blockquote>\n\n');
  },

  /**
   * Get absolute position for an element
   * @private
   * @param {object} element .
   * @returns {object} position for given element
   */
  getAbsolutePosition(element) {
    const pos = element.position();
    // eslint-disable-next-line
    element.parents().each(function () {
      const el = this;
      if (window.getComputedStyle(el, null).position === 'relative') {
        return false;
      }

      pos.left += el.scrollLeft;
      pos.top += el.scrollTop;
    });

    return { left: pos.left, top: pos.top };
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {object} The api
   */
  unbind() {
    this.element
      .removeClass('dirty')
      .off('resetdirty.dirty change.dirty doresetdirty.dirty');

    if (this.settings && typeof this.settings.d === 'object') {
      const d = this.settings.d;
      $('.icon-dirty, .msg-dirty', d.field).add(d.icon).add(d.msg).remove();
    }

    $.removeData(this.element[0], 'original');
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, TRACKDIRTY_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
   * Destroy this component instance and remove the link from its base element.
   * @returns {void}
   */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * Attach Events used by the Control
   * @private
   * @returns {void}
   */
  handleEvents() {
    const input = this.element;

    if (input.is('.editor')) {
      const textArea = input.parent().find('textarea');
      textArea.data('original', this.valMethod(textArea));
    }

    input.data('original', this.valMethod(input, true))
      .on('resetdirty.dirty', () => {
        if (input.is('.editor')) {
          const textArea = input.parent().find('textarea');
          textArea.data('original', this.valMethod(textArea));
        }

        input.data('original', this.valMethod(input))
          .triggerHandler('doresetdirty.dirty');
      })
      .on('change.dirty doresetdirty.dirty', (e) => {
        let el = input;
        const field = input.closest('.field, .radio-group');
        let label = $('label:visible', field);
        const d = { class: '', style: '' };

        if (field.is('.field-fileupload')) {
          el = field.find('input.fileupload-background-transparent');
        }

        if (field.is('.editor-container')) {
          el = field.find('.editor-source');
        }

        // Used element without .field wrapper
        if (!label[0]) {
          label = input.next('label');
        }
        if (input.attr('data-trackdirty') !== 'true') {
          return;
        }

        // Add class to element
        input.addClass('dirty');

        // Set css class
        if (input.is('[type="checkbox"], [type="radio"]')) {
          d.class += ` dirty-${input.attr('type')}`;
          d.class += input.is(':checked') ? ' is-checked' : '';
        }
        if (input.is('select')) {
          d.class += ' is-select';
          el = input.next('.dropdown-wrapper').find('.dropdown');
        }

        // Add class and icon
        d.icon = el.prev();
        if (!d.icon.is('.icon-dirty')) {
          if (input.is('.colorpicker') && !Locale.isRTL()) {
            d.rect = this.getAbsolutePosition(input);
            d.style = `left:${d.rect.left}px; top:${d.rect.top}px;`;
          }
          d.icon = `<span class="icon-dirty${d.class}"></span>`;
          d.msg = Locale.translate('MsgDirty') || '';
          d.msg = `<span class="audible msg-dirty">${d.msg}</span>`;

          // Add icon and msg
          const firstInput = $($(el[0].parentElement).find('input')[0]);
          el = input.is('[type="radio"]') ? firstInput : el;

          if ($(el[0].parentElement).find('.icon-dirty').length === 0) {
            el.before(d.icon);
            label.append(d.msg);

            if (d.style && el.prev('.icon-dirty')[0]) {
              el.prev('.icon-dirty')[0].style.cssText = d.style;
            }
          }

          // Cache icon and msg
          d.icon = el.prev();
          d.msg = label.find('.msg-dirty');
        }

        // Handle resetting value back
        let original = input.data('original');
        let current = this.valMethod(input);

        d.field = field;
        this.settings.d = d;
        if (field.is('.editor-container')) {
          // editors values are further down it's tree in a textarea,
          // so get the elements with the value
          const textArea = field.find('textarea');
          original = textArea.data('original');
          if (field.find('.editor-source').is(':visible')) {
            current = textArea.val();
          } else {
            current = this.isIe || this.isIeEdge ? input[0].innerHTML : textArea.text();
          }
          current = this.trimEditorText(current);
        }

        if (current === original || (input.attr('multiple') && utils.equals(current, original))) {
          input.removeClass('dirty');
          $('.icon-dirty, .msg-dirty', field).add(d.icon).add(d.msg).remove();
          input.trigger(e.type === 'doresetdirty' ? 'afterresetdirty' : 'pristine');
          return;
        }

        /**
        * Fires when an inout becomes dirty.
        * @event resetdirty
        * @memberof Trackdirty
        * @property {object} event - The jquery event object
        */
        input.trigger('dirty');
      });
  }
};

export { Trackdirty, COMPONENT_NAME };
