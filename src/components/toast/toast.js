import * as debug from '../../utils/debug';
import { utils, math } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';
import { renderLoop, RenderLoopItem } from '../../utils/renderloop';
import { Environment as env } from '../../utils/environment';
import { Locale } from '../../../src/components/locale/locale';

// Component Name
const COMPONENT_NAME = 'toast';

// Default Component Settings
const TOAST_DEFAULTS = {
  title: '(Title)',
  message: '(Content)',
  position: 'top right',
  audibleOnly: false,
  progressBar: true,
  timeout: 6000,
  allowLink: false,
  draggable: false,
  savePosition: false,
  uniqueId: null
};

/**
 * Toast Component.  This component produces small, temporary messages in
 *  one of the application's corners.
 * @constructor
 * @param {HTMLElement} element the target location for the Toast message
 * @param {object} [settings] incoming settings
 * @param {string} [settings.title = '(Title)'] Text that is displayed in the Toast's title.
 * @param {string} [settings.message = '(Content)' ] Text that's displayed in the Toast's body.
 * @param {string} [settings.position = 'top right'] Text that propagates into CSS classes that position the Toast in specific places
 * Can be top left, bottom left, bottom rightx
 * @param {boolean} [settings.audibleOnly = false] if true, causes the toast to be invisble on the screen, but still read out lout by screen readers.
 * @param {boolean} [settings.progressBar = true] causes the toast to have a visible progress bar that will be completely
 * disappeared when the toast should be removed.
 * @param {number} [settings.timeout = 6000] the amount of time the toast should be present on-screen.
 * @param {boolean} [settings.allowLink = false] if true, allows user to put links in the toast message.
 * @param {boolean} [settings.draggable = false] if true, allows user to drag/drop the toast container.
 * @param {boolean} [settings.savePosition] Save positon to local storage.
 * @param {string} [settings.uniqueId] A uniqueId to save positon to local storage, so same saved positon can be use for whole app.
 */
