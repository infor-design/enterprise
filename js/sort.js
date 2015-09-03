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

  $.fn.sort = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'sort',
        defaults = {
          connectWith: false,
          placeholderCssClass: 'sort-placeholder'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
        this.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.handleEvents();
      },

      // Handle Events
      // example from: https://github.com/farhadi/html5sortable/blob/master/jquery.sortable.js
      handleEvents: function() {
        var self = this,
          index, isHandle,
          items = self.element.children().not('[data-sort-exclude="true"]'),
          placeholder = $('<' + (/^(ul|ol)$/i.test(self.element[0].tagName) ? 'li' : 'div') +'>');

        self.dragStart = 'dragstart.sort touchstart.sort gesturestart.sort';
        self.dragEnd = 'dragend.sort touchend.sort touchcancel.sort gestureend.sort';
        self.dragWhileDragging = 'dragover.sort dragenter.sort drop.sort touchmove.sort gesturechange.sort';

        self.handle = self.element.attr('data-sort-handle');
        self.connectWith = self.element.attr('data-sort-connectWith');
        self.placeholders = placeholder.addClass(settings.placeholderCssClass +' draggable');

        // Use Handle if available
        $(self.handle, items).addClass('draggable')
          .on('mousedown.sort touchstart.sort', function() { isHandle = true; })
          .on('mouseup.sort touchend.sort', function() { isHandle = false; });

        // Add connect with
        if (self.connectWith) {
          items = items
            .add($(self.connectWith).children().not('[data-sort-exclude="true"]'))
            .data('connectWith', self.connectWith);
        }

        // Draggable Items
        items
        .attr('draggable', true).addClass(self.handle ? '' : 'draggable')
        .add([this, placeholder])
        .not('a[href], img').on('selectstart.sort', function() {
          if(this.dragDrop) {
            this.dragDrop();//ie9
          }
          return false;
        }).end()

        .each(function() {
          $(this)
          // Drag start --------------------------------------------------------------------------
          .on(self.dragStart, function(e) {          
            if (self.handle && !isHandle) {
              return false;
            }
            isHandle = false;

            index = (self.dragging = $(this)).addClass('sort-dragging').index();
            var dt = e.originalEvent.dataTransfer;
            dt.effectAllowed = 'move';
            dt.setData('Text', 'dummy');
          })

          // Drag end ----------------------------------------------------------------------------
          .on(self.dragEnd, function() {
            if (!self.dragging) {
              return;
            }
            self.placeholders.filter(':visible').after(self.dragging);
            self.dragging.removeClass('sort-dragging').show();
            self.placeholders.detach();

            if (index !== self.dragging.index()) {
              self.dragging.parent().trigger('sortupdate', {item: self.dragging});
            }
            self.dragging = null;
          })

          // While dragging -----------------------------------------------------------------------
          .on(self.dragWhileDragging, function(e) {
            var overItem = this;

            e.preventDefault();
            
            if(e.type==='drop') {
              e.stopPropagation();
              self.dragging.trigger('dragend.sort');
              return false;
            }

            if(self.isTouch) {
              var touch = e.originalEvent.touches[0];
              overItem = self.getElementByTouchInList(items, touch.pageX, touch.pageY) || overItem;
            }
            overItem = $(overItem);

            if(!self.isTouch) {
              e.originalEvent.dataTransfer.dropEffect = 'move';
            }

            if (items.is(overItem)) {
              self.dragging.hide();

              overItem[placeholder.index() < overItem.index() ? 'after' : 'before'](placeholder);
              self.placeholders.not(placeholder).detach();
            }
            else if (!self.placeholders.is(this)) {
              self.placeholders.detach();
              this.element.append(placeholder);
            }
            return false;
          });//-------------------------------------------------------------------------------------
        });//end each items
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

      // Teardown
      destroy: function() {
        var items = (this.connectWith) ?
          this.element.children().add($(this.connectWith).children()) : this.element.children();

        items.off('selectstart.sort '+ this.dragStart +' '+ this.dragEnd +' '+ this.dragWhileDragging);
        $(this.handle, items).off('mousedown.sort mouseup.sort touchstart.sort touchend.sort');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
        instance.show();
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
