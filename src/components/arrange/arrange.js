import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Environment as env } from '../../utils/environment';

// Component Name
const COMPONENT_NAME = 'arrange';

/**
* The Arrange Component allows touch and drag support to sort UI items.
* @class Arrange
* @constructor
*
* @param {jQuery[]|HTMLElement} element The component element.
* @param {object} [settings] The component settings.
* @param {string} [settings.handle] The CSS class name of the handle element to connect
* @param {string} [settings.itemsSelector] The CSS selector to match all the sortable elements.
* @param {string} [settings.connectWith] Optional CSS Selector to connect with when using two lists
* @param {boolean} [settings.isVisualItems] Use only index of visual items to trigger
* @param {string} [settings.placeholder] The html for the element that appears while dragging
* @param {string} [settings.placeholderCssClass='arrange-placeholder'] The class to add to the ghost element that is being dragged.
* @param {boolean} [settings.useItemDimensions=false] If true, use item's dimensions to placeholder.
*/
const ARRANGE_DEFAULTS = {
  handle: null, // The Class of the handle element
  itemsSelector: null,
  connectWith: false,
  isVisualItems: false,
  placeholder: null,
  placeholderCssClass: 'arrange-placeholder',
  useItemDimensions: false
};

function Arrange(element, settings) {
  this.settings = utils.mergeSettings(element, settings, ARRANGE_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Arrange Methods
Arrange.prototype = {

  // example from: https://github.com/farhadi/html5arrangeable
  init() {
    this.isIe = env.browser.name === 'ie';
    this.handleEvents();
  },

  get isTouch() {
    return env.features.touch;
  },

  get isMobile() {
    return env.devicespecs.isMobile;
  },

  /**
   * Get Element By Touch In List
   * @private
   * @param {object} list element.
   * @param {number} x value.
   * @param {number} y value.
   * @returns {object} item found in list
   */
  getElementByTouchInList(list, x, y) {
    let returns = false;
    const listJq = $(list);

    for (let i = 0, l = listJq.length; i < l; i++) {
      const item = $(listJq[i]);
      const offset = item.offset();

      if (!(x <= offset.left || x >= offset.left + item.outerWidth() ||
            y <= offset.top || y >= offset.top + item.outerHeight())) {
        returns = item;
      }
    }
    return returns;
  },

  /**
   * Dragg touch element
   * @private
   * @param {object} e as event.
   * @param {object} elm as element.
   * @returns {void}
   */
  dragTouchElement(e, elm) {
    const orig = e.originalEvent.changedTouches;
    if (elm && elm[0] && orig && orig[0] && this.offset) {
      elm[0].style.top = `${(orig[0].pageY - this.offset.y)}px`;
      elm[0].style.left = `${(orig[0].pageX - this.offset.x)}px`;
    }
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {object} The api
   */
  unbind() {
    this.items
      .removeClass('draggable')
      .removeAttr('draggable')
      .off(`selectstart.arrange ${this.dragStart} ${this.dragEnd} ${this.dragWhileDragging}`);

    $(this.handle, this.items)
      .removeClass('draggable')
      .off('mousedown.arrange mouseup.arrange touchstart.arrange touchend.arrange');

    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
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

  /**
   * Find out the visual index to trigger
   * @private
   * @param {object} elem to get index number.
   * @returns {number} the index
   */
  getVisualIndex(elem) {
    const s = this.settings;
    let idx = null;

    if (s.isVisualItems) {
      let items = this.element.children().not('[data-arrange-exclude="true"]');
      if (s.itemsSelector) {
        items = $(s.itemsSelector, this.element).not('[data-arrange-exclude="true"]');
      }
      idx = items.index(elem);
    }

    return idx;
  },

  /**
   * Attach Events used by the Control
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    const s = this.settings;

    let index;
    let isHandle;
    const status = {};
    let items = this.element.children().not('[data-arrange-exclude="true"]');
    let placeholder = $(`<${(/^(ul|ol)$/i.test(this.element[0].tagName) ? 'li' : 'div')}>`);

    if (s.itemsSelector) {
      items = $(s.itemsSelector, this.element).not('[data-arrange-exclude="true"]');
      placeholder = $(`<${items.first()[0].tagName} />`);
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
      this.placeholders.addClass(`${s.placeholderCssClass} draggable`);
    }

    // Use Handle if available
    $(this.handle, items).addClass('draggable')
      .on('mousedown.arrange touchstart.arrange', () => {
        isHandle = true;
      })
      .on('mouseup.arrange touchend.arrange', () => {
        isHandle = false;
      });

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
      .not('a[href], img')
      .on('selectstart.arrange', function () {
        if (this.dragDrop) {
          this.dragDrop();// ie9
        }
        return this.isIe;
      });

    this.items.add(placeholder).each(function () {
      $(this)
        // Drag start --------------------------------------------------------------------------
        .on(self.dragStart, function (e) {
          if (self.handle && !isHandle) {
            if (self.isTouch) {
              return;
            }
            return false;// eslint-disable-line
          }
          isHandle = false;
          self.dragging = $(this);

          index = self.dragging.addClass('arrange-dragging').index();
          const idx = s.isVisualItems ?
            self.getVisualIndex(self.dragging) : index;

          $.extend(status, { start: self.dragging, startIndex: idx });

          /**
          * Fires before moving an element allowing you to access the ui to
          * customize the draggable item.
          *
          * @event beforearrange
          * @memberof Arrange
          * @property {object} event - The jquery event object
          * @property {object} status - Status for this item
          */
          const result = self.element.triggerHandler('beforearrange', status);
          if ((typeof result === 'boolean' && !result) || (typeof result === 'string' && result.toLowerCase() === 'false')) {
            self.dragging = null;
            return;
          }

          // Get size of drag item and its position
          const rect = self.dragging[0].getBoundingClientRect();

          // Use item dimensions
          if (s.useItemDimensions) {
            placeholder[0].style.width = `${rect.width}px`;
            placeholder[0].style.height = `${rect.height}px`;
            placeholder[0].classList.add(...s.placeholderCssClass.split(' '));
          }

          if (self.isTouch) {
            const touch = e.originalEvent.changedTouches;

            // Save the offset
            if (touch && touch[0]) {
              self.offset = {
                x: touch[0].pageX - rect.left,
                y: touch[0].pageY - rect.top
              };
            }
          } else {
            const dt = e.originalEvent.dataTransfer;
            const offset = {
              x: (e.originalEvent.clientX - rect.left),
              y: (e.originalEvent.clientY - rect.top)
            };
            dt.effectAllowed = 'move';
            dt.setData('Text', 'sample');
            dt.setDragImage(self.dragging[0], offset.x, offset.y);
          }
        })

        // Drag end ----------------------------------------------------------
        .on(self.dragEnd, () => {
          if (!self.dragging) {
            return;
          }

          if (self.isTouch) {
            const rules = { opacity: 1 };
            if (s.useItemDimensions) {
              rules.position = '';
            }
            self.dragging.css(rules);
            self.placeholderTouch?.remove();
          }

          self.element.removeClass('has-arrange-placeholder');
          self.placeholders.filter(':visible').after(self.dragging);
          self.dragging.removeClass('arrange-dragging').show();
          self.placeholders.detach();

          if (index !== self.dragging.index()) {
            const idx = s.isVisualItems ?
              self.getVisualIndex(self.dragging) : self.dragging.index();
            $.extend(status, { end: self.dragging, endIndex: idx });

            /**
            * Fires after moving an element allowing you do any follow up updating.
            *
            * @event arrangeupdate
            * @memberof Arrange
            * @property {object} event - The jquery event object
            * @property {object} status - Status for this item
            */
            self.element.triggerHandler('arrangeupdate', status);
          }
          self.dragging = null;
          self.placeholderTouch = null;
        })

        // While dragging ----------------------------------------------------
        .on(self.dragWhileDragging, function (e) {
          if (!self.dragging) {
            return;
          }
          let overItem = this;
          let overIndex;

          if (self.isMobile) {
            e.stopPropagation();
          } else {
            e.preventDefault();
          }

          if (self.isTouch && !self.placeholderTouch) {
            self.placeholderTouch = self.dragging
              .clone().addClass('is-touch').attr('id', 'arrange-placeholder-touch')
              .insertBefore(self.dragging);

            self.dragTouchElement(e, self.placeholderTouch);
          }

          /**
          * Fires after finishing an arrange action.
          *
          * @event dragend
          * @memberof ApplicationMenu
          * @param {object} event - The jquery event object
          */
          if (e.type === 'drop') {
            e.stopPropagation();
            self.dragging.trigger('dragend.arrange');
            return false;// eslint-disable-line
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
              const rules = { opacity: 0 };
              if (s.useItemDimensions) {
                rules.position = 'fixed';
              }
              self.dragging.css(rules);
            } else {
              self.dragging.hide();
            }

            let idx;
            if (placeholder.index() < (overItem.index())) {
              placeholder.insertAfter(overItem);
              overIndex = overItem.index();
              idx = s.isVisualItems ?
                self.getVisualIndex(overItem) : overIndex;
            } else {
              placeholder.insertBefore(overItem);
              overIndex = placeholder.index();
              idx = s.isVisualItems ?
                self.getVisualIndex(placeholder) : overIndex;
            }

            self.element.addClass('has-arrange-placeholder');

            $.extend(status, { over: overItem, overIndex: idx });
            self.element.triggerHandler('draggingarrange', status);

            // Fix: IE-11 on windows-10 svg was disappering
            utils.fixSVGIcons(overItem);

            self.placeholders.not(placeholder).detach();
          } else if (!self.placeholders.is(this)) {
            self.placeholders.detach();
            self.element.append(placeholder);
          }

          if (self.isTouch) {
            self.dragTouchElement(e, self.placeholderTouch);
            return;
          }
          return false;// eslint-disable-line
        });//-----------------------------------------------------------------
    });// end each items
  }

};

export { Arrange, COMPONENT_NAME };
