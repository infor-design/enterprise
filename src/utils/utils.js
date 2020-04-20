import { defer } from './behaviors';
import { Environment as env } from './environment';
import { DOM } from './dom';

/**
 * Used for changing the stacking order of jQuery events.  This is needed to override certain
 * Events invoked by other plugins http://stackoverflow.com/questions/2360655
 * @private
 * @param {string} name the event name
 * @param {function} fn callback function that will be called during the supplied event name
 * @returns {void}
 */
$.fn.bindFirst = function (name, fn) {
  this.on(name, fn);
  this.each(function () {
    const handlers = $._data(this, 'events')[name.split('.')[0]]; // eslint-disable-line
    // take out the handler we just inserted from the end
    const handler = handlers.pop();
    // move it at the beginning
    handlers.splice(0, 0, handler);
  });
};

/**
 * @private
 * uniqueIdCount is a baseline unique number that will be used when generating
 * uniqueIds for elements and components.
 */
export let uniqueIdCount = []; // eslint-disable-line

/**
 * Detect whether or not a text string represents a valid CSS property.  This check
 * includes an attempt at checking for vendor-prefixed versions of the CSS property
 * provided.
 * @private
 * @param {string} prop a possible CSS property
 * @returns {string|null} If the property exists, it will be returned in string format.
 *  If the property doesn't exist, a null result is returned.
 */
$.fn.cssPropSupport = function (prop) {
  if (!prop) {
    return null;
  }

  const el = $('<div></div>')[0];
  const propStr = prop.toString();
  const prefixes = ['Moz', 'Webkit', 'O', 'ms'];
  const capitalizedProp = propStr.charAt(0).toUpperCase() + propStr.substr(1);

  if (prop in el.style) {
    $(el).remove();
    return prop;
  }

  for (let i = 0; i < prefixes.length; i++) {
    const vendorProp = prefixes[i] + capitalizedProp;
    if (vendorProp in el.style) {
      $(el).remove();
      return vendorProp;
    }
  }

  $(el).remove();
  return null;
};

/**
 * Returns the name of the TransitionEnd event.
 * @private
 * @returns {string} a (possibly) vendor-adjusted CSS transition property name.
 */
$.fn.transitionEndName = function () {
  const prop = $.fn.cssPropSupport('transition');
  const eventNames = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    MSTransition: 'msTransitionEnd',
    OTransition: 'oTransitionEnd',
    transition: 'transitionend'
  };

  return eventNames[prop] || null;
};

/**
 * Checks to see if a provided element is visible based on its CSS `visibility` property.
 * @private
 * @param {HTMLElement} element the element being checked.
 * @returns {boolean} whether or not the element is visible.
 */
function visible(element) {
  return $.expr.filters.visible(element) &&
    !$(element).parents().addBack().filter(function () { return $.css(this, 'visibility') === 'hidden'; }).length;
}

/**
 * From jQueryUI Core: https://github.com/jquery/jquery-ui/blob/24756a978a977d7abbef5e5bce403837a01d964f/ui/jquery.ui.core.js#L93
 * Adapted from:  http://stackoverflow.com/questions/7668525/is-there-a-jquery-selector-to-get-all-elements-that-can-get-focus
 * Adds the ':focusable' selector to Sizzle to allow for the selection of elements
 * that can currently be focused.
 * @private
 * @param {HTMLElement} element the element being checked
 * @returns {boolean} whether or not the element is focusable.
 */
function focusable(element) {
  let map;
  let mapName;
  let img;
  const nodeName = element.nodeName.toLowerCase();
  const isTabIndexNotNaN = !isNaN($.attr(element, 'tabindex'));

  if (nodeName === 'area') {
    map = element.parentNode;
    mapName = map.name;
    if (!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
      return false;
    }
    img = $(`img[usemap=#${mapName}]`)[0];
    return !!img && visible(img);
  }

  // The element and all of its ancestors must be visible.
  // Return out fast if this isn't the case.
  if (!visible(element)) {
    return false;
  }

  const match = /input|select|textarea|button|object/.test(nodeName);
  if (match) {
    return !element.disabled;
  }
  if (nodeName === 'a') {
    return (element.href !== undefined || isTabIndexNotNaN);
  }
  return isTabIndexNotNaN;
}

