describe('Modal Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/modal';

  describe('Modal Puppeteer init example-modal tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
      await page.waitForSelector('#add-context', { visible: true });
    });

    it('should have modal closed by default', async () => {
      await page.evaluate(() => document.querySelector('body').getAttribute('class'))
        .then(el => expect(el).not.toContain('modal-engaged'));
    });

    it.skip('should close modal on tab, and escape', async () => {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      expect(await page.waitForSelector('.modal.is-visible.is-active')).toBeTruthy();
      await page.keyboard.press('Escape');
      await page.waitForSelector('.modal', { visible: false });
    });
  });

  describe('Modal open example-modal tests on click', () => {
    const url = `${baseUrl}/example-index?theme=classic`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.waitForSelector('#add-context');
      await page.click('#add-context');
      await page.waitForSelector('.overlay');
    });

    it('should open modal on click', async () => {
      expect(await page.waitForSelector('.modal.is-visible')).toBeTruthy();
    });
  });

  describe('Modal with hidden field tests on click', () => {
    const url = `${baseUrl}/example-hidden-field`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.waitForSelector('#add-context');
      await page.click('#add-context');
      await page.waitForSelector('.overlay');
    });

    it('should open modal on click', async () => {
      expect(await page.waitForSelector('.modal, is-visible')).toBeTruthy();
      const subjectEl = await page.evaluateHandle(() => document.activeElement);
      await subjectEl.type('input#subject');
    });
  });

  describe('Modal example-close-btn tests', () => {
    const url = `${baseUrl}/example-close-btn`;
    beforeEach(async () => {
      await page.setDefaultNavigationTimeout(0);
      await page.goto(url, {
        waitUntil: ['domcontentloaded', 'networkidle0']
      });
    });

    it('should close the modal via the x close icon', async () => {
      await page.click('#add-context');

      await page.waitForSelector('.modal-engaged', { visible: true })
        .then(async () => {
          const button = await page.$('#add-context-modal-btn-close');
          await button.hover();
          await button.click();
        });

      await page.evaluate(() => document.querySelector('.modal.has-close-btn').getAttribute('class'))
        .then(isVisibleClass => expect(isVisibleClass).not.toContain('is-visible'));
    });

    it('should be able to set id/automation id', async () => {
      await page.click('#add-context');

      await page.waitForSelector('.modal-engaged', { visible: true });

      await page.evaluate(() => document.querySelector('#add-context-modal-title').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('add-context-modal-title'));

      await page.evaluate(() => document.querySelector('#add-context-modal-title').getAttribute('data-automation-id'))
        .then(automationId => expect(automationId).toEqual('add-context-modal-auto-title'));

      await page.evaluate(() => document.querySelector('#add-context-modal').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('add-context-modal'));

      await page.evaluate(() => document.querySelector('#add-context-modal').getAttribute('data-automation-id'))
        .then(automationId => expect(automationId).toEqual('add-context-modal-auto'));

      await page.evaluate(() => document.querySelector('#add-context-modal-text').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('add-context-modal-text'));
    });
  });

  describe('Modal example-validation tests', () => {
    const url = `${baseUrl}/example-validation`;
    beforeEach(async () => {
      await page.setDefaultNavigationTimeout(0);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.click('.btn-secondary');
    });

    it('should focus on first focusable item in modal', async () => {
      const dropdown = await page.evaluateHandle(() => document.activeElement);
      await dropdown.type('div.dropdown');
    });
  });

  describe('Modal example-validation-editor tests', () => {
    const url = `${baseUrl}/test-validation-editor`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.waitForSelector('.btn-secondary');
      await page.click('.btn-secondary');
      await page.waitForSelector('.modal-wrapper');
    });

    it.skip('Should enable submit after add text to all fields', async () => {
      await page.click('.dropdown-wrapper');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.type('#context-name', 'test@test.com');
      await page.type('#context-desc', 'test description');
      await page.type('.editor', 'test description!^');
      const element = await page.waitForSelector('#submit');
      expect(element).toBeTruthy();
      await page.click('#submit');
    });
  });

  describe('Modal test-custom-tooltip-close-btn tests', () => {
    const url = `${baseUrl}/test-custom-tooltip-close-btn.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('it should open the tooltip', async () => {
      await page.click('#add-context');
      await page.waitForSelector('.modal-engaged', { visible: true });
      await page.hover('#add-context-modal-btn-close');
      const tooltip = await page.waitForSelector('.has-open-tooltip, .has-tooltip', { visible: true });
      expect(tooltip).toBeTruthy();
    });

    it('it should have custom attribute tabIndex:-1', async () => {
      await page.click('#add-context');
      await page.waitForSelector('.modal-engaged', { visible: true });

      const tabIndex = await page.$eval(
        '#add-context-modal-btn-close',
        element => element.getAttribute('tabindex')
      );

      expect(tabIndex).not.toEqual(-1);
    });
  });

  describe('Modal with icon in title', () => {
    const url = `${baseUrl}/example-title-with-icon`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have an icon check in title', async () => {
      await page.click('#add-context');
      await page.waitForSelector('.modal-engaged', { visible: true });

      await page.waitForSelector('.icon.icon-info', { visible: true })
        .then(el => expect(el).toBeTruthy());

      // check if icon exist in title of modal
      const modalTitle = await page.$eval('#my-id-title', element => element.innerHTML);
      expect(modalTitle).toContain('icon-info');
    });
  });
});
