/**
 * @jest-environment jsdom
 */
import { cleanup } from '../../helpers/func-utils';
import { Hierarchy } from '../../../src/components/hierarchy/hierarchy';

const hierarchyHTML = '<figure class="hierarchy" id="hierarchy"></figure>';
const data = require('../../../app/data/hc-john-randolph.json');

require('../../../src/components/icons/icons.jquery');

const legendData = [
  { value: 'FT', label: 'Full Time' },
  { value: 'PT', label: 'Part Time' },
  { value: 'C', label: 'Contractor' },
  { value: 'O', label: 'Open Position' }
];

let hierarchyEl;
let hierarchyAPI;
const hierarchyId = '#hierarchy';

describe.skip('Hierarchy Stacked API', () => {
  beforeEach(() => {
    hierarchyEl = null;
    hierarchyAPI = null;

    document.body.insertAdjacentHTML('afterbegin', hierarchyHTML);
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
    cleanup();

    if (hierarchyAPI) {
      hierarchyAPI?.destroy();
    }
  });

  it('Can be invoked', () => {
    expect(hierarchyAPI).toBeTruthy();
  });

  it('Can select a leaf', () => {
    hierarchyAPI.selectLeaf('3');

    const nodes = document.body.querySelectorAll('.leaf');

    expect(nodes[2]).toHaveClass('is-selected');
  });

  it('Can be empty', () => {
    hierarchyAPI?.destroy();
    hierarchyAPI = new Hierarchy(hierarchyEl, {
      dataset: []
    });

    expect(document.body.querySelector('.icon-empty-state')).toBeTruthy();
    expect(hierarchyEl.classList.contains('empty-message')).toBeTruthy();
  });

  it('Can render a legend', () => {
    expect(document.body.querySelectorAll('legend li').length).toEqual(4);
    expect(document.body.querySelector('legend li').textContent.trim()).toEqual('Full Time');
  });

  it('should not trigger collapsed function when using stacked layout', () => {
    const collapseButtons = document.body.querySelectorAll('.btn-collapse');
    const callback = jest.fn();
    $(collapseButtons[1]).on('click', callback);

    const callback2 = jest.fn();
    $(hierarchyAPI).on('collapse', callback2);

    collapseButtons[1].click();
    expect(callback).toHaveBeenCalled();

    // Should not trigger collapsed function when using stacked layout
    expect(callback2).toHaveBeenCalled();
  });

  it('Can be destroyed', () => {
    hierarchyAPI?.destroy();

    expect($(hierarchyEl).data('hierarchy')).toBeFalsy();
  });
});
