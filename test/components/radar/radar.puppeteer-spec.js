//import { getConfig } from "../../helpers/e2e-utils.js";

describe('Radar', () => {
  const baseUrl = 'http://localhost:4000/components/radar';

  describe('Index tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`

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

////
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




    });

  });

}); 
