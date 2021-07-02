import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../../components/locale/locale';

// jQuery components
import '../behaviors.jquery';
import '../../components/components.jquery';

// The name of this component
const COMPONENT_NAME = 'initialize';

// Component Defaults
const INITIALIZE_DEFAULTS = {
  locale: 'en-US',
  language: null // same as locale by default
};

// Contains excluded CSS selectors that prevent automatic initialization
const noinitExcludes = '.no-init, [data-init]';

// Invokes a Soho component against an Element
function invoke(elem, pluginName, settings) {
  return $(elem)[pluginName](settings);
}

// Finds child elements that match a CSS selector
function matchedItems(elem, selector) {
  let items = elem.find(selector).not(noinitExcludes);
  if (elem.filter(selector).length) {
    items = items.add(elem);
  }
  return items;
}

// Array of plugin names, selectors (optional), and callback functions (optional),
// for no-configuration initializations.
const PLUGIN_MAPPINGS = [

  // Inline text translations by Locale, via the `data-translate` attribute.
  // (Not all inline text items are powered by JS components)
  ['texttranslations', '[data-translate="text"]', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each((i, item) => {
      const obj = $(item);
      obj.attr('data-translate-key', obj.text());
      obj.text(Locale.translate(obj.text(), true));
    });
  }],

  ['texttranslations', '[data-translate="value"]', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each((i, item) => {
      const obj = $(item);
      obj.attr('data-translate-key', obj.attr('value'));
      obj.attr('value', Locale.translate(obj.attr('value'), true));
    });
  }],

  ['texttranslations', '[data-translate="placeholder"]', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each((i, item) => {
      const obj = $(item);
      obj.attr('data-translate-key', obj.attr('placeholder'));
      obj.attr('placeholder', Locale.translate(obj.attr('placeholder'), true));
    });
  }],

  // Application Menu
  ['applicationmenu', '#application-menu', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each((i, item) => {
      $(item).applicationmenu({
        triggers: rootElem.find('.application-menu-trigger')
      });
    });
  }],

  // Personalization
  ['personalize', null, function () {
    $('html').personalize();
  }],

  // Hyperlinks
  ['hyperlink'],

  // Icons
  ['icon'],

  // Radio switch
  ['radio', '.radio-section input:radio.handle', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).change(function () {
      if (this.checked) {
        const option = $(this).closest('.option');
        const siblings = option.siblings();
        const fields = 'button, select, input[type="text"]';

        $(fields, option).removeAttr('disabled');
        $(fields, siblings).attr('disabled', 'disabled');
      }
    });
  }],

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

  // Password Reveal
  ['revealText', 'input.input-password-reveal'],

  // Sliders
  ['slider', 'input[type="range"], .slider'],

  // Editors
  ['editor'],

  // Tooltips
  ['tooltip', 'button[title], span[title], .hyperlink[title], .icon[title], input[title]'],

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

  // Cards
  ['cards', '.card:not([data-init])'],

  // Multiselect
  ['multiselect', 'select[multiple]:not(.dropdown), .multiselect:not([data-init])'],

  // Button with Effects
  // NOTE: don't invoke buttons inside of modals, wait for the modal to be invoked.
  ['button', [
    '.btn',
    '.btn-toggle',
    '.btn-secondary',
    '.btn-primary',
    '.btn-modal-primary',
    '.btn-tertiary',
    '.btn-icon',
    '.btn-actions',
    '.btn-menu',
    '.btn-split',
    '.btn-secondary-border'
  ].join(', '), function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each((i, item) => {
      const parents = $(item).parents('.modal');
      if (parents.length) {
        return;
      }
      $(item).button();
    });
  }],

  // Hide Focus
  ['hideFocus', 'a.hide-focus, a.tick, .checkbox, .radio, .switch'],

  // Circle Pager
  ['circlepager'],

  // Clear x
  ['clearable', ['[data-clearable="true"]'].join(', '), function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each((i, item) => {
      const tabbable = $(item).attr('data-tabbable');
      if (tabbable === undefined) {
        $(item).clearable({ tabbable: true });
      } else {
        $(item).clearable({ tabbable: (tabbable === 'true') });
      }
    });
  }],

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

  ['fileupload', 'input.fileupload:not(.fileupload-background-transparent):not([type="text"])'],

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

  ['calendar', '.calendar'],

  ['calendartoolbar', '.calendar-toolbar'],

  ['monthview', '.monthview'],

  ['weekview', '.week-view'],

  ['listview'],

  // Track Dirty
  ['trackdirty', '[data-trackdirty="true"]'],

  // Virtual Scroll
  ['virtualscroll', '.virtual-scroll'],

  // Context Menus - Popupmenu Components with no trigger buttons
  ['popupmenu', '[data-popupmenu]:not(.btn-actions, .btn-filter, .btn-menu)', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each((i, item) => {
      const popupElem = $(item);
      const settings = $.extend({}, utils.parseOptions(popupElem));
      const popupData = popupElem.attr('data-popupmenu');

      if (popupData) {
        settings.menuId = popupData;
      }

      invoke(popupElem, pluginName, settings);
    });
  }],

  // Menu Buttons - Popupmenu Components attached to trigger buttons
  ['popupmenu', '.btn-actions, .btn-filter, .btn-menu', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each((i, item) => {
      const triggerButton = $(item);

      // Don't auto-invoke Toolbar's Popupmenus.
      // Toolbar needs to completely control its contents and invoke each one manually.
      if (triggerButton.parents('.toolbar, .flex-toolbar').length > 0) {
        return;
      }

      invoke(triggerButton, pluginName);
    });
  }],

  // Popover
  ['popover', '[data-popover]', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each(function () {
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
  }],

  // Searchfield components need to be filtered for ToolbarSearchfield components,
  // which are invoked separately by their Toolbar element containers.
  ['searchfield', '.searchfield', function (rootElem, pluginName, selector) {
    let searchfields = matchedItems(rootElem, selector);
    const toolbarSearchfields = searchfields.filter(function () {
      return $(this).parents('.toolbar').length;
    });
    searchfields = searchfields.not(toolbarSearchfields);

    searchfields.each(function () {
      invoke(this, 'searchfield');
    });
  }],

  // Toolbar components that are invoked by parent Headers, Contextual Action Panels, and
  // Modal components should be excluded.
  ['toolbar', '.toolbar', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each((i, item) => {
      const t = $(item);

      if (t.parents('.header, .contextual-action-panel .modal-header').length &&
        !rootElem.is('.toolbar')) {
        return;
      }

      invoke(t, 'toolbar');
    });
  }],

  // Flex Toolbar
  ['toolbarflex', '.flex-toolbar'],

  // Accordion components that are invoked by Application Menus should be excluded.
  ['accordion', '.accordion', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each((i, item) => {
      const a = $(item);
      if (a.parents('.application-menu').length) {
        return;
      }

      invoke(a, 'accordion');
    });
  }],

  // Tag List
  ['taglist', '.tag-list'],

  // Breadcrumb
  ['breadcrumb', '.breadcrumb'],

  // Swipe Action
  ['swipeaction', '.swipe-action'],

  // Form Compact Component
  ['formcompact', '.form-compact-container', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each((i, item) => {
      invoke($(item), 'formcompact');
    });
  }],

  // List/Detail Pattern
  ['listdetail', '.list-detail', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).each((i, item) => {
      invoke($(item), 'listdetail');
    });
  }],

  // Translate `aria-label` attributes on Breadcrumb lists
  // (Breadcrumbs aren't invoked with a JS component)
  ['breadcrumblabels', '.breadcrumb ol', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).attr('aria-label', Locale.translate('Breadcrumb'));
  }],

  // Validation on individual fields (Should run last)
  ['validate', '[data-validate]', function (rootElem, pluginName, selector) {
    matchedItems(rootElem, selector).closest('form, body').validate();
  }],

  // Form validation
  ['validate', 'form[data-validate-on="submit"]']
];

