/**
 * Helper object for custom event validation
 * @requires Page object from Playwright to create
 */
export class CustomEventTest {
  isInitialized = false;

  page = null;

  constructor(page) {
    this.page = page;
  }

  /**
   * Initialize the window variable to be used.
   * @returns {CustomEventTest} returns CustomeEventTest
   */
  async initialize() {
    await this.page.evaluate(() => {
      // eslint-disable-next-line no-undef
      window.eventsList = [];
    });
    this.isInitialized = true;
    return this;
  }

  /**
   * Set the page object where the events list is stored and validated.
   * @param {Page} page page object
   */
  async setPage(page) {
    this.page = page;
    await this.initialize();
  }
}
