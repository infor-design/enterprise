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

const DISPLAY_AS_ACTION_SHEET_OPTIONS = [false, 'responsive', 'always'];

const ACTION_SHEET_DEFAULTS = {
  actions: [],
  attributes: [],
  breakpoint: 'phone-to-tablet',
  displayAsActionSheet: DISPLAY_AS_ACTION_SHEET_OPTIONS[1],
  overlayOpacity: 0.7,
  onSelect: null,
  onCancel: null,
  showCancelButton: true
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

  /**
   * Renders the component
   * @private
   * @returns {void}
   */
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
      if (this.settings.showCancelButton) {
        actionSheetHTML += `<div class="separator"></div>
        <button class="btn-secondary btn-cancel ids-action">
          <span>Cancel</span>
        </button>`;
      }

      // Create the action sheet wrapper
      this.actionSheetElem = document.createElement('div');
      this.actionSheetElem.setAttribute('role', 'dialog');
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

  /**
   * Draws a container and overlay element into the page body.
   * Other action sheet instances may also use these elements.
   * @private
   * @returns {void}
   */
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

  /**
   * Sets up component event listeners
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.element.on('click.trigger', () => {
      if (!this.visible) {
        this.open();
      }
    });
  },

  /**
   * @returns {boolean} true if the Action Sheet is currently visible
   */
  get visible() {
    return this.rootElem.classList.contains('engaged');
  },

  /**
   * Opens the Action Sheet
   * @returns {void}
   */
  open() {
    if (!this.currentlyNeedsActionSheet) {
      this.openPopupMenu();
      return;
    }

    this.rootElem.classList.add('engaged');
    this.overlayElem.removeAttribute('hidden');
    window.requestAnimationFrame(() => {
      this.setOverlayVisibility();
      this.addActionSheetOpenEvents();
      this.element[0].removeAttribute('aria-hidden');
    });
  },

  /**
   * Opens a simple Popupmenu containing the same actions as the sheet.
   * This occurs in responsive breakpoints above the one defined by settings.
   * @returns {void}
   */
  openPopupMenu() {
    // Generate menu HTML
    let menuHTML = '<ul id="ids-actionsheet-popupmenu">';
    this.settings.actions.forEach((action, i) => {
      let icon = '';
      if (action.icon) {
        icon = $.createIcon({ icon: action.icon });
      }
      const actionHTML = `<li class="ids-action-menu-item" data-index="${i}">
        <a>
          ${icon}
          <span class="ids-action-text">${action.text}</span>
        </a>
      </li>`;
      menuHTML += actionHTML;
    });
    menuHTML += '</ul>';
    this.element[0].insertAdjacentHTML('afterend', menuHTML);

    // Invoke Popupmenu
    this.element.popupmenu({
      menuId: 'ids-actionsheet-popupmenu',
      beforeOpen: (response) => {
        response(menuHTML);
      },
      trigger: 'immediate',
      removeOnDestroy: true
    });

    // Listen for Popupmenu Events.
    // On Popupmenu's `selected` event, fire the selected callback against the correct element.
    $(this.element)
      .on('selected.popupmenu', (e, a) => {
        const actionIndex = parseInt($(a.parent()).attr('data-index'), 10);
        if (isNaN(actionIndex)) {
          return;
        }
        const targetActionElem = this.actionSheetElem.children[actionIndex];
        if (targetActionElem) {
          this.doSelect(targetActionElem);
        }
        this.closePopupMenu();
      })
      .on('close.popupmenu', (e, isCancelled) => {
        const mode = isCancelled ? 'cancel' : '';
        this.closePopupMenu(mode);
      });
  },

  /**
   * @returns {Popupmenu} attached Popupmenu API, if available
   */
  get popupmenuAPI() {
    return $(this.element).data('popupmenu');
  },

  /**
   * @returns {boolean} true if there is a currently-open Popupmenu attached to the trigger button
   */
  get hasOpenPopupMenu() {
    return this.popupmenuAPI?.isOpen;
  },

  /**
   * Closes the Action Sheet
   * @param {string} mode changes the way in which the Action Sheet closes.  Defaults to none.
   * @returns {void}
   */
  close(mode = '') {
    // @TODO check for an open popupmenu before this
    if (this.hasOpenPopupMenu) {
      this.closePopupMenu(mode);
      return;
    }

    this.removeActionSheetOpenEvents();
    this.element[0].setAttribute('aria-hidden', 'true');
    this.rootElem.classList.remove('engaged');
    this.setOverlayVisibility();
    utils.waitForTransitionEnd(this.overlayElem, 'opacity').then(() => {
      this.overlayElem.setAttribute('hidden', '');
      this.triggerCloseEvent(mode);
    });
  },

  /**
   * Closes a simple Popupnenu previously-opened in place of the Action Sheet.
   * @returns {void}
   */
  closePopupMenu(mode) {
    // Remove Popupmenu Events
    $(this.element).off('selected.popupmenu close.popupmenu');
    this.triggerCloseEvent(mode);
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
    this.element.trigger(event, []);
  },

  /**
   * @returns {boolean} whether or not this Action Sheet instance should currently display in
   * full size mode (uses the settings, but determined at runtime)
   */
  get currentlyNeedsActionSheet() {
    const breakpoint = this.settings.breakpoint;
    const mode = this.settings.displayAsActionSheet;
    return (mode === 'always' || (mode === 'responsive' && breakpoints.isBelow(breakpoint)));
  },

  /**
   * @private
   * @returns {void}
   */
  addActionSheetOpenEvents() {
    // If clicking on the document (outside the action sheet),
    // close the action sheet.
    $(document).on('click.disengage', (e) => {
      const actionSheet = e.target.closest('.ids-actionsheet');
      if (actionSheet) {
        return;
      }
      // Purposefully doesn't run the event and just closes the popup/sheet
      this.cancel();
    });

    // Clicking on each button may fire a callback.
    // Callbacks are bound to the action sheet context.
    $(this.actionSheetElem).on('click.action', 'button', (e) => {
      const target = e.currentTarget;
      const cl = target.classList;

      if (cl.contains('btn-cancel')) {
        this.doCancel(target);
        return;
      }
      this.doSelect(target, true);
    });
  },

  /**
   * Runs the settings-driven select callback
   * @param {HTMLElement} targetActionElem represents the Action that was selected.
   * @param {boolean} doFireEvent true if selection should fire an event.
   */
  doSelect(targetActionElem, doFireEvent) {
    if (typeof this.settings.onSelect === 'function') {
      this.settings.onSelect(targetActionElem);
    }

    this.close();

    // Fires a 'selected' event the way a Popupmenu would when it's items are selected.
    if (doFireEvent) {
      $(this.element).trigger('selected', [$(targetActionElem), null, true]);
    }
  },

  /**
   * @param {HTMLElement} targetActionElem represents UI that caused the cancel.
   * @param {boolean} doFireEvent true if cancelling should fire an event.
   */
  doCancel(targetActionElem, doFireEvent) {
    if (typeof this.settings.onCancel === 'function') {
      this.settings.onCancel(targetActionElem);
    }

    this.cancel();
    if (doFireEvent) {
      $(this.element).trigger('cancelled', [$(targetActionElem)]);
    }
  },

  /**
   * @private
   * @returns {void}
   */
  removeActionSheetOpenEvents() {
    $(document).off('click.disengage');
    $(this.actionSheetElem).off('click.action');
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
  * Tears down and removes any added markup and events.
  * @returns {void}
  */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], 'actionsheet');
  },
};

export { ActionSheet, COMPONENT_NAME };
