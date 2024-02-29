import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { Environment as env } from '../../utils/environment';
import { Locale } from '../locale/locale';

// Component Name
const COMPONENT_NAME = 'place';

// Default Component Options
const DEFAULT_PLACE_SETTINGS = {
  bleedFromContainer: false,
  callback: null,
  container: null,
  parent: null,
  parentXAlignment: 'center',
  parentYAlignment: 'center',
  placement: 'bottom',
  strategies: ['nudge']
};

// Constants used throughout
const PLACE_STRATEGIES = ['nudge', 'clockwise', 'flip', 'shrink', 'shrink-x', 'shrink-y'];
const PLACE_POSITIONS = ['top', 'left', 'right', 'bottom', 'center'];
const PLACE_X_ALIGNMENTS = ['left', 'center', 'right'];
const PLACE_Y_ALIGNMENTS = ['top', 'center', 'bottom'];
const PLACEMENT_OBJECT_SETTING_KEYS = [
  'x', 'y',
  'container', 'containerOffsetX', 'containerOffsetY',
  'callback',
  'parent', 'parentXAlignment', 'parentYAlignment',
  'useParentWidth', 'useParentHeight',
  'placement',
  'strategies'
];

/**
 * Object that contains coordinates along with temporary, changeable properties.
 * This object gets passed around the Place Behavior and modified during each phase of positioning.
 * This object is also passed to all callbacks and event listeners for further modification.
 * @private
 * @param {object} [placementOptions] object containing settings for placement
 * @returns {void}
 */
function PlacementObject(placementOptions) {
  const self = this;

  PLACEMENT_OBJECT_SETTING_KEYS.forEach((val) => {
    if (placementOptions[val] === null) {
      return;
    }

    if (val === 'x' || val === 'y') {
      self.setCoordinate(val, placementOptions[val]);
      self[`original${val}`] = placementOptions[val];
      return;
    }

    self[val] = placementOptions[val];
  });

  this.modified = false;

  return this.sanitize();
}

PlacementObject.prototype = {
  isReasonableDefault(setting, limits) {
    return $.inArray(setting, limits) > -1;
  },

  sanitize() {
    const self = this;

    this.bleedFromContainer = this.bleedFromContainer === true;
    this.callback = (typeof this.callback === 'function') ? this.callback : DEFAULT_PLACE_SETTINGS.callback;
    this.container = (this.container instanceof $ && this.container.length) ?
      this.container : DEFAULT_PLACE_SETTINGS.container;
    this.containerOffsetX = !isNaN(parseInt(this.containerOffsetX, 10)) ?
      this.containerOffsetX : 0;
    this.containerOffsetY = !isNaN(parseInt(this.containerOffsetY, 10)) ?
      this.containerOffsetY : 0;
    this.parent = (this.parent instanceof $ && this.parent.length) ?
      this.parent : DEFAULT_PLACE_SETTINGS.parent;
    this.parentXAlignment = this.isReasonableDefault(this.parentXAlignment, PLACE_X_ALIGNMENTS) ?
      this.parentXAlignment : DEFAULT_PLACE_SETTINGS.parentXAlignment;
    this.parentYAlignment = this.isReasonableDefault(this.parentYAlignment, PLACE_Y_ALIGNMENTS) ?
      this.parentYAlignment : DEFAULT_PLACE_SETTINGS.parentYAlignment;
    this.placement = this.isReasonableDefault(this.placement, PLACE_POSITIONS) ?
      this.placement : DEFAULT_PLACE_SETTINGS.placement;
    this.useParentHeight = this.useParentHeight === true;
    this.useParentWidth = this.useParentWidth === true;

    if (!$.isArray(this.strategies) || !this.strategies.length) {
      this.strategies = ['nudge'];
    }
    this.strategies.forEach((strat, i) => {
      self.strategies[i] = self.isReasonableDefault(strat, PLACE_STRATEGIES) ?
        strat : self.strategies[i];
    });
  },

  setCoordinate(coordinate, value) {
    const coordinates = ['x', 'y'];
    if (!this.isReasonableDefault(coordinate, coordinates)) {
      return;
    }

    if (isNaN(value)) {
      value = 0;
    }

    this[coordinate] = this.parent?.is('.dropdown') ? Math.floor(value) : Math.round(value);
  }
};

