import { Blockgrid } from '../../../src/components/blockgrid/blockgrid';

const blockgridHTML = require('../../../app/views/components/blockgrid/example-singleselect.html');
const blockgridMixedSelectionHTML = require('../../../app/views/components/blockgrid/example-mixed-selection.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let blockgridEl;
let svgEl;
let blockgridObj;

describe('Blockgrid Single Events', () => {
  beforeEach(() => {
    const settings = {
      dataset: [],
      selectable: 'single', // false, 'single' or 'multiple' or mixed
      paging: false,
      pagesize: 25,
      pagesizes: [10, 25, 50, 75]
    };

    blockgridEl = null;
    svgEl = null;
    blockgridObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', blockgridHTML);
    blockgridEl = document.body.querySelector('#blockgrid');
    svgEl = document.body.querySelector('.svg-icons');
    blockgridEl.classList.add('no-init');
    blockgridObj = new Blockgrid(blockgridEl, settings);
  });

  afterEach(() => {
    blockgridObj.destroy();
    blockgridEl.parentNode.removeChild(blockgridEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should trigger "selected" event', () => {
    const spyEvent = spyOnEvent('#blockgrid', 'selected');
    const firstBlock = $('.block').first();
    blockgridObj.select(firstBlock);

    expect(spyEvent).toHaveBeenTriggered();
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
    svgEl = null;
    blockgridObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', blockgridMixedSelectionHTML);
    blockgridEl = document.body.querySelector('#blockgrid');
    svgEl = document.body.querySelector('.svg-icons');
    blockgridEl.classList.add('no-init');
    blockgridObj = new Blockgrid(blockgridEl, settings);
  });

  afterEach(() => {
    blockgridObj.destroy();
    blockgridEl.parentNode.removeChild(blockgridEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should trigger "activated" event', (done) => {
    const spyEvent = spyOnEvent('#blockgrid', 'activated');
    const firstBlock = $('.block').first();

    blockgridObj.select(firstBlock);
    setTimeout(() => {
      expect(spyEvent).toHaveBeenTriggered();
      done();
    }, 100);
  });

  it('Should trigger "deactivated" event', (done) => {
    const spyEvent = spyOnEvent('#blockgrid', 'deactivated');
    const firstBlock = $('.block').first();
    blockgridObj.select(firstBlock);
    blockgridObj.select(firstBlock);

    setTimeout(() => {
      expect(spyEvent).toHaveBeenTriggered();
      done();
    }, 100);
  });
});
