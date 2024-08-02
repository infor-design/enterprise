/**
 * @jest-environment jsdom
 */
import { Treemap } from '../../../src/components/treemap/treemap';
import { cleanup } from '../../helpers/func-utils';
import { Locale } from '../../../src/components/locale/locale';

Soho.Locale = Locale;

require('../../../src/components/locale/cultures/en-US.js');

const treemapHTML = `<div class="row">
  <div class="twelve columns">
      <div class="widget">
        <div class="widget-header">
          <h2 class="widget-title">Tree Map Example</h2>
        </div>
        <div class="widget-content">
          <div id="treemap-chart-example" class="chart-container" data-init="false">
          </div>
        </div>
      </div>
  </div>
</div>`;

const data = require('../../../app/data/storage-usage.json');
const dataUpdate = require('../../../app/data/file-usage.json');

let treemapEl;
let treemapAPI;
const treemapId = '#treemap-chart-example';

describe('Treemap API', () => {
  beforeEach(() => {
    Locale.set('en-US');

    treemapEl = null;
    treemapAPI = null;

    document.body.insertAdjacentHTML('afterbegin', treemapHTML);

    treemapEl = document.body.querySelector(treemapId);

    treemapAPI = new Treemap(treemapEl, {
      dataset: data
    });
  });

  afterEach(() => {
    treemapAPI.destroy();
    cleanup();
  });

  it('Can be invoked', () => {
    expect(treemapAPI).toBeTruthy();
  });

  it('Can correctly calculate the treemap', () => {
    const nodes = document.body.querySelectorAll('.chart-treemap-node');

    expect(nodes.length).toEqual(7);
    expect(nodes[0].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('JSON28%');
    expect(nodes[1].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('PDF18%');
    expect(nodes[2].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('BOD8%');
    expect(nodes[3].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('TXT8%');
    expect(nodes[4].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('CSV17%');
    expect(nodes[5].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('Assets7%');
    expect(nodes[6].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('Others14%');
    expect(document.body.querySelector('.chart-treemap-title').textContent.trim()).toEqual('Storage Utilization (78 GB)');
  });

  it('should trigger rendered', () => {
    treemapAPI.destroy();
    const callback = jest.fn();
    $(treemapId).on('rendered', callback);

    treemapAPI = new Treemap(treemapEl, {
      dataset: data
    });

    expect(callback).toHaveBeenCalled();
  });

  it('Can be updated', () => {
    treemapAPI.updated({ dataset: dataUpdate });
    const nodes = document.body.querySelectorAll('.chart-treemap-node');

    expect(nodes.length).toEqual(5);
    expect(nodes[0].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('JSON25%');
    expect(nodes[1].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('PDF22%');
    expect(nodes[2].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('BOD9%');
    expect(nodes[3].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('TXT7%');
    expect(nodes[4].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('CSV36%');
    expect(document.body.querySelector('.chart-treemap-title').textContent.trim()).toEqual('File Utilization (45 GB)');
  });

  it('Can be empty', () => {
    treemapAPI.destroy();
    treemapAPI = new Treemap(treemapEl, {
      dataset: []
    });

    expect(document.body.querySelector('.icon-empty-state')).toBeTruthy();
    expect(treemapEl.classList.contains('empty-message')).toBeTruthy();
  });

  it('Can disable labels', () => {
    treemapAPI.destroy();

    treemapAPI = new Treemap(treemapEl, {
      dataset: data,
      showLabel: false
    });

    const nodes = document.body.querySelectorAll('.chart-treemap-node');

    expect(nodes[0].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('JSON');
  });

  it('Can format labels', () => {
    treemapAPI.destroy();

    treemapAPI = new Treemap(treemapEl, {
      dataset: data,
      labelFormatter: '.2'
    });

    const nodes = document.body.querySelectorAll('.chart-treemap-node');

    expect(nodes[0].textContent.trim().replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('JSON0.28');
  });

  it('Can have no title labels', () => {
    treemapAPI.destroy();

    treemapAPI = new Treemap(treemapEl, {
      dataset: data,
      showTitle: false
    });

    expect(document.body.querySelector('.chart-treemap-title')).toBeNull();
  });

  it('Can be destroyed', () => {
    treemapAPI.destroy();

    expect($(treemapEl).data('treemap')).toBeFalsy();
  });
});
