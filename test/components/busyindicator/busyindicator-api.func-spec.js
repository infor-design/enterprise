import { BusyIndicator } from '../../../src/components/busyindicator/busyindicator';
import { cleanup } from '../../helpers/func-utils';

const busyindicatorHTML = require('../../../app/views/components/busyindicator/example-index.html');

let busyindicatorEl;
let busyindicatorObj;

describe('Busy Indicator API', () => {
  beforeEach(() => {
    busyindicatorEl = null;
    busyindicatorObj = null;
    document.body.insertAdjacentHTML('afterbegin', busyindicatorHTML);

    busyindicatorEl = document.body.querySelector('#busy-form');
    busyindicatorObj = new BusyIndicator(busyindicatorEl);
  });

  afterEach(() => {
    if (busyindicatorObj) {
      busyindicatorObj.destroy();
    }
    cleanup();
  });

  it('Should be defined on jQuery object', () => {
    expect(busyindicatorObj).toEqual(jasmine.any(Object));
  });

  it('Should handle custom text', (done) => {
    busyindicatorObj.destroy();
    busyindicatorObj = new BusyIndicator(busyindicatorEl, { text: 'Hang Tough, Skippy...' });
    busyindicatorObj.activate();

    setTimeout(() => {
      expect(document.querySelector('.busy-indicator-container > span').textContent).toEqual('Hang Tough, Skippy...');
      done();
    }, 500);
  });

  it('Should return correct value for isActive', (done) => {
    busyindicatorObj.activate();

    setTimeout(() => {
      expect(busyindicatorObj.isActive()).toEqual(true);
      done();
    }, 500);
  });

  it('Should display busy indicator when triggering "start.busyindicator"', (done) => {
    busyindicatorObj.activate();

    setTimeout(() => {
      expect(document.body.querySelector('.busy-indicator-container')).toBeTruthy();
      done();
    }, 500);
  });

  it('Should hide busy indicator when triggering complete/close', (done) => {
    busyindicatorObj.activate();

    setTimeout(() => {
      busyindicatorObj.close(true);

      setTimeout(() => {
        expect(document.querySelector('.busy-indicator-container')).toBeFalsy();
        done();
      }, 1000);
    }, 500);
  });

  it('Should update text of busy indicator', (done) => {
    busyindicatorObj.activate();

    setTimeout(() => {
      busyindicatorObj.updated({ text: 'Custom Text 1' });
    }, 500);

    setTimeout(() => {
      const customTextEl = busyindicatorObj.element.find('span');

      expect(customTextEl.text()).toEqual('Custom Text 1');
      busyindicatorObj.destroy();
      done();
    }, 500);
  });

  it('Should destroy busy indicator', (done) => {
    busyindicatorObj.activate();

    setTimeout(() => {
      busyindicatorObj.destroy();

      setTimeout(() => {
        expect(document.querySelector('.busy-indicator-container')).toBeFalsy();
        done();
      }, 1000);
    }, 500);
  });
});
