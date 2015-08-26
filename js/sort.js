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
          items = self.element.children().not('[data-sort-exclude="true"]'),
          placeholder = $('<' + (/^(ul|ol)$/i.test(self.element[0].tagName) ? 'li' : 'div') + ' class="sort-placeholder">');

        self.placeholders = placeholder;
        self.handle = self.element.attr('data-sort-handle');
        self.connectWith = self.element.attr('data-sort-connectWith');

        // Use Handle if available
        $(self.handle, items)
          .on('mousedown.sort', function() { isHandle = true; })
          .on('mouseup.sort', function() { isHandle = false; });

        // Add connect with
        if (self.connectWith) {
          items = items
            .add($(self.connectWith).children().not('[data-sort-exclude="true"]'))
            .data('connectWith', self.connectWith);
        }

        // Draggable Items
        //items.addClass('draggdrag({containment: 'document', clone: 'true'});

        items.attr('draggable', 'true')
        .add([this, placeholder])

        // No selection
        .not('a[href], img').on('selectstart.sort', function() {
          if(this.dragDrop) {
            this.dragDrop();//ie9
          }
          return false;
        }).end()

        // Drag start
        .on('dragstart.sort touchstart.sort gesturestart.sort', function(e) {
          if (self.handle && !isHandle) {
            return false;
          }
          isHandle = false;

          var dt = e.originalEvent.dataTransfer;
          dt.effectAllowed = 'move';
          dt.setData('Text', 'dummy');
          index = (self.dragging = $(this)).addClass('sort-dragging').index();
        })

        // Drag end
        .on('dragend.sort touchend.sort gestureend.sort touchcancel.sort', function() {
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

        // While dragging
        .on('dragover.sort dragenter.sort drop.sort touchmove.sort gesturechange.sort', function(e) {
          e.preventDefault();
          e.originalEvent.dataTransfer.dropEffect = 'move';

          if (e.type === 'drop') {
            e.stopPropagation();
            self.dragging.trigger('dragend.sort');
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

        items.off('selectstart.sort dragstart.sort touchstart.sort gesturestart.sort dragend.sort touchend.sort gestureend.sort touchcancel.sort dragover.sort dragenter.sort drop.sort touchmove.sort gesturechange.sort');
        $(this.handle, items).off('mousedown.sort mouseup.sort');

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
