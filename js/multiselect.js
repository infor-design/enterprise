/**
* Multiselect (Tags) Control
*/
(function(factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function($) {

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
      addMarkup: function() {
        var self = this;

        //generate container
        this.container = $('<div class="multiselect"></div>');
        this.input = $('<input type="text">').attr('id', this.element.attr('id')+'-input').appendTo(this.container);
        this.element.before(this.container).hide();

        //hide and create a new label
        this.orgLabel = $('label[for="' + this.element.attr('id') + '"]');
        this.label = this.orgLabel.clone().attr('for', this.element.attr('id')+'-input');
        this.container.before(this.label);
        this.orgLabel.hide();

        //add icon button
        this.trigger = $('<svg focusable="false" class="icon" viewBox="0 0 32 32"><use focusable="false" xlink:href="#icon-dropdown-arrow"/></svg>').insertAfter(this.input);

        //Add selected items
        var selOpts = this.element[0].selectedOptions;
        if (!selOpts) {
          return;
        }
        for (var i = 0; i < selOpts.length; i++) {
          self.addTag($(selOpts[i]));
        }
      },
      //Call the source function or get the select options
      callSource: function (term) {
        var items = [],
          self = this, list = '', previousSelected = this.element.val();

        if (settings.source) {
          var response = function(data) {

            //stuff data in the select
            self.element.find('option:not(:selected)').remove();

            for (var i=0; i < data.length; i++) {
              if (data[i].value !== undefined && self.element.find('option[value='+  data[i].value.replace('"', '\'') +']').length === 0) {
                list += '<option' + (data[i].id === undefined ? '' : ' id="' + data[i].id.replace('"', '\'') + '"')
                      + (data[i].value === undefined ? '' : ' value="' + data[i].value.replace('"', '\'') + '"')
                      + (data[i].selected || $.inArray(data[i].value, previousSelected) > -1 ? ' selected ' : '')
                      + '>'+ data[i].label + '</option>';
              }
            }

            self.element.append(list);
            self.input.removeClass('is-busy');  //TODO: Need style for this
            self.openList('');
          };

          self.element.addClass('is-busy');
          items = settings.source(term, response);
          return true;
        }
        return false;
      },

      //Add the source to the select and/or update the popup list
      //with valid selections
      updateList: function(term) {
        var items = [],
          self = this;

        //append the list
        this.list = $('#multiselect-list');
        if (this.list.length === 0) {
          this.list = $('<ul id="multiselect-list" aria-expanded="true"></ul>').css({'width': this.container.outerWidth(), 'box-shadow': '0 5px 5px rgba(0, 0, 0, 0.2)'}).appendTo('body');
        }

        items = this.element[0].options;
        this.list.empty();

        $(items).each(function (i, item) {
          var isDisabled = false,
            label = (typeof item === 'string' ? item : item.label),
            value = (typeof item === 'string' ? null : item.value),
            id = (typeof item === 'string' ? null : item.id);

          if (self.isSelected(value || id || label)){
            isDisabled = true;
          }

          if (label.toLowerCase().indexOf(term) > -1) {
            var listOption = $('<li id="multiselect--option'+ i +'" role="option" role="listitem" ><a href="#" tabindex="-1">' + label + '</a></li>');
            listOption.find('a').attr('href', '#'+ (value || id || label));
            listOption.addClass((isDisabled ? 'is-disabled' : ''));
            self.list.append(listOption);
          }
        });
      },

      //Open the list - using source - called from keyboard or click
      //Note that there is a similar event in autocomplete. Could be more dry.
      openList: function(term) {
        var self = this;

        this.updateList(term);

        this.container
          .off('close.multiselect')
          .off('selected.multiselect')
          .popupmenu({menuId: 'multiselect-list', trigger: 'immediate', autoFocus: false})
          .on('close.multiselect', function () {
            self.list.remove();
          }).on('selected.multiselect', function (e, args) {
            self.addTag(args);
            self.input.focus().val('');
          });

        self.input.focus();
      },

      //Setup Events
      handleEvents: function() {
        var self = this, timer, buffer;

        this.trigger.on('click.multiselect', function () {
          if (self.input.prop('disabled')) {
            return;
          }
          if (self.callSource('')) {
            return;
          }
          self.openList('');
        });

        this.container.on('click.multiselect, touchend.multiselect', function (e) {
          var xIcon = $(e.target).closest('.remove').parent();

          if (self.input.prop('disabled')) {
            return;
          }

          if (xIcon.length > 0) {
            self.removeTag(xIcon);
          } else {
            self.input.focus();
          }
        });

        this.input.on('focusin.multiselect', function() {
          self.container.addClass('is-focused');
        }).on('focusout.multiselect', function() {
          if ($('#multiselect-list').is(':visible')) {
            return;
          }
          self.container.removeClass('is-focused');
        }).on('keypress.multiselect', function(e) {
          //Similar code in autocomplete - this is not DRY
          var field = $(this);
          if (self.input.prop('disabled')) {
            return;
          }
          clearTimeout(timer);

          if (e.altKey && e.keyCode === 40) {  //open list
            if (self.callSource('')) {
              return;
            }
            self.openList('');
            return;
          }

          if (!e.altKey && e.keyCode === 8 && self.input.val() === '') {  //remove last
            self.removeTag(self.container.find('.tag:last'));
            return;
          }

          timer = setTimeout(function () {

            buffer = field.val();
            if (buffer === '') {
              return;
            }

            //This checks all printable characters
            if (e.which === 0 || e.charCode === 0 || e.ctrlKey || e.metaKey || e.altKey) {
              return;
            }

            if (self.callSource(buffer)) {
              return;
            }
            self.openList(buffer);

          }, 300);  //no pref for this lets keep it simple.
        });
      },

      isSelected: function (val) {
        var sel = this.element.find('option').filter(function () { return this.value === val; });
        return (sel[0] ? sel[0].selected : false);
      },

      //Add this tag to the UI and update the select
      addTag: function(tag) {
        var li = tag.parent(),
          sel = tag,
          tagSpan, val;

        if (this.input.prop('disabled')) {
          return;
        }

        this.input.attr('aria-activedescendant', li.attr('id'));

        if (!tag.is('option')) {
          val = tag.attr('href').substr(1);
          sel = this.element.find('option').filter(function () { return this.value === val; });
        } else {
          val = tag[0].value;
        }

        sel[0].selected = true;
        tagSpan = $('<span class="tag">' + tag.text() + '<span class="remove"><svg class="icon" viewBox="0 0 32 32"><use xlink:href="#icon-delete"></svg></span></span>');
        tagSpan.attr('data-val',val);
        this.input.before(tagSpan);
        this.element.trigger('change');
      },

      removeTag: function(tag) {
        var sel = this.element.find('option').filter(function () { return this.value === tag.attr('data-val'); });
        sel[0].selected = false;
        tag.remove();
      },

      disable: function () {
        this.input.prop('disabled', true);
        this.container.addClass('disabled');
      },

      enable: function () {
        this.input.prop('disabled', false);
        this.container.removeClass('disabled');
      },

      //Handle Deconstruction
      destroy: function() {
        $.removeData(this.element[0], pluginName);
        this.element.off('keypress.multiselect focusin.multiselect, focusout.multiselect');
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
