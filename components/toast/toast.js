import * as debug from '../utils/debug';
import { utils, math } from '../utils/utils';
import { renderLoop, RenderLoopItem } from '../utils/renderloop';


/**
 * Component Name
 */
let COMPONENT_NAME = 'toast';


/**
 * Default Settings for Toast
 */
let TOAST_DEFAULTS = {
  title: '(Title)',
  message: '(Content)',
  position: 'top right',  //top left, bottom left, bottom right (center??)
  audibleOnly: false,
  progressBar: true,
  timeout: 6000
};


/**
 * Toast Component.  This component produces small, temporary messages in one of the application's corners.
 * @constructor
 * @param {HTMLElement} element
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

  init: function() {
    this.show();
  },

  // Show a Single Toast Message
  show: function() {
    var self = this,
      settings = self.settings,
      maxHideTime = parseFloat(math.convertDelayToFPS(settings.timeout)),
      isPausePlay = false,
      percentage = 100,
      timer,
      container = $('#toast-container'),
      toast = $('<div class="toast"><span class="toast-title">'+ settings.title+
        '</span><span class="toast-message">'+ settings.message + '</span></div>'),
      closeBtn = $('<button type="button" class="btn-icon btn-close" title="'+ Locale.translate('Close')+
        '" aria-hidden="true">' + $.createIcon('close') + '<span class="audible"> '+ Locale.translate('Close')+'</span></button>'),
      progress = $('<div class="toast-progress"></div>');

    if (!container.length) {
      container = $('<div id="toast-container" class="toast-container" aria-relevant="additions" aria-live="polite"></div>').appendTo('body');
    }

    container.removeClass('toast-top-left toast-top-right toast-bottom-right toast-bottom-left')
      .addClass('toast-' + settings.position.replace(' ', '-'));

    settings.timeout = settings.audibleOnly ? 100 : settings.timeout;

    if (settings.progressBar) {
      toast.append(progress);
    }

    // Build the RenderLoop integration
    timer = new RenderLoopItem({
      duration: math.convertDelayToFPS(settings.timeout),
      timeoutCallback: function() {
        self.remove(toast);
      },
      updateCallback: function(data) {
        percentage = ((data.duration - data.elapsedTime) / maxHideTime) * 100;

        if (Locale.isRTL()) {
          percentage = 100 - percentage;
        }

        if (settings.progressBar) {
          progress[0].style.width = percentage + '%';
        }
      }
    });
    renderLoop.register(timer);

    container.append(toast);
    toast.addClass((settings.audibleOnly ? 'audible' : 'effect-scale'));
    toast.append(closeBtn);

    $(document).on('keydown keyup', function(e) {
      e = e || window.event;
      if(e.ctrlKey && e.altKey && e.keyCode === 80) { //[Control + Alt + P] - Pause/Play toggle
        isPausePlay = e.type === 'keydown' ? true : false;
        timer[isPausePlay ? 'pause' : 'resume']();
      }
    });

    toast.on('mousedown.toast touchstart.toast mouseup.toast touchend.toast', function (e) {
      isPausePlay = /mousedown|touchstart/i.test(e.type) ? true : false;
      timer[isPausePlay ? 'pause' : 'resume']();
    });

    closeBtn.on('click', function () {
      timer.destroy();
      self.remove(toast);
    });
  },

  // Remove the Message and Animate
  remove: function (toast) {
    if (this.settings.audibleOnly) {
      toast.remove();
      return;
    }

    toast.addClass('effect-scale-hide');

    var closeTimer = new RenderLoopItem({
      duration: 20,
      updateCallback: function() {}, // TODO: make this work without an empty function
      timeoutCallback: function() {
        toast.remove();
      }
    });
    renderLoop.register(closeTimer);

    return closeTimer;
  },

  updated: function(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
    this.show();
  },

  // Teardown
  destroy: function() {
    $('#toast-container').remove();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};


export { Toast, COMPONENT_NAME };
