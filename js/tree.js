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
        selectable: 'single', // ['single'|'multiple']
        hideCheckboxes: false, // [true|false] -apply only with [selectable: 'multiple']
        menuId: null //Context Menu to add to nodes
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
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
        this.initSelected();
        this.focusFirst();
        this.attachMenu(this.settings.menuId);
      },

      //Init Tree from ul, li, a markup structure in DOM
      initTree: function() {
        var self = this,
          s = this.settings,
          links = this.element.find('a'),
          selectableAttr = this.element.attr('data-selectable');

        // Set attribute "data-selectable"
        s.selectable = ((typeof selectableAttr !== 'undefined') &&
         (selectableAttr.toLowerCase() === 'single' ||
           selectableAttr.toLowerCase() === 'multiple')) ?
            selectableAttr : s.selectable;

        // Set isMultiselect and checkboxes show/hide
        this.isMultiselect = s.selectable === 'multiple';
        s.hideCheckboxes = s.hideCheckboxes || !this.isMultiselect;

        this.element.addClass(this.isMultiselect ? ' is-muliselect' : '');

        links.each(function() {
          var a = $(this);
          self.decorateNode(a);
        });
      },

      //Init selected notes
      initSelected: function () {
        var self = this;
        this.element.find('li.is-selected').each(function() {
          self.selectNode($('a:first', this), true);
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
        var subNode,
        parentCount = 0,
        badgeData = a.attr('data-badge'),
        badge = {elem: $('<span class="tree-badge badge"></span>')};

      if (typeof badgeData !== 'undefined') {
        badgeData = $.fn.parseOptions(a, 'data-badge');
      }

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
        var text = a.contents().filter(function() {
          return !$(this).is('.tree-badge');// Do not include badge text
        }).text();

        a.text('');
        if (a.children('svg').length === 0) {
          a.prepend($.createIcon({ icon: 'tree-node', classes: ['icon-tree'] }));
        }

        //Inject checkbox
        if (this.isMultiselect && !this.settings.hideCheckboxes) {
          a.append('<span class="tree-checkbox"></span>');
        }

        //Inject badge
        if (badgeData && !badgeData.remove) {
          badge.text = '';

          if (typeof badgeData.text !== 'undefined') {
            badge.text = badgeData.text.toString();
            badge.elem.html(badge.text);
            if (badge.text.length === 1) {
              badge.elem.addClass('round');
            }
          }
          if (/info|good|error|alert|pending/i.test(badgeData.type)) {
            badge.elem.addClass(badgeData.type);
          }
          if (badge.elem.text() !== '') {
            a.append(badge.elem);
          }
          if (badgeData.type && badgeData.type.indexOf('pending') !== -1) {
            badge.elem.text('');
          }
        }

        a.append('<span class="tree-text">' + text + '</span>');

        if (a.is('[class^="icon"]')) {
          //createIconPath
          this.setTreeIcon(a.find('svg'), a.attr('class'));
        }

        if (subNode.is('ul')) {
          subNode.attr('role', 'group').parent().addClass('folder');
          this.setTreeIcon(a.find('svg'), subNode.hasClass('is-open') ? 'open-folder' : 'closed-folder' );

          if (a.attr('class') && a.attr('class').indexOf('open') === -1 && a.attr('class').indexOf('closed') === -1) {
            a.attr('class', '');
            this.setTreeIcon(a.find('svg'), subNode.hasClass('is-open') ? 'open-folder' : 'closed-folder' );
          }

          if (a.is('[class^="icon"]')) {
            this.setTreeIcon(a.find('svg'), subNode.hasClass('is-open') ?  a.attr('class') : a.attr('class').replace('open', 'closed') );
          }
        }

        a.addClass('hide-focus');
        a.hideFocus();
      },

      setTreeIcon: function(svg, icon) {
        var iconStr = icon.replace('icon-',''),
          file = 'icons.svg';

        if (iconStr.match('jpg|mp3|gif|msg|pdf|png|ppt|prj|psd|pub|rar|tif|vis|xls')) {
          file = 'icons-extended.svg';
        }

        svg.changeIcon(iconStr, file);
      },

      //Expand all Parents
      expandAll: function(nodes) {
        var self = this;

        nodes = nodes || this.element.find('ul[role=group]');
        nodes.each(function () {
          var node = $(this);
          node.addClass('is-open');
          self.setTreeIcon(node.prev('a').find('svg'), 'open-folder');

          if (node.prev('a').is('[class^="icon"]')) {
            self.setTreeIcon(node.prev('svg'), node.prev('a').attr('class'));
          }

        });
      },

      //Collapse all Parents
      collapseAll: function () {
        var nodes = this.element.find('ul[role=group]'), self = this;

        nodes.each(function () {
          var node = $(this);
          node.removeClass('is-open');
          self.setTreeIcon(node.prev('a').find('svg'), 'closed-folder');

          if (node.prev('a').is('[class^="icon"]')) {
            self.setTreeIcon(node.prev('a').find('svg'), node.prev('a').attr('class').replace('open', 'closed').replace(' hide-focus', '').replace(' is-selected', '') );
          }

          if (node.prev('a').is('[class^="icon"]')) {
            self.setTreeIcon(node.prev('svg'), node.prev('a').attr('class').replace('open', 'closed'));
          }

        });
      },

      // Check if a jQuery object
      isjQuery: function (obj) {
        return (obj && (obj instanceof jQuery || obj.constructor.prototype.jquery));
      },

      // Select node by id
      selectNodeById: function (id) {
        this.selectNodeByJquerySelector('#'+ id);
      },

      // Select node by [jquery selector] -or- [jquery object]
      selectNodeByJquerySelector: function (selector) {
        var target = this.isjQuery(selector) ? selector : $(selector);
        if (target.length && !target.is('.is-disabled')) {
          var nodes = target.parentsUntil(this.element, 'ul[role=group]');
          this.expandAll(nodes);
          this.selectNode(target, true);
        }
      },

      //Set a node as unselected
      unSelectedNode: function (node, focus) {
        if (node.length === 0) {
          return;
        }

        var self = this,
          aTags = $('a', this.element);

        aTags.attr('tabindex', '-1');
        node.attr('tabindex', '0');

        $('a:not(.is-disabled)', node.parent()).attr('aria-selected', 'false').parent().removeClass('is-selected');

        this.syncNode(node);
        this.setNodeStatus(node);

        if (focus) {
          node.focus();
        }

        // Set active css class
        $('li', self.element).removeClass('is-active');
        node.parent().addClass('is-active');

        setTimeout(function() {
          var jsonData = node.data('jsonData') || {};
          self.element.triggerHandler('unselected', {node: node, data: jsonData});
        }, 0);
      },

      //Set a node as the selected one
      selectNode: function (node, focus) {
        if (node.length === 0) {
          return;
        }

        var self = this,
          aTags = $('a', this.element);

        aTags.attr('tabindex', '-1');
        node.attr('tabindex', '0');

        if (this.isMultiselect) {
          $('a:not(.is-disabled)', node.parent())
            .attr('aria-selected', 'true').parent().addClass('is-selected');
        }
        else {
          aTags.attr('aria-selected', 'false').parent().removeClass('is-selected');
          aTags.attr('aria-selected', 'false').removeClass('is-selected');
          node.attr('aria-selected', 'true').parent().addClass('is-selected');
        }

        this.syncNode(node);
        if (!this.loading) {
          this.setNodeStatus(node);
        }

        if (focus) {
          node.focus();
        }

        // Set active css class
        $('li', self.element).removeClass('is-active');
        node.parent().addClass('is-active');

        setTimeout(function() {
          var jsonData = node.data('jsonData') || {};
          self.element.triggerHandler('selected', {node: node, data: jsonData});
        }, 0);
      },

      setNodeStatus: function(node) {
        var self = this,
          data = node.data('jsonData'),
          nodes;

        // Not multiselect
        if (!this.isMultiselect) {
          node.removeClass('is-selected is-partial');
          if (data && data.selected) {
            node.addClass('is-selected');
          }
          return;
        }

        var setStatus = function (nodes, isFirstSkipped) {
          nodes.each(function() {
            var node = $('a:first', this),
              parent = node.parent(),
              status = self.getSelectedStatus(node, isFirstSkipped);

            if (status === 'mixed') {
              parent.removeClass('is-selected is-partial').addClass('is-partial');
            }
            else if (status) {
              parent.removeClass('is-selected is-partial').addClass('is-selected');
            }
            else {
              parent.removeClass('is-selected is-partial');
            }
            self.syncNode(node);
          });
        };

        // Multiselect
        var isFirstSkipped = false;
        nodes = node.parent().find('li.folder');
        setStatus(nodes, isFirstSkipped);

        isFirstSkipped = (!nodes.length && data && !data.selected) ? false : true;
        nodes = node.parentsUntil(this.element, 'li.folder');
        setStatus(nodes, isFirstSkipped);
      },

      getSelectedStatus: function(node, isFirstSkipped) {
        var status,
          total = 0,
          selected = 0,
          unselected = 0,
          data;

        node.parent().find('a').each(function(i) {
          if (isFirstSkipped && i === 0) {
            return;
          }
          total++;
          data = $(this).data('jsonData');
          if (data && data.selected) {
            selected++;
          } else {
            unselected++;
          }
        });

        status = ((total === selected) ? true : ((total === unselected) ? false : 'mixed'));
        return status;
      },

      //Animate open/closed the node
      toggleNode: function(node) {
        var next = node.next(),
          self = this;

        if (next.is('ul[role="group"]')) {
          if (next.hasClass('is-open')) {

            self.setTreeIcon(node.closest('.folder').removeClass('is-open').end().find('svg'),
                'closed-folder');

            if (node.closest('.folder a').is('[class^="icon"]')) {
              self.setTreeIcon(node.closest('.folder a').find('svg'),
                node.closest('.folder a').attr('class').replace('open', 'closed').replace(' hide-focus', '').replace(' is-selected', ''));
            }

            self.isAnimating = true;
            self.unSelectedNode(node.parent().find('li.is-selected'), false);
            node.find('.is-selected').removeClass('is-selected');

            next.one('animateclosedcomplete', function() {
              next.removeClass('is-open');
              self.isAnimating = false;
            }).animateClosed();

            node.attr('aria-expanded', node.attr('aria-expanded')!=='true');



          } else {
            var nodeData = node.data('jsonData');

            if (self.settings.source && nodeData.children && nodeData.children.length === 0) {
              var response = function (nodes) {
                var id = nodeData.id,
                elem = self.findById(id);

                //Add DB and UI nodes
                elem.children = nodes;
                self.addChildNodes(elem, node.parent());
                node.removeClass('is-loading');
                self.loading = false;

                //open
                self.openNode(next, node);

                //sync data on node
                nodeData.children = nodes;
                node.data('jsonData', nodeData);
                self.selectNode(node, true);
                self.initSelected();
              };

              var args = {node: node, data: node.data('jsonData')};
              self.settings.source(args, response);
              node.addClass('is-loading');
              self.loading = true;

              return;
            }
            self.openNode(next, node);
          }
        }
      },

      //Open the node
      openNode: function(next, node) {
        var self = this;

        self.setTreeIcon(node.closest('.folder').addClass('is-open').end().find('svg'), 'open-folder');

        if (node.is('[class^="icon"]')) {
          self.setTreeIcon(node.find('svg'), node.attr('class').replace(' hide-focus', '').replace(' is-selected', ''));
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
          var target = $(this),
            parent = target.parent();
          if (!target.is('.is-disabled, .is-loading')) {
            if (self.isMultiselect) {
              if ($(e.target).is('.icon') && parent.is('.folder')) {
                self.toggleNode(target);
              }
              else if (parent.is('.is-selected, .is-partial')) {
                self.unSelectedNode(target, true);
              }
              else {
                self.selectNode(target, true);
              }
            }
            else {
              self.selectNode(target, true);
              self.toggleNode(target);
            }
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

            //bottom of a group..{l=1000: max folders to be deep }
            if (next.length === 0) {
              for (var i=0,l=1000,closest=target; i<l; i++) {
                closest = closest.parent().closest('.folder');
                next = closest.next().find('a:first');
                if (next.length) {
                  break;
                }
              }
            }
            self.setFocus(next);
          }

          //up arrow,
          if (charCode === 38) {
            prev = target.parent().prev().find('a:first');

            //move into children at bottom
            if (prev.parent().is('.folder.is-open') &&
                prev.parent().find('ul.is-open a').length &&
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

          // Left arrow
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

          // Right arrow
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
      getSelectedNodes: function () {
        var node, data,
          selected = [];

        $('li.is-selected', this.element).each(function() {
          node = $('a:first', this);
          data = node.data('jsonData');
          selected.push({'node': node, 'data': data});
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

        entry.node = node;
        entry.id = node.attr('id');
        entry.text = node.find('.tree-text').text();

        if (node.data('jsonData')) {
          entry.extra = node.data('jsonData').extra;
        }

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

        node.data('jsonData', entry);
        return entry;
      },

      // Add a node and all its related markup
      addNode: function (nodeData, location) {
        var li = $('<li></li>'),
          a = $('<a href="#"></a>').appendTo(li),
          badgeAttr = typeof nodeData.badge === 'object' ? JSON.stringify(nodeData.badge) : nodeData.badge;

        location = (!location ? 'bottom' : location); //supports button or top or jquery node

        a.attr({
          'id': nodeData.id,
          'href': nodeData.href,
          'data-badge': badgeAttr
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

            if (!nodeData.disabled && li.is('.is-selected') && typeof nodeData.selected === 'undefined') {
              nodeData.selected = true;
            }
            this.addAsChild(nodeData, li);
          }

          if (nodeData.parent && nodeData.parent instanceof jQuery) {
            li = nodeData.parent;
            if (nodeData.parent.is('a')) {
              li = nodeData.parent.parent();
            }
            this.addAsChild(nodeData, li);
          }
          nodeData.node = li.find('ul li a#'+ nodeData.id);

        } else {
          this.addChildNodes(nodeData, li);
          nodeData.node = li.children('a').first();
        }

        this.decorateNode(a);

        if (nodeData.selected) {
          this.selectNode(a, nodeData.focus);
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

        if (nodeData.children) {
          for (var i = 0; i < nodeData.children.length; i++) {
            var elem = nodeData.children[i];
            self.addNode(elem, ul);
          }
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

        // Update badge
        if (nodeData.badge) {
          var badge = elem.node.find('.tree-badge:first');
          // Add badge if not exists
          if (!badge.length && !nodeData.badge.remove) {
            if (!nodeData.badge.remove && typeof nodeData.badge.text !== 'undefined' && $.trim(nodeData.badge.text) !== '') {
              $('<span class="tree-badge badge"></span>').insertBefore(elem.node.find('.tree-text:first'));
              badge = elem.node.find('.tree-badge:first');
            }
          }
          // Make update changes
          if (badge.length) {
            if (typeof nodeData.badge.text !== 'undefined') {
              nodeData.badge.text = nodeData.badge.text.toString();
              badge.text(nodeData.badge.text).removeClass('round');
              if (nodeData.badge.text.length === 1) {
                badge.addClass('round');
              }
            }
            if (typeof nodeData.badge.type !== 'undefined') {
              badge.removeClass('info good error alert pending');
              if (/info|good|error|alert|pending/i.test(nodeData.badge.type)) {
                badge.addClass(nodeData.badge.type);
              }
              if (nodeData.badge.type.indexOf('pending') !== -1) {
                badge.text('');
              }
            }
            elem.badge = nodeData.badge;

            //Remove badge
            if (this.parseBool(nodeData.badge.remove)) {
              badge.remove();
              if (typeof elem.badge !== 'undefined') {
                delete elem.badge;
              }
            }
          }
        }

        if (nodeData.text) {
          elem.node.find('.tree-text').first().text(nodeData.text);
          elem.text = nodeData.text;
        }

        if (nodeData.icon) {
          this.setTreeIcon(elem.node.find('svg').first(), nodeData.icon);
          elem.icon = nodeData.icon;
        }

        if (nodeData.disabled) {
          elem.node.addClass('is-disabled');
          elem.node.attr('aria-disabled','true');
        }

        if (nodeData.node) {
          this.syncDataset(this.element);
        }

        if (nodeData.children) {
          if (nodeData.children.length) {
            this.addChildNodes(nodeData, elem.node.parent());
          }
          else {
            this.removeChildren(nodeData, elem.node.parent());
          }
        }

      },

      // Performs the usual Boolean coercion with the exception of
      // the strings "false" (case insensitive) and "0"
      parseBool: function(b) {
        return !(/^(false|0)$/i).test(b) && !!b;
      },

      // Delete children nodes
      removeChildren: function (nodeData, li) {
        var ul = li.find('ul');

        this.setTreeIcon(li.find('svg').first(), (nodeData.icon || 'icon-tree-node'));
        li.removeClass('folder is-open');
        ul.remove();
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

      //Attach Context Menus
      attachMenu: function (menuId) {
        var self = this;

        if (!menuId) {
          return;
        }

        this.element.off('contextmenu.tree').on('contextmenu.tree', 'a', function (e) {
          var node = $(this);
          e.preventDefault();

          $(e.currentTarget).popupmenu({menuId: menuId, eventObj: e, trigger: 'immediate'}).off('selected').on('selected', function (e, args) {
            self.element.triggerHandler('menuselect', {node: node, item: args});
          });

          self.element.triggerHandler('menuopen', {menu: $('#' +menuId), node: node});
          return false;
        });

      },

      // Plugin Related Functions
      destroy: function() {
        this.element.removeData(pluginName);
        this.element.off('contextmenu.tree updated.tree click.tree focus.tree keydown.tree keypress.tree').empty();
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
