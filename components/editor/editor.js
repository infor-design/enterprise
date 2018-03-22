/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */

import { Environment as env } from '../utils/environment';
import { debounce } from '../utils/debounced-resize';
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

const COMPONENT_NAME = 'editor';

/**
* The Editor Component is displays and edits markdown.
*
* @class Editor
* @param {string} element The component element.
* @param {string} [settings] The component settings.
* @param {string} [settings.buttons =
* { editor: [ 'header1', 'header2', 'separator', 'bold', 'italic', 'underline', 'strikethrough',
* 'separator', 'foreColor', 'backColor', 'separator', 'justifyLeft', 'justifyCenter', 'justifyRight', 'separator', 'quote', 'orderedlist',
* 'unorderedlist', 'separator', 'anchor', 'separator', 'image', 'separator', 'source' ], source: [ 'visual' ] }]
* An array with all the visible buttons in it.
* @param {string} [settings.excludeButtons = { editor: ['backColor'], source: [] }] An array with all the buttons in it to excloude
* @param {string} [settings.firstHeader = 'h3'] Allows you to set if the first header inserted is a h3 or h4 element.
* You should set this to match the structure of the parent page for accessibility
* @param {boolean} [settings.secondHeader = 'h4'] Allows you to set if the second header inserted is a h3 or
* h4 element. You should set this to match the structure of the parent page for accessibility
* @param {string} [settings.pasteAsPlainText = false] If true, when you paste into the editor the element will be unformatted to plain text.
* @param {string} [settings.anchor = { url: 'http://www.example.com', class: 'hyperlink', target: 'New window', isClickable: false, showIsClickable: false }] An object with settings related to controlling link behavior when inserted example: `{url: 'http://www.example.com', class: 'hyperlink', target: 'New window', isClickable: false, showIsClickable: false},` the url is the default url to display. Class should normally stay hyperlink and represents the styling class. target can be 'New window' or 'Same window', isClickable make the links appear clickable in the editor, showIsClickable will show a checkbox to allow the user to make clickable links in the link popup.
* @param {string} [settings.image = { url: 'http://lorempixel.com/output/cats-q-c-300-200-3.jpg' }] Info object to populate the image dialog defaulting to ` {url: 'http://lorempixel.com/output/cats-q-c-300-200-3.jpg'}`
* @param {function} [settings.onLinkClick = null] Call back for clicking on links to control link behavior.
*/
const EDITOR_DEFAULTS = {
  buttons: {
    editor: [
      'header1', 'header2',
      'separator', 'bold', 'italic', 'underline', 'strikethrough',
      'separator', 'foreColor', 'backColor',
      'separator', 'justifyLeft', 'justifyCenter', 'justifyRight',
      'separator', 'quote', 'orderedlist', 'unorderedlist',
      'separator', 'anchor',
      'separator', 'image',
      'separator', 'source'
    ],
    source: [
      'visual'
    ]
  },
  excludeButtons: {
    editor: ['backColor'],
    source: []
  },
  delay: 200,
  firstHeader: 'h3',
  secondHeader: 'h4',
  placeholder: null,
  pasteAsPlainText: false,
  // anchor > target: 'Same window'|'New window'| any string value
  anchor: { url: 'http://www.example.com', class: 'hyperlink', target: 'New window', isClickable: false, showIsClickable: false },
  image: { url: 'http://lorempixel.com/output/cats-q-c-300-200-3.jpg' },
  onLinkClick: null
};

