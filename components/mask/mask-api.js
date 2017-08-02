window.Soho = window.Soho || {};

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
   *
   */
  configure: function(options) {

  },

  /**
   *
   */
  process: function(options) {

  }

};

window.Soho.Mask = new SohoMaskAPI({
  locale: Locale.currentLocale
});
