import { Trackdirty, COMPONENT_NAME } from './trackdirty';

/**
 * jQuery Component Wrapper for TrackDirty
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.trackdirty = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance && instance instanceof Trackdirty) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Trackdirty(this, settings));
    }
  });
};
