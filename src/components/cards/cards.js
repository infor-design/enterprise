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
 * @param {string} [settings.attributes=null] Add extra attributes like id's to the element. e.g. `attributes: { name: 'id', value: 'my-unique-id' }`
 */

const CARDS_DEFAULTS = {
  expandableHeader: false,
  verticalButtonAction: false,
  attributes: null
}

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
    return this
      .setup()
      .build();
  },

  setup() {
    if (!this.element) return;

    this.cardHeader = this.element.children('.card-header');
    this.cardContentPane = this.element.children('.card-pane');
    this.buttonAction = this.cardHeader.children('.btn-actions');
    return this;
  },

  /**
   * Add any needed markup to the component.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  build() {
    console.log(this);

    if (this.settings.expandableHeader) this.element.addClass('expandable-card');

    if (this.buttonAction.length > 0 && this.settings.verticalButtonAction) {
      this.buttonAction.addClass('vertical');
    } 

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
   * Example Method.
   * @returns {void}
   */
  someMethod() {
    // do something with this.settings not settings.
  },

};

export { Cards, COMPONENT_NAME };
