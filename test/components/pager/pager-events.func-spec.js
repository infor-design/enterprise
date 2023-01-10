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

  it('should trigger "firstpage" event when first page is clicked', (done) => {
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      onFirstPage: () => {
      }
    });

    const callback = jest.fn();
    $(pagerEl).on('firstpage', callback);
    document.body.querySelector('.pager-container .pager-first .btn-icon').click();

    expect(callback).toHaveBeenCalled();
    done();
  });

  it('should trigger "previouspage" event when prev page is clicked', (done) => {
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      onPreviousPage: () => {
      }
    });

    const callback = jest.fn();
    $(pagerEl).on('previouspage', callback);

    document.body.querySelector('.pager-container .pager-prev .btn-icon').click();

    expect(callback).toHaveBeenCalled();
    done();
  });

  it('should trigger "nextpage" event when next page is clicked', (done) => {
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      onNextPage: () => {
      }
    });

    const callback = jest.fn();
    $(pagerEl).on('nextpage', callback);
    document.body.querySelector('.pager-container .pager-next .btn-icon').click();

    expect(callback).toHaveBeenCalled();
    done();
  });

  it('should trigger "lastpage" event when last page is clicked', (done) => {
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      onLastPage: () => {
      }
    });

    const callback = jest.fn();
    $(pagerEl).on('lastpage', callback);
    document.body.querySelector('.pager-container .pager-last .btn-icon').click();

    expect(callback).toHaveBeenCalled();
    done();
  });
});
