describe('Breadcrumb puppeteer tests', () => {
  const baseUrl = 'http://localhost:4000/components/breadcrumb';

  describe('Automation tests', () => {
    const url = `${baseUrl}/example-from-settings?layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should create automation IDs from settings', async () => {
      await page.$eval('#test-breadcrumb-home', element => element.getAttribute('data-automation-id')).then(id => expect(id).toEqual('test-breadcrumb-home'));
      await page.$eval('.breadcrumb-item.current a', element => element.getAttribute('data-automation-id')).then(id => expect(id).toEqual('test-breadcrumb-fourth'));
    });
  });

  describe('Hitbox tests', () => {
    const url = `${baseUrl}/example-with-hitbox.html`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should have the size of 44px in height, 8px padding-right & 16px font-size in header flex & with hitbox section ', async () => {
      await page.$eval('a[class="hyperlink hide-focus"]', el => ({
        headFlex: getComputedStyle(el, ':after').height,
        padRight: getComputedStyle(el, ':after').paddingRight,
        padLeft: getComputedStyle(el, ':after').paddingLeft,
        fontSize: getComputedStyle(el, ':after').fontSize
      })).then(({ headFlex, padRight, padLeft, fontSize }) => {
        expect(headFlex).toMatch('44px');
        expect(padRight).toMatch('8px');
        expect(padLeft).toMatch('8px');
        expect(fontSize).toMatch('16px');
      });
    });
  });
});
