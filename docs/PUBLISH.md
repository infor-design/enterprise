# Release Enterprise

## Dev Release

To do a dev release, publish a dated semver to npm.

1. Make sure you are on `master` and its clean
1. Change the `package.json` version to append the date, i.e. `4.7.0-dev.YYYYMMDD`
1. Save the `package.json` file (**DO NOT** commit it)
1. `npm run build && npm run zip-dist` to build
1. `npm publish --tag=dev` to publish
1. Undo the version change/reset your branch

## Production Release (tagged)

### Documentation

- Verify the [changelog](/changelog) is up-to-date

### Make sure you have [credential] setup in .gitconfig  (Windows Users Only)

Try adding this into your git config

```yaml
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

### Make sure you are logged into NPM

- Verify you are logged into NPM in your terminal to avoid `release-it` dying at the end.

### Make sure you have Jenkins variables set (only for "final" releases)

- Check that you have both `JENKINS_JOB_TOKEN` and `JENKINS_API_TOKEN` exported

## Make sure you have set up tools for AWS CDN Publish (only for "final" releases)

1. nstall AWS for testing and configuring <http://docs.aws.amazon.com/cli/latest/userguide/installing.html>. If you are on mac and use homebrew, that is an option too.
1. Once installed run aws configure to enter the keys in the right spot <http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html>
1. Install [directory-to-s3](https://www.npmjs.com/package/directory-to-s3) globally.
    - `npm install -g directory-to-s3`

## For documentation (only for "final" releases)

- Make sure you setup your `DOCS_API_KEY` key

## Release

1. Make sure you have release-it installed (`npm install release-it -g`)
1. Checkout the release branch and `git pull --tags`
    - Set the master branch to the next minor dev version. For example if we made branch `4.9.x`, then the `master` package.json version should now be changed to `4.10.0-dev`
1. Run a release cmd:
    - `npm run release:beta` - beta
    - `npm run release:rc` - release candidate normally the final testing branch before the release
    - `npm run release:final` - the release itself
    - **Always** verify the release version when the script asks. You MAY have to use a different release-it command than what we provide with the NPM script.

For a final release, finish with:

1. Manually merge the version branch into `master`. Do **NOT** use a pull request. (You will need github push permissions for this)
    - Verify the `package.json` version on master is what it should be (usually the next minor version with a `-dev` suffix)