// Adds a `:focusable` selector to jQuery's selector library.
$.extend($.expr[':'], {
  focusable(element) {
    return focusable(element, !isNaN($.attr(element, 'tabindex')));
  }
});

/**
 * Returns a key/value list of currently attached event listeners
 * @private
 * @returns {object} containing list of event names as keys, and event listener functions as values.
 */
$.fn.listEvents = function () {
  let data = {};

  this.each(function () {
    data = $._data(this, 'events'); // eslint-disable-line
  });

  return data;
};

const utils = {};

/**
 * Generates a unique ID for an element based on the element's configuration, any
 * Soho components that are generated against it, and provided prefixes/suffixes.
 * @private
 * @param {HTMLElement} element the element being used for uniqueId capture
 * @param {string} [className] CSS classname (will be interpreted automatically
 *  if it's not provided)
 * @param {string} [prefix] optional prefix
 * @param {string} [suffix] optional suffix
 * @returns {string} the compiled uniqueID
 */
utils.uniqueId = function (element, className, prefix, suffix) {
  const predefinedId = element.id;

  if (predefinedId && $(`#${predefinedId}`).length < 2) {
    return predefinedId;
  }

  prefix = (!prefix ? '' : `${prefix}-`);
  suffix = (!suffix ? '' : `-${suffix}`);
  className = (!className ? utils.getArrayFromList(element.classList).join('-') : className);

  if (!uniqueIdCount[className]) {
    uniqueIdCount[className] = 1;
  }
  const str = `${prefix}${className}-${uniqueIdCount[className]}${suffix}`;
  uniqueIdCount[className] += 1;
  return str;
};

/**
 * Grabs an attribute from an HTMLElement containing stringified JSON syntax,
 * and interprets it into options.
 * @private
 * @param {HTMLElement} element the element whose settings are being interpreted
 * @param {string} [attr] optional different attribute to parse for settings
 * @returns {object} a list of interpreted settings for this element
 */
