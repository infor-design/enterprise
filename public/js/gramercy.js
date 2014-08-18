/*!
 Soho 2.0 Controls v4.0.0 
 Date: 18-08-2014 07:01:16 
 Revision: undefined 
 */ 
 /*
* Infor (RichText) Editor
*/
(function ($) {
  $.fn.editor = function(options) {

    // Settings and Options
    var pluginName = 'editor',
        defaults = {
          buttons: ['header1', 'header2', 'seperator', 'bold', 'italic', 'underline', 'seperator', 'justifyLeft', 'justifyCenter', 'justifyRight', 'seperator', 'quote', 'orderedlist', 'unorderedlist', 'seperator', 'anchor', 'seperator', 'image', 'video'],
          staticToolbar: true,
          delay: 200,
          diffLeft: 0,
          diffTop: -10,
          firstHeader: 'h3',
          secondHeader: 'h4',
          forcePlainText: true,
          targetBlank: false,
          extensions: {}
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {
      init: function() {
        this.parentElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'];
        this.id = $('.editor-toolbar').length + 1;
        return this.setup();
      },
      setup: function () {
        this.isActive = true;
        this.initElements()
            .bindSelect()
            .bindPaste()
            .bindWindowActions();
      },
      initElements: function () {
        var i,
            elem = this.element;

        //Make it an editor
        elem.attr('contentEditable', true);

        //Bind functionality for Pre elements. We dont use this yet but could if we want to edit code blocks.
        elem.attr('data-editor', true); //TODO : Need?
        this.bindParagraphCreation(i).bindTab(i);

        this.initToolbar()
            .bindButtons()
            .bindAnchorPreview();

        return this;
      },

      bindParagraphCreation: function () {
        var self = this;

        this.element.on('keyup', function (e) {
          var node = self.getSelectionStart(),
              tagName;
          if (node && node.getAttribute('data-editor') && node.children.length === 0) {
            document.execCommand('formatBlock', false, 'p');
          }
          if (e.which === 13) {
            node = self.getSelectionStart();
            tagName = node.tagName.toLowerCase();
            //TODO Need Data Disable Return?
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
        var self = this;

        this.element.on('keydown', function (e) {
          if (e.which === 9) {
            // Override tab only for pre nodes
            var tag = self.getSelectionStart().tagName.toLowerCase();
            if (tag === 'pre') {
              e.preventDefault();
              document.execCommand('insertHtml', null, '    ');
            }
            // Tab to indent list structures!
            if ( tag === 'li' ) {
              e.preventDefault();
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
      initToolbar: function () {
        if (this.toolbar) {
            return this;
        }
        this.toolbar = this.createToolbar();
        this.keepToolbarAlive = false;
        this.toolbarActions = this.toolbar.find('.editor-toolbar-actions');

        return this;
      },
      createToolbar: function () {
        var toolbar = $('<div></div>').attr('class', 'editor-toolbar').attr('id', 'editor-toolbar-' + this.id);
        toolbar.append(this.toolbarButtons());
        toolbar.insertAfter(this.element);
        return toolbar;
      },

      toolbarButtons: function () {
        var btns = settings.buttons,
            ul = $('<ul></ul>').attr('id','editor-toolbar-actions').attr('class', 'editor-toolbar-actions'),
            li, i, btn, ext;

        for (i = 0; i < btns.length; i += 1) {
          if (settings.extensions.hasOwnProperty(btns[i])) {
              ext = settings.extensions[btns[i]];
              btn = ext.getButton !== undefined ? ext.getButton() : null;
          } else {
              btn = this.buttonTemplate(btns[i]);
          }

          if (btn) {
              li = $('<li></li>');
              li.append(btn).appendTo(ul);
          }
        }

        return ul;
      },

      buttonTemplate: function (btnType) {
        var buttonLabels = this.getButtonLabels(settings.buttonLabels),
          buttonTemplates = {
            'bold': '<button type="button" class="editor-action editor-action-bold" title="Bold" data-action="bold" data-element="b">' + buttonLabels.bold + '</button>',
            'italic': '<button type="button" class="editor-action editor-action-italic" title="italic" data-action="italic" data-element="i">' + buttonLabels.italic + '</button>',
            'underline': '<button type="button" class="editor-action editor-action-underline" title="underline" data-action="underline" data-element="u">' + buttonLabels.underline + '</button>',
            'strikethrough': '<button type="button" class="editor-action editor-action-strikethrough" title="strike through" data-action="strikethrough" data-element="strike"><strike>A</strike></button>',
            'superscript': '<button type="button" class="editor-action editor-action-superscript" title="superscript" data-action="superscript" data-element="sup">' + buttonLabels.superscript + '</button>',
            'subscript': '<button type="button" class="editor-action editor-action-subscript" title="subscript" data-action="subscript" data-element="sub">' + buttonLabels.subscript + '</button>',
            'seperator': '<div class="editor-toolbar-seperator"></div>',
            'anchor': '<button type="button" class="editor-action editor-action-anchor" title="insert anchor" data-action="anchor" data-modal="editor-modal-url" data-element="a">' + buttonLabels.anchor + '</button>',
            'image': '<button type="button" class="editor-action editor-action-image" title="insert image" data-action="image" data-modal="editor-modal-image" data-element="img">' + buttonLabels.image + '</button>',
            'video': '<button type="button" class="editor-action editor-action-video" title="insert video" data-action="video" data-element="video">' + buttonLabels.video + '</button>',
            'header1': '<button type="button" class="editor-action editor-action-header1" title="' + settings.firstHeader + '" data-action="append-' + settings.firstHeader + '" data-element="' + settings.firstHeader + '">' + buttonLabels.header1 + '</button>',
            'header2': '<button type="button" class="editor-action editor-action-header2" title="' + settings.secondHeader + '" data-action="append-' + settings.secondHeader + '" data-element="' + settings.secondHeader + '">' + buttonLabels.header2 + '</button>',
            'quote': '<button type="button" class="editor-action editor-action-quote" title="blockquote" data-action="append-blockquote" data-element="blockquote">' + buttonLabels.quote + '</button>',
            'orderedlist': '<button type="button" class="editor-action editor-action-orderedlist" title="ordered list" data-action="insertorderedlist" data-element="ol">' + buttonLabels.orderedlist + '</button>',
            'unorderedlist': '<button type="button" class="editor-action editor-action-unorderedlist" title="unordered list" data-action="insertunorderedlist" data-element="ul">' + buttonLabels.unorderedlist + '</button>',
            'pre': '<button type="button" class="editor-action editor-action-pre" data-action="append-pre" title="pre" data-element="pre">' + buttonLabels.pre + '</button>',
            'indent': '<button type="button" class="editor-action editor-action-indent" data-action="indent" title="indent" data-element="ul">' + buttonLabels.indent + '</button>',
            'outdent': '<button type="button" class="editor-action editor-action-outdent" data-action="outdent" title="outdent" data-element="ul">' + buttonLabels.outdent + '</button>',
            'justifyLeft': '<button type="button" class="editor-action editor-action-indent" title="justify left" data-action="justifyLeft" >' + buttonLabels.justifyLeft + '</button>',
            'justifyCenter': '<button type="button" class="editor-action editor-action-outdent" title="justify center" data-action="justifyCenter">' + buttonLabels.justifyCenter + '</button>',
            'justifyRight': '<button type="button" class="editor-action editor-action-outdent" title="justify right" data-action="justifyRight" >' + buttonLabels.justifyRight + '</button>'
          };

        return buttonTemplates[btnType] || false;
      },
      getButtonLabels: function (buttonLabelType) {
        var customButtonLabels,
          attrname,
          buttonLabels = {
            'bold': '<b>B</b>',
            'italic': '<b><i>I</i></b>',
            'underline': '<b><u>U</u></b>',
            'superscript': '<b>x<sup>1</sup></b>',
            'subscript': '<b>x<sub>1</sub></b>',
            'anchor': '<svg class="icon icon-link" viewBox="0 0 32 32"><use xlink:href="#icon-link"></svg>',
            'image': '<svg class="icon icon-image" viewBox="0 0 32 32"><use xlink:href="#icon-image"></svg>',
            'video': '<svg class="icon icon-video" viewBox="0 0 32 32"><use xlink:href="#icon-video"></svg>',
            'header1': '<b>H3</b>',
            'header2': '<b>H4</b>',
            'quote': '<svg class="icon icon-blockquote" viewBox="0 0 32 32"><use xlink:href="#icon-blockquote"></svg>',
            'orderedlist': '<svg class="icon icon-orderedlist" viewBox="0 0 32 32"><use xlink:href="#icon-orderedlist"></svg>',
            'unorderedlist': '<svg class="icon icon-unorderedlist" viewBox="0 0 32 32"><use xlink:href="#icon-unorderedlist"></svg>',
            'pre': '<b>0101</b>',
            'indent': '<b>&rarr;</b>',
            'outdent': '<b>&larr;</b>',
            'justifyLeft': '<svg class="icon icon-justify-left" viewBox="0 0 32 32"><use xlink:href="#icon-justify-left"></svg>',
            'justifyCenter': '<svg class="icon icon-justify-center" viewBox="0 0 32 32"><use xlink:href="#icon-justify-center"></svg>',
            'justifyRight': '<svg class="icon icon-justify-right" viewBox="0 0 32 32"><use xlink:href="#icon-justify-right"></svg>'
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

          if (action === 'anchor' || action === 'image' || action === 'video') {
            return;
          }

          if (self.selection === undefined) {
            self.checkSelection();
          }

          btn.toggleClass('is-active');
          if (btn.attr('data-action')) {
            self.execAction(btn.attr('data-action'), e);
          }

          self.element.focus();
          self.keepToolbarAlive = false;
        }).on('mousedown.editor', 'button', function () {
          self.keepToolbarAlive = true;
        });

        $('#editor-modal-url, #editor-modal-image').modal()
          .on('beforeOpen', function () {
            self.savedSelection = self.saveSelection();
            this.keepToolbarAlive = true;

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
            self.keepToolbarAlive = false;
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

        document.execCommand('createLink', false, input.val());
        if (settings.targetBlank) {
          this.setTargetBlank();
        }
        this.bindAnchorPreview();
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
            timer = '';

        this.selectionHandler = function (e) {
          if (settings.staticToolbar && $(e.currentTarget).hasClass('.editable') && self.toolbar.hasClass('is-active') && e.type !== 'blur') {
            self.keepToolbarAlive = true;
          } else {
            self.keepToolbarAlive = false;
          }
          clearTimeout(timer);
          timer = setTimeout(function () {
            self.checkSelection();
          }, settings.delay);
        };

        this.element.on('mouseup.editor', this.selectionHandler);
        this.element.on('keyup.editor', this.selectionHandler);
        this.element.on('blur.editor', function(e) {
          if (self.keepToolbarAlive) {
            return;
          }
          setTimeout(function() {
            if (settings.staticToolbar && !self.keepToolbarAlive) {
              self.keepToolbarAlive = false;
              self.hideToolbarActions();
              return;
            }
          }, 400);
          self.selectionHandler(e);
        });
        return this;
      },

      checkSelection: function () {
        var newSelection,
            selectionElement;

        if (this.keepToolbarAlive !== true) {
          newSelection = window.getSelection();
          if (newSelection.toString().trim() === '') {

            if (settings.staticToolbar) {
              this.setToolbarPosition().showToolbarActions();
              return;
            }

            this.hideToolbarActions();
            return;
          }

          selectionElement = this.getSelectionElement();
          if (!selectionElement) {
              this.hideToolbarActions();
          } else {
            this.checkSelectionElement(newSelection, selectionElement);
          }
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
      this.selection = newSelection;
      this.selectionRange = this.selection.getRangeAt(0);

      if (this.element[0] === selectionElement) {
        this.setToolbarButtonStates()
            .setToolbarPosition()
            .showToolbarActions();
        return;
      }
      this.hideToolbarActions();
    },

    setToolbarPosition: function () {
      var buttonHeight = 40,
          selection = window.getSelection(),
          range = selection.getRangeAt(0),
          boundary = range.getBoundingClientRect(),
          defaultLeft = (settings.diffLeft) - (this.toolbar[0].offsetWidth / 2),
          middleBoundary = (boundary.left + boundary.right) / 2,
          editorPos = this.element.position(),
          halfOffsetWidth = this.toolbar[0].offsetWidth / 2;

      if (boundary.top < buttonHeight) {
          this.toolbar.addClass('toolbar-arrow-over').removeClass('toolbar-arrow-under');
          this.toolbar.css('top', buttonHeight + boundary.bottom - settings.diffTop + window.pageYOffset - this.toolbar[0].offsetHeight + 'px');
      } else {
          this.toolbar.addClass('toolbar-arrow-under').removeClass('toolbar-arrow-over');
          this.toolbar.css('top', boundary.top + settings.diffTop + window.pageYOffset - this.toolbar[0].offsetHeight + 'px');
      }
      if (middleBoundary < halfOffsetWidth) {
          this.toolbar.css('left', defaultLeft + halfOffsetWidth + 'px');
      } else if ((window.innerWidth - middleBoundary) < halfOffsetWidth) {
          this.toolbar.css('left', window.innerWidth + defaultLeft - halfOffsetWidth + 'px');
      } else {
          this.toolbar.css('left', defaultLeft + middleBoundary + 'px');
      }

      //Show on the top and hide the arrow
      if (settings.staticToolbar) {
        this.toolbar.removeClass('toolbar-arrow-over').removeClass('toolbar-arrow-under');
        this.toolbar.css({'left': editorPos.left, 'top': editorPos.top - this.toolbar.outerHeight()});
      }

      return this;
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
      this.keepToolbarAlive = false;
      if (this.toolbar !== undefined) {
        this.toolbar.removeClass('is-active');
      }
    },

    //Show Toolbar
    showToolbarActions: function () {
      var self = this,
          timer;

      this.toolbarActions.show();
      this.keepToolbarAlive = false;
      clearTimeout(timer);

      timer = setTimeout(function () {
        self.toolbar.addClass('is-active');
      }, 100);
    },


    //Handle Pasted In Text
    bindPaste: function () {
      var self = this;

      this.pasteWrapper = function (e) {
          var paragraphs,
              html = '',
              p;

          if (!settings.forcePlainText) {
              return this;
          }

          if (e.clipboardData && e.clipboardData.getData && !e.defaultPrevented) {
            e.preventDefault();
            paragraphs = e.clipboardData.getData('text/plain').split(/[\r\n]/g);
            for (p = 0; p < paragraphs.length; p += 1) {
                if (paragraphs[p] !== '') {
                    if (navigator.userAgent.match(/firefox/i) && p === 0) {
                        html += self.htmlEntities(paragraphs[p]);
                    } else {
                        html += '<p>' + self.htmlEntities(paragraphs[p]) + '</p>';
                    }
                }
            }
            document.execCommand('insertHTML', false, html);
          }
      };

     this.element[0].addEventListener('paste', this.pasteWrapper); //doesnt work as jQuery?
     return this;
    },

    htmlEntities: function (str) {
        // converts special characters (like <) into their escaped/encoded values (like &lt;).
        // This allows you to show to display the string without the browser reading it as HTML.
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },

    bindWindowActions: function () {
        var timerResize,
            self = this;

        this.windowResizeHandler = function () {
            clearTimeout(timerResize);
            timerResize = setTimeout(function () {
                if (self.toolbar && self.toolbar.hasClass('is-active')) {
                    self.setToolbarPosition();
                }
            }, 100);
        };

        $(window).on('resize.editor', this.windowResizeHandler);

        //Attach Label
        this.element.prev('.label').css('cursor', 'default').on('click.editor', function (){
          self.element.focus();
        });
        self.element.attr('aria-label', this.element.prev('.label').text());
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
        if (action.indexOf('append-') > -1) {
            this.execFormatBlock(action.replace('append-', ''));
            this.setToolbarPosition();
            this.setToolbarButtonStates();
        } else if (action === 'anchor') {
            //this.triggerAnchorAction(e);
        } else if (action === 'image') {
            this.insertImage();
        } else {
            document.execCommand(action, false, null);
            this.setToolbarPosition();
        }
      },

      insertImage: function (url) {
        document.execCommand('insertImage', false, url);
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
        //  blockquote needs to be called as indent
        // http://stackoverflow.com/questions/10741831/execcommand-formatblock-headings-in-ie
        // http://stackoverflow.com/questions/1816223/rich-text-editor-with-blockquote-function/1821777#1821777
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

      destroy: function () {
        $('html').off('mouseup.editor');
        $(window).on('resize.editor');
        $.removeData(this.obj, pluginName);
      }
    };

    // Make it plugin protecting from double initialization
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });

  };
})(jQuery);
/**
* Responsive Tab Control
* @name Tabs
* @param {string} propertyName - The Name of the Property
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

  $.fn.dropdown = function(options, args) {

    // Dropdown Settings and Options
    var pluginName = 'dropdown',
        defaults = {
          editable: 'false',
          source: null  //A function that can do an ajax call.
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Actual DropDown Code
    Plugin.prototype = {
      init: function() {

        var id = this.element.attr('id')+'-shdo'; //The Shadow Input Element. We use the dropdown to serialize.
        this.isHidden = this.element.is('visible');
        this.element.hide();
        this.orgLabel = $('label[for="' + this.element.attr('id') + '"]');

        this.label = $('<label class="label"></label>').attr('for', id).text(this.orgLabel.text());
        this.input = $('<input type="text" readonly class="dropdown" tabindex="0"/>').attr({'role': 'combobox'})
                        .attr({'aria-autocomplete': 'none', 'aria-owns': 'dropdown-list'})
                        .attr({'aria-readonly': 'true', 'aria-activedescendant': 'dropdown-opt16'})
                        .attr('id', id);

        if (this.orgLabel.length === 1 && this.orgLabel.closest('table').length ===1) {
          this.element.after(this.input, this.trigger);
          this.orgLabel.after(this.label);
        } else if (this.orgLabel.length === 1) {
          this.element.after(this.label, this.input, this.trigger);
        } else {
          this.element.after(this.input, this.trigger);
        }
        this.updateList();
        this.setValue();
        this.setInitial();
        this.setWidth();
        this.orgLabel.hide();
        this.bindEvents();
      },
      setWidth: function() {
        var style = this.element[0].style,
          labelStyle = (this.orgLabel[0] === undefined ? null : this.orgLabel[0].style);

        if (style.width) {
          this.input.width(style.width);
        }
        if (style.position === 'absolute') {
          this.input.css({position: 'absolute', left: style.left, top: style.top, bottom: style.bottom, right: style.right});
        }
        if (labelStyle && labelStyle.position === 'absolute') {
          this.label.css({position: 'absolute', left: labelStyle.left, top: labelStyle.top, bottom: labelStyle.bottom, right: labelStyle.right});
        }
      },
      updateList: function() {
        var self = this;
        //Keep a list generated and append it when we need to.
        self.list = $('<ul id="dropdown-list" class="dropdown-list" tabindex="-1" aria-expanded="true"></ul>');

        self.element.find('option').each(function(i) {
          var option = $(this),
              listOption = $('<li id="list-option'+ i +'" role="option" class="dropdown-option" role="listitem" tabindex="-1">'+ option.html() + '</li>');

          self.list.append(listOption);
          if (option.is(':selected')) {
            listOption.addClass('is-selected');
          }

          //Image Support
          if (option.attr('class')) {
            listOption.addClass(option.attr('class'));
          }
          //Special Data Attribute
          if (option.attr('data-attr')) {
            listOption.attr('data-attr', option.attr('data-attr'));
          }
          //Tooltip Support
          if (option.attr('title') && $.fn.tooltip) {
            listOption.attr('title', option.attr('title')).tooltip();
          }
        });
      },
      setValue: function () {
        //Set initial values for the edit box
       this.input.val(this.element.find('option:selected').text());
      },
      setInitial: function() {

       if (this.element.hasClass('backgroundColor')) {
        this.input.addClass('backgroundColor');
       }
       if (this.orgLabel.hasClass('noColon')) {
        this.label.addClass('noColon');
       }
       if (this.orgLabel.hasClass('scr-only')) {
        this.label.addClass('scr-only');
       }
       if (this.orgLabel.attr('style')) {
        this.label.attr('style', this.orgLabel.attr('style'));
       }
       if (this.element.is(':disabled')) {
        this.input.attr('disabled','');
       }
       if (this.element.is('[readonly]')) {
        this.input.addClass('is-readonly');
       }
       if (this.isHidden) {
        this.input.hide().prev('label').hide();
       }
      },
      bindEvents: function() {
        var self = this,
          timer, buffer = '';

        //Bind mouse and key events
        this.input.on('keydown.dropdown', function(e) {
          if (self.element.is(':disabled') || self.input.hasClass('is-readonly')) {
            return;
          }

          self.handleKeyDown($(this), e);
        }).on('keypress.dropdown', function(e) {
          var charCode = e.charCode || e.keyCode;
          //Needed for browsers that use keypress events to manipulate the window.
          if (e.altKey && (charCode === 38 || charCode === 40)) {
            e.stopPropagation();
            return false;
          }

          if (self.element.is(':disabled') || self.input.hasClass('is-readonly')) {
            return;
          }


          //Printable Chars Jump to first high level node with it...
          if (e.which !== 0) {
            var term = String.fromCharCode(e.which);

            buffer += term.toLowerCase();
            clearTimeout(timer);
            timer = setTimeout(function () {
              $.each(self.element[0].options, function () {
               var opt = $(this);
               if (buffer !== '' && opt.text().substr(0, buffer.length).toLowerCase() === buffer) {
                 buffer = '';
                 self.selectOption(opt);
                 return false;
               }
              });
              buffer = '';
            }, 200);
          }
          return true;
        }).on('mouseup.dropdown', function(e) {
          if (e.button === 2) {
            return;
          }
          self.toggleList();
        });

        self.element.on('activate', function () {
          self.activate();
        }).on('updated', function () {
          self.closeList();
          self.updateList();
          self.setValue();
        });
      },
      activate: function () {
        this.input.focus();
        if (this.input[0].setSelectionRange) {
          this.input[0].setSelectionRange(0, 0);  //scroll to left
        }
      },
      open: function() {
        //Prep for opening list,make ajax call ect...
        var self = this;

        if (this.element.is(':disabled') || this.input.hasClass('is-readonly')) {
          return;
        }

        if (settings.source) {
          var response = function (data) {
            //to do - no results back do not open.
            var list = '';

            //populate
            self.element.empty();
            for (var i=0; i < data.length; i++) {
              var id = (data[i].id === undefined ? data[i].value : data[i].id);
              list += '<option id="' + id + '">' + data[i].label + '</option>';
            }
            self.element.append(list);
            self.updateList();
            self.input.removeClass('is-busy');
            self.openList();
            return;
          };

          //show indicator
          this.input.addClass('is-busy');
          //make ajax call
          settings.source(this.input.val(), response);
          return;
        }
        this.openList();
      },
      openList: function () {
      //Actually Open The List
        var current = this.list.find('.is-selected'),
            self =  this;

        $('#dropdown-list').remove(); //remove old ones
        this.list.appendTo('body').show().attr('aria-expanded', 'true');

        this.position();

        this.scrollToOption(current);
        this.input.addClass('is-open');

        self.list.on('click.list', 'li', function () {
          var idx = $(this).index(),
              cur = $(self.element[0].options[idx]);

          // select the clicked item
          self.selectOption(cur);
          self.activate();
          self.closeList();
        });

        $(document).on('click.dropdown', function(e) {
          var target = $(e.target);
          if (target.is('.dropdown-option') || target.is('.dropdown')) {
            return;
          }
          self.closeList();
        }).on('resize.dropdown', function() {
          self.closeList();
        }).on('scroll.dropdown', function() {
          self.closeList();
        });
      },
      position: function() {
        var isFixed = false, isAbs = false,
          top = this.input[0].offsetTop + this.input.outerHeight();

        this.list.css({'top': top, 'left': this.input.offset().left});

        //Fixed and Absolute Positioning use cases
        this.input.parentsUntil('body').each(function () {
          if ($(this).css('position') === 'fixed') {
            isFixed = true;
            return;
          }
        });

        if (isFixed) {
          this.list.css('position', 'fixed');
        }

        if (this.input.parent('.field').css('position') === 'absolute') {
          isAbs = true;
          this.list.css({'top': this.input.parent('.field').offset().top + this.input.prev('label').height() , 'left': this.input.parent('.field').offset().left});
        }

        //Flow up if not enough room on bottom
        //TODO Test $(window).height() vs $(document).height());
        if (top - $(window).scrollTop() + this.list.outerHeight() > $(window).height()) {
          this.list.css({'top': top - this.list.outerHeight() - this.input.outerHeight()});
        }

        //let grow or to field size.
        if (this.list.width() > this.input.outerWidth()) {
           this.list.css('width', '');
           this.list.css({'width': this.list.outerWidth() + 10});
        } else {
           this.list.width(this.input.outerWidth());
        }
      },
      closeList: function() {
        this.list.hide().attr('aria-expanded', 'false').remove();
        this.list.off('click.list').off('mousewheel.list');
        this.input.removeClass('is-open');
        $(document).off('click.dropdown resize.dropdown scroll.dropdown');
      },
      scrollToOption: function(current) {
        var self = this;
        if (!current) {
          return;
        }
        if (current.length === 0) {
          return;
        }
        // scroll to the currently selected option
        self.list.scrollTop(0);
        self.list.scrollTop(current.offset().top - self.list.offset().top - self.list.scrollTop());
      },
      handleBlur: function() {
        var self = this;

        if (this.isOpen()) {
          this.timer = setTimeout(function() {
            self.closeList();
          }, 40);
        }

        return true;
      },
      handleKeyDown: function(input, e) {
        var selectedIndex = this.element[0].selectedIndex,
            selectedText = this.element.val(),
            options = this.element[0].options,
            self = this;

        if (e.altKey && (e.keyCode === 38 || e.keyCode === 40)) {
          self.toggleList();
          e.stopPropagation();
          return false;
        }
        switch (e.keyCode) {
          case 8:    //backspace could clear
          case 46: { //del
            // prevent the edit box from being changed
            this.input.val(selectedText);
            e.stopPropagation();
            return false;
          }
          case 9: {  //tab - save the current selection

            this.selectOption($(options[selectedIndex]));
            this.activate();
            if (self.isOpen()) {  // Close the option list
              self.closeList(false);
            }

            // allow tab to propagate
            return true;
          }
          case 27: { //Esc - Close the Combo and Do not change value
            if (self.isOpen()) {
              // Close the option list
              self.closeList(true);
            }

            e.stopPropagation();
            return false;
          }
          case 13: {  //enter

            if (self.isOpen()) {
              e.preventDefault();
              self.selectOption($(options[selectedIndex])); // store the current selection
              self.closeList(false);  // Close the option list
              self.activate();
            }

            e.stopPropagation();
            return false;
          }
          case 38: {  //up

            if (selectedIndex > 0) {
              var prev = $(options[selectedIndex - 1]);
              this.selectOption(prev);
            }

            e.stopPropagation();
            e.preventDefault();
            return false;
          }
          case 40: {  //down

            if (selectedIndex < options.length - 1) {
              var next = $(options[selectedIndex + 1]);
              this.selectOption(next);
            }

            e.stopPropagation();
            e.preventDefault();
            return false;
          }
          case 35: { //end
            var last = $(options[options.length - 1]);
            this.selectOption(last);

            e.stopPropagation();
            return false;
          }
          case 36: {  //home
            var first = $(options[0]);
            this.selectOption(first);

            e.stopPropagation();
            return false;
          }
        }

        return true;
      },
      isOpen: function() {
        return this.list.is(':visible');
      },
      toggleList: function() {
        if (this.isOpen()) {
          this.closeList();
        } else {
          this.open();
        }
      },
      selectOption: function(option) {
        var code = option.val(),
          oldVal = this.input.val();

        if (option === this.element[0].selectedIndex) {
          return;
        }

        if (this.isOpen()) {
          // remove the selected class from the current selection
          this.list.find('.is-selected').removeClass('is-selected');
          var listOption = this.list.find('#list-option'+option.index());
          listOption.addClass('is-selected');

          // Set activedescendent for new option
          this.input.attr('aria-activedescendant', listOption.attr('id'));
          this.scrollToOption(listOption);
        }
        this.input.val(option.text()); //set value and active descendent

        if (this.element.find('[value="' + code + '"]').length > 0) {
          this.element.find('[value="' + code + '"]')[0].selected = true;
        }

        if (oldVal !== option.text()) {
          this.element.val(code).trigger('change');
        }

      },
      setCode: function(code) {
        var option = this.element.find('[value="' + code + '"]');
        this.selectOption(option);
      },
      destroy: function() {
        this.element.removeData(pluginName);
        this.closeList();
        this.input.prev('label').remove();
        this.input.off().remove();
        this.element.show().prev('label').show();
      }
    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        if (typeof instance[options] === 'function') {
          instance[options](args);
        }
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
/*
 *  Originally Forked From
 *  Kinetic drag for mobile/desktop. http://pep.briangonzalez.org
 *
 *  Copyright (c) 2014 Brian Gonzalez
 *  Licensed under the MIT license.
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {


  //  create the defaults once
  var pluginName = 'draggable';
  var defaults   = {

    // Options
    // ----------------------------------------------------------------------------------------------
    // See ** https://github.com/briangonzalez/jquery.pep.js ** for fully documented options.
    // It was too hard to manage options here and in the readme.
    // ----------------------------------------------------------------------------------------------
    initiate:                       function(){},
    start:                          function(){},
    drag:                           function(){},
    stop:                           function(){},
    easing:                         function(){},
    rest:                           function(){},
    moveTo:                         false,
    callIfNotStarted:               ['stop', 'rest'],
    startThreshold:                 [0,0],
    grid:                           [1,1],
    activeClass:                    'is-active',
    multiplier:                     1,
    velocityMultiplier:             2.5,
    shouldPreventDefault:           true,
    allowDragEventPropagation:      true,
    stopEvents:                     '',
    hardwareAccelerate:             true,
    useCSSTranslation:              true,
    disableSelect:                  true,
    cssEaseString:                  'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
    cssEaseDuration:                1000,
    shouldEase:                     true,
    droppable:                      false,
    droppableActiveClass:           'is-droppableto',
    constrainTo:                    false,
    removeMargins:                  false,
    place:                          true,
    axis:                           null,
    forceNonCSS3Movement:           false,
    elementsWithInteraction:        'input',
    revert:                         false,
    revertAfter:                    'stop',
    revertIf:                       function(){ return true; },
    ignoreRightClick:               true
  };

  //  ---------------------------------
  //  -----  Our main Pep object  -----
  //  ---------------------------------
  function Pep( el, options) {

    this.name = pluginName;

    // reference to our DOM object
    // and it's jQuery equivalent.
    this.el  = el;
    this.$el = $(el);

    //  merge in defaults
    this.options    = $.extend( {}, defaults, options) ;

    // store document/body so we don't need to keep grabbing them
    // throughout the code
    this.$document  = $(this.$el[0].ownerDocument);
    this.$body      = this.$document.find('body');

    //  Create our triggers based on touch/click device
    this.moveTrigger        = 'MSPointerMove touchmove mousemove';
    this.startTrigger       = 'MSPointerDown touchstart mousedown';
    this.stopTrigger        = 'MSPointerUp touchend mouseup';
    this.startTriggerArray  = this.startTrigger.split(' ');
    this.moveTriggerArray   = this.moveTrigger.split(' ');
    this.stopTriggerArray   = this.stopTrigger.split(' ');
    this.stopEvents         = [ this.stopTrigger, this.options.stopEvents ].join(' ');

    if (this.options.constrainTo === 'window') {
      this.$container = this.$document;
    }
    else if (this.options.constrainTo && (this.options.constrainTo !== 'parent')) {
      this.$container = $(this.options.constrainTo);
    }
    else {
      this.$container = this.$el.parent();
    }

    // IE needs this
    if (this.isPointerEventCompatible()) {
      this.applyMSDefaults();
    }

    this.CSSEaseHash    = this.getCSSEaseHash();
    this.scale          = 1;
    this.started        = false;
    this.disabled       = false;
    this.activeDropRegions = [];
    this.resetVelocityQueue();

    this.init();
    return this;
  }

  //  init();
  //    initialization logic
  //    you already have access to the DOM el and the options via the instance,
  //    e.g., this.el and this.options
  Pep.prototype.init = function () {

    if (this.options.disableSelect) {
      this.disableSelect();
    }

    // position the parent & place the object, if necessary.
    if (this.options.place) {
      this.positionParent();
      this.placeObject();
    }

    this.ev = {};       // to store our event movements
    this.pos = {};      // to store positions
    this.subscribe();
  };

  //  subscribe();
  //    useful in the event we want to programmatically
  //    interact with our Pep object.
  //      e.g.:     $('#pep').trigger('stop')
  Pep.prototype.subscribe = function () {
    var self = this;

    // Subscribe to our start event
    this.onStartEvent = function(ev){ self.handleStart(ev); };
    this.$el.on(this.startTrigger, this.onStartEvent);

    // Prevent start events from being gobbled by elements that should allow user interaction
    this.onStartEventOnElementsWithInteraction = function(ev){ ev.stopPropagation(); };
    this.$el.on(
      this.startTrigger,
      this.options.elementsWithInteraction,
      this.onStartEventOnElementsWithInteraction
   );

    // Subscribe to our stop event
    this.onStopEvents = function(ev) { self.handleStop(ev); };
    this.$document.on(this.stopEvents, this.onStopEvents);

    // Subscribe to our move event
    this.onMoveEvents = function(ev){ self.moveEvent = ev; };
    this.$document.on(this.moveTrigger, this.onMoveEvents);
  };

  Pep.prototype.unsubscribe = function() {
    this.$el.off(this.startTrigger, this.onStartEvent);
    this.$el.off(
      this.startTrigger,
      this.options.elementsWithInteraction,
      this.onStartEventOnElementsWithInteraction
   );
    this.$document.off(this.stopEvents, this.onStopEvents);
    this.$document.off(this.moveTrigger, this.onMoveEvents);
  };

  //  handleStart();
  //    once this.startTrigger occurs, handle all of the logic
  //    that must go on. This is where Pep's heavy lifting is done.
  Pep.prototype.handleStart = function(ev) {
    var self = this;

            // only continue chugging if our start event is a valid move event.
            if (this.isValidMoveEvent(ev) && !this.disabled){

              if (ev.which !== 3) {

                    // IE10 Hack. Me not happy.
                    if (this.isPointerEventCompatible() && ev.preventManipulation) {
                      ev.preventManipulation();
                    }

                    // normalize event
                    ev = this.normalizeEvent(ev);

                    // hardware accelerate, if necessary.
                    if (this.options.hardwareAccelerate && !this.hardwareAccelerated) {
                      this.hardwareAccelerate();
                      this.hardwareAccelerated = true;
                    }

                    // fire user's initiate event.
                    var shouldContinue = this.options.initiate.call(this, ev, this);
                    this.$el.trigger('initiate', [this, ev, this]);
                    if (shouldContinue === false) {
                      return;
                    }

                    // cancel the rest timeout
                    clearTimeout( this.restTimeout);

                    // add active class and reset css animation, if necessary
                    this.$el.addClass( this.options.activeClass);
                    this.removeCSSEasing();

                    // store event's x & y values for later use
                    this.startX = this.ev.x = ev.pep.x;
                    this.startY = this.ev.y = ev.pep.y;

                    // store initial offset.
                    this.initialPosition = this.initialPosition || this.$el.position();

                    // store the initial touch/click event, used to calculate the inital delta values.
                    this.startEvent = this.moveEvent = ev;

                    // make object active, so watchMoveLoop starts looping.
                    this.active     = true;

                    // preventDefault(), is necessary
                    if (this.options.shouldPreventDefault) {
                      ev.preventDefault();
                    }

                    // allow / disallow event bubbling
                    if (!this.options.allowDragEventPropagation) {
                      ev.stopPropagation();
                    }

                    // animation loop to ensure we don't fire
                    // too many unneccessary repaints
                    (function watchMoveLoop(){
                        if (!self.active) {
                          return;
                        }
                        self.handleMove();
                        self.requestAnimationFrame( watchMoveLoop );
                    })(self);

                    (function watchEasingLoop(){
                        if (self.easing) {
                          self.options.easing.call(self, null, self);
                          self.$el.trigger('easing', [self, null, self]);
                        }
                        self.requestAnimationFrame( watchEasingLoop );
                    })(self);
              }
            }
  };

  //  handleMove();
  //    the logic for when the move events occur
  Pep.prototype.handleMove = function() {

            // setup our event object
            if (typeof(this.moveEvent) === 'undefined') {
              return;
            }

            // get our move event's x & y
            var ev      = this.normalizeEvent( this.moveEvent);
            var curX    = window.parseInt(ev.pep.x / this.options.grid[0]) * this.options.grid[0];
            var curY    = window.parseInt(ev.pep.y / this.options.grid[1]) * this.options.grid[1];

            // last in, first out (LIFO) queue to help us manage velocity
            this.addToLIFO( { time: ev.timeStamp, x: curX, y: curY });

            // calculate values necessary to moving
            var dx, dy;

            if ($.inArray( ev.type, this.startTriggerArray) > -1 ){
              dx = 0;
              dy = 0;
            } else{
              dx = curX - this.ev.x;
              dy = curY - this.ev.y;
            }

            this.dx   = dx;
            this.dy   = dy;
            this.ev.x = curX;
            this.ev.y = curY;

            // no movement in either direction -- so return
            if (dx === 0 && dy === 0){
              return;
            }

            // check if object has moved past X/Y thresholds
            // if so, fire users start event
            var initialDx  = Math.abs(this.startX - curX);
            var initialDy  = Math.abs(this.startY - curY);
            if (!this.started && (initialDx > this.options.startThreshold[0] || initialDy > this.options.startThreshold[1])){
              this.started = true;
              this.$el.addClass('pep-start');
              this.options.start.call(this, this.startEvent, this);
              this.$el.trigger('start', [this, this.startEvent, this]);
            }

            // Calculate our drop regions
            if (this.options.droppable) {
              this.calculateActiveDropRegions();
            }

            // fire user's drag event.
            var continueDrag = this.options.drag.call(this, ev, this);
            this.$el.trigger('drag', [this, ev, this]);

            if (continueDrag === false) {
              this.resetVelocityQueue();
              return;
            }

            this.doMoveTo(dx, dy);
  };

  Pep.prototype.doMoveTo = function(dx, dy) {
    var hash = this.handleConstraint(dx, dy);
    var xOp, yOp;

    // if using not using CSS transforms, move object via absolute position
    if (typeof this.options.moveTo === 'function') {
      xOp     = (dx >= 0) ? '+=' + Math.abs(dx/this.scale)*this.options.multiplier : '-=' + Math.abs(dx/this.scale)*this.options.multiplier;
      yOp     = (dy >= 0) ? '+=' + Math.abs(dy/this.scale)*this.options.multiplier : '-=' + Math.abs(dy/this.scale)*this.options.multiplier;

      if (this.options.constrainTo) {
        xOp = (hash.x !== false) ? hash.x : xOp;
        yOp = (hash.y !== false) ? hash.y : yOp;
      }

      // only move along single axis, if necessary
      if (this.options.axis  === 'x') {
        yOp = hash.y;
      }
      if (this.options.axis  === 'y') {
        xOp = hash.x;
      }
      this.options.moveTo.call(this, xOp, yOp);
    } else if (!this.shouldUseCSSTranslation()){
      xOp     = (dx >= 0) ? '+=' + Math.abs(dx/this.scale)*this.options.multiplier : '-=' + Math.abs(dx/this.scale)*this.options.multiplier;
      yOp     = (dy >= 0) ? '+=' + Math.abs(dy/this.scale)*this.options.multiplier : '-=' + Math.abs(dy/this.scale)*this.options.multiplier;

      if (this.options.constrainTo) {
        xOp = (hash.x !== false) ? hash.x : xOp;
        yOp = (hash.y !== false) ? hash.y : yOp;
      }

      // only move along single axis, if necessary
      if (this.options.axis  === 'x') {
        yOp = hash.y;
      }
      if (this.options.axis  === 'y') {
        xOp = hash.x;
      }
      this.moveTo(xOp, yOp);
    }
    else {

      dx = (dx/this.scale)*this.options.multiplier;
      dy = (dy/this.scale)*this.options.multiplier;

      if (this.options.constrainTo) {
        dx = (hash.x === false) ? dx : 0 ;
        dy = (hash.y === false) ? dy : 0 ;
      }

      // only move along single axis, if necessary
      if (this.options.axis  === 'x') {
        dy = 0;
      }
      if (this.options.axis  === 'y') {
        dx = 0;
      }
      this.moveToUsingTransforms( dx, dy);
    }
  };

  //  handleStop();
  //    the logic for when the stop events occur
  Pep.prototype.handleStop = function(ev) {

    // no need to handle stop event if we're not active
    if (!this.active) {
      return;
    }

    // make object inactive, so watchMoveLoop returns
    this.active = false;

    // make object easing.
    this.easing = true;

    // remove our start class
    this.$el.removeClass('pep-start')
            .addClass('pep-ease');

    // Calculate our drop regions
    if (this.options.droppable) {
      this.calculateActiveDropRegions();
    }

    // fire user's stop event.
    if (this.started || (!this.started &&  $.inArray('stop', this.options.callIfNotStarted) > -1)) {
      this.options.stop.call(this, ev, this);
      this.$el.trigger('stop', [ev, this]);
    }

    // ease the object, if necessary.
    if (this.options.shouldEase) {
      this.ease(ev, this.started);
    } else {
      this.removeActiveClass();
    }

    if (this.options.revert && (this.options.revertAfter === 'stop' || !this.options.shouldEase) && (this.options.revertIf && this.options.revertIf.call(this))) {
      this.revert();
    }

    // this must be set to false after
    // the user's stop event is called, so the dev
    // has access to it.
    this.started = false;

    // reset the velocity queue
    this.resetVelocityQueue();

  };

  //  ease();
  //    used in conjunction with the LIFO queue
  //    to ease the object after stop
  Pep.prototype.ease = function(ev, started){

    var vel       = this.velocity();
    var x         = (vel.x/this.scale) * this.options.multiplier;
    var y         = (vel.y/this.scale) * this.options.multiplier;

    var hash      = this.handleConstraint(x, y, true);

    // ✪  Apply the CSS3 animation easing magic  ✪
    if (this.cssAnimationsSupported()) {
      this.$el.css( this.getCSSEaseHash());
    }

    var xOp = (vel.x > 0) ? '+=' + x : '-=' + Math.abs(x);
    var yOp = (vel.y > 0) ? '+=' + y : '-=' + Math.abs(y);

    if (this.options.constrainTo) {
      xOp = (hash.x !== false) ? hash.x : xOp;
      yOp = (hash.y !== false) ? hash.y : yOp;
    }

    if (this.options.axis  === 'x')  {
      yOp = '+=0';
    }
    if (this.options.axis  === 'y') {
      xOp = '+=0';
    }

    // ease it via JS, the last true tells it to animate.
    var jsAnimateFallback = !this.cssAnimationsSupported() || this.options.forceNonCSS3Movement;
    if (typeof this.options.moveTo === 'function') {
      this.options.moveTo.call(this, xOp, yOp);
    } else {
      this.moveTo(xOp, yOp, jsAnimateFallback);
    }

    // when the rest occurs, remove active class and call
    // user's rest event.
    var self = this;
    this.restTimeout = setTimeout( function(){

      // Calculate our drop regions
      if (self.options.droppable) {
        self.calculateActiveDropRegions();
      }

      self.easing = false;

      // call users rest event.
      if (started || (!started && $.inArray('rest', self.options.callIfNotStarted) > -1)) {
        self.options.rest.call(self, ev, self);
        self.$el.trigger('rest', [self, ev, self]);
      }

      if (self.options.revert && (self.options.revertAfter === 'ease' && self.options.shouldEase) && (self.options.revertIf && self.options.revertIf.call(self))) {
        self.revert();
      }

      // remove active class
      self.removeActiveClass();

    }, this.options.cssEaseDuration);

  };

  // normalizeEvent()
  Pep.prototype.normalizeEvent = function(ev) {
      ev.pep        = {};

      if (this.isPointerEventCompatible() || !this.isTouch(ev)) {

        if (ev.pageX ) {
          ev.pep.x      = ev.pageX;
          ev.pep.y      = ev.pageY;
        } else {
          ev.pep.x      = ev.originalEvent.pageX;
          ev.pep.y      = ev.originalEvent.pageY;
        }

        ev.pep.type   = ev.type;

      }
      else {
        ev.pep.x      = ev.originalEvent.touches[0].pageX;
        ev.pep.y      = ev.originalEvent.touches[0].pageY;
        ev.pep.type   = ev.type;
      }

       return ev;
   };

  // resetVelocityQueue()
  //
  Pep.prototype.resetVelocityQueue = function() {
    this.velocityQueue = new Array(5);
  };

  //  moveTo();
  //    move the object to an x and/or y value
  //    using jQuery's .css function -- this fxn uses the
  //    .css({top: '+=20', left: '-=30'}) syntax
  Pep.prototype.moveTo = function(x,y, animate) {

    if (animate) {
      this.$el.animate({ top: y, left: x }, 0, 'easeOutQuad', {queue: false});
    } else{
      this.$el.stop(true, false).css({ top: y , left: x });
    }

  };

  //  moveToUsingTransforms();
  //    move the object to an x and/or y value
  Pep.prototype.moveToUsingTransforms = function(x,y) {

    // Check for our initial values if we don't have them.
    var matrixArray  = this.matrixToArray( this.matrixString());
    if (!this.cssX) {
      this.cssX = this.xTranslation( matrixArray);
    }

    if (!this.cssY) {
      this.cssY = this.yTranslation( matrixArray);
    }

    // CSS3 transforms are additive from current position
    this.cssX = this.cssX + x;
    this.cssY = this.cssY + y;

    matrixArray[4]    = this.cssX;
    matrixArray[5]    = this.cssY;

    this.translation  = this.arrayToMatrix( matrixArray);
    this.transform( this.translation);
  };

  Pep.prototype.transform = function(value) {
    this.$el.css({
        '-webkit-transform': value,
           '-moz-transform': value,
            '-ms-transform': value,
             '-o-transform': value,
                'transform': value  });
  };

  Pep.prototype.xTranslation = function(matrixArray) {
    matrixArray  = matrixArray || this.matrixToArray( this.matrixString());
    return parseInt(matrixArray[4], 10);
  };

  Pep.prototype.yTranslation = function(matrixArray) {
    matrixArray  = matrixArray || this.matrixToArray( this.matrixString());
    return parseInt(matrixArray[5], 10);
  };


  // 3 helper functions for working with the
  // objects CSS3 transforms
  // matrixString
  // matrixToArray
  // arrayToMatrix
  Pep.prototype.matrixString = function() {

    var validMatrix = function(o){
      return !( !o || o === 'none' || o.indexOf('matrix') < 0 );
    };

    var matrix = 'matrix(1, 0, 0, 1, 0, 0)';

    if (validMatrix( this.$el.css('-webkit-transform'))) {
      matrix = this.$el.css('-webkit-transform');
    }

    if (validMatrix( this.$el.css('-moz-transform'))) {
      matrix = this.$el.css('-moz-transform');
    }

    if (validMatrix( this.$el.css('-ms-transform'))) {
      matrix = this.$el.css('-ms-transform');
    }

    if (validMatrix( this.$el.css('-o-transform'))) {
      matrix = this.$el.css('-o-transform');
    }

    if (validMatrix( this.$el.css('transform'))) {
      matrix = this.$el.css('transform');
    }

    return matrix;
  };

  Pep.prototype.matrixToArray = function(str) {
      return str.split('(')[1].split(')')[0].split(',');
  };

  Pep.prototype.arrayToMatrix = function(array) {
      return 'matrix(' +  array.join(',')  + ')';
  };

  //  addToLIFO();
  //    a Last-In/First-Out array of the 5 most recent
  //    velocity points, which is used for easing
  Pep.prototype.addToLIFO = function(val){
    // last in, first out
    var arr = this.velocityQueue;
    arr = arr.slice(1, arr.length);
    arr.push(val);
    this.velocityQueue = arr;
  };

  //  velocity();
  //    using the LIFO, calculate velocity and return
  //    velocity in each direction (x & y)
  Pep.prototype.velocity = function(){
    var sumX = 0;
    var sumY = 0;

    for (var i = 0; i < this.velocityQueue.length -1; i++ ){
      if (this.velocityQueue[i]){
        sumX        += (this.velocityQueue[i+1].x - this.velocityQueue[i].x);
        sumY        += (this.velocityQueue[i+1].y - this.velocityQueue[i].y);
        this.dt     = (this.velocityQueue[i+1].time - this.velocityQueue[i].time);
      }
    }

    // return velocity in each direction.
    return { x: sumX*this.options.velocityMultiplier, y: sumY*this.options.velocityMultiplier};
  };

  Pep.prototype.revert = function() {
    if (this.shouldUseCSSTranslation()){
      this.moveToUsingTransforms(-this.xTranslation(),-this.yTranslation());
    }

    this.moveTo(this.initialPosition.left, this.initialPosition.top);
  };

  //  requestAnimationFrame();
  //    requestAnimationFrame Polyfill
  //    More info:
  //    http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  Pep.prototype.requestAnimationFrame = function(callback) {
    return  window.requestAnimationFrame        && window.requestAnimationFrame(callback)         ||
            window.webkitRequestAnimationFrame  && window.webkitRequestAnimationFrame(callback)   ||
            window.mozRequestAnimationFrame     && window.mozRequestAnimationFrame(callback)      ||
            window.oRequestAnimationFrame       && window.mozRequestAnimationFrame(callback)      ||
            window.msRequestAnimationFrame      && window.msRequestAnimationFrame(callback)       ||
            window.setTimeout(callback, 1000 / 60);
  };

  //  positionParent();
  //    add the right positioning to the parent object
  Pep.prototype.positionParent = function() {

    if (!this.options.constrainTo || this.parentPositioned) {
      return;
    }

    this.parentPositioned = true;

    // make `relative` parent if necessary
    if (this.options.constrainTo === 'parent') {
      this.$container.css({ position: 'relative' });
    } else if (this.options.constrainTo === 'window'             &&
                this.$container.get(0).nodeName !== '#document'   &&
                this.$container.css('position') !== 'static')
    {
      this.$container.css({ position: 'static' });
    }

  };

  //  placeObject();
  //    add the right positioning to the object
  Pep.prototype.placeObject = function() {

    if (this.objectPlaced) {
      return;
    }

    this.objectPlaced = true;

    this.offset = (this.options.constrainTo === 'parent' || this.hasNonBodyRelative()) ?
                    this.$el.position() : this.$el.offset();

    // better to leave absolute position alone if
    // it already has one.
    if (parseInt( this.$el.css('left'), 10)) {
      this.offset.left = this.$el.css('left');
    }

    if (parseInt( this.$el.css('top'), 10)) {
      this.offset.top = this.$el.css('top');
    }

    if (this.options.removeMargins) {
      this.$el.css({margin: 0});
    }

    this.$el.css({
      position:   'absolute',
      top:        this.offset.top,
      left:       this.offset.left
    });

  };

  //  hasNonBodyRelative()
  //    returns true if any parent other than the body
  //    has relative positioning
  Pep.prototype.hasNonBodyRelative = function() {
    return this.$el.parents().filter(function() {
        var $this = $(this);
        return $this.is('body') || $this.css('position') === 'relative';
    }).length > 1;
  };

  //  setScale()
  //    set the scale of the object being moved.
  Pep.prototype.setScale = function(val) {
    this.scale = val;
  };

  //  setMultiplier()
  //    set the multiplier of the object being moved.
  Pep.prototype.setMultiplier = function(val) {
    this.options.multiplier = val;
  };

  //  removeCSSEasing();
  //    remove CSS easing properties, if necessary
  Pep.prototype.removeCSSEasing = function() {
    if (this.cssAnimationsSupported()) {
      this.$el.css( this.getCSSEaseHash(true));
    }
  };

  //  disableSelect();
  //    add the property which causes the object
  //    to not be selected user drags over text areas
  Pep.prototype.disableSelect = function() {

    this.$el.css({
      '-webkit-touch-callout' : 'none',
        '-webkit-user-select' : 'none',
         '-khtml-user-select' : 'none',
           '-moz-user-select' : 'none',
            '-ms-user-select' : 'none',
                'user-select' : 'none'
    });

  };

  // removeActiveClass()
  //  Removes the active class.
  Pep.prototype.removeActiveClass = function() {
    this.$el.removeClass( [this.options.activeClass, 'pep-ease'].join(' '));
  };

  //  handleConstraint();
  //    returns a hash of where to move to
  //    when we constrain to parent/window
  Pep.prototype.handleConstraint = function(dx, dy, accountForTranslation) {
    var pos               = this.$el.position();
    this.pos.x            = pos.left;
    this.pos.y            = pos.top;

    var hash              = { x: false, y: false };

    var upperYLimit, upperXLimit, lowerXLimit, lowerYLimit;

    // log our positions

    if ($.isArray( this.options.constrainTo)) {

      if (this.options.constrainTo[3] !== undefined && this.options.constrainTo[1] !== undefined) {
        upperXLimit     = this.options.constrainTo[1] === false ?  Infinity : this.options.constrainTo[1];
        lowerXLimit     = this.options.constrainTo[3] === false ? -Infinity : this.options.constrainTo[3];
      }
      if (this.options.constrainTo[0] !== false && this.options.constrainTo[2] !== false) {
        upperYLimit       = this.options.constrainTo[2] === false ?  Infinity : this.options.constrainTo[2];
        lowerYLimit       = this.options.constrainTo[0] === false ? -Infinity : this.options.constrainTo[0];
      }

      // is our object trying to move outside lower X & Y limits?
      if (this.pos.x + dx < lowerXLimit) {
        hash.x = lowerXLimit;
      }
      if (this.pos.y + dy < lowerYLimit) {
        hash.y = lowerYLimit;
      }
    } else if (typeof this.options.constrainTo === 'string') {
      lowerXLimit       = 0;
      lowerYLimit       = 0;
      upperXLimit       = this.$container.width()  - this.$el.outerWidth();
      upperYLimit       = this.$container.height() - this.$el.outerHeight();

      // is our object trying to move outside lower X & Y limits?
      if (this.pos.x + dx < 0) {
        hash.x = 0;
      }
      if (this.pos.y + dy < 0) {
        hash.y = 0;
      }
    }

    // is our object trying to move outside upper X & Y limits?
    if (this.pos.x + dx > upperXLimit) {
      hash.x = upperXLimit;
    }
    if (this.pos.y + dy > upperYLimit) {
      hash.y = upperYLimit;
    }

    // Account for translation, which makes movement a little tricky.
    if (this.shouldUseCSSTranslation() && accountForTranslation){
      if (hash.x === lowerXLimit && this.xTranslation()) {
        hash.x = lowerXLimit - this.xTranslation();
      }
      if (hash.x === upperXLimit && this.xTranslation()) {
        hash.x = upperXLimit - this.xTranslation();
      }
      if (hash.y === lowerYLimit && this.yTranslation()) {
        hash.y = lowerYLimit - this.yTranslation();
      }
      if (hash.y === upperYLimit && this.yTranslation()) {
        hash.y = upperYLimit - this.yTranslation();
      }
    }

    return hash;
  };

  //  getCSSEaseHash();
  //    returns a hash of params used in conjunction
  //    with this.options.cssEaseString
  Pep.prototype.getCSSEaseHash = function(reset){
    if (typeof(reset) === 'undefined') {
      reset = false;
    }

    var cssEaseString;
    if (reset){
      cssEaseString = '';
    } else if (this.CSSEaseHash) {
      return this.CSSEaseHash;
    } else {
      cssEaseString = ['all', this.options.cssEaseDuration + 'ms', this.options.cssEaseString].join(' ');
    }

    return {
            '-webkit-transition'   : cssEaseString,   // chrome, safari, etc.
               '-moz-transition'   : cssEaseString,   // firefox
                '-ms-transition'   : cssEaseString,   // microsoft
                 '-o-transition'   : cssEaseString,   // opera
                    'transition'   : cssEaseString    // future
          };
  };

  // calculateActiveDropRegions()
  //    sets parent droppables of this.
  Pep.prototype.calculateActiveDropRegions = function() {
    var self = this;
    this.activeDropRegions.length = 0;

    $.each( $(this.options.droppable), function(idx, el){
      var $el = $(el);
      if (self.isOverlapping($el, self.$el)){
        $el.addClass(self.options.droppableActiveClass);
        self.activeDropRegions.push($el);
      } else {
        $el.removeClass(self.options.droppableActiveClass);
      }
    });

  };

  //  isOverlapping();
  //    returns true if element a over
  Pep.prototype.isOverlapping = function($a,$b) {
    var rect1 = $a[0].getBoundingClientRect(),
      rect2 = $b[0].getBoundingClientRect();

    return !( rect1.right   < rect2.left  ||
              rect1.left    > rect2.right ||
              rect1.bottom  < rect2.top   ||
              rect1.top     > rect2.bottom );
  };

  //  isTouch();
  //    returns whether or not event is a touch event
  Pep.prototype.isTouch = function(ev){
    return ev.type.search('touch') > -1;
  };

  // isPointerEventCompatible();
  //    return whether or note our device is pointer
  //    event compatible; typically means where on a
  //    touch Win8 device
  Pep.prototype.isPointerEventCompatible = function() {
    return ('MSPointerEvent' in window);
  };

  // applyMSDefaults();
  Pep.prototype.applyMSDefaults = function() {
    this.$el.css({
        '-ms-touch-action' :    'none',
        'touch-action' :        'none',
        '-ms-scroll-chaining':  'none',
        '-ms-scroll-limit':     '0 0 0 0'
    });
  };

  //  isValidMoveEvent();
  //    returns true if we're on a non-touch device -- or --
  //    if the event is **single** touch event on a touch device
  Pep.prototype.isValidMoveEvent = function(ev){
    return (!this.isTouch(ev) || (this.isTouch(ev) && ev.originalEvent && ev.originalEvent.touches && ev.originalEvent.touches.length === 1));
  };

  //  shouldUseCSSTranslation();
  //    return true if we should use CSS transforms for move the object
  Pep.prototype.shouldUseCSSTranslation = function() {
    var useCSSTranslation = false;

    if (this.options.forceNonCSS3Movement) {
      return false;
    }

    if (typeof(this.useCSSTranslation) !== 'undefined') {
      return this.useCSSTranslation;
    }

    if (!this.options.useCSSTranslation || (typeof(Modernizr) !== 'undefined' && !Modernizr.csstransforms)) {
      useCSSTranslation = false;
    }
    else{
      useCSSTranslation = true;
    }

    this.useCSSTranslation =  useCSSTranslation;
    return useCSSTranslation;
  };

  //  cssAnimationsSupported():
  //    returns true if the browser supports CSS animations
  //    which are used for easing..
  Pep.prototype.cssAnimationsSupported = function() {

    if (typeof(this.cssAnimationsSupport) !== 'undefined'){
      return this.cssAnimationsSupport;
    }

    // If the page has Modernizr, let them do the heavy lifting.
    if (( typeof(Modernizr) !== 'undefined' && Modernizr.cssanimations)){
      this.cssAnimationsSupport = true;
      return true;
    }

    var animation = false,
        elm = document.createElement('div'),
        animationstring = 'animation',
        keyframeprefix = '',
        domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
        pfx  = '';

    if( elm.style.animationName) { animation = true; }

    if( animation === false) {
      for( var i = 0; i < domPrefixes.length; i++) {
        if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined) {
          pfx = domPrefixes[ i ];
          animationstring = pfx + 'Animation';
          keyframeprefix = '-' + pfx.toLowerCase() + '-';
          animation = true;
          break;
        }
      }
    }

    this.cssAnimationsSupport = animation;
    return animation;
  };

  //  hardwareAccelerate();
  //    add fool-proof CSS3 hardware acceleration.
  Pep.prototype.hardwareAccelerate = function() {
    this.$el.css({
      '-webkit-perspective':          1000,
      'perspective':                  1000,
      '-webkit-backface-visibility':  'hidden',
      'backface-visibility':          'hidden'
    });
   };

  //  getMovementValues();
  //    returns object pos, event position, and velocity in each direction.
  Pep.prototype.getMovementValues = function() {
    return { ev: this.ev, pos: this.pos, velocity: this.velocity() };
   };

  // toggle()
  //  toggle the pep object
  Pep.prototype.toggle = function(on) {
    if (typeof(on) === 'undefined') {
      this.disabled = !this.disabled;
    }
    else {
      this.disabled = !on;
    }
  };

  //  Easings functions
  $.extend($.easing,
  {
    easeOutQuad: function (x, t, b, c, d) {
      return -c *(t/=d)*(t-2) + b;
    },
    easeOutCirc: function (x, t, b, c, d) {
      return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },
    easeOutExpo: function (x, t, b, c, d) {
      return (t===d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    }
  });

  //  Plugin It - preventing against multiple instantiations.
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        var pepObj = new Pep( this, options);
        $.data(this, 'plugin_' + pluginName, pepObj);
        $.draggable.draggables.push(pepObj);
      }
    });
  };

  $.draggable = {};
  $.draggable.draggables = [];

}));
/**
* Responsive Popup Menu Control (Context)
* @name popupmenu
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

  $.fn.popupmenu = function( options, callback ) {

    // Settings and Options
    var pluginName = 'popupmenu',
      defaults = {
        menuId: null,  //Menu's Id
        trigger: 'click'  //click, rightClick, immediate
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Object
    Plugin.prototype = {
      init: function() {
        this.configureOptions();
        this.addMarkup();
        this.handleEvents();
      },

      configureOptions: function () {
        //Backwards Compat
        if (settings.invokeMethod) {
          settings.trigger = settings.invokeMethod;
        }
        if (settings.menu) {
          settings.menuId = settings.menu;
        }
      },

      //Add markip including Aria
      addMarkup: function () {
        var id = settings.menuId;

        this.menu = $('#' + settings.menuId);
        //Use Next Element if no Id
        if (!settings.menuId) {
          this.menu = this.element.next('.popupmenu');
          this.menu.attr('id', 'popupmenu-'+ (parseInt($('.popupmenu').length, 10)+1).toString());
          id = this.menu.attr('id');
        }
        this.menu.removeClass('inforContextMenu').addClass('popupmenu')
          .attr('role', 'menu').attr('aria-hidden', 'true');

        //TODO: Follow up 'button expanded' in JAWS
        this.element.attr('aria-haspopup', true)
          .attr('aria-expanded', 'false')
          .attr('aria-owns', id);

        this.menu.find('li').attr('role', 'presentation');
        this.menu.find('a').attr('tabindex', '-1').attr('role', 'menuitem');
        this.menu.find('li.is-disabled a, li.disabled a').attr('tabindex', '-1').attr('disabled', 'disabled');
      },

      handleEvents: function() {
        var self = this;

        if (settings.trigger === 'click' || settings.trigger === 'toggle') {
          this.element.on('click.popupmenu', function (e) {
            self.menu.addClass('is-animated');
            if (self.menu.hasClass('is-open')){
              self.close();
            } else {
              self.open(e);
            }
          });
        }

        if (settings.trigger === 'rightClick') {
          this.element.on('contextmenu.popupmenu', function (e) {
            e.preventDefault();
            return false;
          }).on('mousedown.popupmenu', function (e) {
            if (e.button === 2) {
              self.open(e);
            }
            e.stopPropagation();
          });
        }

        if (settings.trigger === 'immediate') {
          this.open();
        }

        this.element.on('keypress.popupmenu', function (e) {
          if (settings.trigger === 'rightClick' && e.shiftKey && e.keyCode === 121) {  //Shift F10
            self.open(e, true);
          }
        });
      },

      //http://access.aol.com/dhtml-style-guide-working-group/#popupmenu
      handleKeys: function () {
        var self = this;

        //Handle Events in Anchors
        this.menu.on('click.popmenu', 'a', function (e) {
          var anchor = $(this);
          e.preventDefault();

          if (anchor.find('.inforCheckbox').length > 0) {
            return;
          }

          self.close();
          //Not a very usefull call back use closed events
          if (callback && anchor.attr('href')) {
            callback(anchor.attr('href').substr(1), self.element , self.menu.offset(), $(this));
          }

          self.element.trigger('select', [anchor]);
        });

        $(document).on('keydown.popupmenu', function (e) {
          var focus,
            excludes = 'li:not(.popupmenu-seperator):not(.popupmenu-group):not(.is-disabled)';

          //Close on escape
          if (e.keyCode === 27) {
            self.close();
          }

          if (e.keyCode === 9) {
            self.close();
          }

          //Select Checkboxes
          if (e.keyCode === 32) {
            $(e.target).find('input:checkbox').trigger('click');
          }

          focus = self.menu.find(':focus');

          //Right Close Submenu
          if (e.keyCode === 37) {
            e.preventDefault();
            if (focus.closest('.popupmenu').length > 0) {
              focus.closest('.popupmenu').removeClass('is-open').prev('a').focus();
            }
          }

          //Up on Up
          if (e.keyCode === 38) {
             e.preventDefault();

            //Go back to Top on the last one
            if (focus.parent().prevAll(excludes).length === 0) {
              self.menu.parent().find(excludes).last().find('a').focus();
              return;
            }


            focus.parent().prevAll(excludes).first().find('a').focus();
          }

          //Right Open Submenu
          if (e.keyCode === 39) {
            e.preventDefault();

            if (focus.parent().hasClass('submenu')) {
              self.showSubmenu(focus.parent());
              focus.parent().find('.popupmenu a:first').focus();
            }
          }

          //Down
          if (e.keyCode === 40) {
            e.preventDefault();

            //Go back to Top on the last one
            if (focus.parent().nextAll(excludes).length === 0) {
              if (focus.length === 0) {
                self.menu.parent().find(excludes).first().find('a').focus();
              } else {
                focus.closest('.popupmenu').find(excludes).first().find('a').focus();
              }
              return;
            }

            focus.parent().nextAll(excludes).first().find('a').focus();
          }
        });
      },

      position: function(e) {
        var target = (e === undefined ? this.element : $(e.target).closest('.btn-menu')),
          menuWidth = this.menu.outerWidth(),
          menuHeight = this.menu.outerHeight();

        if (settings.trigger === 'rightClick') {
          this.menu.css({'left': (e.type === 'keypress' ? target.offset().left : e.pageX),
                        'top': (e.type === 'keypress' ? target.offset().top : e.pageY)});
        } else {
          this.menu.css({'left': target.offset().left, 'top': target.offset().top - (this.menu.parent().length >1 ? this.menu.parent().offset().top: 0) + target.outerHeight()});
        }

        //Handle Case where menu is off bottom
        if ((this.menu.offset().top + menuHeight) > $(window).height()) {
          this.menu.css({'top': $(window).height() - menuHeight - ($(window).height() - target.offset().top)});

          //Did it fit?
          if (this.menu.offset().top < 0) {
            //No so see if more room on top or bottom and shrink
            if (target.offset().top > $(window).height() - target.offset().top + target.outerWidth) {
              //fits on top
            } else {
              //shrink to bottom
              this.menu.css({'left': target.offset().left, 'top': target.offset().top - (this.menu.parent().length >1 ? this.menu.parent().offset().top: 0) + target.outerHeight()});
              this.menu.height($(window).outerHeight() - (this.menu.offset().top + 55) + 'px').css('overflow', 'auto');
              //Note: 32 is the top and bottom padding 25+25 and box shadow plus a 5 px offset
            }
          }
        }

        //Handle Case where menu is off left side
        if ((this.menu.offset().left + menuWidth) > $(window).width()) {
          this.menu.css({'left': $(window).width() - menuWidth - ($(window).width() - target.offset().left) + target.outerWidth()});
        }
      },

      open: function(e) {
        var self = this;

        this.element.trigger('beforeOpen', [this.menu]);

        $('.popupmenu').not(this.menu).removeClass('is-open');  //close others.
        this.menu.addClass('is-open').attr('aria-hidden', 'false');
        self.position(e);

        //Close on Document Click ect..
        setTimeout(function () {
          $(document).on('click.popupmenu', function (e) {
            if (e.button === 2) {
              return;
            }

            self.menu.removeClass('is-animated');

            if ($(e.target).closest('.popupmenu').length === 0) {
              self.close();
            }
          });

          $(window).on(' scroll.popupmenu resize.popupmenu', function () {
            self.close();
          });

          self.element.trigger('beforeOpen', [self.menu]);

        }, 400);

        //Hide on iFrame Clicks
        $('iframe').ready(function () {
          $('iframe').contents().find('body').on('click.popupmenu', function () {
            self.close();
          });
        });

        this.handleKeys();
        this.element.attr('aria-expanded', 'true');

        //hide and decorate submenus - we use a variation on
        var tracker = 0, startY, menuToClose;

        self.menu.find('.popupmenu').removeClass('is-open').parent().addClass('submenu');
        self.menu.find('.submenu').on('mouseenter', function (e) {
          startY = e.pageX;
          self.showSubmenu($(this));
          $(document).on('mousemove.popupmenu', function (e) {
            tracker = e.pageX;
          });
        }).on('mouseleave', function () {
          $(document).off('mousemove.popupmenu');

          menuToClose = $(this).find('ul');

          if ((tracker - startY) < 3.5) { //We are moving slopie to the menu
            menuToClose.removeClass('is-open');
          }
        });

        self.menu.find('li:not(.popupmenu-seperator):not(.popupmenu-group):not(.is-disabled)').first().find('a').focus();
      },

      showSubmenu: function (li) {
        var menu = li.find('ul:first');
        li.parent().find('.submenu > ul').not(li.find('ul')).removeClass('is-open');
        menu.css({left: li.offset().left + li.width(), top: li.offset().top}).addClass('is-open');
      },

      detach: function () {
        $(document).off('click.popupmenu keydown.popupmenu');
        $(window).off('scroll.popupmenu resize.popupmenu');
        this.menu.off('click.popmenu');
        $('iframe').contents().find('body').off('click.popupmenu');
      },

      close: function () {
        this.menu.removeClass('is-open').attr('aria-hidden', 'true');
        this.menu.css({'left': '-999px', 'height': ''});
        this.element.trigger('close');
        this.element.focus().attr('aria-expanded', 'false');
        this.detach();

        if (settings.trigger === 'immediate') {
          this.destroy();
        }
      },

      destroy: function() {
        $.removeData(this.element[0], pluginName);
        this.element.off('click.popupmenu keypress.popupmenu contextmenu.popupmenu mousedown.popupmenu');
        this.detach();
      }
    };

    // Initializing the Control Once or Call Methods.
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        if (typeof instance[options] === 'function') {
          instance[options]();
        }
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

}));
/**
* Responsive Messages
* Deps: modal
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

  $.fn.message = function(options) {

    // Settings and Options
    var defaults = {
          title: 'Message Title',
          message: 'Message Summary',
          width: 'auto',
          close: null,
          resize: null,
          button: []  //Passed through to modal
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {
      init: function() {
        var self = this,
            content;

        //Create the Markup
        this.message = $('<div class="modal"></div>');
        this.messageContent = $('<div class="modal-content"></div>');
        this.title = $('<h1 class="modal-title" tabindex="0">' + settings.title + '</h3>').appendTo(this.messageContent);
        this.content = $('<div class="modal-body"><p class="message">'+ settings.message +'</p></div>').appendTo(this.messageContent);

        //Append The Content if Passed in
        if (!this.element.is('body')) {
          content = this.element;
          this.content.empty().append(content.show());
        }

        this.closeBtn = $('<button type="button" class="btn-default btn-close">Close</button>').appendTo(this.content);
        this.message.append(this.messageContent).appendTo('body').modal({trigger: 'immediate', buttons: settings.buttons,
          resizable: settings.resizable, close: settings.close, resize: settings.resize});

        //Adjust Width if Set as a Setting
        if (settings.width !== 'auto') {
          this.content.closest('.modal').css({'max-width': 'none', 'width': settings.width});
        }

        //Call Close As an Option - For backwards Compat
        if (settings.close) {
          this.content.on('close', function (e) {
            settings.close(e, self.content);
          });
        }
        this.message.on('close', function () {
          if (content) {
            content.hide().appendTo('body');
          }
          self.message.remove();
        });
      }
    };

    // Support Chaining and Init the Control or Set Settings
    return this.each(function() {
      new Plugin(this, settings);
    });
  };

}));
/**
* Responsive and Accessible Modal Control
* @name Tabs
* @param {string} propertyName - The Name of the Property
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

  $.fn.modal = function(options) {

    // Settings and Options
    var pluginName = 'modal',
        defaults = {
          trigger: 'click', //TODO: supports click, immediate,  manual
          draggable: true,  //Can Drag the Dialog around.
          resizable: false, //Depricated - Resizable Dialogs.
          buttons: null
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {
      init: function(){
        var self = this;

        this.oldActive = document.activeElement;  //Save and restore focus for A11Y
        this.trigger = $('button[ data-modal="' + this.element.attr('id') + '"]');  //Find the button with same dialog ID
        this.overlay = $('<div class="overlay"></div>');

        if (settings.trigger === 'click') {
          this.trigger.on('click.modal', function() {
            self.open();
          });
        }

        if (settings.trigger === 'immediate') {
          setTimeout(function () {

            self.open();
          },1);
        }

        self.isCancelled = false;
        this.element.find('.btn-close').on('click.modal', function() {
          self.close();
        });

        this.element.find('.btn-cancel, .link-cancel').on('click.modal', function() {
          self.isCancelled = true;
          self.close();
        });

        if (settings.buttons) {
          self.addButtons(settings.buttons);
        }
      },
      addButtons: function(buttons){
        var body = this.element.find('.modal-body'),
            self = this,
            buttonset = $('<div class="modal-buttonset"></div>').appendTo(body);

        buttonset.find('button').remove();
        body.find('.btn-default.btn-close').remove();

        $.each(buttons, function (name, props) {
          var btn = $('<button type="button" class="btn"></button>');
          btn.text(props.text);
          if (props.isDefault) {
            btn.addClass('btn-default');
          }
          if (props.id) {
            btn.attr('id', props.id);
          }
          btn.on('click.modal', function() {
            if (props.click) {
              props.click.apply(self.element[0], arguments);
              return;
            }
            self.close();
          });
          buttonset.append(btn);
        });
      },
      sizeInner: function () {
        var messageArea;
        messageArea = this.element.find('.detailed-message');
        //Set a max width
        var h = $(window).height() - messageArea.offset().top - 150;
        messageArea.css({'max-height': h, 'overflow': 'auto', 'width': messageArea.width()});
      },
      open: function () {
        var self = this, messageArea,
          elemCanOpen = this.element.triggerHandler('beforeOpen'),
          bodyCanOpen = this.element.find('.modal-body > div').triggerHandler('beforeOpen');

        self.isCancelled = false;

        if (elemCanOpen === false || bodyCanOpen === false) {
          return false;
        }

        this.overlay.appendTo('body');
        messageArea = self.element.find('.detailed-message');
        if (messageArea.length === 1) {
          $(window).on('resize.modal', function () {
            self.sizeInner();
          });
          self.sizeInner();
        }
        this.element.addClass('is-visible').attr('role', 'dialog');

        //Look for other nested dialogs and adjust the zindex.
        $('.modal').each(function (i) {
          var modal = $(this);
          modal.css('z-index', '100' + (i + 1));

          if (modal.data('modal') && modal.data('modal').overlay) {
            modal.data('modal').overlay.css('z-index', '100' + i);
          }

        });

        setTimeout(function () {
          self.element.find('.modal-title').focus();
          self.keepFocus();
          self.element.triggerHandler('open');
          self.element.find('.modal-body > div').triggerHandler('open');
        }, 300);

        $('body > *').not(this.element).attr('aria-hidden', 'true');
        $('body').addClass('modal-engaged');

        //Handle Default button.
        $(document).on('keypress.modal', function (e) {
          var target = $(e.target);

          if (target.is('textarea') || target.is(':button') || target.is('.dropdown')) {
            return;
          }

          if (e.which === 13 && self.isOnTop()) {
            self.element.find('.btn-default').trigger('click.modal');
          }
        });
      },

      isOnTop: function () {
        var max = 0,
          dialog = this.element;

        $('.modal.is-visible').each(function () {
          if (max < $(this).css('z-index')) {
            max = $(this).css('z-index');
          }
        });

        return max === dialog.css('z-index');
      },

      keepFocus: function() {
        var self = this,
          allTabbableElements = $(self.element).find('a[href], area[href], input:not([disabled]),' +
            'select:not([disabled]), textarea:not([disabled]),' +
            'button:not([disabled]), iframe, object, embed, *[tabindex],' +
            '*[contenteditable]'),
          firstTabbableElement = allTabbableElements[0],
          lastTabbableElement = allTabbableElements[allTabbableElements.length - 1];

          $(self.element).on('keypress.modal', function (e) {
            var keyCode = e.which || e.keyCode;

            if (keyCode === 27) {
              self.close();
            }

            if (keyCode === 9) {
              // Move focus to first element that can be tabbed if Shift isn't used
              if (e.target === lastTabbableElement && !e.shiftKey) {
                e.preventDefault();
                firstTabbableElement.focus();
              } else if (e.target === firstTabbableElement && e.shiftKey) {
                e.preventDefault();
                lastTabbableElement.focus();
              }
            }
          });
      },

      close: function () {
        var elemCanClose = this.element.triggerHandler('beforeClose'),
          bodyCanClose = this.element.find('.modal-body > div').first().triggerHandler('beforeClose');

        if (elemCanClose === false || bodyCanClose === false) {
          return;
        }

        this.element.removeClass('is-visible');
        $(document).off('keypress.modal');

        this.overlay.remove();
        $('body').removeClass('modal-engaged');
        $('body > *').not(this.element).removeAttr('aria-hidden');

        //Fire Events
        this.element.trigger('close', [this.isCancelled]);
        this.element.find('.modal-body > div').first().trigger('beforeClose', [this.isCancelled]);  //trigger on the content for messages

        if (this.oldActive && $(this.oldActive).is('button:visible')) {
          this.oldActive.focus();
          this.oldActive = null;
        } else {
          this.trigger.focus();
        }
      },

      destroy: function(){
        this.close();
        $.removeData(this.obj, pluginName);
      }
    };

    // Support Chaining and Init the Control or Set Settings
    return this.each(function() {
      var instance = $.data(this, pluginName),
        elem = $(this);

      if (!elem.is('.modal')) {
        instance = elem.closest('.modal').data(pluginName);
      }

      if (instance) {
        if (typeof instance[options] === 'function') {
          instance[options]();
        }
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

}));
/**
* Responsive Tab Control
* @name Tabs
* @param {string} propertyName - The Name of the Property
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

  $.fn.tabs = function(options) {

    // Tab Settings and Options
    var pluginName = 'tabs',
        defaults = {
          propertyName: 'value'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {
      init: function(){
        var self = this,
              header = null;

          self.container = $(this.element);

          //For each tab panel set the aria roles and hide it
          self.panels = self.container.children('div')
              .attr({'class': 'tab-panel', 'role': 'tabpanel',
                      'aria-hidden': 'true'}).hide();

          self.panels.find('h2:first').attr('tabindex', '0');

          //Attach Tablist role and class to the tab headers container
          header = self.container.find('ul:first')
                      .attr({'class': 'tab-list', 'role': 'tablist',
                              'aria-multiselectable': 'false'});

          //for each item in the tabsList...
          self.anchors = header.find('li > a');
          self.anchors.each(function () {
            var a = $(this);

            a.attr({'role': 'tab', 'aria-selected': 'false', 'tabindex': '-1'})
             .parent().attr('role', 'presentation').addClass('tab');

            //Attach click events to tab and anchor
            a.parent().on('click.tabs', function () {
              self.activate($(this).index());
            });

            a.on('click.tabs', function (e) {
              e.preventDefault();
              e.stopPropagation();
              $(this).parent().trigger('click');
            }).on('keydown.tabs', function (e) {
              var li = $(this).parent();

              switch (e.which) {
                case 37: case 38:
                  if (li.prev().length !== 0) {
                    li.prev().find('>a').click();
                  } else {
                    self.container.find('li:last>a').click();
                  }
                  e.preventDefault();
                  break;
                case 39: case 40:
                  if (li.next().length !== 0) {
                    li.next().find('>a').click();
                  } else {
                    self.container.find('li:first>a').click();
                  }
                  e.preventDefault();
                  break;
              }
            });
          });

          self.activate(0);
      },

      activate: function(index){
        var self = this,
          a = self.anchors.eq(index),
          ui = {newTab: a.parent(),
                oldTab: self.anchors.parents().find('.is-selected'),
                panels: self.panels.eq(a.parent().index()),
                oldPanel: self.panels.filter(':visible')};

        var isCancelled = self.element.trigger('beforeActivate', null, ui);
        if (!isCancelled) {
          return;
        }

        //hide old tabs
        self.anchors.attr({'aria-selected': 'false', 'tabindex': '-1'})
            .parent().removeClass('is-selected');

        self.panels.hide();

        //show current tab
        a.attr({'aria-selected': 'true', 'tabindex': '0'})
          .parent().addClass('is-selected');

        ui.panels.attr('aria-hidden', 'false').stop().fadeIn(function() {
          self.element.trigger('activate', null, ui);
        });

        //Init Label Widths..
        ui.panels.find('.autoLabelWidth').each(function() {
          var container = $(this),
            labels = container.find('.inforLabel');

          if (labels.autoWidth) {
            labels.autoWidth();
          }
        });

        ui.panels.find(':first-child').filter('h3').attr('tabindex', '0');
        a.focus();
        self._setOveflow();
      },

      _setOveflow: function () {
        //TODO - Implement Overflow/Responsive
      },

      destroy: function(){
          $.removeData(this.obj, pluginName);
      }
    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
/**
* Responsive Tooltip and Popover Control
* @name tooltip
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(window.jQuery || window.Zepto);
  }
}(function ($) {

  $.fn.tooltip = function(options, args) {

    // Settings and Options
    var pluginName = 'tooltip',
      defaults = {
        content: null, //Takes title attribute or feed content. Can be a function or jQuery markup
        offset: 20, //how much room to leave
        placement: 'bottom',  //can be top/left/bottom/right
        trigger: 'hover', //supports click and manual and hover (future focus)
        title: null, //Title for Infor Tips
        popover: null , //force it to be a popover (no content)
        isError: false //Add error classes
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Object
    Plugin.prototype = {
      init: function() {
        this.appendTooltip();
        this.handleEvents();
        this.addAria();
        this.isPopover = (settings.content !== null && typeof settings.content === 'object') || settings.popover;
      },

      addAria: function() {
        this.content =  this.element.attr('title');
        this.element.removeAttr('title').attr('aria-describedby', 'tooltip');
        if (this.isPopover && settings.trigger === 'click') {
          this.element.attr('aria-haspopup', true);
        }
      },

      appendTooltip: function() {
        this.tooltip = $('#tooltip');
        if (this.tooltip.length === 0) {
          this.tooltip = $('<div class="tooltip bottom is-hidden" role="tooltip" id="tooltip"><div class="arrow"></div><div class="tooltip-content"><p>(Content)</p></div></div>').appendTo('body');
        }
      },

      handleEvents: function() {
        var self = this, timer, delay = 400;

        if (settings.trigger === 'hover' && !settings.isError) {
          this.element
            .on('mouseenter.tooltip', function() {
              timer = setTimeout(function() {
                self.show();
              }, delay);
            })
            .on('mouseleave.tooltip mousedown.tooltip', function() {
                clearTimeout(timer);
                setTimeout(function() {
                  self.hide();
                }, delay);
            });
        }

        if (settings.trigger === 'click') {
          this.element.on('click.tooltip', function() {
            if (self.tooltip.hasClass('is-hidden')) {
              self.show();
            } else {
              self.hide();
            }
          });
        }


        this.element.on('focus.tooltip, click.tooltip', function() {
          if (!self.isPopover) {
            self.setContent(self.content);
          }
        });
      },

      setContent: function (content) {
        if (this.isPopover) {
          this.tooltip.find('.tooltip-content').html(settings.content);
          this.tooltip.addClass('popover');

          if (settings.title !== null) {
            var title = this.tooltip.find('.tooltip-title');
            if (title.length === 0) {
              title = $('<div class="tooltip-title"></div>').prependTo(this.tooltip);
            }
            title.html(settings.title);
          }
          return;
        }

        this.tooltip.removeClass('popover');
        if (typeof settings.content === 'function') {
          content = this.content = settings.content.call(this.element);
        }

        this.tooltip.find('.tooltip-content').html('<p>' + (content === undefined ? '(Content)' : content) + '</p>');
      },

      show: function() {
        var self = this;
        this.isInPopup = false;

        this.setContent(this.content);
        this.element.trigger('beforeOpen', [this.tooltip]);

        this.tooltip.removeClass('bottom right left top is-error').addClass(settings.placement);
        this.position();
        if (settings.isError) {
          this.tooltip.addClass('is-error');
        }
        this.tooltip.removeClass('is-hidden');
        this.element.trigger('open', [this.tooltip]);

        setTimeout(function () {
          $(document).on('click.tooltip', function (e) {
            if (settings.isError) {
             return;
            }
            if ($(e.target).closest('.popover').length === 0
                && $(e.target).closest('.dropdown-list').length === 0) {
              self.hide();
            }
          })
          .on('keydown.tooltip', function (e) {
            if (e.which === 27 || settings.isError) {
              self.hide();
            }
          });
          $(window).on('resize.tooltip', function() {
            self.hide();
          });
        }, 400);

        if (self.isPopover) {
          this.tooltip.on('mouseenter.tooltip', function() {
            self.isInPopup = true;
          }).on('mouseleave.tooltip', function(e) {
            self.isInPopup = false;
            if ($(e.relatedTarget).is('.dropdown-list, .dropdown-option')) {
              return false;
            }
            setTimeout(function() {
              if (!self.isInPopup) {
                console.log(e.relatedTarget);
                self.hide();
              }
            }, 400);
          });
        }
      },

      position: function () {
        if (settings.placement === 'bottom') {
          this.tooltip.css({'top': this.element.offset().top + this.element.outerHeight() + settings.offset,
                            'left': this.element.offset().left + (this.element.outerWidth()/2) - (this.tooltip.outerWidth() / 2)});
        }

        if (settings.placement === 'top') {
          this.tooltip.css({'top': this.element.offset().top - settings.offset - this.tooltip.height(),
                            'left': this.element.offset().left + (this.element.outerWidth()/2) - (this.tooltip.outerWidth() / 2)});
        }

        if (settings.placement === 'right') {
          this.tooltip.css({'top': this.element.offset().top - (this.tooltip.height() / 2) + (this.element.outerHeight() / 2),
                            'left': this.element.offset().left + this.element.outerWidth() + settings.offset});
        }
      },

      hide: function() {
        if (this.isInPopup) {
          return;
        }
        this.tooltip.addClass('is-hidden');
        $(document).off('click.tooltip');
        $(window).off('resize.tooltip');

        this.element.trigger('close.tooltip', [this.tooltip]);
      },

      destroy: function() {
        this.element.removeData(pluginName);
        this.hide();
        this.element.off('mouseenter.tooltip mouseleave.tooltip mousedown.tooltip click.tooltip');
      }
    };

    // Initializing the Control Once or Call Methods.
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        if (typeof instance[options] === 'function') {
          instance[options](args);
        }
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

  //Migrate
  $.fn.inforToolTip = $.fn.tooltip;
  $.fn.popover = $.fn.tooltip;

}));
/**
* Touch Enabled/ Responsive and Accessible Slider Control
* @name Tabs
* @param {string} propertyName - The Name of the Property
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

  $.fn.slider = function(options) {

    // Settings and Options
    var pluginName = 'slider',
        defaults = {
          value: 0
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {
      init: function() {
        var self = this,
            updateBar = function(args) {
              var leftWidth = ($(args.el).position().left + (self.handles.width()));
              self.value(leftWidth);
            };

        self.handles = self.element.find('.slider-handle');
        self.range = self.element.find('.slider-range');
        self.value(settings.value);

        self.handles.draggable({constrainTo: 'parent', axis: 'x'})
            .on('click.slider', function (e) {
              e.preventDefault(); //Prevent from jumping to top.
            })
            .on('drag.slider', function (e, args) {
              updateBar(args);
            })
            .on('easing.slider', function (e, args) {
              updateBar(args);
            });
      },
      value: function(val) {
        var self = this,
          leftWidth = 0;

        self._value = val;
        leftWidth = ((self._value - (self.handles.width() /2)) / parseInt(self.element.css('width'), 10)) * 100;
        self.range.css('width', leftWidth + '%');
        //set the ranges
        return self._value;
      },
      destroy: function() {
        $.removeData(this.obj, pluginName);
      }
    };

    // Support Chaining and Init the Control or Set Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        if (typeof instance[options] === 'function') {
          instance[options]();
        }
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
