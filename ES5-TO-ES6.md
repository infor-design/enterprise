# ES5 to ES6 Conversion Project

*Related JIRA Ticket: [SOHO-6976](https://jira.infor.com/browse/SOHO-6976)*

We are migrating the Soho codebase to an ES6-based project.  Major reasons include:
- Easier maintenance for Soho developers by way of smaller, separate components.
- Clearer definition of dependencies between components.
- (eventual) Deprecation of external dependency-mapping tools.
- (eventual) ability to more easily construct custom builds of Soho.
- Better testability

# Path to changes from ES5 to ES6

- Introduce ES6 import/export syntax for all Soho Component Modules.
- Break up components/behaviors/utils more logically.
- (optional?) separate jQuery component definitions from standard JS constructors?

# Current Status

Last updated:  *December 21, 2017*

See the file [`<project root>/components/index.js`](./components/index.js) to see which Soho components are currently being bundled.  There's also a human-readable list being maintained by [Ed Coyle](mailto:ed.coyle@infor.com) located [here](./ES6-CONVERTED.md).

## Development Environment Changes

- If pulling this branch down for the first time, a few preliminary steps need to be taken before builds can compile:
  - a fresh run of `$ npm install` should be performed.
  - it may be necessary to use `$ npm install -g rollup` to get the [Rollup](https://github.com/rollup/rollup) bundler to be usable via terminal.
  - the demoapp's `app.js` has been modified to no-longer duplicate files to the `/public` folder in this project, and will instead serve compiled JS/CSS files directly from `/dist`.  Because of this, if you have JS/CSS files in `/public`, they will be served instead of the compiled JS/CSS files from `/dist`, and you'll never see any changes.  You must manually remove any JS/CSS/map files from `/public` before starting the server.
- `$ grunt` will now run `rollup -c` instead of the old build process.
- `$ grunt` no longer attempts to clean the `/public` folder.
- Rollup is completely managing the addition of the software license and any build meta-data to the final `sohoxi.js` bundle.  This code cut is no longer using any of the grunt revision, banner, etc stuff.  There's an additional file being used in `<project root>/build/generate-build-banner.js` that is grabbing all the necessary stuff and spitting out the text content that Rollup is using for the banner.
- Began Switching to ESLint from JSHint.  In `.eslintrc.js`, truly "extended" airbnb eslint configs per Hook & Loop guidelines. about.js, colorpicker.js and template.js are fully linting.

#### TODO for the Dev environment:

- Continue cleaning up `gruntfile.js` to remove any unnecessary duplicate code/tasks that Rollup's responsible for.
- Create a route in the demoapp for tests that demonstrate asynchronous loading of ES6 modules (the idea being that some of these lower-level components will stand on their own with a small Soho "core").
- Fix the unit tests and functional tests
- Test and confirm the document generator is working

## `sohoxi.js` Deliverable Changes

- Utility functions / environment / some behaviors have been converted to ES6.
- global `Soho` object is in-tact.
- Locale is in a quasi-working state:
  - Currently working because its been re-located to `Soho.Locale` to become bundled.  It may need to stay here so that we can properly have other components depend on it via `import` syntax.
  - Cultures system needs to be looked at because it works synchronously, but we may need to come up with a better way to do async scripts (Promise-based?)
- Added a handful of low-level components (see [`<project root>/components/components.js`](./components/components.js) for the list of currently-available components after build time)
- Modifications to the desired component lifecycle
  - Remove as much "setting of options" from the jQuery component wrappers as possible, in favor of working them directly into Vanilla JS constructors.  See [ES6-SETTINGS-CHANGES.md](./ES6-SETTINGS-CHANGES.md) for more details about this change.
    - Each component's constructor should set `this.settings` on its own.
    - the jQuery wrappers' path for "when instance exists" should pass incoming options to the Vanilla JS component's `updated()` method (ex: `instance.updated(settings)`)
    - component `updated()` methods should understand how to deal with setting incoming options over top of existing options and sanitizing the incoming options (sanitizing process may need to be a utility function).
    - should also take advantage of `utils.parseOptions` to take HTML-based options into account.  Need to figure out whether or not DOM or JS-based options take precedence (as of now, DOM-based options take precedence over JS options in most cases, but it's not 100% done that way throughout)
- Standardized our usage of "settings" and "options" to simply go with "settings", in the ES6 components that have already been converted. (see  [`<project root>/components/components.js`](./components/components.js) for the list of currently-available components after build time)
- Standard, Vanilla-JS Constructors for Soho components are (generally) being separated away from the jQuery component wrappers, into their own files.  This allows:
  - Clear isolation of jQuery-specific code from Vanilla-JS code (not currently perfect, but in-progress and with the goal of eventually 100% separating them).
  - Inclusion of jQuery components only by larger components that need them.

#### TODO for the JS deliverable:

- Figure out the final location of Locale
- Figure out if there's a better way to do async loading of culture files (promises?)
- Get all "building-block"-level components standing on their own in ES6.
  - Break the actual constructors/prototype defs out from inside the jQuery wrappers.
  - Still invoke the jQuery wrappers within each `<component>.js` file, but allow the Vanilla JS constructors to stand on their own.
  - (eventually) figure out a Vanilla-JS, stand-alone replacement for `$.data()` for element-level Soho component access.

## REALLY need to fix before we release:
- Listview Component using external sources (both server and client-side) don't currently work (having trouble debugging).

## Additions to 4.4.x/5.x related to the upgrade:

- A [`sohoxi.migrate-x.x.x.js`](./components/sohoxi-migrate-4.4.0.js) file has been introduced in the `/components` folder (eventually being passed into the `/dist/js` folder).  Its purpose is to help alleviate breakage when upgrading to this major version.  It should only be used as a temporary means of keeping your application working.  It's preferable to upgrade your application code and remove this file as quickly as possible.

# How to migrate a Soho Xi component from ES5 to ES6:

- Remove the AMD scaffolding from the component.
- Hoist the Vanilla-JS component's constructor, prototype definition, and any "default settings" objects out from the jQuery component wrapper, and place them in the root of the JS file.
- Change `pluginName` to `COMPONENT_NAME` (global namespace) and hoist this to the root as well.  Prefix with `const` instead of `var`.  Change any references from the original `pluginName` to `COMPONENT_NAME` (ctrl+f).
- Change the default settings (`defaults`) to `<COMPONENT_NAME>_DEFAULTS`. Prefix with `const` instead of `var`.
- Change any instances of the word "options" to "settings", where settings need to be propagated to a component's instance.
- If there are jQuery wrappers in this component, make sure they are not doing any special handling of incoming options.  We are attempting to make the jQuery component wrappers as "dumb" as possible, meaning that any parsing of options should be completely handled by a component's Vanilla-JS constructor, as well as its internal `updated()` API method.  See any of the pre-converted components (specifically the constructors and `updated()`) to see how we deal with managing settings internally.
- Look for any instances of calling the Soho object directly, as well as any direct calls to constructors belonging to components or behaviors (like `Soho.components.Button` or `Soho.behaviors.hideFocus`).  If this component needs a utility function of any kind, or invokes a Soho component directly, use an ES6 import at the top of the file to call the imported function/constructor/whatever directly instead (fx: `import { Button } from '../button/button';` or `import '../button/button.jquery';`).
- Make sure that the Prototype of the component you're working on is exported, along with the name of the plugin file (fx: `export { MyComponent, COMPONENT_NAME };`).
- If the component in question needs a jQuery component wrapper, create one or move the existing one to a separate file called `mycomponent.jquery.js`.  Move the jQuery wrapper from the original component's file into this file.  No need to export anything - these files are meant to be void.
- Include the new files in the entry points:
  - new Utility files or items that are "core" and needed everywhere belong in `<project-root>/components/index.js`.  Files that are included here may need to be directly exported.
  - regular Vanilla-JS files go in [`<project-root>/components/components.js`](./components/components.js).  The `components` object should directly export any files included here.
  - jQuery components go in [`<project-root>/components/components.jquery.js`](./components/components.jquery.js).  These files simply need to be included and not re-exported.
- Optional for now but nice. If using atom run eslint-fix and fix some of the lint errors. If doable fix all the lint errors you can.
