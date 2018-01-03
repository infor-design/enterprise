import { utils } from '../utils/utils';
import { ListView, COMPONENT_NAME } from './listview';

$.fn.listview = function (settings) {
  /**
   * NOTE: Much of this is here for backwards-compatibility reasons.  In the future we need to
   * make sure these enhancements make it to the components.
   */
  const cs = $(this);
  const attr = cs.attr('data-dataset');
  const tmpl = cs.attr('data-tmpl');
  const inlineOpts = Soho.utils.parseOptions(this) || {};

  inlineOpts.dataset = inlineOpts.dataset || attr;
  inlineOpts.template = inlineOpts.template || tmpl;

  if (window[inlineOpts.dataset]) {
    inlineOpts.dataset = window[inlineOpts.dataset];
  }

  if (inlineOpts.template && inlineOpts.template.length) {
    inlineOpts.template = $(`#${inlineOpts.template}`).html();
  }

  const combinedSettings = utils.extend({}, settings, inlineOpts);

  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(combinedSettings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ListView(this, combinedSettings));
    }
  });
};
