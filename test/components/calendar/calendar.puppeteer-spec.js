const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Calendar', () => {
  const baseUrl = 'http://localhost:4000/components/calendar';

  describe('Index', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should render without error', async () => {
      await page.waitForSelector('.monthview-table td', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should be able to change month to next', async () => {
      const nextButton = await page.$('.calendar-monthview button.next');
      const testDate = new Date();

      expect(await page.$eval('.calendar-monthview #calendar-id-month-view-datepicker', el => el.innerHTML)).toBe(testDate.toLocaleString('default', { month: 'long', year: 'numeric' }));

      await nextButton.click();
      await testDate.setDate(1);
      await testDate.setMonth(testDate.getMonth() + 1);

      expect(await page.$eval('.calendar-monthview #calendar-id-month-view-datepicker', el => el.innerHTML)).toBe(testDate.toLocaleString('default', { month: 'long', year: 'numeric' }));
    });

    it('should be able to change month to prev', async () => {
      const prevButton = await page.$('.calendar-monthview button.prev');
      const testDate = new Date();

      await prevButton.click();
      expect(await page.$eval('.calendar-monthview #calendar-id-month-view-datepicker', el => el.innerHTML)).toBe(testDate.toLocaleString('default', { month: 'long', year: 'numeric' }));
    });

    it('should be able to set id/automation id', async () => {
      expect(await page.$eval('#calendar-id-legend-dto', el => el.getAttribute('id'))).toBe('calendar-id-legend-dto');
      expect(await page.$eval('#calendar-id-legend-dto', el => el.getAttribute('data-automation-id'))).toBe('calendar-automation-id-legend-dto');

      expect(await page.$eval('#calendar-id-legend-admin', el => el.getAttribute('id'))).toBe('calendar-id-legend-admin');
      expect(await page.$eval('#calendar-id-legend-admin', el => el.getAttribute('data-automation-id'))).toBe('calendar-automation-id-legend-admin');

      expect(await page.$eval('#calendar-id-legend-team', el => el.getAttribute('id'))).toBe('calendar-id-legend-team');
      expect(await page.$eval('#calendar-id-legend-team', el => el.getAttribute('data-automation-id'))).toBe('calendar-automation-id-legend-team');

      expect(await page.$eval('#calendar-id-legend-sick', el => el.getAttribute('id'))).toBe('calendar-id-legend-sick');
      expect(await page.$eval('#calendar-id-legend-sick', el => el.getAttribute('data-automation-id'))).toBe('calendar-automation-id-legend-sick');

      expect(await page.$eval('#calendar-id-month-view-btn-prev', el => el.getAttribute('id'))).toBe('calendar-id-month-view-btn-prev');
      expect(await page.$eval('#calendar-id-month-view-btn-prev', el => el.getAttribute('data-automation-id'))).toBe('calendar-automation-id-month-view-btn-prev');

      expect(await page.$eval('#calendar-id-month-view-btn-next', el => el.getAttribute('id'))).toBe('calendar-id-month-view-btn-next');
      expect(await page.$eval('#calendar-id-month-view-btn-next', el => el.getAttribute('data-automation-id'))).toBe('calendar-automation-id-month-view-btn-next');

      expect(await page.$eval('#calendar-id-month-view-datepicker', el => el.getAttribute('id'))).toBe('calendar-id-month-view-datepicker');
      expect(await page.$eval('#calendar-id-month-view-datepicker', el => el.getAttribute('data-automation-id'))).toBe('calendar-automation-id-month-view-datepicker');

      expect(await page.$eval('#calendar-id-month-view-datepicker-trigger', el => el.getAttribute('id'))).toBe('calendar-id-month-view-datepicker-trigger');
      expect(await page.$eval('#calendar-id-month-view-datepicker-trigger', el => el.getAttribute('data-automation-id'))).toBe('calendar-automation-id-month-view-datepicker-trigger');

      expect(await page.$eval('#calendar-id-month-view-today', el => el.getAttribute('id'))).toBe('calendar-id-month-view-today');
      expect(await page.$eval('#calendar-id-month-view-today', el => el.getAttribute('data-automation-id'))).toBe('calendar-automation-id-month-view-today');
    });
  });

  describe('Specific Month', () => {
    const url = `${baseUrl}/test-specific-month`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('should not visual regress', async () => {
      await page.waitForSelector('.monthview-table td', { visible: true })
        .then(element => expect(element).toBeTruthy());

      expect(await page.$$eval('.calendar-event-content', el => el.length)).toEqual(17);

      const image = await page.screenshot();
      const config = getConfig('calendar-specific-month');
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      expect(image).toMatchImageSnapshot(config);
    });

    it('should render without error', async () => {
      await page.waitForSelector('.monthview-table td', { visible: true })
        .then(element => expect(element).toBeTruthy());

      await page.waitForSelector('.calendar-monthview #monthview-datepicker-field', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const testDate = new Date();
      await testDate.setDate(1);
      await testDate.setMonth(9);
      await testDate.setFullYear(2018);

      expect(await page.$eval('.calendar-monthview #monthview-datepicker-field', el => el.innerHTML)).toBe(testDate.toLocaleString('default', { month: 'long', year: 'numeric' }));
    });

    it('should be able to cancel month selector', async () => {
      expect(await page.$eval('.calendar-monthview #monthview-datepicker-field', el => el.innerHTML)).toBe('October 2018');
      await page.waitForSelector('.calendar-monthview #monthview-datepicker-field + .trigger', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const pickButton = await page.$('.calendar-monthview #monthview-datepicker-field + .trigger');
      pickButton.click();

      await page.waitForSelector('button.is-cancel', { visible: true })
        .then(element => expect(element).toBeTruthy());

      expect(await page.$eval('.calendar-monthview #monthview-datepicker-field', el => el.innerHTML)).toBe('October 2018');
    });

    it('should be able to click on events', async () => {
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      const button = await page.$('.calendar-event-title:nth-child(1)');

      await button.click();
      await page.waitForSelector('#calendar-popup', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should render icons on events', async () => {
      await page.waitForSelector('.calendar-event.azure.event-day-start .icon', { visible: true })
        .then(element => expect(element).toBeTruthy());

      expect(await page.$$eval('.calendar-event.azure.event-day-start .icon', el => el.length)).toEqual(1);
    });

    it('should allow event to span days', async () => {
      expect(await page.$$eval('.calendar-event.azure.event-day-start', el => el.length)).toEqual(2);
      expect(await page.$$eval('.calendar-event.azure.event-day-span', el => el.length)).toEqual(9);
      expect(await page.$$eval('.calendar-event.azure.event-day-end', el => el.length)).toEqual(2);
    });

    it('should show events on click', async () => {
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      const button = await page.$('.calendar-event-title:nth-child(1)');
      await button.click();

      expect(await page.$eval('.calendar-event-details .accordion-header a', el => el.innerHTML)).toBe('Team Event');
    });

    it('should add new events on click and cancel', async () => {
      expect(await page.$$eval('.calendar-event', el => el.length)).toEqual(17);

      const button = await page.$('.calendar-event-title:nth-child(1)');
      await button.click();

      await page.waitForSelector('.calendar-popup', { visible: true })
        .then(element => expect(element).toBeTruthy());

      await page.focus('#subject');
      await page.keyboard.type('New Event Name');

      const closeButton = await page.$('.calendar-popup .btn-close');
      await closeButton.click();

      expect(await page.$$eval('.calendar-event', el => el.length)).toEqual(17);
    });

    it('should add new events on click and submit', async () => {
      expect(await page.$$eval('.calendar-event', el => el.length)).toEqual(17);

      const button = await page.$('.calendar-event-title:nth-child(1)');
      await button.click();

      await page.waitForSelector('.calendar-popup', { visible: true })
        .then(element => expect(element).toBeTruthy());

      await page.focus('#subject');
      await page.keyboard.type('New Event Name');

      const submitButton = await page.$('#submit');
      await submitButton.click();

      expect(await page.$$eval('.calendar-event', el => el.length)).toEqual(17);
    });

    it('should update datepicker date', async () => {
      const nextButton = await page.$('.calendar-monthview button.next');
      await nextButton.click();
      await nextButton.click();
      await nextButton.click();

      expect(await page.$eval('.calendar-monthview #monthview-datepicker-field', el => el.innerHTML)).toBe('January 2019');

      const triggerButton = await page.$('.calendar-monthview #monthview-datepicker-field + .trigger');
      await triggerButton.click();

      await page.waitForSelector('#monthview-popup', { visible: true })
        .then(element => expect(element).toBeTruthy());

      expect(await page.$eval('#monthview-popup .month', el => el.innerHTML)).toBe('January');
      expect(await page.$eval('#monthview-popup .year', el => el.innerHTML.trim())).toBe('2019');
    });
  });

  describe('Only Calendar', () => {
    const url = `${baseUrl}/example-only-calendar`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should render without error', async () => {
      expect(await page.$$eval('.monthview-table td', el => el.length)).toEqual(42);
    });

    it('should be able to click on events', async () => {
      const eventButton = await page.$('.calendar-event-title');
      await eventButton.click();

      await page.waitForSelector('#toast-container', { visible: true })
        .then(element => expect(element).toBeTruthy());

      expect(await page.evaluate(() => document.querySelectorAll('.toast-message')[0].innerText)).toBe('Event "Out of Office" Clicked');
    });

    it.skip('should not visual regress', async () => {
      expect(await page.$$eval('.monthview-table td', el => el.length)).toEqual(42);

      const image = await page.screenshot();
      const config = getConfig('calendar-only');
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Specific Locale', () => {
    const url = `${baseUrl}/test-specific-locale`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should render without error', async () => {
      expect(await page.$$eval('.monthview-table td', el => el.length)).toEqual(42);
    });
  });

  describe('Only Monthview and Legend', () => {
    const url = `${baseUrl}/example-only-calendar-legend`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should render without error', async () => {
      expect(await page.$$eval('.monthview-table td', el => el.length)).toEqual(42);
    });

    it.skip('should not visual regress', async () => {
      expect(await page.$$eval('.monthview-table td', el => el.length)).toEqual(42);

      const image = await page.screenshot();
      const config = getConfig('calendar-monthview-legend');
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('RTL', () => {
    const url = `${baseUrl}/test-specific-month.html?locale=ar-SA&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should render without error', async () => {
      expect(await page.$$eval('.monthview-table td', el => el.length)).toEqual(42);
      expect(await page.$$eval('.monthview-table .calendar-event', el => el.length)).toEqual(2);
    });

    it('should be able to go to next and prev month', async () => {
      const prevButton = await page.$('.monthview-header .prev');
      await prevButton.click();

      expect(await page.$eval('.calendar-monthview #monthview-datepicker-field', el => el.innerHTML.trim())).toBe('ذو الحجة 1439');
      expect(await page.$$eval('.monthview-table .calendar-event', el => el.length)).toEqual(5);

      const nextButton = await page.$('.monthview-header .next');
      await nextButton.click();
      await nextButton.click();

      expect(await page.$eval('.calendar-monthview #monthview-datepicker-field', el => el.innerHTML.trim())).toBe('صفر 1440');
      expect(await page.$$eval('.monthview-table .calendar-event', el => el.length)).toEqual(21);
    });

    it.skip('should not visual regress', async () => {
      expect(await page.$$eval('.monthview-table td', el => el.length)).toEqual(42);

      const image = await page.screenshot();
      const config = getConfig('calendar-rtl');
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Overlapping Events', () => {
    const url = `${baseUrl}/test-overlaping-events`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should span overlaping events', async () => {
      expect(await page.$$eval('[data-key="20200611"] .calendar-event-spacer', el => el.length)).toEqual(1);
      expect(await page.$$eval('[data-key="20200613"] .calendar-event-spacer', el => el.length)).toEqual(2);
      expect(await page.$$eval('[data-key="20200615"] .calendar-event-spacer', el => el.length)).toEqual(2);
      expect(await page.$$eval('[data-key="20200617"] .calendar-event-spacer', el => el.length)).toEqual(0);
    });
  });

  describe('Color Overrides', () => {
    const url = `${baseUrl}/test-event-color-override`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should override event colors correctly', async () => {
      expect(await page.$eval('.calendar-event.azure', el => el.getAttribute('class'))).toBe('calendar-event azure event-day-start-end has-tooltip');
      expect(await page.$eval('.calendar-event.azure.has-tooltip', el => getComputedStyle(el).getPropertyValue('background-color'))).toBe('rgb(190, 220, 250)');
      expect(await page.$eval('.calendar-event.azure.has-tooltip', el => getComputedStyle(el).getPropertyValue('border-left-color'))).toBe('rgb(0, 102, 212)');

      expect(await page.$eval('.calendar-event.amethyst', el => el.getAttribute('class'))).toBe('calendar-event amethyst event-day-start-end has-tooltip');
      expect(await page.$eval('.calendar-event.amethyst.has-tooltip', el => getComputedStyle(el).getPropertyValue('background-color'))).toBe('rgb(194, 161, 241)');
      expect(await page.$eval('.calendar-event.amethyst.has-tooltip', el => getComputedStyle(el).getPropertyValue('border-left-color'))).toBe('rgb(108, 35, 201)');
    });

    it('should disable weekends', async () => {
      expect(await page.$$eval('.monthview-table td.is-disabled', el => el.length)).toEqual(12);
    });

    it('should render day legend', async () => {
      expect(await page.$$eval('.monthview-table td.is-colored', el => el.length)).toEqual(4);
      expect(await page.$$eval('.monthview-legend', el => el.length)).toEqual(1);

      expect(await page.evaluate(() => document.querySelectorAll('.monthview-legend-text')[0].innerText)).toBe('Public Holiday');
      expect(await page.evaluate(() => document.querySelectorAll('.monthview-legend-text')[1].innerText)).toBe('Other');
    });
  });

  describe('Calendar Monthview to Week View and Day View Shading', () => {
    const url = `${baseUrl}/test-legend-day-week-shading`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should override event colors correctly', async () => {
      expect(await page.$eval('.calendar-event.azure', el => el.getAttribute('class'))).toBe('calendar-event azure event-day-start-end has-tooltip');
      expect(await page.$eval('.calendar-event.azure.has-tooltip', el => getComputedStyle(el).getPropertyValue('background-color'))).toBe('rgb(190, 220, 250)');
      expect(await page.$eval('.calendar-event.azure.has-tooltip', el => getComputedStyle(el).getPropertyValue('border-left-color'))).toBe('rgb(0, 102, 212)');

      expect(await page.$eval('.calendar-event.amethyst', el => el.getAttribute('class'))).toBe('calendar-event amethyst event-day-start-end has-tooltip');
      expect(await page.$eval('.calendar-event.amethyst.has-tooltip', el => getComputedStyle(el).getPropertyValue('background-color'))).toBe('rgb(194, 161, 241)');
      expect(await page.$eval('.calendar-event.amethyst.has-tooltip', el => getComputedStyle(el).getPropertyValue('border-left-color'))).toBe('rgb(108, 35, 201)');
    });

    it('should disable weekends', async () => {
      expect(await page.$$eval('.monthview-table td.is-disabled', el => el.length)).toEqual(12);
    });

    it('should render day legend', async () => {
      expect(await page.$$eval('.monthview-table td.is-colored', el => el.length)).toEqual(4);
      expect(await page.$$eval('.monthview-legend', el => el.length)).toEqual(1);

      expect(await page.evaluate(() => document.querySelectorAll('.monthview-legend-text')[0].innerText)).toBe('Public Holiday');
      expect(await page.evaluate(() => document.querySelectorAll('.monthview-legend-text')[1].innerText)).toBe('Other');
    });

    it('should transition to monthview to weekview and day view with shadings', async () => {
      let viewButton = await page.$('div.dropdown');
      await viewButton.click();

      const weekView = await page.$('#list-option-1');
      await weekView.click();

      expect(await page.$$eval('.week-view-table-header > tr > th', el => el.length)).toEqual(8);

      // weekview legends
      expect(await page.$eval('.week-view-table-header > tr > th:nth-child(5) > .week-view-all-day-wrapper', el => el.getAttribute('class'))).toBe('week-view-all-day-wrapper is-colored');
      expect(await page.$eval('.week-view-table-header > tr > th:nth-child(5) > .week-view-all-day-wrapper', el => getComputedStyle(el).getPropertyValue('background-color'))).toBe('rgba(221, 203, 247, 0.3)');
      expect(await page.$eval('.week-view-table-header > tr > th:nth-child(6) > .week-view-all-day-wrapper', el => el.getAttribute('class'))).toBe('week-view-all-day-wrapper is-colored');
      expect(await page.$eval('.week-view-table-header > tr > th:nth-child(6) > .week-view-all-day-wrapper', el => getComputedStyle(el).getPropertyValue('background-color'))).toBe('rgba(221, 203, 247, 0.3)');

      // weekview disables
      expect(await page.$eval('.week-view-table-header > tr > th:nth-child(2) > .week-view-all-day-wrapper', el => el.getAttribute('class'))).toBe('week-view-all-day-wrapper is-disabled');
      expect(await page.$eval('.week-view-table-header > tr > th:nth-child(8) > .week-view-all-day-wrapper', el => el.getAttribute('class'))).toBe('week-view-all-day-wrapper is-disabled');

      viewButton = await page.$('.calendar-weekview > .week-view-header > .calendar-toolbar > .toolbar-section > .dropdown-wrapper > .dropdown');
      await viewButton.click();

      const dayView = await page.$('#list-option-2');
      await dayView.click();

      const nextButton = await page.$('.calendar-weekview > .week-view-header > .calendar-toolbar > .toolbar-section > .next');
      await nextButton.click();

      expect(await page.evaluate(() => document.querySelector('.week-view-header-day-of-week.is-emphasis').innerText)).toBe('22');

      // dayview legend
      expect(await page.$eval('.week-view-table-header > tr > th:nth-child(2) > .week-view-all-day-wrapper', el => el.getAttribute('class'))).toBe('week-view-all-day-wrapper is-colored');
      expect(await page.$eval('.week-view-table-header > tr > th:nth-child(2) > .week-view-all-day-wrapper', el => getComputedStyle(el).getPropertyValue('background-color'))).toBe('rgba(221, 203, 247, 0.3)');

      await nextButton.click();
      await nextButton.click();
      await nextButton.click();

      // dayview disable
      expect(await page.evaluate(() => document.querySelector('.week-view-header-day-of-week.is-emphasis').innerText)).toBe('25');
      expect(await page.$eval('.week-view-table-header > tr > th:nth-child(2) > .week-view-all-day-wrapper', el => el.getAttribute('class'))).toBe('week-view-all-day-wrapper is-disabled');
    });
  });

  describe('Calendar display range tests', () => {
    const url = `${baseUrl}/test-range-in-month`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should render without error', async () => {
      expect(await page.$$eval('.monthview-table td', el => el.length)).toEqual(210);
    });

    it('should disable dates outside of range', async () => {
      expect(await page.$eval('[data-key="20210711"]', el => el.getAttribute('class'))).toBe('is-disabled');
      expect(await page.$eval('[data-key="20220203"]', el => el.getAttribute('class'))).toBe('is-disabled');
      expect(await page.$eval('[data-key="20220204"]', el => el.getAttribute('class'))).toBe('is-disabled');
      expect(await page.$eval('[data-key="20220205"]', el => el.getAttribute('class'))).toBe('is-disabled');
    });

    it('should disable specific dates in the range', async () => {
      expect(await page.$eval('[data-key="20210712"]', el => el.getAttribute('class'))).toBe('is-disabled');
      expect(await page.$eval('[data-key="20210722"]', el => el.getAttribute('class'))).toBe('is-disabled');
      expect(await page.$eval('[data-key="20210801"]', el => el.getAttribute('class'))).toBe('is-disabled');
      expect(await page.$eval('[data-key="20210802"]', el => el.getAttribute('class'))).toBe('is-disabled');
      expect(await page.$eval('[data-key="20210816"]', el => el.getAttribute('class'))).toBe('is-disabled');
      expect(await page.$eval('[data-key="20210901"]', el => el.getAttribute('class'))).toBe('is-disabled');
      expect(await page.$eval('[data-key="20210908"]', el => el.getAttribute('class'))).toBe('is-disabled');
    });

    it('should have month label for the first date of the month rendered', async () => {
      expect(await page.evaluate(() => document.querySelector('[data-key="20210711"]').innerText)).toBe('Jul 11');
      expect(await page.evaluate(() => document.querySelector('[data-key="20210801"]').innerText)).toBe('Aug 1');
      expect(await page.evaluate(() => document.querySelector('[data-key="20210901"]').innerText)).toBe('Sep 1');
    });

    it('should have rendered correct number of events on the calendar', async () => {
      expect(await page.$$eval('.calendar-event', el => el.length)).toEqual(8);
    });

    it('should allow adding custom css class in event label', async () => {
      expect(await page.$eval('[data-key="20210806"] a', el => el.getAttribute('class'))).toContain('night-shift');
    });
  });

  describe('Event Color', () => {
    const url = `${baseUrl}/test-event-custom-colors`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1920, height: 1080 });
    });

    it('should see the custom colors in events and legends', async () => {
      await page.waitForSelector('input.lightsalmon', { visible: true });
      expect(await page.$eval('a[data-id="80"', el => getComputedStyle(el).getPropertyValue('background-color'))).toBe('rgb(255, 160, 122)');
      expect(await page.$eval('a[data-id="80"', el => getComputedStyle(el).getPropertyValue('border-left-color'))).toBe('rgb(255, 69, 0)');
    });

    it('should not display the event accordingly when legend is unchecked', async () => {
      await page.waitForSelector('input.checkbox.powderblue', { visible: true });
      await page.click('label.checkbox-label[for=dto]');

      expect(await page.evaluate(() => {
        const el = document.querySelector('a[data-id="78"');
        return el ? el.style : '';
      })).toBe('');

      expect(await page.evaluate(() => {
        const el = document.querySelector('a[data-id="79"');
        return el ? el.style : '';
      })).toBe('');
    });
  });

  describe('Calendar show/hide event legend tests', () => {
    const url = `${baseUrl}/test-hide-legend.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 967, height: 783 });
    });

    it('should hide legend', async () => {
      await page.click('#show-action');
      const elem = await page.evaluate(() => !!document.querySelector('.calendar-event-legend'));
      expect(elem).toBe(false);
    });

    it('should show legend', async () => {
      await page.click('#show-action');
      const elem = await page.$eval('.calendar-event-legend', el => el !== null);
      expect(elem).toBe(true);
    });
  });
});
