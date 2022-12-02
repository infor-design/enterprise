import getJunkDropdownData from '../get-junk-dropdown-data.js';

// Simple Middleware that passes API data back as a template option if we're on a certain page
export default function () {
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
}
