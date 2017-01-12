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
          containment: null, //document or parent
          save: true
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function Splitter(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Splitter.prototype = {
      init: function() {
        //Do other init (change/normalize settings, load externals, etc)
        return this
          .build()
          .handleEvents();
      },

      // Build the Control and Events
      build: function() {
        var self = this,
          splitter = this.element,
          w = splitter.parent().width(),
          parentHeight = splitter.parent().height();

        //Restore from local storage
        if (localStorage && this.settings.save &&
          !isNaN(parseInt(localStorage[this.uniqueId()]))) {
          w = localStorage[this.uniqueId()];
        }
        this.splitTo(parseInt(w), parentHeight);

        //Add the Splitter Events
        this.documentWidth = 0;

        this.element.drag({axis: this.settings.axis,
          containment: this.settings.containment ? this.settings.containment :
          this.settings.axis === 'x' ? 'document' : 'parent', containmentOffset: {left: 20, top: 0}})
          .on('dragstart.splitter', function () {
            var iframes = $('iframe');
            self.documentWidth = $(document).width();

            if (iframes.length > 0) {
              iframes.each(function() {
                var frame = $(this),
                  overlay = $('<div class="overlay"></div>');
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
            if (args.left <= 0) {
              return false;
            }

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

        if (top > parentHeight || top < 0) {
          top = parseInt(parentHeight) / 2;
        }

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
          w = leftArg;

        //Adjust Left and Right Side
        rightSide.css({'width': ('calc(100% - ' + (w + 20) + 'px)')});
        leftSide.css({'width': ((w) + 'px') , 'margin-right' : '20px', 'border-right': '0'});
        splitter.css('left', leftArg-1);
      },

      //Preferably use the id, but if none that make one based on the url and count
      uniqueId: function () {

        if (this.element.attr('id')) {
          return this.element.attr('id');
        }

        return (window.location.pathname.split('/').pop()) + '-splitter-' + $('.splitter').length;
      },

      splitTo: function (split, parentHeight) {
        var self = this,
          splitter = this.element;

        if (splitter.is('.splitter-right')) {
          this.resizeRight(splitter, split);
        } else if (splitter.is('.splitter-horizontal')) {
          this.resizeTop(splitter, split, parentHeight);
        } else {
          this.resizeLeft(splitter, split);
        }

        this.element.trigger('split', [split]);
        
        function triggerResize() {
          $('body').triggerHandler('resize', [self]);
        }
        Soho.utils.debounce(triggerResize);

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
