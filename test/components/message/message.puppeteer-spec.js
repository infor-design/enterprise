const { AxePuppeteer } = require('@axe-core/puppeteer');

describe('Index Tests', () => {
  const url = 'http://localhost:4000/components/message/example-index.html';
  beforeEach(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
  });

  it('should show the title', async () => {
    await expect(page.title()).resolves.toMatch('IDS Enterprise');
  });

  it('should check the test page with Axe', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    const results = await new AxePuppeteer(page).disableRules(['meta-viewport']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should have Accessibility', async () => {
    const webArea = await page.accessibility.snapshot();
    expect(webArea.children[0]).toMatchObject({
      role: 'link',
      name: 'Skip to Main Content'
    });
    expect(webArea.children[1]).toMatchObject({
      role: 'heading',
      name: 'IDS Enterprise',
      level: 1
    });
    expect(webArea.children[2]).toMatchObject({
      role: 'combobox',
      name: 'Header More Actions Button',
      haspopup: 'menu'
    });
    expect(webArea.children[3]).toMatchObject({
      role: 'button',
      name: 'Error Example'
    });
    expect(webArea.children[4]).toMatchObject({
      role: 'button',
      name: 'Alert Example'
    });
    expect(webArea.children[5]).toMatchObject({
      role: 'button',
      name: 'Success Example'
    });
    expect(webArea.children[6]).toMatchObject({
      role: 'button',
      name: 'Info Example'
    });
    expect(webArea.children[7]).toMatchObject({
      role: 'button',
      name: 'Complete Example'
    });
    expect(webArea.children[8]).toMatchObject({
      role: 'button',
      name: 'Confirmation Example'
    });
    expect(webArea.children[9]).toMatchObject({
      role: 'button',
      name: 'Allow Tags'
    });
    expect(webArea.children[10]).toMatchObject({
      role: 'button',
      name: 'Disallow Tags'
    });
    expect(webArea.children[11]).toMatchObject({
      role: 'button',
      name: 'Huge Message'
    });
  });

  it.skip('should not be able to tab out of message modal', async () => {
    const buttonEl = await page.$('#show-delete-confirmation');
    await buttonEl.click();
    await page.waitForSelector('.btn-modal-primary', { visible: true });
    const modalButtonPrimaryEl = await page.$('.btn-modal-primary');
    modalButtonPrimaryEl.press('Tab');

    const modalButtonPrimaryClasses = await page.$eval('.btn-modal-primary', el => el.getAttribute('class'));
    expect(modalButtonPrimaryClasses).toContain('btn-modal-primary');
    expect(modalButtonPrimaryClasses).toContain('hide-focus');

    const modalButtonEl = await page.$('.btn-modal:nth-child(1)');
    await modalButtonEl.press('Tab');
    const modalButtonClasses = await page.$eval('.btn-modal:nth-child(1)', el => el.getAttribute('class'));
    expect(modalButtonClasses).toContain('btn-modal');
    expect(modalButtonClasses).toContain('hide-focus');
    await modalButtonEl.click();
  });

  it('should be able to set id/automation/id on buttons', async () => {
    const buttonEl = await page.$('#show-application-alert');
    await buttonEl.click();
    await page.waitForTimeout(100);
    const modalAcknowledge = await page.evaluate(() => !!document.querySelector('#message-acknowledge-cancel-1'));
    const modalCancel = await page.evaluate(() => !!document.querySelector('[data-automation-id="message-alert-cancel-1"]'));
    expect(modalAcknowledge).toBe(true);
    expect(modalCancel).toBe(true);

    // Should be able to set id/automation/id on root/items
    const modalTitle = await page.evaluate(() => !!document.querySelector('#message-acknowledge-title'));
    expect(modalTitle).toBe(true);

    const acknowledgemodal = await page.$('#message-acknowledge-modal');
    const elemID = await page.evaluate(elem => elem.getAttribute('data-automation-id'), acknowledgemodal);
    expect(elemID).toEqual('message-acknowledge-auto-modal');

    const acknowledgemessage = await page.$('#message-acknowledge-message');
    const elemIentID = await page.evaluate(elem => elem.getAttribute('data-automation-id'), acknowledgemessage);
    expect(elemIentID).toEqual('message-acknowledge-auto-message');

    await page.click('#message-acknowledge-cancel-1');
  });

  it('should show alert status to a Message example ', async () => {
    // |-------------------------------------------------------------------|
    // | https://github.com/infor-design/enterprise/issues/5459 Enhancement|
    // |-------------------------------------------------------------------|
    await page.click('#show-application-info');
    const infoModalTitle = await page.evaluate(() => !!document.querySelector('#message-title'));
    expect(infoModalTitle).toBe(true);
    const iconTooltip = await page.$eval('#message-title > svg', element => element.innerHTML);
    expect(iconTooltip).toContain('<use href="#icon-info"></use>');
    await page.click('.btn-modal');
  });

  it('should have Mobile Enhancements and style changes tests', async () => {
    // |--------------------------------------------------------|
    // | https://github.com/infor-design/enterprise/issues/5567 |
    // |--------------------------------------------------------|

    // Test it on a smaller viewport with a width of 480px or below
    await page.setViewport({
      width: 480,
      height: 596,
      deviceScaleFactor: 1,
    });
    // Check the modal-body-wrapper class, and it should have a padding of 4px 16px
    await page.click('#show-application-error');
    const modalBodyWrapperPadding = () => page.$eval('.modal-body-wrapper', e => JSON.parse(JSON.stringify(getComputedStyle(e).padding)));
    expect(await modalBodyWrapperPadding()).toEqual('32px 16px');

    // Check the modal class and it should have a width of 100%
    const modalClassWidth = () => page.evaluate(() => {
      document.querySelector('.modal').parentNode.style.display = 'none';
      const width = getComputedStyle(document.querySelector('.modal')).width;
      document.querySelector('.modal').parentNode.style.display = '';
      return width;
    });
    expect(await modalClassWidth()).toBe('100%');

    // modal-content should have 16px
    const modalContentMargin = () => page.$eval('.modal-content', e => JSON.parse(JSON.stringify(getComputedStyle(e).margin)));
    expect(await modalContentMargin()).toEqual('16px');

    // steps for PR#5767
    const buttonSetMargin = () => page.$eval('.buttonset', e => JSON.parse(JSON.stringify(getComputedStyle(e).margin)));
    expect(await buttonSetMargin()).toEqual('0px');
    const modalHeaderPadding = () => page.$eval('.modal-header', e => JSON.parse(JSON.stringify(getComputedStyle(e).padding)));
    expect(await modalHeaderPadding()).toEqual('16px 16px 0px');

    // When testing it to 480px above
    await page.setViewport({
      width: 500,
      height: 596,
      deviceScaleFactor: 1,
    });

    // Check the modal-body-wrapper class, and it should have a padding of 4px 16px
    await page.click('#show-application-error');
    expect(await modalBodyWrapperPadding()).toEqual('32px 16px');

    // Check the modal class and it should have a width of 100%
    expect(await modalClassWidth()).toBe('auto');

    // modal-content should have margin: 10px
    expect(await modalContentMargin()).toEqual('10px');

    // steps for PR#5767
    expect(await buttonSetMargin()).toEqual('0px');
    expect(await modalHeaderPadding()).toEqual('16px 16px 0px');
  });
});

