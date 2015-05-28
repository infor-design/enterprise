/**
* Homepage Control
*/

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

  $.fn.homepage = function(options) {

    // Settings and Options
    var pluginName = 'homepage',

        defaults = {
          gutterSize: 20,
          widgetWidth: 360,
          animate: true,
          timeout: 400,
          columns: 3,
          easing: 'blockslide'
        },
        settings = $.extend({}, defaults, options);

    //Custom Easing Function
    $.easing.blockslide = function (x, t, b, c, d) {
      return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    };

    // Plugin Constructor
    function Homepage(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Homepage.prototype = {

      init: function() {
        this.settings = settings;
        this.attachEvents();

        //Initial Sizing
        this.resize(this, false);
       },

      setBlockSizes: function (phone, tablet) {
        var self = this;

        this.blocks = [];
        this.element.find('.card, .widget').each(function () {
          var card = $(this);

          if (phone && (card.hasClass('triple-width') || card.hasClass('double-width'))) {
            card.addClass('to-single');
          } else if (tablet && (card.hasClass('triple-width'))) {
            card.addClass('to-double').removeClass('to-single');
          } else if (tablet && (card.hasClass('double-width') && card.prev().offset().top === card.offset().top)) {
            card.addClass('to-single').removeClass('to-double');
          } else {
            card.removeClass('to-single to-double');
          }

          self.blocks.push({w: card.width(), h: card.height(), elem: card, text: card.text()});
        });

        var maxAttr = this.element.attr('data-columns');
        this.settings.columns = parseInt((maxAttr ? maxAttr : this.settings.columns));

      },

      attachEvents: function () {
        var self = this,
          timeout;

        //Throttle the Resize Down
        $(window).on('resize.homepage', function() {
          clearTimeout(timeout);
          timeout = setTimeout(function () {
            self.resize(self, self.settings.animate);
          }, 100);
        });

        $('.application-menu').on('applicationmenuopen.homepage applicationmenuclose.homepage', function () {
          self.resize(self, self.settings.animate);
        });

      },

      initBreakpoint: function (w, h) {
        this.root = { x: 0, y: 0, w: w, h: h };
      },

      refresh: function(animate) {
        this.resize(this, (animate ? animate : this.settings.animate));
      },

      // Resize Method
      resize: function(self, animate) {
        //Sizes of "breakpoints" is  320, 660, 1000 , 1340 (for 320)
        //or 360, 740, 1120, 1500 or (for 360)
        var bpXL = (self.settings.widgetWidth * 4) + (self.settings.gutterSize * 3),
          bpDesktop = (self.settings.widgetWidth * 3) + (self.settings.gutterSize *2),
          bpTablet = (self.settings.widgetWidth * 2) + self.settings.gutterSize,
          bpPhone = self.settings.widgetWidth;

        var bp = bpXL, //1340,
          elemWidth = self.element.outerWidth();  //Math min against window.screen.width for single line mobile support

        //$('.card').first().text(self.element.outerWidth() + '' window.screen.width));

         // Find the Breakpoints
        var xl = (elemWidth >= bpXL),
          desktop = (elemWidth >= bpDesktop && elemWidth <= bpXL),
          tablet = (elemWidth >= bpTablet && elemWidth <= bpDesktop),
          phone = (elemWidth <= bpTablet);

        self.setBlockSizes(phone, tablet, desktop);

        if (xl && self.settings.columns === 4) {
          bp = bpXL;
        }
        if (desktop) {
          bp = bpDesktop;
        }
        if (xl && self.settings.columns === 3) {
          bp = bpDesktop;
        }
        if (tablet) {
          bp = bpTablet;
        }
        if (phone) {
          bp = bpPhone;
        }

        self.initBreakpoint(bp, 999999);
        self.element.find('.content').css('margin-left', '-' + (bp/2) + 'px');

        self.fit(self.blocks, phone, tablet);

        for (var n = 0 ; n < self.blocks.length ; n++) {
          var block = self.blocks[n], pos;

          if (block.fit) {
            pos = {left: block.fit.x, top: block.fit.y};

            if (animate) {
              block.elem.animate(pos, self.settings.timeout, self.settings.easing);
            }
            else {
              block.elem.css(pos);
            }
            //block.elem.attr('tabindex', n);
          } else {
           //Error Shouldnt Happen... but when it does it Doesnt Fit
           console.log('Bad');
          }
        }

      },

      //This is a very simple binary tree based bin packing algorithm that is initialized
      //with a fixed width and height and will fit each block into the first node where
      //it fits and then split that node into 2 parts (down and right) to track the
      //remaining whitespace.
      fit: function(blocks) {//, phone, tablet) {
        var n, node, block;

        for (n = 0; n < this.blocks.length; n++) {
          block = blocks[n];
          var elem = $(block.elem);

          node = this.findNode(this.root, block.w, block.h, elem);

          if (node) {
            block.fit = this.splitNode(node, block.w, block.h);
          }

          //Exception Rearranges
          /* if (watchNext) {
            block.fit = {x: 0, y: 386};
            watchNext = false;
          }

          //homepage-3up
          if (!phone && !tablet && elem.hasClass('double-height double-width') && self.blocks[n-1] && self.blocks[n-1].fit.x === 0 && self.blocks[n-1].fit.y ===0){
            block.fit = {x: 376, y: 0};
            watchNext = true;
          }

          //homepage-5up
          if (!phone && !tablet && elem.hasClass('double-height') && !elem.hasClass('double-width') && self.blocks[n-1] && self.blocks[n-1].fit.x === 0 && self.blocks[n-1].fit.y ===0){
            block.fit = {x: 376, y: 0};
            watch1 = n+1;
            watch2 = n+2;
            watch3 = n+3;
          }

          if (n === watch1) {
            block.fit = {x: 756, y: 0};
          }
          if (n === watch2) {
            block.fit = {x: 0, y: 386};
          }
          if (n === watch3) {
            block.fit = {x: 756, y: 386};
          }

          //homepage-wide
          if (!phone && dropNext) {
            block.fit = {x: 0, y: 388};
            dropNext = false;
          }

          if (!phone && !tablet && !elem.hasClass('double-width') && elem.hasClass('double-height')  &&
            self.blocks[n-1] && self.blocks[n-1].fit.x === 0 && self.blocks[n-1].fit.y ===0 &&
            self.blocks[n-1].elem.hasClass('double-width')) {

            block.fit = {x: 756, y: 0};
            dropNext = true;
          } */

        }
      },

      findNode: function(root, w, h, elem) {
        if (root.used) {
          return this.findNode(root.right, w, h, elem) || this.findNode(root.down, w, h, elem);
        } else if ((w <= root.w) && (h <= root.h)) {
          return root;
        } else {
          return null;
        }
      },

      splitNode: function(node, w, h) {
        node.used = true;
        node.down  = { x: node.x,     y: node.y + h + settings.gutterSize, w: node.w,     h: node.h - h };
        node.right = { x: node.x + w + settings.gutterSize, y: node.y,     w: node.w - w, h: h          };
        return node;
      },

      detachEvents: function () {
        $(window).off('resize.homepage');
        $('.application-menu').off('applicationmenuopen.homepage applicationmenuclose.homepage');
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.detachEvents();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Homepage(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
