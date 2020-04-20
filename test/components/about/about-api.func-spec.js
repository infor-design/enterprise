import { About } from '../../../src/components/about/about';

const aboutHTML = require('../../../app/views/components/about/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let aboutEl;
let svgEl;
let aboutObj;

describe('About API', () => {
  const Locale = window.Soho.Locale;

  beforeEach(() => {
    aboutEl = null;
    svgEl = null;
    aboutObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', aboutHTML);
    aboutEl = document.body.querySelector('.about');
    svgEl = document.body.querySelector('.svg-icons');

    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.set('en-US');

    aboutObj = new About(aboutEl);
  });

  afterEach(() => {
    Locale.set('en-US');
    aboutObj.destroy();
    svgEl.parentNode.removeChild(svgEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  afterAll(() => {
    const aboutModalEls = document.body.querySelectorAll('.modal');
    for (let i = 0; i < aboutModalEls.length; i++) {
      aboutModalEls[i].parentNode.removeChild(aboutModalEls[i]);
    }

    const containerEls = document.body.querySelectorAll('.modal-page-container');
    for (let i = 0; i < containerEls.length; i++) {
      containerEls[i].parentNode.removeChild(containerEls[i]);
    }
  });

  it('Should show on page via API', (done) => {
    $('body').about({
      appName: 'IDS Enterprise',
      productName: 'Controls',
      version: 'ver. {{version}}',
      content: '<p>Fashionable components for fashionable applications.</p>'
    });

    setTimeout(() => {
      expect(document.body.querySelector('#about-modal + .modal-page-container')).toBeVisible();
      done();
    }, 600);
  });
});
