// Simple plugin for rollup that detects the existence of JSDoc @deprecated comments
// and pumps them into the console during the build process.
const EMPTY_MAP = {
  mappings: ''
};

const transform = function (code, id) {
  // `code` is the actual code.
  // If we wanted to get documentation from a file here, we would need to pass
  // the filename to documentationJs.
  // TODO: figure this out.
  debugger;

  return {
    code,
    map: EMPTY_MAP
  };
};

const plugin = function () {
  debugger;

  return {
    name: 'deprecation-notice',
    transform
  };
};

module.exports = plugin;
