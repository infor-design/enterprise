import { Accordion } from '../../../src/components/accordion/accordion';

const accordionHTML = require('../../../app/views/components/accordion/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let accordionEl;
let svgEl;
let accordionObj;

describe('Accordion API', () => {
  beforeEach(() => {
    accordionEl = null;
    svgEl = null;
    accordionObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', accordionHTML);
    accordionEl = document.body.querySelector('.accordion');
    svgEl = document.body.querySelector('.svg-icons');
    accordionObj = new Accordion(accordionEl);
  });

  afterEach(() => {
    accordionObj.destroy();
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should be defined', () => {
    expect(accordionObj).toEqual(jasmine.any(Object));
  });

  it('Should be visible', () => {
    expect(document.body.querySelector('.accordion')).toBeTruthy();
  });

  it('Should be able to destroy it', () => {
    accordionObj.destroy();

    expect(document.body.querySelector('.btn.hide-focus')).toBeFalsy();
  });

  it('Should be able to enable it', () => {
    accordionObj.disable();

    accordionEl = document.body.querySelector('.accordion.is-disabled');
    accordionObj = new Accordion(accordionEl);

    accordionObj.enable();

    expect(document.body.querySelector('.accordion.is-disabled')).toBeFalsy();
  });

  it('Should be able to disable it', () => {
    accordionObj.disable();

    expect(document.body.querySelector('.accordion.is-disabled')).toBeTruthy();
  });

  it('Should be able to collapse all accordion', () => {
    accordionObj.collapseAll();

    expect(document.body.querySelector('.accordion.is-expanded')).toBeFalsy();
  });
});
