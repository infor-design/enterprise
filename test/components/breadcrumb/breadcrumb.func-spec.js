import { Breadcrumb } from '../../../src/components/breadcrumb/breadcrumb';
import { cleanup } from '../../helpers/func-utils';

const id = 'test-breadcrumb';
const breadcrumbTmpl = `<nav id="${id}" class="breadcrumb"></nav>`;

// Used to generate Breadcrumb data from existing HTML
const fullBreadcrumbTmpl = `<nav id="${id}" class="breadcrumb">
  <ol>
    <li class="breadcrumb-item">
      <a id="home">Home</a>
    </li>
    <li class="breadcrumb-item is-disabled">
      <a id="second-item" disabled>Second Item</a>
    </li>
    <li class="breadcrumb-item">
      <a id="third-item" href="https://infor.com/">Third Item</a>
    </li>
    <li class="breadcrumb-item current">
      <a id="fourth-item">Fourth Item</a>
    </li>
  </ol>
</nav>`;

// Used to generate Breadcrumb data from settings
const TEST_BREADCRUMBS = [
  {
    content: 'Home',
    id: 'home'
  },
  {
    content: 'Second Item',
    disabled: true,
    id: 'second-item'
  },
  {
    content: 'Third Item',
    href: 'https://infor.com/',
    id: 'third-item'
  },
  {
    content: 'Fourth Item',
    current: true,
    id: 'fourth-item'
  }
];

let breadcrumbEl;
let breadcrumbAPI;

describe('Breadcrumb API', () => {
  beforeEach(() => {});

  afterEach(() => {
    if (breadcrumbAPI) {
      breadcrumbAPI.destroy();
      breadcrumbAPI = null;
    }
    cleanup([
      '.breadcrumb',
      '.svg-icons',
      '.row'
    ]);
    breadcrumbEl = null;
  });

  it('can be invoked', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl);

    expect(breadcrumbAPI).toEqual(jasmine.any(Object));
  });

  it('can create breadcrumb items on initialization', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: TEST_BREADCRUMBS
    });
    const a1 = breadcrumbAPI.breadcrumbs[0].element.querySelector('a');
    const li2 = breadcrumbAPI.breadcrumbs[1].element;
    const a2 = li2.querySelector('a');
    const a3 = breadcrumbAPI.breadcrumbs[2].element.querySelector('a');
    const li4 = breadcrumbAPI.breadcrumbs[3].element;

    expect(breadcrumbAPI.breadcrumbs.length).toEqual(TEST_BREADCRUMBS.length);
    expect(a1.id).toEqual(TEST_BREADCRUMBS[0].id);
    expect(a2.disabled).toBeTruthy();
    expect(li2.classList.contains('is-disabled')).toBeTruthy();
    expect(a3.href).toEqual(TEST_BREADCRUMBS[2].href);
    expect(li4.classList.contains('current')).toBeTruthy();
  });

  it('can consume existing breadcrumb HTML and convert to settings', () => {
    document.body.insertAdjacentHTML('afterbegin', fullBreadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl);
    const a1 = breadcrumbAPI.breadcrumbs[0].element.querySelector('a');
    const li2 = breadcrumbAPI.breadcrumbs[1].element;
    const a2 = li2.querySelector('a');
    const a3 = breadcrumbAPI.breadcrumbs[2].element.querySelector('a');
    const li4 = breadcrumbAPI.breadcrumbs[3].element;

    expect(breadcrumbAPI.breadcrumbs.length).toEqual(TEST_BREADCRUMBS.length);
    expect(a1.id).toEqual(TEST_BREADCRUMBS[0].id);
    expect(a2.disabled).toBeTruthy();
    expect(li2.classList.contains('is-disabled')).toBeTruthy();
    expect(a3.href).toEqual(TEST_BREADCRUMBS[2].href);
    expect(li4.classList.contains('current')).toBeTruthy();
  });
});
