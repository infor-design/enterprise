import { utils } from '../utils/utils';

// jQuery components
import '../tabs/tabs.jquery';

// Component Name
const COMPONENT_NAME = 'multitabs';

// Default Settings for MultiTabs
const MULTITABS_DEFAULTS = {
  tabContainers: []
};

// Pre-defined names used internally for tab containers
const TAB_CONTAINER_NAMES = ['primary', 'secondary', 'tertiary'];

/**
 * Scaffolding for containment of multiple, associated tabs containers.
 *
 * @class MultiTabs
 * @param {jQuery[]|HTMLElement} element base element
 * @param {object} [settings] incoming settings
 * @param {array} [settings.tabContainers] contains pre-set tab containers
 */
function MultiTabs(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, MULTITABS_DEFAULTS);

  // internal stuff
  this.tabContainers = {};

  return this.init();
}

MultiTabs.prototype = {
  /**
   * Extra initializing steps
   * @private
   * @returns {void}
   */
  init() {
    const self = this;
    let tabContainers = [];

    if (this.settings.tabContainers instanceof Array && this.settings.tabContainers.length) {
      tabContainers = this.settings.tabContainers;
    } else {
      tabContainers = this.element.find('.tab-container').filter(function () {
        return !$(this).parents('.tab-panel-container').length;
      });
    }

    $(tabContainers).each(function () {
      self.setupTabsInstance($(this));
    });
  },

  /**
   * Builds and stores an instance of a Tabs component.
   * @param {jQuery[]} tabContainer a reference to a `.tab-container` element.
   * @returns {void}
   */
  setupTabsInstance(tabContainer) {
    if (!(tabContainer instanceof $)) {
      return;
    }

    const self = this;
    let didAdd = false;

    TAB_CONTAINER_NAMES.forEach((propname) => {
      if (didAdd || Object.prototype.hasOwnProperty.call(self.tabContainers, propname)) {
        return;
      }

      let api = tabContainer.data('tabs');
      if (!api) {
        tabContainer.tabs();
        api = tabContainer.data('tabs');
      }
      api.multitabsID = propname;

      tabContainer.attr('data-multitabs', propname);
      self.tabContainers[propname] = tabContainer;
      didAdd = true;
    });

    if (!didAdd) {
      throw new Error('all tab-container slots in MultiTabs component are taken, so a new tabs container was not invoked and stored');
    }
  },

  /**
   * Pass-through method for adding tabs that takes the container into account.
   * @param {jQuery[]|String} tabContainer the tab container to target
   * @param {string} tabId (directly passed into the Tabs `add` method)
   * @param {object} options (directly passed into the Tabs `add` method)
   * @param {number} [atIndex] (directly passed into the Tabs `add` method)
   * @returns {Tabs} the tabs API
   */
  add(tabContainer, tabId, options, atIndex) {
    tabContainer = this.checkForValidTabContainer(tabContainer);

    const api = tabContainer.data('tabs');
    return api.add(tabId, options, atIndex);
  },

  /**
   * Pass-through method for removing tabs that takes the container into account.
   * @param {jQuery[]|String} tabContainer the tab container being removed
   * @param {string} tabId - (directly passed into the Tabs `add` method)
   * @param {boolean} [disableBeforeClose] - (directly passed into the Tabs `add` method)
   * @returns {Tabs} the tabs API instance
   */
  remove(tabContainer, tabId, disableBeforeClose) {
    tabContainer = this.checkForValidTabContainer(tabContainer);

    const api = tabContainer.data('tabs');
    return api.remove(tabId, disableBeforeClose);
  },

  /**
   * Finds an existing Tab Panel in any of the tab containers, and moves it
   *  to a designated target tab container.
   * @param {string} tabId the ID of the tab panel (and HREF attribute of the tab) being moved.
   * @param {string} targetTabContainerName name of the tab container that will receive the panel.
   * @param {boolean} [doActivate] optionally activtes the tab after it's moved.
   * @returns {void}
   */
  move(tabId, targetTabContainerName, doActivate) {
    if (!tabId || !targetTabContainerName) {
      throw new Error('can\'t move a tab without both a tabId and a targetTabContainerName');
    }

    let tabMarkup;
    let panelMarkup;
    const allTabContainers = this.getFilterableTabContainers();
    let originalTabContainerName;

    allTabContainers.each(function () {
      const api = $(this).data('tabs');
      const tab = api.getTab(null, tabId);

      // No tabs exist by this id
      if (tab === null) {
        return;
      }

      originalTabContainerName = api.multitabsID;
      tabMarkup = tab.clone();
      panelMarkup = api.getPanel(tabId).children();
    });

    if (!tabMarkup) {
      throw new Error(`No tab markup was found in any Multitabs container for href "${tabId}"`);
    }

    this.remove(originalTabContainerName, tabId);
    this.add(targetTabContainerName, tabId, {
      name: tabMarkup.children('a').text().trim(),
      content: panelMarkup,
      doActivate
    }); // TODO: test atIndex
  },

  /**
   * Uses the internal name of the tab container to either get a reference to an existing
   *  Tab container, or a null reference.
   * @private
   * @param {string} name - the internal name used for this tabs instance
   * @returns {jQuery[]|undefined} a tab container reference
   */
  getTabContainer(name) {
    const self = this;
    let ref;

    TAB_CONTAINER_NAMES.forEach((propname) => {
      if (ref || !self.tabContainers[propname]) {
        return;
      }

      if (name === propname) {
        ref = self.tabContainers[propname];
      }
    });

    return ref;
  },

  /**
   * Gets all currently-setup tab containers in a jQuery selector.
   * @private
   * @returns {jQuery[]} a jQuery-based collection of all available tab containers
   */
  getFilterableTabContainers() {
    let ret = $();

    this.performOnAllContainers((propname, container) => {
      ret = ret.add(container);
    });

    return ret;
  },

  /**
   * Validates an incoming tabContainer name, or jQuery-wrapped Tab Container instance, and returns.
   * @private
   * @param {jQuery[]|string} tabContainer the tab container being checked
   * @returns {jQuery[]} the validated tab container
   */
  checkForValidTabContainer(tabContainer) {
    if (!tabContainer) {
      throw new Error('Need to have a tabContainer defined to hide a tabs instance');
    }
    if (typeof tabContainer === 'string') {
      tabContainer = this.getTabContainer(tabContainer);
    }
    if (!(tabContainer instanceof $) || !tabContainer.length) {
      throw new Error('No matching tabContainer could be found and hidden.');
    }

    return tabContainer;
  },

  /**
   * Runs a callback function on all available tab containers.
   * @param {function} callback the callback function to be executed
   * @param {array} [additionalArgs] any additional arguments to be run in the
   *  context of the callback.
   * @returns {void}
   */
  performOnAllContainers(callback, additionalArgs) {
    const self = this;

    // Make sure additionalArgs is an array of some sort.
    if (!Array.isArray(additionalArgs)) {
      if (!additionalArgs) {
        additionalArgs = [];
      } else {
        additionalArgs = [additionalArgs];
      }
    }

    TAB_CONTAINER_NAMES.forEach(function (propname) {
      const container = self.tabContainers[propname];
      let args = [];

      if (container) {
        args.push(propname, container);
        args = args.concat(additionalArgs);
        callback.apply(this, args);
      }
    });
  },

  /**
   * Re-adjust Module-tab containers' tab widths/alignments so everything lines up.
   * @private
   * @returns {void}
   */
  adjustModuleTabContainers() {
    this.performOnAllContainers((propname, container) => {
      const api = container.data('tabs');
      if (api.isModuleTabs()) {
        api.adjustModuleTabs();
      }
    });
  },

  /**
   * Temporarily removes a tabset from view without destroying it.
   * @param {jQuery[]|string} tabContainer the tab container to be hidden.
   * @returns {void}
   */
  hideTabsInstance(tabContainer) {
    tabContainer = this.checkForValidTabContainer(tabContainer);
    tabContainer.parent('.multitabs-section').addClass('hidden');
    this.adjustModuleTabContainers();
  },

  /**
   * Re-displays a tabset that has temporarily been removed from view.
   * @param {jQuery[]|string} tabContainer the tab container to be shown.
   * @returns {void}
   */
  showTabsInstance(tabContainer) {
    tabContainer = this.checkForValidTabContainer(tabContainer);
    tabContainer.parent('.multitabs-section').removeClass('hidden');
    this.adjustModuleTabContainers();
  },

  /**
   * Destroys a tabs instance and removes it from the queue.
   * NOTE: This only happens if the tabContainer is a part of this instance of Multitabs.
   * @param {jQuery[]} tabContainer the tab container to be destroyed.
   * @returns {void}
   */
  destroyTabsInstance(tabContainer) {
    if (!(tabContainer instanceof $) || !tabContainer.data('tabs') || typeof tabContainer.data('tabs').destroy !== 'function') {
      return;
    }

    const self = this;
    let doRemove = false;

    TAB_CONTAINER_NAMES.forEach((propname) => {
      if (doRemove || !self.tabContainers[propname].is(tabContainer)) {
        return;
      }

      const api = tabContainer.data('tabs');

      delete api.multitabsID;
      tabContainer.removeAttr('data-multitabs');

      api.destroy();
      delete self.tabContainers[propname];
      doRemove = true;
    });

    if (!doRemove) {
      throw new Error('could not destroy a tabContainer because it was not associated with this Multitabs instance');
    }
  },

  /**
   * Detects whether or not a Tab Container is currently hidden
   * @param {jQuery[]|string} tabContainer the tab container to be checked.
   * @returns {boolean} whether or not the tab container is currently hidden.
   */
  isHidden(tabContainer) {
    tabContainer = this.checkForValidTabContainer(tabContainer);
    return tabContainer.parent('.multitabs-section').is('.hidden');
  },

  /**
   * Update this multi-tabs instance with new settings
   * @param {object} [settings] incoming settings.
   * @returns {void}
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
  },

  /**
   * Tears down a Multitabs instance
   * @returns {this} component instance
   */
  teardown() {
    const containers = Object.keys(this.tabContainers);
    containers.forEach((container) => {
      this.destroyTabsInstance(container);
    });

    return this;
  },

  /**
   * Destroys a Multitabs instance
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }

};

export { MultiTabs, COMPONENT_NAME };
