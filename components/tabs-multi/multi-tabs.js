/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  /**
   * Notes for v4.4.0:
   * DEPENDENCIES:
   *
   * utils
   * Tabs.jquery
   */


  /**
   * Component Name
   */
  var PLUGIN_NAME = 'multitabs';


  /**
   * Default Settings for MultiTabs
   * @param {Array<HTMLElement>} tabContainers
   */
  var MULTITABS_DEFAULTS = {
    tabContainers: []
  };


  /**
   * Pre-defined names used internally for tab containers
   */
  var TAB_CONTAINER_NAMES = ['primary', 'secondary', 'tertiary'];


  /**
   * @class MultiTabs
   *
   * Scaffolding for containment of multiple, associated tabs containers.
   * @param {jQuery[]|HTMLElement} element
   * @param {Object} [settings]
   * @return {MultiTabs}
   */
  function MultiTabs(element, settings) {
    this.element = $(element);
    this.settings = $.extend({}, MULTITABS_DEFAULTS, settings);

    // internal stuff
    this.tabContainers = {};

    return this.init();
  }


  MultiTabs.prototype = {

    /**
     * @private
     * Extra initializing steps
     */
    init: function() {
      var self = this,
        tabContainers = [];

      if (this.settings.tabContainers instanceof Array && this.settings.tabContainers.length) {
        tabContainers = this.settings.tabContainers;
      } else {
        tabContainers = this.element.find('.tab-container').filter(function() {
          return !$(this).parents('.tab-panel-container').length;
        });
      }

      $(tabContainers).each(function() {
        self.setupTabsInstance($(this));
      });
    },


    /**
     * Builds and stores an instance of a Tabs component.
     * @param {jQuery[]} tabContainer
     */
    setupTabsInstance: function(tabContainer) {
      if (!(tabContainer instanceof $)) {
        return;
      }

      var self = this,
        didAdd = false;

      TAB_CONTAINER_NAMES.forEach(function(propname) {
        if (didAdd || self.tabContainers.hasOwnProperty(propname)) {
          return;
        }

        var api = tabContainer.data('tabs');
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
     * @param {String} tabContainerName
     * @param {String} tabId - (directly passed into the Tabs `add` method)
     * @param {Object} options - (directly passed into the Tabs `add` method)
     * @param {Number} [atIndex] - (directly passed into the Tabs `add` method)
     * @returns {Tabs}
     */
    add: function(tabContainerName, tabId, options, atIndex) {
      if (!this.tabContainers[tabContainerName]) {
        throw new Error('cannot add any tabs to tabContainer "'+ tabContainerName +'" because it doesn\'t exist.');
      }

      var api = this.tabContainers[tabContainerName].data('tabs');
      return api.add(tabId, options, atIndex);
    },


    /**
     * Pass-through method for removing tabs that takes the container into account.
     * @param {String} tabContainerName
     * @param {String} tabId - (directly passed into the Tabs `add` method)
     * @param {boolean} [disableBeforeClose] - (directly passed into the Tabs `add` method)
     * @returns {Tabs}
     */
    remove: function(tabContainerName, tabId, disableBeforeClose) {
      if (!this.tabContainers[tabContainerName]) {
        throw new Error('cannot remove any tabs from tabContainer "'+ tabContainerName +'" because it doesn\'t exist.');
      }

      var api = this.tabContainers[tabContainerName].data('tabs');
      return api.remove(tabId, disableBeforeClose);
    },


    /**
     * Finds an existing Tab Panel in any of the tab containers, and moves it to a designated target tab container.
     * @param {String} tabId
     * @param {String} targetTabContainerName
     * @param {boolean} [doActivate]
     */
    move: function(tabId, targetTabContainerName, doActivate) {
      if (!tabId || !targetTabContainerName) {
        throw new Error('can\'t move a tab without both a tabId and a targetTabContainerName');
      }

      var tabMarkup,
        panelMarkup,
        allTabContainers = this._getFilterableTabContainers(),
        originalTabContainer,
        originalTabContainerName,
        targetTabContainer = this._getTabContainer(targetTabContainerName);

      if (!targetTabContainer) {
        throw new Error('No tab containers currently exist against targetTabContainerName "'+ targetTabContainerName +'"');
      }

      allTabContainers.each(function() {
        var api = $(this).data('tabs'),
          tab = api.getTab(null, tabId);

        // No tabs exist by this id
        if (tab === null) {
          return;
        }

        originalTabContainer = $(this);
        originalTabContainerName = api.multitabsID;
        tabMarkup = tab.clone();
        panelMarkup = api.getPanel(tabId).children();
      });

      if (!tabMarkup) {
        throw new Error('No tab markup was found in any Multitabs container for href "'+ tabId +'"');
      }

      this.remove(originalTabContainerName, tabId);
      this.add(targetTabContainerName, tabId, {
        name: tabMarkup.children('a').text().trim(),
        content: panelMarkup,
        doActivate: doActivate
      }); // TODO: test atIndex
    },


    /**
     * @private
     * Uses the internal name of the tab container to either get a reference to an existing Tab container, or a null reference.
     * @param {String} name - the internal name used for this tabs instance
     * @returns {jQuery[]|undefined}
     */
    _getTabContainer: function(name) {
      var self = this,
        ref;

      TAB_CONTAINER_NAMES.forEach(function(propname) {
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
     * @private
     * Gets all currently-setup tab containers in a jQuery selector.
     * @returns {jQuery[]}
     */
    _getFilterableTabContainers: function() {
      var self = this,
        ret = $();
      TAB_CONTAINER_NAMES.forEach(function(propname) {
        var container = self.tabContainers[propname];
        if (container) {
          ret = ret.add(container);
        }
      });
      return ret;
    },


    /**
     * Destroys a tabs instance and removes it from the queue.
     * NOTE: This only happens if the tabContainer is a part of this instance of Multitabs.
     * @param {jQuery[]} tabContainer
     */
    destroyTabsInstance: function(tabContainer) {
      if (!(tabContainer instanceof $) || !tabContainer.data('tabs') || typeof tabContainer.data('tabs').destroy !== 'function') {
        return;
      }

      var self = this,
        doRemove = false;
      TAB_CONTAINER_NAMES.forEach(function(propname) {
        if (doRemove || !self.tabContainers[propname].is(tabContainer)) {
          return;
        }

        var api = tabContainer.data('tabs');

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
     * Update this multi-tabs instance with new settings
     * @param {Object} settings
     */
    updated: function(settings) {
      if (settings) {
        this.settings = $.extend({}, this.settings, settings);
      }
    },


    /**
     *
     */
    teardown: function() {
      for (var container in this.tabContainers) {
        if (this.tabContainers.hasOwnProperty(container)) {
          this.destroyTabsInstance(container);
        }
      }

      return this;
    },


    /**
     *
     */
    destroy: function() {
      this.teardown();
      $.removeData(this.element[0], PLUGIN_NAME);
    }

  };


  /**
   * jQuery Component Wrapper for MultiTabs
   */
  $.fn.multitabs = function(settings) {
    return this.each(function() {
      var instance = $.data(this, PLUGIN_NAME);
      if (instance) {
        instance.updated(settings);
      } else {
        instance = $.data(this, PLUGIN_NAME, new MultiTabs(this, settings));
      }
    });
  };


  /**
   * Store instance against Soho object.
   */
  window.Soho = window.Soho || {};
  window.Soho.components = window.Soho.components || {};
  window.Soho.components.MultiTabs = MultiTabs;


/* start-amd-strip-block */
}));
/* end-amd-strip-block */
