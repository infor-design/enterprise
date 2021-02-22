import { Tree } from '../../../src/components/tree/tree';

const treeHTML = require('../../../app/views/components/tree/test-select-event.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

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
let svgEl;
let treeObj;

describe('Tree Methods', () => {
  beforeEach(() => {
    treeEl = null;
    svgEl = null;
    treeObj = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', treeHTML);
    treeEl = document.body.querySelector('.tree[role="tree"]');
    svgEl = document.body.querySelector('.svg-icons');
    treeEl.classList.add('no-init');
    treeObj = new Tree('#json-tree', { dataset: sampleData });
  });

  afterEach(() => {
    treeObj.destroy();
    treeEl.parentNode.removeChild(treeEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should trigger "unselected" event', (done) => {
    const spyEvent = spyOnEvent('#json-tree', 'unselected');
    treeObj.unSelectedNode($('#node2'));

    setTimeout(() => {
      expect(spyEvent).toHaveBeenTriggered();
      done();
    }, 300);
  });

  it('Should trigger "selected" event', (done) => {
    const spyEvent = spyOnEvent('#json-tree', 'selected');
    treeObj.selectNodeById('node1');

    setTimeout(() => {
      expect(spyEvent).toHaveBeenTriggered();
      done();
    }, 300);
  });
});
