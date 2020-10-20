const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Application Menu index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-index');
  });

  it('should open when the hamburger button is clicked', async () => {
    const button = await element(by.css('.application-menu-trigger'));
    await button.click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress on example-index', async () => {
      const button = await element(by.css('.application-menu-trigger'));
      await button.click();

      const section = await element(by.css('body.no-scroll'));
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(section, 'applicationmenu')).toEqual(0);
    });
  }
});

describe('Application Menu filter tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-filterable');
  });

  it('should filter', async () => {
    const button = await element(by.css('#appmenu-searchfield'));
    await button.sendKeys('Role');
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css('.has-filtered-children')).last()), config.waitsFor);

    expect(await element.all(by.css('.accordion-header.filtered')).count()).toEqual(8);
    expect(await element.all(by.css('.accordion-header')).count()).toEqual(19);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Application Menu MenuButton tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-menubutton');
  });

  it('should have a working menu button', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css('.btn-menu')).last()), config.waitsFor);

    const menuButton = await element(by.css('.btn-menu'));
    await menuButton.click();

    expect(await element(by.id('popupmenu-2')).isDisplayed()).toBeTruthy();
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Application Menu open on large tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-open-on-large');
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('application-menu'))), config.waitsFor);
  });

  it('should be open on intialization', async () => {
    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Application Menu container tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-container');
    await browser.driver.sleep(config.sleep);
  });

  it('should display without visual bugs', async () => {
    const button = await element(by.css('.application-menu-trigger'));
    await button.click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
    expect(await element.all(by.css('.accordion-header')).count()).toEqual(17);
    expect(await element.all(by.css('.accordion-header')).first().isDisplayed()).toBeTruthy();

    await utils.checkForErrors();
  });
});

describe('Application Menu accordion truncated text tooltip tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-tooltips');

    const truncatedText = await element(by.id('truncated-text'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(truncatedText), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should show a tooltip on truncated text', async () => {
    await browser.actions().mouseMove(element(by.id('truncated-text'))).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('tooltip'))), config.waitsFor);

    expect(await element(by.id('tooltip')).isPresent()).toBeTruthy();
  });
});

describe('Application Menu personalize tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-personalized');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should show the app menu', async () => {
    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress when personalized', async () => {
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(1280, 718);
      const section = await element(by.css('body.no-scroll'));
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(section, 'applicationmenu-personalize')).toEqual(0);
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }
});

describe('Application Menu personalize roles tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-personalized-roles.html?colors=390567');
    await browser.driver.sleep(config.sleep);
  });

  it('should show the app menu', async () => {
    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress on personalize roles', async () => {
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(1280, 718);
      const section = await element(by.css('body.no-scroll'));
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(section, 'applicationmenu-personalize-roles')).toEqual(0);
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }
});

describe('Application Menu personalize roles switcher tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-personalized-role-switcher');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should show the app menu', async () => {
    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress on personalize roles switcher', async () => {
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(1280, 718);
      const section = await element(by.css('body.no-scroll'));
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(section, 'applicationmenu-personalize-roles-switcher')).toEqual(0);
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }

  it('should dismiss the application menu when clicking on a popupmenu trigger', async () => {
    // NOTE: This only happens on mobile, and when `ApplicationMenu.settings.dismissOnClickMobile: true;`
    const windowSize = await browser.driver.manage().window().getSize();

    // Simulate iPhone X device size.
    // Shrinking the screen causes the menu to be dismissed.
    await browser.driver.manage().window().setSize(375, 812);
    await browser.driver.sleep(config.sleep);

    // Reactivate App Menu
    await element(by.css('#hamburger-button')).click();
    await browser.driver.sleep(config.sleep);

    // Click more actions button, app menu should dismiss again.
    await element(by.css('#header-more-actions')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('application-menu')).getAttribute('class')).not.toContain('is-open');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('should dismiss the application menu when clicking on one of the menu\'s toolbar buttons', async () => {
    // NOTE: This only happens on mobile, and when `ApplicationMenu.settings.dismissOnClickMobile: true;`
    const windowSize = await browser.driver.manage().window().getSize();

    // Simulate iPhone X device size.
    // Shrinking the screen causes the menu to be dismissed.
    await browser.driver.manage().window().setSize(375, 812);
    await browser.driver.sleep(config.sleepLonger);

    // Reactivate App Menu
    await element(by.css('#hamburger-button')).click();
    await browser.driver.sleep(config.sleepLonger);

    // Click the first button in the Application Menu toolbar
    await element(by.css('#appmenu-header-toolbar-btn-download')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.id('application-menu')).getAttribute('class')).not.toContain('is-open');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });
});

describe('Application Menu role switcher tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-personalized-role-switcher-long-title');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should have a working role switcher with long title', async () => {
    const btnSel = '.application-menu-switcher-trigger';
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css(btnSel)).last()), config.waitsFor); // eslint-disable-line

    const btnEl = await element(by.css(btnSel));
    await btnEl.click();

    expect(await element(by.css('.application-menu-switcher-panel')).isDisplayed()).toBeTruthy();
  });

  it('can dismiss the role switcher by pressing Escape', async () => {
    const btnSel = '.application-menu-switcher-trigger';
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css(btnSel)).last()), config.waitsFor); // eslint-disable-line

    const btnEl = await element(by.css(btnSel));
    await btnEl.click();

    expect(await element(by.css('.application-menu-switcher-panel')).isDisplayed()).toBeTruthy();

    await browser.driver.actions().sendKeys(protractor.Key.ESCAPE).perform();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.application-menu-switcher-panel')).isDisplayed()).toBeFalsy();
  });
});

describe('Application Menu custom search tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-filterable-custom');
  });

  it('should show the search even though filterable is false', async () => {
    expect(await element(by.css('#application-menu-searchfield')).isPresent()).toBeTruthy();
  });

  it('should have a search but not filter the menu when filterable is false', async () => {
    const button = await element(by.css('#application-menu-searchfield'));
    await button.sendKeys('Role');
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.accordion-header.filtered')).count()).toEqual(0);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Application Menu Many Items tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-filterable-many-items');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Application Menu Event Propagation Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-click-event-propagation');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('#application-menu.is-open'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should fire a toast when its accordion headers are clicked', async () => {
    const thirdHeader = await element(by.css('#application-menu > div > div:nth-child(3)'));
    await thirdHeader.click();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    expect(await element(by.id('toast-container'))).toBeTruthy();
  });
});

describe('Application Menu Manual Init Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-manual-init');
  });

  it('should open when the hamburger button is clicked', async () => {
    const button = await element(by.css('.application-menu-trigger'));
    await button.click();
    await browser.driver.sleep(config.sleepLonger);
    await utils.checkForErrors();

    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
  });
});
