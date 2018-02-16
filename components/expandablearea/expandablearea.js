import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

const COMPONENT_NAME = 'expandablearea';

/**
* @namespace
* @property {string} trigger  Id of some other button to use as a trigger
* @property {string} bottomBorder  Change the border to bottom vs top (for some cases)
*/
const EXPANDABLEAREA_DEFAULTS = {
  trigger: null,
  bottomBorder: false
};

/**
* [ExpandableArea description]
* @class ExpandableArea
* @param {string} element The component element.
* @param {string} settings The component settings.
*/
function ExpandableArea(element, settings) {
  this.settings = utils.mergeSettings(element, settings, EXPANDABLEAREA_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Expandable Area API
ExpandableArea.prototype = {

  /**
  * Initialize the Expandable area
  * @private
  */
  init() {
    this
      .setup()
      .build()
      .handleEvents();
  },

  /**
  * Setup internal variables.
  * @private
  * @returns {object} The Api for chaining.
  */
  setup() {
    this.id = this.element.attr('id');
    if (!this.id || this.id === undefined) {
      this.id = `expandable-area-${$('body').find('.expandable-area').index(this.element)}`;
    }

    this.header = this.settings.trigger ? this.element : this.element.children('.expandable-header');
    this.footer = this.element.children('.expandable-footer');
    this.content = this.element.children('.expandable-pane');

    this.isCard = this.element.is('.card, .widget');
    return this;
  },

  /**
  * Add markup to build up the component.
  * @private
  * @returns {object} The Api for chaining.
  */
  build() {
    const expanded = this.element.hasClass('is-expanded');

    this.header.attr({
      'aria-expanded': `${expanded}`,
      'aria-controls': `${this.id}-content`,
      id: `${this.id}-header`
    });
    this.content.attr({
      id: `${this.id}-content`
    });

    // Add the link and footer if not there already.
    // If we're using an expandable card,
    if (!this.isCard && !this.footer.length && !this.settings.trigger) {
      this.footer = $('<div class="expandable-footer"></div>').appendTo(this.element);
    }

    function getExpander(instance, useHeaderExpander) {
      let expander;

      if (useHeaderExpander === true) {
        // Use icon-based expander in the header
        expander = instance.header.find('expandable-expander');
        if (!expander.length) {
          expander = $(`${'<a href="#" target="_self" class="btn-expander">' +
            '<svg class="chevron icon" focusable="false" aria-hidden="true" role="presenation">' +
              '<use xlink:href="#icon-caret-down"></use>' +
            '</svg>' +
            '<span class="audible">'}${Locale.translate('ShowMore')}</span>` +
          '</a>').appendTo(instance.header);
        }

        return expander;
      }

      // Use the text-based expander button in the footer
      expander = instance.footer.find('.expandable-expander');
      if (!expander.length) {
        expander = $(`${'<a href="#" target="_self" class="expandable-expander hyperlink">' +
          '<span data-translated="true">'}${Locale.translate('ShowMore')}</span>` +
        '</a>').prependTo(instance.footer);
      }
      return expander;
    }

    this.expander = getExpander(this, this.isCard);
    this.expander.attr('href', '#').hideFocus();

    if (this.expander.length === 0) {
      this.expander = $(`#${this.settings.trigger}`);
    }

    // Change the borer to the bottom vs top
    if (this.settings.bottomBorder) {
      this.element.addClass('has-bottom-border');
    }

    // Initialized in expanded mode.
    if (expanded) {
      this.content.addClass('no-transition');
      this.element.one('afterexpand.expandable-area', () => {
        this.content.removeClass('no-transition');
      });
      this.open();
    }

    if (!expanded) {
      this.content.addClass('no-transition');
      this.element.one('aftercollapse.expandable-area', () => {
        this.content.removeClass('no-transition');
      });
      this.close();
    }

    return this;
  },

  /**
  * Return if the expandable area is current disable or not.
  * @returns {boolean} True or False depending on the disabled status.
  */
  isDisabled() {
    return this.element.hasClass('is-disabled');
  },

  /**
  * Add Keyboard Support.
  * @private
  * @param  {object} e The event we are handling.
  * @returns {void}
  */
  handleKeys(e) {
    if (this.isDisabled()) {
      return null;
    }

    const key = e.which;

    if (key === 13 || key === 32) { // Enter/Spacebar
      e.preventDefault();
      this.toggleExpanded();
      return false;
    }

    return null;
  },

  /**
  * Toggle focus classes on focus.
  * @private
  * @returns {void}
  */
  handleFocus() {
    if (this.isDisabled()) {
      return;
    }

    this.header.addClass('is-focused');
  },

  /**
  * Toggle blur classes on blur.
  * @private
  * @returns {void}
  */
  handleBlur() {
    if (this.isDisabled()) {
      return;
    }

    this.header.removeClass('is-focused');
  },

  /**
  * Returns expanded status about the current expandable area
  * @returns {boolean} True of alse depending on current expanded status.
  */
  isExpanded() {
    return this.element.is('.is-expanded');
  },

  /**
  * Toggle current expansion state.
  */
  toggleExpanded() {
    // if (this.header.attr('aria-expanded') === 'true') {
    if (this.isExpanded()) {
      this.close();
    } else {
      this.open();
    }
  },

  /**
  * Open the pane if closed.
  */
  open() {
    const canExpand = this.element.triggerHandler('beforeexpand', [this.element]);

    if (canExpand === false) {
      return;
    }

    this.element.addClass('is-expanded');
    this.header.attr('aria-expanded', 'true');
    this.expander.addClass('active');
    this.element.triggerHandler('expand', [this.element]);

    this.expander.find('span[data-translated="true"]').text(Locale.translate('ShowLess') ? Locale.translate('ShowLess') : 'Show Less');

    if (this.isCard) {
      this.expander.find('.icon').addClass('active');
    }

    if (this.content[0]) {
      this.content[0].style.display = 'block';
    }
    this.content.one('animateopencomplete', () => {
      this.element.triggerHandler('afterexpand', [this.element]);
    }).animateOpen();
  },

  /**
  * Close the pane if open.
  */
  close() {
    const canCollapse = this.element.triggerHandler('beforecollapse', [this.element]);

    if (canCollapse === false) {
      return;
    }

    this.expander.removeClass('active');
    this.element.triggerHandler('collapse', [this.element]);
    this.expander.find('span[data-translated="true"]').text(Locale.translate('ShowMore') ? Locale.translate('ShowMore') : 'Show More');

    if (this.isCard) {
      this.expander.find('.icon').removeClass('active');
    }

    this.content.one('animateclosedcomplete', () => {
      this.element.removeClass('is-expanded');
      this.header.attr('aria-expanded', 'false');
      this.element.triggerHandler('aftercollapse', [this.element]);
      this.content[0].style.display = 'none';
    }).animateClosed();
  },

  /**
  * Disable the expandable area from being closable.
  * @returns {void}
  */
  disable() {
    this.element.addClass('is-disabled');
  },

  /**
  * Enable the expandable area to allow close.
  * @returns {void}
  */
  enable() {
    this.element.removeClass('is-disabled');
  },

  /**
  * Destroy by removing markup and canceling events.
  * @returns {void}
  */
  destroy() {
    this.header.children('a').off();
    this.header.off();
    this.header
      .removeAttr('aria-controls')
      .removeAttr('aria-expanded')
      .removeAttr('id');
    this.content.removeAttr('id').removeClass('no-transition');
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * Update the component and optionally apply new settings.
   * @param  {object} settings the settings to update to.
   * @returns {object} The plugin api for chaining.
   */
  updated(settings) {
    this.settings = utils.mergeSettings(this.element, settings, this.settings);
    return this;
  },

  /**
  * Attach event handlers.
  * @private
  * @returns {object} The Api for chaining.
  */
  handleEvents() {
    const self = this;
    this.expander.on('click.expandablearea', (e) => {
      if (!self.isDisabled()) {
        e.preventDefault();
        self.toggleExpanded();
      }
    });

    this.header.on('keydown.expandablearea', (e) => {
      self.handleKeys(e);
    }).on('focus.expandablearea', (e) => {
      self.handleFocus(e);
    }).on('blur.expandablearea', (e) => {
      self.handleBlur(e);
    });

    return this;
  }

};

export { ExpandableArea, COMPONENT_NAME };
