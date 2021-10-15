describe('Message Puppeteer Tests', () => {
  describe('Message close button Tests', () => {
    const url = 'http://localhost:4000/components/message/test-close-btn.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it(' should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it(' should show have close button on message, similar to Modal', async () => {
      await page.click('#huge-title');
      const el = await page.$eval('.btn-icon.btn-close', element => element.innerHTML);
      expect(el).toContain('<use href="#icon-close"></use>');
      await page.click('.btn-icon.btn-close');
      const xButton = await page.evaluate(() => !!document.querySelector('.btn-icon.btn-close'));
      expect(xButton).toBeFalsy();
      await page.click('#huge-title');
    });
  });

  describe('Message long title Tests', () => {
    const url = 'http://localhost:4000/components/message/test-long-title.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it(' should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it(' should show have modal that resizes toward max-width if the message text is long', async () => {
      await page.waitForSelector('#huge-title');
      await page.click('#huge-title');
      expect(await page.waitForSelector('#message-title', { visible: true }));
      expect(await page.waitForSelector('#message-text', { visible: true }));

      const titleWidth = await page.evaluate(() => {
        const msgtitle = document.querySelector('#message-title');
        return JSON.parse(JSON.stringify(getComputedStyle(msgtitle).width));
      });
      const textWidth = await page.evaluate(() => {
        const el = document.querySelector('#message-text');
        return JSON.parse(JSON.stringify(getComputedStyle(el).width));
      });

      expect(titleWidth).toEqual(textWidth);
    });
  });
});
