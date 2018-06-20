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

## Dev Releases

To do a dev release, publish a dated semever to npm.

1. Make sure you are on `master` and its clean
1. Change the `package.json` version to append the date, i.e. `4.7.0-dev.YYYYMMDD`
1. Save the `package.json` file (**DO NOT** commit it)
1. `npm publish --tag=dev`
1. Undo the version change/reset your branch

## Official, Tagged Releases

## Documentation

- Verify the [changelog](/changelog) is up-to-date
- Generate Release Notes <http://bit.ly/2w6X8Xw>

### Make sure you have [credential] setup in .gitconfig  (Windows Users Only)

Try adding this into your git config

```yml
   [credential]
       helper = wincred
```

or via console

```sh
   git config --global credential.helper wincred
```

### Make sure you have a GITHUB_ACCESS_TOKEN configured

- Get a token <https://github.com/settings/tokens>
    - click the `Generate new token` button
    - click ONLY the repo scope
    - scroll to the bottom and click the `Generate token` button
    - NOTE: Save your token somewhere so it doesn't get lost.
- Set your environment variable from your command window
    - (mac) `export GITHUB_ACCESS_TOKEN="<your token here>"`
    - (windows) `set GITHUB_ACCESS_TOKEN="<your token here>"`

## Release

1. Make sure you have release-it installed (`npm install release-it -g`)
1. Checkout the release branch and `git pull --tags`
1. Run a release cmd:
    - `npm run release:beta` - beta
    - `npm run release:rc` - release candidate normally the final testing branch before the release
    - `release:final` - the release itself
    - **Always** verify the release version when the script asks
1. Deploy the demo app for the semver

For a final release, finish with:

1. Merge back into `master`
1. PR the master version to the proper "dev" version
    - i.e. if we just released `4.7.0`, master will now be `4.8.0-dev`
1. Deploy the demo app for the semver AS "LATEST"

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
