import { utils } from '../../utils/utils';
import { breakpoints } from '../../utils/breakpoints';

// jQuery Components
import '../../utils/behaviors';
import '../button/button.jquery';
import '../icons/icons.jquery';
import '../popupmenu/popupmenu.jquery';

// Component Name
const COMPONENT_NAME = 'actionsheet';
const ROOT_ELEM_ID = 'ids-actionsheet-root';

const DISPLAY_AS_ACTION_SHEET_OPTIONS = [false, 'responsive', 'always'];
const TRAY_BACKGROUND_COLOR_OPTIONS = ['slate', 'ruby', 'amber', 'emerald', 'azure', 'turquoise', 'amethyst'];

const ACTION_SHEET_DEFAULTS = {
  actions: [],
  attributes: [],
  autoFocus: true,
  breakpoint: 'phone-to-tablet',
  displayAsActionSheet: DISPLAY_AS_ACTION_SHEET_OPTIONS[1],
  overlayOpacity: 0.7,
  onSelect: null,
  onCancel: null,
  tray: false,
  trayOpts: {
    text: null,
    icon: null,
    backgroundColor: TRAY_BACKGROUND_COLOR_OPTIONS[0]
  },
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

    if (hasRoot && this.rootElem === undefined) {
      const rootElem = document.getElementById('ids-actionsheet-root');

      // Eliminate duplication of actionsheet root
      rootElem.remove();

      // Re-initialize the root elements after removing it
      this.renderRootElems();
    }

    // Decorate trigger element
    const el = this.element[0];
    el.classList.add('ids-actionsheet-trigger');
    utils.addAttributes(this.element, this, this.settings.attributes, 'trigger');

    // Invoke an IDS Button component, if applicable
    if (el.tagName === 'BUTTON' || el.className.includes('btn')) {
      this.element.button();
    }

    // Render this action sheet
    if (!this.actionSheetElem) {
      let actionSheetHTML = '';
      let hasIcons = false;

      // Render all items
      this.settings.actions.forEach((action, i) => {
        let icon = '';
        const attrs = utils.stringAttributes(this, this.settings.attributes, `action-${i}`);

        if (action.icon) {
          hasIcons = true;
          icon = $.createIcon({ icon: action.icon });
        }
        const actionHTML = `<button class="btn-tertiary ids-action" data-index="${i}" ${attrs}>
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
      utils.addAttributes($(this.actionSheetElem), this, this.settings.attributes, 'sheet');
      const cl = this.actionSheetElem.classList;
      cl.add('ids-actionsheet');
      if (hasIcons) {
        cl.add('has-icons');
      }

      // Attach to the root elem
      this.actionSheetElem.insertAdjacentHTML('afterbegin', actionSheetHTML);
      this.rootElem.append(this.actionSheetElem);

      // Invoke an IDS Button component on each action, if applicable
      $(this.actionSheetElem).find('button').button();

      // Add tray element
      if (this.settings.tray) {
        this.renderTrayElement();
      }
    }
  },

  /**
   * The visibility of tray element.
   * @private
   * @returns {void}
   */
  trayBreakpoint() {
    this.trayContainer.style.visibility = breakpoints.isAbove('phone-to-tablet') ? 'hidden' : '';
  },

  /**
   * Calculates the position of tray whenever it opens
   * to match the animation with actionsheet action dialog
   * @private
   * @returns {void}
   */
  trayTransform() {
    this.trayContainer.style.transform = `translate(0, -${this.actionSheetElem.offsetHeight - 40}px)`;
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
   * Creates tray element and insert on top of the actionsheet.
   * @private
   * @returns {void}
   */
  renderTrayElement() {
    const trayContainer = document.createElement('div');
    const trayBtn = document.createElement('button');
    const trayTextElem = document.createElement('span');

    if (this.settings.trayOpts.icon) {
      trayBtn.innerHTML = $.createIcon({ icon: this.settings.trayOpts.icon });
    }

    const trayIconElem = trayBtn.firstChild;

    trayTextElem.innerHTML = this.settings.trayOpts.text;

    trayContainer.classList.add('ids-actionsheet-tray-container', this.settings.trayOpts.backgroundColor);
    trayBtn.classList.add('ids-actionsheet-tray-btn');
    trayTextElem.classList.add('ids-actionsheet-tray-btn-text');

    trayContainer.appendChild(trayBtn);
    trayBtn.appendChild(trayTextElem);

    this.rootElem.insertBefore(trayContainer, this.rootElem.childNodes[1]);

    this.trayContainer = trayContainer;
    this.trayBtn = trayBtn;
    this.trayIconElem = trayIconElem;
    this.trayTextElem = trayTextElem;

    // Triggering the visibility of tray element
    this.trayBreakpoint();
  },

  /**
   * Sets up component event listeners
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.element.add($(this.trayBtn)).on('click.trigger', () => {
      if (!this.visible) {
        this.open();
        if (this.trayContainer) {
          // Fix the animation when opening and closing
          this.trayTransform();
        }
      }
    });

    $('body').on('resize', () => {
      if (this.settings.tray) {
        this.trayBreakpoint();

        if (this.visible) {
          this.trayTransform();
        } else {
          this.trayContainer.style.removeProperty('transform');
        }
      }
    });
  },

  /**
   * @returns {boolean} true if the Action Sheet is currently visible
   */
  get visible() {
    if (this.popupmenuAPI) {
      return this.hasOpenPopupMenu;
    }
    return this.rootElem.classList.contains('engaged');
  },

  /**
   * @returns {array<HTMLElement>} available buttons representing actions
   */
  get actionElems() {
    return [...this.actionSheetElem.querySelectorAll('button')].filter(x => !x.classList.contains('btn-cancel'));
  },

  /**
   * Opens the Action Sheet
   * @returns {void}
   */
  open() {
    // Don't try to open if the Action Sheet is currently open
    if (this.visible) {
      return;
    }

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
      this.focus();
    });
  },

  /**
   * Opens a simple Popupmenu containing the same actions as the sheet.
   * This occurs in responsive breakpoints above the one defined by settings.
   * @returns {void}
   */
  openPopupMenu() {
    // Generate/Insert Popupmenu HTML.
    const menuAttrs = utils.stringAttributes(this, this.settings.attributes, 'menu');
    let menuHTML = `<ul ${menuAttrs}>`;
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
    const $menuEl = $(menuHTML).insertAfter(this.element);

    // Invoke Popupmenu.
    // NOTE: The setting of popupmenu attributes is delegated to the Popupmenu component
    this.element.popupmenu({
      autoFocus: this.settings.autoFocus,
      attributes: this.settings.attributes,
      menu: $menuEl,
      offset: { y: 10 },
      trigger: 'immediate',
      removeOnDestroy: true
    });

    // Listen for Popupmenu Events.
    // On Popupmenu's `selected` event, fire the selected callback against the correct element.
    this.hasPopupmenuEvents = true;
    $(this.element)
      .on('selected.popupmenu', (e, a) => {
        const actionIndex = parseInt($(a.parent()).attr('data-index'), 10);
        if (isNaN(actionIndex)) {
          return;
        }
        const targetActionElem = this.actionSheetElem.children[actionIndex];
        if (targetActionElem) {
          this.doSelect(targetActionElem, null, true);
        }
      })
      .on('afteropen.popupmenu', () => {
        this.focus();
      })
      .on('close.popupmenu', (e, isCancelled) => {
        if (isCancelled) {
          this.doCancel(null, false, isCancelled);
        } else {
          this.close();
        }
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
   * @param {boolean} doFocus if true, causes an element related to the Action Sheet to be focused.
   * @returns {void}
   */
  close(mode = '', doFocus = false) {
    // Check for an open popupmenu
    if (this.hasPopupmenuEvents) {
      this.closePopupMenu(mode);
      if (doFocus) {
        this.focus();
      }
      return;
    }

    // Check to see if it's currently-possible to close an Action Sheet
    if (!this.visible) {
      return;
    }

    this.removeActionSheetOpenEvents();
    this.element[0].setAttribute('aria-hidden', 'true');
    this.rootElem.classList.remove('engaged');

    if (this.trayContainer) {
      this.trayContainer.style.removeProperty('transform');
    }

    this.setOverlayVisibility();
    utils.waitForTransitionEnd(this.overlayElem, 'opacity').then(() => {
      this.overlayElem.setAttribute('hidden', '');
      this.triggerCloseEvent(mode);

      if (doFocus) {
        this.focus();
      }
    });
  },

  /**
   * Closes a simple Popupmenu previously-opened in place of the Action Sheet.
   * @param {string} mode changes the way in which the Popupmenu closes.  Defaults to none.
   * @returns {void}
   */
  closePopupMenu(mode) {
    // Remove Popupmenu Events
    this.removePopupmenuEvents();
    this.triggerCloseEvent(mode);
  },

  /**
   * Removes Popupmenu Events
   * @private
   * @returns {void}
   */
  removePopupmenuEvents() {
    if (this.hasPopupmenuEvents) {
      $(this.element).off('selected.popupmenu close.popupmenu afteropen.popupmenu');
      delete this.hasPopupmenuEvents;
    }
  },

  /**
   * Closes the Action Sheet in "cancel" mode
   * @param {boolean} doFocus true if focus should occur after closing.
   * @returns {void}
   */
  cancel(doFocus = false) {
    this.close('cancel', doFocus);
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
    } else {
      event = jQuery.Event('close');
    }
    this.element.trigger(event, [$(this.actionSheetElem)]);
  },

  /**
   * Sets focus on the correct element within the action sheet
   * @returns {void}
   */
  focus() {
    if (!this.settings.autoFocus) {
      return;
    }

    // Popupmenu (highlight first item)
    if (this.hasOpenPopupMenu) {
      const a = this.popupmenuAPI.menu[0].querySelector('a');
      if (a) {
        a.focus();
        this.popupmenuAPI.highlight($(a));
      }
      return;
    }

    // If the action sheet is engaged, focus the first available button element inside
    if (this.visible) {
      const targetAction = this.actionSheetElem.querySelector('button');
      if (targetAction) {
        targetAction.focus();
        this.resetFocusState(targetAction);
      }
      return;
    }

    // If no action sheet is engaged, focus the trigger element.
    this.element[0].focus();
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

      this.doCancel(null, false, false);
    });

    // Clicking on each button may fire a callback.
    // Callbacks are bound to the action sheet context.
    $(this.actionSheetElem)
      .on('click.action', 'button', (e) => {
        const target = e.currentTarget;
        const cl = target.classList;

        if (cl.contains('btn-cancel')) {
          this.doCancel(target, false, true);
        } else {
          this.doSelect(target, true);
        }
        this.focus();
      })
      .on('keyup.action', (e) => {
        // Capture keyup events from within the Action Sheet
        if (e.target.closest('.ids-actionsheet')) {
          const key = e.key;
          switch (key) {
            case 'Escape':
              this.doCancel(null, false, false);
              break;
            default:
              break;
          }
        }
      })
      .on('focusin.action', 'button', (e) => {
        this.resetFocusState(e.target.closest('.ids-action'));
      })
      .on('focusout.action', 'button', (e) => {
        this.resetFocusState(e.target.closest('.ids-action'));
      });
  },

  /**
   * Runs the settings-driven select callback
   * @param {HTMLElement} targetActionElem represents the Action that was selected.
   * @param {boolean} doFireEvent true if selection should fire an event.
   * @param {boolean} doFocus true if focus should occur after closing.
   */
  doSelect(targetActionElem, doFireEvent, doFocus = false) {
    const $targetActionElem = $(targetActionElem);
    if (typeof this.settings.onSelect === 'function') {
      this.settings.onSelect($targetActionElem);
    }

    this.close(null, doFocus);

    // Fires a 'selected' event the way a Popupmenu would when it's items are selected.
    if (doFireEvent) {
      $(this.element).trigger('selected', [$targetActionElem, null, true]);
    }
  },

  /**
   * @param {HTMLElement} targetActionElem represents UI that caused the cancel.
   * @param {boolean} doFireEvent true if cancelling should fire an event.
   * @param {boolean} doFocus true if focus should occur after closing.
   */
  doCancel(targetActionElem, doFireEvent, doFocus) {
    const $targetActionElem = $(targetActionElem);
    if (typeof this.settings.onCancel === 'function') {
      this.settings.onCancel($targetActionElem);
    }

    this.cancel(doFocus);

    if (doFireEvent) {
      $(this.element).trigger('cancelled', [$targetActionElem]);
    }
  },

  /**
   * Hides the focus state on a button in the Action Sheet
   * @param {HTMLElement} targetActionElem represents UI that caused the cancel.
   */
  resetFocusState(targetActionElem) {
    const $targetActionElem = $(targetActionElem);
    if (!$targetActionElem.data('hide-focus')) {
      $targetActionElem.hideFocus();
    }
    $targetActionElem.addClass('hide-focus');
  },

  /**
   * @private
   * @returns {void}
   */
  removeActionSheetOpenEvents() {
    $(document).off('click.disengage');
    $(this.actionSheetElem).off('click.action keyup.action');
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
   * Triggers a UI Resync.
   * @param {object} [settings] incoming settings
   * @returns {void}
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
    this.teardown();
    this.init();
  },

  /**
   * @private
   * @returns {void}
   */
  teardown() {
    if (this.visible) {
      this.close();
    }
    this.element.add($(this.trayBtn)).off('click.trigger');

    // Remove the Action Sheet Element
    if (this.actionSheetElem && $(this.actionSheetElem).find('button').destroy) {
      $(this.actionSheetElem).find('button').destroy();
      this.actionSheetElem.remove();
    }

    // Undecorate
    this.element[0].classList.remove('ids-actionsheet-trigger');
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
