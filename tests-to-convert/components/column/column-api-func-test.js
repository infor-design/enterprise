/**
 * @jest-environment jsdom
 */
import { cleanup, triggerContextmenu } from '../../helpers/func-utils';
import { Column } from '../../../src/components/column/column';

const areaHTML = `
<div class="row">
  <div class="two-thirds column">
      <div class="widget">
        <div class="widget-header">
          <h2 class="widget-title">Column Chart Example</h2>
        </div>
        <div class="widget-content">
          <div id="column-bar-example" class="chart-container">
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

let columnEl;
let columnObj;
const dataset = [{
  data: [{
    name: 'Automotive',
    shortName: 'Auto',
    abbrName: 'A',
    value: 7,
    tooltip: 'Custom Tooltip - {{value}}',
    selected: true
  }, {
    name: 'Distribution',
    shortName: 'Dist',
    abbrName: 'D',
    value: 84.92903999999999
  }, {
    name: 'Equipment',
    shortName: 'Equip',
    abbrName: 'E',
    value: 14
  }, {
    name: 'Fashion',
    shortName: 'Fash',
    abbrName: 'F',
    value: 10
  }, {
    name: 'Food',
    shortName: 'Food',
    abbrName: 'F',
    value: 14
  }, {
    name: 'Healthcare',
    shortName: 'Health',
    abbrName: 'H',
    value: 8
  }, {
    name: 'Other',
    shortName: 'Other',
    abbrName: 'O',
    value: 7
  }]
}];

const groupedSettings = {
  type: 'column-grouped',
  dataset: [{
    data: [{
      name: 'Jan',
      value: 12
    }, {
      name: 'Feb',
      value: 11
    }, {
      name: 'Mar',
      value: 14
    }, {
      name: 'Apr',
      value: 10
    }, {
      name: 'May',
      value: 14
    }, {
      name: 'Jun',
      value: 8
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
    }, {
      name: 'May',
      value: 24
    }, {
      name: 'Jun',
      value: 28
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
    }, {
      name: 'May',
      value: 34
    }, {
      name: 'Jun',
      value: 38
    }],
    name: 'Component C'
  }]
};

const stackedSettings = {
  type: 'column-stacked',
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
    }, {
      name: 'May',
      value: 14
    }, {
      name: 'Jun',
      value: 8
    }, {
      name: 'Jul',
      value: 7
    }, {
      name: 'Aug',
      value: 10
    }, {
      name: 'Sep',
      value: 9
    }, {
      name: 'Oct',
      value: 8
    }, {
      name: 'Nov',
      value: 10
    }, {
      name: 'Dec',
      value: 6
    }],
    name: '2018'
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
    }, {
      name: 'May',
      value: 24
    }, {
      name: 'Jun',
      value: 28
    }, {
      name: 'Jul',
      value: 27
    }, {
      name: 'Aug',
      value: 20
    }, {
      name: 'Sep',
      value: 29
    }, {
      name: 'Oct',
      value: 28
    }, {
      name: 'Nov',
      value: 20
    }, {
      name: 'Dec',
      value: 26
    }],
    name: '2017'
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
    }, {
      name: 'May',
      value: 34
    }, {
      name: 'Jun',
      value: 38
    }, {
      name: 'Jul',
      value: 37
    }, {
      name: 'Aug',
      value: 30
    }, {
      name: 'Sep',
      value: 39
    }, {
      name: 'Oct',
      value: 38
    }, {
      name: 'Nov',
      value: 30
    }, {
      name: 'Dec',
      value: 36
    }],
    name: '2016'
  }]
};

describe('Column Chart API', () => {
  beforeEach((done) => {
    columnEl = null;
    columnObj = null;
    document.body.insertAdjacentHTML('afterbegin', areaHTML);
    columnEl = document.body.querySelector('#column-bar-example');

    columnObj = new Column(columnEl, { type: 'column', dataset: JSON.parse(JSON.stringify(dataset)), animate: false });
    setTimeout(done());
  });

  afterEach(() => {
    columnObj?.destroy();
    cleanup();
  });

  it('should show on page', () => {
    expect(document.body.querySelectorAll('.bar').length).toEqual(7);
    expect(document.body.querySelector('.x.axis .tick:nth-of-type(1) text').innerHTML).toEqual('A');
  });

  it.skip('Should render selected dot', (done) => {
    setTimeout(() => {
      document.body.querySelector('.x.axis .tick:nth-of-type(1)').click();
      expect(document.body.querySelector('.x.axis .tick:nth-of-type(1)').style.fontWeight).toEqual('bolder');
      expect(document.body.querySelector('.bar.series-0').classList.contains('is-selected')).toBeTruthy();
      done();
    }, 201);
  });

  it('should be able to format axis', () => {
    columnObj.destroy();
    columnObj = new Column(columnEl, { type: 'column', dataset: JSON.parse(JSON.stringify(dataset)), animate: false, formatterString: '.3f' });

    expect(document.body.querySelectorAll('.y.axis .tick text')[0].innerHTML).toEqual('0');
    expect(document.body.querySelectorAll('.y.axis .tick text')[1].innerHTML).toEqual('10');
    expect(document.body.querySelectorAll('.y.axis .tick text')[2].innerHTML).toEqual('20');
    expect(document.body.querySelectorAll('.y.axis .tick text')[3].innerHTML).toEqual('30');
    expect(document.body.querySelectorAll('.y.axis .tick text')[4].innerHTML).toEqual('40');
    expect(document.body.querySelectorAll('.y.axis .tick text')[5].innerHTML).toEqual('50');
    expect(document.body.querySelectorAll('.y.axis .tick text')[6].innerHTML).toEqual('60');
    expect(document.body.querySelectorAll('.y.axis .tick text')[7].innerHTML).toEqual('70');
  });

  it('should be able to get the get and set the selected line', (done) => {
    // Use group "name" to select
    let options = {
      fieldName: 'name',
      fieldValue: 'Equipment'
    };
    columnObj.setSelected(options);

    setTimeout(() => {
      expect(columnObj.getSelected()[0].data.value).toEqual(14);
      expect(columnObj.getSelected()[0].data.name).toEqual('Equipment');
      columnObj.toggleSelected(options);

      setTimeout(() => {
        options = { index: 2 }; // Use groupIndex to select
        columnObj.setSelected(options);

        setTimeout(() => {
          expect(columnObj.getSelected()[0].data.value).toEqual(14);
          expect(columnObj.getSelected()[0].data.name).toEqual('Equipment');
          columnObj.toggleSelected(options);
          done();
        }, 201);
      }, 201);
    }, 201);
  });

  it('should fire contextmenu event with column', () => {
    const callback = jest.fn();
    $(columnEl).on('contextmenu', callback);
    $(columnEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('.bar'));

    expect(callback).toHaveBeenCalled();
  });

  it('should fire contextmenu event with column grouped', () => {
    columnObj.destroy();
    columnObj = new Column(columnEl, groupedSettings);
    const callback = jest.fn();
    $(columnEl).on('contextmenu', callback);
    $(columnEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('.bar'));

    expect(callback).toHaveBeenCalled();
  });

  it('should fire contextmenu event with column stacked', () => {
    columnObj.destroy();
    columnObj = new Column(columnEl, stackedSettings);
    const callback = jest.fn();
    $(columnEl).on('contextmenu', callback);
    $(columnEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('.bar'));

    expect(callback).toHaveBeenCalled();
  });
});
