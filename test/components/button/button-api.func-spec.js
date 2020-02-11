import { Button } from '../../../src/components/button/button';
import { cleanup } from '../../helpers/func-utils';

const buttonHTML = require('../../../app/views/components/button/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let buttonEl;
let buttonAPI;

describe('Button API', () => {
  beforeEach(() => {
    buttonEl = null;
    buttonAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', buttonHTML);
    buttonEl = document.body.querySelector('.btn');
    buttonEl.classList.add('no-init');
    buttonAPI = new Button(buttonEl);
  });

  afterEach(() => {
    if (buttonAPI) {
      buttonAPI.destroy();
    }
    cleanup([
      'button',
      '.icon-dropdown',
      '.svg-icons',
      '.row',
      '.popupmenu-wrapper',
      '.popupmenu'
    ]);
  });

  it('Should be defined on jQuery object', () => {
    expect(buttonAPI).toEqual(jasmine.any(Object));
  });

  it('can be destroyed', (done) => {
    const spyEvent = spyOnEvent(buttonEl, 'click.button');
    buttonAPI.destroy();
    buttonEl.click();
    setTimeout(() => {
      expect(spyEvent).not.toHaveBeenTriggered();
      done();
    }, 500);

    expect($(buttonEl).data('button')).toBeFalsy();
  });

  it('has default settings', () => {
    const settings = {
      replaceText: false,
      toggleOffIcon: null,
      toggleOnIcon: null,
      hideMenuArrow: null
    };

    expect(buttonAPI.settings).toEqual(settings);
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
});
