/*!
 Gramercy Controls v4.0.0 
 Date: 30-06-2014 15:01:05 
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
          allowMultiParagraphSelection: true,
          anchorInputPlaceholder: 'Paste or type a link',
          anchorPreviewHideDelay: 600,
          buttons: ['header1', 'header2', 'seperator', 'bold', 'italic', 'underline', 'seperator', 'justifyLeft', 'justifyCenter', 'justifyRight', 'seperator', 'anchor', 'quote'],
          staticToolbar: false, //TODO: I'm a WIp
          delay: 0,
          diffLeft: 0,
          diffTop: -10,
          firstHeader: 'h3',
          secondHeader: 'h4',
          forcePlainText: true,
          placeholder: 'Type your text',
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
            .setPlaceholders()
            .bindWindowActions();
      },
      initElements: function () {
        var i,
            elem = this.element;

        elem.attr('contentEditable', true);

        if (!elem.attr('data-placeholder')) { //TODO: May Not Need
            elem.attr('data-placeholder', settings.placeholder);
        }
        elem.attr('data-editor', true); //TODO : Need?
        this.bindParagraphCreation(i).bindTab(i);

        this.initToolbar()
            .bindButtons()
            .bindAnchorForm()
            .bindAnchorPreview();

        return this;
      },

      bindParagraphCreation: function () {
        var self = this;

        this.element.on('keypress', function (e) {
            var node = self.getSelectionStart(),
                tagName;

            if (e.which === 32) {
                tagName = node.tagName.toLowerCase();
                if (tagName === 'a') {
                    document.execCommand('unlink', false, null);
                }
            }
        });

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
          this.anchorForm = this.toolbar.find('.editor-toolbar-form-anchor');
          this.anchorInput = this.anchorForm.find('input');
          this.toolbarActions = this.toolbar.find('.editor-toolbar-actions');
          this.anchorPreview = this.createAnchorPreview();

          return this;
      },
      createToolbar: function () {
        var toolbar = $('<div></div>').attr('class', 'editor-toolbar').attr('id', 'editor-toolbar-' + this.id);
        toolbar.append(this.toolbarButtons());
        toolbar.append(this.toolbarFormAnchor()).appendTo('body');
        return toolbar;
      },
      toolbarFormAnchor: function () {
          var anchor = $('<div class="editor-toolbar-form-anchor"></div>').attr('id', 'editor-toolbar-form-anchor'),
            id = 'editor-toolbar-form-anchor-input'+ this.id;

          $('<label class="scr-only">Anchor</label>').attr('for', id).appendTo(anchor);
          $('<input type="text">').attr('placeholder', settings.anchorInputPlaceholder).attr('id', id).appendTo(anchor);
          $('<a class="link"></a>').attr('href', '#').html('&times;').appendTo(anchor);
          //$('<button type="button">Close</button>').appendTo(anchor);

          return anchor;
      },
      toolbarButtons: function () {
        var btns = settings.buttons,
            ul = $('<ul></ul>').attr('id','editor-toolbar-actions').attr('class', 'editor-toolbar-actions clearfix'),
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
              'bold': '<button type="button" class="editor-action editor-action-bold" data-action="bold" data-element="b">' + buttonLabels.bold + '</button>',
              'italic': '<button type="button" class="editor-action editor-action-italic" data-action="italic" data-element="i">' + buttonLabels.italic + '</button>',
              'underline': '<button type="button" class="editor-action editor-action-underline" data-action="underline" data-element="u">' + buttonLabels.underline + '</button>',
              'strikethrough': '<button type="button" class="editor-action editor-action-strikethrough" data-action="strikethrough" data-element="strike"><strike>A</strike></button>',
              'superscript': '<button type="button" class="editor-action editor-action-superscript" data-action="superscript" data-element="sup">' + buttonLabels.superscript + '</button>',
              'subscript': '<button type="button" class="editor-action editor-action-subscript" data-action="subscript" data-element="sub">' + buttonLabels.subscript + '</button>',
              'seperator': '<div class="editor-toolbar-seperator"></div>',
              'anchor': '<button type="button" class="editor-action editor-action-anchor" data-action="anchor" data-element="a">' + buttonLabels.anchor + '</button>',
              'image': '<button type="button" class="editor-action editor-action-image" data-action="image" data-element="img">' + buttonLabels.image + '</button>',
              'header1': '<button type="button" class="editor-action editor-action-header1" data-action="append-' + settings.firstHeader + '" data-element="' + settings.firstHeader + '">' + buttonLabels.header1 + '</button>',
              'header2': '<button type="button" class="editor-action editor-action-header2" data-action="append-' + settings.secondHeader + '" data-element="' + settings.secondHeader + '">' + buttonLabels.header2 + '</button>',
              'quote': '<button type="button" class="editor-action editor-action-quote" data-action="append-blockquote" data-element="blockquote">' + buttonLabels.quote + '</button>',
              'orderedlist': '<button type="button" class="editor-action editor-action-orderedlist" data-action="insertorderedlist" data-element="ol">' + buttonLabels.orderedlist + '</button>',
              'unorderedlist': '<button type="button" class="editor-action editor-action-unorderedlist" data-action="insertunorderedlist" data-element="ul">' + buttonLabels.unorderedlist + '</button>',
              'pre': '<button type="button" class="editor-action editor-action-pre" data-action="append-pre" data-element="pre">' + buttonLabels.pre + '</button>',
              'indent': '<button type="button" class="editor-action editor-action-indent" data-action="indent" data-element="ul">' + buttonLabels.indent + '</button>',
              'outdent': '<button type="button" class="editor-action editor-action-outdent" data-action="outdent" data-element="ul">' + buttonLabels.outdent + '</button>',
              'justifyLeft': '<button type="button" class="editor-action editor-action-indent" data-action="justifyLeft" >' + buttonLabels.justifyLeft + '</button>',
              'justifyCenter': '<button type="button" class="editor-action editor-action-outdent" data-action="justifyCenter">' + buttonLabels.justifyCenter + '</button>',
              'justifyRight': '<button type="button" class="editor-action editor-action-outdent" data-action="justifyRight" >' + buttonLabels.justifyRight + '</button>'

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
                'image': '<b>image</b>',
                'header1': '<b>H3</b>',
                'header2': '<b>H4</b>',
                'quote': '<svg class="icon icon-blockquote" viewBox="0 0 32 32"><use xlink:href="#icon-blockquote"></svg>',
                'orderedlist': '<b>1.</b>',
                'unorderedlist': '<b>&bull;</b>',
                'pre': '<b>0101</b>',
                'indent': '<b>&rarr;</b>',
                'outdent': '<b>&larr;</b>',
                'justifyLeft': '<svg class="icon icon-justify-left" viewBox="0 0 32 32"><use xlink:href="#icon-justify-left"></svg>',
                'justifyCenter': '<svg class="icon icon-justify-center" viewBox="0 0 32 32"><use xlink:href="#icon-justify-center"></svg>',
                'justifyRight': '<svg class="icon icon-justify-right" viewBox="0 0 32 32"><use xlink:href="#icon-justify-right"></svg>',
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
      createAnchorPreview: function () {
        var self = this,
            anchorPreview = $('<div class="editor-anchor-preview"></div>')
                              .attr('id', 'editor-anchor-preview-' + this.id);

        anchorPreview.html(this.anchorPreviewTemplate());
        $('body').append(anchorPreview);

        anchorPreview.on('click.editor', function () {
            self.anchorPreviewClickHandler();
        });

        return anchorPreview;
      },
      anchorPreviewTemplate: function () {
        return '<div class="editor-toolbar-anchor-preview" id="editor-toolbar-anchor-preview">' +
                '    <i class="editor-toolbar-anchor-preview-inner"></i>' +
                '</div>';
      },

      //Show the Buttons
      activateButton: function (tag) {
        this.toolbar.find('[data-element="' + tag + '"]').addClass('is-active');
      },

      //Bind Events to Toolbar Buttons
      bindButtons: function () {
        var self = this;

        this.toolbar.on('click.editor', 'button', function (e) {
            var btn = $(this);

            e.preventDefault();
            if (self.selection === undefined) {
              self.checkSelection();
            }

            btn.toggleClass('is-active');
            if (btn.attr('data-action')) {
              self.execAction(btn.attr('data-action'), e);
            }
        });

        return this;
      },

      //Execute Button extensions  TODO: May Not need.
      callExtensions: function (funcName) {
          if (arguments.length < 1) {
              return;
          }

          var args = Array.prototype.slice.call(arguments, 1),
              ext,
              name;

          for (name in settings.extensions) {
              if (settings.extensions.hasOwnProperty(name)) {
                  ext = settings.extensions[name];
                  if (ext[funcName] !== undefined) {
                      ext[funcName].apply(ext, args);
                  }
              }
          }
      },
      //Show the Anchor Popup.
      showAnchorForm: function (linkText) {
        var self = this;

        this.toolbarActions.hide();
        this.savedSelection = this.saveSelection();
        this.anchorForm.show();
        this.keepToolbarAlive = true;
        setTimeout(function () {
          self.anchorInput.focus().select();
        }, 300);
        this.anchorInput.value = linkText || '';
      },

      bindAnchorForm: function () {
        var linkCancel = this.anchorForm.find('a'),
            self = this;

        this.anchorForm.on('click.editor', function (e) {
            e.stopPropagation();
        });
        this.anchorInput.on('keyup.editor', function (e) {
          if (e.keyCode === 13) {
            e.preventDefault();
            self.createLink($(this));
          }
        });
        this.anchorInput.on('click.editor', function (e) {
          // make sure not to hide form when cliking into the input
          e.stopPropagation();
          self.keepToolbarAlive = true;
        });
        this.anchorInput.on('blur.editor', function () {
          self.keepToolbarAlive = false;
          self.checkSelection();
        });

        linkCancel.on('click.editor', function (e) {
          e.preventDefault();
          self.showToolbarActions();
          self.restoreSelection(self.savedSelection);
        });
        return this;
      },

      anchorPreviewClickHandler: function () {
        if (this.activeAnchor) {
          var self = this,
              range = document.createRange(),
              sel = window.getSelection();

          range.selectNodeContents(self.activeAnchor[0]);
          sel.removeAllRanges();
          sel.addRange(range);
          setTimeout(function () {
            if (self.activeAnchor) {
              self.showAnchorForm(self.activeAnchor.attr('href'));
            }
            self.keepToolbarAlive = false;
          }, 100 + settings.delay);
        }

        this.hideAnchorPreview();
      },

      bindAnchorPreview: function () {
        var self = this;
        this.editorAnchorObserverWrapper = function (e) {
            self.editorAnchorObserver(e);
        };
        this.element.on('mouseover.editor', this.editorAnchorObserverWrapper);
        return this;
      },

      createLink: function (input) {
        if (input.val().trim().length === 0) {
          this.hideToolbarActions();
          return;
        }
        this.restoreSelection(this.savedSelection);
        input.val(this.checkLinkFormat(input.val()));
        document.execCommand('createLink', false, input.val());
        if (settings.targetBlank) {
          this.setTargetBlank();
        }
        this.checkSelection();
        this.showToolbarActions();
        input.value = '';
      },

      checkLinkFormat: function (value) {
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
          // Do not close the toolbar when bluring the editable area and clicking into the anchor form
          if (e && self.clickingIntoArchorForm(e)) {
              return false;
          }

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

        $('html').on('mouseup.editor', this.selectionHandler);
        this.element.on('keyup.editor', this.selectionHandler);
        this.element.on('blur.editor', this.selectionHandler);
        return this;
      },

      checkSelection: function () {
        var newSelection,
            selectionElement;

        if (this.keepToolbarAlive !== true) {
            newSelection = window.getSelection();
            if (newSelection.toString().trim() === '' ||
                (settings.allowMultiParagraphSelection === false && this.hasMultiParagraphs())) {
                this.hideToolbarActions();
            } else {
                selectionElement = this.getSelectionElement();
                if (!selectionElement) {
                    this.hideToolbarActions();
                } else {
                    this.checkSelectionElement(newSelection, selectionElement);
                }
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

      this.hideAnchorPreview();
      return this;
    },

    hideAnchorPreview: function () {
      this.anchorPreview.removeClass('is-active');
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
          this.callExtensions('checkState', parentNode);

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

      this.anchorForm.hide();
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
              editor = $(this),
              p;

          //debugger;
          editor.removeClass('editor-placeholder');
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

    setPlaceholders: function () {
          var activatePlaceholder = function (el) {
                  if (!(el.querySelector('img')) &&
                          !(el.querySelector('blockquote')) &&
                          el.textContent.replace(/^\s+|\s+$/g, '') === '') {
                      $(el).addClass('editor-placeholder');
                  }
              },
              placeholderWrapper = function (e) {
                  $(this).removeClass('editor-placeholder');
                  if (e.type !== 'keypress') {
                      activatePlaceholder(this);
                  }
              };

          activatePlaceholder(this.element[0]);
          this.element.on('blur', placeholderWrapper);
          this.element.on('keypress', placeholderWrapper);

          return this;
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
        return this;
      },

      editorAnchorObserver: function (e) {
        var self = this,
            overAnchor = true,
            leaveAnchor = function () {
                // mark the anchor as no longer hovered, and stop listening
                overAnchor = false;
                self.activeAnchor.off('mouseout.editor', leaveAnchor);
            };

        if (e.target && e.target.tagName.toLowerCase() === 'a') {
          // Detect empty href attributes
          // The browser will make href="" or href="#top"
          // into absolute urls when accessed as e.targed.href, so check the html
          if (!/href=["']\S+["']/.test(e.target.outerHTML) || /href=["']#\S+["']/.test(e.target.outerHTML)) {
              return true;
          }

          // only show when hovering on anchors
          if (this.toolbar.hasClass('is-active')) {
              // only show when toolbar is not present
              return true;
          }

          this.activeAnchor = $(e.target);
          this.activeAnchor.on('mouseout.editor', leaveAnchor);
          // show the anchor preview according to the configured delay
          // if the mouse has not left the anchor tag in that time
          setTimeout(function () {
              if (overAnchor) {
                  self.showAnchorPreview(e.target);
              }
          }, settings.delay);
        }
      },

      clickingIntoArchorForm: function (e) {
          var self = this;
          if (e.type && e.type.toLowerCase() === 'blur' && e.relatedTarget && e.relatedTarget === self.anchorInput) {
              return true;
          }
          return false;
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

      //Show Link in a Preview dialog. May not need.
      showAnchorPreview: function (anchorEl) {

        if (this.anchorPreview.hasClass('is-active')) {
            return true;
        }

        var self = this,
            buttonHeight = 40,
            boundary = anchorEl.getBoundingClientRect(),
            middleBoundary = (boundary.left + boundary.right) / 2,
            halfOffsetWidth,
            defaultLeft,
            timer;

        self.anchorPreview.find('i').text(anchorEl.href);
        halfOffsetWidth = self.anchorPreview[0].offsetWidth / 2;
        defaultLeft = settings.diffLeft - halfOffsetWidth;

        clearTimeout(timer);
        timer = setTimeout(function () {
            if (self.anchorPreview && !self.anchorPreview.hasClass('is-active')) {
                self.anchorPreview.addClass('is-active');
            }
        }, 100);

        self.observeAnchorPreview($(anchorEl));

        self.anchorPreview.addClass('toolbar-arrow-over').removeClass('toolbar-arrow-under');
        self.anchorPreview.css('top', Math.round(buttonHeight + boundary.bottom - settings.diffTop + window.pageYOffset - self.anchorPreview[0].offsetHeight) + 'px');
        if (middleBoundary < halfOffsetWidth) {
          self.anchorPreview.css('left', defaultLeft + halfOffsetWidth + 'px');
        } else if ((window.innerWidth - middleBoundary) < halfOffsetWidth) {
          self.anchorPreview.css('left', window.innerWidth + defaultLeft - halfOffsetWidth + 'px');
        } else {
          self.anchorPreview.css('left', defaultLeft + middleBoundary + 'px');
        }

        return this;
      },
      observeAnchorPreview: function (anchorEl) {
        var self = this,
            lastOver = (new Date()).getTime(),
            over = true,
            stamp = function () {
              lastOver = (new Date()).getTime();
              over = true;
            },
            unstamp = function (e) {
              if (!e.relatedTarget || !/anchor-preview/.test(e.relatedTarget.className)) {
                  over = false;
              }
            },
            timer = setInterval(function () {
              if (over) {
                  return true;
              }
              var durr = (new Date()).getTime() - lastOver;
              if (durr > settings.anchorPreviewHideDelay) {
                // hide the preview 1/2 second after mouse leaves the link
                self.hideAnchorPreview();

                // cleanup
                clearInterval(timer);
                self.anchorPreview.off('mouseover', stamp);
                self.anchorPreview.off('mouseout', unstamp);
                anchorEl.off('mouseover', stamp);
                anchorEl.off('mouseout', unstamp);
              }
            }, 200);

        self.anchorPreview.on('mouseover', stamp);
        self.anchorPreview.on('mouseout', unstamp);
        anchorEl.on('mouseover', stamp);
        anchorEl.on('mouseout', unstamp);
      },

      //Run the CE action.
      execAction: function (action, e) {
        if (action.indexOf('append-') > -1) {
            this.execFormatBlock(action.replace('append-', ''));
            this.setToolbarPosition();
            this.setToolbarButtonStates();
        } else if (action === 'anchor') {
            this.triggerAnchorAction(e);
        } else if (action === 'image') {
            document.execCommand('insertImage', false, window.getSelection());
        } else {
            document.execCommand(action, false, null);
            this.setToolbarPosition();
        }
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

      triggerAnchorAction: function () {
        var selectedParentElement = this.getSelectedParentElement();
        if (selectedParentElement.tagName &&
                selectedParentElement.tagName.toLowerCase() === 'a') {
            document.execCommand('unlink', false, null);
        } else {
            if (this.anchorForm.is(':visible')) {
                this.showToolbarActions();
            } else {
                this.showAnchorForm();
            }
        }
        return this;
      },

      //Get WHat is Selected
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

  $.fn.dropdown = function(options) {

    // Dropdown Settings and Options
    var pluginName = 'dropdown',
        defaults = {
          editable: 'false' //TODO
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
        this.orgLabel = this.element.hide().prev('.label');

        this.label = $('<label class="label"></label>').attr('for', id).text(this.orgLabel.text());
        this.input = $('<input type="text" readonly class="dropdown" tabindex="0"/>').attr({'role': 'combobox'})
                        .attr({'aria-autocomplete': 'none', 'aria-owns': 'dropdown-list'})
                        .attr({'aria-readonly': 'true', 'aria-activedescendant': 'dropdown-opt16'})
                        .attr('id', id);

        this.element.after(this.label, this.input, this.trigger);
        this.orgLabel.hide();
        this.updateList();
        this.setValue();
        this.setWidth();
        this._bindEvents();
      },
      setWidth: function() {
        var style = this.element[0].style,
          labelStyle = this.orgLabel[0].style;

        if (style.width) {
          this.input.width(style.width);
        }
        if (style.position === 'absolute') {
          this.input.css({position: 'absolute', left: style.left, top: style.top, bottom: style.bottom, right: style.right});
        }
        if (labelStyle.position === 'absolute') {
          this.label.css({position: 'absolute', left: labelStyle.left, top: labelStyle.top, bottom: labelStyle.bottom, right: labelStyle.right});
        }
      },
      updateList: function() {
        var self = this;
        //Keep a list generated and append it when we need to.
        self.list = $('<ul id="dropdown-list" class="dropdown-list" tabindex="-1" aria-expanded="true"></ul>');

        self.element.find('option').each(function(i) {
          var option = $(this),
              listOption = $('<li id="list-option'+ i +'" role="option" class="dropdown-option" role="listitem" tabindex="-1">'+ option.text() + '</li>');
          self.list.append(listOption);
          if (option.is(':selected')) {
            listOption.addClass('is-selected');
          }
        });

        //TODO : Call source - Ajax.
      },

      setValue: function() {

        //Set initial value for the edit box
       this.input.val(this.element.find('option:selected').text());
      },

      _bindEvents: function() {
        var self = this,
          timer, buffer = '';

        //Bind mouse and key events
        this.input.on('keydown.dropdown', function(e) {
          self.handleKeyDown($(this), e);
        }).on('keypress.dropdown', function(e) {
          var charCode = e.charCode || e.keyCode;

          //Needed for browsers that use keypress events to manipulate the window.
          if (e.altKey && (charCode === 38 || charCode === 40)) {
            e.stopPropagation();
            return false;
          }

          if (charCode === 13) {
            e.stopPropagation();
            return false;
          }

          //Printable Chars Jump to first high level node with it...
           if (e.which !== 0) {
            var term = String.fromCharCode(e.which),
              opts = $(self.element[0].options);

            buffer += term.toLowerCase();
            clearTimeout(timer);
            setTimeout(function () {
              buffer ='';
            }, 700);

            opts.each(function () {
              if ($(this).text().substr(0, buffer.length).toLowerCase() === buffer) {
                self.selectOption($(this));
                return false;
              }
            });
          }

          return true;
        }).on('mouseup.dropdown', function() {
          self.openList();
        });

      },

      openList: function() {
        var current = this.list.find('.is-selected'),
            self =  this,
            isFixed = false,
            isAbs = false;

        this.list.appendTo('body').show().attr('aria-expanded', 'true');
        this.list.css({'top': this.input.position().top , 'left': this.input.position().left});

        this.input.parentsUntil('body').each(function () {
          if ($(this).css('position') === 'fixed') {
            isFixed = true;
            return;
          }

        });

        if (this.input.parent('.field').css('position') === 'absolute') {
          isAbs = true;
          this.list.css({'top': this.input.parent('.field').position().top + this.input.prev('label').height() , 'left': this.input.parent('.field').position().left});
       }

        if (isFixed) {
          this.list.css('position', 'fixed');
        }

        //let grow or to field size.
        if (this.list.width() > this.input.outerWidth()) {
           this.list.css({'width': this.list.width() + 15});
        } else {
           this.list.width(this.input.outerWidth());
        }

        this.scrollToOption(current);
        this.input.addClass('is-open');

        //TODO: Animate this.list.css('height', 0);
        //this.list.slideUp();

        self.list.on('click.list', 'li', function () {
          var idx = $(this).index(),
              cur = $(self.element[0].options[idx]);

          // select the clicked item
          self.selectOption(cur);
          self.input.focus();
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
          self.toggleList(true);
          e.stopPropagation();
          return false;
        }

        switch (e.keyCode) {
          case 8:    //backspace
          case 46: { //del
            // prevent the edit box from being changed
            this.input.val(selectedText);
            e.stopPropagation();
            return false;
          }
          case 9: {  //tab - save the current selection

            this.selectOption($(options[selectedIndex]));

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
              self.selectOption($(options[selectedIndex])); // store the current selection
              self.closeList(false);  // Close the option list
            } else {
              self.openList(false);
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
          this.openList();
        }
      },
      selectOption: function(option) {
        var code = option.val();

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
        this.element.val(code).trigger('change');

        this.input.focus();  //scroll to left
        this.input[0].setSelectionRange(0, 0);
      },
      destroy: function() {
        $.removeData(this.obj, pluginName);
        this.input.off().remove();
        $(document).off('click.dropdown');
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

        this.element.find('.btn-close').on('click.modal', function() {
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
        body.find('.inforFormButton.default.btn-close').remove();

        $.each(buttons, function (name, props) {
          var btn = $('<button type="button" class="inforFormButton"></button>');
          btn.text(props.text);
          if (props.isDefault) {
            btn.addClass('default');
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
      open: function () {
        var self = this;

        this.overlay.appendTo('body');
        this.element.addClass('is-visible').attr('role', 'dialog');

        //Look for other nested dialogs and adjust the zindex.
        $('.modal').each(function (i) {
          var modal = $(this);
          modal.css('z-index', '900' + (i + 1));

          if (modal.data('modal') && modal.data('modal').overlay) {
            modal.data('modal').overlay.css('z-index', '100' + i);
          }

        });

        setTimeout(function () {
          self.element.find('.modal-title').focus();
          self.keepFocus();
        }, 300);

        $('body > *').not(this.element).attr('aria-hidden', 'true');
        $('body').addClass('modal-engaged');

        //Handle Default button.
        $(document).on('keypress.modal', function (e) {
          var target = $(e.target);

          if (target.is('textarea') || target.is(':button') || target.is('.inforDropDownList')
              || target.is('.inforSearchField') || target.closest('.inforDataGrid').length > 0) {
            return;
          }
          if (e.which === 13) {
            self.element.find('.inforFormButton.default').trigger('click');
          }
        });
      },

      keepFocus: function() {
        var self = this,
          allTabbableElements = $(self.element).find('a[href], area[href], input:not([disabled]),' +
            'select:not([disabled]), textarea:not([disabled]),' +
            'button:not([disabled]), iframe, object, embed, *[tabindex],' +
            '*[contenteditable]'),
          firstTabbableElement = allTabbableElements[0],
          lastTabbableElement = allTabbableElements[allTabbableElements.length - 1];
          console.log(allTabbableElements);

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
        this.element.removeClass('is-visible');
        $(document).off('keypress.modal');

        this.overlay.remove();
        $('body').removeClass('modal-engaged');
        $('body > *').not(this.element).removeAttr('aria-hidden');

        //Fire Events
        this.element.trigger('close');
        this.element.find('.modal-body > div').trigger('close');  //trigger on the content for messages

        if (settings.close) { //Fire Event if passed as an option.
          settings.close(this.element);
        }

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
