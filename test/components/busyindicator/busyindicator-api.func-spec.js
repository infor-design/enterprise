const busyindicatorHTML = require('../../../app/views/components/busyindicator/example-index.html');

let busyindicatorEl;
let busyindicatorObj;

describe('Busy Indicator API', () => {
  beforeEach(() => {
    busyindicatorEl = null;
    busyindicatorObj = null;
    document.body.insertAdjacentHTML('afterbegin', busyindicatorHTML);

    busyindicatorEl = $('#busy-form');
    busyindicatorObj = busyindicatorEl.data('busyindicator');
  });

  afterEach(() => {
    if (busyindicatorObj) {
      busyindicatorObj.destroy();
    }

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should return correct value for isActive', () => {
    const buttonEl = $('#submit');
    buttonEl.click();

    setTimeout(() => {
      expect(busyindicatorObj.isActive()).toEqual(true);
    }, 0);
  });

  it('Should display busy indicator when triggering "start.busyindicator"', () => {
    busyindicatorEl.trigger('start.busyindicator');

    setTimeout(() => {
      expect(document.body.querySelector('.busy-indicator-container')).toBeTruthy();
    }, 0);
  });

  it('Should hide busy indicator when triggerring "complete.busyindicator"', () => {
    const buttonEl = $('#submit');
    buttonEl.click();

    setTimeout(() => {
      busyindicatorEl.trigger('complete.busyindicator');

      expect(document.body.querySelector('.busy-indicator')).toBeFalsy();
    }, 0);
  });

  it('Should update text of busy indicator', () => {
    const buttonEl = $('#submit');
    buttonEl.click();

    setTimeout(() => {
      busyindicatorObj.updated({ text: 'Custom Text 1' });
    }, 0);

    setTimeout(() => {
      const customTextEl = $('.busy-indicator-container > span');

      expect(customTextEl.text()).toEqual('Custom Text 1');
      busyindicatorObj.destroy();
    }, 0);
  });

  it('Should destroy busy indicator', () => {
    const buttonEl = $('#submit');
    buttonEl.click();

    setTimeout(() => {
      busyindicatorObj.destroy();

      expect(busyindicatorObj).toBeFalsy();
    }, 0);
  });
});
