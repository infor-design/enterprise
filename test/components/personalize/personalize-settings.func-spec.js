import { Personalize } from '../../../src/components/personalize/personalize';

const personalizeHTML = require('../../../app/views/components/personalize/test-state.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let personalizeEl;
let svgEl;
let personalizeObj;
const personalizeId = '#personalize';

describe('Personalize settings', () => {
  beforeEach(() => {
    personalizeEl = null;
    svgEl = null;
    personalizeObj = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', personalizeHTML);

    personalizeEl = document.body.querySelector(personalizeId);
    svgEl = document.body.querySelector('.svg-icons');
    personalizeObj = new Personalize(personalizeEl);
  });

  afterEach(() => {
    personalizeObj.destroy();
    personalizeEl.parentNode.removeChild(personalizeEl);
    svgEl.parentNode.removeChild(svgEl);
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