utils.parseSettings = function parseSettings(element, attr) {
  let options = {};
  if (!element ||
    (!(element instanceof HTMLElement) && !(element instanceof $)) ||
    (element instanceof $ && !element.length)) {
    return options;
  }

  if (element instanceof $) {
    element = element[0];
  }

  // Use `data-options` as a default.
  attr = attr || 'data-options';

  const str = element.getAttribute(attr);
  if (!str || typeof str !== 'string' || str.indexOf('{') === -1) {
    return options;
  }

  // replace single to double quotes, since single-quotes may be necessary
  // due to entry in markup.
  function replaceDoubleQuotes(changedStr) {
    return changedStr.replace(/'/g, '"');
  }

  // Manually parse a string more in-depth
  function manualParse(changedStr) {
    // get keys
    let regex = /({|,)(?:\s*)(?:')?([A-Za-z_$\.][A-Za-z0-9_ \-\.$]*)(?:')?(?:\s*):/g; // eslint-disable-line

    // add double quotes to keys
    changedStr = changedStr.replace(regex, '$1\"$2\":'); // eslint-disable-line

    // get strings in values
    regex = /:(?:\s*)(?!(true|false|null|undefined))([A-Za-z_$\.#][A-Za-z0-9_ \-\.$]*)/g; // eslint-disable-line

    // add double quotes to strings in values
    changedStr = changedStr.replace(regex, ':\"$2\"'); // eslint-disable-line
    changedStr = replaceDoubleQuotes(changedStr);
    return changedStr;
  }

  try {
    options = JSON.parse(replaceDoubleQuotes(str));
  } catch (err) {
    options = JSON.parse(manualParse(str));
  }

  return options;
};

/**
 * Deprecate `utils.parseOptions` in favor of `utils.parseSettings`.
 * This method is slated to be removed in a future v4.10.0 or v5.0.0.
 * @private
 * @deprecated as of v4.4.0. Please use `parseSettings()` instead.
 * @param {HTMLElement|jQuery[]} element the element whose options are being parsed
 * @param {string} [attr] an optional alternate attribute name to use when obtaining settings
 * @returns {Object|Object[]} an object representation of parsed settings.
 */
utils.parseOptions = function parseOptions(element, attr) {
  return utils.parseSettings(element, attr);
};

/**
* jQuery Behavior Wrapper for `utils.parseOptions`.
* @deprecated as of v4.4.0. This is no longer necessary to call directly and should be avoided.
* @private
* @param {HTMLElement|jQuery[]} element the element whose options are being parsed
* @param {string} [attr] an optional alternate attribute name to use when obtaining settings
* @returns {Object|Object[]} an object representation of parsed settings.
*/
$.fn.parseOptions = function (element, attr) {
  const results = [];
  const isCalledDirectly = (element instanceof HTMLElement ||
    element instanceof SVGElement || element instanceof $);
  let targets = this;

  if (isCalledDirectly) {
    targets = $(element);
  } else {
    attr = element;
    element = undefined;
  }

  targets.each(function (i, item) {
    results.push({
      element: this,
      options: utils.parseOptions(item, attr)
    });
  });

  if (results.length === 1) {
    return results[0].options;
  }
  return results;
};

/**
 * Performs the usual Boolean coercion with the exception of the strings "false"
 * (case insensitive) and "0"
 * @private
 * @param {boolean|string|number} b the value to be checked
 * @returns {boolean} whether or not the value passed coerces to true.
 */
utils.coerceToBoolean = function (b) {
  return !(/^(false|0)$/i).test(b) && !!b;
};

/**
 * Coerces all properties inside of a settings object to a boolean.
 * @param {Object} settings incoming settings
 * @param {String[]} [targetPropsArr=undefined] optional array of specific settings keys to target.
 *  If no keys are provided, all keys will be targeted.
 * @returns {Object} modified settings.
 */
utils.coerceSettingsToBoolean = function (settings, targetPropsArr) {
  if (!targetPropsArr || !Array.isArray(targetPropsArr)) {
    Object.keys(settings).forEach((key) => {
      targetPropsArr.push(key);
    });
  }

  let i;
  let l;
  for (i = 0, l = targetPropsArr.length; i < l; i++) {
    settings[targetPropsArr[i]] = utils.coerceToBoolean(settings[targetPropsArr[i]]);
  }

  return settings;
};

/**
 * Timer - can be used for play/pause or stop for given time.
 * Use as new instance [ var timer = new $.fn.timer(function() {}, 6000); ]
 * then can be listen events as:
 * [ $(timer.event).on('update', function(e, data){console.log(data.counter)}); ]
 * or can access as [ timer.cancel(); -or- timer.pause(); -or- timer.resume(); ]
 * @private
 * @param {function} [callback] method that will run on each timer update
 * @param {number} delay amount of time between timer ticks
 * @returns {object} containing methods that can be run on the timer
 */
$.fn.timer = function (callback, delay) {
  const self = $(this);
  const speed = 10;
  let interval;
  let counter = 0;

  function cancel() {
    self.triggerHandler('cancel');
    clearInterval(interval);
    counter = 0;
  }

  function pause() {
    self.triggerHandler('pause');
    clearInterval(interval);
  }

  function update() {
    interval = setInterval(function () {
      counter += speed;
      self.triggerHandler('update', [{ counter }]);
      if (counter > delay) {
        self.triggerHandler('timeout');
        callback.apply(arguments); // eslint-disable-line
        clearInterval(interval);
        counter = 0;
      }
    }, speed);
  }

  function resume() {
    self.triggerHandler('resume');
    update();
  }

  update();

  return {
    event: this,
    cancel,
    pause,
    resume
  };
};

/**
 * Copies a string to the clipboard. Must be called from within an event handler such as click.
 * May return false if it failed, but this is not always
 * possible. Browser support for Chrome 43+, Firefox 42+, Edge and IE 10+.
 * No Safari support, as of (Nov. 2015). Returns false.
 * IE: The clipboard feature may be disabled by an adminstrator. By default a prompt is
 * shown the first time the clipboard is used (per session).
 * @private
 * @param {string} text incoming text content
 * @returns {string|boolean} copied text, or a false result if there was an error
 */
$.copyToClipboard = function (text) { // eslint-disable-line
  if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData('Text', text);
  } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy'); // Security exception may be thrown by some browsers.
    } catch (ex) {
      // console.warn('Copy to clipboard failed.', ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
};

/**
 * Clearable (Shows an X to clear)
 * @private
 */
$.fn.clearable = function () {
  const self = this;
  this.element = $(this);

  const COMPONENT_NAME = 'clearable';

  // Create an X icon button styles in icons.scss
  this.xButton = this.element.find('.icon.close').first();
  if (!this.xButton || !this.xButton.length) {
    this.xButton = $.createIconElement({ classes: 'close is-empty', icon: 'close' }).icon();
  }

  // Clears the contents of the base element
  this.clear = function () {
    self.element.val('').trigger('change').focus().trigger('cleared');
    self.checkContents();
  };

  // Event listener for the xButton's `keydown` event
  this.handleKeydown = function (e) {
    const key = e.key;

    if (key === 'Enter' || (e.altKey && (key === 'Delete' || key === 'Backspace'))) {
      e.preventDefault();
      self.clear();
    }
  };

  // Checks the contents of the base element (presumably an input field) for empty
  this.checkContents = function () {
    const text = self.element.val();
    if (!text || !text.length) {
      this.xButton.addClass('is-empty');
    } else {
      this.xButton.removeClass('is-empty');
    }

    this.element.trigger('contents-checked');
  };

  // Add the button to field parent
  this.xButton.insertAfter(self.element);
  this.xButton[0].tabIndex = 0;
  this.xButton[0].setAttribute('focusable', true);

  // Handle Events
  this.xButton
    .off([
      `click.${COMPONENT_NAME}`,
      `keydown.${COMPONENT_NAME}`
    ].join(' '))
    .on('click.clearable', this.clear)
    .on('keydown.clearable', this.handleKeydown);

  const elemEvents = [
    `blur.${COMPONENT_NAME}`,
    `change.${COMPONENT_NAME}`,
    `keyup.${COMPONENT_NAME}`
  ].join(' ');

  this.element
    .off(elemEvents)
    .on(elemEvents, () => {
      self.checkContents();
    });

  // Set initial state
  this.checkContents();
};

/**
 * Replacement for String.fromCharCode() that takes meta keys into account when determining which
 * @private
 * character key was pressed.
 * @param {jQuery.Event} e jQuery-wrapped `keypress` event
 * @returns {string} text tcharacter
 */
utils.actualChar = function (e) {
  let key = e.which;
  let character = '';
  const toAscii = {
    188: '44',
    // '109': '45', // changes "m" to "-" when using keypress
    190: '46',
    191: '47',
    192: '96',
    220: '92',
    222: '39',
    221: '93',
    219: '91',
    173: '45',
    187: '61', // IE Key codes
    186: '59', // IE Key codes
    189: '45' // IE Key codes
  };
  const shiftUps = {
    96: '~',
    49: '!',
    50: '@',
    51: '#',
    52: '$',
    53: '%',
    54: '^',
    55: '&',
    56: '*',
    57: '(',
    48: ')',
    45: '_',
    61: '+',
    91: '{',
    93: '}',
    92: '|',
    59: ':',
    37: '%',
    38: '&',
    39: '"',
    44: '<',
    46: '>',
    47: '?'
  };

  // Normalize weird keycodes
  if (Object.prototype.hasOwnProperty.call(toAscii, key)) {
    key = toAscii[key];
  }

  // Handle Numpad keys
  if (key >= 96 && key <= 105) {
    key -= 48;
  }

  // Convert Keycode to Character String
  if (!e.shiftKey && (key >= 65 && key <= 90)) {
    character = String.fromCharCode(key + 32);
  } else if (!e.shiftKey && (key >= 37 && key <= 40)) { // arrow keys
    character = '';
  } else if (e.shiftKey &&
    Object.prototype.hasOwnProperty.call(shiftUps, key)) { // User was pressing Shift + any key
    character = shiftUps[key];
  } else {
    character = String.fromCharCode(key);
  }

  return character;
};

/**
 * Get the actualy typed key from the event.
 * @private
 * @param  {object} e The event to check for the key.
 * @returns {string} The actual key typed.
 */
$.actualChar = function (e) {
  return utils.actualChar(e);
};

/**
 * Equate two values quickly in a truthy fashion
 * @private
 * @param {any} a first value
 * @param {any} b second value
 * @returns {boolean} whether the two items compare in a truthy fashion.
 */
utils.equals = function equals(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
};

/**
 * Converts an element wrapped in a jQuery collection down to its original HTMLElement reference.
 * If an HTMLElement is passed in, simply returns it.
 * If anything besides HTMLElements or jQuery[] is passed in, returns undefined;
 * @private
 * @param {any} item the item being evaluated
 * @returns {HTMLElement|undefined} the unwrapped item, or nothing.
 */
DOM.convertToHTMLElement = function convertToHTMLElement(item) {
  if (item instanceof HTMLElement) {
    return item;
  }

  if (item instanceof $) {
    if (item.length) {
      item = item[0];
    } else {
      item = undefined;
    }
    return item;
  }

  return undefined;
};

/**
 * Returns a list of all focusable elements contained within the current element.
 * Somewhat lifted from https://gomakethings.com/how-to-get-the-first-and-last-focusable-elements-in-the-dom/
 * @param {HTMLElement} el the element to search.
 * @returns {array} containing the focusable elements.
 */
DOM.focusableElems = function focusableElems(el) {
  const focusableElemSelector = [
    'button',
    '[href]',
    'input',
    'select',
    'textarea',
    '[focusable]:not([focusable="false"])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
    'iframe'
  ];
  const elems = el.querySelectorAll(focusableElemSelector.join(', '));
  const arrElems = utils.getArrayFromList(elems);
  return arrElems.filter((elem) => {
    if (elem.tagName.toLowerCase() === 'use') {
      return false;
    }
    return true;
  });
};

/**
 * See if the object is simple or more complex (has a constructor).
 * @param {object} obj The object to check
 * @returns {boolean} Returns true if simple
 */
utils.isPlainObject = function isPlainObject(obj) {
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
    return false;
  }

  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  const proto = Object.getPrototypeOf(obj);
  if (!proto) {
    return true;
  }

  return obj !== null && typeof (obj) === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
};

/**
 * Object deep copy and merge. Replaces jQuery.extend without the true option.
 * @param {boolean|object} deep For a deep extend, set the first argument to `true`.
 * @returns {object} The merged object
 */
utils.extend = function extend() {
  // Variables
  const extended = {};
  let deep = false;
  let i = 0;

  // Check if a deep merge
  if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') { //eslint-disable-line
    deep = arguments[0]; //eslint-disable-line
    i++;
  }

  // Merge the object into the extended object
  const merge = function (obj) {
    for (let prop in obj) { //eslint-disable-line
      if (obj.hasOwnProperty(prop)) { //eslint-disable-line
        // If property is an object, merge properties - in several ways
        if (obj[prop] instanceof jQuery) {
          // Needed for now until jQuery is fully dropped
          extended[prop] = $(obj[prop]);
        } else if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          const isPlain = utils.isPlainObject(obj[prop]);
          extended[prop] = isPlain ? extend(extended[prop], obj[prop]) : obj[prop];
        } else {
          extended[prop] = obj[prop] === undefined && extended[prop] !== undefined ?
            extended[prop] : obj[prop];
        }
      }

      // Add functions and jQuery objects
      if (!obj.hasOwnProperty(prop) && !extended[prop] && Object.prototype.toString.call(obj[prop]) === '[object Function]') { //eslint-disable-line
        extended[prop] = obj[prop];
      }
    }
  };

  // Loop through each object and conduct a merge
  for (; i < arguments.length; i++) {
    merge(arguments[i]);  //eslint-disable-line
  }

  return extended;
};

