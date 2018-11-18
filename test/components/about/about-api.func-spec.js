import { About } from '../../../src/components/about/about';

const aboutHTML = require('../../../app/views/components/about/example-index.html');
const svg = require('../../../src/components/icons/svg.html');
require('../../../src/components/locale/cultures/en-US.js');
require('../../../src/components/locale/cultures/uk-UA.js');

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
    }, 300);
  });

  it('Should fire close', (done) => {
    $('body').about({
      appName: 'IDS Enterprise',
      productName: 'Controls',
      version: 'ver. {{version}}',
      content: '<p>Fashionable components for fashionable applications.</p>'
    });

    setTimeout(() => {
      const spyEvent = spyOnEvent('body', 'close');
      document.body.querySelector('#about-modal + .modal-page-container .close-container button').click();

      expect(spyEvent).toHaveBeenTriggered();
      done();
    }, 300);
  });

  it('Should show correct text in ukranian', (done) => {
    Locale.set('uk-UA').done(() => {
      $('body').about({
        appName: 'IDS Enterprise',
        productName: 'Controls',
        version: 'ver. {{version}}',
        content: '<p>Fashionable components for fashionable applications.</p>'
      });

      setTimeout(() => {
        const ukText = 'Авторські права © Infor, 2018. Усі права збережено. Усі зазначені у цьому документі назви та дизайн елементів є товарними знаками або захищеними товарними знаками Infor та/або афілійованих організацій і філіалів Infor. Усі права збережено. Усі інші товарні знаки, перелічені тут, є власністю відповідних власників. www.infor.com.';

        expect(document.body.querySelector('#about-modal + .modal-page-container')).toBeVisible();
        expect(document.body.querySelector('#about-modal + .modal-page-container .additional-content + p').innerText).toEqual(ukText);
        done();
      }, 300);
    });
  });
});
