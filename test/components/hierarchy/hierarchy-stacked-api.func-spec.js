import { Hierarchy } from '../../../src/components/hierarchy/hierarchy';

const hierarchyHTML = require('../../../app/views/components/hierarchy/example-stacked.html');
const svg = require('../../../src/components/icons/svg.html');
const data = require('../../../app/data/hc-charles-phillips.json');

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
      legendKey: 'employmentType',
      legend: legendData,
      dataset: data,
      layout: 'stacked'
    });

    $('.hierarchy').data('hierarchy', hierarchyAPI);
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
    expect(nodes.length).toEqual(3);
    expect(nodes[0]).toHaveClass('is-selected');

    const actionMenuButtons = document.body.querySelectorAll('.btn-actions');
    expect(actionMenuButtons.length).toEqual(3);

    const collapseButtons = document.body.querySelectorAll('.btn-collapse');
    expect(collapseButtons.length).toEqual(3);
    expect(collapseButtons[0]).toHaveClass('btn-hidden');
  });

  it('Can select a leaf', () => {
    hierarchyAPI.selectLeaf('3');

    const nodes = document.body.querySelectorAll('.leaf');
    expect(nodes[2]).toHaveClass('is-selected');
  });

  it('Can update actions menu', () => {
    const actionMenuButtons = document.body.querySelectorAll('.btn-actions');
    const nodes = document.body.querySelectorAll('.leaf');
    const mockEventInfo = {
      data: $(nodes[2]).data(),
      targetInfo: { target: actionMenuButtons[2] }
    };
    const newActions = [{ value: 'Delete' }, { value: 'Move' }];

    hierarchyAPI.updateActions(mockEventInfo, newActions);
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
    expect(document.body.querySelector('legend li').innerText).toEqual('Full Time');
  });

  it('Collapse button should not execute collapse() function', () => {
    const collapseButtons = document.body.querySelectorAll('.btn-collapse');
    const spyEvent = spyOnEvent(collapseButtons[1], 'click');
    const collapseFunction = spyOn(hierarchyAPI, 'collapse');

    collapseButtons[1].click();
    collapseFunction.and.callThrough();

    expect(spyEvent).toHaveBeenTriggered();

    // Should not trigger collapsed function when using stacked layout
    expect(collapseFunction.calls.count()).toEqual(0);
  });

  it('Can build the actions menu', () => {
    const actionMenuButtons = document.body.querySelectorAll('.btn-actions');
    const spyEvent = spyOnEvent(actionMenuButtons[1], 'mouseup');
    const buildActionsMenuFunction = spyOn(hierarchyAPI, 'buildActionsMenu');

    $(actionMenuButtons[1]).trigger('mouseup');
    buildActionsMenuFunction.and.callThrough();

    expect(spyEvent).toHaveBeenTriggered();
    expect(buildActionsMenuFunction).toHaveBeenCalledTimes(1);
  });

  it('Can be destroyed', () => {
    hierarchyAPI.destroy();

    expect($(hierarchyEl).data('hierarchy')).toBeFalsy();
  });
});
