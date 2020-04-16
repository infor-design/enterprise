import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';
import { Tmpl } from '../tmpl/tmpl';
import { Locale } from '../locale/locale';

// Jquery Imports
import '../../utils/animations';

// The name of this component
const COMPONENT_NAME = 'hierarchy';

/**
 * The displays customizable hierarchical data such as an org chart.
 *
 * @class Hierarchy
 * @param {string} element The component element.
 * @param {string} [settings] The component settings.
 * @param {string} [settings.legend] Pass in custom markdown for the legend structure.
 * @param {string} [settings.legendKey] Key to use for the legend matching
 * @param {array} [settings.dataset=[]] Hierarchical Data to display
 * @param {boolean} [settings.newData=[]] New data to be appended into dataset
 * @param {string} [settings.templateId] Additional product name information to display
 * @param {number} [settings.leafHeight=null] Set the height of the leaf
 * @param {number} [settings.leafWidth=null] Set the width of the leaf
 * @param {string} [settings.beforeExpand=null] A callback that fires before node expansion of a node.
 * @param {boolean} [settings.renderSubLevel=false] If true elements with no children will be rendered detached
 * @param {boolean} [settings.layout=string] Which layout should be rendered {'horizontal', 'mobile-only', 'stacked', 'paging'}
 * @param {object} [settings.emptyMessage] An optional settings object for the empty message when there is no data.
 * @param {string} [settings.emptyMessage.title=(Locale ? Locale.translate('NoData')] The text to show
 * @param {string} [settings.emptyMessage.info=''] Longer block of test to show.
 * @param {string} [settings.emptyMessage.icon='icon-empty-no-data'] The icon to show.
 * @param {object} [settings.emptyMessage.button='{}'] The button and text to show with an optional click function.
 */
