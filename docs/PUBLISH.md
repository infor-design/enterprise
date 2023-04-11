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

## For documentation (only for "final" releases)

- Make sure you setup your `DOCS_API_KEY` key

## Release

1. Run the scripts to set the variables configured above (ignore this if they are already set)
1. Make sure you have a branched and tagged the release branch. Using for example `git checkout -b 4.xx.x`. Or checkout the release branch if not already on it. If you do not do this the docs will not properly deploy to the design site [design.infor.com](http://design.infor.com)
1. Run `git pull {remote} {branch name} && git pull --tags` to ensure you have the latest code.
1. Run a release cmd using [release it.](https://www.npmjs.com/package/release-it)

    - `npm run release:beta` - beta
    - `npm run release:rc` - release candidate normally the final testing branch before the release
    - `npm run release:final` - the release itself
    - **Always** verify the release version when the script asks. You MAY have to use a different release-it command than what we provide with the NPM script.
    - You may get warnings about the release you are trying to do, will not line up with the previous tag. This is usually nothing, but spend a minute or two to think through it.

1. Set the main branch to the next minor dev version. For example if we made branch `4.82.x`, then the `main` package.json version should now be changed to `4.82.0-dev`
1. Check that the build is running after for the deploy on the [Jenkins Server](http://jenkins.design.infor.com:8080/job/soho-kubernetes-deploy/)
1. Watch Ms Teams for a posted release and notify QA for beta and minor
1. Update the [Stackblitz](https://stackblitz.com/edit/ids-enterprise-4610) under my account but can be under any

## Release via Jenkins

1. **BRANCH** Set the branch to release from (for example 4.64.x)
1. **NPM_COMMAND** If this is filled, it will override the **RELEASEIT_FLAGS** field, and will run any command specified.
1. **NPM_LATEST** Specify which version should appear as latest in npm. If left blank the version being created will become the latest.
1. **RELEASEIT_FLAGS** Set release-it flags here.
1. **RELEASE_INCREMENT** Set release increment, major, minor, patch. Leaving it blank will deploy a beta release.

For **RELEASEIT_FLAGS** `--dry-run=false` is set by default, remove it to do a release release.

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
npm dist-tags add ids-enterprise@4.82.0 latest
```

## Publishing docs

1. Triggered by Jenkins and runs as a k8s job.

### Publishing docs local

It's possible to publish docs locally but this as done as part of the `npm release:final` command. So should only be needed for debugging or special situations like the release didn't fully work. To do this:

It's possible to publish docs locally but this as done as part of the `npm release:final` command. So should only be needed for debugging or special situations like the release didn't fully work. To do this:

1. Clone the repo and checkout appropriate branch.
1. Create an .env file with the following content:

    ```shell
    # For release-it git hub
    GITHUB_ACCESS_TOKEN=
    # For uploading docs
    DOCS_API_KEY=
    # For Jenkins Deploys
    JENKINS_JOB_TOKEN=
    JENKINS_API_TOKEN=
    ```

1. `export $(grep -v '^#' .env | xargs)`
1. Use node version 14.17.5.
1. `npm install && npm run build`
1. `node ./scripts/deploy-documentation.js --site staging`
1. `node ./scripts/deploy-documentation.js --site prod`

### Less Dependencies

Some of the Dependencies are optional and only used for tests or for developers. If you want a streamlined node_modules with only things needed to build and deploy the server to the static sites you can use the custom command instead of `npm ci`

```shell
npm run install-demo
```

This will reduce the node_modules size by about 3/4.
