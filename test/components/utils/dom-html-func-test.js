/**
 * @jest-environment jsdom
 */
import { DOM } from '../../../src/utils/dom';
import { cleanup } from '../../helpers/func-utils';

const elemHTML = `<div class="test-container">
  <div class="top-wrapper silly">
    <div class="middle-wrapper silly">
      <div class="bottom-wrapper">
        <span class="test-span">test</span>
      </div>
    </div>
  </div>
</div>`;

let span;

describe('Dom Utils (HTMLElement)', () => {
  beforeEach(() => {
    document.body.insertAdjacentHTML('afterbegin', elemHTML);
    span = document.querySelector('.test-span');
  });

  afterEach(() => {
    cleanup();
  });

  it('can add/remove a single class', () => {
    DOM.addClass(span, 'test');

    expect(span.classList.toString()).toEqual('test-span test');

    DOM.removeClass(span, 'test');

    expect(span.classList.toString()).toEqual('test-span');
  });

  it('can add/remove a multiple classes', () => {
    DOM.addClass(span, 'test', 'test2', 'test3');

    expect(span.classList.toString()).toEqual('test-span test test2 test3');

    DOM.removeClass(span, 'test', 'test2', 'test3');

    expect(span.classList.toString()).toEqual('test-span');
  });

  it('can get a list of parent elements that match a CSS selector', () => {
    const targetSelector = '.silly';
    const parentEls = DOM.parents(span, targetSelector);

    // Checks existence/size
    expect(Array.isArray(parentEls)).toBeTruthy();
    expect(parentEls.length).toEqual(2);

    // Checks the order of the elements pushed
    expect(parentEls[0].classList.contains('middle-wrapper')).toBeTruthy();
    expect(parentEls[1].classList.contains('top-wrapper')).toBeTruthy();
  });

  it('can get the closest parent element that matches a CSS selector', () => {
    const targetSelector = '.silly';
    const parentEl = DOM.parents(span, targetSelector, true);

    expect(parentEl instanceof HTMLElement).toBeTruthy();
    expect(parentEl.classList.contains('middle-wrapper')).toBeTruthy();
  });
});
