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

    it('should upload a file and show description', async () => {
      // click on Select File
      // file upload should pop up
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('.hyperlink')
      ]);

      await fileChooser.accept([filePath]);

      // Description bar
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

    it('should upload a file and show progress bar', async () => {
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('.hyperlink')
      ]);

      await fileChooser.accept([filePath]);

      // Progress bar
      await page.waitForSelector('.progress-row', { visible: true })
        .then(element => element.$('.progress'))
        .then(progress => expect(progress).toBeDefined());
    });
  });

  describe('File example failed status', () => {
    const testFile = 'testfile.pdf';
    const url = `${baseUrl}/example-failed.html`;
    const filePath = path.resolve(__dirname, testFile);

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should upload a file and show progress bar', async () => {
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('.hyperlink')
      ]);

      await fileChooser.accept([filePath]);

      // Progress bar
      await page.waitForSelector('.progress-row', { visible: true })
        .then(element => element.$('.progress'))
        .then(progress => expect(progress).toBeDefined());
    });

    it('should set failed status ', async () => {
      // click on Select File
      // file upload should pop up
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('.hyperlink')
      ]);

      await fileChooser.accept([filePath]);

      await page.click('#set-failed');

      // File failed error message
      await page.waitForSelector('.msg', { visible: true })
        .then(async (element) => {
          const errorMessage = await element.$eval('.msg > p', e => e.textContent);
          expect(errorMessage).toContain('File failed error message');
        });
      // Toast
      await page.waitForSelector('.toast-message', { visible: true })
        .then(async (element) => {
          const errorMessage = await element.evaluate(e => e.textContent);
          expect(errorMessage).toContain('File failed error message');
        });
    });
  });
});
