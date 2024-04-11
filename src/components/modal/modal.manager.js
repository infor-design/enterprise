const EVENT_NAMESPACE = 'modalmanager';

// Used for z-index tracking
const zCounter = 1020;

// Checks to see if an object can be identified as a Modal instance.
// NOTE: This is not 100% accurate, we should find a better way to do this.
// Pulling in an import of the Modal prototype causes circular dependencies.
function isModalAPI(obj) {
  return obj !== undefined && obj.element instanceof $ && typeof obj.destroy === 'function';
}

/**
 * Top-level component that manages all modal instances. This component is responsible for handling global
 * events that apply to all modals, as well as for retaining a proper stacking order for nested modals.
 * @class ModalManager
 * @returns {ModalManager} component instance
 */
function ModalManager() {
  this.modals = [];
  this.handleEvents();
  return this;
}

ModalManager.prototype = {

  /**
   * @returns {number} representing the Fade in/out duration of the Modal Overlay,
   * measured in IDS RenderLoop ticks.
   */
  get modalFadeDuration() {
    return 10;
  },

  /**
   * @returns {array} containing references to all currently visible (not necessarily "displayed") modals.
   */
  get currentlyOpen() {
    return this.modals.filter(api => api.visible);
  },

  /**
   * @returns {Modal} api containing a reference to the current modal window that is displayed.
   */
  get currentlyActive() {
    let active;
    this.modals.forEach((api) => {
      if (api.active) {
        active = api;
      }
    });
    return active;
  },

  /**
   * @param {Modal} api the incoming Modal API to set as displayed
   */
  set currentlyActive(api) {
    if (!isModalAPI(api)) {
      throw new Error('Cannot set the provided Modal API to currently displayed.');
    }

    this.modals.forEach((thisAPI, i) => {
      // Set Active
      thisAPI.active = ($(thisAPI.element).is(api.element));

      if (thisAPI.active) {
        // Active Modal sits at the top
        thisAPI.element[0].style.zIndex = `${(zCounter + i)}`;
      } else if (thisAPI.visible) {
        // Inactive Modals are open, but sit behind the overlay
        thisAPI.element[0].style.zIndex = `${(zCounter - 100 + i)}`;
      } else {
        // All others disappear
        thisAPI.element[0].style.zIndex = '';
      }
    });
    this.refresh();
  },

  /**
   * @returns {Modal} api representing the furthest-down Modal on the stack.
   */
  get last() {
    let api;
    const currentlyOpen = this.currentlyOpen;
    const size = currentlyOpen.length;
    if (size) {
      api = currentlyOpen[size - 1];
    }
    return api;
  },

  /**
   * Builds the modal containment structure and overlay elements that are reused between modals.
   * @private
   * @returns {void}
   */
  render() {
    const fragment = document.createDocumentFragment();
    const rootElem = document.createElement('div');
    const overlay = document.createElement('div');

    rootElem.id = 'ids-modal-root';
    rootElem.classList.add('modal-page-container');
    rootElem.setAttribute('aria-hidden', true);
    fragment.appendChild(rootElem);

    overlay.classList.add('overlay');
    overlay.setAttribute('aria-hidden', true);
    rootElem.appendChild(overlay);

    document.body.appendChild(rootElem);
    this.rootElem = rootElem;
    this.overlayElem = overlay;
  },

  /**
   * Updates the visual state of the overlay/root containers
   * @returns {void}
   */
  refresh() {
    let active = this.currentlyActive;
    if (!active) {
      active = this.activateLast();
    }

    this.checkOverlayVisibility();

    if (active) {
      this.showContainers(active);
    } else {
      this.hideContainers(active);
    }
  },

  /**
   * Shows the root container and fades in the overlay to the correct opacity.
   * DO NOT CALL THIS DIRECTLY.
   * @private
   */
  showContainers() {
    this.rootElem.removeAttribute('aria-hidden');
    this.overlayElem.removeAttribute('aria-hidden');

    // Add the 'modal-engaged' class after all the HTML markup and CSS classes have a
    // chance to be established
    // (Fixes an issue in non-V8 browsers (FF, IE) where animation doesn't work correctly).
    // http://stackoverflow.com/questions/12088819/css-transitions-on-new-elements
    $('body')[0].classList.add('modal-engaged');
  },

  /**
   * Hides the root container and fades out the overlay.
   * DO NOT CALL THIS DIRECTLY.
   * @private
   * @param {Modal} api the active Modal API
   */
  hideContainers() {
    this.rootElem.setAttribute('aria-hidden', true);
    this.overlayElem.setAttribute('aria-hidden', true);

    $('body')[0].classList.remove('modal-engaged');
  },

  /**
   * @param {Modal} api the modal API to unregister
   * @returns {void}
   */
  register(api) {
    if (!isModalAPI(api)) {
      throw new Error('The provided API is not a Modal API, and cannot be registered.');
    }

    this.checkRootElements();
    const hasInstance = this.modals.filter(thisAPI => $(thisAPI.element).is(api)) > 0;
    if (!hasInstance) {
      this.modals.push(api);
    }
  },

  /**
   * @param {Modal} api the modal API to unregister
   * @returns {void}
   */
  unregister(api) {
    if (!isModalAPI(api)) {
      throw new Error('The provided API is not a Modal API, and cannot be unregistered.');
    }

    this.checkRootElements();
    this.modals = this.modals.filter(thisAPI => !($(thisAPI.element).is(api.element)));
  },

  /**
   * Adjusts the overlay's visiblity/opacity.  If no modals are present, the overlay "hides".
   * Otherwise, the overlay is adjusted to the currently active Modal's `opacity` setting.
   * @private
   * @returns {void}
   */
  checkOverlayVisibility() {
    let opacity = 0;
    const active = this.currentlyActive;
    if (active) {
      opacity = this.currentlyActive.settings.overlayOpacity;
    }

    this.overlayElem.style.background = `rgba(0, 0, 0, ${opacity ? `${opacity}` : ''})`;
  },

  /**
   * Checks that the root element and the overlay exist.  In some environments (Angular),
   * the root node may become modified after these elements are drawn, and links may need
   * to be re-established.
   * @private
   * @returns {void}
   */
  checkRootElements() {
    const rootElem = document.querySelector('#ids-modal-root');
    if (rootElem instanceof HTMLElement) {
      this.rootElem = rootElem;
      const overlayElem = rootElem.querySelector('.overlay');
      if (overlayElem instanceof HTMLElement) {
        this.overlayElem = overlayElem;
      }
      return;
    }

    if (this.rootElem instanceof HTMLElement) {
      document.body.appendChild(this.rootElem);
    } else {
      this.render();
    }
  },

  /**
   * Closes a Modal on the page globally by its element
   * @param {jQuery|HTMLElement} [elem] the `.modal` element to close. If this is not provided, the last Modal API on the stack is used.
   * @param {boolean} [cancelled=false] passes along a flag that designates this close action as "cancelled" to the Modal API.
   * @returns {void}
   */
  close(elem, cancelled = false) {
    let api;
    if (!elem || !(elem instanceof HTMLElement || (elem instanceof $ && elem.length))) {
      api = this.last;
    } else {
      api = $(elem).data('modal');
    }
    if (!api) {
      return;
    }

    if (cancelled) {
      api.isCancelled = true;
    }
    api.close();
  },

  /**
   * Closes all registered modals
   * @param {boolean} [cancelled=false] passes along a flag that designates this close action as "cancelled" to the Modal API.
   * @returns {void}
   */
  closeAll(cancelled = false) {
    this.modals.forEach((api) => {
      if (cancelled) {
        api.isCancelled = true;
      }
      api.close(undefined, true);
    });

    this.refresh();
  },

  /**
   * Destroys all registered modals
   * @param {boolean} [capsOnly=true] If true, nly destroy the caps.
   * @returns {void}
   */
  destroyAll(capsOnly = false) {
    this.modals.forEach((api) => {
      const okToDestroy = !capsOnly || api.capAPI;
      if (okToDestroy) {
        api.close(undefined, true);
        api.destroy();
      }
    });

    this.refresh();
  },

  /**
   * Closes the last open modal in the stack
   * @param {boolean} [cancelled=false] passes along a flag that designates this close action as "cancelled" to the Modal API.
   * @returns {void}
   */
  closeLast(cancelled = false) {
    this.close(undefined, cancelled);
  },

  /**
   * Activates the last currently open Modal on the stack.
   * @returns {Modal} representing the API that was activated.
   */
  activateLast() {
    const api = this.last;
    if (api) {
      this.currentlyActive = api;
    }
    return api;
  },

  /**
   * Find a modal instance if the modal has been opened and not destroyed.
   * @param  {string} id The id to look for
   * @returns {Modal|undefined} a matching Modal API instance, if available
   */
  findById(id) {
    if (!id) {
      return undefined;
    }
    const results = this.modals.filter(api => api.id === id);
    return results[0] || undefined;
  },

  /**
   * Sets up the events
   * @private
   * @returns {void}
   */
  handleEvents() {
    if (this.hasEstablishedEvents) {
      this.teardown();
    }

    // Setup a global keydown event that can handle the closing of modals in the proper order.
    $(document).on(`keydown.${EVENT_NAMESPACE}`, (e) => {
      const modalTargetElem = $(e.target).parents('.modal.is-active');
      const keyCode = e.which || e.keyCode;

      switch (keyCode) {
        // Escape Key
        case 27:
          this.close(modalTargetElem, true);
          break;
        case 9:
          this.setModalFocus(e.shiftKey ? 'last' : 'first', e);
          break;
        default:
          break;
      }
    });

    // Setup a listener for building out core Modal container markup.
    // If state is being refreshed, simply run the method.
    const self = this;
    if (!this.preRendered) {
      $(document).ready(() => {
        self.checkRootElements();
        self.preRendered = true;
      });
    } else {
      this.checkRootElements();
    }

    this.hasEstablishedEvents = true;
  },

  /**
   * Redirects the page's focus to an element within the currently active Modal.
   * @param {string} place the location to set the Modal's current focus
   * @param {jQuery.Event} e the original jquery event
   * @returns {void}
   */
  setModalFocus(place, e) {
    const api = this.currentlyActive;
    if (!api) {
      return;
    }

    // If focus already exists within the modal, with the exception of certain placements
    // on certain elements, return out and allow change of focus to occur as normal.
    if (api.isFocused) {
      if (!($(api.focusableElems.last).is(document.activeElement) && place === 'first') &&
        !($(api.focusableElems.first).is(document.activeElement) && place === 'last')) {
        return;
      }
    }
    e.preventDefault();
    api.setFocus(place);
  },

  /**
   * @returns {void}
   */
  teardown() {
    $(document).off(`keydown.${EVENT_NAMESPACE}`);
    delete this.hasEstablishedEvents;

    if (this.preRendered) {
      this.rootElem.parentNode.remove(this.rootElem);
      delete this.overlayElem;
      delete this.rootElem;
      delete this.preRendered;
    }
  }
};

// Export a single instance
const modalManager = new ModalManager();
export { modalManager };
