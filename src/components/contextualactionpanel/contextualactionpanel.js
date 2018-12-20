import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';

const COMPONENT_NAME = 'contextualactionpanel';

/**
* A more complex modal for complex in page interactions.
* @class ContextualActionPanel
* @param {string} element The component element.
* @param {string} settings The component settings.
* @param {string} [settings.id = `contextual-action-modal-cnt`]
* The id to use for the CAP, or defaults to generated.
* @param {array} [settings.buttons = null] A list of buttons that will sit in the toolbar's Buttonset area.
* @param {string} [settings.title = 'Contextual Action Panel'] String that sits in the toolbar's title field.
* @param {content} [settings.content = null] Pass content through to CAP.
* @param {boolean} [settings.initializeContent = true] Initialize content before opening with defaults.
* @param {string} [settings.trigger = 'click'] Can be 'click' or 'immediate'.
* @param {boolean} [settings.centerTitle = false] If true the title will be centered.
* @param {boolean} [settings.useFlexToolbar] If true the new flex toolbar will be used (For CAP)
*/
const CONTEXTUALACTIONPANEL_DEFAULTS = {
  id: `contextual-action-modal-${parseInt($('.modal').length, 10) + 1}`,
  buttons: null,
  title: 'Contextual Action Panel', //
  content: null, //
  initializeContent: true, // initialize content before opening
  trigger: 'click',
  showCloseButton: false,
  centerTitle: false
};

