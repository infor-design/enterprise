import { Hierarchy } from '../../../src/components/hierarchy/hierarchy';

const hierarchyHTML = require('../../../app/views/components/hierarchy/example-index.html');
const svg = require('../../../src/components/icons/svg.html');
const data = require('../../../app/data/orgstructure.json');

const legendData = [
  { value: 'FT', label: 'Full Time' },
  { value: 'PT', label: 'Part Time' },
  { value: 'C', label: 'Contractor' },
];

let hierarchyEl;
let hierarchyAPI;
let svgEl;
const hierarchyId = '#hierarchy';

describe('hierarchy API', () => {
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
      legendKey: 'EmploymentType',
      legend: legendData,
      dataset: data
    });
  });

  afterEach(() => {
    hierarchyAPI.destroy();
    svgEl.parentNode.removeChild(svgEl);
    hierarchyEl.parentNode.removeChild(hierarchyEl);
  });

  it('Can be invoked', () => {
    expect(hierarchyAPI).toEqual(jasmine.any(Object));
  });

  it('Can correctly draw the hierarchy', () => {
    const nodes = document.body.querySelectorAll('.leaf');

    expect(nodes.length).toEqual(27);
    expect(nodes[0].innerText.replace(/(\r\n\t|\n|\r\t|Expand\/Collapse)/gm, '')).toEqual('Jonathan CargillDirectorFT');
    expect(nodes[1].innerText.replace(/(\r\n\t|\n|\r\t|Expand\/Collapse)/gm, '')).toEqual('Kaylee EdwardsRecords ManagerFT');
    expect(nodes[2].innerText.replace(/(\r\n\t|\n|\r\t|Expand\/Collapse)/gm, '')).toEqual('Tony ClevelandRecords ClerkC');
    expect(nodes[3].innerText.replace(/(\r\n\t|\n|\r\t|Expand\/Collapse)/gm, '')).toEqual('Julie DawesRecords ClerkPT');
    expect(nodes[4].innerText.replace(/(\r\n\t|\n|\r\t|Expand\/Collapse)/gm, '')).toEqual('Richard FairbanksRecords ClerkFT');
    expect(nodes[5].innerText.replace(/(\r\n\t|\n|\r\t|Expand\/Collapse)/gm, '')).toEqual('Jason AyersHR ManagerFT');
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
    expect(document.body.querySelectorAll('legend li').length).toEqual(3);
    expect(document.body.querySelector('legend li').innerText).toEqual('Full Time');
  });

  it('Can be destroyed', () => {
    hierarchyAPI.destroy();

    expect($(hierarchyEl).data('hierarchy')).toBeFalsy();
  });
});
