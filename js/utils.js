/**
* Transition Support Check
* Returns the vendor-prefixed name of the 'transition' property available by the browser.
* If the browser doesn't support transitions, it returns null.
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
  $.fn.uniqueId = function(className, prefix, suffix) {
    var predefinedId = $(this).attr('id');

    if (predefinedId && $('#' + predefinedId).length < 2) {
      return predefinedId;
    }

    prefix = (!prefix ? '' : prefix + '-');
    suffix = (!suffix ? '' : '-' + suffix);
    className = (!className ? $(this).attr('class') : className);

    var cnt = $('.' + className).length;
    return prefix + className + cnt + suffix;
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

  // Parse options from attribute and return obj
  $.fn.parseOptions = function(element, attr) {
    var options;

    attr = attr || 'data-options'; //default
    options = $(element).attr(attr);

    if (options && options.length) {
      if (options.indexOf('{') > -1) {
        try {
          options = JSON.parse(options.replace(/'/g, '"'));
        } catch(err) {
          // Attempt a manual parse
          var regex = /({|,)(?:\s*)(?:')?([A-Za-z_$\.][A-Za-z0-9_ \-\.$]*)(?:')?(?:\s*):/g; //get keys
          options = options.replace(regex, '$1\"$2\":'); //add double quotes to keys
          regex = /:(?:\s*)(?!(true|false|null|undefined))([A-Za-z_$\.#][A-Za-z0-9_ \-\.$]*)/g; //get strings in values
          options = options.replace(regex, ':\"$2\"'); //add double quotes to strings in values
          options = JSON.parse(options.replace(/'/g, '"')); //replace single to double quotes
        }
      }
    }

    if (!options) {
      options = {};
    }

    return options;
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
    return { event: this, cancel: cancel, pause: pause, resume: resume };
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

  //Hide Focus - Only show on key entry
  $.fn.hideFocus = function() {
    var element = $(this);

    var isClick = false,
      isFocused = false;

    element.addClass('hide-focus').on('mousedown.hide-focus touchstart.hide-focus', function() {
      isClick = true;
      $(this).addClass('hide-focus');
    }).on('focusin.hide-focus', function() {
      var elem = $(this);

      if (!isClick && !isFocused) {
        elem.removeClass('hide-focus');
      }
      isClick = false;
      isFocused = true;
    }).on('focusout.hide-focus', function() {
      $(this).addClass('hide-focus');
      isClick = false;
      isFocused = false;
    });

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
    self.element.parent().append(this.xButton);

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
  $.actualChar = function(e) {
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

  window.Soho = window.Soho || {};
  window.Soho.utils = {};
  window.Soho.DOM = {};

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

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
