# Testing

The IDS components are backed by the [Playwright](https://playwright.dev/).  When contributing to the IDS enterprise project, we expect that new tests will be provided to prove that new functionality works, and that all existing tests pass.

## Test Stack

- [Playwright](https://playwright.dev/) test runner for all tests.
- [Github Actions](https://github.com/features/actions) for continuous integration (CI). See `.github/workflows` folder for current implementation
- [Browser Stack](https://www.browserstack.com/) for testing specific browsers.
- [percy.io/](https://percy.io/) for visual regression testing

## Writing Tests

### Naming Conventions for Tests

- Use plain and proper English.
- Describe what the test is testing.
- Component and/or example page name should be part of the `describe()` statement.  Do not write it again as part of the `test()` statement.

#### test() name examples

- `Should do [x] when [y] happens`
- `Should be possible to [x]`
- `Should be able to [x]`
- `Should open [x] on click`
- `Should do [x] on [y] key`
- `Will do [x] when also doing [y]`

#### Best Practices for Tests

- Keep the test as simple as possible and just test one thing per test
- Try not repeat yourself in tests. For example if you covered some functionality in one component page, no need to test the same thing in another page.

## Running Tests

Tests can be run in multiple modes.

To simply run all tests:

```sh
npm run test
```

For development purposes you may just want to run one test your focusing on.

```sh
npm run test -- component_name
```

## Visual Testing with Percy and Playwright

This project demonstrates how to perform visual testing using Percy and Playwright. Visual testing helps ensure that UI changes do not introduce unexpected visual regressions. The provided example captures visual snapshots of different UI states to verify consistent rendering.

### Table of Contents

- [Introduction](#introduction)
- [Example Test](#example-test)
- [Usage](#usage)
- [Best Practices](#best-practices-for-visual-testing)

### Introduction

Visual testing is a crucial part of maintaining a consistent user interface. By comparing the appearance of web pages or components against known good baselines, visual testing tools like Percy can automatically detect unintended visual changes.

### Example Test

```javascript
test.describe('snapshot tests', () => {
  test('should match the visual snapshot in percy', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    // Function to handle the actions and snapshot for specific row option
    const captureSnapshot = async (option, snapshotName) => {
      await page.locator('#custom-id-actions').click();
      await page.locator(`a[data-option="row-${option}"]`).click();

      // Capture a Percy snapshot with the specified name
      await percySnapshot(page, snapshotName);
    };

    // Capture snapshot for "extra-small" row height
    await captureSnapshot('extra-small', 'datagrid-expandable-row-extra-small-padding');

    // Capture snapshot for "small" row height
    await captureSnapshot('small', 'datagrid-expandable-row-small-padding');

    // Capture snapshot for "medium" row height
    await captureSnapshot('medium', 'datagrid-expandable-row-medium-padding');

    // Capture snapshot for "large" / "Normal" row height
    await captureSnapshot('large', 'datagrid-expandable-row-large-padding');
  });
});
```

### Usage

To run the visual tests locally, you can use the following command:

Run all visual tests:

```sh
PERCY_TOKEN=your-percy-token npm run test:visual
```

Run specific tests:

```sh
PERCY_TOKEN=your-percy-token npm run test:visual -- component_name
```

For the visual tests to work, you need to set the `PERCY_TOKEN` environment variable to your Percy token. You can find your Percy token in your Percy project settings.

### Best Practices for Visual Testing

- Run Visual Tests in a Stable Environment: Ensure that tests are run in a consistent and stable environment to avoid flaky results.
- Test Across Browsers: Consider capturing snapshots in multiple browsers to catch cross-browser inconsistencies.
- Review Snapshots Regularly: Regularly review and approve or reject snapshot changes to keep the baseline up-to-date.
- Use Percy's Review Workflow: Use Percy's review workflow to collaborate with your team and ensure that visual changes are intentional.

## Debugging Functional Tests

- Use the [visual code plugin](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- Open the test file you want to debug
- Add a breakpoint  on the side panel in the test and click on the green button

## Add Accessibility Tests with Axe

Each component should have a passing test with Axe. This tool will verify a few things for accessibility. We current ignore the contrast errors on disabled items. Ignoring zoom may also be needed. An example of a test with Axe is:

```javascript
  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules(['meta-viewport'])
        .exclude('[disabled]')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });
```

 If your having an issue with one of these tests you can either debug and follow the above steps for debugging a test or you can install the [Axe Chrome Dev Tools Plugin](https://chrome.google.com/webstore/detail/axe/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US). This tool should give you the same output as the test when you run the page on port 4000 instead of 3000 as the tests do.

## Contributing

 Contributions are welcome! If you have suggestions or improvements, please submit a pull request.

## Reusing Tests Across Repos

Listing some common differences in reusing the tests.

- This repo uses js, web components and `enterprise-ng` use typescript for the extension and you will have to remove types
- The may have different component names, and page names (soho vs ids vs no prefix)
