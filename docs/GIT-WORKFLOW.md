# Git Workflow

Note: For details info and great tutorials on Git scenarios see <https://www.atlassian.com/git/tutorials/>

## General Policies

- NEVER commit directly onto or merge PRs into any `4.X.X` branch
- All merges into RC branches must be through PR approvals, either from feature branches or user forks

## Assumptions

- This is "ideal state" not a transition guide from current state
- v4.2.5 has been released and that his where `4.2.X` branch is
- v4.2.6 is an upcoming release
- v4.3.0 is a next feature release
- v4.2.7 is a next patch release

## Common Scenarios

1. A Bug fix that goes into the pending release
1. A Bug fix or Feature for Next Release
1. A patch for the previous release

### Prepare for QA

- Branch `4.3.0-rc` from `4.3.X` (if not already done)
- `4.3.0-rc` gets deployed to QA environment so QA can work in isolation
- At code freeze time `4.3.0-rc` is put on hold until QA is complete; no further merges should happen until QA is complete their round of testing

### After QA (QA looked at branch `4.3.0-rc` and files bug tickets)

- Developer chose a SOHO-001 issue
- Create new branch `soho-001` from branch `4.3.0-rc`
- Write and commit code
- PR `soho-001` into `4.3.0-rc`
- If approved, merge and delete branch `soho-001`
- repeat until bugs are completed
- run QA again and repeat until 100% pass

### QA Complete, Release Ready

- Merge `4.3.0-rc` into `4.3.0`
- Create Tag from `4.3.0` labeled `4.3.0` (which triggers fully automated deploy)
- Delete branch `4.3.0-rc` (cleanup is key to avoid a ton of leftover branches)

### Planning

- Figure what tickets are next to work on for this release `4.3.0`

### Development (start working on next tickets)

- Use the JIRA functionality for (example `soho-101`) to create a branch off of the main repo, not a fork
- Clone the main repo, not your local copy of your fork
- `$ git pull` to grab all the new branch info
- `$ git checkout [new bugfix branch]`
- do work, commit
- `$ git push`, which is already configured to push to the branch
- Once done
    - If `4.3.0-rc` does not exist, ask for it to be created (or create it from `4.3.X`)
    - Else, leave `soho-102` as an open branch for future merging
- make a PR into the `4.2.6-rc` or `4.3.0-rc`
- People should review your PR by checking out the branch and running it locally before approving.
- Delete branch `soho-101` once merged
- Move onto next ticket and repeat

### Prepare for QA Again

- Branch `4.3.0-rc` from 4.3.X (if not already done)
- Code freeze on `4.3.0-rc`
- QA

...repeat

### Patch Previous Release

- Assuming `4.3` minor release has happened and you want to patch the previous minor release `4.2`
- It's critial to follow [item 6 of Semantic Versioning](http://semver.org/#spec-item-6) in order for patch releases to be semantic and _only_ contain backwards compatible bug fixes
- Branch from `4.2.X` into `4.2.7-rc`
- Follow above guidelines for preparing for QA to release
