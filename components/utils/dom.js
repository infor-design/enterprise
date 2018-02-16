
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
DOM.classNameHas = function has(classNameString, targetContents) {
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
 * @param {HTMLElement} el a element being checked.
 * @param {string} className a string representing a class name.
 */
DOM.addClass = function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else if (!DOM.hasClass(el, className)) {
    el.className += ` ${className}`;
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

export { DOM };
