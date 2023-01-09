import { TimePicker } from '../../../src/components/timepicker/timepicker';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

require('../../../src/components/locale/cultures/ar-EG.js');
require('../../../src/components/locale/cultures/ar-SA.js');
require('../../../src/components/locale/cultures/da-DK.js');
require('../../../src/components/locale/cultures/en-US.js');

const timepickerHTML = require('../../../app/views/components/timepicker/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let timepickerEl;
let timepickerObj;

describe('TimePicker API', () => {
  beforeEach(() => {
    timepickerEl = null;
    timepickerObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', timepickerHTML);
    timepickerEl = document.body.querySelector('.timepicker');
    timepickerEl.classList.add('no-init');

    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('da-DK', Soho.Locale.cultures['da-DK'], Soho.Locale.languages['da']); //eslint-disable-line
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line

    timepickerObj = new TimePicker(timepickerEl);
  });

  afterEach(() => {
    timepickerObj.destroy();
    cleanup();
  });

  it('Should be defined on jQuery object', () => {
    expect(timepickerObj).toBeTruthy();
  });

  xit('Should render based on locale setting', (done) => {
    timepickerObj.destroy();
    timepickerObj = new TimePicker(timepickerEl, {
      locale: 'da-DK'
    });
    timepickerObj.openTimePopup();

    setTimeout(() => {
      expect(document.querySelector('#timepicker-popup:last-child .set-time').innerText).toEqual('Indstil tid');
      expect(document.body.querySelectorAll('#timepicker-popup:last-child .time-parts select').length).toEqual(2);
      done();
    }, 400);
  });

  it('Should destroy timepicker', () => {
    timepickerObj.destroy();

    expect(timepickerObj.isOpen()).toBeFalsy();
    expect(document.body.querySelector('.timepicker.is-open')).toBeFalsy();
  });

  it('Should disable timepicker', () => {
    timepickerObj.disable();

    expect(document.body.querySelector('.field.is-disabled .timepicker')).toBeTruthy();
    expect(timepickerObj.isDisabled()).toBeTruthy();
  });

  it('Should enable timepicker', () => {
    timepickerObj.enable();

    expect(document.body.querySelector('.field.is-disabled .timepicker')).toBeFalsy();
    expect(timepickerObj.isDisabled()).toBeFalsy();
  });

  it('Should render timepicker readonly', () => {
    timepickerObj.readonly();

    expect(document.body.querySelector('.timepicker[readonly]')).toBeTruthy();
    expect(timepickerObj.isDisabled()).toBeFalsy();
  });

  it('Should have accessible text', () => {
    // Label
    expect(timepickerObj.label.length).toBeTruthy();

    // Trigger button audible span
    expect(timepickerObj.trigger[0].querySelector('.audible').textContent.length).toBeTruthy();
  });
});
