import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Environment as env } from '../utils/environment';
import { Locale } from '../locale/locale';

// Jquery Functions
import '../utils/animations';

// The name of this component.
const COMPONENT_NAME = 'tree';

/**
 * @namespace
 * @property {string} selectable 'single' or 'multiple'.
 * @property {boolean} hideCheckboxes Only applies when `selectable` is set to 'multiple'.
 * @property {null|string} menuId if defined, will be used to identify a Context Menu by ID
 * attribute in which to add nodes.
 * @property {boolean} useStepUI if `true`, turns this tree instance into a "Stepped" tree.
 * @property {string} folderIconOpen the icon used when a tree folder node is open.
 * @property {string} folderIconClosed the icon used when a tree folder node is closed.
 * @property {boolean} sortable if `true`, allows nodes to become sortable.
 * @property {null|function} onBeforeSelect if defined as a function, fires that function as a
 * callback before the selection on a node occurs.
 */
const TREE_DEFAULTS = {
  selectable: 'single', // ['single'|'multiple']
  hideCheckboxes: false, // [true|false] -apply only with [selectable: 'multiple']
  menuId: null, // Context Menu to add to nodes
  useStepUI: false, // When using the UI as a stepped tree
  folderIconOpen: 'open-folder',
  folderIconClosed: 'closed-folder',
  sortable: false, // Allow nodes to be sortable
  onBeforeSelect: null,
  onExpand: null,
  onCollapse: null
};

/**
* Thetree Component displays a hierarchical list.
* @param {string} element The component element.
* @param {string} settings The component settings.
* @class Datagrid
*/
function Tree(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, TREE_DEFAULTS);

  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Tree Methods
