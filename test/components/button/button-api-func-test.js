/**
 * @jest-environment jsdom
 */
import { Button } from '../../../src/components/button/button';
import { cleanup } from '../../helpers/func-utils';

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

const buttonHTML = `<div class="row is-personalizable">
  <div class="twelve columns">
    <div class="row">
      <div class="four column">
        <h2 class="fieldset-title">Standard</h2>
      </div>
    </div>

    <div class="four columns">
      <span class="label">Primary</span>
      <button class="btn-primary" type="button" id="primary-action-two">Action</button><br><br><br>
      <button class="btn-primary" type="button" id="primary-action-three" disabled>Action</button><br><br><br>

      <button class="btn-primary" type="button" id="primary-alert">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-open-folder"></use>
        </svg>
        <span>Action</span>
      </button>

      <br><br><br><br>
    </div>

    <div class="three columns">
      <span class="label">Secondary</span>
      <button class="btn-secondary" type="button" id="secondary-action-one">Action</button><br><br><br>
      <button class="btn-secondary" type="button" id="secondary-action-two" disabled>Action</button><br><br><br>

      <button class="btn-secondary" type="button" id="secondary-alert">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-open-folder"></use>
        </svg>
        <span>Action</span>
      </button>

      <br><br><br><br>
    </div>

    <div class="three columns">
      <span class="label">Tertiary</span>
      <button type="button" class="btn-tertiary" id="tertiary-filter-one">
        <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
          <use href="#icon-open-folder"></use>
        </svg>
        <span>Action</span>
      </button>
      <br><br>

      <button type="button" class="btn-tertiary" id="tertiary-filter-two" disabled>
        <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
          <use href="#icon-open-folder"></use>
        </svg>
        <span>Action</span>
      </button>
      <br><br>

      <button type="button" class="btn btn-link" id="tertiary-filter-three">
        <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
          <use href="#icon-open-folder"></use>
        </svg>
        <span>Action</span>
      </button>

      <br><br><br><br>
    </div>

    <div class="two columns">
      <span class="label">Icon</span>

      <button type="button" class="btn-icon" id="calendar-enabled">
        <span>Date</span>
        <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
          <use href="#icon-calendar"></use>
        </svg>
      </button>
      <br><br>

      <button type="button" class="btn-icon" id="calendar-disabled" disabled>
        <span>Date</span>
        <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
          <use href="#icon-calendar"></use>
        </svg>
      </button>

      <br><br><br><br>
    </div>

    <div class="row">
      <div class="four column">
        <h2 class="fieldset-title">Destructive</h2>
      </div>
    </div>

    <div class="four columns">
      <span class="label">Primary</span>
      <button class="btn-primary destructive" type="button" id="primary-action-two">Action</button><br><br><br>
      <button class="btn-primary destructive" type="button" id="primary-action-three" disabled>Action</button><br><br><br>
      <br><br><br><br>
    </div>

    <div class="three columns">
      <span class="label">Tertiary</span>
      <button type="button" class="btn-tertiary destructive" id="tertiary-filter-one">
        <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
          <use href="#icon-open-folder"></use>
        </svg>
        <span>Action</span>
      </button>
      <br><br>

      <button type="button" class="btn-tertiary destructive" id="tertiary-filter-two" disabled>
        <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
          <use href="#icon-open-folder"></use>
        </svg>
        <span>Action</span>
      </button>
      <br><br>
    </div>
  </div>
</div>`;

let buttonEl;
let buttonAPI;

describe('Button API', () => {
  beforeEach(() => {
    buttonEl = null;
    buttonAPI = null;
    document.body.insertAdjacentHTML('afterbegin', buttonHTML);
    buttonEl = document.body.querySelector('.btn');
    buttonEl.classList.add('no-init');
    buttonAPI = new Button(buttonEl);
  });

  afterEach(() => {
    if (buttonAPI) {
      buttonAPI.destroy();
    }
    cleanup();
  });

  it('should exist', () => {
    expect(buttonAPI).toBeTruthy();
  });

  it('can be disabled/enabled', () => {
    buttonAPI.disabled = true;

    expect(buttonEl.disabled).toBeTruthy();

    buttonAPI.disabled = false;

    expect(buttonEl.disabled).toBeFalsy();
  });

  it('can be destroyed', (done) => {
    const callback = jest.fn();
    $(buttonEl).on('click.button', callback);
    buttonAPI.destroy();
    buttonEl.click();
    setTimeout(() => {
      expect(callback).not.toHaveBeenCalled();
      done();
    }, 500);

    expect($(buttonEl).data('button')).toBeFalsy();
  });

  it('has default settings', () => {
    expect(buttonAPI.settings).toBeTruthy();
  });

  it('can update settings via the `updated()` method', () => {
    const settings = {
      replaceText: true,
      toggleOffIcon: null,
      toggleOnIcon: null,
      hideMenuArrow: null
    };
    buttonAPI.updated(settings);

    expect(buttonAPI.settings.replaceText).toEqual(settings.replaceText);
  });

  it('should properly update the `hideMenuArrow` setting via the `updated()` method', () => {
    const settings = {
      replaceText: false,
      toggleOffIcon: null,
      toggleOnIcon: null,
      hideMenuArrow: true
    };
    buttonAPI.updated(settings);

    expect(buttonAPI.settings.hideMenuArrow).toEqual(settings.hideMenuArrow);
  });

  it('should remove menu icon if hideMenuArrow set to true', () => {
    const elem = buttonAPI.element[0];
    buttonAPI.updated({ hideMenuArrow: true });

    expect(elem.querySelector('.icon-dropdown')).toBeFalsy();
  });

  it.skip('displays a ripple effect when clicked', (done) => {
    buttonEl.click();

    expect(buttonEl.querySelector('svg.ripple')).toBeTruthy();

    setTimeout(() => {
      expect(buttonEl.querySelector('svg.ripple')).toBe(null);
      done();
    }, 1000);
  });

  it.skip('can programmatically display a ripple effect', (done) => {
    buttonAPI.createRipple();

    expect(buttonEl.querySelector('svg.ripple')).toBeTruthy();

    setTimeout(() => {
      expect(buttonEl.querySelector('svg.ripple')).toBe(null);
      done();
    }, 1000);
  });

  it('can have custom attributes', () => {
    buttonAPI.updated({
      attributes: [{
        name: 'data-automation-id',
        value: 'my-button'
      }]
    });

    expect(buttonEl.getAttribute('data-automation-id')).toEqual('my-button');
  });
});

