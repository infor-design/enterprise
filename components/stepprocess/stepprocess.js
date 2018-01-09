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
        linearProgression: false,
        folderIconOpen: 'caret-up',
        folderIconClosed: 'caret-down',
        stepList: '#step-list',
        stepLi: '.js-step',
        stepLink: '.js-step-link',
        stepFolder: '.js-step-folder',
        btnPrev: '.js-step-link-prev',
        btnNext: '.js-step-link-next',
        beforeSelectStep: null,
      },
      settings = $.extend({}, defaults, options);

    /**
    * A Stepprocess/wizard control
    *
    * @class Stepprocess
    * @param {boolean} linearProgression The Main Application Name to display in the header. (Defaults to false)
    * @param {string} folderIconOpen A specific folder open icon. (Defaults to 'caret-up')
    * @param {string} folderIconClosed A specific folder close icon. (Defaults to 'caret-down')
    * @param {boolean} stepList Determines whether or not to display device information (Browser, Platform, Locale, Cookies Enabled).
    * @param {string} stepLi jQuery selector for the step elements.
    * @param {boolean} stepLink jQuery selector for the step link elements.
    * @param {string} stepFolder jQuery selector for the step folder elements.
    * @param {string} btnPrev jQuery selector for the previous step button.
    * @param {string} btnNext jQuery selector for the next step button.
    * @param {Function} beforeSelectStep  A callback (function or promise) that gives args: stepLink (the step link element) and isStepping (whether we are prev/next'ing or not).
    *
    */
    function Stepprocess(element) {
      this.element = $(element);
      this.init();
    }

    // Stepprocess Methods
    Stepprocess.prototype = {
      init: function() {
        this.settings = $.extend({}, settings);
        this.$stepList = $(this.settings.stepList);
        this.initStepprocess();
        this.handleKeys();
        this.setupEvents();
        this.focusFirst();
      },

      /** @private  */
      initStepprocess: function() {
        var self = this,
          steps = self.$stepList.find(this.settings.stepLi);

        steps.each(function() {
          self.decorateNode(this);
        });

        var startingStep = $(this.settings.stepLi + '.is-selected');
        var startingStepLink = startingStep.find(this.settings.stepLink);
        this.selectStep(startingStepLink);
      },

       /**
       * @private
       * Set initial attributes on each step its counterparts
       * @param  {object} step - The step element to decorate
       */

      decorateNode: function(step) {
        var self = this,
            $step = $(step),
            $stepLink = $step.children(this.settings.stepLink),
            $stepFolder = $step.children(this.settings.stepFolder),
            isDisabled = $stepLink.hasClass('is-disabled'),
            isOpen = $stepFolder.hasClass('is-open');

        if (isDisabled) {
          $stepLink.attr('aria-disabled','true');
        }

        if ($stepFolder.length) {

          $step.addClass('folder');
          $stepFolder.attr('role', 'group');

          if (isDisabled) {
            $stepFolder.addClass('disabled');

            if (isOpen) {
              $stepFolder.children().each(function() {
                $(this).find(self.settings.stepLink)
                  .addClass('is-disabled')
                  .attr('aria-disabled', 'true');
              });
            }
          }

          $stepLink.attr('aria-expanded', isOpen);
        }

        // parentCount 'aria-level' to the node's level depth
        var parentCount = $stepLink.parentsUntil(this.$stepList, 'ul').length - 1;

        // Set the current stepprocess item node position relative to its aria-setsize
        var posinset = $step.index();

        // Set the current stepprocess item aria-setsize
        var listCount = $step.siblings().addBack().length;

        $stepLink
          .attr({
            'role': 'stepitem',
            'tabindex': '-1',
            'aria-selected': 'false',
            'aria-level': parentCount + 1,
            'aria-posinset': posinset + 1,
            'aria-setsize': listCount,
            'aria-disabled': isDisabled
          })
          .addClass('hide-focus')
          .hideFocus();
      },

       /** @private  */

        /**
       * @private
       * @param  {object} step - The step element
       * @return {boolean}
       */

      /** @private  */
      focusFirst: function () {
        this.$stepList.find(this.settings.stepLi + ':first').attr('tabindex', '0');
      },

          /**
       * @private
       * @param  {[type]} step - The step element
       */

      /**
       * @private
       * @param  {object} step - The step element
       */
      folderClose: function(step) {
        var self = this,
            $step = $(step),
            $stepLink = $step.children(this.settings.stepLink),
            $stepFolder = $step.children(this.settings.stepFolder);

        var treeIcon = $stepLink
                        .closest('.folder')
                          .removeClass('is-open')
                          .end()
                        .find('svg.icon-tree');

        this.setIcon(treeIcon, this.settings.folderIconClosed);

        this.isAnimating = true;

        $stepFolder
          .one('animateclosedcomplete', function() {
            $stepFolder.removeClass('is-open');
            self.isAnimating = false;
          })
          .animateClosed();

        $stepLink.attr('aria-expanded', 'false');
      },

      /**
       * @private
       * @param  {object} step - The step element
       */
      folderOpen: function(step) {
        var self = this,
            $step = $(step);

        if (!this.isOpen($step)) {

          var $stepLink = $step.children(this.settings.stepLink),
              $stepFolder = $step.children(this.settings.stepFolder);

          $step.addClass('is-open');
          $stepLink.attr('aria-expanded', 'true');

          var svgElem = $stepLink.find('svg.icon-tree');
          self.setIcon(svgElem, self.settings.folderIconOpen);

          self.isAnimating = true;

          $stepFolder
            .one('animateopencomplete', function() {
              self.isAnimating = false;
            })
            .addClass('is-open')
            .css('height', 0)
            .animateOpen();
        }
      },

      /**
       * @private
       * @param  {[type]} stepLink- Description
       * @return {[type]}     - Description
       */
      folderToggle: function(stepLink) {
        var $step = stepLink.closest(this.settings.stepLi);

        if (this.isFolder($step)) {
          var $stepFolder = $step.children(this.settings.stepFolder);
          if (this.isOpen($stepFolder)) {
            this.folderClose($step);
          } else {
            this.folderOpen($step);
          }
        }
      },


       /**
       * @private
       * @return {object} - the "step" element
       */

      /**
       * @private
       * @return {object}
       */
      getSelectedStep: function () {
        return $(this.settings.stepLi + '.is-selected', this.$stepList);
      },

      /**
       * @private
       * @param  {object} stepLink - The step link element
       * @return {object}
       */
      getNextNode: function(stepLink) {
        var next = stepLink.parent().next().find(this.settings.stepLink + ':first');
        var $nextStep = next.closest(this.settings.stepLi);

        // Possibly Move Into Children
        if (stepLink.next().is(this.settings.stepFolder) && stepLink.next().hasClass('is-open')) {
          next = stepLink.next().find(this.settings.stepLink + ':first');
        }

        //skip disabled
        if(next.hasClass('is-disabled')) {
          next = $nextStep.next().find(this.settings.stepLink + ':first');
        }

        //bottom of a group..{l=2: max folders to be deep }
        if (next.length === 0) {
          for (var i=0, l=2, closest=stepLink; i < l; i++) {
            closest = closest.parent().closest('.folder');
            next = closest.next().find(this.settings.stepLink + ':first');
            if (next.length) {
              break;
            }
          }
        }
        return next;
      },
       /**
       * @private
       * Get the next step in the tree
       * (not to be confused with getNextNode, which includes folders)
       * @return {object}
       */

      /**
       * @private
       * @return {object}
       */
      getNextStep: function() {
        var $curStep = this.getSelectedStep(),
            $curStepLink = $curStep.children(this.settings.stepLink),
            $curStepFolder = $curStep.next(this.settings.stepFolder),
            $nextStepLink = this.getNextNode($curStepLink),
            $nextStepFolder = $nextStepLink.next(this.settings.stepFolder),
            stepLinkToSelect = null,
            theFolder = null;

        if ($curStepFolder.length) {
          // Select the first node of the current folder,
          // unless its empty, which means nextStep will be the folder's "title"
          theFolder = $curStepFolder;
          stepLinkToSelect = theFolder.children().length ? theFolder.find(this.settings.stepLink).first() : $nextStepLink;

        } else if ($nextStepFolder.length) {
          // Select the first node of the next node's folder,
          // unless its empty, which means nextStep will be the folder's "title"
          theFolder = $nextStepFolder;
          stepLinkToSelect = theFolder.children().length ? theFolder.find(this.settings.stepLink).first() : $nextStepLink;

        } else {
          // Neither folders options work so select the next node
          stepLinkToSelect = $nextStepLink;
        }

        return stepLinkToSelect;
      },

      /**
       * @private
       * @param  {object} stepLink - The step link element
       * @return {object}
       */
      getPreviousNode: function(stepLink) {
        var prev = stepLink.parent().prev().find(this.settings.stepLink + ':first');
        var $prevStep = prev.closest(this.settings.stepLi);

        //move into children at bottom
        if ($prevStep.is('.folder.is-open') &&
            $prevStep.find('ul.is-open a').length &&
            !$prevStep.find('ul.is-disabled').length) {
          prev = $prevStep.find('ul.is-open ' + this.settings.stepLink + ':last');
        }

        //skip disabled
        if(prev.hasClass('is-disabled')) {
          prev = $prevStep.prev().find(this.settings.stepLink + ':first');
        }

        //top of a group
        if (prev.length === 0) {
          prev = stepLink.closest(this.settings.stepFolder).prev(this.settings.stepLink);
        }
        return prev;
      },

      /**
       * @private
       * Get the previous step in the tree
       * (not to be confused with getPreviousNode, which includes folders)
       * @return {object}
       */
      getPreviousStep: function() {
        // Get the currently select node
        var $curStep = this.getSelectedStep(),
            $curStepLink = $curStep.children(this.settings.stepLink);

        // Get the previous step to switch to
        var $prevStepLink = this.getPreviousNode($curStepLink),
            $prevStep = $prevStepLink.closest(this.settings.stepLi),
            stepLinkToSelect = $prevStepLink;

        // If we are moving upwards and hit a folder title step
        if (this.isFolder($prevStep)) {

          if (this.isOpen($prevStep)) {
            // If the folder is open, and we got here, that means we
            // were currently at the first step in the folder and need to
            // go to the prev step above the folder step (aka the prev to the prev)
            stepLinkToSelect = this.getPreviousNode($prevStepLink);

          } else {
            var theFolder = $prevStep.children(this.settings.stepFolder);

            if (theFolder.children().length) {
              stepLinkToSelect = theFolder.find(this.settings.stepLink).last();
            }
          }
        }

        return stepLinkToSelect;
      },

      /**
       * Go to the next step element
       */
      goToNextStep: function() {
        var stepLink = this.getNextStep();
        if (stepLink.length) {
          this.selectStep(stepLink, 'next');
        }
      },

      /**
       * Go to the previous step element
       */
      goToPreviousStep: function() {
        var stepLink = this.getPreviousStep();
        if (stepLink.length) {
          this.selectStep(stepLink, 'prev');
        }
      },

      /**
       * @private
       * Key Behavior as per:
       * http://access.aol.com/dhtml-style-guide-working-group/#treeview
       */
      handleKeys: function () {
        var self = this;

        this.$stepList.on('focus.stepprocess', this.settings.stepLink, function() {
          var target = $(this);
          if ((parseInt(target.attr('aria-level')) === 0) &&
              (parseInt(target.attr('aria-posinset')) === 1)) {

            // First element if disabled
            if (target.hasClass('is-disabled')) {
              var e = $.Event('keydown.stepprocess');
              e.keyCode= 40; // move down
              target.trigger(e);
              return;
            }
          }
        });

        // Handle Up/Down Arrow Keys and Space
        this.$stepList.on('keydown.stepprocess', this.settings.stepLink, function (e) {

          var charCode = e.charCode || e.keyCode,
              target = $(this),
              next, prev;

          if (self.isAnimating) {
            return;
          }

          //down arrow
          if (charCode === 40) {
            var nextNode = self.getNextNode(target);
            self.setFocus(nextNode);
          }

          //up arrow,
          if (charCode === 38) {
            var prevNode = self.getPreviousNode(target);
            self.setFocus(prevNode);
          }

          //space
          if (e.keyCode === 32) {
            target.trigger('click.stepprocess');
          }

          // Left arrow
          if (charCode === 37) {
            if (Locale.isRTL()) {
              if (target.next().hasClass('is-open')) {
                prev = target.next().find(self.settings.stepLink + ':first');
                self.setFocus(prev);
              } else {
                self.folderToggle(target);
              }
            } else {
              if (target.next().hasClass('is-open')) {
                self.folderToggle(target);
              } else {
                prev = target.closest('.folder').find(self.settings.stepLink + ':first');
                self.setFocus(prev);
              }
            }
            e.stopPropagation();
            return false;
          }

          // Right arrow
          if (charCode === 39) {
            if (Locale.isRTL()) {
              if (target.next().hasClass('is-open')) {
                self.folderToggle(target);
              } else {
                next = target.closest('.folder').find(self.settings.stepLink + ':first');
                self.setFocus(next);
              }
            } else {
              if (target.next().hasClass('is-open')) {
                next = target.next().find(self.settings.stepLink + ':first');
                self.setFocus(next);
              } else {
                self.folderToggle(target);
                self.setFocus(target);
              }

            }
            e.stopPropagation();
            return false;
          }

          // Home  (fn-right on mac)
          if (charCode === 36) {
            next = self.$stepList.find(self.settings.stepLink + ':first:visible');
            self.setFocus(next);
          }

          // End (fn-right on mac)
          if (charCode === 35) {
            next = self.$stepList.find(self.settings.stepLink + ':last:visible');
            self.setFocus(next);
          }

        });

        // Handle Left/Right Arrow Keys
        this.$stepList.on('keypress.stepprocess', this.settings.stepLink, function (e) {
          var charCode = e.charCode || e.keyCode,
            target = $(this);

          if ((charCode >= 37 && charCode <= 40) || charCode === 32) {
            e.stopPropagation();
            return false;
          }

          //Printable Chars Jump to first high level node with it...
           if (e.which !== 0) {
            target.closest(self.settings.stepLi).nextAll().find('.js-step-link:visible').each(function () {
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

      /**
       * @private
       * @param  {[type]}  step - The step Li element
       * @return {boolean}
       */
      isFolder: function(step) {
        return $(step).hasClass('folder');
      },

      /**
       * @private
       * @param  {object} step - The step element
       * @return {boolean}
       */
      isInFolder: function(step) {
        return $(step).closest(this.settings.stepFolder, this.$stepList).length;
      },

      /**
       * @private
       * @param  {object}  stepFolder - The step folder element
       * @return {boolean}
       */
      isOpen: function(stepFolder) {
        return $(stepFolder).hasClass('is-open');
      },

      /**
       * @private
       * @param {object} stepLink
       */
      setFocus: function (stepLink) {
        stepLink.focus();
      },

      /**
       * @private
       * Replace all "icon-", "hide-focus", "\s? - all spaces if any" with nothing
       * @param {string} svg
       * @param {string} icon
       */
      setIcon: function(svg, icon) {
        var iconStr = icon.replace(/icon-|hide-focus|\s?/gi, '');
        svg.changeIcon(iconStr);
      },

        /**
       * Select a step
       * @param  {object} stepLink - The jquery object for the step link element
       * @param  {string} [linearDirection=none|previous|next] - Which direction we are traveling
       */
      selectStep: function (stepLink, linearDirection) {
        var self = this;
        if (linearDirection === undefined) {
          linearDirection = 'none';
        }

        // Possibly Call the beforeSelectStep
        var result;
        if (typeof self.settings.beforeSelectStep === 'function') {

          var args = {
            stepLink: stepLink,
            isStepping: linearDirection
          };
          result = self.settings.beforeSelectStep(args);

          if (result.done && typeof result.done === 'function') { // A promise is returned
            result.done(function(continueSelectNode, stepLinkToSelect) {
              if (continueSelectNode) {
                if (stepLinkToSelect) {
                  stepLink = stepLinkToSelect;
                }
                self.selectStepFinish(stepLink, linearDirection);
              }
            });
          } else if (result) { // boolean is returned instead of a promise
            self.selectStepFinish(stepLink, linearDirection);
          }

        } else { // No Callback specified
          self.selectStepFinish(stepLink, linearDirection);
        }
      },

      /**
       * @private
       * Finishes selecting a step
       * @param  {object} stepLink - Description
       * @param  {string} [linearDirection=previous|next] - Description
       *
       */
      selectStepFinish: function(stepLink, linearDirection) {
        var self = this,
            $allStepLinks = $(this.settings.stepLink, this.$stepList),
            $step = stepLink.closest(this.settings.stepLi);

        $allStepLinks
          .attr({
            'tabindex': '-1',
            'aria-selected': 'false'
          })
          .parent().removeClass('is-selected');

        stepLink.attr({
          'tabindex': '0',
          'aria-selected': 'true'
        });

        $step.addClass('is-selected');

        if (this.isFolder($step)) {
          // It is a folder
          if (linearDirection === 'none') {
            this.folderToggle($step); // clicking toggles
          } else {
            this.folderOpen($step); // going prev/next always opens
          }
        } else {
          // Its not a folder
          var parentIsFolder = $step.closest(this.settings.stepFolder, this.$stepList);

          if (parentIsFolder.length) {
            // If the step is in a folder, make sure that folder opens
            this.folderOpen(parentIsFolder.closest(this.settings.stepLi));
          }

          // Show the step's panel
          this.showStepPanel(stepLink.attr('href'));
        }
        stepLink.focus();

        setTimeout(function() {
          self.element.triggerHandler('selected', stepLink);
        }, 0);
      },

      /**
       * @private
       * @param  {object} step - The step element to decorate
       */
      unSelectedNode: function (step) {
        var aTags = $(this.settings.stepLink, this.$stepList),
            $step = $(step),
            $stepLink = $step.children(this.settings.stepLink);

        aTags.attr('tabindex', '-1');
        $stepLink.attr('tabindex', '0');

        $step.removeClass('is-selected');
        $stepLink.attr('aria-selected', 'false');
      },

      /**
       * @private
       * @return {[type]}- Description
       */
      setupEvents: function () {
        var self = this;

        // Updated and Click events
        self.$stepList
          .on('updated.stepprocess', function () {
            self.initStepprocess();
          })
          .on('click.stepprocess', self.settings.stepLink + ':not(.is-clone)', function (e) {
            e.preventDefault();

            if (!self.settings.linearProgression) {
              var $target = $(this);

              if (!$target.is('.is-disabled, .is-loading')) {
                self.selectStep($target);
                e.stopPropagation();
              }
            }
          });

        // Next Button Click
        $(this.settings.btnPrev).on('click', function(e) {
          e.preventDefault();
          self.goToPreviousStep.call(self);
        });

        // Previous Button Click
        $(this.settings.btnNext).on('click', function(e) {
          e.preventDefault();
          self.goToNextStep.call(self);
        });

        // Setup main scrolling
        $(this.settings.contentScroll).scrollaction({
          scrollActionTarget: '.main'
        });

        // Setup sidebar scrolling
        $(this.settings.stepListScroll).scrollaction({
          scrollActionTarget: '.sidebar'
        });

        // Toggle sidebar
        // Button to toggle the tree in responsive view
        $('.js-toggle-sidebar').click(function(e) {
          e.preventDefault();
          self.element
            .toggleClass('tablet-hide-steps')
            .toggleClass('phone-hide-steps');
        });
      },

      /**
       * @private
       * Show the content panel for the step
       * @param  {string} contentId - The contentId to show
       */
      showStepPanel: function(contentId) {
        $('.step-panel-active').removeClass('step-panel-active');
        $(contentId).addClass('step-panel-active');
        this.element.addClass('phone-hide-steps');
      },

      /** @private */
      destroy: function() {
        this.$stepList.removeData(pluginName);
        this.$stepList.off('updated.stepprocess click.stepprocess focus.stepprocess keydown.stepprocess keypress.stepprocess').empty();
      }
    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Stepprocess(this, settings));
      }
    });

  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
