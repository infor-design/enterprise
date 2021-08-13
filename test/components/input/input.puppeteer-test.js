describe('Input Puppeteer Tests', () => {
    describe('Index Tests', () => {

      const url = 'http://localhost:4000/components/input/example-index.html';

      beforeAll(async () => {
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      });

      it('should test input fields', async () => {
        await expect(page.title()).resolves.toMatch('IDS Enterprise');  
      
        //populate fields
        await page.click('input[name="first-name"]');
        await page.type('input[name="first-name"]', 'Juan');

        await page.click('input[name="last-name"]');
        await page.type('input[name="last-name"]', 'Dela Cruz');
        
        await page.click('input[name="email-address"]');
        await page.type('input[name="email-address"]', 'jaundelacruz@infor.com');
        
/* FIELD VALIDATION */

        await page.click('input#email-address-ok');
        //await page.type('input[name="email-address-ok"]', 'jaundelacruz4@infor.com'); //if you comment this, it will fail.
        await page.click('input#email-address');
        await page.waitForTimeout(200);

        await page.waitForSelector('#email-address-ok')
        let element = await page.evaluate(() => {
          return !!document.querySelector('input.required.error') // !! converts anything to boolean
        })
        console.log(element);

        if(element == true){
          throw console.error('FIELD REQUIRED');
        }else{
          console.log('FIELD VALIDATED');
        }

      });
    
    });

});