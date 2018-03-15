import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// jQuery components
import '../place/place.jquery';

// Component Name
const COMPONENT_NAME = 'tooltip';

/**
 * Tooltip and Popover Control
 * @class Tooltip
 * @constructor
 *
 * @param {htmlelement|jquery[]} element The component element.
 * @param {object} [settings] The component settings.
 * @param {string|function} [settings.content] Takes title attribute or feed content. Can be a string or jQuery markup.
 * @param {object} [settings.offset={top: 10, left: 10}] How much room to leave.
 * @param {string} [settings.placement='top'] Supports 'top'|'bottom'|'right'|'offset'.
 * @param {string} [settings.trigger='hover'] Supports click and immediate and hover (and maybe in future focus).
 * @param {string} [settings.title] Title for Infor Tips.
 * @param {string} [settings.beforeShow] Call back for ajax tooltip.
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
 */

const TOOLTIP_DEFAULTS = {
  content: null,
  offset: { top: 10, left: 10 },
  placement: 'top',
  trigger: 'hover',
  title: null,
  beforeShow: null,
  popover: null,
  closebutton: null,
  isError: false,
  isErrorColor: false,
  tooltipElement: null,
  parentElement: null,
  keepOpen: false,
  extraClass: null,
  placementOpts: {},
  maxWidth: null
};

