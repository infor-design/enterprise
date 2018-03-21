/* eslint-disable */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// jQuery components
import '../components.jquery';

// The name of this component
const COMPONENT_NAME = 'initialize';

// Component Defaults
const INITIALIZE_DEFAULTS = {
  locale: null
};

/**
 * Page Bootstrapper, will initialize all components on a page with default settings.
 * @class Initialize
 * @constructor
 * @param {jQuery[]|HTMLElement} element the root element to initialize
 * @param {object} [settings] incoming settings
 */
function Initialize(element, settings) {
  // Settings and Options
  if (typeof settings === 'string') {
    settings = {
      locale: settings
    };
  }

  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, INITIALIZE_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
Initialize.prototype = {

  /**
   * Makes sure the Locale is set before attempting initialize components
   * @private
   * @returns {this} component instance
   */
  init() {
    const self = this;
    let locale = this.settings.locale;
    if ((!Soho.Locale || !Soho.Locale.currentLocale) && !this.settings.locale) {
      locale = 'en-US';
    }

    if (locale) {
      Locale.set(locale).done(() => {
        self.initAll();
      });
    } else {
      self.initAll();
    }

    return this;
  },

  /**
   * Initializes all Soho components inside the root element provided.
    * @returns {this} component instance
   */
  initAll() {
    const self = this;

    // Iterate all objects we are initializing
    this.element.filter(':not(.no-init)').each(function () {
      const elem = $(this);
      const noinitExcludes = '.no-init, [data-init]';

      function invokeWithInlineOptions(thisElem, plugin) {
        const options = utils.parseOptions(thisElem);
        $(thisElem)[plugin](options);
      }

      function matchedItems(selector) {
        let items = elem.find(selector);
        if (elem.filter(selector).length) {
          items = items.add(elem);
        }
        return items;
      }

      function simpleInit(plugin, selector) {
        // Allow only the plugin name to be specified if the default selector is
        // a class with the same name, Like `$.fn.header` applying to elements that
        // match `.header`
        if (typeof selector === 'undefined') {
          selector = `.${plugin}`;
        }

        if ($.fn[plugin]) {
          matchedItems(selector).each(function () {
            const thisElem = $(this);

            if (thisElem.is(noinitExcludes) && selector !== '[data-trackdirty="true"]') {
              return;
            }

            if (thisElem.parents().hasClass('no-init')) {
              return;
            }

            // Don't invoke elements inside of "container" controls that need to
            // invoke their internal items in a specific order.
            if (!thisElem.is('.icon') && thisElem.parents('.toolbar').length &&
              !thisElem.parents().hasClass('masthead')) {
              return;
            }

            invokeWithInlineOptions(this, plugin);
          });
        }

        // Radio switch
        matchedItems('.radio-section input:radio.handle').change(function () {
          if (this.checked) {
            const option = $(this).closest('.option');
            const siblings = option.siblings();
            const fields = 'button, select, input[type="text"]';

            $(fields, option).removeAttr('disabled');
            $(fields, siblings).attr('disabled', 'disabled');
          }
        });
      }

      // Mobile Zoom Control
      // Needs manual invokation because the rest of initialization is scoped to the
      // calling element, which is the <body> tag.
      if ($.fn.zoom) {
        $('head').zoom();
      }

      // Application Menu
      if ($.fn.applicationmenu) {
        matchedItems('#application-menu').applicationmenu({
          triggers: elem.find('.application-menu-trigger')
        });
      }

      // Personalization
      if ($.fn.personalize) {
        matchedItems('html').personalize();
      }

      // Array of plugin names and selectors (optional) for no-configuration initializations
      const simplePluginMappings = [

        // Hyperlinks
        ['hyperlink'],

        // Icons
        ['icon'],

        ['splitter'],

        // Tabs
        ['tabs', '.tab-container:not(.vertical)'],

        // Vertical Tabs
        ['verticaltabs', '.tab-container.vertical'],

        // MultiTabs Containers
        ['multitabs', '.multitabs-container'],

        // Select / DropDowns
        ['dropdown', 'select.dropdown:not(.multiselect)'],
        ['dropdown', 'select.dropdown-xs:not(.multiselect)'],
        ['dropdown', 'select.dropdown-sm:not(.multiselect)'],
        ['dropdown', 'select.dropdown-lg:not(.multiselect)'],

        // Modals
        ['modal'],

        // Sliders
        ['slider', 'input[type="range"], .slider'],

        // Editors
        ['editor'],

        // Tooltips
        ['tooltip', 'button[title], span[title], .hyperlink[title]'],

        // Tree
        ['tree'],

        // Rating
        ['rating'],

        // Listbuilder
        ['listbuilder'],

        // Composite Form Wrapper
        ['compositeform', '.composite-form'],

        // Progress
        ['progress', '.progress-bar'],

        // Format
        ['mask', 'input[data-mask], .new-mask'],

        // Auto Complete
        ['autocomplete', '.autocomplete:not([data-init])'],

        // Multiselect
        ['multiselect', 'select[multiple]:not(.dropdown), .multiselect:not([data-init])'],

        // Button with Effects
        ['button', '.btn, .btn-toggle, .btn-secondary, .btn-primary, .btn-modal-primary, .btn-tertiary, .btn-icon, .btn-actions, .btn-menu, .btn-split, .btn-secondary-border'],

        // Hide Focus
        ['hideFocus', 'a.hide-focus, a.tick, .checkbox, .radio, .switch'],

        // Circle Pager
        ['circlepager'],

        // Track Dirty
        ['trackdirty', '[data-trackdirty="true"]'],

        // Clear x
        ['clearable', '[data-clearable="true"]'],

        // Text Area
        ['textarea', 'textarea'],

        // Spinbox
        ['spinbox'],

        // sort drag and drop
        ['arrange'],

        // Swap List
        ['swaplist'],

        // Color Picker
        ['colorpicker'],

        // Date Picker
        ['datepicker'],

        // Time Picker
        ['timepicker'],

        // Tag
        ['tag'],

        // Busy Indicator
        ['busyindicator', '.busy, .busy-xs, .busy-sm'],

        ['header'],

        ['fileupload', 'input.fileupload:not(.fileupload-background-transparent)'],

        ['fileuploadadvanced', '.fileupload-advanced'],

        ['fieldfilter', '.field-filter'],

        ['fieldoptions', '.field-options'],

        ['about'],

        ['contextualactionpanel', '.contextual-action-panel-trigger'],

        ['expandablearea', '.expandable-area'],

        ['signin'],

        ['homepage'],

        ['lookup', '.lookup:not([data-init])'],

        ['wizard'],

        ['popdown', '[data-popdown]'],

        ['stepchart', '.step-chart'],

        ['listview'],

        ['toolbarflex', '.flex-toolbar']
      ];

      // Do initialization for all the simple controls
      for (let i = 0; i < simplePluginMappings.length; i++) {
        simpleInit(...simplePluginMappings[i]);
      }

      if ($.fn.popupmenu) {
        // Don't double-invoke menu buttons
        const btnExcludes = ', .btn-actions, .btn-filter, .btn-menu';

        // Context Menus
        matchedItems(`[data-popupmenu]:not(${noinitExcludes}${btnExcludes})`).each(function () {
          const triggerButton = $(this);
          const options = $.extend({}, utils.parseOptions(this));
          const popupData = triggerButton.attr('data-popupmenu');

          if (popupData) {
            options.menuId = popupData;
          }

          triggerButton.popupmenu(options);
        });

        // Button-based Popup-Menus (Action/More Button, Menu Buttons, etc.)
        matchedItems('.btn-filter, .btn-menu, .btn-actions').filter(`:not(${noinitExcludes})`).each(function () {
          const triggerButton = $(this);

          // Don't auto-invoke Toolbar's Popupmenus.
          // Toolbar needs to completely control its contents and invoke each one manually.
          if (triggerButton.parents('.toolbar').length > 0) {
            return;
          }

          invokeWithInlineOptions(triggerButton, 'popupmenu');
        });
      }

      // Popovers
      if ($.fn.popover) {
        matchedItems(`[data-popover]:not(${noinitExcludes})`).each(function () {
          const options = utils.parseOptions(this);
          const obj = $(this);
          const trigger = obj.attr('data-trigger');
          const title = obj.attr('data-title');
          const placement = obj.attr('data-placement');

          if (!$.isEmptyObject(options)) {
            obj.popover({
              content: $(options.content),
              popover: true,
              trigger: options.trigger || 'click',
              title: options.title || undefined,
              placement: options.placement || 'right',
              extraClass: options.extraClass || undefined
            });
          } else {
            obj.popover({
              content: $(`#${obj.attr('data-popover')}`),
              popover: true,
              trigger: trigger || 'click',
              title: title || undefined,
              placement: placement || 'right',
              extraClass: options.extraClass || undefined
            });
          }
        });
      }

      // Searchfield
      // NOTE:  The Toolbar Control itself understands how to invoke internal searchfields, so they
      // are excluded from this initializer.
      if ($.fn.searchfield) {
        let searchfields = matchedItems(`.searchfield:not(${noinitExcludes})`);
        const toolbarSearchfields = searchfields.filter(function () {
          return $(this).parents('.toolbar').length;
        });
        searchfields = searchfields.not(toolbarSearchfields);

        searchfields.each(function () {
          invokeWithInlineOptions(this, 'searchfield');
        });
      }

      // Accordion
      if ($.fn.accordion) {
        matchedItems(`.accordion:not(${noinitExcludes})`).each(function () {
          const a = $(this);
          if (a.parents('.application-menu').length) {
            return;
          }

          invokeWithInlineOptions(a, 'accordion');
        });
      }

      // Toolbar
      if ($.fn.toolbar) {
        matchedItems(`.toolbar:not(${noinitExcludes})`).each(function () {
          const t = $(this);
          // Don't re-invoke toolbars that are part of the page/section headers or cap header.
          // header.js manually invokes these toolbars during its setup process.
          // However, if initialize is specifically being called on the toolbar element,
          // then allow it to happen.
          if (t.parents('.header, .contextual-action-panel .modal-header').length &&
            !self.element.is('.toolbar')) {
            return;
          }

          invokeWithInlineOptions(t, 'toolbar');
        });
      }

      // List/Detail Pattern
      if ($.fn.listdetail) {
        matchedItems(`.list-detail:not(${noinitExcludes})`).each(function() {
          invokeWithInlineOptions($(this), 'listdetail');
        });
      }

      matchedItems('[data-translate="text"]').each(function () {
        const obj = $(this);
        obj.text(Locale.translate(obj.text()));
      });

      // Validation
      // Should be one of the last items to invoke
      if ($.fn.validate) {
        matchedItems('[data-validate]').parentsUntil('form, html').validate();
      }

      matchedItems('.breadcrumb ol').attr('aria-label', Locale.translate('Breadcrumb'));
    });

    // NOTE: use of .triggerHandler() here causes event listeners for "initialized"
    // to fire, but prevents the "initialized" event from bubbling up the DOM.
    // It should be possible to initialize just the contents of an element on
    // the page without causing the entire page to re-initialize.
    this.element.triggerHandler('initialized');

    if ($.fn.validate) {
      self.element.validate();
    }

    return this;
  }
};

export { Initialize, COMPONENT_NAME };
