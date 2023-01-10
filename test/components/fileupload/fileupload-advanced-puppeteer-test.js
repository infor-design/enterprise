/* eslint-disable compat/compat */
const path = require('path');

describe('File Upload Advanced Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/fileupload-advanced';
  const fileName = 'test.txt';

  const uploadFiles = async (filePathArr) => {
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('.hyperlink')
    ]);

    return fileChooser.accept(filePathArr);
  };

  describe('File Progress', () => {
    const url = `${baseUrl}/example-index.html`;
    const filePath = path.resolve(__dirname, fileName);

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should upload a file and show description', async () => {
      await uploadFiles([filePath]);

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
      await uploadFiles([filePath]);

      // Progress bar
      await page.waitForSelector('.progress-row', { visible: true })
        .then(element => element.$('.progress'))
        .then(progress => expect(progress).toBeTruthy());
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
      await uploadFiles([filePath]);

      // Progress bar
      await page.waitForSelector('.progress-row', { visible: true })
        .then(element => element.$('.progress'))
        .then(progress => expect(progress).toBeTruthy());
    });

    it('should set failed status ', async () => {
      await uploadFiles([filePath]);

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

  describe('File max limit tests', () => {
    const url = `${baseUrl}/test-max-files.html`;
    const filePath = path.resolve(__dirname, fileName);

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should upload 2 files', async () => {
      await uploadFiles([filePath, filePath]);

      await page.waitForFunction('document.querySelectorAll(".container.completed").length === 2');
      expect((await page.$$('.container.completed .file-row')).length).toEqual(2);
    });

    it('should show error when uploading 3 files', async () => {
      await uploadFiles([filePath, filePath, filePath]);

      await page.waitForSelector('.file-row', { visible: true })
        .then(async (element) => {
          const fileIcon = await element.$eval('.status-icon', e => e.getAttribute('class'));
          const errorMessage = await element.$eval('.msg', e => e.textContent);

          expect(fileIcon).toContain('file-error');
          expect(errorMessage).toEqual('Error: Cannot upload more than the maximum number of files (2).');
        });
    });

    it('should be able to upload a file after 2 files are complete and 1 is removed', async () => {
      await uploadFiles([filePath, filePath]);

      await page.waitForFunction('document.querySelectorAll(".container.completed").length === 2');

      await page.click('button.btn-icon.action.hide-focus');

      await page.waitForFunction('document.querySelectorAll(".container.completed").length === 1');

      expect((await page.$$('.container.completed .file-row')).length).toEqual(1);

      await uploadFiles([filePath]);

      await page.waitForFunction('document.querySelectorAll(".container.completed").length === 2');

      expect((await page.$$('.container.completed .file-row')).length).toEqual(2);
    });
  });
});
