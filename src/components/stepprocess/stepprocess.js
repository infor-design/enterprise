import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';
import { warnAboutRemoval } from '../../utils/deprecated';

// Jquery Imports
import '../../utils/animations';

// Component Name
const COMPONENT_NAME = 'stepprocess';

// Default Stepprocess Options
const STEPPROCESS_DEFAULTS = {
  linearProgression: false,
  folderIconOpen: 'caret-up',
  folderIconClosed: 'caret-down',
  stepList: '#step-list',
  stepLi: '.js-step',
  stepLink: '.js-step-link',
  stepFolder: '.js-step-folder',
  btnPrev: '.js-step-link-prev',
  btnNext: '.js-step-link-next',
  btnSaveClose: '.js-btn-save-changes',
  beforeSelectStep: null,
};

/**
 * A Stepprocess/wizard control
 * @class Stepprocess
 * @deprecated as of v4.20.0. This component is no longer supported by the IDS team.
 * @param {string} element The component element.
 * @param {string} [settings] The component settings.
 * @param {boolean} [settings.linearProgression = false] The Main Application Name to display
 in the header. (Defaults to false)
 * @param {string} [settings.folderIconOpen = 'caret-up'] A specific folder open icon. (Defaults to 'caret-up')
 * @param {string} [settings.folderIconClosed =  'caret-down'] A specific folder close icon. (Defaults to 'caret-down')
 * @param {boolean} [settings.stepList = '#step-list'] Determines whether or not to display device
 information (Browser, Platform, Locale, Cookies Enabled).
 * @param {string} [settings.stepLi = '.js-step'] jQuery selector for the step elements.
 * @param {boolean} [settings.stepLink =  '.js-step-link'] jQuery selector for the step link elements.
 * @param {string} [settings.stepFolder = '.js-step-folder'] jQuery selector for the step folder elements.
 * @param {string} [settings.btnPrev = '.js-step-link-prev'] jQuery selector for the previous step button.
 * @param {string} [settings.btnNext = '.js-step-link-prev'] jQuery selector for the next step button.
 * @param {function} [settings.beforeSelectStep] A callback (function or promise)
 that gives args: stepLink (the step link element) and isStepping
 (whether we are prev/next'ing or not).
 */
