/**
* Multiselect (Tags) Control
* @name Tabs
* @param {string} propertyName - The Name of the Property
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

  $.fn.multiselect = function(options, args) {

    // Dropdown Settings and Options
    var pluginName = 'multiselect',
        defaults = {
          source: null //Defines the data to use or uses the select
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Multi select functions and events
    Plugin.prototype = {
      init: function() {
        this.addMarkup();
        this.handleEvents();
      },

      //Generate the Markup and hide
      addMarkup: function () {
        //generate container
        this.container = $('<div class="multiselect"></div>');
        this.input = $('<textarea></textarea>').attr('id', this.element.attr('id')+'-textarea').appendTo(this.container);
        this.element.before(this.container).hide();

        //hide and create a new label
        this.orgLabel = $('label[for="' + this.element.attr('id') + '"]');
        this.label = this.orgLabel.clone().attr('for', this.element.attr('id')+'-textarea');
        this.container.before(this.label);
        this.orgLabel.hide();

        //add icon button
        this.trigger = $('<svg focusable="false" class="icon" viewBox="0 0 32 32"><use focusable="false" xlink:href="#icon-dropdown-arrow"/></svg>').insertAfter(this.input);

        //Add tags
        this.tags = $('<div class="tag-list"><ul></ul></div>').appendTo(this.container);
        this.tags = this.tags.find('ul');

        //TODO: Add selected items
      },

      //Add the source to the select and/or update the popup list
      //with valid selections
      updateList: function (term) {
        var items = [],
          self = this;

        //append the list
        this.list = $('#multiselect-list');
        if (this.list.length === 0) {
          this.list = $('<ul id="multiselect-list" aria-expanded="true"></ul>').css({'width': this.input.outerWidth(), 'box-shadow': '0 5px 5px rgba(0, 0, 0, 0.2)'}).appendTo('body');
        }

        this.list.empty();

        if (settings.source) {
          items = settings.source;
        } else {
          items = this.element[0].options;
        }

        for (var i = 0; i < items.length; i++) {
           var label = (typeof items[i] === 'string' ? items[i] : items[i].label),
            value = (typeof items[i] === 'string' ? null : items[i].value),
            id = (typeof items[i] === 'string' ? null : items[i].id);

          if (label.toLowerCase().indexOf(term) > -1) {
            var listOption = $('<li id="mu-list-option'+ i +'" role="option" role="listitem" ><a href="#" tabindex="-1">' + label + '</a></li>');
            listOption.find('a').attr('href', '#'+ (value || id || label));
            self.list.append(listOption);
          }
        }
      },

      //Open the list - using source - called from keyboard or click
      //Note that there is a similar event in autocomplete. Could be more dry.
      openList: function (term) {
        var self = this;

        this.updateList(term);

        this.input.popupmenu({menuId: 'multiselect-list', trigger: 'immediate', autoFocus: false})
          .on('close.multiselect', function () {
            self.list.remove();
          }).on('selected.multiselect', function (e, args) {
            self.addTag(args);
          });
      },

      //Setup Events
      handleEvents: function () {
        var self = this;

        this.trigger.on('click.multiselect', function () {
          self.openList('');
          self.input.focus();
        });
      },

      //Add this tag to the UI and update the select
      addTag: function(option) {
        var li = option.parent();
        this.input.val(this.input.val() + ', ' + option.text()).attr('aria-activedescendant', li.attr('id'));

        var sel = this.element.find('option').filter(function () { return this.value === option.attr('href').substr(1); });
        sel[0].selected = true;
        this.tags.append('<li class="tag"><button type="button">' + option.text() + '</button><em class="tag-delete">X</em></li>');
      },

      //Handle Deconstruction
      destroy: function() {
        this.element.removeData(pluginName)
          .off('keypress.multiselect focus.multiselect');
        this.container.remove();
        this.element.show();
        this.orgLabel.show();
      }
    };

    // Make it a Plugin
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        if (typeof instance[options] === 'function') {
          instance[options](args);
        }
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
