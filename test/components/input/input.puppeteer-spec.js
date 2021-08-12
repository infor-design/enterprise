describe('Input Puppeteer Tests', () => {
    describe('Index Tests', () => {
      const url = 'http://localhost:4000/components/input/example-index.html';
      //const puppeteer = require('puppeteer');

      beforeAll(async () => {
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      });
      
      it('should show the title', async () => {
        await expect(page.title()).resolves.toMatch('IDS Enterprise');
      });

      /*(async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        await page.screenshot({ path: 'input.png' });
      
        await jestPuppeteer.debug();
        await browser.close();
      })();*/
    
    });
});