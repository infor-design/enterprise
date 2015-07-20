/**
* Tree Control
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

  //TODO: - Context Menus
  //      - Ajax
  //      - Building Nodes
  //      - Search
  //      - Expand / All Collapse All
  $.fn.tree = function(options) {
    var pluginName = 'tree',
      defaults = {
        option1: 'false'  //None Yet
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Plugin.prototype = {
      init: function() {
        this.setupTree();
        this.handleKeys();
        this.setupEvents();
      },
      setupTree: function() {
        var links = this.element.find('a');

        links.each(function(i) {
          var a = $(this),
            parentCount = 0,
            subNode,
            li = a.parent('li');

          //set initial 'role', 'tabindex', and 'aria selected' on each link (except the first)
          a.attr({'role': 'treeitem', 'tabindex': '-1', 'aria-selected': 'false'});

          // Add Aria disabled
          if (a.hasClass('is-disabled')) {
            a.attr('aria-disabled','true');
            var childSection = a.next();

            if(childSection.is('ul.is-open')) {
              $('a', childSection).addClass('is-disabled').attr('aria-disabled','true');
              $('ul', a.parent()).addClass('is-disabled');
            }
          }

          if (i === 0) {
            // self.setSelectedNode(a, false);
            a.attr('tabindex', '0');
          }

          //parentCount 'aria-level' to the node's level depth
          parentCount = a.parentsUntil(this.element, 'ul').length - 1;
          a.attr('aria-level', parentCount + 1);

          //Set the current tree item node position relative to its aria-setsize
          var posinset = a.parent().index();
          a.attr('aria-posinset', posinset + 1);

          //Set the current tree item aria-setsize
          var listCount = a.closest('li').siblings().addBack().length;
          a.attr('aria-setsize', listCount);

          //Set the current tree item node expansion state
          if (a.next('ul').children().length > 0) {
            a.attr('aria-expanded', a.next().hasClass('is-open') ? 'true' : 'false');
          }

          //adds role=group' to all subnodes
          subNode = a.next();

          //Inject Icons
          if (a.children('svg').length === 0) {
            a.prepend('<svg class="icon icon-tree" focusable="false" aria-hidden="true"><use xlink:href="#icon-document"></use></svg>');
          }

          if (subNode.is('ul')) {
            subNode.attr('role', 'group').parent().addClass('folder');
            a.find('use').attr('xlink:href', subNode.hasClass('is-open') ? '#icon-tree-collapse' : '#icon-tree-expand');
          }

          if (li.is('[class^="icon"]')) {
            a.find('use').attr('xlink:href','#'+ li.attr('class'));
          }
        });
      },
      expandAll: function() {
        var nodes = this.element.find('ul[role=group]');
        nodes.addClass('is-open');
      },
      collapseAll: function () {
        var nodes = this.element.find('ul[role=group]');
        nodes.removeClass('is-open');
      },
      setSelectedNode: function (node, focus) {
        if (node.length === 0) {
          return;
        }
        node.attr({'tabindex': '0', 'aria-selected': 'true'}).parent().addClass('is-selected');
        this.element.find('a').not(node).attr({'tabindex': '-1', 'aria-selected': 'false'}).parent().removeClass('is-selected');

        if (focus) {
          node.focus();
        }
        this.element.trigger('selected', [node]);
      },
      toggleNode: function(node) {
        var next = node.next();

        if (next.is('ul[role="group"]')) {
          next.slideToggle(function () {
            next.toggleClass('is-open');
          });

          node.closest('.folder').toggleClass('is-open');
          node.attr('aria-expanded', (node.attr('aria-expanded') === 'true' ? 'false' : 'true'));
        }

        if(next.hasClass('is-open') && node.closest('li').hasClass('folder')){
          node.find('use').attr('xlink:href', '#icon-tree-expand' );
        } else if(node.closest('li').hasClass('folder')) {
          node.find('use').attr('xlink:href', '#icon-tree-collapse' );
        }

      },

      setupEvents: function () {
        var self = this;
        self.element.on('updated.tree', function () {
          self.setupTree();
        });
      },

      handleKeys: function () {

        //Key Behavior as per: http://access.aol.com/dhtml-style-guide-working-group/#treeview
        var self = this;
        //on click give clicked element 0 tabindex and 'aria-selected=true', resets all other links
        this.element.on('click.tree', 'a', function (e) {
          var target = $(this);
          if(!target.hasClass('is-disabled')) {
            self.setSelectedNode(target, true);
            self.toggleNode(target);
            e.stopPropagation();
          }
          return false; //Prevent Click from Going to Top
        });

        //on focus for first element is disabled
        this.element.on('focus.tree', 'a', function() {
          var target = $(this);
          // First element if disabled
          if ((parseInt(target.attr('aria-level')) === 1) &&
              (parseInt(target.attr('aria-posinset')) === 1) &&
              (target.hasClass('is-disabled'))) {

            var e = $.Event('keydown.tree');
              e.keyCode= 40; // move down
            target.trigger(e);
          }
        });

        //Handle Up/Down Arrow Keys and Space
        this.element.on('keydown.tree', 'a', function (e) {
          var charCode = e.charCode || e.keyCode,
              target = $(this),
              next, prev;

          //down arrow
          if (charCode === 40) {
            next = target.parent().next().find('a:first');

            //Move Into Children
            if (target.next().is('ul') && target.next().hasClass('is-open')) {
              next = target.next().find('a:first');
            }

            //skip disabled
            if(next.hasClass('is-disabled')) {
              next = next.parent().next().find('a:first');
            }

            //bottom of a group..
            if (next.length === 0) {
              next = target.closest('.folder').next().find('a:first');
            }
            self.setSelectedNode(next, true);
          }

          //up arrow,
          if (charCode === 38) {
            prev = target.parent().prev().find('a:first');

            //move into children at bottom
            if (prev.parent().is('.folder') &&
                prev.parent().find('ul.is-open').length === 1 &&
                !prev.parent().find('ul.is-disabled').length) {
              prev = prev.parent().find('ul.is-open a:last');
            }

            //skip disabled
            if(prev.hasClass('is-disabled')) {
              prev = prev.parent().prev().find('a:first');
            }

            //top of a group
            if (prev.length === 0) {
              prev = target.closest('ul').prev('a');
            }
            self.setSelectedNode(prev, true);
          }

          //space
          if (e.keyCode === 32) {
            target.trigger('click.tree');
          }

          //right arrow
          if (charCode === 37) {
            if (target.next().hasClass('is-open')) {
              self.toggleNode(target);
            } else {
              next = target.closest('.folder').find('a:first');
              self.setSelectedNode(next, true);
            }
            e.stopPropagation();
            return false;
          }

          //left arrow
          if (charCode === 39) {
            if (target.next().hasClass('is-open')) {
              next = target.next().find('a:first');
              self.setSelectedNode(next, true);
            } else {
              self.toggleNode(target);
            }
            e.stopPropagation();
            return false;
          }

          //Home  (fn-right on mac)
          if (charCode === 36) {
            next = self.element.find('a:first:visible');
            self.setSelectedNode(next, true);
          }

          //End (fn-right on mac)
          if (charCode === 35) {
            next = self.element.find('a:last:visible');
            self.setSelectedNode(next, true);
          }

        });

        //Handle Left/Right Arrow Keys
        this.element.on('keypress.tree', 'a', function (e) {
          var charCode = e.charCode || e.keyCode,
            target = $(this);

          if ((charCode >= 37 && charCode <= 40) || charCode === 32) {
            e.stopPropagation();
            return false;
          }

          //Printable Chars Jump to first high level node with it...
           if (e.which !== 0) {
            target.closest('li').nextAll().find('a:visible').each(function () {
              var node = $(this),
                first = node.text().substr(0,1).toLowerCase(),
                term = String.fromCharCode(e.which).toLowerCase();

              if (first === term) {
                self.setSelectedNode(node, true);
                return false;
              }
            });
          }

        });

      },

      destroy: function() {
        this.element.removeData(pluginName);
        this.element.off('updated.tree click.tree focus.tree keydown.tree keypress.tree').empty();
      }
    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });

  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
