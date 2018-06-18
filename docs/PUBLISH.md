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

- Verify the [changelog](/changelog) is up-to-date
- Generate Release Notes <http://bit.ly/2w6X8Xw>

## Steps using release-it

- `npm install release-it -g`
- Export your existing token or [Generate a token](https://github.com/webpro/release-it#%EF%B8%8F-github-release) (save this tokens somewhere for future releases - do not commit it)
    - `export GITHUB_ACCESS_TOKEN="{YOUR TOKEN}"` to set the token (its `export` for OSX)
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
