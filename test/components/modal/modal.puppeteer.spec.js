describe('Modal Puppeteer Tests', () => {
    describe('Index Tests', () => {

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

        await page.waitForSelector('.has-open-tooltip')
        let element = await page.evaluate(() => {
          return !!document.querySelector('.has-open-tooltip') //converts anything to boolean
        })
        console.log(element);

        if(element == false){
          throw console.error('TOOLTIP NOT TRIGGERED');
        }else{
          console.log('TOOLTIP TRIGGERED');
        }
      });
    });
});