const { checkIfElementExist, checkDataAutomationID, checkClassNameValue, checkTooltipValue, checkIfElementHasFocused } = require('../../helpers/e2e-utils.js');

describe('Radar Puppeteer Tests', () => {
  describe('Radar Contextmenu Tests', () => {
    const url = 'http://localhost:4000/components/radar/example-contextmenu.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show context menu in chart radar', async () => {
      const contextmenu = '#action-popupmenu.popupmenu.is-open';
      const actionOne = 'li.is-focused > a';
      const isFailed = [];
      const radarWrapper = await page.$$('.chart-radar-wrapper');
      let index = 2;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of radarWrapper) {
        await eL.hover();
        await page.click(`g:nth-child(${index}) > circle:nth-child(3)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        await page.click(`g:nth-child(${index}) > circle:nth-child(4)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        await page.click(`g:nth-child(${index}) > circle:nth-child(5)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        await page.click(`g:nth-child(${index}) > circle:nth-child(6)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        await page.click(`g:nth-child(${index}) > circle:nth-child(7)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        await page.click(`g:nth-child(${index}) > circle:nth-child(8)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        await page.click(`g:nth-child(${index}) > circle:nth-child(9)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });

    it('should show context menu in radar circle', async () => {
      const contextmenu = '#action-popupmenu.popupmenu.is-open';
      const actionOne = 'li.is-focused > a';
      const isFailed = [];
      const radarWrapper = await page.$$('.radar-circle-wrapper');
      let index = 5;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of radarWrapper) {
        await eL.hover();
        await page.click(`g:nth-child(${index}) > circle:nth-child(1)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        await page.click(`g:nth-child(${index}) > circle:nth-child(2)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        await page.click(`g:nth-child(${index}) > circle:nth-child(3)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        await page.click(`g:nth-child(${index}) > circle:nth-child(4)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        await page.click(`g:nth-child(${index}) > circle:nth-child(5)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        await page.click(`g:nth-child(${index}) > circle:nth-child(6)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        await page.click(`g:nth-child(${index}) > circle:nth-child(7)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

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

  describe('Radar Hcm Tests', () => {
    const url = 'http://localhost:4000/components/radar/example-hcm.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should highlight when selected', async () => {
      const isFailed = [];
      await page.click('g:nth-child(3) > path.chart-radar-area');
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue('g:nth-child(2) > path:nth-child(1)', 'chart-radar-area is-not-selected'));
      isFailed.push(await checkClassNameValue('g:nth-child(3) > path:nth-child(1)', 'chart-radar-area is-selected'));
      await page.click('g:nth-child(3) > path.chart-radar-area');
      await page.click('span[index-id="chart-legend-0"]');
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue('g:nth-child(2) > path:nth-child(1)', 'chart-radar-area is-selected'));
      isFailed.push(await checkClassNameValue('g:nth-child(3) > path:nth-child(1)', 'chart-radar-area is-not-selected'));
      await page.click('span[index-id="chart-legend-0"]');
      await page.click('span[index-id="chart-legend-1"]');
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue('g:nth-child(2) > path:nth-child(1)', 'chart-radar-area is-not-selected'));
      isFailed.push(await checkClassNameValue('g:nth-child(3) > path:nth-child(1)', 'chart-radar-area is-selected'));
      await page.click('span[index-id="chart-legend-1"]');
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Radar Index Tests', () => {
    const url = 'http://localhost:4000/components/radar/example-index.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
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
      "level": 2,
      "name": "Radar Chart Title",
      "role": "heading",
    },
    Object {
      "name": "40%",
      "role": "StaticText",
    },
    Object {
      "name": "30%",
      "role": "StaticText",
    },
    Object {
      "name": "20%",
      "role": "StaticText",
    },
    Object {
      "name": "10%",
      "role": "StaticText",
    },
    Object {
      "name": "Battery",
      "role": "StaticText",
    },
    Object {
      "name": "Life",
      "role": "StaticText",
    },
    Object {
      "name": "Brand",
      "role": "StaticText",
    },
    Object {
      "name": "Cost",
      "role": "StaticText",
    },
    Object {
      "name": "Design",
      "role": "StaticText",
    },
    Object {
      "name": "Connectivity",
      "role": "StaticText",
    },
    Object {
      "name": "Screen",
      "role": "StaticText",
    },
    Object {
      "name": "Price",
      "role": "StaticText",
    },
    Object {
      "name": "Highlight iPhone X",
      "role": "button",
    },
    Object {
      "name": "Highlight Samsung",
      "role": "button",
    },
    Object {
      "name": "Highlight Nokia Smartphone",
      "role": "button",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
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
        await page.waitForTimeout(200);
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
    }, 11000);

    it('should show pointer as a cursor', async () => {
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
        expect(await checkCursor(`#radar-${brand}-area`)).toContain('pointer');
        index += 1;
      }
    });

    it('should be able to tab through the legends', async () => {
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      });
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([0, 0, 0]); // These are the values of tabindex of all the legends.
      await page.click('body.no-scroll');
      const iphone = 'span#radar-iphone-legend-0.chart-legend-item.lg.is-two-column';
      const samsung = 'span#radar-samsung-legend-1.chart-legend-item.lg.is-two-column';
      const nokia = 'span#radar-nokia-legend-2.chart-legend-item.lg.is-two-column';
      const isFailed = [];
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(iphone));
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(samsung));
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(nokia));
      expect(isFailed).not.toContain(true);
    });

    it('should highlight when selected', async () => {
      const isFailed = [];
      const iphone = '#radar-iphone-area';
      const samsung = '#radar-samsung-area';
      const nokia = '#radar-nokia-area';
      await page.click(iphone);
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area is-not-selected'));
      isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area is-not-selected'));
      isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area is-selected'));
      await page.click(iphone);
      await page.waitForTimeout(200);

      await page.click(samsung);
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area is-not-selected'));
      isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area is-not-selected'));
      isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area is-selected'));
      await page.click(samsung);
      await page.waitForTimeout(200);

      await page.click(nokia);
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area is-not-selected'));
      isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area is-not-selected'));
      isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area is-selected'));
      await page.click(nokia);
      await page.waitForTimeout(200);
      expect(isFailed).not.toContain(true);
    });

    it('should highlight on click in legends', async () => {
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      });
      const elHandleArray = await page.$$('.chart-radar-wrapper');
      const isFailed = [];
      let index = 0;
      const iphone = '#radar-iphone-area';
      const samsung = '#radar-samsung-area';
      const nokia = '#radar-nokia-area';

      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) { // eslint-disable-line no-unused-vars
        let brand = '';
        switch (index) {
          case 0:
            brand = 'iphone';
            await page.waitForTimeout(300);
            await page.click(`#radar-${brand}-legend-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area is-selected'));
            isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area is-not-selected'));
            isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area is-not-selected'));
            break;
          case 1:
            brand = 'samsung';
            await page.click(`#radar-${brand}-legend-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area is-not-selected'));
            isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area is-selected'));
            isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area is-not-selected'));
            break;
          case 2:
            brand = 'nokia';
            await page.waitForTimeout(300);
            await page.click(`#radar-${brand}-legend-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area is-not-selected'));
            isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area is-not-selected'));
            isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area is-selected'));
            break;
          default:
            console.warn('line-group element not found');
        }
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });
});

