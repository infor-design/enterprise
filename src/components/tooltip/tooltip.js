/* eslint-disable no-underscore-dangle */
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { keyboard } from '../../utils/keyboard';
import { DOM } from '../../utils/dom';
import { Environment as env } from '../../utils/environment';
import { Locale } from '../locale/locale';
import { renderLoop, RenderLoopItem } from '../../utils/renderloop';
import { xssUtils } from '../../utils/xss';

// jQuery components
import '../place/place.jquery';

// Component Name
const COMPONENT_NAME = 'tooltip';
const POPOVER_COMPONENT_NAME = 'popover';

// Trigger Methods
const TOOLTIP_TRIGGER_METHODS = ['hover', 'immediate', 'click', 'focus'];

/**
 * Tooltip and Popover Control
 * @class Tooltip
 * @constructor
 *
 * @param {htmlelement|jquery[]} element The component element.
 * @param {object} [settings] The component settings.
 * @param {string|function} [settings.content] Takes title attribute or feed content. Can be a string or jQuery markup.
 * @param {object} [settings.offset={top: 10, left: 10}] How much room to leave.
 * @param {string} [settings.placement='top'] Supports 'top'|'bottom'|'right'|'left'.
 * @param {string} [settings.trigger='hover'] Supports click and immediate and hover and focus
 * @param {string} [settings.showOnKeyboardFocus] If the object with the tooltip is tabbed to, will also show the tooltip.
 * @param {string} [settings.title] Title for Infor Tips.
 * @param {string} [settings.beforeShow] Call back for ajax tooltip.
 * @param {string} [settings.onHidden] Call back for hiding.
 * @param {string} [settings.popover] force it to be a popover (no content).
 * @param {string} [settings.closebutton] Show X close button next to title in popover.
 * @param {boolean} [settings.isError=false] Add error classes.
 * @param {boolean} [settings.isErrorColor=false] Add error color only not description.
 * @param {string} [settings.tooltipElement] ID selector for an alternate element to use to contain the tooltip classes.
 * @param {object} [settings.parentElement] jQuery-wrapped element that gets.
  passed to the 'place' behavior as the element to place the tooltip against.
 * @param {boolean} [settings.keepOpen=false] Forces the tooltip to stay open in situations where it would normally close.
 * @param {string} [settings.extraClass] Extra css class.
 * @param {object} [settings.placementOpt] Placement options.
 * @param {string} [settings.maxWidth] Toolip max width.
 * @param {boolean} [settings.initializeContent] Init the content in the tooltip.
 * @param {string} [settings.headerClass] If set this color will be used on the header (if a popover).
 * @param {string} [settings.delay] The delay before showing the tooltip
 * @param {string} [settings.attachToBody] The if true (default) the popup is added to the body. In some cases like popups with tab stops you may want to append the element next to the item.
 * @param {Array} [settings.attributes] allows user-defined attributes on generated Tooltip markup.
 */
const TOOLTIP_DEFAULTS = {
  content: null,
  offset: { top: 10, left: 10 },
  placement: 'top',
  trigger: TOOLTIP_TRIGGER_METHODS[0],
  showOnKeyboardFocus: true,
  title: null,
  beforeShow: null,
  popover: null,
  closebutton: null,
  isError: false,
  isErrorColor: false,
  tooltipElement: null,
  parentElement: null,
  keepOpen: false,
  isRangeDatepicker: false,
  extraClass: null,
  placementOpts: {},
  maxWidth: null,
  initializeContent: true,
  headerClass: null,
  delay: 500,
  onHidden: null,
  attachToBody: true,
  appendTo: '[role="main"]',
  attributes: null,
};

