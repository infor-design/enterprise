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
          side: 'left', // or right
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
          s = this.settings,
          splitter = this.element,
          parent = splitter.parent(),
          w = parent.width(),
          direction = s.axis === 'x' ? 'left' : 'top',
          thisSide = parent.is('.content') ? parent.parent() : parent,
          parentHeight,
          defaultOffset = 299;

        setTimeout(function() {
          parentHeight = parent.height();
        }, 0);

        this.docBody = $('body');
        this.isSplitterRightSide = splitter.is('.splitter-right') || (s.axis === 'x' && s.side === 'right');
        this.isSplitterHorizontal = splitter.is('.splitter-horizontal') || s.axis === 'y';
        s.uniqueId = this.uniqueId();

        if (this.isSplitterRightSide) {
          this.leftSide = thisSide;

          thisSide.addClass('is-right-side')
            .next().addClass('flex-grow-shrink is-right-side')
            .parent().addClass('splitter-container');

          splitter.addClass('splitter-right');

          if (s.collapseButton) {
            var savedOffset = 0;
            var $splitterButton = $('<button type="button" class="splitter-btn" id="splitter-collapse-btn" title="Collapse"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-double-chevron"></use></svg></button>');
            $splitterButton.appendTo(splitter);
            if (splitter[0].offsetLeft > 10) {
              $('#splitter-collapse-btn').addClass('rotate');
            }
            $('#splitter-collapse-btn').click(function() {
              if (savedOffset <= 0) {
                if (splitter[0].offsetLeft <= 10){
                  self.splitTo(defaultOffset, parentHeight);
                  $(this).addClass('rotate');
                } else {
                  savedOffset = splitter[0].offsetLeft;
                  self.splitTo(0, parentHeight);
                  $(this).removeClass('rotate');
                }
              } else {
                if (splitter[0].offsetLeft > 10){
                  savedOffset = splitter[0].offsetLeft;
                  self.splitTo(0, parentHeight);
                  $(this).removeClass('rotate');
                } else {
                  self.splitTo(savedOffset, parentHeight);
                  $(this).addClass('rotate');
                  savedOffset = 0;
                }
              }
            });
          }
        }
        else if (this.isSplitterHorizontal) {
          this.topPanel = splitter.prev();
          w = this.topPanel.height();

          parent.addClass('splitter-container is-horizontal');
          splitter.next().addClass('flex-grow-shrink');
          splitter.addClass('splitter-horizontal');
        } else {
          this.rightSide = thisSide;
          this.leftSide = thisSide.prev().parent();

          thisSide.prev()
            .addClass('flex-grow-shrink')
            .parent().addClass('splitter-container');
        }

        //Restore from local storage
        if (localStorage && s.save &&
          !isNaN(parseInt(localStorage[s.uniqueId]))) {
          w = localStorage[s.uniqueId];
        }

        w = parseInt(w);

        if (this.isSplitterHorizontal) {
          splitter[0].style.top = w + 'px';
        } else {
          splitter[0].style.top = 0;
        }

        this.splitTo(w, parentHeight);

        //Add the Splitter Events
        this.documentWidth = 0;

        this.element.drag({
          axis: s.axis,
          containment: s.containment || s.axis === 'x' ? 'document' : 'parent',
          containmentOffset: {left: 20, top: 0}
        })
        .on('dragstart.splitter', function () {
          var iframes = $('iframe');
          self.documentWidth = $(document).width();

          if (iframes.length > 0) {
            for (var i = 0, l = iframes.length; i < l; i++) {
              var frame = $(iframes[i]),
                width = parseInt(getComputedStyle(frame.parent()[0]).width, 10) - 40 +'px';
              frame.before('<div class="overlay" style="opacity: 0; visibility: visible; height: 100%; width: '+ width +'"></div>');
            }
          }
        })
        .on('dragend.splitter', function (e, args) {
          $('.overlay').remove();

          if (s.collapseButton) {
            if (args[direction] <= 10) {
              $('#splitter-collapse-btn').removeClass('rotate');
            } else {
              $('#splitter-collapse-btn').addClass('rotate');
            }
          }

          if (s.resize === 'end') {
            self.splitTo(args[direction], parentHeight);
          }

        })
        .on('drag.splitter', function (e, args) {
          if (args.left <= 0) {
            return false;
          }
          if (s.resize === 'immediate') {
            self.splitTo(args[direction], parentHeight);
          }
        });

        //Horizontal Splitter
        if (s.axis === 'y') {
          this.element.addClass('splitter-horizontal');
        }

        //Aria
        this.element.attr({'aria-dropeffect': 'move', 'tabindex': '0', 'aria-grabbed': 'false'});

        return this;
      },

      toggleSelection: function () {
        this.element.toggleClass('is-dragging');
      },

      //Resize the panel vertically
      resizeTop: function (splitter, top, parentHeight) {
        if (top > parentHeight || top < 0) {
          top = parseInt(parentHeight) / 2;
        }

        this.topPanel[0].style.height = top + 'px';
      },

      //Resize the panel to the Left
      resizeLeft: function (splitter, leftArg) {
        var left = this.leftSide.outerWidth() - leftArg;

        //Adjust Left and Right Side
        this.rightSide[0].style.width = left + 'px';

        //Reset the Width
        splitter[0].style.left = '';
      },

      //Resize the panel to the Right
      resizeRight: function (splitter, w) {
        //Adjust Left and Right Side
        this.leftSide[0].style.width = w + 'px';
        splitter[0].style.left = (w-1) +'px';
      },

      //Preferably use the id, but if none that make one based on the url and count
      uniqueId: function () {
        return this.element.attr('id') ||
          (window.location.pathname.split('/').pop()) + '-splitter-' + $('.splitter').length;
      },

      splitTo: function (split, parentHeight) {
        var self = this,
          splitter = this.element;

        if (this.isSplitterRightSide) {
          this.resizeRight(splitter, split);
        } else if (this.isSplitterHorizontal) {
          this.resizeTop(splitter, split, parentHeight);
        } else {
          this.resizeLeft(splitter, split);
        }

        this.element.trigger('split', [split]);
        this.docBody.triggerHandler('resize', [self]);

        //Save to local storage
        if (localStorage) {
          localStorage[this.settings.uniqueId] = split;
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
      },

      /**
       * Sets up event handlers for this control and its sub-elements
       *
       * @fires Splitter#events
       * @param {Object} updated  &nbsp;-&nbsp; Fires when the component updates.
       * @param {Object} keydown  &nbsp;-&nbsp; Fires when a key is pressed while the component is focused.
       */
      handleEvents: function() {
        var self = this;

        this.element
          .on('updated.' + pluginName, function() {
            self.updated();
          })
          .on('keydown.' + pluginName, function(e) {
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
