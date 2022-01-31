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
        .then(async (element) => {
          const display = await element.evaluate(dom => getComputedStyle(dom).getPropertyValue('display'));
          if (isVisible) {
            expect(display).not.toEqual('none');
          } else {
            expect(display).toEqual('none');
          }

          return element;
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
      const hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      expect(hamburger).toBeDefined();

      // Menu size after being dragged
      const menuSize = await checkVisibility('nav#application-menu', true).then(element => element.boundingBox());

      await hamburger.click();

      await checkVisibility('nav#application-menu', false);

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
      const hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      expect(hamburger).toBeDefined();

      // Menu size after being dragged
      const menuSize = await checkVisibility('nav#application-menu', true).then(element => element.boundingBox());

      await hamburger.click();

      await checkVisibility('nav#application-menu', false);

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

      const hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', false);

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
