const { checkDataAutomationID, checkClassNameValue, checkTooltipValue } = require('../../helpers/e2e-utils.js');

describe('Radar Puppeteer Tests', () => {
  describe('Radar Disable Selection  State Tests', () => {
    const url = 'http://localhost:4000/components/radar/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      const elHandleArray = await page.$$('.chart-radar-wrapper');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let brand = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            brand = 'iphone';
            break;
          case 1: // Line B
            brand = 'samsung';
            break;
          case 2: // Line C
            brand = 'nokia';
            break;
          default:
            console.warn('line-group element not found');
        }
        isFailed.push(await checkDataAutomationID(`#radar-${brand}-battery-life-circle`, `automation-id-radar-${brand}-battery-life-circle`));
        isFailed.push(await checkDataAutomationID(`#radar-${brand}-brand-circle`, `automation-id-radar-${brand}-brand-circle`));
        isFailed.push(await checkDataAutomationID(`#radar-${brand}-cost-circle`, `automation-id-radar-${brand}-cost-circle`));
        isFailed.push(await checkDataAutomationID(`#radar-${brand}-design-circle`, `automation-id-radar-${brand}-design-circle`));
        isFailed.push(await checkDataAutomationID(`#radar-${brand}-connectivity-circle`, `automation-id-radar-${brand}-connectivity-circle`));
        isFailed.push(await checkDataAutomationID(`#radar-${brand}-screen-circle`, `automation-id-radar-${brand}-screen-circle`));
        isFailed.push(await checkDataAutomationID(`#radar-${brand}-price-circle`, `automation-id-radar-${brand}-price-circle`));

        // Area
        isFailed.push(await checkDataAutomationID(`#radar-${brand}-area`, `automation-id-radar-${brand}-area`));

        // Stroke
        isFailed.push(await checkDataAutomationID(`#radar-${brand}-stroke`, `automation-id-radar-${brand}-stroke`));

        // Legends
        isFailed.push(await checkDataAutomationID(`#radar-${brand}-legend-${index}`, `automation-id-radar-${brand}-legend-${index}`));

        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });

    it('should show the tooltip with data', async () => {
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      });
      const tooltip = '#svg-tooltip';
      const tooltipContent = '#svg-tooltip .tooltip-content';
      const elHandleArray = await page.$$('.chart-radar-wrapper');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) { // eslint-disable-line no-unused-vars
        switch (index) {
          case 0: // iPhone
            isFailed.push(await checkTooltipValue('#radar-iphone-battery-life-circle', tooltip, tooltipContent, '22%'));
            isFailed.push(await checkTooltipValue('#radar-iphone-brand-circle', tooltip, tooltipContent, '28%'));
            isFailed.push(await checkTooltipValue('#radar-iphone-cost-circle', tooltip, tooltipContent, '30%'));
            isFailed.push(await checkTooltipValue('#radar-iphone-design-circle', tooltip, tooltipContent, '17%'));
            isFailed.push(await checkTooltipValue('#radar-iphone-connectivity-circle', tooltip, tooltipContent, '22%'));
            isFailed.push(await checkTooltipValue('#radar-iphone-screen-circle', tooltip, tooltipContent, '4%'));
            isFailed.push(await checkTooltipValue('#radar-iphone-price-circle', tooltip, tooltipContent, '21%'));
            break;
          case 1: // Samsung
            isFailed.push(await checkTooltipValue('#radar-samsung-battery-life-circle', tooltip, tooltipContent, '26%'));
            isFailed.push(await checkTooltipValue('#radar-samsung-brand-circle', tooltip, tooltipContent, '16%'));
            isFailed.push(await checkTooltipValue('#radar-samsung-cost-circle', tooltip, tooltipContent, '35%'));
            isFailed.push(await checkTooltipValue('#radar-samsung-design-circle', tooltip, tooltipContent, '14%'));
            isFailed.push(await checkTooltipValue('#radar-samsung-connectivity-circle', tooltip, tooltipContent, '22%'));
            isFailed.push(await checkTooltipValue('#radar-samsung-screen-circle', tooltip, tooltipContent, '13%'));
            isFailed.push(await checkTooltipValue('#radar-samsung-price-circle', tooltip, tooltipContent, '35%'));
            break;
          case 2: // Nokia
            isFailed.push(await checkTooltipValue('#radar-nokia-battery-life-circle', tooltip, tooltipContent, '26%'));
            isFailed.push(await checkTooltipValue('#radar-nokia-brand-circle', tooltip, tooltipContent, '10%'));
            isFailed.push(await checkTooltipValue('#radar-nokia-cost-circle', tooltip, tooltipContent, '30%'));
            isFailed.push(await checkTooltipValue('#radar-nokia-design-circle', tooltip, tooltipContent, '14%'));
            isFailed.push(await checkTooltipValue('#radar-nokia-connectivity-circle', tooltip, tooltipContent, '22%'));
            isFailed.push(await checkTooltipValue('#radar-nokia-screen-circle', tooltip, tooltipContent, '4%'));
            isFailed.push(await checkTooltipValue('#radar-nokia-price-circle', tooltip, tooltipContent, '41%'));
            break;
          default:
            console.warn('line-group element not found');
        }
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    }, 10000);

    it('should not show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);
      const elHandleArray = await page.$$('.chart-radar-wrapper');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let brand = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            brand = 'iphone';
            break;
          case 1: // Line B
            brand = 'samsung';
            break;
          case 2: // Line C
            brand = 'nokia';
            break;
          default:
            console.warn('line-group element not found');
        }

        await page.hover(`#radar-${brand}-area`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#radar-${brand}-area`)).toContain('inherit');
        index += 1;
      }
    });

    it('should not able to tab through the legends', async () => {
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1, -1, -1]); // These are the values of tabindex of all the legends.
    });

    it('should not highlight when selected', async () => {
      const isFailed = [];
      const iphone = '#radar-iphone-area';
      const samsung = '#radar-samsung-area';
      const nokia = '#radar-nokia-area';
      await page.click(iphone);
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area'));
      isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area'));
      isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area'));
      await page.click(iphone);
      await page.waitForTimeout(200);

      await page.click(samsung);
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area'));
      isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area'));
      isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area'));
      await page.click(samsung);
      await page.waitForTimeout(200);

      await page.click(nokia);
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area'));
      isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area'));
      isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area'));
      await page.click(nokia);
      await page.waitForTimeout(200);
      expect(isFailed).not.toContain(true);
    });

    it('should not highlight on click in legends', async () => {
      const elHandleArray = await page.$$('.chart-radar-wrapper');
      const isFailed = [];
      let index = 0;
      const iphone = '#radar-iphone-area';
      const samsung = '#radar-samsung-area';
      const nokia = '#radar-nokia-area';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let brand = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            brand = 'iphone';
            break;
          case 1: // Line B
            brand = 'samsung';
            break;
          case 2: // Line C
            brand = 'nokia';
            break;
          default:
            console.warn('line-group element not found');
        }
        await page.click(`#radar-${brand}-legend-${index}`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area'));
        isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area'));
        isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area'));
        await page.click(`#radar-${brand}-legend-${index}`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });
});

