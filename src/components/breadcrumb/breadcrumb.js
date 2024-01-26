import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';
import { Environment as env } from '../../utils/environment';
import { renderLoop, RenderLoopItem } from '../../utils/renderloop';

// jQuery components
import '../hyperlinks/hyperlinks.jquery';
import '../popupmenu/popupmenu.jquery';

// Breadcrumb Item default settings
const BREADCRUMB_ITEM_DEFAULTS = {
  attributes: null,
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
    let li = this.element;
    let a;
    let span;
    if (!li) {
      li = document.createElement('li');
      if (this.settings.href) {
        a = document.createElement('a');
        li.appendChild(a);
      } else {
        span = document.createElement('span');
        li.appendChild(span);
      }
      this.element = li;
    }

    // Base Class
    li.classList.add('breadcrumb-item');

    return li;
  },

  /**
   * Sets the current state of a single breadcrumb item
   * @returns {void}
   */
  refresh() {
    const li = this.element;
    const a = li.querySelector('a');
    const span = li.querySelector('span:not(.audible)');
    const $a = a ? $(a) : undefined;

    // Disabled
    this.disabled = this.settings.disabled;

    // Current
    this.current = this.settings.current;

    // id
    (a || li).id = typeof this.settings.id === 'string' ? this.settings.id : '';

    // content
    (a || span || li).innerHTML = typeof this.settings.content === 'string' ? this.settings.content : '';

    // href
    if (a) {
      if (typeof this.settings.href === 'string') {
        const cleanHref = typeof this.settings.href === 'string' ? xssUtils.stripHTML(this.settings.href) : undefined;
        a.href = cleanHref;
        a.setAttribute('href', cleanHref);
      } else {
        a.href = undefined;
        a.removeAttribute('href');
      }

      // invoke/update IDS Hyperlink
      $a.hyperlink();
    }

    if (span) {
      if (span.parentNode.isEqualNode(li)) {
        span.classList.add('breadcrumb-text');
      }
    }

    // Add user-defined attributes to each breadcrumb, if applicable
    if (Array.isArray(this.settings.attributes)) {
      utils.addAttributes(($a || $(li)), this, this.settings.attributes);
    }

    return li;
  },

  /**
   * Set the anchor's tabIndex based on its current overflow state, if applicable
   * @private
   * @returns {void}
   */
  checkFocus() {
    const a = this.a;
    if (!a) {
      return;
    }

    let isOverflowed = this.overflowed;

    // IE11/Edge don't implement truncated view, so never hide them due to overflow
    if (env.browser.isIE11 || env.browser.isEdge) {
      isOverflowed = false;
    }

    a.tabIndex = (isOverflowed || this.disabled) ? -1 : 0;
    a.setAttribute('tabindex', a.tabIndex);
  },

  /**
   * @returns {HTMLAnchorElement} reference to this breadcrumb item's anchor tag
   */
  get a() {
    return this.element.querySelector('a');
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
    this.settings.disabled = realState;
    this.element.classList[realState ? 'add' : 'remove']('is-disabled');

    const a = this.a;
    if (!a) {
      return;
    }

    a.disabled = realState;
    if (realState) {
      a.setAttribute('disabled', realState);
      a.setAttribute('aria-disabled', realState);
    } else {
      a.removeAttribute('disabled');
      a.removeAttribute('aria-disabled');
    }
  },

  /**
   * @returns {boolean} `true` if this Breadcrumb item is currently disabled
   */
  get disabled() {
    const aDisabled = this.a?.getAttribute('disabled');
    const liDisabled = this.element.getAttribute('is-disabled');
    return aDisabled || liDisabled;
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
    const li = this.element;
    const a = li.querySelector('a');
    const span = li.querySelector('span');

    // Get original size first
    const elemRect = (a || span || li).getBoundingClientRect();
    const containerRect = this.element.parentNode.getBoundingClientRect();

    if (env.rtl) {
      return containerRect.right < elemRect.right;
    }
    return containerRect.left > elemRect.left;
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
   * @returns {Number} the current index of this breadcrumb within the parent list
   */
  get index() {
    let el = this.element;
    let i = 0;
    while (el.previousSibling !== null) {
      el = el.previousSibling;
      i++;
    }
    return i;
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
      const a = this.a;
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
 * @param {boolean} [settings.truncate=true] if true, creates a "truncated" breadcrumb style that keeps all breadcrumbs on a single line.  If false, causes breadcrumbs to wrap to subsequent lines.
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
      this.teardownEvents();
      this.teardownBreadcrumbs();
    }

    // Build all the list items
    const html = document.createDocumentFragment();
    this.breadcrumbs.forEach((breadcrumb) => {
      if (!breadcrumb.fromElement || !breadcrumb.element) {
        const li = breadcrumb.render();
        html.appendChild(li);
      }
    });

    // Used by the popupmenu below
    // (linter doesn't like this being in the "if" block)
    function breadcrumbMoreMenuBeforeOpen(response) {
      let menuHTML = '';
      this.overflowed.forEach((breadcrumb, i) => {
        let liDisabled = '';
        let aDisabled = '';
        if (breadcrumb.settings.disabled) {
          liDisabled = ' is-disabled';
          aDisabled = ' disabled';
        }

        const menuItemHTML = `<li class="${liDisabled}">
          <a href="${breadcrumb.settings.href || '#'}" data-breadcrumb-index="${i}"${aDisabled}>${breadcrumb.settings.content || ''}</a>
        </li>`;
        menuHTML += menuItemHTML;
      });
      response(menuHTML);
    }

    // Render/Refresh an overflow button
    if (this.canDetectResize) {
      const hasoverflowBtn = this.overflowBtn;
      if (!hasoverflowBtn) {
        const overflowContainer = document.createElement('div');
        const overflowBtn = document.createElement('button');
        const overflowMenu = document.createElement('ul');
        const overflowSpan = document.createElement('span');

        overflowContainer.classList.add('breadcrumb-overflow-container');
        overflowBtn.classList.add('btn-actions');
        overflowBtn.classList.add('overflow-btn');
        overflowSpan.innerText = 'More Breadcrumbs';
        overflowSpan.classList.add('audible');

        overflowBtn.insertAdjacentHTML('afterbegin', $.createIcon({ icon: 'more' }));
        overflowBtn.appendChild(overflowSpan);
        overflowContainer.appendChild(overflowBtn);
        overflowContainer.appendChild(overflowMenu);
        this.overflowContainerElem = overflowContainer;
        this.overflowBtn = overflowBtn;
        this.overflowMenu = overflowMenu;
      }
      this.element.insertBefore(this.overflowContainerElem, this.list);

      // Invoke popupmenu against the "More" button
      $(this.overflowBtn).popupmenu({
        menu: $(this.overflowMenu),
        beforeOpen: breadcrumbMoreMenuBeforeOpen.bind(this)
      });
    }

    // If markup needs to change, rebind events
    if (html.childNodes?.length) {
      this.list.appendChild(html);
    }

    // Add ARIA to the list container
    this.list.setAttribute('aria-label', 'Breadcrumb');

    // Decorate
    this.element.classList.add('breadcrumb');
    this.list.classList.add('breadcrumb-list');

    // Refresh the state of everything in the Breadcrumb list
    this.refresh();

    this.handleEvents();
  },

  /**
   * @param {object} settings representing an individual breadcrumb item's properties
   * @param {boolean} [doRender = false] if true, causes a re-render of the breadcrumb list
   * @param {boolean} [doAddToDataset = false] if true, adds the new settings object to the `settings.breadcrumbs` array
   * @returns {void}
   */
  add(settings, doRender = false, doAddToDataset = false) {
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

    if (doAddToDataset) {
      this.settings.breadcrumbs.push(settings);
    }

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
   * @param {boolean} [doRemoveFromDataset = false] if true, removes the corresponding settings object from the `settings.breadcrumbs` array
   * @returns {void}
   */
  remove(item, doRender = false, doRemoveFromDataset = false) {
    const target = this.getBreadcrumbItemAPI(item);

    target.api.destroy(true);

    // Remove the API from the internal array
    this.breadcrumbs.splice(target.i, 1);

    if (doRemoveFromDataset) {
      this.settings.breadcrumbs.splice(target.i, 1);
    }

    if (doRender) {
      this.render();
    }
  },

  /**
   * Remove all breadcrumbs in the list
   * @param {boolean} [doRender = false] if true, causes the breadcrumb list to rerender
   * @param {boolean} [doResetDataset = false] if true, clears the `settings.breadcrumb` array.
   * @returns {void}
   */
  removeAll(doRender = false, doResetDataset = false) {
    this.breadcrumbs.forEach((breadcrumbAPI) => {
      breadcrumbAPI.destroy(true);
    });
    this.breadcrumbs = [];

    if (doResetDataset) {
      this.settings.breadcrumbs = [];
    }

    if (doRender) {
      this.render();
    } else {
      this.refresh();
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
      const li = thisAPI.element;
      thisAPI.current = li.isEqualNode(target.api.element);
    });
  },

  /**
   * @returns {HTMLElement|undefined} representing the currently-selected breadcrumb list item
   */
  get current() {
    let api;
    let li;
    this.breadcrumbs.forEach((breadcrumbAPI) => {
      if (!api && breadcrumbAPI.current) {
        api = breadcrumbAPI;
        li = api.element;
      }
    });
    return li;
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
   * @returns {array<BreadcrumbItem>} containing all currently-overflowed Breadcrumb items
   */
  get overflowed() {
    return this.breadcrumbs.filter(item => item.overflowed);
  },

  /**
   * @returns {boolean} whether or not the breadcrumb list is capable of detecting a resize
   * NOTE: This allows IE11 (and other browsers that don't support ResizeObserver) to gracefully
   * degrade into a non-truncated mode.
   */
  get canDetectResize() {
    return this.settings.truncate && env.features.resizeObserver;
  },

  /**
   * Sets up Breadcrumb list-level events
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;

    // Runs a callback associated with a breadcrumb item's anchor tag, if one's defined.
    $(this.list).on(`click.${COMPONENT_NAME}`, 'li', (e, ...args) => {
      const item = this.getBreadcrumbItemAPI(e.currentTarget);
      if (!item || !item.api) {
        return;
      }
      item.api.callback(e, args);
    });

    // Setup a resize observer for detection when truncation is enabled.
    // To prevent `ResizeObserver loop limit exceeded thrown` errors, the callback for the
    // ResizeObserver is debounced by running in a RenderLoop tick.
    if (this.canDetectResize) {
      this.previousSize = this.list.getBoundingClientRect();
      this.ro = new ResizeObserver(() => { // eslint-disable-line
        if (this.detectCheck) {
          this.detectCheck.destroy(true);
        }
        this.detectCheck = new RenderLoopItem({
          duration: 1,
          timeoutCallback() {
            const newSize = self.list.getBoundingClientRect();
            if (newSize.width !== self.previousSize.width) {
              self.previousSize = newSize;
              self.refresh();
              delete self.detectCheck;
            }
          }
        });
        renderLoop.register(this.detectCheck);
      });
      this.ro.observe(this.list);
    }

    // Picking an item from the overflow menu should cause the original breadcrumb item's operation to occur.
    // This will either trigger the item's callback, or simply follow its `href` attribute.
    if (this.overflowBtn) {
      $(this.overflowBtn).on(`selected.${COMPONENT_NAME}`, (e, ...args) => {
        // First argument is the clicked item from the `popupmenu.selected` event
        const liItem = args[0];
        const index = liItem[0].getAttribute('data-breadcrumb-index');
        const breadcrumbAPI = this.overflowed[Number(index)];
        $(breadcrumbAPI.element).trigger('click');
      });
    }

    this.hasEvents = true;
  },

  /**
   * Accesses a Breadcrumb Item's API using various methods.
   * @param {BreadcrumbItem|HTMLElement|number} item the anchor/list-item to check for a Breadcrumb Item API.
   * @returns {BreadcrumbItem|undefined} a Breadcrumb Item API, if applicable.
   */
  getBreadcrumbItemAPI(item) {
    let api;
    let li;
    let index;
    let compareByIndex = false;

    // If a breadcrumb item is passed, use that instead of searching the array.
    if (item instanceof BreadcrumbItem) {
      api = item;
      li = item.element;
      index = this.breadcrumbs.indexOf(item);
    // Search the breadcrumb array for a matching anchor.
    } else if (item instanceof HTMLAnchorElement) {
      li = item.parentNode;
    } else if (item instanceof HTMLLIElement) {
      li = item;
    // If the item is a number type, this will be used as in index number, and
    // the Breadcrumb array will be checked for an matching index instead.
    } else if (!isNaN(item) && item > -1) {
      compareByIndex = true;
      index = item;
      api = this.breadcrumbs[index];
      li = api.element;
    }

    // If the list item's been defined (but nothing else) grok the others
    if (li && !api && !index) {
      this.breadcrumbs.forEach((breadcrumbAPI, i) => {
        const thisLi = breadcrumbAPI.element;
        if (thisLi.isEqualNode(li)) {
          api = breadcrumbAPI;
          index = i;
        }
      });
    }

    if (!api) {
      const matchType = compareByIndex ? 'at index ' : ' with matching HTML List Item';
      const match = compareByIndex ? index : li;
      throw new Error(`No matching Breadcrumb was found by ${matchType} "${match}"`);
    }

    return {
      api,
      li,
      i: index
    };
  },

  /**
   * Refreshes the state of the Breadcrumb list while re-rendering as little as possible.
   * @param {boolean} [doHandleEvents = false] if true, causes all events to unbind/rebind
   * @returns {void}
   */
  refresh(doHandleEvents = false) {
    if (doHandleEvents) {
      this.teardownEvents();
    }

    // Refresh the state of all breadcrumb items
    this.breadcrumbs.forEach((breadcrumbAPI) => {
      breadcrumbAPI.refresh();
    });

    // Add/remove the Alternate class, if applicable
    this.element.classList[this.settings.style === 'alternate' ? 'add' : 'remove']('alternate');

    // Setup truncation, if applicable
    // Truncation only occurs when the list of breadcrumbs is larger than the container
    if (this.canDetectResize) {
      this.element.classList[this.overflowed.length || this.element.scrollHeight > 55 ? 'add' : 'remove']('truncated');
    } else {
      this.element.classList.remove('truncated');
      this.element.classList.add('no-truncate');
    }

    // Reset the tabindex separately (needs to be done after content renders for all breadcrumbs)
    this.breadcrumbs.forEach((breadcrumbAPI) => {
      breadcrumbAPI.checkFocus();
    });

    if (doHandleEvents) {
      this.handleEvents();
    }
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

    if (this.overflowContainerElem) {
      const popupmenuAPI = $(this.overflowBtn).data('popupmenu');
      if (popupmenuAPI) {
        popupmenuAPI.destroy();
      }
      if (this.overflowContainerElem.parentNode) {
        this.element.removeChild(this.overflowContainerElem);
      }
    }

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

    if (this.ro) {
      this.ro.disconnect();
      delete this.ro;
    }

    if (this.overflowBtn) {
      $(this.overflowBtn).off([
        `beforeopen.${COMPONENT_NAME}`,
        `selected.${COMPONENT_NAME}`
      ].join(' '));
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
