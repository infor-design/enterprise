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

  $.fn.drag = function(options) {
    //TODO: Resize: http://stackoverflow.com/questions/8258232/resize-an-html-element-using-touches
    // Similar: https://github.com/desandro/draggabilly
    'use strict';

    // Settings and Options
    var pluginName = 'drag',
      defaults = {
        axis: null, //Constrains dragging to either axis. Possible values: 'x', 'y'
        clone: false, //Clone the object - Useful so you dont have to abs position
        clonePosIsFixed: false, //Clone object use as css style "position: fixed"
        cloneAppentTo: null, //AppentTo selector for clone ['body'|'parent'|'jquery object'] default:'body'
        containment: false, //Constrains dragging to within the bounds of the specified element or region. Possible values: "parent", "document", "window".
        obstacle: false, //Selector of object(s) that you cannot drag into,
        containmentOffset: {left: 0, top: 0}
      },
      settings = $.extend({}, defaults, options);

    /**
     * Drag and Drop Functions with Touch Support
     * @constructor
     * @param {Object} element
     */
    function Drag(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Drag.prototype = {

      init: function() {
        this.handleEvents();
      },

      // Handle Touch/Mouse Drag Drop
      handleEvents: function() {
        var self = this;
        self.offset = null;

        //Touch and Drag Support
        self.element.attr('draggable', false);

        if ('onpointerdown' in window || 'onmspointerdown' in window) {
          // Setup pointer events
          // TODO: Setup Pointer Events for IE10/11
          /*
          self.element.on('pointerdown MSPointerDown', function(e) {

          })
          .on('pointermove MSPointerMove', function(e) {

          })
          .on('pointerup MSPointerUp', function(e) {

          });
          */
        }
        else {

          //Touch-only Drag Support
          self.element.on('touchstart.draggable gesturestart.draggable', function(e) {
            var pos = $(this).position(),
                orig = e.originalEvent;

            self.offset = {
              x:  orig.changedTouches[0].pageX - pos.left,
              y:  orig.changedTouches[0].pageY - pos.top
            };

            self.originalPos = pos;
            self.element.addClass('is-dragging');
            self.element.trigger('dragstart', pos);
          })

          // Move
          .on('touchmove.draggable gesturechange.draggable', function(e) {
            e.preventDefault();
            var orig = e.originalEvent;

            // do now allow two touch points to drag the same element
            if (orig.targetTouches.length > 1) {
              return;
            }
            self.move(orig.changedTouches[0].pageX - self.offset.x, orig.changedTouches[0].pageY - self.offset.y);
          })

          //Finish Touch Dragging
          .on('touchend.draggable gestureend.draggable touchcancel.draggable', function (e) {
            e.preventDefault();
            var touch = e.originalEvent.changedTouches[0];
            self.finish(touch.pageX - self.offset.x, touch.pageY - self.offset.y);
          });

        }

        // Always bind mousedown in either scenario, in the event that a mouse is used
        self.element.on('mousedown.draggable', function(e) {
          e.preventDefault();


          var pos = settings.clonePosIsFixed ?
            self.element[0].getBoundingClientRect() : self.element.position();

          //Save offset
          self.offset = {
            x: e.pageX - pos.left,
            y: e.pageY - pos.top
          };

          self.originalPos = pos;

          //Prevent Text Selection
          $('body').addClass('disable-select');

          //Handle Mouse Press over draggable element
          $(document).on('mousemove.draggable', function (e) {
            e.preventDefault();
            self.move(e.pageX - self.offset.x, e.pageY - self.offset.y);
          });

          //Handle Mouse release over draggable element close out events and trigger
          $(document).on('mouseup.draggable', function (e) {
            e.preventDefault();
            self.finish(e.pageX - self.offset.x, e.pageY - self.offset.y);
          });

          self.element.on('mouseup.draggable', function (e) {
            e.preventDefault();
            self.finish(e.pageX - self.offset.x, e.pageY - self.offset.y);
          });

          //Trigger dragging
          //Clone
          if (!self.clone && settings.clone) {
            self.clone = self.element.clone(true);
            if (settings.cloneAppentTo === 'parent') {
              settings.cloneAppentTo = self.element.parent();
            }
            self.clone.appendTo(settings.cloneAppentTo || 'body');

          }

          self.element.addClass('is-dragging');
          self.element.trigger('dragstart', [pos, self.clone]);
        });

      },

      //Trigger events and remove clone
      finish: function (left, top) {
        var pos = {top: top, left: left};

        this.element.off('mouseup.draggable');
        $(document).off('mousemove.draggable mouseup.draggable');

        this.element.trigger('dragend', pos);
        this.element.removeClass('is-dragging');

        if (this.clone) {
          if (settings.axis === 'x') {
            delete pos.top;
          }

          if (settings.axis === 'y') {
            delete pos.left;
          }
          //this.element.css(pos);
          this.clone.remove();
          this.clone = null;
        }

        //Clear Cached Sizes
        if (this.obstacle) {
          this.obstacle = null;
        }
        if (this.upperYLimit) {
          this.upperYLimit = null;
        }
        if (this.upperXLimit) {
          this.upperXLimit = null;
        }
        $('body').removeClass('disable-select');
      },

      //Move the object from the event coords
      move: function(left, top) {
        var self = this;

        var css = {
          left: left,
          top: top
        };

        //X-Y Axis
        if (settings.axis === 'x') {
          delete css.top;
        }

        if (settings.axis === 'y') {
          delete css.left;
        }

        if (settings.containment) {

          if (settings.containment === 'parent') {
            this.container = this.element.parent();
          } else if (settings.containment === 'window') {
            this.container = $(window);
          } else if (settings.containment === 'container') {
            this.container = this.element.closest('.page-container');
          } else {
            this.container = $(document);
          }

          if (!this.upperXLimit) {
            this.upperXLimit = this.container.width() - this.element.outerWidth() + settings.containmentOffset.left;
          }
          if (!this.upperXLimit) {
            this.upperYLimit = this.container.height() - this.element.outerHeight() + settings.containmentOffset.top;
          }
          if (css.top > this.upperYLimit) {
            css.top = this.upperYLimit;
          }

          if (css.left > this.upperXLimit) {
            css.left = this.upperXLimit;
          }

          if (css.top < 0) {
            css.top = 0;
          }

          if (css.left < 0) {
            css.left = 0;
          }

          if (settings.containment === 'container' && css.left <= 1) {
            css.left = 1;
          }
        }

        if (settings.obstacle) {
          var elemOffset = (this.clone ? this.clone.offset() : this.element.offset()),
            elemWidth = (this.clone ? this.clone.outerWidth() : this.element.outerWidth()),
            movingRight = css.left > elemOffset.left;

          // Caching this so drag is not jaggie
          if (!this.obstacle) {
            this.obstacle = $(settings.obstacle).not(this.element);
            this.constraints = {top: this.obstacle.offset().top, left: this.obstacle.offset().left,
              bottom: this.obstacle.offset().top + this.obstacle.outerHeight(), right: this.obstacle.offset().left + this.obstacle.outerWidth()};
          }

          if (!movingRight && self.originalPos.left > this.constraints.left && css.left <= this.constraints.right) {
            css.left = this.constraints.right;
          }

          if (movingRight && self.originalPos.left + elemWidth <= this.constraints.left && css.left + elemWidth >= this.constraints.left) {
            css.left = (this.constraints.left - this.obstacle.outerWidth());
          }

          //TODO: Moving Down
        }

        if (this.clone) {
          this.clone.css(css);
        } else {
          this.element.css(css);
        }
        this.element.trigger('drag', css);
      },

      // Teardown
      destroy: function() {
        $.removeData(this.element[0], pluginName);
        this.element.off('touchstart.draggable MSPointerDown.draggable pointerdown.draggable touchmove.draggable touchend.draggable touchcancel.draggable mousedown.draggable');
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Drag(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
