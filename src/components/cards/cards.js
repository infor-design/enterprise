import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { widgetUtils } from '../../utils/widget-utils';
import { Locale } from '../locale/locale';
import { stringUtils as str } from '../../utils/string';
import { Tmpl } from '../tmpl/tmpl';

// Settings and Options
const COMPONENT_NAME = 'cards';

/**
 * Card Component settings and functionalities.
 * @class Cards
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 * @param {boolean} [settings.bordered] Ability to add bordered or boreder-less styles to the card element.
 * @param {boolean} [settings.noHeader] Determine wheter the card header should be displayed or not.
 * @param {boolean} [settings.expandableHeader] Abilty to expand the card header.
 * @param {number} [settings.contentPaddingX] The padding left and right of the content of the card element. It will generate the css utlity classes for paddings.
 * @param {number} [settings.contentPaddingY] The padding top and bottom of the content of the card element. It will generate the css utlity classes for paddings.
 * @param {boolean} [settings.noShadow] Ability to remove the shadow of the card element.
 * @param {boolean} [settings.verticalButtonAction] Ability to rotate the button action vertically
 * @param {array} [settings.dataset=[]] An array of data objects that will be represented as cards.
 * @param {string} [settings.template] Html Template String.
 * @param {string} [settings.selectable=false] Ability to enable the selection state e.g. 'single', 'multiple' or false.
 * @param {string} [settings.attributes=null] Add extra attributes like id's to the element. e.g. `attributes: { name: 'id', value: 'my-unique-id' }`
 */

const CARDS_DEFAULTS = {
  bordered: null,
  noHeader: false,
  contentPaddingX: null,
  contentPaddingY: null,
  noShadow: false,
  dataset: [],
  template: null,
  selectable: false,
  expandableHeader: false,
  verticalButtonAction: false,
  attributes: null
};

