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
        this.focusFirst();
      },

      //Init Tree from ul, li, a markup structure in DOM
      initTree: function() {
        var links = this.element.find('a'),
          self = this;

        this.element.wrap('<div class="tree-container"></div>');
        this.element.parent('.tree-container').prepend(
          '<div class="selected-item-indicator"></div>' +
          '<div class="focused-item-indicator"></div>'
        );

        this.container = this.element.closest('.tree-container');
        this.focusedIndicator = $('.focused-item-indicator', this.container);
        this.selectedIndicator = $('.selected-item-indicator', this.container);

        links.each(function() {
          var a = $(this);
          self.decorateNode(a);
        });
      },

      //Focus first tree node
      focusFirst: function () {
        this.element.find('a:first').attr('tabindex', '0');
      },

      //Set focus
      setFocus: function (node) {
        node.focus();
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

          if (a.is('[class^="icon"]')) {
            a.find('use').attr('xlink:href', subNode.hasClass('is-open') ? '#' + a.attr('class') : '#' + a.attr('class').replace('open', 'closed'));
          }
        }

        a.addClass('hide-focus');
        a.hideFocus();
      },

      //Expand all Parents
      expandAll: function(nodes) {
        nodes = nodes || this.element.find('ul[role=group]');
        nodes.each(function () {
          var node = $(this);
          node.addClass('is-open');
          node.prev('a').find('svg use').attr('xlink:href', '#icon-open-folder');

          if (node.prev('a').is('[class^="icon"]')) {
            node.prev('svg use').find('use').attr('xlink:href', '#' + node.prev('a').attr('class'));
          }

        });
      },

      //Collapse all Parents
      collapseAll: function () {
        var nodes = this.element.find('ul[role=group]');
        nodes.each(function () {
          var node = $(this);
          node.removeClass('is-open');
          node.prev('a').find('svg use').attr('xlink:href', '#icon-closed-folder');

          if (node.prev('a').is('[class^="icon"]')) {
            node.prev('a').find('svg use').attr('xlink:href', '#' + node.prev('a').attr('class').replace('open', 'closed').replace(' hide-focus', ''));
          }

          if (node.prev('a').is('[class^="icon"]')) {
            node.prev('svg use').find('use').attr('xlink:href', '#' + node.prev('a').attr('class').replace('open', 'closed'));
          }

        });
      },

      // Check if a jQuery object
      isjQuery: function (obj) {
        return (obj && (obj instanceof jQuery || obj.constructor.prototype.jquery));
      },

      // Select node by id
      selectNodeById: function (id) {
        this.selectNodeByJquerySelectior('#'+ id);
      },

      // Select node by [jquery selectior] -or- [jquery object]
      selectNodeByJquerySelectior: function (selectior) {
        var target = this.isjQuery(selectior) ? selectior : $(selectior);
        if (target.length && !target.is('.is-disabled')) {
          var nodes = target.parentsUntil(this.element, 'ul[role=group]');
          this.expandAll(nodes);
          this.setSelectedNode(target, true);
        }
      },

      // Mark node selected by id
      markNodeSelectedById: function (id, source) {
        source = source || this.settings.dataset;

        for (var key in source) {
            var item = source[key];
            delete item.selected;
            if (item.id === id) {
              item.selected = true;
              return;
            }
            if (item.children) {
              this.markNodeSelectedById(id, item.children);
            }
        }
        return;
      },

      //Set a node as the selected one
      setSelectedNode: function (node, focus) {
        if (node.length === 0) {
          return;
        }
        node.attr({'tabindex': '0', 'aria-selected': 'true'}).parent().addClass('is-selected');
        this.element.find('a').not(node).attr({'tabindex': '-1', 'aria-selected': 'false'}).parent().removeClass('is-selected');

        this.markNodeSelectedById(node.attr('id'));

        if (focus) {
          node.focus();
        }

        var jsonData = node.data('jsonData') ? node.data('jsonData') : [];

        var top = this.getAbsoluteOffset(node[0], this.container[0]).top;
        if (this.selectedIndicator.length) {
          this.selectedIndicator.css({top: top});
        }

        this.element.trigger('selected', {node: node, data: jsonData});
      },

      // Finds the offset of el from relativeEl
      // http://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
      getAbsoluteOffset: function(el, relativeEl) {
        var x = 0, y = 0;

        while(el && el !== relativeEl && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
          x += el.offsetLeft - el.scrollLeft + el.clientLeft;
          y += el.offsetTop - el.scrollTop + el.clientTop;
          el = el.offsetParent;
        }
        return { top: y, left: x };
      },

      //Animate open/closed the node
      toggleNode: function(node) {
        var next = node.next(),
          self = this;

        if (next.is('ul[role="group"]')) {
          if (next.hasClass('is-open')) {
            node.closest('.folder').removeClass('is-open').end()
              .find('use').attr('xlink:href', '#icon-closed-folder');

            if (node.closest('.folder a').is('[class^="icon"]')) {
              node.closest('.folder a').find('use').attr('xlink:href', '#' + node.closest('.folder a').attr('class').replace('open', 'closed').replace(' hide-focus', ''));
            }

            self.isAnimating = true;
            node.find('.is-selected').removeClass('is-selected');
            this.element.parent().find('.selected-item-indicator').css('top', '');

            next.one('animateclosedcomplete', function() {
              next.removeClass('is-open');
              self.isAnimating = false;
            }).animateClosed();

            node.attr('aria-expanded', node.attr('aria-expanded')!=='true');
          } else {
            var nodeData = node.data('jsonData');

            if (self.settings.source && nodeData.children.length === 0) {
              var response = function (nodes) {
                var id = nodeData.id,
                elem = self.findById(id);

                //Add DB and UI nodes
                elem.children = nodes;
                self.addChildNodes(elem, node.parent());
                node.removeClass('is-loading');

                //open
                self.openNode(next, node);

                //sync data on node
                nodeData.children = nodes;
                node.data('jsonData', nodeData);
              };

              var args = {node: node, data: node.data('jsonData')};
              self.settings.source(args, response);
              node.addClass('is-loading');

              return;
            }
            self.openNode(next, node);
          }
        }
      },

      //Open the node
      openNode: function(next, node) {
        var self = this;

        node.closest('.folder').addClass('is-open').end()
            .find('use').attr('xlink:href', '#icon-open-folder');

        if (node.is('[class^="icon"]')) {
          node.find('use').attr('xlink:href', '#' + node.attr('class').replace(' hide-focus', ''));
        }

        self.isAnimating = true;

        next.one('animateopencomplete', function() {
          self.isAnimating = false;
        }).addClass('is-open').css('height', 0).animateOpen();
        node.attr('aria-expanded', node.attr('aria-expanded')!=='true');
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
          if (!target.is('.is-disabled, .is-loading')) {
            self.setSelectedNode(target, true);
            self.toggleNode(target);
            e.stopPropagation();
          }
          return false; //Prevent Click from Going to Top
        });

        this.element
        //Focus on "a" elements
        .on('focus.tree', 'a', function() {
          var target = $(this);
          if ((parseInt(target.attr('aria-level')) === 0) &&
              (parseInt(target.attr('aria-posinset')) === 1)) {

            // First element if disabled
            if (target.hasClass('is-disabled')) {
              var e = $.Event('keydown.tree');
              e.keyCode= 40; // move down
              target.trigger(e);
              return;
            }
          }
          // Incase we decide to have border around whole background on focus
          // then we can make this block of code active
          // and deactivate focus state border in css
          // if (!target.is('.hide-focus')) {
          //   var top = self.getAbsoluteOffsetFromGivenElement(this, self.container[0]).top;
          //   if (self.focusedIndicator.length) {
          //     self.focusedIndicator.css({top: top});
          //   }
          // }
        })
        //Blur on "a" elements
        .on('blur.tree', 'a', function() {
          if (self.focusedIndicator.length) {
            self.focusedIndicator.css({top: ''});
          }
        });

        //Handle Up/Down Arrow Keys and Space
        this.element.on('keydown.tree', 'a', function (e) {

          var charCode = e.charCode || e.keyCode,
              target = $(this),
              next, prev;

          if (self.isAnimating) {
            return;
          }

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
            self.setFocus(next);
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
            self.setFocus(prev);
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
                self.setFocus(next);
              } else {
                self.toggleNode(target);
              }
            } else {
              if (target.next().hasClass('is-open')) {
                self.toggleNode(target);
              } else {
                next = target.closest('.folder').find('a:first');
                self.setFocus(next);
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
                self.setFocus(next);
              }
            } else {
              if (target.next().hasClass('is-open')) {
                next = target.next().find('a:first');
                self.setFocus(next);
              } else {
                self.toggleNode(target);
                self.setFocus(target);
              }

            }
            e.stopPropagation();
            return false;
          }

          //Home  (fn-right on mac)
          if (charCode === 36) {
            next = self.element.find('a:first:visible');
            self.setFocus(next);
          }

          //End (fn-right on mac)
          if (charCode === 35) {
            next = self.element.find('a:last:visible');
            self.setFocus(next);
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
                self.setFocus(node);
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

        self.element.empty();

        self.loading = true;
        for (var i = 0; i < dataset.length; i++) {
          self.addNode(dataset[i], 'bottom');
        }

        self.loading = false;
        self.syncDataset(self.element);
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

      //Find the Node (Dataset) By Id
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

      // Get node by ID if selected
      getNodeByIdIfSelected: function (id, source) {
        var node = this.findById(id, source);
        return (node && node.selected) ? node : null;
      },

      // Get selected nodes
      getSelectedNodes: function (source) {
        var node,
          self = this,
          selected = [];

        $('a', self.element).each(function() {
          if (this.id) {
            node = self.getNodeByIdIfSelected(this.id, source);
            if (node) {
              selected.push(node);
            }
          }
        });
        return selected;
      },

      //Sync the tree with the underlying dataset
      syncDataset: function (node) {

        var json = [],
          self = this;

        node.children('li').each(function () {
          var elem = $(this),
            tag = elem.find('a:first');

          var entry = self.syncNode(tag);
          json.push(entry);

        });

        this.settings.dataset = json;
      },

      //Sync a node with its dataset 'record'
      syncNode: function (node) {
        var entry = {},
          self = this;

        entry = {
          node: node,
          id: node.attr('id'),
          text: node.find('.tree-text').text()
        };

        if (node.hasClass('is-open')) {
          entry.open = true;
        }

        if (node.attr('href')) {
          entry.href = node.attr('href');
        }

        if (node.parent().is('.is-selected')) {
          entry.selected = true;
        }

        //icon
        var clazz = node.attr('class');
        if (clazz && clazz.indexOf('icon') > -1) {
          entry.icon = node.attr('class');
        }

        if (node.next().is('ul')) {
          var ul = node.next();
          entry.children = [];

          ul.children('li').each(function () {
            var elem = $(this),
              tag = elem.find('a:first');

            entry.children.push(self.syncNode(tag));
          });
        }

        return entry;
      },

      // Add a node and all its related markup
      addNode: function (nodeData, location) {
        var li = $('<li></li>'),
            a = $('<a href="#"></a>').appendTo(li);

        location = (!location ? 'bottom' : location); //supports button or top or jquery node

        a.attr({
          'id': nodeData.id,
          'href': nodeData.href
        }).text(nodeData.text);

        if (nodeData.open) {
          a.parent().addClass('is-open');
        }

        if (nodeData.disabled) {
          a.addClass('is-disabled');
        }

        if (nodeData.icon) {
          a.addClass(nodeData.icon);
        }

        //Handle Location
        var found = this.loading ? true : this.addToDataset(nodeData, location);

        if (nodeData.parent instanceof jQuery) {
          found = true;
        }

        if (location instanceof jQuery && (!nodeData.parent || !found) && !(nodeData.parent instanceof jQuery)) {
          location.append(li);
          found = true;
        }

        if (location === 'bottom' && (!nodeData.parent || !found)) {
          this.element.append(li);
        }

        if (location === 'top' && (!nodeData.parent || !found)) {
          this.element.prepend(li);
        }

        // Support ParentId in JSON Like jsTree
        if (nodeData.parent) {

          if (found && typeof nodeData.parent === 'string') {
            li = this.element.find('#'+nodeData.parent).parent();
            this.addAsChild(nodeData, li);
          }

          if (nodeData.parent && nodeData.parent instanceof jQuery) {
            li = nodeData.parent;
            if (nodeData.parent.is('a')) {
              li = nodeData.parent.parent();
            }
            this.addAsChild(nodeData, li);
          }
          nodeData.node = li.find('ul li a').first();

        } else {
          this.addChildNodes(nodeData, li);
          nodeData.node = li.children('a').first();
        }

        this.decorateNode(a);

        if (nodeData.selected) {
          this.setSelectedNode(a, nodeData.focus);
        }

        a.data('jsonData', nodeData);
        return li;
      },

      //Add a node to an exiting node, making it a folder if need be
      addAsChild: function (nodeData, li) {
        var ul = li.find('ul').first();
        if (ul.length === 0) {
          ul = $('<ul></ul>').appendTo(li);
          ul.addClass('folder');
        }

        ul.addClass(nodeData.open ? 'is-open' : '');
        this.decorateNode(li.find('a').first());

        nodeData.parent = '';
        this.addNode(nodeData, ul);
      },

      //Add the children for the specified node element
      addChildNodes: function (nodeData, li) {
        var self = this,
          ul = li.find('ul');

        if (!nodeData.children) {
          ul.remove();
          return;
        }

        if (ul.length === 0) {
          ul = $('<ul></ul>').appendTo(li);
          ul.addClass(nodeData.open ? 'is-open' : '');
          ul.addClass('folder');
        }

        ul.empty();

        for (var i = 0; i < nodeData.children.length; i++) {
          var elem = nodeData.children[i];
          self.addNode(elem, ul);
        }
      },

      //Update fx rename a node
      updateNode: function (nodeData) {
        //Find the node in the dataset and ui and sync it
        var elem = this.findById(nodeData.id);

        //Passed in the node element
        if (nodeData.node) {
          elem = {};
          elem.node = nodeData.node;
        }

        if (!elem) {
          return;
        }

        if (nodeData.text) {
          elem.node.find('.tree-text').first().text(nodeData.text);
          elem.text = nodeData.text;
        }

        if (nodeData.icon) {
          elem.node.find('use').first().attr('xlink:href','#'+ nodeData.icon);
          elem.icon = nodeData.icon;
        }

        if (nodeData.disabled) {
          elem.node.addClass('is-disabled');
          elem.node.attr('aria-disabled','true');
        }

        if (nodeData.node) {
          this.syncDataset(this.element);
        }

        this.addChildNodes(nodeData, elem.node.parent());
      },

      //Delete a node from the dataset or tree
      removeNode: function (nodeData) {
        var elem = this.findById(nodeData.id);

        if (nodeData instanceof jQuery) {
          elem = nodeData;
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
