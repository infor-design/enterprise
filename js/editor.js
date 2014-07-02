/*
* Infor (RichText) Editor
*/
(function ($) {
  $.fn.editor = function(options) {

    // Settings and Options
    var pluginName = 'editor',
        defaults = {
          anchorInputPlaceholder: 'Paste or type a link',
          anchorPreviewHideDelay: 600,
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

        elem.attr('contentEditable', true);

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
        toolbar.append(this.toolbarFormAnchor()).insertAfter(this.element);
        return toolbar;
      },
      toolbarFormAnchor: function () {
          var anchor = $('<div class="editor-toolbar-form-anchor"></div>').attr('id', 'editor-toolbar-form-anchor'),
            id = 'editor-toolbar-form-anchor-input'+ this.id;

          $('<label class="scr-only">Anchor</label>').attr('for', id).appendTo(anchor);
          $('<input type="text">').attr('placeholder', settings.anchorInputPlaceholder).attr('id', id).appendTo(anchor);
          $('<a class="link"></a>').attr('href', '#').html('&times;').appendTo(anchor);

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
              'bold': '<button type="button" class="editor-action editor-action-bold" title="Bold" data-action="bold" data-element="b">' + buttonLabels.bold + '</button>',
              'italic': '<button type="button" class="editor-action editor-action-italic" title="italic" data-action="italic" data-element="i">' + buttonLabels.italic + '</button>',
              'underline': '<button type="button" class="editor-action editor-action-underline" title="underline" data-action="underline" data-element="u">' + buttonLabels.underline + '</button>',
              'strikethrough': '<button type="button" class="editor-action editor-action-strikethrough" title="strike through" data-action="strikethrough" data-element="strike"><strike>A</strike></button>',
              'superscript': '<button type="button" class="editor-action editor-action-superscript" title="superscript" data-action="superscript" data-element="sup">' + buttonLabels.superscript + '</button>',
              'subscript': '<button type="button" class="editor-action editor-action-subscript" title="subscript" data-action="subscript" data-element="sub">' + buttonLabels.subscript + '</button>',
              'seperator': '<div class="editor-toolbar-seperator"></div>',
              'anchor': '<button type="button" class="editor-action editor-action-anchor" title="insert anchor" data-action="anchor" data-element="a">' + buttonLabels.anchor + '</button>',
              'image': '<button type="button" class="editor-action editor-action-image" title="insert image" data-action="image" data-element="img">' + buttonLabels.image + '</button>',
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

        anchorPreview.html(this.anchorPreviewTemplate()).insertAfter(self.element);
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
            self.element.focus();
            self.keepToolbarAlive = false;
        }).on('mousedown.editor', 'button', function () {
          self.keepToolbarAlive = true;
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

        this.element.on('mouseup.editor', this.selectionHandler);
        this.element.on('keyup.editor', this.selectionHandler);
        this.element.on('blur.editor', function(e) {
          if (settings.staticToolbar && !self.keepToolbarAlive) {
            self.keepToolbarAlive = false;
            self.hideToolbarActions();
            return;
          }
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
            this.insertImage();
        } else {
            document.execCommand(action, false, null);
            this.setToolbarPosition();
        }
      },

      insertImage: function () {
        document.execCommand('insertImage', false, 'http://placekitten.com/200/300');
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
