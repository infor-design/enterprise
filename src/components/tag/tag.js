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
  disabled: false,
  dismissible: false,
  dismissHandler: undefined,
  href: undefined,
  id: undefined,
  parent: undefined,
  style: tagStyles[0],
  value: undefined
};

/**
 * Implements functionality on tag objects, such as dismissable, hyperlink, disable, and more.
 * @class Tag
 * @param {string} element The element representing a Tag.
 * @param {string} [settings=object] The Tag component's desired settings.
 * @param {string} [settings.audibleContent=undefined] if defined, will contain screen-reading only content for tags that will be read out upon focus/click.
 * @param {boolean} [settings.clickable=false] if true, allows click/focus functionality on this tag and turns it into an HTMLAnchorElement.
 * @param {function} [settings.clickHandler=undefined] a callback function that will occur on click. Passes this tag's component instance as an argument.
 * @param {string} settings.content the Tag's visible text content
 * @param {boolean} [settings.disabled=false] if true, causes the tag to become disabled when settings are updated.
 * @param {boolean} [settings.dismissible=false] if true, creates an "X" button on the tag, and allows it to be dismissed from the page by click or keyboard command (Alt+Del)
 * @param {function} [settings.dismissHandler=undefined] a callback function that will occur when the tag is dismissed. Passes this tag's component instance as an argument.
 * @param {string} [settings.href=undefined] if provded when `settings.clickable` is true, allows this tag to link out to another page.
 * @param {string} [settings.id=undefined] sets an HTML `id` attribute on this tag.
 * @param {HTMLElement} [settings.parent=undefined] if defined, creates a reference to a parent node that can be used for operations like removal, or to check a parent's TagList component instance.
 * @param {string} [settings.style='default'] optionally creates a different visual style on this tag, such as "error", "alert", "good", "info", or "secondary"
 * @param {string} [settings.value=undefined] if provided, creates a hidden "value" against this tag that can represent properties in corresponding components.  This correlation is user-defined.
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
    span.className += `${element.className}`;
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

  /**
   * @private
   * @returns {void}
   */
  init() {
    this.render();
    this.handleEvents();
  },

  /**
   * @returns {HTMLElement|undefined} the element that contains the Tag's text copy
   */
  get contentElement() {
    return this.element.querySelector('.tag-content');
  },

  /**
   * Renders the contents of this tag on its base element.
   * @returns {void}
   */
  render() {
    const elemClasses = this.element.classList;
    const elemClassArr = utils.getArrayFromList(this.element.classList);
    const currentState = this.settings.style;

    // Update "style" class on the top-level element
    elemClassArr.forEach((cssClass) => {
      if (tagStyles.indexOf(cssClass) > -1) {
        elemClasses.remove(cssClass);
      }
    });
    if (this.element.className.indexOf(currentState) === -1 && currentState !== 'default') {
      elemClasses.add(currentState);
    }

    // Disabled
    if (this.settings.disabled) {
      elemClasses.add('is-disabled');
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
    let tabIndex = '';
    const hasHref = (this.settings.href && this.settings.href.length);
    if (hasHref || this.originallyAnchor) {
      contentTagType = 'a';
      if (this.settings.disabled) {
        tabIndex = ' tabIndex="-1"';
      }
    }
    if (hasHref) {
      href = ` href="${this.settings.href}"`;
    }
    if (this.settings.clickable || typeof this.settings.clickHandler === 'function') {
      elemClasses.add('is-linkable');
      linkableBtn = `<button class="btn-linkable" focusable="false" tabIndex="-1">
        ${$.createIcon('caret-right')}
      </button>`;
    }
    const content = `<${contentTagType} class="tag-content"${href}${tabIndex}>${xssUtils.sanitizeHTML(this.settings.content)}</${contentTagType}>`;

    // Dismissible Button
    let dismissibleBtn = '';
    if (this.settings.dismissible) {
      elemClasses.add('is-dismissible');
      dismissibleBtn = `<button class="btn-dismissible" focusable="false" tabIndex="-1">
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
    return this.element.querySelector('.btn-dismissible');
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

    // Disabled State
    this.settings.disabled = this.disabled;

    // Dismissible State
    const dismissibleBtn = this.dismissibleBtn;
    const hasDismissibleCss = this.element.className.indexOf('is-dismissible') > -1;
    if (dismissibleBtn || hasDismissibleCss) {
      this.settings.dismissible = true;
    }

    // Hyperlink State, href, show/hide the "clickable" icon
    const hyperlink = this.element.querySelector('a');
    const hasHyperlinkCss = this.element.className.indexOf('is-linkable') > -1;
    const hasLinkableIcon = this.element.querySelector('.btn-linkable');
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
    const contentElem = this.contentElement;
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
    let parentNode = thisNode.parentNode;
    if (this.settings.parentAPI) {
      parentNode = this.settings.parentAPI.element;
    }

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
    thisNode.remove();

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
   * Glorified way to remove a tag with an extra callback, and a check for disabled
   * @param {jQuery.Event} [e] the event that triggered dismissal, if applicable.
   * @returns {void}
   */
  dismiss(e) {
    if (this.disabled) {
      return;
    }

    this.remove(e);
    if (typeof this.settings.dismissHandler === 'function') {
      this.settings.dismissHandler(this);
    }

    // If a keypress is dismissing the tag from a taglist,
    // find the previous tag in the chain and focus it.
    const parentAPI = this.settings.parentAPI;
    if (parentAPI) {
      parentAPI.focusPreviousElement(this.element);
    }
  },

  /**
   * @returns {boolean} whether or not this component is currently disabled
   */
  get disabled() {
    return this.element.className.indexOf('is-disabled') > -1;
  },

  /**
   * Disables the tag.
   * @returns {void}
   */
  disable() {
    if (this.disabled) {
      return;
    }
    if (this.contentElement.tagName === 'A') {
      this.contentElement.tabIndex = -1;
    }
    this.settings.disabled = true;
    this.element.classList.add('is-disabled');
  },

  /**
   * Enables the tag.
   * @returns {void}
   */
  enable() {
    if (!this.disabled) {
      return;
    }
    if (this.contentElement.tagName === 'A') {
      this.contentElement.tabIndex = 0;
    }
    this.settings.disabled = false;
    this.element.classList.remove('is-disabled');
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {Tag} This component's API.
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
   * @param {object} [settings] representing updated component settings.
   * @returns {Tag} This component's API.
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
    $(this.element).on('click.tag', 'a, .btn-linkable', (e) => {
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
      $(this.element).on('click.tag', '.btn-dismissible', (e) => {
        this.dismiss(e);
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
          this.dismiss(e);
        }
      });
    }
  }
};

export { Tag, COMPONENT_NAME };
