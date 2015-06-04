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
          widgetHeight: 370,
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

      initColumns: function() {        
        this.rowsAndCols = [];// Keeping all blocks as rows and columns
        this.rowsAndCols[0] = [];

        for (var i = 0, l = this.settings.columns; i < l; i++) {
          this.rowsAndCols[0][i] = true;// Make all columns available in first row[true]
        }
      },

      // Return [x and y] where we can fit this block
      getAvailability: function(block) {
        var i, j, n, l, cols, heightCheck,
          self = this, 
          rows = self.rowsAndCols.length, 
          smallest = {},
          abort = false;

        // Loop thru each row and column soon it found first available spot
        // Then check for if block's width can fit in(yes), asign to [smallest] and break both loops
        for (i = 0, l = rows; i < l && !abort; i++) {
          for (j = 0, heightCheck = true, cols = self.rowsAndCols[i].length; j < cols && !abort; j++) {
            if ((self.rowsAndCols[i][j]) && ((block.w + j) <= cols)) {
              if ((block.h > 1) && (rows > (i+1))) {
                for (n = 0; n < block.h; n++) {
                  if (!self.rowsAndCols[i + n][j]) {
                    heightCheck = false;
                    break;
                  }
                }
              }
              if (heightCheck) {
                smallest.row = i;
                smallest.col = j;
                abort = true;
              }
            }
          }
        }

        // If did not found any available spot from previous loops
        // Add new row and asign to [smallest] first column in this new row
        if (!Object.getOwnPropertyNames(smallest).length) {
          self.rowsAndCols[rows] = []; 
          for (i = 0, l = self.settings.columns; i < l; i++) {
            self.rowsAndCols[rows][i] = true;
          }
          smallest.row = rows;
          smallest.col = 0;
        }

        return smallest; //{x:0, y:0}
      },

      // Make all spots as unavailable, depends on block's width and height
      // Soon we used this block
      fitBlock: function(r, c, block) {
        var i, j, l, l2, 
          self = this, 
          addRow = true;

        block.x = c;
        block.y = r;

        if ((block.w === 1) && (block.h === 1)) { // Single block can fit anywhere
          self.rowsAndCols[r][c] = false;
        } else {
          // If more then one row or column then loop thru to block's width and height
          // If height is more then current rows then add new row
          // Mark those spots as unavailable[false]
          if(block.w !== 1) {
            // Left to right
            for (i = r, l = block.h + r; i < l; i++) {
              for (j = c, l2 = block.w + c; j < l2; j++) {
                self.rowsAndCols[i] = self.rowsAndCols[i] || [];
                self.rowsAndCols[i][j] = false;
              }
            }
          } else {
            // Top to bottom
            for (i = r, l = block.h + r; i < l; i++) {
              for (j = c, l2 = block.h + c; j < l2; j++) {
                self.rowsAndCols[i] = self.rowsAndCols[i] || [];
                self.rowsAndCols[i][c] = false;
              }
            }
          }
        }

        // Check if reach to end of columns then assign flag[addRow]
        for (i = 0, l = self.rowsAndCols[r].length; i < l; i++) {
          if(self.rowsAndCols[r][i]) {
            addRow = false;                 
          }
        }

        // If reach to end of columns and next row is not avaiable then add new row
        // Make all columns available, if not assigned earlier as unavailable
        if (addRow) {
          var newRow = r +1;
          self.rowsAndCols[newRow] = self.rowsAndCols[newRow] || [];
          for (i = 0, l = self.settings.columns; i < l; i++) {
            if (self.rowsAndCols[newRow][i] === undefined) {
              self.rowsAndCols[newRow][i] = true;
            }
          }              
        }
      },

      // Setup each block sizes, based on classes provided from markup
      setBlocks: function() {
        var self = this;
        self.blocks = [];

        self.element.find('.card, .widget').each(function () {
          var card = $(this),
            h = card.hasClass('double-height') ? 2 : 1,
            w = card.hasClass('triple-width') ? 3 : card.hasClass('double-width') ? 2 : 1;

          self.blocks.push({w: w, h: h, elem: card, text: card.text()});
        });
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

      // Resize Method
      resize: function(self, animate) {
        //Sizes of "breakpoints" is  320, 660, 1000 , 1340 (for 320)
        //or 360, 740, 1120, 1500 or (for 360)
        var bpXL    = (self.settings.widgetWidth * 4) + (self.settings.gutterSize * 3),
          bpDesktop = (self.settings.widgetWidth * 3) + (self.settings.gutterSize * 2),
          bpTablet  = (self.settings.widgetWidth * 2) + self.settings.gutterSize,
          bpPhone   = self.settings.widgetWidth;

        var bp = bpXL, //1340,
          elemWidth = self.element.outerWidth(); //Math min against window.screen.width for single line mobile support

        elemWidth -= 30; //extra break space

        // Find the Breakpoints
        var xl    = (elemWidth >= bpXL),
          desktop = (elemWidth >= bpDesktop && elemWidth <= bpXL),
          tablet  = (elemWidth >= bpTablet && elemWidth <= bpDesktop),
          phone   = (elemWidth <= bpTablet);

        var maxAttr = this.element.attr('data-columns');
        this.settings.columns = parseInt((maxAttr ? maxAttr : this.settings.columns));

        // Assign columns as breakpoint sizes
        if (xl && self.settings.columns === 4) {
          self.settings.columns = 4;
          bp = bpXL;
        }
        if ((desktop) || (xl && self.settings.columns === 3)) {
          self.settings.columns = 3;
          bp = bpDesktop;
        }
        if (tablet) {
          self.settings.columns = 2;
          bp = bpTablet;
        }
        if (phone) {
          self.settings.columns = 1;
          bp = bpPhone;
        }

        self.element.find('.content').css('margin-left', '-' + (bp/2) + 'px');

        this.setBlocks(); //setup blocks
        this.initColumns(); //setup colums

        // Loop thru each block, make fit where available and
        // If block more wider than available size, make as  available size
        // Assign new left and top css positions
        for (var i = 0, l = self.blocks.length; i < l; i++) {
          var left, top, pos, available,
            block = self.blocks[i];

          // Remove extra classes if assigned earlier
          block.elem.removeClass('to-double').removeClass('to-single');

          // If block more wider than available size, make as  available size
          if (block.w > self.settings.columns) {
            block.w = self.settings.columns;
            if (self.settings.columns === 1) {
              block.elem.addClass('to-single');
            } else if (self.settings.columns === 2) {
              block.elem.addClass('to-double').removeClass('to-single');
            }
          }

          // Get Availability
          available = self.getAvailability(block);

          // Set positions
          left = (self.settings.widgetWidth + self.settings.gutterSize) * available.col;
          top = (self.settings.widgetHeight + self.settings.gutterSize) * available.row;
          pos = {left: left, top: top};

          if (animate) {
            block.elem.animate(pos, self.settings.timeout, self.settings.easing);
          }
          else {
            block.elem.css(pos);
          }

          // Mark all spots as unavailable for this block, as we just used this one
          self.fitBlock(available.row, available.col, block);
        }
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
