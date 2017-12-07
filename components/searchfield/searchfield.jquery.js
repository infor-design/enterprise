import { SearchField, PLUGIN_NAME } from './searchfield';


$.fn.searchfield = function(settings) {
  'use strict';

  if (!settings) {
    settings = {};
  }

  // Initialize the plugin (Once)
  return this.each(function() {
    // Detect if we're inside of a Toolbar and invoke Toolbar Searchfield first, if applicable.
    // Added for SOHO-6448.
    // NOTE: If we merge the searchfield/toolbarsearchfield apis, revisit this solution.
    var sf = $(this),
      toolbarParent = sf.parents('.toolbar');
    if (toolbarParent.length && !settings.noToolbarSearchfieldInvoke) {
      var tbsf = sf.data('toolbarsearchfield');
      if (!tbsf) {
        return sf.toolbarsearchfield(settings);
      } else {
        tbsf.updated(settings);
      }
    }

    // Normal invoke setup
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new SearchField(this, settings));
    }
  });
};
