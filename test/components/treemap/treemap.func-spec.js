import { Treemap } from '../../../src/components/treemap/treemap';
import { cleanup } from '../../helpers/func-utils';

require('../../../src/components/locale/cultures/en-US.js');

const treemapHTML = require('../../../app/views/components/treemap/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');
const data = require('../../../app/data/storage-usage.json');
const dataUpdate = require('../../../app/data/file-usage.json');

let treemapEl;
let treemapAPI;
const treemapId = '#treemap-chart-example';

describe('Treemap API', () => {
  const Locale = window.Soho.Locale;

  beforeEach(() => {
    Locale.set('en-US');

    treemapEl = null;
    treemapAPI = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
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
    expect(treemapAPI).toEqual(jasmine.any(Object));
  });

  it('Can correctly calculate the treemap', () => {
    const nodes = document.body.querySelectorAll('.chart-treemap-node');

    expect(nodes.length).toEqual(7);
    expect(nodes[0].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('JSON28%');
    expect(nodes[1].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('PDF18%');
    expect(nodes[2].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('BOD8%');
    expect(nodes[3].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('TXT8%');
    expect(nodes[4].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('CSV17%');
    expect(nodes[5].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('Assets7%');
    expect(nodes[6].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('Others14%');
    expect(document.body.querySelector('.chart-treemap-title').innerText).toEqual('Storage Utilization (78 GB)');
  });

  it('Should trigger rendered', () => {
    treemapAPI.destroy();

    const spyEvent = spyOnEvent(treemapId, 'rendered');
    treemapAPI = new Treemap(treemapEl, {
      dataset: data
    });

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Can be updated', () => {
    treemapAPI.updated({ dataset: dataUpdate });
    const nodes = document.body.querySelectorAll('.chart-treemap-node');

    expect(nodes.length).toEqual(5);
    expect(nodes[0].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('JSON25%');
    expect(nodes[1].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('PDF22%');
    expect(nodes[2].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('BOD9%');
    expect(nodes[3].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('TXT7%');
    expect(nodes[4].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('CSV36%');
    expect(document.body.querySelector('.chart-treemap-title').innerText).toEqual('File Utilization (45 GB)');
  });

  it('Can be empty', () => {
    treemapAPI.destroy();
    treemapAPI = new Treemap(treemapEl, {
      dataset: []
    });

    expect(document.body.querySelector('.icon-empty-state')).toExist();
    expect(treemapEl.classList.contains('empty-message')).toBeTruthy();
  });

  it('Can disable labels', () => {
    treemapAPI.destroy();

    treemapAPI = new Treemap(treemapEl, {
      dataset: data,
      showLabel: false
    });

    const nodes = document.body.querySelectorAll('.chart-treemap-node');

    expect(nodes[0].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('JSON');
  });

  it('Can format labels', () => {
    treemapAPI.destroy();

    treemapAPI = new Treemap(treemapEl, {
      dataset: data,
      labelFormatter: '.2'
    });

    const nodes = document.body.querySelectorAll('.chart-treemap-node');

    expect(nodes[0].innerText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('JSON0.28');
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
