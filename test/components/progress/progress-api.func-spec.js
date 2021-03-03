import { Progress } from '../../../src/components/progress/progress';
import { cleanup } from '../../helpers/func-utils';

const progressHTML = require('../../../app/views/components/progress/example-index.html');

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

  it('Should render progress', () => {
    expect(progressObj).toEqual(jasmine.any(Object));
    expect(progressEl.style.width).toEqual('50%');
  });

  it('Should be able to destroy', () => {
    progressObj.destroy();

    expect($(progressEl).data('.progress')).toBeFalsy();
  });

  it('Should update when calling updated with string value', () => {
    const updatedSettings = {
      value: 40
    };
    progressObj.updated(updatedSettings);

    expect(progressEl.style.width).toEqual('40%');
  });

  it('Should update when calling updated with number value', () => {
    const updatedSettings = {
      value: '40'
    };
    progressObj.updated(updatedSettings);

    expect(progressEl.style.width).toEqual('40%');
  });

  it('Should init with 100%', () => {
    progressObj.destroy();
    progressObj.updated({ value: '100' });

    expect(progressEl.style.width).toEqual('100%');

    progressObj.destroy();
    progressObj.updated({ value: 100 });

    expect(progressEl.style.width).toEqual('100%');
  });

  it('Should init with 0', () => {
    progressObj.destroy();
    progressObj.updated({ value: '0' });

    expect(progressEl.style.width).toEqual('0%');

    progressObj.destroy();
    progressObj.updated({ value: 0 });

    expect(progressEl.style.width).toEqual('0%');
  });
});
