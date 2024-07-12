describe('Stepchart', () => {
  const baseUrl = 'http://localhost:4000/components/stepchart';

  describe('Stepchart example-index tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id example one', async () => {
      await page.evaluate(() => document.getElementById('stepchart-example1-label').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example1-label'));
      await page.evaluate(() => document.getElementById('stepchart-example1-label').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example1-label'));

      await page.evaluate(() => document.getElementById('stepchart-example1-icon').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example1-icon'));
      await page.evaluate(() => document.getElementById('stepchart-example1-icon').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example1-icon'));

      await page.evaluate(() => document.getElementById('stepchart-example1-step0').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example1-step0'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step0').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example1-step0'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step1').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example1-step1'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step1').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example1-step1'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step2').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example1-step2'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step2').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example1-step2'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step3').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example1-step3'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step3').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example1-step3'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step4').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example1-step4'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step4').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example1-step4'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step5').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example1-step5'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step5').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example1-step5'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step6').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example1-step6'));
      await page.evaluate(() => document.getElementById('stepchart-example1-step6').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example1-step6'));
    });

    it('should be able to set id/automation id example four', async () => {
      await page.evaluate(() => document.getElementById('stepchart-example4-label').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example4-label'));
      await page.evaluate(() => document.getElementById('stepchart-example4-label').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example4-label'));

      await page.evaluate(() => document.getElementById('stepchart-example4-icon').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example4-icon'));
      await page.evaluate(() => document.getElementById('stepchart-example4-icon').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example4-icon'));

      await page.evaluate(() => document.getElementById('stepchart-example4-step0').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example4-step0'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step0').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example4-step0'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step1').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example4-step1'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step1').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example4-step1'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step2').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example4-step2'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step2').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example4-step2'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step3').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example4-step3'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step3').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example4-step3'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step4').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example4-step4'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step4').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example4-step4'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step5').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example4-step5'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step5').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example4-step5'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step6').getAttribute('id'))
        .then(id => expect(id).toEqual('stepchart-example4-step6'));
      await page.evaluate(() => document.getElementById('stepchart-example4-step6').getAttribute('data-automation-id'))
        .then(dataAutomationId => expect(dataAutomationId).toEqual('automation-id-stepchart-example4-step6'));
    });
  });
});
