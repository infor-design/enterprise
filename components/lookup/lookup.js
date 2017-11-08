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

  $.fn.lookup = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'lookup',
        defaults = {
          click: null,
          field: 'id',
          title: null,
          buttons: [],
          options: null,
          beforeShow: null,
          modalContent: null,
          editable: true,
          typeahead: false, // Future TODO
          autoApply: true,
          validator: null
        },
        settings = $.extend({}, defaults, options);

    /**
    * Input element that opens a dialog with a list for selection.
    *
    * @class Lookup
    * @param {Function} click  &nbsp;-&nbsp; Provide a special function to run when the dialog opens to customize the interaction entirely.
    * @param {String} field  &nbsp;-&nbsp; Field name to return from the dataset or can be a function which returns a string on logic
    * @param {String} title  &nbsp;-&nbsp;  Dialog title to show, or befault shows  field label + "Lookup"
    * @param {Array} buttons  &nbsp;-&nbsp; Pass dialog buttons or Cancel / Apply
    * @param {Object} options  &nbsp;-&nbsp; Options to pass to the datagrid
    * @param {Function} beforeShow  &nbsp;-&nbsp; Call back that executes async before the lookup is opened.
    * @param {String} modalContent  &nbsp;-&nbsp; Custom modal markup can be sent in here
    * @param {Boolean} editable  &nbsp;-&nbsp; Can the user type text in the field
    * @param {String} autoApply  &nbsp;-&nbsp; If set to false the dialog wont apply the value on clicking a value.
    * @param {Function} validator  &nbsp;-&nbsp; A function that fires to let you validate form items on open and select
    *
    */
    function Lookup(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    var lookupGridId = 'lookup-datagrid';

    // Plugin Methods
    Lookup.prototype = {

      init: function() {
        this.settings = settings;
        this.inlineLabel = this.element.closest('label');
        this.inlineLabelText = this.inlineLabel.find('.label-text');
        this.isInlineLabel = !!this.inlineLabelText.length;
        this.build();
        this.handleEvents();
        this.grid = null;
        this.selectedRows = null;
      },

      // Build the Ui lookup
      build: function() {
         var lookup = this.element;

        var cssClass = this.element.is('.input-xs') ? 'lookup-wrapper xs' :
            this.element.is('.input-sm') ? 'lookup-wrapper sm' :
            this.element.is('.input-lg') ? 'lookup-wrapper lg' : 'lookup-wrapper';

        if (this.element.is('.has-actions')) {
         cssClass += ' has-actions-wrapper';
        }

        //Add Button
        this.icon = $('<span class="trigger" tabindex="-1"></span>').append($.createIcon('search-list'));
        if (this.isInlineLabel) {
          this.inlineLabel.addClass(cssClass);
        }
        else {
          this.container = $('<span class="'+ cssClass +'"></span>');

          if (this.element.is('.field-options')) {
            var field = this.element.closest('.field'),
              fieldOptionsTrigger = field.find('.btn-actions');

            lookup
              .add(fieldOptionsTrigger)
              .add(fieldOptionsTrigger.next('.popupmenu'))
              .wrapAll(this.container);
          } else {
            lookup.wrap(this.container);
          }
        }

        // this.container = $('<span class="lookup-wrapper"></span>');
        // lookup.wrap(this.container);
        lookup.after(this.icon);

        //Add Masking to show the #
        if (lookup.attr('data-mask')) {
          lookup.mask();
        }

        if (this.element.is(':disabled')) {
          this.disable();
        }

        if (!this.settings.editable) {
          this.element.attr('readonly', 'true').addClass('is-not-editable');
        }

        // Fix field options in case lookup is initialized after
        var wrapper = this.element.parent('.lookup-wrapper');
        if (wrapper.next().is('.btn-actions')) {
          if (this.element.data('fieldoptions')) {
            this.element.data('fieldoptions').destroy();
          }
          this.element.fieldoptions();
        }

        this.addAria();
      },

      // Add/Update Aria
      addAria: function () {
        var self = this;

        setTimeout(function () {
          self.label = self.isInlineLabel ? self.inlineLabelText : $('label[for="'+ self.element.attr('id') + '"]');

          if (self.label) {
            self.label.append('<span class="audible">' + Locale.translate('UseEnter') + '</span>');
          }
        }, 500);
      },

      //Handle events on the field
      handleEvents: function () {
        var self = this;

        this.icon.on('click.lookup', function (e) {
          self.openDialog(e);
        });

        //Down Arrow opens the dialog in this field
        this.element.on('keyup.lookup', function (e) {
          //If autocomplete open dont open list
          if ($('#autocomplete-list').length > 0) {
            return;
          }

          if (e.which === 40) {
            self.openDialog(e);
          }
        });

      },

      //Create and Open the Dialog
      openDialog: function (e) {
        var self = this,
          canOpen = self.element.triggerHandler('beforeopen');

        if (canOpen === false) {
          return;
        }

        if (self.isDisabled() || (self.isReadonly() && !self.element.hasClass('is-not-editable'))) {
          return;
        }

        if (self.settings.click) {
          self.settings.click(e, this);
          return;
        }

        if (this.settings.beforeShow) {
         var response = function (grid) {
            if (grid) {
              self.createGrid(grid);
            }
            self.createModal();
            self.element.triggerHandler('complete'); // for Busy Indicator
            self.element.trigger('open', [self.modal, self.grid]);

            if (self.settings.validator) {
              self.settings.validator(self.element, self.modal, self.grid);
            }
            return;
          };

          this.element.triggerHandler('start'); // for Busy Indicator
          this.settings.beforeShow(this, response);
          return;
        }

        if (!this.settings.options) {
          return;
        }

        self.createModal();
        self.element.trigger('open', [self.modal, self.grid]);

        self.modal.element.find('.btn-actions').removeClass('is-selected');

        // Fix: IE-11 more button was not showing
        var thisMoreBtn = self.modal.element.find('.toolbar .more > .btn-actions');
        if (thisMoreBtn.length) {
          setTimeout(function() {
            window.Soho.utils.fixSVGIcons(thisMoreBtn);
          }, 600);
        }

        self.element.trigger('afteropen', [self.modal, self.grid]);

        if (self.settings.validator) {
          self.settings.validator(self.element, self.modal, self.grid);
        }

      },

      //Overidable function to create the modal dialog
      createModal: function () {
        var self = this,
          content = '<div id="'+lookupGridId+'"></div>',
          thisLabel = $('label[for="'+self.element.attr('id')+'"]'),
          labelText = self.isInlineLabel ? self.inlineLabelText : (thisLabel.length ? thisLabel.clone().find('span').remove().end().text() : '');

        if (this.settings.title) {
          labelText = this.settings.title;
        }

        var settingContent = this.settings.modalContent;
        if (settingContent && settingContent instanceof jQuery) {
          content = settingContent;
          settingContent.show();
        }

        if (settingContent && !(settingContent instanceof jQuery)) {
          content = settingContent;
        }

        var buttons = this.settings.buttons;
        if (this.settings.options && this.settings.options.selectable === 'multiple' && buttons.length === 0 || (!self.settings.autoApply && buttons.length === 0)) {
          buttons = [{
            text: Locale.translate('Cancel'),
            click: function(e, modal) {
              self.element.focus();
              modal.close();
            }
          }, {
            text: Locale.translate('Apply'),
            click: function(e, modal) {
              var selectedRows = self.grid.selectedRows();
              modal.close();
              self.insertRows(selectedRows);
            },
            isDefault: true
          }];
        }

        if (this.settings.options && this.settings.options.selectable === 'single' && buttons.length === 0 && self.settings.autoApply) {
          buttons = [{
            text: Locale.translate('Cancel'),
            click: function(e, modal) {
              self.element.focus();
              modal.close();
            }
          }];
        }

        var hasKeywordSearch = this.settings.options && this.settings.options.toolbar && this.settings.options.toolbar.keywordFilter;

        $('body').modal({
          title: labelText,
          content: content,
          buttons: buttons,
          cssClass: 'lookup-modal' + (!hasKeywordSearch ? ' lookup-no-search' : '')
        }).off('open.lookup').on('open.lookup', function () {
          self.createGrid();
        }).off('close.lookup').on('close.lookup', function () {
          self.element.focus();
          self.element.triggerHandler('close', [self.modal, self.grid]);
        });

        self.modal = $('body').data('modal');
        if (!this.settings.title) {
          self.modal.element.find('.modal-title').append(' <span class="datagrid-result-count"></span>');
        }

        self.modal.element.off('beforeclose.lookup').on('beforeclose.lookup', function () {
          self.closeTearDown();
        });

        // Wait until search field available
        setTimeout(function () {
          $('.modal.is-visible .searchfield').on('keypress.lookup', function (e) {
            if (e.keyCode === 13) {
              return false; // Prevent for closing modal
            }
          });
        }, 300);
      },

      closeTearDown: function () {
        var search = $('.modal.is-visible .searchfield').off('keypress.lookup');
        if (search.data() && search.data('searchfield')) {
          search.data('searchfield').destroy();
        }

        if (search.data() && search.data('toolbarsearchfield')) {
          search.data('toolbarsearchfield').destroy();
          search.removeData();
        }
        search = null;

        if (!this.grid) {
          this.grid.destroy();
        }
      },

      //Overridable Function in which we create the grid on the current ui dialog.
      createGrid: function (grid) {
        var self = this, lookupGrid;

        if (grid) {
          lookupGrid = grid;
          lookupGridId = grid.attr('id');
          self.settings.options = grid.data('datagrid').settings;
        } else {
          lookupGrid = self.modal.element.find('#' + lookupGridId);
        }

        if (self.settings.options) {

          if (self.settings.options.selectable === 'single' && self.settings.autoApply) {
            self.settings.options.cellNavigation = false;
            lookupGrid.find('tr').addClass('is-clickable');
          }

          self.settings.options.isList = true;

          // Create grid (unless already exists from passed in grid)
          if (!lookupGrid.data('datagrid')) {
            lookupGrid.datagrid(self.settings.options);
          }
        }

        self.grid = lookupGrid.data('datagrid');
        if (!this.settings.title && self.modal) {
          self.modal.element.find('.title').remove();
        }

        var hasKeywordSearch = this.settings.options && this.settings.options.toolbar && this.settings.options.toolbar.keywordFilter;
        if (!hasKeywordSearch && self.modal) {
          self.modal.element.find('.toolbar').appendTo(self.modal.element.find('.modal-header'));
        }

        // Reset keyword search from previous loads
        if (hasKeywordSearch && self.grid) {
          self.grid.keywordSearch('');
        }

        //Mark selected rows
        lookupGrid.off('selected.lookup');
        var val = self.element.val();
        if (val) {
          self.selectGridRows(val);
        }

        if (this.settings.options) {
          lookupGrid.on('selected.lookup', function (e, selectedRows) {

            // Only proceed if a row is selected
            if (!selectedRows || selectedRows.length === 0) {
              return;
            }

            if (self.settings.validator) {
              self.settings.validator(self.element, self.modal, self.grid);
            }

            if (self.settings.options.selectable === 'single' && self.settings.autoApply) {
              setTimeout(function () {
                self.modal.close();
                self.insertRows();
              }, 100);
            }
          });
        }

      },

      //Given a field value, select the row
      selectGridRows: function (val) {
        var self = this,
          selectedId = val;

        if (!val) {
          return;
        }

        //Multi Select
        if (selectedId.indexOf(',') > 1) {
          var selectedIds = selectedId.split(',');

          for (var i = 0; i < selectedIds.length; i++) {
            self.selectRowByValue(self.settings.field, selectedIds[i]);
          }
          return;
        }

        self.selectRowByValue(self.settings.field, selectedId);
      },

      //Find the row and select it based on select value / function / field value
      selectRowByValue: function(field, value) {
        if (!this.settings.options) {
          return;
        }

        var self = this,
          data = this.settings.options.dataset,
          selectedRows = [];

        for (var i = 0; i < data.length; i++) {
          if (typeof self.settings.match === 'function') {
            if (self.settings.match(value, data[i], self.element, self.grid)) {
              selectedRows.push(i);
            }

            continue;
          }

          if (data[i][field] == value) {  // jshint ignore:line
            selectedRows.push(i);
          }
        }

        if (this.grid) {
          this.grid.selectedRows(selectedRows);
        }
      },

      //Get the selected rows and return them to the UI
      insertRows: function () {
        var self = this,
          value = '';

        self.selectedRows = self.grid.selectedRows();

        for (var i = 0; i < self.selectedRows.length; i++) {
          var currValue = '';

          if (typeof self.settings.field === 'function') {
            currValue = self.settings.field(self.selectedRows[i].data, self.element, self.grid);
          } else {
            currValue = self.selectedRows[i].data[self.settings.field];
          }

          value += (i !== 0 ? ',' : '') + currValue;
        }

        self.element.val(value).trigger('change', [self.selectedRows]);
        self.element.focus();
      },

      /**
      * Enable the input.
      */
      enable: function() {
        this.element.prop('disabled', false).prop('readonly', false);
        this.element.parent().removeClass('is-disabled');
      },

      /**
      * Disable the input.
      */
      disable: function() {
        this.element.prop('disabled', true);
        this.element.parent().addClass('is-disabled');
      },

      /**
      * Make the input readonly.
      */
      readonly: function() {
        this.element.prop('readonly', true);
      },

      /**
      * Returns whether or not the Input is disabled
      */
      isDisabled: function() {
        return this.element.prop('disabled');
      },

      /**
      * Returns whether or not the Input is readonly
      */
      isReadonly: function() {
        return this.element.prop('readonly');
      },

      /**
      * Teardown events and objects.
      */
      destroy: function() {
        $.removeData(this.element[0], pluginName);
        this.element.off('click.dropdown keypress.dropdown');

        this.icon.remove();
        this.element.unwrap();

        if (this.label && this.label != null) {
          this.label.find('.audible').remove();
        }
      }
    };

    // Initialize the plugin once
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Lookup(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
