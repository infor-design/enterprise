// ====================================================
// Soho Form/Element Utilities
// ====================================================

// Note marked these private so the doc generator doesnt work on them.
// These should be refactored into an ES6 FormUtils component.

/*
 * Make elements in the jQuery selector disabled if they support the prop disabled.
 * Or has a disable method.
 * @private
 * @returns {jQuery[]} processed, jQuery-wrapped elements
 */
$.fn.disable = function () {
  $.each(this.data(), (index, value) => {
    if (value instanceof jQuery) {
      return;
    }

    if (value && value.disable) {
      value.disable();
    }
  });
  this.prop('disabled', true);
  this
    .attr('disabled', true)
    .closest('.field')
    .addClass('is-disabled');
  return this;
};

/*
 * Make elements in the jQuery selector enabled if they support the prop disabled.
 * Or has a enable method.
 * @private
 * @returns {jQuery[]} processed, jQuery-wrapped elements
 */
$.fn.enable = function () {
  $.each(this.data(), (index, value) => {
    if (value instanceof jQuery) {
      return;
    }

    if (value && value.enable) {
      value.enable();
    }
  });
  this.prop({ disabled: false, readonly: false });
  this.removeAttr('disabled readonly')
    .closest('.field')
    .removeClass('is-disabled');
  return this;
};

/*
 * Make elements in the jQuery selector readonly if they support the prop readonly.
 * Or has a readonly method.
 * @private
 * @returns {jQuery[]} processed, jQuery-wrapped elements
 */
$.fn.readonly = function () {
  $.each(this.data(), (index, value) => {
    if (value instanceof jQuery) {
      return;
    }

    if (value && value.readonly) {
      value.readonly();
    }
  });
  this.prop('readonly', true);
  return this;
};

/*
 * Make password fields have a reveal text to obsucure or not obsucure the text value.
 */
$.fn.revealText = function (settings) {
  if (!this) {
    return this;
  }
  const input = this;
  // Set the initial state
  input.addClass(settings?.initialState === 'show' ? 'input-show-text' : 'input-hide-text');

  // Add a text span and click events
  const textSpan = $(`<span class="input-hideshow-text">${Soho.Locale.translate(settings?.initialState === 'show' ? 'Hide' : 'Show')}</span>`); // eslint-disable-line
  input.after(textSpan);

  // Handle Events
  const toggleText = () => {
    const textHidden = input.hasClass('input-hide-text');
    if (textHidden) {
      input.removeClass('input-hide-text').addClass('input-show-text');
      input.attr('type', 'text');
      textSpan.text(Soho.Locale.translate('Hide')); // eslint-disable-line
      return;
    }

    input.removeClass('input-show-text').addClass('input-hide-text');
    input.attr('type', 'text');
    textSpan.text(Soho.Locale.translate('Show')); // eslint-disable-line
  };

  textSpan.on('click', () => {
    toggleText();
  });

  input.on('keypress', (e) => {
    // Toggle on Ctrl + R
    if (e.keyCode === 18 && e.ctrlKey) {
      toggleText();
    }
  });

  return this;
};

// Fix: Labels without the "for" attribute
$(() => {
  let str;
  let control;
  const labelText = $('.label-text');
  const labels = labelText.closest('label, .label');

  labels.each(function () {
    control = $('input, textarea, select', this);
    str = control.attr('class');

    // Add "inline" and "inline-{control}" class to label
    // assuming control class is first thing in class string
    $(this).addClass(() => `inline${str ? ` inline-${str.indexOf(' ') === -1 ? str : str.substr(0, str.indexOf(' '))}` : ''}`);
  });
});

// Fix: Radio buttons was not selecting when click and than use arrow keys on Firefox
$(() => {
  $('input:radio').on('click.radios', function () {
    this.focus();
  });
});

// Add css classes to parent for apply special rules
$(() => {
  const addCssClassToParent = function (elemArray, cssClass) {
    for (let i = 0, l = elemArray.length; i < l; i++) {
      $(elemArray[i]).parent().addClass(cssClass);
    }
  };
  addCssClassToParent($('.field > input:checkbox, .field > .inline-checkbox'), 'field-checkbox');
  addCssClassToParent($('.field > input:radio, .field > .inline-radio'), 'field-radio');
});

$(() => {
  // Add `*` to required labels
  const selector = 'label.required .label-text, .label.required .label-text, label:not(.inline).required, .label:not(.inline).required';
  const labels = [].slice.call(document.body.querySelectorAll(selector));
  labels.forEach((label) => {
    if (label.className.indexOf('accessible') === -1) {
      return;
    }

    const asterisk = label.querySelector('.required-asterisk');
    if (!asterisk) {
      label.insertAdjacentHTML('beforeend', '<span class="required-asterisk" aria-hidden="true">*</span>');
    }
  });

  // Add `aria-required` to required elements
  let elements = [].slice.call(document.body.querySelectorAll('[data-validate]'));
  elements.forEach((el) => {
    const rules = el.getAttribute('data-validate');
    if (rules && rules.indexOf('required') > -1) {
      el.setAttribute('aria-required', true);
    }
  });

  // Add `aria-hidden` to hidden elements label
  elements = [].slice.call(document.body.querySelectorAll('input[type="hidden"]'));
  elements.forEach((el) => {
    const id = el.getAttribute('id');
    if (id) {
      const label = document.body.querySelector(`label[for="${id}"]`);
      if (label) {
        label.setAttribute('aria-hidden', true);
      }
    }
  });
});

// Adds css class 'is-disabled' to field if input has disabled attribute
// Gray color should apply to label if input is disabled
$(() => {
  const elements = $('input[type="text"]');

  if (elements.length) {
    elements.each(function () {
      if ($(this).is(':disabled')) {
        $(this)
          .closest('.field')
          .addClass('is-disabled');
      }
    });
  }
});
