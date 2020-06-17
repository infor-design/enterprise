import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';

// jQuery components
import '../hyperlinks/hyperlinks.jquery';

// Breadcrumb Item default settings
const BREADCRUMB_ITEM_DEFAULTS = {
  callback: undefined,
  content: '',
  current: false,
  disabled: false,
  href: undefined,
  id: undefined,
};

/**
 * Represents the current state of a single breadcrumb item.  Used internally by the IDS Breadcrumb component.
 * @private
 * @param {object} [settings] representing an individual breadcrumb item's properties.
 * @param {function} [settings.callback = undefined] if defined, fires a callback function when a breadcrumb item is activated.
 * @param {string} [settings.content=''] the text/html content of the breadcrumb.
 * @param {boolean} [settings.current=false] if true, renders without a link and displays differently to indicate active status.
 * @param {boolean} [settings.disabled = false] if true, causes this breadcrumb not to be interactable.
 * @param {string} [settings.href = undefined] if defined, used as the contents of an `href` attribute.
 * @param {string} [settings.id = undefined] if defined, used as the contents of an `id` attribute.
 * @returns {this} component instance
 */
function BreadcrumbItem(settings) {
  this.settings = utils.mergeSettings(null, settings, BREADCRUMB_ITEM_DEFAULTS);
  return this.init();
}
BreadcrumbItem.prototype = {
  init() {
    // If an element is passed directly, scrape settings (backwards compatibility).
    if (this.settings.element instanceof HTMLElement) {
      this.getSettingsFromElement();
    }

    this.settings.callback = typeof this.settings.callback === 'function' ? this.settings.callback : null;
    this.settings.content = typeof this.settings.content === 'string' ? xssUtils.stripHTML(this.settings.content) : '';
    this.settings.disabled = this.settings.disabled === true;
    this.settings.id = typeof this.settings.id === 'string' ? xssUtils.stripHTML(this.settings.id) : undefined;
    this.settings.href = typeof this.settings.href === 'string' ? xssUtils.stripHTML(this.settings.href) : undefined;

    return this;
  },

  /**
   * Renders a single breadcrumb item
   * @returns {void}
   */
  render() {
    const li = document.createElement('li');
    const a = document.createElement('a');
    li.appendChild(a);

    this.element = li;
    this.refresh();

    return li;
  },

  /**
   * Sets the current state of a single breadcrumb item
   * @returns {void}
   */
  refresh() {
    const li = this.element;
    let a = li.querySelector('a');
    if (!a) {
      a = document.createElement('a');
      li.innerHTML = '';
      li.appendChild(a);
    }

    // Disabled
    a.disabled = this.settings.disabled;
    li.classList[this.settings.disabled ? 'add' : 'remove']('is-disabled');

    // Current
    li.classList[this.settings.current ? 'add' : 'remove']('current');

    // id
    a.id = typeof this.settings.id === 'string' ? this.settings.id : '';

    // href
    a.href = typeof this.settings.href === 'string' ? this.settings.href : '';

    // content
    a.innerHTML = typeof this.settings.content === 'string' ? this.settings.content : '';

    // invoke/update IDS Hyperlink
    $(a).hyperlink();

    return li;
  },

  /**
   * Scrapes an existing HTML <li> element for breadcrumb-related settings, and saves them.
   * @returns {void}
   */
  getSettingsFromElement() {
    const element = this.settings.element;
    const a = element.querySelector('a');

    // Remove the "current" label if we find one
    function cleanAria(str) {
      str = str.replace('<span class="audible">Current</span>', '');
      return xssUtils.stripHTML(str);
    }

    // Some legacy breadcrumb items are not reprsented by a hyperlink
    if (!a) {
      this.settings.content = cleanAria(element.innerHTML);
      if (element.id) {
        this.settings.id = element.id;
      }
    } else {
      this.settings.content = cleanAria(a.innerHTML);
      this.settings.href = a.href;
      this.settings.id = a.id;
    }

    this.settings.current = element.classList.contains('current') === true;
    this.settings.disabled = element.classList.contains('is-disabled') === true;

    // Clean up reference
    this.element = element;
    this.fromElement = true;
    delete this.settings.element;
  },

  /**
   * Tears down this breadcrumb item
   * @returns {void}
   */
  destroy() {
    if (!this.fromElement && this.element && this.element.parentNode) {
      const a = this.element.querySelector('a');
      if (a) {
        const $a = $(a);
        $a.off();
        $a.data('hyperlink').destroy();
      }

      this.element.parentNode.removeChild(this.element);
      delete this.element;
    }
  },
};

