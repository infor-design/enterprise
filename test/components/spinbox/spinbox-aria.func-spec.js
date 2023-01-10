import { Spinbox } from '../../../src/components/spinbox/spinbox';
import { cleanup } from '../../helpers/func-utils';

const spinboxHTML = require('../../../app/views/components/spinbox/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let spinboxEl;
let spinboxAPI;
const spinboxId = '#regular-spinbox';

describe('Spinbox ARIA', () => {
  beforeEach(() => {
    spinboxEl = null;
    spinboxAPI = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', spinboxHTML);

    spinboxEl = document.body.querySelector(spinboxId);

    spinboxAPI = new Spinbox(spinboxEl);
  });

  afterEach(() => {
    spinboxAPI.destroy();
    cleanup();
  });

  it('should set ARIA labels', () => {
    expect(document.body.querySelector('.spinbox[aria-valuemin]').getAttribute('aria-valuemin')).toEqual('0');
    expect(document.body.querySelector('.spinbox[aria-valuemax]').getAttribute('aria-valuemax')).toEqual('10');
    expect(document.body.querySelector('.spinbox[aria-valuenow]').getAttribute('aria-valuenow')).toEqual('0');
  });

  it('should update ARIA labels with value change', () => {
    spinboxAPI.updateVal(5);

    expect(document.body.querySelector('.spinbox[aria-valuenow]').getAttribute('aria-valuenow')).toEqual('5');
  });
});
