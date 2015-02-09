/**
* MultiSelect Control (TODO: bitly link to soho xi docs)
*/

(function(factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS - Not Tested TODO
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }
}(function($) {

  'use strict';

  $.fn.multiselect = function(options) {

    // Settings and Options
    var pluginName = 'multiselect',
        defaults = {
          maxSelected: undefined,
          source: undefined
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function MultiSelect(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    MultiSelect.prototype = {

      init: function() {
        this.build();
        this.handleEvents();
      },

      build: function() {
        var self = this,
          ddOpts = {
            empty: true,
            multiple: true
          };

        if (this.settings.source) {
          ddOpts.source = this.settings.source;
        }
        if (this.settings.maxSelected) {
          ddOpts.maxSelected = this.settings.maxSelected;
        }
        this.element.dropdown(ddOpts);
        this.dropdown = this.element.data('dropdown');
        this.dropdown.input.attr('tabindex', '-1');

        // Insert Tag Container after the icon
        this.tagContainer = $('<div class="multiselect-tags" tabindex="0"></div>').insertBefore(this.dropdown.input);

        // Add Tags to the container based on existing selected options
        this.element.find('option:selected').each(function() {
          self.addTag($(this));
        });

        this.updateAria();
      },

      // TODO: Localize
      buildAriaLabel: function() {
        var tags = this.tagContainer.find('.tag'),
          optionWord = 'options',
          tagString = '';

        tags.each(function(i) {
          if (tagString.length > 0) {
            tagString += ', ';
          }
          if (tagString.length > 1 && !tags[i + 1]) {
            tagString += 'and ';
          }
          tagString += $(this).text();
        });

        if (tags.length === 1) {
          optionWord = 'option';
        }

        return this.dropdown.label.text() + '. Multiselect with ' + this.tagContainer.find('.tag').length +
          ' ' + optionWord + ' tagged. ' + tagString + (tags.length > 0 ? '.' : '');
      },

      updateAria: function() {
        this.tagContainer.attr({'aria-label': this.buildAriaLabel()});
      },

      handleEvents: function() {
        var self = this;

        this.tagContainer.on('touchend.multiselect touchcancel.multiselect', function(e) {
          e.preventDefault();
          $(e.target).click();
        }).on('click.multiselect', function(e) {
          if ($(this).hasClass('disabled')) {
            return;
          }

          var target = $(e.target);
          if (target.is('.multiselect-tags')) {
            self.element.trigger('open', [e]);
          }
          if (target.is('.remove') || target.is('use') || target.is('svg')) {
            var option = self.element.find('option[value="' + target.parents('.tag').attr('data-val') + '"]');
            self.dropdown.selectOption(option);
          }
        }).on('keydown.multiselect', function(e) {
          self.element.trigger('simulateKeyDown', [e]);
        }).on('keypress.multiselect', function(e) {
          self.element.trigger('simulateKeyPress', [e]);
        });

        this.element.on('close.multiselect', function() {
          // Triggered by the dropdown's 'close' event.
          self.tagContainer.focus();
        }).on('selected.multiselect', function(e, option, isAdded) {
          // Triggered by the dropdown's 'selected' event
          self.handleTagFromDropdown(option, isAdded);
        });
      },

      handleTagFromDropdown: function(tag, isAdded) {
        if (isAdded) {
          this.addTag(tag);
        } else {
          this.removeTag(tag);
        }
        this.updateAria();
      },

      addTag: function(tag) {
        var tagSpan = $('<span class="tag">' + tag.text() + '<span class="remove"><svg class="icon" focusable="false" aria-hidden="true"><use xlink:href="#icon-delete"></svg></span></span>');
        tagSpan.attr('data-val', tag.val());
        this.tagContainer.append(tagSpan);
      },

      removeTag: function(tag) {
        this.tagContainer.find('.tag[data-val="' + tag.val() + '"]').remove();
      },

      enable: function() {
        this.dropdown.enable();
        this.tagContainer.removeClass('disabled');
      },

      disable: function() {
        this.dropdown.disable();
        this.tagContainer.addClass('disabled');
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.tagContainer.off().remove();
        this.dropdown.destroy();
        this.element.off('close.multiselect selected.multiselect');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new MultiSelect(this, settings));
      }
    });
  };
}));
