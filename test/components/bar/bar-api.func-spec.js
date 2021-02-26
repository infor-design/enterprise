import { cleanup, triggerContextmenu } from '../../helpers/func-utils';
import { Bar } from '../../../src/components/bar/bar';
import { Locale } from '../../../src/components/locale/locale';

const barHTML = require('../../../app/views/components/bar/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let barEl;
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
  ],
  animate: false,
  type: 'bar'
};

const twoSeriesData = [{
  data: [{
    name: '2008',
    value: 123
  }, {
    name: '2009',
    value: 234
  }, {
    name: '2010',
    value: 345
  }],
  name: 'Series 1'
}, {
  data: [{
    name: '2008',
    value: 235
  }, {
    name: '2009',
    value: 267
  }, {
    name: '2010',
    value: 573
  }],
  name: 'Series 2'
}];

const groupedSettings = {
  type: 'bar-grouped',
  dataset: [{
    data: [{
      name: 'Jan',
      value: 12,
    }, {
      name: 'Feb',
      value: 11
    }, {
      name: 'Mar',
      value: 14
    }, {
      name: 'Apr',
      value: 10
    }],
    name: 'Component A'
  }, {
    data: [{
      name: 'Jan',
      value: 22
    }, {
      name: 'Feb',
      value: 21
    }, {
      name: 'Mar',
      value: 24
    }, {
      name: 'Apr',
      value: 20
    }],
    name: 'Component B'
  }, {
    data: [{
      name: 'Jan',
      value: 32
    }, {
      name: 'Feb',
      value: 31
    }, {
      name: 'Mar',
      value: 34
    }, {
      name: 'Apr',
      value: 30
    }],
    name: 'Component C'
  }]
};

const stackedSettings = {
  type: 'bar-stacked',
  dataset: [{
    data: [{
      name: '2008',
      value: 123
    }, {
      name: '2009',
      value: 234
    }, {
      name: '2010',
      value: 345,
    }],
    name: 'Series 1'
  }, {
    data: [{
      name: '2008',
      value: 235
    }, {
      name: '2009',
      value: 267
    }, {
      name: '2010',
      value: 573
    }],
    name: 'Series 2'
  }]
};

describe('Bar API', () => {
  beforeEach((done) => {
    barEl = null;
    barObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', barHTML);
    barEl = document.body.querySelector('.chart-container');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line

    barObj = new Bar(barEl, settings);
    setTimeout(() => {
      done();
    });
  });

  afterEach(() => {
    barObj.destroy();
    cleanup([
      '.svg-icons',
      '#svg-tooltip',
      '.row',
      '#test-script'
    ]);
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
    expect(barObj.getSelected()[0].data.name).toEqual('Category C');
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

  it('Should be able to hide legend', (done) => {
    barObj.destroy();
    const newSettings = Object.assign({ showLegend: true, dataset: twoSeriesData }, settings); // eslint-disable-line
    newSettings.dataset = twoSeriesData;
    barObj = new Bar(barEl, newSettings);

    setTimeout(() => {
      expect(document.body.querySelector('.chart-legend')).toBeTruthy();

      newSettings.showLegend = false;
      barObj.updated(newSettings);

      expect(document.body.querySelector('.chart-legend')).toBeFalsy();
      done();
    });
  });

  it('Should destroy bar', () => {
    barObj.destroy();

    expect(document.body.querySelector('.bar-chart')).toBeFalsy();
  });

  it('Should fire contextmenu event with bar', () => {
    const spyEvent = spyOnEvent(barEl, 'contextmenu');
    const result = { name: 'Category A', value: 373, color: '#1D5F8A', id: 1 };
    $(barEl).on('contextmenu', (e, el, d) => {
      expect(d).toEqual(jasmine.objectContaining(result));
    });
    triggerContextmenu(document.body.querySelector('.group .series-group .bar'));

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Should fire contextmenu event with bar grouped', () => {
    barObj.destroy();
    barObj = new Bar(barEl, groupedSettings);
    const spyEvent = spyOnEvent(barEl, 'contextmenu');
    const result = { name: 'Jan', value: 12 };
    $(barEl).on('contextmenu', (e, el, d) => {
      expect(d).toEqual(jasmine.objectContaining(result));
    });
    triggerContextmenu(document.body.querySelector('.group .series-group .bar'));

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Should fire contextmenu event with bar stacked', () => {
    barObj.destroy();
    barObj = new Bar(barEl, stackedSettings);
    const spyEvent = spyOnEvent(barEl, 'contextmenu');
    const result = { name: '2008', value: 123 };
    $(barEl).on('contextmenu', (e, el, d) => {
      expect(d).toEqual(jasmine.objectContaining(result));
    });
    triggerContextmenu(document.body.querySelector('.group .series-group .bar'));

    expect(spyEvent).toHaveBeenTriggered();
  });
});