function ContextualActionPanel(element, settings) {
  this.settings = utils.mergeSettings(element, settings, CONTEXTUALACTIONPANEL_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
ContextualActionPanel.prototype = {

  /**
   * @returns {Modal|undefined} instance of an IDS modal, or undefined if one doesn't exist
   */
  get modalAPI() {
    let api;
    if (this.panel && this.panel.length) {
      api = this.panel.data('modal');
    }
    return api;
  },

  /**
  * Initialize the CAP.
  * @private
  */
  init() {
    this
      .setup()
      .build()
      .handleEvents();
  },

  /**
  * Setup internal variables.
  * NOTE: Does not do any building.
  * @private
  * @returns {object} The Api for chaining.
  */
  setup() {
    this.panel = this.element.next('.contextual-action-panel');

    const dataModal = this.element.data('modal');
    if (typeof dataModal === 'string') {
      const panelFromID = $(`#${dataModal}`);
      if (panelFromID.length) {
        this.panel = panelFromID;
      }
    }

    // Handle case with popup triggered from a menu
    if (this.element.closest('.popupmenu').length === 1) {
      this.panel = this.element.closest('.popupmenu').next('.contextual-action-panel');
    }

    if (this.panel[0]) {
      this.panel[0].style.display = 'none';
    }
    this.panel.addClass('is-animating');

    return this;
  },

  /**
  * Add markup to build up the component.
  * @private
  * @returns {object} The Api for chaining.
  */
  build() {
    const self = this;

    // Build the Content if it's not present
    if (this.panel.length === 0) {
      if (this.settings.content instanceof jQuery) {
        if (this.settings.content.is('.contextual-action-panel')) {
          this.panel = this.settings.content;
        } else {
          this.settings.content.wrap('<div class="contextual-action-panel"></div>');
          this.panel = this.settings.content.parent();
        }

        this.panel.addClass('modal').appendTo('body');

        if (this.settings.content.is('iframe')) {
          this.settings.content.ready(() => {
            self.completeBuild();
            self.settings.content.show();
          });
          return self;
        }
        this.settings.content.show();
      } else {
        this.panel = $(`<div class="contextual-action-panel">${this.settings.content}</div>`).appendTo('body');
        this.panel.addClass('modal').attr('id', this.settings.id);
      }
    }

    this.completeBuild();
    return this;
  },

  /**
  * Finalize build up/
  * @private
  * @returns {object} The Api for chaining.
  */
  completeBuild() {
    let children;
    let isIframe = false;
    let contents;
    let hasSearchfield = false;
    let predefined = true;

    // Invoke Icons
    this.panel.find('svg').icon();

    // Get a reference to `.modal-content`
    const modalContent = this.panel.find('.modal-content');
    if (modalContent.length === 0) {
      children = this.panel.children();
      if (children.is('iframe')) {
        contents = children.contents();
        this.toolbar = contents.find('.toolbar, .flex-toolbar');
        isIframe = true;
      }

      if (!isIframe) {
        children.wrapAll('<div class="modal-content"></div>').wrapAll('<div class="modal-body"></div>');
        this.panel.addClass('modal');
      }
    }

    // Build/reference the header
    let modalHeader = this.panel.find('.modal-header');
    if (modalHeader.length === 0) {
      modalHeader = $('<div class="modal-header"></div>');
      modalHeader.insertBefore(this.panel.find('.modal-body'));
    }
    this.header = modalHeader;

    // Detect existence of buttonset for later
    let buttonset = this.panel.find('.toolbar .buttonset, .flex-toolbar .buttonset');

    // Build/reference the CAP header toolbar
    if (!this.toolbar) {
      this.toolbar = this.panel.find('.toolbar, .flex-toolbar');
    }
    if (!this.toolbar.length) {
      predefined = false;
      if (this.settings.buttons) {
        this.settings.buttons.forEach((button) => {
          if (button.type === 'input') {
            hasSearchfield = true;
          }
        });
      }

      if (this.settings.title && this.settings.centerTitle) {
        const toolbarSearchfieldSection = hasSearchfield ? '<div class="toolbar-section search"></div>' : '';
        const toolbarHTML = `<div class="flex-toolbar">
          <div class="toolbar-section static"></div>
          <div class="toolbar-section title center-text">
            <h2>${this.settings.title}</h2>
          </div>
          ${toolbarSearchfieldSection}
          <div class="toolbar-section buttonset static"></div>
        </div>`;

        this.toolbar = $(toolbarHTML);
      } else if (!buttonset.length) {
        const toolbarCSSClass = this.settings.useFlexToolbar ? 'flex-toolbar' : 'toolbar';
        const toolbarTitleSection = this.settings.useFlexToolbar ? `<div class="toolbar-section title"><h2>${this.settings.title}</h2></div>` : '';
        const toolbarButtonsetCSSClass = this.settings.useFlexToolbar ? 'toolbar-section buttonset' : 'buttonset';
        const toolbarButtonsetSection = `<div class="${toolbarButtonsetCSSClass}"></div>`;
        const toolbarSearchfieldSection = this.settings.useFlexToolbar && hasSearchfield ? '<div class="toolbar-section search"></div>' : '';
        const toolbarHTML = `<div class="${toolbarCSSClass}">
          ${toolbarTitleSection}
          ${toolbarSearchfieldSection}
          ${toolbarButtonsetSection}
        </div>`;

        const toolbar = $(toolbarHTML);
        toolbar.appendTo(this.panel.find('.modal-header'));
        this.toolbar = toolbar;
        buttonset = toolbar.children('.buttonset');
      }
    }
    this.toolbar.appendTo(this.header);

    // Only add certain elements if a Toolbar was generated with JS-options
    // and not by HTML markup.
    if (!predefined) {
      if (!buttonset || !buttonset.length && !this.settings.centerTitle) {
        buttonset = $('<div class="toolbar-section buttonset"></div>');
        buttonset.appendTo(this.toolbar);
      }

      let toolbarTitle = this.toolbar.find('.title');
      if (!toolbarTitle.length) {
        const centerTextCSS = this.settings.centerTitle ? ' center-text' : '';
        toolbarTitle = $(`
          <div class="toolbar-section title${centerTextCSS}">
            <h2>${this.settings.title}</h2>
          </div>
        `);

        if (buttonset) {
          toolbarTitle.insertBefore(buttonset);
        } else {
          this.toolbar.prepend(toolbarTitle);
        }
      }

      if (!toolbarTitle.length) {
        toolbarTitle = $(`
          <div class="title">
            ${this.settings.title}
          </div>
        `);
        this.toolbar.prepend(toolbarTitle);
      }
    }

    // Move to the body element to break stacking context issues.
    if (!isIframe) {
      this.panel.detach().appendTo('body');
    }

    this.element.attr('data-modal', this.settings.id);
    if (!this.panel.attr('id')) {
      this.panel.attr('id', this.settings.id);
    }

    this.panel.modal({
      buttons: this.settings.buttons,
      centerTitle: this.settings.centerTitle,
      useFlexToolbar: this.settings.useFlexToolbar,
      trigger: (this.settings.trigger ? this.settings.trigger : 'click')
    });

    this.buttons = this.panel.find('.buttonset').children('button');

    this.closeButton = this.panel.find('.modal-header').find('.btn-close, [name="close"], button.close-button');
    if (!predefined && this.settings.showCloseButton && !this.closeButton.length) {
      this.closeButton = $(`
        <button class="btn-close" type="button">
          <svg class="icon icon-close" focusable="false" aria-hidden="true" role="presentation">
            <use xlink:href="#icon-close"></use>
          </svg>
          <span>Close</span>
        </button>
      `);

      if (!this.settings.useFlexToolbar) {
        const CAPToolbarButton = $('<div class="close-button"></div>').append(this.closeButton);
        this.header.append(CAPToolbarButton);
      } else {
        const standaloneSection = $('<div class="toolbar-section static"></div>').append(this.closeButton);
        const more = this.toolbar.find('.toolbar-section.more');
        standaloneSection.after(more.length ? more : buttonset);
      }
    }

    if (this.closeButton.length) {
      this.toolbar.addClass('has-close-button');
    }

    if (this.toolbar.is('.toolbar')) {
      this.toolbar.toolbar();
    }
    if (this.toolbar.is('.flex-toolbar')) {
      this.toolbar.toolbarflex();
    }

    utils.fixSVGIcons(this.element);
    return this;
  },

  /**
  * Attach event handlers.
  * @private
  * @returns {object} The Api for chaining.
  */
  handleEvents() {
    const self = this;

    // Convenience method that takes an event from the Modal control's panel element,
    // and triggers any listeners that may be looking at the Contextual Action Panel's
    // trigger instead.
    function passEvent(e) {
      self.element.triggerHandler(e.type);
    }

    this.panel.addClass('is-animating').on('open.contextualactionpanel', (e) => {
      passEvent(e);
      self.panel.removeClass('is-animating');
    }).on('beforeclose.contextualactionpanel', () => {
      self.panel.addClass('is-animating');
    }).on('close.contextualactionpanel', (e) => {
      passEvent(e);
    })
      .on('beforeopen.contextualactionpanel', function (e) {
        if (self.settings.initializeContent) {
          $(this).initialize();
        }
        passEvent(e);
      })
      .on('afteropen.contextualactionpanel', () => {
        if (self.toolbar) {
          self.toolbar.trigger('recalculate-buttons');
        }

        // Select the proper element on the toolbar
        if (self.toolbar.length) {
          let selected = self.toolbar.find('.buttonset > .is-selected');
          if (!selected.length) {
            selected = self.toolbar.find('.buttonset > *:first-child');
            if (selected.is('.searchfield-wrapper')) {
              selected = selected.children('.searchfield');
            }
          }
          if (!selected.length && self.toolbar.is('.flex-toolbar')) {
            selected = self.toolbar.find('button').first();
            selected.focus();
            return;
          }
          const toolbarData = self.toolbar.data('toolbar');
          if (toolbarData) {
            toolbarData.setActiveButton(selected, true);
          }
        }

        // Focus the first focusable element inside the Contextual Panel's Body
        self.panel.find('.modal-body-wrapper').find(':focusable').first().focus();
        utils.fixSVGIcons(self.panel);
      });

    if (self.closeButton && self.closeButton.length) {
      self.closeButton.on('click.contextualactionpanel', () => {
        self.handleToolbarSelected();
      });
    }

    return this;
  },

  /**
  * Toolbar select event handler.
  * @private
  * @returns {void}
  */
  handleToolbarSelected() {
    this.close();
  },

  /**
  * Detach events and restore markup.
  * @private
  * @returns {void}
  */
  teardown() {
    const self = this;
    const buttonset = self.toolbar.children('.buttonset');

    this.panel.off('open.contextualactionpanel close.contextualactionpanel ' +
      'beforeopen.contextualactionpanel afterclose.contextualactionpanel');

    buttonset.children('*:not(.searchfield)')
      .off('click.contextualactionpanel');

    const menuButtons = buttonset.children('.btn-menu');
    menuButtons.each(function () {
      const popup = $(this).data('popupmenu');
      if (popup) {
        popup.destroy();
      }
    });

    if (self.header) {
      self.header.remove();
    }

    const children = self.panel.find('.modal-body').children();
    children.first().unwrap().unwrap();

    self.element.removeAttr('data-modal');

    if (self.closeButton && self.closeButton.length) {
      self.closeButton.off('click.contextualactionpanel');
      delete self.closeButton;
    }

    // Trigger an afterclose event on the Contextual Action Panel's trigger element
    // (different from the panel, which is already removed).
    self.element.trigger('afterteardown');
  },

  /**
  * Close the Contextual Action Panel if open and call destroy.
  * @returns {void}
  */
  close() {
    let destroy;
    if (this.settings.trigger === 'immediate') {
      destroy = true;
    }

    if (this.modalAPI) {
      this.modalAPI.close(destroy);
    }
  },

  /**
  * Add a disabled attribute to the main component element.
  * @returns {void}
  */
  disable() {
    this.element.prop('disabled', true);
    if (this.panel.hasClass('is-visible')) {
      this.close();
    }
  },

  /**
  * Remove disabled attribute from the main component element.
  * @returns {void}
  */
  enable() {
    this.element.prop('disabled', false);
  },

  /**
   * Update the component and optionally apply new settings.
   *
   * @param  {object} settings the settings to update to.
   * @returns {object} The plugin api for chaining.
   */
  updated(settings) {
    this.settings = utils.mergeSettings(this.element, settings, this.settings);
    this.setup();

    this.modalAPI.updated(settings);
    return this;
  },

  /**
  * Destroy and remove added markup and events
  * @returns {void}
  */
  destroy() {
    // ModalAPI calls `capAPI.teardown()` at the correct timing
    if (this.modalAPI && this.modalAPI.isOpen) {
      this.modalAPI.close(true);
    }
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { ContextualActionPanel, COMPONENT_NAME };
