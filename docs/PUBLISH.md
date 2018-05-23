# Dev Ops and Release Publishing Tasks and Notes

## Check Published npm Tags

```bash
npm info ids-enterprise dist-tags
npm view ids-enterprise versions
```

## Delete a npm Tag

```bash
npm dist-tag rm ids-enterprise tagname
```

## Merge a fix to a branch

```bash
git checkout 4.7.x
git cherry-pick 802b102fda5420a0f714d9d0efa5eff635fe77d9
git push
git checkout master
```

## Steps for Cutting a Release

## Documentation
* Check ChangeLog.md is updated (we will soon use github change log)
* Create new version in Jira and mark current as released https://jira.infor.com/plugins/servlet/project-config/SOHO/versions
* Generate Release Notes http://bit.ly/2w6X8Xw

## Git Operations
* Edit version `ids-enterprise/package.json` (from 4.7.0-rc to 4.7.0 as an example)
* Push a PR
* Check for Last PR's https://github.com/infor-design/enterprise/pulls and make sure all merged
* Merge  4.7.0-rc (the rc branch) back onto the 4.7.x (branch) - Using a PR
* Git Tag the release from https://github.com/infor-design/enterprise/releases
* Delete any rc branches and all feature/bug fix branches https://github.com/infor-design/enterprise/branches

## Update version in ids-enterprise-ng
* https://github.com/infor-design/enterprise-ng
* Edit version in `ids-package.json`
* Check for Last PR's https://github.com/infor-design/enterprise-ng/pulls and merge
* Merge  4.7.0-rc (the rc branch) back onto the 4.7.x (branch) - Using a PR
* Git Tag the release from https://github.com/infor-design/enterprise-ng/releases
* Delete the rc branch and all feature/bug fix branches https://github.com/infor-design/enterprise-ng/branches


## Test Npm packages
```
npm view ids-enterprise versions
npm view ids-enterprise-angular versions

npm info ids-enterprise-angular dist-tags
npm info ids-enterprise dist-tags
```

## Setup tools for AWS CDN Publish

- Also install AWS for testing and configuring http://docs.aws.amazon.com/cli/latest/userguide/installing.html
- Once installed run aws configure to enter the keys in the right spot http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html

## Deploy to AWS

```bash
AWS_PROFILE=sohoxi directory-to-s3 -d publish infor-devops-core-soho-us-east-1/sohoxi/4.3.3 -v
```
