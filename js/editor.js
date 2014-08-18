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
