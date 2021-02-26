import { Spinbox } from '../../../src/components/spinbox/spinbox';

const spinboxHTML = require('../../../app/views/components/spinbox/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let spinboxEl;
let svgEl;
let spinboxApi;
const spinboxId = '#regular-spinbox';

describe('Spinbox Events', () => {
  beforeEach(() => {
    spinboxEl = null;
    svgEl = null;
    spinboxApi = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', spinboxHTML);

    spinboxEl = document.body.querySelector(spinboxId);
    svgEl = document.body.querySelector('.svg-icons');
    spinboxApi = new Spinbox(spinboxEl);
  });

  afterEach(() => {
    spinboxApi.destroy();
    spinboxEl.parentNode.removeChild(spinboxEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should trigger "change" event', () => {
    const spyEvent = spyOnEvent('#regular-spinbox', 'change');
    spinboxApi.updateVal(10);

    expect(spyEvent).toHaveBeenTriggered();
  });
});