function Tooltip(element, settings) {
  this.settings = utils.mergeSettings(element, settings, TOOLTIP_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(this.componentName);
  this.init();
  debug.logTimeEnd(this.componentName);
}

Tooltip.prototype = {

  /**
   * @returns {string} either 'popover' or 'tooltip'
   */
  get componentName() {
    if (!this._componentName) {
      this._componentName = this.isPopover ? POPOVER_COMPONENT_NAME : COMPONENT_NAME;
    }
    return this._componentName;
  },

  /**
   * @returns {boolean} true if this component is a Popover component instead of a Tooltip
   */
  get isPopover() {
    return (this.settings.content !== null && typeof this.settings.content === 'object') || this.settings.popover === true;
  },

  /**
   * @returns {boolean} whether or not the tooltip/popover element is currently visible
   */
  get visible() {
    return this.tooltip.length &&
      this.tooltip[0].classList.contains('hidden') === false &&
      this.tooltip[0].classList.contains('is-hidden') === false;
  },

  /**
   * @returns {boolean} whether or not the tooltip/popover is able to be displayed,
   * which depends on its trigger element and all of its parent elements being visible.
   */
  get canBeShown() {
    return !this.reopenDelay &&
      !DOM.hasClass(this.element[0], 'hidden') &&
      !DOM.hasClass(this.element[0], 'is-hidden') &&
      this.element.parents('.hidden, .is-hidden').length < 1;
  },

  /**
   * @returns {Popupmenu|undefined} if a Popupmenu API exists on the trigger element
   */
  get popupmenuAPI() {
    return this.element.data('popupmenu');
  },

  /**
   * @returns {boolean} whether or not the contents of this tooltip/popover currently have focus
   */
  get isFocused() {
    const activeElem = document.activeElement;
    if (this.activeElement.is($(activeElem))) {
      return true;
    }
    if (this.tooltip && this.tooltip.length && this.tooltip[0].contains(activeElem)) {
      return true;
    }
    return false;
  },

  /**
   * Initializes the component
   * @private
   * @returns {void}
   */
  init() {
    this.uniqueId = utils.uniqueId(this.element, this.componentName);
    this.isTouch = env.features.touch;
    this.setup();
    this.appendTooltip();

    // Initial Content Setting.
    // Don't do this if we're using an "immediate" trigger because _setContent()_ is handled at
    // display time in that case.
    const shouldRender = this.settings.trigger !== 'immediate';
    if (shouldRender) {
      this.setContent(this.settings.content, true);
    }

    this.handleEvents();
  },

  /**
   * Builds internal references
   * @private
   * @returns {void}
   */
  setup() {
    // "this.activeElement" is the target element that the Tooltip will display itself against
    this.activeElement = this.settings.parentElement instanceof $ &&
      this.settings.parentElement.length ? this.settings.parentElement : this.element;

    this.descriptionId = $('.tooltip-description').length + 1;
    this.description = this.element.parent().find('.tooltip-description');
    if (!this.description.length && this.settings.isError) {
      this.description = $(`<span id="tooltip-description-${this.descriptionId}" class="tooltip-description audible"></span>`).insertAfter(this.element);
    }

    if (!this.settings.appendTo) {
      this.settings.appendTo = '[role="main"]';
    }

    if (this.element.is('.dropdown, .multiselect')) {
      this.activeElement = this.element.nextAll('.dropdown-wrapper:first').find('>.dropdown');
    }

    const titleAttr = this.element.attr('title');
    if (
      (!this.settings.popover && titleAttr && titleAttr.length) ||
      (!this.settings.popover && this.settings.title)
    ) {
      this.settings.content = this.settings.title ? this.settings.title : titleAttr;
      this.element.removeAttr('title');
    }

    if (this.settings.trigger === 'hover' && this.isTouch) {
      this.element.addClass('longpress-target');
    }

    this.settings.closebutton = !!((this.settings.closebutton || this.element.data('closebutton')));

    if (this.element.data('extraClass') && this.element.data('extraClass').length) {
      this.settings.extraClass = this.element.data('extraClass');
    }

    if (Array.isArray(this.settings.attributes)) {
      utils.addAttributes(this.element, this, this.settings.attributes, 'trigger');
    }

    this.isRTL = Locale.isRTL();
    DOM.addClass(this.element[0], 'has-tooltip');
  },

  /**
   * Adds ARIA attributes on some elements for better accessiblity.
   * @private
   * @returns {void}
   */
  addAria() {
    if (!this.content) {
      return;
    }

    this.description.text(this.content);
    this.content = this.addClassToLinks(this.content, 'links-clickable');

    if (!this.isPopover) {
      this.element.attr('aria-describedby', this.description.attr('id'));
    }

    if (this.isPopover) {
      const hasTimepicker = this.element.prev('input.timepicker').length;
      if (!hasTimepicker && this.settings.trigger === 'click') {
        this.element.attr('aria-haspopup', true);
      }
      if (hasTimepicker) {
        const id = this.tooltip.attr('id');
        const input = this.element.prev('input.timepicker');

        input.attr('role', 'combobox');
        input.attr('aria-haspopup', 'dialog');
        input.attr('aria-owns', id);

        this.element.attr('role', 'button');
        this.element.attr('aria-controls', id);

        this.tooltip.attr('role', 'dialog');
        this.tooltip.attr('aria-label', Locale.translate('TimepickerPopup'));
      }
    }
  },

  /**
   * @param {jquery[]|string} content HTML or String-based content.
   * @param {string} [thisClass] optional, additional CSS class that gets appeneded to any anchor tags inside of the content.
   * @returns {string} the appended content
   */
  addClassToLinks(content, thisClass) {
    const isjQuery = (content instanceof $ && content.length > 0);
    if (isjQuery) {
      return content;
    }

    const d = $('<div/>').html(content);
    $('a', d).addClass(thisClass);
    return d.html();
  },

  /**
   * Gets a reference to the element being used for the tooltip and positions it in the correct spot on the page.
   * @private
   * @returns {void}
   */
  appendTooltip() {
    const elem = this.settings.tooltipElement;
    const className = this.isPopover ? 'popover' : 'tooltip';
    this.tooltip = elem ? $(elem) : $(`#${this.componentName}`);

    if (!this.tooltip.length) {
      const name = (elem ? elem.substring(1, elem.length) : this.componentName);
      this.tooltip = $(`<div class="${className} bottom is-hidden" id="${name}">
        <div class="arrow"></div><div class="tooltip-content"></div></div>`);

      xssUtils.removeWhiteSpaceCharacters(this.tooltip);
    }

    this.tooltip.place({
      container: this.scrollparent,
      parent: this.activeElement,
      placement: this.settings.placement,
      strategy: 'flip'
    });

    // Attach a reference to this tooltip API to the actual tooltip/popover element
    $.data(this.tooltip[0], this.componentName, this);

    this.setTargetContainer();
    this.addAria();
  },

  /**
   * Sets up all event listeners for this component
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    const delay = self.settings.delay;
    const renderLoopDelay = (delay / 10);

    function clearTimer() {
      if (self.timer && self.timer.destroy) {
        self.timer.destroy(true);
      }
    }

    function showOnTimer() {
      clearTimer();
      self.timer = new RenderLoopItem({
        duration: renderLoopDelay,
        timeoutCallback() {
          self.show();
        }
      });
      renderLoop.register(self.timer);
    }

    function showImmediately() {
      clearTimer();
      self.show();
    }

    function hideImmediately() {
      clearTimer();
      self.hide();
    }

    if (this.settings.trigger === 'hover' && !this.settings.isError) {
      ((this.element.is('.dropdown, .multiselect, span.longpress-target')) ? this.activeElement : this.element)
        .on(`mouseenter.${COMPONENT_NAME}`, () => {
          if (self.isTouch) {
            return;
          }
          showOnTimer();
        })
        .on(`mouseleave.${COMPONENT_NAME}`, () => {
          if (self.visible) {
            hideImmediately();
          } else {
            clearTimer();
          }
        })
        .on(`click.${COMPONENT_NAME}`, () => {
          if (self.isTouch) {
            return;
          }
          hideImmediately();
        })
        .on(`longpress.${COMPONENT_NAME}`, () => {
          showImmediately();
        })
        .on(`updated.${COMPONENT_NAME}`, () => {
          self.updated();
        });

      if (this.settings.showOnKeyboardFocus) {
        ((this.element.is('.dropdown, .multiselect, span.longpress-target')) ? this.activeElement : this.element)
          .on(`focus.${COMPONENT_NAME}`, () => {
            if (self.isTouch && !keyboard.pressedKeys.get('Tab')) {
              return;
            }
            showOnTimer();
          })
          .on(`blur.${COMPONENT_NAME}`, () => {
            if (!self.settings.keepOpen) {
              hideImmediately();
            }
          });
      }
    }

    function toggleTooltipDisplay() {
      if (!self.visible) {
        showImmediately();
      } else {
        hideImmediately();
      }
    }

    if (this.settings.trigger === 'click') {
      this.element.on(`click.${COMPONENT_NAME}`, () => {
        toggleTooltipDisplay();
      });
    }

    if (this.settings.trigger === 'immediate') {
      setTimeout(() => {
        toggleTooltipDisplay();
      }, 1);
    }

    const isFocusable = this.settings.trigger === 'focus';
    if (isFocusable) {
      this.element
        .on(`focus.${COMPONENT_NAME}`, () => {
          showImmediately();
        })
        .on(`blur.${COMPONENT_NAME}`, () => {
          if (!self.settings.keepOpen) {
            hideImmediately();
          }
        });
    }

    // Close the popup/tooltip on orientation changes (but not when keyboard is open)
    $(window).on(`orientationchange.${COMPONENT_NAME}`, () => {
      if (!self.visible) {
        return;
      }
      hideImmediately();
    }, false);
  },

  /**
   * Sets the content used inside the Tooltip element.
   * @private
   * @param {jquery[]|string|function} content incoming content to be set
   * @param {boolean} dontRender causes the tooltip to prevent a visual refresh
    after changing its content, meaning it will keep the previous content visible until this tooltip is closed or manually re-drawn.
   * @returns {boolean} whether or not the render was successful
   */
  setContent(content, dontRender) {
    const self = this;
    const settingsContent = this.settings.content;
    const noIncomingContent = (content === undefined || content === null);
    const noSettingsContent = (settingsContent === undefined || settingsContent === null);

    function doRender() {
      if (dontRender === true) {
        return;
      }
      self.addAria();
      self.render();
    }

    // If all sources of content are undefined, just return false and don't show anything.
    if (noIncomingContent && noSettingsContent) {
      return false;
    }

    // If the settingsContent type is a function, we need to re-run that function
    // to update the content.
    // NOTE: If you need to use a function to generate content, understand that the
    //  tooltip/popover will not cache your content for future reuse.  It will ALWAYS
    //  override incoming content.
    if (typeof settingsContent === 'function') {
      content = settingsContent;
    }

    // Use the pre-set content if we have no incoming content
    if (noIncomingContent) {
      content = settingsContent;
    }

    // If the incoming/preset content is exactly the same as the stored content,
    // don't continue with this step. Deep object comparison for jQuery objects
    // is done further down the chain.
    if (content === this.content) {
      doRender();
      return true;
    }

    // jQuery-wrapped elements don't get manipulated.
    // Simply store the reference, render, and return.
    if (content instanceof $ && content.length) {
      this.content = content.addClass('hidden');
      doRender();
      return true;
    }

    // Handle setting of content based on its Object type.
    // If type isn't handled, the tooltip will not display.
    if (typeof content === 'string') {
      if (!content.length) {
        return false;
      }

      // Could be a translation definition
      content = Locale.translate(content, { showAsUndefined: true }) || content;

      // Could be an ID attribute.
      // If it matches an element already on the page, grab that element's content
      // and store the reference only.
      // Adding a condition if it's really uses the ID attribute.
      if (content.indexOf('#') === 0) {
        const contentCheck = $(`${content}`);
        if (contentCheck.length) {
          this.content = contentCheck;
          doRender();
          return true;
        }
        this.content = content;
        doRender();
        return true;
      }

    // functions
    } else if (typeof content === 'function') {
      const callbackResult = content.call(this.element);
      if (!callbackResult || typeof callbackResult !== 'string' || !callbackResult.length) {
        return false;
      }
      content = callbackResult;

    // if type isn't handled, return false
    } else {
      return false;
    }

    // Store an internal copy of the processed content
    this.content = xssUtils.sanitizeHTML(content);

    // Wrap tooltip content in <p> tags if there isn't already one present.
    // Only happens for non-jQuery markup.
    this.content = `<p>${this.content}</p>`;

    doRender();
    return true;
  },

  /**
   * Renders internal content either as a Tooltip or Popover.
   * @private
   * @returns {void}
   */
  render() {
    if (this.isPopover) {
      return this.renderPopover();
    }
    return this.renderTooltip();
  },

  /**
   * Renders internal content as a Tooltip.
   * @private
   * @returns {void}
   */
  renderTooltip() {
    const titleArea = this.tooltip[0].querySelectorAll('.tooltip-title')[0];
    const contentArea = this.tooltip[0].querySelectorAll('.tooltip-content')[0];
    const extraClass = this.settings.extraClass;
    const content = this.content;
    const tooltip = this.tooltip[0];
    let classes = 'tooltip is-hidden';

    if (extraClass) {
      classes += ` ${extraClass}`;
    }
    tooltip.setAttribute('class', classes);

    if (Array.isArray(this.settings.attributes)) {
      utils.addAttributes(this.tooltip, this, this.settings.attributes);
    }

    if (titleArea) {
      titleArea.style.display = 'none';
    }

    if (contentArea && contentArea.previousElementSibling && !contentArea.previousElementSibling.classList.contains('arrow')) {
      contentArea.insertAdjacentHTML('beforebegin', '<div class="arrow"></div>');
    }

    const tooltipHTML = typeof this.content === 'string' ? content : content[0].innerHTML;
    DOM.html(contentArea, tooltipHTML, '<div><p><span><ul><li><a><abbr><b><i><kbd><small><strong><sub><svg><use><br>');
  },

  /**
   * Renders internal content as a Tooltip.
   * @private
   * @returns {void}
   */
  renderPopover() {
    const self = this;
    const extraClass = this.settings.extraClass;
    const contentArea = this.tooltip.find('.tooltip-content');
    let title = this.tooltip[0].querySelector('.tooltip-title');
    let content = this.content;
    let classes = 'popover is-hidden';

    if (extraClass) {
      classes += ` ${extraClass}`;
    }

    this.tooltip[0].setAttribute('class', classes);

    if (Array.isArray(this.settings.attributes)) {
      utils.addAttributes(this.tooltip, this, this.settings.attributes);
    }

    const useHtml = env.browser.name === 'ie' && env.browser.isIE11() && content instanceof $ && content.length && this.settings.trigger === 'hover';

    if (typeof content === 'string') {
      content = $(content);
      contentArea.html(content);
      contentArea.find('.hidden').removeClass('hidden');
    } else if (useHtml) {
      const clone = content[0].cloneNode(true);
      const id = clone.id;
      if (id) {
        clone.id = `${id}-${this.uniqueId}`;
      }
      contentArea.html(clone.outerHTML);
    } else {
      contentArea.html(content);
    }

    const popoverWidth = contentArea.width();

    if (!this.settings.placementOpts) {
      this.settings.placementOpts = {};
    }

    if (!this.settings.placementOpts.parent) {
      this.settings.placementOpts.parent = this.element;
    }

    if (!useHtml) {
      content[0].classList.remove('hidden');
    }

    contentArea[0].firstElementChild.classList.remove('hidden');

    const parentWidth = this.settings.placementOpts.parent.width();

    if (Locale.isRTL()) {
      this.settings.placementOpts.parentXAlignment = parentWidth > popoverWidth ? 'left' : 'right';
    } else {
      this.settings.placementOpts.parentXAlignment = parentWidth > popoverWidth ? 'right' : 'left';
    }

    if (this.settings.title !== null) {
      if (!title) {
        const titleFrag = document.createDocumentFragment();
        title = document.createElement('div');
        DOM.html(title, this.settings.title, '*');
        title.classList.add('tooltip-title');

        if (this.settings.headerClass) {
          DOM.addClass(title, this.settings.headerClass, 'filled');
        }
        titleFrag.appendChild(title);
        this.tooltip[0].insertBefore(titleFrag, this.tooltip[0].firstChild);
      } else {
        title.style.display = '';
        title.childNodes[0].nodeValue = this.settings.title;
      }
    } else if (title) {
      title.style.display = 'none';
    }

    if (this.settings.closebutton && title && !title.firstElementChild) {
      const closeBtnX = $(`<button type="button" class="btn-icon l-pull-right btn-close">${
        $.createIcon({ classes: ['icon-close'], icon: 'close' })
      }<span>Close</span>` +
        '</button>').on('click', () => {
        self.hide(true);
      });

      title.appendChild(closeBtnX[0]);

      if (Array.isArray(this.settings.attributes)) {
        utils.addAttributes(closeBtnX, this, this.settings.attributes, 'btn-close', true);
      }
    }

    if (this.settings.initializeContent) {
      content.initialize();
    }
  },

  /**
   * Alias for _show()_.
   * @private
   * @returns {void}
   */
  open() {
    return this.show();
  },

  /**
   * Causes the tooltip to become shown
   * @param {object} newSettings an object containing changed settings that will be
   *  applied to the Tooltip/Popover before it's displayed.
   * @param {boolean} ajaxReturn causes an AJAX-powered Tooltip/Popover not to refresh.
   */
  show(newSettings, ajaxReturn) {
    const self = this;

    // Don't open if this is an Actions Button with an open popupmenu
    if (this.popupmenuAPI && this.popupmenuAPI.isOpen) {
      return;
    }

    // Don't open if this tooltip's trigger element is currently hidden.
    if (!this.canBeShown) {
      return;
    }

    this.isInPopup = false;
    if (newSettings) {
      this.settings = utils.mergeSettings(this.element[0], newSettings, this.settings);
    }

    if (this.settings.beforeShow && !ajaxReturn) {
      const response = function (content) {
        if (typeof content === 'boolean') {
          if (content) {
            self.show(null, true);
          }
          return;
        }
        self.content = content;
        self.show({ content }, true);
      };

      if (typeof this.settings.beforeShow === 'string') {
        window[this.settings.beforeShow](response, this.element);
        return;
      }

      this.settings.beforeShow(response, this.element);
      return;
    }

    let okToShow = true;
    okToShow = this.setContent(this.content);
    if (okToShow === false) {
      return;
    }

    /**
     * Fires before show the tooltip.
     *
     * @event beforeshow
     * @memberof Tooltip
     * @property {object} event - The jquery event object
     * @property {object} tooltip - instance
     */
    okToShow = this.element.triggerHandler('beforeshow', [this.tooltip]);
    if (okToShow === false) {
      return;
    }

    this.tooltip[0].removeAttribute('style');
    this.tooltip[0].classList.add(this.settings.placement);
    this.tooltip[0].classList.add('is-open');
    DOM.addClass(this.element[0], 'has-open-tooltip');

    if (this.settings.isError || this.settings.isErrorColor) {
      this.tooltip[0].classList.add('is-error');
    }

    this.position();
    utils.fixSVGIcons(this.tooltip);

    /**
     * Fires on show the tooltip.
     *
     * @event show
     * @memberof Tooltip
     * @property {object} event - The jquery event object
     * @property {object} tooltip - instance
     */
    this.element.trigger('show', [this.tooltip]);

    const mouseUpEventName = this.isTouch ? 'touchend' : 'mouseup';

    // Personalizable the tooltip
    if (!this.settings.popover) {
      const isPersonalizable = this.element.closest('.is-personalizable').length > 0;
      this.tooltip[0].classList[isPersonalizable ? 'add' : 'remove']('is-personalizable');
    } else {
      utils.addAttributes(this.tooltip.find('.tooltip-title'), this, this.settings.attributes, 'title', true);
      utils.addAttributes(this.tooltip.find('.btn-close'), this, this.settings.attributes, 'btn-close', true);
      this.element.attr('aria-expanded', 'true');
    }

    setTimeout(() => {
      $(document)
        .on(`${mouseUpEventName}.${COMPONENT_NAME}-${self.uniqueId}`, (e) => {
          const target = $(e.target);

          if (self.settings.isError || self.settings.trigger === 'focus') {
            return;
          }

          if (target.is(self.element) && target.is('svg.icon')) {
            return;
          }

          if ($('#editor-popup').length && $('#colorpicker-menu').length) {
            return;
          }

          if ($('#editor-popup').length === 1 && target.closest('.popupmenu').length === 1) {
            return;
          }

          if (target.closest('.popover').length === 0 &&
              target.closest('.dropdown-list').length === 0) {
            if (!(target.is('button') && target.siblings().hasClass('datepicker') && self.element.get(0) === target.get(0))) {
              self.hide();
            }
          }

          // Closes patepicker dialog closes when clicking on a parent popover
          if (target.closest('.popover').length === 1 &&
              target.closest('.popover').not('.monthview-popup').length &&
              self.element.prev().is('.datepicker')) {
            self.hide();
          }
        })
        .on(`keydown.${COMPONENT_NAME}-${self.uniqueId}`, (e) => {
          if (e.which === 27 || self.settings.isError) {
            self.hide();
          }
        });

      if (self.settings.isError &&
          !self.element.is(':visible, .dropdown') &&
          self.element.is('[aria-describedby]')) {
        self.hide();
      }

      if (window.orientation === undefined) {
        $('body').on(`resize.${COMPONENT_NAME}`, () => {
          self.hide();

          if (self.settings.keepOpen) {
            self.show();
          }
        });
      }

      // Hide on Page scroll
      $('body').on(`scroll.${COMPONENT_NAME}`, () => {
        self.hide();
      });

      self.element?.closest('.modal-body-wrapper').on('scroll.tooltip', () => {
        self.hide();
      });

      self.element?.closest('.scrollable').on('scroll.tooltip', () => {
        self.hide();
      });

      self.element?.closest('.datagrid-wrapper').on('scroll.tooltip', () => {
        self.hide();
      });

      // Click to close
      if (self.settings.isError) {
        self.tooltip.on(`click.${COMPONENT_NAME}`, () => {
          self.hide();
        });
      }
      /**
       * Fires after show the tooltip.
       *
       * @event aftershow
       * @memberof Tooltip
       * @property {object} event - The jquery event object
       * @property {object} tooltip - instance
       */
      self.element?.trigger('aftershow', [self.tooltip]);
    }, self.settings.delay);
  },

  /**
   * Places the tooltip element itself in the correct DOM element.
   * If the current element is inside a scrollable container, the tooltip element
   * goes as high as possible in the DOM structure.
   * @private
   * @returns {void}
   */
  setTargetContainer() {
    let targetContainer = $('body');

    // Popovers need to be contained by an element with the correct ARIA role.
    // See infor-design/enterprise#4403
    if (this.isPopover) {
      targetContainer = $(this.settings.appendTo);
    }

    if (!targetContainer.length) {
      targetContainer = $('body');
    }
    let attachAfterTriggerElem = false;

    // adjust the tooltip if the element is being scrolled inside a scrollable DIV
    this.scrollparent = this.element.closest('.page-container.scrollable');
    if (this.scrollparent.length) {
      targetContainer = this.scrollparent;
    }

    // If the tooltip/popover is located inside a Modal, contain it within the modal, but
    // place its markup directly after its target element.
    const modalParent = this.element.closest('.modal');
    if (!this.settings.attachToBody) {
      attachAfterTriggerElem = true;
      targetContainer = modalParent;
    } else {
      targetContainer = $('body');
    }

    // If a specific parent element is defined, use that
    if (this.settings.parentElement) {
      targetContainer = this.settings.parentElement;
    }

    if (attachAfterTriggerElem) {
      this.tooltip.insertAfter(this.element);
    } else {
      targetContainer[0].appendChild(this.tooltip[0]);
    }
  },

  /**
   * Placement behavior's "afterplace" handler.
   * DO NOT USE FOR ADDITIONAL POSITIONING.
   * @private
   * @param {jquery.event} e custom `afterPlace` event
   * @param {placementobject} placementObj object containing placement settings
   * @returns {void}
   */
  handleAfterPlace(e, placementObj) {
    this.tooltip.data('place').setArrowPosition(e, placementObj, this.tooltip);
    setTimeout(() => {
      this.tooltip.triggerHandler('tooltipafterplace', [placementObj]);
    });
  },

  /**
   * Resets the current position of the tooltip.
   * @returns {this} component instance
   */
  position() {
    this.setTargetContainer();

    // Popup is range datepicker and should not be shown until range is selected
    if (!this.settings.isRangeDatepicker) {
      this.tooltip[0].classList.remove('is-hidden');
    }

    if (this.settings.maxWidth) {
      $(this.tooltip).css('max-width', this.settings.maxWidth);
    }

    const self = this;
    const distance = this.isPopover ? 20 : 10;
    const tooltipPlacementOpts = this.settings.placementOpts || {};
    const windowW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const windowH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const rect = this.tooltip[0].getBoundingClientRect();
    const opts = $.extend({}, {
      x: 0,
      y: 0,
      container: this.scrollparent,
      containerOffsetX: tooltipPlacementOpts.containerOffsetX || this.settings.offset.left,
      containerOffsetY: tooltipPlacementOpts.containerOffsetY || this.settings.offset.top,
      parent: tooltipPlacementOpts.parent || this.activeElement,
      placement: tooltipPlacementOpts.placement || this.settings.placement,
      strategies: ['flip', 'nudge']
    }, tooltipPlacementOpts);

    if (opts.placement === 'left' || opts.placement === 'right') {
      opts.x = opts.x || distance;
      opts.y = 0;
    }
    if (opts.placement === 'top' || opts.placement === 'bottom') {
      opts.y = opts.y || distance;
      opts.x = 0;
    }

    if (rect.width >= windowW && /left|right/g.test(opts.placement)) {
      this.tooltip[0].classList.add('no-arrow');
    } else if (rect.height >= windowH && /top|bottom/g.test(opts.placement)) {
      this.tooltip[0].classList.add('no-arrow');
    } else {
      this.tooltip[0].classList.remove('no-arrow');
    }

    this.tooltip.one('afterplace.tooltip', (e, placementObj) => {
      self.handleAfterPlace(e, placementObj);
    });

    // Tool tip may be cleaned up on a modal or CAP
    if (this.tooltip.data('place')) {
      this.tooltip.data('place').place(opts);
    } else {
      this.tooltip.place(opts);
      this.tooltip.data('place').place(opts);
    }

    return this;
  },

  /**
   * Alias for _hide()_ that works with the global _closeChildren()_ method.
   * @private
   * @returns {void}
   */
  close() {
    return this.hide();
  },

  /**
   * Hides the Tooltip/Popover
   * @param {boolean} [force=false] Force the tooltip to hide no matter the settings.
   * @returns {void}
   */
  hide(force) {
    if ((this.settings.keepOpen && !force) || !this.visible) {
      return;
    }

    if (this.isInPopup) {
      this.settings.content.addClass('hidden');
      return;
    }

    DOM.removeClass(this.element[0], 'has-open-tooltip');
    this.tooltip[0].classList.remove('is-personalizable');
    this.tooltip[0].classList.remove('is-open');
    this.tooltip[0].classList.add('is-hidden');
    this.tooltip[0].style.left = '';
    this.tooltip[0].style.top = '';
    this.tooltip[0].style.maxWidth = '';
    this.tooltip.find('.arrow').removeAttr('style');

    this.detachOpenEvents();

    if ($('.popover').not('.is-hidden').length === 0) {
      $(document).off('mouseup.tooltip keydown.tooltip');
      $('body').off('resize.tooltip');
    }

    this.element.removeAttr('aria-owns');

    if (this.isPopover) {
      const input = this.element.prev('input');
      if (input.length) {
        input
          .attr('aria-expanded', 'false')
          .removeAttr('aria-describedby')
          .removeAttr('aria-haspopup')
          .removeAttr('aria-owns');
      }
    }

    /**
     * Fires when hide the tooltip.
     *
     * @event hide
     * @memberof Tooltip
     * @property {object} event - The jquery event object
     * @property {object} tooltip - instance
     */
    this.element.triggerHandler('hide', [this.tooltip]);
    if (this.settings.onHidden) {
      this.settings.onHidden({ api: this, elem: this.tooltip });
    }
  },

  /**
   * Causes the tooltip to store updated settings and re-render itself.
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    const self = this;
    if (self.settings.trigger === 'immediate') {
      setTimeout(() => {
        self.show();
      }, 100);
    } else {
      self.setContent();
    }

    return this;
  },

  /**
   * Removes any events which would cause the tooltip/popover to re-open.
   * @private
   * @returns {void}
   */
  detachOpenEvents() {
    const self = this;
    this.tooltip.off(`click.${COMPONENT_NAME}`);

    $(document).off([
      `keydown.${COMPONENT_NAME}-${self.uniqueId}`,
      `mouseup.${COMPONENT_NAME}-${self.uniqueId}`,
      `touchend.${COMPONENT_NAME}-${self.uniqueId}`].join(' '));

    $('body').off([
      `resize.${COMPONENT_NAME}`,
      `scroll.${COMPONENT_NAME}`].join(' '));

    this.element.closest('.modal-body-wrapper').off(`scroll.${COMPONENT_NAME}`);
    this.element.closest('.scrollable').off(`scroll.${COMPONENT_NAME}`);
    this.element.closest('.datagrid-body').off(`scroll.${COMPONENT_NAME}`);
  },

  /**
   * Tears down this component instance, removing all internal flags and unbinding events.
   * @private
   * @returns {this} component instance
   */
  teardown() {
    if (this.timer && this.timer.destroy) {
      this.timer.destroy(true);
    }

    this.description.remove();
    this.descriptionId = undefined;
    this.activeElement = undefined;

    if (!this.tooltip.hasClass('is-hidden')) {
      this.hide();
    }

    if (this.reopenDelay) {
      delete this.reopenDelay;
    }

    if (this.tooltip && this.tooltip.length) {
      if (this.tooltip.data('place')) {
        this.tooltip.data('place').destroy();
      }

      // Remove a link back to this API, if one was generated
      if (this.tooltip.data(this.componentName)) {
        $.removeData(this.tooltip[0], this.componentName);
        delete this._componentName;
      }
    }

    this.element.off([
      `mouseenter.${COMPONENT_NAME}`,
      `mouseleave.${COMPONENT_NAME}`,
      `longpress.${COMPONENT_NAME}`,
      `click.${COMPONENT_NAME}`,
      `updated.${COMPONENT_NAME}`,
      `focus.${COMPONENT_NAME}`,
      `blur.${COMPONENT_NAME}`].join(' '));

    DOM.removeClass(this.element[0], 'has-tooltip');

    this.detachOpenEvents();

    $(window).off(`orientationchange.${COMPONENT_NAME}`);

    return this;
  },

  /**
   * Destroys this component instance
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], this.componentName);
    delete this._componentName;
  }
};

export { Tooltip, COMPONENT_NAME };
