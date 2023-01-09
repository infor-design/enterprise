# Testing

The IDS components are backed by both functional and puppeteer (e2e) test suites.  When contributing to the IDS enterprise project, before we can accept pull requests we expect that new tests will be provided to prove that new functionality works, and that all existing tests pass.

## Test Stack

- [Jest](https://jestjs.io/) test runner for all tests.
- [Protractor](https://pptr.dev/) for controlling e2e tests.
- [Github Actions](https://github.com/features/actions) for continuous integration (CI). See `.github/workflows` folder for current implementation
- [Browser Stack](https://www.browserstack.com/) for testing specific browsers.

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

- Keep the test as simple as possible and just test one thing per test
- Try not repeat yourself in tests. For example if you covered some functionality in one page, no need to test the same thing in another page.

## Running Functional Tests

Functional tests can be run in multiple modes.

For development purposes you may just want to run one test your focusing on.

```sh
npm run test -- partial-test-name
```

To run the tests as a CI environment would (Git Hub Actions), use:

```sh
npm run test
```
## Puppeteer Conversion Notes

1. Click an element

Protractor:

```js
const buttonEl = await element(by.id('about-trigger'));
await buttonEl.click();
```

Puppeteer:

```js
await page.click('#about-trigger');
```

1. Waiting for an element to be visible

Protractor:

```js
await browser.driver
    .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('myId'))), config.waitsFor);
```

Puppeteer:

```js
page.waitForSelector('#myId', { visible: true });
```

1. Check an element's text

Protractor:

```js
const text = await element(by.css('.modal-body')).getText()
```

Puppeteer:

```js
await page.$eval('.modal-body .version', el => el.textContent));
```

1. Get an elements attributes

Protractor:

```js
await element(by.css('html')).getAttribute('data-sohoxi-version'));
```

Puppeteer:

```js
await page.$eval('html', el => el.getAttribute('data-sohoxi-version'));
```

1. Send a key

Protractor:

```js
await browser.driver.actions().sendKeys(protractor.Key.ESCAPE).perform();
```

Puppeteer:

```js
await page.keyboard.press('Escape');
```

## Visual Regression testing in Puppeteer

We use jest image snapshots to provide the visual regression testing. We still need to use VM to generate the baseline images that will pass in the CI.

Here's the example code:

```javascript
it('should not visual regress', async () => {
  await page.setViewport({ width: 1200, height: 800 });
  await page.click('#add-context');
  await page.waitForSelector('.overlay', { visible: true });

  expect(await page.waitForSelector('.modal.is-visible.is-active')).toBeTruthy();

  // Need a bit of delay to show the modal perfectly
  await page.waitForTimeout(200);

  // Screenshot of the page
  const image = await page.screenshot();

  // Set a custom name of the snapshot
  const config = getConfig('modal-open');
  expect(image).toMatchImageSnapshot(config);
});
```

To generate the baseline image, you need to run `npm run test -- component-name-puppeteer-visual-test`. Running the same command to check if the image passed. You will see the generated image/s under `test/baseline-images`.

As of now, if you generate this to your local environment, it will pass but it will fail in the CI because our pipeline is running on ubuntu. Suggesting to generate it via VM. See the - [Working with Visual Regression Tests](#working-with-visual-regression-tests) for docker image.

If you need to update ALL components baseline images, run `npm run update-imagesnapshots`. If you just need to update the baseline image of a specific component, run `npm run update-imagesnapshots component-name`.

## Sequence for Running e2e tests locally

```sh
# In one shell
npm run start
# In a new shell
npm run test
```

## Debugging Functional Tests

- Add a debugger statement to the test

```js
  it('adds 1 + 2 to equal 3', () => {
    debugger;
    expect(1 + 2).toBe(3);
  });
```
- You can also debug a single test with a partial name of the test behind `--` for example `node --inspect-brk node_modules/.bin/jest --config=test/jest.config.cjs --runInBand -- component-func`
- In chrome go to url `chrome://inspect/`
- Click the "inspect" target and then click go in the debugger to get to your test debug point

## Making Accessibility e2e Tests with Axe

Each component should have a passing puppeteer test with Axe. This tool will verify a few things for accessibility. We current ignore the contrast errors. An example of an puppeteer test with Axe is:

```javascript
it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });

    const results = await new AxePuppeteer(page).disableRules(['meta-viewport']).analyze();
    expect(results.violations.length).toBe(0);
});
```

 If your having an issue with one of these tests you can either put a debugger into the test and follow the above steps for debugging a jest test or you can install the [Axe Chrome Dev Tools Plugin](https://chrome.google.com/webstore/detail/axe/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US). This tool should give you the same output as the test.
