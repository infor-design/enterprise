/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  window.Soho = window.Soho || {};
  window.Soho.DOM = window.Soho.DOM || {};

  //==================================================================
  // JS-level Breakpoint Access
  // NOTE: these should match whatever the breakpoints are in "/sass/_config.scss"
  //==================================================================
  window.Soho.breakpoints = {
    'phone': 320,
    'slim': 400,
    'phablet': 610,
    'phone-to-tablet': 767,
    'wide-tablet': 968,
    'tablet-to-desktop': 1280,
    'desktop': 1024,
    'desktop-to-extralarge': 1600
  };


  /**
   * Get the name of the current CSS breakpoint by checking the popuplated 'content' value of the
   * <body> tag's `::after` pseudo-element.  These names should be reflected in the breakpoints object
   * above.
   * @returns {String}
   */
  window.Soho.breakpoints.current = function() {
    var afterElement = window.getComputedStyle ? window.getComputedStyle(document.body, ':after') : false;
    if (!afterElement) {
      return '';
    }
    return (afterElement.getPropertyValue('content') || '').replace(/"/g, '');
  };


  /**
   * @param {string} breakpoint - matches one of the entries in the "Soho.breakpoints" object.
   * @returns {boolean}
   */
  window.Soho.breakpoints.isAbove = function isAbove(breakpoint) {
    var bp = Soho.breakpoints[breakpoint];
    if (!bp) {
      return false;
    }

    var windowWidth = $(window).width();
    return windowWidth > bp;
  };


  /**
   * @param {string} breakpoint - matches one of the entries in the "Soho.breakpoints" object.
   * @returns {boolean}
   */
  window.Soho.breakpoints.isBelow = function isBelow(breakpoint) {
    var bp = Soho.breakpoints[breakpoint];
    if (!bp) {
      return false;
    }

    var windowWidth = $(window).width();
    return windowWidth < bp;
  };


  /**
   * Checks an element for Soho visibility classes and determines whether or not
   * should be hidden based on those values at the current breakpoint.
   * NOTE: this method does NOT determine if the element is ACTUALLY hidden with a
   * `display: none;` or `visibility: hidden;` rule.  It determines whether or not a CSS
   * visibility rule alone would hide the element.
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  window.Soho.breakpoints.isHidden = function(element) {
    if (!element || !Soho.DOM.isElement(element)) {
      return false;
    }

    // If there are no CSS classes on the element, return false.
    var cl = element.classList;
    if (!cl.length) {
      return false;
    }

    // If it's always hidden, always return true.
    if (cl.contains('hidden')) {
      return true;
    }

    var bp = Soho.breakpoints.current(),
      map = {
        'phonedown': 'xs',
        'phone': 'sm',
        'tablet': 'md',
        'desktop': 'lg',
        'extralarge': 'xl',
      },
      size = map[bp],
      hiddenClassName = 'hidden-' + size,
      visibleClassName = 'visible-' + size + '-';

    // Should be hidden on this breakpoint
    if (cl.contains(hiddenClassName)) {
      return true;
    }

    // If explicitly visible, return
    if (cl.toString().indexOf(visibleClassName >= -1)) {
      return false;
    }

    // Simply return false if none of these thing are found
    return false;
  };

  /**
   * jQuery wrapper for `Soho.breakpoints.isHidden()`
   * NOTE: if a jQuery selector with multiple elements is passed to this function, it will only operate on the first one.
   * This method is NOT chainable.
   * @returns {boolean}
   */
  $.fn.isHiddenAtBreakpoint = function() {
    if (!this.length) {
      return false;
    }
    return Soho.breakpoints.isHidden($(this).first()[0]);
  };


/* start-amd-strip-block */
}));
/* end-amd-strip-block */
