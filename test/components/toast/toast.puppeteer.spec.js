// const { toMatchImageSnapshot } = require('jest-image-snapshot');

// expect.extend({ toMatchImageSnapshot });
const percySnapshot = require('@percy/puppeteer');

describe('Toast Puppeteer Tests', () => {
  describe('Index Tests', () => {
    const url = 'http://localhost:4000/components/toast/example-index.html';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      /* Violations found:
      Rule: "color-contrast" (Elements must have sufficient color contrast)
      Rule: "meta-viewport" (Zooming and scaling should not be disabled)
      */
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
      await page.click('#show-toast-message');
      await page.waitForSelector('#toast-container', { visible: true });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'color-contrast'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "name": "Skip to Main Content",
      "role": "link",
    },
    Object {
      "level": 1,
      "name": "IDS Enterprise",
      "role": "heading",
    },
    Object {
      "haspopup": "menu",
      "name": "Header More Actions Button",
      "role": "combobox",
    },
    Object {
      "name": "Show Toast Message",
      "role": "button",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
      await page.click('#show-toast-message');
      await page.waitForSelector('#toast-container', { visible: true });
      expect(webArea).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "name": "Skip to Main Content",
      "role": "link",
    },
    Object {
      "level": 1,
      "name": "IDS Enterprise",
      "role": "heading",
    },
    Object {
      "haspopup": "menu",
      "name": "Header More Actions Button",
      "role": "combobox",
    },
    Object {
      "name": "Show Toast Message",
      "role": "button",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
    });

    it('should button enabled', async () => {
      const isEnabled = await page.$('button#show-toast-message:not([disabled])') !== null;
      expect(isEnabled).toBe(true);
    });

    it('should display', async () => {
      await page.click('#show-toast-message');
      await page.waitForSelector('#toast-container', { visible: true });
      const toast = await page.evaluate(() => !!document.querySelector('#toast-container'));
      expect(toast).toBeTruthy();
    });

    it('should close after clicking close button', async () => {
      const buttonEl = await page.$('#show-toast-message');
      await buttonEl.click();
      await page.waitForSelector('#toast-container', { visible: true });
      const toast = await page.$$('.toast');
      expect(toast.length).toEqual(1);
      await page.waitForTimeout(500);
      await page.click('#toast-id-1-btn-close');
      await page.waitForSelector('#toast-container', { visible: false });
      await page.waitForTimeout(500);
      const elem = await page.$$('#toast-container');
      expect(elem.length).toEqual(0);
    });

    it('should close after pressing the Escape key', async () => {
      const buttonEl = await page.$('#show-toast-message');
      await buttonEl.click();
      const toast = await page.$$('.toast');
      expect(toast.length).toEqual(1);
      await page.keyboard.press('Escape');
      await page.waitForSelector('#toast-container', { visible: false });
      await page.waitForTimeout(500);
      const elem = await page.$$('#toast-container');
      expect(elem.length).toEqual(0);
    });
  });

  describe('Toast example-positions tests', () => {
    const url = 'http://localhost:4000/components/toast/test-positions';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      /* Violations found:
      Rule: "color-contrast" (Elements must have sufficient color contrast)
      Rule: "meta-viewport" (Zooming and scaling should not be disabled)
      */
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "name": "Skip to Main Content",
      "role": "link",
    },
    Object {
      "level": 1,
      "name": "IDS Enterprise",
      "role": "heading",
    },
    Object {
      "haspopup": "menu",
      "name": "Header More Actions Button",
      "role": "combobox",
    },
    Object {
      "name": "Show Toast Top left",
      "role": "button",
    },
    Object {
      "name": "Show Toast Top Right",
      "role": "button",
    },
    Object {
      "name": "Show Toast Bottom Left",
      "role": "button",
    },
    Object {
      "name": "Show Toast Bottom Right",
      "role": "button",
    },
    Object {
      "name": "Show Toast Long Text",
      "role": "button",
    },
    Object {
      "name": "Toast Destroy",
      "role": "button",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
    });

    it('should top left button enabled', async () => {
      const isToastTopLeftEnabled = await page.$('button#show-toast-top-left:not([disabled])') !== null;
      expect(isToastTopLeftEnabled).toBe(true);
    });

    it('should be on top left position', async () => {
      await page.click('#show-toast-top-left');
      const isToastTopLeftExist = await page.$eval('.toast-top-left', el => el !== null);
      expect(isToastTopLeftExist).toBeTruthy();
    });

    it('should top right button enabled', async () => {
      const isToastTopRightEnabled = await page.$('button#show-toast-top-right:not([disabled])') !== null;
      expect(isToastTopRightEnabled).toBe(true);
    });

    it('should be on top right position', async () => {
      await page.click('#show-toast-top-right');
      const isToastTopRightExist = await page.$eval('.toast-top-right', el => el !== null);
      expect(isToastTopRightExist).toBeTruthy();
    });

    it('should bottom left button enabled', async () => {
      const isToastBottomLeftEnabled = await page.$('button#show-toast-bottom-left:not([disabled])') !== null;
      expect(isToastBottomLeftEnabled).toBe(true);
    });

    it('should be on bottom left position', async () => {
      await page.click('#show-toast-bottom-left');
      const isToastBottomLeftExist = await page.$eval('.toast-bottom-left', el => el !== null);
      expect(isToastBottomLeftExist).toBeTruthy();
    });

    it('should bottom right button enabled', async () => {
      const isToastBottomRightEnabled = await page.$('button#show-toast-bottom-right:not([disabled])') !== null;
      expect(isToastBottomRightEnabled).toBe(true);
    });

    it('should be on bottom right position', async () => {
      await page.click('#show-toast-bottom-right');
      const isToastBottomRightExist = await page.$eval('.toast-bottom-right', el => el !== null);
      expect(isToastBottomRightExist).toBeTruthy();
    });

    it('should big text button enabled', async () => {
      const isToastBigTxtEnabled = await page.$('button#show-toast-big-text:not([disabled])') !== null;
      expect(isToastBigTxtEnabled).toBe(true);
    });

    it('should have Toast with Long Text ', async () => {
      await page.click('#show-toast-big-text');
      const isToastBigTxtExist = await page.$eval('.toast-bottom-right', el => el !== null);
      expect(isToastBigTxtExist).toBeTruthy();
    });

    it('should toast destroy button enabled', async () => {
      await page.click('#show-toast-big-text');
      const toastMessage = await page.$eval('#toast-container', items => items.textContent);
      const expectedValue = '\n        \n          Longer Application Offline (1)\n          This is a Toast message that is much longer. It is so long it might wrap but that does not cause any issues.\n        \n      \n        \n        Close\n      ';
      expect(toastMessage).toContain(expectedValue);
    });
  });

  describe.skip('Toast visual regression tests', () => {
    // const basePath = __dirname;
    // const baselineFolder = `${basePath}/baseline`;
    // const screenshotPath = `${basePath}/.tmp/`;
    // const getConfig = (customSnapshotIdentifier, customDiffDir) => ({
    //   customSnapshotIdentifier,
    //   customDiffDir
    // });
    beforeEach(async () => {
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      });
      const url = 'http://localhost:4000/components/toast/example-index.html';
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });
    it('should not visual regress on index example', async () => {
      await page.click('#show-toast-message');
      await page.waitForSelector('div[style="width: 52.9617%;"]', { visible: true });

      /**
  |---------------------------------------|
  | Generate jest ImageSnaphsot           |
  |---------------------------------------|
  * */
      // const image = await page.screenshot({ fullPage: true });
      // const config = getConfig(baselineFolder, screenshotPath);
      // expect(image).toMatchImageSnapshot(config);
      /**
  |---------------------------------------|
  | Generate percy Snaphsot               |
  |---------------------------------------|
  * */
      await percySnapshot(page, 'popdown');
    });
  });
});
