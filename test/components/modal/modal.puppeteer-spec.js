describe('Modal Puppeteer Tests', () => {
    describe('Modal Test', () => {

      const url = 'http://localhost:4000/components/modal/example-index';
      
      beforeAll(async () => {
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      });

      it('should not have error', async () => {
        await page.on('error', function (err) {
          const theTempValue = err.toString();
          console.log(`Error: ${theTempValue}`);
        });
      });

      it('Should open modal on tab, and enter', async () => {
        await expect(page.title()).resolves.toMatch('IDS Enterprise');  
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");
        await page.waitForTimeout(200);

        const element = await page.evaluate(() => 
          !!document.querySelector('.modal.is-visible.is-active')
        );
        console.log(element);
        if(element == true){
          console.log('modal opened');
        }else{
          throw console.error('modal did not open');
        } 
      });

      it('Should close modal on tab, and escape', async () => {
        await expect(page.title()).resolves.toMatch('IDS Enterprise');  
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");

        const element = await page.evaluate(() => 
           !!document.querySelectorAll('.modal.is-visible.is-active')
         );
         console.log('before ' + element);

        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);

        const element2 = await page.evaluate(() => 
        !!document.querySelectorAll('.modal.is-visible.is-active')
        );
        console.log('after ' + element2);
        if(element === true){
          throw console.error('modal did not close');
        }else{
          console.log('modal closed');
        }
      });

    });

    describe('Modal Tooltip Test', () => {

      const url = 'http://localhost:4000/components/modal/test-custom-tooltip-close-btn.html';
    
      beforeAll(async () => {
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      });

      it('should test modal tooltip', async () => {
        await expect(page.title()).resolves.toMatch('IDS Enterprise');  
        await page.click('#add-context');
        await page.waitForTimeout(200);

        await page.waitForSelector('#add-context-modal');

        await page.hover('#add-context-modal-btn-close');
        await page.waitForTimeout(200);

        await page.waitForSelector('.has-open-tooltip');
        const element = await page.evaluate(() => 
              !!document.querySelector('.has-open-tooltip') 
        );
        console.log(element);

        if(element === false){
          throw console.error('TOOLTIP NOT TRIGGERED');
        }else{
          console.log('TOOLTIP TRIGGERED');
        }
      });
    });
});