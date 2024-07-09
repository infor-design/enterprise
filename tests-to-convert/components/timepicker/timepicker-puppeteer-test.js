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

    it.skip('should set time on field from popup', async () => {
      const timepickerEl = await page.$('#timepicker-id-1');

      const openPopup = async () => {
        await page.click('#timepicker-id-1-trigger');
      };

      const setTime = async () => {
        await page.click('.set-time');
      };

      const getValue = async () => {
        const value = await page.evaluate(el => el.value, timepickerEl);

        return value;
      };

      const clearValue = async () => {
        await page.$('#timepicker-id-1', (el) => {
          el.value = '';
        });
      };

      const changeTimeFormat = async (format) => {
        await page.evaluate((timeFormat) => {
          $('#timepicker-id-1').data('timepicker').settings.timeFormat = timeFormat;
        }, format);
      };

      const setDropdowns = async (value) => {
        await page.evaluate((items) => {
          Object.keys(items).forEach((item) => {
            document.querySelector(`.${item}.dropdown`).value = items[item];
          });
        }, value);
      };

      await openPopup();
      await setDropdowns({ period: 'PM', hours: '11', minutes: '05' });
      await setTime();

      expect(await getValue()).toEqual('11:05 PM');

      await openPopup();
      await setDropdowns({ period: 'AM', hours: '5', minutes: '20' });
      await setTime();

      expect(await getValue()).toEqual('5:20 AM');

      await clearValue();
      await changeTimeFormat('ah:mm');

      await openPopup();
      await setDropdowns({ period: 'PM', hours: '11', minutes: '05' });
      await setTime();

      expect(await getValue()).toEqual('PM11:05');

      await openPopup();
      await setDropdowns({ period: 'AM', hours: '5', minutes: '20' });
      await setTime();

      expect(await getValue()).toEqual('AM5:20');

      await clearValue();
      await changeTimeFormat('HH:mm:ss');

      await openPopup();
      await setDropdowns({ hours: '23', minutes: '05', seconds: '05' });
      await setTime();

      expect(await getValue()).toEqual('23:05:05');

      await openPopup();
      await setDropdowns({ hours: '00', minutes: '00', seconds: '00' });
      await setTime();

      expect(await getValue()).toEqual('00:00:00');
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

      // ah:mm
      expect(await page.evaluate(el => el.value, timepickerEl)).toEqual('01:00');
      // eslint-disable-next-line jasmine/prefer-jasmine-matcher
      expect(errorMessage === null).toBeTruthy(); // Error message should not be shown/presented.
    });
  });
});
