describe('Checkbox Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/checkboxes';

  describe('Index Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });
  });

  describe('New Theme Tests', () => {
    const url = `${baseUrl}/example-index?theme=new&layout=nofrills`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });
  });

  describe('Group Tests', () => {
    const url = `${baseUrl}/example-checkbox-groups?theme=classic&layout=nofrills`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });
  });

  describe('Horizontal checkbox group Tests', () => {
    const url = `${baseUrl}/example-horizontal?theme=classic&layout=nofrills`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });
  });
});