// Breadcrumb Component Name
const COMPONENT_NAME = 'breadcrumb';

// Breadcrumb Styles
const BREADCRUMB_STYLES = ['default', 'alternate'];

// Breadcrumb default settings
const BREADCRUMB_DEFAULTS = {
  style: BREADCRUMB_STYLES[0],
  breadcrumbs: []
};

/**
 * IDS Breadcrumb Component
 * Navigation Component that displays a trail of previously-accessed pages.
 * @param {HTMLElement} element the base breadcrumb element
 * @param {string} [settings] The component settings.
 * @param {string} [settings.style='default'] defines the style of breadcrumb this instance will render.  Can be "default" or "alternate".  Note that placing this component within a Header component has additional styles.
 * @param {array} [settings.breadcrumbs=[]] predefines breadcrumb items as plain objects.  All properties in these objects correspond to the settings available in the `BreadcrumbItem` type.
 * @returns {this} component instance
 */
function Breadcrumb(element, settings) {
  if (!(element instanceof HTMLElement)) {
    throw new Error('`element` argument must be of type `HTMLElement`');
  }

  this.element = element;
  this.settings = utils.mergeSettings(element, settings, BREADCRUMB_DEFAULTS);
  this.init();
  return this;
}

Breadcrumb.prototype = {
  /**
   * @private
   */
  init() {
    this.breadcrumbs = [];

    // Detect existing list markup for backwards compatability.
    // If breadcrumbs are present, they are processed for settings and removed.
    const list = this.element.querySelector('ol');
    const breadcrumbs = utils.getArrayFromList(this.element.querySelectorAll('li'));
    if (list) {
      this.list = list;
    }
    if (breadcrumbs.length) {
      breadcrumbs.forEach((breadcrumbLi) => {
        const breadcrumb = new BreadcrumbItem({ element: breadcrumbLi });
        this.breadcrumbs.push(breadcrumb);
      });
    }

    // Convert breadcrumbs to objects
    if (!Array.isArray(this.settings.breadcrumbs)) {
      this.settings.breadcrumbs = [];
    }
    this.settings.breadcrumbs.forEach((entry) => {
      this.breadcrumbs.push(new BreadcrumbItem(entry));
    });

    // Check the element for a valid style CSS class
    if (this.element.classList.contains(BREADCRUMB_STYLES[1])) {
      this.settings.style = BREADCRUMB_STYLES[1];
    }
    // Reset the style setting if it's not valid
    if (BREADCRUMB_STYLES.indexOf(this.settings.style) === -1) {
      this.settings.style = BREADCRUMB_STYLES[0];
    }

    this.render();
  },

  /**
   * Renders the entire breadcrumb chain
   * @private
   * @returns {void}
   */
  render() {
    // Build the list
    if (!this.list) {
      this.list = document.createElement('ol');
      this.element.appendChild(this.list);
    } else {
      this.teardownBreadcrumbs();
    }

    // Build/invoke hyperlinks against each item
    const html = document.createDocumentFragment();
    this.breadcrumbs.forEach((breadcrumb) => {
      if (!breadcrumb.fromElement) {
        const li = breadcrumb.render();
        html.appendChild(li);
      } else {
        breadcrumb.refresh();
      }
    });
    this.list.appendChild(html);

    // Add/remove the Alternate class, if applicable
    this.element.classList[this.settings.style === 'alternate' ? 'add' : 'remove']('alternate');

    // Add ARIA to the list container
    this.list.setAttribute('aria-label', 'Breadcrumb');
  },

  /**
   * Removes bound events and generated markup from this component
   * @private
   * @returns {Breadcrumb} This component's API.
   */
  teardown() {
    $(this.list).off();
    $(this.element).off();

    this.teardownBreadcrumbs();
    delete this.list;

    return this;
  },

  /**
   * @private
   * @returns {void}
   */
  teardownBreadcrumbs() {
    this.breadcrumbs.forEach(breadcrumb => breadcrumb.destroy());
  },

  /**
   * Update the component with new settings.
   * @param {object} settings The settings you would like to modify.
   * @returns {Breadcrumb} This component's API.
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    this.teardown();
    this.init();
    return this;
  },

  /**
  * Teardown and remove any added markup and events.
  * @returns {void}
  */
  destroy() {
    this.teardown();
    $.removeData(this.element, COMPONENT_NAME);
  },
};

export { Breadcrumb, BREADCRUMB_DEFAULTS, COMPONENT_NAME };
