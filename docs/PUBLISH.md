# Release Enterprise

## Dev Release

To do a dev release, publish a dated semver to npm.

1. Make sure you are on `master` and its clean
1. Make sure you are authenticated with npm cli (`npm login`)
1. `npm run release:dev`

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

    ```sh
    npm login
    ```

### Make sure you have Jenkins variables set (only for "final" releases)

- Check that you have both `JENKINS_JOB_TOKEN` and `JENKINS_API_TOKEN` exported

## Make sure you have set up tools for AWS CDN Publish (only for "final" releases)

- Install AWS for testing and configuring <http://docs.aws.amazon.com/cli/latest/userguide/installing.html>
- Once installed, configure AWS CLI
    1. Run `aws configure --profile sohoxi`
    2. Fill in the `key` and `secret`
    3. Leave "region" and "output" blank or `[none]`

> See the [AWS instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) for troubleshooting

## For documentation (only for "final" releases)

- Make sure you setup your `DOCS_API_KEY` key

## Release

1. Check that the change log notes are up to date.
1. Run the script to set the variables configured above (ignore this if they are already set)
1. Checkout the release branch
1. Run `git pull {remote} {branch name} && git pull --tags`
1. Run a release cmd:

    - `npm run release:beta` - beta
    - `npm run release:rc` - release candidate normally the final testing branch before the release
    - `npm run release:final` - the release itself
    - **Always** verify the release version when the script asks. You MAY have to use a different release-it command than what we provide with the NPM script.
    - You may get warnings about the release you are trying to do, will not line up with the previous tag. This is usually nothing, but spend a minute or two to think through it.

1. Set the master branch to the next minor dev version. For example if we made branch `4.23.x`, then the `master` package.json version should now be changed to `4.24.0-dev`
1. Check that the build is running after for the deploy on the [Jenkins Server](http://jenkins.design.infor.com:8080/job/soho4-swarm-deploy/)
1. Watch Slack for a posted release and notify QA for beta and minor

For a final release, finish with:

1. Manually merge the version branch into `master`. Do **NOT** use a pull request. (You will need github push permissions for this). For merging you could use the commands:

```sh
git checkout master
git pull origin master
git merge {branch name}
git push origin master
```

1. Verify the `package.json` version on master is what it should be (usually the next minor version with a `-dev` suffix)
1. Post a message in announcements on ms teams (for final releases only).
