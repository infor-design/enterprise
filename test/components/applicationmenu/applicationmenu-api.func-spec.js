import { ApplicationMenu } from '../../../src/components/applicationmenu/applicationmenu';

const applicationmenuHTML = require('../../../app/views/components/applicationmenu/example-index.html');

const svg = require('../../../src/components/icons/theme-uplift-svg.html');
require('../../../src/components/locale/cultures/en-US.js');
require('../../../src/components/locale/cultures/uk-UA.js');

let applicationmenuEl;
let svgEl;
let applicationmenuObj;

describe('Application Menu API', () => {
  beforeEach(() => {
    applicationmenuEl = null;
    svgEl = null;
    applicationmenuObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', applicationmenuHTML);
    applicationmenuEl = document.body.querySelector('#application-menu');
    svgEl = document.body.querySelector('.svg-icons');

    applicationmenuObj = new ApplicationMenu(applicationmenuEl, { triggers: $('.application-menu-trigger') });
  });

  afterEach(() => {
    applicationmenuObj.destroy();
    svgEl.parentNode.removeChild(svgEl);
    applicationmenuEl.parentNode.removeChild(applicationmenuEl);

    const headerEl = document.body.querySelector('.header');
    headerEl.parentNode.removeChild(headerEl);
  });

  it('Should show on page', () => {
    document.body.querySelector('#header-hamburger').click();

    expect(document.body.querySelector('#application-menu')).toBeVisible();
  });

  it('Should not error on updated', () => {
    $(applicationmenuEl).empty();
    applicationmenuObj.updated();

    expect(document.body.querySelectorAll('#application-menu > *').length).toEqual(0);
  });
});
