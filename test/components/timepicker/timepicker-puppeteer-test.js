const { AxePuppeteer } = require('@axe-core/puppeteer');

describe('Timepicker Puppeteer Tests', () => {
  describe('Index Tests', () => {
    const url = 'http://localhost:4000/components/timepicker/example-index';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should pass Axe accessibility tests', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      const results = await new AxePuppeteer(page).disableRules(['meta-viewport']).analyze();
      expect(results.violations.length).toBe(0);
    });

    it('should not have errors', async () => {
      await page.on('error', (err) => {
        const theTempValue = err.toString();
        console.warn(`Error: ${theTempValue}`);
      });
    });

    it('should open popup on icon click and show value', async () => {
      const timepickerEl = await page.$('#timepicker-id-1');

      await page.click('#timepicker-id-1-trigger');
      await page.click('.set-time');

      expect(await page.evaluate(el => el.value, timepickerEl)).toEqual('1:00 AM');
    });

    it('should validate input', async () => {
      const timepickerEl = await page.$('#timepicker-id-1');

      const changeTimeFormat = async (format) => {
        await page.evaluate((timeFormat) => {
          $('#timepicker-id-1').data('timepicker').settings.timeFormat = timeFormat;
        }, format);
      };

      const setValueAndValidate = async (value) => {
        await page.evaluate((el, val) => {
          el.value = val;
          el.dispatchEvent(new FocusEvent('blur'));
        }, timepickerEl, value);
      };

      const checkError = async () => {
        const hasError = await page.evaluate(() => document.querySelector('#timepicker-id-1').classList.contains('error'));

        return hasError;
      };

      await setValueAndValidate('1');
      await page.waitForTimeout(300);
      expect(await checkError()).toBeTruthy();

      await setValueAndValidate('');
      await page.waitForTimeout(300);
      expect(await checkError()).toBeFalsy();

      await changeTimeFormat('HH:mm');
      await setValueAndValidate('1');
      await page.waitForTimeout(300);
      expect(await checkError()).toBeTruthy();
    });
  });

  describe('Timepicker Example Hour Range Tests', () => {
    const url = 'http://localhost:4000/components/timepicker/example-hour-range.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not have errors', async () => {
      await page.on('error', (err) => {
        const theTempValue = err.toString();
        console.warn(`Error: ${theTempValue}`);
      });
    });

    // improve this test for the next fix
    it.skip('should set the time and period', async () => {
      const timepickerEl = await page.$('#timepicker-id-1');

      await page.click('#timepicker-id-1-trigger');
      await page.click('#timepicker-id-1-period');
      await page.click('#list-option-1');
      await page.click('#timepicker-id-1-hours');

      // VERIFY IF 7 PM ONWARDS IS NOT AVAILABLE
      await expect(page).not.toMatchElement('#list-option-6');

      await page.click('.set-time');
      expect(await page.evaluate(el => el.value, timepickerEl)).toEqual('1:00 PM');
    });
  });

  describe('Timepicker Chinese Localization Tests', () => {
    const url = 'http://localhost:4000/components/timepicker/example-index.html?locale=zh-CN';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not have errors', async () => {
      await page.on('error', (err) => {
        const theTempValue = err.toString();
        console.warn(`Error: ${theTempValue}`);
      });
    });

    it('should set the time and period without any error message', async () => {
      const timepickerEl = await page.$('#timepicker-id-1');
      const errorMessage = await page.$('#timepicker-id-1-error');

      await page.click('#timepicker-id-1-trigger');
      await page.click('.set-time');

      expect(await page.evaluate(el => el.value, timepickerEl)).toEqual('1:00 上午');
      // eslint-disable-next-line jasmine/prefer-jasmine-matcher
      expect(errorMessage === null).toBeTruthy(); // Error message should not be shown/presented.
    });
  });
});
