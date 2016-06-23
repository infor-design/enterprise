/**
* Splitter Control
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

  $.fn.splitter = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'splitter',
        defaults = {
          axis: 'x',
          resize: 'immediate',
          containment: null //document or parent
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Splitter(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Splitter.prototype = {
      init: function() {
        //Do other init (change/normalize settings, load externals, etc)
        return this
          .build()
          .handleEvents();
      },

      // Add markup to the control
      build: function() {
        var self = this;
        var parentHeight = this.element.parent().height();

        //Restore from local storage
        if (localStorage) {
          var w = localStorage[this.uniqueId()];
          this.splitTo(parseInt(w), parentHeight);
        }

        //Set the height
        this.element.drag({axis: this.settings.axis,
          containment: this.settings.containment ? this.settings.containment :
          this.settings.axis === 'x' ? 'document' : 'parent'})
          .on('dragstart.splitter', function () {
            var overlay = $('<div class="overlay"></div>'),
              iframes = $('iframe');

            if (iframes.length > 0) {
              iframes.each(function() {
                var frame = $(this);
                frame.before(overlay);
                overlay.css({height: '100%', width: (frame.parent().css('width')) - 40 + 'px', opacity: 0, visibility: 'visible'});
              });
            }
          })
          .on('dragend.splitter', function (e, args) {
            $('.overlay').remove();

            if (self.settings.resize === 'end') {
              self.splitTo(self.settings.axis === 'x' ? args.left : args.top, parentHeight);
            }

          })
          .on('drag.splitter', function (e, args) {
            if (self.settings.resize === 'immediate') {
              self.splitTo(self.settings.axis === 'x' ? args.left : args.top, parentHeight);
            }
          });

        //Horizontal Splitter
        if (this.settings.axis === 'y') {
          this.element.addClass('splitter-horizontal');
        }

        //Aria
        this.element.attr({'aria-dropeffect': 'move', 'tabindex': '0', 'aria-grabbed': 'false'});


        //move handle to left
        if (this.element.is('.splitter-right')) {
          this.orgLeft = this.element.parent().outerWidth();

          if (this.element.parent().is('.content')) {
            this.orgLeft = this.element.parent().parent().outerWidth();
          }

          this.orgLeft -= 21;

          this.element.css('left', this.orgLeft + 'px');
        }

        return this;
      },

      // Sets up event handlers for this control and its sub-elements
      handleEvents: function() {
        var self = this;

        this.element.on('updated.' + pluginName, function() {
          self.updated();
        }).on('keydown.' + pluginName, function(e) {

          //Space will toggle selection
          if (e.which === 32) {
            self.toggleSelection();
            e.preventDefault();
          }

          if (e.which === 37) {
            self.splitTo(self.split - 15, self.parentHeight);
          }

          if (e.which === 39) {
            self.splitTo(self.split + 15, self.parentHeight);
          }

        });


        return this;
      },

      toggleSelection: function () {
        this.element.toggleClass('is-dragging');
      },

      //Resize the panel vertically
      resizeTop: function (splitter, top, parentHeight) {
        //Find the top and bottom panels and set the height
        var topPanel = splitter.prev(),
          bottomPanel = splitter.next();

        topPanel.css('height', top + 'px');
        bottomPanel.css('height', (parentHeight - top) + 'px');
      },

      //Resize the panel to the Left
      resizeLeft: function (splitter, leftArg) {
        //Find the right parents and left and right side
        var rightSide = splitter.parent();

        if (rightSide.is('.content')) {
          rightSide = rightSide.parent();
        }

        var leftSide = rightSide.prev(),
          left = leftSide.parent().outerWidth() - leftArg;

        //Adjust Left and Right Side
        rightSide.css('width', (left + 'px'));
        leftSide.css('width', ('calc(100% - ' + left + 'px)'));

        //Reset the Width
        splitter.css('left', '');
      },

      //Resize the panel to the Right
      resizeRight: function (splitter, leftArg) {
        //Find the right parents and left and right side
        var leftSide = splitter.parent();

        if (leftSide.is('.content')) {
          leftSide = leftSide.parent();
        }

        var rightSide = leftSide.next(),
          w = leftArg + 20;

        //Adjust Left and Right Side
        leftSide.css('width', (w + 'px'));
        rightSide.css('width', ('calc(100% - ' + w + 'px)'));
      },

      //Preferably use the id, but if none that make one based on the url and count
      uniqueId: function () {

        if (this.element.attr('id')) {
          return this.element.attr('id');
        }

        return (window.location.pathname.split('/').pop()) + '-splitter-' + $('.splitter').length;
      },

      splitTo: function (split, parentHeight) {
        var splitter = this.element;

        if (splitter.is('.splitter-right')) {
          this.resizeRight(splitter, split);
        } else if (splitter.is('.splitter-horizontal')) {
          this.resizeTop(splitter, split, parentHeight);
        } else {
          this.resizeLeft(splitter, split);
        }

        this.element.trigger('split', [split]);
        $('body').triggerHandler('resize', [this]);

        //Save to local storage
        if (localStorage) {
          localStorage[this.uniqueId()] = split;
        }

        this.split = split;
        this.parentHeight = parentHeight;
      },

      //Handle Updating Settings
      updated: function() {
        return this
          .teardown()
          .init();
      },

      // Simple Teardown - remove events & rebuildable markup.
      teardown: function() {
        this.element.off('updated.' + pluginName);
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
        instance = $.data(this, pluginName, new Splitter(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
