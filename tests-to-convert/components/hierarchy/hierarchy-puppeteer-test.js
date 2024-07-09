const baseUrl = 'http://localhost:4000/components/hierarchy';

describe('Hierarchy Puppeteer Tests', () => {
  describe('Hierarchy context menu', () => {
    const url = `${baseUrl}/example-context-menu-with-details?layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      await page.evaluate(() => document.getElementById('1').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('1'));

      await page.evaluate(() => document.getElementById('1').getAttribute('data-automation-id'))
        .then(automationId => expect(automationId).toEqual('automation-id-example1-1-jonathan-cargill-hierarchy-leaf'));

      await page.evaluate(() => document.getElementById('1_3').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('1_3'));

      await page.evaluate(() => document.getElementById('1_3').getAttribute('data-automation-id'))
        .then(automationId => expect(automationId).toEqual('automation-id-example1-1_3-kaylee-edwards-hierarchy-leaf'));

      await page.evaluate(() => document.getElementById('example1-1_3-kaylee-edwards-hierarchy-btn-toggle').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('example1-1_3-kaylee-edwards-hierarchy-btn-toggle'));

      await page.evaluate(() => document.getElementById('example1-1_3-kaylee-edwards-hierarchy-btn-toggle').getAttribute('data-automation-id'))
        .then(automationId => expect(automationId).toEqual('automation-id-example1-1_3-kaylee-edwards-hierarchy-btn-toggle'));

      await page.evaluate(() => document.getElementById('btn-1_3').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('btn-1_3'));

      await page.evaluate(() => document.getElementById('btn-1_3').getAttribute('data-automation-id'))
        .then(automationId => expect(automationId).toEqual('automation-id-example1-1_3-kaylee-edwards-hierarchy-popupmenu-trigger'));

      await page.click('#btn-1_3');

      await page.waitForSelector('.popupmenu.is-open', { visible: true })
        .then(async () => {
          await page.evaluate(() => document.getElementById('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-0').getAttribute('id'))
            .then(idValue => expect(idValue).toEqual('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-0'));

          await page.evaluate(() => document.getElementById('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-0').getAttribute('data-automation-id'))
            .then(idValue => expect(idValue).toEqual('automation-id-example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-0'));

          await page.evaluate(() => document.getElementById('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-1').getAttribute('id'))
            .then(automationId => expect(automationId).toEqual('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-1'));

          await page.evaluate(() => document.getElementById('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-1').getAttribute('data-automation-id'))
            .then(idValue => expect(idValue).toEqual('automation-id-example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-1'));

          await page.evaluate(() => document.getElementById('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-2').getAttribute('id'))
            .then(automationId => expect(automationId).toEqual('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-2'));

          await page.evaluate(() => document.getElementById('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-2').getAttribute('data-automation-id'))
            .then(idValue => expect(idValue).toEqual('automation-id-example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-2'));
        });
    });
  });
});

describe('Hierarchy Stacked Tests', () => {
  describe('Hierarchy stacked layout', () => {
    const url = `${baseUrl}/example-stacked?layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should render', async () => {
      await page.waitForSelector('#hierarchy', { visible: true })
        .then(idValue => expect(idValue).toBeTruthy());

      await page.evaluate(() => document.querySelectorAll('.leaf').length)
        .then(leafCount => expect(leafCount).toEqual(3));
    });

    it('should render legend', async () => {
      await page.waitForSelector('#hierarchy', { visible: true })
        .then(idValue => expect(idValue).toBeTruthy());

      await page.waitForSelector('legend', { visible: true })
        .then(el => expect(el).toBeTruthy());
    });

    it.skip('should load next set of records', async () => {
      await page.waitForSelector('#hierarchy', { visible: true })
        .then(idValue => expect(idValue).toBeTruthy());

      const btn = await page.$$('.btn');
      await btn[2].click();

      // It needs to make sure that the button is expanded
      // before getting the leaf length
      await page.waitForSelector('.btn-expand', { visible: true });

      await page.evaluate(() => document.querySelectorAll('.leaf').length)
        .then(leafCount => expect(leafCount).toEqual(5));

      const btnCollapse = await page.$$('.btn-collapse');
      await btnCollapse[2].click();

      await page.waitForSelector('.btn-expand', { visible: true });

      await page.evaluate(() => document.querySelectorAll('.leaf').length)
        .then(leafCount => expect(leafCount).toEqual(5));

      await page.evaluate(() => document.querySelectorAll('.ancestor').length)
        .then(ancestorCount => expect(ancestorCount).toEqual(3));
    });

    it.skip('should go back to the initial page', async () => {
      await page.waitForSelector('#hierarchy', { visible: true })
        .then(idValue => expect(idValue).toBeTruthy());

      // Load children
      const btn = await page.$$('.btn');
      await btn[2].click();

      await page.waitForSelector('.btn-expand', { visible: true });

      await page.evaluate(() => document.querySelectorAll('.leaf').length)
        .then(leafCount => expect(leafCount).toEqual(5));

      // Go back
      const btnExpand = await page.$$('.btn-expand');
      await btnExpand[0].click();

      await page.waitForSelector('.btn-expand', { visible: false });

      await page.evaluate(() => document.querySelectorAll('.leaf').length)
        .then(leafCount => expect(leafCount).toEqual(3));

      await page.evaluate(() => document.querySelectorAll('.btn-collapse').length)
        .then(btnCollapseCount => expect(btnCollapseCount).toEqual(3));
    });
  });
});
