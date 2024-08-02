/**
 * @jest-environment jsdom
 */
import { Tooltip } from '../../../src/components/tooltip/tooltip';
import { cleanup } from '../../helpers/func-utils';

const triggerHTML = `<div id="test-wrapper" class="field">
  <button class="btn-secondary" id="tooltip-trigger">
    <span>This has a Tooltip</span>
  </button>
</div>`;

let tooltipBtnEl;
let tooltipAPI;

describe('Tooltip API', () => {
  beforeEach(() => {
    tooltipBtnEl = null;
    tooltipAPI = null;
    document.body.insertAdjacentHTML('afterbegin', triggerHTML);
    tooltipBtnEl = document.querySelector('#tooltip-trigger');
  });

  afterEach(() => {
    if (tooltipAPI) {
      tooltipAPI.destroy();
    }
    cleanup();
  });

  it('should exist', () => {
    tooltipAPI = new Tooltip(tooltipBtnEl, {
      trigger: 'click',
      content: 'This IS the Tooltip!'
    });

    expect(tooltipAPI).toBeTruthy();
  });

  it('will not display if the trigger element is hidden', () => {
    tooltipBtnEl.classList.add('hidden');
    tooltipAPI = new Tooltip(tooltipBtnEl, {
      trigger: 'click',
      content: 'This IS the Tooltip!'
    });

    expect(tooltipAPI.canBeShown).toBeFalsy();

    tooltipBtnEl.click();

    expect(tooltipAPI.visible).toBeFalsy();
  });

  it('will not display if a parent node of the trigger element is hidden', () => {
    const fieldWrapper = document.querySelector('#test-wrapper');
    fieldWrapper.classList.add('hidden');
    tooltipAPI = new Tooltip(tooltipBtnEl, {
      trigger: 'click',
      content: 'This IS the Tooltip!'
    });

    expect(tooltipAPI.canBeShown).toBeFalsy();

    tooltipBtnEl.click();

    expect(tooltipAPI.visible).toBeFalsy();
  });
});
