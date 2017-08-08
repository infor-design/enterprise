/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  $.fn.fileuploadadvanced = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'fileuploadadvanced',
        defaults = {
          isStandalone: true, //
          standaloneClass: 'standalone', // css class if on page
          allowedTypes: '*', // restrict file types(ie. 'jpg|png|gif') ['*' all types]
          maxFilesInProcess: 99999, // max files can be upload
          maxFileSize: -1, // max file size in bytes, -1 for unlimited
          fileName: 'myfile', // variable name to read from server
          isDisabled: false, // Disabled
          isBrowse: false, // Browse files to upload
          send: null, // Function to send files to server

          // Text strings
          textDropArea: 'Drag and drop files to upload',
          textDropAreaWithBrowse: 'Drag and drop or <span class="hyperlink">select files</span> to upload',
          textBtnCancel: 'Cancel uploading this file',
          textBtnCloseError: 'Close this error',
          textBtnRemove: 'Remove from server this file',

          // Error strings
          errorAllowedTypes: '<em>'+ Locale.translate('Error') +'</em>: '+ Locale.translate('ErrorAllowedTypes'),
          errorMaxFileSize: '<em>'+ Locale.translate('Error') +'</em>: '+ Locale.translate('ErrorMaxFileSize'),
          errorMaxFilesInProcess: '<em>'+ Locale.translate('Error') +'</em>: '+ Locale.translate('ErrorMaxFilesInProcess')
        },
        settings = $.extend({}, defaults, options);

    /**
    * A trigger field for uploading a single file.
    *
    * @class FileUploadAdvanced
    * @param {Boolean} isStandalone  &nbsp;-&nbsp; On page(true) -or- on modal (false) , this is used for some visual style only.
    * @param {Boolean} allowedTypes  &nbsp;-&nbsp; Restrict file types(ie. 'jpg|png|gif') ['*' all types]
    * @param {Boolean} maxFilesInProcess  &nbsp;-&nbsp; Max number of files can be uploaded
    * @param {Boolean} maxFileSize  &nbsp;-&nbsp; Max file size in bytes, -1 for unlimited
    * @param {Boolean} fileName  &nbsp;-&nbsp; Variable name to read from server
    *
    */
    function FileUploadAdvanced(element) {
      this.element = $(element);
      this.settings = settings;
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // FileUploadAdvanced Methods
    FileUploadAdvanced.prototype = {

      init: function() {
        this.build();
        this.handleEvents();
      },

      //Add any markup
      build: function() {
        var s = this.settings,
          cssClassList = s.isStandalone ? s.standaloneClass : '',
          fileExtensions, types, isExtra, id, html;

        // Disabled
        if (this.element.is('.is-disabled')) {
          s.isDisabled = true;
        }
        if (s.isDisabled) {
          cssClassList += ' is-disabled';
        }

        // Browse files option
        if (s.isBrowse) {
          types = '';
          id = $.fn.uniqueId('fileupload-adv-');
          fileExtensions = s.allowedTypes.split(/[\s|]+/g);
          isExtra = s.maxFilesInProcess > 1 ? ' multiple' : '';
          isExtra += s.isDisabled ? ' disabled' : '';

          if (fileExtensions.length === 1) {
            if (fileExtensions[0] !== '*') {
              types = '.'+ fileExtensions[0];
            }
          } else {
            for (var i = 0, l = fileExtensions.length; i < l; i++) {
              types += '.'+ fileExtensions[i] + (i !== (l-1) ? ',' : '');
            }
          }

          html = '' +
            '<div class="fileupload-wrapper '+ cssClassList +'">' +
              '<div class="container drop-area">' +
                $.createIcon('upload') +
                '<label class="fileupload-adv-browse-lbl">' +
                  '<span>'+ s.textDropAreaWithBrowse +'</span>' +
                  '<input type="file" name="'+ id +'" accept="'+ types +'"'+ isExtra +' />' +
                '</label>' +
              '</div>' +
            '</div>';
        }

        // Without browse files option
        else {
          html = '' +
            '<div class="fileupload-wrapper '+ cssClassList +'">' +
              '<div class="container drop-area">' +
                $.createIcon('upload') +
                '<p>'+ s.textDropArea +'</p>' +
              '</div>' +
            '</div>';
        }
        this.element.append(html);
        this.dropArea = $('.drop-area', this.element);
      },

      //Attach Events used by the Control
      handleEvents: function () {
        var self = this,
          s = this.settings;


        self.dropArea

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
        .on('dragover.fileuploadadvanced', function (e) {
          e.stopPropagation();
          e.preventDefault();
        })

        // Drop
        .on('drop.fileuploadadvanced', function (e) {
          var files = e.originalEvent.dataTransfer.files;
          e.preventDefault();
          if (s.isDisabled) {
            return;
          }

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

        if (s.isBrowse && !s.isDisabled) {
          var input = self.dropArea.find('.fileupload-adv-browse-lbl input[type="file"]');

          input.hideFocus();
          input.on('hidefocusremove.fileuploadadvanced', function (e) {
              e.stopPropagation();
              self.dropArea.addClass('is-focus');
            })
            .on('hidefocusadd.fileuploadadvanced', function (e) {
              e.stopPropagation();
              self.dropArea.removeClass('is-focus');
            })
            .on('change.fileuploadadvanced', function (e) {
              e.stopPropagation();
              self.handleFileUpload(this.files);
            });
        }

        // If the files are dropped outside the div, files will open in the browser window.
        // To avoid this prevent 'drop' event on document.
        $(document).on('dragenter.fileuploadadvanced dragover.fileuploadadvanced drop.fileuploadadvanced', function (e) {
          e.stopPropagation();
          e.preventDefault();

          if (e.type === 'dragover') {
            self.dropArea.removeClass('hover');
          }
        });

      },

      /**
      * Read the file contents using HTML5 FormData()
      * @param {Object} files &nbsp;-&nbsp; File object containing uploaded files.
      */
      handleFileUpload: function (files) {
        var s = this.settings,
          fileName = s.fileName.replace('[]', '');

        for (var i = 0, l = files.length; i < l; i++) {

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

          this.element.triggerHandler('beforecreatestatus', [files[i]]);
          var fd = new FormData();
          fd.append(fileName + '[]', files[i]);

          var status = this.createStatus(files[i]);
          status.container.find('.status-icon .action').focus();
          this.element.triggerHandler('aftercreatestatus', [files[i]]);

          if (typeof s.send === 'function') {
            s.send(fd, status);
          } else {
            this.sendFileToServer(fd, status);
          }
        }

        if (s.isBrowse) {
          // Clear browse file input
          this.dropArea.find('.fileupload-adv-browse-lbl input[type="file"]').val('');
        }
      },

      // Create status
      createStatus: function (file) {
        var self = this,
          s = this.settings,
          container = $(
            '<div class="container">' +
              '<div class="file-row">' +
                '<span class="status-icon">' +
                  '<button type="button" class="btn-icon action">' +
                    $.createIcon({ icon: 'close', classes: ['icon-close'] }) +
                    '<span>'+ s.textBtnCancel +'</span>' +
                  '</button>' +
                '</span>' +
                '<span class="description">'+ file.name +'</span>' +
                '<div class="l-pull-right">' +
                  '<span class="size">'+ self.formatFileSize(file.size) +'</span>' +
                '</div>' +
              '</div>' +
              '<div class="progress-row">' +
                '<span class="progress">' +
                  '<span class="progress-bar" data-value="0"></span>' +
                '</span>' +
              '</div>' +
            '</div>'),

          btnCancel = $('.action', container).button(),
          rightSide = $('.l-pull-right', container),
          progressBar = $('.progress-bar', container).progress({ animationLength: 10 });

        // Add this container
        self.dropArea.after(container);

        // Update progress-bar
        var setProgress = function(progress) {
            self.element.triggerHandler('fileprogress', [{file: file, 'progress': progress}]);
            progressBar.attr('data-value', progress).triggerHandler('updated');
          },

          // Set abort action
          setAbort = function(jqxhr) {
            btnCancel.on('click.fileuploadadvanced', function() {
              self.element.triggerHandler('fileaborted', [file]);
              jqxhr.abort();
              btnCancel.off('click.fileuploadadvanced');
              container.remove();
            });
          },

          // Set completed state
          setCompleted = function(data) {
            container.addClass('completed');

            // Add "Completed" icon
            btnCancel.after($.createIcon('check'));

            // Add "Remove from server" button
            rightSide.append(
              '<button type="button" class="btn-icon action">' +
                $.createIcon({ classes: ['icon-close'], icon: 'close' }) +
                '<span>'+ s.textBtnRemove +'</span>' +
              '</button>');

            // Set "Remove from server" button action
            $('.action', rightSide).button().on('click.fileuploadadvanced', function() {
              $(this).off('click.fileuploadadvanced');
              container.remove();

              // TODO: server call for removing data
              data.remove();
            });

            // Remove Cancel button and progress-bar area
            btnCancel.off('click.fileuploadadvanced');
            btnCancel.add(progressBar.closest('.progress-row')).remove();
            self.element.triggerHandler('filecompleteuploading', [file]);
          };

        return {
          file: file,
          container: container,
          setProgress: setProgress,
          setAbort: setAbort,
          setCompleted: setCompleted
        };
      },

      /**
      * Function you can implement to send data to the server.
      * @param {Object} formData - Contains the form data / file data.
      * @param {Object} status - Status of the upload operation
      *
      */
      sendFileToServer: function (formData, status) {
        var jqXHR = { abort: function() {} },
          tempData = { remove: function() {} },
          percent = 0,
          total = parseFloat(status.file.size),
          timer = new $.fn.timer(function() {
            status.setCompleted(tempData);
          }, total);

        $(timer.event)
        .on('update', function(e, data) {
          percent = Math.ceil(data.counter / total * 100);
          status.setProgress(percent);
        });

        status.setAbort(jqXHR);
      },

      // Show Errors
      showError: function (error, file) {
        var container,
          s = this.settings;

        if (error === s.errorMaxFilesInProcess) {
          // This error show without file name or size in general area
          container = $(
            '<div class="container error">' +
              '<div class="file-row">' +
                '<span class="status-icon">' +
                  '<button type="button" class="btn-icon action">' +
                    $.createIcon({ classes: ['icon-close'], icon: 'close' }) +
                    '<span>'+ s.textBtnCloseError +'</span>' +
                  '</button>' +
                '</span>' +
                '<span class="msg">'+ error +'</span>' +
              '</div>' +
            '</div>');
        }
        else {
          container = $(
            '<div class="container error">' +
              '<div class="file-row">' +
                '<span class="status-icon">' +
                  '<button type="button" class="btn-icon action">' +
                    $.createIcon({ classes: ['icon-close'], icon: 'close' }) +
                    '<span>'+ s.textBtnCloseError +'</span>' +
                  '</button>' +
                '</span>' +
                '<span class="description">'+ file.name +'</span>' +
                '<div class="l-pull-right">' +
                  '<span class="size">'+ this.formatFileSize(file.size) +'</span>' +
                '</div>' +
              '</div>' +
              '<div class="msg">' +
                '<p>' + error +'</p>' +
              '</div>' +
            '</div>');
        }

        $('.action', container).button().on('click.fileuploadadvanced', function() {
          container.remove();
        });

        // Add this container
        this.dropArea.after(container);
      },

      // Check if file type allowed
      isFileTypeAllowed: function (fileName) {
        var fileExtensions = this.settings.allowedTypes.toLowerCase().split(/[\s|]+/g),
          ext = fileName.split('.').pop().toLowerCase();
        if(this.settings.allowedTypes !== '*' && $.inArray(ext, fileExtensions) < 0) {
          return false;
        }
        return true;
      },

      // Helper function that formats the file sizes
      formatFileSize: function (bytes) {
        var scale = {
          GB: 1000000000,
          MB: 1000000,
          KB: 1000
        };
        if (typeof bytes !== 'number') {
          return '';
        }
        if (bytes >= scale.GB) {
          return (bytes / scale.GB).toFixed(2) +' GB';
        }
        if (bytes >= scale.MB) {
          return (bytes / scale.MB).toFixed(2) +' MB';
        }
        return (bytes / scale.KB).toFixed(2) +' KB';
      },

      /**
      * Set input to enabled.
      */
      enable: function() {
        this.settings.isDisabled = false;
        this.teardown();
        this.element
          .find('.fileupload-wrapper').removeClass('is-disabled')
          .find('.fileupload-adv-browse-lbl input[type="file"]').removeAttr('disabled');
        this.handleEvents();
      },

      /**
      * Set input to disabled.
      */
      disable: function() {
        this.settings.isDisabled = true;
        this.teardown();
        this.element
          .find('.fileupload-wrapper').addClass('is-disabled')
          .find('.fileupload-adv-browse-lbl input[type="file"]').attr('disabled', 'disabled');
        this.handleEvents();
      },

      /**
      * Teardown - Remove added events
      */
      teardown: function() {
        this.dropArea.find('.fileupload-adv-browse-lbl input[type="file"]').off('hidefocusremove.fileuploadadvanced hidefocusadd.fileuploadadvanced change.fileuploadadvanced');

        this.dropArea.off('dragenter.fileuploadadvanced dragover.fileuploadadvanced drop.fileuploadadvanced');
        $(document).off('dragenter.fileuploadadvanced dragover.fileuploadadvanced drop.fileuploadadvanced');
        $('.action', this.element).off('click.fileuploadadvanced');
      },

      /**
      * Destroy - Remove added markup and events
      */
      destroy: function() {
        this.teardown();
        $('.fileupload-wrapper', this.element).remove();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new FileUploadAdvanced(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */

/*
ERROR
--------
https://social.technet.microsoft.com/Forums/ie/en-US/ec3c0be0-0834-4873-8e94-700e9df9c822/edge-browser-drag-and-drop-files-not-working?forum=ieitprocurrentver

*/
