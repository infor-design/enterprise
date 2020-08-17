import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { Environment as env } from '../../utils/environment';
import { Locale } from '../locale/locale';

// Jquery Functions
import '../../utils/animations';

// The name of this component.
const COMPONENT_NAME = 'tree';

/**
* The tree Component displays a hierarchical list.
* @class Tree
* @constructor
*
* @param {object} element The component element.
* @param {object} [settings] The component settings.
* @param {array} [settings.dataset] Array of data objects to feed the template
* @param {array} [settings.dataset[index].children] Array of data objects as child nodes
* @param {null|function} [settings.source] Call back for getting the data asyncronously.
* @param {string} [settings.selectable = 'single'] 'single' or 'multiple'.
* @param {boolean} [settings.hideCheckboxes = false] Only applies when `selectable` is set to 'multiple'.
* @param {null|string} [settings.menuId] if defined, will be used to identify a Context Menu by ID attribute in which to add nodes.
* @param {boolean} [settings.useStepUI = false] if `true`, turns this tree instance into a "Stepped" tree.
* @param {string} [settings.folderIconOpen = 'open-folder']  the icon used when a tree folder node is open.
* @param {string} [settings.folderIconClosed = 'closed-folder'] the icon used when a tree folder node is closed.
* @param {boolean} [settings.sortable = false] if `true`, allows nodes to become sortable.
* @param {null|function} [settings.onBeforeSelect] If defined as a function, fires that function as a callback before the selection on a node occurs.
* @param {null|function} [settings.onExpand] If defined as a function, fires that function as a node is expanded.
* @param {null|function} [settings.onCollapse] If defined as a function, fires that function as a node is collapsed.
* @param {string} [settings.expandTarget = 'node'] 'node' or 'icon', if set to `icon` this will allows to toggle when clicking only the icon portion of the tree node.
* @param {boolean} [settings.useExpandTarget = false] if `true`, allows separate icon button to expand/collapse.
* @param {string} [settings.expandIconOpen = 'plusminus-folder-open'] the icon used for expand target icon button when a tree folder node is open.
* @param {string} [settings.expandIconClosed = 'plusminus-folder-closed'] the icon used for expand target icon button when a tree folder node is closed.
* @param {boolean} [settings.expandPlusminusRotate = true] if `true`, will rotate expand target plus-minus icon.
* @param {boolean} [settings.showChildrenCount = false] if `true`, allows show children count beside the node name text.
* @param {boolean} [settings.childrenAutoCount = true] if `true`, allows to auto count the children.
*/

