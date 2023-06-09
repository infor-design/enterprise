import { DOM } from './dom';
import { Environment as env } from './environment';

/**
 * HideFocus Behavior
 * Only shows the focus state on key entry (tabs or arrows).
 * @param {HTMLElement|SVGElement} element the base element
 * @returns {HideFocus} component instance
 */
function HideFocus(element) {
  return this.init(element);
}

HideFocus.prototype = {
  init(element) {
    if (!this.element && (element instanceof HTMLElement || element instanceof SVGElement)) {
      this.element = element;
    }

    const $el = $(this.element);
    let isClick = false;
    let isFocused = false;
    let labelClicked = false;

    // Checkbox, Radio buttons or Switch
    if ($el.is('.checkbox, .radio, .switch')) {
      let label = $el.next();
      if (label.is('[type="hidden"]')) {
        label = label.next();
      }
      this.label = label[0];

      $el.addClass('hide-focus')
        .on('focusin.hide-focus', (e) => {
          if (!isClick && !isFocused && !labelClicked) {
            $el.removeClass('hide-focus');
            $el.triggerHandler('hidefocusremove', [e]);
          }
          isClick = false;
          isFocused = true;
          labelClicked = false;
        })
        .on('focusout.hide-focus', (e) => {
          $el.addClass('hide-focus');
          labelClicked = label.is(labelClicked);
          isClick = false;
          isFocused = false;
          $el.triggerHandler('hidefocusadd', [e]);
        });

      label.on('mousedown.hide-focus', function (e) {
        labelClicked = this;
        isClick = true;
        $el.addClass('hide-focus');
        $el.triggerHandler('hidefocusadd', [e]);
      });
    } else {
      // All other elements (ie. Hyperlinks)
      const handleMousedown = (e) => {
        isClick = true;
        $el.addClass('hide-focus');
        $el.triggerHandler('hidefocusadd', [e]);
      };
      const isTouch = env.features.touch;

      // In some cases, detect a child element as the target for some events
      let eventTargetEl = $el;
      if ($el.hasClass('accordion-header')) {
        eventTargetEl = $el.find('a');
      }

      // Click/Touch events go to the event target
      eventTargetEl.on('mousedown.hide-focus', (e) => {
        handleMousedown(e);
      });
      if (isTouch) {
        eventTargetEl.on('touchstart.hide-focus', (e) => {
          handleMousedown(e);
        });
      }

      // Focus events apply to the container
      $el.addClass('hide-focus');
      $el.on('focusin.hide-focus', (e) => {
        if (!isClick) {
          $el.removeClass('hide-focus');
          $el.triggerHandler('hidefocusremove', [e]);
        }
        isClick = false;
        isFocused = true;
      })
        .on('focusout.hide-focus', (e) => {
          $el.addClass('hide-focus');
          isClick = false;
          isFocused = false;
          $el.triggerHandler('hidefocusadd', [e]);
        });

      // Store separate event target, if applicable
      if (!$el.is(eventTargetEl)) {
        this.separateEventTarget = eventTargetEl;
      }
    }

    return this;
  },

  updated() {
    return this
      .teardown()
      .init();
  },

  teardown() {
    if (this.label) {
      $(this.label).off('mousedown.hide-focus');
    }

    const elemEvents = [
      'focusin.hide-focus',
      'focusout.hide-focus',
      'mousedown.hide-focus',
      'touchstart.hide-focus'
    ];
    const elemEventStr = elemEvents.join(' ');
    $(this.element).off(elemEventStr);
    if (this.separateEventTarget?.length) {
      this.separateEventTarget.off(elemEventStr);
      this.separateEventTarget = null;
    }

    this.element?.classList.remove('hide-focus');

    return this;
  },

  destroy() {
    this.teardown();
    $.removeData(this.element, 'hidefocus');
  }
};

/**
 * jQuery component wrapper for the HideFocus behavior
 * @returns {jQuery[]} components being acted on
 */
$.fn.hideFocus = function () {
  return this.each(function () {
    let instance = $.data(this, 'hidefocus');
    if (instance) {
      instance.updated();
    } else {
      instance = $.data(this, 'hidefocus', new HideFocus(this));
    }
  });
};

/**
 * Allows for the smooth scrolling of an element's content area.
 * @param {HTMLElement|SVGElement|jQuery[]} el The element being manipulated.
 * @param {number} target target distance.
 * @param {number} duration the time that will be needed for the scrolling to complete.
 * @returns {$.Deferred} promise that resolved when scrolling completes.
 */
function smoothScrollTo(el, target, duration) {
  const dfd = $.Deferred();

  if (!DOM.isElement(el)) {
    // Not a workable element
    return dfd.reject();
  }

  // Strip the jQuery
  if (el instanceof $ && el.length) {
    el = el[0];
  }

  // undefined (not zero) target should instantly resolve
  if (target === undefined || target === null) {
    return dfd.resolve();
  }

  if (isNaN(duration)) {
    duration = 0;
  }

  target = Math.round(target);
  duration = Math.round(duration);

  if (duration < 0) {
    // bad duration
    return dfd.fail();
  }

  if (duration === 0) {
    el.scrollLeft += target;
    return dfd.resolve();
  }

  const startTime = Date.now();
  const endTime = startTime + duration;
  const startLeft = el.scrollLeft;
  const distance = target;

  // based on http://en.wikipedia.org/wiki/Smoothstep
  function smoothStep(start, end, point) {
    if (point <= start) { return 0; }
    if (point >= end) { return 1; }
    const x = (point - start) / (end - start); // interpolation
    return x * x * (3 - 2 * x);
  }

  // This is to keep track of where the element's scrollLeft is
  // supposed to be, based on what we're doing
  let previousLeft = el.scrollLeft;

  // This is like a think function from a game loop
  function scrollFrame() {
    if (el.scrollLeft !== previousLeft) {
      // interrupted
      dfd.reject();
      return;
    }

    // set the scrollLeft for this frame
    const now = Date.now();
    const point = smoothStep(startTime, endTime, now);
    const frameLeft = Math.round(startLeft + (distance * point));
    el.scrollLeft = frameLeft;

    // check if we're done!
    if (now >= endTime) {
      dfd.resolve();
      return;
    }

    // If we were supposed to scroll but didn't, then we
    // probably hit the limit, so consider it done; not
    // interrupted.
    if (el.scrollLeft === previousLeft && el.scrollLeft !== frameLeft) {
      dfd.resolve();
      return;
    }
    previousLeft = el.scrollLeft;

    // schedule next frame for execution
    setTimeout(scrollFrame, 0);
  }

  // boostrap the animation process
  setTimeout(scrollFrame, 0);

  return dfd;
}

/**
 * Binds the Soho Behavior _smoothScrollTo()_ to a jQuery selector
 * @param {number} target target distance to scroll the element
 * @param {number} duration the time that will be needed for the scrolling to complete.
 * @returns {$.Deferred} promise that resolved when scrolling completes.
 */
$.fn.smoothScroll = function (target, duration) {
  return smoothScrollTo(this, target, duration);
};

/**
 * Uses 'requestAnimationFrame' or 'setTimeout' to defer a function.
 * @param {function} callback the callback that runs on a deferment.
 * @param {number} timer how long to delay before running the callback.
 * @returns {function} either `requestAnimationFrame` or `setTimeout`
 */
function defer(callback, timer) {
  const deferMethod = typeof window.requestAnimationFrame !== 'undefined' ? window.requestAnimationFrame : setTimeout;
  return deferMethod(callback, timer);
}

export { HideFocus, smoothScrollTo, defer };