/**
 * Hack for IE11 and SVGs that get moved around/appended at inconvenient times.
 * The action of changing the xlink:href attribute to something else and back will fix the problem.
 * @private
 * @param {HTMLElement} rootElement the base element
 * @returns {void}
 */
utils.fixSVGIcons = function fixSVGIcons(rootElement) {
  if (env.browser.name !== 'ie' && env.browser.version !== '11') {
    return;
  }

  if (rootElement === undefined) {
    return;
  }

  const xlinkNS = 'http://www.w3.org/1999/xlink';

  // Handle jQuery
  if (rootElement instanceof $) {
    if (!rootElement.length) {
      return;
    }

    if (rootElement.length === 1) {
      rootElement = rootElement[0];
    } else {
      rootElement.each((i, elem) => {
        fixSVGIcons(elem);
      });
      return;
    }
  }

  // Handle NodeList in an IE-friendly way
  // https://developer.mozilla.org/en-US/docs/Web/API/NodeList#Example
  if (rootElement instanceof NodeList) {
    Array.prototype.forEach.call(rootElement, (elem) => {
      fixSVGIcons(elem);
    });
    return;
  }

  setTimeout(() => {
    const uses = rootElement.getElementsByTagName('use');
    for (let i = 0; i < uses.length; i++) {
      const attr = uses[i].getAttributeNS(xlinkNS, 'href');
      uses[i].setAttributeNS(xlinkNS, 'href', 'x');
      uses[i].setAttributeNS(xlinkNS, 'href', attr);
    }
  }, 1);
};

