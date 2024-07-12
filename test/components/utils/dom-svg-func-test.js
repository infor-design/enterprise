/**
 * @jest-environment jsdom
 */
import { DOM } from '../../../src/utils/dom';
import { cleanup } from '../../helpers/func-utils';

const elemHTML = `<div class="test-container">
  <span class="test-span">test</span>
  <svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-calendar"></use></svg>
</div>`;

let svg;

describe('Dom Utils (SVGElement)', () => {
  beforeEach(() => {
    document.body.insertAdjacentHTML('afterbegin', elemHTML);
    svg = document.querySelector('.icon');
  });

  afterEach(() => {
    cleanup();
  });

  it('can add/remove a single class on an svg', () => {
    // In future should run this test on IE
    DOM.addClass(svg, 'test');

    expect(svg.classList.toString()).toEqual('icon test');

    DOM.removeClass(svg, 'test');

    expect(svg.classList.toString()).toEqual('icon');
  });

  it('can add/remove a multiple classes on an svg', () => {
    // In future should run this test on IE
    DOM.addClass(svg, 'test', 'test2', 'test3');

    expect(svg.classList.toString()).toEqual('icon test test2 test3');

    DOM.removeClass(svg, 'test', 'test2', 'test3');

    expect(svg.classList.toString()).toEqual('icon');
  });
});