Tree.prototype = {

  /**
   * @private
   * @returns {undefined}
   */
  init() {
    this.isIe11 = (env.browser.name === 'ie' && env.browser.version === '11');
    this.initTree();
    this.handleKeys();
    this.setupEvents();

    if (this.loadData(this.settings.dataset) === -1) {
      this.syncDataset(this.element);
      this.initSelected();
      this.focusFirst();
      this.attachMenu(this.settings.menuId);
      this.createSortable();
    }
  },

  /**
   * Init Tree from ul, li, a markup structure in DOM
   */
  initTree() {
    const self = this;
    const s = this.settings;
    const links = this.element.find('a');
    const selectableAttr = this.element.attr('data-selectable');

    // Set attribute "data-selectable"
    s.selectable = ((typeof selectableAttr !== 'undefined') &&
     (selectableAttr.toLowerCase() === 'single' ||
       selectableAttr.toLowerCase() === 'multiple')) ?
      selectableAttr : s.selectable;

    // Set isMultiselect and checkboxes show/hide
    this.isMultiselect = s.selectable === 'multiple';
    s.hideCheckboxes = s.hideCheckboxes || !this.isMultiselect;

    this.element.addClass(this.isMultiselect ? ' is-muliselect' : '');

    links.each(function () {
      const a = $(this);
      self.decorateNode(a);
    });
  },

  /**
   * Init selected notes
   */
  initSelected() {
    const self = this;
    this.element.find('li').each(function () {
      self.setNodeStatus($('a:first', this));
    });
  },

  /**
   * Focus the first tree node
   */
  focusFirst() {
    this.element.find('a:first').attr('tabindex', '0');
  },

  /**
   * Set focus
   * @private
   * @param {Object} node .
   * @returns {void}
   */
  setFocus(node) {
    node.focus().removeClass('hide-focus');
  },

  /**
   * From the LI, Read props and add stuff
   * @private
   * @param {Object} a an anchor tag reference wrapped in a jQuery object.
   * @returns {void}
   */
  decorateNode(a) {
    let parentCount = 0;
    let badgeData = a.attr('data-badge');
    const alertIcon = a.attr('data-alert-icon');
    const badge = { elem: $('<span class="tree-badge badge"></span>') };
    const isParentsDisabled = a.parentsUntil(this.element, 'ul[role=group].is-disabled').length > 0;
    const isDisabled = a.hasClass('is-disabled') || isParentsDisabled;

    if (typeof badgeData !== 'undefined') {
      badgeData = utils.parseSettings(a, 'data-badge');
    }

    // Set initial 'role', 'tabindex', and 'aria selected' on each link (except the first)
    a.attr({ role: 'treeitem', tabindex: '-1', 'aria-selected': 'false' });

    // Add Aria disabled
    if (isDisabled) {
      a.addClass('is-disabled').attr('aria-disabled', 'true');
      const childSection = a.next();

      if (childSection.is('ul.is-open')) {
        $('a', childSection).addClass('is-disabled').attr('aria-disabled', 'true');
        $('ul', a.parent()).addClass('is-disabled');
      }
    }

    // ParentCount 'aria-level' to the node's level depth
    parentCount = a.parentsUntil(this.element, 'ul').length - 1;
    a.attr('aria-level', parentCount + 1);

    // SSet the current tree item node position relative to its aria-setsize
    const posinset = a.parent().index();
    a.attr('aria-posinset', posinset + 1);

    // Set the current tree item aria-setsize
    const listCount = a.closest('li').siblings().addBack().length;
    a.attr('aria-setsize', listCount);

    // Set the current tree item node expansion state
    if (a.next('ul').children().length > 0) {
      a.attr('aria-expanded', a.next().hasClass('is-open') ? 'true' : 'false');
    }

    // Adds role=group' to all subnodes
    const subNode = a.next();

    // Inject Icons
    const text = a.contents().filter(function () {
      return !$(this).is('.tree-badge');// Do not include badge text
    }).text();

    a.text('');
    if (a.children('svg.icon-tree').length === 0) {
      a.prepend($.createIcon({ icon: 'tree-node', classes: ['icon-tree'] }));

      if (this.settings.useStepUI) {
        a.prepend($.createIcon({ icon: alertIcon, classes: ['step-alert', `icon-${alertIcon}`] }));
      }
    }

    // Inject checkbox
    if (this.isMultiselect && !this.settings.hideCheckboxes) {
      a.append('<span class="tree-checkbox"></span>');
    }

    // Inject badge
    if (badgeData && !badgeData.remove) {
      badge.text = '';

      if (typeof badgeData.text !== 'undefined') {
        badge.text = badgeData.text.toString();
        badge.elem.html(badge.text);
        if (badge.text.length === 1) {
          badge.elem.addClass('round');
        }
      }

      let badgeStyle = '';
      if (/info|good|error|alert|pending/i.test(badgeData.type)) {
        badge.elem.addClass(badgeData.type);
      } else if (badgeData.type && badgeData.type.charAt(0) === '#' && badgeData.type.length === 7) {
        badgeStyle = `background-color: ${badgeData.type} !important;`;
      }
      if (badgeData.backColor) {
        badgeStyle = `background-color: ${badgeData.backColor} !important;`;
      }
      if (badgeData.foreColor) {
        badgeStyle += `color: ${badgeData.foreColor} !important;`;
      }

      badge.elem.attr('style', badgeStyle);

      if (badge.elem.text() !== '') {
        a.append(badge.elem);
      }
      if (badgeData.type && badgeData.type.indexOf('pending') !== -1) {
        badge.elem.text('');
      }
    }

    a.append($('<span class="tree-text"></span>').text(text));

    if (a.is('[class^="icon"]')) {
      // CreateIconPath
      this.setTreeIcon(a.find('svg.icon-tree'), a.attr('class'));
    }

    if (subNode.is('ul')) {
      subNode.attr('role', 'group').parent().addClass('folder');
      this.setTreeIcon(a.find('svg.icon-tree'), subNode.hasClass('is-open') ? this.settings.folderIconOpen : this.settings.folderIconClosed);

      if (a.attr('class') && a.attr('class').indexOf('open') === -1 && a.attr('class').indexOf('closed') === -1) {
        a.attr('class', isDisabled ? 'is-disabled' : '');
        this.setTreeIcon(a.find('svg.icon-tree'), subNode.hasClass('is-open') ? this.settings.folderIconOpen : this.settings.folderIconClosed);
      }

      if (a.is('[class^="icon"]')) {
        this.setTreeIcon(a.find('svg.icon-tree'), subNode.hasClass('is-open') ?
          a.attr('class') : a.attr('class').replace('open', 'closed'));
      }
    }

    a.addClass('hide-focus');
    a.hideFocus();
  },

  /**
   * Sets the correct icon to use on a particular SVG element.
   * @private
   * @param {Object} svg an SVG element reference wrapped in a jQuery object
   * @param {String} icon the ID of a Soho Icon type.
   * @returns {void}
   */
  setTreeIcon(svg, icon) {
    // Replace all "icon-", "hide-focus", "\s? - all spaces if any" with nothing
    const iconStr = icon.replace(/#?icon-|hide-focus|\s?/gi, '');
    svg.changeIcon(iconStr);
  },

  /**
   * Expands a collection of tree nodes.
   * @param {Object} nodes - a jQuery-wrapped collection of tree node elements.
   If left undefined, this will automatically use all `ul[role=group]` elements.
   * @returns {void}
   */
  expandAll(nodes) {
    const self = this;
    nodes = nodes || this.element.find('ul[role=group]');

    nodes.each(function () {
      const node = $(this);
      node.addClass('is-open');
      self.setTreeIcon(node.prev('a').find('svg.icon-tree'), self.settings.folderIconOpen);

      if (node.prev('a').is('[class^="icon"]')) {
        self.setTreeIcon(node.prev('svg.icon-tree'), node.prev('a').attr('class'));
      }
    });
  },

  /**
   * Collapses a collection of tree nodes.
   * @param {Object} nodes - a jQuery-wrapped collection of tree node elements.
   If left undefined, this will automatically use all `ul[role=group]` elements.
   * @returns {void}
   */
  collapseAll(nodes) {
    const self = this;
    nodes = nodes || this.element.find('ul[role=group]');

    nodes.each(function () {
      const node = $(this);
      node.removeClass('is-open');
      self.setTreeIcon(node.prev('a').find('svg.icon-tree'), self.settings.folderIconClosed);

      if (node.prev('a').is('[class^="icon"]')) {
        self.setTreeIcon(node.prev('a').find('svg.icon-tree'), node.prev('a').attr('class')
          .replace('open', 'closed')
          .replace(' hide-focus', '')
          .replace(' is-selected', ''));
      }

      if (node.prev('a').is('[class^="icon"]')) {
        self.setTreeIcon(node.prev('svg.icon-tree'), node.prev('a').attr('class').replace('open', 'closed'));
      }
    });
  },

  /**
   * Check if an object is an instance of a jQuery object
   * @private
   * @param {Object} obj the object being tested.
   * @returns {Boolean} true if jQuery
   */
  isjQuery(obj) {
    // TODO: Move this to a Soho utility object?
    return (obj && (obj instanceof jQuery || obj.constructor.prototype.jquery));
  },

  /**
   * Selects a tree node specifically using it's ID attribute.
   * @param {String} id - the ID string to use.
   * @returns {void}
   */
  selectNodeById(id) {
    this.selectNodeByJquerySelector(`#${id}`);
  },

  /**
   * Selects a tree node by [jquery selector] -or- [jquery object]
   * @private
   * @param {Object} selector uses a string that represents a jQuery-wrapped
   element's ID attribute, or a jQuery-wrapped reference to the element itself.
   * @returns {void}
   */
  selectNodeByJquerySelector(selector) {
    const target = this.isjQuery(selector) ? selector : $(selector);
    if (target.length && !target.is('.is-disabled')) {
      const nodes = target.parentsUntil(this.element, 'ul[role=group]');
      this.expandAll(nodes);
      this.selectNode(target, true);
    }
  },

  /**
   * Deselects a tree node
   * @private
   * @param {Object} node - a jQuery-wrapped element reference to a tree node.
   * @param {Boolean} focus - if defined, causes the node to become focused.
   * @returns {void}
   */
  unSelectedNode(node, focus) {
    if (node.length === 0) {
      return;
    }

    const self = this;
    const aTags = $('a', this.element);

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

    setTimeout(() => {
      const jsonData = node.data('jsonData') || {};
      /**
      * Fires on un select node.
      *
      * @event unselected
      * @type {Object}
      * @property {Object} event - The jquery event object
      * @property {Object} data and node element
      */
      self.element.triggerHandler('unselected', { node, data: jsonData });
    }, 0);
  },

  /**
   * Selects a tree node
   * @private
   * @param {Object} node - a jQuery-wrapped element reference to a tree node.
   * @param {Boolean} focus - if defined, causes the node to become focused.
   * @returns {void}
   */
  selectNode(node, focus) {
    const self = this;

    if (node.length === 0) {
      return;
    }

    // Possibly Call the onBeforeSelect
    let result;
    if (typeof self.settings.onBeforeSelect === 'function') {
      result = self.settings.onBeforeSelect(node);
      if (result && result.done && typeof result.done === 'function') { // A promise is returned
        result.done((continueSelectNode) => {
          if (continueSelectNode) {
            self.selectNodeFinish(node, focus);
          }
        });
      } else if (result) { // Boolean is returned instead of a promise
        self.selectNodeFinish(node, focus);
      }
    } else { // No Callback specified
      self.selectNodeFinish(node, focus);
    }
  },

  /**
   * ?
   * @private
   * @param {Object} node - a jQuery-wrapped element reference to a tree node.
   * @param {Boolean} focus - if defined, causes the node to become focused.
   * @returns {void}
   */
  selectNodeFinish(node, focus) {
    const self = this;
    const aTags = $('a', this.element);
    aTags.attr('tabindex', '-1');
    node.attr('tabindex', '0');

    if (this.isMultiselect) {
      $('a:not(.is-disabled)', node.parent())
        .attr('aria-selected', 'true').parent().addClass('is-selected');
    } else {
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

    setTimeout(() => {
      const jsonData = node.data('jsonData') || {};
      /**
      * Fires on select node.
      *
      * @event selected
      * @type {Object}
      * @property {Object} event - The jquery event object
      * @property {Object} data and node element
      */
      self.element.triggerHandler('selected', { node, data: jsonData });
    }, 0);
  },

  /**
   * Deselects a tree node
   * @private
   * @param {Object} node - a jQuery-wrapped element reference to a tree node.
   * @returns {void}
   */
  setNodeStatus(node) {
    const self = this;
    const data = node.data('jsonData');
    let nodes;

    // Not multiselect
    if (!this.isMultiselect) {
      node.removeClass('is-selected is-partial');
      if (data && data.selected) {
        node.addClass('is-selected');
      }
      return;
    }

    const setStatus = function (thisNodes, isFirstSkipped) {
      thisNodes.each(function () {
        const thisNode = $('a:first', this);
        const parent = thisNode.parent();
        const status = self.getSelectedStatus(thisNode, isFirstSkipped);

        if (status === 'mixed') {
          parent.removeClass('is-selected is-partial').addClass('is-partial');
        } else if (status) {
          parent.removeClass('is-selected is-partial').addClass('is-selected');
        } else {
          parent.removeClass('is-selected is-partial');
        }
        self.syncNode(thisNode);
      });
    };

    // Multiselect
    let isFirstSkipped = false;
    nodes = node.parent().find('li.folder');
    setStatus(nodes, isFirstSkipped);

    isFirstSkipped = !(!nodes.length && data && !data.selected);
    nodes = node.parentsUntil(this.element, 'li.folder');
    setStatus(nodes, isFirstSkipped);
  },

  /**
   * Get's a tree node's current 'selected' status
   * @private
   * @param {Object} node - a jQuery-wrapped element reference to a tree node.
   * @param {Boolean} isFirstSkipped - ?
   * @returns {Boolean} status as true|false|'mixed'
   */
  getSelectedStatus(node, isFirstSkipped) {
    let total = 0;
    let selected = 0;
    let unselected = 0;
    let data;

    node.parent().find('a').each(function (i) {
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

    let status;
    if (total === selected) {
      status = true;
    } else if (total === unselected) {
      status = false;
    } else {
      status = 'mixed';
    }
    return status;
  },

  /**
   * Changes a node's selected status to its opposite form.
   * @private
   * @param {Object} node - a jQuery-wrapped element reference to a tree node.
   * @param {Boolean} isFirstSkipped - ?
   * @returns {void}
   */
  toggleNode(node) {
    const next = node.next();
    const self = this;
    let result;
    if (next.is('ul[role="group"]')) {
      if (next.hasClass('is-open')) {
        if (typeof self.settings.onCollapse === 'function') {
          result = self.settings.onCollapse(node);
          if (result && result.done && typeof result.done === 'function') { // A promise is returned
            result.done((continueSelectNode) => {
              if (continueSelectNode) {
                self.selectNodeFinish(node, focus);
              }
            });
          } else if (result) { // Boolean is returned instead of a promise
            self.selectNodeFinish(node, focus);
          }
        } else { // No Callback specified
          self.selectNodeFinish(node, focus);
        }

        self.setTreeIcon(node.closest('.folder').removeClass('is-open').end().find('svg.icon-tree'), self.settings.folderIconClosed);

        if (node.closest('.folder a').is('[class^="icon"]')) {
          self.setTreeIcon(
            node.closest('.folder a').find('svg.icon-tree'),
            node.closest('.folder a').attr('class')
              .replace('open', 'closed')
              .replace(' hide-focus', '')
              .replace(' is-selected', '')
          );
        }

        self.isAnimating = true;

        if (!self.isMultiselect) {
          self.unSelectedNode(node.parent().find('li.is-selected'), false);
          node.removeClass('is-selected');
        }

        next.one('animateclosedcomplete', () => {
          next.removeClass('is-open');
          self.isAnimating = false;
        }).animateClosed();

        node.attr('aria-expanded', node.attr('aria-expanded') !== 'true');
      } else {
        if (typeof self.settings.onExpand === 'function') {
          result = self.settings.onExpand(node);
          if (result && result.done && typeof result.done === 'function') { // A promise is returned
            result.done((continueSelectNode) => {
              if (continueSelectNode) {
                self.selectNodeFinish(node, focus);
              }
            });
          } else if (result) { // Boolean is returned instead of a promise
            self.selectNodeFinish(node, focus);
          }
        } else { // No Callback specified
          self.selectNodeFinish(node, focus);
        }

        const nodeData = node.data('jsonData');

        if (self.settings.source && nodeData.children && nodeData.children.length === 0) {
          const response = function (nodes) {
            const id = nodeData.id;
            const elem = self.findById(id);

            // Add DB and UI nodes
            elem.children = nodes;
            self.addChildNodes(elem, node.parent());
            node.removeClass('is-loading');
            self.loading = false;

            // Open
            self.accessNode(next, node);

            // Sync data on node
            nodeData.children = nodes;
            node.data('jsonData', nodeData);
            self.selectNode(node, true);
            self.initSelected();
          };

          const args = { node, data: node.data('jsonData') };
          self.settings.source(args, response);
          node.addClass('is-loading');
          self.loading = true;

          return;
        }
        self.accessNode(next, node);
      }
    }
  },

  // Access the node
  accessNode(next, node) {
    const self = this;

    self.setTreeIcon(node.closest('.folder').addClass('is-open').end().find('svg.icon-tree'), self.settings.folderIconOpen);

    if (node.is('[class^="icon"]')) {
      self.setTreeIcon(node.find('svg.icon-tree'), node.attr('class').replace(' hide-focus', '').replace(' is-selected', ''));
    }

    self.isAnimating = true;

    next.one('animateopencomplete', () => {
      self.isAnimating = false;
    }).addClass('is-open').css('height', 0).animateOpen();
    node.attr('aria-expanded', node.attr('aria-expanded') !== 'true');
  },

  openNode(nextTarget, nodeTarget) {
    const self = this;
    const nodeData = nodeTarget.data('jsonData');

    if (self.settings.source && nodeData.children && nodeData.children.length === 0) {
      const response = function (nodes) {
        const id = nodeData.id;
        const elem = self.findById(id);

        // Add DB and UI nodes
        elem.children = nodes;
        self.addChildNodes(elem, nodeTarget.parent());
        nodeTarget.removeClass('is-loading');
        self.loading = false;

        // Open
        self.accessNode(nextTarget, nodeTarget);

        // Sync data on node
        nodeData.children = nodes;
        nodeTarget.data('jsonData', nodeData);
        self.selectNode(nodeTarget, true);
        self.initSelected();
      };

      const args = { node: nodeTarget, data: nodeTarget.data('jsonData') };
      self.settings.source(args, response);
      nodeTarget.addClass('is-loading');
      self.loading = true;

      return;
    }
    self.accessNode(nextTarget, nodeTarget);
  },

  closeNode(nextTarget, nodeTarget) {
    const self = this;
    self.setTreeIcon(nodeTarget.closest('.folder').removeClass('is-open').end().find('svg.icon-tree'), self.settings.folderIconClosed);

    if (nodeTarget.closest('.folder a').is('[class^="icon"]')) {
      self.setTreeIcon(
        nodeTarget.closest('.folder a').find('svg.icon-tree'),
        nodeTarget.closest('.folder a').attr('class')
          .replace('open', 'closed')
          .replace(' hide-focus', '')
          .replace(' is-selected', '')
      );
    }

    self.isAnimating = true;

    if (!self.isMultiselect) {
      self.unSelectedNode(nodeTarget.parent().find('li.is-selected'), false);
      nodeTarget.removeClass('is-selected');
    }

    nextTarget.one('animateclosedcomplete', () => {
      nextTarget.removeClass('is-open');
      self.isAnimating = false;
    }).animateClosed();

    nodeTarget.attr('aria-expanded', nodeTarget.attr('aria-expanded') !== 'true');
  },

  // Setup event handlers
  setupEvents() {
    const self = this;
    self.element.on('updated.tree', (e, newSettings) => {
      self.updated(newSettings);
      self.initTree();
    });
  },

  // Handle Keyboard Navigation
  handleKeys() {
    // Key Behavior as per: http://access.aol.com/dhtml-style-guide-working-group/#treeview
    const self = this;
    // On click give clicked element 0 tabindex and 'aria-selected=true', resets all other links
    this.element.on('click.tree', 'a:not(.is-clone)', function (e) {
      const target = $(this);
      const parent = target.parent();
      if (!target.is('.is-disabled, .is-loading')) {
        if (self.isMultiselect) {
          if ($(e.target).is('.icon') && parent.is('.folder')) {
            self.toggleNode(target);
          } else if (parent.is('.is-selected, .is-partial')) {
            self.unSelectedNode(target, true);
          } else {
            self.selectNode(target, true);
          }
        } else {
          self.selectNode(target, true);
          self.toggleNode(target);
        }
        e.stopPropagation();
      }
      return false; // Prevent Click from Going to Top
    });

    this.element
    // Focus on "a" elements
      .on('focus.tree', 'a', function () {
        const target = $(this);
        if (parseInt(target.attr('aria-level'), 10) === 0 && parseInt(target.attr('aria-posinset'), 10) === 1) {
          // First element if disabled
          if (target.hasClass('is-disabled')) {
            const e = $.Event('keydown.tree');
            e.keyCode = 40; // move down
            target.trigger(e);
            return;// eslint-disable-line
          }
        }
      });

    // Handle Up/Down Arrow Keys and Space
    this.element.on('keydown.tree', 'a', function (e) {
      const charCode = e.charCode || e.keyCode;
      const target = $(this);
      let next;
      let prev;

      if (self.isAnimating) {
        return;
      }

      // Down arrow
      if (charCode === 40) {
        const nextNode = self.getNextNode(target);
        self.setFocus(nextNode);
      }

      // Up arrow,
      if (charCode === 38) {
        const prevNode = self.getPreviousNode(target);
        self.setFocus(prevNode);
      }

      // Space
      if (e.keyCode === 32) {
        target.trigger('click.tree');
      }

      // Left arrow
      if (charCode === 37) {
        if (Locale.isRTL()) {
          if (target.next().hasClass('is-open')) {
            prev = target.next().find('a:first');
            self.setFocus(prev);
          } else {
            self.toggleNode(target);
          }
        } else if (target.next().hasClass('is-open')) {
          self.toggleNode(target);
        } else {
          prev = target.closest('.folder').find('a:first');
          self.setFocus(prev);
        }
        e.stopPropagation();
        return false;// eslint-disable-line
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
        } else if (target.next().hasClass('is-open')) {
          next = target.next().find('a:first');
          self.setFocus(next);
        } else {
          self.toggleNode(target);
          self.setFocus(target);
        }
        e.stopPropagation();
        return false;// eslint-disable-line
      }

      // Home  (fn-right on mac)
      if (charCode === 36) {
        next = self.element.find('a:first:visible');
        self.setFocus(next);
      }

      // End (fn-right on mac)
      if (charCode === 35) {
        next = self.element.find('a:last:visible');
        self.setFocus(next);
      }
    });

    // Handle Left/Right Arrow Keys
    // eslint-disable-next-line
    this.element.on('keypress.tree', 'a', function (e) {
      const charCode = e.charCode || e.keyCode;
      const target = $(this);

      if ((charCode >= 37 && charCode <= 40) || charCode === 32) {
        e.stopPropagation();
        return false;
      }

      // Printable Chars Jump to first high level node with it...
      if (e.which !== 0) {
        // eslint-disable-next-line
        target.closest('li').nextAll().find('a:visible').each(function () {
          const node = $(this);
          const first = node.text().substr(0, 1).toLowerCase();
          const term = String.fromCharCode(e.which).toLowerCase();

          if (first === term) {
            self.setFocus(node);
            return false;
          }
        });
      }
    });
  },

  /**
   * Handle Loading JSON.
   * @param {Object} dataset - to load.
   * @returns {void}
   */
  loadData(dataset) {// eslint-disable-line
    if (!dataset) {
      return -1;
    }
    const self = this;
    self.element.empty();

    self.loading = true;
    for (let i = 0, l = dataset.length; i < l; i++) {
      self.addNode(dataset[i], 'bottom');
    }
    self.loading = false;

    self.syncDataset(self.element);
    self.initSelected();
    self.focusFirst();
    self.attachMenu(self.settings.menuId);
    self.createSortable();
  },

  // Functions to Handle Internal Data Store
  addToDataset(node, location) {
    let elem;

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

    return !(node.parent && !elem);
  },

  // Find the Node (Dataset) By Id
  findById(id, source) {
    const self = this;

    if (!source) {
      source = this.settings.dataset;
    }

    /* eslint-disable guard-for-in */
    /* eslint-disable no-restricted-syntax */
    for (const key in source) {
      const item = source[key];
      if (item.id === id) {
        return item;
      }

      if (item.children) {
        const subresult = self.findById(id, item.children);

        if (subresult) {
          return subresult;
        }
      }
    }
    /* eslint-enable no-restricted-syntax */
    /* eslint-enable guard-for-in */
    return null;
  },

  // Get node by ID if selected
  getNodeByIdIfSelected(id, source) {
    const node = this.findById(id, source);
    return (node && node.selected) ? node : null;
  },

  /**
   * Get selected nodes.
   * @returns {Object} selected nodes
   */
  getSelectedNodes() {
    let node;
    let data;
    const selected = [];

    $('li.is-selected', this.element).each(function () {
      node = $('a:first', this);
      data = node.data('jsonData');
      selected.push({ node, data });
    });
    return selected;
  },

  getNextNode(target) {
    let next = target.parent().next().find('a:first');
    const subTarget = target.next();

    // Move Into Children
    if (subTarget.is('ul.is-open')) {
      next = subTarget.find('a:first');
    }

    // Skip disabled
    if (next.hasClass('is-disabled')) {
      next = next.parent().next().find('a:first');
    }

    // Bottom of a group..{l=1000: max folders to be deep }
    if (next.length === 0) {
      for (let i = 0, l = 1000, closest = target; i < l; i++) {
        closest = closest.parent().closest('.folder');
        next = closest.next().find('a:first');
        if (next.length) {
          break;
        }
      }
    }

    // Another check for disabled
    if (next.hasClass('is-disabled')) {
      next = this.getNextNode(next);
    }

    return next;
  },

  getPreviousNode(target) {
    let prev = target.parent().prev().find('a:first');
    let subTarget = prev.parent();

    // Move into children at bottom
    if (subTarget.is('.folder.is-open') &&
        subTarget.find('ul.is-open a').length &&
        !subTarget.find('ul.is-disabled').length) {
      prev = subTarget.find('ul.is-open a:last');
    }

    // Skip disabled
    if (prev.hasClass('is-disabled')) {
      prev = prev.parent().prev().find('a:first');

      // Another check if get to prev open folder
      subTarget = prev.parent();
      if (subTarget.is('.folder.is-open') &&
          subTarget.find('ul.is-open a').length &&
          !subTarget.find('ul.is-disabled').length) {
        prev = subTarget.find('ul.is-open a:last');
      }
    }

    // Top of a group
    if (prev.length === 0) {
      prev = target.closest('ul').prev('a');
    }

    // Another check for disabled
    if (prev.hasClass('is-disabled')) {
      prev = this.getPreviousNode(prev);
    }

    return prev;
  },

  // Sync the tree with the underlying dataset
  syncDataset(node) {
    const json = [];
    const self = this;

    node.children('li').each(function () {
      const elem = $(this);
      const tag = elem.find('a:first');

      const entry = self.syncNode(tag);
      json.push(entry);
    });

    this.settings.dataset = json;
  },

  // Sync a node with its dataset 'record'
  syncNode(node) {
    let entry = {};
    const self = this;
    const jsonData = node.data('jsonData');

    entry.node = node;
    entry.id = node.attr('id');
    entry.text = node.find('.tree-text').text();

    if (node.hasClass('is-open')) {
      entry.open = true;
    }

    if (node.attr('href')) {
      entry.href = node.attr('href');
    }

    if (node.parent().is('.is-selected')) {
      entry.selected = true;
    }

    // Icon
    const clazz = node.attr('class');
    if (clazz && clazz.indexOf('icon') > -1) {
      entry.icon = node.attr('class');
    }

    if (node.next().is('ul')) {
      const ul = node.next();
      entry.children = [];

      ul.children('li').each(function () {
        const elem = $(this);
        const tag = elem.find('a:first');

        entry.children.push(self.syncNode(tag));
      });
    }

    if (jsonData) {
      delete jsonData.selected;
      entry = $.extend({}, jsonData, entry);
    }

    node.data('jsonData', entry);
    return entry;
  },

  /**
   * Add a node and all its related markup.
   * @param {Object} nodeData to add.
   * @param {Object} location in tree.
   * @returns {Object} li added
   */
  addNode(nodeData, location) {
    let li = $('<li></li>');
    const a = $('<a href="#"></a>').appendTo(li);
    const badgeAttr = typeof nodeData.badge === 'object' ? JSON.stringify(nodeData.badge) : nodeData.badge;

    location = (!location ? 'bottom' : location); // supports button or top or jquery node

    a.attr({
      id: nodeData.id,
      href: nodeData.href,
      'data-badge': badgeAttr,
      'data-alert-icon': nodeData.alertIcon
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

    // Handle Location
    let found = this.loading ? true : this.addToDataset(nodeData, location);

    if (nodeData.parent instanceof jQuery) {
      found = true;
    }

    if (location instanceof jQuery &&
      (!nodeData.parent || !found) && !(nodeData.parent instanceof jQuery)) {
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
        li = this.element.find(`#${nodeData.parent}`).parent();

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
      nodeData.node = li.find(`ul li a#${nodeData.id}`);
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

  // Add a node to an exiting node, making it a folder if need be
  addAsChild(nodeData, li) {
    let ul = li.find('ul').first();
    if (ul.length === 0) {
      ul = $('<ul></ul>').appendTo(li);
      ul.addClass('folder');
    }

    ul.addClass(nodeData.open ? 'is-open' : '');
    this.decorateNode(li.find('a').first());

    nodeData.parent = '';
    this.addNode(nodeData, ul);
  },

  // Add the children for the specified node element
  addChildNodes(nodeData, li) {
    const self = this;
    let ul = li.find('ul');

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
      for (let i = 0, l = nodeData.children.length; i < l; i++) {
        const elem = nodeData.children[i];
        self.addNode(elem, ul);
      }
    }
  },

  // Check for true value
  isTrue(v) {
    return (typeof v !== 'undefined' && v !== null && ((typeof v === 'boolean' && v === true) || (typeof v === 'string' && v.toLowerCase() === 'true')));
  },

  // Check for false value
  isFalse(v) {
    return (typeof v !== 'undefined' && v !== null && ((typeof v === 'boolean' && v === false) || (typeof v === 'string' && v.toLowerCase() === 'false')));
  },

  /**
   * Update fx rename a node.
   * @param {Object} nodeData to update.
   * @returns {void}
   */
  updateNode(nodeData) {
    // Find the node in the dataset and ui and sync it
    let elem = this.findById(nodeData.id);

    // Passed in the node element
    if (nodeData.node) {
      elem = {};
      elem.node = nodeData.node;
    }

    if (!elem) {
      return;
    }

    const parent = elem.node.parent();
    const isDisabled = this.isTrue(nodeData.disabled) || this.isFalse(nodeData.enabled);
    const isEnabled = this.isTrue(nodeData.enabled) || this.isFalse(nodeData.disabled);

    // Update badge
    if (nodeData.badge) {
      let badge = elem.node.find('.tree-badge:first');
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
          } else if (nodeData.type && nodeData.badge.type.charAt(0) === '#' && nodeData.badge.type.length === 7) {
            badge.elem.css('background-color', nodeData.badge.type);
          }

          if (nodeData.badge.type.indexOf('pending') !== -1) {
            badge.text('');
          }
        }
        elem.badge = nodeData.badge;

        // Remove badge
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
      this.setTreeIcon(elem.node.find('svg.icon-tree').first(), nodeData.icon);
      elem.icon = nodeData.icon;
    }

    if (isDisabled) {
      elem.node.addClass('is-disabled').attr('aria-disabled', 'true');

      if (parent.is('.folder.is-open')) {
        $('a, ul[role=group]', parent).addClass('is-disabled').attr('aria-disabled', 'true');
      }
    }

    if (isEnabled) {
      const isParentsDisabled = elem.node.parentsUntil(this.element, 'ul[role=group].is-disabled').length > 0;

      if (!isParentsDisabled) {
        elem.node.removeClass('is-disabled').removeAttr('aria-disabled');

        if (parent.is('.folder.is-open')) {
          $('a, ul[role=group]', parent).removeClass('is-disabled').removeAttr('aria-disabled');
        }
      }
    }

    if (nodeData.node) {
      this.syncDataset(this.element);
    }

    if (nodeData.children) {
      if (nodeData.children.length) {
        this.addChildNodes(nodeData, parent);
      } else {
        this.removeChildren(nodeData, parent);
      }
    }
  },

  // Performs the usual Boolean coercion with the exception of
  // the strings "false" (case insensitive) and "0"
  parseBool(b) {
    return !(/^(false|0)$/i).test(b) && !!b;
  },

  // Delete children nodes
  removeChildren(nodeData, li) {
    const ul = li.find('ul');

    this.setTreeIcon(li.find('svg.icon-tree').first(), (nodeData.icon || 'icon-tree-node'));
    li.removeClass('folder is-open');
    ul.remove();
  },

  /**
   * Delete a node from the dataset or tree.
   * @param {Object} nodeData to delete.
   * @returns {void}
   */
  removeNode(nodeData) {
    let elem = this.findById(nodeData.id);

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

  // Attach Context Menus
  attachMenu(menuId) {
    const self = this;

    if (!menuId) {
      return;
    }

    this.element.off('contextmenu.tree').on('contextmenu.tree', 'a', function (e) {
      const node = $(this);
      e.preventDefault();
      $(e.currentTarget).popupmenu({ menuId, eventObj: e, trigger: 'immediate', attachToBody: true }).off('selected').on('selected', (event, args) => {
        /**
        * Fires when the menu item select.
        *
        * @event menuselect
        * @type {Object}
        * @property {Object} event - The jquery event object
        * @property {Object} data for node element, item
        */
        self.element.triggerHandler('menuselect', { node, item: args });
      });

      /**
      * Fires when the menu open.
      * menu options - use it to update the menu as needed
      * @event menuopen
      * @type {Object}
      * @property {Object} event - The jquery event object
      * @property {Object} data for node element, menu
      */
      self.element.triggerHandler('menuopen', { menu: $(`#${menuId}`), node });
      return false;
    });
  },

  // Create sortable
  createSortable() {
    if (!this.settings.sortable) {
      return;
    }

    const self = this;
    let clone;
    let interval;
    let doDrag;

    self.targetArrow = self.element.prev('.tree-drag-target-arrow');
    self.linkSelector = 'a:not(.is-dragging-clone, .is-disabled)';

    if (!self.targetArrow.length) {
      $('<div class="tree-drag-target-arrow"></div>').insertBefore(self.element);
      self.targetArrow = self.element.prev('.tree-drag-target-arrow');
    }

    function isReady() {
      // Make sure all dynamic nodes sync
      if (!self.loading) {
        clearInterval(interval);

        $(self.linkSelector, self.element).each(function () {
          const a = $(this);

          // Don't drag with folder icon, save for toggle nodes
          a.on('mousedown.tree', (e) => {
            e.preventDefault();

            if (e.which === 3) {
              doDrag = false;
            } else {
              doDrag = $(e.target).is('.icon') ? !a.parent().is('.folder') : true;
            }
          })

            // Invoke drag
            .drag({
              clone: true,
              cloneAppendTo: a.closest('li'),
              clonePosIsFixed: true
            })

            // Drag start =======================================
            .on('dragstart.tree', (e, pos, thisClone) => {
              if (!thisClone || !doDrag) {
                a.removeClass('is-dragging');
                if (thisClone) {
                  thisClone.remove();
                }
                return;
              }
              clone = thisClone;
              clone.removeAttr('id').addClass('is-dragging-clone');
              clone.find('.tree-checkbox, .tree-badge').remove();

              self.sortable = {
                // Do not use index from each loop, get updated index on drag start
                startIndex: $(self.linkSelector, self.element).index(a),
                startNode: a,
                startIcon: $('svg.icon-tree', a).getIconName(),
                startUl: a.closest('ul'),
                startFolderNode: a.closest('ul').prev('a'),
                startWidth: a.outerWidth()
              };

              e.preventDefault();
              e.stopImmediatePropagation();
            })

            // While dragging ===================================
            .on('drag.tree', (e, pos) => {
              if (!clone) {
                return;
              }
              clone[0].style.left = `${pos.left}px`;
              clone[0].style.top = `${pos.top}px`;
              clone[0].style.opacity = '1';
              self.setDragOver(clone, pos);
            })

            // Drag end =========================================
            .on('dragend.tree', (e, pos) => {
              self.targetArrow.hide();
              $(self.linkSelector, self.element).removeClass('is-over');

              if (!clone || !self.sortable.overDirection) {
                return;
              }
              clone[0].style.left = `${pos.left}px`;
              clone[0].style.top = `${pos.top}px`;

              const start = self.sortable.startNode.parent();
              const end = self.sortable.overNode.parent();

              // Over
              if (self.sortable.overDirection === 'over') {
                if (!end.is('.folder')) {
                  self.convertFileToFolder(self.sortable.overNode);
                }
                $('ul:first', end).append(start);
                if (!end.is('.is-open')) {
                  self.toggleNode(self.sortable.overNode);
                }
              } else if (self.sortable.overDirection === 'up') {
                // Up
                start.insertBefore(end);
              } else if (self.sortable.overDirection === 'down') {
                // Down
                if (end.is('.is-open')) {
                  $('ul:first', end).prepend(start);
                } else {
                  start.insertAfter(end);
                }
              }

              // Restore file type
              if ($('li', self.sortable.startUl).length === 0 &&
                !!self.sortable.startFolderNode.data('oldData') &&
                  self.sortable.startFolderNode.data('oldData').type === 'file') {
                self.convertFolderToFile(self.sortable.startFolderNode);
              }

              // Fix: On windows 10 with IE-11 icons disappears
              if (self.isIe11) {
                start.find('.icon-tree').each(function () {
                  const svg = $(this);
                  self.setTreeIcon(svg, svg.find('use').attr('xlink:href'));
                });
              }

              // Sync dataset and ui
              self.syncDataset(self.element);
              if (self.isMultiselect) {
                self.initSelected();
              }
            });
        });
      }
    }
    // Wait for make sure all dynamic nodes sync
    interval = setInterval(isReady, 10);
  },

  // Set actions while drag over
  setDragOver(clone, pos) {
    const self = this;
    const treeRec = self.element[0].getBoundingClientRect();
    let extra = 20;
    let exMargin;
    let isParentsStartNode;
    let isBeforeStart;
    let isAfterSttart;
    let li;
    let a;
    let ul;
    let links;
    let rec;
    let left;
    let top;
    let direction;
    let doAction;

    // Set as out of range
    const outOfRange = function () {
      self.sortable.overNode = null;
      self.sortable.overIndex = null;
      self.sortable.overDirection = null;

      self.targetArrow.hide();
      self.setTreeIcon($('svg.icon-tree', clone), 'icon-cancel');
    };

    // Moving inside tree
    if (pos.top > (treeRec.top - extra) &&
        pos.top < (treeRec.bottom + extra) &&
        pos.left > (treeRec.left - extra - self.sortable.startWidth) &&
        pos.left < (treeRec.left + treeRec.height + extra)) {
      links = $(self.linkSelector, self.element);
      extra = 2;

      for (let i = 0, l = links.length; i < l; i++) {
        direction = null;
        rec = links[i].getBoundingClientRect();

        // Moving on/around node range
        if (pos.top > rec.top - extra && pos.top < rec.bottom + extra) {
          a = $(links[i]);

          // Moving on/around node has parents as same node need to rearrange
          // Cannot rearrange parents to child
          isParentsStartNode = !!a.parentsUntil(self.element, '.folder')
            .filter(function () {
              return $('a:first', this).is(self.sortable.startNode);
            }).length;
          if (isParentsStartNode) {
            outOfRange();
            continue;
          }

          li = a.parent();
          left = rec.left;
          ul = a.closest('ul');
          exMargin = parseInt(li[0].style.marginTop, 10) > 0 ? 2 : 0;
          isBeforeStart = ((i - 1) === self.sortable.startIndex && ul.is(self.sortable.startUl));
          isAfterSttart = ((i + 1) === self.sortable.startIndex && ul.is(self.sortable.startUl));
          links.removeClass('is-over');

          // Apply actions
          /* eslint-disable no-loop-func */
          doAction = function () {
            if (!direction) {
              outOfRange();
              return;
            }

            // Reset icon
            self.setTreeIcon($('svg.icon-tree', clone), self.sortable.startIcon);

            // Over
            if (direction === 'over') {
              self.targetArrow.hide();
              if (!a.is('.is-disabled')) {
                a.addClass('is-over');
              }
            } else {
              // Up -or- Down
              links.removeClass('is-over');
              top = (direction === 'up') ?
                (rec.top - 1.5 - (li.is('.is-active') ? 3 : 0)) :
                (rec.bottom + (li.next().is('.is-active') ? -1 : 1.5) + exMargin);
              self.targetArrow[0].style.left = `${left}px`;
              self.targetArrow[0].style.top = `${top}px`;
              self.targetArrow.show();
            }

            // Set changes
            self.sortable.overNode = a;
            self.sortable.overIndex = i;
            self.sortable.overDirection = direction;
          };
          /* eslint-disable no-loop-func */

          // Set moveing directions
          if (i !== self.sortable.startIndex) {
            // If hover on link
            if (pos.left > rec.left - extra - self.sortable.startWidth &&
              pos.left < rec.right + extra) {
              if (!isBeforeStart && pos.top < rec.top) {
                direction = 'up';
              } else if (!isAfterSttart && pos.top > rec.top + (extra * 2)) {
                direction = 'down';
              } else {
                direction = 'over';
              }
            } else if (!isBeforeStart && pos.top < rec.top) {
              // Not hover on link
              direction = 'up';
            } else if (!isAfterSttart) {
              direction = 'down';
            }
          }
          doAction(direction);
        }
      }
    } else {
      // Out side from tree area
      outOfRange();
    }
  },

  // Convert file node to folder type
  convertFileToFolder(node) {
    const newFolder = $('<ul role="group"></ul>');
    const oldData = {
      icon: $('svg.icon-tree', node).getIconName(),
      type: 'file'
    };
    if (node.is('[class^="icon"]')) {
      const iconClass = node.attr('class').replace(' hide-focus', '').replace(' is-selected', '');
      oldData.iconClass = iconClass;
      node.removeClass(iconClass);
    }
    node.data('oldData', oldData);
    node.parent('li').addClass('folder').append(newFolder);
    this.setTreeIcon($('svg.icon-tree', node), this.settings.folderIconClosed);
  },

  // Convert folder node to file type
  convertFolderToFile(node) {
    const parent = node.parent('.folder');
    parent.removeClass('folder is-open');
    $('ul:first', parent).remove();
    if (parent.length) {
      this.setTreeIcon(
        $('svg.icon-tree', node),
        node.data('oldData') ? node.data('oldData').icon : 'tree-node'
      );
      if (node.data('oldData') && node.data('oldData').iconClass) {
        node.addClass(node.data('oldData').iconClass);
      }
      node.data('oldData', null);
    }
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {Object} The api
   */
  unbind() {
    if (this.settings.sortable) {
      this.element.find('a').each(function () {
        const a = $(this);
        const dragApi = a.data('drag');
        a.off('mousedown.tree');
        if (!!dragApi && !!dragApi.destroy) {
          dragApi.destroy();
        }
      });
      this.element.prev('.tree-drag-target-arrow').remove();
    }
    this.element.off('contextmenu.tree updated.tree click.tree focus.tree keydown.tree keypress.tree');

    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {Object} settings The settings to apply.
   * @returns {Object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, TREE_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
   * Destroy this component instance and remove the link from its base element.
   * @returns {void}
   */
  destroy() {
    this.unbind();
    this.element.empty();
    $.removeData(this.element[0], COMPONENT_NAME);
  },
};

export { Tree, COMPONENT_NAME };
