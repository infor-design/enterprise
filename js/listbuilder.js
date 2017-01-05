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

  $.fn.listbuilder = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'listbuilder',
        defaults = {
          'dataset': [], // Array of data

          // Action buttons
          // use "data-action" attributes, ie. data-action="add"
          // or jQuery elements
          'btnAdd': 'add',
          'btnEdit': 'edit',
          'btnDelete': 'delete',
          'btnGoUp': 'goup',
          'btnGoDown': 'godown',

          // Template HTML
          'template': ''+
            '<ul data-handle=".handle">'+
              '{{#dataset}}'+
                '{{#text}}'+
                  '<li'+
                    '{{#value}} data-value="{{value}}"{{/value}}'+
                    '{{#selected}} selected="selected"{{/selected}}'+
                    '{{#disabled}} class="is-disabled"{{/disabled}}'+
                  '>'+
                    '<span class="handle" focusable="false" aria-hidden="true" role="presentation">&#8286;</span>'+
                    '<div class="item-content"><p>{{text}}</p></div>'+
                  '</li>'+
                '{{/text}}'+
              '{{/dataset}}'+
            '</ul>',

          'templateNewItem': ''+
            '<li data-value="{{text}}" role="option">'+
              '<span class="handle" focusable="false" aria-hidden="true" role="presentation">&#8286;</span>'+
              '<div class="item-content"><p>{{text}}</p></div>'+
            '</li>',

          'templateItemContent': '<p>{{text}}</p>'
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function ListBuilder(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // ListBuilder Methods
    ListBuilder.prototype = {

      init: function() {
        this
          .loadListview()
          .initDataset()
          .setElements()
          .handleEvents();
      },

      // Load listview
      loadListview: function() {
        var s = this.settings,
          lv = $('.listview', this.element);

        if (!s.dataset.length && lv.length && $('li', lv).length) {
          this.listApi = lv.listview({selectable: 'single'}).data('listview');
        } else if (lv.length) {
          this.listApi = lv.listview({dataset: s.dataset, template: s.template, selectable: 'single'}).data('listview');
        }
        return this;
      },

      // Init dataset
      initDataset: function() {
        var s = this.settings,
          nodes = $('.listview li', this.element);

        this.dataset = [];
        for (var i = 0, l = nodes.length; i < l; i++) {
          var data,
            li = $(nodes[i]);
          if (s.dataset) {
            // Make sure it's not reference pointer to data object, make copy of data
            data = JSON.parse(JSON.stringify(s.dataset[i]));
            data.node = li;
          }
          else {
            data = this.extractNodeData(li);
          }
          this.dataset.push(data);
        }
        return this;
      },

      // Extract node data
      extractNodeData: function(node) {
        var data = {node: node, text: $.trim($('.item-content', node).text())},
          value = node.attr('data-value');
        if (typeof value !== 'undefined') {
          data.value = value;
        }
        return data;
      },

      // Set elements
      setElements: function() {
        var self = this,
          s = this.settings;

        // Action buttons
        var setAction = function(selector) {
          return self.isjQuery(selector) ?
            selector : (typeof selector === 'string' ?
              $('[data-action="'+ selector +'"]', self.element) : null);
        };
        s.btnAdd = setAction(s.btnAdd);
        s.btnGoUp = setAction(s.btnGoUp);
        s.btnGoDown = setAction(s.btnGoDown);
        s.btnEdit = setAction(s.btnEdit);
        s.btnDelete = setAction(s.btnDelete);

        // Init tooltips
        this.topButtons = s.btnAdd.add(s.btnGoUp).add(s.btnGoDown).add(s.btnEdit).add(s.btnDelete);
        this.topButtons.tooltip();

        // Make Draggable
        this.ul = $('.listview ul', this.element);
        this.arrangeApi = this.ul.arrange({
          placeholder: s.templateNewItem
        }).data('arrange');

        return this;
      },

      // Handle Events
      handleEvents: function() {
        var data,
          self = this,
          s = self.settings;

        // TOP BUTTONS =============================================================================
        var topButtonsClick = function(btn, method) {
          btn.onTouchClick('listbuilder').on('click.listbuilder', function() {
            self[method]();
          });
        };
        topButtonsClick(s.btnAdd, 'addItem');
        topButtonsClick(s.btnGoUp, 'moveItemUp');
        topButtonsClick(s.btnGoDown, 'moveItemDown');
        topButtonsClick(s.btnEdit, 'editItem');
        topButtonsClick(s.btnDelete, 'deleteItem');

        // DRAGGABLE ===============================================================================
        self.arrangeApi.element
        .on('beforearrange.listbuilder', function(e, status) {
          var d = self.getDataByNode(status.start),
            str = s.templateItemContent.replace(/{{text}}/g, d.data.text);

          self.arrangeApi.placeholders.attr('data-value', d.data.text)
            .find('.item-content').html(str);
        })
        .on('arrangeupdate.listbuilder', function(e, status) {
          self.updateAttributes();
          self.arrayIndexMove(self.dataset, status.startIndex, status.endIndex);
          data = self.getDataByNode(status.end);
          data.indexBeforeMove = status.startIndex;
          self.element.triggerHandler('arrangeupdate', [data]);
        });

        $('li:not(.is-disabled) '+ self.arrangeApi.handle, self.ul)
          .on('mousedown.listbuilder touchstart.listbuilder', function() {
            var li = $(this);
            if (!li.is('.is-selected')) {
              li.trigger('click');
            }
          });

        return this;
      }, // END: Handle Events ---------------------------------------------------------------------

      // Add new item
      addItem: function() {
        var self = this,
          s = self.settings;

        $.when(self.element.triggerHandler('beforeadd')).done(function() {
          var li, data,
            index = 0,
            node = self.listApi.selectedItems[0],
            str = s.templateNewItem.replace(/{{text}}/g, Locale.translate('NewItem'));

          if (node && node.length > 0) {
            data = self.getDataByNode(node);
            index = data.index + 1;
            $(str).insertAfter(node);
            li = $('li', self.ul).eq(index);
          }
          else {
            self.ul.prepend(str);
            li = $('li:first-child', self.ul);
          }

          self.dataset.push(self.extractNodeData(li));
          self.arrayIndexMove(self.dataset, self.dataset.length - 1, index);
          self.updateAttributes();
          li.trigger('click');
          self.arrangeApi.updated();
          self.editItem(true);

          data = self.dataset[index];
          self.element.triggerHandler('afteradd', [data]);
        });
      },

      // Move item up
      moveItemUp: function() {
        var self = this,
          node = self.listApi.selectedItems[0];
        if (node && node.length > 0) {
          var data = self.getDataByNode(node);
          if (typeof data.index !== 'undefined' && data.index > 0) {
            $.when(self.element.triggerHandler('beforegoup', [data])).done(function() {
              var prev = node.prev();
              node.insertBefore(prev);
              self.updateAttributes();
              self.arrayIndexMove(self.dataset, data.index, data.index - 1);
              data.indexBeforeMove = data.index;
              data.index = data.index - 1;
              self.element.triggerHandler('aftergoup', [data]);
            });
          }
        }
      },

      // Move item down
      moveItemDown: function() {
        var self = this,
          node = self.listApi.selectedItems[0];
        if (node && node.length > 0) {
          var data = self.getDataByNode(node);
          if (typeof data.index !== 'undefined' && data.index < self.dataset.length - 1) {
            $.when(self.element.triggerHandler('beforegodown', [data])).done(function() {
              var next = node.next();
              node.insertAfter(next);
              self.updateAttributes();
              self.arrayIndexMove(self.dataset, data.index, data.index + 1);
              data.indexBeforeMove = data.index;
              data.index = data.index + 1;
              self.element.triggerHandler('aftergodown', [data]);
            });
          }
        }
      },

      // Edit item
      editItem: function(isNewItem) {
        var node = this.listApi.selectedItems[0];
        if (node && node.length > 0) {
          if (node.is('.is-editing')) {
            this.commitEdit(node, isNewItem);
          } else {
            this.makeEditable(node, isNewItem);
          }
        }
      },

      // Make item editable
      makeEditable: function(node, isNewItem) {
        var self = this,
          data = self.getDataByNode(node),
          container = $('.item-content', node);

        if (typeof data.index !== 'undefined' && data.index < self.dataset.length - 1) {
          $.when(self.element.triggerHandler('beforeedit', [data])).done(function() {
            var origValue = container.text().trim(),
              editInput = $('<input name="edit-input" class="edit-input" type="text" value="'+ origValue +'" />');

            node.addClass('is-editing');
            container.html(editInput);
            editInput.focus().select();
            // self.moveCursorToEnd(editInput.focus()[0]);

            editInput
            .on('click.listbuilder', function() {
              return false;
            })
            .on('blur.listbuilder', function() {
              // self.commitEdit(node, isNewItem);
            })
            .on('keypress.listbuilder', function (e) {
              var key = e.keyCode || e.charCode || 0;
              if (key === 13) {
                self.commitEdit(node, isNewItem);
                node.focus();
              }
            });

            self.element.triggerHandler('entereditmode', [data]);
          });
        }
      },

      // Commit editable item
      commitEdit: function(node, isNewItem) {
        var self = this,
          s = this.settings,
          data = self.getDataByNode(node),
          container = $('.item-content', node),
          editInput = $('.edit-input', container);

        if (isNewItem) {
          data.data.value = editInput.val();
        }
        data.data.text = editInput.val();
        editInput.off('click.listbuilder blur.listbuilder keypress.listbuilder');
        container.html(s.templateItemContent.replace(/{{text}}/g, editInput.val()));
        node.removeClass('is-editing');
        self.element.triggerHandler('exiteditmode', [data]);
      },

      // Delete item
      deleteItem: function() {
        var self = this,
          node = self.listApi.selectedItems[0];
        if (node && node.length > 0) {
          var data = self.getDataByNode(node);
          if (typeof data.index !== 'undefined') {
            $.when(self.element.triggerHandler('beforedelete', [data])).done(function() {
              self.listApi.removeAllSelected();
              self.updateAttributes();
              self.dataset.splice(data.index, 1);
              self.element.triggerHandler('afterdelete', [data]);
            });
          }
        }
      },

      // Get data from dataset by node
      getDataByNode: function(node) {
        var data = {};
        for (var i = 0,l = this.dataset.length; i < l; i++) {
          var d = this.dataset[i];
          if ($(d.node).is(node)) {
            data = {index: i, data: d};
            break;
          }
        }
        return data;
      },

      // Move an array element position
      arrayIndexMove: function(arr, from, to) {
        arr.splice(to, 0, arr.splice(from, 1)[0]);
      },

      // Check if given object is a jQuery object
      isjQuery: function (obj) {
        return (obj && (obj instanceof jQuery || obj.constructor.prototype.jquery));
      },

      // Move cursor to end
      // http://stackoverflow.com/a/26900921
      moveCursorToEnd: function (el) {
        setTimeout(function() {
          if (typeof el.selectionStart === 'number') {
            el.selectionStart = el.selectionEnd = el.value.length;
          } else if (typeof el.createTextRange !== 'undefined') {
            var range = el.createTextRange();
            range.collapse(false);
            range.select();
          }
        }, 100);
      },

      // Update attributes
      updateAttributes: function() {
        var nodes = $('li', this.ul),
          size = nodes.length;

        nodes.each(function(i) {
          $(this).attr({'aria-posinset': i + 1, 'aria-setsize': size});
        });
      },

      // Make enable
      enable: function () {
        this.element.removeClass('is-disabled')
          .find('.toolbar .buttonset button').removeAttr('disabled').end()
          .find('.toolbar .buttonset button[data-original-disabled]')
            .attr('disabled', 'disabled').removeAttr('data-original-disabled');

        this.ul
          .find('li').removeClass('is-disabled').end()
          .find('li[data-original-disabled]').addClass('is-disabled').removeAttr('data-original-disabled');
      },

      // Make disable
      disable: function () {
        this.element.addClass('is-disabled')
          .find('.toolbar .buttonset button[disabled]').attr('data-original-disabled', 'disabled').end()
          .find('.toolbar .buttonset button').attr('disabled', 'disabled');

        this.ul
          .find('li.is-disabled').attr('data-original-disabled', 'is-disabled').end()
          .find('li').addClass('is-disabled');
      },

      // Unbind all events
      unbind: function() {
        $('li '+ this.arrangeApi.handle, this.ul)
          .off('mousedown.listbuilder touchstart.listbuilder');

        this.arrangeApi.element
          .off('beforearrange.listbuilder arrangeupdate.listbuilder').destroy();

        this.topButtons.off('click.listbuilder').each(function() {
          $(this).data('tooltip').destroy();
        });

        this.listApi.destroy();
        return this;
      },

      // Update this plugin
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
        instance = $.data(this, pluginName, new ListBuilder(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
