const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Pager (List/Detail, no page size selector)', () => {
  beforeEach(async () => {
    await utils.setPage('/patterns/list-detail-paging.html');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.pager-toolbar'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should have two navigation buttons', async () => {
    expect(await element.all(by.css('.pager-toolbar li')).count()).toEqual(2);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visually regress', async () => {
      const pagerToolbar = await element(by.css('.pager-toolbar'));

      expect(await browser.imageComparison.checkElement(pagerToolbar, 'pager-listdetail')).toEqual(0);
    });
  }
});

describe('Pager (List/Detail, with page size selector)', () => {
  beforeEach(async () => {
    await utils.setPage('/patterns/list-detail-paging-pagesize-selector.html');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.pager-toolbar'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  xit('Should have four navigation buttons and a small page size selector', async () => {
    expect(await element.all(by.css('.pager-toolbar > li')).count()).toEqual(5);
    expect(await element.all(by.css('.pager-toolbar > li.pager-pagesize')).isPresent()).toBeTruthy();

    await element(by.css('.pager-toolbar li.pager-pagesize button')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('#popupmenu-1'))), config.waitsFor);

    expect(await element.all(by.css('#popupmenu-1 li')).count()).toEqual(6);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visually regress when closed', async () => {
      const pagerToolbar = await element(by.css('.pager-toolbar'));

      expect(await browser.imageComparison.checkElement(pagerToolbar, 'pager-listdetail-pagesize-closed')).toEqual(0);
    });

    xit('Should not visually regress when opened', async () => {
      const pagerToolbar = await element(by.css('.pager-toolbar'));

      await element(by.css('.pager-toolbar li.pager-pagesize button')).click();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('#popupmenu-1'))), config.waitsFor);
      const menu = await element(by.css('#popupmenu-1'));

      expect(await browser.imageComparison.checkElement(pagerToolbar, 'pager-listdetail-pagesize-open-bar')).toEqual(0);
      expect(await browser.imageComparison.checkElement(menu, 'pager-listdetail-pagesize-open-menu')).toEqual(0);
    });
  }
});
