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

## Running E2E Tests

Run a specific E2E component locally (Only Chrome or Firefox)

```sh
npm start
#leave the server running, and create a new terminal window in the same directory. Now, run
env PROTRACTOR_SPECS='components/dropdown/dropdown.e2e-spec.js' npm run e2e:local:debug
```

Isolate your tests then run with the keys in your path.

```sh
npm start
#leave the server running, and create a new terminal window in the same directory. Now, run
npm run e2e:local:bs
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
    expect(await browser.protractorImageComparison.checkElement(dropdownEl, 'dropdown-init')).toEqual(0);
    await clickOnDropdown();
    // Wait for animations to complete
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownElList), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    // Test open state
    expect(await browser.protractorImageComparison.checkElement(dropdownElList, 'dropdown-open')).toEqual(0);
  });
}
```

Follow [this guide](https://docs.travis-ci.com/user/common-build-problems/#troubleshooting-locally-in-a-docker-image) in order to debug Travis. We currently use the `node_js` [image](https://hub.docker.com/r/travisci/ci-nodejs/)

Travis commands can be found in the [.travis.yml](https://github.com/infor-design/enterprise/blob/master/.travis.yml), this will need to be replicated inside of the container. This process is outlined below.

### Creating Baseline Screenshots

In order to create Baseline screenshots, it's necessary to emulate the actual TravisCI environment in which the visual regression testing will take place.  Running the tests in an environment that's different than the one the images were generated against will create extreme differences in the rendered IDS components, possibly causing false test failures.

Following the process below will safely create baseline images the CI can use during visual regression tests.

#### Setting up the Docker environment

**NOTE:** assuming the technology stack doesn't change between versions, the series of steps outlined here may only need to be performed once.

1. Push the branch you're working on to GitHub (we'll need it later).
1. In your terminal, run `docker run --name travis-debug -dit travisci/ci-garnet:packer-1512502276-986baf0` to download the Travis CI docker image to mimic the environment. And wait....
1. Open up the image and go in `docker exec -it travis-debug bash -l`
1. Install [Node Version Manager (nvm)](https://github.com/creationix/nvm) using the latest version available (check their Github for more info)
1. Set the timezone for some tests `cp /usr/share/zoneinfo/America/New_York /etc/localtime`

```sh
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

1. Switch to the Travis user `su - travis`
1. Update/Install Node.js

```sh
nvm install 10
nvm use 10
```

1. Go to your home directory `(cd ~)`
1. Clone IDS Enterprise repo, and navigate to it

```sh
git clone https://github.com/infor-design/enterprise.git
```

1. Switch to the branch you pushed to Github earlier.
1. Run the install commands from `npm install -g grunt-cli && npm install`
1. May need to update the version of Chrome on the container:

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

1. Copy the file from the actual folder to the baseline
1. Run the `npm run e2e:ci` again to tests.  Ensure that all the tests pass.
1. Commit and push the files to your branch.

#### Replacing specific baseline images

1. Remove the file from the baseline using a command like `rm test/baseline/<name-of-test-file.png>`
1. Run the tests and it should say `Image not found, saving current image as new baseline.`
1. Open a new shell on your local machine and copy the file and check it using: `docker cp <CONTAINER_ID>:/home/travis/enterprise/test/.tmp/actual/<name-of-test-file.png> /Users/<your_user_name>/<target_path>`
1. If it looks visually as expected then copy it to the baseline

```sh
mv test/.tmp/actual/<name-of-test-file.png> test/baseline/<name-of-test-file.png>`
```

1. Run tests again to confirm
1. Commit and push

#### Copying files locally for inspection

As mentioned, we can copy the last test run folder (actual) `test/.tmp/actual/<name-of-test-file.png>` and compare it to the baseline `test/baseline/<name-of-test-file.png>`. You use the docker cp command from your machine, and it goes into the container to copies the file out locally. Documentation for the command can be  [found here](https://docs.docker.com/engine/reference/commandline/cp/). Sample commands:

```sh
 docker cp <CONTAINER_ID>:/home/travis/enterprise/test/.tmp/actual/<name-of-test-file.png> /Users/<your_user_name>/<target_path>
cp <CONTAINER_ID>:/home/travis/enterprise/test/baseline/<name-of-test-file.png> /Users/<your_user_name>/<target_path>
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
