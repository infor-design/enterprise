# Infor Design System's Enterprise Components

[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=MmgvZ2tsa3pydTRlTklvNG9HZGYvMVlwdWRzWklWVWtXNEFFeVJXSG1raz0tLTZuR0J1Nllxd1pOTVJKaE4zRFVYUkE9PQ==--628ff7dc2ecde8982f3a89ad70cdcf252bdd8fba)](https://www.browserstack.com/automate/public-build/MmgvZ2tsa3pydTRlTklvNG9HZGYvMVlwdWRzWklWVWtXNEFFeVJXSG1raz0tLTZuR0J1Nllxd1pOTVJKaE4zRFVYUkE9PQ==--628ff7dc2ecde8982f3a89ad70cdcf252bdd8fba)

Infor Design System's Enterprise component library is a framework-independent UI library consisting of CSS and JS that provides Infor product development teams, partners, and customers the tools to create user experiences that are approachable, focused, relevant, perceptive.

For guidelines on when and where to use the components see the [design.infor.com](http://design.infor.com).

## Key Features

- Themes
- Responsive
- Touch
- Retina Ready with SVG icons
- Globalization / internationalization
- Security XSS
- 140 Components

## Browser Support

We support the latest release and the release previous to the latest (R-1) for browsers and OS versions. Which maps out as follows:
<!-- markdownlint-disable MD013 MD033 -->
| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari |
<!-- markdownlint-enable MD013 MD033 -->

| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| R-1| R-1| R-1| R-1

## Getting the code into your project

### npmjs

To install, run:

```bash
npm install --save ids-enterprise
```

The files can then be seen in the folder `./node_modules/ids-enterprise/dist`

### CDN

You can now get the scripts and CSS from a CDN on AWS. For example, the paths for the 4.3.5 releases would be:

```html
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/js/sohoxi.js
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/js/sohoxi.min.js
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/css/dark-theme.css
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/css/dark-theme.min.css
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/css/dark-theme.css
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/css/dark-theme.min.css
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/css/light-theme.css
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/css/light-theme.min.css
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/svg/svg.html
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/svg/svg-extended.html
```

Versions available on CDN are: 4.3.2, 4.3.3, 4.3.4, 4.3.5

Note: There may be a cost involved to using this with Infor's amazon s3 account so keep this in mind when using.

## Running the development project

### Install pre-requisites

- Install `node` for following the [directions for your OS](http://nodejs.org/)
- On Windows, you'll need to [install Python](https://www.python.org/downloads/). Make sure the version is at least `2.5.0` but not Python 3.
- Also on Windows, you should run `git config core.autocrlf false`

### Clone the repo

- Clone the repo using `git`: `git clone https://github.com/infor-design/enterprise.git`
- `cd` into the repo directory

### Running the app

From within the project folder:

- Run `npm start` to build and start the web server
- Make a new terminal window and from within your project folder run `npx grunt watch` to watch for any file changes and rebuild
- Open up [`localhost:4000`](http://localhost:4000) in a browser to see the local app

Note that at this point any changes you make will cause SASS to recompile and the browser will reload.

You’ll see documentation pages unless they aren’t generated, then you’ll see the demos and directory lists only.  You can optionally run `npm run documentation` to see the full component documentation.

### Running the tests

Functional tests are the primary way we test the codebase. To run the tests, run `npm run functional:local`.

### Editor Plugins

This project uses `eslint` and `editorconfig`. You may want to add the following plugins to your editor to help comply with our coding standards: `eslint` for [Atom](https://github.com/AtomLinter/linter-eslint) and [VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), as well as `editorconfig` for [Atom](https://github.com/sindresorhus/atom-editorconfig#readme) and [VS Code](https://github.com/editorconfig/editorconfig-vscode)

## Documentation

Soho XI's current documentation can be found at [design.infor.com/code/ids-enterprise/latest](https://design.infor.com/code/ids-enterprise/latest).

You can also find a subset of documentation at [`localhost:4000/components`](http://localhost:4000/components) when running the project locally. To contribute you can edit the `readme.md` files for a component or add [JSDocs](http://usejsdoc.org/) comments to the source files for inline settings and events.

## Contacting Us and Updates

This project is an open source project. Please see the [contribution guidelines for this project](docs/CONTRIBUTING.md).

Please use the internal Infor [Jira issue tracker](http://jira.infor.com/browse/SOHO) to report all requests, bugs, questions, and feature requests.

For release updates see our upcoming and past version in our [releases road map](http://jira.infor.com/projects/SOHO?selectedItem=com.atlassian.jira.jira-projects-plugin:release-page).

If you're an Infor employee, you can join our [MS Teams Group](https://teams.microsoft.com/l/team/19%3a2b0c9ce520b0481a9ce115f0ca4a326f%40thread.skype/conversations?groupId=4f50ef7d-e88d-4ccb-98ca-65f26e57fe35&tenantId=457d5685-0467-4d05-b23b-8f817adda47c) for updates.
