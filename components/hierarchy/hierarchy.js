import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

// Jquery Imports
import '../utils/animations';

// The name of this component
const COMPONENT_NAME = 'hierarchy';

/**
* @namespace
* @property {string} legend  Pass in custom markdown for the legend structure.
* @property {string} legendKey  Key to use for the legend matching
* @property {string} dataset  Hierarchical Data to display
* @property {boolean} newData  New data to be appended into dataset
* @property {string} templateId  Additional product name information to display
* @property {boolean} mobileView  If true will only show mobile view, default using device info.
* @property {string} beforeExpand  A callback that fires before node expansion of a node.
*/
const HIERARCHY_DEFAULTS = {
  legend: [],
  legendKey: '',
  dataset: [],
  newData: [],
  templateId: '', // Id to the Html Template
  mobileView: false,
  leafHeight: null,
  leafWidth: null,
  beforeExpand: null,
  paging: false
};

/**
* The displays customizable hierarchical data such as an org chart.
*
* @class Hierarchy
* @param {string} element The component element.
* @param {string} settings The component settings.
*/
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
    const isMobile = $(this.element).parent().width() < 610; // Phablet down
    const s = this.settings;
    this.mobileView = !!isMobile;
    s.colorClass = [
      'azure08', 'turquoise02', 'amethyst06', 'slate06', 'amber06', 'emerald07', 'ruby06'
    ];
    this.handleEvents();

    // Safety check, check for data
    if (s.dataset) {
      if (s.dataset[0] && s.dataset[0].children.length > 0) {
        this.render(s.dataset[0]);
      } else if (s.dataset && s.dataset.children.length > 0) {
        this.render(s.dataset);
      } else {
        $(this.element).append('<p style="padding:10px;">No data available</p>');
      }
    }

    if (s.leafHeight !== null && s.leafWidth !== null) {
      const style = `'body .hierarchy .leaf,body .hierarchy .sublevel .leaf,body .hierarchy .container .root.leaf { width: ${s.leafWidth}px;  height: ${s.leafHeight}px;  }'`;

      $(`<style type="text/css" id="hierarchyLeafStyles">${style}</style>`).appendTo('body');
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

    /**
    * Fires when node is selected
    * @event selected
    * @property {object} event - The jquery event object
    * @property {object} eventInfo - More info to identify the node.
    */
    self.element.on('mousedown', '.leaf, .back button', function (e) {
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
      let eventType = 'selected';

      $('.is-selected').removeClass('is-selected');
      $(`#${nodeId}`).addClass('is-selected');

      // Is collapse event
      if (isButton && isCollapseButton && isNotBack) {
        eventType = 'collapse';
      }

      // Is expand event
      if (isButton && isExpandButton && isNotBack) {
        eventType = 'expand';
      }

      if (isBack) {
        eventType = 'back';
      }

      // Is right click event
      if (e.which === 3) {
        eventType = 'rightClick';
      }

      const eventInfo = {
        data: nodeData,
        targetInfo,
        eventType,
        isAddEvent: hierarchy.isAddEvent(eventType),
        isExpandEvent: hierarchy.isExpandEvent(),
        isCollapseEvent: hierarchy.isCollapseEvent(),
        isSelectedEvent: hierarchy.isSelectedEvent(),
        allowLazyLoad: hierarchy.allowLazyLoad(nodeData, eventType)
      };

      leaf.trigger('selected', eventInfo);
    });
  },

  /**
   * Check if event is add
   * @private
   * @param {String} eventType is add
   * @returns {Boolean} true if add event
   */
  isAddEvent(eventType) {
    return eventType === 'add';
  },

  /**
   * Check if event is expand
   * @private
   * @param {String} eventType is expand
   * @returns {Boolean} true if expand event
   */
  isExpandEvent(eventType) {
    return eventType === 'expand';
  },

  /**
   * Check if event is collapse
   * @private
   * @param {String} eventType is collapse
   * @returns {Boolean} true if collapse event
   */
  isCollapseEvent(eventType) {
    return eventType === 'collapse';
  },

  /**
   * Check if event is select
   * @private
   * @param {String} eventType is select
   * @returns {Boolean} true if select event
   */
  isSelectedEvent(eventType) {
    return eventType === 'select';
  },

  /**
   * Check to see if lazy load is allowed
   * @private
   * @param {Object} data contains info
   * @param {String} eventType is expand
   * @returns {Boolean} true if lazy load is allowed
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
   * @param {String} nodeId .
   * @param {String} currentDataObject .
   * @param {String} newDataObject .
   * @param {String} params .
   * @returns {Object} data
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
   * @param {String} nodeId .
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

    if (!currentDataObject.isRootNode) {
      for (let i = 0, l = newDataObject.length; i < l; i++) {
        s.newData.push(newDataObject[i]);
      }
      this.createLeaf(newDataObject, selectorObject.element);
    }

    this.updateState(node, false, null, 'add');
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

    nodeTopLevel.animateOpen();
    /**
    * Fires when leaf expanded.
    *
    * @event expanded
    * @type {Object}
    * @property {Object} event - The jquery event object
    * @property {Array} args [nodeData, dataset]
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

    nodeTopLevel.animateClosed().on('animateclosedcomplete', () => {
      /**
      * Fires when leaf collapsed.
      *
      * @event collapsed
      * @type {Object}
      * @property {Object} event - The jquery event object
      * @property {Array} args [nodeData, dataset]
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
      chart: s.paging ? '<ul class="container"><li class="chart display-for-paging"></li></ul>' : '<ul class="container"><li class="chart"></li></ul>',
      toplevel: s.paging ? '<ul class="child-nodes"></ul>' : '<ul class="top-level"></ul>',
      sublevel: s.paging ? '' : '<ul class="sub-level"></ul>'
    };

    const chartContainer = this.element.append(structure.chart);
    const chart = $('.chart', chartContainer);

    if (thisLegend.length !== 0) {
      this.element.prepend(structure.legend);
      const element = $('legend', chartContainer);
      this.createLegend(element);
    }

    // check to see how many children are not leafs and have children
    if (this.isSingleChildWithChildren()) {
      $(chart).addClass('has-single-child');
    }

    // Create root node
    this.setColor(data);

    if (s.paging && data.parentDataSet) {
      const backMarkup = '' +
        '<div class="back">' +
          '<button type="button" class="btn-icon hide-focus btn-back">' +
            '<svg class="icon" focusable="false" aria-hidden="true" role="presentation">' +
              '<use xlink:href="#icon-caret-up"></use>' +
            '</svg>' +
            '<span>Back</span>' +
          '</button>' +
        '</div>';

      // Append back button to chart to go back to view previous level
      const backButton = $(backMarkup).appendTo(chart);

      // Attach data reference to back button
      backButton.children('button').data(data);

      // Class used to adjust heights and account for back button
      $(chart).addClass('has-back');
    }

    if (data.isMultiRoot) {
      const multiRootHTML = `<div class="leaf multiRoot"><div><h2>${data.multiRootText}</h2></div></div>`;

      rootNodeHTML.push(multiRootHTML);
      $(rootNodeHTML[0]).addClass('root').appendTo(chart);
    } else {
      const leafTemplate = Tmpl.compile(`{{#dataset}}${$(`#${s.templateId}`).html()}{{/dataset}}`);
      const leaf = leafTemplate.render({ dataset: data });
      rootNodeHTML.push(leaf);

      $(rootNodeHTML[0]).addClass('root').appendTo(chart);
      this.updateState($('.leaf.root'), true, data);
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
    if (thisChildren.length > 0) {
      for (let i = 0, l = thisChildren.length; i < l; i++) {
        const childObject = data.children[i].children;

        // If child has no children then render the element in the top level
        // If paging then render all children in the top level
        // If not paging and child has children then render in the sub level
        if (this.isLeaf(thisChildren[i]) && !s.paging) {
          this.createLeaf(data.children[i], $(structure.toplevel));
        } else if (s.paging) {
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
  * Checks to see if children have children
  * @private
  * @returns {Boolean} true if have children
  */
  isSingleChildWithChildren() {
    const s = this.settings;
    if (s.dataset && s.dataset[0].children) {
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
          <span>${thislabel}</span>
          <span class="key ${color}"></span>
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
    const s = this.settings;
    const chartClassName = self.element.attr('class');
    const chart = $(`.${chartClassName} .chart`, self.container);
    const elClassName = container.attr('class');
    const el = elClassName !== undefined ? $(`.${elClassName}`) : container;

    if (el.length < 1) {
      if (elClassName === 'top-level') {
        container.insertAfter('.root');
      } else {
        container.appendTo(chart);
      }
    }

    function processDataForLeaf(thisNodeData) {
      /* global Tmpl */
      self.setColor(thisNodeData);

      const leafTemplate = Tmpl.compile(`{{#dataset}}${$(`#${s.templateId}`).html()}{{/dataset}}`);
      const leaf = leafTemplate.render({ dataset: thisNodeData });
      let parent = el.length === 1 ? el : container;
      let branchState = thisNodeData.isExpanded || thisNodeData.isExpanded === undefined ? 'branch-expanded' : 'branch-collapsed';

      if (thisNodeData.isLeaf) {
        branchState = '';
      }

      parent.append(`<li class=${branchState}>${$(leaf)[0].outerHTML}</li>`);

      if (thisNodeData.children) {
        let childrenNodes = '';

        for (let j = 0, l = thisNodeData.children.length; j < l; j++) {
          self.setColor(thisNodeData.children[j]);
          const childLeaf = leafTemplate.render({ dataset: thisNodeData.children[j] });

          if (j === thisNodeData.children.length - 1) {
            childrenNodes += `<li>${$(childLeaf)[0].outerHTML}</li>`;
          } else {
            childrenNodes += `<li>${$(childLeaf)[0].outerHTML}</li>`;
          }
        }

        parent = $(`#${thisNodeData.id}`).parent();
        parent.append(`<ul>${childrenNodes}</ul>`);

        let childLength = thisNodeData.children.length;
        while (childLength--) {
          self.updateState($(`#${thisNodeData.children[childLength].id}`), false, thisNodeData.children[childLength]);
        }
      }
    }

    if (nodeData.length) {
      for (let i = 0, l = nodeData.length; i < l; i++) {
        const isLast = (i === (nodeData.length - 1));
        processDataForLeaf(nodeData[i], isLast);
        self.updateState($(`#${nodeData[i].id}`), false, nodeData[i]);
      }
    } else {
      processDataForLeaf(nodeData, true);
      self.updateState($(`#${nodeData.id}`), false, nodeData);
    }
  },

  /**
  * Determine the color from settings
  * @private
  * @param {object} data contains info.
  * @returns {void}
  */
  setColor(data) {
    const s = this.settings;
    for (let i = 0, l = s.legend.length; i < l; i++) {
      if (data[s.legendKey] === s.legend[i].value) {
        data.colorClass = s.colorClass[i];
        break;
      } else if (data[s.legendKey] === '') {
        data.colorClass = 'default-color';
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
   * Check to see if particular node is a leaf
   * @private
   * @param {Object} dataNode contains data info
   * @returns {Boolean} whether or not a particular node is a leaf
   */
  isLeaf(dataNode) {
    const s = this.settings;
    if (dataNode.children === undefined) {
      dataNode.isLeaf = true;
      return dataNode.isLeaf;
    }

    if (s.beforeExpand) {
      return dataNode.isLeaf;
    }

    if (dataNode.children && dataNode.children.length > 0) {
      return false;
    }

    return true;
  },

  /**
   * Handle all leaf state here,
   * get the current state via .data() and re-attach the new state
   * @private
   * @param {String} leaf .
   * @param {String} isRoot .
   * @param {String} nodeData .
   * @param {String} eventType .
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
    const data = $(leaf).data();
    const expandCaret = s.paging ? 'caret-right' : 'caret-up';

    // data has been loaded if it has children
    if ((data.children && data.children.length !== 0) || eventType === 'add') {
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
    data.parentDataSet = s.dataset;

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
   * @param {Object} settings The settings to apply.
   * @returns {Object} The api
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
