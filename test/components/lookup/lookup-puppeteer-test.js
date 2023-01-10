describe('Lookup Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/lookup';

  describe.skip('double click apply tests', () => {
    const url = `${baseUrl}/example-dblclick`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should update the value using apply button', async () => {
      await page.click('.trigger');

      await page.waitForSelector('.modal-content')
        .then(element => expect(element).toBeTruthy());

      expect(await page.$$eval('tr.datagrid-row', el => el.length)).toEqual(6);

      await page.click('[aria-rowindex="3"]');
      await page.click('#modal-button-2');
      const inputValue = await page.$eval('#product-lookup', element => element.value);
      expect(inputValue).toContain('2342203');
    });

    it('should update the value using double click', async () => {
      await page.click('.trigger');

      await page.waitForSelector('.modal-content', { visible: true })
        .then(element => expect(element).toBeTruthy());

      expect(await page.$$eval('tr.datagrid-row', el => el.length)).toEqual(6);

      await page.click('[aria-rowindex="1"]', { clickCount: 2 });
      const inputValue = await page.$eval('#product-lookup', element => element.value);

      expect(inputValue).toContain('2142201');
    });

    it.skip('should not change value when cancel button is clicked', async () => {
      await page.click('.trigger');

      await page.waitForSelector('.modal-content', { visible: true })
        .then(element => expect(element).toBeTruthy());

      expect(await page.$$eval('tr.datagrid-row', el => el.length)).toEqual(6);

      await page.click('[aria-rowindex="5"]');
      await page.click('[data-automation-id="my-lookup-modal-cancel"]');

      const inputValue = await page.$eval('#product-lookup', element => element.value);
      expect(inputValue).toContain('2142201');
    });
  });
});
