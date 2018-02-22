import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// Component Name
const COMPONENT_NAME = 'fileuploadadvanced';

/**
 * Default FileUploadAdvanced Options
 * @namespace
 * @property {boolean} isStandalone On page(true)|on modal(false), used for some visual style only.
 * @property {boolean} allowedTypes Restrict file types(ie. 'jpg|png|gif') ['*' all types]
 * @property {boolean} maxFilesInProcess Max number of files can be uploaded
 * @property {boolean} maxFileSize Max file size in bytes, -1 for unlimited
 * @property {boolean} fileName Variable name to read from server
 * @property {boolean} isDisabled Make control disabled
 * @property {boolean} showBrowseButton Add way to browse files to upload
 * @property {Function} send Method for send file to upload
 * @property {string} textDropArea Text to show in drop area
 * @property {string} textDropAreaWithBrowse Text to show in drop area when browse option true
 * @property {string} textBtnCancel Hidden text for cancel button
 * @property {string} textBtnCloseError Hidden text for error close button
 * @property {string} textBtnRemove Hidden text for remove button
 */
const FILEUPLOADADVANCED_DEFAULTS = {
  isStandalone: true, //
  standaloneClass: 'standalone', // css class if on page
  allowedTypes: '*', // restrict file types(ie. 'jpg|png|gif') ['*' all types]
  maxFilesInProcess: 99999, // max files can be upload
  maxFileSize: -1, // max file size in bytes, -1 for unlimited
  fileName: 'myfile', // variable name to read from server
  isDisabled: false, // Disabled
  showBrowseButton: true, // Browse files to upload
  send: null, // Function to send files to server

  // Text strings
  textDropArea: Locale.translate('TextDropArea'),
  textDropAreaWithBrowse: Locale.translate('TextDropAreaWithBrowse'),
  textBtnCancel: Locale.translate('TextBtnCancel'),
  textBtnCloseError: Locale.translate('TextBtnCloseError'),
  textBtnRemove: Locale.translate('TextBtnRemove'),

  // Error strings
  errorAllowedTypes: `<em>${Locale.translate('Error')}</em>: ${Locale.translate('ErrorAllowedTypes')}`,
  errorMaxFileSize: `<em>${Locale.translate('Error')}</em>: ${Locale.translate('ErrorMaxFileSize')}`,
  errorMaxFilesInProcess: `<em>${Locale.translate('Error')}</em>: ${Locale.translate('ErrorMaxFilesInProcess')}`
};

