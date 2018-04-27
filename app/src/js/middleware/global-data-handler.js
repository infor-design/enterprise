const getJunkDropdownData = require('../get-junk-dropdown-data');

// Simple Middleware that passes API data back as a template option if we're on a certain page
module.exports = function () {
  return function globalDataHandler(req, res, next) {
    const url = req.url;

    function isComponentRoute(componentName) {
      return new RegExp(componentName, 'g').test(url);
    }

    if (isComponentRoute('dropdown')) {
      res.opts.dropdownListData = getJunkDropdownData;
    }

    next();
  };
};
