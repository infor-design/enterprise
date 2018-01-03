import { utils } from '../utils/utils';
import { ListView, COMPONENT_NAME } from './listview';

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
    const instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ListView(this, settings));
    }
  });
};
