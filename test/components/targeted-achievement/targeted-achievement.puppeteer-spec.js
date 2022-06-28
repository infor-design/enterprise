const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Targeted Achievement Tests', () => {
  const baseUrl = 'http://localhost:4000/components/targeted-achievement';
  describe('Targeted Achievement Example Index Test', () => {
    const url = `${baseUrl}/example-index.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });
    
    it('should show the tooltip', async () => {
      const icon = await page.$('.icon-error');
      icon.hover();
      
      await page.waitForSelector('.tooltip', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

  });
});
