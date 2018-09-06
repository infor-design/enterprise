import { Button, BusyIndicator } from '../../../src/components/busyindicator/busyindicator';

const busyindicatorHTML = require('../../../app/views/components/busyindicator/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let busyindicatorEl;
let svgEl;
let busyindicatorObj;

describe('Busy Indicator API', () => {
  beforeEach(() => {
    busyindicatorEl = null;
    svgEl = null;
    busyindicatorObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', busyindicatorHTML);
    busyindicatorEl = document.body.querySelector('.busy-indicator');
    svgEl = document.body.querySelector('.svg-icons');
    busyindicatorEl.classList.add('no-init');
    busyindicatorObj = new BusyIndicator(busyindicatorEl);
  });

  afterEach(() => {
    busyindicatorObj.destroy();
    busyindicatorEl.parentNode.removeChild(busyindicatorEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should be defined on jQuery object', () => {
    expect(busyindicatorObj).toEqual(jasmine.any(Object));
  });

  it('Should destroy busy indicator', (done) => {
    const spyEvent = spyOnEvent(busyindicatorEl, 'start.busyindicator');
    busyindicatorObj.destroy();

    const buttonEl = document.body.querySelector('#submit');
    buttonEl.click();

    setTimeout(() => {
      expect(spyEvent).not.toHaveBeenTriggered();
      done();
    }, 500);

    expect($(busyindicatorEl).data('busyindicator')).toBeFalsy();
  });

  it('Should set settings', () => {
    const settings = {
      blockUI: true,
      text: null,
      displayDelay: 1000,
      timeToComplete: 0,
      transparentOverlay: false,
      overlayOnly: false
    };

    expect(busyindicatorObj.settings).toEqual(settings);
  });

  it('Should update settings via parameter', () => {
    const settings = {
      blockUI: false,
      text: null,
      displayDelay: 1000,
      timeToComplete: 0,
      transparentOverlay: false,
      overlayOnly: false
    };

    busyindicatorObj.init();
    busyindicatorObj.updated(settings);

    expect(busyindicatorObj.settings.blockUI).toEqual(settings.blockUI);
  });
});
