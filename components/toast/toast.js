import * as debug from '../utils/debug';
import { utils, math } from '../utils/utils';
import { renderLoop, RenderLoopItem } from '../utils/renderloop';
import { Locale } from '../locale/locale';

// Component Name
const COMPONENT_NAME = 'toast';

// Default Component Settings
const TOAST_DEFAULTS = {
  title: '(Title)',
  message: '(Content)',
  position: 'top right',
  audibleOnly: false,
  progressBar: true,
  timeout: 6000
};

/**
 * Toast Component.  This component produces small, temporary messages in
 *  one of the application's corners.
 * @constructor
 * @param {HTMLElement} element the target location for the Toast message
 * @param {object} [settings] incoming settings
 * @param {string} [settings.title = '(Title)'] Text that is displayed in the Toast's title.
 * @param {string} [settings.message = '(Content)' ] Text/HTML that's displayed in the Toast's body.
 * @param {string} [settings.position = 'top right'] text that propagates into CSS classes that position the Toast in specific places
 * Can be top left, bottom left, bottom rightx
 * @param {boolean} [settings.audibleOnly = false] if true, causes the toast to be invisble on the screen, but still read out lout by screen readers.
 * @param {boolean} [settings.progressBar = true] causes the toast to have a visible progress bar that will be completely
 * disappeared when the toast should be removed.
 * @param {number} [settings.timeout = 6000] the amount of time the toast should be present on-screen.
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
    const settings = self.settings;
    const maxHideTime = parseFloat(math.convertDelayToFPS(settings.timeout));
    let isPausePlay = false;
    let percentage = 100;
    let container = $('#toast-container');
    const toast = $(`
      <div class="toast">
        <span class="toast-title">${settings.title}</span>
        <span class="toast-message">${settings.message}</span>
      </div>`);
    const closeBtn = $(`
      <button type="button" class="btn-icon btn-close" title="${Locale.translate('Close')}" aria-hidden="true">
        ${$.createIcon('close')}
        <span class="audible">${Locale.translate('Close')}</span>
      </button>
    `);
    const progress = $('<div class="toast-progress"></div>');

    if (!container.length) {
      container = $('<div id="toast-container" class="toast-container" aria-relevant="additions" aria-live="polite"></div>').appendTo('body');
    }

    container.removeClass('toast-top-left toast-top-right toast-bottom-right toast-bottom-left')
      .addClass(`toast-${settings.position.replace(' ', '-')}`);

    settings.timeout = settings.audibleOnly ? 100 : settings.timeout;

    if (settings.progressBar) {
      toast.append(progress);
    }

    // Build the RenderLoop integration
    const timer = new RenderLoopItem({
      duration: math.convertDelayToFPS(settings.timeout),
      timeoutCallback() {
        self.remove(toast);
      },
      updateCallback(data) {
        percentage = ((data.duration - data.elapsedTime) / maxHideTime) * 100;

        if (Locale.isRTL()) {
          percentage = 100 - percentage;
        }

        if (settings.progressBar) {
          progress[0].style.width = `${percentage}%`;
        }
      }
    });
    renderLoop.register(timer);

    container.append(toast);
    toast.addClass((settings.audibleOnly ? 'audible' : 'effect-scale'));
    toast.append(closeBtn);

    $(document).on('keydown keyup', (e) => {
      e = e || window.event;
      if (e.ctrlKey && e.altKey && e.keyCode === 80) { // [Control + Alt + P] - Pause/Play toggle
        isPausePlay = e.type === 'keydown';
        timer[isPausePlay ? 'pause' : 'resume']();
      }
    });

    toast.on('mousedown.toast touchstart.toast mouseup.toast touchend.toast', (e) => {
      isPausePlay = !!/mousedown|touchstart/i.test(e.type);
      timer[isPausePlay ? 'pause' : 'resume']();
    });

    closeBtn.on('click', () => {
      timer.destroy();
      self.remove(toast);
    });
  },

  /**
   * Remove the Message and Animate
   * @private
   * @param {jQuery[]|HTMLElement} toast the toast message to be removed
   * @returns {void}
   */
  remove(toast) {
    if (this.settings.audibleOnly) {
      toast.remove();
      return;
    }

    toast.addClass('effect-scale-hide');

    const closeTimer = new RenderLoopItem({
      duration: 20,
      updateCallback() {}, // TODO: make this work without an empty function
      timeoutCallback() {
        toast.remove();
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
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
    this.show();
  },

  /**
   * Teardown
   * @returns {void}
   */
  destroy() {
    $('#toast-container').remove();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Toast, COMPONENT_NAME };
