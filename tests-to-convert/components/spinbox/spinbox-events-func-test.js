/**
 * @jest-environment jsdom
 */
import { Spinbox } from '../../../src/components/spinbox/spinbox';
import { cleanup } from '../../helpers/func-utils';

const spinboxHTML = `<div class="row">
  <div class="one-half column">
    <div class="field">
      <label for="regular-spinbox">Select a number from 1 to 10</label>
      <input id="regular-spinbox" name="regular-spinbox" type="text" class="spinbox" data-options="{min: 0, max: 10}"/>
    </div>
  </div>
</div>`;

let spinboxEl;
let spinboxApi;
const spinboxId = '#regular-spinbox';

describe('Spinbox Events', () => {
  beforeEach(() => {
    spinboxEl = null;
    spinboxApi = null;

    document.body.insertAdjacentHTML('afterbegin', spinboxHTML);

    spinboxEl = document.body.querySelector(spinboxId);
    spinboxApi = new Spinbox(spinboxEl);
  });

  afterEach(() => {
    spinboxApi.destroy();
    cleanup();
  });

  it('should trigger "change" event', () => {
    const callback = jest.fn();
    $('#regular-spinbox').on('change', callback);
    spinboxApi.updateVal(10);

    expect(callback).toHaveBeenCalled();
  });
});
