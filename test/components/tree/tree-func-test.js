/**
 * @jest-environment jsdom
 */
import { Tree } from '../../../src/components/tree/tree';
import { cleanup } from '../../helpers/func-utils';

const treeHTML = `<div class="two-column">

  <nav class="sidebar scrollable-y">
    <div class="content darker">

      <ul role="tree" aria-label="Asset Types" class="tree">
        <li>
            <a id="home" href="#">Home</a>
        </li>
        <li><a id="about-us" href="#">About Us</a></li>
        <li class="is-open mycustom">
            <a id="public-folders" href="#">Public Folders</a>
            <ul class="is-open root">
              <li class="is-open">
                  <a id="leadership" href="#">Leadership</a>
                  <ul class="is-open">
                    <li>
                      <a href="#">Leadership</a>
                    </li>
                    <li>
                      <a id="history" href="#" class="is-disabled">History</a>
                    </li>
                    <li>
                      <a id="careers-last" href="#">Careers last</a>
                    </li>
                  </ul>
              </li>
              <li><a id="history2" href="#">History2</a></li>
              <li><a id="careers" href="#">Careers</a></li>
            </ul>
        </li>
        <li>
            <a id="icons" href="#">Icons</a>
            <ul class="root">
              <li>
                <a id="audio" href="#" class="icon-tree-audio">Audio</a>
              </li>
              <li>
                <a id="avi" href="#" class="icon-tree-avi">Avi</a>
              </li>
              <li>
                <a id="bmp" href="#" class="icon-tree-bmp">Bmp</a>
              </li>
              <li>
                <a id="chart" href="#" class="icon-tree-chart">Chart</a>
              </li>
              <li>
                <a id="code" href="#" class="icon-tree-code">Code</a>
              </li>
              <li>
                <a id="csv" href="#" class="icon-tree-csv">Csv</a>
              </li>
              <li>
                <a id="doc" href="#" class="icon-tree-doc">Doc</a>
              </li>
              <li>
                <a id="excel" href="#" class="icon-tree-excel">Excel</a>
              </li>
              <li>
                <a id="expenses" href="#" class="icon-tree-expenses">Expenses</a>
              </li>
              <li>
                <a id="gif" href="#" class="icon-tree-gif">Gif</a>
              </li>
              <li>
                <a id="img" href="#" class="icon-tree-image">Image</a>
              </li>
              <li>
                <a id="jpg" href="#" class="icon-tree-jpg">Jpg</a>
              </li>
              <li>
                <a id="link" href="#" class="icon-tree-link">Link</a>
              </li>
              <li>
                <a id="mail" href="#" class="icon-tree-mail">Mail</a>
              </li>
              <li>
                <a id="mp3" href="#" class="icon-tree-mp3">Mp3</a>
              </li>
              <li>
                <a id="msg" href="#" class="icon-tree-msg">Msg</a>
              </li>
              <li>
                <a id="pdf" href="#" class="icon-tree-pdf">Pdf</a>
              </li>
              <li>
                <a id="png" href="#" class="icon-tree-png">Png</a>
              </li>
              <li>
                <a id="ppt" href="#" class="icon-tree-ppt">Ppt</a>
              </li>
              <li>
                <a id="prj" href="#" class="icon-tree-prj">Prj</a>
              </li>
              <li>
                <a id="psd" href="#" class="icon-tree-psd">Psd</a>
              </li>
              <li>
                <a id="pub" href="#" class="icon-tree-pub">Pub</a>
              </li>
              <li>
                <a id="rar" href="#" class="icon-tree-rar">Rar</a>
              </li>
              <li>
                <a id="text" href="#" class="icon-tree-text">Text</a>
              </li>
              <li>
                <a id="tif" href="#" class="icon-tree-tif">Tif</a>
              </li>
              <li>
                <a id="video" href="#" class="icon-tree-video">Video</a>
              </li>
              <li>
                <a id="vis" href="#" class="icon-tree-vis">Vis</a>
              </li>
              <li>
                <a id="word" href="#" class="icon-tree-word">Word</a>
              </li>
              <li>
                <a id="xls" href="#" class="icon-tree-xls">Xls</a>
              </li>
              <li>
                <a id="xml" href="#" class="icon-tree-xml">Xml</a>
              </li>
              <li>
                <a id="zip" href="#" class="icon-tree-zip">Zip</a>
              </li>
            </ul>
        </li>

        <li>
          <a id="blog" href="#">Blog</a>
        </li>

        <li>
          <a id="contact" href="#">Contact</a>
        </li>
      </ul>

    </div>
  </nav>

  <section class="main scrollable-y">
    <div class="content">
    </div>
  </section>

</div>`;

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
    treeObj = new Tree(treeEl);
  });

  afterEach(() => {
    treeObj?.destroy();
    cleanup();
  });

  it('should initially select node', () => {
    treeObj.settings.dataset[0].selected = true;
    treeObj.initSelected();

    expect(treeEl.querySelector('a[role="treeitem"].is-selected')).toBeTruthy();
  });

  it('should sets the correct icon to use on a particular SVG element', () => {
    const svgFirst = treeEl.querySelector('a[role="treeitem"] .icon-tree');

    expect(svgFirst.querySelector('use').getAttribute('href')).toEqual('#icon-tree-node');

    treeObj.setTreeIcon($(svgFirst), 'icon-tree-image');

    expect(svgFirst.querySelector('use').getAttribute('href')).toEqual('#icon-tree-image');
  });

  it('should expand a collection of tree nodes', () => {
    const secondDir = treeEl.querySelectorAll('li.folder')[2];

    expect(secondDir.querySelectorAll('ul[role=group].is-open').length).toEqual(0);

    treeObj.expandAll($(secondDir.querySelector('ul[role=group]')));

    expect(secondDir.querySelectorAll('ul[role=group].is-open').length).toEqual(1);
  });

  it('should expand all tree nodes', (done) => {
    expect(treeEl.querySelectorAll('li.folder ul[role=group]').length).toEqual(3);
    expect(treeEl.querySelectorAll('li.folder.is-open ul[role=group].is-open').length).toEqual(2);
    expect(treeEl.querySelectorAll('li.folder.is-open a[aria-expanded="true"').length).toEqual(2);

    treeEl.querySelector('li.folder a[role="treeitem"]').click();

    setTimeout(() => {
      expect(treeEl.querySelectorAll('li.folder.is-open ul[role=group].is-open').length).toEqual(1);
      expect(treeEl.querySelectorAll('li.folder.is-open a[aria-expanded="true"').length).toEqual(1);
      treeObj.expandAll();
      setTimeout(() => {
        expect(treeEl.querySelectorAll('li.folder.is-open ul[role=group].is-open').length).toEqual(3);
        expect(treeEl.querySelectorAll('li.folder.is-open a[aria-expanded="true"').length).toEqual(3);
        done();
      }, 300);
    }, 300);
  });

  it('should collapse a collection of tree nodes', () => {
    const firstDir = treeEl.querySelectorAll('li.folder')[1];

    expect(firstDir.querySelectorAll('ul[role=group].is-open').length).toEqual(1);

    treeObj.collapseAll($(firstDir.querySelector('ul[role=group]')));

    expect(firstDir.querySelectorAll('ul[role=group].is-open').length).toEqual(0);
  });

  it('should collapse all tree nodes', (done) => {
    expect(treeEl.querySelectorAll('li.folder ul[role=group]').length).toEqual(3);
    expect(treeEl.querySelectorAll('li.folder.is-open ul[role=group].is-open').length).toEqual(2);
    expect(treeEl.querySelectorAll('li.folder.is-open a[aria-expanded="true"').length).toEqual(2);

    treeEl.querySelector('li.folder a[role="treeitem"]').click();

    setTimeout(() => {
      expect(treeEl.querySelectorAll('li.folder.is-open ul[role=group].is-open').length).toEqual(1);
      expect(treeEl.querySelectorAll('li.folder.is-open a[aria-expanded="true"').length).toEqual(1);
      treeObj.collapseAll();
      setTimeout(() => {
        expect(treeEl.querySelectorAll('li.folder.is-open ul[role=group].is-open').length).toEqual(0);
        expect(treeEl.querySelectorAll('li.folder.is-open a[aria-expanded="true"').length).toEqual(0);
        done();
      }, 300);
    }, 300);
  });

  it('should select a node specifically using its ID attribute', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');
    link.id = 'home';

    expect(link.classList.contains('is-selected')).toBeFalsy();

    treeObj.selectNodeById('home');
    link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-selected')).toBeTruthy();
  });

  it('should select a tree node by jquery-selector', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');
    const jquerySelector = 'a[role="treeitem"]:first';

    expect(link.classList.contains('is-selected')).toBeFalsy();

    treeObj.selectNodeByJquerySelector(jquerySelector);
    link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-selected')).toBeTruthy();
  });

  it('should select a tree node by jquery-object', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');
    const jqueryObject = $(link);

    expect(link.classList.contains('is-selected')).toBeFalsy();

    treeObj.selectNodeByJquerySelector(jqueryObject);
    link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-selected')).toBeTruthy();
  });

  it('should select a given node', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-selected')).toBeFalsy();

    treeObj.selectNode($(link));
    link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-selected')).toBeTruthy();
  });

  it('should deselect a given node', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');
    treeObj.selectNode($(link));
    link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-selected')).toBeTruthy();

    treeObj.unSelectedNode($(link));
    link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-selected')).toBeFalsy();
  });

  it('should select a given node when finished', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-selected')).toBeFalsy();

    treeObj.selectNodeFinish($(link));
    link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-selected')).toBeTruthy();
  });

  it('should set current node status for single selected', () => {
    const firstDir = treeEl.querySelector('li.folder');
    treeObj.selectNode($(firstDir.querySelector('a')));
    firstDir.classList.remove('is-selected');

    expect(firstDir.classList.contains('is-selected')).toBeFalsy();

    treeObj.setNodeStatus($(firstDir.querySelector('a')));

    expect(firstDir.classList.contains('is-selected')).toBeTruthy();
  });

  it('should set current node status for multiple selected', () => {
    treeObj.settings.dataset[2].children[0].children[0].selected = true;
    treeObj.initSelected();
    treeObj.settings.selectable = 'multiple';
    treeObj.settings.hideCheckboxes = false;
    treeObj.updated(treeObj.settings);
    const firstDir = treeEl.querySelector('li.folder');
    firstDir.classList.remove('is-partial');

    expect(firstDir.classList.contains('is-partial')).toBeFalsy();

    treeObj.setNodeStatus($(firstDir.querySelector('a')));

    expect(firstDir.classList.contains('is-partial')).toBeTruthy();
  });

  it('should get current node status for single selected', () => {
    const firstDir = treeEl.querySelector('li.folder');
    treeObj.selectNode($(firstDir.querySelector('a')));

    expect(treeObj.getSelectedStatus($(treeEl.querySelector('li.folder a')))).toEqual('mixed');
  });

  it('should get current node status for multiple selected', () => {
    treeObj.settings.dataset[2].children[0].children[0].selected = true;
    treeObj.initSelected();
    treeObj.settings.selectable = 'multiple';
    treeObj.settings.hideCheckboxes = false;
    treeObj.updated(treeObj.settings);

    expect(treeObj.getSelectedStatus($(treeEl.querySelector('li.folder a')))).toEqual('mixed');
  });

  it('should toggle its opposite form open/close to given node', () => {
    const firstDir = treeEl.querySelector('li.folder');

    expect(firstDir.classList.contains('is-open')).toBeTruthy();

    treeObj.toggleNode($(firstDir.querySelector('a')));

    expect(firstDir.classList.contains('is-open')).toBeFalsy();
  });

  it('should load given json data and update tree', () => {
    expect(treeEl.querySelectorAll('a[role="treeitem"]').length).toEqual(43);

    const dataset = [
      { id: 'node1', text: 'Node One' },
      { id: 'node2', text: 'Node Two' }
    ];
    treeObj.loadData(dataset);

    expect(treeEl.querySelectorAll('a[role="treeitem"]').length).toEqual(2);
  });

  it('should add given json data to dataset', () => {
    expect(treeObj.settings.dataset.length).toEqual(6);
    expect(treeObj.settings.dataset[0].text).toEqual('Home');
    expect(treeObj.settings.dataset[5].text).toEqual('Contact');

    treeObj.addToDataset({ id: 'node1', text: 'Node One' }, 'top');
    treeObj.addToDataset({ id: 'node2', text: 'Node Two' }, 'bottom');

    expect(treeObj.settings.dataset.length).toEqual(8);
    expect(treeObj.settings.dataset[0].text).toEqual('Node One');
    expect(treeObj.settings.dataset[7].text).toEqual('Node Two');
  });

  it('should find the node by id in dataset', () => {
    const data = { id: 'node1', text: 'Node One' };
    treeObj.addToDataset(data, 'bottom');

    expect(treeObj.settings.dataset.length).toEqual(7);
    expect(treeObj.settings.dataset[6].text).toEqual('Node One');

    expect(treeObj.findById('node1')).toEqual(data);
  });

  it('should find the node by id in dataset if selected', () => {
    const data = { id: 'node1', text: 'Node One' };
    treeObj.addToDataset(data, 'bottom');

    expect(treeObj.settings.dataset.length).toEqual(7);
    expect(treeObj.settings.dataset[6].text).toEqual('Node One');
    expect(treeObj.getNodeByIdIfSelected('node1')).toEqual(null);

    treeObj.settings.dataset[6].selected = true;

    expect(treeObj.getNodeByIdIfSelected('node1')).toEqual(data);
  });

  it('should get selected nodes', () => {
    expect(treeObj.getSelectedNodes().length).toEqual(0);

    treeObj.selectNode($(treeEl.querySelector('a[role="treeitem"]')));

    expect(treeObj.getSelectedNodes().length).toEqual(1);
  });

  it('should get next from given node', () => {
    const links = treeEl.querySelectorAll('a[role="treeitem"]');
    let next = treeObj.getNextNode($(links[0]));
    let text = next[0].querySelector('.tree-text').textContent;

    expect(text).toEqual('About Us');

    next = treeObj.getNextNode($(links[links.length - 2]));
    text = next[0].querySelector('.tree-text').textContent;

    expect(text).toEqual('Contact');

    next = treeObj.getNextNode($(links[links.length - 1]));

    expect(next.length).toEqual(0);
  });

  it('should get previous from given node', () => {
    const links = treeEl.querySelectorAll('a[role="treeitem"]');
    let previous = treeObj.getPreviousNode($(links[1]));
    let text = previous[0].querySelector('.tree-text').textContent;

    expect(text).toEqual('Home');

    previous = treeObj.getPreviousNode($(links[links.length - 1]));
    text = previous[0].querySelector('.tree-text').textContent;

    expect(text).toEqual('Blog');

    previous = treeObj.getPreviousNode($(links[0]));

    expect(previous.length).toEqual(0);
  });

  it('should add a node and markup at root', () => {
    let links = treeEl.querySelectorAll('a[role="treeitem"]');
    let text = links[links.length - 1].querySelector('.tree-text').textContent;

    expect(text).toEqual('Contact');

    treeObj.addNode({ text: 'New Item 1', id: 'new1' });
    links = treeEl.querySelectorAll('a[role="treeitem"]');
    text = links[links.length - 1].querySelector('.tree-text').textContent;

    expect(text).toEqual('New Item 1');
    expect(links[links.length - 1].parentNode.parentNode).toEqual(treeObj.element[0]);
  });

  it('should add a node and markup to parent id', () => {
    let links = treeEl.querySelectorAll('a[role="treeitem"]');
    let text = links[links.length - 1].querySelector('.tree-text').textContent;

    expect(text).toEqual('Contact');

    treeObj.addNode({ text: 'New Item 1', id: 'new1' });
    links = treeEl.querySelectorAll('a[role="treeitem"]');
    text = links[links.length - 1].querySelector('.tree-text').textContent;

    expect(text).toEqual('New Item 1');
    expect(links[links.length - 1].parentNode.parentNode).toEqual(treeObj.element[0]);

    treeObj.addNode({ text: 'New Item 1.2', parent: 'new1', disabled: true });
    links = treeEl.querySelectorAll('a[role="treeitem"]');
    text = links[links.length - 1].querySelector('.tree-text').textContent;
    const parent = links[links.length - 1].parentNode.parentNode.parentNode;
    const parentText = parent.querySelector('.tree-text').textContent;

    expect(text).toEqual('New Item 1.2');
    expect(parentText).toEqual('New Item 1');
    expect(parent.parentNode).toEqual(treeObj.element[0]);
  });

  it('should add a node and markup to bottom wrong id', () => {
    let links = treeEl.querySelectorAll('a[role="treeitem"]');
    let text = links[links.length - 1].querySelector('.tree-text').textContent;

    expect(text).toEqual('Contact');

    treeObj.addNode({ text: 'New Item 3', parent: 'xxx', id: 'new3' });
    links = treeEl.querySelectorAll('a[role="treeitem"]');
    text = links[links.length - 1].querySelector('.tree-text').textContent;

    expect(text).toEqual('New Item 3');
    expect(links[links.length - 1].parentNode.parentNode).toEqual(treeObj.element[0]);
  });

  it('should add a node and markup to parent jquery object', () => {
    let links = treeEl.querySelectorAll('a[role="treeitem"]');
    let text = links[links.length - 1].querySelector('.tree-text').textContent;

    expect(text).toEqual('Contact');

    treeObj.addNode({ text: 'New Item 1', id: 'new1' });
    links = treeEl.querySelectorAll('a[role="treeitem"]');
    text = links[links.length - 1].querySelector('.tree-text').textContent;

    expect(text).toEqual('New Item 1');
    expect(links[links.length - 1].parentNode.parentNode).toEqual(treeObj.element[0]);

    const parentJqueryObject = $('#new1');

    treeObj.addNode({ text: 'New Item 1.2', parent: parentJqueryObject });
    links = treeEl.querySelectorAll('a[role="treeitem"]');
    text = links[links.length - 1].querySelector('.tree-text').textContent;
    const parent = links[links.length - 1].parentNode.parentNode.parentNode;
    const parentText = parent.querySelector('.tree-text').textContent;

    expect(text).toEqual('New Item 1.2');
    expect(parentText).toEqual('New Item 1');
    expect(parent.parentNode).toEqual(treeObj.element[0]);
  });

  it('should add a node and markup as child', () => {
    let links = treeEl.querySelectorAll('a[role="treeitem"]');
    let text = links[0].querySelector('.tree-text').textContent;

    expect(text).toEqual('Home');

    treeObj.addAsChild({ text: 'New Item 1', id: 'new1' }, $(links[0].parentNode));
    links = treeEl.querySelectorAll('a[role="treeitem"]');
    text = links[1].querySelector('.tree-text').textContent;

    expect(text).toEqual('New Item 1');
    expect(links[1].parentNode.parentNode.previousElementSibling).toEqual(links[0]);
    expect(links[0].parentNode.parentNode).toEqual(treeObj.element[0]);
  });

  it('should add a node and markup as child nodes', () => {
    let links = treeEl.querySelectorAll('a[role="treeitem"]');
    let text = links[0].querySelector('.tree-text').textContent;

    expect(text).toEqual('Home');

    treeObj.addChildNodes({ children: [{ text: 'New Item 1', id: 'new1' }] }, $(links[0].parentNode));
    links = treeEl.querySelectorAll('a[role="treeitem"]');
    text = links[1].querySelector('.tree-text').textContent;

    expect(text).toEqual('New Item 1');
    expect(links[1].parentNode.parentNode.previousElementSibling).toEqual(links[0]);
    expect(links[0].parentNode.parentNode).toEqual(treeObj.element[0]);
  });

  it('should check for true value', () => {
    expect(treeObj.isTrue(false)).toEqual(false);
    expect(treeObj.isTrue('false')).toEqual(false);
    expect(treeObj.isTrue(true)).toEqual(true);
    expect(treeObj.isTrue('true')).toEqual(true);
  });

  it('should check for false value', () => {
    expect(treeObj.isFalse(false)).toEqual(true);
    expect(treeObj.isFalse('false')).toEqual(true);
    expect(treeObj.isFalse(true)).toEqual(false);
    expect(treeObj.isFalse('true')).toEqual(false);
  });

  it('should parse the boolean value', () => {
    expect(treeObj.parseBool(false)).toEqual(false);
    expect(treeObj.parseBool('false')).toEqual(false);
    expect(treeObj.parseBool(0)).toEqual(false);
    expect(treeObj.parseBool(true)).toEqual(true);
    expect(treeObj.parseBool('true')).toEqual(true);
    expect(treeObj.parseBool(1)).toEqual(true);
    expect(treeObj.parseBool(-1)).toEqual(true);
    expect(treeObj.parseBool('xxx')).toEqual(true);
  });

  it('should update given node text', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');
    let text = link.querySelector('.tree-text').textContent;

    expect(text).toEqual('Home');

    treeObj.updateNode({ node: $(link), text: 'Changed Item' });
    link = treeEl.querySelector('a[role="treeitem"]');
    text = link.querySelector('.tree-text').textContent;

    expect(text).toEqual('Changed Item');
  });

  it('should update given node disabled', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-disabled')).toBeFalsy();

    treeObj.updateNode({ node: $(link), disabled: true });
    link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-disabled')).toBeTruthy();
  });

  it('should update given node enabled', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-disabled')).toBeFalsy();

    treeObj.updateNode({ node: $(link), disabled: true });
    link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-disabled')).toBeTruthy();

    treeObj.updateNode({ node: $(link), enabled: true });
    link = treeEl.querySelector('a[role="treeitem"]');

    expect(link.classList.contains('is-disabled')).toBeFalsy();
  });

  it('should update given node icon', () => {
    const link = treeEl.querySelector('a[role="treeitem"]');
    const use = link.querySelector('.icon-tree use');

    expect(use.getAttribute('href')).toEqual('#icon-tree-node');

    treeObj.updateNode({ node: $(link), icon: 'icon-tree-image' });

    expect(use.getAttribute('href')).toEqual('#icon-tree-image');
  });

  it('should update given node badge', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');
    let badge = link.querySelector('.tree-badge');

    expect(badge).toBeFalsy();

    treeObj.updateNode({ node: $(link), badge: { text: 5, type: 'info' } });

    link = treeEl.querySelector('a[role="treeitem"]');
    badge = link.querySelector('.tree-badge');

    expect(badge).toBeTruthy();
    expect(badge.textContent).toEqual('5');
  });

  it('should update given node add children', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');
    let children = link.parentNode.querySelectorAll('a[role="treeitem"]');

    expect(children.length).toEqual(1);

    treeObj.updateNode({ node: $(link), children: [{ text: 'New Item 1', id: 'new1' }] });

    link = treeEl.querySelector('a[role="treeitem"]');
    children = link.parentNode.querySelectorAll('a[role="treeitem"]');

    expect(children.length).toEqual(2);
  });

  it('should update given node remove children', () => {
    let firstDir = treeEl.querySelectorAll('li')[2];
    let children = firstDir.querySelectorAll('a[role="treeitem"]');

    expect(children.length).toEqual(7);

    treeObj.updateNode({ node: $(firstDir), children: [] });

    firstDir = treeEl.querySelectorAll('li')[2];
    children = firstDir.querySelectorAll('a[role="treeitem"]');

    expect(children.length).toEqual(1);
  });

  it('should remove children from given node', () => {
    let firstDir = treeEl.querySelectorAll('li')[2];
    let children = firstDir.querySelectorAll('a[role="treeitem"]');

    expect(children.length).toEqual(7);

    treeObj.removeChildren({}, $(firstDir));

    firstDir = treeEl.querySelectorAll('li')[2];
    children = firstDir.querySelectorAll('a[role="treeitem"]');

    expect(children.length).toEqual(1);
  });

  it('should remove node from tree', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');
    let text = link.querySelector('.tree-text').textContent;

    expect(text).toEqual('Home');

    treeObj.removeNode($(link));
    link = treeEl.querySelector('a[role="treeitem"]');
    text = link.querySelector('.tree-text').textContent;

    expect(text).toEqual('About Us');
  });

  it('should convert file node to folder type', () => {
    let link = treeEl.querySelector('a[role="treeitem"]');
    let icon = link.querySelector('.icon-tree use').getAttribute('href');

    expect(icon).toEqual('#icon-tree-node');
    expect(link.parentNode.querySelectorAll('ul').length).toEqual(0);

    treeObj.convertFileToFolder($(link));

    link = treeEl.querySelector('a[role="treeitem"]');
    icon = link.querySelector('.icon-tree use').getAttribute('href');

    expect(icon).toEqual('#icon-closed-folder');
    expect(link.parentNode.querySelectorAll('ul').length).toEqual(1);
  });

  it('should convert folder node to file type', () => {
    let firstDir = treeEl.querySelectorAll('li')[2];
    let children = firstDir.querySelectorAll('a[role="treeitem"]');
    let link = firstDir.querySelector('a[role="treeitem"]');
    let icon = link.querySelector('.icon-tree use').getAttribute('href');

    expect(icon).toEqual('#icon-open-folder');
    expect(children.length).toEqual(7);

    treeObj.convertFolderToFile($(link));

    firstDir = treeEl.querySelectorAll('li')[2];
    children = firstDir.querySelectorAll('a[role="treeitem"]');
    link = firstDir.querySelector('a[role="treeitem"]');
    icon = link.querySelector('.icon-tree use').getAttribute('href');

    expect(icon).toEqual('#icon-tree-node');
    expect(children.length).toEqual(1);
  });

  it('should not detect any non-disabled tree nodes', () => {
    const count = treeEl.querySelectorAll('li a[role="treeitem"]').length;
    treeObj.disable();
    const countDisabled = treeEl.querySelectorAll('li a[role="treeitem"].is-disabled').length;

    expect(countDisabled).toEqual(count);
  });

  it('should not detect any disabled tree nodes', () => {
    treeObj.enable();
    const countDisabled = treeEl.querySelectorAll('li a[role="treeitem"].is-disabled').length;

    expect(countDisabled).toEqual(0);
  });

  it('should preserve and restore enablement states of all nodes', () => {
    const nodeArray = [];
    treeEl.querySelectorAll('li a[role="treeitem"]').forEach((node) => {
      nodeArray.push({ nodeId: node.id, state: node.classList.contains('is-disabled') ? 'disabled' : 'enabled' });
    });
    const preserveArray = treeObj.preserveEnablementState();

    expect(nodeArray.length).toEqual(preserveArray.length);
    for (let i = 0; i < nodeArray.length; i++) {
      expect(nodeArray[i].state).toBe(preserveArray[i].state);
    }

    treeObj.restoreEnablementState();
    const newNodeArray = [];
    treeEl.querySelectorAll('li a[role="treeitem"]').forEach((node) => {
      newNodeArray.push({ nodeId: node.id, state: node.classList.contains('is-disabled') ? 'disabled' : 'enabled' });
    });

    expect(nodeArray.length).toEqual(newNodeArray.length);
    for (let j = 0; j < nodeArray.length; j++) {
      expect(nodeArray[j].state).toBe(newNodeArray[j].state);
    }
  });
});
