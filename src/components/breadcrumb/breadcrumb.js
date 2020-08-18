import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';

// jQuery components
import '../hyperlinks/hyperlinks.jquery';
import '../tooltip/tooltip.jquery';

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
    this.settings.current = this.settings.current === true;
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
    this.current = this.settings.current;

    // id
    a.id = typeof this.settings.id === 'string' ? this.settings.id : '';

    // href
    if (typeof this.settings.href === 'string') {
      const cleanHref = typeof this.settings.href === 'string' ? xssUtils.stripHTML(this.settings.href) : undefined;
      a.href = cleanHref;
      a.setAttribute('href', cleanHref);
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
   * Sets whether or not this breadcrumb is currently active.
   * @param {boolean} state whether or not this breadcrumb item is disabled
   * @returns {void}
   */
  set current(state) {
    const realState = state === true;
    this.settings.current = realState;
    this.element.classList[realState ? 'add' : 'remove']('current');
  },

  /**
   * @returns {boolean} whether or not this breadcrumb is the current one
   */
  get current() {
    return this.settings.current;
  },

  /**
   * Enables/Disables this breadcrumb item
   * @param {boolean} state whether or not this breadcrumb item is disabled
   * @returns {void}
   */
  set disabled(state) {
    const realState = state === true;
    const a = this.element.querySelector('a');

    this.settings.disabled = realState;
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
   * @returns {boolean} whether or not the Breadcrumb Item is pushed into overflow by the boundaries
   * of its container element.
   */
  get overflowed() {
    const a = this.element.querySelector('a');
    const fullsizeA = document.createElement('a');

    // Get original size first
    const aRect = a.getBoundingClientRect();

    // Append temp anchor to the breadcrumb, get the size, remove it
    this.element.appendChild(fullsizeA);
    const newARect = fullsizeA.getBoundingClientRect();
    this.element.removeChild(fullsizeA);

    return newARect.width > aRect.width;
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

    // Detect current by checking the list item and the anchor
    const liHasCurrent = element.classList.contains('current') === true;
    const aHasCurrent = a && a.classList.contains('current') === true;
    this.settings.current = liHasCurrent || aHasCurrent;

    // Disabled
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
  breadcrumbs: [],
  style: BREADCRUMB_STYLES[0],
  tooltipSettings: {},
  truncate: true,
};

/**
 * IDS Breadcrumb Component.
 * Navigation Component that displays a trail of previously-accessed pages.
 * @class Breadcrumb
 * @param {HTMLElement} element the base breadcrumb element
 * @param {string} [settings] The component settings.
 * @param {array} [settings.breadcrumbs=[]] predefines breadcrumb items as plain objects.  All properties in these objects correspond to the settings available in the `BreadcrumbItem` type.
 * @param {string} [settings.style='default'] defines the style of breadcrumb this instance will render.  Can be "default" or "alternate".  Note that placing this component within a Header component has additional styles.
 * @param {object} [settings.tooltipSettings] if defined, passes settings to the internal Tooltip component.
 * @param {boolean} [settings.truncate=false] if true, creates a "truncated" breadcrumb style that keeps all breadcrumbs on a single line.
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

    // If markup needs to change, rebind events
    if (html.children?.length) {
      this.list.appendChild(html);
    }

    // Add/remove the Alternate class, if applicable
    this.element.classList[this.settings.style === 'alternate' ? 'add' : 'remove']('alternate');

    // Setup truncation, if applicable
    this.element.classList[this.settings.truncate ? 'add' : 'remove']('truncated');

    // Add ARIA to the list container
    this.list.setAttribute('aria-label', 'Breadcrumb');

    this.teardownEvents();
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

    const newBreadcrumb = new BreadcrumbItem(settings);
    this.breadcrumbs.push(newBreadcrumb);

    if (doRender) {
      this.render();

      // Set this one to current, if applicable
      if (newBreadcrumb.settings.current === true) {
        this.makeCurrent(newBreadcrumb);
      }
    }
  },

  /**
   * @param {BreadcrumbItem|HTMLElement|number} item an input representing a Breadcrumb API, an anchor tag linked to one, or an index number of a breadcrumb in the list.
   * @param {boolean} [doRender = false] if true, causes a re-render of the breadcrumb list
   * @returns {void}
   */
  remove(item, doRender = false) {
    const target = this.getBreadcrumbItemAPI(item);

    target.api.destroy(true);

    // Remove the API from the internal array
    this.breadcrumbs.splice(target.i, 1);

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
   * Sets a provided target breadcrumb as the "current" one, updating the rest.
   * @param {BreadcrumbItem|HTMLElement|number} item an input representing a Breadcrumb API, an anchor tag linked to one, or an index number of a breadcrumb in the list.
   * @returns {void}
   */
  makeCurrent(item) {
    const target = this.getBreadcrumbItemAPI(item);
    this.breadcrumbs.forEach((thisAPI) => {
      const a = thisAPI.element.querySelector('a');
      thisAPI.current = a.isEqualNode(target.a);
    });
  },

  /**
   * @returns {HTMLElement|undefined} representing the anchor of the current breadcrumb item
   */
  get current() {
    let api;
    let a;
    this.breadcrumbs.forEach((breadcrumbAPI) => {
      if (!api && breadcrumbAPI.current) {
        api = breadcrumbAPI;
        a = api.element.querySelector('a');
      }
    });
    return a;
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
      const item = this.getBreadcrumbItemAPI(e.target);
      if (!item || !item.api) {
        return;
      }
      item.api.callback(e, args);
    });

    // Setup Tooltip/detection for Overflow on each Breadcrumb Item.
    this.breadcrumbs.forEach((breadcrumbAPI) => {
      const el = breadcrumbAPI.element;
      $(el).tooltip(utils.extend({}, this.settings.tooltipSettings, {
        content: `${el.innerText}`
      }));
      $(el).on(`beforeshow.${COMPONENT_NAME}`, () => breadcrumbAPI.overflowed);
    });

    this.hasEvents = true;
  },

  /**
   * Accesses a Breadcrumb Item's API via its anchor tag.
   * @param {BreadcrumbItem|HTMLElement|number} item the anchor tag to check for a Breadcrumb Item API.
   * @returns {BreadcrumbItem|undefined} a Breadcrumb Item API, if applicable.
   */
  getBreadcrumbItemAPI(item) {
    let api;
    let a;
    let index;
    let compareByIndex = false;

    // If a breadcrumb item is passed, use that instead of searching the array.
    if (item instanceof BreadcrumbItem) {
      api = item;
      a = item.element.querySelector('a');
      index = this.breadcrumbs.indexOf(item);
    // Search the breadcrumb array for a matching anchor.
    } else if (item instanceof HTMLAnchorElement) {
      a = item;
      this.breadcrumbs.forEach((breadcrumbAPI, i) => {
        const thisA = breadcrumbAPI.element.querySelector('a');
        if (thisA.isEqualNode(a)) {
          api = breadcrumbAPI;
          index = i;
        }
      });
    // If the item is a number type, this will be used as in index number, and
    // the Breadcrumb array will be checked for an matching index instead.
    } else if (!isNaN(item) && item > -1) {
      compareByIndex = true;
      index = item;
      api = this.breadcrumbs[index];
      a = api.element.querySelector('a');
    }

    if (!api) {
      const matchType = compareByIndex ? 'at index ' : ' with matching HTML anchor';
      const match = compareByIndex ? index : a;
      throw new Error(`No matching Breadcrumb was found by ${matchType} "${match}"`);
    }

    return {
      api,
      a,
      i: index
    };
  },

  /**
   * Removes bound events and generated markup from this component, and tears down all
   * breadcrumb items.
   * @private
   * @returns {Breadcrumb} This component's API.
   */
  teardown() {
    this.teardownEvents();
    this.teardownBreadcrumbs();
    this.breadcrumbs = [];

    return this;
  },

  /**
   * Only tears down this breadcrumb list's events.
   * @private
   * @returns {void}
   */
  teardownEvents() {
    if (!this.hasEvents) {
      return;
    }

    $(this.list).off();
    $(this.element).off();
    delete this.hasEvents;
  },

  /**
   * Only tears down the breadcrumb items themselves.  Does not reset the internal
   * breadcrumb array.
   * @private
   * @returns {void}
   */
  teardownBreadcrumbs() {
    this.breadcrumbs.forEach((breadcrumbAPI) => {
      const el = breadcrumbAPI.element;
      const tooltipAPI = $(el).data('tooltip');

      if (tooltipAPI) {
        tooltipAPI.destroy();
      }
      $(el).off(`beforeshow.${COMPONENT_NAME}`);

      breadcrumbAPI.destroy();
    });
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
