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

  $.fn.listview = function(options) {
    // TODOs: edit and/or alt template
    // navigatable
    // template (as id or string)
    // Methods: add, remove (X), clear (X), destroy, refresh (rebind) (X), select (get or set) (X)
    // Events: rendered, add, select
    // Settings and Options
    var pluginName = 'listview',
      defaults = {
        dataset: [], // Array of data
        template: null,  //Html Template String
        description: null,  //Audible Label (or use parent title)
        paging: false, // If true, activates paging
        pagesize: 10, // If paging is activated, sets the number of listview items available per page
        searchable: false, // If true, associates itself with a Searchfield/Autocomplete and allows itself to be filtered
        selectable: 'single', //false, 'single' or 'multiple'
        selectOnFocus: true, //true or false
        hoverable: true, //true or false - can disable hover state
        source: null, // External function that can be used to provide a datasource
      },
      settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function ListView(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Object
    ListView.prototype = {
      init: function() {
        this.setup();
        this.refresh();
        this.selectedItems = [];
        this.lastSelectedRow = 0; // Rember index to use shift key
        this.isSelectedAll = false; // Rember if all selected or not
        this.sortInit('listview', 'click.listview', 'data-sortlist');
        this.handleEvents();
        this.handleResize();
      },

      setup: function() {
        var self = this,
          card = this.element.closest('.card, .widget'),
          selectable = this.element.attr('data-selectable'),
          selectOnFocus = this.element.attr('data-select-onfocus');

        if (selectable && selectable.length) {
          this.settings.selectable = selectable;
        }

        if (selectOnFocus && selectOnFocus.length) {
          this.settings.selectOnFocus = JSON.parse(selectOnFocus);
        }

        self.actionButton = card.find('.btn-actions');

        if (self.actionButton.length > 0) {
          // Action Buttons may already be invoked via initialize.js.
          if (!(self.actionButton.data('popupmenu'))) {
            self.actionButton.popupmenu();
          }
        }

        this.element.attr({'tabindex': '-1'});

        // Configure Paging
        if (this.element.is('.paginated') || this.settings.paging === true) {
          this.element.pager({
            componentAPI: this,
            pagesize: this.settings.pagesize,
            source: this.settings.source
          });
        }

        var cardWidgetContent =  this.element.parent('.card-content, .widget-content');
        if (cardWidgetContent[0]) {
          cardWidgetContent[0].style.overflow = 'hidden';
        }

         // Add Aria Roles
        this.element.attr({ 'role' : 'listbox',
          'aria-label' : this.settings.description || card.find('.card-title, .widget-title').text()
        });

        // Associate with an existing searchfield, if applicable
        if (this.settings.searchable) {
          this.searchfield = this.element.parent().find('.searchfield, .autocomplete');

          if (!this.searchfield.length) {
            // TODO: Create Searchfield somehow
          }

          this.listfilter = new ListFilter({
            filterMode: 'contains'
          });
        }

        if (this.settings.dataset) {
          // Search the global variable space for a dataset variable name, if provided.
          if (typeof this.settings.dataset === 'string') {
            var dataset = window[this.settings.dataset];
            if (dataset && dataset.length) {
              this.settings.dataset = dataset;
            }
          }
        }
      },

      getTotals: function(dataset) {
        var totals = { count: dataset.length },
          property;

        if (!dataset[0]) {
          return;
        }

        for (property in dataset[0]) {
          totals[property] = 0;
        }

        for (var i = 0; i < dataset.length; i++) {
          for (property in dataset[i]) {
            totals[property] += parseFloat(dataset[i][property]);
          }
        }
        return totals;
      },

      render: function(dataset, pagerInfo) {
        var self = this,
          totals = {};

        // Render "mustache" Template
        if (typeof Tmpl === 'object' && dataset && this.settings.template) {

          // create a copy of an inlined template
          if (this.settings.template instanceof $) {
            this.settings.template = '' + this.settings.template.html();
          }

          if (this.settings.template.indexOf('{{#totals}}') > -1) {
            totals = this.getTotals(dataset);
          }

          var compiledTmpl = Tmpl.compile(this.settings.template),
            renderedTmpl = compiledTmpl.render({dataset: dataset, totals: totals});

          this.element.html(renderedTmpl);
        }

        // Render Pager
        if (this.settings.paging) {
          this.renderPager(pagerInfo);
        }

        // Add Aria
        $('ul', this.element).attr({'role': 'presentation'});

        // Add Checkboxes
        var first = this.element.find('li, tbody > tr').first(),
          items = this.element.find('li, tr'),
          isMultiselect = (this.settings.selectable === 'multiple');

        //Set Initial Tab Index
        first.attr('tabindex', 0);

        items.each(function (i) {
          var row = $(this);

          row.attr('role', 'option');

          if (isMultiselect) {
            // Add Selection Checkboxes
            self.element.addClass('is-muliselect');

            // Create a Toolbar for the "Selected Items" area
            var selectedToolbar = self.element.prevAll('.toolbar');
            if (selectedToolbar.length && selectedToolbar.data('toolbar')) {
              selectedToolbar.data('toolbar').toggleMoreMenu();
            }
          }

          // Add Aria
          row.attr({'aria-posinset': i+1, 'aria-setsize': items.length});

          // Add Aria disabled
          if (row.hasClass('is-disabled')) {
            row.attr('aria-disabled','true');
          }
        });

        // TODO: Invoke the "element" here after we write an updated method.
        this.element.children().initialize();
        this.element.trigger('rendered', [dataset]);

        //Handle refresh
        this.element.off('updated').on('updated', function () {
          self.refresh();
        });
      },

      renderPager: function(updatedPagerInfo) {
        var api = this.element.data('pager');
        if (!api || !this.settings.pager) {
          return;
        }

        api.updatePagingInfo(updatedPagerInfo);
      },

      // Get the Data Source. Can be an array, Object or Url
      refresh: function () {
        this.loadData();

        if (this.list) {
          this.render(this.list.data);
        }
      },

      // Load Data from an external API
      loadData: function (ds, pagerInfo) {
        var ajaxDs = false;

        ds = ds || this.settings.dataset;
        pagerInfo = pagerInfo || {};

        if (!ds) {
          return;
        }

        function done(response, pagingInfo) {
          ds = response;
          this.render(ds, pagingInfo);
        }

        var self = this,
          s = this.settings.source;

        if (typeof ds === 'string' && (ds.indexOf('http') === 0 || ds.indexOf('/') === 0)) {
          s = ds;
          ajaxDs = true;
        }

        // If paging is not active, and a source is present, attempt to retrieve information from the datasource
        // TODO: Potentially abstract this datasource concept out for use elsewhere
        if ((!this.settings.paging && s) || ajaxDs) {
          switch (typeof s) {
            case 'function':
              return s(pagerInfo, done);
            case 'string':
              if (s.indexOf('http') === 0 || s.indexOf('/') === 0) {
                $.ajax({
                  url: s,
                  async: false,
                  dataType: 'json',
                  success: function(response) {
                    ds = self.settings.dataset = response;
                    return self.render(ds, pagerInfo);
                  }
                });
              }
              return;
            default:
              ds = this.settings.dataset = s;
              return this.render(s, pagerInfo);
          }
        }

        // Otherwise, simply render with the existing dataset
        this.render(ds, pagerInfo);
      },

      // Toggle all
      toggleAll: function() {
        this[this.isSelectedAll ?
          'unselectRowsBetweenIndexes' :
          'selectRowsBetweenIndexes']([0, $('li, tbody tr', this.element).length-1]);
        this.isSelectedAll = !this.isSelectedAll;
      },

      // Select rows between indexes
      selectRowsBetweenIndexes: function(indexes) {
        this.clearSelection();
        indexes.sort(function(a, b) { return a-b; });
        for (var i = indexes[0]; i <= indexes[1]; i++) {
          var item = $('li, tbody tr', this.element).eq(i);

          if (!item.is('.is-disabled, .is-selected')) {
            this.select(item);
          }
        }
      },

      // Unselect rows between indexes
      unselectRowsBetweenIndexes: function(indexes) {
        indexes.sort(function(a, b) { return a-b; });
        for (var i = indexes[0]; i <= indexes[1]; i++) {
          var item = $('li, tbody tr', this.element).eq(i);
          if(!item.is('.is-disabled') && item.is('.is-selected')) {
            this.select(item);
          }
        }
      },

      // Clear Selection
      clearSelection: function() {
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
        } else if (document.selection) {
          document.selection.empty();
        }
      },

      // Handle Keyboard / Navigation Ect
      handleEvents: function () {
        var self = this,
          isSelect = false,
          isFocused = false,
          isMultiple = self.settings.selectable === 'multiple';

        this.element.on('focus.listview', 'li, tbody tr', function () {
          var item = $(this);

          // First element if disabled
          if (item.is(':first-child') && item.hasClass('is-disabled')) {
            var e = $.Event('keydown.listview');
              e.keyCode= 40; // move down
            isSelect = true;
            item.trigger(e);
          }

          if ((!isSelect) &&
              (!item.hasClass('is-disabled')) &&
              (self.settings.selectOnFocus) &&
              (self.settings.selectable !== 'multiple')) {

            self.select(item);
            isSelect = true;
            isFocused = true;
          }
        });

        // Key Board
        this.element.on('keydown.listview', 'li, tr', function (e) {
          var item = $(this),
            list = item.parent(),
            key = e.keyCode || e.charCode || 0,
            metaKey = e.metaKey;

          if (item.index() === 0 && e.keyCode === 38) {
            return;
          }

          if ((key === 40 || key === 38) && !metaKey) {// move down or up
            var newItem = e.keyCode === 40 ? item.nextAll(':not(.is-disabled):visible:first') : item.prevAll(':not(.is-disabled):visible:first');

            if ($(e.target).is(item) || e.shiftKey) {
              self.focus(newItem);
            }
            e.preventDefault();
            e.stopPropagation();  //prevent container from scrolling
          }

          if (key === 35 || (key === 40 && metaKey)) { //end
            var last = list.children().last();
            self.focus(last);
            e.stopPropagation();
            return false;
          }

          if (key === 36 || (key === 38 && metaKey)) {  //home
            var first = list.children().first();
            self.focus(first);
            e.stopPropagation();
            return false;
          }

          if (key === 32) { // Space to toggle selection
            if ($(e.target).is(item)) {
              if(isMultiple && e.shiftKey) {
                self.selectRowsBetweenIndexes([self.lastSelectedRow, item.index()]);
              } else {
                self.select(item);
              }
              e.preventDefault();
            }
          }

          // If multiSelect is enabled, press Control+A to toggle select all rows
          if (isMultiple && ((e.ctrlKey || e.metaKey) && key === 65)) {
            self.toggleAll();
            self.focus(item);
            e.preventDefault();
          }

        });

        // Selection View Click/Touch
        if (this.settings.selectable) {

          this.element.addClass('is-selectable');
          var trigger = $('.list-detail-back-button').find('.app-header'),
            pattern = $(this.element).closest('.list-detail, .builder');

          trigger.parent().onTouchClick('listview').on('click.listview', function (e) {
            if (trigger.hasClass('go-back')) {
              trigger.removeClass('go-back');
              pattern.removeClass('show-detail');
            }
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
          });

          this.element
          .off('listview', 'li, tr')
          .on('click.listview', 'a', function (e) {
            $(this).closest('li').click();
            e.preventDefault();
            return false;
          });

          this.element
          .off('listview', 'li, tr')
          .on('click.listview', 'li, tr', function (e) {
            var item = $(this);

            if (!isFocused && !item.hasClass('is-disabled')) {
              isSelect = true;

              if(isMultiple && e.shiftKey) {
                self.selectRowsBetweenIndexes([self.lastSelectedRow, item.index()]);
                e.preventDefault();
              } else {
                self.select(item);
              }
              item.focus();
            }

            if (pattern.length > 0 && $(window).outerWidth() < 767 && !item.hasClass('is-disabled')) {
              pattern.toggleClass('show-detail');
              trigger.toggleClass('go-back');
            }

            isFocused = false;
          });
        }

        if (!this.settings.hoverable || this.settings.hoverable === 'false') {
          this.element.removeClass('is-selectable');
          this.element.addClass('disable-hover');
        }

        if (!this.settings.selectable || this.settings.selectable === 'false') {
          this.element.removeClass('is-selectable');
          this.element.addClass('disable-hover');
        }

        if (this.settings.selectable === 'multiple') {
          this.element.on('change.selectable-listview', '.listview-checkbox input', function (e) {
           $(this).parent().trigger('click');
           e.stopPropagation();
          });
        }

        // For use with Searchfield
        if (this.settings.searchable) {
          this.searchfield.on('contents-checked.searchable-listview', function(e) {
            self.handleSearch(e, $(this));
          });
        }

        //If used with a Pager Control, listen for the end of the page and scroll the Listview to the top
        if (this.element.data('pager')) {
          this.element.on('afterpaging.listview', function() {
            self.element.scrollTop(0);
          });
        }

        $('body').on('resize.listview', function() {
          self.handleResize();
        });

        //Animate open and Closed from the header
        self.element.prev('.listview-header').onTouchClick().on('click', function () {
          var icon = $(this).find('.plus-minus');
          if (icon.hasClass('active')) {
            icon.removeClass('active');
            self.element.animateClosed();
          } else {
            icon.addClass('active');
            self.element.animateOpen();
          }
        });

      },

      // Handle Resize
      handleResize: function () {
        var items = $('li .listview-heading, tr .listview-heading', this.element),
          item1 = items.eq(1),
          item1W = item1.width();

        if (item1.length && item1W) {
          items[0].style.width = item1W + 'px';
        }

        this.setChildIconsValign();

        if (this.element.data('pager')) {
          this.element.data('pager').renderBar();
        }
      },

      // For instances of Listview that are paired with a Searchfield
      // NOTE: Search functionality is called from "js/listfilter.js"
      handleSearch: function(e, searchfield) {
        var list = this.element.find('li, tbody > tr'),
            term = searchfield.val(),
            results;

        this.resetSearch(list);

        if (term && term.length) {
          results = this.listfilter.filter(list, term);
        }

        if (!results || !results.length && !term) {
          return;
        }

        list.not(results).addClass('hidden');
        list.filter(results).each(function(i) {
          var li = $(this);
          li.attr('tabindex', i === 0 ? '0' : '-1');
          li.highlight(term);
        });

        this.renderPager();
      },

      resetSearch: function(list) {
        list.removeClass('hidden').each(function() {
          $(this).unhighlight();
        });
      },

      // Fix: for vertical-align to icons and buttons
      setChildIconsValign: function() {
        $('li > .icon, li > button', this.element).each(function() {
          var item = $(this),
          itemHeihgt = item.is('button') ? 42 : 22,
          row = item.closest('li'),
          padding = parseInt(row[0].style.paddingTop, 10) + parseInt(row[0].style.paddingBottom, 10),
          rowHeight = row.outerHeight() - padding;

          this.style.top = ((rowHeight - itemHeihgt)/2) +'px';
        });
      },

      focus: function (item) {
        if (item.is(':hidden') || item.is('.is-disabled')) {
          return;
        }

        item.siblings().removeAttr('tabindex');
        item.attr('tabindex', 0).focus();

        if (this.settings.selectOnFocus && (this.settings.selectable !== 'multiple')) {
          this.select(item);
        }
      },

      // Remove Either the list element or index
      remove: function (li) {
        if (typeof li === 'number') {
          li = $(this.element.children()[0]).children().eq(li);
        }
        // Un-select selected item
        if (li.is('.is-selected')) {
          this.select(li);
        }
        li.remove();
      },

      // Remove All
      clear: function () {
        var root = $(this.element.children()[0]);
        root.empty();
      },

      // Remove all selected
      removeAllSelected: function () {
        var self = this;
        $.each(this.selectedItems, function(index, selected) {
          self.remove(selected);
        });
      },

      // Clear all selected
      clearAllSelected: function () {
        var self = this;
        $.each(this.selectedItems, function(index, selected) {
          // Un-select selected item
          self.select(selected);
        });
      },

      // Initialize sortlist
      sortInit: function(control, onEvent, attr){
        if(!attr || $.trim(attr) === '') {
          return;
        }
        $('['+ attr +']').each(function() {
          var elment = $(this),
            options = $.fn.parseOptions(elment, attr);

          elment.on(onEvent, function(e) {
            $(options.list).data(control).setSortColumn(options);
            e.preventDefault();
          });
        });
      },

      // Sort data set
      setSortColumn: function(options) {
        var sort,
        field = options.orderBy || this.list.sort.field,
        reverse = options.order;

        if (!this.list.data && !field) {
          return;
        }

        reverse = reverse ?
          (reverse === 'desc') :
          (this.list.sort && this.list.sort[field] && this.list.sort[field].reverse) ? false : true;

        //reload data
        if (options.reloadApi || options.reloadApiNoSort) {
          this.loadData();
        }

        //reload data but no sort change
        if (options.reloadApiNoSort) {
          field = this.list.sort.field;
          reverse = this.list.sort[field].reverse;
        }

        sort = this.sortFunction(field, reverse);
        this.list.data.sort(sort);
        this.render(this.list.data);

        this.list.sort = {field: field};
        this.list.sort[field] = {reverse: reverse};

        this.element.trigger('sorted', [this.element, this.list.sort]);
      },

      //Overridable function to conduct sorting
      sortFunction: function(field, reverse, primer) {
        var key;
        if (!primer) {
          primer = function(a) {
            a = (a === undefined || a === null ? '' : a);
            if (typeof a === 'string') {
              a = a.toUpperCase();

              if (!isNaN(parseFloat(a))) {
                a = parseFloat(a);
              }
            }
            return a;
          };
        }
        key = primer ? function(x) { return primer(x[field]); } : function(x) { return x[field]; };
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
           return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        };
      },

      // Un-select selected item
      unselect: function (li) {
        if (typeof li === 'number') {
          li = $(this.element.children()[0]).children().eq(li);
        }
        if (li.is('.is-selected')) {
          this.select(li);
        }
      },

      // Handle Selecting the List Element
      select: function (li) {
        var self = this,
          isChecked = false;

        self.selectedItems = [];
        if (typeof li === 'number') {
          li = $(this.element.children()[0]).children().eq(li);
        }

        isChecked = li.hasClass('is-selected');

        //focus
        if (!li.is('[tabindex="0"]')) {
          li.siblings().removeAttr('tabindex');
          li.attr('tabindex', 0);
        }

        if (this.settings.selectable === false || this.settings.selectable === 'false') {
          return;
        }

        //Select
        if (this.settings.selectable !== 'multiple') {
          li.parent().children().removeAttr('aria-selected');
          li.parent().find('.is-selected').removeClass('is-selected');
          self.selectedItems[0] = $(this);
        }

        if (isChecked) {
          self.selectedItems = [];
          li.removeClass('is-selected');
        } else {
          if (this.settings.selectable) {
            li.addClass('is-selected');
            self.lastSelectedRow = li.index();// Rember index to use shift key
          }
        }

        li.parent().find('.is-selected').each(function (i) {
          self.selectedItems[i] = $(this);
        });

        li.attr('aria-selected', !isChecked);
        this.element.triggerHandler('selected', {selectedItems: this.selectedItems, elem: li});

        var toolbar, toolbarControl,
          parent = this.element.closest('.card, .widget');

        if (!parent.length) {
          parent = this.element.parent();
        }
        toolbar = parent.find('.listview-toolbar, .contextual-toolbar');

        toolbarControl = toolbar.data('toolbar');

        if (self.selectedItems.length > 0) {
          if (toolbarControl) {
            toolbarControl.toggleMoreMenu();
          }
          // Order of operations: set up event, change display prop, animate, toggle menu.
          // Menu toggle takes place after the animation starts
          toolbar.one('animateopencomplete', function() {
            self.element.addClass('is-toolbar-open');
            toolbar.trigger('recalculate-buttons').removeClass('is-hidden');
          });
          if (toolbar[0]) {
            toolbar[0].style.display = 'block';
          }
          // toolbar.animateOpen({distance: 52});
          toolbar.animateOpen({distance: 40});

          var title = toolbar.find('.title, .selection-count');
          if (!title || !title.length) {
            title = $('<div class="title selection-count"></div>');
            toolbar.prepend(title);
          }
          title.text(self.selectedItems.length + ' ' + Locale.translate('Selected'));

        } else {
          toolbar.addClass('is-hidden').one('animateclosedcomplete', function(e) {
            e.stopPropagation();
            this.style.display = 'none';
          }).animateClosed();

        }
      },

      updated: function() {
        this.refresh();
        return this;
      },

      teardown: function() {
        $('body').off('resize.listview');
        this.element.off('focus.listview click.listview touchend.listview keydown.listview change.selectable-listview afterpaging.listview').empty();
        return this;
      },

      destroy: function() {
        this.teardown();
        this.element.removeData(pluginName);
      }
    };

    // Initializing the Control Once or Call Methods.
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new ListView(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
