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

          var nodeId = $(this).closest('.leaf').attr('id');
          var nodeData = $('#' + nodeId).data();
          var domObject = {
            branch: $(this).closest('li'),
            leaf: $(this).closest('.leaf'),
            button: $(this)
          };

          if (nodeData.isExpanded) {
            self.collapse(event, nodeData, domObject);
          } else {
            self.expand(event, nodeData, domObject);
          }

        });

        self.element.on('keypress', '.leaf', function(event) {
          var nodeId     = $(this).attr('id');
          var nodeData   = $('#' + nodeId);

          if (event.which === 13) {
            if (nodeData.isExpanded) {
              self.collapse(event, nodeData);
            } else {
              self.expand(event, nodeData);
            }
          }
        });

        // Select
        self.element.on('mousedown', '.leaf', function(event) {
          var nodeData = $(this).data();
          var targetInfo = {target: event.target, pageX: event.pageX, pageY: event.pageY};
          var eventType = 'selected';

          $('.is-selected').removeClass('is-selected');
          $('#' + nodeData.id).addClass('is-selected');

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
      *  Add data as children for the given nodeId.
      */
      add: function (nodeId, currentDataObject, newDataObject) {

        var self            = this;
        var id              = currentDataObject.id !== undefined ? currentDataObject.id : nodeId;
        var node            = $('#' + id);
        var parentContainer = node.parent().hasClass('leaf-container') ? node.parent().parent() : node.parent();
        var selectorObject  = {};
        var isSubLevelChild = parentContainer.parent().attr('class') !== 'sub-level';
        var subListExists   = parentContainer.children('.sublist').length === 1;

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
          for(var i = 0, l = newDataObject.length; i < l; i++) {
            settings.newData.push(newDataObject[i]);
          }
          self.createLeaf(newDataObject, selectorObject.element);
        }

        self.updateState(node, false, null, 'add');
      },

      /**
      * Expand the nodes until nodeId is displayed on the page.
      */
      expand: function(event, nodeData, domObject) {
        var self = this,
          node = domObject.leaf,
          nodeTopLevel  = node.next().not('.line');

        nodeTopLevel.animateOpen();
        self.element.trigger('expanded', [nodeData, settings.dataset]);

        if (node.hasClass('root')) {
          nodeTopLevel  = nodeTopLevel.next('ul');
          nodeTopLevel.animateOpen();
        }

        node.parent().removeClass('branch-collapsed').addClass('branch-expanded');
        self.updateState(node, false, null, 'expand');
      },

      /**
      * Collapse the passed in nodeId.
      */
      collapse: function(event, nodeData, domObject) {
        var self = this,
          node = domObject.leaf,
          nodeTopLevel  = node.next().not('.line');

        nodeTopLevel.animateClosed().on('animateclosedcomplete', function () {
          self.element.trigger('collapsed', [nodeData, settings.dataset]);
        });

        if (node.hasClass('root')) {
          nodeTopLevel  = nodeTopLevel.next('ul');
          nodeTopLevel.animateClosed();
        }

        node.parent().removeClass('branch-expanded').addClass('branch-collapsed');
        self.updateState(node, false, null, 'collapse');
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
          chart     : '<ul class=\'container\'><li class=\'chart\'></li></ul>',
          toplevel  : '<ul class=\'top-level\'></ul>',
          sublevel  : '<ul class=\'sub-level\'></ul>'
        };

        var chartContainer  = this.element.append(structure.chart);
        var chart = $('.chart', chartContainer);

        if (legend.length !== 0) {
          this.element.prepend(structure.legend);
          var element = $('legend', chartContainer);
          this.createLegend(element);
        }

        // Create root node
        this.setColor(data);

        if (data.isMultiRoot) {
          var multiRootHTML = '<div class=\'leaf multiRoot\'><div><h2>' + data.multiRootText +'</h2></div></div>';

          rootNodeHTML.push(multiRootHTML);
          $(rootNodeHTML[0]).addClass('root').appendTo(chart);

        } else {

          var leafTemplate = Tmpl.compile('{{#dataset}}' + $('#' + settings.templateId).html() + '{{/dataset}}');
          var leaf = leafTemplate.render({dataset: data});
          rootNodeHTML.push(leaf);

          $(rootNodeHTML[0]).addClass('root').appendTo(chart);
          this.updateState($('.leaf.root'), true);
        }

        if (!hasTopLevel) {
          $('<div class=\'line\'></div>').insertAfter('.root');
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
          $('.top-level').addClass('no-sublevel');
        }

        var containerWidth = this.element.find('.container').outerWidth();
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

      /**
       * Private function
       *  Creates a leaf node under element for nodeData
       * @param nodeData
       * @param container
       */
      createLeaf: function(nodeData, container) {
        var self           = this;
        var chartClassName = self.element.attr('class');
        var chart          = $('.' + chartClassName + ' .chart', self.container);
        var elClassName    = container.attr('class');
        var el             = elClassName !== undefined ? $('.' + elClassName) : container;

        if (el.length < 1) {
          if (elClassName === 'top-level') {
            container.insertAfter('.root');
          } else {
            container.appendTo(chart);
          }
        }

        if (nodeData.length) {
          for (var i = 0, l = nodeData.length; i < l; i++) {
            var isLast = i === nodeData.length -1;
            processDataForLeaf(nodeData[i], isLast);
            self.updateState($('#' + nodeData[i].id), false, nodeData[i]);
          }
        } else {
          processDataForLeaf(nodeData, true);
          self.updateState($('#' + nodeData.id), false, nodeData);
        }

        function processDataForLeaf(nodeData, isLast) {
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

          if (elClassName !== 'sub-level' && elClassName !== 'top-level') {
            $(leaf).append('<span class=\'horizontal-line\'></span>');
          }

          var branchState = nodeData.isExpanded || nodeData.isExpanded === undefined ? 'branch-expanded' : 'branch-collapsed';
          if (nodeData.isLeaf) {
            branchState = '';
          }

          parent.append('<li class=' + branchState + '>' + lineHtml + $(leaf)[0].outerHTML + '</li>');

          if (nodeData.children) {
            var childrenNodes = '';

            for (var j = 0, l = nodeData.children.length; j < l; j++) {
              self.setColor(nodeData.children[j]);

              var childLeaf = leafTemplate.render({dataset: nodeData.children[j]});

              $(childLeaf).append('<span class=\'horizontal-line\'></span>');

              if (j === nodeData.children.length - 1) {
                childrenNodes += '<li><span class=\'ln last-line\'></span>' + $(childLeaf)[0].outerHTML + '</li>';
              }
              else {
                childrenNodes += '<li><span class=\'ln\'></span>' + $(childLeaf)[0].outerHTML + '</li>';
              }
            }

            parent = $('#' + nodeData.id).parent();
            parent.append('<ul>' + childrenNodes + '</ul>');

            var childLength = nodeData.children.length;
            while (childLength--) {
              self.updateState($('#' + nodeData.children[childLength].id), false, nodeData.children[childLength]);
            }
          }
        }
      },

      /**
       * Private function
       * Determine the color from settings
       * @param data
       */
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

      /**
      * Return whether or not a particular node is a leaf
      * private function
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

      /**
       * Handle all leaf state here,
       * get the current state via .data() and re-attach the new state
       * private function
       * @param leaf
       * @param isRoot
       */
      updateState: function (leaf, isRoot, nodeData, eventType) {

        // set data if it has not been set already
        if ($.isEmptyObject($(leaf).data()) && nodeData) {
          $(leaf).data(nodeData);
        }

        var btn = $(leaf).find('.btn');
        var data = $(leaf).data();

        // data has been loaded if it has children
        if (data.children || eventType === 'add') {
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
          btn.find('svg.icon').changeIcon('caret-up');
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

        // Reset data
        $(leaf).data(data);
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
