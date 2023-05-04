/**
 * @jest-environment jsdom
*/
import { ModuleNav } from '../../../src/components/module-nav/module-nav';
import { Locale } from '../../../src/components/locale/locale';

import { cleanup } from '../../helpers/func-utils';

Soho.Locale = Locale;

require('../../../src/components/locale/cultures/ar-EG.js');
require('../../../src/components/locale/cultures/ar-SA.js');
require('../../../src/components/locale/cultures/da-DK.js');
require('../../../src/components/locale/cultures/en-US.js');

// Bare-minimum Module Nav HTML
const moduleNavHTML = `<section class="module-nav-container">
  <aside id="nav" class="module-nav">
    <div class="module-nav-bar"></div>
    <div class="module-nav-detail"></div>
  </aside>
  <div class="page-container scrollable"></div>
</section>
`;

let moduleNavContainerEl;
let moduleNavEl;
let moduleNavAPI;

describe('Module Nav API', () => {
  beforeEach(() => {
    moduleNavEl = null;
    moduleNavAPI = null;

    document.body.insertAdjacentHTML('afterbegin', moduleNavHTML);
    moduleNavContainerEl = document.body.querySelector('.module-nav-container');
    moduleNavEl = document.body.querySelector('.module-nav');

    Locale.set('en-US');

    moduleNavAPI = new ModuleNav(moduleNavEl, {});
  });

  afterEach(() => {
    moduleNavAPI?.destroy();
    cleanup();
  });

  it('should be defined', () => {
    expect(moduleNavContainerEl).toBeTruthy();
    expect(moduleNavAPI).toBeTruthy();
  });

  it('should render a Module Switcher component', () => {
    console.dir(moduleNavEl.children);
    console.log(moduleNavEl.children.length);
    expect(moduleNavEl.children.length).toBeTruthy();
  });
});
