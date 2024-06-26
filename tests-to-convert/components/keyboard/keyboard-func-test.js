/**
 * @jest-environment jsdom
 */
import { keyboard } from '../../../src/utils/keyboard';
import { cleanup } from '../../helpers/func-utils';

const html = `<div class="row">
  <div class="six columns">
    <h2>Keyboard Manager</h2>
    <p>Press any key(s) on the keyboard.</p>
  </div>
</div>

 <div class="row top-padding">
  <div class="six columns">
    <p>
      <span id="pressed-keys-console"></span>
    </p>
  </div>
</div>

 <script id="test-script">
  $('body').on('keys.test', function(e, keys) {
    const keysStr = keys.join(', ');
    document.querySelector('#pressed-keys-console').innerText = keysStr;
    console.log(Soho.keyboard.pressedKeys)
  });
</script>`;

const keyPress = function (key) {
  const event = document.createEvent('Event');
  event.key = key;
  event.initEvent('keydown');
  document.dispatchEvent(event);
};

describe('Keyboard Manager Tests', () => {
  beforeEach(() => {
    document.body.insertAdjacentHTML('afterbegin', html);
  });

  afterEach(() => {
    cleanup();
  });

  it('Can be trigger a keys event', (done) => {
    const callback = jest.fn();
    $('body').on('keys', callback);

    $('body').on('keys', (e, a) => {
      expect(a[0]).toBeTruthy();
      done();
    });
    keyPress('Ctrl');
    $('body').off('keys');

    expect(callback).toHaveBeenCalled();
  });

  it('Can query pressedKeys', () => {
    keyPress('Ctrl');

    expect(keyboard.pressedKeys).toBeTruthy();
  });
});
