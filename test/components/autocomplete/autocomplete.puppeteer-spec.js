const config = require('../../helpers/e2e-config.cjs');
const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Autocomplete Puppeteer Test', () => {
  const baseUrl = 'http://localhost:4000/components/autocomplete';
  const defaultId = 'autocomplete-default';

  const clickOnAutocomplete = () => page.waitForSelector(`#${defaultId}`, { visible: true }).then(async (element) => {
    await element.click();
    return element;
  });

  describe('Example Index', () => {
    const url = `${baseUrl}/example-index`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
      await clickOnAutocomplete().then(element => element.type(''));
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

    it('should fill the input field with the correct text contents when an item is chosen with the keyboard', async () => {
      const autocompleteEl = await clickOnAutocomplete();
      await autocompleteEl.type('new');
      await page.waitForSelector('#ac-list-option0 span i', { visible: true });
      await autocompleteEl.press('ArrowDown');
      await autocompleteEl.press('ArrowDown');
      await autocompleteEl.press('Enter');
      await page.waitForFunction(() => !document.querySelector('#autocomplete-list'));
      await page.$eval(`#${defaultId}`, element => element.value).then((value) => {
        expect(value).toEqual('New Jersey');
      });
    });

    it('should be able to set id/automation id', async () => {
      await page.waitForTimeout(config.sleep);

      const checkAttr = (selector, val1, val2) => page.$eval(selector, element => [element.id, element.getAttribute('data-automation-id')])
        .then((attr) => {
          expect(attr[0]).toEqual(val1);
          expect(attr[1]).toEqual(val2);
        });

      await checkAttr(`#${defaultId}`, defaultId, 'autocomplete-automation-id');

      const autocompleteEl = await clickOnAutocomplete();
      autocompleteEl.type('a');

      await page.waitForSelector('#autocomplete-list', { visible: true });

      await checkAttr('#autocomplete-list', 'autocomplete-list', 'autocomplete-automation-id-list');
      await checkAttr('#autocomplete-list-option0', 'autocomplete-list-option0', 'autocomplete-automation-id-list-option0');
      await checkAttr('#autocomplete-list-option1', 'autocomplete-list-option1', 'autocomplete-automation-id-list-option1');
      await checkAttr('#autocomplete-list-option2', 'autocomplete-list-option2', 'autocomplete-automation-id-list-option2');
      await checkAttr('#autocomplete-list-option3', 'autocomplete-list-option3', 'autocomplete-automation-id-list-option3');
      await checkAttr('#autocomplete-list-option4', 'autocomplete-list-option4', 'autocomplete-automation-id-list-option4');
    });

    it('should not visual regress', async () => {
      await page.setViewport({ width: 1920, height: 1080 });
      const autocompleteEl = await clickOnAutocomplete();
      autocompleteEl.type('a');

      await page.waitForSelector('#maincontent', { visible: true });
      await page.waitForTimeout(config.sleep);

      const img = await page.screenshot();
      const sConfig = getConfig('autocomplete');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Autocomplete ajax tests', () => {
    const url = `${baseUrl}/example-ajax?theme=classic`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
      await clickOnAutocomplete().then(element => element.type(''));
    });

    it('should handle ajax', async () => {
      const autocompleteEl = await clickOnAutocomplete();
      autocompleteEl.type('a');

      await page.waitForSelector('#autocomplete-list', { visible: true })
        .then(element => element.$$('li'))
        .then(list => expect(list.length).toEqual(5));
    });

    it('should not steal focus away from other components if the user has tabbed out', async () => {
      const autocompleteEl = await clickOnAutocomplete();
      autocompleteEl.type('utah');
      autocompleteEl.press('Tab');

      await page.waitForTimeout(config.sleepLonger);

      const autocompleteListEl = await page.$$('#autocomplete-list');
      expect(autocompleteListEl.length).toBe(0);
    });
  });

  describe('Autocomplete contains tests', () => {
    const url = `${baseUrl}/example-contains?theme=classic`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
      await clickOnAutocomplete().then(element => element.type(''));
    });

    it('should handle ajax', async () => {
      const autocompleteEl = await clickOnAutocomplete();
      autocompleteEl.type('as');

      await page.waitForSelector('#autocomplete-list', { visible: true })
        .then(element => element.$$('li'))
        .then(list => expect(list.length).toEqual(7));
    });
  });

  describe('Autocomplete keyword tests', () => {
    const url = `${baseUrl}/example-keyword?theme=classic`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
      await clickOnAutocomplete().then(element => element.type(''));
    });

    it('should handle ajax', async () => {
      const autocompleteEl = await clickOnAutocomplete();
      autocompleteEl.type('as');

      await page.waitForSelector('#autocomplete-list', { visible: true })
        .then(element => element.$$('li'))
        .then(list => expect(list.length).toEqual(7));
    });
  });
});
