# Infor Design System's Enterprise Components

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://badge.fury.io/js/ids-enterprise.svg)](https://badge.fury.io/js/ids-enterprise)
[![Build Status](https://travis-ci.com/infor-design/enterprise.svg?branch=master)](https://travis-ci.com/infor-design/enterprise)
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

We support the latest release and the release previous to the latest (R-1) for browsers and OS versions:

<!-- markdownlint-disable MD013 MD033 -->
| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| R-1| R-1| R-1| R-1
<!-- markdownlint-enable MD013 MD033 -->

## How to use IDS in your project

### npmjs

To install, run:

```
$ npm install --save ids-enterprise
```

The files can then be seen in the folder `./node_modules/ids-enterprise/dist`

### CDN

You can now get the scripts and CSS from a CDN on AWS. For example, the paths for the 4.9.0 releases would be:

```html
https://cdn.hookandloop.infor.com/sohoxi/4.9.0/js/sohoxi.js
https://cdn.hookandloop.infor.com/sohoxi/4.9.0/js/sohoxi.min.js
https://cdn.hookandloop.infor.com/sohoxi/4.9.0/css/dark-theme.css
https://cdn.hookandloop.infor.com/sohoxi/4.9.0/css/dark-theme.min.css
https://cdn.hookandloop.infor.com/sohoxi/4.9.0/css/dark-theme.css
https://cdn.hookandloop.infor.com/sohoxi/4.9.0/css/dark-theme.min.css
https://cdn.hookandloop.infor.com/sohoxi/4.9.0/css/light-theme.css
https://cdn.hookandloop.infor.com/sohoxi/4.9.0/css/light-theme.min.css
https://cdn.hookandloop.infor.com/sohoxi/4.9.0/svg/svg.html
https://cdn.hookandloop.infor.com/sohoxi/4.9.0/svg/svg-extended.html
```

Versions available on CDN are: 4.3.2, 4.3.3, 4.3.4, 4.3.5, 4.7.0, 4.8.0, 4.9.0, and 4.10.0

**Note:** There may be a cost involved to using this with Infor's Amazon S3 account.  Please keep this in mind when using the library this way.

## Documentation

- [Latest Release Docs](https://design.infor.com/code/ids-enterprise/latest)
- [How to build the documentation from source](docs/DEVELOPER.md#basic-commands)

## Contributing

This project is an open source project. Please see the [contribution guidelines for this project](docs/CONTRIBUTING.md).

- Use [Github Issues](https://github.com/infor-design/enterprise/issues) to report all requests, bugs, questions, and feature requests.
- [Review source code changes](https://github.com/infor-design/enterprise/pulls)
- [Releases, previous and upcoming](https://github.com/infor-design/enterprise/releases).
- [Microsoft Teams Group](https://teams.microsoft.com/l/team/19%3a2b0c9ce520b0481a9ce115f0ca4a326f%40thread.skype/conversations?groupId=4f50ef7d-e88d-4ccb-98ca-65f26e57fe35&tenantId=457d5685-0467-4d05-b23b-8f817adda47c) (Infor Employees only).
