# Contributing

So you're interested in giving us a hand? That's awesome! We've put together some brief guidelines that should help you get started quickly and easily.

There are several to get involved, this document covers:

- [raising issues](#raising-issues)
    - [bug reports](#bugs)
    - [feature requests](#features)
    - [change requests](#changes)
- [working on Enterprise core](#core)
    - [submitting pull requests](#pull-requests)
- [testing and quality assurance](#testing)
- [writing documentation](#documentation)

## Reporting An Issue

The [Jira issue tracker](http://jira.infor.com/browse/SOHO) is the preferred channel for [bug reports](#bugs), [feature requests](#features), [change requests](#changes).
We know that not all of our possible contributors have access to this right now, but we are working on that.
If you do have access to it, please search the issues/features before opening a new one and possibly creating duplicates.

### Bug Reports 🐞

A bug is a _demonstrable problem_ that is caused by the code in the repository. Good bug reports are extremely helpful - thank you :+1:!

Guidelines for bug reports:

1. **Use the Jira and Git issue search** - check if the issue has already been
   reported.

2. **Check if the issue has been fixed** - try to reproduce it using the latest `master` or look for [closed issues in the current milestone](http://jira.infor.com/secure/IssueNavigator.jspa?reset=true&jqlQuery=project+%3D+SOHO+AND+status+%3D+Resolved+ORDER+BY+priority+DESC&mode=hide).

3. **Isolate the problem** - create a [reduced test case](http://css-tricks.com/6263-reduced-test-cases/) and a live example.

    Examples of reduced test cases are:

    - Take an existing example and modify it to resemble the issue, this is ideal as we can include this in our init tests to avoid future breakages
    - Create an example using a tool like [jsfiddle](https://jsfiddle.net) (the enterprise scripts can be upload on this site)
    - Any Other runnable code

    Spend a little time in recreating and isolating the issue and you might learn and discover the solution.

    **:no_entry: Do not :no_entry:**
    - Send a video in place of a reduced test case
    - Send a link to your application
    - Just send an image of the source code

    If a video is useful to show the problem please use a cross platform format such as `MP4` and `.webm` for the video.
    We have found [Chrome plugin Screencastify - Screen Video Recorder](https://chrome.google.com/webstore/detail/screencastify-screen-vide/mmeijimgabbpbgpdklnllpncmdofkcpn?hl=en) to be useful.

4. Use the Bug Report template below

    A good bug report shouldn't leave others needing to chase you up for more information. Be sure to include the details of your environment.

    ```text
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

    - Script/Css Version: (See Head of the File)
    - Client OS: Mac OS X 10.8.4
    - Browser: Chrome 29.0.1547.57
    ```

### Feature Requests

Feature requests are welcome. Before you submit one be sure to have:

1. Read the [Roadmap and Planned Features](http://jira.infor.com/browse/HFC#selectedTab=com.atlassian.jira.plugin.system.project%3Aroadmap-panel) and check the feature hasn't already been requested.
1. Does your idea fits with the scope of the project? Might better fit being an app/plugin/extension?
1. Would anyone else but your team would want this feature?
1. Remember, it's up to *you* to make a strong case to convince the merits of this feature. "We did it before" isnt strong enough.

### Submitting Pull Requests

Pull requests are awesome. If you're looking to raise a PR for something which doesn't have an open issue,
please think carefully about [raising an issue](#raising-issues) which your PR can close, especially if you're fixing a bug.

If you'd like to submit a pull request you'll need to do the following:

1. **[Forking the repo](https://help.github.com/articles/fork-a-repo/)**. Navigate to [Github Repository](https://github.com/infor-design/enterprise) and click the "Fork" button in the top right corner of your browser.

1. **[Clone the Repository](https://help.github.com/articles/cloning-a-repository/) to your machine.**.
1. **Make your changes with the local copy of the code.**

1. **Commit your changes locally.**  Use `git commit -am "[COMMIT MESSAGE]"` and type any related JIRA Ticket numbers into the message and try to follow [Github's commit message standards](https://github.com/erlang/otp/wiki/Writing-good-commit-messagesMore).
    - For Example:
        ```bash
        "ABBV-XXXX - Changed modal to implement the new design"
        "ABBV-XXXX - Changed header markup to implement arrow keys treating it as a toolbar"
        "Added api to the list view to add, 'remove, add' functions - ABBV-XXXX"
        "Fixed issue in the xyz control as per ABBV-XXXX"
        ```
    - Repeat Steps 3 and 4 as many times as necessary to refine your code. Please try to stick to our coding standards and patterns that already exist in the code.

1. **[Pull & Rebase](https://help.github.com/articles/about-pull-request-merges/#rebase-and-merge-your-pull-request-commits) to the latest version of the controls before you submit.**
    - If enough time passes between your original clone and the completion of your changes, the main repository may have changed and some files you've edited may be out of sync.
    - To re-sync your remote branch and clone, use the following after committing your changes:
        ```bash
        git pull --rebase {remote}/{branch}
        ```

    Note: You may need to merge some files or fix some conflicts.

1. **Push your changes to your remote repository.**  Use `git push {remote} {branch}` to push your changes to your branch on the remote repository.

1. **[Creating a pull request](https://help.github.com/articles/creating-a-pull-request/)**

See [help.github.com](https://help.github.com/) for further information.

### Testing and Quality Assurance

Never underestimate just how useful quality assurance is. If you're looking to get involved with the code base and don't know where to start, checking out and testing a pull request is one of the most useful things you could do.

If you want to get involved with testing Enterprise, there is a set of [QA Documentation](#qa-documentation) on the wiki.

Essentially though, check out the latest master, take it for a spin, and if you find anything odd, please follow the [bug report guidelines](#bug-reports) and let us know!
