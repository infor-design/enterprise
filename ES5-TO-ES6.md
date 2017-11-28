# ES5 to ES6 Conversion Project

*Related JIRA Ticket: [SOHO-6976](https://jira.infor.com/browse/SOHO-6976)*

We are migrating the Soho codebase to an ES6-based project.  Major reasons include:
- Easier maintenance for Soho developers by way of smaller, separate components.
- Clearer definition of dependencies between components.
- (eventual) Deprecation of external dependency-mapping tools.
- (eventual) ability to more easily construct custom builds of Soho.

# Path to changes from ES5 to ES6

- Introduce ES6 import/export syntax for all Soho Component Modules.
- Break up components/behaviors/utils more logically.
- (optional?) separate jQuery component definitions from standard JS constructors?

# Current Status

Last updated:  *Nov 28, 2017*

- Utility functions / environment / some behaviors have been converted to ES6.
- global `Soho` object is in-tact.
- Locale is in a quasi-working state:
  - Currently working because its been re-located to `Soho.Locale` to become bundled.  It may need to stay here so that we can properly have other components depend on it via `import` syntax.
  - Cultures system needs to be looked at because it works synchronously, but we may need to come up with a better way to do async scripts (Promise-based?)
