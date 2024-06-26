const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

function checkLeftAndTop(elem, pos) {
  const elemStyle = elem.getAttribute('style');
  expect(elemStyle).toContain(`left: ${pos.left};`);
  expect(elemStyle).toContain(`top: ${pos.top};`);
}

describe('Homepage example five column tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/homepage/example-five-column.html');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should position widgets properly at 1920px x 1080px', async () => {
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
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(1920, 1080);
    await browser.driver.sleep(config.sleepLonger);
    const widgets = await element.all(by.css('.homepage .widget'));
    const len = widgets.length;

    expect(len).toEqual(pos.length);
    for (let i = 0; i < len; i++) {
      checkLeftAndTop(widgets[i], pos[i]);
    }
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('should position widgets properly at 1680px x 1050px', async () => {
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
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(1680, 1050);
    await browser.driver.sleep(config.sleepLonger);
    const widgets = await element.all(by.css('.homepage .widget'));
    const len = widgets.length;

    expect(len).toEqual(pos.length);
    for (let i = 0; i < len; i++) {
      checkLeftAndTop(widgets[i], pos[i]);
    }
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('should position widgets properly at 1200px x 1600px', async () => {
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
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(1200, 1600);
    await browser.driver.sleep(config.sleepLonger);
    const widgets = await element.all(by.css('.homepage .widget'));
    const len = widgets.length;

    expect(len).toEqual(pos.length);
    for (let i = 0; i < len; i++) {
      checkLeftAndTop(widgets[i], pos[i]);
    }
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('should position widgets properly at 768px x 1024px', async () => {
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
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(768, 1024);
    await browser.driver.sleep(config.sleepLonger);
    const widgets = await element.all(by.css('.homepage .widget'));
    const len = widgets.length;

    expect(len).toEqual(pos.length);
    for (let i = 0; i < len; i++) {
      checkLeftAndTop(widgets[i], pos[i]);
    }
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('should position widgets properly at 320px x 480px', async () => {
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
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(320, 480);
    await browser.driver.sleep(config.sleepLonger);
    const widgets = await element.all(by.css('.homepage .widget'));
    const len = widgets.length;

    expect(len).toEqual(pos.length);
    for (let i = 0; i < len; i++) {
      checkLeftAndTop(widgets[i], pos[i]);
    }
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });
});
