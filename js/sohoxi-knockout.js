/**
 * SoHo XI Knockout Binding Handlers
 * @private
 */
$(function () {

  ko.bindingHandlers.datepicker = {
    init: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      //Setup events
      ko.utils.registerEventHandler(element, 'change', function() {
        var value = valueAccessor().value;
        value($(this).val());
      });

      //init the control
      if (!elem.data('datepicker')) {
        elem.datepicker();
      }

      //set the value
      if (opts.value) {
        elem.data('datepicker').setValue(ko.utils.unwrapObservable(opts.value));
      }
    },
    update: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      elem.data('datepicker').setValue(ko.utils.unwrapObservable(opts.value));
    }
  };

  ko.bindingHandlers.dropdown = {
    init: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      //set the data
      ko.bindingHandlers.dropdown.setData(elem, opts);

      //init the control
      if (!elem.data('dropdown')) {
        elem.dropdown();
      }

      //set the value
      if (opts.value) {
        $(element).val(valueAccessor().value()).triggerHandler('updated');
      }

      //Setup events
      ko.utils.registerEventHandler(element, 'change', function() {
        var value = valueAccessor().value;
        value($(this).val());
      });
    },

    update: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      if (opts.data) {
        ko.bindingHandlers.dropdown.setData(elem, opts);
      }

      if (opts.visible && !opts.visible()) {
        $(element).parent().find('.dropdown-wrapper').hide();
      }

      if (opts.visible && opts.visible()) {
        $(element).parent().find('.dropdown-wrapper').show();
      }

      $(element).enable();

      if (opts.readonly && opts.readonly()) {
        $(element).readonly();
      }

      if (opts.enable && !opts.enable()) {
        $(element).disable();
      }

      $(element).val(ko.utils.unwrapObservable(opts.value)).triggerHandler('updated');
    },

    setData: function(elem, opts) {
      if (opts.data) {
        var data = ko.utils.unwrapObservable(opts.data);

        if (data.length === elem[0].options.length && elem[0].options[0].id === data[0].id) {
          return;
        }

        elem.empty();
        for (var i=0; i < data.length; i++) {
          var opt = $('<option></option').attr('value', (opts.optionsValue ? data[i][opts.optionsValue] : data[i].key)).html((opts.optionsText ? data[i][opts.optionsText] : data[i].name));
          elem.append(opt);
        }
        elem.triggerHandler('updated');
      }
    }
  };

  ko.bindingHandlers.editor = {
    init: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      //Setup events
      ko.utils.registerEventHandler(element, 'blur', function() {
        var value = valueAccessor().value,
          valueToSet = $(this).html();

        if (valueToSet === '<br>') {
          valueToSet = '';
          $(this).html('');
        }

        value(valueToSet);
      });

      //init the control
      if (!elem.data('editor')) {
        elem.editor();
      }

      //set the value
      if (opts.value) {
        elem.html(ko.utils.unwrapObservable(opts.value));
      }
    },
    update: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      elem.html(ko.utils.unwrapObservable(opts.value));

      if (opts.visible && !opts.visible()) {
        $(element).closest('.field').hide();
      }

      if (opts.visible && opts.visible()) {
        $(element).closest('.field').show();
      }

      $(element).enable();

      if (opts.readonly && opts.readonly()) {
        $(element).readonly();
      }

      if (opts.enable && !opts.enable()) {
        $(element).disable();
      }
    }
  };

  ko.bindingHandlers.fileupload = {
    init: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      //Setup events
      ko.utils.registerEventHandler(element, 'change', function() {
        var value = valueAccessor().value;
        value($(this).val());
      });

      //init the control
      if (!elem.data('fileupload')) {
        elem.fileupload();
      }

      //set the value
      if (opts.value) {
        elem.parent().find('input[type="text"]').val(ko.utils.unwrapObservable(opts.value));
      }
    },
    update: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      elem.parent().find('input[type="text"]').val(ko.utils.unwrapObservable(opts.value));

      if (opts.visible && !opts.visible()) {
        $(element).closest('.field').hide();
      }

      if (opts.visible && opts.visible()) {
        $(element).closest('.field').show();
      }

      $(element).enable();

      if (opts.readonly && opts.readonly()) {
        $(element).readonly();
      }

      if (opts.enable && !opts.enable()) {
        $(element).disable();
      }
    }
  };

  ko.bindingHandlers.lookup = {
    init: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      //Setup events
      ko.utils.registerEventHandler(element, 'change', function() {
        var value = valueAccessor().value;
        value($(this).val());
      });

      //init the control
      if (!elem.data('lookup')) {
        elem.lookup();
      }

      //set the value
      if (opts.value) {
        elem.val(ko.utils.unwrapObservable(opts.value));
      }
    },
    update: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      if (opts.visible && !opts.visible()) {
        $(element).closest('.field').hide();
      }

      if (opts.visible && opts.visible()) {
        $(element).closest('.field').show();
      }

      $(element).enable();

      if (opts.readonly && opts.readonly()) {
        $(element).readonly();
      }

      if (opts.enable && !opts.enable()) {
        $(element).disable();
      }

      elem.val(ko.utils.unwrapObservable(opts.value));
    }
  };

  ko.bindingHandlers.multiselect = {
    init: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      //set the data
      ko.bindingHandlers.multiselect.setData(elem, opts);

      //init the control
      if (!elem.data('multiselect')) {
        elem.multiselect();
      }

      //set the value
      if (opts.value) {
        $(element).val(valueAccessor().value()).triggerHandler('updated');
      }

      //Setup events
      ko.utils.registerEventHandler(element, 'change', function() {
        var value = valueAccessor().value;
        value($(this).val());
      });
    },

    update: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      if (opts.data) {
        ko.bindingHandlers.multiselect.setData(elem, opts);
      }

      if (opts.visible && !opts.visible()) {
        $(element).closest('.field').hide();
      }

      if (opts.visible && opts.visible()) {
        $(element).closest('.field').show();
      }

      $(element).enable();

      if (opts.readonly && opts.readonly()) {
        $(element).readonly();
      }

      if (opts.enable && !opts.enable()) {
        $(element).disable();
      }

      $(element).val(ko.utils.unwrapObservable(opts.value)).triggerHandler('updated');
    },

    setData: function(elem, opts) {
      if (opts.data) {
        var data = ko.utils.unwrapObservable(opts.data);

        if (data.length === elem[0].options.length && elem[0].options[0].id === data[0].id) {
          return;
        }

        elem.empty();

        for (var i=0; i < data.length; i++) {
          var opt = $('<option></option').attr('value', (opts.optionsValue ? data[i][opts.optionsValue] : data[i].key)).html((opts.optionsText ? data[i][opts.optionsText] : data[i].name));
          elem.append(opt);
        }
        elem.triggerHandler('updated');
      }
    }
  };

  ko.bindingHandlers.readonly = {
    update: function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());

      if (!value && element.readOnly) {
        element.readOnly = false;
      }
      else if (value && !element.readOnly) {
        element.readOnly = true;
      }
    }
  };

  ko.bindingHandlers.slider = {
    init: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      //set the data
      var dataTicks = ko.utils.unwrapObservable(opts.ticks);

      //init the control
      if (!elem.data('slider')) {
        elem.slider({ticks: dataTicks});
      }

      //set the value
      if (opts.value) {
        var api = elem.data('slider');
        api.value(valueAccessor().value());
      }

      //Setup events
      ko.utils.registerEventHandler(element, 'change', function() {
        var value = valueAccessor().value;
        value($(this).val());
      });
    },

    update: function(element, valueAccessor) {
      var opts = ko.utils.unwrapObservable(valueAccessor()),
        elem = $(element);

      if (opts.visible && !opts.visible()) {
        $(element).closest('.field').hide();
      }

      if (opts.visible && opts.visible()) {
        $(element).closest('.field').show();
      }

      $(element).enable();

      if (opts.readonly && opts.readonly()) {
        $(element).readonly();
      }

      if (opts.enable && !opts.enable()) {
        $(element).disable();
      }

      var api = elem.data('slider');
       api.value(ko.utils.unwrapObservable(opts.value));
    }
  };

});
