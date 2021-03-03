import { longPress } from '../../../src/behaviors/longpress/longpress';
import { cleanup } from '../../helpers/func-utils';

const longpressHTML = require('../../../app/views/behaviors/longpress/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

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
    cleanup();
  });

  it('can be triggered on an element', () => {
    const spyEvent = spyOnEvent('#test-button', 'longpress');
    const testButtonEl = document.querySelector('#test-button');

    longPress.fire(testButtonEl);

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('can be updated with new settings', () => {
    const newSettings = {
      delay: 1500,
      mouseEvents: true
    };

    longPress.updated(newSettings);

    expect(longPress.settings.delay).toEqual(1500);
    expect(longPress.settings.mouseEvents).toEqual(true);
  });
});