/**
 * Gets the current size of the viewport
 * @private
 * @returns {object} width/height of the viewport
 */
utils.getViewportSize = function getViewportSize() {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  };
};

/**
 * Gets the various scrollable containers that an element is nested inside of, and returns
 *  their scrollHeight and scrollLeft values.
 * @private
 * @param {HTMLElement} element the base element to check for containment
 * @returns {object} containing references to the container element and its top/left
 */
utils.getContainerScrollDistance = function getContainerScrollDistance(element) {
  if (!DOM.isElement(element)) {
    return [];
  }

  const containers = [];
  const scrollableElements = [
    '.scrollable', '.scrollable-x', '.scrollable-y', '.modal',
    '.card-content', '.widget-content', '.tab-panel',
    '.datagrid-content'
  ];

  $(element).parents(scrollableElements.join(', ')).each(function () {
    const el = this;

    containers.push({
      element: el,
      left: el.scrollLeft,
      top: el.scrollTop
    });
  });

  // Push the body's scroll area if it's not a "no-scroll" area
  if (!document.body.classList.contains('no-scroll')) {
    containers.push({
      element: document.body,
      left: document.body.scrollLeft,
      top: document.body.scrollTop
    });
  }

  return containers;
};

/**
 * Takes an element that is currently hidden by some means (FX: "display: none;")
 *  and gets its potential dimensions by checking a clone of the element that is NOT hidden.
 * @private
 * @param {HTMLElement|SVGElement|jQuery[]} el The element being manipulated.
 * @param {object} options incoming options.
 * @param {jQuery[]} [parentElement] the parent element where a clone of this
 *  hidden element will be attached.
 * @returns {object} containing various width/height properties of the element provided.
 */
