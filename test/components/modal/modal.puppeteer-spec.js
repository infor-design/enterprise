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
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");
        await page.waitForTimeout(200);
        const visibleModal = await page.waitForSelector('.modal.is-visible.is-active', {visible:true});
        expect(visibleModal).toBeTruthy();
      });

      it('should close modal on tab, and escape', async () => {
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(200);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        const closeModal = await page.$('.modal.is-visible.is-active');
        expect(closeModal).toBeFalsy();
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

        const element = await page.waitForSelector('.has-open-tooltip');
        expect(element).toBeTruthy();
        console.log(element);
      });
    });
});
