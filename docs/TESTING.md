# Testing

The IDS components are backed by both functional and end-to-end (e2e) test suites.  When contributing to the IDS enterprise project, before we can accept pull requests we expect that new tests will be provided to prove that new functionality works, and that all existing tests pass.

## Test Stack

- [Karma](https://karma-runner.github.io/2.0/index.html) test runner for all tests.
- [Protractor](https://www.protractortest.org/) for controlling e2e tests.
- [TravisCI](https://travis-ci.com/infor-design/enterprise) for continuous integration (CI).
- [BrowserStack](https://www.browserstack.com/) for running e2e tests on our various supported environments.

## Writing Tests

### Naming Conventions for Tests

- Use plain and proper English.
- Describe what the test is testing.
- Component and/or example page name should be part of the `describe()` statement.  Do not write it again as part of the `it()` statement.

#### Describe() Examples

- `Accordion panel tests`
- `Tabs counts tests`

#### It() Examples

- `Should do [x] when [y] happens`
- `Should be possible to [x]`
- `Should be able to [x]`
- `Should open [x] on click`
- `Should do [x] on [y] key`
- `Can do [x]`
- `Can be [x]`
- `Will do [x] when also doing [y]`

#### Best Practices for Tests

- Try to use `protractor.ExpectedConditions` rather than sleeps to make things faster, these wait for items in the DOM to change. For more into see [the protractor docs](https://www.protractortest.org/#/api?view=ProtractorExpectedConditions).
- If you have to use a sleep make sure to use the right config for example `await browser.driver.sleep(config.sleep)`. This is only .5 seconds
- If you see a sleep in the code, try to refactor it to use `protractor.ExpectedConditions`
- Keep the test as simple as possible and just test one thing per test
- Try not repeat yourself in tests. For example if you covered some functionality in one page, no need to test the same thing in another page.
- We use `async` in the tests rather than promises see [this blog on async tests](https://chariotsolutions.com/blog/post/simplify-protractor-web-tests-with-async-and-await/)
- Make sure you don't forget the awaits, the await is just on the things that return a promise for example. `await element(by.css('.pager-next')).click();` not `await element(await by.css('.pager-next')).click();`.
- In functional tests use the `cleanup` function and make sure you remove everything in the page including the scripts and add an id for them.

## Running Functional Tests

Functional tests can be run in multiple modes.

For development purposes, the functional tests can be run in the background continuously, and will watch for file changes.  When files are changed in the project, the tests will rerun and show updated results.  To run the tests this way, use:

```sh
npm run functional:local
```

To do a single test run and exit immediately (which is also what TravisCI does during builds), use:

```sh
npm run functional:ci
```

## Running e2e tests silently for continuous integration (CI)

```sh
npm run build
npm run functional:ci
# start server to test example pages
npm quickstart
# In a new shell
npm run e2e:ci
```

See [.travis.yml](https://github.com/infor-design/enterprise/blob/master/.travis.yml) for current implementation

## Running E2E Tests Locally

Run a specific E2E component locally (Only Chrome or Firefox)

1. Run `npm start` to start the app
1. Isolate your tests with "fit" or "fdescribe"
1. In another terminal instance, run `npm run e2e:ci:debug`

OR

1. Run `npm start` to start the app
1. Then in another terminal instance:

    ```sh
    env PROTRACTOR_SPECS='test/components/dropdown/dropdown.e2e-spec.js' npm run e2e:local:debug
    ```

### Running BrowserStack tests locally

Update your .zprofile, .bashprofile, .bashrc, or .zshrc

```sh
export BROWSERSTACK_USERNAME=<browserstack-username>
export BROWSERSTACK_ACCESS_KEY=<browserstack-access-key>
```

You can get this key from the settings page on your browserstack account.

Make sure the server is started and run:

```sh
npm run e2e:ci:bs
 ```

**NOTE:** After running the tests go into [BrowserStack Automate](https://automate.browserstack.com/) and delete the build for the stats to be accurate.

### Run e2e tests on BrowserStack

IDS Enterprise is configured for nightly builds of the `master` branch.  This build runs in the evening (EST) and it tests <http://master-enterprise.demo.design.infor.com> by default.  TravisCI runs these with:

```sh
npm run e2e:ci:bs
```

### Run a specific E2E component on BrowserStack

```sh
npm start
env PROTRACTOR_SPECS='components/dropdown/dropdown.e2e-spec.js' npm run e2e:local:bs
```

### Run E2E locally on High Contrast or Dark Theme (defaults to light theme)

```sh
npm start
env ENTERPRISE_THEME='high-contrast' npm run e2e:local:debug
```

```sh
npm start
env ENTERPRISE_THEME='dark' npm run e2e:local:debug
```

```sh
npm start
npm run e2e:local:debug
```

## Debugging Functional Tests

- Isolate the test or suite using [fdescribe](https://jasmine.github.io/api/edge/global.html#fdescribe) or [fit](https://jasmine.github.io/api/edge/global.html#fit)
- Run `npm run functional:local`, wait for karma server to start, and to place tests in watch mode
- Navigate to <http://localhost:9876/>
- Open Chrome Dev Tools
- Refresh the page, to rerun the tests, the Sources tab should be open, the script should paused on the `debugger;` statement

## Debugging E2E Tests

- Put a `debugger;` statement above the lines of code in question
- Isolate the test or suite using [fdescribe](https://jasmine.github.io/api/edge/global.html#fdescribe) or [fit](https://jasmine.github.io/api/edge/global.html#fit)
- Start the server with `npm run quickstart` or `npm run start`
- In another terminal, run the e2e test with the command below

```sh
npx -n=--inspect-brk protractor test/protractor.local.debug.conf.js
```

- In Chrome open `chrome://inspect` in a new tab.
- Click on the 'Open dedicated DevTools for Node', or under 'Target', and under 'Remote Target' click on 'inspect'
- Hit resume/play on the debugger

## Working With Visual Regression Tests

A visual regression test will be similar to the following code snippet. The tests run on Travis. Locally, in our development environment, we need to replicate the environment with Docker in order to capture and compare screenshots on a nearly identical machine.  Below, we provide a guide for the setup and generation of baseline images.

```javascript
// Only test visual regressions on Chrome, and the CI
if (utils.isChrome() && utils.isCI()) {
  it('Should not visual regress', async () => {
    const dropdownEl = element(by.css('div[aria-controls="dropdown-list"]'));
    const dropdownElList = element(by.id('dropdown-list'));
    // Wait for animations to complete
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    // Test init/default state
    expect(await browser.imageComparison.checkElement(dropdownEl, 'dropdown-init')).toEqual(0);
    await clickOnDropdown();
    // Wait for animations to complete
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownElList), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    // Test open state
    expect(await browser.imageComparison.checkElement(dropdownElList, 'dropdown-open')).toEqual(0);
  });
}
```

Follow [this guide](https://docs.travis-ci.com/user/common-build-problems/#troubleshooting-locally-in-a-docker-image) in order to debug Travis. We currently use the `node_js` [image](https://hub.docker.com/r/travisci/ci-nodejs/)

Travis commands can be found in the [.travis.yml](https://github.com/infor-design/enterprise/blob/master/.travis.yml), this will need to be replicated inside of the container. This process is outlined below.

### Creating Baseline Screenshots

In order to create Baseline screenshots, it's necessary to emulate the actual TravisCI environment in which the visual regression testing will take place.  Running the tests in an environment that's different than the one the images were generated against will create extreme differences in the rendered IDS components, possibly causing false test failures.

Following the process below will safely create baseline images the CI can use during visual regression tests. The older way we needed to have a local VM, now its possible to connect to the actual travis build and do things.

#### Using the docker image

We created a docker image to help manage baselines. This is located in the [Infor Design System Docker Repos](https://hub.docker.com/r/infords/travis/tags).

1. Download the docker image with `docker run --name travis-debug -dit infords/travis:v1`.
1. Once downloaded, login to the VM with `docker exec -it travis-debug bash -l`.
1. If you had a previous VM with travis-debug you may need to rename it. Do a rename and then login again to the VM:

  ```sh
  docker rename travis-debug travis-debug-old
  docker run --name travis-debug -dit infords/travis:v1
  ```

1. Test the image with `cat /etc/os-release` , you should see `16.04.6 LTS (Xenial Xerus)`.
1. Change to the designated folder with `cd ~` and then `cd enterprise`.
1. Use git commands to get the needed branch `git status` (you start on master).

#### Clean the docker image

At times such as when a new chrome release is causing issues you may need to refresh your VM.
In order to do this we clean the folders, update chrome and do a fresh `npm i`.

  ```sh
  rm -rf node_modules
  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  sudo dpkg -i google-chrome*.deb
  npm i
  ```

This is good step to follow if you see an error similar to this one when running the test suite:

  ```sh
  [10:06:14] I/launcher - Running 1 instances of WebDriver
  [10:06:14] I/direct - Using ChromeDriver directly...
  [10:06:14] E/runner - Unable to start a WebDriver session.
  [10:06:14] E/launcher - Error: SessionNotCreatedError: session not created: This version of ChromeDriver only supports Chrome version 80
  (Driver info: chromedriver=80.0.3987.16 (320f6526c1632ad4f205ebce69b99a062ed78647-refs/branch-heads/3987@{#185}),platform=Linux 4.19.76-linuxkit x86_64)
  ```

#### Updating the docker image

1. Make sure you sign up for docker and are adding to the [IDS Community](https://hub.docker.com/u/infords).
1. Tag your docker image `docker tag <image id> infords/travis:v1`. You can find this ID with `docker image ls`.
1. Push to the repo either adding a new version or updating one with `docker push infords/travis:v1`
1. Any changes you make must be saved `docker commit travis-vm infords/travis:v1` where `travis-vm` is the NAMES of the container which you can see in `docker container ls`.
1. Push the repo if changes with the command from 2.

#### Debugging to Travis Builds

Since we are now on xenial on travis we can debug and load the travis builds as if they are a VM. This will let us debug build problems and even update visual regression tests. Most of this information is on the [travis site](https://docs.travis-ci.com/user/running-build-in-debug-mode/#Things-to-do-once-you-are-inside-the-debug-VM) but some of the gotchas are noted here.

1. Figure out the job ID by drilling into one of the jobs on the build, for example [234107789](https://travis-ci.com/infor-design/enterprise/jobs/234107789). The job ID is 234107789.
1. Make a file such as `debug.sh` file in the current director with the following contents.

```sh
curl -s -X POST -H "Content-Type: application/json" \
   -H "Accept: application/json" \
   -H "Travis-API-Version: 3" \
   -H "Authorization: token <token>" \
   -d '{ "quiet": false }' \
   https://api.travis-ci.com/job/<build-id>/debug
```

1. You may need to run `chmod +x debug.sh` to excute.
1. Run the command `debug.sh` and you should see a pending status.
1. Go back to the build for example [234107789](https://travis-ci.com/infor-design/enterprise/jobs/234107789) and you should see it starting up. It will run the initial setup ending with a command you can use to connect to at the end of the log.
1. Connect to the vm with the command noted for example `ssh GURDunMkqtCo3qmb891XRBTuJ@nyc1.tmate.io`.
1. You may need to reset or add a new ssh key. See the [github ssh page](https://help.github.com/en/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) for more info. I used `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`
1. Now you are connected! You can use this like a normal VM, debug, or create baselines as the following section but without the VM.
1. You may want to start the server in the background by running a command like `nohup npm run start &`
1. You may want to check the git branch you're on is correct and is not HEAD, so you can make commits.
1. You may want to run `PS1='\u:\W\$ '` to shorten the machine name on the command line.
1. Then you can run the tests with `npm run e2e:ci:debug`.
1. Disconnect to kill the build or cancel from the UI with the "Cancel Build" button.

#### Setting up a Docker environment manually

We kept the old instructions in needed to make the travis VM for now. See the Using the docker image section.

1. Push the branch you're working on to GitHub (we'll need it later).
1. In your terminal, run `docker run --name travis-vm -dit travisci/ubuntu-systemd:16.04` to download the Travis CI docker image to mimic the environment. And wait....
1. Open the image and go in: `docker exec -it travis-vm bash -l`
1. Get the latest updates using `apt-get update`.
1. Set the timezone for some tests

    ```sh
    apt-get install tzdata
    dpkg-reconfigure tzdata
    ```

1. Install a few more needed tools.

    ```sh
    apt-get install nano git-core curl wget sudo python make
    apt-get -f install
    ```

1. Install [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm#git-install) using the latest version available (check their Github for more info).
1. Update/Install Node.js

    ```sh
    nvm install 10
    nvm alias default {insert exact version}
    nvm use default
    ```

1. Go to your home directory `(cd /home/travis)`
1. Clone IDS Enterprise repo, and navigate into it

    ```sh
    git clone https://github.com/infor-design/enterprise.git
    ```

1. Checkout the branch you pushed to Github earlier.
1. Run the install commands: `npm install -g grunt-cli && npm install`
1. Set these [environment variables](https://docs.travis-ci.com/user/environment-variables/#default-environment-variables).
1. You may need to update the version of Chrome on the container:

    ```sh
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    sudo dpkg -i google-chrome*.deb
    ```

#### Generating a new set of Baseline images

1. Build the IDS Components:

    ```sh
    npx grunt
    ```

1. Run the `npm run quickstart` command in your current docker session to run the demoapp.
1. Open a second session in the docker container, and run `npm run e2e:ci` to start the tests.
    - Or you can `pico|vi` into one of the e2e test files, `fdescribe|fit` and `npm run e2e:ci:debug` to run individual tests instead of the whole suite

    ```sh
    npm run quickstart
    # In a new shell
    npm run e2e:ci
    ```

Some tests will most likely fail.  These failures are due to visual differences.  These are the images that need to be the new "baseline" images.

#### Replacing ALL Baseline images at once

1. Copy the file from the actual directory to the baseline directory.
1. Run the `npm run e2e:ci` again to tests.  Ensure that all the tests pass.
1. Commit and push the files to your branch.

#### Replacing specific baseline images

1. Remove the file from the baseline using a command like `rm test/baseline/<name-of-test-file.png>`
1. Run the tests and it should say `Failed - Image not found, saving current image as new baseline.`
1. Open a new shell on your local machine and copy the file and check it using: `docker cp <CONTAINER_ID>:/home/travis/enterprise/test/.tmp/actual/<name-of-test-file.png> /Users/<your_user_name>/<target_path>`
1. If it looks visually as expected then go back to your docker session and copy it to the baseline directory

    ```sh
    mv test/.tmp/actual/<name-of-test-file.png> test/baseline/<name-of-test-file.png>`
    ```

1. Run tests again to confirm.
1. Now you can move the files you copied to your local machine to the baseline directory to override the old ones.

    ```sh
    mv /Users/<your_user_name>/<target_path>/<name_of_test_file.png> test/baseline/<name_of_test_file.png>
    ```

1. Commit and push

#### Copying files locally for inspection

As mentioned, we can copy the last test run folder (actual) `test/.tmp/actual/<name-of-test-file.png>` and compare it to the baseline `test/baseline/<name-of-test-file.png>`. You use the docker cp command from your machine, and it goes into the container to copies the file out locally. Documentation for the command can be  [found here](https://docs.docker.com/engine/reference/commandline/cp/). Sample commands:

```sh
 docker cp <CONTAINER_ID>:/home/travis/enterprise/test/.tmp/actual/<name-of-test-file.png> /Users/<your_user_name>/<target_path>
cp <CONTAINER_ID>:/home/travis/enterprise/test/baseline/<name-of-test-file.png> /Users/<your_user_name>/<target_path>
```

For example:

```sh
docker cp ab2c46e49db9:/root/enterprise/test/.tmp/diff /Users/tmcconechy/dev/diff
```

Or copy them all to your local directory for inspection.

```sh
docker cp <CONTAINER_ID>:/home/travis/enterprise/test/.tmp .
```

See [https://stackoverflow.com/questions/22907231/copying-files-from-host-to-docker-container](https://stackoverflow.com/questions/22907231/copying-files-from-host-to-docker-container) for additional help

Once the files are copied to the host machine, check the image for quality, commit, and push.

Tests should now pass on the branch CI as the baselines should be identical to the screenshots created during the test.

## Making Accessibility e2e Tests with Axe

Each component should have a passing e2e test with Axe. This tool will verify a few things for accessibility. We current ignore the contrast errors. An example of an e2e test with Axe is:

```javascript
if (!utils.isIE()) {
  it('Should be accessible on click, and open with no WCAG 2AA violations', async () => {
    await clickOnDropdown();
    const res = await axePageObjects(browser.params.theme);

    expect(res.violations.length).toEqual(0);
  });
}
```

You should make a test for any states the component has, like closed vs open, selected, deselected ect. If your having an issue with one of these tests you can either put a debugger into the test and follow the above steps for debugging an e2e test or you can install the [Axe Chome Dev Tools Plugin](https://chrome.google.com/webstore/detail/axe/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US). This tool should give you the same output as the test.

## Testing Resources

### List of All "Matchers"

<https://jasmine.github.io/api/3.0/matchers.html>

### Testing Overview

<https://medium.com/powtoon-engineering/a-complete-guide-to-testing-javascript-in-2017-a217b4cd5a2a>
<https://blog.kentcdodds.com/write-tests-not-too-many-mostly-integration-5e8c7fff591c>
<http://jasonrudolph.com/blog/2008/10/07/testing-anti-patterns-potpourri-quotes-resources-and-collective-wisdom/>
<https://codecraft.tv/courses/angular/unit-testing/jasmine-and-karma/>
<https://hackernoon.com/testing-your-frontend-code-part-ii-unit-testing-1d05f8d50859>
