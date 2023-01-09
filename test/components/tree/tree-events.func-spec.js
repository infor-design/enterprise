import { Tree } from '../../../src/components/tree/tree';
import { cleanup } from '../../helpers/func-utils';

const treeHTML = require('../../../app/views/components/tree/test-select-event.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

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

describe('Tree Methods', () => {
  beforeEach(() => {
    treeEl = null;
    treeObj = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', treeHTML);
    treeEl = document.body.querySelector('.tree[role="tree"]');
    treeEl.classList.add('no-init');
    treeObj = new Tree('#json-tree', { dataset: sampleData });
  });

  afterEach(() => {
    treeObj.destroy();
    cleanup();
  });

  it('Should trigger "unselected" event', (done) => {
    const spyEvent = spyOnEvent('#json-tree', 'unselected');
    treeObj.unSelectedNode($('#node2'));

    setTimeout(() => {
      expect(spyEvent).toHaveBeenCalled();
      done();
    }, 300);
  });

  it('Should trigger "selected" event', (done) => {
    const spyEvent = spyOnEvent('#json-tree', 'selected');
    treeObj.selectNodeById('node1');

    setTimeout(() => {
      expect(spyEvent).toHaveBeenCalled();
      done();
    }, 300);
  });
});
