/* jshint esversion:6 */
import { Environment as env } from '../utils/environment';
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

/**
 * Component Name
 */
const COMPONENT_NAME = 'arrange';

/**
 * Default Arrange Options
 */
const ARRANGE_DEFAULTS = {
  handle: null, // The Class of the handle element
  itemsSelector: null,
  connectWith: false,
  placeholder: null,
  placeholderCssClass: 'arrange-placeholder'
};

/**
* The Arrange Component allows touch and drag support to sort UI items.
*
* @class Arrange
* @param {String} element The component element.
* @param {String} settings The component settings.
* @param {String} handle The class name of the handle element to connect
* @param {String} itemsSelector The selector to match all the sortable elements.
* @param {String} connectWith The optional element to connect with when using two lists
* @param {String} placeholder The html for the element that appears while dragging
* @param {String} placeholderCssClass The class to add to the ghost element that is being dragged.
*
*/
function Arrange(element, settings) {
  this.settings = utils.mergeSettings(element, settings, ARRANGE_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Arrange Methods
Arrange.prototype = {

  // example from: https://github.com/farhadi/html5arrangeable/blob/master/jquery.arrangeable.js
  init() {
    this.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isIe11 = (env.browser.name === 'ie' && env.browser.version === '11');
    this.handleEvents();
  },

  // Get Element By Touch In List
  getElementByTouchInList(list, x, y) {
    let returns = false;
    const listJq = $(list);

    for (let i = 0, l = listJq.length; i < l; i++) {
      const item = $(listJq[i]),
        offset = item.offset();

      if (!(x <= offset.left || x >= offset.left + item.outerWidth() ||
            y <= offset.top  || y >= offset.top + item.outerHeight())) {
        returns = item;
      }
    }
    return returns;
  },

  // Dragg touch element
  dragTouchElement(e, elm) {
    const orig = e.originalEvent.changedTouches[0];
    elm[0].style.top = (orig.pageY - this.offset.y) + 'px';
    elm[0].style.left = (orig.pageX - this.offset.x) + 'px';
  },

  unbind() {
    this.items
      .removeClass('draggable')
      .removeAttr('draggable')
      .off('selectstart.arrange '+ this.dragStart +' '+ this.dragEnd +' '+ this.dragWhileDragging);

    $(this.handle, this.items)
      .removeClass('draggable')
      .off('mousedown.arrange mouseup.arrange touchstart.arrange touchend.arrange');

    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {Object} settings The settings to apply.
   * @returns {Object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, ARRANGE_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
  * Teardown process for this plugin
  * @returns {void}
  */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  // Handle events
  handleEvents() {
    const self = this,
      s = this.settings;

    let index, isHandle,
      status = {},
      items = this.element.children().not('[data-arrange-exclude="true"]'),
      placeholder = $('<' + (/^(ul|ol)$/i.test(this.element[0].tagName) ? 'li' : 'div') +'>');

    if (s.itemsSelector) {
      items = $(s.itemsSelector, this.element).not('[data-arrange-exclude="true"]');
      placeholder = $('<'+ items.first()[0].tagName +' />');
    }

    if (s.placeholder) {
      placeholder = $(s.placeholder);
    }

    this.dragStart = 'dragstart.arrange touchstart.arrange gesturestart.arrange';
    this.dragEnd = 'dragend.arrange touchend.arrange touchcancel.arrange gestureend.arrange';
    this.dragWhileDragging = 'dragover.arrange dragenter.arrange drop.arrange touchmove.arrange gesturechange.arrange';

    this.handle = s.handle || this.element.attr('data-arrange-handle');
    this.connectWith = this.element.attr('data-arrange-connectWith');
    this.placeholders = placeholder;

    if (!this.isTouch) {
      this.placeholders.addClass(s.placeholderCssClass +' draggable');
    }

    // Use Handle if available
    $(this.handle, items).addClass('draggable')
      .on('mousedown.arrange touchstart.arrange', () => isHandle = true)
      .on('mouseup.arrange touchend.arrange', () => isHandle = false);

    // Add connect with
    if (this.connectWith) {
      items = items
        .add($(this.connectWith).children().not('[data-arrange-exclude="true"]'))
        .data('connectWith', this.connectWith);
    }

    this.items = items;

    // Draggable Items
    this.items
    .attr('draggable', true).addClass(this.handle ? '' : 'draggable')
    .add([this, placeholder])
    .not('a[href], img').on('selectstart.arrange', function() {
      if (this.dragDrop) {
        this.dragDrop();//ie9
      }
      return false;
    }).end()

    .each(function() {
      $(this)
      // Drag start --------------------------------------------------------------------------
      .on(self.dragStart, function(e) {
        if (self.handle && !isHandle) {
          if (self.isTouch) {
            return;
          } else {
            return false;
          }
        }
        isHandle = false;
        self.dragging = $(this);

        index = self.dragging.addClass('arrange-dragging').index();

        $.extend(status, {start: self.dragging, startIndex: index});

        /**
        * Fires before moving an element allowing you to access the ui to customize the draggable item.
        *
        * @event beforearrange
        * @type {Object}
        * @property {Object} event - The jquery event object
        * @property {Object} status - Status for this item
        */
        const result = self.element.triggerHandler('beforearrange', status);
        if ((typeof result === 'boolean' && !result) || (typeof result === 'string' && result.toLowerCase() === 'false')) {
          self.dragging = null;
          return;
        }

        if (self.isTouch) {
          const rect = self.dragging[0].getBoundingClientRect(),
            touch = e.originalEvent.changedTouches[0];

          //Save offset
          self.offset = {
            x: touch.pageX - rect.left,
            y: touch.pageY - rect.top
          };
          self.placeholderTouch = self.dragging
            .clone().addClass('is-touch').attr('id', 'arrange-placeholder-touch')
            .insertBefore(self.dragging);

          self.dragTouchElement(e, self.placeholderTouch);
        } else {
          const dt = e.originalEvent.dataTransfer;
          dt.effectAllowed = 'move';
          dt.setData('Text', 'dummy');
        }

      })

      // Drag end ----------------------------------------------------------
      .on(self.dragEnd, function() {
        if (!self.dragging) {
          return;
        }

        if (self.isTouch) {
          self.dragging.css('opacity', 1);
          self.placeholderTouch.remove();
        }

        self.placeholders.filter(':visible').after(self.dragging);
        self.dragging.removeClass('arrange-dragging').show();
        self.placeholders.detach();

        if (index !== self.dragging.index()) {
          $.extend(status, {end: self.dragging, endIndex: self.dragging.index()});

          /**
          * Fires after moving an element allowing you do any follow up updating.
          *
          * @event arrangeupdate
          * @type {Object}
          * @property {Object} event - The jquery event object
          * @property {Object} status - Status for this item
          */
          self.element.triggerHandler('arrangeupdate', status);
        }
        self.dragging = null;
        self.placeholderTouch = null;
      })

      // While dragging ----------------------------------------------------
      .on(self.dragWhileDragging, function(e) {
        if (!self.dragging) {
          return;
        }
        let overItem = this,
          overIndex;
        e.preventDefault();

        if (e.type==='drop') {
          e.stopPropagation();
          self.dragging.trigger('dragend.arrange');
          return false;
        }

        if (self.isTouch) {
          const touch = e.originalEvent.touches[0];
          overItem = self.getElementByTouchInList(items, touch.pageX, touch.pageY) || overItem;
        }
        overItem = $(overItem);

        if (!self.isTouch) {
          e.originalEvent.dataTransfer.dropEffect = 'move';
        }

        if (items.is(overItem) && placeholder.index() !== overItem.index()) {
          if (self.isTouch) {
            self.dragging.css('opacity', 0);
          } else {
            self.dragging.hide();
          }

          if (placeholder.index() < (overItem.index())) {
            placeholder.insertAfter(overItem);
            overIndex = overItem.index();
          }
          else {
            placeholder.insertBefore(overItem);
            overIndex = placeholder.index();
          }

          $.extend(status, {over: overItem, overIndex: overIndex});
          self.element.triggerHandler('draggingarrange', status);

          // Fix: IE-11 on windows-10 svg was disappering
          const svg = $('svg', overItem);
          if (self.isIe11 && svg.length) {
            overItem.html(overItem.html());
          }

          self.placeholders.not(placeholder).detach();
        }
        else if (!self.placeholders.is(this)) {
          self.placeholders.detach();
          self.element.append(placeholder);
        }

        if (self.isTouch) {
          self.dragTouchElement(e, self.placeholderTouch);
          return;
        } else {
          return false;
        }
      });//-----------------------------------------------------------------
    });//end each items
  }

};

export { Arrange, COMPONENT_NAME };
