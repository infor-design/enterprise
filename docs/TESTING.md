# Tests

## Running Functional Tests

`npm run functional:ci` to run all tests, and exit immediately

To develop in watch mode, please run

`npm run functional:local`

## Running Tests Silently for Continuous Integration (CI)

```sh
npm run functional:ci
npm quickstart #demo app server needed for e2e:ci
npm run e2e:ci
```

Check out the `.travis.yml` at root for actual implementation on Travis CI

## Running BrowserStack Tests for Continuous Integration (CI) (WIP)

This will be ran in the evening (EST) in NYC, and tests <http://master-enterprise.demo.design.infor.com> by default

`npm run e2e:ci:bs`

## Running E2E Tests

Run a specific E2E component locally (Only Chrome or Firefox)

```sh
npm start
env PROTRACTOR_SPECS='components/dropdown/dropdown.e2e-spec.js' npm run e2e:local:debug
```

Isolate your tests then run with the keys in your path.

```sh
npm start
npm run e2e:local:bs
 ```

Update your .zprofile, .bashprofile, .bashrc, or .zshrc

```sh
export BROWSERSTACK_USERNAME=<browserstack-username>
export BROWSERSTACK_ACCESS_KEY=<browserstack-access-key>
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
- Click on the 'Target' you will see generated under remote target
- Hit resume/play on the debugger

## Working With Visual Regression Tests

A visual regression test will be similar to the following code snippet. But because the tests run on ci in travis we need to mimic the screen shots on that environment. So you'll need to do some setup with docker (that will probably only work well on Mac).

```javascript
// Only test visual regressions on Chrome, and the CI
if (utils.isChrome() && utils.isCI()) {
  it('Should not visual regress', async () => {
    const dropdownEl = element(by.css('div[aria-controls="dropdown-list"]'));
    const dropdownElList = element(by.id('dropdown-list'));
    // Wait for animations to complete
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
    await browser.driver.sleep(config.waitsFor);

    // Test init/default state
    expect(await browser.protractorImageComparison.checkElement(dropdownEl, 'dropdown-init')).toEqual(0);
    await clickOnDropdown();
    // Wait for animations to complete
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownElList), config.waitsFor);
    await browser.driver.sleep(config.waitsFor);

    // Test open state
    expect(await browser.protractorImageComparison.checkElement(dropdownElList, 'dropdown-open')).toEqual(0);
  });
}
```

The next instructions are based on following [this guide](https://docs.travis-ci.com/user/common-build-problems/#Troubleshooting-Locally-in-a-Docker-Image) in order to debug Travis. We use the `node_js` [image](https://hub.docker.com/r/travisci/ci-nodejs/)

Many of the travis commands ran can be found in the [.travis.yml](https://github.com/infor-design/enterprise/blob/master/.travis.yml).

### Creating Baseline Screenshots

1. Run `docker run --name travis-debug -dit travisci/ci-garnet:packer-1512502276-986baf0` to download the travis ci docker image to mimic the environment. And wait....
1. Open up the image and go in `docker exec -it travis-debug bash -l`
1. Switch to the travis user `su - travis`
1. Go to home you home directory `(`cd ~`)`
1. Clone ids

```sh
git clone https://github.com/infor-design/enterprise.git
```

1. Run the install commands from `npm install -g grunt-cli && npm install`
1. May need to update chrome with.

```sh
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome*.deb
```

1. Update/Install node.js

```sh
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```

1. Run the travis commands as per the build

```sh
npm run quickstart && npm run e2e:ci
```

1. Push the branch your working on to github

```sh
git commit --all && git push
```

Copy `.tmp/actual` verified screenshots to the `baseline` folder for testing, locally, from the Docker container. [Copy](https://docs.docker.com/engine/reference/commandline/cp/) actual screenshots from .tmp/actual/*.png using.

```sh
docker cp INSERT_CONTAINER_ID:/home/travis/enterprise/test/.tmp .
```

See [https://stackoverflow.com/questions/22907231/copying-files-from-host-to-docker-container](https://stackoverflow.com/questions/22907231/copying-files-from-host-to-docker-container) for additional help

Move `.tmp/actual` verified screenshots to the `baseline` folder for testing, locally, and in the Docker container. Open the Docker container shell, navigate to Enterprise repo, and run `npm start`
For convenience, open another shell under the travis user, and `npm run e2e:ci`.

Once the files are copied to the host machine, check the image for quality, commit, and push.

Tests should now pass on the branch CI as the baselines should identical to the screenshots created during the test.

### Testing Coverage Rating Scale

☹️ 😕 🙂 😁

Component | Functional Test Coverage
------------- | :-------------:
Button | 😁
Datagrid | 🙂
Dropdown | ☹️
Hierarchy | 😕
MultiSelect | 🙂
Popupmenu | 😕
Textarea | 😁
Treemap | 🙂
Validation | ☹️

## Testing Resources

### List of All "Matchers"

<https://jasmine.github.io/api/3.0/matchers.html>

### Testing Overview

<https://medium.com/powtoon-engineering/a-complete-guide-to-testing-javascript-in-2017-a217b4cd5a2a>
<https://blog.kentcdodds.com/write-tests-not-too-many-mostly-integration-5e8c7fff591c>
<http://jasonrudolph.com/blog/2008/10/07/testing-anti-patterns-potpourri-quotes-resources-and-collective-wisdom/>
<https://marcysutton.github.io/a11y-and-ci/#/>
<https://codecraft.tv/courses/angular/unit-testing/jasmine-and-karma/>
<https://hackernoon.com/testing-your-frontend-code-part-ii-unit-testing-1d05f8d50859>

## FAQ

- How come we do so much browser exclusion logic?

    Each browser has a different Selenium driver with different capabilities. We plan highlight this difference for manual testing. As browser capabilities get updated, we should revisit tests that don't work. As for the Chrome exclusions, we are only testing visual regression on Chrome. Chrome is the default local functional test browser, and will be responsible for aiding the creation of the baseline images for visual regression testing.

- Why are so many Axe Rules disabled?

    This a bit complex as the light theme is not completely WCAG AA... and per component in various states (open/close) may not be WCAG 2AA as well. Additional various rules are at the application level and not suitable for review on this level. Currently, this is a @TODO, we hope to enable rules like "color-contrast" which are critical to various users.

## E2E Problems

- `[Browser driver differences]` Lack of process to automate a record of differences to to aid reduction of manual testing. Lack of process to check automated tests manually
