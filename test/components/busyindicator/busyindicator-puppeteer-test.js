describe('Busy Indicator Tests', () => {
  const baseUrl = 'http://localhost:4000/components/busyindicator';

  describe('Index', () => {
    const url = `${baseUrl}/example-index?layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should display busy indicator', async () => {
      await page.click('#submit');

      expect(await page.waitForSelector('.busy-indicator-container', { visible: true })).toBeTruthy();
    });

    it('should be able to set ids/automation ids', async () => {
      await page.click('#submit');

      expect(await page.$eval('#busyindicator-id-1-overlay', el => el.getAttribute('id'))).toEqual('busyindicator-id-1-overlay');
      expect(await page.$eval('#busyindicator-id-1-overlay', el => el.getAttribute('data-automation-id'))).toEqual('busyindicator-automation-id-1-overlay');

      expect(await page.$eval('#busyindicator-id-1', el => el.getAttribute('id'))).toEqual('busyindicator-id-1');
      expect(await page.$eval('#busyindicator-id-1', el => el.getAttribute('data-automation-id'))).toEqual('busyindicator-automation-id-1');

      expect(await page.$eval('#busyindicator-id-1-busyindicator', el => el.getAttribute('id'))).toEqual('busyindicator-id-1-busyindicator');
      expect(await page.$eval('#busyindicator-id-1-busyindicator', el => el.getAttribute('data-automation-id'))).toEqual('busyindicator-automation-id-1-busyindicator');

      expect(await page.$eval('#busyindicator-id-1-text', el => el.getAttribute('id'))).toEqual('busyindicator-id-1-text');
      expect(await page.$eval('#busyindicator-id-1-text', el => el.getAttribute('data-automation-id'))).toEqual('busyindicator-automation-id-1-text');
    });
  });

  describe('Example-inputs tests', () => {
    const url = `${baseUrl}/example-inputs`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should display busy indicator inside input', async () => {
      await page.click('#trigger-busy-input');

      const fieldEl = await page.$('.field');
      expect(await fieldEl.waitForSelector('.busy-indicator-container', { visible: true })).toBeTruthy();
    });

    it('should display busy indicator inside dropdown', async () => {
      await page.click('#trigger-busy-dropdown');

      const fieldEl = await page.$('.field');
      expect(await fieldEl.waitForSelector('.busy-indicator-container', { visible: true })).toBeTruthy();
    });
  });

  describe('Test-ajax-calls tests', () => {
    const url = `${baseUrl}/test-ajax-calls`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should display busy indicator while waiting for Ajax response', async () => {
      await page.type('#autocomplete-busy', 'Numpad1');

      const fieldEl = await page.$('.field');
      expect(await fieldEl.waitForSelector('.busy-indicator-container', { visible: true })).toBeTruthy();
    });
  });

  describe('Test-block-entire-ui tests', () => {
    const url = `${baseUrl}/test-block-entire-ui`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should block entire UI', async () => {
      await page.click('#submit');

      await page.mouse.click(170, 235);
      await page.type('body', 'Numpad1');

      expect(await page.$eval('#busy-field-address', el => el.getAttribute('value'))).not.toEqual('1');
    });
  });

  describe('Test-block-specific-area tests', () => {
    const url = `${baseUrl}/test-block-specific-area`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should block specific area', async () => {
      await page.click('#busy-start-trigger');

      const specificEl = await page.$('#standalone-busy');
      expect(await specificEl.waitForSelector('.busy-indicator-container', { visible: true })).toBeTruthy();
    });
  });

  describe('Test-contained-in-font-size-0 tests', () => {
    const url = `${baseUrl}/test-contained-in-font-size-0`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should display normal font', async () => {
      await page.click('#busy-start-trigger');

      expect(await page.$eval('.busy-indicator-container > span', el => getComputedStyle(el))).not.toEqual(0);
    });
  });

  describe('Test-delayed-display tests', () => {
    const url = `${baseUrl}/test-delayed-display`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be displayed after a short delay', async () => {
      await page.click('#submit');

      expect(await page.waitForSelector('.busy-indicator-container', { visible: true })).toBeTruthy();
    });
  });

  describe('Test-inside-tab tests', () => {
    const url = `${baseUrl}/test-inside-tab`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be displayed inside tab', async () => {
      await page.click('#busy-start-trigger');

      const tabEl = await page.$('#tabs-normal-contracts');
      expect(await tabEl.waitForSelector('.busy-indicator-container', { visible: true })).toBeTruthy();
    });
  });

  describe('Busy Indicator test-nested tests', () => {
    const url = `${baseUrl}/test-nested`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should display nested busy indicators', async () => {
      await page.click('#nested-busy-start-trigger');
      await page.click('#submit');

      const nestedStandaloneEl = await page.$('#nested-busy-standalone');
      expect(await nestedStandaloneEl.waitForSelector('.busy-indicator-container', { visible: true })).toBeTruthy();

      await page.evaluate(() => document.querySelectorAll('.busy-indicator-container').length)
        .then(nestedBusyIndicatorEl => expect(nestedBusyIndicatorEl).toEqual(2));
    });
  });

  describe('Busy Indicator test-update tests', () => {
    const url = `${baseUrl}/test-update`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should update busy indicator text', async () => {
      await page.click('#submit');

      await page.waitForSelector('.busy-indicator-container', { visible: true })
        .then(async () => {
          await page.$eval('.busy-indicator-container .active + span', el => el.textContent)
            .then(textEl => expect(textEl).toEqual('New Text 1'));
        });
    });
  });
});
