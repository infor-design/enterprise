# Developer Guide

## Running the development project

### Install pre-requisites

#### Node.js

[<img src="https://img.shields.io/badge/node-%3E%3D%2010.9.0-green.svg"/>](https://nodejs.org/en/);  

All of our build tools run in [Node.JS](https://nodejs.org/en/). We are currently pinned to version 10 of node, **so be sure to use that version**. We have a script that tests for this during `npm install`. You'll also need all the requirements [node-gyp](https://github.com/nodejs/node-gyp#installation) suggests installing for your operating system.

#### Git

Our project uses [Git](https://git-scm.com/) for version control.  Any pull requests made to IDS Enterprise will need to be done in a new branch cut from our latest `master` branch.

### Getting started

Use the following to clone our repo and install dependencies:

```
$ git clone https://github.com/infor-design/enterprise.git
$ cd enterprise
$ npm i
```
#### Basic commands

- `npm start` : builds the IDS library and runs the demo server.  After running this, open a browser to [`localhost:4000`](http://localhost:4000).
- `npm run documentation` : builds a local copy of the documentation for the IDS components based on the source code in this package.  For a copy of the documentation for the latest stable code, see https://design.infor.com/code/ids-enterprise/latest
- `npm run test` : runs [eslint](https://eslint.org/), and IDS's functional and e2e test suites.  Before running this command, make sure to [read our testing documentation](./TESTING.md).

See the `scripts` object in [package.json](../package.json) for a full list of commands.

#### Editor Plugins

This project uses `eslint` and `editorconfig`. You may want to add linting plugins to your editor to help comply with our coding standards:

_For Atom:_
- [ESLint](https://github.com/AtomLinter/linter-eslint)
- [EditorConfig](https://github.com/sindresorhus/atom-editorconfig#readme)

_For VSCode:_
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [EditorConfig](https://github.com/editorconfig/editorconfig-vscode)

## Guidelines for creating a new IDS Component

- See if it can be done with only css.
- Add `_*.scss` file to sass/controls folder similar to current examples
- Add new entry for new file in `_controls.scss`
- Add any variables in `_config.scss`
- Add a view like current examples to `views/controls/`
- Add link to view to `index.html` page
- if Javascript is needed, copy the `template.js` in the `js/controls` folder.
- modify the `gruntfie.js` to add the new script.
- add initializer code to `initialize.js` (should be able to bootstrap the page).
- write the code for the component
- write functional/e2e tests
- make sure all tests pass
- add a `readme.md` file with some basic information about the component.
- run eslint on all the new JS code.
- verify html is valid: <https://addons.mozilla.org/en-US/firefox/addon/html-validator/>
- verify no automated accessibility errors <http://squizlabs.github.io/HTML_CodeSniffer/>
- test your page(s) with Apple VoiceOver <https://www.apple.com/voiceover/info/guide/>
- test your page(s) with Jaws (download <http://www.freedomscientific.com/Downloads/ProductDemos>) <http://www.washington.edu/itconnect/learn/accessible/atc/quickstarts/jaws-2/>
- commit (including issue number) and pull request

## QA Documentation

See [the QA Documentation Checklist](./QA.md).
