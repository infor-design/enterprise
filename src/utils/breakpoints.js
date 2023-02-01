import { DOM } from './dom';

// =================================================================
// Soho JS-level Breakpoint Access
// NOTE: these should match whatever the breakpoints are in "/sass/_config.scss"
// =================================================================
const breakpoints = {
  phone: 320,
  slim: 400,
  phablet: 610,
  'phone-to-tablet': 767,
  'wide-tablet': 968,
  'tablet-to-desktop': 1280,
  desktop: 1024,
  'desktop-to-extralarge': 1600
};

/**
 * @returns {array} a list of available breakpoint names
 */
const availableBreakpoints = Object.keys(breakpoints);
breakpoints.available = availableBreakpoints;

/**
 * Get the name of the current CSS breakpoint by checking the popuplated 'content' value of the
 * <body> tag's `::after` pseudo-element.  These names should be reflected in the breakpoints object
 * above.
 * @returns {string} name of the current breakpoint
 */
breakpoints.current = function () {
  if (!window.getComputedStyle) return '';
  const afterElement = window.getComputedStyle ? window.getComputedStyle(document.body, ':after') : false;
  if (!afterElement) {
    return '';
  }
  return (afterElement.getPropertyValue ? afterElement.getPropertyValue('content') : '' || '').replace(/"/g, '');
};

/**
 * @param {string} breakpoint matches one of the entries in the "Soho.breakpoints" object.
 * @returns {boolean} whether or not the window is currently wider than the breakpoint provided.
 */
breakpoints.isAbove = function isAbove(breakpoint) {
  const bp = breakpoints[breakpoint];
  if (!bp) {
    return false;
  }

  const windowWidth = $(window).width();
  return windowWidth > bp - 1;
};

/**
 * @param {string} breakpoint matches one of the entries in the "Soho.breakpoints" object.
 * @returns {boolean} whether or not the window is currently more narrow
 *  than the breakpoint provided.
 */
breakpoints.isBelow = function isBelow(breakpoint) {
  const bp = breakpoints[breakpoint];
  if (!bp) {
    return false;
  }

  const windowWidth = $(window).width();
  return windowWidth < bp;
};

/**
 * Compares the last-stored breakpoint with a check on the "current" breakpoint to see if the
 * breakpoint has changed.
 * @returns {void}
 */
breakpoints.compare = function compare() {
  if (!this.last) {
    this.last = '';
  }

  const cur = this.current();
  if (this.last !== cur) {
    $('body').triggerHandler('breakpoint-change', [{
      previous: this.last,
      current: cur
    }]);
    this.last = cur;
  }
};

/**
 * Checks an element for Soho visibility classes and determines whether or not
 * should be hidden based on those values at the current breakpoint.
 * NOTE: this method does NOT determine if the element is ACTUALLY hidden with a
 * `display: none;` or `visibility: hidden;` rule.  It determines whether or not a CSS
 * visibility rule alone would hide the element.
 * @param {HTMLElement} element the element being checked.
 * @returns {boolean} whether or not the element is hidden at this breakpoint.
 */
breakpoints.isHidden = function (element) {
  if (!element || !DOM.isElement(element)) {
    return false;
  }

  // If there are no CSS classes on the element, return false.
  const cl = element.classList;
  if (!cl.length) {
    return false;
  }

  // If it's always hidden, always return true.
  if (cl.contains('hidden')) {
    return true;
  }

  const bp = this.current();
  const map = {
    phonedown: 'xs',
    phone: 'sm',
    tablet: 'md',
    desktop: 'lg',
    extralarge: 'xl',
  };
  const size = map[bp];
  const hiddenClassName = `hidden-${size}`;
  const visibleClassName = `visible-${size}-`;

  // Should be hidden on this breakpoint
  if (cl.contains(hiddenClassName)) {
    return true;
  }

  // If explicitly visible, return
  if (cl.toString().indexOf(visibleClassName) > -1) {
    return false;
  }

  // Simply return false if none of these thing are found
  return false;
};

/**
 * jQuery wrapper for `Soho.breakpoints.isHidden()`
 * NOTE: if a jQuery selector with multiple elements is passed to this function,
 * it will only operate on the first one.
 * This method is NOT chainable.
 * @returns {boolean} whether or not the element is hidden at this breakpoint.
 */
$.fn.isHiddenAtBreakpoint = function () {
  if (!this.length) {
    return false;
  }
  return breakpoints.isHidden($(this).first()[0]);
};

export { breakpoints };
