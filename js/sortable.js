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

  $.fn.sortable = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'sortable',
        defaults = {
          connectWith: false
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
        this.handleEvents();
      },

      // Handle Events 
      // example from: https://github.com/farhadi/html5sortable/blob/master/jquery.sortable.js
      handleEvents: function() {
        var self = this,
          index, isHandle,
          items = self.element.children().not('[data-sortable-exclude="true"]'),
          placeholder = $('<' + (/^(ul|ol)$/i.test(self.element[0].tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');

        self.placeholders = placeholder;
        self.handle = self.element.attr('data-sortable-handle');
        self.connectWith = self.element.attr('data-sortable-connectWith');

        // Use Handle if available
        $(self.handle, items)
          .on('mousedown.sortable', function() { isHandle = true; })
          .on('mouseup.sortable', function() { isHandle = false; });

        // Add connect with
        if (self.connectWith) {
          items = items
            .add($(self.connectWith).children().not('[data-sortable-exclude="true"]'))
            .data('connectWith', self.connectWith);
        }

        // Draggable Items
        items
        .attr('draggable', 'true')
        .add([this, placeholder])

        // No selection
        .not('a[href], img').on('selectstart.sortable', function() {
          if(this.dragDrop) { 
            this.dragDrop();//ie9
          }
          return false; 
        }).end()

        // Drag start
        .on('dragstart.sortable touchstart.sortable gesturestart.sortable', function(e) {
          if (self.handle && !isHandle) {
            return false;
          }
          isHandle = false;

          var dt = e.originalEvent.dataTransfer;
          dt.effectAllowed = 'move';
          dt.setData('Text', 'dummy');
          index = (self.dragging = $(this)).addClass('sortable-dragging').index();
        })

        // Drag end
        .on('dragend.sortable touchend.sortable gestureend.sortable touchcancel.sortable', function() {
          if (!self.dragging) {
            return;
          }
          self.placeholders.filter(':visible').after(self.dragging);
          self.dragging.removeClass('sortable-dragging').show();
          self.placeholders.detach();

          if (index !== self.dragging.index()) {
            self.dragging.parent().trigger('sortupdate', {item: self.dragging});
          }
          self.dragging = null;
        })

        // While dragging
        .on('dragover.sortable dragenter.sortable drop.sortable touchmove.sortable gesturechange.sortable', function(e) {
          e.preventDefault();
          e.originalEvent.dataTransfer.dropEffect = 'move';

          if (e.type === 'drop') {
            e.stopPropagation();
            self.dragging.trigger('dragend.sortable');
            return false;
          }

          if (items.is(this)) {
            self.dragging.hide();

            $(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
            self.placeholders.not(placeholder).detach();
          }
          else if (!self.placeholders.is(this)) {
            self.placeholders.detach();
            this.element.append(placeholder);
          }
          return false;
        });
      },

      // Teardown
      destroy: function() {
        var items = (this.connectWith) ? 
          this.element.children().add($(this.connectWith).children()) : 
          this.element.children();

        items.off('selectstart.sortable dragstart.sortable touchstart.sortable gesturestart.sortable dragend.sortable touchend.sortable gestureend.sortable touchcancel.sortable dragover.sortable dragenter.sortable drop.sortable touchmove.sortable gesturechange.sortable');
        $(this.handle, items).off('mousedown.sortable mouseup.sortable');

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
