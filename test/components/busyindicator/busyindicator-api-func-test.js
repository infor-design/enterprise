/**
 * @jest-environment jsdom
 */
import { BusyIndicator } from '../../../src/components/busyindicator/busyindicator';
import { cleanup } from '../../helpers/func-utils';

const busyindicatorHTML = `<div class="row">
  <div class="one-half column">
    <div class="busy" id="busy-form" data-options="{ 'displayDelay': 100, 'timeToComplete': 100000, 'attributes' : [{ name: 'id', value: 'busyindicator-id-1' }, { name: 'data-automation-id', value: 'busyindicator-automation-id-1' }] }">
      <div class="field">
        <label for="busy-field-name">Name</label>
        <input type="text" id="busy-field-name" name="busy-field-name" value="" />
      </div>
      <div class="field">
        <label for="busy-field-address">Address</label>
        <input type="text" id="busy-field-address" name="busy-field-address" value="" />
      </div>
      <div class="field">
        <label for="busy-field-cats">Number of Cats</label>
        <input type="text" id="busy-field-cats" name="busy-field-cats" value="" />
      </div>
      <div class="field">
        <button type="text" id="submit" class="btn-primary">Submit</button>
      </div>
    </div>
  </div>
</div>`;

let busyindicatorEl;
let busyindicatorObj;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('Busy Indicator API', () => {
  beforeEach(() => {
    busyindicatorEl = null;
    busyindicatorObj = null;
    document.body.insertAdjacentHTML('afterbegin', busyindicatorHTML);

    busyindicatorEl = document.body.querySelector('#busy-form');
    busyindicatorObj = new BusyIndicator(busyindicatorEl);
  });

  afterEach(() => {
    busyindicatorObj?.destroy();
    cleanup();
  });

  it('Should be defined on jQuery object', () => {
    expect(busyindicatorObj).toBeTruthy();
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
