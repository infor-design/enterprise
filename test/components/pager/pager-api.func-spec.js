import { Pager } from '../../../src/components/pager/pager';

const pagerHTML = require('../../../app/views/components/pager/example-standalone.html');
const svg = require('../../../src/components/icons/svg.html');

let pagerEl;
let svgEl;
let pagerObj;

describe('Pager API (Standalone)', () => {
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
    pagerObj.updated({ type: 'standalone' });
    pagerObj.destroy();
    pagerEl.parentNode.removeChild(pagerEl);
    svgEl.parentNode.removeChild(svgEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should be defined on jQuery object', () => {
    expect(pagerObj).toEqual(jasmine.any(Object));
  });

  it('Should render', () => {
    expect(document.body.querySelector('.pager-toolbar')).toBeTruthy();
    expect(document.body.querySelector('.pager-first')).toBeTruthy();
    expect(document.body.querySelector('.pager-prev')).toBeTruthy();
    expect(document.body.querySelector('.pager-next')).toBeTruthy();
    expect(document.body.querySelector('.pager-last')).toBeTruthy();
  });

  it('Should destroy pager', () => {
    pagerObj.destroy();

    expect(document.body.querySelector('.pager-toolbar')).toBeFalsy();
  });

  it('Should be show page size selector', () => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, { type: 'standalone', showPageSizeSelector: true });

    expect(document.body.querySelector('.pager-pagesize')).toBeTruthy();
  });

  it('Should hide first button', () => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, { type: 'standalone', showFirstButton: false });

    expect(document.body.querySelector('.pager-first a')).not.toExist();
    expect(document.body.querySelector('.pager-prev a')).toBeVisible();
    expect(document.body.querySelector('.pager-next a')).toBeVisible();
    expect(document.body.querySelector('.pager-last a')).toBeVisible();

    pagerObj.updated({ showFirstButton: true });
  });

  it('Should disable first button', () => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, { type: 'standalone', enableFirstButton: false });

    expect(document.body.querySelector('.pager-first a[disabled]')).toBeTruthy();
    expect(document.body.querySelector('.pager-prev a[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-next a[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-last a[disabled]')).toBeFalsy();

    pagerObj.updated({ enableFirstButton: true });
  });

  it('Should hide previous button', () => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, { type: 'standalone', showPreviousButton: false });

    expect(document.body.querySelector('.pager-first a')).toBeVisible();
    expect(document.body.querySelector('.pager-prev a')).not.toExist();
    expect(document.body.querySelector('.pager-next a')).toBeVisible();
    expect(document.body.querySelector('.pager-last a')).toBeVisible();
  });

  it('Should disable previous button', () => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, { type: 'standalone', enablePreviousButton: false });

    expect(document.body.querySelector('.pager-first a[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-prev a[disabled]')).toBeTruthy();
    expect(document.body.querySelector('.pager-next a[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-last a[disabled]')).toBeFalsy();
  });

  it('Should hide next button', () => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, { type: 'standalone', showNextButton: false });

    expect(document.body.querySelector('.pager-first a')).toBeVisible();
    expect(document.body.querySelector('.pager-prev a')).toBeVisible();
    expect(document.body.querySelector('.pager-next a')).not.toExist();
    expect(document.body.querySelector('.pager-last a')).toBeVisible();
  });

  it('Should disable next button', () => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, { type: 'standalone', enableNextButton: false });

    expect(document.body.querySelector('.pager-first a[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-prev a[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-next a[disabled]')).toBeTruthy();
    expect(document.body.querySelector('.pager-last a[disabled]')).toBeFalsy();
  });

  it('Should hide last button', () => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, { type: 'standalone', showLastButton: false });

    expect(document.body.querySelector('.pager-first a')).toBeVisible();
    expect(document.body.querySelector('.pager-prev a')).toBeVisible();
    expect(document.body.querySelector('.pager-next a')).toBeVisible();
    expect(document.body.querySelector('.pager-last a')).not.toExist();

    pagerObj.updated({ showLastButton: true });
  });

  it('Should disable last button', () => {
    pagerObj.destroy();
    pagerObj = new Pager(pagerEl, { type: 'standalone', enableLastButton: false });

    expect(document.body.querySelector('.pager-first a[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-prev a[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-next a[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-last a[disabled]')).toBeTruthy();

    pagerObj.updated({ enableLastButton: true });
  });
});