/**
 * The Place API which handles internal placement of popups, menus ect.
 * @class Place
 * @param {HTMLElement|jQuery[]} element the base element being placed
 * @param {object} [settings] incoming settings
 * @param {boolean} [settings.bleedFromContainer = false] If true, allows positioned content to bleed
 *  outside of a defined container.
 * @param {function} [settings.callback] If defined, provides extra placement adjustments
 *  after the main calculation is performed.
 * @param {HTMLElement} [settings.container] If defined, contains the placement of the
 *  element to the boundaries of a specific container element.
 * @param {HTMLElement} [settings.parent] If defined, will be used as the reference
 *  element for placement this element.
 * @param {string} [settings.parentXAlignment = 'center'] Only used for parent-based placement.
 *  Determines the X-coordinate alignment of the placed element against its parent.
 * @param {string} [settings.parentYAlignment = 'center'] Only used for parent-based placement.
 *  Determines the Y-coordinate alignment of the placed element against its parent.
 * @param {string} [settings.placement = 'bottom'] If defined, changes the direction in which
 *  placement of the element happens
 * @param {string[]} [settings.strategies = ['nudge']] Determines the "strategy" for alternatively
 *  placing the element if it doesn't fit in the defined boundaries.  Only matters
 *  when "parent" is a defined setting.  It's possible to define multiple strategies
 *  and execute them in order.
 */
function Place(element, settings) {
  this.settings = utils.mergeSettings(element, settings, DEFAULT_PLACE_SETTINGS);
  this.element = $(element);
  this.init();
}