function Stepprocess(element, settings) {
  this.settings = utils.mergeSettings(element, settings, STEPPROCESS_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
  warnAboutRemoval('Stepprocess');
}

// Stepprocess Methods
Stepprocess.prototype = {

  /**
   * Init stepprocess
   * @private
   */
  init() {
    this.stepListJq = $(this.settings.stepList);
    this.initStepprocess();
    this.handleKeys();
    this.setupEvents();
    this.focusFirst();
  },

  /**
   * Initialize stepprocess
   * @private
   * @returns {void}
   */
  initStepprocess() {
    const steps = this.stepListJq.find(this.settings.stepLi);

    for (let i = 0, l = steps.length; i < l; i++) {
      this.decorateNode(steps[i]);
    }

    const startingStep = $(`${this.settings.stepLi}.is-selected`);
    const startingStepLink = startingStep.find(this.settings.stepLink);
    this.selectStep(startingStepLink);
  },

  /**
   * Set initial attributes on each step its counterparts
   * @private
   * @param  {object} step - The step element to decorate
   * @returns {void}
   */
  decorateNode(step) {
    const self = this;
    const stepJq = $(step);
    const stepLinkJq = stepJq.children(this.settings.stepLink);
    const stepFolderJq = stepJq.children(this.settings.stepFolder);
    const isDisabled = stepLinkJq.hasClass('is-disabled');
    const isOpen = stepFolderJq.hasClass('is-open');

    if (isDisabled) {
      stepLinkJq.attr('aria-disabled', 'true');
    }

    if (stepFolderJq.length) {
      stepJq.addClass('folder');
      stepFolderJq.attr('role', 'group');

      if (isDisabled) {
        stepFolderJq.addClass('disabled');

        if (isOpen) {
          const stepLinks = stepFolderJq.children();

          for (let i = 0, l = stepLinks.length; i < l; i++) {
            $(stepLinks[i]).find(self.settings.stepLink)
              .addClass('is-disabled')
              .attr('aria-disabled', 'true');
          }
        }
      }

      stepLinkJq.attr('aria-expanded', isOpen);
    }

    // parentCount 'aria-level' to the node's level depth
    const parentCount = stepLinkJq.parentsUntil(this.stepListJq, 'ul').length - 1;

    // Set the current stepprocess item node position relative to its aria-setsize
    const posinset = stepJq.index();

    // Set the current stepprocess item aria-setsize
    const listCount = stepJq.siblings().addBack().length;

    stepLinkJq
      .attr({
        role: 'stepitem',
        tabindex: '-1',
        'aria-selected': 'false',
        'aria-level': parentCount + 1,
        'aria-posinset': posinset + 1,
        'aria-setsize': listCount,
        'aria-disabled': isDisabled
      })
      .addClass('hide-focus')
      .hideFocus();
  },

  /**
   * Set tabindex to be focus first
   * @private
   * @returns {void}
   */
  focusFirst() {
    this.stepListJq.find(`${this.settings.stepLi}:first`).attr('tabindex', '0');
  },

  /**
   * Set initial attributes on each step its counterparts
   * @private
   * @param  {object} step - The step element
   * @returns {void}
   */
  folderClose(step) {
    const stepJq = $(step);
    const stepLinkJq = stepJq.children(this.settings.stepLink);
    const stepFolderJq = stepJq.children(this.settings.stepFolder);

    const treeIcon = stepLinkJq
      .closest('.folder')
      .removeClass('is-open')
      .end()
      .find('svg.icon-tree');

    this.setIcon(treeIcon, this.settings.folderIconClosed);
    this.isAnimating = true;

    stepFolderJq
      .one('animateclosedcomplete', () => {
        stepFolderJq.removeClass('is-open');
        this.isAnimating = false;
      })
      .animateClosed();

    stepLinkJq.attr('aria-expanded', 'false');
  },

  /**
   * Folder open
   * @private
   * @param  {object} step - The step element
   * @returns {void}
   */
  folderOpen(step) {
    const stepJq = $(step);

    if (!this.isOpen(stepJq)) {
      const stepLinkJq = stepJq.children(this.settings.stepLink);
      const stepFolderJq = stepJq.children(this.settings.stepFolder);

      stepJq.addClass('is-open');
      stepLinkJq.attr('aria-expanded', 'true');

      const svgElem = stepLinkJq.find('svg.icon-tree');
      this.setIcon(svgElem, this.settings.folderIconOpen);

      this.isAnimating = true;

      stepFolderJq
        .one('animateopencomplete', () => {
          this.isAnimating = false;
        })
        .addClass('is-open')
        .css('height', 0)
        .animateOpen();
    }
  },

  /**
   * Folder toggle
   * @private
   * @param  {object} stepLink - Description
   * @returns {void}
   */
  folderToggle(stepLink) {
    const stepJq = stepLink.closest(this.settings.stepLi);

    if (this.isFolder(stepJq)) {
      const stepFolderJq = stepJq.children(this.settings.stepFolder);
      if (this.isOpen(stepFolderJq)) {
        this.folderClose(stepJq);
      } else {
        this.folderOpen(stepJq);
      }
    }
  },

  /**
   * Get selected step
   * @private
   * @returns {object} selected step
   */
  getSelectedStep() {
    return $(`${this.settings.stepLi}.is-selected`, this.stepListJq);
  },

  /**
   * Get next node
   * @private
   * @param  {object} stepLink - The step link element
   * @returns {object} node
   */
  getNextNode(stepLink) {
    const s = this.settings;
    let next = stepLink.parent().next().find(`${s.stepLink}:first`);

    // Possibly Move Into Children
    if (stepLink.next().is(s.stepFolder) && stepLink.next().hasClass('is-open')) {
      next = stepLink.next().find(`${s.stepLink}:first`);
    }

    // Skip disabled
    if (next.hasClass('is-disabled')) {
      next = this.getNextNode(next);
    }

    // Bottom of a group..{l=2: max folders to be deep }
    if (next.length === 0) {
      for (let i = 0, l = 2, closest = stepLink; i < l; i++) {
        closest = closest.parent().closest('.folder');
        next = closest.next().find(`${s.stepLink}:first`);
        if (next.length) {
          break;
        }
      }
    }

    return next;
  },

  /**
   * Get the next step in the tree
   * (not to be confused with getNextNode, which includes folders)
   * @private
   * @param  {object} curStepJq - The step link element
   * @returns {object} next step
   */
  getNextStep(curStepJq) {
    const curStepLinkJq = curStepJq.children(this.settings.stepLink);
    const curStepFolderJq = curStepJq.next(this.settings.stepFolder);
    const nextStepLinkJq = this.getNextNode(curStepLinkJq);
    const nextStepFolderJq = nextStepLinkJq.next(this.settings.stepFolder);
    let stepLinkToSelect = null;
    let theFolder = null;

    if (curStepFolderJq.length) {
      // Select the first node of the current folder,
      // unless its empty, which means nextStep will be the folder's "title"
      theFolder = curStepFolderJq;
      stepLinkToSelect = theFolder.children().length ?
        theFolder.find(this.settings.stepLink).first() : nextStepLinkJq;
    } else if (nextStepFolderJq.length) {
      // Select the first node of the next node's folder,
      // unless its empty, which means nextStep will be the folder's "title"
      theFolder = nextStepFolderJq;
      stepLinkToSelect = theFolder.children().length ?
        theFolder.find(this.settings.stepLink).first() : nextStepLinkJq;
    } else {
      // Neither folders options work so select the next node
      stepLinkToSelect = nextStepLinkJq;
    }

    // Skip disabled
    if (stepLinkToSelect.hasClass('is-disabled')) {
      stepLinkToSelect = this.getNextStep(stepLinkToSelect.parent());
    }

    return stepLinkToSelect;
  },

  /**
   * Get the previous node
   * @private
   * @param  {object} stepLink - The step link element
   * @returns {object} previous node
   */
  getPreviousNode(stepLink) {
    const s = this.settings;
    let prev = stepLink.parent().prev().find(`${s.stepLink}:first`);
    const prevStepJq = prev.closest(s.stepLi);

    // Move into children at bottom
    if (prevStepJq.is('.folder.is-open') &&
      prevStepJq.find('ul.is-open a').length &&
      !prevStepJq.find('ul.is-disabled').length) {
      prev = prevStepJq.find(`ul.is-open ${s.stepLink}:last`);
    }

    // Skip disabled
    if (prev.hasClass('is-disabled')) {
      this.getPreviousNode(prev);
    }

    // Top of a group
    if (prev.length === 0) {
      prev = stepLink.closest(s.stepFolder).prev(s.stepLink);
    }
    return prev;
  },

  /**
   * Get the previous step in the tree
   * (not to be confused with getPreviousNode, which includes folders)
   * @private
   * @param  {object} curStepJq - The step link element
   * @returns {object} previous step
   */
  getPreviousStep(curStepJq) {
    const s = this.settings;
    const curStepLinkJq = curStepJq.children(s.stepLink);

    // Get the previous step to switch to
    const prevStepLinkJq = this.getPreviousNode(curStepLinkJq);
    const prevStepJq = prevStepLinkJq.closest(s.stepLi);
    let stepLinkToSelect = prevStepLinkJq;

    // If we are moving upwards and hit a folder title step
    if (this.isFolder(prevStepJq)) {
      if (this.isOpen(prevStepJq)) {
        // If the folder is open, and we got here, that means we
        // were currently at the first step in the folder and need to
        // go to the prev step above the folder step (aka the prev to the prev)
        stepLinkToSelect = this.getPreviousNode(prevStepLinkJq);
      } else {
        const theFolder = prevStepJq.children(s.stepFolder);

        if (theFolder.children().length) {
          stepLinkToSelect = theFolder.find(s.stepLink).last();
        }
      }
    }

    // Skip disabled
    if (stepLinkToSelect.hasClass('is-disabled')) {
      stepLinkToSelect = this.getPreviousStep(stepLinkToSelect.parent());
    }

    return stepLinkToSelect;
  },

  /**
   * Go to the next step element
   * @private
   * @returns {void}
   */
  goToNextStep() {
    const self = this;
    const curStepJq = this.getSelectedStep();
    const stepLink = self.getNextStep(curStepJq);
    if (stepLink.length) {
      self.selectStep(stepLink, 'next');
    } else if (typeof self.settings.beforeSelectStep === 'function') {
      const args = { isStepping: 'next' };
      const result = self.settings.beforeSelectStep(args);

      if (result.done && typeof result.done === 'function') { // A promise is returned
        result.done((continueSelectNode, stepLinkToSelect) => {
          if (continueSelectNode) {
            if (stepLinkToSelect) {
              self.selectStepFinish(stepLinkToSelect);
            }
          }
        });
      } else if (result) { // boolean is returned instead of a promise
        self.selectStepFinish(stepLink);
      }
    }
  },

  /**
   * Go to the previous step element
   * @private
   * @returns {void}
   */
  goToPreviousStep() {
    const curStepJq = this.getSelectedStep();
    const stepLink = this.getPreviousStep(curStepJq);
    if (stepLink.length) {
      this.selectStep(stepLink, 'prev');
    }
  },

  /**
   * Key Behavior as per:
   * http://access.aol.com/dhtml-style-guide-working-group/#treeview
   * @private
   * @returns {void}
   */
  handleKeys() {
    /* eslint-disable consistent-return */
    const self = this;
    const s = this.settings;

    this.stepListJq.on('focus.stepprocess', s.stepLink, function () {
      const target = $(this);
      if ((parseInt(target.attr('aria-level'), 10) === 0) &&
        (parseInt(target.attr('aria-posinset'), 10) === 1)) {
        // First element if disabled
        if (target.hasClass('is-disabled')) {
          const e = $.Event('keydown.stepprocess');
          e.keyCode = 40; // move down
          target.trigger(e);
          return; // eslint-disable-line
        }
      }
    });

    // Handle Up/Down Arrow Keys and Space
    this.stepListJq.on('keydown.stepprocess', s.stepLink, function (e) {
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
        target.trigger('click.stepprocess');
      }

      // Left arrow
      if (charCode === 37) {
        if (Locale.isRTL()) {
          if (target.next().hasClass('is-open')) {
            prev = target.next().find(`${s.stepLink}:first`);
            self.setFocus(prev);
          } else {
            self.folderToggle(target);
          }
        } else if (target.next().hasClass('is-open')) {
          self.folderToggle(target);
        } else {
          prev = target.closest('.folder').find(`${s.stepLink}:first`);
          self.setFocus(prev);
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
            next = target.closest('.folder').find(`${s.stepLink}:first`);
            self.setFocus(next);
          }
        } else if (target.next().hasClass('is-open')) {
          next = target.next().find(`${s.stepLink}:first`);
          self.setFocus(next);
        } else {
          self.folderToggle(target);
          self.setFocus(target);
        }
        e.stopPropagation();
        return false; // eslint-disable-line
      }

      // Home  (fn-right on mac)
      if (charCode === 36) {
        next = self.stepListJq.find(`${s.stepLink}:first:visible`);
        self.setFocus(next);
      }

      // End (fn-right on mac)
      if (charCode === 35) {
        next = self.stepListJq.find(`${s.stepLink}:last:visible`);
        self.setFocus(next);
      }
    });

    // Handle Left/Right Arrow Keys
    this.stepListJq.on('keypress.stepprocess', s.stepLink, function (e) {
      const charCode = e.charCode || e.keyCode;
      const target = $(this);

      if ((charCode >= 37 && charCode <= 40) || charCode === 32) {
        e.stopPropagation();
        return false;
      }

      // Printable Chars Jump to first high level node with it...
      if (e.which !== 0) {
        target.closest(s.stepLi)
          .nextAll().find('.js-step-link:visible').each(function () {
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
    /* eslint-enable consistent-return */
  },

  /**
   * Checks if given step element is folder.
   * @private
   * @param {object} step - The step element
   * @returns {boolean} true if folder
   */
  isFolder(step) {
    return $(step).hasClass('folder');
  },

  /**
   * Checks if given step element is in folder.
   * @private
   * @param {object} step - The step element
   * @returns {boolean} true is in folder
   */
  isInFolder(step) {
    return $(step).closest(this.settings.stepFolder, this.stepListJq).length;
  },

  /**
   * Checks if given step folder is open.
   * @private
   * @param {object} stepFolder element
   * @returns {boolean} true is open
   */
  isOpen(stepFolder) {
    return $(stepFolder).hasClass('is-open');
  },

  /**
   * Set focus on given step link.
   * @private
   * @param {object} stepLink element
   * @returns {void}
   */
  setFocus(stepLink) {
    stepLink.focus();
  },

  /**
   * Replace all "icon-", "hide-focus", "\s? - all spaces if any" with nothing.
   * @private
   * @param {object} svg element.
   * @param {string} icon to set.
   * @returns {void}
   */
  setIcon(svg, icon) {
    const iconStr = icon.replace(/icon-|hide-focus|\s?/gi, '');
    svg.changeIcon(iconStr);
  },

  /**
   * Select a step
   * @private
   * @param  {object} stepLink - The jquery object for the step link element
   * @param  {string} linearDirection - [none|previous|next] Which direction we are traveling
   * @returns {void}
   */
  selectStep(stepLink, linearDirection) {
    const self = this;
    if (linearDirection === undefined) {
      linearDirection = 'none';
    }

    // Possibly Call the beforeSelectStep
    let result;
    if (typeof self.settings.beforeSelectStep === 'function') {
      const args = {
        stepLink,
        isStepping: linearDirection
      };
      result = self.settings.beforeSelectStep(args);

      if (result.done && typeof result.done === 'function') { // A promise is returned
        result.done((continueSelectNode, stepLinkToSelect) => {
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
   * Finishes selecting a step
   * @private
   * @param  {object} stepLink - Description
   * @param  {string} [linearDirection=previous|next] - Description
   * @returns {void}
   */
  selectStepFinish(stepLink, linearDirection) {
    const self = this;
    const allStepLinksJq = $(this.settings.stepLink, this.stepListJq);
    const stepJq = stepLink.closest(this.settings.stepLi);

    if (!this.isFolder(stepJq)) {
      allStepLinksJq
        .attr({
          tabindex: '-1',
          'aria-selected': 'false'
        })
        .parent().removeClass('is-selected');

      stepLink.attr({
        tabindex: '0',
        'aria-selected': 'true'
      });

      stepJq.addClass('is-selected');
    }

    if (this.isFolder(stepJq)) {
      // It is a folder
      if (linearDirection === 'none') {
        this.folderToggle(stepJq); // clicking toggles
      } else {
        this.folderOpen(stepJq); // going prev/next always opens
      }
    } else {
      // Its not a folder
      const parentIsFolder = stepJq.closest(this.settings.stepFolder, this.stepListJq);

      if (parentIsFolder.length) {
        // If the step is in a folder, make sure that folder opens
        this.folderOpen(parentIsFolder.closest(this.settings.stepLi));
      }

      // Show the step's panel
      this.showStepPanel(stepLink.attr('href'));
    }
    stepLink.focus();

    setTimeout(() => {
      /**
       * Fires when selected step link.
       * @event selected
       * @memberof Stepprocess
       * @type {object}
       * @property {object} event - The jquery event object
       * @property {object} stepLink element
       */
      self.element.triggerHandler('selected', stepLink);
    }, 0);
  },

  /**
   * Un selected node
   * @private
   * @param {object} step - The step element to decorate
   * @returns {void}
   */
  unSelectedNode(step) {
    const aTags = $(this.settings.stepLink, this.stepListJq);
    const stepJq = $(step);
    const stepLinkJq = stepJq.children(this.settings.stepLink);

    aTags.attr('tabindex', '-1');
    stepLinkJq.attr('tabindex', '0');

    stepJq.removeClass('is-selected');
    stepLinkJq.attr('aria-selected', 'false');
  },

  /**
   * Setup events
   * @private
   * @returns {void}
   */
  setupEvents() {
    const self = this;
    const s = this.settings;

    // Updated and Click events
    this.stepListJq
      .on('updated.stepprocess', () => {
        this.initStepprocess();
      })
      .on('click.stepprocess', `${s.stepLink}:not(.is-clone)`, function (e) {
        e.preventDefault();

        if (!s.linearProgression) {
          const targetJq = $(this);

          if (!targetJq.is('.is-disabled, .is-loading')) {
            self.selectStep(targetJq);
            e.stopPropagation();
          }
        }
      });

    // Next Button Click
    $(s.btnPrev).on('click', (e) => {
      e.preventDefault();
      this.goToPreviousStep.call(self);
    });

    // Previous Button Click
    $(s.btnNext).on('click', (e) => {
      e.preventDefault();
      this.goToNextStep.call(self);
    });

    // Setup main scrolling
    $(s.contentScroll).scrollaction({
      scrollActionTarget: '.main'
    });

    // Setup sidebar scrolling
    $(s.stepListScroll).scrollaction({
      scrollActionTarget: '.sidebar'
    });

    // Toggle sidebar
    // Button to toggle the tree in responsive view
    $('.js-toggle-sidebar').click((e) => {
      e.preventDefault();
      this.element
        .toggleClass('tablet-hide-steps')
        .toggleClass('phone-hide-steps');
    });
  },

  /**
   * Show the content panel for the step
   * @private
   * @param  {string} contentId - The contentId to show
   * @returns {void}
   */
  showStepPanel(contentId) {
    $('.step-panel-active').removeClass('step-panel-active');
    $(contentId).addClass('step-panel-active');
    this.element.addClass('phone-hide-steps');
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {object} The api
   */
  unbind() {
    this.stepListJq.off('updated.stepprocess click.stepprocess focus.stepprocess keydown.stepprocess keypress.stepprocess').empty();
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, STEPPROCESS_DEFAULTS);
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
    $.removeData(this.element[0], COMPONENT_NAME);
  },
};

export { Stepprocess, COMPONENT_NAME };