// Invokes a specific Soho component type against an element, in some cases with
// specified rules or CSS selectors.
function mapToInit(elem, plugin, selector, callback) {
  // Don't continue if the jQuery constructor for this plugin isn't loaded.
  if (!$.fn[plugin] && plugin !== 'texttranslations') {
    return;
  }

  // Allow only the plugin name to be specified if the default selector is
  // a class with the same name, Like `$.fn.header` applying to elements that
  // match `.header`
  if (typeof selector === 'undefined') {
    selector = `.${plugin}`;
  }

  // If a callback function is provided, run that instead of the normal init.
  // Functions contain more-customized initialization for some components.
  if (typeof callback === 'function') {
    callback(elem, plugin, selector);
    return;
  }

  // Run the matcher and do normal init.
  matchedItems(elem, selector).each(function () {
    const thisElem = $(this);

    // Don't init if this element or one of its containing elements is flagged
    // with `[data-init]` or `.no-init`.
    if (thisElem.is(noinitExcludes) || thisElem.parents(noinitExcludes).length) {
      return;
    }

    invoke(this, plugin);
  });
}

/**
 * Page Bootstrapper, will initialize all components on a page with default settings.
 * @class Initialize
 * @constructor
 * @param {jQuery[]|HTMLElement} element the root element to initialize
 * @param {object} [settings] incoming settings
 */
function Initialize(element, settings) {
  // Fall back for old way of calling locale
  let newSettings = settings;
  if (typeof settings === 'string') {
    newSettings = {
      locale: settings
    };
  }

  this.element = $(element);

  if (Locale.currentLocale && Locale.currentLocale.name && !settings) {
    newSettings = {
      locale: Locale.currentLocale.name
    };
  }

  if (Locale.currentLanguage && Locale.currentLanguage.name &&
    Locale.currentLocale.name.substr(0, 2) !== Locale.currentLanguage.name &&
    !settings) {
    newSettings.language = Locale.currentLanguage.name;
  }

  this.settings = utils.mergeSettings(this.element[0], newSettings, INITIALIZE_DEFAULTS);
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
    Locale.set(this.settings.locale).done(() => {
      if (this.settings.language) {
        Locale.setLanguage(this.settings.language).done(() => {
          self.initAll();
        });
        return;
      }
      self.initAll();
    });

    return this;
  },

  /**
   * Initializes all Soho components inside the root element provided.
    * @returns {this} component instance
   */
  initAll() {
    const self = this;

    // Iterate all objects we are initializing
    this.element.each(function () {
      for (let i = 0; i < PLUGIN_MAPPINGS.length; i++) {
        mapToInit($(this), ...PLUGIN_MAPPINGS[i]);
      }
    });

    // NOTE: use of .triggerHandler() here causes event listeners for "initialized"
    // to fire, but prevents the "initialized" event from bubbling up the DOM.
    // It should be possible to initialize just the contents of an element on
    // the page without causing the entire page to re-initialize.
    this.element.triggerHandler('initialized', { locale: Locale.currentLocale });

    // Run validation on the entire element, if applicable.
    if ($.fn.validate) {
      self.element.validate();
    }

    return this;
  }
};

export { Initialize, COMPONENT_NAME };
