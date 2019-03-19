/**
 * Safely gets the name of a method
 * @param {function|string} method the method to be checked (or method name to be reported)
 * @returns {string} the name of the method
 */
function methodName(method) {
  if (typeof method !== 'function') {
    if (typeof method === 'string') {
      return method;
    }
    throw new Error(`${typeof method} was provided where a function was expected.`);
  }

  // ES6-friendly
  if (typeof method.name === 'string') {
    return `${method.name}()`;
  }

  // Regex for ES5 (IE11)
  // See https://stackoverflow.com/a/17923727/4024149
  const result = /^function\s+([\w$]+)\s*\(/.exec(method.toString());
  return result ? `${result[1]}()` : '(anonymous function)';
}

/**
 * Warns about a deprecated property/method via a console warning
 * @param {function|string} newMethod the new method to call
 * @param {function|string} oldMethod the name of the old method
 * @returns {void}
 */
function warnAboutDeprecation(newMethod, oldMethod) {
  const newMethodName = methodName(newMethod);
  const oldMethodName = methodName(oldMethod);

  if (typeof console !== 'object') {
    return;
  }
  console.warn(`IDS Enterprise: "${oldMethodName}" is deprecated. Please use "${newMethodName}" instead.`);
}

/**
 * Deprecates a method in the codebase
 * @param {function} newMethod the new method to call
 * @param {function} oldMethod the name of the old method
 * @param {...object} [args] arguments that will be passed to the new function
 * @returns {function} wrapper method
 */
function deprecateMethod(newMethod, oldMethod) {
  const wrapper = function deprecatedMethodWrapper(...args) {
    warnAboutDeprecation(newMethod, oldMethod);
    newMethod.apply(this, args);
  };
  wrapper.prototype = newMethod.prototype;

  return wrapper;
}

export { warnAboutDeprecation, deprecateMethod };
