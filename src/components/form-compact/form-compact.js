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
    this.inputs = utils.getArrayFromList(this.element.querySelectorAll('input'));

    this.renderProps();
    this.handleEvents();
  },

  /**
   * Render CSS classes on column containers for some states
   * @returns {void}
   */
  renderProps() {
    if (!this.inputs || !this.inputs.length) {
      return;
    }

    const props = ['disabled', 'readonly'];
    this.inputs.forEach((input) => {
      props.forEach((prop) => {
        this.setState(prop, input);
      });
    });
  },

  /**
   * @private
   * Sets up event listeners on the component
   * @returns {void}
   */
  handleEvents() {
    const focusedCssClass = 'is-focused';
    $(this.form)
      .on(`focusin.${COMPONENT_NAME}`, 'input', (e) => {
        e.target.parentNode.classList.add(focusedCssClass);
      })
      .on(`focusout.${COMPONENT_NAME}`, 'input', (e) => {
        e.target.parentNode.classList.remove(focusedCssClass);
      });

    // Listen to attribute changes (disabled/readonly) on cells
    const attributeNames = ['disabled', 'readonly'];
    this.inputsObserver = new MutationObserver((mutationsList) => {
      if (!mutationsList.length) {
        return;
      }

      mutationsList.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          if (attributeNames.indexOf(mutation.attributeName) > -1) {
            this.setState(mutation.attributeName, mutation.target);
          }
        }
      });
    });

    const config = {
      attributes: true
    };
    this.inputs.forEach((input) => {
      this.inputsObserver.observe(input, config);
    });
  },

  /**
   * @private
   * Sets a CSS Class on the parent column of a form input.
   * @param {string} name property being set
   * @param {HTMLElement} target the node to be evaluated
   */
  setState(name, target) {
    if (typeof name !== 'string' || !(target instanceof HTMLElement)) {
      return;
    }

    if (name === 'readonly') {
      name = 'readOnly';
    }
    const isActive = target[name] === true;
    const operation = isActive ? 'add' : 'remove';
    target.parentNode.classList[operation](`is-${name.toLowerCase()}`);
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
    this.inputsObserver.disconnect();
    delete this.inputsObserver;

    $(this.form).off([
      `focusin.${COMPONENT_NAME}`,
      `focusout.${COMPONENT_NAME}`
    ].join(' '));
    delete this.form;
    delete this.inputs;
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
