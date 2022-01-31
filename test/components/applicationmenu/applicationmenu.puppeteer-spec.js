/* eslint-disable compat/compat */
const { dragAndDrop } = require('../../helpers/e2e-utils');

describe('Application Menu Puppeteer Test', () => {
  const baseUrl = 'http://localhost:4000/components/applicationmenu';

  describe('Resize', () => {
    const url = `${baseUrl}/example-resizable-menu`;

    /**
     * Check if application menu is visible
     * @param {string} selector selector of app menu
     * @param {boolean} isVisible if app menu should be visible or not
     */
    function checkVisibility(selector, isVisible) {
      return page.waitForSelector(selector, { visible: isVisible, hidden: !isVisible })
        .then(element => Promise.all([element, element.evaluate(dom => getComputedStyle(dom).getPropertyValue('display'))]))
        .then((output) => {
          if (isVisible) {
            expect(output[1]).not.toEqual('none');
          } else {
            expect(output[1]).toEqual('none');
          }
          return output[0];
        });
    }

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should resize at middle of the page', async () => {
      const windowSize = await page.viewport();
      const location = [{ y: 0, x: windowSize.width / 2 }];

      await dragAndDrop('.resizer', location);

      // hamburger icon should be visible
      let hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      expect(hamburger).toBeDefined();

      // Menu size after being dragged
      const menuSize = await checkVisibility('nav#application-menu', true).then(element => element.boundingBox());

      hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', false);

      hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', true)
        .then(element => element.boundingBox())
        .then(boundingBox => expect(boundingBox.width).toEqual(menuSize.width));
    });

    it('should resize at the near end of the page', async () => {
      const windowSize = await page.viewport();
      const location = [{ y: 0, x: windowSize.width - (windowSize.width * 0.1) }];

      await dragAndDrop('.resizer', location);

      // hamburger icon should be visible
      let hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      expect(hamburger).toBeDefined();

      // Menu size after being dragged
      const menuSize = await checkVisibility('nav#application-menu', true).then(element => element.boundingBox());

      hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', false);

      hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', true)
        .then(element => element.boundingBox())
        .then(boundingBox => expect(boundingBox.width).toEqual(menuSize.width));
    });

    it('should save last resize', async () => {
      const windowSize = await page.viewport();
      const location = [{ y: 0, x: windowSize.width - (windowSize.width * 0.1) }];

      await dragAndDrop('.resizer', location);

      const menuSize = await checkVisibility('nav#application-menu', true).then(element => element.boundingBox());

      let hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', false);

      hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', true)
        .then(element => element.boundingBox())
        .then(boundingBox => expect(boundingBox.width).toEqual(menuSize.width));

      // refresh page
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });

      await checkVisibility('nav#application-menu', true)
        .then(element => element.boundingBox())
        .then(boundingBox => expect(boundingBox.width).toEqual(menuSize.width));
    });
  });
});
