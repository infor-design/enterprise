# Creating a new IDS Component

## Things to Keep In Mind

- See if it can be done with only css.
- be sure to consider and follow [accessibility guidelines](./ACCESSIBILITY.md)

# Steps

- Add `_*.scss` file to sass/controls folder similar to current examples
- Add new entry for new file in `_controls.scss`
- Add any variables in `_config.scss`
- Add a view like current examples to `views/controls/`
- Add link to view to `index.html` page
- if Javascript is needed, copy the `template.js` in the `js/controls` folder.
- modify the `gruntfie.js` to add the new script.
- add initializer code to `initialize.js` (should be able to bootstrap the page).
- write the code for the component
- write functional/e2e tests. See [Testing.md](./TESTING.md) for guidelines/instructions.
- make sure all tests pass
- add a `readme.md` file with some basic information about the component.
- run eslint on all the new JS code.
- verify html is valid: <https://addons.mozilla.org/en-US/firefox/addon/html-validator/>
- verify no automated accessibility errors <http://squizlabs.github.io/HTML_CodeSniffer/>
- test your page(s) with Apple VoiceOver <https://www.apple.com/voiceover/info/guide/>
- test your page(s) with Jaws (download <http://www.freedomscientific.com/Downloads/ProductDemos>) <http://www.washington.edu/itconnect/learn/accessible/atc/quickstarts/jaws-2/>
- commit (including issue number) and pull request