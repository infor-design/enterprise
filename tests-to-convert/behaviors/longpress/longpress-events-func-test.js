/**
 * @jest-environment jsdom
 */
import { longPress } from '../../../src/behaviors/longpress/longpress';
import { cleanup } from '../../helpers/func-utils';

const longpressHTML = `<div class="row">
  <div class="six columns">
    <h2>LongPress Behavior</h2>
    <p>Original Issue: <a class="hyperlink" href="https://github.com/infor-design/enterprise/issues/245" target="_blank">#245</a></p>
    <p>Hold down the mouse button, or longpress via touch anywhere on the page to trigger a 'longpress' event that shows up in the developer console.</p>
  </div>
</div>

<div class="row top-padding">
  <div class="four columns">
    <button id="test-button" class="btn-primary">
      <span>Test Button</span>
    </button>
  </div>
</div>

<div class="row top-padding">
  <div class="four columns">
    <label for="test-dropdown">Test Dropdown</label>
    <select id="test-dropdown" class="dropdown">
      <option>Ready</option>
      <option>Set</option>
      <option>Go</option>
    </select>
  </div>
</div>

<div class="row top-padding">
  <div class="four columns">
    <label for="test-slider">Test Slider</label>
    <input id="test-slider" value="10" class="slider" type="range" data-tooltip-content="['']" data-tooltip-persist="true" />
  </div>
</div>

<script id="test-script">
  $('body').on('longpress', function(e) {
    var target = e.target;
    if (console && console.dir) {
      console.dir(target);
    }
  });
</script>
`;

describe('Longpress events', () => {
  beforeEach(async () => {
    document.body.insertAdjacentHTML('afterbegin', longpressHTML);
  });

  afterEach(() => {
    cleanup();
  });

  it('can be triggered on an element', () => {
    const callback = jest.fn();

    $('#test-button').on('longpress', callback);
    const testButtonEl = $('#test-button');
    testButtonEl.trigger('longpress');

    expect(callback).toHaveBeenCalledTimes(1);
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
