import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';

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
 * @param {string} [settings.selectable=false] Ability to enable the selection state e.g. 'single', 'multiple' or false.
 * @param {string} [settings.attributes=null] Add extra attributes like id's to the element. e.g. `attributes: { name: 'id', value: 'my-unique-id' }`
 */

const CARDS_DEFAULTS = {
  dataset: [],
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
    this
      .setup()
      .build()
      .handleEvents();
      console.log(this);
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
    const s = this.settings;
    const cardsDataset = s.dataset;
    const expanded = this.element.hasClass('is-expanded');
    let cardElements = '';

    if (this.settings.selectable !== false) {
      cardElements += `
        <div class="card auto-height">
          <p>Test</p>
          <p>Test</p>
          <p>Test</p>
        </div>
      `;

      this.cards.append(cardElements);
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
    return this;
  }

};

export { Cards, COMPONENT_NAME };
