
# Git Workflow

## General Policies
- NEVER commit directly onto or merge PRs into any `4.X.X` branch
- All merges into RC branches must be through PR approvals, either from feature branches or user forks

## Assumptions
- This is "ideal state" not a transition guide from current state
- v4.2.5 has been released and that his where `4.2.X` branch is
- v4.2.6 is an upcoming release
- v4.2.7 is a distant thought

## Common Scenarios

1. A Bug fix that goes into the pending release
2. A Bug fix or Feature for Next Release
3. A patch for the previous release

### :clipboard: Prepare for QA & QA:
- Branch `4.2.6-rc` from `4.2.X` (if not already done)
- `4.2.6-rc` gets deployed to QA environment so QA can work in isolatation
- `4.2.6-rc` is put on hold until QA is complete; no further merges should happen until QA is complete their round of testing

### :memo: After QA (QA looks at branch `4.2.6-rc` and files bug tickets):
- Developer chose a SOHO-001 jira ticket
- Create new branch `soho-001` from branch `4.2.6-rc`
- Write and commit code
- PR `soho-001` into `4.2.6-rc`
- If approved, merge and delete branch `soho-001`
- repeat until bugs are completed
- run QA again and repeat until 100% pass

### :shipit: QA COMPLETE, RELEASE READY:
- Merge `4.2.6-rc` into `4.2.X`
- Create Tag from `4.2.X` labeled `4.2.6` (which triggers fully automated deploy)
- Delete branch `4.2.6-rc` (cleanup is key to avoid a ton of leftover branches)

### :calendar: PLANNING:
- Figure what tickets are next to work on for this release `4.2.7`

### :computer: DEVELOPMENT (start working on next tickets):
- Developer chose a SOHO-102 jira ticket
- Create new branch `soho-102` from branch `4.2.X`
- Write and commit code
- Once done:
  - If `4.2.7-rc` does not exist, ask for it to be created (or create it from `4.2.X`)
  - Else, leave `soho-102` as an open branch for future merging
- PR `soho-102` into `4.2.7-rc`
- Delete branch `soho-101` once merged
- Move onto next ticket and repeat

### :clipboard: PREPARE FOR QA
- Branch `4.2.7-rc` from 4.2.X (if not already done)
- Code freeze on `4.2.7-rc`
- QA

...repeat

### :information_desk_person: PATCH PREVIOUS RELEASE
- Assuming `4.3` minor release has happened and you want to patch the previous minor release `4.2`
- It's critial to follow [item 6 of Semantic Versioning](http://semver.org/#spec-item-6) in order for patch releases to be semantic and _only_ contain backwards compatible bug fixes
- Branch from `4.2.X` into `4.2.8-rc`
- Follow above guidelines for preparing for QA to release

Orginal Source: https://github.com/hookandloop/code-styleguides/blob/master/workflow/git-workflow.md