function Editor(element, settings) {
  this.settings = utils.mergeSettings(element, settings, EDITOR_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Editor Methods
Editor.prototype = {

  init() {
    const s = this.settings;
    this.isIe = env.browser.name === 'ie';
    this.isIeEdge = env.browser.name === 'edge';
    this.isIe11 = this.isIe && env.browser.version === '11';
    this.isMac = env.os.name === 'Mac OS X';
    this.isFirefox = env.browser.name === 'firefox';

    this.parentElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'];
    this.id = `${this.element.uniqueId('editor')}-id`;
    this.container = this.element.parent('.field, .field-short').addClass('editor-container');

    s.anchor = $.extend({}, EDITOR_DEFAULTS.anchor, s.anchor);
    s.image = $.extend({}, EDITOR_DEFAULTS.image, s.image);

    s.anchor.defaultUrl = s.anchor.url;
    s.anchor.defaultClass = s.anchor.class;
    s.anchor.defaultTargetText = s.anchor.target;
    s.anchor.defaultIsClickable = s.anchor.isClickable;

    s.anchor.targets = s.anchor.targets || {
      'Same window': '',
      'New window': '_blank'
    };

    $.each(this.settings.anchor.targets, (key, val) => {
      if ((this.settings.anchor.defaultTargetText).toLowerCase() === (key).toLowerCase()) {
        this.settings.anchor.target = val;
        this.settings.anchor.defaultTarget = val;
      }
    });

    if (!s.anchor.defaultTarget) {
      if (s.anchor.target && $.trim(s.anchor.target).length) {
        s.anchor.defaultTarget = s.anchor.target;
      } else {
        s.anchor.defaultTargetText = 'Same window';
        s.anchor.defaultTarget = s.anchor.targets[s.anchor.defaultTargetText];
      }
    }

    return this.setup();
  },

  setup() {
    this.isActive = true;
    this.modals = {};

    this.initElements()
      .bindSelect()
      .bindPaste()
      .setPlaceholders()
      .bindWindowActions()
      .setupKeyboardEvents()
      .onPasteTriggered();
  },

  initElements() {
    // Make it an editor
    this.element.attr({
      contentEditable: true,
      'aria-multiline': true,
      role: 'textbox'
    });

    // Bind functionality for Pre elements. We dont use this yet but could if we
    // want to edit code blocks.
    this.element.attr('data-editor', true);
    this.bindParagraphCreation().bindTab();

    this.initToolbar()
      .bindButtons()
      .bindModals()
      .bindAnchorPreview();

    // Build the textarea that will be used as source view and for content serialization
    this.initTextarea();
    return this;
  },

  // Returns true if the source view is currently active.
  sourceViewActive() {
    return this.element.hasClass('source-view-active');
  },

  // Bind Events for the place holder
  setPlaceholders() {
    this.element
      .on('blur.editor', () => this.togglePlaceHolder())
      .on('keypress.editor', () => this.togglePlaceHolder());

    this.togglePlaceHolder();
    return this;
  },

  togglePlaceHolder() {
    if (this.element.text().trim() === '') {
      this.element.addClass('editor-placeholder');
    } else {
      this.element.removeClass('editor-placeholder');
    }
  },

  // Returns the currently visible element - either the main editor window,
  // or the source-view textarea
  getCurrentElement() {
    return this.sourceViewActive() ? this.textarea : this.element;
  },

  bindParagraphCreation() {
    const currentElement = this.getCurrentElement();
    currentElement.on('keyup.editor', (e) => {
      let node = this.getSelectionStart();
      let tagName;

      if (node && node.getAttribute('data-editor') && node.children.length === 0) {
        document.execCommand('formatBlock', false, 'p');
      }

      if (e.which === 13) {
        node = this.getSelectionStart();
        tagName = node.tagName.toLowerCase();

        if (tagName !== 'li' && !this.isListItemChild(node)) {
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

  bindTab() {
    const currentElement = this.getCurrentElement();

    currentElement.on('keydown.editor', (e) => {
      if (e.which === 9) {
        // Override tab only for pre nodes
        const tag = this.getSelectionStart().tagName.toLowerCase();
        if (tag === 'pre') {
          e.preventDefault();
          document.execCommand('insertHtml', null, '    ');
        }
        // Tab to indent list structures!
        if (tag === 'li') {
          // If Shift is down, outdent, otherwise indent
          document.execCommand((e.shiftKey ? 'outdent' : 'indent'), e);
        }
      }
    });

    return this;
  },

  // Builds a fake element and gets the name of the event that will be used for "paste"
  // Used for cross-browser compatability.
  getPasteEvent() {
    const el = document.createElement('input');
    const name = 'onpaste';
    el.setAttribute(name, '');
    return `${((typeof el[name] === 'function') ? 'paste' : 'input')}.editor`;
  },

  initToolbar() {
    if (this.toolbar) {
      return this;
    }

    this.createToolbar();
    return this;
  },

  // Set excluded buttons
  setExcludedButtons() {
    const excludeButtons = (elements, toExclude) => {
      let separatorIndex = -1;
      let numOfExcluded = 0;

      return elements.filter((x, i) => {
        let r = true;
        // Exclude matching buttons but keep separator/s
        if (toExclude.indexOf(x) > -1 && x !== 'separator') {
          numOfExcluded++;
          r = false;
        } else if (x === 'separator' && ((i - numOfExcluded - 1) === separatorIndex)) {
          // Exclude extra separator/s
          numOfExcluded = 0;
          r = false;
        }
        if (x === 'separator') {
          separatorIndex = i;
        }
        return r;
      });
    };

    // Run only if it needs (excludeButtons)
    const setButtons = () => {
      const s = this.settings;
      const btns = s.buttons;
      const exBtns = s.excludeButtons;

      if (this.sourceViewActive()) {
        return (exBtns && exBtns.source && exBtns.source.length) ?
          excludeButtons(btns.source, exBtns.source) : btns.source;
      }
      return (exBtns && exBtns.editor && exBtns.editor.length) ?
        excludeButtons(btns.editor, exBtns.editor) : btns.editor;
    };
    return setButtons();
  },

  createToolbar() {
    const btns = this.setExcludedButtons();
    let toolbar = `<div class="toolbar editor-toolbar formatter-toolbar"
                   id="editor-toolbar-${this.id}">`;
    let buttonset = '<div class="buttonset">';

    for (let i = 0, l = btns.length; i < l; i += 1) {
      const btn = this.buttonTemplate(btns[i]);
      if (btn) {
        buttonset += btn;
      }
    }

    buttonset += '</div>';
    toolbar += `${buttonset}</div>`;

    this.toolbar = $(toolbar).insertBefore(this.sourceViewActive() ?
      this.element.prev() : this.element);
    this.toolbar.toolbar();

    // Invoke Tooltips
    this.toolbar.find('button[title]').tooltip();

    // Invoke colorpicker
    const cpElements = this.toolbar.find('[data-action="foreColor"], [data-action="backColor"]');
    cpElements.colorpicker({ placeIn: 'editor' });
    $('.trigger', cpElements).off('click.colorpicker');

    return this;
  },

  /**
  * Switch between source and editing toolbar.
  * @returns {void}
  */
  switchToolbars() {
    this.destroyToolbar();

    // Rebind everything to the new element
    this.setupTextareaEvents();
    this.initToolbar();
    this.bindButtons().bindModals().bindAnchorPreview();
    this.bindSelect().bindPaste().setupKeyboardEvents();
    this.toolbar.find('button').button();
  },

  initTextarea() {
    const self = this;
    if (this.textarea) {
      return this;
    }
    this.textarea = this.createTextarea();

    // fill the text area with any content that may already exist within the editor DIV
    this.textarea.text(this.element.html().toString());

    this.element.on('input.editor keyup.editor', debounce(function () {
      self.textarea.val(self.element.html().toString());
      // setting the value via .val doesn't trigger the change event
      $(this).trigger('change');
    }, 500));

    this.setupTextareaEvents();
    return this.textarea;
  },

  createTextarea() {
    this.sourceView = $('<div></div>').attr({
      class: 'editor-source editable hidden',
      id: `editor-source-${this.id}`
    }).insertBefore(this.element);

    $('<ul></ul>').addClass('line-numbers').appendTo(this.sourceView);
    const textareaContainer = $('<div class="text-container"></div>').appendTo(this.sourceView);

    const newTextareaID = `source-textarea-${($('[id^="source-textarea-"]').length + 1)}`;

    const labelContents = `${this.element.prev('.label').addClass('audible').text()} - HTML Source View`;

    $(`<label class="audible" for="${newTextareaID}">${labelContents}</label>`).appendTo(textareaContainer);

    const textarea = $(`<textarea id="${newTextareaID}" class="editable"></textarea>`).appendTo(textareaContainer);
    return textarea;
  },

  triggerClick(e, btn) {
    $(`button[data-action="${btn}"]`, this.toolbar).trigger('click.editor');
  },

  setupKeyboardEvents() {
    const self = this;
    const currentElement = this.getCurrentElement();
    const keys = {
      b: 66, // {Ctrl + B} bold
      e: 69, // {Ctrl + E} justifyCenter
      h: 72, // {Ctrl + H} anchor
      i: 73, // {Ctrl + I} italic --------with SHIFT: {Ctrl + Shift + I} image
      l: 76, // {Ctrl + L} justifyLeft
      bl: 55, // {Ctrl + + Shift + 7} bullet list
      n: 56, // {Ctrl + Shift + 8} numbered list
      q: 81, // {Ctrl + Q} blockquotes
      r: 82, // {Ctrl + R} justifyRight
      u: 85, // {Ctrl + U} underline
      h3: 51, // {Ctrl + 3} h3
      h4: 52, // {Ctrl + 4} h4
      sv: 192 // {Ctrl + ~} toggle source -or- visualview
    };

    currentElement.on('keydown.editor', (e) => {
      e = e || window.event;

      if (e.which) {
        keys.charCode = e.which;
      } else if (e.keyCode) {
        keys.charCode = e.keyCode;
      } else {
        keys.charCode = false;
      }

      switch (e.ctrlKey && keys.charCode) {
        case keys.h3:
          this.triggerClick(e, `append-${this.settings.firstHeader}`);
          break;
        case keys.h4:
          this.triggerClick(e, `append-${this.settings.secondHeader}`);
          break;
        case keys.b:
          this.triggerClick(e, 'bold');
          e.preventDefault();
          break;
        case keys.e:
          this.triggerClick(e, 'justifyCenter');
          break;
        case keys.h:
          this.triggerClick(e, 'anchor');
          e.preventDefault();
          break;
        case keys.i:
          this.triggerClick(e, e.shiftKey ? 'image' : 'italic');
          if (!e.shiftKey) {
            e.preventDefault();
          }
          break;
        case keys.bl:
          if (e.shiftKey) {
            this.triggerClick(e, 'insertunorderedlist');
          }
          e.preventDefault();
          break;
        case keys.l:
          if (!e.shiftKey) {
            this.triggerClick(e, 'justifyLeft');
          }
          e.preventDefault();
          break;
        case keys.n:
          if (e.shiftKey) {
            this.triggerClick(e, 'insertorderedlist');
          }
          break;
        case keys.q:
          this.triggerClick(e, 'append-blockquote');
          break;
        case keys.r:
          this.triggerClick(e, 'justifyRight');
          break;
        case keys.u:
          this.triggerClick(e, 'underline');
          e.preventDefault();
          break;
        case keys.sv:
          this.triggerClick(e, currentElement === this.element ? 'source' : 'visual');
          break;
        default:
          break;
      }
    });

    // Open link in new windows/tab, if clicked with command-key(for mac) or ctrl-key(for windows)
    this.element.on('mousedown.editor', 'a', function (e) {
      const href = $(this).attr('href');
      if (!self.isFirefox && ((self.isMac && e.metaKey) || (!self.isMac && e.ctrlKey))) {
        window.open(href, '_blank');
        e.preventDefault();
      }
    });

    this.element.on('updated.editor', () => {
      this.updated();
    });

    return this;
  },

  setupTextareaEvents() {
    // Adjust line numbers on input
    this.textarea.off('.editor').on('input.editor keyup.editor', () => {
      if (!(this.sourceView.hasClass('hidden'))) {
        this.adjustSourceLineNumbers();
      }
    }).on('focus.editor', () => {
      this.sourceView.addClass('is-focused');
    }).on('blur.editor', (e) => {
      this.sourceView.removeClass('is-focused');
      this.element.empty().html($.sanitizeHTML(this.textarea.val()));

      if (this.element.data('validate')) {
        this.element.data('validate').validate(this.element, true, e);
      }
    });

    return this;
  },

  adjustSourceLineNumbers() {
    const container = this.textarea.parent();
    const lineHeight = parseInt(getComputedStyle(this.textarea[0]).lineHeight, 10);
    const YPadding = (this.textarea.innerHeight() - this.textarea.height());

    this.textarea[0].style.height = '';

    const scrollHeight = this.textarea[0].scrollHeight;
    const lineNumberCount = Math.floor((scrollHeight - YPadding) / lineHeight);
    const numberList = this.sourceView.find('.line-numbers');
    const lastIdx = numberList.find('li').length;

    let list = '';
    let i = 0;

    if (!this.lineNumbers || lineNumberCount !== this.lineNumbers) {
      if (!this.lineNumbers) {
        // Build the list of line numbers from scratch
        this.lineNumbers = lineNumberCount;
        while (i < this.lineNumbers) {
          list += `<li role="presentation"><span>${(i + 1)}</span></li>`;
          i++;
        }
        numberList.append(list);
      } else if (this.lineNumbers < lineNumberCount) {
        // Add extra line numbers to the bottom
        while (i < (lineNumberCount - this.lineNumbers)) {
          list += `<li role="presentation"><span>${(lastIdx + i + 1)}</span></li>`;
          i++;
        }
        numberList.append(list);
      } else if (this.lineNumbers > lineNumberCount) {
        // Remove extra line numbers from the bottom
        i = this.lineNumbers - lineNumberCount;
        numberList.find('li').slice(-(i)).remove();
      }
      this.lineNumbers = lineNumberCount;
      container[0].style.width = `calc(100% - ${(numberList.outerWidth() + 1)}px)`;
    }
    if (scrollHeight !== this.textarea[0].scrollHeight) {
      this.adjustSourceLineNumbers();
      return;
    }

    this.textarea[0].style.height = `${numberList[0].scrollHeight}px`;
  },

  wrapTextInTags(insertedText, selectedText, action) {
    let tags;
    let finalText;
    switch (action) {
      case 'bold':
        tags = ['<b>', '</b>'];
        break;
      case 'italic':
        tags = ['<i>', '</i>'];
        break;
      case 'underline':
        tags = ['<u>', '</u>'];
        break;
      case 'strikethrough':
        tags = ['<strike>', '</strike>'];
        break;
      case 'append-blockquote':
        tags = ['<blockquote>', '</blockquote>'];
        break;
      default:
        tags = ['', ''];
    }

    if (action === 'anchor') {
      const alink = $(`<a href="${insertedText}">${selectedText}</a>`);

      if (this.settings.anchor.class && $.trim(this.settings.anchor.class).length) {
        alink.addClass(this.settings.anchor.class);
      }
      if (this.settings.anchor.target && $.trim(this.settings.anchor.target).length) {
        alink.attr('target', this.settings.anchor.target);
      }
      if (this.settings.anchor.isClickable) {
        alink.attr('contenteditable', false);
      } else {
        alink.removeAttr('contenteditable');
      }

      finalText = alink[0].outerHTML;
    } else {
      finalText = tags[0] + insertedText + selectedText + tags[1];
    }
    return finalText;
  },

  insertTextAreaContent(text, action) {
    const el = this.textarea[0];
    const val = el.value;

    let sel;
    let startPos;
    let endPos;
    let scrollTop;

    // Always have empty text
    text = text || '';

    if (document.selection && el.tagName === 'TEXTAREA') {
      // IE textarea support
      $(el).focus();
      sel = document.selection.createRange();
      sel.text = this.wrapTextInTags(text, sel.text, action);
      $(el).focus();
    } else if (el.selectionStart || el.selectionStart === '0') {
      // MOZILLA/NETSCAPE support
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
      el.value = el.value; // forces cursor to end
    }
  },

  buttonTemplate(btnType) {
    const buttonLabels = this.getButtonLabels(this.settings.buttonLabels);
    const buttonTemplates = {
      bold: `<button type="button" class="btn" title="${Locale.translate('ToggleBold')}" data-action="bold" data-element="b">${buttonLabels.bold}</button>`,

      italic: `<button type="button" class="btn" title="${Locale.translate('ToggleItalic')}" data-action="italic" data-element="i">${buttonLabels.italic}</button>`,

      underline: `<button type="button" class="btn underline" title="${Locale.translate('ToggleUnderline')}" data-action="underline" data-element="u">${buttonLabels.underline}</button>`,

      strikethrough: `<button type="button" class="btn" title="${Locale.translate('StrikeThrough')}" data-action="strikethrough" data-element="strike">${buttonLabels.strikethrough}</button>`,

      foreColor: `<button type="button" class="btn colorpicker-editor-button" title="${Locale.translate('TextColor')}" data-action="foreColor" data-element="foreColor">${buttonLabels.foreColor}</button>`,

      backColor: `<button type="button" class="btn colorpicker-editor-button" title="${Locale.translate('BackgroundColor')}" data-action="backColor" data-element="backColor">${buttonLabels.backColor}</button>`,

      superscript: `<button type="button" class="btn" title="${Locale.translate('Superscript')}" data-action="superscript" data-element="sup">${buttonLabels.superscript}</button>`,

      subscript: `<button type="button" class="btn" title="${Locale.translate('Subscript')}" data-action="subscript" data-element="sub">${buttonLabels.subscript}</button>`,

      separator: '<div class="separator"></div>',

      anchor: `<button type="button" class="btn" title="${Locale.translate('InsertAnchor')}" data-action="anchor" data-modal="modal-url-${this.id}" data-element="a">${buttonLabels.anchor}</button>`,

      image: `<button type="button" class="btn" title="${Locale.translate('InsertImage')}" data-action="image" data-modal="modal-image-${this.id}" data-element="img">${buttonLabels.image}</button>`,

      header1: `<button type="button" class="btn" title="${Locale.translate('ToggleH3')}" data-action="append-${this.settings.firstHeader}" data-element="${this.settings.firstHeader}">${buttonLabels.header1}</button>`,

      header2: `<button type="button" class="btn" title="${Locale.translate('ToggleH4')}" data-action="append-${this.settings.secondHeader}" data-element="${this.settings.secondHeader}">${buttonLabels.header2}</button>`,

      quote: `<button type="button" class="btn" title="${Locale.translate('Blockquote')}" data-action="append-blockquote" data-element="blockquote">${buttonLabels.quote}</button>`,

      orderedlist: `<button type="button" class="btn" title="${Locale.translate('OrderedList')}" data-action="insertorderedlist" data-element="ol">${buttonLabels.orderedlist}</button>`,

      unorderedlist: `<button type="button" class="btn" title="${Locale.translate('UnorderedList')}" data-action="insertunorderedlist" data-element="ul">${buttonLabels.unorderedlist}</button>`,

      justifyLeft: `<button type="button" class="btn" title="${Locale.translate('JustifyLeft')}" data-action="justifyLeft" >${buttonLabels.justifyLeft}</button>`,

      justifyCenter: `<button type="button" class="btn" title="${Locale.translate('JustifyCenter')}" data-action="justifyCenter">${buttonLabels.justifyCenter}</button>`,

      justifyRight: `<button type="button" class="btn" title="${Locale.translate('JustifyRight')}" data-action="justifyRight" >${buttonLabels.justifyRight}</button>`,

      source: `<button type="button" class="btn" title="${Locale.translate('ViewSource')}" data-action="source" >${buttonLabels.source}</button>`,

      visual: `<button type="button" class="btn" title="${Locale.translate('ViewVisual')}" data-action="visual" >${buttonLabels.visual}</button>`
    };
    return buttonTemplates[btnType] || false;
  },

  getIcon(textName, iconName, className) {
    return `<span class="audible">${Locale.translate(textName)}</span>${$.createIcon({ classes: (className || ''), icon: iconName })}`;
  },

  getButtonLabels(buttonLabelType) {
    const buttonLabels = {
      bold: this.getIcon('Bold', 'bold'),
      italic: this.getIcon('Italic', 'italic'),
      underline: this.getIcon('Underline', 'underline'),
      superscript: '<span aria-hidden="true"><b>x<sup>1</sup></b></span>',
      subscript: '<span aria-hidden="true"><b>x<sub>1</sub></b></span>',
      strikethrough: this.getIcon('StrikeThrough', 'strike-through'),
      foreColor: this.getIcon('TextColor', 'fore-color'),
      backColor: this.getIcon('BackgroundColor', 'back-color'),
      anchor: this.getIcon('InsertAnchor', 'link'),
      image: this.getIcon('InsertImage', 'insert-image'),
      header1: this.getIcon('ToggleH3', 'h3'),
      header2: this.getIcon('ToggleH4', 'h4'),
      quote: this.getIcon('Blockquote', 'quote'),
      orderedlist: this.getIcon('OrderedList', 'number-list'),
      unorderedlist: this.getIcon('UnorderedList', 'bullet-list'),
      pre: '<span aria-hidden="true"><b>0101</b></span>',
      indent: '<span aria-hidden="true"><b>&rarr;</b></span>',
      outdent: '<span aria-hidden="true"><b>&larr;</b></span>',
      justifyLeft: this.getIcon('JustifyLeft', 'left-text-align'),
      justifyCenter: this.getIcon('JustifyCenter', 'center-text'),
      justifyRight: this.getIcon('JustifyRight', 'right-text-align'),
      source: this.getIcon('ViewSource', 'html', 'html-icon'),
      visual: this.getIcon('ViewSource', 'visual', 'visual-icon')
    };

    let customButtonLabels;

    if (typeof buttonLabelType === 'object') {
      customButtonLabels = buttonLabelType;
    }
    if (typeof customButtonLabels === 'object') {
      for (const attrname in customButtonLabels) {
        if (customButtonLabels.hasOwnProperty(attrname)) {// eslint-disable-line
          buttonLabels[attrname] = customButtonLabels[attrname];
        }
      }
    }
    return buttonLabels;
  },

  // Show the Buttons
  activateButton(tag) {
    this.toolbar.find(`[data-element="${tag}"]`).addClass('is-active');
  },

  // Bind Events to Toolbar Buttons
  bindButtons() {
    const self = this;

    this.toolbar.on('touchstart.editor click.editor', 'button', function (e) {
      const btn = $(this);
      const action = btn.attr('data-action');

      // Don't do anything if it's the More Button
      if (btn.is('.btn-actions')) {
        return;
      }

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

  bindModals() {
    const self = this;

    this.modals = {
      url: this.createURLModal(),
      image: this.createImageModal()
    };

    $(`[name="em-target-${this.id}"]`).dropdown();

    $(`#modal-url-${this.id}, #modal-image-${this.id}`).modal()
      .on('beforeopen', function () {
        self.savedSelection = self.saveSelection();

        if ($(this).attr('id') === (`modal-url-${self.id}`)) {
          if (!self.selectionRange) {
            return undefined;
          }
        }
      })
      .off('open')
      .on('open', function () {
        const isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const id = $(this).attr('id');
        const input = $('input:first', this);
        const button = $('.modal-buttonset .btn-modal-primary', this);

        $(`[name="em-url-${self.id}"]`).val(self.settings.anchor.url);
        $(`[name="em-class-${self.id}"]`).val(self.settings.anchor.class);
        $(`[name="em-target-${self.id}"]`).val(self.settings.anchor.target).trigger('updated');
        $(`[name="em-isclickable-${this.id}"]`).prop('checked', self.settings.anchor.isClickable);

        setTimeout(() => {
          if (isTouch && id === `modal-image-${self.id}`) {
            button.focus();
          } else {
            input.focus().select();
          }
        }, 10);
      })
      .off('close')
      .on('close', function (e, isCancelled) {
        self.restoreSelection(self.savedSelection);

        if (isCancelled) {
          return;
        }

        // insert image or link
        if ($(this).attr('id') === (`modal-url-${self.id}`)) {
          const currentLink = $(self.findElementInSelection('a', self.element[0]));
          if (currentLink.length) {
            self.updateCurrentLink(currentLink);
          } else {
            self.createLink($(`[name="em-url-${self.id}"]`, this));
          }
        } else {
          self.insertImage($('#image').val());
        }
      });

    return this;
  },

  /**
  * Function that creates the Url Modal Dialog. This can be customized by making
   a modal with ID `#modal-url-${this.id}`
  * @private
  * @returns {void}
  */
  createURLModal() {
    const s = this.settings;
    const urlModal = $(`#modal-url-${this.id}`);

    if (urlModal.length > 0) {
      return urlModal;
    }

    let targetOptions = '';
    let isTargetCustom = true;

    $.each(s.anchor.targets, (key, val) => {
      targetOptions += `<option value="${val}">${key}</option>`;
      if ((this.settings.anchor.defaultTargetText).toLowerCase() === (key).toLowerCase()) {
        isTargetCustom = false;
      }
    });

    if (isTargetCustom) {
      targetOptions += `<option value="${s.anchor.target}">${s.anchor.target}</option>`;
    }
    // TODO: Rename to link when you get strings
    return $(`<div class="modal editor-modal-url" id="modal-url-${this.id}"></div>`)
      .html(`<div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title">${Locale.translate('InsertAnchor')}</h1>
        </div>
        <div class="modal-body">
          <div class="field">
            <label for="em-url-${this.id}">${Locale.translate('Url')}</label>
            <input id="em-url-${this.id}" name="em-url-${this.id}" type="text" value="${s.anchor.url}">
          </div>
          ${(s.anchor.showIsClickable ? (`<div class="field">
            <input type="checkbox" class="checkbox" id="em-isclickable-${this.id}" name="em-isclickable-${this.id}" checked="${s.anchor.isClickable}">
            <label for="em-isclickable-${this.id}" class="checkbox-label"> ${Locale.translate('Clickable')}</label>
          </div>`) : '')}
          <div class="field">
            <label for="em-class-${this.id}">${Locale.translate('CssClass')}</label>
            <input id="em-class-${this.id}" name="em-class-${this.id}" type="text" value="${s.anchor.class}">
          </div>
          <div class="field">
            <label for="em-target-${this.id}" class="label"> ${Locale.translate('Target')}</label>
            <select id="em-target-${this.id}" name="em-target-${this.id}" class="dropdown">
              ${targetOptions}
            </select>
          </div>
          <div class="modal-buttonset">
            <button type="button" class="btn-modal btn-cancel"> ${Locale.translate('Cancel')}</button>
            <button type="button" class="btn-modal-primary"> ${Locale.translate('Insert')}</button>
          </div>
        </div>
      </div>`).appendTo('body');
  },

  /**
   * Function that creates the Image Dialog. This can be customized by making a
    modal with ID `#modal-image-{this.id}`
   * @private
   * @returns {void}
   */
  createImageModal() {
    const imageModal = $(`#modal-image-${this.id}`);

    if (imageModal.length > 0) {
      return imageModal;
    }
    return $(`<div class="modal editor-modal-image" id="modal-image-${this.id}"></div>'`)
      .html(`<div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title">${Locale.translate('InsertImage')}</h1>
        </div>
        <div class="modal-body">
          <div class="field">
            <label for="image">${Locale.translate('Url')}</label>
            <input id="image" name="image" type="text" value="${this.settings.image.url}">
          </div>
          <div class="modal-buttonset">
            <button type="button" class="btn-modal btn-cancel">
              ${Locale.translate('Cancel')}</button>
            <button type="button" class="btn-modal-primary">
              ${Locale.translate('Insert')}</button>
          </div>
        </div>
      </div>`).appendTo('body');
  },

  bindAnchorPreview() {
    this.element.find('a').tooltip({
      content() {
        return $(this).attr('href');
      }
    });
  },

  updateCurrentLink(alink) {
    const emUrl = $(`[name="em-url${this.id}"]`).val();
    const emClass = $(`[name="em-class${this.id}"]`).val();
    const emTarget = $(`[name="em-target${this.id}"]`).val();
    const emIsClickable = this.settings.anchor.showIsClickable ? $(`[name="em-isclickable${this.id}"]`).is(':checked') : this.settings.anchor.isClickable;

    alink.attr('href', (emUrl && $.trim(emUrl).length ? emUrl : this.settings.anchor.defaultUrl));
    alink.attr('class', (emClass && $.trim(emClass).length ? emClass : this.settings.anchor.defaultClass));

    if (emIsClickable) {
      alink.attr('contenteditable', false);
    } else {
      alink.removeAttr('contenteditable');
    }

    if (emTarget && $.trim(emTarget).length) {
      alink.attr('target', emTarget);
    } else {
      alink.removeAttr('target');
    }
  },

  createLink(input) {
    // Restore Selection in the Editor and Variables
    this.restoreSelection(this.savedSelection);

    // Fix and Format the Link
    input.val(this.fixLinkFormat(input.val()));

    // Set selection url/class/target for Link
    this.settings.anchor.url = input.val();
    this.settings.anchor.class = $(`[name="em-class-${this.id}"]`).val();
    this.settings.anchor.target = $(`[name="em-target-${this.id}"]`).val();
    this.settings.anchor.isClickable = this.settings.anchor.showIsClickable ?
      $(`[name="em-isclickable-${this.id}"]`).is(':checked') : this.settings.anchor.isClickable;

    const alink = $(`<a href="${input.val()}">${input.val()}</a>`);

    if (this.settings.anchor.class && $.trim(this.settings.anchor.class).length) {
      alink.addClass(this.settings.anchor.class);
    }
    if (this.settings.anchor.target && $.trim(this.settings.anchor.target).length) {
      alink.attr('target', this.settings.anchor.target);
    }
    if (this.settings.anchor.isClickable) {
      alink.attr('contenteditable', false);
    } else {
      alink.removeAttr('contenteditable');
    }

    if (this.sourceViewActive()) {
      this.insertTextAreaContent(input.val(), 'anchor');
    } else {
      let sel;
      let range;
      let rangeStr;

      if (!this.selection.isCollapsed || this.isIe11) {
        // get example from: http://jsfiddle.net/jwvha/1/
        // and info: http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div
        if (window.getSelection) {
          // IE9 and non-IE
          sel = window.getSelection();
          if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            rangeStr = `${range}`;
            if (rangeStr.trim() !== '') {
              alink.html(rangeStr);
            }
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            const el = document.createElement('div');
            el.innerHTML = alink[0].outerHTML;
            const frag = document.createDocumentFragment();
            let node;
            let lastNode;

            while ((node = el.firstChild)) {// eslint-disable-line
              lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
              range = range.cloneRange();
              range.setStartAfter(lastNode);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }
        }
      } else {
        document.execCommand('insertHtml', null, alink[0].outerHTML);
        setTimeout(() => {
          this.getCurrentElement().focus();
        }, 1);
      }
      this.bindAnchorPreview();
    }
  },

  fixLinkFormat(value) {
    if (value.match(/^https?:\/\//)) {
      return value;
    }
    return `http://${value}`;
  },

  // Setup Events For Text Selection
  bindSelect() {
    let selectionTimer = '';

    this.selectionHandler = () => {
      clearTimeout(selectionTimer);
      selectionTimer = setTimeout(() => {
        this.checkSelection();
      }, this.settings.delay);
    };

    const currentElement = this.getCurrentElement();

    currentElement.off('mouseup.editor keyup.editor')
      .on('mouseup.editor keyup.editor', this.selectionHandler);

    return this;
  },

  checkSelection() {
    let newSelection;

    if (this.selection === undefined) {
      if (this.sourceViewActive()) {
        newSelection = this.textarea.val().substring(
          this.textarea[0].selectionStart,
          this.textarea[0].selectionEnd
        ).toString().trim();
        this.hideToolbarActions();
        return;
      }
    }

    newSelection = window.getSelection();
    const selectionElement = this.getSelectionElement();
    if (!selectionElement) {
      this.hideToolbarActions();
    } else {
      this.checkSelectionElement(newSelection, selectionElement);
    }
    return this;
  },

  getSelectionElement() {
    let range;
    let current;
    let parent;
    let result;
    const selection = window.getSelection();
    const getElement = (e) => {
      let localParent = e;
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
      result = current.getAttribute('data-editor') ? current : getElement(parent);
    // If not search in the parent nodes.
    } catch (err) {
      result = getElement(parent);
    }
    return result;
  },

  // See if the Editor is Selected and Show Toolbar
  checkSelectionElement(newSelection, selectionElement) {
    const currentElement = this.sourceViewActive() ? this.sourceView[0] : this.element[0];

    this.selection = newSelection;
    this.selectionRange = this.selection.getRangeAt(0);
    if (currentElement === selectionElement) {
      this.setToolbarButtonStates();
      return;
    }
    this.hideToolbarActions();
  },

  // Set button states for toolbar buttons
  setToolbarButtonStates() {
    this.toolbar.find('button').removeClass('is-active');
    this.checkActiveButtons();
    return this;
  },

  checkActiveButtons() {
    this.checkButtonState('bold');
    this.checkButtonState('italic');
    this.checkButtonState('underline');
    this.colorpickerButtonState('foreColor');
    if (this.toolbar.find('.buttonset [data-action="backColor"]').length) {
      this.colorpickerButtonState('backColor');
    }

    let parentNode = this.getSelectedParentElement();

    while (parentNode.tagName !== undefined &&
      this.parentElements.indexOf(parentNode.tagName.toLowerCase) === -1) {
      this.activateButton(parentNode.tagName.toLowerCase());

      // we can abort the search upwards if we leave the contentEditable element
      if (this.element.is(parentNode)) {
        break;
      }
      parentNode = parentNode.parentNode;
    }
  },

  checkButtonState(command) {
    if (!document.queryCommandState) {
      return;
    }

    if (document.queryCommandState(command)) {
      this.toolbar.find(`[data-action="${command}"]`).addClass('is-active');
    } else {
      this.toolbar.find(`[data-action="${command}"]`).removeClass('is-active');
    }
  },

  rangeSelectsSingleNode(range) {
    const startNode = range.startContainer;
    return startNode === range.endContainer &&
        startNode.hasChildNodes() &&
        range.endOffset === range.startOffset + 1;
  },

  getSelectedParentElement() {
    let selectedParentElement = null;
    const range = this.selectionRange;

    if (this.rangeSelectsSingleNode(range)) {
      selectedParentElement = range.startContainer.childNodes[range.startOffset];
    } else if (range.startContainer.nodeType === 3) {
      selectedParentElement = range.startContainer.parentNode;
    } else {
      selectedParentElement = range.startContainer;
    }
    return selectedParentElement;
  },

  // Hide Toolbar
  hideToolbarActions() {
    if (this.toolbar !== undefined) {
      this.toolbar.removeClass('is-active');
    }
  },

  // Handle Pasted In Text
  bindPaste() {
    const self = this;
    const currentElement = self.getCurrentElement();

    if (!self.pasteEvent) {
      self.pasteEvent = self.getPasteEvent();
    }

    this.pasteWrapper = function (e) {
      let paste;
      if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
        paste = e.originalEvent.clipboardData.getData('text/plain');// Standard
      } else {
        paste = window.clipboardData && window.clipboardData.getData ?
          window.clipboardData.getData('Text') : false;// MS : false
      }

      let p;
      let paragraphs;
      let html = '';

      if (self.sourceViewActive()) {
        return this;
      }

      if (paste && !e.defaultPrevented) {
        e.preventDefault();
        paragraphs = paste.split(/[\r\n]/g);

        for (p = 0; p < paragraphs.length; p += 1) {
          if (paragraphs[p] !== '') {
            if (navigator.userAgent.match(/firefox/i) && p === 0) {
              html += `<p>${self.htmlEntities(paragraphs[p])}</p>`;
            } else if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(paragraphs[p])) {
              html += `<img src="${self.htmlEntities(paragraphs[p])}" />`;
            } else {
              html += `<p>${self.htmlEntities(paragraphs[p])}</p>`;
            }
          }
        }

        if (document.queryCommandSupported('insertText')) {
          document.execCommand('insertHTML', false, html);
          return false;
        }
        // IE > 7
        self.pasteHtmlAtCaret(html);
      }
    };

    this.pasteWrapperHtml = function (e) {
      if (self.sourceViewActive()) {
        return this;
      }
      let types;
      let clipboardData;
      let pastedData;
      let paste;
      let p;
      let paragraphs;

      if (e.clipboardData || e.originalEvent) {
        if (e.clipboardData && e.clipboardData.types) {
          clipboardData = e.clipboardData;
        } else if (e.originalEvent && e.originalEvent.clipboardData &&
           e.originalEvent.clipboardData.getData) {
          clipboardData = e.originalEvent.clipboardData;
        }
      }

      if (clipboardData && clipboardData.types) {
        types = clipboardData.types;
        if ((types instanceof DOMStringList && types.contains('text/html')) ||
            (types.indexOf && types.indexOf('text/html') !== -1) || self.isIeEdge) {
          pastedData = e.originalEvent.clipboardData.getData('text/html');
        }
      } else {
        paste = window.clipboardData ? window.clipboardData.getData('Text') : '';
        paragraphs = paste.split(/[\r\n]/g);
        pastedData = '';
        for (p = 0; p < paragraphs.length; p += 1) {
          if (paragraphs[p] !== '') {
            if (navigator.userAgent.match(/firefox/i) && p === 0) {
              pastedData += `<p>${self.htmlEntities(paragraphs[p])}</p>`;
            } else if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(paragraphs[p])) {
              pastedData += `<img src="${self.htmlEntities(paragraphs[p])}" />`;
            } else {
              pastedData += `<p>${self.htmlEntities(paragraphs[p])}</p>`;
            }
          }
        }
      }

      self.pastedData = self.isIe11 ?
        pastedData : self.getCleanedHtml(pastedData);

      /**
      * Fires before paste.
      *
      * @event beforepaste
      * @memberof Editor
      * @type {object}
      * @property {object} event - The jquery event object
      * @property {string} pastedData .
      */
      $.when(self.element.triggerHandler('beforepaste', [{ pastedData: self.pastedData }])).done(() => {
        if (self.pastedData && !e.defaultPrevented) {
          if (!self.isIe11 && !self.isIeEdge) {
            e.preventDefault();
          }

          if (document.queryCommandSupported('insertText')) {
            document.execCommand('insertHTML', false, self.pastedData);
            return false;
          }
          self.pasteHtmlAtCaret(self.pastedData);
        }

        /**
        * Fires after paste.
        *
        * @event afterpaste
        * @memberof Editor
        * @type {object}
        * @property {object} event - The jquery event object
        * @property {string} pastedData .
        */
        self.element.triggerHandler('afterpaste', [{ pastedData: self.pastedData }]);
        self.pastedData = null;
      });
      if (!self.isIe11) {
        return false;
      }
    };

    currentElement.on(self.pasteEvent, (self.settings.pasteAsPlainText ?
      self.pasteWrapper : self.pasteWrapperHtml));

    return this;
  },

  pasteHtmlAtCaret(html) {
    const self = this;
    const templIE11 = 'x-text-content-templ-x';

    let sel;
    let range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        if (self.isIe11) {
          html = templIE11;
        }

        // Range.createContextualFragment() would be useful here but is
        // only relatively recently standardized and is not supported in
        // some browsers
        const el = document.createElement('div');

        el.innerHTML = html;

        const frag = document.createDocumentFragment();
        let node;
        let lastNode;

        while ((node = el.firstChild)) {// eslint-disable-line
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }

        // IE 11
        if (self.isIe11) {
          let maxRun = 50;
          const deferredIE11 = $.Deferred();

          const waitForPastedData = (elem, savedContent) => {
            maxRun--;
            if (maxRun < 0) {
              deferredIE11.reject();
              return;
            }
            // If data has been processes by browser, process it
            if (elem.childNodes && elem.childNodes.length > 0) {
              // Retrieve pasted content via innerHTML
              // (Alternatively loop through elem.childNodes or elem.getElementsByTagName here)
              html = elem.innerHTML;
              // self.pastedData = getCleanedHtml(elem.innerHTML);
              // Restore saved content
              elem.innerHTML = '';
              elem.appendChild(savedContent);
              deferredIE11.resolve();
            } else {
              // Else wait 5ms and try again
              setTimeout(() => {
                waitForPastedData(elem, savedContent);
              }, 5);
            }
          };

          // Everything else: Move existing element contents to a DocumentFragment for safekeeping
          const savedContent = document.createDocumentFragment();
          while (self.element[0].childNodes.length > 0) {
            savedContent.appendChild(self.element[0].childNodes[0]);
          }
          // Then wait for browser to paste content into it and cleanup
          waitForPastedData(self.element[0], savedContent);

          $.when(deferredIE11).done(() => {
            let str = '';
            let thisNode = self.element
              .find(`:contains(+ ${templIE11})`)
              .filter(function () {
                return (this.textContent === templIE11);
              });

            if (!thisNode.length) {
              thisNode = self.element
                .find(`:contains(+ ${templIE11})`)
                .filter(function () {
                  return (this.textContent.indexOf(templIE11) > -1 && this.tagName !== 'UL');
                });
            }

            html = self.getCleanedHtml(html);

            // Working with list
            // Start with "<li"
            if (/(^(\s+?)?<li)/ig.test(html)) {
              // Pasted data starts and ends with "li" tag
              if (/((\s+?)?<\/li>(\s+?)?$)/ig.test(html)) { // ends with "</li>"
                // Do not add "ul" if pasting on "li" node
                if (!thisNode.is('li')) {
                  html = `<ul>${html}</ul>`;
                }
                thisNode.replaceWith(html);
              } else if (thisNode.is('li')) {
                // Missing at the end "</li>" tag
                // Pasting on "li" node
                thisNode.replaceWith(`${html}</li>`);
              } else {
                // Not pasting on "li" node

                // If ul was closed and have extra nodes after list close
                str = (html.match(/<\/ul|<\/ol/gi) || []);
                // Pasted data contains "ul or ol" tags
                if (str.length) {
                  thisNode.replaceWith(html);
                } else {
                  thisNode.replaceWith(`${html}</li></ul>`);
                }
              }
            } else if (/((\s+?)?<\/li>(\s+?)?$)/ig.test(html)) {
              // Ends with "</li>" tag, but not started with "li" tag

              // Pasting on "li" node
              if (thisNode.is('li')) {
                thisNode.replaceWith(`<li>${html}`);
              } else {
                str = (html.match(/<ul|<ol/gi) || []);
                // Pasted data contains "ul or ol" tags
                if (str.length) {
                  html += (str[str.length - 1]).replace(/<(ul|ol)/gi, '<$1>');
                } else {
                  html = `<ul>${html}</ul>`;
                }
                thisNode.replaceWith(html);
              }
            }

            // Default case
            str = self.element[0].innerHTML;
            if (str.indexOf(templIE11) > -1) {
              str = str.replace(templIE11, html);
            }
            self.element[0].innerHTML = self.getCleanedHtml(str);
          });
        }
      }
    } else if (document.selection && document.selection.type !== 'Control') {
      document.selection.createRange().pasteHTML(html);
    }
  },

  // Get cleaned extra from html
  getCleanedHtml(pastedData) {
    let attributeStripper;
    let s = pastedData || '';

    const badAttributes = [
      'start', 'xmlns', 'xmlns:o', 'xmlns:w', 'xmlns:x', 'xmlns:m',
      'onmouseover', 'onmouseout', 'onmouseenter', 'onmouseleave',
      'onmousemove', 'onload', 'onfocus', 'onblur', 'onclick',
      'style'
    ];

    // Remove extra word formating
    if (this.isWordFormat(s)) {
      s = this.cleanWordHtml(s);
    }

    // Remove bad attributes
    for (let i = 0, l = badAttributes.length; i < l; i++) {
      attributeStripper = new RegExp(` ${badAttributes[i]}="(.*?)"`, 'gi');
      s = this.stripAttribute(s, badAttributes[i], attributeStripper);

      attributeStripper = new RegExp(` ${badAttributes[i]}='(.*?)'`, 'gi');
      s = this.stripAttribute(s, badAttributes[i], attributeStripper);
    }

    // Remove "ng-" directives and "ng-" classes
    s = s.replace(/(ng-\w+-\w+="(.|\n)*?"|ng-\w+="(.|\n)*?"|ng-(\w+-\w+)|ng-(\w+))/g, '');

    // Remove comments
    s = s.replace(/<!--(.*?)-->/gm, '');

    // Remove extra spaces
    s = s.replace(/\s\s+/g, ' ').replace(/\s>+/g, '>');

    // Remove extra attributes from list elements
    s = s.replace(/<(ul|ol)(.*?)>/gi, '<$1>');

    // Remove empty list
    s = s.replace(/<li><\/li>/gi, '');
    s = s.replace(/<(ul|ol)><\/(ul|ol)>/gi, '');

    // Remove html and body tags
    s = s.replace(/<\/?(html|body)(.*?)>/gi, '');

    // Remove header tag and content
    s = s.replace(/<head\b[^>]*>(.*?)<\/head>/gi, '');

    // Remove empty tags
    s = s.replace(/<[^/>]+>[\s]*<\/[^>]+>/gi, '');

    return s;
  },

  htmlEntities(str) {
    // converts special characters (like <) into their escaped/encoded values (like &lt;).
    // This allows you to show to display the string without the browser reading it as HTML.
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  bindWindowActions() {
    const editorContainer = this.element.closest('.editor-container');
    const currentElement = this.getCurrentElement();
    const self = this;

    this.element
    // Work around for Firefox with using keys was not focusing on first child in editor
    // Firefox behaves differently than other browsers
      .on('mousedown.editor', () => {
        this.mousedown = true;
      })
      .on('focus.editor', () => {
        if (this.isFirefox && !this.mousedown && this.element === currentElement) {
          this.setFocus();
        }
      })

      // Work around for Chrome's bug wrapping contents in <span>
      // http://www.neotericdesign.com/blog/2013/3/working-around-chrome-s-contenteditable-span-bug
      .on('DOMNodeInserted', (e) => {
        const target = $(e.target);
        const helper = $('<b>helper</b>');

        if (e.target.tagName === 'IMG') {
          target.removeAttr('id style srcset');
        } else if (e.target.tagName === 'SPAN') {
          target.before(helper);
          helper.after(target.contents());
          helper.add(target).remove();
        }
      });

    editorContainer
      .on('focus.editor', '.editor, .editor-source', function () {
        const elem = $(this);

        editorContainer.addClass('is-active');
        setTimeout(() => {
          if (elem.hasClass('error')) {
            editorContainer.parent().find('.editor-toolbar').addClass('error');
            editorContainer.parent().find('.editor-source').addClass('error');
          }
        }, 100);
      })
      .on('blur.editor', '.editor, .editor-source', () => {
        editorContainer.removeClass('is-active');
        editorContainer.parent().find('.editor-toolbar').removeClass('error');
        editorContainer.parent().find('.editor-source').removeClass('error');
      });

    if (self.settings.onLinkClick) {
      editorContainer.on('click.editorlinks', 'a', (e) => {
        self.settings.onLinkClick(e, this);
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
      });
    }

    // Attach Label
    const label = this.element.prevAll('.label');
    for (let i = 0, l = label.length; i < l; i++) {
      label[i].style.cursor = 'default';
    }
    label.on('click.editor', () => {
      currentElement.focus();
    });
    currentElement.attr('aria-label', label.text());
    return this;
  },

  // Restore Text Selection
  restoreSelection(savedSel) {
    const sel = window.getSelection();

    if (!savedSel) {
      savedSel = this.savedSelection;
    }

    if (savedSel) {
      sel.removeAllRanges();
      for (let i = 0, len = savedSel.length; i < len; i += 1) {
        sel.addRange(savedSel[i]);
      }
    }
  },

  // Save Text Selection
  saveSelection() {
    let ranges;
    const sel = window.getSelection();

    if (sel.getRangeAt && sel.rangeCount) {
      ranges = [];
      for (let i = 0, len = sel.rangeCount; i < len; i += 1) {
        ranges.push(sel.getRangeAt(i));
      }
      return ranges;
    }
    return null;
  },

  // Get the Element the Caret idea from http://bit.ly/1kRmZIL
  getSelectionStart() {
    const node = document.getSelection().anchorNode;
    const startNode = (node && node.nodeType === 3 ? node.parentNode : node);
    return startNode;
  },

  getrange() {
    return window.getSelection().getRangeAt(0);
  },

  // Find element within the selection
  // http://stackoverflow.com/questions/6052870/how-to-know-if-there-is-a-link-element-within-the-selection
  findElementInSelection(tagname, container) {
    let el;
    let comprng;
    let selparent;
    const rng = this.getrange();

    if (rng) {
      selparent = rng.commonAncestorContainer || rng.parentElement();
      // Look for an element *around* the selected range
      for (el = selparent; el !== container; el = el.parentNode) {
        if (el && el.tagName && el.tagName.toLowerCase() === tagname) {
          return el;
        }
      }

      // Look for an element *within* the selected range
      if (!rng.collapsed && (rng.text === undefined || rng.text) &&
       selparent.getElementsByTagName) {
        el = selparent.getElementsByTagName(tagname);
        comprng = document.createRange ? document.createRange() : document.body.createTextRange();

        for (let i = 0, len = el.length; i < len; i++) {
          // determine if element el[i] is within the range
          if (document.createRange) { // w3c
            comprng.selectNodeContents(el[i]);
            if (rng.compareBoundaryPoints(Range.END_TO_START, comprng) < 0 &&
             rng.compareBoundaryPoints(Range.START_TO_END, comprng) > 0) {
              return el[i];
            }
          } else { // microsoft
            comprng.moveToElementText(el[i]);
            if (rng.compareEndPoints('StartToEnd', comprng) < 0 && rng.compareEndPoints('EndToStart', comprng) > 0) {
              return el[i];
            }
          }
        }
      }
    }
  },

  // Restore if Selection is a Link
  restoreLinkSelection() {
    const currentLink = $(this.findElementInSelection('a', this.element[0]));

    this.settings.anchor.url = this.settings.anchor.defaultUrl;
    this.settings.anchor.class = this.settings.anchor.defaultClass;
    this.settings.anchor.target = this.settings.anchor.defaultTarget;
    this.settings.anchor.isClickable = this.settings.anchor.defaultIsClickable;

    if (currentLink.length) {
      this.settings.anchor.url = currentLink.attr('href');
      this.settings.anchor.class = currentLink.attr('class');
      this.settings.anchor.target = currentLink.attr('target');
      const contenteditable = currentLink.attr('contenteditable');

      if (contenteditable === false || contenteditable === 'false') {
        this.settings.anchor.isClickable = true;
      }
    }
  },

  // Run the CE action.
  execAction(action) {
    const currentElement = this.getCurrentElement();

    // Visual Mode
    if (currentElement === this.element) {
      if (action.indexOf('append-') > -1) {
        this.execFormatBlock(action.replace('append-', ''));
      } else if (action === 'anchor') {
        this.restoreLinkSelection();
        this.modals.url.data('modal').open();
      } else if (action === 'image') {
        this.modals.image.data('modal').open();
      } else if (action === 'foreColor' || action === 'backColor') {
        this.colorpickerActions(action);
      } else if (action === 'source' || action === 'visual') {
        this.toggleSource();
      } else {
        document.execCommand(action, false, null);
      }
    } else {
      // Source Mode
      switch (action) {
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

  insertImage(url) {
    document.execCommand('insertImage', false, url);
  },

  toggleSource() {
    if (this.sourceViewActive()) {
      this.element.empty().html($.sanitizeHTML(this.textarea.val()));
      this.element.removeClass('source-view-active hidden');
      this.sourceView.addClass('hidden').removeClass('is-focused');
      this.element.trigger('focus.editor');
    } else {
      // Format The Text being pulled from the WYSIWYG editor
      const val = this.element.html().toString().trim()
        .replace(/\s+/g, ' ')
        .replace(/<br( \/)?>/g, '<br>\n')
        .replace(/<\/p> /g, '</p>\n\n')
        .replace(/<\/blockquote>( )?/g, '</blockquote>\n\n');

      this.textarea.val(val).focus();

      // var val = this.element.html().toString();
      // this.textarea.val(this.formatHtml(val)).focus();

      this.element.addClass('source-view-active hidden');
      this.sourceView.removeClass('hidden');
      this.adjustSourceLineNumbers();
      this.textarea.focus();
    }
    this.switchToolbars();
  },

  // Set ['foreColor'|'backColor'] button icon color in toolbar
  colorpickerButtonState(action) {
    const cpBtn = $(`[data-action="${action}"]`, this.toolbar);
    const cpApi = cpBtn.data('colorpicker');

    let color = document.queryCommandValue(action);

    // Set selection color checkmark in picker popup
    // by adding/updating ['data-value'] attribute
    if (cpApi) {
      if (this.isFirefox && action === 'backColor') {
        color = $(window.getSelection().focusNode.parentNode).css('background-color');
      }
      // IE-11 queryCommandValue returns the as decimal
      if (typeof color === 'number') {
        color = cpApi.decimal2rgb(color);
      }
      color = cpApi.rgb2hex(color);
      cpBtn.attr('data-value', color).find('.icon').css('fill', color);
    }
    return { cpBtn, cpApi, color };
  },

  // Colorpicker actions ['foreColor'|'backColor']
  colorpickerActions(action) {
    const state = this.colorpickerButtonState(action);
    const cpBtn = state.cpBtn;
    const cpApi = state.cpApi;

    cpBtn.on('selected.editor', (e, item) => {
      const value = (`#${item.data('value')}`).toLowerCase();
      cpBtn.attr('data-value', value).find('.icon').css('fill', value);

      if (this.isIe || action === 'foreColor') {
        document.execCommand(action, false, value);
      } else {
        // [action: backColor] - for Chrome/Firefox/Safari
        // Get selection parent element
        const getSelectionParentElement = function () {
          let parentEl = null;
          let sel;
          if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
              parentEl = sel.getRangeAt(0).commonAncestorContainer;
              if (parentEl.nodeType !== 1) {
                parentEl = parentEl.parentNode;
              }
            }
          } else if ((sel = document.selection) && sel.type !== 'Control') {// eslint-disable-line
            parentEl = sel.createRange().parentElement();
          }
          return parentEl;
        };

        // FIX: "backColor" - Chrome/Firefox/Safari
        // some reason font/span node not get inserted with "backColor"
        // so use "fontSize" command to add node, then remove size attribute
        // this fix will conflict with combination of font size & background color
        document.execCommand('fontSize', false, '2');
        const parent = getSelectionParentElement().parentNode;
        const els = parent.getElementsByTagName('font');

        // Using timeout, firefox not executes with current call stack
        setTimeout(() => {
          for (let i = 0, l = els.length; i < l; i++) {
            if (els[i].hasAttribute('size')) {
              els[i].setAttribute('style', `background-color: ${value};`);
              els[i].removeAttribute('size');
            }
          }
        }, 0);
      }

      setTimeout(() => {
        this.getCurrentElement().focus();
      }, 0);
    });

    // Toggle colorpicker
    cpApi.toggleList();
  },

  execFormatBlock(el) {
    const selectionData = this.getSelectionData(this.selection.anchorNode);
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
    if (this.isIe) {
      if (el === 'blockquote') {
        return document.execCommand('indent', false, el);
      }
      el = `<${el}>`;
    }

    return document.execCommand('formatBlock', false, el);
  },

  // Get What is Selected
  getSelectionData(el) {
    let tagName;

    if (el && el.tagName) {
      tagName = el.tagName.toLowerCase();
    }

    while (el && this.parentElements.indexOf(tagName) === -1) {
      el = el.parentNode;
      if (el && el.tagName) {
        tagName = el.tagName.toLowerCase();
      }
    }

    return { el, tagName };
  },

  isListItemChild(node) {
    let parentNode = node.parentNode;
    let tagName = parentNode.tagName.toLowerCase();

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

  destroyToolbar() {
    // Unbind all events attached to the old element that involve triggering the toolbar hide/show

    const toolbarApi = this.toolbar.data('toolbar');
    if (toolbarApi) {
      toolbarApi.destroy();
    }

    const tooltips = this.toolbar.find('button');
    for (let i = 0, l = tooltips.length; i < l; i++) {
      const tooltip = $(tooltips[i]).data('tooltip');
      if (tooltip && typeof tooltip.destroy === 'function') {
        tooltip.destroy();
      }
    }

    const colorpickers = $('[data-action="foreColor"], [data-action="backColor"]', this.element);
    for (let i = 0, l = colorpickers.length; i < l; i++) {
      const colorpicker = $(colorpickers[i]).data('colorpicker');
      if (colorpicker && typeof colorpicker.destroy === 'function') {
        colorpicker.destroy();
      }
    }

    this.toolbar.off('touchstart.editor click.editor click.editor mousedown.editor');
    this.toolbar.remove();
    this.toolbar = undefined;
    this.element.off(`mouseup.editor keypress.editor input.editor keyup.editor keydown.editor focus.editor mousedown.editor DOMNodeInserted.editor updated.editor blur.editor ${this.pasteEvent}`);
    this.textarea.off('mouseup.editor click.editor keyup.editor input.editor focus.editor blur.editor');
    this.element.prev('.label').off('click.editor');

    this.element.closest('.editor-container').off('focus.editor blur.editor click.editorlinks');

    let state = this.colorpickerButtonState('foreColor');
    let cpBtn = state.cpBtn;
    cpBtn.off('selected.editor');

    state = this.colorpickerButtonState('backColor');
    cpBtn = state.cpBtn;
    cpBtn.off('selected.editor');

    $(window).off('resize.editor');

    if (this.modals) {
      for (let i = 0, l = this.modals.length; i < l; i++) {
        const modal = $(this.modals[i]);
        const modalApi = modal.data('modal');
        modal.off('beforeclose.editor close.editor open.editor beforeopen.editor');
        if (modalApi && typeof modalApi.destroy === 'function') {
          modalApi.destroy();
        }
      }
    }
    this.modals = {};

    this.element.trigger('destroy.toolbar.editor');
  },

  /**
   * Updates the component instance.  Can be used after being passed new settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, EDITOR_DEFAULTS);
    }
    return this
      .teardown()
      .init();
  },

  teardown() {
    $('html').off('mouseup.editor');

    this.destroyToolbar();
    if (this.sourceView) {
      this.sourceView.off('.editor');
      this.sourceView.remove();
      this.sourceView = null;
    }

    if ($('[data-editor="true"]').length === 1) {
      $(`#modal-url-${this.id}, #modal-image-${this.id}`).remove();
    }

    return this;
  },

  /**
   * Destroy this component instance and remove all events and reset back to default.
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
  * Disable the editable area.
  * @returns {void}
  */
  disable() {
    this.element.addClass('is-disabled').attr('contenteditable', 'false');
    this.container.addClass('is-disabled');
  },

  /**
  * Enable the editable area.
  * @returns {void}
  */
  enable() {
    this.element.removeClass('is-disabled is-readonly').attr('contenteditable', 'true');
    this.container.removeClass('is-disabled is-readonly');
  },

  /**
  * Make the editable area readonly.
  * @returns {void}
  */
  readonly() {
    this.element.removeClass('is-readonly').attr('contenteditable', 'false');
    this.container.addClass('is-readonly');
  },

  // Fix to Firefox get focused by keyboard
  setFocus() {
    const el = ($.trim(this.element.html()).slice(0, 1) === '<') ?
      $(':first-child', this.element)[0] : this.element[0];

    window.setTimeout(() => {
      let sel;
      let range;
      if (window.getSelection && document.createRange) {
        range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(true);
        sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(el);
        range.collapse(true);
        range.select();
      }
    }, 1);
  },

  // Called whenever a paste event has occured
  onPasteTriggered() {
    if (!this.isFirefox && document.addEventListener) {
      document.addEventListener('paste', (e) => {
        if (typeof e.clipboardData !== 'undefined') {
          const copiedData = e.clipboardData.items[0]; // Get the clipboard data
          // If the clipboard data is of type image, read the data
          if (copiedData.type.indexOf('image') === 0) {
            const imageFile = copiedData.getAsFile();
            // We will use HTML5 FileReader API to read the image file
            const reader = new FileReader();

            reader.onload = function (evt) {
              const result = evt.target.result; // base64 encoded image
              document.execCommand('insertImage', false, result);
              // Create an image element and append it to the content editable div
              // var img = document.createElement('img');
              // img.src = result;
              // document.getElementById('editablediv').appendChild(img);
            };
            // Read the image file
            reader.readAsDataURL(imageFile);
          }
        }
      }, false);
    }
  },

  isWordFormat(content) {
    return (
      (/<font face="Times New Roman"|class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i).test(content) ||
      (/class="OutlineElement/).test(content) ||
      (/id="?docs\-internal\-guid\-/.test(content))
    );
  },

  cleanWordHtml(content) {
    let s = content;

    // Word comments like conditional comments etc
    s = s.replace(/<!--[\s\S]+?-->/gi, '');

    // Remove comments, scripts (e.g., msoShowComment), XML tag, VML content,
    // MS Office namespaced tags, and a few other tags
    s = s.replace(/<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi, '');

    // Convert <s> into <strike> for line-though
    s = s.replace(/<(\/?)s>/gi, '<$1strike>');

    // Replace nsbp entites to char since it's easier to handle
    s = s.replace(/&nbsp;/gi, '\u00a0');

    // Convert <span style="mso-spacerun:yes"></span> to string of alternating
    // breaking/non-breaking spaces of same length
    s = s.replace(/<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi, (str, spaces) => ((spaces.length > 0) ?
      spaces.replace(/./, ' ').slice(Math.floor(spaces.length / 2)).split('').join('\u00a0') : ''));

    // Remove line breaks / Mso classes
    s = s.replace(/(\n|\r| class=(\'|")?Mso[a-zA-Z]+(\'|")?)/g, ' ');

    const badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];

    // Remove everything in between and including "badTags"
    for (let i = 0, l = badTags.length; i < l; i++) {
      const re = new RegExp(`<${badTags[i]}.*?${badTags[i]}(.*?)>`, 'gi');
      s = s.replace(re, '');
    }

    return s;
  },

  // Strip attributes
  stripAttribute(s, attribute, attributeStripper) {
    return (attribute === 'style') ?
      this.stripStyles(s, attributeStripper) :
      s.replace(attributeStripper, '');
  },

  // Strip styles
  stripStyles(s, styleStripper) {
    const stylesToKeep = ['color', 'background', 'font-weight', 'font-style', 'text-decoration', 'text-align'];
    return s.replace(styleStripper, (m) => {
      m = m.replace(/( style=|("|\'))/gi, '');
      const attributes = m.split(';');
      let strStyle = '';
      for (let i = 0; i < attributes.length; i++) {
        const entry = attributes[i].split(':');
        strStyle += (stylesToKeep.indexOf(entry[0]) > -1) ? `${entry[0]}:${entry[1]};` : '';
      }
      return (strStyle !== '') ? ` style="${strStyle}"` : '';
    });
  },

  getIndent(level) {
    let result = '';
    let i = level * 2;
    if (level > -1) {
      while (i--) {
        result += ' ';
      }
    }
    return result;
  },

  formatHtml(html) {
    html = html.trim();
    let result = '';
    let indentLevel = 0;
    const tokens = html.split(/</);

    for (let i = 0, l = tokens.length; i < l; i++) {
      const parts = tokens[i].split(/>/);
      if (parts.length === 2) {
        if (tokens[i][0] === '/') {
          indentLevel--;
        }
        result += this.getIndent(indentLevel);
        if (tokens[i][0] !== '/') {
          indentLevel++;
        }
        if (i > 0) {
          result += '<';
        }
        result += `${parts[0].trim()} + >\n`;
        if (parts[1].trim() !== '') {
          result += `${this.getIndent(indentLevel) + parts[1].trim().replace(/\s+/g, ' ')}\n`;
        }
        if (parts[0].match(/^(area|base|br|col|command|embed|hr|img|input|link|meta|param|source)/)) {
          indentLevel--;
        }
      } else {
        result += `${this.getIndent(indentLevel) + parts[0]}\n`;
      }
    }
    return result.trim();
  }

};

/* eslint-enable consistent-return */
/* eslint-enable no-restricted-syntax */
/* eslint-enable no-useless-escape */
export { Editor, COMPONENT_NAME };