describe('Message xss tests', () => {
  const url = 'http://localhost:4000/components/message/test-escaped-title.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
  });

  it('should show the title', async () => {
    await expect(page.title()).resolves.toMatch('IDS Enterprise');
  });

  it('should check the test page with Axe', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    const results = await new AxePuppeteer(page).disableRules(['meta-viewport']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should have Accessibility', async () => {
    const webArea = await page.accessibility.snapshot();
    expect(webArea.children[0]).toMatchObject({
      role: 'link',
      name: 'Skip to Main Content'
    });
    expect(webArea.children[1]).toMatchObject({
      role: 'heading',
      name: 'IDS Enterprise',
      level: 1
    });
    expect(webArea.children[2]).toMatchObject({
      role: 'combobox',
      name: 'Header More Actions Button',
      haspopup: 'menu'
    });
    expect(webArea.children[3]).toMatchObject({
      role: 'button',
      name: 'Show Message'
    });
  });

  it('should show encoded text in the title', async () => {
    await page.waitForSelector('#show-message');
    await page.click('#show-message');
    const modal = await page.evaluate(() => !!document.querySelector('.message.modal'));
    expect(modal).toBe(true);
    const modalTitle = await page.$eval('.message.modal .modal-title', el => el.textContent);
    expect(modalTitle).toEqual('<script>alert("menuXSS")</script>');
    await page.click('#id-cancel');
  });
});

