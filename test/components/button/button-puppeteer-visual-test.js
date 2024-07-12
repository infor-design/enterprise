const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe.skip('Button Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/button';

  describe('Button with icons test', () => {
    const url = `${baseUrl}/example-with-icons?theme=classic`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.waitForSelector('#menu-button-alone', { visible: true });

      const maincontent = await page.$('#maincontent');
      const image = await maincontent.screenshot();

      const btnIcon = getConfig('button-icon');
      expect(image).toMatchImageSnapshot(btnIcon);
    });
  });

  describe('Button toggle test', () => {
    const url = `${baseUrl}/example-toggle-button`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should toggle', async () => {
      await page.waitForSelector('#favorite-1', { visible: true });

      const toggle = await page.$('#favorite-1');
      await toggle.click();

      await toggle.evaluate(e => e.getAttribute('aria-pressed')).then(ariaPressed => expect(ariaPressed).toBe('false'));
    });
  });

  describe('Button 100 percent test', () => {
    const url = `${baseUrl}/example-100-percent?theme=classic`;
    let windowSize;

    const snap = async (width, height) => {
      await page.setViewport({ width, height });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });

      const maincontent = await page.$('#maincontent');
      const image = await maincontent.screenshot();

      const snapshot = getConfig(`button-100-${width}`);
      expect(image).toMatchImageSnapshot(snapshot);
    };

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      windowSize = await page.viewport();
    });

    afterAll(async () => {
      await page.setViewport(windowSize);
    });

    it.skip('should tab onto button, show focus, and not visual regress', async () => {
      await page.focus('#one-hundred');
      await page.keyboard.press('Tab');

      const fitty = await page.$('#fitty');
      const image = await fitty.screenshot();

      const snapshot = getConfig('button-100');
      expect(image).toMatchImageSnapshot(snapshot);
    });

    it.skip('should not visually regress on example-100-percent at 1280px', async () => {
      await snap(1280, 800);
    });

    it.skip('should not visually regress on example-100-percent at 768px', async () => {
      await snap(768, 1024);
    });

    it.skip('should not visually regress on example-100-percent at 500px', async () => {
      await snap(500, 600);
    });

    it.skip('should not visually regress on example-100-percent at 320px', async () => {
      await snap(320, 480);
    });
  });
});

