/* jshint esversion:6 */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

/**
 * Component Name
 */
const COMPONENT_NAME = 'splitter';

/**
 * Default Splitter Options
 */
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
*
* @class Splitter
* @param {String} element The component element.
* @param {String} settings The component settings.
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
  init() {
    // Do other init (change/normalize settings, load externals, etc)
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
    const defaultOffset = 299;
    let w = parent.width();
    let parentHeight;

    setTimeout(() => {
      parentHeight = parent.height();
    }, 0);

    this.docBody = $('body');
    this.isSplitterRightSide = splitter.is('.splitter-right') || (s.axis === 'x' && s.side === 'right');
    this.isSplitterHorizontal = splitter.is('.splitter-horizontal') || s.axis === 'y';
    s.uniqueId = this.uniqueId();

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
        let savedOffset = 0;
        const $splitterButton = $('<button type="button" class="splitter-btn" id="splitter-collapse-btn" title="Collapse"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-double-chevron"></use></svg></button>');
        $splitterButton.appendTo(splitter);
        if (splitter[0].offsetLeft > 10) {
          $('#splitter-collapse-btn').addClass('rotate');
        }
        $('#splitter-collapse-btn').click(function () {
          if (savedOffset <= 0) {
            if (splitter[0].offsetLeft <= 10) {
              self.splitTo(defaultOffset, parentHeight);
              $(this).addClass('rotate');
            } else {
              savedOffset = splitter[0].offsetLeft;
              self.splitTo(0, parentHeight);
              $(this).removeClass('rotate');
            }
          } else if (splitter[0].offsetLeft > 10) {
            savedOffset = splitter[0].offsetLeft;
            self.splitTo(0, parentHeight);
            $(this).removeClass('rotate');
          } else {
            self.splitTo(savedOffset, parentHeight);
            $(this).addClass('rotate');
            savedOffset = 0;
          }
        });
      }
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
    }

    // Restore from local storage
    if (localStorage && s.save &&
      !Number.isNaN(parseInt(localStorage[s.uniqueId], 10))) {
      w = localStorage[s.uniqueId];
    }

    w = parseInt(w, 10);

    if (this.isSplitterHorizontal) {
      splitter[0].style.top = `${w}px`;
    } else {
      splitter[0].style.top = 0;
    }

    this.splitTo(w, parentHeight);

    // Add the Splitter Events
    this.documentWidth = 0;

    this.element.drag({
      axis: s.axis,
      containment: s.containment || s.axis === 'x' ? 'document' : 'parent',
      containmentOffset: { left: 20, top: 0 }
    }).on('dragstart.splitter', () => {
      const iframes = $('iframe');
      self.documentWidth = $(document).width();

      if (iframes.length > 0) {
        for (let i = 0, l = iframes.length; i < l; i++) {
          const frame = $(iframes[i]);
          // eslint-disable-next-line
          const width = `${parseInt(getComputedStyle(frame.parent()[0]).width, 10) - 40}px`;
          frame.before(`<div class="overlay" style="opacity: 0; visibility: visible; height: 100%; width: ${width}"></div>`);
        }
      }
    }).on('dragend.splitter', (e, args) => {
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
   * @param {Object} splitter element.
   * @param {Number} top value.
   * @param {Number} parentHeight value.
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
   * @param {Object} splitter element.
   * @param {Number} leftArg value.
   * @returns {void}
   */
  resizeLeft(splitter, leftArg) {
    const left = this.leftSide.outerWidth() - leftArg;

    // Adjust Left and Right Side
    this.rightSide[0].style.width = `${left}px`;

    // Reset the Width
    splitter[0].style.left = '';
  },

  /**
   * Resize the panel to the Right
   * @private
   * @param {Object} splitter element.
   * @param {Number} w - width value.
   * @returns {void}
   */
  resizeRight(splitter, w) {
    // Adjust Left and Right Side
    this.leftSide[0].style.width = `${w}px`;
    splitter[0].style.left = `${(w - 1)}px`;
  },

  /**
   * Preferably use the id, but if none that make one based on the url and count
   * @private
   * @returns {String} uniqueId
   */
  uniqueId() {
    return this.element.attr('id') ||
      `${window.location.pathname.split('/').pop()}-splitter-${$('.splitter').length}`;
  },

  /**
   * Split to
   * @private
   * @param {Number} split value.
   * @param {Number} parentHeight value.
   * @returns {void}
   */
  splitTo(split, parentHeight) {
    const self = this;
    const s = this.settings;
    const splitter = this.element;

    if (this.isSplitterRightSide) {
      if (split > s.maxWidth.right) {
        split = s.maxWidth.right;
      }
      this.resizeRight(splitter, split);
    } else if (this.isSplitterHorizontal) {
      this.resizeTop(splitter, split, parentHeight);
    } else {
      if (split > s.maxWidth.left) {
        split = s.maxWidth.left;
      }
      this.resizeLeft(splitter, split);
    }

    /**
    * Fires when split.
    *
    * @event split
    * @type {Object}
    * @property {Object} event - The jquery event object
    * @property {Number} split value
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
   * @returns {Object} The api
   */
  unbind() {
    this.element.off(`updated.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {Object} settings The settings to apply.
   * @returns {Object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, SPLITTER_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
  * Destroy and remove added markup, all events
  * @returns {void}
  */
  destroy() {
    this.unbind();
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
      * @type {Object}
      * @property {Object} event - The jquery event object
      */
      .on(`updated.${COMPONENT_NAME}`, () => {
        this.updated();
      })

      /**
      * Fires when a key is pressed while the component is focused.
      *
      * @event keydown
      * @type {Object}
      * @property {Object} event - The jquery event object
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