describe('Message overlay opacity tests', () => {
  const url = 'http://localhost:4000/components/message/test-overlay-opacity.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
  });

  it('should show the title', async () => {
    await expect(page.title()).resolves.toMatch('IDS Enterprise');
  });

  it('should check the test page with Axe', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    const results = await new AxePuppeteer(page).disableRules(['meta-viewport']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should have Accessibility', async () => {
    const webArea = await page.accessibility.snapshot();
    expect(webArea.children[0]).toMatchObject({
      role: 'link',
      name: 'Skip to Main Content'
    });
    expect(webArea.children[1]).toMatchObject({
      role: 'heading',
      name: 'IDS Enterprise',
      level: 1
    });
    expect(webArea.children[2]).toMatchObject({
      role: 'combobox',
      name: 'Header More Actions Button',
      haspopup: 'menu'
    });
    expect(webArea.children[3]).toMatchObject({
      role: 'button',
      name: 'Opacity 10%'
    });
    expect(webArea.children[4]).toMatchObject({
      role: 'button',
      name: 'Opacity 20%'
    });
    expect(webArea.children[5]).toMatchObject({
      role: 'button',
      name: 'Opacity 30%'
    });
    expect(webArea.children[6]).toMatchObject({
      role: 'button',
      name: 'Opacity 40%'
    });
    expect(webArea.children[7]).toMatchObject({
      role: 'button',
      name: 'Opacity 50%'
    });
    expect(webArea.children[8]).toMatchObject({
      role: 'button',
      name: 'Opacity 60%'
    });
    expect(webArea.children[9]).toMatchObject({
      role: 'button',
      name: 'Opacity 70%'
    });
    expect(webArea.children[10]).toMatchObject({
      role: 'button',
      name: 'Opacity 80%'
    });
    expect(webArea.children[11]).toMatchObject({
      role: 'button',
      name: 'Opacity 90%'
    });
  });

  it('should be able to set overlay opacity to 10%', async () => {
    const btnEl = await page.$('#opacity-10');
    await btnEl.click();
    await page.waitForTimeout(100);
    const divOverlay = await page.evaluate(() => !!document.querySelector('.overlay'));
    expect(divOverlay).toBe(true);
    await page.waitForTimeout(100);
    const everlayEl = await page.evaluate(() => document.querySelector('.overlay').style.background);
    expect(everlayEl).toContain('rgba(0, 0, 0, 0.1)');
    await page.click('.btn-modal');
  });
});

describe('Message close button Tests', () => {
  const url = 'http://localhost:4000/components/message/test-close-btn.html?theme=classic&mode=light&layout=nofrills';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
  });

  it('should show the title', async () => {
    await expect(page.title()).resolves.toMatch('IDS Enterprise');
  });

  it('should check the test page with Axe', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    const results = await new AxePuppeteer(page).disableRules(['meta-viewport']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should have Accessibility', async () => {
    const webArea = await page.accessibility.snapshot();
    expect(webArea.children[0]).toMatchObject({
      role: 'heading',
      name: 'Component Example Page',
      level: 1
    });
    expect(webArea.children[1]).toMatchObject({
      role: 'button',
      name: 'Message close btn'
    });
  });

  it('should have a close button on message, similar to Modal', async () => {
    await page.click('#huge-title');
    const el = await page.$eval('.btn-icon.btn-close', element => element.innerHTML);
    expect(el).toContain('<use href="#icon-close"></use>');
    await page.click('.btn-icon.btn-close');
    const xButton = await page.evaluate(() => !!document.querySelector('.btn-icon.btn-close'));
    expect(xButton).toBeFalsy();
    await page.click('#huge-title');
  });
});

