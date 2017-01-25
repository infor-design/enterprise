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

  $.fn.stepprocess = function(options) {

    var pluginName = 'stepprocess',
      defaults = {
        dataset: undefined,
        afterFolderOpen: function() {},
        beforeSelectStep: null
      };

    /**
     * A Stepped process UI/UX extending the tree control
     * @constructor
     * @param {Object} element
     * @param {Object} options
     * @param {Object} [options.dataset] - Initial object to create the tree
     * @param {function(event)} [options.afterFolderOpen] - After folder open event callback
     * @param {function(event)|Promise} [options.beforeSelectStep] - On step select callback
     */
    function StepProcess(element, options) {
      this.settings = $.extend({}, defaults, options);
      this.element = $(element);
      this.init();
    }

    StepProcess.prototype = {

      /** @private  */
      init: function() {
        var self = this;

        var treeParams = {
          dataset: this.settings.dataset,
          useStepUI: true,
          folderIconOpen: 'caret-up',
          folderIconClosed: 'caret-down'
        };

        if (typeof self.settings.beforeSelectStep === 'function') {
          treeParams.onBeforeSelect = self.settings.beforeSelectStep;
        }

        var $theTree = $('#json-tree').tree(treeParams);

        this.theTreeApi = $theTree.data('tree');

        $theTree
          // When a folder opens
          .on('animateopencomplete', function(e) {
            self.settings.afterFolderOpen(e, self);
          })
          // Change the content view when a node is selected
          .on('selected', function(e, elem) {
            if (elem.data.href.length > 1) {
              $('.step-panel-active').removeClass('step-panel-active');
              $(elem.data.href).addClass('step-panel-active');
              self.element.addClass('show-main');
            }
          });

        // Next Button Click
        $('.js-step-link-next').on('click', function(e) {
          e.preventDefault();
          self.goToNextStep.call(self);
        });

        // Previous Button Click
        $('.js-step-link-prev').on('click', function(e) {
          e.preventDefault();
          self.goToPreviousStep.call(self);
        });

        // Button to toggle the tree in responsive view
        $('.js-toggle-sidebar').click(function(e) {
          e.preventDefault();
          self.element.toggleClass('show-main');
        });

        // Attach scroll action features
        $('.js-step-container-scroll').scrollaction({
          scrollActionTarget: '.main'
        });

        $('.js-step-tree-scroll').scrollaction({
          scrollActionTarget: '.sidebar'
        });

        return this;
      },

      /**
       * Go to the previous step in the tree
       */
      goToPreviousStep: function() {
        var selectedNodes = this.theTreeApi.getSelectedNodes();

        if (selectedNodes.length > 0) {

          // Get the currently select node (or last one if there are many)
          var curNode = selectedNodes[selectedNodes.length - 1].node;
          var curNodeIsFolderHeader = (curNode.next('ul.folder').length === 1);

          // Get the previous node to switch to
          var prevNode = this.theTreeApi.getPreviousNode(curNode);
          var prevNodeIsFolderHeader = (prevNode.next('ul.folder').length === 1);

          var nodeToSelect = prevNode;

          // Iron out some details on what node is selected based on folders and
          // which ones are open or closed.
          if (!curNodeIsFolderHeader && prevNodeIsFolderHeader) {
            var prevNodeFolderIsOpen = prevNode.next('ul.folder').hasClass('is-open');
            if (prevNodeFolderIsOpen) {
              nodeToSelect = this.theTreeApi.getPreviousNode(prevNode);
            }
          }

          this.theTreeApi.selectNode(nodeToSelect);

          // Get a possible folder for the selected node
          var $nodeToSelectFolder = nodeToSelect.next('ul.folder');

          if ($nodeToSelectFolder) {

            // Make sure the folder opens
            if (!$nodeToSelectFolder.hasClass('is-open')) {
              this.theTreeApi.toggleNode(nodeToSelect);
            }

            // Makse sure folder is populated before navigating up into it
            if ($nodeToSelectFolder.children().length) {
              var $foldersLastChild = $nodeToSelectFolder.children().last().find('a');
              this.theTreeApi.selectNode($foldersLastChild);
            }
          }
        }
      },

      /**
       * Go to the next step in the tree
       */
      goToNextStep: function() {
        var selectedNodes = this.theTreeApi.getSelectedNodes();
        if (selectedNodes.length > 0) {
          var curNode = selectedNodes[selectedNodes.length - 1].node,
              nextNode = this.theTreeApi.getNextNode(curNode),
              $nextNodeFolder = nextNode.next('ul.folder');

          this.theTreeApi.selectNode(nextNode);

          // If the "next" node is associated to a folder
          if ($nextNodeFolder) {

            // Make sure we open the folder
            if (!$nextNodeFolder.hasClass('is-open')) {
              this.theTreeApi.toggleNode(nextNode);
            }

            // Make sure folder is populated before navigating down into it
            if ($nextNodeFolder.children().length) {
              this.goToNextStep();
            }
          }
        }
      },

      /**
       * Updates a node through the tree.js API
       * @param  {Object} - node The JSON node to update
       * @param  {Bool} selectFirstChild - Whether or not to select the first child by default
       */
      updateNode: function(node, selectFirstChild) {
        this.theTreeApi.updateNode(node);

        if (selectFirstChild) {
          this.goToNextStep();
        }
      }
    };

    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new StepProcess(this, options));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
