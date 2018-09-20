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

    const busyindicatorContainerEl = document.body.querySelector('.busy-indicator-container');
    if (busyindicatorContainerEl) {
      busyindicatorContainerEl.parentNode.removeChild(busyindicatorContainerEl);
    }
  });

  it('Should destroy busy indicator', () => {
    const buttonEl = $('#submit');
    buttonEl.click();

    setTimeout(() => {
      busyindicatorObj.destroy();

      expect(busyindicatorObj).toBeFalsy();
    }, 100);
  });

  it('Should display busy indicator when triggering "start.busyindicator"', () => {
    busyindicatorEl.trigger('start.busyindicator');

    setTimeout(() => {
      expect(document.body.querySelector('.busy-indicator')).toBeTruthy();
    }, 100);
  });

  it('Should hide busy indicator when triggerring "complete.busyindicator"', () => {
    const buttonEl = $('#submit');
    buttonEl.click();

    setTimeout(() => {
      busyindicatorEl.trigger('complete.busyindicator');

      expect(document.body.querySelector('.busy-indicator')).toBeFalsy();
    }, 100);
  });

  it('Should update text of busy indicator', () => {
    const buttonEl = $('#submit');
    buttonEl.click();

    let customText = '';

    setTimeout(() => {
      customText = 'Custom Text';
      busyindicatorObj.updated({ text: customText });
    }, 100);

    setTimeout(() => {
      const customTextEl = $('.busy-indicator-container > span');

      expect(customTextEl.text()).toEqual(customText);
    }, 200);
  });

  it('Should return correct value for isActive', () => {
    const buttonEl = $('#submit');
    buttonEl.click();

    setTimeout(() => {
      expect(busyindicatorObj.isActive()).toEqual(true);
    }, 100);
  });
});
