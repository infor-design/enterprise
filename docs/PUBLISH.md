# Release Enterprise

## Dev Release

When doing a dev release a daily dated semver will be published to npm.

1. Make sure you are on `main` and its clean
1. Make sure you are authenticated with npm cli (`npm login`)
1. `npm run release:dev`

## Production Release (tagged)

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

1. Check that the change log notes are up to date by verifying the [changelog](/changelog). Note that we add a counts section to the bottom of each release, this section should be manually added by looking at the [git project board](https://github.com/orgs/infor-design/projects) counts and searching for `it('` to count the tests.
1. Run the script to set the variables configured above (ignore this if they are already set)
1. Make sure you have a branched and tagged the release branch. Using for example `git checkout -b 4.xx.x`. Or checkout the release branch if not already on it. If you do not do this the docs will not properly deploy to the design site [design.infor.com](/http://design.infor.com)
1. Run `git pull {remote} {branch name} && git pull --tags` to ensure you have the latest code.
1. Run a release cmd using [release it.](https://www.npmjs.com/package/release-it)

    - `npm run release:beta` - beta
    - `npm run release:rc` - release candidate normally the final testing branch before the release
    - `npm run release:final` - the release itself
    - **Always** verify the release version when the script asks. You MAY have to use a different release-it command than what we provide with the NPM script.
    - You may get warnings about the release you are trying to do, will not line up with the previous tag. This is usually nothing, but spend a minute or two to think through it.

1. Set the main branch to the next minor dev version. For example if we made branch `4.23.x`, then the `main` package.json version should now be changed to `4.24.0-dev`
1. Check that the build is running after for the deploy on the [Jenkins Server](http://jenkins.design.infor.com:8080/job/soho-kubernetes-deploy/)
1. Watch Ms Teams for a posted release and notify QA for beta and minor

For a final release, finish with:

1. Manually merge the version branch into `main`. Do **NOT** use a pull request. (You will need github push permissions for this). For merging you could use the commands:

```sh
git checkout main
git pull origin main
git merge {branch name}
git push origin main
```

1. Verify the `package.json` version on main is what it should be (usually the next minor version with a `-dev` suffix)
1. Post a message in announcements on ms teams (for final releases only).

## Verifying The Release

1. Go to [design.infor.com](https://design.infor.com/code/ids-enterprise/latest) and ensure the version is in the dropdown.
1. In this repo check the branches dropdown for the tag for example (4.xx.x).
1. Check the releases tag for the release.
1. Check a page on the [latest deployed server](https://latest-enterprise.demo.design.infor.com/components/about/example-index.html) and inspect the page and check the js and css scripts have the new version in the head.
1. Check the [npm link](https://www.npmjs.com/package/ids-enterprise) page that the expected version is the latest. If you patched it could change. If you need to reset this then run a command such as:

```sh
npm dist-tags add ids-enterprise@4.29.3 latest
```
