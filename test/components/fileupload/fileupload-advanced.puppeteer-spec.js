/* eslint-disable compat/compat */
const path = require('path');

describe('File Upload Advanced Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/fileupload-advanced';
  const fileName = 'test.txt';

  describe('File Progress', () => {
    const url = `${baseUrl}/example-index.html`;
    const filePath = path.resolve(__dirname, fileName);

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should upload a file', async () => {
      // click on Select File
      // file upload should pop up
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('.hyperlink')
      ]);

      await fileChooser.accept([filePath]);

      // Progress bar
      await page.waitForSelector('.file-row', { visible: true })
        .then(async (element) => {
          const description = await element.$eval('.description', e => e.textContent);
          const progress = await element.$eval('.l-pull-right .size', e => e.textContent.split(' '));

          expect(description).toEqual(fileName);
          expect(Number.parseFloat(progress[0])).toBeTruthy();
          expect(progress[1]).toEqual('KB');
          expect(progress[3]).toContain('%');
        });
    });
  });
});