describe('Message long title Tests', () => {
  const url = 'http://localhost:4000/components/message/test-long-title.html?theme=classic&mode=light&layout=nofrills';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
  });

  it('should show the title', async () => {
    await expect(page.title()).resolves.toMatch('IDS Enterprise');
  });

  it('should check the test page with Axe', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    const results = await new AxePuppeteer(page).disableRules(['meta-viewport']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should have Accessibility', async () => {
    const webArea = await page.accessibility.snapshot();
    expect(webArea.children[0]).toMatchObject({
      role: 'heading',
      name: 'Component Example Page',
      level: 1
    });
    expect(webArea.children[1]).toMatchObject({
      role: 'button',
      name: 'Long Title'
    });
  });

  it('should show a modal that resizes toward max-width if the message text is long', async () => {
    await page.waitForSelector('#huge-title');
    await page.click('#huge-title');
    expect(await page.waitForSelector('#message-title', { visible: true })).toBeTruthy();
    expect(await page.waitForSelector('#message-text', { visible: true })).toBeTruthy();

    const titleWidth = await page.evaluate(() => {
      const msgtitle = document.querySelector('#message-title');
      return JSON.parse(JSON.stringify(getComputedStyle(msgtitle).width));
    });
    const textWidth = await page.evaluate(() => {
      const el = document.querySelector('#message-text');
      return JSON.parse(JSON.stringify(getComputedStyle(el).width));
    });

    expect(titleWidth).toEqual(textWidth);
  });
});

describe('Message Mobile Enhancement & Style Test', () => {
  const url = 'http://localhost:4000/components/message/example-index.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
  });

  it('should have modal-body-wrapper padding to 32px top and bottom, 16px left and right ', async () => {
    await expect(page.title()).resolves.toMatch('IDS Enterprise');
    await page.click('#show-application-error');
    const modalPadTop = await page.$eval('div[class="modal-body-wrapper"]', el => getComputedStyle(el).paddingTop);
    const modalPadBot = await page.$eval('div[class="modal-body-wrapper"]', el => getComputedStyle(el).paddingBottom);
    const modalPadLeft = await page.$eval('div[class="modal-body-wrapper"]', el => getComputedStyle(el).paddingLeft);
    const modalPadRight = await page.$eval('div[class="modal-body-wrapper"]', el => getComputedStyle(el).paddingRight);
    expect(modalPadTop).toMatch('32px');
    expect(modalPadBot).toMatch('32px');
    expect(modalPadLeft).toMatch('16px');
    expect(modalPadRight).toMatch('16px');
  });

  it('should have modal header should have padding top of 24px, bottom 0, and 16px left and right  ', async () => {
    await expect(page.title()).resolves.toMatch('IDS Enterprise');
    await page.click('#show-application-success');
    const headerPadTop = await page.$eval('div[class="modal-header"]', el => getComputedStyle(el).paddingTop);
    const headerPadBot = await page.$eval('div[class="modal-header"]', el => getComputedStyle(el).paddingBottom);
    const headerPadLeft = await page.$eval('div[class="modal-header"]', el => getComputedStyle(el).paddingLeft);
    const headerPadRight = await page.$eval('div[class="modal-header"]', el => getComputedStyle(el).paddingRight);
    expect(headerPadLeft).toMatch('16px');
    expect(headerPadRight).toMatch('16px');
    expect(headerPadTop).toMatch('16px');
    expect(headerPadBot).toMatch('0px');
  });

  it('should have 0px margin-top on buttonset ', async () => {
    await expect(page.title()).resolves.toMatch('IDS Enterprise');
    const btnTop = await page.$eval('button[class="btn-secondary hide-focus"]', el => getComputedStyle(el).marginTop);
    expect(btnTop).toMatch('0px');
  });
});
