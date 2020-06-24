import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Environment as env } from '../../utils/environment';
import { warnAboutRemoval } from '../../utils/deprecated';

// Component Name
const COMPONENT_NAME = 'fieldoptions';

/**
* A control bind next to another component to add some extra functionality.
* @class FieldOptions
* @deprecated as of v4.20.0. This component is no longer supported by the IDS team.
* @constructor
*
* @param {jQuery[]|HTMLElement} element The component element.
* @param {object} [settings] The component settings.
*/
const FIELDOPTIONS_DEFAULTS = {
};

function FieldOptions(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, FIELDOPTIONS_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
  warnAboutRemoval('FieldOptions');
}

// FieldOptions Methods
FieldOptions.prototype = {

  init() {
    this.setElements();
    this.handleEvents();
  },

  /**
   * Set all elements used by the Control
   * @private
   * @returns {object} The api
   */
  setElements() {
    this.isFirefox = env.browser.name === 'firefox';
    this.isSafari = env.browser.isSafari();

    this.field = this.element.closest('.field, .radio-group');
    this.targetElem = this.element;

    const label = this.field.find('label');
    if (label) {
      this.label = label;
    }

    // In some cases, adjust the target element
    if (this.element[0].className.match(/(dropdown|multiselect)/)) {
      this.targetElem = this.element.data('dropdown').pseudoElem;
    }
    if (this.element[0].className.match(/(fileupload)/)) {
      this.targetElem = this.field.find('.fileupload[type="text"]');
    }

    this.field.addClass('is-fieldoptions');

    this.fieldParent = this.element.closest('.field').parent();
    this.trigger = this.field.find('.btn-actions');

    // Fix: Some reason firfox "event.relatedTarget" not working
    // with un-focusable elements(ie.. div) on focusout, use "contentEditable"
    // https://stackoverflow.com/a/43010274
    if (this.isFirefox && this.trigger.length) {
      this.trigger[0].contentEditable = true;
      this.trigger.on(`keydown.${COMPONENT_NAME}`, (e) => {
        const key = e.which || e.keyCode || e.charCode || 0;
        if (key !== 9) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    // Adjust some setting for popupmenu this trigger(action button)
    setTimeout(() => {
      this.popupmenuApi = this.trigger.data('popupmenu');
      if (this.popupmenuApi) {
        this.popupmenuApi.settings.returnFocus = false;
        this.popupmenuApi.settings.offset.y = 10;
      }
    }, 100);

    return this;
  },

  /**
   * Attach Events used by the Control
   * @private
   * @returns {object} The api
   */
  handleEvents() {
    const self = this;
    const datepicker = this.element.data('datepicker');
    const timepicker = this.element.data('timepicker');
    const dropdown = this.element.data('dropdown');
    const lookup = this.element.data('lookup') || this.element.hasClass('lookup');
    const isCheckbox = this.element.is('.checkbox');
    const isFileupload = this.element.is('.fileupload');
    const isSearchfield = this.element.is('.searchfield');
    const isColorpicker = this.element.is('.colorpicker');
    const isRadio = this.element.closest('.radio-group').length > 0;
    const isFieldset = this.element.is('.data') && this.element.closest('.summary-form').length > 0;

    // Helper functions
    const isFocus = elem => $(':focus').is(elem);
    const addFocused = (elem) => {
      (elem || this.element).addClass('is-focused');
    };
    const removeFocused = (elem) => {
      (elem || this.element).removeClass('is-focused');
    };
    const canActive = () => {
      let r = isFocus(this.element);
      r = datepicker && datepicker.isOpen() ? false : r;
      r = timepicker && timepicker.isOpen() ? false : r;
      r = dropdown && dropdown.isOpen() ? false : r;
      return r;
    };
    const doActive = () => {
      self.element.add(self.trigger).add(self.field).add(self.fieldParent)
        .addClass('is-active');
    };
    const doUnactive = () => {
      self.element.add(self.trigger).add(self.field).add(self.fieldParent)
        .removeClass('is-active');
    };
    const canUnactive = (e) => {
      let r = !isFocus(this.element);
      r = this.trigger.is(e.relatedTarget) ? false : r;
      r = this.trigger.is('.is-open') ? false : r;
      r = datepicker && datepicker.isOpen() ? false : r;
      r = timepicker && timepicker.isOpen() ? false : r;
      r = $(e.relatedTarget).prev().is(this.element) ? false : r;
      r = dropdown && dropdown.isOpen() ? false : r;
      r = lookup && lookup.modal && lookup.modal.isOpen() ? false : r;
      r = isColorpicker && this.element.is('.is-open') ? false : r;
      return r;
    };
    const onPopupToggle = (elem) => {
      if (elem.trigger) {
        elem.trigger
          .off(`show.${COMPONENT_NAME}`).on(`show.${COMPONENT_NAME}`, () => {
            doActive();
          })
          .off(`hide.${COMPONENT_NAME}`).on(`hide.${COMPONENT_NAME}`, (e) => {
            if (canUnactive(e)) {
              doUnactive();
              this.element.removeClass('is-open');
            }
          });
      }
    };
    const getTriggerTopVal = () => {
      const height = this.element.height();
      let returns;

      if (isFieldset) {
        returns = (((height - this.trigger.height()) - 1) / 2) * -1;
      } else if (isRadio) {
        returns = ((height - this.trigger.height()) / 2) * -1;
      }
      return returns;
    };
    const setTriggerCssTop = () => {
      this.trigger.css({ top: `${getTriggerTopVal() - 1}px` });
    };

    // Set field-options visibility.
    // In touch environments, the button should always be visible.
    // In desktop environments, the button should only display when the field is in use.
    if (env.features.touch) {
      this.field.addClass('visible');
      this.trigger.on(`beforeopen.${COMPONENT_NAME}`, (e) => {
        if (!canActive(e)) {
          return;
        }
        doActive();
      }).on(`close.${COMPONENT_NAME}`, (e) => {
        if (!canUnactive(e)) {
          return;
        }
        doUnactive();
      });
    } else {
      this.field.removeClass('visible');
      this.field
        .on(`mouseover.${COMPONENT_NAME}`, () => {
          if (self.element.prop('disabled') || self.element.closest('is-disabled').length) {
            return;
          }

          if (self.field[0].className.indexOf('visible') < 0) {
            self.field[0].classList.add('visible');
          }
        })
        .on(`mouseout.${COMPONENT_NAME}`, () => {
          if (self.field[0].className.indexOf('visible') > -1) {
            self.field[0].classList.remove('visible');
          }
        });
    }

    // Adjust stack order for dropdown
    if (dropdown) {
      setTimeout(() => {
        const popupmenu = this.trigger.data('popupmenu');
        if (popupmenu) {
          popupmenu.menu.closest('.popupmenu-wrapper').css({ 'z-index': '4502' });
        }
      }, 0);
    }
    // Bind active/unactive on show datepicker or timepicker
    if (datepicker || timepicker) {
      if (datepicker) {
        onPopupToggle(datepicker);
      } else {
        onPopupToggle(timepicker);
      }
    }
    // Adjust return focus for timepicker
    if (timepicker) {
      timepicker.settings.returnFocus = false;
    }
    // Move trigger(action-button) in to lookup-wrapper
    if (lookup || isColorpicker) {
      this.field.on(`click.${COMPONENT_NAME}`, '.lookup-wrapper .trigger, .colorpicker-container .trigger', () => {
        doActive();
      });

      if (isColorpicker) {
        this.element
          .on(`beforeopen.${COMPONENT_NAME}`, () => {
            doActive();
          });
      }
    }
    // Checkbox add parent css class
    if (isCheckbox) {
      this.trigger.addClass('is-checkbox');
      if (!env.features.touch && this.isSafari) {
        this.field.on(`click.${COMPONENT_NAME}`, '.checkbox-label', () => {
          doActive();
        }).on(`mouseout.${COMPONENT_NAME}`, '.checkbox-label', () => {
          doUnactive();
        });
      }
    }
    // Bind fileupload events
    if (isFileupload) {
      this.element.on(`change.${COMPONENT_NAME}`, () => {
        this.targetElem.focus();
      });
      this.field.on(`click.${COMPONENT_NAME}`, '.trigger, .trigger-close', () => {
        doActive();
      });
    }
    // Move trigger(action-button) in to searchfield-wrapper
    if (isSearchfield) {
      setTimeout(() => {
        this.trigger.add(this.trigger.next('.popupmenu'))
          .appendTo(this.element.closest('.searchfield-wrapper'));
      }, 0);
    }
    // Fieldset - set trigger(action-button) top value and bind events
    if (isFieldset) {
      setTriggerCssTop();
      this.targetElem.add(this.trigger).on(`keydown.${COMPONENT_NAME}`, (e) => {
        const key = e.which || e.keyCode || e.charCode || 0;
        if (key === 13) {
          setTimeout(() => {
            doActive();
          }, 0);
        }
      });
      this.targetElem.attr('tabindex', 0)
        .on(`click.${COMPONENT_NAME}`, () => {
          doActive();
        });
      $(document).on(`click.${COMPONENT_NAME}`, (e) => {
        if (!$(e.target).is(this.element)) {
          doUnactive();
        }
      });
      $('body').on(`resize.${COMPONENT_NAME}`, () => {
        setTriggerCssTop();
      });
    }
    // Radio group - set trigger(action-button) top value and bind events
    if (isRadio) {
      setTriggerCssTop();
      this.element
        .on(`focusin.${COMPONENT_NAME}`, '.radio', () => {
          const delay = this.isSafari ? 200 : 0;
          addFocused();
          setTimeout(() => {
            doActive();
          }, delay);
        })
        .on(`focusout.${COMPONENT_NAME}`, '.radio', () => {
          removeFocused();
        });
      $('body').on(`resize.${COMPONENT_NAME}`, () => {
        setTriggerCssTop();
      });
    }

    // Element events
    this.targetElem
      .on(`focusin.${COMPONENT_NAME}`, () => {
        doActive();
        if (isRadio && this.isSafari) {
          addFocused();
        }
      })
      .on(`focusout.${COMPONENT_NAME}`, (e) => {
        const delay = this.isSafari ? 200 : 0;
        if (isRadio && this.isSafari) {
          removeFocused();
        }
        setTimeout(() => {
          if (canUnactive(e)) {
            doUnactive();
          }
        }, delay);
      });

    // Trigger(action button) events
    this.trigger
      .on(`focusin.${COMPONENT_NAME} click.${COMPONENT_NAME}`, () => {
        doActive();
      })
      .on(`focusout.${COMPONENT_NAME}`, (e) => {
        if (canUnactive(e)) {
          doUnactive();
        }
      })
      .on(`selected.${COMPONENT_NAME}`, () => {
        this.popupmenuApi.settings.returnFocus = true;
      })
      .on(`close.${COMPONENT_NAME}`, (e) => {
        if (canUnactive(e)) {
          doUnactive();
        }
      });

    // FIX: Safari - by default does not get focus on some elements while using tab key
    // https://stackoverflow.com/a/29106095
    if (this.isSafari || isFileupload) {
      if (isRadio) {
        this.element.attr('tabindex', 0);
      }
      this.targetElem.on(`keydown.${COMPONENT_NAME}`, (e) => {
        const key = e.which || e.keyCode || e.charCode || 0;
        if (key === 9 && !e.shiftKey) {
          if (isRadio) {
            this.targetElem.find(':checked, .radio:first').not(':disabled').focus();
            this.targetElem.find('.radio')
              .off(`keydown.${COMPONENT_NAME}`).on(`keydown.${COMPONENT_NAME}`, (e2) => {
                const key2 = e2.which || e2.keyCode || e2.charCode || 0;
                if (key2 === 9 && !e.shiftKey) {
                  setTimeout(() => {
                    this.trigger.focus();
                  }, 0);
                }
              });
          } else {
            this.trigger.focus();
          }
          doActive();
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    this.element
      .on(`listopened.${COMPONENT_NAME}`, () => {
        doActive();
      })
      .on(`listclosed.${COMPONENT_NAME}`, () => {
        doUnactive();
      });

    return this;
  }, // END: Handle Events -------------------------------------------------

  /**
  * Set component to enabled.
  * @returns {object} The api
  */
  enable() {
    this.trigger.prop('disabled', false);
    return this;
  },

  /**
  * Set component to disabled.
  * @returns {object} The api
  */
  disable() {
    this.trigger.prop('disabled', true);
    return this;
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {object} The api
   */
  unbind() {
    this.field.off([
      `click.${COMPONENT_NAME}`,
      `mouseover.${COMPONENT_NAME}`,
      `mouseout.${COMPONENT_NAME}`
    ].join(' '));

    this.element.off([
      `beforeopen.${COMPONENT_NAME}`,
      `change.${COMPONENT_NAME}`,
      `focusin.${COMPONENT_NAME}`,
      `focusout.${COMPONENT_NAME}`,
      `listclosed.${COMPONENT_NAME}`,
      `listopened.${COMPONENT_NAME}`
    ].join(' '));

    this.trigger.off([
      `beforeopen.${COMPONENT_NAME}`,
      `click.${COMPONENT_NAME}`,
      `focusin.${COMPONENT_NAME}`,
      `focusout.${COMPONENT_NAME}`,
      `selected.${COMPONENT_NAME}`,
      `close.${COMPONENT_NAME}`
    ].join(' '));

    this.targetElem.off([
      `click.${COMPONENT_NAME}`,
      `keydown.${COMPONENT_NAME}`
    ].join(' '));

    $('body').off([
      `resize.${COMPONENT_NAME}`
    ].join(' '));

    $(document).off([
      `click.${COMPONENT_NAME}`
    ].join(' '));

    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, FIELDOPTIONS_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
  * Teardown process for this plugin
  * @returns {void}
  */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { FieldOptions, COMPONENT_NAME };
