/**
 * @jest-environment jsdom
 */
import { Blockgrid } from '../../../src/components/blockgrid/blockgrid';
import { cleanup } from '../../helpers/func-utils';

const blockgridHTML = `<div class="row">
  <div class="twelve columns">
    <h1 class="section-title">Block Grid Single Selection</h1>
    <div class="row blockgrid l-center" id="blockgrid">
  </div>
</div>`;
const blockgridMixedSelectionHTML = `<div class="row">
  <div class="twelve columns">
    <h1 class="section-title">Block Grid with Mixed Selection</h1>
    <div class="row blockgrid l-center" id="blockgrid">
  </div>
</div>`;

let blockgridEl;
let blockgridObj;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('Blockgrid Single Events', () => {
  beforeEach(() => {
    const settings = {
      dataset: [],
      selectable: 'single', // false, 'single' or 'multiple' or mixed
      paging: false,
      pagerSettings: { pagesize: 25, pagesizes: [10, 25, 50, 75] }
    };

    blockgridEl = null;
    blockgridObj = null;
    document.body.insertAdjacentHTML('afterbegin', blockgridHTML);
    blockgridEl = document.body.querySelector('#blockgrid');
    blockgridEl.classList.add('no-init');
    blockgridObj = new Blockgrid(blockgridEl, settings);
  });

  afterEach(() => {
    blockgridObj?.destroy();
    cleanup();
  });

  it('Should trigger "selected" event', () => {
    const callback = jest.fn();

    $('#blockgrid').on('selected', callback);
    const firstBlock = $('.block').first();
    blockgridObj.select(firstBlock);

    expect(callback).toHaveBeenCalled();
  });
});

describe('Blockgrid Mixed Selection Events', () => {
  beforeEach(() => {
    const data = [];
    data.push({
      image: '/images/8.jpg',
      title: 'Sheena Taylor',
      subtitle: 'Infor, Developer',
      id: 1
    });
    data.push({
      image: '/images/9.jpg',
      title: 'Jane Taylor',
      subtitle: 'Infor, Developer',
      id: 2
    });
    data.push({
      image: '/images/10.jpg',
      title: 'Sam Smith',
      subtitle: 'Infor, SVP',
      id: 3
    });
    data.push({
      image: '/images/11.jpg',
      title: 'Mary Pane',
      subtitle: 'Infor, Developer',
      id: 4
    });
    data.push({
      image: '/images/12.jpg',
      title: 'Paula Paulson',
      subtitle: 'Infor, Architect',
      id: 5
    });

    const settings = {
      dataset: data,
      selectable: 'mixed'
    };

    blockgridEl = null;
    blockgridObj = null;
    document.body.insertAdjacentHTML('afterbegin', blockgridMixedSelectionHTML);
    blockgridEl = document.body.querySelector('#blockgrid');
    blockgridEl.classList.add('no-init');
    blockgridObj = new Blockgrid(blockgridEl, settings);
  });

  afterEach(() => {
    blockgridObj.destroy();
    cleanup();
  });

  it('Should trigger "activated" event', (done) => {
    const callback = jest.fn();

    $('#blockgrid').on('activated', callback);
    const firstBlock = $('.block').first();

    blockgridObj.select(firstBlock);
    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('Should trigger "deactivated" event', (done) => {
    const callback = jest.fn();

    $('#blockgrid').on('deactivated', callback);
    const firstBlock = $('.block').first();
    blockgridObj.select(firstBlock);
    blockgridObj.select(firstBlock);

    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      done();
    }, 100);
  });
});
