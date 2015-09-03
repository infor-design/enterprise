/**
* Pager Control
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

  $.fn.pager = function(options) {

    // Settings and Options
    var pluginName = 'pager',
        defaults = {
          type: 'list', //Differet types of pagers: list, table and more
          position: 'bottom',  //Can be on top as well.
          activePage: 1, //Start on this page
          pagesize: 15, //Can be calculate or a specific number
          source: null,  //Call Back Function for Pager Data Source
          pagesizes: [15, 25, 50, 75]
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.settings = settings;
      this.element = $(element);
      this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {

      init: function() {
        this.activePage = this.settings.activePage;
        this.isTable = this.element.is('tbody');
        this.buttonExpr = 'li:not(.pager-prev):not(.pager-next):not(.pager-first):not(.pager-last)';
        this.createPagerBar();
        this.elements = this.element.children();
        this.renderBar();
        this.renderPages();
        this.handleEvents();
        this.setActivePage(this.settings.activePage); //Get First Page
      },

      createPagerBar: function () {
        this.pagerBar = this.element.prev('.pager-toolbar');

        if (this.pagerBar.length === 0) {
          this.pagerBar = $('<ul class="pager-toolbar"> <li class="pager-prev"> <a href="#" rel="prev"> <svg class="icon" focusable="false" role="presentation" aria-hidden="true"><use xlink:href="#icon-previous-page"></use></svg> <span class="audible">Previous</span> </a> </li> <li class="pager-next"> <a href="#" rel="next"> <span class="audible">Next</span> <svg class="icon" focusable="false" role="presentation" aria-hidden="true"><use xlink:href="#icon-next-page"></use></svg> </a> </li> </ul>');

          if (this.isTable && this.settings.type === 'list') {
            this.settings.type = 'table';
          }

          if (this.settings.type === 'table') {
            //Add More Buttons
            this.pagerBar.prepend('<li class="pager-first"> <a href="#" rel="prev"> <svg class="icon" focusable="false" role="presentation" aria-hidden="true"><use xlink:href="#icon-first-page"></use></svg> <span class="audible">First</span> </a> </li>');
            this.pagerBar.append('<li class="pager-last"> <a href="#" rel="prev"> <svg class="icon" focusable="false" role="presentation" aria-hidden="true"><use xlink:href="#icon-last-page"></use></svg> <span class="audible">Last</span> </a> </li>');
          }

          if (this.isTable) {
            this.element.parent('table').after(this.pagerBar);
          } else {
            if (this.settings.position ==='bottom') {
              this.element.after(this.pagerBar);
            } else {
              this.element.before(this.pagerBar);
            }
          }
        }
      },

      // Attach All relevant events
      handleEvents: function () {
        var self = this;

        //Adjust buttons on resize
        $(window).on('resize.pager', function () {
          self.renderBar();
        });

        //Attach button click and touch
        this.pagerBar.onTouchClick('pager', 'a').on('click.pager', 'a', function (e) {
          var li = $(this).parent();
          e.preventDefault();

          if (li.is('.pager-prev')) {
            self.setActivePage(self.activePage - 1);
            return false;
          }

          if (li.is('.pager-next')) {
            self.setActivePage(self.activePage + 1);
            return false;
          }

          if (li.is('.pager-first')) {
            self.setActivePage(1);
            return false;
          }

         if (li.is('.pager-last')) {
            self.setActivePage(self.pageCount());  //TODO Calculate Last Page?
            return false;
          }

          //Go to the page via the index of the button
          self.setActivePage($(this).parent().index() + (self.settings.type === 'table' ? -1 : 0));

          return false;
        });

        //Toolbar functionality
        this.pagerBar.find('a').on('keydown.pager', function (e) {
          e = (e) ? e : window.event;
          var charCode = (e.which) ? e.which : ((e.keyCode) ? e.keyCode : false),
            btn = (charCode === 37) ? $('a', $(this).parent().prev()) : (charCode === 39) ? $('a', $(this).parent().next()) : false;

          if (!!btn) {
            if(!btn.attr('disabled')) {
              btn.focus();
            }
          }
        });
      },

      //Set or Get Current Page
      setActivePage: function(pageNum) {

        var lis = this.pagerBar.find(this.buttonExpr);
        if (pageNum === 0 || pageNum > this.pageCount()) {
          return;
        }

        if (pageNum === undefined) {
          return this.activePage;
        }

        if (pageNum === this.activePage) {
          return this.activePage;
        }

        this.activePage = pageNum;

        //Remove selected
        if (!this.settings.source) {
          lis.filter('.selected').removeClass('selected').removeAttr('aria-selected')
            .find('a').removeAttr('aria-disabled')
              .find('.audible').html(Locale.translate('Page'));

          //Set selected Page
          lis.eq(pageNum-1).addClass('selected').attr('aria-selected', true)
            .find('a').attr('aria-disabled', true)
              .find('.audible').html(Locale.translate('PageOn'));
        }

        this.renderBar();
        this.renderPages();
        return pageNum;
      },

      _pageCount: 0,

      //Get/Set Total Number of pages
      pageCount: function(pages) {
        var self = this;

        if (!pages && !this.settings.source) {
          return this._pageCount;
        }

        if (pages) {
          this._pageCount = pages;
        }

        //Add in fake pages
        if (!this.isTable) {
          this.pagerBar.find(this.buttonExpr).remove();
        }

        var i, thisClass, thisText, isAriaSelected, isAriaDisabled;

        for (i = pages; i > 0; i--) {
          if (i === 1) {
            thisClass = 'class="selected"';
            thisText = Locale.translate('PageOn');
            isAriaSelected = 'aria-selected="true"';
            isAriaDisabled = 'aria-disabled="true"';
          } else {
            thisClass = '';
            thisText = Locale.translate('Page');
            isAriaSelected = '';
            isAriaDisabled = '';
          }

          if (!this.isTable) {
            $('<li '+ thisClass + isAriaSelected +'><a '+ isAriaDisabled +'><span class="audible">'+ thisText +' </span>'+ i +'</a></li>').insertAfter(this.pagerBar.find('.pager-prev'));
          }
        }

        if (this.isTable && this.pagerBar.find('.pager-count').length === 0) {
          var text =  '<span>' + Locale.translate('PageOf') + '</span>';
          text = text = text.replace('{0}', '<input data-mask="###" value="' + this.activePage + '">');
          text = text.replace('{1}', '<span class="pager-total-pages">' + (pages ? pages : '-') + '</span>');

          $('<label class="pager-count">'+ text +' </label>').insertAfter(this.pagerBar.find('.pager-prev'));

          //Setup interactivty with the numeric page input
          var lastValue = null;

          this.pagerBar.find('.pager-count input').mask()
          .on('focus', function () {
            lastValue = $(this).val();
          }).on('blur', function () {
            if (lastValue !== $(this).val()) {
              self.setActivePage(parseInt($(this).val()));
            }
          }).on('keypress', function (e) {
            if (e.which === 13) {
              self.setActivePage(parseInt($(this).val()));
            }
          });
        }

        //Add functionality to change page size.
        if (this.isTable && this.pagerBar.find('.btn-menu').length === 0) {
          var pageSize = $('<li class="pager-pagesize"><div class="btn-group"> <button type="button" class="btn-menu"> <span>' + Locale.translate('RecordsPerPage').replace('{0}', this.settings.pagesize) +'</span> <svg class="icon" focusable="false" role="presentation" aria-hidden="true"> <use xlink:href="#icon-dropdown"></use> </svg> </button>  </div></li>');
          $(pageSize).insertAfter(this.pagerBar.find('.pager-last'));
          var menu = $('<ul class="popupmenu is-padded"></ul>');

          for (var k = 0; k < self.settings.pagesizes.length; k++) {
            var size = self.settings.pagesizes[k];
            menu.append('<li '+ (size === self.settings.pagesize ? ' class="is-checked"' : '') +'><a href="#">' + size + '</a></li>');
          }

          pageSize.find('button').after(menu);

          this.pagerBar.find('.btn-menu').popupmenu().on('selected.pager', function (e, args) {
            var tag = args;
            tag.closest('.popupmenu').find('.is-checked').removeClass('is-checked');
            tag.parent('li').addClass('is-checked');
            self.settings.pagesize = parseInt(tag.text());
            self.renderPages();
          });

          $('[href="#25"]').parent().addClass('is-checked');
        }

        return this._pageCount;
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
        if (!this.settings.source) {
          pc = Math.ceil(this.elements.length/settings.pagesize);
          if (this.pageCount() !== pc) {
            this.pageCount(pc);
          }
        }

        //Refresh Disabled
        var prev = pb.find('.pager-prev a'), next = pb.find('.pager-next a'),
          first = pb.find('.pager-first a'), last = pb.find('.pager-last a');

        prev.removeAttr('disabled');
        next.removeAttr('disabled');
        first.removeAttr('disabled');
        last.removeAttr('disabled');

        if (this.activePage === 1) {
          prev.attr('disabled','disabled');
          first.attr('disabled','disabled');
        }
        if (this.activePage === this.pageCount()) {
          next.attr('disabled','disabled');
          last.attr('disabled','disabled');
        }

        //Remove from the front until selected is visible and we have at least howMany showing
        if (!this.settings.source) {
          elems = pb.find(this.buttonExpr);
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
        }
      },

      // Render Paged Items
      renderPages: function() {
        var expr,
          self = this,
          pageInfo = {activePage: this.activePage, pagesize: this.settings.pagesize, total: -1};

        //Make an ajax call and wait
        setTimeout(function () {
          var table = self.element.closest('.datagrid-container'),
            doPaging = table.triggerHandler('beforePaging', pageInfo);

          if (doPaging === false) {
            return;
          }

          if (self.settings.source) {
            var api = table.data('datagrid');

            var response = function (data, pagingInfo) {
              //Render Data
              api.loadData(data);

              //Update Paging Info
              self.updatePagingInfo(pagingInfo);
              return;
            };

            if (api.sortColumn.sortField) {
              pageInfo.sortAsc = api.sortColumn.sortAsc;
              pageInfo.sortField = api.sortColumn.sortField;
            }

            self.settings.source(pageInfo, response);
          }

          //Make an ajax call and wait
          self.element.trigger('paging', pageInfo);

          //Render page objects
          self.elements = self.element.children();
          self.elements.hide();
          expr = (self.activePage === 1 ? ':lt('+ settings.pagesize +')' : ':lt('+ ((self.activePage) * settings.pagesize) +'):gt('+ (((self.activePage-1) *settings.pagesize) -1) +')');
          self.elements.filter(expr).show();
          self.element.trigger('afterpaging', pageInfo);
        }, 0);
      },

      updatePagingInfo: function(pagingInfo) {
        this.settings.pagesize = pagingInfo.pagesize;
        this.pagerBar.find('.btn-menu span').text(Locale.translate('RecordsPerPage').replace('{0}', this.settings.pagesize));

        //this._pageCount = pagingInfo.total/this.settings.pagesize);
        this._pageCount = Math.ceil(pagingInfo.total/this.settings.pagesize);
        this.activePage = pagingInfo.activePage;
        this.setActivePage(this.activePage);

        //Update the UI
        this.pagerBar.find('.pager-count input').val(this.activePage);
        this.pagerBar.find('.pager-total-pages').text(this._pageCount);
      },

      //Teardown
      destroy: function() {
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
