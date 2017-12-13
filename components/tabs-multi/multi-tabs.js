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
   * DEPENDENCIES:
   *
   * utils
   *
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
   *
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
     *
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

        if (!tabContainer.data('tabs')) {
          tabContainer.tabs();
        }

        self.tabContainers[propname] = tabContainer;
        didAdd = true;
      });

      if (!didAdd) {
        throw new Error('all tab-container slots in MultiTabs component are taken, so a new tabs container was not invoked and stored');
      }
    },


    /**
     * @param {jQuery[]} tabContainer
     */
    destroyTabsInstance: function(tabContainer) {
      if (!(tabContainer instanceof $) || !tabContainer.data('tabs') || typeof tabContainer.data('tabs').destroy === 'function') {
        return;
      }
      tabContainer.data('tabs').destroy();
    },


    /**
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
          delete this.tabContainers[container];
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
