import { utils } from './utils';

// Height Animation Controls
// Adapted from: http://n12v.com/css-transition-to-from-auto/
// Contains a handful of animation helper methods that attempt
// to DRY up CSS-powered sliding animations.

/**
 * animateOpen default settings
 * @namespace
 * @property {string} direction horizontal or vertical
 * @property {string|number} distance in pixels that the animation covers. defaults to 'auto',
 *  or can pixel value size.
 * @property {number} timing delay in Miliseconds
 * @property {string} transition settings for the CSS Transition Timing Function
 */
const ANIMATE_OPEN_DEFAULTS = {
  direction: 'vertical',
  distance: 'auto',
  timing: 300,
  transition: 'cubic-bezier(.17, .04, .03, .94)'
};

// Use CSS Transitions to animate from "0" to "auto" widths
$.fn.animateOpen = function (settings) {
  const eventName = $.fn.transitionEndName();
  settings = utils.mergeSettings(undefined, settings, ANIMATE_OPEN_DEFAULTS);

  // Initialize the plugin (Once)
  return this.each(function () {
    const self = this;
    const $self = $(this);
    const dim = settings.direction === 'horizontal' ? 'width' : 'height';
    const cDim = dim.charAt(0).toUpperCase() + dim.slice(1);
    const distance = !isNaN(settings.distance) ? `${parseInt(settings.distance, 10)}px` : 'auto';
    let timeout;

    function transitionEndCallback() {
      if (timeout) {
        clearTimeout(timeout);
      }

      if ($self.data('ignore-animation-once')) {
        $.removeData($self[0], 'ignore-animation-once');
      }

      if ($self.data('is-animating')) {
        $.removeData($self[0], 'is-animating');
      }

      $self.off(`${eventName}.animateopen`);
      self.style.transition = '';
      self.style[dim] = distance;
      $self.trigger('animateopencomplete');
    }

    // Clear any previous attempt at this animation when the animation starts new
    $self.one('animateopenstart.animation', (e) => {
      e.stopPropagation();
      $self.off(`${eventName}.animateopen`);
    });
    $self.trigger('animateopenstart');

    // Trigger the callback either by Timeout or by TransitionEnd
    if (eventName) {
      $self.one(`${eventName}.animateopen`, transitionEndCallback);
    }

    // Animate
    $self.data('is-animating', true);
    const prevVal = this.style[dim];
    this.style[dim] = distance;
    const endVal = getComputedStyle(this)[dim];
    this.style[dim] = prevVal;
    // next line forces a repaint
    this[`offset${cDim}`]; // eslint-disable-line
    this.style.transition = `${dim} ${settings.timing}ms ${settings.transition}`;

    timeout = setTimeout(transitionEndCallback, settings.timing);
    this.style[dim] = endVal;

    // Trigger immediately if this element is invisible or has the 'no-transition' class
    if ($self.is(':hidden') || $self.is('.no-transition') || $self.data('ignore-animation-once')) {
      transitionEndCallback();
    }
  });
};

/**
 * Animate closed defaults
 * @namespace
 * @property {string} direction horizontal or vertical
 * @property {number} timing delay in Miliseconds
 * @property {string} transition settings for the CSS Transition Timing Function
 */
const ANIMATE_CLOSED_DEFAULTS = {
  direction: 'vertical',
  timing: 300,
  transition: 'cubic-bezier(.17, .04, .03, .94)'
};

// Use CSS Transitions to animate from "auto" to "0" widths
$.fn.animateClosed = function (settings) {
  const eventName = $.fn.transitionEndName();
  settings = utils.mergeSettings(undefined, settings, ANIMATE_CLOSED_DEFAULTS);

  // Initialize the plugin (Once)
  return this.each(function () {
    const self = this;
    const $self = $(this);
    const dim = settings.direction === 'horizontal' ? 'width' : 'height';
    const cDim = dim.charAt(0).toUpperCase() + dim.slice(1);
    let timeout;

    function transitionEndCallback() {
      if (timeout) {
        clearTimeout(timeout);
      }

      if ($self.data('ignore-animation-once')) {
        $.removeData($self[0], 'ignore-animation-once');
      }

      if ($self.data('is-animating')) {
        $.removeData($self[0], 'is-animating');
      }

      $self.off(`${eventName}.animatedclosed`);
      self.style.transition = '';
      self.style[dim] = '0px';
      $self.trigger('animateclosedcomplete');
    }

    // Clear any previous attempt at this animation when the animation starts new
    $self.one('animateclosedstart', (e) => {
      e.stopPropagation();
      $self.off(`${eventName}.animatedclosed`);
    });
    $self.trigger('animateclosedstart');

    // Trigger the callback either by Timeout or by TransitionEnd
    if (eventName) {
      $self.one(`${eventName}.animatedclosed`, transitionEndCallback);
    }

    // Animate
    $self.data('is-animating', true);
    this.style[dim] = getComputedStyle(this)[dim];
    // next line forces a repaint
    this[`offset${cDim}`]; // eslint-disable-line
    this.style.transition = `${dim} ${settings.timing}ms ${settings.transition}`;

    timeout = setTimeout(transitionEndCallback, settings.timing);
    this.style[dim] = '0px';

    // Trigger immediately if this element is invisible or has the 'no-transition' class
    if ($self.is(':hidden') || $self.is('.no-transition') || $self.data('ignore-animation-once')) {
      transitionEndCallback();
    }
  });
};

// Chainable jQuery plugin that checks if an element is in the process of animating
$.fn.isAnimating = function () {
  return this.each(function () {
    return $(this).data('is-animating') === true;
  });
};