// Secondary Button HTML with visible text and an icon
const textIconBtnHTML = `<button class="btn-secondary" id="secondary-alert">
  <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
    <use href="#icon-settings"></use>
  </svg>
  <span>Settings</span>
</button>`;

describe('Button API (Icons)', () => {
  beforeEach(() => {
    buttonEl = null;
    buttonAPI = null;
    document.body.insertAdjacentHTML('afterbegin', textIconBtnHTML);
    buttonEl = document.body.querySelector('.btn-secondary');
    buttonEl.classList.add('no-init');
    buttonAPI = new Button(buttonEl);
  });

  afterEach(() => {
    if (buttonAPI) {
      buttonAPI.destroy();
    }
    cleanup();
  });

  it('has a dynamic property representing its icon', () => {
    const icon = buttonAPI.icon;
    const use = icon.querySelector('use');

    expect(icon).toBeTruthy();
    expect(use.getAttribute('href')).toEqual('#icon-settings');
  });
});

// HTML Markup describing a simple Toggle Button
const toggleBtnHTML = `<button class="btn-toggle">
  <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
    <use href="#icon-heart-outlined"></use>
  </svg>
  <span class="audible">Love</span>
</button>`;

describe('Button API (Toggle)', () => {
  beforeEach(() => {
    buttonEl = null;
    buttonAPI = null;
    document.body.insertAdjacentHTML('afterbegin', toggleBtnHTML);
    buttonEl = document.body.querySelector('.btn-toggle');
    buttonEl.classList.add('no-init');
    buttonAPI = new Button(buttonEl, {
      toggleOnIcon: 'icon-heart-filled',
      toggleOffIcon: 'icon-heart-outlined'
    });
  });

  afterEach(() => {
    if (buttonAPI) {
      buttonAPI.destroy();
    }
    cleanup();
  });

  it('can become pressed/unpressed', () => {
    buttonAPI.pressed = true;
    let currentIconUse = buttonEl.querySelector('use');
    let currentIcon = currentIconUse.getAttribute('href').replace('#', '');

    expect(buttonAPI.pressed).toEqual(true);
    expect(buttonEl.classList.contains('is-pressed')).toBeTruthy();
    expect(currentIcon).toEqual('icon-heart-filled');

    buttonAPI.pressed = false;
    currentIconUse = buttonEl.querySelector('use');
    currentIcon = currentIconUse.getAttribute('href').replace('#', '');

    expect(buttonAPI.pressed).toEqual(false);
    expect(buttonEl.classList.contains('is-pressed')).toBeFalsy();
    expect(currentIcon).toEqual('icon-heart-outlined');
  });
});

// HTML Markup describing a simple Favorte Button
const favoriteBtnHTML = `<button class="icon-favorite">
  <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
    <use href="#icon-heart-outlined"></use>
  </svg>
  <span class="audible">Favorite</span>
</button>`;

describe('Button API (Favorite)', () => {
  beforeEach(() => {
    buttonEl = null;
    buttonAPI = null;
    document.body.insertAdjacentHTML('afterbegin', favoriteBtnHTML);
    buttonEl = document.body.querySelector('.icon-favorite');
    buttonEl.classList.add('no-init');
    buttonAPI = new Button(buttonEl);
  });

  afterEach(() => {
    if (buttonAPI) {
      buttonAPI.destroy();
    }
    cleanup();
  });

  it('can become pressed/unpressed', () => {
    buttonAPI.pressed = true;
    let currentIconUse = buttonEl.querySelector('use');
    let currentIcon = currentIconUse.getAttribute('href').replace('#', '');

    expect(buttonAPI.pressed).toEqual(true);
    expect(buttonEl.classList.contains('is-pressed')).toBeTruthy();
    expect(currentIcon).toEqual('icon-star-filled');

    buttonAPI.pressed = false;
    currentIconUse = buttonEl.querySelector('use');
    currentIcon = currentIconUse.getAttribute('href').replace('#', '');

    expect(buttonAPI.pressed).toEqual(false);
    expect(buttonEl.classList.contains('is-pressed')).toBeFalsy();
    expect(currentIcon).toEqual('icon-star-outlined');
  });
});

describe('Button API `toData()` method', () => {
  beforeEach(() => {
    buttonEl = null;
    buttonAPI = null;
    document.body.insertAdjacentHTML('afterbegin', buttonHTML);
    buttonEl = document.body.querySelector('.btn');
    buttonEl.classList.add('no-init');
    buttonAPI = new Button(buttonEl);
  });

  afterEach(() => {
    if (buttonAPI) {
      buttonAPI.destroy();
    }
    cleanup();
  });

  it('can get a data representation of itself', () => {
    const data = buttonAPI.toData();

    expect(data).toBeTruthy();
  });

  it('can get a data representation of itself with an element reference', () => {
    const data = buttonAPI.toData(true);

    expect(data).toBeTruthy();
    expect(data.element instanceof HTMLElement).toBeTruthy();
  });
});
