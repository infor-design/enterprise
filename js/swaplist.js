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
          // Datasets
          'available': null,
          'selected': null,
          'additional': null,

          // Main containers
          'availableClass': '.available',
          'selectedClass': '.selected',
          'additionalClass': '.full-access',

          // Action buttons
          'availableBtn': '.btn-moveto-selected',
          'selectedBtnLeft': '.btn-moveto-left',
          'selectedBtnRight': '.btn-moveto-right',
          'additionalBtn': '.btn-moveto-selected',

          // Template HTML
          'template': ''+
            '<ul data-swap-handle=".handle">'+
              '{{#dataset}}'+
                '{{#text}}'+
                  '<li'+
                    '{{#value}} data-value="{{value}}"{{/value}}'+
                    '{{#selected}} selected="selected"{{/selected}}'+
                    '{{#disabled}} class="is-disabled"{{/disabled}}'+
                  '>'+
                    '<span class="handle" focusable="false" aria-hidden="true" role="presentation">&#8286;</span>'+
                    '<div class="swaplist-item-content"><p>{{text}}</p></div>'+
                  '</li>'+
                '{{/text}}'+
              '{{/dataset}}'+
            '</ul>'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
        var self = this,
          s = self.settings;
        self.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        self.isAdditional = $(s.additionalClass +' .listview', self.element).length > 0;
        self.loadListview();
        self.initDataset();
        self.setElements();
        self.isMultiSelectClass();

        setTimeout(function() { // Wait for Listview availability
          self.makeDraggable();
          self.handleEvents();
          self.initSelected(s.availableClass);
          self.initSelected(s.additionalClass);
        }, 0);
      },

      // Handle Events
      handleEvents: function() {
        var self = this,
          settings = self.settings,
          selections = self.selections;

        // TOP BUTTONS =============================================================================
        self.actionButtons.onTouchClick('swaplist').on('click.swaplist', function () {
          var actionButton = $(this),
            container = actionButton.closest('.card'); // Current list clicked from

          if (container.is(settings.availableClass)) { // Move from Available to Selected
            self.moveElements(settings.availableClass, settings.selectedClass);
          }

          else if (container.is(settings.additionalClass)) { // Move from Additional to Selected
            self.moveElements(settings.additionalClass, settings.selectedClass);
          }

          // Move from Selected
          else if (container.is(settings.selectedClass)) {
            if (actionButton.is(settings.selectedBtnLeft)) { // to Available
              self.moveElements(settings.selectedClass, settings.availableClass);
            }
            else if (actionButton.is(settings.selectedBtnRight)) { // to Additional
              self.moveElements(settings.selectedClass, settings.additionalClass);
            }
          }
        });


        // KEYSTROKE ===============================================================================
        // Keydown event to implement selections
        self.containers.on('keydown.swaplist', function(e) {
          var container = $(this);
          e = e || window.event;
          if(e.keyCode === 77 && self.hasModifier(e)) { // Modifier + M
            if(!container.is(settings.selectedClass) ||
              (container.is(settings.selectedClass) && self.selectedButtons.length === 1)) {
              container.find(self.actionButtons).trigger('click.swaplist');
            } else {
              self.selectedButtons.first().focus();
            }
            e.preventDefault();
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

        self.element.on('keydown.swaplist', self.tabButtonsStr, function(e) {
          var btn = $(this),
            keyCode = e.keyCode || e.which;

          if(keyCode === 9 && !e.shiftKey) { // Tab key
            $('li:first-child', btn.closest('.card')).focus();
            e.preventDefault();
          }
        });


        // DRAGGABLE ===============================================================================
        self.element
        .on('mousedown.swaplist', self.dragElements, function(e) {
          if (self.handle) {
            var target = $(e.target).closest('li');
            target.attr({ 'draggable': $(e.target).is('.draggable') });
          }
          e.stopPropagation();
        })
        .onTouchClick('swaplist', self.dragElements)

        // Dragstart - initiate dragging
        .on(self.dragStart, self.dragElements, function(e) {
          var touch, pos, posOwner, placeholderContainer,
            scrollable = $('.scrollable'),
            target = $(e.target).closest('li'),
            list = $('.listview', target.closest('.card')).data('listview');

          if (!!self.handle && !selections.isHandle) {
            return;
          }

          if(!self.isTouch) {
            self.draggedMakeSelected(list, target);
          }

          self.clearSelections(); // Clear selection before fill

          selections.owner = target.closest('.card');
          selections.dragged = target;
          selections.draggedIndex = target.index();
          selections.placeholder = target.clone(true);
          selections.placeholder.attr('id', 'sl-placeholder');

          self.setSelectionsItems(selections.owner);

          selections.items = list.selectedItems;
          self.element.triggerHandler('beforeswap', [selections.itemsData]);

          $('.'+ settings.numOfSelectionsClass, settings.itemContentTempl).html(selections.items.length);
          self.addDropeffects();

          if(!self.isTouch) {
            selections.dragged.addClass('is-dragging');
            e.originalEvent.dataTransfer.setData('text', '');

            if (selections.items.length > 1) {
              $('.'+ settings.itemContentClass, selections.dragged).html(settings.itemContentTempl.html());
            }
          }
          else {
            touch = e.originalEvent.changedTouches[0];
            pos = target.position();
            posOwner = selections.owner.position();

            scrollable = {
              left: (scrollable.scrollLeft() || 0),
              top: (scrollable.scrollTop() || 0)
            };

            self.offset = {
              x: touch.pageX - ((posOwner.left + scrollable.left) + pos.left),
              y: touch.pageY - ((posOwner.top + scrollable.top) + pos.top + target.outerHeight(true)*1.2)
            };

            self.containers.css({'z-index': 1});
            selections.placeholderTouch = selections.dragged.clone(true);

            if (selections.items.length > 1 && !$('#sl-placeholder-touch2').length) {
              selections.dragged.clone()
                .addClass('is-dragging-touch').attr('id', 'sl-placeholder-touch2')
                .insertBefore(selections.dragged)
                .hide();
            }
            selections.placeholderTouch.attr('id', 'sl-placeholder-touch').removeClass('is-selected').hide();

            // Mobile view with three container(available, selected, additional) prepend to parent
            placeholderContainer = (self.element.is('.one-third') && self.isMaxWidth(766)) ? self.element.parent() : self.element;
            placeholderContainer.prepend('<ul id="sl-placeholder-container"></ul>');

            $('#sl-placeholder-container').append(selections.placeholderTouch);
            $('#sl-placeholder-container, #sl-placeholder-touch').css({width: selections.owner.width() +'px'});

            self.draggTouchElement(e, selections.placeholderTouch);
          }
          e.stopPropagation();
        })

        // Dragenter - set that related/droptarget
        .on(self.dragEnterWhileDragging, self.dragElements, function(e) {
          if (!selections.dragged) {
            return;
          }
          self.element.triggerHandler('draggingswap', [selections.itemsData]);
          selections.related = e.target;
          $('ul, li', self.element).removeClass('over');
          $(e.target).closest('ul, li').addClass('over');
          selections.droptarget = $(selections.related).closest('.card');
          $('[aria-grabbed="true"]', self.element).not(selections.dragged).slideUp();
          e.stopPropagation();
        })

        // Dragover - allow the drag by preventing default, for touch set related/droptarget
        .on(self.dragOverWhileDragging, self.dragElements, function(e) {
          if (!selections.dragged) {
            return;
          }
          var touch,
            overItem = $(this),
            list = $('.listview', selections.dragged.closest('.card')).data('listview');

          if(self.isTouch) {
            if (!!self.handle && !selections.isHandle) {
              return;
            }

            if (!selections.isInSelection) {
              self.draggedMakeSelected(list, selections.dragged);
              selections.items = list.selectedItems;
              $('.'+ settings.numOfSelectionsClass, settings.itemContentTempl).html(selections.items.length);
            }

            touch = e.originalEvent.touches[0];
            overItem = self.getElementByTouchInList($('ul, li', self.element), touch.pageX, touch.pageY) || overItem;

            selections.dragged.addClass('is-dragging');
            selections.placeholderTouch.addClass('is-dragging is-dragging-touch');
            selections.placeholderTouch.show();

            $('[aria-grabbed="true"]', self.element)
              .not(selections.dragged)
              .not(selections.placeholderTouch)
              .not('#sl-placeholder-touch2')
              .slideUp();

            if (selections.items.length > 1) {
              $('.'+ settings.itemContentClass, (selections.placeholderTouch.add('#sl-placeholder-touch2')))
                .html(settings.itemContentTempl.html());

              $('#sl-placeholder-touch2').show();
              selections.dragged.hide();
            }
            self.draggTouchElement(e, selections.placeholderTouch);

            self.element.triggerHandler('draggingswap', [selections.itemsData]);
            selections.related = overItem;
            $('ul, li', this.element).removeClass('over');
            overItem.closest('ul, li').addClass('over');
            selections.droptarget = selections.related.closest('.card');
          }
          e.preventDefault();
          e.stopPropagation();
        })

        // Dragend - implement items being validly dropped into targets
        .on(self.dragEnd, self.dragElements, function(e) {
          var related = $(selections.related).closest('li'),
          ul = $('ul', selections.droptarget),
          currentSize = $('li', ul).length,
          size = selections.items.length + currentSize;

          self.unselectElements($('.listview', selections.owner).data('listview'));

          $.each(selections.items, function(index, val) {
            val = $(val);
            if (currentSize && !$(selections.related).is('ul')) {
              var isLess = (related.index() < selections.draggedIndex),
                el = isLess ? val : $(selections.items[(selections.items.length-1) - index]),
                posinset = related.index()+(isLess ? index+1 : index+2);

              val.attr({ 'aria-posinset': posinset, 'aria-setsize': size });
              related[isLess ? 'before' : 'after'](el);

            } else {
              val.attr({ 'aria-posinset': currentSize+index+1, 'aria-setsize': size });
              ul.append(val);
            }
            val.focus();
          });

          if (selections.items.length > 1) {
            $('.'+ settings.itemContentClass, selections.dragged).html(
              $('.'+ settings.itemContentClass, selections.placeholder).html()
            );
            if(self.isTouch) {
              selections.dragged.show();
            }
          }

          if(self.isTouch) {
            self.containers.css({'z-index': ''});
          }

          selections.isHandle = null;
          $('[aria-grabbed="true"]', self.element).show();
          self.afterUpdate($('.listview', selections.droptarget).data('listview'));
          e.preventDefault();
          e.stopPropagation();
        });
      }, // END: Handle Events ---------------------------------------------------------------------


      // Load listview
      loadListview: function() {
        var i, l, lv, c,
          self = this,
          s = self.settings,
          containers = [
            { dataset: s.available, class: s.availableClass },
            { dataset: s.selected, class: s.selectedClass },
            { dataset: s.additional, class: s.additionalClass }
          ];

        for (i=0,l=containers.length; i<l; i++) {
          c = containers[i];
          lv = $(c.class +' .listview', self.element);
          if (!c.dataset && lv.length && $('li', lv).length) {
            lv.listview({ selectable: 'multiple' });
          }
          else if (lv.length) {
            lv.listview({ dataset: (c.dataset || []), template: s.template, selectable: 'multiple' });
          }
        }
      },


      // Set elements
      setElements: function() {
        this.offset = null;

        this.containers = $(
          this.settings.availableClass +','+
          this.settings.selectedClass +','+
          this.settings.additionalClass, this.element);

        this.actionButtons = $(
          this.settings.availableBtn +','+
          this.settings.additionalBtn +','+
          this.settings.selectedBtnLeft +','+
          this.settings.selectedBtnRight, this.element);

        this.selectedButtons = $(
          this.settings.selectedBtnLeft +','+
          this.settings.selectedBtnRight, this.element);

        this.tabButtonsStr = ''+
          this.settings.availableBtn +' '+
          this.settings.additionalBtn +' '+
          (this.selectedButtons.length > 1 ?
            this.settings.selectedBtnRight : this.settings.selectedBtnLeft);

        this.dragElements = 'ul, li:not(.is-disabled)';
        this.dragStart = 'dragstart.swaplist touchstart.swaplist gesturestart.swaplist';
        this.dragEnterWhileDragging = 'dragenter.swaplist';
        this.dragOverWhileDragging = 'dragover.swaplist touchmove.swaplist gesturechange.swaplist';
        this.dragEnd = 'dragend.swaplist touchend.swaplist touchcancel.swaplist gestureend.swaplist';

        this.selections = {
          'items': [],
          'owner': null,
          'related': null,
          'droptarget': null,
          'isInSelection': null,
          'isHandle': null,
          'placeholder': null,
          'placeholderTouch': null,
          'dragged': null,
          'draggedIndex': null
        };

        // Dragging time placeholder
        this.settings.numOfSelectionsClass = 'num-of-selections';
        this.settings.itemContentClass = 'swaplist-item-content';
        this.settings.itemContentTempl = $(
          '<div><p><span class="'+ this.settings.numOfSelectionsClass +'">###</span> '+
            Locale.translate('ItemsSelected') +'</p><div/>'
        );
      },

      // When list is Empty force to add css class "is-muliselect"
      isMultiSelectClass: function() {
        var i, l, lv,
          s = this.settings,
          containers = [s.availableClass, s.selectedClass, s.additionalClass];

        for (i=0,l=containers.length; i<l; i++) {
          lv = $(containers[i] +' .listview', this.element);
          if (!$('li', lv).length) {
            lv.addClass('is-muliselect');
          }
        }
      },

      // Initialize pre selected items
      initSelected: function(container) {
        var list;
        container = this.isjQuery(container) ? container : $(container, this.element);
        if (container.length) {
          list = $('.listview', container).data('listview');
          $('li[selected]', container).each(function() {
            $(this).removeAttr('selected');
            list.select($(this));// Select this item
          });
          this.moveElements(container, this.settings.selectedClass);
          $(this.settings.selectedClass +' li:last-child', this.element).blur();
        }
      },

      // Move Elements
      moveElements: function(from, to) {
        var ul, size, currentSize,
          self = this, list;

        from = (typeof from !== 'string') ? from : $(from, self.element);
        to = (typeof to !== 'string') ? to : $(to, self.element);
        list = $('.listview', from).data('listview');

        self.clearSelections();
        self.selections.owner = from;
        self.selections.droptarget = to;

        if(self.isTouch) {
          $.each(list.selectedItems, function(index, val) {
            self.selections.items[index] = val.closest('li');
          });
        } else {
          self.selections.items = list.selectedItems;
        }

        self.setSelectionsItems(self.selections.owner);
        self.unselectElements(list);

        if (self.selections.items.length) {
          self.element.triggerHandler('beforeswap', [self.selections.itemsData]);

          ul = $('ul', to);
          currentSize = $('li', ul).length;
          size = self.selections.items.length + currentSize;

          $.each(self.selections.items, function(index, val) {
            val = $(val);
            val.attr({ 'aria-posinset': currentSize + index + 1, 'aria-setsize': size });
            ul.append(val);
            val.focus();
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

      // Detect browser support for match-media
      isMatchMediaSupports: function() {
        return (typeof window.matchMedia !== 'undefined' || typeof window.msMatchMedia !== 'undefined');
      },

      // Detect browser viewport
      viewport: function() {
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
          a = 'client';
          e = document.documentElement || document.body;
        }
        return { width : e[a+'Width'] , height : e[a+'Height'] };
      },

      // Check given [max-width] is true/false
      isMaxWidth: function(w) {
        return ((this.isMatchMediaSupports() && window.matchMedia('(max-width: '+ w +'px)').matches) || this.viewport().width <= w);
      },

      // Make Draggable
      makeDraggable: function() {
        var self = this,
          ul = $('ul', self.element);

        if (self.isDragAndDropSupports) {
          // Use Handle if available
          self.handle = ul.first().attr('data-swap-handle');
          self.handle = (!self.isTouch && !!$(self.handle, ul).length) ? self.handle : null;
          $(self.handle, ul).addClass('draggable')
            .on('mousedown.swaplist touchstart.swaplist', function() { self.selections.isHandle = true; })
            .on('mouseup.swaplist touchend.swaplist', function() { self.selections.isHandle = false; });

          self.targets = ul.attr({'aria-dropeffect': 'none'});

          self.items = $('li:not(.is-disabled)', self.element)
            .not('a[href], img').on('selectstart.swaplist', function() {
              if(this.dragDrop) { this.dragDrop(); } //ie9
              return false;
            }).end()
            .attr({'draggable': true})
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

      // Dragg touch element
      draggTouchElement: function(e, elm) {
        var orig = e.originalEvent;
        elm.css({
          top: orig.changedTouches[0].pageY - this.offset.y,
          left: orig.changedTouches[0].pageX - this.offset.x
        });
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
        this.targets.attr({'aria-dropeffect': 'none'}).removeAttr('tabindex');
        $.each(this.selections.items, function(index, val) {
          val = $(val);
          val.removeAttr('aria-grabbed' + (!val.is(':focus') ? ' tabindex' : ''));
        });
      },

      // Clear selections
      clearSelections: function() {
        this.selections.items = [];
        this.selections.itemsData = [];
        this.selections.owner = null;
        this.selections.related = null;
        this.selections.droptarget = null;
        this.selections.isInSelection = null;
        this.selections.dragged = null;
        this.selections.placeholder = null;
        this.selections.placeholderTouch = null;
        $('ul, li', this.element).removeClass('over');
        $('#sl-placeholder-container, #sl-placeholder-touch, #sl-placeholder-touch2, #sl-placeholder').remove();
      },

      // Set selections items
      setSelectionsItems: function(container) {
        container = this.isjQuery(container) ? container : $(container, this.element);
        var nodes = $('.listview li', container),
          dataList = this.getDataList(container);
        for (var i=0,l=nodes.length; i<l; i++) {
          var li = $(nodes[i]);
          if (li.is('.is-selected')) {
            this.selections.itemsData.push(dataList[i]);
          }
        }
      },

      // Init dataset
      initDataset: function() {
        var s = this.settings,
          containers = [
            {type: 'available', dataset: s.available, class: s.availableClass},
            {type: 'selected', dataset: s.selected, class: s.selectedClass},
            {type: 'additional', dataset: s.additional, class: s.additionalClass}
          ];

        this.dataset = {'available': [], 'selected': []};
        if (this.isAdditional) {
          this.dataset.additional = [];
        }

        for (var i=0,l=containers.length; i<l; i++) {
          var c = containers[i],
            nodes = $(c.class +' .listview li', this.element);
          for (var nodeIndex=0,l2=nodes.length; nodeIndex<l2; nodeIndex++) {
            var data, value,
              li = $(nodes[nodeIndex]);
            if (c.dataset) {
              // Make sure it's not reference pointer to data object, make copy of data
              data = JSON.parse(JSON.stringify(c.dataset[nodeIndex]));
              delete data.selected;
            }
            else {
              data = {text: $.trim($('.swaplist-item-content', li).text())};
              value = li.attr('data-value');
              if (value) {
                data.value = value;
              }
            }
            if (this.dataset[c.type]) {
              data.node = li;
              this.dataset[c.type].push(data);
            }
          }
        }
      },

      // Get data list
      getDataList: function(container) {
        var s = this.settings,
          d = this.dataset;
        container = this.isjQuery(container) ? container : $(container, this.element);
        return container.is(s.additionalClass) ? d.additional :
          (container.is(s.selectedClass) ? d.selected :
            (container.is(s.availableClass) ? d.available : []));
      },

      // Move an array element position
      arrayIndexMove: function(arr, from, to) {
        arr.splice(to, 0, arr.splice(from, 1)[0]);
      },

      // Sync dataset
      syncDataset: function(owner, droptarget) {
        var droptargetNodes = $('.listview li', droptarget),
          ownerDataList = this.getDataList(owner),
          dtDataList = this.getDataList(droptarget);

        for (var i=0,l=this.selections.items.length; i<l; i++) {
          var item = this.selections.items[i];
          for (var dtIndex=0,l2=droptargetNodes.length; dtIndex<l2; dtIndex++) {
            if ($(droptargetNodes[dtIndex]).is(item)) {
              for (var ownerIndex=0,l3=ownerDataList.length; ownerIndex<l3; ownerIndex++) {
                var ownerItem = ownerDataList[ownerIndex];
                if (ownerItem.node && ownerItem.node.is(item)) {
                  dtDataList.push(ownerItem);
                  ownerDataList.splice(ownerIndex, 1);
                  this.arrayIndexMove(dtDataList, dtDataList.length-1, dtIndex);
                  break;
                }
              }
            }
          }
        }
      },

      // Check if a object is jQuery object
      isjQuery: function (obj) {
        return (obj && (obj instanceof jQuery || obj.constructor.prototype.jquery));
      },

      // Update attributes
      updateAttributes: function(list) {
        var items = $('li', list),
          size = items.length;

        items.each(function(i) {
          $(this).attr({ 'aria-posinset': i+1, 'aria-setsize': size });
        });
      },

      // After update
      afterUpdate: function(list) {
        var self = this;

        setTimeout(function() {
          if (list) {
            if (self.selections.placeholder) {
              list.select(self.selections.placeholder);
              self.selections.placeholder.focus();
            }
            self.unselectElements(list);
            self.syncDataset(self.selections.owner, self.selections.droptarget);
            self.updateAttributes($('.listview', self.selections.owner));
            self.updateAttributes($('.listview', self.selections.droptarget));
            if (self.selections.items.length) {
              self.element.triggerHandler('swapupdate', [self.selections.itemsData]);
            }
          }
          self.clearDropeffects();
          self.clearSelections();
          self.items.removeClass('is-dragging is-dragging-touch');
        }, 100);
      },

      // Get items from provided container
      getItems: function(container) {
        container = this.isjQuery(container) ? container : $(container, this.element);
        return this.getDataList(container);
      },

      // Get available dataset
      getAvailable: function() {
        return this.getDataList(this.settings.availableClass);
      },

      // Get selected dataset
      getSelected: function() {
        return this.getDataList(this.settings.selectedClass);
      },

      // Get additional dataset
      getAdditional: function() {
        return this.getDataList(this.settings.additionalClass);
      },

      // Make selected if dragged element was not selected
      draggedMakeSelected: function(list, target) {
        var self = this, isInSelection = false;
        if (!self.selections.isInSelection) {
          // Check if dragged element was selected or not
          $.each(list.selectedItems, function(index, val) {
            if (target[0] === val[0]) {
              isInSelection = true;
              return false;
            }
          });
          if (!isInSelection) {
            list.select(target); // Make selected
            self.selections.isInSelection = true;
          }
        }
      },

      unbind: function() {
        this.actionButtons.off('click.swaplist');
        this.containers.off('keydown.swaplist');
        this.selectedButtons.off('keydown.swaplist');
        this.element.off(this.dragStart+' '+this.dragEnterWhileDragging +' '+this.dragOverWhileDragging +' '+this.dragEnd, this.dragElements);

        $('#sl-placeholder-container, #sl-placeholder-touch, #sl-placeholder-touch2, #sl-placeholder').remove();
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
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
