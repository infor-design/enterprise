/**
 * Soho Validation Utilities
 * ========================================
 */

/**
 * jQuery Utility function wrapper for checking whether or not a field passes validation.
 * @returns {boolean} whether or not the field is valid
 */
$.fn.isValid = function () {
  const isValidAttr = $(this).data('isValid');
  return isValidAttr === undefined || isValidAttr === null ? true : isValidAttr;
};

/**
 * Check validation manually.
 * @returns {void}
 */
$.fn.validateField = function () {
  const field = $(this);
  const api = Soho.components.Validator.prototype;  //eslint-disable-line

  if (api && api.validate) {
    api.validate(field, false, 0);
  }
};

/**
 * Clear out the stuff on the Form
 */
$.fn.resetForm = function () {
  const api = Soho.components.Validator.prototype;  //eslint-disable-line
  api.resetForm(this);
};
