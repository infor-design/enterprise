const UTIL_NAME = 'keyboard';

function Keyboard() {
  this.pressedKeys = new Map();
  this.init();
}

Keyboard.prototype = {
  /**
   * Initializes the keyboard management system
   * @private
   */
  init() {
    $(document)
      .on(`keydown.${UTIL_NAME}`, (e) => {
        this.press(e.key);
        this.announceKeys();
      })
      .on(`keyup.${UTIL_NAME}`, (e) => {
        this.unpress(e.key);
        this.announceKeys();
      });
  },

  /**
   * Triggers a 'keys' event on the body tag that passes the current list of keys pressed.
   * @private
   */
  announceKeys() {
    const keys = [];
    this.pressedKeys.forEach((val, key) => {
      keys.push(key);
    });

    $('body').triggerHandler('keys', [keys]);
  },

  /**
   * Add a key to the pressedKeys Map.
   * @private
   * @param {string} key a string representing a {KeyboardEvent.key} that was pressed.
   * @returns {Map} the current set of pressed keys
   */
  press(key) {
    return this.pressedKeys.set(`${key}`, true);
  },

  /**
   * Remove a key from the pressedKeys map.
   * @private
   * @param {string} key a string representing a {KeyboardEvent.key} that is no longer being pressed.
   * @returns {boolean} whether or not the key had been previously logged as "pressed".
   */
  unpress(key) {
    return this.pressedKeys.delete(`${key}`);
  },

  /**
   * Describes whether or not a key is currently being pressed.
   * @param {string} key a string representing the {KeyboardEvent.key} that needs to be checked.
   * @returns {boolean} whether or not the key is currently logged as "pressed".
   */
  isPressed(key) {
    return this.pressedKeys.has(`${key}`);
  }
};

const keyboard = new Keyboard();

export { keyboard };
