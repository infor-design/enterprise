import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { Locale } from '../locale/locale';

// Component Name
const COMPONENT_NAME = 'fileuploadadvanced';

/**
* A trigger field for uploading a single file.
* @class FileUploadAdvanced
* @constructor
*
* @param {jQuery[]|HTMLElement} element The component element.
* @param {object} [settings] The component settings.
* @param {boolean} [settings.isStandalone=true] On page(true)|on modal(false), used for some visual style only.
* @param {string} [settings.standaloneClass='standalone'] Css class if on page.
* @param {string} [settings.allowedTypes='*'] Restrict file types(ie. 'jpg|png|gif') ['*' all types]
* @param {number} [settings.maxFiles=99999] Max number of files can be uploaded
* @param {number} [settings.maxFilesInProcess=99999] Max number of files can be uploaded while in process
* @param {number} [settings.maxFileSize=-1] Max file size in bytes, -1 for unlimited
* @param {string} [settings.fileName='myfile'] Variable name to read from server
* @param {boolean} [settings.isDisabled=false] Make control disabled
* @param {boolean} [settings.showBrowseButton=true] Add way to browse files to upload
* @param {Function} [settings.send] Method for send file to upload
* @param {string} [settings.textDropArea] Text to show in drop area
* @param {string} [settings.textDropAreaWithBrowse] Text to show in drop area when browse option true
* @param {string} [settings.textBtnCancel] Hidden text for cancel button
* @param {string} [settings.textBtnCloseError] Hidden text for error close button
* @param {string} [settings.textBtnRemove] Hidden text for remove button
* @param {string} [settings.errorAllowedTypes] Error text for allowed types
* @param {string} [settings.errorMaxFileSize] Error text for max file size
* @param {string} [settings.errorMaxFiles] Error text for max files to upload
* @param {string} [settings.errorMaxFilesInProcess] Error text for max files in process
*/

const FILEUPLOADADVANCED_DEFAULTS = {
  isStandalone: true, //
  standaloneClass: 'standalone', // css class if on page
  allowedTypes: '*', // restrict file types(ie. 'jpg|png|gif') ['*' all types]
  maxFiles: 99999, // max files can be upload
  maxFilesInProcess: 99999, // max files can be upload while in process
  maxFileSize: -1, // max file size in bytes, -1 for unlimited
  fileName: 'myfile', // variable name to read from server
  isDisabled: false, // Disabled
  showBrowseButton: true, // Browse files to upload
  send: null, // Function to send files to server

  // Text strings
  textDropArea: null,
  textDropAreaWithBrowse: null,
  textBtnCancel: null,
  textBtnCloseError: null,
  textBtnRemove: null,

  // Error strings
  errorAllowedTypes: null,
  errorMaxFileSize: null,
  errorMaxFiles: null,
  errorMaxFilesInProcess: null
};

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
    return this;
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

    // Re-evaluate strings
    s.textDropArea = s.textDropArea || Locale.translate('TextDropArea');
    s.textDropAreaWithBrowse = s.textDropAreaWithBrowse || Locale.translate('TextDropAreaWithBrowse');
    s.textBtnCancel = s.textBtnCancel || Locale.translate('TextBtnCancel');
    s.textBtnCloseError = s.textBtnCloseError || Locale.translate('TextBtnCloseError');
    s.textBtnRemove = s.textBtnRemove || Locale.translate('TextBtnRemove');
    s.errorAllowedTypes = s.errorAllowedTypes || `<em>${Locale.translate('Error')}</em>: ${Locale.translate('ErrorAllowedTypes')}`;
    s.errorMaxFileSize = s.errorMaxFileSize || `<em>${Locale.translate('Error')}</em>: ${Locale.translate('ErrorMaxFileSize')}`;
    s.errorMaxFiles = s.errorMaxFiles || `<em>${Locale.translate('Error')}</em>: ${Locale.translate('ErrorMaxFiles')}`;
    s.errorMaxFiles = s.errorMaxFiles.replace('{n}', s.maxFiles);
    s.errorMaxFilesInProcess = s.errorMaxFilesInProcess || `<em>${Locale.translate('Error')}</em>: ${Locale.translate('ErrorMaxFilesInProcess')}`;

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
      const id = utils.uniqueId(this.element, 'fileupload-adv-');
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

    DOM.append(this.element, html, '<div><svg><use><label><span><input>');
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
        const files = e.originalEvent.dataTransfer.files;
        e.preventDefault();
        if (s.isDisabled) {
          return;
        }

        /**
        * Fires when file/s drag and droped to drop area.
        *
        * @event filesdroped
        * @memberof FileUploadAdvanced
        * @property {object} event - The jquery event object
        * @property {array} files - List of files droped
        */
        self.element.triggerHandler('filesdroped', [files]);

        $(this).removeClass('hover is-focus');
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

    // Clear previous errors in general area
    $('span.msg', this.element).closest('.error').remove();

    // Total files completed
    this.totalCompleted = this.totalCompleted || 0;

    // Max files can be upload
    const filesLen = this.totalCompleted + files.length + $('.progress', this.element).length;
    if (filesLen > s.maxFiles) {
      this.showError(s.errorMaxFiles);
      return;
    }
    if (filesLen > s.maxFilesInProcess) {
      this.showError(s.errorMaxFilesInProcess);
      return;
    }

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
      * @memberof FileUploadAdvanced
      * @property {object} event - The jquery event object
      * @property {object} file - file to set the status
      */
      this.element.triggerHandler('beforecreatestatus', [files[i]]);

      // use FormData API
      const fd = new FormData();
      fd.append(`${fileName}[]`, files[i]);

      const status = this.createStatus(files[i]);
      status.container.find('.status-icon .action').focus();

      /**
      * Fires after create the progress status object.
      *
      * @event aftercreatestatus
      * @memberof FileUploadAdvanced
      * @property {object} event - The jquery event object
      * @property {object} file - file to set the status
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
      * @memberof FileUploadAdvanced
      * @property {object} event - The jquery event object
      * @property {object} status - `{ file, progress }`
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
        * @memberof FileUploadAdvanced
        * @property {object} event - The jquery event object
        * @property {object} file - aborted
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

        /**
         * Fires when attached file removed.
         *
         * @event fileremoved
         * @memberof FileUploadAdvanced
         * @property {object} event - The jquery event object
         * @property {object} file uploaded
         */
        self.element.triggerHandler('fileremoved', [file]);
      });

      // Remove Cancel button and progress-bar area
      progressBar.destroy();
      btnCancel.off('click.fileuploadadvanced');
      btnCancel.add(progressBar.closest('.progress-row')).remove();

      // Increment to total files completed
      self.totalCompleted++;

      /**
      * Fires when file complete uploading.
      *
      * @event filecompleteuploading
      * @memberof FileUploadAdvanced
      * @property {object} event - The jquery event object
      * @property {object} file uploaded
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
   * @param {string} error to display
   * @param {object} file contains the error.
   * @returns {void}
   */
  showError(error, file) {
    let container;
    const s = this.settings;

    if (error === s.errorMaxFiles || error === s.errorMaxFilesInProcess) {
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
   * @param {string} fileName to check types
   * @returns {boolean} true if allowed to uploaded
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
   * @param {number} bytes to be formated
   * @returns {string} formated to use in ui
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
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
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
