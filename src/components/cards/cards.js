import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
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
 * @param {boolean} [settings.expandableHeader] Abilty to expand the card header
 * @param {boolean} [settings.verticalButtonAction] Ability to rotate the button action vertically
 * @param {array} [settings.dataset=[]] An array of data objects that will be represented as cards.
 * @param {string} [settings.template] Hyml Template String.
 * @param {string} [settings.source] f source is a string then it serves as
  the url for an ajax call that returns the dataset. If its a function it is a call back for getting the data asyncronously.
 * @param {string} [settings.selectable=false] Ability to enable the selection state e.g. 'single', 'multiple' or false.
 * @param {string} [settings.attributes=null] Add extra attributes like id's to the element. e.g. `attributes: { name: 'id', value: 'my-unique-id' }`
 */

const CARDS_DEFAULTS = {
  dataset: [],
  template: null,
  source: null,
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
    const expanded = this.element.hasClass('is-expanded');
    const selectText = (Locale ? Locale.translate('Select') : 'Select');
    const isSingle = this.settings.selectable === 'single';
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

        console.log({
          i: i,
          item: item
        });
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
    utils.addAttributes(this.expandableCardHeader, this, this.settings.attributes, 'expander', true);
    utils.addAttributes(this.buttonAction, this, this.settings.attributes, 'action', true);
    utils.addAttributes(this.cardContentPane, this, this.settings.attributes, 'content', true);

    return this;
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
    if (this.settings.selectable === false) {
      return;
    }

    const s = this.settings;

    if (typeof Tmpl === 'object' && this.settings.template) {
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
    
    this.teardown();
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

    return this;
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  teardown() {
    this.element.off(`click.${COMPONENT_NAME}`);

    this.selectedRows = [];
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
