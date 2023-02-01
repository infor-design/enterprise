/**
 * @jest-environment jsdom
 */
import { triggerContextmenu, cleanup } from '../../helpers/func-utils';
import { Line } from '../../../src/components/line/line';

const scatterplotHTML = `<div class="row">
  <div class="two-thirds column">
      <div class="widget">
        <div class="widget-header">
          <h2 class="widget-title">Scatter Chart Example</h2>
        </div>
        <div class="widget-content">
          <div id="scatterplot-example" class="chart-container">
          </div>
        </div>
      </div>
  </div>
</div>`;

let scatterplotEl;
let scatterplotObj;

// let chartAPI;
const dataset = [{
  data: [{
    name: 'January',
    value: {
      x: 5,
      y: 3
    }
  }, {
    name: 'February',
    value: {
      x: 37,
      y: 5
    }
  }, {
    name: 'March',
    value: {
      x: 10,
      y: 5.3
    }
  }, {
    name: 'April',
    value: {
      x: 80,
      y: 6
    }
  }, {
    name: 'May',
    value: {
      x: 21,
      y: 4.8
    }
  }, {
    name: 'June',
    value: {
      x: 72,
      y: 5.2
    }
  }, {
    name: 'July',
    value: {
      x: 26,
      y: 8
    }
  }, {
    name: 'August',
    value: {
      x: 71,
      y: 3.9
    }
  }, {
    name: 'September',
    value: {
      x: 85,
      y: 8
    }
  }, {
    name: 'October',
    value: {
      x: 52,
      y: 3
    }
  }, {
    name: 'November',
    value: {
      x: 44,
      y: 5.9
    }
  }, {
    name: 'December',
    value: {
      x: 110,
      y: 7
    }
  }],
  name: 'Series 01',
  labels: {
    name: 'Series',
    value: {
      x: 'Revenue',
      y: 'Sold'
    }
  },
  // Use d3 Format - only value will be formated
  valueFormatterString: {
    z: '0.0%'
  }
},
{
  data: [{
    name: 'January',
    value: {
      x: 9,
      y: 3.2
    }
  }, {
    name: 'February',
    value: {
      x: 12,
      y: 6.3
    }
  }, {
    name: 'March',
    value: {
      x: 65,
      y: 4
    }
  }, {
    name: 'April',
    value: {
      x: 27,
      y: 7
    }
  }, {
    name: 'May',
    value: {
      x: 29,
      y: 8.5
    }
  }, {
    name: 'June',
    value: {
      x: 81,
      y: 3.9
    }
  }, {
    name: 'July',
    value: {
      x: 33,
      y: 4.1
    }
  }, {
    name: 'August',
    value: {
      x: 75,
      y: 4
    }
  }, {
    name: 'September',
    value: {
      x: 39,
      y: 7
    }
  }, {
    name: 'October',
    value: {
      x: 80,
      y: 2
    }
  }, {
    name: 'November',
    value: {
      x: 48,
      y: 6.2
    }
  }, {
    name: 'December',
    value: {
      x: 99,
      y: 4
    }
  }],
  name: 'Series 02'
}];

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('Scatter Plot API', () => {
  beforeEach(() => {
    scatterplotEl = null;
    scatterplotObj = null;
    document.body.insertAdjacentHTML('afterbegin', scatterplotHTML);
    scatterplotEl = document.body.querySelector('#scatterplot-example');

    scatterplotObj = new Line(scatterplotEl, { type: 'scatterplot', dataset, isScatterPlot: true });
  });

  afterEach(() => {
    scatterplotObj.destroy();
    cleanup();
  });

  it('should be defined on jQuery object', () => {
    expect(scatterplotObj).toBeTruthy();
  });

  it('should render plots', () => {
    expect(document.body.querySelectorAll('.symbol').length).toEqual(26);
  });

  it('should destroy chart', () => {
    scatterplotObj.destroy();

    const chartSymbols = document.body.querySelector('.symbol');

    expect(chartSymbols).toBeFalsy();
    expect(document.body.querySelectorAll('.symbol').length).toEqual(0);
  });

  it('should fire contextmenu event', () => {
    const callback = jest.fn();
    $(scatterplotEl).on('contextmenu', callback);
    $(scatterplotEl).on('contextmenu', (e, el, d) => {
      expect(d.value).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('[data-group-id="0"] .symbol'));

    expect(callback).toHaveBeenCalled();
  });
});
