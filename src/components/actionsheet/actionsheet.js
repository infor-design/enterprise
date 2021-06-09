import { DOM } from '../../utils/dom';
import { utils } from '../../utils/utils';
import { Environment as env } from '../../utils/environment';
import { breakpoints } from '../../utils/breakpoints';

// jQuery Components
import '../icons/icons.jquery';
import '../popupmenu/popupmenu.jquery';

// Component Name
const COMPONENT_NAME = 'actionsheet';
const ROOT_ELEM_ID = 'ids-actionsheet-root';

const DISPLAY_AS_MENU_OPTIONS = [false, 'responsive', 'always'];

const ACTION_SHEET_DEFAULTS = {
  actions: [],
  attributes: [],
  breakpoint: 'phone-to-tablet',
  displayAsMenu: DISPLAY_AS_MENU_OPTIONS[0],
  overlayOpacity: 0.7,
  onSelect: null,
  onCancel: null,
};

function ActionSheet(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, ACTION_SHEET_DEFAULTS);

  return this.init();
}

ActionSheet.prototype = {
  init() {
    this.render();
    this.handleEvents();
  },

  render() {
    // Render root elements, if needed
    const hasRoot = document.querySelector(`#${ROOT_ELEM_ID}`);
    if (!hasRoot) {
      this.renderRootElems();
    }

    // Render this action sheet
    if (!this.actionSheetElem) {
      let actionSheetHTML = '';
      let hasIcons = false;

      // Render all items
      this.settings.actions.forEach((action) => {
        let icon = '';
        if (action.icon) {
          hasIcons = true;
          icon = $.createIcon({ icon: action.icon });
        }
        const actionHTML = `<button class="btn-tertiary ids-action">
          ${icon}
          <span class="ids-action-text">${action.text}</span>
        </button>`;
        actionSheetHTML += actionHTML;
      });

      // Add a bottom separator and the cancel button
      actionSheetHTML += `<div class="separator"></div>
      <button class="btn-secondary btn-cancel ids-action">
        <span>Cancel</span>
      </button>`;

      // Create the action sheet wrapper
      this.actionSheetElem = document.createElement('div');
      const cl = this.actionSheetElem.classList;
      cl.add('ids-actionsheet');
      if (hasIcons) {
        cl.add('has-icons');
      }

      // Attach to the root elem
      this.actionSheetElem.insertAdjacentHTML('afterbegin', actionSheetHTML);
      this.rootElem.append(this.actionSheetElem);
    }
  },

  renderRootElems() {
    const fragment = document.createDocumentFragment();
    const rootElem = document.createElement('div');
    const overlay = document.createElement('div');

    rootElem.id = ROOT_ELEM_ID;
    rootElem.classList.add('ids-actionsheet-container');
    rootElem.setAttribute('aria-hidden', true);
    fragment.appendChild(rootElem);

    overlay.classList.add('overlay');
    overlay.setAttribute('aria-hidden', true);
    rootElem.appendChild(overlay);

    document.body.appendChild(rootElem);
    this.rootElem = rootElem;
    this.overlayElem = overlay;
  },

  handleEvents() {
    this.element.on('click.trigger', () => {
      if (!this.visible) {
        this.open();
      }
    });
  },

  get visible() {
    return this.rootElem.classList.contains('engaged');
  },

  /**
   * Opens the Action Sheet
   * @returns {void}
   */
  open() {
    this.rootElem.classList.add('engaged');
    this.overlayElem.removeAttribute('hidden');
    window.requestAnimationFrame(() => {
      this.setOverlayVisibility();
      this.addOpenEvents();
      this.element[0].removeAttribute('aria-hidden');
    });
  },

  /**
   * Closes the Action Sheet
   * @param {string} mode changes the way in which the Action Sheet closes.  Defaults to none.
   * @returns {void}
   */
  close(mode = '') {
    this.removeOpenEvents();
    this.element[0].setAttribute('aria-hidden', 'true');
    this.rootElem.classList.remove('engaged');
    this.setOverlayVisibility();
    utils.waitForTransitionEnd(this.overlayElem, 'opacity').then(() => {
      this.overlayElem.setAttribute('hidden', '');
      this.triggerCloseEvent(mode);
    });
  },

  /**
   * Closes the Action Sheet in "cancel" mode
   * @returns {void}
   */
  cancel() {
    this.close('cancel');
  },

  /**
   * Triggers an event announcing "close"
   * @param {string} mode changes the way in which the Action Sheet closes.  Defaults to none.
   * @returns {void}
   */
  triggerCloseEvent(mode = '') {
    let event;
    if (mode === 'cancel') {
      event = jQuery.Event('cancelled');
      event.actionSheetElem = this.actionSheetElem;
      event.api = this;
    } else {
      event = jQuery.Event('close');
      event.actionSheetElem = this.actionSheetElem;
      event.api = this;
    }
    this.element.trigger(event);
  },

  /**
   * @private
   * @returns {void}
   */
  addOpenEvents() {
    // If clicking on the document (outside the action sheet),
    // close the action sheet.
    $(document).on('click.disengage', (e) => {
      const actionSheet = e.target.closest('.ids-actionsheet');
      if (actionSheet) {
        return;
      }
      this.cancel();
    });

    // Clicking on each button may fire a callback.
    // Callbacks are bound to the action sheet context.
    $(this.actionSheetElem).on('click.action', 'button', (e) => {
      const cl = e.target.classList;
      if (cl.contains('btn-cancel') && typeof this.settings.onCancel === 'function') {
        this.settings.onCancel.apply(this, [e]);
        this.cancel();
        return;
      }
      if (typeof this.settings.onSelect === 'function') {
        this.settings.onSelect.apply(this, [e]);
      }
    });
  },

  /**
   * @private
   * @returns {void}
   */
  removeOpenEvents() {
    $(document).off('click.disengage');
  },

  /**
   * Adjusts the overlay's visiblity/opacity.  If no modals are present, the overlay "hides".
   * Otherwise, the overlay is adjusted to the currently active Modal's `opacity` setting.
   * @private
   * @returns {void}
   */
  setOverlayVisibility() {
    let opacity = 0;
    if (this.visible) {
      opacity = this.settings.overlayOpacity;
    }

    this.overlayElem.style.opacity = opacity ? `${opacity}` : '';
  },

  /**
   * @private
   * @returns {void}
   */
  teardown() {
    if (this.visible) {
      this.close();
    }
    this.element.off('click.trigger');
  },

  /**
  * Teardown and remove any added markup and events.
  * @returns {void}
  */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], 'actionsheet');
  },
};

export { ActionSheet, COMPONENT_NAME };
