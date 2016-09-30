/**
* Place Behavior (TODO: bitly link to soho xi docs)
*/

// NOTE:  There are AMD Blocks available

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
          strategy: 'nudge' // Determines the "strategy" for alternatively placing the element if it doesn't fit in the defined boundaries.  Only matters when "parent" is a defined setting.
        },
        strategies = ['nudge', 'clockwise', 'flip'],
        placements = ['top', 'left', 'right', 'bottom', 'center'],
        xAlignments = ['left', 'center', 'right'],
        yAlignments = ['top', 'center', 'bottom'],
        settings = $.extend({}, defaults, options);

    // Object that contains coordinates along with temporary, changeable properties.
    function PlacementObject(placementOptions) {
      var self = this,
        possibleSettings = ['x', 'y', 'callback', 'parent', 'parentXAlignment', 'parentYAlignment', 'placement', 'strategy'];

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
        this.bleedFromContainer = this.bleedFromContainer === true;
        this.callback = (typeof this.callback === 'function') ? this.callback : settings.callback;
        this.container = (this.container instanceof $ && this.container.length) ? this.container : settings.container;
        this.parent = (this.parent instanceof $ && this.parent.length) ? this.parent : settings.parent;
        this.parentXAlignment = this.isReasonableDefault(this.parentXAlignment, xAlignments) ? this.parentXAlignment : settings.parentXAlignment;
        this.parentYAlignment = this.isReasonableDefault(this.parentYAlignment, yAlignments) ? this.parentYAlignment : settings.parentYAlignment;
        this.placement = this.isReasonableDefault(this.placement, placements) ? this.placement : settings.placement;
        this.strategy = this.isReasonableDefault(this.strategy, strategies) ? this.strategy : settings.strategy;
      },

      setCoordinate: function(coordinate, value) {
        var coordinates = ['x', 'y'];
        if (!this.isReasonableDefault(coordinate, coordinates)) {
          // TODO: log error?
          return;
        }

        if (isNaN(value)) {
          value = 0;
        }

        this[coordinate] = parseInt(value, 10);
      }
    };

    // Plugin Constructor
    function Place(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
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

      isRTL: function() {
        return Locale.isRTL();
      },

      // Main placement API Method (external)
      // Can either take a PlacementObject as a single argument, or can take 2 coordinates (x, y) and
      // will use the pre-defined settings.
      place: function(placementObj) {
        var curr = [
          this.element.css('left'),
          this.element.css('top')
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

        // RTL support
        if (this.isRTL()) {
          placementObj.placement = (function() {
          switch (placementObj.placement) {
            case 'left':
              return 'right';
            case 'right':
              return 'left';
            default:
              return placementObj.placement;
          }})();
        }

        // Use an "relatively positioned container" element, if one exists and the container setting isn't already defined.
        var relativelyPositionedContainers = (placementObj.parent || this.element).parents().filter(function() {
          return $(this).css('position') === 'relative';
        });
        if (!placementObj.container && relativelyPositionedContainers.length) {
          placementObj.container = relativelyPositionedContainers.first();
        }

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

        var parentRect = placementObj.parent[0].getBoundingClientRect(),
          elRect = this.element[0].getBoundingClientRect();

        var coords = (function getCoordsFromPlacement() {
          var cX, cY,
            p = placementObj.placement,
            aX = placementObj.parentXAlignment,
            aY = placementObj.parentYAlignment;

          // Set initial placements
          switch(p) {
            case 'top':
              cY = parentRect.top - elRect.height - placementObj.y;
              break;
            case 'left':
              cX = parentRect.left - elRect.width - placementObj.x;
              break;
            case 'right':
              cX = parentRect.right + placementObj.x;
              break;
            default: // Bottom
              cY = parentRect.bottom + placementObj.y;
              break;
          }

          // Set X alignments on bottom/top placements
          if (p === 'top' || p === 'bottom') {
            switch(aX) {
              case 'left':
                cX = parentRect.left - placementObj.x;
                break;
              case 'right':
                cX = (parentRect.right - elRect.width) + placementObj.x;
                break;
              default: // center
                cX = (parentRect.left + ((parentRect.width - elRect.width) / 2)) + placementObj.x;
                break;
            }
          }

          // Set Y alignments on left/right placements
          if (p === 'right' || p === 'left') {
            switch(aY) {
              case 'top':
                cY = parentRect.top - placementObj.y;
                break;
              case 'bottom':
                cY = (parentRect.bottom - elRect.height) + placementObj.y;
                break;
              default: // center
                cY = (parentRect.top + ((parentRect.height - elRect.height) / 2)) + placementObj.y;
                break;
            }
          }

          return [cX, cY];
        })();

        placementObj.setCoordinate('x', coords[0]);
        placementObj.setCoordinate('y', coords[1]);
        placementObj = this._handlePlacementCallback(placementObj);

        // Simple placement logic
        this.element.offset({
          'left': placementObj.x,
          'top': placementObj.y
        });

        placementObj = this._fixBleeding(placementObj);

        // If the item has bled out over the edge, and we're not ready to give up,
        // try changing the placement strategy.  This won't happen for "nudge", only for the
        // alternate types.
        if (!placementObj.giveup && placementObj.strategy !== 'nudge' && placementObj.fixedBleeding) {
          return this._changePlacementStrategy(placementObj);
        }

        this.element.trigger('afterplace', [
          placementObj
        ]);

        return placementObj;
      },

      // Basic Placement Routine that simply accepts X and Y coordinates.
      // In this case, "x" and "y" integers are "absolute" and will be the base point for placement.
      // Can be modified by using a callback in the settings.
      _placeWithCoords: function(placementObj) {
        placementObj = this._handlePlacementCallback(placementObj);

        // Simple placement logic
        this.element.offset({
          'left': placementObj.x,
          'top': placementObj.y
        });

        placementObj = this._fixBleeding(placementObj);

        this.element.trigger('afterplace', [
          placementObj
        ]);

        return placementObj;
      },

      // Perform callback, if it exists
      // Callback should return an array containing the modified coordinate values: [x, y];
      // NOTE: These are actual coordinates in all cases.  They are not relative values - they are absolute
      _handlePlacementCallback: function(placementObj) {
        var cb = placementObj.callback || this.settings.callback,
          coords = [placementObj.x, placementObj.y];

        if (cb && typeof cb === 'function') {
          coords = cb(coords[0], coords[1]);
        }

        placementObj.setCoordinate('x', coords[0]);
        placementObj.setCoordinate('y', coords[1]);
        return placementObj;
      },

      // Re-adjust a previously-placed element to account for bleeding off the edges.
      // Element must fit within the boundaries of the page or it's current scrollable pane.
      _fixBleeding: function(placementObj) {
        var containerBleed = this.settings.bleedFromContainer,
          container = $(placementObj.container ? placementObj.container : (document.documentElement || document.body.parentNode)),
          rect = this.element[0].getBoundingClientRect(),
          containerRect = container ? container[0].getBoundingClientRect() : {},
          windowH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
          windowW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
          scrollX = (typeof container.scrollLeft === 'number' ? container : document.body).scrollLeft,
          scrollY = (typeof container.scrollTop === 'number' ? container : document.body).scrollTop,
          d;

        function getBoundary(edge) {
          switch(edge) {
            case 'top':
              return (containerBleed ? 0 : containerRect.top) - scrollY; // 0 === top edge of viewport
            case 'left':
              return (containerBleed ? 0 : containerRect.left) - scrollX; // 0 === left edge of viewport
            case 'right':
              return (containerBleed ? windowW : containerRect.right) - scrollX;
            default: // bottom
              return (containerBleed ? windowH : containerRect.bottom) - scrollY;
          }
        }

        // If element width is greater than window width, shrink to fit
        if (rect.width >= windowW) {
          d = rect.width - (windowW - scrollX);
          var newWidth = rect.width - d;

          this.element.css('width', newWidth);
          rect = this.element[0].getBoundingClientRect(); // reset the rect because the size changed
        }

        // If element height is greater than window height, shrink to fit
        if (rect.height >= windowH) {
          d = rect.height - (windowH - scrollY);
          var newHeight = rect.height - d;

          this.element.css('height', newHeight);
          rect = this.element[0].getBoundingClientRect(); // reset the rect because the size changed
        }

        // build conditions
        var offRightEdge = rect.right > getBoundary('right'),
            offLeftEdge = rect.left < getBoundary('left'),
            offBottomEdge = rect.bottom > getBoundary('bottom'),
            offTopEdge = rect.top < getBoundary('top');

        // Keep a record of whether or not the bleeding needed to be fixed.
        placementObj.fixedBleeding = offRightEdge || offLeftEdge || offBottomEdge || offTopEdge || null;

        // Bump element around a bit in each direction, if necessary
        if (offRightEdge) {
          placementObj.setCoordinate('x', placementObj.x - (rect.right - getBoundary('right')));
        }
        if (offLeftEdge) {
          placementObj.setCoordinate('x', placementObj.x + -(rect.left - getBoundary('left')));
        }
        if (offBottomEdge) {
          placementObj.setCoordinate('y', placementObj.y - (rect.bottom - getBoundary('bottom')));
        }
        if (offTopEdge) {
          placementObj.setCoordinate('y', placementObj.y + -(rect.top - getBoundary('top')));
        }

        this.element.offset({
          'left': placementObj.x,
          'top': placementObj.y
        });

        return placementObj;
      },

      // At this point in the positioning loop, if we need to try flipping in a different direction,
      // Do so and retry the positioning algorithm;
      _changePlacementStrategy: function(placementObj) {
        placementObj.fixedBleeding = null;
        placementObj.modified = true;
        placementObj.tried = placementObj.tried || [];

        placementObj.tried.push(placementObj.placement);

        var self = this;

        function tried(placement) {
          return $.inArray(placement, placementObj.tried) > -1;
        }

        function giveup() {
          placementObj.giveup = true;
          placementObj.strategy = self.settings.strategy;
          placementObj.placement = self.settings.placement;
        }

        function flip() {
          var p;

          // If we've tried everything, give up and use the defaults.
          if (placementObj.tried.length > 3) {
            giveup();
            return;
          }

          function performFlip(newDir, perpendicularDir) {
            if (!tried(newDir)) {
              p = newDir;
              return;
            }

            // switch the coordinate definitions
            // since the axis for placement is flipped, our coordinate offsets should also flip
            var tmp = placementObj.originalx;
            placementObj.originalx = placementObj.originaly;
            placementObj.originaly = tmp;

            p = perpendicularDir;
          }

          switch(placementObj.placement) {
            case 'left':
              performFlip('right', 'top');
              break;
            case 'right':
              performFlip('left', 'top');
              break;
            case 'top':
              performFlip('bottom', (self.isRTL() ? 'right' : 'left') );
              break;
            default: // bottom
              performFlip('top', (self.isRTL() ? 'right' : 'left'));
              break;
          }
          placementObj.placement = p;
        }

        function clockwise() {
          // TODO: Write clockwise strategy if we need it.
          // for now, give up immediately.
          giveup();
        }

        if (placementObj.strategy === 'flip') {
          flip();
        }
        if (placementObj.strategy === 'clockwise') {
          clockwise();
        }

        // Reset the original coordinates
        placementObj.setCoordinate('x', placementObj.originalx);
        placementObj.setCoordinate('y', placementObj.originaly);

        return this.place(placementObj);
      },

      // Clears the old styles that may be present
      clearOldStyles: function() {
        this.element.css({
          'left': '',
          'top': '',
          'width': '',
          'height': ''
        });

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
