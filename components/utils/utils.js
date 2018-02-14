import { defer } from './behaviors';
import { Environment as env } from './environment';

/**
 * Used for changing the stacking order of jQuery events.  This is needed to override certain
 * Events invoked by other plugins http://stackoverflow.com/questions/2360655
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
 * uniqueIdCount is a baseline unique number that will be used when generating
 * uniqueIds for elements and components.
 */
export let uniqueIdCount = 0; // eslint-disable-line

/**
 * Generates a unique ID for an element based on the element's configuration, any
 * Soho components that are generated against it, and provided prefixes/suffixes.
 * @param {string} [className] CSS classname (will be interpreted automatically
 *  if it's not provided)
 * @param {string} [prefix] optional prefix
 * @param {string} [suffix] optional suffix
 * @returns {string} the compiled uniqueID
 */
$.fn.uniqueId = function (className, prefix, suffix) {
  const predefinedId = $(this).attr('id');

  if (predefinedId && $(`#${predefinedId}`).length < 2) {
    return predefinedId;
  }

  prefix = (!prefix ? '' : `${prefix}-`);
  suffix = (!suffix ? '' : `-${suffix}`);
  className = (!className ? $(this).attr('class') : className);

  const str = prefix + className + uniqueIdCount + suffix;
  uniqueIdCount += 1;
  return str;
};

/**
 * Detect whether or not a text string represents a valid CSS property.  This check
 * includes an attempt at checking for vendor-prefixed versions of the CSS property
 * provided.
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
    !$(element).parents().addBack().filter(function () {
      return $.css(this, 'visibility') === 'hidden';
    }).length;
}

/**
 * From jQueryUI Core: https://github.com/jquery/jquery-ui/blob/24756a978a977d7abbef5e5bce403837a01d964f/ui/jquery.ui.core.js#L93
 * Adapted from:  http://stackoverflow.com/questions/7668525/is-there-a-jquery-selector-to-get-all-elements-that-can-get-focus
 * Adds the ':focusable' selector to Sizzle to allow for the selection of elements
 * that can currently be focused.
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
 * Custom Touch Event Handler that simply passes Touch Event Handlers onto a Click Event Handler.
 * Used for avoiding the 300ms wait time that click events have in most mobile environments
 * if 'one' is defined, it only listens once.
 * @param {string} eventNamespace a namespace that can be used for routing
 *  touch events for a particular purpose to click events.
 * @param {string} [filter] adds an additional selector (in similar fashion to jQuery) that
 *  will be used to filter results down to a specific subset.
 * @param {boolean} [one] sets up touch events as `one` instead of `on`.
 * @returns {this} component elements
 */
$.fn.onTouchClick = function (eventNamespace, filter, one) {
  eventNamespace = (eventNamespace !== null || eventNamespace !== undefined ? `.${eventNamespace}` : '');
  filter = (filter !== null || filter !== undefined ? filter : '');

  return this.each(function () {
    const self = $(this);
    const listener = one ? 'one' : 'on';
    const threshold = 10;
    let thresholdReached = false;
    let pos;

    self[listener](`touchstart${eventNamespace}`, filter, (e) => {
      pos = {
        x: e.originalEvent.touches[0].pageX,
        y: e.originalEvent.touches[0].pageY
      };
    });

    self[listener](`touchmove${eventNamespace}`, filter, (e) => {
      const newPos = {
        x: e.originalEvent.touches[0].pageX,
        y: e.originalEvent.touches[0].pageY
      };

      if ((newPos.x >= pos.x + threshold) || (newPos.x <= pos.x - threshold) ||
          (newPos.y >= pos.y + threshold) || (newPos.y <= pos.y - threshold)) {
        thresholdReached = true;
      }
    });

    self[listener](`touchend${eventNamespace} touchcancel${eventNamespace}`, filter, function handleTouches(e) {
      const elem = $(this);
      if (thresholdReached) {
        thresholdReached = false;
        return;
      }

      setTimeout(() => {
        thresholdReached = false;
        e.preventDefault();

        if (elem.attr('disabled')) {
          return;
        }

        elem.trigger('click');
      }, 0);
    });

    return self;
  });
};

/**
 * Reverses the .onTouchClick() method and turns off a matching event listener.
 * @param {string} eventNamespace a namespace that can be used for routing
 *  touch events for a particular purpose to click events.
 * @param {string} [filter] adds an additional selector (in similar fashion to jQuery) that
 *  will be used to filter results down to a specific subset.
 * @returns {this} component elements
 */
$.fn.offTouchClick = function (eventNamespace, filter) {
  eventNamespace = (eventNamespace !== null || eventNamespace !== undefined ? `.${eventNamespace}` : '');
  filter = (filter !== null || filter !== undefined ? filter : '');

  return this.each(function () {
    return $(this).off(`touchend${eventNamespace} touchcancel${eventNamespace} touchstart${eventNamespace} touchmove${eventNamespace}`, filter);
  });
};

/**
 * Returns a key/value list of currently attached event listeners
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
 * Grabs an attribute from an HTMLElement containing stringified JSON syntax,
 * and interprets it into options.
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
 * Deprecate `utils.parseOptions` in favor of `utils.parseSettings`
 * @deprecated
 * TODO: Remove in 4.4.1 ?
 */
utils.parseOptions = utils.parseSettings;

