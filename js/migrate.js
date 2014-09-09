/**
* Collection of Functions which can be used to not have to migrate some code.
*/

//Map Some Functions with infor prefix.
$.fn.isEnabled = $.fn.is('enabled');
$.fn.inforMessageDialog = $.fn.message;
$.fn.inforDialog = $.fn.modal;
$.fn.inforToolTip = $.fn.tooltip;
$.fn.inforContextMenu = $.fn.popupmenu;
$.fn.inforMenuButton = $.fn.popupmenu;
$.fn.inforDropDownList = $.fn.dropdown;

//Map Validation Routines.
$.fn.validationMessage = function(showHide, message) {
  var field = $(this);
  if (showHide === 'show') {
    field.removeError();
    field.addError({message: message});
  } else {
    field.removeError();
  }
};

$.fn.setupValidation = function(callback) {
  $(this).validate().on('validated', function(e, isValid) {
    callback(isValid);
  });
};

$.Validation = {
  addRule: function (ruleId, rule, async) {
    if (rule.msg) {
      rule.message = rule.msg;
    }
    rule.async = async ? true : false;
    $.fn.validation.rules[ruleId] = rule;
  }
};
