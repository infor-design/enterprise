import { utils } from '../../utils/utils';
import { Cards, COMPONENT_NAME } from './cards';

/**
 * jQuery Component Wrapper for cards
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.cards = function (settings) {
  const cs = $(this);
  const attr = cs.attr('data-dataset');
  const tmpl = cs.attr('data-tmpl');
  const inlineOpts = utils.parseOptions(this) || {};

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
      instance = $.data(this, COMPONENT_NAME, new Cards(this, combinedSettings));
    }
  });
};
