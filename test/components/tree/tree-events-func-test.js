/**
 * @jest-environment jsdom
 */
import { Tree } from '../../../src/components/tree/tree';
import { cleanup } from '../../helpers/func-utils';

const treeHTML = `<div class="row top-padding">
  <div class="twelve columns">
    <ul role="tree" aria-label="Asset Types" class="tree" data-init="false" id="json-tree">
    </ul>
  </div>
</div>`;

const sampleData = [{
  id: 'node1',
  text: 'Node One',
  open: false,
  selected: false,
  href: '/somelink/',
  metadata: { fileType: 'doc' }
}, {
  id: 'node2',
  text: 'Node Two',
  open: true,
  selected: true,
  focus: true,
  children: [{
    id: 'node3',
    text: 'Node 2.1',
    metadata: { fileType: 'doc' }
  }, {
    id: 'node4',
    text: 'Node 2.2',
    children: [{
      id: 'node5',
      text: 'Node 2.2.1',
      icon: 'icon-tree-chart',
      children: [{
        id: 'node6',
        text: 'Node 2.2.1.1',
        icon: 'icon-tree-chart',
        metadata: { fileType: 'chart' }
      }]
    }]
  }]
}];

let treeEl;
let treeObj;

require('../../../src/components/icons/icons.jquery.js');

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('Tree Methods', () => {
  beforeEach(() => {
    treeEl = null;
    treeObj = null;

    document.body.insertAdjacentHTML('afterbegin', treeHTML);
    treeEl = document.body.querySelector('.tree[role="tree"]');
    treeEl.classList.add('no-init');
    treeObj = new Tree('#json-tree', { dataset: sampleData });
  });

  afterEach(() => {
    treeObj?.destroy();
    cleanup();
  });

  it('should trigger "unselected" event', (done) => {
    const callback = jest.fn();
    $('#json-tree').on('unselected', callback);

    treeObj.unSelectedNode($('#node2'));

    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      done();
    }, 300);
  });

  it('should trigger "selected" event', (done) => {
    const callback = jest.fn();
    $('#json-tree').on('selected', callback);

    treeObj.selectNodeById('node1');

    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      done();
    }, 300);
  });
});
