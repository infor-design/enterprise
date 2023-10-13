import { xssUtils } from './xss';

const DOM = {};

/**
 * DOM operations are only allowed on elements that are based on HTML or SVG. This method
 * determines whether or not the element is valid for performing a DOM operation.
 * @param {HTMLElement|SVGElement} el the element being examined
 * @returns {boolean} true if the element is valid
 */
DOM.isValidElement = function isValidElement(el) {
  return (el instanceof HTMLElement || el instanceof SVGElement);
};

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
DOM.hasAnyClass = function hasAnyClass(element) {
  const cn = element.className;
  return cn && cn.length > 0;
};

/**
 * Checks the element for the existence of a particular class.
 * @param {HTMLElement|SVGElement} elem a element being checked.
 * @param {string} className a string representing a class name to check for.
 * @returns {boolean} whether or not the element's class attribute contains the string.
 */
DOM.hasClass = function hasClass(elem, className) {
  let r = false;
  if (!elem?.getAttribute) {
    return r;
  }

  if ('classList' in elem) {
    r = elem.classList.contains(className);
  } else {
    const classAttr = elem.getAttribute('class');
    r = classAttr ? classAttr.split(/\s+/).indexOf(className) !== -1 : false;
  }
  return r;
};

/**
 * Add a class to any element and handle multiple classes.
 * Handles DOM and SVG elements down to IE11
 * @param {HTMLElement} el a element being checked.
 * @param {...string} className a string representing a class name.
 */
DOM.addClass = function addClass(el, ...className) {
  if (!el) {
    return;
  }
  let classStr = '';
  for (let i = 0; i < className.length; i++) {
    if (el.classList) {
      el.classList.add(className[i]);
    } else if (!DOM.hasClass(el, [i])) {
      if (classStr.length) {
        classStr += ' ';
      }
      classStr += className[i];
    }
  }
  if (classStr.length) {
    $(el).addClass(classStr);
  }
};

/**
 * Remove a class from any element and handle multiple classes.
 * Handles DOM and SVG elements down to IE11
 * @param {HTMLElement} el a element being checked.
 * @param {...string} className a string representing a class name.
 */
