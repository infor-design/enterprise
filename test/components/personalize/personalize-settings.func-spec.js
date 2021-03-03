import { Personalize } from '../../../src/components/personalize/personalize';
import { cleanup } from '../../helpers/func-utils';

const personalizeHTML = require('../../../app/views/components/personalize/test-state.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let personalizeEl;
let personalizeObj;
const personalizeId = '#personalize';

describe('Personalize settings', () => {
  beforeEach(() => {
    personalizeEl = null;
    personalizeObj = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', personalizeHTML);

    personalizeEl = document.body.querySelector(personalizeId);
    personalizeObj = new Personalize(personalizeEl);
  });

  afterEach(() => {
    personalizeObj.destroy();
    cleanup();
  });

  it('Should set colors', () => {
    const colors = {
      header: '#F2F2F2',
      subheader: '#700000',
      text: '#000000',
      verticalBorder: '#D3D3D3',
      horizontalBorder: '#D3D3D3',
      inactive: '#CCCCCC',
      hover: '#CCCCCC'
    };

    personalizeObj.settings.colors = {
      header: '#F2F2F2',
      subheader: '#700000',
      text: '#000000',
      verticalBorder: '#D3D3D3',
      horizontalBorder: '#D3D3D3',
      inactive: '#CCCCCC',
      hover: '#CCCCCC'
    };

    expect(personalizeObj.settings.colors).toEqual(colors);
  });
});
