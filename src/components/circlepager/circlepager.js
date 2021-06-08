import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { colorUtils } from '../../utils/color';
import { Locale } from '../locale/locale';

// Default Settings
const COMPONENT_NAME = 'circlepager';

/**
 * The Circle Pager Displays content in a sliding carousel and has paging buttons.
 * @class CirclePager
 * @constructor
 *
 * @param {jQuery[]|HTMLElement} element The component element.
 * @param {object} [settings] The component settings.
 * @param {Integer} [settings.slidesToShow=1] The number of slides to show in one view / pane
 * @param {Integer} [settings.startingSlide] First showing slide/group, an 0-based integer
 * @param {boolean} [settings.loop=false] Setting loop: true will loop back after next/previous reached to end
 * @param {string} [settings.attributes=null] Add extra attributes like id's to the element. e.g. `attributes: { name: 'id', value: 'my-unique-id' }`
 * @param {boolean} [settings.showArrows=false] If true, will show arrow around bullets nav
 * @param {boolean} [settings.footerContainment = false] If true will append bullet/pager nav to card or widget footer
 * @param {boolean} [settings.hideBulletsOnOverflow = false] If true will hide bullets nav
 * @param {string} [settings.pageSelectorInputText = null] Custom text for pager nav selector input
 */
const CIRCLEPAGER_DEFAULTS = {
  slidesToShow: 1,
  startingSlide: null,
  loop: false,
  attributes: null,
  showArrows: false,
  footerContainment: false,
  hideBulletsOnOverflow: false,
  pageSelectorInputText: null
};

