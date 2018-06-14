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

## Cherry-pick a fix from one branch to another

```bash
git checkout 4.7.x
git cherry-pick 802b102fda5420a0f714d9d0efa5eff635fe77d9
git push
git checkout master
```

## Steps for Cutting a Release

## Documentation

- Check ChangeLog.md is updated (we will soon use github change log)
- Create new version in Jira and mark current as released <https://jira.infor.com/plugins/servlet/project-config/SOHO/versions>
- Generate Release Notes <http://bit.ly/2w6X8Xw>

## Steps using release-it

- `npm install release-it -g`
- Checkout the release branch and `git pull --tags`
- Type of releases:
    - `release-it minor --preRelease=beta`
    - `release-it minor --preRelease=rc`
    - `release-it minor`
    - `release-it {version}`
    - **Always** verify the release the script asks you about
- Deploy the demo app twice:
    - Once as a numberical version `4.7.0`
    - Once as that numberical version `4.7.0` aliased as “latest”
- Merge back into `master`
- PR the master version to `4.8.0-dev`

## Update version in ids-enterprise-ng

- <https://github.com/infor-design/enterprise-ng>
- Make a final Pull Request for release
    - bump publish/package.json to the release version
    - `npm install ids-enterprise@latest` to update the root package.json
    - manually update the `publish/package.json` dependency for ids-enterprise
- Get PR merged in and pushed
- [Create a release](https://github.com/infor-design/enterprise-ng/releases) for that branch
- `npm publish --tag latest`
- Merge back into `master
- PR the master version to `4.8.0-dev`

## Test Npm packages

```bash
npm view ids-enterprise versions
npm view ids-enterprise-angular versions

npm info ids-enterprise-angular dist-tags
npm info ids-enterprise dist-tags
```

## Setup tools for AWS CDN Publish

- Also install AWS for testing and configuring <http://docs.aws.amazon.com/cli/latest/userguide/installing.html>
- Once installed run aws configure to enter the keys in the right spot <http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html>

## Deploy to AWS

```bash
AWS_PROFILE=sohoxi directory-to-s3 -d publish infor-devops-core-soho-us-east-1/sohoxi/4.3.3 -v
```
