import { cleanup } from '../../helpers/func-utils';
import { Hierarchy } from '../../../src/components/hierarchy/hierarchy';

const hierarchyHTML = require('../../../app/views/components/hierarchy/example-stacked.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');
const data = require('../../../app/data/hc-john-randolph.json');

const legendData = [
  { value: 'FT', label: 'Full Time' },
  { value: 'PT', label: 'Part Time' },
  { value: 'C', label: 'Contractor' },
  { value: 'O', label: 'Open Position' }
];

let hierarchyEl;
let hierarchyAPI;
let svgEl;
const hierarchyId = '#hierarchy';

describe('Hierarchy Stacked API', () => {
  beforeEach(() => {
    hierarchyEl = null;
    hierarchyAPI = null;
    svgEl = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', hierarchyHTML);

    svgEl = document.body.querySelector('.svg-icons');
    hierarchyEl = document.body.querySelector(hierarchyId);

    hierarchyAPI = new Hierarchy(hierarchyEl, {
      templateId: 'hierarchyChartTemplate',
      legendKey: 'employmentType',
      legend: legendData,
      dataset: [data],
      layout: 'stacked'
    });

    $('.hierarchy').data('hierarchy', hierarchyAPI);
  });

  afterEach(() => {
    svgEl.parentNode.removeChild(svgEl);
    hierarchyEl.parentNode.removeChild(hierarchyEl);

    cleanup(['.svg-icons', '#hierarchy', '#hierarchy-init-script', '.hierarchy']);

    if (hierarchyAPI) {
      hierarchyAPI.destroy();
    }
  });

  it('Can be invoked', () => {
    expect(hierarchyAPI).toEqual(jasmine.any(Object));
  });

  it('Can select a leaf', () => {
    hierarchyAPI.selectLeaf('3');

    const nodes = document.body.querySelectorAll('.leaf');

    expect(nodes[2]).toHaveClass('is-selected');
  });

  it('Can be empty', () => {
    hierarchyAPI.destroy();
    hierarchyAPI = new Hierarchy(hierarchyEl, {
      dataset: []
    });

    expect(document.body.querySelector('.icon-empty-state')).toExist();
    expect(hierarchyEl.classList.contains('empty-message')).toBeTruthy();
  });

  it('Can render a legend', () => {
    expect(document.body.querySelectorAll('legend li').length).toEqual(4);
    expect(document.body.querySelector('legend li').innerText.trim()).toEqual('Full Time');
  });

  it('Should not trigger collapsed function when using stacked layout', () => {
    const collapseButtons = document.body.querySelectorAll('.btn-collapse');
    const spyEvent = spyOnEvent(collapseButtons[1], 'click');
    const collapseFunction = spyOn(hierarchyAPI, 'collapse');

    collapseButtons[1].click();
    collapseFunction.and.callThrough();

    expect(spyEvent).toHaveBeenTriggered();

    // Should not trigger collapsed function when using stacked layout
    expect(collapseFunction.calls.count()).toEqual(0);
  });

  it('Can be destroyed', () => {
    hierarchyAPI.destroy();

    expect($(hierarchyEl).data('hierarchy')).toBeFalsy();
  });
});
