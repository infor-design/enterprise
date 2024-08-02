/**
 * @jest-environment jsdom
 */
import { Toast } from '../../../src/components/toast/toast';
import { cleanup } from '../../helpers/func-utils';

require('../../../src/components/icons/icons.jquery');

let toastEl;
let toastObj;

describe('Toast API', () => {
  beforeEach(() => {
    toastEl = document.body;
    toastObj = null;

    // Clean up any previous toasts
    const toastContainer = document.querySelector('#toast-container');
    if (toastContainer) {
      toastContainer.parentNode.removeChild(toastContainer);
    }

    if (toastObj) {
      toastObj?.destroy();
      toastObj = null;
    }

    const toastTitle = 'Toast Title';
    const toastMessage = 'Toast Message';

    toastObj = new Toast(toastEl, {
      title: toastTitle,
      message: toastMessage,
      timeout: 6000
    });
  });

  afterEach(() => {
    toastObj?.destroy();
    cleanup();
  });

  it('should be defined', () => {
    expect(toastObj).toBeTruthy();
  });

  it('should visible toast', () => {
    expect(document.body.querySelector('.toast')).toBeTruthy();
  });

  it('should have progress bar', () => {
    expect(document.body.querySelector('.toast-progress')).toBeTruthy();
  });

  it('should have settings updated', () => {
    const settings = {
      title: 'Toast Title 2',
      message: 'Toast Message 2',
      timeout: 6000
    };

    toastObj.updated(settings);

    expect(toastObj.settings.title).toEqual('Toast Title 2');
  });

  it('should destroy toast', () => {
    toastObj?.destroy();
    expect(document.body.querySelector('.toast')).toBeFalsy();
  });

  it('should save settings for draggable', () => {
    const left = 'left: 100px';
    const settings = {
      title: 'Application Offline',
      message: 'This is a Toast message.',
      draggable: true,
      savePosition: true
    };
    let container;
    window.localStorage.clear();

    toastObj?.destroy();
    toastObj = new Toast(toastEl, settings);
    container = document.body.querySelector('#toast-container');

    expect(container.getAttribute('class')).toContain('is-draggable');
    expect(container.getAttribute('style')).not.toContain(left);

    toastObj.savePosition({ left: 100, top: 100 });
    toastObj.remove($('.toast'));

    toastObj?.destroy();
    toastObj = new Toast(toastEl, settings);
    container = document.body.querySelector('#toast-container');

    expect(container.getAttribute('class')).toContain('is-draggable');
    expect(container.getAttribute('style')).toContain(left);
  });

  it('should support setting attributes', () => {
    let settings = {
      title: 'Toast Title 2',
      message: 'Toast Message 2',
      timeout: 6000,
      attributes: { name: 'id', value: 'my-unique-id' }
    };

    toastObj.updated(settings);
    let container = document.body.querySelector('#my-unique-id');

    expect(container.getAttribute('id')).toEqual('my-unique-id');

    settings = {
      title: 'Toast Title 2',
      message: 'Toast Message 2',
      timeout: 6000,
      attributes: { name: 'data-automation-id', value: 'my-unique-id' }
    };

    toastObj.updated(settings);
    container = document.body.querySelector('[data-automation-id="my-unique-id"]');

    expect(container.getAttribute('data-automation-id')).toEqual('my-unique-id');

    const closeButton = document.body.querySelector('[data-automation-id="my-unique-id-btn-close"]');

    expect(closeButton.getAttribute('data-automation-id')).toEqual('my-unique-id-btn-close');
  });

  it('should support setting attributes as a function', () => {
    const settings = {
      title: 'Toast Title 2',
      message: 'Toast Message 2',
      timeout: 6000,
      attributes: { name: 'id', value: args => `toast-id-${args.toastIndex}` }
    };

    toastObj.updated(settings);
    const container = document.body.querySelector('#toast-id-2');

    expect(container.getAttribute('id')).toEqual('toast-id-2');

    const closeButton = document.body.querySelector('#toast-id-2-btn-close');

    expect(closeButton.getAttribute('id')).toEqual('toast-id-2-btn-close');
  });

  it('should support setting attributes as an array', () => {
    const settings = {
      title: 'Toast Title 2',
      message: 'Toast Message 2',
      timeout: 6000,
      attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
    };

    toastObj.updated(settings);
    const container = document.body.querySelector('#my-unique-id');

    expect(container.getAttribute('id')).toEqual('my-unique-id');
    expect(container.getAttribute('data-automation-id')).toEqual('my-unique-id');

    const closeButton = document.body.querySelector('#my-unique-id-btn-close');

    expect(closeButton.getAttribute('id')).toEqual('my-unique-id-btn-close');
    expect(closeButton.getAttribute('data-automation-id')).toEqual('my-unique-id-btn-close');
  });
});
