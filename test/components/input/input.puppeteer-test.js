describe('Input Puppeteer Tests', () => {
    describe('Index Tests', () => {

      const url = 'http://localhost:4000/components/input/example-index.html';

      beforeAll(async () => {
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      });

      it('should show the title', async () => {
        await expect(page.title()).resolves.toMatch('IDS Enterprise');  
        
        //populate fields
        /*
        await page.click('input[name="first-name"]');
        await page.type('input[name="first-name"]', 'Juan');

        await page.click('input[name="last-name"]');
        await page.type('input[name="last-name"]', 'Dela Cruz');
        

        await page.click('input[name="email-address"]');
        await page.type('input[name="email-address"]', 'jaundelacruz@infor.com');
        */
        await page.click('input[name="email-address-ok"]');
        await page.click('input[name="department-code-trackdirty"]');

        //validate
        await page.click('input[name="email-address-ok"]');
        //await page.type('input[name="email-address-ok"]', 'jaundelacruz2@infor.com');
        await page.waitForSelector('#email-address-ok-error', {visible: true});



/* 
       let emailVal = await page.$eval('input.required.error', 
        (input) => input.emailVal
        );
        expect(emailVal.toBe(true));
*/
        
        /*const text = await page.evaluate(() => {
            const anchor = document.querySelector('#required-error');
            return anchor.textContent;
        });
        console.log(text);
        await browser.close();*/
        
        /*let lastNameValidation = await page.$eval('input[name="first-name"]', 
        (input) => input.lastNameValidation
        );

        expect(lastNameValidation.toBe('invalid'));
        await browser.close();*/
        
       // await page.screenshot({ path: 'input.png' });

      });
    
    });

});