import { SearchField, COMPONENT_NAME } from './searchfield';

/**
 * jQuery Component Wrapper for SearchField
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.searchfield = function (settings) {
  if (!settings) {
    settings = {};
  }

  // Initialize the plugin (Once)
  return this.each(function () {
    // Detect if we're inside of a Toolbar and invoke Toolbar Searchfield first, if applicable.
    // Added for SOHO-6448.
    // NOTE: If we merge the searchfield/toolbarsearchfield apis, revisit this solution.
    const sf = $(this);
    const toolbarParent = sf.parents('.toolbar');

    if (toolbarParent.length && !settings.noToolbarSearchfieldInvoke) {
      const tbsf = sf.data('toolbarsearchfield');
      if (!tbsf) {
        sf.toolbarsearchfield(settings);
        return;
      }
      tbsf.updated(settings);
    }

    // Normal invoke setup
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new SearchField(this, settings));
    }
  });
};