/**
* jQuery Behavior Wrapper for `utils.parseOptions`.
* @deprecated
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
 * Timer - can be used for play/pause or stop for given time.
 * Use as new instance [ var timer = new $.fn.timer(function() {}, 6000); ]
 * then can be listen events as:
 * [ $(timer.event).on('update', function(e, data){console.log(data.counter)}); ]
 * or can access as [ timer.cancel(); -or- timer.pause(); -or- timer.resume(); ]
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
 * Escapes HTML, replacing special characters with encoded symbols.
 * @param {string} value HTML in string form
 * @returns {string} the modified value
 */
$.escapeHTML = function (value) {
  let newValue = value;
  if (typeof value === 'string') {
    newValue = newValue.replace(/&/g, '&amp;');
    newValue = newValue.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  return newValue;
};

/**
 * Un-escapes HTML, replacing encoded symbols with special characters.
 * @param {string} value HTML in string form
 * @returns {string} the modified value
 */
$.unescapeHTML = function (value) {
  let newValue = value;
  if (typeof value === 'string') {
    newValue = newValue.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    newValue = newValue.replace(/&amp;/g, '&');
  }
  return newValue;
};

/**
 * Remove Script tags and all onXXX functions
 * @param {string} html HTML in string form
 * @returns {string} the modified value
 */
$.sanitizeHTML = function (html) {
  let santizedHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '');
  santizedHtml = santizedHtml.replace(/<[^>]+/g, match => match.replace(/(\/|\s)on\w+=(\'|")?[^"]*(\'|")?/g, '')); // eslint-disable-line

  return santizedHtml;
};

/**
 * Clearable (Shows an X to clear)
 */
$.fn.clearable = function () {
  const self = this;
  this.element = $(this);

  // Create an X icon button styles in icons.scss
  this.xButton = $.createIconElement({ classes: 'close is-empty', icon: 'close' }).icon();

  // Create a function
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

  // Handle Events
  this.xButton.offTouchClick('clearable').off()
    .onTouchClick('clearable', '.clearable')
    .on('click.clearable', () => {
      self.element.val('').trigger('change').focus().trigger('cleared');
      self.checkContents();
    });

  this.element.on('change.clearable, blur.clearable, keyup.clearable', () => {
    self.checkContents();
  });

  // Set initial state
  this.checkContents();
};

/**
 * Replacement for String.fromCharCode() that takes meta keys into account when determining which
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
  if (key >= 96 && key <= 105 &&
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].indexOf(String.fromCharCode(key)) === -1) {
    key -= 48;
  }

  // Convert Keycode to Character String
  if (!e.shiftKey && (key >= 65 && key <= 90)) {
    character = String.fromCharCode(key + 32);
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
 * @param  {object} e The event to check for the key.
 * @returns {string} The actual key typed.
 */
$.actualChar = function (e) {
  return utils.actualChar(e);
};

/**
 * Equate two values quickly in a truthy fashion
 * @param {any} a first value
 * @param {any} b second value
 * @returns {boolean} whether the two items compare in a truthy fashion.
 */
utils.equals = function equals(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
};

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

/**
 * Converts an element wrapped in a jQuery collection down to its original HTMLElement reference.
 * If an HTMLElement is passed in, simply returns it.
 * If anything besides HTMLElements or jQuery[] is passed in, returns undefined;
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
 * Object deep copy
 * For now, alias jQuery.extend
 * Eventually we'll replace this with a non-jQuery extend method.
 */
utils.extend = $.extend;

/**
 * Hack for IE11 and SVGs that get moved around/appended at inconvenient times.
 * The action of changing the xlink:href attribute to something else and back will fix the problem.
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

  if (rootElement instanceof $) {
    if (!rootElement.length) {
      return;
    }

    rootElement = rootElement[0];
  }

  setTimeout(() => {
    const uses = rootElement.getElementsByTagName('use');
    for (let i = 0; i < uses.length; i++) {
      const attr = uses[i].getAttribute('xlink:href');
      uses[i].setAttribute('xlink:href', 'x');
      uses[i].setAttribute('xlink:href', attr);
    }
  }, 1);
};

/**
 * Gets the current size of the viewport
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
 * @param {HTMLElement|SVGElement|jQuery[]} el The element being manipulated.
 * @param {object} options incoming options.
 * @param {jQuery[]} [parentElement=undefined] the parent element where a clone of this
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
  options = $.extend({}, defaults, options);

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
 * @param {object} options - incoming options
 * @returns {object} hidden size
 */
$.fn.getHiddenSize = function (options) {
  return utils.getHiddenSize(this, options);
};

/**
 * Checks if a specific input is a String
 * @param {any} value an object of unknown type to check
 * @returns {boolean} whether or not a specific input is a String
 */
utils.isString = function isString(value) {
  return typeof value === 'string' || value instanceof String;
};

/**
 * Checks if a specific input is a Number
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
 * @param {HTMLElement} element the element to get selection
 * @param {number} startPos starting position of the text caret
 * @param {number} endPos ending position of the text caret
 */
utils.safeSetSelection = function safeSetSelection(element, startPos, endPos) {
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

  // Actually get ready to merge incoming options if we get to this point.
  return utils.extend(
    true, {},
    resolveFunctionBasedSettings(defaultOptions || {}),
    resolveFunctionBasedSettings(incomingOptions),
    (element !== undefined ? utils.parseSettings(element) : {})
  ); // possible to run this without an element present -- will simply skip this part
};

/**
 * Test if a string is Html or not
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
 * @param {number} fps (Frames Per Second)
 * @returns {number} delay in CPU ticks
 */
math.convertFPSToDelay = function convertFPSToDelay(fps) {
  if (isNaN(fps)) {
    throw new Error('provided delay value is not a number');
  }
  return fps * 16.7;
};

export { utils, DOM, math };
