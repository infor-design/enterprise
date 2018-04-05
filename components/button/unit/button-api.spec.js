import { Button } from '../button';

const buttonHTML = require('../example-index.html');
const svg = require('../../icons/svg.html');

let buttonEl;
let svgEl;
let buttonObj;

describe('Button API', () => {
  beforeEach(() => {
    buttonEl = null;
    svgEl = null;
    buttonObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', buttonHTML);
    buttonEl = document.body.querySelector('.btn');
    svgEl = document.body.querySelector('.svg-icons');
    buttonEl.classList.add('no-init');
    buttonObj = new Button(buttonEl);
  });

  afterEach(() => {
    buttonObj.destroy();
    buttonEl.parentNode.removeChild(buttonEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should be defined on jQuery object', () => {
    expect(buttonObj).toEqual(jasmine.any(Object));
  });

  it('Should destroy button, and deactivate click event', () => {
    $('.btn.no-init').on('click.button', () => {
      expect(true).toBe(true);
    });

    $('.btn.no-init').click();

    $('.btn.no-init').on('click.button', () => {
      // Should fail, click should not trigger
      expect(false).toBe(true);
    });

    buttonObj.destroy();
    $('.btn.no-init').click();
  });

  it('Should set settings', () => {
    const settings = {
      replaceText: false,
      toggleOffIcon: null,
      toggleOnIcon: null
    };

    expect(buttonObj.settings).toEqual(settings);
  });

  it('Should update settings via parameter', () => {
    const settings = {
      replaceText: true,
      toggleOffIcon: null,
      toggleOnIcon: null
    };

    buttonObj.init();
    buttonObj.updated(settings);

    expect(buttonObj.settings.replaceText).toEqual(settings.replaceText);
  });
});