DOM.removeClass = function removeClass(el, ...className) {
  if (!el) {
    return;
  }

  let classStr = '';
  for (let i = 0; i < className.length; i++) {
    if (el.classList) {
      el.classList.remove(className[i]);
    } else if (!DOM.hasClass(el, [i])) {
      if (classStr.length) {
        classStr += ' ';
      }
      classStr += className[i];
    }
  }
  if (classStr.length) {
    $(el).removeClass(classStr);
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
 * Prepend content to a DOM element (like jQuery.Prepend)
 * @param {HTMLElement|SVGElement|jQuery[]} el The element to prepend to
 * @param {string|jQuery} contents The html string or jQuery object.
 * @param {string} stripTags A list of tags to strip to prevent xss, or * for sanitizing and allowing all tags.
 */
DOM.prepend = function prepend(el, contents, stripTags) {
  let domEl = el;

  if (el instanceof $ && el.length) {
    domEl = domEl[0];
  }

  if (domEl instanceof HTMLElement || domEl instanceof SVGElement) {
    domEl.insertAdjacentHTML('afterbegin', this.xssClean(contents, stripTags));
  }
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

DOM.after = function after(el, contents, stripTags) {
  let domEl = el;

  if (el instanceof $ && el.length) {
    domEl = domEl[0];
  }

  if (domEl instanceof HTMLElement || domEl instanceof SVGElement) {
    domEl.insertAdjacentHTML('afterend', this.xssClean(contents, stripTags));
  }
};

/**
 * Remove a DOM Element
 * @param {HTMLElement|SVGElement|jQuery[]} el The element to remove.
 */
DOM.remove = function append(el) {
  let domEl = el;

  if (el instanceof $ && el.length) {
    domEl = domEl[0];
  }

  if ((domEl instanceof HTMLElement || domEl instanceof SVGElement) && el.parentNode) {
    el.parentNode.removeChild(el);
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

/**
 * Replace content of a DOM element
 * @param {HTMLElement|SVGElement|jQuery[]} el The element to append to
 * @param {string|jQuery} contents The html string or jQuery object.
 * @param {string} stripTags A list of tags to strip to prevent xss, or * for sanitizing and allowing all tags.
 */
DOM.replaceHtml = function replaceHtml(el, contents, stripTags) {
  let domEl = el;
  let domContents = contents;

  if (el instanceof $ && el.length) {
    domEl = domEl[0];
  }

  if (contents instanceof $ && el.length) {
    domContents = contents[0];
  }

  if (domEl instanceof HTMLElement || domEl instanceof SVGElement) {
    domEl.replaceChildren(this.xssClean(domContents, stripTags));
  }
};

/**
 * Recursively checks parent nodes for a matching CSS selector
 * @param {HTMLElement/SVGElement} el the lower-level element being checked
 * @param {string} selector a valid CSS selector
 * @param {boolean} closest if true, returns the first match found, or undefined if no matches are found.
 * @returns {Array|HTMLElement|SVGElement|undefined} containing references to parent elements that match the selector
 */
DOM.parents = function parents(el, selector, closest) {
  const parentEls = [];
  if (!DOM.isValidElement(el)) {
    return parentEls;
  }

  // Pushes to the element array.
  function checkEl(thisEl) {
    if (thisEl !== document && thisEl.matches(selector)) {
      parentEls.push(thisEl);
    }
  }

  // Loop until we hit the <html> tag.
  // If we're only looking for the closest element, break out once we find it.
  while (el.parentNode) {
    if (closest && parentEls.length) {
      break;
    }

    el = el.parentNode;
    checkEl(el);
  }

  // Return the first one, or the entire array.
  if (closest) {
    return parentEls[0]; // can be `undefined`
  }
  return parentEls;
};

/**
 * Get the next sibling with an optional css selector.
 * @param {HTMLElement/SVGElement} el The element being checked
 * @param {string} selector a valid CSS selector
 * @returns {HTMLElement} The next sibling
 */
DOM.getNextSibling = function getNextSibling(el, selector) {
  if (el instanceof $ && el.length) {
    el = el[0];
  }

  // Get the next sibling element
  let sibling = el.nextElementSibling;

  // If there's no selector, return the first sibling
  if (!selector) return sibling;

  // If the sibling matches our selector, use it
  // If not, jump to the next sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.nextElementSibling;
  }

  return undefined;
};

/**
 * Get the next previous with an optional css selector.
 * @param {HTMLElement/SVGElement} el The element being checked
 * @param {string} selector a valid CSS selector
 * @returns {HTMLElement} The previous sibling
 */
DOM.getPreviousSibling = function getPreviousSibling(el, selector) {
  if (el instanceof $ && el.length) {
    el = el[0];
  }

  // Get the previous sibling element
  let sibling = el.previousElementSibling;

  // If there's no selector, return the first sibling
  if (!selector) return sibling;

  // If the sibling matches our selector, use it
  // If not, jump to the previous sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.previousElementSibling;
  }

  return undefined;
};

/**
 * Get the sibling elements.
 * @param {HTMLElement/SVGElement} el The element to get siblings
 * @returns {array} Array of sibling elements
 */
DOM.getSiblings = function getSiblings(el) {
  if (el instanceof $ && el.length) {
    el = el[0];
  }
  return [].slice.call(el.parentNode.children).filter(child => child !== el);
};

/**
 * Returns a simple CSS selector string that represents an existing page element.
 * Generally used in reporting (error/console messages).
 * @param {HTMLElement|SVGElement} el the element to report on
 * @returns {string} containing a simple CSS selector that represents the element
 */
DOM.getSimpleSelector = function getSimpleSelector(el) {
  const tagName = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : '';
  const className = el.className ? `.${el.className.split(' ').join('.')}` : '';

  return `${tagName}${id}${className}`;
};

export { DOM };
