import { cleanup } from '../../helpers/func-utils';

const aboutHTML = require('../../../app/views/components/about/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let aboutObj;

describe('About API', () => {
  const Locale = window.Soho.Locale;

  beforeEach(() => {
    aboutObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', aboutHTML);

    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.set('en-US');
  });

  afterEach((done) => {
    Locale.set('en-US');
    if (aboutObj) {
      aboutObj.destroy();
    }

    cleanup([
      '.row',
      '.svg-icons',
      '.about',
      '.modal'
    ]);
    setTimeout(() => {
      done();
    }, 650);
  });

  it('Should show on page via API', (done) => {
    $('body').about({
      appName: 'IDS Enterprise',
      productName: 'Controls',
      version: 'ver. {{version}}',
      content: '<p>Fashionable components for fashionable applications.</p>'
    });
    aboutObj = $('body').data('about');

    setTimeout(() => {
      expect(document.body.querySelector('#about-modal').classList.contains('is-visible')).toBeTruthy();
      done();
    }, 650);
  });
});
