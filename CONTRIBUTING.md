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

## Reporting An Issue

If you're about to raise an issue because think you've found a problem, or you'd like to make a request for a new feature in the codebase, or any other reason… please read this first.

The [Jira issue tracker](http://jira.infor.com/browse/SOHO) is the preferred channel for [bug reports](#bugs), [feature requests](#features), [change requests](#changes).

Use Git for [submitting pull requests](#pull-requests), but please respect the following:

* Please **search for existing issues** in JIRA before submitting a pull request. Help us keep duplicate issues to a minimum by checking to see if someone has already reported your problem or requested your idea.

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

### Feature Requests

Feature requests are welcome. Before you submit one be sure to have:

1. Read the [Roadmap and Planned Features](http://jira.infor.com/browse/HFC#selectedTab=com.atlassian.jira.plugin.system.project%3Aroadmap-panel) and check the feature hasn't already been requested.
2. Take a moment to think about whether your idea fits with the scope and aims of the project, or if it might better fit being an app/plugin/extension. Also think if anyone else but your team would want it..
3. Remember, it's up to *you* to make a strong case to convince the merits of this feature. "We did it before" isnt strong enough. Please provide as much detail and context as possible, this means explaining the use case and why it is likely to be common.


### Change Requests

Change requests cover both architectural and functional changes to how the controls work. If you have an idea for a new or different dependency, a refactor, or an improvement to a feature, etc  - please be sure to:

1. **Use the Bitbucket and Jira search** and check someone else didn't get there first
2. Take a moment to think about the best way to make a case for, and explain what you're thinking. Are you sure this shouldn't really be a [bug report](#bug-reports) or a [feature request](#feature-requests)? Is it really one idea or is it many? What's the context? What problem are you solving? Why is what you are suggesting better than what's already there? Does it fit with the Roadmap?


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

### Testing and Quality Assurance

Never underestimate just how useful quality assurance is. If you're looking to get involved with the code base and don't know where to start, checking out and testing a pull request is one of the most useful things you could do.

If you want to get involved with testing SoHo Xi, there is a set of [QA Documentation](#qa-documentation) on the wiki.

Essentially though, [check out the latest master](http://git.infor.com/projects/GP/repos/gp-controls/branches), take it for a spin, and if you find anything odd, please follow the [bug report guidelines](#bug-reports) and let us know!