/**
* A trigger field for uploading a single file.
* @class FileUploadAdvanced
* @constructor
* @param {String} element The component element.
* @param {String} settings The component settings.
*/
function FileUploadAdvanced(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, FILEUPLOADADVANCED_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// FileUploadAdvanced Methods
FileUploadAdvanced.prototype = {

  init() {
    this.build();
    this.handleEvents();
  },

  /**
   * Add markup
   * @private
   * @returns {void}
   */
  build() {
    const s = this.settings;
    let html;
    let cssClassList = s.isStandalone ? s.standaloneClass : '';

    // Disabled
    if (this.element.is('.is-disabled')) {
      s.isDisabled = true;
    }
    if (s.isDisabled) {
      cssClassList += ' is-disabled';
    }

    // Browse files option
    if (s.showBrowseButton) {
      let types = '';
      const id = $.fn.uniqueId('fileupload-adv-');
      const fileExtensions = s.allowedTypes.split(/[\s|]+/g);
      let isExtra = s.maxFilesInProcess > 1 ? ' multiple' : '';
      isExtra += s.isDisabled ? ' disabled' : '';

      if (fileExtensions.length === 1) {
        if (fileExtensions[0] !== '*') {
          types = `.${fileExtensions[0]}`;
        }
      } else {
        for (let i = 0, l = fileExtensions.length; i < l; i++) {
          types += `.${(fileExtensions[i] + (i !== (l - 1) ? ',' : ''))}`;
        }
      }

      html = '' +
        `<div class="fileupload-wrapper ${cssClassList}">
          <div class="container drop-area">
            ${$.createIcon('upload')}
            <label class="fileupload-adv-browse-lbl">
              <span>${s.textDropAreaWithBrowse}</span>
              <input type="file" name="${id}" accept="${types}"${isExtra} />
            </label>
          </div>
        </div>`;
    } else {
      // Without browse files option

      html = '' +
        `<div class="fileupload-wrapper ${cssClassList}">
          <div class="container drop-area">
            ${$.createIcon('upload')}
            <p>${s.textDropArea}</p>
          </div>
        </div>`;
    }
    this.element.append(html);
    this.dropArea = $('.drop-area', this.element);
  },

  /**
   * Attach Events used by the Control
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    const s = this.settings;

    this.dropArea
      // Drag enter
      .on('dragenter.fileuploadadvanced', function (e) {
        self.element.triggerHandler('filesdragenter');
        e.stopPropagation();
        e.preventDefault();

        if (s.isDisabled) {
          return;
        }
        $(this).addClass('hover');
      })

      // Drag over
      .on('dragover.fileuploadadvanced', (e) => {
        e.stopPropagation();
        e.preventDefault();
      })

      // Drop
      .on('drop.fileuploadadvanced', function (e) {
        const files = [...e.originalEvent.dataTransfer.files];
        e.preventDefault();
        if (s.isDisabled) {
          return;
        }

        /**
        * Fires when file/s drag and droped to drop area.
        *
        * @event filesdroped
        * @type {Object}
        * @property {Object} event - The jquery event object
        * @property {Array} files - List of files droped
        */
        self.element.triggerHandler('filesdroped', [files]);

        $(this).removeClass('hover is-focus');

        // Clear previous errors in general area
        $('span.msg', this.element).closest('.error').remove();

        // Max files can be upload
        if ((files.length + $('.progress', this.element).length) > s.maxFilesInProcess) {
          self.showError(s.errorMaxFilesInProcess);
          return;
        }

        self.handleFileUpload(files);
      });

    if (s.showBrowseButton && !s.isDisabled) {
      const label = this.dropArea.find('.fileupload-adv-browse-lbl');
      const input = label.find('input[type="file"]');

      // Only let open dialog if clicked on link or input
      label.click((e) => {
        if (!$(e.target).is('.hyperlink, input[type="file"]')) {
          e.preventDefault();
        }
      });

      input.hideFocus();
      input
        .on('hidefocusremove.fileuploadadvanced', (e) => {
          e.stopPropagation();
          this.dropArea.addClass('is-focus');
        })
        .on('hidefocusadd.fileuploadadvanced', (e) => {
          e.stopPropagation();
          this.dropArea.removeClass('is-focus');
        })
        .on('change.fileuploadadvanced', function (e) {
          e.stopPropagation();
          self.handleFileUpload(this.files);
        });
    }

    // If the files are dropped outside the div, files will open in the browser window.
    // To avoid this prevent 'drop' event on document.
    $(document).on('dragenter.fileuploadadvanced dragover.fileuploadadvanced drop.fileuploadadvanced', (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (e.type === 'dragover') {
        self.dropArea.removeClass('hover');
      }
    });
  },

  /**
  * Read the file contents using HTML5 FormData()
  * @param {object} files File object containing uploaded files.
  * @returns {void}
  */
  handleFileUpload(files) {
    const s = this.settings;
    const fileName = s.fileName.replace('[]', '');

    /* eslint-disable no-continue */
    for (let i = 0, l = files.length; i < l; i++) {
      // Check if file type allowed
      if (!this.isFileTypeAllowed(files[i].name)) {
        this.showError(s.errorAllowedTypes, files[i]);
        continue;
      }

      // Check for max file size
      if (s.maxFileSize !== -1 && files[i].size > s.maxFileSize) {
        this.showError(s.errorMaxFileSize, files[i]);
        continue;
      }

      /**
      * Fires before create the progress status object.
      *
      * @event beforecreatestatus
      * @type {Object}
      * @property {Object} event - The jquery event object
      * @property {Object} file - file to set the status
      */
      this.element.triggerHandler('beforecreatestatus', [files[i]]);
      /* global FormData */
      const fd = new FormData();
      fd.append(`${fileName}[]`, files[i]);

      const status = this.createStatus(files[i]);
      status.container.find('.status-icon .action').focus();

      /**
      * Fires after create the progress status object.
      *
      * @event aftercreatestatus
      * @type {Object}
      * @property {Object} event - The jquery event object
      * @property {Object} file - file to set the status
      */
      this.element.triggerHandler('aftercreatestatus', [files[i]]);

      if (typeof s.send === 'function') {
        s.send(fd, status);
      } else {
        this.sendFileToServer(fd, status);
      }
    }
    /* eslint-enable no-continue */

    if (s.showBrowseButton) {
      // Clear browse file input
      this.dropArea.find('.fileupload-adv-browse-lbl input[type="file"]').val('');
    }
  },

  /**
  * Create status object
  * @param {object} file to create progress status.
  * @returns {object} contains file and status methods to access.
  */
  createStatus(file) {
    const self = this;
    const s = this.settings;
    const container = $('' +
      `<div class="container">
        <div class="file-row">
          <span class="status-icon">
            <button type="button" class="btn-icon action">
              ${$.createIcon({ icon: 'close', classes: ['icon-close'] })}
              <span>${s.textBtnCancel}</span>
            </button>
          </span>
          <span class="description">${file.name}</span>
          <div class="l-pull-right">
            <span class="size">${this.formatFileSize(file.size)}</span>
          </div>
        </div>
        <div class="progress-row">
          <span class="progress">
            <span class="progress-bar" data-value="0"></span>
          </span>
        </div>
      </div>`);

    const btnCancel = $('.action', container).button();
    const rightSide = $('.l-pull-right', container);
    const progressBar = $('.progress-bar', container).progress({ animationLength: 10 });

    // Add this container
    this.dropArea.after(container);

    // Update progress-bar
    const setProgress = (progress) => {
      /**
      * Fires when file progress status changes.
      *
      * @event fileprogress
      * @type {Object}
      * @property {Object} event - The jquery event object
      * @property {Object} status - `{ file, progress }`
      */
      this.element.triggerHandler('fileprogress', [{ file, progress }]);
      progressBar.attr('data-value', progress).triggerHandler('updated');
    };

    // Set abort action
    const setAbort = (jqxhr) => {
      btnCancel.on('click.fileuploadadvanced', () => {
        /**
        * Fires when file aborted.
        *
        * @event fileaborted
        * @type {Object}
        * @property {Object} event - The jquery event object
        * @property {Object} file - aborted
        */
        this.element.triggerHandler('fileaborted', [file]);
        jqxhr.abort();
        btnCancel.off('click.fileuploadadvanced');
        container.remove();
      });
    };

    // Set completed state
    const setCompleted = function (data) {
      container.addClass('completed');

      // Add "Completed" icon
      btnCancel.after($.createIcon('check'));

      // Add "Remove from server" button
      rightSide.append('' +
        `<button type="button" class="btn-icon action">
          ${$.createIcon({ classes: ['icon-close'], icon: 'close' })}
          <span>${s.textBtnRemove}</span>
        </button>`);

      // Set "Remove from server" button action
      $('.action', rightSide).button().on('click.fileuploadadvanced', function () {
        $(this).off('click.fileuploadadvanced');
        container.remove();

        // TODO: server call for removing data
        data.remove();
      });

      // Remove Cancel button and progress-bar area
      btnCancel.off('click.fileuploadadvanced');
      btnCancel.add(progressBar.closest('.progress-row')).remove();
      /**
      * Fires when file complete uploading.
      *
      * @event filecompleteuploading
      * @type {Object}
      * @property {Object} event - The jquery event object
      * @property {Object} file uploaded
      */
      self.element.triggerHandler('filecompleteuploading', [file]);
    };

    return { file, container, setProgress, setAbort, setCompleted };
  },

  /**
  * Function you can implement to send data to the server.
  * @param {object} formData - Contains the form data / file data.
  * @param {object} status - Status of the upload operation
  * @returns {void}
  */
  sendFileToServer(formData, status) {
    const jqXHR = { abort: () => {} };
    const tempData = { remove: () => {} };
    let percent = 0;
    const total = parseFloat(status.file.size);
    /* eslint-disable new-cap */
    const timer = new $.fn.timer(() => {
      status.setCompleted(tempData);
    }, total);
    /* eslint-enable new-cap */

    $(timer.event)
      .on('update', (e, data) => {
        percent = Math.ceil((data.counter / total) * 100);
        status.setProgress(percent);
      });

    status.setAbort(jqXHR);
  },

  /**
   * Show error on ui
   * @private
   * @param {String} error to display
   * @param {Object} file contains the error.
   * @returns {void}
   */
  showError(error, file) {
    let container;
    const s = this.settings;

    if (error === s.errorMaxFilesInProcess) {
      // This error show without file name or size in general area
      container = $('' +
        `<div class="container error">
          <div class="file-row">
            <span class="status-icon">
              <button type="button" class="btn-icon action">
                ${$.createIcon({ classes: ['icon-close'], icon: 'close' })}
                <span>${s.textBtnCloseError}</span>
              </button>
            </span>
            <span class="msg">${error}</span>
          </div>
        </div>`);
    } else {
      container = $('' +
        `<div class="container error">
          <div class="file-row">
            <span class="status-icon">
              <button type="button" class="btn-icon action">
                ${$.createIcon({ classes: ['icon-close'], icon: 'close' })}
                <span>${s.textBtnCloseError}</span>
              </button>
            </span>
            <span class="description">${file.name}</span>
            <div class="l-pull-right">
              <span class="size">${this.formatFileSize(file.size)}</span>
            </div>
          </div>
          <div class="msg">
            <p>${error}</p>
          </div>
        </div>`);
    }

    $('.action', container).button().on('click.fileuploadadvanced', () => {
      container.remove();
    });

    // Add this container
    this.dropArea.after(container);
  },

  /**
   * Check if file type allowed
   * @private
   * @param {String} fileName to check types
   * @returns {Boolean} true if allowed to uploaded
   */
  isFileTypeAllowed(fileName) {
    const fileExtensions = this.settings.allowedTypes.toLowerCase().split(/[\s|]+/g);
    const ext = fileName.split('.').pop().toLowerCase();
    if (this.settings.allowedTypes !== '*' && $.inArray(ext, fileExtensions) < 0) {
      return false;
    }
    return true;
  },

  /**
   * Helper function that formats the file sizes
   * @private
   * @param {Number} bytes to be formated
   * @returns {String} formated to use in ui
   */
  formatFileSize(bytes) {
    const scale = {
      GB: 1000000000,
      MB: 1000000,
      KB: 1000
    };
    if (typeof bytes !== 'number') {
      return '';
    }
    if (bytes >= scale.GB) {
      return `${(bytes / scale.GB).toFixed(2)} GB`;
    }
    if (bytes >= scale.MB) {
      return `${(bytes / scale.MB).toFixed(2)} MB`;
    }
    return `${(bytes / scale.KB).toFixed(2)} KB`;
  },

  /**
  * Set component to enabled.
  * @returns {void}
  */
  enable() {
    this.settings.isDisabled = false;
    this.unbind();
    this.element
      .find('.fileupload-wrapper').removeClass('is-disabled')
      .find('.fileupload-adv-browse-lbl input[type="file"]').removeAttr('disabled');
    this.handleEvents();
  },

  /**
  * Set component to disabled.
  * @returns {void}
  */
  disable() {
    this.settings.isDisabled = true;
    this.unbind();
    this.element
      .find('.fileupload-wrapper').addClass('is-disabled')
      .find('.fileupload-adv-browse-lbl input[type="file"]').attr('disabled', 'disabled');
    this.handleEvents();
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {void}
   */
  unbind() {
    this.dropArea.find('.fileupload-adv-browse-lbl input[type="file"]').off('hidefocusremove.fileuploadadvanced hidefocusadd.fileuploadadvanced change.fileuploadadvanced');

    this.dropArea.off('dragenter.fileuploadadvanced dragover.fileuploadadvanced drop.fileuploadadvanced');
    $(document).off('dragenter.fileuploadadvanced dragover.fileuploadadvanced drop.fileuploadadvanced');
    $('.action', this.element).off('click.fileuploadadvanced');
  },

  /**
   * Resync the UI and Settings.
   * @param {Object} settings The settings to apply.
   * @returns {Object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, FILEUPLOADADVANCED_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
  * Destroy and remove added markup, all events
  * @returns {void}
  */
  destroy() {
    this.unbind();
    $('.fileupload-wrapper', this.element).remove();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { FileUploadAdvanced, COMPONENT_NAME };

/*
ERROR
--------
https://social.technet.microsoft.com/Forums/ie/en-US/ec3c0be0-0834-4873-8e94-700e9df9c822/edge-browser-drag-and-drop-files-not-working?forum=ieitprocurrentver

*/
