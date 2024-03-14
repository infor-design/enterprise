/* eslint-disable no-cond-assign */

import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Environment as env } from '../../utils/environment';

// TODO: Resize: http://stackoverflow.com/questions/8258232/resize-an-html-element-using-touches
// Similar: https://github.com/desandro/draggabilly

// The name of this plugin
const COMPONENT_NAME = 'drag';

/**
 * Drag/Drop functions with touch support.
 * @class Drag
 * @constructor
 *
 * @param {jQuery[]|HTMLElement} element The component element.
 * @param {object} [settings] The component settings.
 * @param {string} [settings.axis]  Constrains dragging to either axis. Possible values: null, 'x', 'y'
 * @param {boolean} [settings.clone=false] Set to true to clone the object to drag. In many situations this is
 *  needed to break out of layout.
 * @param {string} [settings.cloneCssClass='is-clone'] Css class added to clone element (defaults is 'is-clone')
 * @param {boolean} [settings.clonePosIsFixed=false] If true cloned object will use css style "position: fixed"
 * @param {string} [settings.cloneAppendTo] Selector to append to for the clone
 * ['body'|'parent'|'jquery object'] default:'body'
 * @param {boolean} [settings.containment=false] Constrains dragging to within the bounds of the specified element
 *  or region. Possible values: "parent", "document", "window".
 * @param {string} [settings.obstacle] jQuery Selector of object(s) that you cannot drag into,
 * @param {boolean} [settings.underElements=false] If set to true will return list of elements that are
 * underneath the drag element
 * @param {object} [settings.containmentOffset={left: 0, top: 0}] How close to the containment object should we be allowed
 * to drag in position form. `{left: 0, top: 0}`
*/
const DRAG_DEFAULTS = {
  axis: null,
  clone: false,
  cloneCssClass: 'is-clone',
  clonePosIsFixed: false,
  cloneAppendTo: null,
  containment: false,
  obstacle: false,
  underElements: false,
  containmentOffset: { left: 0, top: 0 }
};

function Drag(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, DRAG_DEFAULTS);

  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
