/**
 * @jest-environment jsdom
 */
import { Hierarchy } from '../../../src/components/hierarchy/hierarchy';
import { cleanup } from '../../helpers/func-utils';

const hierarchyHTML = '<figure class="hierarchy" id="hierarchy"></figure>';
const data = require('../../../app/data/orgstructure-original.json');

const legendData = [
  { value: 'FT', label: 'Full Time' },
  { value: 'PT', label: 'Part Time' },
  { value: 'C', label: 'Contractor' },
];

let hierarchyEl;
let hierarchyAPI;
const hierarchyId = '#hierarchy';
require('../../../src/components/icons/icons.jquery.js');

describe('Hierarchy API', () => {
  beforeEach(() => {
    hierarchyEl = null;
    hierarchyAPI = null;

    document.body.insertAdjacentHTML('afterbegin', hierarchyHTML);

    hierarchyEl = document.body.querySelector(hierarchyId);

    hierarchyAPI = new Hierarchy(hierarchyEl, {
      templateId: 'hierarchyChartTemplate',
      legendKey: 'EmploymentType',
      legend: legendData,
      dataset: data
    });
  });

  afterEach(() => {
    cleanup();
    hierarchyAPI?.destroy();
  });

  it.skip('Can be invoked', () => {
    expect(hierarchyAPI).toBeTruthy();
  });

  it.skip('Can be empty', () => {
    hierarchyAPI?.destroy();
    hierarchyAPI = new Hierarchy(hierarchyEl, {
      dataset: []
    });

    expect(document.body.querySelector('.icon-empty-state')).toExist();
    expect(hierarchyEl.classList.contains('empty-message')).toBeTruthy();
  });

  it.skip('Can render a legend', () => {
    expect(document.body.querySelectorAll('legend li').length).toEqual(3);
    expect(document.body.querySelector('legend li').innerText.trim()).toEqual('Full Time');
  });

  it.skip('Can be destroyed', () => {
    hierarchyAPI?.destroy();

    expect($(hierarchyEl).data('hierarchy')).toBeFalsy();
  });
});