function CirclePager(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, CIRCLEPAGER_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// CirclePager Methods
CirclePager.prototype = {

  init() {
    this.setElements();

    if (this.slides.length) {
      this.createControls();
      this.handleEvents();
      this.initActiveSlide();
      this.showCollapsedView();
      this.addAttributes();
    }
  },

  /**
   * Set elements
   * @private
   * @returns {void}
   */
  setElements() {
    const s = this.settings;

    this.setResponsiveSlidesToShow();
    this.container = $('.slides', this.element);
    this.slidesJQ = $('.slide', this.element);
    this.slidesToShow = s.slidesToShow;
    this.slides = [];
    this.isVisible = true;

    for (let i = 0, l = this.slidesJQ.length; i < l; i++) {
      this.slides.push({ node: $(this.slidesJQ[i]) });
    }

    this.activeIndex = s.startingSlide !== null &&
      s.startingSlide > -1 && s.startingSlide < this.slides.length ?
      s.startingSlide : 0;

    utils.addAttributes(this.element, this, this.settings.attributes);
  },

  /**
   * Create controls
   * @private
   * @returns {void}
   */
  createControls() {
    const len = this.slides.length;
    const html = { bullets: '' };
    const dsSlides = [];
    let numOfButtons = 0;
    let slide;
    let temp;
    let href;
    let text;
    let buttonText;
    let last;
    let lastIndex;
    let isSingle;
    let isDisabled;

    for (let i = 0, l = len; i < l; i += this.slidesToShow) {
      temp = '';
      numOfButtons++;
      isSingle = (this.slidesToShow === 1) || (len - i === 1);
      text = Locale.translate(isSingle ? 'SlideOf' : 'SlidesOf');
      // Keep href in english language only
      href = isSingle ? '#slide {0} of {1}' : '#slides {0} and {1} of {2}';

      // Collect as much bullets need to present
      for (let g = 0; g < this.slidesToShow && (i + g) < len; g++) {
        temp += `${(i + g + 1)}, `;
      }
      text = text.replace(isSingle ? '{1}' : '{2}', len);
      href = href.replace(isSingle ? '{1}' : '{2}', len);
      temp = temp.slice(0, -2);
      lastIndex = temp.lastIndexOf(',');
      last = temp.substr(lastIndex + 2);

      // Controls for single slide in view
      if (isSingle) {
        isDisabled = '';
        slide = this.slides[i].node;

        // Set disabled
        if (slide.is('.is-disabled, [disabled]') && !slide.is('[disabled="false"]')) {
          isDisabled = ' disabled tabindex="-1"';
          this.slides[i].isDisabled = true;
        }

        // Set default starting slide
        if (slide.is('.active') && this.settings.startingSlide === null && isDisabled === '') {
          this.activeIndex = i;
        }

        // Use custom text if supplied
        buttonText = slide.attr('data-button-text');
        text = (buttonText && buttonText.length) ?
          buttonText : text.replace('{0}', temp);

        href = href.replace('{0}', temp);
      } else {
        // Controls for multiple slides in view
        temp = temp.substr(0, lastIndex);
        text = text.replace('{1}', last).replace('{0}', temp);
        href = href.replace('{1}', last).replace('{0}', temp);
      }

      href = href.toLowerCase().replace(/[\s,--]+/g, '-');
      html.bullets += `<a href="${href}" class="control-button hyperlink hide-focus is-ripple"${isDisabled}><span class="audible">${text}</span></a>`;
      dsSlides.push({ href, text, isDisabled });
    }

    // Previous/Next buttons
    const previousButton = $('.btn-previous', this.element);
    const nextButton = $('.btn-next', this.element);
    const buttonWidth = 44;
    const elementWidth = this.element.width();
    this.isBulletsNav = elementWidth > numOfButtons * buttonWidth;
    let isInputNav = !this.isBulletsNav;
    if (!this.isBulletsNav && this.settings.hideBulletsOnOverflow) {
      if (!previousButton.length) {
        html.previous = '' +
          `<button class="btn-previous" type="button">
            ${$.createIcon('left-arrow')}
            <span class="audible"> ${Locale.translate('Previous')}</span>
          </button>`;
      }
      if (!nextButton.length) {
        html.next = '' +
          `<button class="btn-next" type="button">
            ${$.createIcon('right-arrow')}
            <span class="audible">${Locale.translate('Next')}</span>
          </button>`;
      }
    } else {
      this.pagerApi?.destroy();
      const extraElems = $('.controls .btn-controls-previous, .btn-controls-next, .pager-container', this.element);
      previousButton.add(nextButton).add(extraElems).remove();
      this.element.closest('.card, .widget')
        .find('.card-footer .circlepager-controls, .widget-footer .circlepager-controls').remove();

      if (this.settings.showArrows) {
        isInputNav = elementWidth < ((numOfButtons * buttonWidth) + 100);
        html.controlsPrevious = '' +
          `<button class="btn-icon btn-controls-previous" type="button">
            ${$.createIcon('previous-page')}
            <span class="audible"> ${Locale.translate('Previous')}</span>
          </button>`;
        html.controlsNext = '' +
          `<button class="btn-icon btn-controls-next" type="button">
            ${$.createIcon('next-page')}
            <span class="audible">${Locale.translate('Next')}</span>
          </button>`;
      }
    }

    if (this.activeIndex > 0 && this.activeIndex > (numOfButtons - 1)) {
      this.activeIndex = numOfButtons - 1;
    }

    if (numOfButtons > 1) {
      let isFooterContainment = true;
      html.all = '<div class="controls circlepager-controls">';
      if (html.previous || html.next) {
        isFooterContainment = false;
        html.all += `${html.bullets}</div>${html.previous || ''}${html.next || ''}`;
      } else if (isInputNav) {
        isFooterContainment = false;
        html.all += '<div class="pager-container" data-init="false"></div></div>';
      } else {
        html.all += `${html.controlsPrevious || ''}${html.bullets}${html.controlsNext || ''}</div>`;
      }
      this.element.append(html.all).find('button').button();
      if (isFooterContainment) {
        this.SetFooterContainment();
      }
      this.pagerApi = this.element.find('.pager-container').pager({
        type: 'standalone',
        dataset: dsSlides,
        pagesize: 1,
        showPageSizeSelector: false,
        showPageSelectorInput: true,
        footerContainmentClass: 'footer-circlepager',
        footerContainment: this.settings.footerContainment,
        pageSelectorInputText: this.settings.pageSelectorInputText
      }).data('pager');
      this.setPagerButtonsState();
    }
  },

  /**
   * Set pager buttons state
   * @private
   * @returns {void}
   */
  SetFooterContainment() {
    // Place the bullets inside of the card/widget footer
    const widgetContainer = this.element.closest('.card, .widget');
    if (widgetContainer.length && this.settings.footerContainment) {
      const widgetTypes = ['widget', 'card'];

      widgetTypes.forEach((type) => {
        const widgetContent = this.element.closest(`.${type}-content`);
        if (!widgetContent.length) {
          return;
        }

        let widgetFooter = widgetContent.next(`.${type}-footer`);
        widgetFooter.find('.circlepager-controls').remove();
        if (!widgetFooter.length) {
          widgetFooter = $(`<div class="${type}-footer footer-circlepager"></div>`).insertAfter(widgetContent);
        }

        this.element.find('.circlepager-controls').appendTo(widgetFooter);
      });
    }
  },

  /**
   * Set pager buttons state
   * @private
   * @returns {void}
   */
  setPagerButtonsState() {
    if (this.pagerApi) {
      const isEnabled = {
        prevAndFirst: this.pagerApi.state.activePage > 1,
        nextAndLast: this.pagerApi.state.activePage < this.pagerApi.state.pages
      };
      this.pagerApi.updated({
        enableFirstButton: isEnabled.prevAndFirst,
        enablePreviousButton: isEnabled.prevAndFirst,
        enableNextButton: isEnabled.nextAndLast,
        enableLastButton: isEnabled.nextAndLast,
        activePage: this.pagerApi.state.activePage
      });
    }
  },

  /**
   * Check if given element is visible in container
   * @private
   * @param {object} element to check.
   * @returns {boolean} -1 if not in container
   */
  isVisibleInContainer(element) {
    if (element && element[0]) {
      const eRect = element[0].getBoundingClientRect();
      const cRect = this.element[0].getBoundingClientRect();

      return (eRect.left > cRect.left && eRect.left < (cRect.left + cRect.width) &&
        eRect.top > cRect.top && eRect.top < (cRect.top + cRect.height));
    }
    return -1;
  },

  /**
   * Update number of slides to show in view
   * @private
   * @param {object} numOfSlides to show.
   * @returns {object} this api
   */
  updateSlidesToShow(numOfSlides) {
    if (!this.isActive) {
      return;
    }
    this.settings.slidesToShow = numOfSlides || 1;
    this.updated();
    return this; // eslint-disable-line
  },

  /**
   * Set responsive slides to show
   * @private
   * @returns {void}
   */
  setResponsiveSlidesToShow() {
    const minWidth = 300;
    const elemWidth = this.element.width();
    this.resSlidesToShow = this.resSlidesToShow || this.settings.slidesToShow;
    if (elemWidth < minWidth && this.settings.slidesToShow > 1) {
      this.settings.slidesToShow = 1;
    } else {
      this.settings.slidesToShow = this.resSlidesToShow;
    }
  },

  /**
   * Make sure max number of slides to show in view
   * @private
   * @param {object} numOfSlides to show.
   * @returns {void}
   */
  responsiveSlidesToShow(numOfSlides) {
    if (!this.isActive) {
      return;
    }

    this.setResponsiveSlidesToShow();

    this.slidesToShow = numOfSlides || this.settings.slidesToShow;
    this.unbind().slidesJQ.css('width', '');
    if (this.slides.length) {
      setTimeout(() => {
        this.createControls();
        this.handleEvents();
        this.initActiveSlide();
        this.showCollapsedView();
        this.removeOverflowedControls();
      }, 0);
    }
  },

  /**
   * Show a slide to First Slide
   * @private
   * @param {string} index  The index of the slide to show (0 based)
   * @returns {void}
   */
  show(index) {
    if (!this.isActive) {
      return;
    }
    index = typeof index !== 'undefined' ? index : this.activeIndex;
    this.activeIndex = index;

    const left = index > 0 ? (`${(Locale.isRTL() ? '' : '-') + (index * 100)}%`) : 0;
    this.controlButtons.removeClass('is-active').eq(index).addClass('is-active');
    this.container[0].style.left = left;

    // Make sure bullets navigation do not overflow
    if (!this.isBulletsNav && this.settings.hideBulletsOnOverflow) {
      this.element.addClass('is-bullets-nav-hidden');
      this.controlButtons.find('span').addClass('audible').end()
        .eq(index)
        .find('span')
        .removeClass('audible');
    } else {
      this.element.removeClass('is-bullets-nav-hidden');
      this.controlButtons.find('span').addClass('audible');
    }

    // Set focus
    if (this.isFocus && this.isBulletsNav) {
      this.isFocus = false;
      this.controlButtons.eq(index).focus();
    }
  },

  /**
   * Move to First Slide
   * @private
   * @returns {void}
   */
  first() {
    this.show(0);
  },

  /**
   * Move to Last Slide
   * @private
   * @returns {void}
   */
  last() {
    this.show(Math.round(this.slides.length / this.slidesToShow) - 1);
  },

  /**
   * Move to Previous Slide
   * @private
   * @returns {void}
   */
  prev() {// eslint-disable-line
    let prev;

    if (this.activeIndex > 0) {
      prev = this.activeIndex - 1;
    } else {
      prev = this.settings.loop ? Math.round(this.slides.length / this.slidesToShow) - 1 : 0;
    }

    if (this.slides[prev].isDisabled) {
      setTimeout(() => {
        this.prev();
      }, 0);
      this.activeIndex = prev;
      return false;
    }
    this.show(prev);
  },

  /**
  * Move to Next Slide
  * @private
  * @returns {void}
  */
  next() {// eslint-disable-line
    let next;
    if (this.activeIndex >= Math.round(this.slides.length / this.slidesToShow) - 1) {
      next = this.settings.loop ? 0 : this.activeIndex;
    } else {
      next = this.activeIndex + 1;
    }

    if (this.slides[next].isDisabled) {
      setTimeout(() => {
        this.next();
      }, 0);
      this.activeIndex = next;
      return false;
    }
    this.show(next);
  },

  /**
  * Make active
  * @private
  * @returns {void}
  */
  showCollapsedView() {
    this.isActive = true;
    this.element.addClass('is-active');
    this.container[0].style.width = `${(100 * this.slides.length)}%`;
    if (this.settings.slidesToShow > 1 &&
       (this.slidesJQ.eq(0).width() * this.slidesToShow > this.element.width())) {
      this.responsiveSlidesToShow(this.slidesToShow - 1);
      return;
    }
    for (let i = 0, l = this.slidesJQ.length; i < l; i++) {
      this.slidesJQ[i].style.width = `${((100 / this.slidesToShow) / this.slides.length)}%`;
    }
    this.show();
  },

  /**
   * This will remove excess control elements that don't need.
   * @private
   * @returns {void}
   */
  removeOverflowedControls() {
    const mainControls = this.controlButtons.parent();
    const siblingControls = mainControls[0]?.nextElementSibling;
    if (mainControls.length > 1 && siblingControls) {
      siblingControls.remove();
    }
  },

  /**
   * Add attributes for control buttons
   * @private
   * @returns {void}
   */
  addAttributes() {
    for (let i = 0, l = this.controlButtons.length; i < l; i++) {
      const ctrlBtns = $(this.controlButtons[i]);
      utils.addAttributes(ctrlBtns, this, this.settings.attributes, `control-${i + 1}`);
    }
  },

  /**
  * Make un-active
  * @private
  * @returns {void}
  */
  showExpandedView() {
    this.isActive = false;
    this.element.removeClass('is-active');
    if (this.element && this.element[0]) {
      this.element[0].style.width = '';
    }
    if (this.container && this.container[0]) {
      this.container[0].style.width = '';
      this.container[0].style.left = '';
    }
  },

  /**
  * Initialize active slide
  * @private
  * @returns {void}
  */
  initActiveSlide() {// eslint-disable-line
    if (this.slides[this.activeIndex].isDisabled) {
      this.next();
      return false;
    }
    this.show();
    this.slidesJQ.addClass('is-visible');
  },

  /**
   * set ripple effect on given element
   * https://codepen.io/jakob-e/pen/XZoZWQ
   * @private
   * @param {object} el The element.
   * @param {object|null} evt The optional jquery event.
   * @returns {void}
   */
  setRipple(el, evt) {
    if (!el || !el.classList?.contains('is-ripple')) {
      return;
    }
    const e = evt && evt.touches ? evt.touches[0] : (evt || {});
    const r = el.getBoundingClientRect();
    const d = Math.sqrt(Math.pow(r.width, 2) + Math.pow(r.height, 2)) * 2;
    const x = e.clientX ? (e.clientX - r.left) : (el.offsetWidth / 2);
    const y = e.clientY ? (e.clientY - r.top) : (el.offsetHeight / 2);
    const orig = el.style.cssText;

    // custom colors
    const hex = el.getAttribute('data-hex');
    const contrast = colorUtils.getContrastColor(hex);
    const bg = {
      ripple: colorUtils.getLuminousColorShade(hex, contrast === 'white' ? '0.3' : '-0.3'),
      elem: colorUtils.hexToRgba(hex, 0.7)
    };
    const customColor = hex !== null ? `--ripple-background: ${bg.ripple}; background-color: ${bg.elem}; ` : '';

    el.style.cssText = `${customColor}--s: 0; --o: 1`;
    el.offsetTop; // eslint-disable-line
    el.style.cssText = `${customColor}--t: 1; --o: 0; --d: ${d}; --x:${x}; --y:${y};`;

    // reset
    $(el).off('transitionend.monthview-ripple').on('transitionend.monthview-ripple', (event) => {
      const prop = event.propertyName || event.originalEvent?.propertyName;
      if (prop === 'transform') {
        el.style.cssText = orig;
      }
    });
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {object} The api
   */
  unbind() {
    const xFooterControls = this.element.closest('.card, .widget')
      .find('.card-footer .circlepager-controls, .widget-footer .circlepager-controls');
    if (this.controlButtons && !this.controlButtons.length) {
      this.controlButtons = xFooterControls.find('.control-button');
    }
    this.pagerApi?.destroy();
    $('body').off('resize.circlepager');
    this.element.find('.pager-container').off('page.circlepager');
    this.element.off('focus.circlepager keydown.circlepager', '*');
    if (this.controlButtons) {
      for (let i = 0, len = this.controlButtons.length; i < len; i++) {
        $(this.controlButtons[i]).off('click.circlepager');
      }
      this.controlButtons.off('click.circlepager keydown.circlepager');
    }
    $('.btn-previous, .btn-controls-previous', this.element)
      .add(xFooterControls.find('.btn-controls-previous'))
      .off('click.circlepager');

    $('.btn-next, .btn-controls-next', this.element)
      .add(xFooterControls.find('.btn-controls-next'))
      .off('click.circlepager');

    $('.controls', this.element).remove();
    this.element.closest('.card, .widget').find('.footer-circlepager').remove();

    this.showExpandedView();

    const possibleTab = this.element.closest('.tab-panel-container').prev('.tab-container');
    possibleTab.off('activated.circlepager');
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, CIRCLEPAGER_DEFAULTS);
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

  /**
   * Attach Events used by the Control
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    const xFooterControls = this.element.closest('.card, .widget')
      .find('.card-footer .circlepager-controls, .widget-footer .circlepager-controls');

    this.controlButtons = $('.control-button', this.element);
    if (!this.controlButtons.length) {
      this.controlButtons = xFooterControls.find('.control-button');
    }

    // Previous button
    $('.btn-previous, .btn-controls-previous', this.element).add(xFooterControls.find('.btn-controls-previous'))
      .off('click.circlepager').on('click.circlepager', (e) => {
        this.prev();
        e.stopImmediatePropagation();
      });

    // Next button
    $('.btn-next, .btn-controls-next', this.element).add(xFooterControls.find('.btn-controls-next'))
      .off('click.circlepager').on('click.circlepager', (e) => {
        this.next();
        e.stopImmediatePropagation();
      });

    for (let i = 0, l = this.controlButtons.length; i < l; i++) {
      const btn = $(this.controlButtons[i]);
      btn.hideFocus();

      // Handle clicks for bottom bullet links
      btn.off('click.circlepager').on('click.circlepager', (e) => {
        e.preventDefault();
        if (this.slides[i].isDisabled) {
          return;
        }
        this.setRipple(btn[0], e);
        this.show(i);
      });
    }

    // Handle keyboard events

    // Prevent hidden slide's content to be get focused
    // on focusable elements in slides content
    this.element.off('focus.circlepager', '*').on('focus.circlepager', '*', function(e) {// eslint-disable-line
      let handled = false;
      if (!self.isVisibleInContainer($(this))) {
        const canfocus = self.element.find(':focusable');
        for (let i = 0, l = canfocus.length; i < l; i++) {
          if (self.isVisibleInContainer(canfocus.eq(i))) {
            canfocus.eq(i).focus();
            handled = true;
            break;
          }
        }
      }
      e.stopPropagation();
      if (handled) {
        return false;
      }
    });
    // Keydown on focusable elements in slides content to
    // prevent hidden slide's content to be get focused
    this.element.off('keydown.circlepager', '*').on('keydown.circlepager', '*', function(e) {// eslint-disable-line
      let handled = false;
      const key = e.which || e.keyCode || e.charCode || 0;
      const canfocus = $(':focusable');
      const index = canfocus.index(this);

      if (key === 9) { // tab
        // Using shift key with tab (going backwards)
        if (e.shiftKey) {
          for (let i = index - 1; i >= 0; i--) {
            if ((self.element.has(canfocus.eq(i)).length < 1) ||
                (self.isVisibleInContainer(canfocus.eq(i)))) {
              canfocus.eq(i).focus();
              handled = true;
              break;
            }
          }
        } else if (!self.isVisibleInContainer(canfocus.eq(index + 1))) {
          // Using only tab key (going forward)
          self.controlButtons.first().focus();
          handled = true;
        }
      }
      e.stopPropagation();
      if (handled) {
        return false;
      }
    });

    // Control buttons
    this.controlButtons.off('keydown.circlepager').on('keydown.circlepager', (e) => {// eslint-disable-line
      let handled = false;
      const key = e.which || e.keyCode || e.charCode || 0;
      const isRTL = Locale.isRTL();

      // Left and Right arrow keys
      if ([37, 39].indexOf(key) !== -1) {
        self.isFocus = true; // Move focus
        if (e.altKey) {
          // [Alt + Left/Right arrow] to move to the first or last
          if ((key === 37 && !isRTL) || (key === 39 && isRTL)) {
            self.first();
          } else {
            self.last();
          }
        } else {
          // Left and Right arrow keys to navigate
          if ((!isRTL && key === 37) || (isRTL && key === 39)) {
            self.prev();
          } else {
            self.next();
          }
          handled = true;
        }
      }

      if (handled) {
        e.preventDefault();
        e.stopPropagation();
        this.setRipple(e.currentTarget, e);
        return false;
      }
    });

    // Set max number of slides can view on resize
    $('body').off('resize.circlepager').on('resize.circlepager', () => {
      self.responsiveSlidesToShow();
    });

    const possibleTab = self.element.closest('.tab-panel-container').prev('.tab-container');
    possibleTab.off('activated.circlepager').on('activated.circlepager', () => {
      self.responsiveSlidesToShow();
    });

    // Control pager
    this.element.find('.pager-container').off('page.circlepager').on('page.circlepager', (e, args) => {
      this.setPagerButtonsState();
      this.show(args.activePage - 1);
    });
  }

};

export { CirclePager, COMPONENT_NAME };
