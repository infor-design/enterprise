/**
* Transition Support Check
* Returns the vendor-prefixed name of the 'transition' property available by the browser.
* If the browser doesn't support transitions, it returns null.
*/

function visible(element) {
  return $.expr.filters.visible( element ) &&
    !$(element).parents().addBack().filter(function() {
      return $.css(this, 'visibility') === 'hidden';
    }).length;
}

$.fn.transitionSupport = (function() {
  'use strict';

  var el = $('<div></div>')[0],
    prop = 'transition',
    prefixes = ['Moz', 'Webkit', 'O', 'ms'],
    prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

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
})();

// Returns the name of the TransitionEnd event.
$.fn.transitionEndName = (function() {
  var prop = $.fn.transitionSupport,
    eventNames = {
      'WebkitTransition' :'webkitTransitionEnd',
      'MozTransition'    :'transitionend',
      'MSTransition'     :'msTransitionEnd',
      'OTransition'      :'oTransitionEnd',
      'transition'       :'transitionend'
    };

  return eventNames[prop] || null;
})();

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
$.fn.onTouchClick = function(eventNamespace, one) {
  eventNamespace = (eventNamespace !== null || eventNamespace !== undefined ? '.' + eventNamespace : '');

  return this.each(function() {
    var self = $(this),
      listener = one ? 'one' : 'on';

    self[listener]('touchend' + eventNamespace + ' touchcancel' + eventNamespace, function touchEventConversionListener(e) {
      e.preventDefault();
      $(this).click();
      return false;
    });

    return self;
  });
};

// Reverses the .onTouchClick() method and turns off a matching event listener
$.fn.offTouchClick = function(eventNamespace) {
  eventNamespace = (eventNamespace !== null || eventNamespace !== undefined ? '.' + eventNamespace : '');

  return this.each(function() {
    return $(this).off('touchend' + eventNamespace + ' touchcancel' + eventNamespace);
  });
};


