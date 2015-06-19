/**
* Html Editor
* @name editor
*/

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

  $.fn.editor = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'editor',
      defaults = {
        buttons: {
          editor: ['header1', 'header2', 'separator', 'bold', 'italic', 'underline', 'separator', 'justifyLeft', 'justifyCenter', 'justifyRight', 'separator', 'quote', 'orderedlist', 'unorderedlist', 'separator', 'anchor', 'separator', 'image', 'separator', 'source'],
          source: ['bold','italic','underline', 'separator', 'anchor', 'separator', 'quote', 'separator', 'visual']
        },
        delay: 200,
        diffLeft: 0,
        diffTop: -10,
        firstHeader: 'h3',
        secondHeader: 'h4',
        placeholder: null
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Editor(element) {
      this.element = $(element);
      this.init();
    }

    // Actual Plugin Code
    Editor.prototype = {

      init: function() {
        this.parentElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'];
        this.id = $('.editor-toolbar').length + 1;
        return this.setup();
      },

      setup: function () {
        this.isActive = true;
        this.modals = {};
        this.initElements()
          .bindSelect()
          .bindPaste()
          .setPlaceholders()
          .bindWindowActions();
      },

      initElements: function () {
        var i,
          elem = this.element;

        //Make it an editor
        elem.attr({'contentEditable': true, 'aria-multiline': true, 'role': 'textbox'});

        //Bind functionality for Pre elements. We dont use this yet but could if we want to edit code blocks.
        elem.attr('data-editor', true);
        this.bindParagraphCreation(i).bindTab(i);

        if (!elem.attr('data-placeholder')) {
          elem.attr('data-placeholder', (settings.placeholder === null ? Locale.translate('EnterComments') : settings.placeholder));
        }

        this.initToolbar()
          .bindButtons()
          .bindModals()
          .bindAnchorPreview();

        //Build the textarea that will be used as source view and for content serialization
        this.initTextarea();

        return this;
      },

      // Returns true if the source view is currently active.
      sourceViewActive: function() {
        return this.element.hasClass('source-view-active');
      },

      //Bind Events for the place holder
      setPlaceholders: function () {
        var self = this;

        self.element.on('blur.editor', function () {
          self.togglePlaceHolder();
        }).on('keypress', function () {
          self.togglePlaceHolder();
        });

        self.togglePlaceHolder();
        return this;
      },

      togglePlaceHolder: function () {
        var self = this.element;

        if (self.text().trim() === '') {
          self.addClass('editor-placeholder');
        } else {
          self.removeClass('editor-placeholder');
        }
      },

      // Returns the currently visible element - either the main editor window, or the source-view textarea
      getCurrentElement: function() {
        return this.sourceViewActive() ? this.textarea : this.element;
      },

      bindParagraphCreation: function () {
        var self = this,
          currentElement = self.getCurrentElement();

        currentElement.on('keyup', function (e) {
          var node = self.getSelectionStart(),
              tagName;

          if (node && node.getAttribute('data-editor') && node.children.length === 0) {
            document.execCommand('formatBlock', false, 'p');
          }

          if (e.which === 13) {
            node = self.getSelectionStart();
            tagName = node.tagName.toLowerCase();

            if (tagName !== 'li' && !self.isListItemChild(node)) {
              if (!e.shiftKey) {
                  document.execCommand('formatBlock', false, 'p');
              }
              if (tagName === 'a') {
                  document.execCommand('unlink', false, null);
              }
            }
          }
        });
        return this;
      },

      bindTab: function () {
        var self = this,
          currentElement = self.getCurrentElement();

        currentElement.on('keydown.editor', function (e) {
          if (e.which === 9) {
            // Override tab only for pre nodes
            var tag = self.getSelectionStart().tagName.toLowerCase();
            if (tag === 'pre') {
              e.preventDefault();
              document.execCommand('insertHtml', null, '    ');
            }
            // Tab to indent list structures!
            if ( tag === 'li' ) {
              // If Shift is down, outdent, otherwise indent
              if ( e.shiftKey ) {
                document.execCommand('outdent', e);
              } else {
                document.execCommand('indent', e);
              }
            }
          }
        });
        return this;
      },

      // Builds a fake element and gets the name of the event that will be used for "paste"
      // Used for cross-browser compatability.
      getPasteEvent: function() {
        var el = document.createElement('input'),
            name = 'onpaste';
        el.setAttribute(name, '');
        return ((typeof el[name] === 'function') ? 'paste' : 'input') + '.editor';
      },

      initToolbar: function () {
        if (this.toolbar) {
            return this;
        }
        this.toolbar = this.createToolbar();
        this.toolbarActions = this.toolbar;
        this.toolbar.toolbar();

        return this;
      },

      createToolbar: function () {
        var toolbar = $('<div class="editor-toolbar formatter-toolbar"></div>').attr('id', 'editor-toolbar-' + this.id);
        this.toolbarButtons(toolbar);
        toolbar.insertBefore(this.sourceViewActive() ? this.element.prev() : this.element);
        toolbar.find('button').tooltip();
        return toolbar;
      },

      toolbarButtons: function (toolbar) {
        var btns = this.sourceViewActive() ? settings.buttons.source : settings.buttons.editor,
            buttonset = toolbar.find('.buttonset'),
            i, btn;

        if (!buttonset.length) {
          buttonset = $('<div class="buttonset"></div>').appendTo(toolbar);
        }

        for (i = 0; i < btns.length; i += 1) {
          btn = this.buttonTemplate(btns[i]);

          if (btn) {
            buttonset.append(btn);
          }
        }
      },

      switchToolbars: function() {
        this.destroyToolbar();

        // Rebind everything to the new element
        this.setupTextareaEvents().initToolbar().bindButtons().bindModals().bindAnchorPreview();
        this.bindSelect().bindPaste();
        this.toolbar.find('button').button();

      },

      initTextarea: function() {
        var self = this;
        if (this.textarea) {
          return this;
        }
        this.textarea = this.createTextarea();

        // fill the text area with any content that may already exist within the editor DIV
        this.textarea.text(this.element.html().toString());

        this.element.on('input.editor keyup.editor', function() {
          self.textarea.val(self.element.html().toString());
        });

        this.setupTextareaEvents();
        this.setupKeyboardEvents();

        return this.textarea;
      },

      createTextarea: function() {
        this.sourceView = $('<div></div>').attr({
          'class' : 'editor-source editable hidden',
          'id' : 'editor-source-' + this.id
        }).insertBefore(this.element);

        $('<ul></ul>').addClass('line-numbers').appendTo(this.sourceView);
        var textareaContainer = $('<div class="text-container"></div>').appendTo(this.sourceView),
          newTextareaID = 'source-textarea-' + ($('[id^="source-textarea-"]').length+1),
          labelContents = this.element.prev('.label').addClass('audible').text() + ' - HTML Source View';

        $('<label class="audible" for="'+ newTextareaID +'">'+ labelContents +'</label>').appendTo(textareaContainer);
        var textarea = $('<textarea id="'+ newTextareaID +'" class="editable"></textarea>').appendTo(textareaContainer);
        return textarea;
      },

      triggerClick: function(e, btn) {
        $('button[data-action="'+ btn +'"]').trigger('click');
        e.preventDefault();
      },

      setupKeyboardEvents: function() {
        var self = this,
          keys = {
            b: 66, // bold
            e: 69, // justifyCenter
            h: 72, // anchor
            i: 73, // italic [shift: image]
            l: 76, // justifyLeft
            o: 79, // orderedlist [shift: unorderedlist]
            q: 81, // append-blockquote
            r: 82, // justifyRight
            u: 85  // underline
          };

        this.element.parent('.field').on('keydown.editor', function(e) {
          e = (e) ? e : window.event;
          keys.charCode = (e.which) ? e.which : ((e.keyCode) ? e.keyCode : false);

          switch (e.ctrlKey && keys.charCode) {
            case keys.b:
              self.triggerClick(e, 'bold');
              break;
            case keys.e:
              self.triggerClick(e, 'justifyCenter');
              break;
            case keys.h:
              self.triggerClick(e, 'anchor');
              break;
            case keys.i:
              if(e.shiftKey) {
                self.triggerClick(e, 'image');
              } else {
                self.triggerClick(e, 'italic');
              }
              break;
            case keys.l:
              self.triggerClick(e, 'justifyLeft');
              break;
            case keys.o:
              if(e.shiftKey) {
                self.triggerClick(e, 'insertunorderedlist');
              } else {
                self.triggerClick(e, 'insertorderedlist');
              }
              break;
            case keys.q:
              self.triggerClick(e, 'append-blockquote');
              break;
            case keys.r:
              self.triggerClick(e, 'justifyRight');
              break;
            case keys.u:
              self.triggerClick(e, 'underline');
              break;
          }
        });

        return self;
      },

      setupTextareaEvents: function() {
        var self = this;
        // Adjust line numbers on input
        this.textarea.on('input.editor keyup.editor', function() {
          if (!(self.sourceView.hasClass('hidden'))) {
            self.adjustSourceLineNumbers();
          }
        }).on('focus.editor', function() {
          self.sourceView.addClass('is-focused');
        }).on('blur.editor', function() {
          self.sourceView.removeClass('is-focused');
          self.element.empty().html(self.textarea.val());
          if (self.element.data('validate')) {
            self.element.data('validate').validate(self.element);
          }
        });

        return this;
      },

      adjustSourceLineNumbers: function() {
        var container = this.textarea.parent(),
          lineHeight = parseInt(this.textarea.css('line-height')),
          YPadding = (this.textarea.innerHeight() - this.textarea.height() );
        this.textarea.css('height','');
        var scrollHeight = this.textarea[0].scrollHeight,
          lineNumberCount = Math.floor((scrollHeight - YPadding) / lineHeight),
          numberList = this.sourceView.find('.line-numbers'),
          i = 0;

        if (!this.lineNumbers || lineNumberCount !== this.lineNumbers) {
          if (!this.lineNumbers) {
            // Build the list of line numbers from scratch
            this.lineNumbers = lineNumberCount;
            while (i < this.lineNumbers) {
              numberList.append('<li role="presentation"><span>' + (i + 1) + '</span></li>');
              i++;
            }
          } else if (this.lineNumbers < lineNumberCount) {
            // Add extra line numbers to the bottom
            while (i < (lineNumberCount - this.lineNumbers)) {
              numberList.append('<li role="presentation"><span>' + (numberList.find('li').length + i + 1) + '</span></li>');
              i++;
            }
          } else if (this.lineNumbers > lineNumberCount) {
            // Remove extra line numbers from the bottom
            i = this.lineNumbers - lineNumberCount;
            numberList.find('li').slice(-(i)).remove();
          }
          this.lineNumbers = lineNumberCount;
          container.css('width', 'calc(100% - ' + (numberList.outerWidth() + 1) + 'px)');
        }
        this.textarea.css('height', numberList[0].scrollHeight + 'px');
      },

      wrapTextInTags: function(insertedText, selectedText, action) {
        var tags,
          finalText;
        switch(action) {
          case 'bold':
            tags = ['<b>','</b>'];
            break;
          case 'italic':
            tags = ['<i>','</i>'];
            break;
          case 'underline':
            tags = ['<u>','</u>'];
            break;
          case 'strikethrough':
            tags = ['<strike>', '</strike>'];
            break;
          case 'append-blockquote':
            tags = ['<blockquote>', '</blockquote>'];
            break;
          default:
            tags = ['',''];
        }

        if (action === 'anchor') {
          finalText = '<a href="'+ insertedText +'">' + selectedText + '</a>';
        } else {
          finalText = tags[0] + insertedText + selectedText + tags[1];
        }
        return finalText;
      },

      insertTextAreaContent: function(text, action) {
        var el = this.textarea[0],
          val = el.value,
          sel, startPos, endPos, scrollTop;

        // Always have empty text
        text = text ? text : '';

        if (document.selection && el.tagName === 'TEXTAREA') {
          //IE textarea support
          $(el).focus();
          sel = document.selection.createRange();
          sel.text = this.wrapTextInTags(text, sel.text, action);
          $(el).focus();
        } else if (el.selectionStart || el.selectionStart === '0') {
          //MOZILLA/NETSCAPE support
          startPos = el.selectionStart;
          endPos = el.selectionEnd;
          scrollTop = el.scrollTop;
          sel = this.wrapTextInTags(text, val.substring(startPos, endPos), action);
          el.value = val.substring(0, startPos) + sel + val.substring(endPos, val.length);
          $(el).focus();
          el.selectionStart = startPos + sel.length;
          el.selectionEnd = startPos + sel.length;
          el.scrollTop = scrollTop;
        } else {
          // IE input[type=text] and other browsers
          el.value += this.wrapTextInTags(text, el.value, action);
          $(el).focus();
          el.value = el.value;    // forces cursor to end
        }
      },

      buttonTemplate: function (btnType) {
        var buttonLabels = this.getButtonLabels(settings.buttonLabels),
          buttonTemplates = {
            'bold': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('ToggleBold') + '" data-action="bold" data-element="b">' + buttonLabels.bold + '</button>',
            'italic': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('ToggleItalic') + '" data-action="italic" data-element="i">' + buttonLabels.italic + '</button>',
            'underline': '<button type="button" class="btn-tertiary underline" title="'+ Locale.translate('ToggleUnderline') + '" data-action="underline" data-element="u">' + buttonLabels.underline + '</button>',
            'strikethrough': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('StrikeThrough') + '" data-action="strikethrough" data-element="strike"><strike>A</strike></button>',
            'superscript': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('Superscript') + '" data-action="superscript" data-element="sup">' + buttonLabels.superscript + '</button>',
            'subscript': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('Subscript') + '" data-action="subscript" data-element="sub">' + buttonLabels.subscript + '</button>',
            'separator': '<div class="separator"></div>',
            'anchor': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('InsertAnchor') + '" data-action="anchor" data-modal="editor-modal-url" data-element="a">' + buttonLabels.anchor + '</button>',
            'image': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('InsertImage') + '" data-action="image" data-modal="editor-modal-image" data-element="img">' + buttonLabels.image + '</button>',
            'header1': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('ToggleH3') + '" + data-action="append-' + settings.firstHeader + '" data-element="' + settings.firstHeader + '">' + buttonLabels.header1 + '</button>',
            'header2': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('ToggleH4') + '" + data-action="append-' + settings.secondHeader + '" data-element="' + settings.secondHeader + '">' + buttonLabels.header2 + '</button>',
            'quote': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('Blockquote') + '" data-action="append-blockquote" data-element="blockquote">' + buttonLabels.quote + '</button>',
            'orderedlist': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('OrderedList') + '" data-action="insertorderedlist" data-element="ol">' + buttonLabels.orderedlist + '</button>',
            'unorderedlist': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('UnorderedList') + '" data-action="insertunorderedlist" data-element="ul">' + buttonLabels.unorderedlist + '</button>',
            'justifyLeft': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('JustifyLeft') + '" data-action="justifyLeft" >' + buttonLabels.justifyLeft + '</button>',
            'justifyCenter': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('JustifyCenter') + '" data-action="justifyCenter">' + buttonLabels.justifyCenter + '</button>',
            'justifyRight': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('JustifyRight') + '" data-action="justifyRight" >' + buttonLabels.justifyRight + '</button>',
            'source': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('ViewSource') + '" data-action="source" >' + buttonLabels.source + '</button>',
            'visual': '<button type="button" class="btn-tertiary" title="'+ Locale.translate('ViewVisual') + '" data-action="visual" >' + buttonLabels.visual + '</button>'
          };
       return buttonTemplates[btnType] || false;
      },

      getIcon: function(textName, iconName, className) {
        return '<span class="audible">'+ Locale.translate(textName) +'</span><svg focusable="false" aria-hidden="true" class="icon' + (className ? ' '+ className : '') + '"><use xlink:href="#icon-' +iconName +'"></use></svg>';
      },

      getButtonLabels: function (buttonLabelType) {
        var customButtonLabels,
          attrname,
          buttonLabels = {
            'bold': this.getIcon('Bold', 'bold'),
            'italic': this.getIcon('Italic', 'italic'),
            'underline': this.getIcon('Underline', 'underline'),
            'superscript': '<span aria-hidden="true"><b>x<sup>1</sup></b></span>',
            'subscript': '<span aria-hidden="true"><b>x<sub>1</sub></b></span>',
            'anchor': this.getIcon('InsertAnchor', 'link'),
            'image': this.getIcon('InsertImage', 'insert-image'),
            'header1': this.getIcon('ToggleH3', 'h3'),
            'header2': this.getIcon('ToggleH4', 'h3'),
            'quote': this.getIcon('Blockquote', 'quote'),
            'orderedlist': this.getIcon('OrderedList', 'orderedlist'),
            'unorderedlist': this.getIcon('UnorderedList', 'unorderedlist'),
            'pre': '<span aria-hidden="true"><b>0101</b></span>',
            'indent': '<span aria-hidden="true"><b>&rarr;</b></span>',
            'outdent': '<span aria-hidden="true"><b>&larr;</b></span>',
            'justifyLeft': this.getIcon('JustifyLeft', 'justify-left'),
            'justifyCenter': this.getIcon('JustifyCenter', 'justify-center'),
            'justifyRight': this.getIcon('JustifyRight', 'justify-right'),
            'source': this.getIcon('ViewSource', 'html', 'html-icon'),
            'visual': '<span aria-hidden="true"><b>&nbsp;VISUAL&nbsp;</b></span>'
          };

        if (typeof buttonLabelType === 'object') {
          customButtonLabels = buttonLabelType;
        }
        if (typeof customButtonLabels === 'object') {
          for (attrname in customButtonLabels) {
            if (customButtonLabels.hasOwnProperty(attrname)) {
              buttonLabels[attrname] = customButtonLabels[attrname];
            }
          }
        }
        return buttonLabels;
      },

      //Show the Buttons
      activateButton: function (tag) {
        this.toolbar.find('[data-element="' + tag + '"]').addClass('is-active');
      },

      //Bind Events to Toolbar Buttons
      bindButtons: function () {
        var self = this;

        this.toolbar.on('click.editor', 'button', function (e) {
          var btn = $(this),
            action = btn.attr('data-action');

          e.preventDefault();
          self.getCurrentElement().focus();

          if (self.selection === undefined) {
            self.checkSelection();
          }

          if (!self.sourceViewActive()) {
            btn.toggleClass('is-active');
          }

          if (action) {
            self.execAction(action, e);
          }

          return false;
        });

        return this;
      },

      bindModals: function() {
        var self = this;

        self.modals = {
          url: self.createURLModal(),
          image: self.createImageModal()
        };

        $('#editor-modal-url, #editor-modal-image').modal()
          .on('beforeOpen', function () {
            self.savedSelection = self.saveSelection();

            if ($(this).attr('id') === 'editor-modal-url') {
              if (!self.selectionRange) {
                return false;
              }

              //Toggle linked State
              if (self.isLinkSelected()) {
                document.execCommand('unlink', false, null);
                return false;
              }
            }
          })
          .on('open', function () {
            $(this).find('input:first').focus().select();
          })
          .on('close', function (e, isCancelled) {
            self.restoreSelection(self.savedSelection);

            if (isCancelled) {
              return;
            }

            //insert image or link
            if ($(this).attr('id') === 'editor-modal-url') {
              self.createLink($(this).find('input:first'));
            } else {
              self.insertImage($('#image').val());
            }
          });

        return this;
      },

      createURLModal: function() {
        var urlModal = $('#editor-modal-url');
        if (urlModal.length > 0) {
          return urlModal;
        }
        return $('<div class="modal editor-modal-url" id="editor-modal-url"></div>')
          .html('<div class="modal-content">' +
            '<div class="modal-header">' +
              '<h1 class="modal-title">Insert Url</h1>' +
            '</div>' +
            '<div class="modal-body">' +
              '<div class="field">' +
                '<label for="url">URL</label>' +
                '<input id="url" name="url" type="text" value="http://www.example.com">' +
              '</div>' +
              '<div class="modal-buttonset">' +
                '<button type="button" class="btn-modal btn-cancel">Cancel</button>' +
                '<button type="button" class="btn-modal-primary">Insert</button>' +
              '</div>' +
            '</div>' +
          '</div>').appendTo('body');
      },

      createImageModal: function() {
        var imageModal = $('#editor-modal-image');
        if (imageModal.length > 0) {
          return imageModal;
        }
        return $('<div class="modal editor-modal-image" id="editor-modal-image"></div>')
          .html('<div class="modal-content">' +
            '<div class="modal-header">' +
              '<h1 class="modal-title">Insert Image</h1>' +
            '</div>' +
            '<div class="modal-body">' +
              '<div class="field">' +
                '<label for="image">URL</label>' +
                '<input id="image" name="image" type="text" value="http://images2.fanpop.com/image/photos/12900000/Cute-kittens-12929201-1600-1200.jpg">' +
              '</div>' +
              '<div class="modal-buttonset">' +
                '<button type="button" class="btn-modal btn-cancel">Cancel</button>' +
                '<button type="button" class="btn-modal-primary">Insert</button>' +
              '</div>' +
            '</div>' +
          '</div>').appendTo('body');
      },

      bindAnchorPreview: function () {
        this.element.find('a').tooltip({content: function() {
          return $(this).attr('href');
        }});
        return;
      },

      createLink: function (input) {
        //Restore Selection in the Editor and Variables
        this.restoreSelection(this.savedSelection);

        //Fix and Format the Link
        input.val(this.fixLinkFormat(input.val()));

        if (this.sourceViewActive()) {
          this.insertTextAreaContent(input.val(), 'anchor');
        } else {
          document.execCommand('createLink', false, input.val());
          this.bindAnchorPreview();
        }
      },

      fixLinkFormat: function (value) {
        var re = /^https?:\/\//;
        if (value.match(re)) {
          return value;
        }
        return 'http://' + value;
      },

      //Setup Events For Text Selection
      bindSelect: function () {
        var self = this,
            selectionTimer = '';

        this.selectionHandler = function () {
          clearTimeout(selectionTimer);
          selectionTimer = setTimeout(function () {
            self.checkSelection();
          }, settings.delay);
        };

        var currentElement = self.getCurrentElement();

        currentElement.on('mouseup.editor', this.selectionHandler);
        currentElement.on('keyup.editor', this.selectionHandler);

        return this;
      },

      checkSelection: function () {
        var newSelection,
            selectionElement;

        if (this.selection === undefined) {
          if (this.sourceViewActive()) {
            newSelection = this.textarea.val().substring( this.textarea[0].selectionStart, this.textarea[0].selectionEnd ).toString().trim();
            this.hideToolbarActions();
            return;
          }
        }

        newSelection = window.getSelection();
        selectionElement = this.getSelectionElement();
        if (!selectionElement) {
            this.hideToolbarActions();
        } else {
          this.checkSelectionElement(newSelection, selectionElement);
        }


        return this;
      },

      getSelectionElement: function () {
        var selection = window.getSelection(),
          range, current, parent,
          result,
          getElement = function (e) {
            var localParent = e;
            try {
                while (!localParent.getAttribute('data-editor')) {
                    localParent = localParent.parentNode;
                }
            } catch (errb) {
                return false;
            }
            return localParent;
          };

        // First try on current node
        try {
          range = selection.getRangeAt(0);
          current = range.commonAncestorContainer;
          parent = current.parentNode;

          if (current.getAttribute('data-editor')) {
              result = current;
          } else {
              result = getElement(parent);
          }
          // If not search in the parent nodes.
        } catch (err) {
          result = getElement(parent);
        }
        return result;
      },

      //See if the Editor is Selected and Show Toolbar
      checkSelectionElement: function (newSelection, selectionElement) {
        var currentElement = this.sourceViewActive() ? this.sourceView[0] : this.element[0];

        this.selection = newSelection;
        this.selectionRange = this.selection.getRangeAt(0);
        if (currentElement === selectionElement) {
          this.setToolbarButtonStates();
          return;
        }
        this.hideToolbarActions();
      },

      //See if the Editor is Selected and Show Toolbar
      setToolbarButtonStates: function () {
        var buttons = this.toolbarActions.find('button');

        buttons.removeClass('is-active');
        this.checkActiveButtons();
        return this;
      },

      checkActiveButtons: function () {
        this.checkButtonState('bold');
        this.checkButtonState('italic');
        this.checkButtonState('underline');

        var self = this,
            parentNode = this.getSelectedParentElement();

        while (parentNode.tagName !== undefined && this.parentElements.indexOf(parentNode.tagName.toLowerCase) === -1) {
            this.activateButton(parentNode.tagName.toLowerCase());

            // we can abort the search upwards if we leave the contentEditable element
            if (self.element.is(parentNode)) {
                break;
            }
            parentNode = parentNode.parentNode;
        }
      },

      checkButtonState: function(command) {
        if (!document.queryCommandState) {
          return;
        }

        if (document.queryCommandState(command)) {
          this.toolbar.find('[data-action="' + command + '"]').addClass('is-active');
        } else {
          this.toolbar.find('[data-action="' + command + '"]').removeClass('is-active');
        }
      },

      rangeSelectsSingleNode: function (range) {
        var startNode = range.startContainer;
        return startNode === range.endContainer &&
            startNode.hasChildNodes() &&
            range.endOffset === range.startOffset + 1;
      },

      getSelectedParentElement: function () {
        var selectedParentElement = null,
            range = this.selectionRange;
        if (this.rangeSelectsSingleNode(range)) {
            selectedParentElement = range.startContainer.childNodes[range.startOffset];
        } else if (range.startContainer.nodeType === 3) {
            selectedParentElement = range.startContainer.parentNode;
        } else {
            selectedParentElement = range.startContainer;
        }
        return selectedParentElement;
      },

      //Hide Toolbar
      hideToolbarActions: function () {
        if (this.toolbar !== undefined) {
          this.toolbar.removeClass('is-active');
        }
      },

      //Handle Pasted In Text
      bindPaste: function () {
        var self = this;
        if (!self.pasteEvent) {
          self.pasteEvent = self.getPasteEvent();
        }

        this.pasteWrapper = function (e) {
          var paste = e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData ?
            e.originalEvent.clipboardData.getData('text/plain') : // Standard
            window.clipboardData && window.clipboardData.getData ?
            window.clipboardData.getData('Text') : // MS
            false,
            paragraphs,
            html = '',
            p;

          if (self.sourceViewActive() ) {
            return this;
          }

          if (paste && !e.defaultPrevented) {
            e.preventDefault();
            paragraphs = paste.split(/[\r\n]/g);
            for (p = 0; p < paragraphs.length; p += 1) {
              if (paragraphs[p] !== '') {
                if (navigator.userAgent.match(/firefox/i) && p === 0) {
                  html += self.htmlEntities(paragraphs[p]);
                } else {
                  html += '<p>' + self.htmlEntities(paragraphs[p]) + '</p>';
                }
              }
            }
            // TODO: This doesn't work in Internet Explorer 11 and down... need an alternate solution.
            document.execCommand('insertHTML', false, html);
          }
        };

        var currentElement = self.getCurrentElement();
        currentElement.on(self.pasteEvent, self.pasteWrapper);
        return this;
      },

      htmlEntities: function (str) {
        // converts special characters (like <) into their escaped/encoded values (like &lt;).
        // This allows you to show to display the string without the browser reading it as HTML.
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      },

      bindWindowActions: function () {
        var self = this,
            currentElement = self.getCurrentElement();

        //Attach Label
        var label = this.element.prevAll('.label');
        label.css('cursor', 'default').on('click.editor', function () {
          currentElement.focus();
        });
        currentElement.attr('aria-label', label.text());
        return this;
      },

      //Restore Text Selection
      restoreSelection: function(savedSel) {
        var i,
          len,
          sel = window.getSelection();

        if (!savedSel) {
          savedSel = this.savedSelection;
        }

        if (savedSel) {
          sel.removeAllRanges();
          for (i = 0, len = savedSel.length; i < len; i += 1) {
              sel.addRange(savedSel[i]);
          }
        }
      },

      //Save Text Selection
      saveSelection: function() {
        var i,
            len,
            ranges,
            sel = window.getSelection();

        if (sel.getRangeAt && sel.rangeCount) {
            ranges = [];
            for (i = 0, len = sel.rangeCount; i < len; i += 1) {
                ranges.push(sel.getRangeAt(i));
            }
            return ranges;
        }
        return null;
      },

      // Get the Element the Caret idea from http://bit.ly/1kRmZIL
      getSelectionStart: function() {
        var node = document.getSelection().anchorNode,
            startNode = (node && node.nodeType === 3 ? node.parentNode : node);
        return startNode;
      },

      isLinkSelected: function() {
        var node = window.getSelection(),
          selectedParentElement = this.getSelectedParentElement();

        if (node && node.anchorNode && $(node.anchorNode.nextSibling).is('a')) {
          return true;
        } else {
          return (selectedParentElement.tagName && selectedParentElement.tagName.toLowerCase() === 'a');
        }

        return false;
      },

      //Run the CE action.
      execAction: function (action) {
        var currentElement = this.getCurrentElement();

        // Visual Mode
        if (currentElement === this.element) {
          if (action.indexOf('append-') > -1) {
            this.execFormatBlock(action.replace('append-', ''));
            this.setToolbarButtonStates();
          } else if (action === 'anchor') {
            this.modals.url.data('modal').open();
          } else if (action === 'image') {
            this.modals.image.data('modal').open();
          } else if (action === 'source' || action === 'visual') {
            this.toggleSource();
          } else {
            document.execCommand(action, false, null);
          }
        } else {
          // Source Mode
          switch(action) {
            case 'visual':
              this.toggleSource();
              break;
            case 'anchor':
              this.modals.url.data('modal').open();
              break;
            default:
              this.insertTextAreaContent(null, action);
              break;
          }
        }
      },

      insertImage: function (url) {
        document.execCommand('insertImage', false, url);
      },

      toggleSource: function() {
        if (this.sourceViewActive()) {
          this.element.empty().html(this.textarea.val());
          this.element.removeClass('source-view-active hidden');
          this.sourceView.addClass('hidden').removeClass('is-focused');
        } else {
          // Format The Text being pulled from the WYSIWYG editor
          var val = this.element.html().toString().trim()
            .replace(/\s+/g, ' ')
            .replace(/<br( \/)?>/g, '<br>\n')
            .replace(/<\/p> /g, '</p>\n\n')
            .replace(/<\/blockquote>( )?/g, '</blockquote>\n\n');

          this.textarea.val(val).focus();
          this.element.addClass('source-view-active hidden');
          this.sourceView.removeClass('hidden');
          this.adjustSourceLineNumbers();
          this.textarea.focus();
        }
        this.switchToolbars();
      },

      execFormatBlock: function (el) {
        var selectionData = this.getSelectionData(this.selection.anchorNode);
        // FF handles blockquote differently on formatBlock
        // allowing nesting, we need to use outdent
        // https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
        if (el === 'blockquote' && selectionData.el &&
            selectionData.el.parentNode.tagName.toLowerCase() === 'blockquote') {
            return document.execCommand('outdent', false, null);
        }
        if (selectionData.tagName === el) {
            el = 'p';
        }
        // When IE we need to add <> to heading elements and
        // blockquote needs to be called as indent
        // http://stackoverflow.com/questions/10741831/execcommand-formatblock-headings-in-ie
        // http://stackoverflow.com/questions/1816223/rich-text-editor-with-blockquote-function/1821777#1821777
        this.isIE = ((navigator.appName === 'Microsoft Internet Explorer') || ((navigator.appName === 'Netscape') && (new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(navigator.userAgent) !== null)));

        if (this.isIE) {
          if (el === 'blockquote') {
              return document.execCommand('indent', false, el);
          }
          el = '<' + el + '>';
        }

        return document.execCommand('formatBlock', false, el);
      },

      //Get What is Selected
      getSelectionData: function (el) {
        var tagName;

        if (el && el.tagName) {
        tagName = el.tagName.toLowerCase();
        }

        while (el && this.parentElements.indexOf(tagName) === -1) {
          el = el.parentNode;
          if (el && el.tagName) {
              tagName = el.tagName.toLowerCase();
          }
        }

        return {
          el: el,
          tagName: tagName
        };
      },

      isListItemChild: function (node) {
        var parentNode = node.parentNode,
            tagName = parentNode.tagName.toLowerCase();
        while (this.parentElements.indexOf(tagName) === -1 && tagName !== 'div') {
          if (tagName === 'li') {
              return true;
          }
          parentNode = parentNode.parentNode;
          if (parentNode && parentNode.tagName) {
              tagName = parentNode.tagName.toLowerCase();
          } else {
              return false;
          }
        }
        return false;
      },

      destroyToolbar: function() {
        // Unbind all events attached to the old element that involve triggering the toolbar hide/show
        this.toolbar.find('button').data('tooltip').destroy();
        this.toolbar.off('click.editor mousedown.editor');
        this.toolbar.remove();
        this.toolbar = undefined;
        this.element.off('mouseup.editor keyup.editor focus.editor blur.editor ' + this.pasteEvent);
        this.textarea.off('mouseup.editor keyup.editor focus.editor blur.editor ' + this.pasteEvent);
        this.element.parent('.field').off('keydown.editor');
        this.element.prev('.label').off('click.editor');
        $(window).off('resize.editor');
        $.each(this.modals, function(i, modal) {
          modal.off('beforeClose close open');
        });
        this.modals = {};

        this.element.trigger('destroy.toolbar.editor');
      },

      disable: function () {
        this.element.addClass('is-disabled');
        this.element.parent('.field').addClass('is-disabled');
      },

      enable: function () {
        this.element.removeClass('is-disabled');
        this.element.parent('.field').addClass('is-disabled');
      },

      destroy: function () {
        $('html').off('mouseup.editor');
        this.destroyToolbar();
        $.each(this.modals, function(i, modal) {
          if (modal.data('modal')) {
            modal.destroy();
          }
        });
        $.removeData(this.obj, pluginName);
      }
    };

    // Make it plugin protecting from double initialization
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Editor(this, settings));
      }
    });

  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
