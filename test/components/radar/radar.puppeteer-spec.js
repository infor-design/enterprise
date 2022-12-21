const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Radar', () => {
  const baseUrl = 'http://localhost:4000/components/radar';

  describe('Index tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      await page.evaluate(() => document.getElementById('radar-iphone-battery-life-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-iphone-battery-life-circle'));
      await page.evaluate(() => document.getElementById('radar-iphone-battery-life-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-iphone-battery-life-circle'));

      await page.evaluate(() => document.getElementById('radar-iphone-brand-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-iphone-brand-circle'));
      await page.evaluate(() => document.getElementById('radar-iphone-brand-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-iphone-brand-circle'));

      await page.evaluate(() => document.getElementById('radar-iphone-cost-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-iphone-cost-circle'));
      await page.evaluate(() => document.getElementById('radar-iphone-cost-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-iphone-cost-circle'));

      await page.evaluate(() => document.getElementById('radar-iphone-design-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-iphone-design-circle'));
      await page.evaluate(() => document.getElementById('radar-iphone-design-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-iphone-design-circle'));

      await page.evaluate(() => document.getElementById('radar-iphone-connectivity-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-iphone-connectivity-circle'));
      await page.evaluate(() => document.getElementById('radar-iphone-connectivity-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-iphone-connectivity-circle'));

      await page.evaluate(() => document.getElementById('radar-iphone-screen-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-iphone-screen-circle'));
      await page.evaluate(() => document.getElementById('radar-iphone-screen-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-iphone-screen-circle'));

      await page.evaluate(() => document.getElementById('radar-iphone-price-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-iphone-price-circle'));
      await page.evaluate(() => document.getElementById('radar-iphone-price-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-iphone-price-circle'));

      await page.evaluate(() => document.getElementById('radar-samsung-battery-life-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-samsung-battery-life-circle'));
      await page.evaluate(() => document.getElementById('radar-samsung-battery-life-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-samsung-battery-life-circle'));

      await page.evaluate(() => document.getElementById('radar-samsung-brand-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-samsung-brand-circle'));
      await page.evaluate(() => document.getElementById('radar-samsung-brand-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-samsung-brand-circle'));

      await page.evaluate(() => document.getElementById('radar-samsung-cost-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-samsung-cost-circle'));
      await page.evaluate(() => document.getElementById('radar-samsung-cost-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-samsung-cost-circle'));

      await page.evaluate(() => document.getElementById('radar-samsung-design-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-samsung-design-circle'));
      await page.evaluate(() => document.getElementById('radar-samsung-design-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-samsung-design-circle'));

      await page.evaluate(() => document.getElementById('radar-samsung-connectivity-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-samsung-connectivity-circle'));
      await page.evaluate(() => document.getElementById('radar-samsung-connectivity-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-samsung-connectivity-circle'));

      await page.evaluate(() => document.getElementById('radar-samsung-screen-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-samsung-screen-circle'));
      await page.evaluate(() => document.getElementById('radar-samsung-screen-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-samsung-screen-circle'));

      await page.evaluate(() => document.getElementById('radar-nokia-price-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-nokia-price-circle'));
      await page.evaluate(() => document.getElementById('radar-nokia-price-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-nokia-price-circle'));

      await page.evaluate(() => document.getElementById('radar-nokia-battery-life-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-nokia-battery-life-circle'));
      await page.evaluate(() => document.getElementById('radar-nokia-battery-life-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-nokia-battery-life-circle'));

      await page.evaluate(() => document.getElementById('radar-nokia-cost-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-nokia-cost-circle'));
      await page.evaluate(() => document.getElementById('radar-nokia-cost-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-nokia-cost-circle'));

      await page.evaluate(() => document.getElementById('radar-nokia-connectivity-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-nokia-connectivity-circle'));
      await page.evaluate(() => document.getElementById('radar-nokia-connectivity-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-nokia-connectivity-circle'));

      await page.evaluate(() => document.getElementById('radar-nokia-screen-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-nokia-screen-circle'));
      await page.evaluate(() => document.getElementById('radar-nokia-screen-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-nokia-screen-circle'));

      await page.evaluate(() => document.getElementById('radar-nokia-price-circle').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-nokia-price-circle'));
      await page.evaluate(() => document.getElementById('radar-nokia-price-circle').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-nokia-price-circle'));

      await page.evaluate(() => document.getElementById('radar-iphone-area').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-iphone-area'));
      await page.evaluate(() => document.getElementById('radar-iphone-area').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-iphone-area'));

      await page.evaluate(() => document.getElementById('radar-samsung-area').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-samsung-area'));
      await page.evaluate(() => document.getElementById('radar-samsung-area').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-samsung-area'));

      await page.evaluate(() => document.getElementById('radar-nokia-area').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-nokia-area'));
      await page.evaluate(() => document.getElementById('radar-nokia-area').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-nokia-area'));

      await page.evaluate(() => document.getElementById('radar-iphone-stroke').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-iphone-stroke'));
      await page.evaluate(() => document.getElementById('radar-iphone-stroke').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-iphone-stroke'));

      await page.evaluate(() => document.getElementById('radar-samsung-stroke').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-samsung-stroke'));
      await page.evaluate(() => document.getElementById('radar-samsung-stroke').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-samsung-stroke'));

      await page.evaluate(() => document.getElementById('radar-nokia-stroke').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-nokia-stroke'));
      await page.evaluate(() => document.getElementById('radar-nokia-stroke').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-nokia-stroke'));

      await page.evaluate(() => document.getElementById('radar-iphone-legend-0').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-iphone-legend-0'));
      await page.evaluate(() => document.getElementById('radar-iphone-legend-0').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-iphone-legend-0'));

      await page.evaluate(() => document.getElementById('radar-samsung-legend-1').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-samsung-legend-1'));
      await page.evaluate(() => document.getElementById('radar-samsung-legend-1').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-samsung-legend-1'));

      await page.evaluate(() => document.getElementById('radar-nokia-legend-2').getAttribute('id'))
        .then(id => expect(id).toEqual('radar-nokia-legend-2'));
      await page.evaluate(() => document.getElementById('radar-nokia-legend-2').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-radar-nokia-legend-2'));
    });

    it('should not visual regress', async () => {
      await page.waitForSelector('.widget');
      const widgeContainer = await page.$('.widget');
      const img = await widgeContainer.screenshot();
      const config = getConfig('radar');

      expect(img).toMatchImageSnapshot(config);
    });
  });
}); 
