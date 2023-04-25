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

## Project Boards and Tasks Per Contributor

Consider an example [project board](https://github.com/orgs/infor-design/projects/148) you will see the following columns to represent an issues state. Everyone is responsible to see the each issue they check is reflected correctly in the board.

**No Status** The issue has recently been added and should be moved to a column like Todo or In Progress or assigned and moved.
**ToDo** The issue is ready to be worked on by an assigned developer, if unassigned the issue is considered up for grabs.
**In Progress** The issue is being worked on by a developer. The developer should move their issue to this column when they start the issue and move it back if they stop. If you see an issue you know is in progress you may help a developer out and move it for them.
**Ready for Dev PR Review** The issue has a PR (Pull Request) thats ready for other developers to review and for QA after that. The PR at this level will first undergo dev review and when two devs approve it to graduates to the next level. The developer should move their issue to this column when they make the PR. If you see an issue you know is in PR status and unreviewed you may help a developer out and move it for them.
**Ready for QA PR Review** Once two developers approve an issue we need a QA member to approve it before its merged. Items in this column should be reviewed by one of the QA folks. If approved it goes to the next stage if failed move it to the Failed QA column and write a comment. Try to stick to the essence of the issue and not add on any thing that seems unrelated. We will make new issues for that.
**Failed QA** Any tickets still in PR status that are failed by QA will end up here. If you see an issue thats failed you can move it for the developer.
**Passed QA (Ready for Design Review)** Any tickets that pass QA and get merged that have a visual part should be reviewed by designers and stakeholders next. If you look at the branch name on the top of the PR there is an associated link you can check. For example if the branch is `7459-contextual-toolbar` then the demo links are available on `https://7459-contextual-toolbar-enterprise.demo.design.infor.com/` (substitute localhost for the branch name) and follow the instructions. Try to stick to the essence of the issue and not add on any thing that seems unrelated. We will make new issues for that. If you see an issue that looks like it needs design review and passed QA move it here. If its a none visual issue it can go to done.
**Failed Design Review** If you see a change you want to the PR as a designer or stakeholder, make a comment on the pull request and move it to this column. If you see an issue that looks like it failed design review and passed QA move it here. The PR will be updated with priority by the developer on it.
**Done** Once the PR passes all checks, is approved by two developers and one QA and optionally a stakeholder or designer. The issue can be merged and moved here. If you merge a PR check that it gets moved here.
