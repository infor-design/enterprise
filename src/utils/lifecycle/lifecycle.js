// Lifecycle Methods for jQuery Controls
// Recursive methods that "globally" call certain methods on large groups of controls
// =============================================================================

// Used by several of these plugins to detect whether or not the "data" property in question
// is a valid IDS Enterprise Control.
function canAccessAPI(prop) {
  return prop && !(prop instanceof jQuery);
}

// Can access a property/method on an API.
function canAccessProp(prop, method) {
  const api = canAccessAPI(prop);
  if (!api) {
    return false;
  }
  return (prop[method] !== undefined && prop[method] !== null);
}

// Used by several of these plugins to detect whether or not there is a method on a "data" api
// that can be called.
function canCall(prop, method) {
  return (canAccessProp(prop, method) && typeof prop[method] === 'function');
}

// Actually triggers the method on the control if it's possible
function triggerAPIMethod(prop, method) {
  if (canCall(prop, method)) {
    prop[method]();
    return true;
  }
  return false;
}

/**
 * Tracks each element that attempts to trigger an API method.
 * If a trigger is successful, it stores it in an array that's used later.
 * @param {jQuery[]} elems containing elements to search.
 * @param {array|string} methods the method/prop to search for.
 * @param {array} [componentNames=[]] if defined, only sifts for specific component names instead of doing a blanket search/check
 * @param {boolean} [doTrigger=false] if true, causes the method being searched to be called, if possible.
 * @returns {array} containing IDS components that have the method/prop being searched.
 */
function findComponentsOnElements(elems, methods, componentNames = [], doTrigger = false) {
  const foundComponents = [];

  if (typeof methods === 'string') {
    methods = [methods];
  }

  $.each(elems, (index, elem) => {
    $.each($(elem).data(), (i, dataEntry) => {
      if (componentNames.length && componentNames.indexOf(i) === -1) {
        return;
      }

      methods.forEach((method) => {
        if (doTrigger && triggerAPIMethod(dataEntry, method)) {
          foundComponents.push({ elem: $(elem), control: dataEntry });
        } else if (canAccessProp(dataEntry, method)) {
          foundComponents.push({ elem: $(elem), control: dataEntry });
        }
      });
    });
  });

  return foundComponents;
}

/**
 * Sifts through all elements within a root element and attempts to call a method
 * on the elements' attached IDS Components, if those components are present.
 * @private
 * @param {jQuery[]|HTMLElement} rootElem the top-level element to search
 * @param {string} method the method name to search for
 * @param {array} [filteredOutElements=[]] if provided, filters out some component selectors.
 * @returns {jQuery[]} wrapped root element
 */
function siftFor(rootElem, method, filteredOutElements = []) {
  if (!rootElem || !method) {
    return undefined;
  }

  rootElem = $(rootElem);
  const DOMelements = rootElem.find('*').add(rootElem).not(filteredOutElements.join(', '));
  const siftedControls = findComponentsOnElements(DOMelements, method, undefined, true);

  rootElem.trigger(`sift-${method}-complete`, [siftedControls]);
  return rootElem;
}

export { siftFor, findComponentsOnElements };
