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
require('../../../src/components/module-nav/module-nav.settings.jquery.js');
require('../../../src/components/module-nav/module-nav.switcher.jquery.js');

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

  it.skip('can display as collapsed', () => {
    moduleNavAPI.updated({ displayMode: 'collapsed' });

    expect(moduleNavContainerEl.classList.contains('mode-collapsed')).toBeTruthy();
  });

  it('can display as expanded', () => {
    moduleNavAPI.updated({ displayMode: 'expanded' });

    expect(moduleNavContainerEl.classList.contains('mode-expanded')).toBeTruthy();
  });

  it('can have the Module Switcher and footer areas pinned', () => {
    moduleNavAPI.updated({ pinSections: true });

    expect(moduleNavContainerEl.classList.contains('pinned-optional')).toBeTruthy();
  });

  // @TODO Have this element construct itself empty
  it.skip('should render a Module Switcher component if one does not exist', () => {
    const moduleBtn = moduleNavContainerEl.querySelector('.module-nav-section.module-btn');
    expect(moduleBtn).toBeTruthy();

    const dd = moduleNavContainerEl.querySelector('.module-nav-section.role-dropdown');
    expect(dd).toBeTruthy();
  });
});
