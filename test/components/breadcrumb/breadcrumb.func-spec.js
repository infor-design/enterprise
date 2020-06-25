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

fdescribe('Breadcrumb API', () => {
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

  it('can be set to the alternate style', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      style: 'alternate'
    });

    expect(breadcrumbAPI.element.classList.contains('alternate')).toBeTruthy();
  });

  it('can disable and re-enable the entire breadcrumb list', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: TEST_BREADCRUMBS
    });

    breadcrumbAPI.disabled = true;

    expect(breadcrumbEl.classList.contains('is-disabled')).toBeTruthy();

    breadcrumbAPI.disabled = false;

    expect(breadcrumbEl.classList.contains('is-disabled')).toBeFalsy();

    breadcrumbAPI.disable();

    expect(breadcrumbEl.classList.contains('is-disabled')).toBeTruthy();

    breadcrumbAPI.enable();

    expect(breadcrumbEl.classList.contains('is-disabled')).toBeFalsy();
  });

  it('can run a callback attached to a single item', () => {
    let result = false;
    function changeResult() {
      result = true;
      this.settings.content = 'Not Home Anymore';
      this.refresh();
      return result;
    }

    // Add a callback function to the first breadcrumb
    const newBreadcrumbs = [].concat(TEST_BREADCRUMBS);
    newBreadcrumbs[0].callback = changeResult;

    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: newBreadcrumbs
    });

    const targetA = breadcrumbEl.querySelector(`#${id} li:first-child > a`);
    $(targetA).click();

    // Callback should have executed, AND should've changed the text value
    expect(result).toBeTruthy();
    expect(breadcrumbAPI.breadcrumbs[0].element.textContent).toEqual('Not Home Anymore');
  });

  it('can get a specific BreadcrumbItem\'s API via its anchor tag', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: TEST_BREADCRUMBS
    });

    const a3 = breadcrumbAPI.breadcrumbs[2].element.querySelector('a');
    const target3 = breadcrumbAPI.getBreadcrumbItemAPI(a3);

    expect(target3.api).toBeDefined();
    expect(target3.api.element).toEqual(breadcrumbAPI.breadcrumbs[2].element);
  });

  it('can be destroyed', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: TEST_BREADCRUMBS
    });

    const a3 = breadcrumbAPI.breadcrumbs[2].element.querySelector('a');
    const target3 = breadcrumbAPI.getBreadcrumbItemAPI(a3);

    breadcrumbAPI.destroy();

    expect(target3.api.element).not.toBeDefined();
  });

  it('can programmatically add a breadcrumb', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: TEST_BREADCRUMBS
    });

    breadcrumbAPI.add({
      id: 'fifth-item',
      content: 'Fifth Item',
      href: '#'
    });
    const fifth = breadcrumbAPI.breadcrumbs[4];

    expect(breadcrumbAPI.breadcrumbs.length).toEqual(5);
    expect(fifth.settings.id).toEqual('fifth-item');
    expect(fifth.disabled).toBeFalsy(); // Should take on the default
  });

  it('can programmatically remove a breadcrumb via its anchor', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: TEST_BREADCRUMBS
    });

    const a1 = breadcrumbEl.querySelector('li:first-child > a');
    breadcrumbAPI.remove(a1, true);

    expect(breadcrumbAPI.breadcrumbs.length).toEqual(3);
    expect(breadcrumbEl.querySelector('li:first-child > a').innerText).toEqual('Second Item');
  });

  it('can programmatically remove a breadcrumb by providing an index', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: TEST_BREADCRUMBS
    });

    breadcrumbAPI.remove(0, true);

    expect(breadcrumbAPI.breadcrumbs.length).toEqual(3);
    expect(breadcrumbEl.querySelector('li:first-child > a').innerText).toEqual('Second Item');
  });

  it('can programmatically remove a breadcrumb via its BreadcrumbItem API', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: TEST_BREADCRUMBS
    });

    const api1 = breadcrumbAPI.breadcrumbs[0];
    breadcrumbAPI.remove(api1, true);

    expect(breadcrumbAPI.breadcrumbs.length).toEqual(3);
    expect(breadcrumbEl.querySelector('li:first-child > a').innerText).toEqual('Second Item');
  });

  it('can programmatically make a breadcrumb current via its anchor', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: TEST_BREADCRUMBS
    });

    const a1 = breadcrumbEl.querySelector('li:first-child > a');
    breadcrumbAPI.makeCurrent(a1);
    const liCssClasses = breadcrumbEl.querySelector('li:first-child').classList;

    expect(liCssClasses.contains('current')).toBeTruthy();
  });

  it('can programmatically make a breadcrumb current by providing its index', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: TEST_BREADCRUMBS
    });

    breadcrumbAPI.makeCurrent(0);
    const liCssClasses = breadcrumbEl.querySelector('li:first-child').classList;

    expect(liCssClasses.contains('current')).toBeTruthy();
  });

  it('can programmatically make a breadcrumb current via its BreadcrumbItem API', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: TEST_BREADCRUMBS
    });

    const api1 = breadcrumbAPI.breadcrumbs[0];
    breadcrumbAPI.makeCurrent(api1);
    const liCssClasses = breadcrumbEl.querySelector('li:first-child').classList;

    expect(liCssClasses.contains('current')).toBeTruthy();
  });

  it('can programmatically get the current breadcrumb\'s anchor', () => {
    document.body.insertAdjacentHTML('afterbegin', breadcrumbTmpl);
    breadcrumbEl = document.querySelector(`#${id}`);
    breadcrumbAPI = new Breadcrumb(breadcrumbEl, {
      breadcrumbs: TEST_BREADCRUMBS
    });

    const currentA = breadcrumbAPI.current;
    const a4 = breadcrumbAPI.breadcrumbs[3].element.querySelector('a');

    expect(currentA).toBeDefined();
    expect(currentA).toEqual(a4);
  });
});
