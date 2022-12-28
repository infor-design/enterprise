import { AxePuppeteer } from '@axe-core/puppeteer';

const { dragAndDrop } = require('../../helpers/e2e-utils.cjs');

describe('Toast Puppeteer Tests', () => {
  describe('Toast Index Tests', () => {
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
      const results = await new AxePuppeteer(page).disableRules(['meta-viewport']).analyze();
      expect(results.violations.length).toBe(0);
      await page.click('#show-toast-message');
      await page.waitForSelector('#toast-container', { visible: true });
      const results2 = await new AxePuppeteer(page).disableRules(['meta-viewport', 'color-contrast']).analyze();
      expect(results2.violations.length).toBe(0);
    });

    it('should pass accessibility checks', async () => {
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

    it('should have button enabled', async () => {
      const isEnabled = await page.$('button#show-toast-message:not([disabled])') !== null;
      expect(isEnabled).toBe(true);
    });

    it('should display toast message', async () => {
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

  describe('Toast test-position tests', () => {
    const url = 'http://localhost:4000/components/toast/test-positions';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should have top left button enabled', async () => {
      const isToastTopLeftEnabled = await page.$('button#show-toast-top-left:not([disabled])') !== null;
      expect(isToastTopLeftEnabled).toBe(true);
    });

    it('should be on top left position', async () => {
      await page.click('#show-toast-top-left');
      const isToastTopLeftExist = await page.$eval('.toast-top-left', el => el !== null);
      expect(isToastTopLeftExist).toBeTruthy();
    });

    it('should have top right button enabled', async () => {
      const isToastTopRightEnabled = await page.$('button#show-toast-top-right:not([disabled])') !== null;
      expect(isToastTopRightEnabled).toBe(true);
    });

    it('should be on top right position', async () => {
      await page.click('#show-toast-top-right');
      const isToastTopRightExist = await page.$eval('.toast-top-right', el => el !== null);
      expect(isToastTopRightExist).toBeTruthy();
    });

    it('should have bottom left button enabled', async () => {
      const isToastBottomLeftEnabled = await page.$('button#show-toast-bottom-left:not([disabled])') !== null;
      expect(isToastBottomLeftEnabled).toBe(true);
    });

    it('should be on bottom left position', async () => {
      await page.click('#show-toast-bottom-left');
      const isToastBottomLeftExist = await page.$eval('.toast-bottom-left', el => el !== null);
      expect(isToastBottomLeftExist).toBeTruthy();
    });

    it('should have bottom right button enabled', async () => {
      const isToastBottomRightEnabled = await page.$('button#show-toast-bottom-right:not([disabled])') !== null;
      expect(isToastBottomRightEnabled).toBe(true);
    });

    it('should be on bottom right position', async () => {
      await page.click('#show-toast-bottom-right');
      const isToastBottomRightExist = await page.$eval('.toast-bottom-right', el => el !== null);
      expect(isToastBottomRightExist).toBeTruthy();
    });

    it('should have big text button enabled', async () => {
      const isToastBigTxtEnabled = await page.$('button#show-toast-big-text:not([disabled])') !== null;
      expect(isToastBigTxtEnabled).toBe(true);
    });

    it('should have toast with long text ', async () => {
      await page.click('#show-toast-big-text');
      const isToastBigTxtExist = await page.$eval('.toast-bottom-right', el => el !== null);
      expect(isToastBigTxtExist).toBeTruthy();
    });

    it('should have toast destroy button enabled', async () => {
      await page.click('#show-toast-big-text');
      const toastMessage = await page.$eval('#toast-container', items => items.textContent);
      const expectedValue = '\n        \n          Longer Application Offline (1)\n          This is a Toast message that is much longer. It is so long it might wrap but that does not cause any issues.\n        \n      \n        \n        Close\n      ';
      expect(toastMessage).toContain(expectedValue);
    });
  });

  describe('Toast Example-draggable tests', () => {
    const url = 'http://localhost:4000/components/toast/example-draggable.html';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should be able to change toast position', async () => {
      await page.click('#show-toast-message1');
      await page.waitForSelector('#toast-containertoast-some-uniqueid-usersettings-position', { visible: true });
      const toast1 = await page.$('#toast-containertoast-some-uniqueid-usersettings-position');
      const ob = await toast1.boundingBox();
      const button1 = await page.$('#show-toast-message1');
      await page.waitForTimeout(500);
      await dragAndDrop(toast1, button1);
      const db = await toast1.boundingBox();
      const toastXLocation = db.x + db.width / 2;
      const toastYLocation = db.y + db.height / 2;

      // verify if the first toast has moved to drop location
      expect(toastXLocation).not.toEqual(ob.x);
      expect(toastYLocation).not.toEqual(ob.y);

      // close the first toast
      await page.keyboard.press('Escape');

      // change location of the second toast
      await page.click('#show-toast-message2');
      await page.waitForSelector('#toast-containertoast-some-another-uniqueid-usersettings-position', { visible: true });
      const toast2 = await page.$('#toast-containertoast-some-another-uniqueid-usersettings-position');
      const ob2 = await toast2.boundingBox();
      const location = [{ x: 126, y: 9 }];
      await page.waitForTimeout(500);
      await dragAndDrop('.toast', location);
      const db2 = await toast2.boundingBox();

      // verify if the second toast has moved to drop location
      expect(db2.x).not.toEqual(ob2.x);
      expect(db2.y).not.toEqual(ob2.y);
    });
  });
});
