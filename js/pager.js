/**
* Pager Control
*/
(function (factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }

}(function ($) {

  $.fn.pager = function(options) {

    // Settings and Options
    var pluginName = 'pager',
        defaults = {
          pagesize: 5 //can be calculate or a specific number
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {

      init: function() {
        this.pagerBar = this.element.find('ul:first');
        this.activePage = 1;
        this.pages = this.element.find('.pager-content');
        this.renderBar();
        this.renderPages();
        this.handleEvents();
      },

      // Attach All relevant events
      handleEvents: function () {
        var self = this;

        //Adjust buttons on resize
        $(window).on('resize.pager', function () {
          self.renderBar();
        });

        //Attach button click and touch
        this.element.on('click.pager touchend.pager', '.pager-toolbar a', function (e) {
          var li = $(this).parent();
          e.preventDefault();

          if (li.is('.pager-prev')) {
            self.currentPage(self.activePage-1);
            return false;
          }

          if (li.is('.pager-next')) {
            self.currentPage(self.activePage+1);
            return false;
          }

          self.currentPage($(this).parent().index());

          return false;
        });

        //Toolbar functionality
        this.pagerBar.find('a:not(:first)').attr('tabindex', -1);
        this.pagerBar.find('a').on('keydown.pager', function (e) {
          var btn;

          if (e.keyCode === 39 || e.keyCode === 37) {
            btn = $(this).attr('tabindex', -1);
            self.pagerBar.find('a').attr('tabindex', -1);
          }

          //move next
          if (e.keyCode === 39) {
            btn.parent().next().find('a').attr('tabindex', 0).focus();
            return;
          }
          //move prev
          if (e.keyCode === 37) {
            btn.parent().prev().find('a').attr('tabindex', 0).focus();
          }
        });

      },

      //Set or Get Current Page
      currentPage: function(pageNum) {
        var lis = this.pagerBar.find('li:not(.pager-prev):not(.pager-next)');

        if (pageNum === 0 || pageNum > this.pageCount()) {
          return;
        }

        if (pageNum === undefined) {
          return this.activePage;
        }

        this.activePage = pageNum;

        //set selected Page
        lis.filter('.selected').removeClass('selected').removeAttr('aria-selected');
        lis.eq(pageNum-1).addClass('selected').attr('aria-selected', true);

        this.renderBar();
        this.renderPages();
        return pageNum;
      },

      //Get/Set Total Number of pages
      pageCount: function(pages) {
        if (pages) {
          //Add in fake pages
          this.pagerBar.find('li:not(.pager-prev):not(.pager-next)').remove();
          for (var i = pages; i > 0; i--) {
            $('<li '+ (1 === i ? 'class="selected"' : '') +'><a href="#"><span class="audible">Page </span>'+ i +'</a></li>').insertAfter(this.pagerBar.find('.pager-prev'));
          }
        }
        return this.pagerBar.find('li:not(.pager-prev):not(.pager-next)').length;
      },

      // Render Pages
      renderBar: function() {
        //How many can fit?
        var pb = this.pagerBar,
          elems, pc,
          width = (this.element.parent().width() / pb.find('li:first').width()),
          howMany = Math.floor(width-3);   //Take out the ones that should be visible (buttons and selected)

        //Check Data Attr
        if (this.element.attr('data-pagesize')) {
          settings.pagesize = this.element.attr('data-pagesize');
        }

        //Adjust Page count numbers
        pc = Math.ceil(this.pages.children().length/settings.pagesize);
        if (this.pageCount() !== pc) {
          this.pageCount(pc);
        }

        //Refresh Disabled
        var prev = pb.find('.pager-prev a'), next = pb.find('.pager-next a');
        prev.removeAttr('disabled');
        next.removeAttr('disabled');

        if (this.activePage === 1) {
          prev.attr('disabled','disabled');
        }
        if (this.activePage === this.pageCount()) {
          next.attr('disabled','disabled');
        }

        //Remove from the front until selected is visible and we have at least howMany showing
        elems = pb.find('li:not(.pager-prev):not(.pager-next)');
        elems.show();
        if (elems.length < howMany) {
          return;
        }

        elems.each(function () {
          var li = $(this);
          if (pb.find('.pager-next').offset().top - pb.offset().top > 1 && !li.is('.selected')) {
            $(this).hide();
          }
        });

      },

      // Render Paged Items
      renderPages: function() {
        var expr;

        //Make an ajax call and wait
        this.element.trigger('paging', {currentPage: this.currentPage(), callback: function () {
          //TODO - Not sure what
        }});

        //Render page objects
        this.elements = this.pages.children();
        this.elements.hide();
        expr = (this.currentPage() === 1 ? ':lt('+ settings.pagesize +')' : ':lt('+ ((this.currentPage()) * settings.pagesize) +'):gt('+ (((this.currentPage()-1) *settings.pagesize) -1) +')');
        this.elements.filter(expr).show();
      },

      //Teardown
      destroy: function() {
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

}));
