/**
 * Soho Validation Utilities
 * ========================================
 */

/**
 * jQuery Utility function wrapper for checking whether or not a field passes validation.
 * @returns {boolean} whether or not the field is valid
 */
$.fn.isValid = function () {
  return (!!$(this).data('isValid'));
};

/**
 * Check validation manually.
 * @returns {void}
 */
$.fn.validateField = function () {
  const field = $(this);
  const api = field.data('validate');

  if (api && api.validate) {
    api.validate(field, false, 0);
  }
};

/**
 * Clear out the stuff on the Form
 */
$.fn.resetForm = function () {
  const formFields = $(this).find('input, select, textarea');

  // Clear Errors
  formFields.removeClass('error');
  $(this).find('.error').removeClass('error');
  $(this).find('.icon-error').remove();
  $(this).find('.icon-confirm').remove();
  $(this).find('.error-message').remove();

  // Clear Warnings
  formFields.removeClass('alert');
  $(this).find('.alert').removeClass('alert');
  $(this).find('.icon-alert').remove();
  $(this).find('.alert-message').remove();

  // Clear Informations
  formFields.removeClass('info');
  $(this).find('.info').removeClass('info');
  $(this).find('.icon-info').remove();
  $(this).find('.info-message').remove();

  setTimeout(() => {
    $('#validation-errors').addClass('is-hidden');
  }, 300);

  // Remove Dirty
  formFields.data('isDirty', false).removeClass('isDirty');
  $(this).find('.isDirty').removeClass('isDirty');

  // reset form data
  if ($(this).is('form')) {
    $(this)[0].reset();
  }
};
