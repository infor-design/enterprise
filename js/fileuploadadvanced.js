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
          isStandalone: true, // on page -or- on modal [for some visual style only]
          standaloneClass: 'standalone', // css class if on page
          allowedTypes: '*', // restrict file types(ie. 'jpg|png|gif') ['*' all types]
          maxFilesInProcess: 99999, // max files can be upload
          maxFileSize: -1, // max file size in bytes, -1 for unlimited
          fileName: 'myfile', // variable name to read from server

          // Text strings
          textDropArea: 'Drag and Drop File to Upload',
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
     * @constructor
     * @param {Object} element
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
        var settings = this.settings,
          standaloneClass = settings.isStandalone ? settings.standaloneClass : '';

        this.element.append(
          '<div class="fileupload-wrapper '+ standaloneClass +'">' +
            '<div class="container drop-area">' +
              $.createIcon('upload-adv') +
              '<p>'+ settings.textDropArea +'</p>' +
            '</div>' +
          '</div>');

        this.dropArea = $('.drop-area', this.element);
      },

      //Attach Events used by the Control
      handleEvents: function () {
        var self = this,
          settings = this.settings;

        self.dropArea

        // Drag enter
        .on('dragenter.fileuploadadvanced', function (e) {
          self.element.triggerHandler('filesdragenter');
          e.stopPropagation();
          e.preventDefault();
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

          self.element.triggerHandler('filesdroped', [files]);

          $(this).removeClass('hover');

          // Clear previous errors in general area
          $('span.msg', this.element).closest('.error').remove();

          // Max files can be upload
          if ((files.length + $('.progress', this.element).length) > settings.maxFilesInProcess) {
            self.showError(settings.errorMaxFilesInProcess);
            return;
          }

          self.handleFileUpload(files);
        });

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

      // Read the file contents using HTML5 FormData()
      handleFileUpload: function (files) {
        var fileName = this.settings.fileName.replace('[]', '');

        for (var i = 0, l = files.length; i < l; i++) {

          // Check if file type allowed
          if (!this.isFileTypeAllowed(files[i].name)) {
            this.showError(settings.errorAllowedTypes, files[i]);
            continue;
          }

          // Check for max file size
          if (settings.maxFileSize !== -1 && files[i].size > settings.maxFileSize) {
            this.showError(settings.errorMaxFileSize, files[i]);
            continue;
          }

          this.element.triggerHandler('beforecreatestatus', [files[i]]);
          var fd = new FormData();
          fd.append(fileName + '[]', files[i]);

          var status = this.createStatus(files[i]);
          this.element.triggerHandler('aftercreatestatus', [files[i]]);

          this.sendFileToServer(fd, status);
        }
      },

      // Create status
      createStatus: function (file) {
        var self = this,
          settings = this.settings,
          container = $(
            '<div class="container">' +
              '<div class="file-row">' +
                '<span class="status-icon">' +
                  '<button type="button" class="btn-icon action">' +
                    $.createIcon({ icon: 'close', classes: ['icon-close'] }) +
                    '<span>'+ settings.textBtnCancel +'</span>' +
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
                '<span>'+ settings.textBtnRemove +'</span>' +
              '</button>');

            // Set "Remove from server" button action
            $('.action', rightSide).button().on('click.fileuploadadvanced', function() {
              container.remove();

              // TODO: server call for removing data
              data.remove();
            });

            // Remove Cancel button and progress-bar area
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

      // For ui testing only
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

      sendFileToServer2: function (formData, status) {
        this.element.triggerHandler('beforeuploading', [formData]);
        var uploadURL = 'http://myserver.com/upload/upload.php', // Upload URL
          jqXHR = $.ajax({
            xhr: function() {
              var xhrobj = $.ajaxSettings.xhr();

              if (xhrobj.upload) {
                xhrobj.upload.addEventListener('progress', function(e) {
                  var percent = 0,
                    position = e.loaded || e.position,
                    total = e.total;

                  if (e.lengthComputable) {
                    percent = Math.ceil(position / total * 100);
                  }

                  // Set progress
                  status.setProgress(percent);
                }, false);
              }
              return xhrobj;
            },
            url: uploadURL,
            type: 'POST',
            contentType: false,
            processData: false,
            cache: false,
            data: formData,
            success: function(data) {
              // File upload Done
              status.setCompleted(data);
            }
        });

        status.setAbort(jqXHR);
      },

      // Show Errors
      showError: function (error, file) {
        var container;

        if (error === this.settings.errorMaxFilesInProcess) {
          // This error show without file name or size in general area
          container = $(
            '<div class="container error">' +
              '<div class="file-row">' +
                '<span class="status-icon">' +
                  '<button type="button" class="btn-icon action">' +
                    $.createIcon({ classes: ['icon-close'], icon: 'close' }) +
                    '<span>'+ settings.textBtnCloseError +'</span>' +
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
                    '<span>'+ settings.textBtnCloseError +'</span>' +
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

      // Teardown
      destroy: function() {
        this.dropArea.off('dragenter.fileuploadadvanced dragover.fileuploadadvanced drop.fileuploadadvanced');
        $(document).off('dragenter.fileuploadadvanced dragover.fileuploadadvanced drop.fileuploadadvanced');
        $('.action', this.element).off('click.fileuploadadvanced');
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
