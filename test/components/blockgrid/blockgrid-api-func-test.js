/**
 * @jest-environment jsdom
 */
import { Blockgrid } from '../../../src/components/blockgrid/blockgrid';
import { cleanup } from '../../helpers/func-utils';

let blockgridHTML = `<div class="row">
  <div class="twelve columns">
    <h1 class="section-title">Block Grid</h1>

    <div class="row blockgrid l-center">
      <div class="block">
        <img alt="Placeholder Image" src="{{basepath}}images/placeholder-200x200.png"/>
      </div>
      <div class="block">
        <img alt="Placeholder Image" src="{{basepath}}images/placeholder-200x200.png"/>
      </div>
      <div class="block">
        <img alt="Placeholder Image" src="{{basepath}}images/placeholder-200x200.png"/>
      </div>
      <div class="block">
        <img alt="Placeholder Image" src="{{basepath}}images/placeholder-200x200.png"/>
      </div>
      <div class="block">
        <img alt="Placeholder Image" src="{{basepath}}images/placeholder-200x200.png"/>
      </div>
    </div>

  </div>
</div>`;

let blockgridEl;
let blockgridObj;

const settings = {
  dataset: [{
    image: '/images/8.jpg',
    title: 'Neyo Taylor',
    subtitle: 'Infor, Developer',
    id: 1
  }, {
    image: '/images/9.jpg',
    title: 'Jane Taylor',
    subtitle: 'Infor, Developer',
    id: 2
  }],
  selectable: 'single', // false, 'single' or 'multiple' or mixed
  paging: false,
  pagerSettings: {
    pagesize: 25,
    pagesizes: [10, 25, 50, 75]
  }
};

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('Blockgrid API', () => {
  beforeEach(() => {
    blockgridEl = null;
    blockgridObj = null;
    blockgridHTML = blockgridHTML.replace(/{{basepath}}/g, '/');
    document.body.insertAdjacentHTML('afterbegin', blockgridHTML);
    blockgridEl = document.body.querySelector('.blockgrid');
    blockgridObj = new Blockgrid(blockgridEl, settings);
  });

  afterEach(() => {
    blockgridObj?.destroy();
    cleanup();
  });

  it('Should be defined', () => {
    expect(blockgridObj).toBeTruthy();
  });

  it('Should visible blockgrid', () => {
    expect(document.body.querySelector('.blockgrid')).toBeTruthy();
  });

  it('Should select block', (done) => {
    const firstBlock = $('.block').first();
    blockgridObj.select(firstBlock);

    setTimeout(() => {
      expect(document.body.querySelector('.block').classList.contains('is-selected')).toBeTruthy();
      expect(document.body.querySelector('.block').getAttribute('aria-selected')).toBeTruthy();
      done();
    }, 100);
  });

  it('Should update settings', () => {
    blockgridObj.updated({ selectable: false });

    expect(blockgridObj.settings.selectable).toEqual(false);
  });

  it('Should have block', () => {
    expect(document.body.querySelector('.block')).toBeTruthy();
  });

  it('Should destroy blockgrid', (done) => {
    blockgridObj.destroy();
    setTimeout(() => {
      expect($(blockgridEl).data('blockgrid')).toBeFalsy();

      blockgridObj = new Blockgrid(blockgridEl, settings);
      done();
    }, 100);
  });
});
