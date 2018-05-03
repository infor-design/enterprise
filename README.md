# :tada: Soho XI Has Moved to Github! :tada:

Starting at the end of release `4.6.0`, we moved the Soho XI codebase to Github! What this means is now anyone can view and contribute to the codebase.

There are two ways to go about using Github for development (as the [Bitbucket](http://git.infor.com/projects/SOHO/repos/controls/browse) will eventually be deprecated):

1. You can go to https://github.com/infor-design/enterprise and download/clone/fork the repo.

or

2. If you already have our codebase locally, you can simply [change your remote's url](https://help.github.com/articles/changing-a-remote-s-url) to point to the new repository on Github.


# Welcome to Soho XI

SoHo XI provides comprehensive tools for product development teams to create use experiences that are: Intuitive, Engaging, Purposeful, Relevant Functional and Beautiful.

The SoHo XI Component library is a framework independent UI (js and css) library that is pattern focused, template driven, touch enabled, responsive, accessible and themable.

For guidelines on when and where to use the controls see the [Soho Style Guide](http://soho.infor.com).

This project is an open source project. If you have a contribution please [submit a pull request](#pull-requests). However, your code must follow our coding guidelines as mentioned in this page and use designs and behavior approved by Hook and Loop.

The sample / demo project is a node project using SASS and Grunt with Grunt Watch and Live Reload to stage a series of examples shown on example and documentation pages.

## Contacting Us and Updates

[Contribution guidelines for this project](CONTRIBUTING.md)


Please use the [JIRA Issue Tracker](http://jira/browse/SOHO) to report all requests, bugs, questions and feature requests.

For release updates see our upcoming and past version in our [Releases road map | http://jira/projects/SOHO?selectedItem=com.atlassian.jira.jira-projects-plugin:release-page].

For updates please joining our MS Teams Group https://teams.microsoft.com/l/team/19%3a2b0c9ce520b0481a9ce115f0ca4a326f%40thread.skype/conversations?groupId=4f50ef7d-e88d-4ccb-98ca-65f26e57fe35&tenantId=457d5685-0467-4d05-b23b-8f817adda47c

## Key Features
* Themes
* Responsive
* Touch
* Retina Ready with SVG icons
* Globalization / internationalization
* Security XSS
* 140 Components

## Upgrading from Previous Versions
https://soho.infor.com/upgrade-guide

## Browser Support

Generally we support R-1 for browsers and OS versions. Which maps out as follows:

![IE](https://cloud.githubusercontent.com/assets/398893/3528325/20373e76-078e-11e4-8e3a-1cb86cf506f0.png)
R-1 = IE Edge and IE11 (including Windows tablets)

![Chrome](https://cloud.githubusercontent.com/assets/398893/3528328/23bc7bc4-078e-11e4-8752-ba2809bf5cce.png)
R-1 - PC and Mac, Android Auto update
Android R-1

![Firefox](https://cloud.githubusercontent.com/assets/398893/3528329/26283ab0-078e-11e4-84d4-db2cf1009953.png)
Pc and Mac (R-1) - Auto update

![Safari](https://cloud.githubusercontent.com/assets/398893/3528331/29df8618-078e-11e4-8e3e-ed8ac738693f.png)
Mac and IOS (not windows) (R-1)

# Running the Development Project

## Manual Install
* (Windows) Install Python >= v2.5.0 & < 3.0.0 : https://www.python.org/downloads/
* Install nodejs as paying attention to your OS directions: http://nodejs.org/
* Install gruntjs: http://gruntjs.com/ by running the command (`npm install -g grunt-cli`)
* On Windows you should run `git config core.autocrlf false`

### Get The Code
* Make a directory (fx 4.4.0)
* Move into your new directory: `cd 4.4.0`
* Clone the repo into that current director `git clone http://git.infor.com/scm/soho/controls.git .`
* Then  `npm install` to install node package dependencies. On mac you may need `sudo npm install` as some packages require elevated permissions.
* Then `npm run install-globals` to install some global packages we use.

### Running The App
* `cd` into project folder fx `cd 4.4.0`
* Run `npx grunt` to compile initial assets
* Run `node server` to start the web server
* Make a new terminal window and cd into project folder and run `npx grunt watch`
* Go to `http://localhost:4000/`
* Note that at this point any changes you make will cause Sass to recomplile and the browser will reload thanks to live reload

### Editor Plugins
* eslint
  - Atom: https://github.com/AtomLinter/linter-eslint
  - Vs Code: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
* editor config
  - Atom: https://github.com/sindresorhus/atom-editorconfig#readme
  - Vs Code: https://github.com/editorconfig/editorconfig-vscode

### Running The Unit Tests

* Run the command: `./node_modules/.bin/intern-client config=test/intern.local.unit`

### Running The Functional Tests
* Make sure selenium-standalone is installed by running `selenium-standalone start` once
* Make sure selenium-standalone is started by running `selenium-standalone start`
* Run the command: `./node_modules/.bin/intern-runner config=test/intern.local.functional`
* NOTE `make` and `grunt` tasks are in the works....

# Getting the Code into your project

## Npm
This node module is hosted on a private repo [npm.infor.com](http://npm.infor.com:4873). To be able to install it in your project you need to tell npm on your system to fetch packages with the '@infor' scope from the correct registry.

Also your project should be initialized with a package.json. This can be done via npm init.

```bash
npm config set @infor:registry=http://npm.infor.com:4873
```

### Installation
Run the following

```bash
npm install --save @infor/sohoxi
```

The files can then be seen in the folder /node_modules/@infor/sohoxi/dist

### Updating/Installing

Run the following to get a latest and stable version.
```bash
npm install --save @infor/sohoxi
```

Run the following to get the bleeding edge development build with no warranty.

```bash
npm install --save @infor/sohoxi@dev
```

Run the following to see the available versions

```bash
npm info @infor/sohoxi dist-tags
```

## Getting from S3 CDN

You can now refer to the scripts and css from a CDN (AWS) the paths would be...
https://dx6yfd7aurvg3.cloudfront.net/sohoxi

There is a dns for this entry https://cdn.hookandloop.infor.com/sohoxi

Sample File Names for 4.3.5:

https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/js/sohoxi.js
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/js/sohoxi.min.js

https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/css/dark-theme.css
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/css/dark-theme.min.css

https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/css/dark-theme.css
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/css/dark-theme.min.css

https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/css/light-theme.css
https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/css/light-theme.min.css

https://cdn.hookandloop.infor.com/sohoxi/4.3.5/dist/svg/svg.html
https://dx6yfd7aurvg3.cloudfront.net/sohoxi/4.3.5/dist/svg/svg-extended.html

Available Versions:
4.3.2, 4.3.3, 4.3.4, 4.3.5

Note:
- There may be a cost involved to using this with Infor's amazon s3 account so keep this in mind when using.


### Documentation

Soho XI's current documentation can be found at http://usalvlhlpool1.infor.com/4.3.5/components
Are at http://localhost:4000/components when running the project. To contribute you can edit the .md files for a component or the js file for inline settings and events.
