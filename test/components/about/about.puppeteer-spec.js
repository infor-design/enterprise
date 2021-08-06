describe('About Puppeteer Tests', () => {
  describe('Index Tests', () => {
    const url = 'http://localhost:4000/components/about/example-index';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should pass Axe accessibility tests', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should show the about dialog', async () => {
      await page.click('#about-trigger');
      const element = await page.waitForSelector('#about-modal', { visible: true });
      expect(element).toBeTruthy();
    });

    it('should display the version', async () => {
      await page.click('#about-trigger');
      const element = await page.waitForSelector('.modal-body .version', { visible: true });
      expect(await element.evaluate(el => el.textContent)).toContain('IDS Version : 4.');
    });

    it('should show the version in the html', async () => {
      expect(await page.$eval('html', el => el.getAttribute('data-sohoxi-version'))).toContain('.');
    });

    it('should close and open properly', async () => {
      await page.click('#about-trigger');
      let element = await page.waitForSelector('#about-modal', { visible: true });
      expect(element).toBeTruthy();

      await page.keyboard.press('Escape');
      expect(await page.evaluate('document.querySelector("#about-modal")')).toEqual(undefined);

      // Reopen the About Dialog (creates a new instance)
      await page.click('#about-trigger');
      element = await page.waitForSelector('#about-modal', { visible: true });
      expect(element).toBeTruthy();
    });

    it('should be able to set id/automation id', async () => {
      await page.click('#about-trigger');
      await page.waitForSelector('#about-modal', { visible: true });

      expect(await page.$eval('#about-modal', el => el.id)).toEqual('about-modal');
      expect(await page.$eval('#about-modal-btn-close', el => el.id)).toEqual('about-modal-btn-close');
    });
  });

  describe('Translation tests', () => {
    const url = 'http://localhost:4000/components/about/example-index?locale=uk-UA';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the about dialog in ukranian', async () => {
      await page.click('#about-trigger');
      await page.waitForSelector('.modal-body', { visible: true });

      const ukText = `Авторські права © Infor, ${new Date().getFullYear()}. Усі права збережено. Усі зазначені у цьому документі назви та дизайн елементів є товарними знаками або захищеними товарними знаками Infor та/або афілійованих організацій і філіалів Infor. Усі права збережено. Усі інші товарні знаки, перелічені тут, є власністю відповідних власників. www.infor.com.`;
      expect(await page.$eval('.additional-content + p', el => el.textContent)).toEqual(ukText);
    });

    it('should show version correctly in arabic', async () => {
      await page.goto('http://localhost:4000/components/about/example-index?locale=ar-SA', { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.click('#about-trigger');
      await page.waitForSelector('.modal-body', { visible: true });

      // Its not inverted here but this is correct
      expect(await page.$eval('.version', el => el.textContent)).toContain('إصدار :');
    });
  });

  describe('Event tests', () => {
    const url = 'http://localhost:4000/components/about/test-close-event-index';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await pauseAnimations();
    });

    it('should fire the close event', async () => {
      await page.click('#about-trigger');
      await page.waitForSelector('.modal-body', { visible: true });
      await page.waitForTimeout(200); // approx. time for a Modal to show

      await page.click('.btn-close');

      const element = await page.waitForSelector('#toast-container .toast-title', { visible: true });
      expect(await element.evaluate(el => el.textContent)).toContain('Close Event Triggered');
    });
  });

  describe('Nested tests', () => {
    const url = 'http://localhost:4000/components/about/test-nested';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await pauseAnimations();
    });

    it('should be able to use both close buttons', async () => {
      // Open About
      await page.click('#about-trigger');
      await page.waitForSelector('#about-modal .modal-body', { visible: true });

      // Open Nested Modal
      await page.click('#modal-trigger');
      await page.waitForSelector('#nested-modal .modal-body', { visible: true });
      await page.waitForTimeout(200); // approx. time for a Modal to show
      expect(await page.evaluate('document.querySelector("#nested-modal .modal-body")')).not.toEqual(null);

      // Close Nested Modal
      await page.click('#nested-modal-btn-close');
      await page.waitForSelector('#nested-modal .modal-body', { visible: true });
      await page.waitForTimeout(200); // approx. time for a Modal to show
      expect(await page.evaluate('document.querySelector("#nested-modal .modal-body")')).toEqual(null);

      // Close About
      await page.click('#about-modal-btn-close');
      await page.waitForSelector('#about-modal .modal-body', { visible: true });
      await page.waitForTimeout(200); // approx. time for a Modal to show
      expect(await page.evaluate('document.querySelector("#about-modal .modal-body")')).toEqual(null);
    });
  });
});
