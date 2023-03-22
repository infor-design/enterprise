# QA Documentation

This document describes our QA process at a super high level. For more details see the detailed [IDS QA SQA documentation](https://paper.dropbox.com/doc/IDS-SQA-PROCEDURE-DOCUMENT--AaLUHnVMAshcGNKYGkh_bFtZAQ-TQXxoWEXe8y8wENtbKMgB).

## Demo App Links

- [Bleeding Edge](http://main-enterprise.demo.design.infor.com/components)
- [Latest Stable](http://latest-enterprise.demo.design.infor.com/components)

We have generally One Month Cycles for versions/QA.

## Infor resources

- [IDS Enterprise on Github](https://github.com/infor-design/enterprise/issues) for reporting issues
- [IDS Enterprise NG on Github](https://github.com/infor-design/enterprise-ng/issues) for reporting Angular issues
- [IDS Enterprise WC on Github](https://github.com/infor-design/enterprise-wc/issues) for reporting Web Component issues
- [IDS Roadmap](https://docs.google.com/spreadsheets/d/1nxSEfNoKtQ9i3R7hgokj8VTdAJ95J8SXfhJ7IrtrOf0/edit?pli=1#gid=345637423)
- [Requirements Documentation](https://docs.google.com/spreadsheets/d/1Z9mmUZJlAqkCLy8vyie3AjRKUR4SVKuHGyFiQiGm98A/edit?pli=1#gid=989468169)

## Things to Test

The components should be tested in several ways:

- Browser Testing - Edge, Firefox, Safari, Chrome, IOS  (Phone and Tablet), Android (Phone and Tablet)
- Touch Device Support Testing (IOS And Android)
- Accessibility Testing according to [WCAG Accessibility Standards](https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/)
- Developer Testing - Can the Components be easily coded from the documentation
- Testing against requirements
- Any issues or inconsistencies would be reported to the repos above

## QA Process

The QA process consists of reviewing a Pull request (PR) and approving the issue. For "issue QA".

- Look at the current project board to see which issues need "issue QA" see the [project board](https://github.com/orgs/infor-design/projects)
- You can also look at the active PRS since you will be reviewing it on the [PR list](https://github.com/infor-design/enterprise/pulls). The ones that need QA will have a "needs qa" tag all others can be ignored and ones with "wip" can also be ignored.
- Open the PR and review the fix details
- To run it first copy the branch name on the top button
- If not cloned yet do the following in the command line

```sh
mkdir enterprise
cd enterprise
nvm use
git clone git@github.com:infor-design/enterprise.git .
git checkout <branchname>
npm i
npm run start
```

- If previously cloned do the following in the command line.

```sh
mkdir enterprise
cd enterprise
git checkout <branchname>
git pull
npm i
npm run start
```

- Follow the localhost:400 links on the pull request (not main for this anymore)
- On the PR click Files Changed and Then Review Changes
- If approved select approve and add any comments
- Or add a comment
- Or Request Changes
- Developer Will address and then just come back again later and review again and approve
- Item in the board can go to Failed QA (we may be able to do this automatically)
- Item in the board will go to done automatically when everyone approves
