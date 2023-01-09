import { PopupMenu } from '../../../src/components/popupmenu/popupmenu';
import { cleanup } from '../../helpers/func-utils';

const popupmenuSelectableHTML = require('../../../app/views/components/popupmenu/example-selectable.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let popupmenuButtonEl;
let popupmenuObj;

describe('Popupmenu Events', () => {
  beforeEach(() => {
    popupmenuButtonEl = null;
    popupmenuObj = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', popupmenuSelectableHTML);
    popupmenuButtonEl = document.body.querySelector('#single-select-popupmenu-trigger');
    popupmenuObj = new PopupMenu(popupmenuButtonEl);
  });

  afterEach(() => {
    popupmenuObj.destroy();
    cleanup();
  });

  it('Should trigger "beforeopen" event', () => {
    const spyEvent = spyOnEvent('#single-select-popupmenu-trigger', 'beforeopen');
    popupmenuObj.open();

    expect(spyEvent).toHaveBeenCalled();
  });

  it('Should trigger "open" event', (done) => {
    const spyEvent = spyOnEvent('#single-select-popupmenu-trigger', 'open');
    popupmenuObj.open();
    setTimeout(() => {
      expect(spyEvent).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('Should trigger "afteropen" event', (done) => {
    const spyEvent = spyOnEvent('#single-select-popupmenu-trigger', 'afteropen');
    popupmenuObj.open();
    setTimeout(() => {
      expect(spyEvent).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('Should trigger "close" event', (done) => {
    const spyEvent = spyOnEvent('#single-select-popupmenu-trigger', 'close');
    popupmenuObj.open();
    popupmenuObj.close();
    setTimeout(() => {
      expect(spyEvent).toHaveBeenCalled();
      done();
    }, 600);
  });

  it('Should not bubble "destroy" event', () => {
    const spyEvent = spyOnEvent('.field', 'destroy');
    popupmenuObj.destroy();

    expect(spyEvent).not.toHaveBeenCalled();
  });
});