Drag.prototype = {

  init() {
    this.handleEvents();
  },

  /**
  * Trigger events and remove clone
  * @private
  * @param {number} left Current left position
  * @param {number} top Current top position
  */
  finish(left, top) {
    const pos = { top, left };

    this.element.off('mouseup.draggable');
    $(document).off('mousemove.draggable mouseup.draggable');
    if (this.settings.underElements) {
      pos.underElements = this.getElementsFromPoint(pos.left, pos.top);
    }

    pos.offset = this.offset;
    pos.clone = this.clone;

    /**
    * Fires after the drag is completed. Use this to remove / set drag feedback off.
    * @event dragend
    * @memberof Drag
    * @property {object} event - The jquery event object.
    * @property {object} ui - The dialog object
    */
    this.element.trigger('dragend', pos);
    this.element.removeClass('is-dragging');

    if (this.clone) {
      if (this.settings.axis === 'x') {
        delete pos.top;
      }

      if (this.settings.axis === 'y') {
        delete pos.left;
      }
      // this.element.css(pos);
      this.clone.remove();
      this.clone = null;
    }

    // Clear Cached Sizes
    if (this.obstacle) {
      this.obstacle = null;
    }
    if (this.upperYLimit) {
      this.upperYLimit = null;
    }
    if (this.upperXLimit) {
      this.upperXLimit = null;
    }
    $('body').removeClass('disable-select');
  },

  // Move the object from the event coords
  move(left, top) {
    const self = this;

    const css = {
      left,
      top
    };

    // X-Y Axis
    if (this.settings.axis === 'x') {
      delete css.top;
    }

    if (this.settings.axis === 'y') {
      delete css.left;
    }

    if (this.settings.containment) {
      if (this.settings.containment instanceof jQuery) {
        this.container = this.settings.containment;
      } else if (this.settings.containment === 'parent') {
        this.container = this.element.parent();
      } else if (this.settings.containment === 'window') {
        this.container = $(window);
      } else if (this.settings.containment === 'container') {
        this.container = this.element.closest('.page-container');
      } else if (this.settings.containment === 'partial') {
        // Partial, lets the user drag the object outside
        this.container = $(document);

        if (this.settings.containmentOffset.top === 0) {
          this.settings.containmentOffset.top = this.element.outerHeight() / 2;
        }
        
        if (this.settings.containmentOffset.left === 0) {
          this.settings.containmentOffset.left = this.element.outerWidth() / 2;
        }
      } else {
        this.container = $(document);
      }

      if (!this.upperXLimit) {
        this.upperXLimit = (this.container.width() - this.element.outerWidth()) +
          this.settings.containmentOffset.left;
      }
      if (!this.upperYLimit) {
        this.upperYLimit = (this.container.height() - this.element.outerHeight()) +
          this.settings.containmentOffset.top;
      }
      if (css.top > this.upperYLimit) {
        css.top = this.upperYLimit;
      }

      if (css.left > this.upperXLimit) {
        css.left = this.upperXLimit;
      }

      if (css.top < 0) {
        css.top = 0;
      }

      if (this.settings.containment !== 'partial' && css.left < 0) {
        css.left = 0;
      }

      if (this.settings.containment === 'partial' && css.left < -(this.settings.containmentOffset.left)) {
        css.left = -(this.settings.containmentOffset.left);
      }

      if (this.settings.containment === 'container' && css.left <= 1) {
        css.left = 1;
      }
    }

    if (this.settings.obstacle) {
      const elemOffset = (this.clone ? this.clone.offset() : this.element.offset());
      const elemWidth = (this.clone ? this.clone.outerWidth() : this.element.outerWidth());
      const movingRight = css.left > elemOffset.left;

      // Caching this so drag is not jaggie
      if (!this.obstacle) {
        this.obstacle = $(this.settings.obstacle).not(this.element);
        const obstacleOffset = $(this.obstacle).offset();

        this.constraints = {
          top: obstacleOffset.top,
          left: obstacleOffset.left,
          bottom: obstacleOffset.top + this.obstacle.outerHeight(),
          right: obstacleOffset.left + this.obstacle.outerWidth()
        };
      }

      if (!movingRight && self.originalPos.left > this.constraints.left &&
        css.left <= this.constraints.right) {
        css.left = this.constraints.right;
      }

      if (movingRight && self.originalPos.left + elemWidth <= this.constraints.left &&
        css.left + elemWidth >= this.constraints.left) {
        css.left = (this.constraints.left - this.obstacle.outerWidth());
      }
    }

    const applyCssStyle = function (el, applyCss, prop) {
      if (typeof applyCss[prop] !== 'undefined') {
        el[0].style[prop] = `${applyCss[prop]}px`;
      }
    };

    applyCssStyle((this.clone || this.element), css, 'top');
    applyCssStyle((this.clone || this.element), css, 'left');

    if (this.settings.underElements) {
      css.underElements = this.getElementsFromPoint(css.left, css.top);
    }

    css.offset = this.offset;
    css.clone = this.clone;

    /**
    * Fires (many times) while dragging is occuring. Use this for DOM feedback but
    * be careful about what you do in here for performance.
    * @event drag
    * @memberof Drag
    * @property {object} event - The jquery event object.
    * @property {object} ui - The dialog object
    */
    this.element.trigger('drag', css);
  },

  /**
  * Get elements from given point.
  * @param {number} x The x-coordinate of the Point.
  * @param {number} y The y-coordinate of the Point.
  * @Returns {array} List of all elements at the given point.
  */
  getElementsFromPoint(x, y) {
    let elements = [];

    if (document.elementsFromPoint) {
      elements = document.elementsFromPoint(x, y);
    } else if (document.msElementsFromPoint) {
      elements = document.msElementsFromPoint(x, y);
    } else {
      let i;
      let l;
      let d;
      let current;
      let max = 999;
      const pointerEvents = [];

      while ((current = document.elementFromPoint(x, y)) && elements.indexOf(current) === -1 &&
        current !== null && max > -1) {
        max--;

        // push the element and its current style
        elements.push(current);
        pointerEvents.push({
          value: current.style.getPropertyValue('pointer-events') || '',
          priority: current.style.getPropertyPriority('pointer-events')
        });
        // add "pointer-events: none", to get to the underlying element
        current.style.setProperty('pointer-events', 'none', 'important');
      }
      // restore the previous pointer-events values
      for (i = 0, l = elements.length; i < l; i++) {
        d = pointerEvents[i];
        elements[i].style.setProperty('pointer-events', d.value, d.priority);
      }
    }
    return elements;
  },

  /**
   * Update the component and optionally apply new settings.
   * @param  {object} settings the settings to update to.
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
  },

  /**
   * Detach all functionality and events.
   */
  destroy() {
    $.removeData(this.element[0], COMPONENT_NAME);
    this.element.off('touchstart.draggable MSPointerDown.draggable pointerdown.draggable touchmove.draggable touchend.draggable touchcancel.draggable mousedown.draggable');
  },

  handleEvents() {
    const self = this;
    self.offset = null;

    // Touch and Drag Support
    self.element.attr('draggable', !env.features.touch);

    if ('onpointerdown' in window || 'onmspointerdown' in window) {
      // TODO: Setup Pointer Events for 11 - pointerdown MSPointerDown, pointermove,
      // MSPointerMove, pointerup MSPointerUp
    } else {
      // Touch-only Drag Support
      self.element.on('touchstart.draggable gesturestart.draggable', function (e) {
        const pos = $(this).position();
        const orig = e.originalEvent;

        self.offset = {
          x: orig.changedTouches[0].pageX - pos.left,
          y: orig.changedTouches[0].pageY - pos.top
        };

        self.originalPos = pos;
        self.element.addClass('is-dragging');
        pos.offset = self.offset;
        pos.clone = self.clone;

        /**
        * When the dragging is initiated. Use this to customize/style
        * the drag/drop objects in the DOM.
        * @event dragstart
        * @memberof Drag
        * @property {object} event - The jquery event object.
        * @property {object} ui - The dialog object
        */
        self.element.trigger('dragstart', pos);
      })
        // Move
        .on('touchmove.draggable gesturechange.draggable', (e) => {
          e.preventDefault();
          const orig = e.originalEvent;

          // do now allow two touch points to drag the same element
          if (orig.targetTouches.length > 1) {
            return;
          }

          const xpos = orig.changedTouches[0].pageX - self.offset.x;
          const ypos = orig.changedTouches[0].pageY - self.offset.y;
          self.move(xpos, ypos);
        })
        // Finish Touch Dragging
        .on('touchend.draggable gestureend.draggable touchcancel.draggable', (e) => {
          e.preventDefault();
          const touch = e.originalEvent.changedTouches[0];
          self.finish(touch.pageX - self.offset.x, touch.pageY - self.offset.y);
        });
    }

    // Always bind mousedown in either scenario, in the event that a mouse is used
    self.element.on('mousedown.draggable', (e) => {
      e.preventDefault();

      const pos = self.settings.clonePosIsFixed ?
        self.element[0].getBoundingClientRect() : self.element.position();

      // Save offset
      self.offset = {
        x: e.pageX - pos.left,
        y: e.pageY - pos.top
      };

      self.originalPos = pos;

      // Prevent Text Selection
      $('body').addClass('disable-select');

      // Handle Mouse Press over draggable element
      $(document).on('mousemove.draggable', (mouseMoveEvent) => {
        mouseMoveEvent.preventDefault();
        self.move(mouseMoveEvent.pageX - self.offset.x, mouseMoveEvent.pageY - self.offset.y);
      });

      // Handle Mouse release over draggable element close out events and trigger
      $(document).on('mouseup.draggable', (docMouseUpEvent) => {
        docMouseUpEvent.preventDefault();
        self.finish(e.pageX - self.offset.x, docMouseUpEvent.pageY - self.offset.y);
      });

      self.element.on('mouseup.draggable', (mouseUpEvent) => {
        mouseUpEvent.preventDefault();
        self.finish(mouseUpEvent.pageX - self.offset.x, mouseUpEvent.pageY - self.offset.y);
      });

      // Trigger dragging
      // Clone
      if (!self.clone && self.settings.clone) {
        self.clone = self.element.clone(true);
        if (self.settings.cloneAppendTo === 'parent') {
          self.settings.cloneAppendTo = self.element.parent();
        }
        self.clone
          .addClass(self.settings.cloneCssClass)
          .appendTo(self.settings.cloneAppendTo || 'body');
      }

      self.element.addClass('is-dragging');
      self.element.trigger('dragstart', [pos, self.clone]);
    });
  }
};

export { Drag, COMPONENT_NAME };
