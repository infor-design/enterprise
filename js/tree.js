/**
* Responsive Tree Control
* @name Tree
* @param {string} option1 - Has Some Option
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
        var links = this.element.find('a'),
            self = this;

        links.each(function(i) {
          var a = $(this),
            parentCount = 0,
            subNode,
            li = a.parent('li');

          //set initial 'role', 'tabindex', and 'aria selected' on each link (except the first)
          a.attr({'role': 'treeitem', 'tabindex': '-1', 'aria-selected': 'false'});
          if (i === 0) {
            self.setSelectedNode(a);
          }

          //parentCount 'aria-level' to the node's level depth
          parentCount = a.parentsUntil(this.element, 'ul').length;
          a.attr('aria-level', parentCount + 1);

          //Set the current tree item node position relative to its aria-setsize
          var posinset = a.parent().index();
          a.attr('aria-posinset', posinset + 1);

          //adds role=group' to all subnodes
          subNode = a.next();
          //Inject Icons
          if (a.children('svg').length === 0) {
            a.prepend('<svg class="icon" focusable="false"><use xlink:href="#icon-document"></use></svg>');
          }

          if (subNode.is('ul')) {
            subNode.attr('role', 'group').parent().addClass('folder');
            a.find('use').attr('xlink:href','#icon-folder');
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
      setSelectedNode: function (node) {
        if (node.length === 0) {
          return;
        }
        node.attr({'tabindex': '0', 'aria-selected': 'true'}).parent().addClass('is-selected');
        this.element.find('a').not(node).attr({'tabindex': '-1', 'aria-selected': 'false'}).parent().removeClass('is-selected');
        node.focus();
        this.element.trigger('selected', [node]);
      },
      toggleNode: function(node) {
        var next = node.next();
        if (next.is('ul[role="group"]')) {
          next.slideToggle(function() {
            next.toggleClass('is-open');
          });
        }
      },
      setupEvents: function  () {
        var self = this;
        self.element.on('updated', function () {
          self.setupTree();
        });
      },
      handleKeys: function () {
        //Key Behavior as per: http://access.aol.com/dhtml-style-guide-working-group/#treeview
        var self = this;
        //on click give clicked element 0 tabindex and 'aria-selected=true', resets all other links
        this.element.on('click', 'a', function (e) {
          var target = $(this);
          self.setSelectedNode(target);
          self.toggleNode(target);
          e.stopPropagation();
          return false; //Prevent Click from Going to Top
        });

        //Handle Up/Down Arrow Keys and Space
        this.element.on('keydown', 'a', function (e) {
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
            //bottom of a group..
            if (next.length === 0) {
              next = target.closest('.folder').next().find('a:first');
            }
            self.setSelectedNode(next);
          }

          //up arrow,
          if (charCode === 38) {
            prev = target.parent().prev().find('a:first');
            //move into children at bottom
            if (prev.parent().is('.folder') && prev.parent().find('ul.is-open').length === 1) {
              prev = prev.parent().find('ul.is-open a:last');
            }
            //top of a group
            if (prev.length === 0) {
              prev = target.closest('ul').prev('a');
            }
            self.setSelectedNode(prev);
          }

          //space
          if (e.keyCode === 32) {
            target.trigger('click');
          }

          //right arrow
          if (charCode === 37) {
            if (target.next().hasClass('is-open')) {
              self.toggleNode(target);
            } else {
              next = target.closest('.folder').find('a:first');
              self.setSelectedNode(next);
            }
            e.stopPropagation();
            return false;
          }

          //left arrow
          if (charCode === 39) {
            if (target.next().hasClass('is-open')) {
              next = target.next().find('a:first');
              self.setSelectedNode(next);
            } else {
              self.toggleNode(target);
            }
            e.stopPropagation();
            return false;
          }

          //Home  (fn-right on mac)
          if (charCode === 36) {
            next = self.element.find('a:first:visible');
            self.setSelectedNode(next);
          }

          //End (fn-right on mac)
          if (charCode === 35) {
            next = self.element.find('a:last:visible');
            self.setSelectedNode(next);
          }

        });

        //Handle Left/Right Arrow Keys
        this.element.on('keypress', 'a', function (e) {
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
                self.setSelectedNode(node);
                return false;
              }
            });
          }

        });

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

}));
