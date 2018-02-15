# Welcome to Soho XI

SoHo XI provides comprehensive tools for product development teams to create use experiences that are: Intuitive, Engaging, Purposeful, Relevant Functional and Beautiful.

The SoHo XI Component library is a framework independent UI (js and css) library that is pattern focused, template driven, touch enabled, responsive, accessible and themable.

For guidelines on when and where to use the controls see the [Soho Style Guide](http://soho.infor.com).

This project is an open source project. If you have a contribution please [submit a pull request](#pull-requests). However, your code must follow our coding guidelines as mentioned in this page and use designs and behavior approved by Hook and Loop.

The sample / demo project is a node project using SASS and Grunt with Grunt Watch and Live Reload to stage a series of examples shown on example and documentation pages.

## Contacting Us and Updates

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

### Get The Code
* Make a directory (fx 4.4.0)
* Move into your new directory: `cd 4.4.0`
* Clone the repo into that current director `git clone http://git.infor.com/scm/soho/controls.git .`
* Then  `npm install` to install node package dependencies. On mac you may need `sudo npm install` as some packages require elevated permissions.
* Then  `npm run install-globals` to install some global packages we use.

### Running The App
* `cd` into project folder fx `cd 4.4.0`
* Run `grunt` to compile initial assets
* Run `node server` to start the web server
* Make a new terminal window and cd into project folder and run `grunt watch`
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

# Contributing to Soho XI

So you're interested in giving us a hand? That's awesome! We've put together some brief guidelines that should help you get started quickly and easily.

There are several to get involved, this document covers:

* [raising issues](#raising-issues)
    * [bug reports](#bugs)
    * [feature requests](#features)
    * [change requests](#changes)
* [working on SoHo Xi core](#core)
    * [submitting pull requests](#pull-requests)
* [testing and quality assurance](#testing)
* [writing documentation](#documentation)

<a name="raising-issues"></a>
## Reporting An Issue

If you're about to raise an issue because think you've found a problem, or you'd like to make a request for a new feature in the codebase, or any other reason… please read this first.

The [Jira issue tracker](http://jira.infor.com/browse/SOHO) is the preferred channel for [bug reports](#bugs), [feature requests](#features), [change requests](#changes).

Use Git for [submitting pull requests](#pull-requests), but please respect the following:

* Please **search for existing issues** in JIRA before submitting a pull request. Help us keep duplicate issues to a minimum by checking to see if someone has already reported your problem or requested your idea.

<a name="bugs"></a>
### Bug Reports

A bug is a _demonstrable problem_ that is caused by the code in the repository. Good bug reports are extremely helpful - thank you!

Guidelines for bug reports:

1. **Use the Jira and Git issue search** &mdash; check if the issue has already been
   reported.

2. **Check if the issue has been fixed** &mdash; try to reproduce it using the
   latest `master` or look for [closed issues in the current milestone](http://jira.infor.com/secure/IssueNavigator.jspa?reset=true&jqlQuery=project+%3D+SOHO+AND+status+%3D+Resolved+ORDER+BY+priority+DESC&mode=hide).

3. **Isolate the problem** &mdash; and create a [reduced test case](http://css-tricks.com/6263-reduced-test-cases/) and a live example.

Examples of reduced test cases are:

 - Take an existing example and modify it to resemble the issue, this is ideal as we can include this in our init tests to avoid future breakages.
 - Create an example using a tool like https://jsfiddle.net/ - the soho
   xi scripts can be upload on this site
 - Any Other runnable code.

Spend a little time in recreating and isolating the issue and you might learn and discover the solution.

  **Do not:**
  - Send a video in place of a reduced test case
  - Send a link to your application
  - Just send an image of the source code

If a video is useful to show the problem please use a cross platform format such as MP4 and .webm for the video. We have found https://chrome.google.com/webstore/detail/screencastify-screen-vide/mmeijimgabbpbgpdklnllpncmdofkcpn?hl=en to be useful.

4. Use the Bug Report template below

A good bug report shouldn't leave others needing to chase you up for more information. Be sure to include the details of your environment.

```
Short and descriptive example bug report title

h3. Issue Summary

A summary of the issue and the browser/OS environment in which it occurs. If
suitable, include the steps required to reproduce the bug.

h3. Steps to Reproduce

1. This is the first step
2. This is the second step
3. Further steps, etc.

Any other information you want to share that is relevant to the issue being
reported. Especially, why do you consider this to be a bug? What do you expect to happen instead?

h3. Technical details:

* Script/Css Version: (See Head of the File)
* Client OS: Mac OS X 10.8.4
* Browser: Chrome 29.0.1547.57
```

<a name="features"></a>
### Feature Requests

Feature requests are welcome. Before you submit one be sure to have:

1. Read the [Roadmap and Planned Features](http://jira.infor.com/browse/HFC#selectedTab=com.atlassian.jira.plugin.system.project%3Aroadmap-panel) and check the feature hasn't already been requested.
2. Take a moment to think about whether your idea fits with the scope and aims of the project, or if it might better fit being an app/plugin/extension. Also think if anyone else but your team would want it..
3. Remember, it's up to *you* to make a strong case to convince the merits of this feature. "We did it before" isnt strong enough. Please provide as much detail and context as possible, this means explaining the use case and why it is likely to be common.


<a name="changes"></a>
### Change Requests

Change requests cover both architectural and functional changes to how the controls work. If you have an idea for a new or different dependency, a refactor, or an improvement to a feature, etc  - please be sure to:

1. **Use the Bitbucket and Jira search** and check someone else didn't get there first
2. Take a moment to think about the best way to make a case for, and explain what you're thinking. Are you sure this shouldn't really be a [bug report](#bug-reports) or a [feature request](#feature-requests)? Is it really one idea or is it many? What's the context? What problem are you solving? Why is what you are suggesting better than what's already there? Does it fit with the Roadmap?


<a name="pull-requests"></a>
### Submitting Pull Requests

Pull requests are awesome. If you're looking to raise a PR for something which doesn't have an open issue, please think carefully about [raising an issue](#raising-issues) which your PR can close, especially if you're fixing a bug.

If you'd like to submit a pull request you'll need to do the following:

1. **Fork the SoHo Xi Controls project in Bitbucket.** Navigate to our internal [Bitbucket Git Repository](http://git.infor.com/projects/SOHO/repos/controls) (you may need to contact Tim McConechy to have you added to the Bitbucket Users list).  On the left sidebar at the top, click the button under *Actions* that says *Fork Repository*.  On the screen that follows, make sure *Enable Fork Syncing* is checked, and click *Fork Repository* to create your own remote branch of the SoHo Xi Controls Project.
2. **Clone the Repository on your machine.**  Get a local clone of your newly created remote repository. In Bitbucket, click the *Repositories* dropdown on the top of the window, and find the link with Your Name along side the word *Controls*.  On the page that follows, click the *Clone* link in the left sidebar.  Using the URL provided to [Clone the Respository with Git](http://git-scm.com/docs/git-clone).
3. **Make your changes with the local copy of the code.**
4. **Commit your changes locally.**  Use `git commit -am "[COMMIT MESSAGE]"` and type any related JIRA Ticket numbers into the message to have our build system automatically link your commits to those issues later (For Example "HFC-2105 - Created the project scaffolding needed for adding the SoHo Xi Action Button").  Repeat Steps 3 and 4 as many times as necessary to refine your code.  Please keep in mind our [coding standards](#coding-standards) as you perform these steps.

In your commit message from 4 we use a simple standard like: https://github.com/erlang/otp/wiki/Writing-good-commit-messages

More Examples:

Changed modal to implement the new design - HFC-XXXX

Changed header markup to implement arrow keys treating it as a toolbar - HFC-XXXX

Added api to the list view to add, 'remove, add' functions - HFC-XXXX

Fixed issue in the xyz control as per HFC-XXXX

6. **Pull/Rebase to the latest version of the controls before you submit.**  If enough time passes between your original clone and the completion of your changes, the main repository may have changed and some files you've edited may be out of sync.  To re-sync your remote branch and clone, use the following commands after committing your changes:
  * `git pull`
  * `git rebase`
You may need to merge some files.  Follow your Git client's directions on properly merging the files, and recommit the changes.
6. **Push your changes to your remote repository.**  Use `git push` to push your changes out to your branch on the Bitbucket repository.
7. **Open a pull request.**  Using the Bitbucket website, navigate back to the [Main SoHo Xi Controls repository](http://git.infor.com/projects/SOHO/repos/controls), and click the *Pull Requests* link on the left sidebar.  On the screen that follows, click the *Create a pull request* button. On the next screen, use the drop downs to select the Source/Destination repos (Yours and the Main repo, respectively). Review the files changed underneath, and click "Continue" when ready.  On the screen that follows, you'll be presented with a textbox containing a combination of all your commits for this pull.  Please organize the text accordingly, and list "Tim McConechy" as a reviewer before clicking "Submit".

See additional information here on how to submit a [pull request](https://confluence.atlassian.com/display/Bitbucket/Using+pull+requests+in+Bitbucket)

<a name="testing"></a>
### Testing and Quality Assurance

Never underestimate just how useful quality assurance is. If you're looking to get involved with the code base and don't know where to start, checking out and testing a pull request is one of the most useful things you could do.

If you want to get involved with testing SoHo Xi, there is a set of [QA Documentation](#qa-documentation) on the wiki.

Essentially though, [check out the latest master](http://git.infor.com/projects/GP/repos/gp-controls/branches), take it for a spin, and if you find anything odd, please follow the [bug report guidelines](#bug-reports) and let us know!

<a name="documentation"></a>
### Documentation

Soho XI's current documentation can be found at http://usalvlhlpool1.infor.com/4.3.5/components
Are at http://localhost:4000/components when running the project. To contribute you can edit the .md files for a component or the js file for inline settings and events.
