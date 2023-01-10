import { Spinbox } from '../../../src/components/spinbox/spinbox';
import { cleanup } from '../../helpers/func-utils';

const spinboxHTML = require('../../../app/views/components/spinbox/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let spinboxEl;
let spinboxApi;
const spinboxId = '#regular-spinbox';

describe('Spinbox Events', () => {
  beforeEach(() => {
    spinboxEl = null;
    spinboxApi = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', spinboxHTML);

    spinboxEl = document.body.querySelector(spinboxId);
    spinboxApi = new Spinbox(spinboxEl);
  });

  afterEach(() => {
    spinboxApi.destroy();
    cleanup();
  });

  it('Should trigger "change" event', () => {
    const callback = jest.fn();
    $('#regular-spinbox').on('change', callback);
    spinboxApi.updateVal(10);

    expect(callback).toHaveBeenCalled();
  });
});