function Tooltip(element, settings) {
  this.settings = utils.mergeSettings(element, settings, TOOLTIP_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

Tooltip.prototype = {

  /**
   * Initializes the component
   * @private
   * @returns {void}
   */
  init() {
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

    this.isPopover = (this.settings.content !== null && typeof this.settings.content === 'object') || this.settings.popover === true;

    this.settings.closebutton = !!((this.settings.closebutton || this.element.data('closebutton')));

    if (this.element.data('extraClass') && this.element.data('extraClass').length) {
      this.settings.extraClass = this.element.data('extraClass');
    }

    this.isRTL = Locale.isRTL();
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
      this.element.removeAttr('title').attr('aria-describedby', this.description.attr('id'));
    }

    if (this.isPopover && this.settings.trigger === 'click') {
      this.element.attr('aria-haspopup', true);
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
    this.tooltip = this.settings.tooltipElement ? $(this.settings.tooltipElement) : $('#tooltip');
    if (!this.tooltip.length) {
      const name = (this.settings.tooltipElement ? this.settings.tooltipElement.substring(1, this.settings.tooltipElement.length) : 'tooltip');
      this.tooltip = $(`<div class="${this.isPopover ? 'popover' : 'tooltip'} bottom is-hidden" role="tooltip" id="${name}"><div class="arrow"></div><div class="tooltip-content"></div></div>`);
    }

    this.tooltip.place({
      container: this.scrollparent,
      parent: this.activeElement,
      placement: this.settings.placement,
      strategy: 'flip'
    });

    this.setTargetContainer();
  },

  /**
   * Sets up all event listeners for this component
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    const delay = 400;
    let timer;

    if (this.settings.trigger === 'hover' && !this.settings.isError) {
      ((this.element.is('.dropdown, .multiselect')) ? this.activeElement : this.element)
        .on('mouseenter.tooltip', () => {
          timer = setTimeout(() => {
            self.show();
          }, delay);
        })
        .on('mouseleave.tooltip mousedown.tooltip click.tooltip mouseup.tooltip', () => {
          clearTimeout(timer);
          setTimeout(() => {
            self.hide();
          }, delay);
        })
        .on('updated.tooltip', () => {
          self.updated();
        });
    }

    function toggleTooltipDisplay() {
      if (!self.tooltip.hasClass('is-hidden')) {
        self.hide();
      } else {
        self.show();
      }
    }

    if (this.settings.trigger === 'click') {
      this.element.on('click.tooltip', () => {
        toggleTooltipDisplay();
      });
    }

    if (this.settings.trigger === 'immediate') {
      timer = setTimeout(() => {
        toggleTooltipDisplay();
      }, 1);
    }

    const isFocusable = this.settings.trigger === 'focus';
    if (isFocusable) {
      this.element.on('focus.tooltip', () => {
        self.show();
      })
        .on('blur.tooltip', () => {
          if (!self.settings.keepOpen) {
            self.hide();
          }
        });
    }

    // Close the popup/tooltip on orientation changes (but not when keyboard is open)
    $(window).on('orientationchange.tooltip', () => {
      // Match every time.
      if (self.tooltip.hasClass('is-hidden')) {
        return;
      }
      self.close();
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
      content = Locale.translate(content, true) || content;

      // Could be an ID attribute.
      // If it matches an element already on the page, grab that element's content
      // and store the reference only.
      if (content.indexOf('#') === 0) {
        const contentCheck = $(`${content}`);
        if (contentCheck.length) {
          this.content = contentCheck;
          doRender();
          return true;
        }
        return false;
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
    this.content = $.sanitizeHTML(content);

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

    if (titleArea) {
      titleArea.style.display = 'none';
    }

    if (!contentArea.previousElementSibling.classList.contains('arrow')) {
      contentArea.insertAdjacentHTML('beforebegin', '<div class="arrow"></div>');
    }

    if (typeof this.content === 'string') {
      contentArea.innerHTML = content;
    } else {
      contentArea.innerHTML = content[0].innerHTML;
    }
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

    if (typeof content === 'string') {
      content = $(content);
      contentArea.html(content);
      contentArea.find('.hidden').removeClass('hidden');
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

    content[0].classList.remove('hidden');
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
        title.innerHTML = this.settings.title;
        title.classList.add('tooltip-title');
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
      const closeBtnX = $(`<button type="button" class="btn-icon l-pull-right" style="margin-top: -9px">${
        $.createIcon({ classes: ['icon-close'], icon: 'close' })
      }<span>Close</span>` +
        '</button>').on('click', () => {
        self.hide();
      });

      title.appendChild(closeBtnX[0]);
    }

    content.initialize();
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
    this.isInPopup = false;

    if (newSettings) {
      this.settings = utils.mergeSettings(this.element[0], newSettings, this.settings);
    }

    if (this.settings.beforeShow && !ajaxReturn) {
      const response = function (content) {
        self.show({ content }, true);
      };

      if (typeof this.settings.beforeShow === 'string') {
        window[this.settings.beforeShow](response);
        return;
      }

      this.settings.beforeShow(response);
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
     * @property {Object} event - The jquery event object
     * @property {Object} tooltip - instance
     */
    okToShow = this.element.triggerHandler('beforeshow', [this.tooltip]);
    if (okToShow === false) {
      return;
    }

    this.tooltip[0].setAttribute('style', '');
    this.tooltip[0].classList.add(this.settings.placement);

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
     * @property {Object} event - The jquery event object
     * @property {Object} tooltip - instance
     */
    this.element.trigger('show', [this.tooltip]);

    setTimeout(() => {
      $(document).on('mouseup.tooltip', (e) => {
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

        if (target.closest('.popover').length === 0 &&
            target.closest('.dropdown-list').length === 0) {
          self.hide(e);
        }
      })
        .on('keydown.tooltip', (e) => {
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
        $('body').on('resize.tooltip', () => {
          self.hide();
        });
      }

      // Hide on Page scroll
      $('body').on('scroll.tooltip', () => {
        self.hide();
      });

      self.element.closest('.modal-body-wrapper').on('scroll.tooltip', () => {
        self.hide();
      });

      self.element.closest('.scrollable').on('scroll.tooltip', () => {
        self.hide();
      });

      self.element.closest('.datagrid-body').on('scroll.tooltip', () => {
        self.hide();
      });

      // Click to close
      if (self.settings.isError) {
        self.tooltip.on('click.tooltip', () => {
          self.hide();
        });
      }
      /**
       * Fires after show the tooltip.
       *
       * @event aftershow
       * @memberof Tooltip
       * @property {Object} event - The jquery event object
       * @property {Object} tooltip - instance
       */
      self.element.trigger('aftershow', [self.tooltip]);
    }, 400);
  },

  /**
   * Places the tooltip element itself in the correct DOM element.
   * If the current element is inside a scrollable container, the tooltip element
   *  goes as high as possible in the DOM structure.
   * @returns {void}
   */
  setTargetContainer() {
    let targetContainer = $('body');

    // adjust the tooltip if the element is being scrolled inside a scrollable DIV
    this.scrollparent = this.element.closest('.page-container.scrollable');
    if (this.scrollparent.length) {
      targetContainer = this.scrollparent;
    }

    if (this.settings.parentElement) {
      targetContainer = this.settings.parentElement;
    }

    // this.tooltip.detach().appendTo(targetContainer);
    targetContainer[0].appendChild(this.tooltip[0]);
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
    this.tooltip.triggerHandler('tooltipafterplace', [placementObj]);
  },

  /**
   * Resets the current position of the tooltip.
   * @returns {this} component instance
   */
  position() {
    this.setTargetContainer();
    this.tooltip[0].classList.remove('is-hidden');

    const self = this;
    const distance = this.isPopover ? 20 : 10;
    const tooltipPlacementOpts = this.settings.placementOpts || {};
    const opts = $.extend({}, {
      x: 0,
      y: distance,
      container: this.scrollparent,
      containerOffsetX: tooltipPlacementOpts.containerOffsetX || this.settings.offset.left,
      containerOffsetY: tooltipPlacementOpts.containerOffsetY || this.settings.offset.top,
      parent: tooltipPlacementOpts.parent || this.activeElement,
      placement: tooltipPlacementOpts.placement || this.settings.placement,
      strategies: ['flip', 'nudge']
    }, tooltipPlacementOpts);

    if (opts.placement === 'left' || opts.placement === 'right') {
      opts.x = distance;
      opts.y = 0;
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
   * @returns {void}
   */
  hide() {
    if (this.settings.keepOpen) {
      return;
    }

    if (this.isInPopup) {
      this.settings.content.addClass('hidden');
      return;
    }

    this.tooltip[0].classList.add('is-hidden');
    this.tooltip[0].style.left = '';
    this.tooltip[0].style.top = '';
    this.tooltip.find('.arrow').removeAttr('style');

    this.detachOpenEvents();

    if ($('.popover').not('.is-hidden').length === 0) {
      $(document).off('mouseup.tooltip keydown.tooltip');
      $('body').off('resize.tooltip');
    }

    /**
     * Fires when hide the tooltip.
     *
     * @event hide
     * @memberof Tooltip
     * @property {Object} event - The jquery event object
     * @property {Object} tooltip - instance
     */
    this.element.trigger('hide', [this.tooltip]);
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
    this.tooltip.off('click.tooltip');
    $(document).off('mouseup.tooltip');
    $('body').off('resize.tooltip scroll.tooltip');
    this.element.closest('.modal-body-wrapper').off('scroll.tooltip');
    this.element.closest('.scrollable').off('scroll.tooltip');
    this.element.closest('.datagrid-body').off('scroll.tooltip');
  },

  /**
   * Tears down this component instance, removing all internal flags and unbinding events.
   * @private
   * @returns {this} component instance
   */
  teardown() {
    this.description.remove();
    this.descriptionId = undefined;
    this.activeElement = undefined;

    this.element.removeAttr('aria-describedby').removeAttr('aria-haspopup');
    if (!this.tooltip.hasClass('is-hidden')) {
      this.hide();
    }

    if (this.tooltip && this.tooltip.data('place')) {
      this.tooltip.data('place').destroy();
    }

    this.element.off('mouseenter.tooltip mouseleave.tooltip mousedown.tooltip click.tooltip mouseup.tooltip updated.tooltip focus.tooltip blur.tooltip');
    this.detachOpenEvents();

    $(window).off('orientationchange.tooltip');

    return this;
  },

  /**
   * Destroys this component instance
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Tooltip, COMPONENT_NAME };
