describe('Hierarchy Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/hierarchy';

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