function Toast(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(element, settings, TOAST_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Toast Methods
Toast.prototype = {

  /**
   * @private
   * @returns {void}
   */
  init() {
    this.show();
  },

  /**
   * Show a Single Toast Message
   * @private
   * @returns {void}
   */
  show() {
    const self = this;
    const s = this.settings;
    const maxHideTime = parseFloat(math.convertDelayToFPS(s.timeout));
    const message = s.allowLink ? xssUtils.stripTags(s.message, '<a><br><p>') : xssUtils.stripHTML(s.message);
    let isPausePlay = false;
    let percentage = 100;

    this.uniqueId = s.uniqueid ? this.generateUniqueId('usersettings-position') : '';

    let container = $(`#toast-container${this.uniqueId}`);
    const toast = $(`
      <div class="toast">
        <span class="toast-title">${xssUtils.stripHTML(s.title)}</span>
        <span class="toast-message">${message}</span>
      </div>`);
    const closeBtn = $(`
      <button type="button" class="btn-icon btn-close" title="${Locale.translate('Close')}" aria-hidden="true">
        ${$.createIcon('close')}
        <span class="audible">${Locale.translate('Close')}</span>
      </button>
    `);
    const progress = $('<div class="toast-progress"></div>');

    if (!container.length) {
      container = $(`<div id="toast-container${this.uniqueId}" class="toast-container" aria-relevant="additions" aria-live="polite"></div>`).appendTo('body');
    }

    container
      .removeClass('toast-top-left toast-top-right toast-bottom-right toast-bottom-left')
      .addClass(`toast-${s.position.replace(' ', '-')}`);

    s.timeout = s.audibleOnly ? 100 : s.timeout;

    if (s.progressBar) {
      toast.append(progress);
    }

    container.append(toast);
    toast.addClass((s.audibleOnly ? 'audible' : 'effect-scale'));
    toast.append(closeBtn);

    // Add draggable
    self.createDraggable(toast, container);

    // Get the number of toasts
    const toastsIndex = container.children().length;
    this.toastsIndex = toastsIndex;

    // Build the RenderLoop integration
    const timer = new RenderLoopItem({
      duration: math.convertDelayToFPS(s.timeout),
      timeoutCallback() {
        self.remove(toast, toastsIndex);
      },
      updateCallback(data) {
        percentage = ((data.duration - data.elapsedTime) / maxHideTime) * 100;

        if (Locale.isRTL()) {
          percentage = 100 - percentage;
        }

        if (s.progressBar) {
          progress[0].style.width = `${percentage}%`;
        }
      }
    });
    renderLoop.register(timer);

    // Clears the toast from the container, removing it from renderLoop and tearing down events
    function clearToast(targetToast) {
      timer.destroy(true);
      self.remove(targetToast, toastsIndex);
    }

    $(document).on(`keydown.toast-${toastsIndex} keyup.toast-${toastsIndex}`, (e) => {
      e = e || window.event;
      const key = e.which || e.keyCode;

      if (e.ctrlKey && key === 80) { // [Control + Alt + P] - Pause/Play toggle
        isPausePlay = e.type === 'keydown';
        timer[isPausePlay ? 'pause' : 'resume']();
      }
      if (e.type === 'keydown' && key === 27) { // Escape
        e.stopImmediatePropagation();
        e.preventDefault();
        clearToast(toast);
      }
    });

    toast.on('mousedown.toast touchstart.toast mouseup.toast touchend.toast', (e) => {
      isPausePlay = !!/mousedown|touchstart/i.test(e.type);
      timer[isPausePlay ? 'pause' : 'resume']();
    });

    closeBtn.on('click.toast', () => {
      clearToast(toast);
    });
  },

  /**
  * Create draggable
  * @private
  * @param {object} toast the toast element
  * @param {object} container the toast container element
  * @returns {void}
  */
  createDraggable(toast, container) {
    if (!this.settings.draggable || !toast[0] || !container[0]) {
      return;
    }

    const isTouch = env.features.touch;

    // Drop container
    const dropContainer = container.parent();

    // Clear inline style
    container.css({ top: '', left: '', right: '' });

    // Create css rules, position from local storage
    const rect = container[0].getBoundingClientRect();
    const lsPosition = this.restorePosition();
    let posEl = rect;

    // Check for stored postion is in viewport
    if (lsPosition) {
      posEl = {
        top: lsPosition.top,
        left: lsPosition.left,
        width: toast.outerWidth(),
        height: toast.outerHeight(),
      };
      posEl.right = posEl.left + posEl.width;
      posEl.bottom = posEl.top + posEl.height;

      // Set to default, if stored postion not in viewport
      if (!this.isPosInViewport(posEl)) {
        posEl = rect;
      }
    }

    // Compile css rules
    const rules = { top: `${posEl.top}px`, left: `${posEl.left}px` };

    // Reset position right rule, if was set in css file
    if (container.is('.toast-bottom-right, .toast-top-right')) {
      rules.right = 'auto';
    }

    // Apply compiled css rules
    container.css(rules);
    container.addClass('is-draggable');

    // Selector for elements need to be exclude
    const excludeEl = 'a, .btn-close';

    // Initialize Drag api
    toast
      .off('mousedown.toast touchstart.toast')
      .on('mousedown.toast touchstart.toast', (e) => {
        if (!isTouch) {
          e.preventDefault();
        }

        // No need to drag
        if ($(e.target).is(excludeEl)) {
          return;
        }

        // Initialize drag
        container
          .drag({ containment: 'document' })

          // Start drag
          .off('dragstart.toast')
          .on('dragstart.toast', () => {
            e.stopImmediatePropagation();
            container.attr('aria-grabbed', 'true');
            dropContainer.attr('aria-dropeffect', 'move');
          })

          // End drag
          .off('dragend.toast')
          .on('dragend.toast', () => {
            container.removeAttr('aria-grabbed');
            dropContainer.removeAttr('aria-dropeffect');
            this.savePosition({
              left: parseFloat(container.css('left')),
              top: parseFloat(container.css('top'))
            });
            // Unbind drag from header
            const dragApi = container.data('drag');
            if (dragApi && typeof dragApi.destroy === 'function') {
              dragApi.destroy();
            }
          });
      });

    // Check if cursor over the toast
    const isToastEl = ({ dragApi, x, y }) => {
      const underEl = dragApi.getElementsFromPoint(x, y)[0];
      return !($(underEl).closest('.toast').length);
    };

    // Resume the toast timer
    const triggerRsume = (elem) => {
      // [Control + Alt + P] - Pause/Play toggle
      const keyupSetting = { ctrlKey: true, altKey: true, keyCode: 80 };
      const keyup = $.Event('keyup');
      $.extend(keyup, keyupSetting);
      elem.trigger(keyup);
    };

    const doc = $(document);
    doc
      .off('mouseup.toast').on('mouseup.toast', (e) => {
        if ($(`#toast-container${this.uniqueId} .toast`).length === 1) {
          const dragApi = container.data('drag');
          if (dragApi && typeof dragApi.getElementsFromPoint === 'function') {
            const args = { dragApi, x: e.pageX, y: e.pageY };
            if (isToastEl(args)) {
              triggerRsume(doc);
            }
          }
        }
      })
      .off('touchend.toast').on('touchend.toast', (e) => {
        if ($(`#toast-container${this.uniqueId} .toast`).length === 1) {
          const dragApi = container.data('drag');
          if (dragApi && typeof dragApi.getElementsFromPoint === 'function') {
            const orig = e.originalEvent;
            // do now allow two touch points to drag the same element
            if (orig.targetTouches.length > 1) {
              return;
            }
            const t = orig.changedTouches[0];
            const args = { dragApi, x: t.pageX, y: t.pageY };
            if (isToastEl(args)) {
              triggerRsume(doc);
            }
          }
        }
      });
  },

  /**
   * Save toast container position.
   * @private
   * @param {object} pos the new position to save
   * @returns {void}
   */
  savePosition(pos = {}) {
    if (!this.settings.savePosition || !this.canUseLocalStorage() || $.isEmptyObject(pos)) {
      return;
    }

    // Save position to local storage
    localStorage[this.uniqueId] = JSON.stringify(pos);

    /**
    * Fires after settings are changed in some way
    * @event settingschanged
    * @memberof Toast
    * @property {object} event The jquery event object
    * @property {object} args Additional arguments
    * @property {string} args.left The current left positon
    * @property {string} args.top The current top positon
    */
    this.element.triggerHandler('settingschanged', [pos]);
  },

  /**
   * Restore the position from local storage
   * @private
   * @returns {object} The left and top position
   */
  restorePosition() {
    if (!this.settings.savePosition || !this.canUseLocalStorage()) {
      return null;
    }

    const lsPosition = localStorage[this.uniqueId];
    return lsPosition ? JSON.parse(lsPosition) : null;
  },

  /**
   * Returns true if local storage may be used / is available
   * @private
   * @returns {boolean} If it can be used.
   */
  canUseLocalStorage() {
    try {
      if (localStorage.getItem) {
        return true;
      }
    } catch (exception) {
      return false;
    }

    return false;
  },

  /**
  * Generate a unique id based on the page and add a suffix.
  * @private
  * @param {object} suffix Add this string to make the id more unique
  * @returns {string} The unique id.
  */
  generateUniqueId(suffix) {
    suffix = (suffix === undefined || suffix === null) ? '' : suffix;
    const uniqueid = `toast-${this.settings.uniqueid || ''}-${suffix}`;
    return uniqueid.replace(/--/g, '-').replace(/-$/g, '');
  },

  /**
   * Check if given postion in the viewport
   * @private
   * @param {object} pos The postion to check
   * @param {object} elem The element to check
   * @returns {boolean} true if is in the viewport
   */
  isPosInViewport(pos) {
    return (
      pos.top >= 0 && pos.left >= 0 &&
      pos.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      pos.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @param {jQuery[]|HTMLElement} toast the toast message to be removed bindings
   * @param {number} [id=undefined] a unique number associated with the toast being removed
   * @returns {this} component instance
   */
  unbind(toast, id) {
    const container = toast.closest('.toast-container');
    container.off('dragstart.toast dragend.toast');
    toast.off('mousedown.toast mouseup.toast touchstart.toast touchend.toast');
    toast.find('.btn-close').off('click.toast');

    if (id !== undefined) {
      $(document).off([
        `keydown.toast-${id}`,
        `keyup.toast-${id}`
      ].join(' '));
    }

    return this;
  },

  /**
   * Remove the Message and Animate
   * @private
   * @param {jQuery[]|HTMLElement} toast the toast message to be removed
   * @param {number} [id=undefined] a unique number associated with the toast being removed
   * @returns {void}
   */
  remove(toast, id) {
    const removeCallback = () => {
      toast.remove();
      const canDestroy = !$(`#toast-container${this.uniqueId} .toast`).length;
      if (canDestroy) {
        this.destroy();
      }
    };

    this.unbind(toast, id);

    if (this.settings.audibleOnly) {
      removeCallback();
      return;
    }

    toast.addClass('effect-scale-hide');

    const closeTimer = new RenderLoopItem({
      duration: 20,
      updateCallback() {}, // TODO: make this work without an empty function
      timeoutCallback() {
        removeCallback();
      }
    });
    renderLoop.register(closeTimer);
  },

  /**
   * @param {object} [settings] incoming settings
   * @returns {void}
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, TOAST_DEFAULTS);
    }
    this.show();
  },

  /**
   * Teardown
   * @returns {void}
   */
  destroy() {
    const container = $(`#toast-container${this.uniqueId}`);
    if (container[0]) {
      const toasts = [].slice.call(container[0].querySelectorAll('.toast'));
      toasts.forEach((toast) => {
        this.settings.audibleOnly = true; // Remove without delay
        this.remove($(toast));
      });
    }
    $(document).off([
      'mouseup.toast',
      'touchend.toast'
    ].join(' '));
    container.remove();
    delete this.toastsIndex;
    delete this.uniqueId;
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Toast, COMPONENT_NAME };
