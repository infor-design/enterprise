import { Pager } from '../../../src/components/pager/pager';
import { cleanup } from '../../helpers/func-utils';

const pagerHTML = require('../../../app/views/components/pager/example-standalone.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let pagerEl;
let pagerObj;

describe('Pager Event Test', () => {
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

  it('Should trigger "firstpage" event when first page is clicked', (done) => {
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      onFirstPage: () => {
      }
    });

    const spyFunc = spyOn(pagerObj.settings, 'onFirstPage');
    const spyEvent = spyOnEvent($(pagerEl), 'firstpage');
    document.body.querySelector('.pager-container .pager-first .btn-icon').click();

    expect(spyFunc).toHaveBeenCalled();
    expect(spyEvent).toHaveBeenCalled();
    done();
  });

  it('Should trigger "previouspage" event when prev page is clicked', (done) => {
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      onPreviousPage: () => {
      }
    });

    const spyFunc = spyOn(pagerObj.settings, 'onPreviousPage');
    const spyEvent = spyOnEvent($(pagerEl), 'previouspage');
    document.body.querySelector('.pager-container .pager-prev .btn-icon').click();

    expect(spyFunc).toHaveBeenCalled();
    expect(spyEvent).toHaveBeenCalled();
    done();
  });

  it('Should trigger "nextpage" event when next page is clicked', (done) => {
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      onNextPage: () => {
      }
    });

    const spyFunc = spyOn(pagerObj.settings, 'onNextPage');
    const spyEvent = spyOnEvent($(pagerEl), 'nextpage');
    document.body.querySelector('.pager-container .pager-next .btn-icon').click();

    expect(spyFunc).toHaveBeenCalled();
    expect(spyEvent).toHaveBeenCalled();
    done();
  });

  it('Should trigger "lastpage" event when last page is clicked', (done) => {
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      onLastPage: () => {
      }
    });

    const spyFunc = spyOn(pagerObj.settings, 'onLastPage');
    const spyEvent = spyOnEvent($(pagerEl), 'lastpage');
    document.body.querySelector('.pager-container .pager-last .btn-icon').click();

    expect(spyFunc).toHaveBeenCalled();
    expect(spyEvent).toHaveBeenCalled();
    done();
  });
});
