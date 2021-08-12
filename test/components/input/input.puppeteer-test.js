describe('Input Puppeteer Tests', () => {
    describe('Index Tests', () => {

      const url = 'http://localhost:4000/components/input/example-index.html';

      beforeAll(async () => {
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      });

      it('should show the title', async () => {
        await expect(page.title()).resolves.toMatch('IDS Enterprise');  
        await page.click('input[name="first-name"]');
        await page.keyboard.type('input[name="first-name"]', 'Juan');

        await page.click('input[name="last-name"]');
        await page.type('input[name="last-name"]', 'Dela Cruz');
        

        await page.click('input[name="email-address"]');
        await page.keyboard.type('input[name="email-address"]', 'jaundelacruz@infor.com');

        await page.click('input[name="email-address-ok"]');
        await page.click('input[name="department-code-trackdirty"]');

        //validate
        await page.waitForSelector('input.required.error', {
          visible: true,
        })

        await page.click('input[name="email-address-ok"]');
        await page.keyboard.type('input[name="email-address-ok"]', 'jaundelacruz2@infor.com');
        await page.waitForSelector('input.required.error', {
          visible: false,
        })

      });
    
    });

});