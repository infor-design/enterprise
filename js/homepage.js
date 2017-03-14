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
          timeout: 100,
          columns: 3,
          easing: 'blockslide'
        },
        settings = $.extend({}, defaults, options);


    /**
     * @constructor
     * @param {Object} element
     */
    function Homepage(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Homepage.prototype = {

      init: function() {
        this.settings = settings;
        this.isTransitionsSupports = this.supportsTransitions();
        this.initHeroWidget();
        this.attachEvents();

        //Initial Sizing
        this.resize(this, false);
      },

      initColumns: function(row) {
        row = row || 0;
        this.rowsAndCols[row] = [];

        for (var i = 0, l = this.settings.columns; i < l; i++) {
          this.rowsAndCols[row][i] = true;// Make all columns available in first row[true]
        }
      },

      initHeroWidget: function() {
        var heroWidget = $('.hero-widget');
        if (heroWidget.length > 1) {
          heroWidget = heroWidget.not(':first').remove();
        }
        this.heroWidget = heroWidget;
      },

      initRowsAndCols: function() {
        this.rowsAndCols = [];// Keeping all blocks as rows and columns
        this.initColumns();
      },

      // Return [x and y] where we can fit this block
      getAvailability: function(block) {
        var i, j, n, l, cols, innerCheck,
          self = this,
          rows = self.rowsAndCols.length,
          smallest = {},
          abort = false;

        // Loop thru each row and column soon it found first available spot
        // Then check for if block's width can fit in(yes), asign to [smallest] and break both loops
        for (i = 0, l = rows; i < l && !abort; i++) {
          for (j = 0, innerCheck = true, cols = self.rowsAndCols[i].length; j < cols && !abort; j++) {
            if ((self.rowsAndCols[i][j]) && ((block.w + j) <= cols)) {
              if ((block.w > 1) && (cols > (j+1))) {
                for (n = 0; n < block.w; n++) {
                  if (!self.rowsAndCols[i][j + n]) {
                    innerCheck = false;
                    break;
                  }
                }
              }
              if ((block.h > 1) && (rows > (i+1))) {
                for (n = 0; n < block.h; n++) {
                  if (!self.rowsAndCols[i + n][j]) {
                    innerCheck = false;
                    break;
                  }
                }
              }
              if (innerCheck) {
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
          self.initColumns(rows);
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
                if (!self.rowsAndCols[i]) {
                  self.initColumns(i);
                }
                self.rowsAndCols[i][j] = false;
              }
            }
          } else {
            // Top to bottom
            for (i = r, l = block.h + r; i < l; i++) {
              for (j = c, l2 = block.h + c; j < l2; j++) {
                if (!self.rowsAndCols[i]) {
                  self.initColumns(i);
                }
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
          if (!self.rowsAndCols[r +1]) {
            self.initColumns(r +1);
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
            w = card.hasClass('quad-width') ? 4 : card.hasClass('triple-width') ? 3 : card.hasClass('double-width') ? 2 : 1;

          self.blocks.push({w: w, h: h, elem: card, text: card.text()});
        });

        // Max sized columns brings to top
        for (var i=0, j=0, w=0, l=self.blocks.length; i<l; i++) {
          if (self.settings.columns > 1) {
            if (self.blocks[i].w >= self.settings.columns && i) {
              self.arrayIndexMove(self.blocks, i, j);
            }
            w += self.blocks[i].w;
            if(w >= self.settings.columns) {
              w = 0; //reset
              j = (self.blocks[j].w >= self.settings.columns) ? j+1 : i; //record to move
            }
          }
        }
      },

      //Move an array element position
      arrayIndexMove: function(arr, from, to) {
        arr.splice(to, 0, arr.splice(from, 1)[0]);
      },

      attachEvents: function () {
        var self = this;

        $('body').on('resize.homepage', function() {
          self.resize(self, self.settings.animate);
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

        // elemWidth -= 30; //extra break space

        // Find the Breakpoints
        var xl    = (elemWidth >= bpXL),
          desktop = (elemWidth >= bpDesktop && elemWidth <= bpXL),
          tablet  = (elemWidth >= bpTablet && elemWidth <= bpDesktop),
          phone   = (elemWidth <= bpTablet);

        var maxAttr = this.element.attr('data-columns'),
          content = self.element.find('> .content');
        this.settings.columns = parseInt((maxAttr || this.settings.columns));

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

        if (content.length) {
          content[0].style.marginLeft = '-' + (bp/2) + 'px';
        }

        this.setBlocks(); //setup blocks
        this.initRowsAndCols(); //setup colums

        // Loop thru each block, make fit where available and
        // If block more wider than available size, make as  available size
        // Assign new left and top css positions
        for (var i = 0, l = self.blocks.length; i < l; i++) {
          var left, top, pos, available,
            block = self.blocks[i];

          // Remove extra classes if assigned earlier
          block.elem.removeClass('to-single to-double to-triple');

          // If block more wider than available size, make as available size
          if (block.w > self.settings.columns) {
            block.w = self.settings.columns;

            if (self.settings.columns === 1) {
              block.elem.addClass('to-single');
            }
            else if (self.settings.columns === 2) {
              block.elem.addClass('to-double');
            }
            else if (self.settings.columns === 3) {
              block.elem.addClass('to-triple');
            }
          }

          // Get Availability
          available = self.getAvailability(block);

          // Set positions
          var box = self.settings.widgetWidth + self.settings.gutterSize,
            totalWidth = box * self.settings.columns;

          left = Locale.isRTL() ? totalWidth - ((box * block.w) + (box * available.col)) : box * available.col;
          top = (self.settings.widgetHeight + self.settings.gutterSize) * available.row;
          pos = {left: left, top: top};

          if (animate) {
            var easing = self.settings.easing,
              blockslide = [0.09, 0.11, 0.24, 0.91];

            if (easing === 'blockslide') {
              if (self.isTransitionsSupports) {
                self.applyCubicBezier(block.elem, blockslide);
                block.elem[0].style.left = pos.left + 'px';
                block.elem[0].style.top = pos.top + 'px';
              }
              // IE-9
              else {
                block.elem.animate(pos, self.settings.timeout);
              }
            }

            // Other easing effects ie (linear, swing)
            else {
              block.elem.animate(pos, self.settings.timeout, easing);
            }
          }
          else {
            block.elem[0].style.left = pos.left + 'px';
            block.elem[0].style.top = pos.top + 'px';
          }

          // Mark all spots as unavailable for this block, as we just used this one
          self.fitBlock(available.row, available.col, block);
        }
        self.element.triggerHandler('resize', self.settings.columns);
      },

      applyCubicBezier: function (el, cubicBezier) {
        el[0].style['-webkit-transition'] = 'all .3s cubic-bezier('+ cubicBezier +')';
        el[0].style['-moz-transition'] = 'all .3s cubic-bezier('+ cubicBezier +')';
        el[0].style['-ms-transition'] = 'all .3s cubic-bezier('+ cubicBezier +')';
        el[0].style['-o-transition'] = 'all .3s cubic-bezier('+ cubicBezier +')';
        el[0].style.transition = 'all .3s cubic-bezier('+ cubicBezier +')';
      },

      supportsTransitions: function () {
        var s = document.createElement('p').style,
          p = 'transition';

        if (typeof s[p] === 'string') {
          return true;
        }

        // Tests for vendor specific prop
        var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
        p = p.charAt(0).toUpperCase() + p.substr(1);

        for (var i = 0, l = v.length; i < l; i++) {
          if (typeof s[v[i] + p] === 'string') {
            return true;
          }
        }
        return false;
      },

      detachEvents: function () {
        $('body').off('resize.homepage');
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
