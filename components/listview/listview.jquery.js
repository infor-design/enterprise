import { utils } from '../utils/utils';
import { ListView, PLUGIN_NAME } from './listview';


/**
 * jQuery Component Wrapper for Listview
 */
$.fn.listview = function(settings) {

  /**
   * NOTE: Much of this is here for backwards-compatibility reasons.  In the future we need to
   * make sure these enhancements make it to the components.
   */
  var cs = $(this),
    attr = cs.attr('data-dataset'),
    tmpl = cs.attr('data-tmpl'),
    options = Soho.utils.parseOptions(this) || {};

  options.dataset = options.dataset || attr;
  options.template = options.template || tmpl;

  if (window[options.dataset]) {
    options.dataset = window[options.dataset];
  }
  if (options.template && options.template.length) {
    options.template = $('#' + options.template).html();
  }

  settings = utils.extend({}, settings, options);

  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new ListView(this, settings));
    }
  });
};
