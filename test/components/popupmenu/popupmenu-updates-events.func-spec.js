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
    const callback = jest.fn();
    $('#single-select-popupmenu-trigger').on('beforeopen', callback);
    popupmenuObj.open();

    expect(callback).toHaveBeenCalled();
  });

  it('Should trigger "open" event', (done) => {
    const callback = jest.fn();
    $('#single-select-popupmenu-trigger').on('open', callback);
    popupmenuObj.open();
    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('Should trigger "afteropen" event', (done) => {
    const callback = jest.fn();
    $('#single-select-popupmenu-trigger').on('afteropen', callback);
    popupmenuObj.open();
    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('Should trigger "close" event', (done) => {
    const callback = jest.fn();
    $('#single-select-popupmenu-trigger').on('close', callback);
    popupmenuObj.open();
    popupmenuObj.close();
    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      done();
    }, 600);
  });

  it('Should not bubble "destroy" event', () => {
    const callback = jest.fn();
    $('.field').on('destroy', callback);
    popupmenuObj.destroy();

    expect(callback).not.toHaveBeenCalled();
  });
});
