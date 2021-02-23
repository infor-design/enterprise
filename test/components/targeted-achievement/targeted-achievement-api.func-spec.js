import { CompletionChart } from '../../../src/components/completion-chart/completion-chart';
import { cleanup } from '../../helpers/func-utils';

const targetedHTML = require('../../../app/views/components/targeted-achievement/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let targetedEl;
let targetedObj;
const dataset = [{
  data: [{
    name: { text: 'Label A' },
    completed: { text: '50K of 250K', value: 50000, format: '.2s', color: 'primary' },
    remaining: { value: 20000, format: '.2s', text: ' To Target' },
    total: { value: 250000, format: '.2s' },
  }]
}];

describe('Targeted Achievement API', () => {
  beforeEach(() => {
    targetedObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', targetedHTML);
    targetedEl = document.querySelector('#example-1');
    targetedObj = new CompletionChart(targetedEl, { dataset, type: 'targeted-achievement' });
  });

  afterEach(() => {
    targetedObj.destroy();

    cleanup([
      '.svg-icons',
      '.row'
    ]);
  });

  it('Should be defined on jQuery object', () => {
    expect(targetedObj).toEqual(jasmine.any(Object));
  });

  it('Should be able to destroy', () => {
    targetedObj.destroy();

    expect(document.querySelectorAll('.target').length).toEqual(0);
    expect(document.querySelectorAll('.total').length).toEqual(0);
    expect(document.querySelectorAll('.completed').length).toEqual(0);
    expect(document.querySelectorAll('.completed-label').length).toEqual(0);
  });

  it('Should be able to render', () => {
    expect(document.querySelectorAll('.target').length).toEqual(1);
    expect(document.querySelectorAll('.total').length).toEqual(2);
    expect(document.querySelectorAll('.completed').length).toEqual(1);
    expect(document.querySelectorAll('.completed-label').length).toEqual(1);
    expect(document.querySelector('.name').innerText).toEqual('Label A');
    expect(document.querySelector('.completed-label').innerText).toEqual('50K of 250K');
    expect(document.querySelector('.total').innerText).toEqual('20k To Target');
  });

  it('Should be able to update', () => {
    const dataset1 = [{
      data: [{
        name: { text: 'Label B' },
        completed: { text: '2K of 25K', value: 2000, format: '.0s', color: 'primary' },
        remaining: { value: 2000, format: '.0s', text: ' To Target' },
        total: { value: 25000, format: '.0s' },
      }]
    }];

    targetedObj.updated({ dataset: dataset1 });

    expect(document.querySelector('.name').innerText).toEqual('Label B');
    expect(document.querySelector('.completed-label').innerText).toEqual('2K of 25K');
    expect(document.querySelector('.total').innerText).toEqual('2k To Target');
  });
});
