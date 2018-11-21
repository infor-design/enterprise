import { DOM } from '../../../src/utils/dom';

const elemHTML = `<div class="test-container">
  <span class="test-span">test</span>
  <svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-calendar"></use></svg>
</div>`;

let span;
let svg;

describe('Dom Utils', () => {
  beforeEach(() => {
    document.body.insertAdjacentHTML('afterbegin', elemHTML);
    span = document.querySelector('.test-span');
    svg = document.querySelector('.icon');
  });

  afterEach(() => {
    const rowEl = document.body.querySelector('.test-container');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('can add/remove a single class', () => {
    DOM.addClass(span, 'test');

    expect(span.classList.toString()).toEqual('test-span test');

    DOM.removeClass(span, 'test');

    expect(span.classList.toString()).toEqual('test-span');
  });

  it('can add/remove a single class on an svg', () => {
    // In future should run this test on IE
    DOM.addClass(svg, 'test');

    expect(svg.classList.toString()).toEqual('icon test');

    DOM.removeClass(svg, 'test');

    expect(svg.classList.toString()).toEqual('icon');
  });

  it('can add/remove a multiple classes', () => {
    DOM.addClass(span, 'test', 'test2', 'test3');

    expect(span.classList.toString()).toEqual('test-span test test2 test3');

    DOM.removeClass(span, 'test', 'test2', 'test3');

    expect(span.classList.toString()).toEqual('test-span');
  });

  it('can add/remove a multiple classes on an svg', () => {
    // In future should run this test on IE
    DOM.addClass(svg, 'test', 'test2', 'test3');

    expect(svg.classList.toString()).toEqual('icon test test2 test3');

    DOM.removeClass(svg, 'test', 'test2', 'test3');

    expect(svg.classList.toString()).toEqual('icon');
  });
});
