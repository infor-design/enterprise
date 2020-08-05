const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

async function checkLeftAndTop(elem, pos) {
  const elemStyle = await elem.getAttribute('style');
  expect(elemStyle).toContain(`left: ${pos.left};`);
  expect(elemStyle).toContain(`top: ${pos.top};`);
}

describe('Homepage example hero widget tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/homepage/example-hero-widget.html');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('body'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('homepage-hero-widget')).toEqual(0);
    });
  }
});

describe('Homepage example editable tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/homepage/example-editable.html');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('body'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      browser.actions().mouseMove(element(by.css('.widget'))).perform();

      expect(await browser.imageComparison.checkScreen('homepage-editable')).toEqual(0);
    });
  }
});

describe('Homepage example five column tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/homepage/example-five-column.html');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should position widgets properly at 1920px x 1080px', async () => {
    const pos = [
      { left: '0px', top: '0px' },
      { left: '380px', top: '0px' },
      { left: '760px', top: '0px' },
      { left: '1140px', top: '0px' },
      { left: '1520px', top: '0px' },
      { left: '0px', top: '390px' },
      { left: '380px', top: '390px' },
      { left: '760px', top: '390px' },
      { left: '1140px', top: '390px' },
      { left: '1520px', top: '390px' },
      { left: '0px', top: '780px' },
      { left: '380px', top: '780px' },
      { left: '760px', top: '780px' },
      { left: '1140px', top: '780px' },
      { left: '1520px', top: '780px' }
    ];
    await browser.driver.manage().window().setSize(1920, 1080);
    await browser.driver.sleep(config.sleep);
    const widgets = await element.all(await by.css('.homepage .widget'));
    const len = await widgets.length;

    expect(await len).toEqual(pos.length);
    for (let i = 0; i < len; i++) {
      await checkLeftAndTop(widgets[i], pos[i]); // eslint-disable-line
    }
  });

  it('Should position widgets properly at 1680px x 1050px', async () => {
    const pos = [
      { left: '0px', top: '0px' },
      { left: '380px', top: '0px' },
      { left: '760px', top: '0px' },
      { left: '1140px', top: '0px' },
      { left: '0px', top: '390px' },
      { left: '380px', top: '390px' },
      { left: '760px', top: '390px' },
      { left: '1140px', top: '390px' },
      { left: '0px', top: '780px' },
      { left: '380px', top: '780px' },
      { left: '760px', top: '780px' },
      { left: '1140px', top: '780px' },
      { left: '0px', top: '1170px' },
      { left: '380px', top: '1170px' },
      { left: '760px', top: '1170px' }
    ];
    await browser.driver.manage().window().setSize(1680, 1050);
    await browser.driver.sleep(config.sleep);
    const widgets = await element.all(await by.css('.homepage .widget'));
    const len = await widgets.length;

    expect(await len).toEqual(pos.length);
    for (let i = 0; i < len; i++) {
      await checkLeftAndTop(widgets[i], pos[i]); // eslint-disable-line
    }
  });

  it('Should position widgets properly at 1200px x 1600px', async () => {
    const pos = [
      { left: '0px', top: '0px' },
      { left: '380px', top: '0px' },
      { left: '760px', top: '0px' },
      { left: '0px', top: '390px' },
      { left: '380px', top: '390px' },
      { left: '760px', top: '390px' },
      { left: '0px', top: '780px' },
      { left: '380px', top: '780px' },
      { left: '760px', top: '780px' },
      { left: '0px', top: '1170px' },
      { left: '380px', top: '1170px' },
      { left: '760px', top: '1170px' },
      { left: '0px', top: '1560px' },
      { left: '380px', top: '1560px' },
      { left: '760px', top: '1560px' }
    ];
    await browser.driver.manage().window().setSize(1200, 1600);
    await browser.driver.sleep(config.sleep);
    const widgets = await element.all(await by.css('.homepage .widget'));
    const len = await widgets.length;

    expect(await len).toEqual(pos.length);
    for (let i = 0; i < len; i++) {
      await checkLeftAndTop(widgets[i], pos[i]); // eslint-disable-line
    }
  });

  it('Should position widgets properly at 768px x 1024px', async () => {
    const pos = [
      { left: '0px', top: '0px' },
      { left: '380px', top: '0px' },
      { left: '0px', top: '390px' },
      { left: '380px', top: '390px' },
      { left: '0px', top: '780px' },
      { left: '380px', top: '780px' },
      { left: '0px', top: '1170px' },
      { left: '380px', top: '1170px' },
      { left: '0px', top: '1560px' },
      { left: '380px', top: '1560px' },
      { left: '0px', top: '1950px' },
      { left: '380px', top: '1950px' },
      { left: '0px', top: '2340px' },
      { left: '380px', top: '2340px' },
      { left: '0px', top: '2730px' }
    ];
    await browser.driver.manage().window().setSize(768, 1024);
    await browser.driver.sleep(config.sleep);
    const widgets = await element.all(await by.css('.homepage .widget'));
    const len = await widgets.length;

    expect(await len).toEqual(pos.length);
    for (let i = 0; i < len; i++) {
      await checkLeftAndTop(widgets[i], pos[i]); // eslint-disable-line
    }
  });

  it('Should position widgets properly at 320px x 480px', async () => {
    const pos = [
      { left: '0px', top: '0px' },
      { left: '0px', top: '390px' },
      { left: '0px', top: '780px' },
      { left: '0px', top: '1170px' },
      { left: '0px', top: '1560px' },
      { left: '0px', top: '1950px' },
      { left: '0px', top: '2340px' },
      { left: '0px', top: '2730px' },
      { left: '0px', top: '3120px' },
      { left: '0px', top: '3510px' },
      { left: '0px', top: '3900px' },
      { left: '0px', top: '4290px' },
      { left: '0px', top: '4680px' },
      { left: '0px', top: '5070px' },
      { left: '0px', top: '5460px' }
    ];
    await browser.driver.manage().window().setSize(320, 480);
    await browser.driver.sleep(config.sleep);
    const widgets = await element.all(await by.css('.homepage .widget'));
    const len = await widgets.length;

    expect(await len).toEqual(pos.length);
    for (let i = 0; i < len; i++) {
      await checkLeftAndTop(widgets[i], pos[i]); // eslint-disable-line
    }
  });
});
