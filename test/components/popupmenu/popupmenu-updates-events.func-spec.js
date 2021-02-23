import { PopupMenu } from '../../../src/components/popupmenu/popupmenu';

const popupmenuSelectableHTML = require('../../../app/views/components/popupmenu/example-selectable.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let popupmenuButtonEl;
let svgEl;
let popupmenuObj;

describe('Popupmenu Events', () => {
  beforeEach(() => {
    popupmenuButtonEl = null;
    svgEl = null;
    popupmenuObj = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', popupmenuSelectableHTML);
    popupmenuButtonEl = document.body.querySelector('#single-select-popupmenu-trigger');
    svgEl = document.body.querySelector('.svg-icons');
    popupmenuObj = new PopupMenu(popupmenuButtonEl);
  });

  afterEach(() => {
    popupmenuObj.destroy();
    popupmenuButtonEl.parentNode.removeChild(popupmenuButtonEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should trigger "beforeopen" event', () => {
    const spyEvent = spyOnEvent('#single-select-popupmenu-trigger', 'beforeopen');
    popupmenuObj.open();

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Should trigger "open" event', (done) => {
    const spyEvent = spyOnEvent('#single-select-popupmenu-trigger', 'open');
    popupmenuObj.open();
    setTimeout(() => {
      expect(spyEvent).toHaveBeenTriggered();
      done();
    }, 500);
  });

  it('Should trigger "afteropen" event', (done) => {
    const spyEvent = spyOnEvent('#single-select-popupmenu-trigger', 'afteropen');
    popupmenuObj.open();
    setTimeout(() => {
      expect(spyEvent).toHaveBeenTriggered();
      done();
    }, 500);
  });

  it('Should trigger "close" event', (done) => {
    const spyEvent = spyOnEvent('#single-select-popupmenu-trigger', 'close');
    popupmenuObj.open();
    popupmenuObj.close();
    setTimeout(() => {
      expect(spyEvent).toHaveBeenTriggered();
      done();
    }, 600);
  });

  it('Should not bubble "destroy" event', () => {
    const spyEvent = spyOnEvent('.field', 'destroy');
    popupmenuObj.destroy();

    expect(spyEvent).not.toHaveBeenTriggered();
  });
});
