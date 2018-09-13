const busyindicatorHTML = require('../../../app/views/components/busyindicator/example-index.html');

let busyindicatorEl;
let busyindicatorObj;

describe('Busy Indicator API', () => {
  beforeEach(() => {
    busyindicatorEl = null;
    document.body.insertAdjacentHTML('afterbegin', busyindicatorHTML);

    busyindicatorEl = $('#busy-form');

    busyindicatorObj = busyindicatorEl.data('busyindicator');
  });

  afterEach(() => {
    if (busyindicatorObj) {
      busyindicatorObj.destroy();
    }
  });

  it('Should destroy busy indicator', () => {
    const buttonEl = $('#submit');
    buttonEl.click();

    setTimeout(() => {
      busyindicatorObj.destroy();

      expect(busyindicatorObj).toBeFalsy();
    }, 1000);
  });

  it('Should display busy indicator when triggering "start.busyindicator"', () => {
    busyindicatorEl.trigger('start.busyindicator');

    setTimeout(() => {
      expect(document.body.querySelector('.busy-indicator')).toBeTruthy();
    }, 1000);
  });

  it('Should hide busy indicator when triggerring "complete.busyindicator"', () => {
    const buttonEl = $('#submit');
    buttonEl.click();

    setTimeout(() => {
      busyindicatorEl.trigger('complete.busyindicator');

      expect(document.body.querySelector('.busy-indicator')).toBeFalsy();
    });
  });

  it('Should update text of busy indicator', () => {
    const buttonEl = $('#submit');
    buttonEl.click();

    let customText = '';

    setTimeout(() => {
      customText = 'Custom Text';
      busyindicatorObj.updated({ text: customText });
    }, 1000);

    setTimeout(() => {
      const customTextEl = $('.busy-indicator-container > span');

      expect(customTextEl.text()).toEqual(customText);
    }, 2000);
  });

  it('Should return correct value for isActive', () => {
    const buttonEl = $('#submit');
    buttonEl.click();

    setTimeout(() => {
      expect(busyindicatorObj.isActive()).toEqual(true);
    }, 1000);
  });
});
