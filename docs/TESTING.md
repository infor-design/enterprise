# Tests

## Running Functional Tests

`npm run functional:ci` to run all tests, and exit immediately

To develop in watch mode, please run

`npm run functional:local`

For test isolation, please see [Debugging Test Tips](#debugging-tests-tips)

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
env PROTRACTOR_SPECS='components/dropdown/dropdown.e2e-spec.js' npm run e2e:local
```

Isolate your tests then run with the keys in your path.

```sh
npm start
npm run e2e:bs
 ```

One way to update your .zprofile, .bashprofile, .bashrc, or .zshrc, or append the value on the command by setting env, `env BROWSER_STACK_USERNAME=''... #followed by the command`.

```sh
export BROWSER_STACK_USERNAME=xxxxxxxxxxxxx
export BROWSER_STACK_ACCESS_KEY=yyyyyyyyyyy
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

For test isolation, please see [Debugging Test Tips](#debugging-tests-tips)

- Isolate the test or suite using `fdescribe` or `fit` <https://jasmine.github.io/api/edge/global.html#fdescribe)> <https://jasmine.github.io/api/edge/global.html#fit>
- Run `npm run functional:local`, wait for karma server to start, and to place tests in watch mode
- Navigate to <http://localhost:9876/>
- Open Chrome Dev Tools
- Refresh the page, to rerun the tests, the Sources tab should be open, the script should paused on the `debugger;` statement

## Debugging E2E Tests

For test isolation, please see [Debugging Test Tips](#debugging-tests-tips)

- Put a `debugger;` statement at a place in the test/code
- Isolate the test or suite using `fdescribe` or `fit` <https://jasmine.github.io/api/edge/global.html#fdescribe)> <https://jasmine.github.io/api/edge/global.html#fit>
- If interested in the Axe results put it under the `res = await AxeBuilder` command.
- Start the server normally with `npm run quickstart` or `npm run start`
- In another terminal, run the functional test with for example `env ENTERPRISE_THEME='high-contrast' npx -n=--inspect-brk protractor test/protractor.local.debug.conf.js` in watch mode
- In Chrome open `chrome://inspect` in a new tab.
- Click on the 'Target' you will see generated under remote target
- Hit go on the debugger
- If interested in the Axe results you can view `res.violations` in the console

## Working With Visual Regression Tests

Currently On-Hold until running ci is figured out see: [SOHO-7464](https://jira.infor.com/browse/SOHO-7464)

- Create a e2e test similar to the following...

```javascript
if (utils.isChrome()) {
    it('Should not visual regress', async () => {
        const textareaEl = await element(by.id('description-max'));
        await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(textareaEl), config.waitsFor);

        expect(await browser.protractorImageComparison.checkScreen('textarea')).toEqual(0);
    });
}
```

- run this test once and it will generate an error and create a baseline file (in tests/.tmp)
- copy this file out to the baseline folder if it looks correct
- next time you run it will compare this.

### Testing Coverage Rating Scale

☹️ 😕 🙂 😁

Component | Functional Test Coverage
------------- | :-------------:
Button | 😁
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

- `[Visual Regression]` Maintaining baseline screenshots across different environments is problematic, and not consistent. The same machines need to run comparisons. Different machines can be generated their own screenshots, and compare them to screenshots on other system.
- `[Browser driver differences]` Lack of process to automate a record of differences to to aid reduction of manual testing. Lack of process to check automated tests manually
