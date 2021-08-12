describe('Input Puppeteer Tests', () => {
    describe('Index Tests', () => {

      const url = 'http://localhost:4000/components/input/example-index.html';

      beforeAll(async () => {
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      });

      it('should show the title', async () => {
        await expect(page.title()).resolves.toMatch('IDS Enterprise');  
        await page.click('input[name="first-name"]');
        await page.type('input[name="first-name"]', 'Juan Dela Cruz');

        await page.click('input[name="first-name"]');
        await page.click('input[name="last-name"]');
        let lastNameValidation = await page.$eval('input[name="first-name"]', 
        (input) => input.lastNameValidation
        );

        expect(lastNameValidation.toBe('invalid'));
        await browser.close();
        
        //await page.$eval('input[name="first-name"]', el => el.value = 'Juan Dela Cruz');
       // await page.screenshot({ path: 'input.png' });

      });
    
    });

});