# TODO Build Script improvements

- [ ] Pass the results of all file creation directly into the build process (separate script?)

- [ ] Convert command line arguments to a list of requested components

- [ ] Fix the blurb "Building the component bundles" in `docs/DEVELOPER.md` that talks about the custom bundler, once the command structure is smoothed out.

- [ ] Scope component requests to the exact name of the file.
  - ex: "tabs" should only include `_tabs.scss` and not `_tabs-vertical.scss`
  - ex: "builder" should only include `_builder.scss` and not `_listbuilder.scss`

- [ ] Sort the order of related components
  - ex: `_tabs.scss` should come before `_tabs-horizontal.scss` (file globber forces "-" to preceed ".")

- [ ] Create a lookup table containing mappings of components to alternate descriptions of the components
  - ex: `vertical tabs`, `tabs vertical`, and `vertical-tabs` should correctly load `_tabs-vertical.scss`
  - ex: `searchfield`, `search field`, and `search input` should correctly load `searchfield.js`, `_searchfield.scss`, and all related stuff.
