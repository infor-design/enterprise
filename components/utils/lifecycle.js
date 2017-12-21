 // Lifecycle Methods for jQuery Controls
 // Recursive methods that "globally" call certain methods on large groups of controls
var EXCLUDED_FROM_CLOSE_CHILDREN = ['.expandable-area', '.accordion'],
    EXCLUDED_FROM_HANDLE_RESIZE = [];

// Used by several of these plugins to detect whether or not the "data" property in question
// is a valid SoHo Xi Control.
function canAccessAPI(prop) {
  return prop && !(prop instanceof jQuery);
}

// Used by several of these plugins to detect whether or not there is a method on a "data" api
// that can be called.
function canCall(prop, method) {
  var api = canAccessAPI(prop);
  if (!api) {
    return false;
  }

  return (prop[method] && typeof prop[method] === 'function');
}

// Actually triggers the method on the control if it's possible
function triggerAPIMethod(prop, method) {
  if (canCall(prop, method)) {
    prop[method]();
    return true;
  }
  return false;
}

// Tracks each element that attempts to trigger an API method.
// If a trigger is successful, it stores it in an array that's used later.
function findControlsOnElements(elems, method) {
  var foundControls = [];

  $.each(elems, function elementIterator(index, elem) {
    $.each($(elem).data(), function dataEntryIterator(index, dataEntry) {
      if (triggerAPIMethod(dataEntry, method)) {
        foundControls.push({ elem: $(elem), control: dataEntry });
      }
    });
  });

  return foundControls;
}

// Kicks it all off
function siftFor(rootElem, method, filteredOutElements) {
  if (!rootElem || !method) {
    return;
  }

  rootElem = $(rootElem);
  var DOMelements = rootElem.find('*').add(rootElem);

  if (filteredOutElements) {
    DOMelements = DOMelements.not(filteredOutElements.join(', '));
  }
  var siftedControls = findControlsOnElements(DOMelements, method);

  rootElem.trigger('sift-' + method + '-complete', [siftedControls]);
  return rootElem;
}

//==========================================================
// Actual Control Plugins
//==========================================================

$.fn.destroy = function() {
  return siftFor($(this), 'destroy');
};

$.fn.closeChildren = function() {
  return siftFor($(this), 'close', EXCLUDED_FROM_CLOSE_CHILDREN);
};

$.fn.handleResize = function() {
  return siftFor($(this), 'handleResize', EXCLUDED_FROM_HANDLE_RESIZE);
};
