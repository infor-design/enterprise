/* jshint esversion:6 */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// Default Settings
const COMPONENT_NAME = 'circlepager';

const CIRCLEPAGER_DEFAULTS = {
  slidesToShow: 1,
  startingSlide: null,
  loop: false
};
/**
* The Circle Pager Displays content in a sliding carousel and has paging buttons.
*
* @class CirclePager
* @param {Integer} slidesToShow  The number of slides to show in one view / pane
* @param {Integer} startingSlide  First showing slide/group, an 0-based integer
* @param {Boolean} loop   Setting loop: true will loop back after next/previous reached to end
*
*/
function CirclePager(element, settings) {
  this.settings = utils.mergeSettings(element, settings, CIRCLEPAGER_DEFAULTS);

  this.element = $(element);
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
      this.showCollapsedView();
      this.initActiveSlide();
    }
  },

  // Set elements
  setElements() {
    const s = this.settings;

    this.container = $('.slides', this.element);
    this.slidesJQ = $('.slide', this.element);
    this.slidesToShow = s.slidesToShow;
    this.slides = [];

    for (let i = 0, l = this.slidesJQ.length; i < l; i++) {
      this.slides.push({ node: $(this.slidesJQ[i]) });
    }

    this.activeIndex = s.startingSlide !== null &&
      s.startingSlide > -1 && s.startingSlide < this.slides.length ?
        s.startingSlide : 0;
  },

  // Create controls
  createControls() {
    let len = this.slides.length,
      html = '<div class="controls">',
      htmlContent = '',
      numOfButtons = 0,
      i, l, slide, temp, href, text, buttonText,
      last, lastIndex, isSingle, isDisabled,
      previousButton, nextButton;

    for (i = 0, l = len; i < l; i += this.slidesToShow) {
      temp = '';
      numOfButtons++;
      isSingle = (this.slidesToShow === 1) || (len - i === 1);
      text = Locale.translate(isSingle ? 'SlideOf' : 'SlidesOf') + '';
      // Keep href in english language only
      href = isSingle ? '#slide {0} of {1}' : '#slides {0} and {1} of {2}';

      // Collect as much bullets need to present
      for (let g = 0; g < this.slidesToShow && (i + g) < len; g++) {
        temp += (i + g + 1) + ', ';
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
      }

      // Controls for multiple slides in view
      else {
        temp = temp.substr(0, lastIndex);
        text = text.replace('{1}', last).replace('{0}', temp);
        href = href.replace('{1}', last).replace('{0}', temp);
      }

      href = href.toLowerCase().replace(/[\s,--]+/g, '-');

      htmlContent += '<a href="'+ href +'" class="control-button hyperlink hide-focus"'+ isDisabled +'><span class="audible">'+ text +'</span></a>';
    }

    html += htmlContent + '</div>';

    // Previous/Next buttons
    this.isBulletsNav = this.element.width() > numOfButtons * 29;
    previousButton = $('.btn-previous', this.element);
    nextButton = $('.btn-next', this.element);
    if (!this.isBulletsNav) {
      if (!previousButton.length) {
        html += '<button class="btn-previous" type="button">' + $.createIcon('left-arrow') + '<span class="audible">'+
            Locale.translate('Previous') +'</span></button>';
      }
      if (!nextButton.length) {
        html += '<button class="btn-next" type="button">' + $.createIcon('right-arrow') + '<span class="audible">'+
            Locale.translate('Next') +'</span></button>';
      }
    } else {
      previousButton.add(nextButton).remove();
    }

    if (this.activeIndex > 0 && this.activeIndex > (numOfButtons - 1)) {
      this.activeIndex = numOfButtons - 1;
    }

    if (numOfButtons > 1) {
      this.element.append(html);
    }
  },

  // Check if given element is visible in container
  isVisibleInContainer(element) {
    if (element && element[0]) {
      const eRect = element[0].getBoundingClientRect(),
        cRect = this.element[0].getBoundingClientRect();
      return (eRect.left > cRect.left && eRect.left < (cRect.left + cRect.width) &&
        eRect.top > cRect.top && eRect.top < (cRect.top + cRect.height));
    }
    return -1;
  },

  // Update number of slides to show in view
  updateSlidesToShow(numOfSlides) {
    if (!this.isActive) {
      return;
    }
    this.settings.slidesToShow = numOfSlides || 1;
    this.updated();
    return this;
  },

  // Make sure max number of slides to show in view
  responsiveSlidesToShow(numOfSlides) {
    if (!this.isActive) {
      return;
    }

    this.slidesToShow = numOfSlides || this.settings.slidesToShow;
    this.unbind().slidesJQ.css('width', '');
    if (this.slides.length) {
      setTimeout(() => {
        this.createControls();
        this.handleEvents();
        this.showCollapsedView();
        this.initActiveSlide();
      }, 0);
    }
  },

  /**
  * Show a slide to First Slide
  * @param {String} index  The index of the slide to show (0 based)
  */
  show(index) {
    if (!this.isActive) {
      return;
    }
    index = typeof index !== 'undefined' ? index : this.activeIndex;
    this.activeIndex = index;

    const left = index > 0 ? ((Locale.isRTL() ? '' : '-') + (index * 100) +'%') : 0;
    this.controlButtons.removeClass('is-active').eq(index).addClass('is-active');
    this.container[0].style.left = left;

    // Make sure bullets navigation do not overflow
    if (!this.isBulletsNav) {
      this.element.addClass('is-bullets-nav-hidden');
      this.controlButtons.find('span').addClass('audible').end()
        .eq(index).find('span').removeClass('audible');
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
  */
  first() {
    this.show(0);
  },

  /**
  * Move to Last Slide
  */
  last() {
    this.show(Math.round(this.slides.length / this.slidesToShow) - 1);
  },

  /**
  * Move to Previous Slide
  */
  prev() {
    const prev = this.activeIndex > 0 ?
      this.activeIndex - 1 : (this.settings.loop ? Math.round(this.slides.length / this.slidesToShow) - 1 : 0);

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
  */
  next() {
    const next = this.activeIndex >= Math.round(this.slides.length / this.slidesToShow) - 1 ? (this.settings.loop ? 0 : this.activeIndex) : this.activeIndex + 1;

    if (this.slides[next].isDisabled) {
      setTimeout(() => {
        this.next();
      }, 0);
      this.activeIndex = next;
      return false;
    }
    this.show(next);
  },

  // Make active
  showCollapsedView() {
    this.isActive = true;
    this.element.addClass('is-active');
    this.container[0].style.width = (100 * this.slides.length) + '%';
    if (this.settings.slidesToShow > 1 &&
       (this.slidesJQ.eq(0).width() * this.slidesToShow > this.element.width())) {
      this.responsiveSlidesToShow(this.slidesToShow - 1);
      return;
    }
    for (let i = 0, l = this.slidesJQ.length; i < l; i++) {
      this.slidesJQ[i].style.width = ((100 / this.slidesToShow) / this.slides.length) + '%';
    }
    this.show();
  },

  // Make un-active
  showExpandedView() {
    this.isActive = false;
    this.element.removeClass('is-active');
    this.element[0].style.width = '';
    this.container[0].style.width = '';
    this.container[0].style.left = '';
  },

  // Initialize active slide
  initActiveSlide() {
    if (this.slides[this.activeIndex].isDisabled) {
      this.next();
      return false;
    }
    this.show();
  },

  unbind() {
    $('body').off('resize.circlepager');
    this.element.off('focus.circlepager keydown.circlepager', '*');
    this.controlButtons.off('click.circlepager keydown.circlepager');
    $('.btn-previous, .btn-next', this.element).off('click.circlepager');
    $('.controls', this.element).remove();
    this.showExpandedView();
    return this;
  },

  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, CIRCLEPAGER_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  // Teardown
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  // Handle events
  handleEvents() {
    const self = this;

    // Previous button
    $('.btn-previous', this.element)
      .onTouchClick('circlepager')
      .on('click.circlepager', (e) => {
        this.prev();
        e.stopImmediatePropagation();
      });

    // Next button
    $('.btn-next', this.element)
      .onTouchClick('circlepager')
      .on('click.circlepager', (e) => {
        this.next();
        e.stopImmediatePropagation();
      });

    this.controlButtons = $('.control-button', this.element);

    for (let i = 0, l = this.controlButtons.length; i < l; i++) {
      let btn = $(this.controlButtons[i]);
      btn.hideFocus();

      // Handle clicks for bottom bullet links
      btn.on('click.circlepager', (e) => {
        e.preventDefault();
        if (this.slides[i].isDisabled) {
          return;
        }
        this.show(i);
      });
    }


    // Handle keyboard events

    // Prevent hidden slide's content to be get focused
    // on focusable elements in slides content
    this.element.on('focus.circlepager', '*', function(e) {
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
    this.element.on('keydown.circlepager', '*', function(e) {
      let handled = false;
      const key = e.which || e.keyCode || e.charCode || 0,
        canfocus = $(':focusable'),
        index = canfocus.index(this);

      if (key === 9) {//tab
        // Using shift key with tab (going backwards)
        if (e.shiftKey) {
          for (let i = index-1; i >= 0; i--) {
            if ((self.element.has(canfocus.eq(i)).length < 1) ||
                (self.isVisibleInContainer(canfocus.eq(i)))) {
              canfocus.eq(i).focus();
              handled = true;
              break;
            }
          }
        }
        // Using only tab key (going forward)
        else {
          if (!self.isVisibleInContainer(canfocus.eq(index + 1))) {
            self.controlButtons.first().focus();
            handled = true;
          }
        }
      }
      e.stopPropagation();
      if (handled) {
        return false;
      }
    });

    // Control buttons
    this.controlButtons.on('keydown.circlepager', function(e) {
      let handled = false;
      const key = e.which || e.keyCode || e.charCode || 0,
        isRTL = Locale.isRTL();

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
        }
        // Left and Right arrow keys to navigate
        else {
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
        return false;
      }
    });

    // Set max number of slides can view on resize
    $('body').on('resize.circlepager', () => {
      self.responsiveSlidesToShow();
    });

  }

};

export { CirclePager, COMPONENT_NAME };
