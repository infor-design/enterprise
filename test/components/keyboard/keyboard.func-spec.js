import { keyboard } from '../../../src/utils/keyboard';
import { cleanup } from '../../helpers/func-utils';

const html = require('../../../app/views/utils/example-keyboard.html');

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
    const spyEvent = spyOnEvent('body', 'keys');
    $('body').on('keys', (e, a) => {
      expect(a[0]).toBeTruthy('Ctrl');
      done();
    });
    keyPress('Ctrl');
    $('body').off('keys');

    expect(spyEvent).toHaveBeenCalled();
  });

  it('Can query pressedKeys', () => {
    keyPress('Ctrl');

    expect(keyboard.pressedKeys).toBeTruthy();
  });
});
