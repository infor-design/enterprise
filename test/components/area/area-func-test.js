/**
 * @jest-environment jsdom
 */
import { triggerContextmenu, cleanup } from '../../helpers/func-utils';
import { Line } from '../../../src/components/line/line';

const areaHTML = `<div class="row">
  <div class="two-thirds column">
      <div class="widget">
        <div class="widget-header">
          <h2 class="widget-title">Area Chart Title</h2>
        </div>
        <div class="widget-content">
          <div id="area-example" class="chart-container">
          </div>
        </div>
      </div>
  </div>
</div>`;

let areaEl;
let areaObj;
const dataset = [{
  data: [{
    name: 'Jan',
    value: 12
  }, {
    name: 'Feb',
    value: 11
  }, {
    name: 'Mar',
    value: 14,
    selected: true
  }],
  name: 'Component A',
  legendShortName: 'Comp A',
  legendAbbrName: 'A'
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
  }],
  name: 'Component B',
  legendShortName: 'Comp B',
  legendAbbrName: 'B'
}, {
  data: [{
    name: 'Jan',
    value: 32.12
  }, {
    name: 'Feb',
    value: 31
  }, {
    name: 'Mar',
    value: 34
  }],
  name: 'Component C',
  legendShortName: 'Comp C',
  legendAbbrName: 'C'
}];

const datasetFormat = [{
  data: [{
    name: 'Jan',
    value: 12.890
  }, {
    name: 'Feb',
    value: 11.6
  }, {
    name: 'Mar',
    value: 14.23
  }],
  name: 'Component A'
}, {
  data: [{
    name: 'Jan',
    value: 22.6666
  }, {
    name: 'Feb',
    value: 21.8888888884444
  }, {
    name: 'Mar',
    value: 24.48
  }],
  name: 'Component B'
}, {
  data: [{
    name: 'Jan',
    value: 32.8888888884444
  }, {
    name: 'Feb',
    value: 31.8888888884444
  }, {
    name: 'Mar',
    value: 34.34356
  }],
  name: 'Component C'
}];

describe('Area Chart API', () => {
  beforeEach(() => {
    areaObj = null;
    document.body.insertAdjacentHTML('afterbegin', areaHTML);
    areaEl = document.body.querySelector('#area-example');

    areaObj = new Line(areaEl, { type: 'area', dataset, animate: false, isArea: true });
  });

  afterEach(() => {
    areaObj?.destroy();
    cleanup();
  });

  it('should show on page', () => {
    expect(document.body.querySelectorAll('.dot').length).toEqual(9);
    expect(document.body.querySelectorAll('.line-group').length).toEqual(3);
  });

  it('should be able to format axis', () => {
    areaObj?.destroy();
    areaObj = new Line(areaEl, { type: 'area', isArea: true, dataset: datasetFormat, animate: false, formatterString: '$,.2f' });

    expect(document.body.querySelectorAll('.y.axis .tick text')[0].innerHTML).toEqual('0');
    expect(document.body.querySelectorAll('.y.axis .tick text')[1].innerHTML).toEqual('5');
    expect(document.body.querySelectorAll('.y.axis .tick text')[2].innerHTML).toEqual('10');
    expect(document.body.querySelectorAll('.y.axis .tick text')[3].innerHTML).toEqual('15');
    expect(document.body.querySelectorAll('.y.axis .tick text')[4].innerHTML).toEqual('20');
    expect(document.body.querySelectorAll('.y.axis .tick text')[5].innerHTML).toEqual('25');
    expect(document.body.querySelectorAll('.y.axis .tick text')[6].innerHTML).toEqual('30');
    expect(document.body.querySelectorAll('.y.axis .tick text')[7].innerHTML).toEqual('35');
  });

  it('should be able to get the get and set the selected line', () => {
    // Use group "name" to select
    let options = {
      groupName: 'name',
      groupValue: 'Component B'
    };
    areaObj.setSelected(options);

    expect(areaObj.getSelected()[0].data.data.length).toEqual(3);
    expect(areaObj.getSelected()[0].data.name).toEqual('Component B');

    // Use groupIndex to select
    options = {
      groupIndex: 0,
      fieldName: 'name',
      fieldValue: 'Feb'
    };
    areaObj.setSelected(options);

    expect(areaObj.getSelected()[0].data.value).toEqual(11);
    expect(areaObj.getSelected()[0].data.name).toEqual('Feb');

    areaObj.toggleSelected(options);

    expect(areaObj.getSelected().length).toEqual(0);

    // Use group index to select
    options = { groupIndex: 0 };
    areaObj.setSelected(options);

    expect(areaObj.getSelected()[0].data.data.length).toEqual(3);
    expect(areaObj.getSelected()[0].data.name).toEqual('Component A');

    // Use point index to select
    options = {
      groupIndex: 1,
      index: 0
    };
    areaObj.setSelected(options);

    expect(areaObj.getSelected()[0].data.value).toEqual(22);
    expect(areaObj.getSelected()[0].data.name).toEqual('Jan');

    // Use jQuery object to select
    options = { elem: $('#area-example').find('[data-group-id="1"]') };
    areaObj.setSelected(options);

    expect(areaObj.getSelected()[0].data.value).toEqual(22);
    expect(areaObj.getSelected()[0].data.name).toEqual('Jan');

    options = { elem: $('#area-example').find('[data-group-id="1"] .dot:eq(0)') };
    areaObj.setSelected(options);

    expect(areaObj.getSelected()[0].data.value).toEqual(22);
    expect(areaObj.getSelected()[0].data.name).toEqual('Jan');
  });

  it('should fire contextmenu event', () => {
    const callback = jest.fn();

    $(areaEl).on('contextmenu', callback);
    $(areaEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('[data-group-id="0"] .dot'));

    expect(callback).toHaveBeenCalled();
  });
});
