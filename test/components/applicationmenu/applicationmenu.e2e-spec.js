const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Applicationmenu index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-index');
  });

  it('Should show the app menu', async () => {
    const button = await element(by.css('.application-menu-trigger'));
    await button.click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-index', async () => {
      const button = await element(by.css('.application-menu-trigger'));
      await button.click();

      const section = await element(by.css('body.no-scroll'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(section, 'applicationmenu')).toEqual(0);
    });
  }
});

describe('Applicationmenu filter tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-filterable');
  });

  it('Should filter', async () => {
    const button = await element(by.css('#application-menu-searchfield'));
    await button.sendKeys('Role');
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css('.has-filtered-children')).last()), config.waitsFor);

    expect(await element.all(by.css('.accordion-header.filtered')).count()).toEqual(8);
    expect(await element.all(by.css('.accordion-header')).count()).toEqual(19);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Applicationmenu menubutton tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-menubutton');
  });

  it('Should have a working menu button', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css('.btn-menu')).last()), config.waitsFor);

    const menuButton = await element(by.css('.btn-menu'));
    await menuButton.click();

    expect(await element(by.id('popupmenu-2')).isDisplayed()).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Applicationmenu open on large tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-open-on-large');
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('application-menu'))), config.waitsFor);
  });

  it('Should have menu open', async () => {
    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Applicationmenu container tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-container');
    await browser.driver.sleep(config.sleep);
  });

  it('Should show the app menu', async () => {
    const button = await element(by.css('.application-menu-trigger'));
    await button.click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
    expect(await element.all(by.css('.accordion-header')).count()).toEqual(17);
    expect(await element.all(by.css('.accordion-header')).first().isDisplayed()).toBeTruthy();

    await utils.checkForErrors();
  });
});

describe('Applicationmenu accordion truncated text tooltip tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-tooltips');

    const truncatedText = await element(by.id('truncated-text'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(truncatedText), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show tooltip on truncated text', async () => {
    await browser.actions().mouseMove(element(by.id('truncated-text'))).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('tooltip'))), config.waitsFor);

    expect(await element(by.id('tooltip')).isPresent()).toBeTruthy();
  });
});

describe('Applicationmenu Personalization tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-personalized-roles.html?colors=390567');
    await browser.driver.sleep(config.sleep);
  });

  it('Should show the app menu', async () => {
    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visually regress on personalize', async () => {
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(1280, 718);
      const section = await element(by.css('body.no-scroll'));
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.protractorImageComparison.checkElement(section, 'applicationmenu-personalize-roles')).toEqual(0);
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }
});

describe('Applicationmenu role switcher tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-personalized-role-switcher-long-title');
  });

  it('Should have a working role switcher with long title', async () => {
    const btnSel = '.application-menu-switcher-trigger';
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css(btnSel)).last()), config.waitsFor); // eslint-disable-line

    const btnEl = await element(by.css(btnSel));
    await btnEl.click();

    expect(await element(by.css('.application-menu-switcher-panel')).isDisplayed()).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Applicationmenu custom search tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-filterable-custom');
  });

  it('Should show the search even though filterable is false', async () => {
    expect(await element(by.css('#application-menu-searchfield')).isPresent()).toBeTruthy();
  });

  it('Should have a search but not filter the menu when filterable is false', async () => {
    const button = await element(by.css('#application-menu-searchfield'));
    await button.sendKeys('Role');
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.accordion-header.filtered')).count()).toEqual(0);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Applicationmenu Many Items tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-filterable-many-items');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});
