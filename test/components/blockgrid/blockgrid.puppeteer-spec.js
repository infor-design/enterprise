describe('Blockgrid Puppeteer Test', () => {
  const baseUrl = 'http://localhost:4000/components/blockgrid';

  const checkExists = (selector, num = 1) => page.$$(selector).then((elementArr) => {
    expect(elementArr.length).toBeGreaterThanOrEqual(num);
  });

  describe('Index tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should have a block', async () => {
      await checkExists('.block');
    });

    it('should have a blockgrid', async () => {
      await checkExists('.blockgrid');
    });
  });

  describe('Mixed selection tests', () => {
    const url = `${baseUrl}/example-mixed-selection`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should have a blockgrid mixed selection', async () => {
      await checkExists('.blockgrid');
    });

    it('should have a block mixed selection', async () => {
      await checkExists('.block');
    });

    it('should blocks be selectable', async () => {
      await checkExists('.is-selectable');
    });

    it('should block highlight after clicked', async () => {
      const blockEl = await page.$('.block.is-selectable:nth-child(1)');
      await blockEl.click();
      await page.click("label[for='checkbox0']");

      await blockEl.evaluate(el => el.className).then(className => expect(className).toContain('is-selected'));
    });

    it('should be able to set id/automation id example one', async () => {
      const checkAttr = (select, val1, val2) => page.$eval(select, element => [element.id, element.getAttribute('data-automation-id')])
        .then((attr) => {
          expect(attr[0]).toEqual(val1);
          expect(attr[1]).toEqual(val2);
        });

      await checkAttr('#checkbox0', 'checkbox0', 'automation-id-example1-blockgrid-checkbox0');
      await checkAttr('#example1-blockgrid-checkbox-label0', 'example1-blockgrid-checkbox-label0', 'automation-id-example1-blockgrid-checkbox-label0');
      await checkAttr('#checkbox1', 'checkbox1', 'automation-id-example1-blockgrid-checkbox1');
      await checkAttr('#example1-blockgrid-checkbox-label1', 'example1-blockgrid-checkbox-label1', 'automation-id-example1-blockgrid-checkbox-label1');
      await checkAttr('#checkbox2', 'checkbox2', 'automation-id-example1-blockgrid-checkbox2');
      await checkAttr('#example1-blockgrid-checkbox-label2', 'example1-blockgrid-checkbox-label2', 'automation-id-example1-blockgrid-checkbox-label2');
      await checkAttr('#checkbox3', 'checkbox3', 'automation-id-example1-blockgrid-checkbox3');
      await checkAttr('#example1-blockgrid-checkbox-label3', 'example1-blockgrid-checkbox-label3', 'automation-id-example1-blockgrid-checkbox-label3');
      await checkAttr('#checkbox4', 'checkbox4', 'automation-id-example1-blockgrid-checkbox4');
      await checkAttr('#example1-blockgrid-checkbox-label4', 'example1-blockgrid-checkbox-label4', 'automation-id-example1-blockgrid-checkbox-label4');
    });
  });

  describe('Multiselect tests', () => {
    const url = `${baseUrl}/example-multiselect`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should have a blockgrid', async () => {
      await checkExists('.blockgrid');
    });

    it('should have a block', async () => {
      await checkExists('.block');
    });

    it('should blocks be selectable', async () => {
      await checkExists('.is-selectable');
    });

    // WIP
    // it('should highlight blocks after click', async () => {
    //   const blockArr = await page.$$('.block.is-selectable');
    //   await blockArr[1].click();
    //   await blockArr[2].click();

    //   await checkExists('.is-activated');
    // });

    it('should select multiple blocks', async () => {
      const blockArr = await page.$$('.block.is-selectable');
      await blockArr[1].click();
      await blockArr[2].click();
      await blockArr[3].click();

      await checkExists('.is-selected', 3);
    });

    it('should be able to select at 320px', async () => {
      const windowSize = await page.viewport();
      await page.setViewport({ width: 320, height: 480 });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });

      const blockArr = await page.$$('.block.is-selectable');

      await blockArr[1].click();
      await blockArr[2].click();

      await checkExists('.is-selected', 2);

      await page.setViewport(windowSize);
    });
  });
});
