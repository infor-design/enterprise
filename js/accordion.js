/**
* Accordion Control (TODO: bitly link to soho xi docs)
*/

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

  $.fn.accordion = function(options) {

    'use strict';

    // Settings and Options
    var pluginName = 'accordion',
        defaults = {
          allowOnePane: false // If true, only allows one pane open at a time
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Accordion(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Accordion.prototype = {

      init: function() {
        this
          .setup()
          .build()
          .handleEvents();
      },

      updated: function() {
        this.anchors.off();
        return this.init();
      },

      setup: function() {
        var allowOnePane = this.element.attr('data-allow-one-pane');
        this.settings.allowOnePane = allowOnePane !== undefined ? allowOnePane === 'true' : this.settings.allowOnePane;

        this.anchors = this.element.find('.accordion-header > a');
        this.headers = this.element.find('.accordion-header').filter(function() {
          return $(this).children('.accordion-pane').length > 0;
        });

        var active = this.anchors.parent().filter('.is-selected').children('a');
        if (!active.length) {
          active = this.anchors.filter(':not(:disabled):not(:hidden)').first();
        }
        this.setActiveAnchor(active);

        return this;
      },

      build: function() {
        var self = this;
        this.element.attr({
          'aria-multiselectable': 'true'
        }).find('.accordion-pane').attr({
          'aria-multiselectable': 'false'
        });

        if (this.settings.allowOnePane) {
          this.element.attr({
            'aria-multiselectable': 'false'
          });
        }

        this.headers.attr({
          'role' : 'presentation'
        });

        this.element.find('a + .accordion-pane').parent().each(function() {
          var header = $(this),
            pane = header.children('.accordion-pane');

          pane.addClass('no-transition');
          if (header.hasClass('is-expanded')) {
            header.attr('aria-expanded', 'true');
            header.find('.icon.plus-minus').addClass('active');
            pane.one('animateOpenComplete', function() {
              $(this).removeClass('no-transition');
            });
            self.openHeader(header);
          } else {
            pane.one('animateClosedComplete', function() {
              $(this).removeClass('no-transition');
            });
            self.closeHeader(header);
          }
        });

        return this;
      },

      handleEvents: function() {
        var self = this;

        this.anchors.onTouchClick('accordion').on('click.accordion', function(e) {
          self.handleClick(e);
        }).on('keydown.accordion', function(e) {
          self.handleKeydown(e);
        }).on('focus.accordion', function(e) {
          self.handleFocus(e, $(this));
        }).on('blur.accordion', function(e) {
          self.handleBlur(e, $(this));
        });

        this.element.one('updated.accordion', function() {
          self.updated();
        });

        return this;
      },

      handleClick: function(e) {
        if (this.element.hasClass('is-disabled')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        this.setActiveAnchor($(e.target));
        this.handleSelected(e);
      },

      handleFocus: function(e, anchor) {
        if (this.element.hasClass('is-disabled')) {
          e.preventDefault();
          return false;
        }
        anchor.parent().addClass('is-focused');
      },

      handleBlur: function(e, anchor) {
        if (this.element.hasClass('is-disabled')) {
          e.preventDefault();
          return false;
        }
        anchor.parent().removeClass('is-focused');
      },

      handleKeydown: function(e) {
        if (this.element.hasClass('is-disabled')) {
          return false;
        }

        var self = this,
          key = e.which,
          anchors = this.anchors.filter(':not(:disabled):not(:hidden)'),
          selected = this.element.find('.is-selected').children('a'),
          next, prev;

        if (!selected.length) {
          selected = anchors.first();
        }

        // NOTE: Enter is handled by the anchor's default implementation
        if (key === 9) { // Tab

          if (!e.shiftKey) {
            // Go Forward
            var panel = selected.next('.accordion-pane'),
              firstItem;

            if (panel.length && panel.parent().hasClass('is-expanded')) {
              e.preventDefault();
              firstItem = panel.find(':focusable').first();
              if (firstItem[0].tagName === 'A') {
                this.setActiveAnchor(firstItem);
              } else {
                firstItem.focus();
              }
              return false;
            }

            // Navigate to the next header
            next = anchors.eq(anchors.index(selected) + 1);
            if (next.length) {
              e.preventDefault();
              this.setActiveAnchor(next);
              return false;
            }

          } else {
            // Go Backward
            var index = anchors.index(selected) - 1;
            prev = anchors.eq(index);
            if (prev.length && index > -1) {
              e.preventDefault();
              this.setActiveAnchor(prev);
              return false;
            }

            var parent = selected.parentsUntil(this.element, '.accordion-header').eq(1);
            if (parent.length) {
              e.preventDefault();
              this.setActiveAnchor(parent.children('a'));
              return false;
            }

          }

          // If e.preventDefault() doesn't fire, focus may be on an element outside of the accordion.
          // If this happens, trigger a 'blur' event on the main accordion so we can communicate to other
          // plugins that focus is no longer here.
          setTimeout(function() {
            if (!$.contains(self.element[0], document.activeElement)) {
              self.element.trigger('blur');
            }
          }, 0);
        }

        if (key === 32) { // Spacebar
          this.handleSelected(selected);
          return false;
        }

        if (key === 37 || key === 38) { // Left/Up
          e.preventDefault();
          prev = anchors.eq(anchors.index(selected) - 1);
          if (!prev.length) {
            prev = anchors.last();
          }
          this.setActiveAnchor(prev);
          return false;
        }

        if (key === 39 || key === 40) { // Right/Down
          e.preventDefault();
          next = anchors.eq(anchors.index(selected) + 1);
          if (!next.length) {
            next = anchors.first();
          }
          this.setActiveAnchor(next);
        }
      },

      // NOTE: "e" is either an event or a jQuery object
      handleSelected: function(e) {
        if (this.element.hasClass('is-disabled')) {
          return false;
        }

        var isEvent = e !== undefined && e.type !== undefined,
          target = isEvent ? $(e.target) : e,
          href = target.attr('href');

        if (isEvent && (href === '' || href === '#')) {
          e.preventDefault();
        }

        this.element.trigger('selected', [target]);
        this.toggleHeader(target.parent());
      },

      setActiveAnchor: function(anchor) {
        this.headers.removeClass('child-selected');

        this.anchors.attr({
          'aria-selected': 'false'
        }).parent().removeClass('is-selected');

        anchor.attr({
          'aria-selected': 'true'
        }).parent().addClass('is-selected')

        .parentsUntil(this.element, '.accordion-header')
          .addClass('child-selected');

        anchor.focus();
      },

      toggleHeader: function(header, forceClosed) {
        if (forceClosed || header.hasClass('is-expanded')) {
          this.closeHeader(header);
        } else {
          this.openHeader(header);
        }
      },

      openHeader: function(header) {
        var self = this,
          a = header.children('a'),
          source = header.attr('data-source'),
          childPane = header.children('.accordion-pane');

        function open() {
          if (self.settings.allowOnePane) {
            self.headers.not(header).filter(function() {
              return header.parentsUntil(this.element).filter($(this)).length === 0;
            }).each(function() {
              if ($(this).hasClass('is-expanded')) {
                self.closeHeader($(this));
              }
            });
          }
          header.attr('aria-expanded', 'true').addClass('is-expanded');
          var plusminus = header.find('.icon.plus-minus');
          if (plusminus.length ===0) {
           // header.find('a').prepend('<span class="icon plus-minus" aria-hidden="true" focusable="false"></span>');
          }
          plusminus.addClass('active');

          header.children('.accordion-pane').css('display','block').one('animateOpenComplete', function() {
            header.trigger('expanded');
          }).animateOpen();
        }

        if (source && source !== null && source !== undefined && !childPane.contents().length) {
          this.loadExternalSource(a, source, open);
        } else {
          if (!childPane.length) {
            return;
          }
          open();
        }
      },

      closeHeader: function(header) {
        if (!header.children('.accordion-pane').length) {
          return;
        }

        header.attr('aria-expanded', 'false').removeClass('is-expanded');
        header.find('.icon.plus-minus').removeClass('active');
        header.children('.accordion-pane').one('animateClosedComplete', function(e) {
          e.stopPropagation();
          $(this).add($(this).find('.accordion-pane')).css('display', 'none');
          header.trigger('collapsed');
        }).animateClosed();
      },

      loadExternalSource: function(target, source, callback) {
        var self = this,
          paneEl = target.next('.accordion-pane'),
          sourceType = typeof source;

        function done(markup) {
          target
            .removeClass('busy')
            .trigger('requestend');

          paneEl.append(markup);
          self.element.trigger('updated');
          if (callback && typeof callback === 'function') {
            callback();
          }
        }

        if (!paneEl.length) {
          var parentEl = this.element[0].tagName.toLowerCase();
          paneEl = $('<' + parentEl + ' class="accordion-pane"></' + parentEl + '>').appendTo(target.parent());
        }

        target
          .addClass('busy')
          .trigger('requeststart');

        if (sourceType === 'function') {
          // Call the 'source' setting as a function with the done callback.
          settings.source(done);
        } else {
          // Convert source to string, and check for existing DOM elements that match the selectors.
          var str = source.toString(),
            request,
            jqRegex = /\$\(\'/,
            idRegex = /#[A-Za-z0-9]+/;

          if (jqRegex.test(str)) {
            str = str.replace("$('", '').replace("')", ''); //jshint ignore:line
            done($(str).html());
            return;
          }

          if (idRegex.test(str)) {
            done($(str).html());
            return;
          }

          // String is a URL.  Attempt an AJAX GET.
          request = $.get(str);

          request.done(function(data) {
            done(data);
          }).fail(function() {
            console.warn('Request to ' + str + ' could not be processed...');
            done('');
          });
        }

      },

      disable: function() {
        this.element
          .addClass('is-disabled');
      },

      enable: function() {
        this.element
          .removeClass('is-disabled');
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.anchors.parent()
          .removeClass('is-focused')
          .removeClass('is-selected')
          .removeClass('is-expanded')
          .removeAttr('aria-expanded')
          .removeAttr('role');
        this.anchors
          //.removeAttr('tabindex')
          .removeAttr('aria-selected')
          .offTouchClick('accordion')
          .off('click.accordion keydown.accordion focus.accordion blur.accordion');
        this.element
          .off('updated')
          .removeAttr('role')
          .removeAttr('aria-multiselectable');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new Accordion(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
