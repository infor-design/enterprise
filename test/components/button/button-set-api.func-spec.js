import { ButtonSet } from '../../../src/components/button/button.set';
import { cleanup } from '../../helpers/func-utils';

const svg = require('../../../src/components/icons/svg.html');

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
      icon: 'icon-settings'
    },
    {
      id: 'btn-4',
      style: 'btn-destructive',
      text: 'Button 4'
    }
  ]
};

describe('ButtonSet API', () => {
  beforeEach(() => {
    buttonSetEl = null;
    buttonSetAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    buttonSetEl = document.createElement('div');
    document.body.appendChild(buttonSetEl);
  });

  afterEach(() => {
    if (buttonSetAPI) {
      buttonSetAPI.destroy();
    }
    cleanup([
      'button',
      '.buttonset',
      '.modal-buttonset',
      '.icon-dropdown',
      '.svg-icons',
      '.row',
      '.popupmenu-wrapper',
      '.popupmenu'
    ]);
  });

  it('should exist', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl);

    expect(buttonSetAPI).toEqual(jasmine.any(Object));
  });

  it('can have buttons', () => {
    buttonSetAPI = new ButtonSet(buttonSetEl, standardButtonsDef);

    expect(Array.isArray(buttonSetAPI.buttons)).toBeDefined();
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
    expect(thirdBtnAPI).toEqual(jasmine.any(Object));
    expect(thirdBtnAPI.settings).toEqual(jasmine.any(Object));
    expect(thirdBtnAPI.settings.text).toEqual('Button 2');
    expect(thirdBtnAPI.settings.icon).toEqual('icon-settings');
    expect(thirdBtnAPI.settings.style).toEqual('btn-secondary');

    // Detect settings passed to element
    const thirdBtnEl = thirdBtnAPI.element[0];
    const icon = thirdBtnAPI.icon;

    expect(thirdBtnEl.id).toEqual('btn-2');
    expect(thirdBtnEl.classList.contains('btn-secondary')).toBeTruthy();
    expect(thirdBtnEl.innerText).toEqual('Button 2');
    expect(icon instanceof SVGElement).toBeTruthy();
    expect(icon.querySelector('use').getAttribute('xlink:href')).toBe('#icon-settings');
  });
});
