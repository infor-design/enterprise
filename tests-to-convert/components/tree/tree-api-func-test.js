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

describe('Tree API', () => {
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

  it('should be defined on jQuery object', () => {
    expect(treeObj).toBeTruthy();
  });

  it('should update with new settings', () => {
    expect(treeObj.settings.selectable).toEqual('single');
    expect(treeObj.settings.hideCheckboxes).toEqual(true);
    expect(treeEl.querySelector('a[role="treeitem"] .tree-checkbox')).toBeFalsy();

    treeObj.updated({ selectable: 'multiple', hideCheckboxes: false });

    expect(treeObj.settings.selectable).toEqual('multiple');
    expect(treeObj.settings.hideCheckboxes).toEqual(false);
    expect(treeEl.querySelector('a[role="treeitem"] .tree-checkbox')).toBeTruthy();
  });

  it('should destroy tree', () => {
    treeObj?.destroy();

    expect(treeEl.querySelectorAll('a[role="treeitem"]').length).toEqual(0);
  });
});
