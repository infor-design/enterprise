import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';
import { Locale } from '../locale/locale';

// Component Name
const COMPONENT_NAME = 'tag';

// Tag style states
const tagStyles = ['default', 'neutral', 'secondary', 'error', 'alert', 'good', 'info'];

// Default Tag Options
const TAG_DEFAULTS = {
  audibleContent: undefined,
  clickable: false,
  clickHandler: undefined,
  content: ' ',
  dismissible: false,
  href: undefined,
  id: undefined,
  parent: undefined,
  style: tagStyles[0]
};

/**
 * Implements functionality on tag objects, such as closing tabs.
 * @class Tag
 * @param {string} element The component element.
 * @param {string} settings The component settings.
 */
function Tag(element, settings) {
  this.settings = utils.mergeSettings(element, settings, TAG_DEFAULTS);

  // Normalize the element type
  let span;
  if (!(element instanceof HTMLElement)) {
    // If no element or the wrong element exists, we just create it from scratch.
    // If a valid element was passed in, we "replace" it in the DOM.
    // Otherwise, it's up to the implementing dev to place/insert the tag.
    span = document.createElement('span');
    span.classList.add('tag');
    if (this.settings && (this.settings.parent instanceof HTMLElement)) {
      this.settings.parent.appendChild(span);
    }
    if (typeof this.settings.id === 'string' && this.settings.id.length) {
      span.id = this.settings.id;
      delete this.settings.id;
    }
  } else if (element.querySelector('.tag-content')) {
    // The tag is fully formed and doesn't need modification
    span = element;
  } else {
    // Create the internal bit of tag content
    span = document.createElement('span');
    span.classList = element.classList;
    if (element.id && element.id.length) {
      span.id = element.id;
      element.removeAttribute('id');
    } else if (typeof this.settings.id === 'string' && this.settings.id.length) {
      span.id = this.settings.id;
      delete this.settings.id;
    }
    element.insertAdjacentElement('beforebegin', span);
    span.appendChild(element);
    span.classList.add('tag');
    element.className = '';
    element.classList.add('tag-content');
  }

  // Move the audible content around, if applicable
  if (element) {
    const audibleContent = element.querySelector('.audible');
    if (audibleContent) {
      span.insertAdjacentElement('afterbegin', audibleContent);
    }
  }
  this.element = span;

  // Use the element to change settings object, if applicable
  this.getSettingsFromElement();

  this.init();
}

