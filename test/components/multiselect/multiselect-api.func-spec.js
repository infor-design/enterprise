import { MultiSelect } from '../../../src/components/multiselect/multiselect';
import { cleanup } from '../../helpers/func-utils';

const multiSelectHTML = require('../../../app/views/components/multiselect/_samples-standard.html');
const svg = require('../../../src/components/icons/svg.html');

let multiSelectEl;
let multiSelectObj;

describe('MultiSelect API', () => {
  beforeEach(() => {
    multiSelectEl = null;
    multiSelectObj = null;
    document.body.insertAdjacentHTML('afterbegin', multiSelectHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    multiSelectEl = document.body.querySelector('.multiselect');
    multiSelectEl.classList.add('no-init');
    multiSelectObj = new MultiSelect(multiSelectEl);
  });

  afterEach(() => {
    multiSelectObj.destroy();
    cleanup(['.multiselect', '.dropdown', '.svg-icons', '#dropdown-list', '.field', '.row', 'select']);
  });

  it('Should be defined on jQuery object', () => {
    expect(multiSelectObj).toEqual(jasmine.any(Object));
  });

  it('Should be build multiSelect correctly', () => {
    expect(multiSelectObj.element[0].multiple).toBeTruthy();
  });

  it('Should disable multiselect', () => {
    multiSelectObj.disable();
  });

  it('Should enable multiselect', () => {
    multiSelectObj.enable();
  });
});
