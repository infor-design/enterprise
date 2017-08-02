window.Soho = window.Soho || {};

/**
 * Default Mask API Options
 */
const DEFAULT_MASK_API_OPTIONS = {
  locale: 'en-US',
  pattern: undefined,

};

/**
  * @class {SohoMaskAPI}
  * @constructor
  * @returns {SohoMaskAPI}
  */
function SohoMaskAPI(options) {
  this.configure(options);
  return this;
}


SohoMaskAPI.prototype = {

  /**
   * Configure the API for an incoming mask request - set up patterns, change locale, basically 'pre-render'
   */
  configure: function(options) {
    if (!options) {
      return this;
    }

    if (options.locale) {
      // TODO: store references to thousands sep, decimal, currency symbols, etc for the specified locale.
      this.locale = options.locale;
    }

    if (options.pattern) {
      // TODO: store reference to the specified pattern.
      this.pattern = options.pattern;
    }

    this._processor = this._defaultPatternMatchProcessor;
    if (typeof options.process === 'function') {
      // TODO: handle custom processing algorithms.
      this._processor = options.processor;
    }

    return this;
  },

  /**
   * Process a string against the masking algorithm
   */
  process: function(string, opts) {
    if (typeof string !== 'string') {
      throw new Error('No string provided');
    }

    var processResult = '';

    try {
      console.log('attempting to process "' + string + '" against mask pattern "'+ this.pattern +'"');
      processResult = this._processor(string, opts);
    } catch (e) {
      console.error('Couldn\'t complete masking process: "'+ e.message +'"');
    }

    return processResult;
  },

  /**
   * Default system for matching patterns
   * @private
   * @param {String} string - incoming full text string to process
   * @param {Object} options - options for parsing
   */
  _defaultPatternMatchProcessor: function(string, options) {
    options = options;
    var result = string,
      condition = false; // TEMP

    // TODO: Modify `result` to become an object with rich data if:
    // - string insertion happens BEFORE the end of the string (caret data exists)
    // - character is not valid and input needs to be prevented.
    // - mask could not be processed (error?)
    if (condition) {
      result = {
        str: string,
        result: false
      };
    }

    return result;
  }

};

window.Soho.Mask = new SohoMaskAPI(DEFAULT_MASK_API_OPTIONS);
