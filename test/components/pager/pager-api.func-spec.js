import { Pager } from '../../../src/components/pager/pager';
import { cleanup } from '../../helpers/func-utils';

const pagerHTML = require('../../../app/views/components/pager/example-standalone.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

// Custom tooltip settings
const firstContent = 'In The Beginning...';
const previousContent = 'Before Long...';
const nextContent = 'The Next Day...';
const lastContent = 'In Closing...';

let pagerEl;
let pagerObj;

describe('Pager API (Standalone)', () => {
  beforeEach(() => {
    pagerEl = null;
    pagerObj = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', pagerHTML);
    pagerEl = document.body.querySelector('.pager-container');
  });

  afterEach(() => {
    pagerObj.destroy();
    cleanup();
  });

  it('should be defined on jQuery object', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone' });

    expect(pagerObj).toBeTruthy();
  });

  it('should render', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone' });

    expect(document.body.querySelector('.pager-toolbar')).toBeTruthy();
    expect(document.body.querySelector('.pager-first')).toBeTruthy();
    expect(document.body.querySelector('.pager-prev')).toBeTruthy();
    expect(document.body.querySelector('.pager-next')).toBeTruthy();
    expect(document.body.querySelector('.pager-last')).toBeTruthy();
  });

  it('should destroy pager', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone' });
    pagerObj.destroy();

    expect(document.body.querySelector('.pager-toolbar')).toBeFalsy();
  });

  it('should be show page size selector', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', showPageSizeSelector: true });

    expect(document.body.querySelector('.pager-pagesize')).toBeTruthy();
  });

  it('should hide first button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', showFirstButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon')).not.toExist();
    expect(document.body.querySelector('.pager-prev .btn-icon')).toBeVisible();
    expect(document.body.querySelector('.pager-next .btn-icon')).toBeVisible();
    expect(document.body.querySelector('.pager-last .btn-icon')).toBeVisible();

    pagerObj.updated({ showFirstButton: true });
  });

  it('should disable first button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', enableFirstButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon[disabled]')).toBeTruthy();
    expect(document.body.querySelector('.pager-prev .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-next .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-last .btn-icon[disabled]')).toBeFalsy();

    pagerObj.updated({ enableFirstButton: true });
  });

  it('should hide previous button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', showPreviousButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon')).toBeVisible();
    expect(document.body.querySelector('.pager-prev .btn-icon')).not.toExist();
    expect(document.body.querySelector('.pager-next .btn-icon')).toBeVisible();
    expect(document.body.querySelector('.pager-last .btn-icon')).toBeVisible();
  });

  it('should disable previous button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', enablePreviousButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-prev .btn-icon[disabled]')).toBeTruthy();
    expect(document.body.querySelector('.pager-next .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-last .btn-icon[disabled]')).toBeFalsy();
  });

  it('should hide next button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', showNextButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon')).toBeVisible();
    expect(document.body.querySelector('.pager-prev .btn-icon')).toBeVisible();
    expect(document.body.querySelector('.pager-next .btn-icon')).not.toExist();
    expect(document.body.querySelector('.pager-last .btn-icon')).toBeVisible();
  });

  it('should disable next button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', enableNextButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-prev .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-next .btn-icon[disabled]')).toBeTruthy();
    expect(document.body.querySelector('.pager-last .btn-icon[disabled]')).toBeFalsy();
  });

  it('should hide last button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', showLastButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon')).toBeVisible();
    expect(document.body.querySelector('.pager-prev .btn-icon')).toBeVisible();
    expect(document.body.querySelector('.pager-next .btn-icon')).toBeVisible();
    expect(document.body.querySelector('.pager-last .btn-icon')).not.toExist();

    pagerObj.updated({ showLastButton: true });
  });

  it('should disable last button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', enableLastButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-prev .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-next .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-last .btn-icon[disabled]')).toBeTruthy();

    pagerObj.updated({ enableLastButton: true });
  });

  it('Can have custom tooltips on the first, previous, next, and last buttons', () => {
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      firstPageTooltip: firstContent,
      previousPageTooltip: previousContent,
      nextPageTooltip: nextContent,
      lastPageTooltip: lastContent
    });

    const firstBtnTooltipAPI = $(document.body.querySelector('.pager-first .btn-icon')).data('tooltip');
    const previousBtnTooltipAPI = $(document.body.querySelector('.pager-prev .btn-icon')).data('tooltip');
    const nextBtnTooltipAPI = $(document.body.querySelector('.pager-next .btn-icon')).data('tooltip');
    const lastBtnTooltipAPI = $(document.body.querySelector('.pager-last .btn-icon')).data('tooltip');

    expect(firstBtnTooltipAPI.settings.content).toEqual(firstContent);
    expect(previousBtnTooltipAPI.settings.content).toEqual(previousContent);
    expect(nextBtnTooltipAPI.settings.content).toEqual(nextContent);
    expect(lastBtnTooltipAPI.settings.content).toEqual(lastContent);
  });

  it('Can be updated with new settings', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone' });

    function updateJunk() {
    }

    const newSettings = {
      firstPageTooltip: firstContent,
      previousPageTooltip: previousContent,
      nextPageTooltip: nextContent,
      lastPageTooltip: lastContent,
      enableFirstButton: false,
      enablePreviousButton: false,
      enableNextButton: false,
      enableLastButton: false,
      showPageSizeSelector: false,
      smallPageSizeSelector: true,
      showFirstButton: false,
      showPreviousButton: false,
      showNextButton: false,
      showLastButton: false,
      indeterminate: true,
      onFirstPage: updateJunk,
      onPreviousPage: updateJunk,
      onNextPage: updateJunk,
      onLastPage: updateJunk,
      pagesize: 16,
      pagesizes: [16, 32, 64]
    };

    pagerObj.updated(newSettings);

    expect(pagerObj.settings.firstPageTooltip).toEqual(firstContent);
    expect(pagerObj.settings.previousPageTooltip).toEqual(previousContent);
    expect(pagerObj.settings.nextPageTooltip).toEqual(nextContent);
    expect(pagerObj.settings.lastPageTooltip).toEqual(lastContent);
    expect(pagerObj.settings.enableFirstButton).toBeFalsy();
    expect(pagerObj.settings.enablePreviousButton).toBeFalsy();
    expect(pagerObj.settings.enableNextButton).toBeFalsy();
    expect(pagerObj.settings.enableLastButton).toBeFalsy();
    expect(pagerObj.settings.showPageSizeSelector).toBeFalsy();
    expect(pagerObj.settings.smallPageSizeSelector).toBeTruthy();
    expect(pagerObj.settings.showFirstButton).toBeFalsy();
    expect(pagerObj.settings.showPreviousButton).toBeFalsy();
    expect(pagerObj.settings.showNextButton).toBeFalsy();
    expect(pagerObj.settings.showLastButton).toBeFalsy();
    expect(typeof pagerObj.settings.onFirstPage).toEqual('function');
    expect(typeof pagerObj.settings.onPreviousPage).toEqual('function');
    expect(typeof pagerObj.settings.onNextPage).toEqual('function');
    expect(typeof pagerObj.settings.onLastPage).toEqual('function');
    expect(pagerObj.settings.indeterminate).toBeTruthy();
    expect(pagerObj.settings.pagesize).toEqual(16);
    expect(pagerObj.settings.pagesizes.length).toEqual(3);
  });

  it('Can display a small page selector', () => {
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      pagesize: 20,
      pagesizes: [5, 10, 15, 20, 25, 30],
      showPageSizeSelector: true,
      smallPageSizeSelector: true
    });

    expect(pagerObj.settings.smallPageSizeSelector).toBeTruthy();

    const button = pagerEl.querySelector('.pager-pagesize > button');
    const recordCountEl = button.querySelector('.record-count');

    expect(recordCountEl).toBeTruthy();
    expect(recordCountEl.innerText).toBe('20');
  });
});
