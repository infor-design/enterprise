describe('Tooltip Puppeteer Tests', () => {
  // const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  describe('Index tests', () => {
    const url = 'http://localhost:4000/components/tooltip/example-index?theme=classic&mode=light&layout=nofrills';

    beforeEach(async () => {
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

    it('should display when hovering the button', async () => {
      await page.hover('#tooltip-btn');
      // wait(200);
      await page.waitForTimeout(900);
      const tooltipVal = await page.$eval('#tooltip > div.tooltip-content', el => el.textContent);
      expect(tooltipVal).toEqual('Tooltips Provide Additional Information'); // if this fail add a bit more time out on line 25
    });

    const getIDandCompare = async (el, val) => {
      let isFailed = false;
      try {
        const elemHandle = await page.$(el);
        const elemID = await page.evaluate(elem => elem.getAttribute('data-automation-id'), elemHandle);
        expect(elemID).toEqual(val);
      } catch (error) {
        isFailed = true;
      }
      return isFailed;
    };

    it('should be able to set id/automation id', async () => {
      await page.hover('#tooltip-btn');
      await page.waitForSelector('#tooltip > div.tooltip-content', { visible: true });
      expect(await page.$eval('#tooltip-btn', el => el.id)).toEqual('tooltip-btn');
      expect(await page.$eval('#tooltip', el => el.id)).toEqual('tooltip');

      // get data-automation id
      const isFailed = [];
      isFailed.push(await getIDandCompare('#tooltip', 'test-tooltip'));
      isFailed.push(await getIDandCompare('#tooltip-btn', 'test-tooltip-trigger'));
      expect(isFailed).not.toContain('true');
    });

    it('should display when tabbing in', async () => {
      await page.click('.six h2');
      await page.keyboard.press('Tab');
      await page.waitForSelector('#tooltip > div.tooltip-content', { visible: true });
      expect(await page.$eval('#tooltip > div.tooltip-content', el => el.textContent)).toEqual('Tooltips Provide Additional Information');
    });

    it('should not display when tabbing through', async () => {
      await page.click('.six h2');
      await page.waitForTimeout(100);
      const btn = await page.$('#tooltip-btn');
      await btn.press('Tab');
      await btn.press('Tab');
      // wait(1000);
      expect(await page.waitForSelector('#tooltip > div.tooltip-content', { visible: false })).toBeTruthy();
      const tooltipval = await page.$eval('#tooltip > div.tooltip-content', el => el.textContent);
      expect(tooltipval).toEqual('');
    });
  });

  describe('Tooltips on icon tests', () => {
    const url = 'http://localhost:4000/components/tooltip/test-svg-icons';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'aria-allowed-role'] });
    });

    it('should display a tooltip when hovering an icon', async () => {
      const elHandleArray = await page.$$('.icon.has-tooltip');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const elem of elHandleArray) {
        await elem.hover();
        await page.waitForSelector('#tooltip', { visible: true });
        const tooltipval = await page.$eval('#tooltip > div.tooltip-content', el => el.textContent);
        try {
          switch (index) {
            case 0:
              expect(tooltipval).toEqual('Send to Trashcan');
              break;
            case 1:
              expect(tooltipval).toEqual('Send to Inbox');
              break;
            case 2:
              expect(tooltipval).toEqual('View Settings');
              break;
            case 3:
              expect(tooltipval).toEqual('Save to Disk');
              break;
            default:
              // eslint-disable-next-line no-console
              console.error('No Value Found');
          }
          // await page.waitForTimeout(500);
        } catch (error) {
          // DO NOTHING
        }
        index += 1;
      }
    });
  });

  describe('Tooltip (personalizable) tests', () => {
    const url = 'http://localhost:4000/components/header/example-disabled-buttons?theme=soho&variant=dark&colors=206b62';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'landmark-one-main', 'region', 'skip-link'] });
    });

    // Fixes Github Issue `infor-design/enterprise#3011`
    // Hover the buttons on the top right to activate the tooltip. The text on the tooltip should be white.
    it('should display a tooltip when hovering a button on the top right', async () => {
      await page.hover('#parameter-maintenance-reset');
      await page.waitForSelector('#tooltip', { visible: true });
      const tooltipval = (await page.$eval('#tooltip', el => el.textContent)).trim();
      expect(tooltipval).toEqual('Undo Edit');
      const tooltipColor = await page.$eval('#tooltip', e => getComputedStyle(e).backgroundColor);
      expect(tooltipColor).toBe('rgb(255, 255, 255)');
    });
  });

  describe('Tooltips icons page tests', () => {
    const url = 'http://localhost:4000/components/tooltip/example-icon-in-tooltip?theme=classic&layout=nofrills';
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

    it('should display tooltip with icon', async () => {
      await page.hover('#tooltip-btn');
      await page.waitForSelector('#tooltip', { visible: true });
      const iconTooltip = await page.$eval('#tooltip .tooltip-content', element => element.innerHTML);
      expect(iconTooltip).toContain('<use href="#icon-compose"></use>');
    });
  });

  describe('Tooltips with pound sign tests', () => {
    const url = 'http://localhost:4000/components/tooltip/test-tooltip-starts-with-pound-sign?theme=classic&layout=nofrills';
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

    it('should display tooltip with #content', async () => {
      await page.hover('#tooltip-btn');
      await page.waitForSelector('#tooltip', { visible: true });
      const tooltipHandle = await page.$('#tooltip .tooltip-content');
      const tooltipValue = await page.evaluate(el => el.innerHTML, tooltipHandle);
      expect(tooltipValue).toEqual('#Tooltips Provide Additional Information');
    });
  });
  async function checkTooltip(parentEL, tooltipEL, elHandle, expectedValue) {
    let isFailed = false;
    try {
      await page.waitForSelector(parentEL);
      await page.hover(parentEL);
      await page.waitForSelector(tooltipEL, { visible: true });
      const tooltipHandle = await page.$(elHandle);
      const tooltipValue = await page.evaluate(el => el.innerText, tooltipHandle);
      // console.log(`Tooltip Value: ${chalk.cyan(tooltipValue)}`);
      expect(tooltipValue).toEqual(expectedValue);
    } catch (error) {
      isFailed = true;
    }
    return isFailed;
  }

  describe('Tooltips Ajax test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-ajax-tooltip?theme=classic&layout=nofrills';
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

    it('should display tooltip with #content', async () => {
      const btnIDOne = '.twelve > .btn-secondary:nth-child(1)';
      const btnIDTwo = '.twelve > .btn-secondary:nth-child(2)';
      const tooltip = '#tooltip';
      const tooltipContent = '#tooltip .tooltip-content';
      const expectedValue = 'Tooltips Provide\nInteresting Information';
      const isFailed = [];
      isFailed.push(await checkTooltip(btnIDOne, tooltip, tooltipContent, expectedValue));
      // wait(100);
      isFailed.push(await checkTooltip(btnIDTwo, tooltip, tooltipContent, expectedValue));
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Tooltips Extra Css Test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-extra-css-class.html?theme=classic&mode=light&layout=nofrills';
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

    it('should display tooltip with Extra Class', async () => {
      await page.waitForSelector('#tooltip-btn');
      await page.click('#tooltip-btn');
      await page.waitForSelector('.tooltip.TEST-green', { visible: true });
      const tooltipColor = await page.$eval('#tooltip', e => getComputedStyle(e).backgroundColor);
      expect(tooltipColor).toEqual('rgb(72, 132, 33)');

      const extraClass = await page.evaluate(() => !!document.querySelector('.tooltip.TEST-green'));
      if (!extraClass) { console.error('Extra Class: not Present'); }
      expect(extraClass).toBeTruthy();
    });
  });

  describe('Tooltips as HTML test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-html-tooltip.html?theme=classic&mode=light&layout=nofrills';
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

    it('should show the HTML Tooltip', async () => {
      await page.hover('#button1');
      await page.waitForSelector('#tooltip', { visible: true });
      const iconTooltip = await page.$eval('#tooltip .tooltip-content', element => element.innerHTML);
      expect(iconTooltip).toContain('<span style="text-align: right; display: inline-block;">');
    });
  });

  describe('Tooltips Keep Open test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-keep-open.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'color-contrast'] });
    });

    it('should show the HTML Tooltip', async () => {
      await page.hover('#test-link');
      await page.waitForSelector('#tooltip', { visible: true });
      await page.mouse.move(1000, 40);
      expect(await page.waitForSelector('.tooltip.is-open', { visible: true })).toBeTruthy();
    });
  });

  describe('Tooltips On Elements test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-tooltips-on-elements.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'aria-allowed-role', 'aria-required-attr', 'color-contrast', 'button-name'] });
    });

    it('should show the HTML Tooltip', async () => {
      const txtEMail = '#email-address-ok';
      const txtName = '#firstlastname';
      const txtcreditcard = '#credit-card';
      const txtCode = '#credit-code';
      const txtCode2 = '#credit-code2';
      const tooltip = '#tooltip';
      const tooltipOnElement = 'span > #tooltip .tooltip-content';
      const tooltipContent = '#tooltip .tooltip-content';
      const isFailed = [];
      isFailed.push(await checkTooltip(txtEMail, tooltip, tooltipContent, 'Enter an email address')); // check if tooltip in email address field is exist
      isFailed.push(await checkTooltip(txtName, tooltip, tooltipOnElement, 'Enter your name'));// check if tooltip in first last name field is exist and the tooltip is present on another element
      isFailed.push(await checkTooltip(txtcreditcard, tooltip, tooltipContent, 'Enter a credit card number'));// check if tooltip in credit card field is exist
      isFailed.push(await checkTooltip(txtCode, tooltip, tooltipContent, 'Enter a credit code'));// check if tooltip in code field is exist
      isFailed.push(await checkTooltip(txtCode2, tooltip, tooltipContent, 'Look up a credit code'));// check if tooltip in Look up code field is exist
      expect(isFailed).not.toContain('true');
    });
  });

  describe('Tooltips On Trigger Click test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-trigger-click.html?theme=classic&mode=light&layout=nofrills';
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

    it('should show the tooltip OnClick', async () => {
      await page.hover('#tooltip-btn');
      expect(await page.waitForSelector('#tooltip', { visible: false })).toBeTruthy();
      await page.click('#tooltip-btn');
      expect(await page.waitForSelector('#tooltip', { visible: true })).toBeTruthy();
      const tooltipValue = await page.$eval('#tooltip .tooltip-content', element => element.innerText);
      expect(tooltipValue).toEqual('This tooltip is displayed on click!');
    });
  });

  describe('Tooltips On Focus test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-trigger-focus.html?theme=classic&mode=light&layout=nofrills';
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

    it('should show the tooltip On Focus', async () => {
      await page.waitForSelector('#tooltip-btn');
      await page.hover('#tooltip-btn');
      expect(await page.waitForSelector('#tooltip', { visible: false })).toBeTruthy();
      await page.focus('#tooltip-btn');
      expect(await page.waitForSelector('#tooltip', { visible: true })).toBeTruthy();
      await page.click('.row > .six > h2');
      expect(await page.waitForSelector('#tooltip', { visible: false })).toBeTruthy();
      await page.keyboard.press('Tab');
      expect(await page.waitForSelector('#tooltip', { visible: true })).toBeTruthy();
      const tooltipValue = await page.$eval('#tooltip .tooltip-content', element => element.innerText);
      expect(tooltipValue).toEqual('This tooltip is displayed on a focus event!');
    });
  });

  describe('Tooltips Trigger Immediate test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-trigger-immediate.html?theme=classic&mode=light&layout=nofrills';
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

    it('should show the tooltip on Trigger Immediate', async () => {
      await page.waitForSelector('#tooltip-btn');
      await page.hover('#tooltip-btn');
      await page.click('#tooltip-btn');
      expect(await page.waitForSelector('#tooltip', { visible: true })).toBeTruthy();
      const tooltipValue = await page.$eval('#tooltip .tooltip-content', element => element.innerText);
      expect(tooltipValue).toEqual('Activated 1 times!');

      await page.waitForTimeout(200);
      await page.hover('#tooltip-btn');
      await page.click('#tooltip-btn');
      expect(await page.waitForSelector('#tooltip', { visible: true })).toBeTruthy();
      await page.waitForTimeout(200);
      const tooltipValue2 = await page.$eval('#tooltip .tooltip-content', element => element.innerText);
      expect(tooltipValue2).toEqual('Activated 2 times!');
    });
  });

  describe('Tooltips url inside a tooltip', () => {
    const url = 'http://localhost:4000/components/tooltip/example-url-in-tooltip.html?theme=classic&mode=light&layout=nofrills';
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

    it('should show the url on Tooltip', async () => {
      // save target of original page to know that this was the opener:
      const pageTarget = page.target();
      await page.waitForSelector('[data-automation-id="awesome-trigger"]');
      await page.hover('[data-automation-id="awesome-trigger"]');
      expect(await page.waitForSelector('#tooltip', { visible: true })).toBeTruthy();
      const tooltipValue = await page.$eval('#tooltip .tooltip-content', element => element.innerHTML);
      // const hrefValue = await page.$eval('[data-automation-id="my-hyperlink"]', anchor => anchor.getAttribute('href'));

      expect(tooltipValue).toContain('<a class="hyperlink links-clickable" data-automation-id="my-hyperlink" href="http://www.infor.com" target="_blank">Infor Website</a>');
      await page.hover('#tooltip');

      // execute click on first tab that triggers opening of new tab:
      await page.waitForSelector('[data-automation-id="my-hyperlink"]');
      await page.click('[data-automation-id="my-hyperlink"]');

      // check that the first page opened this new page:
      const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
      expect(newTarget).toBeTruthy();

      // get the new page object:
      const newPage = await newTarget.page();
      await expect(newPage.title()).resolves.toMatch('ERP Cloud Software | AI ERP Cloud Products for Enterprise | Infor'); // if this fail just turn on your internet connection
    });
  });
});
