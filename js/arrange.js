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

  $.fn.arrange = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'arrange',
        defaults = {
          handle: null, // The Class of the handle element
          itemsSelector: null,
          connectWith: false,
          placeholder: null,
          placeholderCssClass: 'arrange-placeholder'
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function Arrange(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Arrange Methods
    Arrange.prototype = {

      init: function() {
        this.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isIE11 = /Trident.*rv[ :]*11\./i.test(navigator.userAgent);
        this.handleEvents();
      },

      // Handle Events
      // example from: https://github.com/farhadi/html5arrangeable/blob/master/jquery.arrangeable.js
      handleEvents: function() {
        var self = this,
          index, isHandle,
          status = {},
          items = self.element.children().not('[data-arrange-exclude="true"]'),
          placeholder = $('<' + (/^(ul|ol)$/i.test(self.element[0].tagName) ? 'li' : 'div') +'>');

        if (settings.itemsSelector) {
          items = $(settings.itemsSelector, self.element).not('[data-arrange-exclude="true"]');
          placeholder = $('<'+ items.first()[0].tagName +' />');
        }

        if (settings.placeholder) {
          placeholder = $(settings.placeholder);
        }

        self.dragStart = 'dragstart.arrange touchstart.arrange gesturestart.arrange';
        self.dragEnd = 'dragend.arrange touchend.arrange touchcancel.arrange gestureend.arrange';
        self.dragWhileDragging = 'dragover.arrange dragenter.arrange drop.arrange touchmove.arrange gesturechange.arrange';

        self.handle = settings.handle || self.element.attr('data-arrange-handle');
        self.connectWith = self.element.attr('data-arrange-connectWith');
        self.placeholders = placeholder.addClass(settings.placeholderCssClass +' draggable');

        // Use Handle if available
        $(self.handle, items).addClass('draggable')
          .on('mousedown.arrange touchstart.arrange', function() { isHandle = true; })
          .on('mouseup.arrange touchend.arrange', function() { isHandle = false; });

        // Add connect with
        if (self.connectWith) {
          items = items
            .add($(self.connectWith).children().not('[data-arrange-exclude="true"]'))
            .data('connectWith', self.connectWith);
        }

        self.items = items;

        // Draggable Items
        self.items
        .attr('draggable', true).addClass(self.handle ? '' : 'draggable')
        .add([this, placeholder])
        .not('a[href], img').on('selectstart.arrange', function() {
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
            self.dragging = $(this);

            index = self.dragging.addClass('arrange-dragging').index();

            $.extend(status, {start: self.dragging, startIndex: index});
            self.element.triggerHandler('beforearrange', status);

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
            self.dragging.removeClass('arrange-dragging').show();
            self.placeholders.detach();

            if (index !== self.dragging.index()) {
              $.extend(status, {end: self.dragging, endIndex: self.dragging.index()});
              self.element.triggerHandler('arrangeupdate', status);
            }
            self.dragging = null;
          })

          // While dragging -----------------------------------------------------------------------
          .on(self.dragWhileDragging, function(e) {
            var overItem = this,
              overIndex;
            e.preventDefault();

            if(e.type==='drop') {
              e.stopPropagation();
              self.dragging.trigger('dragend.arrange');
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

            if (items.is(overItem) && placeholder.index() !== overItem.index()) {
              self.dragging.hide();

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
              var svg = $('svg', overItem);
              if(self.isIE11 && svg.length) {
                overItem.html(overItem.html());
              }

              self.placeholders.not(placeholder).detach();
            }
            else if (!self.placeholders.is(this)) {
              self.placeholders.detach();
              self.element.append(placeholder);
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

      unbind: function() {
        this.items
          .removeClass('draggable')
          .removeAttr('draggable')
          .off('selectstart.arrange '+ this.dragStart +' '+ this.dragEnd +' '+ this.dragWhileDragging);

        $(this.handle, this.items)
          .removeClass('draggable')
          .off('mousedown.arrange mouseup.arrange touchstart.arrange touchend.arrange');

        return this;
      },

      updated: function() {
        return this
          .unbind()
          .init();
      },

      // Teardown
      destroy: function() {
        this.unbind();
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
        instance = $.data(this, pluginName, new Arrange(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
