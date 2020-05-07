const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Flex toobar ajax tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/toolbar-flex/example-more-actions-ajax?layout=nofrills');

    const flexToolbarEl = await element(by.id('flex-toolbar'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(flexToolbarEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visually regress', async () => {
      const flexToolbarEl = await element(by.className('no-frills'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(flexToolbarEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(flexToolbarEl, 'flextool-index')).toEqual(0);
      await element(await by.css('button#menu-button')).click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(flexToolbarEl, 'flextool-index-open-menu-button')).toEqual(0);
      browser.driver.actions().mouseMove(element(by.css('#menu-button-popupmenu li.submenu'))).perform();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(flexToolbarEl, 'flextool-index-open-menu-button-submenu')).toEqual(0);
      await element(await by.css('button.btn-actions')).click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(flexToolbarEl, 'flextool-index-open-more-menu')).toEqual(0);
      browser.driver.actions().mouseMove(element(by.css('ul#popupmenu-2 li:nth-child(7)'))).perform();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(flexToolbarEl, 'flextool-index-open-more-menu-submenu')).toEqual(0);

      // shrink the page to check ajax menu button in the overflow
      const windowSize = await browser.driver.manage().window().getSize();
      browser.driver.manage().window().setSize(450, 1000);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(flexToolbarEl, 'flextool-index')).toEqual(0);
      await element(await by.css('button.btn-actions')).click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(flexToolbarEl, 'flextool-index-open-more-menu')).toEqual(0);
      browser.driver.actions().mouseMove(element(by.css('ul#popupmenu-2 li:nth-child(2)'))).perform();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(flexToolbarEl, 'flextool-index-open-more-menu-overflowed-menu-button')).toEqual(0);
      browser.driver.actions().mouseMove(element(by.css('ul#popupmenu-2 li:nth-child(2) li.submenu'))).perform();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(flexToolbarEl, 'flextool-index-open-more-menu-overflowed-menu-button-submenu')).toEqual(0);
      await element(await by.css('button#menu-button')).click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(flexToolbarEl, 'flextool-index-open-menu-button')).toEqual(0);
      browser.driver.actions().mouseMove(element.all(by.css('ul#menu-button-popupmenu')).first()).perform();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(flexToolbarEl, 'flextool-index-open-menu-button-submenu')).toEqual(0);
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }
});
