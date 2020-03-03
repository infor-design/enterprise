import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';

// jQuery Components
import './button.jquery';

// The name of this component.
const COMPONENT_NAME = 'buttonset';

// Styles of Buttonset
const BUTTONSET_STYLES = ['default', 'modal'];

// Default Buttonset Styles
const BUTTONSET_DEFAULTS = {
  buttons: [],
  detectHTMLButtons: false,
  style: BUTTONSET_STYLES[0]
};

function ButtonSet(element, settings) {
  if (!(element instanceof HTMLElement)) {
    throw new Error('ButtonSet component needs an HTMLElement as a base element.');
  }

  this.element = element;
  this.settings = utils.mergeSettings(element, settings, BUTTONSET_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

ButtonSet.prototype = {

  /**
   * @private
   * @returns {void}
   */
  init() {
    this.build();
    this.render();
  },

  /**
   * @param {boolean} [doAdd=false] if true, does not reset the buttonset and simply adds the incoming buttons.
   * @returns {void}
   */
  build(doAdd) {
    if (!this.buttons || !doAdd) {
      this.reset();
    }

    // If no/empty array is provided, try to detect pre-defined HTML buttons before rendering.
    if (!Array.isArray(this.settings.buttons) || !this.settings.buttons.length) {
      this.detectHTMLButtons();
      return;
    }

    this.settings.buttons.forEach((buttonJSON) => {
      this.add(buttonJSON);
    });
  },

  /**
   * Draws the entire buttonset.
   * @returns {void}
   */
  render() {
    const elemClasses = this.element.classList;
    const cssClassMap = {
      default: 'buttonset',
      modal: 'modal-buttonset'
    };

    // Remove all classes except for the correct one.
    Object.keys(cssClassMap).forEach((style) => {
      const cssClass = cssClassMap[style];
      if (this.settings.style !== style) {
        elemClasses.remove(cssClass);
      }
    });
    elemClasses.add(cssClassMap[this.settings.style]);

    // Render all established buttons
    this.buttons.forEach((buttonAPI) => {
      buttonAPI.render();
    });
  },

  /**
   * Adds button(s) to the Buttonset.
   * @param {object} settings containing
   * @param {boolean} [doAddDOM=false] if true, appends the new element to the Buttonset container after creation/update.
   */
  add(settings, doAddDOM = false) {
    if (!settings || typeof settings !== 'object') {
      throw new Error('Settings object is required to add a new button to the ButtonSet');
    }

    let buttonElem = settings.element;
    const didExist = buttonElem instanceof HTMLElement;
    if (!didExist) {
      buttonElem = document.createElement('button');
    }

    const buttonId = xssUtils.stripHTML(settings.id);
    if (typeof buttonId === 'string' && buttonId.length > 0) {
      buttonElem.id = buttonId;
    }

    // Add the new button to the page
    const $buttonElem = $(buttonElem);
    if (doAddDOM || !didExist) {
      $(this.element).append($buttonElem);
    }

    // Invoke
    $buttonElem.button(settings);
    const buttonAPI = $buttonElem.data('button');

    // Add the new API to the button store
    this.buttons.push(buttonAPI);
  },

  /**
   * @param {Button|HTMLElement|string} buttonAPI a Button Component instance, a Button HTML Element with an IDS component instance attached, or a string representing its ID
   * @param {boolean} [doRemoveDOM=false] if true, removes the button's HTML from the page.
   * @returns {void}
   */
  remove(buttonAPI = undefined, doRemoveDOM = false) {
    if (!buttonAPI) {
      throw new Error('No Button API, HTMLElement, or ID string provided');
    }

    let elem;
    let $elem;

    // Detect the type we're working with
    if (!(buttonAPI !== undefined && typeof buttonAPI.destroy === 'function')) {
      if (buttonAPI instanceof HTMLElement) {
        // Assume it's an Element
        elem = buttonAPI;
      } else if (typeof buttonAPI === 'string') {
        // Assume it's an ID String
        elem = $(this.element).find(`#${buttonAPI.replace('#', '')}`);
      }

      $elem = $(elem);
      buttonAPI = $(elem).data('button');
      if (!(buttonAPI !== undefined && typeof buttonAPI.destroy === 'function')) {
        throw new Error('The provided Button API did not match a button existing in this ButtonSet.');
      }
    } else {
      $elem = buttonAPI.element;
    }

    buttonAPI.destroy();

    if (doRemoveDOM) {
      $elem.remove();
    }
  },

  /**
   * Removes ALL buttons from the buttonset
   * @param {boolean} [doRemoveDOM=false] if true, removes the button's HTML from the page.
   * @returns {void}
   */
  removeAll(doRemoveDOM = false) {
    this.buttons.forEach((buttonAPI) => {
      this.remove(buttonAPI, doRemoveDOM);
    });
  },

  /**
   * Resets the button array
   * @returns {void}
   */
  reset() {
    this.buttons = [];
  },

  /**
   * Populates the `settings.buttons` array with the current set of rendered buttons
   * @returns {void}
   */
  detectHTMLButtons() {
    if (!this.settings.detectHTMLButtons) {
      return;
    }

    this.reset();

    // HTML Buttons
    const htmlButtons = utils.getArrayFromList(this.element.querySelectorAll('button')) || [];
    htmlButtons.forEach((button) => {
      let api = $(button).data('button');
      if (!api) {
        $(button).button();
        api = $(button).data('button');
      }

      const data = api.getSettingsFromElement(true);
      data.element = button;
      this.add(data);
    });
  },

  /**
   * Gets a data representation of the currently available buttons.
   * @returns {object} containing a list of object-representations of the available buttons.
   */
  toData() {
    const data = utils.extend({}, this.settings);
    this.buttons.forEach((buttonAPI) => {
      data.buttons.push(buttonAPI.toData());
    });
    return data;
  },

  /**
   * Removes bound events and generated markup from this component
   * @private
   * @param {boolean} [doRemoveDOM=false] if true, removes the button HTML
   * @returns {ButtonSet} This component's API.
   */
  teardown(doRemoveDOM) {
    this.buttons.forEach((buttonAPI) => {
      this.remove(buttonAPI, doRemoveDOM);
    });
    return this;
  },

  /**
   * Update the component with new settings.
   * @param {object} settings The settings you would like to modify.
   * @returns {ButtonSet} This component's API.
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    this.teardown();
    this.init();
    return this;
  },

  /**
  * Teardown and remove any added markup and events.
  * @returns {void}
  */
  destroy() {
    this.teardown();
    $.removeData(this.element, COMPONENT_NAME);
  },
};

export { ButtonSet, COMPONENT_NAME };
