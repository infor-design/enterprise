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

  //NOTE: Just this part will show up in SoHo Xi Builds.

  $.fn.place = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'place',
        defaults = {
          bleedFromContainer: false, // If true, allows positioned content to bleed outside of a defined container.
          callback: null, // If defined, provides extra placement adjustments after the main calculation is performed.
          container: null, // If defined, contains the placement of the element to the boundaries of a specific container element.
          parent: null, // If defined, will be used as the reference element for placement this element.
          parentXAlignment: 'center',
          parentYAlignment: 'center', // Only used for parent-based placement. Determines the alignment of the placed element against its parent. value 0 === X, value 1 === Y
          placement: 'bottom', // If defined, changes the direction in which placement of the element happens
          strategies: ['nudge'] // Determines the "strategy" for alternatively placing the element if it doesn't fit in the defined boundaries.  Only matters when "parent" is a defined setting.  It's possible to define multiple strategies and execute them in order.
        },
        strategies = ['nudge', 'clockwise', 'flip', 'shrink', 'shrink-x', 'shrink-y'],
        placements = ['top', 'left', 'right', 'bottom', 'center'],
        xAlignments = ['left', 'center', 'right'],
        yAlignments = ['top', 'center', 'bottom'],
        settings = $.extend({}, defaults, options);

    /**
     * Object that contains coordinates along with temporary, changeable properties.
     * This object gets passed around the Place Behavior and modified during each phase of positioning.
     * This object is also passed to all callbacks and event listeners for further modification.
     * @constructor
     * @param {object} placementOptions
     */
    function PlacementObject(placementOptions) {
      var self = this,
        possibleSettings = [
          'x', 'y',
          'container', 'containerOffsetX', 'containerOffsetY',
          'callback',
          'parent', 'parentXAlignment', 'parentYAlignment',
          'placement',
          'strategies'
        ];

      possibleSettings.forEach(function settingIterator(val) {
        if (placementOptions[val] === null) {
          return;
        }

        if (val === 'x' || val === 'y') {
          self.setCoordinate(val, placementOptions[val]);
          self['original' + val] = placementOptions[val];
          return;
        }

        self[val] = placementOptions[val];
      });

      this.modified = false;

      return this.sanitize();
    }

    PlacementObject.prototype = {
      isReasonableDefault: function(setting, limits) {
        return $.inArray(setting, limits) > -1;
      },

      sanitize: function() {
        var self = this;

        this.bleedFromContainer = this.bleedFromContainer === true;
        this.callback = (typeof this.callback === 'function') ? this.callback : settings.callback;
        this.container = (this.container instanceof $ && this.container.length) ? this.container : settings.container;
        this.containerOffsetX = !isNaN(parseInt(this.containerOffsetX)) ? this.containerOffsetX : 0;
        this.containerOffsetY = !isNaN(parseInt(this.containerOffsetY)) ? this.containerOffsetY : 0;
        this.parent = (this.parent instanceof $ && this.parent.length) ? this.parent : settings.parent;
        this.parentXAlignment = this.isReasonableDefault(this.parentXAlignment, xAlignments) ? this.parentXAlignment : settings.parentXAlignment;
        this.parentYAlignment = this.isReasonableDefault(this.parentYAlignment, yAlignments) ? this.parentYAlignment : settings.parentYAlignment;
        this.placement = this.isReasonableDefault(this.placement, placements) ? this.placement : settings.placement;

        if (!$.isArray(this.strategies) || !this.strategies.length) {
          this.strategies = ['nudge'];
        }
        this.strategies.forEach(function(strat, i) {
          self.strategies[i] = self.isReasonableDefault(strat, strategies) ? strat : self.strategies[i];
        });

      },

      setCoordinate: function(coordinate, value) {
        var coordinates = ['x', 'y'];
        if (!this.isReasonableDefault(coordinate, coordinates)) {
          return;
        }

        if (isNaN(value)) {
          value = 0;
        }

        this[coordinate] = parseInt(value, 10);
      }
    };

    // Place Behavior Constructor
    // This is the actual "thing" that is tied to a Placeable Element.
    function Place(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    Place.prototype = {
      init: function() {
        //Do other init (change/normalize settings, load externals, etc)
        return this
          .build()
          .handleEvents();
      },

      // Add markup to the control
      build: function() {
        if (!this.element.hasClass('placeable')) {
          this.element.addClass('placeable');
        }

        // Setup a hash of original styles that will retain width/height whenever
        // the placement for this element is recalculated.
        this.originalStyles = {};
        var h = this.element[0].style.height,
          w = this.element[0].style.width;

        if (h) {
          this.originalStyles.height = h;
        }
        if (w) {
          this.originalStyles.width = w;
        }

        return this;
      },

      // Sets up event handlers for this control and its sub-elements
      handleEvents: function() {
        var self = this;

        this.element.on('place.' + pluginName, function placementEventHandler(e, x, y) {
          self.place(new PlacementObject({ x: x, y: y }));
        }).on('updated.' + pluginName, function updatedEventHandler() {
          self.updated();
        });

        return this;
      },

      // Actually renders an element with coordinates inside the DOM
      render: function(placementObj) {
        this.element.offset({
          'left': placementObj.x,
          'top': placementObj.y
        });

        if (placementObj.height) {
          this.element[0].style.height = placementObj.height + (/(px|%)/i.test(placementObj.height + '') ? '' : 'px');
        }
        if (placementObj.width) {
          this.element[0].style.width = placementObj.width + (/(px|%)/i.test(placementObj.width + '') ? '' : 'px');
        }
      },

      // Main placement API Method (external)
      // Can either take a PlacementObject as a single argument, or can take 2 coordinates (x, y) and
      // will use the pre-defined settings.
      place: function(placementObj) {
        var curr = [
          this.element[0].style.left,
          this.element[0].style.top,
        ];

        // Cancel placement with return:false; from a "beforeplace" event
        var canBePlaced = this.element.trigger('beforeplace', [curr]);
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
          return this._placeWithParent(placementObj);
        }

        return this._placeWithCoords(placementObj);
      },

      // Placement Routine that expects a parent to be used as a base placement marking.
      // In this case, "x" and "y" integers are "relative" adjustments to the original numbers generated by the parent.
      // Can be modified by using a callback in the settings.
      _placeWithParent: function(placementObj) {
        if (!placementObj.parent || !placementObj.parent.length) {
          return [undefined, undefined]; // can't simply return x and y here because they are not coordinates, they are offsets
        }

        var self = this,
          parentRect = placementObj.parent[0].getBoundingClientRect(),
          elRect = this.element[0].getBoundingClientRect(),
          container = this.getContainer(placementObj),
          containerIsBody = container.length && container[0] === document.body,
          // NOTE: Usage of $(window) instead of $('body') is deliberate here - http://stackoverflow.com/a/17776759/4024149.
          // Firefox $('body').scrollTop() will always return zero.
          scrollX = containerIsBody ? $(window).scrollLeft() : container.scrollLeft(),
          scrollY = containerIsBody ? $(window).scrollTop() : container.scrollTop();

        function getCoordsFromPlacement(placementObj) {
          var cX, cY,
            p = placementObj.placement,
            aX = placementObj.parentXAlignment,
            aY = placementObj.parentYAlignment;

          // Set initial placements
          switch(p) {
            case 'top':
              cY = parentRect.top - elRect.height - placementObj.y + (containerIsBody ? scrollY : 0);
              break;
            case 'left':
              cX = parentRect.left - elRect.width - placementObj.x + (containerIsBody ? scrollX : 0);
              break;
            case 'right':
              cX = parentRect.right + placementObj.x + (containerIsBody ? scrollX : 0);
              break;
            default: // Bottom
              cY = parentRect.bottom + placementObj.y + (containerIsBody ? scrollY : 0);
              break;
          }

          // Set X alignments on bottom/top placements
          if (p === 'top' || p === 'bottom') {
            switch(aX) {
              case 'left':
                cX = parentRect.left - placementObj.x + (containerIsBody ? scrollX : 0);
                break;
              case 'right':
                cX = (parentRect.right - elRect.width) + placementObj.x + (containerIsBody ? scrollX : 0);
                break;
              default: // center
                cX = (parentRect.left + ((parentRect.width - elRect.width) / 2)) + placementObj.x + (containerIsBody ? scrollX : 0);
                break;
            }
          }

          // Set Y alignments on left/right placements
          if (p === 'right' || p === 'left') {
            switch(aY) {
              case 'top':
                cY = parentRect.top - placementObj.y + (containerIsBody ? scrollY : 0);
                break;
              case 'bottom':
                cY = (parentRect.bottom - elRect.height) + placementObj.y + (containerIsBody ? scrollY : 0);
                break;
              default: // center
                cY = (parentRect.top + ((parentRect.height - elRect.height) / 2)) + placementObj.y + (containerIsBody ? scrollY : 0);
                break;
            }
          }

          return [cX, cY];
        }

        function doPlacementAgainstParent(placementObj) {
          var coords = getCoordsFromPlacement(placementObj);
          placementObj.setCoordinate('x', coords[0]);
          placementObj.setCoordinate('y', coords[1]);
          self.render(placementObj);
          placementObj = self._handlePlacementCallback(placementObj);
          return placementObj;
        }

        // Simple placement logic
        placementObj = doPlacementAgainstParent(placementObj);

        // Adjusts the placement coordinates based on a defined strategy
        // Will only adjust the current strategy if bleeding outside the viewport/container are detected.
        placementObj.strategies.forEach(function(strat) {
          placementObj = self.checkBleeds(placementObj);

          if (placementObj.bleeds) {
            placementObj = (function(self) {
              switch(strat) {
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
            })(self);

            self.render(placementObj);
          }
        });

        // Trigger an event to notify placement has ended
        this.element.trigger('afterplace', [placementObj]);

        return placementObj;
      },

      // Basic Placement Routine that simply accepts X and Y coordinates.
      // In this case, "x" and "y" integers are "absolute" and will be the base point for placement.
      // Can be modified by using a callback in the settings.
      _placeWithCoords: function(placementObj) {
        this.render(placementObj);

        placementObj = this._handlePlacementCallback(placementObj);

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

      // Perform callback, if it exists
      // Callback should return an array containing the modified coordinate values: [x, y];
      // NOTE: These are actual coordinates in all cases.  They are not relative values - they are absolute
      _handlePlacementCallback: function(placementObj) {
        var cb = placementObj.callback || this.settings.callback;

        if (cb && typeof cb === 'function') {
          placementObj = cb(placementObj);
        }

        this.render(placementObj);
        return placementObj;
      },

      // Gets a parent container element.
      getContainer: function(placementObj) {
        if (placementObj.container instanceof $ && placementObj.container.length) {
          return placementObj.container;
        }

        var modalParent = this.element.parents('.modal');
        if (modalParent.length) {
          return modalParent;
        }

        return $(document.body);
      },

      // Re-adjust a previously-placed element to account for bleeding off the edges.
      // Element must fit within the boundaries of the page or it's current scrollable pane.
      checkBleeds: function(placementObj) {
        var containerBleed = this.settings.bleedFromContainer,
          container = this.getContainer(placementObj),
          containerIsBody = container.length && container[0] === document.body,
          BoundingRect = this.element[0].getBoundingClientRect(),
          rect = {},
          containerRect = container ? container[0].getBoundingClientRect() : {},
          // NOTE: Usage of $(window) instead of $('body') is deliberate here - http://stackoverflow.com/a/17776759/4024149.
          // Firefox $('body').scrollTop() will always return zero.
          scrollX = containerIsBody ? $(window).scrollLeft() : container.scrollLeft(),
          scrollY = containerIsBody ? $(window).scrollTop() : container.scrollTop(),
          windowH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
          windowW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
          d;

          rect.width = BoundingRect.width;
          rect.height = BoundingRect.height;
          rect.top = BoundingRect.top;
          rect.right = BoundingRect.right;
          rect.bottom = BoundingRect.bottom;
          rect.left = BoundingRect.left;

        function getBoundary(edge) {
          switch(edge) {
            case 'top':
              return (containerBleed ? 0 : containerRect.top) - (!containerIsBody ? 0 : scrollY * -1); // 0 === top edge of viewport
            case 'left':
              return (containerBleed ? 0 : containerRect.left) - (!containerIsBody ? 0 : scrollX * -1); // 0 === left edge of viewport
            case 'right':
              return (containerBleed ? windowW : containerRect.right) - (!containerIsBody ? 0 : scrollX * -1);
            default: // bottom
              return (containerBleed ? windowH : containerRect.bottom) - (!containerIsBody ? 0 : scrollY * -1);
          }
        }

        // If element width is greater than window width, shrink to fit
        var rightViewportEdge = getBoundary('right');
        if (rect.width >= rightViewportEdge) {
          d = rect.width - rightViewportEdge;
          var newWidth = rect.width - d;
          placementObj.width = newWidth;

          this.element[0].style.width = newWidth + 'px';
          rect.width = newWidth; // reset the rect because the size changed
        }

        // If element height is greater than window height, shrink to fit
        var bottomViewportEdge = getBoundary('bottom');
        if (rect.height >= bottomViewportEdge) {
          d = rect.height - bottomViewportEdge;
          var newHeight = rect.height - d;
          placementObj.height = newHeight;

          this.element[0].style.height = newHeight + 'px';
          rect.height = newHeight; // reset the rect because the size changed
        }

        // build conditions
        var offRightEdge = rect.right > getBoundary('right'),
            offLeftEdge = rect.left < getBoundary('left'),
            offTopEdge = rect.top < getBoundary('top'),
            offBottomEdge = rect.bottom > getBoundary('bottom');

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
      nudge: function(placementObj) {
        if (!placementObj.nudges) {
          placementObj.nudges = {x: 0, y: 0};
        }

        var d = 0;
        if (placementObj.bleeds.right) {
          d = Math.abs(placementObj.bleeds.right) + Math.abs(placementObj.containerOffsetX);
          placementObj.setCoordinate('x', placementObj.x - d);
          placementObj.nudges.x = placementObj.nudges.x - d;
        }
        if (placementObj.bleeds.left) {
          d = Math.abs(placementObj.bleeds.left) + Math.abs(placementObj.containerOffsetX);
          placementObj.setCoordinate('x', placementObj.x + d);
          placementObj.nudges.x = placementObj.nudges.x + d;
        }
        if (placementObj.bleeds.top) {
          d = Math.abs(placementObj.bleeds.top) + Math.abs(placementObj.containerOffsetY);
          placementObj.setCoordinate('y', placementObj.y + d);
          placementObj.nudges.y = placementObj.nudges.y + d;
        }
        if (placementObj.bleeds.bottom) {
          d = Math.abs(placementObj.bleeds.bottom) + Math.abs(placementObj.containerOffsetY);
          placementObj.setCoordinate('y', placementObj.y - d);
          placementObj.nudges.y = placementObj.nudges.y - d;
        }

        placementObj.wasNudged = true;
        placementObj.bleeds = undefined;

        return placementObj;
      },

      flip: function(placementObj) {
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

        var isXCoord = ['left', 'right'].indexOf(placementObj.placement) > -1,
          containerBleed = this.settings.bleedFromContainer,
          container = this.getContainer(placementObj),
          containerIsBody = container.length && container[0] === document.body,
          containerRect = container ? container[0].getBoundingClientRect() : {},
          parentRect = placementObj.parent[0].getBoundingClientRect(),
          // NOTE: Usage of $(window) instead of $('body') is deliberate here - http://stackoverflow.com/a/17776759/4024149.
          // Firefox $('body').scrollTop() will always return zero.
          scrollX = containerIsBody ? $(window).scrollLeft() : container.scrollLeft(),
          scrollY = containerIsBody ? $(window).scrollTop() : container.scrollTop(),
          windowH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
          windowW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        function getOppositeDir(dir) {
          switch(dir) {
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
          var d = 0;

          switch (dir) {
            case 'left':
              d = (containerBleed ? 0 : containerRect.left) - (!containerIsBody ? scrollX : 0) - parentRect.left + placementObj.containerOffsetX;
              break;
            case 'right':
              d = ((containerBleed ? windowW : containerRect.right) - (!containerIsBody ? scrollX : 0)) - parentRect.right - placementObj.containerOffsetX;
              break;
            case 'top':
              d = (containerBleed ? 0 : containerRect.top) - (!containerIsBody ? scrollY : 0) - parentRect.top + placementObj.containerOffsetY;
              break;
            default: // bottom
              d = ((containerBleed ? windowH : containerRect.bottom) - (!containerIsBody ? scrollY : 0)) - parentRect.bottom - placementObj.containerOffsetY;
              break;
          }

          return Math.abs(d);
        }

        function tried(placement) {
          return $.inArray(placement, placementObj.attemptedFlips) > -1;
        }

        function performFlip(originalDir) {
          var newDir = getOppositeDir(originalDir),
            perpendicularDir = isXCoord ? 'top' : 'left',
            oppPerpendicularDir = getOppositeDir(perpendicularDir),
            originalDistance = getDistance(originalDir),
            targetDistance = getDistance(newDir);

          if (!tried(newDir)) {
            if (originalDistance >= targetDistance) {
              return originalDir;
            }
            return newDir;
          }

          // switch the coordinate definitions
          // since the axis for placement is flipped, our coordinate offsets should also flip
          var tmp = placementObj.originalx;
          placementObj.originalx = placementObj.originaly;
          placementObj.originaly = tmp;

          var perpendicularDistance = getDistance(perpendicularDir),
            oppPerpendicularDistance = getDistance(oppPerpendicularDir);

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
      clockwise: function(placementObj) {
        return placementObj;
      },

      // If element height/width is greater than window height/width, shrink to fit
      shrink: function(placementObj, dimension) {
        var containerBleed = this.settings.bleedFromContainer,
          container = this.getContainer(placementObj),
          containerRect = container ? container[0].getBoundingClientRect() : {},
          containerIsBody = container.length && container[0] === document.body,
          rect = this.element[0].getBoundingClientRect(),
          useX = dimension === undefined || dimension === null || dimension === 'x',
          useY = dimension === undefined || dimension === null || dimension === 'y',
          // NOTE: Usage of $(window) instead of $('body') is deliberate here - http://stackoverflow.com/a/17776759/4024149.
          // Firefox $('body').scrollTop() will always return zero.
          scrollX = containerIsBody ? $(window).scrollLeft() : container.scrollLeft(),
          scrollY = containerIsBody ? $(window).scrollTop() : container.scrollTop(),
          windowH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
          windowW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
          leftViewportEdge = (containerBleed ? 0 : containerRect.left + placementObj.containerOffsetX) + scrollX,
          topViewportEdge = (containerBleed ? 0 : containerRect.top + placementObj.containerOffsetY) + scrollY,
          rightViewportEdge = (containerBleed ? windowW : containerRect.right - placementObj.containerOffsetX) + scrollX,
          bottomViewportEdge = (containerBleed ? windowH : containerRect.bottom - placementObj.containerOffsetY) + scrollY,
          d;

        // Shrink in each direction.
        // The value of the "containerOffsets" is "factored out" of each calculation, if for some reason the
        // element is larger than the viewport/container space allowed.
        placementObj.nudges = placementObj.nudges || {};

        if (useX) {
          // Left
          if (rect.left < leftViewportEdge) {
            d = Math.abs(leftViewportEdge - rect.left);
            if (rect.right >= rightViewportEdge) {
              d = d - placementObj.containerOffsetX;
            }
            placementObj.width = rect.width - d;
            placementObj.setCoordinate('x', placementObj.x + d);
            placementObj.nudges.x = placementObj.nudges.x + d;
          }

          // Right
          if (rect.right > rightViewportEdge) {
            d = Math.abs(rect.right - rightViewportEdge);
            if (rect.left <= leftViewportEdge) {
              d = d - placementObj.containerOffsetX;
            }
            placementObj.width = rect.width - d;
          }
        }

        if (useY) {
          // Top
          if (rect.top < topViewportEdge) {
            d = Math.abs(topViewportEdge - rect.top);
            if (rect.bottom >= bottomViewportEdge) {
              d = d - placementObj.containerOffsetY;
            }
            placementObj.height = rect.height - d;
            placementObj.setCoordinate('y', placementObj.y + d);
            placementObj.nudges.y = placementObj.nudges.y + d;
          }

          // Bottom
          if (rect.bottom > bottomViewportEdge) {
            d = Math.abs(rect.bottom - bottomViewportEdge);
            if (rect.top <= topViewportEdge) {
              d = d - placementObj.containerOffsetY;
            }
            placementObj.height = rect.height - d;
          }
        }

        return placementObj;
      },

      // Giving up causes all the placementObj settings to revert
      giveup: function(placementObj) {
        placementObj.giveup = true;
        placementObj.strategy = this.settings.strategy;
        placementObj.placement = this.settings.placement;
        return placementObj;
      },

      // Clears the old styles that may be present
      clearOldStyles: function() {
        this.element[0].style.left = '';
        this.element[0].style.top = '';
        this.element[0].style.width = '';
        this.element[0].style.height = '';

        var os = this.originalStyles;
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
      setArrowPosition: function(e, placementObj, element) {
        var target = placementObj.parent,
          arrow = element.find('div.arrow'),
          dir = placementObj.placement,
          isXCoord = ['left', 'right'].indexOf(dir) > -1,
          targetRect = {},
          elementRect = element[0].getBoundingClientRect(),
          arrowRect = {},
          newArrowRect = {},
          hideArrow = false;

        if (!target || !target.length || !arrow.length) {
          return;
        }

        arrow[0].removeAttribute('style');

        if (placementObj.attemptedFlips) {
          element.removeClass('top right bottom left').addClass(dir);
        }

        // Flip the arrow if we're in RTL mode
        if (this.isRTL && isXCoord) {
          var opposite = dir === 'right' ? 'left' : 'right';
          element.removeClass('right left').addClass(opposite);
        }

        // Custom target for some scenarios
        if (target.is('.colorpicker')) {
          target = target.next('.trigger');
        }
        if (target.is('.datepicker, .timepicker')) {
          target = target.next('.icon');
        }

        if (target.is('.btn-split-menu, .btn-menu, .btn-actions, .btn-filter, .tab')) {
          target = target.find('.icon').last();
        }
        if (target.is('.searchfield-category-button')) {
          target = target.find('.icon.icon-dropdown');
        }
        if (target.is('.colorpicker-editor-button')) {
          target = target.find('.trigger .icon');
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
          var targetCenter = 0,
            currentArrowCenter = 0,
            d = 0;

          if (dir === 'left' || dir === 'right') {
            targetCenter = targetRect.top + (targetRect.height/2);
            currentArrowCenter = arrowRect.top + (arrowRect.height/2);
            d = targetCenter - currentArrowCenter;
            newArrowRect.top = arrowRect.top + d;
            newArrowRect.bottom = arrowRect.bottom + d;

            if (newArrowRect.top <= elementRect.top || newArrowRect.bottom >= elementRect.bottom) {
              hideArrow = true;
            }
          }
          if (dir === 'top' || dir === 'bottom') {
            targetCenter = targetRect.left + (targetRect.width/2);
            currentArrowCenter = arrowRect.left + (arrowRect.width/2);
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
        var positionOpts = {};
        positionOpts[getMargin(dir)] = getDistance();
        if (hideArrow) {
          positionOpts.display = 'none';
        }
        arrow.css(positionOpts);
      },

      //Handle Updating Settings
      updated: function() {
        return this
          .teardown()
          .init();
      },

      // Simple Teardown - remove events & rebuildable markup.
      teardown: function() {
        this.clearOldStyles();
        this.element.removeClass('placeable');

        this.element.off('updated.' + pluginName + ' place.' + pluginName);

        this.element.trigger('afterteardown');
        return this;
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Place(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
