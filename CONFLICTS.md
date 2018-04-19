# List of `git mv` commands run to move

```
# Baseline images to test
$ git mv baseline test/baseline

# Scripts
$ mkdir scripts
$ git mv bin/** scripts
$ git mv build/** scripts

# Demoapp/Webroot
$ mkdir demoapp/www
$ mkdir demoapp/src
$ git mv public/** demoapp/www
$ git mv demoapp/js demoapp/src/js
$ git mv views demoapp

# Source code (JS)
$ mkdir src
$ mkdir src/core
$ mkdir src/patterns
$ git mv components src/components
$ git mv src/components/utils src/utils
$ git mv src/components/includes demoapp/views
$ git mv src/components/list-detail src/patterns/

# Sass
$ git mv sass/demo demoapp/src/sass
$ git mv sass/demo.scss demoapp/src/index.scss
$ git mv sass/layouts src/
$ git mv sass/patterns/** src/patterns
$ git mv sass/patterns/_list-detail.scss src/patterns/list-detail/
$ git mv sass/patterns/_step-process.scss src/patterns/stepprocess/_stepprocess.scss
$ git mv sass/_config.scss src/core/_config.scss
$ git mv sass/_controls.scss src/core/_controls.scss
$ git mv sass/_mixins.scss src/core/_mixins.scss
$ git mv sass/_reset.scss src/core/_reset.scss
$ git mv sass/dark-theme.scss src/dark-theme.scss
$ git mv sass/high-contrast-theme.scss src/high-contrast-theme.scss
$ git mv sass/light-theme.scss src/light-theme.scss
$ git mv sass/site.scss src/site.scss (? not sure if this needs maintaining)

# TODO: `/sass` -> disperse throughout `src/**/`
# TODO: `/specs` -> add as documentation to `src/components/**/` (?)
# TODO: move all `spec/functional` folders into the corresponding `test/components/**` folders

# Remove unused dirs
$ rmdir bin
$ rmdir build
$ rmdir public
$ rm -rf sass
$ rm -rf images
$ rm -rf license (?)

#!/bin/bash
# One-time use bash script for moving all "*.html" files from all `src/components` folders
# to their `demoapp/views/components` counterparts.
# NOTE: make the script executable, and run it from the project root
components=$(find src/components/* -type d -maxdepth 1 | cut -d'/' -f3-)
for component in $components
do
  demoappdir="demoapp/views/components/$component";
  srcfiles="src/components/$component/*.html";
  (echo "$component\n" && mkdir $demoappdir && git mv --dry-run $srcfiles $demoappdir);
done

# rename `demoapp` to `app`
$ mkdir app
$ git mv demoapp app

# move weird utils/libs
$ git mv src/generic-jquery.js src/utils/generic-jquery.js
$ mkdir lib && git mv src/sohoxi-migrate-4.4.0.js lib/sohoxi-migrate-4.4.0.js
$ git mv specs/DATAGRID.md src/components/datagrid/test-cases.md
$ rmdir specs

#!/bin/bash
# One-time use bash script for moving all "src/component/[componentName]/[componentName].md" files
# to their "src/component/[componentName]/readme.md"
# NOTE: make the script executable, and run it from the project root
components=$(find src/components/* -type d -maxdepth 1 | cut -d'/' -f3-)
for component in $components
do
  componentDir="src/components/$component/";
  srcfile="$componentDir/$component.md";
  targetfile="$componentDir/readme.md";
  (echo "$component\n" && git mv --dry-run $srcfile $targetfile);
done

```

# Possible Merge Conflicts

Conversion from the old to new file structure could have conflicts in the following files:

- `src/components/popupmenu/functional/popupmenu.functional-spec.js` - had to adjust the import for `browserStackErrorReporter` to be one folder higher.  Same for:
  - `src/components/treemap/spec/treemap-api.spec.js`
  - `src/components/multiselect/functional/multiselect.functional-spec.js`
  - `src/components/dropdown/functional/dropdown.functional-spec.js`

# Other stuff we need to do:

- fix ESLint (mostly different paths)
- re-enable "lint-staged" pre-commit hook in "package.json" (turned off for file move without eslint fix)
- update `src/index.js` with correct paths
- update entry points in `src/_controls` to reflect new paths:
  - `sass/patterns/_list-detail.scss` -> `src/patterns/list-detail/`
  - `sass/patterns/_step-process.scss` -> `src/patterns/stepprocess/_stepprocess.scss`
  - others?
- update `rollup.config.js` with correct paths
- update `demoapp/app.js` with correct paths to moved tooling/data/views/etc
- make separate build process for `demoapp/src/main.scss` (only contains styles that should be present in the demoapp)
