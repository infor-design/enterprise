import { Button } from '../../../src/components/button/button';

const buttonHTML = require('../../../app/views/components/button/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

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

  it('Should destroy button', (done) => {
    const spyEvent = spyOnEvent(buttonEl, 'click.button');
    buttonObj.destroy();
    buttonEl.click();
    setTimeout(() => {
      expect(spyEvent).not.toHaveBeenTriggered();
      done();
    }, 500);

    expect($(buttonEl).data('button')).toBeFalsy();
  });

  it('Should set settings', () => {
    const settings = {
      replaceText: false,
      toggleOffIcon: null,
      toggleOnIcon: null,
      hideMenuArrow: null
    };

    expect(buttonObj.settings).toEqual(settings);
  });

  it('Should update settings via parameter', () => {
    const settings = {
      replaceText: true,
      toggleOffIcon: null,
      toggleOnIcon: null,
      hideMenuArrow: null
    };

    buttonObj.init();
    buttonObj.updated(settings);

    expect(buttonObj.settings.replaceText).toEqual(settings.replaceText);
  });

  it('Should update menu icon setting via parameter', () => {
    const settings = {
      replaceText: false,
      toggleOffIcon: null,
      toggleOnIcon: null,
      hideMenuArrow: true
    };

    buttonObj.init();
    buttonObj.updated(settings);

    expect(buttonObj.settings.hideMenuArrow).toEqual(settings.hideMenuArrow);
  });

  it('Should remove menu icon if hideMenuArrow set to true', () => {
    buttonObj.init();
    buttonObj.updated({ hideMenuArrow: true });

    expect(document.body.querySelector('.icon-dropdown')).toBeFalsy();
  });
});
