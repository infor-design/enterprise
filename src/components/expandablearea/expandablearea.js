import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// Jquery Imports
import '../../utils/animations';

const COMPONENT_NAME = 'expandablearea';

/**
* An expandable pane / area.
* @class ExpandableArea
* @param {string} element The component element.
* @param {string} [settings] The component settings.
* @param {string} [settings.trigger = null]  Id of some other button to use as a trigger
* @param {string} [settings.bottomBorder = false] Change the border to bottom vs top (for some cases)
* @param {number} [settings.animationSpeed = 300] Change the animation speed in ms
* @param {string} [settings.attributes=null] Add extra attributes like id's to the element. e.g. `attributes: { name: 'id', value: 'my-unique-id' }`
*/
const EXPANDABLEAREA_DEFAULTS = {
  trigger: null,
  bottomBorder: false,
  animationSpeed: 300,
  attributes: null
};

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

    if (this.element.prev('.expandable-area-trigger').length > 0) {
      this.expander = this.element.prev('.expandable-area-trigger');
      this.settings.trigger = this.expander.attr('id') || `expandable-area-trigger-${$('body').find('.expandable-area').index(this.element)}`;
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
      id: `${this.id}-content`,
      role: 'region',
      'aria-labelledby': `${this.id}-content`
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
          expander = $(`${'<a href="#" target="_self" role="button" class="btn-expander">' +
            '<svg class="chevron icon" focusable="false" aria-hidden="true" role="presenation">' +
              '<use href="#icon-caret-down"></use>' +
            '</svg>' +
            '<span class="audible">'}${Locale.translate('ShowMore')}</span>` +
          '</a>').appendTo(instance.header);
        }

        return expander;
      }

      // Use the text-based expander button in the footer
      expander = instance.footer.find('.expandable-expander');
      if (!expander.length) {
        expander = $(`${'<a href="#" target="_self" role="button" class="expandable-expander hyperlink">' +
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

    this.resize();

    utils.addAttributes(this.element, this, this.settings.attributes, '', true);
    utils.addAttributes(this.header, this, this.settings.attributes, 'header', true);
    utils.addAttributes(this.content, this, this.settings.attributes, 'content', true);
    utils.addAttributes(this.expander, this, this.settings.attributes, 'expander', true);
    utils.addAttributes(this.footer, this, this.settings.attributes, 'footer', true);

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
    /**
     * Fires after a row is added via the api.
    * @event beforeexpand
    * @memberof ExpandableArea
    * @property {object} event The jquery event object
    * @property {HTMLElement} args.row The Html Element.
    */
    const canExpand = this.element.triggerHandler('beforeexpand', [this.element]);

    if (canExpand === false) {
      return;
    }

    this.element.addClass('is-expanded');
    this.header.attr('aria-expanded', 'true');
    this.expander.addClass('active');

    /**
     * Fires after a row is added via the api.
    * @event expand
    * @memberof ExpandableArea
    * @property {object} event The jquery event object
    * @property {HTMLElement} args.row The Html Element.
    */
    this.element.triggerHandler('expand', [this.element]);

    this.expander.find('span[data-translated="true"]').text(Locale.translate('ShowLess') ? Locale.translate('ShowLess') : 'Show Less');

    if (this.isCard) {
      this.expander.find('.icon').addClass('active');
    }

    if (this.content[0]) {
      this.content[0].style.display = 'block';
    }

    /**
     * Fires after a row is added via the api.
    * @event afterexpand
    * @memberof ExpandableArea
    * @property {object} event The jquery event object
    * @property {HTMLElement} args.row The Html Element.
    */
    this.content.one('animateopencomplete', () => {
      this.element.triggerHandler('afterexpand', [this.element]);
    }).animateOpen({ timing: this.settings.animationSpeed });

    this.applyIE11Fix();
  },

  /**
  * Close the pane if open.
  */
  close() {
    /**
    * Fires after a row is added via the api.
    * @event beforecollapse
    * @memberof ExpandableArea
    * @property {object} event The jquery event object
    * @property {HTMLElement} args.row The Html Element.
    */
    const canCollapse = this.element.triggerHandler('beforecollapse', [this.element]);

    if (canCollapse === false) {
      return;
    }

    this.expander.removeClass('active');
    /**
    * Fires after a row is added via the api.
    * @event collapse
    * @memberof ExpandableArea
    * @property {object} event The jquery event object
    * @property {HTMLElement} args.row The Html Element.
    */
    this.element.triggerHandler('collapse', [this.element]);
    this.expander.find('span[data-translated="true"]').text(Locale.translate('ShowMore') ? Locale.translate('ShowMore') : 'Show More');

    if (this.isCard) {
      this.expander.find('.icon').removeClass('active');
    }

    /**
    * Fires after a row is added via the api.
    * @event aftercollapse
    * @memberof ExpandableArea
    * @property {object} event The jquery event object
    * @property {HTMLElement} args.row The Html Element.
    */
    this.content.one('animateclosedcomplete', () => {
      this.element.removeClass('is-expanded');
      this.header.attr('aria-expanded', 'false');
      this.element.triggerHandler('aftercollapse', [this.element]);
      this.content[0].style.display = 'none';
    }).animateClosed({ timing: this.settings.animationSpeed });

    this.applyIE11Fix();
  },

  /**
  * Determines if the browser is IE11 and applies a min-height fix for the overflow.
  * @private
  * @returns {void}
  */
  applyIE11Fix() {
    const self = this;
    const isIE11 = $('html').hasClass('ie11');
    setTimeout(() => {
      if (isIE11 && self.element.hasClass('is-expanded')) {
        self.element.css('min-height', self.element.children('.expandable-pane').outerHeight(true) + self.element.children('.expandable-footer').outerHeight(true));
      } else if (isIE11 && !self.element.hasClass('is-expanded')) {
        self.element.css('min-height', 'auto');
      }
    }, 300); // equal to transition time
  },

  /**
  * Determines if the the body has resized and fires the applyIE11Fix.
  * @private
  * @returns {void}
  */
  resize() {
    const self = this;
    $('body').on('resize.expandablearea', () => {
      self.applyIE11Fix();
    });
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

    return this;
  }

};

export { ExpandableArea, COMPONENT_NAME };
