/**
 * Made this to generate the tests in tests folder initially.
 * Kept it around in case useful can be removed if it isnt.
 */
import * as path from 'path';
import * as fs from 'fs';

const fsFiles = (dirPath = './', fileType = '', fileOptions = []) => {
  // Return Files array
  const files = fs.readdirSync(dirPath);
  // Loop through files array
  files.forEach((file) => {
    // File options is an array then push items in.
    const arrPush = () => fileOptions.push(path.join(dirPath, '/', file));
    // File options is an object assign key and set value.
    // eslint-disable-next-line no-return-assign
    const objAssign = () => fileOptions[path.join(file.split('.')[0])] = path.join(dirPath, '/', file);
    // Check if `${dirPath}/${file}` is a folder or a file
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      fileOptions = fsFiles(`${dirPath}/${file}`, fileType, fileOptions);
    } else {
      // Check if fileType is an empty string and return all files.
      if (fileType === '') {
        if (Array.isArray(fileOptions)) {
          arrPush();
        } else {
          objAssign();
        }
      }
      // Check for specific file type if fileType does not equal emplty string.
      if (file.substring(file.length - fileType.length, file.length) === fileType) {
        if (Array.isArray(fileOptions)) {
          arrPush();
        } else {
          objAssign();
        }
      }
    }
  });
  return fileOptions;
};

const template = `import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('{nameCaps} tests', () => {
  const url = '/components/{name}/example-index.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Enterprise');
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules(['meta-viewport'])
        .exclude('[disabled]')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.waitForSelector('.{name}');
      const html = await page.evaluate(() => {
        const elem = document.querySelector('.{name}');
        return elem?.outerHTML;
      });
      await expect(html).toMatchSnapshot('{name}-html');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, '{name}-light');
    });
  });

  test.describe('functionality tests', () => {
  });
});
`;

const componentArray = [];
const filterArray = fsFiles('./src/components', 'js').filter((item) => (!item.includes('jquery') && item.includes('.js') && !item.includes('ids-locale')));
filterArray.forEach((entry) => {
  const name = path.basename(path.dirname(entry));
  if (!componentArray.includes(name)) componentArray.push(name);
});

const capitalize = (string) => string.replaceAll('-', ' ').replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase()).replaceAll(' ', '');

componentArray.forEach((entry) => {
  const folder = `tests/${entry}/`;
  const file = `${folder}/${entry}.spec.ts`;

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  if (!fs.existsSync(file)) {
    const fileContents = template
      .replaceAll(`{name}`, entry)
      .replaceAll(`{nameCaps}`, capitalize(entry));

    // eslint-disable-next-line no-console
    console.info(`Making file: ${folder}/${entry}.spec.yss`);
    fs.writeFileSync(file, fileContents);
  }
});
