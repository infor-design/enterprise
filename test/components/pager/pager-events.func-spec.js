import { Pager } from '../../../src/components/pager/pager';

const pagerHTML = require('../../../app/views/components/pager/example-standalone.html');
const svg = require('../../../src/components/icons/svg.html');

let pagerEl;
let svgEl;
let pagerObj;

describe('Pager Event Test', () => {
  beforeEach(() => {
    pagerEl = null;
    svgEl = null;
    pagerObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', pagerHTML);
    pagerEl = document.body.querySelector('.pager-container');
    svgEl = document.body.querySelector('.svg-icons');
    pagerObj = new Pager(pagerEl, { type: 'standalone' });
  });

  afterEach(() => {
    pagerObj.destroy();
    pagerEl.parentNode.removeChild(pagerEl);
    svgEl.parentNode.removeChild(svgEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should trigger "firstpage" event when first page is clicked', (done) => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      onFirstPage: () => {
      }
    });

    const spyFunc = spyOn(pagerObj.settings, 'onFirstPage');
    const spyEvent = spyOnEvent($(pagerEl), 'firstpage');
    document.body.querySelector('.pager-container .pager-first a').click();

    expect(spyFunc).toHaveBeenCalled();
    expect(spyEvent).toHaveBeenTriggered();
    done();
  });

  it('Should trigger "previouspage" event when prev page is clicked', (done) => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      onPreviousPage: () => {
      }
    });

    const spyFunc = spyOn(pagerObj.settings, 'onPreviousPage');
    const spyEvent = spyOnEvent($(pagerEl), 'previouspage');
    document.body.querySelector('.pager-container .pager-prev a').click();

    expect(spyFunc).toHaveBeenCalled();
    expect(spyEvent).toHaveBeenTriggered();
    done();
  });

  it('Should trigger "nextpage" event when next page is clicked', (done) => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      onNextPage: () => {
      }
    });

    const spyFunc = spyOn(pagerObj.settings, 'onNextPage');
    const spyEvent = spyOnEvent($(pagerEl), 'nextpage');
    document.body.querySelector('.pager-container .pager-next a').click();

    expect(spyFunc).toHaveBeenCalled();
    expect(spyEvent).toHaveBeenTriggered();
    done();
  });

  it('Should trigger "lastpage" event when last page is clicked', (done) => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      onLastPage: () => {
      }
    });

    const spyFunc = spyOn(pagerObj.settings, 'onLastPage');
    const spyEvent = spyOnEvent($(pagerEl), 'lastpage');
    document.body.querySelector('.pager-container .pager-last a').click();

    expect(spyFunc).toHaveBeenCalled();
    expect(spyEvent).toHaveBeenTriggered();
    done();
  });

  it('Should support custom tooltips', () => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      firstPageTooltip: 'Custom First',
      previousPageTooltip: 'Custom Previous',
      nextPageTooltip: 'Custom Next',
      lastPageTooltip: 'Custom Last'
    });

    expect($('.pager-first a').data('tooltip').content).toEqual('<p>Custom First</p>');
    expect($('.pager-prev a').data('tooltip').content).toEqual('<p>Custom Previous</p>');
    expect($('.pager-next a').data('tooltip').content).toEqual('<p>Custom Next</p>');
    expect($('.pager-last a').data('tooltip').content).toEqual('<p>Custom Last</p>');
  });
});
