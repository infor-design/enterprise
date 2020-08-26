import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// Component Name
const COMPONENT_NAME = 'splitter';

// Default Splitter Options
const SPLITTER_DEFAULTS = {
  axis: 'x',
  side: 'left', // or right
  resize: 'immediate',
  containment: null, // document or parent
  save: true,
  maxWidth: {
    left: 'auto',
    right: 'auto'
  }
};

/**
* Splitter Component
* @class Splitter
* @constructor
* @param {string} element The component element.
* @param {string} [settings] The component settings.
* @param {string} [settings.axis = 'x'] The axis on which to split x or y
* @param {string} [settings.side = 'left'] Which side to dock to 'left' or 'right'.
* @param {string} [settings.resize = 'immediate'] When to resize, during the drag 'immediate' or 'end'
* @param {HTMLElement|jQuery[]} [settings.containment = null] When to stop the splitter, this can be document, or a parent element
* @param {boolean} [settings.save = true] If true the split size will automatically be saved for next time
* @param {object} [settings.maxWidth = {left: 'auto', right: 'auto'}] Ability to stop dragging at a max left or right size.
*/
function Splitter(element, settings) {
  this.settings = utils.mergeSettings(element, settings, SPLITTER_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
Splitter.prototype = {

  /**
   * Do other init (change/normalize settings, load externals, etc)
   * @private
   * @returns {this} component instance
   */
  init() {
    return this
      .build()
      .handleEvents();
  },

  /**
   * Build the Control and Events
   * @private
   * @returns {void}
   */
  build() {
    const self = this;
    const s = this.settings;
    const splitter = this.element;
    const parent = splitter.parent();
    const direction = s.axis === 'x' ? 'left' : 'top';
    const thisSide = parent.is('.content') ? parent.parent() : parent;
    const dragHandle = $(`<div class="splitter-drag-handle">${$.createIcon('drag')}</div>`);
    let defaultOffset = 299;
    let w = parent.width();
    let parentHeight;

    this.isRTL = Locale.isRTL();

    setTimeout(() => {
      parentHeight = parent.height();
    }, 0);

    this.docBody = $('body');
    this.isSplitterRightSide = splitter.is('.splitter-right') || (s.axis === 'x' && s.side === 'right');
    this.isSplitterHorizontal = splitter.is('.splitter-horizontal') || s.axis === 'y';
    s.uniqueId = utils.uniqueId(this.element, 'splitter');
    dragHandle.appendTo(splitter);

    const handleCollapseButton = () => {
      let savedOffset = 0;
      let isClickedOnce = false;
      const splitAndRotate = (splitVal, el, isRotate) => {
        self.splitTo(splitVal, parentHeight);
        $(el)[isRotate ? 'addClass' : 'removeClass']('rotate');
      };
      this.splitterCollapseButton = $('<button type="button" class="splitter-btn" id="splitter-collapse-btn"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-double-chevron"></use></svg></button>');
      this.splitterCollapseButton.appendTo(splitter);
      if (splitter[0].offsetLeft > 10) {
        this.splitterCollapseButton.addClass('rotate');
      }
      this.splitterCollapseButton.click(function () {
        const isDragging = splitter.is('is-dragging');
        if (isDragging) {
          return;
        }
        if (
          self.isRTL && !self.isSplitterHorizontal ||
          !self.isSplitterRightSide && s.side === 'left' ||
          self.isSplitterRightSide && s.side === 'right'
        ) {
          const containerWidth = self.getContainerWidth() - splitter.outerWidth();
          const x = containerWidth;
          if (!isClickedOnce) {
            savedOffset = containerWidth - savedOffset;
            defaultOffset = containerWidth - defaultOffset;
          }
          let left = splitter[0].offsetLeft;
          if (self.isSplitterRightSide && s.side === 'right') {
            left = splitter[0].offsetLeft + 1;
          }
          if (savedOffset >= x) {
            if (left >= containerWidth) {
              splitAndRotate(defaultOffset, this, true);
            } else {
              savedOffset = left;
              splitAndRotate(x, this, false);
            }
          } else if (left < containerWidth) {
            savedOffset = left;
            splitAndRotate(x, this, false);
          } else {
            splitAndRotate(savedOffset, this, true);
            savedOffset = x;
          }
        } else {
          const left = splitter[0].offsetLeft;
          if (savedOffset <= 0) {
            if (left <= 10) {
              splitAndRotate(defaultOffset, this, true);
            } else {
              savedOffset = left;
              splitAndRotate(0, this, false);
            }
          } else if (left > 10) {
            savedOffset = left;
            splitAndRotate(0, this, false);
          } else {
            splitAndRotate(savedOffset, this, true);
            savedOffset = 0;
          }
        }
        isClickedOnce = true;
      });
    };

    if (this.isSplitterRightSide) {
      const thisPrev = thisSide.prev();

      if (thisPrev.is('.main')) {
        this.leftSide = thisPrev;
        w = thisSide.parent().outerWidth() - w;
      } else {
        this.leftSide = thisSide;
        splitter.addClass('splitter-right');
      }

      thisSide.addClass('is-right-side')
        .next().addClass('flex-grow-shrink is-right-side')
        .parent()
        .addClass('splitter-container');

      if (s.collapseButton) {
        handleCollapseButton();
      }
      this.setSplitterContainer(thisSide.parent());
    } else if (this.isSplitterHorizontal) {
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

      if (s.collapseButton) {
        handleCollapseButton();
      }

      this.setSplitterContainer(thisSide.parent());
    }

    if (this.isRTL && !this.isSplitterHorizontal) {
      const containerWidth = this.getContainerWidth();
      w = containerWidth >= w ? containerWidth - w : w;
    }

    // Restore from local storage
    if (localStorage && s.save &&
      !isNaN(parseInt(localStorage[s.uniqueId], 10))) {
      w = localStorage[s.uniqueId];
    }

    w = parseInt(w, 10);

    if (this.isSplitterHorizontal) {
      splitter[0].style.top = `${w}px`;
    } else {
      splitter[0].style.top = 0;
    }

    this.splitTo(w, parentHeight);

    if (w <= 10 && this.splitterCollapseButton) {
      this.splitterCollapseButton.removeClass('rotate');
    }

    // Add the Splitter Events
    this.documentWidth = 0;

    this.element.drag({
      axis: s.axis,
      containment: s.containment || s.axis === 'x' ? 'document' : 'parent',
      containmentOffset: { left: 0, top: 0 }
    }).on('dragstart.splitter', () => {
      const iframes = thisSide.parent().find('iframe');
      self.documentWidth = $(document).width();

      if (iframes.length > 0) {
        for (let i = 0, l = iframes.length; i < l; i++) {
          const frame = $(iframes[i]);
          // eslint-disable-next-line
          const width = `${parseInt(getComputedStyle(frame.parent()[0]).width, 10)}px`;
          const overlay = $('<div class="overlay splitter-overlay"></div>');
          overlay.css('width', width);
          frame.before(overlay);
        }
      }
    }).on('dragend.splitter', (e, args) => {
      thisSide.parent().find('.splitter-overlay').remove();

      if (s.collapseButton) {
        const splitRect = splitter[0].getBoundingClientRect();
        const splitOffset = window.innerWidth - splitRect.left;
        const isRightSide = this.isSplitterRightSide && this.settings.side === 'right' ||
        !this.isSplitterRightSide && this.settings.side === 'left';
        if (args[direction] <= 10 || isRightSide && splitOffset <= 21) {
          $('#splitter-collapse-btn').removeClass('rotate');
        } else {
          $('#splitter-collapse-btn').addClass('rotate');
        }
      }

      if (s.resize === 'end') {
        self.splitTo(args[direction], parentHeight);
      }

      // Run here on `dragend` and `drag` because it take some time to apply, which leaving some gap in between especially with case zero or less value.
      if (s.resize === 'immediate' && this.isRTL && !this.isSplitterHorizontal) {
        setTimeout(() => {
          const left = parseInt(this.element.css('left'), 10);
          self.splitTo(left, parentHeight);
        }, 0);
      }
    }).on('drag.splitter', (e, args) => {
      if (args.left <= 0) {
        return false;
      }
      if (s.resize === 'immediate') {
        self.splitTo(args[direction], parentHeight);
      }
      return true;
    });

    // Horizontal Splitter
    if (s.axis === 'y') {
      this.element.addClass('splitter-horizontal');
    }

    // Aria
    this.element.attr({ 'aria-dropeffect': 'move', tabindex: '0', 'aria-grabbed': 'false' });

    return this;
  },

  /**
   * Set the splitter container
   * @private
   * @param {jQueryElement} parentEl The main parent container element.
   * @returns {void}
   */
  setSplitterContainer(parentEl) {
    this.container = this.element.closest('.splitter-container');
    if (!this.container.length && parentEl && parentEl.length) {
      parentEl.addClass('splitter-container');
      this.container = this.element.closest('.splitter-container');
    }
  },

  /**
   * Get splitter container width
   * @private
   * @returns {number} Container width
   */
  getContainerWidth() {
    return this.container?.outerWidth() || 0;
  },

  /**
   * Toggle selection
   * @private
   * @returns {void}
   */
  toggleSelection() {
    this.element.toggleClass('is-dragging');
  },

  /**
   * Resize the panel vertically
   * @private
   * @param {object} splitter element.
   * @param {number} top value.
   * @param {number} parentHeight value.
   * @returns {void}
   */
  resizeTop(splitter, top, parentHeight) {
    if (top > parentHeight || top < 0) {
      top = parseInt(parentHeight, 10) / 2;
    }

    this.topPanel[0].style.height = `${top}px`;
  },

  /**
   * Resize the panel to the Left
   * @private
   * @param {object} splitter element.
   * @param {number} leftArg value.
   * @returns {void}
   */
  resizeLeft(splitter, leftArg) {
    const left = this.isRTL ? (leftArg + 20) : this.leftSide.outerWidth() - leftArg;

    // Adjust Left and Right Side
    this.rightSide[0].style.width = `${left}px`;

    // Reset the Width
    splitter[0].style.left = '';
  },

  /**
   * Resize the panel to the Right
   * @private
   * @param {object} splitter element.
   * @param {number} w - width value.
   * @returns {void}
   */
  resizeRight(splitter, w) {
    const parent = splitter.parent();
    const thisSide = parent.is('.content') ? parent.parent() : parent;
    let width = w;
    let left = w - 1;

    if (this.isRTL && !this.isSplitterHorizontal) {
      const containerWidth = this.getContainerWidth();
      width = containerWidth >= w ? ((containerWidth - w) - 20) : w;
      left = w;
    }

    if (!this.isSplitterRightSide && this.settings.side === 'left' ||
        this.isSplitterRightSide && this.settings.side === 'right') {
      thisSide[0].style.width = `0px`;
    }

    // Adjust Left and Right Side
    this.leftSide[0].style.width = `${width}px`;
    splitter[0].style.left = `${left}px`;
  },

  /**
   * Split to
   * @private
   * @param {number} split value.
   * @param {number} parentHeight value.
   * @returns {void}
   */
  splitTo(split, parentHeight) {
    const self = this;
    const s = this.settings;
    const splitter = this.element;

    if (this.isSplitterRightSide) {
      if ((!this.isRTL && split > s.maxWidth.right) ||
        (this.isRTL && split < s.maxWidth.right)) {
        split = s.maxWidth.right;
      }
      this.resizeRight(splitter, split);
    } else if (this.isSplitterHorizontal) {
      this.resizeTop(splitter, split, parentHeight);
    } else {
      if ((!this.isRTL && split > s.maxWidth.left) ||
        (this.isRTL && split < s.maxWidth.left)) {
        split = s.maxWidth.left;
      }
      this.resizeLeft(splitter, split);
    }

    /**
    * Fires when after the split occurs. Allowing you to sync any ui.
    * @event split
    * @memberof Splitter
    * @property {object} event The jquery event object
    * @property {number} split value
    */
    this.element.trigger('split', [split]);
    this.docBody.triggerHandler('resize', [self]);

    // Save to local storage
    if (localStorage) {
      localStorage[this.settings.uniqueId] = split;
    }

    this.split = split;
    this.parentHeight = parentHeight;
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {object} The api
   */
  unbind() {
    this.element.off(`updated.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, SPLITTER_DEFAULTS);
    }
    return this
      .destroy()
      .init();
  },

  /**
  * Destroy and remove added markup, all events
  * @returns {void}
  */
  destroy() {
    this.unbind();
    if (this.splitterCollapseButton) {
      this.splitterCollapseButton.remove();
    }
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * Attach Events used by the Control
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.element
      /**
      * Fires when the component updates.
      *
      * @event updated
      * @memberof Splitter
      * @type {object}
      * @property {object} event - The jquery event object
      */
      .on(`updated.${COMPONENT_NAME}`, () => {
        this.updated();
      })

      /**
      * Fires when a key is pressed while the component is focused.
      *
      * @event keydown
      * @memberof Splitter
      * @type {object}
      * @property {object} event - The jquery event object
      */
      .on(`keydown.${COMPONENT_NAME}`, (e) => {
        // Space will toggle selection
        if (e.which === 32) {
          this.toggleSelection();
          e.preventDefault();
        }

        if (e.which === 37) {
          this.splitTo(this.split - 15, this.parentHeight);
        }

        if (e.which === 39) {
          this.splitTo(this.split + 15, this.parentHeight);
        }
      });

    return this;
  }

};

export { Splitter, COMPONENT_NAME };
