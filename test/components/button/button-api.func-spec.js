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
    cleanup(['.fontpicker', '.svg-icons', '.modal', '.row', '.modal-page-container', '.popupmenu-wrapper', '.popupmenu']);
  });

  it('Should be defined on jQuery object', () => {
    expect(buttonAPI).toEqual(jasmine.any(Object));
  });

  it('Should destroy button', (done) => {
    const spyEvent = spyOnEvent(buttonEl, 'click.button');
    buttonAPI.destroy();
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

    expect(buttonAPI.settings).toEqual(settings);
  });

  it('Should update settings via parameter', () => {
    const settings = {
      replaceText: true,
      toggleOffIcon: null,
      toggleOnIcon: null,
      hideMenuArrow: null
    };
    buttonAPI.updated(settings);

    expect(buttonAPI.settings.replaceText).toEqual(settings.replaceText);
  });

  it('Should update menu icon setting via parameter', () => {
    const settings = {
      replaceText: false,
      toggleOffIcon: null,
      toggleOnIcon: null,
      hideMenuArrow: true
    };
    buttonAPI.updated(settings);

    expect(buttonAPI.settings.hideMenuArrow).toEqual(settings.hideMenuArrow);
  });

  it('Should remove menu icon if hideMenuArrow set to true', () => {
    buttonAPI.updated({ hideMenuArrow: true });

    expect(document.body.querySelector('.icon-dropdown')).toBeFalsy();
  });
});
