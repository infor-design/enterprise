import { Datagrid, COMPONENT_NAME } from './datagrid';

// Empty Message jQuery wrapper
$.fn.datagrid = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Datagrid(this, settings));
    }
  });
};
