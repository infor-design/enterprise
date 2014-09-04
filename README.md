
# Welcome to Soho 2.0

Soho 2.0 is the next generation of Hook and Loop's Html controls for Infor Applications. This version is built from the ground up to be responsive, touch friendly, more flexible and completely accessible. Only the most accessible and responsive controls from the previous set are retained in this new set.

For guidelines on when and where to use the controls see the [Soho Style Guide](http://soho.infor.com).

This project is an open source project. If you have a contribution please [submit a pull request](#pull-requests). However, your code must follow our coding guidelines as mentioned in this page and use designs and behavior approved by Hook and Loop.

The project is a simple node project using SASS and Grunt with Grunt Watch and Live Reload to stage a serious of control examples shown on example and documentation pages.

## New Features
* Supports AMD (fx.. Require JS)
* Smaller Footprint
* Source Maps
* More Template Friendly
* Sass Friendly
* Themes
* Responsive
* Touch Friendly
* Retina Ready with SVG images and icons
* IE8 Support not included at the moment (TBD Might not be :)
* Rewrites: Grid / DateField
* Globalization
* Input Formatting
* Validation
* Analytics

## Upgrade Guide (from 3.x)

### Checkboxes
* New Markup

### Rewrites
* Grid
* DateField
* Tabs

# Running the Development Project

## Install
* Install nodejs as paying attention to your OS directions: http://nodejs.org/
* Install gruntjs: http://gruntjs.com/
* Install sass: http://sass-lang.com/

## Git The Code

* First clone the repo: `http://git.infor.com/scm/gp/gp-controls.git`
* Move into your new repo: `cd gramercy`
* Then  `npm install` to install node package dependencies

## Running The App
* `cd` into project folder and run `node stroll` to talk a walk in Grammercy Park
* Make a new terminal window and cd into project folder and run `grunt watch`
* Go to `http://localhost:4000/`
* Note that at this point any changes you make will cause Sass to recomplile and the browser will reload thanks to live reload

# Contributing to Soho 2.0

So you're interested in giving us a hand? That's awesome! We've put together some brief guidelines that should help you get started quickly and easily.

There are several to get involved, this document covers:

* [raising issues](#raising-issues)
    * [bug reports](#bugs)
    * [feature requests](#features)
    * [change requests](#changes)
* [working on Gramercy core](#core)
    * [submitting pull requests](#pull-requests)
* [testing and quality assurance](#testing)
* [writing documentation](#documentation)


<a name="raising-issues"></a>
## Reporting An Issue

If you're about to raise an issue because think you've found a problem, or you'd like to make a request for a new feature in the codebase, or any other reason… please read this first.

The [Jira issue tracker](http://jira.infor.com/browse/HFC) is the preferred channel for [bug reports](#bugs), [feature requests](#features), [change requests](#changes).

Use Git for [submitting pull requests](#pull-requests), but please respect the following:

* Please **search for existing issues**. Help us keep duplicate issues to a minimum by checking to see if someone has already reported your problem or requested your idea.

* Please **do not** derail or troll issues. Keep the discussion on topic and respect the opinions of others.

<a name="bugs"></a>
### Bug Reports

A bug is a _demonstrable problem_ that is caused by the code in the repository. Good bug reports are extremely helpful - thank you!

Guidelines for bug reports:

1. **Use the Jira and Git issue search** &mdash; check if the issue has already been
   reported.

2. **Check if the issue has been fixed** &mdash; try to reproduce it using the
   latest `master` or look for [closed issues in the current milestone](http://jira.infor.com/secure/IssueNavigator.jspa?reset=true&jqlQuery=project+%3D+HFC+AND+status+%3D+Resolved+ORDER+BY+priority+DESC&mode=hide).

3. **Isolate the problem** &mdash; ideally create a [reduced test case](http://css-tricks.com/6263-reduced-test-cases/) and a live example.

4. **Include a screencast if relevant** - Is your issue about a design or front end feature or bug? The most helpful thing in the world is if we can *see* what you're talking about.
Use [LICEcap](http://www.cockos.com/licecap/) to quickly and easily record a short screencast (24fps) and save it as an animated gif! Embed it directly into your Jira issue.

5. Use the Bug Report template below

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

1. Read the [Roadmap and Planned Features](http://jira.infor.com/browse/HFC#selectedTab=com.atlassian.jira.plugin.system.project%3Aroadmap-panel) and check the feature hasn't already been requested. GP issues are noted with a 4.0 in the title
2. Take a moment to think about whether your idea fits with the scope and aims of the project, or if it might better fit being an app/plugin/extension. Also think if anyone else but your team would want it..
3. Remember, it's up to *you* to make a strong case to convince the merits of this feature. "We did it before" isnt strong enough. Please provide as much detail and context as possible, this means explaining the use case and why it is likely to be common.


<a name="changes"></a>
### Change Requests

Change requests cover both architectural and functional changes to how the controls work. If you have an idea for a new or different dependency, a refactor, or an improvement to a feature, etc  - please be sure to:

1. **Use the Stash and Jira search** and check someone else didn't get there first
2. Take a moment to think about the best way to make a case for, and explain what you're thinking. Are you sure this shouldn't really be a [bug report](#bug-reports) or a [feature request](#feature-requests)? Is it really one idea or is it many? What's the context? What problem are you solving? Why is what you are suggesting better than what's already there? Does it fit with the Roadmap?


<a name="pull-requests"></a>
### Submitting Pull Requests

Pull requests are awesome. If you're looking to raise a PR for something which doesn't have an open issue, please think carefully about [raising an issue](#raising-issues) which your PR can close, especially if you're fixing a bug. See here for information on how to submit a [pull request](https://confluence.atlassian.com/display/STASH/Using+pull+requests+in+Stash)

<a name="testing"></a>
### Testing and Quality Assurance

Never underestimate just how useful quality assurance is. If you're looking to get involved with the code base and don't know where to start, checking out and testing a pull request is one of the most useful things you could do.

If you want to get involved with testing Gramercy, there is a set of [QA Documentation](#qa-documentation) on the wiki.

Essentially though, [check out the latest master](http://git.infor.com/projects/GP/repos/gp-controls/branches), take it for a spin, and if you find anything odd, please follow the [bug report guidelines](#bug-reports) and let us know!


<a name="documentation"></a>
### Documentation

Soho 2.0's current documentation can be found at [soho.infor.com](http://soho.infor.com).

The documentation will be generated created inline in the pages (soon but not yet). You can fork the repo and submit pull requests following the [pull-request](#pull-requests) guidelines.

## Coding Conventions

[Coding Standards are now in their own Repo](http://git.infor.com/projects/SHARED/repos/coding-standards/browse/README.md)


<a name="qa-documentation"></a>
## QA Documentation

* Tester would grab build from from http://usmawsoab.infor.com:8080/ci/job/Gramercy%20Park/ (Generally Two Month Cycles for versions/QA). Next version is 4.0 current is 3.4
* Tester would go through every Html page example opening it in:  ~~IE8~~, IE9, IE10, Safari,  Chrome, Firefox, iOS (iPad), iOS, Android (tablet and mobile)
* Cross check designs with http://soho.infor.com/the-soho-basics/design-vision/
* Test for Accessibility. This means.
    * Run Wave Toolbar
    * Run Squizz – Html Sniffer
    * Test for Keyboard against http://access.aol.com/dhtml-style-guide-working-group/
    * Test with screen readers (voice over, nvda and jaws), If only one Jaws is most critical.
* Any issues or inconsistencies would be reported to http://jira.infor.com/browse/HFC
* Create Selenium (Javascript based) scripts or similar tests (Dalek JS)
* Next version will be Soho 2.0 – which will be a new style guide and set of updated controls. Test that similarly just different links.
* Next version will have DelekJS or CasperJS test suites which will need to be updated.
* Help contribute to questions on Jira and make test examples to test different scenarios like the current test examples.

# Teams Using

| Project   |      Comments      |  Names |
|----------|:-------------:|------:|
| Approva Applications |  An ASP Application interested in accessibility | Shabu Kutty |
| Automotive Exchange  | Evaluate with AngularJS and GWT | Tien Hanh Pham, Michael Lenz |
| Business Vault |    Justin Timbers   |   A JSF based Single Page App implement with jQuery |
| Certification Manager | ? |    Syedur Islam |
| Certpoint LMS  | ? | Blessed Dianne Valencia |
| CPM Applications (4) | ? | Rick Leedy, Mike Surel |
| CLM Web UI | ? | Michael Pendon |
| GFC  | Lawson App | Tiffany Kai King, Jon Cadag |
| Hansen 8  | An ASP Application interested in accessibility  | Ovidiu Petruescu |
| Healthcare Clinical  | ?? | Charlie Price |
| HMS  | ? | David Parisi |
| Infinium SHCM  | ? | Joe Bockskopf |
| Infor ERP LN - Customer Specific Utilities  | ? | Flavio Marcato |
| Landmark  | Jetty Server Servlet | Phillip Patton |
| Lawson S3  | Jetty Server Servlet | Phillip Patton |
| LBI | ? | Steve Stahl, Rommel Dollison |
| LTM App Group | ? | Jerry Drinka, David Cooper |
| Masterpiece | ? | Tam Nav |
| MSCM (Mobile Supply Chain Management ) | ? | Ferdinand Brian Verdejol, Larry Amisola |
| MNT0386 - Cloud Enablement of SRS | ? | Leo Peng |
| M3 Sales and Marketing Suite Team - Metadata Publisher | ? | Ralph Brian Mercadal, Lito Lopez |
| MUA (M3H5 Client) | ? | Michael Quibin , Jack Rubillar |
| Optiva | ? | Andy Koenigsberg |
| PMServerAdmin | ? | Mike Campbell |
| PCM | Knockout App | Tim Dunham |
| Rhythm | Node Js app with Marionette | Ted Kusio |
| Sales Portal | ? | Matt Defina  |
| SmartStream | ASP | Wim Denayer |
| Softbrands FourthShift ERP | ASP | Steve Duepner |
| S3 Worklist | Webpart (Black) | Jeremy Spring |
| Sunsystems Transfer Desk | Alexander Taylor | MVC3 |
| Supply Chain Execution | Anindhya Sharma | Reviewing |
| SupplyWeb | Chad Paulinski | Reviewing |
| System I | ? | Richard Sankey |
| VR POC | (POS system) works on Windows Forms using the ProvideX language. Win Forms dynamically transformed to a Web Forms (DHTML), | Arnaud Pochon  |
| Xtreme Support | ASP| Raj S. Joshi |
