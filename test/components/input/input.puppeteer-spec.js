describe('Input Puppeteer Tests', () => {
    describe('Index Tests', () => {
      const url = 'http://localhost:4000/components/input/example-index.html';
      //const puppeteer = require('puppeteer');

      beforeAll(async () => {
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
        //await page.screenshot({ path: 'input.png' });
      });

      it('should show the title', async () => {
        await expect(page.title()).resolves.toMatch('IDS Enterprise');  
        await page.waitForSelector('input[name="first-name"]');   
        await page.$eval('input[name="first-name"]', el => el.value = 'Adenosine triphosphate');
        await page.waitForTimeout(8000);
        await page.waitForSelector('#mw-content-text');

        const text = await page.evaluate(() => {
            const anchor = document.querySelector('#mw-content-text');
            return anchor.textContent;
        });
        console.log(text);
        await browser.close();


      });
    
    });

});