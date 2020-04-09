import { About } from '../../../src/components/about/about';
import { cleanup } from '../../helpers/func-utils';

const aboutHTML = require('../../../app/views/components/about/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let aboutEl;
let aboutObj;

describe('About API', () => {
  const Locale = window.Soho.Locale;

  beforeEach(() => {
    aboutEl = null;
    aboutObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', aboutHTML);
    aboutEl = document.body.querySelector('.about');

    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.set('en-US');

    aboutObj = new About(aboutEl);
  });

  afterEach((done) => {
    Locale.set('en-US');
    if (aboutObj) {
      aboutObj.destroy();
    }
    const modalAPI = $('body').data('modal');
    if (modalAPI && typeof modalAPI.destroy === 'function') {
      modalAPI.destroy();
    }

    cleanup([
      '.row',
      '.svg-icons',
      '.about',
      '.modal'
    ]);
    setTimeout(() => {
      done();
    }, 500);
  });

  it('Should show on page via API', (done) => {
    $('body').about({
      appName: 'IDS Enterprise',
      productName: 'Controls',
      version: 'ver. {{version}}',
      content: '<p>Fashionable components for fashionable applications.</p>'
    });

    setTimeout(() => {
      expect(document.body.querySelector('#about-modal').classList.contains('is-visible')).toBeTruthy();
      done();
    }, 650);
  });

  it('Should fire close', (done) => {
    $('body').about({
      appName: 'IDS Enterprise',
      productName: 'Controls',
      version: 'ver. {{version}}',
      content: '<p>Fashionable components for fashionable applications.</p>'
    });

    const spyEvent = spyOnEvent('body', 'close');

    setTimeout(() => {
      document.body.querySelector('#about-modal .close-container button').click();

      setTimeout(() => {
        expect(spyEvent).toHaveBeenTriggered();
        done();
      }, 650);
    }, 650);
  });
});
