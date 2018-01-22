import { Bullet, COMPONENT_NAME as BULLET_NAME } from '../bullet/bullet';

/*
* jQuery Component Wrapper for Charts. It maps the singlular components
* to the previous versions single jquery wrapper.
* @param  {[type]} settings The settings to apply.
* @returns {object} The jquery object for chaining.
*/
$.fn.chart = function (settings) {
  return this.each(function () {
    let instance = $.data(this, BULLET_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, BULLET_NAME, new Bullet(this, settings));
    }
  });
};
