/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */

import { Environment as env } from '../../utils/environment';
import { debounce } from '../../utils/debounced-resize';
import * as debug from '../../utils/debug';
import { warnAboutDeprecation } from '../../utils/deprecated';
import { utils } from '../../utils/utils';
import { FontPickerStyle } from '../fontpicker/fontpicker';
import { Locale } from '../locale/locale';
import { ToolbarFlexItem } from '../toolbar-flex/toolbar-flex.item';
import { xssUtils } from '../../utils/xss';
import { DOM } from '../../utils/dom';
import { theme } from '../theme/theme';

// jQuery Components
import '../colorpicker/colorpicker.jquery';
import '../fontpicker/fontpicker.jquery';
import '../toolbar/toolbar.jquery';
import '../toolbar-flex/toolbar-flex.jquery';
import '../tooltip/tooltip.jquery';

const COMPONENT_NAME = 'editor';

const EDITOR_PARENT_ELEMENTS = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code'];

/**
* The Editor Component displays and edits markdown.
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
* @param {string} [settings.placeholder] If set to some text this will be shown as placeholder text in the editor.
* @param {string} [settings.pasteAsPlainText = false] If true, when you paste into the editor the element will be unformatted to plain text.
* @param {string} [settings.anchor = { url: 'http://www.example.com', class: 'hyperlink', target: 'NewWindow', isClickable: false, showIsClickable: false }] An object with settings related to controlling link behavior when inserted example: `{url: 'http://www.example.com', class: 'hyperlink', target: 'NewWindow', isClickable: false, showIsClickable: false},` the url is the default url to display. Class should normally stay hyperlink and represents the styling class. target can be 'NewWindow' or 'SameWindow', isClickable make the links appear clickable in the editor, showIsClickable will show a checkbox to allow the user to make clickable links in the link popup.
* @param {string} [settings.image = { url: 'https://imgplaceholder.com/250x250/2578A9/ffffff/fa-image' }] Info object to populate the image dialog defaulting to ` {url: 'http://lorempixel.com/output/cats-q-c-300-200-3.jpg'}`
* @param {function} [settings.onLinkClick = null] Call back for clicking on links to control link behavior.
* @param {function} [settings.showHtmlView = false] If set to true, editor should be displayed in HTML view initialy.
* @param {function} [settings.preview = false] If set to true, editor should be displayed in preview mode with noneditable content.
* @param {string} [settings.paragraphSeparator = 'p'] Only can use 'p'|'br'|'div', If set to anything else will not run `defaultParagraphSeparator` execCommand.
* @param {boolean} [settings.useFlexToolbar = false] if set to true, renders the toolbar as flex toolbar.
* @param {boolean} [settings.useSourceFormatter = false] true will format the html content in source mode.
* @param {boolean} [settings.formatterTabsize = 4] number of spaces can use for indentation.
* @param {boolean} [settings.rows = null] Number of rows that will be shown in each part of the editor. Set like textarea rows attributes to adjust the height of the editor without css. Example: `{ editor: 10, source: 20 }`
* @param {string|array} [settings.attributes = null] Add extra attributes like id's to the chart elements. For example `attributes: { name: 'id', value: 'my-unique-id' }`
*/
const EDITOR_DEFAULTS = {
  buttons: {
    editor: [
      'fontPicker',
      'separator', 'bold', 'italic', 'underline', 'strikethrough',
      'separator', 'foreColor', 'backColor',
      'separator', 'justifyLeft', 'justifyCenter', 'justifyRight',
      'separator', 'quote', 'orderedlist', 'unorderedlist',
      'separator', 'anchor',
      'separator', 'image',
      'separator', 'clearFormatting',
      'separator', 'source'
    ],
    source: [
      'fontPicker',
      'separator', 'bold', 'italic', 'underline', 'strikethrough',
      'separator', 'foreColor', 'backColor',
      'separator', 'justifyLeft', 'justifyCenter', 'justifyRight',
      'separator', 'quote', 'orderedlist', 'unorderedlist',
      'separator', 'anchor',
      'separator', 'image',
      'separator', 'clearFormatting',
      'separator', 'visual'
    ]
  },
  excludeButtons: {
    editor: ['backColor'],
    source: ['backColor']
  },
  rows: {
    editor: null,
    source: null
  },
  delay: 200,
  placeholder: null,
  pasteAsPlainText: false,
  // anchor > target: 'SameWindow'|'NewWindow'| any string value
  anchor: {
    url: 'http://www.example.com',
    class: 'hyperlink',
    target: 'NewWindow',
    isClickable: false,
    showIsClickable: false
  },
  image: {
    url: '/images/placeholder-80x80.png'
  },
  onLinkClick: null,
  showHtmlView: false,
  preview: false,
  paragraphSeparator: 'p',
  useFlexToolbar: true,
  useSourceFormatter: false,
  formatterTabsize: 4,
  fontpickerSettings: {
    popupmenuSettings: {
      showArrow: false,
      offset: {
        y: 0
      }
    }
  },
  attributes: null
};

