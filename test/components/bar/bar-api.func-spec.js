import { Bar } from '../../../src/components/bar/bar';
import { Locale } from '../../../src/components/locale/locale';

const barHTML = require('../../../app/views/components/bar/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let barEl;
let svgEl;
let barObj;

const settings = {
  dataset: [
    {
      data: [{
        name: 'Category A',
        value: 373,
        color: '#1D5F8A',
        id: 1
      }, {
        name: 'Category B',
        value: 372,
        color: '#8ED1C6',
        id: 2
      }, {
        name: 'Category C',
        value: 236.35,
        color: '#9279A6',
        id: 3
      }],
      name: ''
    }
  ]
};

describe('Bar API', () => {
  beforeEach(() => {
    barEl = null;
    svgEl = null;
    barObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', barHTML);
    barEl = document.body.querySelector('.chart-container');
    svgEl = document.body.querySelector('.svg-icons');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US']); //eslint-disable-line
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line

    barObj = new Bar(barEl, settings);
  });

  afterEach(() => {
    const rowEl = document.body.querySelector('.row');

    barObj.destroy();

    rowEl.parentNode.removeChild(rowEl);
    barEl.parentNode.removeChild(barEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should be defined on jQuery object', () => {
    expect(barObj).toEqual(jasmine.any(Object));
  });

  it('Should be visible', () => {
    expect(document.body.querySelector('.chart-container')).toBeTruthy();
  });

  it('Should select a bar', () => {
    const options = {
      fieldName: 'name',
      fieldValue: 'Category C'
    };
    barObj.setSelected(options);

    expect(barObj.getSelected()).toBeTruthy();
  });

  it('Should toggle selected bar', () => {
    const options = {
      fieldName: 'name',
      fieldValue: 'Category C'
    };
    barObj.setSelected(options);
    barObj.toggleSelected(options);

    expect(barObj.getSelected()).toBeTruthy();
  });

  it('Should update settings of bar', () => {
    const newSettings = {
      dataset: [
        {
          data: [{
            name: 'Category A',
            value: 373,
            color: '#1D5F8A',
            id: 1
          }],
          name: ''
        }
      ]
    };

    barObj.updated(newSettings);
    const dataLength = barObj.settings.dataset[0].data.length;

    expect(dataLength).toEqual(1);
  });

  it('Should destroy bar', () => {
    barObj.destroy();

    expect(document.body.querySelector('.bar-chart')).toBeFalsy();
  });
});
