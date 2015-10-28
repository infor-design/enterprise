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

  $.fn.swaplist = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'swaplist',
        defaults = {
          'available': '.available',
          'fullAccess': '.full-access',
          'selected': '.selected',
          'btnAvailable': '.btn-moveto-selected',
          'btnFullAccess': '.btn-moveto-selected',
          'btnSelectedLeft': '.btn-moveto-left',
          'btnSelectedRight': '.btn-moveto-right',

          'triggerAfterSwap': 'swapupdate',
          'triggerBeforeSwap': 'beforeswap',
          'triggerWhileDragging': 'draggingswap'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
        var self = this;
        self.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        self.setElements();
        self.isMultiSelectClass(self.settings.selected);

        setTimeout(function() { // Wait for Listview availability
          self.makeDraggable();
          self.handleEvents();
          self.initSelected(self.settings.available);
          self.initSelected(self.settings.fullAccess);
        }, 0);
      },

      // Handle Events
      handleEvents: function() {
        var self = this,
          settings = self.settings;


        // TOP BUTTONS =============================================================================
        self.actionButtons.onTouchClick('swaplist').on('click.swaplist', function () {
          var actionButton = $(this),
            container = actionButton.closest('.card'); // Current list clicked from

          if (container.is(settings.available)) { // Move from Available to Selected
            self.moveElements(settings.available, settings.selected);
          }

          else if (container.is(settings.fullAccess)) { // Move from Full-Access to Selected
            self.moveElements(settings.fullAccess, settings.selected);
          }

          // Move from Selected
          else if (container.is(settings.selected)) {
            if (actionButton.is(settings.btnSelectedLeft)) { // to Available
              self.moveElements(settings.selected, settings.available);
            } 
            else if (actionButton.is(settings.btnSelectedRight)) { // to Full-Access
              self.moveElements(settings.selected, settings.fullAccess);
            }
          }
        });


        // KEYSTROKE ===============================================================================
        // Keydown event to implement selections
        self.containers.on('keydown.swaplist', function(e) {
          var container = $(this);
          e = e || window.event;
          if(e.keyCode === 77 && self.hasModifier(e)) { // Modifier + M
            if(!container.is(settings.selected) || 
              (container.is(settings.selected) && self.selectedButtons.length === 1)) {
              self.actionButtons.trigger('click.swaplist');
            } else {
              self.selectedButtons.first().focus();
            }
            e.preventDefault();
          }

          //Escape is the abort keystroke (for any target element)
          if(e.keyCode === 27) {
            var index, list = $('.listview', container).data('listview');
            if(self.selections.items.length) {
              index = $(self.selections.items[self.selections.items.length-1]);
            } else if(list.selectedItems.length) {
              index = $(list.selectedItems[list.selectedItems.length-1]);
            } else {
              index = $('li:first', container);
            }
            self.unselectElements(list);
            self.clearDropeffects();
            self.clearSelections();
            index.focus();
          }
        });

        // Keydown event to handle selected container
        self.selectedButtons.on('keydown.swaplist', function(e) {
          var btn = $(this), index, move;
          e = e || window.event;
          if(e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
            btn.trigger('click.swaplist');
            e.preventDefault();
          }
          // Left or Right arrow
          if((e.keyCode === 37 || e.keyCode === 39) && self.selectedButtons.length > 1) {
            index = self.selectedButtons.index(this);
            move = e.keyCode === 37 ? 
              (index > 0 ? index-1 : self.selectedButtons.length-1) : 
              (index < self.selectedButtons.length-1 ? index+1 : 0);
            self.selectedButtons[move].focus();
          }
        });


        // DRAGGABLE ===============================================================================
        self.element.onTouchClick('swaplist', self.dragElements)

        // Dragstart - initiate dragging
        .on(self.dragStart, self.dragElements, function(e) {
          var target = $(e.target),
            isInSelection = false,
            list = $('.listview', target.closest('.card')).data('listview');

          if (!!self.handle && !self.selections.isHandle) {
            return false;
          }

          if(!self.isTouch) {
            // Check if dragged element was selected or not
            $.each(list.selectedItems, function(index, val) {
              if (target[0] === val[0]) {
                isInSelection = true;
                return false;
              }             
            });
            if (!isInSelection) {
              list.select(target); // Make selected if dragged element was not selected
            }
          }

          self.clearSelections(); // Clear selection before fill
          self.element.trigger(settings.triggerBeforeSwap, [self.selections.items]);
          self.selections.draggedIndex = target.closest('li').index();
          self.selections.owner = target.closest('.card');


          if(self.isTouch) {
            // Target items were not LI with touch for selected items from listview
            $.each(list.selectedItems, function(index, val) {
              self.selections.items[index] = val.closest('li');
            });

          } else {
            self.selections.items = list.selectedItems;
            e.originalEvent.dataTransfer.setData('text', '');
            self.addDropeffects();
          }
          e.stopPropagation();
        })

        // Dragenter - set that related/droptarget
        .on(self.dragEnter, self.dragElements, function(e) {
          self.element.trigger(settings.triggerWhileDragging, [self.selections.items]);
          self.selections.related = e.target;
          $('ul, li', this.element).removeClass('over');
          $(e.target).closest('ul, li').addClass('over');
          self.selections.droptarget = $(self.selections.related).closest('.card');
          e.stopPropagation();
        })

        // Dragover - allow the drag by preventing default, for touch set related/droptarget
        .on(self.dragOver, self.dragElements, function(e) {
          var overItem = this, touch;
          e.preventDefault();

          if(self.isTouch) {
            if (!!self.handle && !self.selections.isHandle) {
              return false;
            }
            touch = e.originalEvent.touches[0];
            overItem = self.getElementByTouchInList($('ul, li', self.element), touch.pageX, touch.pageY) || overItem;

            self.element.trigger(settings.triggerWhileDragging, [self.selections.items]);
            self.selections.related = overItem;
            $('ul, li', this.element).removeClass('over');
            overItem.closest('ul, li').addClass('over');
            self.selections.droptarget = self.selections.related.closest('.card');
          }
        })

        // Dragend - implement items being validly dropped into targets
        .on(self.dragEnd, self.dragElements, function(e) {
          var related = $(self.selections.related).closest('li');

          self.unselectElements($('.listview', self.selections.owner).data('listview'));
          $.each(self.selections.items, function(index, val) {
            if ($('li', self.selections.droptarget).length && !$(self.selections.related).is('ul')) {
              var isLess = (related.index() < self.selections.draggedIndex);
              related[isLess ? 'before' : 'after'](isLess ? val : 
                $(self.selections.items[(self.selections.items.length-1) - index]));
            } else {
              $('ul', self.selections.droptarget).append(val);
            }
            $(val).focus();
          });

          self.selections.isHandle = null;
          self.afterUpdate($('.listview', self.selections.droptarget).data('listview'));
          e.preventDefault();
          e.stopPropagation();
        });
      }, // END: Handle Events ---------------------------------------------------------------------


      // Set elements
      setElements: function() {
        this.containers = $(
          this.settings.available +','+ 
          this.settings.selected +','+ 
          this.settings.fullAccess, this.element);

        this.actionButtons = $(
          this.settings.btnAvailable +','+ 
          this.settings.btnFullAccess +','+ 
          this.settings.btnSelectedLeft +','+ 
          this.settings.btnSelectedRight, this.element);

        this.selectedButtons = $(
          this.settings.btnSelectedLeft +','+ 
          this.settings.btnSelectedRight, this.element);

        this.dragElements = 'ul, li:not(.is-disabled)';
        this.dragStart = 'dragstart.swaplist touchstart.swaplist gesturestart.swaplist';
        this.dragEnter = 'dragenter.swaplist';
        this.dragOver = 'dragover.swaplist touchmove.swaplist gesturechange.swaplist';
        this.dragEnd = 'dragend.swaplist touchend.swaplist touchcancel.swaplist gestureend.swaplist';

        this.selections = {
          'items': [],
          'owner': null,
          'related': null,
          'droptarget': null,
          'isHandle': null,
          'draggedIndex': null
        };
      },

      // When list is Empty force to add css class "is-muliselect"
      isMultiSelectClass: function(container) {
        var lv = $(container +' .listview', this.element);
        if(!$('li', lv).length) {
          lv.addClass('is-muliselect');
        }
      },

      // Initialize pre selected items
      initSelected: function(container) {
        var list;
        container = (typeof container !== 'string') ? container : $(container, this.element);
        if (container.length) {
          list = $('.listview', container).data('listview');
          $('li[selected]', container).each(function() {
            $(this).removeAttr('selected');
            list.select($(this));// Select this item
          });
          this.moveElements(container, this.settings.selected);
        }
      },

      // Move Elements 
      moveElements: function(from, to) {
        var self = this, list;

        from = (typeof from !== 'string') ? from : $(from, self.element);
        to = (typeof to !== 'string') ? to : $(to, self.element);
        list = $('.listview', from).data('listview');

        self.clearSelections();

        if(self.isTouch) {
          $.each(list.selectedItems, function(index, val) {
            self.selections.items[index] = val.closest('li');
          });
        } else {
          self.selections.items = list.selectedItems;
        }

        self.unselectElements(list);

        if (self.selections.items.length) {
          self.element.trigger(self.settings.triggerBeforeSwap, [self.selections.items]);

          $.each(self.selections.items, function(index, val) {
            $('ul', to).append(val);
            $(val).focus();
          });
          
          self.afterUpdate($('.listview', to).data('listview'));
        }
      },

      // Un-select Elements
      unselectElements: function(list) {
        $.each(list.selectedItems, function(index, val) {
          list.select(val);
        });
      },

      // Detect browser support for drag-n-drop
      isDragAndDropSupports: function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
      },

      // Make Draggable
      makeDraggable: function() {
        var self = this,
          ul = $('ul', self.element);

        if (self.isDragAndDropSupports) {
          // Use Handle if available
          self.handle = ul.first().attr('data-swap-handle');
          $(self.handle, ul).addClass('draggable')
            .on('mousedown.swaplist touchstart.swaplist', function() { self.selections.isHandle = true; })
            .on('mouseup.swaplist touchend.swaplist', function() { self.selections.isHandle = false; });

          self.targets = ul.attr({'aria-dropeffect': 'none'});

          self.items = $('li:not(.is-disabled)', self.element)
            .not('a[href], img').on('selectstart.swaplist', function() {
              if(this.dragDrop) { this.dragDrop(); } //ie9
              return false;
            }).end()
            .attr({'aria-grabbed': false, 'draggable': true, 'tabindex': 0})
            .addClass(self.handle ? '' : 'draggable');
        }
      },

      // Get Element By Touch In List
      getElementByTouchInList: function(list, x, y) {
        var returns = false;
        $(list).each(function() {
          var item = $(this), offset = item.offset();
          if (!(x <= offset.left || x >= offset.left + item.outerWidth() ||
                y <= offset.top  || y >= offset.top + item.outerHeight())) {
            returns = item;
          }
        });
        return returns;
      },

      // Shorctut for testing whether a modifier is pressed
      hasModifier: function(e) {
        return (e.ctrlKey || e.metaKey || e.shiftKey);
      },

      // Applying dropeffect to the target containers
      addDropeffects: function() {
        this.targets.each(function() {
          $(this).attr({'aria-dropeffect': 'move', 'tabindex': 0});
        });
        $.each(this.selections.items, function(index, val) {
          $(val).attr({'aria-grabbed': true, 'tabindex': 0});
        });
      },

      // Removing dropeffect from the target containers
      clearDropeffects: function() {
        this.targets.each(function() {
          $(this).attr({'aria-dropeffect': 'none'}).removeAttr('tabindex');
        });
        $.each(this.selections.items, function(index, val) {
          $(val).attr({'aria-grabbed': false}).removeAttr('tabindex');
        });
      },

      // Clear selections
      clearSelections: function() {
        $('ul, li', this.element).removeClass('over');
        this.selections.items = [];
        this.selections.owner = null;
        this.selections.related = null;
        this.selections.droptarget = null;
      },

      // After update
      afterUpdate: function(list) {
        var self = this;
        setTimeout(function() {
          self.unselectElements(list);
          self.clearDropeffects();
          self.element.trigger(self.settings.triggerAfterSwap, [self.selections.items]);
          self.clearSelections();
        }, 100);
      },

      // Teardown
      destroy: function() {
        this.actionButtons.off('click.swaplist');
        this.containers.off('keydown.swaplist');
        this.selectedButtons.off('keydown.swaplist');
        this.element.off(this.dragStart+' '+this.dragEnter +' '+this.dragOver +' '+this.dragEnd, this.dragElements);

        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
