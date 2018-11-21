import { xssUtils } from './xss';

const DOM = {};

/**
 * Returns an array containing an element's attributes.
 * @param {HTMLElement|SVGElement} element the element whose attributes are being accessed
 * @returns {object} list of attributes in name/value pairs.
 */
DOM.getAttributes = function getAttributes(element) {
  if (!element || (!(element instanceof HTMLElement) && !(element instanceof SVGElement))) {
    return {};
  }

  return element.attributes;
};

/**
 * Adding, removing, and testing for classes
 * @param {HTMLElement} element the element to test
 * @returns {boolean} whether or not a className exists
 */
DOM.classNameExists = function classNameExists(element) {
  const cn = element.className;
  return cn && cn.length > 0;
};

/**
 * Checks the contents of a string for the existence of a particular substring.
 * @param {string} classNameString a string to test
 * @param {string} targetContents the contents that need to exist inside the `classNameString`
 * @returns {boolean} whether or not a className exists
 */
DOM.hasClassName = function has(classNameString, targetContents) {
  return classNameString.indexOf(targetContents) > -1;
};

/**
 * @param {HTMLElement} el a element being checked.
 * @param {string} className a string representing a class name to check for.
 * @returns {boolean} whether or not the element's class attribute contains the string.
 */
DOM.hasClass = function hasClass(el, className) {
  return el.classList ? el.classList.contains(className) : new RegExp(`\\b${className}\\b`).test(el.className);
};

/**
 * Add a class to any element and handle multiple classes.
 * Handles DOM and SVG elements down to IE11
 * @param {HTMLElement} el a element being checked.
 * @param {...string} className a string representing a class name.
 */
DOM.addClass = function addClass(el, ...className) {
  for (let i = 0; i < className.length; i++) {
    if (el.classList) {
      el.classList.add(className[i]);
    } else if (!DOM.hasClass(el, [i])) {
      el.className += ` ${className[i]}`;
    }
  }
};

/**
 * Remove a class from any element and handle multiple classes.
 * Handles DOM and SVG elements down to IE11
 * @param {HTMLElement} el a element being checked.
 * @param {...string} className a string representing a class name.
 */
DOM.removeClass = function removeClass(el, ...className) {
  for (let i = 0; i < className.length; i++) {
    if (el.classList) {
      el.classList.remove(className[i]);
    } else {
      let newClassName = '';
      const classes = el.className.split(' ');
      for (let j = 0; j < classes.length; j++) {
        if (classes[j] !== className[j]) {
          newClassName += `${classes[i]} `;
        }
      }
      this.className = newClassName;
    }
  }
};

/**
 * Checks if an element is valid
 * @param {HTMLElement|SVGElement|jQuery[]} el The element being checked
 * @returns {boolean} represents all values normally contained by a DOMRect or ClientRect
 */
DOM.isElement = function isElement(el) {
  if ((el instanceof HTMLElement) || (el instanceof SVGElement) || (el instanceof $ && el.length)) {
    return true;
  }
  return false;
};

/**
 * Runs the generic _getBoundingClientRect()_ method on an element, but returns its results
 * as a plain object instead of a ClientRect
 * @param {HTMLElement|SVGElement|jQuery[]} el The element being manipulated
 * @returns {object} represents all values normally contained by a DOMRect or ClientRect
 */
DOM.getDimensions = function getDimensions(el) {
  if (!DOM.isElement(el)) {
    return {};
  }

  if (el instanceof $) {
    if (!el.length) {
      return {};
    }

    el = el[0];
  }

  const rect = el.getBoundingClientRect();
  const rectObj = {};

  for (let prop in rect) { // eslint-disable-line
    if (!isNaN(rect[prop])) {
      rectObj[prop] = rect[prop];
    }
  }

  return rectObj;
};

/**
 * Append content to a DOM element (like jQuery.append)
 * @param {HTMLElement|SVGElement|jQuery[]} el The element to append to
 * @param {string|jQuery} contents The html string or jQuery object.
 * @param {string} stripTags A list of tags to strip to prevent xss, or * for sanitizing and allowing all tags.
 */
DOM.append = function append(el, contents, stripTags) {
  let domEl = el;

  if (el instanceof $ && el.length) {
    domEl = domEl[0];
  }

  if (domEl instanceof HTMLElement || domEl instanceof SVGElement) {
    domEl.insertAdjacentHTML('beforeend', this.xssClean(contents, stripTags));
  }
};

/**
 * Set an attribute with an extra check that the object exists.
 * @param {HTMLElement|SVGElement|jQuery[]} el The element to set the attribute on
 * @param {string} attribute The attribute name.
 * @param {string} value The attribute value.
 */
DOM.setAttribute = function append(el, attribute, value) {
  let domEl = el;

  if (el instanceof $ && el.length) {
    domEl = domEl[0];
  }

  if (domEl instanceof HTMLElement || domEl instanceof SVGElement) {
    domEl.setAttribute('attribute', value);
  }
};

/**
 * Clean the markup before insertion.
 * @param {string|jQuery} contents The html string or jQuery object.
 * @param {string} stripTags A list of tags to strip to prevent xss, or * for sanitizing and allowing all tags.
 * @returns {string} the cleaned up markup
 */
DOM.xssClean = function xssClean(contents, stripTags) {
  let markup = contents;

  if (stripTags && stripTags !== '*') {
    markup = xssUtils.stripTags(contents, stripTags);
  }

  if (stripTags === '*') {
    markup = xssUtils.sanitizeHTML(contents);
  }

  return markup;
};

/**
 * Append content to a DOM element (like jQuery.append)
 * @param {HTMLElement|SVGElement|jQuery[]} el The element to append to
 * @param {string|jQuery} contents The html string or jQuery object.
 * @param {string} stripTags A list of tags to strip to prevent xss, or * for sanitizing and allowing all tags.
 */
DOM.html = function html(el, contents, stripTags) {
  let domEl = el;

  if (el instanceof $ && el.length) {
    domEl = domEl[0];
  }

  if (domEl instanceof HTMLElement || domEl instanceof SVGElement) {
    domEl.innerHTML = this.xssClean(contents, stripTags);
  }
};

export { DOM };
