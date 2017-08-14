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

 $.fn.hierarchy = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'hierarchy',
        defaults = {
          legend: [],
          legendKey: '',
          dataset: [],
          newData: [],
          templateId: '',  //Id to the Html Template
          mobileView: false,
          mouseEnterTarget: '',
          rightClickTarget: '',
          leafHeight: null,
          leafWidth: null,
          beforeExpand: null
        },
        settings = $.extend({}, defaults, options);

    var colorClass = [
      'azure08', 'turquoise02', 'amethyst06', 'slate06', 'amber06', 'emerald07', 'ruby06'
    ];

    var constants = {
      container       : 'container',
      chart           : 'content',
      toplevel        : 'top-level',
      sublevel        : 'sub-level',
      noSublevel      : 'no-sublevel',
      sublist         : 'sublist',
      leaf            : 'leaf',
      multiRoot       : 'multi-root',
      root            : 'root',
      branchExpanded  : 'branch-expanded',
      branchCollapsed : 'branch-collapsed',
      expanded        : 'expand',
      collapsed       : 'collapse',
      close           : 'close',
      open            : 'open',
      line            : 'line',
      selected        : 'selected'
    };

    /**
    * The displays custimizable hierarchical data such as an org chart.
    *
    * @class Hierarchy
    * @param {String} legend  &nbsp;-&nbsp; Pass in custom markdown for the legend structure.
    * @param {String} legendKey  &nbsp;-&nbsp; Key to use for the legend matching
    * @param {String} dataset  &nbsp;-&nbsp; Hierarchical Data to display
    * @param {Boolean} newData  &nbsp;-&nbsp; New data to be appended into dataset
    * @param {String} templateId  &nbsp;-&nbsp; Additional product name information to display
    * @param {Boolean} mobileView  &nbsp;-&nbsp; If true will only show mobile view, by default using device info to determine.
    * @param {String} beforeExpand  &nbsp;-&nbsp; A callback that fires before node expansion of a node.
    *
    */
    function Hierarchy(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Hierarchy Methods
    Hierarchy.prototype = {
      init: function() {

        var isMobile = $(this.element).parent().width() < 610; //Phablet down

        if (isMobile) {
          this.mobileView = true;
        } else {
          this.mobileView = false;
        }

        this.handleEvents();

        if (settings.dataset) {
          if (settings.dataset[0].children.length > 0) {
            var data = settings.dataset[0] === undefined ? settings.dataset : settings.dataset[0];

            data.isRootNode = true;
            data.isExpanded = true;
            this.render(data);
          } else {
            $(this.element).append('<p style=\'padding:10px;\'>No data available</p>');
          }
        }

        if (settings.leafHeight !== null && settings.leafWidth !== null) {

          var style = 'body .hierarchy .leaf,' +
                'body .hierarchy .sublevel .leaf,' +
                'body .hierarchy .container .root.leaf { width: ' + settings.leafWidth + 'px; ' + ' height: ' + settings.leafHeight + 'px; ' + ' }';

          $('<style type=\'text/css\' id=\'hierarchyLeafStyles\'>' + style + '</style>').appendTo('body');
        }
      },

      // Attach all event handlers
      handleEvents: function() {
        var self = this;

        // Expand or Collapse
        self.element.onTouchClick('hierarchy', '.btn').on('click.hierarchy', '.btn', function(event) {

          if (settings.newData.length > 0) {
            settings.newData = [];
          }

          var nodeId = $(this).closest('.' + constants.leaf).attr('id');
          var dataObject = self.data(nodeId, settings.dataset, settings.newData);
          var domObject = {
            branch: $(this).closest('li'),
            leaf: $(this).closest('.' + constants.leaf),
            button: $(this)
          };

          if (dataObject.isExpanded) {
            self.collapse(event, dataObject, domObject);
          } else {
            self.expand(event, dataObject, domObject);
          }

        });

        self.element.on('keypress', '.' + constants.leaf, function(event) {
          var nodeId     = $(this).attr('id');
          var nodeData   = self.data(nodeId, settings.dataset, settings.newData);

          if (event.which === 13) {
            if (nodeData.isExpanded) {
              self.collapse(event, nodeData);
            } else {
              self.expand(event, nodeData);
            }
          }
        });

        // Select
        self.element.on('mousedown', '.' + constants.leaf, function(event) {
          var nodeData = $(this).data();
          var targetInfo = {target: event.target, pageX: event.pageX, pageY: event.pageY};
          var eventType = 'selected';

          $('.is-' + constants.selected).removeClass('is-'+constants.selected);
          $('#' + nodeData.id).addClass('is-'+constants.selected);

          // Is collapse event
          if ( $(event.target).is('button') && $(event.target).find('use').prop('href').baseVal === '#icon-caret-up') {
            eventType = 'collapse';
          }

          // Is expand event
          if ( $(event.target).is('button') && $(event.target).find('use').prop('href').baseVal === '#icon-caret-down') {
            eventType = 'expand';
          }

          // Is right click event
          if (event.which === 3) {
            eventType = 'rightClick';
          }

          var eventInfo = {
            data: nodeData,
            targetInfo: targetInfo,
            eventType: eventType
          };

          $(this).trigger('selected', eventInfo);
        });
      },

      // Process data attached through jquery data
      data: function(nodeId, currentDataObject, newDataObject, params) {

        if (params === undefined) {
          params = {};
        }

        var obj = currentDataObject.isRootNode ? currentDataObject : currentDataObject[0];
        var nodeData = [];

        if (settings.newData.length > 0) {
          settings.newData = [];
        }

        function processData(self, obj, newDataObject) {
          if (obj.length === undefined) {
            checkForChildren(self, obj, newDataObject);
          } else {
            for (var i = 0, l = obj.length; i < l; i++) {
              var o = obj[i];
              checkForChildren(self, o, newDataObject);
            }
          }
        }

        if (newDataObject !== undefined) {
          processData(this, obj, newDataObject);
        }

        function checkForChildren(self, obj, newDataObject) { //jshint ignore:line
          for (var prop in obj) {
            if (prop === 'id' && nodeId === obj.id) {
              if (!obj.isLoaded && !obj.isRootNode) {
                addChildrenToObject(obj, params);
              }
              nodeData.push(obj);
            }
          }
          if (obj.children) {
            processData(self, obj.children, newDataObject);
          }
        }

        function addChildrenToObject(obj, params) { //jshint ignore:line
          if (params.insert) {
            delete obj.isLeaf;
            obj.isExpanded = true;
          }
          if (newDataObject.length !== 0 && params.insert) {
            obj.children = [newDataObject];
          } else {
            obj.children = newDataObject;
          }
        }

        if (nodeData.length !== 0) {
          $('#' + nodeData[0].id).data(nodeData[0]);
        }

        return nodeData[0];
      },

      /**
      * Add data as children for the given nodeId.
      */
      add: function (nodeId, currentDataObject, newDataObject) {
        var self            = this;
        var id              = currentDataObject.id !== undefined ? currentDataObject.id : nodeId;
        var node            = $('#' + id);
        var parentContainer = node.parent().hasClass('leaf-container') ? node.parent().parent() : node.parent();
        var selectorObject  = {};
        var isSubLevelChild = parentContainer.parent().attr('class') !== constants.sublevel;
        var subListExists   = parentContainer.children('.' + constants.sublist).length === 1;

        if (isSubLevelChild) {
          if (subListExists) {
            selectorObject.element = parentContainer.children('.' + constants.sublist);
          } else {
            selectorObject.el = parentContainer.append('<ul class=\'' + constants.sublist + '\'></ul>');
            selectorObject.element = $(selectorObject.el).find('.' + constants.sublist);
          }
        } else {
          selectorObject.el = parentContainer.children('ul');
          selectorObject.element = $(selectorObject.el);
        }

        if (!currentDataObject.isRootNode) {
          for(var i = 0, l = newDataObject.length; i < l; i++) {
            settings.newData.push(newDataObject[i]);
          }
          self.createLeaf(newDataObject, selectorObject.element);
        }
      },

      /**
      * Expand the nodes until nodeId is displayed on the page.
      */
      expand: function(event, nodeData, domObject) {
        var self = this,
          node = domObject.leaf,
          nodeTopLevel  = node.next().not('.' + constants.line);

        nodeTopLevel.animateOpen();
        self.element.trigger(constants.expanded, [nodeData, settings.dataset]);

        if (node.hasClass('root')) {
          nodeTopLevel  = nodeTopLevel.next('ul');
          nodeTopLevel.animateOpen();
        }

        nodeData.isExpanded = true;

        self.setNodeData(nodeData);

        node.parent().removeClass(constants.branchCollapsed).addClass(constants.branchExpanded);
        self.setButtonState(node, nodeData);
      },

      /**
      * Collapse the passed in nodeId.
      */
      collapse: function(event, nodeData, domObject) {
        var self = this,
          node = domObject.leaf,
          nodeTopLevel  = node.next().not('.' + constants.line);

        nodeTopLevel.animateClosed().on('animateclosedcomplete', function () {
          self.element.trigger(constants.collapsed, [nodeData, settings.dataset]);
        });

        if (node.hasClass('root')) {
          nodeTopLevel  = nodeTopLevel.next('ul');
          nodeTopLevel.animateClosed();
        }

        nodeData.isExpanded = false;

        self.setNodeData(nodeData);
        node.parent().removeClass(constants.branchExpanded).addClass(constants.branchCollapsed);
        self.setButtonState(node, nodeData);
      },

      //Main render method
      render: function (data) {
        var legend       = settings.legend;
        var children     = data.children;
        var hasTopLevel  = this.checkChildren(children, 'top-level');
        var hasSubLevel  = this.checkChildren(children, 'sub-level');
        var rootNodeHTML = [];
        var structure    = {
          legend    : '<legend><ul></ul></legend>',
          chart     : '<ul class=\'' + constants.container + '\'>'+ '<li class=\'' + constants.chart + '\'></li></ul>',
          toplevel  : '<ul class=\'' + constants.toplevel + '\'></ul>',
          sublevel  : '<ul class=\'' + constants.sublevel + '\'></ul>'
        };

        var chartContainer  = this.element.append(structure.chart);
        var chart = $('.' + constants.chart, chartContainer);

        if (legend.length !== 0) {
          this.element.prepend(structure.legend);
          var element = $('legend', chartContainer);
          this.createLegend(element);
        }

        // Create root node
        this.setColor(data);

        if (data.isMultiRoot) {
          var multiRootHTML = '<div class=\'' + constants.leaf + ' ' + constants.multiRoot + '\'><div class=\'' +
            constants.inner + '\'><h2>' +
            data.multiRootText +'</h2></div></div>';

          rootNodeHTML.push(multiRootHTML);
          $(rootNodeHTML[0]).addClass(constants.root).appendTo(chart);

        } else {

          var leafTemplate = Tmpl.compile('{{#dataset}}' + $('#' + settings.templateId).html() + '{{/dataset}}');
          var leaf = leafTemplate.render({dataset: data});
          rootNodeHTML.push(leaf);

          $(rootNodeHTML[0]).addClass(constants.root).appendTo(chart);
          this.setNodeData(data);
        }

        if (!hasTopLevel) {
          $('<div class=\'' + constants.line + '\'></div>').insertAfter('.' + constants.root);
        }

        function renderSubChildren(self, subArray, data) {
          if (subArray !== null && subArray !== undefined) {
            for (var i = 0, l = subArray.length; i < l; i++) {
              var obj = subArray[i];
              subArrayChildren(self, obj, data);
            }
          }
        }

        // Create children nodes
        if (children.length > 0) {
          for (var i = 0, l = children.length; i < l; i++) {

            var childObject = data.children[i].children;

            if (this.isLeaf(children[i])) {
              this.createLeaf(data.children[i], $(structure.toplevel));
            }
            else {
              this.createLeaf(data.children[i], $(structure.sublevel));
            }

            if (childObject !== undefined && childObject !== null) {
              var subArray = data.children[i].children;
              var self = this;
              renderSubChildren(self, subArray, data);
            }
          }
        }

        function subArrayChildren(self, obj, data) { //jshint ignore:line
          for(var prop in obj) {
            if (prop === 'children') {
              var nodeId = obj.id;
              var currentDataObject = obj;
              var newDataObject = obj.children;

              if (newDataObject !== null && newDataObject !== undefined) {
                if (newDataObject.length > 0) {
                  self.add(nodeId, currentDataObject, newDataObject);
                }
              }

              return renderSubChildren(self, newDataObject, data);
            }
          }
        }

        if (!hasSubLevel) {
          $('.' + constants.topLevel).addClass(constants.noSublevel);
        }

        var containerWidth = this.element.find('.' + constants.container).outerWidth();
        var windowWidth = $(window).width();
        var center = (containerWidth - windowWidth) / 2;
        this.element.scrollLeft(center);

      },

      checkChildren : function(children, param) {
        var n = 0;
        var i = children.length;
        while(i--) {
          if (param === 'top-level') {
            if (children[i].isLeaf) {
              n += 1;
            }
          }
          if (param === 'subLevel') {
            if (children[i].children) {
              n += 1;
            }
          }
        }
        return n > 0;
      },

      // Add the legend from the Settings
      createLegend : function(element) {
        var mod      = 4;
        var index    = 0;

        for (var i = 0, l = settings.legend.length; i < l; i++) {
          var label  = settings.legend[i].label;
          var color  = colorClass[i];

          if (i - 1 % mod + 1 === mod) {
            element.append('<ul></ul>');
            index++;
          }

          element.children('ul').eq(index).append(
            '<li>' +
            '<span>' + label + '</span>' +
            '<span class=\'key ' + color + '\'></span>' +
            '</li>'
          );
        }
      },

      // Creates a leaf node under element for nodeData
      createLeaf: function(nodeData, container) {
        var self           = this;
        //console.log(nodeData.id);
        var chartClassName = self.element.attr('class');
        var chart          = $('.' + chartClassName + ' .' + constants.chart, self.container);
        var elClassName    = container.attr('class');
        var el             = elClassName !== undefined ? $('.' + elClassName) : container;

        if (el.length < 1) {
          if (elClassName === constants.toplevel) {
            container.insertAfter('.' + constants.root);
          } else {
            container.appendTo(chart);
          }
        }

        function processDataForleaf(nodeData, isLast) {
          self.setColor(nodeData);

          var leafTemplate = Tmpl.compile('{{#dataset}}' + $('#' + settings.templateId).html() + '{{/dataset}}');
          var leaf = leafTemplate.render({dataset: nodeData});
          var parent       = el.length === 1 ? el : container;
          var lineHtml     = '';

          parent.children('li').children('.ln').removeClass('last-line');

          if (isLast) {
            lineHtml += '<span class=\'ln last-line\'></span>';
          } else {
            lineHtml += '<span class=\'ln\'></span>';
          }

          var lf = $(leaf);
          self.setButtonState(lf, nodeData);

          if (elClassName !== constants.sublevel && elClassName !== constants.toplevel) {
            $(lf).append('<span class=\'horizontal-line\'></span>');
          }

          var branchState = nodeData.isExpanded || nodeData.isExpanded === undefined ? constants.branchExpanded : constants.branchCollapsed;
          if (nodeData.isLeaf) {
            branchState = '';
          }

          parent.append('<li class=' + branchState + '>' + lineHtml + $(lf)[0].outerHTML + '</li>');

          self.setNodeData(nodeData);

          if (nodeData.children) {
            var childrenNodes = '';
            nodeData.isLoaded = true;

            if (nodeData.isExpanded) {
              nodeData.isExpanded = true;
              $('#' + nodeData.id).data(nodeData);
            }
            else {
              nodeData.isExpanded = false;
            }

            for (var j = 0, l = nodeData.children.length; j < l; j++) {
              self.setColor(nodeData.children[j]);

              var childleaf = leafTemplate.render({dataset: nodeData.children[j]});
              var c = $(childleaf);

              self.setButtonState(c, nodeData.children[j]);

              $(c).append('<span class=\'horizontal-line\'></span>');

              if (j === nodeData.children.length - 1) {
                childrenNodes += '<li><span class=\'ln last-line\'></span>' + $(c)[0].outerHTML + '</li>';
              }
              else {
                childrenNodes += '<li><span class=\'ln\'></span>' + $(c)[0].outerHTML + '</li>';
              }
            }

            parent = $('#' + nodeData.id).parent();
            parent.append('<ul>' + childrenNodes + '</ul>');

            var childLength = nodeData.children.length;
            while (childLength--) {
              self.setNodeData(nodeData.children[childLength]);
            }
          }
        }

        if (nodeData.length) {
          for (var i = 0, l = nodeData.length; i < l; i++) {
            var isLast = i === nodeData.length -1;
            processDataForleaf(nodeData[i], isLast);
          }
        } else {
          processDataForleaf(nodeData, true);
        }

      },

      // Determine the color from settings
      setColor: function(data) {
        for (var i = 0, l = settings.legend.length; i < l; i++) {
          if (data[settings.legendKey] === settings.legend[i].value) {
            data.colorClass = colorClass[i];
            break;
          }
          else if (data[settings.legendKey] === '') {
            data.colorClass =  'default-color';
          }
        }

        if (data.children && !data.isRootNode) {
          for (var k = 0, ln = data.children.length; k < ln; k++) {
            for (var j = 0, x = settings.legend.length; j < x; j++) {
              if (data.children[k][settings.legendKey] === settings.legend[j].value) {
                data.children[k].colorClass = colorClass[j];
              }
            }
          }
        }
      },

      setNodeData: function(nodeData) {
        var leafObject   = $('#' + nodeData.id).data(nodeData);
        leafObject.data  = nodeData;
      },

      /**
      * Return whether or not a particular node is a leaf
      */
      isLeaf: function(dataNode) {

        if (dataNode.children === undefined) {
          dataNode.isLeaf = true;
          return dataNode.isLeaf;
        }

        if (settings.beforeExpand) {
          return dataNode.isLeaf;
        }

        if (dataNode.children && dataNode.children.length > 0) {
          return false;
        }

        return true;
      },

      //set the classes and svg on the button
      setButtonState: function (leaf, data) {
        var btn = leaf.find('.btn');

        if (data.isExpanded || data.isExpanded === undefined && !data.isLeaf) {
          btn.find('svg.icon').changeIcon('caret-up');
          btn.addClass('btn-expand').removeClass('btn-collapse')
          data.isExpanded = true;
        } else {
          btn.find('svg.icon').changeIcon('caret-down');
          btn.addClass('btn-collapse').removeClass('btn-expand');
          data.isExpanded = false;
        }

        if (data.isLeaf) {
          btn.addClass('btn-hidden');
        }
      }

    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);

      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Hierarchy(this, settings));
      }

    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