// Tag Methods
Tag.prototype = {

  init() {
    this.render();
    this.handleEvents();
  },

  render() {
    const elemClasses = this.element.classList;
    const currentState = this.settings.style;
    if (this.element.className.indexOf(currentState) === -1 && currentState !== 'default') {
      elemClasses.add(currentState);
    }

    // Auduble content
    let audibleContent = '';
    if (this.settings.audibleContent) {
      audibleContent = `<span class="audible">${xssUtils.stripHTML(this.settings.audibleContent)}</span>`;
    }

    // Content Area (can just be text, or a hyperlink)
    let contentTagType = 'span';
    let href = '';
    let linkableBtn = '';
    const hasHref = (this.settings.href && this.settings.href.length);
    if (hasHref || this.originallyAnchor) {
      contentTagType = 'a';
    }
    if (hasHref) {
      href = ` href="${this.settings.href}"`;
    }
    if (this.settings.clickable || typeof this.settings.clickHandler === 'function') {
      elemClasses.add('is-linkable');
      linkableBtn = `<button class="linkable-btn" focusable="false" tabIndex="-1">
        ${$.createIcon('caret-right')}
      </button>`;
    }
    const content = `<${contentTagType} class="tag-content"${href}>${xssUtils.sanitizeHTML(this.settings.content)}</${contentTagType}>`;

    // Dismissible Button
    let dismissibleBtn = '';
    if (this.settings.dismissible) {
      elemClasses.add('is-dismissible');
      dismissibleBtn = `<button class="dismissible-btn" focusable="false" tabIndex="-1">
        ${$.createIcon('close')}
        <span class="audible">${Locale.translate('Close')}</span>
      </button>`;
    }

    // Do the render!
    this.element.innerHTML = `${audibleContent}${content}${linkableBtn}${dismissibleBtn}`;

    // Setup the HideFocus behavior
    $(this.element).hideFocus();
  },

  /**
   * @returns {HTMLElement} containing a reference to a dismissible button on a tag, if applicable.
   */
  get dismissibleBtn() {
    return this.element.querySelector('.dismissible-btn');
  },

  /**
   * Backwards compatability method for tags that were previously defined by markup.
   * This will take an existing DOM element representing a tag, and rectify internal settings
   * to match the element's state.
   * @private
   * @returns {void}
   */
  getSettingsFromElement() {
    // Style State
    const elemClasses = this.element.className;
    let styleState = '';
    tagStyles.forEach((style) => {
      if (elemClasses.indexOf(style) > -1) {
        styleState = style;
      }
    });
    if (styleState) {
      this.settings.style = styleState;
    }

    // Dismissible State
    const dismissibleBtn = this.dismissibleBtn;
    const hasDismissibleCss = this.element.className.indexOf('is-dismissible') > -1;
    if (dismissibleBtn || hasDismissibleCss) {
      this.settings.dismissible = true;
    }

    // Hyperlink State, href, show/hide the "clickable" icon
    const hyperlink = this.element.querySelector('a');
    const hasHyperlinkCss = this.element.className.indexOf('is-linkable') > -1;
    const hasLinkableIcon = this.element.querySelector('.linkable-btn');
    if (hyperlink || hasHyperlinkCss || hasLinkableIcon) {
      this.originallyAnchor = true;
      let href = hyperlink.getAttribute('href');
      if (href && href.length) {
        href = xssUtils.stripTags(href);
        this.settings.href = href;
      }
    }
    if (hasHyperlinkCss || hasLinkableIcon) {
      this.settings.clickable = true;
    }

    // Audible content
    const audibleContent = this.element.querySelector('.audible');
    if (audibleContent instanceof HTMLElement) {
      this.settings.audibleContent = xssUtils.stripHTML(audibleContent.innerText);
    }

    // Text Content
    const contentElem = this.element.querySelector('.tag-content');
    if (contentElem) {
      this.settings.content = xssUtils.sanitizeHTML(contentElem.innerText);
    }
  },

  /**
   * Remove the tag from the DOM
   * @returns {void}
   */
  remove() {
    const thisNode = this.element;
    const parentNode = thisNode.parentNode;

    /**
    * Fires before tag remove.
    *
    * @event beforetagremove
    * @memberof Tag
    * @type {object}
    * @property {object} event - The jquery event object
    * @property {object} The event used for removing and element
    */
    $(parentNode).triggerHandler('beforetagremove', [this]);

    this.destroy();
    parentNode.removeChild(thisNode);

    /**
    * Fires after tag remove.
    *
    * @event aftertagremove
    * @memberof Tag
    * @type {object}
    * @property {object} event - The jquery event object
    */
    $(parentNode).triggerHandler('aftertagremove', [this]);
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {object} The api
   */
  teardown() {
    const $element = $(this.element);
    $element.off([
      'focusin.tag',
      'focusout.tag',
      'keydown.tag',
      'click.tag'
    ].join(' '));

    // Remove the dismissible btn
    const dismissibleBtn = this.dismissibleBtn;
    if (dismissibleBtn) {
      dismissibleBtn.parentNode.removeChild(dismissibleBtn);
    }

    const hideFocusAPI = $element.data('hidefocus');
    if (hideFocusAPI && typeof hideFocusAPI.destroy === 'function') {
      hideFocusAPI.destroy();
    }

    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, TAG_DEFAULTS);
    }
    return this
      .teardown()
      .init();
  },

  /**
   * Destroy this component instance and remove the link from its base element.
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element, COMPONENT_NAME);
  },

  /**
   * Attach Events used by the Control
   * @private
   * @returns {void}
   */
  handleEvents() {
    // Standard events
    $(this.element).on('focusin.tag', () => {
      this.element.classList.add('is-focused');
    }).on('focusout.tag', () => {
      this.element.classList.remove('is-focused');
    });

    // Handle clicks on tags, and setup a callback, if applicable.
    const self = this;
    $(this.element).on('click.tag', 'a, .linkable-btn', (e) => {
      let handlerResult;
      if (typeof self.settings.clickHandler === 'function') {
        handlerResult = self.settings.clickHandler(self);
      }

      if ((handlerResult === false) || (self.settings.href && self.settings.href === '#')) {
        e.preventDefault();
        return false;
      }
      return true;
    });

    // Dismissible Tag events
    if (this.settings.dismissible) {
      /**
       * Fires when the tag is clicked (if enabled).
       * @event click
       * @memberof Tag
       * @type {object}
       * @property {object} e - The jquery event object
       */
      $(this.element).on('click.tag', '.dismissible-btn', (e) => {
        this.remove(e);
      });

      /**
      * Fires when the tag is focused.
      * @event keydown
      * @memberof Tag
      * @type {object}
      * @property {object} e - The jquery event object
      */
      $(this.element).on('keydown.tag', 'a', (e) => {
        if (e.keyCode === 8) { // Backspace
          this.remove(e);
        }
      });
    }
  }
};

export { Tag, COMPONENT_NAME };