utils.getHiddenSize = function getHiddenSize(el, options) {
  const defaults = {
    dims: { width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 },
    parentElement: undefined,
    includeMargin: false
  };

  if (!DOM.isElement(el)) {
    return defaults.dims;
  }

  el = $(el);
  options = { ...defaults, ...options };

  // element becomes clone and appended to a parentElement, if defined
  const hasDefinedParentElement = DOM.isElement(options.parentElement);
  if (hasDefinedParentElement) {
    el = el.clone().appendTo(options.parentElement);
  }

  const dims = options.dims;
  const hiddenParents = el.parents().add(el);
  const props = {
    transition: 'none',
    webkitTransition: 'none',
    mozTransition: 'none',
    msTransition: 'none',
    visibility: 'hidden',
    display: 'block',
  };
  const oldProps = [];

  hiddenParents.each(function () {
    const old = {};
    const propTypes = Object.keys(props);
    propTypes.forEach((name) => {
      if (this.style[name]) {
        old[name] = this.style[name];
        this.style[name] = props[name];
      }
    });

    oldProps.push(old);
  });

  dims.padding = {
    bottom: el.css('padding-bottom'),
    left: el.css('padding-left'),
    right: el.css('padding-right'),
    top: el.css('padding-top')
  };
  dims.width = el.width();
  dims.outerWidth = el.outerWidth(options.includeMargin);
  dims.innerWidth = el.innerWidth();
  dims.scrollWidth = el[0].scrollWidth;
  dims.height = el.height();
  dims.innerHeight = el.innerHeight();
  dims.outerHeight = el.outerHeight(options.includeMargin);
  dims.scrollHeight = el[0].scrollHeight;

  hiddenParents.each(function (i) {
    const old = oldProps[i];
    const propTypes = Object.keys(props);
    propTypes.forEach((name) => {
      if (old[name]) {
        this.style[name] = old[name];
      }
    });
  });

  // element is ONLY removed when a parentElement is defined because it was cloned.
  if (hasDefinedParentElement) {
    el.remove();
  }

  return dims;
};

