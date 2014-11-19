/**
* Draggable Drag and Drop Functions
*/
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS - Not Tested TODO
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }
}(function($) {


  //TODO: Resize: http://stackoverflow.com/questions/8258232/resize-an-html-element-using-touches
  $.fn.draggable = function(options) {

    // Settings and Options
    var pluginName = 'draggable',
      defaults = {
        axis: null, //Constrains dragging to either axis. Possible values: 'x', 'y'
        clone: false, //Clone the object - Useful so you dont have to abs position
        containment: false //Constrains dragging to within the bounds of the specified element or region. Possible values: "parent", "document", "window".
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
        this.handleEvents();
      },

      // Handle Touch/Mouse Drag Drop
      handleEvents: function() {
        var self = this;
        self.offset = null;

        //Touch and Drag Support
        self.element.attr('draggable', false)
          .on('touchstart.draggable MSPointerDown.draggable pointerdown.draggable gesturestart.draggable', function(e) {
            var pos = $(this).position(),
                orig = e.originalEvent;

            self.offset = {
              x:  orig.changedTouches[0].pageX - pos.left,
              y:  orig.changedTouches[0].pageY - pos.top
            };
            self.element.trigger('dragstart', pos);
          })
          .on('touchmove.draggable MSPointerMove.draggable pointermove.draggable gesturechange.draggable', function(e) {
            e.preventDefault();
            var orig = e.originalEvent;

            // do now allow two touch points to drag the same element
            if (orig.targetTouches.length > 1) {
              return;
            }
            self.move(orig.changedTouches[0].pageX - self.offset.x, orig.changedTouches[0].pageY - self.offset.y);
          })
          //Mouse Drag Support
          .on('mousedown.draggable', function(e) {
            e.preventDefault();

            var pos = self.element.position();
            //Save offset
            self.offset = {
              x: e.pageX - pos.left,
              y: e.pageY - pos.top
            };

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
            self.element.trigger('dragstart', pos);
          });

          //Finish Touch Dragging
          self.element.on('touchend.draggable MSPointerUp.draggable pointerup.draggable gestureend.draggable touchcancel.draggable' , function (e) {
            e.preventDefault();
            var touch = e.originalEvent.changedTouches[0];
            self.finish(touch.pageX - self.offset.x, touch.pageY - self.offset.y);
          });
      },

      //Trigger events and remove clone
      finish: function (left, top) {
        var pos = {top: top, left: left};

        this.element.off('mouseup.draggable');
        $(document).off('mousemove.draggable mouseup.draggable');

        this.element.trigger('dragend', pos);

        if (this.clone) {
          if (settings.axis === 'x') {
            delete pos.top;
          }

          if (settings.axis === 'y') {
            delete pos.left;
          }
          this.element.css(pos);
          this.clone.remove();
          this.clone = null;
        }

        $('body').removeClass('disable-select');
      },

      //Move the object from the event coords
      move: function(left, top) {
        var upperXLimit, upperYLimit, lowerXLimit, lowerYLimit;

        //Clone
        if (!this.clone && settings.clone) {
          this.clone = this.element.clone(true);
          this.clone.appendTo('body');
        }

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
          this.container = (settings.containment === 'parent'? this.element.parent() : (settings.containment === 'window'? $(window) : $(document)));
          upperXLimit = this.container.width() - this.element.outerWidth();
          upperYLimit = this.container.height() - this.element.outerHeight();

          if (css.top > upperYLimit) {
            css.top = upperYLimit;
          }

          if (css.left > upperXLimit) {
            css.left = upperXLimit;
          }

          if (css.top < 0) {
            css.top = 0;
          }

          if (css.left < 0) {
            css.left = 0;
          }
          console.log(css.left);
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
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
