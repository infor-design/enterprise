import { Column } from '../../../src/components/column/column';

const areaHTML = require('../../../app/views/components/column/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let columnEl;
let svgEl;
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

describe('Column Chart API', () => {
  beforeEach((done) => {
    columnEl = null;
    svgEl = null;
    columnObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', areaHTML);
    columnEl = document.body.querySelector('#column-bar-example');
    svgEl = document.body.querySelector('.svg-icons');

    columnObj = new Column(columnEl, { type: 'column', dataset, animate: false });
    setTimeout(done());
  });

  afterEach(() => {
    columnObj.destroy();
    svgEl.parentNode.removeChild(svgEl);
    columnEl.parentNode.removeChild(columnEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should show on page', () => {
    expect(document.body.querySelectorAll('.bar').length).toEqual(7);
    expect(document.body.querySelector('.x.axis .tick:nth-of-type(1) text').innerHTML).toEqual('Auto');
    expect(document.body.querySelector('.x.axis .tick:nth-of-type(2) text').innerHTML).toEqual('Dist');
    expect(document.body.querySelector('.x.axis .tick:nth-of-type(3) text').innerHTML).toEqual('Equip');
    expect(document.body.querySelector('.x.axis .tick:nth-of-type(4) text').innerHTML).toEqual('Fash');
    expect(document.body.querySelector('.x.axis .tick:nth-of-type(5) text').innerHTML).toEqual('Food');
    expect(document.body.querySelector('.x.axis .tick:nth-of-type(6) text').innerHTML).toEqual('Health');
    expect(document.body.querySelector('.x.axis .tick:nth-of-type(7) text').innerHTML).toEqual('Other');
  });

  it('Should render selected dot', () => {
    expect(document.body.querySelector('.x.axis .tick:nth-of-type(1)').style.fontWeight).toEqual('bolder');
    expect(document.body.querySelector('.bar.series-0').classList.contains('is-selected')).toBeTruthy();
  });

  it('Should be able to format axis', () => {
    columnObj.destroy();
    columnObj = new Column(columnEl, { type: 'column', dataset, animate: false, formatterString: '.3f' });

    expect(document.body.querySelectorAll('.y.axis .tick text')[0].innerHTML).toEqual('0');
    expect(document.body.querySelectorAll('.y.axis .tick text')[1].innerHTML).toEqual('10');
    expect(document.body.querySelectorAll('.y.axis .tick text')[2].innerHTML).toEqual('20');
    expect(document.body.querySelectorAll('.y.axis .tick text')[3].innerHTML).toEqual('30');
    expect(document.body.querySelectorAll('.y.axis .tick text')[4].innerHTML).toEqual('40');
    expect(document.body.querySelectorAll('.y.axis .tick text')[5].innerHTML).toEqual('50');
    expect(document.body.querySelectorAll('.y.axis .tick text')[6].innerHTML).toEqual('60');
    expect(document.body.querySelectorAll('.y.axis .tick text')[7].innerHTML).toEqual('70');
  });

  it('Should be able to get the get and set the selected line', () => {
    // Use group "name" to select
    let options = {
      fieldName: 'name',
      fieldValue: 'Equipment'
    };
    columnObj.setSelected(options);

    expect(columnObj.getSelected()[0].data.value).toEqual(14);
    expect(columnObj.getSelected()[0].data.name).toEqual('Equipment');

    columnObj.toggleSelected(options);

    // Use groupIndex to select
    options = { index: 2 };
    columnObj.setSelected(options);

    expect(columnObj.getSelected()[0].data.value).toEqual(14);
    expect(columnObj.getSelected()[0].data.name).toEqual('Equipment');

    columnObj.toggleSelected(options);
  });
});