/**
 * Binds the Soho Util _getHiddenSize()_ to a jQuery selector
 * @private
 * @param {object} options - incoming options
 * @returns {object} hidden size
 */
$.fn.getHiddenSize = function (options) {
  return utils.getHiddenSize(this, options);
};

/**
 * Checks if a specific input is a String
 * @private
 * @param {any} value an object of unknown type to check
 * @returns {boolean} whether or not a specific input is a String
 */
utils.isString = function isString(value) {
  return typeof value === 'string' || value instanceof String;
};

/**
 * Checks if a specific input is a Number
 * @private
 * @param {any} value an object of unknown type to check
 * @returns {boolean} whether or not a specific input is a Number
 */
utils.isNumber = function isNumber(value) {
  return typeof value === 'number' && value.length === undefined && !isNaN(value);
};

/**
 * Safely changes the position of a text caret inside of an editable element.
 * In most cases, will call "setSelectionRange" on an editable element immediately, but in some
 * cases, will be deferred with `requestAnimationFrame` or `setTimeout`.
 * @private
 * @param {HTMLElement} element the element to get selection
 * @param {number} startPos starting position of the text caret
 * @param {number} endPos ending position of the text caret
 * @returns {void}
 */
utils.safeSetSelection = function safeSetSelection(element, startPos, endPos) {
  // If this text field doesn't support text caret selection, return out
  const compatibleTypes = ['text', 'password', 'search', 'url', 'week', 'month'];
  if (!(element instanceof HTMLInputElement) || compatibleTypes.indexOf(element.type) === -1) {
    return;
  }

  if (startPos && endPos === undefined) {
    endPos = startPos;
  }

  if (document.activeElement === element) {
    if (env.os.name === 'android') {
      defer(() => {
        element.setSelectionRange(startPos, endPos, 'none');
      }, 0);
    } else {
      element.setSelectionRange(startPos, endPos, 'none');
    }
  }
};

/**
 * Checks to see if a variable is valid for containing Soho component options.
 * @private
 * @param {object|function} o an object or function
 * @returns {boolean} whether or not the object type is valid
 */
function isValidOptions(o) {
  return (typeof o === 'object' || typeof o === 'function');
}

/**
 * In some cases, functions are passed to component constructors as the settings argument.
 * This method runs the settings function if it's present and returns the resulting object.
 * @private
 * @param {object|function} o represents settings
 * @returns {object} processed settings
 */
function resolveFunctionBasedSettings(o) {
  if (typeof o === 'function') {
    return o();
  }
  return o;
}

/**
 * Merges various sets of options into a single object,
 * whose intention is to be set as options on a Soho component.
 * @private
 * @param {HTMLElement|SVGElement|jQuery[]} [element] the element to process for inline-settings
 * @param {Object|function} incomingOptions desired settings
 * @param {Object|function} [defaultOptions] optional base settings
 * @returns {object} processed settings
 */
utils.mergeSettings = function mergeSettings(element, incomingOptions, defaultOptions) {
  if (!incomingOptions || !isValidOptions(incomingOptions)) {
    if (isValidOptions(defaultOptions)) {
      incomingOptions = defaultOptions;
    } else {
      incomingOptions = {};
    }
  }

  return utils.extend(
    true,
    {},
    resolveFunctionBasedSettings(defaultOptions),
    resolveFunctionBasedSettings(incomingOptions),
    (element !== undefined ? utils.parseSettings(element) : {})
  );
};

/**
 * Test if a string is Html or not
 * @private
 * @param  {string} string The string to test.
 * @returns {boolean} True if it is html.
 */
utils.isHTML = function (string) {
  return /(<([^>]+)>)/i.test(string);
};

const math = {};

/**
 * Convert `setTimeout/Interval` delay values (CPU ticks) into frames-per-second
 * (FPS) numeric values.
 * @private
 * @param {number} delay CPU Ticks
 * @returns {number} Frames Per Second
 */
math.convertDelayToFPS = function convertDelayToFPS(delay) {
  if (isNaN(delay)) {
    throw new Error('provided delay value is not a number');
  }
  return delay / 16.7;
};

