describe('Popdown Puppeteer Tests', () => {
  describe('Index Tests', () => {
    const url = 'http://localhost:4000/components/popdown/example-index?layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should display on click', async () => {
      await page.click('#popdown-example-trigger');
      await page.waitForSelector('.popdown', { visible: true });
      const popdown = await page.evaluate(() => !!document.querySelector('.popdown'));
      expect(popdown).toBeTruthy();
    });

    it('should have id/automation ids', async () => {
      let isFailed = false;
      const getIDandCompare = async (el, val) => {
        try {
          const elemHandle = await page.$(el);
          const elemID = await page.evaluate(elem => elem.getAttribute('data-automation-id'), elemHandle);
          expect(elemID).toEqual(val);
        } catch (error) {
          isFailed = true;
        }
      };
      await getIDandCompare('#popdown', 'popdown-automation-id');
      await getIDandCompare('#popover-listview-example', 'popover-listview-example-automation-id');
      await getIDandCompare('#edit-cart', 'edit-cart-automation-id');
      await getIDandCompare('#checkout', 'checkout-automation-id');
      expect(isFailed).toBe(false);
    });
  });

  describe('Outside Event Tests', () => {
    const url = 'http://localhost:4000/components/popdown/test-click-outside.html';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should show have outside event', async () => {
      // |----------------------------------------------------------|
      // | https://github.com/infor-design/enterprise/issues/3618   |
      // |----------------------------------------------------------|
      await page.click('#popdown-example-trigger');
      await page.waitForSelector('#maincontent');
      await page.click('#maincontent');
      await page.waitForSelector('[data-automation-id="popover-listview-example-automation-id"]');
      await page.click('[data-automation-id="popover-listview-example-automation-id"]');
      await page.waitForTimeout(1000);
      page
        .on('console', (message) => {
          expect(message.text()).toContain('click outside');
          const { _type, _text, _args } = message;
          const { _remoteObject } = _args[0];
          const value = _remoteObject.value;
          expect(_type).toBe('log');
          expect(_text).toBe('click outside JSHandle@object');
          expect(value).toBe('click outside');
        });
      await page.click('#maincontent');
    });
  });
});
