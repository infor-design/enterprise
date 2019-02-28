import { utils } from '../../utils/utils';

// Component Name
const COMPONENT_NAME = 'formcompact';

// Settings
const FORMCOMPACT_DEFAULTS = {};

/**
 * @class FormCompact
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings=null] Incoming settings
 */
function FormCompact(element, settings) {
  if (!(element instanceof HTMLElement)) {
    throw new Error('Element used for `FormCompact` component must be an instance of HTMLElement');
  }

  this.settings = utils.mergeSettings(element, settings, FORMCOMPACT_DEFAULTS);
  this.element = element;

  this.init();
}

FormCompact.prototype = {

  /**
   * @private
   * Builds the component up from scratch
   * @returns {void}
   */
  init() {
    this.form = this.element.querySelector('form');
    this.inputs = this.element.querySelectorAll('input');

    this.handleEvents();
  },

  /**
   * @private
   * Sets up event listeners on the component
   * @returns {void}
   */
  handleEvents() {
    $(this.form)
      .on(`focusin.${COMPONENT_NAME}`, 'input', (e) => {
        $(e.target).parents('.column, .columns').first().addClass('is-focused');
      })
      .on(`focusout.${COMPONENT_NAME}`, 'input', (e) => {
        $(e.target).parents('.column, .columns').first().removeClass('is-focused');
      })
      .on(`mouseenter.${COMPONENT_NAME}`, 'input', (e) => {
        $(e.target).parents('.column, .columns').first().removeClass('is-hovered');
      })
      .on(`mouseleave.${COMPONENT_NAME}`, 'input', (e) => {
        $(e.target).parents('.column, .columns').first().removeClass('is-hovered');
      });
  },

  /**
   * Updates the component with new settings
   * @param {object} [settings=null] if defined, new incoming settings
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    this.teardown();
    this.init();
  },

  /**
   * Removes all bound events and extraneous HTML markup
   * @returns {void}
   */
  teardown() {
    $(this.form).off([
      `focusin.${COMPONENT_NAME}`,
      `focusout.${COMPONENT_NAME}`,
      `mouseenter.${COMPONENT_NAME}`,
      `mouseleave.${COMPONENT_NAME}`
    ].join(' '));
  },

  /**
   * Destroys the component and removes its contents from the DOM
   */
  destroy() {
    this.teardown();
    $.removeData(this.element, COMPONENT_NAME);
  },

};

export { FormCompact, COMPONENT_NAME };