/**
 * Convert `setTimeout/Interval` delay values (CPU ticks) into frames-per-second
 * (FPS) numeric values.
 * @private
 * @param {number} fps (Frames Per Second)
 * @returns {number} delay in CPU ticks
 */
math.convertFPSToDelay = function convertFPSToDelay(fps) {
  if (isNaN(fps)) {
    throw new Error('provided delay value is not a number');
  }
  return fps * 16.7;
};

/**
 *  Determines whether the passed value is a finite number.
 * @private
 * @param {number} value The number
 * @returns {boolean} If it is finite or not.
 */
math.isFinite = function isFinite(value) {
  // 1. If Type(number) is not Number, return false.
  if (typeof value !== 'number') {
    return false;
  }
  // 2. If number is NaN, +∞, or −∞, return false.
  if (value !== value || value === Infinity || value === -Infinity) { //eslint-disable-line
    return false;
  }
  // 3. Otherwise, return true.
  return true;
};

/**
 * `Array.ForEach()`-style method that is also friendly to `NodeList` types.
 * @param {Array|NodeList} array incoming items
 * @param {function} callback the method to run
 * @param {object} scope the context in which to run the method
 */
utils.forEach = function forEach(array, callback, scope) {
  for (let i = 0; i < array.length; i++) {
    callback.call(scope, array[i], i, array); // passes back stuff we need
  }
};

/**
 * Function to check if element has css class
 * @private
 * @param {object} elem The DOM element
 * @param {string} classStr The css class name to check
 * @returns {boolean} true if found given css class
 */
utils.hasClass = function hasClass(elem, classStr) {
  let r = false;
  if (elem) {
    if ('classList' in elem) {
      r = elem.classList.contains(classStr);
    } else {
      const classAttr = elem.getAttribute('class');
      r = classAttr ? classAttr.split(/\s+/).indexOf(classStr) !== -1 : false;
    }
  }
  return r;
};

/**
 * Returns the sign of a number, indicating whether the number is positive, negative or zero
 * @param {number} x A number.
 * @returns {number} A number representing the sign of the given argument. If the argument is a positive number, negative number, positive zero or negative zero, the function will return 1, -1, 0 or -0 respectively. Otherwise, NaN is returned.
 */
math.sign = function (x) {
  if (Math.sign) { // eslint-disable-line compat/compat
    return Math.sign(x); // eslint-disable-line compat/compat
  }

  x = +x;
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
};

/**
 * Convenience method for using `Array.prototype.slice()` on an Array-like object (or an actual array)
 * to make a copy.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Array-like_objects
 * @param {Array|NodeList} listObj an array-like object
 * @returns {array} containing the list in array format.
 */
utils.getArrayFromList = function (listObj) {
  const unboundSlice = Array.prototype.slice;
  return Function.prototype.call.bind(unboundSlice)(listObj);
};

/**
 * Gets the OS scollbar width in pixels.
 * @returns {number} The width as a number.
 */
utils.getScrollbarWidth = function () {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);

  return widthNoScroll - widthWithScroll;
};

/**
 * Create deep copy for given array or object.
 * @param  {array|object} arrayOrObject The array or object to be copied.
 * @returns {array|object} The copied array or object.
 */
utils.deepCopy = function (arrayOrObject) {
  const references = new Map();
  const copy = (input) => {
    if (typeof input !== 'object' || input === null) {
      return input; // Return the value if input is not an object
    }

    // If an object has already been cloned then return a
    // reference to that clone to avoid an infinite loop
    if (references.has(input) === true) {
      return references.get(input);
    }

    // Create an array or object to hold the values
    const output = Array.isArray(input) ? [] : {};
    references.set(arrayOrObject, input);

    Object.keys(input).forEach((key) => {
      const value = input[key];
      // Recursively (deep) copy for nested objects, including arrays
      output[key] = (typeof value === 'object' && value !== null) ? copy(value) : value;
    });
    return output;
  };
  return copy(arrayOrObject);
};

/**
 * Check if given element is within the viewport.
 * @private
 * @param {object} element The element to check
 * @returns {boolean} Whether or not the element is in the viewport.
 */
utils.isInViewport = function isInViewport(element) {
  const b = element.getBoundingClientRect();
  return (
    b.top >= 0 && b.left >= 0 &&
    b.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    b.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export { utils, math };