Place.prototype = {

  /**
   * Do other init (change/normalize settings, load externals, etc)
   * @private
   * @returns {this} component instance
   */
  init() {
    return this
      .build()
      .handleEvents();
  },

  /**
   * Add markup to the control
   * @private
   * @returns {this} component instance
   */
  build() {
    if (!this.element.hasClass('placeable')) {
      this.element.addClass('placeable');
    }

    // Setup a hash of original styles that will retain width/height whenever
    // the placement for this element is recalculated.
    this.originalStyles = {};
    const h = this.element[0].style.height;
    const w = this.element[0].style.width;

    if (h) {
      this.originalStyles.height = h;
    }
    if (w) {
      this.originalStyles.width = w;
    }

    return this;
  },

  /**
   * Sets up event handlers for this control and its sub-elements
   * @private
   * @returns {this} component instance
   */
  handleEvents() {
    const self = this;

    this.element.on(`place.${COMPONENT_NAME}`, (e, x, y) => {
      self.place(new PlacementObject({ x, y }));
    }).on(`updated.${COMPONENT_NAME}`, () => {
      self.updated();
    });

    return this;
  },

  /**
   * Actually renders an element with coordinates inside the DOM
   * @param {PlacementObject} placementObj settings for the placement routine
   * @returns {void}
   */
  render(placementObj) {
    const unitRegex = /(px|%)/i;

    this.element.offset({
      left: placementObj.x,
      top: placementObj.y
    });

    if (placementObj.height) {
      this.element[0].style.height = placementObj.height + (unitRegex.test(`${placementObj.height}`) ? '' : 'px');
    }
    if (placementObj.width) {
      this.element[0].style.width = placementObj.width + (unitRegex.test(`${placementObj.width}`) ? '' : 'px');
    }
  },

  /**
   * Main placement API Method (external)
   * Can either take a PlacementObject as a single argument, or can take 2 coordinates (x, y) and
   * will use the pre-defined settings.
   * @param {PlacementObject} placementObj settings for the placement routine
   * @returns {void}
   */
  place(placementObj) {
    const curr = [
      this.element[0].style.left,
      this.element[0].style.top,
    ];

    // Cancel placement with return:false; from a "beforeplace" event
    const canBePlaced = this.element.trigger('beforeplace', [curr]);
    if (!canBePlaced) {
      return curr;
    }

    if (!(placementObj instanceof PlacementObject)) {
      placementObj = new PlacementObject(placementObj);
    }

    // If no values are defined, simply return the current coordinates with a warning.
    if (placementObj.x == null && placementObj.y == null) {
      // TODO: Log a warning about not positioning stuff?
      return curr;
    }

    // Remove any previous placement styles
    this.clearOldStyles();

    // Use different methods if placement against a parent, versus straight-up coordinate placement
    if (placementObj.parent) {
      return this.placeWithParent(placementObj);
    }

    return this.placeWithCoords(placementObj);
  },

  /**
   * Placement Routine that expects a parent to be used as a base placement marking.
   * In this case, "x" and "y" integers are "relative" adjustments to the original
   * numbers generated by the parent. Can be modified by using a callback in the settings.
   * @private
   * @param {PlacementObject} placementObj settings for the placement routine
   * @returns {PlacementObject} modified placementObject with updated settings
   */
  placeWithParent(placementObj) {
    if (!placementObj.parent || !placementObj.parent.length) {
      // can't simply return x and y here because if there is no parent element,
      // these numbers are not coordinates, they are offsets.
      return [undefined, undefined];
    }

    const self = this;
    const container = this.getContainer(placementObj);
    const containerIsBody = container.length && container[0] === document.body;
    let containerRect;

    // If this tooltip is confined to a container, in some situtions we need to make sure
    // the placed element is within the browser viewport before we attempt to get its
    // dimensions. This simply puts the element within the viewport boundary beforehand
    // for accurate measurements.
    // See Github infor-design/enterprise#3119
    if (env.rtl && container.length) {
      containerRect = DOM.getDimensions(container[0]);
      this.element.css({
        left: `${containerRect.left}px`,
        top: `${containerRect.right}px`
      });
    }

    const parentRect = DOM.getDimensions(placementObj.parent[0]);
    // NOTE: Usage of $(window) instead of $('body') is deliberate here - http://stackoverflow.com/a/17776759/4024149.
    // Firefox $('body').scrollTop() will always return zero.
    const scrollX = containerIsBody ? $(window).scrollLeft() : container.scrollLeft();
    const scrollY = containerIsBody ? $(window).scrollTop() : container.scrollTop();

    if (placementObj.useParentWidth) {
      placementObj.width = parentRect.width;
    }
    if (placementObj.useParentHeight) {
      placementObj.height = parentRect.height;
    }

    function getCoordsFromPlacement(incomingPlacementObj) {
      const p = incomingPlacementObj.placement;
      const aX = incomingPlacementObj.parentXAlignment;
      const aY = incomingPlacementObj.parentYAlignment;
      const elRect = DOM.getDimensions(self.element[0]);
      let cX;
      let cY;

      // Set initial placements
      switch (p) {
        case 'top':
          cY = parentRect.top - elRect.height - incomingPlacementObj.y +
            (containerIsBody ? scrollY : 0);
          break;
        case 'left':
          cX = parentRect.left - elRect.width - incomingPlacementObj.x +
            (containerIsBody ? scrollX : 0);
          break;
        case 'right':
          cX = parentRect.right + incomingPlacementObj.x + (containerIsBody ? scrollX : 0);
          break;
        default: // Bottom
          cY = parentRect.bottom + incomingPlacementObj.y + (containerIsBody ? scrollY : 0);
          break;
      }

      // Set X alignments on bottom/top placements
      if (p === 'top' || p === 'bottom') {
        const cW = Math.round(containerIsBody ? document.body.offsetWidth : null);
        switch (aX) {
          case 'left':
            if (containerIsBody && (cW < Math.round(elRect.left) + Math.round(elRect.width))) {
              cX = parentRect.left + incomingPlacementObj.x + scrollX;
            } else {
              cX = parentRect.left - incomingPlacementObj.x + (containerIsBody ? scrollX : 0);
            }
            break;
          case 'right':
            if (containerIsBody && (Math.round(elRect.right) - Math.round(elRect.width)) < 0) {
              cX = parentRect.left - incomingPlacementObj.x + scrollX;
            } else {
              cX = (parentRect.right - elRect.width) +
                incomingPlacementObj.x + (containerIsBody ? scrollX : 0);
            }
            break;
          default: // center
            cX = (parentRect.left + ((parentRect.width - elRect.width) / 2)) +
              incomingPlacementObj.x + (containerIsBody ? scrollX : 0);
            break;
        }
      }

      // Set Y alignments on left/right placements
      if (p === 'right' || p === 'left') {
        switch (aY) {
          case 'top':
            cY = parentRect.top - incomingPlacementObj.y + (containerIsBody ? scrollY : 0);
            break;
          case 'bottom':
            cY = (parentRect.bottom - elRect.height) +
              incomingPlacementObj.y + (containerIsBody ? scrollY : 0);
            break;
          default: // center
            cY = (parentRect.top + ((parentRect.height - elRect.height) / 2)) +
              incomingPlacementObj.y + (containerIsBody ? scrollY : 0);
            break;
        }
      }

      return [cX, cY];
    }

    if (placementObj.parent.is('.colorpicker') && Locale.isRTL()) {
      placementObj.x += 30;
    }

    function doPlacementAgainstParent(incomingPlacementObj) {
      const coords = getCoordsFromPlacement(incomingPlacementObj);
      incomingPlacementObj.setCoordinate('x', coords[0]);
      incomingPlacementObj.setCoordinate('y', coords[1]);
      self.render(incomingPlacementObj);
      incomingPlacementObj = self.handlePlacementCallback(incomingPlacementObj);
      return incomingPlacementObj;
    }

    // Simple placement logic
    placementObj = doPlacementAgainstParent(placementObj);

    // Adjusts the placement coordinates based on a defined strategy
    // Will only adjust the current strategy if bleeding outside the
    // viewport/container are detected.
    placementObj.strategies.forEach((strat) => {
      placementObj = self.checkBleeds(placementObj);

      if (placementObj.bleeds) {
        placementObj = (function () {
          switch (strat) {
            case 'nudge':
              return self.nudge(placementObj);
            case 'clockwise':
              return self.clockwise(placementObj);
            case 'flip':
              placementObj = self.flip(placementObj);
              placementObj.setCoordinate('x', placementObj.originalx);
              placementObj.setCoordinate('y', placementObj.originaly);
              placementObj = doPlacementAgainstParent(placementObj);
              return placementObj;
            case 'shrink':
              return self.shrink(placementObj);
            case 'shrink-x':
              return self.shrink(placementObj, 'x');
            case 'shrink-y':
              return self.shrink(placementObj, 'y');
            default:
              return placementObj;
          }
        }(self));

        self.render(placementObj);
      }
    });

    // Trigger an event to notify placement has ended
    placementObj.element = this.element;
    this.element.trigger('afterplace', [placementObj]);

    return placementObj;
  },

  /**
   * Basic Placement Routine that simply accepts X and Y coordinates.
   * In this case, "x" and "y" integers are "absolute" and will be the base point for placement.
   * Can be modified by using a callback in the settings.
   * @private
   * @param {PlacementObject} placementObj settings for the placement routine
   * @returns {PlacementObject} modified placementObject with updated settings
   */
  placeWithCoords(placementObj) {
    this.render(placementObj);

    placementObj = this.handlePlacementCallback(placementObj);

    this.render(placementObj);

    // Coordinate placement can only be "nudged" (strategy is not used in this style of placement).
    placementObj = this.checkBleeds(placementObj);
    if (placementObj.bleeds) {
      placementObj = this.nudge(placementObj);
    }

    // Place again
    this.render(placementObj);

    placementObj = this.checkBleeds(placementObj);
    if (placementObj.bleeds) {
      placementObj = this.shrink(placementObj);
    }

    this.render(placementObj);

    this.element.trigger('afterplace', [
      placementObj
    ]);

    return placementObj;
  },

  /**
   * Perform callback, if it exists.
   * Callback should return an array containing the modified coordinate values: [x, y];
   * NOTE: These are actual coordinates in all cases.
   * NOTE: They are not relative values - they are absolute.
   * @private
   * @param {PlacementObject} placementObj settings for the placement routine
   * @returns {PlacementObject} modified placementObject with updated settings
   */
  handlePlacementCallback(placementObj) {
    const cb = placementObj.callback || this.settings.callback;
    placementObj.element = this.element;

    if (cb && typeof cb === 'function') {
      placementObj = cb(placementObj);
    }

    this.render(placementObj);
    return placementObj;
  },

  /**
   * Detects for elements with fixed positioning, or an absolutely-positioned containment.
   * If either condition is true, this placement should not account for container scrolling.
   * @private
   * @param {PlacementObject} placementObj settings for the placement routine
   * @returns {boolean} whether or not the values calculated should account for scrolling.
   */
  accountForScrolling(placementObj) {
    let container = placementObj.container;
    let pos = window.getComputedStyle(this.element[0]).position;

    // fixed-positoned, placed elements don't account for scrolling
    if (pos === 'fixed') {
      return false;
    }

    // Check the container element.
    // If we can't find a valid container element, do account for scrolling.
    if (!container || !container.length) {
      container = this.element.parents().filter(function () {
        const containerPos = window.getComputedStyle(this).position;
        return containerPos === 'absolute' || pos === 'fixed';
      });
    }
    if (!container || !container.length) {
      return true;
    }

    if (container[0] === document.body) {
      return false;
    }

    const containerStyle = window.getComputedStyle(container[0]);
    pos = containerStyle.position;
    if (pos === 'fixed') {
      return false;
    }
    if (pos === 'absolute' && containerStyle.overflow === 'hidden') {
      return false;
    }
    return true;
  },

  /**
   * Gets a parent container element.
   * @param {PlacementObject} placementObj settings for the placement routine
   * @returns {HTMLElement|jQuery[]} container element
   */
  getContainer(placementObj) {
    if (placementObj.container instanceof $ && placementObj.container.length) {
      return placementObj.container;
    }

    const modalParent = this.element.parents('.modal');
    if (modalParent.length) {
      return modalParent;
    }

    return $(document.body);
  },

  /**
   * Checks if the parent element is in viewport
   * @param {Object} parentElement element to be checked
   * @returns {boolean} whether or not the element is in the viewport
   */
  isParentElementinViewport(parentElement) {
    if (typeof jQuery === 'function' && parentElement instanceof jQuery) {
      parentElement = parentElement[0];
    }

    const rect = parentElement.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Re-adjust a previously-placed element to account for bleeding off the edges.
   * Element must fit within the boundaries of the page or it's current scrollable pane.
   * @param {PlacementObject} placementObj settings for the placement routine.
   * @returns {PlacementObject} modified placementObject with updated settings.
   */
  checkBleeds(placementObj) {
    const containerBleed = this.settings.bleedFromContainer === false ?
      !this.isParentElementinViewport(this.element) : this.settings.bleedFromContainer;
    const container = this.getContainer(placementObj);
    const containerIsBody = container.length && container[0] === document.body;
    const BoundingRect = this.element[0].getBoundingClientRect();
    const rect = {};
    const containerRect = container ? container[0].getBoundingClientRect() : {};
    // NOTE: Usage of $(window) instead of $('body') is deliberate here - http://stackoverflow.com/a/17776759/4024149.
    // Firefox $('body').scrollTop() will always return zero.
    const scrollX = containerIsBody ? $(window).scrollLeft() : container.scrollLeft();
    const scrollY = containerIsBody ? $(window).scrollTop() : container.scrollTop();
    const windowH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const windowW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const padding = 20;
    let d;

    rect.width = BoundingRect.width;
    rect.height = BoundingRect.height;
    rect.top = BoundingRect.top;
    rect.right = BoundingRect.right;
    rect.bottom = BoundingRect.bottom;
    rect.left = BoundingRect.left;

    function getBoundary(edge) {
      switch (edge) {
        case 'top':
          return (containerBleed ? 0 : containerRect.top) -
            (!containerIsBody ? 0 : scrollY * -1); // 0 === top edge of viewport
        case 'left':
          return (containerBleed ? 0 : containerRect.left) -
            (!containerIsBody ? 0 : scrollX * -1); // 0 === left edge of viewport
        case 'right':
          return (containerBleed ? windowW : containerRect.right) -
            (!containerIsBody ? 0 : scrollX * -1);
        default: // bottom
          return (containerBleed ? windowH : containerRect.bottom) -
            (!containerIsBody ? 0 : scrollY * -1);
      }
    }

    // If element width is greater than window width, shrink to fit
    const rightViewportEdge = getBoundary('right');
    if (rect.width >= rightViewportEdge) {
      d = (rect.width - rightViewportEdge) + padding;
      const newWidth = rect.width - d;
      placementObj.width = newWidth;

      this.element[0].style.width = `${newWidth}px`;
      rect.width = newWidth; // reset the rect because the size changed
    }

    // If element height is greater than window height, shrink to fit
    const bottomViewportEdge = getBoundary('bottom');
    if (rect.height >= bottomViewportEdge) {
      d = (rect.height - bottomViewportEdge) + padding;
      const newHeight = rect.height - d;
      placementObj.height = newHeight;

      this.element[0].style.height = `${newHeight}px`;
      rect.height = newHeight; // reset the rect because the size changed
    }

    // build conditions
    const offRightEdge = rect.right > getBoundary('right');
    const offLeftEdge = rect.left < getBoundary('left');
    const offTopEdge = rect.top < getBoundary('top');
    const offBottomEdge = rect.bottom > getBoundary('bottom');

    // Return if no bleeding is detected (no need to fix anything!)
    if (!offRightEdge && !offLeftEdge && !offTopEdge && !offBottomEdge) {
      placementObj.bleeds = undefined;
      return placementObj;
    }

    // Keep a record of bleeds that need to be adjusted, and by what values
    placementObj.bleeds = {};
    placementObj.bleeds.right = offRightEdge ? (rect.right - getBoundary('right')) : null;
    placementObj.bleeds.left = offLeftEdge ? -(rect.left - getBoundary('left')) : null;
    placementObj.bleeds.top = offTopEdge ? -(rect.top - getBoundary('top')) : null;
    placementObj.bleeds.bottom = offBottomEdge ? (rect.bottom - getBoundary('bottom')) : null;

    return placementObj;
  },

  // Bumps the element around in each direction
  nudge(placementObj) {
    if (!placementObj.nudges) {
      placementObj.nudges = { x: 0, y: 0 };
    }

    let d = 0;
    if (placementObj.bleeds.right) {
      d = Math.abs(placementObj.bleeds.right) + Math.abs(placementObj.containerOffsetX);
      placementObj.setCoordinate('x', placementObj.x - d);
      placementObj.nudges.x -= d;
    }
    if (placementObj.bleeds.left) {
      d = Math.abs(placementObj.bleeds.left) + Math.abs(placementObj.containerOffsetX);
      placementObj.setCoordinate('x', placementObj.x + d);
      placementObj.nudges.x += d;
    }
    if (placementObj.bleeds.top) {
      d = Math.abs(placementObj.bleeds.top) + Math.abs(placementObj.containerOffsetY);
      placementObj.setCoordinate('y', placementObj.y + d);
      placementObj.nudges.y += d;
    }
    if (placementObj.bleeds.bottom) {
      d = Math.abs(placementObj.bleeds.bottom) + Math.abs(placementObj.containerOffsetY);
      placementObj.setCoordinate('y', placementObj.y - d);
      placementObj.nudges.y -= d;
    }

    placementObj.wasNudged = true;
    placementObj.bleeds = undefined;

    return placementObj;
  },

  flip(placementObj) {
    // Don't attempt to flip if there was no bleeding on the edge we're attempting to leave from.
    if (!placementObj.bleeds[placementObj.placement]) {
      return placementObj;
    }

    if (!placementObj.attemptedFlips) {
      placementObj.attemptedFlips = [];
    }
    placementObj.attemptedFlips.push(placementObj.placement);

    // If we've tried flipping in all directions, give up and use the default placement.
    if (placementObj.attemptedFlips.length > 3) {
      placementObj = this.giveup(placementObj);
      return placementObj;
    }

    const accountForScrolling = this.accountForScrolling(placementObj);
    const isXCoord = ['left', 'right'].indexOf(placementObj.placement) > -1;
    const containerBleed = this.settings.bleedFromContainer;
    const container = this.getContainer(placementObj);
    const containerIsBody = container.length && container[0] === document.body;
    const containerRect = container ? container[0].getBoundingClientRect() : {};
    const parentRect = placementObj.parent[0].getBoundingClientRect();
    // NOTE: Usage of $(window) instead of $('body') is deliberate here - http://stackoverflow.com/a/17776759/4024149.
    // Firefox $('body').scrollTop() will always return zero.
    const scrollX = containerIsBody ? $(window).scrollLeft() : container.scrollLeft();
    const scrollY = containerIsBody ? $(window).scrollTop() : container.scrollTop();
    const windowH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const windowW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    function getOppositeDir(dir) {
      switch (dir) {
        case 'left':
          return 'right';
        case 'right':
          return 'left';
        case 'top':
          return 'bottom';
        default: // bottom
          return 'top';
      }
    }

    // Gets the distance between an edge on the target element, and its opposing viewport border
    function getDistance(dir) {
      let d = 0;

      switch (dir) {
        case 'left':
          d = (containerBleed ? 0 : containerRect.left) -
            (accountForScrolling ? scrollX : 0) - parentRect.left + placementObj.containerOffsetX;
          break;
        case 'right':
          d = ((containerBleed ? windowW : containerRect.right) -
            (accountForScrolling ? scrollX : 0)) - parentRect.right - placementObj.containerOffsetX;
          break;
        case 'top':
          d = (containerBleed ? 0 : containerRect.top) -
            (accountForScrolling ? scrollY : 0) - parentRect.top + placementObj.containerOffsetY;
          break;
        default: // bottom
          d = ((containerBleed ? windowH : containerRect.bottom) -
            (accountForScrolling ? scrollY : 0)) - parentRect.bottom -
            placementObj.containerOffsetY;
          break;
      }

      return Math.abs(d);
    }

    function tried(placement) {
      return $.inArray(placement, placementObj.attemptedFlips) > -1;
    }

    function performFlip(originalDir) {
      const newDir = getOppositeDir(originalDir);
      const perpendicularDir = isXCoord ? 'top' : 'left';
      const oppPerpendicularDir = getOppositeDir(perpendicularDir);
      const originalDistance = getDistance(originalDir);
      const targetDistance = getDistance(newDir);

      if (!tried(newDir)) {
        if (originalDistance >= targetDistance) {
          return originalDir;
        }

        placementObj.wasFlipped = true;
        return newDir;
      }

      // switch the coordinate definitions
      // since the axis for placement is flipped, our coordinate offsets should also flip
      const tmp = placementObj.originalx;
      placementObj.originalx = placementObj.originaly;
      placementObj.originaly = tmp;

      const perpendicularDistance = getDistance(perpendicularDir);
      const oppPerpendicularDistance = getDistance(oppPerpendicularDir);

      if (!tried(perpendicularDir)) {
        if (perpendicularDistance >= oppPerpendicularDistance) {
          return perpendicularDir;
        }

        if (!tried(oppPerpendicularDir)) {
          return oppPerpendicularDir;
        }
      }

      return originalDir;
    }

    placementObj.placement = performFlip(placementObj.placement);

    return placementObj;
  },

  // TODO: Move Clockwise
  clockwise(placementObj) {
    return placementObj;
  },

  // If element height/width is greater than window height/width, shrink to fit
  shrink(placementObj, dimension) {
    let dX = 0;
    let dY = 0;
    const useX = dimension === undefined || dimension === null || dimension === 'x';
    const useY = dimension === undefined || dimension === null || dimension === 'y';

    const accountForScrolling = this.accountForScrolling(placementObj);
    const menuRect = DOM.getDimensions(this.element[0]);
    const containerBleed = this.settings.bleedFromContainer;
    const container = this.getContainer(placementObj);
    const containerRect = container ? container[0].getBoundingClientRect() : {};
    const containerIsBody = container.length && container[0] === document.body;
    const coordinateShrink = placementObj.parent === null;

    // NOTE: Usage of $(window) instead of $('body') is deliberate here - http://stackoverflow.com/a/17776759/4024149.
    // Firefox $('body').scrollTop() will always return zero.
    const scrollX = containerIsBody ? $(window).scrollLeft() : container.scrollLeft();
    const scrollY = containerIsBody ? $(window).scrollTop() : container.scrollTop();
    const windowH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const windowW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    // Figure out the viewport boundaries
    const leftViewportEdge = (accountForScrolling ? scrollX : 0) +
      (containerBleed ? 0 : containerRect.left) + placementObj.containerOffsetX;
    const topViewportEdge = (accountForScrolling ? scrollY : 0) +
      (containerBleed ? 0 : containerRect.top) + placementObj.containerOffsetY;
    const rightViewportEdge = (accountForScrolling ? scrollX : 0) +
      (containerBleed ? windowW : containerRect.right) - placementObj.containerOffsetX;
    const bottomViewportEdge = (accountForScrolling ? scrollY : 0) +
      (containerBleed ? windowH : containerRect.bottom) - placementObj.containerOffsetY;

    // If shrinking a coordinate-placed object (no parent), the full range between top/bottom
    // and left/right boundaries will be used.
    // If shrinking a parent-placed object, the distance between the parent and whichever
    // boundary is further will be used.
    let availableX = rightViewportEdge - leftViewportEdge;
    let availableY = bottomViewportEdge - topViewportEdge;
    if (!coordinateShrink) {
      const parentRect = DOM.getDimensions(placementObj.parent[0]);
      const availableTop = parentRect.top - topViewportEdge;
      const availableBottom = bottomViewportEdge - parentRect.bottom;
      const availableLeft = parentRect.left - leftViewportEdge;
      const availableRight = rightViewportEdge - parentRect.right;
      availableX = availableLeft > availableRight ? availableLeft : availableRight;
      availableY = availableTop > availableBottom ? availableTop : availableBottom;
    }

    // Shrink in each direction.
    // The value of the "containerOffsets" is "factored out" of each calculation,
    // if for some reason the element is larger than the viewport/container space allowed.
    if (useX) {
      if (menuRect.width > availableX) {
        placementObj.width = availableX;
      }

      // Shift back into the viewport if off the Left
      if (menuRect.left < leftViewportEdge) {
        dX = leftViewportEdge - menuRect.left;
        placementObj.setCoordinate('x', placementObj.x + dX);
      }
    }

    if (useY) {
      if (menuRect.height > availableY) {
        placementObj.height = availableY;
      }

      // Shift back into the viewport if off the Top
      if (menuRect.top < topViewportEdge) {
        dY = topViewportEdge - menuRect.top;
        placementObj.setCoordinate('y', placementObj.y + dY);
      }
    }

    return placementObj;
  },

  // Giving up causes all the placementObj settings to revert
  giveup(placementObj) {
    placementObj.giveup = true;
    placementObj.strategy = this.settings.strategy;
    placementObj.placement = this.settings.placement;
    return placementObj;
  },

  // Clears the old styles that may be present
  clearOldStyles() {
    this.element[0].style.left = '';
    this.element[0].style.top = '';
    this.element[0].style.width = '';
    this.element[0].style.height = '';

    const os = this.originalStyles;
    if (os) {
      if (os.width) {
        this.element[0].style.width = os.width;
      }

      if (os.height) {
        this.element[0].style.height = os.height;
      }
    }

    return this;
  },

  // Built-in method for handling positon of optional arrow elements.
  // Used for tooltip/popovers/popupmenus
  setArrowPosition(e, placementObj, element) {
    let target = placementObj.parent;
    const arrow = element.find('div.arrow');
    const dir = placementObj.placement;
    let targetRect = {};
    const elementRect = element[0].getBoundingClientRect();
    let arrowRect = {};
    let newArrowRect = {};
    let hideArrow = false;

    if (!target || !target.length || !arrow.length) {
      return;
    }

    arrow[0].removeAttribute('style');

    element.removeClass('top right bottom left').addClass(dir);

    // Custom target for some scenarios
    if (target.is('.colorpicker, .datepicker, .timepicker')) {
      target = target.next('.trigger');
    }

    if (target.is('.btn-split-menu, .btn-menu, .btn-actions, .btn-filter, .tab, .tab-more')) {
      target = target.find('.icon').last();
    }
    if (target.is('.searchfield-category-button')) {
      target = target.find('.icon.icon-dropdown');
    }
    if (target.is('.colorpicker-editor-button')) {
      target = target.find('.trigger .icon');
    }
    if (target.is('.fontpicker')) {
      target = target.find('.icon.icon-dropdown');
    }

    // reset if we borked the target
    if (!target.length) {
      target = placementObj.parent;
    }

    targetRect = target.length ? target[0].getBoundingClientRect() : targetRect;
    arrowRect = arrow.length ? arrow[0].getBoundingClientRect() : arrowRect;
    newArrowRect = {};

    function getMargin(placement) {
      return (placement === 'right' || placement === 'left') ? 'margin-top' : 'margin-left';
    }

    function getDistance() {
      let targetCenter = 0;
      let currentArrowCenter = 0;
      let d = 0;

      if (dir === 'left' || dir === 'right') {
        targetCenter = targetRect.top + (targetRect.height / 2);
        currentArrowCenter = arrowRect.top + (arrowRect.height / 2);
        d = targetCenter - currentArrowCenter;
        newArrowRect.top = arrowRect.top + d;
        newArrowRect.bottom = arrowRect.bottom + d;

        if (newArrowRect.top <= elementRect.top || newArrowRect.bottom >= elementRect.bottom) {
          hideArrow = true;
        }
      }
      if (dir === 'top' || dir === 'bottom') {
        targetCenter = targetRect.left + (targetRect.width / 2);
        currentArrowCenter = arrowRect.left + (arrowRect.width / 2);
        d = targetCenter - currentArrowCenter;
        newArrowRect.left = arrowRect.left + d;
        newArrowRect.right = arrowRect.right + d;

        if (newArrowRect.left <= elementRect.left || newArrowRect.right >= elementRect.right) {
          hideArrow = true;
        }
      }

      return d;
    }

    // line the arrow up with the target element's "dropdown icon", if applicable
    const positionOpts = {};
    positionOpts[getMargin(dir)] = getDistance();
    if (hideArrow) {
      positionOpts.display = 'none';
    }
    arrow.css(positionOpts);
  },

  // Handle Updating Settings
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    return this
      .teardown()
      .init();
  },

  // Simple Teardown - remove events & rebuildable markup.
  teardown() {
    this.clearOldStyles();
    this.element.removeClass('placeable');

    this.element.off(`updated.${COMPONENT_NAME} place.${COMPONENT_NAME}`);

    this.element.trigger('afterteardown');
    return this;
  },

  // Teardown - Remove added markup and events
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { PlacementObject, Place, COMPONENT_NAME };
