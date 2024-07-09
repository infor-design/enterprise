/**
 * @jest-environment jsdom
 */
import extend from 'extend';

import { ButtonSet } from '../../../src/components/button/button.set';
import { cleanup } from '../../helpers/func-utils';

let buttonSetEl;
let buttonSetAPI;

const standardButtonsDef = {
  buttons: [
    {
      id: 'btn-0',
      text: 'Button 0'
    },
    {
      id: 'btn-1',
      style: 'btn-primary',
      text: 'Button 1'
    },
    {
      id: 'btn-2',
      style: 'btn-secondary',
      text: 'Button 2',
      icon: 'icon-settings'
    },
    {
      id: 'btn-3',
      style: 'btn-tertiary',
      text: 'Button 3',
      icon: 'icon-mail'
    },
    {
      id: 'btn-4',
      style: 'btn-destructive',
      text: 'Button 4'
    }
  ]
};

const standaloneButtonDef = {
  buttons: [
    {
      id: 'my-button-1',
      text: 'My Button',
      icon: 'icon-settings',
      style: 'btn-secondary'
    }
  ]
};

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('ButtonSet API', () => {
  beforeEach(() => {
    buttonSetEl = null;
    buttonSetAPI = null;
    buttonSetEl = document.createElement('div');
    document.body.appendChild(buttonSetEl);
  });

  afterEach(() => {
    if (buttonSetAPI) {
      buttonSetAPI.destroy();
    }
    cleanup();
  });

  it('should exist', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl);

    expect(buttonSetAPI).toBeTruthy();
  });

  it('can have buttons', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl, standardButtonsDef);

    expect(Array.isArray(buttonSetAPI.buttons)).toBeTruthy();
    expect(buttonSetAPI.buttons.length).toEqual(5);
  });

  it('can disable/enable an entire button row', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl, standardButtonsDef);

    // Disable
    buttonSetAPI.disabled = true;
    let enabledButtons = buttonSetAPI.buttons.filter(buttonAPI => buttonAPI.disabled === false);

    expect(buttonSetAPI.element.classList.contains('is-disabled')).toBeTruthy();
    expect(enabledButtons.length).toEqual(0);

    // Enable
    buttonSetAPI.disabled = false;
    enabledButtons = buttonSetAPI.buttons.filter(buttonAPI => buttonAPI.disabled === false);

    expect(buttonSetAPI.element.classList.contains('is-disabled')).toBeFalsy();
    expect(enabledButtons.length).toEqual(5);
  });

  it('can access a button in the buttonset by using its index', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl, standardButtonsDef);
    const thirdBtnAPI = buttonSetAPI.at(2);

    // Detect propagated settings
    expect(thirdBtnAPI).toBeTruthy();
    expect(thirdBtnAPI.settings).toBeTruthy();
    expect(thirdBtnAPI.settings.icon).toEqual('icon-settings');
    expect(thirdBtnAPI.settings.style).toEqual('btn-secondary');

    // Detect settings passed to element
    const thirdBtnEl = thirdBtnAPI.element[0];
    const icon = thirdBtnAPI.icon;

    expect(thirdBtnEl.id).toEqual('btn-2');
    expect(thirdBtnEl.classList.contains('btn-secondary')).toBeTruthy();
    expect(icon instanceof SVGElement).toBeTruthy();
    expect(icon.querySelector('use').getAttribute('href')).toBe('#icon-settings');

    // Disable just this button and check the buttonset status
    thirdBtnAPI.disabled = true;
    const enabledButtons = buttonSetAPI.buttons.filter(buttonAPI => buttonAPI.disabled === false);

    expect(thirdBtnEl.disabled).toBeTruthy();
    expect(enabledButtons.length).toEqual(4);
  });

  it('can add buttons', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl, standaloneButtonDef);

    expect(Array.isArray(buttonSetAPI.buttons)).toBeTruthy();
    expect(buttonSetAPI.buttons.length).toEqual(1);

    buttonSetAPI.add({
      id: 'my-button-2',
      text: 'My Other Button',
      icon: 'icon-mail',
      style: 'btn-primary'
    });

    expect(buttonSetAPI.buttons.length).toEqual(2);

    const secondBtn = buttonSetAPI.at(1);

    expect(secondBtn).toBeTruthy();
    expect(secondBtn.element[0].id).toEqual('my-button-2');
    expect(secondBtn.element[0].classList.contains('btn-primary')).toBeTruthy();
  });

  it('can remove buttons by ID', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl, standaloneButtonDef);
    buttonSetAPI.remove('my-button-1');

    expect(Array.isArray(buttonSetAPI.buttons)).toBeTruthy();
    expect(buttonSetAPI.buttons.length).toEqual(0);
  });

  it('can remove buttons by API reference', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl, standaloneButtonDef);
    const firstBtn = buttonSetAPI.at(0);
    buttonSetAPI.remove(firstBtn);

    expect(Array.isArray(buttonSetAPI.buttons)).toBeTruthy();
    expect(buttonSetAPI.buttons.length).toEqual(0);
  });

  it('can remove buttons by using their HTMLElement', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl, standaloneButtonDef);
    const firstBtn = buttonSetAPI.at(0);
    buttonSetAPI.remove(firstBtn.element[0]);

    expect(Array.isArray(buttonSetAPI.buttons)).toBeTruthy();
    expect(buttonSetAPI.buttons.length).toEqual(0);
  });

  it('can reset and remove all buttons at once', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl, standardButtonsDef);

    expect(buttonSetAPI.buttons.length).toEqual(5);

    buttonSetAPI.removeAll();

    expect(buttonSetAPI.buttons.length).toEqual(0);

    // By default, the ButtonSet component will leave buttons in the DOM when removing them.
    // eslint-disable-next-line
    const buttonElems = Array.from(buttonSetAPI.element.querySelectorAll('button'));

    expect(buttonElems.length).toEqual(5);
  });

  it('can reset and remove all buttons at once, also removing their DOM elements', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl, standardButtonsDef);

    expect(buttonSetAPI.buttons.length).toEqual(5);

    buttonSetAPI.removeAll(true);
    // eslint-disable-next-line
    const buttonElems = Array.from(buttonSetAPI.element.querySelectorAll('button'));

    expect(buttonSetAPI.buttons.length).toEqual(0);
    expect(buttonElems.length).toEqual(0);
  });

  it('can be updated without tearing down existing button components', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl, standardButtonsDef);
    const newSettings = {
      style: 'modal'
    };

    buttonSetAPI.updated(newSettings);

    expect(buttonSetAPI.buttons.length).toEqual(5);
    expect(buttonSetAPI.element.classList.contains('modal-buttonset')).toBeTruthy();
  });

  it('can be updated with alternate buttons, tearing down the existing button components', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl, standardButtonsDef);
    const newSettings = extend({}, standaloneButtonDef, {
      style: 'modal'
    });

    buttonSetAPI.updated(newSettings);

    expect(buttonSetAPI.buttons.length).toEqual(1);
    expect(buttonSetAPI.element.classList.contains('modal-buttonset')).toBeTruthy();
  });
});
