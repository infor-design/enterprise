/**
 * @jest-environment jsdom
 */
import { Progress } from '../../../src/components/progress/progress';
import { cleanup } from '../../helpers/func-utils';

const progressHTML = `<div class="row">
  <div class="one-third column">

    <label id="pr-label1">Percent complete</label>
    <div class="progress">
      <div class="progress-bar" data-options="{'value': '50'}" id="progress-bar1" data-automation-id="progress-bar1-automation" aria-labelledby="pr-label1"></div>
    </div>

    <button type="button" class="btn-secondary" id="upd-progressbar">Update</button>
  </div>

  <script>
    $('#upd-progressbar').on('click', function () {
      $('#progress-bar1').data('progress').update('100');
    });
  </script>

</div>`;

let progressEl;
let progressObj;

describe('Progress API', () => {
  beforeEach(() => {
    progressEl = null;
    progressObj = null;
    document.body.insertAdjacentHTML('afterbegin', progressHTML);
    progressEl = document.body.querySelector('.progress .progress-bar');

    progressObj = new Progress(progressEl, {});
  });

  afterEach(() => {
    progressObj.destroy();
    cleanup();
  });

  it('should render progress', () => {
    expect(progressObj).toBeTruthy();
    expect(progressEl.style.width).toEqual('50%');
  });

  it('should be able to destroy', () => {
    progressObj.destroy();

    expect($(progressEl).data('.progress')).toBeFalsy();
  });

  it('should update when calling updated with string value', () => {
    const updatedSettings = {
      value: 40
    };
    progressObj.updated(updatedSettings);

    expect(progressEl.style.width).toEqual('40%');
  });

  it('should update when calling updated with number value', () => {
    const updatedSettings = {
      value: '40'
    };
    progressObj.updated(updatedSettings);

    expect(progressEl.style.width).toEqual('40%');
  });

  it('should init with 100%', () => {
    progressObj.destroy();
    progressObj.updated({ value: '100' });

    expect(progressEl.style.width).toEqual('100%');

    progressObj.destroy();
    progressObj.updated({ value: 100 });

    expect(progressEl.style.width).toEqual('100%');
  });

  it('should init with 0', () => {
    progressObj.destroy();
    progressObj.updated({ value: '0' });

    expect(progressEl.style.width).toEqual('0%');

    progressObj.destroy();
    progressObj.updated({ value: 0 });

    expect(progressEl.style.width).toEqual('0%');
  });
});
