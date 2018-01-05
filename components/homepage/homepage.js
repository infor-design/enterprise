/* jshint esversion:6 */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// Default Settings
const COMPONENT_NAME = 'homepage';

const HOMEPAGE_DEFAULTS = {
  gutterSize: 20, //Private
  widgetWidth: 360, //Private
  widgetHeight: 370, //Private
  animate: true,
  timeout: 100, //Private
  columns: 3,
  easing: 'blockslide' //Private
};

/**
* The Homepage handles card layout at multiple breakpoints.
*
* @class Homepage
* @param {Boolean} animate  &nbsp;-&nbsp; Disable animation during resize
* @param {Number} columns  &nbsp;-&nbsp; Display in 3 (default) or 4 column layout
*
*/
function Homepage(element, settings) {
  this.settings = utils.mergeSettings(element, settings, HOMEPAGE_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Homepage Methods
Homepage.prototype = {

  init() {
    this.isTransitionsSupports = this.supportsTransitions();
    this.initHeroWidget();
    this.handleEvents();

    //Initial Sizing
    this.resize(this, false);
  },

  initColumns(row) {
    row = row || 0;
    this.rowsAndCols[row] = [];

    for (let i = 0, l = this.settings.columns; i < l; i++) {
      this.rowsAndCols[row][i] = true;// Make all columns available in first row[true]
    }
  },

  initHeroWidget() {
    let heroWidget = $('.hero-widget');
    if (heroWidget.length > 1) {
      heroWidget = heroWidget.not(':first').remove();
    }
    this.heroWidget = heroWidget;
  },

  initRowsAndCols() {
    this.rowsAndCols = [];// Keeping all blocks as rows and columns
    this.initColumns();
  },

  // Return [x and y] where we can fit this block
  getAvailability(block) {
    let i, j, n, l, cols, innerCheck,
      rows = this.rowsAndCols.length,
      smallest = {},
      abort = false;

    // Loop thru each row and column soon it found first available spot
    // Then check for if block's width can fit in(yes), asign to [smallest] and break both loops
    for (i = 0, l = rows; i < l && !abort; i++) {
      for (j = 0, innerCheck = true, cols = this.rowsAndCols[i].length; j < cols && !abort; j++) {
        if ((this.rowsAndCols[i][j]) && ((block.w + j) <= cols)) {
          if ((block.w > 1) && (cols > (j+1))) {
            for (n = 0; n < block.w; n++) {
              if (!this.rowsAndCols[i][j + n]) {
                innerCheck = false;
                break;
              }
            }
          }
          if ((block.h > 1) && (rows > (i+1))) {
            for (n = 0; n < block.h; n++) {
              if (!this.rowsAndCols[i + n][j]) {
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
      this.initColumns(rows);
      smallest.row = rows;
      smallest.col = 0;
    }

    return smallest; //{x:0, y:0}
  },

  // Make all spots as unavailable, depends on block's width and height
  // Soon we used this block
  fitBlock(r, c, block) {
    let i, j, l, l2,
      addRow = true;

    block.x = c;
    block.y = r;

    if ((block.w === 1) && (block.h === 1)) { // Single block can fit anywhere
      this.rowsAndCols[r][c] = false;
    } else {
      // If more then one row or column then loop thru to block's width and height
      // If height is more then current rows then add new row
      // Mark those spots as unavailable[false]
      if (block.w !== 1) {
        // Left to right
        for (i = r, l = block.h + r; i < l; i++) {
          for (j = c, l2 = block.w + c; j < l2; j++) {
            if (!this.rowsAndCols[i]) {
              this.initColumns(i);
            }
            this.rowsAndCols[i][j] = false;
          }
        }
      } else {
        // Top to bottom
        for (i = r, l = block.h + r; i < l; i++) {
          for (j = c, l2 = block.h + c; j < l2; j++) {
            if (!this.rowsAndCols[i]) {
              this.initColumns(i);
            }
            this.rowsAndCols[i][c] = false;
          }
        }
      }
    }

    // Check if reach to end of columns then assign flag[addRow]
    for (i = 0, l = this.rowsAndCols[r].length; i < l; i++) {
      if(this.rowsAndCols[r][i]) {
        addRow = false;
      }
    }

    // If reach to end of columns and next row is not avaiable then add new row
    // Make all columns available, if not assigned earlier as unavailable
    if (addRow) {
      if (!this.rowsAndCols[r +1]) {
        this.initColumns(r +1);
      }
    }
  },

  // Setup each block sizes, based on classes provided from markup
  setBlocks() {
    const cards = this.element.find('.card, .widget');
    this.blocks = [];

    for (let i = 0, l = cards.length; i < l; i++) {
      const card = $(cards[i]),
        h = card.hasClass('double-height') ? 2 : 1,
        w = card.hasClass('quad-width') ? 4 : card.hasClass('triple-width') ? 3 : card.hasClass('double-width') ? 2 : 1;

      this.blocks.push({w: w, h: h, elem: card, text: card.text()});
    }

    // Max sized columns brings to top
    if (this.settings.columns > 1) {
      for (let i = 0, j = 0, w = 0, l = this.blocks.length; i < l; i++) {
        if (this.blocks[i].w >= this.settings.columns && i && w) {
          this.arrayIndexMove(this.blocks, i, j);
        }
        w += this.blocks[i].w;
        if (w >= this.settings.columns) {
          w = 0; //reset
          j = (this.blocks[j].w >= this.settings.columns) ? j+1 : i; //record to move
        }
      }
    }
  },

  //Move an array element position
  arrayIndexMove(arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
  },

  // Resize Method
  resize(self, animate) {
    //Sizes of "breakpoints" is  320, 660, 1000 , 1340 (for 320)
    //or 360, 740, 1120, 1500 or (for 360)
    const bpXL = (self.settings.widgetWidth * 4) + (self.settings.gutterSize * 3),
      bpDesktop = (self.settings.widgetWidth * 3) + (self.settings.gutterSize * 2),
      bpTablet = (self.settings.widgetWidth * 2) + self.settings.gutterSize,
      bpPhone = self.settings.widgetWidth;

    let bp = bpXL; //1340,
    const elemWidth = self.element.outerWidth(); //Math min against window.screen.width for single line mobile support

    // elemWidth -= 30; //extra break space

    // Find the Breakpoints
    const xl = (elemWidth >= bpXL),
      desktop = (elemWidth >= bpDesktop && elemWidth <= bpXL),
      tablet = (elemWidth >= bpTablet && elemWidth <= bpDesktop),
      phone = (elemWidth <= bpTablet);

    const maxAttr = this.element.attr('data-columns'),
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
    for (let i = 0, l = self.blocks.length; i < l; i++) {
      let left, top, pos, available,
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
      const box = self.settings.widgetWidth + self.settings.gutterSize,
        totalWidth = box * self.settings.columns;

      left = Locale.isRTL() ? totalWidth - ((box * block.w) + (box * available.col)) : box * available.col;
      top = (self.settings.widgetHeight + self.settings.gutterSize) * available.row;
      pos = {left: left, top: top};

      if (animate) {
        const easing = self.settings.easing,
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

  applyCubicBezier(el, cubicBezier) {
    el[0].style['-webkit-transition'] = 'all .3s cubic-bezier('+ cubicBezier +')';
    el[0].style['-moz-transition'] = 'all .3s cubic-bezier('+ cubicBezier +')';
    el[0].style['-ms-transition'] = 'all .3s cubic-bezier('+ cubicBezier +')';
    el[0].style['-o-transition'] = 'all .3s cubic-bezier('+ cubicBezier +')';
    el[0].style.transition = 'all .3s cubic-bezier('+ cubicBezier +')';
  },

  supportsTransitions() {
    const s = document.createElement('p').style;
    let p = 'transition';

    if (typeof s[p] === 'string') {
      return true;
    }

    // Tests for vendor specific prop
    const v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
    p = p.charAt(0).toUpperCase() + p.substr(1);

    for (let i = 0, l = v.length; i < l; i++) {
      if (typeof s[v[i] + p] === 'string') {
        return true;
      }
    }
    return false;
  },

  detachEvents() {
    $('body').off('resize.homepage');
    $('.application-menu').off('applicationmenuopen.homepage applicationmenuclose.homepage');
  },

  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, HOMEPAGE_DEFAULTS);
    }
    return this
      .detachEvents()
      .init();
  },

  /**
  * Teardown - Remove added markup and events
  */
  destroy() {
    this.detachEvents();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   *  This component fires the following events.
   *
   * @fires Homepage#events
   * @param {Object} resize  &nbsp;-&nbsp; Fires after the page is resized and layout is set. Can be used for any special adjustments.
   *
   */
  handleEvents() {
    $('body').on('resize.homepage', () => {
      this.resize(this, this.settings.animate);
    });

    $('.application-menu').on('applicationmenuopen.homepage applicationmenuclose.homepage', () => {
      this.resize(this, this.settings.animate);
    });
  }

};

export { Homepage, COMPONENT_NAME };
