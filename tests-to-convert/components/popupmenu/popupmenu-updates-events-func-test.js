/**
 * @jest-environment jsdom
 */
import { PopupMenu } from '../../../src/components/popupmenu/popupmenu';
import { cleanup } from '../../helpers/func-utils';

const popupmenuSelectableHTML = `<div class="row"">
  <div class="twelve columns">
    <div class="field">
      <button id="single-select-popupmenu-trigger" class="btn-menu hide-focus">
        <span>Selectable Menu</span>
        <svg role="presentation" aria-hidden="true" focusable="false" class="icon icon-dropdown">
          <use href="#icon-dropdown"></use>
        </svg>
      </button>
      <ul class="popupmenu is-selectable">
        <li><a href="#">Menu Option #1</a></li>
        <li><a href="#">Menu Option #2</a></li>
        <li><a href="#">Menu Option #3</a></li>
        <li class="is-checked"><a href="#">Sub Option #4</a></li>
        <li><a href="#">Menu Option #5</a></li>
        <li><a href="#">Menu Option #6</a></li>
      </ul>
    </div>
  </div>
</div>
`;

let popupmenuButtonEl;
let popupmenuObj;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('Popupmenu Events', () => {
  beforeEach(() => {
    popupmenuButtonEl = null;
    popupmenuObj = null;

    document.body.insertAdjacentHTML('afterbegin', popupmenuSelectableHTML);
    popupmenuButtonEl = document.body.querySelector('#single-select-popupmenu-trigger');
    popupmenuObj = new PopupMenu(popupmenuButtonEl);
  });

  afterEach(() => {
    popupmenuObj?.destroy();
    cleanup();
  });

  it('should trigger "beforeopen" event', () => {
    const callback = jest.fn();
    $('#single-select-popupmenu-trigger').on('beforeopen', callback);
    popupmenuObj.open();

    expect(callback).toHaveBeenCalled();
  });

  it('should trigger "open" event', (done) => {
    const callback = jest.fn();
    $('#single-select-popupmenu-trigger').on('open', callback);
    popupmenuObj.open();
    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('should trigger "afteropen" event', (done) => {
    const callback = jest.fn();
    $('#single-select-popupmenu-trigger').on('afteropen', callback);
    popupmenuObj.open();
    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('should trigger "close" event', (done) => {
    const callback = jest.fn();
    $('#single-select-popupmenu-trigger').on('close', callback);
    popupmenuObj.open();
    popupmenuObj.close();
    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      done();
    }, 600);
  });

  it('should not bubble "destroy" event', () => {
    const callback = jest.fn();
    $('.field').on('destroy', callback);
    popupmenuObj?.destroy();

    expect(callback).not.toHaveBeenCalled();
  });
});
