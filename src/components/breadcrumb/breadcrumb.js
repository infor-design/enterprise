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
 * @class BreadcrumbItem
 * @private
 * @param {object} [settings] representing an individual breadcrumb item's properties.
 * @param {function} [settings.callback = undefined] if defined, fires a callback function when a breadcrumb item is activated.
 * @param {string} [settings.content = ''] the text/html content of the breadcrumb.
 * @param {boolean} [settings.current = false] if true, renders without a link and displays differently to indicate active status.
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
    this.disabled = this.settings.disabled;

    // Current
    li.classList[this.settings.current ? 'add' : 'remove']('current');

    // id
    a.id = typeof this.settings.id === 'string' ? this.settings.id : '';

    // href
    if (typeof this.settings.href === 'string') {
      a.href = this.settings.href;
      a.setAttribute('href', this.settings.href);
    } else {
      a.href = undefined;
      a.removeAttribute('href');
    }

    // content
    a.innerHTML = typeof this.settings.content === 'string' ? this.settings.content : '';

    // invoke/update IDS Hyperlink
    $(a).hyperlink();

    return li;
  },

  /**
   * Enables/Disables this breadcrumb item
   * @param {boolean} state whether or not this breadcrumb item is disabled
   * @returns {void}
   */
  set disabled(state) {
    const realState = state === true;
    const a = this.element.querySelector('a');

    this.element.classList[realState ? 'add' : 'remove']('is-disabled');
    a.disabled = realState;

    if (realState) {
      a.setAttribute('disabled', realState);
      a.setAttribute('aria-disabled', realState);
      a.tabIndex = -1;
    } else {
      a.removeAttribute('disabled');
      a.removeAttribute('aria-disabled');
      a.tabIndex = 0;
    }
  },

  /**
   * Disables the breadcrumb
   * @returns {void}
   */
  disable() {
    this.disabled = true;
  },

  /**
   * Enables the breadcrumb
   * @returns {void}
   */
  enable() {
    this.disabled = false;
  },

  /**
   * Triggers a callback function that is associated with
   * @param {jQuery.Event} e the original jQuery-wrapped 'click' event
   * @param {...object} [args] any extra number of arguments to apply to the callback
   * @returns {boolean} the callback function's returned result
   */
  callback(e, ...args) {
    if (typeof this.settings.callback !== 'function') {
      return false;
    }

    // Callback is run with this Breadcrumb Item's API as `this` context.
    const callbackFn = this.settings.callback;
    const result = callbackFn.apply(this, [e].concat(args));

    if (!result) {
      e.preventDefault();
    }
    return result;
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
   * @param {boolean} [doRemove = false] if true, forces the removal of the node from the DOM.
   * @returns {void}
   */
  destroy(doRemove = false) {
    if (!this.element || !this.element.parentNode) {
      return;
    }

    // If the element was auto-generated and not build from pre-existing markup,
    // destroy everything associated.
    if (!this.fromElement) {
      const a = this.element.querySelector('a');
      if (a) {
        const $a = $(a);
        $a.off();
        $a.data('hyperlink').destroy();
      }
    }

    // Remove the node if it was not generated from markup,
    // or was explicitly told to remove
    if (doRemove || !this.fromElement) {
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
 * IDS Breadcrumb Component.
 * Navigation Component that displays a trail of previously-accessed pages.
 * @class Breadcrumb
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
    if (!Array.isArray(this.breadcrumbs)) {
      this.breadcrumbs = [];
    }

    // Detect existing list markup for backwards compatability.
    // If breadcrumbs are present, they are processed for settings and removed.
    const list = this.element.querySelector('ol');
    const breadcrumbs = utils.getArrayFromList(this.element.querySelectorAll('li'));
    if (list) {
      this.list = list;
    }
    if (breadcrumbs.length) {
      breadcrumbs.forEach((breadcrumbLi) => {
        this.add({ element: breadcrumbLi });
      });
    }

    // Convert breadcrumbs to objects
    if (!Array.isArray(this.settings.breadcrumbs)) {
      this.settings.breadcrumbs = [];
    }
    this.settings.breadcrumbs.forEach((entry) => {
      this.add(entry);
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
      if (!breadcrumb.fromElement || !breadcrumb.element) {
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

    // Reset events
    this.handleEvents();
  },

  /**
   * @param {object} settings representing an individual breadcrumb item's properties
   * @param {boolean} [doRender = false] if true, causes a re-render of the breadcrumb list
   * @returns {void}
   */
  add(settings, doRender = false) {
    if (!settings) {
      throw new Error('Settings for a new breadcrumb item must be provided.');
    }

    this.breadcrumbs.forEach((api) => {
      if (settings.id && api.id === settings.id) {
        throw new Error('New breadcrumbs must have a unique ID attribute.');
      }
    });

    this.breadcrumbs.push(new BreadcrumbItem(settings));

    if (doRender) {
      this.render();
    }
  },

  /**
   * @param {BreadcrumbItem|HTMLElement} a the anchor element to remove
   * @param {number} [index = null] representing the index of the target anchor to remove
   * @param {boolean} [doRender = false] if true, causes a re-render of the breadcrumb list
   * @returns {void}
   */
  remove(a, index = null, doRender = false) {
    let compareByIndex = false;
    let targetAPI;

    // If we get a null/non-valid first argument, and an index is provided,
    // the Breadcrumb array will be checked for an matching index number instead.
    if (!(a instanceof HTMLElement) && !isNaN(index) && index > -1) {
      compareByIndex = true;
    }

    // If a BreadcrumbItem is passed directly, use that instead of searching the array.
    if (a instanceof BreadcrumbItem) {
      targetAPI = a;
      index = this.breadcrumbs.indexOf(a);
    } else {
      // Search the breadcrumb array for either a matching anchor, or an index.
      this.breadcrumbs.forEach((breadcrumbAPI, i) => {
        if (compareByIndex) {
          if (index === i) {
            targetAPI = breadcrumbAPI;
          }
        } else {
          const thisA = breadcrumbAPI.element.querySelector('a');
          if (thisA.isEqualNode(a)) {
            targetAPI = breadcrumbAPI;
            index = i;
          }
        }
      });
    }

    if (!targetAPI) {
      const matchType = compareByIndex ? 'at index ' : ' with matching HTML anchor';
      const match = compareByIndex ? index : a;
      throw new Error(`No matching Breadcrumb was found by ${matchType} "${match}"`);
    }

    targetAPI.destroy(true);

    // Remove the API from the internal array
    this.breadcrumbs.splice(index, 1);

    if (doRender) {
      this.teardownBreadcrumbs();
      this.render();
    }
  },

  /**
   * Remove all breadcrumbs in the list
   * @param {boolean} [doRender = false] if true, causes the breadcrumb list to rerender
   * @returns {void}
   */
  removeAll(doRender = false) {
    this.breadcrumbs.forEach((breadcrumbAPI) => {
      breadcrumbAPI.destroy(true);
    });
    this.breadcrumbs = [];

    if (doRender) {
      this.render();
    }
  },

  /**
   * @param {boolean} state whether or not the component is disabled.
   * @returns {void}
   */
  set disabled(state) {
    const realState = state === true;

    // Add/remove a class on the container
    this.element.classList[realState ? 'add' : 'remove']('is-disabled');

    // Disable/enable each one individually
    this.breadcrumbs.forEach((breadcrumbAPI) => {
      breadcrumbAPI.disabled = realState;
    });
  },

  /**
   * Disables the entire breadcrumb list
   * @returns {void}
   */
  disable() {
    this.disabled = true;
  },

  /**
   * Enables the entire breadcrumb list
   * @returns {void}
   */
  enable() {
    this.disabled = false;
  },

  /**
   * Sets up Breadcrumb list-level events
   * @private
   * @returns {void}
   */
  handleEvents() {
    // Runs a callback associated with a breadcrumb item's anchor tag, if one's defined.
    $(this.list).on(`click.${COMPONENT_NAME}`, 'a', (e, ...args) => {
      const api = this.getBreadcrumbItemAPI(e.target);
      if (!api) {
        return;
      }
      api.callback(e, args);
    });
  },

  /**
   * Accesses a Breadcrumb Item's API via its anchor tag.
   * @param {HTMLElement} a the anchor tag to check for a Breadcrumb Item API.
   * @returns {BreadcrumbItem|undefined} a Breadcrumb Item API, if applicable.
   */
  getBreadcrumbItemAPI(a) {
    let api;
    this.breadcrumbs.forEach((breadcrumbAPI) => {
      const thisA = breadcrumbAPI.element.querySelector('a');
      if (a === thisA) {
        api = breadcrumbAPI;
      }
    });
    return api;
  },

  /**
   * Removes bound events and generated markup from this component, and tears down all
   * breadcrumb items.
   * @private
   * @returns {Breadcrumb} This component's API.
   */
  teardown() {
    $(this.list).off();
    $(this.element).off();

    this.teardownBreadcrumbs();
    this.breadcrumbs = [];

    return this;
  },

  /**
   * Only tears down the breadcrumb items themselves.  Does not reset the internal
   * breadcrumb array.
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
