const utils = require('../../helpers/e2e-utils.js');

describe('Tabs modal test-modal-error tests', () => {
  const url = 'http://localhost:4000/components/tabs/test-modal-error.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });
});
