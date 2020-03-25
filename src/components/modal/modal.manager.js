import { DOM } from '../../utils/dom';
import { Modal } from '../../components/modal/modal';

const EVENT_NAMESPACE = 'modalmanager';

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
   * @returns {array} containing references to all currently displayed modals
   */
  get currentlyOpen() {
    return this.modals.filter(api => api.visible);
  },

  /**
   * @param {Modal} api the modal API to unregister
   * @returns {void}
   */
  register(api) {
    if (!(api instanceof Modal)) {
      throw new Error('The provided API is not a Modal API, and cannot be registered.');
    }

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
    if (!(api instanceof Modal)) {
      throw new Error('The provided API is not a Modal API, and cannot be unregistered.');
    }

    this.modals = this.modals.filter(thisAPI => $(thisAPI.element).is(api.element));
  },

  /**
   * Closes a Modal on the page globally by its element
   * @param {jQuery|HTMLElement} elem the `.modal` element to close.
   * @param {boolean} [cancelled=false] passes along a flag that designates this close action as "cancelled" to the Modal API.
   * @returns {void}
   */
  close(elem, cancelled = false) {
    const $elem = $(elem);
    const api = $elem.data('modal');
    if (!api) {
      throw new Error(`Cannot detect a modal instance against element "${DOM.getSimpleSelector($elem[0])}".`);
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
      api.close();
    });
  },

  /**
   * Closes the last open modal in the stack
   * @param {boolean} [cancelled=false] passes along a flag that designates this close action as "cancelled" to the Modal API.
   * @returns {void}
   */
  closeLast(cancelled = false) {
    const currentlyOpen = this.currentlyOpen;
    const size = currentlyOpen.length;
    if (!size) {
      return;
    }

    const api = currentlyOpen[size - 1];
    if (cancelled) {
      api.isCancelled = true;
    }
    api.close();
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
      const modalTargetElem = $(e.target).parents('.modal');
      const keyCode = e.which || e.keyCode;

      switch (keyCode) {
        // Escape Key
        case 27:
          if (!modalTargetElem.length) {
            this.closeLast();
          } else {
            this.close(modalTargetElem);
          }
          break;
        default:
          break;
      }
    });

    this.hasEstablishedEvents = true;
  },

  /**
   * @returns {void}
   */
  teardown() {
    $(document).off(`keydown.${EVENT_NAMESPACE}`);
    delete this.hasEstablishedEvents;
  }
};

// Export a single instance
const modalManager = new ModalManager();
export { modalManager };
