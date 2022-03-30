describe('Autocomplete Puppeteer Test', () => {
  const baseUrl = 'http://localhost:4000/components/autocomplete';
  const defaultId = 'autocomplete-default';

  const clickOnAutocomplete = () => page.waitForSelector(`#${defaultId}`, { visible: true }).then(async (element) => {
    await element.click();
    return element;
  });

  describe('Example Index', () => {
    const url = `${baseUrl}/example-index?theme=classic`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should open a filtered results list after focusing and keying text', async () => {
      const autocompleteEl = await clickOnAutocomplete();
      await autocompleteEl.type('new');

      await page.waitForSelector('#autocomplete-list', { visible: true }).then(element => expect(element).toBeDefined());
    });

    it('should fill the input field with the correct text contents when an item is clicked', async () => {
      const autocompleteEl = await clickOnAutocomplete();
      await autocompleteEl.type('new');

      await page.waitForSelector('#autocomplete-list', { visible: true });

      const listItem = await page.waitForSelector('li[data-value="NJ"]', { visible: true });
      await listItem.click();

      await page.waitForFunction(() => !document.querySelector('#autocomplete-list'));

      await page.$eval(`#${defaultId}`, element => element.value).then((value) => {
        expect(value).toEqual('New Jersey');
      });
    });
  });
});
