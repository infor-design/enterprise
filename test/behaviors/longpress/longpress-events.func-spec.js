import { longPress } from '../../../src/behaviors/longpress/longpress';

const longpressHTML = require('../../../app/views/behaviors/longpress/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let svgEl;

describe('Longpress events', () => {
  beforeEach(() => {
    svgEl = null;
    document.body.insertAdjacentHTML('afterbegin', longpressHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    svgEl = document.body.querySelector('.svg-icons');
  });

  afterEach(() => {
    svgEl.parentNode.removeChild(svgEl);
  });

  it('can be triggered on an element', () => {
    const spyEvent = spyOnEvent('#test-button', 'longpress');
    const testButtonEl = document.querySelector('#test-button');

    longPress.fire(testButtonEl);

    expect(spyEvent).toHaveBeenTriggered();
  });
});