const TREE_DEFAULTS = {
  dataset: null, // array of data objects
  source: null, // callback for data asyncronously
  selectable: 'single', // ['single'|'multiple']
  hideCheckboxes: false, // [true|false] -apply only with [selectable: 'multiple']
  menuId: null, // Context Menu to add to nodes
  useStepUI: false, // When using the UI as a stepped tree
  folderIconOpen: 'open-folder',
  folderIconClosed: 'closed-folder',
  sortable: false, // Allow nodes to be sortable
  onBeforeSelect: null,
  onExpand: null,
  onCollapse: null,
  expandTarget: 'node',
  useExpandTarget: false,
  expandIconOpen: 'plusminus-folder-open',
  expandIconClosed: 'plusminus-folder-closed',
  expandPlusminusRotate: true,
  showChildrenCount: false,
  childrenAutoCount: true
};

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
      this.syncDataset();
      this.initSelected();
      this.focusFirst();
      this.attachMenu(this.settings.menuId);
      this.createSortable();
      this.childrenCountInit();
    }
  },

  /**
   * Init Tree from ul, li, a markup structure in DOM
   * @private
  */
  initTree() {
    const self = this;
    const s = this.settings;
    const links = this.element.find('a');
    const selectableAttr = this.element.attr('data-selectable');

    if (s.useExpandTarget) {
      s.expandTarget = 'icon';
    }

    // Set attribute "data-selectable"
    s.selectable = ((typeof selectableAttr !== 'undefined') &&
     (selectableAttr.toLowerCase() === 'single' ||
       selectableAttr.toLowerCase() === 'multiple')) ?
      selectableAttr : s.selectable;

    // Set isMultiselect and checkboxes show/hide
    this.isMultiselect = s.selectable === 'multiple';
    s.hideCheckboxes = s.hideCheckboxes || !this.isMultiselect;

    this.element.addClass(this.isMultiselect ? ' is-multiselect' : '');

    links.each(function () {
      const a = $(this);
      self.decorateNode(a);
    });
  },

  /**
   * Init selected notes
   * @private
  */
  initSelected() {
    const listItems = [].slice.call(this.element[0].querySelectorAll('li'));
    listItems.forEach((li) => {
      li.setAttribute('role', 'none');
      this.setNodeStatus($(li.querySelector('a')));
    });
    this.syncDataset();
  },

  /**
   * Focus the first tree node
   * @private
   */
  focusFirst() {
    const a = this.element[0].querySelector('a');
    if (a) {
      a.setAttribute('tabindex', '0');
    }
  },

  /**
   * Set focus
   * @private
   * @param {object} node .
   * @returns {void}
   */
  setFocus(node) {
    node = this.isjQuery(node) ? node[0] : node;
    if (!node) {
      return;
    }
    node.focus();
    DOM.removeClass(node, 'hide-focus');
  },

  /**
   * From the LI, Read props and add stuff
   * @private
   * @param {object} a an anchor tag reference wrapped in a jQuery object.
   * @param {string} iconToSet icon for tree node.
   * @param {bool} hideCheckbox to show or hide checkbox for tree node.
   * @param {object} nodeData the data relative to given node.
   * @returns {void}
   */
  // Added parameters - To show check box and icon on demand for particular node
  decorateNode(a, iconToSet, hideCheckbox, nodeData) {
    a = this.isjQuery(a) ? a : $(a);

    let parentCount = 0;
    let badgeData = a[0].getAttribute('data-badge');
    const alertIcon = a[0].getAttribute('data-alert-icon');
    const isParentsDisabled = a.parentsUntil(this.element, 'ul[role=group].is-disabled').length > 0;
    const isDisabled = DOM.hasClass(a[0], 'is-disabled') || isParentsDisabled;

    if (typeof badgeData !== 'undefined') {
      badgeData = utils.parseSettings(a, 'data-badge');
    }

    // Set initial 'role', 'tabindex', and 'aria selected' on each link (except the first)
    a[0].setAttribute('role', 'treeitem');
    a[0].setAttribute('tabindex', '-1');
    a[0].setAttribute('aria-selected', 'false');

    // Add Aria disabled
    if (isDisabled) {
      DOM.addClass(a[0], 'is-disabled');
      a[0].setAttribute('aria-disabled', 'true');
      const childSection = a.next();

      if (childSection[0] && childSection[0].tagName.toLowerCase() === 'ul' && DOM.hasClass(childSection[0], 'is-open')) {
        const childLinks = [].slice.call(childSection[0].querySelectorAll('a'));
        childLinks.forEach((link) => {
          DOM.addClass(link, 'is-disabled');
          link.setAttribute('aria-disabled', 'true');
        });
        const parentUls = [].slice.call(a[0].parentNode.querySelectorAll('ul'));
        parentUls.forEach(ul => DOM.addClass(ul, 'is-disabled'));
      }
    }

    // ParentCount 'aria-level' to the node's level depth
    parentCount = a.parentsUntil(this.element, 'ul').length - 1;
    a[0].setAttribute('aria-level', parentCount + 1);

    // Set the current tree item node position relative to its aria-setsize
    const posinset = a.parent().index();
    a[0].setAttribute('aria-posinset', posinset + 1);

    // Set the current tree item aria-setsize
    const listCount = a.closest('li').siblings().length + 1;
    a[0].setAttribute('aria-setsize', listCount);

    // Set the current tree item node expansion state
    const subNode = a.next('ul');
    let subNodeOpen = false;
    if (subNode[0] && subNode.children().length > 0) {
      subNodeOpen = DOM.hasClass(subNode[0], 'is-open');
      a[0].setAttribute('aria-expanded', subNodeOpen ? 'true' : 'false');
    }

    // Inject Icons
    const text = a.contents().filter(function () {
      return !$(this).is('.tree-badge, .tree-children-count');// Do not include badge text
    }).text();

    a[0].textContent = '';
    if (a.children('svg.icon-tree').length === 0) {
      // Show provided icon if any, if empty string provided then show empty icon otherwise show document icon.
      if (iconToSet || iconToSet === '') {
        a[0].insertAdjacentHTML('afterbegin', $.createIcon({ icon: iconToSet, classes: ['icon-tree'] }));
      } else {
        a[0].insertAdjacentHTML('afterbegin', $.createIcon({ icon: 'tree-node', classes: ['icon-tree'] }));
      }

      if (this.settings.useStepUI) {
        a[0].insertAdjacentHTML('afterbegin', $.createIcon({ icon: alertIcon, classes: ['step-alert', `icon-${alertIcon}`] }));
      }
    }

    // Inject expand target
    if (subNode[0]) {
      a[0].insertAdjacentHTML('beforeend', this.getExpandTargetHtml(subNodeOpen));
    }

    // Inject checkbox
    // Show check box for particular node on demand
    if (this.isMultiselect && (!this.settings.hideCheckboxes || hideCheckbox === false)) {
      a[0].insertAdjacentHTML('beforeend', '<span class="tree-checkbox"></span>');
    }

    // Inject badge
    const badgeHtml = this.getBadgeHtml(badgeData);
    if (badgeHtml !== '') {
      a[0].insertAdjacentHTML('beforeend', badgeHtml);
    }

    const span = document.createElement('span');
    DOM.addClass(span, 'tree-text');
    span.textContent = text;
    a[0].appendChild(span);

    // Inject children count
    if (subNode[0]) {
      a[0].insertAdjacentHTML('beforeend', this.getChildrenCountHtml(nodeData));
    }

    if (this.hasIconClass(a)) {
      // CreateIconPath
      this.setTreeIcon(a.find('svg.icon-tree'), a[0].getAttribute('class'));
    }

    // Adds role=group' to all subnodes
    if (subNode[0] && subNode[0].tagName.toLowerCase() === 'ul') {
      let aClass = a[0].getAttribute('class');
      if (this.settings.useExpandTarget && aClass && !nodeData) {
        const icon = aClass.match(/(icon-)[^\s]+/g);
        if (icon) {
          nodeData = { icon: icon[0] };
        }
      }
      subNode[0].setAttribute('role', 'group');
      DOM.addClass(subNode[0].parentNode, 'folder');
      this.setFolderIcon(a, DOM.hasClass(subNode[0], 'is-open'), nodeData);

      if (aClass && aClass.indexOf('open') === -1 && aClass.indexOf('closed') === -1) {
        if (isDisabled) {
          DOM.addClass(a[0], 'is-disabled');
        }
        this.setFolderIcon(a, DOM.hasClass(subNode[0], 'is-open'), nodeData);
      }

      if (this.hasIconClass(a)) {
        aClass = a[0].getAttribute('class');
        if (/open|close/g.test(aClass) || !subNode[0] || this.settings.useExpandTarget) {
          this.setTreeIcon(a.find('svg.icon-tree'), DOM.hasClass(subNode[0], 'is-open') ?
            aClass : aClass.replace('open', 'closed'));
        }
      }
    }

    a.hideFocus();
  },

  /**
   * Sets the correct icon to use on a particular SVG element.
   * @private
   * @param {object} svg an SVG element reference wrapped in a jQuery object
   * @param {string} icon the ID of a Soho Icon type.
   * @returns {void}
   */
  setTreeIcon(svg, icon) {
    if (!svg || typeof icon !== 'string') {
      return;
    }
    svg = this.isjQuery(svg) ? svg : $(svg);
    // Replace all "icon-", "hide-focus", "\s? - all spaces if any" with nothing
    const iconStr = icon.replace(/#?icon-|hide-focus|is-selected|is-active|\s?/gi, '');
    svg.changeIcon(iconStr);
  },

  /**
   * Expands a collection of tree nodes.
   * @param {object} nodes - a jQuery-wrapped collection of tree node elements.
   If left undefined, this will automatically use all `ul[role=group]` elements.
   * @returns {void}
   */
  expandAll(nodes) {
    let groups = nodes;

    if (typeof groups !== 'undefined') {
      groups = this.isjQuery(groups) ? $.makeArray(groups) : groups;
    } else {
      groups = [].slice.call(this.element[0].querySelectorAll('ul[role=group]'));
    }

    groups.forEach((group) => {
      const prev = group.previousElementSibling;
      DOM.addClass(group.parentNode, 'is-open');
      DOM.addClass(group, 'is-open');
      group.style.height = '';

      if (prev && prev.tagName.toLowerCase() === 'a') {
        const svg = prev.querySelector('svg.icon-tree');
        this.setTreeIcon(svg, this.settings.folderIconOpen);
        prev.setAttribute('aria-expanded', true);
        if (this.hasIconClass(prev)) {
          this.setTreeIcon(svg, prev.getAttribute('class'));
        }
      }
    });
  },

  /**
   * Collapses a collection of tree nodes.
   * @param {object} nodes - a jQuery-wrapped collection of tree node elements.
   If left undefined, this will automatically use all `ul[role=group]` elements.
   * @returns {void}
   */
  collapseAll(nodes) {
    let groups = nodes;

    if (typeof groups !== 'undefined') {
      groups = this.isjQuery(groups) ? $.makeArray(groups) : groups;
    } else {
      groups = [].slice.call(this.element[0].querySelectorAll('ul[role=group]'));
    }

    groups.forEach((group) => {
      const prev = group.previousElementSibling;
      DOM.removeClass(group.parentNode, 'is-open');
      DOM.removeClass(group, 'is-open');
      group.style.height = 0;

      if (prev && prev.tagName.toLowerCase() === 'a') {
        const svg = prev.querySelector('svg.icon-tree');
        this.setTreeIcon(svg, this.settings.folderIconClosed);
        prev.setAttribute('aria-expanded', false);
        DOM.removeClass(prev, 'is-selected');
        if (this.hasIconClass(prev)) {
          this.setTreeIcon(svg, prev.getAttribute('class').replace('open', 'closed'));
        }
      }
    });
  },

  /**
   * Check if an object is an instance of a jQuery object
   * @private
   * @param {object} obj the object being tested.
   * @returns {boolean} true if jQuery
   */
  isjQuery(obj) {
    // TODO: Move this to a Soho utility object?
    return (obj && (obj instanceof jQuery || obj.constructor.prototype.jquery));
  },

  /**
   * Selects a tree node specifically using it's ID attribute.
   * @param {string} id - the ID string to use.
   * @returns {void}
   */
  selectNodeById(id) {
    this.selectNodeByJquerySelector(`#${id}`);
  },

  /**
   * Selects a tree node by [jquery selector] -or- [jquery object]
   * @private
   * @param {object} selector uses a string that represents a jQuery-wrapped
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
   * @param {object} node - a jQuery-wrapped element reference to a tree node.
   * @param {boolean} focus - if defined, causes the node to become focused.
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
    const listItems = [].slice.call(this.element[0].querySelectorAll('li'));
    listItems.forEach(li => DOM.removeClass(li, 'is-active'));
    DOM.addClass(node[0].parentNode, 'is-active');

    setTimeout(() => {
      const jsonData = node.data('jsonData') || {};
      /**
      * Fires when the node is deselected.
      * @memberof Tree
      * @event unselected
      * @type {object}
      * @property {object} event - The jquery event object
      * @property {object} args for node element, item
      * @property {HTMLElement} args.node The DOM Element.
      * @property {HTMLElement} args.data The JSON data attached to the node.
      */
      self.element.triggerHandler('unselected', { node, data: jsonData });
    }, 0);
  },

  /**
   * Selects a tree node
   * @private
   * @param {object} node - a jQuery-wrapped element reference to a tree node.
   * @param {boolean} focus - if defined, causes the node to become focused.
   * @returns {void}
   */
  selectNode(node, focus) {
    const self = this;
    const s = this.settings;

    if (node.length === 0) {
      return;
    }

    // Possibly Call the onBeforeSelect
    let result;
    if (typeof s.onBeforeSelect === 'function') {
      result = s.onBeforeSelect(node);
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
   * Select the node when finished
   * @private
   * @param {object} node - a jQuery-wrapped element reference to a tree node.
   * @param {boolean} focus - if defined, causes the node to become focused.
   * @param {object} e - jquery event.
   * @returns {void}
   */
  selectNodeFinish(node, focus, e) {
    // Don't do selection for toggle type only
    if ((this.isMultiselect || this.settings.expandTarget === 'icon') && e) {
      if (e.type === 'click' || e.type === 'touch') {
        if (DOM.hasClass(e.target, 'icon') &&
          DOM.hasClass(node[0].parentNode, 'folder')) {
          return;
        }
      } else if (e.type === 'keydown') {
        const charCode = e.charCode || e.keyCode;
        if (charCode === 37 || charCode === 39) {
          return;
        }
      }
    }

    const self = this;
    const links = [].slice.call(this.element[0].querySelectorAll('a'));
    links.forEach(a => a.setAttribute('tabindex', '-1'));
    node[0].setAttribute('tabindex', '0');

    if (this.isMultiselect) {
      const links2 = [].slice.call(node[0].parentNode.querySelectorAll('a:not(.is-disabled)'));
      links2.forEach((a) => {
        a.setAttribute('aria-selected', 'true');
        DOM.addClass(a, 'is-selected');
        DOM.addClass(a.parentNode, 'is-selected');
      });
    } else {
      if (DOM.hasClass(node[0], 'is-selected')) {
        return;
      }
      links.forEach((a) => {
        const link = $(a);
        const data = link.data('jsonData');
        if (data) {
          delete data.selected;
          link.data('jsonData', data);
        }
        a.setAttribute('aria-selected', 'false');
        DOM.removeClass(a, 'is-selected');
        DOM.removeClass(a.parentNode, 'is-selected');
      });
      node[0].setAttribute('aria-selected', 'true');
      DOM.addClass(node[0], 'is-selected');
      DOM.addClass(node[0].parentNode, 'is-selected');
    }

    this.syncNode(node);
    if (!this.loading) {
      this.setNodeStatus(node);
    }

    if (focus) {
      node.focus();
    }

    // Set active css class
    const listItems = [].slice.call(this.element[0].querySelectorAll('li'));
    listItems.forEach(li => DOM.removeClass(li, 'is-active'));
    DOM.addClass(node[0].parentNode, 'is-active');

    setTimeout(() => {
      const jsonData = node.data('jsonData') || {};
      /**
       * Fires when the node is selected.
       * @memberof Tree
       * @event selected
       * @type {object}
       * @property {object} event - The jquery event object
       * @property {object} args for node element, item
       * @property {HTMLElement} args.node The DOM Element.
       * @property {HTMLElement} args.data The JSON data attached to the node.
       */
      self.element.triggerHandler('selected', { node, data: jsonData });
    }, 0);
  },

  /**
   * Set current node status
   * @private
   * @param {object} node - a jQuery-wrapped element reference to a tree node.
   * @returns {void}
   */
  setNodeStatus(node) {
    const self = this;
    const data = node.data('jsonData');
    let nodes;

    // Not multiselect
    if (!this.isMultiselect) {
      const a = node[0];
      const li = a.parentNode;
      if (data && data.selected) {
        DOM.addClass(li, 'is-selected');
        DOM.addClass(a, 'is-selected');
        a.setAttribute('aria-selected', true);
      } else {
        DOM.removeClass(li, 'is-selected', 'is-partial');
        DOM.removeClass(a, 'is-selected', 'is-partial');
        a.setAttribute('aria-selected', false);
      }
      return;
    }

    const setStatus = function (thisNodes, isFirstSkipped) {
      thisNodes.forEach((li) => {
        const a = $(li.querySelector('a'));
        const status = self.getSelectedStatus(a, isFirstSkipped);

        if (status === 'mixed') {
          DOM.removeClass(li, 'is-selected', 'is-partial');
          DOM.addClass(li, 'is-partial');
        } else if (status) {
          DOM.removeClass(li, 'is-selected', 'is-partial');
          DOM.addClass(li, 'is-selected');
        } else {
          DOM.removeClass(li, 'is-selected', 'is-partial');
        }
        self.syncNode(a);
      });
    };

    // Multiselect
    let isFirstSkipped = false;
    nodes = [].slice.call(node[0].parentNode.querySelectorAll('li.folder'));
    setStatus(nodes, isFirstSkipped);

    isFirstSkipped = !(!nodes.length && data && !data.selected);
    nodes = node.parentsUntil(this.element, 'li.folder');
    nodes = [].slice.call(nodes.toArray());
    setStatus(nodes, isFirstSkipped);
  },

  /**
   * Get's a tree node's current 'selected' status
   * @private
   * @param {object} node - a jQuery-wrapped element reference to a tree node.
   * @param {boolean} isFirstSkipped - ?
   * @returns {boolean} status as true|false|'mixed'
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
   * Changes a node's open/close status to its opposite form.
   * @private
   * @param {object} node - a jQuery-wrapped element reference to a tree node.
   * @param {object} e jquery event
   * @returns {void}
   */
  toggleNode(node, e) {
    const next = node.next();
    const self = this;
    const s = this.settings;
    let result;
    if (next[0] && next[0].tagName.toLowerCase() === 'ul' && next[0].getAttribute('role') === 'group') {
      const currentIcon = node.find('svg.icon-tree').getIconName();

      if (DOM.hasClass(next[0], 'is-open')) {
        if (typeof s.onCollapse === 'function') {
          result = s.onCollapse(node);
          if (result && result.done && typeof result.done === 'function') { // A promise is returned
            result.done((continueSelectNode) => {
              if (continueSelectNode) {
                self.selectNodeFinish(node, focus, e);
              }
            });
          } else if (result) { // Boolean is returned instead of a promise
            self.selectNodeFinish(node, focus, e);
          }
        } else { // No Callback specified
          self.selectNodeFinish(node, focus, e);
        }

        node.closest('.folder').removeClass('is-open');
        if (currentIcon === s.folderIconOpen || s.useExpandTarget) {
          self.setFolderIcon(node, false, false, s.expandPlusminusRotate);
        } else if (/open|close/g.test(currentIcon) && !s.useExpandTarget) {
          self.setTreeIcon(node.find('svg.icon-tree'),
            currentIcon.replace('open', 'closed').replace(/\s?is-selected/, ''));
        }

        const parentNode = node.closest('.folder a');
        if (self.hasIconClass(parentNode)) {
          const nodeClass = parentNode.attr('class');
          if (/open|close/g.test(nodeClass) || s.useExpandTarget) {
            self.setTreeIcon(parentNode.find('svg.icon-tree'),
              nodeClass.replace('open', 'closed').replace(/\s?is-selected/, ''));
          }
        }

        self.isAnimating = true;

        if (!self.isMultiselect && !s.expandTarget === 'icon') {
          self.unSelectedNode(node.parent().find('li.is-selected'), false);
          DOM.removeClass(node[0], 'is-selected');
        }

        next.one('animateclosedcomplete', () => {
          DOM.removeClass(next[0], 'is-open');
          self.isAnimating = false;
        }).animateClosed();

        node[0].setAttribute('aria-expanded', node[0].getAttribute('aria-expanded') !== 'true');
      } else {
        if (typeof s.onExpand === 'function') {
          result = s.onExpand(node);
          if (result && result.done && typeof result.done === 'function') { // A promise is returned
            result.done((continueSelectNode) => {
              if (continueSelectNode) {
                self.selectNodeFinish(node, focus, e);
              }
            });
          } else if (result) { // Boolean is returned instead of a promise
            self.selectNodeFinish(node, focus, e);
          }
        } else { // No Callback specified
          self.selectNodeFinish(node, focus, e);
        }

        const nodeData = node.data('jsonData');

        if (s.source && nodeData.children && nodeData.children.length === 0) {
          const response = function (nodes) {
            const id = nodeData.id;
            const elem = self.findById(id);

            // Add DB and UI nodes
            elem.children = nodes;
            self.addChildNodes(elem, node.parent());
            DOM.removeClass(node[0], 'is-loading');
            self.loading = false;

            // Open
            self.accessNode(next, node);

            // Sync data on node
            nodeData.children = nodes;
            node.data('jsonData', nodeData);
            if (DOM.hasClass(node[0].parentNode, 'folder')) {
              self.childrenCountInit(node[0].parentNode);
            }

            if (!self.isMultiselect && !s.expandTarget === 'icon') {
              self.selectNode(node, true);
            }
            self.initSelected();
          };

          const args = { node, data: node.data('jsonData') };
          DOM.addClass(node[0], 'is-loading');
          self.loading = true;
          self.settings.source(args, response);

          return;
        }
        if (currentIcon === s.folderIconClosed || s.useExpandTarget) {
          self.setFolderIcon(node, true, false, s.expandPlusminusRotate);
        } else if (/open|close/g.test(currentIcon) && !s.useExpandTarget) {
          self.setTreeIcon(node.find('svg.icon-tree'),
            currentIcon.replace('closed', 'open').replace(/\s?is-selected/, ''));
        }
        self.accessNode(next, node);
      }
    }
  },

  /**
   * Access The Node
   * @private
   * @param  {object} next The next element.
   * @param  {object} node The DOM element.
   */
  accessNode(next, node) {
    const nodeClass = node.attr('class');

    node.closest('.folder').addClass('is-open');
    const currentIcon = node.find('svg.icon-tree').getIconName();
    if (currentIcon === this.settings.folderIconClosed || this.settings.useExpandTarget) {
      this.setFolderIcon(node, true, false, this.settings.expandPlusminusRotate);
    } else if (/open|close/g.test(currentIcon) && !this.settings.useExpandTarget) {
      this.setTreeIcon(node.find('svg.icon-tree'),
        currentIcon.replace('closed', 'open').replace(/\s?is-selected/, ''));
    }

    if (this.hasIconClass(nodeClass)) {
      const isTypeFolder = next[0] && next[0].tagName.toLowerCase() === 'ul';
      if (/open|close/g.test(nodeClass) || !isTypeFolder || this.settings.useExpandTarget) {
        this.setTreeIcon(node.find('svg.icon-tree'), nodeClass.replace('is-selected', ''));
      }
    }

    this.isAnimating = true;

    next.one('animateopencomplete', () => {
      this.isAnimating = false;
    }).addClass('is-open').css('height', 0).animateOpen();
    node[0].setAttribute('aria-expanded', node[0].getAttribute('aria-expanded') !== 'true');
  },

  /**
   * Open The Node
   * @private
   * @param  {object} nextTarget The next tree element
   * @param  {object} nodeTarget The DOM element to open.
   */
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
      nodeTarget.addClass('is-loading');
      self.loading = true;
      self.settings.source(args, response);

      return;
    }
    self.accessNode(nextTarget, nodeTarget);
  },

  /**
   * Check if given value has icon class
   * @private
   * @param  {string|object} elemClass class or element has icon class
   * @returns  {boolean} true if has icon.
   */
  hasIconClass(elemClass) {
    if (typeof elemClass !== 'string') {
      if (this.isjQuery(elemClass)) {
        elemClass = elemClass.length > 1 ? elemClass.first()[0] : elemClass[0];
      }
      elemClass = elemClass.getAttribute('class');
    }
    return elemClass && elemClass.indexOf('icon') > -1;
  },

  /**
   * Close The Node
   * @private
   * @param  {object} nextTarget The next tree element
   * @param  {object} nodeTarget The DOM element to open.
   */
  closeNode(nextTarget, nodeTarget) {
    const self = this;
    self.setTreeIcon(nodeTarget.closest('.folder').removeClass('is-open').end().find('svg.icon-tree'), self.settings.folderIconClosed);

    if (self.hasIconClass(nodeTarget.closest('.folder a'))) {
      self.setTreeIcon(
        nodeTarget.closest('.folder a').find('svg.icon-tree'),
        nodeTarget.closest('.folder a').attr('class')
          .replace('open', 'closed')
          .replace(/\s?is-selected/, '')
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
      const parent = this.parentNode;
      utils.clearSelection(); // Deselect all selected text.
      if (!DOM.hasClass(target[0], 'is-disabled') && !DOM.hasClass(target[0], 'is-loading')) {
        if (self.isMultiselect || self.settings.expandTarget === 'icon') {
          if (DOM.hasClass(e.target, 'icon') && DOM.hasClass(parent, 'folder')) {
            self.toggleNode(target, e);
          } else if (DOM.hasClass(parent, 'is-selected') || DOM.hasClass(parent, 'is-partial')) {
            self.unSelectedNode(target, true);
          } else {
            self.selectNode(target, true);
          }
        } else {
          self.selectNode(target, true);
          self.toggleNode(target, e);
        }
        e.stopPropagation();
      }

      if (self.popupEl && self.popupEl.data('popupmenu')) {
        self.popupEl.data('popupmenu').close();
        self.popupEl = null;
      }

      self.syncDataset();
      return false; // Prevent Click from Going to Top
    });

    this.element
    // Focus on "a" elements
      .on('focus.tree', 'a', function () {
        if (parseInt(this.getAttribute('aria-level'), 10) === 0 && parseInt(this.getAttribute('aria-posinset'), 10) === 1) {
          // First element if disabled
          if (DOM.hasClass(this, 'is-disabled')) {
            const e = $.Event('keydown.tree');
            e.keyCode = 40; // move down
            $(this).trigger(e);
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
            self.toggleNode(target, e);
          }
        } else if (target.next().hasClass('is-open')) {
          self.toggleNode(target, e);
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
            self.toggleNode(target, e);
          } else {
            next = target.closest('.folder').find('a:first');
            self.setFocus(next);
          }
        } else if (target.next().hasClass('is-open')) {
          next = target.next().find('a:first');
          self.setFocus(next);
        } else {
          self.toggleNode(target, e);
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
   * @param {object} dataset to load.
   * @returns {void}
   */
  loadData(dataset) {// eslint-disable-line
    if (!dataset) {
      return -1;
    }
    const self = this;
    self.element.empty();

    self.loading = true;
    dataset = this.arrangeDataset(dataset);
    let html = '';
    self.jsonData = [];
    for (let i = 0, l = dataset.length; i < l; i++) {
      html += self.getNodeHtml(dataset[i], i);
    }

    self.element[0].insertAdjacentHTML('beforeend', html);
    const nodes = [].slice.call(self.element[0].querySelectorAll('a[role="treeitem"]'));
    nodes.forEach((node, i) => {
      const a = $(node);
      const data = self.jsonData[i];
      a.data('jsonData', data);
      if (data.selected) {
        self.selectNode(a, data.focus);
      }
      if (a.is('.hide-focus')) {
        a.hideFocus();
      }
    });
    const dropdowns = [].slice.call(self.element[0].querySelectorAll('select.dropdown'));
    for (let i = 0; i < dropdowns.length; i++) {
      const dropdown = dropdowns[i];
      const data = self.jsonData[i];
      if (data.disabled) {
        $(dropdown).dropdown().disable();
      } else {
        $(dropdown).dropdown().on('selected.tree', function () {
          const nodeToUpdate = self.findById(this.parentElement.previousElementSibling.id);
          nodeToUpdate.text = this.value;
          self.updateNode(nodeToUpdate);
        });
      }
    }
    self.jsonData = undefined;
    self.loading = false;

    self.syncDataset();
    self.initSelected();
    self.focusFirst();
    self.attachMenu(self.settings.menuId);
    self.createSortable();
    this.childrenCountInit();
  },

  /**
   * Rearrange the given or default dataset. if dataset use `parent` key to arrange nodes
   * @private
   * @param {object} dataset a data object.
   * @returns {object} arranged data object
   */
  arrangeDataset(dataset) {
    if (!this.hasKeyInData('parent', dataset)) {
      return dataset;
    }

    dataset = dataset || this.settings.dataset;
    const arrangedData = JSON.parse(JSON.stringify(dataset));

    // Add given node to parent
    const addToParent = (node) => {
      let arranged = false;
      // Add child to given parent
      const addChild = (parent) => {
        parent.children = parent.children || [];
        parent.children.push(node);
        arranged = true;
      };

      // Traverse in given data and arrange it
      const arrange = (data) => {
        for (let i = 0; i < data.length && !arranged; i++) {
          if (data[i].id === node.parent) {
            addChild(data[i]);
          }
          if (typeof data[i].children !== 'undefined') {
            arrange(data[i].children);
          }
        }
      };
      arrange(arrangedData);
    };

    // Traverse in given data and add to parent
    const traverse = (data) => {
      for (let i = 0; i < data.length; i++) {
        if (typeof data[i].parent !== 'undefined') {
          addToParent(data[i]);
        }
        if (typeof data[i].children !== 'undefined') {
          traverse(data[i].children);
        }
      }
    };
    traverse(dataset);

    // Clean old nodes with parent key
    const clean = (data, id) => {
      for (let i = 0; i < data.length; i++) {
        if (typeof data[i].children !== 'undefined') {
          clean(data[i].children, data[i].id);
        }
        if ((typeof id === 'undefined' && typeof data[i].parent !== 'undefined') ||
          (typeof id !== 'undefined' && typeof data[i].parent !== 'undefined' && id !== data[i].parent)) {
          data.splice(i, 1);
          i--;
        } else {
          delete data[i].parent;
        }
      }
    };
    clean(arrangedData);

    // Set and return the arranged data
    this.settings.dataset = arrangedData;
    return arrangedData;
  },

  /**
   * Check if given key is exists in dataset.
   * @private
   * @param {string} key to check.
   * @param {object} data to check in.
   * @returns {boolean} true if key found
   */
  hasKeyInData(key, data) {
    let found = false;
    data = data || this.settings.dataset;

    /* eslint-disable no-restricted-syntax */
    const findkey = (obj) => {
      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {// eslint-disable-line
          const value = obj[prop];
          if (typeof value === 'object' && !found) {
            findkey(value);
          } else if (key === prop) {
            found = true;
          }
          if (found) {
            break;
          }
        }
      }
    };
    /* eslint-enable no-restricted-syntax */

    for (let i = 0, l = data.length; i < l; i++) {
      if (found) {
        break;
      }
      findkey(data[i]);
    }
    return found;
  },

  /**
   * Create html for given json data.
   * @private
   * @param {object} data to do html.
   * @param {number} position for node.
   * @param {number} level for node.
   * @param {boolean} isParentsDisabled for node.
   * @returns {string} created html
   */
  getNodeHtml(data, position, level, isParentsDisabled) {
    let selectHtml = '';
    let selectedOptionText = '';
    level = level || 0;
    position += 1;
    const s = this.settings;
    const isDisabled = isParentsDisabled || data.disabled || false;
    const isChildren = data.children && Array.isArray(data.children);
    const a = {
      id: typeof data.id !== 'undefined' ? ` id="${data.id}"` : '',
      href: ` href="${typeof data.href !== 'undefined' ? data.href : '#'}"`,
      expanded: ` aria-expanded="${data.open ? 'true' : 'false'}"`,
      icon: (data.icon || data.icon === '') ? data.icon : 'tree-node',
      alertIcon: '',
      alertIconAttr: typeof data.alertIcon !== 'undefined' ? ` data-alert-icon="${data.alertIcon}"` : '',
      text: `<span class="tree-text">${data.text}</span>`,
      class: ['hide-focus'],
      ariaDisabled: isDisabled ? 'aria-disabled="true"' : '',
      checkbox: this.isMultiselect && (!this.settings.hideCheckboxes || data.hideCheckbox === false) ? '<span class="tree-checkbox"></span>' : '',
      badge: typeof data.badge === 'object' ? this.getBadgeHtml(data.badge) : '',
      expandTarget: isChildren ? this.getExpandTargetHtml(data.open) : '',
      childrenCount: isChildren ? this.getChildrenCountHtml(data) : ''
    };
    this.jsonData.push(data);

    if (s.useStepUI) {
      a.alertIcon = `<svg class="icon step-alert icon-${data.alertIcon}" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-${data.alertIcon}"></use>`;
    }

    let liClassList = isChildren ? 'folder' : '';
    liClassList += data.selected ? ' is-selected' : '';
    if (liClassList !== '') {
      liClassList += data.open ? ' is-open' : '';
      liClassList = ` class="${liClassList}"`;
    }
    if (isDisabled) {
      a.class.push('is-disabled');
    }
    if (data.icon) {
      a.icon = data.icon;
      if (!isChildren || (isChildren && (/open|closed/i.test(data.icon)))) {
        a.class.push(data.icon);
      }
    }
    if (isChildren && (!s.useExpandTarget || (s.useExpandTarget && !data.icon))) {
      if (data.open) {
        a.icon = data.icon && /open|closed/i.test(data.icon) ? data.icon : s.folderIconOpen;
        isParentsDisabled = isDisabled;
      } else {
        a.icon = data.icon && /open|closed/i.test(data.icon) ? data.icon.replace('open', 'closed') : s.folderIconClosed;
      }
    }
    a.icon = `#icon-${a.icon.replace(/^#?icon-?/, '')}`;
    a.class = ` class="${a.class.join(' ')}"`;
    a.style = '';

    // Insert dropdown start
    if (data.type === 'dropdown') {
      a.style = 'style="display: none"';

      if (data.data) {
        selectHtml = '<select class="dropdown" close-on-select="true">';

        for (let i = 0; i < data.data.length; i++) {
          const option = data.data[i];
          if (option.value === data.text) {
            selectedOptionText = option.text;
            selectHtml += `<option value="${option.value}" selected>${option.text}</option>`;
          } else {
            selectHtml += `<option value="${option.value}">${option.text}</option>`;
          }
        }

        selectHtml += `</select><div class="dropdown-wrapper"><div class="dropdown"><span>${selectedOptionText}`;
        selectHtml += '</span></div><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-dropdown"></use></svg></div>';
        selectHtml = `<div class="treeDropdown" style="width: 80px; margin-left: 35px; margin-bottom: -15px">${selectHtml}</div>`;
      }
    }
    // Insert dropdown end

    let html = `
      <li${liClassList}>
        <a role="treeitem" aria-selected="false" tabindex="-1" ${a.style}
          aria-level="${level}"
          aria-position="${position}"
          aria-setsize="${position}"
          ${a.id + a.href + a.class + a.expanded + a.ariaDisabled + a.alertIconAttr}>
            <svg class="icon-tree icon" focusable="false" aria-hidden="true" role="presentation"><use href="${a.icon}"></use>
            </svg>${a.expandTarget + a.checkbox + a.alertIcon + a.badge + a.text + a.childrenCount}
        </a>
        ${selectHtml}`;

    if (isChildren) {
      html += `<ul class="folder${data.open ? ' is-open' : ''}" role="group">`;
      for (let i = 0, l = data.children.length; i < l; i++) {
        html += this.getNodeHtml(data.children[i], i, (level + 1), isParentsDisabled);
      }
      html += '</ul>';
    }
    html += '</li>';

    return html;
  },

  /**
   * Get expand target html.
   * @private
   * @param {boolean} isOpen if true, use open icon.
   * @returns {string} html created
   */
  getExpandTargetHtml(isOpen) {
    let r = '';
    if (this.settings.useExpandTarget) {
      const cssClass = 'icon-expand-target';
      const expandTarget = isOpen ?
        { icon: this.settings.expandIconOpen, class: 'open' } :
        { icon: this.settings.expandIconClosed, class: 'close' };
      r = $.createIcon({ icon: expandTarget.icon, classes: [cssClass, `${cssClass}-${expandTarget.class}`] });
    }
    return r;
  },

  /**
   * Get children count html.
   * @private
   * @param {object} data to do children.
   * @returns {string} html created
   */
  getChildrenCountHtml(data) {
    let r = '';
    if (this.settings.showChildrenCount) {
      r = `<span class="tree-children-count">
          (<span class="tree-children-count-text">${this.getDataChildrenCount(data)}</span>)
        </span>`;
    }
    return r;
  },

  /**
   * Get children count set via a tree node property.
   * @private
   * @param {object} nodeData to do children.
   * @returns {number} calculated actual children count
   */
  getDataChildrenCount(nodeData) {
    return nodeData && /string|number/.test(typeof nodeData.childrenCount) ?
      parseInt(nodeData.childrenCount, 10) : 0;
  },

  /**
   * Get calculated on the basis of actual children count.
   * @private
   * @param {object} a an anchor tag reference.
   * @returns {number} calculated actual children count
   */
  getActualChildrenCount(a) {
    let count = 0;
    if (a) {
      const next = a.nextElementSibling;
      if (next && next.tagName.toLowerCase() === 'ul') {
        count = next.childElementCount;
      }
    }
    return count;
  },

  /**
   * Update children count for given node.
   * @private
   * @param {object} a an anchor tag reference.
   * @param {number} count optional to manually set the children count.
   * @returns {void}
   */
  updateChildrenCount(a, count) {
    if (a) {
      const countTextEl = a.querySelector('.tree-children-count-text');
      if (countTextEl) {
        count = /string|number/.test(typeof count) ?
          parseInt(count, 10) : this.getActualChildrenCount(a);
        if (!(count === 0 &&
          parseInt(countTextEl.textContent, 10) > 0 &&
          typeof this.settings.source === 'function' &&
          !DOM.hasClass(a.nextElementSibling, 'is-open'))) {
          countTextEl.textContent = count;
        }
      }
    }
  },

  /**
   * Auto calculate and update children count for given node.
   * @private
   * @param {object} elem the node element.
   * @returns {void}
   */
  updateAutoChildrenCount(elem) {
    if (this.settings.showChildrenCount && elem) {
      const links = [].slice.call(elem.querySelectorAll('a'));
      links.forEach(a => this.updateChildrenCount(a));
    }
  },

  /**
   * Initial update to children count.
   * @private
   * @param {object} elem Optional the node element.
   * @returns {void}
   */
  childrenCountInit(elem) {
    elem = elem || this.element;
    elem = this.isjQuery(elem) ? elem[0] : elem;

    if (this.settings.showChildrenCount && elem) {
      if (this.settings.childrenAutoCount) {
        this.updateAutoChildrenCount(elem);
      } else {
        const links = [].slice.call(elem.querySelectorAll('a[data-children-count]'));
        links.forEach((a) => {
          const childrenCount = a.getAttribute('data-children-count');
          if (typeof childrenCount !== 'undefined') {
            this.updateChildrenCount(a, childrenCount);
          }
        });
      }
    }
  },

  /**
   * Set the folder icon to use.
   * @private
   * @param {object} a an anchor tag reference.
   * @param {boolean} isOpen if true, use open icon.
   * @param {object} nodeData the node data.
   * @param {boolean} isRotatePlusminus if true, will rotate plus-minus icon.
   * @returns {void}
   */
  setFolderIcon(a, isOpen, nodeData, isRotatePlusminus) {
    const s = this.settings;
    const aJq = this.isjQuery(a) ? a : $(a);
    a = aJq[0];

    if (a) {
      const svg = {
        el: {
          tree: a.querySelector('svg.icon-tree'),
          expand: a.querySelector('svg.icon-expand-target')
        },
        icon: isOpen ?
          { tree: s.folderIconOpen, expand: s.expandIconOpen, rotate: 'forward' } :
          { tree: s.folderIconClosed, expand: s.expandIconClosed, rotate: 'backward' }
      };

      let target;

      if (s.useExpandTarget) {
        target = { el: svg.el.expand, icon: svg.icon.expand, rotateClass: `rotate-${svg.icon.rotate}` };
        this.setTreeIcon(target.el, target.icon);
        if (isRotatePlusminus) {
          this.rotatePlusminus(target);
        }

        nodeData = nodeData || aJq.data('jsonData');
        if (!nodeData || (nodeData && !nodeData.icon)) {
          target = { el: svg.el.tree, icon: svg.icon.tree };
          this.setTreeIcon(target.el, target.icon);
        }
      } else {
        target = { el: svg.el.tree, icon: svg.icon.tree };
        this.setTreeIcon(target.el, target.icon);
      }
    }
  },

  /**
   * Rotate class for plusminus icons.
   * @private
   * @param {object} target to set values.
   * @returns {void}
   */
  rotatePlusminus(target) {
    if (this.settings.useExpandTarget && this.settings.expandPlusminusRotate) {
      DOM.addClass(target.el, target.rotateClass);
      $(target.el).one('webkitAnimationEnd.tree oAnimationEnd.tree msAnimationEnd.tree animationend.tree', () => {
        DOM.removeClass(target.el, target.rotateClass);
      });
    }
  },

  /**
   * Create badge html.
   * @private
   * @param {object} badgeData to do html.
   * @returns {string} html created
   */
  getBadgeHtml(badgeData) {
    const badge = { html: '', style: '', class: ['badge', 'tree-badge'] };

    if (badgeData && !badgeData.remove) {
      badge.text = '';

      if (typeof badgeData.text !== 'undefined') {
        badge.text = badgeData.text.toString();
        if (badge.text.length === 1) {
          badge.class.push('round');
        }
      }

      if (/info|good|error|alert|pending/i.test(badgeData.type)) {
        badge.class.push(badgeData.type);
      } else if (badgeData.type && badgeData.type.charAt(0) === '#' && badgeData.type.length === 7) {
        badge.style = `background-color: ${badgeData.type} !important;`;
      }
      if (badgeData.backColor) {
        badge.style = `background-color: ${badgeData.backColor} !important;`;
      }
      if (badgeData.foreColor) {
        badge.style += `color: ${badgeData.foreColor} !important;`;
      }
      if (badge.style !== '') {
        badge.style = ` style="${badge.style}"`;
      }
      if (badge.text !== '') {
        if (badgeData.type && badgeData.type.indexOf('pending') !== -1) {
          badge.text = '';
        }
        badge.html = `<span class="${badge.class.join(' ')}"${badge.style}>${badge.text}</span>`;
      }
    }
    return badge.html;
  },

  // Functions to Handle Internal Data Store
  addToDataset(node, location) {
    let elem;
    let updatedNode;
    let index;

    if (node.parent) {
      elem = this.findById(node.parent);
    }

    // Update dataset after inserting node before or after other node
    if (location instanceof jQuery && location.is('li')) {
      updatedNode = this.findById($(location[0].parentNode.parentNode).find('a')[0].id);
      const childNodes = updatedNode.children || updatedNode.node.data('jsonData').children;
      index = childNodes.findIndex(element => element.text.trim() === $(location).text().trim());

      childNodes.splice(index, 0, node);
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

      if (item.children || item.node?.data('jsonData')?.children) {
        const subresult = self.findById(id, item.children || item.node?.data('jsonData')?.children);

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
   * @returns {object} selected nodes
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

  /**
   * Sync the tree with the underlying dataset
   * @private
   * @param {object} node the jQuery element to sync (Optional)
   * @returns {void}
   */
  syncDataset(node) {
    const json = [];
    const self = this;
    node = node || this.element;

    const items = [].slice.call(node.children('li').toArray());
    items.forEach((li) => {
      const a = li.querySelector('a');
      if (a) {
        json.push(self.syncNode(a));
      }
    });

    this.settings.dataset = json;
    this.element.triggerHandler('rendered', { data: this.settings.dataset });
  },

  /**
   * Sync a node with its dataset record
   * @private
   * @param {object} node The node to sync (jQuery or DOM element)
   * @returns {object} synced node data
   */
  syncNode(node) {
    const self = this;
    let entry;

    const nodeJQ = this.isjQuery(node) ? node : $(node);
    node = nodeJQ[0];
    if (node) {
      const parent = node.parentNode;
      const hasClass = (el, className) => DOM.hasClass(el, className);

      entry = {
        node: nodeJQ,
        id: node.getAttribute('id'),
        text: node.querySelector('.tree-text').textContent
      };

      // Is folder open
      if (hasClass(node, 'is-open') ||
          (parent && parent.tagName.toLowerCase() === 'li') && hasClass(parent, 'is-open')) {
        entry.open = true;
      }

      // Href
      const href = node.getAttribute('href');
      if (href) {
        entry.href = href;
      }

      // Selected
      if (hasClass(parent, 'is-selected')) {
        entry.selected = true;
      }

      // Disabled
      if (hasClass(node, 'is-disabled')) {
        entry.disabled = true;
      }

      // Icon
      const classAttribute = node.getAttribute('class');
      if (classAttribute && classAttribute.indexOf('icon') > -1) {
        entry.icon = classAttribute;
      }

      // Children
      const ul = nodeJQ.next();
      if (ul[0] && ul[0].tagName.toLowerCase() === 'ul') {
        entry.children = [];

        const items = [].slice.call(ul.children('li').toArray());
        items.forEach((li) => {
          const a = li.querySelector('a');
          if (a) {
            entry.children.push(self.syncNode(a));
          }
        });
      }

      // Merge json data
      const jsonData = nodeJQ.data('jsonData');
      if (jsonData) {
        delete jsonData.selected;
        delete jsonData.children;
        entry = $.extend({}, jsonData, entry);
      }

      nodeJQ.data('jsonData', entry);
    }
    return entry;
  },

  /**
   * Add a node and all its related markup.
   * @param {object} nodeData to add.
   * @param {object} location in tree.
   * @param {string} isBeforeOrAfter to insert node before or after selected tree node.
   * @returns {object} li added
   */

  // Parameter added - to add node before or after the node
  addNode(nodeData, location, isBeforeOrAfter) {
    const self = this;
    let selectedOptionText;
    let selectHtml;
    let option;

    const badgeAttr = typeof nodeData.badge === 'object' ? JSON.stringify(nodeData.badge) : nodeData.badge;

    nodeData.href = typeof nodeData.href !== 'undefined' ? nodeData.href : '#';

    location = (!location ? 'bottom' : location); // supports button or top or jquery node

    let a = document.createElement('a');
    if (typeof nodeData.id !== 'undefined') {
      a.setAttribute('id', nodeData.id);
    }
    a.setAttribute('href', nodeData.href);
    if (typeof badgeAttr !== 'undefined') {
      a.setAttribute('data-badge', badgeAttr);
    }
    if (typeof nodeData.alertIcon !== 'undefined') {
      a.setAttribute('data-alert-icon', nodeData.alertIcon);
    }

    if (nodeData.text) {
      a.textContent = nodeData.text;
    }

    if (nodeData.disabled) {
      DOM.addClass(a, 'is-disabled');
    }
    if (nodeData.icon) {
      DOM.addClass(a, nodeData.icon);
    }

    let li = document.createElement('li');
    li.setAttribute('role', 'none');

    if (nodeData.open) {
      DOM.addClass(li, 'is-open');
    }

    li.appendChild(a);

    // Insert dropdown start
    if (nodeData.type === 'dropdown') {
      a.setAttribute('style', 'display: none');

      if (nodeData.data) {
        selectHtml = '<select class="dropdown" close-on-select="true">';

        for (let i = 0; i < nodeData.data.length; i++) {
          option = nodeData.data[i];
          if (option.value === nodeData.text) {
            selectedOptionText = option.text;
            selectHtml += `<option value="${option.value}" selected>${option.text}</option>`;
          } else {
            selectHtml += `<option value="${option.value}">${option.text}</option>`;
          }
        }

        selectHtml += `</select><div class="dropdown-wrapper"><div class="dropdown"><span>${selectedOptionText}`;

        selectHtml += '</span></div><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-dropdown"></use></svg></div>';

        $(`<div class="treeDropdown" style="width: 80px; margin-left: 35px; margin-bottom: -15px">${selectHtml}</div>`).appendTo(li);

        if (nodeData.disabled) {
          $(li).find('select.dropdown').dropdown().disable();
        } else {
          $(li).find('select.dropdown').dropdown().on('selected.tree', function () {
            const nodeToUpdate = self.findById(this.parentElement.previousElementSibling.id);
            nodeToUpdate.text = this.value;
            self.updateNode(nodeToUpdate);
          });
        }
      }
    }
    // Insert dropdown end

    // Handle Location
    let found = this.loading ? true : this.addToDataset(nodeData, location);

    if (nodeData.parent instanceof jQuery) {
      found = true;
    }

    // Insert node in between the node
    if (location) {
      let locationToAdd;
      if (typeof location === 'string' &&
        !/^(top|bottom|before|after)$/g.test(location)) {
        locationToAdd = $(/\.|#/.test(location[0]) ? location : `#${location}`).first();
      } else {
        locationToAdd = location instanceof jQuery ? location : $(location);
      }

      if (locationToAdd.length) {
        if (isBeforeOrAfter === 'before') {
          $(li).insertBefore(locationToAdd.is('li') ? locationToAdd : locationToAdd.closest('li'));
          found = true;
        }
        if (isBeforeOrAfter === 'after') {
          $(li).insertAfter(locationToAdd.is('li') ? locationToAdd : locationToAdd.closest('li'));
          found = true;
        }
        if (isBeforeOrAfter === 'top' && locationToAdd.is('ul')) {
          locationToAdd.prepend(li);
          found = true;
        }
      }
    }

    if (location instanceof jQuery &&
      (!nodeData.parent || !found) && !(nodeData.parent instanceof jQuery) &&
      !/^(top|bottom|before|after)$/g.test(isBeforeOrAfter)) {
      location[0].appendChild(li);
      found = true;
    }

    if (location === 'bottom' && (!nodeData.parent || !found)) {
      this.element[0].appendChild(li);
    }

    if (location === 'top' && (!nodeData.parent || !found)) {
      this.element.prepend(li);
    }

    // Support ParentId in JSON Like jsTree
    if (nodeData.parent) {
      const locationToAdd = location === 'top' ? location : null;
      if (found && typeof nodeData.parent === 'string') {
        li = this.element.find(`#${nodeData.parent}`).parent();

        if (!nodeData.disabled && li.is('.is-selected') && typeof nodeData.selected === 'undefined') {
          nodeData.selected = true;
        }
        this.addAsChild(nodeData, li, locationToAdd);
      }

      if (nodeData.parent && nodeData.parent instanceof jQuery) {
        li = nodeData.parent;
        if (nodeData.parent.is('a')) {
          li = nodeData.parent.parent();
        }
        this.addAsChild(nodeData, li, locationToAdd);
      }
      if (this.isjQuery(li)) {
        nodeData.node = li.find(`ul li a#${nodeData.id}`);
      }
    } else {
      li = $(li);
      this.addChildNodes(nodeData, li);
      nodeData.node = li.children('a').first();
    }

    a = $(a);
    // Added parameter to show or hide checkbox according to node.
    this.decorateNode(a, nodeData.icon, nodeData.hideCheckbox, nodeData);
    this.childrenCountInit(a.parentsUntil(this.element, '.folder:last'));

    if (nodeData.selected) {
      this.selectNode(a, nodeData.focus);
    }

    a.data('jsonData', nodeData);
    this.createSortable();
    return li;
  },

  /**
   * Add a node to an existing node, making it a folder if need be
   * @private
   * @param {object} nodeData data for node to be added.
   * @param {object} li parent node to add node.
   * @param {string} location top|bottom optional.
   * @returns {void}
   */
  addAsChild(nodeData, li, location) {
    li = this.isjQuery(li) ? li[0] : li;
    let ul = li.querySelector('ul');
    const isFolder = !!ul;

    if (!isFolder) {
      li.insertAdjacentHTML('beforeend', '<ul class="folder" role="group"></ul>');
      ul = li.querySelector('ul');
    }

    if (nodeData.open) {
      DOM.addClass(ul, 'is-open');
    }

    if (!isFolder) {
      this.decorateNode(li.querySelector('a'));
    }

    nodeData.parent = '';
    this.addNode(nodeData, $(ul), location);
  },

  /**
   * Add the children for the specified node element,
   * and if `nodeData.children` not passed will remove current children from node
   * @private
   * @param {object} nodeData data for children to be added.
   * @param {object} li parent node to add children.
   * @returns {void}
   */
  addChildNodes(nodeData, li) {
    li = this.isjQuery(li) ? li[0] : li;
    let ul = li.querySelector('ul');

    if (!nodeData.children) {
      if (ul) {
        ul.parentNode.removeChild(ul);
      }
      return;
    }

    if (!ul) {
      li.insertAdjacentHTML('beforeend', `<ul class="folder${nodeData.open ? ' is-open' : ''}" role="group"></ul>`);
      ul = li.querySelector('ul');
    }

    ul.innerHTML = '';

    if (nodeData.children) {
      nodeData.children.forEach(elem => this.addNode(elem, $(ul)));
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
   * @param {object} nodeData to update.
   * @returns {void}
   */
  updateNode(nodeData) {
    // Passed in the node element or find the node in the dataset and ui and sync it
    const elem = nodeData.node ? { node: nodeData.node } : this.findById(nodeData.id);
    if (!elem || !elem.node[0]) {
      return;
    }

    const parent = elem.node[0].parentNode;
    const nodetext = elem.node[0].querySelector('.tree-text');
    const isDisabled = this.isTrue(nodeData.disabled) || this.isFalse(nodeData.enabled);
    const isEnabled = this.isTrue(nodeData.enabled) || this.isFalse(nodeData.disabled);
    const isChildrenNull = nodeData.children === null;

    // Update badge
    if (nodeData.badge) {
      let badge = elem.node[0].querySelector('.tree-badge');
      if (!badge && !nodeData.badge.remove) {
        if (typeof nodeData.badge.text !== 'undefined' && $.trim(nodeData.badge.text) !== '') {
          const newBadge = document.createElement('span');
          DOM.addClass(newBadge, 'tree-badge', 'badge');
          nodetext.parentNode.insertBefore(newBadge, nodetext);
          badge = elem.node[0].querySelector('.tree-badge');
        }
      }
      // Make update changes
      if (badge) {
        if (typeof nodeData.badge.text !== 'undefined') {
          nodeData.badge.text = nodeData.badge.text.toString();
          badge.textContent = nodeData.badge.text;
          DOM.removeClass(badge, 'round');
          if (nodeData.badge.text.length === 1) {
            DOM.addClass(badge, 'round');
          }
        }
        if (typeof nodeData.badge.type !== 'undefined') {
          DOM.removeClass(badge, 'info', 'good', 'error', 'alert', 'pending');

          if (/info|good|error|alert|pending/i.test(nodeData.badge.type)) {
            DOM.addClass(badge, nodeData.badge.type);
          } else if (nodeData.badge.type.charAt(0) === '#' && nodeData.badge.type.length === 7) {
            badge.style.backgroundColor = nodeData.badge.type;
          }

          if (nodeData.badge.type.indexOf('pending') !== -1) {
            badge.textContent = '';
          }
        }
        elem.badge = nodeData.badge;

        // Remove badge
        if (this.parseBool(nodeData.badge.remove)) {
          badge.parentNode.removeChild(badge);
          if (typeof elem.badge !== 'undefined') {
            delete elem.badge;
          }
        }
      }
    }

    if (nodeData.text) {
      nodetext.textContent = nodeData.text;
      elem.text = nodeData.text;
    }

    if (nodeData.icon === null) {
      const next = elem.node[0].nextElementSibling;
      if (next && next.tagName.toLowerCase() === 'ul') {
        this.setFolderIcon(elem.node[0], DOM.hasClass(next, 'is-open'), false, this.settings.expandPlusminusRotate);
      } else {
        this.setTreeIcon(elem.node[0].querySelector('svg.icon-tree'), 'icon-tree-node');
      }
    } else if (nodeData.icon) {
      this.setTreeIcon(elem.node[0].querySelector('svg.icon-tree'), nodeData.icon);
      elem.icon = nodeData.icon;
      const jsonData = elem.node.data('jsonData');
      if (jsonData) {
        jsonData.icon = nodeData.icon;
        elem.node.data('jsonData', jsonData);
      }
    } else if (nodeData.children && nodeData.children.length &&
      !DOM.hasClass(parent, 'folder')) {
      this.convertFileToFolder(elem.node);
    }

    if (isDisabled) {
      DOM.addClass(elem.node[0], 'is-disabled');
      elem.node[0].setAttribute('aria-disabled', 'true');

      if (DOM.hasClass(parent, 'folder') && DOM.hasClass(parent, 'is-open')) {
        const nodes = [].slice.call(parent.querySelectorAll('a, ul[role=group]'));
        nodes.forEach((node) => {
          DOM.addClass(node, 'is-disabled');
          node.setAttribute('aria-disabled', 'true');
        });
      }
    }

    if (isEnabled) {
      const isParentsDisabled = elem.node.parentsUntil(this.element, 'ul[role=group].is-disabled').length > 0;

      if (!isParentsDisabled) {
        DOM.removeClass(elem.node[0], 'is-disabled');
        elem.node[0].removeAttribute('aria-disabled');

        if (DOM.hasClass(parent, 'folder') && DOM.hasClass(parent, 'is-open')) {
          const nodes = [].slice.call(parent.querySelectorAll('a, ul[role=group]'));
          nodes.forEach((node) => {
            DOM.removeClass(node, 'is-disabled');
            node.removeAttribute('aria-disabled');
          });
        }
      }
    }

    if (nodeData.childrenCount) {
      this.updateChildrenCount(elem.node[0], nodeData.childrenCount);
    }

    if (nodeData.node) {
      this.syncDataset();
    }

    // children: null|[] - To remove children key/value and show as leaf node, has to pass children property and value can be `null` or `[] -an empty array`.
    if (nodeData.children || isChildrenNull) {
      if (nodeData.children?.length) {
        this.addChildNodes(nodeData, parent);
      } else {
        this.removeChildren(nodeData, parent);
      }
    }
    this.syncDataset();
    this.createSortable();
  },

  // Performs the usual Boolean coercion with the exception of
  // the strings "false" (case insensitive) and "0"
  parseBool(b) {
    return !(/^(false|0)$/i).test(b) && !!b;
  },

  /**
   * Delete children nodes
   * @private
   * @param {object} nodeData data for icon to be replaced.
   * @param {object} li parent node to delete children.
   * @returns {void}
   */
  removeChildren(nodeData, li) {
    li = this.isjQuery(li) ? li[0] : li;
    const ul = li.querySelector('ul');

    this.setTreeIcon(li.querySelector('svg.icon-tree'), (nodeData.icon || 'icon-tree-node'));
    DOM.removeClass(li, 'folder', 'is-open');

    if (ul) {
      ul.parentNode.removeChild(ul);
    }
  },

  /**
   * Delete a node from the dataset or tree.
   * @param {object} nodeData to delete.
   * @returns {void}
   */
  removeNode(nodeData) {
    let elem = this.findById(nodeData.id);
    let targetNode = null;

    if (nodeData instanceof jQuery) {
      elem = nodeData;
      targetNode = elem.parentsUntil(this.element, '.folder:last');
      elem.parent().remove();
    } else if (elem) {
      targetNode = elem.node.parentsUntil(this.element, '.folder:last');
      elem.node.parent().remove();
    }
    this.childrenCountInit(targetNode);

    if (!elem) {
      return;
    }
    this.syncDataset();
  },

  // Attach Context Menus
  attachMenu(menuId) {
    const self = this;

    if (!menuId) {
      return;
    }

    // Handle focus state after closing contextmenu
    function returnFocus(popupmenuApi, args) {
      if (typeof $(':focus')[0] === 'undefined' && args) {
        args.triggerElement?.focus();
      }
    }

    this.element.off('contextmenu.tree').on('contextmenu.tree', 'a', function (e) {
      const node = $(this);
      e.preventDefault();
      self.popupEl = $(e.currentTarget).popupmenu({ menuId, eventObj: e, trigger: 'immediate', attachToBody: true, returnFocus }).off('selected').on('selected', (event, args) => {
        /**
        * Fires when the an attached context menu item is selected.
        *
        * @event menuselect
        * @memberof Tree
        * @type {object}
        * @property {object} event - The jquery event object
        * @property {object} args for node element, item
        * @property {HTMLElement} args.node The DOM Element.
        * @property {object} data.item The attached node data.
        */
        self.element.triggerHandler('menuselect', { node, item: args });
      });

      /**
      * Fires when the attached context menu is opened. Use it to update the menu as needed
      * @memberof Tree
      * @event menuopen
      * @type {object}
      * @property {object} event - The jquery event object
      * @property {object} args for node element, item
      * @property {HTMLElement} args.menu The menu item
      * @property {HTMLElement} args.node The DOM Element.
      */
      self.element.triggerHandler('menuopen', { menu: $(`#${menuId}`), node });
      return false;
    });
  },

  /**
   * Create sortable.
   * @private
   * @returns {void}
   */
  createSortable() {
    if (!this.settings.sortable) {
      return;
    }

    const self = this;
    let clone;
    let interval;
    let doDrag;

    self.targetArrow = self.element[0].previousElementSibling;
    self.linkSelector = 'a:not(.is-dragging-clone):not(.is-disabled)';

    if (!self.targetArrow || (self.targetArrow && !DOM.hasClass(self.targetArrow, 'tree-drag-target-arrow'))) {
      const div = document.createElement('div');
      DOM.addClass(div, 'tree-drag-target-arrow');
      self.element[0].parentNode.insertBefore(div, self.element[0]);
      self.targetArrow = self.element[0].previousElementSibling;
    }

    function isReady() {
      // Make sure all dynamic nodes sync
      if (!self.loading) {
        clearInterval(interval);

        const links = [].slice.call(self.element[0].querySelectorAll(self.linkSelector));
        links.forEach((link) => {
          const a = $(link);

          // Quit if already binded with `drag`
          if (a.data('drag')) {
            return;
          }

          // Don't drag with folder icon, save for toggle nodes
          a.on('mousedown.tree', (e) => {
            e.preventDefault();

            if (e.which === 3) {
              doDrag = false;
            } else {
              doDrag = DOM.hasClass(e.target, 'icon') ?
                !DOM.hasClass(link.parentNode, 'folder') : true;
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
                DOM.removeClass(link, 'is-dragging');
                if (thisClone) {
                  thisClone[0].parentNode.removeChild(thisClone[0]);
                }
                return;
              }
              clone = thisClone;
              clone[0].removeAttribute('id');
              DOM.addClass(clone[0], 'is-dragging-clone');

              const items = [].slice.call(clone[0].querySelectorAll('.tree-checkbox, .tree-badge'));
              items.forEach(node => node.parentNode.removeChild(node));

              const startUl = a.closest('ul');
              self.sortable = {
                // Do not use index from each loop, get updated index on drag start
                startIndex: $(self.linkSelector, self.element).index(a),
                startNode: a,
                startIcon: $('svg.icon-tree', a).getIconName(),
                startUl,
                startLi: a.closest('li'),
                startFolderNode: startUl.prev('a'),
                startWidth: a.outerWidth()
              };

              self.element.triggerHandler('sortstart', self.sortable);
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
              self.targetArrow.style.display = 'none';
              const items = [].slice.call(self.element[0].querySelectorAll(self.linkSelector));
              items.forEach(node => DOM.removeClass(node, 'is-over'));

              if (!clone || !self.sortable?.overDirection) {
                return;
              }
              clone[0].style.left = `${pos.left}px`;
              clone[0].style.top = `${pos.top}px`;

              const start = self.sortable.startNode.parent();
              const end = self.sortable.overNode.parent();

              // Over
              if (self.sortable.overDirection === 'over') {
                if (!DOM.hasClass(end[0], 'folder')) {
                  self.convertFileToFolder(self.sortable.overNode);
                }
                end[0].querySelector('ul').appendChild(start[0]);
                if (!DOM.hasClass(end[0], 'is-open')) {
                  self.toggleNode(self.sortable.overNode, e);
                }
              } else if (self.sortable.overDirection === 'up') {
                // Up
                start.insertBefore(end);
              } else if (self.sortable.overDirection === 'down') {
                // Down
                if (DOM.hasClass(end[0], 'is-open') && DOM.hasClass(end[0], 'folder')) {
                  $('ul:first', end).prepend(start);
                } else {
                  start.insertAfter(end);
                }
              }

              // Restore file type
              if (!self.sortable.startUl[0].querySelector('li') &&
                !!self.sortable.startFolderNode.data('oldData') &&
                  self.sortable.startFolderNode.data('oldData').type === 'file') {
                self.convertFolderToFile(self.sortable.startFolderNode);
              }

              // Fix: On windows 10 with IE-11 icons disappears
              utils.fixSVGIcons(start);

              self.element.triggerHandler('sortend', self.sortable);
              // Sync dataset and ui
              self.syncDataset();
              if (self.isMultiselect) {
                self.initSelected();
              }
              self.updateAutoChildrenCount(self.element[0]);
              delete self.sortable;
            });
        });
      }
    }
    // Wait for make sure all dynamic nodes sync
    interval = setInterval(isReady, 10);
  },

  /**
   * Set actions while drag over.
   * @private
   * @param {object} clone node.
   * @param {object} pos node positions to compare.
   * @returns {void}
   */
  setDragOver(clone, pos) {
    const self = this;
    const cloneSvg = clone[0].querySelector('svg.icon-tree');
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

    if (!self.sortable) {
      return;
    }

    // Set as out of range
    const outOfRange = function () {
      self.sortable.overNode = null;
      self.sortable.overIndex = null;
      self.sortable.overDirection = null;

      self.targetArrow.style.display = 'none';
      self.setTreeIcon(cloneSvg, 'icon-cancel');
    };

    // Moving inside tree
    if (pos.top > (treeRec.top - extra) &&
        pos.top < (treeRec.bottom + extra) &&
        pos.left > (treeRec.left - extra - self.sortable.startWidth) &&
        pos.left < (treeRec.left + treeRec.height + extra)) {
      extra = 2;
      links = [].slice.call(self.element[0].querySelectorAll(self.linkSelector));

      links.forEach((link, i) => {
        direction = null;
        rec = link.getBoundingClientRect();

        // Moving on/around node range
        if (pos.top > rec.top - extra && pos.top < rec.bottom + extra) {
          a = $(link);

          // Moving on/around node has parents as same node need to rearrange
          // Cannot rearrange parents to child
          isParentsStartNode = !!a.parentsUntil(self.element, '.folder')
            .filter(function () {
              return $('a:first', this).is(self.sortable.startNode) && self.sortable.startLi.is('.folder');
            }).length;
          if (isParentsStartNode) {
            outOfRange();
            return;
          }

          li = link.parentNode;
          left = rec.left;
          ul = a.closest('ul');
          exMargin = parseInt(li.style.marginTop, 10) > 0 ? 2 : 0;
          isBeforeStart = ((i - 1) === self.sortable.startIndex && ul.is(self.sortable.startUl));
          isAfterSttart = ((i + 1) === self.sortable.startIndex && ul.is(self.sortable.startUl));
          links.forEach(node => DOM.removeClass(node, 'is-over'));

          // Apply actions
          /* eslint-disable no-loop-func */
          doAction = function () {
            if (!direction) {
              outOfRange();
              return;
            }

            // Reset icon
            self.setTreeIcon(cloneSvg, self.sortable.startIcon);

            // Over
            if (direction === 'over') {
              self.targetArrow.style.display = 'none';
              if (!DOM.hasClass(link, 'is-disabled')) {
                DOM.addClass(link, 'is-over');
              }
            } else {
              // Up -or- Down
              links.forEach(node => DOM.removeClass(node, 'is-over'));
              top = (direction === 'up') ?
                (rec.top - 1.5 - (DOM.hasClass(li, 'is-active') ? 3 : 0)) :
                (rec.bottom + (li.nextElementSibling && DOM.hasClass(li.nextElementSibling, 'is-active') ? -1 : 1.5) + exMargin);
              self.targetArrow.style.left = `${left}px`;
              self.targetArrow.style.top = `${top}px`;
              self.targetArrow.style.display = 'block';
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
      });
    } else {
      // Out side from tree area
      outOfRange();
    }
  },

  // Convert file node to folder type
  convertFileToFolder(node) {
    const iconEl = $('svg.icon-tree', node);
    const newFolder = document.createElement('ul');
    newFolder.setAttribute('role', 'group');
    DOM.addClass(newFolder, 'folder');
    const oldData = {
      icon: iconEl.getIconName(),
      type: 'file'
    };
    if (this.hasIconClass(node)) {
      const iconClass = node.attr('class').replace(/\s?is-selected/, '');
      oldData.iconClass = iconClass;
      if (!this.settings.useExpandTarget) {
        node.removeClass(iconClass);
      }
    }
    node.data('oldData', oldData);
    const parent = node[0].parentNode;
    if (parent && parent.tagName.toLowerCase() === 'li') {
      DOM.addClass(parent, 'folder');
      parent.appendChild(newFolder);
    }

    // Inject expand target
    iconEl[0].insertAdjacentHTML('afterend', this.getExpandTargetHtml(false));

    // Inject children count
    node[0].insertAdjacentHTML('beforeend', this.getChildrenCountHtml());

    this.setTreeIcon(iconEl, this.settings.folderIconClosed);
  },

  // Convert folder node to file type
  convertFolderToFile(node) {
    const parent = node.parent('.folder');
    parent.removeClass('folder is-open');
    $('.icon-expand-target, .tree-children-count', node).remove();
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
   * @returns {object} The api
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
   * @param {object} settings The settings to apply.
   * @returns {object} The api
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

  /**
   * Disables all nodes in the Tree component
   * @returns {void}
   */
  disable() {
    const nodes = [].slice.call(this.element[0].querySelectorAll('a'));
    nodes.forEach((node) => {
      DOM.addClass(node, 'is-disabled');
      node.setAttribute('aria-disabled', 'true');
    });
  },

  /**
   * Enables all nodes in the Tree component
   * @returns {void}
   */
  enable() {
    const nodes = [].slice.call(this.element[0].querySelectorAll('a'));
    nodes.forEach((node) => {
      DOM.removeClass(node, 'is-disabled');
      node.removeAttribute('aria-disabled');
    });
  },

  /**
   * Preserves all nodes' enablement states in the Tree component
   * @returns {array} of node objects containing attributes nodeId and state (enablement state)
   */
  preserveEnablementState() {
    const nodes = [].slice.call(this.element[0].querySelectorAll('a'));
    const enablementStates = [];

    nodes.forEach((node) => {
      if ((DOM.hasClass(node, 'is-disabled')) || (node.getAttribute('aria-disabled') === true)) {
        enablementStates.push({ nodeId: node.id, state: 'disabled' });
      } else {
        enablementStates.push({ nodeId: node.id, state: 'enabled' });
      }
    });

    this.settings.originalEnablementState = enablementStates;
    return enablementStates;
  },

  /**
   * Restores all nodes' original enablement states in the Tree component
   * @returns {void}
   */
  restoreEnablementState() {
    const s = this.settings;
    const nodes = [].slice.call(this.element[0].querySelectorAll('a'));

    // check to prevent error if preserveEnablementState() has not been invoked
    if (typeof s.originalEnablementState !== 'undefined' &&
      s.originalEnablementState !== null) {
      nodes.forEach((node) => {
        s.originalEnablementState.forEach((origNode) => {
          if (origNode.nodeId === node.id) {
            if (origNode.state === 'disabled') {
              DOM.addClass(node, 'is-disabled');
              node.setAttribute('aria-disabled', 'true');
            } else {
              DOM.removeClass(node, 'is-disabled');
              node.removeAttribute('aria-disabled');
            }
          }
        });
      });
    }
  }

};

export { Tree, COMPONENT_NAME };
