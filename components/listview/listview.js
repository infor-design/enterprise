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

    // Settings and Options
    var pluginName = 'listview',
      defaults = {
        dataset: [],
        template: null,
        description: null,
        paging: false,
        pagesize: 10,
        searchable: false,
        selectable: 'single',
        selectOnFocus: true,
        showCheckboxes: true,
        hoverable: true,
        emptyMessage: null,
        source: null,
        disableItemDeactivation: false
      },
      settings = $.extend({}, defaults, options);

    /**
    * The About Dialog Component is displays information regarding the application.
    *
    * @class ListView
    * @param {Array} dataset  &nbsp;-&nbsp; Array of data to feed the template
    * @param {String} content  &nbsp;-&nbsp; Html Template String
    * @param {String} description  &nbsp;-&nbsp; Audible Label (or use parent title)
    * @param {Boolean} paging  &nbsp;-&nbsp; If true, activates paging
    * @param {Number} pagesize  &nbsp;-&nbsp; If paging is activated, sets the number of listview items available per page
    * @param {Boolean} searchable  &nbsp;-&nbsp; If true, associates itself with a Searchfield/Autocomplete and allows itself to be filtered
    * @param {String|Boolean} selectable  &nbsp;-&nbsp;  selection mode, can be false, 'single' or 'multiple' or 'mixed'
    * @param {Boolean} selectOnFocus  &nbsp;-&nbsp;  If true the first item in the list will be selected as it is focused.
    * @param {Boolean} showCheckboxes  &nbsp;-&nbsp;  If false will not show checkboxes used with multiple selection mode only
    * @param {Boolean} hoverable  &nbsp;-&nbsp;  If true the list element will show a hover action to indicate its actionable.
    * @param {Function|String} source  &nbsp;-&nbsp; If source is a string then it serves as the url for an ajax call that returns the dataset. If its a function it is a call back for getting the data asyncronously.
    * @param {Boolean} disableItemDeactivation  &nbsp;-&nbsp; If true when an item is activated the user should not be able to deactivate it by clicking on the activated item. They can only select another row.
    *
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

      /**
      * Initialize this component.
      * @private
      */
      init: function() {
        this.setup();
        this.refresh();
        this.selectedItems = [];
        this.lastSelectedItem = 0; // Rember index to use shift key
        this.isSelectedAll = false; // Rember if all selected or not
        this.sortInit('listview', 'click.listview', 'data-sortlist');
        this.handleEvents();
        this.handleResize();
      },

      /**
      * Do initial dom and settings setup.
      * @private
      */
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

        this.element.attr({'tabindex': '-1', 'x-ms-format-detection': 'none'});

        // Configure Paging
        if (this.element.is('.paginated') || this.settings.paging === true) {
          this.element.pager({
            componentAPI: this,
            pagesize: this.settings.pagesize,
            source: this.settings.source
          });

          this.pager = this.element.data('pager');
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

        if (this.settings.emptyMessage) {
          //Object { title: "No Data Available", info: "", icon: "icon-empty-no-data" }
          self.emptyMessageContainer = $('<div>').emptymessage(this.settings.emptyMessage);
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

      /**
      * Calculate the totals for totalling examples. This is done by template {{totals}}.
      *
      * @private
      */
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

      /**
      * Render the template against the dataset.
      *
      * @param {Array} dataset  &nbsp;-&nbsp; The dataset to use
      * @param {Object} pagerInfo  &nbsp;-&nbsp; Pager instructions
      */
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

          if (dataset.length > 0) {
            this.element.html(renderedTmpl);
          } else {
            if (self.emptyMessageContainer) {
              this.element.empty().append(this.emptyMessageContainer);
            } else if (dataset.length === 0) {
              this.element.html(renderedTmpl || '<ul></ul>');
            }
          }
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
          isMultiselect = (this.settings.selectable === 'multiple' || this.settings.selectable === 'mixed');

        //Set Initial Tab Index
        first.attr('tabindex', 0);

        //Let the link be focus'd
        if (!this.settings.selectable && first.find('a').length === 1) {
          first.removeAttr('tabindex');
        }

        items.each(function (i) {
          var item = $(this);

          item.attr('role', 'option');

          if (isMultiselect) {
            // Add Selection Checkboxes
            self.element.addClass('is-muliselect');

            // Create a Toolbar for the "Selected Items" area
            var selectedToolbar = self.element.prevAll('.toolbar');
            if (selectedToolbar.length && selectedToolbar.data('toolbar')) {
              selectedToolbar.data('toolbar').toggleMoreMenu();
            }

            if (self.settings.showCheckboxes) {
              //For mixed selection mode primarily append a checkbox object
              item.prepend('<label class="listview-selection-checkbox l-vertical-center inline inline-checkbox"><input tabindex="-1" type="checkbox" class="checkbox"><span class="label-text">&nbsp;</span></label>');
              //TODO: item.find('.checkbox').attr('tabindex', '-1');
            }
          }

          // Add Aria
          item.attr({'aria-posinset': i+1, 'aria-setsize': items.length});

          // Add Aria disabled
          if (item.hasClass('is-disabled')) {
            item.attr('aria-disabled','true');
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

      /**
      * Add and update the pager (if used)
      * @private
      */
      renderPager: function(updatedPagerInfo) {
        if (!this.pager) {
          return;
        }

        this.pager.updatePagingInfo(updatedPagerInfo);
        this.pager.setActivePage(1, true);
      },

      /**
      * Get the Data Source. Can be an array, Object or Url and render the list.
      */
      refresh: function () {
        this.loadData();

        if (this.list) {
          this.render(this.list.data);
        }
      },

      /**
      * Load Data from an external API
      * @param {Object} ds  &nbsp;-&nbsp; The dataset to use or will use settings.dataset.
      * @param {Object} pagerInfo  &nbsp;-&nbsp; The pager settings to use (see pager api)
      */
      loadData: function (ds, pagerInfo) {
        var ajaxDs = false, self = this;

        ds = ds || this.settings.dataset;
        pagerInfo = pagerInfo || {};

        if (!ds) {
          return;
        }

        function done(response, pagingInfo) {
          ds = response;
          self.render(ds, pagingInfo);
        }

        var s = this.settings.source;

        if (typeof ds === 'string' && (ds.indexOf('http') === 0 || ds.indexOf('/') === 0)) {
          s = ds;
          ajaxDs = true;
        }

        // If paging is not active, and a source is present, attempt to retrieve information from the datasource
        // TODO: Potentially abstract this datasource concept out for use elsewhere
        if ((s) || ajaxDs) {
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

      /**
      * Toggle all items from selected to deselected, useful for multi/mixed selection
      */
      toggleAll: function() {
        this[this.isSelectedAll ?
          'deselectItemsBetweenIndexes' :
          'selectItemsBetweenIndexes']([0, $('li, tbody tr', this.element).length-1]);
        this.isSelectedAll = !this.isSelectedAll;
      },

      /**
      * Select Items between a set of indexes. Used for shift selection.
      * @private
      */
      selectItemsBetweenIndexes: function(indexes) {
        this.clearSelection();
        indexes.sort(function(a, b) { return a-b; });
        for (var i = indexes[0]; i <= indexes[1]; i++) {
          var item = $('li, tbody tr', this.element).eq(i);

          if (!item.is('.is-disabled, .is-selected')) {
            this.select(item);
          }
        }
      },

      /**
      * De-Select Items between a set of indexes. Used for shift selection.
      * @private
      */
      deselectItemsBetweenIndexes: function(indexes) {
        indexes.sort(function(a, b) { return a-b; });
        for (var i = indexes[0]; i <= indexes[1]; i++) {
          var item = $('li, tbody tr', this.element).eq(i);
          if(!item.is('.is-disabled') && item.is('.is-selected')) {
            this.select(item);
          }
        }
      },

      /**
      * Clear all currently selected list items.
      * @private
      */
      clearSelection: function() {
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
        } else if (document.selection) {
          document.selection.empty();
        }
      },

      /**
      * Handle page/form resize
      * @private
      */
      handleResize: function () {
        var items = $('li .listview-heading, tr .listview-heading', this.element),
          item1 = items.eq(1),
          item1W = item1.width();

        if (item1.length && item1W) {
          items[0].style.width = item1W + 'px';
        }

        if (this.element.data('pager')) {
          this.element.data('pager').renderBar();
        }
      },

      /**
      * For instances of Listview that are paired with a Searchfield
      * NOTE: Search functionality is called from "js/listfilter.js"
      *
      * @private
      */
      handleSearch: function(e, searchfield) {
        var list = this.element.find('li, tbody > tr'),
            term = searchfield.val(),
            results;

        this.resetSearch();

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

      /**
      * Reset the current search parameters and highlight.
      */
      resetSearch: function() {
        var list = this.element.find('li, tbody > tr');

        list.removeClass('hidden').each(function() {
          $(this).unhighlight();
        });
      },

      /**
      * Focus the provided list item with the keyboard
      * @param {jQuery} item  &nbsp;-&nbsp; The list item (as jQuery) to focus
      */
      focus: function (item) {
        if (item.is(':hidden') || item.is('.is-disabled')) {
          return;
        }

        item.siblings().removeAttr('tabindex');
        item.attr('tabindex', 0).focus();

        if (!this.settings.selectable && item.find('a').length === 1) {
          item.find('a').focus();
          item.removeAttr('tabindex');
        }

        if (this.settings.selectOnFocus &&
          this.settings.selectable !== 'multiple' &&
          this.settings.selectable !== 'mixed') {
          this.select(item);
        }
      },

      /**
      * Remove the given list item.
      * @param {jQuery|Number} li  &nbsp;-&nbsp; Either the actually jQuery list element or a zero based index
      */
      remove: function (li) {
        if (typeof li === 'number') {
          li = $(this.element.children()[0]).children().eq(li);
        }
        // Un-select selected item
        // and donot trigger selected event, sinnce we removeing
        if (li.is('.is-selected')) {
          this.select(li, true);
        }
        li.remove();
      },

      /**
      * Remove all list items.
      */
      clear: function () {
        var root = $(this.element.children()[0]);
        root.empty();
      },

      /**
      * Remove all selected items entirely from the list..
      */
      removeAllSelected: function () {
        var self = this;
        $.each(this.selectedItems, function(index, selected) {
          self.remove(selected);
        });
      },

      /**
      * Deselect all selected items.
      */
      clearAllSelected: function () {
        var self = this;
        $.each(this.selectedItems, function(index, selected) {
          // Un-select selected item
          self.select(selected);
        });
      },

      /**
      * Initialize the sorted list
      * @private
      */
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

      /**
      * Sort the list with the given options.
      * @private
      */
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

      /**
      * Overridable function to conduct sorting
      * @param {String} field  &nbsp;-&nbsp; The field in the dataset to sort on.
      * @param {String} reverse  &nbsp;-&nbsp; If true sort descending.
      * @param {Function} primer  &nbsp;-&nbsp; A sorting primer function.
      *
      */
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

      /**
      * Deselect the given list item.
      * @param {jQuery|Number} li  &nbsp;-&nbsp; Either the actually jQuery list element or a zero based index
      */
      deselect: function (li) {
        if (typeof li === 'number') {
          li = $(this.element.children()[0]).children().eq(li);
        }
        if (li.is('.is-selected')) {
          this.select(li);
        }
      },

      /**
      * Deprivated - use deselect
      * @deprecated
      */
      unselect: function (li) {
        this.deselect(li);
      },

      /**
      * Select the given list item.
      * @param {jQuery|Number} li &nbsp;-&nbsp; Either the actually jQuery list element or a zero based index
      * @param {Boolean} noTrigger &nbsp;-&nbsp; Do not trigger the selected event.
      */
      select: function (li, noTrigger) {
        var self = this,
          isChecked = false,
          isMixed = self.settings.selectable === 'mixed';

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
        if (this.settings.selectable !== 'multiple' && this.settings.selectable !== 'mixed') {
          li.parent().children().removeAttr('aria-selected');
          li.parent().find('.is-selected').removeClass('is-selected');
          self.selectedItems[0] = $(this);
        }

        if (isChecked) {
          self.selectedItems = [];
          li.removeClass('is-selected hide-selected-color');
        } else {
          if (this.settings.selectable) {
            li.addClass('is-selected' + (isMixed ? ' hide-selected-color' : ''));
            self.lastSelectedItem = li.index();// Rember index to use shift key
          }
        }

        li.parent().find('.is-selected').each(function (i) {
          self.selectedItems[i] = $(this);
        });

        li.attr('aria-selected', !isChecked);
        li.find('.listview-selection-checkbox input').prop('checked', !isChecked);

        if (!noTrigger) {
          var triggerStr = isChecked ? 'unselected' : 'selected';
          this.element.triggerHandler(triggerStr, {selectedItems: this.selectedItems, elem: li});

          if (triggerStr === 'unselected') {
            this.element.triggerHandler('deselected', {selectedItems: this.selectedItems, elem: li});
          }
        }

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

      /**
      * Toggle acivation state on the list item
      * @param {jQuery} li &nbsp;-&nbsp; The jQuery list element.
      */
      toggleItemActivation: function(li) {
        var isActivated = li.hasClass('is-activated');

        if (isActivated) {
          if (!this.settings.disableItemDeactivation) {
            this.deactivateItem(li);
          }
          return;
        }

        this.activateItem(li);
      },

      /**
      * Set item to activated, unactivate others and fire an event.
      * @param {jQuery|Number} li &nbsp;-&nbsp; The jQuery list element or the index.
      */
      activateItem: function(li) {
        var idx = li.index(),
          active = this.element.find('li.is-activated'),
          elemCanActivate = true;

        this.deactivateItem(active);

        elemCanActivate = this.element.triggerHandler('beforeactivate', [{index: idx, elem: li, data: this.settings.dataset[idx]}]);

        if (elemCanActivate === false) {
          return false;
        }

        if (typeof li === 'number') {
          li = this.element.find('ul').children().eq(li);
        }
        li.addClass('is-activated');

        this.element.triggerHandler('itemactivated', [{index: idx, elem: li, data: this.settings.dataset[idx]}]);
      },

      /**
      * Return an object containing info about the currently activated item.
      * @returns {Object} An object containing the active row's index, dom element and data.
      */
      activatedItem: function() {
        var active = this.element.find('li.is-activated'),
          idx = active.index();

        return {index: idx, elem: active, data: this.settings.dataset[idx]};
      },

      /**
      * Set item to deactivated, uand fire an event.
      * @param {jQuery|Number} li &nbsp;-&nbsp; The jQuery list element. The li element or the index. If null the currently activated one will be deactivated.
      */
      deactivateItem: function(li) {

        if (typeof li === 'number') {
          li = this.element.find('ul').children().eq(li);
        }

        if (li === undefined) {
          li = this.element.find('li.is-activated');
        }

        li.removeClass('is-activated');
        var idx = li.index();

        if (idx < 0) {
          return;
        }

        this.element.triggerHandler('itemdeactivated', [{index: idx, elem: li, data: this.settings.dataset[idx]}]);
      },

      /**
      * Refresh the list with any optioned options that might have been set.
      */
      updated: function() {
        this.refresh();
        return this;
      },

      /**
      * Detatch all bound events.
      */
      teardown: function() {
        $('body').off('resize.listview');
        this.element.off('focus.listview click.listview touchend.listview keydown.listview change.selectable-listview afterpaging.listview').empty();
        return this;
      },

      /**
      * Detatch all events and tear down data object
      */
      destroy: function() {
        this.teardown();
        this.element.removeData(pluginName);
      },

      /**
       *  This component fires the following events.
       *
       * @fires ListBox#events
       * @param {Object} selected  &nbsp;-&nbsp; Fires when a item is selected
       * @param {Object} unselected  &nbsp;-&nbsp; Fires when a item is deselected (deprecated)
       * @param {Object} deselected  &nbsp;-&nbsp; Fires when a item is deselected
       * @param {Object} rendered  &nbsp;-&nbsp; Fires after the listbox is fully rendered
       *
       */
      handleEvents: function () {
        var self = this,
          isSelect = false,
          isFocused = false,
          isMultiple = self.settings.selectable === 'multiple' || self.settings.selectable === 'mixed';

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
              (self.settings.selectable !== 'multiple')&&
              (self.settings.selectable !== 'mixed')) {

            self.select(item);
            isSelect = true;
            isFocused = true;
          }
        });

        // Key Board
        this.element.on('keydown.listview', 'li, tr, a', function (e) {
          var elem = $(this),
            item = elem.is('a') ? elem.closest('li') : $(this),
            list = item.is('a') ? item.closest('ul') : item.parent(),
            key = e.keyCode || e.charCode || 0,
            metaKey = e.metaKey;

          if (item.index() === 0 && e.keyCode === 38) {
            return;
          }

          if ((key === 40 || key === 38) && !metaKey) {// move down or up
            var newItem = e.keyCode === 40 ? item.nextAll(':not(.is-disabled):visible:first') : item.prevAll(':not(.is-disabled):visible:first');

            if (newItem.length && ($(e.target).is(item) || e.shiftKey || elem.is('a'))) {
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
              if (isMultiple && e.shiftKey) {
                self.selectItemsBetweenIndexes([self.lastSelectedItem, item.index()]);
              } else {
                self.select(item);
              }
              e.preventDefault();
            }
          }

          // If multiSelect is enabled, press Control+A to toggle select all items
          if (isMultiple && ((e.ctrlKey || e.metaKey) && key === 65)) {
            self.toggleAll();
            self.focus(item);
            e.preventDefault();
          }

        });

        // Selection View Click/Touch
        if (this.settings.selectable) {

          this.element.addClass('is-selectable');

          var trigger = $('.list-detail-back-button, .list-detail-button').find('.app-header'),
            pattern = $(this.element).closest('.list-detail, .builder');

          trigger.parent().on('click.listview', function (e) {
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
          .off('click.listview', 'li, tr, input[checkbox]')
          .on('click.listview', 'li, tr, input[checkbox]', function (e) {
            var item = $(this),
              isCheckbox = $(e.target).closest('.listview-selection-checkbox').length > 0,
              isMixed = self.settings.selectable === 'mixed',
              target = $(e.target);

            // ignore clicking favorites element
            if (target.hasClass('icon-favorite')) {
              return;
            }

            if (!isFocused && !item.hasClass('is-disabled') && (!isMixed || isCheckbox)) {
              isSelect = true;

              if (isMultiple && e.shiftKey) {
                self.selectItemsBetweenIndexes([self.lastSelectedItem, item.index()]);
                e.preventDefault();
              } else {
                self.select(item);
              }
              item.focus();
            }

            if (!item.hasClass('is-disabled') && isMixed && !isCheckbox) {
              item.focus();
              self.toggleItemActivation(item);
            }

            if (pattern.length > 0 && $(window).outerWidth() < 767 && !item.hasClass('is-disabled')) {
              pattern.toggleClass('show-detail');
              trigger.toggleClass('go-back');
            }

            isFocused = false;

            e.preventDefault();
            e.stopPropagation();

            self.element.trigger('click', [{elem: item, data: self.settings.dataset[item.attr('aria-posinset')-1], index: item.index(), originalEvent: e}]);
            return false;
          });

          this.element
          .off('dblclick.listview', 'li, tr')
          .on('dblclick.listview', 'li, tr', function (e) {
            var item = $(this);

            e.preventDefault();
            e.stopPropagation();
            self.element.trigger('dblclick', [{elem: $(this), data: self.settings.dataset[item.attr('aria-posinset')-1], index: item.index(), originalEvent: e}]);
            return false;
          });

          this.element
          .off('contextmenu.listview', 'li, tr')
          .on('contextmenu.listview', 'li, tr', function (e) {
            var item = $(this);

            e.preventDefault();
            e.stopPropagation();
            self.element.trigger('contextmenu', [{elem: $(this), data: self.settings.dataset[item.attr('aria-posinset')-1], index: item.index(), originalEvent: e}]);
            return false;
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

        if (this.settings.selectable === 'multiple' || this.settings.selectable === 'mixed') {
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
        self.element.prev('.listview-header').on('click', function () {
          var icon = $(this).find('.plus-minus');
          if (icon.hasClass('active')) {
            icon.removeClass('active');
            self.element.animateClosed();
          } else {
            icon.addClass('active');
            self.element.animateOpen();
          }
        });

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