function Cards(element, settings) {
  this.settings = utils.mergeSettings(element, settings, CARDS_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

// Plugin Methods
Cards.prototype = {

  /**
   * Initialize the Card Component
   * @private
   */
  init() {
    this.selectedRows = [];
    this
      .setup()
      .build()
      .handleEvents();
  },

  setup() {
    this.id = this.element.attr('id');

    if (!this.id || this.id === undefined) {
      this.id = `expandable-card-${$('body').find('.card').index(this.element)}`;
      this.element.attr('id', this.id);
    }

    if (this.settings.expandableHeader) {
      this.element.addClass('expandable-card');
      this.expandableCardHeader = this.element.children('.card-header').addClass('expandable-card-header');
    }

    this.cardHeader = this.element.children('.card-header');
    this.cardContentPane = this.element.children('.card-pane');
    this.buttonAction = this.cardHeader.children('.btn-actions');

    if (this.settings.selectable !== false) {
      this.cards = this.element;
    }

    return this;
  },

  /**
   * Add any needed markup to the component.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  build() {
    const element = this.element;
    const expanded = this.element.hasClass('is-expanded');
    const selectText = (Locale ? Locale.translate('Select') : 'Select');
    const isSingle = this.settings.selectable === 'single';
    const isBordered = this.settings.bordered === true;
    const isBorderLess = this.settings.bordered === false;
    const hasCustomAction = this.element.find('.card-header .widget-header-section.custom-action').length > 0;
    // Apply content padding if provided
    const { contentPaddingX, contentPaddingY } = this.settings;

    this.renderTemplate();

    // This is basically the build for the selection state cards (single and multiple)
    if (this.settings.selectable !== false) {
      this.cards.find('.card').addClass('is-selectable');
      this.cards.addClass(isSingle ? 'single' : 'multiple');

      this.element.attr('role', 'list');
      this.element.find('.card').attr({
        role: 'listitem',
        tabindex: '0'
      });
    }

    if (this.settings.selectable === 'multiple') {
      const items = this.cards.find('.card');

      items.each(function (i) {
        const item = $(this).find('.card-content');

        item.prepend(`
          <input type="checkbox" id="checkbox-${i}" aria-hidden="true" tabindex="0" role="presentation"
            class="checkbox">
            <label for="checkbox-${i}" class="checkbox-label">
              <span class="audible">${selectText}</span>
            </label>
        `);
      });
    }

    this.cardContentPane.attr({
      id: `${this.id}-content`,
      role: 'region',
      'aria-labelledby': `${this.id}-header`
    });

    if (this.settings.expandableHeader && this.expandableCardHeader) {
      this.expandableCardHeader.attr('role', 'button');
    }

    if (this.buttonAction.length > 0 && this.settings.verticalButtonAction) {
      this.buttonAction.addClass('vertical');
    }

    if (expanded) {
      this.cardContentPane.addClass('no-transition');
      this.element.one('afterexpand.expandable-card', () => {
        this.cardContentPane.removeClass('no-transition');
      });
      this.open();
    }

    if (!expanded) {
      this.cardContentPane.addClass('no-transition');
      this.element.one('aftercollapse.expandable-card', () => {
        this.cardContentPane.removeClass('no-transition');
      });
      this.close();
    }

    // Additional attributes to the elements.
    if (!this.settings.expandableHeader) {
      utils.addAttributes(this.cardHeader, this, this.settings.attributes, 'header', true);
    }

    utils.addAttributes(this.element, this, this.settings.attributes, 'card', true);
    utils.addAttributes(this.element.find('.card .card-content'), this, this.settings.attributes, 'card-content', true);

    if (!this.settings.selectable) {
      utils.addAttributes(this.expandableCardHeader, this, this.settings.attributes, 'expander', true);
      utils.addAttributes(this.buttonAction, this, this.settings.attributes, 'action', true);
      utils.addAttributes(this.cardContentPane, this, this.settings.attributes, 'content', true);
    }

    // Apply the 'bordered' class if necessary
    if (isBordered) {
      element.addClass('bordered');
    }

    // Apply the 'bordered-less' class if necessary
    if (isBorderLess) {
      element.addClass('border-less');
    }

    // Remove the card header if necessary
    if (this.settings.noHeader) {
      // Apply the 'no-header' class to the element
      element.addClass('no-header');

      // Remove the card header element from the DOM
      this.cardHeader?.remove();
    }

    // Remove the card shadow if necessary
    if (this.settings.noShadow) {
      element.addClass('no-shadow');
    }

    // Only apply padding if at least one of the values is not null
    if (contentPaddingX !== null || contentPaddingY !== null) {
      // Find the card content element
      const content = element.find('.card-content');

      // Apply the X-axis padding if provided
      if (contentPaddingX !== null) {
        content.addClass(`padding-x-${contentPaddingX}`);
      }

      // Apply the Y-axis padding if provided
      if (contentPaddingY !== null) {
        content.addClass(`padding-y-${contentPaddingY}`);
      }
    }

    // If there's custom action, show the buttons
    if (hasCustomAction) {
      element.addClass('show-buttons');
    }

    if (this.settings.selectable === 'multiple') {
      const self = this;
      setTimeout(() => {
        const options = this.cards.find('.card');
        options.each(function (i) {
          const opt = $(this);
          utils.addAttributes(opt.find('.checkbox-label'), self, self.settings.attributes, `checkbox-label-${i}`, true);
          utils.addAttributes(opt.find('.card-content .checkbox'), self, self.settings.attributes, `checkbox-${i}`, true);
        });
      }, 1);
    }

    // Removing the info icon tooltip in RTL
    if (Locale.isRTL()) {
      this.removeInfoIconTooltip();
    }

    widgetUtils.moveLastCustomAction(this.element, this.cardHeader);

    return this;
  },

  /**
   * Remove the icon tooltip on smaller size of card.
   * @private
   * @returns {void}
   */
  removeInfoIconTooltip() {
    // This is needed due to the fact that an element can be a .cards class as a wrapper
    // It should only target a single card
    if (!this.element.hasClass('card')) {
      return;
    }

    const isMobileViewport = this.element.width() <= 360;
    const infoIcon = this.cardHeader.find('> .icon');

    infoIcon.css('display', `${isMobileViewport ? 'none' : ''}`);
  },

  /**
   * Select the card.
   * @param {jQuery} activeCard the actual jQuery card element.
   */
  select(activeCard) {
    const allCards = this.element.find('.card');
    const activeCheckbox = activeCard.find('.checkbox');
    const isSelected = activeCard.hasClass('is-selected');
    let action = '';

    if (this.settings.selectable === 'single') {
      this.selectedRows = [];
      allCards.removeClass('is-selected').removeAttr('aria-selected');
    }

    if (this.settings.selectable === 'multiple' && isSelected) {
      activeCard.removeClass('is-selected').removeAttr('aria-selected');
      activeCheckbox.prop('checked', false);

      this.element.triggerHandler('deselected', [{ selectedRows: this.selectedRows, action: 'deselect' }]);

      return;
    }

    if (this.settings.selectable !== false) {
      activeCard.addClass('is-selected').attr('aria-selected', 'true');

      if (this.settings.selectable === 'multiple') {
        activeCheckbox.prop('checked', true);
      }

      this.selectedRows.push({ data: this.settings.dataset, elem: activeCard });
      action = isSelected ? 'deselected' : 'selected';
    }

    /**
     * Fires when a card is selected
     *
     * @event selected
     * @memberof Card
     * @property {object} event - The jQuery event object
     * @property {object} ui - The dialog object
     */
    /**
     * Fires when a card is unselected
     *
     * @event deselected
     * @memberof Card
     * @property {object} event - The jQuery event object
     * @property {object} ui - The dialog object
     */
    this.element.triggerHandler(isSelected ? 'deselected' : 'selected', [{ selectedRows: this.selectedRows, action }]);
  },

  /**
   * Render the template using mustache
   */
  renderTemplate() {
    if (!this.settings.template) {
      return;
    }

    const s = this.settings;

    if (typeof Tmpl === 'object' && s.dataset && this.settings.template) {
      if (this.settings.template instanceof $) {
        this.settings.template = `${this.settings.template.html()}`;
      } else if (typeof this.settings.template === 'string') {
        if (!str.containsHTML(this.settings.template)) {
          this.settings.template = $(`#${this.settings.template}`).html();
        }
      }
    }

    const renderedTmpl = Tmpl.compile(this.settings.template, {
      dataset: s.dataset,
    });

    if (s.dataset.length > 0) {
      this.cards.html(renderedTmpl);
    } else if (s.dataset.length === 0) {
      this.cards.html(renderedTmpl || '<div class="cards auto-height"></div>');
    }
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
   * Returns expanded status about the current expandable pane.
   * @returns {boolean} True or false depending on current expanded status.
   */
  isExpanded() {
    return this.element.is('.is-expanded');
  },

  /**
   * Toggle the card pane.
   */
  toggleExpanded() {
    if (this.isExpanded()) {
      this.close();
    } else {
      this.open();
    }
  },

  isDisabled() {
    return this.element.hasClass('is-disabled');
  },

  /**
   * Opens up the card pane.
   */
  open() {
    /**
     * @event beforeexpand
     */
    const canExpand = this.element.triggerHandler('beforeexpand', [this.element]);

    if (canExpand === false) return;

    this.element.addClass('is-expanded');
    this.expandableCardHeader.attr('aria-expanded', 'true');

    /**
     * @event expand
     * @memberof Cards
     * @property {object} The jQuery event object
     */
    this.element.triggerHandler('expand', [this.element]);

    if (this.cardContentPane[0]) this.cardContentPane[0].style.display = 'block';

    /**
     * @event afterexpand
     * @memberof Cards
     * @property {object} The jQuery event object
     */
    this.cardContentPane.one('animateopencomplete', () => {
      this.element.triggerHandler('afterexpand', [this.element]);
    }).animateOpen({ timing: 300 });
  },

  /**
   * Closes the card pane.
   */
  close() {
    /**
     * @event beforecollapse
     * @memberof Cards
     * @property {object} The jQuery event object
     */
    const canCollapse = this.element.triggerHandler('beforecollapse', [this.element]);

    if (canCollapse === false) return;

    /**
     * @event collapse
     * @memberof Cards
     * @property {object} The jQuery event object
     */
    this.element.triggerHandler('collapse', [this.element]);

    /**
     * @event aftercollapse
     * @memberof Cards
     * @property {object} The jQuery event object
     */
    this.cardContentPane.one('animateclosedcomplete', () => {
      this.element.removeClass('is-expanded');
      this.expandableCardHeader.attr('aria-expanded', 'false');
      this.element.triggerHandler('aftercollapse', [this.element]);
      this.cardContentPane[0].style.display = 'none';
    }).animateClosed({ timing: 300 });
  },

  /**
   * Attach event handlers
   * @private
   * @returns {object} Api for chaining.
   */
  handleEvents() {
    const self = this;
    this.expandableCardHeader?.on('click.cards', (e) => {
      if (!self.isDisabled()) {
        e.preventDefault();
        self.toggleExpanded();
      }
    });

    if (this.settings.selectable !== false) {
      this.element.on(`click.${COMPONENT_NAME}`, '.card', (e) => {
        const activeCard = $(e.currentTarget);
        const target = $(e.target);
        const isCheckbox = target.is('.checkbox');

        setTimeout(() => {
          self.select(activeCard, isCheckbox);
        }, 0);

        e.stopPropagation();
        e.preventDefault();
      });
    }

    $('body').on('resize.card', () => {
      if (Locale.isRTL()) {
        this.removeInfoIconTooltip();
      }
      widgetUtils.moveLastCustomAction(this.element, this.cardHeader);
    });

    this.element.find('.card-content').children().on('scroll.card', (e) => {
      const target = e.target;
      if (target.scrollTop > 0) $(target).addClass('is-scrolling');
      else $(target).removeClass('is-scrolling');
    });

    return this;
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  teardown() {
    this.element.off(`click.${COMPONENT_NAME}`);
    this.expandableCardHeader?.off('click.cards');
    this.expandableCardHeader = null;
    $('body').off('resize.card');
    this.selectedRows = [];
    this.cardContentPane.off();
    this.element.find('.card-content').children().off('scroll.card');
    this.cardContentPane = null;
    return this;
  },

  /**
   * Destroy - Remove added markup and events.
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Cards, COMPONENT_NAME };
