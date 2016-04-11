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
  //      - Search
  $.fn.tree = function(options) {
    var pluginName = 'tree',
      defaults = {
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
        this.settings = $.extend({}, settings);
        this.initTree();
        this.handleKeys();
        this.setupEvents();
        this.loadData(this.settings.dataset);
        this.syncDataset(this.element);
      },

      //Init Tree from ul, li, a markup structure in DOM
      initTree: function() {
        var links = this.element.find('a'),
          self = this;

        links.each(function() {
          var a = $(this);

          self.decorateNode(a);
        });
      },

      //From the LI, Read props and add stuff
      decorateNode: function(a) {
        var parentCount = 0,
            subNode;

        //set initial 'role', 'tabindex', and 'aria selected' on each link (except the first)
        a.attr({'role': 'treeitem', 'tabindex': '-1', 'aria-selected': 'false'});

        // Add Aria disabled
        if (a.hasClass('is-disabled')) {
          a.attr('aria-disabled','true');
          var childSection = a.next();

          if (childSection.is('ul.is-open')) {
            $('a', childSection).addClass('is-disabled').attr('aria-disabled','true');
            $('ul', a.parent()).addClass('is-disabled');
          }
        }

        if (a.index() === 0) {
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
        var text = a.text();
        a.text('');
        if (a.children('svg').length === 0) {
          a.prepend('<svg class="icon icon-tree" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-tree-node"></use></svg>');
        }

        a.append('<span class="tree-text">' + text + '</span>');

        if (a.is('[class^="icon"]')) {
          a.find('use').attr('xlink:href','#'+ a.attr('class'));
        }

        if (subNode.is('ul')) {
          subNode.attr('role', 'group').parent().addClass('folder');
          a.find('use').attr('xlink:href', subNode.hasClass('is-open') ? '#icon-open-folder' : '#icon-closed-folder');
        }

      },

      //Expand all Parents
      expandAll: function() {
        var nodes = this.element.find('ul[role=group]');
        nodes.each(function () {
          var node = $(this);
          node.addClass('is-open');
          node.prev('a').find('svg use').attr('xlink:href', '#icon-open-folder');

        });
      },

      //Collapse all Parents
      collapseAll: function () {
        var nodes = this.element.find('ul[role=group]');
        nodes.each(function () {
          var node = $(this);
          node.removeClass('is-open');
          node.prev('a').find('svg use').attr('xlink:href', '#icon-closed-folder');
        });
      },

      //Set a node as the selected one
      setSelectedNode: function (node, focus) {
        if (node.length === 0) {
          return;
        }
        node.attr({'tabindex': '0', 'aria-selected': 'true'}).parent().addClass('is-selected');
        this.element.find('a').not(node).attr({'tabindex': '-1', 'aria-selected': 'false'}).parent().removeClass('is-selected');

        if (focus) {
          node.focus();
        }

        var jsonData = node.data('json-data') ? node.data('json-data') : [];
        this.element.trigger('selected', {node: node, data: jsonData});
      },

      //Animate open/closed the node
      toggleNode: function(node) {
        var next = node.next();

        if (next.is('ul[role="group"]')) {
          if (next.hasClass('is-open')) {
            next.one('animateclosedcomplete', function() {
              next.removeClass('is-open');
              node.closest('.folder').removeClass('is-open').end()
                  .find('use').attr('xlink:href', '#icon-closed-folder');
            }).animateClosed();
          } else {
            next.addClass('is-open').one('animateopencomplete', function() {
              node.closest('.folder').addClass('is-open').end()
                  .find('use').attr('xlink:href', '#icon-open-folder');
            }).animateOpen();
          }
          node.attr('aria-expanded', node.attr('aria-expanded')!=='true');
        }
      },

      //Setup event handlers
      setupEvents: function () {
        var self = this;
        self.element.on('updated.tree', function () {
          self.initTree();
        });
      },

      //Handle Keyboard Navigation
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
              next = target.parents('.folder').last().next().find('a:first');
            }
            self.setSelectedNode(next, true);
          }

          //up arrow,
          if (charCode === 38) {
            prev = target.parent().prev().find('a:first');

            //move into children at bottom
            if (prev.parent().is('.folder.is-open') &&
                prev.parent().find('ul.is-open').length &&
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
            if (Locale.isRTL()) {
              if (target.next().hasClass('is-open')) {
                next = target.next().find('a:first');
                self.setSelectedNode(next, true);
              } else {
                self.toggleNode(target);
              }
            } else {
              if (target.next().hasClass('is-open')) {
                self.toggleNode(target);
              } else {
                next = target.closest('.folder').find('a:first');
                self.setSelectedNode(next, true);
              }
            }
            e.stopPropagation();
            return false;
          }

          //left arrow
          if (charCode === 39) {
            if (Locale.isRTL()) {
              if (target.next().hasClass('is-open')) {
                self.toggleNode(target);
              } else {
                next = target.closest('.folder').find('a:first');
                self.setSelectedNode(next, true);
              }
            } else {
              if (target.next().hasClass('is-open')) {
                next = target.next().find('a:first');
                self.setSelectedNode(next, true);
              } else {
                self.toggleNode(target);
              }
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

      //handle Loading JSON
      loadData: function (dataset) {
        var self = this;
        if (!dataset) {
          return;
        }

        for (var i = 0; i < dataset.length; i++) {
          self.addNode(dataset[i], 'bottom', false);
        }
      },

      //Functions to Handle Internal Data Store
      addToDataset: function (node, location) {
        var elem;

        if (node.parent) {
          elem = this.findById(node.parent);
        }

        if (location === 'bottom' && !node.parent && !elem) {
          this.settings.dataset.push(node);
        }

        if (location === 'top' && !node.parent && !elem) {
          this.settings.dataset.unshift(node);
        }

        if (node.parent && elem) {

          if (!elem.children) {
            elem.children = [];
          }

          if (location === 'bottom') {
            elem.children.push(node);
          } else {
            elem.children.unshift(node);
          }
        }

        return ((node.parent && !elem) ? false : true);
      },

      findById: function (id, source) {
        var key,
          self = this;

        if (!source) {
          source = this.settings.dataset;
        }

        for (key in source) {
            var item = source[key];
            if (item.id === id) {
              return item;
            }

            if (item.children) {
              var subresult = self.findById(id, item.children);

              if (subresult) {
                return subresult;
              }
            }
        }
        return null;
      },

      syncDataset: function (elem) {

        var json = [],
          self = this;

        elem.children('li').each(function () {
          var elem = $(this),
            tag = elem.find('a:first');

          var entry = self.syncNode(tag);
          json.push(entry);

        });

        this.settings.dataset = json;
      },

      syncNode: function (tag) {
        var entry = {},
          self = this;

        entry = {
          node: tag,
          id: tag.attr('id'),
          text: tag.find('.tree-text').text()
        };

        if (tag.hasClass('is-open')) {
          entry.open = true;
        }

        if (tag.attr('href')) {
          entry.href = tag.attr('href');
        }

        if (tag.parent().is('.is-selected')) {
          entry.selected = true;
        }

        //icon
        var clazz =tag.attr('class');
        if (clazz && clazz.indexOf('icon') > -1) {
          entry.icon = tag.attr('class');
        }

        if (tag.next().is('ul')) {
          var ul = tag.next();
          entry.children = [];

          ul.children('li').each(function () {
            var elem = $(this),
              tag = elem.find('a:first');

            entry.children.push(self.syncNode(tag));
          });
        }

        return entry;
      },

      // Node Construction Functions
      addNode: function (node, location, updateData) {
        var li = $('<li></li>'),
            a = $('<a href="#"></a>').appendTo(li);

        location = (!location ? 'bottom' : location); //supports button or top or jquery node

        a.attr({
          'id': node.id,
          'href': node.href
        }).text(node.text);

        if (node.open) {
          a.parent().addClass('is-open');
        }

        if (node.icon) {
          a.addClass(node.icon);
        }

        //Handle Location
        var found = updateData ? this.addToDataset(node, location) : true;

        if (location === 'bottom' && (!node.parent || !found)) {
          this.element.append(li);
        }

        if (location === 'top' && (!node.parent || !found)) {
          this.element.prepend(li);
        }

        if (location instanceof jQuery && (!node.parent || !found)) {
          location.append(li);
        }

        // Support ParentId in JSON Like jsTree
        if (node.parent) {

          if (found && typeof node.parent === 'string') {
            li = this.element.find('#'+node.parent).parent();
            this.addAsChild(node, li);
          }

          if (node.parent && node.parent instanceof jQuery) {
            li = node.parent;
            if (node.parent.is('a')) {
              li = node.parent.parent();
            }
            this.addAsChild(node, li);
          }
          node.node = li.find('ul li a').first();

        } else {
          this.addChildNodes(node, li);
          node.node = li.children('a').first();
        }

        this.decorateNode(a);

        if (node.selected) {
          this.setSelectedNode(a, node.focus);
        }

        a.data('json-data', node);
        return li;
      },

      //Add a node to an exiting node, making it a folder if need be
      addAsChild: function (node, li) {
        var ul = li.find('ul').first();
        if (ul.length === 0) {
          ul = $('<ul></ul>').appendTo(li);
          ul.addClass('folder');
        }

        ul.addClass(node.open ? 'is-open' : '');
        this.decorateNode(li.find('a').first());

        node.parent = '';
        this.addNode(node, ul, true);
      },

      addChildNodes: function (node, li) {
        var self = this;
        if (!node.children) {
          return;
        }

        var ul = $('<ul></ul>').appendTo(li);
        ul.addClass(node.open ? 'is-open' : '');
        ul.addClass('folder');

        for (var i = 0; i < node.children.length; i++) {
          var elem = node.children[i];
          var newLi = self.addNode(elem, ul, false);

          if (elem.children) {
            self.addChildNodes(elem, newLi);
          }
        }
      },

      //Update fx rename a node
      updateNode: function (node) {
        //Find the node in the dataset and ui and sync it
        var elem = this.findById(node.id);

        //Passed in the node element
        if (node.node) {
          elem = {};
          elem.node = node.node;
        }

        if (!elem) {
          return;
        }

        if (node.text) {
          elem.node.find('.tree-text').first().text(node.text);
          elem.text = node.text;
        }

        if (node.icon) {
          elem.node.find('use').first().attr('xlink:href','#'+ node.icon);
          elem.icon = node.icon;
        }

        if (node.node) {
          this.syncDataset(this.element);
        }

      },

      //Delete a node from the dataset or tree
      removeNode: function (node) {
        var elem = this.findById(node.id);

        if (node instanceof jQuery) {
          elem = node;
          elem.parent().remove();
        } else if (elem) {
          elem.node.parent().remove();
        }

        if (!elem) {
          return;
        }
        this.syncDataset(this.element);
      },

      // Plugin Related Functions
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
