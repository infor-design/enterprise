/**
 * Generic jQuery Component Wrapper that can be used instead of individually defining
 * each component wrapper.
 * @param {string} componentName usually populated with each component's COMPONENT_NAME definition
 * @param {function} ComponentConstructor the constructor function representing a Soho Component
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} the element(s) being acted on
 */
function genericjQueryComponentWrapper(componentName, ComponentConstructor, settings) {
  return this.each(function () {
    let instance = $.data(this, componentName);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, componentName, new ComponentConstructor(this, settings));
    }
  });
}

export default genericjQueryComponentWrapper;
