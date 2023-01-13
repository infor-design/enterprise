describe('ActionSheet Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/actionsheet';

  const triggerId = 'action-sheet-trigger';
  const containerId = 'ids-actionsheet-root';

  describe('Index', () => {
    const url = `${baseUrl}/example-index?layout=nofrills`;
    let windowSize;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      windowSize = await page.viewport();
    });

    afterAll(async () => {
      await page.setViewport(windowSize);
    });

    it('should display a Popupmenu if above the correct breakpoint', async () => {
      await page.click(`#${triggerId}`);

      await page.waitForSelector(`#${triggerId}.is-open`, { visible: true })
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameString => expect(classNameString).toContain('is-open'));
    });

    it('should display an Action Sheet if below the correct breakpoint', async () => {
      await page.setViewport({ width: 500, height: 600 });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.click(`#${triggerId}`);

      await page.waitForSelector(`#${containerId}`, { visible: true })
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameString => expect(classNameString).toContain('engaged'));
    });

    it.skip('should hide an Action Sheet when pressing the Escape key', async () => {
      await page.setViewport({ width: 500, height: 600 });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.click(`#${triggerId}`);

      await page.waitForSelector(`#${containerId}`, { visible: true })
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameString => expect(classNameString).toContain('engaged'));

      await page.keyboard.press('Escape');

      await page.waitForSelector(`#${containerId}`)
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameString => expect(classNameString).not.toContain('engaged'));
    });

    it('should hide an Action Sheet when clicking the "cancel" button', async () => {
      await page.setViewport({ width: 500, height: 600 });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.click(`#${triggerId}`);

      await page.waitForTimeout(400);

      await page.click('.btn-cancel');

      await page.waitForSelector(`#${containerId}`)
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameString => expect(classNameString).not.toContain('engaged'));
    });
  });

  describe('Breakpoints', () => {
    const url = `${baseUrl}/example-breakpoints?layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should open at different breakpoints', async () => {
      await page.click(`#${triggerId}`);

      await page.waitForSelector(`#${triggerId}.is-open`, { visible: true })
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameString => expect(classNameString).toContain('is-open'));

      await page.keyboard.press('Escape');
      await page.click('label[for="desktop-to-extralarge"]');
      await page.click(`#${triggerId}`);

      await page.waitForSelector(`#${containerId}`, { visible: true })
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameString => expect(classNameString).toContain('engaged'));
    });
  });

  describe('No Cancel', () => {
    const url = `${baseUrl}/test-no-cancel?layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not display a cancel button', async () => {
      await page.click(`#${triggerId}`);

      await page.waitForSelector(`#${containerId}`, { visible: true })
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(async (classNameString) => {
          expect(classNameString).toContain('engaged');
          expect(await page.$('.btn-cancel')).toBeFalsy();
        });
    });
  });
});