function Editor(element, settings) {
  this.settings = utils.mergeSettings(element, settings, EDITOR_DEFAULTS);
  if (settings?.buttons) {
    this.settings.buttons = settings.buttons;
  }

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Editor Methods
Editor.prototype = {

  /**
   * @returns {Toolbar|ToolbarFlex} a reference to the Editor's Toolbar API
   */
  get toolbarAPI() {
    let api;
    if (this.toolbar && this.toolbar.length) {
      api = this.toolbar.data(this.settings.useFlexToolbar ? 'toolbar-flex' : 'toolbar');
    }
    return api;
  },

  init() {
    this.id = `${utils.uniqueId(this.element, 'editor')}-id`;
    this.container = this.element.parent('.field, .field-short').addClass('editor-container');

    this.label = this.element.prevAll('.label').first();

    // Preview mode
    if (!this.previewRendered && (this.element.hasClass('is-preview') || this.settings.preview)) {
      this.container[0].classList.add('is-preview');
      this.element[0].classList.remove('is-disabled', 'is-readonly', 'is-preview');
      this.element[0].setAttribute('contenteditable', false);
      this.element[0].removeAttribute('aria-multiline');
      this.element[0].removeAttribute('role');
      return;
    }

    const s = this.settings;
    s.anchor = $.extend({}, EDITOR_DEFAULTS.anchor, s.anchor);
    s.image = $.extend({}, EDITOR_DEFAULTS.image, s.image);

    s.anchor.defaultUrl = s.anchor.url;
    s.anchor.defaultClass = s.anchor.class;
    s.anchor.defaultTargetText = s.anchor.target;
    s.anchor.defaultIsClickable = s.anchor.isClickable;

    s.anchor.targets = s.anchor.targets || {
      SameWindow: '',
      NewWindow: '_blank'
    };

    $.each(this.settings.anchor.targets, (key, val) => {
      if ((this.settings.anchor.defaultTargetText).toLowerCase() === (key).toLowerCase()) {
        this.settings.anchor.target = val;
        this.settings.anchor.defaultTarget = val;
      }
    });

    // Convert legacy header settings into Fontpicker settings
    if (this.settings.firstHeader || this.settings.secondHeader) {
      if (!Array.isArray(this.settings.fontpickerSettings.styles)) {
        this.settings.fontpickerSettings.styles = [];
      }
      if (!this.settings.fontpickerSettings.styles.length) {
        this.settings.fontpickerSettings.styles.push(new FontPickerStyle('legacyDefault', 'Default'));
      }
      if (this.settings.firstHeader) {
        warnAboutDeprecation('`fontpickerSettings.styles` setting', '`firstHeader` setting', 'Editor Component');
        this.settings.fontpickerSettings.styles.push(new FontPickerStyle('legacyHeader1', 'Header 1', this.settings.firstHeader));
        delete this.settings.firstHeader;
      }
      if (this.settings.secondHeader) {
        warnAboutDeprecation('`fontpickerSettings.styles` setting', '`secondHeader` setting', 'Editor Component');
        this.settings.fontpickerSettings.styles.push(new FontPickerStyle('legacyHeader2', 'Header 2', this.settings.secondHeader));
        delete this.settings.secondHeader;
      }
    }

    if (s.buttons && s.buttons.editor) {
      let foundOldSettings = false;
      const styles = [new FontPickerStyle('default', 'Default', 'p')];

      const headers = s.buttons.editor.filter(el => el.substr(0, 6) === 'header');

      for (let i = 0; i < headers.length; i++) {
        const hLevel = headers[i].substr(6, 1);
        foundOldSettings = true;
        styles.push(new FontPickerStyle(`header${hLevel}`, `Header ${hLevel}`, `h${hLevel}`));
      }
      if (s.buttons.editor[0] === 'separator') {
        s.buttons.editor.splice(0, 1);
      }
      if (foundOldSettings) {
        s.buttons.editor = s.buttons.editor.filter(el => el.substr(0, 6) !== 'header');
        s.fontpickerSettings = { styles };
      }
      if (foundOldSettings) {
        s.buttons.editor = ['fontPicker'].concat(s.buttons.editor);
      }
    }

    if (!s.anchor.defaultTarget) {
      if (s.anchor.target && $.trim(s.anchor.target).length) {
        s.anchor.defaultTarget = s.anchor.target;
      } else {
        s.anchor.defaultTargetText = Locale.translate('SameWindow');
        s.anchor.defaultTarget = s.anchor.targets[s.anchor.defaultTargetText];
      }
    }

    this.setup();

    // Set default paragraph separator
    if (typeof s.paragraphSeparator === 'string' && /^(p|br|div)$/.test(s.paragraphSeparator)) {
      document.execCommand('defaultParagraphSeparator', false, s.paragraphSeparator);
    }

    if (this.element.hasClass('is-readonly')) {
      this.readonly();
    }

    if (this.settings.showHtmlView) {
      this.toggleSource();
    }

    this.setRowsHeight();
    return this;
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
      role: 'textbox',
      'aria-labelledby': this.container.find('.label').length ? this.container.find('.label')[0].id : 'no-id'
    });

    // Bind functionality for Pre elements. We dont use this yet but could if we
    // want to edit code blocks.
    this.element.attr('data-editor', true);

    // Build the textarea that will be used as source view and for content serialization
    this.initTextarea();

    this.bindParagraphCreation().bindTab();
    this.createToolbar()
      .bindButtons()
      .bindModals()
      .bindAnchorPreview();

    return this;
  },

  // Returns true if the source view is currently active.
  sourceViewActive() {
    return this.element.hasClass('source-view-active');
  },

  // Bind Events for the place holder
  setPlaceholders() {
    if (!this.settings.placeholder) {
      return this;
    }

    this.element.attr('placeholder', this.settings.placeholder);
    return this;
  },

  // Returns the currently visible element - either the main editor window,
  // or the source-view textarea
  getCurrentElement() {
    return this.sourceViewActive() ? this.textarea : this.element;
  },

  bindSelection(selectionTimer) {
    clearTimeout(selectionTimer);
    selectionTimer = setTimeout(() => {
      this.checkSelection();
    }, this.settings.delay);
  },

  bindSelect() {
    const selectionTimer = '';
    const currentElement = this.getCurrentElement();
    currentElement.on('mouseup.editor', () => {
      this.bindSelection(selectionTimer);
    });

    return this;
  },

  bindParagraphCreation() {
    const selectionTimer = '';
    const currentElement = this.getCurrentElement();
    currentElement.on('keyup.editor', (e) => {
      let node = this.getSelectionStart();
      const tagName = node.tagName.toLowerCase();

      if (node && node.getAttribute('data-editor') && node.children.length === 0) {
        document.execCommand('formatBlock', false, 'p');
      }

      if (e.which === 13) {
        node = this.getSelectionStart();

        if (tagName === 'blockquote') {
          return;
        }

        if (tagName !== 'li' && !this.isListItemChild(node)) {
          if (!e.shiftKey) {
            document.execCommand('formatBlock', false, 'p');
          }
          if (tagName === 'a') {
            document.execCommand('unlink', false, null);
          }
        }
      }

      this.bindSelection(selectionTimer);
    });

    return this;
  },

  bindTab() {
    const currentElement = this.getCurrentElement();

    currentElement.on('keydown.editor', (e) => {
      if (e.which === 9) {
        // Override tab only for pre nodes
        const selectionStart = this.getSelectionStart();
        if (!selectionStart || !selectionStart.tagName) {
          return;
        }

        const tag = selectionStart.tagName.toLowerCase();
        if (tag === 'pre') {
          e.preventDefault();
          document.execCommand('insertHtml', null, '    ');
        }
        // Tab to indent list structures!
        if (tag === 'li') {
          e.preventDefault();
          // If Shift is down, outdent, otherwise indent
          document.execCommand((e.shiftKey ? 'outdent' : 'indent'), e);
        }
      }

      if (e.which === 8) {
        const text = this.element.text().toString().trim().replace(/\s/g, '');
        if (window.getSelection().toString().trim().replace(/\s/g, '') === text) {
          this.element.html('');
        }
      }
    });

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

  /**
   * @private
   * @returns {this} component instance
   */
  createToolbar() {
    if (this.toolbar) {
      return this;
    }

    const toolbarCssClasses = [
      this.settings.useFlexToolbar ? 'flex-toolbar' : 'toolbar',
      'editor-toolbar',
      'formatter-toolbar'
    ].join(' ');

    let sectionCss = '';
    let moreButtonHTML = '';
    if (this.settings.useFlexToolbar) {
      sectionCss = 'toolbar-section ';
      moreButtonHTML = `<div class="toolbar-section more">
        <button class="btn-actions btn-editor">
          <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
            <use href="#icon-more"></use>
          </svg>
        </button>
      </div>`;
    }

    const btns = this.setExcludedButtons();
    let buttonsHTML = '';
    for (let i = 0, l = btns.length; i < l; i += 1) {
      let btn = this.buttonTemplate(btns[i]);
      if (btn && this.element.hasClass('source-view-active') && btns[i] !== 'visual') {
        btn = btn.replace('type="button"', 'type="button" disabled');
      }
      if (btn) {
        buttonsHTML += btn;
      }
    }

    // Add automation attributes to each buttons
    let btnAttributes = '';
    if (this.settings.attributes) {
      btnAttributes = this.getAutomationAttributes('-editor-toolbar');
      btnAttributes = JSON.stringify(btnAttributes);
      btnAttributes = ` data-options='{"attributes": ${btnAttributes}}'`;
    }

    const toolbar = `<div class="${toolbarCssClasses}" data-init="false" id="editor-toolbar-${this.id}"${btnAttributes}>
      <div class="${sectionCss}buttonset">
        ${buttonsHTML}
      </div>
      ${moreButtonHTML}
    </div>`;

    if (this.element.parent().find('.icon-dirty').length) {
      this.toolbar = $(toolbar).insertBefore(this.element.parent().find('.icon-dirty'));
    } else {
      this.toolbar = $(toolbar).insertBefore(this.sourceViewActive() ?
        this.element.prev() : this.element);
    }

    // Invoke Fontpicker, if applicable
    const fpElement = this.toolbar.find('[data-action="fontStyle"]').first();
    if (fpElement && fpElement.length) {
      // Set suffix for fontpicker automation attributes
      if (this.settings.attributes) {
        const fpAttributes = this.getAutomationAttributes('-editor-fontpicker');
        if (typeof this.settings.fontpickerSettings.popupmenuSettings === 'object') {
          this.settings.fontpickerSettings.popupmenuSettings.attributes = fpAttributes;
        } else if (!this.settings.fontpickerSettings.popupmenuSettings) {
          this.settings.fontpickerSettings.popupmenuSettings = { attributes: fpAttributes };
        }
      }
      fpElement.fontpicker(this.settings.fontpickerSettings);
      this.fontPickerElem = fpElement;
      this.fontPickerElem.tooltip({
        placementOpts: {
          x: 40
        }
      });
    }

    // Invoke Colorpicker, if applicable
    const cpElements = this.toolbar.find('[data-action="foreColor"], [data-action="backColor"]');
    cpElements.colorpicker({
      placeIn: 'editor',
      popupmenuSettings: {
        offset: {
          y: 0
        },
        showArrow: false
      }
    });
    $('.trigger', cpElements).off('click.colorpicker');

    // Invoke the (Flex?) Toolbar
    this.toolbar[this.settings.useFlexToolbar ? 'toolbarflex' : 'toolbar']({
      moreMenuSettings: {
        offset: {
          y: 0
        },
        showArrow: false
      }
    });

    // Invoke Tooltips
    this.toolbar.find('button[title]').tooltip();

    // Adjust color picker alignment, for opened by toolbar overflowed items
    cpElements.on('beforeopen.editor', (e, menu) => {
      const toolbarApi = this.toolbar.data('toolbar') || this.toolbar.data('toolbar-flex');
      if (toolbarApi) {
        toolbarApi.overflowedItems.forEach((item) => {
          if (item.type === 'colorpicker' && menu) {
            menu.parent('.popupmenu-wrapper')
              .off('afterplace.editor') // if reached more then once
              .one('afterplace.editor', (evt, args) => {
                if (typeof args.width === 'undefined') {
                  const containerW = args.container?.outerWidth() || -1;
                  const elementW = args.element?.outerWidth() || -1;
                  const left = (containerW - elementW) / 2;
                  if (left > -1) {
                    args.element.css('left', `${left}px`);
                  }
                }
              });
          }
        });
      }
    });

    return this;
  },

  /**
   * Get append suffix with automation attributes
   * @private
   * @param {string} suffix to use
   * @returns {object|array} attributes with suffix
   */
  getAutomationAttributes(suffix) {
    const s = this.settings;
    let attributes = s.attributes;
    if (s.attributes && typeof suffix === 'string' && suffix !== '') {
      if (Array.isArray(s.attributes)) {
        attributes = [];
        s.attributes.forEach((item) => {
          const value = typeof item.value === 'function' ? item.value(this) : item.value;
          attributes.push({ name: item.name, value: (value + suffix) });
        });
      } else {
        const value = typeof s.attributes.value === 'function' ? s.attributes.value(this) : s.attributes.value;
        attributes = { name: s.attributes.name, value: (value + suffix) };
      }
    }
    return attributes;
  },

  /**
  * Switch between source and editing toolbar.
  * @returns {void}
  */
  switchToolbars() {
    this.destroyToolbar();

    // Rebind everything to the new element
    this.setupTextareaEvents();
    this.createToolbar();
    this.bindButtons().bindModals().bindAnchorPreview();
    this.bindSelect().bindPaste().setupKeyboardEvents();
    this.toolbar.find('button').button();
  },

  initTextarea() {
    const self = this;
    if (this.textarea && !this.settings.showHtmlView) {
      return this;
    }
    this.textarea = this.createTextarea();

    // fill the text area with any content that may already exist within the editor DIV
    this.textarea.text(xssUtils.sanitizeHTML(this.element.html().toString()));

    self.container.on('input.editor keyup.editor', '.editor', debounce((e) => {
      /// The last savedSelection was always replaced on this section so we need to disabled this event when CTRL+H was used.
      if (e.keyCode !== 72 && !e.ctrlKey && $('.modal.is-visible').length < 1) {
        this.textarea.text(xssUtils.sanitizeHTML(this.element.html().toString()));
        this.resetEmptyEditor(e);
        this.element.trigger('change');
      }
    }, 400));

    $('html').on(`themechanged.${COMPONENT_NAME}`, () => {
      this.setRowsHeight();
      if (!(this.sourceView.hasClass('hidden'))) {
        this.adjustSourceLineNumbers();
      }
    });

    this.setupTextareaEvents();
    return this.textarea;
  },

  /**
   * Set or reset the `rows` setting height
   * @private
   */
  setRowsHeight() {
    const isNew = theme.currentTheme.id && (theme.currentTheme.id.indexOf('uplift') > -1 || theme.currentTheme.id.indexOf('new') > -1);
    if (this.settings?.rows?.editor) {
      this.element.height(Number(this.settings?.rows?.editor) * (isNew ? 26 : 22.2));
    }

    if (this.settings?.rows?.source) {
      this.element.parent().find('.editor-source').height((Number(this.settings?.rows?.source) * (isNew ? 26 : 26)) + 15);
    }
  },

  /**
   * Clean up the editor content on change.
   * @private
   */
  resetEmptyEditor() {
    this.savedSelection = this.saveSelection();

    const sep = this.settings.paragraphSeparator === 'p' ? 'p' : 'div';
    let html = this.element.html().toString().trim();

    // Cleanout browser specific logic to level things
    html = this.element.html().toString().trim();
    if (html === '<br>' || html === `<${sep}><br></${sep}>`) {
      this.element.html('');
    }

    this.element.contents().filter(function () {
      return this.nodeType === 3 && this.textContent.trim() !== '';
    }).wrap(`<${sep}></${sep}>`);

    html = this.element.html().toString().trim();
    this.textarea.html(xssUtils.sanitizeHTML(html));

    const newSelection = this.saveSelection();
    const isNumber = n => typeof n === 'number';
    const isPresent = obj => obj && obj[0] &&
      isNumber(obj[0].startOffset) && isNumber(obj[0].endOffset);
    const getOffset = obj => (isPresent(obj) ?
      { start: obj[0].startOffset, end: obj[0].endOffset } : null);
    const offset = { old: getOffset(this.savedSelection), new: getOffset(newSelection) };

    if (!((offset.old !== null && offset.new !== null) &&
        (offset.old.start === offset.new.start) && (offset.old.end === offset.new.end))) {
      this.restoreSelection(this.savedSelection);
    }
  },

  /**
   * Remove whitespace between tags.
   * @private
   */
  removeWhiteSpace() {
    const html = this.element.html().toString().trim();
    const count = (str) => {
      const re = />\s+</g;
      return ((str || '').match(re) || []).length;
    };

    // Remove Whitepsace after tags
    if (count(html) > 0) {
      this.element.html(html.replace(/>\s+</g, '><'));
    }
  },

  /**
   * Add support for `ol` types
   * @private
   * @returns {void}
   */
  orderedListTypeStyling() {
    const currentElement = this.getCurrentElement();
    const editor = this.element;
    const types = {
      loweralpha: 'a',
      upperalpha: 'A',
      lowerroman: 'i',
      upperroman: 'I'
    };

    const orderedListTag = currentElement.find('ol');

    switch (orderedListTag.attr('type')) {
      case types.loweralpha:
        editor.addClass('type-l-alpha');
        editor.removeClass('type-u-alpha');
        break;
      case types.upperalpha:
        editor.addClass('type-u-alpha');
        editor.removeClass('type-l-alpha');
        break;
      case types.lowerroman:
        editor.addClass('type-l-roman');
        editor.removeClass('type-u-roman');
        break;
      case types.upperroman:
        editor.addClass('type-u-roman');
        editor.removeClass('type-l-roman');
        break;
      default:
        break;
    }
  },

  /**
   * Do creation and setup on the editor.
   * @private
   * @returns {object} The proto object for chaining.
   */
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

  /**
   * Trigger the click event on the buttons.
   * @param  {object} e the event data
   * @param  {object} btn the button types to trigger
   */
  triggerClick(e, btn) {
    $(`button[data-action="${btn}"]`, this.toolbar).trigger('click.editor');
  },

  /**
   * Set up keyboard handling.
   * @private
   * @returns {object} The proto object for chaining.
   */
  setupKeyboardEvents() {
    const currentElement = this.getCurrentElement();
    const keys = {
      b: 66, // {Ctrl + B} bold
      e: 69, // {Ctrl + E} justifyCenter
      h: 72, // {Ctrl + H} anchor
      i: 73, // {Ctrl + I} italic --------with SHIFT: {Ctrl + Shift + I} image
      l: 76, // {Ctrl + L} justifyLeft
      bl: 55, // {Ctrl + Shift + 7} bullet list
      n: 56, // {Ctrl + Shift + 8} numbered list
      q: 81, // {Ctrl + Q} blockquotes
      r: 82, // {Ctrl + R} justifyRight
      u: 85, // {Ctrl + U} underline
      h3: 51, // {Ctrl + 3} h3
      h4: 52, // {Ctrl + 4} h4
      space: 32, // {Ctrl + Space} Clear Formatting
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
        case keys.space:
          this.triggerClick(e, 'clearFormatting');
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
      if (env.browser.name !== 'firefox' && (env.os.name === 'mac' && (e.metaKey || e.ctrlKey))) {
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
      this.element.empty().html(xssUtils.sanitizeHTML(this.textarea.val()));

      if (this.element.data('validate')) {
        this.element.data('validate').validate(this.element, true, e);
      }
    });

    return this;
  },

  /**
   * Set the heights and adjust the line number feature.
   * @private
   * @returns {void}
   */
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
    }

    container[0].style.width = `calc(100% - ${(numberList.outerWidth() + 2)}px)`;
    if (scrollHeight !== this.textarea[0].scrollHeight) {
      this.adjustSourceLineNumbers();
      return;
    }

    this.textarea[0].style.height = `${numberList[0].scrollHeight - 13}px`;
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

      /* eslint-disable no-self-assign */
      el.value = el.value; // hack to force cursor to end of text
      /* eslint-enable no-self-assign */
    }
  },

  buttonTemplate(btnType) {
    const buttonLabels = this.getButtonLabels(this.settings.buttonLabels);
    const buttonTemplates = {
      bold: `<button type="button" class="btn btn-editor" title="${Locale.translate('ToggleBold')}" data-action="bold" data-element="b">${buttonLabels.bold}</button>`,

      italic: `<button type="button" class="btn btn-editor" title="${Locale.translate('ToggleItalic')}" data-action="italic" data-element="i">${buttonLabels.italic}</button>`,

      underline: `<button type="button" class="btn btn-editor underline" title="${Locale.translate('ToggleUnderline')}" data-action="underline" data-element="u">${buttonLabels.underline}</button>`,

      strikethrough: `<button type="button" class="btn btn-editor" title="${Locale.translate('StrikeThrough')}" data-action="strikethrough" data-element="strike">${buttonLabels.strikethrough}</button>`,

      foreColor: `<button type="button" class="btn btn-editor colorpicker-editor-button" title="${Locale.translate('TextColor')}" data-action="foreColor" data-element="foreColor" data-init="false"><span class="swatch"></span>${buttonLabels.foreColor}</button>`,

      backColor: `<button type="button" class="btn btn-editor colorpicker-editor-button" title="${Locale.translate('BackgroundColor')}" data-action="backColor" data-element="backColor">${buttonLabels.backColor}</button>`,

      superscript: `<button type="button" class="btn btn-editor" title="${Locale.translate('Superscript')}" data-action="superscript" data-element="sup">${buttonLabels.superscript}</button>`,

      subscript: `<button type="button" class="btn btn-editor" title="${Locale.translate('Subscript')}" data-action="subscript" data-element="sub">${buttonLabels.subscript}</button>`,

      separator: '<div class="separator"></div>',

      anchor: `<button type="button" class="btn btn-editor" title="${Locale.translate('InsertLink')}" data-action="anchor" data-modal="modal-url-${this.id}" data-element="a">${buttonLabels.anchor}</button>`,

      image: `<button type="button" class="btn btn-editor" title="${Locale.translate('InsertImage')}" data-action="image" data-modal="modal-image-${this.id}" data-element="img">${buttonLabels.image}</button>`,

      header1: `<button type="button" class="btn btn-editor" title="${Locale.translate('ToggleH3')}" data-action="append-${this.settings.firstHeader}" data-element="${this.settings.firstHeader}">${buttonLabels.header1}</button>`,

      header2: `<button type="button" class="btn btn-editor" title="${Locale.translate('ToggleH4')}" data-action="append-${this.settings.secondHeader}" data-element="${this.settings.secondHeader}">${buttonLabels.header2}</button>`,

      quote: `<button type="button" class="btn btn-editor" title="${Locale.translate('Blockquote')}" data-action="append-blockquote" data-element="blockquote">${buttonLabels.quote}</button>`,

      orderedlist: `<button type="button" class="btn btn-editor" title="${Locale.translate('OrderedList')}" data-action="insertorderedlist" data-element="ol">${buttonLabels.orderedlist}</button>`,

      unorderedlist: `<button type="button" class="btn btn-editor" title="${Locale.translate('UnorderedList')}" data-action="insertunorderedlist" data-element="ul">${buttonLabels.unorderedlist}</button>`,

      fontPicker: `<button type="button" class="btn btn-editor fontpicker" title="${Locale.translate('ChooseFont')}" data-action="fontStyle" data-init="false"><span>${'FontPicker'}</span></button>`,

      justifyLeft: `<button type="button" class="btn btn-editor" title="${Locale.translate('JustifyLeft')}" data-action="justifyLeft" >${buttonLabels.justifyLeft}</button>`,

      justifyCenter: `<button type="button" class="btn btn-editor" title="${Locale.translate('JustifyCenter')}" data-action="justifyCenter">${buttonLabels.justifyCenter}</button>`,

      justifyRight: `<button type="button" class="btn btn-editor" title="${Locale.translate('JustifyRight')}" data-action="justifyRight" >${buttonLabels.justifyRight}</button>`,

      clearFormatting: `<button type="button" class="btn btn-editor" title="${Locale.translate('ClearFormatting')}" data-action="clearFormatting" >${buttonLabels.clearFormatting}</button>`,

      source: `<button type="button" class="btn btn-editor" title="${Locale.translate('ViewSource')}" data-action="source" >${buttonLabels.source}</button>`,

      visual: `<button type="button" class="btn btn-editor" title="${Locale.translate('ViewVisual')}" data-action="visual" >${buttonLabels.visual}</button>`
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
      anchor: this.getIcon('InsertLink', 'link'),
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
      clearFormatting: this.getIcon('ClearFormatting', 'clear-formatting'),
      source: this.getIcon('ViewSource', 'html', 'html-icon'),
      visual: this.getIcon('ViewVisual', 'visual', 'visual-icon')
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

    function editorButtonActionHandler(e, item) {
      const btn = item instanceof ToolbarFlexItem ? $(item.element) : $(e.target);

      // Don't do anything if it's the More Button
      if (btn.is('.btn-actions')) {
        return;
      }

      const action = btn.attr('data-action');
      const currentElem = self.getCurrentElement();

      e.preventDefault();
      currentElem.focus();

      self.checkSelection();

      if (!self.sourceViewActive()) {
        btn.toggleClass('is-active');
      }

      if (action) {
        self.execAction(action, e);
      }

      if (env.browser.name === 'ie' || env.browser.isEdge()) {
        currentElem.trigger('change');
      }

      if (btn[0].classList.contains('longpress-target')) {
        return false;
      }
    }

    // Most components work fine with the `selected` event on the toolbars.
    // Colorpicker components aren't "triggered" by a selected event, so they work
    // off of the click event.
    if (this.settings.useFlexToolbar) {
      this.toolbar.on('selected.editor', editorButtonActionHandler);
      this.toolbar.on('click.editor', '.colorpicker-editor-button', editorButtonActionHandler);
    } else {
      this.toolbar.on('click.editor', 'button', editorButtonActionHandler);
    }

    if (this.fontPickerElem) {
      this.fontPickerElem.on('font-selected', (e, fontPickerStyle) => {
        this.execFormatBlock(fontPickerStyle.tagName);
      });
    }

    return this;
  },

  bindModals() {
    const self = this;
    const modalSettings = {
      noRefocus: false
    };

    this.modals = {
      url: this.createURLModal(),
      image: this.createImageModal()
    };

    $(`[name="em-target-${this.id}"]`).dropdown();

    $(`#modal-url-${this.id}, #modal-image-${this.id}`).modal(modalSettings)
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
        const isTouch = env.features.touch;
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
      .off('beforeclose')
      .on('beforeclose', function () {
        const action = $(this).is('.editor-modal-image') ? 'image' : 'anchor';
        if (self.toolbar) {
          const btn = self.toolbar.find(`[data-action="${action}"]`);
          const modalApi = $(this).data('modal');
          if (btn && modalApi) {
            modalApi.settings.noRefocus = self.isBtnOverflowedItem(btn);
          }
        }
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
        } else if (self.settings.attributes) {
          if (self.settings.attributes.length > 1) { // eslint-disable-line
            self.insertImage($(`[data-automation-id="${self.settings.attributes[self.settings.attributes.length - 1].value}-editor-modal-input0"`).val());
          } else {
            self.insertImage($(`input[name=image-${self.id}]`).val());
          }
        } else {
          self.insertImage($('input[id*="image-editor"]').val());
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
      targetOptions += `<option value="${val}">${Locale.translate(key)}</option>`;
      if ((this.settings.anchor.defaultTargetText).toLowerCase() === (key).toLowerCase()) {
        isTargetCustom = false;
      }
    });

    if (isTargetCustom) {
      targetOptions += `<option value="${s.anchor.target}">${s.anchor.target}</option>`;
    }

    let modalAttributes;
    let ddAttributes = '';
    // Set automation attributes settings for dropdown
    if (s.attributes) {
      modalAttributes = this.getAutomationAttributes('-editor-modal');
      ddAttributes = JSON.stringify(modalAttributes);
      ddAttributes = ` data-options='{"attributes": ${ddAttributes}}'`;
    }

    // TODO: Rename to link when you get strings
    const output = $(`<div class="modal editor-modal-url" id="modal-url-${this.id}"></div>`)
      .html(`<div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title">${Locale.translate('InsertLink')}</h1>
        </div>
        <div class="modal-body">
          <div class="field">
            <label for="em-url-${this.id}" class="required">${Locale.translate('Url')}</label>
            <input id="em-url-${this.id}" name="em-url-${this.id}" data-validate="required" type="text" value="${s.anchor.url}">
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
            <select id="em-target-${this.id}" name="em-target-${this.id}" class="dropdown"${ddAttributes}>
              ${targetOptions}
            </select>
          </div>
          <div class="modal-buttonset">
            <button type="button" class="btn-modal btn-cancel"> ${Locale.translate('Cancel')}</button>
            <button type="button" class="btn-modal-primary"> ${Locale.translate('Insert')}</button>
          </div>
        </div>
      </div>`);

    // Add automation attributes
    if (s.attributes) {
      const inputs = [].slice.call(output[0].querySelectorAll('[type="text"]'));
      const buttons = [].slice.call(output[0].querySelectorAll('button'));
      inputs.forEach((input, i) => utils.addAttributes($(input), this, modalAttributes, `input${i}`, true));
      buttons.forEach((btn, i) => utils.addAttributes($(btn), this, modalAttributes, `button${i}`, true));
    }

    return output.appendTo('body');
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

    const output = $(`<div class="modal editor-modal-image" id="modal-image-${this.id}"></div>'`)
      .html(`<div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title">${Locale.translate('InsertImage')}</h1>
        </div>
        <div class="modal-body no-scroll">
          <div class="field">
            <label for="image-${this.id}" class="required">${Locale.translate('Url')}</label>
            <input id="image-${this.id}" name="image-${this.id}" type="text" data-validate="required" value="${this.settings.image.url}">
          </div>
          <div class="modal-buttonset">
            <button type="button" class="btn-modal btn-cancel">
              ${Locale.translate('Cancel')}</button>
            <button type="button" class="btn-modal-primary">
              ${Locale.translate('Insert')}</button>
          </div>
        </div>
      </div>`);

    // Add automation attributes
    if (this.settings.attributes) {
      const modalAttributes = this.getAutomationAttributes('-editor-modal');
      const inputs = [].slice.call(output[0].querySelectorAll('[type="text"]'));
      const buttons = [].slice.call(output[0].querySelectorAll('button'));
      inputs.forEach((input, i) => utils.addAttributes($(input), this, modalAttributes, `input${i}`, true));
      buttons.forEach((btn, i) => utils.addAttributes($(btn), this, modalAttributes, `button${i}`, true));
    }
    return output.appendTo('body');
  },

  bindAnchorPreview() {
    this.element.find('a').tooltip({
      content() {
        return $(this).attr('href');
      }
    });
  },

  updateCurrentLink(alink) {
    const emUrl = xssUtils.stripTags(document.querySelector(`[name="em-url-${this.id}"]`).value);
    const emClass = xssUtils.stripTags(document.querySelector(`[name="em-class-${this.id}"]`).value);
    const emTarget = xssUtils.stripTags(document.querySelector(`[name="em-target-${this.id}"]`).value);
    const emIsClickable = this.settings.anchor.showIsClickable ? document.querySelector(`[name="em-isclickable-${this.id}"]`).checked : this.settings.anchor.isClickable;

    if (alink) {
      alink[0].setAttribute('href', this.fixLinkFormat((emUrl && $.trim(emUrl).length ? emUrl : this.settings.anchor.defaultUrl)));
      alink[0].setAttribute('class', (emClass && $.trim(emClass).length ? emClass : this.settings.anchor.defaultClass));
      alink[0].setAttribute('data-url', (emUrl && $.trim(emUrl).length ? emUrl : this.settings.anchor.defaultUrl).replace('http://', ''));
    }

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
    const cleanValue = xssUtils.stripTags(this.fixLinkFormat(input[0].value));
    input.val(cleanValue);

    // Set selection url/class/target for Link
    this.settings.anchor.url = input.val();
    this.settings.anchor.class = document.querySelector(`[name="em-class-${this.id}"]`).value;
    this.settings.anchor.target = document.querySelector(`[name="em-target-${this.id}"]`).value;

    this.settings.anchor.isClickable = this.settings.anchor.showIsClickable ?
      document.querySelector(`[name="em-isclickable-${this.id}"]`).checked : this.settings.anchor.isClickable;

    const alink = $(`<a data-url="${cleanValue}" href="${cleanValue}">${cleanValue}</a>`);

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
      let rangeChildren;
      let rangeStr;
      let rangeImg;

      if (!this.selection.isCollapsed || env.browser.isIE11()) {
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

            rangeChildren = range.commonAncestorContainer.children;
            const len = rangeChildren ? rangeChildren.length : 0;
            for (let i = 0; i < len; i++) {
              const rangeChild = rangeChildren[i];

              if (rangeChild instanceof HTMLImageElement) {
                rangeImg = rangeChild;
              }
            }
            if (rangeImg) {
              alink.html(rangeImg.outerHTML);
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

      this.element.trigger('change');
      this.bindAnchorPreview();
    }
  },

  fixLinkFormat(value) {
    if (value.match(/^https?:\/\//)) {
      return value;
    }
    return `http://${value}`;
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

  /**
   * Check and set the active states on toolbar buttons.
   * @private
   */
  checkActiveButtons() {
    this.checkButtonState('bold');
    this.checkButtonState('italic');
    this.checkButtonState('underline');
    this.checkButtonState('strikethrough');
    this.checkColorButtonState('foreColor');
    if (this.toolbar.find('.buttonset [data-action="backColor"]').length) {
      this.checkColorButtonState('backColor');
    }
    if (this.fontPickerElem) {
      this.checkButtonState('fontStyle');
    }

    let parentNode = this.getSelectedParentElement();

    while (parentNode.tagName !== undefined &&
      EDITOR_PARENT_ELEMENTS.indexOf(parentNode.tagName.toLowerCase) === -1) {
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

    // 'fontStyle' type notifies the FontPicker component if the current selection doesn't match.
    if (this.fontPickerElem && command === 'fontStyle') {
      const fontpickerAPI = this.fontPickerElem.data('fontpicker');
      const fontpickerSupportedTags = fontpickerAPI.supportedTagNames;

      const selectedElem = this.getSelectionParentElement();
      const searchElems = $(selectedElem).add($(selectedElem).parentsUntil(this.element));
      let targetElemTag;
      let fontStyle;

      for (let i = 0; i < searchElems.length && fontStyle === undefined; i++) {
        targetElemTag = searchElems[i].tagName.toLowerCase();
        if (fontpickerSupportedTags.indexOf(targetElemTag) > -1) {
          fontStyle = fontpickerAPI.getStyleByTagName(targetElemTag);
          fontpickerAPI.select(fontStyle, true);
          break;
        }
      }

      return;
    }

    // Standard Button State Check
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
            (types.indexOf && types.indexOf('text/html') !== -1) || env.browser.isEdge()) {
          pastedData = e.originalEvent.clipboardData.getData('text/html');
        }
        if (types instanceof DOMStringList && types.contains('text/plain')) {
          pastedData = e.originalEvent.clipboardData.getData('text/plain');
        }
        if ((typeof types === 'object' && types[0] && types[0] === 'text/plain') && !types[1]) {
          pastedData = xssUtils.escapeHTML(e.originalEvent.clipboardData.getData('text/plain'));
        }
        if (types instanceof Array && types.indexOf('text/plain') > -1 && types.indexOf('text/html') < 0) { // For PDF Windows Reader, no text/html in types found.
          pastedData = xssUtils.escapeHTML(e.originalEvent.clipboardData.getData('text/plain'));
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

      self.pastedData = env.browser.isIE11() ?
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
          if (!env.browser.isIE11() && !env.browser.isEdge()) {
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
      if (!env.browser.isIE11()) {
        return false;
      }
    };

    currentElement.on('paste.editor', (self.settings.pasteAsPlainText ?
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

        if (env.browser.isIE11()) {
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
        if (env.browser.isIE11()) {
          let maxRun = 50;
          const deferredIE11 = $.Deferred();

          const waitForPastedData = (elem, savedContent) => {
            maxRun--;
            if (maxRun < 0) {
              deferredIE11.reject();
              return;
            }
            // If data has been processed by browser, process it
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
            let pasteHtml = '';
            if (/(^(\s+?)?<li)/ig.test(html)) {
              // Pasted data starts and ends with "li" tag
              if (/((\s+?)?<\/li>(\s+?)?$)/ig.test(html)) { // ends with "</li>"
                // Do not add "ul" if pasting on "li" node
                if (!thisNode.is('li')) {
                  html = `<ul>${html}</ul>`;
                }
                pasteHtml = html;
              } else if (thisNode.is('li')) {
                // Missing at the end "</li>" tag
                // Pasting on "li" node
                pasteHtml = `${html}</li>`;
              } else {
                // Not pasting on "li" node

                // If ul was closed and have extra nodes after list close
                str = (html.match(/<\/ul|<\/ol/gi) || []);
                // Pasted data contains "ul or ol" tags
                if (str.length) {
                  pasteHtml = html;
                } else {
                  pasteHtml = `${html}</li></ul>`;
                }
              }
            } else if (/((\s+?)?<\/li>(\s+?)?$)/ig.test(html)) {
              // Ends with "</li>" tag, but not started with "li" tag

              // Pasting on "li" node
              if (thisNode.is('li')) {
                pasteHtml = `<li>${html}`;
              } else {
                str = (html.match(/<ul|<ol/gi) || []);
                // Pasted data contains "ul or ol" tags
                if (str.length) {
                  html += (str[str.length - 1]).replace(/<(ul|ol)/gi, '<$1>');
                } else {
                  html = `<ul>${html}</ul>`;
                }
                pasteHtml = html;
              }
            }

            if (pasteHtml) {
              DOM.html(thisNode, pasteHtml, '*');
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
    s = s.replace(/\sng-[a-z-]+/, '');

    // Remove comments
    s = s.replace(/<!--(.*?)-->/gm, '');

    // Remove extra spaces
    s = s.replace(/\s\s+/g, ' ').replace(/\s>+/g, '>');

    // Remove extra attributes from list elements
    s = s.replace(/<(ul)(.*?)>/gi, '<$1>');

    // Remove empty list
    s = s.replace(/<li><\/li>/gi, '');
    s = s.replace(/<(ul|ol)><\/(ul|ol)>/gi, '');

    // Remove html and body tags
    s = s.replace(/<\/?(html|body)(.*?)>/gi, '');

    // Remove header tag and content
    s = s.replace(/<head\b[^>]*>(.*?)<\/head>/gi, '');

    // Remove empty tags
    s = s.replace(/<(div|span|p)> <\/(div|span|p)>/gi, ' ');
    s = s.replace(/<[^(br|/>)]+>[\s]*<\/[^>]+>/gi, '');

    if (s.indexOf('·') > -1) {
      // Replace span and paragraph tags from bulleted list pasting
      s = s.replace(/<\/p>/gi, '</li>');
      s = s.replace(/<p><span><span>·<\/span><\/span>/gi, '<li>');
      // Remove white space
      s = s.replace(/<\/li>\s<li>/gi, '<\/li><li>');
      // Add in opening and closing ul tags
      s = [s.slice(0, s.indexOf('<li>')), '<ul>', s.slice(s.indexOf('<li>'))].join('');
      s = [s.slice(0, s.lastIndexOf('</li>')), '</ul>', s.slice(s.lastIndexOf('</li>'))].join('');
    }

    return s;
  },

  htmlEntities(str) {
    // converts special characters (e.g., <) into their escaped/encoded values (e.g., &lt;).
    // This allows you to display the string without the browser reading it as HTML.
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  bindWindowActions() {
    const editorContainer = this.container;
    const currentElement = this.getCurrentElement();
    const self = this;

    this.element
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

    // Handle visual styles at the container level on blur/focus
    function containerFocusHandler() {
      const elem = $(this);

      editorContainer.addClass('is-active');
      setTimeout(() => {
        if (elem.hasClass('error')) {
          editorContainer.parent().find('.editor-toolbar').addClass('error');
          editorContainer.parent().find('.editor-source').addClass('error');
        }
      }, 100);
    }
    function containerBlurHandler() {
      editorContainer.removeClass('is-active');
      editorContainer.parent().find('.editor-toolbar').removeClass('error');
      editorContainer.parent().find('.editor-source').removeClass('error');
    }

    this.container
      .on(`focusin.${COMPONENT_NAME}`, '.editor, .editor-source', containerFocusHandler)
      .on(`focusout.${COMPONENT_NAME}`, '.editor, .editor-source', containerBlurHandler);

    this.container
      .on(`mouseenter.${COMPONENT_NAME}`, () => {
        if (!this.element.hasClass('error')) {
          this.container.addClass('is-hover');
        }
      })
      .on(`mouseleave.${COMPONENT_NAME}`, () => {
        this.container.removeClass('is-hover');
      });

    if (self.settings.onLinkClick) {
      editorContainer.on('click.editorlinks', 'a', (e) => {
        self.settings.onLinkClick(e, { elem: this, url: e.currentTarget.getAttribute('data-url') });
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
      });
    }

    // Attach Label
    this.label.on('click.editor', () => {
      currentElement.focus();
    });
    currentElement.attr('aria-label', this.label.text());
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
        this.execColorActions(action);
      } else if (action === 'clearFormatting') {
        this.clearFormatting();
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
    this.checkSelection();
  },

  insertImage(url) {
    document.execCommand('insertImage', false, url);
  },

  /**
   * Toggle to source or preview mode.
   * @param {boolean} forceToSourceMode true will force to toggle in to source mode.
   * @returns {void}
   */
  toggleSource(forceToSourceMode) {
    // Preview Mode
    const doPreviewMode = (res) => {
      let content = res || this.textarea.val();
      content = xssUtils.sanitizeHTML(content);
      content = this.getCleanedHtml(content);

      this.element.empty().removeClass('source-view-active hidden');
      this.sourceView.addClass('hidden').removeClass('is-focused');
      this.element.trigger('focus.editor');
      this.switchToolbars();
      this.textarea.off('input.editor-firechange');

      setTimeout(() => {
        this.orderedListTypeStyling();

        this.element[0].innerHTML = content;
        content = this.element[0].innerHTML;
        /**
         * Fires after preview mode activated.
         * @event afterpreviewmode
         * @memberof Editor
         * @property {object} event The jquery event object
         * @property {string} content Additional argument
         */
        this.element.triggerHandler('afterpreviewmode', content);
        const btn = this.toolbar?.find('[data-action="source"]');
        if (btn && !this.isBtnOverflowedItem(btn)) {
          btn.focus();
        }
      }, 0);
    };

    // Source Mode
    const doSourceMode = (res) => {
      let content = res || this.element.html()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/<br( \/)?>/g, '<br>\n')
        .replace(/<\/p> /g, '</p>\n\n')
        .replace(/<\/blockquote>( )?/g, '</blockquote>\n\n');
      if (this.settings.useSourceFormatter) {
        content = this.formatHtml(content);
      }

      this.element.addClass('source-view-active');
      this.switchToolbars();
      this.textarea.val(content).focus();
      this.sourceView.removeClass('hidden');
      this.element.addClass('hidden');
      this.adjustSourceLineNumbers();
      this.textarea.focus();
      content = this.textarea.val();
      this.textarea.off('input.editor-firechange').on('input.editor-firechange', () => {
        this.element.trigger('change');
      });

      /**
       * Fires after source mode activated.
       * @event aftersourcemode
       * @memberof Editor
       * @property {object} event The jquery event object
       * @property {string} content Additional argument
       */
      this.element.triggerHandler('aftersourcemode', content);
      const btn = this.toolbar?.find('[data-action="visual"]');
      if (btn && !this.isBtnOverflowedItem(btn)) {
        btn.focus();
      }
    };

    // Check the false value
    const isFalse = v => ((typeof v === 'string' && v.toLowerCase() === 'false') ||
      (typeof v === 'boolean' && v === false) ||
      (typeof v === 'number' && v === 0));

    if (this.sourceViewActive() && !forceToSourceMode) {
      const content = this.textarea.val();
      /**
       * Fires before preview mode activated.
       * @event beforepreviewmode
       * @memberof Editor
       * @property {object} event The jquery event object
       * @property {string} content Additional argument
       */
      $.when(this.element.triggerHandler('beforepreviewmode', content)).done((res) => {
        if (!isFalse(res)) {
          doPreviewMode(res);
        }
      });
    } else {
      const content = this.element.html();
      /**
       * Fires before source mode activated.
       * @event beforesourcemode
       * @memberof Editor
       * @property {object} event The jquery event object
       * @property {string} content Additional argument
       */
      $.when(this.element.triggerHandler('beforesourcemode', content)).done((res) => {
        if (!isFalse(res)) {
          doSourceMode(res);
        }
      });
    }
  },

  /**
   * Check button is overflowed item or not.
   * @private
   * @param  {jQuery} btn button to check
   * @returns {boolean} true if button is overflowed item
   */
  isBtnOverflowedItem(btn) {
    const toolbarApi = this.toolbar.data('toolbar') || this.toolbar.data('toolbar-flex');
    let found = false;
    if (toolbarApi) {
      toolbarApi.overflowedItems.forEach((item) => {
        if (btn.is(item.element)) {
          found = true;
        }
      });
    }
    return found;
  },

  /**
   * Function to clear formatting on selected area.
   * @private
   * @returns {void}
   */
  clearFormatting() {
    const parentEl = this.getSelectionParentElement();
    let parentTag = parentEl.tagName;
    let align = {};

    // Function to get text-align value if found
    const getTextAlign = () => {
      const isFound = el => el && el.style && el.style.textAlign !== '';
      let elem = parentEl;
      let found = isFound(elem);
      let max = 9999;
      while (!found && max > 0) {
        max--;
        elem = elem ? elem.parentNode : null;
        found = elem && elem === this.element[0] || isFound(elem);
      }
      const r = { found: elem && elem !== parentEl && elem !== this.element[0] };
      if (r.found) {
        r.elem = elem;
        r.textAlign = elem.style.textAlign;
      }
      return r;
    };

    // Clear other formated tags.
    const clearFormatedTags = () => {
      const replaceTag = (elem) => {
        const parent = elem.parentNode;
        const p = document.createElement('p');
        p.innerHTML = elem.innerHTML;
        parent.replaceChild(p, elem);
      };
      if (EDITOR_PARENT_ELEMENTS.indexOf(parentTag) > -1) {
        if (parentTag !== 'p') {
          document.execCommand('removeFormat', false, null);
          replaceTag(parentEl);
        }
      } else {
        EDITOR_PARENT_ELEMENTS.forEach((el) => {
          if (el !== 'p') {
            const nodes = [].slice.call(parentEl.querySelectorAll(el));
            nodes.forEach(node => replaceTag(node));
          }
        });
      }
      // Blockquote or Pre
      const nodes = [].slice.call(this.element[0].querySelectorAll('blockquote, pre'));
      for (let i = 0, l = nodes.length; i < l; i++) {
        let found = false;
        const children = [].slice.call(nodes[i].children);
        const checkChildren = (childrenNodes) => {
          for (let i2 = 0, l2 = childrenNodes.length; i2 < l2; i2++) {
            const child = childrenNodes[i2];
            const childChildren = [].slice.call(child.children);
            if (child === parentEl) {
              found = true;
            }
            if (childChildren.length && !found) {
              checkChildren(childChildren);
            }
          }
        };
        checkChildren(children);
        if (found) {
          document.execCommand('removeFormat', false, null);
          replaceTag(nodes[i]);
        }
      }
    };

    // Check if selection contains given node
    const containsNodeInSelection = (node) => {
      const sel = window.getSelection();
      let r = false;
      if (env.browser.isIE11()) {
        const rangeAt = sel.getRangeAt(0);
        const range = document.createRange();
        range.selectNode(node);
        const s2s = rangeAt.compareBoundaryPoints(Range.START_TO_END, range);
        const s2e = rangeAt.compareBoundaryPoints(Range.START_TO_START, range);
        const e2s = rangeAt.compareBoundaryPoints(Range.END_TO_START, range);
        const e2e = rangeAt.compareBoundaryPoints(Range.END_TO_END, range);
        r = ((s2s !== s2e) || (e2s !== e2e) || (s2s !== e2e));
      } else {
        r = sel.containsNode(node, true);
      }
      return r;
    };

    // Clear all lists belongs to selection area
    const clearLists = () => {
      const normalizeList = (list) => {
        const items = [].slice.call(list.querySelectorAll('li'));
        if (items.length > 0) {
          const fragment = document.createDocumentFragment();
          items.forEach((item) => {
            const textNode = document.createTextNode(item.textContent);
            fragment.appendChild(textNode);
            fragment.appendChild(document.createElement('br'));
          });
          const target = items[0].parentNode;
          target.parentNode.insertBefore(fragment, target.nextSibling);
          target.parentNode.removeChild(target);
        }
      };
      if (parentTag === 'li') {
        normalizeList(parentEl.parentNode);
      } else if (/ul|ol/.test(parentTag)) {
        normalizeList(parentEl);
      } else {
        const setEl = () => ($(parentEl).closest('.editor').length ? parentEl.parentNode : null);
        const elem = parentEl.classList.contains('editor') ? parentEl : setEl();

        if (elem) {
          const lists = [].slice.call(elem.querySelectorAll('ul, ol'));
          lists.forEach((list) => {
            if (containsNodeInSelection(list)) {
              normalizeList(list);
            }
          });
        }
      }
    };

    // Convert hyperlinks to plain text in selected area.
    const hyperlinksToText = () => {
      const toText = (a) => {
        const parent = a.parentNode;
        const text = a.firstChild;
        parent.insertBefore(text, a);
        parent.removeChild(a);
        parent.normalize();
      };
      if (parentTag === 'a') {
        toText(parentEl);
      } else {
        const links = [].slice.call(parentEl.querySelectorAll('a'));
        links.forEach((a) => {
          if (containsNodeInSelection(a)) {
            toText(a);
          }
        });
      }
    };

    if (parentEl && parentTag) {
      parentTag = parentTag.toLowerCase();
      align = getTextAlign();
      clearLists();
      clearFormatedTags();
      hyperlinksToText();
    }

    // Some browser (IE, Firefox) use attr 'align' instead style `text-align`
    const gParentEl = parentEl.parentNode;
    if (gParentEl && (gParentEl !== this.element[0])) {
      const alignAttrElems = [].slice.call(gParentEl.querySelectorAll('[align]'));
      alignAttrElems.forEach(el => el.removeAttribute('align'));
    }
    document.execCommand('removeFormat', false, null);

    // Restore style `text-align`, some browser (chrome, safari) clear `text-align` on parent node with command `removeFormat`
    if (align.found) {
      align.elem.style.textAlign = align.textAlign;
    }
  },

  /**
   * Get selection parent element.
   * @private
   * @returns {object} parent element.
   */
  getSelectionParentElement() {
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
    } else {
      sel = document.selection;
      if (sel && sel.type !== 'Control') {
        parentEl = sel.createRange().parentElement();
      }
    }
    return parentEl;
  },

  /**
   * Get ['foreColor'|'backColor'] button icon color state for the toolbar.
   * @private
   * @param  {[type]} action [description]
   * @returns {object} The button state info.
   */
  checkColorButtonState(action) {
    const cpBtn = $(`[data-action="${action}"]`, this.toolbar);
    const cpApi = cpBtn.data('colorpicker');
    const preventColors = ['transparent', '#1a1a1a', '#f0f0f0', '#ffffff', '#313236'];

    let color = document.queryCommandValue(action);

    // Set selection color checkmark in picker popup
    // by adding/updating ['data-value'] attribute
    if (cpApi && color !== 'rgb(0, 0, 0)') {
      if (env.browser.name === 'firefox' && action === 'backColor') {
        color = $(window.getSelection().focusNode.parentNode).css('background-color');
      }
      // IE-11 queryCommandValue returns the as decimal
      if (typeof color === 'number') {
        color = cpApi.decimal2rgb(color);
      }
      color = color ? cpApi.rgb2hex(color) : '';
      cpBtn.attr('data-value', color)
        .find('.icon');
      cpBtn.find('.swatch').css('background-color', (preventColors.indexOf(color.toLowerCase()) > -1) ? '' : color);
    }
    return { cpBtn, cpApi, color };
  },

  /**
   * Execute ['foreColor'|'backColor'] button actions.
   * @private
   * @param  {[type]} action [description]
   */
  execColorActions(action) {
    const state = this.checkColorButtonState(action);
    const cpBtn = state.cpBtn;
    const cpApi = state.cpApi;

    cpBtn.one('selected.editor', (e, item) => {
      // Detect Flex Toolbar item
      let target = item;
      if (target !== undefined && !(target instanceof $) && target.element) {
        target = $(item.element);
      }

      if (!target.is('a')) {
        return;
      }

      // Use the value to set the color
      let value = (`${target.data('value')}`).toLowerCase();
      value = value !== '#' ? value : '';
      if (value.indexOf('#') === -1) {
        value = `#${value}`;
      }

      if (value === '#') {
        value = ''; // clear format
      }

      cpBtn.attr('data-value', value).find('.icon');
      cpBtn.find('.swatch').css('background-color', value);

      if (env.browser.name === 'ie' || action === 'foreColor') {
        if (value) {
          document.execCommand(action, false, value);
        } else {
          document.execCommand('removeFormat', false, action);
        }
      } else {
        // [action: backColor] - for Chrome/Firefox/Safari

        // FIX: "backColor" - Chrome/Firefox/Safari
        // some reason font/span node not get inserted with "backColor"
        // so use "fontSize" command to add node, then remove size attribute
        // this fix will conflict with combination of font size & background color
        document.execCommand('fontSize', false, '2');
        const parent = this.getSelectionParentElement().parentNode;
        const els = parent.getElementsByTagName('font');

        // Clearing all the background style in any element node in selection's parent
        for (let i = 0, j = els.length; i < j; i++) {
          if (els[i].hasAttribute('style')) {
            els[i].style.backgroundColor = '';
          }
        }

        // Using timeout, firefox not executes with current call stack
        setTimeout(() => {
          for (let i = 0, l = els.length; i < l; i++) {
            if (els[i].hasAttribute('size')) {
              els[i].style.backgroundColor = value;
              els[i].removeAttribute('size');
            }
          }
        }, 0);
      }
    });

    // Toggle colorpicker
    cpApi.toggleList();
  },

  /**
   * Formats the currently-selected block of content in the editor with a predefined HTML element
   * and style, if applicable.
   * @param {string} el, the desired block-level element with which to wrap the current block.
   * @returns {void}
   */
  execFormatBlock(el) {
    if (this.selection === undefined) {
      this.checkSelection();
    }

    if (!this.selection || !(this.selection instanceof Selection)) {
      return;
    }

    // Check if selected text is in current editor
    if (this.element.get(0) !== $(this.selection.anchorNode.parentNode).parent().get(0)) {
      return;
    }

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
    if (env.browser.name === 'ie') {
      if (el === 'blockquote') {
        return document.execCommand('indent', false, el);
      }
      el = `<${el}>`;
    }

    // Reset some formatting thats not consistent with headers
    if (document.queryCommandState('bold')) {
      document.execCommand('bold', false, el);
    }
    if (document.queryCommandState('italic')) {
      document.execCommand('italic', false, el);
    }
    if (document.queryCommandState('underline')) {
      document.execCommand('underline', false, el);
    }
    if (document.queryCommandState('strikethrough')) {
      document.execCommand('strikethrough', false, el);
    }
    if (selectionData.el && selectionData.el.innerHTML && selectionData.el.innerHTML.indexOf('<font') > -1) {
      document.execCommand('removeFormat', false, 'foreColor');
      document.execCommand('removeFormat', false, 'backColor');
    }
    if (selectionData.el && selectionData.el.innerHTML && selectionData.el.innerHTML.substr(0, 4) === '<ul>') {
      document.execCommand('insertunorderedlist', false, el);
      document.execCommand('removeFormat', false, el);
    }
    if (this.selection.anchorNode && this.selection.anchorNode.parentNode && this.selection.anchorNode.parentNode.parentElement.nodeName === 'UL') {
      document.execCommand('insertunorderedlist', false, el);
      document.execCommand('removeFormat', false, el);
    }
    if (selectionData.el && selectionData.el.innerHTML && selectionData.el.innerHTML.substr(0, 4) === '<ol>') {
      document.execCommand('insertorderedlist', false, el);
      document.execCommand('removeFormat', false, el);
    }
    if (this.selection.anchorNode && this.selection.anchorNode.parentNode && this.selection.anchorNode.parentNode.parentElement.nodeName === 'OL') {
      document.execCommand('insertorderedlist', false, el);
      document.execCommand('removeFormat', false, el);
    }

    document.execCommand('formatBlock', false, el);
    this.checkActiveButtons();
  },

  // Get What is Selected
  getSelectionData(el) {
    let tagName;

    if (el && el.tagName) {
      tagName = el.tagName.toLowerCase();
    }

    while (el && EDITOR_PARENT_ELEMENTS.indexOf(tagName) === -1) {
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

    while (EDITOR_PARENT_ELEMENTS.indexOf(tagName) === -1 && tagName !== 'div') {
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
    const checkJQ = el => el || $();
    this.toolbar = checkJQ(this.toolbar);
    this.element = checkJQ(this.element);
    this.textarea = checkJQ(this.textarea);

    const toolbarApi = this.toolbar.data('toolbar') || this.toolbar.data('toolbar-flex');
    if (toolbarApi) {
      toolbarApi.destroy();
    }

    // Cleanup buttons
    const buttons = this.toolbar.find('button');
    for (let i = 0, l = buttons.length; i < l; i++) {
      const tooltip = $(buttons[i]).data('tooltip');
      if (tooltip && typeof tooltip.destroy === 'function') {
        tooltip.destroy();
      }

      const button = $(buttons[i]).data('button');
      if (button && typeof button.destroy === 'function') {
        button.destroy();
      }
    }

    // Cleanup pickers
    const colorpickers = $('[data-action="foreColor"], [data-action="backColor"]', this.element);
    for (let i = 0, l = colorpickers.length; i < l; i++) {
      const colorpicker = $(colorpickers[i]).data('colorpicker');
      if (colorpicker && typeof colorpicker.destroy === 'function') {
        colorpicker.destroy();
      }
    }

    if (this.fontPickerElem) {
      this.fontPickerElem.off(`font-selected.${COMPONENT_NAME}`);
      const fontpickerAPI = this.fontPickerElem.data('fontpicker');
      if (fontpickerAPI) {
        fontpickerAPI.destroy();
      }
      delete this.fontPickerElem;
    }

    // Unbind/Remove Toolbar Component (generically)
    this.toolbar.off([
      `click.${COMPONENT_NAME}`,
      `selected.${COMPONENT_NAME}`
    ].join(' '));
    this.toolbar.remove();
    delete this.toolbar;

    // Remove events that could be bound to either:
    // - the WYSIWYG editor
    // - the source code view
    const boundEventNames = [
      'blur',
      'DOMNodeInserted',
      'focus',
      `input.${COMPONENT_NAME}`,
      `keydown.${COMPONENT_NAME}`,
      `keypress.${COMPONENT_NAME}`,
      `keyup.${COMPONENT_NAME}`,
      `mouseup.${COMPONENT_NAME}`,
      `mousedown.${COMPONENT_NAME}`,
      `paste.${COMPONENT_NAME}`
    ].join(' ');

    this.element.off(boundEventNames);
    this.textarea.off(boundEventNames);
    this.element.prev('.label').off('click.editor');

    this.container.closest('.editor-container').off('focus.editor blur.editor click.editorlinks');

    let state = this.checkColorButtonState('foreColor');
    let cpBtn = state.cpBtn;
    cpBtn.off('selected.editor');

    state = this.checkColorButtonState('backColor');
    cpBtn = state.cpBtn;
    cpBtn.off('selected.editor');

    delete this.pasteWrapper;
    delete this.pasteWrapperHtml;
    delete this.selectionHandler;

    $(window).off('resize.editor');

    if (this.modals) {
      const modalTypes = Object.keys(this.modals);
      for (let i = 0, l = modalTypes.length; i < l; i++) {
        const modal = $(`#modal-${modalTypes[i]}-${this.id}`);
        const modalApi = modal.data('modal');
        modal.off('beforeclose.editor close.editor open.editor beforeopen.editor');
        if (modalApi && typeof modalApi.destroy === 'function') {
          modalApi.destroy();
        }
        modal.remove();
      }
    }
    delete this.modals;

    this.element.trigger('destroy.toolbar.editor');
  },

  /**
   * Setup the preview mode.
   * @private
   * @returns {void}
   */
  setPreviewMode() {
    const containerClassList = this.container[0].classList;
    const elementClassList = this.element[0].classList;

    if (!containerClassList.contains('is-preview')) {
      if (!this.isEditable()) {
        const classes = ['is-disabled', 'is-readonly', 'is-preview'];
        containerClassList.remove(...classes);
        elementClassList.remove(...classes);
      }
      if (this.sourceViewActive()) {
        this.toggleSource();
      }
      containerClassList.add('is-preview');
      elementClassList.remove('is-preview');
      this.element[0].setAttribute('contenteditable', false);
      this.element[0].removeAttribute('aria-multiline');
      this.element[0].removeAttribute('role');

      // Remove tooltip for links in editor
      const links = [].slice.call(this.element[0].querySelectorAll('a'));
      links.forEach((link) => {
        const tooltipApi = $(link).data('tooltip');
        if (tooltipApi && typeof tooltipApi.destroy === 'function') {
          tooltipApi.destroy();
        }
      });
    }
  },

  /**
   * Destroy preview mode.
   * @private
   * @returns {void}
   */
  destroyPreviewMode() {
    if (!this.container[0]) {
      return;
    }

    const classList = this.container[0].classList;
    if (classList.contains('is-preview')) {
      classList.remove('is-preview');
      if (!this.previewRendered) {
        this.previewRendered = true;
        this.init();
      } else {
        this.element[0].setAttribute('aria-multiline', true);
        this.element[0].setAttribute('role', 'textbox');
        this.bindAnchorPreview();
      }
    }
  },

  /**
   * Check for the editor is in preview mode.
   * @returns {boolean} true if editor in preview mode
   */
  isPreview() {
    return this.container[0] ? this.container[0].classList.contains('is-preview') : false;
  },

  /**
   * Check for the editor is in editable mode.
   * @returns {boolean} true if editor is editabled
   */
  isEditable() {
    let isEnabled = true;
    const isContains = (el, className) => el.classList.contains(className);
    ['is-disabled', 'is-readonly', 'is-preview'].forEach((className) => {
      if (isContains(this.container[0], className) || isContains(this.element[0], className)) {
        isEnabled = false;
      }
    });
    return isEnabled;
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
    this.destroyToolbar();
    const currentElement = this.getCurrentElement();

    // Cleanup Source View elements and events
    if (this.sourceView) {
      this.sourceView.off('.editor');
      this.sourceView.remove();
      delete this.sourceView;
    }

    delete this.textarea;
    if (this.lineNumbers) {
      delete this.lineNumbers;
    }
    if (this.selection) {
      delete this.selection;
    }
    if (this.selectionRange) {
      delete this.selectionRange;
    }

    // Cleanup editor binds
    currentElement.off('keyup.editor');
    currentElement.off('mouseup.editor');

    // Cleanup container
    this.container.off([
      `focusin.${COMPONENT_NAME}`,
      `focusout.${COMPONENT_NAME}`,
      `mouseneter.${COMPONENT_NAME}`,
      `mouseleave.${COMPONENT_NAME}`,
      `input.${COMPONENT_NAME}`,
      `keyup.${COMPONENT_NAME}`
    ].join(' '));
    this.container.removeClass('editor-container');
    delete this.container;

    // Cleanup label
    this.label.off(`click.${COMPONENT_NAME}`);
    delete this.label;

    // Cleanup Editor Element
    this.element.attr('contenteditable', 'false');
    this.element.off([
      `mousedown.${COMPONENT_NAME}`,
      `updated.${COMPONENT_NAME}`
    ].join(' '));

    $('html').off(`themechanged.${COMPONENT_NAME}`);
    delete this.id;
    delete this.isActive;

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
    this.destroyPreviewMode();
    this.element.addClass('is-disabled').attr('contenteditable', 'false');
    this.container.addClass('is-disabled');
  },

  /**
  * Enable the editable area.
  * @returns {void}
  */
  enable() {
    this.destroyPreviewMode();
    this.element.removeClass('is-disabled is-readonly').attr('contenteditable', 'true');
    this.container.removeClass('is-disabled is-readonly');
  },

  /**
  * Make the editable area readonly.
  * @returns {void}
  */
  readonly() {
    this.destroyPreviewMode();
    this.element.removeClass('is-readonly').attr('contenteditable', 'false');
    this.container.addClass('is-readonly');
  },

  /**
   * Make the editable mode.
   * @returns {void}
   */
  editable() {
    this.enable();
  },

  /**
   * Make the preview mode.
   * @returns {void}
   */
  preview() {
    if (!this.container[0].classList.contains('is-preview')) {
      this.setPreviewMode();
    }
  },

  /**
   * Called whenever a paste event has occured
   * @returns {void}
   */
  onPasteTriggered() {
    if (env.browser.name !== 'firefox' && document.addEventListener) {
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

    // Replace nbsp entites to char since it's easier to handle
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
    const stylesToKeep = ['color', 'font-size', 'background', 'font-weight', 'font-style', 'text-decoration', 'text-align'];
    return s.replace(styleStripper, (m) => {
      m = m.replace(/( style=|("|\'))/gi, '');
      const attributes = m.split(';');
      let strStyle = '';
      for (let i = 0; i < attributes.length; i++) {
        const entry = attributes[i].split(':');
        strStyle += (stylesToKeep.indexOf((entry[0] || '').trim()) > -1) ? `${entry[0]}:${entry[1]};` : '';
      }
      return (strStyle !== '') ? ` style="${strStyle}"` : '';
    });
  },

  /**
   * Format given string to proper indentation.
   * @param {string} html true will force to toggle in to source mode.
   * @returns {string} formated value
   */
  formatHtml(html) {
    html = html.trim();
    const s = this.settings;
    const tokens = html.split(/</);
    let indentLevel = 0;
    let result = '';

    function getIndent(level) {
      const tabsize = typeof s.formatterTabsize === 'number' ? s.formatterTabsize : 4;
      let indentation = '';
      let i = level * tabsize;
      if (level > -1) {
        while (i--) {
          indentation += ' ';
        }
      }
      return indentation;
    }

    for (let i = 0, l = tokens.length; i < l; i++) {
      const parts = tokens[i].split(/>/);
      if (parts.length === 2) {
        if (tokens[i][0] === '/') {
          indentLevel--;
        }
        result += getIndent(indentLevel);
        if (tokens[i][0] !== '/') {
          indentLevel++;
        }
        if (i > 0) {
          result += '<';
        }
        result += `${parts[0].trim()}>\n`;
        if (parts[1].trim() !== '') {
          result += `${getIndent(indentLevel) + parts[1].trim().replace(/\s+/g, ' ')}\n`;
        }
        if (parts[0].match(/^(area|base|br|col|command|embed|hr|img|input|link|meta|param|source)/)) {
          indentLevel--;
        }
      } else {
        result += `${getIndent(indentLevel) + parts[0]}\n`;
      }
    }
    return result.trim();
  },

  /**
   * Clear the editor of its contents.
   */
  clear() {
    this.element.empty();
    this.textarea.empty();
    this.sourceView.find('.line-numbers').empty();
    this.sourceView.find('.textarea-print').empty();
  }
};

/* eslint-enable consistent-return */
/* eslint-enable no-restricted-syntax */
/* eslint-enable no-useless-escape */
export { Editor, COMPONENT_NAME };