const HIERARCHY_DEFAULTS = {
  legend: [],
  legendKey: '',
  dataset: [],
  newData: [],
  templateId: '', // Id to the Html Template
  leafHeight: null,
  leafWidth: null,
  beforeExpand: null,
  renderSubLevel: false,
  layout: 'horizontal', // stacked, horizontal, paging, mobile-only
  rootId: null,
  emptyMessage: { title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data' }
};

function Hierarchy(element, settings) {
  this.settings = utils.mergeSettings(element, settings, HIERARCHY_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Hierarchy Methods
Hierarchy.prototype = {
  init() {
    const s = this.settings;

    // Set chart id
    if (this.rootId === null && this.element.attr('id') === undefined) {
      this.rootId = 'hierarchyChart';
    } else if (this.element.attr('id')) {
      this.settings.rootId = this.element.attr('id');
    } else {
      this.rootId = 'hierarchyChart';
    }

    s.colorClass = [
      'azure08', 'turquoise02', 'amethyst06', 'slate06', 'amber06', 'emerald07', 'ruby06'
    ];

    // Setup events
    this.handleEvents();

    // Safety check, check for data
    if (s.dataset === undefined || s.dataset.length === 0 || !Array.isArray(s.dataset)) {
      this.element.emptymessage(s.emptyMessage);
      return;
    }

    if ((s.dataset[0] && s.dataset[0].children) &&
      s.dataset[0].children.length > 0 || this.isStackedLayout()) {
      this.render(s.dataset[0]);
    } else if (s.dataset && s.dataset.children.length > 0) {
      this.render(s.dataset);
    }

    if (s.leafHeight !== null && s.leafWidth !== null) {
      const style = `'body .hierarchy .leaf,body .hierarchy .sublevel .leaf,body .hierarchy .container .root.leaf { width: ${s.leafWidth}px;  height: ${s.leafHeight}px;  }'`;

      $(`<style type="text/css" id="hierarchyLeafStyles">${style}</style>`).appendTo('body');
    }

    if (s.layout) {
      this.setLayout(s.layout);
    }
  },

  /**
   * Setup the hierarchy layout.
   * @private
   * @param {string} layout The layout to display
   * @returns {void}
   */
  setLayout(layout) {
    if (this.isPagingLayout()) {
      layout = 'paging';
    }

    if (this.isMobileOnly()) {
      layout = 'mobile-only';
    }

    switch (layout) {
      case 'horizontal':
        this.element.addClass('layout-is-horizontal');
        break;
      case 'stacked':
        this.element.addClass('layout-is-stacked');
        break;
      case 'paging':
        this.element.addClass('layout-is-paging');
        break;
      case 'mobile-only':
        this.element.addClass('layout-is-mobile-only');
        break;
      default:
        this.element.addClass('layout-is-horizontal');
    }
  },

  /**
   * Attach all event handlers
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    const s = this.settings;

    // Expand or Collapse
    self.element.off('click.hierarchy').on('click.hierarchy', '.btn', function (e) {
      // Stacked layout doesn't expand/collapse
      if (self.isStackedLayout()) {
        return;
      }

      if (s.newData.length > 0) {
        s.newData = [];
      }

      const nodeId = $(this).closest('.leaf').attr('id');
      const nodeData = $(`#${nodeId}`).data();
      const domObject = {
        branch: $(this).closest('li'),
        leaf: $(this).closest('.leaf'),
        button: $(this)
      };

      if (nodeData.isExpanded) {
        self.collapse(e, nodeData, domObject);
      } else {
        self.expand(e, nodeData, domObject);
      }
    });

    this.element.on('keypress', '.leaf', function (e) {
      const nodeId = $(this).attr('id');
      const nodeData = $(`#${nodeId}`);

      if (e.which === 13) {
        if (nodeData.isExpanded) {
          self.collapse(e, nodeData);
        } else {
          self.expand(e, nodeData);
        }
      }
    });

    self.element.off('dblclick.hierarchy').on('dblclick.hierarchy', '.leaf', (e) => {
      const nodeId = e.currentTarget.id;
      const nodeData = $(`#${nodeId}`).data();
      const dblClickEvent = { event: e, data: nodeData };
      e.stopImmediatePropagation();

      this.element.trigger('dblclick', dblClickEvent);
    });

    /**
     * Fires when node is selected
     * @event selected
     * @memberof Hierarchy
     * @param {object} event - The jquery event object
     * @param {object} eventInfo - More info to identify the node.
     */
    self.element.on('mouseup', '.leaf, .back button', function (e) {
      const leaf = $(this);
      const target = $(e.target);
      const hierarchy = leaf.closest('.hierarchy').data('hierarchy');
      const nodeData = leaf.data();
      const nodeId = $(this).attr('id');
      const targetInfo = { target: e.target, pageX: e.pageX, pageY: e.pageY };
      const isButton = target.is('button');
      const isNotBack = !target.hasClass('btn-back');
      const isBack = target.is('.btn-back');
      const svgHref = target.find('use').prop('href');
      const isCollapseButton = svgHref ? svgHref.baseVal === '#icon-caret-up' : false;
      const isExpandButton = svgHref ? svgHref.baseVal === '#icon-caret-down' : false;
      const isForward = svgHref ? svgHref.baseVal === '#icon-caret-right' : false;
      const isActions = target.hasClass('btn-actions');
      const isAction = target.is('a') && target.parent().parent().is('ul.popupmenu');
      const isAncestor = leaf.hasClass('ancestor');
      let eventType = 'selected';

      e.stopImmediatePropagation();

      if (isAction && $(target).parent().data('disabled')) {
        return;
      }

      $('.is-selected').removeClass('is-selected');
      $(`#${nodeId}`).addClass('is-selected');

      // Is collapse event
      if (isButton && isCollapseButton && isNotBack) {
        eventType = isAncestor ? 'back' : 'collapse';
      }

      // Is expand event
      if (isButton && isExpandButton && isNotBack) {
        eventType = 'expand';
      }

      if (isBack) {
        eventType = 'back';
      }

      if (isActions) {
        eventType = 'actions';
        hierarchy.buildActionsMenu(nodeData, leaf);
      }

      if (isAction) {
        eventType = 'action';
      }

      if (isButton && isForward && isNotBack) {
        eventType = 'forward';
      }

      // Is right click event
      if (e.which === 3) {
        eventType = 'rightClick';
      }

      if (!hierarchy) {
        return;
      }

      const eventInfo = {
        id: nodeId,
        data: nodeData,
        actionReference: isAction ? target.data('actionReference') : null,
        targetInfo,
        eventType,
        isForwardEvent: hierarchy.isForwardEvent(eventType),
        isBackEvent: hierarchy.isBackEvent(eventType),
        isAddEvent: hierarchy.isAddEvent(eventType),
        isExpandEvent: hierarchy.isExpandEvent(eventType),
        isCollapseEvent: hierarchy.isCollapseEvent(eventType),
        isSelectedEvent: hierarchy.isSelectedEvent(eventType),
        isActionsEvent: hierarchy.isActionsEvent(eventType),
        isActionEvent: hierarchy.isActionEvent(eventType),
        allowLazyLoad: hierarchy.allowLazyLoad(nodeData, eventType)
      };

      leaf.trigger('selected', eventInfo);
    });
  },

  /**
   * Manually set selection on a leaf
   * @public
   * @param {string} nodeId id used to find leaf
   */
  selectLeaf(nodeId) {
    const leaf = $(`#${nodeId}`);
    $('.is-selected').removeClass('is-selected');
    leaf.addClass('is-selected');

    const eventInfo = {
      data: leaf.data(),
      actionReference: null,
      isForwardEvent: false,
      isBackEvent: false,
      isAddEvent: false,
      isExpandEvent: false,
      isCollapseEvent: false,
      isSelectedEvent: true,
      isActionsEvent: false,
      isActionEvent: false,
      allowLazyLoad: false
    };

    leaf.trigger('selected', eventInfo);
  },

  /**
   * Update existing leaf actions with new actions
   * @public
   * @param {object} eventInfo eventType, target, data, ect..
   * @param {array} updatedActions -actions to be appended to the menu
   */
  updateActions(eventInfo, updatedActions) {
    const leaf = $(eventInfo.targetInfo.target).closest('.leaf');
    const nodeData = eventInfo.data;
    const popupMenu = $(leaf).find('.popupmenu');
    const popupMenuControl = popupMenu.data('trigger').data().popupmenu;
    const lineItemsToRemove = popupMenu.find('li').not(':eq(0)');

    $(lineItemsToRemove).each((idx, item) => {
      $(item).remove();
    });

    nodeData.menu.actions = updatedActions;
    popupMenu.append(this.getActionMenuItems(nodeData));

    popupMenuControl.open();
  },

  /**
   * @private
   * @param {object} data associated with leaf
   * @param {leaf} leaf jQuery reference in DOM
   */
  buildActionsMenu(data, leaf) {
    const popupMenu = $(leaf).find('.popupmenu');
    const template = [];

    // Safety
    if (data.menu === undefined) {
      return;
    }

    // Reset & rebuild
    popupMenu.empty();

    if (data.menu.details) {
      popupMenu.addClass('has-detail-fields');
      template.push(`<li><div class="detail-fields">${data.menu.details.map(v => `<div class="dt-fields-row"><div class="dt-fields-cell">${v.key}</div><div class="dt-fields-cell">${v.value}</div></div>`).join('')}</div></li>`);
    }

    if (data.menu.actions) {
      template.push(this.getActionMenuItems(data));
    }

    template.forEach((i) => { popupMenu.append(i); });
  },

  /**
   * @private
   * @param {object} data the data to be iterated
   * @returns {string} returns list items as a string
   */
  getActionMenuItems(data) {
    const actions = data.menu.actions.map((a) => {
      if (a.disabled === undefined) {
        a.disabled = false;
      }

      return a;
    });

    // Ignoring next line. Eslint expects template literals vs string concat.
    // However template literals break JSON.stringify() in this case
    /* eslint-disable */
    const actionMarkup = actions.map(a => {
      if (a.hasOwnProperty('data')) {
        if (a.data.type === 'separator') {
          return `<li class="separator"></li>`
        }
      }
      return `
        <li data-disabled='${a.disabled}' class='${a.menu ? 'submenu' : ''}'>
          <a href='${a.url}' data-action-reference='` + JSON.stringify(a.data) + `'>
            ${a.value}
            ${a.menu ? '<svg class="arrow icon-dropdown icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-dropdown"></use></svg>' : ''}
          </a>
          ${a.menu ? `<div class="wrapper" role="application" aria-hidden="true">
            <ul class="popupmenu">
              ${a.menu.map(i => `
              <li data-disabled='${a.disabled}'>
                <a href='${a.url}' data-action-reference='` + JSON.stringify(a.data) + `'>${i.value}</a>
              </li>`).join('')}
            </ul>
          </div>` : ''}
        </li>`
    }).join('');
    /* eslint-enable */

    return actionMarkup;
  },

  /**
   * Check if event is back
   * @private
   * @param {string} eventType is back
   * @returns {boolean} true if back event
   */
  isBackEvent(eventType) {
    return eventType === 'back';
  },

  /**
   * Check if event is forward
   * @private
   * @param {string} eventType is forward
   * @returns {boolean} true if forward event
   */
  isForwardEvent(eventType) {
    return eventType === 'forward';
  },

  /**
   * Check if event is add
   * @private
   * @param {string} eventType is add
   * @returns {boolean} true if add event
   */
  isAddEvent(eventType) {
    return eventType === 'add';
  },

  /**
   * Check if event is expand
   * @private
   * @param {string} eventType is expand
   * @returns {boolean} true if expand event
   */
  isExpandEvent(eventType) {
    return eventType === 'expand';
  },

  /**
   * Check if event is collapse
   * @private
   * @param {string} eventType is collapse
   * @returns {boolean} true if collapse event
   */
  isCollapseEvent(eventType) {
    return eventType === 'collapse';
  },

  /**
   * Check if event is selected
   * @private
   * @param {string} eventType is selected
   * @returns {boolean} true if selected event
   */
  isSelectedEvent(eventType) {
    return eventType === 'selected';
  },

  /**
   * Checks if is actions event
   * @private
   * @param {string} eventType is actions
   * @returns {boolean} true if actions event
   */
  isActionsEvent(eventType) {
    return eventType === 'actions';
  },

  /**
   * @private
   * @param {string} evenType is action
   * @returns {boolean} true if action
   */
  isActionEvent(evenType) {
    return evenType === 'action';
  },

  /**
   * Check to see if lazy load is allowed
   * @private
   * @param {object} data contains info
   * @param {string} eventType is expand
   * @returns {boolean} true if lazy load is allowed
   */
  allowLazyLoad(data, eventType) {
    if (data === undefined || eventType === undefined) {
      return false;
    }
    return !data.isLoaded && !data.isLeaf && eventType === 'expand';
  },

  /**
   * Process data attached through jquery data
   * @private
   * @param {string} nodeId .
   * @param {string} currentDataObject .
   * @param {string} newDataObject .
   * @param {string} params .
   * @returns {object} data
   */
  data(nodeId, currentDataObject, newDataObject, params) {
    /* eslint-disable no-use-before-define */
    if (params === undefined) {
      params = {};
    }

    const s = this.settings;
    const obj = currentDataObject.isRootNode ? currentDataObject : currentDataObject[0];
    const nodeData = [];

    if (s.newData.length > 0) {
      s.newData = [];
    }

    function addChildrenToObject(thisObj, thisParams) {
      if (thisParams.insert) {
        delete thisObj.isLeaf;
        thisObj.isExpanded = true;
      }
      if (newDataObject.length !== 0 && thisParams.insert) {
        thisObj.children = [newDataObject];
      } else {
        thisObj.children = newDataObject;
      }
    }

    function checkForChildren(self, thisObj, thisNewDataObject) {
      Object.keys(thisObj).forEach((prop) => {
        if (prop === 'id' && nodeId === thisObj.id) {
          if (!thisObj.isLoaded && !thisObj.isRootNode) {
            addChildrenToObject(thisObj, params);
          }
          nodeData.push(thisObj);
        }
      });
      if (thisObj.children) {
        processData(self, thisObj.children, thisNewDataObject); // eslint-disable-line
      }
    }

    function processData(self, thisObj, thisNewDataObject) {
      if (thisObj.length === undefined) {
        checkForChildren(self, thisObj, thisNewDataObject);
      } else {
        for (let i = 0, l = thisObj.length; i < l; i++) {
          checkForChildren(self, thisObj[i], thisNewDataObject);
        }
      }
    }

    if (newDataObject !== undefined) {
      processData(this, obj, newDataObject);
    }

    if (nodeData.length !== 0) {
      $(`#${nodeData[0].id}`).data(nodeData[0]);
    }

    return nodeData[0];
    /* eslint-enable no-use-before-define */
  },

  /**
   * Add data as children for the given nodeId.
   * @private
   * @param {string} nodeId .
   * @param {object} currentDataObject info
   * @param {object} newDataObject .
   * @returns {void}
   */
  add(nodeId, currentDataObject, newDataObject) {
    const s = this.settings;
    const id = currentDataObject.id !== undefined ? currentDataObject.id : nodeId;
    const node = $(`#${id}`);
    const parentContainer = node.parent().hasClass('leaf-container') ? node.parent().parent() : node.parent();
    const selectorObject = {};
    const isSubLevelChild = parentContainer.parent().attr('class') !== 'sub-level';
    const subListExists = parentContainer.children('.sublist').length === 1;

    if (isSubLevelChild) {
      if (subListExists) {
        selectorObject.element = parentContainer.children('.sublist');
      } else {
        selectorObject.el = parentContainer.append('<ul class=\'sublist\'></ul>');
        selectorObject.element = $(selectorObject.el).find('.sublist');
      }
    } else {
      selectorObject.el = parentContainer.children('ul');
      selectorObject.element = $(selectorObject.el);
    }

    if (selectorObject.element.length === 0) {
      selectorObject.el = parentContainer.append('<ul></ul>');
      selectorObject.element = $(selectorObject.el).find('ul');
    }

    if (!currentDataObject.isRootNode) {
      for (let i = 0, l = newDataObject.length; i < l; i++) {
        s.newData.push(newDataObject[i]);
      }
      this.createLeaf(newDataObject, selectorObject.element);
    }

    this.updateState(node, false, null, 'add');
  },

  /**
   * Closes popupmenu
   * @private
   * @param {object} node leaf containing btn-actions
   */
  closePopupMenu(node) {
    const actionButton = node.find('.btn-actions');

    if (actionButton.length !== 0) {
      actionButton.data('popupmenu').close();
    }
  },

  /**
   * Expand the nodes until nodeId is displayed on the page.
   * @private
   * @param {object} event .
   * @param {object} nodeData info
   * @param {object} domObject .
   * @returns {void}
   */
  expand(event, nodeData, domObject) {
    const s = this.settings;
    const node = domObject.leaf;
    let nodeTopLevel = node.next();

    // close popupmenu if open
    this.closePopupMenu(node);

    nodeTopLevel.animateOpen();
    /**
     * Fires when leaf expanded.
     *
     * @event expanded
     * @memberof Hierarchy
     * @type {object}
     * @param {object} event - The jquery event object
     * @param {array} args [nodeData, dataset]
     */
    this.element.trigger('expanded', [nodeData, s.dataset]);

    if (node.hasClass('root')) {
      nodeTopLevel = nodeTopLevel.next('ul');
      nodeTopLevel.animateOpen();
    }

    node.parent().removeClass('branch-collapsed').addClass('branch-expanded');
    this.updateState(node, false, null, 'expand');
  },

  /**
   * Collapse the passed in nodeId.
   * @private
   * @param {object} event .
   * @param {object} nodeData info
   * @param {object} domObject .
   * @returns {void}
   */
  collapse(event, nodeData, domObject) {
    const s = this.settings;
    const node = domObject.leaf;
    let nodeTopLevel = node.next();

    // close popupmenu if open
    this.closePopupMenu(node);

    nodeTopLevel.animateClosed().on('animateclosedcomplete', () => {
      /**
       * Fires when leaf collapsed.
       *
       * @event collapsed
       * @memberof Hierarchy
       * @type {object}
       * @param {object} event - The jquery event object
       * @param {array} args [nodeData, dataset]
       */
      this.element.trigger('collapsed', [nodeData, s.dataset]);
    });

    if (node.hasClass('root')) {
      nodeTopLevel = nodeTopLevel.next('ul');
      nodeTopLevel.animateClosed();
    }

    node.parent().removeClass('branch-expanded').addClass('branch-collapsed');
    this.updateState(node, false, null, 'collapse');
  },

  /**
   * Main render method
   * @private
   * @param {object} data info.
   * @returns {void}
   */
  render(data) {
    /* eslint-disable no-use-before-define */
    const s = this.settings;
    const thisLegend = s.legend;
    const thisChildren = data.children;
    const rootNodeHTML = [];
    const structure = {
      legend: '<legend><ul></ul></legend>',
      chart: '<ul class="container"><li class="chart"></li></ul>',
      toplevel: this.isPagingLayout() ? '<ul class="child-nodes"></ul>' : '<ul class="top-level"></ul>',
      sublevel: this.isPagingLayout() ? '' : '<ul class="sub-level"></ul>'
    };

    // Append chart structure to hierarchy container
    $(`#${this.settings.rootId}`).append(structure.chart);

    const chart = $(`#${this.settings.rootId} .chart`);

    if (thisLegend.length !== 0) {
      $(`#${this.settings.rootId}`).prepend(structure.legend);
      const element = $(`#${this.settings.rootId} legend`);
      this.createLegend(element);
    }

    // check to see how many children are not leafs and have children
    if (this.isSingleChildWithChildren()) {
      $(chart).addClass('has-single-child');
    }

    // Create root node
    this.setColor(data);

    if (this.isPagingLayout() && data.parentDataSet) {
      const backMarkup = '' +
        '<div class="back">' +
        '<button type="button" class="btn-icon hide-focus btn-back">' +
        '<svg class="icon" focusable="false" aria-hidden="true" role="presentation">' +
        '<use href="#icon-caret-left"></use>' +
        '</svg>' +
        '<span>Back</span>' +
        '</button>' +
        '</div>';

      // Append back button to chart to go back to view previous level
      const backButton = $(backMarkup).appendTo(chart);

      // Wrap back button and leaf after leaf has been rendered
      setTimeout(() => backButton.next($('.leaf')).addBack($('.back')).wrapAll('<div class="back-container"></div>'));

      // Attach data reference to back button
      backButton.children('button').data(data);

      // Class used to adjust heights and account for back button
      $(chart).addClass('has-back');
    }

    if (data.isMultiRoot) {
      let multiRootHTML = `<div class="leaf multiRoot"><div><h2>${data.multiRootText}</h2></div></div>`;
      multiRootHTML = xssUtils.sanitizeHTML(multiRootHTML);
      rootNodeHTML.push(multiRootHTML);
      $(rootNodeHTML[0]).addClass('root').appendTo(chart);
    } else if (data.ancestorPath !== null && data.ancestorPath !== undefined) {
      data.ancestorPath.push(data.centeredNode);
      let ancestorHTML = `${data.ancestorPath.map(a => ` ${this.getTemplate(a)} `).join('')}`;
      ancestorHTML = xssUtils.sanitizeHTML(ancestorHTML);
      rootNodeHTML.push(ancestorHTML);
      $(rootNodeHTML[0]).addClass('root ancestor').appendTo(chart);

      const roots = this.element.find('.leaf.root');

      roots.each((index, root) => {
        this.updateState(root, false, data.ancestorPath[index], 'add');

        if (index === roots.length - 1) {
          $(root).addClass('is-selected');
        }
      });
    } else {
      const centeredNode = data.centeredNode;
      let leaf;

      if (this.isStackedLayout() && centeredNode !== null) {
        leaf = this.getTemplate(centeredNode);
      } else if (!this.isStackedLayout()) {
        leaf = this.getTemplate(data);
      }

      if (leaf) {
        leaf = xssUtils.sanitizeHTML(leaf);
        rootNodeHTML.push(leaf);
        $(rootNodeHTML[0]).addClass('root is-selected').appendTo(chart);
      }

      if (centeredNode && centeredNode !== null) {
        this.updateState(this.element.find('.leaf.root'), true, centeredNode, undefined);
      } else {
        this.updateState(this.element.find('.leaf.root'), true, data, undefined);
      }
    }

    function renderSubChildren(self, subArray, thisData) {
      if (subArray !== null && subArray !== undefined) {
        for (let i = 0, l = subArray.length; i < l; i++) {
          const obj = subArray[i];
          subArrayChildren(self, obj, thisData);  // eslint-disable-line
        }
      }
    }

    // Create children nodes
    if (thisChildren && thisChildren.length > 0) {
      for (let i = 0, l = thisChildren.length; i < l; i++) {
        const childObject = data.children[i].children;

        // If child has no children then render the element in the top level
        // If paging then render all children in the top level
        // If not paging and child has children then render in the sub level
        if (this.isLeaf(thisChildren[i]) && !this.isPagingLayout() && s.renderSubLevel) {
          this.createLeaf(data.children[i], $(structure.toplevel));
        } else if (this.isPagingLayout()) {
          this.createLeaf(data.children[i], $(structure.toplevel));
        } else {
          this.createLeaf(data.children[i], $(structure.sublevel));
        }

        if (childObject !== undefined && childObject !== null) {
          const subArray = data.children[i].children;
          const self = this;
          renderSubChildren(self, subArray, data);
        }
      }
    }

    function subArrayChildren(self, obj, thisData) {
      Object.keys(obj).forEach((prop) => {
        if (prop === 'children') {
          const nodeId = obj.id;
          const currentDataObject = obj;
          const newDataObject = obj.children;

          if (newDataObject !== null && newDataObject !== undefined) {
            if (newDataObject.length > 0) {
              self.add(nodeId, currentDataObject, newDataObject);
            }
          }
          return renderSubChildren(self, newDataObject, thisData);
        }
        return true;
      });
    }

    const containerWidth = this.element.find('.container').outerWidth();
    const windowWidth = $(window).width();
    const center = (containerWidth - windowWidth) / 2;
    this.element.scrollLeft(center);

    // Add a no-sublevel class if only two levels (to remove extra border)
    const topLevel = this.element.find('.top-level');
    if (this.element.find('.sub-level').length === 0 && topLevel.length === 1) {
      topLevel.addClass('no-sublevel');
    }

    /* eslint-enable no-use-before-define */
  },

  /**
   * @private
   * @returns {boolean} true if paging layout
   */
  isPagingLayout() {
    return this.settings.layout && this.settings.layout === 'paging';
  },

  /**
   * @private
   * @returns {boolean} true if mobile only
   */
  isMobileOnly() {
    return this.settings.layout && this.settings.layout === 'mobile-only';
  },

  /**
   * @private
   * @returns {boolean} true if stacked layout
   */
  isStackedLayout() {
    return this.settings.layout && this.settings.layout === 'stacked';
  },

  /**
   * Checks to see if children have children
   * @private
   * @returns {boolean} true if have children
   */
  isSingleChildWithChildren() {
    if (this.isStackedLayout()) {
      return false;
    }

    const s = this.settings;
    if (s.dataset && (s.dataset[0] && s.dataset[0].children)) {
      let i = s.dataset[0].children.length;
      let count = 0;

      while (i--) {
        if (!s.dataset[0].children[i].isLeaf) {
          count++;
        }
      }

      return count === 1;
    }
    return false;
  },

  /**
   * Builds leaf template
   * @private
   * @param {object} data leaf data
   * @returns {string} compiled template as HTML string
   */
  getTemplate(data) {
    const template = Tmpl.compile(`{{#dataset}}${$(`#${xssUtils.stripTags(this.settings.templateId)}`).html()}{{/dataset}}`, { dataset: data });

    // Init popupmenu after rendered in DOM
    setTimeout(() => {
      const actionButton = $(`#btn-${xssUtils.stripTags(data.id)}`);
      if (actionButton.length !== 0) {
        actionButton.hideFocus().popupmenu({ attachToBody: false });
      }
    }, 1);

    return $(template).prop('outerHTML');
  },

  /**
   * Add the legend from the Settings
   * @private
   * @param {object} element .
   * @returns {void}
   */
  createLegend(element) {
    const s = this.settings;
    const mod = 4;
    let index = 0;

    for (let i = 0, l = s.legend.length; i < l; i++) {
      const thislabel = s.legend[i].label;
      const color = s.colorClass[i];

      if ((i - (1 % mod)) + 1 === mod) {
        element.append('<ul></ul>');
        index++;
      }

      element.children('ul').eq(index).append('' +
        `<li>
          <span class="key ${color}"></span>
          <span>${thislabel}</span>
        </li>`);
    }
  },

  /**
   * Creates a leaf node under element for nodeData
   * @private
   * @param {object} nodeData contains info.
   * @param {object} container .
   * @returns {void}
   */
  createLeaf(nodeData, container) {
    const self = this;
    // Needs to be unique in the chance of multiple charts
    const chart = $(`#${self.settings.rootId} .chart`, self.container);
    const elClassName = container.attr('class');
    const el = elClassName !== undefined ? $(`#${self.settings.rootId} .${elClassName}`) : container;

    if (el.length < 1) {
      if (elClassName === 'top-level') {
        container.insertAfter('.root');
      } else {
        container.appendTo(chart);
      }
    }

    function processDataForLeaf(thisNodeData) {
      self.setColor(thisNodeData);

      const leaf = self.getTemplate(thisNodeData);
      const rootId = self.settings.rootId;

      let parent = el.length === 1 ? el : container;
      let branchState = thisNodeData.isExpanded || thisNodeData.isExpanded === undefined ? 'branch-expanded' : 'branch-collapsed';

      if (thisNodeData.isLeaf) {
        branchState = '';
      }

      if ($(`#${rootId} #${thisNodeData.id}`).length === 1) {
        return;
      }

      parent.append(`<li class=${branchState}>${$(leaf)[0].outerHTML}</li>`);

      if (thisNodeData.children) {
        let childrenNodes = '';

        for (let j = 0, l = thisNodeData.children.length; j < l; j++) {
          self.setColor(thisNodeData.children[j]);
          const childLeaf = self.getTemplate(thisNodeData.children[j]);

          if (j === thisNodeData.children.length - 1) {
            childrenNodes += `<li>${$(childLeaf)[0].outerHTML}</li>`;
          } else {
            childrenNodes += `<li>${$(childLeaf)[0].outerHTML}</li>`;
          }
        }

        parent = $(`#${rootId} #${xssUtils.stripTags(thisNodeData.id)}`).parent();
        parent.append(`<ul>${childrenNodes}</ul>`);

        let childLength = thisNodeData.children.length;
        while (childLength--) {
          const lf = $(`#${rootId} #${xssUtils.stripTags(thisNodeData.children[childLength].id)}`);
          self.updateState(lf, false, thisNodeData.children[childLength], undefined);
        }
      }
    }

    if (nodeData.length) {
      for (let i = 0, l = nodeData.length; i < l; i++) {
        const isLast = (i === (nodeData.length - 1));
        processDataForLeaf(nodeData[i], isLast);
        self.updateState($(`#${self.settings.rootId} #${xssUtils.stripTags(nodeData[i].id)}`), false, nodeData[i], undefined);
      }
    } else {
      processDataForLeaf(nodeData, true);
      self.updateState($(`#${self.settings.rootId} #${xssUtils.stripTags(nodeData.id)}`), false, nodeData, undefined);
    }
  },

  /**
   * Set leaf colors matching data to key in legend
   * @private
   * @param {object} data contains info.
   * @returns {void}
   */
  setColor(data) {
    const s = this.settings;
    this.setRootColor(data);

    if (this.isStackedLayout()) {
      if (data.ancestorPath && data.ancestorPath !== null) {
        data.ancestorPath.forEach((d) => {
          this.setRootColor(d);
        });
      }

      if (data.centeredNode && data.centeredNode !== null) {
        this.setRootColor(data.centeredNode);
      }
    }

    if (data.children && !data.isRootNode) {
      for (let k = 0, ln = data.children.length; k < ln; k++) {
        for (let j = 0, x = s.legend.length; j < x; j++) {
          if (data.children[k][s.legendKey] === s.legend[j].value) {
            data.children[k].colorClass = s.colorClass[j];
          }
        }
      }
    }
  },

  /**
   * Set the color of the root element.
   * @private
   * @param {object} data  The data object to use.
   */
  setRootColor(data) {
    const s = this.settings;
    for (let i = 0, l = s.legend.length; i < l; i++) {
      if (data[s.legendKey] === s.legend[i].value) {
        data.colorClass = s.colorClass[i];
        break;
      } else if (data[s.legendKey] === '') {
        data.colorClass = 'default-color';
      }
    }
  },

  /**
   * Check to see if particular node is a leaf
   * @private
   * @param {object} dataNode contains data info
   * @returns {boolean} whether or not a particular node is a leaf
   */
  isLeaf(dataNode) {
    const s = this.settings;
    if (dataNode.isLeaf) {
      return dataNode.isLeaf;
    }

    if (s.beforeExpand) {
      return dataNode.isLeaf;
    }

    // Node is not a leaf and should display and expand/collapse icon
    if ((dataNode.children && dataNode.children.length > 0)) {
      return false;
    }

    return true;
  },

  /**
   * Handle all leaf state here,
   * get the current state via .data() and re-attach the new state
   * @private
   * @param {string} leaf .
   * @param {boolean} isRoot .
   * @param {object} nodeData .
   * @param {string} eventType .
   * @returns {void}
   */
  updateState(leaf, isRoot, nodeData, eventType) {
    // set data if it has not been set already
    if ($.isEmptyObject($(leaf).data()) && nodeData) {
      const d = nodeData === undefined ? {} : nodeData;
      $(leaf).data(d);
    }

    const s = this.settings;
    const btn = $(leaf).find('.btn');
    const expandCaret = this.isPagingLayout() ? 'caret-right' : 'caret-up';
    let data = $(leaf).data();

    if (data === undefined && nodeData !== undefined) {
      data = nodeData;
    }

    // data has been loaded if it has children
    if ((data.children && data.children.length !== 0) || eventType === 'add') {
      data.isExpanded = true;
      data.isLoaded = true;
    }

    if (isRoot) {
      data.isRootNode = true;
      data.isLoaded = true;
    }

    if ((data.isExpanded === undefined && data.children) || eventType === 'expand') {
      data.isExpanded = true;
    }

    // defaults to collapsed state
    if (data.isExpanded === undefined || eventType === 'collapse') {
      data.isExpanded = false;
    }

    if (data.isExpanded) {
      btn.find('svg.icon').changeIcon(expandCaret);
      btn.addClass('btn-expand').removeClass('btn-collapse');
    } else {
      btn.find('svg.icon').changeIcon('caret-down');
      btn.addClass('btn-collapse').removeClass('btn-expand');
    }

    if (data.isLeaf || data.isRootNode) {
      btn.addClass('btn-hidden');
    }

    if (data.isLeaf) {
      data.isLoaded = false;
      data.isExpanded = false;
    }

    // Keep reference of the parent dataset for paging
    if (this.isPagingLayout()) {
      data.parentDataSet = s.dataset;
    }

    // Reset data
    $(leaf).data(data);
  },

  /**
   * Reloads hierarchy control with new dataset
   * @private
   * @param {object} options hierarchy
   * @returns {void}
   */
  reload(options) {
    this.destroy();
    this.element.hierarchy(options);
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {void}
   */
  unbind() {
    this.element.empty();
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, HIERARCHY_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
   * Removes the component from existence
   * @returns {void}
   */
  destroy() {
    this.unbind();
    this.element.removeData(COMPONENT_NAME);
  }

};

export { Hierarchy, COMPONENT_NAME };
