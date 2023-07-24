import { Environment as env } from '../../utils/environment';
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// Component Name
const COMPONENT_NAME = 'fileupload';

/**
* A list of items with add/remove/delete and sort functionality.
* @class FileUpload
* @constructor
*
* @param {jQuery[]|HTMLElement} element The component element.
* @param {object} [settings] The component settings.
*/

const FILEUPLOAD_DEFAULTS = {
};

function FileUpload(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, FILEUPLOAD_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// FileUpload Methods
FileUpload.prototype = {

  init() {
    this.build();
  },

  // Example Method
  build() {
    const self = this;
    const elem = this.element;
    const hasInlineLabel = !elem.is('input.fileupload');

    this.fileInput = hasInlineLabel ? elem.find('input') : elem;

    elem.closest('.field, .field-short').addClass('field-fileupload');

    // append markup
    let id = elem.find('input').attr('name');
    if (!hasInlineLabel) {
      id = elem.attr('id') || elem.attr('name');
    }

    let elemClass = !hasInlineLabel ? elem.attr('class') : elem.find('input').attr('class');
    elemClass = elemClass ? ` ${elemClass}` : '';

    const instructions = Locale.translate('FileUpload');
    this.shadowLabel = $(`<label for="${id}-filename">${elem.text()} <span class="audible">${instructions}</span></label>`);
    this.shadowField = $(`<input readonly id="${id}-filename" class="fileupload-background-transparent${elemClass}" type="text">`);
    const svg = `<span class="trigger">${$.createIcon('folder')}</span>`;
    const svgClose = `<span class="trigger-close" tabindex="-1">${$.createIcon('close')}</span>`;

    if (!hasInlineLabel) {
      let orgLabel = elem.prev('label');

      // Could be wrapped (angular)
      if (orgLabel.length === 0) {
        orgLabel = elem.parent().prev('label');
      }

      if (orgLabel.hasClass('required')) {
        this.shadowLabel.addClass('required');
      }

      this.shadowLabel.html(`${orgLabel.text()} <span class="audible">${instructions}</span>`);
      orgLabel.addClass('audible').add(this.fileInput).attr('tabindex', '-1').attr('aria-hidden', 'true');
    }

    if (elem.parent().find('input[type="text"]').length === 0) {
      elem.before(this.shadowLabel, this.shadowField);
      this.fileInput.after(svg, svgClose);
    }

    // if there is a value attribute, then this will be used as the current value since unable to set files[0].name
    // move it to the text input and remove it off the file input
    const fileInputValue = this.fileInput.attr('value');
    if (fileInputValue && fileInputValue.length > 0) {
      this.shadowField.val(fileInputValue);
      this.fileInput.attr('value', '');
    }

    this.textInput = this.shadowField;
    this.svg = elem.parent().find('.trigger');
    this.svgClose = elem.parent().find('.trigger-close');

    /*
    * Added Keydown for Keyboard Backspace and remove Keypress because it doesn't detect Backspace
    */
    this.textInput.on('keydown.fileupload', (e) => {
      let handle = false;
      if (e.which === 13 || e.which === 32) {
        elem.parent().find('[type="file"]').trigger('click');
        handle = true;
      } else if (e.which === 8) {
        if (env.browser.isIE11()) e.preventDefault();
        this.clearUploadFile();
        handle = true;
      }
      if (handle) {
        e.stopPropagation();
      }
    });

    this.svg.on('click.fileupload', (e) => {
      this.fileInput.trigger('click');
      if (hasInlineLabel) {
        this.fileInput.data(`handleEvent${[(e.type || '')]}`, e.handleObj);
      }
    });

    this.svgClose.on('click.fileupload', (e) => {
      this.clearUploadFile();
      this.svgClose.removeClass('is-visible');
      if (hasInlineLabel) {
        this.fileInput.data(`handleEvent +${[(e.type || '')]}`, e.handleObj);
      }
    });

    if (this.fileInput.is(':disabled')) {
      this.textInput.prop('disabled', true);
    }

    if (elem.hasClass('required')) {
      this.shadowLabel.addClass('required');
      elem.removeClass('required');
    }

    if (this.fileInput.attr('data-validate')) {
      this.textInput.attr('data-validate', this.fileInput.attr('data-validate'));
      this.textInput.validate();
      this.shadowLabel.addClass(this.fileInput.attr('data-validate'));
    }

    if (this.fileInput.attr('readonly')) {
      this.textInput.prop('disabled', false);
      this.textInput[0].classList.remove('fileupload-background-transparent');
      this.fileInput.attr('disabled', 'disabled');
    }

    /*
    * New Event for File Upload Change
    */
    this.fileInput.on('change.fileupload', function () {
      if (this.files.length > 0) {
        self.textInput.val(this.files[0].name).trigger('change');
        self.svgClose.addClass('is-visible');
      } else if (!self.clearing) {
        self.clearUploadFile();
      }
    });

    // Fix - Not to bubble events when clicked on trigger/close icons
    this.fileInput.on('click.fileupload', (e) => {
      const handleEventData = this.fileInput.data(`handleEvent${[(e.type || '')]}`);
      if (handleEventData &&
          handleEventData.type === e.type &&
          e.handleObj.namespace === 'fileupload') {
        this.fileInput.data(`handleEvent${[(e.type || '')]}`, null);
        e.preventDefault();
      }
    });

    // Support Drag and Drop
    this.textInput.on('dragenter.fileupload', () => {
      this.fileInput.css('z-index', '1');
    });

    this.textInput.on('dragleave.fileupload, dragend.fileupload, drop.fileupload', () => {
      setTimeout(() => {
        this.fileInput.css('z-index', '-1');
      }, 1);
    });

    // Add test automation ids
    utils.addAttributes(elem, this, this.settings.attributes);
    utils.addAttributes(this.svg, this, this.settings.attributes, 'btn-trigger');
    utils.addAttributes(this.svgClose, this, this.settings.attributes, 'btn-trigger-close');
  },

  /*
  * Clear the Input Upload File
  */
  clearUploadFile() {
    this.clearing = true;
    this.fileInput.add(this.textInput).val('');
    this.svgClose.removeClass('is-visible');
    this.fileInput.triggerHandler('change');
    this.clearing = false;
  },

  // Unbind all events
  unbind() {
    this.svg.add(this.svgClose).off('click.fileupload');
    this.fileInput.off('change.fileupload');
    this.fileInput.prev('label');
    this.textInput.off();

    this.element.closest('.field-fileupload')
      .removeClass('field-fileupload')
      .find('>label:first, >[type="text"]:first, .trigger, .trigger-close, .icon-dirty, .msg-dirty').remove();

    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, FILEUPLOAD_DEFAULTS);
    }
    // Nothing to do here as there are no settings.
    return this;
  },

  /**
  * Teardown process for this plugin
  * @returns {void}
  */
  destroy() {
    this.unbind();
    this.shadowField.remove();
    this.shadowLabel.remove();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
  * Disable the input and button.
  * @returns {void}
  */
  disable() {
    this.textInput.prop('disabled', true);
    this.fileInput.prop('disabled', true);
  },

  /**
  * Enable the input and button.
  * @returns {void}
  */
  enable() {
    this.textInput.prop('disabled', false).prop('readonly', false);
    this.fileInput.removeAttr('disabled');
  },

  /**
  * Make the input readonly and disable the button.
  * @returns {void}
  */
  readonly() {
    this.textInput.prop('readonly', true);
    this.fileInput.prop('disabled', true);

    this.textInput.prop('disabled', false);
    this.textInput.removeClass('fileupload-background-transparent');
  }

};

export { FileUpload, COMPONENT_NAME };
