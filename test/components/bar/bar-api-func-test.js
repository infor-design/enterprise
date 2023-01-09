/**
 * @jest-environment jsdom
 */
import { cleanup, triggerContextmenu } from '../../helpers/func-utils';
import { Bar } from '../../../src/components/bar/bar';

const barHTML = `<div class="row">
  <div class="two-thirds column">
      <div class="widget">
        <div class="widget-header">
          <h2 class="widget-title">Vertical Bar Chart Title</h2>
        </div>
        <div class="widget-content" style="height: auto;">
          <div id="bar-example" class="chart-container">
          </div>
        </div>
      </div>
  </div>
</div>`;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

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
    document.body.insertAdjacentHTML('afterbegin', barHTML);
    barEl = document.body.querySelector('.chart-container');

    barObj = new Bar(barEl, settings);
    setTimeout(() => {
      done();
    });
  });

  afterEach(() => {
    barObj?.destroy();
    cleanup();
  });

  it('Should be defined on jQuery object', () => {
    expect(barObj).toBeTruthy();
  });

  it('Should be visible', () => {
    expect(document.body.querySelector('.chart-container')).toBeTruthy();
  });

  it.skip('Should select a bar', (done) => {
    const options = {
      fieldName: 'name',
      fieldValue: 'Category C'
    };
    barObj.setSelected(options);

    setTimeout(() => {
      expect(barObj.getSelected()).toBeTruthy();
      expect(barObj.getSelected()[0].data.name).toEqual('Category C');
      done();
    }, 201);
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
    barObj?.destroy();
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
    barObj?.destroy();

    expect(document.body.querySelector('.bar-chart')).toBeFalsy();
  });

  it('Should fire contextmenu event with bar', () => {
    const callback = jest.fn();
    $(barEl).on('contextmenu', callback);
    $(barEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('.group .series-group .bar'));

    expect(callback).toHaveBeenCalled();
  });

  it('Should fire contextmenu event with bar grouped', () => {
    barObj.destroy();
    barObj = new Bar(barEl, groupedSettings);
    const callback = jest.fn();
    $(barEl).on('contextmenu', callback);
    $(barEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('.group .series-group .bar'));

    expect(callback).toHaveBeenCalled();
  });

  it('Should fire contextmenu event with bar stacked', () => {
    barObj.destroy();
    barObj = new Bar(barEl, stackedSettings);
    const callback = jest.fn();
    $(barEl).on('contextmenu', callback);
    $(barEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('.group .series-group .bar'));

    expect(callback).toHaveBeenCalled();
  });
});
