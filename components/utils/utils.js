/**
 * Transition Support Check
 * Returns the vendor-prefixed name of the 'transition' property available by the browser.
 * If the browser doesn't support transitions, it returns null.
 * @private
 */

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
  window.Soho.utils = {};
  window.Soho.DOM = {};

  // Used for changing the stacking order of jQuery events.  This is needed to override certain
  // Events invoked by other plugins http://stackoverflow.com/questions/2360655
  $.fn.bindFirst = function(name, fn) {
    this.on(name, fn);
    this.each(function() {
        var handlers = $._data(this, 'events')[name.split('.')[0]];
        // take out the handler we just inserted from the end
        var handler = handlers.pop();
        // move it at the beginning
        handlers.splice(0, 0, handler);
    });
  };

  function visible(element) {
    return $.expr.filters.visible( element ) &&
      !$(element).parents().addBack().filter(function() {
        return $.css(this, 'visibility') === 'hidden';
      }).length;
  }

  //Get a unique ID
  window.Soho.uniqueIdCount = 0;
  $.fn.uniqueId = function(className, prefix, suffix) {
    var predefinedId = $(this).attr('id');

    if (predefinedId && $('#' + predefinedId).length < 2) {
      return predefinedId;
    }

    prefix = (!prefix ? '' : prefix + '-');
    suffix = (!suffix ? '' : '-' + suffix);
    className = (!className ? $(this).attr('class') : className);

    var str = prefix + className + Soho.uniqueIdCount + suffix;
    Soho.uniqueIdCount = Soho.uniqueIdCount + 1;
    return str;
  };

  // Check for CSS Property Support in a cross browser way
  $.fn.cssPropSupport = function(prop) {
    'use strict';

    if (!prop) {
      return null;
    }

    var el = $('<div></div>')[0],
      propStr = prop.toString(),
      prefixes = ['Moz', 'Webkit', 'O', 'ms'],
      prop_ = propStr.charAt(0).toUpperCase() + propStr.substr(1);

    if (prop in el.style) {
      $(el).remove();
      return prop;
    }

    for (var i = 0; i < prefixes.length; i++) {
      var vendorProp = prefixes[i] + prop_;
      if (vendorProp in el.style) {
        $(el).remove();
        return vendorProp;
      }
    }

    $(el).remove();
    return null;
  };

  // Returns the name of the TransitionEnd event.
  $.fn.transitionEndName = function() {
    var prop = $.fn.cssPropSupport('transition'),
      eventNames = {
        'WebkitTransition' :'webkitTransitionEnd',
        'MozTransition'    :'transitionend',
        'MSTransition'     :'msTransitionEnd',
        'OTransition'      :'oTransitionEnd',
        'transition'       :'transitionend'
      };

    return eventNames[prop] || null;
  };

  // From jQueryUI Core: https://github.com/jquery/jquery-ui/blob/24756a978a977d7abbef5e5bce403837a01d964f/ui/jquery.ui.core.js#L93
  // Adapted from:  http://stackoverflow.com/questions/7668525/is-there-a-jquery-selector-to-get-all-elements-that-can-get-focus
  // Adds the ':focusable' selector to Sizzle to allow for the selection of elements that can currently be focused.
  function focusable(element) {
    var map, mapName, img,
      nodeName = element.nodeName.toLowerCase(),
      isTabIndexNotNaN = !isNaN($.attr(element, 'tabindex'));

    if ('area' === nodeName) {
      map = element.parentNode;
      mapName = map.name;
      if (!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
        return false;
      }
      img = $('img[usemap=#' + mapName + ']')[0];
      return !!img && visible(img);
    }

    return (/input|select|textarea|button|object/.test(nodeName) ?
      !element.disabled :
      'a' === nodeName ?
        element.href || isTabIndexNotNaN :
        isTabIndexNotNaN) &&
      // the element and all of its ancestors must be visible
      visible( element );
  }

  $.extend($.expr[':'], {
    focusable: function(element) {
      return focusable(element, !isNaN($.attr(element, 'tabindex')));
    }
  });

  // Custom Touch Event Handler that simply passes Touch Event Handlers onto a Click Event Handler.
  // Used for avoiding the 300ms wait time that click events have in most mobile environments
  // if 'one' is defined, it only listens once.
  $.fn.onTouchClick = function(eventNamespace, filter, one) {
    eventNamespace = (eventNamespace !== null || eventNamespace !== undefined ? '.' + eventNamespace : '');
    filter = (filter !== null || filter !== undefined ? filter : '');

    return this.each(function() {
      var self = $(this),
        listener = one ? 'one' : 'on',
        threshold = 10,
        thresholdReached = false,
        pos;

     self[listener]('touchstart' + eventNamespace, filter, function handleMove(e) {
        pos = {
          x: e.originalEvent.touches[0].pageX,
          y: e.originalEvent.touches[0].pageY
        };
      });

      self[listener]('touchmove' + eventNamespace, filter, function handleMove(e) {
        var newPos;
        newPos = {
          x: e.originalEvent.touches[0].pageX,
          y: e.originalEvent.touches[0].pageY
        };

        if ((newPos.x >= pos.x + threshold) || (newPos.x <= pos.x - threshold) ||
            (newPos.y >= pos.y + threshold) || (newPos.y <= pos.y - threshold)) {
          thresholdReached = true;
        }
      });

      self[listener]('touchend' + eventNamespace + ' touchcancel' + eventNamespace, filter, function handleTouches(e) {
        var elem = $(this);
        if (thresholdReached) {
          thresholdReached = false;
          return;
        }

        setTimeout(function(){
          thresholdReached = false;
          e.preventDefault();

          if (elem.attr('disabled')) {
            return;
          }

          elem.trigger('click');
        }, 0);

        return false;
      });

      return self;
    });
  };

  // Reverses the .onTouchClick() method and turns off a matching event listener
  $.fn.offTouchClick = function(eventNamespace, filter) {
    eventNamespace = (eventNamespace !== null || eventNamespace !== undefined ? '.' + eventNamespace : '');
    filter = (filter !== null || filter !== undefined ? filter : '');

    return this.each(function() {
      return $(this).off('touchend' + eventNamespace + ' touchcancel' + eventNamespace + ' touchstart' + eventNamespace + ' touchmove' + eventNamespace, filter);
    });
  };

  // Returns a key/value list of currently attached event listeners
  $.fn.listEvents = function() {
    var data = {};

    this.each(function() {
      data = $._data(this, 'events');
    });

    return data;
  };

  // Implements consistent support for the placeholder attribute in browsers that do not handle it
  // ** Supports any kind of input (no issues with password) and textarea
  // ** does nothing if native support exists
  $.fn.placeholderPolyfill = function(options) {
    if (!('placeholder' in document.createElement('input'))) {
      var settings = $.extend({className: 'is-placeholder'}, options),
        setInputType = function (input, type, opt) {
          if(opt) {
            input.attr('type', type);
          }
        };
      $('[placeholder]').each(function() {
        var input = $(this),
        isPassword = input.is('input[type="password"]');
        input.removeClass(settings.className).on('focus.placeholderPolyfill, click.placeholderPolyfill', function() {
          if (input.val() === input.attr('placeholder') && input.data('placeholder')) {
            input.get(0).setSelectionRange(0, 0);
          }
        }).on('keydown.placeholderPolyfill', function() {
          setInputType(input, 'password', isPassword);
          if (input.val() === input.attr('placeholder') && input.data('placeholder')) {
            input.val('');
            input.removeClass(settings.className);
          }
        }).on('blur.placeholderPolyfill', function() {
          if (input.val() === '') {
            setInputType(input, 'text', isPassword);
            input.addClass(settings.className);
            input.val(input.attr('placeholder'));
            input.data('placeholder', true);
          } else {
            input.data('placeholder', false);
          }
        }).trigger('blur.placeholderPolyfill').parents('form').on('submit', function() {
          $('[placeholder]', this).each(function () {
            var field = $(this);
            if (field.val() === field.attr('placeholder') && field.data('placeholder')) {
              field.val('');
            }
          });
        });
      });
    }
   return this;
  };


  /**
   * Grabs an attribute from an HTMLElement containing stringified JSON syntax, and interprets it into options.
   * @param {HTMLElement} element
   * @param {String} [attr]
   * @returns {Object}
   */
  window.Soho.utils.parseOptions = function parseOptions(element, attr) {
    var options = {};
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

    var str = element.getAttribute(attr);
    if (!str || typeof str !== 'string' || str.indexOf('{') === -1) {
      return options;
    }

    // replace single to double quotes, since single-quotes may be necessary
    // due to entry in markup.
    function replaceDoubleQuotes(str) {
      return str.replace(/'/g, '"');
    }

    // Manually parse a string more in-depth
    function manualParse(str) {
      var regex = /({|,)(?:\s*)(?:')?([A-Za-z_$\.][A-Za-z0-9_ \-\.$]*)(?:')?(?:\s*):/g; //get keys
      str = str.replace(regex, '$1\"$2\":'); //add double quotes to keys
      regex = /:(?:\s*)(?!(true|false|null|undefined))([A-Za-z_$\.#][A-Za-z0-9_ \-\.$]*)/g; //get strings in values
      str = str.replace(regex, ':\"$2\"'); //add double quotes to strings in values
      str = replaceDoubleQuotes(str);
      return str;
    }

    try {
      options = JSON.parse(replaceDoubleQuotes(str));
    } catch(err) {
      options = JSON.parse(manualParse(str));
    }

    return options;
  };

  /**
   * jQuery Behavior Wrapper for `Soho.utils.parseOptions`.
   * @deprecated
   * @param {String} [attrName]
   * @return {Object|Object[]}
   */
  $.fn.parseOptions = function(element, attr) {
    var results = [],
      isCalledDirectly = (element instanceof HTMLElement || element instanceof SVGElement || element instanceof $),
      targets = this;

    if (isCalledDirectly) {
      targets = $(element);
    } else {
      attr = element;
      element = undefined;
    }

    targets.each(function(i, item) {
      results.push({
        element: this,
        options: Soho.utils.parseOptions(item, attr)
      });
    });

    if (results.length === 1) {
      return results[0].options;
    }
    return results;
  };

  // Timer - can be use for play/pause or stop for given time
  // use as new instance [ var timer = new $.fn.timer(function() {}, 6000); ]
  // then can be listen events as [ $(timer.event).on('update', function(e, data){console.log(data.counter)}); ]
  // or can access as [ timer.cancel(); -or- timer.pause(); -or- timer.resume(); ]
  $.fn.timer = function(callback, delay) {

    var self = $(this),
      interval,
      speed = 10,
      counter = 0,
      cancel = function() {
        self.triggerHandler('cancel');
        clearInterval(interval);
        counter = 0;
      },
      pause = function() {
        self.triggerHandler('pause');
        clearInterval(interval);
      },
      update = function() {
        interval = setInterval(function() {
          counter += speed;
          self.triggerHandler('update', [{'counter': counter}]);
          if (counter > delay) {
            self.triggerHandler('timeout');
            callback.apply(arguments);
            clearInterval(interval);
            counter = 0;
          }
        }, speed);
      },
      resume = function() {
        self.triggerHandler('resume');
        update();
      };

      update();

    return {
      event: this,
      cancel: cancel,
      pause: pause,
      resume: resume
    };
  };

  // Copies a string to the clipboard. Must be called from within an event handler such as click.
  // May return false if it failed, but this is not always
  // possible. Browser support for Chrome 43+, Firefox 42+, Edge and IE 10+.
  // No Safari support, as of (Nov. 2015). Returns false.
  // IE: The clipboard feature may be disabled by an adminstrator. By default a prompt is
  // shown the first time the clipboard is used (per session).
  $.copyToClipboard = function(text) {
    if (window.clipboardData && window.clipboardData.setData) {
      // IE specific code path to prevent textarea being shown while dialog is visible.
      return window.clipboardData.setData('Text', text);
    }
    else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      var textarea = document.createElement('textarea');
      textarea.textContent = text;
      textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(textarea);
      textarea.select();
      try {
        return document.execCommand('copy'); // Security exception may be thrown by some browsers.
      }
      catch (ex) {
        // console.warn('Copy to clipboard failed.', ex);
        return false;
      }
      finally {
        document.body.removeChild(textarea);
      }
    }
  };

  //Functions For Sanitising and Escaping Html
  $.escapeHTML = function(value) {
    var newValue = value;
    if (typeof value === 'string') {
      newValue = newValue.replace(/&/g, '&amp;');
      newValue = newValue.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return newValue;
  };

  $.unescapeHTML = function(value) {
    var newValue = value;
    if (typeof value === 'string') {
      newValue = newValue.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      newValue = newValue.replace(/&amp;/g, '&');
    }
    return newValue;
  };

  //Remove Script tags and all onXXX functions
  $.sanitizeHTML = function(html) {
    var santizedHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '');
    santizedHtml = santizedHtml.replace(/<[^>]+/g, function(match) {
      return match.replace(/(\/|\s)on\w+=(\'|")?[^"]*(\'|")?/g, '');
    });

    return santizedHtml;
  };


  //Clearable (Shows an X to clear)
  $.fn.clearable = function() {
    var self = this;
    this.element = $(this);

    //Create an X icon button styles in icons.scss
    this.xButton = $.createIconElement({ classes: 'close is-empty', icon: 'close' }).icon();

    //Create a function
    this.checkContents = function () {
      var text = self.element.val();
      if (!text || !text.length) {
        this.xButton.addClass('is-empty');
      } else {
        this.xButton.removeClass('is-empty');
      }

      this.element.trigger('contents-checked');
    };

    //Add the button to field parent
    this.xButton.insertAfter(self.element);

    //Handle Events
    this.xButton.offTouchClick('clearable').off()
      .onTouchClick('clearable', '.clearable')
      .on('click.clearable', function handleClear() {
        self.element.val('').trigger('change').focus().trigger('cleared');
        self.checkContents();
      });

    this.element.on('change.clearable, blur.clearable, keyup.clearable', function () {
      self.checkContents();
    });

    //Set initial state
    this.checkContents();
  };

  // Replacement for String.fromCharCode() that takes meta keys into account when determining which
  // character key was pressed.
  window.Soho.utils.actualChar = function(e) {
    var key = e.which,
      character = '',
      toAscii = {
        '188': '44',
        //'109': '45', // changes "m" to "-" when using keypress
        '190': '46',
        '191': '47',
        '192': '96',
        '220': '92',
        '222': '39',
        '221': '93',
        '219': '91',
        '173': '45',
        '187': '61', //IE Key codes
        '186': '59', //IE Key codes
        '189': '45'  //IE Key codes
      },
      shiftUps = {
        '96': '~',
        '49': '!',
        '50': '@',
        '51': '#',
        '52': '$',
        '53': '%',
        '54': '^',
        '55': '&',
        '56': '*',
        '57': '(',
        '48': ')',
        '45': '_',
        '61': '+',
        '91': '{',
        '93': '}',
        '92': '|',
        '59': ':',
        '37': '%',
        '38': '&',
        '39': '\"',
        '44': '<',
        '46': '>',
        '47': '?'
      };

    // Normalize weird keycodes
    if (toAscii.hasOwnProperty(key)) {
      key = toAscii[key];
    }

    // Handle Numpad keys
    if (key >= 96 && key <= 105) {
      key -= 48;
    }

    // Convert Keycode to Character String
    if (!e.shiftKey && (key >= 65 && key <= 90)) {
      character = String.fromCharCode(key + 32);
    } else if (e.shiftKey && shiftUps.hasOwnProperty(key)) { // User was pressing Shift + any key
      character = shiftUps[key];
    } else {
      character = String.fromCharCode(key);
    }

    return character;
  };

  $.actualChar = function(e) {
    return Soho.utils.actualChar(e);
  };

  window.Soho.utils.equals = function equals(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // Returns an array containing an element's attributes.
  window.Soho.DOM.getAttributes = function getAttributes(element) {
    if (!element || (!(element instanceof HTMLElement) && !(element instanceof SVGElement))) {
      return;
    }

    return element.attributes;
  };

  //Adding, removing, and testing for classes
  window.Soho.DOM.classNameExists = function classNameExists(element) {
    var cn = element.className;
    return cn && cn.length > 0;
  };

  window.Soho.DOM.classNameHas = function has(classNameString, targetContents) {
    return classNameString.indexOf(targetContents) > -1;
  };

  window.Soho.DOM.hasClass = function hasClass (el, className) {
    return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
	};

  window.Soho.DOM.addClass = function addClass(el, className) {
     if (el.classList) {
      el.classList.add(className);
    } else if (!window.Soho.DOM.hasClass(el, className)) {
      el.className += ' ' + className;
    }
  };

  /**
   * Checks if an element is valid
   * @param {HTMLElement|SVGElement|jQuery[]} el - The element being checked
   * @returns {boolean} - represents all values normally contained by a DOMRect or ClientRect
   */
  window.Soho.DOM.isElement = function isElement(el) {
    if ((el instanceof HTMLElement) || (el instanceof SVGElement) || (el instanceof $ && el.length)) {
      return true;
    }
    return false;
  };

  /**
   * Runs the generic _getBoundingClientRect()_ method on an element, but returns its results
   * as a plain object instead of a ClientRect
   * @param {HTMLElement|SVGElement|jQuery[]} el - The element being manipulated
   * @returns {object} - represents all values normally contained by a DOMRect or ClientRect
   */
  window.Soho.DOM.getDimensions = function getDimensions(el) {
    if (!Soho.DOM.isElement(el)) {
      return {};
    }

    if (el instanceof $) {
      if (!el.length) {
        return {};
      }

      el = el[0];
    }

    var rect = el.getBoundingClientRect(),
      rectObj = {};
    for (var prop in rect) {
      if (!isNaN(rect[prop])) {
        rectObj[prop] = rect[prop];
      }
    }
    return rectObj;
  };

  // Debounce method
  window.Soho.utils.debounce = function(func, threshold, execAsap) {
    var timeout;

    return function debounced () {
      var obj = this, args = arguments;
      function delayed () {
        if (!execAsap) {
          func.apply(obj, args);
        }
        timeout = null;
      }

      if (timeout) {
        clearTimeout(timeout);
      } else if (execAsap) {
        func.apply(obj, args);
      }

      timeout = setTimeout(delayed, threshold || 250);
    };
  };

  // Debounced Resize method
  // https://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/
  (function($,sr){
    // smartresize
    $.fn[sr] = function(fn){  return fn ? this.bind('resize', Soho.utils.debounce(fn)) : this.trigger(sr); };
  })($, 'debouncedResize');

  // String parsing utils
  window.Soho.string = {};

  /**
   * The splice() method changes the content of a string by removing a range of
   * characters and/or adding new characters.
   *
   * @param {String} str The string that will be manipulated.
   * @param {number} start Index at which to start changing the string.
   * @param {number} delCount An integer indicating the number of old chars to remove.
   * @param {string} newSubStr The String that is spliced in.
   * @return {string} A new string with the spliced substring.
   */
  window.Soho.string.splice = function splice(str, start, delCount, newSubStr) {
    return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));
  };


  /**
   * Takes a string with possible duplicate characters and returns a string
   * containing ALL unique characters.  Useful for construction of REGEX objects
   * with characters from an input field, etc.
   */
  window.Soho.string.removeDuplicates = function removeDuplicates(str) {
    return str
      .split('')
      .filter(function(item, pos, self) {
        return self.indexOf(item) === pos;
      })
      .join('');
  };


  /**
   * Object deep copy
   * For now, alias jQuery.extend
   * Eventually we'll replace this with a non-jQuery extend method.
   */
  window.Soho.utils.extend = $.extend;


  /**
   * Hack for IE11 and SVGs that get moved around/appended at inconvenient times.
   * The action of changing the xlink:href attribute to something else and back will fix the problem.
   * @return {undefined}
   */
  window.Soho.utils.fixSVGIcons = function fixSVGIcons(rootElement) {
    if (Soho.env.browser.name !== 'ie' && Soho.env.browser.version !== '11') {
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

    setTimeout(function () {
      var uses = rootElement.getElementsByTagName('use');
      for (var i = 0; i < uses.length; i++) {
        var attr = uses[i].getAttribute('xlink:href');
        uses[i].setAttribute('xlink:href', 'x');
        uses[i].setAttribute('xlink:href', attr);
      }
    }, 1);
  };

  /**
   * Gets the current size of the viewport
   * @returns {object}
   */
  window.Soho.utils.getViewportSize = function getViewportSize() {
    return {
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    };
  };

  /**
   * Gets the various scrollable containers that an element is nested inside of, and returns their scrollHeight and scrollLeft values.
   * @returns {object[]}
   */
  window.Soho.utils.getContainerScrollDistance = function getContainerScrollDistance(element) {
    if (!Soho.DOM.isElement(element)) {
      return [];
    }

    var containers = [],
      scrollableElements = [
        '.scrollable', '.scrollable-x', '.scrollable-y', '.modal',
        '.card-content', '.widget-content', '.tab-panel',
        '.datagrid-content'
      ];

    $(element).parents(scrollableElements.join(', ')).each(function() {
      var el = this;

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
   * Takes an element that is currently hidden by some means (FX: "display: none;") and gets its potential dimensions by checking a clone of the element that is NOT hidden.
   * @param {HTMLElement|SVGElement|jQuery[]} el - The element being manipulated.
   * @param {object} options - incoming options.
   * @param {jQuery[]} [parentElement=undefined] - the parent element where a clone of this hidden element will be attached.
   * @returns {object}
   */
  window.Soho.utils.getHiddenSize = function getHiddenSize(el, options) {
    var defaults = {
      dims: { width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 },
      parentElement: undefined,
      includeMargin: false
    };

    if (!Soho.DOM.isElement(el)) {
      return defaults.dims;
    }

    el = $(el);
    options = $.extend({}, defaults, options);

    // element becomes clone and appended to a parentElement, if defined
    var hasDefinedParentElement = Soho.DOM.isElement(options.parentElement);
    if (hasDefinedParentElement) {
      el = el.clone().appendTo(options.parentElement);
    }

    var dims = options.dims,
      hiddenParents = el.parents().add(el),
      props = {
        transition: 'none',
        webkitTransition: 'none',
        mozTransition: 'none',
        msTransition: 'none',
        visibility: 'hidden',
        display: 'block',
      },
      oldProps = [];

    hiddenParents.each(function () {
      var old = {};

      for (var name in props) {
        if (this.style[name]) {
          old[name] = this.style[name];
          this.style[name] = props[name];
        }
      }

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
      var old = oldProps[i];
      for (var name in props) {
        if (old[name]) {
          this.style[name] = old[name];
        }
      }
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
   * @returns {object}
   */
  $.fn.getHiddenSize = function(options) {
    return window.Soho.utils.getHiddenSize(this, options);
  };


  /**
   * Checks if a specific input is a String
   * @param {?} value
   * @returns {boolean}
   */
  window.Soho.utils.isString = function isString(value) {
    return typeof value === 'string' || value instanceof String;
  };


  /**
   * Checks if a specific input is a Number
   * @param {?} value
   * @returns {boolean}
   */
  window.Soho.utils.isNumber = function isNumber(value) {
    return typeof value === 'number' && value.length === undefined && !isNaN(value);
  };


  /**
   * Safely changes the position of a text caret inside of an editable element.
   * In most cases, will call "setSelectionRange" on an editable element immediately, but in some
   * cases, will be deferred with `requestAnimationFrame` or `setTimeout`.
   * @param {HTMLElement} element
   * @param {Number} startPos
   * @param {Number} endPos
   */
  window.Soho.utils.safeSetSelection = function safeSetSelection(element, startPos, endPos) {
    if (startPos && endPos === undefined) {
      endPos = startPos;
    }

    if (document.activeElement === element) {
      if (Soho.env.os.name === 'android') {
        Soho.behaviors.defer(function() {
          element.setSelectionRange(startPos, endPos, 'none');
        }, 0);
      } else {
        element.setSelectionRange(startPos, endPos, 'none');
      }
    }
  };




/* start-amd-strip-block */
}));
/* end-amd-strip-block */
