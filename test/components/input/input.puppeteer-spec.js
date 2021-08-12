describe('Input Puppeteer Tests', () => {
    describe('Index Tests', () => {
    browser = await puppeteer.launch(
        {
            headless: false,
            slowMo:35
        }
    );

      const url = 'http://localhost:4000/components/input/example-index.html';
      //const puppeteer = require('puppeteer');

      beforeAll(async () => {
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
        //await page.screenshot({ path: 'input.png' });
      });

      it('should show the title', async () => {
        await expect(page.title()).resolves.toMatch('IDS Enterprise');  
        await page.waitForSelector('input[name="first-name"]');   
        await page.$eval('input[name="first-name"]', el => el.value = 'Juan Dela Cruz');
        await page.screenshot({ path: 'input.png' });

       /* const text = await page.evaluate(() => {
            const anchor = document.querySelector('#mw-content-text');
            return anchor.textContent;
        });
        console.log(text);
        await browser.close();*/

      });
    
    });

});